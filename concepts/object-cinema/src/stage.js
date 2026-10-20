import * as THREE from 'three';
import * as G from './geom.js';
import * as S from './shaders.js';

const v3 = (x, y, z) => new THREE.Vector3(x, y, z);

export class Stage {
  constructor(canvas, { pixelRatio = 1 } = {}) {
    const r = (this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, premultipliedAlpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' }));
    r.setPixelRatio(pixelRatio);
    r.setClearColor(0x000000, 0);
    r.toneMapping = THREE.NeutralToneMapping;
    r.toneMappingExposure = 1.0;
    r.outputColorSpace = THREE.SRGBColorSpace;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(20, 1, 0.05, 5000);

    // shared light + studio uniforms
    this.U = {
      uStudio: { value: new THREE.Matrix3() },
      uCeil: { value: v3(0.010, 0.012, 0.016) }, uCeilHi: { value: v3(0.12, 0.122, 0.13) }, uCeilA: { value: new THREE.Vector2(-0.62, -0.22) },
      uFloor: { value: v3(0.70, 0.66, 0.58) },
      uKey: { value: v3(2.3, 2.25, 2.15) }, uKeyA: { value: new THREE.Vector2(-0.52, -0.44) },
      uStrip: { value: v3(0, 0, 0) }, uStripA: { value: new THREE.Vector2(-0.19, -0.155) },
      uRim: { value: v3(0, 0, 0) }, uRimA: { value: new THREE.Vector2(0.9, 1.1) },
      uLampPos: { value: v3(0, 8, 0) }, uLampCol: { value: v3(3.0, 2.7, 2.25) },
      uFrostLight: { value: 1.3 }, uFrostAmb: { value: v3(0, 0, 0) },
      uKeyB: { value: new THREE.Vector2(-1.15, 1.15) }, uCeilB: { value: new THREE.Vector2(-3, -2) }, uKeySoft: { value: 0.14 }, uRidge: { value: 0.0 },
      uGlintDir: { value: v3(0, 1, 0) }, uGlintCol: { value: v3(0, 0, 0) }, uGlintSize: { value: 0.03 },
      uExposure: { value: 1.0 },
      uReveal: { value: 2.0 }, uFront: { value: 0.0 },
    };
    const U = this.U;
    const steelU = {
      ...U, uNie: { value: 520 }, uPolish: { value: 1 }, uTime: { value: 0 },
      uWords: { value: null }, uWordAlpha: { value: 0 },
      uSignO: { value: v3() }, uSignU: { value: v3(1, 0, 0) }, uSignV: { value: v3(0, 1, 0) }, uSignN: { value: v3(0, 0, 1) },
      uFlatten: { value: 0.6 }, uBladeN: { value: v3(0, 1, 0) },
    };
    this.steelU = steelU;
    const mk = (frag, uniforms) => new THREE.ShaderMaterial({ vertexShader: S.swordVert, fragmentShader: frag, uniforms, side: THREE.DoubleSide });
    this.mat = {
      steel: mk(S.steelFrag, steelU),
      copper: mk(S.metalFrag, { ...U, uBase: { value: v3(0.80, 0.46, 0.24) }, uRough: { value: 0.26 }, uMetal: { value: 1 }, uKind: { value: 0 } }),
      gold: mk(S.metalFrag, { ...U, uBase: { value: v3(0.86, 0.66, 0.32) }, uRough: { value: 0.2 }, uMetal: { value: 1 }, uKind: { value: 1 } }),
      iron: mk(S.metalFrag, { ...U, uBase: { value: v3(0.055, 0.048, 0.042) }, uRough: { value: 0.55 }, uMetal: { value: 0.6 }, uKind: { value: 2 }, uAxisW: { value: v3(1, 0, 0) }, uBackGlow: { value: v3(0, 0, 0) } }),
      shakudo: mk(S.metalFrag, { ...U, uBase: { value: v3(0.035, 0.038, 0.048) }, uRough: { value: 0.28 }, uMetal: { value: 0.85 }, uKind: { value: 3 } }),
      silk: mk(S.silkFrag, { ...U, uDiamonds: { value: 10.0 } }),
    };

    // ---- the sword ----
    this.sword = new THREE.Group();
    this.sword.rotation.order = 'YZX';
    this.scene.add(this.sword);
    const blade = G.addAxial(G.buildBlade());
    this.blade = new THREE.Mesh(blade, this.mat.steel);
    this.sword.add(this.blade);
    const hf = G.handleFrame();
    this.handle = new THREE.Group(); this.handle.matrixAutoUpdate = false; this.handle.matrix.copy(hf);
    this.sword.add(this.handle);
    const addH = (geo, mat) => { G.addAxial(geo, hf); const m = new THREE.Mesh(geo, mat); this.handle.add(m); return m; };
    addH(G.buildHabaki(), this.mat.copper);
    addH(G.buildSeppa('seppa1'), this.mat.gold);
    this.tsuba = addH(G.buildTsuba(), this.mat.iron);
    addH(G.buildSeppa('seppa2'), this.mat.gold);
    addH(G.buildFuchi(), this.mat.shakudo);
    addH(G.buildTsuka(), this.mat.silk);
    addH(G.buildKashira(), this.mat.shakudo);

    // ---- shadow catcher ----
    this.shadowU = { uSeg: { value: Array.from({ length: 72 }, () => new THREE.Vector4(0, 0, -1, 0)) }, uN: { value: 0 }, uShadowCol: { value: v3(0.16, 0.13, 0.10) }, uOpacity: { value: 0.68 } };
    this.shadow = new THREE.Mesh(new THREE.PlaneGeometry(400, 400).rotateX(-Math.PI / 2),
      new THREE.ShaderMaterial({ vertexShader: S.shadowVert, fragmentShader: S.shadowFrag, uniforms: this.shadowU, transparent: true, depthWrite: false }));
    this.shadow.renderOrder = -1;
    this.scene.add(this.shadow);

    this.hf = hf;
    const { K, T } = G.axisEnds();
    this.K = K; this.T = T;
    this.drawPose = new THREE.Matrix4();
  }

  setSize(w, h) {
    this.w = w; this.h = h;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
  }

  // top-down camera: screen right = +X, screen down = +Z.
  // Frames the 3D sword (real size) at height y so that its axis ends land on Ks and Ts.
  frameTopDown(fov, Ks, Ts, y) {
    const K = this.K, T = this.T;
    const a0 = Math.atan2(T.z - K.z, T.x - K.x), as = Math.atan2(Ts[1] - Ks[1], Ts[0] - Ks[0]);
    const yaw = a0 - as;
    const ppu = Math.hypot(Ts[0] - Ks[0], Ts[1] - Ks[1]) / Math.hypot(T.x - K.x, T.z - K.z);
    const c = this.camera; c.fov = fov; c.updateProjectionMatrix();
    const D = y + (this.h / 2) / (ppu * Math.tan((fov * Math.PI) / 360));
    c.near = Math.max(0.05, D - 12); c.far = D + 12; c.updateProjectionMatrix();
    c.position.set(0, D, 0); c.up.set(0, 0, -1); c.lookAt(0, 0, 0); c.updateMatrixWorld();
    this.D = D; this.ppu = ppu; this.yaw = yaw;
    this.basePos = this._place(Ks, yaw, 1, ppu, y);
    this.fitDrawing(Ks, Ts);
  }
  _place(Ks, yaw, scale, ppu, y) {
    const K = this.K;
    const Kw = [(Ks[0] - this.w / 2) / ppu, (Ks[1] - this.h / 2) / ppu];
    const c = Math.cos(yaw), s = Math.sin(yaw);
    const rx = (K.x * c + K.z * s) * scale, rz = (-K.x * s + K.z * c) * scale;
    return v3(Kw[0] - rx, y, Kw[1] - rz);
  }
  // the ink drawing lies in the paper (y = 0); it is scaled to match the sword's screen size
  fitDrawing(Ks, Ts) {
    const K = this.K, T = this.T;
    const a0 = Math.atan2(T.z - K.z, T.x - K.x), as = Math.atan2(Ts[1] - Ks[1], Ts[0] - Ks[0]);
    const yaw = a0 - as;
    const ppu0 = (this.h / 2) / (this.D * Math.tan((this.camera.fov * Math.PI) / 360));
    const scale = Math.hypot(Ts[0] - Ks[0], Ts[1] - Ks[1]) / Math.hypot(T.x - K.x, T.z - K.z) / ppu0;
    const pos = this._place(Ks, yaw, scale, ppu0, 0);
    this.drawPose.compose(pos, new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0)), v3(scale, scale, scale));
  }

  // place the 3D sword relative to its framed base pose
  pose({ dx = 0, dy = 0, dz = 0, roll = 0, pitch = 0, yawAdd = 0, studioRoll = 0 } = {}) {
    const sw = this.sword;
    sw.position.copy(this.basePos).add(v3(dx, dy, dz));
    sw.rotation.set(roll, this.yaw + yawAdd, pitch);
    sw.updateMatrixWorld(true);
    // studio follows the blade's heading (not its roll)
    const q = new THREE.Matrix4().makeRotationX(studioRoll).multiply(new THREE.Matrix4().makeRotationY(this.yaw + yawAdd).invert());
    this.U.uStudio.value.setFromMatrix4(q);
  }

  // world position of a sword-local point (blade frame) for the current 3D pose
  world(p) { return p.clone().applyMatrix4(this.sword.matrixWorld); }
  worldH(p) { return p.clone().applyMatrix4(this.hf).applyMatrix4(this.sword.matrixWorld); }
  // screen position of a sword-local point lying in the paper (drawing pose)
  paperPoint(x, z) { return v3(x, 0, z).applyMatrix4(this.drawPose); }
  project(world) { const p = world.clone().project(this.camera); return [(p.x * 0.5 + 0.5) * this.w, (-p.y * 0.5 + 0.5) * this.h]; }

  // analytic shadow from the current pose. light: direction towards the light (world)
  updateShadow(light, { soft = 0.10, base = 0.02 } = {}) {
    const L = light.clone().normalize();
    const segs = [];
    const proj = (P) => { const t = P.y / L.y; return [P.x - L.x * t, P.z - L.z * t, P.y]; };
    const roll = this.sword.rotation.x;
    const push = (P, hw) => { const [x, z, y] = proj(P); segs.push([x, z, hw, base + Math.max(0, y) * soft]); };
    // blade
    for (let i = 0; i <= 40; i++) {
      const s = Math.pow(i / 40, 0.85);
      const w = G.width(s), k = G.thick(s);
      const c = G.bladePoint(s, 0, 0.5);
      const hw = 0.5 * (w * Math.abs(Math.cos(roll)) + k * Math.abs(Math.sin(roll)));
      push(this.world(v3(c[0], 0, c[2])), hw);
    }
    segs.push(null);
    // tsuba (rounded blob)
    const tx = (G.H.tsuba[0] + G.H.tsuba[1]) / 2;
    const tc = this.worldH(v3(tx, 0, 0));
    const tsH = G.TSUBA_R * 1.0;
    push(this.worldH(v3(tx - 0.02, 0, 0)), tsH * 0.92); push(this.worldH(v3(tx + 0.02, 0, 0)), tsH * 0.92);
    segs.push(null);
    // handle: habaki .. kashira
    const hx = [0.035, -0.30, -0.38, -0.43, -1.0, -1.7, -2.4, -2.93, -3.02];
    for (const x of hx) {
      const rz = x > -0.31 ? 0.19 : 0.165, ry = x > -0.31 ? 0.06 : 0.125;
      const hw = rz * Math.abs(Math.cos(roll)) + ry * Math.abs(Math.sin(roll));
      push(this.worldH(v3(x, 0, 0)), x < -2.95 ? hw * 0.8 : hw);
    }
    const arr = this.shadowU.uSeg.value;
    let n = 0;
    for (const sg of segs) { if (n >= arr.length) break; if (sg === null) arr[n++].set(0, 0, -1, 0); else arr[n++].set(sg[0], sg[1], sg[2], sg[3]); }
    this.shadowU.uN.value = n;
  }

  // ---- backlight + god rays (tsuba scene) ----
  initRays(radius, x, color) {
    const disc = new THREE.Mesh(new THREE.CircleGeometry(radius, 96), new THREE.ShaderMaterial({
      uniforms: { uCol: { value: v3(...color) }, uR: { value: radius } },
      vertexShader: 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
      fragmentShader: 'uniform vec3 uCol; uniform float uR; varying vec2 vP; void main(){ float r = length(vP)/uR; vec3 c = uCol * (1.25 - 0.9*r*r); gl_FragColor = vec4(c, 1.); \n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}',
    }));
    disc.rotation.y = Math.PI / 2; // face +x (towards the blade/camera)
    const g = new THREE.Group(); g.matrixAutoUpdate = false; g.matrix.copy(this.hf);
    disc.position.set(x, 0, 0);
    g.add(disc); this.sword.add(g);
    this.disc = disc;
    const pr = this.renderer.getPixelRatio();
    this.rtOcc = new THREE.WebGLRenderTarget(Math.round(this.w * pr / 2), Math.round(this.h * pr / 2), { type: THREE.HalfFloatType });
    this.blackMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
    this.rayU = { tOcc: { value: this.rtOcc.texture }, uLight: { value: new THREE.Vector2(0.5, 0.5) }, uDecay: { value: 0.935 }, uWeight: { value: 0.034 }, uDensity: { value: 0.42 }, uExp: { value: 0.30 } };
    this.rayMat = new THREE.ShaderMaterial({ vertexShader: S.rayVert, fragmentShader: S.rayFrag, uniforms: this.rayU, depthTest: false, depthWrite: false, transparent: true,
      blending: THREE.CustomBlending, blendEquation: THREE.AddEquation, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneFactor });
    this.rayScene = new THREE.Scene();
    this.rayScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.rayMat));
    this.rayCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  }

  render() {
    const r = this.renderer;
    if (this.rtOcc) {
      const saved = [];
      this.sword.traverse((o) => { if (o.isMesh && o !== this.disc) { saved.push([o, o.material]); o.material = this.blackMat; } });
      const shadowVis = this.shadow.visible; this.shadow.visible = false;
      r.setRenderTarget(this.rtOcc); r.setClearColor(0x000000, 0); r.clear(); r.render(this.scene, this.camera);
      for (const [o, m] of saved) o.material = m;
      this.shadow.visible = shadowVis;
      r.setRenderTarget(null); r.setClearColor(0x000000, 0);
      const lp = this.disc.getWorldPosition(new THREE.Vector3()).project(this.camera);
      this.rayU.uLight.value.set(lp.x * 0.5 + 0.5, lp.y * 0.5 + 0.5);
      r.clear(); r.render(this.scene, this.camera);
      r.autoClear = false; r.render(this.rayScene, this.rayCam); r.autoClear = true;
      return;
    }
    r.render(this.scene, this.camera);
  }
}
