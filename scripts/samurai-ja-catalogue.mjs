// npm run ja:catalogue: the Japanese title and one-line value of every catalogue solution, written once by the model
// from the English and Russian catalogue text and committed as content/solutions-ja.json. content/solutions.json has
// no Japanese yet; until it does, src/shared/catalogue.js reads this file (passed as extra.ja_solutions) so the
// Japanese page shows Japanese titles in the catalogue matcher, the samples and the plan, never English ones.
// The catalogue stays authoritative: once content/solutions.json carries title.ja / value.ja, those win.
// Every string passes the copy guard; the file is for a native reviewer before it ships (open issue in the gate).
// Cost: two calls, about $0.4. Usage: node scripts/samurai-ja-catalogue.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import Anthropic from '@anthropic-ai/sdk';
import { guard } from '../worker/guard.js';
import { costUsd } from '../worker/samurai.js';

const J = (p) => JSON.parse(readFileSync(p, 'utf8'));
const cat = J('content/solutions.json');
const key = process.env.ANTHROPIC_API_KEY || (existsSync('.dev.vars') ? (readFileSync('.dev.vars', 'utf8').match(/^ANTHROPIC_API_KEY\s*=\s*"?([^"\n]+)"?/m) || [])[1] : '');
if (!key) { console.error('ja:catalogue: no ANTHROPIC_API_KEY'); process.exit(1); }
const client = new Anthropic({ apiKey: key, maxRetries: 2, timeout: 300_000 });

const SYSTEM = `You write the Japanese catalogue lines of Qilich, an IT development company in Tashkent, Uzbekistan, for Japanese companies looking for an offshore development partner (オフショア開発) and for Japanese readers of the site.
For every catalogue entry you get an id, the English title and value line, and the Russian ones. Write:
- title: the Japanese name of the solution as a Japanese company would search for it, at most 28 full-width characters. Natural business Japanese, not a literal translation. Keep the names of products, services and platforms exactly as given (Telegram, Instagram, Click, Payme, 1C, amoCRM, Bitrix24, Excel, Google Sheets, iiko, R-Keeper and the like); write "MVP" and "AI" in Latin letters.
- oneliner: one sentence of plain Japanese (である調ではなく、体言止めか「〜します」), at most 60 full-width characters, saying what the solution does for the business. Keep the facts of the source line: no new promises, no numbers that are not in it, no claims about Japanese-speaking staff, Japanese offices or certifications, no superlatives.
Return every id you were given, once, unchanged.`;

const schema = {
  type: 'object', additionalProperties: false, required: ['items'],
  properties: { items: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['id', 'title', 'oneliner'], properties: { id: { type: 'string' }, title: { type: 'string' }, oneliner: { type: 'string' } } } } },
};

async function batch(list) {
  const lines = list.map((s) => `${s.id}\nEN: ${s.title.en} — ${s.value.en}\nRU: ${s.title.ru} — ${s.value.ru}`).join('\n\n');
  const msg = await client.messages.stream({
    model: 'claude-opus-5-5', max_tokens: 16000, system: SYSTEM,
    output_config: { effort: 'low', format: { type: 'json_schema', schema } },
    messages: [{ role: 'user', content: lines }],
  }).finalMessage();
  const text = msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  const u = msg.usage;
  const cost = costUsd(u, 'claude-opus-5-5');
  return { items: JSON.parse(text).items, cost, stop: msg.stop_reason };
}

const fw = (s) => [...s].reduce((a, c) => a + (/[\x20-\x7e]/.test(c) ? 0.5 : 1), 0);
const all = cat.solutions;
const half = Math.ceil(all.length / 2);
const res = await Promise.all([batch(all.slice(0, half)), batch(all.slice(half))]);
const out = {};
const problems = [];
for (const r of res) {
  if (r.stop !== 'end_turn') problems.push(`stop ${r.stop}`);
  for (const it of r.items) {
    if (!all.some((s) => s.id === it.id) || out[it.id]) { problems.push(`unknown or repeated id ${it.id}`); continue; }
    const title = guard(it.title, 'ja'), oneliner = guard(it.oneliner, 'ja');
    if (!title || !oneliner || !/[぀-ヿ一-鿿]/u.test(title + oneliner)) { problems.push(`${it.id}: dropped by the guard or not Japanese`); continue; }
    if (fw(title) > 34 || fw(oneliner) > 75) problems.push(`${it.id}: long (${fw(title)}/${fw(oneliner)})`);
    out[it.id] = { title, oneliner };
  }
}
const missing = all.filter((s) => !out[s.id]).map((s) => s.id);
const file = {
  _readme: 'Written by scripts/samurai-ja-catalogue.mjs from the English and Russian catalogue lines; needs a native reviewer. content/solutions.json wins once it has Japanese.',
  made: new Date().toISOString().slice(0, 10),
  solutions: Object.fromEntries(all.filter((s) => out[s.id]).map((s) => [s.id, out[s.id]])),
};
writeFileSync('content/solutions-ja.json', JSON.stringify(file, null, 1) + '\n');
console.log(`ja:catalogue: ${Object.keys(out).length}/${all.length}, missing ${missing.length ? missing.join(', ') : 'none'}, $${res.reduce((a, r) => a + r.cost, 0).toFixed(2)}`);
for (const p of problems) console.log(`  ${p}`);
process.exit(missing.length ? 1 : 0);
