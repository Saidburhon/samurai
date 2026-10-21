// SamurAI's two stages (SOLUTIONS-SPEC §2.1–2.8). Runs in the Worker (worker/index.js) and under Node (the samples
// and eval scripts), so it takes everything from its caller: the model of the catalogue, the rate, the key and a
// send(event, data) for the SSE protocol of §2.7.
//   stage 1 "pick"    one streamed call; the scanner reports each finished piece, which is validated, guarded and
//                     priced by src/shared/price.js before it is sent; each solution starts its stage-2 call at once
//   stage 2 "detail"  one call per solution, in parallel; validated and sent as each finishes
// The model writes no numbers: every price, week and date comes from the shared engine.
import Anthropic from '@anthropic-ai/sdk';
import { createScanner } from './scan.js';
import { context, validateHeard, validateQuestion, validateSolution, finalizePick, validateDetail } from './validate.js';
import { buildSchemas } from './schema.js';
import { buildSystem, LANG_BLOCK } from './prompt.js';
import { sign } from './sign.js';
import { enrichSolution, priceResult, solId } from '../src/shared/price.js';
import { match } from '../src/shared/match.js';
import { pickable, solutionUrl } from '../src/shared/catalogue.js';
import { int, dateNum } from '../src/shared/format.js';

export const MODEL_ID = 'claude-opus-5-5';
const FALLBACK_BETA = 'server-side-fallback-2026-07-01';
const FAST_BETA = 'fast-mode-2026-02-01';
export const LANGS = ['uz', 'ru', 'en', 'ja'];
const FIRST_TEXT_MS = 45_000;
const CAP_MS = 120_000;
// USD per million tokens (cache writes are 1-hour entries, 2× input); fallback models at the higher Opus rates
const PRICE = { [MODEL_ID]: { in: 4, out: 20, read: 0.2, write: 8 } };
const OTHER = { in: 5, out: 25, read: 0.5, write: 10 };
// the cached prefix of every call (system prompt, language block, output schema), as cache reads measured it live: 19–23K
const CACHED_TOKENS = 24_000;

let prepared = null;
export function prepare(m) {
  if (prepared?.m !== m) prepared = { m, schemas: buildSchemas(m), system: buildSystem(m) };
  return prepared;
}

// ---- the request (§2.2) ----
const INTAKE = {
  branches: ['1', '2-5', '6+'], staff: ['1-5', '6-20', '21-100', '100+'],
  tools: ['paper_phone', 'excel', 'telegram_group', '1c', 'own_software', 'instagram', 'website'],
  goal: ['sales', 'control', 'less_manual', 'new_customers', 'payments'],
  budget: ['unknown', 'lt20', '20-50', '50-150', 'gt150', 'usd_lt5k', 'usd_5_15k', 'usd_15_50k', 'usd_gt50k'],
  deadline: ['1m', '3m', 'none'],
};
const CHIPS = ['cheaper', 'faster', 'telegram_only', 'have_site', 'have_1c'];
const CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;
const str = (s, n) => [...String(s ?? '').replace(CONTROL, '').trim()].slice(0, n).join('');

