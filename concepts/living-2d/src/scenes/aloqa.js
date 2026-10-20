// Scene 7: 印 ALOQA — a fresh sheet is laid over the time sheet; the number is stamped digit by digit like movable type,
// the QILICH house seal is pressed, then the 剣 name seal joins it (ryōin, the calligrapher's pair).
// Then the sheet lifts to show the colophon on the cloth.
import { houseSeal, nameSeal } from '../seal.js';
import { seg, io2, io3, out3, reveal, refs, place, tr, makeT, mul, rectPoly } from '../util.js';
import { edgeAt } from '../gl.js';

export function aloqa(S) {
  const { W, H, phone, R, paper } = S;
  const m = paper.m;
  const V = 1;
  const sec = document.getElementById('aloqa');
  const LIFT = S.lift = phone ? 0.33 : 0.37; // how far the sheet lifts for the footer (fraction of H)
  const r0 = refs(sec, { h2: '.al-h2', addr: '.al-addr', tel: '.al-tel', mail: '.al-mail', tate: '.al-tate' });
  const txt = r0.tel.textContent; r0.tel.textContent = '';
  for (const ch of txt) { const sp = document.createElement('span'); sp.className = 'dg'; sp.setAttribute('aria-hidden', 'true'); sp.textContent = ch; if (ch === ' ') sp.style.width = '.2em'; r0.tel.appendChild(sp); }
  const lab = document.createElement('span'); lab.className = 'sr'; lab.textContent = txt; r0.tel.appendChild(lab);
  let seal, nseal;
  if (phone) {
    place(r0.h2, 22, 78);
    place(r0.addr, 22, 0.42 * H);
    seal = { size: 112, x: W - 22 - 56, y: 0.69 * H };
    nseal = { size: 52, x: W - 22 - 112 - 44, y: 0.69 * H + 30 };
    place(r0.tate, W - 22 - 112 - 34, 0.69 * H - 120);
  } else {
    place(r0.h2, 104, 92);
    place(r0.addr, 104, 0.47 * H);
    const telW = r0.tel.getBoundingClientRect().width;
    const size = Math.max(150, Math.min(232, W - 104 - (104 + telW) - 190));
    const x = Math.min(W - 104 - 64 - size / 2, 104 + telW + 90 + size / 2);
    seal = { size, x, y: 0.5 * H };
    nseal = { size: Math.round(size * 0.34), x: x - size * 0.18, y: 0.5 * H + size / 2 + size * 0.34 / 2 + 26 };
    place(r0.tate, x + size / 2 + 36, 0.5 * H - size / 2 + 4);
  }
  let sealTex = null, nameTex = null;
  S.tasks.add('aloqa.seal', () => {
    sealTex = R.texFrom(houseSeal(seal.size, { k: 2, seed: 8 }), { premul: true });
    nameTex = R.texFrom(nameSeal(nseal.size, { k: 3, seed: 12, erosion: 0.45 }), { premul: true });
  }, 13);

  const enterE = (b) => io3(seg(b, 17.0, 17.55));
  const settle = (b) => Math.sin(Math.PI * seg(b, 17.5, 17.68)) * (phone ? 3 : 5);
  const sheetY = (b) => -(1 - enterE(b)) * (H + 60) + settle(b) - io2(seg(b, 19.05, 19.85)) * LIFT * H;
  // a seal: in the air (shadow growing), down, pressed
  function stamp(tex, s, b, t0, t1) {
    if (!tex || b < t0) return;
    const z = s.size;
    const down = b >= t1;
    const lift = down ? 0 : out3(seg(b, t0, t0 + (t1 - t0) * 0.45)) * (1 - seg(b, t0 + (t1 - t0) * 0.6, t1));
    if (!down) {
      R.push(mul(tr(s.x + 12 + 22 * lift, s.y + 18 + 34 * lift), makeT({ rot: -2 })));
      R.sprite(tex, { rect: [-z / 2, -z / 2, z, z], mode: 2, lod: 0, alpha: 0.22 * lift });
      R.pop();
      return;
    }
    const k = 1 - 0.02 * Math.sin(Math.PI * seg(b, t1, t1 + 0.04));
    R.push(mul(tr(s.x, s.y), makeT({ rot: -2, sx: k, sy: k })));
    R.sprite(tex, { rect: [-z / 2, -z / 2, z, z], mode: 1, alpha: 0.97 });
    R.pop();
  }
  const piece = (b, a) => ({ pieces: [{ edges: [edgeAt(0, -1, 0, H + 2)], M: tr(0, sheetY(b)), domPoly: rectPoly(-W, -H, 3 * W, 3 * H), shadowA: a }], under: rectPoly(0, Math.max(0, sheetY(b) + H), W, Math.max(0, -sheetY(b))) });

  return {
    id: 'aloqa', el: sec, z: 6.5, range: [17, 20], ground: 'paper', navBeat: 18, poster: [19],
    draw(b) {
      R.paper({ tex: paper, rect: [-m, -m, W + 2 * m, H + m], variant: V, deckle: [0, -1, H, phone ? 2.5 : 4] });
      stamp(sealTex, seal, b, 17.6, 17.86);
      stamp(nameTex, nseal, b, 18.2, 18.46);
    },
    dom(b, root) {
      const r = refs(root, { h2: '.al-h2', tel: '.al-tel', mail: '.al-mail', tate: '.al-tate', dg: '.dg*' });
      reveal(r.h2, seg(b, 17.0, 17.22));
      const n = r.dg.length;
      r.dg.forEach((d, i) => {
        const t = seg(b, 17.38 + 0.36 * (i / n), 17.43 + 0.36 * (i / n));
        if (d._p === t) return; d._p = t;
        d.style.opacity = t > 0 ? '1' : '0';
        d.style.transform = t < 1 ? `scale(${(1.18 - 0.18 * out3(t)).toFixed(3)})` : '';
      });
      reveal(r.mail, seg(b, 17.7, 17.88));
      reveal(r.tate, seg(b, 18.5, 18.85), 'y');
    },
    enter: { from: 17, to: 17.7, state: (b) => piece(b, 0.34) },
    exit: { from: 19.04, to: 20.0, state: (b) => piece(b, 0.36) },
  };
}
