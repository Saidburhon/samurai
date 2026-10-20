// qilich.com Worker. Static assets are served by the assets binding; only /api/* runs this code first
// (wrangler.json: assets.run_worker_first). POST /api/samurai is SamurAI, the solutions advisor.
//
// ---- POST /api/samurai ------------------------------------------------------------------------------------------
// Request: JSON, at most 4 KB (UTF-8 bytes), same origin (Origin: https://qilich.com; also any http://localhost or
// http://127.0.0.1 origin when the Worker runs under `wrangler dev`).
//   { "lang": "uz" | "ru" | "en",            page language (default "uz"); SamurAI answers in the visitor's language
//     "message": "…",                         the visitor's text, 1-1500 characters
//     "history": [{ "role": "user" | "assistant", "content": "…" }] }   optional, the last 6 entries are used.
//   For "assistant" entries send back `result.memo` from the previous answer (a short summary), not the whole result.
//   The page trims the oldest entries until the body fits in 4 KB.
// Errors before streaming: JSON { "error": { "code", "message" } } with status 400 bad_json | empty | too_long,
//   403 forbidden_origin, 405 method_not_allowed, 413 too_large, 415 not_json, 429 rate_limited (Retry-After),
//   502 upstream_error, 503 busy | unavailable, 504 timeout. "message" is in the request's language.
// Success: text/event-stream with these events (each `data:` is JSON):
//   start     { lang }
//   status    { phase: "thinking" | "writing" }
//   delta     { text }          raw fragments of the answer JSON (concatenate; a tolerant parser can render early)
//   solution  { index, title, why, includes, note, billing, catalogue, weeks, price, running, ready }
//             one validated, enriched solution as soon as it is complete
//   result    the whole validated, enriched answer: { kind: "proposal" | "clarify" | "decline", lang, greeting,
//             understanding, solutions[], total, questions[], not_included, next_step, approximate, disclaimer,
//             contact, rate, today, memo }. Authoritative: it replaces whatever was rendered from deltas.
//   error     { code: "refused" | "incomplete" | "invalid_output" | "busy" | "unavailable" | "timeout" |
//             "upstream_error" | "internal", message }   (the stream ends after it)
// Prices: `price.usd` / `price.uzs` {min, max} and `price.label` ("taxminan 36–72 mln soʻm ($3 000–6 000)");
// soʻm come from the day's CBU rate (`result.rate`), rounded as the briefing says. `ready` {from, to, label} adds
// the 1-2 week start (and a 1-2 week discovery above about $30k) to the weeks.
//
// Effort: "low" was chosen after measuring "low" and "medium" on the same test businesses (restaurant chain, clinic,
// logistics startup). Both followed the format and the rules; "low" answered about twice as fast with fewer output
// tokens, and "medium" did not give better-founded advice for this one-shot advisory task. Change EFFORT in
// samurai.js to revisit.
// -----------------------------------------------------------------------------------------------------------------
import Anthropic from '@anthropic-ai/sdk';
import { partialParse } from '@anthropic-ai/sdk/_vendor/partial-json-parser/parser.mjs';
import { getRate } from './rate.js';
import { EFFORT, LANGS, MODEL, buildParams, enrichSolution, finalize, tashkentToday } from './samurai.js';

const MAX_BODY_BYTES = 4096;
const MAX_TEXT_CHARS = 1500;
const MAX_HISTORY = 6;
const WINDOW = { requests: 10, seconds: 600 }; // per IP, 10 requests per 10 minutes (Cache API, per data centre)
const PROD_ORIGIN = 'https://qilich.com';
const API_TIMEOUT_MS = 120_000;
const PING_MS = 15_000;

