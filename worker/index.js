// qilich.com Worker. Static assets are served by the assets binding; only /api/* runs this code first
// (wrangler.json: assets.run_worker_first). POST /api/samurai is SamurAI, the solutions advisor.
//
// ---- POST /api/samurai ------------------------------------------------------------------------------------------
// Request: JSON (Content-Type application/json), at most 6 KB (UTF-8 bytes), same origin (Origin: https://qilich.com;
// also any http://localhost or http://127.0.0.1 origin when the Worker runs under `wrangler dev`).
//   { "lang": "uz" | "ru" | "en",            page language (default "uz"); SamurAI answers in the visitor's language
//     "message": "…",                         the visitor's text, 1-1500 characters
//     "turnstile": "…",                       a fresh Cloudflare Turnstile token for every submit (widget with
//                                             data-action="samurai"); required when TURNSTILE_SECRET is set
//     "history": [{ "role": "user", "content": "…" },
//                 { "role": "assistant", "content": result.memo, "sig": result.memo_sig }] }
//   History is optional; the last 6 entries are used. For an assistant entry send back `result.memo` and
//   `result.memo_sig` from the previous answer, unchanged: entries whose signature does not verify are dropped.
//   The page trims the oldest entries until the body fits in 6 KB.
// Errors before streaming: JSON { "error": { "code", "message" } } with status 400 bad_json | empty | too_long,
//   403 forbidden_origin | verification_failed, 405 method_not_allowed, 413 too_large, 415 not_json,
//   429 rate_limited (Retry-After), 502 upstream_error, 503 busy | unavailable | daily_limit (Retry-After),
//   504 timeout. "message" is in the request's language.
// Success: text/event-stream with these events (each `data:` is JSON); a comment line every 5 s keeps it open:
//   start     { lang }
//   status    { phase: "thinking" | "writing" }
//   intro     { kind, lang, greeting, understanding }   once, as soon as both are written (already cleaned)
//   solution  { index, stage, title, why, includes, note, billing, catalogue, weeks, price, running, ready }
//             one validated, enriched solution as soon as it is complete
//   result    the whole validated, enriched answer: { kind: "proposal" | "clarify" | "decline", lang, greeting,
//             understanding, budget, solutions[], first_step, total, questions[], not_included, next_step,
//             approximate, disclaimer, contact, rate, today, memo, memo_sig }. Authoritative: it replaces whatever
//             was rendered from intro and solution events.
//             `stage` is "now" (the first step), "next" (after it) or "later" (a bigger system that would absorb
//             earlier solutions; shown, but not in any total). `first_step` is the "now" project solutions together;
//             `total` is the "now" and "next" ones together (largest at 100%, others at 70-85%), with the model's
//             phasing advice in `total.summary`; monthly services are in neither. Each has `discovery`
//             ({ id, title, weeks, price }) when a paid discovery comes first, else null. `budget` is
//             { amount, currency, usd, label, first_step_fits, total_fits: "yes" | "partly" | "no" } when the
//             visitor named one, else null.
//   error     { code: "refused" | "incomplete" | "invalid_output" | "busy" | "unavailable" | "timeout" |
//             "upstream_error" | "internal", message }   (the stream ends after it)
// Every model-written string is cleaned by the copy guard (samurai.js) and cut to a fixed length before it is sent;
// the page renders all of it as text (textContent), never as HTML, and never sends a message on its own (for example
// one taken from the URL).
// Prices: `price.usd` / `price.uzs` {min, max} and `price.label` ("taxminan 36–72 mln soʻm ($3 000–6 000)");
// soʻm come from the day's CBU rate (`result.rate`), rounded as the briefing says. `ready` {from, to, discovery, label}
// adds the 1-2 week start (and a 1-2 week discovery when it applies) to the weeks; "next" and "later" solutions are
// dated after the first step.
//
// Cost controls, in order: the rate-limiting binding (a burst filter per data centre), Turnstile (no scripts), then
// SamuraiGuard (worker/guard.js), one global Durable Object: a daily spend cap in USD, per-visitor limits (an IPv4
// address or an IPv6 /64) and one answer at a time per visitor. It fails closed. MAX_TOKENS is 6000.
//
// Effort: "low", measured against "medium" on the same three businesses (restaurant chain uz, clinic ru, logistics
// startup en; October 2026). Same structure, the same catalogue items and very close prices and advice at both levels.
// First text after 1.3-1.9 s at low against 13-17 s at medium, the whole answer in 17-34 s against 30-52 s, and
// 1.7-2.3k output tokens against 2.9-3.5k. Low priced 3 of 15 solutions a little under the catalogue minimum;
// finalize() raises those to the minimum. Change EFFORT in samurai.js to revisit.
// -----------------------------------------------------------------------------------------------------------------
import Anthropic from '@anthropic-ai/sdk';
import { partialParse } from '@anthropic-ai/sdk/_vendor/partial-json-parser/parser.mjs';
import { getRate } from './rate.js';
import { EFFORT, LANGS, MAX_SOLUTIONS, MODEL, buildParams, enrichSolution, finalize, firstStepWeeks, introOf, tashkentToday } from './samurai.js';

