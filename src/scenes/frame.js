// The film's applier (G3): turns a state descriptor of core/tracks.js (two holds, a transition and the eased progress of
// its groups) into the stage (pose, camera, look, studio, lamp, materials, the reflected sign, shadow, floor) and the
// paper (ground sheets, the drawing, the dial). The frame depends on the descriptor and the viewport only, never on
// the path that led to it: seeking, scrolling and jumping to a beat give the same frame (§3.3 rule 1).
// Cameras between holds (§3.4): two straight-down holds interpolate the paper's similarity (centre, yaw, log of the
// visible half-height, log tan of the half-FOV), so the drawing stays exact; two orbits interpolate their parameters
// (az, el, log dist, log tan FOV, screen angle, offset) and are solved again every frame, so they move on arcs around
// the target; anything else (a crane, the spin's rise) slerps the camera's orientation about the interpolated target
// at a log-interpolated distance. Mode changes otherwise happen under a freeze (fx/cut.js).
import { Vector3, Quaternion, Matrix4 } from 'three';
import { hold as holdOf } from '../core/shots.js';
import { SEQ } from '../core/tracks.js';
import { LOOKS } from '../core/looks.js';
import { ease } from '../core/eases.js';
import { holdStudio, carried, studioBetween } from '../gl/studio.js';
import { Ink, LKT, LKJ, LPLAN } from '../fx/ink.js';
import { SC } from '../sword/drawing.js';

const D = Math.PI / 180, TAU = Math.PI * 2;
const v3 = (x = 0, y = 0, z = 0) => new Vector3(x, y, z);
const lerp = (a, b, t) => a + (b - a) * t;
const lerpA = (a, b, t) => a.map((x, i) => lerp(x, b[i], t));
const angLerp = (a, b, t) => { const d = ((((b - a + Math.PI) % TAU) + TAU) % TAU) - Math.PI; return a + d * t; };
const logLerp = (a, b, t) => Math.exp(lerp(Math.log(Math.max(1e-6, a)), Math.log(Math.max(1e-6, b)), t));
const fovLerp = (fa, fb, t) => (2 * Math.atan(logLerp(Math.tan((fa * D) / 2), Math.tan((fb * D) / 2), t))) / D;
const ZERO = { cam: 0, look: 0, mat: 0, sign: 0, ink: 0 }, ONE = { cam: 1, look: 1, mat: 1, sign: 1, ink: 1 };
const DARK = { sumi: 1, ro: 1, mizu: 1, ai: 1 };
const FIT = { hero: 'mei.hero', intro: 'intro', plan: 'yaki.plan' };
const sameSpec = (x, y) => JSON.stringify(x) === JSON.stringify(y);

export class Film {
  constructor(stage) {
    this.st = stage;
    this.ink = new Ink();
    this.cache = new Map();
    this.html = document.documentElement;
    this.sheets = [...document.querySelectorAll('#paper .sheet')];
    this.opt = {};
    this.gmap = new Map();
  }
  layout() { return this.st.w / this.st.h >= 1.2 ? 'land' : 'port'; }
  reset() { this.cache.clear(); this.softKey = ''; this.dialR = 0; }

