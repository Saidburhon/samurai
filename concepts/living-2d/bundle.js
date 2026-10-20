var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/noise.js
function mulberry(seed) {
  let a = seed >>> 0;
  return function() {
    a |= 0;
    a = a + 1831565813 | 0;
    let t2 = Math.imul(a ^ a >>> 15, 1 | a);
    t2 = t2 + Math.imul(t2 ^ t2 >>> 7, 61 | t2) ^ t2;
    return ((t2 ^ t2 >>> 14) >>> 0) / 4294967296;
  };
}
function hash2(x, y, s) {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 2246822519);
  h = Math.imul(h ^ h >>> 13, 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
function vnoise(x, y, s = 0) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi, s), b = hash2(xi + 1, yi, s), c = hash2(xi, yi + 1, s), d = hash2(xi + 1, yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function vnoise1(x, s = 0) {
  const xi = Math.floor(x), xf = x - xi;
  const u = xf * xf * (3 - 2 * xf);
  const a = hash2(xi, 0, s), b = hash2(xi + 1, 0, s);
  return a + (b - a) * u;
}
var clamp, smooth, hex;
var init_noise = __esm({
  "src/noise.js"() {
    clamp = (v, a = 0, b = 1) => v < a ? a : v > b ? b : v;
    smooth = (a, b, x) => {
      const t2 = clamp((x - a) / (b - a));
      return t2 * t2 * (3 - 2 * t2);
    };
    hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  }
});

// src/washi.js
function bakeWashi(w, h, opts = {}) {
  const seed = opts.seed ?? 7;
  const base = hex(opts.color ?? "#EEE6D4");
  const deep = hex(opts.deep ?? "#DFD2B8"), lite = hex(opts.lite ?? "#F6F1E6");
  const rnd = mulberry(seed * 9973 + 11);
  const scale = opts.scale ?? 1;
  const q2 = 4, gw = Math.ceil(w / q2) + 2, gh = Math.ceil(h / q2) + 2;
  const low = new Float32Array(gw * gh);
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
    const x = i * q2, y = j * q2;
    const wx = vnoise(x / (160 * scale), y / (160 * scale), seed + 3) - 0.5;
    const wy = vnoise(x / (160 * scale), y / (160 * scale), seed + 4) - 0.5;
    const X = x + wx * 70, Y = y + wy * 70;
    const n1 = vnoise(X / (230 * scale), Y / (230 * scale), seed) * 0.6 + vnoise(X / (115 * scale), Y / (115 * scale), seed + 1) * 0.4;
    const n2 = vnoise(X / (46 * scale), Y / (46 * scale), seed + 5);
    const floc = Math.pow(n2, 1.6);
    low[j * gw + i] = (opts.clouds ?? 1) * (0.034 * (n1 - 0.5) * 2 + 0.03 * (floc - 0.3) * 2);
  }
  const img = new ImageData(w, h);
  const d = img.data;
  for (let y = 0; y < h; y++) {
    const gy = y / q2, j0 = Math.floor(gy), fy = gy - j0;
    for (let x = 0; x < w; x++) {
      const gx = x / q2, i0 = Math.floor(gx), fx2 = gx - i0;
      const a = low[j0 * gw + i0], b = low[j0 * gw + i0 + 1], c = low[(j0 + 1) * gw + i0], e = low[(j0 + 1) * gw + i0 + 1];
      const L = a + (b - a) * fx2 + (c - a) * fy + (a - b - c + e) * fx2 * fy;
      const n3 = vnoise(x / (7 * scale), y / (7 * scale), seed + 9) - 0.5;
      const k = L + 0.016 * n3;
      const o = (y * w + x) * 4;
      if (k < 0) {
        const t2 = Math.min(1, -k / 0.07);
        d[o] = base[0] + (deep[0] - base[0]) * t2;
        d[o + 1] = base[1] + (deep[1] - base[1]) * t2;
        d[o + 2] = base[2] + (deep[2] - base[2]) * t2;
      } else {
        const t2 = Math.min(1, k / 0.07);
        d[o] = base[0] + (lite[0] - base[0]) * t2;
        d[o + 1] = base[1] + (lite[1] - base[1]) * t2;
        d[o + 2] = base[2] + (lite[2] - base[2]) * t2;
      }
      d[o + 3] = 255;
    }
  }
  const fc = document.createElement("canvas");
  fc.width = w;
  fc.height = h;
  const fx = fc.getContext("2d");
  fx.lineCap = "round";
  const area = w * h / (2048 * 1024);
  const nLong = Math.round((opts.fibres ?? 1500) * area);
  for (let i = 0; i < nLong; i++) {
    const len = (50 + Math.pow(rnd(), 1.3) * 230) * scale;
    const ang = rnd() * Math.PI * 2;
    const x0 = rnd() * (w + 200) - 100, y0 = rnd() * (h + 200) - 100;
    const dx = Math.cos(ang) * len, dy = Math.sin(ang) * len;
    const bend = (rnd() - 0.5) * len * 0.22, bend2 = (rnd() - 0.5) * len * 0.22;
    const nx = -Math.sin(ang), ny = Math.cos(ang);
    fx.beginPath();
    fx.moveTo(x0, y0);
    fx.bezierCurveTo(x0 + dx * 0.33 + nx * bend, y0 + dy * 0.33 + ny * bend, x0 + dx * 0.66 + nx * bend2, y0 + dy * 0.66 + ny * bend2, x0 + dx, y0 + dy);
    fx.lineWidth = (0.6 + Math.pow(rnd(), 2.6) * 1.3) * Math.max(0.8, scale);
    fx.strokeStyle = `rgba(255,253,246,${0.16 + rnd() * 0.3})`;
    fx.stroke();
  }
  const nShort = Math.round((opts.fibres ?? 1500) / 1500 * 5200 * area);
  for (let i = 0; i < nShort; i++) {
    const len = (5 + rnd() * 26) * scale, ang = rnd() * Math.PI * 2;
    const x0 = rnd() * w, y0 = rnd() * h;
    fx.beginPath();
    fx.moveTo(x0, y0);
    fx.quadraticCurveTo(x0 + Math.cos(ang + 0.4) * len * 0.5, y0 + Math.sin(ang + 0.4) * len * 0.5, x0 + Math.cos(ang) * len, y0 + Math.sin(ang) * len);
    fx.lineWidth = 0.6 + rnd() * 0.5;
    fx.strokeStyle = `rgba(255,252,244,${0.14 + rnd() * 0.22})`;
    fx.stroke();
  }
  const fd = fx.getImageData(0, 0, w, h).data;
  const fibre = new Float32Array(w * h);
  for (let p = 0, o = 0; p < w * h; p++, o += 4) {
    const a = fd[o + 3] / 255;
    fibre[p] = a;
    if (a > 0) {
      const fk = opts.fibreK ?? 0.85;
      d[o] = d[o] + (252 - d[o]) * a * fk;
      d[o + 1] = d[o + 1] + (248 - d[o + 1]) * a * fk;
      d[o + 2] = d[o + 2] + (236 - d[o + 2]) * a * fk;
    }
  }
  const tmp = document.createElement("canvas");
  tmp.width = w;
  tmp.height = h;
  const tx = tmp.getContext("2d");
  tx.putImageData(img, 0, 0);
  tx.lineCap = "round";
  const nDark = Math.round(380 * area);
  for (let i = 0; i < nDark; i++) {
    const len = (30 + rnd() * 150) * scale, ang = rnd() * Math.PI * 2;
    const x0 = rnd() * w, y0 = rnd() * h, b = (rnd() - 0.5) * len * 0.25;
    tx.beginPath();
    tx.moveTo(x0, y0);
    tx.quadraticCurveTo(x0 + Math.cos(ang) * len * 0.5 - Math.sin(ang) * b, y0 + Math.sin(ang) * len * 0.5 + Math.cos(ang) * b, x0 + Math.cos(ang) * len, y0 + Math.sin(ang) * len);
    tx.lineWidth = 0.6 + rnd() * 0.5;
    tx.strokeStyle = `rgba(190,172,140,${0.12 + rnd() * 0.14})`;
    tx.stroke();
  }
  const chiri = opts.chiri ?? 1;
  const nFleck = Math.round(80 * area * chiri);
  for (let i = 0; i < nFleck; i++) {
    const x0 = rnd() * w, y0 = rnd() * h, r = (0.8 + rnd() * 1.6) * Math.max(0.85, scale);
    tx.beginPath();
    const k = 5 + Math.floor(rnd() * 4);
    for (let j = 0; j < k; j++) {
      const a = j / k * Math.PI * 2, rr = r * (0.55 + rnd() * 0.7);
      j ? tx.lineTo(x0 + Math.cos(a) * rr, y0 + Math.sin(a) * rr * 0.8) : tx.moveTo(x0 + Math.cos(a) * rr, y0 + Math.sin(a) * rr * 0.8);
    }
    tx.closePath();
    tx.fillStyle = `rgba(${120 + rnd() * 30},${98 + rnd() * 20},${70 + rnd() * 14},${0.45 + rnd() * 0.4})`;
    tx.fill();
  }
  const nSliver = Math.round(10 * area * chiri);
  for (let i = 0; i < nSliver; i++) {
    const len = (8 + rnd() * 14) * scale, ang = rnd() * Math.PI * 2, x0 = rnd() * w, y0 = rnd() * h;
    tx.beginPath();
    tx.moveTo(x0, y0);
    tx.quadraticCurveTo(x0 + Math.cos(ang + 0.12) * len * 0.5, y0 + Math.sin(ang + 0.12) * len * 0.5, x0 + Math.cos(ang) * len, y0 + Math.sin(ang) * len);
    tx.lineWidth = 0.7 + rnd() * 0.5;
    tx.strokeStyle = `rgba(140,116,84,${0.22 + rnd() * 0.2})`;
    tx.stroke();
  }
  const out = tx.getImageData(0, 0, w, h);
  const od = out.data;
  for (let p = 0, o = 0; p < w * h; p++, o += 4) {
    const g = (hash2(p % w, p / w | 0, seed + 77) - 0.5) * 6;
    od[o] += g;
    od[o + 1] += g;
    od[o + 2] += g * 0.9;
  }
  return { w, h, data: od, base: new Uint8ClampedArray(od), fibre, img: out };
}
var init_washi = __esm({
  "src/washi.js"() {
    init_noise();
  }
});

