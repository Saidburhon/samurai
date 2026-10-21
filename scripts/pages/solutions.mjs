// The Solutions pages (SOLUTIONS-SPEC §4, Addendum A) in uz, ru, en and ja, generated from the catalogue:
//   catalogue  /yechimlar/  /ru/resheniya/  /en/solutions/  /ja/solutions/        the register (meikan): chapters by
//              group, one ruled row per solution (micro blade = timeline on one scale, micro hamon = difficulty),
//              lens, two-script search and sort (src/solutions/main.js); complete without JavaScript
//   group      <catalogue>/<group id>/                                           the service page of one group
//   solution   <catalogue>/<solution id>/                                        the oshigata plate and the sheet
//   prices     /narxlar/  /ru/tseny/  /en/prices/  /ja/prices/                   one ruled table per group
// Every figure comes from the catalogue (content/solutions.json) at the build-time CBU rate; the words around them
// are scripts/pages/solutions-i18n.mjs; the scope lists in uz, ru and ja are content/solutions-scope.json.
// Called by scripts/pages/solutions-build.mjs. Pure string building: no DOM.
import { CATALOGUE_BASE, solutionUrl } from '../../src/shared/catalogue.js';
import { usd as fUsd, uzs as fUzs, weeks as fWeeks, rateLine, dateNum, NB } from '../../src/shared/format.js';
import { uzsRange } from '../../src/shared/price.js';
import { bladePlate, hamonStrip, hamonFn, seedOf } from '../../src/samurai/plate.js';
import { fold } from '../../src/shared/translit.js';
import { SOL, GROUP_SEO, GROUP_LINE_JA, INDUSTRY_JA, GROUP_MODS, STOP, KEEP_CAP } from './solutions-i18n.mjs';
import { LANGS, pathOf, esc, abs, fwWidth } from '../site.mjs';
import { ORG_ID } from './ld.mjs';