  // ---------------- one hold, resolved for this viewport (cached) ----------------
  R(name, layout = this.layout(), opt = this.opt) {
    const key = `${name}|${layout}|${this.st.w}x${this.st.h}|${JSON.stringify(opt)}`;
    let h = this.cache.get(key);
    if (h) return h;
    const st = this.st;
    h = holdOf(name, layout, opt);
    if (!h) throw new Error('no hold ' + name);
    h.reveal = h.program === 'reveal' ? Math.max(0, Math.min(1, h.reveal)) : 1;
    h.L = { ...LOOKS[h.look], ...h.lookOver };
    h.lift = h.cam.mode === 'td' ? h.cam.lift : (h.pose.lift || 0);
    h.sheath = h.saya ? (h.sheath ?? 1) : 1;
    h.cam = normCam(h.cam, st.w, st.h);
    // at its own pose: the camera, the studio carried by it, the lamp, the light, the drawing's place on the paper
    this.pose(h.pose.roll, h.pose.pitch, h.pose.sori, h.lift, h, h.sheath);
    st.solve(h.cam);
    const c = st.camera;
    h.sol = { pos: c.position.clone(), quat: c.quaternion.clone(), fov: c.fov, off: h.cam.off || [0, 0], T: targetOf(st, h.cam), td: st.td && h.cam.mode === 'td' ? { ...st.td, C: st.td.C.clone(), r: st.td.r.clone(), d: st.td.d.clone() } : null };
    h.M = holdStudio(h.studioRoll || 0, h.studioYaw || 0);
    h.C = carried(h.M, c);
    h.lightW = lightOf(h, h.sol.td);
    if (h.dial && st.td) { h.hubPx = st.project(st.point('tsuba')); h.paperK = st.td.f / st.td.Hc; }
    if (h.ink) h.inkPose = this.inkPose(h, layout, opt);
    this.cache.set(key, h);
    return h;
  }
  pose(roll, pitch, sori, lift, vis, sheath) {
    const st = this.st;
    st.setPose({ roll, pitch, sori, lift });
    st.setVis({ koshirae: vis.koshirae, nakago: vis.nakago, saya: vis.saya, floor: vis.floor });
    st.setSheath(sheath);
    // sheathed, the habaki is inside the koiguchi: not drawn (G1: its wedge would cut through the mouth as a sliver)
    if (vis.saya && sheath >= 0.999) st.parts.habaki.visible = false;
  }
  // the drawing's pose on the paper: its two axis points land where the fit hold's camera sees the sword's, plus an
  // offset in px (the drawing lies beside the lifted sword like a shadow)
  inkPose(h, layout, opt) {
    const st = this.st, ink = h.ink, draw = ink.draw || 'hero';
    const fitName = FIT[ink.fit] || ink.fit || h.name;
    const F = fitName === h.name ? h : this.R(fitName, layout, opt);
    this.pose(F.pose.roll, F.pose.pitch, F.pose.sori, F.lift, F, F.sheath);
    st.solve(F.cam);
    if (!st.td) return null;
    const pts = draw === 'saya' ? ['K', 'J'] : draw === 'plan' ? [{ s: 0, zf: 0 }, { s: 1, zf: 0 }] : ['K', 'T'];
    const Lsvg = draw === 'saya' ? LKJ() : draw === 'plan' ? LPLAN() : LKT;
    const sc = layout === 'land' ? Math.min(st.w / 1440, st.h / 900) : st.w / 390;
    const off = ink.off || [0, 0];
    const back = ([sx, sy]) => { const td = st.td, k = td.Hc / td.f, a = (sx - st.w / 2) * k, b = (sy - st.h / 2) * k; return [td.C.x + td.r.x * a + td.d.x * b, td.C.z + td.r.z * a + td.d.z * b]; };
    const [P0, P1] = pts.map((p) => { const s = st.project(st.point(p)); return back([s[0] + off[0] * sc, s[1] + off[1] * sc]); });
    const pose = { O: P0, a: Math.atan2(P1[1] - P0[1], P1[0] - P0[0]), k: Math.hypot(P1[0] - P0[0], P1[1] - P0[1]) / (Lsvg / SC) };
    // restore the hold's own pose and camera (R() goes on with them)
    this.pose(h.pose.roll, h.pose.pitch, h.pose.sori, h.lift, h, h.sheath);
    st.solve(h.cam);
    return pose;
  }

