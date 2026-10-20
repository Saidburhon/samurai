// HERO: the unboxed toy. Everything is a pure function of time t (seconds since first paint),
// so any frame of the load sequence or of the auto-trick can be rendered exactly.
import { THREE, PAL, G, Ribbon, sx2w, sy2w } from './gl.js';
import { makeKendama, makeBall } from './kendama.js';
import { Rope } from './rope.js';
import * as A from './anim.js';

const GRAV = 2600;

export function buildHero() {
  const phone = innerWidth < 600;
  const root = document.getElementById('hero');
  const $ = s => root.querySelector(s), $$ = s => [...root.querySelectorAll(s)];

  // ---- anchors from CSS layout ----
  const ar = $('[data-anchor=kendama]').getBoundingClientRect();
  const base = [ar.left, ar.top];
  const H = phone ? 240 : 400;
  const r = 0.17 * H;
  const sc = phone ? H / 380 : 1;

  const K = makeKendama(H);
  G.scene.add(K.rig);
  const ballG = new THREE.Group(); const ball = makeBall(r);
  ballG.add(ball);
  ball.traverse(o => { if (o.material) o.material.transparent = true; o.renderOrder = 6; });
  G.scene.add(ballG);

  const N = 18;
  const rope = new Rope(N, 1.1 * H, { g: GRAV });
  const rib = new Ribbon((N - 1) * 4 + 1, { width: phone ? 5.6 : 7.5, seg: phone ? 34 : 46 });
  G.scene.add(rib.mesh);
  const boxTopY = base[1] - (phone ? 9 : 17);
  const boxEl = $('.box-front').getBoundingClientRect();
  const bs = phone ? 0.5 : 1;
  const boxX0 = boxEl.left + 70 * bs, boxX1 = boxEl.left + 406 * bs;
  rope.colliders.push((rp, i) => { if (rp.x[i] > boxX0 && rp.x[i] < boxX1 && rp.y[i] > boxTopY) rp.y[i] = boxTopY; });

  // ---- DOM bits ----
  const blocks = $$('.blk');
  const landAt = { uz: .50, plain: .62, now: .70, jp: .82, it: .90 };
  const boxes = $$('.boxpos');
  const opens = $$('.open'), closed = $$('.closed');
  const pills = $$('.pills .pill');
  const sticker = $('.sticker'); sticker.querySelector('.scallop').setAttribute('d', A.scallopPath(60, 60, 54, 16, 0.07));
  const cue = $('.cue'), cueBall = $('.cue-ball'), cueSh = $('.cue-shadow');
  const contact = $('.box-back .contact');
  // bursts live under the canvas: behind the ball, in front of the wall
  const burst = $('.burst'); root.insertBefore(burst, $('.box-back'));
  burst.querySelector('.star').setAttribute('d', A.burstPath(100, 5));
  const speed = $('.speed');
  const tick = $('.tick'), cursor = $('.cursor'), puffs = $('.puffs');
  const endi = blocks.find(b => b.dataset.role === 'now').getBoundingClientRect();
  const KI = .5; // impact time after the poke
  const HIT = [endi.right - .42 * r, endi.top - .62 * r];
  const CUR = [base[0] + 64 * sc, base[1] - 234 * sc];
  const PUFFS = [[endi.left + 26, endi.bottom - 10, 15], [endi.left + 48, endi.bottom - 16, 11], [endi.left + 6, endi.bottom - 18, 9], [endi.right + 2, endi.bottom - 12, 13], [endi.right - 20, endi.bottom - 20, 9]];

  // ---------- kendama choreography ----------
  const REST = { x: base[0], y: base[1], rot: 0, sx: 1, sy: 1, ry: 0.52, rx: -0.1, pivot: 0 };
  const hopKeys = [{ t: .12, x: 0, y: 0 }, { t: .3, x: 0, y: 78 }, { t: .52, x: 0, y: 100 }, { t: .8, x: 0, y: 92 }, { t: 1.0, x: 0, y: 76 },
    { t: 1.08, x: 0, y: 66 }, { t: 1.2, x: 0, y: 74 }, { t: 1.34, x: 0, y: 52 }, { t: 1.45, x: 0, y: 0 }];
  function kPose(t) {
    if (t < 2.4) return { ...REST, visible: false };
    if (t < 2.85) { // jack-in-the-box spring, one lighthouse spin at the apex
      const u = A.seg(t, 2.4, 2.85);
      const y = base[1] + 30 * sc * (1 - u) - 4 * 250 * sc * u * (1 - u);
      const sy = u < .4 ? 1.25 - .25 * (u / .4) : u > .62 ? 1 + .09 * ((u - .62) / .38) : 1;
      const ry = REST.ry - Math.PI * 2 * (1 - A.inOutCubic(A.seg(u, .22, .78)));
      return { ...REST, y, sy, sx: 1 / Math.sqrt(sy), ry };
    }
    const tau = t - 9.0;
    if (tau >= 0 && tau < 1.9) { // auto-trick: the juggle (spike -> big cup -> spike)
      let sy = 1;
      if (tau < .12) sy = 1 - .1 * A.outCubic(tau / .12);
      else if (tau < .26) sy = .9 + .22 * Math.sin(A.seg(tau, .12, .26) * Math.PI) + .1 * A.seg(tau, .12, .26);
      else if (tau >= 1.45) sy = 1 - .1 * A.wiggle(A.seg(tau, 1.45, 1.9), 1.6, 4);
      const hop = A.spline(hopKeys, tau)[1] * sc;
      let rot = 0;
      if (tau > .14 && tau <= 1.12) rot = Math.PI / 2 * A.backOut(A.seg(tau, .14, .56), 1.4);
      else if (tau > 1.12) rot = Math.PI / 2 * (1 - A.inOutCubic(A.seg(tau, 1.12, 1.44)));
      const drift = -96 * sc * Math.sin(Math.PI * A.seg(tau, .12, 1.45)) ** 0.8;
      return { ...REST, x: base[0] + drift, y: base[1] - hop, rot, sy, sx: 1 / Math.sqrt(sy), pivot: 0.5 };
    }
    const kt = t - 20.0;
    if (kt >= 0 && kt < 2.5) { // poked by a fast cursor: roly-poly lean right, then it staggers back left
      const lean = .36 * Math.exp(-1.7 * kt) * Math.sin(6.3 * kt + .15) - .02;
      const sy = 1 - .05 * Math.exp(-3 * kt) * Math.sin(12 * kt);
      return { ...REST, rot: lean, sy, sx: 1 / Math.sqrt(sy), x: base[0] - 10 * sc * A.outCubic(A.seg(kt, .3, .6)) };
    }
    // landing squash, then breathing
    const v = A.seg(t, 2.85, 3.4);
    let sy = 1 - .12 * A.wiggle(v, 2, 4.2);
    if (t > 3.4) sy = 1 + .01 * Math.sin(2 * Math.PI * .4 * (t - 3.4));
    return { ...REST, sy, sx: 1 / Math.sqrt(sy) };
  }

  const v3 = new THREE.Vector3();
  const proj = (v) => { v3.copy(v).project(G.camera); return [(v3.x + 1) / 2 * G.W, (1 - v3.y) / 2 * G.H]; };
  const spikeSeat = () => K.body.localToWorld(new THREE.Vector3(0, H + r * 0.46, 0));
  const cupSeat = () => K.body.localToWorld(new THREE.Vector3(-0.19 * H - 0.8 * r, 0.78 * H, 0));
  const worldOf = (s) => new THREE.Vector3(sx2w(s[0]), sy2w(s[1]), 0);

  // ball keys for the spring-out (screen space, relative to the base)
  const bk = (t, dx, dy) => ({ t, x: base[0] + dx * sc, y: base[1] + dy * sc });
  const springKeys = [bk(2.4, 0, 20), bk(2.52, -34, -90), bk(2.64, -78, -250), bk(2.76, -60, -420), bk(2.86, -18, -470)];

  // ball state: returns {w: world pos, mode, rotZ, s: squash}
  const ballBallistic = (p0, p1, T, u) => {
    const vx = (p1[0] - p0[0]) / T, vy = (p1[1] - p0[1] - .5 * GRAV * T * T) / T;
    return [p0[0] + vx * u, p0[1] + vy * u + .5 * GRAV * u * u];
  };
  const memo = {};

  function seats() {
    if (memo.done) return memo;
    K.pose(kPose(2.95)); memo.s1 = proj(spikeSeat());
    K.pose(kPose(9.36)); memo.p0 = proj(spikeSeat());
    K.pose(kPose(10.0)); memo.p1 = proj(cupSeat());
    K.pose(kPose(10.12)); memo.q0 = proj(cupSeat());
    K.pose(kPose(10.5)); memo.q1 = proj(spikeSeat());
    K.pose(kPose(20.0)); memo.k0 = proj(spikeSeat());
    memo.done = true; return memo;
  }
  function bPose(t) {
    const j = memo;
    if (t < 2.4) return { hidden: true };
    if (t < 2.95) {
      if (t < 2.86) return { w: worldOf(A.spline(springKeys, t)), spin: (t - 2.4) * 9 };
      const p0 = A.spline(springKeys, 2.86);
      return { w: worldOf(ballBallistic(p0, j.s1, .09, t - 2.86)), spin: (t - 2.4) * 9 };
    }
    const tau = t - 9.0;
    if (tau >= .36 && tau < 1.5) {
      if (tau < 1.0) return { w: worldOf(ballBallistic(j.p0, j.p1, .64, tau - .36)), spin: 4.2 + (tau - .36) * -7 };
      if (tau < 1.12) { const sq = 1 - .16 * A.wiggle(A.seg(tau, 1.0, 1.2), 1.1, 2.5); return { seat: 'cup', s: sq, spin: 4.2 - .64 * 7 }; }
      return { w: worldOf(ballBallistic(j.q0, j.q1, .38, tau - 1.12)), spin: -.3 + (tau - 1.12) * 10 };
    }
    const kt = t - 20.0;
    if (kt >= 0 && kt < 2.5) {
      if (kt < KI) return { w: worldOf(ballBallistic(j.k0, HIT, KI, kt)), spin: -kt * 12 };
      const u = kt - KI; // rebound off the block
      return { w: worldOf([HIT[0] + 300 * u, HIT[1] - 560 * u + .5 * GRAV * u * u]), spin: -KI * 12 + u * 9, smear: u < .25 ? [.6, -1] : null };
    }
    return { seat: 'spike', wob: Math.sin(t * 2.1) * .02 };
  }

  function applyBall(bp) {
    if (bp.hidden) { ballG.visible = false; return null; }
    ballG.visible = true;
    ball.rotation.set(0, 0, 0); ball.scale.set(1, 1, 1); ballG.scale.set(1, 1, 1);
    if (bp.seat === 'spike') {
      ballG.position.copy(spikeSeat());
      K.body.getWorldQuaternion(ball.quaternion);
      ball.rotateY(1.2); ball.rotateZ(bp.wob || 0);
    } else if (bp.seat === 'cup') {
      ballG.position.copy(cupSeat());
      ball.rotation.set(0.5, 0.9, bp.spin);
      const s = bp.s || 1; ballG.scale.set(1 / Math.sqrt(s), s, 1 / Math.sqrt(s));
    } else {
      ballG.position.copy(bp.w);
      ball.rotation.set(0.5, 0.9, bp.spin || 0);
    }
    ballG.updateMatrixWorld(true);
    const c = proj(ballG.position);
    if (bp.seat === 'spike') return [c[0] - .8 * r, c[1] + .38 * r];
    return c;
  }

  // ---------- physics: run the thread from 2.4s to t with a fixed step ----------
  let simT = null;
  function simTo(t) {
    seats();
    const dt = 1 / 120;
    if (simT === null || t < simT) {
      simT = 2.4;
      K.pose(kPose(2.4)); const b = applyBall(bPose(2.4)) || base;
      rope.hang(K.beadScreen(), b, .6);
    }
    while (simT + dt <= t) {
      simT += dt;
      const kp = kPose(simT); K.pose(kp);
      const bpos = applyBall(bPose(simT));
      if (bpos) rope.step(dt, K.beadScreen(), bpos);
    }
  }

  // ---------- DOM state ----------
  function domAt(t) {
    // blocks drop from the sky, bottom row first, squash on landing
    const shock = t > 1.5 && t < 1.72 ? Math.sin(A.seg(t, 1.5, 1.72) * Math.PI) * 6 : 0;
    for (const b of blocks) {
      const land = landAt[b.dataset.role] ?? .6;
      const face = b.firstElementChild;
      let y = 0, sy = 1, op = 1;
      if (t < land - .25) { op = 0; y = -420; }
      else if (t < land) y = -420 * (1 - A.inQuad(A.seg(t, land - .25, land)));
      else if (t < land + .09) { sy = .84 + .16 * A.seg(t, land, land + .09) * 0; sy = .84; }
      else if (t < land + .34) { const u = A.seg(t, land + .09, land + .34); y = -10 * Math.sin(u * Math.PI); sy = 1 + .04 * Math.sin(u * Math.PI); }
      y -= shock;
      b.style.opacity = op;
      b.style.transform = `translateY(${y.toFixed(1)}px)`;
      face.style.transform = sy === 1 ? '' : `scale(${(1 / Math.sqrt(sy)).toFixed(3)}, ${sy.toFixed(3)})`;
    }
    const kt = t - 20.0;
    if (kt >= 0 && kt < 2.5) {
      const u = Math.max(0, kt - KI);
      const shake = u > 0 ? Math.exp(-6 * u) * Math.sin(u * 40) : 0;
      for (const b of blocks) {
        const role = b.dataset.role; let tr = '';
        if (role === 'now' && u > 0) { // knocked out of the wall: flies up-left, spinning
          b.style.transformOrigin = '50% 50%';
          tr = `translate(${(-430 * u).toFixed(1)}px, ${(-700 * u + .5 * GRAV * .62 * u * u).toFixed(1)}px) rotate(${(-250 * u).toFixed(1)}deg)`;
        } else if (role === 'it' && u > 0) { b.style.transformOrigin = '0% 100%'; tr = `translateY(${(-24 * Math.sin(Math.min(u / .34, 1) * Math.PI)).toFixed(1)}px) rotate(${(-9 * Math.sin(Math.min(u / .4, 1) * Math.PI)).toFixed(1)}deg)`; }
        else if (role === 'jp' && u > 0) { b.style.transformOrigin = '100% 100%'; tr = `translateY(${(-10 * Math.sin(Math.min(u / .3, 1) * Math.PI)).toFixed(1)}px) rotate(${(2.5 * shake).toFixed(2)}deg)`; }
        else if (role === 'plain' && u > 0) { b.style.transformOrigin = '0% 100%'; tr = `translate(${(-6 * A.outCubic(Math.min(u / .2, 1))).toFixed(1)}px, ${(-4 * Math.sin(Math.min(u / .25, 1) * Math.PI)).toFixed(1)}px) rotate(${(-2.2 * Math.sin(Math.min(u / .35, 1) * Math.PI)).toFixed(2)}deg)`; }
        else if (role === 'uz' && u > 0) tr = `translateY(${(-3 * Math.abs(shake)).toFixed(1)}px)`;
        b.style.transform = tr; b.style.opacity = 1; b.firstElementChild.style.transform = '';
      }
      tick.style.opacity = kt > .12 && kt < 1.1 ? 1 : 0;
      const kp2 = kPose(t); K.pose(kp2); const tip = K.tipScreen(0);
      tick.style.left = (tip[0] - 20 + 6 * sc) + 'px'; tick.style.top = (tip[1] - 62 * sc) + 'px';
      tick.style.transform = `rotate(${(kp2.rot * 57).toFixed(1)}deg) scale(${(kt < .22 ? A.backOut(A.seg(kt, .12, .22), 3) : 1).toFixed(2)})`;
      cursor.style.display = 'block'; cursor.style.left = CUR[0] + 'px'; cursor.style.top = CUR[1] + 'px';
      const cs = Math.max(0, 1 - kt / .9);
      cursor.style.transform = `scale(${(1 + .35 * cs).toFixed(2)}, ${(1 - .2 * cs).toFixed(2)})`;
      cursor.dataset.trail = cs > .05 ? '1' : '';
      // dust where the block left its slot
      if (u > 0 && u < .5) {
        const k = A.outCubic(u / .5), op = 1 - u / .5;
        puffs.innerHTML = PUFFS.map(([x, y, rr]) => `<i style="left:${x - rr * (.4 + k)}px;top:${y - rr * (.4 + k)}px;width:${2 * rr * (.4 + k)}px;height:${2 * rr * (.4 + k)}px;opacity:${op.toFixed(2)}"></i>`).join('');
      } else puffs.innerHTML = '';
      domRest(t); return;
    } else { tick.style.opacity = 0; cursor.style.display = 'none'; puffs.innerHTML = ''; }
    domRest(t);
  }
  function domRest(t) {
    // parcel: falls, lands heavy, trembles, bursts open at 2.4
    let dy = 0, rot = 0, bsy = 1, bop = 1;
    if (t < 1.1) bop = 0;
    else if (t < 1.5) dy = -760 * (1 - A.inQuad(A.seg(t, 1.1, 1.5)));
    else if (t < 1.66) bsy = 1 - .1 * Math.sin(A.seg(t, 1.5, 1.66) * Math.PI);
    if (t > 1.7 && t < 2.4) {
      const u = t - 1.7;
      rot = (u < .36 ? Math.sin(u / .12 * Math.PI) * 2 : u > .5 ? Math.sin((u - .5) / .1 * Math.PI) * 2.2 : 0);
    }
    const isOpen = t >= 2.4;
    for (const el of boxes) {
      el.style.opacity = bop;
      el.style.transform = `translate(0px, ${dy.toFixed(1)}px) scale(${bs}) translate(230px, 342px) rotate(${rot.toFixed(2)}deg) scale(${(1 / Math.sqrt(bsy)).toFixed(3)}, ${bsy.toFixed(3)}) translate(-230px, -342px)`;
    }
    for (const o of opens) o.style.display = isOpen ? '' : 'none';
    for (const c of closed) c.style.display = isOpen ? 'none' : '';
    // promise pills pop, sticker slaps on, scroll cue bounces
    pills.forEach((p, i) => { const s = A.elasticOut(A.seg(t, 3.3 + i * .08, 3.3 + i * .08 + .8), 1, .5); p.style.transform = `scale(${s.toFixed(3)})`; p.style.opacity = s > 0 ? 1 : 0; });
    const su = A.seg(t, 4.2, 4.75);
    sticker.style.opacity = su > 0 ? 1 : 0;
    sticker.style.transform = `rotate(${(-14 - 7 * (1 - A.backOut(su, 2.4))).toFixed(2)}deg) scale(${(1.6 - .6 * A.backOut(su, 3)).toFixed(3)}) skewX(${(6 * (1 - A.outCubic(su))).toFixed(2)}deg)`;
    const cu = A.seg(t, 4.8, 5.3); cue.style.opacity = cu;
    const ph = ((t - 4.8) % .9) / .9, hgt = Math.abs(Math.sin(ph * Math.PI));
    cueBall.style.transform = `translateY(${(26 - 26 * hgt).toFixed(1)}px) scale(${(hgt < .08 ? 1.18 : 1).toFixed(2)}, ${(hgt < .08 ? .8 : 1).toFixed(2)})`;
    cueSh.style.transform = `scale(${(.6 + .4 * (1 - hgt)).toFixed(2)})`;
    // contact shadow under the kendama shrinks as it rises
    const kp = kPose(t);
    const lift = Math.max(0, base[1] - kp.y);
    contact.style.opacity = kp.visible === false ? 0 : Math.max(.15, 1 - lift / 160);
    contact.style.transformOrigin = '238px 131px';
    contact.style.transform = `scale(${Math.max(.35, 1 - lift / 200).toFixed(3)})`;
  }

  function burstAt(t, bpos) {
    const events = [
      { t: 2.95, kind: 'kachi', at: 'spike' },
      { t: 10.0, kind: 'kan', at: 'cup' },
      { t: 10.5, kind: 'kachi', at: 'spike', small: true },
      { t: 20.0 + KI, kind: 'taq', at: 'hit' },
    ];
    let shown = false;
    for (const e of events) {
      const u = t - e.t;
      if (u < 0 || u > .8) continue;
      let s, op = 1;
      if (u < .18) s = 1.15 * A.backOut(u / .12 > 1 ? 1 : u / .12, 3) - (u > .12 ? .15 * A.seg(u, .12, .18) : 0);
      else if (u < .63) s = 1;
      else { s = 1 - .4 * A.seg(u, .63, .79); op = 1 - A.seg(u, .63, .79); }
      const isKan = e.kind === 'kan', isTaq = e.kind === 'taq';
      burst.classList.toggle('shu', isKan);
      burst.classList.toggle('taq', isTaq);
      burst.querySelector('.b1').textContent = isTaq ? 'TAQ!' : isKan ? 'カン!' : 'カチッ!';
      burst.querySelector('.b2').textContent = isTaq ? 'カン!' : 'TAQ!';
      const k = (e.small ? .7 : isTaq ? .84 : 1) * (phone ? .62 : 1);
      const off = isKan ? [-138, -18] : [-196, 56];
      const at = isTaq ? [HIT[0] - 74, HIT[1] + 86] : [bpos[0] + off[0] * k, bpos[1] + off[1] * k];
      burst.style.left = at[0] + 'px'; burst.style.top = at[1] + 'px';
      burst.style.opacity = op;
      burst.style.transform = `scale(${(s * k).toFixed(3)}) rotate(${isKan ? -6 : 4}deg)`;
      shown = true;
    }
    if (!shown) burst.style.opacity = 0;
  }

  function speedAt(t) {
    const tau = t - 9.0;
    let d = '';
    if (tau > .2 && tau < 1.4) {
      const a = 1 - A.seg(tau, 1.12, 1.4);
      const kp = kPose(t);
      const px = kp.x, py = kp.y - .5 * H * kp.sy + .1 * H + 14 * sc;
      for (const [dx, l, o] of [[-.3, 20, 10], [-.12, 34, 0], [.06, 24, 16], [.22, 14, 8]]) d += `M${(px + dx * H).toFixed(1)} ${(py + o * sc).toFixed(1)}v${(l * a * sc).toFixed(1)}`;
    }
    const kt = t - 20.0;
    if (kt > .05 && kt < KI + .3) {
      const bp = bPose(t), bp2 = bPose(t - .05);
      if (bp.w && bp2.w) {
        const p1 = [bp.w.x + G.W / 2, G.H / 2 - bp.w.y], p0 = [bp2.w.x + G.W / 2, G.H / 2 - bp2.w.y];
        let vx = p1[0] - p0[0], vy = p1[1] - p0[1]; const l = Math.hypot(vx, vy) || 1; vx /= l; vy /= l;
        const nx = -vy, ny = vx;
        for (const [o, len, gap] of [[-.55, .9, 1.25], [0, 1.4, 1.15], [.55, .8, 1.3]]) {
          const sx0 = p1[0] - vx * r * gap + nx * r * o, sy0 = p1[1] - vy * r * gap + ny * r * o;
          d += `M${sx0.toFixed(1)} ${sy0.toFixed(1)}l${(-vx * r * len).toFixed(1)} ${(-vy * r * len).toFixed(1)}`;
        }
      }
    }
    speed.innerHTML = d ? `<path d="${d}"/>` : '';
  }

  function at(t) {
    simTo(t);
    const kp = kPose(t); K.pose(kp); K.rig.visible = kp.visible !== false;
    const bpos = applyBall(bPose(t));
    rib.mesh.visible = !!bpos && K.rig.visible;
    if (bpos) rib.update(rope.smooth(4), 0);
    domAt(t);
    burstAt(t, ballG.visible ? proj(ballG.position) : base);
    speedAt(t);
  }
  return { at, K };
}
