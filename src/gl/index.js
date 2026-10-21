// The GL chunk's entry (§6.2): geometries -> renderer -> meshes -> first frame -> glReady -> bakes (one per frame) -> sign atlas.
// Imported by main.js only in cinema mode (after the intro drawing has finished, or at once with ?beat).
// On the boot path the first frame is the reveal pose with nothing revealed (§4.1), so it needs no texture: it
// renders with 1 × 1 stand-ins, which keeps the bakes (and their program) off the critical path to glReady; the
// baked textures are swapped in (uniform values, no recompile) before the steel appears.
import { DataTexture, RGBAFormat, LinearFilter, Scene, Mesh, BufferGeometry, Float32BufferAttribute } from 'three';
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
  return { canvas: c, context: keep.context, fixed: keep.fixed };
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
  // The order of the GL boot (§4.1, G1): the renderer and the two hero programs first, then the geometries. Nothing
  // here waits for the GPU process, which is still rastering the intro's last frames: the renderer's few synchronous
  // reads of the fresh context are answered from the head script's (fixed below), and compile and link are
  // asynchronous. So the links, and ANGLE's pipeline warm-up on its worker threads, run while the main thread builds
  // the geometries (~0.1 s of CPU), instead of after it.
  const { canvas, context, fixed } = adopt(el, tier);
  log('adopted', context ? 1 : 0); log('adoptMs', performance.now() - t0);
  let gp = null;
  if (context && fixed) { gp = context.getParameter; context.getParameter = (p) => (p in fixed ? fixed[p] : gp.call(context, p)); }
  const stage = new Stage(canvas, tier, context);
  if (gp) delete context.getParameter;
  log('stageMs', performance.now() - t0);
  const r = stage.renderer;
  const W = canvas.clientWidth || innerWidth, H = canvas.clientHeight || innerHeight;
  const portrait = W / H < 1.2;
  // stand-ins: neutral grain, the hamon at its mean height, a mid silk, a flat ishime
  const T0 = { hada: px(128, 128, 128, 0), hamon: px(179, 0, 0, 255), silk: px(40, 50, 90, 128), ishime: px(128, 128, 128, 128) };
  // Both hero programs (the steel and the fittings, the grip being one of their kinds) are issued now, on stand-in
  // meshes (a program does not depend on its geometry): renderer.compile() on the stage's scene would also issue every
  // hidden part's program (the tang, the lacquer, the floor, the rays' disc)
  stage.materials(T0);
  // ... and drawn at once, on proxies with the meshes' vertex layouts (a software renderer builds a pipeline at its first
  // draw, from the program, the blend and depth state and the vertex formats: not from the geometry): the pipelines
  // are then built on the renderer's own thread while the GPU process's main thread finishes the intro's raster and
  // this thread builds the geometries; warm() draws the real meshes, which find them built
  const proxy = (attrs, indexed) => {
    const g = new BufferGeometry();
    for (const [n, k] of attrs) g.setAttribute(n, new Float32BufferAttribute(new Float32Array(3 * k), k));
    if (indexed) g.setIndex([0, 1, 2]);
    return g;
  };
  const SWORD = [['position', 3], ['normal', 3], ['uv', 2], ['aAxial', 1]];
  const two = new Scene();
  const add = (g, m) => { const k = new Mesh(g, m); k.frustumCulled = false; two.add(k); };
  add(proxy([...SWORD, ['aRegion', 1], ['aMune', 3], ['aHa', 3]]), stage.mat.steel);
  add(proxy(SWORD), stage.mat.iron);           // the extruded fittings (not indexed)
  add(proxy(SWORD, true), stage.mat.silk);     // the oval tubes (indexed)
  r.compile(two, stage.camera);
  log('issued', performance.now() - t0);
  r.setRenderTarget(null); r.setScissorTest(true); r.setScissor(0, 0, 1, 1);
  r.render(two, stage.camera);
  r.setScissorTest(false);
  log('proxied', performance.now() - t0);
  // dev (?pxwait=ms): let the proxies' pipelines finish before warm(), to see whether the real draws find them built
  const pxw = +(new URLSearchParams(location.search).get('pxwait') || 0);
  if (pxw) { await stage.gpuDone(); await new Promise((res) => setTimeout(res, pxw)); log('pxdone', performance.now() - t0); }
  // the geometries the idle time has not built yet (gl/index.js prebuild): CPU work while the GPU process links
  log('prebuilt', Object.keys(pre).length);
  const geo = buildGeometries(pre);
  log('geo', performance.now() - t0);
  const opt = { big: tier.tier === 3 || (tier.tier === 2 && !portrait), maxAniso: tier.aniso, onEach: (n, ms) => log('bake.' + n, ms), wait: () => stage.gpuDone() };
  let B = null;
  if (bakeFirst) B = await bakeAll(r, opt);
  const t1 = performance.now();
  stage.build({ ...T0, ...(B || {}) }, geo);
  stage.setSize(W, H, true);
  stage.blade.name = 'steel';
  log('build', performance.now() - t1);
  // warm(): one 1 × 1 scissored draw of each hero program (§6.3 prewarm: a software renderer builds the real pipeline
  // only at the first draw), then a fence; resolves when the GPU has built them
  const warm = async () => {
    const t2 = performance.now();
    // dev: ?rp waits with a read-back instead of a fence; ?split times the steel and the fittings apart
    const q = location.search, wait = () => (/[?&]rp\b/.test(q) ? Promise.resolve(stage.finish()) : stage.gpuDone());
    let pw;
    if (/[?&]split\b/.test(q)) {
      pw = stage.prewarm([stage.blade], { finish: false }); await wait(); log('steelJit', performance.now() - t2);
      const t3 = performance.now();
      Object.assign(pw, stage.prewarm([stage.parts.tsuba, stage.parts.tsuka, stage.parts.fuchi], { finish: false })); await wait(); log('metalJit', performance.now() - t3);
    } else {
      pw = stage.prewarm([stage.blade, stage.parts.tsuba, stage.parts.tsuka, stage.parts.fuchi], { finish: false });
      log('drawn', performance.now() - t2);
      await wait();
    }
    log('compile', performance.now() - t2);
    if (window.__qilich) window.__qilich.prewarm = pw;
    return pw;
  };
  // the bakes after the first frame (the boot path): one per frame, swapped in as they land
  stage.bake = async () => { const T = await bakeAll(r, opt); stage.swapTextures(T); return T; };
  return { stage, warm };
}