  // ---------------- one frame ----------------
  apply(d, { dom = true } = {}) {
    const st = this.st, layout = d.layout || this.layout();
    let A = this.R(d.a, layout), B = this.R(d.b, layout), e = d.e, p = d.p;
    if (d.live === 'a') { B = A; e = ZERO; p = ZERO; } else if (d.live === 'b') { A = B; e = ONE; p = ONE; }
    const tr = d.tr || {}, same = A === B;
    // every hold this frame needs is resolved before the stage is posed (R() poses and solves the stage itself)
    if (d.atHold && d.layout && !d.intro && d.pos != null) this.neighbours(d);
    if (!this.dialR) {
      const h17 = this.R('toki.0900', layout);
      this.dialR = (layout === 'land' ? 0.40 * st.h : 0.40 * st.w) / (h17.sol.td.f / h17.sol.td.Hc);
    }
    const sw = same || p.cam >= (tr.swap || 0.5);
    const H = sw ? B : A; // the hold whose discrete keys (visibility, programs) are live
    // pose: the spin adds one full roll; its blade straightens over the first half of the window
    const ec = e.cam;
    const roll = lerp(A.pose.roll, B.pose.roll, ec) + (!same && tr.spin ? tr.spin * ec : 0);
    const sori = !same && tr.type === 'spin' ? lerp(A.pose.sori, B.pose.sori, ease('cam')(Math.min(1, p.cam * 2))) : lerp(A.pose.sori, B.pose.sori, ec);
    const sheath = lerp(A.sheath, B.sheath, e.mat);
    this.pose(roll, lerp(A.pose.pitch, B.pose.pitch, ec), sori, lerp(A.lift, B.lift, ec), H, sheath);
    // look (every value mixed in linear space)
    const L = same ? A.L : mixLook(A.L, B.L, e.look);
    st.applyLook(H.look, L);
    // camera
    this.camera(A, B, ec, d.push || 0);
    // the studio: carried by the camera between holds, M[k] exactly at a hold (§3.5)
    const M = same || ec <= 0 ? A.M : ec >= 1 ? B.M : studioBetween({ Mk: A.M, Mk1: B.M, Ck: A.C, Ck1: B.C, camera: st.camera, e: ec, studioW: tr.studioW ?? 0.3 });
    st.studioM = M; st.U.uStudio.value.setFromMatrix4(M);
    // materials
    const U = st.U, sU = st.mat.steelU, Mt = st.mat, P = st.parts;
    const reveal = lerp(A.reveal, B.reveal, e.mat), isRev = reveal < 0.999;
    // the wipe front stays lit while it travels (the prototype's uFront 1 for every reveal < 1, §4.1 frame 02) and goes
    // out over the last 4 % to the tip; mixed with the reveal itself, only a third of it was left at 3 s (G1 r2)
    const fr0 = Math.max(A.front || 0, B.front || 0);
    const front = isRev && fr0 > 0 ? fr0 * Math.min(1, Math.max(0, (1 - reveal) / 0.04)) : lerp(A.front || 0, B.front || 0, e.mat);
    const polishFront = lerp(A.polishFront, B.polishFront, e.mat);
    U.uReveal.value = isRev ? reveal : 2; U.uFront.value = front;
    sU.uPolishFront.value = polishFront;
    const lean = /^(intro|mei\.|bookend\.)/.test(H.name);
    P.tsuba.material = lean ? Mt.iron : Mt.ironFull;
    const ax = st.dirH(v3(1, 0, 0)).normalize(), fu = st.dirH(v3(0, 0, 1)).normalize(), fv = st.dirH(v3(0, 1, 0)).normalize();
    for (const m of [Mt.iron, Mt.ironFull]) { m.uniforms.uAxisW.value.copy(ax); m.uniforms.uFaceU.value.copy(fu); m.uniforms.uFaceV.value.copy(fv); }
    // the lamp
    this.lamp(A, B, ec, reveal, same);
    // the reflected sign
    const signA = this.sign(A, B, e, p, tr, same);
    st.blade.material = isRev ? Mt.steel : polishFront < 1.5 ? Mt.steelTogi : signA > 0 ? Mt.steelSign : Mt.steel;
    // the floor and the lamp disc (Tsuba)
    if (st.vis.floor) {
      const F = st.floorU;
      F.uTsubaC.value.copy(st.point('tsuba')); F.uAxisW.value.copy(ax); F.uFaceU.value.copy(fu); F.uFaceV.value.copy(fv);
      F.uDiscL.value.copy(st.worldH(v3(-1.15, 0, 0)));
      F.uGain.value = lerp(A.floorGain ?? 1, B.floorGain ?? 1, e.look);
      F.uFloorWarm.value = lerp(A.floorWarm || 0, B.floorWarm || 0, e.look);
    }
    // the soft shadow: re-rendered only when what casts it or what lights it changes
    const sh = lerp(A.shadow || 0, B.shadow || 0, e.mat);
    this.shadowOn = sh > 0.001;
    if (this.shadowOn) {
      const Lw = A.lightW.clone().lerp(B.lightW, e.look).normalize();
      const lk = st.look, key = [roll, sori, st.pose.lift, st.pose.pitch, sheath, Lw.x, Lw.y, Lw.z, sh, isRev ? reveal : 2, lk.shadowA, lk.shadowSoft, st.vis.koshirae, st.vis.nakago].map((x) => (+x).toFixed(4)).join();
      if (key !== this.softKey) {
        st.soft.update(st, Lw, { soft: lk.shadowSoft, base: lk.shadowBase, col: lk.shadowCol, alpha: lk.shadowA * sh, reveal: isRev ? reveal : 2 });
        this.softKey = key;
      }
    }
    this.raysOn = !!H.rays && !!d.settled;
    // the paper
    this.inkFrame(A, B, e, d, reveal, isRev, front);
    if (dom) this.paper(A, B, e, d);
    this.H = H; this.d = d;
    return H;
  }
  render() { return this.st.render({ shadow: !!this.shadowOn, rays: !!this.raysOn }); }

