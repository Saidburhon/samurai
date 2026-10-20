// Scene 1: 切 KESIK — the hero. The 一 stroke is written, becomes steel, and cuts the sheet open.
import { bakeWashi } from './washi.js';
import { kanjiStrokes, buildField, inkOnto } from './fude.js';
import { splitPoly, makeT, apply, invert, cssMatrix, drawPieces, drawGlint } from './kesik.js';
import { houseSeal, stampOnto } from './seal.js';
import { createAbr } from './abr.js';
import { OK, C, el, clocks, navBar, expoOut, expoIn, easeInOut } from './common.js';
import { clamp } from './noise.js';

export async function hero(S) {
  const { W, H, kvg, phone, layers, mode } = S;
  // mode: { T } seconds into the load sequence; or { cut: e } / { glint: g }
  const m = 40;
  const L = phone
    ? { y: 0.36, x0: 0.06, x1: 0.94, bw: 80, rail: 30, up: 0.165, down: 0.155, rt: 0.5, rb: -0.6, flat: 0.4 }
    : { y: 0.47, x0: 0.07, x1: 0.93, bw: 150, rail: 56, up: 0.2, down: 0.165, rt: 0.4, rb: -0.5, flat: 0.36 };

  // ---------- timeline
  let T = mode.T ?? 16;
  let open, glint = -1, wetAge;
  let wedge = null;
  if (mode.wedge != null) { wedge = mode.wedge; T = 1.95; open = 0; }
  else if (mode.cut != null) { open = mode.cut; T = 2.05 + 0.9 * open; }
  else if (mode.glint != null) { T = 1.8 + 0.25 * mode.glint; }
  const strokeP = clamp((T - 0.35) / 1.45);
  if (open == null) open = expoOut(clamp((T - 2.05) / 0.9));
  if (T >= 1.8 && T < 2.12) glint = expoIn(clamp((T - 1.8) / 0.25));

  // ---------- paper
  const sw = W + 2 * m, sh = H + 2 * m;
  const sheet = bakeWashi(sw, sh, { seed: 11, scale: phone ? 0.75 : 1 });

  // ---------- the 一 stroke: KanjiVG 04e00 scaled to span x0..x1
  const k1 = kvg['一'];
  const ux0 = 11, ux1 = 96.88;
  const s = ((L.x1 - L.x0) * W) / (ux1 - ux0);
  const box = { x: L.x0 * W - ux0 * s, y: L.y * H - 52 * s, size: 109 * s };
  const st = kanjiStrokes(k1, box, { per: [{ W: L.bw, dryStart: 0.5, dry: 2.1, press: 0.25 }] });
  { const yy = st[0].pts[0][1]; st[0].pts.forEach((p) => { p[1] = yy + (p[1] - yy) * L.flat; }); }
  const fib = { data: sheet.fibre, w: sw, h: sh, ox: -m, oy: -m };
  const f1 = buildField(st, { W: L.bw, seed: 21, fibre: fib, bleed: 0.24 });
  const wetK = 0.9; // in seconds
  inkOnto(sheet, f1, { progress: strokeP, ox: m, oy: m, wetK: 1.2, age: Math.max(0, T - 1.55) * wetK, gloss: 1 });

  // cut line: least squares through the stroke's centre line
  const P = st[0].pts; let sx = 0, sy = 0, sxx = 0, sxy = 0, n = 0;
  for (let i = Math.floor(P.length * 0.08); i < P.length * 0.92; i++) { const [x, y] = P[i]; sx += x; sy += y; sxx += x * x; sxy += x * y; n++; }
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx), icpt = (sy - slope * sx) / n;
  const lineY = (x) => slope * x + icpt;
  const A = [-m - 50, lineY(-m - 50)], B = [W + m + 50, lineY(W + m + 50)];
  const dir = [B[0] - A[0], B[1] - A[1]];
  const rect = [[-m, -m], [W + m, -m], [W + m, H + m], [-m, H + m]];
  let [p1, p2] = splitPoly(rect, A, dir);
  const cy = (p) => p.reduce((a, q) => a + q[1], 0) / p.length;
  const topPoly = cy(p1) < cy(p2) ? p1 : p2, botPoly = topPoly === p1 ? p2 : p1;
  const pivot = { px: W / 2, py: lineY(W / 2) };
  const settle = open; // could add a tiny overshoot
  let Mt = makeT({ ...pivot, ty: -L.up * H * settle, rot: L.rt * settle });
  let Mb = makeT({ ...pivot, ty: L.down * H * settle, rot: L.rb * settle });
  let headX = 0;
  if (wedge != null) { // the cut is travelling: the sheet opens like scissors behind the blade
    headX = L.x0 * W - 60 + wedge * ((L.x1 - L.x0) * W + 140);
    const hp = { px: headX, py: lineY(headX) };
    const ang = (phone ? 6 : 4.6) * (0.35 + 0.65 * wedge);
    Mt = makeT({ ...hp, rot: ang }); Mb = makeT({ ...hp, rot: -ang * 0.8 });
    open = 0.0001;
  }
  const cutA = [A[0], A[1]], cutB = [B[0], B[1]];

  // ---------- things written on the bottom piece after the cut (in sheet coords)
  const iMb = invert(Mb), iMt = invert(Mt);
  const botEdgeY = (x) => { // screen y of the bottom piece's cut edge at screen x
    const a = apply(Mb, cutA), b = apply(Mb, cutB); return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]);
  };
  const topEdgeY = (x) => { const a = apply(Mt, cutA), b = apply(Mt, cutB); return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); };

  // 剣 calligraphy, written 6.0–8.2 s
  const kenP = clamp((T - 6.0) / 2.2);
  let kenBox = null;
  if (kenP > 0) {
    const kx = phone ? 22 : 104;
    const kTop = botEdgeY(kx + 60) + L.rail + (phone ? 50 : 34);
    const kH = phone ? 172 : Math.min(230, H - 34 - kTop);
    const size = kH / 0.8;
    // KanjiVG 剣 spans ~[13,92]x[15,96]: place so the ink box starts at kx,kTop
    const scr = { x: kx - 13 * (size / 109), y: kTop - 15 * (size / 109), size };
    // map to sheet coords of the bottom piece (it is rotated by ~0.5deg: write axis-aligned in sheet space)
    const o = apply(iMb, [scr.x, scr.y]);
    const bw = size * 0.11;
    const kst = kanjiStrokes(kvg['剣'], { x: o[0], y: o[1], size }, {});
    const fk = buildField(kst, { W: bw, seed: 5, fibre: fib, dry: 1.0, dryStart: 0.5, bleed: 0.2 });
    inkOnto(sheet, fk, { progress: kenP, ox: m, oy: m, wetK: 1.6, age: Math.max(0, T - 8.2) * 0.9 });
    kenBox = { x: kx, y: kTop, w: kH * 0.85, h: kH };
  }

  // seal, 3.40–3.60 s
  const sealOn = T >= 3.5;
  const sealSize = phone ? 84 : 110;
  let sealC = { x: W - 104 - sealSize / 2, y: H - 52 - sealSize / 2 };
  if (phone) { const kTop = botEdgeY(82) + L.rail + 50; sealC = { x: W - 22 - sealSize / 2, y: kTop + 172 - sealSize / 2 }; }
  if (sealOn) {
    const hs = houseSeal(sealSize, { k: 3, seed: 5 });
    const o = apply(iMb, [sealC.x, sealC.y]);
    stampOnto(sheet, hs, o[0] + m, o[1] + m, sealSize, -2 - L.rb, { strength: 0.96 });
  }

  // ---------- compose the sheet canvas
  const sc = document.createElement('canvas'); sc.width = sw; sc.height = sh;
  sc.getContext('2d').putImageData(sheet.img, 0, 0);

  // ---------- cloth
  const cloth = layers.cloth;
  const abr = createAbr(cloth);
  const gapTopL = topEdgeY(0), gapBotL = botEdgeY(0);

  // ---------- h1 in the gap (DOM, under the paper)
  const under = layers.under;
  const hb = el('div', 'hero-gap' + (phone ? ' phone' : ''), null, under);
  const h1 = el('h1', 'h1', phone
    ? `Yapon IT<br>agenstvasi<br>endi <em>O${OK}zbekistonda!</em>`
    : `Yapon IT agenstvasi<br>endi <em>O${OK}zbekistonda!</em>`, hb);
  const sub = el('p', 'sub', `Mobil ilovalar, saytlar, Telegram botlar va AI — yapon sifati bilan, Toshkentda.`, hb);
  // place: vertically centred in the gap at the text's centre x
  await document.fonts.ready;
  const hx = phone ? 22 : 104;
  hb.style.left = hx + 'px';
  const bh = hb.getBoundingClientRect().height;
  const bwid = hb.getBoundingClientRect().width;
  const cxT = hx + bwid * 0.42;
    const settledTop = (topEdgeY(cxT) + botEdgeY(cxT)) / 2 - bh / 2 + (phone ? 4 : 2);
  const rise = wedge != null ? 10 : 24 * (1 - easeInOut(clamp((T - 2.05) / 0.9)));
  hb.style.top = settledTop + rise + 'px';
  if (T < 2.9) { // sub-line inks in 2.95–3.40
    sub.style.opacity = 0;
  }
  // text boxes calm the cloth motif
  const r = hb.getBoundingClientRect();
  abr.render({
    w: W, h: H, dpr: 1, time: T, contrast: phone ? 0.62 : 0.46, scale: phone ? 0.62 : 1,
    boxes: phone ? [[r.left - 10, r.top + 4, r.width * 0.92, r.height - 8]] : [[r.left - 30, r.top - 10, r.width + 60, r.height + 20]],
    sheen: phone ? [W * 0.75, (gapTopL + gapBotL) / 2 - 40, 0.12] : [W * 0.8, topEdgeY(W * 0.8) + 92, 0.24],
    shade: [W * 0.45, (topEdgeY(W / 2) + botEdgeY(W / 2)) / 2, W * 0.75, 0.16],
    seed: 0.37,
  });

  // ---------- paper pieces
  const pc = layers.paper; pc.width = W; pc.height = H;
  const ctx = pc.getContext('2d');
  ctx.clearRect(0, 0, W, H);
  let pieces = [
    { poly: topPoly, M: Mt, cuts: [[cutA, cutB, -1]], lift: open < 1 ? Math.sin(Math.PI * open) * 0.9 : 0 },
    { poly: botPoly, M: Mb, cuts: [[cutA, cutB, 1]], lift: open < 1 ? Math.sin(Math.PI * open) * 0.7 : 0 },
  ];
  if (wedge != null) { // only the part behind the blade is cut; ahead of it the sheet is still whole
    const hp = [headX, lineY(headX)];
    const [tl] = splitPoly(topPoly, hp, [0, 1]), [bl] = splitPoly(botPoly, hp, [0, 1]);
    const [, right] = splitPoly(rect, hp, [0, 1]);
    const I = [1, 0, 0, 1, 0, 0];
    pieces = [
      { poly: right, M: I, cuts: [], lift: 0 },
      { poly: tl, M: Mt, cuts: [[cutA, hp, -1]], lift: 0.5 },
      { poly: bl, M: Mb, cuts: [[cutA, hp, 1]], lift: 0.4 },
    ];
  }
  if (open > 0.002 || wedge != null) drawPieces(ctx, pieces, sc, { m });
  else { ctx.drawImage(sc, -m, -m); }

  // ---------- glint (ink becomes steel) and the cut name
  const fx = layers.fx; fx.width = W; fx.height = H; const g = fx.getContext('2d');
  const gx0 = L.x0 * W - 40, gx1 = L.x1 * W + 60;
  if (glint >= 0 && wedge == null) {
    drawGlint(g, [gx0, lineY(gx0)], [gx1, lineY(gx1)], Math.min(1, glint * 1.08), { tail: 0.55, intensity: 1 });
  }
  if (wedge != null) {
    // steel light: bright along both fresh edges behind the blade, a blazing head, nothing ahead
    for (const [M, k] of [[Mt, 1], [Mb, 0.85]]) {
      const a = apply(M, [gx0, lineY(gx0)]), b = apply(M, [headX, lineY(headX)]);
      g.save(); g.globalCompositeOperation = 'lighter';
      const lg = g.createLinearGradient(a[0], a[1], b[0], b[1]);
      lg.addColorStop(0, 'rgba(226,232,238,0.05)'); lg.addColorStop(0.6, `rgba(230,236,240,${0.35 * k})`); lg.addColorStop(1, `rgba(255,255,252,${1 * k})`);
      g.strokeStyle = lg; g.lineWidth = 2; g.shadowColor = 'rgba(225,232,238,.95)'; g.shadowBlur = 12;
      g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); g.restore();
    }
    drawGlint(g, [gx0, lineY(gx0)], [headX, lineY(headX)], 1, { tail: 0.22, intensity: 1 });
  }
  if (open > 0 && open < 1 && wedge == null) {
    // steel light lingers on both fresh edges
    const I = Math.pow(1 - open, 0.85);
    for (const M of [Mt, Mb]) {
      const a = apply(M, [gx0, lineY(gx0)]), b = apply(M, [gx1, lineY(gx1)]);
      g.save(); g.globalCompositeOperation = 'lighter';
      const lg = g.createLinearGradient(a[0], a[1], b[0], b[1]);
      lg.addColorStop(0, 'rgba(226,232,238,0)'); lg.addColorStop(0.55, `rgba(226,232,238,${0.35 * I})`); lg.addColorStop(1, `rgba(246,248,250,${0.95 * I})`);
      g.strokeStyle = lg; g.lineWidth = 1.8; g.shadowColor = `rgba(220,228,236,${0.9 * I})`; g.shadowBlur = 10;
      g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); g.restore();
    }
    // the blade's exit: an anisotropic flare where the cut leaves the sheet
    const ex = Math.min(W - 18, gx1 + 30), eyT = topEdgeY(ex), eyB = botEdgeY(ex), eyM = (eyT + eyB) / 2;
    g.save(); g.globalCompositeOperation = 'lighter';
    for (const [yy, k] of [[eyT, 1], [eyB, 0.8]]) {
      g.save(); g.translate(ex, yy); g.rotate(Math.atan(slope));
      const rg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
      rg.addColorStop(0, `rgba(255,255,252,${0.95 * I * k})`); rg.addColorStop(0.25, `rgba(232,238,244,${0.35 * I * k})`); rg.addColorStop(1, 'rgba(220,228,236,0)');
      g.fillStyle = rg; g.scale(260, 5); g.beginPath(); g.arc(0, 0, 1, 0, Math.PI * 2); g.fill(); g.restore();
      const r2 = g.createRadialGradient(ex, yy, 0, ex, yy, 40);
      r2.addColorStop(0, `rgba(255,255,250,${0.7 * I * k})`); r2.addColorStop(1, 'rgba(255,255,250,0)');
      g.fillStyle = r2; g.fillRect(ex - 40, yy - 40, 80, 80);
    }
    g.restore();
  }
  const over = layers.over;
  if (wedge != null) {
    const lb = el('div', 'cutname', `<span lang="ja">横一文字</span><b>YOKO-ICHIMONJI</b>`, over);
    lb.style.left = (Math.min(W - 40, headX + 26)) + 'px'; lb.style.top = (topEdgeY(headX) - L.rail - (phone ? 150 : 196)) + 'px';
  } else if (T >= 1.8 && T < 2.6) {
    const lb = el('div', 'cutname', `<span lang="ja">横一文字</span><b>YOKO-ICHIMONJI</b>`, over);
    const ey = topEdgeY(W - 60) - L.rail;
    const a = clamp((T - 1.9) / 0.1) * (1 - clamp((T - 2.5) / 0.1));
    lb.style.left = (W - (phone ? 34 : 58)) + 'px'; lb.style.top = (ey - (phone ? 150 : 200)) + 'px'; lb.style.opacity = a;
  }

  // ---------- UI on the pieces
  if (T >= 4.0) {
    navBar(over, kvg, { phone });
    // clocks printed on the top piece
    const topG = el('div', 'piece-ui', null, over); topG.style.transform = cssMatrix(Mt);
    const { tash, tok } = clocks();
    const ck = el('div', 'clocks', `<span>TOSHKENT</span> <b>${tash}</b><i>·</i><span>TOKIO</span> <b>${tok}</b>`, topG);
    // pre-transform position so it lands where we want after Mt
    const want = phone ? [22, topEdgeY(22) - L.rail - 30] : [W - 104 - 300, topEdgeY(W - 400) - L.rail - 40];
    const pp = apply(iMt, want);
    ck.style.left = pp[0] + 'px'; ck.style.top = pp[1] + 'px';
    if (!phone) ck.style.width = '300px';
  }
  if (T >= 3.6) {
    const botG = el('div', 'piece-ui', null, over); botG.style.transform = cssMatrix(Mb);
    const sig = el('div', 'signature', '<span lang="ja">タシケント</span><span lang="ja" class="k">剣</span>', botG);
    const sp = apply(iMb, [sealC.x - sealSize / 2 - (phone ? 10 : 16), sealC.y - sealSize / 2 + 2]);
    sig.style.left = sp[0] + 'px'; sig.style.top = sp[1] + 'px';
    sig.style.opacity = clamp((T - 3.6) / 0.6);
    if (T >= 12.6) {
      const cap = el('p', 'caption', `<svg viewBox="0 0 40 10" width="34" height="10" aria-hidden="true"><path d="M1 6 C7 1, 11 9, 17 5 S 27 2, 32 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>Sekin — qalam. <svg viewBox="0 0 40 10" width="34" height="10" aria-hidden="true"><path d="M1 8 L39 2" stroke="currentColor" stroke-width="1.1"/></svg>Tez — qilich.`, botG);
      const cx = phone ? 22 : (kenBox ? kenBox.x + kenBox.w + 70 : 104);
      const cyp = phone ? H - 48 : H - 58;
      const q = apply(iMb, [cx, cyp]);
      cap.style.left = q[0] + 'px'; cap.style.top = q[1] + 'px';
      if (phone) { cap.style.left = (q[0]) + 'px'; }
    }
  }
  return { open, T };
}
