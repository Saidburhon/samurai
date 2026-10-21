// solutions-data-check (gate B2b): the built Solutions pages against the catalogue, without a browser.
//   T16  every solution and group has a page in uz, ru, en and ja; one h1; the MVP and full prices on a solution page
//        are the ones its catalogue row shows (same strings), and its Service offers carry the catalogue's USD
//   T17  the price list has a real <table> per group with <th scope>, the integrations list with counts, a dated rate
//   T18  every JSON-LD node type is one SOLUTIONS-SPEC §4.8 / SEO-GEO-DECISIONS allows; no rating or review; the
//        Service has priceSpecification minPrice in USD; a FAQPage repeats the visible questions and answers verbatim
//   copy no arrow glyphs, no emoji, no form of "yarat-", no U+202F / U+2009 in the text, no word that mixes Latin and
//        Cyrillic letters (Kontурli), here and in content/solutions*.json; no "/ per month" (a slash before a "per")
//   monthly a monthly service (billing: monthly) is sold as plans a month: its FAQ names no MVP or full version and its
//        offers are UnitPriceSpecification per month (MON)
// Usage: node scripts/qa/solutions-data-check.mjs [report.json]
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { normalise, solutionUrl, CATALOGUE_BASE } from '../../src/shared/catalogue.js';