  camera(A, B, t, push) {
    const st = this.st, c = st.camera, ca = A.cam, cb = B.cam;
    let T = null;
    if (A === B || t <= 0 || t >= 1) {
      const H = t >= 1 ? B : A;
      st.solve(H.cam); T = targetOf(st, H.cam);
    } else if (ca.mode === 'td' && cb.mode === 'td' && sameSpec([ca.A, ca.a, ca.B, ca.b], [cb.A, cb.a, cb.B, cb.b])) {
      // the same anchors (the intro's and the bookend's lift): solved again at the interpolated FOV, exact framing
      st.solve({ ...cb, fov: fovLerp(ca.fov, cb.fov, t) }); T = targetOf(st, cb);
    } else if (ca.mode === 'td' && cb.mode === 'td' && A.sol.td && B.sol.td) {
      const a = A.sol.td, b = B.sol.td, ta = Math.tan((A.sol.fov * D) / 2), tb = Math.tan((B.sol.fov * D) / 2);
      const yl = lerp(A.lift, B.lift, t), tt = logLerp(ta, tb, t);
      const h = logLerp((a.Hc - A.lift) * ta, (b.Hc - B.lift) * tb, t);
      const Hc = yl + h / tt, fov = (2 * Math.atan(tt)) / D, phi = angLerp(a.phi, b.phi, t);
      const C = v3(lerp(a.C.x, b.C.x, t), Hc, lerp(a.C.z, b.C.z, t));
      const r = v3(Math.cos(phi), 0, Math.sin(phi)), dd = v3(-Math.sin(phi), 0, Math.cos(phi));
      c.clearViewOffset(); c.fov = fov; c.position.copy(C); c.up.copy(dd).negate(); c.lookAt(C.x, 0, C.z); c.updateProjectionMatrix(); c.updateMatrixWorld();
      st.td = { f: (st.h / 2) / Math.tan((fov * D) / 2), Hc, r, d: dd, C, phi };
      st.clip(); T = v3(C.x, 0, C.z);
    } else if (ca.mode === 'orbit' && cb.mode === 'orbit' && (ca.frame || '') === (cb.frame || '')) {
      const o = { az: lerp(ca.az, cb.az, t), el: lerp(ca.el, cb.el, t), dist: logLerp(ca.dist, cb.dist, t), fov: fovLerp(ca.fov, cb.fov, t), ang: angLerp(ca.ang * D, cb.ang * D, t) / D, off: lerpA(ca.off || [0, 0], cb.off || [0, 0], t), frame: ca.frame };
      const sa = chordOf(ca), sb = chordOf(cb);
      o.chord = lerpA(sa, sb, t);
      if (typeof ca.target === 'object' && typeof cb.target === 'object') o.target = { s: lerp(ca.target.s, cb.target.s, t), zf: lerp(ca.target.zf ?? 0.5, cb.target.zf ?? 0.5, t) };
      else if (ca.target === cb.target) o.target = ca.target;
      else o.targetW = A.sol.T.clone().lerp(B.sol.T, t);
      st.td = null; c.clearViewOffset(); st.solveOrbit(o); st.clip();
      T = o.targetW || st.point(typeof o.target === 'string' ? o.target : o.target);
    } else {
      // a change of camera mode in a continuous move: the orientation slerps about the interpolated target
      const a = A.sol, b = B.sol;
      T = a.T.clone().lerp(b.T, t);
      const dist = logLerp(a.pos.distanceTo(a.T), b.pos.distanceTo(b.T), t);
      const q = a.quat.clone().slerp(b.quat, t);
      c.clearViewOffset(); c.fov = fovLerp(a.fov, b.fov, t); c.quaternion.copy(q);
      c.position.copy(T).addScaledVector(v3(0, 0, 1).applyQuaternion(q), dist);
      c.updateProjectionMatrix(); c.updateMatrixWorld();
      const off = lerpA(a.off, b.off, t);
      if (off[0] || off[1]) c.setViewOffset(st.w, st.h, off[0] * st.w, off[1] * st.h, st.w, st.h);
      st.td = null; st.clip();
    }
    // under a freeze the incoming camera eases into its hold from a little further back
    if (push > 0 && T) {
      c.position.sub(T).multiplyScalar(1 + 0.14 * push).add(T); c.updateMatrixWorld();
      if (st.td) { st.td.Hc = c.position.y; st.td.C = c.position.clone(); }
      st.clip();
    }
  }

