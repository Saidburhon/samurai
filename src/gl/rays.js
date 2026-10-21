// The backlight behind the tsuba (§2.5): a warm lamp disc on the grip side, seen through the girih, and the rays it
// streams through every hole: an occluder pass (every sword mesh black, the disc lit) into a half-resolution target,
// then a radial blur from the disc's screen point, added over the frame. Rendered only inside a hold window.
import { Mesh, CircleGeometry, ShaderMaterial, Group, Vector2, Vector3, WebGLRenderTarget, HalfFloatType, UnsignedByteType, MeshBasicMaterial,
  DoubleSide, Scene, PlaneGeometry, OrthographicCamera } from 'three';
import { SRC, BLEND_ADD } from './materials.js';

export class Rays {
  constructor(renderer, handleGroup, { radius = 0.335, x = -1.15, color = [2.1, 1.42, 0.70] } = {}) {
    this.r = renderer;
    this.discU = { uCol: { value: new Vector3(...color) }, uR: { value: radius } };
    this.disc = new Mesh(new CircleGeometry(radius, 96), new ShaderMaterial({ vertexShader: SRC.DISC_V, fragmentShader: SRC.DISC_F, uniforms: this.discU }));
    this.disc.rotation.y = Math.PI / 2; // face +x (towards the blade and the camera)
    this.disc.position.set(x, 0, 0);
    handleGroup.add(this.disc);
    this.disc.visible = false;
    const half = renderer.extensions.has('EXT_color_buffer_float') || renderer.extensions.has('EXT_color_buffer_half_float');
    this.rt = new WebGLRenderTarget(4, 4, { type: half ? HalfFloatType : UnsignedByteType, generateMipmaps: false });
    // the blur itself runs at the occluder's resolution and is composited with one bilinear sample
    this.rtBlur = new WebGLRenderTarget(4, 4, { type: half ? HalfFloatType : UnsignedByteType, generateMipmaps: false, depthBuffer: false });
    this.black = new MeshBasicMaterial({ color: 0x000000, side: DoubleSide });
    // 56 -> 30 samples: the per-sample decay and weight are rescaled so the rays keep the prototype's length and energy
    // (G1 r2: 40 samples at a third of the buffer were half of B14's hold frame, ~120 ms in software)
    const n = 30, d56 = 0.935, w56 = 0.034, d = Math.pow(d56, 56 / n), w = w56 * (1 - Math.pow(d56, 56)) / (1 - d56) * (1 - d) / (1 - Math.pow(d, n));
    this.U = { tOcc: { value: this.rt.texture }, uLight: { value: new Vector2(0.5, 0.5) }, uDecay: { value: d }, uWeight: { value: w }, uDensity: { value: 0.42 }, uExp: { value: 0.30 } };
    this.mat = new ShaderMaterial({ vertexShader: SRC.QUAD_V, fragmentShader: SRC.RAYS_F, uniforms: this.U, depthTest: false, depthWrite: false });
    this.scene = new Scene();
    const q = new Mesh(new PlaneGeometry(2, 2), this.mat); q.frustumCulled = false; this.scene.add(q);
    this.comp = new Scene();
    const c = new Mesh(new PlaneGeometry(2, 2), new ShaderMaterial({ vertexShader: SRC.QUAD_V, fragmentShader: 'uniform sampler2D tSrc; varying vec2 vUv; void main(){ gl_FragColor = texture2D(tSrc, vUv);\n#include <colorspace_fragment>\n}', uniforms: { tSrc: { value: this.rtBlur.texture } }, depthTest: false, depthWrite: false, transparent: true, ...BLEND_ADD }));
    c.frustumCulled = false; this.comp.add(c);
    this.cam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.on = false; this.ready = false;
  }
  setSize(bw, bh, scale = 0.5) { const w = Math.max(4, Math.round(bw * scale)), h = Math.max(4, Math.round(bh * scale)); if (this.rt.width !== w || this.rt.height !== h) { this.rt.setSize(w, h); this.rtBlur.setSize(w, h); } }
  // the occluder pass: called by the stage before its main render
  occlude(scene, camera, swordRoot, hide = []) {
    const r = this.r, saved = [];
    swordRoot.traverse((o) => { if (o.isMesh && o !== this.disc) { saved.push([o, o.material]); o.material = this.black; } });
    const hv = hide.map((o) => [o, o.visible]); for (const [o] of hv) o.visible = false;
    r.setRenderTarget(this.rt); r.setClearColor(0x000000, 0); r.clear(); r.render(scene, camera); r.setRenderTarget(null);
    for (const [o, m] of saved) o.material = m;
    for (const [o, v] of hv) o.visible = v;
    const lp = this.disc.getWorldPosition(new Vector3()).project(camera);
    this.U.uLight.value.set(lp.x * 0.5 + 0.5, lp.y * 0.5 + 0.5);
  }
  draw() {
    const r = this.r;
    r.setRenderTarget(this.rtBlur); r.setClearColor(0x000000, 0); r.clear(); r.render(this.scene, this.cam); r.setRenderTarget(null);
    r.render(this.comp, this.cam);
    this.ready = true;
  }
}
export { Group };