// src/fude.js
function pathSampler(d) {
  if (!_svg) {
    _svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    _svg.setAttribute("width", "0");
    _svg.setAttribute("height", "0");
    _svg.style.position = "absolute";
    _svg.style.left = "-9999px";
    document.body.appendChild(_svg);
  }
  const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
  p.setAttribute("d", d);
  _svg.appendChild(p);
  const L = p.getTotalLength();
  return { L, at: (s) => p.getPointAtLength(s), done: () => p.remove() };
}
function strokeKind(type, lenUnits) {
  const t2 = (type || "").split("/")[0].trim();
  const c = t2.charAt(0);
  if (TEN.includes(c)) return "ten";
  if (lenUnits < 12) return "ten";
  if (NHARAI.includes(c)) return "nharai";
  if (HARAI.includes(c)) return "harai";
  if (HANE.includes(c)) return "hane";
  return "tome";
}
function kanjiStrokes(kvg, box, opts = {}) {
  const s = box.size / 109;
  return kvg.strokes.map((st, i) => {
    const smp = pathSampler(st.d);
    const n = Math.max(8, Math.ceil(smp.L * s / 1));
    const pts = [];
    for (let j = 0; j <= n; j++) {
      const p = smp.at(j / n * smp.L);
      pts.push([box.x + p.x * s, box.y + p.y * s]);
    }
    const kind = opts.kinds && opts.kinds[i] || strokeKind(st.type, smp.L);
    smp.done();
    return { pts, kind, type: st.type, units: smp.L, ...opts.per && opts.per[i] };
  });
}
function profile(kind, sn, st) {
  const press = st.press ?? 0.2;
  const ent = st.entry ?? 0.1;
  const head = 1 + press * (1 - smooth(0, ent, sn));
  let p = head, v = sn < ent * 0.6 ? 0.4 : 1.2;
  if (kind === "tome") {
    p = head * (1 + (st.tomeBump ?? 0.07) * smooth(0.84, 0.97, sn)) * (1 - (st.waist ?? 0.1) * Math.sin(Math.PI * sn));
    if (sn > 0.92) v = 0.3;
  } else if (kind === "hane") {
    const h0 = st.haneFrom ?? 0.9;
    p = head * (1 + 0.08 * smooth(0.6, h0 - 0.02, sn)) * (1 - 0.9 * Math.pow(smooth(h0, 1, sn), 0.8));
    if (sn > h0) v = 1.6;
  } else if (kind === "harai") {
    const k = st.haraiFrom ?? 0.55;
    p = head * (1 - 0.94 * Math.pow(smooth(k, 1, sn), 1.1));
    if (sn > k) v = 1.2 + 0.4 * smooth(k, 1, sn);
  } else if (kind === "nharai") {
    const k = st.haraiFrom ?? 0.8;
    p = (0.5 + 0.95 * Math.pow(smooth(0, k, sn), 1.3)) * (1 - 0.9 * Math.pow(smooth(k, 1, sn), 0.85));
    v = sn > k ? 1.5 : 1;
  } else {
    p = (0.3 + 1 * Math.pow(smooth(0, 0.85, sn), 0.8)) * (1 - 0.12 * smooth(0.9, 1, sn));
    v = 0.6;
  }
  return { p, v };
}
function prepStroke(st, opts) {
  const W = st.W ?? opts.W;
  const ratio = st.ratio ?? opts.ratio ?? 0.5;
  const tipA = (st.tip ?? opts.tip ?? 32) * Math.PI / 180;
  const ca = Math.cos(tipA), sa = Math.sin(tipA);
  let pts = st.pts.map((p) => [p[0], p[1], 0]);
  if (st.lead) {
    const p0 = pts[0], L2 = W * st.lead;
    const lin = [];
    for (let j = 3; j >= 1; j--) lin.push([p0[0] - ca * L2 * j / 3, p0[1] - sa * L2 * j / 3, 1]);
    pts = lin.concat(pts);
  }
  if (st.kind === "tome" && !st.noTome) {
    const b = pts[pts.length - 1], a0 = pts[Math.max(0, pts.length - 6)];
    const horiz = Math.abs(b[0] - a0[0]) > Math.abs(b[1] - a0[1]);
    let c = b;
    if (horiz) {
      const k1 = W * (st.shoulder ?? 0.07), t1 = -38 * Math.PI / 180;
      for (let j = 1; j <= 3; j++) pts.push([b[0] + Math.cos(t1) * k1 * j / 3, b[1] + Math.sin(t1) * k1 * j / 3, 3]);
      c = pts[pts.length - 1];
    }
    const k = W * (st.tomeLen ?? (horiz ? 0.17 : 0.1));
    const ta = (st.tomeAng ?? (horiz ? 66 : 60)) * Math.PI / 180;
    for (let j = 1; j <= 5; j++) pts.push([c[0] + Math.cos(ta) * k * j / 5, c[1] + Math.sin(ta) * k * j / 5, 2]);
  }
  const ds = Math.max(0.7, 0.5 * W * ratio * (opts.ds ?? 0.13));
  const R = [pts[0]];
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    const seg = Math.hypot(b[0] - a[0], b[1] - a[1]);
    acc += seg;
    if (acc >= ds || i === pts.length - 1 || b[2] !== a[2]) {
      R.push(b);
      acc = 0;
    }
  }
  pts = R;
  const n = pts.length;
  const S = new Float32Array(n);
  let L = 0;
  for (let i = 1; i < n; i++) {
    L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    S[i] = L;
  }
  let leadEnd = 0;
  for (let i = 0; i < n; i++) if (pts[i][2] === 1) leadEnd = i + 1;
  let tomeStart = n;
  for (let i = 0; i < n; i++) if (pts[i][2] >= 2) {
    tomeStart = i;
    break;
  }
  const sA = leadEnd ? S[leadEnd] : 0, sB = tomeStart < n ? S[tomeStart - 1] : L, body = Math.max(1, sB - sA);
  const A = new Float32Array(n), Bm = new Float32Array(n), TX = new Float32Array(n), TY = new Float32Array(n), T = new Float32Array(n);
  const seed = opts.seed ?? 1;
  let t2 = 0;
  for (let i = 0; i < n; i++) {
    const i0 = Math.max(0, i - 2), i1 = Math.min(n - 1, i + 2);
    let dx = pts[i1][0] - pts[i0][0], dy = pts[i1][1] - pts[i0][1];
    const dl = Math.hypot(dx, dy) || 1;
    dx /= dl;
    dy /= dl;
    TX[i] = dx;
    TY[i] = dy;
    let p, v;
    if (pts[i][2] === 1) {
      p = 0.5 + 0.5 * (i / Math.max(1, leadEnd));
      v = 0.4;
    } else if (pts[i][2] === 3) {
      p = 0.93;
      v = 0.5;
    } else if (pts[i][2] === 2) {
      const f = (i - tomeStart + 1) / (n - tomeStart);
      p = (st.tomeP ?? 1.12) - (st.tomeLift ?? 0.32) * f * f;
      v = 0.3;
    } else {
      const sn = clamp((S[i] - sA) / body);
      ({ p, v } = profile(st.kind, sn, st));
      p *= 1 + 0.045 * (vnoise1(S[i] / (W * 1.4), seed * 31 + 3) - 0.5) * 2;
    }
    const a = 0.5 * W * p * (st.mul ?? 1);
    A[i] = a;
    Bm[i] = a * ratio;
    if (i) t2 += (S[i] - S[i - 1]) / (v * W * 6);
    T[i] = t2;
  }
  return { pts, S, A, B: Bm, TX, TY, T, L, sA, sB, body, dur: t2, W, ca, sa, aNegK: st.aNeg ?? opts.aNeg ?? 0.66 };
}
function buildField(strokes, opts = {}) {
  const preps = strokes.map((st, k) => prepStroke(st, { ...opts, seed: (opts.seed ?? 1) + k * 7 }));
  const air = opts.air ?? 0.18;
  let T0 = 0;
  const starts = [];
  preps.forEach((pp, k) => {
    starts.push(T0);
    T0 += pp.dur + (k < preps.length - 1 ? air * (0.75 + 0.5 * mulberry(k + 3)()) : 0);
  });
  const total = T0 || 1;
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  preps.forEach((pp) => pp.pts.forEach((p, i) => {
    const r = pp.A[i] * 1.3 + 10;
    x0 = Math.min(x0, p[0] - r);
    y0 = Math.min(y0, p[1] - r);
    x1 = Math.max(x1, p[0] + r);
    y1 = Math.max(y1, p[1] + r);
  }));
  x0 = Math.floor(x0);
  y0 = Math.floor(y0);
  x1 = Math.ceil(x1);
  y1 = Math.ceil(y1);
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
      if (minx < sx0) sx0 = minx;
      if (miny < sy0) sy0 = miny;
      if (maxx > sx1) sx1 = maxx;
      if (maxy > sy1) sy1 = maxy;
      const ia = 1 / a, ian = 1 / an, ib = 1 / b;
      for (let y = miny; y <= maxy; y++) {
        const dy = y + 0.5 - cy;
        let id = y * w + minx;
        for (let x = minx; x <= maxx; x++, id++) {
          const dx = x + 0.5 - cx;
          const X = dx * ca + dy * sa, Y = -dx * sa + dy * ca;
          const u = X > 0 ? X * ia : X * ian, v = Y * ib;
          const o2 = u * u + v * v;
          if (o2 < bO[id]) {
            bO[id] = o2;
            bI[id] = i;
          }
        }
      }
    }
    const W = pp.W;
    const lanes = clamp(W / 2, 6, 80);
    const dryStart = st.dryStart ?? opts.dryStart ?? 0.55;
    const dryK = st.dry ?? opts.dry ?? 1.2;
    const hFrom = st.haraiFrom ?? (st.kind === "nharai" ? 0.8 : 0.55);
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
      let e = g > 1e-6 ? (1 - o) * o / g : b;
      if (o < 0.15) e = Math.max(e, b * (1 - o));
      const s = pp.S[i];
      const sn = clamp((s - pp.sA) / pp.body);
      const tx = pp.TX[i], ty = pp.TY[i];
      const perp = -dx * ty + dy * tx;
      const nx = -ty, ny = tx;
      const ne1 = nx * ca + ny * sa, ne2 = -nx * sa + ny * ca;
      const aa = perp * ne1 > 0 ? a : an;
      const half = Math.sqrt((aa * ne1) ** 2 + (b * ne2) ** 2) || 1;
      const uu = clamp(perp / half, -1, 1);
      let f = 0;
      if (fib) {
        const fx = x + x0 - fib.ox, fy = y + y0 - fib.oy;
        if (fx >= 0 && fy >= 0 && fx < fib.w && fy < fib.h) f = fib.data[fy * fib.w + fx];
      }
      const side = uu > 0 ? 3 : 9;
      const rg = (vnoise(s / 5, side, sd) - 0.5) * 1.8 + (vnoise(s / 1.6, side + 1, sd) - 0.5) * 1;
      e += rg * (0.55 + 0.7 * sn) * rough + (f - 0.25) * 1;
      const aEdge = clamp(e + 0.5);
      const u = (uu + 1) * 0.5;
      const outer = smooth(0.58, 1, Math.abs(2 * u - 1));
      const rate = (0.45 + 1.15 * (0.55 * vnoise1(u * lanes + k * 7.3, sd) + 0.45 * vnoise1(u * lanes * 0.16 + k * 3.1, sd + 1))) * (1 + 0.55 * outer);
      let D = dryK * Math.max(0, sn - dryStart);
      if (st.kind === "harai" || st.kind === "nharai") D += (st.haraiDry ?? 1.3) * Math.pow(smooth(hFrom, 1, sn), 1.2);
      if (st.kind === "hane") D += 0.6 * smooth(0.9, 1, sn);
      if (st.kind === "tome") D *= 1 - 0.8 * smooth(0.9, 0.995, sn);
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
      if (dd < 4e-3) continue;
      const prev = dens[id];
      dens[id] = 1 - (1 - prev) * (1 - dd);
      const ta = (starts[k] + pp.T[i]) / total;
      if ((dd > 0.08 || prev < 4e-3) && ta < arr[id]) arr[id] = ta;
    }
  });
  return { x0, y0, w, h, dens, arr, total, starts: starts.map((s) => s / total), durs: preps.map((p) => p.dur / total) };
}
function inkOnto(sheet, field, opts = {}) {
  const prog = opts.progress ?? 1;
  const wetK = opts.wetK ?? 6;
  const dryAge = opts.age ?? 0;
  const ink = opts.ink ?? [22, 18, 14];
  const ox = opts.ox ?? 0, oy = opts.oy ?? 0;
  const mode = opts.mode ?? "multiply";
  const { x0, y0, w, h, dens, arr } = field;
  const sd = sheet.data, sw = sheet.w, sh = sheet.h, fib = sheet.fibre;
  const gloss = opts.gloss ?? 1;
  for (let y = 0; y < h; y++) {
    const Y = y + y0 + oy;
    if (Y < 0 || Y >= sh) continue;
    for (let x = 0; x < w; x++) {
      const id = y * w + x;
      const d = dens[id];
      if (d < 4e-3) continue;
      const ta = arr[id];
      if (ta > prog) continue;
      const X = x + x0 + ox;
      if (X < 0 || X >= sw) continue;
      const P = Y * sw + X, o = P * 4;
      const shown = prog >= 1 ? 1 : smooth(ta, ta + 2e-3, prog + 5e-4);
      const f = fib[P];
      const age = prog - ta + dryAge;
      const wet = Math.exp(-age * wetK);
      const a = d * shown * (1 - 0.07 * f * (1 - wet));
      let spec = 0;
      if (wet > 0.02 && x > 0 && y > 0 && x < w - 1 && y < h - 1) {
        const gx = dens[id + 1] - dens[id - 1], gy = dens[id + w] - dens[id - w];
        spec = Math.max(0, (gx + gy) * 0.7) * wet * 0.55 * gloss;
        spec += wet * 0.045 * d * gloss;
      }
      if (mode === "multiply") {
        const ir = ink[0] * (1 - wet * 0.35), ig = ink[1] * (1 - wet * 0.3), ib = ink[2] * (1 - wet * 0.2) + wet * 6;
        let r = sd[o] * (1 - a + a * ir / 255), g = sd[o + 1] * (1 - a + a * ig / 255), b = sd[o + 2] * (1 - a + a * ib / 255);
        if (spec > 0) {
          r += (236 - r) * spec;
          g += (238 - g) * spec;
          b += (242 - b) * spec;
        }
        sd[o] = r;
        sd[o + 1] = g;
        sd[o + 2] = b;
      } else {
        sd[o] += (ink[0] - sd[o]) * a;
        sd[o + 1] += (ink[1] - sd[o + 1]) * a;
        sd[o + 2] += (ink[2] - sd[o + 2]) * a;
      }
    }
  }
}
function fieldToCanvas(field, colour = [22, 18, 14], progress = 1) {
  const c = document.createElement("canvas");
  c.width = field.w;
  c.height = field.h;
  const x = c.getContext("2d");
  const im = x.createImageData(field.w, field.h);
  for (let i = 0; i < field.w * field.h; i++) {
    const d = field.dens[i];
    if (d < 4e-3 || field.arr[i] > progress) continue;
    im.data[i * 4] = colour[0];
    im.data[i * 4 + 1] = colour[1];
    im.data[i * 4 + 2] = colour[2];
    im.data[i * 4 + 3] = d * 255;
  }
  x.putImageData(im, 0, 0);
  return c;
}
function samplePath(d, step = 1) {
  const smp = pathSampler(d);
  const n = Math.max(2, Math.ceil(smp.L / step));
  const out = [];
  for (let j = 0; j <= n; j++) {
    const p = smp.at(j / n * smp.L);
    out.push([p.x, p.y]);
  }
  smp.done();
  return out;
}
var HANE, HARAI, NHARAI, TEN, _svg;
var init_fude = __esm({
  "src/fude.js"() {
    init_noise();
    HANE = "\u31DA\u31C6\u31DF\u31C2\u31C4\u31C1\u31C9\u31D9\u31D6\u31C8\u31CC\u31CB";
    HARAI = "\u31D2\u31C0\u31D3\u31DD\u31C7";
    NHARAI = "\u31CF";
    TEN = "\u31D4";
  }
});

