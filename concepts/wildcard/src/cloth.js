import * as THREE from 'three';
import { hex3, C } from './palette.js';

const vert = /* glsl */ `
uniform vec2 uRes;
uniform float uBend;
uniform float uRecede;
uniform float uTime;
uniform float uWind;
varying vec2 vC;
varying float vD;
void main(){
  vec3 p = position;
  vec2 c = vec2(p.x + uRes.x * 0.5, uRes.y * 0.5 - p.y);
  vC = c;
  p.z += uWind * sin(c.x * .004 + uTime * .6) * sin(c.y * .006 + uTime * .4);
  float d = c.y - uBend;
  if (d > 0.0) {
    // loose warp recedes into the loom; a soft knee right under the blade
    float k = d * uRecede;
    p.z -= k + 0.0006 * d * d;
  }
  vD = max(d, 0.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const frag = /* glsl */ `
precision highp float;
uniform sampler2D tCart;
uniform sampler2D tRole;
uniform vec2 uRes;
uniform vec2 uCart;
uniform float uPitch;
uniform float uFell;
uniform float uBend;
uniform float uAmpW;
uniform float uAmpAbr;
uniform float uAmpL;
uniform float uLooseOrigin;
uniform float uLooseScale;
uniform float uLooseLen;
uniform float uFade;
uniform float uNearW;
uniform float uNearD;
uniform float uFresh;
uniform float uTime;
uniform vec3 uNight;
uniform vec3 uGlow;
uniform vec4 uPick;      // top, bottom, shuttleX, dir (0 = off)
uniform vec3 uPickCol;
uniform float uJiyak;    // px of tri-colour border woven above the fell
uniform vec3 uLight;
uniform vec2 uLightPos;
uniform float uSweep;
uniform vec4 uSignal;    // thread index, break y, unused, on
uniform vec3 uSignalCol;
uniform vec4 uAndon;     // x, y, strength, radius
uniform vec3 uAndonCol;
uniform vec4 uDisturb;   // x, y, radius, amp
uniform vec4 uTrail[12]; // cursor sweep: x, y, radius, amp
uniform float uDim;
varying vec2 vC;
varying float vD;

#define PI 3.14159265
float h1(float n){ return fract(sin(n * 127.1 + 1.7) * 43758.5453); }
float h2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n1(float x){ float i = floor(x), f = fract(x); float u = f*f*(3.-2.*f); return mix(h1(i), h1(i+1.), u); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.-2.*f);
  return mix(mix(h2(i), h2(i+vec2(1,0)), u.x), mix(h2(i+vec2(0,1)), h2(i+vec2(1,1)), u.x), u.y); }

vec3 cart(vec2 p){ return texture2D(tCart, vec2(p.x / uCart.x, 1.0 - p.y / uCart.y)).rgb; }
float roleAt(vec2 p){ return texture2D(tRole, vec2(p.x / uCart.x, 1.0 - p.y / uCart.y)).r; }

