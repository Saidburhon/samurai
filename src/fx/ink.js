// The ink layer in cinema mode (§3.8): the drawing lies on the paper (y = 0) under the sword, so for any straight-down
// camera the paper is a similarity of the screen and the inline SVG stays exact under one CSS matrix() on its HTML
// wrapper. The stipple is redrawn crisp from its dot list in sword space; the reveal clips the ink along the axial
// front and draws the luminous front (svg#front).
import * as G from '../sword/geom-core.js';
import { stipple, frame, SC, WEIGHTS } from '../sword/drawing.js';

const NS = 'http://www.w3.org/2000/svg';
const { K, T } = G.axisEnds(1);
const LKT = Math.hypot(T[0] - K[0], T[1] - K[1]) * SC;
let dots = null;

// paper (x, z) -> screen px, for a solved td camera; and back
export const paperToScreen = (td, W, H, x, z) => { const k = td.f / td.Hc, dx = x - td.C.x, dz = z - td.C.z; return [W / 2 + k * (dx * td.r.x + dz * td.r.z), H / 2 + k * (dx * td.d.x + dz * td.d.z)]; };
export const screenToPaper = (td, W, H, sx, sy) => { const k = td.Hc / td.f, a = (sx - W / 2) * k, b = (sy - H / 2) * k; return [td.C.x + td.r.x * a + td.d.x * b, td.C.z + td.r.z * a + td.d.z * b]; };

// the drawing's pose on the paper, from a framing: its K and T land on the sword's screen K and T plus an offset
export function inkPose(td, W, H, Ks, Ts, off = [0, 0], scaleOff = 1) {
  const o = [off[0] * scaleOff, off[1] * scaleOff];
  const Kp = screenToPaper(td, W, H, Ks[0] + o[0], Ks[1] + o[1]), Tp = screenToPaper(td, W, H, Ts[0] + o[0], Ts[1] + o[1]);
  return { O: Kp, a: Math.atan2(Tp[1] - Kp[1], Tp[0] - Kp[0]), k: Math.hypot(Tp[0] - Kp[0], Tp[1] - Kp[1]) / (LKT / SC) };
}
// svg (u, v) -> paper (x, z) for a pose
const svgToPaper = (pose, u, v) => { const c = Math.cos(pose.a), s = Math.sin(pose.a), k = pose.k / SC; return [pose.O[0] + (u * c - v * s) * k, pose.O[1] + (u * s + v * c) * k]; };

// In the film the drawing's strokes do not scale (vector-effect: non-scaling-stroke), so a 0.5–0.9 CSS px hairline
// is 0.4–0.7 device px at DPR 0.75: rasterised with multisampling it breaks into dots along a diagonal. Each weight
// under one device px is widened to one and dimmed by the same factor (the AA contract of §2.1, for the ink).
function hairlines() {
  const dpr = window.devicePixelRatio || 1, px = (1 / dpr).toFixed(3);
  const rules = Object.entries({ ...WEIGHTS, dot: [1.1, 0.55] }).map(([k, [w, o]]) => (w * dpr < 1 ? `html.cinema #osh .${k}{stroke-width:${px}px;opacity:${(o * w * dpr).toFixed(3)}}` : '')).join('');
  let el = document.getElementById('osh-hair');
  if (!el) { el = document.createElement('style'); el.id = 'osh-hair'; document.head.appendChild(el); }
  if (el.textContent !== rules) el.textContent = rules;
}

