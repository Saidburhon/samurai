// The Solutions part of `npm run build` (called by scripts/build-pages.mjs after SamurAI, whose data files the
// basket reuses): the catalogue, one page per group and per solution, and the price list, in uz, ru, en and ja,
// through the shared page chrome. Returns the page entries ({ lang, path, file, slug, entry: 'solutions' }) for the
// fonts, preloads and sitemaps. Fails the build on a slug collision or a Japanese title or description out of range.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname } from 'node:path';
import { normalise, solutionUrl, CATALOGUE_BASE } from '../../src/shared/catalogue.js';
import { enrichSolution, plan, defaultSelection } from '../../src/shared/price.js';
import { usd as fUsd, uzs as fUzs, weeks as fWeeks } from '../../src/shared/format.js';
import { LANGS, HOME, pathOf, site } from '../site.mjs';
import { SOL } from './solutions-i18n.mjs';
import { postLinks } from './blog-feed.mjs';
import { view, rowsFile, renderCatalogue, renderGroup, renderSolution, renderPrices, metaSolution, metaGroup, metaCatalogue, metaPrices, groupFacts, groupUrl, PRICES } from './solutions.mjs';

const J = (p) => JSON.parse(readFileSync(p, 'utf8'));

// the blog posts per language with every catalogue id they name (front matter `related` plus their {{solution:…}} and
// {{prices:group=…}} shortcodes), content/blog and content/blog-ja, from the blog's own loader (scripts/pages/blog-feed.mjs)
const blogPosts = () => postLinks();

