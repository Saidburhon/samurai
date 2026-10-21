// launch-check: the address rules of SEO-GEO-GUIDELINES (Pre-launch checklist item 1, Canonicals and redirects),
// checked over HTTP against the Worker, not against a static file server:
//   - every page has one address: /en and /en/index.html answer 301 straight to /en/ (public/_redirects, written by
//     scripts/build-pages.mjs), the query string kept; /index.html 301s to /
//   - a missing page answers 404; HSTS with includeSubDomains on a page
//   - on the production host only: http:// answers 301 to https:// (Cloudflare "Always Use HTTPS", an owner setting),
//     www answers 301 to the apex in one hop, over https (workers/www-redirect), for http and https
// Usage: node scripts/qa/launch-check.mjs [base=https://qilich.com]
//        npm run dev, then node scripts/qa/launch-check.mjs http://localhost:8787   (wrangler dev: same asset server)
// Exit code 1 on any failure.
const base = (process.argv[2] || 'https://qilich.com').replace(/\/$/, '');
const prod = /^https:\/\/qilich\.com$/.test(base);
const fails = [], oks = [];
const head = async (url) => {
  try {
    const r = await fetch(url, { redirect: 'manual', headers: { 'user-agent': 'Mozilla/5.0 (launch-check)' } });
    return { status: r.status, location: r.headers.get('location'), hsts: r.headers.get('strict-transport-security') };
  } catch (e) { return { status: 0, error: String(e.cause?.code || e.message) }; }
};
// a Location may be relative (the asset server) or absolute (a zone rule)
const same = (loc, want, from) => { try { return new URL(loc, from).href === new URL(want, from).href; } catch { return false; } };
async function expect(url, status, to) {
  const r = await head(url);
  const ok = r.status === status && (!to || same(r.location, to, url));
  (ok ? oks : fails).push(`${url} → ${r.status}${r.location ? ` ${r.location}` : ''}${r.error ? ` (${r.error})` : ''}${ok ? '' : ` (want ${status}${to ? ` ${to}` : ''})`}`);
  return r;
}

await expect(`${base}/en`, 301, `${base}/en/`);
await expect(`${base}/en/index.html`, 301, `${base}/en/`);
await expect(`${base}/index.html`, 301, `${base}/`);
await expect(`${base}/about`, 301, `${base}/about/`);
await expect(`${base}/ru/resheniya`, 301, `${base}/ru/resheniya/`);
await expect(`${base}/ja/solutions/web/index.html`, 301, `${base}/ja/solutions/web/`);
await expect(`${base}/en/solutions?q=1C`, 301, `${base}/en/solutions/?q=1C`);
await expect(`${base}/en/`, 200);
await expect(`${base}/robots.txt`, 200);
await expect(`${base}/sitemap.xml`, 200);
await expect(`${base}/nope-launch-check/`, 404);
const page = await head(`${base}/`);
(/max-age=\d+.*includeSubDomains/i.test(page.hsts || '') ? oks : fails).push(`${base}/ HSTS: ${page.hsts || 'missing'}`);
if (prod) {
  await expect('http://qilich.com/', 301, 'https://qilich.com/');
  await expect('http://qilich.com/en/', 301, 'https://qilich.com/en/');
  await expect('https://www.qilich.com/en/', 301, 'https://qilich.com/en/');
  await expect('http://www.qilich.com/en/', 301, 'https://qilich.com/en/');
} else {
  oks.push('(http → https and www checked only against https://qilich.com)');
}
for (const o of oks) console.log(`ok   ${o}`);
for (const f of fails) console.log(`FAIL ${f}`);
console.log(fails.length ? `launch-check: ${fails.length} failed` : 'launch-check: ok');
process.exitCode = fails.length ? 1 : 0;
