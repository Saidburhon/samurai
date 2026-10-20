// small shared helpers: easing, segments, DOM reveal masks, convex clipping, cut states
import { makeT, apply } from './kesik.js';
export { makeT, apply };
export const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const seg = (b, a, c) => clamp((b - a) / (c - a));
export const io2 = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
export const io3 = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const out3 = (t) => 1 - Math.pow(1 - t, 3);
export const in2 = (t) => t * t;
export const expoOut = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
export const expoIn = (t) => (t <= 0 ? 0 : Math.pow(2, 10 * (t - 1)));
export const expoIO = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2);
export const OK = 'ʻ';

// affine helpers ([a,b,c,d,e,f]: x' = a x + c y + e, y' = b x + d y + f)
export const I = [1, 0, 0, 1, 0, 0];
export const mul = (P, M) => [P[0] * M[0] + P[2] * M[1], P[1] * M[0] + P[3] * M[1], P[0] * M[2] + P[2] * M[3], P[1] * M[2] + P[3] * M[3], P[0] * M[4] + P[2] * M[5] + P[4], P[1] * M[4] + P[3] * M[5] + P[5]];
export const tr = (x, y) => [1, 0, 0, 1, x, y];
export const rotAbout = (deg, px, py) => makeT({ rot: deg, px, py });
export const css = (M) => `matrix(${M.map((v) => +v.toFixed(5)).join(',')})`;

// convex clipping of a polygon by a half-plane [nx, ny, c] (keep nx*x + ny*y + c >= 0)
export function clipBy(poly, e) {
  const out = []; const f = (p) => e[0] * p[0] + e[1] * p[1] + e[2];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length], fp = f(p), fq = f(q);
    if (fp >= 0) out.push(p);
    if ((fp >= 0) !== (fq >= 0)) { const t = fp / (fp - fq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); }
  }
  return out;
}
export const rectPoly = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
export const polyCss = (poly) => (poly.length < 3 ? 'polygon(0 0, 0 0, 0 0)' : 'polygon(' + poly.map((p) => `${p[0].toFixed(1)}px ${p[1].toFixed(1)}px`).join(',') + ')');
export function halfPlane(a, b, keep = 1, cut = 1) {
  const dx = b[0] - a[0], dy = b[1] - a[1]; const L = Math.hypot(dx, dy);
  let nx = -dy / L, ny = dx / L; if (keep < 0) { nx = -nx; ny = -ny; }
  return [nx, ny, -(nx * a[0] + ny * a[1]), cut];
}
// edges of a convex polygon (inside = towards its centroid); cutTest(i) marks cut edges
export function polyEdges(poly, cutTest = () => 0) {
  const cx = poly.reduce((s, p) => s + p[0], 0) / poly.length, cy = poly.reduce((s, p) => s + p[1], 0) / poly.length;
  const E = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 0.01) continue;
    let e = halfPlane(a, b, 1, cutTest(i, a, b) ? 1 : 0);
    if (e[0] * cx + e[1] * cy + e[2] < 0) e = [-e[0], -e[1], -e[2], e[3]];
    E.push(e);
  }
  return E;
}
// a half-plane edge pushed through an affine map (local -> parent)
export function edgeThrough(e, M) {
  // points on the line and one inside
  const nx = e[0], ny = e[1], c = e[2];
  const p0 = [-nx * c, -ny * c], p1 = [p0[0] - ny * 100, p0[1] + nx * 100], pin = [p0[0] + nx * 10, p0[1] + ny * 10];
  const a = apply(M, p0), b = apply(M, p1), q = apply(M, pin);
  let h = halfPlane(a, b, 1, e[3]); if (h[0] * q[0] + h[1] * q[1] + h[2] < 0) h = [-h[0], -h[1], -h[2], h[3]];
  return h;
}
export const flip = (e) => [-e[0], -e[1], -e[2], e[3]];