  // the lamp: its glint lands on blade point (s, zf) (§3.5), or it stands where the hold put it
  lamp(A, B, t, reveal, same) {
    const st = this.st, U = st.U;
    const gs = (h) => (h.glint ? { s: h.glint.s === 'front' ? Math.max(0.05, Math.min(0.95, (reveal * 10.06 - 3.06) / 7.0 - 0.03)) : h.glint.s, zf: h.glint.zf, dist: h.glint.dist } : null);
    const ga = gs(A), gb = gs(B);
    if (ga && gb) { st.lampGlint(lerp(ga.s, gb.s, t), lerp(ga.zf, gb.zf, t), lerp(ga.dist, gb.dist, t)); return; }
    if (same || t <= 0 || t >= 1) { this.lampOf(same || t <= 0 ? A : B, gs); return; }
    this.lampOf(A, gs); const pa = U.uLampPos.value.clone(), da = U.uGlintDir.value.clone();
    this.lampOf(B, gs);
    U.uLampPos.value.lerpVectors(pa, U.uLampPos.value.clone(), t);
    U.uGlintDir.value.lerpVectors(da, U.uGlintDir.value.clone(), t).normalize();
  }
  lampOf(h, gs) {
    const st = this.st, U = st.U;
    const g = gs(h);
    if (g) { st.lampGlint(g.s, g.zf, g.dist); return; }
    if (h.lampPos && h.lampPos.tsuba) {
      const tc = st.point('tsuba'), ax = st.dirH(v3(1, 0, 0)).normalize();
      U.uLampPos.value.copy(tc).addScaledVector(ax, 6).add(v3(5, 0, -7));
      U.uGlintDir.value.copy(ax).negate();
    } else if (h.lampPos && h.lampPos.at) {
      const a = st.point({ s: h.lampPos.at.s, zf: h.lampPos.at.zf });
      U.uLampPos.value.copy(a).add(v3(...h.lampPos.add));
      U.uGlintDir.value.copy(U.uLampPos.value).sub(a).normalize();
    }
  }

