// npm run indexnow: tells Bing and Yandex (through IndexNow; Google does not use it) which URLs changed, after a
// deploy. A URL counts as changed when its lastmod in content/lastmod.json (written by the build, the day its words
// last changed) is newer than the lastmod sent last time (content/indexnow-sent.json, committed with the deploy).
// The key is in content/site.json and its file is served at https://qilich.com/<key>.txt (written by the build).
// Usage: npm run indexnow [-- --dry-run] [-- --all]
//   --dry-run   print what would be sent, send nothing, record nothing
//   --all       send every URL of the sitemaps (the first submission, or after a domain move)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const SITE = 'https://qilich.com';
const ENDPOINT = 'https://api.indexnow.org/indexnow'; // shared: Bing, Yandex, Seznam, Naver and others receive it
const dry = process.argv.includes('--dry-run'), all = process.argv.includes('--all');
const { indexnow } = JSON.parse(readFileSync('content/site.json', 'utf8'));
const key = indexnow?.key;
if (!/^[0-9a-f]{32}$/.test(key || '')) { console.error('indexnow: no key in content/site.json (indexnow.key, 32 hex characters)'); process.exit(1); }

// the URLs the sitemaps publish, with their lastmod
const urls = new Map();
for (const lang of ['uz', 'ru', 'en', 'ja']) {
  const f = `public/sitemaps/${lang}.xml`;
  if (!existsSync(f)) continue;
  for (const m of readFileSync(f, 'utf8').matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)) urls.set(m[1], m[2]);
}
if (!urls.size) { console.error('indexnow: no sitemaps in public/ (run npm run build first)'); process.exit(1); }
const SENT = 'content/indexnow-sent.json';
const sent = existsSync(SENT) ? JSON.parse(readFileSync(SENT, 'utf8')) : {};
const changed = [...urls].filter(([u, d]) => all || !sent[u] || sent[u] < d).map(([u]) => u);
if (!changed.length) { console.log('indexnow: nothing changed since the last submission'); process.exit(0); }

console.log(`indexnow: ${changed.length} URL(s)${dry ? ' (dry run)' : ''}\n  ${changed.join('\n  ')}`);
if (dry) process.exit(0);
// the key file must be live first, or the engines reject the submission
const probe = await fetch(`${SITE}/${key}.txt`).then((r) => r.text()).catch(() => '');
if (probe.trim() !== key) { console.error(`indexnow: ${SITE}/${key}.txt does not answer with the key yet (deploy first)`); process.exit(1); }
for (let i = 0; i < changed.length; i += 10000) {
  const urlList = changed.slice(i, i + 10000);
  const r = await fetch(ENDPOINT, {
    method: 'POST', headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: 'qilich.com', key, keyLocation: `${SITE}/${key}.txt`, urlList }),
  });
  // 200 OK and 202 Accepted are both success
  if (r.status !== 200 && r.status !== 202) { console.error(`indexnow: HTTP ${r.status} ${await r.text().catch(() => '')}`); process.exit(1); }
  console.log(`indexnow: HTTP ${r.status} for ${urlList.length} URL(s)`);
}
for (const u of changed) sent[u] = urls.get(u);
writeFileSync(SENT, JSON.stringify(Object.fromEntries(Object.entries(sent).sort()), null, 1) + '\n');
console.log(`indexnow: recorded in ${SENT}`);
