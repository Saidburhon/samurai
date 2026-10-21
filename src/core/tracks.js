// The state function (§3.3): the whole scroll-driven state is a pure function of the position on the track.
// Per layout the track is one ordered list of holds: every beat on landscape (BEATS), the posters on portrait (PHONE).
// evalS(pos, layout) names the two holds around pos, the transition between them and the eased progress of each of
// its groups; scenes/frame.js turns that into uniforms, the camera and the paper, core/dom.js into the text masks.
// Seeking, scrolling forwards or back and jumping give the same frame, because nothing here depends on the path.
import { BEATS, PHONE, TRANS, INTRO, FREEZE_WIN } from './shots.js';
import { ease, clamp01 } from './eases.js';

export const GROUPS = ['cam', 'look', 'mat', 'sign', 'ink'];
const isFreeze = (t) => t && (t.type === 'cut' || t.type === 'wipe');

// the transition between two phone posters: the first freeze it crosses, else the spin, else a camera move
function portTrans(a, b) {
  const i = BEATS.indexOf(a), k = BEATS.indexOf(b);
  for (let x = i; x < k; x++) if (isFreeze(TRANS[BEATS[x]])) return TRANS[BEATS[x]];
  if (k - i === 1) return TRANS[a] || { type: 'cam' };
  for (let x = i; x < k; x++) if (TRANS[BEATS[x]] && TRANS[BEATS[x]].type === 'spin') return TRANS[BEATS[x]];
  const g = {};
  for (let x = i; x < k; x++) Object.assign(g, (TRANS[BEATS[x]] || {}).groups || {});
  return { type: 'cam', groups: g.mat ? { mat: g.mat } : undefined };
}
export const SEQ = {
  land: { names: BEATS, trans: BEATS.slice(0, -1).map((n) => TRANS[n] || { type: 'cam' }) },
  port: { names: PHONE, trans: PHONE.slice(0, -1).map((n, j) => portTrans(n, PHONE[j + 1])) },
};
// the desktop beat number of a position on a layout's track (the phone's posters map linearly between their beats)
export function beatOf(pos, layout) {
  if (layout === 'land') return pos;
  const n = PHONE.length, j = Math.max(0, Math.min(n - 2, Math.floor(pos))), f = Math.max(0, Math.min(1, pos - j));
  const a = BEATS.indexOf(PHONE[j]), b = BEATS.indexOf(PHONE[j + 1]);
  return a + (b - a) * f;
}
// the position on a layout's track of a desktop beat number (or name)
export function posOf(beat, layout) {
  if (typeof beat === 'string') { const i = SEQ[layout].names.indexOf(beat); if (i >= 0) return i; beat = BEATS.indexOf(beat); if (beat < 0) return 0; }
  if (layout === 'land') return beat;
  for (let j = 0; j < PHONE.length - 1; j++) {
    const a = BEATS.indexOf(PHONE[j]), b = BEATS.indexOf(PHONE[j + 1]);
    if (beat <= b) return j + Math.max(0, (beat - a) / (b - a));
  }
  return PHONE.length - 1;
}

// the eased progress of every group for a transition at fraction f of its beat
function groups(tr, f) {
  const fr = isFreeze(tr), e = {}, p = {};
  for (const g of GROUPS) {
    let w = tr.groups && tr.groups[g];
    if (!w) w = fr ? [FREEZE_WIN[0], FREEZE_WIN[1], 'cam'] : g === 'sign' && tr.words ? [0.35, 0.65, 'sine'] : [0.15, 0.85, 'cam'];
    p[g] = clamp01((f - w[0]) / (w[1] - w[0]));
    e[g] = ease(w[2])(p[g]);
  }
  return { e, p };
}

// a transition between two named holds at fraction f (also the intro: intro -> mei.hero)
export function evalT(a, b, tr, f, k = 0) {
  const { e, p } = groups(tr, f);
  const fr = isFreeze(tr);
  let freeze = null;
  if (fr) {
    const fp = (f - FREEZE_WIN[0]) / (FREEZE_WIN[1] - FREEZE_WIN[0]);
    if (fp > 0 && fp < 1) freeze = { k, p: fp, tr };
  }
  // what the live layers show: the incoming hold under a freeze (its camera still easing in), else the mix
  const live = fr ? (f < FREEZE_WIN[0] ? 'a' : 'b') : 'mix';
  // (G3: the incoming camera holds still under a freeze; easing it in from further back re-rasterised the paper's
  // layers, the dial above all, in every frame of the wipe on a software renderer)
  const push = 0;
  return { a, b, k, f, tr, e, p, freeze, live, push, near: f < 0.5 ? a : b };
}

export function evalS(pos, layout) {
  const seq = SEQ[layout], n = seq.names.length;
  pos = Math.max(0, Math.min(n - 1, pos));
  const k = Math.min(Math.floor(pos), n - 2), f = pos - k;
  const d = evalT(seq.names[k], seq.names[k + 1], seq.trans[k], f, k);
  d.pos = pos; d.layout = layout;
  d.atHold = Math.abs(pos - Math.round(pos)) <= 0.15;
  d.hold = d.atHold ? seq.names[Math.round(pos)] : null;
  return d;
}
export const evalIntro = (t, layout) => Object.assign(evalT('intro', 'mei.hero', INTRO, Math.max(0, Math.min(1, t))), { pos: 0, layout, atHold: t >= 1, hold: t >= 1 ? 'mei.hero' : null, intro: true });
export { isFreeze };
