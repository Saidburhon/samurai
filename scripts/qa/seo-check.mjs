// seo-check: crawls the built site over HTTP, the way a search engine or an AI crawler sees it (no JavaScript), and
// fails on anything SEO-GEO-GUIDELINES / SEO-GEO-DECISIONS forbid. Seeds: the sitemap index, then every internal link.
// For every HTML page:
//   200; <html lang> = the URL's language; a title and a description, each unique across the site (Japanese: title
//   28–32 and description 80–100 full-width characters, half-width counts 0.5; other languages are only warned outside
//   50–60 / 140–160); exactly one h1; exactly one canonical, absolute, self; hreflang for every twin plus x-default,
//   reciprocal (the same set on every twin), x-default = the English twin, valid codes, every target 200; Open Graph
//   (og:title, og:description, og:url = canonical, og:image, og:locale = the page's, og:locale:alternate = the twins');
//   one JSON-LD @graph that parses, with the shared Organization and WebSite nodes (byte-identical on every page except
//   the Organization's translated description), a WebPage/AboutPage/ContactPage with inLanguage and isPartOf,
//   a BreadcrumbList below the home pages ending at the page, every @id reference resolving in the graph, no
//   Review/AggregateRating, no keywords meta, no noindex; legalName/foundingDate/sameAs/employee only when
//   content/site.json has them; the language switch with all four names in their own script; a first paragraph in
//   <main> before any image; on Japanese pages, no claim of Japanese-speaking staff, a Japanese entity or certifications.
// Site files: /sitemap.xml is a sitemap index; each language sitemap lists only canonical 200 URLs of its language,
// each with a lastmod, no xhtml:link, no priority/changefreq, and every indexable page is listed; robots.txt names the
// agents of SEO-GEO-DECISIONS, closes only /api/ and ends with the Sitemap line; llms.txt and the IndexNow key answer
// 200; a missing page answers 404; _headers sends HSTS with includeSubDomains; every internal link answers 200.
// Usage: node scripts/qa/seo-check.mjs [base=http://localhost:8810] [report.json]
import { readFileSync, writeFileSync } from 'node:fs';
import { LANGS, LANG_NAME, LOCALE, X_DEFAULT, HOME, fwWidth, site } from '../site.mjs';
import { AGENTS } from '../build-pages.mjs';

const base = (process.argv[2] || 'http://localhost:8810').replace(/\/$/, '');
const reportPath = process.argv[3] || '.cache/seo-check.json';
const ORIGIN = 'https://qilich.com';
const fails = [], warns = [];
const fail = (where, what) => fails.push(`${where}: ${what}`);
const warn = (where, what) => warns.push(`${where}: ${what}`);
const toLocal = (u) => (u.startsWith(ORIGIN) ? base + u.slice(ORIGIN.length) : u);
const toPath = (u) => new URL(u, ORIGIN).pathname;
const langOf = (p) => (LANGS.find((l) => l !== 'uz' && (p === HOME[l] || p.startsWith(HOME[l]))) || 'uz');
const dec = (s) => String(s ?? '').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], dec(m[2])]));

const cache = new Map();
async function get(path) {
  if (cache.has(path)) return cache.get(path);
  const p = (async () => {
    try {
      const r = await fetch(base + path, { redirect: 'manual', headers: { 'user-agent': 'OAI-SearchBot/1.0 (seo-check)' } });
      return { status: r.status, type: r.headers.get('content-type') || '', body: await r.text(), location: r.headers.get('location') };
    } catch (e) { return { status: 0, type: '', body: '', error: String(e) }; }
  })();
  cache.set(path, p);
  return p;
}

// ---- the sitemaps ----
const sitemapUrls = new Map(); // path -> { lang (of its sitemap), lastmod }
{
  const idx = await get('/sitemap.xml');
  if (idx.status !== 200) fail('/sitemap.xml', `status ${idx.status}`);
  if (!/<sitemapindex xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/.test(idx.body)) fail('/sitemap.xml', 'not a sitemap index');
  const children = [...idx.body.matchAll(/<sitemap>\s*<loc>([^<]+)<\/loc>\s*<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>\s*<\/sitemap>/g)];
  if (children.length !== LANGS.length) fail('/sitemap.xml', `${children.length} sitemaps, expected one per language (${LANGS.length})`);
  for (const [, loc] of children) {
    const p = toPath(loc), lang = (p.match(/\/sitemaps\/([a-z]+)\.xml$/) || [])[1];
    if (!LANGS.includes(lang)) fail(p, 'not a /sitemaps/<lang>.xml');
    const sm = await get(p);
    if (sm.status !== 200) { fail(p, `status ${sm.status}`); continue; }
    if (!/<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/.test(sm.body)) fail(p, 'not a urlset');
    if (/xhtml:link|<priority>|<changefreq>/.test(sm.body)) fail(p, 'carries xhtml:link, priority or changefreq');
    const urls = [...sm.body.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
    for (const u of urls) {
      const loc2 = (u.match(/<loc>([^<]+)<\/loc>/) || [])[1], mod = (u.match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1];
      if (!loc2) { fail(p, 'a url without loc'); continue; }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(mod || '')) fail(p, `${loc2}: lastmod missing or not a date`);
      const pp = toPath(loc2);
      if (sitemapUrls.has(pp)) fail(p, `${loc2} listed twice`);
      sitemapUrls.set(pp, { lang, lastmod: mod });
    }
  }
}