export const PRICES = { uz: '/narxlar/', ru: '/ru/tseny/', en: '/en/prices/', ja: '/ja/prices/' };
export const catalogueUrl = (lang) => CATALOGUE_BASE[lang];
export const groupUrl = (gid, lang) => `${CATALOGUE_BASE[lang]}${gid}/`;
const fill = (s, o) => String(s).replace(/\{(\w+)\}/g, (m, k) => (o[k] != null ? o[k] : m));
const r1 = (v) => Math.round(v * 10) / 10;
const KISSAKI = '<svg aria-hidden="true"><use href="#kissaki"/></svg>';
const TICK = '<svg class="tick" viewBox="0 0 12 10" aria-hidden="true"><path d="M1 5.4l3.4 3.2L11 1.2"/></svg>';
const PLUS = '<svg class="plus" viewBox="0 0 10 10" aria-hidden="true"><path d="M5 .5v9M.5 5h9"/></svg>';
// a figure (a range with its unit) never breaks inside: lines break only between figures, at their separators
const nw = (s) => `<span class="nw">${esc(s)}</span>`;
// a template whose words are escaped and whose figures ({k} in figs) are unbreakable spans
const fillH = (tpl, o, figs = []) => esc(String(tpl)).replace(/\{(\w+)\}/g, (m, k) => (o[k] == null ? m : figs.includes(k) ? nw(o[k]) : esc(o[k])));
// a Japanese heading may break where a Latin name meets Japanese (飲食店向け／Telegram／注文ボット); the phrases inside
// are marked by scripts/pages/ja-phrases.mjs
const jaH = (t) => esc(t).replace(/([\u3040-\u30ff\u4e00-\u9fff])([A-Za-z][\w+.#-]{2,})/g, '$1<wbr>$2').replace(/([A-Za-z0-9]{3,})([\u30a0-\u30ff\u4e00-\u9fff])/g, '$1<wbr>$2');
const h1Text = (t, lang) => (lang === 'ja' ? jaH(t) : esc(t));
// the list of what we need as one sentence: the items after the first lose their capital (not a name or an acronym);
// commas between them, semicolons when an item holds a comma or a colon of its own
export function joinNeeds(list, lang) {
  if (lang === 'ja') return list.join('、');
  const items = list.map((x, i) => {
    const v = String(x).trim().replace(/[.;]+$/, '');
    const w = v.split(/[\s:,;]/)[0];
    if (!i || /\d/.test(w) || /^.\p{L}*\p{Lu}/u.test(w) || KEEP_CAP.some((n) => w === n || w.startsWith(`${n}-`))) return v;
    return v[0].toLocaleLowerCase(lang) + v.slice(1);
  });
  return items.join(items.some((x) => /[,:]/.test(x)) ? '; ' : ', ');
}

// ---- one language's view of the model ----------------------------------------------------------------------------
export function view(ctx, lang) {
  const { model, cat, scope, rate, posts } = ctx;
  const T = SOL[lang];
  const L = (o) => (o ? o[lang] ?? o.en ?? '' : '');
  const ja = lang === 'ja';
  const groups = cat.groups.map((g) => g.id);
  const sols = model.solutions;
  const byGroup = Object.fromEntries(groups.map((g) => [g, sols.filter((s) => s.group === g)]));
  const gTitle = (gid) => L(model.groups[gid].title);
  const gLine = (gid) => (ja ? GROUP_LINE_JA[gid] : L(cat.groups.find((g) => g.id === gid).line));
  const indName = (id) => (ja ? INDUSTRY_JA[id] : cat.industries[id]?.[lang]) || null;
  const uzsR = (r) => uzsRange(r, rate.uzs_per_usd);
  // the price as this language's reader thinks of it: soʻm first in Uzbekistan, dollars first for a company in Japan
  const prim = (r) => (ja ? fUsd(r, lang) : fUzs(uzsR(r), lang));
  const sec = (r) => (ja ? fUzs(uzsR(r), lang) : fUsd(r, lang));
  const from = (r) => (ja ? fUsd([r[0], r[0]], lang) : fUzs([uzsR(r)[0], uzsR(r)[0]], lang));
  const wk = (r) => fWeeks(r, lang);
  const monthly = (s) => s.billing === 'monthly';
  const maxFull = Math.max(...sols.filter((s) => !monthly(s)).map((s) => s.full.weeks[1]));
  const scopeOf = (s) => scope[s.id] || null;
  return { ctx, model, cat, scope, rate, posts, T, L, ja, lang, groups, sols, byGroup, gTitle, gLine, indName, uzsR, prim, sec, from, wk, monthly, maxFull, scopeOf };
}

// ---- drawings ----------------------------------------------------------------------------------------------------
// the micro blade: its length is the full version's longest timeline on one scale for the whole catalogue, the tick
// is the MVP's; an outline only (SOLUTIONS-SPEC §4.2)
function microBlade(s, V) {
  const W = 132, base = 7;
  const len = Math.max(12, ((W - base - 2) * s.full.weeks[1]) / V.maxFull);
  const mvp = Math.max(6, ((W - base - 2) * s.mvp.weeks[1]) / V.maxFull);
  const E = base + len, m = base + len / 2, sag = Math.min(2, len * 0.02);
  return `<svg class="mb" viewBox="0 0 ${W} 13" aria-hidden="true"><path class="k3" d="M0 4.8L${base} 4.1V7.1L0 6.5Z"/><path class="k2" d="M${base} 4Q${r1(m)} ${r1(4 - sag)} ${r1(E)} 2.6L${r1(E - 6)} 6.4Q${r1(m)} ${r1(7.6 - sag)} ${base} 7.3Z"/><path class="k4" d="M${r1(base + mvp)} 9.4v3.2"/></svg>`;
}
// the five temper lines as symbols, drawn once per page and used by every row
function hamonSymbols() {
  const out = [];
  for (let d = 1; d <= 5; d++) {
    const v = hamonFn(d, 7 + d), pts = [];
    for (let i = 0; i <= 22; i++) { const s = i / 22; pts.push(`${r1(s * 44)} ${r1(Math.max(0.5, Math.min(9.5, (v(s * 0.6 + 0.1) - 0.5) * 22 + 1.5)))}`); }
    out.push(`<symbol id="hm${d}" viewBox="0 0 44 10"><path d="M${pts.join('L')}"/></symbol>`);
  }
  return `<svg class="sprite" aria-hidden="true" focusable="false">${out.join('')}</svg>`;
}
const microHamon = (d, label) => `<svg class="mh" viewBox="0 0 44 10" role="img" aria-label="${esc(label)}"><use href="#hm${d}"/></svg>`;

// ---- the shared parts --------------------------------------------------------------------------------------------
const samurai = (lang, q = {}) => {
  const p = new URLSearchParams(Object.entries(q).filter(([, v]) => v));
  return `${pathOf(lang, 'samurai')}${p.toString() ? `?${p}` : ''}`;
};
// the SamurAI line: an underlined sentence that sends the visitor's words to /samurai/ (a plain GET form: no JS needed)
function samLine(V, hidden = {}) {
  const { T, lang } = V;
  return `<form class="samline" action="${pathOf(lang, 'samurai')}" method="get">
    <label for="sam-q">${esc(T.samLine)}</label>
    <span class="sl-row"><input id="sam-q" name="q" type="text" maxlength="1500" autocomplete="off" placeholder="${esc(T.samPh)}">${Object.entries(hidden).filter(([, v]) => v).map(([k, v]) => `<input type="hidden" name="${k}" value="${esc(v)}">`).join('')}<button class="btn" type="submit"><span>${esc(T.samGo)}</span>${KISSAKI}</button></span>
  </form>`;
}
const addBtn = (s, V) => (V.monthly(s) ? '' : `<button class="add" type="button" data-add="${s.id}" aria-pressed="false"><span class="a-off">${PLUS}${esc(V.T.add)}</span><span class="a-on">${TICK}${esc(V.T.added)}</span></button>`);
const chips = (list) => `<ul class="chips">${list.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
const lines = (list) => `<ul class="ticks">${list.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
const integrationNames = (s, V) => s.integrations.map((k) => V.model.integrations[k]).filter(Boolean).map((i) => i.names?.[V.lang] || i.name);
const industryNames = (s, V) => s.industries.map(V.indName).filter(Boolean);
const needsOf = (s, V) => s.needs?.[V.lang] || s.needs?.en || [];
// a row's two figure lines as [label, weeks, price]: MVP and full version, or a monthly service's two plans
const figParts = (s, V) => {
  const { T } = V;
  if (V.monthly(s)) return [[T.monthly.basic, '', V.prim(s.mvp.usd), T.perM], [T.monthly.ext, '', V.prim(s.full.usd), T.perM]];
  return [[T.mvp, V.wk(s.mvp.weeks), V.prim(s.mvp.usd)], [T.full, V.wk(s.full.weeks), V.prim(s.full.usd)]];
};
// the same in HTML: each figure unbreakable; in a row (grid) the label, weeks and price stand in columns
// a monthly price with its "per month" ("oyiga 6–18,5 mln soʻm", "$500–1,500 per month", "月額500〜1,500ドル")
const perH = (pm, p) => esc(pm('\u0001')).replace('\u0001', nw(p));
const figLine = ([l, w, p, pm]) => (w ? `${esc(l)} ${nw(w)} · ${nw(p)}` : `${esc(l)} · ${perH(pm, p)}`);
const figCells = ([l, w, p, pm]) => `<b>${esc(l)}</b> ${w ? `<i>${esc(w)}</i> <i>${esc(p)}</i>` : `<i class="m">${perH(pm, p)}</i>`}`;
// the search text of a row: titles and one-liners in every language, the group, the integrations and the
// industries, folded (Cyrillic Uzbek to Latin, every okina variant dropped), so one query finds it in any script
function searchText(s, V) {
  const { model } = V;
  const parts = [s.id.replace(/-/g, ' ')];
  for (const l of LANGS) if (l !== V.lang && (l !== 'ja' || V.lang === 'en')) parts.push(s.title?.[l]);
  for (const k of s.integrations) { const i = model.integrations[k]; if (i) parts.push(i.name); }
  return [...new Set(fold(parts.filter(Boolean).join(' ')).replace(/[^\p{L}\p{N}]+/gu, ' ').trim().split(' '))].join(' ');
}
// platform and goal of a row, for the lens (from its group and its words)
function platformsOf(s) {
  const en = `${s.title.en} ${s.oneliner?.en || ''}`.toLowerCase();
  const p = new Set();
  const G = { telegram: ['telegram'], web: ['web'], mobile: ['mobile'], iot: ['iot'], ai: ['ai'], business: ['web'], cloud: ['web'], games: ['mobile', 'web'] }[s.group] || [];
  G.forEach((x) => p.add(x));
  if (/telegram/.test(en)) p.add('telegram');
  if (/\b(app|ios|android|mobile)\b/.test(en)) p.add('mobile');
  if (/\b(website|web|portal|online store|platform|dashboard)\b/.test(en)) p.add('web');
  if (/desktop|windows|kiosk|pos\b|till/.test(en)) p.add('desktop');
  if (/\b(ai|assistant|agent|vision|voice)\b/.test(en)) p.add('ai');
  if (/sensor|device|iot|gps|camera|tracker/.test(en)) p.add('iot');
  return [...p];
}
function goalsOf(s, V) {
  const out = [];
  for (const [g, w] of Object.entries(V.model.goals || {})) if ((w[s.group] || 0) >= 2) out.push(g);
  if (s.integrations.some((k) => ['payme', 'click', 'uzum', 'uzcard_humo'].includes(k)) && !out.includes('payments')) out.push('payments');
  return out;
}

// ---- one register row (catalogue and group pages) ----------------------------------------------------------------
// the opened row's spec sheet: [label, html] pairs (SOLUTIONS-SPEC §4.2: MVP scope, full scope, integrations,
// who it is for, what we need from you, per month). On the catalogue it comes from the rows file on first open
// (the HTML stays inside its weight budget); on a group page it is in the HTML.
function rowSheet(s, V) {
  const { T, lang } = V;
  const sc = V.scopeOf(s);
  const sep = lang === 'ja' ? '、' : ', ';
  const dl = [];
  if (sc?.mvp?.[lang]?.length) dl.push([V.monthly(s) ? T.monthly.basic : T.dl.mvpScope, lines(sc.mvp[lang])]);
  if (sc?.full?.[lang]?.length) dl.push([V.monthly(s) ? T.monthly.ext : T.dl.fullScope, lines(sc.full[lang])]);
  const ints = integrationNames(s, V);
  if (ints.length) dl.push([T.dl.ints, chips(ints)]);
  const who = industryNames(s, V);
  if (who.length) dl.push([T.dl.who, esc(who.join(sep))]);
  if (s.monthly_usd[1] > 0 && !V.monthly(s)) dl.push([T.dl.month, `<span class="fig nw">${esc(V.prim(s.monthly_usd))}</span> <span class="note">${esc(T.monthNote)}</span>`]);
  return dl;
}
const sheetHtml = (dl) => dl.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join('');
// the catalogue's rows file: each row's sheet (HTML) and the search words of the other languages' titles
export function rowsFile(V) {
  const est = (s) => (V.monthly(s) ? '' : samurai(V.lang, { solutions: s.id, industry: s.industries.find((i) => V.model.industries[i]) }));
  return { v: 1, estimate: V.T.estimate, rows: Object.fromEntries(V.sols.map((s) => [s.id, [sheetHtml(rowSheet(s, V)), est(s)]])), index: Object.fromEntries(V.sols.map((s) => [s.id, searchText(s, V)])) };
}
function row(s, V, { open = false, full = false } = {}) {
  const { T, lang } = V;
  const [f1, f2] = figParts(s, V);
  const ind = s.industries.find((i) => V.model.industries[i]);
  // the lens and the sort read these (the catalogue); a group page has neither and keeps only the id
  const data = `data-id="${s.id}"${full ? '' : ` data-g="${s.group}" data-d="${s.difficulty}" data-w="${s.mvp.weeks[1]}" data-p="${s.mvp.usd[0]}" data-ind="${s.industries.join(' ')}" data-pl="${platformsOf(s).join(' ')}" data-goal="${goalsOf(s, V).join(' ')}"`}${V.monthly(s) ? ' data-m="1"' : ''}`;
  return `<li class="sr" ${data}>
<details${open ? ' open' : ''}><summary><h3>${esc(V.L(s.title))}</h3><span class="sr-o">${esc(V.L(s.oneliner))}</span><span class="sr-g">${microBlade(s, V)}${microHamon(s.difficulty, `${T.dl.diff}: ${T.diff[s.difficulty - 1]}`)}</span><span class="sr-f mono${[f1, f2].some(([l, w, p]) => l.length + w.length + p.length >= 36) ? ' lg' : ''}">${figCells(f1)} ${figCells(f2)}</span><span class="sr-x" aria-hidden="true"></span></summary>
<div class="sr-b"><dl class="sheet"${full ? '' : ' data-lazy'}>${full ? sheetHtml(rowSheet(s, V)) : ''}</dl><p class="sr-a"><a class="u" href="${solutionUrl(s, lang)}">${esc(T.details)}<span class="vh">${lang === 'ja' ? '：' : ': '}${esc(V.L(s.title))}</span></a>${V.monthly(s) || !full ? '' : `<a class="u" href="${esc(samurai(lang, { solutions: s.id, industry: ind }))}">${esc(T.estimate)}</a>`}</p></div>
</details></li>`;
}
function chapter(gid, V, { open = false, head = true, full = false } = {}) {
  const list = V.byGroup[gid];
  const h = head ? `<header class="ch-h"><h2 id="g-${gid}"><a href="${groupUrl(gid, V.lang)}">${esc(V.gTitle(gid))}</a></h2><p class="ch-v mono" aria-hidden="true">${esc(V.lang === 'ja' ? gid.toUpperCase() : V.gTitle(gid))}</p><p class="ch-l">${esc(V.gLine(gid))}</p></header>` : '';
  return `<section class="chap" data-g="${gid}"${head ? ` aria-labelledby="g-${gid}"` : ''}>${h}<ol class="reg">${list.map((s) => row(s, V, { open, full })).join('\n')}</ol></section>`;
}
function lensBar(V) {
  const { T, lang, cat, ja } = V;
  const opt = (v, t) => `<option value="${esc(v)}">${esc(t)}</option>`;
  const sel = (name, label, opts) => `<label class="ln"><span class="ln-k mono">${esc(label)}</span><span class="ln-v"><select name="${name}">${opt('', T.any)}${opts.join('')}</select></span></label>`;
  const inds = Object.keys(cat.industries).filter((i) => i !== 'any').map((i) => [i, V.indName(i)]).filter(([, n]) => n).sort((a, b) => a[1].localeCompare(b[1], lang));
  const budgets = ja ? [[5000, '5,000ドルまで'], [10000, '1万ドルまで'], [20000, '2万ドルまで'], [50000, '5万ドルまで'], [100000, '10万ドルまで']] : [10, 25, 50, 100, 250].map((v) => [v * 1e6, T.budget(v)]);
  const goals = ['sales', 'control', 'less_manual', 'new_customers', 'payments'];
  const pls = ['telegram', 'web', 'mobile', 'desktop', 'iot', 'ai'];
  return `<form class="lens" role="search" action="" method="get">
    ${sel('industry', T.lens.industry, inds.map(([v, t]) => opt(v, t)))}
    ${sel('goal', T.lens.goal, goals.map((g, i) => opt(g, T.goals[i])))}
    ${sel('budget', T.lens.budget, budgets.map(([v, t]) => opt(v, t)))}
    ${sel('weeks', T.lens.weeks, [4, 8, 12].map((w) => opt(w, T.weeks(w))))}
    ${sel('platform', T.lens.platform, pls.map((p, i) => opt(p, T.platforms[i])))}
    <label class="ln ln-q"><span class="ln-k mono">${esc(T.lens.q)}</span><span class="ln-v"><input type="search" name="q" autocomplete="off" spellcheck="false" enterkeyhint="search"></span></label>
    <noscript><button class="btn" type="submit"><span>${esc(T.lens.q)}</span></button></noscript>
  </form>
  <div class="lens-out" hidden><p class="starter"></p><p class="found mono" aria-live="polite"></p><button class="clear mono u" type="button">${esc(T.clear)}</button></div>
  <p class="sort mono" role="group" aria-label="${esc(T.sort)}"><span>${esc(T.sort)}${lang === 'ja' ? '：' : ':'}</span>${['', 'weeks', 'price', 'difficulty'].map((k, i) => `<button type="button" data-sort="${k}" aria-pressed="${i === 0}">${esc(T.sorts[i])}</button>`).join('')}</p>`;
}
const tray = (V) => `<aside class="tray" id="tray" hidden aria-label="${esc(V.T.basket.h)}"></aside>`;
// the page's inline data: search index, the lens's starter lines (priced at build time by the same engine),
// the words the scripts need, and the SamurAI data file that prices the basket
function pageData(V, extra = {}) {
  const { T, lang } = V;
  return `<script type="application/json" id="sol-data">${JSON.stringify({
    lang, data: V.ctx.dataFile[lang], rate: V.rate, samurai: pathOf(lang, 'samurai'),
    t: { found: T.found, none: T.none, basket: T.basket, mvp: T.mvp, full: T.full, add: T.add, added: T.added, email: V.ctx.email },
    stop: STOP, ...extra,
  }).replace(/</g, '\\u003c')}</script>`;
}

// ---- the catalogue ---------------------------------------------------------------------------------------------
export function renderCatalogue(V) {
  const { T, lang, groups, sols } = V;
  const starters = {};
  for (const [id, ind] of Object.entries(V.model.industries)) {
    const st = V.ctx.starters[lang]?.[id];
    if (!st || !ind.plural?.[lang]) continue;
    // [plural, ids, the combined figures (HTML)]: each title and link is the row's own (src/solutions/register.js)
    starters[id] = [ind.plural[lang], st.items, fillH(T.together, { price: st.price, weeks: st.weeks }, ['price', 'weeks'])];
  }
  const main = `
  <header class="pg-head sol-head">
    <h1>${esc(T.h1)}</h1>
    <p class="lede">${esc(fill(T.lede, { n: sols.length, g: groups.length }))}</p>
    ${samLine(V)}
  </header>
  ${hamonSymbols()}
  <div class="register" id="register">
  ${lensBar(V)}
  <p class="none" hidden>${esc(T.none)}</p>
  ${groups.map((g) => chapter(g, V)).join('\n')}
  </div>
  <p class="honest"><a class="u" href="${PRICES[lang]}">${esc(T.pricesCrumb)}</a> · <span class="mono">${esc(rateLine(V.rate, lang))}</span></p>
  ${tray(V)}
  ${pageData(V, { rows: V.ctx.rowsFile[lang], starters, st: [T.starter, T.samCalc] })}`;
  const url = abs(catalogueUrl(lang));
  const list = { '@type': 'ItemList', '@id': `${url}#list`, name: T.h1, numberOfItems: sols.length, itemListElement: sols.map((s, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(solutionUrl(s, lang)) })) };
  return { main, ldExtra: [list], mainEntity: `${url}#list` };
}

// ---- a group (service) page ------------------------------------------------------------------------------------
const span = (list, f) => [Math.min(...list.map((s) => f(s)[0])), Math.max(...list.map((s) => f(s)[1]))];
export function groupFacts(gid, V) {
  const list = V.byGroup[gid].filter((s) => !V.monthly(s));
  const all = list.length ? list : V.byGroup[gid];
  return { list: all, mvpUsd: span(all, (s) => s.mvp.usd), mvpW: span(all, (s) => s.mvp.weeks), fullUsd: span(all, (s) => s.full.usd), fullW: span(all, (s) => s.full.weeks) };
}
function raises(V, gid, sols) {
  const { T, lang, model } = V;
  const items = [];
  for (const k of GROUP_MODS[gid] || []) {
    const m = model.modifiers[k];
    if (!m) continue;
    const parts = [];
    if (m.mult && m.mult > 1) parts.push(T.mult(Math.round((m.mult - 1) * 100)));
    if (m.weeks_mult && m.weeks_mult > 1) parts.push(T.multW(Math.round((m.weeks_mult - 1) * 100)));
    if (m.add_usd) parts.push(`+${V.ja ? fUsd(m.add_usd, lang) : fUzs(V.uzsR(m.add_usd), lang)}`);
    if (m.add_weeks) parts.push(`+${V.wk(m.add_weeks)}`);
    items.push([V.L(m.label), parts.map(nw).join(', ')]);
  }
  // the integrations these solutions can add, most used first
  const count = new Map();
  for (const s of sols) for (const k of s.integrations) if (!s.integrations_included.includes(k)) count.set(k, (count.get(k) || 0) + 1);
  const ints = [...count].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k]) => model.integrations[k]).filter(Boolean);
  for (const i of ints) { const nm = i.names?.[lang] || i.name, wh = V.L(i.what); items.push([wh.includes(nm) ? wh : `${nm}: ${wh}`, `${nw(`+${V.ja ? fUsd(i.add_usd, lang) : fUzs(V.uzsR(i.add_usd), lang)}`)}, ${nw(`+${V.wk(i.add_weeks)}`)}`]); }
  return `<dl class="sheet raise">${items.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd class="mono">${v}</dd></div>`).join('')}</dl>`;
}
// qa: [question, answer (text, for the FAQPage), answer (HTML, its figures unbreakable)]
function faqBlock(V, qa) {
  return `<section class="row faq" aria-labelledby="faq-h"><h2 id="faq-h">${esc(V.T.faq)}</h2><div class="row-body"><dl class="qa">${qa.map(([q, a, h]) => `<div><dt>${esc(q)}</dt><dd>${h ?? esc(a)}</dd></div>`).join('')}</dl></div></section>`;
}
const FIGS = ['usd', 'uzs', 'fusd', 'fuzs', 'weeks', 'fweeks', 'price', 'fprice'];
const qaOf = (tpl, vals) => tpl.map(([q, a]) => [fill(q, vals), fill(a, vals), fillH(a, vals, FIGS)]);
const faqLd = (url, qa) => ({ '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: qa.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
// the posts about this page: those that name the page's own id first (`own`), then those about its group or its
// solutions, the latter rotated by `turn` (a solution's place in its group) so each post is linked from some page
function postsBlock(V, ids, own = ids, turn = 0) {
  const all = V.posts[V.lang].filter((p) => p.related.some((r) => ids.includes(r)));
  // a post that prints this page's figures (a shortcode) first, then by how early it names the page in `related`
  const rank = (p) => (p.named?.some((r) => ids.includes(r)) ? 0 : 10) + Math.min(...own.map((r) => (p.related.includes(r) ? p.related.indexOf(r) : 9)));
  const first = all.filter((p) => p.related.some((r) => own.includes(r))).sort((a, b) => rank(a) - rank(b));
  const rest = all.filter((p) => !first.includes(p));
  const k = rest.length ? turn % rest.length : 0;
  const list = [...first, ...rest.slice(k), ...rest.slice(0, k)].slice(0, 4);
  if (!list.length) return '';
  return `<section class="row posts" aria-labelledby="po-h"><h2 id="po-h">${esc(V.T.posts)}</h2><div class="row-body"><ul class="list">${list.map((p) => `<li><a class="u" href="${p.url}">${esc(p.title)}</a></li>`).join('')}</ul></div></section>`;
}
function groupQa(gid, V, f) {
  const { T, lang, L } = V;
  const needs = needsOf(f.list[0], V);
  const name = GROUP_SEO[gid][lang];
  const vals = { t: lang === 'en' ? name.replace(/^(Mobile|Websites|Games|Business|Cloud|Support|Industry)\b/, (m) => m.toLowerCase()) : name, usd: fUsd(f.mvpUsd, lang), uzs: fUzs(V.uzsR(f.mvpUsd), lang), fusd: fUsd([f.fullUsd[1], f.fullUsd[1]], lang), weeks: V.wk(f.mvpW), fweeks: V.wk(f.fullW), needs: joinNeeds(needs, lang) };
  void L;
  return qaOf(T.faqGroup, vals);
}
export function renderGroup(gid, V) {
  const { T, lang } = V;
  const f = groupFacts(gid, V);
  const sols = V.byGroup[gid];
  const lede = fillH(T.groupLede, { line: V.gLine(gid), n: sols.length, weeks: V.wk(f.mvpW), price: V.from(f.mvpUsd) }, ['weeks', 'price']);
  const qa = groupQa(gid, V, f);
  const url = abs(groupUrl(gid, lang));
  const main = `
  <header class="pg-head sol-head">
    <h1>${h1Text(GROUP_SEO[gid][lang], lang)}</h1>
    <p class="lede">${lede}</p>
    <p class="meta mono">${fillH(T.groupRange, { price: V.prim(f.mvpUsd), weeks: V.wk(f.mvpW) }, ['price', 'weeks'])} · ${esc(rateLine(V.rate, lang))}</p>
    ${samLine(V)}
  </header>
  ${hamonSymbols()}
  <div class="register reg-group">${chapter(gid, V, { open: true, head: false, full: true })}</div>
  <section class="row" aria-labelledby="rs-h"><h2 id="rs-h">${esc(T.dl.raises)}</h2><div class="row-body">${raises(V, gid, sols)}<p class="fine"><a class="u" href="${PRICES[lang]}">${esc(T.pricesCrumb)}</a></p></div></section>
  ${faqBlock(V, qa)}
  ${postsBlock(V, [gid, ...sols.map((s) => s.id)], [gid])}
  ${tray(V)}
  ${pageData(V)}`;
  const list = { '@type': 'ItemList', '@id': `${url}#list`, name: V.gTitle(gid), numberOfItems: sols.length, itemListElement: sols.map((s, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(solutionUrl(s, lang)) })) };
  return { main, ldExtra: [list, faqLd(url, qa)], mainEntity: `${url}#list`, facts: f };
}

