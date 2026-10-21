// The film (G3): the one loop (§6.3) over the director, the state function, the stage, the paper, the freezes and the
// text. Imported with the GL chunk; main.js starts it once GL is ready (the boot path), or frozen on a beat (?beat).
//   each tick: director (input -> follower -> pos) -> evalS(pos) -> freeze -> frame (stage + paper) -> text -> render
// Render on demand: a frame is drawn only when the effective state changed (inside a hold window the state is the
// hold itself, so a settling follower costs nothing); the hold's own work (the crisp stipple, the rays, the freezes of
// the transitions that touch it) runs once on entering the window.
import { gsap } from 'gsap';
import { Director } from './director.js';
import { evalS, evalIntro, evalT, posOf, beatOf, SEQ, isFreeze } from './tracks.js';
import { BEATS, PHONE } from './shots.js';
import { Film } from '../scenes/frame.js';
import { Dom } from '../scenes/dom.js';
import { Cut } from '../fx/cut.js';
import { Labels } from '../ui/labels.js';

const Q = window.__qilich || (window.__qilich = {});
const html = document.documentElement;
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));
const ZERO = { cam: 0, look: 0, mat: 0, sign: 0, ink: 0 };
// the last frames drawn: [time ms, beat, render ms] (for the probes)
const flog = (Q.flog = []);
// a hold as a descriptor (also 'intro', which is not on the track)
const holdD = (name, layout) => ({ a: name, b: name, k: 0, f: 0, tr: {}, e: ZERO, p: ZERO, freeze: null, live: 'a', push: 0, near: name, atHold: true, settled: true, hold: name, layout, pos: posOf(name === 'intro' ? 'mei.hero' : name, layout) });

// the effective state of a descriptor: equal keys draw the same frame. A hold is one frame wherever the follower is
// inside its window; 'settled' (the window held for 300 ms) adds the hold's own work: its resolution, the rays, the
// crisp stipple
function stateKey(d) {
  const s = d.settled ? 1 : 0;
  // under a freeze the live layers hold the incoming hold still: one GL frame for the whole freeze
  if (d.freeze && d.live === 'b' && !d.push) return `H|${d.b}|${s}`;
  if (!d.intro && !d.freeze) {
    const vals = Object.values(d.e);
    if (d.live === 'a' || (d.live === 'mix' && vals.every((v) => v === 0))) return `H|${d.a}|${s}`;
    if ((d.live === 'b' && !d.push) || (d.live === 'mix' && vals.every((v) => v === 1))) return `H|${d.b}|${s}`;
  }
  return `${d.a}|${d.b}|${d.live}|${(d.push || 0).toFixed(4)}|${Object.values(d.e).map((v) => v.toFixed(4)).join(',')}|${s}`;
}

export function parseBeatParam(q, layout) {
  const b = q.get('beat');
  if (b == null) return null;
  if (b === 'intro') return 'intro';
  if (/^-?\d+(\.\d+)?$/.test(b)) return posOf(parseFloat(b), layout);
  if (BEATS.includes(b) || PHONE.includes(b)) return posOf(b, layout);
  return 0;
}

