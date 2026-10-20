// GLSL for the sword. One analytic studio shared by every material, so all parts sit in the same light.
export const common = /* glsl */ `
float hash11(float n){ return fract(sin(n*12.9898)*43758.5453); }
float noise1(float x){ float i=floor(x), f=fract(x); float u=f*f*(3.-2.*f); return mix(hash11(i), hash11(i+1.), u); }
float fbm1(float x){ float a=.5, s=0.; for(int i=0;i<4;i++){ s+=a*noise1(x); x=x*2.03+17.1; a*=.5; } return s/.9375; }
float hash12(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
vec3 hash32(vec2 p){ vec3 p3=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973)); p3+=dot(p3,p3.yxz+33.33); return fract((p3.xxy+p3.yzz)*p3.zyx); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash12(i),hash12(i+vec2(1,0)),u.x), mix(hash12(i+vec2(0,1)),hash12(i+vec2(1,1)),u.x), u.y); }
float fbm2(vec2 p){ float a=.5,s=0.; for(int i=0;i<5;i++){ s+=a*vnoise(p); p=p*2.02+vec2(13.1,7.7); a*=.5; } return s/.96875; }
float vnoise3(vec3 p){ vec3 i=floor(p), f=fract(p); vec3 u=f*f*(3.-2.*f);
  float n000=hash12(i.xy+i.z*37.1), n100=hash12(i.xy+vec2(1,0)+i.z*37.1), n010=hash12(i.xy+vec2(0,1)+i.z*37.1), n110=hash12(i.xy+vec2(1,1)+i.z*37.1);
  float n001=hash12(i.xy+(i.z+1.)*37.1), n101=hash12(i.xy+vec2(1,0)+(i.z+1.)*37.1), n011=hash12(i.xy+vec2(0,1)+(i.z+1.)*37.1), n111=hash12(i.xy+vec2(1,1)+(i.z+1.)*37.1);
  return mix(mix(mix(n000,n100,u.x),mix(n010,n110,u.x),u.y), mix(mix(n001,n101,u.x),mix(n011,n111,u.x),u.y), u.z); }

uniform mat3 uStudio;      // world -> studio frame (x along the blade, y up, z towards the edge side)
uniform vec3 uCeil, uCeilHi, uFloor, uKey, uStrip, uRim;
uniform vec2 uKeyA, uStripA, uRimA, uCeilA;
uniform float uFrostLight; uniform vec3 uFrostAmb;
uniform vec2 uKeyB, uCeilB; uniform float uKeySoft, uRidge;
uniform vec3 uGlintDir, uGlintCol; uniform float uGlintSize;
uniform vec3 uLampPos, uLampCol;
uniform float uExposure;

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
  float gs = uGlintSize + r*0.08;
  c += uGlintCol * exp(-(1. - dot(Rw, uGlintDir)) / (gs*gs*0.5));
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
`;

export const swordVert = /* glsl */ `
attribute float aRegion;
attribute float aAxial;
varying vec2 vUv; varying float vRegion; varying float vAxial;
varying vec3 vWPos; varying vec3 vWNrm; varying vec3 vLPos;
void main(){
  vUv = uv; vRegion = aRegion; vAxial = aAxial; vLPos = position;
  vec4 wp = modelMatrix * vec4(position, 1.);
  vWPos = wp.xyz;
  vWNrm = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

// ---------------- steel ----------------
export const steelFrag = /* glsl */ `
${common}
varying vec2 vUv; varying float vRegion; varying float vAxial;
varying vec3 vWPos; varying vec3 vWNrm; varying vec3 vLPos;
uniform float uReveal, uFront, uNie, uPolish, uTime;
// reflected sign (utsuri)
uniform sampler2D uWords;
uniform float uWordAlpha;
uniform vec3 uSignO, uSignU, uSignV, uSignN;  // origin, axis u (len = width), axis v (len = height), normal
uniform float uFlatten;
uniform vec3 uBladeN;

float hamonV(float u){
  float n = 0.70 + 0.040*sin(6.283185*5.3*u + 0.8)
                 + 0.022*sin(6.283185*13.1*u + 2.3)
                 + 0.018*(fbm1(u*38.0) - 0.5)
                 + 0.030*pow(max(0., sin(6.283185*9.0*u + 1.1)), 6.0);
  n = mix(0.80, n, smoothstep(0.0, 0.06, u));
  return mix(n, 0.25, smoothstep(0.975, 1.0, u));
}

