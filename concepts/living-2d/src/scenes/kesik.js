// Scene 2 (signature): 試し斬り TAMESHIGIRI — "Sekin — qalam. Tez — qilich."
// Slow: a long wet wave is brushed across the sheet. Fast: one straight rising cut (逆袈裟) slices sheet, ink and type;
// the lower half slides down along the cut plane, then the halves part and show 文武 beneath.
import { buildField } from '../fude.js';
import { clamp, seg, io2, io3, cutState, reveal, refs, place, I } from '../util.js';
import { vnoise } from '../noise.js';

export function kesik(S) {
  const { W, H, phone, R, paper } = S;
  const m = paper.m;
  const sec = document.getElementById('sinov');
  // ---------- the slow stroke: a long undulating wave
  const wv = phone ? { x0: 0.05, x1: 0.95, y: 0.5, amp: 0.028, W: 62 } : { x0: 0.065, x1: 0.94, y: 0.565, amp: 0.05, W: 124 };
  let fWave = null;
  S.tasks.add('sinov.wave', () => {
    const pts = []; const n = 420;
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      const x = (wv.x0 + (wv.x1 - wv.x0) * u) * W;
      const y = (wv.y + wv.amp * Math.sin(u * Math.PI * 2.3 + 0.6) * (0.55 + 0.45 * Math.sin(u * Math.PI)) + 0.012 * (vnoise(u * 5, 3, 7) - 0.5)) * H;
      pts.push([x, y]);
    }
    const st = [{ pts, kind: 'harai', W: wv.W, press: 0.32, entry: 0.05, haraiFrom: 0.83, haraiDry: 1.25, dryStart: 0.62, dry: 0.9, tip: 36 }];
    fWave = R.fieldTex(buildField(st, { W: wv.W, seed: 44, fibre: { data: paper.fibre, w: paper.w, h: paper.h, ox: -m, oy: -m }, bleed: 0.26 }));
  }, 2);

  // ---------- the cut (rising, from bottom left to top right)
  const P0 = phone ? [0.02 * W, 0.9 * H] : [0.07 * W, 1.06 * H];
  const P1 = phone ? [0.98 * W, 0.1 * H] : [0.65 * W, -0.06 * H];
  const cut = {
    from: 2.04, glintEnd: 2.2, sepStart: 3.06, to: 3.96, line: [P0, P1], dist: phone ? W * 1.15 : W * 0.66, rot: 1.4, ease: io3,
    slideA: (b) => -(phone ? 26 : 46) * io2(seg(b, 2.16, 2.64)), slideB: (b) => (phone ? 6 : 10) * io2(seg(b, 2.16, 2.64)),
    twistA: (b) => 1.1 * io2(seg(b, 2.16, 2.64)),
  };

  // ---------- type
  const fs = phone ? 58 : Math.min(128, W * 0.089);
  const r0 = refs(sec, { l1: '.l1', l2: '.l2', sp: '.kz-spine' });
  r0.l1.style.fontSize = r0.l2.style.fontSize = fs + 'px';
  if (phone) { r0.l1.style.whiteSpace = r0.l2.style.whiteSpace = 'normal'; r0.l1.style.width = r0.l2.style.width = '220px'; r0.l2.style.textAlign = 'right'; }
  place(r0.l1, phone ? 22 : 104, phone ? 0.11 * H : 0.3 * H - fs * 0.86);
  r0.l2.style.left = 'auto'; r0.l2.style.right = (phone ? 22 : 104) + 'px'; r0.l2.style.top = (phone ? 0.72 * H : 0.86 * H - fs * 0.86) + 'px';
  if (phone) r0.sp.style.display = 'none';
  else { r0.sp.style.right = '58px'; r0.sp.style.top = 0.2 * H + 'px'; }

  return {
    id: 'sinov', el: sec, z: 9, range: [1, 4], ground: 'paper', navBeat: 2, poster: [3],
    draw(b) {
      R.paper({ tex: paper, rect: [-m, -m, W + 2 * m, H + 2 * m], variant: 1 });
      if (fWave) R.ink(fWave, { paper, variant: 1, p: seg(b, 1.2, 1.95), wetK: 1.6, age: Math.max(0, b - 1.95) * 1.2 });
    },
    dom(b, root) {
      const r = refs(root, { l1: '.l1', l2: '.l2', sp: '.kz-spine' });
      reveal(r.l1, seg(b, 1.45, 1.85));
      reveal(r.l2, seg(b, 2.3, 2.72));
      reveal(r.sp, seg(b, 1.6, 1.95), 'y');
    },
    exit: {
      from: 2.04, to: 4.0,
      state: (b) => cutState(b, cut, W, H),
      label: { ja: '逆袈裟', rom: 'GYAKU-KESA', from: 2.02, to: 2.7, at: () => (phone ? [W - 40, 0.16 * H] : [P1[0] + 0.115 * H * 0.52 + 26, 0.1 * H]) },
    },
  };
}
