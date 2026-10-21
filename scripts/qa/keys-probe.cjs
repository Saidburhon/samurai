// keys-probe (§3.2, §7.1, G3): keyboard steps and jumps, deep links and in-page anchors on the film.
//   (a step is checked inside its hold window, 0.02 of a beat, 2.5 s after the key)
//   ↓ / PageDown / Space go one beat on, ↑ / PageUp one back; Home and End jump; a nav link jumps to its beat;
//   #aloqa and #b=<name> open the page on their beat (no intro); the language switch carries #b=<beat>.
// Usage: node scripts/qa/keys-probe.cjs [base=http://localhost:8820]
const { execSync } = require('child_process');
const { chromium } = require(execSync('npm root -g').toString().trim() + '/playwright');
const base = (process.argv[2] || 'http://localhost:8820').replace(/\/$/, '');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 0.75 });
  const page = await ctx.newPage();
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  const beat = () => page.evaluate(() => Math.round(window.__qilich.beat * 1000) / 1000);
  const name = () => page.evaluate(() => window.__qilich.name);
  const ready = () => page.waitForFunction(() => window.__qilich && window.__qilich.film && window.__qilich.glReady, null, { timeout: 120000 });
  const res = [], ok = (what, got, want) => { const pass = typeof want === 'number' ? Math.abs(got - want) <= 0.02 : got === want; res.push(`${pass ? 'ok  ' : 'FAIL'} ${what}: ${got}${pass ? '' : ' (want ' + want + ')'}`); };
  await page.goto(`${base}/?nointro`, { waitUntil: 'domcontentloaded' }); await ready(); await sleep(3000);
  await page.mouse.move(700, 450);
  await page.keyboard.press('ArrowDown'); await sleep(2500); ok('ArrowDown from 0', await beat(), 1);
  await page.keyboard.press('PageDown'); await sleep(2500); ok('PageDown', await beat(), 2);
  await page.keyboard.press('Space'); await sleep(2500); ok('Space', await beat(), 3);
  await page.keyboard.press('ArrowUp'); await sleep(2500); ok('ArrowUp', await beat(), 2);
  await page.keyboard.press('PageUp'); await sleep(2500); ok('PageUp', await beat(), 1);
  await page.keyboard.press('End'); await sleep(3000); ok('End', await beat(), 24);
  await page.keyboard.press('Home'); await sleep(3000); ok('Home', await beat(), 0);
  await page.click('.nav .links a[href="#jarayon"]'); await sleep(3000); ok('nav link Jarayon', await name(), 'yaki.plan');
  await page.click('.nav .btn[href="#aloqa"]'); await sleep(3000); ok('nav CTA Bogʻlanish', await name(), 'noto.contact');
  await page.click('.ruler a[href="#tsuba"]'); await sleep(3000); ok('ruler Tsuba', await name(), 'tsuba.guard');
  // the language switch carries the beat
  await Promise.all([page.waitForNavigation({ timeout: 30000 }).catch(() => {}), page.click('.nav nav.lang a[hreflang="en"]')]);
  ok('language switch carries #b= (EN page URL)', /\/en\/#b=tsuba\.guard$/.test(page.url()), true);
  await ready(); await sleep(2500); ok('EN page opens on the beat', await name(), 'tsuba.guard');
  // deep links
  await page.goto(`${base}/#aloqa`, { waitUntil: 'domcontentloaded' }); await ready(); await sleep(2500); ok('deep link #aloqa', await name(), 'noto.contact');
  await page.goto(`${base}/#b=toki.1400`, { waitUntil: 'domcontentloaded' }); await ready(); await sleep(2500); ok('deep link #b=toki.1400', await name(), 'toki.1400');
  await page.goto(`${base}/?beat=temur.quote`, { waitUntil: 'domcontentloaded' }); await page.waitForFunction(() => window.__qilich && window.__qilich.posterReady, null, { timeout: 120000 }); ok('?beat=temur.quote', await name(), 'temur.quote');
  await page.goto(`${base}/?beat=7.5`, { waitUntil: 'domcontentloaded' }); await page.waitForFunction(() => window.__qilich && window.__qilich.posterReady, null, { timeout: 120000 }); ok('?beat=7.5', await beat(), 7.5);
  console.log(res.join('\n'));
  console.log(res.some((r) => r.startsWith('FAIL')) ? 'FAIL' : 'PASS: keys, jumps, anchors, deep links');
  console.log('errors', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
