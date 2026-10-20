// One WebGLRenderer, one canvas, one scene. Renders only when the state changes.
import * as THREE from 'three';
import { studioEnv } from './env.js';
import { C } from './palette.js';
import { makeCloth } from './cloth.js';
import { makeBlade } from './blade.js';
import { makeShuttle, makeAndon, makeRope, makeKnot } from './props.js';
import { paintStrip } from './cartoon.js';

function looseLength(H, D, fell, recede) {
  const sy = (d) => {
    const z = -(d * 0.7 + 0.0006 * d * d) * recede;
    const Y = H / 2 - (fell + d);
    return H / 2 - (Y * D) / (D - z);
  };
  let a = 0, b = 8000;
  for (let n = 0; n < 50; n++) {
    const m = (a + b) / 2;
    sy(m) < H ? (a = m) : (b = m);
  }
  return a;
}

export function createStage(L, host) {
  const { W, H } = L;
  const dpr = Math.min(window.devicePixelRatio || 1, L.phone ? 1.5 : 1.5);
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, stencil: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(dpr);
  renderer.setSize(W, H);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.localClippingEnabled = true;
  host.appendChild(renderer.domElement);

  const maxTex = Math.min(8192, renderer.capabilities.maxTextureSize);
  const scale = Math.max(0.75, Math.min(dpr, L.phone ? 1.5 : 1.25));
  const chunks = paintStrip(L, scale, maxTex);
  window.__marks && window.__marks.push(['painted', Math.round(performance.now())]);

  const D = H / 2 / Math.tan(THREE.MathUtils.degToRad(15));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(C.loom);
  const camera = new THREE.PerspectiveCamera(30, W / H, 10, D * 6);
  camera.position.set(0, 0, D);
  scene.environment = studioEnv(renderer);
  window.__marks && window.__marks.push(['env', Math.round(performance.now())]);
  const key = new THREE.DirectionalLight(0xfff2e0, 1.4);
  key.position.set(-0.45, 0.75, 1.0);
  scene.add(key);
  scene.add(new THREE.HemisphereLight(0xf4ecdc, 0x16121c, 0.55));

  const cloth = makeCloth({ W, H, chunks, scale });
  const cu = cloth.uniforms;
  cu.uPitch.value = L.pitch;
  scene.add(cloth.mesh);

  // disturbance map (the hand on the cloth)
  const DW = 100, DH = 64;
  const dist = new Uint8Array(DW * DH);
  const distTex = new THREE.DataTexture(dist, DW, DH, THREE.RedFormat, THREE.UnsignedByteType);
  distTex.minFilter = distTex.magFilter = THREE.LinearFilter;
  distTex.needsUpdate = true;
  cu.tDist.value = distTex;

  const bs = L.phone ? 0.95 : 1.55;
  const blade = makeBlade({ W, H, fellY: L.F, scale: bs, tsubaX: L.phone ? 34 : Math.round(W * 0.085), tipMargin: L.phone ? 12 : 40 });
  scene.add(blade.group);

  const shuttle = makeShuttle({ x: W + 300, y: L.F - L.sh / 2, W, H, bobbin: C.atlas, scale: L.phone ? 0.62 : 1.15 });
  scene.add(shuttle);

  // jidoka props live on the night cloth and leave with it
  const jid = new THREE.Group();
  scene.add(jid);
  const clip = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const clipTop = new THREE.Plane(new THREE.Vector3(0, -1, 0), H / 2 - L.hdr);
  const ropeR = L.phone ? 1.5 : 2.1;
  const ropeU = makeRope({ W, H, radius: ropeR });
  const ropeL = makeRope({ W, H, radius: ropeR });
  ropeU.mat.clippingPlanes = ropeL.mat.clippingPlanes = [clip, clipTop];
  
  jid.add(ropeU.mesh, ropeL.mesh);
  const knot = makeKnot({ size: L.phone ? 1.05 : 1.6 });
  knot.position.set(L.jid.sigX - W / 2, H / 2 - L.jid.brk, 4);
  knot.rotation.set(0.4, 0.3, 0);
  jid.add(knot);
  const A = L.jid.andon;
  const andon = makeAndon({ x: A.x, y: A.y, w: A.w, h: A.h, W, H });
  jid.add(andon.group);

  // the snapped thread: straight ↔ curled shapes (panel coordinates)
  const tx = L.jid.sigX, brk = L.jid.brk, F = L.F, ks = L.phone ? 0.7 : 1;
  const upC = [[0, -60, 0.5], [0, brk * 0.45, 0.5], [0, brk - 30, 0.5], [0, brk - 8, 1.5], [1, brk + 6, 6], [7, brk + 18, 16], [19, brk + 21, 26], [27, brk + 12, 32], [23, brk + 1, 38], [12, brk + 3, 42], [9, brk + 14, 46], [16, brk + 24, 49], [26, brk + 30, 50]];
  const loC = [[0, F + 40, 1], [0, F + 8, 6], [1, F - 10, 12], [8, F - 30, 22], [22, F - 34, 30], [30, F - 20, 34], [22, F - 6, 38], [6, F - 8, 40], [-4, F - 22, 42], [-10, F - 40, 40], [-6, F - 58, 38], [2, F - 64, 37]];
  const cur = (p) => [tx + p[0] * ks, p[1], p[2]];
  const upS = upC.map((p, j) => [tx, -60 + ((brk - -60) * j) / (upC.length - 1), 1.2]);
  const loS = loC.map((p, j) => [tx, F + 40 + ((brk - (F + 40)) * j) / (loC.length - 1), 1.2]);
  const lerp = (a, b, t) => a + (b - a) * t;
  const shapeRope = (snap, bow) => {
    const bowAt = (y) => bow * (L.phone ? 4 : 6) * Math.sin(Math.PI * Math.min(1, Math.max(0, (y + 60) / (F + 100))));
    const mk = (S, Cc) => S.map((s, j) => {
      const c = cur(Cc[j]);
      const y = lerp(s[1], c[1], snap);
      return [lerp(s[0] + bowAt(s[1]), c[0], snap), y, lerp(s[2], c[2], snap)];
    });
    ropeU.set(mk(upS, upC));
    ropeL.set(mk(loS, loC));
  };

  const looseLenCache = {};
  const looseLen = (fell, rec) => {
    const k = Math.round(fell) + ':' + rec.toFixed(2);
    return looseLenCache[k] ?? (looseLenCache[k] = looseLength(H, D, fell, rec));
  };

  let last = '';
  let frames = 0;
  // apply a state object to the scene; returns true when something changed
  function apply(S, extra = { lift: 0 }) {
    cu.uClothY.value = S.clothY;
    cu.uFell.value = S.fell;
    cu.uWTop.value = S.wTop;
    cu.uWBot.value = S.wBot;
    cu.uAmpW.value = S.ampW;
    cu.uAmpVel.value = S.ampVel;
    cu.uVelSign.value = S.velSign;
    cu.uFresh.value = S.fresh;
    cu.uAmpL.value = S.ampL;
    cu.uAmpTop.value = S.ampTop;
    cu.uLooseScale.value = S.looseScale;
    cu.uLooseOff.value = S.looseOff;
    cu.uFade.value = S.fade;
    cu.uTopLit.value = S.topLit;
    cu.uNearW.value = S.nearW;
    cu.uNearD.value = S.nearD;
    cu.uRecede.value = S.recede;
    cu.uLooseLen.value = looseLen(S.fell, S.recede);
    cu.uSweep.value = S.sweep;
    cu.uPull.value.set(L.abr.split, L.panels.abr.y0, L.abr.pullLen, S.pull);
    cu.uPick.value.set(S.pickTop, L.F, S.pickX, S.pickDir);
    cu.uJiyak.value.set(L.panels.hero.y0 + L.F - 3, S.jiyak);
    const t = L.time;
    const ty = L.panels.time.y0;
    cu.uShearR.value.set(t.x0, ty + t.tk[0], t.x1, ty + t.tk[1]);
    cu.uShear.value = S.shear;
    cu.uShotR.value.set(t.shot[0], ty + t.shot[1], t.shot[2], ty + t.shot[3]);
    cu.uShotFront.value = S.shotFront;
    cu.uSig.value.set(L.jid.sigX, L.panels.jid.y0 - 100, L.panels.jid.y0 + L.F + 50, S.sigOn > 0.5 && S.brk > 0.3 && S.rejoin < 0.7 ? 1 : 0);
    const ay = L.panels.jid.y0 - S.clothY + A.y + S.andonDy;
    cu.uAndon.value.set(A.x, ay, S.andon * 0.32, L.phone ? 190 : 330);
    cu.uAndonCol.value.set(...lerpCol(C.shu, '#1FA673', S.andonMix));
    if (S.safe) cu.uSafe.value.set(...S.safe);
    cu.uSafeK.value = S.safeK;
    cu.uTies.value = S.ties;
    cu.uDrop.value.x = S.drop;
    cu.uDrop.value.y = Math.floor(L.threads / 2);
    cu.uIntro.value.set(S.introReg, S.introAmp);
    cu.uDim.value = S.dim;
    cu.uShock.value = S.shock;
    cu.uShockA.value = S.shockA;
    cu.uLightPos.value.set(S.lightX, S.lightY);
    cu.uLight.value.set(S.lightDX, S.lightDY, 1.0);

    // blade
    blade.setY(S.bladeY + S.bladeLift + extra.lift);
    blade.group.visible = S.bladeY > -60 && S.bladeY < H + 40;
    blade.glint.value = S.glint;

    // shuttle (lies on the cloth just above the fell; stretches in flight)
    shuttle.visible = S.shuttleX > -260 && S.shuttleX < W + 260;
    shuttle.position.set(S.shuttleX - W / 2, H / 2 - S.shuttleY, 12);
    const sb = L.phone ? 0.62 : 1.15;
    shuttle.scale.set(sb * S.shuttleSX, sb / Math.sqrt(S.shuttleSX), sb);

    // jidoka props ride on the night cloth
    const dy = S.clothY - L.panels.jid.y0;
    jid.position.y = dy;
    jid.visible = S.sigOn > 0.5 && dy > -H * 1.2 && dy < L.F - 30;
    const c = S.brk * (1 - S.rejoin);
    shapeRope(c, S.bow);
    knot.scale.setScalar(Math.max(0.0001, S.knot));
    knot.visible = S.knot > 0.01;
    andon.set(S.andon, S.andonMix, S.andonDy);
    // the thread is only on the woven part of the cloth (clip at the weaving front, a little slack below the fell)
    const front = Math.min(S.wBot + (S.wBot >= L.F - 1 ? 70 : 2), H + 100);
    clip.constant = front - H / 2; // keep world y >= H/2 - front, i.e. screen y < front
    const sig = sigOf(S) + extra.lift.toFixed(2);
    if (sig !== last || distDirty) {
      last = sig;
      return true;
    }
    return false;
  }

  let distDirty = false;
  function render() {
    if (distDirty) { distTex.needsUpdate = true; distDirty = false; }
    renderer.render(scene, camera);
    frames++;
  }

  function sigOf(S) {
    let s = '';
    for (const k in S) { const v = S[k]; s += typeof v === 'number' ? v.toFixed(2) : String(v); s += '|'; }
    return s;
  }

  // ---- disturbance map
  let distEnergy = 0;
  function stamp(x0, y0, x1, y1, strength) {
    const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 30));
    const r = 120 / W * DW;
    for (let s = 0; s <= steps; s++) {
      const px = ((x0 + ((x1 - x0) * s) / steps) / W) * DW, py = ((y0 + ((y1 - y0) * s) / steps) / H) * DH;
      const R = Math.ceil(r * 1.6);
      for (let j = Math.max(0, Math.floor(py - R)); j < Math.min(DH, py + R); j++)
        for (let i = Math.max(0, Math.floor(px - R)); i < Math.min(DW, px + R); i++) {
          const dd = ((i - px) ** 2 + (j - py) ** 2) / (r * r);
          const v = Math.round(255 * strength * Math.exp(-dd * 1.2));
          const o = j * DW + i;
          if (v > dist[o]) dist[o] = v;
        }
    }
    distDirty = true;
    distEnergy = 1;
  }
  function decay(dt, mult = 1) {
    if (!distEnergy) return;
    const f = Math.exp(-dt / 1.2) * mult;
    let mx = 0;
    for (let o = 0; o < dist.length; o++) {
      const v = Math.floor(dist[o] * f);
      dist[o] = v;
      if (v > mx) mx = v;
    }
    distDirty = true;
    if (mx < 3) { dist.fill(0); distEnergy = 0; }
  }
  function energy() {
    let s = 0;
    for (let o = 0; o < dist.length; o += 7) s += dist[o];
    return s / (dist.length / 7) / 255;
  }

  function compile() { renderer.compile(scene, camera); }

  let software = false;
  try {
    const gl = renderer.getContext();
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const r = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    software = /swiftshader|llvmpipe|softpipe|software/i.test(r);
  } catch (e) {}
  return { software, renderer, apply, render, compile, stamp, decay, energy, get frames() { return frames; }, canvas: renderer.domElement, blade, chunks, scale };
}

function lerpCol(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ca = [(pa >> 16) & 255, (pa >> 8) & 255, pa & 255], cb = [(pb >> 16) & 255, (pb >> 8) & 255, pb & 255];
  return ca.map((v, i) => (v + (cb[i] - v) * t) / 255);
}
