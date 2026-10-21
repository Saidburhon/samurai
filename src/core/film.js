// The film (G3): the one loop (§6.3) over the director, the state function, the stage, the paper, the freezes and the
// text. Imported with the GL chunk; main.js starts it once GL is ready (the boot path), or frozen on a beat (?beat).
//   each tick: director (input -> follower -> pos) -> evalS(pos) -> freeze -> frame (stage + paper) -> text -> render
// Render on demand: a frame is drawn only when the effective state changed (inside a hold window the state is the
// hold itself, so a settling follower costs nothing); the hold's own work (the crisp stipple, the rays, the freezes of
// the transitions that touch it) runs once on entering the window.
import { gsap } from 'gsap';
import { Director } from './director.js';
import { evalS, evalIntro, evalT, posOf, beatOf, SEQ, isFreeze } from './tracks.js';
import { BEATS, PHONE, FREEZE_WIN } from './shots.js';
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
  if (d.koi) return `H|${d.hold}@${d.koi.toFixed(2)}|${s}`;
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

export function startFilm({ stage, log = () => {}, q = new URLSearchParams(location.search), intro = false, glReady = performance.now() }) {
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
  const state = { intro: null, d: null, key: '', prepared: '', drawn: null };
  const dir = new Director({
    frozen: fz === 'intro' ? 0 : fz,
    onInput: () => { if (state.intro && state.intro.t < 1) introSpeed(4); },
    onJump: () => { if (state.d) cut.freezeNow(state.d); },
  });
  dir.onResize = () => { stage.setSize(innerWidth, innerHeight, true); film.reset(); cut.reset(); state.key = ''; };
  // The intro (§4.1, §4.3) on the wall clock from navigation, not on the sum of frame times (G1 r2): a long software
  // frame cannot hold it back. The reveal starts at max(glReady, 1.7 s) and is anchored to fixed times, so the 3 s
  // frame is the same whenever GL was ready (up to 2.5 s): a C1 curve from (start, 0) through (2.65 s, 0.62) and
  // (3.5 s, 0.841) to (3.9 s, 1), flat at both ends. The steel leaves the habaki, fills the inner half of the blade,
  // glides along the outer half at 0.26 of its length per second (the kirari front travelling, §4.1 frame 02: two
  // thirds steel at 3 s) and comes to rest at the tip at 3.9 s; then the 1.65 s lift, settled by 5.55 s (§4.1: 5.5 s).
  // The glide is what holds 'the 3 s frame' at 60–85 % steel: a software renderer's frame takes 0.3–0.5 s here, so the
  // capture's screenshot at 3 s shows either the frame issued before it or the one after (the state of 2.6–2.85 s
  // or of 3.3–3.5 s: G1 r2 probes and captures), and both read 60–85 %.
  // GL later than 2.5 s: power2.inOut over max(1.4 s, 3.9 s − start).
  if (intro && fz == null && !dir.reduced) {
    const start = Math.max(glReady, 1700), late = start > 2500;
    const E = late ? start + Math.max(1400, 3900 - start) : 3900;
    state.intro = { t: 0, start, E, late, L: 1650, tau: 0, at: start, speed: 1 };
    log('revealStart', start); log('revealEnd', E);
  }
  // the reveal (0..1) at wall time v (ms)
  const K1 = [2650, 0.62, 0.00026], K2 = [3500, 0.841, 0.00026];
  const herm = (u, p0, m0, p1, m1, h) => { const u2 = u * u, u3 = u2 * u; return (2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * h * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * h * m1; };
  function revealAt(v) {
    const I = state.intro;
    if (v <= I.start) return 0;
    if (v >= I.E) return 1;
    if (I.late) { const x = (v - I.start) / (I.E - I.start); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(2 - 2 * x, 3) / 2; }
    if (v < K1[0]) { const h = K1[0] - I.start; return herm((v - I.start) / h, 0, 0, K1[1], K1[2], h); }
    if (v < K2[0]) { const h = K2[0] - K1[0]; return herm((v - K1[0]) / h, K1[1], K1[2], K2[1], K2[2], h); }
    const h = I.E - K2[0];
    return herm((v - K2[0]) / h, K2[1], K2[2], 1, 0, h);
  }
  // the intro's position on its own timeline at time ms (evalIntro: the reveal is [0, .526], eased power2.inOut, so
  // the reveal's value is mapped back through that ease; the lift is [.526, 1])
  function introT(ms) {
    const I = state.intro, v = I.start + I.tau + Math.max(0, ms - Math.max(I.at, I.start)) * I.speed;
    if (v >= I.E) return Math.min(1, 0.526 + 0.474 * (v - I.E) / I.L);
    const y = revealAt(v), x = y < 0.5 ? Math.cbrt(y / 4) : 1 - Math.cbrt(2 * (1 - y)) / 2;
    return 0.526 * Math.min(1, Math.max(0, x));
  }
  // scroll during the intro plays the rest at 4× (§4.3), from where it is now
  function introSpeed(k) {
    const I = state.intro, now = performance.now();
    I.tau += Math.max(0, now - Math.max(I.at, I.start)) * I.speed; I.at = Math.max(now, I.start); I.speed = k;
  }
  // a deep link (#b=, #aloqa, …) starts at its beat, without the intro
  if (fz == null) { const p = dir.hashPos(); if (p != null) { state.intro = null; dir.place(p, true); dir.x = p; } }

  const layout = () => dir.layout;
  let stamp = null;
  if (q.has('stamp')) { stamp = document.createElement('i'); stamp.style.cssText = 'position:fixed;left:0;bottom:0;width:8px;height:4px;z-index:99;pointer-events:none'; document.body.appendChild(stamp); }
  // ?stamp (probes only): the beat on screen as a colour in the corner, committed with the frame it describes. The
  // page's layers (text, freeze) always show the state d; the GL shows d when its last frame drew d's key, else the
  // drawn beat (a frame in flight): then the GL's beat is the one on screen
  const mark = (d, lay) => {
    if (!stamp) return;
    const k = stateKey(d), dk = state.key || '';
    const same = k === dk || (k.startsWith('H|') && dk.startsWith('H|') && k.slice(0, -1) === dk.slice(0, -1));
    const b = Math.max(0, same ? beatOf(d.pos, lay) : state.drawnBeat ?? 0), i = Math.floor(b + 1e-6);
    const c = `rgb(${i * 10},${Math.round((b - i) * 250)},77)`;
    if (stamp.__c !== c) { stamp.__c = c; stamp.style.background = c; }
  };
  const koi = { t: 0, v: 0, y: null };
  const atEnd = () => fz == null && dir.frozen == null && !state.intro && dir.target() >= dir.n - 1.02 && (dir.xp ?? dir.x) >= dir.n - 1.04;
  const thumb = (cm) => {
    if (!(cm > 0) || !atEnd()) return;
    const t = Math.min(3, koi.t + cm);
    if (t === koi.t) return;
    koi.t = t; gsap.to(koi, { v: t, duration: 0.7, ease: 'power2.out', overwrite: true });
  };
  addEventListener('wheel', (e) => thumb((e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY) / 480), { passive: true });
  addEventListener('touchstart', (e) => { koi.y = e.touches[0] ? e.touches[0].clientY : null; }, { passive: true });
  addEventListener('touchmove', (e) => { const y = e.touches[0] ? e.touches[0].clientY : null; if (y != null && koi.y != null) thumb((koi.y - y) / 520); koi.y = y; }, { passive: true });
  addEventListener('keydown', (e) => { if (['ArrowDown', 'PageDown', ' ', 'End'].includes(e.key)) thumb(1); });
  const describe = (now) => {
    if (fz === 'intro') return holdD('intro', layout());
    if (state.intro) return evalIntro(state.intro.t, layout());
    const d = evalS(dir.xp ?? dir.x, layout());
    // settled: the hold window entered at least 300 ms ago (a frozen director is settled at once). The hold's heavy
    // work waits for it, so the frames around the capture's mid shot stay light (one frame in flight, §6.4)
    if (!d.atHold) state.windowSince = null;
    else if (state.windowSince == null) state.windowSince = now;
    d.settled = d.atHold && (fz != null || dir.frozen != null || now - state.windowSince >= 300);
    d.calm = d.atHold && Math.abs(dir.v) < 0.6;
    // the end of the film (final pass, r2: steps 24-26 were one frame): at the last hold the wheel, a swipe or a key
    // pushes the tsuba off the koiguchi with the thumb, 1 cm per turn up to 3 cm, and the copper habaki shows
    // (koiguchi wo kiru); leaving the last hold seats the sword again
    const last = SEQ[layout()].names.at(-1);
    if (d.atHold && d.hold === last && !d.intro) d.koi = koi.v > 0.004 ? koi.v : 0;
    else if (koi.t || koi.v) { koi.t = 0; gsap.killTweensOf(koi); koi.v = 0; }
    // a freeze about to be entered forwards (the scroll's target at least half a beat on): its sheet goes up closed
    // over the hold and the live layers draw the incoming hold under it (fx/cut.js). The frame is the hold's own, so
    // seeking, scrolling and jumping still agree; the cost of the cut's first frame moves to the start of the scroll
    if (!d.freeze && !d.intro && fz == null && dir.frozen == null && isFreeze(d.tr) && d.f < FREEZE_WIN[0] && dir.target() >= d.k + 0.5 && cut.arrived(d.k, layout())) {
      d.pre = true; d.live = 'b'; d.settled = false;
    }
    return d;
  };
  // one frame in flight: a software renderer takes 0.1–0.3 s per frame in the GPU process, and frames issued faster
  // than that queue up there (the screen then lags the scroll by seconds, and so does every screenshot). A new frame,
  // its text included, is issued only when the GPU has finished the last one (a fence, never a read-back).
  const gl = stage.renderer.getContext();
  const busy = () => {
    if (!state.fence) return false;
    if (gl.isContextLost() || gl.getSyncParameter(state.fence, gl.SYNC_STATUS) === gl.SIGNALED) {
      gl.deleteSync(state.fence); state.fence = null; Q.gpuMs = Math.round(performance.now() - state.fenceT);
      // how long a moving frame takes to reach the screen (hold-resolution frames are not moving frames)
      if (state.fenceMoving) state.movLat = state.movLat == null ? Q.gpuMs : 0.6 * state.movLat + 0.4 * Q.gpuMs;
      return false;
    }
    return true;
  };
  const fence = () => { if (gl.fenceSync) { if (state.fence) gl.deleteSync(state.fence); state.fence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0); gl.flush(); state.fenceT = performance.now(); } };
  const frame = (now, force = false) => {
    const d = describe(now);
    state.d = d;
    const lay = layout();
    // a GL frame in flight: the page's own layers (the freeze, the text) still move, the GL waits for the fence
    if (busy() && !force) {
      if (stage.tier.tier !== 2 || now - (state.lastDom || 0) >= 90 || cut.jumpFz) {
        state.lastDom = now;
        cut.update(d, lay, now);
        film.colours(d); dom.apply(d);
        // (a label belongs to its hold only: it goes as soon as the hold window is left, GL frame or not)
        if (!d.atHold) labels.update(d, lay);
        mark(d, lay);
      }
      holdWork(d, lay);
      report(d, lay, !!cut.shown); return;
    }
    // the resolution: the hold's own inside a hold window (and through the intro), cheaper frames while moving (§6.4)
    // (a frame that keeps a settled hold keeps its resolution)
    const keepHold = !d.settled && d.atHold === false && state.key && state.key.endsWith('|1') && stateKey(d) === state.key.slice(0, -1) + '0';
    // (under a freeze the incoming hold is drawn once at the moving resolution: its hold-resolution frame kept the
    // software GPU busy for most of the freeze, and the halves could not move meanwhile)
    const hr = !!(d.settled || d.intro || fz != null || keepHold);
    const fromHold = state.key.startsWith('H|');
    if (hr !== state.holdRes) { state.holdRes = hr; stage.setSize(stage.w, stage.h, hr); state.key = ''; }
    // a frame reaches the screen 0.1–0.3 s after it is issued in software (more after a hold-resolution frame), so two
    // frames are drawn where the follower will be by then: the first that leaves a hold (issued only as the follower
    // leaves the window, alone it would show the scroll's first tenth for the whole of its flight), and the hold
    // being arrived at (its frame, and the copy the next freeze takes of it, are ready when the follower gets there).
    // The page's layers keep the follower's own position; never across a freeze
    let dg = d;
    const lead = state.movLat ? Math.min(0.2, 0.6 * state.movLat / 1000) : 0;
    if (lead > 0.02 && dir.v && !d.intro && !d.atHold && !d.pre && !d.freeze && fz == null && dir.frozen == null) {
      const x = dir.xp ?? dir.x, t = Math.max(0, Math.min(dir.n - 1, dir.target()));
      const xg = Math.max(Math.min(x, t), Math.min(Math.max(x, t), x + dir.v * lead));
      const g = Math.abs(xg - x) > 1e-3 ? evalS(xg, lay) : null;
      if (g && fromHold && !g.atHold && !isFreeze(d.tr) && !isFreeze(g.tr)) { g.settled = false; g.gl = true; dg = g; }
      // (arriving: only from the last few hundredths before the window, so the GL never skips the transition's end)
      else if (g && g.atHold && !g.freeze && g.hold === SEQ[lay].names[Math.round(t)] && Math.abs(x - Math.round(t)) < 0.2) { g.settled = false; g.gl = true; dg = g; }
    }
    let key = stateKey(dg);
    // leaving a settled hold draws nothing until the state itself moves (the hold's frame is still the right one)
    if (!film.dirty && key.startsWith('H|') && key.endsWith('|0') && state.key === key.slice(0, -1) + '1') key = state.key;
    // the page's own layers (the freeze's halves and masks, the text) move at most every 90 ms on a software
    // renderer when no GL frame is due: each of their frames is a full software composite in the GPU process
    if (key === state.key && !film.dirty && stage.tier.tier === 2 && now - (state.lastDom || 0) < 90 && !cut.jumpFz) { report(d, lay, !!cut.shown); return; }
    state.lastDom = now;
    // the freeze first: preparing one renders its hold, so the live frame is applied after it
    const cutOn = cut.update(d, lay, now);
    if (key !== state.key || film.dirty) {
      film.dirty = false;
      const ta = performance.now();
      film.apply(dg);
      if (dg !== d) film.colours(d);
      dom.apply(d);
      labels.update(d, lay);
      Q.applyMs = Math.round(performance.now() - ta);
      const ms = film.render();
      fence(); state.fenceMoving = !hr;
      // the lead of the follower's prediction: the time between two frames while the film moves (software ~0.15 s)
      if (state.lastIssue && dir.v) dir.lead = Math.min(0.12, 0.8 * (dir.lead || 0) + 0.2 * 0.22 * Math.min(0.5, (now - state.lastIssue) / 1000));
      state.lastIssue = now;
      state.key = key; state.drawn = dg;
      Q.frameMs = Math.round(ms);
      // the beat of the frame on screen: a hold key is the hold itself, whatever the follower's last decimals
      state.drawnBeat = key.startsWith('H|') ? beatOf(posOf(key.split('|')[1], lay), lay) : beatOf(dg.pos, lay);
      flog.push([Math.round(now), +state.drawnBeat.toFixed(4), Math.round(ms), Q.applyMs, Q.gpuMs]); if (flog.length > 600) flog.splice(0, 200);
      // a hold drawn: the freeze that leaves it copies this very frame now, in the task that drew it (no second
      // render; G3: the hold's extra renders ran into the next scroll), with the page's layers set to the hold for
      // the copy and back to the follower's state after it
      if (key.startsWith('H|') && fz == null && !dg.intro && !d.pre && !d.freeze) {
        const seq = SEQ[lay], k = seq.names.indexOf(key.split('|')[1]);
        if (k >= 0 && k < seq.trans.length && isFreeze(seq.trans[k]) && !cut.ready(k, lay)) {
          const dh = evalS(k, lay); dh.settled = true;
          dom.apply(dh); labels.update(dh, lay);
          cut.prepare(k, lay, true, true);
          dom.apply(d); labels.update(d, lay);
        }
      }
    } else { film.colours(d); dom.apply(d); if (!d.atHold) labels.update(d, lay); }
    mark(d, lay);
    holdWork(d, lay);
    if (d.settled && !d.intro && fz == null && !cut.warmed) cut.warm();
    report(d, lay, cutOn);
  };
  // the hold window: prepare the freezes of the transitions that touch this hold, in either direction. Runs whether or
  // not a GL frame is in flight (the snapshot takes bitmaps, never a read-back)
  const holdWork = (d, lay) => {
  if (d.atHold && d.hold && !d.intro && fz == null) {
    const k = Math.round(d.pos), seq = SEQ[lay], hk = `${lay}|${k}|${stage.w}x${stage.h}`;
    const need = [k - 1, k].filter((j) => j >= 0 && j < seq.trans.length && isFreeze(seq.trans[j]));
    // (the freeze that leaves this hold is taken when its frame is drawn, frame() above; the one that arrives here
    // from hold k − 1 shows that hold, drawn once this hold has settled: scrolling forwards it was taken at hold
    // k − 1 already)
    // (a hold drawn under a freeze, the incoming hold of a cut or a wipe, is not copied then: if this hold leads into
    // another freeze, its copy is drawn once the director calms in the window)
    const own = need.includes(k) && !cut.ready(k, lay) && (d.calm || d.settled) && state.prepared !== hk + '|own';
    if (own) { state.prepared = hk + '|own'; cut.prepare(k, lay, true, false); fence(); }
    const back = need.filter((j) => j !== k && !cut.ready(j, lay));
    if (back.length && d.settled && state.prepared !== hk) { state.prepared = hk; for (const j of back) cut.prepare(j, lay, false, false); fence(); }
    Q.cutReady = need.every((j) => cut.ready(j, lay));
    Q.cutArrived = need.every((j) => cut.arrived(j, lay));
  } else { Q.cutReady = !d.freeze; if (!d.atHold) state.prepared = ''; }
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
      // (the lead: a frame reaches the screen when the GPU has drawn it and stays until the next one does, so it is
      // evaluated half a GPU frame ahead; a software renderer's frames take 0.3–0.5 s during the reveal)
      state.intro.t = introT(now + Math.min(250, 0.5 * (Q.gpuMs || 0)));
      if (state.intro.t >= 1 || dir.x > 0.02) { if (state.intro.t < 1 && state.intro.speed < 4) introSpeed(4); if (state.intro.t >= 1) state.intro = null; }
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
