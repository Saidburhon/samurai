// Share images and icons.
//   public/assets/img/og-{uz,ru,en}.png    1200 × 630: the hero poster (/?og=1) of each language page
//   public/assets/img/favicon.svg          the mon in sumi on washi
//   public/assets/img/logo-512.png, apple-touch-icon.png
// Playwright renders the pages from a throwaway static server with the same SwiftShader flags as the capture.
// (From G2 the hero carries the steel; until then the share image is the drawing poster.)
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
const { chromium } = require(execSync('npm root -g').toString().trim() + '/playwright');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json', '.xml': 'application/xml' };

const MON = '<path fill-rule="evenodd" d="M16 3.6a12.4 12.4 0 1 1 0 24.8a12.4 12.4 0 1 1 0-24.8zM16 8.3a7.7 7.7 0 1 0 0 15.4a7.7 7.7 0 1 0 0-15.4z"/><path d="M16 11.2c.95 0 1.55.35 1.55.9c0 .9-.7 3.1-1.55 7.6c-.85-4.5-1.55-6.7-1.55-7.6c0-.55.6-.9 1.55-.9z"/><path d="M22.6 22.1l8.6 8.4c.25.26-.05.6-.36.42L21.2 23.6z"/>';
const icon = (pad) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="${pad > 4 ? 0 : 6}" fill="#ECE6DA"/><g fill="#0F0E0C" transform="translate(${pad} ${pad}) scale(${(32 - 2 * pad) / 32})">${MON}</g></svg>`;
writeFileSync('public/assets/img/favicon.svg', icon(3));
await sharp(Buffer.from(icon(6))).resize(512, 512).png().toFile('public/assets/img/logo-512.png');
await sharp(Buffer.from(icon(6))).resize(180, 180).png().toFile('public/assets/img/apple-touch-icon.png');

const server = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = join('public', p);
  if (!f.startsWith('public') || !existsSync(f) || statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' });
  res.end(readFileSync(f));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
try {
  for (const lang of ['uz', 'ru', 'en']) {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    await page.goto(`http://127.0.0.1:${port}${lang === 'uz' ? '/' : `/${lang}/`}?og=1`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);
    // a palette PNG keeps the paper and the hairlines at about a third of the size
    await sharp(await page.screenshot()).png({ palette: true, quality: 92, effort: 10, dither: 0.5 }).toFile(`public/assets/img/og-${lang}.png`);
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
console.log('og: og-uz/ru/en.png, favicon.svg, logo-512.png, apple-touch-icon.png');
