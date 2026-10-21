// The blog (SOLUTIONS-SPEC §5 with Addendum A), called by scripts/build-pages.mjs:
//   /blog/ /ru/blog/ /en/blog/ /ja/blog/                the index, a printed ledger ("daftar"), per language
//   /blog/<slug>/ …                                      a post, per language that has it
//   /blog/rss.xml …                                      RSS 2.0 per language
// Sources: content/blog/<id>/{uz,ru,en}.md (one article and its translations: twins, hreflang between them only) and
// content/blog-ja/<id>/ja.md (the Japanese set: its own articles, no twins, so no hreflang to anything that does not
// exist). Markdown through scripts/pages/blog-md.mjs (strict subset; raw HTML fails the build).
// Every figure a post shows comes from the catalogue at build: the "Shu mavzuda" rows under each post (its front-matter
// `related` ids: catalogue groups or solutions) and the shortcodes inside it ({{solution:id}}, {{prices:group=id}},
// {{prices:monthly}}, {{integration:id}}, {{modifiers}}, {{samurai:industry=id}}). The build fails on an unknown id,
// on a post that links no solution, on a broken link to another post and on raw HTML.
// JSON-LD: the shared Organization and WebSite, the WebPage, a BreadcrumbList, and a BlogPosting (author: the Qilich
// team as the Organization, until the owner names a person in content/site.json `blogAuthor`) or a Blog on the index.
// Returns the page entries ({ lang, path, file, slug, lastmod }) for the fonts, preloads and sitemaps.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from 'node:fs';
import { dirname } from 'node:path';
import { LANGS, HOME, SITE, pathOf, abs, esc, fwWidth, site, has } from '../site.mjs';
import { ORG_ID } from './ld.mjs';
import { normalise, CATALOGUE_BASE } from '../../src/shared/catalogue.js';
import { uzsRange } from '../../src/shared/price.js';
import { usd, uzs, weeks, dateNum, NB } from '../../src/shared/format.js';
import { convert, frontMatter, MdError } from './blog-md.mjs';
import { B } from './blog-i18n.mjs';
import { BLOG_SRC, blogIndex, feedPath } from './blog-feed.mjs';

const J = (p) => JSON.parse(readFileSync(p, 'utf8'));
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const fill = (s, o) => String(s).replace(/\{(\w+)\}/g, (m, k) => (k in o ? o[k] : m));

export function b(lang, key) {
  const v = B[lang]?.[key];
  if (v == null) throw new Error(`blog-i18n: B.${lang}.${key} is missing`);
  return v;
}

// ---- the catalogue, the rate --------------------------------------------------------------------------------------
function catalogue() {
  const ja = existsSync('content/solutions-ja.json') ? J('content/solutions-ja.json').solutions : {};
  const extra = J('content/solutions-extra.json');
  const model = normalise(J('content/solutions.json'), { ...extra, ja_solutions: ja }, J('content/pricing.json'));
  const rate = existsSync('content/rate.json') ? J('content/rate.json') : { uzs_per_usd: 12012.3, date: '2026-10-21' };
  return { model, extra, rate };
}

// the page a related id opens: the solution or group page once the catalogue gate has built it (same URL scheme as
// src/shared/catalogue.js solutionUrl), otherwise the catalogue, otherwise SamurAI with that solution preselected
function target(C, id, lang) {
  const slugOf = (o) => o?.slug?.[lang === 'ja' ? 'en' : lang] || o?.slug?.en || id;
  const isGroup = Boolean(C.model.groups[id]);
  const own = `${CATALOGUE_BASE[lang]}${slugOf(isGroup ? C.extra.groups?.[id] : C.extra.solutions?.[id])}/`;
  if (existsSync(`public${own}index.html`)) return { href: own, page: true };
  if (existsSync(`public${CATALOGUE_BASE[lang]}index.html`)) return { href: CATALOGUE_BASE[lang], page: false };
  return { href: isGroup ? pathOf(lang, 'samurai') : `${pathOf(lang, 'samurai')}?solutions=${id}`, page: false };
}

// ---- figures, as the catalogue prints them --------------------------------------------------------------------------
function money(C, r, lang) {
  if (lang === 'ja') return usd(r, lang);
  const s = uzs(uzsRange(r, C.rate.uzs_per_usd), lang), d = usd(r, lang);
  return lang === 'en' ? `${d} · ${s}` : `${s} · ${d}`;
}
const pick = (o, lang) => (o ? o[lang] ?? o.en ?? o.uz ?? '' : '');

