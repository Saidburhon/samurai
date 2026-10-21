// qilich.com Worker. Static assets are served by the assets binding; only /api/* runs this code first
// (wrangler.json: assets.run_worker_first). SOLUTIONS-SPEC §2.8.
//
// ---- POST /api/samurai -------------------------------------------------------------------------------------------
// Request (§2.2): JSON, at most 24 KB, Origin https://qilich.com (or http://localhost:* under wrangler dev):
//   { v: 1, lang: "uz"|"ru"|"en"|"ja", intake: { industry, branches, staff, tools, goal, budget, deadline } (fixed ids,
//     all optional), text: "…" (≤ 1500 characters), preselected: [catalogue ids], answers: [{ question, answer }],
//     refine: null | { chips: ["cheaper"|"faster"|"telegram_only"|"have_site"|"have_1c"], text, previous: <pick>, brief_no } }
// Refused before the stream: 403 { error: { code: "forbidden_origin" } }, 400 bad_input | too_long, 405, 413, 415.
// Otherwise text/event-stream (§2.7), each data line one JSON object:
//   meta { brief_no, lang, generated_at, valid_until, catalogue_version, rate, source }   always first
//   status { status } · heard {…} · question {…}* · solution {…}* (priced by src/shared/price.js, detail null)
//   not_recommended [...] · plan { selection, tracks, totals, roadmap_note, first_step, assumptions, pick, source }
//   detail { catalogue_id, n, detail }* (any order) · reset {} (a server-side fallback took over: discard after meta)
//   done { sig, partial, ms } · error { code: bad_input|too_long|rate_limited|not_configured|refused|upstream|timeout,
//   retry_after? } (the stream closes after it). The client runs the catalogue matcher on an error before any solution.
// POST /api/samurai/verify { payload: { brief_no, lang, generated_at, catalogue_version, rate, pick, details }, sig }
//   → { ok } or { ok: false, reason: "no_key" | "bad_sig" | "mismatch" }
// POST /api/lead (§6) → { ok: true, via: "telegram" } | 501 { ok: false, fallback: "mailto", subject, text } | 400 | 429
// GET /api/rate → { uzs_per_usd, date, source } (public, 1 hour)
// Secrets: ANTHROPIC_API_KEY (without it the page answers from the catalogue matcher), SAMURAI_SIGNING_KEY (without it
// no hanko), TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID (without them leads become e-mails). Vars: SAMURAI_EFFORT (low),
// SAMURAI_FAST (0), SAMURAI_DAILY_USD (15, the spend guard's daily cap).
// Logs: event names, timings, token usage, cache reads, stop reasons, costs. Never the visitor's text, intake, name or phone.
import { MODEL } from './model.js';
import { getRate } from './rate.js';
import { parseRequest, runSamurai } from './samurai.js';
import { verify } from './sign.js';
import { parseLead, sendLead } from './lead.js';
import { visitorKey, over } from './limits.js';
import { tashkentToday } from '../src/shared/holidays.js';

export { SamuraiGuard } from './spend.js';

const PROD_ORIGIN = 'https://qilich.com';
const SECURITY = {
  'X-Content-Type-Options': 'nosniff',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};
const json = (status, body, extra = {}) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...SECURITY, ...extra } });
const err = (status, code, extra) => json(status, { error: { code } }, extra);

const isLocal = (h) => h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || h.endsWith('.localhost');
// wrangler dev: the client address is loopback, which the Cloudflare edge never sets for a real visitor
const isDev = (request, env) => { const ip = request.headers.get('CF-Connecting-IP') || ''; return env.SAMURAI_DEV === '1' || ip === '127.0.0.1' || ip === '::1' || ip === ''; };
function originOk(request, env) {
  const o = request.headers.get('Origin');
  if (o === PROD_ORIGIN) return true;
  if (!o || !isDev(request, env)) return false;
  // wrangler dev rewrites an Origin that names the dev server itself to the route's host (http://qilich.com)
  if (o === 'http://qilich.com') return true;
  try { const u = new URL(o); return u.protocol === 'http:' && isLocal(u.hostname); } catch { return false; }
}

async function readBody(request, max) {
  if (Number(request.headers.get('Content-Length') || 0) > max) return { error: 413 };
  if (!request.body) return { text: '' };
  const reader = request.body.getReader(), parts = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) { reader.cancel().catch(() => {}); return { error: 413 }; }
    parts.push(value);
  }
  const all = new Uint8Array(size);
  let at = 0;
  for (const p of parts) { all.set(p, at); at += p.byteLength; }
  return { text: new TextDecoder().decode(all) };
}
async function readJson(request, max) {
  if (!/^application\/json\s*(;|$)/i.test(request.headers.get('Content-Type') || '')) return { res: err(415, 'not_json') };
  const b = await readBody(request, max);
  if (b.error) return { res: err(413, 'too_large') };
  try { return { body: JSON.parse(b.text) }; } catch { return { res: err(400, 'bad_input') }; }
}

const guardOf = (env) => (env.SAMURAI_GUARD ? env.SAMURAI_GUARD.get(env.SAMURAI_GUARD.idFromName('global')) : null);
const log = (o) => console.log(JSON.stringify(o));

