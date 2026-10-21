// npm run samples: the six example businesses × four languages, made through the real SamurAI pipeline
// (worker/samurai.js under Node, the live model), validated and written to content/samurai-samples.json, which is
// committed. The page renders them instantly, labelled "Namuna", re-priced with the catalogue and the rate of the day.
// Cost: about $0.12 per sample on a warm cache (≈ $3 for all). The key comes from ANTHROPIC_API_KEY or .dev.vars.
// Usage: node scripts/samurai-samples.mjs [--only uz,ru] [--id clinic]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { normalise, fnv } from '../src/shared/catalogue.js';
import { runSamurai } from '../worker/samurai.js';
import { BANNED } from '../worker/copy-rules.js';

const J = (p) => JSON.parse(readFileSync(p, 'utf8'));
const m = normalise(J('content/solutions.json'), J('content/solutions-extra.json'), J('content/pricing.json'));
const key = process.env.ANTHROPIC_API_KEY || (existsSync('.dev.vars') ? (readFileSync('.dev.vars', 'utf8').match(/^ANTHROPIC_API_KEY\s*=\s*"?([^"\n]+)"?/m) || [])[1] : '');
if (!key) { console.error('samples: no ANTHROPIC_API_KEY'); process.exit(1); }
const rate = existsSync('content/rate.json') ? { ...J('content/rate.json'), source: 'cbu' } : { uzs_per_usd: 12012.3, date: '2026-10-21', source: 'fallback' };
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const LANGS = (arg('--only') || 'uz,ru,en,ja').split(',');

// the six businesses (SOLUTIONS-SPEC §3.3.2); the text is the first example of the industry in each language
export const SAMPLES = [
  { id: 'clinic', industry: 'clinics', intake: { industry: 'clinics', branches: '2-5', staff: '21-100', tools: 'paper_phone', goal: 'control' } },
  { id: 'restaurant', industry: 'restaurants', intake: { industry: 'restaurants', branches: '1', staff: '6-20', tools: 'telegram_group', goal: 'sales' } },
  { id: 'education', industry: 'education', intake: { industry: 'education', branches: '1', staff: '6-20', tools: 'excel', goal: 'payments' } },
  { id: 'wholesale', industry: 'distribution', intake: { industry: 'distribution', branches: '1', staff: '21-100', tools: '1c', goal: 'sales' } },
  { id: 'beauty', industry: 'beauty', intake: { industry: 'beauty', branches: '1', staff: '6-20', tools: 'instagram', goal: 'new_customers' } },
  { id: 'freight', industry: 'logistics', intake: { industry: 'logistics', branches: '1', staff: '21-100', tools: 'paper_phone', goal: 'control' } },
].filter((s) => !arg('--id') || s.id === arg('--id'));

const strings = (v) => (typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : []);
async function one(lang, s) {
  const text = m.industries[s.industry].examples[lang][0];
  const events = [];
  const out = await runSamurai({
    m, input: { lang, intake: { ...s.intake, ...(lang === 'ja' ? { budget: 'unknown' } : {}) }, text, preselected: [], answers: [], refine: null },
    rate, apiKey: key, signingKey: '', effort: 'low', send: (event, data) => events.push({ event, data }), log: () => {},
    randomHex: () => (fnv(`${s.id}:${lang}`) & 0xffff).toString(16).padStart(4, '0'),
  });
  if (out.status !== 'ok' || !out.pick?.solutions?.length) throw new Error(`${lang}/${s.id}: ${out.status}`);
  const nr = events.find((e) => e.event === 'not_recommended')?.data || [];
  const entry = { id: s.id, industry: s.industry, text, intake: s.intake, meta: { ...out.meta, source: 'sample' }, pick: out.pick, details: out.details, nr };
  for (const x of strings(entry)) for (const [re, what] of BANNED) if (re.test(x)) throw new Error(`${lang}/${s.id}: ${what}: ${x}`);
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
