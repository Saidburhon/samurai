// The GL chunk's entry (§6.2): renderer -> bakes (one per frame) -> meshes -> compile -> first frame -> glReady.
// Imported by main.js only in cinema mode (after the intro drawing has finished, or at once with ?beat).
import { Stage } from './stage.js';
import { bakeAll } from './bake.js';
import { wordAtlas } from './sign.js';

const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));

export async function boot({ canvas, tier, log = () => {} }) {
  const t0 = performance.now();
  const stage = new Stage(canvas, tier);
  const r = stage.renderer;
  const W = canvas.clientWidth || innerWidth, H = canvas.clientHeight || innerHeight;
  log('renderer', performance.now() - t0);
  const portrait = W / H < 1.2;
  const T = await bakeAll(r, { big: tier.tier === 3 || (tier.tier === 2 && !portrait), maxAniso: tier.aniso, onEach: (n, ms) => log('bake.' + n, ms) });
  await nextFrame();
  const t1 = performance.now();
  stage.build(T);
  stage.setSize(W, H, true);
  log('build', performance.now() - t1);
  // the sign atlas waits for its two faces; it is not needed for the hero
  stage.atlas = wordAtlas(r).then((t) => { stage.mat.steelU.uWords.value = t; return t; });
  return { stage, bakeTimes: T.times, half: T.half };
}
