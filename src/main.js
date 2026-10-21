// The entry: language, mode, the site furniture; in cinema mode the GL chunk (three.js and the sword), imported
// after the intro drawing has finished (or at once for a hold, ?beat). G1: cinema renders holds (core/poster.js);
// the director, the scroll and the transitions arrive at G3.
import { initNav } from './ui/nav.js';
import { initMenu } from './ui/menu.js';
import { initLang } from './ui/lang.js';
import { initContact } from './ui/contact.js';
import { initSound } from './ui/sound.js';
import { initFlow } from './flow/flow.js';
import { chooseTier } from './core/tier.js';

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
  // the GL chunk: fetched at the gate's first check (0.80 s), so its evaluation does not stall the drawing
  let mods = null;
  const load = () => mods || (mods = Promise.all([import('./gl/index.js'), import('./core/poster.js')]).then((m) => { log('fetched', performance.now()); return m; }));
  requestAnimationFrame(() => log('raf1', performance.now()));
  // GL work starts when the drawing's animations have ended, checked from 0.80 s, at most 0.40 s later (§4.1)
  const when = q.has('beat') ? Promise.resolve() : new Promise((res) => {
    const last = [...document.querySelectorAll('#osh-hero path[pathLength], #osh-hero .fill, .osh-labels .ol')].pop();
    let done = false; const go = () => { if (!done) { done = true; res(); } };
    const at = Math.max(0, (+q.get('gate') || 800) - performance.now());
    const busy = () => (document.getAnimations ? document.getAnimations().some((a) => a.playState === 'running' && a.effect && a.effect.target && a.effect.target.closest && a.effect.target.closest('#osh-paper')) : false);
    // (polled: the last element in the list is not always the last to finish)
    const t0 = performance.now() + at;
    const check = () => {
      const b = !!(html.classList.contains('intro') && last && busy());
      if (!Q.timing.gate) { load(); log('gate', performance.now()); log('gateBusy', b ? 1 : 0); }
      if (!b || performance.now() - t0 > 400) go(); else setTimeout(check, 40);
    };
    setTimeout(check, at);
  });
  when.then(async () => {
    log('import', performance.now());
    // the grain holds still while the programs compile: its re-composites share the GPU process with them
    html.classList.add('gl-boot');
    const [{ boot }, poster] = await load();
    log('imported', performance.now());
    // wait for the cinema stylesheet (app_css loads without blocking the first paint)
    for (let i = 0; i < 200 && !getComputedStyle(html).getPropertyValue('--cinema-css'); i++) await new Promise((r) => setTimeout(r, 15));
    const canvas = document.getElementById('gl');
    const { stage } = await boot({ canvas, tier, log, bakeFirst: q.has('beat') || q.has('bakefirst') });
    Q.stage = stage;
    if (q.has('beat')) {
      await poster.runPoster(stage, log);
      Q.glReady = true; log('glReady', performance.now()); html.classList.remove('gl-boot');
    } else {
      // the boot path (G2 animates from here): the first frame at the reveal pose with nothing revealed yet
      const p = new poster.Poster(stage);
      let t = performance.now();
      await p.apply('intro', { reveal: 0 });
      log('apply', performance.now() - t); t = performance.now();
      // dev: ?prewarm splits the first frame into each program's first draw (1 x 1 scissor) and the frame itself
      if (q.has('prewarm')) { stage.blade.name = 'steel'; Q.prewarm = stage.prewarm([stage.blade, stage.parts.tsuba, stage.parts.tsuka]); if (q.get('prewarm') === '2') Q.prewarm2 = stage.prewarm([stage.blade]); log('prewarm', performance.now() - t); t = performance.now(); }
      p.render(); stage.finish();
      log('frame1', performance.now() - t);
      Q.glReady = true; log('glReady', performance.now()); html.classList.remove('gl-boot');
      await stage.bake(); log('baked', performance.now());
    }
  }).catch((e) => { Q.glError = String(e && e.stack || e); console.error(e); }).finally(() => html.classList.remove('gl-boot'));
}
