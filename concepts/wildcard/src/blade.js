import * as THREE from 'three';
import { C } from './palette.js';

// A horizontal katana, edge up, built from a swept cross-section.
// Local frame: x along the blade (0 = habaki end), y = 0 at the edge line, blade body below (negative y).
function bladeGeometry({ L, w0, w1, t0, t1, kL }) {
  const N = 260;
  const facets = [
    [0.0, 0.42, 0.72], // ji: edge -> hira-niku -> shinogi (smooth)
    [0.72, 0.94],      // shinogi-ji
    [0.94, 1.0],       // mune slope
  ];
  const zAt = (v, t) => {
    if (v <= 0.72) {
      const q = v / 0.72;
      return t * (0.06 + 0.94 * Math.pow(q, 0.78)); // slightly convex ji (hira-niku)
    }
    if (v <= 0.94) return t * (1.0 - 0.3 * (v - 0.72) / 0.22);
    return t * 0.7 * (1.0 - (v - 0.94) / 0.06) + 0.0;
  };
  const geos = [];
  facets.forEach((vs) => {
    const pos = [], av = [], ax = [], idx = [];
    const subs = vs.length === 3 ? 10 : 2;
    const vList = [];
    for (let k = 0; k < vs.length - 1; k++)
      for (let s = 0; s < subs; s++) vList.push(vs[k] + ((vs[k + 1] - vs[k]) * s) / subs);
    vList.push(vs[vs.length - 1]);
    const M = vList.length;
    for (let n = 0; n <= N; n++) {
      const x = (L * n) / N;
      const f = x / L;
      const w = w0 + (w1 - w0) * f;
      const t = t0 + (t1 - t0) * f;
      const yB = -w;
      let yE = 0;
      let yBk = yB;
      if (x > L - kL) {
        const q = (x - (L - kL)) / kL;
        yE = yB + w * Math.sqrt(Math.max(0, 1 - q * q)); // fukura
        yBk = yB + w * 0.12 * q * q;
      }
      const tt = x > L - kL ? t * (1 - Math.pow((x - (L - kL)) / kL, 2) * 0.85) : t;
      for (let m = 0; m < M; m++) {
        const v = vList[m];
        const y = yE + (yBk - yE) * v;
        pos.push(x, y, zAt(v, tt));
        av.push(v);
        ax.push(x);
      }
    }
    for (let n = 0; n < N; n++)
      for (let m = 0; m < M - 1; m++) {
        const a = n * M + m, b = a + 1, c = a + M, d = c + 1;
        idx.push(a, b, c, b, d, c);
      }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('aV', new THREE.Float32BufferAttribute(av, 1));
    g.setAttribute('aX', new THREE.Float32BufferAttribute(ax, 1));
    g.setIndex(idx);
    g.computeVertexNormals();
    geos.push(g);
  });
  return geos;
}

function steelMaterial(glint) {
  const m = new THREE.MeshPhysicalMaterial({
    color: 0xc9ced6,
    metalness: 1.0,
    roughness: 0.16,
    envMapIntensity: 1.15,
  });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uGlint = glint;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aV;\nattribute float aX;\nvarying float vAV;\nvarying float vAX;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvAV = aV; vAX = aX;');
    sh.fragmentShader = sh.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
varying float vAV; varying float vAX; uniform float uGlint;
float bh(float n){ return fract(sin(n*91.3)*43758.5453); }
float bn(float x){ float i=floor(x), f=fract(x); float u=f*f*(3.-2.*f); return mix(bh(i), bh(i+1.), u); }`
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
float hb = 0.34 + 0.07*sin(vAX*0.043) + 0.04*sin(vAX*0.117+1.7) + 0.05*(bn(vAX*0.06)-0.5);
float yaki = smoothstep(hb + 0.05, hb - 0.03, vAV);
float shinogiJi = smoothstep(0.71, 0.73, vAV);
diffuseColor.rgb *= mix(1.0, 1.16, yaki);
diffuseColor.rgb *= mix(1.0, 0.78, shinogiJi);`
      )
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, 0.34, yaki);
roughnessFactor = mix(roughnessFactor, 0.08, shinogiJi);`
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
// nie: crystalline sparkles along the temper line
vec2 cell = floor(vec2(vAX * 0.55, vAV * 40.0));
float sp = step(0.93, bh(cell.x * 17.0 + cell.y * 3.1));
float zone = exp(-pow((vAV - hb) / 0.06, 2.0));
totalEmissiveRadiance += vec3(0.55, 0.58, 0.62) * sp * zone * 0.55;
// travelling glint
float gl = exp(-pow((vAX - uGlint) / 26.0, 2.0)) * (1.0 - 0.6 * vAV);
totalEmissiveRadiance += vec3(1.0, 0.98, 0.95) * gl * 0.75;
totalEmissiveRadiance += vec3(0.9, 0.93, 0.97) * yaki * 0.05;`
      );
  };
  return m;
}

