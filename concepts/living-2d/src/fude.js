// Fude 筆 — brush engine (prototype, CPU).
// The brush is a pressed round brush: its footprint is an egg-shaped ellipse whose long axis
// points to the upper left (the tip) and lower right (the belly). Sweeping that footprint along
// a KanjiVG stroke gives angled heads, thin horizontals, fat ノ, and real tome / hane / harai ends.
// Strokes are rasterised per pixel into a density field and an arrival-time field.
// Bristle lanes run dry (kasure) and ink wicks into the paper fibres (nijimi).
import { vnoise, vnoise1, clamp, smooth, mulberry } from './noise.js';

const HANE = '㇚㇆㇟㇂㇄㇁㇉㇙㇖㇈㇌㇋';
const HARAI = '㇒㇀㇓㇝㇇';
const NHARAI = '㇏';
const TEN = '㇔';

let _svg;
function pathSampler(d) {
  if (!_svg) {
    _svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    _svg.setAttribute('width', '0'); _svg.setAttribute('height', '0');
    _svg.style.position = 'absolute'; _svg.style.left = '-9999px';
    document.body.appendChild(_svg);
  }
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', d); _svg.appendChild(p);
  const L = p.getTotalLength();
  return { L, at: (s) => p.getPointAtLength(s), done: () => p.remove() };
}

export function strokeKind(type, lenUnits) {
  const t = (type || '').split('/')[0].trim();
  const c = t.charAt(0);
  if (TEN.includes(c)) return 'ten';
  if (lenUnits < 12) return 'ten';
  if (NHARAI.includes(c)) return 'nharai';
  if (HARAI.includes(c)) return 'harai';
  if (HANE.includes(c)) return 'hane';
  return 'tome';
}

// KanjiVG strokes (109 space) -> pixel polylines.
export function kanjiStrokes(kvg, box, opts = {}) {
  const s = box.size / 109;
  return kvg.strokes.map((st, i) => {
    const smp = pathSampler(st.d);
    const n = Math.max(8, Math.ceil(smp.L * s / 1.0));
    const pts = [];
    for (let j = 0; j <= n; j++) {
      const p = smp.at((j / n) * smp.L);
      pts.push([box.x + p.x * s, box.y + p.y * s]);
    }
    const kind = (opts.kinds && opts.kinds[i]) || strokeKind(st.type, smp.L);
    smp.done();
    return { pts, kind, type: st.type, units: smp.L, ...(opts.per && opts.per[i]) };
  });
}

// pressure p(sn) and speed v(sn) by stroke kind
function profile(kind, sn, st) {
  const press = st.press ?? 0.2;
  const ent = st.entry ?? 0.1;
  const head = 1 + press * (1 - smooth(0, ent, sn)); // kihitsu: landed pressed, relaxes
  let p = head, v = sn < ent * 0.6 ? 0.4 : 1.2;
  if (kind === 'tome') {
    p = head * (1 + (st.tomeBump ?? 0.07) * smooth(0.84, 0.97, sn)) * (1 - (st.waist ?? 0.1) * Math.sin(Math.PI * sn));
    if (sn > 0.92) v = 0.3;
  } else if (kind === 'hane') {
    const h0 = st.haneFrom ?? 0.9;
    p = head * (1 + 0.08 * smooth(0.6, h0 - 0.02, sn)) * (1 - 0.9 * Math.pow(smooth(h0, 1.0, sn), 0.8));
    if (sn > h0) v = 1.6;
  } else if (kind === 'harai') {
    const k = st.haraiFrom ?? 0.55;
    p = head * (1 - 0.94 * Math.pow(smooth(k, 1.0, sn), 1.1));
    if (sn > k) v = 1.2 + 0.4 * smooth(k, 1, sn);
  } else if (kind === 'nharai') { // ㇏: grows, then the flat foot sweeps off
    const k = st.haraiFrom ?? 0.8;
    p = (0.5 + 0.95 * Math.pow(smooth(0.0, k, sn), 1.3)) * (1 - 0.9 * Math.pow(smooth(k, 1.0, sn), 0.85));
    v = sn > k ? 1.5 : 1.0;
  } else { // ten: a short heavy teardrop
    p = (0.3 + 1.0 * Math.pow(smooth(0, 0.85, sn), 0.8)) * (1 - 0.12 * smooth(0.9, 1, sn));
    v = 0.6;
  }
  return { p, v };
}

