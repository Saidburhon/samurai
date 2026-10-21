// The GL chunk's entry (§6.2): geometries -> renderer -> meshes (with the baked textures) -> first frame -> glReady ->
// sign atlas. Imported by main.js only in cinema mode (after the intro drawing has finished, or at once with ?beat).
// The bakes (§2.1) are computed on the CPU, in workers that main.js starts as soon as it runs (gl/bakecpu.js): the
// hero's hamon, silk and hada (2048 × 128) have landed long before the gate, so glReady carries them and no stand-in
// is ever on screen (G1 r2). The ishime follows (swapped in as it lands, usually before the gate too); the full-size
// hada replaces the boot one in idle time after the lift (the same field, at twice the resolution). The 1 × 1
// stand-ins remain only for a browser without workers, which bakes on the GPU (bake.js) before glReady.
import { DataTexture, DataUtils, RGBAFormat, HalfFloatType, UnsignedByteType, LinearFilter, LinearMipmapLinearFilter, ClampToEdgeWrapping, NoColorSpace,
  Scene, Mesh, BufferGeometry, Float32BufferAttribute } from 'three';
import { Stage, buildGeometries, buildPart, PART_NAMES } from './stage.js';
import { bakeAll } from './bake.js';
import { bakePool, heroJobs } from './bakecpu.js';

const px = (r, g, b, a) => { const t = new DataTexture(new Uint8Array([r, g, b, a]), 1, 1, RGBAFormat); t.magFilter = t.minFilter = LinearFilter; t.needsUpdate = true; return t; };

// a CPU bake as a texture with the GPU bakes' sampling (bake.js): mipmapped, trilinear, anisotropic; the hamon (a
// 1-D profile) without mips. RGBA16F needs a renderable half-float format for its mipmaps, else it becomes RGBA8.
function dataTex(r, { name, w, h, half, data }, aniso) {
  const ext = r.extensions;
  if (half && !(ext.has('EXT_color_buffer_float') || ext.has('EXT_color_buffer_half_float'))) {
    const q = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) q[i] = Math.round(Math.max(0, Math.min(1, DataUtils.fromHalfFloat(data[i]))) * 255);
    data = q; half = false;
  }
  const mips = name !== 'hamon';
  const t = new DataTexture(data, w, h, RGBAFormat, half ? HalfFloatType : UnsignedByteType);
  t.generateMipmaps = mips; t.minFilter = mips ? LinearMipmapLinearFilter : LinearFilter; t.magFilter = LinearFilter;
  t.anisotropy = mips ? Math.min(aniso, r.capabilities.getMaxAnisotropy()) : 1;
  t.wrapS = t.wrapT = ClampToEdgeWrapping; t.colorSpace = NoColorSpace; t.flipY = false; t.unpackAlignment = 1;
  t.needsUpdate = true;
  return t;
}
// the CPU bakes of a page load (main.js starts them; ?beat: the full set, else the boot set)
export function startBakes(kind, big) {
  try { return typeof Worker === 'function' && typeof Blob === 'function' ? bakePool(heroJobs(kind, big), 3) : null; } catch (e) { return null; }
}

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

