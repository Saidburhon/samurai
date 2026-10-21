// blog-check: the blog's acceptance checks (SOLUTIONS-SPEC §8 T23/T24 with Addendum A), on the BUILT site in public/.
//   - every post in content/blog/<id>/{uz,ru,en}.md and content/blog-ja/<id>/ja.md has its page; an index per language
//   - RSS 2.0 per language: well-formed (xmllint --noout), atom:link self, one item per post with title, link, guid
//     isPermaLink, RFC 822 pubDate and description; every item's link is a built post
//   - hreflang lists only the languages the post's folder has (plus x-default), reciprocal; a Japanese post lists
//     only itself; the indexes are twins of each other; the language switch on a post without a twin goes to that
//     language's blog index
//   - one h1; the JSON-LD @graph parses, has a BlogPosting (headline, description, datePublished, dateModified,
//     inLanguage, author, publisher, mainEntityOfPage) and a BreadcrumbList Home > Blog > post; the index has a Blog
//   - every post shows ≥ 1 related solution or group row and ends with the SamurAI box; the box links /samurai/
//   - every figure in a solution row (the "Shu mavzuda" rows and the {{solution:id}} shortcodes) equals the catalogue
//     through the same engine (weeks, USD, UZS at the build's rate)
//   - every internal link in a post answers with a built file
//   - the converter refuses raw HTML, an h1/h4, an unknown shortcode and an unknown catalogue id (the build fails)
//   - no "yarat-" and no product name in any article (the copy lint's list)
// Usage: node scripts/qa/blog-check.mjs [report.json]
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname } from 'node:path';
import { LANGS, SITE, HOME } from '../site.mjs';
import { _qa } from '../pages/blog.mjs';
import { convert, MdError } from '../pages/blog-md.mjs';
import { blogIndex, feedPath } from '../pages/blog-feed.mjs';
import { BANNED } from '../../worker/copy-rules.js';

const out = process.argv[2] || '.cache/blog-check.json';
const fails = [], notes = [];
const fail = (w, m) => fails.push(`${w}: ${m}`);
const file = (href) => { const p = href.split('#')[0].split('?')[0]; return /\.\w+$/.test(p) ? `public${p}` : `public${p.endsWith('/') ? p : `${p}/`}index.html`; };
const read = (path) => (existsSync(file(path)) ? readFileSync(file(path), 'utf8') : null);
const dec = (s) => String(s).replace(/&nbsp;/g, '\u00a0').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const text = (h) => dec(h.replace(/<wbr>/g, '').replace(/<[^>]+>/g, '')).replace(/[ \t\n]+/g, ' ').trim();

const C = _qa.catalogue();
const posts = _qa.load(C);
const byLang = Object.fromEntries(LANGS.map((l) => [l, posts.filter((p) => p.lang === l)]));
let rows = 0, figures = 0;

