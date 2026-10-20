// Toon kit: one renderer, a near-orthographic "toy photo" camera where 1 world unit = 1 CSS px,
// one toon ShaderMaterial, one inverted-hull outline, the ikat thread ribbon and soft contact shadows.
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

THREE.ColorManagement.enabled = false; // hex values go straight to screen, so 3D matches the DOM palette exactly

export const PAL = {
  washi: '#FFF3E1', floor: '#F3DDBA', sumi: '#1E1A23', shu: '#F04A2A', firuza: '#16ACB2', kobalt: '#2E45D3',
  orik: '#FFB238', sakura: '#FFC4D0', tut: '#F0B84F', tutg: '#C98A2E', kraft: '#E3B47C',
  shuS: '#B8301A', firuzaS: '#0E7F84', kobaltS: '#1D2B95', orikS: '#E08A12', washiS: '#E8CFA7', tutS: '#C4882C',
};

export const G = { renderer: null, scene: null, camera: null, W: 0, H: 0, inkW: 2.75, outlines: [] };

export function initGL(canvas) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
  r.outputColorSpace = THREE.LinearSRGBColorSpace;
  r.setClearColor(0x000000, 0);
  r.setPixelRatio(Math.min(window.devicePixelRatio || 1, innerWidth < 600 ? 1.5 : 1.75));
  G.renderer = r;
  G.scene = new THREE.Scene();
  G.camera = new THREE.PerspectiveCamera(18, 1, 10, 60000);
  resizeGL();
  return G;
}

export function resizeGL() {
  G.W = innerWidth; G.H = innerHeight;
  G.renderer.setSize(G.W, G.H, false);
  G.camera.aspect = G.W / G.H;
  G.camera.position.set(0, 0, (G.H / 2) / Math.tan(THREE.MathUtils.degToRad(9)));
  G.camera.lookAt(0, 0, 0);
  G.camera.updateProjectionMatrix();
  G.inkW = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--iw')) || 2.75;
  for (const m of G.outlines) { m.uniforms.uRes.value.set(G.W, G.H); m.uniforms.uWidth.value = G.inkW * m.userData.k; }
}

// screen px (y down) -> world (y up, origin at centre)
export const sx2w = x => x - G.W / 2;
export const sy2w = y => G.H / 2 - y;
export const w2sx = x => x + G.W / 2;
export const w2sy = y => G.H / 2 - y;

const L = new THREE.Vector3(-0.72, 0.56, 0.42).normalize();

const toonVS = /* glsl */`
  varying vec3 vN; varying vec3 vV; varying vec3 vObj; varying vec2 vUv;
  void main(){
    vObj = position; vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }`;
const toonFS = /* glsl */`
  uniform vec3 uBase, uShade, uBounce, uLight;
  uniform float uGloss, uWood, uGrain, uTex, uTopAmt, uRimAmt;
  uniform sampler2D uMap, uShadeMap;
  varying vec3 vN; varying vec3 vV; varying vec3 vObj; varying vec2 vUv;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  void main(){
    vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
    vec3 v = normalize(vV);
    vec3 base = uBase, shade = uShade;
    if (uTex > 0.5) { base = texture2D(uMap, vUv).rgb; shade = texture2D(uShadeMap, vUv).rgb; }
    if (uWood > 0.0) {
      float g = sin(vObj.x * uWood + vObj.z * uWood * 0.4 + sin(vObj.y * 0.021) * 2.4);
      float b = smoothstep(0.35, 0.45, g) * 0.6 + smoothstep(0.8, 0.86, g) * 0.4;
      base = mix(base, base * vec3(0.93, 0.9, 0.86), b);
      shade = mix(shade, shade * vec3(0.94, 0.91, 0.88), b);
    }
    float ndl = dot(n, uLight);
    float lit = smoothstep(0.02, 0.10, ndl);
    float top = smoothstep(0.62, 0.70, ndl);
    vec3 col = mix(shade, base, lit);
    col = mix(col, mix(base, vec3(1.0), 0.2), top * 0.6 * uTopAmt);
    float rim = pow(1.0 - max(dot(n, v), 0.0), 3.0) * (1.0 - lit);
    col = mix(col, uBounce, clamp(rim * 1.4, 0.0, 0.55) * uRimAmt);
    vec3 hv = normalize(normalize(vec3(-0.5, 0.82, 0.6)) + v);
    float sp = dot(n, hv);
    float spec = smoothstep(0.978, 0.982, sp);
    float spec2 = smoothstep(0.9968, 0.9977, dot(n, normalize(normalize(vec3(-0.18, 0.62, 0.8)) + v)));
    col = mix(col, vec3(1.0, 0.985, 0.95), max(spec, spec2 * 0.9) * uGloss);
    col += (hash(floor(gl_FragCoord.xy)) - 0.5) * uGrain;
    gl_FragColor = vec4(col, 1.0);
  }`;

