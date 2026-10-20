// Scene 2: 文武 QALAM VA QILICH — 文 is brushed, 武 is cut out of the sheet like kirie.
import { bakeWashi } from './washi.js';
import { kanjiStrokes, buildField, inkOnto, samplePath } from './fude.js';
import { createAbr } from './abr.js';
import { OK, el, navBar } from './common.js';
import { clamp, smooth, mulberry } from './noise.js';

export async function bunbu(S) {
  const { W, H, kvg, glyphs, phone, layers } = S;
  const t = S.t;
  // ---------- layout
  const inkH = phone ? 0.27 * H : 0.56 * H;
  const bun = phone ? { x: 0.5 * W - inkH * 0.46, y: 0.12 * H } : { x: 0.085 * W, y: 0.185 * H };
  const bu = phone ? { x: 0.5 * W - inkH * 0.48, y: 0.52 * H } : { x: 0.555 * W, y: 0.185 * H };

  // ---------- sheet + 文
  const sheet = bakeWashi(W, H, { seed: 26, scale: phone ? 0.75 : 1 });
  const fib = { data: sheet.fibre, w: W, h: H, ox: 0, oy: 0 };
  const size = (inkH / 81) * 109;
  const box = { x: bun.x - 16.88 * size / 109, y: bun.y - 12.75 * size / 109, size };
  const bw = size * 0.112;
  const st = kanjiStrokes(kvg['文'], box, {
    kinds: ['ten', 'tome', 'harai', 'nharai'],
    per: [{ W: bw * 1.15 }, { W: bw * 0.95, waist: 0.14 }, { W: bw * 1.1, haraiFrom: 0.45, haraiDry: 1.6 }, { W: bw * 1.05, haraiFrom: 0.78, haraiDry: 1.2 }],
  });
  const fb = buildField(st, { W: bw, seed: 9, fibre: fib, dry: 0.9, dryStart: 0.5, bleed: 0.22 });
  const bunP = clamp(t / 0.6);
  inkOnto(sheet, fb, { progress: bunP, wetK: 2.2, age: Math.max(0, t - 0.6) * 4 });
  const pc = document.createElement('canvas'); pc.width = W; pc.height = H;
  pc.getContext('2d').putImageData(sheet.img, 0, 0);

  // ---------- 武 outline (Shippori Mincho B1 800), placed to the same ink height
  const g = glyphs['武'];
  const [gx0, gy0, gx1, gy1] = g.bbox;
  const gs = inkH / (gy1 - gy0);
  const gm = document.createElement('canvas'); gm.width = W; gm.height = H;
  const gx = gm.getContext('2d');
  gx.setTransform(gs, 0, 0, gs, bu.x - gx0 * gs, bu.y - gy0 * gs);
  gx.fillStyle = '#000';
  const glyphPath = new Path2D(g.contours.join(' '));
  gx.fill(glyphPath);
  gx.setTransform(1, 0, 0, 1, 0, 0);
  const gmask = gx.getImageData(0, 0, W, H).data;

  // KanjiVG strokes of 武 mapped onto the outline's box -> one paper piece per stroke
  const kv = kvg['武'];
  const kx0 = 14.75, ky0 = 13.75, kx1 = 94.5, ky1 = 93.3;
  const gW = (gx1 - gx0) * gs, gH = (gy1 - gy0) * gs;
  const strokesPx = kv.strokes.map((s) => samplePath(s.d, 1.5).map(([x, y]) => [bu.x + (x - kx0) / (kx1 - kx0) * gW, bu.y + (y - ky0) / (ky1 - ky0) * gH]));
  const NP = strokesPx.length;
  const bx0 = Math.floor(bu.x - 4), by0 = Math.floor(bu.y - 4), bx1 = Math.ceil(bu.x + gW + 4), by1 = Math.ceil(bu.y + gH + 4);
  const pw = bx1 - bx0, ph = by1 - by0;
  const pieceA = Array.from({ length: NP }, () => new Float32Array(pw * ph));
  const cent = Array.from({ length: NP }, () => [0, 0, 0]);
  for (let y = by0; y < by1; y++) for (let x = bx0; x < bx1; x++) {
    const a = gmask[(y * W + x) * 4 + 3] / 255; if (a <= 0) continue;
    let d1 = 1e9, d2 = 1e9, i1 = 0, i2 = 0;
    for (let k = 0; k < NP; k++) {
      let dm = 1e9; const P = strokesPx[k];
      for (let j = 0; j < P.length; j += 2) { const dx = P[j][0] - x, dy = P[j][1] - y; const dd = dx * dx + dy * dy; if (dd < dm) dm = dd; }
      dm = Math.sqrt(dm);
      if (dm < d1) { d2 = d1; i2 = i1; d1 = dm; i1 = k; } else if (dm < d2) { d2 = dm; i2 = k; }
    }
    const w1 = clamp(0.5 + (d2 - d1) * 0.5);
    const id = (y - by0) * pw + (x - bx0);
    pieceA[i1][id] += a * w1; pieceA[i2][id] += a * (1 - w1);
    cent[i1][0] += x * a * w1; cent[i1][1] += y * a * w1; cent[i1][2] += a * w1;
  }
  const pieceCanvas = pieceA.map((A) => {
    const c = document.createElement('canvas'); c.width = pw; c.height = ph;
    const x = c.getContext('2d'); const im = x.createImageData(pw, ph);
    for (let i = 0; i < pw * ph; i++) { im.data[i * 4 + 3] = clamp(A[i]) * 255; }
    x.putImageData(im, 0, 0); return c;
  });
  cent.forEach((c) => { c[0] /= c[2] || 1; c[1] /= c[2] || 1; });

  // ---------- timing of the cuts
  const cutT = (i) => 0.3 + 0.62 * (i / NP);
  const rnd = mulberry(77);
  const phys = strokesPx.map(() => ({ drift: (rnd() - 0.5) * 140, w: (0.8 + rnd() * 0.8) * (rnd() < 0.5 ? -1 : 1), fl: 2.5 + rnd() * 1.5, f0: rnd() * 0.6 }));

  // ---------- paper with holes
  const paper = layers.paper; paper.width = W; paper.height = H;
  const ctx = paper.getContext('2d');
  ctx.drawImage(pc, 0, 0);
  if (t < 1) { // the craftsman's faint under-drawing of the outline
    ctx.save(); ctx.setTransform(gs, 0, 0, gs, bu.x - gx0 * gs, bu.y - gy0 * gs);
    ctx.strokeStyle = 'rgba(94,85,75,0.38)'; ctx.lineWidth = 0.75 / gs; ctx.setLineDash([5 / gs, 3.5 / gs]);
    ctx.stroke(glyphPath); ctx.restore();
  }
  const holes = document.createElement('canvas'); holes.width = W; holes.height = H;
  const hx = holes.getContext('2d');
  let nCut = 0;
  hx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < NP; i++) if (t >= cutT(i)) { hx.drawImage(pieceCanvas[i], bx0, by0); nCut++; }
  hx.globalCompositeOperation = 'source-over';
  if (nCut) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.drawImage(holes, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    // the sheet's shadow falls into the holes onto the cloth
    const sh = document.createElement('canvas'); sh.width = W; sh.height = H;
    const sx = sh.getContext('2d');
    sx.fillStyle = '#000'; sx.fillRect(0, 0, W, H);
    sx.globalCompositeOperation = 'destination-out'; sx.drawImage(holes, 0, 0);
    const sb = document.createElement('canvas'); sb.width = W; sb.height = H;
    const sbx = sb.getContext('2d');
    sbx.filter = 'blur(9px)'; sbx.drawImage(sh, 5, 9); sbx.filter = 'none';
    sbx.globalCompositeOperation = 'destination-in'; sbx.drawImage(holes, 0, 0);
    ctx.globalAlpha = 0.55; ctx.drawImage(sb, 0, 0); ctx.globalAlpha = 1;
    // a crisp contact line + steel-light core on the cut edge
    const ring = ringOf(holes, W, H, 1.2, 'rgba(246,241,230,0.95)');
    ctx.drawImage(ring, 0, 0);
    const dk = ringOf(holes, W, H, 0.6, 'rgba(20,16,30,0.6)', true);
    ctx.drawImage(dk, 0, 0);
  }

  // ---------- glint tracing the next contour
  const fx = layers.fx; fx.width = W; fx.height = H; const gfx = fx.getContext('2d');
  for (let i = 0; i < NP; i++) {
    const g0 = cutT(i) - 0.075;
    if (t >= g0 && t < cutT(i)) {
      const gp = (t - g0) / 0.075;
      const ring = document.createElement('canvas'); ring.width = W; ring.height = H;
      const rx = ring.getContext('2d');
      const one = document.createElement('canvas'); one.width = W; one.height = H; one.getContext('2d').drawImage(pieceCanvas[i], bx0, by0);
      rx.drawImage(ringOf(one, W, H, 1.6, 'rgba(255,253,246,1)'), 0, 0);
      const [cx, cy] = cent[i];
      const a0 = -Math.PI / 2;
      const ang = a0 + gp * Math.PI * 2;
      // comet of steel light: fades in from where the blade started to the head
      rx.globalCompositeOperation = 'destination-in';
      const cg = rx.createConicGradient(a0, cx, cy);
      const head = gp;
      cg.addColorStop(0, 'rgba(0,0,0,0.05)');
      cg.addColorStop(Math.max(0.001, head * 0.6), 'rgba(0,0,0,0.25)');
      cg.addColorStop(Math.max(0.002, head - 0.002), 'rgba(0,0,0,1)');
      cg.addColorStop(Math.min(0.999, head + 0.001), 'rgba(0,0,0,0)');
      cg.addColorStop(1, 'rgba(0,0,0,0)');
      rx.fillStyle = cg; rx.fillRect(0, 0, W, H);
      gfx.save(); gfx.globalCompositeOperation = 'lighter'; gfx.shadowColor = 'rgba(230,236,240,.9)'; gfx.shadowBlur = 7;
      gfx.drawImage(ring, 0, 0); gfx.restore();
      // the head: nearest ring pixel just behind the sweep
      const data = ring.getContext('2d').getImageData(0, 0, W, H).data;
      let best = null, bd = 1e9;
      for (let y = by0; y < by1; y += 1) for (let x = bx0; x < bx1; x += 1) {
        if (data[(y * W + x) * 4 + 3] < 120) continue;
        let da = Math.atan2(y - cy, x - cx) - ang; da = Math.atan2(Math.sin(da), Math.cos(da));
        if (da > 0) continue;
        if (-da < bd) { bd = -da; best = [x, y]; }
      }
      if (best) {
        gfx.save(); gfx.globalCompositeOperation = 'lighter';
        const rg = gfx.createRadialGradient(best[0], best[1], 0, best[0], best[1], 60);
        rg.addColorStop(0, 'rgba(255,255,250,.75)'); rg.addColorStop(0.08, 'rgba(244,246,248,.45)'); rg.addColorStop(0.3, 'rgba(230,236,240,.12)'); rg.addColorStop(1, 'rgba(220,228,236,0)');
        gfx.fillStyle = rg; gfx.fillRect(best[0] - 60, best[1] - 60, 120, 120);
        // short streak along the tangent of the contour
        const tang = Math.atan2(best[1] - cy, best[0] - cx) + Math.PI / 2;
        gfx.translate(best[0], best[1]); gfx.rotate(tang);
        const lg = gfx.createRadialGradient(0, 0, 0, 0, 0, 1);
        lg.addColorStop(0, 'rgba(255,255,252,.8)'); lg.addColorStop(1, 'rgba(255,255,255,0)');
        gfx.scale(90, 2.2); gfx.fillStyle = lg; gfx.beginPath(); gfx.arc(0, 0, 1, 0, Math.PI * 2); gfx.fill();
        gfx.restore();
      }
    }
  }

  // ---------- falling fragments (paper front, darker back side), drawn above the sheet
  const back = document.createElement('canvas'); back.width = W; back.height = H;
  { const b = back.getContext('2d'); b.drawImage(pc, 0, 0); b.globalCompositeOperation = 'multiply'; b.fillStyle = '#F3EFE6'; b.fillRect(0, 0, W, H); }
  const pieces = [];
  for (let i = 0; i < NP; i++) {
    if (t < cutT(i) || t >= 1) continue;
    const tau = (t - cutT(i)) * 2.15; // seconds of fall
    const pop = Math.min(1, tau / 0.08) * 3;
    const y = 0.5 * 2200 * Math.max(0, tau - 0.06) ** 2 - pop;
    if (y > H + 200) continue;
    const ph = phys[i];
    pieces.push({ i, tau, y, x: ph.drift * tau, rot: ph.w * tau * 0.9, flip: Math.cos(ph.f0 + ph.fl * tau) });
  }
  for (const p of pieces) {
    const i = p.i, [cx, cy] = cent[i];
    const front = document.createElement('canvas'); front.width = pw; front.height = ph;
    const fxx = front.getContext('2d');
    fxx.drawImage(p.flip >= 0 ? pc : back, -bx0, -by0);
    fxx.globalCompositeOperation = 'destination-in'; fxx.drawImage(pieceCanvas[i], 0, 0);
    if (p.flip < 0) { fxx.globalCompositeOperation = 'source-atop'; fxx.fillStyle = 'rgba(120,100,70,.08)'; fxx.fillRect(0, 0, pw, ph); }
    ctx.save();
    ctx.translate(cx + p.x, cy + p.y);
    ctx.rotate(p.rot);
    ctx.scale(Math.max(0.08, Math.abs(p.flip)) * (p.flip < 0 ? -1 : 1), 1);
    const lift = Math.min(1, p.tau / 0.15);
    ctx.shadowColor = `rgba(18,14,30,${0.18 + 0.14 * lift})`; ctx.shadowBlur = 14 + 22 * lift;
    ctx.shadowOffsetX = 6 + 10 * lift; ctx.shadowOffsetY = 10 + 18 * lift;
    ctx.drawImage(front, bx0 - cx, by0 - cy);
    ctx.restore();
  }

  // ---------- cloth beneath (scene 3's abr), seen through the holes
  const abr = createAbr(layers.cloth);
  abr.render({ w: W, h: H, dpr: 1, time: t, contrast: 0.62, scale: phone ? 0.6 : 0.85, offset: [-6, 4], shade: [W * 0.7, H * 0.45, W * 0.6, 0.18], seed: 1.7 });

  // ---------- type
  const over = layers.over;
  navBar(over, kvg, { phone });
  const h2 = el('h2', 'h2 bunbu-h2', 'Qalam va qilich', over);
  const l1 = el('p', 'pair', 'Qalamdek toza kod.', over);
  const l2 = el('p', 'pair', 'Qilichdek aniq ish.', over);
  if (phone) {
    l1.style.left = '22px'; l1.style.top = (bun.y + inkH + 14) + 'px';
    l2.style.left = '22px'; l2.style.top = (bu.y + inkH + 14) + 'px';
  } else {
    l1.style.left = bun.x + 'px'; l1.style.top = (bun.y + inkH + 34) + 'px';
    l2.style.left = bu.x + 'px'; l2.style.top = (bu.y + inkH + 34) + 'px';
  }
  l1.style.opacity = smooth(0.58, 0.68, t);
  l2.style.opacity = smooth(0.94, 1.0, t);
  const cap = el('p', 'bunbu-cap', `Yaponlar buni <span lang="ja">文武両道</span> — bunbu ryōdō deydi.`, over);
  cap.style.opacity = smooth(0.96, 1.0, t);
  const lab = el('div', 'margin-v', '<span lang="ja">文</span><i>QALAM</i><span lang="ja">武</span><i>QILICH</i>', over);
  return {};
}