export { SamuraiGuard } from './guard.js';

const MAX_BODY_BYTES = 6144; // a Turnstile token alone can be 2048 characters
const MAX_TEXT_CHARS = 1500;
const MAX_HISTORY = 6;
const MAX_TOKEN_CHARS = 2048;
const PROD_ORIGIN = 'https://qilich.com';
const PROD_HOST = 'qilich.com';
const API_TIMEOUT_MS = 45_000; // until the response headers arrive; with one retry, at most 90 s
const DEADLINE_MS = 90_000; // the whole answer, headers to the last token
const PING_MS = 5_000; // keeps the connection open through proxies while the model thinks
const TURNSTILE_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const TURNSTILE_ACTION = 'samurai';

const ERR = {
  bad_json: ['Soʻrovni oʻqib boʻlmadi.', 'Не удалось прочитать запрос.', 'The request could not be read.'],
  empty: ['Biznesingiz haqida bir-ikki gap yozing.', 'Напишите пару предложений о вашем бизнесе.', 'Write a sentence or two about your business.'],
  too_long: ['Matn juda uzun: 1 500 belgigacha yozing.', 'Слишком длинный текст: до 1 500 символов.', 'The text is too long: up to 1,500 characters.'],
  forbidden_origin: ['Bu sahifadan soʻrov qabul qilinmaydi.', 'Запросы с этой страницы не принимаются.', 'Requests from this page are not accepted.'],
  verification_failed: [
    'Tekshiruvdan oʻtilmadi. Sahifani yangilab, qayta urinib koʻring.',
    'Проверка не пройдена. Обновите страницу и попробуйте ещё раз.',
    'The check did not pass. Reload the page and try again.',
  ],
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
  daily_limit: [
    'SamurAI bugun juda koʻp savolga javob berdi. Ertaga qayta urinib koʻring yoki bizga yozing yoki qoʻngʻiroq qiling: +998 97 270 70 07, inbox@qilich.com.',
    'SamurAI сегодня ответил на очень много вопросов. Попробуйте завтра или напишите либо позвоните нам: +998 97 270 70 07, inbox@qilich.com.',
    'SamurAI has answered a great many questions today. Try again tomorrow, or write or call us: +998 97 270 70 07, inbox@qilich.com.',
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

// the same security headers public/_headers gives the static pages
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Strict-Transport-Security': 'max-age=31536000',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};
const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...SECURITY_HEADERS };
function jsonError(status, code, lang, extra = {}) {
  return new Response(JSON.stringify({ error: { code, message: say(code, lang) } }), {
    status,
    headers: { ...JSON_HEADERS, ...extra },
  });
}

const isLocalHost = (h) => h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || h.endsWith('.localhost');

// `wrangler dev` rewrites the URL to the route's host (qilich.com) but the client address stays loopback, which the
// Cloudflare edge never sets for a real visitor (it overwrites CF-Connecting-IP). This only opens localhost origins
// and skips Turnstile when no secret is set; the effort override and the `meta` field need SAMURAI_DEV=1 as well.
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

/**
 * The visitor key for limits: an IPv4 address as it is, an IPv6 address cut to its /64 (one household or phone
 * usually holds a whole /64, so the full address would give a fresh key per request).
 */
export function rateKey(ip) {
  if (!ip.includes(':')) return ip;
  if (ip.includes('.')) return ip.slice(ip.lastIndexOf(':') + 1); // IPv4-mapped
  try {
    const [a, b = ''] = ip.toLowerCase().split('::');
    const h = a ? a.split(':') : [];
    const t = b ? b.split(':') : [];
    const all = [...h, ...Array(8 - h.length - t.length).fill('0'), ...t];
    if (all.length !== 8 || !all.every((x) => /^[0-9a-f]{1,4}$/.test(x))) return ip;
    return `${all.slice(0, 4).map((x) => x.padStart(4, '0')).join(':')}::/64`;
  } catch {
    return ip;
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
    .map((h) => ({ role: h.role, raw: h.content, sig: h.sig, content: h.content.replace(CONTROL, '').trim() }))
    .filter((h) => h.content)
    .slice(-MAX_HISTORY);
  if (history.some((h) => chars(h.content) > MAX_TEXT_CHARS)) return { lang, error: 'too_long' };
  return { lang, message, history };
}

// ---- signed memos: the browser carries the summary of an earlier answer, but cannot write one -------------------

const enc = new TextEncoder();
const MEMO_CONTEXT = 'samurai-memo-v1\n';
const b64u = (buf) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
const unb64u = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
let memoKeyCache = null;
let devMemoSecret = null;

/** The HMAC key from SAMURAI_MEMO_KEY; under `wrangler dev` without one, a random key for this isolate. */
async function memoKey(env, dev) {
  const secret = env.SAMURAI_MEMO_KEY || (dev ? (devMemoSecret ||= `${crypto.randomUUID()}${crypto.randomUUID()}`) : '');
  if (!secret) return null;
  if (memoKeyCache?.secret !== secret) {
    const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
    memoKeyCache = { secret, key };
  }
  return memoKeyCache.key;
}

const signMemo = async (key, memo) => b64u(await crypto.subtle.sign('HMAC', key, enc.encode(MEMO_CONTEXT + memo)));

async function memoValid(key, memo, sig) {
  if (!key || typeof sig !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(sig)) return false;
  try {
    return await crypto.subtle.verify('HMAC', key, unb64u(sig), enc.encode(MEMO_CONTEXT + memo));
  } catch {
    return false;
  }
}

/** Keeps the visitor's own turns and only those assistant turns whose memo this Worker signed. */
async function verifiedHistory(history, key) {
  const ok = await Promise.all(history.map((h) => (h.role === 'user' ? true : memoValid(key, h.raw, h.sig))));
  const kept = history.filter((h, i) => ok[i]).map(({ role, content }) => ({ role, content }));
  return { history: kept, dropped: history.length - kept.length };
}

// ---- bots and spend ----------------------------------------------------------------------------------------------

/** "ok" | "skipped" (dev, no secret) | "unconfigured" | "missing" | "failed" | "error" */
async function turnstile(env, token, ip, dev) {
  if (!env.TURNSTILE_SECRET) return dev ? 'skipped' : 'unconfigured';
  if (typeof token !== 'string' || !token || token.length > MAX_TOKEN_CHARS) return 'missing';
  try {
    const res = await fetch(TURNSTILE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET, response: token, ...(ip === 'local' ? {} : { remoteip: ip }) }),
      signal: AbortSignal.timeout(5000),
    });
    const out = await res.json();
    if (!out?.success) return 'failed';
    // the test keys answer for any host; production accepts only qilich.com and the SamurAI widget
    if (!dev && (out.hostname !== PROD_HOST || out.action !== TURNSTILE_ACTION)) return 'failed';
    return 'ok';
  } catch {
    return 'error';
  }
}