  // the reflected words (§2.2): solved at the current camera; rows crossfade, stretch and slide between holds
  sign(A, B, e, p, tr, same) {
    const st = this.st, sU = st.mat.steelU, sa = A.sign, sb = B.sign;
    if (!sa && !sb) { sU.uWordAlpha.value = 0; return 0; }
    if (!sU.uWords.value) { st.atlas().then(() => { this.dirty = true; }); sU.uWordAlpha.value = 0; return 0; }
    const place = (x) => ({ s: x.s, zf: x.zf ?? 0.56, width: x.width ?? 4.0, dist: x.dist ?? 5.0 });
    let alpha;
    if (sa && sb && !same) {
      const a = place(sa), b = place(sb), t = e.cam;
      st.solveSign({ s: lerp(a.s, b.s, t), zf: lerp(a.zf, b.zf, t), width: lerp(a.width, b.width, t), dist: lerp(a.dist, b.dist, t) });
      alpha = lerp(sa.alpha, sb.alpha, t);
      if (tr.flip) {
        // the word changes flat with the roll: it fades out while the edge passes the camera, the new one arrives
        const q = p.cam, dip = q < 0.3 || q > 0.7 ? 1 : Math.abs(q - 0.5) / 0.2;
        alpha *= dip * dip;
        sU.uWordRowA.value = q < 0.5 ? sa.row : sb.row; sU.uWordMix.value = 0; sU.uWordStretch.value = 1; sU.uWordSlide.value = 0;
      } else {
        const m = e.sign;
        sU.uWordRowA.value = sa.row; sU.uWordRowB.value = sb.row; sU.uWordMix.value = m;
        sU.uWordStretch.value = 1 + 0.6 * Math.sin(Math.PI * m); sU.uWordSlide.value = 0.3;
      }
    } else {
      const h = sa || sb, x = place(h);
      st.solveSign(x);
      alpha = same ? h.alpha : h.alpha * (sa ? 1 - e.sign : e.sign);
      sU.uWordRowA.value = h.row; sU.uWordMix.value = 0; sU.uWordStretch.value = 1; sU.uWordSlide.value = 0;
    }
    sU.uWordAlpha.value = alpha;
    return alpha;
  }

  // the drawing on the paper: exact while the camera looks straight down, faded where one side has none
  inkFrame(A, B, e, d, reveal, isRev, front) {
    const ia = A.ink, ib = B.ink, t = e.ink;
    let pose = null, draw = 'hero', alpha = 0, annot = true;
    if (ia && ib && (ia.draw || 'hero') === (ib.draw || 'hero') && A.inkPose && B.inkPose) {
      const a = A.inkPose, b = B.inkPose;
      pose = A === B ? a : { O: lerpA(a.O, b.O, t), a: angLerp(a.a, b.a, t), k: logLerp(a.k, b.k, t) };
      draw = ia.draw || 'hero'; alpha = lerp(ia.alpha ?? 1, ib.alpha ?? 1, t); annot = (t < 0.5 ? ia : ib).annot !== false;
    } else if (ia || ib) {
      const h = ia ? A : B, x = h.ink;
      pose = h.inkPose; draw = x.draw || 'hero'; alpha = (x.alpha ?? 1) * (ia ? 1 - t : t); annot = x.annot !== false;
    }
    this.ink.film(this.st, pose, { draw, alpha, reveal: isRev ? reveal : 2, front, annot, crisp: !!d.settled });
  }