// src/seal.js
function erode(mask, S, k, opts) {
  const N = S * k;
  const out = new ImageData(N, N);
  const blur = opts.blur;
  const seed = opts.seed ?? 3;
  const col = opts.colour ?? [205, 64, 40];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const E = opts.erosion ?? 1;
    const nx = ((vnoise(x / (2.2 * k), y / (2.2 * k), seed) - 0.5) * 2.4 * k + (vnoise(x / (0.7 * k), y / (0.7 * k), seed + 1) - 0.5) * 0.9 * k) * E;
    const ny = ((vnoise(x / (2.2 * k), y / (2.2 * k), seed + 2) - 0.5) * 2.4 * k + (vnoise(x / (0.7 * k), y / (0.7 * k), seed + 3) - 0.5) * 0.9 * k) * E;
    const sx = clamp(Math.round(x + nx), 0, N - 1), sy = clamp(Math.round(y + ny), 0, N - 1);
    let a = mask[(sy * N + sx) * 4 + 3] / 255;
    if (a <= 0) continue;
    const b = blur[(y * N + x) * 4 + 3] / 255;
    const edge = 1 - Math.abs(b - 0.5) * 2;
    const sp = vnoise(x / (1.25 * k), y / (1.25 * k), seed + 5);
    const big = vnoise(x / (9 * k), y / (9 * k), seed + 6);
    let cov = 1;
    if (sp > 0.74 - 0.14 * (1 - big) + (1 - E) * 0.5) cov *= 0.06;
    if (hash2(x, y, seed + 7) > 0.975 + (1 - E) * 0.024) cov *= 0.2;
    if (vnoise(x / (0.5 * k), y / (0.5 * k), seed + 12) > 0.82 + (1 - E) * 0.3) cov *= 0.35;
    cov *= 0.78 + 0.22 * smooth(0.15, 0.6, big);
    cov *= 0.86 + 0.14 * edge;
    const dark = 1 - 0.14 * edge - 0.06 * vnoise(x / (3 * k), y / (3 * k), seed + 8);
    const o = (y * N + x) * 4;
    out.data[o] = col[0] * dark;
    out.data[o + 1] = col[1] * dark;
    out.data[o + 2] = col[2] * dark;
    out.data[o + 3] = 255 * a * cov;
  }
  return out;
}
function houseSeal(size, opts = {}) {
  const k = opts.k ?? 3, S = Math.round(size), N = S * k;
  const m = document.createElement("canvas");
  m.width = m.height = N;
  const g = m.getContext("2d");
  const c = N / 15;
  g.fillStyle = "#000";
  for (let r = 0; r < 15; r++) for (let q2 = 0; q2 < 15; q2++) {
    if (GRID[r][q2] !== "#") continue;
    const isFrame = r === 0 || r === 14 || q2 === 0 || q2 === 14;
    const j = isFrame ? 0.1 : 0.04;
    const jx = (hash2(r, q2, 11) - 0.5) * c * j, jy = (hash2(q2, r, 12) - 0.5) * c * j;
    g.fillRect(q2 * c + jx - 0.5, r * c + jy - 0.5, c + 1, c + 1);
  }
  const mask = g.getImageData(0, 0, N, N).data;
  const bc = document.createElement("canvas");
  bc.width = bc.height = N;
  const bg = bc.getContext("2d");
  bg.filter = `blur(${c * 0.28}px)`;
  bg.drawImage(m, 0, 0);
  const blur = bg.getImageData(0, 0, N, N).data;
  const im = erode(mask, S, k, { blur, seed: opts.seed ?? 5, colour: opts.colour });
  const out = document.createElement("canvas");
  out.width = out.height = N;
  out.getContext("2d").putImageData(im, 0, 0);
  return out;
}
function nameSeal(size, opts = {}) {
  const k = opts.k ?? 3, S = Math.round(size), N = S * k;
  const m = document.createElement("canvas");
  m.width = m.height = N;
  const g = m.getContext("2d");
  g.fillStyle = "#000";
  const r = N * 0.04;
  g.beginPath();
  g.roundRect(N * 0.02, N * 0.02, N * 0.96, N * 0.96, r);
  g.fill();
  g.globalCompositeOperation = "destination-out";
  g.font = `800 ${N * 0.84}px "Shippori Mincho B1"`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("\u5263", N / 2, N * 0.54);
  const mask = g.getImageData(0, 0, N, N).data;
  const bc = document.createElement("canvas");
  bc.width = bc.height = N;
  const bg = bc.getContext("2d");
  bg.filter = `blur(${N * 0.02}px)`;
  bg.drawImage(m, 0, 0);
  const blur = bg.getImageData(0, 0, N, N).data;
  const im = erode(mask, S, k, { blur, seed: opts.seed ?? 9, colour: opts.colour, erosion: opts.erosion ?? 0.25 });
  const out = document.createElement("canvas");
  out.width = out.height = N;
  out.getContext("2d").putImageData(im, 0, 0);
  return out;
}
function stampOnto(sheet, src, cx, cy, size, rotDeg = 0, opts = {}) {
  const pad = Math.ceil(size * 0.2);
  const T = Math.ceil(size + pad * 2);
  const c = document.createElement("canvas");
  c.width = c.height = T;
  const g = c.getContext("2d");
  g.translate(T / 2, T / 2);
  g.rotate(rotDeg * Math.PI / 180);
  g.imageSmoothingQuality = "high";
  g.drawImage(src, -size / 2, -size / 2, size, size);
  const d = g.getImageData(0, 0, T, T).data;
  const x0 = Math.round(cx - T / 2), y0 = Math.round(cy - T / 2);
  const sd = sheet.data, fib = sheet.fibre;
  const strength = opts.strength ?? 1;
  for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
    const a = d[(y * T + x) * 4 + 3] / 255 * strength;
    if (a <= 3e-3) continue;
    const X = x0 + x, Y = y0 + y;
    if (X < 0 || Y < 0 || X >= sheet.w || Y >= sheet.h) continue;
    const P = Y * sheet.w + X, o = P * 4;
    const f = fib[P];
    const aa = a * (1 - 0.3 * f);
    const r = d[(y * T + x) * 4] / 255, gg = d[(y * T + x) * 4 + 1] / 255, b = d[(y * T + x) * 4 + 2] / 255;
    sd[o] *= 1 - aa + aa * r * 1.08;
    sd[o + 1] *= 1 - aa + aa * gg;
    sd[o + 2] *= 1 - aa + aa * b;
  }
}
var GRID;
var init_seal = __esm({
  "src/seal.js"() {
    init_noise();
    GRID = [
      "###############",
      "#.............#",
      "#.###.###.#...#",
      "#.#.#..#..#...#",
      "#.#.#..#..#...#",
      "#.#.#..#..#...#",
      "#.###.###.#####",
      "#...#.........#",
      "#.###.###.#.#.#",
      "#..#..#...#.#.#",
      "#..#..#...###.#",
      "#..#..#...#.#.#",
      "#####.###.#.#.#",
      "#.............#",
      "###############"
    ];
  }
});

// src/abr.js
function createAbr(canvas, opts = {}) {
  const gl = canvas.getContext("webgl2", { antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: true });
  if (!gl) return null;
  const sh = (t2, s) => {
    const x = gl.createShader(t2);
    gl.shaderSource(x, s);
    gl.compileShader(x);
    if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(x));
    return x;
  };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
  gl.useProgram(pr);
  const b = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n) => gl.getUniformLocation(pr, n);
  const u = { res: U("uRes"), dpr: U("uDpr"), time: U("uTime"), contrast: U("uContrast"), scale: U("uScale"), boxes: U("uBoxes"), nb: U("uNBoxes"), sheen: U("uSheen"), off: U("uOffset"), seed: U("uSeed"), shade: U("uShade") };
  function render(P = {}) {
    const dpr = P.dpr ?? 1;
    const w = P.w, h = P.h;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u.res, canvas.width, canvas.height);
    gl.uniform1f(u.dpr, dpr);
    gl.uniform1f(u.time, P.time ?? 0);
    gl.uniform1f(u.contrast, P.contrast ?? 0.6);
    gl.uniform1f(u.scale, P.scale ?? 1);
    gl.uniform1f(u.seed, P.seed ?? 0);
    const boxes = (P.boxes || []).slice(0, 6);
    const arr = new Float32Array(24);
    boxes.forEach((bx, i) => arr.set(bx, i * 4));
    gl.uniform4fv(u.boxes, arr);
    gl.uniform1i(u.nb, boxes.length);
    const s = P.sheen || [w * 0.7, h * 0.4, 0];
    gl.uniform3f(u.sheen, s[0], s[1], s[2]);
    const off = P.offset || [0, 0];
    gl.uniform2f(u.off, off[0], off[1]);
    const sd = P.shade || [w * 0.4, h * 0.4, Math.max(w, h) * 0.9, 0.12];
    gl.uniform4f(u.shade, sd[0], sd[1], sd[2], sd[3]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  return { render, gl };
}
var VS, FS;
var init_abr = __esm({
  "src/abr.js"() {
    VS = `#version 300 es
in vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;
    FS = `#version 300 es
precision highp float;
uniform vec2 uRes; uniform float uDpr; uniform float uTime; uniform float uContrast; uniform float uScale;
uniform vec4 uBoxes[6]; uniform int uNBoxes; uniform vec3 uSheen; uniform vec2 uOffset; uniform float uSeed;
uniform vec4 uShade; // x,y,radius,strength : soft vignette-like light
out vec4 o;
float h11(float n){ return fract(sin(n*12.9898+uSeed)*43758.5453); }
float h21(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7))+uSeed)*43758.5453); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),f.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x), f.y); }
float ndot(vec2 a, vec2 b){ return a.x*b.x - a.y*b.y; }
float sdRhombus(vec2 p, vec2 b){ p=abs(p); float h=clamp((-2.*ndot(p,b)+ndot(b,b))/dot(b,b),-1.,1.);
  float d=length(p-.5*b*vec2(1.-h,1.+h)); return d*sign(p.x*b.y+p.y*b.x-b.x*b.y); }
float sdBox(vec2 p, vec2 b){ vec2 d=abs(p)-b; return length(max(d,0.))+min(max(d.x,d.y),0.); }

// dye level at a point (css px, motif space). 0 ground, 1 light, 2 deep, 3 white
float motif(vec2 p){
  vec2 cell = vec2(360., 520.);
  vec2 q = mod(p, cell) - cell*.5;
  float lv = 0.;
  // ilon izi: snake-track zigzag on the cell border
  float bx = mod(p.x + 180., 360.) - 180.;
  float tri = abs(fract(p.y/104.) - .5)*4. - 1.;
  float zc = tri*24.;
  float dz = abs(bx - zc);
  if (dz < 15.) lv = 1.;
  if (dz < 4.5) lv = 3.;
  // little resist dots in the zigzag's elbows
  vec2 ed = vec2(bx - (-zc)*0.0, mod(p.y, 52.) - 26.);
  // taroq combs flanking the lozenge waist
  float ax = abs(q.x), ay = q.y;
  if (abs(ay) < 46. && ax > 104. && ax < 152.) {
    if (ax > 140.) lv = 2.;
    else if (mod(ay + 46., 23.) < 10.) lv = 2.;
  }
  // the lozenge chain
  float d1 = sdRhombus(q, vec2(98., 236.));
  if (d1 < 0.) lv = 1.;
  if (abs(d1 + 9.) < 5.5) lv = 3.;
  float d2 = sdRhombus(q, vec2(56., 136.));
  if (d2 < 0.) lv = 2.;
  if (abs(d2 + 6.) < 3.5) lv = 1.;
  float d3 = sdRhombus(q, vec2(19., 48.));
  if (d3 < 0.) lv = 3.;
  // small diamonds between the chain links
  vec2 q2 = mod(p + vec2(0., 260.), cell) - cell*.5;
  float d4 = sdRhombus(q2, vec2(30., 40.));
  if (d4 < 0. && abs(q2.x) < 30.) lv = (d4 < -9.) ? 2. : 3.;
  // ko-gasuri: small feathered white marks scattered in the ground (Japanese kasuri)
  if (lv == 0.) {
    vec2 g = vec2(46., 34.);
    vec2 id = floor(p / g);
    vec2 r = mod(p + vec2(mod(id.y, 2.) * g.x * .5, 0.), g) - g * .5;
    float h = fract(sin(dot(id, vec2(41.3, 289.1))) * 9137.7);
    if (h > .35 && abs(r.x) < 5.5 && abs(r.y) < 1.6) lv = 4.;
    if (h > .82 && abs(r.y) < 5.5 && abs(r.x) < 1.6) lv = 4.;
  }
  return lv;
}

