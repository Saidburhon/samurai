// The hold renderer: puts the stage and the DOM into the exact state of one hold (?beat=name or ?beat=k), renders it
// once at the hold resolution and reports through window.__qilich. G1 uses it for the material lock and poster-test;
// from G3 the director drives the same apply() every frame from evalS(beat).
//   ?beat=mei.hero | 0          a hold by name or number
//   ?beat=intro&reveal=0.755    the intro's reveal state (the 3 s frame)
//   ?cand=a|b|p                 B14: the horn candidate (p = the prototype camera of frame 04)
import { Vector3 } from 'three';
import { BEATS, PHONE, SCENE_OF, hold } from './shots.js';
import { Ink } from '../fx/ink.js';
import * as G from '../sword/geom-core.js';

const Q = window.__qilich || (window.__qilich = {});
const html = document.documentElement;
const DARK = { sumi: 1, ro: 1, mizu: 1, ai: 1 };
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));

export function parseBeat(q = new URLSearchParams(location.search)) {
  let b = q.get('beat') || 'mei.hero';
  if (/^\d+$/.test(b)) b = BEATS[+b] || 'mei.hero';
  return b;
}

// the DOM side of a hold: the scene, the beat's own elements, the ground, the nav's colour, the ruler
export function domHold(name) {
  const scene = name === 'intro' ? 'mei' : SCENE_OF(name);
  const beatName = name === 'intro' ? 'mei.hero' : name;
  html.dataset.beat = name;
  for (const s of document.querySelectorAll('#story > .scene')) s.classList.toggle('on', s.id === scene);
  for (const el of document.querySelectorAll('#story [data-beat]')) el.classList.toggle('now', el.dataset.beat.split(/\s+/).includes(beatName));
  const ground = (hold(beatName, 'land') || {}).ground || 'washi';
  html.dataset.ground = ground;
  html.classList.toggle('dark', !!DARK[ground]);
  for (const sh of document.querySelectorAll('#paper .sheet')) sh.classList.toggle('on', sh.dataset.g === ground);
  const scenes = ['mei', 'xizmatlar', 'jarayon', 'kaizen', 'tsuba', 'vaqt', 'aloqa'];
  document.querySelectorAll('.ruler li').forEach((li, i) => li.classList.toggle('on', scenes[i] === scene));
  // the services list: the active items of the Utsuri beat (data-g groups: B2 = 1, B3 = 2, …, B6 = 5)
  const g = { 'utsuri.ios': '1', 'utsuri.web': '2', 'utsuri.telegram': '3', 'utsuri.backend': '4', 'utsuri.ai': '5' }[beatName];
  for (const li of document.querySelectorAll('.svc li')) li.classList.toggle('on', li.dataset.g === g);
  // the hanko stands beside the phone number in the contact poster (cloned from the hero's, it carries no text)
  const row = document.querySelector('.contact .row');
  if (row && !row.querySelector('.hanko-c')) { const h = document.querySelector('.s-mei .hanko svg'); if (h) { const i = document.createElement('i'); i.className = 'hanko-c'; i.setAttribute('aria-hidden', 'true'); i.appendChild(h.cloneNode(true)); row.appendChild(i); } }
}

// a part label in the label style (kanji 26 px, gloss 15 px) with a hairline leader, at a screen point
function label(key, at, dir = [0, -1], len = 40) {
  const lay = document.getElementById('labels');
  const tpl = document.querySelector(`#strings [data-k="${key}"]`);
  if (!lay || !tpl) return;
  const el = document.createElement('div');
  el.className = 'plabel';
  const end = [at[0] + dir[0] * len, at[1] + dir[1] * len];
  el.innerHTML = `<svg class="lead" width="100%" height="100%"><path d="M${at[0].toFixed(1)} ${at[1].toFixed(1)}L${end[0].toFixed(1)} ${end[1].toFixed(1)}"/><circle cx="${at[0].toFixed(1)}" cy="${at[1].toFixed(1)}" r="1.8"/></svg><span class="lt" style="left:${end[0].toFixed(1)}px;top:${end[1].toFixed(1)}px">${tpl.innerHTML}</span>`;
  lay.appendChild(el);
}

