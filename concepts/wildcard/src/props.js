import * as THREE from 'three';
import { C } from './palette.js';
import { DELA } from './cartoon.js';

const col = (h) => new THREE.Color(h);

function radialTexture(stops, size = 256) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops.forEach(([o, s]) => gr.addColorStop(o, s));
  g.fillStyle = gr;
  g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function woodTexture() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = C.kiri;
  g.fillRect(0, 0, 512, 128);
  // maple grain: long gently waving lines along the shuttle
  for (let k = 0; k < 90; k++) {
    const y0 = Math.random() * 128;
    const a = 1 + Math.random() * 4, f = 0.004 + Math.random() * 0.01, ph = Math.random() * 6;
    g.strokeStyle = Math.random() < 0.7 ? `rgba(110,70,35,${0.08 + Math.random() * 0.16})` : `rgba(255,225,180,${0.08 + Math.random() * 0.12})`;
    g.lineWidth = 0.6 + Math.random() * 1.6;
    g.beginPath();
    for (let x = 0; x <= 512; x += 8) {
      const y = y0 + Math.sin(x * f + ph) * a + Math.sin(x * f * 3.1 + ph) * a * 0.3;
      x ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.stroke();
  }
  // a few flecks (maple ray)
  for (let k = 0; k < 160; k++) {
    g.fillStyle = `rgba(120,80,40,${0.1 + Math.random() * 0.15})`;
    g.fillRect(Math.random() * 512, Math.random() * 128, 2 + Math.random() * 5, 0.8);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

// boat shuttle, 140 x 22, plan view (lies on the cloth, long axis along x)
export function makeShuttle({ x, y, W, H, bobbin = C.emerald, scale = 1 }) {
  const g = new THREE.Group();
  const s = new THREE.Shape();
  s.moveTo(-64, 0);
  s.bezierCurveTo(-36, 12.4, 36, 12.4, 64, 0);
  s.bezierCurveTo(36, -12.4, -36, -12.4, -64, 0);
  const hole = new THREE.Path();
  const hw = 30, hh = 5.2, r = 4;
  hole.moveTo(-hw + r, -hh);
  hole.lineTo(hw - r, -hh);
  hole.quadraticCurveTo(hw, -hh, hw, -hh + r);
  hole.lineTo(hw, hh - r);
  hole.quadraticCurveTo(hw, hh, hw - r, hh);
  hole.lineTo(-hw + r, hh);
  hole.quadraticCurveTo(-hw, hh, -hw, hh - r);
  hole.lineTo(-hw, -hh + r);
  hole.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
  s.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(s, { depth: 9, bevelEnabled: true, bevelThickness: 3.2, bevelSize: 2.6, bevelSegments: 5, curveSegments: 40 });
  const wt = woodTexture();
  wt.repeat.set(1 / 140, 1 / 34);
  wt.offset.set(0.5, 0.5);
  const wood = new THREE.MeshPhysicalMaterial({ map: wt, roughness: 0.38, clearcoat: 0.6, clearcoatRoughness: 0.25, sheen: 0.0 });
  g.add(new THREE.Mesh(geo, wood));
  // pirn with wound weft
  const pc = document.createElement('canvas');
  pc.width = 64; pc.height = 256;
  const pg = pc.getContext('2d');
  pg.fillStyle = bobbin;
  pg.fillRect(0, 0, 64, 256);
  for (let k = 0; k < 256; k += 2) {
    pg.fillStyle = `rgba(0,0,0,${0.1 + Math.random() * 0.12})`;
    pg.fillRect(0, k, 64, 1);
  }
  const pt = new THREE.CanvasTexture(pc);
  pt.colorSpace = THREE.SRGBColorSpace;
  const pirn = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.6, 54, 24), new THREE.MeshPhysicalMaterial({ map: pt, roughness: 0.5, sheen: 1, sheenColor: col('#ffffff'), sheenRoughness: 0.4 }));
  pirn.rotation.z = Math.PI / 2;
  pirn.position.z = 7;
  g.add(pirn);
  // steel tips
  const steel = new THREE.MeshPhysicalMaterial({ color: 0xd4d8de, metalness: 1, roughness: 0.22 });
  for (const sgn of [-1, 1]) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(3.4, 16, 20), steel);
    cone.rotation.z = -sgn * Math.PI / 2;
    cone.position.set(sgn * 70, 0, 6);
    g.add(cone);
  }
  // soft contact shadow on the cloth
  const sh = new THREE.Mesh(
    new THREE.PlaneGeometry(190, 56),
    new THREE.MeshBasicMaterial({ map: radialTexture([[0, 'rgba(0,0,0,0.55)'], [0.55, 'rgba(0,0,0,0.18)'], [1, 'rgba(0,0,0,0)']]), transparent: true, depthWrite: false, toneMapped: false })
  );
  sh.position.set(6, -7, -11);
  g.add(sh);
  g.scale.setScalar(scale);
  g.position.set(x - W / 2, H / 2 - y, 12);
  return g;
}

