// boot-path probe (G1 r2; capture conditions: 1440x900 @0.75 or 390x844 @1.5, SwiftShader, a fresh browser per run,
// each started when no other headless browser runs): the capture's intro screenshots, Q.timing (glReady, the bakes,
// the reveal's start), the reveal uniform before and after the 3 s shot, the first frames' GPU times, the load.
// Then scripts/qa/reveal-coverage.py <outdir> reads the steel's share of the sword at 3 s and its presence later.
// node scripts/qa/boot-probe.cjs <base> <outdir> <N> [path=/?cinema=1] [shots=1000,3000,6500] [view=land|port]
const path = require('path'), fs = require('fs');
const { execSync } = require('child_process');
const { chromium } = require(execSync('npm root -g').toString().trim() + '/playwright');
const [base, out, N = 3, url = '/?cinema=1', shotsArg = '1000,3000,6500', view = 'land'] = process.argv.slice(2);
const SH = shotsArg.split(',').map(Number);
fs.mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const others = () => +execSync("pgrep -fc '[h]eadless_shell.real --font' || true").toString().trim();
const VIEW = {
  land: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 0.75 },
  port: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.5, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' },
};
(async () => {
  const res = [];
  for (let i = 0; i < +N; i++) {
    let waited = 0;
    for (let w = 0; w < 1800 && others() > 0; w++) { await sleep(1000); waited++; }
    const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
    let crowd = 0; const watch = setInterval(() => { try { crowd = Math.max(crowd, others()); } catch (e) {} }, 300);
    const ctx = await browser.newContext(VIEW[view]);
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text().slice(0, 200)); });
    page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message.slice(0, 200)));
    const t0 = Date.now();
    await page.goto(base + url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    const shots = {};
    const st = () => page.evaluate(() => { const Q = window.__qilich || {}; let rv = null; try { rv = Q.stage ? +Q.stage.U.uReveal.value.toFixed(3) : null; } catch (e) {} return { t: performance.now() | 0, intro: Q.intro, rv, ready: !!Q.glReady, osh: document.documentElement.classList.contains('osh-set'), tf: (document.getElementById('osh-paper') || {}).style ? getComputedStyle(document.getElementById('osh-paper')).rotate + '|' + getComputedStyle(document.getElementById('osh-paper')).transform.slice(0, 40) : null }; }).catch(() => null);
    for (const ms of SH) {
      await sleep(Math.max(0, ms - (Date.now() - t0)));
      const a = Date.now() - t0, s0 = await st();
      await page.screenshot({ path: path.join(out, `r${i}-${ms}.png`) });
      const s1 = await st();
      shots[ms] = { at: a, done: Date.now() - t0, before: s0, after: s1 };
    }
    await page.waitForFunction(() => window.__qilich && (window.__qilich.glReady || window.__qilich.glError), null, { timeout: 60000 }).catch(() => {});
    const info = await page.evaluate(() => ({ t: window.__qilich.timing, err: window.__qilich.glError || null, idleErr: window.__qilich.idleError || null, flog: (window.__qilich.flog || []).slice(0, 40) }));
    clearInterval(watch);
    const load = fs.readFileSync('/proc/loadavg', 'utf8').split(' ')[0];
    const r = { i, glReady: info.t && info.t.glReady, t: info.t, shots, load, crowd: crowd - 1, waited, err: info.err, idleErr: info.idleErr, errs, flog: info.flog };
    res.push(r);
    console.log(JSON.stringify({ i, glReady: r.glReady, bakesIn: info.t && info.t.bakesIn, rs: info.t && info.t.revealStart, s3: shots[3000] && [shots[3000].before && shots[3000].before.rv, shots[3000].after && shots[3000].after.rv], load, crowd: r.crowd, errs: errs.length, err: r.err }));
    await browser.close();
  }
  const g = res.map((r) => r.glReady).filter(Boolean).sort((a, b) => a - b);
  console.log('glReady sorted', g.join(' '), 'median', g[g.length >> 1], 'under1700', g.filter((x) => x <= 1700).length + '/' + g.length);
  fs.writeFileSync(path.join(out, 'boot.json'), JSON.stringify(res, null, 1));
})();
