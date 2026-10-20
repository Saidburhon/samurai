// The "cartoon": the full-size design drawing the weave shader samples.
// Woven type and motifs are painted here; the role map stores registration class.
import { C, ROLE } from './palette.js';
import { drawIcon } from './motifs.js';

export const DELA = '"Dela Gothic One"';

export function createCartoon(W, H) {
  const ch = Math.ceil(H * 2.4);
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = ch;
  const role = document.createElement('canvas');
  role.width = W; role.height = ch;
  const ctx = canvas.getContext('2d');
  const rctx = role.getContext('2d');
  rctx.fillStyle = '#000';
  rctx.fillRect(0, 0, W, ch);
  return { canvas, role, ctx, rctx, W, H, ch };
}

export const capHeight = (ctx, size) => {
  ctx.font = `${size}px ${DELA}`;
  return ctx.measureText('H').actualBoundingBoxAscent;
};
export const textWidth = (ctx, text, size) => {
  ctx.font = `${size}px ${DELA}`;
  return ctx.measureText(text).width;
};

function rect(ctx, color, x, y, w, h) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

export function wovenText(cart, text, x, base, size, color, role = 'kasuri') {
  const { ctx, rctx } = cart;
  ctx.font = rctx.font = `${size}px ${DELA}`;
  ctx.fillStyle = color;
  ctx.fillText(text, x, base);
  rctx.fillStyle = rctx.strokeStyle = ROLE[role];
  rctx.lineWidth = Math.max(6, size * 0.14);
  rctx.lineJoin = 'round';
  rctx.strokeText(text, x, base);
  rctx.fillText(text, x, base);
}

// abr: saffron / magenta / emerald bands across the cap height, ivory resist lines between
export function abrText(cart, text, x, base, size, resist = 3) {
  const { ctx, rctx } = cart;
  const capH = capHeight(ctx, size);
  const w = textWidth(ctx, text, size);
  const pad = Math.ceil(size * 0.3);
  const tw = Math.ceil(w + pad * 2), th = Math.ceil(size * 1.5);
  const bb = Math.round(size * 1.15);
  const t = document.createElement('canvas');
  t.width = tw; t.height = th;
  const tc = t.getContext('2d');
  const top = bb - capH;
  const b1 = Math.round(top + capH * 0.34), b2 = Math.round(top + capH * 0.68);
  rect(tc, C.saffron, 0, 0, tw, b1);
  rect(tc, C.atlas, 0, b1, tw, b2 - b1);
  rect(tc, C.emerald, 0, b2, tw, th - b2);
  rect(tc, C.ivory, 0, b1 - resist / 2, tw, resist);
  rect(tc, C.ivory, 0, b2 - resist / 2, tw, resist);
  // keep the bands only inside the glyphs (one destructive op, applied once)
  tc.globalCompositeOperation = 'destination-in';
  tc.font = `${size}px ${DELA}`;
  tc.fillStyle = '#000';
  tc.fillText(text, pad, bb);
  ctx.drawImage(t, x - pad, base - bb);
  rctx.font = `${size}px ${DELA}`;
  rctx.fillStyle = rctx.strokeStyle = ROLE.abr;
  rctx.lineWidth = Math.max(8, size * 0.2);
  rctx.lineJoin = 'round';
  rctx.strokeText(text, x, base);
  rctx.fillText(text, x, base);
  return { w, capH };
}

