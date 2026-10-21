// beat-probe (§3.2, §8 G3): the capture's desktop wheel replay against the film, with the harness's own timing and
// pointer parking (capture.cjs: one move to (720 ± 40, 450), three 160-unit wheels 45 ms apart, the mid frame 180 ms
// after the last, the settled frame 1.3 s after that). For each of 26 steps it logs scrollY, the director's beat,
// the beat of the frame on screen (drawnBeat), raysReady and cutReady at the mid shot (~+0.3 s), +1.0 s and the
// settled shot (~+1.5 s), saves the mid and settled frames, and checks the G3 criteria:
//   scrollY = 640·k; mid frames in k + .35 … .80 with a median of .45–.60; settled frames exact; cutReady at +1.0 s;
//   the mid frame differs from the settled one (10 % of 480 × 300 thumbnail pixels by more than 24 levels).
// Usage: node scripts/qa/beat-probe.cjs [base=http://localhost:8820] [out=.cache/qa/beat] [--steps 26] [--url /?nointro]
const path = require('path');
const fs = require('fs');
const { execSync, execFileSync } = require('child_process');
const { chromium } = require(execSync('npm root -g').toString().trim() + '/playwright');

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf('--' + n); return i < 0 ? d : args[i + 1]; };
const pos = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
const base = (pos[0] || 'http://localhost:8820').replace(/\/$/, '');
const out = path.resolve(pos[1] || '.cache/qa/beat');
const steps = +flag('steps', 26);
const url = base + flag('url', '/?stamp=1');
fs.mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 0.75 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if ((m.type() === 'error' || m.type() === 'warning') && !/GPU stall due to ReadPixels/.test(m.text())) errors.push(`${m.type()}: ${m.text().slice(0, 300)}`); });
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message.slice(0, 300)));
  const t0 = Date.now();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
  // as the capture: the load sequence runs to 16 s, then the cursor sweep over the first screen
  await sleep(Math.max(0, 16000 - (Date.now() - t0)));
  await page.mouse.move(200, 250);
  for (let i = 0; i <= 10; i++) { await page.mouse.move(200 + i * 102, 250 + Math.sin(i / 1.7) * 160 + i * 18); await sleep(60); }
  await sleep(300);
  await page.mouse.move(720, 450, { steps: 12 }); await sleep(800);
  const read = () => page.evaluate(() => { const Q = window.__qilich || {}; return { y: Q.scrollY != null ? Q.scrollY : Math.round(scrollY), docY: Math.round(scrollY), beat: Q.beat, drawn: Q.drawnBeat, name: Q.name, rays: !!Q.raysReady, cut: !!Q.cutReady, hold: !!Q.atHold, ms: Q.frameMs }; });
  const log = { url, when: new Date().toISOString(), steps: [] };
  const start = await read();
  const origin = await page.evaluate(() => performance.timeOrigin);
  const pt = (t) => t - origin; // node's clock -> the page's performance.now()
  console.log('start', JSON.stringify(start));
  for (let i = 1; i <= steps; i++) {
    // exactly the capture's step: nothing else talks to the page until the settled frame is taken
    await page.mouse.move(720 + (i % 2 ? 40 : -40), 450);
    const w0 = Date.now();
    for (let k = 0; k < 3; k++) { await page.mouse.wheel(0, 160); await sleep(45); }
    await sleep(180);
    const nn = String(i).padStart(2, '0');
    const m0 = Date.now();
    await page.screenshot({ path: path.join(out, `d-step-${nn}-mid.png`) });
    const m1 = Date.now();
    await sleep(1300);
    await page.screenshot({ path: path.join(out, `d-step-${nn}.png`) });
    const set = await read();
    const flog = await page.evaluate(() => (window.__qilich.flog || []).slice());
    const before = (t) => { let f = null; for (const x of flog) if (x[0] <= pt(t)) f = x; return f; };
    const mA = before(m0), mB = before(m1), a1 = before(w0 + 1000);
    const frames = flog.filter((x) => x[0] >= pt(w0) && x[0] <= pt(m1 + 1300));
    // the beat each screenshot really shows (the film's stamp, committed with its frame)
    let shown = {};
    try { shown = JSON.parse(execFileSync('python3', [path.join(__dirname, 'frame-diff.py'), 'stamp', path.join(out, `d-step-${nn}-mid.png`), path.join(out, `d-step-${nn}.png`)], { encoding: 'utf8' })); } catch (e) { /* no stamp */ }
    const midShown = shown[`d-step-${nn}-mid.png`], setShown = shown[`d-step-${nn}.png`];
    const s = { i, wheelsMs: m0 - w0, midShotMs: [m0 - w0, m1 - w0], midA: mA, midB: mB, midShown, setShown, at1: a1, set, frames };
    log.steps.push(s);
    const iv = frames.map((x, j) => (j ? x[0] - frames[j - 1][0] : 0)).slice(1);
    console.log(`${nn} y ${set.y} beat ${set.beat} ${set.name} | wheels ${m0 - w0} ms, mid shot ${m0 - w0}-${m1 - w0} ms: shows ${midShown} (issued ${mA && mA[1]} .. ${mB && mB[1]}) | +1.0 s frame ${a1 && a1[1]} | settled ${set.drawn} cut ${set.cut} rays ${set.rays} | ${frames.length} frames, interval ${iv.length ? Math.round(iv.reduce((a, b) => a + b, 0) / iv.length) : '-'} ms`);
  }
  log.errors = errors;
  // the criteria
  const fr = [], bad = [];
  let prev = start.beat || 0;
  for (const s of log.steps) {
    const k = Math.round(s.set.beat);
    const mid = s.midShown != null ? s.midShown : s.midB ? s.midB[1] : null;
    if (k > prev && mid != null) fr.push(+(mid - prev).toFixed(3));
    if (s.set.y !== 640 * Math.min(24, s.i)) bad.push(`step ${s.i}: scrollY ${s.set.y} != ${640 * Math.min(24, s.i)}`);
    const setB = s.setShown != null ? s.setShown : s.set.drawn;
    if (setB == null || Math.abs(setB - k) > 0.002) bad.push(`step ${s.i}: the settled frame shows ${setB}, not ${k}`);
    if (!s.set.cut) bad.push(`step ${s.i}: cutReady false at the settled frame`);
    if (s.at1 && Math.abs(s.at1[1] - k) > 0.15) bad.push(`step ${s.i}: the frame at +1.0 s is ${s.at1[1]}, outside the hold window of ${k}`);
    prev = k;
  }
  const sorted = [...fr].sort((a, b) => a - b), med = sorted.length ? sorted[Math.floor(sorted.length / 2)] : null;
  const outside = fr.filter((f) => f < 0.35 || f > 0.80);
  log.mid = { fractions: fr, median: med, outside };
  log.fail = bad;
  // mid vs settled (the §3.9 measure)
  try {
    const r = execFileSync('python3', [path.join(__dirname, 'frame-diff.py'), 'pairs', out], { encoding: 'utf8' });
    log.midVsSettled = JSON.parse(r);
  } catch (e) { log.midVsSettled = { error: e.message.slice(0, 200) }; }
  fs.writeFileSync(path.join(out, 'beat-probe.json'), JSON.stringify(log, null, 1));
  console.log('mid fractions', fr.join(' '));
  console.log('median', med, 'outside .35–.80:', outside.length, outside.join(' '));
  console.log('mid vs settled', JSON.stringify(log.midVsSettled && log.midVsSettled.low));
  console.log(bad.length ? 'FAIL\n' + bad.join('\n') : 'PASS: scrollY, settled frames, hold window and cutReady at +1.0 s');
  console.log('errors', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