// the micro blade: one scale for every glyph in the blog (length = the full version's top weeks), a tick at the
// MVP's top weeks; outline only, about 300 bytes
let SCALE = 52;
function blade(s) {
  const W = 132, L = Math.max(18, Math.min(W - 4, (s.full.weeks[1] / SCALE) * (W - 4)));
  const t = Math.max(6, Math.min(L - 3, (s.mvp.weeks[1] / SCALE) * (W - 4)));
  const x = (v) => (2 + v).toFixed(1);
  return `<svg class="mb" viewBox="0 0 ${W} 12" width="${W}" height="12" aria-hidden="true" focusable="false"><path d="M2 7.6H6.5M6.5 6.2V9M6.5 7.2C${x(L * .45)} 7.4 ${x(L * .8)} 6.6 ${x(L)} 4.1C${x(L * .78)} 8.4 ${x(L * .4)} 9 6.5 8.8"/><path class="mv" d="M${x(t)} 3V11"/></svg>`;
}

function solutionRow(C, s, lang, tag = 'h3') {
  const L = (k) => b(lang, k);
  const tg = target(C, s.id, lang);
  return `<li class="rel-row">
  <${tag} class="rel-t"><a class="u" href="${tg.href}">${esc(pick(s.title, lang))}</a></${tag}>
  <p class="rel-v">${esc(pick(s.oneliner, lang))}</p>
  <dl class="rel-f mono"><div><dt>${L('mvp')}</dt><dd>${weeks(s.mvp.weeks, lang)} · ${money(C, s.mvp.usd, lang)}</dd></div><div><dt>${L('full')}</dt><dd>${weeks(s.full.weeks, lang)} · ${money(C, s.full.usd, lang)}</dd></div></dl>
  ${blade(s)}
</li>`;
}

function groupRow(C, gid, lang) {
  const L = (k) => b(lang, k);
  const g = C.model.groups[gid];
  const mine = C.model.solutions.filter((s) => s.group === gid && s.billing !== 'monthly');
  const all = C.model.solutions.filter((s) => s.group === gid);
  const minW = Math.min(...mine.map((s) => s.mvp.weeks[0])), minU = Math.min(...mine.map((s) => s.mvp.usd[0]));
  // the group's one sentence: the catalogue's, or for Japanese the blog's own (the catalogue has none yet)
  const line = lang === 'ja' ? (B.ja.groupLines[gid] || '') : pick(g.line, lang);
  const tg = target(C, gid, lang);
  const fromW = fill(L('from'), { v: weeks([minW, minW], lang) });
  const fromU = fill(L('from'), { v: lang === 'ja' ? usd([minU, minU], lang) : uzs(uzsRange([minU, minU], C.rate.uzs_per_usd), lang) });
  return `<li class="rel-row rel-g">
  <h3 class="rel-t"><a class="u" href="${tg.href}">${esc(pick(g.title, lang))}</a></h3>
  <p class="rel-v">${esc(line)}</p>
  <dl class="rel-f mono"><div><dt>${L('mvp')}</dt><dd>${fromW} · ${fromU}</dd></div><div><dt>${fill(L('solutions'), { n: all.length })}</dt><dd></dd></div></dl>
</li>`;
}

