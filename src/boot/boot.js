// Inlined at the end of <body> (<script data-gen="boot">). Never imports GL.
//   - the paper tiles (washi first, the others when the browser is idle) and the grain
//   - the hamon stipple of the hero drawing on canvas#stip, inked in 12 batches by 0.70 s during the intro,
//     from the same seeded dot list and the same placement as the build-emitted CSS
//   - the live clocks (Asia/Tashkent, Asia/Tokyo), aligned to the minute
import { stipple, frame, ANCHORS, SC } from '../sword/drawing.js';
import { axisEnds, bp2 } from '../sword/geom-core.js';
import { paperTile, grainTile, toVar } from './tiles.js';

const Q = window.__qilich || (window.__qilich = { boot: {} });
const idle = window.requestIdleCallback || ((f) => setTimeout(f, 60));

// ---------- paper ----------
toVar(paperTile('washi'), '--washi-tile');
idle(() => { toVar(grainTile(), '--grain-tile'); idle(() => { toVar(paperTile('ganch'), '--ganch-tile'); idle(() => toVar(paperTile('togi'), '--togi-tile')); }); });

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

function layout() {
  const r = stageEl.getBoundingClientRect();
  const W = window.innerWidth, Hs = r.height;
  const A = ANCHORS[matchMedia('(aspect-ratio < 1.2)').matches ? 'port' : 'land'];
  const Ks = [A.K[0] * W, A.K[1] * Hs], Ts = [A.T[0] * W, A.T[1] * Hs];
  const ang = Math.atan2(Ts[1] - Ks[1], Ts[0] - Ks[0]), k = Math.hypot(Ts[0] - Ks[0], Ts[1] - Ks[1]) / LKT;
  const dpr = Math.min(3, Math.max(1.5, (window.devicePixelRatio || 1) * 1.5));
  cv.width = Math.round(r.width * dpr); cv.height = Math.round(Hs * dpr);
  place = { Ks, c: Math.cos(ang) * k, s: Math.sin(ang) * k, k, dpr };
  drawn = 0;
  const ctx = cv.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cv.width, cv.height);
}
function drawTo(n) {
  if (!place || n <= drawn) return;
  const ctx = cv.getContext('2d'), { Ks, c, s, k } = place, rk = Math.min(1.6, Math.max(0.7, k));
  ctx.fillStyle = '#0F0E0C';
  for (let j = drawn; j < n; j++) {
    const i = order[j], [u, v] = pts[j];
    ctx.globalAlpha = st.a[i];
    ctx.beginPath(); ctx.arc(Ks[0] + u * c - v * s, Ks[1] + u * s + v * c, Math.max(0.35, st.r[i] * rk), 0, 6.2832); ctx.fill();
  }
  ctx.globalAlpha = 1;
  drawn = n;
}
if (cv && stageEl) {
  layout();
  const kk = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--k')) || 1;
  if (Q.intro) {
    // 12 batches, tang to tip, from 0.05 s to 0.70 s after navigation start (compressed with the CSS when late)
    const N = order.length;
    const tick = () => {
      const t = performance.now() / 1000;
      const b = Math.min(12, Math.max(0, Math.floor((t - 0.05 * kk) / (0.65 * kk / 12)) + 1));
      drawTo(Math.round(N * b / 12));
      if (b < 12) requestAnimationFrame(tick); else Q.boot.stipple = Math.round(performance.now());
    };
    tick();
  } else drawTo(order.length);
  let rt = 0, lastW = window.innerWidth, lastH = stageEl.getBoundingClientRect().height;
  addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      const h = stageEl.getBoundingClientRect().height;
      if (window.innerWidth === lastW && Math.abs(h - lastH) < 1) return;
      lastW = window.innerWidth; lastH = h;
      const n = drawn; layout(); drawTo(Math.max(n, Q.intro ? 0 : order.length) || order.length);
    }, 120);
  });
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