for (const lang of LANGS) {
  const list = byLang[lang];
  if (!list.length) { notes.push(`${lang}: no posts, no index`); continue; }
  // the index
  const idx = read(blogIndex(lang));
  if (!idx) { fail(blogIndex(lang), 'no index page'); continue; }
  for (const p of list) if (!idx.includes(`href="${p.path}"`)) fail(blogIndex(lang), `does not list ${p.path}`);
  if ((idx.match(/<h1[\s>]/g) || []).length !== 1) fail(blogIndex(lang), 'not exactly one h1');
  const idxLd = JSON.parse(idx.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  if (!idxLd['@graph'].some((n) => n['@type'] === 'Blog' && n.blogPost?.length === list.length)) fail(blogIndex(lang), 'no Blog node listing every post');
  const idxAlts = [...idx.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)].map((m) => m[1]).sort().join(',');
  const wantIdx = [...LANGS.filter((l) => byLang[l].length), 'x-default'].sort().join(',');
  if (idxAlts !== wantIdx) fail(blogIndex(lang), `hreflang ${idxAlts}, expected ${wantIdx}`);
  if (!idx.includes(`type="application/rss+xml"`)) fail(blogIndex(lang), 'no RSS alternate link');
  // RSS
  const feed = `public${feedPath(lang)}`;
  try { execFileSync('xmllint', ['--noout', feed], { stdio: 'pipe' }); } catch (e) { fail(feedPath(lang), `not well-formed: ${String(e.stderr).slice(0, 200)}`); }
  const x = existsSync(feed) ? readFileSync(feed, 'utf8') : '';
  if (!x.includes(`<atom:link href="${SITE}${feedPath(lang)}" rel="self" type="application/rss+xml"/>`)) fail(feedPath(lang), 'no atom:link rel=self');
  const items = [...x.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
  if (items.length !== list.length) fail(feedPath(lang), `${items.length} items for ${list.length} posts`);
  for (const it of items) {
    const link = (it.match(/<link>([^<]+)<\/link>/) || [])[1] || '';
    for (const tag of ['title', 'description']) if (!new RegExp(`<${tag}>[^<]+</${tag}>`).test(it)) fail(feedPath(lang), `an item without ${tag}`);
    if (!new RegExp(`<guid isPermaLink="true">${link.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</guid>`).test(it)) fail(feedPath(lang), `guid of ${link}`);
    if (!/<pubDate>\w{3}, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} \+0000<\/pubDate>/.test(it)) fail(feedPath(lang), `pubDate of ${link} is not RFC 822`);
    if (!link.startsWith(SITE) || !read(link.slice(SITE.length))) fail(feedPath(lang), `item link ${link} is not a built page`);
  }
  // the posts
  for (const p of list) {
    const W = p.path, h = read(p.path);
    if (!h) { fail(W, 'not built'); continue; }
    const head = h.match(/<head>([\s\S]*?)<\/head>/)[1];
    const body = h.replace(/<head>[\s\S]*?<\/head>/, '');
    if ((body.match(/<h1[\s>]/g) || []).length !== 1) fail(W, 'not exactly one h1');
    // hreflang: only the languages of this post's folder
    const twins = posts.filter((q) => q.key === p.key);
    const alts = Object.fromEntries([...head.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)].map((m) => [m[1], m[2]]));
    const want = [...twins.map((q) => q.lang), 'x-default'].sort().join(',');
    if (Object.keys(alts).sort().join(',') !== want) fail(W, `hreflang ${Object.keys(alts).sort().join(',')}, expected ${want}`);
    for (const q of twins) if (alts[q.lang] !== SITE + q.path) fail(W, `hreflang ${q.lang} → ${alts[q.lang]}, expected ${SITE + q.path}`);
    const xd = twins.find((q) => q.lang === 'en') || p;
    if (alts['x-default'] !== SITE + xd.path) fail(W, `x-default → ${alts['x-default']}`);
    // the language switch: a missing twin goes to that language's blog index
    const sw = (h.match(/<nav class="lang"[\s\S]*?<\/nav>/) || [''])[0];
    for (const l of LANGS) {
      const tw = twins.find((q) => q.lang === l);
      const wantHref = tw ? tw.path : (byLang[l].length ? blogIndex(l) : HOME[l]);
      if (!sw.includes(`href="${wantHref}" hreflang="${l}"`)) fail(W, `language switch ${l} does not go to ${wantHref}`);
    }
    // JSON-LD
    let g;
    try { g = JSON.parse(h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]); } catch (e) { fail(W, `JSON-LD: ${e.message}`); continue; }
    const art = g['@graph'].find((n) => n['@type'] === 'BlogPosting');
    if (!art) fail(W, 'no BlogPosting');
    else {
      for (const k of ['headline', 'description', 'datePublished', 'dateModified', 'inLanguage', 'author', 'publisher', 'mainEntityOfPage']) if (!art[k]) fail(W, `BlogPosting without ${k}`);
      if (art.headline !== p.title || art.datePublished !== p.date || art.inLanguage !== lang) fail(W, 'BlogPosting headline/date/language differ from the front matter');
      const auth = art.author['@id'] ? g['@graph'].find((n) => n['@id'] === art.author['@id']) : art.author;
      if (!auth?.name) fail(W, 'the author has no name');
    }
    const bc = g['@graph'].find((n) => n['@type'] === 'BreadcrumbList');
    const names = (bc?.itemListElement || []).map((i) => i.item);
    if (names.length !== 3 || names[1] !== SITE + blogIndex(lang) || names[2] !== SITE + p.path) fail(W, `breadcrumbs ${names.join(' > ')}`);
    // related rows, the SamurAI box at the end
    const main = h.match(/<main[\s\S]*?<\/main>/)[0];
    const rel = (main.match(/<aside class="related"[\s\S]*?<\/aside>/) || [''])[0];
    const n = (rel.match(/class="rel-row/g) || []).length;
    if (n < 1) fail(W, 'no related solution');
    const prose = main.indexOf('class="prose"'), box = main.lastIndexOf('class="ai-box"');
    if (box < prose || prose < 0) fail(W, 'does not end with the SamurAI box');
    if (!/<section class="ai-box"[\s\S]*?href="\/(?:(?:ru|en|ja)\/)?samurai\/[^"]*"/.test(main)) fail(W, 'the SamurAI box does not link SamurAI');
    // figures = the catalogue, through the same engine
    for (const m of main.matchAll(/<li class="rel-row" data-id="([\w-]+)">([\s\S]*?)<\/li>/g)) {
      rows++;
      const s = C.model.byId.get(m[1]);
      if (!s) { fail(W, `row for unknown id ${m[1]}`); continue; }
      const dd = [...m[2].matchAll(/<dd>([\s\S]*?)<\/dd>/g)].map((d) => text(d[1]));
      const exp = [`${_qa.weeks(s.mvp.weeks, lang)} · ${_qa.money(C, s.mvp.usd, lang)}`, `${_qa.weeks(s.full.weeks, lang)} · ${_qa.money(C, s.full.usd, lang)}`];
      figures += 2;
      if (dd[0] !== exp[0] || dd[1] !== exp[1]) fail(W, `${m[1]} figures «${dd.join(' | ')}» ≠ catalogue «${exp.join(' | ')}»`);
    }
    // internal links answer
    for (const m of main.matchAll(/href="(\/[^"]*)"/g)) {
      const href = dec(m[1]);
      if (!existsSync(file(href))) fail(W, `link ${href} has no built page`);
    }
  }
}

