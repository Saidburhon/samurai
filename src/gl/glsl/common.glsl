// Shared by every sword material: hashes, the analytic studio (one light world for all parts), the kantei lamp,
// bump helpers, the anti-aliasing helpers (§2.1) and the output dither.
float hash11(float n){ return fract(sin(n*12.9898)*43758.5453); }
float noise1(float x){ float i=floor(x), f=fract(x); float u=f*f*(3.-2.*f); return mix(hash11(i), hash11(i+1.), u); }
float fbm1(float x){ float a=.5, s=0.; for(int i=0;i<4;i++){ s+=a*noise1(x); x=x*2.03+17.1; a*=.5; } return s/.9375; }
float hash12(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
vec3 hash32(vec2 p){ vec3 p3=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973)); p3+=dot(p3,p3.yxz+33.33); return fract((p3.xxy+p3.yzz)*p3.zyx); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash12(i),hash12(i+vec2(1,0)),u.x), mix(hash12(i+vec2(0,1)),hash12(i+vec2(1,1)),u.x), u.y); }
float fbm2(vec2 p){ float a=.5,s=0.; for(int i=0;i<5;i++){ s+=a*vnoise(p); p=p*2.02+vec2(13.1,7.7); a*=.5; } return s/.96875; }

uniform mat3 uStudio;      // world -> studio frame (x along the blade, y up, z towards the edge side)
uniform vec3 uCeil, uCeilHi, uFloor, uKey, uStrip, uRim;
uniform vec2 uKeyA, uStripA, uRimA, uCeilA;
uniform float uFrostLight; uniform vec3 uFrostAmb;
uniform vec2 uKeyB, uCeilB; uniform float uKeySoft, uRidge;
uniform vec3 uGlintDir, uGlintCol; uniform float uGlintSize;
uniform vec3 uLampPos, uLampCol;
uniform float uExposure;
uniform float uAA;         // drawing-buffer px per device px (the supersample factor): lines are kept >= 1 device px

// the backlight's glint seen in this material's reflections (1 everywhere; the steel sets its own share, uGlintGain)
float gGlint = 1., gGlintW = 1.;
float box1(float x, float a, float b, float s){ return smoothstep(a-s, a+s, x) * (1.-smoothstep(b-s, b+s, x)); }
vec3 studio(vec3 Rw, float r){
  vec3 R = uStudio * Rw;
  float s = 0.025 + r*1.1;
  float up = R.y;
  float a = atan(R.z, max(R.y, 0.02));
  float b = atan(R.x, max(R.y, 0.02));
  float hiW = (1. - smoothstep(uCeilA.x - s, uCeilA.y + s, a)) * smoothstep(uCeilB.x, uCeilB.y, b);
  vec3 ceil = mix(uCeil, uCeilHi, hiW);
  vec3 c = mix(uFloor, ceil, smoothstep(-0.12 - s, 0.10 + s, up));
  float hemi = smoothstep(-0.02, 0.12, up);
  c += uKey   * box1(a, uKeyA.x,   uKeyA.y,   s + uKeySoft) * box1(b, uKeyB.x, uKeyB.y, s*1.6+.14) * hemi;
  c += uStrip * box1(a, uStripA.x, uStripA.y, s*.8)   * box1(b, -1.25, 1.25, s*1.6+.08) * hemi;
  c += uRim   * box1(a, uRimA.x,   uRimA.y,   s)      * box1(b, -0.25, 1.30, s*1.6+.20) * hemi;
  float gs = (uGlintSize + r*0.08) * gGlintW;
  c += uGlintCol * gGlint * exp(-(1. - dot(Rw, uGlintDir)) / (gs*gs*0.5));
  return c;
}
vec3 studioIrr(vec3 Nw){
  vec3 N = uStudio * Nw;
  float k = smoothstep(-0.7, 0.8, N.y);
  vec3 top = mix(uCeil, uCeilHi, .5) + uKey*0.16 + uStrip*0.03 + uRim*0.05;
  return mix(uFloor*0.85, top, k);
}
vec3 bumpN(vec3 p, vec3 n, float h, float scale){
  vec3 sx = dFdx(p), sy = dFdy(p);
  vec3 r1 = cross(sy, n), r2 = cross(n, sx);
  float det = dot(sx, r1);
  vec3 g = sign(det) * (dFdx(h)*scale*r1 + dFdy(h)*scale*r2);
  return normalize(abs(det)*n - g);
}
vec3 lampSpec(vec3 N, vec3 V, vec3 P, vec3 F, float rough){
  vec3 L = normalize(uLampPos - P); vec3 H = normalize(L+V);
  float NoL = max(dot(N,L),0.), NoH = max(dot(N,H),0.);
  float r2 = max(rough*rough, 0.002);
  float a2 = r2*r2; float dd = NoH*NoH*(a2-1.)+1.;
  float D = a2/(3.14159*dd*dd);
  return uLampCol * F * D * NoL * 0.25;
}
// a thin analytic line exp(-((x-c)/w)^2): never thinner than ~1 device px, dimmed instead of broken (AA contract 1).
// The floor is 0.65 device px of w, a full width at half maximum of 1.1 device px (1.6 buffer px at the software
// supersample, still above the sampling's dashing limit): G1 found 0.8 (1.33 px) softer than the prototype's ridge.
float thinLine(float x, float c, float w){
  float fw = max(w, 0.65 * fwidth(x) * uAA);
  return exp(-pow((x - c) / fw, 2.)) * (w / fw);
}
// Schlick's (1 − n·v)^5 averaged over the pixel's span of n·v (a box filter, exact): at a grazing silhouette the
// Fresnel rim is narrower than a pixel, and sampled at pixel centres it breaks into beads; averaged it dims instead
// (AA contract 1, for the Fresnel term; G1: the saya's lower edge at B21)
float schlickAA(float nv){
  float h = .5 * fwidth(nv) * uAA;
  float a = clamp(nv - h, 0., 1.), b = clamp(nv + h, 0., 1.);
  if (b - a < 1e-4) return pow(1. - nv, 5.);
  return (pow(1. - a, 6.) - pow(1. - b, 6.)) / (6. * (b - a));
}
// the roughness of a studio lookup widened to the reflection's own spread over a device pixel: where the reflected
// direction turns quickly (a curved silhouette), a thin strip or highlight dims and widens instead of shimmering
float aaRough(vec3 R, float rough){ float d = length(fwidth(R)) * uAA; return max(rough, (.6 * d - .025) / 1.1); }
// a periodic term whose cycle shrinks under the pixel fades to its mean (no moiré): 1 when crisp, 0 when sub-pixel
float lod(float phaseRate){ return 1. - smoothstep(0.35, 0.7, phaseRate); }
// output: ±0.5/255 display-space dither (dark gradients never band), static per pixel so stills are stable
float dither(){ return (hash12(gl_FragCoord.xy) - 0.5) / 255.; }
