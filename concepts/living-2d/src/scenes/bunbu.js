// Scene 3: 文武 QALAM VA QILICH — 文 is brushed in stroke order; 武 is cut out of the sheet like kirie,
// piece by piece, and the indigo of the next sheet shows through. Then 袈裟 (kesa) cuts the sheet diagonally.
import { kanjiStrokes, buildField, samplePath } from '../fude.js';
import { clamp, seg, io2, io3, cutState, reveal, refs, place, mul, tr, makeT, lerp } from '../util.js';
import { mulberry } from '../noise.js';

export function bunbu(S) {
  const { W, H, phone, R, paper, kvg, glyphs } = S;
  const m = paper.m;
  const V = 2; // paper variant
  const sec = document.getElementById('qalam');
  const inkH = phone ? 0.25 * H : 0.56 * H;
  const bun = phone ? { x: 0.5 * W - inkH * 0.5, y: 0.17 * H } : { x: 0.085 * W, y: 0.185 * H };
  const bu = phone ? { x: 0.5 * W - inkH * 0.5, y: 0.53 * H } : { x: 0.555 * W, y: 0.185 * H };
  const fib = { data: paper.fibre, w: paper.w, h: paper.h, ox: -m, oy: -m };
  const K = { cut0: 4.3, cut1: 5.4, fall: 1.5, g: 2800 };
  const cutB = (i, n) => K.cut0 + (K.cut1 - K.cut0) * (i / (n - 1));

  let fBun = null, kirie = null, under = null;
  S.tasks.add('qalam.bun', () => {
    const size = (inkH / 81) * 109;
    const box = { x: bun.x - 16.88 * size / 109, y: bun.y - 12.75 * size / 109, size };
    const bw = size * 0.112;
    const st = kanjiStrokes(kvg['文'], box, {
      kinds: ['ten', 'tome', 'harai', 'nharai'],
      per: [{ W: bw * 1.15 }, { W: bw * 0.95, waist: 0.14 }, { W: bw * 1.1, haraiFrom: 0.45, haraiDry: 1.6 }, { W: bw * 1.05, haraiFrom: 0.78, haraiDry: 1.2 }],
    });
    fBun = R.fieldTex(buildField(st, { W: bw, seed: 9, fibre: fib, dry: 0.9, dryStart: 0.5, bleed: 0.22 }));
  }, 3);
  S.tasks.add('qalam.bu', () => { kirie = buildKirie(); }, 3);

  // 武: the Shippori Mincho B1 outline split into one paper piece per KanjiVG stroke (8 pieces in 2 RGBA masks)
  function buildKirie() {
    const g = glyphs['武'];
    const [gx0, gy0, gx1, gy1] = g.bbox;
    const gs = inkH / (gy1 - gy0);
    const gW = (gx1 - gx0) * gs, gH = (gy1 - gy0) * gs;
    const bx0 = Math.floor(bu.x - 6), by0 = Math.floor(bu.y - 6), pw = Math.ceil(gW + 12), ph = Math.ceil(gH + 12);
    const c = document.createElement('canvas'); c.width = pw; c.height = ph;
    const x = c.getContext('2d', { willReadFrequently: true });
    x.setTransform(gs, 0, 0, gs, bu.x - bx0 - gx0 * gs, bu.y - by0 - gy0 * gs);
    const path = new Path2D(g.contours.join(' '));
    x.fillStyle = '#000'; x.fill(path);
    const alpha = x.getImageData(0, 0, pw, ph).data;
    // the craftsman's dashed under-drawing of the outline
    const u = document.createElement('canvas'); u.width = pw; u.height = ph;
    const ux = u.getContext('2d'); ux.setTransform(gs, 0, 0, gs, bu.x - bx0 - gx0 * gs, bu.y - by0 - gy0 * gs);
    ux.strokeStyle = 'rgba(94,85,75,0.5)'; ux.lineWidth = 0.85 / gs; ux.setLineDash([5 / gs, 3.5 / gs]); ux.stroke(path);
    under = { tex: R.texFrom(u, { premul: true }), rect: [bx0, by0, pw, ph] };
    const kv = kvg['武'];
    const kx0 = 14.75, ky0 = 13.75, kx1 = 94.5, ky1 = 93.3;
    const strokes = kv.strokes.map((s) => samplePath(s.d, 2.2).map(([sx, sy]) => [bu.x - bx0 + (sx - kx0) / (kx1 - kx0) * gW, bu.y - by0 + (sy - ky0) / (ky1 - ky0) * gH]));
    const NP = strokes.length;
    const A = [new Uint8ClampedArray(pw * ph * 4), new Uint8ClampedArray(pw * ph * 4)];
    const cent = Array.from({ length: NP }, () => [0, 0, 0]);
    for (let y = 0; y < ph; y++) for (let xx = 0; xx < pw; xx++) {
      const a = alpha[(y * pw + xx) * 4 + 3] / 255; if (a <= 0) continue;
      let d1 = 1e9, d2 = 1e9, i1 = 0, i2 = 0;
      for (let k = 0; k < NP; k++) {
        let dm = 1e9; const P = strokes[k];
        for (let j = 0; j < P.length; j++) { const dx = P[j][0] - xx, dy = P[j][1] - y; const dd = dx * dx + dy * dy; if (dd < dm) dm = dd; }
        if (dm < d1) { d2 = d1; i2 = i1; d1 = dm; i1 = k; } else if (dm < d2) { d2 = dm; i2 = k; }
      }
      d1 = Math.sqrt(d1); d2 = Math.sqrt(d2);
      const w1 = clamp(0.5 + (d2 - d1) * 0.5);
      const id = (y * pw + xx) * 4;
      A[i1 >> 2][id + (i1 & 3)] += Math.round(255 * a * w1); A[i2 >> 2][id + (i2 & 3)] += Math.round(255 * a * (1 - w1));
      cent[i1][0] += xx * a * w1; cent[i1][1] += y * a * w1; cent[i1][2] += a * w1;
    }
    cent.forEach((c2) => { c2[0] = bx0 + c2[0] / (c2[2] || 1); c2[1] = by0 + c2[1] / (c2[2] || 1); });
    const rnd = mulberry(77);
    const phys = strokes.map(() => ({ drift: (rnd() - 0.5) * 160, w: (0.8 + rnd() * 0.8) * (rnd() < 0.5 ? -1 : 1), fl: 2.5 + rnd() * 1.5, f0: rnd() * 0.6 }));
    S.kirieRect = [bx0, by0, pw, ph];
    return { m0: R.texFrom({ w: pw, h: ph, data: new Uint8Array(A[0].buffer) }, { mip: true }), m1: R.texFrom({ w: pw, h: ph, data: new Uint8Array(A[1].buffer) }, { mip: true }), x: bx0, y: by0, w: pw, h: ph, NP, cent, phys };
  }
  const chOf = (i) => { const v = [0, 0, 0, 0]; v[i & 3] = 1; return v; };

  // ---------- type
  const r0 = refs(sec, { h2: '.bb-h2', p1: '.p1', p2: '.p2', cap: '.bb-cap', sp: '.bb-spine' });
  if (phone) {
    place(r0.h2, 22, 70);
    place(r0.p1, 22, bun.y + inkH + 12); r0.p1.style.width = (W - 44) + 'px'; r0.p1.style.textAlign = 'center';
    place(r0.p2, 22, bu.y + inkH + 12); r0.p2.style.width = (W - 44) + 'px'; r0.p2.style.textAlign = 'center';
    place(r0.cap, 16, H - 70); r0.cap.style.textAlign = 'center'; r0.cap.style.width = (W - 32) + 'px';
    r0.sp.style.display = 'none';
  } else {
    place(r0.h2, 104, 86);
    place(r0.p1, bun.x + 6, bun.y + inkH + 34);
    place(r0.p2, bu.x + 6, bu.y + inkH + 34);
    r0.cap.style.left = '0'; r0.cap.style.width = W + 'px'; r0.cap.style.textAlign = 'center'; r0.cap.style.top = (H - 64) + 'px';
    r0.sp.style.right = '40px'; r0.sp.style.top = (H / 2 - 90) + 'px';
  }

  const kesa = phone
    ? { from: 6.04, glintEnd: 6.2, sepStart: 6.12, to: 6.96, line: [[0.96 * W, -0.04 * H], [0.04 * W, 1.04 * H]], dist: W * 1.25, rot: 1.6, ease: io2 }
    : { from: 6.04, glintEnd: 6.2, sepStart: 6.12, to: 6.96, line: [[0.78 * W, -0.05 * H], [0.18 * W, 1.05 * H]], dist: W * 0.64, rot: 1.5, ease: io2 };

  return {
    id: 'qalam', el: sec, z: 8, range: [3, 7], ground: 'paper', navBeat: 4, poster: [6],
    draw(b) {
      if (S.posterMode) S.clothUnder && S.clothUnder();
      // which kirie pieces are out
      let hole = null;
      if (kirie) {
        const c0 = [0, 0, 0, 0], c1 = [0, 0, 0, 0];
        for (let i = 0; i < kirie.NP; i++) if (b >= cutB(i, kirie.NP)) (i < 4 ? c0 : c1)[i & 3] = 1;
        hole = { m0: kirie.m0, m1: kirie.m1, x: kirie.x, y: kirie.y, w: kirie.w, h: kirie.h, c0, c1 };
      }
      R.paper({ tex: paper, rect: [-m, -m, W + 2 * m, H + 2 * m], variant: V, hole });
      if (under) { const a = 1 - seg(b, 4.5, 5.2); if (a > 0) R.sprite(under.tex, { rect: under.rect, mode: 1, alpha: a * seg(b, 3.05, 3.4) }); }
      if (fBun) {
        const s2 = fBun.starts[2] ?? 0.5;
        const p = b < 4.0 ? s2 * seg(b, 3.12, 3.92) : lerp(s2, 1, seg(b, 4.0, 4.5));
        R.ink(fBun, { paper, variant: V, p, wetK: 2.2, age: Math.max(0, b - 4.5) * 4 });
      }
      if (!kirie) return;
      // steel light tracing the next contour, just before it is cut
      for (let i = 0; i < kirie.NP; i++) {
        const t1 = cutB(i, kirie.NP), t0 = t1 - 0.13;
        if (b >= t0 && b < t1 + 0.03) {
          const gp = seg(b, t0, t1);
          const mk = i < 4 ? kirie.m0 : kirie.m1;
          R.ring({ mask: mk, rect: [kirie.x, kirie.y, kirie.w, kirie.h], ch: chOf(i), c: kirie.cent[i], a0: -Math.PI / 2, sweep: gp * Math.PI * 2 + 0.01, intensity: 1 - seg(b, t1, t1 + 0.03) });
        }
      }
      // falling paper glyph fragments (front, then the darker back as they flip)
      for (let i = 0; i < kirie.NP; i++) {
        const t1 = cutB(i, kirie.NP);
        if (b < t1) continue;
        const tau = (b - t1) * K.fall;
        const y = 0.5 * K.g * Math.max(0, tau - 0.06) ** 2 - Math.min(1, tau / 0.08) * 3;
        const c = kirie.cent[i];
        if (c[1] + y - 260 > H) continue;
        const ph = kirie.phys[i];
        const flipv = Math.cos(ph.f0 + ph.fl * tau);
        const sx = Math.abs(flipv) < 0.08 ? 0.08 : Math.abs(flipv);
        const M = mul(tr(c[0] + ph.drift * tau, c[1] + y), mul(makeT({ rot: ph.w * tau * 52 }), mul([sx * (flipv < 0 ? -1 : 1), 0, 0, 1, 0, 0], tr(-c[0], -c[1]))));
        const lift = Math.min(1, tau / 0.15);
        const mk = i < 4 ? kirie.m0 : kirie.m1;
        const rect = [kirie.x, kirie.y, kirie.w, kirie.h];
        R.push(mul(tr(6 + 10 * lift, 10 + 18 * lift), M)); R.frag({ paper, variant: V, mask: mk, rect, ch: chOf(i), shadow: true, alpha: 0.2 + 0.12 * lift, lod: 2 + 1.5 * lift }); R.pop();
        R.push(M); R.frag({ paper, variant: V, mask: mk, rect, ch: chOf(i), back: flipv < 0 ? 1 : 0 }); R.pop();
      }
    },
    dom(b, root) {
      const r = refs(root, { h2: '.bb-h2', p1: '.p1', p2: '.p2', cap: '.bb-cap', sp: '.bb-spine' });
      reveal(r.h2, seg(b, 3.2, 3.6));
      reveal(r.p1, seg(b, 4.45, 4.78));
      reveal(r.p2, seg(b, 5.45, 5.8));
      reveal(r.cap, seg(b, 5.65, 5.97));
      reveal(r.sp, seg(b, 3.3, 3.7), 'y');
    },
    exit: {
      from: 6.04, to: 7.0, freeze: 6,
      state: (b) => cutState(b, kesa, W, H),
      label: { ja: '袈裟', rom: 'KESA', cloth: true, from: 6.06, to: 6.6, at: () => (phone ? [0.04 * W + 16, H - 230] : [0.18 * W - 64, H - 250]) },
    },
  };
}