vec3 dyeOf(float lv, vec3 ai, vec3 aiL, vec3 aiD, vec3 kinu){
  if (lv == 1.) return mix(aiL, ai, .18); if (lv == 2.) return aiD; if (lv == 3.) return mix(ai, kinu, .58); if (lv == 4.) return mix(ai, kinu, .42); return ai; }
void main(){
  vec2 fc = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr; // css px, y down
  vec2 p = fc + uOffset;
  float sc = uScale;
  // warp threads run vertically; each thread (2px) belongs to a tied bundle that shifts along the warp
  float col = floor(p.x / 2.);
  float bundle = floor(p.x / 9.);
  float shift = (h11(bundle) - .5) * 15. + (h11(col*1.37) - .5) * 6. + (vn(vec2(col*.08, p.y/90.)) - .5) * 9.
              + sin(uTime*.6 + col*.03) * 1.2;
  vec2 mp = vec2(p.x, p.y + shift) / sc;
  float lv = motif(mp);
  float lvA = motif(mp + vec2(0., 2.6)/sc), lvB = motif(mp - vec2(0., 2.6)/sc), lvC = motif(mp + vec2(1.4, 5.)/sc);
  // calm the motif behind text blocks
  float calm = 0.;
  for (int i = 0; i < 6; i++) { if (i >= uNBoxes) break; vec4 b = uBoxes[i];
    float d = sdBox(fc - (b.xy + b.zw*.5), b.zw*.5);
    calm = max(calm, 1. - smoothstep(-10., 60., d)); }
  float c = uContrast * (1. - .7 * calm);
  vec3 ai = vec3(30., 45., 102.)/255.;
  vec3 aiL = vec3(58., 91., 170.)/255.;
  vec3 aiD = vec3(17., 27., 68.)/255.;
  vec3 kinu = vec3(239., 232., 216.)/255.;
  vec3 dye = (dyeOf(lv, ai, aiL, aiD, kinu) * 2. + dyeOf(lvA, ai, aiL, aiD, kinu) + dyeOf(lvB, ai, aiL, aiD, kinu) + dyeOf(lvC, ai, aiL, aiD, kinu)) / 5.;
  vec3 col3 = mix(ai, dye, c);
  // thread-level variation: warp threads, weft picks
  float tj = (h11(col*3.1) - .5) * .05;
  float warp = mod(p.x, 2.) < 1. ? -.035 : .0;
  float wy = fract(p.y / 2.5);
  float weft = (abs(wy - .5) * 2.) * -.022;
  // slub: thicker threads now and then
  float slub = smoothstep(.93, 1., vn(vec2(col*.9, p.y/40.))) * .06;
  col3 *= 1. + tj + warp + weft + slub;
  // broad cloth light: soft, low, never a blob
  float broad = (vn(p/420.) - .5) * .07 + (vn(p/160. + 7.) - .5) * .03;
  col3 *= 1. + broad;
  float L = length((fc - uShade.xy) / uShade.z);
  col3 *= 1. - uShade.w * smoothstep(.2, 1.3, L);
  // atlas satin sheen: anisotropic, along the weft, carried by the warp floats
  vec2 sd = (fc - uSheen.xy) / vec2(260., 60.);
  float sh = exp(-dot(sd, sd)) * uSheen.z;
  float floatMask = .6 + .4 * vn(vec2(col*.5, p.y/6.));
  col3 += sh * floatMask * vec3(.32, .36, .46) * (1. - .55*smoothstep(1.5,3.,lv));
  o = vec4(col3, 1.);
}`;
  }
});

// src/common.js
function el(tag, cls, html, parent) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  if (parent) parent.appendChild(e);
  return e;
}
function clocks() {
  const f = (tz) => new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(/* @__PURE__ */ new Date());
  return { tash: f("Asia/Tashkent"), tok: f("Asia/Tokyo") };
}
function menuMark(kvg, size, colour = [22, 18, 14]) {
  const box = { x: 4, y: 4, size };
  const st = kanjiStrokes(kvg["\u4E09"], box, { per: [{ W: size * 0.085 }, { W: size * 0.08 }, { W: size * 0.095 }] });
  const f = buildField(st, { W: size * 0.09, dry: 0.6, seed: 4, bleed: 0.1, rough: 0.35 });
  const c = fieldToCanvas(f, colour);
  c.style.left = f.x0 + "px";
  c.style.top = f.y0 + "px";
  return c;
}
function navBar(parent, kvg, opts = {}) {
  const nav = el("header", "nav" + (opts.dark ? " on-cloth" : ""), null, parent);
  const brand = el("a", "brand", null, nav);
  const s = nameSeal(24, { k: 6 });
  s.className = "nseal";
  brand.appendChild(s);
  el("span", "word", "QILICH", brand);
  const right = el("div", "nav-r", null, nav);
  if (!opts.phone) {
    el("div", "langs", '<span class="on">UZ</span><i>\xB7</i><span>RU</span><i>\xB7</i><span>EN</span>', right);
    el("div", "bell", `<span>OVOZ</span><i></i>`, right);
  }
  const m = el("div", "menu", null, right);
  const mk = menuMark(kvg, 30, opts.dark ? [239, 232, 216] : [22, 18, 14]);
  m.appendChild(mk);
  return nav;
}
var OK, TT, expoOut, expoIn, easeInOut;
var init_common = __esm({
  "src/common.js"() {
    init_fude();
    init_seal();
    OK = "\u02BB";
    TT = "\u02BC";
    expoOut = (t2) => t2 >= 1 ? 1 : 1 - Math.pow(2, -10 * t2);
    expoIn = (t2) => t2 <= 0 ? 0 : Math.pow(2, 10 * (t2 - 1));
    easeInOut = (t2) => t2 < 0.5 ? 2 * t2 * t2 : 1 - Math.pow(-2 * t2 + 2, 2) / 2;
  }
});

// src/bunbu.js
var bunbu_exports = {};
__export(bunbu_exports, {
  bunbu: () => bunbu
});
async function bunbu(S) {
  const { W, H, kvg, glyphs, phone, layers } = S;
  const t2 = S.t;
  const inkH = phone ? 0.27 * H : 0.56 * H;
  const bun = phone ? { x: 0.5 * W - inkH * 0.46, y: 0.12 * H } : { x: 0.085 * W, y: 0.185 * H };
  const bu = phone ? { x: 0.5 * W - inkH * 0.48, y: 0.52 * H } : { x: 0.555 * W, y: 0.185 * H };
  const sheet = bakeWashi(W, H, { seed: 26, scale: phone ? 0.75 : 1 });
  const fib = { data: sheet.fibre, w: W, h: H, ox: 0, oy: 0 };
  const size = inkH / 81 * 109;
  const box = { x: bun.x - 16.88 * size / 109, y: bun.y - 12.75 * size / 109, size };
  const bw = size * 0.112;
  const st = kanjiStrokes(kvg["\u6587"], box, {
    kinds: ["ten", "tome", "harai", "nharai"],
    per: [{ W: bw * 1.15 }, { W: bw * 0.95, waist: 0.14 }, { W: bw * 1.1, haraiFrom: 0.45, haraiDry: 1.6 }, { W: bw * 1.05, haraiFrom: 0.78, haraiDry: 1.2 }]
  });
  const fb = buildField(st, { W: bw, seed: 9, fibre: fib, dry: 0.9, dryStart: 0.5, bleed: 0.22 });
  const bunP = clamp(t2 / 0.6);
  inkOnto(sheet, fb, { progress: bunP, wetK: 2.2, age: Math.max(0, t2 - 0.6) * 4 });
  const pc = document.createElement("canvas");
  pc.width = W;
  pc.height = H;
  pc.getContext("2d").putImageData(sheet.img, 0, 0);
  const g = glyphs["\u6B66"];
  const [gx0, gy0, gx1, gy1] = g.bbox;
  const gs = inkH / (gy1 - gy0);
  const gm = document.createElement("canvas");
  gm.width = W;
  gm.height = H;
  const gx = gm.getContext("2d");
  gx.setTransform(gs, 0, 0, gs, bu.x - gx0 * gs, bu.y - gy0 * gs);
  gx.fillStyle = "#000";
  const glyphPath = new Path2D(g.contours.join(" "));
  gx.fill(glyphPath);
  gx.setTransform(1, 0, 0, 1, 0, 0);
  const gmask = gx.getImageData(0, 0, W, H).data;
  const kv = kvg["\u6B66"];
  const kx0 = 14.75, ky0 = 13.75, kx1 = 94.5, ky1 = 93.3;
  const gW = (gx1 - gx0) * gs, gH = (gy1 - gy0) * gs;
  const strokesPx = kv.strokes.map((s) => samplePath(s.d, 1.5).map(([x, y]) => [bu.x + (x - kx0) / (kx1 - kx0) * gW, bu.y + (y - ky0) / (ky1 - ky0) * gH]));
  const NP = strokesPx.length;
  const bx0 = Math.floor(bu.x - 4), by0 = Math.floor(bu.y - 4), bx1 = Math.ceil(bu.x + gW + 4), by1 = Math.ceil(bu.y + gH + 4);
  const pw = bx1 - bx0, ph = by1 - by0;
  const pieceA = Array.from({ length: NP }, () => new Float32Array(pw * ph));
  const cent = Array.from({ length: NP }, () => [0, 0, 0]);
  for (let y = by0; y < by1; y++) for (let x = bx0; x < bx1; x++) {
    const a = gmask[(y * W + x) * 4 + 3] / 255;
    if (a <= 0) continue;
    let d1 = 1e9, d2 = 1e9, i1 = 0, i2 = 0;
    for (let k = 0; k < NP; k++) {
      let dm = 1e9;
      const P = strokesPx[k];
      for (let j = 0; j < P.length; j += 2) {
        const dx = P[j][0] - x, dy = P[j][1] - y;
        const dd = dx * dx + dy * dy;
        if (dd < dm) dm = dd;
      }
      dm = Math.sqrt(dm);
      if (dm < d1) {
        d2 = d1;
        i2 = i1;
        d1 = dm;
        i1 = k;
      } else if (dm < d2) {
        d2 = dm;
        i2 = k;
      }
    }
    const w1 = clamp(0.5 + (d2 - d1) * 0.5);
    const id = (y - by0) * pw + (x - bx0);
    pieceA[i1][id] += a * w1;
    pieceA[i2][id] += a * (1 - w1);
    cent[i1][0] += x * a * w1;
    cent[i1][1] += y * a * w1;
    cent[i1][2] += a * w1;
  }
  const pieceCanvas = pieceA.map((A) => {
    const c = document.createElement("canvas");
    c.width = pw;
    c.height = ph;
    const x = c.getContext("2d");
    const im = x.createImageData(pw, ph);
    for (let i = 0; i < pw * ph; i++) {
      im.data[i * 4 + 3] = clamp(A[i]) * 255;
    }
    x.putImageData(im, 0, 0);
    return c;
  });
  cent.forEach((c) => {
    c[0] /= c[2] || 1;
    c[1] /= c[2] || 1;
  });
  const cutT = (i) => 0.3 + 0.62 * (i / NP);
  const rnd = mulberry(77);
  const phys = strokesPx.map(() => ({ drift: (rnd() - 0.5) * 140, w: (0.8 + rnd() * 0.8) * (rnd() < 0.5 ? -1 : 1), fl: 2.5 + rnd() * 1.5, f0: rnd() * 0.6 }));
  const paper = layers.paper;
  paper.width = W;
  paper.height = H;
  const ctx = paper.getContext("2d");
  ctx.drawImage(pc, 0, 0);
  if (t2 < 1) {
    ctx.save();
    ctx.setTransform(gs, 0, 0, gs, bu.x - gx0 * gs, bu.y - gy0 * gs);
    ctx.strokeStyle = "rgba(94,85,75,0.38)";
    ctx.lineWidth = 0.75 / gs;
    ctx.setLineDash([5 / gs, 3.5 / gs]);
    ctx.stroke(glyphPath);
    ctx.restore();
  }
  const holes = document.createElement("canvas");
  holes.width = W;
  holes.height = H;
  const hx = holes.getContext("2d");
  let nCut = 0;
  hx.globalCompositeOperation = "lighter";
  for (let i = 0; i < NP; i++) if (t2 >= cutT(i)) {
    hx.drawImage(pieceCanvas[i], bx0, by0);
    nCut++;
  }
  hx.globalCompositeOperation = "source-over";
  if (nCut) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.drawImage(holes, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    const sh = document.createElement("canvas");
    sh.width = W;
    sh.height = H;
    const sx = sh.getContext("2d");
    sx.fillStyle = "#000";
    sx.fillRect(0, 0, W, H);
    sx.globalCompositeOperation = "destination-out";
    sx.drawImage(holes, 0, 0);
    const sb = document.createElement("canvas");
    sb.width = W;
    sb.height = H;
    const sbx = sb.getContext("2d");
    sbx.filter = "blur(9px)";
    sbx.drawImage(sh, 5, 9);
    sbx.filter = "none";
    sbx.globalCompositeOperation = "destination-in";
    sbx.drawImage(holes, 0, 0);
    ctx.globalAlpha = 0.55;
    ctx.drawImage(sb, 0, 0);
    ctx.globalAlpha = 1;
    const ring = ringOf(holes, W, H, 1.2, "rgba(246,241,230,0.95)");
    ctx.drawImage(ring, 0, 0);
    const dk = ringOf(holes, W, H, 0.6, "rgba(20,16,30,0.6)", true);
    ctx.drawImage(dk, 0, 0);
  }
  const fx = layers.fx;
  fx.width = W;
  fx.height = H;
  const gfx = fx.getContext("2d");
  for (let i = 0; i < NP; i++) {
    const g0 = cutT(i) - 0.075;
    if (t2 >= g0 && t2 < cutT(i)) {
      const gp = (t2 - g0) / 0.075;
      const ring = document.createElement("canvas");
      ring.width = W;
      ring.height = H;
      const rx = ring.getContext("2d");
      const one = document.createElement("canvas");
      one.width = W;
      one.height = H;
      one.getContext("2d").drawImage(pieceCanvas[i], bx0, by0);
      rx.drawImage(ringOf(one, W, H, 1.6, "rgba(255,253,246,1)"), 0, 0);
      const [cx, cy] = cent[i];
      const a0 = -Math.PI / 2;
      const ang = a0 + gp * Math.PI * 2;
      rx.globalCompositeOperation = "destination-in";
      const cg = rx.createConicGradient(a0, cx, cy);
      const head = gp;
      cg.addColorStop(0, "rgba(0,0,0,0.05)");
      cg.addColorStop(Math.max(1e-3, head * 0.6), "rgba(0,0,0,0.25)");
      cg.addColorStop(Math.max(2e-3, head - 2e-3), "rgba(0,0,0,1)");
      cg.addColorStop(Math.min(0.999, head + 1e-3), "rgba(0,0,0,0)");
      cg.addColorStop(1, "rgba(0,0,0,0)");
      rx.fillStyle = cg;
      rx.fillRect(0, 0, W, H);
      gfx.save();
      gfx.globalCompositeOperation = "lighter";
      gfx.shadowColor = "rgba(230,236,240,.9)";
      gfx.shadowBlur = 7;
      gfx.drawImage(ring, 0, 0);
      gfx.restore();
      const data = ring.getContext("2d").getImageData(0, 0, W, H).data;
      let best = null, bd = 1e9;
      for (let y = by0; y < by1; y += 1) for (let x = bx0; x < bx1; x += 1) {
        if (data[(y * W + x) * 4 + 3] < 120) continue;
        let da = Math.atan2(y - cy, x - cx) - ang;
        da = Math.atan2(Math.sin(da), Math.cos(da));
        if (da > 0) continue;
        if (-da < bd) {
          bd = -da;
          best = [x, y];
        }
      }
      if (best) {
        gfx.save();
        gfx.globalCompositeOperation = "lighter";
        const rg = gfx.createRadialGradient(best[0], best[1], 0, best[0], best[1], 60);
        rg.addColorStop(0, "rgba(255,255,250,.75)");
        rg.addColorStop(0.08, "rgba(244,246,248,.45)");
        rg.addColorStop(0.3, "rgba(230,236,240,.12)");
        rg.addColorStop(1, "rgba(220,228,236,0)");
        gfx.fillStyle = rg;
        gfx.fillRect(best[0] - 60, best[1] - 60, 120, 120);
        const tang = Math.atan2(best[1] - cy, best[0] - cx) + Math.PI / 2;
        gfx.translate(best[0], best[1]);
        gfx.rotate(tang);
        const lg = gfx.createRadialGradient(0, 0, 0, 0, 0, 1);
        lg.addColorStop(0, "rgba(255,255,252,.8)");
        lg.addColorStop(1, "rgba(255,255,255,0)");
        gfx.scale(90, 2.2);
        gfx.fillStyle = lg;
        gfx.beginPath();
        gfx.arc(0, 0, 1, 0, Math.PI * 2);
        gfx.fill();
        gfx.restore();
      }
    }
  }
  const back = document.createElement("canvas");
  back.width = W;
  back.height = H;
  {
    const b = back.getContext("2d");
    b.drawImage(pc, 0, 0);
    b.globalCompositeOperation = "multiply";
    b.fillStyle = "#F3EFE6";
    b.fillRect(0, 0, W, H);
  }
  const pieces = [];
  for (let i = 0; i < NP; i++) {
    if (t2 < cutT(i) || t2 >= 1) continue;
    const tau = (t2 - cutT(i)) * 2.15;
    const pop = Math.min(1, tau / 0.08) * 3;
    const y = 0.5 * 2200 * Math.max(0, tau - 0.06) ** 2 - pop;
    if (y > H + 200) continue;
    const ph2 = phys[i];
    pieces.push({ i, tau, y, x: ph2.drift * tau, rot: ph2.w * tau * 0.9, flip: Math.cos(ph2.f0 + ph2.fl * tau) });
  }
  for (const p of pieces) {
    const i = p.i, [cx, cy] = cent[i];
    const front = document.createElement("canvas");
    front.width = pw;
    front.height = ph;
    const fxx = front.getContext("2d");
    fxx.drawImage(p.flip >= 0 ? pc : back, -bx0, -by0);
    fxx.globalCompositeOperation = "destination-in";
    fxx.drawImage(pieceCanvas[i], 0, 0);
    if (p.flip < 0) {
      fxx.globalCompositeOperation = "source-atop";
      fxx.fillStyle = "rgba(120,100,70,.08)";
      fxx.fillRect(0, 0, pw, ph);
    }
    ctx.save();
    ctx.translate(cx + p.x, cy + p.y);
    ctx.rotate(p.rot);
    ctx.scale(Math.max(0.08, Math.abs(p.flip)) * (p.flip < 0 ? -1 : 1), 1);
    const lift = Math.min(1, p.tau / 0.15);
    ctx.shadowColor = `rgba(18,14,30,${0.18 + 0.14 * lift})`;
    ctx.shadowBlur = 14 + 22 * lift;
    ctx.shadowOffsetX = 6 + 10 * lift;
    ctx.shadowOffsetY = 10 + 18 * lift;
    ctx.drawImage(front, bx0 - cx, by0 - cy);
    ctx.restore();
  }
  const abr = createAbr(layers.cloth);
  abr.render({ w: W, h: H, dpr: 1, time: t2, contrast: 0.62, scale: phone ? 0.6 : 0.85, offset: [-6, 4], shade: [W * 0.7, H * 0.45, W * 0.6, 0.18], seed: 1.7 });
  const over = layers.over;
  navBar(over, kvg, { phone });
  const h2 = el("h2", "h2 bunbu-h2", "Qalam va qilich", over);
  const l1 = el("p", "pair", "Qalamdek toza kod.", over);
  const l2 = el("p", "pair", "Qilichdek aniq ish.", over);
  if (phone) {
    l1.style.left = "22px";
    l1.style.top = bun.y + inkH + 14 + "px";
    l2.style.left = "22px";
    l2.style.top = bu.y + inkH + 14 + "px";
  } else {
    l1.style.left = bun.x + "px";
    l1.style.top = bun.y + inkH + 34 + "px";
    l2.style.left = bu.x + "px";
    l2.style.top = bu.y + inkH + 34 + "px";
  }
  l1.style.opacity = smooth(0.58, 0.68, t2);
  l2.style.opacity = smooth(0.94, 1, t2);
  const cap = el("p", "bunbu-cap", `Yaponlar buni <span lang="ja">\u6587\u6B66\u4E21\u9053</span> \u2014 bunbu ry\u014Dd\u014D deydi.`, over);
  cap.style.opacity = smooth(0.96, 1, t2);
  const lab = el("div", "margin-v", '<span lang="ja">\u6587</span><i>QALAM</i><span lang="ja">\u6B66</span><i>QILICH</i>', over);
  return {};
}
function ringOf(mask, W, H, r, colour, inside = false) {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d");
  if (!inside) {
    for (let a = 0; a < 8; a++) x.drawImage(mask, Math.cos(a * Math.PI / 4) * r, Math.sin(a * Math.PI / 4) * r);
    x.globalCompositeOperation = "destination-out";
    x.drawImage(mask, 0, 0);
  } else {
    x.drawImage(mask, 0, 0);
    const inv = document.createElement("canvas");
    inv.width = W;
    inv.height = H;
    const ix = inv.getContext("2d");
    ix.fillRect(0, 0, W, H);
    ix.globalCompositeOperation = "destination-out";
    ix.drawImage(mask, 0, 0);
    const er = document.createElement("canvas");
    er.width = W;
    er.height = H;
    const ex = er.getContext("2d");
    for (let a = 0; a < 8; a++) ex.drawImage(inv, Math.cos(a * Math.PI / 4) * r, Math.sin(a * Math.PI / 4) * r);
    x.globalCompositeOperation = "source-over";
    x.clearRect(0, 0, W, H);
    x.drawImage(mask, 0, 0);
    x.globalCompositeOperation = "destination-in";
    x.drawImage(er, 0, 0);
  }
  x.globalCompositeOperation = "source-in";
  x.fillStyle = colour;
  x.fillRect(0, 0, W, H);
  return c;
}
var init_bunbu = __esm({
  "src/bunbu.js"() {
    init_washi();
    init_fude();
    init_abr();
    init_common();
    init_noise();
  }
});

// src/tanzaku.js
var tanzaku_exports = {};
__export(tanzaku_exports, {
  tanzaku: () => tanzaku
});
function shade(hex2, k) {
  const v = [1, 3, 5].map((i) => parseInt(hex2.slice(i, i + 2), 16));
  return "#" + v.map((c) => Math.round(Math.max(0, Math.min(255, c * k))).toString(16).padStart(2, "0")).join("");
}
async function tanzaku(S) {
  const { W, H, kvg, phone, layers } = S;
  const t2 = S.t;
  const sw = 120, pitch = 158, x0 = 104, yS = Math.round(0.14 * H);
  const lens = [404, 432, 462, 512, 566, 612, 650];
  const gust = clamp(1 - t2);
  const rnd = mulberry(5);
  const ang = STRIPS.map((_, i) => (Math.sin(1.7 + i * 0.85) * 1.4 + (rnd() - 0.5) * 0.8) * (1 - gust) + gust * 9 * Math.sin(2.4 - i * 0.62) * Math.exp(-i * 0.05));
  const abr = createAbr(layers.cloth);
  abr.render({ w: W, h: H, dpr: 1, time: 3, contrast: 0.38, scale: 1.05, boxes: [[x0 - 10, H - 200, 560, 160]], sheen: [W * 0.62, H * 0.62, 0.12], shade: [W * 0.45, H * 0.5, W * 0.8, 0.2], seed: 2.3 });
  const pc = layers.paper;
  pc.width = W;
  pc.height = H;
  const ctx = pc.getContext("2d");
  const over = layers.over;
  const sagY = (x) => yS + 10 * Math.sin(Math.PI * x / W) + 4;
  const tops = [];
  for (let i = 0; i < STRIPS.length; i++) {
    const s = STRIPS[i];
    const cx = x0 + i * pitch + sw / 2;
    const top = sagY(cx) + 24;
    const L = lens[i];
    tops.push({ cx, top });
    const dark = s.ink === "kinu" && s.paper === "#1D1915";
    const tex = bakeWashi(sw + 8, L + 16, { seed: 40 + i * 3, color: s.paper, deep: shade(s.paper, 0.93), lite: shade(s.paper, dark ? 1.35 : 1.04), scale: 0.8, chiri: dark ? 0 : 0.7, clouds: dark ? 1.6 : 0.9, fibres: dark ? 900 : 1500, fibreK: dark ? 0.16 : 0.85 });
    const tc = document.createElement("canvas");
    tc.width = tex.w;
    tc.height = tex.h;
    tc.getContext("2d").putImageData(tex.img, 0, 0);
    if (dark) {
      const g3 = tc.getContext("2d");
      g3.globalCompositeOperation = "multiply";
      g3.fillStyle = "rgba(40,34,28,1)";
      g3.globalAlpha = 0;
      g3.fillRect(0, 0, tc.width, tc.height);
    }
    const path = new Path2D();
    path.moveTo(-sw / 2, 0);
    path.lineTo(sw / 2, 0);
    const seg = 24;
    for (let j = 0; j <= seg; j++) {
      const x = sw / 2 - j / seg * sw;
      const y = L + (vnoise(j * 0.9, i * 7, 3) - 0.5) * 7 + (vnoise(j * 3.1, i * 5, 4) - 0.5) * 3;
      path.lineTo(x, y);
    }
    path.closePath();
    ctx.save();
    ctx.translate(cx, top);
    ctx.rotate(ang[i] * Math.PI / 180);
    ctx.shadowColor = "rgba(6,10,30,.42)";
    ctx.shadowBlur = 26;
    ctx.shadowOffsetX = 9;
    ctx.shadowOffsetY = 14;
    ctx.fillStyle = s.paper;
    ctx.fill(path);
    ctx.shadowColor = "transparent";
    ctx.save();
    ctx.clip(path);
    ctx.drawImage(tc, -sw / 2 - 4, -8);
    const g = ctx.createLinearGradient(0, 0, 0, L);
    g.addColorStop(0, "rgba(0,0,0,.10)");
    g.addColorStop(0.08, "rgba(0,0,0,0)");
    g.addColorStop(0.85, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,.06)");
    ctx.fillStyle = g;
    ctx.fillRect(-sw / 2, 0, sw, L + 10);
    const gs = ctx.createLinearGradient(-sw / 2, 0, sw / 2, 0);
    gs.addColorStop(0, "rgba(255,255,255,.05)");
    gs.addColorStop(0.5, "rgba(255,255,255,0)");
    gs.addColorStop(1, "rgba(0,0,0,.07)");
    ctx.fillStyle = gs;
    ctx.fillRect(-sw / 2, 0, sw, L + 10);
    ctx.restore();
    ctx.strokeStyle = dark ? "rgba(255,250,240,.18)" : "rgba(255,252,246,.6)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-sw / 2 + 0.5, 0);
    ctx.lineTo(-sw / 2 + 0.5, L - 3);
    ctx.stroke();
    ctx.restore();
    const g2 = el("div", "strip " + s.ink, null, over);
    g2.style.left = cx - sw / 2 + "px";
    g2.style.top = top + "px";
    g2.style.width = sw + "px";
    g2.style.height = L + "px";
    g2.style.transformOrigin = "50% 0";
    g2.style.transform = `rotate(${ang[i]}deg)`;
    el("span", "idx", s.n, g2);
    el("span", "name", `<span>${s.a}</span><span>${s.b}</span>`, g2);
    el("span", "ja", s.ja, g2).setAttribute("lang", "ja");
  }
  let svg = `<svg class="string" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs>
    <filter id="tw"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3"/><feDisplacementMap in="SourceGraphic" scale="1.2"/></filter></defs>`;
  let d = `M -10 ${sagY(-10)}`;
  for (let x = 0; x <= W + 10; x += 20) d += ` L ${x} ${sagY(x).toFixed(1)}`;
  svg += `<path d="${d}" stroke="#0d1230" stroke-width="3.6" fill="none" opacity=".55" transform="translate(2 4)" filter="url(#tw)"/>`;
  svg += `<path d="${d}" stroke="#EFE8D8" stroke-width="2.2" fill="none" stroke-linecap="round" filter="url(#tw)"/>`;
  svg += `<path d="${d}" stroke="#a9a08e" stroke-width="2.2" fill="none" stroke-dasharray="2 3" opacity=".7"/>`;
  tops.forEach(({ cx, top }, i) => {
    const ys = sagY(cx);
    const a = ang[i] * Math.PI / 180;
    const bx = cx + Math.sin(-a) * 0, by = top;
    svg += `<path d="M ${cx - 7} ${ys - 2} C ${cx - 9} ${ys + 9}, ${cx - 4} ${by - 4}, ${bx} ${by + 6} C ${cx + 4} ${by - 4}, ${cx + 9} ${ys + 9}, ${cx + 7} ${ys - 2}" stroke="#F3EDE0" stroke-width="2.4" fill="none" stroke-linecap="round" filter="url(#tw)"/>`;
    svg += `<path d="M ${cx - 7} ${ys - 2} C ${cx - 9} ${ys + 9}, ${cx - 4} ${by - 4}, ${bx} ${by + 6}" stroke="#b5ab97" stroke-width="2.4" fill="none" stroke-dasharray="1.5 2.5"/>`;
    svg += `<circle cx="${cx}" cy="${ys - 1}" r="3.4" fill="#EFE8D8"/><circle cx="${cx + 0.8}" cy="${ys}" r="1.5" fill="#b5ab97"/>`;
  });
  svg += "</svg>";
  const sv = el("div", "string-wrap", svg, over);
  navBar(over, kvg, { phone, dark: true });
  const h2 = el("h2", "h2 tz-h2", "Nimalar quramiz", over);
  const hint = el("p", "tz-hint", `Keraklisini tanlang \u2014 xatga qo${OK}shamiz.`, over);
  el("div", "spine", '<span lang="ja">\u4E03\u3064\u306E\u6280</span><i>07</i>', over);
  return {};
}
var STRIPS;
var init_tanzaku = __esm({
  "src/tanzaku.js"() {
    init_washi();
    init_abr();
    init_common();
    init_noise();
    STRIPS = [
      { n: "01", a: "iOS va Android", b: "ilovalar", ja: "\u30A2\u30D7\u30EA", paper: "#EEE6D4", ink: "sumi" },
      { n: "02", a: "Saytlar va", b: "veb-platformalar", ja: "\u30A6\u30A7\u30D6", paper: "#CF4A30", ink: "kinu" },
      { n: "03", a: "Telegram", b: "botlar", ja: "\u30DC\u30C3\u30C8", paper: "#F0E9D9", ink: "sumi" },
      { n: "04", a: "Backend va", b: "integratsiyalar", ja: "\u30D0\u30C3\u30AF\u30A8\u30F3\u30C9", paper: "#C9D6E3", ink: "sumi" },
      { n: "05", a: "Desktop", b: "dasturlar", ja: "\u30C7\u30B9\u30AF\u30C8\u30C3\u30D7", paper: "#ECE3CF", ink: "sumi" },
      { n: "06", a: "IoT", b: "qurilmalar", ja: "IoT\u6A5F\u5668", paper: "#1D1915", ink: "kinu" },
      { n: "07", a: `Sun${TT}iy`, b: "intellekt (AI)", ja: "\u4EBA\u5DE5\u77E5\u80FD", paper: "#E2D6BE", ink: "sumi" }
    ];
  }
});