// ---- a solution page ------------------------------------------------------------------------------------------
function solQa(s, V) {
  const { T, lang } = V;
  const needs = needsOf(s, V);
  const vals = { t: V.L(s.title), usd: fUsd(s.mvp.usd, lang), uzs: fUzs(V.uzsR(s.mvp.usd), lang), fusd: fUsd(s.full.usd, lang), fuzs: fUzs(V.uzsR(s.full.usd), lang), weeks: V.wk(s.mvp.weeks), fweeks: V.wk(s.full.weeks), needs: joinNeeds(needs, lang) };
  // a monthly service is two plans a month and a start date, not an MVP and a full version with build times
  return qaOf(V.monthly(s) ? T.faqMon : T.faqSol, vals);
}
export function renderSolution(s, V) {
  const { T, lang, model } = V;
  const sc = V.scopeOf(s);
  const url = abs(solutionUrl(s, lang));
  const mon = V.monthly(s);
  const title = V.L(s.title);
  const lede = mon ? fillH(T.monLede, { line: V.L(s.oneliner), price: V.prim(s.mvp.usd), weeks: V.wk(s.mvp.weeks) }, ['price', 'weeks']) : fillH(T.solLede, { line: V.L(s.oneliner), weeks: V.wk(s.mvp.weeks), price: V.from(s.mvp.usd), fweeks: V.wk(s.full.weeks) }, ['weeks', 'price', 'fweeks']);
  const ind = s.industries.find((i) => V.model.industries[i]);
  // the plate: 720 units wide on a desktop; on a phone a 360-unit drawing of the same blade on the same scale, so the
  // whole catalogue scale (and the kissaki of the longest blade) fits the screen with its labels at 12 px or more
  const plateAt = (width, dots) => (mon ? '' : bladePlate({ seed: seedOf(s.id), weeks: { mvp: s.mvp.weeks, full: s.full.weeks }, state: 'full', scaleWeeks: V.maxFull, width, difficulty: s.difficulty, dots, labels: { mvp: `${T.mvp} ${V.wk(s.mvp.weeks)}`, full: `${T.full} ${V.wk(s.full.weeks)}`, tick: T.mvp, aria: fill(T.plate.aria, { title, mvp: V.wk(s.mvp.weeks), full: V.wk(s.full.weeks) }) } }).svg);
  // the plate's ruler: the catalogue's weeks scale (the same one every blade is drawn on), every 4 weeks a tick,
  // a figure every `step` weeks
  const ruled = (svg, W, step, cls) => {
    if (!svg) return svg;
    const base = 36, usable = W - base - 12, x = (w) => r1(base + (usable * w) / V.maxFull);
    let g = `<g class="ruler"><path d="M${base} 104H${x(V.maxFull)}"/>`;
    for (let w = 0; w <= V.maxFull; w += 4) g += `<path d="M${x(w)} 104v${w % step ? 3 : 6}"/>`;
    // the last figure carries the unit when it has the room ("56 hafta"); at the end of a phone's ruler only the number
    const cw = W > 400 ? 7 : 8, wid = (t) => [...String(t)].reduce((a, c) => a + (c.charCodeAt(0) > 0x2e80 ? 2 : 1), 0) * cw;
    for (let w = 0; w <= V.maxFull; w += step) {
      const last = w + step > V.maxFull, room = W - x(w);
      const t = last && room >= wid(V.wk([w, w])) / 2 ? V.wk([w, w]) : String(w);
      g += `<text x="${x(w)}" y="122" text-anchor="${w ? (room >= wid(t) / 2 ? 'middle' : 'end') : 'start'}">${esc(t)}</text>`;
    }
    return svg.replace('class="plate-svg"', `class="plate-svg ${cls}"`).replace(new RegExp(`viewBox="0 0 ${W} 96" width="${W}" height="96"`), `viewBox="0 0 ${W} 128" width="${W}" height="128"`).replace(/<\/svg>$/, `${g}</g></svg>`);
  };
  const plate = mon ? '' : ruled(plateAt(720, 380), 720, 8, 'pl') + ruled(plateAt(360, 150), 360, 20, 'ps');
  const sheet = [];
  if (mon) {
    // the plan's label carries the unit: "Asosiy reja, oyiga", "基本プラン（月額）"
    const perLabel = (k) => (V.ja ? `${k}（${T.monthly.per}）` : `${k}, ${T.monthly.per}`);
    sheet.push([T.monthly.start, nw(V.wk(s.mvp.weeks))]);
    sheet.push([perLabel(T.monthly.basic), `<span class="big">${esc(V.prim(s.mvp.usd))}</span> <span class="sec mono">${esc(V.sec(s.mvp.usd))}</span>`]);
    sheet.push([perLabel(T.monthly.ext), `<span class="big">${esc(V.prim(s.full.usd))}</span> <span class="sec mono">${esc(V.sec(s.full.usd))}</span>`]);
  } else {
    // the pairs stand side by side while the wider of the two prices fits its half of the sheet, then one above the
    // other (src/styles/solutions.css container queries); w1, w2: the price is 13–16 or 17+ characters wide
    const fwid = (t) => [...t].reduce((a, c) => a + (c.charCodeAt(0) > 0x2e80 ? 2 : 1), 0);
    const pw = Math.max(fwid(V.prim(s.mvp.usd)), fwid(V.prim(s.full.usd)));
    const pc = `pair${pw >= 17 ? ' w2' : pw >= 13 ? ' w1' : ''}`;
    sheet.push([T.dl.time, `<span class="${pc}"><span><b class="mono">${T.mvp}</b> ${nw(V.wk(s.mvp.weeks))}</span><span><b class="mono">${esc(T.full)}</b> ${nw(V.wk(s.full.weeks))}</span></span>`]);
    sheet.push([T.dl.price, `<span class="${pc}"><span><b class="mono">${T.mvp}</b> <span class="big">${esc(V.prim(s.mvp.usd))}</span> <span class="sec mono">${esc(V.sec(s.mvp.usd))}</span></span><span><b class="mono">${esc(T.full)}</b> <span class="big">${esc(V.prim(s.full.usd))}</span> <span class="sec mono">${esc(V.sec(s.full.usd))}</span></span></span><span class="rate mono">${esc(rateLine(V.rate, lang))}</span>`]);
    if (s.monthly_usd[1] > 0) sheet.push([T.dl.month, `${nw(V.prim(s.monthly_usd))} <span class="note">${esc(T.monthNote)}</span>`]);
  }
  sheet.push([T.dl.diff, `<span class="diff">${hamonStrip({ difficulty: s.difficulty, seed: seedOf(s.id), label: `${T.dl.diff}: ${T.diff[s.difficulty - 1]}` })}<span>${esc(T.diff[s.difficulty - 1])}</span></span>`]);
  const who = industryNames(s, V);
  if (who.length) sheet.push([T.dl.who, esc(who.join(lang === 'ja' ? '、' : ', '))]);
  const ints = s.integrations.map((k) => model.integrations[k]).filter(Boolean);
  if (ints.length) sheet.push([T.dl.ints, `<ul class="chips">${ints.map((i) => `<li title="${esc(V.L(i.what))}">${esc(i.names?.[lang] || i.name)}</li>`).join('')}</ul>`]);
  const get = [];
  if (sc?.mvp?.[lang]?.length) get.push([mon ? T.monthly.basic : T.dl.mvpScope, lines(sc.mvp[lang])]);
  if (sc?.full?.[lang]?.length) get.push([mon ? T.monthly.ext : T.dl.fullScope, lines(sc.full[lang])]);
  if (sc?.notes?.[lang]) get.push([T.dl.notes, `<p>${esc(sc.notes[lang])}</p>`]);
  const needs = needsOf(s, V);
  const qa = solQa(s, V);
  // related: the same group (nearest in the register first), then what it grows into
  const same = V.byGroup[s.group].filter((x) => x.id !== s.id);
  const at = V.byGroup[s.group].indexOf(s);
  same.sort((a, b) => Math.abs(V.byGroup[s.group].indexOf(a) - at) - Math.abs(V.byGroup[s.group].indexOf(b) - at));
  const next = (s.next || []).map((id) => model.byId.get(id)).filter(Boolean);
  const rel = [...next, ...same.filter((x) => !next.includes(x))].slice(0, 5);
  const main = `
  <header class="pg-head sol-head">
    <h1 style="view-transition-name:sol-${s.id}">${h1Text(title, lang)}</h1>
    <p class="lede">${lede}</p>
    <p class="acts">${mon ? '' : `<a class="btn" href="${esc(samurai(lang, { solutions: s.id, industry: ind }))}"><span>${esc(T.estimate)}</span>${KISSAKI}</a>`}${addBtn(s, V)}</p>
  </header>
  ${plate ? `<figure class="sol-plate" aria-hidden="true">${plate}</figure>` : ''}
  <section class="row sheet-row" aria-labelledby="sh-h"><h2 id="sh-h">${esc(T.sheetH)}</h2><div class="row-body"><dl class="sheet">${sheet.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join('')}</dl></div></section>
  ${get.length ? `<section class="row" aria-labelledby="gt-h"><h2 id="gt-h">${esc(T.getH)}</h2><div class="row-body"><dl class="sheet get">${get.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join('')}</dl></div></section>` : ''}
  ${needs.length ? `<section class="row" aria-labelledby="nd-h"><h2 id="nd-h">${esc(T.dl.needs)}</h2><div class="row-body">${lines(needs)}</div></section>` : ''}
  ${mon ? '' : `<section class="row" aria-labelledby="rs-h"><h2 id="rs-h">${esc(T.dl.raises)}</h2><div class="row-body">${raises(V, s.group, [s])}</div></section>`}
  ${faqBlock(V, qa)}
  ${rel.length ? `<section class="row rel" aria-labelledby="rl-h"><h2 id="rl-h">${esc(next.length ? T.next : T.related)}</h2><div class="row-body"><ul class="rel-list">${rel.map((x) => `<li><a href="${solutionUrl(x, lang)}"><span class="t">${esc(V.L(x.title))}</span><span class="f mono">${figLine(figParts(x, V)[0])}</span></a></li>`).join('')}</ul></div></section>` : ''}
  ${postsBlock(V, [s.id, s.group], [s.id], V.byGroup[s.group].indexOf(s))}
  ${tray(V)}
  ${pageData(V)}`;
  // a monthly plan is a price per month (UnitPriceSpecification, UN/CEFACT unit MON), not a one-off price
  const unit = mon ? { '@type': 'UnitPriceSpecification', unitCode: 'MON', unitText: 'month' } : { '@type': 'PriceSpecification' };
  const spec = (r) => [{ ...unit, minPrice: r[0], maxPrice: r[1], priceCurrency: 'USD' }, { ...unit, minPrice: V.uzsR(r)[0], maxPrice: V.uzsR(r)[1], priceCurrency: 'UZS' }];
  const service = {
    '@type': 'Service', '@id': `${url}#service`, name: title, description: V.L(s.oneliner), url, serviceType: V.gTitle(s.group),
    provider: { '@id': ORG_ID }, areaServed: lang === 'ja' ? [{ '@type': 'Country', name: 'Uzbekistan' }, { '@type': 'Country', name: 'Japan' }] : { '@type': 'Country', name: 'Uzbekistan' },
    offers: [
      { '@type': 'Offer', name: mon ? T.monthly.basic : 'MVP', priceSpecification: spec(s.mvp.usd) },
      { '@type': 'Offer', name: mon ? T.monthly.ext : (lang === 'uz' ? 'Toʻliq versiya' : lang === 'ru' ? 'Полная версия' : lang === 'ja' ? '完成版' : 'Full version'), priceSpecification: spec(s.full.usd) },
    ],
  };
  return { main, ldExtra: [service, faqLd(url, qa)], mainEntity: `${url}#service` };
}