export function buildSolutions({ assets, page, t, plates, jaPhrases }) {
  const cat = J('content/solutions.json');
  const ja = existsSync('content/solutions-ja.json') ? J('content/solutions-ja.json').solutions : {};
  const model = normalise(cat, { ...J('content/solutions-extra.json'), ja_solutions: ja }, J('content/pricing.json'));
  const scope = existsSync('content/solutions-scope.json') ? J('content/solutions-scope.json').solutions : {};
  // the day's rate as SamurAI's build fetched it (worker/gen/meta.json), so every page and the basket show the same soʻm
  const meta = existsSync('worker/gen/meta.json') ? J('worker/gen/meta.json') : null;
  const rate = meta?.rate_fallback ? { ...meta.rate_fallback } : existsSync('content/rate.json') ? J('content/rate.json') : { uzs_per_usd: cat.currency.uzs_per_usd, date: cat.currency.rate_date };
  rate.source = 'cbu';
  // the basket prices with SamurAI's data file of the page's language (written by scripts/pages/samurai-build.mjs)
  const files = existsSync('public/assets/samurai') ? readdirSync('public/assets/samurai') : [];
  const dataFile = Object.fromEntries(LANGS.map((l) => [l, `/assets/samurai/${files.find((f) => f.startsWith(`data-${l}-`)) || ''}`]));

  // slugs: groups and solutions share one namespace per language
  for (const lang of LANGS) {
    const seen = new Map();
    for (const g of cat.groups) seen.set(groupUrl(g.id, lang), g.id);
    for (const s of model.solutions) { const u = solutionUrl(s, lang); if (seen.has(u)) throw new Error(`solutions: slug collision ${u} (${s.id} and ${seen.get(u)})`); seen.set(u, s.id); }
  }

  // the lens's starter lines: each industry's starter set, priced by the engine at size m (as SamurAI and the basket do)
  const starters = {};
  for (const lang of LANGS) {
    starters[lang] = {};
    for (const [id, ind] of Object.entries(model.industries)) {
      const ids = ((lang === 'ja' && ind.ja_starter) || ind.starter || []).filter((x) => model.byId.get(x) && model.byId.get(x).billing !== 'monthly');
      if (!ids.length) continue;
      const sols = ids.map((x, n) => enrichSolution(model, { n: n + 1, catalogue_id: x, size: 'm', scope: 'mvp', priority: 'must', modifiers: [], integrations: [], depends_on: [], difficulty: model.byId.get(x).difficulty }, { lang, rate }));
      const p = plan(model, sols, defaultSelection(sols), rate);
      starters[lang][id] = { items: ids, price: lang === 'ja' ? fUsd(p.totals.usd, lang) : fUzs(p.totals.uzs, lang), weeks: fWeeks(p.totals.weeks, lang) };
    }
  }
  const ctx = { model, cat, scope, rate, posts: blogPosts(), starters, dataFile, rowsFile: {}, updated: cat.updated || rate.date, email: site.email };
  // the catalogue's rows file per language (each opened row's sheet and the search words): fetched when the page is idle
  const OUT = 'public/assets/solutions';
  mkdirSync(OUT, { recursive: true });
  const keep = new Set();
  for (const lang of LANGS) {
    const body = JSON.stringify(rowsFile(view(ctx, lang)));
    const name = `rows-${lang}-${createHash('sha256').update(body).digest('hex').slice(0, 10)}.json`;
    writeFileSync(`${OUT}/${name}`, body);
    keep.add(name);
    ctx.rowsFile[lang] = `/assets/solutions/${name}`;
  }
  for (const f of readdirSync(OUT)) if (!keep.has(f)) unlinkSync(`${OUT}/${f}`);
  const entries = [];
  const pageAssets = { ...assets, js: assets.solutions || assets.js, css2: assets.solutionsCss };
  const write = (lang, path, html) => {
    // Japanese: phrase breaks in the text, but the breadcrumbs keep their names whole (they repeat the JSON-LD's)
    const out = lang === 'ja' ? jaPhrases(html).replace(/<nav class="crumbs[\s\S]*?<\/nav>/, (m) => m.replace(/<wbr>/g, '')) : html;
    const file = `public${path}index.html`;
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, out);
    return file;
  };
  const twinsOf = (f) => Object.fromEntries(LANGS.map((l) => [l, f(l)]));
  for (const lang of LANGS) {
    const V = view(ctx, lang);
    const T = SOL[lang];
    const home = { name: t(lang, 'home'), path: HOME[lang] };
    const catCrumb = { name: T.crumb, path: CATALOGUE_BASE[lang] };
    const emit = ({ path, twins, meta, r, crumbs, slug = 'solutions', kanji = '目録', gloss = T.hk }) => {
      const html = page({ lang, slug, path, twins, title: meta.title, description: meta.description, type: 'WebPage', crumbs, main: r.main, kanji, gloss, assets: pageAssets, ldExtra: r.ldExtra, mainEntity: r.mainEntity });
      entries.push({ lang, path, file: write(lang, path, html), slug, entry: 'solutions' });
    };
    // the catalogue
    emit({ path: CATALOGUE_BASE[lang], twins: twinsOf((l) => CATALOGUE_BASE[l]), meta: metaCatalogue(V), r: renderCatalogue(V), crumbs: [home, catCrumb] });
    // the groups
    for (const g of cat.groups) {
      const r = renderGroup(g.id, V);
      emit({ path: groupUrl(g.id, lang), twins: twinsOf((l) => groupUrl(g.id, l)), meta: metaGroup(g.id, V, groupFacts(g.id, V)), r, crumbs: [home, catCrumb, { name: V.gTitle(g.id), path: groupUrl(g.id, lang) }] });
    }
    // the solutions
    for (const s of model.solutions) {
      emit({ path: solutionUrl(s, lang), twins: twinsOf((l) => solutionUrl(s, l)), meta: metaSolution(s, V), r: renderSolution(s, V), crumbs: [home, catCrumb, { name: V.gTitle(s.group), path: groupUrl(s.group, lang) }, { name: V.L(s.title), path: solutionUrl(s, lang) }] });
    }
    // the price list
    emit({ path: PRICES[lang], twins: twinsOf((l) => PRICES[l]), meta: metaPrices(V), r: renderPrices(V), crumbs: [home, { name: T.pricesCrumb, path: PRICES[lang] }], slug: 'prices', kanji: '値', gloss: T.hkP });
  }
  void plates;
  console.log(`solutions: ${entries.length} pages (catalogue, ${cat.groups.length} groups, ${model.solutions.length} solutions, prices × ${LANGS.length}), rate ${rate.uzs_per_usd} (${rate.date}), scope ${Object.keys(scope).length}/${model.solutions.length}`);
  return entries;
}
