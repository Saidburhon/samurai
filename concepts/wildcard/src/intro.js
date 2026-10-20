// The load sequence (wall clock): the warp drops, the dye registers, the qilich weaves the slogan,
// three kaizen beats, the UI is sewn on, then the loom lives: sheen, shuttle throws, the jiyak border.
import { gsap } from 'gsap';

export function buildIntro(L, Ui, U0, el, fx) {
  const { W, H, F, phone } = L;
  Object.assign(Ui, U0, {
    fell: 0, wTop: -1, wBot: -30, bladeY: -90, looseScale: 1, looseOff: 0, fade: H * 1.15, recede: 0, ampL: 0,
    introAmp: phone ? 70 : 90, introReg: 0, drop: 0, jiyak: 0, shuttleX: -320, sweep: -500, ampW: 6, fresh: 5,
    glint: -200, topLit: 1.45, nearW: 0.3, nearD: 4000,
  });
  const tl = gsap.timeline({ paused: true });
  const row = L.pitch * 0.5;
  // act 1 · 0–1.4 s: the warp drops, one thread at the centre, then 2, 4, 8 … each generation doubling outward
  tl.fromTo(Ui, { drop: 0 }, { drop: 1.6, duration: 1.6, ease: 'none' }, 0);
  tl.set(Ui, { drop: -1 }, 1.6);
  // act 2 · 1.05–1.85 s: registration, staggered left to right like a hand passing over the threads
  tl.to(Ui, { introReg: 1, duration: 0.8, ease: 'power2.inOut' }, 1.05);
  tl.set(Ui, { introAmp: 0 }, 1.86);
  // act 3 · 1.85–2.7 s: the qilich enters spine first and weaves the slogan as it descends
  tl.set(Ui, { bladeY: -40, wBot: -30 }, 1.84);
  tl.to(Ui, { bladeY: F, wBot: F, fell: F, duration: 0.86, ease: 'power1.in' }, 1.84);
  tl.fromTo(Ui, { bladeLift: 0 }, { bladeLift: 3, duration: 0.05, ease: 'sine.inOut', repeat: 15, yoyo: true, immediateRender: false }, 1.86);
  tl.set(Ui, { bladeLift: 0 }, 2.7);
  // the fringe settles into the working loom below the blade
  tl.to(Ui, { looseScale: U0.looseScale, looseOff: U0.looseOff, fade: U0.fade, recede: U0.recede, ampL: U0.ampL, topLit: 1, nearW: U0.nearW, nearD: U0.nearD, duration: 0.7, ease: 'power2.inOut' }, 2.62);
  // act 4 · three kaizen beats; each one halves the residual feathering
  [3.05, 3.45, 3.85].forEach((t, n) => {
    tl.to(Ui, { bladeLift: 16, duration: 0.11, ease: 'power4.in' }, t);
    tl.to(Ui, { bladeLift: 0, duration: 0.3, ease: 'elastic.out(1, 0.4)' }, t + 0.11);
    tl.set(Ui, { shock: 0, shockA: 3 }, t + 0.11);
    tl.to(Ui, { shock: 1.3, shockA: 0, duration: 0.4, ease: 'none' }, t + 0.11);
    tl.to(Ui, { ampW: [3, 1.5, U0.ampW][n], fresh: [2.5, 1.2, 0][n], duration: 0.25, ease: 'power2.out' }, t + 0.12);
    tl.call(() => fx.kaizen(n + 1), null, t + 0.11);
  });
  tl.set(Ui, { shock: -1 }, 4.4);
  // act 5 · 4.1–5.6 s: the UI is sewn on
  tl.fromTo(el.hdr, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.4, ease: 'power2.out' }, 4.1);
  tl.fromTo(el.selv, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.6, ease: 'power2.inOut' }, 4.3);
  ['hero-sub', 'hero-svc', 'hero-tate'].forEach((id, n) => tl.fromTo(el[id], { '--w': 0 }, { '--w': 1, duration: 0.6, ease: 'power3.inOut' }, 4.2 + n * 0.08));
  tl.fromTo(el['hero-cta'], { '--w': 0, y: -10, rotation: -3 }, { '--w': 1, y: 0, rotation: 0, duration: 0.5, ease: 'back.out(1.6)' }, 4.5);
  tl.call(() => fx.cue(true), null, 4.9);
  // life · the satin sheen sweeps; the shuttle throws three picks of the jiyak border; the kantei glint travels the blade
  tl.to(Ui, { sweep: W * 1.9, duration: 3, ease: 'sine.inOut' }, 5.6);
  const rest = W - (phone ? 52 : 120);
  const throwJ = (t, from, to, rows) => {
    const dir = to > from ? 1 : -1;
    tl.set(Ui, { shuttleX: from, shuttleSX: 1 }, t - 0.01);
    tl.to(Ui, { shuttleX: from - dir * 6, duration: 0.12, ease: 'power2.out' }, t);
    tl.to(Ui, { shuttleX: to, duration: 0.5, ease: 'power2.inOut' }, t + 0.12);
    tl.to(Ui, { shuttleSX: 1.15, duration: 0.2, ease: 'power2.out' }, t + 0.12);
    tl.to(Ui, { shuttleSX: 0.88, duration: 0.1, ease: 'power2.in' }, t + 0.52);
    tl.to(Ui, { shuttleSX: 1, duration: 0.4, ease: 'elastic.out(1, 0.35)' }, t + 0.62);
    tl.to(Ui, { jiyak: rows * row, duration: 0.12, ease: 'power2.out' }, t + 0.6);
    tl.to(Ui, { bladeLift: 10, duration: 0.08, ease: 'power4.in' }, t + 0.66);
    tl.to(Ui, { bladeLift: 0, duration: 0.3, ease: 'elastic.out(1, 0.4)' }, t + 0.74);
  };
  throwJ(6.6, -260, rest, 3);
  tl.to(Ui, { glint: W * 0.95, duration: 2.2, ease: 'power1.inOut' }, 7.6);
  throwJ(10.4, rest, phone ? 52 : 120, 6);
  tl.to(Ui, { sweep: -500, duration: 0.01 }, 11.0);
  tl.to(Ui, { sweep: W * 1.05, duration: 3.2, ease: 'sine.inOut' }, 12.2);
  tl.to(Ui, { glint: W * 0.08, duration: 0.01 }, 11.9);
  tl.to(Ui, { glint: U0.glint, duration: 1.6, ease: 'power1.inOut' }, 12.0);
  throwJ(13.2, phone ? 52 : 120, rest, 9);
  tl.set({}, {}, 16.2);
  return tl;
}
