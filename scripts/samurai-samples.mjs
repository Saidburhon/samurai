// npm run samples: the six example businesses × four languages, made through the real SamurAI pipeline
// (worker/samurai.js under Node, the live model), validated and written to content/samurai-samples.json, which is
// committed. The page renders them instantly, labelled "Namuna", re-priced with the catalogue and the rate of the day.
// Cost: about $0.12 per sample on a warm cache (≈ $3 for all). The key comes from ANTHROPIC_API_KEY or .dev.vars.
// Usage: node scripts/samurai-samples.mjs [--only uz,ru] [--id clinic]
//        node scripts/samurai-samples.mjs --lint   (free: every model string is clean, see sampleProblems())
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { normalise, fnv } from '../src/shared/catalogue.js';
import { runSamurai } from '../worker/samurai.js';
import { BANNED } from '../worker/copy-rules.js';
import { sampleProblems } from './qa/sample-lint.mjs';
import { tidy, jaWage } from '../worker/validate.js';
import { plainLabel } from '../src/shared/format.js';

const J = (p) => JSON.parse(readFileSync(p, 'utf8'));
const m = normalise(J('content/solutions.json'), J('content/solutions-extra.json'), J('content/pricing.json'));

// --clean (free): what the validator now does to model strings, applied to the committed samples: tidy() on every
// model string, the Japanese office hour, no separate "not needed yet" list, impact labels without a currency. Then
// --lint must pass.
if (process.argv.includes('--clean')) {
  const file = J('content/samurai-samples.json');
  const T = (lang) => (t) => (typeof t === 'string' ? tidy(t, lang) : t);
  for (const [lang, list] of Object.entries(file.samples)) for (const x of list) {
    const t = T(lang), p = x.pick;
    delete x.nr;
    p.heard.summary = t(p.heard.summary); p.roadmap_note = t(p.roadmap_note); p.first_step = t(p.first_step); p.assumptions = p.assumptions.map(t);
    for (const n of p.not_recommended) n.why = t(n.why);
    for (const s of p.solutions) { s.title = t(s.title); s.why = t(s.why); s.difficulty_reason = t(s.difficulty_reason); }
    for (const q of p.questions) { q.text = t(q.text); for (const o of q.options) o.label = t(o.label); }
    for (const d of Object.values(x.details)) {
      d.deliverables_mvp = d.deliverables_mvp.map(t); d.deliverables_full = d.deliverables_full.map(t); d.needs = d.needs.map(t);
      for (const ph of d.phases) ph.deliverable = t(ph.deliverable);
      for (const r of d.risks) { r.text = t(r.text); r.mitigation = t(r.mitigation); }
      d.impact.summary = t(d.impact.summary);
      for (const i of d.impact.inputs) i.label = plainLabel(t(i.label));
      jaWage(lang, d.impact.inputs);
    }
  }
  writeFileSync('content/samurai-samples.json', JSON.stringify(file, null, 1) + '\n');
  console.log('samples: cleaned');
}
if (process.argv.includes('--lint') || process.argv.includes('--clean')) {
  let n = 0;
  for (const [lang, list] of Object.entries(J('content/samurai-samples.json').samples)) for (const x of list) for (const b of sampleProblems(x, lang)) { n++; console.log(`${lang}/${x.id}: ${b}`); }
  console.log(n ? `samples: ${n} problems` : 'samples: clean');
  process.exit(n ? 1 : 0);
}
const key = process.env.ANTHROPIC_API_KEY || (existsSync('.dev.vars') ? (readFileSync('.dev.vars', 'utf8').match(/^ANTHROPIC_API_KEY\s*=\s*"?([^"\n]+)"?/m) || [])[1] : '');
if (!key) { console.error('samples: no ANTHROPIC_API_KEY'); process.exit(1); }
const rate = existsSync('content/rate.json') ? { ...J('content/rate.json'), source: 'cbu' } : { uzs_per_usd: 12012.3, date: '2026-10-21', source: 'fallback' };
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const LANGS = (arg('--only') || 'uz,ru,en,ja').split(',');

// the six businesses (SOLUTIONS-SPEC §3.3.2); the text is the first example of the industry in each language
export const SAMPLES = [
  { id: 'clinic', industry: 'clinics', intake: { industry: 'clinics', branches: '2-5', staff: '21-100', tools: 'paper_phone', goal: 'control' } },
  // ja: the Japanese example is set in Japan (orders by phone and delivery apps, not a Telegram group)
  { id: 'restaurant', industry: 'restaurants', intake: { industry: 'restaurants', branches: '1', staff: '6-20', tools: 'telegram_group', goal: 'sales' }, ja: { tools: 'paper_phone' } },
  { id: 'education', industry: 'education', intake: { industry: 'education', branches: '1', staff: '6-20', tools: 'excel', goal: 'payments' } },
  { id: 'wholesale', industry: 'distribution', intake: { industry: 'distribution', branches: '1', staff: '21-100', tools: '1c', goal: 'sales' } },
  { id: 'beauty', industry: 'beauty', intake: { industry: 'beauty', branches: '1', staff: '6-20', tools: 'instagram', goal: 'new_customers' } },
  { id: 'freight', industry: 'logistics', intake: { industry: 'logistics', branches: '1', staff: '21-100', tools: 'paper_phone', goal: 'control' } },
].filter((s) => !arg('--id') || s.id === arg('--id'));

const intakeOf = (s, lang) => ({ ...s.intake, ...(lang === 'ja' ? { budget: 'unknown', ...s.ja } : {}) });
const strings = (v) => (typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : []);
async function one(lang, s) {
  const text = m.industries[s.industry].examples[lang][0];
  const events = [];
  const out = await runSamurai({
    m, input: { lang, intake: intakeOf(s, lang), text, preselected: [], answers: [], refine: null },
    rate, apiKey: key, signingKey: '', effort: 'low', send: (event, data) => events.push({ event, data }), log: () => {},
    randomHex: () => (fnv(`${s.id}:${lang}`) & 0xffff).toString(16).padStart(4, '0'),
  });
  if (out.status !== 'ok' || !out.pick?.solutions?.length) throw new Error(`${lang}/${s.id}: ${out.status}`);
  // "not needed yet" is read from the pick (its titles from the catalogue), so the entry carries no separate list
  const entry = { id: s.id, industry: s.industry, text, intake: intakeOf(s, lang), meta: { ...out.meta, source: 'sample' }, pick: out.pick, details: out.details };
  for (const x of strings(entry)) for (const [re, what] of BANNED) if (re.test(x)) throw new Error(`${lang}/${s.id}: ${what}: ${x}`);
  const bad = sampleProblems(entry, lang);
  if (bad.length) throw new Error(`${lang}/${s.id}: ${bad.join('; ')}`);
  console.log(`${lang}/${s.id}: ${out.pick.solutions.map((x) => x.catalogue_id).join(', ')} · ${Object.keys(out.details).length} details · ${(out.ms / 1000).toFixed(1)} s · $${out.cost.toFixed(3)}${out.partial ? ' · PARTIAL' : ''}`);
  return { entry, cost: out.cost, partial: out.partial };
}

const prev = existsSync('content/samurai-samples.json') ? J('content/samurai-samples.json') : { samples: {} };
const result = { _readme: 'Written by scripts/samurai-samples.mjs (npm run samples) through the real SamurAI pipeline. The page shows them as "Namuna" and re-prices them at load.', made: new Date().toISOString().slice(0, 10), catalogue_version: m.version, samples: { uz: [], ru: [], en: [], ja: [], ...(prev.samples || {}) } };
let cost = 0;
for (const lang of LANGS) {
  const jobs = SAMPLES.map((s) => async () => { for (let k = 0; k < 2; k++) { try { return await one(lang, s); } catch (e) { console.warn(String(e.message || e)); } } return null; });
  // three at a time: gentle on the rate limits, done in a few minutes
  const res = [];
  for (let i = 0; i < jobs.length; i += 3) res.push(...(await Promise.all(jobs.slice(i, i + 3).map((f) => f()))));
  const ok = res.filter(Boolean);
  cost += ok.reduce((a, r) => a + r.cost, 0);
  const keep = (result.samples[lang] || []).filter((x) => !ok.some((r) => r.entry.id === x.id));
  result.samples[lang] = [...keep, ...ok.map((r) => r.entry)].sort((a, b) => SAMPLES.findIndex((s) => s.id === a.id) - SAMPLES.findIndex((s) => s.id === b.id));
  writeFileSync('content/samurai-samples.json', JSON.stringify(result, null, 1) + '\n');
}
console.log(`samples: ${Object.entries(result.samples).map(([l, v]) => `${l} ${v.length}`).join(', ')} · $${cost.toFixed(2)}`);
