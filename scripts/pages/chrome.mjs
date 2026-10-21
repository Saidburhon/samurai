// The frame of every generated page (about, contact, privacy, press; later the solutions pages and the blog): the
// head (title, description, canonical, hreflang, Open Graph, one JSON-LD @graph), the top bar, the phone menu sheet,
// the breadcrumbs, the footer and the scripts. The landing's look on washi: the same bar, type and colophon; the
// footer hanko is kurogane here (shu stays for the landing's stamps). No WebGL, no GSAP, no Lenis on these pages.
// The body of a page is HTML from its renderer; the frame never adds words of its own beyond scripts/pages-i18n.mjs.
//   <!-- gen:preload -->            filled by scripts/build.mjs (this page's fonts, its module)
//   <style data-gen="fonts">        filled by scripts/fonts.mjs (subsets made from the built pages)
//   <!-- gen:analytics -->          filled by scripts/build-pages.mjs only when content/site.json has analytics IDs
import { T } from '../pages-i18n.mjs';
import { HOME, LANGS, pathOf, abs, esc, langNav, headLinks, site, telHref, nbspPhone } from '../site.mjs';
import { graph, ldScript } from './ld.mjs';
import { hasBlog, blogIndex, feedPath } from './blog-feed.mjs';
import { CATALOGUE_BASE } from '../../src/shared/catalogue.js';
const PRICES = { uz: '/narxlar/', ru: '/ru/tseny/', en: '/en/prices/', ja: '/ja/prices/' };

export function t(lang, key) {
  const v = T[lang]?.[key];
  if (v == null) throw new Error(`pages-i18n: T.${lang}.${key} is missing`);
  return v;
}
// {about} {contact} {press} {privacy} {home} in copy become this language's URLs
export const links = (lang, s) => String(s).replace(/\{(about|contact|press|privacy|home)\}/g, (m, k) => (k === 'home' ? HOME[lang] : pathOf(lang, k)));

export const SPRITE = `<svg class="sprite" aria-hidden="true" focusable="false">
  <symbol id="mon" viewBox="0 0 32 32"><path fill-rule="evenodd" d="M16 3.6a12.4 12.4 0 1 1 0 24.8a12.4 12.4 0 1 1 0-24.8zM16 8.3a7.7 7.7 0 1 0 0 15.4a7.7 7.7 0 1 0 0-15.4z"/><path d="M16 11.2c.95 0 1.55.35 1.55.9c0 .9-.7 3.1-1.55 7.6c-.85-4.5-1.55-6.7-1.55-7.6c0-.55.6-.9 1.55-.9z"/><path d="M22.6 22.1l8.6 8.4c.25.26-.05.6-.36.42L21.2 23.6z"/></symbol>
  <symbol id="kissaki" viewBox="0 0 30 8"><path d="M0 4.4h20.5l.6-.8h1.4l.5.5c2.4-.2 4.6-.7 6.6-1.6c-1.7 1.6-4 2.6-7.4 2.9h-1.7l-.4-.5H0z"/></symbol>
  <symbol id="i-call" viewBox="0 0 24 24"><path d="M7.4 3.2l2.3 4.4-1.7 1.6c.9 2.4 2.9 4.4 5.3 5.4l1.6-1.8 4.5 2.3-.7 3.5c-.2.7-.8 1.2-1.5 1.1C10.4 19.3 4.7 13.6 4.1 6.8c0-.7.4-1.4 1.1-1.5z"/></symbol>
  <symbol id="i-copy" viewBox="0 0 16 16"><path d="M5.5 5.5h7v7h-7zM3.5 10.5h-0v-7h7"/></symbol>
  <filter id="inked" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.75" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in"/></filter>
</svg>`;
const HANKO = '<svg viewBox="0 0 32 32"><rect x="1" y="1" width="30" height="30" rx="1.2"/><use href="#mon" x="5" y="5" width="22" height="22" class="m"/></svg>';

const phone = () => `<a href="${telHref(site.telephone)}">${nbspPhone(site.telephone)}</a>`;
const mail = () => `<a href="mailto:${site.email}">${site.email}</a>`;

// the pages every chrome links to, in menu order
const MENU = (lang) => [
  { href: HOME[lang], key: 'home' },
  { href: `${HOME[lang]}#xizmatlar`, key: 'svc' },
  { href: CATALOGUE_BASE[lang], key: 'sol', slug: 'solutions' },
  { href: PRICES[lang], key: 'prices', slug: 'prices' },
  { href: pathOf(lang, 'samurai'), key: 'ai', slug: 'samurai' },
  ...(hasBlog(lang) ? [{ href: blogIndex(lang), key: 'blog', slug: 'blog' }] : []),
  { href: pathOf(lang, 'about'), key: 'about', slug: 'about' },
  { href: pathOf(lang, 'contact'), key: 'contact', slug: 'contact' },
  { href: pathOf(lang, 'press'), key: 'press', slug: 'press' },
  { href: pathOf(lang, 'privacy'), key: 'privacy', slug: 'privacy' },
];
const cur = (slug, s) => (s && s === slug ? ' aria-current="page"' : '');

