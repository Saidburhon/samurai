// The "cartoon": the full-size design drawing of the whole cloth strip, which the weave shader samples.
// Woven type and motifs are painted here; the role map stores the registration class (kasuri / abr).
import { C, ROLE } from './palette.js';
import { DELA, capH, tw } from './layout.js';

function rect(ctx, color, x, y, w, h) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function wovenText(ctx, rctx, o) {
  ctx.font = `${o.size}px ${DELA}`;
  ctx.fillStyle = o.color;
  ctx.fillText(o.text, o.x, o.base);
  rctx.font = `${o.size}px ${DELA}`;
  rctx.fillStyle = rctx.strokeStyle = ROLE.kasuri;
  rctx.lineWidth = Math.max(6, o.size * 0.14);
  rctx.lineJoin = 'round';
  rctx.strokeText(o.text, o.x, o.base);
  rctx.fillText(o.text, o.x, o.base);
}

// abr: saffron / magenta / emerald bands across the cap height, ivory resist lines between
function abrText(ctx, rctx, o, scale) {
  const size = o.size;
  const ch = capH(size);
  const w = tw(o.text, size);
  const pad = Math.ceil(size * 0.3);
  const s = scale;
  const t = document.createElement('canvas');
  t.width = Math.ceil((w + pad * 2) * s);
  t.height = Math.ceil(size * 1.5 * s);
  const tc = t.getContext('2d');
  tc.scale(s, s);
  const bb = Math.round(size * 1.15);
  const top = bb - ch;
  const b1 = top + ch * 0.34, b2 = top + ch * 0.68;
  const resist = Math.max(2, size * 0.022);
  const tw0 = w + pad * 2, th = size * 1.5;
  rect(tc, C.saffron, 0, 0, tw0, b1);
  rect(tc, C.atlas, 0, b1, tw0, b2 - b1);
  rect(tc, C.emerald, 0, b2, tw0, th - b2);
  rect(tc, C.ivory, 0, b1 - resist / 2, tw0, resist);
  rect(tc, C.ivory, 0, b2 - resist / 2, tw0, resist);
  tc.globalCompositeOperation = 'destination-in';
  tc.font = `${size}px ${DELA}`;
  tc.fillStyle = '#000';
  tc.fillText(o.text, pad, bb);
  ctx.drawImage(t, o.x - pad, o.base - bb, tw0, th);
  rctx.font = `${size}px ${DELA}`;
  rctx.fillStyle = rctx.strokeStyle = ROLE.abr;
  rctx.lineWidth = Math.max(8, size * 0.2);
  rctx.lineJoin = 'round';
  rctx.strokeText(o.text, o.x, o.base);
  rctx.fillText(o.text, o.x, o.base);
}

// vertical abr word: glyphs rotated 90° clockwise (tops face right), colour zones run along the word
function abrVertical(ctx, rctx, o, scale) {
  const size = o.size;
  const w = tw(o.text, size);
  const pad = Math.ceil(size * 0.3);
  const s = scale;
  const tw0 = w + pad * 2, th = size * 1.5;
  const t = document.createElement('canvas');
  t.width = Math.ceil(tw0 * s);
  t.height = Math.ceil(th * s);
  const tc = t.getContext('2d');
  tc.scale(s, s);
  const bb = Math.round(size * 1.15);
  const cols = [C.saffron, C.atlas, C.emerald];
  const zone = o.len / 4.5;
  const resist = Math.max(2, size * 0.03);
  let k = 0;
  for (let zx = pad; zx < tw0; zx += zone, k++) {
    rect(tc, cols[k % 3], zx, 0, zone + 1, th);
    if (zx > pad) rect(tc, C.ivory, zx - resist / 2, 0, resist, th);
  }
  rect(tc, cols[0], 0, 0, pad, th);
  tc.globalCompositeOperation = 'destination-in';
  tc.font = `${size}px ${DELA}`;
  tc.fillStyle = '#000';
  tc.fillText(o.text, pad, bb);
  for (const [c, img] of [[ctx, true], [rctx, false]]) {
    c.save();
    c.transform(0, 1, -1, 0, o.xBase + bb, o.yTop - pad);
    if (img) c.drawImage(t, 0, 0, tw0, th);
    else {
      c.font = `${size}px ${DELA}`;
      c.fillStyle = c.strokeStyle = ROLE.abr;
      c.lineWidth = Math.max(8, size * 0.2);
      c.lineJoin = 'round';
      c.strokeText(o.text, pad, bb);
      c.fillText(o.text, pad, bb);
    }
    c.restore();
  }
}

