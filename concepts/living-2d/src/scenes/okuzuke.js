// Footer: 奥付 OKUZUKE — the colophon on indigo cloth, set like the last page of a Japanese book,
// and a closing 一 written in silk-white ink: the site starts and ends with the pen.
import { kanjiStrokes, buildField } from '../fude.js';
import { seg, reveal, refs, place } from '../util.js';

export function okuzuke(S) {
  const { W, H, phone, R, paper, kvg } = S;
  const m = paper.m;
  const sec = document.getElementById('oxiri');
  const LIFT = S.lift || 0.37;
  const top = (1 - LIFT) * H; // where the lifted contact sheet ends
  const r0 = refs(sec, { col: '.colophon' });
  if (phone) { place(r0.col, 18, top + 26); r0.col.style.width = (W - 36) + 'px'; }
  else { place(r0.col, 104, top + 44); r0.col.style.width = Math.min(760, W * 0.53) + 'px'; }
  // the closing stroke
  let fOne = null;
  const len = phone ? 0.34 * W : 0.3 * W, x0 = phone ? W - 18 - len : W - 104 - len, y = phone ? top + 30 : top + (H - top) * 0.46;
  S.tasks.add('oxiri.one', () => {
    const k = kvg['一']; const s = len / (96.88 - 11);
    const st = kanjiStrokes(k, { x: x0 - 11 * s, y: y - 52 * s, size: 109 * s }, { per: [{ W: phone ? 22 : 40, dryStart: 0.45, dry: 1.9, press: 0.25 }] });
    { const yy = st[0].pts[0][1]; st[0].pts.forEach((p) => { p[1] = yy + (p[1] - yy) * 0.5; }); }
    fOne = R.fieldTex(buildField(st, { W: phone ? 22 : 40, seed: 61, bleed: 0.16 }));
  }, 14);
  const cloth = { rect: [-m, -m, W + 2 * m, H + 2 * m], contrast: 0.36, scale: phone ? 0.62 : 0.9, seed: 0.91, time: 2, shade: [W * 0.4, H * 0.85, W * 0.9, 0.24] };

  return {
    id: 'oxiri', el: sec, z: 5, range: [19, 20], ground: 'cloth', navBeat: 20,
    draw(b) {
      R.cloth({ ...cloth, boxes: [[phone ? 10 : 90, top + 20, phone ? W - 20 : Math.min(800, W * 0.56), H - top - 30]], sheen: [S.pointer[0], S.pointer[1], 0.1] });
      if (fOne) R.ink(fOne, { paper, p: seg(b, 19.45, 19.95), screen: true, ink: [0.88, 0.85, 0.79], wetK: 2, age: 1 });
    },
    dom(b, root) {
      const r = refs(root, { col: '.colophon' });
      reveal(r.col, seg(b, 19.35, 19.8), 'y');
    },
    posterDom() { // reduced motion: only the cloth part, colophon on top
      sec.style.height = (H - top + 30) + 'px'; sec.style.backgroundPosition = `0 ${-top}px`;
      place(r0.col, phone ? 18 : 104, phone ? 26 : 44);
    },
  };
}
