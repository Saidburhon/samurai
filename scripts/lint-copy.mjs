// The copy lint (step 1 of the build; also `npm run lint`, which adds the built pages and assets).
// Fails on:
//   - any form of "yarat-" (Qilich builds: quramiz, ishlab chiqamiz, qilamiz)
//   - product, client or app names (no portfolio on this site)
//   - a Telegram handle or link, or any @handle other than the email
//   - an ASCII or curly quote, or a backtick, after o, O, g or G in Uzbek text (the okina is U+02BB)
//   - a Russian dash without a non-breaking space before it
//   - the generated-copy tells listed in ANTI-SLOP
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { RU, EN } from './i18n.mjs';
import { META } from './build-langs.mjs';

const built = process.argv.includes('--built');
const problems = [];
const say = (where, what, ctx) => problems.push(`${where}: ${what}${ctx ? `  «${ctx.replace(/\s+/g, ' ').slice(0, 90)}»` : ''}`);

// text a visitor or a search engine reads: text nodes and the attributes that carry words
function visible(html) {
  const out = [];
  const h = html.replace(/<script(?![^>]*application\/ld\+json)[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ');
  for (const m of h.matchAll(/>([^<]+)</g)) out.push(m[1]);
  for (const m of h.matchAll(/\s(?:aria-label|alt|title|content|data-copy|placeholder)="([^"]*)"/g)) out.push(m[1]);
  for (const m of h.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) out.push(m[1]);
  return out.map((s) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'"));
}

const BANNED = [
  [/yarat/i, 'a form of "yaratish"'],
  [/hoglt|pool\s*timer|club\s*time|tikoncha/i, 'a product name'],
  [/t\.me\/|telegram\.me\//i, 'a Telegram link'],
  [/(^|[^\w."])@(?!qilich\.com)[a-z0-9_]{3,}/i, 'an @handle'],
  [/\b(we craft|craft(ing)? digital|innovative|cutting-edge|seamless|empower|elevate|synergy|world-class|next-level|unleash)\b/i, 'a generated-copy tell'],
];
function checkText(where, text, { uz = false, ru = false } = {}) {
  for (const [re, what] of BANNED) { const m = text.match(re); if (m) say(where, what, text.slice(Math.max(0, m.index - 30), m.index + 40)); }
  if (uz) { const m = text.match(/[oOgG]['‘’`]/); if (m) say(where, 'a quote instead of the okina (U+02BB)', text.slice(Math.max(0, m.index - 20), m.index + 20)); }
  if (ru) { const m = text.match(/[^ ]—/); if (m && !/^\s*—/.test(text)) say(where, 'a Russian dash without a non-breaking space before it', text.slice(Math.max(0, m.index - 20), m.index + 20)); }
}

// ---- the sources ----
const src = readFileSync('public/index.html', 'utf8');
for (const t of visible(src)) checkText('public/index.html', t, { uz: true });
for (const [k, v] of Object.entries(RU)) checkText(`i18n RU ${k}`, v, { ru: true });
for (const [k, v] of Object.entries(EN)) checkText(`i18n EN ${k}`, v);
for (const [lang, m] of Object.entries(META)) for (const [k, v] of Object.entries(m)) for (const s of [].concat(v)) checkText(`META ${lang}.${k}`, s, { uz: lang === 'uz', ru: lang === 'ru' });
for (const f of ['public/404.html']) if (existsSync(f)) for (const t of visible(readFileSync(f, 'utf8'))) checkText(f, t);

// ---- the built site (npm run lint) ----
if (built) {
  for (const [f, opt] of [['public/index.html', { uz: true }], ['public/ru/index.html', { ru: true }], ['public/en/index.html', {}]]) {
    const html = readFileSync(f, 'utf8');
    for (const t of visible(html)) checkText(f, t, opt);
    // the other pages carry no Uzbek: an okina outside lang="uz" text means an untranslated string
    if (!opt.uz) {
      const body = html.replace(/<head>[\s\S]*?<\/head>/, '').replace(/<a [^>]*lang="uz"[^>]*>[^<]*<\/a>/g, '');
      for (const t of visible(body)) if (t.includes('ʻ')) say(f, 'Uzbek text on a translated page', t);
    }
  }
  const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
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