// a solid woven word set vertically (glyph tops face right)
function vText(ctx, rctx, o) {
  for (const [c, fill, role] of [[ctx, o.color, false], [rctx, ROLE.kasuri, true]]) {
    c.save();
    c.transform(0, 1, -1, 0, o.xBase, o.yTop);
    c.font = `${o.size}px ${DELA}`;
    c.fillStyle = c.strokeStyle = fill;
    if (role) { c.lineWidth = Math.max(6, o.size * 0.14); c.lineJoin = 'round'; c.strokeText(o.text, 0, 0); }
    c.fillText(o.text, 0, 0);
    c.restore();
  }
}

function paintWoven(ctx, rctx, list, scale) {
  for (const o of list || []) {
    if (o.vertical && !o.abr) vText(ctx, rctx, o);
    else if (o.vertical) abrVertical(ctx, rctx, o, scale);
    else if (o.abr) abrText(ctx, rctx, o, scale);
    else wovenText(ctx, rctx, o);
  }
}

// 井桁 igeta-gasuri: crosses on whole threads, half-drop grid, omitted behind the text block
function igeta(ctx, rctx, L, h) {
  const { grid, mot, safe } = L.jid;
  const P = L.pitch;
  const bar = Math.max(4, Math.round(mot / 6));
  ctx.fillStyle = 'rgba(246,241,230,0.26)';
  rctx.fillStyle = ROLE.kasuri;
  for (let gx = -1; gx * grid < L.W + grid; gx++) {
    for (let gy = -1; gy * grid < h + grid; gy++) {
      const x0 = Math.round((gx * grid + grid * 0.35) / P) * P;
      const y0 = Math.round(gy * grid + (gx % 2 ? grid / 2 : 0) + grid * 0.25);
      if (x0 + mot > safe[0] && x0 < safe[0] + safe[2] && y0 + mot > safe[1] && y0 < safe[1] + safe[3]) continue;
      if (Math.abs(x0 + mot / 2 - L.jid.sigX) < mot) continue;
      const a = Math.round(mot * 0.22), b = Math.round(mot * 0.62);
      ctx.fillRect(x0 + a, y0, bar, mot);
      ctx.fillRect(x0 + b, y0, bar, mot);
      ctx.fillRect(x0, y0 + a, mot, bar);
      ctx.fillRect(x0, y0 + b, mot, bar);
      rctx.fillRect(x0 - 6, y0 - 6, mot + 12, mot + 12);
    }
  }
}

function jiyakBand(ctx, x, y, w, h) {
  // tri-colour Uzbek trim with ivory resist lines
  const cols = [C.atlas, C.saffron, C.emerald, C.atlas];
  const n = cols.length;
  const bh = h / n;
  cols.forEach((c, i) => rect(ctx, c, x, y + i * bh, w, bh));
  for (let i = 1; i < n; i++) rect(ctx, C.ivory, x, y + i * bh - 1, w, 2);
  rect(ctx, C.ivory, x, y, w, 2);
  rect(ctx, C.ivory, x, y + h - 2, w, 2);
}

