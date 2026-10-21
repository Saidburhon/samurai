// The single WebGLRenderer, the scene, the camera solvers (td, orbit, guard), per-frame near/far, the resolution
// policy and the frame. The sword stays at the world origin (yaw 0): cameras move around it, the paper (y = 0) is
// fixed under it, so the studio, the lamp and the drawing all live in the sword's own frame.
import { WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, Vector2, Vector3, Matrix4, Matrix3, Quaternion, Euler, NeutralToneMapping, SRGBColorSpace, DoubleSide,
  PlaneGeometry, ShaderMaterial } from 'three';
import * as G from '../sword/geom-core.js';
import * as GM from './geom.js';
import { makeUniforms, makeMaterials, SRC } from './materials.js';
import { SoftPass } from './softpass.js';
import { Rays } from './rays.js';
import { LOOKS, UNIFORM_KEYS } from '../core/looks.js';
import { pixelRatio } from '../core/tier.js';
import { holdStudio } from './studio.js';

const D = Math.PI / 180;
const v3 = (x = 0, y = 0, z = 0) => new Vector3(x, y, z);

export class Stage {
  constructor(canvas, tier, context) {
    this.tier = tier;
    const r = (this.renderer = new WebGLRenderer({ canvas, context, alpha: true, premultipliedAlpha: true, antialias: tier.tier === 3, powerPreference: 'high-performance', preserveDrawingBuffer: false }));
    r.setClearColor(0x000000, 0);
    r.toneMapping = NeutralToneMapping; r.toneMappingExposure = 1; r.outputColorSpace = SRGBColorSpace;
    r.sortObjects = true;
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(20, 1, 0.05, 100);
    this.U = makeUniforms();
    this.pose = { roll: 0, pitch: 0, sori: 1, lift: 0 };
    this.vis = { koshirae: 1, nakago: 0, saya: 0, floor: 0 };
    this.w = 1; this.h = 1;
  }

  build(T) {
    this.T = T;
    const M = (this.mat = makeMaterials(this.U, T));
    const sw = (this.sword = new Group()); sw.rotation.order = 'YZX'; this.scene.add(sw);
    this.blade = new Mesh(GM.buildBlade(), M.steel); this.blade.frustumCulled = false; this.blade.renderOrder = 2; sw.add(this.blade);
    const hg = (this.handle = new Group()); hg.matrixAutoUpdate = false; sw.add(hg);
    const add = (geo, mat, name) => { const m = new Mesh(geo, mat); m.name = name; m.frustumCulled = false; hg.add(m); return m; };
    this.parts = {
      habaki: add(GM.buildHabaki(), M.copper, 'habaki'), seppa1: add(GM.buildSeppa('seppa1'), M.gold, 'seppa1'),
      tsuba: add(GM.buildTsuba(), M.iron, 'tsuba'), seppa2: add(GM.buildSeppa('seppa2'), M.gold, 'seppa2'),
      fuchi: add(GM.buildFuchi(), M.shakudo, 'fuchi'), tsuka: add(GM.buildTsuka(), M.silk, 'tsuka'),
      kashira: add(GM.buildKashira(), M.shakudo, 'kashira'), mekugi: add(GM.buildMekugi(), M.gold, 'mekugi'),
    };
    this.nakagoMesh = add(GM.buildNakago(), M.nakago, 'nakago'); this.nakagoMesh.visible = false;
    this.sayaG = new Group(); sw.add(this.sayaG);
    this.saya = new Mesh(GM.buildSaya(), M.lacquer); this.saya.frustumCulled = false; this.sayaG.add(this.saya);
    this.kurikata = new Mesh(GM.buildKurikata(), M.kurikata); this.kurikata.frustumCulled = false; this.sayaG.add(this.kurikata);
    M.lacquer.uniforms.uSayaLen.value = GM.SAYA_LEN;
    this.sayaG.visible = false;
    // the floor (Tsuba): a plane in the tsuba's frame, on the edge side of the guard
    this.floorU = {
      ...this.U, tGirih: { value: T.girih }, uDiscL: { value: v3() }, uTsubaC: { value: v3() }, uAxisW: { value: v3(1, 0, 0) }, uFaceU: { value: v3(0, 0, 1) }, uFaceV: { value: v3(0, 1, 0) },
      uDiscR: { value: 0.335 }, uGain: { value: 0.4 }, uFloorWarm: { value: 0 }, uVig: { value: 1 }, uPxPerUnit: { value: 100 },
      uFloorBase: { value: v3(0.0070, 0.0115, 0.037) }, uLightCol: { value: v3(2.1, 1.42, 0.70) }, uVigC: { value: new Vector2(1.5, 0) }, uVigR: { value: 6 }, uFloorZ: { value: 0.65 },
    };
    this.floor = new Mesh(new PlaneGeometry(30, 30), new ShaderMaterial({ vertexShader: SRC.PLANE_V, fragmentShader: SRC.frag(SRC.FLOOR_F), uniforms: this.floorU, transparent: true, premultipliedAlpha: true, depthWrite: false }));
    this.floor.frustumCulled = false; this.floor.renderOrder = -1; this.floor.visible = false;
    this.floor.position.set(0, 0, 0.72); // the edge side of the guard: the screen's bottom in the opponent's view
    this.floor.rotation.x = Math.PI;      // its face towards the guard (front faces only)
    hg.add(this.floor);
    this.soft = new SoftPass(this.renderer);
    this.rays = new Rays(this.renderer, hg);
  }