export class Poster {
  constructor(stage) {
    this.stage = stage;
    this.ink = new Ink();
  }
  layout() { return this.stage.w / this.stage.h >= 1.2 ? 'land' : 'port'; }
  // the drawing's pose on the paper for a fit ('hero': the B0 framing plus its offset; 'intro': registered)
  inkPoseFor(fit, layout) {
    const st = this.stage;
    const src = hold(fit === 'intro' ? 'intro' : 'mei.hero', layout);
    st.setPose({ ...src.pose, lift: src.cam.lift });
    st.solve(src.cam);
    const Ks = st.project(st.point('K')), Ts = st.project(st.point('T'));
    const sc = layout === 'land' ? Math.min(st.w / 1440, st.h / 900) : st.w / 390;
    return poseFrom(st, Ks, Ts, src.ink.off, sc);
  }
  async apply(name, opt = {}) {
    const st = this.stage, layout = this.layout();
    const S = hold(name, layout, opt);
    if (!S) throw new Error('no hold ' + name);
    domHold(name);
    document.getElementById('labels').innerHTML = '';
    // the ink pose comes from its own framing, before this hold's camera is solved
    const inkPose = S.ink ? this.inkPoseFor(S.ink.fit, layout) : null;
    // look, pose, visibility, camera
    st.applyLook(S.look, S.lookOver);
    st.setStudio(S.studioRoll || 0, S.studioYaw || 0);
    st.setPose({ ...S.pose, lift: S.cam.mode === 'td' ? S.cam.lift : 0 });
    st.setVis({ koshirae: S.koshirae, nakago: S.nakago, saya: S.saya, floor: S.floor });
    st.solve(S.cam);
    // materials
    const sU = st.mat.steelU, U = st.U;
    const reveal = S.program === 'reveal';
    st.blade.material = S.polishFront < 1.5 ? st.mat.steelTogi : S.sign ? st.mat.steelSign : st.mat.steel;
    const P = st.parts, R = st.mat.reveal, M = st.mat;
    P.habaki.material = reveal ? R.copper : M.copper; P.seppa1.material = P.seppa2.material = reveal ? R.gold : M.gold;
    P.tsuba.material = reveal ? R.iron : M.iron; P.fuchi.material = P.kashira.material = reveal ? R.shakudo : M.shakudo;
    P.tsuka.material = reveal ? R.silk : M.silk; P.mekugi.material = reveal ? R.gold : M.gold;
    U.uReveal.value = reveal ? S.reveal : 2; U.uFront.value = S.front;
    sU.uPolishFront.value = S.polishFront;
    // the lamp
    if (S.glint) {
      let s = S.glint.s;
      if (s === 'front') s = Math.max(0.05, Math.min(0.95, (S.reveal * 10.06 - 3.06) / 7.0 - 0.03));
      st.lampGlint(s, S.glint.zf, S.glint.dist);
    } else if (S.lampPos && S.lampPos.at) {
      const a = st.point({ s: S.lampPos.at.s, zf: S.lampPos.at.zf });
      U.uLampPos.value.copy(a).add(new Vector3(...S.lampPos.add));
    } else if (S.lampPos && S.lampPos.tsuba) {
      const tc = st.point('tsuba'), ax = st.dirH(new Vector3(1, 0, 0)).normalize();
      U.uLampPos.value.copy(tc).addScaledVector(ax, 6).add(new Vector3(5, 0, -7));
      U.uGlintDir.value.copy(ax).negate();
    }
    // the iron's frame (the tsuba face) for the ishime normal map and the back glow
    const ax = st.dirH(new Vector3(1, 0, 0)).normalize();
    for (const m of [M.iron, R.iron]) { m.uniforms.uAxisW.value.copy(ax); m.uniforms.uFaceU.value.copy(st.dirH(new Vector3(0, 0, 1)).normalize()); m.uniforms.uFaceV.value.copy(st.dirH(new Vector3(0, 1, 0)).normalize()); }
    // the reflected sign
    if (S.sign) {
      await st.atlas;
      st.solveSign({ s: S.sign.s, zf: S.sign.zf });
      sU.uWordAlpha.value = S.sign.alpha; sU.uWordRowA.value = S.sign.row; sU.uWordMix.value = 0;
    } else sU.uWordAlpha.value = 0;
    // the floor and the lamp disc (Tsuba)
    if (S.floor) {
      const fu = st.floorU, tc = st.point('tsuba');
      fu.uTsubaC.value.copy(tc); fu.uAxisW.value.copy(ax);
      fu.uFaceU.value.copy(st.dirH(new Vector3(0, 0, 1)).normalize()); fu.uFaceV.value.copy(st.dirH(new Vector3(0, 1, 0)).normalize());
      fu.uDiscL.value.copy(st.worldH(new Vector3(-1.15, 0, 0)));
      fu.uGain.value = S.floorGain ?? 1;
    }
    // the soft shadow
    if (S.shadow) {
      const td = st.td, Ld = S.light.dir;
      const L = td ? td.r.clone().multiplyScalar(Ld[0]).add(new Vector3(0, Ld[1], 0)).addScaledVector(td.d, Ld[2]) : new Vector3(...Ld);
      st.soft.update(st, L, { soft: st.look.shadowSoft, base: st.look.shadowBase, col: st.look.shadowCol, alpha: st.look.shadowA * S.shadow, reveal: reveal ? S.reveal : 2 });
    }
    // the ink
    if (S.ink && st.td) this.ink.place(st, inkPose, { reveal: reveal ? S.reveal : 2, front: S.front, show: true, annot: S.ink.annot !== false });
    else this.ink.place(st, null, { show: false });
    this.S = S;
    // labels (the one detail of the poster)
    if (name === 'mei.promise') label('p.kissaki', st.project(st.point({ s: 0.995, zf: 0.1 })), layout === 'land' ? [-0.35, -0.94] : [-0.3, -0.95], 40);
    if (name === 'togi.front') { const p = st.project(st.point({ s: S.polishFront, zf: 0.0 })); labelStone(p); }
    return S;
  }
  render() {
    const st = this.stage, S = this.S;
    return st.render({ shadow: !!S.shadow, rays: !!S.rays });
  }
}
function labelStone(at) {
  const src = document.querySelector('.s-togi .stone');
  const lay = document.getElementById('labels');
  if (!src || !lay) return;
  const el = document.createElement('div');
  el.className = 'plabel';
  const end = [at[0], at[1] - 44];
  el.innerHTML = `<svg class="lead" width="100%" height="100%"><path d="M${at[0].toFixed(1)} ${(at[1] - 6).toFixed(1)}L${end[0].toFixed(1)} ${end[1].toFixed(1)}"/></svg><span class="lt" style="left:${end[0].toFixed(1)}px;top:${end[1].toFixed(1)}px">${src.innerHTML}</span>`;
  lay.appendChild(el);
}
function poseFrom(st, Ks, Ts, off, sc) {
  // lazily import-free: the same math as fx/ink.js inkPose
  const td = st.td, W = st.w, H = st.h;
  const back = (sx, sy) => { const k = td.Hc / td.f, a = (sx - W / 2) * k, b = (sy - H / 2) * k; return [td.C.x + td.r.x * a + td.d.x * b, td.C.z + td.r.z * a + td.d.z * b]; };
  const Kp = back(Ks[0] + off[0] * sc, Ks[1] + off[1] * sc), Tp = back(Ts[0] + off[0] * sc, Ts[1] + off[1] * sc);
  const { K, T } = G.axisEnds(1);
  return { O: Kp, a: Math.atan2(Tp[1] - Kp[1], Tp[0] - Kp[0]), k: Math.hypot(Tp[0] - Kp[0], Tp[1] - Kp[1]) / Math.hypot(T[0] - K[0], T[1] - K[1]) };
}

