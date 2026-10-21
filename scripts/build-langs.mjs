// Builds the Russian, English and Japanese landing pages from the Uzbek one, so search engines see all four languages.
//   public/index.html      Uzbek, edited by hand (its head data is refreshed here too)
//   public/ru/index.html   generated
//   public/en/index.html   generated
//   public/ja/index.html   generated; its text is an original Japanese page for companies looking for an offshore
//                          development partner (scripts/i18n.mjs JA), not a translation of the Uzbek
// Every head gets the same treatment as the generated pages (scripts/site.mjs headLinks, scripts/pages/ld.mjs):
// a self canonical, reciprocal hreflang for the four homes plus x-default (→ /en/), og:locale with its alternates,
// one JSON-LD @graph, and the language switch with each name in its own script.
// The sitemaps are written by writeSitemaps() (below), which scripts/build-pages.mjs calls with every page.
// Run by scripts/build.mjs (npm run build). Fails on a key missing from the ru or en dictionary, and on a dictionary
// key the page no longer uses. Japanese keys only warn here (the landing is built in parallel and a new landing key
// must not break the build), and fall back to English marked lang="en"; `npm run lint` and scripts/qa/seo-check.mjs
// fail on them.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { EN, RU, JA } from './i18n.mjs';
import { SITE, LANGS, HOME, LOCALE, abs, esc, langNav, headLinks, pathOf, site } from './site.mjs';
import { graph } from './pages/ld.mjs';
import { hasBlog, feedPath } from './pages/blog-feed.mjs';
import { T } from './pages-i18n.mjs';
import { CATALOGUE_BASE } from '../src/shared/catalogue.js';

export { SITE };
export const PATH = HOME;
const DICT = { ru: RU, en: EN, ja: JA };
const SOFT = new Set(['ja']);
export const softProblems = [];

// what search engines and link previews show, per language (§7.7; Japanese: SEO-GEO-DECISIONS, titles 28–32 and
// descriptions 80–100 full-width characters). No product names, nothing invented.
export const META = {
  uz: {
    title: 'Qilich — yapon IT agenstvasi Toshkentda: ilovalar, saytlar, botlar',
    description: 'Yapon IT agenstvasi endi Oʻzbekistonda: iOS va Android ilovalar, saytlar, Telegram-botlar, backend, IoT va AI. Yapon sifati, Toshkent narxi.',
    ogTitle: 'Qilich — Yapon IT agenstvasi endi Oʻzbekistonda!',
    ogDescription: 'Ilovalar, saytlar, botlar va tizimlarni yapon standartlarida quramiz. Toshkent.',
    home: 'Bosh sahifa',
  },
  ru: {
    title: 'Qilich\u00a0— японское IT-агентство в Ташкенте: приложения, сайты, боты',
    description: 'Японское IT-агентство теперь в Узбекистане: приложения для iOS и Android, сайты, Telegram-боты, бэкенд, IoT и ИИ. Японское качество, ташкентские цены.',
    ogTitle: 'Qilich\u00a0— японское IT-агентство теперь в Узбекистане!',
    ogDescription: 'Строим приложения, сайты, ботов и системы по японским стандартам. Ташкент.',
    home: 'Главная',
  },
  en: {
    title: 'Qilich — a Japanese IT agency in Tashkent: apps, websites, bots',
    description: 'A Japanese IT agency, now in Uzbekistan: iOS and Android apps, websites, Telegram bots, backend, IoT and AI. Japanese quality, Tashkent prices.',
    ogTitle: 'Qilich — a Japanese IT agency, now in Uzbekistan!',
    ogDescription: 'We build apps, websites, bots and systems to Japanese standards. Tashkent.',
    home: 'Home',
  },
  ja: {
    title: 'ウズベキスタンのオフショア開発｜日本品質の開発チーム Qilich',
    description: 'ウズベキスタン・タシケントの開発チームが、アプリ、Webシステム、業務システム、AI連携を日本の品質水準で開発します。東京との時差は4時間で、日本時間の午後に業務時間が5時間重なります。',
    ogTitle: 'Qilich｜日本品質のオフショア開発を、ウズベキスタンから。',
    ogDescription: 'タシケントの開発チームが、アプリと業務システムを日本の品質水準で開発します。報告・連絡・相談は毎日。',
    home: 'ホーム',
  },
};
for (const [l, m] of Object.entries(META)) m.ogLocale = LOCALE[l];

