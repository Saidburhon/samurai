// Builds the Russian and English pages from the Uzbek one, so search engines see all three languages.
//   public/index.html      Uzbek, edited by hand (its head data is refreshed here too)
//   public/ru/index.html   generated
//   public/en/index.html   generated
//   public/sitemap.xml     generated
// Run by scripts/build.mjs (npm run build). Fails on a key missing from a dictionary, and on a dictionary key
// the page no longer uses.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { EN, RU } from './i18n.mjs';

export const SITE = 'https://qilich.com';
export const PATH = { uz: '/', ru: '/ru/', en: '/en/' };
const DICT = { ru: RU, en: EN };

// what search engines and link previews show, per language (§7.7). No product names, nothing invented.
export const META = {
  uz: {
    title: 'Qilich — yapon IT agenstvasi Toshkentda: ilovalar, saytlar, botlar',
    description: 'Yapon IT agenstvasi endi Oʻzbekistonda: iOS va Android ilovalar, saytlar, Telegram-botlar, backend, IoT va AI. Yapon sifati, Toshkent narxi.',
    ogTitle: 'Qilich — Yapon IT agenstvasi endi Oʻzbekistonda!',
    ogDescription: 'Ilovalar, saytlar, botlar va tizimlarni yapon standartlarida quramiz. Toshkent.',
    ogLocale: 'uz_UZ',
    services: ['iOS va Android ilovalar', 'Saytlar va veb-platformalar', 'Telegram-botlar', 'Backend va integratsiyalar', 'Desktop ilovalar', 'IoT yechimlar', 'AI integratsiyasi'],
  },
  ru: {
    title: 'Qilich\u00a0— японское IT-агентство в Ташкенте: приложения, сайты, боты',
    description: 'Японское IT-агентство теперь в Узбекистане: приложения для iOS и Android, сайты, Telegram-боты, бэкенд, IoT и ИИ. Японское качество, ташкентские цены.',
    ogTitle: 'Qilich\u00a0— японское IT-агентство теперь в Узбекистане!',
    ogDescription: 'Строим приложения, сайты, ботов и системы по японским стандартам. Ташкент.',
    ogLocale: 'ru_RU',
    services: ['Приложения для iOS и Android', 'Сайты и веб-платформы', 'Telegram-боты', 'Бэкенд и интеграции', 'Десктопные приложения', 'IoT-решения', 'Интеграция ИИ'],
  },
  en: {
    title: 'Qilich — a Japanese IT agency in Tashkent: apps, websites, bots',
    description: 'A Japanese IT agency, now in Uzbekistan: iOS and Android apps, websites, Telegram bots, backend, IoT and AI. Japanese quality, Tashkent prices.',
    ogTitle: 'Qilich — a Japanese IT agency, now in Uzbekistan!',
    ogDescription: 'We build apps, websites, bots and systems to Japanese standards. Tashkent.',
    ogLocale: 'en_US',
    services: ['iOS and Android apps', 'Websites and web platforms', 'Telegram bots', 'Backend and integrations', 'Desktop apps', 'IoT solutions', 'AI integration'],
  },
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function ld(lang) {
  const m = META[lang], url = SITE + PATH[lang];
  const address = { '@type': 'PostalAddress', addressLocality: 'Tashkent', addressCountry: 'UZ' };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization', '@id': SITE + '/#org', name: 'Qilich', url: SITE + '/',
        logo: SITE + '/assets/img/logo-512.png', email: 'inbox@qilich.com', telephone: '+998972707007',
        slogan: ((t) => t[0].toUpperCase() + t.slice(1))(m.ogTitle.replace(/^Qilich\s—\s/, '')), address, knowsLanguage: ['uz', 'ru', 'en', 'ja'],
      },
      {
        '@type': 'ProfessionalService', '@id': SITE + '/#service', name: 'Qilich', url,
        description: m.description, image: `${SITE}/assets/img/og-${lang}.png`,
        email: 'inbox@qilich.com', telephone: '+998972707007', address,
        areaServed: [{ '@type': 'City', name: 'Tashkent' }, { '@type': 'Country', name: 'Uzbekistan' }],
        availableLanguage: ['uz', 'ru', 'en'],
        parentOrganization: { '@id': SITE + '/#org' },
        hasOfferCatalog: {
          '@type': 'OfferCatalog', name: 'Qilich',
          itemListElement: m.services.map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
        },
      },
      { '@type': 'WebSite', '@id': SITE + '/#website', url: SITE + '/', name: 'Qilich', inLanguage: lang, publisher: { '@id': SITE + '/#org' } },
    ],
  };
}