/** { input } or { error: 'bad_input' | 'too_long' } */
export function parseRequest(m, body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'bad_input' };
  const lang = LANGS.includes(body.lang) ? body.lang : 'uz';
  const text = typeof body.text === 'string' ? body.text.replace(CONTROL, '').trim() : '';
  if ([...text].length > 1500) return { error: 'too_long', lang };
  const i = body.intake && typeof body.intake === 'object' ? body.intake : {};
  const intake = {};
  if (typeof i.industry === 'string' && (Object.hasOwn(m.catalogueIndustries, i.industry) || i.industry === 'other') && i.industry !== 'any') intake.industry = i.industry;
  for (const [k, list] of Object.entries(INTAKE)) if (list.includes(i[k])) intake[k] = i[k];
  const ok = new Set(pickable(m).map((s) => s.id));
  const preselected = (Array.isArray(body.preselected) ? body.preselected : []).filter((x) => ok.has(x)).slice(0, 6);
  const answers = (Array.isArray(body.answers) ? body.answers : []).slice(0, 6).map((a) => ({ question: str(a?.question ?? a?.q, 80), answer: str(a?.answer ?? a?.o, 40) })).filter((a) => a.question && a.answer);
  let refine = null;
  if (body.refine && typeof body.refine === 'object') {
    const prev = body.refine.previous;
    refine = {
      chips: (Array.isArray(body.refine.chips) ? body.refine.chips : []).filter((c) => CHIPS.includes(c)).slice(0, 5),
      text: str(body.refine.text, 200),
      previous: prev && Array.isArray(prev.solutions) ? {
        heard: str(prev.heard?.summary, 200),
        solutions: prev.solutions.slice(0, 4).filter((s) => ok.has(s?.catalogue_id) || s?.catalogue_id === 'custom').map((s) => ({ catalogue_id: s.catalogue_id, based_on: (s.based_on || []).filter((x) => ok.has(x)).slice(0, 3), title: str(s.title, 60), priority: s.priority, scope: s.scope, size: s.size, modifiers: (s.modifiers || []).filter((x) => m.modifiers[x]), integrations: (s.integrations || []).filter((x) => m.integrations[x]) })),
      } : null,
      brief_no: /^QL-\d{4}-[0-9A-F]{4}(·\d{1,2})?$/.test(body.refine.brief_no || '') ? body.refine.brief_no : '',
    };
    if (!refine.chips.length && !refine.text) refine = null;
  }
  if (!text && !Object.keys(intake).length && !preselected.length && !refine) return { error: 'bad_input', lang };
  return { input: { lang, intake, text, preselected, answers, refine } };
}

// ---- meta (§2.7): the brief number, dates, the rate ----
const pad = (n) => String(n).padStart(2, '0');
export function makeMeta({ m, lang, rate, now = Date.now(), refineOf = '', source = 'model', randomHex }) {
  const t = new Date(now + 5 * 36e5); // Tashkent, UTC+5
  const iso = `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}T${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())}:${pad(t.getUTCSeconds())}+05:00`;
  const until = new Date(now + 5 * 36e5 + (m.pricing.validity_days || 30) * 864e5);
  let brief_no;
  if (refineOf) { const mm = /^(.*?)(?:·(\d+))?$/.exec(refineOf); brief_no = `${mm[1]}·${(Number(mm[2]) || 1) + 1}`; }
  else brief_no = `QL-${String(t.getUTCFullYear()).slice(2)}${pad(t.getUTCMonth() + 1)}-${(randomHex || (() => [...crypto.getRandomValues(new Uint8Array(2))].map((b) => b.toString(16).padStart(2, '0')).join('')))().toUpperCase()}`;
  return { brief_no, lang, generated_at: iso, valid_until: `${until.getUTCFullYear()}-${pad(until.getUTCMonth() + 1)}-${pad(until.getUTCDate())}`, catalogue_version: m.version, rate, source };
}

export function costUsd(usage, model) {
  if (!usage) return 0;
  const parts = Array.isArray(usage.iterations) && usage.iterations.length ? usage.iterations : [usage];
  let usd = 0;
  for (const p of parts) {
    const r = PRICE[p.model || model] || OTHER;
    const cw = p.cache_creation_input_tokens || 0;
    usd += ((p.input_tokens || 0) * r.in + (p.cache_read_input_tokens || 0) * r.read + cw * r.write + (p.output_tokens || 0) * r.out) / 1e6;
  }
  return Math.round(usd * 1e6) / 1e6;
}
const usageOf = (msg) => ({ input: msg?.usage?.input_tokens || 0, cache_read: msg?.usage?.cache_read_input_tokens || 0, cache_write: msg?.usage?.cache_creation_input_tokens || 0, output: msg?.usage?.output_tokens || 0 });
// the text the answering model wrote: after the last fallback block, if a declined attempt came first
const answerText = (msg) => { const c = msg.content || []; let k = -1; c.forEach((b, i) => { if (b.type === 'fallback') k = i; }); return c.slice(k + 1).filter((b) => b.type === 'text').map((b) => b.text).join(''); };

/**
 * Runs one SamurAI request. opts: { m, input, rate, apiKey, signingKey, effort, fast, send, signal, log, now }.
 * Resolves to { status, cost, partial, ms, calls } once the stream is complete. Never throws.
 */