  // baked textures in place of the stand-ins: uniform values only, no program changes
  swapTextures(T) {
    const M = this.mat;
    if (T.hada) { M.steelU.tHada.value = T.hada; M.lacquer.uniforms.tHada.value = T.hada; }
    if (T.hamon) M.steelU.tHamon.value = T.hamon;
    if (T.silk) M.silk.uniforms.tSilk.value = T.silk;
    if (T.ishime) for (const m of [M.copper, M.gold, M.iron, M.shakudo, M.nakago]) m.uniforms.tIshime.value = T.ishime;
    if (T.girih) this.floorU.tGirih.value = T.girih;
  }
  setSize(w, h, atHold = true) {
    this.w = w; this.h = h;
    const pr = pixelRatio(this.tier, w, h, atHold);
    this.pr = pr;
    this.renderer.setPixelRatio(pr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    const dpr = window.devicePixelRatio || 1;
    this.U.uAA.value = pr / dpr;
    const bw = Math.round(w * pr), bh = Math.round(h * pr);
    this.soft.setSize(bw, bh);
    // the rays are soft: they run at half the device resolution (a quarter on T1), whatever the supersampling
    this.rays.setSize(bw, bh, (this.tier.tier === 1 ? 0.25 : 0.5) / Math.max(1, this.U.uAA.value));
  }

  // ---------- the look ----------
  applyLook(name, over = {}) {
    const lk = { ...LOOKS[name], ...over };
    this.look = lk;
    for (const k of UNIFORM_KEYS) {
      const u = this.U[k]; if (!u) continue;
      const v = lk[k];
      if (Array.isArray(v)) u.value.set(...v); else u.value = v;
    }
    const s = this.mat.steelU;
    s.uNie.value = lk.nie; s.uNieAvg.value = lk.nieAvg; s.uShinogiSheen.value = lk.shinogiSheen; s.uShinogiRough.value = lk.shinogiRough; s.uEdgeLine.value = lk.edgeLine;
    this.mat.iron.uniforms.uBackGlow.value.set(...lk.backGlow);
    this.mat.iron.uniforms.uBase.value.set(...lk.ironBase);
  }

  // ---------- the pose ----------
  setPose({ roll = 0, pitch = 0, sori = 1, lift = 0 } = {}) {
    Object.assign(this.pose, { roll, pitch, sori, lift });
    const sw = this.sword;
    sw.position.set(0, lift, 0);
    sw.rotation.set(roll, 0, pitch);
    this.handle.matrix.copy(GM.handleMatrix(sori));
    this.mat.steelU.uSori.value = sori;
    sw.updateMatrixWorld(true);
  }
  setVis(v) {
    Object.assign(this.vis, v);
    const ko = !!this.vis.koshirae;
    for (const k in this.parts) this.parts[k].visible = ko;
    this.nakagoMesh.visible = !!this.vis.nakago;
    this.sayaG.visible = !!this.vis.saya;
    this.floor.visible = !!this.vis.floor;
  }
  world(p) { return p.clone().applyMatrix4(this.sword.matrixWorld); }
  worldH(p) { return p.clone().applyMatrix4(this.handle.matrix).applyMatrix4(this.sword.matrixWorld); }
  dirW(p) { return p.clone().transformDirection(this.sword.matrixWorld); }
  dirH(p) { return p.clone().transformDirection(new Matrix4().multiplyMatrices(this.sword.matrixWorld, this.handle.matrix)); }
  // a named point of the sword, in world space
  point(spec) {
    const sg = this.pose.sori;
    if (spec === 'K') { const { K } = G.axisEnds(sg); return this.world(v3(K[0], 0, K[1])); }
    if (spec === 'T') { const { T } = G.axisEnds(sg); return this.world(v3(T[0], 0, T[1])); }
    if (spec === 'koiguchi') return this.worldH(v3(GM.SAYA_MOUTH + 0.02, 0, 0));
    if (spec === 'tsuba') return this.worldH(v3((G.H.tsuba[0] + G.H.tsuba[1]) / 2, 0, 0));
    const p = G.bladePoint(spec.s, spec.y || 0, spec.zf ?? 0.5, sg);
    return this.world(v3(p[0], p[1], p[2]));
  }
  project(wp) { const p = wp.clone().project(this.camera); return [(p.x * 0.5 + 0.5) * this.w, (-p.y * 0.5 + 0.5) * this.h]; }

  // ---------- camera solvers (§3.4) ----------
  solve(cam) {
    const c = this.camera;
    c.clearViewOffset();
    if (cam.mode === 'td') this.solveTD(cam);
    else if (cam.mode === 'orbit') this.solveOrbit(cam);
    else if (cam.mode === 'guard') this.solveGuard(cam);
    this.clip();
  }
  // straight down: the camera's height, yaw and position are solved so that A and B land on their screen points
  solveTD({ A, a, B, b, fov }) {
    const c = this.camera, W = this.w, H = this.h;
    const Aw = this.point(A), Bw = this.point(B);
    const f = (H / 2) / Math.tan(fov * D / 2);
    const sa = [a[0] * W, a[1] * H], sb = [b[0] * W, b[1] * H];
    const ppu = Math.hypot(sb[0] - sa[0], sb[1] - sa[1]) / Math.hypot(Bw.x - Aw.x, Bw.z - Aw.z);
    const hAvg = (Aw.y + Bw.y) / 2;
    const Hc = hAvg + f / ppu;
    const phi = Math.atan2(Bw.z - Aw.z, Bw.x - Aw.x) - Math.atan2(sb[1] - sa[1], sb[0] - sa[0]);
    const r = v3(Math.cos(phi), 0, Math.sin(phi)), d = v3(-Math.sin(phi), 0, Math.cos(phi));
    const al = (sa[0] - W / 2) / ppu, be = (sa[1] - H / 2) / ppu;
    const C = v3(Aw.x - r.x * al - d.x * be, Hc, Aw.z - r.z * al - d.z * be);
    c.fov = fov; c.position.copy(C); c.up.copy(d).negate(); c.lookAt(C.x, 0, C.z); c.updateProjectionMatrix(); c.updateMatrixWorld();
    this.td = { f, Hc, r, d, C, phi };
  }
  // around a target on the sword, in its heading frame (yaw and pitch, no roll: blade rolls stay visible)
  solveOrbit({ target, az = 0, el = 45, dist = 3, vec, fov, ang = 0, chord, off = [0, 0] }) {
    const c = this.camera;
    const T = this.point(typeof target === 'string' ? target : { s: target.s, zf: target.zf ?? 0.5 });
    const head = new Matrix4().makeRotationZ(this.pose.pitch);
    let dir, dd;
    if (vec) { dir = v3(...vec); dd = dir.length(); dir.normalize(); }
    else { dir = v3(Math.sin(az * D) * Math.cos(el * D), Math.sin(el * D), Math.cos(az * D) * Math.cos(el * D)); dd = dist; }
    dir.transformDirection(head);
    c.fov = fov; c.updateProjectionMatrix();
    c.position.copy(T).addScaledVector(dir, dd);
    c.up.set(0, 1, 0).transformDirection(head);
    if (Math.abs(el) > 89) c.up.set(0, 0, -1).transformDirection(head);
    c.lookAt(T); c.updateMatrixWorld();
    const s = typeof target === 'string' ? 0.12 : target.s;
    const [c0, c1] = chord || [Math.max(0.02, s - 0.1), Math.min(0.98, s + 0.1)];
    const want = ang * D;
    for (let i = 0; i < 5; i++) {
      this.clip(); c.updateMatrixWorld();
      const p0 = this.project(this.point({ s: c0 })), p1 = this.project(this.point({ s: c1 }));
      const now = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
      c.rotateZ(want - now); c.updateMatrixWorld();
    }
    if (off[0] || off[1]) c.setViewOffset(this.w, this.h, off[0] * this.w, off[1] * this.h, this.w, this.h);
  }
  // the opponent's view of the tsuba (B14): (a) on the guard's normal; (b) 14° off the axis to the edge side, 8° above
  solveGuard({ cand = 'a', frac = 0.47, off = [0, 0], dist = 30, side = 14, up = 8 }) {
    const c = this.camera;
    const tc = this.point('tsuba');
    const axis = this.dirH(v3(1, 0, 0)).normalize();
    let dir;
    if (cand === 'a') dir = axis.clone().add(v3(0, 0.014, -0.006)).normalize();
    else if (cand === 'p') { // the prototype's camera, between the guard normal and the tip direction (frame 04)
      const tipW = this.world(v3(G.B.L, 0, 0.02)), tipDir = tipW.clone().sub(tc).normalize();
      dir = axis.clone().lerp(tipDir, 0.5).normalize().add(v3(0, 0.014, -0.006)).normalize();
    } else {
      // 14° off the guard normal sideways and 8° above it (in the view's own axes), so the blade leaves the centre
      // as a foreshortened spike towards the lower left
      const U = v3(0, 0, -1).addScaledVector(axis, axis.z).normalize(); // the screen's up, square to the axis
      const Rt = new Vector3().crossVectors(U, axis).normalize();
      dir = axis.clone().addScaledVector(U, Math.tan(up * D)).addScaledVector(Rt, Math.tan(side * D)).normalize();
    }
    c.position.copy(tc).addScaledVector(dir, dist);
    c.up.set(0, 0, -1);
    c.lookAt(tc);
    c.fov = 2 * Math.atan((G.TSUBA_R * 1.03) / (frac * dist)) / D;
    c.updateProjectionMatrix(); c.updateMatrixWorld();
    if (off[0] || off[1]) c.setViewOffset(this.w, this.h, off[0] * this.w, off[1] * this.h, this.w, this.h);
    this.guard = { tc, axis, dir };
  }
  // near and far from the bounding sphere of what is visible (§3.4): no depth speckles with long lenses
  clip() {
    const c = this.camera;
    const K = this.point('K'), T = this.point('T');
    const centre = K.clone().add(T).multiplyScalar(0.5);
    let rad = K.distanceTo(T) * 0.5 + 0.6;
    if (this.vis.floor) rad = Math.max(rad, 22);
    const d = c.position.distanceTo(centre);
    c.near = Math.max(0.01, d - 1.05 * rad); c.far = d + 1.05 * rad;
    c.updateProjectionMatrix();
  }

  // ---------- the lamp (§3.5): its mirror glint lands on blade point (s, zf) of the face that looks at the camera ----------
  lampGlint(s, zf, dist = 7) {
    const sg = this.pose.sori, k = G.thick(s), e = 0.01;
    const topY = (z) => { const P = G.PROFILE_TOP; for (let i = 1; i < P.length; i++) if (z <= P[i][1]) { const a = P[i - 1], b = P[i]; const t = (z - a[1]) / (b[1] - a[1]); return a[0] + (b[0] - a[0]) * t; } return 0; };
    const camL = this.camera.position.clone().applyMatrix4(new Matrix4().copy(this.sword.matrixWorld).invert());
    const side = camL.y >= 0 ? 1 : -1;
    const Lp = (ss, z) => { const p = G.bladePoint(ss, side * topY(z) * G.thick(ss), z, sg); return v3(p[0], p[1], p[2]); };
    const P0 = Lp(s, zf), Pz = Lp(s, zf + e).sub(Lp(s, zf - e)), Ps = Lp(s + 0.01, zf).sub(Lp(s - 0.01, zf));
    const nl = Pz.clone().cross(Ps).normalize(); if (nl.y * side < 0) nl.negate();
    void k;
    const P = this.world(P0);
    const n = this.dirW(nl).normalize();
    const toC = this.camera.position.clone().sub(P).normalize();
    const r = n.clone().multiplyScalar(2 * toC.dot(n)).sub(toC);
    this.U.uLampPos.value.copy(P.clone().addScaledVector(r, dist));
    this.U.uGlintDir.value.copy(r.normalize());
  }

  // ---------- the reflected sign (utsuri): solved at the hold, as in the prototype ----------
  solveSign({ s = 0.5, zf = 0.56, dist = 5.0, width = 4.0, flatten = 0.8 } = {}) {
    const st = this.mat.steelU, c = this.camera;
    const camL = c.position.clone().applyMatrix4(new Matrix4().copy(this.sword.matrixWorld).invert());
    const side = camL.y >= 0 ? 1 : -1;
    const nB = this.dirW(v3(0, side, 0)).normalize();
    const p = G.bladePoint(s, side * G.thick(s) * 0.45, zf, this.pose.sori);
    const P = this.world(v3(p[0], p[1], p[2]));
    const Vd = P.clone().sub(c.position).normalize();
    const R = Vd.clone().sub(nB.clone().multiplyScalar(2 * Vd.dot(nB)));
    const C = P.clone().addScaledVector(R, dist);
    const Nsg = R.clone().negate();
    const along = this.dirW(v3(1, 0, 0)).normalize();
    const Uu = along.clone().sub(Nsg.clone().multiplyScalar(along.dot(Nsg))).normalize();
    const Vv = Nsg.clone().cross(Uu).normalize();
    const sw = width, sh = sw / 8;
    Uu.multiplyScalar(sw); Vv.multiplyScalar(-sh);
    const O = C.clone().sub(Uu.clone().multiplyScalar(0.5)).sub(Vv.clone().multiplyScalar(0.5));
    st.uSignO.value.copy(O); st.uSignU.value.copy(Uu); st.uSignV.value.copy(Vv); st.uSignN.value.copy(Nsg);
    st.uBladeN.value.copy(nB); st.uFlatten.value = flatten;
  }

  // the studio rotation (uStudio): a roll of the studio about the blade axis (the reveal's −0.60), else identity
  setStudio(roll = 0, yaw = 0) { this.studioM = holdStudio(roll, yaw); this.U.uStudio.value.setFromMatrix4(this.studioM); }

  // ---------- the frame ----------
  render({ shadow = false, rays = false } = {}) {
    const r = this.renderer;
    const t0 = performance.now();
    r.setRenderTarget(null);
    r.autoClear = false; r.setClearColor(0x000000, 0); r.clear();
    this.rays.disc.visible = !!rays;
    if (rays) this.rays.occlude(this.scene, this.camera, this.sword, [this.floor]);
    if (shadow) this.soft.draw(this.camera);
    r.render(this.scene, this.camera);
    if (rays) this.rays.draw();
    r.autoClear = true;
    return performance.now() - t0;
  }
  // Prewarm (§6.3): draw each mesh once into the default framebuffer with a 1 × 1 scissor, with its own blend and
  // depth state, so a software renderer builds the real pipeline now and not inside a scene. Returns ms per mesh.
  prewarm(meshes) {
    const r = this.renderer, gl = r.getContext(), out = {};
    const vis = [];
    this.scene.traverse((o) => { if (o.isMesh) { vis.push([o, o.visible]); o.visible = false; } });
    r.setRenderTarget(null); r.setScissorTest(true); r.setScissor(0, 0, 1, 1);
    for (const m of meshes) {
      const t0 = performance.now();
      m.visible = true; r.render(this.scene, this.camera); m.visible = false;
      this.finish();
      out[m.name || m.material.type] = Math.round(performance.now() - t0);
    }
    r.setScissorTest(false);
    for (const [o, v] of vis) o.visible = v;
    void gl;
    return out;
  }
  // a full GPU round trip, for timing logs
  finish() { const gl = this.renderer.getContext(); const px = new Uint8Array(4); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); }
}
export { Quaternion, Euler, Matrix3 };