// p: { lang, slug, path, twins: {lang: path}, title, description, type, crumbs: [{name, path}], main (HTML), kanji,
//      gloss, people, assets: { css, js }, ogImage, ld: { extra nodes } }
export function page(p) {
  const { lang, slug } = p;
  const L = (k) => t(lang, k);
  const head = headLinks({ lang, path: p.path, twins: p.twins, title: p.title, description: p.description, ogImage: p.ogImage, type: p.ogType || 'website', published: p.published, modified: p.modified });
  const ld = graph({ lang, path: p.path, type: p.type, title: p.title, description: p.description, crumbs: p.crumbs, people: p.people, mainEntity: p.mainEntity, extra: p.ldExtra });
  // the switch may name a page for a language without a twin (a blog post: that language's blog index)
  const sw = langNav(lang, p.switchTo || p.twins);
  const crumbs = p.crumbs?.length > 1 ? `<nav class="crumbs mono" aria-label="${esc(L('crumbs'))}"><ol>${p.crumbs.map((c, i) => (i < p.crumbs.length - 1 ? `<li><a href="${c.path}">${c.name}</a></li>` : `<li><span aria-current="page">${c.name}</span></li>`)).join('')}</ol></nav>` : '';
  const hako = p.kanji ? `<div class="hako"><b lang="ja" style="--n:${[...p.kanji].length}">${p.kanji}</b><span class="gl">${p.gloss}</span></div>` : '';
  return `<!doctype html>
<!-- Generated by scripts/build-pages.mjs. Do not edit by hand. -->
<html lang="${lang}" class="no-js" data-page="${slug}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}">
<meta name="theme-color" content="#ECE6DA">
${head.og}
${head.canonical}
${head.alternates}
${hasBlog(lang) ? `<link rel="alternate" type="application/rss+xml" title="${esc(L('blogFeed'))}" href="${abs(feedPath(lang))}">\n` : ''}${ldScript(ld)}
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<!-- gen:preload -->
<!-- /gen:preload -->
<style data-gen="fonts"></style>
<link rel="stylesheet" href="${p.assets.css}">${p.assets.css2 ? `\n<link rel="stylesheet" href="${p.assets.css2}">` : ''}
<script>document.documentElement.className=document.documentElement.className.replace('no-js','js')</script>
</head>
<body>
<a class="skip" href="#main">${L('skip')}</a>
${SPRITE}
<header class="nav" id="nav">
  <a class="brand" href="${HOME[lang]}" aria-label="${esc(L('homeLabel'))}"><svg class="mon" aria-hidden="true"><use href="#mon"/></svg><span class="word">Qilich</span></a>
  <p class="clocks mono" aria-hidden="true"><span>${L('tas')}</span> <time class="t-tas"></time> <i>·</i> <span>${L('tok')}</span> <time class="t-tok"></time></p>
  <nav class="links" aria-label="${esc(L('sections'))}"><a href="${CATALOGUE_BASE[lang]}"${cur('solutions', slug)}>${L('sol')}</a><a href="${pathOf(lang, 'samurai')}"${cur('samurai', slug)}>${L('ai')}</a>${hasBlog(lang) ? `<a href="${blogIndex(lang)}"${cur('blog', slug)}>${L('blog')}</a>` : ''}<a href="${pathOf(lang, 'about')}"${cur('about', slug)}>${L('about')}</a></nav>
  ${sw}
  <a class="btn" href="${pathOf(lang, 'contact')}" data-cta="nav"${cur('contact', slug)}><span>${L('cta')}</span></a>
  <a class="call" href="${telHref(site.telephone)}" aria-label="${esc(L('call'))}"><svg aria-hidden="true"><use href="#i-call"/></svg></a>
  <button class="menu" type="button" aria-expanded="false" aria-controls="menu"><span>${L('menu')}</span><i aria-hidden="true"></i></button>
</header>
<div id="menu" class="sheet-menu" hidden>
  <nav class="m-pages" aria-label="${esc(L('pages'))}"><ol>${MENU(lang).map((m) => `<li><a href="${m.href}"${cur(m.slug, slug)}>${L(m.key)}</a></li>`).join('')}</ol></nav>
  <div class="m-row">${sw}</div>
  <p class="m-contact mono">${phone()} ${mail()}</p>
</div>

<main id="main" class="pg pg-${slug}">
  ${crumbs}
${p.main}
  ${hako}
</main>

<footer class="foot" id="foot">
  <p class="annot mono"><span>${L('tel')}</span> ${phone()} <span>${L('mail')}</span> ${mail()}</p>
  <nav class="foot-links" aria-label="${esc(L('pages'))}">${MENU(lang).filter((m) => m.slug).map((m) => `<a href="${m.href}"${cur(m.slug, slug)}>${L(m.key)}</a>`).join('')}</nav>
  <div class="colophon"><span class="mei-s" lang="ja"><span>タシケント住</span><span>キリチ作</span></span><i class="hanko-s" aria-hidden="true">${HANKO}</i><span class="copy-r">© 2026 ${site.brand}</span>
    ${sw}
    <a class="top" href="#nav">${L('top')}</a></div>
</footer>

<div id="strings" hidden><span data-k="copied">${L('copied')}</span>${p.strings || ''}</div>
<div class="toast" role="status" aria-live="polite"></div>
<div class="grain" aria-hidden="true"></div>
<!-- gen:analytics --><!-- /gen:analytics -->
<script type="module" src="${p.assets.js}"></script>
</body>
</html>
`;
}

export { LANGS };
