// The sword's meshes, built from the pure math in sword/geom-core.js (ported from the prototype's geom.js).
// Sword-local frame: x along the blade (tip at +x), y = the face normal (up when it lies flat), z = from the spine
// (z = 0) towards the cutting edge. 1 unit = 10 cm.
//   - The blade is built STRAIGHT (x = s·L_STRAIGHT); its sori is a vertex bend (glsl/bend.glsl, uSori), so the
//     same buffer serves the straight forge blade and the curved finished one. uv = (s, zf), aRegion = facet group
//     (0 mune, 1 shinogi-ji, 2 ji, 3 ha), aAxial = 0 at the kashira end .. 1 at the tip (measured on the bent sword).
//   - The fittings are built in the handle frame (origin at the centre of the blade's base section, x along the
//     base tangent, x < 0 into the grip) and placed by handleMatrix(sigma).
//   - The saya follows the finished arc (sigma = 1).
import { BufferGeometry, Float32BufferAttribute, BufferAttribute, ExtrudeGeometry, Shape, Path, Matrix4, Vector3 } from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import * as G from '../sword/geom-core.js';
import GIRIH from '../sword/girih-holes.json';
import { nakagoAna } from '../sword/drawing.js';

const P = G.PROFILE;

// ---------- the axial coordinate (always measured on the finished sword, sigma = 1) ----------
const AX = (() => { const { K, T } = G.axisEnds(1); const d = [T[0] - K[0], T[1] - K[1]]; return { K, d, L2: d[0] * d[0] + d[1] * d[1] }; })();
export const axialOf = (x, z) => ((x - AX.K[0]) * AX.d[0] + (z - AX.K[1]) * AX.d[1]) / AX.L2;

export function handleMatrix(sigma = 1) {
  const f = G.handleFrame(sigma);
  return new Matrix4().makeBasis(new Vector3(f.ex[0], 0, f.ex[1]), new Vector3(0, 1, 0), new Vector3(f.ez[0], 0, f.ez[1])).setPosition(f.o[0], 0, f.o[1]);
}
const HF1 = handleMatrix(1);
function addAxialH(geo) { // handle-frame geometry: axial from its position on the finished sword
  const p = geo.attributes.position, a = new Float32Array(p.count), v = new Vector3();
  for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).applyMatrix4(HF1); a[i] = axialOf(v.x, v.z); }
  geo.setAttribute('aAxial', new BufferAttribute(a, 1));
  return geo;
}

// ---------- the blade ----------
function catmull(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return [0, 1].map((i) => 0.5 * ((2 * p1[i]) + (-p0[i] + p2[i]) * t + (2 * p0[i] - 5 * p1[i] + 4 * p2[i] - p3[i]) * t2 + (-p0[i] + 3 * p1[i] - 3 * p2[i] + p3[i]) * t3));
}
function jiProfile(n) {
  const pts = [P.shinogi, P.ji1, P.ji2, P.bevel];
  const ext = [[P.shinogi[0] + 0.02, P.shinogi[1] - 0.15], ...pts, [P.bevel[0] - 0.12, P.bevel[1] + 0.1]];
  const out = [];
  for (let seg = 0; seg < 3; seg++) for (let i = 0; i < n; i++) out.push(catmull(ext[seg], ext[seg + 1], ext[seg + 2], ext[seg + 3], i / n));
  out.push(P.bevel);
  return out;
}
function lerpProfile(a, b, n) { const o = []; for (let i = 0; i <= n; i++) o.push([a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n]); return o; }

