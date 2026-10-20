// Scene 6: 時 VAQT — two ensō are 24 h dials. Tashkent (feruza) and Tokyo (shu) working-day washes.
// Side by side, each shows its own time; they slide together and Tokyo turns by the 4 h offset (-60°),
// so one instant sits at one angle on both, and the overprinted washes show the shared hours.
import { buildField } from '../fude.js';
import { clamp, seg, io2, io3, lerp, reveal, refs, place, setT, mul, tr, makeT } from '../util.js';
import { vnoise, hash2, smooth, hex } from '../noise.js';

const TZ_T = 5, TZ_K = 9;

export function jikan(S) {
  const { W, H, phone, R, paper } = S;
  const m = paper.m;
  const V = 3;
  const sec = document.getElementById('vaqt');
  const R0 = phone ? 118 : 196, R2 = R0 * 1.2;
  const off = TZ_K - TZ_T;
  const shared = [Math.max(9, 9 - off), Math.min(18, 18 - off)]; // in Tashkent hours, computed
  const ang = (h) => ((h / 24) * 360 - 90) * Math.PI / 180;
  // dial placement: side by side (desktop) then concentric
  const cC = phone ? [W / 2, 0.5 * H] : [0.655 * W, 0.53 * H];
  const side = phone ? null : { a: [0.535 * W, 0.53 * H], b: [0.805 * W, 0.53 * H], sA: 0.78, sB: 0.78 * R0 / R2 };
  const fib = { data: paper.fibre, w: paper.w, h: paper.h, ox: -m, oy: -m };
  const enso = (r, a0deg, sweep, W0, seed, lean) => {
    const pts = []; const n = 300;
    for (let i = 0; i <= n; i++) {
      const f = i / n; const a = (a0deg + sweep * f) * Math.PI / 180;
      const rr = r * (1 + 0.025 * Math.sin(f * 5.1 + seed) + 0.018 * (vnoise(f * 6, seed, 3) - 0.5) * 2 + lean * f);
      pts.push([Math.cos(a) * rr * 1.01, Math.sin(a) * rr]);
    }
    return { pts, kind: 'harai', W: W0, press: 0.32, entry: 0.06, haraiFrom: 0.72, haraiDry: 1.7, dryStart: 0.42, dry: 1.3 };
  };
  const D = { A: null, B: null, hand: null, wA: null, wB: null };
  S.tasks.add('vaqt.enso', () => {
    D.A = R.fieldTex(buildField([enso(R0, 118, 336, R0 * 0.21, 1, -0.035)], { W: R0 * 0.21, seed: 12, bleed: 0.24 }));
    D.B = R.fieldTex(buildField([enso(R2, 118, 338, R0 * 0.17, 2, 0.03)], { W: R0 * 0.17, seed: 19, bleed: 0.24 }));
    const hand = { pts: [], kind: 'harai', W: R0 * 0.11, press: 0.4, haraiFrom: 0.35, haraiDry: 0.6 };
    for (let i = 0; i <= 40; i++) { const f = i / 40; hand.pts.push([R0 * (0.06 + 0.66 * f), Math.sin(f * 3) * 1.5]); }
    D.hand = R.fieldTex(buildField([hand], { W: R0 * 0.11, seed: 5, bleed: 0.2 }));
  }, 11);
  S.tasks.add('vaqt.wash', () => {
    D.wA = washTex(R, { from: 9, to: 18, r0: 0.4, r1: 0.9, col: hex('#1E9C93'), a: 0.62, seed: 3 }, R0, ang);
    D.wB = washTex(R, { from: 9, to: 18, r0: 0.6, r1: 1.13, col: hex('#D3462B'), a: 0.56, seed: 7 }, R0, ang);
  }, 11);

  function st(b) {
    const join = phone ? 1 : io3(seg(b, 16.05, 16.85));
    const sA = phone ? 1 : lerp(side.sA, 1, join), sB = phone ? 1 : lerp(side.sB, 1, join);
    const cA = phone ? cC : [lerp(side.a[0], cC[0], join), lerp(side.a[1], cC[1], join)];
    const cB = phone ? cC : [lerp(side.b[0], cC[0], join), lerp(side.b[1], cC[1], join)];
    const rotB = -60 * join; // degrees: the 4 h offset
    return { join, sA, sB, cA, cB, rotB };
  }
  const now = () => { const d = new Date(); const u = d.getUTCHours() + d.getUTCMinutes() / 60; return ((u + TZ_T) % 24 + 24) % 24; };

  // ---------- DOM
  const r0 = refs(sec, { h2: '.jk-h2', tt: '.tm-t', tk: '.tm-k', sh: '.jk-shared', sub: '.jk-sub', dial: '.jk-dial' });
  if (phone) {
    place(r0.h2, 22, 70);
    r0.tt.parentElement.style.cssText = 'left:0;top:0;width:100%;height:100%;display:block';
    r0.tt.style.position = r0.tk.style.position = 'absolute';
    place(r0.tt, 22, cC[1] - R2 - 92); place(r0.tk, 22, cC[1] + R2 + 34);
    place(r0.sh, 22, cC[1] + R2 + 108); r0.sh.style.maxWidth = (W - 44) + 'px';
    place(r0.sub, 22, H - 64);
  } else {
    place(r0.h2, 104, 96);
    r0.tt.parentElement.style.left = '104px'; r0.tt.parentElement.style.top = (0.47 * H) + 'px';
    place(r0.sh, cC[0] - 300, cC[1] + R2 + 40); r0.sh.style.maxWidth = '600px'; r0.sh.style.textAlign = 'center'; r0.sh.style.width = '600px';
    place(r0.sub, 106, H - 70);
  }
  // 0 / 6 / 12 / 18 ticks of the Tashkent dial (svg, follows dial A)
  let svg = `<svg width="1" height="1" class="jk-ticks">`;
  for (const h of [0, 6, 12, 18]) { const a = ang(h), r = R0 * 0.27; svg += `<text x="${(Math.cos(a) * r).toFixed(1)}" y="${(Math.sin(a) * r + 4.5).toFixed(1)}" class="tk">${h}</text>`; }
  svg += '</svg>';
  r0.dial.innerHTML = svg;

  return {
    id: 'vaqt', el: sec, z: 6, range: [14, 18], ground: 'paper', navBeat: 15, poster: [17],
    draw(b) {
      R.paper({ tex: paper, rect: [-m, -m, W + 2 * m, H + 2 * m], variant: V });
      const s = st(b);
      const bloom = seg(b, 15.35, 15.95);
      const hN = now();
      // washes first (multiplied), then the rings and hands on top
      if (D.wA && bloom > 0) { R.push(mul(tr(s.cA[0], s.cA[1]), makeT({ sx: s.sA, sy: s.sA }))); R.wash(D.wA, { bloom: bloom * 1.12 }); R.pop(); }
      if (D.wB && bloom > 0) { R.push(mul(tr(s.cB[0], s.cB[1]), makeT({ rot: s.rotB, sx: s.sB, sy: s.sB }))); R.wash(D.wB, { bloom: bloom * 1.12 }); R.pop(); }
      if (D.A) {
        R.push(mul(tr(s.cA[0], s.cA[1]), makeT({ sx: s.sA, sy: s.sA })));
        R.ink(D.A, { paper, variant: V, p: seg(b, 14.12, 14.72), wetK: 2.5, age: Math.max(0, b - 14.72) * 2 });
        R.push(makeT({ rot: ang(hN) * 180 / Math.PI })); R.ink(D.hand, { paper, variant: V, p: seg(b, 14.62, 14.78), wetK: 3, age: 1 }); R.pop();
        R.pop();
      }
      if (D.B) {
        R.push(mul(tr(s.cB[0], s.cB[1]), makeT({ rot: s.rotB, sx: s.sB, sy: s.sB })));
        R.ink(D.B, { paper, variant: V, p: seg(b, 15.05, 15.55), wetK: 2.5, age: Math.max(0, b - 15.55) * 2 });
        const ha = 1 - seg(s.join, 0.85, 1);
        if (ha > 0) { R.push(makeT({ rot: ang((hN + off) % 24) * 180 / Math.PI })); R.ink(D.hand, { paper, variant: V, p: seg(b, 15.5, 15.65), wetK: 3, age: 1, alpha: ha }); R.pop(); }
        R.pop();
      }
    },
    dom(b, root) {
      const r = refs(root, { h2: '.jk-h2', tt: '.tm-t', tk: '.tm-k', sh: '.jk-shared', sub: '.jk-sub', dial: '.jk-dial', svg: '.jk-ticks' });
      const s = st(b);
      reveal(r.h2, seg(b, 14.15, 14.5));
      reveal(r.tt, seg(b, 14.3, 14.6));
      reveal(r.tk, seg(b, 15.3, 15.6));
      reveal(r.sh, seg(b, 16.55, 16.9));
      reveal(r.sub, seg(b, 16.65, 16.97));
      if (r.svg) { setT(r.svg, `translate(${s.cA[0].toFixed(1)}px,${s.cA[1].toFixed(1)}px) scale(${s.sA.toFixed(4)})`); r.svg.style.opacity = seg(b, 14.55, 14.75).toFixed(3); }
    },
  };
}

