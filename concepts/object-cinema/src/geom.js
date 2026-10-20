// Procedural katana. Units: 1 = 10 cm.
// Sword-local frame: x along the blade (tip at +x), y = face normal (towards camera when lying flat),
// z = from spine (z = 0) towards the cutting edge (z = +w).
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export const B = { L: 7.0, sori: 0.18, w0: 0.32, w1: 0.22, k0: 0.078, k1: 0.056, yk: 0.93 };

// ---------- shared noise (same formulas as GLSL) ----------
const fract = (x) => x - Math.floor(x);
export const hash1 = (n) => fract(Math.sin(n * 12.9898) * 43758.5453);
function noise1(x) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return hash1(i) * (1 - u) + hash1(i + 1) * u; }
export function fbm1(x) { let a = 0.5, s = 0; for (let i = 0; i < 4; i++) { s += a * noise1(x); x = x * 2.03 + 17.1; a *= 0.5; } return s / 0.9375; }
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// hamon boundary, v: 0 spine .. 1 edge (identical in GLSL)
export function hamonV(u) {
  const T = 6.283185;
  let n = 0.70 + 0.040 * Math.sin(T * 5.3 * u + 0.8)
    + 0.022 * Math.sin(T * 13.1 * u + 2.3)
    + 0.018 * (fbm1(u * 38.0) - 0.5)
    + 0.030 * Math.pow(Math.max(0, Math.sin(T * 9.0 * u + 1.1)), 6.0);
  n = 0.80 + (n - 0.80) * smooth(0.0, 0.06, u);
  return n + (0.25 - n) * smooth(0.975, 1.0, u);
}

// ---------- blade centreline ----------
export function spine(s) {
  const x = B.L * s, z = B.sori * 4 * s * (1 - s);
  const dx = B.L, dz = B.sori * 4 * (1 - 2 * s), l = Math.hypot(dx, dz);
  return { x, z, tx: dx / l, tz: dz / l, nx: -dz / l, nz: dx / l };
}
export function width(s) {
  if (s <= B.yk) return B.w0 + (B.w1 - B.w0) * (s / B.yk);
  const q = (s - B.yk) / (1 - B.yk);
  return B.w1 * Math.sqrt(Math.max(0, 1 - q * q));
}
export function thick(s) {
  if (s <= B.yk) return B.k0 + (B.k1 - B.k0) * (s / B.yk);
  const q = (s - B.yk) / (1 - B.yk);
  return B.k1 * (0.12 + 0.88 * Math.sqrt(Math.max(0, 1 - q * q)));
}
// point on the blade: y in absolute units, zf as fraction of width (0 spine .. 1 edge)
export function bladePoint(s, y, zf) {
  const c = spine(s), w = width(s);
  // in the kissaki the spine itself curves gently down to meet the point
  let drop = 0;
  if (s > B.yk) { const q = (s - B.yk) / (1 - B.yk); drop = B.w1 * 0.10 * q * q; }
  const zz = zf * w + drop;
  return [c.x + c.nx * zz, y, c.z + c.nz * zz];
}

// cross-section profile [yFrac of half... (of k), zFrac of w]
const P = {
  peak: [0, 0], shoulder: [0.35, 0.035], shinogi: [0.5, 0.28],
  ji1: [0.46, 0.45], ji2: [0.33, 0.72], bevel: [0.12, 0.93], edge: [0, 1.0],
};
function catmull(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return [0, 1].map((i) => 0.5 * ((2 * p1[i]) + (-p0[i] + p2[i]) * t + (2 * p0[i] - 5 * p1[i] + 4 * p2[i] - p3[i]) * t2 + (-p0[i] + 3 * p1[i] - 3 * p2[i] + p3[i]) * t3));
}
function jiProfile(n) {
  const pts = [P.shinogi, P.ji1, P.ji2, P.bevel];
  const ext = [[P.shinogi[0] + 0.02, P.shinogi[1] - 0.15], ...pts, [P.bevel[0] - 0.12, P.bevel[1] + 0.1]];
  const out = [];
  for (let seg = 0; seg < 3; seg++) {
    for (let i = 0; i < n; i++) out.push(catmull(ext[seg], ext[seg + 1], ext[seg + 2], ext[seg + 3], i / n));
  }
  out.push(P.bevel);
  return out;
}
function lerpProfile(a, b, n) { const o = []; for (let i = 0; i <= n; i++) o.push([a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n]); return o; }