function timeRows(ctx, rctx, L) {
  const t = L.time;
  const row = (y0, y1, work) => {
    for (let h = 0; h < 24; h++) {
      const x = t.x0 + h * t.hw;
      const on = h >= 9 && h < 18;
      rect(ctx, on ? work : C.silkShade, x, y0, t.hw + 0.5, y1 - y0);
      // hour rule: a darker weft line every hour, a deeper one every 6
      rect(ctx, on ? 'rgba(0,0,0,0.16)' : 'rgba(24,35,74,0.12)', x, y0, h % 6 ? 1 : 2, y1 - y0);
    }
    // ivory resist lines at the ends of the working block
    rect(ctx, C.ivory, t.x0 + 9 * t.hw - 1, y0, 2, y1 - y0);
    rect(ctx, C.ivory, t.x0 + 18 * t.hw - 1, y0, 2, y1 - y0);
    rctx.fillStyle = ROLE.kasuri;
    rctx.fillRect(t.x0 - 4, y0 - 4, t.x1 - t.x0 + 8, y1 - y0 + 8);
  };
  row(t.tk[0], t.tk[1], C.shu);
  row(t.ts[0], t.ts[1], C.emerald);
}

const GROUND = { silk: C.silk, ai: C.ai, aiDeep: C.aiDeep };

export function paintPanel(ctx, rctx, L, id, scale) {
  const p = L.panels[id];
  const base = id === 'dan' ? 'abr' : id === 'hor' ? 'jid' : id;
  const W = L.W, h = p.h;
  ctx.save(); rctx.save();
  ctx.beginPath(); ctx.rect(0, 0, W, h); ctx.clip();
  rctx.beginPath(); rctx.rect(0, 0, W, h); rctx.clip();
  rect(ctx, GROUND[p.ground] || C.silk, 0, 0, W, h);
  switch (base) {
    case 'abr': {
      const s = L.abr.split;
      rect(ctx, C.silk, s, 0, W - s, h);
      const [x, y1, w, bh, y2] = L.abr.eq;
      rect(ctx, C.saffron, x, y1, w, bh);
      rect(ctx, C.saffron, x, y2, w, bh);
      rctx.fillStyle = ROLE.kasuri;
      rctx.fillRect(x - 4, y1 - 4, w + 8, y2 + bh - y1 + 8);
      break;
    }
    case 'jid':
      igeta(ctx, rctx, L, h);
      break;
    case 'stripes':
      L.stripes.forEach((s) => rect(ctx, s.g, 0, s.sy, W, L.sh));
      L.stripes.forEach((s, i) => i && rect(ctx, 'rgba(246,241,230,0.55)', 0, s.sy - 1, W, 2));
      break;
    case 'time':
      timeRows(ctx, rctx, L);
      break;
    case 'foot': {
      const b = L.foot.band;
      jiyakBand(ctx, 0, 0, W, b);
      jiyakBand(ctx, 0, h - b, W, b);
      break;
    }
    case 'tail':
      rect(ctx, '#F2EBDC', 0, 0, W, h);
      break;
  }
  paintWoven(ctx, rctx, L.woven[base], scale);
  if (L.flow) flowExtras(ctx, L, id, h);
  ctx.restore(); rctx.restore();
}