// a watercolour annular sector with fibrous edges, a coffee-ring rim and granulation -> texture (r = coverage, g = reveal order)
function washTex(R, w, Rr, ang) {
  const a0 = ang(w.from), a1 = ang(w.to), span = a1 - a0;
  const rOut = Math.ceil(Rr * w.r1 * 1.08 + 20);
  const N = rOut * 2;
  const data = new Uint8Array(N * N * 4);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const dx = x - rOut, dy = y - rOut;
    const rho = Math.hypot(dx, dy) / Rr;
    let th = Math.atan2(dy, dx); while (th < a0 - 0.6) th += Math.PI * 2; while (th > a0 + Math.PI * 2 - 0.6) th -= Math.PI * 2;
    const u = (th - a0) / span;
    const nA = (vnoise(rho * 8, w.seed, 1) - 0.5) * 0.02 + (vnoise(rho * 30, w.seed, 2) - 0.5) * 0.004;
    const nR = (vnoise(th * 6, w.seed, 3) - 0.5) * 0.04 + (vnoise(th * 24, w.seed, 4) - 0.5) * 0.007;
    const dU = Math.min(u - nA, 1 - u - nA) * span * rho * Rr;
    const dR = Math.min(rho - w.r0 - nR, w.r1 + nR - rho) * Rr;
    const dE = Math.min(dU, dR);
    if (dE < -2) continue;
    const a = clamp((dE + 1.5) / 3);
    const rim = 0.55 * Math.exp(-Math.max(0, dE) / 5);
    const body = 0.82 + 0.18 * vnoise(x / 40, y / 40, w.seed + 11) - 0.12 * smooth(0.2, 0.9, vnoise(x / 90, y / 90, w.seed + 12));
    const gran = (hash2(x, y, w.seed) > 0.62 ? 0.08 : 0) + 0.05 * (vnoise(x / 2.2, y / 2.2, w.seed + 13) - 0.5);
    const A = clamp(w.a * a * (body + rim + gran));
    const order = clamp((rho - w.r0) / (w.r1 - w.r0) * 0.8 + vnoise(th * 5, w.seed, 9) * 0.25);
    const o = (y * N + x) * 4;
    data[o] = A * 255; data[o + 1] = order * 255; data[o + 3] = 255;
  }
  const tex = R.texFrom({ w: N, h: N, data });
  return { tex, x: -rOut, y: -rOut, w: N, h: N, col: w.col.map((c) => c / 255) };
}
