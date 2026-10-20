// The master timeline: one unit of time per poster. Every integer is a settled poster;
// every tween lives inside [k + 0.15, k + 0.85], so any scroll position between two posters is a designed in-between.
import { gsap } from 'gsap';
import { RoughEase } from 'gsap/EasePack';
gsap.registerPlugin(RoughEase);
import { POSTERS } from './layout.js';

export function initialState(L) {
  const { W, H, F, phone } = L;
  return {
    clothY: 0, fell: F, wTop: -1, wBot: F, bladeY: F, bladeLift: 0,
    ampW: 0.6, ampVel: 0, velSign: 1, fresh: 0,
    ampL: phone ? 40 : 60, ampTop: 2, looseScale: phone ? 2.6 : 2.4, looseOff: 30, fade: phone ? 60 : 70, topLit: 1, recede: 0.7, nearW: 0.27, nearD: 110,
    sweep: W * 1.05, glint: W * 0.62,
    pull: 0, pickTop: F, pickX: -200, pickDir: 0,
    jiyak: 9 * L.pitch * 0.5,
    shear: 0, shotFront: 0,
    sigOn: 0, bow: 0, brk: 0, rejoin: 0, knot: 0, andon: 0, andonMix: 0, andonDy: -620,
    safe: L.danSafe, safeK: 1, ties: 0,
    drop: -1, introReg: 1, introAmp: 0,
    dim: 1, shock: -1, shockA: 0,
    lightX: W * 0.3, lightY: H * 0.25, lightDX: -0.35, lightDY: 0.22,
    shuttleX: W - (phone ? 52 : 120), shuttleY: F - (phone ? 10 : 17), shuttleSX: 1,
    needle: 0, hanko: 0, mei: 0,
  };
}