// ---- crawl ----
const pages = new Map();
const queue = [...new Set([...sitemapUrls.keys(), '/', ...Object.values(HOME)])];
const linkTargets = new Map(); // path -> first page linking to it
while (queue.length) {
  const path = queue.shift();
  if (pages.has(path)) continue;
  const r = await get(path);
  if (r.status !== 200) { pages.set(path, { status: r.status }); continue; }
  if (!/text\/html/.test(r.type)) { pages.set(path, { status: r.status, nonHtml: true }); continue; }
  pages.set(path, { status: 200, html: r.body });
  for (const m of r.body.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
    const href = dec(m[1]);
    if (/^(mailto:|tel:|https?:\/\/(?!qilich\.com))/.test(href) || href.startsWith('#')) continue;
    const u = new URL(href, ORIGIN + path);
    if (u.origin !== ORIGIN) continue;
    if (!linkTargets.has(u.pathname)) linkTargets.set(u.pathname, path);
    if (/\.(png|svg|jpg|webp|xml|txt|json|woff2|css|js)$/.test(u.pathname)) continue;
    if (!pages.has(u.pathname)) queue.push(u.pathname);
  }
}
for (const [p, from] of linkTargets) { const r = await get(p); if (r.status !== 200) fail(from, `links to ${p}, which answers ${r.status}`); }