  // the DOM part of the paper: the ground sheets, the dial, the plaster's light
  paper(A, B, e, d) {
    const html = this.html, ga = A.ground, gb = B.ground, near = e.look < 0.5 ? A : B;
    // at a hold the grounds of the neighbouring holds are displayed too, all but invisible, so their tiles are
    // rasterised before a transition needs them (§3.1: the current and the incoming sheet)
    const pre = new Set();
    if (d.settled && d.layout && !d.intro && ga === gb) for (const n of this.neighbours(d)) pre.add(n.ground);
    pre.delete(ga);
    for (const s of this.sheets) {
      const g = s.dataset.g, on = g === ga || g === gb || pre.has(g);
      if (s.classList.contains('on') !== on) s.classList.toggle('on', on);
      const op = pre.has(g) && g !== gb ? '0.002' : ga !== gb && g === gb ? e.look.toFixed(3) : '', z = pre.has(g) && g !== gb ? '-1' : ga !== gb && g === gb ? '1' : '';
      if (s.style.opacity !== op) s.style.opacity = op;
      if (s.style.zIndex !== z) s.style.zIndex = z;
    }
    this.colours(d);
    this.dial(A, B, e, d);
    // the plaster's raking light and the dial's engraving follow the sun: exact at a hold, in 5° steps between holds
    // (each step re-rasterises the plaster and the dial)
    // (between holds the sun keeps the nearer hold's angle: every change re-rasterises the plaster and the dial's
    // engraving, about half a second on a software renderer)
    const sunH = e.look < 0.5 ? A.sun || B.sun : B.sun || A.sun;
    if (sunH) { const v = `${(sunH.az + 180).toFixed(1)}deg`; if (this.sunV !== v) { this.sunV = v; html.style.setProperty('--sun-a', v); } }
  }
  // the page's colours (html data-ground, .dark: the nav, the ruler, the text): the nearer hold's ground; under a
  // freeze the incoming one's, before it (d.pre, the incoming hold drawn under the closed sheet) still the outgoing
  // one's. Written on every DOM update (core/film.js), not only with a GL frame: a freeze draws one GL frame
  colours(d) {
    const lay = d.layout || this.layout(), g = (n) => { const k = n + '|' + lay; let v = this.gmap.get(k); if (v === undefined) { v = holdOf(n, lay, this.opt).ground; this.gmap.set(k, v); } return v; };
    const ga = g(d.a), gb = g(d.b);
    const nearG = d.pre || d.live === 'a' ? ga : d.live === 'b' ? gb : d.f < 0.5 ? ga : gb;
    const html = this.html;
    if (html.dataset.ground !== nearG) { html.dataset.ground = nearG; html.classList.toggle('dark', !!DARK[nearG]); }
  }
  // a hold with the dial within two beats of the position (the track's own order)
  nearDial(d) {
    const names = SEQ[d.layout].names, k = Math.round(d.pos ?? 0);
    for (let j = Math.max(0, k - 2); j <= Math.min(names.length - 1, k + 2); j++) if (/^toki\./.test(names[j])) return true;
    return false;
  }
  // the holds next to the one in view (for priming what a transition will need)
  neighbours(d) {
    const seq = SEQ[d.layout], k = Math.round(d.pos), out = [];
    for (const j of [k - 1, k + 1]) if (j >= 0 && j < seq.names.length) out.push(this.R(seq.names[j], d.layout));
    return out;
  }
  dial(A, B, e, d = {}) {
    const st = this.st, da = A.dial, db = B.dial;
    if (!this.dialW) {
      this.dialW = document.getElementById('dialw');
      this.clk = { tas: document.querySelector('.clocks-big .tas'), tok: document.querySelector('.clocks-big .tok') };
    }
    const w = this.dialW;
    if (!w) return;
    if (!(da || db) || !st.td) {
      // near Toki (two beats either side) the dial stays on screen, all but invisible, at its B17 place: it is
      // rasterised once, at a hold, and never dropped and drawn again on the way in or out (its SVG is the costliest
      // layer of the page in software: a re-raster held the compositor for a second or more, G3)
      const near = d.layout && !d.intro && this.dialR && this.nearDial(d) ? this.R('toki.0900', d.layout) : null;
      if (near && this.dialR && near.hubPx) {
        w.style.visibility = ''; w.style.opacity = '0.002';
        const rpx = this.dialR * near.paperK;
        w.style.transform = `translate(${(near.hubPx[0] - 500).toFixed(2)}px,${(near.hubPx[1] - 500).toFixed(2)}px) scale(${(rpx / 350).toFixed(5)})`;
      } else if (w.style.visibility !== 'hidden') w.style.visibility = 'hidden';
      return;
    }
    // the dial lies on the paper: its size is fixed in sword units (the inner ring 0.40 H at B17, 0.40 W on the phone)
    if (!this.dialR) return;
    const k = st.td.f / st.td.Hc, rpx = this.dialR * k;
    const hub = st.project(st.point('tsuba'));
    const alpha = da && db ? 1 : da ? 1 - e.look : e.look;
    w.style.visibility = alpha > 0.002 ? '' : 'hidden';
    w.style.opacity = alpha < 0.999 ? alpha.toFixed(3) : '';
    w.style.transform = `translate(${(hub[0] - 500).toFixed(2)}px,${(hub[1] - 500).toFixed(2)}px) scale(${(rpx / 350).toFixed(5)})`;
    // (#dialw is its own layer for good, cinema.css: toggling it at holds re-rasterised the whole dial, ~0.5 s)
    // the big clocks count with the hand (Tashkent; Tokyo four hours later)
    const hour = da && db ? lerp(da.hour, db.hour, e.cam) : (da || db).hour;
    const m = Math.round(hour * 60), fmt = (x) => `${String(Math.floor(x / 60) % 24).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`;
    if (this.clk.tas && this.lastMin !== m) { this.lastMin = m; this.clk.tas.textContent = fmt(m); if (this.clk.tok) this.clk.tok.textContent = fmt(m + 240); }
  }
}