// head: <html lang>, every tag marked data-meta="key", and the current language in every nav.lang
export function head(html, lang) {
  const m = META[lang], url = SITE + PATH[lang];
  const values = { ...m, url, canonical: url, ogImage: `${SITE}/assets/img/og-${lang}.png`, ld: JSON.stringify(ld(lang)) };
  html = html.replace(/<html lang="[a-z]+"/, `<html lang="${lang}"`);
  html = html.replace(/<title data-meta="title">[^<]*<\/title>/, `<title data-meta="title">${esc(values.title)}</title>`);
  html = html.replace(/<script type="application\/ld\+json" data-meta="ld">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" data-meta="ld">${values.ld.replace(/</g, '\\u003c')}</script>`);
  html = html.replace(/<(meta|link)([^>]*?) data-meta="(\w+)"([^>]*?)(content|href)="[^"]*"/g,
    (all, tag, a, key, b, attr) => (key in values ? `<${tag}${a} data-meta="${key}"${b}${attr}="${esc(values[key])}"` : all));
  html = html.replace(/(<nav class="lang"[\s\S]*?<\/nav>)/g, (nav) => nav
    .replace(/ aria-current="page"/g, '')
    .replace(new RegExp(`(<a href="${PATH[lang].replace(/\//g, '\\/')}" hreflang="${lang}")`), '$1 aria-current="page"'));
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
  html = html.replace(/(<(\w+)\b[^>]*\sdata-i18n="([\w.]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g, (all, open, tag, key, inner, close) => {
    if (!(key in dict)) { missing.push(key); return all; }
    return open + dict[key] + close;
  });
  html = html.replace(/(<[^>]*?)aria-label="[^"]*"([^>]*?data-i18n-label="([\w.]+)")/g, (all, a, b, key) => {
    if (!(key in dict)) { missing.push(key); return all; }
    return `${a}aria-label="${esc(dict[key])}"${b}`;
  });
  html = html.replace(/(<[^>]*?data-i18n-label="([\w.]+)"[^>]*?)aria-label="[^"]*"/g, (all, a, key) => {
    if (!(key in dict)) { missing.push(key); return all; }
    return `${a}aria-label="${esc(dict[key])}"`;
  });
  if (missing.length) throw new Error(`${lang}: missing text for ${[...new Set(missing)].join(', ')}`);
  return html;
}

export function buildLangs() {
  const src = readFileSync('public/index.html', 'utf8');
  // a key in a dictionary that the page does not use is a bug (a renamed or deleted element)
  const used = keysOf(src);
  for (const [lang, dict] of Object.entries(DICT)) {
    const orphans = Object.keys(dict).filter((k) => !used.has(k));
    if (orphans.length) throw new Error(`${lang}: dictionary keys absent from public/index.html: ${orphans.join(', ')}`);
  }
  writeFileSync('public/index.html', head(src, 'uz'));
  for (const lang of ['ru', 'en']) {
    mkdirSync(`public/${lang}`, { recursive: true });
    const out = body(head(src, lang), lang).replace('<!doctype html>', '<!doctype html>\n<!-- Generated by scripts/build-langs.mjs from public/index.html. Do not edit by hand. -->');
    writeFileSync(`public/${lang}/index.html`, out);
  }
  const day = new Date().toISOString().slice(0, 10);
  const alts = Object.entries(PATH).map(([l, p]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${p}"/>`).join('\n')
    + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>`;
  writeFileSync('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${Object.values(PATH).map((p) => `  <url>
    <loc>${SITE}${p}</loc>
    <lastmod>${day}</lastmod>
${alts}
  </url>`).join('\n')}
</urlset>
`);
  console.log('langs: uz, ru, en and sitemap.xml');
}

if (import.meta.url === `file://${process.argv[1]}`) buildLangs();
