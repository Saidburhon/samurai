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
    const [{ boot }, poster] = await load();
    log('imported', performance.now());
    // wait for the cinema stylesheet (app_css loads without blocking the first paint)
    for (let i = 0; i < 200 && !getComputedStyle(html).getPropertyValue('--cinema-css'); i++) await new Promise((r) => setTimeout(r, 15));
    const canvas = document.getElementById('gl');
    const { stage, warm } = await boot({ canvas, tier, log, bakeFirst: q.has('beat') || q.has('bakefirst') });
    Q.stage = stage;
    if (q.has('beat')) {
      warm();
      await poster.runPoster(stage, log);
      Q.glReady = true; log('glReady', performance.now()); html.classList.remove('gl-boot');
    } else {
      // the boot path (G2 animates from here): the first frame at the reveal pose with nothing revealed yet
      const p = new poster.Poster(stage);
      let t = performance.now();
      await p.apply('intro', { reveal: 0 });   // while the GPU process compiles the steel
      log('apply', performance.now() - t);
      warm(); t = performance.now();
      p.render(); stage.finish();
      log('frame1', performance.now() - t);
      Q.glReady = true; log('glReady', performance.now()); html.classList.remove('gl-boot');
      await stage.bake(); log('baked', performance.now());
      stage.atlas().then(() => log('atlas', performance.now()));
    }
  }).catch((e) => { Q.glError = String(e && e.stack || e); console.error(e); }).finally(() => html.classList.remove('gl-boot'));
}
