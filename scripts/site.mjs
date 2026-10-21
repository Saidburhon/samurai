// The site as every generator sees it: the four languages, their URLs, the language switch, and the company facts
// from content/site.json. Shared by build-langs.mjs (the landing), build-pages.mjs (every other page), the JSON-LD,
// the sitemaps, llms.txt, the lint and the QA crawler, so a URL or a fact is written in one place only.
import { readFileSync } from 'node:fs';
import { CATALOGUE_BASE } from '../src/shared/catalogue.js';

export const SITE = 'https://qilich.com';
// Uzbek is the root: the primary market's page carries the domain (SEO-GEO-DECISIONS: no redirect by language)
export const LANGS = ['uz', 'ru', 'en', 'ja'];
export const PREFIX = { uz: '', ru: '/ru', en: '/en', ja: '/ja' };
export const HOME = { uz: '/', ru: '/ru/', en: '/en/', ja: '/ja/' };
export const LOCALE = { uz: 'uz_UZ', ru: 'ru_RU', en: 'en_US', ja: 'ja_JP' };
// the switch names each language in its own script; the code is the compact form (phone bar, narrow desktops)
export const LANG_NAME = { uz: 'Oʻzbekcha', ru: 'Русский', en: 'English', ja: '日本語' };
export const LANG_CODE = { uz: 'UZ', ru: 'RU', en: 'EN', ja: 'JA' };
export const LANG_LABEL = 'Til / Язык / Language / 言語';
// x-default is each page's English twin (the home page's is /en/)
export const X_DEFAULT = 'en';

export const site = JSON.parse(readFileSync('content/site.json', 'utf8'));

// /<prefix>/<slug>/ with one trailing slash; slug '' is the language home
export const pathOf = (lang, slug = '') => `${PREFIX[lang]}/${slug ? String(slug).replace(/^\/+|\/+$/g, '') + '/' : ''}`;
export const abs = (p) => SITE + p;
export const has = (v) => (Array.isArray(v) ? v.length > 0 : v != null && typeof v === 'object' ? Object.values(v).some(has) : v != null && String(v).trim() !== '');
export const telHref = (s) => 'tel:' + String(s).replace(/[^\d+]/g, '');
export const nbspPhone = (s) => String(s).trim().replace(/ /g, ' ');
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// text that goes into HTML as written by us (it may hold inline tags); only bare ampersands are escaped
export const html = (s) => String(s).replace(/&(?!#?\w+;)/g, '&amp;');

// Japanese titles and descriptions are measured in full-width characters: CJK, kana and full-width forms count 1,
// half-width characters (Latin, digits, spaces) count 0.5
export function fwWidth(s) {
  let w = 0;
  for (const ch of String(s)) {
    const c = ch.codePointAt(0);
    const full = (c >= 0x1100 && c <= 0x115f) || (c >= 0x2e80 && c <= 0xa4cf) || (c >= 0xac00 && c <= 0xd7a3) ||
      (c >= 0xf900 && c <= 0xfaff) || (c >= 0xfe30 && c <= 0xfe4f) || (c >= 0xff00 && c <= 0xff60) || (c >= 0xffe0 && c <= 0xffe6);
    w += full ? 1 : 0.5;
  }
  return w;
}

// The language switch: plain links to the same page in each language, each name in its own script, the current one
// marked. `hrefs` maps a language to its twin's path; a language without a twin links to its home (and the page
// carries no hreflang to it). Used for the landing (build-langs) and every generated page (pages/chrome).
export function langNav(current, hrefs = HOME, cls = 'lang') {
  const links = LANGS.map((l) => {
    const href = hrefs[l] || HOME[l];
    return `<a href="${href}" hreflang="${l}" lang="${l}"${l === current ? ' aria-current="page"' : ''}><span class="nm">${LANG_NAME[l]}</span><span class="cd" aria-hidden="true">${LANG_CODE[l]}</span></a>`;
  }).join('');
  return `<nav class="${cls}" aria-label="${LANG_LABEL}">${links}</nav>`;
}

// The seven services the landing and the About page list ("What we build"), in their order, each linked to its
// Solutions page: a group, or the one solution that is the service. Japanese: the chat-bot line goes to the AI group
// (the Telegram group is not offered on /ja/: scripts/pages/ja-market.mjs).
export const SERVICE_TARGETS = ['mobile', 'web', 'telegram', 'cloud-backend-api', 'biz-desktop-app', 'iot', 'ai'];
export const serviceHref = (i, lang) => `${CATALOGUE_BASE[lang]}${lang === 'ja' && SERVICE_TARGETS[i] === 'telegram' ? 'ai' : SERVICE_TARGETS[i]}/`;

// <head> tags shared by every page: canonical, hreflang (the page's existing twins plus x-default), Open Graph
// what the share card shows (scripts/og.mjs: the mon and the katana drawing with the language's headline)
export const OG_ALT = {
  uz: 'Qilich belgisi va qilich chizmasi: «Yapon IT agenstvasi endi Oʻzbekistonda!»',
  ru: 'Знак Qilich и чертёж меча: «Японское IT-агентство теперь в Узбекистане!»',
  en: 'The Qilich mark and a drawing of a katana: “A Japanese IT agency, now in Uzbekistan!”',
  ja: 'Qilichのロゴと日本刀の押形の図',
};
export function headLinks({ lang, path, twins, title, description, ogTitle, ogDescription, ogImage, type = 'website', published, modified }) {
  const t = twins || { [lang]: path };
  const xd = t[X_DEFAULT] || t[lang];
  const alts = LANGS.filter((l) => t[l]).map((l) => `<link rel="alternate" hreflang="${l}" href="${abs(t[l])}">`);
  alts.push(`<link rel="alternate" hreflang="x-default" href="${abs(xd)}">`);
  const og = [
    `<meta property="og:site_name" content="${esc(site.brand)}">`,
    `<meta property="og:type" content="${type}">`,
    `<meta property="og:title" content="${esc(ogTitle || title)}">`,
    `<meta property="og:description" content="${esc(ogDescription || description)}">`,
    `<meta property="og:locale" content="${LOCALE[lang]}">`,
    ...LANGS.filter((l) => l !== lang && t[l]).map((l) => `<meta property="og:locale:alternate" content="${LOCALE[l]}">`),
    `<meta property="og:url" content="${abs(path)}">`,
    `<meta property="og:image" content="${ogImage || `${SITE}/assets/img/og-${lang}.png`}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    ...(ogImage ? [] : [`<meta property="og:image:alt" content="${esc(OG_ALT[lang])}">`]),
    ...(type === 'article' && published ? [`<meta property="article:published_time" content="${published}">`, `<meta property="article:modified_time" content="${modified || published}">`] : []),
    '<meta name="twitter:card" content="summary_large_image">',
    ...(ogImage ? [] : [`<meta name="twitter:image:alt" content="${esc(OG_ALT[lang])}">`]),
  ];
  return { canonical: `<link rel="canonical" href="${abs(path)}">`, alternates: alts.join('\n'), og: og.join('\n') };
}
