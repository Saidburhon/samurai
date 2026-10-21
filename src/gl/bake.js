// One-time bakes at boot (§2.1, §5.4): the prototype's procedural noise rendered once by the same GLSL into
// mipmapped, trilinear, max-anisotropy textures, one per frame (so no frame stalls). RGBA16F where a half or float
// colour buffer is renderable, RGBA8 otherwise. tGirih (the floor light's mask) is a 2D canvas of the hole polygons.
import { WebGLRenderTarget, HalfFloatType, UnsignedByteType, LinearFilter, LinearMipmapLinearFilter, ClampToEdgeWrapping, RepeatWrapping,
  Scene, Mesh, PlaneGeometry, OrthographicCamera, ShaderMaterial, CanvasTexture, NoColorSpace } from 'three';
import BAKE_F from './glsl/bake.frag.glsl';
import QUAD_V from './glsl/quad.vert.glsl';
import { tsubaHoles } from './geom.js';

const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));

export async function bakeAll(renderer, { big = true, onEach, maxAniso = 16 } = {}) {
  const gl = renderer.getContext();
  const half = renderer.extensions.has('EXT_color_buffer_float') || renderer.extensions.has('EXT_color_buffer_half_float');
  const aniso = Math.min(maxAniso, renderer.capabilities.getMaxAnisotropy());
  const scene = new Scene(), cam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new Mesh(new PlaneGeometry(2, 2));
  quad.frustumCulled = false; scene.add(quad);
  const out = {};
  const times = {};
  const job = (name, w, h, define, { mips = true, uniforms = {}, wrapT = ClampToEdgeWrapping } = {}) => async () => {
    const t0 = performance.now();
    const rt = new WebGLRenderTarget(w, h, {
      type: half ? HalfFloatType : UnsignedByteType, depthBuffer: false, stencilBuffer: false,
      generateMipmaps: mips, minFilter: mips ? LinearMipmapLinearFilter : LinearFilter, magFilter: LinearFilter,
      wrapS: ClampToEdgeWrapping, wrapT, anisotropy: mips ? aniso : 1, colorSpace: NoColorSpace,
    });
    quad.material = new ShaderMaterial({ vertexShader: QUAD_V, fragmentShader: BAKE_F, defines: { [define]: '' }, uniforms, depthTest: false, depthWrite: false });
    renderer.setRenderTarget(rt); renderer.render(scene, cam); renderer.setRenderTarget(null);
    // a 1-texel read forces the bake to finish here, so the timing is the bake's (and the next frame stays light)
    const px = new (half ? Uint16Array : Uint8Array)(4);
    try { renderer.readRenderTargetPixels(rt, 0, 0, 1, 1, px); } catch (e) { gl.finish(); }
    quad.material.dispose();
    out[name] = rt.texture;
    times[name] = Math.round(performance.now() - t0);
    if (onEach) onEach(name, times[name]);
  };
  const S = big ? 1 : 0.5;
  const jobs = [
    job('hamon', 4096, 1, 'BAKE_HAMON', { mips: false }),
    job('hada', 4096 * S, 256 * S, 'BAKE_HADA'),
    job('silk', 2048, 512, 'BAKE_SILK', { uniforms: { uDiamonds: { value: 10 } } }),
    job('silkM', 2048, 512, 'BAKE_SILKM', { uniforms: { uDiamonds: { value: 10 } } }),
    job('ishime', 1024, 1024, 'BAKE_ISHIME'),
  ];
  for (let i = 0; i < jobs.length; i++) { await jobs[i](); if (i < jobs.length - 1) await nextFrame(); }
  out.girih = girihTexture(aniso);
  quad.geometry.dispose();
  out.times = times; out.half = half;
  return out;
}

// the girih mask in tsuba face units [-0.41, 0.41]^2 (x across the blade, y the thickness), white = light passes
export function girihTexture(aniso = 1) {
  const N = 1024, c = document.createElement('canvas'); c.width = c.height = N;
  const x = c.getContext('2d');
  x.fillStyle = '#000'; x.fillRect(0, 0, N, N);
  x.fillStyle = '#fff';
  const k = N / 0.82;
  x.beginPath();
  for (const h of tsubaHoles()) { h.forEach(([u, v], i) => { const px = (u + 0.41) * k, py = (v + 0.41) * k; if (i) x.lineTo(px, py); else x.moveTo(px, py); }); x.closePath(); }
  x.fill('evenodd');
  const t = new CanvasTexture(c);
  t.flipY = false; t.generateMipmaps = true; t.minFilter = LinearMipmapLinearFilter; t.magFilter = LinearFilter; t.anisotropy = aniso;
  t.wrapS = t.wrapT = ClampToEdgeWrapping;
  return t;
}
export { RepeatWrapping };