/** The rate-limiting binding: a burst filter, per data centre and eventually consistent. True when over. */
async function burst(env, key) {
  if (typeof env.SAMURAI_LIMITER?.limit !== 'function') return false;
  try {
    const { success } = await env.SAMURAI_LIMITER.limit({ key });
    return !success;
  } catch {
    return false; // binding unavailable: the guard still limits
  }
}

const guardOf = (env) => (env.SAMURAI_GUARD ? env.SAMURAI_GUARD.get(env.SAMURAI_GUARD.idFromName('global')) : null);

// USD per million tokens. Cache writes are 1-hour entries (2x input). Fallback models are priced at the higher
// Opus 5 / 4.8 rates.
const PRICES = { [MODEL]: { in: 4, out: 20, read: 0.2, write: 8 } };
const OTHER_PRICE = { in: 5, out: 25, read: 0.5, write: 10 };
/** The cost of one answer in USD from its usage, summed over usage.iterations when present (fallbacks). */
export function costUsd(usage, model) {
  if (!usage) return null;
  const parts = Array.isArray(usage.iterations) && usage.iterations.length ? usage.iterations : [usage];
  let usd = 0;
  for (const p of parts) {
    const m = p.model || (p.type === 'message' ? MODEL : model);
    const r = PRICES[m] || OTHER_PRICE;
    usd += ((p.input_tokens || 0) * r.in + (p.cache_read_input_tokens || 0) * r.read + (p.cache_creation_input_tokens || 0) * r.write + (p.output_tokens || 0) * r.out) / 1e6;
  }
  return Math.round(usd * 1e6) / 1e6;
}