const ERR = {
  bad_json: ['Soʻrovni oʻqib boʻlmadi.', 'Не удалось прочитать запрос.', 'The request could not be read.'],
  empty: ['Biznesingiz haqida bir-ikki gap yozing.', 'Напишите пару предложений о вашем бизнесе.', 'Write a sentence or two about your business.'],
  too_long: ['Matn juda uzun: 1 500 belgigacha yozing.', 'Слишком длинный текст: до 1 500 символов.', 'The text is too long: up to 1,500 characters.'],
  forbidden_origin: ['Bu sahifadan soʻrov qabul qilinmaydi.', 'Запросы с этой страницы не принимаются.', 'Requests from this page are not accepted.'],
  method_not_allowed: ['Faqat POST soʻrovi qabul qilinadi.', 'Принимается только POST-запрос.', 'Only POST requests are accepted.'],
  too_large: ['Soʻrov juda katta.', 'Запрос слишком большой.', 'The request is too large.'],
  not_json: ['Soʻrov JSON koʻrinishida boʻlishi kerak.', 'Запрос должен быть в формате JSON.', 'The request must be JSON.'],
  rate_limited: [
    'Soʻrovlar juda koʻp. Birozdan keyin qayta urinib koʻring.',
    'Слишком много запросов. Попробуйте чуть позже.',
    'Too many requests. Please try again a little later.',
  ],
  busy: [
    'SamurAI hozir band. Bir daqiqadan keyin qayta urinib koʻring.',
    'SamurAI сейчас занят. Попробуйте через минуту.',
    'SamurAI is busy right now. Please try again in a minute.',
  ],
  unavailable: [
    'SamurAI hozir ishlamayapti. Bizga yozing yoki qoʻngʻiroq qiling: +998 97 270 70 07, inbox@qilich.com.',
    'SamurAI сейчас недоступен. Напишите или позвоните нам: +998 97 270 70 07, inbox@qilich.com.',
    'SamurAI is unavailable right now. Write or call us: +998 97 270 70 07, inbox@qilich.com.',
  ],
  timeout: [
    'Javob kechikdi. Qayta urinib koʻring.',
    'Ответ задержался. Попробуйте ещё раз.',
    'The answer took too long. Please try again.',
  ],
  refused: [
    'Bu soʻrovga SamurAI javob bera olmaydi. Biznesingiz haqida yozing yoki jamoamiz bilan bogʻlaning: +998 97 270 70 07, inbox@qilich.com.',
    'На этот запрос SamurAI ответить не может. Расскажите о вашем бизнесе или свяжитесь с командой: +998 97 270 70 07, inbox@qilich.com.',
    'SamurAI cannot answer this request. Tell it about your business, or contact the team: +998 97 270 70 07, inbox@qilich.com.',
  ],
  incomplete: [
    'Javob toʻliq kelmadi. Qayta urinib koʻring.',
    'Ответ пришёл не полностью. Попробуйте ещё раз.',
    'The answer came back incomplete. Please try again.',
  ],
  invalid_output: [
    'Javobni oʻqib boʻlmadi. Qayta urinib koʻring.',
    'Не удалось прочитать ответ. Попробуйте ещё раз.',
    'The answer could not be read. Please try again.',
  ],
  upstream_error: [
    'Xatolik yuz berdi. Qayta urinib koʻring yoki bizga yozing: inbox@qilich.com.',
    'Произошла ошибка. Попробуйте ещё раз или напишите нам: inbox@qilich.com.',
    'Something went wrong. Please try again or write to us: inbox@qilich.com.',
  ],
  not_found: ['Topilmadi.', 'Не найдено.', 'Not found.'],
};
ERR.internal = ERR.upstream_error;
const say = (code, lang) => (ERR[code] || ERR.internal)[Math.max(LANGS.indexOf(lang), 0)];

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
function jsonError(status, code, lang, extra = {}) {
  return new Response(JSON.stringify({ error: { code, message: say(code, lang) } }), {
    status,
    headers: { ...JSON_HEADERS, ...extra },
  });
}

const isLocalHost = (h) => h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || h.endsWith('.localhost');