// one strip = one facet group: smooth inside, hard against its neighbours
function strip(s0, s1, nS, prof, side, region, sDist) {
  const nP = prof.length, pos = [], uv = [], reg = [], ax = [];
  for (let i = 0; i <= nS; i++) {
    let t = i / nS; if (sDist) t = sDist(t);
    const s = s0 + (s1 - s0) * t, k = G.thick(s);
    for (let j = 0; j < nP; j++) {
      const [yf, zf] = prof[j];
      const p = G.bladePoint(s, side * yf * k, zf, 0); // straight
      const q = G.bladePoint(s, 0, zf, 1); // finished, for the axial coordinate
      pos.push(p[0], p[1], p[2]); uv.push(s, zf); reg.push(region); ax.push(axialOf(q[0], q[2]));
    }
  }
  const idx = [];
  for (let i = 0; i < nS; i++) for (let j = 0; j < nP - 1; j++) {
    const a = i * nP + j, b = (i + 1) * nP + j, c = i * nP + j + 1, d = (i + 1) * nP + j + 1;
    if (side > 0) idx.push(a, c, b, c, d, b); else idx.push(a, b, c, c, b, d);
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  g.setAttribute('aRegion', new Float32BufferAttribute(reg, 1));
  g.setAttribute('aAxial', new Float32BufferAttribute(ax, 1));
  g.setIndex(idx); g.computeVertexNormals();
  return g.toNonIndexed();
}
export function buildBlade() {
  const parts = [];
  const groups = [[lerpProfile(P.peak, P.shoulder, 1), 0], [lerpProfile(P.shoulder, P.shinogi, 3), 1], [jiProfile(5), 2], [lerpProfile(P.bevel, P.edge, 1), 3]];
  for (const side of [1, -1]) for (const [prof, region] of groups) {
    parts.push(strip(-0.045, G.B.yk, 260, prof, side, region));
    parts.push(strip(G.B.yk, 1.0, 46, prof, side, region, (t) => 1 - Math.pow(1 - t, 1.6)));
  }
  return mergeGeometries(parts);
}

// ---------- oval tubes along x in the handle frame; radii(t) -> [ry, rz] ----------
function ovalTube(x0, x1, nX, nA, radii) {
  const pos = [], uv = [];
  for (let i = 0; i <= nX; i++) {
    const t = i / nX, x = x0 + (x1 - x0) * t; const [ry, rz] = radii(t);
    for (let j = 0; j <= nA; j++) { const a = (j / nA) * Math.PI * 2; pos.push(x, Math.sin(a) * ry, Math.cos(a) * rz); uv.push(t, j / nA); }
  }
  const idx = [];
  for (let i = 0; i < nX; i++) for (let j = 0; j < nA; j++) { const a = i * (nA + 1) + j, b = (i + 1) * (nA + 1) + j, c = a + 1, d = b + 1; idx.push(a, b, c, c, b, d); }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}
export const buildTsuka = () => addAxialH(ovalTube(G.H.tsuka[0], G.H.tsuka[1], 260, 72, G.tsukaRadii));
export const buildFuchi = () => addAxialH(ovalTube(G.H.fuchi[0], G.H.fuchi[1], 6, 72, (t) => { const b = 1 + 0.03 * Math.sin(Math.PI * t); return [0.129 * b, 0.171 * b]; }));
export const buildKashira = () => addAxialH(ovalTube(G.H.kashira[0], G.H.kashira[1], 24, 72, (t) => { const r = G.kashiraRadius(t) / 0.172; return [0.131 * r, 0.172 * r]; }));

// the habaki: the blade section grown outwards, wedge shaped (thicker at the back)
export function buildHabaki() {
  const [x0, x1] = G.H.habaki, nX = 10;
  const sec = [P.peak, P.shoulder, P.shinogi, P.ji1, P.ji2, P.bevel, P.edge];
  const ring = [];
  for (const sgn of [1, -1]) for (const p of (sgn > 0 ? sec : [...sec].reverse())) ring.push([sgn * p[0], p[1]]);
  const nR = ring.length, pos = [], uv = [];
  for (let i = 0; i <= nX; i++) {
    const t = i / nX, x = x0 + (x1 - x0) * t, grow = 0.022 + 0.012 * (1 - t);
    for (let j = 0; j < nR; j++) { const [yf, zf] = ring[j]; pos.push(x, yf * G.B.k0 + Math.sign(yf) * grow * 0.9, (zf - 0.5) * (G.B.w0 + grow * 2)); uv.push(t, j / (nR - 1)); }
  }
  const idx = [];
  for (let i = 0; i < nX; i++) for (let j = 0; j < nR; j++) { const jn = (j + 1) % nR, a = i * nR + j, b = (i + 1) * nR + j, c = i * nR + jn, d = (i + 1) * nR + jn; idx.push(a, c, b, c, d, b); }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  const ng = geo.toNonIndexed(); ng.computeVertexNormals();
  return addAxialH(ng);
}

// shape (sx, sy, sz) -> handle frame (x = x0 + sz, y = sy, z = sx); the basis change is a reflection, so flip the winding
const SHAPE_TO_H = (x0) => new Matrix4().set(0, 0, 1, x0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1);
function flipWinding(g) {
  const ng = g.index ? g.toNonIndexed() : g;
  for (const k in ng.attributes) {
    const a = ng.attributes[k], n = a.itemSize;
    for (let i = 0; i < a.count; i += 3) for (let c = 0; c < n; c++) { const t = a.array[(i + 1) * n + c]; a.array[(i + 1) * n + c] = a.array[(i + 2) * n + c]; a.array[(i + 2) * n + c] = t; }
  }
  ng.computeVertexNormals();
  return ng;
}
const ccwArea = (p) => { let a = 0; for (let i = 0; i < p.length; i++) { const q = p[i], w = p[(i + 1) % p.length]; a += q[0] * w[1] - w[0] * q[1]; } return a / 2; };

// ---------- the tsuba: girih openwork from the traced polygons (the same ones the drawing and the floor light use) ----------
export function tsubaHoles() {
  // every hole vertex is jittered by ±0.03 mm (hand-filed), seeded so every page load files the same guard
  const rnd = G.mulberry(1418);
  const j = () => (rnd() - 0.5) * 2 * 0.0003;
  const holes = GIRIH.holes.map((h) => h.map(([x, y]) => [x + j(), y + j()]));
  // the nakago-ana from the drawing generator: [z across, y thickness]
  holes.push(nakagoAna().map(([z, y]) => [z, y]));
  return holes.map((h) => (ccwArea(h) < 0 ? h.slice().reverse() : h));
}
export function buildTsuba() {
  const shape = new Shape(), n = 160;
  for (let i = 0; i <= n; i++) { const a = (i / n) * Math.PI * 2, p = [Math.cos(a) * G.TSUBA_R * 1.03, Math.sin(a) * G.TSUBA_R]; if (i === 0) shape.moveTo(p[0], p[1]); else shape.lineTo(p[0], p[1]); }
  for (const h of tsubaHoles()) { const path = new Path(); const r = h.slice().reverse(); r.forEach((p, i) => (i ? path.lineTo(p[0], p[1]) : path.moveTo(p[0], p[1]))); shape.holes.push(path); }
  const [x0, x1] = G.H.tsuba;
  const g = new ExtrudeGeometry(shape, { depth: x1 - x0, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.003, bevelSegments: 2, curveSegments: 4 });
  g.applyMatrix4(SHAPE_TO_H(x0));
  return addAxialH(flipWinding(g));
}
export function buildSeppa(which) {
  const shape = new Shape(), n = 64;
  for (let i = 0; i <= n; i++) { const a = (i / n) * Math.PI * 2, p = [Math.cos(a) * 0.205, Math.sin(a) * 0.112]; if (i === 0) shape.moveTo(p[0], p[1]); else shape.lineTo(p[0], p[1]); }
  const [x0, x1] = G.H[which];
  const g = new ExtrudeGeometry(shape, { depth: x1 - x0, bevelEnabled: false, curveSegments: 2 });
  g.applyMatrix4(SHAPE_TO_H(x0));
  return addAxialH(flipWinding(g));
}
// the mekugi: a bamboo peg through the tsuka, seen as a small disc on each face
export function buildMekugi() {
  // through the grip at the tang's mekugi-ana, standing along y (through both flats); its head just proud of the silk
  const x = -G.NAKAGO.mekugi, r = 0.019, h = G.tsukaRadii((x - G.H.tsuka[0]) / (G.H.tsuka[1] - G.H.tsuka[0]))[0] + 0.006;
  const g = ovalTube(-h, h, 2, 20, () => [r, r]);
  g.applyMatrix4(new Matrix4().makeBasis(new Vector3(0, 1, 0), new Vector3(1, 0, 0), new Vector3(0, 0, -1)).setPosition(x, 0, 0));
  return addAxialH(g);
}

// ---------- the saya: lacquered scabbard along the finished arc ----------
// Its mouth (the horn koiguchi) meets the seppa, so the habaki is hidden inside it; it is 0.10 wider than the blade
// and 0.15 longer; the section is an oval. uv.x = distance from the mouth along the saya (units), uv.y = angle / 2π.
export const SAYA_MOUTH = G.H.seppa1[1] + 0.002; // handle-frame x of the koiguchi face
export function sayaCentre(dist) {
  // a point on the saya's centreline at arc distance `dist` from the mouth (sword-local, sigma = 1)
  const xs = SAYA_MOUTH + dist; // handle-frame x of the corresponding blade station (the blade starts at x = 0)
  const sMax = 1 + G.SAYA.longer / G.L_STRAIGHT;
  const s = Math.min(sMax, xs / G.L_STRAIGHT);
  if (s < 0) { // still in front of the machi: along the base tangent
    const f = G.handleFrame(1); const w = G.B.w0 * 0.5;
    return { p: [f.o[0] + f.ex[0] * xs, f.o[1] + f.ex[1] * xs], t: f.ex, n: f.ez, s, w };
  }
  const c = G.spine(Math.min(s, 1), 1), w = G.width(Math.min(s, G.B.yk)) * 0.5;
  const ex = s > 1 ? (s - 1) * G.L_STRAIGHT : 0;
  return { p: [c.x + c.tx * ex + c.nx * w, c.z + c.tz * ex + c.nz * w], t: [c.tx, c.tz], n: [c.nx, c.nz], s, w };
}
export const SAYA_LEN = (1 + G.SAYA.longer / G.L_STRAIGHT) * G.L_STRAIGHT - SAYA_MOUTH;
export function buildSaya() {
  const nX = 220, nA = 64, pos = [], uv = [];
  for (let i = 0; i <= nX; i++) {
    const t = i / nX, dist = SAYA_LEN * (1 - Math.pow(1 - t, 1.15));
    const c = sayaCentre(dist), sNorm = Math.max(0, c.s);
    let hz = 0.5 * (G.B.w0 + G.SAYA.wider) * (1 - 0.18 * Math.min(1, sNorm)), hy = 0.5 * (G.B.k0 + 0.10) * (1 - 0.22 * Math.min(1, sNorm));
    const q = (dist - (SAYA_LEN - 0.22)) / 0.22; if (q > 0) { const r = Math.sqrt(Math.max(0, 1 - q * q)); hz *= 0.35 + 0.65 * r; hy *= 0.35 + 0.65 * r; } // the kojiri rounds off
    if (i === nX) { hz = 0; hy = 0; }
    for (let j = 0; j <= nA; j++) {
      const a = (j / nA) * Math.PI * 2, cz = Math.cos(a) * hz, sy = Math.sin(a) * hy;
      pos.push(c.p[0] + c.n[0] * cz, sy, c.p[1] + c.n[1] * cz); uv.push(dist, j / nA);
    }
  }
  const idx = [];
  for (let i = 0; i < nX; i++) for (let j = 0; j < nA; j++) { const a = i * (nA + 1) + j, b = (i + 1) * (nA + 1) + j, c = a + 1, d = b + 1; idx.push(a, c, b, c, d, b); }
  // the mouth: a flat ring face (the horn's end grain) closing the tube around the slot for the blade
  const base = pos.length / 3, c0 = sayaCentre(0);
  const hz0 = 0.5 * (G.B.w0 + G.SAYA.wider), hy0 = 0.5 * (G.B.k0 + 0.10);
  for (let j = 0; j <= nA; j++) {
    const a = (j / nA) * Math.PI * 2;
    for (const k of [1, 0.55]) { const cz = Math.cos(a) * hz0 * k, sy = Math.sin(a) * hy0 * (k === 1 ? 1 : 0.45); pos.push(c0.p[0] + c0.n[0] * cz, sy, c0.p[1] + c0.n[1] * cz); uv.push(-0.001, j / nA); }
  }
  for (let j = 0; j < nA; j++) { const a = base + j * 2, b = a + 1, c = a + 2, d = a + 3; idx.push(a, b, c, c, b, d); }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}
// the kurikata: the cord knob on the omote face, a short rounded block a third of the way from the mouth
export function buildKurikata() {
  const d = 0.42, c = sayaCentre(d), hy = 0.5 * (G.B.k0 + 0.10);
  const g = ovalTube(-0.06, 0.06, 12, 32, (t) => { const r = Math.sqrt(Math.max(0, 1 - Math.pow(2 * t - 1, 2))) * 0.9 + 0.1; return [0.035 * r, 0.05 * r]; });
  // orient: x along the saya, the block stands out of the omote face (+y)
  const m = new Matrix4().makeBasis(new Vector3(c.t[0], 0, c.t[1]), new Vector3(c.n[0], 0, c.n[1]), new Vector3(0, 1, 0)).setPosition(c.p[0] + c.n[0] * 0.02, hy * 0.92, c.p[1] + c.n[1] * 0.02);
  g.applyMatrix4(m);
  return g;
}

// ---------- the nakago (tang), in the handle frame: a tapered slab with the mekugi-ana ----------
export function buildNakago() {
  const { top, bot } = G.nakagoOutline(40), n = top.length, pos = [], uv = [];
  const k = (t) => G.B.k0 * (1 - 0.35 * t);
  for (const side of [1, -1]) for (let i = 0; i < n; i++) for (const [x, z] of [top[i], bot[i]]) { const t = i / (n - 1); pos.push(x, side * 0.5 * k(t), z); uv.push(-x / G.NAKAGO.L, (z - top[i][1]) / Math.max(1e-4, bot[i][1] - top[i][1])); }
  const idx = [];
  const at = (side, i, e) => (side ? n * 2 : 0) + i * 2 + e;
  for (let i = 0; i < n - 1; i++) {
    idx.push(at(0, i, 0), at(0, i, 1), at(0, i + 1, 0), at(0, i + 1, 0), at(0, i, 1), at(0, i + 1, 1));
    idx.push(at(1, i, 0), at(1, i + 1, 0), at(1, i, 1), at(1, i + 1, 0), at(1, i + 1, 1), at(1, i, 1));
    for (const e of [0, 1]) { const a = at(0, i, e), b = at(0, i + 1, e), c = at(1, i, e), d = at(1, i + 1, e); if (e) idx.push(a, b, c, c, b, d); else idx.push(a, c, b, c, d, b); }
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  const ng = g.toNonIndexed(); ng.computeVertexNormals();
  return addAxialH(ng);
}

// ---------- the sword's axis and handy points (sword-local, finished sword) ----------
export function axisPoints(sigma = 1) {
  const { K, T } = G.axisEnds(sigma);
  return { K: new Vector3(K[0], 0, K[1]), T: new Vector3(T[0], 0, T[1]) };
}
export function bladeP(s, zf = 0.5, y = 0, sigma = 1) { const p = G.bladePoint(s, y, zf, sigma); return new Vector3(p[0], p[1], p[2]); }
export function handleP(x, z = 0, y = 0, sigma = 1) { const p = G.hp2(x, z, sigma); return new Vector3(p[0], y, p[1]); }