export function buildMaster(L, U, el) {
  const { W, H, F, sh, phone } = L;
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'sine.inOut' } });
  const K = Object.fromEntries(POSTERS.map((n, i) => [n, i]));
  const cy = L.clothY;
  const to = (props, at, dur, ease) => tl.to(U, { ...props, duration: dur, ease: ease || 'sine.inOut' }, at);
  const set = (props, at) => tl.set(U, props, at);
  const wIn = (e, at, d = 0.13) => e && tl.fromTo(e, { '--w': 0 }, { '--w': 1, duration: d, ease: 'power2.inOut' }, at);
  const wOut = (e, at, d = 0.12) => e && tl.fromTo(e, { '--a': 0 }, { '--a': 1, duration: d, ease: 'power2.inOut', immediateRender: false }, at);
  const beat = (at, depth = 10) => {
    to({ bladeLift: depth }, at, 0.05, 'power4.in');
    to({ bladeLift: 0 }, at + 0.05, 0.12, 'elastic.out(1, 0.4)');
    set({ shock: 0, shockA: 3 }, at + 0.05);
    to({ shock: 1.3, shockA: 0 }, at + 0.05, 0.14, 'none');
    set({ shock: -1 }, at + 0.2);
  };
  const sweepTo = (v, k) => to({ sweep: v }, k + 0.15, 0.7, 'none');
  const glintTo = (v, k) => to({ glint: v }, k + 0.15, 0.7, 'power1.inOut');

  // the sheen and the kantei glint travel with the story
  POSTERS.forEach((_, k) => {
    if (k === POSTERS.length - 1) return;
    sweepTo(W * (k % 2 ? 1.05 : 0.35) + H * 0.3, k);
    glintTo(W * (k % 2 ? 0.3 : 0.72), k);
  });

  // 0 → 1 · hero → 絣: the cloth advances; the indigo 絣 cloth is woven as it crosses the fell
  let k = K.hero;
  to({ clothY: cy.kasuri }, k + 0.15, 0.7);
  to({ shuttleX: W + 320 }, k + 0.15, 0.18, 'power2.in');
  beat(k + 0.48);

  // 1 → 2 · 絣 = ABR: threads right of the split slide down, carrying the abr dye
  k = K.kasuri;
  to({ pull: 1 }, k + 0.15, 0.55, 'none');
  wIn(el['abr-l2'], k + 0.72);
  wIn(el['abr-h2'], k + 0.74);
  beat(k + 0.62, 6);

  // 2 → 3 · 段取り dandori: the loom is opened; the pattern stays on the loose threads, tied
  k = K.abr;
  wOut(el['abr-l1'], k + 0.15);
  wOut(el['abr-l2'], k + 0.16);
  wOut(el['abr-h2'], k + 0.17);
  to({ wTop: F }, k + 0.15, 0.45, 'power1.inOut');
  to({ ampTop: phone ? 18 : 28 }, k + 0.15, 0.45);
  to({ bladeY: -90 }, k + 0.15, 0.27, 'power2.in');
  to({ looseScale: 1, looseOff: 0 }, k + 0.4, 0.2);
  to({ fell: H + 4, recede: 0, fade: H * 1.4 }, k + 0.45, 0.4);
  to({ ties: 1 }, k + 0.6, 0.25);
  to({ safeK: phone ? 0.36 : 0.55 }, k + 0.5, 0.3);
  wIn(el['dan-l'], k + 0.7);
  wIn(el['dan-h2'], k + 0.72);
  wIn(el['dan-p'], k + 0.76);

  // 3 → 4 · 自働化 jidoka: the warp advances; the blade comes back and weaves the night cloth from the top
  k = K.dandori;
  wOut(el['dan-l'], k + 0.15);
  wOut(el['dan-h2'], k + 0.16);
  wOut(el['dan-p'], k + 0.17);
  to({ ties: 0, safeK: 1 }, k + 0.15, 0.15);
  to({ ampTop: phone ? 6 : 8 }, k + 0.15, 0.3);
  to({ clothY: cy.jidoka }, k + 0.15, 0.33, 'power1.inOut');
  set({ wBot: -20, wTop: -1, sigOn: 1, ampTop: phone ? 6 : 8 }, k + 0.48);
  set({ bladeY: -20 }, k + 0.48);
  to({ wBot: F, bladeY: F }, k + 0.48, 0.37, 'none');
  to({ fell: F, recede: 0.7, fade: phone ? 60 : 70, looseScale: phone ? 2.6 : 2.4, looseOff: 30 }, k + 0.72, 0.13);
  to({ andonDy: 0 }, k + 0.6, 0.25, 'power2.out');
  to({ lightX: W * 0.85, lightY: H * 0.15, lightDX: -0.2, lightDY: 0.3 }, k + 0.4, 0.4);

  // 4 → 5 · the signal thread strains and snaps; the andon lights 止 and the loom stops
  k = K.jidoka;
  to({ bow: 1 }, k + 0.15, 0.45, 'power2.in');
  to({ andon: 0.22 }, k + 0.15, 0.45, 'rough({ strength: 1.6, points: 14, taper: "none", randomize: false, clamp: true })');
  to({ brk: 1, bow: 0 }, k + 0.6, 0.16, 'power3.out');
  to({ andon: 1 }, k + 0.6, 0.08, 'power2.out');
  to({ bladeLift: 10 }, k + 0.6, 0.12, 'power2.out');
  wIn(el['jid-p'], k + 0.72);

  // 5 → 6 · 報連相 hōrensō: the ends fly together, a knot; 進 in emerald; the loom runs again
  k = K.snap;
  wOut(el['jid-l'], k + 0.15);
  wOut(el['jid-h2'], k + 0.16);
  wOut(el['jid-p'], k + 0.17);
  to({ rejoin: 1 }, k + 0.15, 0.35, 'back.out(1.4)');
  to({ knot: 1 }, k + 0.45, 0.15, 'back.out(2)');
  to({ andonMix: 1 }, k + 0.5, 0.1);
  to({ bladeLift: 0 }, k + 0.6, 0.06, 'power2.in');
  beat(k + 0.68);
  wIn(el['hor-l'], k + 0.72);
  wIn(el['hor-h2'], k + 0.74);
  wIn(el['hor-p'], k + 0.78);

  // 6 → 7 · QURAMIZ: the night cloth (with its knot) rides up and out; fresh silk is woven
  k = K.horenso;
  to({ clothY: cy.quramiz }, k + 0.15, 0.7);
  to({ andonDy: -80, andon: 0.6 }, k + 0.15, 0.7);
  to({ lightX: W * 0.3, lightY: H * 0.25, lightDX: -0.35, lightDY: 0.22 }, k + 0.15, 0.7);
  beat(k + 0.5);
  to({ shuttleX: W - (phone ? 52 : 110) }, k + 0.6, 0.25, 'power3.out');

  // 7 → 8 → 9 · the services, woven stripe by stripe by the shuttle
  const restL = phone ? 52 : 110, restR = W - (phone ? 52 : 110);
  const throwStripe = (s, t0) => {
    const dir = s % 2 ? 1 : -1; // the shuttle starts at the right selvedge
    const a = dir > 0 ? -60 : W + 60, b = dir > 0 ? W + 60 : -60;
    const start = dir > 0 ? restL : restR, end = dir > 0 ? restR : restL;
    set({ pickDir: dir, pickX: a, pickTop: F }, t0);
    to({ clothY: cy.quramiz + (s + 1) * sh, pickTop: F - sh }, t0, 0.05, 'power1.inOut');
    // anticipation, flight (stretched), catch (squash and wobble)
    to({ shuttleX: start - dir * 22 }, t0, 0.03, 'power2.out');
    to({ shuttleX: end, pickX: b }, t0 + 0.03, 0.1, 'power2.inOut');
    to({ shuttleSX: 1.15 }, t0 + 0.03, 0.04, 'power2.out');
    to({ shuttleSX: 0.88 }, t0 + 0.11, 0.02, 'power2.in');
    to({ shuttleSX: 1 }, t0 + 0.13, 0.04, 'elastic.out(1, 0.35)');
    const d = el['svc-d' + s];
    if (d) tl.fromTo(d, { '--w': 0 }, { '--w': 1, duration: 0.07, ease: 'power1.inOut' }, t0 + (dir > 0 ? 0.08 : 0.04));
    beat(t0 + 0.13, 7);
  };
  for (let s = 0; s < 4; s++) throwStripe(s, K.quramiz + 0.15 + s * 0.175);
  for (let s = 4; s < 7; s++) throwStripe(s, K.stripes4 + 0.15 + (s - 4) * 0.175);
  wIn(el['svc-hint'], K.stripes4 + 0.74);

  // 9 → 10 · time: two working days, each in its own local time
  k = K.stripes7;
  set({ pickDir: 0 }, k + 0.15);
  to({ shuttleX: -320 }, k + 0.15, 0.15, 'power2.in');
  to({ clothY: cy.time }, k + 0.15, 0.7);
  beat(k + 0.5);

  // 10 → 11 · one instant: Tokyo slides four hours; the shared hours weave as one shot-woven block
  k = K.time;
  to({ shear: 4 * L.time.hw }, k + 0.15, 0.4, 'power2.inOut');
  beat(k + 0.55, 7);
  tl.fromTo(U, { shotFront: L.time.shot[0] }, { shotFront: L.time.shot[2] + 2, duration: 0.23, ease: 'none', immediateRender: false }, k + 0.62);
  to({ needle: 1 }, k + 0.66, 0.16, 'power2.out');
  wIn(el['time-p'], k + 0.72);
  wIn(el['now-l'], k + 0.78, 0.08);

  // 11 → 12 · contact: the invitation is woven
  k = K.shot;
  to({ clothY: cy.contact }, k + 0.15, 0.7);
  beat(k + 0.5);

  // 12 → 13 · the woven phone number, and the house seal
  k = K.contact;
  to({ clothY: cy.phone }, k + 0.15, 0.7);
  beat(k + 0.5);
  to({ hanko: 1 }, k + 0.78, 0.07, 'power3.in');

  // 13 → 14 · the cloth's end: jiyak and the maker's label
  k = K.phone;
  to({ clothY: cy.footer }, k + 0.15, 0.7);
  beat(k + 0.5);
  to({ mei: 1 }, k + 0.76, 0.09, 'back.out(1.6)');

  tl.set({}, {}, POSTERS.length - 1);
  return tl;
}