// ---- shortcodes (§5.3) -------------------------------------------------------------------------------------------
function shortcodes(C, lang, post) {
  const L = (k) => b(lang, k);
  const sol = (id, where) => { const s = C.model.byId.get(id); if (!s) throw new MdError(`${where}: unknown solution id «${id}»`); return s; };
  const kv = (args) => Object.fromEntries(args.split(/[\s,]+/).filter(Boolean).map((p) => p.split('=')));
  const table = (head, rows) => `<div class="tbl" role="region" tabindex="0" aria-label="${esc(head.join(' · '))}"><table><thead><tr>${head.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr><th scope="row">${r[0]}</th>${r.slice(1).map((c) => `<td class="mono">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  return (name, args, { where, inline }) => {
    if (name === 'solution') {
      const s = sol(args, where);
      post.links.add(s.id);
      if (inline) return `<a class="u" href="${target(C, s.id, lang).href}">${esc(pick(s.title, lang))}</a>`;
      return `<ul class="rel sc">${solutionRow(C, s, lang, 'p')}</ul>`;
    }
    if (name === 'prices') {
      const o = kv(args);
      if (o.group) {
        if (!C.model.groups[o.group]) throw new MdError(`${where}: unknown group id «${o.group}»`);
        post.links.add(o.group);
        const rows = C.model.solutions.filter((s) => s.group === o.group && s.billing !== 'monthly')
          .map((s) => [`<a class="u" href="${target(C, s.id, lang).href}">${esc(pick(s.title, lang))}</a>`, weeks(s.mvp.weeks, lang), money(C, s.mvp.usd, lang), weeks(s.full.weeks, lang), money(C, s.full.usd, lang)]);
        return table(['', `${L('mvp')}`, '', L('full'), ''], rows);
      }
      if (args === 'monthly') {
        const rows = Object.entries(C.model.pricing.monthly_default).filter(([g]) => C.model.groups[g])
          .map(([g, r]) => [esc(pick(C.model.groups[g].title, lang)), money(C, r, lang)]);
        return table(['', lang === 'uz' ? 'Oyiga' : lang === 'ru' ? 'В месяц' : lang === 'ja' ? '月額' : 'Per month'], rows);
      }
      throw new MdError(`${where}: unknown prices shortcode «${args}»`);
    }
    if (name === 'integration') {
      const it = C.model.integrations[args];
      if (!it) throw new MdError(`${where}: unknown integration id «${args}»`);
      const add = `+${weeks(it.add_weeks, lang)} · +${money(C, it.add_usd, lang)}`;
      return inline ? `${esc(it.name)} (${add})` : `<p class="sc-int"><b>${esc(it.name)}</b> ${esc(pick(it.what, lang))} <span class="mono">${add}</span></p>`;
    }
    if (name === 'modifiers') {
      const rows = Object.values(C.model.modifiers).map((m) => {
        const fx = [m.mult ? `×${String(m.mult).replace('.', lang === 'uz' || lang === 'ru' ? ',' : '.')}` : '', m.add_usd ? `+${money(C, m.add_usd, lang)}` : '', m.add_weeks ? `+${weeks(m.add_weeks, lang)}` : ''].filter(Boolean).join(' · ');
        return `<li>${esc(pick(m.label, lang))} <span class="mono">${fx}</span></li>`;
      });
      return `<ul class="sc-mods">${rows.join('')}</ul>`;
    }
    if (name === 'samurai') {
      const o = kv(args);
      if (o.industry && !C.model.industries[o.industry]) throw new MdError(`${where}: unknown industry id «${o.industry}»`);
      post.industry = o.industry || post.industry;
      post.inlineBox = true;
      return aiBox(C, lang, post);
    }
    throw new MdError(`${where}: unknown shortcode «${name}»`);
  };
}

// the SamurAI box: the visitor's next step, with this post's solutions preselected (§5.3; every post ends with it)
function aiBox(C, lang, post) {
  const L = (k) => b(lang, k);
  const sols = [...(post.related || [])].filter((id) => C.model.byId.has(id) && C.model.byId.get(id).billing !== 'monthly').slice(0, 6);
  const q = new URLSearchParams();
  if (post.industry) q.set('industry', post.industry);
  if (sols.length) q.set('solutions', sols.join(','));
  const href = `${pathOf(lang, 'samurai')}${q.toString() ? `?${q.toString().replace(/%2C/g, ',')}` : ''}`;
  const pre = sols.length ? `<p class="ai-pre mono">${L('aiPre')} ${sols.map((id) => esc(pick(C.model.byId.get(id).title, lang))).join(lang === 'ja' ? '、' : ' · ')}</p>` : '';
  return `<section class="ai-box" aria-labelledby="ai-h">
  <h2 id="ai-h">${L('aiH')}</h2>
  <p class="ai-line">${L('aiLine')}</p>
  ${pre}
  <a class="btn" href="${href}" data-cta="blog"><span>${L('aiBtn')}</span><svg aria-hidden="true"><use href="#kissaki"/></svg></a>
</section>`;
}

