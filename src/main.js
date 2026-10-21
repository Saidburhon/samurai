// The entry: language, mode, the site furniture; in cinema mode the GL chunk (three.js and the sword), imported
// after the intro drawing has finished (or at once for a hold, ?beat). G3: once GL is ready the film runs (core/film.js:
// the director, the state function, the freezes); ?beat freezes it on a beat (?beat=x&poster=1: G1's hold renderer).
import { initNav } from './ui/nav.js';
import { initMenu } from './ui/menu.js';
import { initLang } from './ui/lang.js';
import { initContact } from './ui/contact.js';
import { initSound } from './ui/sound.js';
import { initFlow } from './flow/flow.js';
import { chooseTier } from './core/tier.js';
import { bakePool, heroJobs } from './gl/bakecpu.js';

const html = document.documentElement;
const Q = window.__qilich || (window.__qilich = {});
Q.lang = html.lang;
Q.mode = html.classList.contains('cinema') ? 'cinema' : 'flow';

initMenu();
initLang();
initContact();
initSound();
if (Q.mode === 'flow') { initNav(); initFlow(); }
else startCinema();

function startCinema() {
  const q = new URLSearchParams(location.search);
  Q.timing = {};
  const log = (k, ms) => { Q.timing[k] = Math.round(ms); };
  log('main', performance.now());
  const tier = chooseTier(q);
  Q.tier = tier.tier; Q.sw = tier.sw; Q.renderer = tier.renderer;
  // The bakes (§2.1) start now, in three workers (gl/bakecpu.js): CPU work off the main thread and off the GPU
  // process, finished before the gate on any machine that can run the film, so glReady carries the hero's real
  // textures and no stand-in is ever on screen (G1 r2). ?beat (a hold) bakes the full set.
  const big = tier.tier === 3 || (tier.tier === 2 && innerWidth / innerHeight >= 1.2);
  let bakes = null;
  try { if (typeof Worker === 'function' && !q.has('gpubake')) bakes = bakePool(heroJobs(q.has('beat') ? 'full' : 'boot', big), 3); } catch (e) { bakes = null; }
  log('bakeStart', performance.now());
  // The GL chunk (three.js and the sword, ~150 KB gz) is requested now, in cinema mode only, so the network has the
  // whole drawing to bring it (the build does not modulepreload it: flow-mode phones must not pay for it, Addendum 2);
  // evaluating its modules is only class definitions. Nothing GL runs before the gate below (0.80 s).
  let mods = null;
  const load = () => mods || (mods = Promise.all([import('./gl/index.js'), import('./core/poster.js'), import('./core/film.js')]).then((m) => { log('fetched', performance.now()); return m; }));
  if (!q.has('beat')) setTimeout(() => load().then(([gl]) => gl.prebuild()), 0);
  requestAnimationFrame(() => log('raf1', performance.now()));
  // GL work starts when the drawing's animations have ended, checked from 0.80 s, at most 0.40 s later (§4.1).
  // "Ended" is read from their scheduled end on the document timeline, not from their play state: a software
  // renderer runs few frames here, so the play state lags the clock by up to a frame (~0.2 s).
  const when = q.has('beat') ? Promise.resolve() : new Promise((res) => {
    const at = Math.max(0, (+q.get('gate') || 800) - performance.now());
    const lastEnd = () => {
      if (!html.classList.contains('intro') || !document.getAnimations) return 0;
      let end = 0;
      for (const a of document.getAnimations()) {
        const el = a.effect && a.effect.target;
        if (!el || !el.closest || !el.closest('#osh-paper')) continue;
        const t = a.effect.getComputedTiming().endTime;
        if (Number.isFinite(t)) end = Math.max(end, (a.startTime == null ? performance.now() : +a.startTime) + t);
      }
      return end;
    };
    setTimeout(() => {
      load();
      const now = performance.now(), wait = Math.max(0, Math.min(lastEnd() - now, 400));
      log('gate', now); log('gateBusy', wait > 0 ? 1 : 0);
      setTimeout(res, wait);
    }, at);
  });
  when.then(async () => {
    log('import', performance.now());
    // the grain holds still while the programs compile: its re-composites share the GPU process with them
    html.classList.add('gl-boot');
    // on the boot path the canvas stays out of the page until glReady: the prewarm draws then never ask the
    // compositor for a frame of it (a software composite of the whole page, in the GPU process, between the programs)
    if (!q.has('beat')) html.classList.add('gl-warm');
    const [{ boot }, poster, filmM] = await load();
    log('imported', performance.now());
    // wait for the cinema stylesheet (app_css loads without blocking the first paint)
    for (let i = 0; i < 200 && !getComputedStyle(html).getPropertyValue('--cinema-css'); i++) await new Promise((r) => setTimeout(r, 15));
    const canvas = document.getElementById('gl');
    const { stage, warm } = await boot({ canvas, tier, log, bakeFirst: q.has('beat') || q.has('bakefirst'), bakes });
    Q.stage = stage;
    if (q.has('beat')) {
      await warm();
      if (q.has('poster')) await poster.runPoster(stage, log);
      else await filmM.holdFilm({ stage, log, q });
      Q.glReady = true; log('glReady', performance.now()); html.classList.remove('gl-boot');
    } else {
      // the boot path (G2 animates from here): the first frame at the reveal pose with nothing revealed yet
      const p = new poster.Poster(stage);
      let t = performance.now();
      // the GL state of the reveal's first frame, while the GPU process works through the raster and the two programs;
      // the page's part (the drawing refined to the camera's similarity) follows glReady, so no page raster queues
      // in the GPU process in front of the programs
      await p.apply('intro', { reveal: 0, dom: false });
      log('apply', performance.now() - t);
      // (a browser without workers bakes on the GPU here, before glReady: the stand-ins are never on screen)
      if (stage.bake) { await stage.bake(); log('baked', performance.now()); }
      await warm(); t = performance.now();
      // the first frame (nothing revealed yet: a clear) is issued, not awaited: the programs it needs are built
      p.render(); if (q.has('rp')) stage.finish();
      log('frame1', performance.now() - t);
      // the drawing takes the camera's similarity (§4.1: part of glReady). Until now it lay on its diagonal by the
      // build's own CSS (cinema.css waits for html.osh-set), so this moves it by at most a pixel or two
      if (p.applyDom) p.applyDom();
      Q.glReady = true; log('glReady', performance.now()); html.classList.remove('gl-boot', 'gl-warm');
      // the film takes over: the reveal and the lift, then the scroll (G3)
      const F = filmM.startFilm({ stage, log, q, intro: html.classList.contains('intro'), glReady: performance.now() });
      // Idle work from 6.2 s, one item per idle period (never during the reveal or the lift, §6.3), before any later
      // scene can be reached: the word atlas, the full-size hada (big tiers), then the programs of the later scenes
      // (the full guard, the tang, the lacquer, the floor, the two other steel programs). A prewarm draws into the
      // default framebuffer, which is not preserved: the film's frame is drawn again in the same task, so the frame
      // that reaches the screen is always the whole film, never a cleared canvas (G1 r2).
      const ric = window.requestIdleCallback || ((f) => setTimeout(f, 50));
      const redraw = () => { F.film.dirty = true; F.frame(performance.now(), true); };
      setTimeout(() => {
        const M = stage.mat, P = stage.parts;
        const queue = [
          async () => { await stage.atlas(); log('atlas', performance.now()); },
          async () => { if (await stage.upgrade()) { F.film.dirty = true; log('hadaFull', performance.now()); } },
          ...[[P.tsuba, M.ironFull], [stage.nakagoMesh, null], [stage.saya, null], [stage.kurikata, null], [stage.floor, null], [stage.blade, M.steelSign], [stage.blade, M.steelTogi]].map(([mesh, mat]) => async () => {
            const t0 = performance.now();
            stage.prewarm([mesh], { finish: false, material: mat });
            redraw();
            await stage.gpuDone();
            log('pw.' + ((mat && mat.defines && Object.keys(mat.defines).join('+')) || mesh.name || 'mesh'), performance.now() - t0);
          }),
        ];
        const step = async () => {
          try { await queue.shift()(); } catch (e) { Q.idleError = String(e && e.stack || e); }
          if (queue.length) ric(step); else log('prewarmed', performance.now());
        };
        ric(step);
      }, Math.max(0, 6200 - performance.now()));
    }
  }).catch((e) => { Q.glError = String(e && e.stack || e); console.error(e); }).finally(() => html.classList.remove('gl-boot', 'gl-warm'));
}