async function samurai(request, env, ctx) {
  if (request.method !== 'POST') return err(405, 'method_not_allowed', { Allow: 'POST' });
  if (!originOk(request, env)) return err(403, 'forbidden_origin');
  const r = await readJson(request, 24 * 1024);
  if (r.res) return r.res;
  const parsed = parseRequest(MODEL, r.body);
  if (parsed.error) return err(400, parsed.error);
  const { input } = parsed;

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const enc = new TextEncoder();
  let gone = false, chain = Promise.resolve();
  const write = (s) => { if (gone) return; chain = chain.then(() => writer.write(enc.encode(s))).catch(() => { gone = true; }); };
  const send = (event, data) => write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  const ping = setInterval(() => write(': ping\n\n'), 10_000);

  const run = (async () => {
    const t0 = Date.now();
    try {
      const key = visitorKey(request.headers.get('CF-Connecting-IP') || 'local');
      if ((await over(env.RL_IP, key)) || (await over(env.RL_ALL, 'all'))) {
        send('error', { code: 'rate_limited', retry_after: 60 });
        log({ samurai: { event: 'rate_limited', lang: input.lang } });
        return;
      }
      const rate = await getRate(ctx);
      const hasKey = Boolean(env.ANTHROPIC_API_KEY);
      // the daily spend cap and per-visitor limits (worker/spend.js); without the binding the rate limits still hold
      const guard = hasKey ? guardOf(env) : null;
      let booking = null;
      if (guard) {
        try { booking = await guard.reserve({ key, dailyUsd: env.SAMURAI_DAILY_USD }); } catch (e) { booking = { ok: false, reason: 'error' }; }
        if (!booking?.ok) {
          const code = booking?.reason === 'budget' || booking?.reason === 'error' ? 'not_configured' : 'rate_limited';
          send('error', { code, ...(code === 'rate_limited' ? { retry_after: Math.min(booking?.retry || 60, 600) } : {}) });
          log({ samurai: { event: 'guard', reason: booking?.reason || 'none' } });
          return;
        }
      }
      const out = await runSamurai({
        m: MODEL, input, rate, send, signal: request.signal, log,
        apiKey: env.ANTHROPIC_API_KEY, signingKey: env.SAMURAI_SIGNING_KEY,
        effort: ['low', 'medium', 'high'].includes(env.SAMURAI_EFFORT) ? env.SAMURAI_EFFORT : 'low', fast: env.SAMURAI_FAST === '1',
      });
      if (guard && booking?.ok) ctx.waitUntil(guard.settle({ rid: booking.rid, usd: out.cost }).catch(() => null));
      log({ samurai: { lang: input.lang, refine: Boolean(input.refine), status: out.status, source: out.source || null, solutions: out.pick?.solutions?.length ?? 0, partial: out.partial, ms: Date.now() - t0, cost_usd: out.cost, calls: out.calls } });
    } catch (e) {
      log({ samurai_error: 'handler', name: e?.name, message: String(e?.message || '').slice(0, 200) });
      send('error', { code: 'upstream' });
    } finally {
      clearInterval(ping);
      chain.then(() => writer.close()).catch(() => {});
    }
  })();
  ctx.waitUntil(run);
  return new Response(readable, { headers: { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-store, no-transform', 'X-Accel-Buffering': 'no', ...SECURITY } });
}

async function verifyRoute(request, env) {
  if (request.method !== 'POST') return err(405, 'method_not_allowed', { Allow: 'POST' });
  if (!originOk(request, env)) return err(403, 'forbidden_origin');
  const r = await readJson(request, 24 * 1024);
  if (r.res) return r.res;
  const p = r.body?.payload;
  if (!p || typeof p !== 'object') return json(400, { ok: false, reason: 'bad_input' });
  return json(200, await verify(env.SAMURAI_SIGNING_KEY, p, r.body.sig));
}

async function leadRoute(request, env) {
  if (request.method !== 'POST') return err(405, 'method_not_allowed', { Allow: 'POST' });
  if (!originOk(request, env)) return err(403, 'forbidden_origin');
  const key = visitorKey(request.headers.get('CF-Connecting-IP') || 'local');
  if (await over(env.RL_LEAD, key)) return json(429, { ok: false, error: 'rate_limited' }, { 'Retry-After': '60' });
  const r = await readJson(request, 16 * 1024);
  if (r.res) return r.res;
  const p = parseLead(r.body);
  if (p.error) return json(400, { ok: false, error: p.error });
  const out = await sendLead(env, p.lead, tashkentToday());
  return json(out.status, out.body);
}

async function rateRoute(ctx) {
  const rate = await getRate(ctx);
  return json(200, rate, { 'Cache-Control': 'public, max-age=3600' });
}

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    try {
      if (pathname === '/api/samurai' || pathname === '/api/samurai/') return await samurai(request, env, ctx);
      if (pathname === '/api/samurai/verify') return await verifyRoute(request, env);
      if (pathname === '/api/lead') return await leadRoute(request, env);
      if (pathname === '/api/rate') return await rateRoute(ctx);
      if (pathname.startsWith('/api/')) return err(404, 'not_found');
    } catch (e) {
      log({ api_error: pathname, name: e?.name, message: String(e?.message || '').slice(0, 200) });
      return err(500, 'internal');
    }
    return env.ASSETS.fetch(request);
  },
};