/** An answer that stopped early (closed tab, deadline, error): input as reported, output estimated from the text. */
function partialCost(stream, text) {
  const u = stream.currentMessage?.usage;
  if (!u) return undefined; // unknown: the guard keeps the reservation
  const output = Math.max(u.output_tokens || 0, Math.ceil(text.length / 3) + 1500); // + an allowance for thinking
  return costUsd({ ...u, output_tokens: output, iterations: null }, MODEL);
}

/** Maps an SDK error to [code, status], or null when the stream was stopped on purpose (closed tab, deadline). */
function mapError(err) {
  if (err instanceof Anthropic.APIUserAbortError) return null;
  if (err instanceof Anthropic.APIConnectionTimeoutError) return ['timeout', 504];
  if (err instanceof Anthropic.APIConnectionError) return ['unavailable', 503];
  if (err instanceof Anthropic.RateLimitError) return ['busy', 503];
  if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) return ['unavailable', 503];
  if (err instanceof Anthropic.BadRequestError) return ['upstream_error', 502];
  if (err instanceof Anthropic.InternalServerError) return ['busy', 503]; // 500, 529 overloaded
  // an error event inside the stream has no status: overloaded or rate limited is "busy" there too
  if (err instanceof Anthropic.APIError && err.status == null && /overloaded|rate_limit/.test(err.type || err.error?.error?.type || '')) {
    return ['busy', 503];
  }
  if (err instanceof Anthropic.APIError) return ['upstream_error', 502];
  return ['internal', 500];
}

