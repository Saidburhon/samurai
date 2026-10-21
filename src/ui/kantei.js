// The hero's toys (G2/G5, §2.1, §3.8): the kantei lamp and the sword that comes apart.
//   - the lamp orbit (wall clock, from 6 s on B0): the glint walks the blade, the shadow swings and lengthens, the
//     blade rolls a little (half compensated by the studio);
//   - the cursor is the lamp (an armed fine pointer): the glint eases to the cursor's blade coordinate, the shadow
//     light points from a lamp 6 units above the cursor's paper point to the sword, so the shadow swings away from it;
//     a warm pool of lamp light lies on the paper under it;
//   - kantei: within 160 px of the blade outline the fittings slide off the tang towards the kashira and the tang
//     shows; one part label beside the part nearest the cursor (within 130 px of the outline);
//   - the kantei ring cursor, shown while the pointer moves, fading 0.8 s after it stops;
//   - a click (or tap) on the steel rings it: the glint shimmers at 7 Hz and the ring sounds if sound is on.
// Everything here lives only at the hero hold (mei.hero): leaving it (a wheel, a key, a swipe) drops the toys at once,
// so the capture's parked pointer never touches another poster. It runs as an override after the film's own apply
// (main.js wraps film.apply), so the film's frame stays a function of the descriptor everywhere else.
import { Vector3, Matrix4 } from 'three';
import { KANTEI, H as HP, TSUBA_R } from '../sword/geom-core.js';
import { sfx } from '../audio/audio.js';

const Q = window.__qilich || (window.__qilich = {});
const html = document.documentElement;
const damp = (a, b, l, dt) => a + (b - a) * (1 - Math.exp(-l * dt));
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const v3 = (x = 0, y = 0, z = 0) => new Vector3(x, y, z);
const AXIS_X = v3(1, 0, 0);
const HERO = 'mei.hero';
const FITTINGS = ['habaki', 'seppa1', 'tsuba', 'seppa2'];
const GRIP = ['fuchi', 'tsuka', 'kashira', 'mekugi'];

// distance from p to segment ab, and the parameter along it
function segDist(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy || 1;
  const t = clamp(((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L2, 0, 1);
  const x = a[0] + dx * t, y = a[1] + dy * t;
  return [Math.hypot(p[0] - x, p[1] - y), t];
}
function inPoly(p, poly) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) c = !c;
  }
  return c;
}