void main(){
  float cx = vC.x, cy = vC.y;
  float fi = cx / uPitch;
  float i = floor(fi);
  float u = fract(fi);
  float r1 = h1(i + 0.13), r2 = h1(i + 91.7), r3 = h1(i + 47.3);
  float bundle = n1(i / 9.0 + 3.1) * 2.0 - 1.0;
  float bundleA = n1(i / 4.0 + 11.0) * 2.0 - 1.0;
  float xc = (i + 0.5) * uPitch;
  float rowPx = uPitch * 0.5;
  float row = floor(cy / rowPx);

  bool inPick = uPick.w != 0.0 && cy >= uPick.x && cy < uPick.y;
  float pj = (h1(row + 7.0) - 0.5) * 8.0 + (cy - uPick.x) * 0.0;
  bool pickWoven = inPick && (uPick.w > 0.0 ? cx < uPick.z + pj : cx > uPick.z + pj);
  bool woven = (cy < uFell && !inPick) || pickWoven;

  // cursor / velocity disturbance (gaussian)
  float dist = length(vec2(cx, cy) - uDisturb.xy);
  float dis = uDisturb.w * exp(-dist * dist / (2.0 * uDisturb.z * uDisturb.z));
  for (int k = 0; k < 12; k++) {
    vec4 tp = uTrail[k];
    if (tp.w > 0.0) { vec2 dv = vec2(xc, cy) - tp.xy; dis += tp.w * exp(-dot(dv, dv) / (2.0 * tp.z * tp.z)); }
  }

  vec3 col;
  if (woven) {
    float rl = roleAt(vec2(xc, cy));
    float kas = smoothstep(0.2, 0.42, rl) * (1.0 - smoothstep(0.62, 0.85, rl));
    float abr = smoothstep(0.62, 0.85, rl);
    float baseG = 0.55 * bundle + 0.45 * (r1 * 2.0 - 1.0);
    float baseA = 0.78 * bundleA + 0.22 * (r1 * 2.0 - 1.0);
    float amp = uAmpW * mix(1.0, 0.6, kas);
    // a hand disturbance slides whole bundles of threads (flame-like), never per-pixel noise
    float bundleD = n1(i / 5.0 + 23.0) * 2.0 - 1.0;
    float offD = (0.8 * bundleD + 0.2 * (r2 * 2.0 - 1.0)) * dis;
    // rows just beaten in are still settling (each kaizen beat halves this)
    amp += uFresh * exp(-max(uFell - cy, 0.0) / 46.0);
    float off = mix(baseG * amp, baseA * uAmpAbr, abr) + offD * mix(1.0, 1.25, abr);
    if (pickWoven) off += baseG * 5.0 * exp(-abs(cx - uPick.z) / 160.0);
    float bl = mix(1.5, 2.0, abr);
    vec3 dye = 0.5 * (cart(vec2(xc, cy + off + bl)) + cart(vec2(xc, cy + off - bl)));

    // signal thread (jidoka)
    bool missing = false;
    if (uSignal.w > 0.5 && abs(i - uSignal.x) < 0.5) {
      if (cy < uSignal.y) dye = uSignalCol; else missing = true;
    }

    // jiyak: tri-colour weft border just above the fell (weft-faced rows)
    float jy = uFell - cy;
    float jrow = floor(jy / rowPx);
    bool jiyak = uJiyak > 0.0 && jy > 0.0 && jy <= uJiyak && !inPick && mod(jrow, 2.0) < 0.5;

    float prof = mix(0.9, 1.0, pow(sin(PI * u), 0.6));
    float crown = pow(sin(PI * u), 2.5);
    float bind = step(mod(row + 2.0 * i, 5.0), 0.5);
    float fib = (h2(vec2(i, floor(cy / 2.0))) - 0.5) * 0.022;
    float slub = (n1(cy / 37.0 + r2 * 40.0) - 0.5) * 0.05 * step(0.975, r3);
    float grain = 1.0 + (r2 - 0.5) * 0.03 + fib + slub;
    // large-scale silk tonal drift
    grain *= 1.0 + (n2(vec2(cx, cy) / 380.0) - 0.5) * 0.035;

    if (jiyak) {
      float band = floor(jrow / 2.0);
      vec3 wc = band < 0.5 ? vec3(0.039, 0.498, 0.333) : (band < 1.5 ? vec3(0.949, 0.694, 0.106) : vec3(0.82, 0.078, 0.353));
      float wr = fract(cy / rowPx);
      float wprof = mix(0.8, 1.0, pow(sin(PI * wr), 0.7));
      // plain weave: warp shows through on alternating cells
      float warpUp = step(0.5, mod(row + i, 2.0)) * step(0.35, abs(u - 0.5)) ;
      dye = mix(wc, dye, 0.0);
      col = wc * wprof * (1.0 - 0.10 * warpUp);
      prof = 1.0;
    }

    // anisotropic (Kajiya-Kay) satin sheen; fibre tangent perturbed by soft cloth undulation
    float s = 0.24 * sin(cx * 0.0019 + cy * 0.0031 + uTime * 0.15 + 0.6)
            + 0.13 * sin(cx * 0.0047 - cy * 0.0017 + 1.7)
            + 0.05 * sin(cy * 0.013 + cx * 0.002 + 0.4);
    vec3 T = normalize(vec3(0.0, 1.0, s));
    vec3 V = vec3(0.0, 0.0, 1.0);
    vec3 L = normalize(uLight);
    vec3 Hh = normalize(L + V);
    float th = dot(T, Hh);
    float kk = pow(max(0.0, 1.0 - th * th), 14.0);
    float lum = dot(dye, vec3(0.299, 0.587, 0.114));
    vec3 specCol = mix(vec3(1.0, 0.975, 0.93), dye * 1.6 + 0.15, 0.35);

    if (!jiyak) col = dye * prof * grain * (1.0 - 0.03 * bind * crown);
    col *= 0.955 + 0.06 * (0.5 + 0.5 * s * 2.0);
    col += kk * (0.35 + 0.65 * crown) * specCol * mix(0.13, 0.26, 1.0 - lum) * (1.0 - 0.2 * bind);
    // slow diagonal satin sweep
    float sw = exp(-pow((cx * 0.8 + cy * 0.6 - uSweep) / 240.0, 2.0));
    col += sw * (0.4 + 0.6 * crown) * specCol * 0.10;

    if (missing) {
      // the broken warp leaves a channel: weft shows, darker
      float wr = fract(cy / rowPx);
      col = dye * 0.42 * mix(0.7, 1.0, pow(sin(PI * wr), 0.7));
      col += 0.06 * uSignalCol * exp(-(cy - uSignal.y) / 40.0);
    }

    // pressed by the blade: soft contact shade just above the fell
    float fd = uBend - cy;
    if (fd > 0.0) col *= 1.0 - 0.16 * exp(-fd / 3.0);
  } else {
    bool flatZone = cy < uBend;
    float d = max(cy - uBend, 0.0);
    float lit = flatZone ? 1.0 : exp(-d / uFade) * (1.0 - smoothstep(0.75, 1.0, d / uLooseLen) * 0.5);
    // a soft overhead light cone: centre of the loom brighter than its sides
    if (!flatZone) lit *= 0.62 + 0.38 * exp(-pow((cx - uRes.x * 0.5) / (uRes.x * 0.42), 2.0));
    float baseL = 0.6 * bundle + 0.4 * (r1 * 2.0 - 1.0);
    float ampL = flatZone ? (inPick ? 3.0 : 8.0) : uAmpL;
    float sy = flatZone ? cy + baseL * ampL : uLooseOrigin + d * uLooseScale + baseL * ampL + (r2 - 0.5) * 18.0;
    vec3 dye = 0.5 * (cart(vec2(xc, sy + 2.0)) + cart(vec2(xc, sy - 2.0)));
    if (uSignal.w > 0.5 && abs(i - uSignal.x) < 0.5) dye = uSignalCol;
    // strings hang with a faint lateral wander; each catches the light differently
    float wob = sin(cy * 0.011 + r1 * 40.0) * 0.55 + sin(cy * 0.027 + r2 * 17.0) * 0.25;
    float uu = fract((cx + wob * (flatZone ? 0.2 : 1.0) + (flatZone ? 0.0 : (r1 - 0.5) * 0.3 * uPitch)) / uPitch);
    float w = flatZone ? 0.21 : mix(0.15, uNearW, exp(-d / uNearD));
    float fw = max(fwidth(fi), 1e-4);
    float tu = (uu - 0.5) / w;
    float cov = 1.0 - smoothstep(w - fw * 0.75, w + fw * 0.75, abs(uu - 0.5));
    float tube = sqrt(max(0.0, 1.0 - tu * tu));
    float catchL = 0.78 + 0.44 * r3;
    vec3 thr = dye * (0.45 + 0.55 * tube) * (0.035 + 0.965 * lit) * catchL;
    thr += pow(tube, 8.0) * 0.28 * lit * catchL * vec3(1.0, 0.96, 0.9);
    // strings right under the blade are close to the lamp: they glow
    if (!flatZone) thr *= 1.0 + 0.45 * exp(-d / 70.0);
    float glow = flatZone ? 0.0 : exp(-d / 30.0);
    thr += uGlow * glow * 0.4 * (0.6 + 0.4 * tube);
    vec3 gap = uNight + uGlow * (flatZone ? 0.025 : exp(-d / 60.0) * 0.12);
    col = mix(gap, thr, cov);
  }

  // andon: vermilion wash from the lantern
  if (uAndon.z > 0.0) {
    float ad = length(vec2(cx, cy) - uAndon.xy);
    col += uAndonCol * uAndon.z * exp(-ad * ad / (uAndon.w * uAndon.w)) * (woven ? 0.55 + 0.45 * pow(sin(PI * u), 2.0) : 0.6);
  }

  // key light falloff
  float lf = length((vec2(cx, cy) - uLightPos) / uRes.x);
  col *= 1.0 - 0.10 * smoothstep(0.25, 1.25, lf);
  col *= uDim;
  gl_FragColor = vec4(col, 1.0);
}
`;

export function makeCloth({ W, H, cart, cfg }) {
  const tex = new THREE.CanvasTexture(cart.canvas);
  tex.colorSpace = THREE.NoColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  const rtex = new THREE.CanvasTexture(cart.role);
  rtex.colorSpace = THREE.NoColorSpace;
  rtex.generateMipmaps = false;
  rtex.minFilter = rtex.magFilter = THREE.LinearFilter;

  const Wc = W * 2.4, Hc = H * 2.2;
  const geo = new THREE.PlaneGeometry(Wc, Hc, 64, Math.round(Hc / 4));
  geo.translate(0, H / 2 + 60 - Hc / 2, 0);

  const u = {
    tCart: { value: tex },
    tRole: { value: rtex },
    uRes: { value: new THREE.Vector2(W, H) },
    uCart: { value: new THREE.Vector2(cart.W, cart.ch) },
    uPitch: { value: cfg.pitch },
    uFell: { value: cfg.fell },
    uBend: { value: cfg.bend ?? cfg.fell },
    uRecede: { value: cfg.recede ?? 1.2 },
    uWind: { value: cfg.wind ?? 0.0 },
    uAmpW: { value: cfg.ampW ?? 0.8 },
    uAmpAbr: { value: cfg.ampAbr ?? 5.0 },
    uAmpL: { value: cfg.ampL ?? 60 },
    uLooseOrigin: { value: cfg.looseOrigin ?? cfg.fell },
    uLooseScale: { value: cfg.looseScale ?? 1 / 2.2 },
    uLooseLen: { value: cfg.looseLen ?? 300 },
    uFade: { value: cfg.fade ?? 90 },
    uNearW: { value: cfg.nearW ?? 0.27 },
    uNearD: { value: cfg.nearD ?? 110 },
    uFresh: { value: cfg.fresh ?? 0 },
    uTime: { value: cfg.time ?? 9.0 },
    uNight: { value: new THREE.Vector3(...hex3(C.loom)) },
    uGlow: { value: new THREE.Vector3(...hex3('#F2A23A')) },
    uPick: { value: new THREE.Vector4(...(cfg.pick ?? [0, 0, 0, 0])) },
    uPickCol: { value: new THREE.Vector3(...hex3(cfg.pickCol ?? C.emerald)) },
    uJiyak: { value: cfg.jiyak ?? 0 },
    uLight: { value: new THREE.Vector3(...(cfg.light ?? [-0.35, 0.22, 1.0])) },
    uLightPos: { value: new THREE.Vector2(...(cfg.lightPos ?? [W * 0.3, H * 0.25])) },
    uSweep: { value: cfg.sweep ?? W * 0.9 },
    uSignal: { value: new THREE.Vector4(...(cfg.signal ?? [0, 0, 0, 0])) },
    uSignalCol: { value: new THREE.Vector3(...hex3(C.saffron)) },
    uAndon: { value: new THREE.Vector4(...(cfg.andon ?? [0, 0, 0, 1])) },
    uAndonCol: { value: new THREE.Vector3(...hex3(C.shu)) },
    uDisturb: { value: new THREE.Vector4(...(cfg.disturb ?? [0, 0, 1, 0])) },
    uTrail: { value: Array.from({ length: 12 }, (_, k) => new THREE.Vector4(...((cfg.trail && cfg.trail[k]) || [0, 0, 1, 0]))) },
    uDim: { value: cfg.dim ?? 1.0 },
  };
  const mat = new THREE.ShaderMaterial({ uniforms: u, vertexShader: vert, fragmentShader: frag, toneMapped: false });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  return { mesh, uniforms: u, tex, rtex };
}
