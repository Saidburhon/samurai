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
  const tier = chooseTier(q);
  Q.tier = tier.tier; Q.sw = tier.sw; Q.renderer = tier.renderer;
  // the GL chunk is imported on the drawing's last animationend, or at 0.80 s, whichever is later (§4.1)
  const when = q.has('beat') ? Promise.resolve() : new Promise((res) => {
    const last = [...document.querySelectorAll('#osh-hero path[pathLength], #osh-hero .fill, .osh-labels .ol')].pop();
    let done = false; const go = () => { if (!done) { done = true; res(); } };
    const at = Math.max(0, 800 - performance.now());
    setTimeout(() => { if (!html.classList.contains('intro') || !last) go(); else { last.addEventListener('animationend', go, { once: true }); setTimeout(go, 400); } }, at);
  });
  when.then(async () => {
    log('import', performance.now());
    const [{ boot }, poster] = await Promise.all([import('./gl/index.js'), import('./core/poster.js')]);
    log('imported', performance.now());
    // wait for the cinema stylesheet (app_css loads without blocking the first paint)
    for (let i = 0; i < 200 && !getComputedStyle(html).getPropertyValue('--cinema-css'); i++) await new Promise((r) => setTimeout(r, 15));
    const canvas = document.getElementById('gl');
    const { stage } = await boot({ canvas, tier, log });
    Q.stage = stage;
    if (q.has('beat')) {
      await poster.runPoster(stage, log);
      Q.glReady = true; log('glReady', performance.now());
    } else {
      // the boot path (G2 animates from here): the first frame at the reveal pose with nothing revealed yet
      const p = new poster.Poster(stage);
      await p.apply('intro', { reveal: 0 });
      p.render(); stage.finish();
      Q.glReady = true; log('glReady', performance.now());
    }
  }).catch((e) => { Q.glError = String(e && e.stack || e); console.error(e); });
}