function prepStroke(st, opts) {
  const W = st.W ?? opts.W;
  const ratio = st.ratio ?? opts.ratio ?? 0.5; // minor/major
  const tipA = ((st.tip ?? opts.tip ?? 32) * Math.PI) / 180;
  const ca = Math.cos(tipA), sa = Math.sin(tipA);
  let pts = st.pts.map((p) => [p[0], p[1], 0]);
  if (st.lead) { // optional short entry from the upper left
    const p0 = pts[0], L = W * st.lead; const lin = [];
    for (let j = 3; j >= 1; j--) lin.push([p0[0] - ca * L * j / 3, p0[1] - sa * L * j / 3, 1]);
    pts = lin.concat(pts);
  }
  if (st.kind === 'tome' && !st.noTome) {
    const b = pts[pts.length - 1], a0 = pts[Math.max(0, pts.length - 6)];
    const horiz = Math.abs(b[0] - a0[0]) > Math.abs(b[1] - a0[1]);
    let c = b;
    if (horiz) { // shoulder: a small lift up-right, then the press down-right
      const k1 = W * (st.shoulder ?? 0.07), t1 = (-38 * Math.PI) / 180;
      for (let j = 1; j <= 3; j++) pts.push([b[0] + Math.cos(t1) * k1 * j / 3, b[1] + Math.sin(t1) * k1 * j / 3, 3]);
      c = pts[pts.length - 1];
    }
    const k = W * (st.tomeLen ?? (horiz ? 0.17 : 0.1));
    const ta = ((st.tomeAng ?? (horiz ? 66 : 60)) * Math.PI) / 180;
    for (let j = 1; j <= 5; j++) pts.push([c[0] + Math.cos(ta) * k * j / 5, c[1] + Math.sin(ta) * k * j / 5, 2]);
  }
  // resample at a spacing tied to the footprint's minor axis
  const ds = Math.max(0.7, 0.5 * W * ratio * (opts.ds ?? 0.13));
  const R = [pts[0]]; let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    const seg = Math.hypot(b[0] - a[0], b[1] - a[1]);
    acc += seg;
    if (acc >= ds || i === pts.length - 1 || b[2] !== a[2]) { R.push(b); acc = 0; }
  }
  pts = R;
  const n = pts.length; const S = new Float32Array(n); let L = 0;
  for (let i = 1; i < n; i++) { L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); S[i] = L; }
  let leadEnd = 0; for (let i = 0; i < n; i++) if (pts[i][2] === 1) leadEnd = i + 1;
  let tomeStart = n; for (let i = 0; i < n; i++) if (pts[i][2] >= 2) { tomeStart = i; break; }
  const sA = leadEnd ? S[leadEnd] : 0, sB = tomeStart < n ? S[tomeStart - 1] : L, body = Math.max(1, sB - sA);
  const A = new Float32Array(n), Bm = new Float32Array(n), TX = new Float32Array(n), TY = new Float32Array(n), T = new Float32Array(n);
  const seed = opts.seed ?? 1;
  let t = 0;
  for (let i = 0; i < n; i++) {
    const i0 = Math.max(0, i - 2), i1 = Math.min(n - 1, i + 2);
    let dx = pts[i1][0] - pts[i0][0], dy = pts[i1][1] - pts[i0][1]; const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
    TX[i] = dx; TY[i] = dy;
    let p, v;
    if (pts[i][2] === 1) { p = 0.5 + 0.5 * (i / Math.max(1, leadEnd)); v = 0.4; }
    else if (pts[i][2] === 3) { p = 0.93; v = 0.5; }
    else if (pts[i][2] === 2) { const f = (i - tomeStart + 1) / (n - tomeStart); p = (st.tomeP ?? 1.12) - (st.tomeLift ?? 0.32) * f * f; v = 0.3; }
    else {
      const sn = clamp((S[i] - sA) / body);
      ({ p, v } = profile(st.kind, sn, st));
      p *= 1 + 0.045 * (vnoise1(S[i] / (W * 1.4), seed * 31 + 3) - 0.5) * 2;
    }
    const a = 0.5 * W * p * (st.mul ?? 1);
    A[i] = a; Bm[i] = a * ratio;
    if (i) t += (S[i] - S[i - 1]) / (v * W * 6);
    T[i] = t;
  }
  return { pts, S, A, B: Bm, TX, TY, T, L, sA, sB, body, dur: t, W, ca, sa, aNegK: st.aNeg ?? opts.aNeg ?? 0.66 };
}

