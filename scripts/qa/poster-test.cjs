// poster-test (§3.9, §8): every hold rendered at the capture's resolution under the capture's SwiftShader flags and
// DPRs (desktop 1440 × 900 at 0.75, phone 390 × 844 at 1.5), with the pointer parked as the harness parks it, plus a
// timing log (GL ready, bakes, the first and the steady hold frame) and, for the frames locked to the prototype,
// side-by-side pairs with the prototype PNG downscaled to the same size (Lanczos, via scripts/qa/pairs.py).
// From G3 it also renders k + 0.5, the in-between strips, the neighbour and mid-vs-settled tests.
// Usage: node scripts/qa/poster-test.cjs [base=http://localhost:8800] [out=.cache/qa/poster] [--beats a,b,…] [--sw a|b]
//        [--views land,port] [--proto <dir of prototype shots>] [--boot]   (--boot also times the real boot path, ?cinema=1)
const path = require('path');
const fs = require('fs');
const { execSync, execFileSync } = require('child_process');
const { chromium } = require(execSync('npm root -g').toString().trim() + '/playwright');

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf('--' + n); return i < 0 ? d : (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true); };
const pos = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--') && !['boot'].includes(args[i - 1].slice(2))));
const base = (pos[0] || 'http://localhost:8800').replace(/\/$/, '');
const out = path.resolve(pos[1] || '.cache/qa/poster');
fs.mkdirSync(out, { recursive: true });
const sw = flag('sw', 'a'); // software option A is the shipped default (core/tier.js SW_DEFAULT)
const views = String(flag('views', 'land,port')).split(',');
// the G1 material-lock set: [label, query, layout, prototype frame]
const G1 = [
  ['B0-mei.hero', 'beat=mei.hero', 'land', '01-hero-1440.png'],
  ['reveal-0.755', 'beat=intro&reveal=0.755', 'land', '02-signature-reveal-1440.png'],
  ['B1-mei.promise', 'beat=mei.promise', 'land', null],
  ['B2-utsuri.ios', 'beat=utsuri.ios', 'land', '03-utsuri-services-1440.png'],
  ['B6-utsuri.ai', 'beat=utsuri.ai', 'land', null],
  ['B12-togi.front', 'beat=togi.front', 'land', null],
  ['B14a-tsuba.guard', 'beat=tsuba.guard&cand=a', 'land', '04-tsuba-1440.png'],
  ['B14b-tsuba.guard', 'beat=tsuba.guard&cand=b', 'land', '04-tsuba-1440.png'],
  ['B21-noto.contact', 'beat=noto.contact', 'land', null],
  ['M0-mei.hero', 'beat=mei.hero', 'port', '05-hero-phone-390.png'],
];
const only = flag('beats', null);
const set = G1.filter(([l, q, lay]) => views.includes(lay) && (!only || String(only).split(',').some((b) => l.includes(b))));
const VIEW = {
  land: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 0.75 },
  port: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.5, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' },
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const log = { base, sw, when: new Date().toISOString(), frames: [] };
  for (const [label, query, lay, proto] of set) {
    const ctx = await browser.newContext(VIEW[lay]);
    const page = await ctx.newPage();
    const errors = [];
    // (the driver's 'GPU stall due to ReadPixels' notice comes from the timing's own sync point: logged, not a failure)
    const notes = [];
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') (/GPU stall due to ReadPixels/.test(m.text()) ? notes : errors).push(`${m.type()}: ${m.text().slice(0, 300)}`); });
    page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message.slice(0, 300)));
    const t0 = Date.now();
    await page.goto(`${base}/?${query}&sw=${sw}`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    // the harness parks the pointer with one move before every step: it must not change the poster
    if (lay === 'land') await page.mouse.move(760, 450);
    let ok = true;
    try { await page.waitForFunction(() => window.__qilich && (window.__qilich.posterReady || window.__qilich.glError), null, { timeout: 240000 }); } catch (e) { ok = false; errors.push('TIMEOUT waiting for the poster'); }
    await sleep(300);
    const info = await page.evaluate(() => { const Q = window.__qilich || {}; return { timing: Q.timing, err: Q.glError, tier: Q.tier, sw: Q.sw, renderer: Q.renderer, pr: Q.stage && Q.stage.pr, buf: Q.stage && [Q.stage.renderer.domElement.width, Q.stage.renderer.domElement.height], ready: !!Q.posterReady }; }).catch((e) => ({ err: e.message }));
    const file = `${lay}-${label}.png`;
    await page.screenshot({ path: path.join(out, file) });
    log.frames.push({ label, query, layout: lay, file, proto, ok: ok && info.ready && !info.err && !errors.length, wallMs: Date.now() - t0, ...info, errors, notes: notes.length });
    console.log(`${label.padEnd(20)} ${lay} first ${info.timing && info.timing.first} hold ${info.timing && info.timing.hold} glReady ${info.timing && info.timing.glReady} buf ${info.buf} ${errors.length ? 'ERR ' + errors.join(' | ') : ''}`);
    await ctx.close();
  }
  // the real boot path: GL imported after the drawing, baked, compiled, first frame -> glReady (§4.1, G1: <= 1.7 s)
  if (flag('boot', false)) {
    for (let i = 0; i < 2; i++) {
      const ctx = await browser.newContext(VIEW.land);
      const page = await ctx.newPage();
      await page.goto(`${base}/?cinema=1&sw=${sw}`, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.__qilich && (window.__qilich.glReady || window.__qilich.glError), null, { timeout: 120000 }).catch(() => {});
      const b = await page.evaluate(() => ({ timing: window.__qilich.timing, err: window.__qilich.glError, nav: performance.timeOrigin }));
      log.boot = log.boot || []; log.boot.push(b);
      console.log('boot path', JSON.stringify(b.timing), b.err || '');
      await ctx.close();
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'poster-log.json'), JSON.stringify(log, null, 2));
  const protoDir = flag('proto', null);
  if (protoDir) {
    try { execFileSync('python3', [path.join(__dirname, 'pairs.py'), out, protoDir], { stdio: 'inherit' }); } catch (e) { console.log('pairs failed', e.message); }
  }
  const bad = log.frames.filter((f) => !f.ok);
  console.log(bad.length ? `FAIL: ${bad.map((f) => f.label).join(', ')}` : `ok: ${log.frames.length} posters`);
  process.exit(bad.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
