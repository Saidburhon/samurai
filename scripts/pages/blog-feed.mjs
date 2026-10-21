// Where the blog lives, per language, without loading it: the page chrome asks this for the head's RSS link and the
// nav's Blog link (SOLUTIONS-SPEC §5.1: the Blog link and the feed appear only where that language has a post).
//   uz, ru, en   content/blog/<id>/{uz,ru,en}.md      one article, its translations side by side (twins)
//   ja           content/blog-ja/<id>/ja.md          the Japanese set: its own articles, no twins
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { pathOf } from '../site.mjs';
import { frontMatter } from './blog-md.mjs';
import { typeText } from './blog-type.mjs';

export const BLOG_SRC = { uz: 'content/blog', ru: 'content/blog', en: 'content/blog', ja: 'content/blog-ja' };
export const blogIndex = (lang) => pathOf(lang, 'blog');
export const feedPath = (lang) => `${blogIndex(lang)}rss.xml`;

const known = {};
// true when at least one published (not draft) post exists in that language
export function hasBlog(lang) {
  if (lang in known) return known[lang];
  const d = BLOG_SRC[lang];
  known[lang] = Boolean(d && existsSync(d) && readdirSync(d).some((n) => {
    const f = `${d}/${n}/${lang}.md`;
    return existsSync(f) && !/^draft:\s*true\s*$/m.test(readFileSync(f, 'utf8').split(/\n---\n/)[0]);
  }));
  return known[lang];
}

// The posts per language with every catalogue id each one names (front matter `related`, and the ids of its
// {{solution:id}} and {{prices:group=id}} shortcodes), for the Solutions pages' "articles" block (SOLUTIONS-SPEC
// §5.3: a solution or group page links the posts about it). Read from the sources, so the Solutions build, which runs
// before the blog's, sees every post the blog will build (the blog build fails rather than skip a post).
//   postLinks() → { uz: [{ title, url, related: [id…], named: [id…] }], ru: …, en: …, ja: … }
export function postLinks() {
  const out = { uz: [], ru: [], en: [], ja: [] };
  for (const lang of Object.keys(out)) {
    const d = BLOG_SRC[lang];
    if (!d || !existsSync(d)) continue;
    for (const n of readdirSync(d).sort()) {
      const f = `${d}/${n}/${lang}.md`;
      if (!existsSync(f)) continue;
      let fm;
      try { fm = frontMatter(readFileSync(f, 'utf8'), f); } catch { continue; }
      const { data, body } = fm;
      if (data.draft === true || !data.slug || !data.title) continue;
      const named = [...body.matchAll(/\{\{\s*(?:solution:\s*([\w-]+)|prices:\s*group=([\w-]+))/g)].map((m) => m[1] || m[2]);
      const related = [].concat(data.related || data.solutions || []).map(String);
      out[lang].push({ title: typeText(data.title, lang), url: `${blogIndex(lang)}${data.slug}/`, related: [...new Set([...related, ...named])], named: [...new Set(named)], date: data.date || '' });
    }
  }
  return out;
}