// vertical abr word (phone): glyphs rotated 90deg cw, colour zones run across the warp (horizontal flame edges)
export function abrVertical(cart, text, xLeft, yTop, size, zone, resist = 3) {
  const { ctx, rctx } = cart;
  const capH = capHeight(ctx, size);
  const w = textWidth(ctx, text, size);
  const pad = Math.ceil(size * 0.3);
  // draw horizontally into temp, then rotate
  const tw = Math.ceil(w + pad * 2), th = Math.ceil(size * 1.5);
  const bb = Math.round(size * 1.15);
  const t = document.createElement('canvas');
  t.width = tw; t.height = th;
  const tc = t.getContext('2d');
  // zones along the reading direction (becomes screen y after rotation)
  const cols = [C.saffron, C.atlas, C.emerald];
  let k = 0;
  for (let zx = pad; zx < tw; zx += zone, k++) {
    rect(tc, cols[k % 3], zx, 0, zone, th);
    if (zx > pad) rect(tc, C.ivory, zx - resist / 2, 0, resist, th);
  }
  rect(tc, cols[0], 0, 0, pad, th);
  tc.globalCompositeOperation = 'destination-in';
  tc.font = `${size}px ${DELA}`;
  tc.fillStyle = '#000';
  tc.fillText(text, pad, bb);
  const capTopT = bb - capH;
  // rotate cw: text x -> screen y, glyph tops face right
  ctx.save();
  // point (px,py) in temp -> screen (X, Y) = (xLeft + (bb - py) , yTop + (px - pad))   [baseline at xLeft]
  ctx.setTransform(0, 1, -1, 0, xLeft + bb, yTop - pad);
  ctx.drawImage(t, 0, 0);
  ctx.restore();
  rctx.save();
  rctx.setTransform(0, 1, -1, 0, xLeft + bb, yTop - pad);
  rctx.font = `${size}px ${DELA}`;
  rctx.fillStyle = rctx.strokeStyle = ROLE.abr;
  rctx.lineWidth = Math.max(8, size * 0.2);
  rctx.strokeText(text, pad, bb);
  rctx.fillText(text, pad, bb);
  rctx.restore();
  return { w, capH, capTopT };
}

// ---------------------------------------------------------------- scenes

// P1 · 絣 = ABR, painted from cloth-y `oy` (used as the loose warp under the hero)
export function paintP1(cart, oy, W) {
  const { ctx } = cart;
  const split = Math.round((W * 0.48) / 6) * 6;
  rect(ctx, C.ai, 0, oy, split, cart.ch - oy);
  rect(ctx, C.silk, split, oy, W - split, cart.ch - oy);
  const s1 = Math.round(W * 0.264);
  const c1 = capHeight(ctx, s1);
  wovenText(cart, '絣', Math.round(W * 0.05), oy + 70 + c1, s1, C.ivory);
  rect(ctx, C.saffron, split - 38, oy + 230, 76, 16);
  rect(ctx, C.saffron, split - 38, oy + 262, 76, 16);
  const s2 = Math.round(W * 0.167);
  abrText(cart, 'ABR', split + 64, oy + 120 + capHeight(ctx, s2), s2, 4);
}

export function paintHeroDesktop(cart, { p1At }) {
  const { ctx, W, ch } = cart;
  rect(ctx, C.silk, 0, 0, W, ch);
  const size = 112, x = 48;
  const capH = capHeight(ctx, size);
  const snap = (v) => Math.round(v / 3) * 3;
  const lines = ['YAPON IT', 'AGENSTVASI', 'ENDI'];
  const bases = [];
  lines.forEach((t, k) => {
    const b = snap(128 + k * 106 + capH);
    bases.push(b);
    wovenText(cart, t, x, b, size, C.ai);
  });
  const b4 = snap(128 + 3 * 106 + capH);
  bases.push(b4);
  const r = abrText(cart, 'OʻZBEKISTONDA!', x, b4, size);
  if (p1At != null) paintP1(cart, p1At, W);
  return { bases, capH, w4: r.w };
}