function logError(where, err) {
  console.error(
    JSON.stringify({
      samurai_error: where,
      name: err?.name,
      status: err?.status,
      type: err?.error?.error?.type || err?.type || null,
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
  const devTools = env.SAMURAI_DEV === '1';
  if (!originAllowed(request, dev)) return jsonError(403, 'forbidden_origin', lang);
  if (!/^application\/json\s*(;|$)/i.test(request.headers.get('Content-Type') || '')) return jsonError(415, 'not_json', lang);
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
  const key = rateKey(ip);
  if (await burst(env, key)) return jsonError(429, 'rate_limited', lang, { 'Retry-After': '60' });

  const guard = guardOf(env);
  if (!env.ANTHROPIC_API_KEY || !guard) {
    console.error(JSON.stringify({ samurai_error: 'config', message: !guard ? 'SAMURAI_GUARD is not bound' : 'ANTHROPIC_API_KEY is not set' }));
    return jsonError(503, 'unavailable', lang);
  }

  const human = await turnstile(env, body.turnstile, ip, dev);
  if (human === 'unconfigured') {
    console.error(JSON.stringify({ samurai_error: 'config', message: 'TURNSTILE_SECRET is not set' }));
    return jsonError(503, 'unavailable', lang);
  }
  if (human === 'missing' || human === 'failed') return jsonError(403, 'verification_failed', lang);
  if (human === 'error') return jsonError(503, 'busy', lang);

  const mkey = await memoKey(env, dev);
  if (!mkey) console.error(JSON.stringify({ samurai_error: 'config', message: 'SAMURAI_MEMO_KEY is not set: follow-ups lose their context' }));
  const { history, dropped } = await verifiedHistory(input.history, mkey);

  // the global daily cap and the per-visitor limits, atomically; no answer if the guard cannot say yes
  let booking;
  try {
    booking = await guard.reserve({ key, dailyUsd: env.SAMURAI_DAILY_USD });
  } catch (err) {
    logError('guard', err);
    return jsonError(503, 'busy', lang);
  }
  if (!booking?.ok) {
    const retry = { 'Retry-After': String(booking?.retry || 60) };
    if (booking?.reason === 'budget') {
      console.error(JSON.stringify({ samurai_error: 'daily_limit', message: 'the daily spend cap is reached' }));
      return jsonError(503, 'daily_limit', lang, retry);
    }
    return jsonError(429, 'rate_limited', lang, retry);
  }
  let settled = null;
  const settle = (usd) =>
    (settled ||= guard.settle({ rid: booking.rid, usd }).catch((err) => {
      logError('settle', err);
      return null;
    }));

  try {
    return await answer({ request, env, ctx, lang, input, history, dropped, body, devTools, mkey, settle });
  } catch (err) {
    ctx.waitUntil(settle(undefined));
    throw err;
  }
}

async function answer({ request, env, ctx, lang, input, history, dropped, body, devTools, mkey, settle }) {
  const today = tashkentToday();
  const ratePromise = getRate(ctx);
  let rate = null;
  ratePromise.then((r) => (rate = r));
  // dev only: measure other effort levels without redeploying
  const effort = devTools && ['low', 'medium', 'high'].includes(body.effort) ? body.effort : EFFORT;
  const params = buildParams({ lang, today, history, message: input.message, effort });

  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: API_TIMEOUT_MS });
  const t0 = Date.now();
  const stream = client.beta.messages.stream(params);
  // The SDK's timeout stops counting once the headers arrive; this one covers a stream that stalls after that.
  let timedOut = false;
  const deadline = setTimeout(() => {
    timedOut = true;
    stream.abort();
  }, DEADLINE_MS);

  // The SSE response. Events are queued on the writer from the moment the stream connects.
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  // The visitor closed the page: stop generating. workerd reports it on request.signal (the enable_request_signal
  // compatibility flag); a write to a closed response only stalls, it does not fail.
  let gone = false;
  const leave = () => {
    if (gone) return;
    gone = true;
    stream.abort();
  };
  request.signal?.addEventListener?.('abort', leave);
  const write = (chunk) => {
    if (gone) return;
    writer.write(enc.encode(chunk)).catch(leave);
  };
  const send = (event, data) => write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

  // Nothing the model writes reaches the page raw: the intro and each solution are parsed from the text so far,
  // cleaned and cut (samurai.js), then sent.
  let text = '';
  let firstText = 0;
  let phase = '';
  let emitted = 0;
  let lastParse = 0;
  let introSent = false;
  let stopParsing = false;
  const sent = [];
  const parse = (final) => {
    if (stopParsing) return;
    const now = Date.now();
    if (!final && now - lastParse < 120) return;
    lastParse = now;
    let obj;
    try {
      obj = partialParse(text);
    } catch {
      return;
    }
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return;
    const l = LANGS.includes(obj.lang) ? obj.lang : lang;
    if (!introSent && typeof obj.understanding === 'string' && ('budget' in obj || 'solutions' in obj)) {
      introSent = true;
      const kind = ['proposal', 'clarify', 'decline'].includes(obj.kind) ? obj.kind : 'proposal';
      send('intro', { kind, lang: l, ...introOf(obj, l) });
    }
    if (obj.kind !== 'proposal' && 'solutions' in obj) stopParsing = true; // nothing more to announce early
    if (!rate || obj.kind !== 'proposal' || !Array.isArray(obj.solutions)) return;
    const ready = 'total' in obj || final ? obj.solutions.length : obj.solutions.length - 1;
    while (emitted < Math.min(ready, MAX_SOLUTIONS)) {
      const s = enrichSolution(obj.solutions[emitted], emitted, { lang: l, rate, today, after: firstStepWeeks(sent) });
      if (s.title) send('solution', s);
      sent.push(s);
      emitted++;
    }
    // the rest comes with the result; parsing the whole text again on every delta would only cost CPU
    if (emitted >= MAX_SOLUTIONS || 'total' in obj) stopParsing = true;
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
      if (/[}[]/.test(ev.delta.text)) parse(false);
    }
  });

  send('start', { lang }); // first in the stream; dropped with the stream if the connection fails

  // Wait for the HTTP response, so that errors before any output come back as clean JSON errors.
  try {
    await stream.withResponse();
  } catch (err) {
    clearTimeout(deadline);
    stream.abort();
    const mapped = timedOut ? ['timeout', 504] : mapError(err);
    logError(timedOut ? 'deadline' : 'connect', err);
    // an error status is not billed; after a timeout the tokens may have been, so the reservation stays
    ctx.waitUntil(settle(timedOut || err instanceof Anthropic.APIConnectionTimeoutError ? undefined : 0));
    return jsonError(mapped?.[1] || 500, mapped?.[0] || 'internal', lang);
  }

  const ping = setInterval(() => write(': ping\n\n'), PING_MS);

  const pump = (async () => {
    let cost;
    try {
      const msg = await stream.finalMessage();
      rate = await ratePromise;
      cost = costUsd(msg.usage, msg.model);
      const answerText = msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
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
        cost_usd: cost,
      };

      if (msg.stop_reason === 'refusal') {
        console.log(JSON.stringify({ samurai: { ...log, category: msg.stop_details?.category ?? null } }));
        send('error', { code: 'refused', message: say('refused', lang) });
        return;
      }
      let parsed = null;
      try {
        parsed = JSON.parse(answerText);
      } catch {
        parsed = msg.stop_reason === 'max_tokens' ? salvage(answerText) : null;
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
      if (dropped) flags.push(`history_dropped:${dropped}`);
      result.memo_sig = mkey ? await signMemo(mkey, result.memo) : null;
      // solutions not yet announced (e.g. the rate arrived late)
      for (const s of result.solutions.slice(emitted)) send('solution', s);
      emitted = result.solutions.length;
      console.log(JSON.stringify({ samurai: { ...log, kind: result.kind, solutions: result.solutions.length, flags } }));
      if (devTools) result.meta = { ...log, flags };
      send('result', result);
    } catch (err) {
      if (cost === undefined) cost = partialCost(stream, text);
      if (timedOut) {
        logError('deadline', err);
        send('error', { code: 'timeout', message: say('timeout', lang) });
      } else if (err?.code === 'invalid_output') {
        logError('finalize', err);
        send('error', { code: 'invalid_output', message: say('invalid_output', lang) });
      } else {
        const mapped = mapError(err);
        if (mapped) {
          logError('stream', err);
          send('error', { code: mapped[0], message: say(mapped[0], lang) });
        }
      }
    } finally {
      clearTimeout(deadline);
      clearInterval(ping);
      writer.close().catch(() => {});
      const spend = await settle(cost);
      if (spend?.ok) console.log(JSON.stringify({ samurai_spend: { cost_usd: cost ?? null, usd_today: spend.usd_today } }));
    }
  })();
  ctx.waitUntil(pump);

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store, no-transform',
      ...SECURITY_HEADERS,
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
