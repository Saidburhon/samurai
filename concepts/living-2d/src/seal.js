// Muhr 印 — the two seals. House seal: QILICH in square banna'i lettering (shubun, red letters).
// Name seal: 剣 knocked out of a vermilion square (hakubun). Both eroded procedurally.
import { vnoise, hash2, clamp, smooth } from './noise.js';

// 15x15 banna'i grid. '#' = paste.
const GRID = [
  '###############',
  '#.............#',
  '#.###.###.#...#',
  '#.#.#..#..#...#',
  '#.#.#..#..#...#',
  '#.#.#..#..#...#',
  '#.###.###.#####',
  '#...#.........#',
  '#.###.###.#.#.#',
  '#..#..#...#.#.#',
  '#..#..#...###.#',
  '#..#..#...#.#.#',
  '#####.###.#.#.#',
  '#.............#',
  '###############',
];

function erode(mask, S, k, opts) {
  // mask: alpha 0..255 Uint8ClampedArray (S*k)^2; returns ImageData with shu paste
  const N = S * k;
  const out = new ImageData(N, N);
  const blur = opts.blur; // blurred alpha for edge proximity
  const seed = opts.seed ?? 3;
  const col = opts.colour ?? [205, 64, 40];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    // displaced lookup -> irregular edges
    const E = opts.erosion ?? 1;
    const nx = ((vnoise(x / (2.2 * k), y / (2.2 * k), seed) - 0.5) * 2.4 * k + (vnoise(x / (0.7 * k), y / (0.7 * k), seed + 1) - 0.5) * 0.9 * k) * E;
    const ny = ((vnoise(x / (2.2 * k), y / (2.2 * k), seed + 2) - 0.5) * 2.4 * k + (vnoise(x / (0.7 * k), y / (0.7 * k), seed + 3) - 0.5) * 0.9 * k) * E;
    const sx = clamp(Math.round(x + nx), 0, N - 1), sy = clamp(Math.round(y + ny), 0, N - 1);
    let a = mask[(sy * N + sx) * 4 + 3] / 255;
    if (a <= 0) continue;
    const b = blur[(y * N + x) * 4 + 3] / 255;
    // paste denser at the edges of each mark
    const edge = 1 - Math.abs(b - 0.5) * 2;
    // speckle holes and uneven pressure
    const sp = vnoise(x / (1.25 * k), y / (1.25 * k), seed + 5);
    const big = vnoise(x / (9 * k), y / (9 * k), seed + 6);
    let cov = 1;
    if (sp > 0.74 - 0.14 * (1 - big) + (1 - E) * 0.5) cov *= 0.06;
    if (hash2(x, y, seed + 7) > 0.975 + (1 - E) * 0.024) cov *= 0.2;
    if (vnoise(x / (0.5 * k), y / (0.5 * k), seed + 12) > 0.82 + (1 - E) * 0.3) cov *= 0.35;
    cov *= 0.78 + 0.22 * smooth(0.15, 0.6, big);
    cov *= 0.86 + 0.14 * edge;
    const dark = 1 - 0.14 * edge - 0.06 * (vnoise(x / (3 * k), y / (3 * k), seed + 8));
    const o = (y * N + x) * 4;
    out.data[o] = col[0] * dark; out.data[o + 1] = col[1] * dark; out.data[o + 2] = col[2] * dark;
    out.data[o + 3] = 255 * a * cov;
  }
  return out;
}