// `wrangler dev` rewrites the URL to the route's host (qilich.com) but the client address stays loopback, which the
// Cloudflare edge never sets for a real visitor. SAMURAI_DEV=1 (e.g. in .dev.vars) forces it.
function isDev(request, url, env) {
  const ip = request.headers.get('CF-Connecting-IP') || '';
  return env.SAMURAI_DEV === '1' || isLocalHost(url.hostname) || ip === '127.0.0.1' || ip === '::1';
}

function originAllowed(request, dev) {
  const origin = request.headers.get('Origin');
  if (!origin) return false;
  if (origin === PROD_ORIGIN) return true;
  if (!dev) return false; // localhost pages only reach a Worker that runs locally
  try {
    const o = new URL(origin);
    return o.protocol === 'http:' && isLocalHost(o.hostname);
  } catch {
    return false;
  }
}

// the page language from the Referer (/ru/…, /en/…), for errors raised before the body is read
function refererLang(request) {
  try {
    const p = new URL(request.headers.get('Referer') || '').pathname;
    return p.startsWith('/ru/') ? 'ru' : p.startsWith('/en/') ? 'en' : 'uz';
  } catch {
    return 'uz';
  }
}

async function readCapped(request, max) {
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      reader.cancel().catch(() => {});
      return null;
    }
    chunks.push(value);
  }
  const all = new Uint8Array(size);
  let at = 0;
  for (const c of chunks) {
    all.set(c, at);
    at += c.byteLength;
  }
  return new TextDecoder().decode(all);
}

const CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;
const chars = (s) => [...s].length;

/** Validates the body. Returns { lang, message, history } or { error: code }. */
function parseInput(body) {
  const lang = LANGS.includes(body?.lang) ? body.lang : 'uz';
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { lang, error: 'bad_json' };
  if (typeof body.message !== 'string') return { lang, error: 'empty' };
  const message = body.message.replace(CONTROL, '').trim();
  if (!message) return { lang, error: 'empty' };
  if (chars(message) > MAX_TEXT_CHARS) return { lang, error: 'too_long' };
  const history = (Array.isArray(body.history) ? body.history : [])
    .filter((h) => h && (h.role === 'user' || h.role === 'assistant') && typeof h.content === 'string')
    .map((h) => ({ role: h.role, content: h.content.replace(CONTROL, '').trim() }))
    .filter((h) => h.content)
    .slice(-MAX_HISTORY);
  if (history.some((h) => chars(h.content) > MAX_TEXT_CHARS)) return { lang, error: 'too_long' };
  return { lang, message, history };
}

/** Per-IP limits: the rate-limiting binding (burst), then a 10-minute window kept in the Cache API. */
async function rateLimit(env, ctx, ip) {
  if (typeof env.SAMURAI_LIMITER?.limit === 'function') {
    try {
      const { success } = await env.SAMURAI_LIMITER.limit({ key: ip });
      if (!success) return 60;
    } catch {
      // binding misconfigured or unavailable: fall through to the window
    }
  }
  const cache = globalThis.caches?.default;
  if (!cache) return 0;
  const now = Date.now() / 1000;
  const slot = Math.floor(now / WINDOW.seconds);
  const key = `https://qilich.com/__samurai/rl/${slot}/${encodeURIComponent(ip)}`;
  try {
    const hit = await cache.match(key);
    const n = hit ? Number(await hit.text()) || 0 : 0;
    if (n >= WINDOW.requests) return Math.max(Math.ceil((slot + 1) * WINDOW.seconds - now), 1);
    const put = cache.put(key, new Response(String(n + 1), { headers: { 'Cache-Control': `max-age=${WINDOW.seconds}` } }));
    ctx.waitUntil(put.catch(() => {}));
  } catch {
    // the Cache API is optional
  }
  return 0;
}

