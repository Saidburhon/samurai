// The copy lint (step 1 of the build; also `npm run lint`, which adds the built pages and assets).
// Fails on:
//   - any form of "yarat-" (Qilich builds: quramiz, ishlab chiqamiz, qilamiz)
//   - product, client or app names (no portfolio on this site)
//   - a Telegram handle or link, or any @handle other than the email
//   - an ASCII or curly quote, or a backtick, after o, O, g or G in Uzbek text (the okina is U+02BB)
//   - a Russian dash without a non-breaking space before it
//   - the generated-copy tells listed in ANTI-SLOP
//   - an ASCII apostrophe between letters in Uzbek (the okina ʻ U+02BB or the tutuq belgisi ʼ U+02BC)
// Sources: public/index.html, scripts/i18n.mjs (RU, EN, JA), the landing META, content/site.json, the generated
// pages' chrome (scripts/pages-i18n.mjs) and copy (scripts/pages/copy-company.mjs).
// --built: every built HTML page under public/ with the rules of its <html lang>, and the Japanese landing must
// have no English fallback left (a landing key without its Japanese text).
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { RU, EN, JA } from './i18n.mjs';
import { META } from './build-langs.mjs';
import { T } from './pages-i18n.mjs';
import { PAGES } from './pages/copy-company.mjs';

const built = process.argv.includes('--built');
const problems = [];
const say = (where, what, ctx) => problems.push(`${where}: ${what}${ctx ? `  «${ctx.replace(/\s+/g, ' ').slice(0, 90)}»` : ''}`);

