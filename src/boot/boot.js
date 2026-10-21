// Inlined at the end of <body> (<script data-gen="boot">). Never imports GL.
//   - the paper tiles (washi first, the others when the browser is idle) and the grain
//   - the hamon stipple of the hero drawing on canvas#stip, inked in 12 batches by 0.70 s during the intro,
//     from the same seeded dot list and the same placement as the build-emitted CSS
//   - the live clocks (Asia/Tashkent, Asia/Tokyo), aligned to the minute
import { stipple, frame, ANCHORS, SC } from '../sword/drawing.js';
import { axisEnds, bp2 } from '../sword/geom-core.js';
import { paperTile, grainTiles, toVar } from './tiles.js';
import { stipSurface } from '../fx/stipsurface.js';

const Q = window.__qilich || (window.__qilich = { boot: {} });
const idle = window.requestIdleCallback || ((f) => setTimeout(f, 60));

// ---------- paper ----------
toVar(paperTile('washi'), '--washi-tile');
idle(() => { const g = grainTiles(); toVar(g.k, '--grain-k'); toVar(g.w, '--grain-w'); });
// the ganch and togi grounds lie far down the page: their tiles (about 50 ms of main thread each) wait until the
// intro and the GL boot are over, so they never delay the drawing or the GL gate (§4.1); until then a flat colour
setTimeout(() => idle(() => { toVar(paperTile('ganch'), '--ganch-tile'); idle(() => { toVar(paperTile('togi'), '--togi-tile'); Q.boot.tiles = Math.round(performance.now()); }); }), 2500);

// ---------- the stipple ----------
const cv = document.getElementById('stip');
const stageEl = document.getElementById('stage');
const st = stipple({ count: 9000 });
const order = st.s.map((s, i) => i).sort((a, b) => st.s[a] - st.s[b]);
const { K, T } = axisEnds(1);
const F = frame(K, T);
const LKT = Math.hypot(T[0] - K[0], T[1] - K[1]) * SC;
const pts = order.map((i) => F(bp2(st.s[i], st.v[i], 1)));
let drawn = 0, place = null;