void main(){
  if (vAxial > uReveal) discard;
  vec3 N = normalize(vWNrm);
  vec3 V = normalize(cameraPosition - vWPos);
  if (dot(N, V) < -0.2) N = -N;
  float u = vUv.x, v = vUv.y;
  float uu = clamp(u, 0., 1.);
  float hv = hamonV(uu);
  float d = v - hv;
  float r = vRegion;
  float onJi = step(1.5, r);
  // folded steel grain (itame hada): long streaks along the blade
  float g1 = fbm2(vec2(u*160., v*7.));
  float g2 = fbm2(vec2(u*520., v*22.) + 3.1);
  float hada = (g1-.5)*.75 + (g2-.5)*.35;
  vec3 F0; float rough;
  if (r < .5)      { F0 = vec3(.40,.41,.43); rough = .16; }                 // mune
  else if (r < 1.5){ F0 = vec3(.33,.345,.36); rough = .045; }               // shinogi-ji (burnished)
  else if (r < 2.5){ F0 = vec3(.55,.565,.58); rough = .06 + hada*.07; }     // ji
  else             { F0 = vec3(.62,.63,.64); rough = .05; }                 // ha (edge bevel)
  F0 *= 1. + hada*.10;
  // hamon: frosty martensite. nioi = misty white line along the boundary
  float hard = smoothstep(-0.012, 0.03, d) * onJi * step(-0.03, u);
  float mist = fbm2(vec2(u*60., v*14.));
  float nioi = exp(-pow((d-0.002)/0.022, 2.)) * onJi;
  float suna = fbm2(vec2(u*240., v*5.));
  float frost = hard * (0.62 + 0.38*smoothstep(.25,.8,mist)) * (0.85 + 0.15*suna);
  float metal = mix(1., .38, frost);
  rough = mix(rough, .34, frost);
  vec3 dAlb = vec3(.74,.77,.80) * frost + vec3(.97,.99,1.) * nioi * .65 * (0.55+0.45*mist);
  // ashi: faint streaks running from the hamon towards the edge
  float ashi = smoothstep(.55,.9, fbm2(vec2(u*55., 1.))) * smoothstep(0.0, .06, d) * (1.-smoothstep(.06,.16,d)) * onJi;
  dAlb *= 1. - ashi*.35;

  vec3 R = reflect(-V, N);
  float NoV = clamp(dot(N,V), 0., 1.);
  vec3 F = F0 + (1.-F0)*pow(1.-NoV, 5.);
  vec3 spec = studio(R, rough) * F;
  spec += lampSpec(N, V, vWPos, F, rough);

  // the reflected sign: words in the steel
  if (uWordAlpha > 0.001 && r > .5) {
    vec3 Nf = normalize(mix(N, uBladeN, uFlatten));
    vec3 Rf = reflect(-V, Nf);
    float den = dot(uSignN, Rf);
    if (den < -1e-3) {
      float t = dot(uSignN, uSignO - vWPos) / den;
      vec3 Q = vWPos + Rf * t - uSignO;
      vec2 st = vec2(dot(Q, uSignU)/dot(uSignU,uSignU), dot(Q, uSignV)/dot(uSignV,uSignV));
      if (st.x > 0. && st.x < 1. && st.y > 0. && st.y < 1.) {
        float bias = mix(0., 3.5, frost) + (r < 1.5 ? .4 : 0.);
        vec3 w = (texture2D(uWords, st, bias).rgb + texture2D(uWords, st, bias + 4.0).rgb * .07) * vec3(.90,.94,1.);
        float mirror = (r < 1.5 ? .55 : 1.) * (1. - frost*.75);
        spec += w * uWordAlpha * mirror * 2.2;
      }
    }
  }
  vec3 diff = dAlb * (studioIrr(N) * uFrostLight + uFrostAmb + uLampCol*max(dot(N, normalize(uLampPos - vWPos)),0.)*.18);
  // folded grain, faintly visible in the polished ji
  diff += vec3(.5,.515,.565) * (hada*.5+.5) * .018 * step(1.5, r) * (1.-frost) * uFrostLight;
  vec3 col = spec*mix(1., .30, frost) + diff;
  // the shinogi and yokote ridges catch light as crisp lines
  float ridge = exp(-pow((v-0.28)/0.0045, 2.)) * step(u, 0.93) * step(0.5, r) * step(r, 2.5);
  col += ridge * uRidge;
  // nie: crystals that twinkle when the angle is right
  vec2 cq = vec2(u*uNie, v*80.);
  vec2 cell = floor(cq);
  vec2 cj = hash32(cell + 7.7).xy*.6 + .2;
  float cr = length((fract(cq) - cj) * vec2(1., 1.0));
  float nieM = step(0.972, hash12(cell)) * exp(-pow((d+.002)/.035, 2.)) * onJi * (1. - smoothstep(.12, .30, cr));
  vec3 nN = normalize(N + .55*(hash32(cell)-.5));
  vec3 Hh = normalize(normalize(uLampPos - vWPos) + V);
  float tw = pow(max(dot(nN, Hh), 0.), 400.) * 8. + dot(studio(reflect(-V,nN), .01), vec3(.33)) * .6;
  col += nieM * tw * vec3(1.,.98,.94);
  // drawing -> steel wipe front
  float fr = vAxial - uReveal;
  col += uFront * vec3(.86,.93,1.) * (exp(-pow(fr/0.0011,2.))*5.0 + exp(-pow(fr/0.012,2.))*.25);
  col *= uExposure;
  gl_FragColor = vec4(col, 1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

// ---------------- fittings: copper, gold, iron, shakudo ----------------
export const metalFrag = /* glsl */ `
${common}
varying vec2 vUv; varying float vRegion; varying float vAxial;
varying vec3 vWPos; varying vec3 vWNrm; varying vec3 vLPos;
uniform vec3 uBase; uniform float uRough; uniform float uMetal; uniform float uKind;
uniform float uReveal, uFront;
uniform vec3 uAxisW, uBackGlow;
void main(){
  if (vAxial > uReveal) discard;
  vec3 N = normalize(vWNrm);
  vec3 V = normalize(cameraPosition - vWPos);
  vec3 base = uBase; float rough = uRough; float metal = uMetal;
  vec3 lp = vLPos;
  float h = 0.;
  if (uKind < .5) {            // copper habaki: diagonal file marks (nekogaki)
    float f = sin((lp.x*1.0 + lp.y*0.5 - lp.z*0.45)*2300. + fbm2(lp.xz*60.)*3.);
    h = f*0.22 + fbm2(lp.xz*220.)*.25;
    rough = uRough + f*.02;
    base *= 0.92 + 0.08*fbm2(lp.xz*40.);
  } else if (uKind < 1.5) {    // gold seppa
    h = fbm2(lp.zy*300.)*.2;
  } else if (uKind < 2.5) {    // patinated iron tsuba, stone-hammered (ishime)
    float n = fbm2(lp.zy*90.) ;
    float n2 = vnoise(lp.zy*420.);
    h = n*.8 + n2*.5;
    float rr = length(lp.zy * vec2(1., 1./1.03));
    // worn, brighter rim + gold inlay ring
    float rimWear = smoothstep(.355, .39, rr);
    base = mix(base * (0.75 + 0.5*n), base*1.9, rimWear*.6);
    rough = mix(uRough + (n2-.5)*.12, .32, rimWear*.6);
    float inlay = smoothstep(.3685,.3705,rr) * (1.-smoothstep(.3755,.3775,rr));
    base = mix(base, vec3(.85,.62,.28), inlay);
    rough = mix(rough, .22, inlay); metal = mix(metal, 1., inlay);
  } else {                      // shakudo fuchi / kashira with nanako dots
    vec2 q = vec2(lp.x*120., atan(lp.y, lp.z)*16.);
    vec2 c = fract(q) - .5;
    float dot1 = 1. - smoothstep(.18,.32, length(c));
    h = dot1;
    base *= 0.9 + 0.2*dot1;
  }
  N = bumpN(vWPos, N, h, uKind > 2.5 ? .0012 : (uKind > 1.5 ? .0022 : .0005));
  vec3 R = reflect(-V, N);
  float NoV = clamp(dot(N,V),0.,1.);
  vec3 F0 = mix(vec3(.04), base, metal);
  vec3 F = F0 + (1.-F0)*pow(1.-NoV,5.);
  vec3 spec = studio(R, rough) * F + lampSpec(N, V, vWPos, F, rough);
  vec3 diff = base * (1.-metal) * (studioIrr(N) + uLampCol*max(dot(N, normalize(uLampPos - vWPos)),0.)*.25);
  vec3 col = spec + diff;
  if (uKind > 1.5 && uKind < 2.5) {
    // light coming through the piercings warms their inner walls, strongest at the back face
    float wall = 1. - abs(dot(normalize(vWNrm), uAxisW));
    float depth = clamp((-0.315 - lp.x) / 0.05, 0., 1.);
    float rr = length(lp.zy * vec2(1., 1./1.03));
    col += uBackGlow * pow(wall, 2.5) * (0.25 + 0.75*depth*depth) * step(rr, 0.362);
  }
  float fr = vAxial - uReveal;
  col += uFront * vec3(.86,.93,1.) * (exp(-pow(fr/0.0022,2.))*3.0);
  col *= uExposure;
  gl_FragColor = vec4(col, 1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

// ---------------- silk: Margilan atlas hishimaki over ray skin ----------------
export const silkFrag = /* glsl */ `
${common}
varying vec2 vUv; varying float vRegion; varying float vAxial;
varying vec3 vWPos; varying vec3 vWNrm; varying vec3 vLPos;
uniform float uReveal, uFront;
uniform float uDiamonds;

vec3 ikat(float along, float across, float ribbon){
  // atlas abr: colour fields with feathered, cloud-like boundaries
  vec3 ai = vec3(.022,.030,.085), ish = vec3(.035,.25,.29), anor = vec3(.30,.035,.05), cream = vec3(.66,.58,.44);
  float j = (fbm1(across*1.15 + along*0.7 + ribbon*5.1) - .5) * .22 + (fbm1(across*7. + along*4. + ribbon) - .5) * .035;
  float p = fract(along*0.42 + ribbon*0.29 + j);
  vec3 c = ai;
  c = mix(c, ish,   smoothstep(.35,.40,p) * (1.-smoothstep(.46,.51,p)));
  c = mix(c, cream, smoothstep(.46,.51,p) * (1.-smoothstep(.515,.565,p)));
  c = mix(c, anor,  smoothstep(.515,.565,p) * (1.-smoothstep(.595,.645,p)));
  c = mix(c, cream, smoothstep(.595,.645,p) * (1.-smoothstep(.64,.69,p)));
  c = mix(c, ish,   smoothstep(.64,.69,p) * (1.-smoothstep(.72,.78,p)));
  return c;
}

void main(){
  if (vAxial > uReveal) discard;
  vec3 N0 = normalize(vWNrm);
  vec3 V = normalize(cameraPosition - vWPos);
  float t = vUv.x, ph = vUv.y;
  // lattice coordinates: X along the grip, Y around (two diamond rows per turn)
  float X = t * uDiamonds, Y = ph * 2. + .25;
  float A = X + Y, Bc = X - Y;
  float ca = fract(A + .5) - .5, cb = fract(Bc + .5) - .5;
  float hw = .31;
  float inA = 1. - smoothstep(hw - .015, hw + .015, abs(ca));
  float inB = 1. - smoothstep(hw - .015, hw + .015, abs(cb));
  float crs = mod(floor(A + .5) + floor(Bc + .5), 2.);
  float topA = crs < .5 ? 1. : 0.;
  // which layer is visible
  float showA = inA * (topA > .5 ? 1. : 1. - inB);
  float showB = inB * (topA > .5 ? 1. - inA : 1.);
  float ribbon = max(showA, showB);
  float acr = showA > showB ? ca/hw : cb/hw;
  float alongC = showA > showB ? Bc : A;
  float rid = showA > showB ? floor(A + .5) : floor(Bc + .5) + 7.;
  // silk: rounded ribbon, fine weave, slight fold where it passes under
  float edgeShade = 1. - .45*pow(abs(acr), 3.);
  float under = (showA > .5 && inB > .5 && topA < .5) || (showB > .5 && inA > .5 && topA > .5) ? 1. : 0.;
  float weave = sin(alongC*180.)*.5+.5;
  vec3 silk = ikat(alongC, acr, rid);
  // ray skin (samegawa) in the windows: lacquered white nodules
  vec2 sp = vec2(t*uDiamonds*14., ph*30.);
  vec2 ci = floor(sp), cf = fract(sp);
  float md = 1.;
  for (int j=-1;j<=1;j++) for (int i=-1;i<=1;i++){ vec2 o = vec2(i,j); vec2 rp = o + hash32(ci+o).xy*.8+.1 - cf; md = min(md, dot(rp,rp)); }
  float nod = 1. - smoothstep(.05,.30, md);
  // window inner shadow
  float dwin = min(abs(ca), abs(cb)) - hw;
  float ao = smoothstep(0., .14, dwin);
  vec3 same = vec3(.86,.82,.72) * (0.78 + .22*nod) * (0.45 + .55*ao);
  // menuki: gilt cotton boll, under the wrap at the middle of the top face
  float mt = (t - .52) * uDiamonds, mp = (ph - .25) * 2.;
  float menR = length(vec2(mt*1.0, mp*3.2));
  float menuki = (1. - smoothstep(.40,.46, menR)) * (1.-ribbon);
  float h = ribbon * (1. - acr*acr) * .9 + weave*.06*ribbon + (1.-ribbon)*nod*.35;
  // petals of the boll
  float ang = atan(mp*3.2, mt);
  float petals = .5 + .5*cos(ang*5.);
  h += menuki * (.6 + .4*petals) * (1. - menR*1.6);
  vec3 N = bumpN(vWPos, N0, h, .006);
  vec3 alb = mix(same, silk * edgeShade * (under > .5 ? .55 : 1.), ribbon);
  float rough = mix(.55, .42, ribbon);
  vec3 F0 = vec3(.04);
  float metal = 0.;
  vec3 gold = vec3(.80,.60,.30);
  alb = mix(alb, gold, menuki); rough = mix(rough, .25, menuki); metal = menuki;
  F0 = mix(F0, gold, metal);
  float NoV = clamp(dot(N,V),0.,1.);
  vec3 F = F0 + (1.-F0)*pow(1.-NoV,5.);
  vec3 L = normalize(uLampPos - vWPos);
  float NoL = dot(N,L);
  float wrap = max((NoL + .35)/1.35, 0.);
  float keyL = clamp(dot(uStudio * N, normalize(vec3(0., .75, -.66))) * .5 + .5, 0., 1.);
  vec3 irr = (studioIrr(N) * 1.05 + uLampCol * wrap * .22) * (0.45 + 0.85 * keyL * keyL);
  vec3 col = alb * irr * (1.-metal);
  // silk sheen: soft grazing glow tinted by the thread
  float sheen = pow(1. - NoV, 3.) * ribbon;
  col += sheen * (silk*1.6 + vec3(.25,.28,.4)) * .55 * (studioIrr(N).g + .3);
  col += studio(reflect(-V,N), rough) * F * (ribbon > .5 ? .35 : .6);
  col += lampSpec(N, V, vWPos, F, rough + .1) * .8;
  float fr = vAxial - uReveal;
  col += uFront * vec3(.86,.93,1.) * (exp(-pow(fr/0.0022,2.))*3.0);
  col *= uExposure;
  gl_FragColor = vec4(col, 1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

// ---------------- soft analytic shadow on the paper ----------------
export const shadowVert = /* glsl */ `
varying vec3 vWPos;
void main(){ vec4 wp = modelMatrix*vec4(position,1.); vWPos = wp.xyz; gl_Position = projectionMatrix*viewMatrix*wp; }`;
export const shadowFrag = /* glsl */ `
#define NSEG 72
varying vec3 vWPos;
uniform vec4 uSeg[NSEG];
uniform int uN;
uniform vec3 uShadowCol;
uniform float uOpacity;
void main(){
  vec2 p = vWPos.xz;
  float sh = 0., amb = 0.;
  for (int i=0;i<NSEG-1;i++){
    if (i >= uN-1) break;
    vec4 a = uSeg[i], b = uSeg[i+1];
    if (a.z < 0. || b.z < 0.) continue;
    vec2 pa = p - a.xy, ba = b.xy - a.xy;
    float h = clamp(dot(pa,ba)/max(dot(ba,ba),1e-6), 0., 1.);
    float dist = length(pa - ba*h);
    float hw = mix(a.z, b.z, h), sg = mix(a.w, b.w, h);
    float cov = 1. - smoothstep(-sg, sg, dist - hw);
    sh = max(sh, cov / (1. + sg*9.));
    float sg2 = sg*3.5 + .12;
    amb = max(amb, (1. - smoothstep(-sg2, sg2, dist - hw)) * .22);
  }
  float a = clamp(sh*.85 + amb, 0., 1.) * uOpacity;
  gl_FragColor = vec4(uShadowCol, a);
}`;

export const rayVert = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`;
export const rayFrag = /* glsl */ `
uniform sampler2D tOcc; uniform vec2 uLight; uniform float uDecay, uWeight, uDensity, uExp;
varying vec2 vUv;
void main(){
  vec2 delta = (vUv - uLight) * uDensity / 56.;
  float jit = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233))) * 43758.5453);
  vec2 tc = vUv - delta * jit;
  float illum = 1.; vec3 c = vec3(0.);
  for (int i=0;i<56;i++){ tc -= delta; c += texture2D(tOcc, tc).rgb * illum * uWeight; illum *= uDecay; }
  vec4 here = texture2D(tOcc, vUv);
  float solid = here.a * (1. - smoothstep(0.02, 0.2, dot(here.rgb, vec3(.33))));
  c *= uExp * (1. - 0.88*solid);
  c = c / (1. + c);
  gl_FragColor = vec4(c, 0.);
  #include <colorspace_fragment>
}`;