// the whole G1 hold sequence: apply, render at the hold resolution, report
export async function runPoster(stage, log) {
  const q = new URLSearchParams(location.search);
  const name = parseBeat(q);
  const p = new Poster(stage);
  Q.poster = PHONE.indexOf(name);
  Q.beat = BEATS.indexOf(name); Q.name = name;
  const opt = { cand: q.get('cand') || undefined, reveal: q.has('reveal') ? parseFloat(q.get('reveal')) : undefined, over: q.has('tune') ? JSON.parse(q.get('tune')) : undefined };
  // dev: re-render this page's stage in another state without reloading (the tuning sweeps use it)
  Q.tune = async (n, over, extra = {}) => { await p.apply(n || name, { ...opt, ...extra, over }); p.render(); stage.finish(); return p.S; };
  await p.apply(name, opt);
  if (q.has('prewarm')) { const st = stage; st.blade.name = 'steel'; Q.prewarm = st.prewarm([st.blade, st.parts.habaki, st.parts.tsuka, st.saya, st.floor]); }
  // first frame: programs compile here (the prewarm queue of G2 moves this out of the scenes)
  const t0 = performance.now(); p.render(); stage.finish(); const first = performance.now() - t0;
  // the steady hold frame: measured once the page itself has settled (its own first raster shares the GPU process
  // with this frame on a software renderer, which is not the state of a hold window inside the film)
  await nextFrame(); await nextFrame(); await new Promise((r) => setTimeout(r, 400));
  let hold = 1e9;
  for (let i = 0; i < 3; i++) { const t1 = performance.now(); p.render(); stage.finish(); hold = Math.min(hold, performance.now() - t1); await nextFrame(); }
  log('first', first); log('hold', hold);
  if (q.has('prof')) Q.prof = profile(stage, p);
  Q.atHold = true; Q.idle = true; Q.raysReady = !!p.S.rays; Q.posterReady = true;
  Q.S = p.S;
  return p;
}

// ?prof=1: where the hold frame's time goes (each figure is the best of three full GPU round trips)
function profile(stage, p) {
  const t = (f) => { let b = 1e9; for (let i = 0; i < 3; i++) { const t0 = performance.now(); f(); stage.finish(); b = Math.min(b, performance.now() - t0); } return Math.round(b); };
  const S = p.S, out = {};
  out.full = t(() => p.render());
  out.clearOnly = t(() => { const r = stage.renderer; r.setRenderTarget(null); r.setClearColor(0, 0); r.clear(); });
  if (S.shadow) out.noShadow = t(() => stage.render({ shadow: false, rays: !!S.rays }));
  if (S.rays) out.noRays = t(() => stage.render({ shadow: !!S.shadow, rays: false }));
  const vis = stage.sword.children.map((c) => c.visible);
  stage.handle.visible = false; if (stage.sayaG) stage.sayaG.visible = false;
  out.bladeOnly = t(() => stage.render({}));
  stage.handle.visible = true; stage.blade.visible = false;
  out.noBlade = t(() => stage.render({}));
  stage.blade.visible = true;
  stage.sword.children.forEach((c, i) => { c.visible = vis[i]; });
  return out;
}