export function toon(base, shade, opts = {}) {
  const m = new THREE.ShaderMaterial({
    vertexShader: toonVS, fragmentShader: toonFS,
    uniforms: {
      uBase: { value: new THREE.Color(base) }, uShade: { value: new THREE.Color(shade) },
      uBounce: { value: new THREE.Color(opts.bounce || PAL.floor) }, uLight: { value: L.clone() },
      uGloss: { value: opts.gloss || 0 }, uWood: { value: opts.wood || 0 }, uGrain: { value: opts.grain ?? 0.035 },
      uTex: { value: opts.map ? 1 : 0 }, uMap: { value: opts.map || null }, uShadeMap: { value: opts.shadeMap || null },
      uTopAmt: { value: opts.top ?? 1 }, uRimAmt: { value: opts.rim ?? 1 },
    },
    side: opts.side || THREE.FrontSide,
  });
  return m;
}

const outVS = /* glsl */`
  uniform float uWidth; uniform vec2 uRes;
  void main(){
    vec4 clip = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vec3 vn = normalize(normalMatrix * normal);
    vec2 dir = normalize(vn.xy + 1e-5);
    clip.xy += dir * uWidth * 2.0 / uRes * clip.w;
    gl_Position = clip;
  }`;
const outFS = /* glsl */`uniform vec3 uInk; void main(){ gl_FragColor = vec4(uInk, 1.0); }`;

export function outlineMat(color = PAL.sumi, k = 1) {
  const m = new THREE.ShaderMaterial({
    vertexShader: outVS, fragmentShader: outFS, side: THREE.BackSide,
    uniforms: { uWidth: { value: G.inkW * k }, uRes: { value: new THREE.Vector2(G.W, G.H) }, uInk: { value: new THREE.Color(color) } },
  });
  m.userData.k = k;
  G.outlines.push(m);
  return m;
}

// mesh + inverted hull, as one group
export function toy(geom, mat, { ink = PAL.sumi, k = 1, hull = true } = {}) {
  const g = new THREE.Group();
  const mesh = new THREE.Mesh(geom, mat);
  g.add(mesh);
  if (hull) {
    const hg = geom.clone(); hg.deleteAttribute('uv'); hg.deleteAttribute('normal');
    const merged = mergeVertices(hg, 1e-3); merged.computeVertexNormals();
    const h = new THREE.Mesh(merged, outlineMat(ink, k));
    g.add(h); g.userData.hull = h;
  }
  g.userData.mesh = mesh;
  return g;
}