// head: <html lang>, every tag marked data-meta="key", hreflang, og:locale:alternate, the JSON-LD and the switch
export function head(html, lang) {
  const m = META[lang], url = abs(HOME[lang]);
  const page = { lang, path: HOME[lang], type: 'WebPage', title: m.title, description: m.description, crumbs: [], mainEntity: `${SITE}/#organization` };
  const values = { ...m, url, canonical: url, ogImage: `${SITE}/assets/img/og-${lang}.png`, ld: JSON.stringify(graph(page)) };
  const links = headLinks({ lang, path: HOME[lang], twins: HOME, title: m.title, description: m.description });
  html = html.replace(/<html lang="[a-z]+"/, `<html lang="${lang}"`);
  html = html.replace(/<title data-meta="title">[^<]*<\/title>/, `<title data-meta="title">${esc(values.title)}</title>`);
  html = html.replace(/<script type="application\/ld\+json" data-meta="ld">[\s\S]*?<\/script>/,
    () => `<script type="application/ld+json" data-meta="ld">${values.ld.replace(/</g, '\\u003c')}</script>`);
  html = html.replace(/<(meta|link)([^>]*?) data-meta="(\w+)"([^>]*?)(content|href)="[^"]*"/g,
    (all, tag, a, key, b, attr) => (key in values ? `<${tag}${a} data-meta="${key}"${b}${attr}="${esc(values[key])}"` : all));
  // hreflang: the four homes and x-default, written whole after the canonical
  html = html.replace(/<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n?/g, '')
    .replace(/(<link rel="canonical"[^>]*>\n?)/, (c) => `${c.endsWith('\n') ? c : c + '\n'}${links.alternates}\n`);
  // the blog's feed in this language (SOLUTIONS-SPEC §5.4: every page carries it), written whole after the hreflang
  html = html.replace(/<link rel="alternate" type="application\/rss\+xml"[^>]*>\n?/g, '');
  if (hasBlog(lang)) html = html.replace(/(<link rel="alternate" hreflang="x-default"[^>]*>\n?)/, (c) => `${c.endsWith('\n') ? c : c + '\n'}<link rel="alternate" type="application/rss+xml" title="${esc(T[lang].blogFeed)}" href="${abs(feedPath(lang))}">\n`);
  // og:locale:alternate after og:locale
  const alt = LANGS.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${LOCALE[l]}">`).join('\n');
  html = html.replace(/<meta property="og:locale:alternate"[^>]*>\n?/g, '')
    .replace(/(<meta property="og:locale"[^>]*>\n?)/, (c) => `${c.endsWith('\n') ? c : c + '\n'}${alt}\n`);
  // every language switch (top bar, menu, footer), regenerated whole
  html = html.replace(/<nav class="lang"[\s\S]*?<\/nav>/g, () => langNav(lang, HOME));
  // links to the generated pages (footer): <a href="/about/" data-page="about"> points at this language's twin
  // (the Solutions catalogue and the price list have a slug of their own per language: /ru/resheniya/, /ja/prices/)
  const own = { solutions: CATALOGUE_BASE, prices: { uz: '/narxlar/', ru: '/ru/tseny/', en: '/en/prices/', ja: '/ja/prices/' } };
  html = html.replace(/<a href="[^"]*" data-page="([\w-]+)"/g, (a, slug) => `<a href="${own[slug]?.[lang] || pathOf(lang, slug)}" data-page="${slug}"`);
  return html;
}

// the keys the page uses
export function keysOf(html) {
  const keys = new Set();
  for (const m of html.matchAll(/\sdata-i18n="([\w.]+)"/g)) keys.add(m[1]);
  for (const m of html.matchAll(/\sdata-i18n-label="([\w.]+)"/g)) keys.add(m[1]);
  return keys;
}

// body: every [data-i18n] element's content and every [data-i18n-label] aria-label
function body(html, lang) {
  const dict = DICT[lang];
  const missing = [];
  const pick = (key) => {
    if (key in dict) return { text: dict[key] };
    missing.push(key);
    if (SOFT.has(lang) && key in EN) return { text: EN[key], lang: 'en' };
    return null;
  };
  html = html.replace(/(<(\w+)\b[^>]*\sdata-i18n="([\w.]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g, (all, open, tag, key, inner, close) => {
    const p = pick(key);
    if (!p) return all;
    return (p.lang ? open.replace(/>$/, ` lang="${p.lang}">`) : open) + p.text + close;
  });
  html = html.replace(/(<[^>]*?)aria-label="[^"]*"([^>]*?data-i18n-label="([\w.]+)")/g, (all, a, b, key) => {
    const p = pick(key);
    return p ? `${a}aria-label="${esc(p.text)}"${b}` : all;
  });
  html = html.replace(/(<[^>]*?data-i18n-label="([\w.]+)"[^>]*?)aria-label="[^"]*"/g, (all, a, key) => {
    const p = pick(key);
    return p ? `${a}aria-label="${esc(p.text)}"` : all;
  });
  if (missing.length) {
    const msg = `${lang}: missing text for ${[...new Set(missing)].join(', ')}`;
    if (!SOFT.has(lang)) throw new Error(msg);
    softProblems.push(msg + ' (English used; add the Japanese to scripts/i18n.mjs JA)');
    console.warn(`langs: WARNING ${msg} (English used, marked lang="en"; add the Japanese to scripts/i18n.mjs JA)`);
  }
  return html;
}

