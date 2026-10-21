// The independent Japanese review (SEO-GEO-DECISIONS: "reviewed by a second, independent native-level reviewer").
// Collects every Japanese string the site shows (the landing dictionary JA and its META, the generated pages' chrome
// and copy, the company description) and asks a separate model call, briefed only as a native Japanese B2B editor who
// did not write the copy, whether a Japanese buyer would accept it: naturalness, register, terms buyers use, and any
// sentence that claims Japanese-speaking staff, a Japanese entity, certifications or a track record.
// Writes the review as JSON (and prints a summary). One call, about $0.10–0.20.
// Usage: node scripts/qa/ja-review.mjs [--all] <out.json>  (ANTHROPIC_API_KEY from the environment or .dev.vars)
//   --all also sends the Japanese catalogue as /ja/ publishes it (the solutions offered in Japanese: titles, one-liners,
//   scope lists, notes, what we need; scripts/pages/ja-market.mjs), the catalogue's own words (solutions-i18n SOL.ja,
//   group names and lines, industry names) and the Japanese blog posts. This is a model review: the native reviewer and
//   the owner's Japanese partner still sign off before launch (SEO-GEO-DECISIONS).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import Anthropic from '@anthropic-ai/sdk';
import { JA } from '../i18n.mjs';
import { META } from '../build-langs.mjs';
import { T } from '../pages-i18n.mjs';
import { PAGES } from '../pages/copy-company.mjs';

const out = process.argv.slice(2).find((a) => !a.startsWith('--')) || '.cache/ja-review.json';
const key = process.env.ANTHROPIC_API_KEY || (existsSync('.dev.vars') ? (readFileSync('.dev.vars', 'utf8').match(/^ANTHROPIC_API_KEY\s*=\s*"?([^"\n]+)"?/m) || [])[1] : '');
if (!key && !process.argv.includes('--dry')) { console.error('ja-review: no ANTHROPIC_API_KEY'); process.exit(2); }
const site = JSON.parse(readFileSync('content/site.json', 'utf8'));

const strip = (s) => String(s).replace(/<[^>]+>/g, '').replace(/\{(about|contact|press|privacy|home|legal)\}/g, '');
const items = [];
const add = (id, v) => { if (typeof v === 'string') items.push({ id, text: strip(v) }); else if (Array.isArray(v)) v.forEach((x, i) => add(`${id}[${i}]`, x)); else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) add(`${id}.${k}`, x); };
for (const [k, v] of Object.entries(META.ja)) if (k !== 'ogLocale') add(`landing.meta.${k}`, v);
for (const [k, v] of Object.entries(JA)) add(`landing.${k}`, v);
add('company.description', site.description.ja);
for (const [slug, def] of Object.entries(PAGES)) { add(`${slug}.gloss`, def.gloss.ja); add(slug, def.ja); }
for (const [k, v] of Object.entries(T.ja)) add(`chrome.${k}`, v);
if (process.argv.includes('--all')) {
  const { SOL, GROUP_SEO, GROUP_LINE_JA, INDUSTRY_JA } = await import('../pages/solutions-i18n.mjs');
  const { offeredIn } = await import('../pages/ja-market.mjs');
  const { normalise } = await import('../../src/shared/catalogue.js');
  const J = (f) => JSON.parse(readFileSync(f, 'utf8'));
  const model = normalise(J('content/solutions.json'), { ...J('content/solutions-extra.json'), ja_solutions: J('content/solutions-ja.json').solutions }, J('content/pricing.json'));
  const scope = J('content/solutions-scope.json').solutions;
  for (const [k, v] of Object.entries(SOL.ja)) if (typeof v !== 'function') add(`solutions.${k}`, v);
  for (const [g, v] of Object.entries(GROUP_SEO)) add(`solutions.group.${g}`, v.ja);
  for (const [g, v] of Object.entries(GROUP_LINE_JA)) add(`solutions.groupLine.${g}`, v);
  for (const [i, v] of Object.entries(INDUSTRY_JA)) add(`solutions.industry.${i}`, v);
  for (const s of model.solutions.filter((x) => offeredIn(x, 'ja', scope))) {
    const sc = scope[s.id] || {};
    add(`solution.${s.id}`, { title: s.title.ja, oneliner: s.oneliner?.ja, mvp: sc.mvp?.ja, full: sc.full?.ja, notes: sc.notes?.ja, needs: s.needs?.ja });
  }
  const { readdirSync } = await import('node:fs');
  for (const d of readdirSync('content/blog-ja').filter((x) => existsSync(`content/blog-ja/${x}/ja.md`))) {
    const md = readFileSync(`content/blog-ja/${d}/ja.md`, 'utf8');
    add(`blog.${d}`, md.replace(/\{\{[^}]*\}\}/g, '').split(/\n{2,}/).map((x) => x.trim()).filter(Boolean));
  }
}