export async function runSamurai(opts) {
  const { m, input, rate, send, log = () => {}, now = Date.now() } = opts;
  const { lang } = input;
  const t0 = Date.now();
  const meta = makeMeta({ m, lang, rate, now, refineOf: input.refine?.brief_no, randomHex: opts.randomHex, source: opts.apiKey ? 'model' : 'fallback' });
  send('meta', meta);
  if (!opts.apiKey) { send('error', { code: 'not_configured' }); return { status: 'not_configured', cost: 0, partial: false, ms: Date.now() - t0, calls: [] }; }
  const P = prepare(m);
  const client = opts.client || new Anthropic({ apiKey: opts.apiKey, maxRetries: 1, timeout: 60_000 });
  const ctrl = new AbortController();
  const onAbort = () => ctrl.abort();
  opts.signal?.addEventListener?.('abort', onAbort);
  if (opts.signal?.aborted) ctrl.abort();
  const cap = setTimeout(() => { capped = true; ctrl.abort(); }, CAP_MS);
  let capped = false;
  const ctx = context(m, { lang, text: input.text, intake: input.intake });
  const rateStr = `1 USD = ${int(rate.uzs_per_usd, 'en')} UZS (CBU, ${dateNum(rate.date, 'en')})`;
  const urlOf = (e, l) => solutionUrl(e, l);
  const effort = opts.effort || 'low';
  const system = [
    { type: 'text', text: P.system, cache_control: { type: 'ephemeral', ttl: '1h' } },
    { type: 'text', text: LANG_BLOCK[lang], cache_control: { type: 'ephemeral', ttl: '1h' } },
  ];
  const base = (schema, maxTokens) => {
    const p = { model: MODEL_ID, max_tokens: maxTokens, betas: [FALLBACK_BETA], fallbacks: 'default', output_config: { effort, format: { type: 'json_schema', schema } }, system };
    if (opts.fast) { p.speed = 'fast'; p.betas.push(FAST_BETA); }
    return p;
  };
  const calls = [];
  let cost = 0, partial = false;
  // every call is metered from its stream events, so a run that is cut short (the visitor left, a timeout) still
  // counts what it spent: the input as message_start reports it, the output estimated from the text streamed so far.
  // A call cut before message_start (blind) counts its input only: the cached prompt at the read rate plus the user
  // turn (about $0.01). A call the API refused with an HTTP status before it started is not billed and counts nothing,
  // and a call never sent (the visitor had already left) is not metered at all. The spend guard settles the run at
  // this cost (worker/budget.js), so dropped or refused requests never drain the daily cap.
  const meters = [];
  const meter = (userJson) => {
    const r = PRICE[MODEL_ID];
    const mt = { usage: null, model: null, chars: 0, done: false, rejected: false, est: (CACHED_TOKENS * r.read + (userJson.length / 3) * r.in) / 1e6 };
    meters.push(mt);
    return mt;
  };
  // an HTTP error from the API before the stream began (401, 429, 5xx, 529): nothing was billed
  const refused = (mt, err) => { if (!mt.usage && typeof err?.status === 'number') mt.rejected = true; };
  const onEvent = (mt) => (ev) => {
    if (ev.type === 'message_start') { mt.model = ev.message?.model || null; mt.usage = { ...(ev.message?.usage || {}) }; }
    else if (ev.type === 'message_delta' && ev.usage) mt.usage = { ...(mt.usage || {}), ...Object.fromEntries(Object.entries(ev.usage).filter(([, v]) => v != null)) };
    else if (ev.type === 'content_block_delta') mt.chars += (ev.delta?.text || ev.delta?.partial_json || '').length;
  };
  const unsettled = () => {
    let usd = 0, blind = 0;
    for (const mt of meters) {
      if (mt.done) continue;
      mt.done = true;
      if (mt.rejected) continue;
      if (!mt.usage) { blind++; usd += mt.est; continue; }
      const { iterations, ...u } = mt.usage;
      usd += costUsd({ ...u, output_tokens: Math.max(u.output_tokens || 0, Math.ceil((mt.chars / 2.5) * 1.1)) }, mt.model || MODEL_ID);
    }
    return { usd: Math.round(usd * 1e6) / 1e6, blind };
  };

  // ---- stage 2 ----
  const details = {};
  let attempt = { ctrl: new AbortController(), jobs: [] };
  ctrl.signal.addEventListener('abort', () => attempt.ctrl.abort());
  let heard = null;
  const runDetail = async (sol, att) => {
    const t1 = Date.now();
    const entry = m.byId.get(sol.catalogue_id === 'custom' ? sol.based_on[0] : sol.catalogue_id);
    const user = {
      task: 'detail', lang, rate: rateStr, intake: input.intake, text: input.text, heard,
      solution: sol,
      entry: { id: entry.id, title: entry.title.en, what: entry.oneliner.en, mvp_scope: entry.scope?.mvp, full_scope: entry.scope?.full, note: entry.notes, can_add: entry.integrations.filter((x) => !entry.integrations_included.includes(x)), included: entry.integrations_included, typical_team: entry.team, typical_stack: entry.stack },
    };
    if (att.ctrl.signal.aborted) return;
    const content = JSON.stringify(user), mt = meter(content);
    try {
      const s = client.beta.messages.stream({ ...base(P.schemas.detail, 4000), messages: [{ role: 'user', content }] }, { signal: att.ctrl.signal });
      s.on?.('streamEvent', onEvent(mt));
      const msg = await s.finalMessage();
      mt.done = true;
      const c = costUsd(msg.usage, msg.model); cost += c;
      const fell = (msg.usage?.iterations || []).some((e) => e.type === 'fallback_message');
      calls.push({ stage: 'detail', id: sol.catalogue_id, ms: Date.now() - t1, model: msg.model, fallback: fell, stop: msg.stop_reason, usage: usageOf(msg), cost_usd: c });
      if (msg.stop_reason === 'refusal') throw new Error('refused');
      if (att !== attempt) return;
      let d = null;
      try { d = JSON.parse(answerText(msg)); } catch { d = null; }
      if (!d) { partial = true; return; }
      if (msg.stop_reason === 'max_tokens') partial = true;
      const v = validateDetail(ctx, d);
      details[solId(sol)] = v;
      send('detail', { catalogue_id: sol.catalogue_id, n: sol.n, detail: v });
    } catch (err) {
      refused(mt, err);
      if (att === attempt) partial = true;
      calls.push({ stage: 'detail', id: sol.catalogue_id, ms: Date.now() - t1, error: String(err?.name || err?.message || err).slice(0, 80), ...(err?.status ? { status: err.status } : {}) });
    }
  };

  // ---- stage 1 ----
  let status = null, questions = [], solutions = [], taken = new Set(), raw = {};
  const scanner = createScanner(({ key, index, value }) => {
    if (index === -1) raw[key] = value;
    if (key === 'status' && index === -1) { status = ['ok', 'need_more', 'not_business'].includes(value) ? value : 'ok'; send('status', { status }); }
    else if (key === 'heard' && index === -1) { heard = validateHeard(ctx, value); send('heard', heard); }
    else if (key === 'questions' && index >= 0 && status !== 'not_business' && questions.length < 3) {
      const q = validateQuestion(ctx, value, questions.length + 1);
      if (q) { questions.push(q); send('question', q); }
    } else if (key === 'solutions' && index >= 0 && status !== 'not_business') {
      if (solutions.length >= (status === 'need_more' ? 1 : 4)) return;
      const s = validateSolution(ctx, value, solutions.length + 1, taken);
      if (!s) return;
      solutions.push(s);
      send('solution', enrichSolution(m, s, { lang, rate, urlOf }));
      attempt.jobs.push(runDetail(s, attempt));
    }
  });
  const user = { task: 'pick', lang, rate: rateStr, intake: input.intake, text: input.text, preselected: input.preselected, answers: input.answers, refine: input.refine };
  let firstText = 0, timedOut = false, final = null, errCode = null;
  const firstTimer = setTimeout(() => { if (!firstText) { timedOut = true; ctrl.abort(); } }, FIRST_TEXT_MS);
  const t1 = Date.now();
  const content = JSON.stringify(user);
  // the visitor left before the call was made (the rate or the guard took that long): nothing is sent or spent
  const pm = ctrl.signal.aborted ? null : meter(content);
  try {
    if (!pm) throw Object.assign(new Error('aborted before the call'), { name: 'AbortError' });
    const stream = client.beta.messages.stream({ ...base(P.schemas.pick, 8000), messages: [{ role: 'user', content }] }, { signal: ctrl.signal });
    for await (const ev of stream) {
      onEvent(pm)(ev);
      if (ev.type === 'content_block_start' && ev.content_block?.type === 'fallback') {
        // a server-side fallback took over: everything after meta is void
        scanner.reset(); attempt.ctrl.abort(); attempt = { ctrl: new AbortController(), jobs: [] };
        status = null; heard = null; questions = []; solutions = []; taken = new Set(); raw = {};
        for (const k of Object.keys(details)) delete details[k];
        send('reset', {});
        continue;
      }
      if (ev.type === 'content_block_delta' && ev.delta?.type === 'text_delta') { if (!firstText) firstText = Date.now(); scanner.push(ev.delta.text); }
    }
    final = await stream.finalMessage();
    pm.done = true;
  } catch (err) {
    if (pm) refused(pm, err);
    errCode = timedOut || capped ? 'timeout' : opts.signal?.aborted ? 'aborted' : mapError(err);
    log({ samurai_error: 'pick', name: err?.name, status: err?.status, message: String(err?.message || '').slice(0, 200) });
  } finally {
    clearTimeout(firstTimer);
  }
  if (final) {
    const c = costUsd(final.usage, final.model); cost += c;
    calls.push({ stage: 'pick', ms: Date.now() - t1, ttft_ms: firstText ? firstText - t1 : null, model: final.model, fallback: (final.usage?.iterations || []).some((e) => e.type === 'fallback_message'), stop: final.stop_reason, usage: usageOf(final), cost_usd: c });
    if (final.stop_reason === 'refusal') errCode = 'refused';
    if (final.stop_reason === 'max_tokens') partial = true;
  }
  if (errCode === 'aborted') {
    // the visitor left: the detail calls stop too; what every call spent so far is counted, never nothing
    attempt.ctrl.abort();
    await Promise.allSettled(attempt.jobs);
    const u = unsettled();
    finish();
    return { status: 'aborted', cost: Math.round((cost + u.usd) * 1e6) / 1e6, blind: u.blind, partial: true, ms: Date.now() - t0, calls };
  }
  if (errCode && !solutions.length) {
    attempt.ctrl.abort();
    send('error', { code: errCode });
    await Promise.allSettled(attempt.jobs);
    const u = unsettled();
    finish();
    return { status: errCode, cost: Math.round((cost + u.usd) * 1e6) / 1e6, blind: u.blind, partial: true, ms: Date.now() - t0, calls };
  }
  if (errCode) partial = true;

  // ---- the whole pick, the plan ----
  let pick = finalizePick(ctx, raw, { heard: heard || validateHeard(ctx, {}), questions, solutions });
  let source = 'model';
  if (pick.status === 'ok' && !pick.solutions.length) {
    // the model chose nothing usable: the catalogue matcher fills the result
    const mm = match(m, { intake: input.intake, text: input.text, lang, preselected: input.preselected });
    if (mm) {
      pick = { ...mm, heard: pick.heard.summary ? pick.heard : mm.heard };
      source = 'fallback';
      send('reset', {});
      send('heard', pick.heard);
      for (const s of pick.solutions) send('solution', enrichSolution(m, s, { lang, rate, urlOf }));
    }
  }
  const nr = pick.not_recommended.map((x) => { const e = m.byId.get(x.catalogue_id); return { ...x, title: e.title[lang] || e.title.en, url: solutionUrl(e, lang) }; });
  send('not_recommended', nr);
  const priced = priceResult(m, { pick, details: {}, lang, rate, urlOf });
  send('plan', { ...priced.plan, pick, source });

  // ---- stage 2 finishes ----
  if (source === 'model') await Promise.allSettled(attempt.jobs);
  const kept = new Set(pick.solutions.map(solId));
  for (const k of Object.keys(details)) if (!kept.has(k)) delete details[k];
  // the signature (and so the hanko) only for a genuine estimate: status ok, at least one solution, from the model
  const genuine = pick.status === 'ok' && pick.solutions.length > 0 && source === 'model';
  const sig = genuine ? await sign(opts.signingKey, { ...meta, pick, details }) : '';
  const ms = Date.now() - t0;
  send('done', { sig, partial, ms });
  const u = unsettled();
  finish();
  return { status: pick.status, source, cost: Math.round((cost + u.usd) * 1e6) / 1e6, blind: u.blind, partial, ms, calls, pick, details, meta, sig };

  function finish() { clearTimeout(cap); opts.signal?.removeEventListener?.('abort', onAbort); }
}

/** An SDK error → the §2.7 code. */
export function mapError(err) {
  if (err instanceof Anthropic.APIUserAbortError) return 'timeout';
  if (err instanceof Anthropic.APIConnectionTimeoutError) return 'timeout';
  if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) return 'not_configured';
  if (err instanceof Anthropic.RateLimitError) return 'upstream';
  return 'upstream';
}