// a straight sword cut through a whole scene: glint along P0->P1, then the halves part along the normal
export function cutState(b, o, W, H) {
  const g = seg(b, o.from, o.glintEnd);
  const e = (o.ease || io2)(seg(b, o.sepStart, o.to));
  const [P0, P1] = o.line;
  const dx = P1[0] - P0[0], dy = P1[1] - P0[1], L = Math.hypot(dx, dy);
  const n = [-dy / L, dx / L];
  const mid = [(P0[0] + P1[0]) / 2, (P0[1] + P1[1]) / 2];
  const dA = o.distA ?? o.dist, dB = o.distB ?? o.dist;
  const slideA = o.slideA ? o.slideA(b) : 0, slideB = o.slideB ? o.slideB(b) : 0;
  const u = [dx / L, dy / L];
  const MA = mul(tr(n[0] * dA * e + u[0] * slideA, n[1] * dA * e + u[1] * slideA), rotAbout((o.rotA ?? o.rot) * e + (o.twistA ? o.twistA(b) : 0), mid[0], mid[1]));
  const MB = mul(tr(-n[0] * dB * e + u[0] * slideB, -n[1] * dB * e + u[1] * slideB), rotAbout(-(o.rotB ?? o.rot) * e + (o.twistB ? o.twistB(b) : 0), mid[0], mid[1]));
  const eA = halfPlane(P0, P1, 1, 1), eB = halfPlane(P0, P1, -1, 1);
  const big = rectPoly(-W, -H, W * 3, H * 3);
  const pieces = [
    { edges: [eA], M: MA, domPoly: clipBy(big, eA) },
    { edges: [eB], M: MB, domPoly: clipBy(big, eB) },
  ];
  let under = rectPoly(0, 0, W, H);
  under = clipBy(under, flip(edgeThrough(eA, MA)));
  under = clipBy(under, flip(edgeThrough(eB, MB)));
  const open = e > 0.0005 || slideA || slideB;
  return {
    pieces: open ? pieces : null,
    under: open ? under : [],
    glint: g > 0 && g < 1 ? { P0: o.glintFrom || P0, P1: o.glintTo || P1, t: g } : null,
    e, g,
  };
}

// brush-written reveal of a DOM text block (a soft mask sweeping in the writing direction)
export function reveal(el, p, dir = 'x') {
  if (!el) return;
  if (p >= 1) { if (el._rv !== 1) { el.style.webkitMaskImage = el.style.maskImage = ''; el.style.opacity = ''; el._rv = 1; } return; }
  el._rv = p;
  if (p <= 0) { el.style.opacity = '0'; return; }
  el.style.opacity = '';
  const a = (p * 130 - 30).toFixed(1), b = (p * 130).toFixed(1);
  const m = `linear-gradient(${dir === 'x' ? '90deg' : '180deg'}, #000 ${a}%, transparent ${b}%)`;
  el.style.webkitMaskImage = m; el.style.maskImage = m;
}
export function show(el, on) { if (el && el._on !== on) { el.style.visibility = on ? '' : 'hidden'; el._on = on; } }
export function setT(el, t) { if (el && el._t !== t) { el.style.transform = t; el._t = t; } }
export function setClip(el, c) { if (el && el._c !== c) { el.style.clipPath = c; el.style.webkitClipPath = c; el._c = c; } }
export function place(el, x, y) { if (el) { el.style.left = x.toFixed(1) + 'px'; el.style.top = y.toFixed(1) + 'px'; } }
// cached element refs per root (original section or its clone)
const refCache = new WeakMap();
export function refs(root, map) {
  let r = refCache.get(root);
  if (!r) { r = {}; refCache.set(root, r); }
  for (const k in map) if (!(k in r)) { const sel = map[k]; r[k] = sel.endsWith('*') ? [...root.querySelectorAll(sel.slice(0, -1))] : root.querySelector(sel); }
  return r;
}
