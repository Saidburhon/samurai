import * as THREE from 'three';
import { Stage } from './stage.js';
import { drawOshigata } from './oshigata.js';
import * as G from './geom.js';
import { washiTile, grainTile, wordAtlas } from './paper.js';

const q = new URLSearchParams(location.search);
const scene = q.get('scene') || 'hero';
const T = parseFloat(q.get('t') ?? '0.7');
const still = q.has('still') || true;
document.body.dataset.scene = scene;
{ const idx = { hero: 0, reveal: 0, utsuri: 1, tsuba: 4 }[scene] ?? 0; document.querySelectorAll('.ruler li').forEach((li, i) => li.classList.toggle('on', i === idx));
  const dot = document.querySelector('.ruler .dot'); if (dot) dot.style.left = `calc(${(idx + 0.5) / 7 * 100}% - 2.5px)`; }

// ---------- paper + grain (generated, no image files) ----------
document.querySelector('.sheet.washi').style.backgroundImage = `url(${washiTile()})`;
document.querySelector('.grain').style.backgroundImage = `url(${grainTile()})`;

// ---------- live clocks ----------
function clocks() {
  const f = (tz) => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(new Date());
  try { document.querySelector('.t-tas').textContent = f('Asia/Tashkent'); document.querySelector('.t-tok').textContent = f('Asia/Tokyo'); } catch (e) {}
}
clocks();

const W = innerWidth, H = innerHeight;
const phone = W <= 600;
const canvas = document.getElementById('gl');
const stage = new Stage(canvas, { pixelRatio: Math.min(2, (devicePixelRatio || 1) * 2) });
stage.setSize(W, H);
const v3 = (x, y, z) => new THREE.Vector3(x, y, z);

// place the kantei lamp so that its mirror glint lands on blade point (s, zf) of the top face
const PROF = [[0, 0], [0.35, 0.035], [0.5, 0.28], [0.46, 0.45], [0.33, 0.72], [0.12, 0.93], [0, 1]];
function topY(zf) { for (let i = 1; i < PROF.length; i++) if (zf <= PROF[i][1]) { const a = PROF[i - 1], b = PROF[i]; const t = (zf - a[1]) / (b[1] - a[1]); return a[0] + (b[0] - a[0]) * t; } return 0; }
function lampGlint(s, zf, dist = 7) {
  const k = G.thick(s), e = 0.01;
  const L = (z) => { const p = G.bladePoint(s, topY(z) * k, z); return v3(p[0], p[1], p[2]); };
  const P0 = L(zf), Pz = L(zf + e).sub(L(zf - e)), Ps = (() => { const a = G.bladePoint(s + 0.01, topY(zf) * G.thick(s + 0.01), zf), b = G.bladePoint(s - 0.01, topY(zf) * G.thick(s - 0.01), zf); return v3(a[0] - b[0], a[1] - b[1], a[2] - b[2]); })();
  const nl = Pz.clone().cross(Ps).normalize(); if (nl.y < 0) nl.negate();
  const P = stage.world(P0);
  const n = nl.applyQuaternion(stage.sword.getWorldQuaternion(new THREE.Quaternion())).normalize();
  const C = stage.camera.position.clone();
  const toC = C.clone().sub(P).normalize();
  const r = n.clone().multiplyScalar(2 * toC.dot(n)).sub(toC);
  stage.U.uLampPos.value.copy(P.clone().add(r.clone().multiplyScalar(dist)));
  // the kantei lamp is also seen as a small bright disc in the steel: the kirari glint
  stage.U.uGlintDir.value.copy(r.normalize());
}

const light = v3(-0.22, 1, -0.50); // shadow light: from above, slightly to the spine side