// src/jikan.js
var jikan_exports = {};
__export(jikan_exports, {
  jikan: () => jikan
});
async function jikan(S) {
  const { W, H, kvg, phone, layers } = S;
  const t2 = S.t;
  const sheet = bakeWashi(W, H, { seed: 31, scale: phone ? 0.75 : 1 });
  const fib = { data: sheet.fibre, w: W, h: H, ox: 0, oy: 0 };
  const cx = phone ? W * 0.5 : W * 0.655, cy = phone ? H * 0.5 : H * 0.53;
  const R = phone ? 118 : 196, R2 = R * 1.2;
  const ang = (hTash) => (hTash / 24 * 360 - 90) * Math.PI / 180;
  const off = TZ_K - TZ_T;
  const shared = [Math.max(9, 9 - off), Math.min(18, 18 - off)];
  const washes = [
    { from: 9, to: 18, r0: 0.4, r1: 0.9, col: hex("#1E9C93"), a: 0.62, seed: 3 },
    { from: 9 - off, to: 18 - off, r0: 0.6, r1: 1.13, col: hex("#D3462B"), a: 0.56, seed: 7 }
  ];
  const bloom = clamp((t2 - 0.25) / 0.5);
  for (const w of washes) washOnto(sheet, cx, cy, R, w, ang, bloom);
  const enso = (r, a0deg, sweep, W0, seed, lean) => {
    const pts = [];
    const n = 260;
    for (let i = 0; i <= n; i++) {
      const f = i / n;
      const a = (a0deg + sweep * f) * Math.PI / 180;
      const rr = r * (1 + 0.025 * Math.sin(f * 5.1 + seed) + 0.018 * (vnoise(f * 6, seed, 3) - 0.5) * 2 + lean * f);
      pts.push([cx + Math.cos(a) * rr * 1.01, cy + Math.sin(a) * rr]);
    }
    return { pts, kind: "harai", W: W0, press: 0.32, entry: 0.06, haraiFrom: 0.72, haraiDry: 1.7, dryStart: 0.42, dry: 1.3 };
  };
  const s1 = enso(R, 118, 336, R * 0.21, 1, -0.035);
  const s2 = enso(R2, 118 - 60, 338, R * 0.16, 2, 0.03);
  const f1 = buildField([s1], { W: R * 0.21, seed: 12, fibre: fib, bleed: 0.24 });
  const f2 = buildField([s2], { W: R * 0.16, seed: 19, fibre: fib, bleed: 0.24 });
  inkOnto(sheet, f1, { progress: clamp(t2 / 0.35), age: 3 });
  inkOnto(sheet, f2, { progress: clamp((t2 - 0.15) / 0.35), age: 3 });
  const { tash, tok } = clocks();
  const [hh, mm] = tash.split(":").map(Number);
  const hNow = hh + mm / 60;
  const ha = ang(hNow);
  const hand = { pts: [], kind: "harai", W: R * 0.11, press: 0.4, haraiFrom: 0.35, haraiDry: 0.6 };
  for (let i = 0; i <= 40; i++) {
    const f = i / 40;
    hand.pts.push([cx + Math.cos(ha) * R * (0.06 + 0.66 * f), cy + Math.sin(ha) * R * (0.06 + 0.66 * f) + Math.sin(f * 3) * 1.5]);
  }
  const fh = buildField([hand], { W: R * 0.11, seed: 5, fibre: fib, bleed: 0.2 });
  inkOnto(sheet, fh, { progress: 1, age: 3 });
  const pc = layers.paper;
  pc.width = W;
  pc.height = H;
  pc.getContext("2d").putImageData(sheet.img, 0, 0);
  const over = layers.over;
  navBar(over, kvg, { phone });
  el("h2", "h2 jk-h2", `Tokio sifati.<br>Toshkent vaqti va narxi.`, over);
  const times = el("div", "jk-times", `
    <div class="tm"><b>${tash}</b><span><i class="dot feruza"></i>Toshkent \xB7 UTC+5</span></div>
    <div class="tm"><b>${tok}</b><span><i class="dot shu"></i>Tokio \xB7 UTC+9</span></div>`, over);
  el("p", "jk-sub", `4 soat farq \u2014 har kuni 5 soat birga ishlaymiz.`, over);
  let svg = `<svg class="jk-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">`;
  for (const h of [0, 6, 12, 18]) {
    const a = ang(h), r = R * 0.27;
    svg += `<text x="${(cx + Math.cos(a) * r).toFixed(1)}" y="${(cy + Math.sin(a) * r + 4.5).toFixed(1)}" class="tk">${h}</text>`;
  }
  const aA = ang(shared[1]), aB = ang(shared[0]);
  const rl = R2 * 1.36;
  const p0 = [cx + Math.cos(aA) * rl, cy + Math.sin(aA) * rl], p1 = [cx + Math.cos(aB) * rl, cy + Math.sin(aB) * rl];
  svg += `<path id="arcL" d="M ${p0[0].toFixed(1)} ${p0[1].toFixed(1)} A ${rl} ${rl} 0 0 0 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}" fill="none"/>`;
  const fmt = (h) => String(h).padStart(2, "0") + ":00";
  svg += `<text class="arc"><textPath href="#arcL" startOffset="50%" text-anchor="middle">${fmt(shared[0])}\u2013${fmt(shared[1])} \xB7 ${fmt(shared[0] + off)}\u2013${fmt(shared[1] + off)}</textPath></text>`;
  svg += "</svg>";
  el("div", "jk-wrap", svg, over);
  return {};
}
function washOnto(sheet, cx, cy, R, w, ang, bloom) {
  const a0 = ang(w.from), a1 = ang(w.to);
  const span = a1 - a0;
  const rOut = R * w.r1 * 1.08 + 20;
  const x0 = Math.max(0, Math.floor(cx - rOut)), x1 = Math.min(sheet.w - 1, Math.ceil(cx + rOut));
  const y0 = Math.max(0, Math.floor(cy - rOut)), y1 = Math.min(sheet.h - 1, Math.ceil(cy + rOut));
  const d = sheet.data, fibre = sheet.fibre;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const dx = x - cx, dy = y - cy;
    const rho = Math.hypot(dx, dy) / R;
    let th = Math.atan2(dy, dx);
    while (th < a0 - 0.6) th += Math.PI * 2;
    while (th > a0 + Math.PI * 2 - 0.6) th -= Math.PI * 2;
    const u = (th - a0) / span;
    const nA = (vnoise(rho * 8, w.seed, 1) - 0.5) * 0.02 + (vnoise(rho * 30, w.seed, 2) - 0.5) * 4e-3;
    const nR = (vnoise(th * 6, w.seed, 3) - 0.5) * 0.04 + (vnoise(th * 24, w.seed, 4) - 0.5) * 7e-3;
    const front = bloom * 1.2 - vnoise(th * 5, w.seed, 9) * 0.25;
    const dU = Math.min(u - nA, 1 - u - nA) * span * rho * R;
    const dR = Math.min(rho - w.r0 - nR, w.r1 + nR - rho) * R;
    const dE = Math.min(dU, dR);
    if (dE < -2) continue;
    if ((rho - w.r0) / (w.r1 - w.r0) > front) continue;
    let a = clamp((dE + 1.5) / 3);
    const rim = 0.55 * Math.exp(-Math.max(0, dE) / 5);
    const body = 0.82 + 0.18 * vnoise(x / 40, y / 40, w.seed + 11) - 0.12 * smooth(0.2, 0.9, vnoise(x / 90, y / 90, w.seed + 12));
    const gran = (hash2(x, y, w.seed) > 0.62 ? 0.08 : 0) + 0.05 * (vnoise(x / 2.2, y / 2.2, w.seed + 13) - 0.5);
    const P = y * sheet.w + x, o = P * 4;
    const f = fibre[P];
    const A = clamp(w.a * a * (body + rim + gran) * (1 - 0.25 * f));
    d[o] *= 1 - A + A * w.col[0] / 255;
    d[o + 1] *= 1 - A + A * w.col[1] / 255;
    d[o + 2] *= 1 - A + A * w.col[2] / 255;
  }
}
var TZ_T, TZ_K;
var init_jikan = __esm({
  "src/jikan.js"() {
    init_washi();
    init_fude();
    init_common();
    init_noise();
    TZ_T = 5;
    TZ_K = 9;
  }
});