// ring around a mask: dilate by r px, minus the mask (outside ring); inside=true gives an inner ring
function ringOf(mask, W, H, r, colour, inside = false) {
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  if (!inside) {
    for (let a = 0; a < 8; a++) x.drawImage(mask, Math.cos(a * Math.PI / 4) * r, Math.sin(a * Math.PI / 4) * r);
    x.globalCompositeOperation = 'destination-out'; x.drawImage(mask, 0, 0);
  } else {
    x.drawImage(mask, 0, 0);
    const inv = document.createElement('canvas'); inv.width = W; inv.height = H; const ix = inv.getContext('2d');
    ix.fillRect(0, 0, W, H); ix.globalCompositeOperation = 'destination-out'; ix.drawImage(mask, 0, 0);
    const er = document.createElement('canvas'); er.width = W; er.height = H; const ex = er.getContext('2d');
    for (let a = 0; a < 8; a++) ex.drawImage(inv, Math.cos(a * Math.PI / 4) * r, Math.sin(a * Math.PI / 4) * r);
    x.globalCompositeOperation = 'source-over';
    x.clearRect(0, 0, W, H);
    x.drawImage(mask, 0, 0);
    x.globalCompositeOperation = 'destination-in'; x.drawImage(er, 0, 0);
  }
  x.globalCompositeOperation = 'source-in'; x.fillStyle = colour; x.fillRect(0, 0, W, H);
  return c;
}
