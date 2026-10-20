// The kendama rig: ken (lathe), sarado (lathe along X) with big/small cup bowls, bead, and the tama.
// Built in CSS-px units for a given height H, origin at the centre of the base cup, y up.
import { THREE, PAL, toon, toy, G, sx2w, sy2w, w2sx, w2sy } from './gl.js';

const V2 = (r, y) => new THREE.Vector2(r, y);

function kenProfile(H) {
  const p = [
    [0.0, 0.016], [0.04, 0.012], [0.07, 0.006], [0.094, 0.0], [0.1, 0.005], [0.1005, 0.013], [0.095, 0.022],
    [0.076, 0.032], [0.058, 0.042], [0.05, 0.058], [0.0465, 0.085], [0.045, 0.16], [0.0425, 0.33], [0.042, 0.45],
    [0.0445, 0.59], [0.048, 0.645], [0.046, 0.668], [0.034, 0.685], [0.03, 0.72], [0.03, 0.84],
    [0.034, 0.848], [0.0345, 0.862], [0.029, 0.874], [0.021, 0.91], [0.0135, 0.955], [0.0085, 0.985], [0.0045, 0.996], [0.0, 1.0],
  ];
  return p.map(([r, y]) => V2(r * H, y * H));
}
function saradoProfile(H) {
  // along the axis a (big cup at -0.19, small cup at +0.19), r = radius
  const p = [
    [0.084, -0.19], [0.096, -0.186], [0.095, -0.172], [0.083, -0.152], [0.062, -0.13], [0.047, -0.108], [0.043, -0.09],
    [0.052, -0.062], [0.06, -0.035], [0.063, 0.0], [0.06, 0.035], [0.051, 0.062], [0.043, 0.085], [0.044, 0.1],
    [0.052, 0.125], [0.067, 0.15], [0.077, 0.172], [0.079, 0.186], [0.069, 0.19],
  ];
  return p.map(([r, a]) => V2(r * H, a * H));
}
function bowl(H, rim, a0, depth, dir) {
  const pts = [];
  for (let i = 0; i <= 10; i++) {
    const u = i / 10, r = rim * Math.sin(u * Math.PI / 2) * H;
    const a = (a0 + dir * depth * Math.cos(u * Math.PI / 2)) * H;
    pts.push(V2(Math.max(r, 0.0001), a));
  }
  return pts;
}

// ---------- the tama's painted skin (equirectangular), base + shade versions ----------
function paintBall(shade) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512;
  const x = c.getContext('2d');
  const col = shade
    ? { shu: PAL.shuS, washi: PAL.washiS, fir: PAL.firuzaS, ink: '#141118', orik: PAL.orikS }
    : { shu: PAL.shu, washi: '#FFF6E6', fir: PAL.firuza, ink: PAL.sumi, orik: PAL.orik };
  x.fillStyle = col.shu; x.fillRect(0, 0, 1024, 512);
  const band = 0.2 / Math.PI * 512; // ±0.2 rad
  x.fillStyle = col.washi; x.fillRect(0, 256 - band, 1024, band * 2);
  x.fillStyle = col.ink; x.fillRect(0, 256 - band - 3, 1024, 4); x.fillRect(0, 256 + band - 1, 1024, 4);
  // three bodom (almond) motifs, 120deg apart, plus small dots between
  const bodom = (cx, cy, w, h) => {
    x.beginPath();
    x.moveTo(cx - w * 0.5 + h * 0.5, cy + h * 0.5);
    x.bezierCurveTo(cx - w * 0.5 - h * 0.12, cy + h * 0.5, cx - w * 0.5 - h * 0.12, cy - h * 0.5, cx - w * 0.5 + h * 0.5, cy - h * 0.5);
    x.bezierCurveTo(cx + w * 0.05, cy - h * 0.52, cx + w * 0.32, cy - h * 0.32, cx + w * 0.52, cy - h * 0.66);
    x.bezierCurveTo(cx + w * 0.4, cy + h * 0.12, cx + w * 0.1, cy + h * 0.5, cx - w * 0.5 + h * 0.5, cy + h * 0.5);
    x.closePath();
  };
  for (let i = 0; i < 3; i++) {
    const cx = 170 + i * 1024 / 3;
    x.lineWidth = 5; x.strokeStyle = col.ink; x.fillStyle = col.fir;
    bodom(cx, 256, 112, 50); x.fill(); x.stroke();
    x.fillStyle = col.washi; x.beginPath(); x.ellipse(cx - 22, 256 + 2, 11, 11, 0, 0, Math.PI * 2); x.fill(); x.lineWidth = 3; x.stroke();
    x.fillStyle = col.shu; x.beginPath(); x.ellipse(cx - 22, 256 + 2, 4.5, 4.5, 0, 0, Math.PI * 2); x.fill();
    // dots between motifs
    for (const d of [-1, 1]) { x.fillStyle = col.orik; x.beginPath(); x.arc(cx + 170 * d * 0.5 + 85, 256, 7, 0, Math.PI * 2); x.fill(); x.lineWidth = 3; x.stroke(); }
  }
  // the hole at the south pole (canvas bottom)
  const hole = 0.21 / Math.PI * 512;
  x.fillStyle = col.ink; x.fillRect(0, 512 - hole, 1024, hole);
  x.fillStyle = shade ? '#8F2414' : '#C8381E'; x.fillRect(0, 512 - hole - 7, 1024, 7);
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 4; t.colorSpace = THREE.NoColorSpace;
  return t;
}
let ballTex = null;
export function ballMaterial(bounce) {
  if (!ballTex) ballTex = [paintBall(false), paintBall(true)];
  return toon(PAL.shu, PAL.shuS, { map: ballTex[0], shadeMap: ballTex[1], gloss: 1, bounce });
}