export function buildLangs() {
  const src = readFileSync('public/index.html', 'utf8');
  // a key in a dictionary that the page does not use is a bug (a renamed or deleted element)
  const used = keysOf(src);
  for (const [lang, dict] of Object.entries(DICT)) {
    const orphans = Object.keys(dict).filter((k) => !used.has(k));
    if (!orphans.length) continue;
    const msg = `${lang}: dictionary keys absent from public/index.html: ${orphans.join(', ')}`;
    if (!SOFT.has(lang)) throw new Error(msg);
    softProblems.push(msg);
    console.warn(`langs: WARNING ${msg}`);
  }
  writeFileSync('public/index.html', head(src, 'uz'));
  for (const lang of LANGS.filter((l) => l !== 'uz')) {
    mkdirSync(`public/${lang}`, { recursive: true });
    const out = body(head(src, lang), lang).replace('<!doctype html>', '<!doctype html>\n<!-- Generated by scripts/build-langs.mjs from public/index.html. Do not edit by hand. -->');
    writeFileSync(`public/${lang}/index.html`, out);
  }
  const entries = LANGS.map((lang) => ({ lang, path: HOME[lang], file: lang === 'uz' ? 'public/index.html' : `public/${lang}/index.html` }));
  writeSitemaps(entries);
  console.log(`langs: ${LANGS.join(', ')}`);
  return entries;
}

// ---- sitemaps ----------------------------------------------------------------------------------------------------
// /sitemap.xml is a sitemap index with one sitemap per language (/sitemaps/<lang>.xml): canonical 200 URLs only,
// each with its real lastmod, no xhtml:link, no priority or changefreq (SEO-GEO-DECISIONS).
// lastmod: an entry may carry its own (a blog post's `updated`); otherwise it is the day the page's words last
// changed, kept in content/lastmod.json by a hash of the page's text (title, description, visible text, labels),
// so a rebuild that changes only asset hashes or fonts does not touch it. Days are Tashkent days.
const LASTMOD = 'content/lastmod.json';
export const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: site.contact.timeZone || 'Asia/Tashkent', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
export function contentText(html) {
  const head = html.match(/<head>[\s\S]*?<\/head>/)?.[0] || '';
  const t = [(head.match(/<title[^>]*>([^<]*)<\/title>/) || [])[1], (head.match(/<meta name="description"[^>]*content="([^"]*)"/) || [])[1]];
  const b = html.replace(/<head>[\s\S]*?<\/head>/, '').replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<svg[\s\S]*?<\/svg>/g, ' ');
  for (const m of b.matchAll(/>([^<]+)</g)) t.push(m[1]);
  for (const m of b.matchAll(/\s(?:aria-label|alt|title|placeholder)="([^"]*)"/g)) t.push(m[1]);
  return t.filter(Boolean).join('\u0001').replace(/\s+/g, ' ').trim();
}
export function lastmods(entries) {
  const db = existsSync(LASTMOD) ? JSON.parse(readFileSync(LASTMOD, 'utf8')) : {};
  const day = today();
  let changed = false;
  const out = {};
  for (const e of entries) {
    if (e.lastmod) { out[e.path] = e.lastmod; continue; }
    const h = createHash('sha256').update(contentText(readFileSync(e.file, 'utf8'))).digest('hex').slice(0, 16);
    if (!db[e.path] || db[e.path].h !== h) { db[e.path] = { h, d: day }; changed = true; }
    out[e.path] = db[e.path].d;
  }
  if (changed) writeFileSync(LASTMOD, JSON.stringify(Object.fromEntries(Object.entries(db).sort(([a], [b]) => a.localeCompare(b))), null, 1) + '\n');
  return out;
}
export function writeSitemaps(entries) {
  const mods = lastmods(entries);
  mkdirSync('public/sitemaps', { recursive: true });
  const index = [];
  for (const lang of LANGS) {
    const mine = entries.filter((e) => e.lang === lang && !e.noindex).sort((a, b) => a.path.localeCompare(b.path));
    if (!mine.length) continue;
    const urls = mine.map((e) => `  <url>\n    <loc>${esc(abs(e.path))}</loc>\n    <lastmod>${mods[e.path]}</lastmod>\n  </url>`);
    writeFileSync(`public/sitemaps/${lang}.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
    index.push({ loc: `${SITE}/sitemaps/${lang}.xml`, lastmod: mine.map((e) => mods[e.path]).sort().pop() });
  }
  writeFileSync('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${index.map((s) => `  <sitemap>\n    <loc>${s.loc}</loc>\n    <lastmod>${s.lastmod}</lastmod>\n  </sitemap>`).join('\n')}\n</sitemapindex>\n`);
  return mods;
}

if (import.meta.url === `file://${process.argv[1]}`) buildLangs();