const J = (p) => JSON.parse(readFileSync(p, 'utf8'));
const LANGS = ['uz', 'ru', 'en', 'ja'];
const PRICES = { uz: '/narxlar/', ru: '/ru/tseny/', en: '/en/prices/', ja: '/ja/prices/' };
const cat = J('content/solutions.json');
const model = normalise(cat, { ...J('content/solutions-extra.json'), ja_solutions: J('content/solutions-ja.json').solutions }, J('content/pricing.json'));
const fails = [];
const fail = (w, m) => fails.push(`${w}: ${m}`);
const dec = (s) => String(s).replace(/<wbr>/g, '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
const ALLOWED = new Set(['Organization', 'WebSite', 'WebPage', 'BreadcrumbList', 'ListItem', 'Service', 'Offer', 'PriceSpecification', 'UnitPriceSpecification', 'FAQPage', 'Question', 'Answer', 'ItemList', 'OfferCatalog', 'Country', 'ImageObject', 'PostalAddress', 'ContactPoint']);
const types = (v, acc = []) => { if (Array.isArray(v)) v.forEach((x) => types(x, acc)); else if (v && typeof v === 'object') { if (v['@type']) acc.push(v['@type']); Object.values(v).forEach((x) => types(x, acc)); } return acc; };
let pages = 0;
// a word (letters only) that mixes Latin and Cyrillic letters: a typo that reads as generated text
const mixedWords = (t) => (String(t).match(/[\p{L}\p{M}ʻʼ]+/gu) || []).filter((w) => /\p{Script=Latin}/u.test(w) && /\p{Script=Cyrillic}/u.test(w));
for (const f of ['content/solutions.json', 'content/solutions-scope.json', 'content/solutions-extra.json', 'content/solutions-ja.json']) {
  if (!existsSync(f)) continue;
  const m = mixedWords(readFileSync(f, 'utf8'));
  if (m.length) fail(f, `a word mixes Latin and Cyrillic: ${[...new Set(m)].slice(0, 5).join(', ')}`);
}
const read = (p) => { const f = `public${p}index.html`; if (!existsSync(f)) { fail(p, 'missing'); return null; } pages++; return readFileSync(f, 'utf8'); };
function common(p, h) {
  if ((h.match(/<h1[\s>]/g) || []).length !== 1) fail(p, 'not exactly one h1');
  const text = dec(h.replace(/<head>[\s\S]*?<\/head>/, '').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<svg[\s\S]*?<\/svg>/g, ''));
  if (/[↗→←↘⟶➔➜]/.test(text)) fail(p, 'an arrow glyph');
  if (/\p{Extended_Pictographic}/u.test(text.replace(/[©®™]/g, ''))) fail(p, 'an emoji');
  if (/\byarat|яратиш/i.test(text)) fail(p, 'a form of yarat-');
  if (/[  ]/.test(text)) fail(p, 'U+202F or U+2009 in the text');
  const mw = mixedWords(dec(h.replace(/<head>[\s\S]*?<\/head>/, '').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, ' ')));
  if (mw.length) fail(p, `a word mixes Latin and Cyrillic: ${[...new Set(mw)].slice(0, 3).join(', ')}`);
  if (/\/\s*(oyiga|в месяц|per month|月額)/.test(text) || /\/\s*(oyiga|в месяц|per month|月額)/.test(h.match(/<head>[\s\S]*?<\/head>/)?.[0] || '')) fail(p, 'a slash before "per month"');
  const ld = JSON.parse(h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  for (const t of types(ld['@graph'])) if (!ALLOWED.has(t)) fail(p, `JSON-LD type ${t}`);
  const faq = ld['@graph'].find((n) => n['@type'] === 'FAQPage');
  if (faq) {
    const vis = [...h.matchAll(/<dl class="qa">([\s\S]*?)<\/dl>/g)].map((m) => m[1]).join('');
    const pairs = [...vis.matchAll(/<dt>([\s\S]*?)<\/dt><dd>([\s\S]*?)<\/dd>/g)].map((m) => [dec(m[1]), dec(m[2])]);
    faq.mainEntity.forEach((q, i) => { if (!pairs[i] || pairs[i][0] !== q.name || pairs[i][1] !== q.acceptedAnswer.text) fail(p, `FAQ ${i + 1} is not the visible text`); });
  }
  return ld;
}
for (const lang of LANGS) {
  const catH = read(CATALOGUE_BASE[lang]);
  if (!catH) continue;
  common(CATALOGUE_BASE[lang], catH);
  // a row's figures: <b>label</b> <i>weeks</i> <i>price</i>, twice (MVP, full version; or the two monthly plans)
  const rowFig = Object.fromEntries([...catH.matchAll(/<li class="sr" data-id="([^"]+)"[\s\S]*?<span class="sr-f mono">([\s\S]*?)<\/span><span class="sr-x"/g)].map((m) => [m[1], m[2].split(/(?=<b>)/).filter(Boolean).map((x) => dec(x.replace(/></g, '> <')).replace(/[ \t\n]+/g, ' '))]));
  if (Object.keys(rowFig).length !== model.solutions.length) fail(CATALOGUE_BASE[lang], `${Object.keys(rowFig).length} rows`);
  for (const g of cat.groups) { const p = `${CATALOGUE_BASE[lang]}${g.id}/`; const h = read(p); if (h) common(p, h); }
  for (const s of model.solutions) {
    const p = solutionUrl(s, lang), h = read(p);
    if (!h) continue;
    const ld = common(p, h);
    const svc = ld['@graph'].find((n) => n['@type'] === 'Service');
    if (!svc) { fail(p, 'no Service'); continue; }
    const usd = svc.offers.map((o) => o.priceSpecification.find((x) => x.priceCurrency === 'USD'));
    if (s.billing === 'monthly') {
      if (!svc.offers.every((o) => o.priceSpecification.every((x) => x['@type'] === 'UnitPriceSpecification' && x.unitCode === 'MON'))) fail(p, 'a monthly plan is not a price per month (UnitPriceSpecification MON)');
      const faq = ld['@graph'].find((n) => n['@type'] === 'FAQPage');
      if (faq && /MVP|full version|toʻliq versiya|полная версия|完成版|開発費用|開発期間/i.test(JSON.stringify(faq))) fail(p, 'the FAQ of a monthly service names an MVP or a full version');
    }
    if (usd[0].minPrice !== s.mvp.usd[0] || usd[0].maxPrice !== s.mvp.usd[1] || usd[1].minPrice !== s.full.usd[0] || usd[1].maxPrice !== s.full.usd[1]) fail(p, 'Service USD differs from the catalogue');
    // the page's large figures are the row's figures (the row says "MVP 3–5 hafta · 36–73 mln soʻm")
    const bigs = [...h.matchAll(/<span class="big">([^<]*)<\/span>/g)].map((m) => dec(m[1]));
    const [r1, r2] = rowFig[s.id] || ['', ''];
    if (bigs.length >= 2 && (!r1.includes(bigs[0]) || !r2.includes(bigs[1]))) fail(p, `prices «${bigs.slice(0, 2).join(' / ')}» differ from the catalogue row «${r1} / ${r2}»`);
  }
  const ph = read(PRICES[lang]);
  if (ph) {
    common(PRICES[lang], ph);
    const tables = (ph.match(/<table[\s>]/g) || []).length;
    if (tables < cat.groups.length) fail(PRICES[lang], `${tables} tables`);
    if (!/<th scope="row">/.test(ph) || !/<th scope="col"/.test(ph)) fail(PRICES[lang], 'no th scope');
    if (!/<ul class="ints">/.test(ph)) fail(PRICES[lang], 'no integrations list');
    if (!/2026/.test(ph.match(/<p class="meta mono">([\s\S]*?)<\/p>/)?.[1] || '')) fail(PRICES[lang], 'no dated rate line');
  }
}
const report = { at: new Date().toISOString(), pages, fails };
if (process.argv[2]) writeFileSync(process.argv[2], JSON.stringify(report, null, 1));
for (const f of fails.slice(0, 60)) console.log('  FAIL  ' + f);
console.log(fails.length ? `solutions-data-check: ${fails.length} failure(s) over ${pages} pages` : `solutions-data-check: ok (${pages} pages)`);
process.exit(fails.length ? 1 : 0);
