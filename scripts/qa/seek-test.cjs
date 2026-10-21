// seek-test (§3.9, §8 G3): seeking, scrolling forwards, scrolling backwards and jumping to a beat give the same frame
// (pixel diff under 1 %, the share of full-size pixels that differ by more than 24 grey levels), and hidden scenes
// take no clicks (the link positions of noto.contact, clicked while the hero is on screen, reach nothing of it).
// Desktop 1440 × 900 at DPR .75 under the capture's SwiftShader flags; the scroll is the capture's own wheel step.
// Usage: node scripts/qa/seek-test.cjs [base=http://localhost:8820] [out=.cache/qa/seek] [--beats 1,2,7,…]
const path = require('path');
const fs = require('fs');
const { execSync, execFileSync } = require('child_process');
const { chromium } = require(execSync('npm root -g').toString().trim() + '/playwright');

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf('--' + n); return i < 0 ? d : args[i + 1]; };
const pos = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
const base = (pos[0] || 'http://localhost:8820').replace(/\/$/, '');
const out = path.resolve(pos[1] || '.cache/qa/seek');
const BEATS = String(flag('beats', '1,2,7,11,12,14,17,20,21,22,23')).split(',').map(Number);
fs.mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const LAUNCH = { args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] };
const VIEW = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 0.75 };
const diff = (a, b) => JSON.parse(execFileSync('python3', [path.join(__dirname, 'frame-diff.py'), 'compare', a, b], { encoding: 'utf8' })).share;
// every frame waits until the film has drawn its hold, settled, and the page has had time to composite it
const settle = async (page, beat) => {
  await page.waitForFunction((b) => { const Q = window.__qilich; return Q && Q.drawnBeat != null && Math.abs(Q.drawnBeat - b) < 1e-3 && Q.atHold; }, beat, { timeout: 60000 }).catch(() => {});
  await sleep(2600);
};

(async () => {
  const browser = await chromium.launch(LAUNCH);
  const log = { base, when: new Date().toISOString(), beats: BEATS, seek: {}, fwd: {}, back: {}, jump: {}, fail: [] };
  const errors = [];
  const watch = (page) => { page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message.slice(0, 200))); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); }); };

  // (a) seek: ?beat=k, the director frozen on the hold
  {
    const ctx = await browser.newContext(VIEW); const page = await ctx.newPage(); watch(page);
    await page.goto(`${base}/?beat=${BEATS[0]}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.__qilich && window.__qilich.posterReady, null, { timeout: 120000 });
    for (const b of BEATS) {
      await page.evaluate((b) => window.__qilich.seek(b), b);
      await settle(page, b);
      const f = path.join(out, `seek-${String(b).padStart(2, '0')}.png`);
      await page.screenshot({ path: f }); log.seek[b] = f;
    }
    // hidden scenes take no clicks: the rects of noto.contact's links and buttons, then clicks there on the hero
    await page.evaluate(() => window.__qilich.seek('noto.contact')); await settle(page, 22);
    const rects = await page.evaluate(() => [...document.querySelectorAll('#aloqa a, #aloqa button')].map((el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, t: el.textContent.trim().slice(0, 24) }; }).filter((r) => r.w > 0 && r.h > 0));
    await page.evaluate(() => window.__qilich.seek(0)); await settle(page, 0);
    await page.evaluate(() => { window.__clicks = []; document.addEventListener('click', (e) => { const a = e.target.closest && e.target.closest('a, button'); window.__clicks.push(a ? a.closest('#aloqa') ? 'ALOQA ' + a.textContent.trim().slice(0, 20) : 'other ' + a.textContent.trim().slice(0, 20) : 'none'); e.preventDefault(); }, true); });
    const hits = [];
    for (const r of rects) {
      if (r.y < 76 || r.y > 860) continue; // the nav and the ruler bands are site furniture, on every beat
      const under = await page.evaluate(([x, y]) => { const el = document.elementFromPoint(x, y); return el ? (el.closest('#aloqa') ? 'ALOQA' : el.tagName + '.' + (el.className && el.className.baseVal == null ? String(el.className).slice(0, 30) : '')) : 'none'; }, [r.x, r.y]);
      await page.mouse.click(r.x, r.y);
      hits.push({ ...r, under });
    }
    const clicks = await page.evaluate(() => window.__clicks);
    log.hidden = { rects: hits, clicks, beatAfter: await page.evaluate(() => window.__qilich.beat) };
    if (hits.some((h) => h.under === 'ALOQA') || clicks.some((c) => c.startsWith('ALOQA'))) log.fail.push('a hidden scene took a click: ' + JSON.stringify(clicks));
    await ctx.close();
  }
  // (b) scroll forwards and (c) backwards, with the capture's wheel step; (d) jump (a nav-style jump with its slash)
  {
    const ctx = await browser.newContext(VIEW); const page = await ctx.newPage(); watch(page);
    await page.goto(`${base}/?nointro`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.__qilich && window.__qilich.film && window.__qilich.glReady, null, { timeout: 120000 });
    await sleep(6000);
    const step = async (dir) => { await page.mouse.move(760, 450); for (let k = 0; k < 3; k++) { await page.mouse.wheel(0, 160 * dir); await sleep(45); } await sleep(1600); };
    let at = 0;
    const max = Math.max(...BEATS);
    for (let b = 1; b <= 24; b++) {
      await step(1); at = b;
      if (BEATS.includes(b)) { await settle(page, b); const f = path.join(out, `fwd-${String(b).padStart(2, '0')}.png`); await page.screenshot({ path: f }); log.fwd[b] = f; }
    }
    for (let b = 23; b >= Math.min(...BEATS); b--) {
      await step(-1); at = b;
      if (BEATS.includes(b)) { await settle(page, b); const f = path.join(out, `back-${String(b).padStart(2, '0')}.png`); await page.screenshot({ path: f }); log.back[b] = f; }
    }
    void max; void at;
    for (const b of BEATS) {
      // from two or more beats away, so the jump plays its freeze and slash
      const from = b > 3 ? b - 3 : b + 3;
      await page.evaluate((p) => window.__qilich.film.director.jump(p), from); await settle(page, from);
      await page.evaluate((p) => window.__qilich.film.director.jump(p), b); await settle(page, b);
      const f = path.join(out, `jump-${String(b).padStart(2, '0')}.png`); await page.screenshot({ path: f }); log.jump[b] = f;
    }
    await ctx.close();
  }
  // the comparisons
  log.diff = {};
  for (const b of BEATS) {
    const r = {};
    for (const k of ['fwd', 'back', 'jump']) if (log[k][b]) r[k] = diff(log.seek[b], log[k][b]);
    log.diff[b] = r;
    for (const [k, v] of Object.entries(r)) if (v >= 0.01) log.fail.push(`beat ${b}: ${k} differs from ?beat by ${(v * 100).toFixed(2)} %`);
    console.log(`beat ${String(b).padStart(2)}  fwd ${((r.fwd ?? NaN) * 100).toFixed(2)} %  back ${((r.back ?? NaN) * 100).toFixed(2)} %  jump ${((r.jump ?? NaN) * 100).toFixed(2)} %`);
  }
  log.errors = errors;
  fs.writeFileSync(path.join(out, 'seek-test.json'), JSON.stringify(log, null, 1));
  console.log('hidden-scene clicks:', JSON.stringify(log.hidden.clicks), 'beat after', log.hidden.beatAfter);
  console.log(log.fail.length ? 'FAIL\n' + log.fail.join('\n') : 'PASS: seek = scroll forwards = scroll backwards = jump (< 1 %); hidden scenes take no clicks');
  console.log('errors', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