// ---- the price list --------------------------------------------------------------------------------------------
export function renderPrices(V) {
  const { T, lang, groups, model } = V;
  const head = `<thead><tr>${T.th.map((h, i) => `<th scope="col"${i ? ' class="n"' : ''}>${esc(h)}</th>`).join('')}</tr></thead>`;
  const cssStr = (x) => `'${String(x).replace(/'/g, '’')}'`;
  const labels = (list) => ` style="${esc(list.map((x, i) => `--l${i + 2}:${cssStr(x)}`).join(';'))}"`;
  const cell = (r) => `<td><b class="nw">${esc(V.prim(r))}</b><i class="nw">${esc(V.sec(r))}</i></td>`;
  const tables = groups.map((gid) => {
    const list = V.byGroup[gid].filter((s) => !V.monthly(s));
    const body = list.map((s) => `<tr><th scope="row"><a href="${solutionUrl(s, lang)}">${esc(V.L(s.title))}</a></th><td>${esc(V.wk(s.mvp.weeks))}</td>${cell(s.mvp.usd)}<td>${esc(V.wk(s.full.weeks))}</td>${cell(s.full.usd)}<td>${s.monthly_usd[1] > 0 ? esc(V.prim(s.monthly_usd)) : '0'}</td></tr>`).join('');
    return `<section class="ptab" aria-labelledby="p-${gid}"><h2 id="p-${gid}"><a href="${groupUrl(gid, lang)}">${esc(V.gTitle(gid))}</a></h2><table${labels(T.th.slice(1))}>${head}<tbody>${body}</tbody></table></section>`;
  });
  const mon = V.sols.filter((s) => V.monthly(s));
  const monTable = mon.length ? `<section class="ptab" aria-labelledby="p-monthly"><h2 id="p-monthly">${esc(T.monthly.h)}</h2><table${labels([T.monthly.start, T.monthly.basic, T.monthly.ext])}><thead><tr><th scope="col">${esc(T.th[0])}</th><th scope="col" class="n">${esc(T.monthly.start)}</th><th scope="col" class="n">${esc(T.monthly.basic)}</th><th scope="col" class="n">${esc(T.monthly.ext)}</th></tr></thead><tbody>${mon.map((s) => `<tr><th scope="row"><a href="${solutionUrl(s, lang)}">${esc(V.L(s.title))}</a></th><td>${esc(V.wk(s.mvp.weeks))}</td>${cell(s.mvp.usd)}${cell(s.full.usd)}</tr>`).join('')}</tbody></table></section>` : '';
  // the integrations, alphabetical, with what each does, its add and how many solutions use it
  const used = new Map();
  for (const s of V.sols) for (const k of s.integrations) used.set(k, (used.get(k) || 0) + 1);
  const ints = Object.entries(model.integrations).filter(([k]) => used.get(k)).sort((a, b) => (a[1].names?.[lang] || a[1].name).localeCompare(b[1].names?.[lang] || b[1].name, 'en'));
  const intList = `<ul class="ints">${ints.map(([k, i]) => `<li><a class="nm u" href="${catalogueUrl(lang)}?q=${encodeURIComponent(i.name)}">${esc(i.names?.[lang] || i.name)}</a><span class="wh">${esc(V.L(i.what))}</span><span class="ad mono">${nw(`+${V.ja ? fUsd(i.add_usd, lang) : fUzs(V.uzsR(i.add_usd), lang)}`)}, ${nw(`+${V.wk(i.add_weeks)}`)} · ${nw(fill(T.intsUsed, { n: used.get(k) }))}</span></li>`).join('')}</ul>`;
  const mods = Object.entries(model.modifiers).map(([k, m]) => {
    const parts = [];
    if (m.mult && m.mult > 1) parts.push(T.mult(Math.round((m.mult - 1) * 100)));
    if (m.weeks_mult && m.weeks_mult > 1) parts.push(T.multW(Math.round((m.weeks_mult - 1) * 100)));
    if (m.add_usd) parts.push(`+${V.ja ? fUsd(m.add_usd, lang) : fUzs(V.uzsR(m.add_usd), lang)}`);
    if (m.add_weeks) parts.push(`+${V.wk(m.add_weeks)}`);
    return `<div><dt>${esc(V.L(m.label))}</dt><dd class="mono">${parts.map(nw).join(', ')}</dd></div>`;
  }).join('');
  const project = V.sols.filter((s) => !V.monthly(s));
  const main = `
  <header class="pg-head sol-head">
    <h1>${esc(T.pH1)}</h1>
    <p class="lede">${esc(fill(T.pLede, { n: project.length }))}</p>
    <p class="meta mono">${esc(fill(T.pUpdated, { date: dateNum(V.ctx.updated, lang) }))} · ${esc(rateLine(V.rate, lang))}</p>
  </header>
  <div class="prices">${tables.join('\n')}${monTable}</div>
  <section class="row" aria-labelledby="in-h"><h2 id="in-h">${esc(T.intsH)}</h2><div class="row-body"><p>${esc(T.intsLede)}</p>${intList}</div></section>
  <section class="row" aria-labelledby="md-h"><h2 id="md-h">${esc(T.modsH)}</h2><div class="row-body"><p>${esc(T.modsLede)}</p><dl class="sheet raise">${mods}</dl></div></section>
  <p class="honest">${esc(T.honest.replace(/SamurAI[^.。]*[.。]$/, ''))}<a class="u" href="${pathOf(lang, 'samurai')}">${esc(T.honest.match(/SamurAI[^.。]*[.。]$/)?.[0] || 'SamurAI')}</a></p>`;
  const url = abs(PRICES[lang]);
  const offers = { '@type': 'OfferCatalog', '@id': `${url}#prices`, name: T.pH1, numberOfItems: project.length, itemListElement: project.map((s) => ({ '@type': 'Offer', url: abs(solutionUrl(s, lang)), priceSpecification: { '@type': 'PriceSpecification', minPrice: s.mvp.usd[0], priceCurrency: 'USD' } })) };
  return { main, ldExtra: [offers], mainEntity: `${url}#prices` };
}

