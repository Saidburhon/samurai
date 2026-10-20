// Scene 5: 技 NIMALAR QURAMIZ — the seven services hang as tanzaku paper strips from an ink string on the ikat.
// They drop in, unroll, sway with the scroll (a damped pendulum per strip), and are cut away by 切り上げ.
import { bakeWashi } from '../washi.js';
import { clamp, seg, io2, io3, out3, lerp, cutState, reveal, refs, place, setT, setClip, mul, tr, makeT } from '../util.js';
import { edgeAt } from '../gl.js';
import { vnoise, mulberry } from '../noise.js';

const PAPERS = [
  { c: '#EEE6D4', ink: 'sumi' }, { c: '#CF4A30', ink: 'kinu' }, { c: '#F0E9D9', ink: 'sumi' }, { c: '#C9D6E3', ink: 'sumi' },
  { c: '#ECE3CF', ink: 'sumi' }, { c: '#1D1915', ink: 'kinu' }, { c: '#E2D6BE', ink: 'sumi' },
];
const shade = (hex, k) => '#' + [1, 3, 5].map((i) => Math.round(Math.max(0, Math.min(255, parseInt(hex.slice(i, i + 2), 16) * k))).toString(16).padStart(2, '0')).join('');

export function tanzaku(S) {
  const { W, H, phone, R } = S;
  const sec = document.getElementById('xizmatlar');
  const k = H / 900;
  const G = phone
    ? { sw: 40, pitch: 53, x0: 16, yS: Math.round(0.1 * H), lens: [350, 380, 410, 440, 478, 512, 548].map((v) => v * (H / 844)) }
    : { sw: 120, pitch: 158, x0: 104, yS: Math.round(0.14 * H), lens: [404, 432, 462, 512, 566, 612, 650].map((v) => v * k) };
  const sagY = (x) => G.yS + 10 * Math.sin(Math.PI * x / W) + 4;
  const strips = PAPERS.map((p, i) => {
    const cx = G.x0 + i * G.pitch + G.sw / 2;
    return { ...p, i, cx, top: sagY(cx) + (phone ? 16 : 24), L: G.lens[i], tex: null, rest: (Math.sin(1.7 + i * 0.85) * 1.2 + (mulberry(5 + i)() - 0.5) * 0.7) * (phone ? 0.6 : 1) };
  });
  strips.forEach((s, i) => S.tasks.add('xizmatlar.s' + i, () => {
    const dark = s.c === '#1D1915';
    const w = Math.ceil(G.sw + 8), h = Math.ceil(s.L + 16);
    const t = bakeWashi(w, h, { seed: 40 + i * 3, color: s.c, deep: shade(s.c, 0.93), lite: shade(s.c, dark ? 1.35 : 1.04), scale: phone ? 0.6 : 0.8, chiri: dark ? 0 : 0.7, clouds: dark ? 1.6 : 0.9, fibres: dark ? 900 : 1500, fibreK: dark ? 0.16 : 0.85 });
    const rgba = new Uint8Array(w * h * 4); for (let j = 0; j < w * h; j++) { rgba[j * 4] = t.data[j * 4]; rgba[j * 4 + 1] = t.data[j * 4 + 1]; rgba[j * 4 + 2] = t.data[j * 4 + 2]; rgba[j * 4 + 3] = 255; }
    const tex = R.texFrom({ w, h, data: rgba });
    s.tex = { tex, xf: () => [1 / w, 1 / h, (G.sw / 2 + 4) / w, 8 / h] };
  }, 9));

  // ---------- pendulums (wind from the scroll velocity)
  const ang = strips.map(() => 0), vel = strips.map(() => 0);
  let lastB = null, lastT = 0, live = false;
  S.anim = ((prev) => (T) => {
    const p = prev ? prev(T) : false;
    return p || live;
  })(S.anim);
  function step(b, T) {
    const dt = Math.min(0.05, Math.max(0, T - lastT)); lastT = T;
    const db = lastB == null ? 0 : b - lastB; lastB = b;
    const inScene = b > 12.4 && b < 14.6;
    let e = 0;
    for (let i = 0; i < strips.length; i++) {
      if (inScene && dt > 0) vel[i] += (db / Math.max(dt, 0.016)) * (phone ? 5 : 9) * dt * (0.8 + 0.4 * Math.sin(i * 1.7)) * (1 + i * 0.05);
      const w0 = 2.4, z = 0.09;
      const acc = -w0 * w0 * ang[i] - 2 * z * w0 * vel[i];
      vel[i] += acc * dt; ang[i] += vel[i] * dt;
      ang[i] = clamp(ang[i], -14, 14);
      e = Math.max(e, Math.abs(ang[i]) + Math.abs(vel[i]) * 0.3);
    }
    live = inScene && e > 0.04;
  }

  // unroll state of each strip
  const drop = (b) => io3(seg(b, 12.5, 12.95));
  const unroll = (b, i) => (i < 3 ? out3(seg(b, 12.7 + i * 0.07, 13.0)) : io2(seg(b, 13.08 + (i - 3) * 0.14, 13.6 + (i - 3) * 0.1)));
  const stub = phone ? 22 : 34;
  const vis = (b, s) => lerp(stub, s.L, unroll(b, s.i));
  const angOf = (b, s) => s.rest + ang[s.i];

  // ---------- DOM: strips, string svg
  const r0 = refs(sec, { h2: '.tz-h2', li: '.strip*', sp: '.tz-spine' });
  r0.li.forEach((li, i) => {
    const s = strips[i];
    li.classList.add(s.ink);
    place(li, s.cx - G.sw / 2, s.top); li.style.width = G.sw + 'px'; li.style.height = s.L + 'px';
  });
  if (phone) { place(r0.h2, 16, H - 132); r0.sp.style.display = 'none'; }
  else { place(r0.h2, 104, H - 98 - 76 * k); r0.sp.style.right = '56px'; r0.sp.style.top = (H / 2 - 70) + 'px'; }
  // string + koyori loops
  let d = `M -10 ${sagY(-10)}`; for (let x = 0; x <= W + 10; x += 20) d += ` L ${x} ${sagY(x).toFixed(1)}`;
  let svg = `<svg class="tz-string" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true" style="position:absolute;left:0;top:0;overflow:visible"><defs><filter id="tw"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3"/><feDisplacementMap in="SourceGraphic" scale="1.2"/></filter></defs>`;
  svg += `<path d="${d}" stroke="#0d1230" stroke-width="3.6" fill="none" opacity=".55" transform="translate(2 4)"/><path d="${d}" stroke="#EFE8D8" stroke-width="2.2" fill="none" stroke-linecap="round" filter="url(#tw)"/><path d="${d}" stroke="#a9a08e" stroke-width="2.2" fill="none" stroke-dasharray="2 3" opacity=".7"/>`;
  for (const s of strips) {
    const ys = sagY(s.cx), cx = s.cx, by = s.top;
    svg += `<path d="M ${cx - 7} ${ys - 2} C ${cx - 9} ${ys + 9}, ${cx - 4} ${by - 4}, ${cx} ${by + 6} C ${cx + 4} ${by - 4}, ${cx + 9} ${ys + 9}, ${cx + 7} ${ys - 2}" stroke="#F3EDE0" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="${cx}" cy="${ys - 1}" r="3.4" fill="#EFE8D8"/><circle cx="${cx + 0.8}" cy="${ys}" r="1.5" fill="#b5ab97"/>`;
  }
  svg += '</svg>';
  const wrap = document.createElement('div'); wrap.className = 'tz-wrap'; wrap.setAttribute('aria-hidden', 'true'); wrap.innerHTML = svg; wrap.style.cssText = 'left:0;top:0;width:100%;height:100%;pointer-events:none';
  sec.insertBefore(wrap, sec.firstChild);

  const kiri = phone
    ? { from: 14.04, glintEnd: 14.2, sepStart: 14.12, to: 14.96, line: [[0.56 * W, 1.05 * H], [0.44 * W, -0.05 * H]], dist: W * 0.62, rot: 1.6, ease: io2 }
    : { from: 14.04, glintEnd: 14.2, sepStart: 14.12, to: 14.96, line: [[0.54 * W, 1.05 * H], [0.47 * W, -0.05 * H]], dist: W * 0.6, rot: 1.3, ease: io2 };

  return {
    id: 'xizmatlar', el: sec, z: 7.5, range: [12.4, 15], ground: 'cloth', navBeat: 13.9, poster: [14],
    get overlay() { return S._b < 13.02; },
    draw(b, T) {
      if (b > 13 || S.posterMode) R.cloth({ ...S.tableCloth, sheen: [S.pointer[0], S.pointer[1], 0.12] });
      if (b < 12.5) return;
      if (T != null) step(b, T);
      const dy = -(1 - drop(b)) * (G.yS + G.lens[6] + 80);
      R.push(tr(0, dy));
      for (const s of strips) {
        if (!s.tex) continue;
        const L = vis(b, s);
        const M = makeT({ rot: angOf(b, s), px: s.cx, py: s.top });
        const full = L >= s.L - 0.5;
        const E = [edgeAt(1, 0, s.cx - G.sw / 2, 0), edgeAt(-1, 0, s.cx + G.sw / 2, 0), edgeAt(0, 1, 0, s.top), edgeAt(0, -1, 0, s.top + L + (full ? 0 : 1))];
        R.push(mul(tr(phone ? 4 : 9, phone ? 7 : 14), M), E); R.shadow({ rect: [s.cx - G.sw, s.top - 20, G.sw * 2, s.L + 60], alpha: 0.38, blur: phone ? 12 : 22 }); R.pop();
        R.push(M, E);
        R.push(tr(s.cx, s.top));
        R.paper({ tex: s.tex, rect: [-G.sw / 2, 0, G.sw, L + 4], deckle: full ? [0, -1, L, phone ? 2 : 3.5] : undefined });
        R.pop();
        R.pop();
        if (!full) { // the rolled-up rest of the strip
          const rr = phone ? 6 : 9;
          R.push(M);
          R.push(tr(s.cx, s.top));
          R.paper({ tex: s.tex, rect: [-G.sw / 2 - 1, L - rr * 0.6, G.sw + 2, rr * 2], cyl: [1, L + rr * 0.4, rr * 1.05, 1], tint: [0.97, 0.96, 0.95] });
          R.pop(); R.pop();
        }
      }
      R.pop();
    },
    dom(b, root) {
      const r = refs(root, { h2: '.tz-h2', li: '.strip*', sp: '.tz-spine', w: '.tz-wrap' });
      const dy = -(1 - drop(b)) * (G.yS + G.lens[6] + 80);
      setT(r.w, `translate(0px,${dy.toFixed(1)}px)`);
      r.li.forEach((li, i) => {
        const s = strips[i];
        const L = vis(b, s);
        setT(li, `translate(0px,${dy.toFixed(1)}px) rotate(${angOf(b, s).toFixed(3)}deg)`);
        setClip(li, `inset(0px 0px ${(s.L - L + 2).toFixed(1)}px 0px)`);
      });
      reveal(r.h2, seg(b, 12.7, 12.98));
      reveal(r.sp, seg(b, 12.75, 12.98), 'y');
    },
    exit: {
      from: 14.04, to: 15.0, freeze: 14,
      state: (b) => cutState(b, kiri, W, H),
      label: { ja: '切り上げ', rom: 'KIRI-AGE', from: 14.03, to: 14.6, at: () => [kiri.line[1][0] + 22, 80], cloth: true },
    },
    groundAt: () => 'cloth',
  };
}