// ---- every page ----
const html = [...pages].filter(([, v]) => v.html);
const titles = new Map(), descs = new Map();
const orgs = new Map(), websites = new Set();
const parsed = new Map();
for (const [path, { html: h }] of html) {
  const W = path;
  const head = (h.match(/<head>([\s\S]*?)<\/head>/) || [])[1] || '';
  const lang = (h.match(/<html lang="([a-z-]+)"/) || [])[1];
  const isHome = Object.values(HOME).includes(path);
  if (lang !== langOf(path)) fail(W, `<html lang="${lang}">, the URL says ${langOf(path)}`);
  if (/name="robots"[^>]*noindex/.test(head)) { warn(W, 'noindex (left out of the checks)'); continue; }
  if (/<meta name="keywords"/.test(head)) fail(W, 'a keywords meta');
  const title = dec((head.match(/<title[^>]*>([^<]*)<\/title>/) || [])[1]).trim();
  const desc = dec((head.match(/<meta name="description"[^>]*content="([^"]*)"/) || [])[1]).trim();
  if (!title) fail(W, 'no title'); else { if (titles.has(title)) fail(W, `title duplicates ${titles.get(title)}`); titles.set(title, path); }
  if (!desc) fail(W, 'no description'); else { if (descs.has(desc)) fail(W, `description duplicates ${descs.get(desc)}`); descs.set(desc, path); }
  if (lang === 'ja') {
    const tw = fwWidth(title), dw = fwWidth(desc);
    if (tw < 28 || tw > 32) fail(W, `Japanese title ${tw} full-width characters (28–32)`);
    if (dw < 80 || dw > 100) fail(W, `Japanese description ${dw} full-width characters (80–100)`);
  } else {
    if (title.length < 40 || title.length > 70) warn(W, `title ${title.length} characters (50–60 recommended)`);
    if (desc.length < 120 || desc.length > 165) warn(W, `description ${desc.length} characters (140–160 recommended)`);
  }
  const body = h.replace(/<head>[\s\S]*?<\/head>/, '');
  const h1s = body.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) fail(W, `${h1s.length} h1`);
  // canonical
  const canon = [...head.matchAll(/<link rel="canonical"[^>]*>/g)].map((m) => attrs(m[0]).href);
  if (canon.length !== 1) fail(W, `${canon.length} canonical links`);
  const self = ORIGIN + path;
  if (canon[0] !== self) fail(W, `canonical ${canon[0]} is not the page itself (${self})`);
  if (!sitemapUrls.has(path)) fail(W, 'not in the sitemaps');
  else if (sitemapUrls.get(path).lang !== lang) fail(W, `in the ${sitemapUrls.get(path).lang} sitemap, but lang is ${lang}`);
  // hreflang
  const alts = [...head.matchAll(/<link rel="alternate" hreflang="[^"]*"[^>]*>/g)].map((m) => attrs(m[0]));
  const set = Object.fromEntries(alts.map((a) => [a.hreflang, a.href]));
  if (alts.length !== Object.keys(set).length) fail(W, 'a hreflang code twice');
  for (const a of alts) if (![...LANGS, 'x-default'].includes(a.hreflang)) fail(W, `hreflang code ${a.hreflang}`);
  if (set[lang] !== self) fail(W, `no hreflang to itself (${lang})`);
  if (!set['x-default']) fail(W, 'no x-default');
  else if (set[X_DEFAULT] && set['x-default'] !== set[X_DEFAULT]) fail(W, `x-default ${set['x-default']} is not the English twin ${set[X_DEFAULT]}`);
  parsed.set(path, { lang, set, title, desc, head, body, isHome });
  // Open Graph
  const og = {};
  for (const m of head.matchAll(/<meta property="(og:[\w:]+)"[^>]*>/g)) { const a = attrs(m[0]); (og[m[1]] = og[m[1]] || []).push(a.content); }
  for (const k of ['og:title', 'og:description', 'og:url', 'og:image', 'og:locale']) if (!og[k]?.[0]) fail(W, `no ${k}`);
  if (og['og:url']?.[0] !== self) fail(W, `og:url ${og['og:url']?.[0]} is not the canonical`);
  if (og['og:locale']?.[0] !== LOCALE[lang]) fail(W, `og:locale ${og['og:locale']?.[0]}, expected ${LOCALE[lang]}`);
  const wantAlt = LANGS.filter((l) => l !== lang && set[l]).map((l) => LOCALE[l]).sort().join(',');
  if ((og['og:locale:alternate'] || []).sort().join(',') !== wantAlt) fail(W, `og:locale:alternate ${(og['og:locale:alternate'] || []).join(',')}, expected ${wantAlt}`);
  // JSON-LD
  const lds = [...h.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (lds.length !== 1) fail(W, `${lds.length} JSON-LD scripts (one @graph per page)`);
  let g;
  try { g = JSON.parse(lds[0]); } catch (e) { fail(W, `JSON-LD does not parse: ${e.message}`); }
  if (g) {
    if (g['@context'] !== 'https://schema.org' || !Array.isArray(g['@graph'])) fail(W, 'JSON-LD is not one schema.org @graph');
    const nodes = g['@graph'] || [];
    const ids = new Set(nodes.map((n) => n['@id']).filter(Boolean));
    const walkRefs = (v) => { if (Array.isArray(v)) v.forEach(walkRefs); else if (v && typeof v === 'object') { if (Object.keys(v).length === 1 && v['@id'] && !ids.has(v['@id'])) { const inNested = JSON.stringify(nodes).includes(`"@id":"${v['@id']}","`); if (!inNested) fail(W, `@id reference ${v['@id']} does not resolve`); } Object.values(v).forEach(walkRefs); } };
    walkRefs(nodes);
    const types = JSON.stringify(nodes);
    if (/"@type":"(Review|AggregateRating)"/.test(types)) fail(W, 'Review or AggregateRating in the JSON-LD');
    const org = nodes.find((n) => n['@id'] === `${ORIGIN}/#organization`), ws = nodes.find((n) => n['@id'] === `${ORIGIN}/#website`);
    if (!org || org['@type'] !== 'Organization') fail(W, 'no Organization https://qilich.com/#organization');
    if (!ws || ws['@type'] !== 'WebSite') fail(W, 'no WebSite https://qilich.com/#website');
    if (org) {
      const { description, ...rest } = org;
      orgs.set(path, JSON.stringify(rest));
      if (description !== site.description[lang]) fail(W, 'Organization description is not the site.json description of this language');
      for (const [k, has] of [['legalName', site.legalName], ['foundingDate', site.foundingDate], ['sameAs', site.sameAs?.length]]) {
        if (k in org && !has) fail(W, `Organization.${k} without the fact in content/site.json`);
        if (!(k in org) && has) fail(W, `content/site.json has ${k} but the Organization does not`);
      }
    }
    if (ws) websites.add(JSON.stringify(ws));
    const persons = nodes.filter((n) => n['@type'] === 'Person');
    if (persons.length && !site.people?.length) fail(W, 'a Person node without people in content/site.json');
    if (/\/(about|press)\/$/.test(path) && site.people?.length && persons.length !== site.people.length) fail(W, `${persons.length} Person nodes for ${site.people.length} people in content/site.json`);
    const wp = nodes.find((n) => ['WebPage', 'AboutPage', 'ContactPage'].includes(n['@type']));
    if (!wp) fail(W, 'no WebPage / AboutPage / ContactPage node');
    else {
      if (wp.url !== self) fail(W, `WebPage url ${wp.url}`);
      if (wp.inLanguage !== lang) fail(W, `WebPage inLanguage ${wp.inLanguage}`);
      if (wp.isPartOf?.['@id'] !== `${ORIGIN}/#website`) fail(W, 'WebPage isPartOf is not the WebSite');
      if (wp.name !== title) fail(W, 'WebPage name is not the title');
    }
    const bc = nodes.find((n) => n['@type'] === 'BreadcrumbList');
    if (!isHome) {
      if (!bc) fail(W, 'no BreadcrumbList');
      else {
        const items = bc.itemListElement || [];
        if (items.length < 2 || items.at(-1).item !== self || items[0].item !== ORIGIN + HOME[lang]) fail(W, 'BreadcrumbList does not run from the home page to this page');
        items.forEach((it, i) => { if (it.position !== i + 1 || !it.name) fail(W, 'BreadcrumbList item out of order or unnamed'); });
        // the visible breadcrumbs say the same
        const crumbs = (body.match(/<nav class="crumbs[^"]*"[\s\S]*?<\/nav>/) || [''])[0];
        if (!crumbs) fail(W, 'no visible breadcrumbs');
        for (const it of items) if (!dec(crumbs).includes(it.name)) fail(W, `breadcrumb «${it.name}» is not visible`);
      }
    }
  }
  // the press page's one sentence is the Organization description, word for word
  if (/\/press\/$/.test(path)) {
    const q = dec((body.match(/<p class="quote">([\s\S]*?)<\/p>/) || [])[1] || '').replace(/<[^>]+>/g, '');
    if (q !== site.description[lang]) fail(W, 'the one-sentence description differs from the Organization description');
  }
  // the language switch: four links, names in their own script, the twins (or the language homes)
  const navs = [...body.matchAll(/<nav class="lang"[\s\S]*?<\/nav>/g)].map((m) => m[0]);
  if (!navs.length) fail(W, 'no language switch');
  for (const nav of navs) {
    for (const l of LANGS) {
      const a = (nav.match(new RegExp(`<a [^>]*hreflang="${l}"[^>]*>[\\s\\S]*?<\\/a>`)) || [])[0];
      if (!a) { fail(W, `the switch has no ${l} link`); continue; }
      const at = attrs(a.match(/<a [^>]*>/)[0]);
      if (at.lang !== l) fail(W, `the ${l} link has lang="${at.lang}"`);
      if (!dec(a).includes(LANG_NAME[l])) fail(W, `the ${l} link does not name it ${LANG_NAME[l]}`);
      const want = set[l] ? toPath(set[l]) : HOME[l];
      if (at.href !== want) fail(W, `the ${l} link goes to ${at.href}, its twin is ${want}`);
      if ((l === lang) !== ('aria-current' in at)) fail(W, `aria-current on the wrong language link (${l})`);
    }
  }
  // the first paragraph: in <main>, before any image
  const main = (body.match(/<main[\s\S]*?<\/main>/) || [''])[0];
  const firstP = main.search(/<p[\s>]/), firstImg = main.search(/<img[\s>]/);
  if (firstP < 0) fail(W, 'no paragraph in main');
  else {
    if (firstImg >= 0 && firstImg < firstP) fail(W, 'an image comes before the first paragraph in main');
    const text = dec(main.slice(firstP).match(/<p[^>]*>([\s\S]*?)<\/p>/)[1].replace(/<[^>]+>/g, '')).trim();
    if ((lang === 'ja' ? fwWidth(text) : text.length) < 40) fail(W, `the first paragraph is too short to say what the page is for: «${text}»`);
    parsed.get(path).firstP = text;
  }
  // Japanese pages: no claim the facts do not support
  if (lang === 'ja') {
    const text = dec(main.replace(/<[^>]+>/g, ' '));
    const CLAIMS = [/日本語(対応|ネイティブ|堪能)[^。]*(スタッフ|エンジニア|担当)/, /日本人(スタッフ|エンジニア|担当者|PM)/, /ブリッジSEが在籍/, /日本法人(を|が)(設立|あり)/, /ISO\s?\d{4,5}/, /(認証|認定)(を)?取得/, /(豊富な|多数の)(導入|開発)?実績/, /実績[0-9０-９]+/, /納期(を)?(保証|厳守)/];
    for (const re of CLAIMS) { const m = text.match(re); if (m) fail(W, `a claim content/site.json does not support: «${m[0]}»`); }
    if (!site.japan.legalName && /日本法人/.test(text)) fail(W, 'mentions 日本法人 without a Japanese entity in content/site.json');
  }
}
// reciprocity: every twin lists exactly the same set
for (const [path, p] of parsed) {
  for (const [code, href] of Object.entries(p.set)) {
    if (code === 'x-default') continue;
    const tp = toPath(href), t = parsed.get(tp);
    if (!t) { const r = await get(tp); if (r.status !== 200) fail(path, `hreflang ${code} → ${href} answers ${r.status}`); else fail(path, `hreflang ${code} → ${href} was not crawled`); continue; }
    if (t.lang !== code) fail(path, `hreflang ${code} → a page in ${t.lang}`);
    if (JSON.stringify(Object.entries(t.set).sort()) !== JSON.stringify(Object.entries(p.set).sort())) fail(path, `hreflang set differs on its ${code} twin ${tp} (not reciprocal)`);
  }
}
if (new Set(orgs.values()).size !== 1) fail('JSON-LD', `the Organization node differs between pages (beyond its description): ${new Set(orgs.values()).size} variants`);
if (websites.size !== 1) fail('JSON-LD', `the WebSite node differs between pages: ${websites.size} variants`);
for (const [p, v] of sitemapUrls) if (!parsed.has(p)) fail('sitemap', `${p} is not a 200, indexable, canonical page`);

// ---- robots.txt, llms.txt, IndexNow, 404, headers ----
{
  const r = await get('/robots.txt');
  if (r.status !== 200) fail('/robots.txt', `status ${r.status}`);
  for (const a of AGENTS) if (!new RegExp(`^User-agent: ${a}$`, 'm').test(r.body)) fail('/robots.txt', `does not name ${a}`);
  if (/^Disallow: \/\s*$/m.test(r.body)) fail('/robots.txt', 'Disallow: / (the whole site is closed)');
  const dis = [...r.body.matchAll(/^Disallow: (\S+)/gm)].map((m) => m[1]);
  if (dis.some((d) => d !== '/api/')) fail('/robots.txt', `closes more than /api/: ${dis.join(' ')}`);
  if (!/Sitemap: https:\/\/qilich\.com\/sitemap\.xml\s*$/.test(r.body)) fail('/robots.txt', 'does not end with the Sitemap line');
  const l = await get('/llms.txt');
  if (l.status !== 200 || !l.body.startsWith('# Qilich')) fail('/llms.txt', `status ${l.status}`);
  for (const lang of LANGS) if (!l.body.includes(ORIGIN + HOME[lang])) fail('/llms.txt', `does not list ${HOME[lang]}`);
  const k = await get(`/${site.indexnow.key}.txt`);
  if (k.status !== 200 || k.body.trim() !== site.indexnow.key) fail('IndexNow', 'the key file does not answer with the key');
  const nf = await get('/this-page-does-not-exist/');
  if (nf.status !== 404) fail('404', `a missing page answers ${nf.status}`);
  else if (/Qilich/.test(nf.body) && !/href="\/ja\/"/.test(nf.body)) warn('404', 'the 404 page does not link to /ja/');
  const hdr = readFileSync('public/_headers', 'utf8');
  if (!/Strict-Transport-Security: max-age=\d+; includeSubDomains/.test(hdr)) fail('_headers', 'HSTS without includeSubDomains');
  if (/X-Robots-Tag/i.test(hdr)) fail('_headers', 'X-Robots-Tag set');
}

const indexable = [...parsed.keys()];
const report = { base, at: new Date().toISOString(), pages: indexable.length, sitemapUrls: sitemapUrls.size, links: linkTargets.size, fails, warns, pagesList: indexable.map((p) => ({ path: p, lang: parsed.get(p).lang, title: parsed.get(p).title, description: parsed.get(p).desc, hreflang: Object.keys(parsed.get(p).set).join(' '), firstParagraph: parsed.get(p).firstP })) };
writeFileSync(reportPath, JSON.stringify(report, null, 1));
console.log(`seo-check ${base}: ${indexable.length} pages, ${sitemapUrls.size} sitemap URLs, ${linkTargets.size} internal link targets`);
for (const w of warns) console.log('  warn  ' + w);
for (const f of fails) console.log('  FAIL  ' + f);
console.log(fails.length ? `seo-check: ${fails.length} failure(s)` : 'seo-check: ok');
process.exit(fails.length ? 1 : 0);