// one strip = one facet group, smooth inside, hard against its neighbours
function strip(s0, s1, nS, prof, side, region, sDist) {
  const nP = prof.length;
  const pos = [], uv = [], reg = [];
  for (let i = 0; i <= nS; i++) {
    let t = i / nS; if (sDist) t = sDist(t);
    const s = s0 + (s1 - s0) * t, k = thick(s);
    for (let j = 0; j < nP; j++) {
      const [yf, zf] = prof[j];
      const p = bladePoint(s, side * yf * k, zf);
      pos.push(p[0], p[1], p[2]); uv.push(s, zf); reg.push(region);
    }
  }
  const idx = [];
  for (let i = 0; i < nS; i++) for (let j = 0; j < nP - 1; j++) {
    const a = i * nP + j, b = (i + 1) * nP + j, c = i * nP + j + 1, d = (i + 1) * nP + j + 1;
    if (side > 0) idx.push(a, c, b, c, d, b); else idx.push(a, b, c, c, b, d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute('aRegion', new THREE.Float32BufferAttribute(reg, 1));
  g.setIndex(idx); g.computeVertexNormals();
  return g.toNonIndexed ? g : g;
}

export function buildBlade() {
  const parts = [];
  const groups = [
    [lerpProfile(P.peak, P.shoulder, 1), 0],
    [lerpProfile(P.shoulder, P.shinogi, 3), 1],
    [jiProfile(5), 2],
    [lerpProfile(P.bevel, P.edge, 1), 3],
  ];
  for (const side of [1, -1]) for (const [prof, region] of groups) {
    parts.push(strip(-0.045, B.yk, 230, prof, side, region));
    parts.push(strip(B.yk, 1.0, 46, prof, side, region, (t) => 1 - Math.pow(1 - t, 1.6)));
  }
  const g = mergeGeometries(parts.map((p) => { const q = p.toNonIndexed(); return q; }));
  return g;
}

// ---------- the handle frame ----------
// origin at the centre of the blade's base section, x along the base tangent (towards the tip)
export function handleFrame() {
  const c = spine(0), w = width(0);
  const o = new THREE.Vector3(c.x + c.nx * w * 0.5, 0, c.z + c.nz * w * 0.5);
  const ex = new THREE.Vector3(c.tx, 0, c.tz), ey = new THREE.Vector3(0, 1, 0), ez = new THREE.Vector3(c.nx, 0, c.nz);
  const m = new THREE.Matrix4().makeBasis(ex, ey, ez).setPosition(o);
  return m;
}
export const H = { habaki: [-0.30, 0.035], seppa1: [-0.315, -0.30], tsuba: [-0.365, -0.315], seppa2: [-0.38, -0.365], fuchi: [-0.43, -0.38], tsuka: [-2.93, -0.43], kashira: [-3.04, -2.93] };
export const TSUBA_R = 0.39;

// oval tube along x in the handle frame; radii fn(t) -> [ry, rz]
function ovalTube(x0, x1, nX, nA, radii, capEnds) {
  const pos = [], uv = [];
  for (let i = 0; i <= nX; i++) {
    const t = i / nX, x = x0 + (x1 - x0) * t; const [ry, rz] = radii(t);
    for (let j = 0; j <= nA; j++) {
      const a = (j / nA) * Math.PI * 2;
      pos.push(x, Math.sin(a) * ry, Math.cos(a) * rz); uv.push(t, j / nA);
    }
  }
  const idx = [];
  for (let i = 0; i < nX; i++) for (let j = 0; j < nA; j++) {
    const a = i * (nA + 1) + j, b = (i + 1) * (nA + 1) + j, c = a + 1, d = b + 1;
    idx.push(a, b, c, c, b, d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

export function buildTsuka() {
  const [x0, x1] = H.tsuka;
  // x0 is the kashira end, x1 the fuchi end. Slight waist, slightly fuller at the kashira.
  return ovalTube(x0, x1, 260, 72, (t) => {
    const waist = 1 - 0.055 * Math.sin(Math.PI * Math.min(1, Math.max(0, (t - 0.05) / 0.9)));
    const taper = 1 + 0.03 * (1 - t);
    return [0.122 * waist * taper, 0.163 * waist * taper];
  });
}
export function buildFuchi() {
  const [x0, x1] = H.fuchi;
  return ovalTube(x0, x1, 6, 72, (t) => { const b = 1 + 0.03 * Math.sin(Math.PI * t); return [0.129 * b, 0.171 * b]; });
}
export function buildKashira() {
  const [x0, x1] = H.kashira;
  return ovalTube(x0, x1, 24, 72, (t) => {
    // rounded dome at the far end (t = 0)
    const r = Math.sqrt(Math.max(0, 1 - Math.pow(1 - Math.min(1, t / 0.55), 2)));
    const f = 0.25 + 0.75 * r;
    return [0.131 * f, 0.172 * f];
  });
}

// habaki: blade section grown outwards, wedge shaped (thicker at the back)
export function buildHabaki() {
  const [x0, x1] = H.habaki;
  const nX = 10, prof = [];
  const sec = [P.peak, P.shoulder, P.shinogi, P.ji1, P.ji2, P.bevel, P.edge];
  const g = [];
  const pos = [], uv = [];
  const ring = [];
  for (const sgn of [1, -1]) {
    const arr = sgn > 0 ? sec : [...sec].reverse();
    for (const p of arr) ring.push([sgn * p[0], p[1]]);
  }
  const nR = ring.length;
  for (let i = 0; i <= nX; i++) {
    const t = i / nX, x = x0 + (x1 - x0) * t;
    const grow = 0.022 + 0.012 * (1 - t);
    for (let j = 0; j < nR; j++) {
      const [yf, zf] = ring[j];
      const y = yf * B.k0 * 2 * 0.5 + Math.sign(yf) * grow * 0.9;
      const z = (zf - 0.5) * (B.w0 + grow * 2);
      pos.push(x, y, z); uv.push(t, j / (nR - 1));
    }
  }
  const idx = [];
  for (let i = 0; i < nX; i++) for (let j = 0; j < nR; j++) {
    const jn = (j + 1) % nR;
    const a = i * nR + j, b = (i + 1) * nR + j, c = i * nR + jn, d = (i + 1) * nR + jn;
    idx.push(a, c, b, c, d, b);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  const ng = geo.toNonIndexed(); ng.computeVertexNormals();
  return ng;
}

// ---------- tsuba: girih openwork ----------
function insetPolygon(pts, d) {
  // pts CCW; inset by d (positive = inwards). miter join.
  const n = pts.length, out = [];
  const lines = [];
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
    const nx = -dy / l, ny = dx / l; // left normal = inwards for CCW
    lines.push([a[0] + nx * d, a[1] + ny * d, dx, dy]);
  }
  for (let i = 0; i < n; i++) {
    const L1 = lines[(i + n - 1) % n], L2 = lines[i];
    const den = L1[2] * L2[3] - L1[3] * L2[2];
    if (Math.abs(den) < 1e-9) { out.push([L2[0], L2[1]]); continue; }
    const t = ((L2[0] - L1[0]) * L2[3] - (L2[1] - L1[1]) * L2[2]) / den;
    out.push([L1[0] + L1[2] * t, L1[1] + L1[3] * t]);
  }
  return out;
}
const pol = (r, deg) => [r * Math.cos(deg * Math.PI / 180), r * Math.sin(deg * Math.PI / 180)];
function area(p) { let a = 0; for (let i = 0; i < p.length; i++) { const q = p[i], w = p[(i + 1) % p.length]; a += q[0] * w[1] - w[0] * q[1]; } return a / 2; }
const ccw = (p) => (area(p) < 0 ? p.slice().reverse() : p);

// Girih openwork: two khatam stars ({8/2}) laid as straps, rasterised once and traced back into
// exact hole polygons, so the 3D piercings and the ink drawing come from the same source.
export const GIRIH = { rI: 0.155, rO: 0.352, strap: 0.0165, stars: [{ k: 2, R: 0.352, a0: 0 }, { k: 2, R: 0.262, a0: 22.5 }] };
let _holes = null;
function rdp(pts, eps) {
  if (pts.length < 3) return pts;
  let dmax = 0, idx = 0; const a = pts[0], b = pts[pts.length - 1];
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1e-9;
  for (let i = 1; i < pts.length - 1; i++) { const d = Math.abs((pts[i][0] - a[0]) * dy - (pts[i][1] - a[1]) * dx) / L; if (d > dmax) { dmax = d; idx = i; } }
  if (dmax > eps) { const l = rdp(pts.slice(0, idx + 1), eps), r = rdp(pts.slice(idx), eps); return l.slice(0, -1).concat(r); }
  return [a, b];
}
export function girihHoles() {
  if (_holes) return _holes;
  const N = 1024, ext = 0.4, k = N / (2 * ext);
  const c = document.createElement('canvas'); c.width = c.height = N;
  const x = c.getContext('2d');
  x.fillStyle = '#000'; x.fillRect(0, 0, N, N);
  x.setTransform(k, 0, 0, k, N / 2, N / 2);
  x.fillStyle = '#fff'; x.beginPath(); x.arc(0, 0, GIRIH.rO, 0, Math.PI * 2); x.moveTo(GIRIH.rI, 0); x.arc(0, 0, GIRIH.rI, Math.PI * 2, 0, true); x.fill();
  x.strokeStyle = '#000'; x.lineWidth = GIRIH.strap; x.lineCap = 'butt';
  const P = (r, d) => [r * Math.cos(d * Math.PI / 180), r * Math.sin(d * Math.PI / 180)];
  for (const st of GIRIH.stars) for (let i = 0; i < 8; i++) {
    const a = P(st.R, st.a0 + i * 45), b = P(st.R, st.a0 + (i + st.k) * 45);
    x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke();
  }
  x.lineWidth = GIRIH.strap; x.beginPath(); x.arc(0, 0, GIRIH.rO, 0, Math.PI * 2); x.stroke();
  x.beginPath(); x.arc(0, 0, GIRIH.rI, 0, Math.PI * 2); x.stroke();
  const img = x.getImageData(0, 0, N, N).data;
  const M = new Uint8Array(N * N); for (let i = 0; i < N * N; i++) M[i] = img[i * 4] > 127 ? 1 : 0;
  const lab = new Int32Array(N * N); let nl = 0; const holes = [];
  const stack = [];
  for (let i0 = 0; i0 < N * N; i0++) {
    if (!M[i0] || lab[i0]) continue;
    nl++; lab[i0] = nl; stack.push(i0); let count = 0;
    const pix = [];
    while (stack.length) { const i = stack.pop(); count++; pix.push(i); const px = i % N, py = (i / N) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const qx = px + dx, qy = py + dy; if (qx < 0 || qy < 0 || qx >= N || qy >= N) continue; const j = qy * N + qx; if (M[j] && !lab[j]) { lab[j] = nl; stack.push(j); } } }
    if (count < 40) continue;
    // boundary edges with the inside on the left, chained into a loop
    const next = new Map();
    const key = (X, Y) => X * 4096 + Y;
    const inC = (X, Y) => X >= 0 && Y >= 0 && X < N && Y < N && lab[Y * N + X] === nl;
    for (const i of pix) { const X = i % N, Y = (i / N) | 0;
      if (!inC(X, Y - 1)) next.set(key(X + 1, Y), [X, Y]);       // top edge, going left
      if (!inC(X, Y + 1)) next.set(key(X, Y + 1), [X + 1, Y + 1]); // bottom edge, going right
      if (!inC(X - 1, Y)) next.set(key(X, Y), [X, Y + 1]);       // left edge, going down
      if (!inC(X + 1, Y)) next.set(key(X + 1, Y + 1), [X + 1, Y]); // right edge, going up
    }
    // walk the longest loop
    const seen = new Set(); let best = [];
    for (const [k0] of next) { if (seen.has(k0)) continue; const loop = []; let kk = k0, guard = 0;
      while (!seen.has(kk) && guard++ < 200000) { seen.add(kk); const X = Math.floor(kk / 4096), Y = kk % 4096; loop.push([X, Y]); const n = next.get(kk); if (!n) break; kk = key(n[0], n[1]); }
      if (loop.length > best.length) best = loop; }
    // simplify (split the closed loop in two halves for RDP)
    const h = best.length >> 1;
    const simp = rdp(best.slice(0, h + 1), 0.9).slice(0, -1).concat(rdp(best.slice(h).concat([best[0]]), 0.9).slice(0, -1));
    const poly = simp.map(([X, Y]) => [(X - N / 2) / k, (Y - N / 2) / k]);
    holes.push(ccw(poly));
  }
  _holes = holes;
  return holes;
}
export function girihTiles() { return girihHoles(); }
export function nakagoAna() {
  // wedge slot, spine side flat-ish (z negative = spine in tsuba coords: x = width axis)
  const pts = [];
  const hz = 0.14, hy = 0.032;
  for (let i = 0; i <= 24; i++) {
    const t = i / 24; const z = -hz + 2 * hz * t;
    const y = hy * (1 - Math.pow(Math.max(0, (z + hz * 0.6) / (hz * 1.6)), 2.2)) * Math.min(1, (z + hz) / 0.012 + 0.35);
    pts.push([z, Math.max(0.001, y)]);
  }
  for (let i = 24; i >= 0; i--) { const [z, y] = pts[i]; pts.push([z, -y]); }
  return ccw(pts);
}

export function buildTsuba() {
  const shape = new THREE.Shape();
  const n = 160;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    // tsuba is a touch taller along the blade's width
    const p = [Math.cos(a) * TSUBA_R * 1.03, Math.sin(a) * TSUBA_R];
    if (i === 0) shape.moveTo(p[0], p[1]); else shape.lineTo(p[0], p[1]);
  }
  const holes = [...girihHoles(), nakagoAna()];
  for (const h of holes) {
    const path = new THREE.Path();
    const r = h.slice().reverse();
    r.forEach((p, i) => (i ? path.lineTo(p[0], p[1]) : path.moveTo(p[0], p[1])));
    shape.holes.push(path);
  }
  const [x0, x1] = H.tsuba;
  const g = new THREE.ExtrudeGeometry(shape, { depth: x1 - x0, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.003, bevelSegments: 2, curveSegments: 4 });
  // shape (sx, sy, sz) -> handle frame (x = x0 + sz, y = sy, z = sx)
  const m = new THREE.Matrix4().set(0, 0, 1, x0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1);
  g.applyMatrix4(m);
  // flip winding since the basis change is a reflection
  const idx = g.index;
  if (idx) { for (let i = 0; i < idx.count; i += 3) { const a = idx.getX(i + 1); idx.setX(i + 1, idx.getX(i + 2)); idx.setX(i + 2, a); } }
  else { const p = g.attributes.position; const swap = (attr) => { for (let i = 0; i < attr.count; i += 3) { for (let c = 0; c < attr.itemSize; c++) { const t = attr.array[(i + 1) * attr.itemSize + c]; attr.array[(i + 1) * attr.itemSize + c] = attr.array[(i + 2) * attr.itemSize + c]; attr.array[(i + 2) * attr.itemSize + c] = t; } } }; for (const k in g.attributes) swap(g.attributes[k]); }
  g.computeVertexNormals();
  return g;
}

export function buildSeppa(which) {
  const shape = new THREE.Shape();
  const n = 64;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2; const p = [Math.cos(a) * 0.205, Math.sin(a) * 0.112];
    if (i === 0) shape.moveTo(p[0], p[1]); else shape.lineTo(p[0], p[1]);
  }
  const [x0, x1] = H[which];
  const g = new THREE.ExtrudeGeometry(shape, { depth: x1 - x0, bevelEnabled: false, curveSegments: 2 });
  const m = new THREE.Matrix4().set(0, 0, 1, x0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1);
  g.applyMatrix4(m);
  const p = g.attributes.position;
  const nonIdx = g.index ? g.toNonIndexed() : g;
  const swap = (attr) => { for (let i = 0; i < attr.count; i += 3) { for (let c = 0; c < attr.itemSize; c++) { const t = attr.array[(i + 1) * attr.itemSize + c]; attr.array[(i + 1) * attr.itemSize + c] = attr.array[(i + 2) * attr.itemSize + c]; attr.array[(i + 2) * attr.itemSize + c] = t; } } };
  for (const k in nonIdx.attributes) swap(nonIdx.attributes[k]);
  nonIdx.computeVertexNormals();
  return nonIdx;
}

// ---------- axial coordinate: 0 at the kashira end, 1 at the tip (sword-local) ----------
export function axisEnds() {
  const hf = handleFrame();
  const K = new THREE.Vector3(H.kashira[0], 0, 0).applyMatrix4(hf);
  const T = new THREE.Vector3(B.L, 0, 0);
  return { K, T };
}
export function addAxial(geo, matrix) {
  const { K, T } = axisEnds();
  const d = T.clone().sub(K); const L2 = d.lengthSq();
  const p = geo.attributes.position, a = new Float32Array(p.count), v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i); if (matrix) v.applyMatrix4(matrix);
    a[i] = v.sub(K).dot(d) / L2;
  }
  geo.setAttribute('aAxial', new THREE.BufferAttribute(a, 1));
  return geo;
}
