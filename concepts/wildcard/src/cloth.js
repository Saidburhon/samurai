import * as THREE from 'three';
import { hex3, C } from './palette.js';

const vert = /* glsl */ `
uniform vec2 uRes;
uniform float uFell;
uniform float uRecede;
uniform float uTime;
uniform float uWind;
uniform float uShock;   // beat shock wave travelling up the cloth (0..1 phase, <0 off)
uniform float uShockA;
varying vec2 vC;
void main(){
  vec3 p = position;
  vec2 c = vec2(p.x + uRes.x * 0.5, uRes.y * 0.5 - p.y);
  vC = c;
  float d = c.y - uFell;
  if (d > 0.0) p.z -= (d * 0.7 + 0.0006 * d * d) * uRecede;
  else {
    p.z += uWind * sin(c.x * .004 + uTime * .6) * sin(c.y * .006 + uTime * .4);
    float s = uShock - (-d) / 700.0;
    p.z += uShockA * exp(-s * s * 90.0);
  }
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const frag = /* glsl */ `
precision highp float;
uniform sampler2D tA; uniform sampler2D tB; uniform sampler2D tRA; uniform sampler2D tRB;
uniform float uSplitY; uniform vec2 uSzA; uniform vec2 uSzB;
uniform vec2 uRes;
uniform float uPitch, uClothY, uFell, uWTop, uWBot;
uniform float uAmpW, uAmpVel, uVelSign, uFresh;
uniform float uAmpL, uAmpTop, uLooseScale, uLooseOff, uFade, uNearW, uNearD, uLooseLen, uTopLit;
uniform float uSweep;
uniform vec3 uLight; uniform vec2 uLightPos;
uniform vec3 uNight, uGlow, uIvory;
uniform vec4 uPull; uniform vec3 uPullOld;
uniform vec4 uPick;
uniform vec2 uJiyak;        // strip Y of the band's lower edge, height
uniform vec4 uShearR; uniform float uShear;
uniform vec4 uShotR; uniform float uShotFront; uniform vec3 uShotA; uniform vec3 uShotB;
uniform vec4 uSig;          // x, top, bottom, on
uniform vec4 uAndon; uniform vec3 uAndonCol;
uniform vec4 uSafe; uniform float uSafeK;
uniform float uTies;
uniform vec4 uDrop;         // t, centre thread, generation step, fall duration (t < 0: off)
uniform vec2 uIntro;        // registration progress (0..1, staggered), max amplitude
uniform sampler2D tDist;
uniform float uDistOn;
uniform float uDim;
varying vec2 vC;

#define PI 3.14159265
float h1(float n){ return fract(sin(n * 127.1 + 1.7) * 43758.5453); }
float n1(float x){ float i = floor(x), f = fract(x); float u = f*f*(3.-2.*f); return mix(h1(i), h1(i+1.), u); }

vec3 dyeAt(float x, float Y){
  if (Y < uSplitY) return texture2D(tA, vec2(x / uSzA.x, 1.0 - Y / uSzA.y)).rgb;
  return texture2D(tB, vec2(x / uSzB.x, 1.0 - (Y - uSplitY) / uSzB.y)).rgb;
}
float roleAt(float x, float Y){
  if (Y < uSplitY) return texture2D(tRA, vec2(x / uSzA.x, 1.0 - Y / uSzA.y)).r;
  return texture2D(tRB, vec2(x / uSzB.x, 1.0 - (Y - uSplitY) / uSzB.y)).r;
}

