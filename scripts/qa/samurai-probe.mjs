// SamurAI stream probe (SOLUTIONS-SPEC §8 T2, T4, T26): sends one request to /api/samurai, records every SSE event
// with its arrival time, and checks the stream against the contract of §2.5/§2.7:
//   meta first; then status/heard/question/solution/not_recommended/plan/detail/done (or error); every event's JSON
//   has the delivered shape; every solution's numbers equal the shared engine's (src/shared/price.js) for the final
//   pick; quotes occur in the text; no copy-rule hit in any model string.
// Usage: node scripts/qa/samurai-probe.mjs <base> <out.json> '<request json>' [--wait-rate]
//   --wait-rate: on rate_limited, wait retry_after seconds and try again (at most 3 times)
import { readFileSync, writeFileSync } from 'node:fs';
import { normalise } from '../../src/shared/catalogue.js';
import { priceResult, solId } from '../../src/shared/price.js';
import { BANNED } from '../../worker/copy-rules.js';

const [base = 'http://127.0.0.1:8811', out = '.cache/samurai-probe.json', reqJson = '{}'] = process.argv.slice(2);
const waitRate = process.argv.includes('--wait-rate');
const J = (p) => JSON.parse(readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8'));
const m = normalise(J('content/solutions.json'), J('content/solutions-extra.json'), J('content/pricing.json'));
const req = JSON.parse(reqJson);

async function once() {
  const t0 = Date.now();
  const res = await fetch(`${base}/api/samurai`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:8811' }, body: JSON.stringify(req) });
  const events = [];
  if (!/event-stream/.test(res.headers.get('content-type') || '')) return { t0, status: res.status, events, body: await res.text() };
  const dec = new TextDecoder();
  let buf = '';
  for await (const chunk of res.body) {
    buf += dec.decode(chunk, { stream: true });
    let k;
    while ((k = buf.indexOf('\n\n')) >= 0) {
      const block = buf.slice(0, k); buf = buf.slice(k + 2);
      const ev = /^event: (.+)$/m.exec(block)?.[1], data = /^data: (.+)$/m.exec(block)?.[1];
      if (ev) events.push({ t: (Date.now() - t0) / 1000, event: ev, data: data ? JSON.parse(data) : null });
    }
  }
  return { t0, status: res.status, events };
}

let r;
for (let i = 0; i < 4; i++) {
  r = await once();
  const rl = r.events.find((e) => e.event === 'error' && e.data?.code === 'rate_limited');
  if (!rl || !waitRate || i === 3) break;
  await new Promise((ok) => setTimeout(ok, (rl.data.retry_after || 60) * 1000 + 1000));
}

const fails = [];
const fail = (s) => fails.push(s);
const E = r.events;
const names = E.map((e) => e.event);
if (names[0] !== 'meta') fail(`first event is ${names[0]}, not meta`);
const meta = E[0]?.data || {};
for (const k of ['brief_no', 'lang', 'generated_at', 'valid_until', 'catalogue_version', 'rate', 'source']) if (!(k in meta)) fail(`meta.${k} missing`);
if (meta.brief_no && !/^QL-\d{4}-[0-9A-F]{4}(·\d+)?$/.test(meta.brief_no)) fail(`brief_no ${meta.brief_no}`);
const err = E.find((e) => e.event === 'error');
const plan = E.find((e) => e.event === 'plan')?.data;
const done = E.find((e) => e.event === 'done')?.data;
const sols = E.filter((e) => e.event === 'solution').map((e) => e.data);
const dets = E.filter((e) => e.event === 'detail').map((e) => e.data);
// every model string is clean
const strings = (v) => (typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : []);
for (const e of E) for (const s of strings(e.data)) for (const [re, what] of BANNED) if (re.test(s)) fail(`${e.event}: ${what}: ${s.slice(0, 80)}`);
if (!err) {
  if (!names.includes('heard') && plan?.pick?.status !== 'not_business') fail('no heard');
  if (!plan) fail('no plan'); if (!done) fail('no done');
  if (plan?.pick?.status === 'ok' && !sols.length) fail('status ok but no solution');
  for (const s of sols) {
    for (const k of ['n', 'catalogue_id', 'title', 'why', 'priority', 'scope', 'size', 'difficulty', 'hamon', 'weeks', 'usd', 'uzs', 'monthly_usd', 'monthly_uzs', 'price_lines', 'phases']) if (!(k in s)) fail(`solution ${s.catalogue_id}: ${k} missing`);
    if (s.usd.mvp[0] > s.usd.mvp[1] || s.usd.mvp[1] > s.usd.full[1]) fail(`solution ${s.catalogue_id}: usd order`);
  }
  if (plan?.pick) {
    // the numbers on the stream equal the shared engine's for the final pick
    const again = priceResult(m, { pick: plan.pick, lang: meta.lang, rate: meta.rate });
    for (const s of again.solutions) {
      const shown = sols.find((x) => solId(x) === solId(s));
      if (!shown) { if (plan.source !== 'fallback') fail(`plan has ${solId(s)} that no solution event showed`); continue; }
      if (JSON.stringify([shown.usd, shown.weeks, shown.uzs]) !== JSON.stringify([s.usd, s.weeks, s.uzs])) fail(`${solId(s)}: streamed numbers differ from the engine`);
    }
    if (JSON.stringify(again.plan.totals) !== JSON.stringify(plan.totals)) fail('plan totals differ from the engine');
    const textN = String(req.text || '').toLowerCase().replace(/[ʻʼ'‘’`]/g, "'").replace(/\s+/g, ' ');
    for (const q of plan.pick.heard?.quotes || []) if (!textN.includes(q.toLowerCase().replace(/[ʻʼ'‘’`]/g, "'").replace(/\s+/g, ' '))) fail(`quote not in the text: ${q}`);
    if (plan.source !== 'fallback' && plan.pick.status !== 'not_business') for (const s of plan.pick.solutions) if (!dets.find((d) => d.catalogue_id === s.catalogue_id && d.n === s.n) && !done?.partial) fail(`no detail for ${s.catalogue_id}`);
  }
}
const at = (n) => E.find((e) => e.event === n)?.t ?? null;
const report = {
  base, request: req, http: r.status, body: r.body || null, fails,
  timing: { first_event: E[0]?.t ?? null, heard: at('heard'), first_solution: at('solution'), plan: at('plan'), done: at('done') },
  status: plan?.pick?.status || null, source: plan?.source || meta.source || null, error: err?.data || null,
  solutions: sols.map((s) => ({ id: s.catalogue_id, title: s.title, size: s.size, scope: s.scope, priority: s.priority, weeks: s.weeks, usd: s.usd, difficulty: s.difficulty })),
  details: dets.length, done, events: E,
};
writeFileSync(out, JSON.stringify(report, null, 1));
console.log(JSON.stringify({ out, http: r.status, events: names.join(' '), fails, timing: report.timing, status: report.status, error: report.error, solutions: report.solutions.map((s) => `${s.id}:${s.size}:${s.scope}:${s.usd.mvp.join('-')}`) }, null, 1));
process.exit(fails.length ? 1 : 0);