export function initToys(F, stage) {
  const film = F.film, st = stage;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const labelsEl = document.getElementById('labels');
  const pool = document.querySelector('#paper .lamp-pool');
  // the ring cursor: a hairline loupe with a dot
  const ring = document.createElement('div');
  ring.className = 'kring'; ring.setAttribute('aria-hidden', 'true');
  document.body.appendChild(ring);
  // (its own layer beside #labels: the film's Labels empties #labels whenever a hold changes)
  const lab = document.createElement('div');
  lab.className = 'plabel klabel'; lab.setAttribute('aria-hidden', 'true');
  if (labelsEl) labelsEl.after(lab);

  const P = { x: -1, y: -1, armed: false, moved: -1e9, zoneT: -1e9, touch: false };
  const S = { s: 0.78, zf: 0.60, wP: 0, k1: 0, k2: 0, ringT: -1e9, last: performance.now(), drawT: 0, on: false, geo: null, label: '', labelKey: '', poolOn: false };
  Q.toys = S;
  Q.toyLocate = (x, y) => { if (!S.geo) return null; const L = locate(S.geo, [x, y]); return { s: +L.s.toFixed(3), zf: +L.zf.toFixed(2), d: Math.round(L.d), part: L.part }; };

  const hero = () => {
    const d = F.state.d;
    return !!(d && !d.intro && d.atHold && d.hold === HERO && !d.freeze && !d.pre);
  };

  // the hero's projected outline (cached per viewport): spine and edge polylines, the axis, the guard and the grip
  function geometry() {
    const key = `${st.w}x${st.h}|${st.camera.fov.toFixed(3)}`;
    if (S.geo && S.geo.key === key) return S.geo;
    const N = 24, spine = [], edge = [], axis = [], ss = [];
    for (let i = 0; i <= N; i++) {
      const s = i / N;
      ss.push(s);
      spine.push(st.project(st.point({ s, zf: 0 })));
      edge.push(st.project(st.point({ s, zf: 1 })));
      axis.push(st.project(st.point({ s, zf: 0.5 })));
    }
    const poly = spine.concat(edge.slice().reverse());
    const tsuba = st.project(st.point('tsuba'));
    const rim = st.project(st.worldH(v3((HP.tsuba[0] + HP.tsuba[1]) / 2, 0, TSUBA_R)));
    const gripA = st.project(st.worldH(v3(HP.fuchi[1], 0, 0))), gripB = st.project(st.worldH(v3(HP.kashira[0], 0, 0)));
    const x0 = st.project(st.worldH(v3(0, 0, 0))), x1 = st.project(st.worldH(v3(-1, 0, 0)));
    const ppu = Math.hypot(x1[0] - x0[0], x1[1] - x0[1]) || 100;
    const tsR = Math.hypot(rim[0] - tsuba[0], rim[1] - tsuba[1]);
    S.geo = { key, spine, edge, axis, ss, poly, tsuba, tsR, gripA, gripB, ppu, gripW: 0.2 * ppu };
    return S.geo;
  }

  // where the cursor is, in the sword's terms: blade coordinate s, across-blade zf, the distance to the outline, the
  // part nearest it
  function locate(g, p) {
    let best = 1e9, bi = 0, bt = 0;
    for (let i = 0; i < g.axis.length - 1; i++) {
      const [d, t] = segDist(p, g.axis[i], g.axis[i + 1]);
      if (d < best) { best = d; bi = i; bt = t; }
    }
    const s = (bi + bt) / (g.axis.length - 1);
    const lerp2 = (A) => [A[bi][0] + (A[bi + 1][0] - A[bi][0]) * bt, A[bi][1] + (A[bi + 1][1] - A[bi][1]) * bt];
    const sp = lerp2(g.spine), ed = lerp2(g.edge);
    const ex = ed[0] - sp[0], ey = ed[1] - sp[1];
    const zf = ((p[0] - sp[0]) * ex + (p[1] - sp[1]) * ey) / (ex * ex + ey * ey || 1);
    // distance to the blade outline (0 inside)
    let dBlade = 0;
    if (!inPoly(p, g.poly)) { dBlade = 1e9; for (let i = 0; i < g.poly.length; i++) dBlade = Math.min(dBlade, segDist(p, g.poly[i], g.poly[(i + 1) % g.poly.length])[0]); }
    const dTsuba = Math.max(0, Math.hypot(p[0] - g.tsuba[0], p[1] - g.tsuba[1]) - g.tsR);
    const dGrip = Math.max(0, segDist(p, g.gripA, g.gripB)[0] - g.gripW);
    const d = Math.min(dBlade, dTsuba, dGrip);
    let part;
    if (dTsuba <= Math.min(dBlade, dGrip)) part = 'tsuba';
    else if (dGrip < dBlade) part = 'tsuka';
    else if (s > 0.8) part = 'kissaki';
    else part = zf < 0.3 ? 'shinogi' : 'hamon'; // the shinogi-ji lies above the ridge line (zf 0.28)
    return { s, zf, d, part, sp, ed };
  }

  // ---------------- input ----------------
  const disarm = () => { P.armed = false; S.ringT = -1e9; ring.classList.remove('on'); };
  if (fine) {
    addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const nx = e.clientX, ny = e.clientY;
      if (Math.abs(nx - P.x) + Math.abs(ny - P.y) < 1) return;
      P.x = nx; P.y = ny; P.moved = performance.now();
      P.armed = true;
      if (hero()) { S.ringT = P.moved; ring.style.transform = `translate(${nx}px, ${ny}px)`; ring.classList.add('on'); }
    }, { passive: true });
    document.addEventListener('pointerleave', disarm);
    addEventListener('blur', disarm);
  }
  // a wheel, a key or a touch leaves the hero: the toys go at once (the parked pointer must not show anywhere else)
  const away = () => { ring.classList.remove('on'); S.ringT = -1e9; };
  addEventListener('wheel', away, { passive: true });
  addEventListener('keydown', away);
  addEventListener('touchstart', () => { P.touch = true; away(); }, { passive: true });

  // a click or a tap on the steel rings it
  addEventListener('pointerdown', (e) => {
    if (!hero() || e.button > 0) return;
    if (e.target && e.target.closest && e.target.closest('a, button, input, textarea, select, label, .nav, .menu')) return;
    const g = S.geo; if (!g) return;
    const L = locate(g, [e.clientX, e.clientY]);
    if (L.d > (e.pointerType === 'touch' ? 24 : 6)) return;
    S.ringT0 = performance.now();
    sfx('ring');
    film.dirty = true;
  }, { passive: true });

  // ---------------- the override, after the film's own apply ----------------
  const tmpM = new Matrix4();
  function after(d, H) {
    const P_ = st.parts;
    if (!P_) return;
    const on = !!(d && !d.intro && d.atHold && d.hold === HERO && !d.freeze && !d.pre && H && H.name === HERO);
    // the parts at their seats unless the hero is on (the film's own apply never moves them)
    if (!on) {
      if (S.on) { for (const n of [...FITTINGS, ...GRIP]) P_[n].position.set(0, 0, 0); S.on = false; film.softKey = ''; }
      return;
    }
    S.on = true;
    const g = geometry();
    const now = performance.now(), t = now / 1000;
    // the orbit (§3.8): from 6 s, a 12 s cycle starting at the rest values
    let gs = 0.78, gz = 0.60, roll = H.pose.roll, Lw = H.lightW.clone();
    if (!reduced && t > 6) {
      const th = (2 * Math.PI * (t - 6)) / 12 + 2.529, psi = th - 2.529;
      gs = 0.55 + 0.40 * Math.sin(th); gz = 0.56 + 0.04 * Math.sin(th);
      roll = H.pose.roll + 0.10 * Math.sin(psi);
      // the shadow light swings about the vertical and drops towards the paper
      const az = 25 * Math.PI / 180 * Math.sin(psi), drop = 8 * Math.PI / 180 * (1 - Math.cos(psi));
      const hz = Math.hypot(Lw.x, Lw.z), el = Math.atan2(Lw.y, hz) - drop, a0 = Math.atan2(Lw.z, Lw.x) + az;
      Lw.set(Math.cos(el) * Math.cos(a0), Math.sin(el), Math.cos(el) * Math.sin(a0)).normalize();
    }
    // the cursor is the lamp
    const wP = reduced ? 0 : S.wP;
    if (wP > 0.001) {
      gs = gs + (S.s - gs) * wP; gz = gz + (S.zf - gz) * wP;
      const td = st.td;
      if (td) {
        const k = td.Hc / td.f, a = (P.x - st.w / 2) * k, b = (P.y - st.h / 2) * k;
        const lamp = v3(td.C.x + td.r.x * a + td.d.x * b, 6, td.C.z + td.r.z * a + td.d.z * b);
        const c = st.point('K').add(st.point('T')).multiplyScalar(0.5);
        const Lp = lamp.sub(c).normalize();
        Lw.lerp(Lp, wP).normalize();
      }
    }
    // the roll (half compensated by the studio, §3.5), the frame kept on its anchors
    if (Math.abs(roll - H.pose.roll) > 1e-5) {
      st.setPose({ ...st.pose, roll });
      st.solve(H.cam);
      const M = H.M.clone().multiply(tmpM.makeRotationAxis(AXIS_X, -0.5 * (roll - H.pose.roll)));
      st.studioM = M; st.U.uStudio.value.setFromMatrix4(M);
    }
    // kantei: the fittings slide towards the kashira, the tang shows
    const k = reduced ? 0 : S.k2;
    if (k > 0.002) {
      const u = 1 / g.ppu;
      for (const n of FITTINGS) P_[n].position.set(-KANTEI[n] * k * u, 0, 0);
      for (const n of GRIP) P_[n].position.set(-KANTEI.tsuka * k * u, 0, 0);
      if (st.nakagoMesh) st.nakagoMesh.visible = true;
    } else for (const n of [...FITTINGS, ...GRIP]) P_[n].position.set(0, 0, 0);
    // the lamp and its glint
    st.lampGlint(clamp(gs, 0.02, 0.985), clamp(gz, 0.06, 0.94), H.glint ? H.glint.dist : 8);
    // the ring: the glint shimmers with the blade's first mode (7 Hz, e^(−t/1.2))
    const sU = st.mat.steelU;
    if (S.ringT0) {
      const rt = (now - S.ringT0) / 1000;
      if (rt < 2.4) sU.uGlintGain.value *= 1 + 0.9 * Math.exp(-rt / 0.6) * (0.5 + 0.5 * Math.sin(2 * Math.PI * 7 * rt));
      else S.ringT0 = 0;
    }
    // the shadow from this lamp (re-rendered only when it changed)
    const lk = st.look, sh = H.shadow || 0;
    if (sh > 0.001) {
      const key = [roll, k, Lw.x, Lw.y, Lw.z].map((x) => x.toFixed(4)).join();
      if (key !== S.softKey || film.softKey !== 'kt') {
        st.soft.update(st, Lw, { soft: lk.shadowSoft, base: lk.shadowBase, col: lk.shadowCol, alpha: lk.shadowA * sh, reveal: 2 });
        S.softKey = key; film.softKey = 'kt';
      }
    }
  }
  const ap = film.apply.bind(film);
  film.apply = (d, o) => { const H = ap(d, o); try { after(d, H); } catch (e) { Q.toyError = String(e && e.stack || e); } return H; };

  // ---------------- the label ----------------
  const tpl = (k) => { const el = document.querySelector(`#strings [data-k="p.${k}"]`); return el ? el.innerHTML : ''; };
  function showLabel(L, g) {
    if (!L) { if (S.labelKey) { lab.innerHTML = ''; S.labelKey = ''; } return; }
    let at, dir;
    const n = (x, y) => { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; };
    // the across-blade direction on screen (spine -> edge)
    const across = n(L.ed[0] - L.sp[0], L.ed[1] - L.sp[1]);
    // the anchor a little towards the habaki from the cursor, so the label never sits under the ring
    const s0 = clamp(L.s - 0.07, 0.04, 0.84);
    if (L.part === 'kissaki') { const up = L.zf < 0.5; at = st.project(st.point({ s: 0.955, zf: up ? 0.05 : 0.95 })); dir = up ? [-across[0], -across[1]] : across; }
    else if (L.part === 'shinogi') { at = st.project(st.point({ s: s0, zf: 0.28 })); dir = [-across[0], -across[1]]; }
    else if (L.part === 'hamon') { at = st.project(st.point({ s: s0, zf: 0.74 })); dir = across; }
    else if (L.part === 'tsuba') { at = [g.tsuba[0], g.tsuba[1] - g.tsR]; dir = [0, -1]; }
    else { const m = [(g.gripA[0] + g.gripB[0]) / 2, (g.gripA[1] + g.gripB[1]) / 2]; at = m; dir = P.y < m[1] ? [0, -1] : [0, 1]; at = [m[0], m[1] + dir[1] * g.gripW]; }
    const key = `${L.part}|${at[0].toFixed(0)}|${at[1].toFixed(0)}`;
    if (key === S.labelKey) return;
    S.labelKey = key;
    const end = [at[0] + dir[0] * 40, at[1] + dir[1] * 40];
    const below = dir[1] > 0.3;
    lab.innerHTML = `<svg class="lead" width="100%" height="100%"><path d="M${at[0].toFixed(1)} ${at[1].toFixed(1)}L${end[0].toFixed(1)} ${end[1].toFixed(1)}"/><circle cx="${at[0].toFixed(1)}" cy="${at[1].toFixed(1)}" r="1.8"/></svg><span class="lt${below ? ' below' : ''}" style="left:${end[0].toFixed(1)}px;top:${end[1].toFixed(1)}px">${tpl(L.part)}</span>`;
  }

  // ---------------- the loop ----------------
  const tier = st.tier.tier;
  const ambientHz = tier >= 3 ? 60 : tier === 1 ? 30 : 8;
  const loop = () => {
    requestAnimationFrame(loop);
    const now = performance.now(), dt = Math.min(0.1, (now - S.last) / 1000); S.last = now;
    const h = hero() && !!S.geo;
    if (!h) {
      // off the hero: everything at rest, at once
      if (S.wP || S.k1 || S.k2) { S.wP = 0; S.k1 = S.k2 = 0; }
      if (S.labelKey) { lab.innerHTML = ''; S.labelKey = ''; }
      if (S.poolOn) { html.classList.remove('kt-pool'); S.poolOn = false; }
      ring.classList.remove('on');
      return;
    }
    const g = S.geo || geometry();
    let L = null;
    if (P.armed && !P.touch && fine) {
      L = locate(g, [P.x, P.y]);
      if (L.d < 160) P.zoneT = now;
      // the cursor's blade point, eased (λ 8)
      const ts = clamp(L.s, 0.02, 0.985), tz = clamp(L.zf, 0.06, 0.94);
      S.s = damp(S.s, ts, 8, dt); S.zf = damp(S.zf, tz, 8, dt);
    }
    const lampOn = P.armed && !P.touch && fine && !reduced;
    // arming eases in fast; disarmed, the lamp returns to the orbit over 1.2 s
    S.wP = lampOn ? damp(S.wP, 1, 8, dt) : Math.max(0, S.wP - dt / 1.2);
    const kOn = lampOn && now - P.zoneT < 1200;
    S.k1 = damp(S.k1, kOn ? 1 : 0, kOn ? 9 : 6, dt); S.k2 = damp(S.k2, S.k1, kOn ? 9 : 6, dt);
    if (S.k2 < 0.002 && !kOn) S.k1 = S.k2 = 0;
    // one label, for the part nearest the cursor within 130 px of the outline (none on touch)
    showLabel(L && L.d < 130 ? L : null, g);
    // the ring cursor fades 0.8 s after the pointer stops
    if (S.ringT > 0 && now - S.ringT > 800) { ring.classList.remove('on'); S.ringT = -1e9; }
    // the lamp's pool of warm light on the paper
    if (pool) {
      const want = lampOn && S.wP > 0.05;
      if (want !== S.poolOn) { html.classList.toggle('kt-pool', want); S.poolOn = want; }
      if (want) pool.style.transform = `translate(${P.x - 210}px, ${P.y - 210}px)`;
    }
    // a frame when something moved: every frame for the cursor and the parts, the orbit at the ambient rate
    const moving = (S.wP > 0.001 && S.wP < 0.999) || (S.k1 > 0.001 && Math.abs(S.k1 - S.k2) > 1e-4) || (lampOn && now - P.moved < 1500) || (S.k2 > 0.001 && S.k2 < 0.998) || S.ringT0;
    const orbit = !reduced && now > 6000;
    if (moving || (orbit && now - S.drawT >= 1000 / ambientHz)) { S.drawT = now; film.dirty = true; }
  };
  requestAnimationFrame(loop);

  // the paper cut on the cuts (and the jump's slash): when a freeze sheet goes up
  let lastFz = null;
  const watch = () => {
    requestAnimationFrame(watch);
    const fz = F.cut && F.cut.shown;
    if (fz && fz !== lastFz) {
      const d = F.state.d, ty = d && d.tr && d.tr.type;
      if (ty === 'cut' || F.cut.jumpFz) sfx('cut');
    }
    lastFz = fz;
  };
  requestAnimationFrame(watch);
  return { after };
}