// flow mode (reduced motion, no WebGL): each scene drawn in its settled state
function flowExtras(ctx, L, id, h) {
  const P = L.pitch, W = L.W;
  if (id === 'dan') {
    // the loom opened: loose warp, dark gaps between the dyed threads, ivory ties
    for (let i = 0; i < L.threads + 1; i++) rect(ctx, 'rgba(18,15,23,0.9)', (i + 0.5) * P + 0.23 * P, 0, 0.54 * P, h);
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(18,15,23,0.15)');
    g.addColorStop(1, 'rgba(18,15,23,0.55)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, h);
    const [sx, sy, sw, shh] = L.danSafe;
    rect(ctx, 'rgba(18,15,23,0.5)', sx, sy, sw, shh);
  }
  if (id === 'jid' || id === 'hor') {
    const { sigX, brk, andon } = L.jid;
    ctx.strokeStyle = C.saffron;
    ctx.lineWidth = L.phone ? 3 : 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (id === 'jid') {
      ctx.moveTo(sigX, 0); ctx.lineTo(sigX, brk - 8);
      ctx.quadraticCurveTo(sigX + 4, brk + 18, sigX + 22, brk + 16);
      ctx.moveTo(sigX, h); ctx.lineTo(sigX, brk + 70);
      ctx.quadraticCurveTo(sigX - 14, brk + 46, sigX + 4, brk + 36);
    } else {
      ctx.moveTo(sigX, 0); ctx.lineTo(sigX, h);
    }
    ctx.stroke();
    if (id === 'hor') {
      ctx.fillStyle = C.saffron;
      ctx.beginPath(); ctx.arc(sigX, brk, L.phone ? 6 : 8, 0, Math.PI * 2); ctx.fill();
    }
    const lit = id === 'jid' ? C.shu : C.emerald;
    const ax = andon.x - andon.w / 2, ay = andon.y - andon.h / 2;
    const glow = ctx.createRadialGradient(andon.x, andon.y, 4, andon.x, andon.y, andon.w * 4);
    glow.addColorStop(0, id === 'jid' ? 'rgba(226,66,31,0.45)' : 'rgba(31,166,115,0.45)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(andon.x - andon.w * 4, andon.y - andon.w * 4, andon.w * 8, andon.w * 8);
    rect(ctx, lit, ax, ay, andon.w, andon.h);
    rect(ctx, '#2a1d16', ax - 6, ay - 10, andon.w + 12, 10);
    rect(ctx, '#2a1d16', ax - 6, ay + andon.h, andon.w + 12, 10);
    ctx.font = `${Math.round(andon.w * 0.7)}px ${DELA}`;
    ctx.fillStyle = C.ivory;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(id === 'jid' ? '止' : '進', andon.x, andon.y);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }
  if (id === 'time') {
    // aligned by one instant: Tokyo four hours ahead, the shared hours woven as one block
    const t = L.time;
    for (let hh = 0; hh < 24; hh++) {
      const x = t.x0 + ((hh - 4 + 24) % 24) * t.hw;
      rect(ctx, hh >= 9 && hh < 18 ? C.shu : C.silkShade, x, t.tk[0], t.hw + 0.5, t.tk[1] - t.tk[0]);
      rect(ctx, 'rgba(24,35,74,0.12)', x, t.tk[0], 1, t.tk[1] - t.tk[0]);
    }
    const [x0, y0, x1, y1] = t.shot;
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, '#7A4A26');
    g.addColorStop(1, '#4E5E2E');
    ctx.fillStyle = g;
    ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  }
}

// Paint the whole strip into one or more canvases (each at most maxTex texels tall).
export function paintStrip(L, scale, maxTex) {
  const ids = Object.keys(L.panels);
  const chunks = [];
  let cur = null;
  for (const id of ids) {
    const p = L.panels[id];
    if (!cur || (p.y0 + p.h - cur.y0) * scale > maxTex) {
      cur = { y0: p.y0, h: 0, ids: [] };
      chunks.push(cur);
    }
    cur.ids.push(id);
    cur.h = p.y0 + p.h - cur.y0;
  }
  const rs = scale * 0.5;
  for (const c of chunks) {
    c.canvas = document.createElement('canvas');
    c.canvas.width = Math.ceil(L.W * scale);
    c.canvas.height = Math.ceil(c.h * scale);
    c.role = document.createElement('canvas');
    c.role.width = Math.ceil(L.W * rs);
    c.role.height = Math.ceil(c.h * rs);
    const ctx = c.canvas.getContext('2d');
    const rctx = c.role.getContext('2d');
    rctx.fillStyle = ROLE.ground;
    rctx.fillRect(0, 0, c.role.width, c.role.height);
    for (const id of c.ids) {
      const p = L.panels[id];
      ctx.setTransform(scale, 0, 0, scale, 0, (p.y0 - c.y0) * scale);
      rctx.setTransform(rs, 0, 0, rs, 0, (p.y0 - c.y0) * rs);
      paintPanel(ctx, rctx, L, id, scale);
    }
  }
  return chunks;
}

// one panel on its own canvas (flow mode backgrounds)
export function paintPanelCanvas(L, id, scale) {
  const p = L.panels[id];
  const c = document.createElement('canvas');
  c.width = Math.ceil(L.W * scale);
  c.height = Math.ceil(p.h * scale);
  const r = document.createElement('canvas');
  r.width = 4; r.height = 4;
  const ctx = c.getContext('2d');
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  paintPanel(ctx, r.getContext('2d'), L, id, scale);
  return c;
}