export function houseSeal(size, opts = {}) {
  const k = opts.k ?? 3, S = Math.round(size), N = S * k;
  const m = document.createElement('canvas'); m.width = m.height = N;
  const g = m.getContext('2d', { willReadFrequently: true });
  const c = N / 15;
  g.fillStyle = '#000';
  // frame: irregular thickness
  for (let r = 0; r < 15; r++) for (let q = 0; q < 15; q++) {
    if (GRID[r][q] !== '#') continue;
    const isFrame = r === 0 || r === 14 || q === 0 || q === 14;
    const j = isFrame ? 0.1 : 0.04;
    const jx = (hash2(r, q, 11) - 0.5) * c * j, jy = (hash2(q, r, 12) - 0.5) * c * j;
    g.fillRect(q * c + jx - 0.5, r * c + jy - 0.5, c + 1, c + 1);
  }
  const mask = g.getImageData(0, 0, N, N).data;
  const bc = document.createElement('canvas'); bc.width = bc.height = N;
  const bg = bc.getContext('2d', { willReadFrequently: true }); bg.filter = `blur(${c * 0.28}px)`; bg.drawImage(m, 0, 0);
  const blur = bg.getImageData(0, 0, N, N).data;
  const im = erode(mask, S, k, { blur, seed: opts.seed ?? 5, colour: opts.colour });
  const out = document.createElement('canvas'); out.width = out.height = N;
  out.getContext('2d', { willReadFrequently: true }).putImageData(im, 0, 0);
  return out;
}

export function nameSeal(size, opts = {}) {
  const k = opts.k ?? 3, S = Math.round(size), N = S * k;
  const m = document.createElement('canvas'); m.width = m.height = N;
  const g = m.getContext('2d', { willReadFrequently: true });
  g.fillStyle = '#000';
  const r = N * 0.04;
  g.beginPath(); g.roundRect(N * 0.02, N * 0.02, N * 0.96, N * 0.96, r); g.fill();
  g.globalCompositeOperation = 'destination-out';
  g.font = `800 ${N * 0.84}px "Shippori Mincho B1"`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('剣', N / 2, N * 0.54);
  const mask = g.getImageData(0, 0, N, N).data;
  const bc = document.createElement('canvas'); bc.width = bc.height = N;
  const bg = bc.getContext('2d', { willReadFrequently: true }); bg.filter = `blur(${N * 0.02}px)`; bg.drawImage(m, 0, 0);
  const blur = bg.getImageData(0, 0, N, N).data;
  const im = erode(mask, S, k, { blur, seed: opts.seed ?? 9, colour: opts.colour, erosion: opts.erosion ?? 0.25 });
  const out = document.createElement('canvas'); out.width = out.height = N;
  out.getContext('2d', { willReadFrequently: true }).putImageData(im, 0, 0);
  return out;
}

// multiply a (red) canvas onto a sheet's pixels, centred at (cx, cy), rotated, scaled to size.
export function stampOnto(sheet, src, cx, cy, size, rotDeg = 0, opts = {}) {
  const pad = Math.ceil(size * 0.2);
  const T = Math.ceil(size + pad * 2);
  const c = document.createElement('canvas'); c.width = c.height = T;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.translate(T / 2, T / 2); g.rotate(rotDeg * Math.PI / 180);
  g.imageSmoothingQuality = 'high';
  g.drawImage(src, -size / 2, -size / 2, size, size);
  const d = g.getImageData(0, 0, T, T).data;
  const x0 = Math.round(cx - T / 2), y0 = Math.round(cy - T / 2);
  const sd = sheet.data, fib = sheet.fibre;
  const strength = opts.strength ?? 1;
  for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
    const a = (d[(y * T + x) * 4 + 3] / 255) * strength; if (a <= 0.003) continue;
    const X = x0 + x, Y = y0 + y; if (X < 0 || Y < 0 || X >= sheet.w || Y >= sheet.h) continue;
    const P = Y * sheet.w + X, o = P * 4;
    const f = fib[P];
    const aa = a * (1 - 0.3 * f); // paste skips raised fibres
    const r = d[(y * T + x) * 4] / 255, gg = d[(y * T + x) * 4 + 1] / 255, b = d[(y * T + x) * 4 + 2] / 255;
    sd[o] *= 1 - aa + aa * r * 1.08; sd[o + 1] *= 1 - aa + aa * gg; sd[o + 2] *= 1 - aa + aa * b;
  }
}