// ---------- ikat thread ribbon (abrband: shu, orik, washi, firuza, kobalt, washi) ----------
const ribVS = /* glsl */`
  attribute float aS; attribute float aSide;
  varying float vS; varying float vSide;
  void main(){ vS = aS; vSide = aSide; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const ribFS = /* glsl */`
  uniform vec3 c0, c1, c2, c3, c4, c5, uInk; uniform float uCore, uSeg, uDash;
  varying float vS; varying float vSide;
  float hash(float p){ return fract(sin(p * 91.345) * 47453.5453); }
  float hash2(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  vec3 pick(float i){
    i = mod(i, 6.0);
    if (i < 0.5) return c0; if (i < 1.5) return c1; if (i < 2.5) return c2;
    if (i < 3.5) return c3; if (i < 4.5) return c4; return c5;
  }
  void main(){
    float k = vS / uSeg + 0.22 * (hash(floor(vS / uSeg)) - 0.5) + 0.06 * sin(vS * 0.31 + vSide * 2.3);
    float id = floor(k); float f = fract(k);
    vec3 col = pick(id);
    if (f > 0.86 && hash2(floor(gl_FragCoord.xy)) < (f - 0.86) / 0.14) col = pick(id + 1.0);
    if (uDash > 0.0 && fract(vS / uDash) > 0.55) discard;
    float a = abs(vSide);
    float w = fwidth(vSide) * 1.2;
    float ink = smoothstep(uCore - w, uCore + w, a);
    float edge = 1.0 - smoothstep(1.0 - w, 1.0, a);
    gl_FragColor = vec4(mix(col, uInk, ink), edge);
  }`;

export class Ribbon {
  constructor(n, { width = 7.5, core = 0.56, seg = 46, dash = 0 } = {}) {
    this.n = n; this.width = width;
    const geo = new THREE.BufferGeometry();
    this.pos = new Float32Array(n * 2 * 3); this.s = new Float32Array(n * 2); this.side = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) { this.side[i * 2] = -1; this.side[i * 2 + 1] = 1; }
    const idx = [];
    for (let i = 0; i < n - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    geo.setIndex(idx);
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    geo.setAttribute('aS', new THREE.BufferAttribute(this.s, 1));
    geo.setAttribute('aSide', new THREE.BufferAttribute(this.side, 1));
    const c = k => ({ value: new THREE.Color(k) });
    this.mat = new THREE.ShaderMaterial({
      vertexShader: ribVS, fragmentShader: ribFS, transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide,
      uniforms: { c0: c(PAL.shu), c1: c(PAL.orik), c2: c('#FFF8EC'), c3: c(PAL.firuza), c4: c(PAL.kobalt), c5: c('#FFF8EC'), uInk: c(PAL.sumi),
        uCore: { value: core }, uSeg: { value: seg }, uDash: { value: dash } },
    });
    this.mesh = new THREE.Mesh(geo, this.mat);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 5;
    this.geo = geo;
  }
  // pts: array of [x, y] in screen px; z: world z
  update(pts, z = 0, s0 = 0) {
    const n = Math.min(pts.length, this.n), hw = this.width / 2;
    let s = s0;
    for (let i = 0; i < this.n; i++) {
      const j = Math.min(i, n - 1);
      const p = pts[j], a = pts[Math.max(j - 1, 0)], b = pts[Math.min(j + 1, n - 1)];
      let tx = b[0] - a[0], ty = b[1] - a[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
      if (i > 0 && i < n) s += Math.hypot(p[0] - pts[j - 1][0], p[1] - pts[j - 1][1]);
      const nx = -ty, ny = tx;
      const X = sx2w(p[0]), Y = sy2w(p[1]);
      this.pos.set([X + nx * hw, Y - ny * hw, z, X - nx * hw, Y + ny * hw, z], i * 6);
      this.s[i * 2] = s; this.s[i * 2 + 1] = s;
    }
    this.geo.attributes.position.needsUpdate = true; this.geo.attributes.aS.needsUpdate = true;
    this.geo.computeBoundingSphere();
  }
}

// ---------- soft contact shadow ----------
const shVS = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const shFS = `uniform float uA; uniform vec3 uC; varying vec2 vUv;
  void main(){ float d = length((vUv - 0.5) * 2.0); float a = (1.0 - smoothstep(0.35, 1.0, d)) * uA; gl_FragColor = vec4(uC, a); }`;
export function contactShadow(w, h, alpha = 0.16, color = PAL.sumi) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.ShaderMaterial({
    vertexShader: shVS, fragmentShader: shFS, transparent: true, depthWrite: false,
    uniforms: { uA: { value: alpha }, uC: { value: new THREE.Color(color) } },
  }));
  m.renderOrder = -1;
  return m;
}

export { THREE };