/** Maps an SDK error to [code, status], or null when the visitor went away. */
function mapError(err) {
  if (err instanceof Anthropic.APIUserAbortError) return null;
  if (err instanceof Anthropic.APIConnectionTimeoutError) return ['timeout', 504];
  if (err instanceof Anthropic.APIConnectionError) return ['unavailable', 503];
  if (err instanceof Anthropic.RateLimitError) return ['busy', 503];
  if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) return ['unavailable', 503];
  if (err instanceof Anthropic.BadRequestError) return ['upstream_error', 502];
  if (err instanceof Anthropic.InternalServerError) return ['busy', 503]; // 500, 529 overloaded
  if (err instanceof Anthropic.APIError) return ['upstream_error', 502];
  return ['internal', 500];
}

function logError(where, err) {
  console.error(
    JSON.stringify({
      samurai_error: where,
      name: err?.name,
      status: err?.status,
      type: err?.error?.error?.type,
      message: String(err?.message || '').slice(0, 300),
    }),
  );
}

/** With max_tokens, keep the solutions that were finished. */
function salvage(text) {
  try {
    const obj = partialParse(text);
    if (!obj || typeof obj !== 'object' || !Array.isArray(obj.solutions)) return null;
    if (!('total' in obj)) obj.solutions = obj.solutions.slice(0, -1);
    return obj.solutions.length ? obj : null;
  } catch {
    return null;
  }
}