// ---- loading -------------------------------------------------------------------------------------------------------
function load(C) {
  const posts = [], errors = [];
  const order = {};
  for (const dir of new Set(Object.values(BLOG_SRC))) {
    if (!existsSync(dir)) continue;
    const plan = existsSync(`${dir}/PLAN.json`) ? J(`${dir}/PLAN.json`) : [];
    for (const p of plan) order[`${dir}/${p.slug}`] = { n: p.order, cluster: p.cluster };
  }
  for (const lang of LANGS) {
    const dir = BLOG_SRC[lang];
    if (!dir || !existsSync(dir)) continue;
    for (const id of readdirSync(dir).sort()) {
      const file = `${dir}/${id}/${lang}.md`;
      if (!existsSync(file)) continue;
      try {
        const { data, body, bodyLine } = frontMatter(readFileSync(file, 'utf8'), file);
        if (data.draft === true) continue;
        const bad = (w) => errors.push(`${file}: ${w}`);
        if (!SLUG_RE.test(String(data.slug || ''))) bad(`slug «${data.slug}» is not lowercase ASCII with hyphens`);
        if (data.lang && data.lang !== lang) bad(`lang «${data.lang}» in a ${lang}.md file`);
        if (!has(data.title)) bad('no title');
        if (!has(data.description)) bad('no description');
        if (!DATE_RE.test(String(data.date || ''))) bad(`date «${data.date}» is not YYYY-MM-DD`);
        if (data.updated && !DATE_RE.test(String(data.updated))) bad(`updated «${data.updated}» is not YYYY-MM-DD`);
        const related = [].concat(data.related || data.solutions || []).map(String);
        if (!related.length) bad('no related solutions (at least one catalogue group or solution id)');
        for (const r of related) if (!C.model.groups[r] && !C.model.byId.has(r)) bad(`related id «${r}» is in neither the catalogue groups nor its solutions`);
        if (data.industry && !C.model.industries[data.industry]) bad(`industry «${data.industry}» is not in the catalogue`);
        const meta = order[`${dir}/${id}`] || { n: 999, cluster: data.cluster };
        posts.push({
          key: `${dir}/${id}`, lang, file, slug: data.slug, title: data.title, description: data.description,
          date: data.date, updated: data.updated && data.updated !== data.date ? data.updated : null, related,
          industry: data.industry || null, tags: data.tags || [], minutes: Number(data.reading_minutes) || 0,
          cluster: data.cluster || meta.cluster || null, n: meta.n, body, bodyLine, path: `${blogIndex(lang)}${data.slug}/`, links: new Set(),
        });
      } catch (e) { errors.push(e.message); }
    }
  }
  const seen = new Map();
  for (const p of posts) { if (seen.has(p.path)) errors.push(`${p.file}: the URL ${p.path} is also ${seen.get(p.path)}`); seen.set(p.path, p.file); }
  if (errors.length) throw new Error(`blog: ${errors.length} problem(s)\n  ${errors.join('\n  ')}`);
  // newest first; on the same day, the editorial order of PLAN.json
  const cmp = (a, b2) => (b2.date.localeCompare(a.date) || a.n - b2.n || a.slug.localeCompare(b2.slug));
  return posts.sort(cmp);
}

// ---- rendering -----------------------------------------------------------------------------------------------------
function minutesOf(p, conv) {
  if (p.minutes) return p.minutes;
  return Math.max(1, Math.round(p.lang === 'ja' ? conv.cjk / 500 : conv.words / 200));
}
const time = (d, lang) => `<time datetime="${d}">${dateNum(d, lang)}</time>`;

function titleTag(p) {
  if (p.lang !== 'ja') return `${p.title} · Qilich`;
  const branded = `${p.title}｜Qilich`;
  return fwWidth(branded) <= 32 ? branded : p.title;
}