function tsukaTexture() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 512;
  const g = c.getContext('2d');
  // samegawa (ray skin) under the wrap
  g.fillStyle = '#E9E1CF';
  g.fillRect(0, 0, 256, 512);
  for (let k = 0; k < 2200; k++) {
    const x = Math.random() * 256, y = Math.random() * 512, r = 0.8 + Math.random() * 1.6;
    g.fillStyle = `rgba(${150 + Math.random() * 60},${140 + Math.random() * 50},${120 + Math.random() * 40},0.35)`;
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  }
  // tsuka-ito: indigo silk braid crossing in diamonds; u (x) around the grip, v (y) along it
  const P = 64; // period along the grip in texels
  g.save();
  for (let y0 = -P; y0 < 512 + P; y0 += P) {
    for (const dir of [-1, 1]) {
      g.save();
      g.beginPath();
      // band crossing the front: from (0, y0) to (128, y0 + dir*P/2) mirrored around u=0.5 (front centre at x=64 and x=192)
      const w = 30;
      for (const cxF of [64, 192]) {
        g.moveTo(cxF - 70, y0 - dir * 40 - w / 2);
        g.lineTo(cxF + 70, y0 + dir * 40 - w / 2);
        g.lineTo(cxF + 70, y0 + dir * 40 + w / 2);
        g.lineTo(cxF - 70, y0 - dir * 40 + w / 2);
        g.closePath();
      }
      const ik = ['#D1145A', '#F2B11B', '#0A7F55', '#F6F1E6'];
      const gr = g.createLinearGradient(0, y0 - 60, 0, y0 + 60);
      ik.forEach((c, n) => { gr.addColorStop(n / 4, c); gr.addColorStop((n + 1) / 4 - 0.02, c); });
      g.fillStyle = gr;
      g.fill();
      g.clip();
      // silk braid ribs
      g.strokeStyle = 'rgba(40,20,30,0.22)';
      g.lineWidth = 1.2;
      for (let k = -40; k < 300; k += 4) {
        g.beginPath();
        g.moveTo(k, y0 - 60);
        g.lineTo(k - dir * 30, y0 + 60);
        g.stroke();
      }
      g.restore();
    }
  }
  g.restore();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

export function makeBlade({ W, H, fellY, scale = 1, tsubaX = 104, tipMargin = 44 }) {
  const root = new THREE.Group();
  const group = new THREE.Group();
  root.add(group);
  const glint = { value: W * 0.62 };
  const bladeStart = tsubaX + 22 * scale;
  const L = W - tipMargin - bladeStart;
  const w0 = 14 * scale, w1 = 10.5 * scale;
  const geos = bladeGeometry({ L, w0, w1, t0: 3.6 * scale, t1: 2.3 * scale, kL: 22 * scale });
  const steel = steelMaterial(glint);
  geos.forEach((g) => {
    const m = new THREE.Mesh(g, steel);
    m.position.x = bladeStart;
    group.add(m);
  });
  // back side (mirror z) so the silhouette has thickness at grazing angles
  geos.forEach((g) => {
    const m = new THREE.Mesh(g, steel);
    m.position.x = bladeStart;
    m.scale.z = -1;
    group.add(m);
  });

  // habaki (copper collar)
  const habaki = new THREE.Mesh(
    new THREE.BoxGeometry(18 * scale, w0 + 3 * scale, 9 * scale),
    new THREE.MeshPhysicalMaterial({ color: 0xb87a4b, metalness: 1, roughness: 0.28 })
  );
  habaki.position.set(tsubaX + 13 * scale, -w0 / 2, 0);
  group.add(habaki);
  // seppa (copper washers) + tsuba (iron guard), seen edge-on, with a gold rim
  const iron = new THREE.MeshPhysicalMaterial({ color: 0x2e2a27, metalness: 0.6, roughness: 0.5 });
  const copper = new THREE.MeshPhysicalMaterial({ color: 0xb8754a, metalness: 1, roughness: 0.32 });
  const gilt = new THREE.MeshPhysicalMaterial({ color: 0xc9a15a, metalness: 1, roughness: 0.3 });
  const tsuba = new THREE.Mesh(new THREE.CylinderGeometry(25 * scale, 25 * scale, 5.5 * scale, 48), iron);
  tsuba.rotation.z = Math.PI / 2;
  tsuba.scale.set(1, 1, 0.82);
  tsuba.position.set(tsubaX, -w0 / 2, 0);
  group.add(tsuba);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(25 * scale, 1.1 * scale, 8, 64), gilt);
  rim.rotation.y = Math.PI / 2;
  rim.scale.set(1, 1, 1);
  rim.position.set(tsubaX + 2.9 * scale, -w0 / 2, 0);
  group.add(rim);
  for (const dx of [-4.2, 4.2]) {
    const s = new THREE.Mesh(new THREE.CylinderGeometry(15 * scale, 15 * scale, 1.6 * scale, 32), copper);
    s.rotation.z = Math.PI / 2;
    s.position.set(tsubaX + dx * scale, -w0 / 2, 0);
    group.add(s);
  }
  // fuchi + tsuka (grip) running off the left edge
  const fuchi = new THREE.Mesh(new THREE.CylinderGeometry(11.5 * scale, 11.5 * scale, 9 * scale, 32), iron);
  fuchi.rotation.z = Math.PI / 2;
  fuchi.scale.set(1, 1, 0.8);
  fuchi.position.set(tsubaX - 9 * scale, -w0 / 2, 0);
  group.add(fuchi);
  const tlen = 260 * scale;
  const tt = tsukaTexture();
  tt.repeat.set(1, tlen / (30 * scale) / 8);
  tt.offset.set(0.25, 0);
  const tsuka = new THREE.Mesh(
    new THREE.CylinderGeometry(11 * scale, 11.6 * scale, tlen, 48, 1, true),
    new THREE.MeshStandardMaterial({ map: tt, roughness: 0.62, metalness: 0.0 })
  );
  tsuka.rotation.z = Math.PI / 2;
  tsuka.scale.set(1, 1, 0.8);
  tsuka.position.set(tsubaX - 13 * scale - tlen / 2, -w0 / 2, 0);
  group.add(tsuka);

  // spine up: mirror the blade so the blunt back meets the fell and the edge faces the loose warp
  group.scale.y = -1;
  group.position.y = -w0;
  const setY = (y) => root.position.set(-W / 2, H / 2 - y, 7);
  setY(fellY);
  return { group: root, glint, setY, h: w0 };
}
