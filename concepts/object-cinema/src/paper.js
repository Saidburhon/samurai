import * as THREE from 'three';

function rng(seed) { let a = seed; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// washi: kozo fibres and fine noise over the paper colour, tiled seamlessly
export function washiTile(size = 512, base = [236, 230, 218]) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const x = c.getContext('2d');
  x.fillStyle = `rgb(${base})`; x.fillRect(0, 0, size, size);
  const img = x.getImageData(0, 0, size, size), d = img.data, r = rng(11);
  // low-frequency cloudiness (formation) + grain
  const cell = 32, g = [];
  for (let j = 0; j <= size / cell; j++) { g.push([]); for (let i = 0; i <= size / cell; i++) g[j].push(r()); }
  for (let j = 0; j <= size / cell; j++) g[j][size / cell] = g[j][0];
  for (let i = 0; i <= size / cell; i++) g[size / cell][i] = g[0][i];
  for (let y = 0; y < size; y++) for (let xx = 0; xx < size; xx++) {
    const gx = xx / cell, gy = y / cell, i0 = Math.floor(gx), j0 = Math.floor(gy), fx = gx - i0, fy = gy - j0;
    const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
    const cl = (g[j0][i0] * (1 - sx) + g[j0][i0 + 1] * sx) * (1 - sy) + (g[j0 + 1][i0] * (1 - sx) + g[j0 + 1][i0 + 1] * sx) * sy;
    const n = (r() - 0.5) * 7 + (cl - 0.5) * 6;
    const k = (y * size + xx) * 4; d[k] += n; d[k + 1] += n; d[k + 2] += n * 1.05;
  }
  x.putImageData(img, 0, 0);
  // fibres
  for (let i = 0; i < 1100; i++) {
    const px = r() * size, py = r() * size, L = 14 + r() * 80, a = r() * Math.PI * 2;
    const bend = (r() - 0.5) * L * 0.6;
    const ex = px + Math.cos(a) * L, ey = py + Math.sin(a) * L;
    const cx = (px + ex) / 2 + Math.cos(a + Math.PI / 2) * bend, cy = (py + ey) / 2 + Math.sin(a + Math.PI / 2) * bend;
    const light = r() < 0.55;
    x.strokeStyle = light ? `rgba(255,253,246,${0.10 + r() * 0.20})` : `rgba(120,100,72,${0.025 + r() * 0.045})`;
    x.lineWidth = 0.5 + r() * 0.7;
    for (const ox of [-size, 0, size]) for (const oy of [-size, 0, size]) {
      x.beginPath(); x.moveTo(px + ox, py + oy); x.quadraticCurveTo(cx + ox, cy + oy, ex + ox, ey + oy); x.stroke();
    }
  }
  // occasional inclusions (bark specks)
  for (let i = 0; i < 26; i++) {
    const px = r() * size, py = r() * size;
    x.fillStyle = `rgba(90,70,48,${0.10 + r() * 0.12})`;
    x.beginPath(); x.ellipse(px, py, 0.6 + r() * 1.1, 0.4 + r() * 0.5, r() * 3, 0, Math.PI * 2); x.fill();
  }
  return c.toDataURL('image/png');
}

export function grainTile(size = 160) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const x = c.getContext('2d'); const img = x.createImageData(size, size), r = rng(5);
  for (let i = 0; i < size * size; i++) { const v = 110 + r() * 145; img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v; img.data[i * 4 + 3] = 255; }
  x.putImageData(img, 0, 0);
  return c.toDataURL('image/png');
}

// word atlas for the reflected sign: white type on black, one row per word
export function wordAtlas(words, { w = 2048, h = 256 } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h * words.length;
  const x = c.getContext('2d');
  x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height);
  x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
  words.forEach((word, i) => {
    let fs = 190;
    x.font = `280 ${fs}px Geologica`;
    try { x.letterSpacing = '-4px'; } catch (e) {}
    while (x.measureText(word).width > w * 0.86) { fs -= 4; x.font = `280 ${fs}px Geologica`; }
    x.fillText(word, w / 2, h * i + h * 0.54);
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.anisotropy = 8;
  return t;
}