// text a visitor or a search engine reads: text nodes and the attributes that carry words
function visible(html) {
  const out = [];
  // <wbr> (the Japanese phrase breaks) and <br class="sp"> join the words they sit between
  const h = html.replace(/<wbr>|<br class="sp">/g, '').replace(/<script(?![^>]*application\/ld\+json)[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ');
  for (const m of h.matchAll(/>([^<]+)</g)) out.push(m[1]);
  for (const m of h.matchAll(/\s(?:aria-label|alt|title|content|data-copy|placeholder)="([^"]*)"/g)) out.push(m[1]);
  for (const m of h.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) out.push(m[1]);
  return out.map((s) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'"));
}

// one list for the site and for SamurAI's copy guard (worker/guard.js)
import { BANNED, OKINA_BAD, APOS_BAD } from '../worker/copy-rules.js';
function checkText(where, text, { uz = false, ru = false } = {}) {
  for (const [re, what] of BANNED) { const m = text.match(re); if (m) say(where, what, text.slice(Math.max(0, m.index - 30), m.index + 40)); }
  if (uz) { const m = text.match(OKINA_BAD); if (m) say(where, 'a quote instead of the okina (U+02BB)', text.slice(Math.max(0, m.index - 20), m.index + 20)); }
  if (uz) { const m = text.match(APOS_BAD); if (m) say(where, 'an apostrophe in Uzbek (ʻ U+02BB after o/g, ʼ U+02BC elsewhere)', text.slice(Math.max(0, m.index - 20), m.index + 20)); }
  if (ru) { const m = text.match(/[^ ]—/); if (m && !/^\s*—/.test(text)) say(where, 'a Russian dash without a non-breaking space before it', text.slice(Math.max(0, m.index - 20), m.index + 20)); }
}

// ---- the sources ----
const src = readFileSync('public/index.html', 'utf8');
for (const t of visible(src)) checkText('public/index.html', t, { uz: true });
for (const [k, v] of Object.entries(RU)) checkText(`i18n RU ${k}`, v, { ru: true });
for (const [k, v] of Object.entries(EN)) checkText(`i18n EN ${k}`, v);
for (const [k, v] of Object.entries(JA)) checkText(`i18n JA ${k}`, v);
// every string in a nested structure (copy objects, arrays, { on, off } variants)
const strings = (v) => (typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : []);
const OPT = (lang) => ({ uz: lang === 'uz', ru: lang === 'ru' });
for (const [lang, d] of Object.entries(T)) for (const [k, v] of Object.entries(d)) for (const x of strings(v)) checkText(`pages-i18n ${lang}.${k}`, x.replace(/<[^>]+>/g, ''), OPT(lang));
for (const [slug, def] of Object.entries(PAGES)) for (const lang of ['uz', 'ru', 'en', 'ja']) for (const x of strings(def[lang])) checkText(`copy ${slug}.${lang}`, x.replace(/<[^>]+>/g, ''), OPT(lang));
const facts = JSON.parse(readFileSync('content/site.json', 'utf8'));
for (const [lang, v] of Object.entries(facts.description)) checkText(`site.json description.${lang}`, v, OPT(lang));
for (const [lang, m] of Object.entries(META)) for (const [k, v] of Object.entries(m)) for (const s of [].concat(v)) checkText(`META ${lang}.${k}`, s, { uz: lang === 'uz', ru: lang === 'ru' });
// SamurAI and the catalogue overlay: every string per language (content/solutions-extra.json, content/pricing.json,
// content/solutions-ja.json, content/samurai-samples.json); the samples were guarded when they were made, this checks them again
for (const f of ['content/solutions-extra.json', 'content/pricing.json']) {
  const walkJ = (v, lang, where) => { if (typeof v === 'string') checkText(`${f} ${where}`, v, OPT(lang)); else if (Array.isArray(v)) v.forEach((x, i) => walkJ(x, lang, `${where}[${i}]`)); else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walkJ(x, ['uz', 'ru', 'en', 'ja'].includes(k) ? k : lang, `${where}.${k}`); };
  walkJ(JSON.parse(readFileSync(f, 'utf8')), 'en', '');
}
if (existsSync('content/solutions-ja.json')) for (const x of strings(JSON.parse(readFileSync('content/solutions-ja.json', 'utf8')).solutions)) checkText('solutions-ja', x, OPT('ja'));
if (existsSync('content/samurai-samples.json')) {
  const S = JSON.parse(readFileSync('content/samurai-samples.json', 'utf8'));
  for (const [lang, list] of Object.entries(S.samples || {})) for (const x of strings(list)) checkText(`samurai-samples ${lang}`, x, OPT(lang));
}
for (const f of ['public/404.html']) if (existsSync(f)) for (const t of visible(readFileSync(f, 'utf8'))) checkText(f, t);

// ---- the built site (npm run lint) ----
if (built) {
  const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
  for (const f of walk('public').filter((x) => x.endsWith('.html'))) {
    const html = readFileSync(f, 'utf8');
    const lang = (html.match(/<html lang="([a-z]+)"/) || [])[1] || 'uz';
    if (f === 'public/404.html') continue; // all languages at once; checked above
    const opt = OPT(lang);
    for (const t of visible(html)) checkText(f, t, opt);
    // the other pages carry no Uzbek: an okina outside lang="uz" text means an untranslated string
    if (!opt.uz) {
      const body = html.replace(/<head>[\s\S]*?<\/head>/, '').replace(/<a [^>]*lang="uz"[^>]*>[\s\S]*?<\/a>/g, '');
      for (const t of visible(body)) if (t.includes('ʻ')) say(f, 'Uzbek text on a translated page', t);
    }
    // a landing key that fell back to English on the Japanese page (build-langs marks it lang="en")
    if (lang === 'ja') for (const m of html.matchAll(/data-i18n(?:-label)?="([\w.]+)"[^>]*lang="en"/g)) say(f, `no Japanese text for ${m[1]} (scripts/i18n.mjs JA)`);
  }
  for (const f of [...walk('public'), ...walk('src')]) {
    if (!/\.(html|svg|css|js|mjs|json|xml|txt)$/.test(f)) continue;
    const t = readFileSync(f, 'utf8');
    for (const [re, what] of BANNED.slice(0, 3)) { const m = t.match(re); if (m) say(f, what, t.slice(Math.max(0, m.index - 30), m.index + 40)); }
  }
}

if (problems.length) {
  console.error(`lint-copy: ${problems.length} problem(s)\n  ` + problems.join('\n  '));
  process.exit(1);
}
console.log(`lint-copy: ok${built ? ' (sources and built pages)' : ''}`);