// src/hero.js
init_washi();
init_fude();

// src/kesik.js
function splitPoly(poly, a, d) {
  const side = (p) => (p[0] - a[0]) * d[1] - (p[1] - a[1]) * d[0];
  const L = [], R = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q2 = poly[(i + 1) % poly.length];
    const sp = side(p), sq = side(q2);
    if (sp <= 0) L.push(p);
    if (sp >= 0) R.push(p);
    if (sp < 0 && sq > 0 || sp > 0 && sq < 0) {
      const t2 = sp / (sp - sq);
      const x = [p[0] + (q2[0] - p[0]) * t2, p[1] + (q2[1] - p[1]) * t2];
      L.push(x);
      R.push(x);
    }
  }
  return [L, R];
}
function makeT(T) {
  const { tx = 0, ty = 0, rot = 0, px = 0, py = 0, sx = 1, sy = 1 } = T;
  const r = rot * Math.PI / 180, cs = Math.cos(r), sn = Math.sin(r);
  const a = cs * sx, b = sn * sx, c = -sn * sy, d = cs * sy;
  const e = px + tx - (a * px + c * py), f = py + ty - (b * px + d * py);
  return [a, b, c, d, e, f];
}
var apply = (M, p) => [M[0] * p[0] + M[2] * p[1] + M[4], M[1] * p[0] + M[3] * p[1] + M[5]];
function invert(M) {
  const [a, b, c, d, e, f] = M;
  const det = a * d - b * c;
  return [d / det, -b / det, -c / det, a / det, (c * f - d * e) / det, (b * e - a * f) / det];
}
var cssMatrix = (M) => `matrix(${M.map((v) => +v.toFixed(6)).join(",")})`;
function pathPoly(ctx, poly) {
  ctx.beginPath();
  poly.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
  ctx.closePath();
}
function drawPieces(ctx, pieces, sheetCanvas, opts = {}) {
  const m = opts.m ?? 0;
  for (const pc of pieces) {
    const lift = pc.lift ?? 0;
    ctx.save();
    ctx.setTransform(...pc.M);
    pathPoly(ctx, pc.poly);
    ctx.shadowColor = `rgba(14,10,34,${0.28 + 0.1 * lift})`;
    ctx.shadowBlur = 24 + 20 * lift;
    ctx.shadowOffsetX = 6 + 8 * lift;
    ctx.shadowOffsetY = 10 + 16 * lift;
    ctx.fillStyle = "#2a2420";
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.setTransform(...pc.M);
    pathPoly(ctx, pc.poly);
    ctx.shadowColor = "rgba(8,8,24,.35)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 1.5;
    ctx.shadowOffsetY = 2.5;
    ctx.fillStyle = "#2a2420";
    ctx.fill();
    ctx.restore();
  }
  for (const pc of pieces) {
    ctx.save();
    ctx.setTransform(...pc.M);
    pathPoly(ctx, pc.poly);
    ctx.clip();
    ctx.drawImage(sheetCanvas, -m, -m);
    if (pc.tint) {
      ctx.fillStyle = pc.tint;
      ctx.fillRect(-m, -m, sheetCanvas.width, sheetCanvas.height);
    }
    ctx.restore();
  }
  for (const pc of pieces) {
    for (const [p, q2, inward] of pc.cuts || []) {
      const P = apply(pc.M, p), Q = apply(pc.M, q2);
      const dx = Q[0] - P[0], dy = Q[1] - P[1], L = Math.hypot(dx, dy);
      let nx = -dy / L, ny = dx / L;
      if (inward < 0) {
        nx = -nx;
        ny = -ny;
      }
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.lineCap = "butt";
      ctx.strokeStyle = "rgba(20,16,12,.55)";
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(P[0] + nx * 0.3, P[1] + ny * 0.3);
      ctx.lineTo(Q[0] + nx * 0.3, Q[1] + ny * 0.3);
      ctx.stroke();
      ctx.strokeStyle = "rgba(246,241,230,.9)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(P[0] + nx * 1.25, P[1] + ny * 1.25);
      ctx.lineTo(Q[0] + nx * 1.25, Q[1] + ny * 1.25);
      ctx.stroke();
      ctx.restore();
    }
  }
}
function drawGlint(ctx, P, Q, t2, opts = {}) {
  const tail = opts.tail ?? 0.35, I = opts.intensity ?? 1;
  const hx = P[0] + (Q[0] - P[0]) * t2, hy = P[1] + (Q[1] - P[1]) * t2;
  const t0 = Math.max(0, t2 - tail);
  const sx = P[0] + (Q[0] - P[0]) * t0, sy = P[1] + (Q[1] - P[1]) * t0;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const g = ctx.createLinearGradient(sx, sy, hx, hy);
  g.addColorStop(0, "rgba(217,222,226,0)");
  g.addColorStop(0.75, `rgba(230,234,238,${0.45 * I})`);
  g.addColorStop(1, `rgba(255,252,246,${1 * I})`);
  ctx.strokeStyle = g;
  ctx.lineCap = "round";
  ctx.shadowColor = `rgba(220,228,236,${0.9 * I})`;
  ctx.shadowBlur = 10;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(hx, hy);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.lineWidth = 7;
  ctx.globalAlpha = 0.18 * I;
  ctx.stroke();
  ctx.globalAlpha = 1;
  const R = opts.flare ?? 64;
  const rg = ctx.createRadialGradient(hx, hy, 0, hx, hy, R);
  rg.addColorStop(0, `rgba(255,253,248,${0.95 * I})`);
  rg.addColorStop(0.1, `rgba(244,246,248,${0.55 * I})`);
  rg.addColorStop(0.35, `rgba(226,232,238,${0.14 * I})`);
  rg.addColorStop(1, "rgba(220,228,236,0)");
  ctx.fillStyle = rg;
  ctx.beginPath();
  ctx.ellipse(hx, hy, R, R, 0, 0, Math.PI * 2);
  ctx.fill();
  const ang = Math.atan2(Q[1] - P[1], Q[0] - P[0]);
  ctx.translate(hx, hy);
  ctx.rotate(ang);
  const lg = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  lg.addColorStop(0, `rgba(255,255,252,${0.85 * I})`);
  lg.addColorStop(1, "rgba(255,255,255,0)");
  ctx.save();
  ctx.scale(opts.streak ?? 240, 2.6);
  ctx.fillStyle = lg;
  ctx.beginPath();
  ctx.arc(0, 0, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.scale(70, 7);
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = lg;
  ctx.beginPath();
  ctx.arc(0, 0, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// src/hero.js
init_seal();
init_abr();
init_common();
init_noise();
async function hero(S) {
  const { W, H, kvg, phone, layers, mode } = S;
  const m = 40;
  const L = phone ? { y: 0.36, x0: 0.06, x1: 0.94, bw: 80, rail: 30, up: 0.165, down: 0.155, rt: 0.5, rb: -0.6, flat: 0.4 } : { y: 0.47, x0: 0.07, x1: 0.93, bw: 150, rail: 56, up: 0.2, down: 0.165, rt: 0.4, rb: -0.5, flat: 0.36 };
  let T = mode.T ?? 16;
  let open, glint = -1, wetAge;
  let wedge = null;
  if (mode.wedge != null) {
    wedge = mode.wedge;
    T = 1.95;
    open = 0;
  } else if (mode.cut != null) {
    open = mode.cut;
    T = 2.05 + 0.9 * open;
  } else if (mode.glint != null) {
    T = 1.8 + 0.25 * mode.glint;
  }
  const strokeP = clamp((T - 0.35) / 1.45);
  if (open == null) open = expoOut(clamp((T - 2.05) / 0.9));
  if (T >= 1.8 && T < 2.12) glint = expoIn(clamp((T - 1.8) / 0.25));
  const sw = W + 2 * m, sh = H + 2 * m;
  const sheet = bakeWashi(sw, sh, { seed: 11, scale: phone ? 0.75 : 1 });
  const k1 = kvg["\u4E00"];
  const ux0 = 11, ux1 = 96.88;
  const s = (L.x1 - L.x0) * W / (ux1 - ux0);
  const box = { x: L.x0 * W - ux0 * s, y: L.y * H - 52 * s, size: 109 * s };
  const st = kanjiStrokes(k1, box, { per: [{ W: L.bw, dryStart: 0.5, dry: 2.1, press: 0.25 }] });
  {
    const yy = st[0].pts[0][1];
    st[0].pts.forEach((p) => {
      p[1] = yy + (p[1] - yy) * L.flat;
    });
  }
  const fib = { data: sheet.fibre, w: sw, h: sh, ox: -m, oy: -m };
  const f1 = buildField(st, { W: L.bw, seed: 21, fibre: fib, bleed: 0.24 });
  const wetK = 0.9;
  inkOnto(sheet, f1, { progress: strokeP, ox: m, oy: m, wetK: 1.2, age: Math.max(0, T - 1.55) * wetK, gloss: 1 });
  const P = st[0].pts;
  let sx = 0, sy = 0, sxx = 0, sxy = 0, n = 0;
  for (let i = Math.floor(P.length * 0.08); i < P.length * 0.92; i++) {
    const [x, y] = P[i];
    sx += x;
    sy += y;
    sxx += x * x;
    sxy += x * y;
    n++;
  }
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx), icpt = (sy - slope * sx) / n;
  const lineY = (x) => slope * x + icpt;
  const A = [-m - 50, lineY(-m - 50)], B = [W + m + 50, lineY(W + m + 50)];
  const dir = [B[0] - A[0], B[1] - A[1]];
  const rect = [[-m, -m], [W + m, -m], [W + m, H + m], [-m, H + m]];
  let [p1, p2] = splitPoly(rect, A, dir);
  const cy = (p) => p.reduce((a, q2) => a + q2[1], 0) / p.length;
  const topPoly = cy(p1) < cy(p2) ? p1 : p2, botPoly = topPoly === p1 ? p2 : p1;
  const pivot = { px: W / 2, py: lineY(W / 2) };
  const settle = open;
  let Mt = makeT({ ...pivot, ty: -L.up * H * settle, rot: L.rt * settle });
  let Mb = makeT({ ...pivot, ty: L.down * H * settle, rot: L.rb * settle });
  let headX = 0;
  if (wedge != null) {
    headX = L.x0 * W - 60 + wedge * ((L.x1 - L.x0) * W + 140);
    const hp = { px: headX, py: lineY(headX) };
    const ang = (phone ? 6 : 4.6) * (0.35 + 0.65 * wedge);
    Mt = makeT({ ...hp, rot: ang });
    Mb = makeT({ ...hp, rot: -ang * 0.8 });
    open = 1e-4;
  }
  const cutA = [A[0], A[1]], cutB = [B[0], B[1]];
  const iMb = invert(Mb), iMt = invert(Mt);
  const botEdgeY = (x) => {
    const a = apply(Mb, cutA), b = apply(Mb, cutB);
    return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]);
  };
  const topEdgeY = (x) => {
    const a = apply(Mt, cutA), b = apply(Mt, cutB);
    return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]);
  };
  const kenP = clamp((T - 6) / 2.2);
  let kenBox = null;
  if (kenP > 0) {
    const kx = phone ? 22 : 104;
    const kTop = botEdgeY(kx + 60) + L.rail + (phone ? 50 : 34);
    const kH = phone ? 172 : Math.min(230, H - 34 - kTop);
    const size = kH / 0.8;
    const scr = { x: kx - 13 * (size / 109), y: kTop - 15 * (size / 109), size };
    const o = apply(iMb, [scr.x, scr.y]);
    const bw = size * 0.11;
    const kst = kanjiStrokes(kvg["\u5263"], { x: o[0], y: o[1], size }, {});
    const fk = buildField(kst, { W: bw, seed: 5, fibre: fib, dry: 1, dryStart: 0.5, bleed: 0.2 });
    inkOnto(sheet, fk, { progress: kenP, ox: m, oy: m, wetK: 1.6, age: Math.max(0, T - 8.2) * 0.9 });
    kenBox = { x: kx, y: kTop, w: kH * 0.85, h: kH };
  }
  const sealOn = T >= 3.5;
  const sealSize = phone ? 84 : 110;
  let sealC = { x: W - 104 - sealSize / 2, y: H - 52 - sealSize / 2 };
  if (phone) {
    const kTop = botEdgeY(82) + L.rail + 50;
    sealC = { x: W - 22 - sealSize / 2, y: kTop + 172 - sealSize / 2 };
  }
  if (sealOn) {
    const hs = houseSeal(sealSize, { k: 3, seed: 5 });
    const o = apply(iMb, [sealC.x, sealC.y]);
    stampOnto(sheet, hs, o[0] + m, o[1] + m, sealSize, -2 - L.rb, { strength: 0.96 });
  }
  const sc = document.createElement("canvas");
  sc.width = sw;
  sc.height = sh;
  sc.getContext("2d").putImageData(sheet.img, 0, 0);
  const cloth = layers.cloth;
  const abr = createAbr(cloth);
  const gapTopL = topEdgeY(0), gapBotL = botEdgeY(0);
  const under = layers.under;
  const hb = el("div", "hero-gap" + (phone ? " phone" : ""), null, under);
  const h1 = el("h1", "h1", phone ? `Yapon IT<br>agenstvasi<br>endi <em>O${OK}zbekistonda!</em>` : `Yapon IT agenstvasi<br>endi <em>O${OK}zbekistonda!</em>`, hb);
  const sub = el("p", "sub", `Mobil ilovalar, saytlar, Telegram botlar va AI \u2014 yapon sifati bilan, Toshkentda.`, hb);
  await document.fonts.ready;
  const hx = phone ? 22 : 104;
  hb.style.left = hx + "px";
  const bh = hb.getBoundingClientRect().height;
  const bwid = hb.getBoundingClientRect().width;
  const cxT = hx + bwid * 0.42;
  const settledTop = (topEdgeY(cxT) + botEdgeY(cxT)) / 2 - bh / 2 + (phone ? 4 : 2);
  const rise = wedge != null ? 10 : 24 * (1 - easeInOut(clamp((T - 2.05) / 0.9)));
  hb.style.top = settledTop + rise + "px";
  if (T < 2.9) {
    sub.style.opacity = 0;
  }
  const r = hb.getBoundingClientRect();
  abr.render({
    w: W,
    h: H,
    dpr: 1,
    time: T,
    contrast: phone ? 0.62 : 0.46,
    scale: phone ? 0.62 : 1,
    boxes: phone ? [[r.left - 10, r.top + 4, r.width * 0.92, r.height - 8]] : [[r.left - 30, r.top - 10, r.width + 60, r.height + 20]],
    sheen: phone ? [W * 0.75, (gapTopL + gapBotL) / 2 - 40, 0.12] : [W * 0.8, topEdgeY(W * 0.8) + 92, 0.24],
    shade: [W * 0.45, (topEdgeY(W / 2) + botEdgeY(W / 2)) / 2, W * 0.75, 0.16],
    seed: 0.37
  });
  const pc = layers.paper;
  pc.width = W;
  pc.height = H;
  const ctx = pc.getContext("2d");
  ctx.clearRect(0, 0, W, H);
  let pieces = [
    { poly: topPoly, M: Mt, cuts: [[cutA, cutB, -1]], lift: open < 1 ? Math.sin(Math.PI * open) * 0.9 : 0 },
    { poly: botPoly, M: Mb, cuts: [[cutA, cutB, 1]], lift: open < 1 ? Math.sin(Math.PI * open) * 0.7 : 0 }
  ];
  if (wedge != null) {
    const hp = [headX, lineY(headX)];
    const [tl] = splitPoly(topPoly, hp, [0, 1]), [bl] = splitPoly(botPoly, hp, [0, 1]);
    const [, right] = splitPoly(rect, hp, [0, 1]);
    const I = [1, 0, 0, 1, 0, 0];
    pieces = [
      { poly: right, M: I, cuts: [], lift: 0 },
      { poly: tl, M: Mt, cuts: [[cutA, hp, -1]], lift: 0.5 },
      { poly: bl, M: Mb, cuts: [[cutA, hp, 1]], lift: 0.4 }
    ];
  }
  if (open > 2e-3 || wedge != null) drawPieces(ctx, pieces, sc, { m });
  else {
    ctx.drawImage(sc, -m, -m);
  }
  const fx = layers.fx;
  fx.width = W;
  fx.height = H;
  const g = fx.getContext("2d");
  const gx0 = L.x0 * W - 40, gx1 = L.x1 * W + 60;
  if (glint >= 0 && wedge == null) {
    drawGlint(g, [gx0, lineY(gx0)], [gx1, lineY(gx1)], Math.min(1, glint * 1.08), { tail: 0.55, intensity: 1 });
  }
  if (wedge != null) {
    for (const [M, k] of [[Mt, 1], [Mb, 0.85]]) {
      const a = apply(M, [gx0, lineY(gx0)]), b = apply(M, [headX, lineY(headX)]);
      g.save();
      g.globalCompositeOperation = "lighter";
      const lg = g.createLinearGradient(a[0], a[1], b[0], b[1]);
      lg.addColorStop(0, "rgba(226,232,238,0.05)");
      lg.addColorStop(0.6, `rgba(230,236,240,${0.35 * k})`);
      lg.addColorStop(1, `rgba(255,255,252,${1 * k})`);
      g.strokeStyle = lg;
      g.lineWidth = 2;
      g.shadowColor = "rgba(225,232,238,.95)";
      g.shadowBlur = 12;
      g.beginPath();
      g.moveTo(a[0], a[1]);
      g.lineTo(b[0], b[1]);
      g.stroke();
      g.restore();
    }
    drawGlint(g, [gx0, lineY(gx0)], [headX, lineY(headX)], 1, { tail: 0.22, intensity: 1 });
  }
  if (open > 0 && open < 1 && wedge == null) {
    const I = Math.pow(1 - open, 0.85);
    for (const M of [Mt, Mb]) {
      const a = apply(M, [gx0, lineY(gx0)]), b = apply(M, [gx1, lineY(gx1)]);
      g.save();
      g.globalCompositeOperation = "lighter";
      const lg = g.createLinearGradient(a[0], a[1], b[0], b[1]);
      lg.addColorStop(0, "rgba(226,232,238,0)");
      lg.addColorStop(0.55, `rgba(226,232,238,${0.35 * I})`);
      lg.addColorStop(1, `rgba(246,248,250,${0.95 * I})`);
      g.strokeStyle = lg;
      g.lineWidth = 1.8;
      g.shadowColor = `rgba(220,228,236,${0.9 * I})`;
      g.shadowBlur = 10;
      g.beginPath();
      g.moveTo(a[0], a[1]);
      g.lineTo(b[0], b[1]);
      g.stroke();
      g.restore();
    }
    const ex = Math.min(W - 18, gx1 + 30), eyT = topEdgeY(ex), eyB = botEdgeY(ex), eyM = (eyT + eyB) / 2;
    g.save();
    g.globalCompositeOperation = "lighter";
    for (const [yy, k] of [[eyT, 1], [eyB, 0.8]]) {
      g.save();
      g.translate(ex, yy);
      g.rotate(Math.atan(slope));
      const rg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
      rg.addColorStop(0, `rgba(255,255,252,${0.95 * I * k})`);
      rg.addColorStop(0.25, `rgba(232,238,244,${0.35 * I * k})`);
      rg.addColorStop(1, "rgba(220,228,236,0)");
      g.fillStyle = rg;
      g.scale(260, 5);
      g.beginPath();
      g.arc(0, 0, 1, 0, Math.PI * 2);
      g.fill();
      g.restore();
      const r2 = g.createRadialGradient(ex, yy, 0, ex, yy, 40);
      r2.addColorStop(0, `rgba(255,255,250,${0.7 * I * k})`);
      r2.addColorStop(1, "rgba(255,255,250,0)");
      g.fillStyle = r2;
      g.fillRect(ex - 40, yy - 40, 80, 80);
    }
    g.restore();
  }
  const over = layers.over;
  if (wedge != null) {
    const lb = el("div", "cutname", `<span lang="ja">\u6A2A\u4E00\u6587\u5B57</span><b>YOKO-ICHIMONJI</b>`, over);
    lb.style.left = Math.min(W - 40, headX + 26) + "px";
    lb.style.top = topEdgeY(headX) - L.rail - (phone ? 150 : 196) + "px";
  } else if (T >= 1.8 && T < 2.6) {
    const lb = el("div", "cutname", `<span lang="ja">\u6A2A\u4E00\u6587\u5B57</span><b>YOKO-ICHIMONJI</b>`, over);
    const ey = topEdgeY(W - 60) - L.rail;
    const a = clamp((T - 1.9) / 0.1) * (1 - clamp((T - 2.5) / 0.1));
    lb.style.left = W - (phone ? 34 : 58) + "px";
    lb.style.top = ey - (phone ? 150 : 200) + "px";
    lb.style.opacity = a;
  }
  if (T >= 4) {
    navBar(over, kvg, { phone });
    const topG = el("div", "piece-ui", null, over);
    topG.style.transform = cssMatrix(Mt);
    const { tash, tok } = clocks();
    const ck = el("div", "clocks", `<span>TOSHKENT</span> <b>${tash}</b><i>\xB7</i><span>TOKIO</span> <b>${tok}</b>`, topG);
    const want = phone ? [22, topEdgeY(22) - L.rail - 30] : [W - 104 - 300, topEdgeY(W - 400) - L.rail - 40];
    const pp = apply(iMt, want);
    ck.style.left = pp[0] + "px";
    ck.style.top = pp[1] + "px";
    if (!phone) ck.style.width = "300px";
  }
  if (T >= 3.6) {
    const botG = el("div", "piece-ui", null, over);
    botG.style.transform = cssMatrix(Mb);
    const sig = el("div", "signature", '<span lang="ja">\u30BF\u30B7\u30B1\u30F3\u30C8</span><span lang="ja" class="k">\u5263</span>', botG);
    const sp = apply(iMb, [sealC.x - sealSize / 2 - (phone ? 10 : 16), sealC.y - sealSize / 2 + 2]);
    sig.style.left = sp[0] + "px";
    sig.style.top = sp[1] + "px";
    sig.style.opacity = clamp((T - 3.6) / 0.6);
    if (T >= 12.6) {
      const cap = el("p", "caption", `<svg viewBox="0 0 40 10" width="34" height="10" aria-hidden="true"><path d="M1 6 C7 1, 11 9, 17 5 S 27 2, 32 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>Sekin \u2014 qalam. <svg viewBox="0 0 40 10" width="34" height="10" aria-hidden="true"><path d="M1 8 L39 2" stroke="currentColor" stroke-width="1.1"/></svg>Tez \u2014 qilich.`, botG);
      const cx = phone ? 22 : kenBox ? kenBox.x + kenBox.w + 70 : 104;
      const cyp = phone ? H - 48 : H - 58;
      const q2 = apply(iMb, [cx, cyp]);
      cap.style.left = q2[0] + "px";
      cap.style.top = q2[1] + "px";
      if (phone) {
        cap.style.left = q2[0] + "px";
      }
    }
  }
  return { open, T };
}