// The stipple is placed by the drawing itself: the CTM of svg#osh (K is its origin, +u runs to the tip) maps the
// dot list onto the canvas, so the dots sit on the blade whatever the viewport, the zoom or the CSS fallback did.
// Without a CTM (the svg not rendered) the anchors are used, on the stage's own width (never innerWidth: on a
// phone that is the visual viewport, which zooms out while anything overflows).
const oshEl = document.getElementById('osh');
function placement(r) {
  const m = oshEl && oshEl.getScreenCTM && oshEl.getScreenCTM();
  if (m && Math.hypot(m.a, m.b) > 1e-3) return { a: m.a, b: m.b, c: m.c, d: m.d, e: m.e - r.left, f: m.f - r.top, k: Math.hypot(m.a, m.b) };
  const W = r.width, Hs = r.height;
  const A = ANCHORS[matchMedia('(aspect-ratio < 1.2)').matches ? 'port' : 'land'];
  const Ks = [A.K[0] * W, A.K[1] * Hs], Ts = [A.T[0] * W, A.T[1] * Hs];
  const ang = Math.atan2(Ts[1] - Ks[1], Ts[0] - Ks[0]), k = Math.hypot(Ts[0] - Ks[0], Ts[1] - Ks[1]) / LKT;
  const c = Math.cos(ang) * k, s = Math.sin(ang) * k;
  return { a: c, b: s, c: -s, d: c, e: Ks[0], f: Ks[1], k };
}
// A CPU canvas (willReadFrequently): on a software renderer an accelerated 2D canvas of this size keeps the GPU
// process busy for about a second after the intro (measured: the GL boot then waits behind it, §4.1); it is shown
// through fx/stipsurface.js (one texture upload per batch, no raster), which fx/ink.js shares.
const surf = cv ? stipSurface(cv) : null;
const ink2d = () => surf.ctx;
let sig = '';
function layout() {
  const r = stageEl.getBoundingClientRect();
  const p = placement(r);
  // one canvas pixel per device pixel (at most 2 per CSS px): the dots are drawn with analytic coverage,
  // so a finer canvas adds nothing on screen, only upload work (each of the 12 batches re-uploads the canvas)
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  surf.size(Math.round(r.width * dpr), Math.round(r.height * dpr));
  place = { ...p, dpr };
  sig = [r.width, r.height, p.a, p.b, p.e, p.f].map((v) => v.toFixed(1)).join();
  Q.boot.place = sig; Q.boot.layouts = (Q.boot.layouts || 0) + 1; // for the probes
  drawn = 0;
  const ctx = ink2d();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, r.width, r.height);
}
function drawTo(n) {
  if (!place || n <= drawn) return;
  const ctx = ink2d(), { a, b, c, d, e, f, k } = place, rk = Math.min(1.6, Math.max(0.7, k));
  ctx.fillStyle = '#0F0E0C';
  for (let j = drawn; j < n; j++) {
    const i = order[j], [u, v] = pts[j];
    ctx.globalAlpha = st.a[i];
    ctx.beginPath(); ctx.arc(e + u * a + v * c, f + u * b + v * d, Math.max(0.35, st.r[i] * rk), 0, 6.2832); ctx.fill();
  }
  ctx.globalAlpha = 1;
  drawn = n;
  surf.present();
  Q.boot.stipN = drawn;
}
if (cv && stageEl) {
  layout();
  const kk = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--k')) || 1;
  if (Q.intro) {
    // The drawing ends by 0.80 s after navigation start (§4.1). The head script guessed --k from its own time, but
    // the CSS animations start at the first frame: in that frame's animation callback (before its style and paint)
    // --k is set so that the longest of them (0.80 s at k = 1: the annotations, the detail plate, the mei) ends at
    // 0.68 s; never below 0.375. (0.68, not 0.78: on a software renderer the GPU process rasters the drawing's last
    // frame for about 0.1–0.2 s after it, and the GL gate at 0.80 s queues behind that raster, G1.)
    // Their start time is pinned to that callback's time (a CSS animation otherwise starts when its first frame
    // commits, which a software renderer can delay by 0.2 s).
    requestAnimationFrame(() => {
      const c = performance.now(), k = Math.max(0.375, Math.min(kk, (680 - c) / 800));
      if (k < kk - 0.005) document.documentElement.style.setProperty('--k', k.toFixed(3));
      for (const a of document.getAnimations()) if (/^(draw|tick|hone)$/.test(a.animationName) && a.effect && a.effect.target && a.effect.target.closest('#osh-paper, .h1, .b-hero .sub, .mei')) a.startTime = c;
      Q.boot.animStart = Math.round(c); Q.boot.k = +k.toFixed(3);
    });
    // 12 batches, tang to tip, from 0.05 s to 0.62 s after navigation start (compressed with the CSS when late)
    const N = order.length;
    const tick = () => {
      const t = performance.now() / 1000;
      const b = Math.min(12, Math.max(0, Math.floor((t - 0.05 * kk) / (0.57 * kk / 12)) + 1));
      drawTo(Math.round(N * b / 12));
      if (b < 12) requestAnimationFrame(tick); else Q.boot.stipple = Math.round(performance.now());
    };
    tick();
  } else drawTo(order.length);
  // re-place on any change of the stage or of the drawing's placement (rotation, a visual-viewport zoom, the
  // overflow that zoomed it out going away): debounced, and only when the placement really moved
  let rt = 0;
  const relayout = () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      const r = stageEl.getBoundingClientRect(), p = placement(r);
      if ([r.width, r.height, p.a, p.b, p.e, p.f].map((v) => v.toFixed(1)).join() === sig) return;
      const n = drawn; layout(); drawTo(Math.max(n, Q.intro ? 0 : order.length) || order.length);
    }, 120);
  };
  addEventListener('resize', relayout);
  addEventListener('orientationchange', relayout);
  if (window.visualViewport) visualViewport.addEventListener('resize', relayout);
  addEventListener('load', relayout);
}

// ---------- clocks ----------
const fmt = (tz) => { try { return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: tz }); } catch (e) { return null; } };
const fTas = fmt('Asia/Tashkent'), fTok = fmt('Asia/Tokyo');
function clocks() {
  const now = new Date();
  if (fTas) for (const el of document.querySelectorAll('.t-tas')) el.textContent = fTas.format(now);
  if (fTok) for (const el of document.querySelectorAll('.t-tok')) el.textContent = fTok.format(now);
  setTimeout(clocks, 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 30);
}
clocks();
Q.boot.end = Math.round(performance.now());