void main(){
  float cx = vC.x, cy = vC.y;
  float fi = cx / uPitch;
  float i = floor(fi), u = fract(fi);
  float aa = max(fwidth(fi), 1e-4);
  float detail = 1.0 - smoothstep(0.17, 0.32, aa);
  float r1 = h1(i + 0.13), r2 = h1(i + 91.7), r3 = h1(i + 47.3);
  float bun = h1(floor(i / 6.0) + 3.7) * 2.0 - 1.0;          // bundles of 6 threads share most of their offset
  float base = 0.75 * bun + 0.25 * (r1 * 2.0 - 1.0);
  float xc = (i + 0.5) * uPitch;
  float rowPx = uPitch * 0.5;

  bool inPick = uPick.w != 0.0 && cy >= uPick.x && cy < uPick.y;
  float pj = (h1(floor(cy / rowPx) + 7.0) - 0.5) * 8.0;
  bool pickWoven = inPick && (uPick.w > 0.0 ? cx < uPick.z + pj : cx > uPick.z - pj);
  bool woven = (cy >= uWTop && cy < uWBot && !inPick) || pickWoven;

  vec2 dv = vec2(cx / uRes.x, cy / uRes.y);
  float dis = (uDistOn > 0.5 && dv.x > 0.0 && dv.x < 1.0 && dv.y > 0.0 && dv.y < 1.0) ? texture2D(tDist, dv).r * 24.0 : 0.0;

  vec3 col;
  if (woven) {
    float Y = uClothY + cy;
    float sx = cx;
    if (uShear != 0.0 && Y >= uShearR.y && Y < uShearR.w && cx >= uShearR.x && cx < uShearR.z) {
      float Lr = uShearR.z - uShearR.x;
      sx = uShearR.x + mod(cx - uShearR.x + uShear, Lr);
    }
    bool old = false;
    if (uPull.w >= 0.0 && cx >= uPull.x && Y >= uPull.y && Y < uPull.y + uPull.z + 200.0) {
      float s0 = floor(uPull.x / uPitch), s1 = floor(uRes.x / uPitch);
      float ti = clamp((i - s0) / max(1.0, s1 - s0), 0.0, 1.0);   // 0 at the split, 1 at the right edge
      float e = clamp((uPull.w - (1.0 - ti) * 0.55) / 0.45, 0.0, 1.0);
      e = e * e * (3.0 - 2.0 * e);
      Y -= (1.0 - e) * uPull.z;
      if (Y < uPull.y) old = true;
    }
    float rl = old ? 0.0 : roleAt(sx, Y);
    float abr = smoothstep(0.68, 0.85, rl);
    float kas = smoothstep(0.25, 0.45, rl) * (1.0 - abr);
    float amp = uAmpW * (1.0 + 1.0 * abr) * mix(1.0, 0.55, kas);
    amp += uAmpVel * mix(1.0, 0.6, kas) + dis * mix(1.0, 1.25, abr);
    amp += uFresh * exp(-max(uWBot - cy, 0.0) / 46.0);
    float off = base * amp + uVelSign * uAmpVel * 0.35 * (r2 - 0.5);
    float bl = mix(1.2, 1.8, abr);
    vec3 dye = old ? uPullOld : 0.5 * (dyeAt(sx, Y + off + bl) + dyeAt(sx, Y + off - bl));

    // jiyak: a tri-colour weft border woven into the cloth just above where the blade sat (grows pick by pick)
    float rowY = Y / rowPx;
    float row = floor(rowY);
    float wr = fract(rowY);
    float jt = Y - (uJiyak.x - 9.0 * rowPx);
    if (uJiyak.y > 0.0 && jt >= 0.0 && jt < uJiyak.y) {
      float jrow = floor(jt / rowPx);
      float band = floor(jrow / 3.0);
      vec3 wc = band < 0.5 ? vec3(0.82, 0.078, 0.353) : (band < 1.5 ? vec3(0.949, 0.694, 0.106) : vec3(0.039, 0.498, 0.333));
      dye = mod(jrow, 3.0) > 1.5 ? mix(dye, uIvory, 0.8) : wc;
    }

    // shot weave: Tokyo warp x Tashkent weft, a third changeant colour
    if (uShotFront > 0.0 && Y >= uShotR.y && Y < uShotR.w && cx >= uShotR.x && cx < min(uShotR.z, uShotFront)) {
      float ch = 0.5 + 0.5 * sin(cx * 0.011 + cy * 0.017 + uSweep * 0.004);
      vec3 shot = mix(uShotA, uShotB, 0.25 + 0.5 * ch);
      float warpUp = step(0.5, fract(u + 0.25 * step(0.5, mod(row, 2.0))));
      dye = mix(shot, mix(uShotA, uShotB, warpUp), 0.28 * detail);
    }

    // signal-thread channel (jidoka): the warp under the 3D thread is missing
    if (uSig.w > 0.5 && abs(cx - uSig.x) < uPitch * 0.5 && Y >= uSig.y && Y < uSig.z) dye *= 0.38;

    // satin: round warp threads, sparse binding points, rare slubs, static grain
    float prof = mix(0.95, mix(0.88, 1.0, pow(sin(PI * u), 0.6)), detail);
    float crown = pow(sin(PI * u), 2.5);
    float bind = step(mod(row + 2.0 * i, 5.0), 0.5) * 0.045 * detail;
    float wprof = mix(1.0, mix(0.965, 1.0, pow(sin(PI * wr), 0.7)), detail);
    float slub = (n1(Y / 37.0 + r2 * 40.0) - 0.5) * 0.06 * step(0.975, r3);
    float grain = 1.0 + (r2 - 0.5) * 0.03 + slub;
    col = dye * prof * wprof * grain * (1.0 - bind * crown);

    // Kajiya-Kay sheen along the warp, the cloth undulating softly
    float s = 0.24 * sin(cx * 0.0019 + Y * 0.0031 + 0.6) + 0.13 * sin(cx * 0.0047 - Y * 0.0017 + 1.7);
    vec3 T = normalize(vec3(0.0, 1.0, s));
    vec3 Hh = normalize(normalize(uLight) + vec3(0.0, 0.0, 1.0));
    float th = dot(T, Hh);
    float kk = pow(max(0.0, 1.0 - th * th), 14.0);
    float lum = dot(dye, vec3(0.299, 0.587, 0.114));
    vec3 specCol = mix(vec3(1.0, 0.975, 0.93), dye * 1.6 + 0.15, 0.35);
    col *= 0.955 + 0.06 * (0.5 + s);
    col += kk * (0.35 + 0.65 * crown * detail) * specCol * mix(0.12, 0.24, 1.0 - lum);
    float sw = exp(-pow((cx * 0.8 + cy * 0.6 - uSweep) / 300.0, 2.0));
    col += sw * (0.4 + 0.6 * crown) * specCol * 0.15;

    // pressed by the blade: soft contact shade just above the fell
    float fd = uWBot - cy;
    if (fd > 0.0) col *= 1.0 - 0.16 * exp(-fd / 3.0);
  } else {
    bool above = cy < uFell;
    float d = max(cy - uFell, 0.0);
    float bunL = n1(i / 9.0 + 3.1) * 2.0 - 1.0;
    float baseL = 0.6 * bunL + 0.4 * (r1 * 2.0 - 1.0);
    float Y;
    if (above) {
      Y = uClothY + cy + baseL * uAmpTop;
    } else {
      float ia = 0.0, st = 1.0;
      if (uIntro.y > 0.0) {
        float e = clamp((uIntro.x - (i / max(1.0, uRes.x / uPitch)) * 0.45) / 0.55, 0.0, 1.0);
        e = e * e * (3.0 - 2.0 * e);
        ia = uIntro.y * (1.0 - e);
        st = 1.0 + 2.0 * (1.0 - e);
      }
      float yy = d * uLooseScale;
      yy = uRes.y * 0.45 + (yy - uRes.y * 0.45) / st;
      Y = uClothY + uFell + uLooseOff + yy + baseL * (uAmpL + ia) + (r2 - 0.5) * (0.3 * uAmpL + 0.6 * ia);
    }
    vec3 dye;
    bool oldL = false;
    if (uPull.w >= 0.0 && cx >= uPull.x && Y >= uPull.y && Y < uPull.y + uPull.z + 200.0) {
      float s0 = floor(uPull.x / uPitch), s1 = floor(uRes.x / uPitch);
      float ti = clamp((i - s0) / max(1.0, s1 - s0), 0.0, 1.0);
      float e = clamp((uPull.w - (1.0 - ti) * 0.55) / 0.45, 0.0, 1.0);
      e = e * e * (3.0 - 2.0 * e);
      float Yp = Y - (1.0 - e) * uPull.z;
      if (Yp < uPull.y) oldL = true; else Y = Yp;
    }
    dye = oldL ? uPullOld : 0.5 * (dyeAt(xc, Y + 2.0) + dyeAt(xc, Y - 2.0));
    // strings hang with a faint lateral wander; each catches the light differently
    float wob = sin(cy * 0.011 + r1 * 40.0) * 0.55 + sin(cy * 0.027 + r2 * 17.0) * 0.25;
    float uu = fract((cx + wob * (above ? 0.25 : 1.0) + (above ? 0.0 : (r1 - 0.5) * 0.3 * uPitch)) / uPitch);
    float w = above ? 0.23 : mix(0.15, uNearW, exp(-d / uNearD));
    float tu = (uu - 0.5) / w;
    float cov = 1.0 - smoothstep(w - aa * 0.75, w + aa * 0.75, abs(uu - 0.5));
    float tube = sqrt(max(0.0, 1.0 - tu * tu));
    // back shed: half a pitch over, dimmer, its own dye
    float ub = fract(uu + 0.5);
    float wb = w * 0.85;
    float covB = (1.0 - smoothstep(wb - aa * 0.75, wb + aa * 0.75, abs(ub - 0.5))) * detail;
    vec3 dyeB = oldL ? uPullOld : dyeAt(xc + uPitch * 0.5, Y + 23.0 + r3 * 20.0);
    float lit = above ? uTopLit * (0.8 + 0.2 * exp(-pow((cx - uRes.x * 0.78) / (uRes.x * 0.5), 2.0))) : exp(-d / uFade) * (1.0 - smoothstep(0.75, 1.0, d / uLooseLen) * 0.5);
    if (!above) lit *= (0.62 + 0.38 * exp(-pow((cx - uRes.x * 0.5) / (uRes.x * 0.42), 2.0))) * uTopLit;
    // intro: threads falling into place
    float tip = 1e5;
    if (uDrop.x >= 0.0) {
      float g = ceil(log2(abs(i - uDrop.y) + 1.0));
      float p = clamp((uDrop.x - g * uDrop.z - r3 * 0.06) / uDrop.w, 0.0, 1.0);
      float q = p - 1.0;
      float e = 1.0 + 2.8 * q * q * q + 1.8 * q * q;
      tip = mix(-60.0, uRes.y * 1.9, e);
      if (cy > tip) { cov = 0.0; covB = 0.0; }
      lit *= 1.0 + 0.6 * exp(-max(tip - cy, 0.0) / 50.0) * step(p, 0.999);
    }
    float catchL = 0.78 + 0.44 * r3;
    vec3 thr = dye * (0.45 + 0.55 * tube) * (0.035 + 0.965 * lit) * catchL;
    thr += pow(tube, 8.0) * 0.26 * lit * catchL * vec3(1.0, 0.96, 0.9);
    if (!above) thr *= 1.0 + 0.45 * exp(-d / 70.0);
    float dB = cy - uWBot;
    float glow = above ? (dB > 0.0 && uWTop < 0.0 ? exp(-dB / 36.0) * 0.8 : 0.0) : exp(-d / 30.0);
    if (above && dB > 0.0 && uWTop < 0.0) lit = max(lit, 0.35 + 0.65 * exp(-dB / 140.0));
    thr += uGlow * glow * 0.4 * (0.6 + 0.4 * tube);
    vec3 back = dyeB * 0.4 * (0.05 + 0.95 * lit);
    vec3 gap = uNight + uGlow * (above ? 0.018 : exp(-d / 60.0) * 0.12);
    col = mix(gap, back, covB * 0.9);
    // resist ties at dye boundaries, in an ordered diagonal rhythm (abrband)
    if (uTies > 0.0 && above) {
      vec3 dn = dyeAt(xc, Y + 6.0);
      float edge = step(0.18, distance(dye, dn));
      float bi = floor(i / 6.0);
      float onB = step(0.5, mod(bi + floor((Y) / 90.0), 2.0));
      thr = mix(thr, uIvory * (0.75 + 0.25 * tube) * (0.6 + 0.4 * lit), edge * onB * uTies);
    }
    col = mix(col, thr, cov);
    // calm field behind DOM text
    if (uSafeK < 1.0) {
      vec2 q = max(vec2(uSafe.x - cx, uSafe.y - cy), vec2(cx - uSafe.x - uSafe.z, cy - uSafe.y - uSafe.w));
      float msk = 1.0 - smoothstep(-40.0, 120.0, max(q.x, q.y));
      col *= mix(1.0, uSafeK, msk);
    }
  }

  // andon: lantern wash
  if (uAndon.z > 0.0) {
    float ad = length(vec2(cx, cy) - uAndon.xy);
    col += uAndonCol * uAndon.z * exp(-ad * ad / (uAndon.w * uAndon.w)) * (woven ? 0.5 + 0.5 * pow(sin(PI * u), 2.0) : 0.6);
  }
  float lf = length((vec2(cx, cy) - uLightPos) / uRes.x);
  col *= 1.0 - 0.10 * smoothstep(0.25, 1.25, lf);
  col *= uDim;
  gl_FragColor = vec4(col, 1.0);
}
`;

const v3 = (h) => new THREE.Vector3(...hex3(h));

export function makeCloth({ W, H, chunks, scale }) {
  const tex = (cv, role) => {
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.NoColorSpace;
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.generateMipmaps = false;
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    return t;
  };
  const A = chunks[0], B = chunks[1] || chunks[0];
  const u = {
    tA: { value: tex(A.canvas) }, tB: { value: chunks[1] ? tex(B.canvas) : null },
    tRA: { value: tex(A.role) }, tRB: { value: chunks[1] ? tex(B.role) : null },
    uSplitY: { value: chunks[1] ? B.y0 : 1e9 },
    uSzA: { value: new THREE.Vector2(W, A.h) }, uSzB: { value: new THREE.Vector2(W, B.h) },
    uRes: { value: new THREE.Vector2(W, H) },
    uPitch: { value: 7.2 }, uClothY: { value: 0 }, uFell: { value: 0 }, uWTop: { value: -1 }, uWBot: { value: 0 },
    uAmpW: { value: 0.8 }, uAmpVel: { value: 0 }, uVelSign: { value: 1 }, uFresh: { value: 0 },
    uAmpL: { value: 60 }, uAmpTop: { value: 2 }, uLooseScale: { value: 2.4 }, uLooseOff: { value: 30 },
    uFade: { value: 70 }, uNearW: { value: 0.27 }, uNearD: { value: 110 }, uLooseLen: { value: 300 }, uTopLit: { value: 1 },
    uRecede: { value: 0.7 }, uTime: { value: 0 }, uWind: { value: 0 }, uShock: { value: -1 }, uShockA: { value: 0 },
    uSweep: { value: W * 0.9 },
    uLight: { value: new THREE.Vector3(-0.35, 0.22, 1.0) }, uLightPos: { value: new THREE.Vector2(W * 0.3, H * 0.25) },
    uNight: { value: v3(C.loom) }, uGlow: { value: v3('#F2A23A') }, uIvory: { value: v3(C.ivory) },
    uPull: { value: new THREE.Vector4(0, 0, 0, -1) }, uPullOld: { value: v3(C.ai) },
    uPick: { value: new THREE.Vector4(0, 0, 0, 0) },
    uJiyak: { value: new THREE.Vector2(0, 0) },
    uShearR: { value: new THREE.Vector4(0, 0, 0, 0) }, uShear: { value: 0 },
    uShotR: { value: new THREE.Vector4(0, 0, 0, 0) }, uShotFront: { value: 0 }, uShotA: { value: v3(C.shu) }, uShotB: { value: v3(C.emerald) },
    uSig: { value: new THREE.Vector4(0, 0, 0, 0) },
    uAndon: { value: new THREE.Vector4(0, 0, 0, 300) }, uAndonCol: { value: v3(C.shu) },
    uSafe: { value: new THREE.Vector4(0, 0, 0, 0) }, uSafeK: { value: 1 },
    uTies: { value: 0 },
    uDrop: { value: new THREE.Vector4(-1, 0, 0.12, 0.45) },
    uIntro: { value: new THREE.Vector2(1, 0) },
    tDist: { value: null }, uDistOn: { value: 0 },
    uDim: { value: 1 },
  };
  if (!chunks[1]) { u.tB.value = u.tA.value; u.tRB.value = u.tRA.value; }
  const mat = new THREE.ShaderMaterial({ uniforms: u, vertexShader: vert, fragmentShader: frag, toneMapped: false });
  const Wc = W * 2.4, Hc = H * 2.4;
  const geo = new THREE.PlaneGeometry(Wc, Hc, 48, Math.round(Hc / 6));
  geo.translate(0, H / 2 + 60 - Hc / 2, 0);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  return { mesh, uniforms: u };
}
