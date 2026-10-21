// The soft pass (§2.1): the analytic contact shadow (and, from G1b, the heat glow) drawn into a quarter-resolution
// target on a quad oriented along the sword's footprint on the paper, re-rendered only when the pose or the light
// changes, and composited onto the canvas with one bilinear sample before the sword is drawn.
import { WebGLRenderTarget, Scene, Mesh, BufferGeometry, Float32BufferAttribute, ShaderMaterial, Vector3, Vector4, PlaneGeometry,
  OrthographicCamera, HalfFloatType, UnsignedByteType, LinearFilter, DoubleSide, Vector2 } from 'three';
import * as G from '../sword/geom-core.js';
import { axialOf } from './geom.js';
import { SRC, BLEND_PREMUL } from './materials.js';

export class SoftPass {
  constructor(renderer) {
    this.r = renderer;
    this.U = { uSeg: { value: Array.from({ length: 72 }, () => new Vector4(0, 0, -1, 0)) }, uN: { value: 0 }, uShadowCol: { value: new Vector3(0.16, 0.13, 0.10) }, uOpacity: { value: 0.68 } };
    this.geo = new BufferGeometry();
    this.geo.setAttribute('position', new Float32BufferAttribute(new Float32Array(12), 3));
    this.geo.setIndex([0, 1, 2, 0, 2, 3]);
    this.quad = new Mesh(this.geo, new ShaderMaterial({ vertexShader: SRC.PLANE_V, fragmentShader: SRC.SHADOW_F, uniforms: this.U, depthTest: false, depthWrite: false, transparent: false, side: DoubleSide }));
    this.quad.frustumCulled = false;
    this.scene = new Scene(); this.scene.add(this.quad);
    const half = renderer.extensions.has('EXT_color_buffer_float') || renderer.extensions.has('EXT_color_buffer_half_float');
    this.rt = new WebGLRenderTarget(4, 4, { type: half ? HalfFloatType : UnsignedByteType, depthBuffer: false, minFilter: LinearFilter, magFilter: LinearFilter, generateMipmaps: false });
    // the composite touches only the footprint: the same oriented quad, sampling the target in screen space
    this.compU = { tSrc: { value: this.rt.texture }, uRes: { value: new Vector2(1, 1) } };
    this.comp = new Mesh(this.geo, new ShaderMaterial({ vertexShader: SRC.PLANE_V, fragmentShader: 'uniform sampler2D tSrc; uniform vec2 uRes; void main(){ gl_FragColor = texture2D(tSrc, gl_FragCoord.xy / uRes); }', uniforms: this.compU, depthTest: false, depthWrite: false, transparent: true, side: DoubleSide, ...BLEND_PREMUL }));
    this.comp.frustumCulled = false;
    this.compScene = new Scene(); this.compScene.add(this.comp);
    this.cam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.key = ''; this.on = false;
  }
  // segments from the posed sword: light = direction towards the light (world); stage gives world() / worldH()
  update(stage, light, { soft = 0.14, base = 0.02, col, alpha, reveal = 2 } = {}) {
    const L = light.clone().normalize();
    const segs = [];
    const proj = (P) => { const t = P.y / L.y; return [P.x - L.x * t, P.z - L.z * t, P.y]; };
    const roll = stage.pose.roll, sigma = stage.pose.sori;
    const push = (P, hw) => { const [x, z, y] = proj(P); segs.push([x, z, hw, base + Math.max(0, y) * soft]); };
    // during the reveal only the steel casts a shadow: the samples stop at the front (ink casts nothing)
    const shown = (x, z) => axialOf(x, z) <= reveal;
    for (let i = 0; i <= 40; i++) {
      const s = Math.pow(i / 40, 0.85), w = G.width(s), k = G.thick(s);
      const c = G.bladePoint(s, 0, 0.5, sigma);
      if (!shown(c[0], c[2])) { if (i < 2) { segs.length = 0; } break; }
      const hw = 0.5 * (w * Math.abs(Math.cos(roll)) + k * Math.abs(Math.sin(roll)));
      push(stage.world(new Vector3(c[0], 0, c[2])), hw);
    }
    const nBlade = segs.length;
    if (stage.vis.koshirae) {
      segs.push(null);
      const tx = (G.H.tsuba[0] + G.H.tsuba[1]) / 2, tsH = G.TSUBA_R;
      const hShown = (x) => { const q = G.hp2(x, 0, sigma); return shown(q[0], q[1]); };
      if (hShown(tx)) { push(stage.worldH(new Vector3(tx - 0.02, 0, 0)), tsH * 0.92); push(stage.worldH(new Vector3(tx + 0.02, 0, 0)), tsH * 0.92); }
      segs.push(null);
      for (const x of [0.035, -0.30, -0.38, -0.43, -1.0, -1.7, -2.4, -2.93, -3.02]) {
        if (!hShown(x)) continue;
        const rz = x > -0.31 ? 0.19 : 0.165, ry = x > -0.31 ? 0.06 : 0.125;
        const hw = rz * Math.abs(Math.cos(roll)) + ry * Math.abs(Math.sin(roll));
        push(stage.worldH(new Vector3(x, 0, 0)), x < -2.95 ? hw * 0.8 : hw);
      }
    } else if (stage.vis.nakago) {
      segs.push(null);
      for (const x of [0.0, -0.6, -1.2, -1.8, -2.0]) push(stage.worldH(new Vector3(x, 0, 0)), 0.5 * G.B.w0 * (1 - 0.38 * (-x / 2)));
    }
    const arr = this.U.uSeg.value;
    let n = 0, x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    // the footprint, in the frame of the sword's projected axis (an oriented quad, §2.1)
    const pts = segs.filter(Boolean);
    if (pts.length < 2) { this.U.uN.value = 0; this.empty = true; this.dirty = true; return; }
    this.empty = false;
    const a = pts[0], b = pts[Math.max(1, nBlade - 1)] || pts[pts.length - 1];
    let ax = b[0] - a[0], az = b[1] - a[1]; const al = Math.hypot(ax, az) || 1; ax /= al; az /= al;
    for (const sg of segs) {
      if (n >= arr.length) break;
      if (sg === null) { arr[n++].set(0, 0, -1, 0); continue; }
      arr[n++].set(sg[0], sg[1], sg[2], sg[3]);
      const m = sg[2] + sg[3] * 3.5 + 0.14;
      const u = sg[0] * ax + sg[1] * az, v = -sg[0] * az + sg[1] * ax;
      x0 = Math.min(x0, u - m); x1 = Math.max(x1, u + m); z0 = Math.min(z0, v - m); z1 = Math.max(z1, v + m);
    }
    this.U.uN.value = n;
    const P = this.geo.attributes.position.array;
    const corner = (u, v, i) => { P[i] = u * ax - v * az; P[i + 1] = 0; P[i + 2] = u * az + v * ax; };
    corner(x0, z0, 0); corner(x1, z0, 3); corner(x1, z1, 6); corner(x0, z1, 9);
    this.geo.attributes.position.needsUpdate = true;
    this.geo.computeBoundingSphere();
    if (col) this.U.uShadowCol.value.set(...col);
    if (alpha != null) this.U.uOpacity.value = alpha;
    this.dirty = true;
  }
  setSize(bw, bh) {
    const w = Math.max(4, Math.round(bw / 4)), h = Math.max(4, Math.round(bh / 4));
    if (this.rt.width !== w || this.rt.height !== h) { this.rt.setSize(w, h); this.dirty = true; }
    this.compU.uRes.value.set(bw, bh);
  }
  // prewarm (§6.3): both programs drawn once, 1 × 1 scissored, so a software renderer builds their pipelines at boot
  // (gl/index.js, with the hero's), not in the reveal's first frames (G1 r2: those frames took 0.3–0.6 s)
  warm(camera) {
    const r = this.r;
    this.rt.scissor.set(0, 0, 1, 1); this.rt.scissorTest = true;
    r.setRenderTarget(this.rt); r.render(this.scene, camera);
    this.rt.scissorTest = false; r.setRenderTarget(null);
    r.setScissorTest(true); r.setScissor(0, 0, 1, 1); r.render(this.compScene, camera); r.setScissorTest(false);
    this.dirty = true;
  }
  // render the target if needed, then composite it onto the current framebuffer
  draw(camera) {
    const r = this.r;
    if (this.empty) return;
    if (this.dirty) {
      const cc = r.getClearAlpha();
      r.setRenderTarget(this.rt); r.setClearColor(0x000000, 0); r.clear(); r.render(this.scene, camera); r.setRenderTarget(null);
      r.setClearAlpha(cc);
      this.dirty = false;
    }
    r.render(this.compScene, camera);
  }
}