// the converter refuses what the blog must not print (the build fails on these)
const refuse = (label, md, opt = {}) => { try { convert(md, { file: 'fixture', ...opt }); fail('converter', `accepted ${label}`); } catch (e) { if (!(e instanceof MdError)) fail('converter', `${label}: ${e.message}`); } };
refuse('raw HTML', 'Text with <b>bold</b> HTML.');
refuse('a raw HTML block', '<div class="x">block</div>');
refuse('an h1', '# Title');
refuse('an h4', '#### Small');
const sc = (p) => _qa.shortcodes(C, 'uz', { related: [], links: new Set(), ...p });
refuse('an unknown solution id', '{{solution:no-such-solution}}', { shortcode: sc({}) });
refuse('an unknown group id', '{{prices:group=no-such-group}}', { shortcode: sc({}) });
refuse('an unknown integration id', '{{integration:no-such}}', { shortcode: sc({}) });
refuse('an unknown shortcode', '{{nonsense:1}}', { shortcode: sc({}) });
// and renders a known one with the catalogue's figures
{
  const s = C.model.byId.get('tg-order-bot');
  const r = convert('{{solution:tg-order-bot}}', { file: 'fixture', shortcode: sc({}) }).html;
  if (!r.includes(_qa.weeks(s.mvp.weeks, 'uz'))) fail('converter', 'the solution shortcode does not show the catalogue weeks');
}

// the copy rules over every article (the build's lint runs the same list)
for (const p of posts) {
  const src = readFileSync(p.file, 'utf8');
  for (const [re, what] of BANNED) { const m = src.match(re); if (m) fail(p.file, `${what}: «${src.slice(Math.max(0, m.index - 20), m.index + 30)}»`); }
  if (/yarat/i.test(src)) fail(p.file, 'a form of yarat-');
}

const words = posts.map((p) => ({ path: p.path, words: convert(p.body, { file: p.file, shortcode: () => '' }).words }));
const report = { posts: posts.length, byLang: Object.fromEntries(LANGS.map((l) => [l, byLang[l].length])), rows, figures, fails, notes, words };
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(report, null, 1));
console.log(`blog-check: ${posts.length} posts (${LANGS.map((l) => `${l} ${byLang[l].length}`).join(', ')}), ${rows} solution rows, ${figures} figures checked against the catalogue`);
if (fails.length) { console.error(`blog-check: ${fails.length} failure(s)\n  ${fails.slice(0, 60).join('\n  ')}`); process.exit(1); }
console.log('blog-check: ok');