export function makeBall(r, { ink = PAL.sumi, bounce } = {}) {
  const g = toy(new THREE.SphereGeometry(r, 64, 48), ballMaterial(bounce), { ink });
  g.userData.r = r;
  return g;
}

export function makeKendama(H, { bounce = PAL.floor } = {}) {
  const wood = toon(PAL.tut, PAL.tutS, { wood: 0.25, bounce });
  const bowlMat = toon('#D99A3C', '#B07424', { bounce, top: 0, side: THREE.DoubleSide });

  const rig = new THREE.Group();     // position = base on the floor; rotation.z = lean; scale = squash
  const body = new THREE.Group();    // rotation.x/y = view tilt and turn
  rig.add(body);

  const ken = toy(new THREE.LatheGeometry(kenProfile(H), 48), wood);
  body.add(ken);

  const sarado = new THREE.Group();
  sarado.position.y = 0.78 * H;
  const sg = new THREE.LatheGeometry(saradoProfile(H), 48); sg.rotateZ(-Math.PI / 2);
  sarado.add(toy(sg, wood));
  const big = new THREE.Mesh(new THREE.LatheGeometry(bowl(H, 0.086, -0.19, 0.05, 1), 40), bowlMat);
  big.geometry.rotateZ(-Math.PI / 2);
  sarado.add(big);
  const small = new THREE.Mesh(new THREE.LatheGeometry(bowl(H, 0.071, 0.19, 0.04, -1), 40), bowlMat);
  small.geometry.rotateZ(-Math.PI / 2);
  sarado.add(small);
  // ink lips on the cups
  const ink = new THREE.MeshBasicMaterial({ color: PAL.sumi });
  const lipB = new THREE.Mesh(new THREE.TorusGeometry(0.0875 * H, G.inkW * 0.55, 8, 64), ink); lipB.rotation.y = Math.PI / 2; lipB.position.x = -0.1895 * H; sarado.add(lipB);
  const lipS = new THREE.Mesh(new THREE.TorusGeometry(0.072 * H, G.inkW * 0.55, 8, 64), ink); lipS.rotation.y = Math.PI / 2; lipS.position.x = 0.1895 * H; sarado.add(lipS);
  body.add(sarado);

  // string hole bead, just under the sarado on the left side of the ken
  const bead = new THREE.Mesh(new THREE.SphereGeometry(0.012 * H, 16, 12), ink);
  bead.position.set(-0.034 * H, 0.7 * H, 0.012 * H);
  body.add(bead);

  const K = { H, rig, body, ken, sarado, bead };
  // pose: x,y = base in screen px; rot = lean (rad, + = clockwise on screen); sx, sy squash; ry turn; rx tilt; pivot (fraction of H) for rotation
  K.pose = (p) => {
    const sy = p.sy ?? 1, sx = p.sx ?? 1;
    const d = (p.pivot ?? 0) * H * sy;
    const th = -(p.rot || 0);
    rig.rotation.z = th;
    rig.scale.set(sx, sy, sx);
    const pivX = sx2w(p.x), pivY = sy2w(p.y) + d;
    rig.position.set(pivX + Math.sin(th) * d, pivY - Math.cos(th) * d, p.z || 0);
    body.rotation.set(p.rx ?? 0.14, p.ry ?? 0.5, 0, 'XYZ');
    rig.updateMatrixWorld(true);
  };
  const tmp = new THREE.Vector3();
  K.toScreen = (obj, local) => {
    tmp.copy(local).applyMatrix4(obj.matrixWorld).project(G.camera);
    return [(tmp.x + 1) / 2 * G.W, (1 - tmp.y) / 2 * G.H];
  };
  K.beadScreen = () => { tmp.set(0, 0, 0).applyMatrix4(bead.matrixWorld).project(G.camera); return [(tmp.x + 1) / 2 * G.W, (1 - tmp.y) / 2 * G.H]; };
  K.tipScreen = (ext = 0) => K.toScreen(body, new THREE.Vector3(0, H * (1 + ext), 0));
  K.axisScreen = () => { const a = K.toScreen(body, new THREE.Vector3(0, 0, 0)), b = K.toScreen(body, new THREE.Vector3(0, H, 0)); const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]; };
  K.bigCupScreen = () => K.toScreen(sarado, new THREE.Vector3(-0.19 * H, 0, 0));
  K.local = (x, y, z) => K.toScreen(body, new THREE.Vector3(x * H, y * H, z * H));
  return K;
}