// The renderer and the two hero programs, issued as soon as the chunk has arrived (main.js, during the intro
// drawing): a few milliseconds of main-thread work (the context is the head script's, its synchronous reads answered
// from there; compile and link are only issued, nothing waits for them), so the links are done in the GPU process by
// the gate and the first draw there does not wait for them (G1 r2: that wait was 0.1–0.3 s of the boot's critical
// path). boot() calls it itself if main.js has not.
let early = null;
export function precompile({ canvas: el, tier, log = () => {} }) {
  if (early) return early;
  const t0 = performance.now();
  const { canvas, context, fixed } = adopt(el, tier);
  log('adopted', context ? 1 : 0);
  let gp = null;
  if (context && fixed) { gp = context.getParameter; context.getParameter = (p) => (p in fixed ? fixed[p] : gp.call(context, p)); }
  const stage = new Stage(canvas, tier, context);
  if (gp) delete context.getParameter;
  // stand-ins: neutral grain, the hamon at its mean height, a mid silk, a flat ishime (uniform values until the bakes
  // are swapped in before the first draw; only a browser without workers ever draws with them, off screen)
  const T0 = { hada: px(128, 128, 128, 0), hamon: px(179, 0, 0, 255), silk: px(40, 50, 90, 128), ishime: px(128, 128, 128, 128) };
  // Both hero programs (the steel and the fittings, the grip being one of their kinds) are issued on proxies with the
  // meshes' vertex layouts (a program does not depend on its geometry; renderer.compile() on the stage's scene would
  // also issue every hidden part's program: the tang, the lacquer, the floor, the rays' disc). boot() draws them.
  stage.materials(T0);
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
  stage.renderer.compile(two, stage.camera);
  // sent to the GPU process now (a WebGL command buffer is otherwise flushed only by a draw or a synchronous call)
  stage.renderer.getContext().flush();
  log('issued', performance.now());
  early = { stage, canvas, T0, two, ms: performance.now() - t0 };
  return early;
}

export async function boot({ canvas: el, tier, log = () => {}, bakeFirst = true, bakes = null }) {
  const t0 = performance.now();
  const E = precompile({ canvas: el, tier, log });
  const { stage, canvas, T0, two } = E;
  log('stageMs', E.ms);
  const r = stage.renderer;
  const W = canvas.clientWidth || innerWidth, H = canvas.clientHeight || innerHeight;
  const portrait = W / H < 1.2;
  // The baked textures (gl/bakecpu.js: the workers main.js started at ~0.2 s have finished before the gate on any
  // machine measured; a slow one is waited for here). They are in the materials before the first draw: a software
  // renderer builds its pipelines for the formats and samplers it draws with, so proxies drawn with the 1 × 1
  // stand-ins built pipelines the real textures could not use (G1 r2: warm() then built them again, +0.3–0.5 s)
  const big = tier.tier === 3 || (tier.tier === 2 && !portrait);
  let B = null;
  const tex = (d) => { log('bake.' + d.name, d.ms); log('tex.' + d.name, d.at); return dataTex(r, d, tier.aniso); };
  if (bakes) {
    const got = await Promise.all(['hamon', 'silk', 'hada', 'ishime'].map((n) => bakes.get(n)));
    if (got.every(Boolean)) { B = {}; for (const d of got) B[d.name] = tex(d); stage.swapTextures(B); }
    log('bakesIn', performance.now());
  }
  // the proxies drawn at once (a software renderer builds a pipeline at its first draw, from the program, the blend
  // and depth state, the vertex formats and the samplers: not from the geometry): the pipelines are built in the GPU
  // process while this thread builds the geometries; warm() draws the real meshes, which find them built
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
  const opt = { big, maxAniso: tier.aniso, onEach: (n, ms) => log('bake.' + n, ms), wait: () => stage.gpuDone() };
  if (!B && bakeFirst) B = await bakeAll(r, opt);
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
  // without workers (no CPU bakes): the GPU bakes, one per frame, swapped in as they land (main.js runs this before
  // glReady, so the stand-ins are never on screen)
  stage.bake = B ? null : async () => { const T = await bakeAll(r, { ...opt, onEach: (n, ms) => log('bake.' + n, ms) }); stage.swapTextures(T); return T; };
  // the full-size hada, in idle time after the lift (big tiers only): the same field at twice the resolution
  stage.upgrade = async () => {
    if (!big || !bakes) return false;
    const p = startBakes('upgrade', big);
    const d = p && (await p.get('hada'));
    if (!d) return false;
    const old = stage.mat.steelU.tHada.value;
    stage.swapTextures({ hada: tex(d) });
    if (old && old.dispose && old !== stage.mat.steelU.tHada.value) old.dispose();
    return true;
  };
  return { stage, warm };
}
