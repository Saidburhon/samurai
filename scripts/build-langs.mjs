// Builds the Russian and English pages from the Uzbek one, so search engines see all three languages.
//   public/index.html      Uzbek, edited by hand (its head data is refreshed here too)
//   public/ru/index.html   generated
//   public/en/index.html   generated
//   public/sitemap.xml     generated
// Run: npm run build
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { EN, RU } from './i18n.mjs';

const SITE = 'https://qilich.com';
const PATH = { uz: '/', ru: '/ru/', en: '/en/' };
const DICT = { ru: RU, en: EN };

// what search engines and link previews show, per language
const META = {
  uz: {
    title: 'Qilich — mobil ilova va sayt ishlab chiqish, Toshkent',
    description: 'Yapon IT agenstvasi endi Oʻzbekistonda: iOS va Android ilovalar, veb-saytlar, Telegram botlar, IoT va AI. Hoglt va PoolTimer mualliflari.',
    ogTitle: 'Qilich — Yapon IT agenstvasi endi Oʻzbekistonda!',
    ogDescription: 'iOS va Android ilovalar, veb-saytlar, Telegram botlar, IoT va AI. Toshkent.',
    ogLocale: 'uz_UZ',
    services: ['iOS va Android ilovalar ishlab chiqish', 'Veb-saytlar va veb-platformalar', 'Telegram botlar', 'Backend va integratsiyalar', 'IoT yechimlar', 'AI integratsiyalar']
  },
  ru: {
    title: 'Qilich — разработка мобильных приложений и сайтов в Ташкенте',
    description: 'Японское IT-агентство в Ташкенте: приложения для iOS и Android, сайты, Telegram-боты, IoT и AI. Авторы Hoglt и PoolTimer.',
    ogTitle: 'Qilich — японское IT-агентство теперь в Узбекистане!',
    ogDescription: 'Приложения для iOS и Android, сайты, Telegram-боты, IoT и AI. Ташкент.',
    ogLocale: 'ru_RU',
    services: ['Разработка мобильных приложений для iOS и Android', 'Разработка сайтов и веб-платформ', 'Telegram-боты', 'Backend и интеграции', 'IoT-решения', 'Внедрение AI']
  },
  en: {
    title: 'Qilich — app and web development agency in Tashkent, Uzbekistan',
    description: 'A Japanese IT agency in Tashkent: iOS and Android apps, websites, Telegram bots, IoT and AI. The team behind Hoglt and PoolTimer.',
    ogTitle: 'Qilich — a Japanese IT agency, now in Uzbekistan!',
    ogDescription: 'iOS and Android apps, websites, Telegram bots, IoT and AI. Tashkent.',
    ogLocale: 'en_US',
    services: ['iOS and Android app development', 'Website and web platform development', 'Telegram bots', 'Backend and integrations', 'IoT solutions', 'AI integration']
  }
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function ld(lang) {
  const m = META[lang], url = SITE + PATH[lang];
  const address = { '@type': 'PostalAddress', addressLocality: 'Tashkent', addressCountry: 'UZ' };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization', '@id': SITE + '/#org', name: 'Qilich', url: SITE + '/',
        logo: SITE + '/assets/img/logo-512.png', email: 'inbox@qilich.com', telephone: '+998972707007',
        slogan: m.ogTitle.replace(/^Qilich — /, ''), address, knowsLanguage: ['uz', 'ru', 'en', 'ja']
      },
      {
        '@type': 'ProfessionalService', '@id': SITE + '/#service', name: 'Qilich', url,
        description: m.description, image: `${SITE}/assets/img/og-${lang}.png`,
        email: 'inbox@qilich.com', telephone: '+998972707007', address,
        areaServed: [{ '@type': 'City', name: 'Tashkent' }, { '@type': 'Country', name: 'Uzbekistan' }],
        parentOrganization: { '@id': SITE + '/#org' },
        hasOfferCatalog: {
          '@type': 'OfferCatalog', name: 'Qilich',
          itemListElement: m.services.map(name => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } }))
        }
      },
      { '@type': 'WebSite', '@id': SITE + '/#website', url: SITE + '/', name: 'Qilich', inLanguage: lang, publisher: { '@id': SITE + '/#org' } }
    ]
  };
}

// head: every tag marked data-meta="key"
function head(html, lang) {
  const m = META[lang], url = SITE + PATH[lang];
  const values = {
    ...m, url, canonical: url, ogImage: `${SITE}/assets/img/og-${lang}.png`,
    ld: JSON.stringify(ld(lang))
  };
  html = html.replace(/<html lang="[a-z]+">/, `<html lang="${lang}">`);
  html = html.replace(/<title data-meta="title">[^<]*<\/title>/, `<title data-meta="title">${esc(values.title)}</title>`);
  html = html.replace(/<script type="application\/ld\+json" data-meta="ld">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" data-meta="ld">${values.ld.replace(/</g, '\\u003c')}</script>`);
  html = html.replace(/<(meta|link)([^>]*?) data-meta="(\w+)"([^>]*?)(content|href)="[^"]*"/g,
    (all, tag, a, key, b, attr) => (key in values ? `<${tag}${a} data-meta="${key}"${b}${attr}="${esc(values[key])}"` : all));
  // the current language in the switch
  html = html.replace(/(<nav class="lang"[\s\S]*?<\/nav>)/, nav => nav
    .replace(/ aria-current="page"/g, '')
    .replace(new RegExp(`(<a href="${PATH[lang].replace(/\//g, '\\/')}" hreflang="${lang}")`), '$1 aria-current="page"'));
  return html;
}

// body: every [data-i18n] element's content and every [data-i18n-label] aria-label
function body(html, lang) {
  const dict = DICT[lang];
  let missing = [];
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

const src = readFileSync('public/index.html', 'utf8');
writeFileSync('public/index.html', head(src, 'uz'));
for (const lang of ['ru', 'en']) {
  mkdirSync(`public/${lang}`, { recursive: true });
  const out = '<!-- Generated by scripts/build-langs.mjs from public/index.html. Do not edit by hand. -->\n' + body(head(src, lang), lang);
  writeFileSync(`public/${lang}/index.html`, out);
}

// sitemap with each page's language alternates
const day = new Date().toISOString().slice(0, 10);
const alts = Object.entries(PATH).map(([l, p]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${p}"/>`).join('\n')
  + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>`;
writeFileSync('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${Object.values(PATH).map(p => `  <url>
    <loc>${SITE}${p}</loc>
    <lastmod>${day}</lastmod>
${alts}
  </url>`).join('\n')}
</urlset>
`);
console.log('built uz, ru, en and sitemap.xml');