// Rasterise strokes into a field.
export function buildField(strokes, opts = {}) {
  const preps = strokes.map((st, k) => prepStroke(st, { ...opts, seed: (opts.seed ?? 1) + k * 7 }));
  const air = opts.air ?? 0.18;
  let T0 = 0; const starts = [];
  preps.forEach((pp, k) => { starts.push(T0); T0 += pp.dur + (k < preps.length - 1 ? air * (0.75 + 0.5 * mulberry(k + 3)()) : 0); });
  const total = T0 || 1;
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  preps.forEach((pp) => pp.pts.forEach((p, i) => {
    const r = pp.A[i] * 1.3 + 10;
    x0 = Math.min(x0, p[0] - r); y0 = Math.min(y0, p[1] - r); x1 = Math.max(x1, p[0] + r); y1 = Math.max(y1, p[1] + r);
  }));
  x0 = Math.floor(x0); y0 = Math.floor(y0); x1 = Math.ceil(x1); y1 = Math.ceil(y1);
  const w = x1 - x0, h = y1 - y0, N = w * h;
  const dens = new Float32Array(N), arr = new Float32Array(N).fill(2);
  const bO = new Float32Array(N), bI = new Int32Array(N);
  const fib = opts.fibre;
  const seed = opts.seed ?? 1;
  preps.forEach((pp, k) => {
    const st = strokes[k];
    bO.fill(81);
    const { pts, A, B, ca, sa, aNegK } = pp;
    let sx0 = 1e9, sy0 = 1e9, sx1 = -1e9, sy1 = -1e9;
    for (let i = 0; i < pts.length; i++) {
      const cx = pts[i][0] - x0, cy = pts[i][1] - y0;
      const a = A[i], an = a * aNegK, b = B[i];
      const r = a * 1.22 + 6;
      const minx = Math.max(0, Math.floor(cx - r)), maxx = Math.min(w - 1, Math.ceil(cx + r));
      const miny = Math.max(0, Math.floor(cy - r)), maxy = Math.min(h - 1, Math.ceil(cy + r));
      if (minx < sx0) sx0 = minx; if (miny < sy0) sy0 = miny; if (maxx > sx1) sx1 = maxx; if (maxy > sy1) sy1 = maxy;
      const ia = 1 / a, ian = 1 / an, ib = 1 / b;
      for (let y = miny; y <= maxy; y++) {
        const dy = y + 0.5 - cy;
        let id = y * w + minx;
        for (let x = minx; x <= maxx; x++, id++) {
          const dx = x + 0.5 - cx;
          const X = dx * ca + dy * sa, Y = -dx * sa + dy * ca;
          const u = X > 0 ? X * ia : X * ian, v = Y * ib;
          const o2 = u * u + v * v;
          if (o2 < bO[id]) { bO[id] = o2; bI[id] = i; }
        }
      }
    }
    const W = pp.W;
    const lanes = clamp(W / 2.0, 6, 80);
    const dryStart = st.dryStart ?? opts.dryStart ?? 0.55;
    const dryK = st.dry ?? opts.dry ?? 1.2;
    const hFrom = st.haraiFrom ?? (st.kind === 'nharai' ? 0.8 : 0.55);
    const sd = seed + k * 13;
    const rough = opts.rough ?? 1;
    for (let y = sy0; y <= sy1; y++) for (let x = sx0; x <= sx1; x++) {
      const id = y * w + x;
      const o2 = bO[id];
      if (o2 > 1.9) continue;
      const i = bI[id];
      const cx = pts[i][0] - x0, cy = pts[i][1] - y0;
      const a = A[i], an = a * aNegK, b = B[i];
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
      const X = dx * ca + dy * sa, Y = -dx * sa + dy * ca;
      const ax = X > 0 ? a : an;
      const o = Math.sqrt(o2);
      const g = Math.sqrt((X / (ax * ax)) ** 2 + (Y / (b * b)) ** 2);
      let e = g > 1e-6 ? ((1 - o) * o) / g : b; // px to the footprint edge (positive inside)
      if (o < 0.15) e = Math.max(e, b * (1 - o));
      const s = pp.S[i];
      const sn = clamp((s - pp.sA) / pp.body);
      // across-stroke coordinate relative to travel
      const tx = pp.TX[i], ty = pp.TY[i];
      const perp = -dx * ty + dy * tx;
      const nx = -ty, ny = tx;
      const ne1 = nx * ca + ny * sa, ne2 = -nx * sa + ny * ca;
      const aa = perp * ne1 > 0 ? a : an;
      const half = Math.sqrt((aa * ne1) ** 2 + (b * ne2) ** 2) || 1;
      const uu = clamp(perp / half, -1, 1);
      let f = 0;
      if (fib) { const fx = x + x0 - fib.ox, fy = y + y0 - fib.oy; if (fx >= 0 && fy >= 0 && fx < fib.w && fy < fib.h) f = fib.data[fy * fib.w + fx]; }
      // ragged edge: bristles + fibres
      const side = uu > 0 ? 3 : 9;
      const rg = (vnoise(s / 5, side, sd) - 0.5) * 1.8 + (vnoise(s / 1.6, side + 1, sd) - 0.5) * 1.0;
      e += rg * (0.55 + 0.7 * sn) * rough + (f - 0.25) * 1.0;
      const aEdge = clamp(e + 0.5);
      const u = (uu + 1) * 0.5;
      const outer = smooth(0.58, 1, Math.abs(2 * u - 1));
      const rate = (0.45 + 1.15 * (0.55 * vnoise1(u * lanes + k * 7.3, sd) + 0.45 * vnoise1(u * lanes * 0.16 + k * 3.1, sd + 1))) * (1 + 0.55 * outer);
      let D = dryK * Math.max(0, sn - dryStart);
      if (st.kind === 'harai' || st.kind === 'nharai') D += (st.haraiDry ?? 1.3) * Math.pow(smooth(hFrom, 1, sn), 1.2);
      if (st.kind === 'hane') D += 0.6 * smooth(0.9, 1, sn);
      if (st.kind === 'tome') D *= 1 - 0.8 * smooth(0.9, 0.995, sn);
      if (pts[i][2] >= 2) D *= 0.15;
      D *= st.dryMul ?? 1;
      const along = vnoise(s / (W * 0.9), u * lanes * 0.7, sd + 5) - 0.5;
      const load = 1 - D * rate + 0.34 * along * Math.min(1, D * 2.5);
      const lane = smooth(0, 0.16, load);
      let dd = aEdge * lane;
      dd *= 0.93 + 0.05 * vnoise1(u * lanes * 0.55 + 9.7, sd + 9) + 0.02 * vnoise(s / (W * 2.5), u * 2, sd + 4);
      if (e > 0) dd = Math.min(1, dd + 0.07 * Math.exp(-e / 2.2) * aEdge * lane);
      if (e < 0.5) {
        const bleed = (opts.bleed ?? 0.22) * (0.25 + f * 1.4) * Math.exp((e - 0.5) / 1.9) * (1 - 0.7 * sn);
        dd = Math.max(dd, bleed);
      }
      if (dd < 0.004) continue;
      const prev = dens[id];
      dens[id] = 1 - (1 - prev) * (1 - dd);
      const ta = (starts[k] + pp.T[i]) / total;
      if ((dd > 0.08 || prev < 0.004) && ta < arr[id]) arr[id] = ta;
    }
  });
  return { x0, y0, w, h, dens, arr, total, starts: starts.map((s) => s / total), durs: preps.map((p) => p.dur / total) };
}

