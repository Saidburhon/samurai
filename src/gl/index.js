// The GL chunk's entry (§6.2): geometries -> renderer -> meshes -> first frame -> glReady -> bakes (one per frame) -> sign atlas.
// Imported by main.js only in cinema mode (after the intro drawing has finished, or at once with ?beat).
// On the boot path the first frame is the reveal pose with nothing revealed (§4.1), so it needs no texture: it
// renders with 1 × 1 stand-ins, which keeps the bakes (and their program) off the critical path to glReady; the
// baked textures are swapped in (uniform values, no recompile) before the steel appears.
import { DataTexture, RGBAFormat, LinearFilter, Scene, Mesh } from 'three';
import { Stage, buildGeometries, buildPart, PART_NAMES } from './stage.js';
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

// The geometries, built one part per idle period while the intro drawing runs (main.js calls this as soon as the
// chunk has arrived): about 150 ms of CPU that would otherwise sit on the GL boot's critical path. Idle callbacks
// never delay a frame of the drawing; at the gate boot() builds whatever is still missing.
const pre = {};
export function prebuild() {
  const ric = window.requestIdleCallback;
  if (!ric) return;
  // one part per idle callback, the light ones only (the blade ~40 ms cold in software, the rest under 15 ms); the
  // girih tsuba (~50–90 ms: its holes are triangulated) waits for the gate, where it overlaps the GPU's busy time
  const names = PART_NAMES.filter((n) => !['tsuba', 'nakago', 'saya', 'kurikata'].includes(n));
  const step = () => { const n = names.shift(); if (!pre[n]) pre[n] = buildPart(n); if (names.length) ric(step); };
  ric(step);
}

export async function boot({ canvas: el, tier, log = () => {}, bakeFirst = true }) {
  const t0 = performance.now();
  // the geometries the idle time has not built yet: CPU work that overlaps the GPU process finishing the page's
  // last intro frames (on a software renderer it is busy until about 1.0 s; the renderer's first GL calls wait)
  log('prebuilt', Object.keys(pre).length);
  const geo = buildGeometries(pre);
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
  const opt = { big: tier.tier === 3 || (tier.tier === 2 && !portrait), maxAniso: tier.aniso, onEach: (n, ms) => log('bake.' + n, ms), wait: () => stage.gpuDone() };
  let B = null;
  if (bakeFirst) B = await bakeAll(r, opt);
  const t1 = performance.now();
  stage.build({ ...T0, ...(B || {}) }, geo);
  stage.setSize(W, H, true);
  log('build', performance.now() - t1);
  // Both hero programs (the steel and the fittings, the grip being one of their kinds) are issued now: compile and
  // link are asynchronous, so they queue in the GPU process behind the intro's last raster while the main thread puts
  // the first hold in place. Nothing on this path waits for the GPU (three's first use of a program waits for its link,
  // warm() for the pipelines), and no call here reads a pixel back: the boot path never stalls the GPU process.
  stage.blade.name = 'steel';
  // (renderer.compile() on the stage's scene would also issue every hidden part's program: the tang, the lacquer, the
  // floor, the rays' disc; a scene of stand-ins issues exactly the two)
  const two = new Scene();
  for (const m of [stage.blade, stage.parts.tsuba]) { const k = new Mesh(m.geometry, m.material); k.frustumCulled = false; two.add(k); }
  r.compile(two, stage.camera);
  log('issued', performance.now() - t0);
  // warm(): one 1 × 1 scissored draw of each hero program (§6.3 prewarm: a software renderer builds the real pipeline
  // only at the first draw), then a fence; resolves when the GPU has built them
  const warm = async () => {
    const t2 = performance.now();
    const pw = stage.prewarm([stage.blade, stage.parts.tsuba, stage.parts.tsuka, stage.parts.fuchi], { finish: false });
    log('drawn', performance.now() - t2);
    if (/[?&]rp\b/.test(location.search)) stage.finish(); else await stage.gpuDone();
    log('compile', performance.now() - t2);
    if (window.__qilich) window.__qilich.prewarm = pw;
    return pw;
  };
  // the bakes after the first frame (the boot path): one per frame, swapped in as they land
  stage.bake = async () => { const T = await bakeAll(r, opt); stage.swapTextures(T); return T; };
  return { stage, warm };
}