// paper andon lamp with 止
export function makeAndon({ x, y, w = 64, h = 180, W, H, glyph = '止', lit = C.shu }) {
  const g = new THREE.Group();
  const c = document.createElement('canvas');
  const S = 3;
  c.width = w * S; c.height = h * S;
  const p = c.getContext('2d');
  const gr = p.createRadialGradient(c.width / 2, c.height * 0.48, 4, c.width / 2, c.height * 0.48, c.height * 0.62);
  gr.addColorStop(0, '#FF8A4C');
  gr.addColorStop(0.45, '#F2552A');
  gr.addColorStop(1, '#B92E14');
  p.fillStyle = gr;
  p.fillRect(0, 0, c.width, c.height);
  // washi fibres
  for (let k = 0; k < 700; k++) {
    p.strokeStyle = `rgba(255,230,200,${0.04 + Math.random() * 0.08})`;
    p.lineWidth = 0.6 + Math.random();
    const x0 = Math.random() * c.width, y0 = Math.random() * c.height, a = Math.random() * Math.PI;
    const L = 4 + Math.random() * 18;
    p.beginPath(); p.moveTo(x0, y0); p.lineTo(x0 + Math.cos(a) * L, y0 + Math.sin(a) * L); p.stroke();
  }
  // bamboo ribs
  for (let yy = 22 * S; yy < c.height; yy += 22 * S) {
    p.fillStyle = 'rgba(110,20,8,0.28)';
    p.fillRect(0, yy - 1.5 * S, c.width, 1.5 * S);
  }
  // glyph
  p.font = `${44 * S}px ${DELA}`;
  p.textAlign = 'center';
  p.textBaseline = 'middle';
  p.shadowColor = 'rgba(255,240,220,0.9)';
  p.shadowBlur = 18;
  p.fillStyle = C.ivory;
  p.fillText(glyph, c.width / 2, c.height * 0.5);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const paper = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, toneMapped: false }));
  paper.position.z = 10;
  g.add(paper);
  // wooden caps and posts
  const wood = new THREE.MeshStandardMaterial({ color: 0x2a1d16, roughness: 0.6, metalness: 0.0 });
  for (const sy of [-1, 1]) {
    const cap = new THREE.Mesh(new THREE.BoxGeometry(w + 12, 12, 24), wood);
    cap.position.set(0, sy * (h / 2 + 5), 8);
    g.add(cap);
  }
  for (const sx of [-1, 1]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(3.5, h, 6), wood);
    post.position.set(sx * (w / 2 + 0.5), 0, 12);
    g.add(post);
  }
  // cord
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 60, 8), wood);
  cord.position.set(0, h / 2 + 40, 8);
  g.add(cord);
  // halo
  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: radialTexture([[0, 'rgba(255,120,70,0.75)'], [0.22, 'rgba(240,84,44,0.32)'], [0.55, 'rgba(226,66,31,0.09)'], [1, 'rgba(226,66,31,0)']]),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    })
  );
  halo.scale.set(560, 560, 1);
  halo.position.z = 4;
  g.add(halo);
  g.position.set(x - W / 2, H / 2 - y, 6);
  return g;
}

// a thread end as a tube, points given in screen px (x, y, z)
export function makeThread(points, { W, H, color = C.saffron, radius = 1.7 }) {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x - W / 2, H / 2 - y, z)), false, 'centripetal');
  const geo = new THREE.TubeGeometry(curve, 160, radius, 10, false);
  const mat = new THREE.MeshPhysicalMaterial({ color: col(color), roughness: 0.42, sheen: 1, sheenColor: col('#fff1c9'), sheenRoughness: 0.35, emissive: col(color), emissiveIntensity: 0.12 });
  return new THREE.Mesh(geo, mat);
}
