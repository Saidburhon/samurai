// The ink layer in cinema mode (§3.8): the drawing lies on the paper (y = 0) under the sword, so for any straight-down
// camera the paper is a similarity of the screen and the inline SVG stays exact under one CSS matrix() on its HTML
// wrapper. The stipple is redrawn crisp from its dot list in sword space; the reveal clips the ink along the axial
// front and draws the luminous front (svg#front).
import * as G from '../sword/geom-core.js';
import { stipple, frame, SC, WEIGHTS } from '../sword/drawing.js';
import { stipSurface } from './stipsurface.js';

const NS = 'http://www.w3.org/2000/svg';
const { K, T } = G.axisEnds(1);
const LKT = Math.hypot(T[0] - K[0], T[1] - K[1]) * SC;
// the bookend drawing runs from K to the kojiri J, the Yaki plan from the machi to the tip of the straight blade
const LKJ = () => { const J = G.kojiriEnd(1); return Math.hypot(J[0] - K[0], J[1] - K[1]) * SC; };
const LPLAN = () => { const a = G.bp2(0, 0, 0), b = G.bp2(1, 0, 0); return Math.hypot(b[0] - a[0], b[1] - a[1]) * SC; };
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
    this.paper = document.getElementById('osh-paper');
    this.svg = document.getElementById('osh');
    this.stip = document.getElementById('stip');
    this.front = document.getElementById('front');
    // the luminous front lies over the steel (the prototype's #frontfx, z 3 above the canvas): its streak crosses the
    // blade and flares past both edges. In the markup it sits in #ink (z 1, under #gl), where the steel hid it; it is
    // moved next to the canvas, in the same box (#ink is inset 0 in #stage)
    const gl = document.getElementById('gl');
    if (this.front && gl && this.front.parentNode !== gl.parentNode) gl.after(this.front);
    const vb = (this.svg.getAttribute('viewBox') || '-60 -450 1402 565').split(/\s+/).map(Number);
    this.vb = vb;
    this.hero = document.getElementById('osh-hero');
    this.blade = this.hero && this.hero.querySelectorAll('.o-blade, .o-kosh');
  }
  // place the drawing for a td camera and a pose; reveal < 1.5 clips it along the axial front
  place(stage, pose, { reveal = 2, front = 0, show = true, annot = true } = {}) {
    const W = stage.w, H = stage.h, td = stage.td;
    if (!this.hair) { hairlines(); this.hair = true; }
    if (!show || !td) { this.paper.style.visibility = 'hidden'; this.stip.style.visibility = 'hidden'; this.front.style.visibility = 'hidden'; this.frontOn = false; return; }
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
    // the matrix takes over from the build's placement (cinema.css: html.osh-set)
    document.documentElement.classList.add('osh-set');
    st.setProperty('--osh-rot', `${(ang * 180 / Math.PI).toFixed(3)}deg`);
    st.setProperty('--ik', (1 / k).toFixed(5));
    this.m = { e0, ex, ey, k };
    // the reveal: the ink of the sword is clipped where the steel has arrived (u < reveal · LKT)
    this.clip(reveal < 1.5 ? reveal * LKT : null);
    this.drawStipple(stage, reveal);
    this.drawFront(stage, reveal, front, S);
  }
  // G3, the film (scenes/frame.js), every frame: which drawing lies on the paper ('hero', 'saya' for the bookend,
  // 'plan' for Yaki), its opacity, the reveal. crisp (inside a hold window): the stipple is redrawn from its dot list;
  // between holds it keeps its last raster, moved by the change of the paper's matrix (one CSS matrix, no redraw).
  film(stage, pose, { draw = 'hero', alpha = 1, reveal = 2, front = 0, annot = true, crisp = true } = {}) {
    const td = stage.td, W = stage.w, H = stage.h;
    if (!this.hair) { hairlines(); this.hair = true; }
    if (!this.groups) this.groups = { hero: this.hero, plan: document.getElementById('osh-plan'), saya: document.getElementById('osh-saya') };
    if (!pose || !td || alpha <= 0.002) {
      if (this.shown !== false) { this.paper.style.visibility = 'hidden'; this.stip.style.visibility = 'hidden'; this.front.style.visibility = 'hidden'; this.frontOn = false; this.shown = false; }
      return;
    }
    if (this.shown !== true) { this.paper.style.visibility = ''; this.shown = true; }
    if (this.draw !== draw) {
      for (const [k, g] of Object.entries(this.groups)) if (g) g.toggleAttribute('hidden', k !== draw);
      this.draw = draw; this.stipM = null;
    }
    this.paper.style.opacity = alpha < 0.999 ? alpha.toFixed(3) : '';
    this.paper.classList.toggle('no-annot', !annot || draw !== 'hero');
    const S = (u, v) => { const p = svgToPaper(pose, u, v); return paperToScreen(td, W, H, p[0], p[1]); };
    const e0 = S(0, 0), eu = S(1, 0), ev = S(0, 1);
    const ex = [eu[0] - e0[0], eu[1] - e0[1]], ey = [ev[0] - e0[0], ev[1] - e0[1]];
    const [vx, vy] = this.vb;
    const tx = e0[0] + vx * ex[0] + vy * ey[0], ty = e0[1] + vx * ex[1] + vy * ey[1];
    const k = Math.hypot(ex[0], ex[1]), ang = Math.atan2(ex[1], ex[0]);
    const st = this.paper.style, mtx = `matrix(${ex[0]},${ex[1]},${ey[0]},${ey[1]},${tx},${ty})`;
    if (this.mtx !== mtx) {
      st.transform = mtx; this.mtx = mtx;
      document.documentElement.classList.add('osh-set');
      st.setProperty('--osh-rot', `${(ang * 180 / Math.PI).toFixed(3)}deg`);
      st.setProperty('--ik', (1 / k).toFixed(5));
    }
    // while the matrix changes the wrapper is a layer; at rest it re-rasterises crisp (§3.8)
    st.willChange = crisp ? '' : 'transform';
    this.m = { e0, ex, ey, k };
    const u0 = reveal < 1.5 ? reveal * LKT : null;
    const blade = draw === 'hero' ? this.blade : draw === 'saya' && this.groups.saya ? this.groups.saya.children : [];
    this.clipOn(blade, draw === 'saya' && u0 != null ? reveal * (this.lkj || (this.lkj = LKJ())) : u0);
    if (draw === 'hero') {
      this.stip.style.visibility = '';
      // the stipple is never clipped in the film: the steel is drawn over the ink wherever it has arrived (#gl lies
      // above #ink), so the dots behind the front are hidden by the steel itself. It is drawn once per placement, not
      // once per frame of a reveal (G1 r2: each redraw uploaded a full-screen canvas into the GPU process between
      // two frames of the steel, and the reveal's frames queued behind it)
      const ku = -1;
      if (crisp || !this.stipM || ku !== this.stipU) {
        this.drawStipple(stage, 2); this.stipM = { e0, ex, ey }; this.stipU = ku; this.stip.style.transform = '';
      } else {
        // the delta from the drawn matrix to this one: q = e0 + A·A0⁻¹·(q0 − e0')
        const { e0: f0, ex: a, ey: b } = this.stipM, det = a[0] * b[1] - b[0] * a[1] || 1;
        const i00 = b[1] / det, i01 = -b[0] / det, i10 = -a[1] / det, i11 = a[0] / det;
        const L00 = ex[0] * i00 + ey[0] * i10, L01 = ex[0] * i01 + ey[0] * i11, L10 = ex[1] * i00 + ey[1] * i10, L11 = ex[1] * i01 + ey[1] * i11;
        const t0 = e0[0] - (L00 * f0[0] + L01 * f0[1]), t1 = e0[1] - (L10 * f0[0] + L11 * f0[1]);
        this.stip.style.transformOrigin = '0 0';
        this.stip.style.transform = `matrix(${L00},${L10},${L01},${L11},${t0},${t1})`;
      }
      this.drawFront(stage, reveal, front, S);
    } else {
      this.stip.style.visibility = 'hidden';
      if (this.frontOn !== false) { this.front.style.visibility = 'hidden'; this.frontOn = false; }
    }
  }
  clipOn(els, u0) {
    if (this.clipEls && this.clipEls !== els) for (const g of this.clipEls) g.removeAttribute('clip-path');
    this.clipEls = els;
    const keep = this.blade; this.blade = els;
    this.clip(u0);
    this.blade = keep;
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
    const surf = stipSurface(cv); // the boot script's surface: a CPU canvas presented as one texture
    surf.size(Math.round(W * dpr), Math.round(H * dpr));
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    const ctx = surf.ctx;
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
    surf.present();
  }
  // the luminous front where ink turns into steel (prototype oshigata.js). Its picture is drawn once (two blurred
  // strokes and a hairline across the blade, in a box of its own); each frame only moves it with one CSS transform
  // (a compositor layer: G1 r2, the blur filters were re-rasterised in the GPU process at every frame of the reveal)
  drawFront(stage, reveal, front, S) {
    const fr = this.front;
    if (!(reveal < 1.5) || !front) { if (this.frontOn !== false) { fr.style.visibility = 'hidden'; this.frontOn = false; } return; }
    // the blade station at the front: the axis point at reveal, and the blade's width across it
    const F = frame(K, T);
    let s = 0.5; for (let i = 0; i < 30; i++) { const p = F(G.bp2(s, 0.5, 1)); s += (reveal * LKT - p[0]) / LKT * 1.4; s = Math.min(0.995, Math.max(0.005, s)); }
    const sp = F(G.bp2(s, 0, 1)), ed = F(G.bp2(s, 1, 1)), mid = F(G.bp2(s, 0.5, 1));
    const cen = S(reveal * LKT, mid[1]), a = S(reveal * LKT, sp[1]), b = S(reveal * LKT, ed[1]);
    const wpx = Math.hypot(a[0] - b[0], a[1] - b[1]) || 1;
    const ang = Math.atan2(a[1] - b[1], a[0] - b[0]);
    // the picture, for the blade's width at mid-length (rebuilt when the stage's size changes)
    const key = `${stage.w}x${stage.h}`;
    if (this.frontKey !== key) {
      this.frontKey = key;
      const w0 = this.frontW0 = wpx, half = 1.6 * w0, pad = 40, f1 = (v) => v.toFixed(1);
      this.frontBox = [half + pad, pad];
      fr.setAttribute('viewBox', `${f1(-half - pad)} ${-pad} ${f1(2 * (half + pad))} ${2 * pad}`);
      fr.setAttribute('width', f1(2 * (half + pad))); fr.setAttribute('height', String(2 * pad));
      fr.innerHTML = `<defs><linearGradient id="fg" gradientUnits="userSpaceOnUse" x1="${f1(half)}" y1="0" x2="${f1(-half)}" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <filter id="fb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>
      <filter id="fb2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter></defs>
      <g class="front"><path d="M${f1(half)} 0L${f1(-half)} 0" stroke="url(#fg)" stroke-width="26" filter="url(#fb)" opacity=".9"/>
      <path d="M${f1(half)} 0L${f1(-half)} 0" stroke="url(#fg)" stroke-width="7" filter="url(#fb2)"/>
      <path d="M${f1(0.75 * w0)} 0L${f1(-0.75 * w0)} 0" stroke="#fff" stroke-width="1.4"/></g>`;
      fr.style.transformOrigin = '0 0'; fr.style.willChange = 'transform, opacity';
    }
    const [bx, by] = this.frontBox, k = wpx / this.frontW0;
    fr.style.transform = `translate(${cen[0].toFixed(1)}px,${cen[1].toFixed(1)}px) rotate(${ang.toFixed(4)}rad) scaleX(${k.toFixed(4)}) translate(${-bx}px,${-by}px)`;
    fr.style.opacity = front.toFixed(3);
    if (this.frontOn !== true) { fr.style.visibility = ''; this.frontOn = true; }
  }
  // the screen point of a sword-space paper point under the current placement (for labels)
  screenOf(u, v) { const { e0, ex, ey } = this.m; return [e0[0] + u * ex[0] + v * ey[0], e0[1] + u * ex[1] + v * ey[1]]; }
}
export { LKT, LKJ, LPLAN };
