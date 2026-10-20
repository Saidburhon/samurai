// Scene 4: 道 YOʻLIMIZ — an emaki handscroll on the ikat table, read right to left (desktop),
// or a kakejiku hanging scroll read top to bottom (phone). Five panels, each with its brushed column.
import { kanjiStrokes, buildField } from '../fude.js';
import { clamp, seg, io2, io3, out3, lerp, reveal, refs, place, setT, tr, I } from '../util.js';
import { edgeAt } from '../gl.js';

const PANELS = [
  { ja: '改善' }, { ja: 'ものづくり' }, { ja: '職人' }, { ja: '報連相' }, { ja: 'おもてなし' },
];

export function yol(S) {
  const { W, H, phone, R, paper, kvg } = S;
  const m = paper.m;
  const sec = document.getElementById('yol');
  const vert = phone; // kakejiku on phones
  // ---------- geometry
  const G = vert
    ? { a0: 0.075 * W, a1: 0.925 * W, PW: Math.round(0.64 * H), band: 14, rMax: 30, rMin: 13, edge0: 0.115 * H, edge1: 0.93 * H }
    : { a0: 0.17 * H, a1: 0.83 * H, PW: 820, band: 20, rMax: 44, rMin: 18, edge0: 58, edge1: W - 58 };
  // a0..a1: the scroll's extent across its axis; edge0/1: where the rollers sit when open (along the axis)
  const C = vert ? H / 2 : W / 2; // reading centre along the axis
  const tableCloth = { rect: [-m, -m, W + 2 * m, H + 2 * m], contrast: 0.42, scale: 1.0, seed: 2.3, time: 3, shade: [W * 0.45, H * 0.5, W * 0.8, 0.2] };
  const bandCloth = { contrast: 0.85, scale: 0.34, seed: 5.1, time: 1, shade: [W * 0.5, H * 0.5, W, 0.3] };
  S.clothUnder = () => R.cloth({ ...tableCloth });
  S.tableCloth = tableCloth;

  // ---------- calligraphy per panel (panel-local: x relative to the panel centre for desktop, y for phone)
  const fields = PANELS.map(() => null);
  const span = vert ? (G.a1 - G.a0) : (G.a1 - G.a0) - 2 * G.band; // across-axis room
  PANELS.forEach((pn, k) => {
    S.tasks.add('yol.p' + k, () => {
      const chars = [...pn.ja];
      const n = chars.length;
      let strokes = [];
      if (!vert) {
        const room = span - 70;
        const size = Math.min(n <= 2 ? 205 : n === 3 ? 158 : 102, room / n);
        const colX = G.PW / 2 - 128;
        const total = size * n * 0.96;
        let y = G.a0 + G.band + (span - total) / 2;
        for (const ch of chars) { strokes = strokes.concat(kanjiStrokes(kvg[ch], { x: colX - size / 2, y: y - size * 0.02, size }, {})); y += size * 0.96; }
        const bw = Math.max(6, (n <= 2 ? 0.105 : 0.12) * size);
        fields[k] = { f: R.fieldTex(buildField(strokes, { W: bw, seed: 30 + k * 7, dry: 1.0, dryStart: 0.5, bleed: 0.18, air: 0.12 })), size };
      } else {
        const room = G.PW - 70;
        const size = Math.min(n <= 2 ? 120 : n === 3 ? 104 : 84, room / n);
        const colX = G.a1 - 26 - size / 2;
        const total = size * n * 0.96;
        let y = -total / 2;
        for (const ch of chars) { strokes = strokes.concat(kanjiStrokes(kvg[ch], { x: colX - size / 2, y, size }, {})); y += size * 0.96; }
        const bw = Math.max(4, (n <= 2 ? 0.105 : 0.12) * size);
        fields[k] = { f: R.fieldTex(buildField(strokes, { W: bw, seed: 30 + k * 7, dry: 1.0, dryStart: 0.5, bleed: 0.18, air: 0.12 })), size };
      }
    }, 4 + k);
  });

  // ---------- state along the beats
  // b6.3-7: the closed roll rolls in; 7-8 it opens; 8..12 one panel per beat; 12-12.8 it rolls up and leaves
  const closedAt = vert ? 0.5 * H : 0.6 * W;
  function st(b) {
    const s = { open: 0, pos: closedAt, off: 0, rL: G.rMax + 4, rR: 0, gone: 0, cord: 0, centre: closedAt };
    const rollIn = io3(seg(b, 6.3, 6.95));
    s.pos = lerp(vert ? H + 120 : W + 120, closedAt, rollIn);
    s.cord = 1 - seg(b, 7.05, 7.3);
    s.open = io2(seg(b, 7.25, 7.95));
    const read = clamp(b - 8, 0, 4) / 4; // 0..1 across panels
    s.off = clamp(b - 8, 0, 4) * G.PW; // content offset along the axis
    s.rL = lerp(G.rMax, G.rMin, read); s.rR = lerp(G.rMin, G.rMax, read);
    const close = io2(seg(b, 12.05, 12.5));
    s.close = close;
    s.gone = io3(seg(b, 12.45, 12.82));
    // roller centres along the axis
    const cIn = lerp(closedAt, C, s.open); // the centre the window opens around
    const half = lerp(0, (G.edge1 - G.edge0) / 2, s.open) * (1 - close);
    s.centre = lerp(cIn, C, close);
    s.xL = s.centre - half - (s.open > 0 ? s.rL * s.open : 0) * (1 - close);
    s.xR = s.centre + half + (s.open > 0 ? s.rR * s.open : 0) * (1 - close);
    if (s.open <= 0) { s.xL = s.xR = s.pos; }
    return s;
  }

  // draw helpers (axis-aware: u = along the axis, v = across)
  const rectUV = (u0, u1, v0, v1) => (vert ? [v0, u0, v1 - v0, u1 - u0] : [u0, v0, u1 - u0, v1 - v0]);
  function roller(u, r, slideV = 0) {
    if (r <= 0.5) return;
    const v0 = G.a0 - 6 + slideV, v1 = G.a1 + 6 + slideV;
    // the rolled paper with its mounting
    R.paper({ tex: paper, rect: rectUV(u - r, u + r, v0 + 8, v1 - 8), tint: [1.03, 1.02, 1.0], cyl: [vert ? 1 : 0, u, r, 1] });
    for (const vv of [[v0 + 8, v0 + 8 + G.band], [v1 - 8 - G.band, v1 - 8]]) R.paper({ tex: paper, rect: rectUV(u - r, u + r, vv[0], vv[1]), tint: [0.2, 0.26, 0.5], cyl: [vert ? 1 : 0, u, r, 1] });
    // lacquered rod ends (jiku)
    const k = Math.max(7, r * 0.42);
    for (const vv of [[v0 - 14, v0 + 8], [v1 - 8, v1 + 14]]) R.paper({ tex: paper, rect: rectUV(u - k, u + k, vv[0], vv[1]), tint: [0.11, 0.09, 0.085], cyl: [vert ? 1 : 0, u, k, 1] });
  }
  function shadowRect(rc, a = 0.3, blur = 18) {
    R.push(tr(8, 14), [edgeAt(1, 0, rc[0], 0), edgeAt(-1, 0, rc[0] + rc[2], 0), edgeAt(0, 1, 0, rc[1]), edgeAt(0, -1, 0, rc[1] + rc[3])]);
    R.shadow({ rect: [rc[0] - 60, rc[1] - 60, rc[2] + 120, rc[3] + 120], alpha: a, blur });
    R.pop();
  }

  // ---------- DOM
  const r0 = refs(sec, { h2: '.yl-h2', ds: '.daisen', pn: '.pn*' });
  const PN = r0.pn.map((li) => ({ k: li.querySelector('.pn-k'), r: li.querySelector('.pn-r'), t: li.querySelector('.pn-t') }));
  // panel-local placement of the type
  PN.forEach((p) => {
    if (!vert) {
      place(p.r, -G.PW / 2 + 92, G.a0 + G.band + 0.2 * span);
      place(p.t, -G.PW / 2 + 96, G.a0 + G.band + 0.2 * span + 96);
      place(p.k, G.PW / 2 - 128 - 8, G.a0 + 2);
    } else {
      place(p.r, G.a0 + 22, -G.PW / 2 + 70);
      place(p.t, G.a0 + 24, -G.PW / 2 + 128);
      p.k.style.display = 'none';
    }
  });

  const sc = {
    id: 'yol', el: sec, z: 7, range: [4.3, 13], ground: 'cloth', navBeat: 7, poster: [7, 8, 9, 10, 11, 12],
    draw(b) {
      // the table: under 文武 only its holes need the cloth
      if (b < 6.0 && S.kirieRect) R.cloth({ ...tableCloth, rect: S.kirieRect, sheen: [S.pointer[0], S.pointer[1], 0.12] });
      else if (b <= 13) R.cloth({ ...tableCloth, sheen: [S.pointer[0], S.pointer[1], 0.12] });
      if (b < 6.3) return;
      const s = st(b);
      if (s.gone >= 1) return;
      const slideV = s.gone * (vert ? W : H) * 0.9; // the closed roll leaves downwards (desktop) / rightwards (phone)
      R.push(vert ? tr(slideV, 0) : tr(0, slideV));
      if (s.open <= 0 || s.close >= 1) {
        // closed roll (with the cord and the title slip)
        const r = G.rMax + 4, u = s.open <= 0 ? s.pos : s.centre;
        shadowRect(rectUV(u - r, u + r, G.a0 - 10, G.a1 + 10), 0.32, 20);
        roller(u, r);
        if (s.cord > 0 && s.close <= 0) {
          const vm = (G.a0 + G.a1) / 2;
          for (const d of [-9, 6]) R.paper({ tex: paper, rect: rectUV(u - r - 2, u + r + 2, vm + d, vm + d + 3.5), tint: [0.13, 0.17, 0.42], alpha: s.cord, cyl: [vert ? 1 : 0, u, r + 2, 1] });
        }
        R.pop(); return;
      }
      // open: paper between the rollers, the content travelling with it
      const u0 = s.xL + (s.open > 0 ? s.rL : 0), u1 = s.xR - (s.open > 0 ? s.rR : 0);
      shadowRect(rectUV(u0, u1, G.a0, G.a1), 0.3, 22);
      const win = vert ? [edgeAt(0, 1, 0, u0), edgeAt(0, -1, 0, u1)] : [edgeAt(1, 0, u0, 0), edgeAt(-1, 0, u1, 0)];
      R.push(I, win);
      const shift = vert ? -s.off : s.off; // content moves right (emaki) or up (kakejiku)
      R.push(vert ? tr(0, C + shift) : tr(C + shift, 0));
      // paper + mounting bands, in content space
      const big = 6 * G.PW;
      if (!vert) {
        R.paper({ tex: paper, rect: [-big, G.a0, 2 * big, G.a1 - G.a0], tint: [1.025, 1.018, 1.005] });
        R.cloth({ ...bandCloth, rect: [-big, G.a0, 2 * big, G.band] }); R.cloth({ ...bandCloth, rect: [-big, G.a1 - G.band, 2 * big, G.band] });
      } else {
        R.paper({ tex: paper, rect: [G.a0, -big, G.a1 - G.a0, 2 * big], tint: [1.025, 1.018, 1.005] });
      }
      // paper joints between panels
      for (let k = -1; k <= 5; k++) {
        const c = vert ? k * G.PW + G.PW / 2 : -k * G.PW - G.PW / 2;
        R.paper({ tex: paper, rect: vert ? [G.a0, c - 1, G.a1 - G.a0, 1.6] : [c - 0.8, G.a0 + G.band, 1.6, G.a1 - G.a0 - 2 * G.band], tint: [0.9, 0.88, 0.84], alpha: 0.6 });
      }
      for (let k = 0; k < 5; k++) {
        const fk = fields[k]; if (!fk) continue;
        const pc = vert ? k * G.PW : -k * G.PW; // panel centre in content space
        const scr = pc + C + shift; // on screen
        let p;
        if (k === 0) p = seg(b, 7.35, 7.95);
        else { const entry = C - (vert ? -G.PW : G.PW) * 0.98; p = vert ? clamp((entry - scr) / (entry - C)) : clamp((scr - entry) / (C - entry)); }
        if (p <= 0) continue;
        R.ink(fk.f, { paper, p, wetK: 3, age: 0.4, dx: vert ? 0 : pc, dy: vert ? pc : 0 });
      }
      R.pop(); R.pop();
      roller(s.xL, s.open > 0 ? s.rL : 0); roller(s.xR, s.open > 0 ? s.rR : 0);
      R.pop();
    },
    dom(b, root) {
      const r = refs(root, { h2: '.yl-h2', ds: '.daisen', pn: '.pn*' });
      const s = st(b);
      // the heading: big beside the closed roll, then small above the scroll (desktop) / gone (phone)
      const hIn = seg(b, 6.55, 6.95), hSmall = io2(seg(b, 7.25, 7.9)), hOut = seg(b, 12.0, 12.3);
      if (!vert) {
        const x = 104, y = lerp(0.5 * H - 96, 70, hSmall), k = lerp(1, 0.46, hSmall);
        setT(r.h2, `translate(${x}px,${y.toFixed(1)}px) scale(${k.toFixed(4)})`);
      } else {
        setT(r.h2, `translate(22px,${(0.2 * H).toFixed(1)}px)`);
      }
      reveal(r.h2, hIn); r.h2.style.opacity = (vert ? 1 - seg(b, 7.1, 7.4) : 1 - hOut).toFixed(3);
      const sub = root.querySelector('.yl-sub');
      if (sub) { setT(sub, vert ? `translate(24px,${(0.2 * H + 82).toFixed(1)}px)` : `translate(108px,${(0.5 * H + 16).toFixed(1)}px)`); reveal(sub, seg(b, 6.7, 6.98)); sub.style.opacity = b < 6.3 ? '0' : (1 - seg(b, 7.1, 7.35)).toFixed(3); }
      if (b < 6.3) r.h2.style.opacity = '0';
      // the title slip rides on the closed roll
      const closed = s.open <= 0 && b >= 6.3;
      if (closed) {
        const u = s.pos;
        if (!vert) setT(r.ds, `translate(${(u - 17).toFixed(1)}px,${(G.a0 + 70).toFixed(1)}px)`);
        else setT(r.ds, `translate(${(W * 0.5 + 60).toFixed(1)}px,${(u - 46).toFixed(1)}px)`);
        r.ds.style.opacity = '1';
      } else r.ds.style.opacity = '0';
      // panel type travels with its panel, clipped by the window, and fades towards the rollers
      const u0 = s.xL + (s.open > 0 ? s.rL : 0), u1 = s.xR - (s.open > 0 ? s.rR : 0);
      const shift = vert ? -s.off : s.off;
      r.pn.forEach((li, k) => {
        const pc = vert ? k * G.PW : -k * G.PW;
        const scr = pc + C + shift;
        const dist = Math.abs(scr - C) / G.PW;
        let a = (1 - seg(dist, 0.32, 0.62)) * (s.open > 0 && s.close < 1 ? 1 : 0);
        if (k === 0) a *= seg(b, 7.6, 7.95);
        a *= 1 - seg(b, 12.0, 12.2);
        if (a <= 0.001) { li.style.visibility = 'hidden'; return; }
        li.style.visibility = '';
        li.style.opacity = a.toFixed(3);
        setT(li, vert ? `translate(0px,${scr.toFixed(1)}px)` : `translate(${scr.toFixed(1)}px,0px)`);
        // clip to the window (in the li's local coordinates)
        const clip = vert ? `inset(${(u0 - scr).toFixed(1)}px -2000px ${(scr - u1).toFixed(1)}px -2000px)` : `inset(-2000px ${(scr - u1).toFixed(1)}px -2000px ${(u0 - scr).toFixed(1)}px)`;
        if (vert) li.style.clipPath = `polygon(-2000px ${(u0 - scr).toFixed(1)}px, 4000px ${(u0 - scr).toFixed(1)}px, 4000px ${(u1 - scr).toFixed(1)}px, -2000px ${(u1 - scr).toFixed(1)}px)`;
        else li.style.clipPath = `polygon(${(u0 - scr).toFixed(1)}px -2000px, ${(u1 - scr).toFixed(1)}px -2000px, ${(u1 - scr).toFixed(1)}px 4000px, ${(u0 - scr).toFixed(1)}px 4000px)`;
        void clip;
      });
    },
    groundAt: () => 'cloth',
    posterDom(list) { // reduced motion: the closed roll, then each panel centred on its own poster
      const r = refs(sec, { pn: '.pn*' });
      r.pn.forEach((li, k) => {
        li.style.visibility = ''; li.style.opacity = '1'; li.style.clipPath = 'none';
        setT(li, vert ? `translate(0px,${((k + 1) * H + C).toFixed(1)}px)` : `translate(${C}px,${(k + 1) * H}px)`);
      });
    },
  };
  return sc;
}