const SYSTEM = `You are an independent, senior Japanese copy editor (a native speaker) who reviews websites of IT companies for Japanese B2B buyers: 情報システム部門, DX担当, 経営者 looking for an offshore development partner (オフショア開発, システム開発の外注). You did not write this copy and you have no stake in it. Be exact and demanding: the owner was told "never publish machine-literal Japanese", and a Japanese reader leaves at the first unnatural sentence.

Facts about the company (do not add others): Qilich (キリチ) is a new IT company with its development team in Tashkent, Uzbekistan (UTC+5, four hours behind Tokyo; five working hours overlap with the Japanese afternoon). It builds mobile apps, websites and web systems, chatbots, backend and API integration, desktop apps, IoT and AI integration, working to Japanese quality standards and Japanese ways of working (written plan first, daily 報連相, nothing released untested, kaizen after release). It has no portfolio or clients to show yet. It has NO confirmed Japanese legal entity, NO named Japanese-speaking staff and NO certifications. The contact languages listed on the site are Uzbek, Russian, English and Japanese (owner's decision). Phone +998 97 270 70 07, inbox@qilich.com.

The site's visual concept is a Japanese sword drawn as an oshigata; kanji such as 銘, 映, 土, 火, 水, 反, 研, 内曇, 鍔, 時, 納, 職人, 相談, 守 appear as single design elements with a small kana reading beside them (the "gloss" items). The landing headings are deliberately short poster lines. The privacy policy must read as a plausible Japanese プライバシーポリシー under the 個人情報保護法 (it is also marked for legal review; judge the language, and flag legal gaps briefly).

For every string, judge: natural Japanese B2B register (です・ます where it is prose; poster lines may be 体言止め), consistent terminology, words Japanese buyers actually use, punctuation and spacing between Japanese and Latin text, kinsoku-unfriendly or ambiguous phrasing, 翻訳調, and any wording that a Japanese buyer would read as claiming Japanese-speaking staff, a Japanese entity, certifications, a track record, or a guarantee. Report only strings that need a change, each with a concrete rewrite. Titles must stay 28–32 full-width characters (half-width counts 0.5) and descriptions 80–100; keep that when you rewrite them.`;

const SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['verdict', 'summary', 'issues'],
  properties: {
    verdict: { type: 'string', enum: ['accept', 'accept_with_changes', 'reject'] },
    summary: { type: 'string' },
    issues: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['id', 'severity', 'problem', 'suggestion'],
        properties: {
          id: { type: 'string' },
          severity: { type: 'string', enum: ['must', 'should', 'nit'] },
          problem: { type: 'string' },
          suggestion: { type: 'string' },
        },
      },
    },
  },
};

// --dry: list what would be sent (count per source), no model call
if (process.argv.includes('--dry')) { const by = {}; for (const i of items) { const k = i.id.split('.')[0]; by[k] = (by[k] || 0) + 1; } console.log(`ja-review: ${items.length} strings`, by); process.exit(0); }
const client = new Anthropic({ apiKey: key });
const t0 = Date.now();
const msg = await client.messages.stream({
  model: 'claude-opus-5-5',
  max_tokens: 16000,
  thinking: { type: 'adaptive' },
  output_config: { effort: 'medium', format: { type: 'json_schema', schema: SCHEMA } },
  system: SYSTEM,
  messages: [{ role: 'user', content: `Review these ${items.length} strings (id → text). Answer in English, suggestions in Japanese.\n\n${items.map((i) => `${i.id}\t${i.text}`).join('\n')}` }],
}).finalMessage();
const text = msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
const review = JSON.parse(text);
review.meta = { model: msg.model, strings: items.length, seconds: Math.round((Date.now() - t0) / 1000), usage: msg.usage, at: new Date().toISOString() };
writeFileSync(out, JSON.stringify(review, null, 1));
console.log(`ja-review: ${review.verdict}; ${review.issues.length} issue(s) (${['must', 'should', 'nit'].map((s) => `${review.issues.filter((i) => i.severity === s).length} ${s}`).join(', ')}); ${review.meta.seconds} s → ${out}`);
console.log(review.summary);