export function paintHeroPhone(cart, { p1At }) {
  const { ctx, W, ch } = cart;
  rect(ctx, C.silk, 0, 0, W, ch);
  const x = 16;
  const colW = 280;
  const snap = (v) => Math.round(v / 2) * 2;
  // fit-justified block
  const words = ['YAPON', 'IT', 'AGENSTVASI', 'ENDI'];
  let y = 92;
  const out = [];
  for (const wd of words) {
    const s = Math.floor((100 * colW) / textWidth(ctx, wd, 100));
    const capH = capHeight(ctx, s);
    const base = snap(y + capH);
    wovenText(cart, wd, x, base, s, C.ai);
    out.push({ wd, s, base, capH });
    y = base + Math.max(14, s * 0.16);
  }
  // vertical OʻZBEKISTONDA! along the right edge
  const vText = 'OʻZBEKISTONDA!';
  const vLen = 600;
  const vs = Math.floor((100 * vLen) / textWidth(ctx, vText, 100));
  const vcap = capHeight(ctx, vs);
  const xLeft = W - 14 - vcap; // baseline column x
  const r = abrVertical(cart, vText, xLeft, 96, vs, Math.round(vLen / 4.5), 3);
  if (p1At != null) paintP1(cart, p1At, W);
  return { block: out, blockBottom: y, vs, vcap, vLeft: xLeft, r };
}

export const STRIPES = [
  { g: C.ai, ink: C.ivory, name: 'MOBIL ILOVALAR', d: 'iOS · ANDROID', icon: 'phone' },
  { g: C.atlas, ink: C.ivory, name: 'VEB-SAYTLAR', d: 'SAYT · VEB-PLATFORMA', icon: 'browser' },
  { g: C.saffron, ink: C.ai, name: 'TELEGRAM BOTLAR', d: 'BUYURTMA · TOʻLOV · XABARNOMA', icon: 'plane' },
  { g: C.emerald, ink: C.ivory, name: 'BACKEND', d: 'API · INTEGRATSIYALAR', icon: 'server' },
  { g: C.silk, ink: C.atlas, name: 'DESKTOP', d: 'WINDOWS · MACOS · LINUX', icon: 'monitor' },
  { g: C.ai, ink: C.saffron, name: 'IoT', d: 'QURILMALAR · SENSORLAR', icon: 'antenna' },
  { g: C.atlas, ink: C.ivory, name: 'AI', d: 'SUNʼIY INTELLEKT INTEGRATSIYASI', icon: 'network' },
];

export function paintStripes(cart, { top = 96, sh = 94 }) {
  const { ctx, W, ch } = cart;
  rect(ctx, C.silk, 0, 0, W, ch);
  const size = 60;
  const capH = capHeight(ctx, size);
  const rows = [];
  STRIPES.forEach((s, k) => {
    const y0 = top + k * sh;
    rect(ctx, s.g, 0, y0, W, sh);
    const base = Math.round((y0 + (sh + capH) / 2) / 3) * 3;
    wovenText(cart, s.name, 48, base, size, s.ink);
    drawIcon(ctx, s.icon, W - 48 - 78, y0 + 8, 6, s.ink);
    // icons are kasuri too
    cart.rctx.fillStyle = ROLE.kasuri;
    cart.rctx.fillRect(W - 48 - 84, y0 + 4, 90, 86);
    rows.push({ y0, base });
  });
  return { rows, capH };
}

export function paintJidoka(cart) {
  const { ctx, rctx, W, ch } = cart;
  rect(ctx, C.aiDeep, 0, 0, W, ch);
  // 井桁 igeta-gasuri: crosses aligned to whole threads (x) and rows (y), half-drop grid
  const grid = 120, m = 36;
  ctx.fillStyle = 'rgba(246,241,230,0.25)';
  rctx.fillStyle = ROLE.kasuri;
  for (let gx = -1; gx * grid < W + grid; gx++) {
    for (let gy = -1; gy * grid < ch + grid; gy++) {
      const x0 = Math.round((gx * grid + 42) / 6) * 6;
      const y0 = Math.round((gy * grid + (gx % 2 ? 60 : 0) + 30) / 3) * 3;
      ctx.fillRect(x0 + 6, y0, 6, m);
      ctx.fillRect(x0 + 24, y0, 6, m);
      ctx.fillRect(x0, y0 + 6, m, 6);
      ctx.fillRect(x0, y0 + 24, m, 6);
      rctx.fillRect(x0 - 6, y0 - 6, m + 12, m + 12);
    }
  }
}