// ---------------- helpers ----------------
function normCam(c, w, h) {
  c = { ...c };
  if (c.mode === 'orbit' && c.vec) {
    const [x, y, z] = c.vec, dist = Math.hypot(x, y, z);
    c.az = Math.atan2(x, z) / D; c.el = Math.asin(y / dist) / D; c.dist = dist; delete c.vec;
  }
  if (c.mode === 'td' && c.hand) {
    // the hour hand: 24 h on the dial, 12 at the top, clockwise 15° per hour
    const a = (c.hand.hour - 12) * 15 * D, len = c.hand.lenW ? c.hand.lenW * w : c.hand.len * h;
    c.b = [c.a[0] + (len * Math.sin(a)) / w, c.a[1] - (len * Math.cos(a)) / h];
    delete c.hand;
  }
  return c;
}
function chordOf(c) {
  if (c.chord) return c.chord;
  const s = c.target && typeof c.target === 'object' ? c.target.s : 0.12;
  return [Math.max(0.02, s - 0.1), Math.min(0.98, s + 0.1)];
}
// the point the camera looks at, on its axis: the paper under the centre (straight down), the orbit's target, the tsuba
function targetOf(st, cam) {
  if (cam.mode === 'td' && st.td) return v3(st.td.C.x, 0, st.td.C.z);
  if (cam.mode === 'guard' && st.guard) return st.guard.tc.clone();
  if (cam.mode === 'orbit') return cam.targetW ? cam.targetW.clone() : st.point(typeof cam.target === 'string' ? cam.target : { s: cam.target.s, zf: cam.target.zf ?? 0.5 });
  return st.camera.position.clone().add(v3(0, 0, -5).applyQuaternion(st.camera.quaternion));
}
// the direction towards the shadow light in world space: the sun (az clockwise from the screen's top, el) or the
// hold's own direction, both taken in the straight-down camera's frame when there is one (as G1's Poster)
function lightOf(h, td) {
  let Ld = h.light.dir;
  if (h.sun) { const a = h.sun.az * D, el = h.sun.el * D; Ld = [Math.sin(a) * Math.cos(el), Math.sin(el), -Math.cos(a) * Math.cos(el)]; }
  if (!td) return v3(...Ld).normalize();
  return td.r.clone().multiplyScalar(Ld[0]).add(v3(0, Ld[1], 0)).addScaledVector(td.d, Ld[2]).normalize();
}
function mixLook(a, b, t) {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const out = {};
  for (const k in a) {
    const x = a[k], y = b[k];
    if (Array.isArray(x) && Array.isArray(y)) out[k] = lerpA(x, y, t);
    else if (typeof x === 'number' && typeof y === 'number') out[k] = lerp(x, y, t);
    else out[k] = t < 0.5 ? x : y;
  }
  return out;
}
export { Quaternion, Matrix4 };
