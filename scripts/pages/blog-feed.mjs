// Where the blog lives, per language, without loading it: the page chrome asks this for the head's RSS link and the
// nav's Blog link (SOLUTIONS-SPEC §5.1: the Blog link and the feed appear only where that language has a post).
//   uz, ru, en   content/blog/<id>/{uz,ru,en}.md      one article, its translations side by side (twins)
//   ja           content/blog-ja/<id>/ja.md          the Japanese set: its own articles, no twins
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { pathOf } from '../site.mjs';

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
