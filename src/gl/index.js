// The GL chunk's entry (§6.2): geometries -> renderer -> meshes -> first frame -> glReady -> bakes (one per frame) -> sign atlas.
// Imported by main.js only in cinema mode (after the intro drawing has finished, or at once with ?beat).
// On the boot path the first frame is the reveal pose with nothing revealed (§4.1), so it needs no texture: it
// renders with 1 × 1 stand-ins, which keeps the bakes (and their program) off the critical path to glReady; the
// baked textures are swapped in (uniform values, no recompile) before the steel appears.
import { DataTexture, RGBAFormat, LinearFilter } from 'three';
import { Stage, buildGeometries } from './stage.js';
import { bakeAll } from './bake.js';

const px = (r, g, b, a) => { const t = new DataTexture(new Uint8Array([r, g, b, a]), 1, 1, RGBAFormat); t.magFilter = t.minFilter = LinearFilter; t.needsUpdate = true; return t; };

// the context the head script created for its probe (software renderers only, boot/head.js): its canvas takes the
// place of canvas#gl, with the same id, class and attributes
function adopt(canvas, tier) {
  const Q = window.__qilich || {}, keep = Q.glKeep;
  Q.glKeep = null;
  if (!keep) return { canvas, context: undefined };
  if (tier.tier !== 2 || keep.context.isContextLost()) { const l = keep.context.getExtension('WEBGL_lose_context'); if (l) l.loseContext(); return { canvas, context: undefined }; }
  const c = keep.canvas;
  for (const a of canvas.attributes) if (a.name !== 'width' && a.name !== 'height') c.setAttribute(a.name, a.value);
  canvas.replaceWith(c);
  return { canvas: c, context: keep.context };
}

export async function boot({ canvas: el, tier, log = () => {}, bakeFirst = true }) {
  const t0 = performance.now();
  // the geometries first: CPU work that overlaps the GPU process finishing the page's last intro frames (on a
  // software renderer it is busy until about 1.1 s, and the renderer's first GL calls wait for it anyway)
  const geo = buildGeometries();
  log('geo', performance.now() - t0);
  const { canvas, context } = adopt(el, tier);
  log('adopted', context ? 1 : 0); log('adoptMs', performance.now() - t0);
  const stage = new Stage(canvas, tier, context);
  log('stageMs', performance.now() - t0);
  const r = stage.renderer;
  const W = canvas.clientWidth || innerWidth, H = canvas.clientHeight || innerHeight;
  log('renderer', performance.now() - t0);
  const portrait = W / H < 1.2;
  // stand-ins: neutral grain, the hamon at its mean height, a mid silk, a flat ishime
  const T0 = { hada: px(128, 128, 128, 0), hamon: px(179, 0, 0, 255), silk: px(40, 50, 90, 128), ishime: px(128, 128, 128, 128) };
  const opt = { big: tier.tier === 3 || (tier.tier === 2 && !portrait), maxAniso: tier.aniso, onEach: (n, ms) => log('bake.' + n, ms) };
  let B = null;
  if (bakeFirst) B = await bakeAll(r, opt);
  const t1 = performance.now();
  stage.build({ ...T0, ...(B || {}) }, geo);
  stage.setSize(W, H, true);
  log('build', performance.now() - t1);
  // The steel program, the largest, is issued now and not awaited: the GPU process compiles it while the caller
  // puts the first hold in place (CPU work). warm() then compiles the fittings program (the grip is one of its kinds; the oval tubes are
  // indexed, the extruded fittings are not: both layouts of the metal) and makes one round trip (§6.3 prewarm).
  stage.blade.name = 'steel';
  const pw = stage.prewarm([stage.blade], { finish: false });
  const t2 = performance.now();
  const warm = () => {
    Object.assign(pw, stage.prewarm([stage.parts.tsuba, stage.parts.tsuka, stage.parts.fuchi]));
    log('compile', performance.now() - t2);
    if (window.__qilich) window.__qilich.prewarm = pw;
    return pw;
  };
  // the bakes after the first frame (the boot path): one per frame, swapped in as they land
  stage.bake = async () => { const T = await bakeAll(r, opt); stage.swapTextures(T); return T; };
  return { stage, warm };
}
