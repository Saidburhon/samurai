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
import { girihTexture } from './bake.js';
import { wordAtlas } from './sign.js';

// Every geometry of the sword, the koshirae and the saya: CPU only (no GL). gl/index.js prebuild() makes them one by
// one in the main thread's idle time during the intro drawing; buildGeometries() completes whatever is missing.
const PARTS = {
  blade: () => GM.buildBlade(), tsuba: () => GM.buildTsuba(), tsuka: () => GM.buildTsuka(), habaki: () => GM.buildHabaki(),
  seppa1: () => GM.buildSeppa('seppa1'), seppa2: () => GM.buildSeppa('seppa2'), fuchi: () => GM.buildFuchi(), kashira: () => GM.buildKashira(),
  mekugi: () => GM.buildMekugi(), nakago: () => GM.buildNakago(), saya: () => GM.buildSaya(), kurikata: () => GM.buildKurikata(),
};
export const PART_NAMES = Object.keys(PARTS);
export const buildPart = (name) => PARTS[name]();
export function buildGeometries(have = {}) {
  const out = { ...have };
  for (const n of PART_NAMES) if (!out[n]) out[n] = PARTS[n]();
  return out;
}

const D = Math.PI / 180;
const v3 = (x = 0, y = 0, z = 0) => new Vector3(x, y, z);
const IDENT = new Matrix4();

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

  // geo: the geometries (buildGeometries)
  // the materials alone (the boot path issues their programs before the geometries exist); build() makes them if not
  materials(T) { if (!this.mat) this.mat = makeMaterials(this.U, T); return this.mat; }
  build(T, geo = buildGeometries()) {
    this.T = T;
    const early = !!this.mat;
    const M = this.materials(T);
    if (early) this.swapTextures(T);
    const sw = (this.sword = new Group()); sw.rotation.order = 'YZX'; this.scene.add(sw);
    this.blade = new Mesh(geo.blade, M.steel); this.blade.frustumCulled = false; this.blade.renderOrder = 2; sw.add(this.blade);
    const hg = (this.handle = new Group()); hg.matrixAutoUpdate = false; sw.add(hg);
    const add = (geo, mat, name) => { const m = new Mesh(geo, mat); m.name = name; m.frustumCulled = false; hg.add(m); return m; };
    this.parts = {
      habaki: add(geo.habaki, M.copper, 'habaki'), seppa1: add(geo.seppa1, M.gold, 'seppa1'),
      tsuba: add(geo.tsuba, M.iron, 'tsuba'), seppa2: add(geo.seppa2, M.gold, 'seppa2'),
      fuchi: add(geo.fuchi, M.shakudo, 'fuchi'), tsuka: add(geo.tsuka, M.silk, 'tsuka'),
      kashira: add(geo.kashira, M.shakudo, 'kashira'), mekugi: add(geo.mekugi, M.gold, 'mekugi'),
    };
    this.nakagoMesh = add(geo.nakago, M.nakago, 'nakago'); this.nakagoMesh.visible = false;
    this.sayaG = new Group(); sw.add(this.sayaG);
    this.saya = new Mesh(geo.saya, M.lacquer); this.saya.frustumCulled = false; this.sayaG.add(this.saya);
    this.kurikata = new Mesh(geo.kurikata, M.kurikata); this.kurikata.frustumCulled = false; this.sayaG.add(this.kurikata);
    M.lacquer.uniforms.uSayaLen.value = GM.SAYA_LEN;
    this.sayaG.visible = false;
    // the floor (Tsuba): a plane in the tsuba's frame, on the edge side of the guard
    this.floorU = {
      ...this.U, tGirih: { value: T.girih || null }, uDiscL: { value: v3() }, uTsubaC: { value: v3() }, uAxisW: { value: v3(1, 0, 0) }, uFaceU: { value: v3(0, 0, 1) }, uFaceV: { value: v3(0, 1, 0) },
      uDiscR: { value: 0.335 }, uGain: { value: 0.4 }, uFloorWarm: { value: 0 }, uVig: { value: 1 }, uPxPerUnit: { value: 100 },
      uFloorBase: { value: v3(0.0070, 0.0115, 0.037) }, uLightCol: { value: v3(2.1, 1.42, 0.70) }, uVigC: { value: new Vector2(1.5, 0) }, uVigR: { value: 6 }, uFloorZ: { value: 0.65 },
    };
    this.floor = new Mesh(new PlaneGeometry(30, 30), new ShaderMaterial({ vertexShader: SRC.PLANE_V, fragmentShader: SRC.frag(SRC.FLOOR_F), uniforms: this.floorU, transparent: true, premultipliedAlpha: true, depthWrite: false }));
    this.floor.frustumCulled = false; this.floor.renderOrder = -1; this.floor.visible = false;
    this.floor.position.set(0, 0, 0.72); // the edge side of the guard: the screen's bottom in the opponent's view
    this.floor.rotation.x = Math.PI;      // its face towards the guard (front faces only)
    hg.add(this.floor);
    this.soft = this.soft || new SoftPass(this.renderer);
    this.rays = new Rays(this.renderer, hg);
  }

  // baked textures in place of the stand-ins: uniform values only, no program changes
  swapTextures(T) {
    const M = this.mat;
    if (T.hada) { M.steelU.tHada.value = T.hada; M.lacquer.uniforms.tHada.value = T.hada; }
    if (T.hamon) M.steelU.tHamon.value = T.hamon;
    if (T.silk) M.silk.uniforms.tSilk.value = T.silk;
    if (T.ishime) for (const m of [M.copper, M.gold, M.iron, M.ironFull, M.shakudo, M.nakago]) m.uniforms.tIshime.value = T.ishime;
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
    this.mat.steelU.uRes.value.set(bw, bh);
    this.soft.setSize(bw, bh);
    // the rays are soft: they run at 0.42 of the device resolution (a quarter on T1), whatever the supersampling
    // (G1 r2: 0.5 with 40 samples cost ~120 ms of B14's hold frame in software; 0.42 with 30 about half that)
    this.rays.setSize(bw, bh, (this.tier.tier === 1 ? 0.25 : 0.42) / Math.max(1, this.U.uAA.value));
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
    s.uMacro.value = lk.macro; s.uLampSpec.value = lk.lampSpec;
    s.uGlintGain.value = lk.steelGlint ?? 1; s.uBackEdge.value = lk.backEdge ?? 0;
    for (const m of [this.mat.copper, this.mat.gold]) { const u = m.uniforms; u.uGlintWide.value = lk.fittingsGlintW ?? 1; u.uFill.value.set(...(lk.fittingsFill || [0, 0, 0])); u.uFillDir.value.set(...(lk.fillDirV || [0, 0, 1])); }
    for (const m of [this.mat.iron, this.mat.ironFull]) { m.uniforms.uBackGlow.value.set(...lk.backGlow); m.uniforms.uBase.value.set(...lk.ironBase); }
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
    // the guard's axis for the gilt seppa and the habaki (their face ramp), as the iron's is set per hold
    const ax = this.dirH(new Vector3(1, 0, 0)).normalize();
    for (const m of [this.mat.gold, this.mat.copper]) m.uniforms.uAxisW.value.copy(ax);
  }
  setVis(v) {
    Object.assign(this.vis, v);
    // the floor's girih mask is drawn the first time the floor is shown (B14), never on the boot path
    if (this.vis.floor && !this.floorU.tGirih.value) this.floorU.tGirih.value = girihTexture(Math.min(this.tier.aniso || 4, this.renderer.capabilities.getMaxAnisotropy()));
    const ko = !!this.vis.koshirae;
    for (const k in this.parts) this.parts[k].visible = ko;
    this.nakagoMesh.visible = !!this.vis.nakago;
    this.sayaG.visible = !!this.vis.saya;
    this.floor.visible = !!this.vis.floor;
  }
  // G3 (§2.7): sheath in [0, 1] slides the saya along the blade's arc, about the arc's centre, so the blade stands
  // (1 - sheath) of its length out of the koiguchi; 1 is fully home (the saya's own geometry)
  setSheath(v = 1) {
    const th = (1 - Math.max(0, Math.min(1, v))) * G.L_STRAIGHT / G.R_ARC;
    const te = (G.L_STRAIGHT / 2) / G.R_ARC, cx = G.R_ARC * Math.sin(te), cz = -G.R_ARC * Math.cos(te);
    const m = this.sayaG.matrix;
    this.sayaG.matrixAutoUpdate = false;
    m.makeTranslation(cx, 0, cz).multiply(new Matrix4().makeRotationY(th)).multiply(new Matrix4().makeTranslation(-cx, 0, -cz));
    this.sheath = v;
    this.sheathW = th ? m.clone() : null;
    this.sword.updateMatrixWorld(true);
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
    // the koiguchi rides with the saya (G3: the sheathing slides the saya along the arc, setSheath)
    if (spec === 'koiguchi') return v3(GM.SAYA_MOUTH + 0.02, 0, 0).applyMatrix4(this.handle.matrix).applyMatrix4(this.sheathW || IDENT).applyMatrix4(this.sword.matrixWorld);
    if (spec === 'J') { const J = G.kojiriEnd(sg); return this.world(v3(J[0], 0, J[1])); }
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
  // G3: targetW (a world point) replaces the target between two holds; frame 'floor' takes the orbit in the Tsuba
  // floor's frame (up = the floor's normal, towards the sword), so el 90° looks straight down onto the floor
  solveOrbit({ target, targetW, az = 0, el = 45, dist = 3, vec, fov, ang = 0, chord, off = [0, 0], frame }) {
    const c = this.camera;
    const T = targetW ? targetW.clone() : this.point(typeof target === 'string' ? target : { s: target.s, zf: target.zf ?? 0.5 });
    const head = new Matrix4().makeRotationZ(this.pose.pitch);
    if (frame === 'floor') head.multiply(new Matrix4().makeRotationX(-Math.PI / 2));
    let dir, dd;
    if (vec) { dir = v3(...vec); dd = dir.length(); dir.normalize(); }
    else { dir = v3(Math.sin(az * D) * Math.cos(el * D), Math.sin(el * D), Math.cos(az * D) * Math.cos(el * D)); dd = dist; }
    dir.transformDirection(head);
    c.fov = fov; c.updateProjectionMatrix();
    c.position.copy(T).addScaledVector(dir, dd);
    c.up.set(0, 1, 0).transformDirection(head);
    if (Math.abs(el) > 89) c.up.set(0, 0, -1).transformDirection(head);
    c.lookAt(T); c.updateMatrixWorld();
    const s = typeof target === 'string' || !target ? 0.12 : target.s;
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
  // The opponent's view of the tsuba (B14, §2.5). (a) On the axis: the camera looks back along the blade's chord
  // (guard centre -> tip), so the bent blade (sori 0.3 in this scene) folds onto itself and reads as a short,
  // straight spike seen point-on; along the guard's own normal (the base tangent) the same blade spread into the
  // frame-04 crescent (the tip leaves the tangent by 4 sagittae). (b) Off the axis: 14° towards the edge side and
  // 8° above. (p) The prototype's camera of frame 04, for reference.
  solveGuard({ cand = 'a', frac = 0.47, off = [0, 0], dist = 30, side = 14, up = 8, aim = 1 }) {
    const c = this.camera;
    const tc = this.point('tsuba');
    const axis = this.dirH(v3(1, 0, 0)).normalize();
    let dir;
    // (aim < 1: the camera looks back along the chord from the guard to the blade point at s = aim, dev)
    if (cand === 'a') dir = (aim < 1 ? this.point({ s: aim, zf: 0.5 }) : this.point('T')).sub(tc).normalize();
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

  // the word atlas (gl/sign.js), drawn on first use: the hero never needs it, the boot path starts it after the bakes
  atlas() {
    if (!this._atlas) this._atlas = wordAtlas(this.renderer).then((t) => { this.mat.steelU.uWords.value = t; return t; });
    return this._atlas;
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
    // the reveal at 0 (the intro's first frame, the bookend before its fill): every fragment of the sword would be
    // discarded, so the sword is not drawn at all (§3.6: what is invisible is not drawn)
    const none = this.U.uReveal.value <= 1e-4;
    if (none) this.sword.visible = false;
    // the floor at gain 0 is the ground's own indigo: not drawn (B14, G1 r2: a full-screen pass of ~30 ms in software)
    const noFloor = this.floor && this.floor.visible && this.floorU.uGain.value < 0.002;
    if (noFloor) this.floor.visible = false;
    r.render(this.scene, this.camera);
    if (none) this.sword.visible = true;
    if (noFloor) this.floor.visible = true;
    if (rays) this.rays.draw();
    r.autoClear = true;
    return performance.now() - t0;
  }
  // Prewarm (§6.3): draw each mesh once into the default framebuffer with a 1 × 1 scissor, with its own blend and
  // depth state, so a software renderer builds the real pipeline now and not inside a scene. Returns ms per mesh.
  // finish = false: the draws are only issued, so the main thread goes on while the GPU process compiles
  prewarm(meshes, { finish = true, material = null } = {}) {
    const r = this.renderer, out = {};
    const vis = [];
    this.scene.traverse((o) => { if (o.isMesh) { vis.push([o, o.visible]); o.visible = false; } });
    r.setRenderTarget(null); r.setScissorTest(true); r.setScissor(0, 0, 1, 1);
    for (const m of meshes) {
      const t0 = performance.now();
      // a part of a hidden group (the saya, the floor) is drawn with its ancestors shown for the draw
      const up = []; for (let o = m.parent; o && o !== this.scene; o = o.parent) if (!o.visible) { up.push(o); o.visible = true; }
      const mat = m.material; if (material) m.material = material;
      m.visible = true; r.render(this.scene, this.camera); m.visible = false;
      m.material = mat; for (const o of up) o.visible = false;
      if (finish) this.finish();
      out[(material && material.name) || m.name || m.material.type] = Math.round(performance.now() - t0);
    }
    r.setScissorTest(false);
    for (const [o, v] of vis) o.visible = v;
    return out;
  }
  // resolves when the GPU has executed everything issued so far: a fence polled from timers, so neither the main
  // thread nor the GPU process stalls on a read-back (no "GPU stall due to ReadPixels"); without WebGL2 syncs, a read
  gpuDone() {
    const gl = this.renderer.getContext();
    if (!gl.fenceSync) { this.finish(); return Promise.resolve(); }
    const s = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    return new Promise((res) => {
      const poll = () => {
        if (gl.isContextLost() || gl.getSyncParameter(s, gl.SYNC_STATUS) === gl.SIGNALED) { gl.deleteSync(s); res(); } else setTimeout(poll, 4);
      };
      setTimeout(poll, 0);
    });
  }
  // a full GPU round trip, for timing logs
  finish() { const gl = this.renderer.getContext(); const px = new Uint8Array(4); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); }
}
export { Quaternion, Euler, Matrix3 };