export class Ink {
  constructor() {
    hairlines();
    this.paper = document.getElementById('osh-paper');
    this.svg = document.getElementById('osh');
    this.stip = document.getElementById('stip');
    this.front = document.getElementById('front');
    const vb = (this.svg.getAttribute('viewBox') || '-60 -450 1402 565').split(/\s+/).map(Number);
    this.vb = vb;
    this.hero = document.getElementById('osh-hero');
    this.blade = this.hero && this.hero.querySelectorAll('.o-blade, .o-kosh');
  }
  // place the drawing for a td camera and a pose; reveal < 1.5 clips it along the axial front
  place(stage, pose, { reveal = 2, front = 0, show = true, annot = true } = {}) {
    const W = stage.w, H = stage.h, td = stage.td;
    if (!show || !td) { this.paper.style.visibility = 'hidden'; this.stip.style.visibility = 'hidden'; this.front.innerHTML = ''; return; }
    this.paper.style.visibility = ''; this.stip.style.visibility = '';
    // the dimension lines, their labels and the face-on tsuba belong to the hero poster: they leave with the h1
    this.paper.classList.toggle('no-annot', !annot);
    const S = (u, v) => { const p = svgToPaper(pose, u, v); return paperToScreen(td, W, H, p[0], p[1]); };
    const e0 = S(0, 0), eu = S(1, 0), ev = S(0, 1);
    const ex = [eu[0] - e0[0], eu[1] - e0[1]], ey = [ev[0] - e0[0], ev[1] - e0[1]];
    const [vx, vy] = this.vb;
    const tx = e0[0] + vx * ex[0] + vy * ey[0], ty = e0[1] + vx * ex[1] + vy * ey[1];
    const k = Math.hypot(ex[0], ex[1]), ang = Math.atan2(ex[1], ex[0]);
    const st = this.paper.style;
    st.transform = `matrix(${ex[0]},${ex[1]},${ey[0]},${ey[1]},${tx},${ty})`;
    st.setProperty('--osh-rot', `${(ang * 180 / Math.PI).toFixed(3)}deg`);
    st.setProperty('--ik', (1 / k).toFixed(5));
    this.m = { e0, ex, ey, k };
    // the reveal: the ink of the sword is clipped where the steel has arrived (u < reveal · LKT)
    this.clip(reveal < 1.5 ? reveal * LKT : null);
    this.drawStipple(stage, reveal);
    this.drawFront(stage, reveal, front, S);
  }
  clip(u0) {
    let cp = this.svg.querySelector('#rvclip');
    if (u0 == null) { for (const g of this.blade) g.removeAttribute('clip-path'); return; }
    if (!cp) {
      let defs = this.svg.querySelector('defs'); if (!defs) { defs = document.createElementNS(NS, 'defs'); this.svg.prepend(defs); }
      cp = document.createElementNS(NS, 'clipPath'); cp.id = 'rvclip';
      cp.setAttribute('clipPathUnits', 'userSpaceOnUse');
      cp.appendChild(document.createElementNS(NS, 'rect'));
      defs.appendChild(cp);
    }
    const r = cp.firstChild;
    r.setAttribute('x', u0.toFixed(2)); r.setAttribute('y', '-4000'); r.setAttribute('width', '8000'); r.setAttribute('height', '8000');
    for (const g of this.blade) g.setAttribute('clip-path', 'url(#rvclip)');
  }
  drawStipple(stage, reveal) {
    if (!dots) {
      const st = stipple({ count: stage.h > stage.w ? 5000 : 9000 });
      const F = frame(K, T);
      dots = st.s.map((s, i) => { const p = F(G.bp2(s, st.v[i], 1)); return [p[0], p[1], st.r[i], st.a[i]]; });
    }
    const dpr = Math.min(2, window.devicePixelRatio || 1); // one canvas px per device px, as boot.js
    const W = stage.w, H = stage.h, cv = this.stip;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    const ctx = cv.getContext('2d', { willReadFrequently: true }); // a CPU canvas, as the boot script made it
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0F0E0C';
    const { e0, ex, ey, k } = this.m, u0 = reveal < 1.5 ? reveal * LKT : -1e9;
    for (const [u, v, r, a] of dots) {
      if (u < u0) continue;
      const x = e0[0] + u * ex[0] + v * ey[0], y = e0[1] + u * ex[1] + v * ey[1];
      if (x < -4 || y < -4 || x > W + 4 || y > H + 4) continue;
      ctx.globalAlpha = a;
      ctx.beginPath(); ctx.arc(x, y, Math.min(2.2, Math.max(0.35, r * k)), 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  // the luminous front where ink turns into steel (prototype oshigata.js)
  drawFront(stage, reveal, front, S) {
    const fr = this.front, W = stage.w, H = stage.h;
    fr.setAttribute('viewBox', `0 0 ${W} ${H}`); fr.setAttribute('width', W); fr.setAttribute('height', H);
    if (!(reveal < 1.5) || !front) { fr.innerHTML = ''; return; }
    // the blade station at the front: the axis point at reveal, and the blade's width across it
    const F = frame(K, T);
    let s = 0.5; for (let i = 0; i < 30; i++) { const p = F(G.bp2(s, 0.5, 1)); s += (reveal * LKT - p[0]) / LKT * 1.4; s = Math.min(0.995, Math.max(0.005, s)); }
    const sp = F(G.bp2(s, 0, 1)), ed = F(G.bp2(s, 1, 1)), mid = F(G.bp2(s, 0.5, 1));
    const cen = S(reveal * LKT, mid[1]), a = S(reveal * LKT, sp[1]), b = S(reveal * LKT, ed[1]);
    const wpx = Math.hypot(a[0] - b[0], a[1] - b[1]);
    const n = [(a[0] - b[0]) / (wpx || 1), (a[1] - b[1]) / (wpx || 1)];
    const P = (t) => [cen[0] + n[0] * wpx * t, cen[1] + n[1] * wpx * t];
    const f1 = (v) => v.toFixed(1);
    const [h1, h2, g1, g2] = [P(1.6), P(-1.6), P(0.75), P(-0.75)];
    fr.innerHTML = `<defs><linearGradient id="fg" gradientUnits="userSpaceOnUse" x1="${f1(h1[0])}" y1="${f1(h1[1])}" x2="${f1(h2[0])}" y2="${f1(h2[1])}">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <filter id="fb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>
      <filter id="fb2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter></defs>
      <g class="front" opacity="${front}"><path d="M${f1(h1[0])} ${f1(h1[1])}L${f1(h2[0])} ${f1(h2[1])}" stroke="url(#fg)" stroke-width="26" filter="url(#fb)" opacity=".9"/>
      <path d="M${f1(h1[0])} ${f1(h1[1])}L${f1(h2[0])} ${f1(h2[1])}" stroke="url(#fg)" stroke-width="7" filter="url(#fb2)"/>
      <path d="M${f1(g1[0])} ${f1(g1[1])}L${f1(g2[0])} ${f1(g2[1])}" stroke="#fff" stroke-width="1.4"/></g>`;
  }
  // the screen point of a sword-space paper point under the current placement (for labels)
  screenOf(u, v) { const { e0, ex, ey } = this.m; return [e0[0] + u * ex[0] + v * ey[0], e0[1] + u * ex[1] + v * ey[1]]; }
}
export { LKT };
