// swipe-probe (§3.2, §8 G3): the capture's phone replay against the film (capture.cjs: 390 × 844 at DPR 1.5, an iPhone
// user agent with touch; 15 CDP finger drags of 10 × 52 px at 16 ms; a frame 1.3 s after each). Logs scrollY, the
// poster on screen (__qilich.poster) and the beat of the frame drawn, saves the frames, and checks that the 15 swipes
// land on posters 1 … 15 exactly, the settled frame exact.
// Usage: node scripts/qa/swipe-probe.cjs [base=http://localhost:8820] [out=.cache/qa/swipe] [--url /]
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { chromium } = require(execSync('npm root -g').toString().trim() + '/playwright');

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf('--' + n); return i < 0 ? d : args[i + 1]; };
const pos = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
const base = (pos[0] || 'http://localhost:8820').replace(/\/$/, '');
const out = path.resolve(pos[1] || '.cache/qa/swipe');
const url = base + flag('url', '/');
fs.mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.5, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if ((m.type() === 'error' || m.type() === 'warning') && !/GPU stall due to ReadPixels/.test(m.text())) errors.push(`${m.type()}: ${m.text().slice(0, 300)}`); });
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message.slice(0, 300)));
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await sleep(3000); await page.screenshot({ path: path.join(out, 'm-00-intro.png') });
  await sleep(5000); await page.screenshot({ path: path.join(out, 'm-01.png') });
  const read = () => page.evaluate(() => { const Q = window.__qilich || {}; return { y: Q.scrollY != null ? Q.scrollY : Math.round(scrollY), docY: Math.round(scrollY), poster: Q.poster, pos: Q.pos, beat: Q.beat, drawn: Q.drawnBeat, name: Q.name, unit: Q.film && Q.film.director.unit }; });
  const log = { url, when: new Date().toISOString(), start: await read(), swipes: [] };
  console.log('start', JSON.stringify(log.start));
  const cdp = await ctx.newCDPSession(page);
  for (let i = 2; i <= 16; i++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y: 700 }] });
    for (let k = 1; k <= 10; k++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195, y: 700 - 52 * k }] }); await sleep(16); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await sleep(1300);
    const nn = String(i).padStart(2, '0');
    await page.screenshot({ path: path.join(out, `m-${nn}.png`) });
    const r = await read();
    log.swipes.push({ i, ...r });
    console.log(`m-${nn} y ${r.y} poster ${r.poster} pos ${r.pos != null ? r.pos.toFixed(3) : '-'} ${r.name} drawn ${r.drawn}`);
  }
  log.overflowX = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  log.errors = errors;
  const bad = [];
  log.swipes.forEach((s, j) => {
    const want = j + 1;
    if (s.poster !== want) bad.push(`swipe ${j + 1}: poster ${s.poster} != ${want}`);
    if (s.unit && s.y !== want * s.unit) bad.push(`swipe ${j + 1}: scrollY ${s.y} != ${want * s.unit}`);
    if (Math.abs(s.pos - Math.round(s.pos)) > 1e-6) bad.push(`swipe ${j + 1}: settled at ${s.pos}`);
  });
  log.fail = bad;
  fs.writeFileSync(path.join(out, 'swipe-probe.json'), JSON.stringify(log, null, 1));
  console.log('overflowX', log.overflowX);
  console.log(bad.length ? 'FAIL\n' + bad.join('\n') : 'PASS: 15 swipes -> posters 1 … 15, settled exactly');
  console.log('errors', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