// src/main.js
var q = new URLSearchParams((window.__QS||location.search));
var scene = q.get("scene") || "hero";
var t = q.has("t") ? parseFloat(q.get("t")) : null;
async function boot() {
  const W = innerWidth, H = innerHeight;
  const phone = W < 700;
  document.documentElement.classList.toggle("phone", phone);
  await Promise.all([
    document.fonts.load('300 120px "Noto Serif Display"'),
    document.fonts.load('italic 300 120px "Noto Serif Display"'),
    document.fonts.load("400 16px Onest"),
    document.fonts.load("500 16px Onest"),
    document.fonts.load('400 13px "IBM Plex Mono"'),
    document.fonts.load('500 13px "IBM Plex Mono"'),
    document.fonts.load('800 20px "Shippori Mincho B1"', "\u5263\u30BF\u30B7\u30B1\u30F3\u30C8"),
    document.fonts.load('500 20px "Shippori Mincho B1"', "\u5263\u30BF\u30B7\u30B1\u30F3\u30C8")
  ]);
  const [kvg, glyphs] = await Promise.all([fetch("data/kanjivg.json").then((r) => r.json()), fetch("data/glyphs.json").then((r) => r.json())]);
  const layers = {
    cloth: document.getElementById("cloth"),
    under: document.getElementById("under"),
    paper: document.getElementById("paper"),
    over: document.getElementById("over"),
    fx: document.getElementById("fx")
  };
  const S = { W, H, phone, kvg, glyphs, layers };
  const t0 = performance.now();
  if (scene === "hero") await hero({ ...S, mode: { T: t ?? 16 } });
  else if (scene === "cut") await hero({ ...S, mode: { cut: t ?? 0.5 } });
  else if (scene === "wedge") await hero({ ...S, mode: { wedge: t ?? 0.72 } });
  else if (scene === "glint") await hero({ ...S, mode: { glint: t ?? 0.7 } });
  else if (scene === "bunbu") {
    const m = await Promise.resolve().then(() => (init_bunbu(), bunbu_exports));
    await m.bunbu({ ...S, t: t ?? 0.62 });
  } else if (scene === "tanzaku") {
    const m = await Promise.resolve().then(() => (init_tanzaku(), tanzaku_exports));
    await m.tanzaku({ ...S, t: t ?? 1 });
  } else if (scene === "time") {
    const m = await Promise.resolve().then(() => (init_jikan(), jikan_exports));
    await m.jikan({ ...S, t: t ?? 1 });
  }
  document.documentElement.dataset.ready = "1";
  console.log("scene", scene, "built in", Math.round(performance.now() - t0), "ms");
}
boot().catch((e) => {
  console.error(e);
  document.body.dataset.err = e.message;
});