// Composite ink onto a sheet (in place). progress 0..1 along the field's timeline.
export function inkOnto(sheet, field, opts = {}) {
  const prog = opts.progress ?? 1;
  const wetK = opts.wetK ?? 6;
  const dryAge = opts.age ?? 0;
  const ink = opts.ink ?? [22, 18, 14];
  const ox = opts.ox ?? 0, oy = opts.oy ?? 0;
  const mode = opts.mode ?? 'multiply';
  const { x0, y0, w, h, dens, arr } = field;
  const sd = sheet.data, sw = sheet.w, sh = sheet.h, fib = sheet.fibre;
  const gloss = opts.gloss ?? 1;
  for (let y = 0; y < h; y++) {
    const Y = y + y0 + oy; if (Y < 0 || Y >= sh) continue;
    for (let x = 0; x < w; x++) {
      const id = y * w + x;
      const d = dens[id]; if (d < 0.004) continue;
      const ta = arr[id];
      if (ta > prog) continue;
      const X = x + x0 + ox; if (X < 0 || X >= sw) continue;
      const P = Y * sw + X, o = P * 4;
      const shown = prog >= 1 ? 1 : smooth(ta, ta + 0.002, prog + 0.0005);
      const f = fib[P];
      const age = (prog - ta) + dryAge;
      const wet = Math.exp(-age * wetK);
      const a = d * shown * (1 - 0.07 * f * (1 - wet));
      let spec = 0;
      if (wet > 0.02 && x > 0 && y > 0 && x < w - 1 && y < h - 1) {
        const gx = dens[id + 1] - dens[id - 1], gy = dens[id + w] - dens[id - w];
        spec = Math.max(0, (gx + gy) * 0.7) * wet * 0.55 * gloss;
        spec += wet * 0.045 * d * gloss;
      }
      if (mode === 'multiply') {
        const ir = ink[0] * (1 - wet * 0.35), ig = ink[1] * (1 - wet * 0.3), ib = ink[2] * (1 - wet * 0.2) + wet * 6;
        let r = sd[o] * (1 - a + a * ir / 255), g = sd[o + 1] * (1 - a + a * ig / 255), b = sd[o + 2] * (1 - a + a * ib / 255);
        if (spec > 0) { r += (236 - r) * spec; g += (238 - g) * spec; b += (242 - b) * spec; }
        sd[o] = r; sd[o + 1] = g; sd[o + 2] = b;
      } else {
        sd[o] += (ink[0] - sd[o]) * a; sd[o + 1] += (ink[1] - sd[o + 1]) * a; sd[o + 2] += (ink[2] - sd[o + 2]) * a;
      }
    }
  }
}

export function fieldToCanvas(field, colour = [22, 18, 14], progress = 1) {
  const c = document.createElement('canvas'); c.width = field.w; c.height = field.h;
  const x = c.getContext('2d'); const im = x.createImageData(field.w, field.h);
  for (let i = 0; i < field.w * field.h; i++) {
    const d = field.dens[i]; if (d < 0.004 || field.arr[i] > progress) continue;
    im.data[i * 4] = colour[0]; im.data[i * 4 + 1] = colour[1]; im.data[i * 4 + 2] = colour[2]; im.data[i * 4 + 3] = d * 255;
  }
  x.putImageData(im, 0, 0);
  return c;
}

// sample an SVG path (KanjiVG space) into points
export function samplePath(d, step = 1) {
  const smp = pathSampler(d);
  const n = Math.max(2, Math.ceil(smp.L / step));
  const out = [];
  for (let j = 0; j <= n; j++) { const p = smp.at((j / n) * smp.L); out.push([p.x, p.y]); }
  smp.done();
  return out;
}
