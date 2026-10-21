// Procedural paper: washi (kozo fibres, cloudy formation, bark specks), togi (the same, cleaner), ganch plaster
// (smoother formation, trowel arcs, no fibres) and the grain. No image files: each tile is drawn once and handed
// to CSS as a blob URL in a custom property.
import { mulberry } from '../sword/geom-core.js';

function formation(x, size, r, cell, amp, grainAmp, tint) {
  const img = x.getImageData(0, 0, size, size), d = img.data, n = size / cell, g = [];
  for (let j = 0; j <= n; j++) { g.push([]); for (let i = 0; i <= n; i++) g[j].push(r()); }
  for (let j = 0; j <= n; j++) g[j][n] = g[j][0];
  for (let i = 0; i <= n; i++) g[n][i] = g[0][i];
  for (let y = 0; y < size; y++) for (let xx = 0; xx < size; xx++) {
    const gx = xx / cell, gy = y / cell, i0 = gx | 0, j0 = gy | 0, fx = gx - i0, fy = gy - j0;
    const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
    const cl = (g[j0][i0] * (1 - sx) + g[j0][i0 + 1] * sx) * (1 - sy) + (g[j0 + 1][i0] * (1 - sx) + g[j0 + 1][i0 + 1] * sx) * sy;
    const v = (r() - 0.5) * grainAmp + (cl - 0.5) * amp;
    const k = (y * size + xx) * 4; d[k] += v; d[k + 1] += v; d[k + 2] += v * tint;
  }
  x.putImageData(img, 0, 0);
}
export function paperTile(kind, size = 512) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const x = c.getContext('2d', { willReadFrequently: true }); // a CPU canvas: no GPU readback for getImageData
  const base = { washi: [236, 230, 218], togi: [243, 240, 234], ganch: [227, 201, 160] }[kind];
  x.fillStyle = `rgb(${base})`; x.fillRect(0, 0, size, size);
  const r = mulberry(kind === 'washi' ? 11 : kind === 'togi' ? 12 : 13);
  if (kind === 'ganch') {
    formation(x, size, r, 64, 9, 4, 0.9);
    // trowel arcs: long shallow strokes, slightly lighter, each laid by a different swing
    for (let i = 0; i < 70; i++) {
      const cx = r() * size, cy = r() * size, rad = 60 + r() * 220, a0 = r() * Math.PI * 2, sw = 0.25 + r() * 0.5;
      x.strokeStyle = r() < 0.6 ? `rgba(255,248,232,${0.05 + r() * 0.08})` : `rgba(120,90,55,${0.03 + r() * 0.04})`;
      x.lineWidth = 0.6 + r() * 1.6;
      for (const ox of [-size, 0, size]) for (const oy of [-size, 0, size]) { x.beginPath(); x.arc(cx + ox, cy + oy, rad, a0, a0 + sw); x.stroke(); }
    }
  } else {
    formation(x, size, r, 32, kind === 'togi' ? 3 : 6, kind === 'togi' ? 4 : 7, 1.05);
    const fibres = kind === 'togi' ? 300 : 1100;
    for (let i = 0; i < fibres; i++) {
      const px = r() * size, py = r() * size, L = 14 + r() * 80, a = r() * Math.PI * 2, bend = (r() - 0.5) * L * 0.6;
      const ex = px + Math.cos(a) * L, ey = py + Math.sin(a) * L;
      const cx = (px + ex) / 2 + Math.cos(a + Math.PI / 2) * bend, cy = (py + ey) / 2 + Math.sin(a + Math.PI / 2) * bend;
      const light = r() < 0.55;
      x.strokeStyle = light ? `rgba(255,253,246,${0.10 + r() * 0.20})` : `rgba(120,100,72,${0.025 + r() * 0.045})`;
      x.lineWidth = 0.5 + r() * 0.7;
      for (const ox of [-size, 0, size]) for (const oy of [-size, 0, size]) { x.beginPath(); x.moveTo(px + ox, py + oy); x.quadraticCurveTo(cx + ox, cy + oy, ex + ox, ey + oy); x.stroke(); }
    }
    for (let i = 0; i < (kind === 'togi' ? 8 : 26); i++) {
      const px = r() * size, py = r() * size;
      x.fillStyle = `rgba(90,70,48,${0.10 + r() * 0.12})`;
      x.beginPath(); x.ellipse(px, py, 0.6 + r() * 1.1, 0.4 + r() * 0.5, r() * 3, 0, Math.PI * 2); x.fill();
    }
  }
  return c;
}
export function grainTile(size = 128) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const x = c.getContext('2d', { willReadFrequently: true }), img = x.createImageData(size, size), r = mulberry(5);
  for (let i = 0; i < size * size; i++) { const v = 110 + r() * 145; img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v; img.data[i * 4 + 3] = 255; }
  x.putImageData(img, 0, 0);
  return c;
}
// The grain as two alpha tiles for normal blending, the same pixels as the gray tile multiplied (light grounds) or
// screened (dark grounds) at the element's opacity a: multiply gives base·(1 − a(1 − g)), which is black laid over
// base at alpha a(1 − g); screen gives base + a·g(1 − base), which is white at alpha a·g. A blend mode needs an
// isolated render surface of everything under the full-screen grain on every composite; normal blending does not
// (on a software renderer that surface cost ~0.1 s per frame during the GL boot, §4.1).
export function grainTiles(size = 128) {
  const mk = (rgb, alpha) => {
    const c = document.createElement('canvas'); c.width = c.height = size;
    const x = c.getContext('2d', { willReadFrequently: true }), img = x.createImageData(size, size), r = mulberry(5);
    for (let i = 0; i < size * size; i++) { const g = (110 + r() * 145) / 255; img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = rgb; img.data[i * 4 + 3] = Math.round(255 * alpha(g)); }
    x.putImageData(img, 0, 0);
    return c;
  };
  return { k: mk(0, (g) => 1 - g), w: mk(255, (g) => g) };
}
// canvas -> blob URL -> CSS custom property on <html>
export function toVar(canvas, name) {
  const set = (url) => document.documentElement.style.setProperty(name, `url(${url})`);
  if (canvas.toBlob) canvas.toBlob((b) => { if (b) set(URL.createObjectURL(b)); }, 'image/png');
  else set(canvas.toDataURL());
}