function renderPost(C, p, ctx) {
  const lang = p.lang, L = (k) => b(lang, k);
  const known = ctx.paths;
  const link = (href, where) => {
    if (/^(https?:|mailto:|tel:)/.test(href)) return href;
    if (!href.startsWith('/')) throw new MdError(`${where}: a relative link «${href}» (use a path from the root)`);
    const [path] = href.split('#');
    if (/\/blog\//.test(path) && !known.has(path)) throw new MdError(`${where}: the link ${href} goes to no post`);
    return href;
  };
  const conv = convert(p.body, { file: p.file, line: p.bodyLine, link, shortcode: shortcodes(C, lang, p) });
  const mins = minutesOf(p, conv);
  const meta = [
    `<span>${L('published')} ${time(p.date, lang)}</span>`,
    p.updated ? `<span>${L('updated')} ${time(p.updated, lang)}</span>` : '',
    `<span>${fill(L('read'), { n: mins })}</span>`,
    `<span>${ctx.author.name[lang] || L('by')}</span>`,
  ].filter(Boolean).join('<i aria-hidden="true">·</i>');
  const rel = p.related.map((id) => (C.model.groups[id] ? groupRow(C, id, lang) : solutionRow(C, C.model.byId.get(id), lang))).join('\n');
  for (const id of p.related) p.links.add(id);
  // the index's order, top to bottom: the entry above is the previous article, the one below the next
  const i = ctx.list.indexOf(p), prev = ctx.list[i - 1], next = ctx.list[i + 1];
  const pn = (q, k, rel2) => (q ? `<a class="pn-${k}" href="${q.path}" rel="${rel2}"><span class="mono">${L(k)}</span><b>${esc(q.title)}</b></a>` : '<span></span>');
  const main = `<article class="post" aria-labelledby="post-h">
  <header class="post-head">
    <h1 id="post-h">${esc(p.title)}</h1>
    <p class="lede">${esc(p.description)}</p>
    <p class="post-meta mono">${meta}</p>
  </header>
  <div class="prose">
${conv.html}
  </div>
  <aside class="related" aria-labelledby="rel-h">
    <h2 id="rel-h">${L('related')}</h2>
    <p class="rel-lead">${L('relatedLead')}</p>
    <ul class="rel">${rel}</ul>
  </aside>
  ${p.inlineBox ? '' : aiBox(C, lang, p)}
  <nav class="pn" aria-label="${esc(L('pn'))}">${pn(prev, 'prev', 'prev')}${pn(next, 'next', 'next')}</nav>
  <p class="all mono"><a class="u" href="${blogIndex(lang)}">${L('all')}</a></p>
</article>`;
  const url = abs(p.path);
  const article = {
    '@type': 'BlogPosting', '@id': `${url}#article`, headline: p.title, description: p.description,
    datePublished: p.date, dateModified: p.updated || p.date, inLanguage: lang,
    mainEntityOfPage: { '@id': `${url}#webpage` }, author: ctx.author.ld, publisher: { '@id': ORG_ID },
    image: `${SITE}/assets/img/og-${lang}.png`, wordCount: lang === 'ja' ? undefined : conv.words,
    keywords: undefined,
    about: p.related.map((id) => {
      const g = C.model.groups[id], s = C.model.byId.get(id), tg = target(C, id, lang);
      const name = pick(g ? g.title : s.title, lang);
      return tg.page ? { '@type': 'Service', name, url: abs(tg.href), provider: { '@id': ORG_ID } } : { '@type': 'Thing', name };
    }),
    isPartOf: { '@id': `${abs(blogIndex(lang))}#blog` },
  };
  const blogNode = { '@type': 'Blog', '@id': `${abs(blogIndex(lang))}#blog`, name: L('feedTitle'), url: abs(blogIndex(lang)), inLanguage: lang, publisher: { '@id': ORG_ID } };
  if (!p.links.size) throw new Error(`blog: ${p.file} links no solution page`);
  return { main, mins, ld: [JSON.parse(JSON.stringify(article)), blogNode], conv };
}

function renderIndex(C, lang, list, mins) {
  const L = (k) => b(lang, k);
  const clusters = B[lang].clusters || {};
  let last = null;
  const rows = list.map((p) => {
    const c = p.cluster && clusters[p.cluster] ? p.cluster : null;
    const mark = c && c !== last ? `<span class="cl">${clusters[c]}</span>` : '';
    last = c;
    return `<li class="entry${mark ? ' first' : ''}">
  <p class="e-side mono">${mark}</p>
  <h2 class="e-t"><a href="${p.path}">${esc(p.title)}</a></h2>
  <p class="e-d">${esc(p.description)}</p>
  <p class="e-m mono">${time(p.date, lang)}<i aria-hidden="true">·</i><span>${fill(L('read'), { n: mins.get(p) })}</span><span class="rule" style="--n:${mins.get(p)}" aria-hidden="true"></span></p>
</li>`;
  }).join('\n');
  return `<header class="pg-head blog-head">
    <h1>${L('h1')}</h1>
    <p class="lede">${L('lede')}</p>
    <p class="meta mono">${fill(L('count'), { n: list.length })}</p>
  </header>
  <ol class="daftar">
${rows}
  </ol>
  <p class="feed mono"><a class="u" href="${feedPath(lang)}" type="application/rss+xml">${L('rss')}</a> <span>${L('rssLabel')}</span></p>`;
}

// RFC 822 dates for RSS, at noon Tashkent time so the day never shifts
const rfc822 = (d) => new Date(`${d}T12:00:00+05:00`).toUTCString().replace('GMT', '+0000');
const x = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function rss(lang, list) {
  const L = (k) => b(lang, k);
  const self = abs(feedPath(lang));
  const latest = list.map((p) => p.updated || p.date).sort().pop();
  const items = list.map((p) => `    <item>
      <title>${x(p.title)}</title>
      <link>${abs(p.path)}</link>
      <guid isPermaLink="true">${abs(p.path)}</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
      <description>${x(p.description)}</description>
    </item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${x(L('feedTitle'))}</title>
    <link>${abs(blogIndex(lang))}</link>
    <description>${x(L('feedDesc'))}</description>
    <language>${lang}</language>
    <lastBuildDate>${rfc822(latest)}</lastBuildDate>
    <atom:link href="${self}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}

export function buildBlog({ assets, page, t, plates, jaPhrases }) {
  const C = catalogue();
  SCALE = Math.max(...C.model.solutions.filter((s) => s.billing !== 'monthly').map((s) => s.full.weeks[1]), 1);
  const posts = load(C);
  const paths = new Set(posts.map((p) => p.path));
  // the author: the Qilich team (the Organization) until content/site.json names a person in `blogAuthor`
  const named = site.blogAuthor && has(site.blogAuthor.name);
  const author = {
    name: named ? Object.fromEntries(LANGS.map((l) => [l, site.blogAuthor.name])) : {},
    ld: named ? { '@type': 'Person', name: site.blogAuthor.name, worksFor: { '@id': ORG_ID }, ...(has(site.blogAuthor.url) ? { url: site.blogAuthor.url } : {}) } : { '@id': ORG_ID },
  };
  const entries = [];
  const write = (path, html, lang) => {
    const out = lang === 'ja' ? jaPhrases(html) : html;
    const file = `public${path}index.html`;
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, out);
    return file;
  };
  const errors = [];
  for (const lang of LANGS) {
    const list = posts.filter((p) => p.lang === lang);
    if (!list.length) continue;
    const L = (k) => b(lang, k);
    const mins = new Map();
    const crumbsBase = [{ name: t(lang, 'home'), path: HOME[lang] }, { name: L('crumb'), path: blogIndex(lang) }];
    for (const p of list) {
      try {
        // the twins: the same article in the other languages of its folder (never across folders)
        const twins = Object.fromEntries(posts.filter((q) => q.key === p.key).map((q) => [q.lang, q.path]));
        const r = renderPost(C, p, { list, paths, author });
        mins.set(p, r.mins);
        const html = plates(page({
          lang, slug: 'blog-post', path: p.path, twins, title: titleTag(p), description: p.description, type: 'WebPage',
          crumbs: [...crumbsBase, { name: p.title, path: p.path }], main: r.main, kanji: '記', gloss: L('gloss'),
          assets, ldExtra: r.ld, ogType: 'article',
        }));
        entries.push({ lang, path: p.path, file: write(p.path, html, lang), slug: 'blog-post', lastmod: p.updated || p.date });
      } catch (e) { errors.push(e.message); }
    }
    // the index
    const path = blogIndex(lang);
    const twins = Object.fromEntries(LANGS.filter((l) => posts.some((q) => q.lang === l)).map((l) => [l, blogIndex(l)]));
    const url = abs(path);
    const blogNode = {
      '@type': 'Blog', '@id': `${url}#blog`, name: L('feedTitle'), description: L('feedDesc'), url, inLanguage: lang, publisher: { '@id': ORG_ID },
      blogPost: list.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: abs(p.path), datePublished: p.date, dateModified: p.updated || p.date })),
    };
    const html = plates(page({
      lang, slug: 'blog', path, twins, title: L('title'), description: L('description'), type: 'WebPage',
      crumbs: crumbsBase, main: renderIndex(C, lang, list, mins), kanji: '記', gloss: L('gloss'), assets, ldExtra: [blogNode],
    }));
    entries.push({ lang, path, file: write(path, html, lang), slug: 'blog', lastmod: list.map((p) => p.updated || p.date).sort().pop() });
    writeFileSync(`public${feedPath(lang)}`, rss(lang, list));
  }
  if (errors.length) throw new Error(`blog: ${errors.length} problem(s)\n  ${errors.join('\n  ')}`);
  // a feed for a language that no longer has posts is removed
  for (const lang of LANGS) if (!posts.some((p) => p.lang === lang) && existsSync(`public${feedPath(lang)}`)) unlinkSync(`public${feedPath(lang)}`);
  console.log(`blog: ${posts.length} posts (${LANGS.map((l) => `${l} ${posts.filter((p) => p.lang === l).length}`).join(', ')}), ${entries.length} pages, RSS × ${new Set(posts.map((p) => p.lang)).size}`);
  return entries;
}

// for scripts/qa/blog-check.mjs: the same catalogue, posts and figure functions the pages were built with
export const _qa = { catalogue, load, money, target, b };