// ---- titles and descriptions -----------------------------------------------------------------------------------
// Japanese: the first candidate whose width is in range (titles 28–32, descriptions 80–100 full-width characters)
function fitJa(cands, lo, hi, what) {
  for (const c of cands) { const w = fwWidth(c); if (w >= lo && w <= hi) return c; }
  throw new Error(`solutions: no Japanese ${what} fits ${lo}–${hi}: ${cands[0]} (${fwWidth(cands[0])})`);
}
const JA_TAIL = ['の開発費用と期間｜Qilich', 'の開発費用と期間の目安｜Qilich', 'の費用と期間｜Qilich', 'の開発費用と開発期間の目安｜Qilich', 'の費用目安｜Qilich', 'の開発費用と開発期間の目安・相場｜Qilich', '｜Qilich', '：開発費用と期間の目安｜オフショア開発のQilich', '：開発費用と期間の目安｜ウズベキスタンのオフショア開発Qilich'];
const JA_TAIL_MON = ['の月額費用と開始時期｜Qilich', 'の月額費用と開始までの期間｜Qilich', 'の月額費用の目安｜Qilich', 'の月額費用と開始時期の目安｜Qilich', 'の月額費用｜Qilich', 'の月額費用と開始までの期間の目安｜Qilich', 'の月額費用と開始時期｜オフショア開発のQilich', '：月額費用と開始時期の目安｜オフショア開発のQilich', '｜Qilich'];
function jaDesc(heads, tails) {
  const out = [];
  for (const h of heads) {
    out.push(h);
    for (let i = 0; i < tails.length; i++) { out.push(h + tails[i]); for (let j = i + 1; j < tails.length; j++) out.push(h + tails[i] + tails[j]); }
  }
  return out;
}
export function metaSolution(s, V) {
  const { T, lang } = V;
  const t = V.L(s.title);
  if (lang !== 'ja') {
    if (V.monthly(s)) return { title: fill(t.includes(':') ? T.title_mon.replace(/^\{t\}:/, '{t},') : T.title_mon, { t }), description: fill(T.monDesc, { t, price: V.prim(s.mvp.usd), fprice: V.prim(s.full.usd), weeks: V.wk(s.mvp.weeks) }) };
    return { title: fill(t.includes(':') ? T.title_sol.replace(/^\{t\}:/, '{t},') : T.title_sol, { t }), description: fill(T.desc_sol, { t, weeks: V.wk(s.mvp.weeks), price: V.from(s.mvp.usd), fweeks: V.wk(s.full.weeks) }) };
  }
  if (V.monthly(s)) {
    // a monthly service: the monthly fee of each plan and how soon it starts, not a development cost and period
    const mt = fitJa(JA_TAIL_MON.map((x) => t + x), 28, 32, `title for ${s.id}`);
    const nums = `基本プランは月額${fUsd(s.mvp.usd, 'ja')}、拡張プランは月額${fUsd(s.full.usd, 'ja')}が目安で、ご依頼から${V.wk(s.mvp.weeks)}以内に開始できます。`;
    const mh = [`${t}の月額費用。${nums}`, `${t}。${nums}`, `${t}の月額費用と開始時期。${nums}`];
    const mtails = ['作業範囲も掲載しています。', 'タシケントの開発チームが担当します。', 'よくあるご質問もあわせてご覧ください。', 'Qilichが担当します。'];
    return { title: mt, description: fitJa(jaDesc(mh, mtails), 80, 100, `description for ${s.id}`) };
  }
  const title = fitJa(JA_TAIL.map((x) => t + x), 28, 32, `title for ${s.id}`);
  const nums = `MVP（最小構成）は${fUsd(s.mvp.usd, 'ja')}・${V.wk(s.mvp.weeks)}、完成版は${fUsd(s.full.usd, 'ja')}・${V.wk(s.full.weeks)}が目安です。`;
  const heads = [`${t}の開発費用と期間。${nums}`, `${t}。${nums}`, `${t}の費用：${nums.replace('（最小構成）', '')}`];
  const tails = ['開発範囲と運用費も掲載しています。', 'タシケントの開発チームが担当します。', 'よくあるご質問もあわせてご覧ください。', 'Qilichが開発します。'];
  return { title, description: fitJa(jaDesc(heads, tails), 80, 100, `description for ${s.id}`) };
}
export function metaGroup(gid, V, f) {
  const { T, lang } = V;
  const t = GROUP_SEO[gid][lang];
  const n = V.byGroup[gid].length;
  if (lang !== 'ja') return { title: fill(T.title_group, { t }), description: fill(T.desc_group, { t, n, weeks: V.wk(f.mvpW), price: V.from(f.mvpUsd) }) };
  const title = fitJa(['の費用相場と開発期間｜オフショア開発のQilich', 'の費用相場と開発期間｜Qilich', 'の費用相場と開発期間の目安｜Qilich', 'の費用と期間｜オフショア開発のQilich', '｜費用相場と開発期間の目安｜Qilich', '｜費用相場・開発期間・開発範囲の目安｜Qilich'].map((x) => t + x), 28, 32, `title for ${gid}`);
  const heads = [`${t}のソリューション${n}件の費用と開発期間。MVPは${V.wk(f.mvpW)}、${fUsd([f.mvpUsd[0], f.mvpUsd[0]], 'ja')}からが目安です。`];
  const tails = ['開発範囲と費用が上がる要因も掲載しています。', 'ウズベキスタン・タシケントの開発チームが担当します。', 'よくあるご質問もあわせてご覧ください。', 'Qilichが開発します。'];
  return { title, description: fitJa(jaDesc(heads, tails), 80, 100, `description for ${gid}`) };
}
export function metaCatalogue(V) {
  const { T, lang, sols } = V;
  if (lang !== 'ja') return { title: T.title, description: fill(T.desc, { n: sols.length }) };
  return { title: fitJa([T.title], 28, 32, 'catalogue title'), description: fitJa([fill(T.desc, { n: sols.length })], 80, 100, 'catalogue description') };
}
export function metaPrices(V) {
  const { T, lang } = V;
  const n = V.sols.filter((s) => !V.monthly(s)).length;
  if (lang !== 'ja') return { title: T.pTitle, description: fill(T.pDesc, { n }) };
  return {
    title: fitJa(['ウズベキスタンのシステム開発・アプリ開発費用相場2026｜Qilich'], 28, 32, 'prices title'),
    description: fitJa([`Qilichが開発する${n}件のソリューションの費用相場です。MVP（最小構成）と完成版の費用と開発期間、月額の運用費、外部連携の追加費用を、米ドルとスムで掲載しています。`, `Qilichが開発する${n}件のソリューションの費用相場です。MVPと完成版の費用・開発期間、月額の運用費、外部連携の追加費用を掲載しています。`], 80, 100, 'prices description'),
  };
}
export { NB };
