// Washi / Samarqand mulberry paper, baked once with Canvas2D + per-pixel work.
// Returns a "sheet": its RGBA pixels, a fibre channel (0..1) and a canvas.
import { mulberry, vnoise, hash2, hex, clamp } from './noise.js';

export function bakeWashi(w, h, opts = {}) {
  const seed = opts.seed ?? 7;
  const base = hex(opts.color ?? '#EEE6D4');
  const deep = hex(opts.deep ?? '#DFD2B8'), lite = hex(opts.lite ?? '#F6F1E6');
  const rnd = mulberry(seed * 9973 + 11);
  const scale = opts.scale ?? 1; // feature scale (phones use a little smaller)

  // ---- 1. formation clouds (kumo): low-frequency field on a coarse grid, upsampled
  const q = 4, gw = Math.ceil(w / q) + 2, gh = Math.ceil(h / q) + 2;
  const low = new Float32Array(gw * gh);
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
    const x = i * q, y = j * q;
    const wx = vnoise(x / (160 * scale), y / (160 * scale), seed + 3) - 0.5;
    const wy = vnoise(x / (160 * scale), y / (160 * scale), seed + 4) - 0.5;
    const X = x + wx * 70, Y = y + wy * 70;
    const n1 = vnoise(X / (230 * scale), Y / (230 * scale), seed) * 0.6 + vnoise(X / (115 * scale), Y / (115 * scale), seed + 1) * 0.4;
    const n2 = vnoise(X / (46 * scale), Y / (46 * scale), seed + 5);
    // flocs: clumpy, slightly contrasted
    const floc = Math.pow(n2, 1.6);
    low[j * gw + i] = (opts.clouds ?? 1) * (0.034 * (n1 - 0.5) * 2 + 0.03 * (floc - 0.3) * 2);
  }
  const img = new ImageData(w, h); const d = img.data;
  for (let y = 0; y < h; y++) {
    const gy = y / q, j0 = Math.floor(gy), fy = gy - j0;
    for (let x = 0; x < w; x++) {
      const gx = x / q, i0 = Math.floor(gx), fx = gx - i0;
      const a = low[j0 * gw + i0], b = low[j0 * gw + i0 + 1], c = low[(j0 + 1) * gw + i0], e = low[(j0 + 1) * gw + i0 + 1];
      const L = a + (b - a) * fx + (c - a) * fy + (a - b - c + e) * fx * fy;
      const n3 = vnoise(x / (7 * scale), y / (7 * scale), seed + 9) - 0.5;
      const k = L + 0.016 * n3;
      const o = (y * w + x) * 4;
      // denser pulp goes toward washi-deep (warmer), thin spots toward fibre-white
      if (k < 0) { const t = Math.min(1, -k / 0.07); d[o] = base[0] + (deep[0] - base[0]) * t; d[o + 1] = base[1] + (deep[1] - base[1]) * t; d[o + 2] = base[2] + (deep[2] - base[2]) * t; }
      else { const t = Math.min(1, k / 0.07); d[o] = base[0] + (lite[0] - base[0]) * t; d[o + 1] = base[1] + (lite[1] - base[1]) * t; d[o + 2] = base[2] + (lite[2] - base[2]) * t; }
      d[o + 3] = 255;
    }
  }

  // ---- 2. fibres on their own layer (white-ish), also kept as a channel
  const fc = document.createElement('canvas'); fc.width = w; fc.height = h;
  const fx = fc.getContext('2d');
  fx.lineCap = 'round';
  const area = (w * h) / (2048 * 1024);
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
    fx.beginPath(); fx.moveTo(x0, y0);
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

  // ---- 3. darker fibres + bark flecks (chiri) drawn on top
  const tmp = document.createElement('canvas'); tmp.width = w; tmp.height = h;
  const tx = tmp.getContext('2d');
  tx.putImageData(img, 0, 0);
  tx.lineCap = 'round';
  const nDark = Math.round(380 * area);
  for (let i = 0; i < nDark; i++) {
    const len = (30 + rnd() * 150) * scale, ang = rnd() * Math.PI * 2;
    const x0 = rnd() * w, y0 = rnd() * h, b = (rnd() - 0.5) * len * 0.25;
    tx.beginPath(); tx.moveTo(x0, y0);
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
      const a = (j / k) * Math.PI * 2, rr = r * (0.55 + rnd() * 0.7);
      j ? tx.lineTo(x0 + Math.cos(a) * rr, y0 + Math.sin(a) * rr * 0.8) : tx.moveTo(x0 + Math.cos(a) * rr, y0 + Math.sin(a) * rr * 0.8);
    }
    tx.closePath();
    tx.fillStyle = `rgba(${120 + rnd() * 30},${98 + rnd() * 20},${70 + rnd() * 14},${0.45 + rnd() * 0.4})`;
    tx.fill();
  }
  const nSliver = Math.round(10 * area * chiri);
  for (let i = 0; i < nSliver; i++) {
    const len = (8 + rnd() * 14) * scale, ang = rnd() * Math.PI * 2, x0 = rnd() * w, y0 = rnd() * h;
    tx.beginPath(); tx.moveTo(x0, y0);
    tx.quadraticCurveTo(x0 + Math.cos(ang + 0.12) * len * 0.5, y0 + Math.sin(ang + 0.12) * len * 0.5, x0 + Math.cos(ang) * len, y0 + Math.sin(ang) * len);
    tx.lineWidth = 0.7 + rnd() * 0.5;
    tx.strokeStyle = `rgba(140,116,84,${0.22 + rnd() * 0.2})`;
    tx.stroke();
  }
  const out = tx.getImageData(0, 0, w, h);
  const od = out.data;
  // ---- 4. per-pixel grain (static, +-3)
  for (let p = 0, o = 0; p < w * h; p++, o += 4) {
    const g = (hash2(p % w, (p / w) | 0, seed + 77) - 0.5) * 6;
    od[o] += g; od[o + 1] += g; od[o + 2] += g * 0.9;
  }
  return { w, h, data: od, base: new Uint8ClampedArray(od), fibre, img: out };
}

export function sheetCanvas(sheet) {
  const c = document.createElement('canvas'); c.width = sheet.w; c.height = sheet.h;
  c.getContext('2d').putImageData(sheet.img, 0, 0);
  return c;
}
