// Scene 1: 切 KESIK, the hero. The 一 stroke is written, turns to steel and cuts the sheet open;
// the h1 sits on the indigo cloth in the gap. Scroll parts the halves into two black rails, then 真っ向 splits it all.
import { kanjiStrokes, buildField } from '../fude.js';
import { splitPoly, invert } from '../kesik.js';
import { houseSeal } from '../seal.js';
import { clamp, seg, io2, expoOut, expoIn, makeT, apply, mul, tr, rotAbout, css, polyEdges, halfPlane, clipBy, rectPoly, polyCss, cutState, reveal, refs, setT, setClip, place, I } from '../util.js';

export function hero(S) {
  const { W, H, phone, R, paper, kvg } = S;
  const m = paper.m;
  const L = phone
    ? { y: 0.36, x0: 0.06, x1: 0.94, bw: 80, up: 0.165, down: 0.155, rt: 0.5, rb: -0.6, flat: 0.4, up1: 0.285, down1: 0.53 }
    : { y: 0.47, x0: 0.07, x1: 0.93, bw: 150, up: 0.2, down: 0.165, rt: 0.4, rb: -0.5, flat: 0.36, up1: 0.36, down1: 0.42 };
  const sec = document.getElementById('boshi');

  // ---------- the 一 stroke (KanjiVG 04e00) spanning x0..x1
  const k1 = kvg['一'];
  const ux0 = 11, ux1 = 96.88;
  const s = ((L.x1 - L.x0) * W) / (ux1 - ux0);
  const box = { x: L.x0 * W - ux0 * s, y: L.y * H - 52 * s, size: 109 * s };
  const st = kanjiStrokes(k1, box, { per: [{ W: L.bw, dryStart: 0.5, dry: 2.1, press: 0.25 }] });
  { const yy = st[0].pts[0][1]; st[0].pts.forEach((p) => { p[1] = yy + (p[1] - yy) * L.flat; }); }
  const fib = { data: paper.fibre, w: paper.w, h: paper.h, ox: -m, oy: -m };
  const f1 = R.fieldTex(buildField(st, { W: L.bw, seed: 21, fibre: fib, bleed: 0.24 }));

  // the cut line: least squares through the stroke's centre line
  const P = st[0].pts; let sx = 0, sy = 0, sxx = 0, sxy = 0, n = 0;
  for (let i = Math.floor(P.length * 0.08); i < P.length * 0.92; i++) { const [x, y] = P[i]; sx += x; sy += y; sxx += x * x; sxy += x * y; n++; }
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx), icpt = (sy - slope * sx) / n;
  const lineY = (x) => slope * x + icpt;
  const A = [-m - 50, lineY(-m - 50)], B = [W + m + 50, lineY(W + m + 50)];
  const rect = [[-m, -m], [W + m, -m], [W + m, H + m], [-m, H + m]];
  const [p1, p2] = splitPoly(rect, A, [B[0] - A[0], B[1] - A[1]]);
  const cyOf = (p) => p.reduce((a, q) => a + q[1], 0) / p.length;
  const topPoly = cyOf(p1) < cyOf(p2) ? p1 : p2, botPoly = topPoly === p1 ? p2 : p1;
  const onCut = (i, a, b) => Math.abs(lineY(a[0]) - a[1]) < 0.5 && Math.abs(lineY(b[0]) - b[1]) < 0.5;
  const topE = polyEdges(topPoly, onCut), botE = polyEdges(botPoly, onCut);
  const pivot = { px: W / 2, py: lineY(W / 2) };
  // ghost slash corner (bottom right, holds no ink)
  const C0 = phone ? [W + m, H - 74] : [W + m, H - 112], C1 = phone ? [W - 112, H + m] : [W - 176, H + m];
  const [q1, q2] = splitPoly(botPoly, C0, [C1[0] - C0[0], C1[1] - C0[1]]);
  const inside = (poly, p) => { for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length]; if ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]) < -1e-6) return false; } return true; };
  const cornerPoly = inside(q1, [W + m - 2, H + m - 2]) || q1.some((p) => p[0] > W + m - 1 && p[1] > H + m - 1) ? q1 : q2;
  const mainPoly = cornerPoly === q1 ? q2 : q1;
  const onCorner = (i, a, b) => { const f = (p) => (C1[0] - C0[0]) * (p[1] - C0[1]) - (C1[1] - C0[1]) * (p[0] - C0[0]); return Math.abs(f(a)) < 2 && Math.abs(f(b)) < 2; };
  const cornerC = cornerPoly.reduce((a, p) => [a[0] + p[0] / cornerPoly.length, a[1] + p[1] / cornerPoly.length], [0, 0]);
  const healE = halfPlane(C0, C1, 1, 0); // dl grows into the corner
  { const t = healE[0] * (W + m) + healE[1] * (H + m) + healE[2]; if (t < 0) { healE[0] *= -1; healE[1] *= -1; healE[2] *= -1; } }

  const transforms = (open, sp) => ({
    Mt: makeT({ ...pivot, ty: -(L.up * open + (L.up1 - L.up) * sp) * H, rot: L.rt * open * (1 - 0.5 * sp) }),
    Mb: makeT({ ...pivot, ty: (L.down * open + (L.down1 - L.down) * sp) * H, rot: L.rb * open * (1 - 0.5 * sp) }),
  });
  const settled = transforms(1, 0);
  const iMb = invert(settled.Mb), iMt = invert(settled.Mt);
  const edgeYs = (M, x) => { const a = apply(M, A), b = apply(M, B); return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); };

  // ---------- 剣, the seal and their places on the bottom piece (sheet coords)
  const kx = phone ? 22 : 104;
  const kTop = edgeYs(settled.Mb, kx + 60) + L.bw / 2 + (phone ? 52 : 40);
  const kH = phone ? 166 : Math.min(230, H - 40 - kTop);
  const kSize = kH / 0.8;
  const kenScr = { x: kx - 13 * (kSize / 109), y: kTop - 15 * (kSize / 109) };
  const kenO = apply(iMb, [kenScr.x, kenScr.y]);
  let fKen = null;
  const sealSize = phone ? 84 : 110;
  let sealC = { x: W - 104 - sealSize / 2, y: H - 58 - sealSize / 2 };
  if (phone) sealC = { x: W - 22 - sealSize / 2, y: kTop + kH - sealSize / 2 - 4 };
  const sealO = apply(iMb, [sealC.x, sealC.y]);
  let sealTex = null;
  S.tasks.add('boshi.ken', () => {
    const kst = kanjiStrokes(kvg['剣'], { x: kenO[0], y: kenO[1], size: kSize }, {});
    fKen = R.fieldTex(buildField(kst, { W: kSize * 0.11, seed: 5, fibre: fib, dry: 1.0, dryStart: 0.5, bleed: 0.2 }));
  }, 1);
  sealTex = R.texFrom(houseSeal(sealSize, { k: 3, seed: 5 }), { premul: true });

  // ---------- DOM
  const hg = sec.querySelector('.hg');
  const h1 = sec.querySelector('#h1'), sub = sec.querySelector('.sub');
  if (phone) h1.innerHTML = `<span class="l">Yapon IT</span> <span class="l">agenstvasi</span> <span class="l">endi <em>O${'ʻ'}zbekistonda!</em></span>`;
  const hx = phone ? 22 : 104;
  const hgR = hg.getBoundingClientRect();
  const hgW = hgR.width, hgH = hgR.height;
  const gapMid = (Mt, Mb, x) => (edgeYs(Mt, x) + edgeYs(Mb, x)) / 2;
  const clocksPos = apply(iMt, phone ? [22, edgeYs(settled.Mt, 22) - L.bw / 2 - 34] : [W - 104 - 300, edgeYs(settled.Mt, W - 400) - L.bw / 2 - 44]);
  const sigPos = apply(iMb, [sealC.x - sealSize / 2 - (phone ? 26 : 34), sealC.y - sealSize / 2 + 2]);
  const cuePos = apply(iMb, phone ? [22, H - 44] : [W / 2 - 60, H - 46]);

  function state(b, T) {
    const strokeP = clamp((T - 0.35) / 1.45);
    const open = expoOut(seg(T, 2.05, 2.95));
    const sp = io2(seg(b, 0, 1));
    const { Mt, Mb } = transforms(open, sp);
    return { strokeP, open, sp, Mt, Mb };
  }

  function drawPiece(poly, edges, M, inks, o = {}) {
    R.push(M, edges);
    R.paper({ tex: paper, rect: [-m, -m, W + 2 * m, H + 2 * m], variant: 0, lift: o.lift ?? 0, tint: o.tint, heal: o.heal, healF: o.healF });
    if (!o.noInk) for (const [f, opt] of inks) if (f) R.ink(f, { paper, ...opt });
    R.pop();
  }
  function shadowOf(edges, M, lift, alpha = 0.26) {
    R.push(mul(tr(6 + 8 * lift, 10 + 16 * lift), M), edges);
    R.shadow({ rect: [-m - 60, -m - 60, W + 2 * m + 120, H + 2 * m + 120], alpha: alpha + 0.08 * lift, blur: 18 + 14 * lift });
    R.pop();
  }

  const scene = {
    id: 'boshi', el: sec, z: 10, range: [0, 2], ground: 'paper', navBeat: 0, poster: [0],
    draw(b, T) {
      const { strokeP, open, Mt, Mb } = state(b, T);
      const wetAge = Math.max(0, T - 1.55) * 0.9;
      const inkTop = [[f1, { p: strokeP, wetK: 1.2, age: wetAge }]];
      const kenP = clamp((T - 6.0) / 2.2);
      const inkBot = inkTop.concat(fKen && kenP > 0 ? [[fKen, { p: kenP, wetK: 1.6, age: Math.max(0, T - 8.2) * 0.9 }]] : []);
      if (open <= 0.0015) { drawPiece(rect, [], I, inkTop); this.glints(T, b); return; }
      R.cloth({ rect: [-m, -m, W + 2 * m, H + 2 * m], contrast: (phone ? 0.6 : 0.46) + 0.3 * seg(b, 0, 1), scale: phone ? 0.62 : 1, time: 3, seed: 0.37,
        boxes: this.h1Box ? [this.h1Box] : [], sheen: phone ? [W * 0.75, H * 0.36, 0.12] : [S.pointer[0], S.pointer[1], 0.22], shade: [W * 0.45, pivot.py, W * 0.8, 0.16] });
      const lift = open < 1 ? Math.sin(Math.PI * open) : 0;
      // ghost slash: the corner of the bottom piece falls and the paper heals from pulp
      const slash = T >= 12.15 && T < 18;
      const tau = T - 12.15;
      const falling = slash && tau < 1.2;
      const fallM = () => {
        const g = 0.5 * 2600 * Math.max(0, tau - 0.04) ** 2 - Math.min(1, tau / 0.06) * 3;
        const flipv = Math.cos(0.4 + 3.4 * tau);
        const M0 = mul(tr(cornerC[0] + 40 * tau, cornerC[1] + g), mul(makeT({ rot: 70 * tau }), [Math.abs(flipv) < 0.08 ? 0.08 * Math.sign(flipv || 1) : flipv, 0, 0, 1, 0, 0]));
        return { M: mul(Mb, mul(M0, tr(-cornerC[0], -cornerC[1]))), back: flipv < 0 };
      };
      shadowOf(topE, Mt, lift); shadowOf(slash ? polyEdges(mainPoly) : botE, Mb, lift * 0.8);
      drawPiece(topPoly, topE, Mt, inkTop, { lift });
      if (!slash) drawPiece(botPoly, botE, Mb, inkBot, { lift });
      else {
        drawPiece(mainPoly, polyEdges(mainPoly, (i, a, b) => onCut(i, a, b) || (T < 13.4 && onCorner(i, a, b))), Mb, inkBot, { lift });
        if (T >= 12.9) { // healing pulp
          const F = (T - 12.9) * 110;
          const fade = 1 - seg(T, 15, 18);
          drawPiece(cornerPoly, polyEdges(cornerPoly), Mb, [], { heal: [healE[0], healE[1], healE[2], 1], healF: F, tint: [1 + 0.022 * fade, 1 + 0.02 * fade, 1 + 0.016 * fade], noInk: true });
        }
        if (falling) { const fm = fallM(); const ce = polyEdges(cornerPoly, onCorner); shadowOf(ce, fm.M, 1, 0.22); drawPiece(cornerPoly, ce, fm.M, [], { tint: fm.back ? [0.93, 0.9, 0.84] : undefined, noInk: true }); }
      }
      if (sealTex && T >= 3.4) {
        const k = T < 3.5 ? 1.25 - 0.25 * seg(T, 3.4, 3.5) : 1;
        const shake = T >= 3.5 && T < 3.56 ? Math.sin((T - 3.5) * 160) * 0.8 : 0;
        R.push(mul(Mb, mul(tr(sealO[0] + shake, sealO[1]), makeT({ rot: -2 - L.rb, sx: k, sy: k }))));
        R.sprite(sealTex, { rect: [-sealSize / 2, -sealSize / 2, sealSize, sealSize], mode: T < 3.5 ? 0 : 1, alpha: T < 3.5 ? 0.9 : 0.96 });
        R.pop();
      }
      this.glints(T, b, Mt, Mb, open);
    },
    glints(T, b, Mt, Mb, open = 0) {
      const gx0 = L.x0 * W - 40, gx1 = L.x1 * W + 60;
      if (T >= 1.8 && T < 2.12) R.glint([gx0, lineY(gx0)], [gx1, lineY(gx1)], Math.min(1, expoIn(seg(T, 1.8, 2.05)) * 1.06), { tail: 0.55, flare: phone ? 40 : 64 });
      if (open > 0 && open < 1) { // steel light lingers on both fresh edges
        const Iv = Math.pow(1 - open, 0.85);
        for (const M of [Mt, Mb]) R.glint(apply(M, [gx0, lineY(gx0)]), apply(M, [gx1, lineY(gx1)]), 1, { tail: 1, intensity: 0.75 * Iv, flare: 70 });
      }
      if (T >= 12.0 && T < 12.3 && Mb) { const t = seg(T, 12.0, 12.16); R.glint(apply(Mb, C0), apply(Mb, C1), Math.min(1, t * 1.1), { tail: 0.6, intensity: 1 - seg(T, 12.18, 12.3), flare: 36 }); }
    },
    dom(b, root, T) {
      const r = refs(root, { gap: '.hero-gap', hg: '.hg', h1: 'h1', sub: '.sub', top: '.pu-top', bot: '.pu-bot', ck: '.clocks', sig: '.signature', cue: '.cue' });
      const { open, sp, Mt, Mb } = state(b, T);
      // h1 block centred in the gap, a little bigger as the halves part
      const sc = 1 + (phone ? 0.08 : 0.12) * sp;
      const cx = hx + hgW * 0.42;
      const mid = gapMid(Mt, Mb, cx);
      const rise = 24 * (1 - io2(seg(T, 2.05, 2.95)));
      const x = hx - (phone ? 0 : hgW * 0.06) * sp, y = mid - (hgH * sc) / 2 + rise + (phone ? 4 : 2);
      setT(r.hg, `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${sc.toFixed(4)})`);
      if (root === sec) this.h1Box = [x - 30, y - 10, hgW * sc + 60, hgH * sc + 20];
      let gap = rectPoly(0, 0, W, H);
      if (open <= 0.0015) gap = [];
      else { gap = clipBy(gap, halfPlane(apply(Mt, A), apply(Mt, B), 1)); gap = clipBy(gap, halfPlane(apply(Mb, A), apply(Mb, B), -1)); }
      setClip(r.gap, polyCss(gap));
      reveal(r.sub, seg(T, 2.95, 3.45));
      setT(r.top, css(Mt)); setT(r.bot, css(Mb));
      if (!r.ck._p) { place(r.ck, clocksPos[0], clocksPos[1]); if (!phone) { r.ck.style.width = '300px'; r.ck.style.justifyContent = 'flex-end'; } place(r.sig, sigPos[0], sigPos[1]); r.sig.style.transform = 'translateX(-100%)'; place(r.cue, cuePos[0], cuePos[1]); r.ck._p = 1; }
      reveal(r.ck, seg(T, 4.2, 4.8));
      reveal(r.sig, seg(T, 3.6, 4.2), 'y');
      r.cue.style.opacity = (seg(T, 9, 10) * (1 - seg(b, 0.05, 0.3))).toFixed(3);
    },
    // the load-sequence cut is named beside its exit for a moment
    introLabel(T) {
      if (T < 1.85 || T > 2.65) return null;
      return { ja: '横一文字', rom: 'YOKO-ICHIMONJI', a: seg(T, 1.85, 1.95) * (1 - seg(T, 2.5, 2.65)), at: () => [W - (phone ? 30 : 58), lineY(W - 60) - L.bw / 2 - (phone ? 190 : 250)] };
    },
    // 真っ向 makkō: a vertical cut down the middle; the halves part left and right
    exit: {
      from: 1.04, to: 2, freeze: 1,
      state(b) {
        const lean = 0.014 * W;
        return cutState(b, { from: 1.04, glintEnd: 1.2, sepStart: 1.12, to: 1.97, line: [[W / 2 + lean, -0.08 * H], [W / 2 - lean, 1.08 * H]], dist: W * 0.6, rot: 1.1, ease: io2 }, W, H);
      },
      label: { ja: '真っ向', rom: 'MAKKŌ', from: 1.02, to: 1.6, at: () => [W / 2 + (phone ? 14 : 22), H - (phone ? 210 : 260)], cloth: true },
    },
  };
  return scene;
}