export function startFilm({ stage, log = () => {}, q = new URLSearchParams(location.search), intro = false }) {
  const film = new Film(stage);
  film.opt = { cand: q.get('cand') || undefined, reveal: q.has('reveal') ? parseFloat(q.get('reveal')) : undefined, over: q.has('tune') ? JSON.parse(q.get('tune')) : undefined };
  const dom = new Dom();
  const cut = new Cut(film, dom);
  const labels = new Labels(stage);
  // the dial lies on the paper in the film (the same element as the flow page's, moved under the stage)
  const dial = document.getElementById('dial'), paper = document.getElementById('paper');
  if (dial && paper && !document.getElementById('dialw')) { const w = document.createElement('div'); w.id = 'dialw'; w.style.visibility = 'hidden'; w.appendChild(dial); paper.appendChild(w); }
  const layout0 = stage.w / stage.h >= 1.2 ? 'land' : 'port';
  const fz = parseBeatParam(q, layout0);
  const state = { intro: null, d: null, key: '', holdKey: '', prepared: '', drawn: null };
  const dir = new Director({
    frozen: fz === 'intro' ? 0 : fz,
    onInput: () => { if (state.intro && state.intro.t < 1) state.intro.speed = 4; },
    onJump: () => { if (state.d) cut.freezeNow(state.d); },
  });
  dir.onResize = () => { stage.setSize(innerWidth, innerHeight, true); film.reset(); cut.reset(); state.key = ''; };
  // the intro (§4.1, simple for now): the reveal 2.0 s from max(glReady, 1.7 s), then the 1.8 s lift
  if (intro && fz == null && !dir.reduced) state.intro = { t: 0, start: Math.max(performance.now(), 1700), dur: 3.8, speed: 1 };
  // a deep link (#b=, #aloqa, …) starts at its beat, without the intro
  if (fz == null) { const p = dir.hashPos(); if (p != null) { state.intro = null; dir.place(p, true); dir.x = p; } }

  const layout = () => dir.layout;
  let stamp = null;
  if (q.has('stamp')) { stamp = document.createElement('i'); stamp.style.cssText = 'position:fixed;left:0;bottom:0;width:8px;height:4px;z-index:99;pointer-events:none'; document.body.appendChild(stamp); }
  const describe = (now) => {
    if (fz === 'intro') return holdD('intro', layout());
    if (state.intro) return evalIntro(state.intro.t, layout());
    const d = evalS(dir.xp ?? dir.x, layout());
    // settled: the hold window entered at least 300 ms ago (a frozen director is settled at once). The hold's heavy
    // work waits for it, so the frames around the capture's mid shot stay light (one frame in flight, §6.4)
    if (!d.atHold) state.windowSince = null;
    else if (state.windowSince == null) state.windowSince = now;
    d.settled = d.atHold && (fz != null || dir.frozen != null || now - state.windowSince >= 300);
    return d;
  };
  // one frame in flight: a software renderer takes 0.1–0.3 s per frame in the GPU process, and frames issued faster
  // than that queue up there (the screen then lags the scroll by seconds, and so does every screenshot). A new frame,
  // its text included, is issued only when the GPU has finished the last one (a fence, never a read-back).
  const gl = stage.renderer.getContext();
  const busy = () => {
    if (!state.fence) return false;
    if (gl.isContextLost() || gl.getSyncParameter(state.fence, gl.SYNC_STATUS) === gl.SIGNALED) { gl.deleteSync(state.fence); state.fence = null; Q.gpuMs = Math.round(performance.now() - state.fenceT); return false; }
    return true;
  };
  const fence = () => { if (gl.fenceSync) { if (state.fence) gl.deleteSync(state.fence); state.fence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0); gl.flush(); state.fenceT = performance.now(); } };
  const frame = (now, force = false) => {
    const d = describe(now);
    state.d = d;
    const lay = layout();
    if (busy() && !force) { report(d, lay, false); return; }
    // the resolution: the hold's own inside a hold window (and through the intro), cheaper frames while moving (§6.4)
    // (a frame that keeps a settled hold keeps its resolution)
    const keepHold = !d.settled && d.atHold === false && state.key && state.key.endsWith('|1') && stateKey(d) === state.key.slice(0, -1) + '0';
    // under a freeze the live layers show the incoming hold, still: one frame, drawn at once at its hold resolution
    const underFreeze = !!(d.freeze && d.live === 'b');
    const hr = !!(d.settled || d.intro || fz != null || keepHold || underFreeze);
    if (hr !== state.holdRes) { state.holdRes = hr; stage.setSize(stage.w, stage.h, hr); state.key = ''; }
    let key = stateKey(d);
    // leaving a settled hold draws nothing until the state itself moves (the hold's frame is still the right one)
    if (!film.dirty && key.startsWith('H|') && key.endsWith('|0') && state.key === key.slice(0, -1) + '1') key = state.key;
    // the page's own layers (the freeze's halves and masks, the text) move at most every 90 ms on a software
    // renderer when no GL frame is due: each of their frames is a full software composite in the GPU process
    if (key === state.key && !film.dirty && stage.tier.tier === 2 && now - (state.lastDom || 0) < 90 && !cut.jumpFz) { report(d, lay, !!cut.shown); return; }
    state.lastDom = now;
    // the freeze first: preparing one renders its hold, so the live frame is applied after it
    const cutOn = cut.update(d, lay, now);
    if (stamp && cutOn) { const b = Math.max(0, beatOf(d.pos, lay)), i = Math.floor(b + 1e-6); stamp.style.background = `rgb(${i * 10},${Math.round((b - i) * 250)},77)`; }
    if (key !== state.key || film.dirty) {
      film.dirty = false;
      const ta = performance.now();
      film.apply(d);
      dom.apply(d);
      labels.update(d, lay);
      Q.applyMs = Math.round(performance.now() - ta);
      const ms = film.render();
      fence();
      // the lead of the follower's prediction: the time between two frames while the film moves (software ~0.15 s)
      if (state.lastIssue && dir.v) dir.lead = Math.min(0.12, 0.8 * (dir.lead || 0) + 0.2 * 0.45 * Math.min(0.5, (now - state.lastIssue) / 1000));
      state.lastIssue = now;
      state.key = key; state.drawn = d;
      Q.frameMs = Math.round(ms);
      // the beat of the frame on screen: a hold key is the hold itself, whatever the follower's last decimals
      state.drawnBeat = key.startsWith('H|') ? beatOf(posOf(key.split('|')[1], lay), lay) : beatOf(d.pos, lay);
      flog.push([Math.round(now), +state.drawnBeat.toFixed(4), Math.round(ms), Q.applyMs, Q.gpuMs]); if (flog.length > 600) flog.splice(0, 200);
      // ?stamp (probes only): the drawn beat as a colour in the corner, committed with the frame it describes
      if (stamp) { const b = Math.max(0, state.drawnBeat), i = Math.floor(b + 1e-6); stamp.style.background = `rgb(${i * 10},${Math.round((b - i) * 250)},77)`; }
    } else dom.apply(d);
    // the hold window: prepare the freezes of the transitions that touch this hold (either direction)
    if (d.atHold && d.hold && !d.intro && fz == null) {
      const k = Math.round(d.pos), seq = SEQ[lay], hk = `${lay}|${k}|${stage.w}x${stage.h}`;
      const need = [k - 1, k].filter((j) => j >= 0 && j < seq.trans.length && isFreeze(seq.trans[j]));
      Q.cutReady = need.every((j) => cut.ready(j, lay));
      if (!Q.cutReady && state.prepared !== hk && Math.abs(dir.v) < 0.6) {
        state.prepared = hk;
        for (const j of need) cut.prepare(j, lay);
        film.apply(d); dom.apply(d); film.render(); fence();
        Q.cutReady = true;
      }
    } else Q.cutReady = !d.freeze;
    report(d, lay, cutOn);
  };
  // report (§3.10)
  const report = (d, lay, cutOn) => {
    Q.beat = beatOf(d.pos, lay); Q.pos = d.pos; Q.name = d.near; Q.layout = lay; Q.scrollY = Math.round(dir.y);
    Q.poster = lay === 'port' ? Math.round(d.pos) : PHONE.indexOf(d.near);
    Q.atHold = !!d.atHold; Q.idle = !!d.atHold && dir.v === 0 && !cutOn;
    Q.raysReady = !!(film.raysOn && stage.rays.ready);
    Q.drawnBeat = state.drawn ? state.drawnBeat : null;
    Q.intro = state.intro ? +state.intro.t.toFixed(3) : null;
  };
  // the one loop
  gsap.ticker.lagSmoothing(0);
  let last = performance.now();
  const tick = (time) => {
    const now = performance.now(), dt = Math.min(0.25, (now - last) / 1000); last = now;
    dir.update(dt, time * 1000);
    if (state.intro) {
      if (now >= state.intro.start) state.intro.t = Math.min(1, state.intro.t + (dt * state.intro.speed) / state.intro.dur);
      if (state.intro.t >= 1 || dir.x > 0.02) { if (state.intro.t < 1) state.intro.speed = 4; if (state.intro.t >= 1) state.intro = null; }
    }
    frame(now);
  };
  html.classList.add('film');
  Q.film = { director: dir, film, cut, dom, invalidate: () => { film.dirty = true; }, state };
  // dev and probe hooks (§3.10): seek(b) freezes the director at a beat (number, name or 'intro')
  Q.seek = (b) => { const p = b === 'intro' ? 0 : posOf(typeof b === 'string' && !/^\d/.test(b) ? b : +b, layout()); dir.frozen = p; dir.x = dir.xp = p; dir.v = 0; state.intro = null; state.key = ''; };
  Q.unfreeze = () => { dir.frozen = null; };
  Q.tune = async (n, over, extra = {}) => {
    film.opt = { ...film.opt, ...extra, over };
    const d = holdD(n, layout());
    film.apply(d); dom.apply(d); labels.update(d, layout()); film.render(); stage.finish();
    return film.H;
  };
  if (fz == null) { gsap.ticker.add(tick); frame(performance.now()); }
  return { film, dir, cut, dom, frame, tick, state };
}

// ?beat: the director frozen on a hold (input off), rendered once at the hold resolution, with the timing log of G1's
// poster test (first frame, then the steady hold frame once the page has settled)
export async function holdFilm({ stage, log = () => {}, q = new URLSearchParams(location.search) }) {
  const F = startFilm({ stage, log, q });
  const t0 = performance.now(); F.frame(performance.now()); stage.finish(); const first = performance.now() - t0;
  for (let i = 0; i < 80 && !(Q.boot && Q.boot.tiles); i++) await new Promise((r) => setTimeout(r, 50));
  await nextFrame(); await nextFrame(); await new Promise((r) => setTimeout(r, 400));
  let hold = 1e9;
  for (let i = 0; i < 3; i++) { const t1 = performance.now(); F.film.render(); stage.finish(); hold = Math.min(hold, performance.now() - t1); await nextFrame(); }
  log('first', first); log('hold', hold);
  // the film keeps running frozen (Q.seek moves it), so probes can seek without reloading
  gsap.ticker.add(F.tick);
  Q.atHold = true; Q.idle = true; Q.posterReady = true;
  Q.S = F.film.H;
  return F;
}
export { evalT };
