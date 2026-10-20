// Abr 絣 — indigo warp-ikat cloth as a GLSL function. Japan's kasuri palette at Uzbek abr scale.
// cloth(p) takes local css px (y down) so the cloth travels with the piece it belongs to.
export const ABR_GLSL = `
uniform float uTime; uniform float uContrast; uniform float uScale; uniform float uSeed;
uniform vec4 uBoxes[6]; uniform int uNBoxes; uniform vec3 uSheen; uniform vec4 uShade; uniform vec2 uOffset;
float h11(float n){ return fract(sin(n*12.9898+uSeed)*43758.5453); }
float h21(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7))+uSeed)*43758.5453); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),f.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x), f.y); }
float ndot(vec2 a, vec2 b){ return a.x*b.x - a.y*b.y; }
float sdRhombus(vec2 p, vec2 b){ p=abs(p); float h=clamp((-2.*ndot(p,b)+ndot(b,b))/dot(b,b),-1.,1.);
  float d=length(p-.5*b*vec2(1.-h,1.+h)); return d*sign(p.x*b.y+p.y*b.x-b.x*b.y); }
float sdBox(vec2 p, vec2 b){ vec2 d=abs(p)-b; return length(max(d,0.))+min(max(d.x,d.y),0.); }
float motif(vec2 p){
  vec2 cell = vec2(360., 520.);
  vec2 q = mod(p, cell) - cell*.5;
  float lv = 0.;
  float bx = mod(p.x + 180., 360.) - 180.;
  float tri = abs(fract(p.y/104.) - .5)*4. - 1.;
  float dz = abs(bx - tri*24.);
  if (dz < 15.) lv = 1.;
  if (dz < 4.5) lv = 3.;
  float ax = abs(q.x), ay = q.y;
  if (abs(ay) < 46. && ax > 104. && ax < 152.) { if (ax > 140.) lv = 2.; else if (mod(ay + 46., 23.) < 10.) lv = 2.; }
  float d1 = sdRhombus(q, vec2(98., 236.));
  if (d1 < 0.) lv = 1.;
  if (abs(d1 + 9.) < 5.5) lv = 3.;
  float d2 = sdRhombus(q, vec2(56., 136.));
  if (d2 < 0.) lv = 2.;
  if (abs(d2 + 6.) < 3.5) lv = 1.;
  float d3 = sdRhombus(q, vec2(19., 48.));
  if (d3 < 0.) lv = 3.;
  vec2 q2 = mod(p + vec2(0., 260.), cell) - cell*.5;
  float d4 = sdRhombus(q2, vec2(30., 40.));
  if (d4 < 0. && abs(q2.x) < 30.) lv = (d4 < -9.) ? 2. : 3.;
  if (lv == 0.) {
    vec2 g = vec2(46., 34.);
    vec2 id = floor(p / g);
    vec2 r = mod(p + vec2(mod(id.y, 2.) * g.x * .5, 0.), g) - g * .5;
    float h = fract(sin(dot(id, vec2(41.3, 289.1))) * 9137.7);
    if (h > .35 && abs(r.x) < 5.5 && abs(r.y) < 1.6) lv = 4.;
    if (h > .82 && abs(r.y) < 5.5 && abs(r.x) < 1.6) lv = 4.;
  }
  return lv;
}
vec3 dyeOf(float lv, vec3 ai, vec3 aiL, vec3 aiD, vec3 kinu){
  if (lv == 1.) return mix(aiL, ai, .18); if (lv == 2.) return aiD; if (lv == 3.) return mix(ai, kinu, .58); if (lv == 4.) return mix(ai, kinu, .42); return ai; }
vec3 cloth(vec2 fc){
  vec2 p = fc + uOffset;
  float sc = uScale;
  float col = floor(p.x / 2.);
  float bundle = floor(p.x / 9.);
  float shift = (h11(bundle) - .5) * 15. + (h11(col*1.37) - .5) * 6. + (vn(vec2(col*.08, p.y/90.)) - .5) * 9.
              + sin(uTime*.6 + col*.03) * 1.2;
  vec2 mp = vec2(p.x, p.y + shift) / sc;
  float lv = motif(mp);
  float lvA = motif(mp + vec2(0., 2.6)/sc), lvB = motif(mp - vec2(0., 2.6)/sc);
  float calm = 0.;
  for (int i = 0; i < 6; i++) { if (i >= uNBoxes) break; vec4 b = uBoxes[i];
    float d = sdBox(fc - (b.xy + b.zw*.5), b.zw*.5);
    calm = max(calm, 1. - smoothstep(-10., 60., d)); }
  float c = uContrast * (1. - .7 * calm);
  vec3 ai = vec3(30., 45., 102.)/255.;
  vec3 aiL = vec3(58., 91., 170.)/255.;
  vec3 aiD = vec3(17., 27., 68.)/255.;
  vec3 kinu = vec3(239., 232., 216.)/255.;
  vec3 dye = (dyeOf(lv, ai, aiL, aiD, kinu) * 2. + dyeOf(lvA, ai, aiL, aiD, kinu) + dyeOf(lvB, ai, aiL, aiD, kinu)) / 4.;
  vec3 col3 = mix(ai, dye, c);
  float tj = (h11(col*3.1) - .5) * .05;
  float warp = mod(p.x, 2.) < 1. ? -.035 : .0;
  float wy = fract(p.y / 2.5);
  float weft = (abs(wy - .5) * 2.) * -.022;
  float slub = smoothstep(.93, 1., vn(vec2(col*.9, p.y/40.))) * .06;
  col3 *= 1. + tj + warp + weft + slub;
  float broad = (vn(p/420.) - .5) * .07 + (vn(p/160. + 7.) - .5) * .03;
  col3 *= 1. + broad;
  float L = length((fc - uShade.xy) / uShade.z);
  col3 *= 1. - uShade.w * smoothstep(.2, 1.3, L);
  vec2 sd = (fc - uSheen.xy) / vec2(260., 60.);
  float sh = exp(-dot(sd, sd)) * uSheen.z;
  float floatMask = .6 + .4 * vn(vec2(col*.5, p.y/6.));
  col3 += sh * floatMask * vec3(.32, .36, .46) * (1. - .55*smoothstep(1.5,3.,lv));
  return col3;
}`;