async function samurai(request, env, ctx, url) {
  let lang = refererLang(request);
  if (request.method !== 'POST') return jsonError(405, 'method_not_allowed', lang, { Allow: 'POST' });
  const dev = isDev(request, url, env);
  if (!originAllowed(request, dev)) return jsonError(403, 'forbidden_origin', lang);
  if (!/^application\/json\b/i.test(request.headers.get('Content-Type') || '')) return jsonError(415, 'not_json', lang);
  if (Number(request.headers.get('Content-Length') || 0) > MAX_BODY_BYTES) return jsonError(413, 'too_large', lang);

  const raw = await readCapped(request, MAX_BODY_BYTES);
  if (raw === null) return jsonError(413, 'too_large', lang);
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return jsonError(400, 'bad_json', lang);
  }
  const input = parseInput(body);
  lang = input.lang;
  if (input.error) return jsonError(400, input.error, lang);

  const ip = request.headers.get('CF-Connecting-IP') || 'local';
  const retry = await rateLimit(env, ctx, ip);
  if (retry) return jsonError(429, 'rate_limited', lang, { 'Retry-After': String(retry) });

  if (!env.ANTHROPIC_API_KEY) {
    console.error(JSON.stringify({ samurai_error: 'config', message: 'ANTHROPIC_API_KEY is not set' }));
    return jsonError(503, 'unavailable', lang);
  }

  const today = tashkentToday();
  const ratePromise = getRate(ctx);
  let rate = null;
  ratePromise.then((r) => (rate = r));
  // dev only: measure other effort levels without redeploying
  const effort = dev && ['low', 'medium', 'high'].includes(body.effort) ? body.effort : EFFORT;
  const params = buildParams({ lang, today, history: input.history, message: input.message, effort });

  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: API_TIMEOUT_MS });
  const t0 = Date.now();
  const stream = client.beta.messages.stream(params);

  // The SSE response. Events are queued on the writer from the moment the stream connects.
  const enc = new TextEncoder();
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  let gone = false;
  const write = (chunk) => {
    if (gone) return;
    writer.write(enc.encode(chunk)).catch(() => {
      gone = true; // the visitor closed the page: stop generating
      stream.abort();
    });
  };
  const send = (event, data) => write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

  let text = '';
  let firstText = 0;
  let phase = '';
  let emitted = 0;
  let lastParse = 0;
  const emitSolutions = (final) => {
    if (!rate) return;
    const now = Date.now();
    if (!final && now - lastParse < 120) return;
    lastParse = now;
    let obj;
    try {
      obj = partialParse(text);
    } catch {
      return;
    }
    if (!obj || obj.kind !== 'proposal' || !Array.isArray(obj.solutions)) return;
    const ready = 'total' in obj || final ? obj.solutions.length : obj.solutions.length - 1;
    const l = LANGS.includes(obj.lang) ? obj.lang : lang;
    while (emitted < Math.min(ready, 6)) {
      const s = enrichSolution(obj.solutions[emitted], emitted, { lang: l, rate, today });
      if (s.title) send('solution', s);
      emitted++;
    }
  };

  stream.on('streamEvent', (ev) => {
    if (ev.type === 'content_block_start') {
      const t = ev.content_block.type;
      const next = t === 'thinking' || t === 'redacted_thinking' ? 'thinking' : t === 'text' ? 'writing' : '';
      if (next && next !== phase) {
        phase = next;
        send('status', { phase });
      }
    } else if (ev.type === 'content_block_delta' && ev.delta.type === 'text_delta') {
      if (!firstText) firstText = Date.now();
      text += ev.delta.text;
      send('delta', { text: ev.delta.text });
      if (ev.delta.text.includes('}')) emitSolutions(false);
    }
  });

  // Wait for the HTTP response, so that errors before any output come back as clean JSON errors.
  try {
    await stream.withResponse();
  } catch (err) {
    stream.abort();
    const mapped = mapError(err);
    logError('connect', err);
    return jsonError(mapped?.[1] || 500, mapped?.[0] || 'internal', lang);
  }

  send('start', { lang });
  const ping = setInterval(() => write(': ping\n\n'), PING_MS);

  const pump = (async () => {
    let msg = null;
    try {
      msg = await stream.finalMessage();
      rate = await ratePromise;
      const answer = msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
      const fellBack = (msg.usage?.iterations || []).some((e) => e.type === 'fallback_message');
      const usage = {
        input: msg.usage?.input_tokens ?? 0,
        cache_read: msg.usage?.cache_read_input_tokens ?? 0,
        cache_write: msg.usage?.cache_creation_input_tokens ?? 0,
        output: msg.usage?.output_tokens ?? 0,
      };
      const log = {
        ms: Date.now() - t0,
        ttft_ms: firstText ? firstText - t0 : null,
        lang,
        effort,
        model: msg.model,
        fallback: fellBack,
        stop: msg.stop_reason,
        usage,
      };

      if (msg.stop_reason === 'refusal') {
        console.log(JSON.stringify({ samurai: { ...log, category: msg.stop_details?.category ?? null } }));
        send('error', { code: 'refused', message: say('refused', lang) });
        return;
      }
      let parsed = null;
      try {
        parsed = JSON.parse(answer);
      } catch {
        parsed = msg.stop_reason === 'max_tokens' ? salvage(answer) : null;
      }
      if (!parsed) {
        const code = msg.stop_reason === 'max_tokens' ? 'incomplete' : 'invalid_output';
        console.log(JSON.stringify({ samurai: { ...log, error: code } }));
        send('error', { code, message: say(code, lang) });
        return;
      }
      const { result, flags } = finalize(parsed, { lang, rate, today });
      if (msg.stop_reason === 'max_tokens') {
        flags.push('max_tokens');
        result.truncated = true;
      }
      // solutions not yet announced (e.g. the rate arrived late)
      for (const s of result.solutions.slice(emitted)) send('solution', s);
      emitted = result.solutions.length;
      console.log(JSON.stringify({ samurai: { ...log, kind: result.kind, solutions: result.solutions.length, flags } }));
      if (dev) result.meta = { ...log, flags };
      send('result', result);
    } catch (err) {
      const mapped = mapError(err);
      if (mapped) {
        logError('stream', err);
        send('error', { code: mapped[0], message: say(mapped[0], lang) });
      }
    } finally {
      clearInterval(ping);
      writer.close().catch(() => {});
    }
  })();
  ctx.waitUntil(pump);

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store, no-transform',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/samurai' || url.pathname === '/api/samurai/') {
      try {
        return await samurai(request, env, ctx, url);
      } catch (err) {
        logError('handler', err);
        return jsonError(500, 'internal', refererLang(request));
      }
    }
    if (url.pathname.startsWith('/api/')) return jsonError(404, 'not_found', refererLang(request));
    return env.ASSETS.fetch(request);
  },
};