async function setup() {
  await document.fonts.ready;
  await Promise.all([
    document.fonts.load('280 76px Geologica'), document.fonts.load('400 13px "Martian Mono"'),
    document.fonts.load('500 20px "Zen Old Mincho"'), document.fonts.load('900 40px "Zen Old Mincho"'),
  ]).catch(() => {});
  const osh = document.getElementById('osh'), stip = document.getElementById('stipple');

  if (scene === 'hero' || scene === 'reveal') {
    const flat = scene === 'reveal';
    let Ks, Ts, detail = null, oshOpt = {}, off;
    if (!phone) {
      Ks = [104, 628]; Ts = [1326, 232];
      detail = { cx: 292, cy: 232, r: 86, rot: 0, label: [392, 336, 'start'] };
      off = [8, 24];
    } else {
      Ks = [244, 806]; Ts = [334, 104];
      oshOpt = { nagasa: false, soriLead: 22, dots: 5000 };
      off = [13, 5];
    }
    const lift = flat ? G.TSUBA_R * 1.03 : (phone ? 0.95 : 1.05);
    const fov = flat ? 2 : (phone ? 24 : 20);
    stage.frameTopDown(fov, Ks, Ts, lift);
    const U = stage.U;
    U.uCeilB.value.set(-0.28, 0.26); U.uCeilHi.value.set(0.26, 0.265, 0.28); U.uKeyB.value.set(-0.62, 1.0); U.uKeySoft.value = 0.012; U.uRidge.value = 0.45;
    U.uFrostLight.value = 1.25; U.uFrostAmb.value.set(0.07, 0.072, 0.078);
    if (flat) {
      stage.fitDrawing(Ks, Ts);
      stage.pose({ roll: 0, pitch: 0, studioRoll: -0.60 });
      U.uReveal.value = T; U.uFront.value = 1;
      stage.steelU.uNie.value = 420;
      lampGlint(Math.max(0.05, Math.min(0.95, (T * 10.06 - 3.06) / 7.0 - 0.03)), 0.58, 9);
      U.uGlintCol.value.set(0, 0, 0);
    } else {
      stage.fitDrawing([Ks[0] + off[0], Ks[1] + off[1]], [Ts[0] + off[0], Ts[1] + off[1]]);
      stage.pose({ roll: -0.30, pitch: 0.0 });
      U.uReveal.value = 2; U.uFront.value = 0;
      stage.steelU.uNie.value = phone ? 300 : 520;
      lampGlint(0.78, 0.60, 8);
      U.uGlintCol.value.set(40, 36, 30); U.uGlintSize.value = 0.006;
    }
    stage.updateShadow(light, { soft: 0.14, base: 0.02 });
    drawOshigata(stage, osh, stip, { reveal: flat ? T : 2, detail: phone ? null : detail, ...oshOpt });
  }

  if (scene === 'utsuri') {
    document.getElementById('oshigata').style.display = 'none';
    stage.shadow.visible = false;
    // dark studio: black room, one long strip for the shinogi, a faint floor
    const U = stage.U;
    U.uCeil.value.set(0.003, 0.0035, 0.005); U.uCeilHi.value.set(0.06, 0.064, 0.075); U.uCeilA.value.set(-0.9, 0.2); U.uCeilB.value.set(0.1, 1.0);
    U.uFloor.value.set(0.02, 0.02, 0.024);
    U.uKey.value.set(0.9, 0.92, 1.0); U.uKeyA.value.set(-0.86, -0.66); U.uKeyB.value.set(0.25, 0.95); U.uKeySoft.value = 0.03;
    U.uStrip.value.set(1.6, 1.65, 1.8); U.uStripA.value.set(0.95, 1.5);
    U.uRim.value.set(0, 0, 0);
    U.uFrostLight.value = 1.0; U.uFrostAmb.value.set(0.10, 0.105, 0.115); U.uRidge.value = 0.9;
    U.uLampCol.value.set(1.6, 1.45, 1.25);
    stage.yaw = 0; stage.basePos = v3(0, 0, 0);
    stage.pose({ roll: -0.10 });
    // camera: close, long blade section crossing on the -18deg diagonal, base side nearer
    const cam = stage.camera;
    cam.fov = 26; cam.updateProjectionMatrix();
    const tgt = stage.world(v3(...G.bladePoint(0.53, 0, 0.5)));
    cam.position.copy(tgt).add(v3(-1.50, 1.72, 0.60));
    cam.up.set(0, 1, 0); cam.lookAt(tgt);
    // roll the camera so the blade axis reads at -18deg on screen
    for (let i = 0; i < 4; i++) {
      cam.updateMatrixWorld();
      const a = stage.project(stage.world(v3(...G.bladePoint(0.40, 0, 0.5)))), b = stage.project(stage.world(v3(...G.bladePoint(0.66, 0, 0.5))));
      const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
      const want = -18 * Math.PI / 180;
      cam.rotateZ(want - ang);
    }
    cam.updateMatrixWorld();
    // centre the blade a touch below the frame centre
    // reflected sign
    const atlas = wordAtlas(['iOS · Android']);
    stage.steelU.uWords.value = atlas;
    const nB = v3(0, 1, 0).applyQuaternion(stage.sword.getWorldQuaternion(new THREE.Quaternion())).normalize();
    const P = stage.world(v3(...G.bladePoint(0.50, G.thick(0.50) * 0.45, 0.56)));
    const Vd = P.clone().sub(cam.position).normalize();
    const R = Vd.clone().sub(nB.clone().multiplyScalar(2 * Vd.dot(nB)));
    const dS = 5.0;
    const C = P.clone().add(R.clone().multiplyScalar(dS));
    const Nsg = R.clone().negate();
    const along = stage.world(v3(1, 0, 0)).sub(stage.world(v3(0, 0, 0))).normalize();
    let Uu = along.clone().sub(Nsg.clone().multiplyScalar(along.dot(Nsg))).normalize();
    let Vv = Nsg.clone().cross(Uu).normalize();
    const sw = 4.0, sh = sw / 8;
    Uu.multiplyScalar(sw); Vv.multiplyScalar(-sh);
    const O = C.clone().sub(Uu.clone().multiplyScalar(0.5)).sub(Vv.clone().multiplyScalar(0.5));
    Object.assign(stage.steelU, {});
    stage.steelU.uSignO.value.copy(O); stage.steelU.uSignU.value.copy(Uu); stage.steelU.uSignV.value.copy(Vv); stage.steelU.uSignN.value.copy(Nsg);
    stage.steelU.uBladeN.value.copy(nB); stage.steelU.uFlatten.value = 0.80; stage.steelU.uWordAlpha.value = 1;
    stage.steelU.uNie.value = 1500;
    // lamp glint far right on the blade
    stage.U.uLampPos.value.copy(stage.world(v3(...G.bladePoint(0.74, 0, 0.6))).add(v3(1.2, 2.6, -2.0)));
  }

  if (scene === 'tsuba') {
    document.getElementById('oshigata').style.display = 'none';
    stage.shadow.visible = false;
    const U = stage.U;
    // indigo night: almost black room, a cold strip above, warm lamp behind the guard
    U.uCeil.value.set(0.004, 0.005, 0.012); U.uCeilHi.value.set(0.02, 0.026, 0.06); U.uCeilA.value.set(-0.6, 0.6); U.uCeilB.value.set(-2, 2);
    U.uFloor.value.set(0.006, 0.008, 0.02);
    U.uKey.value.set(0.55, 0.6, 0.8); U.uKeyA.value.set(-1.1, -0.5); U.uKeyB.value.set(-1.4, 1.4); U.uKeySoft.value = 0.2;
    U.uStrip.value.set(0, 0, 0); U.uRidge.value = 0.0;
    U.uFrostLight.value = 1.0; U.uFrostAmb.value.set(0.03, 0.035, 0.05);
    U.uLampCol.value.set(2.2, 1.9, 1.5);
    stage.yaw = 0; stage.basePos = v3(0, 0, 0);
    stage.pose({ roll: 0 });
    stage.U.uStudio.value.setFromMatrix4(new THREE.Matrix4());
    const tc = stage.worldH(v3((G.H.tsuba[0] + G.H.tsuba[1]) / 2, 0, 0));
    const axis = stage.worldH(v3(1, 0, 0)).sub(stage.worldH(v3(0, 0, 0))).normalize();
    stage.mat.iron.uniforms.uAxisW.value.copy(axis);
    stage.mat.iron.uniforms.uBackGlow.value.set(2.6, 1.6, 0.75);
    stage.mat.iron.uniforms.uBase.value.set(0.05, 0.045, 0.045);
    const dist = 30;
    const tipW = stage.world(v3(G.B.L, 0, 0.02));
    const tipDir = tipW.clone().sub(tc).normalize();
    const mode = q.get('cam') || 'a';
    const baseW = stage.worldH(v3(0, 0, 0));
    const chord = tipW.clone().sub(baseW).normalize();
    const dir = mode === 'b' ? chord.clone().add(v3(0, 0.010, 0)).normalize() : axis.clone().lerp(tipDir, 0.5).normalize().add(v3(0, 0.014, -0.006)).normalize();
    const cam = stage.camera;
    cam.position.copy(tc).add(dir.multiplyScalar(dist));
    cam.up.set(0, 0, -1); cam.lookAt(tc);
    const frac = phone ? 0.36 : 0.47;
    cam.fov = 2 * Math.atan((G.TSUBA_R * 1.03) / (frac * dist)) * 180 / Math.PI;
    cam.near = 1; cam.far = 60;
    const offX = phone ? 0 : -0.12 * W, offY = phone ? -0.06 * H : 0;
    cam.setViewOffset(W, H, offX, offY, W, H);
    cam.updateProjectionMatrix(); cam.updateMatrixWorld();
    stage.initRays(0.335, -1.15, [2.1, 1.42, 0.70]);
    // a raking lamp from the upper left for the iron, and the backlight seen at grazing in the blade
    U.uLampPos.value.copy(tc).add(axis.clone().multiplyScalar(6)).add(v3(5, 0, -7));
    U.uGlintDir.value.copy(axis).negate(); U.uGlintSize.value = 0.022; U.uGlintCol.value.set(2.4, 1.7, 1.0);
  }

  stage.render();
  document.documentElement.classList.add('ready');
  window.__ready = true;
}
setup();
