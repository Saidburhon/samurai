// The fittings and the grip, one program (a software renderer compiles each program for ~0.1 s on the boot path).
// Defines: IRON_FULL (the guard's ishime normal map and the backlight through its piercings: Tsuba and Nōtō, prewarmed
// after the intro), NAKAGO (the tang's patina: Yaki and Togi). The boot program has neither:
// copper habaki (kind 0), gold seppa (1), the patinated iron girih tsuba (2), shakudo fuchi and kashira (3), the
// nakago's rust patina (4), and the grip (5): Margʻilon atlas (abr ikat) hishimaki over ray skin, with the gilt paxta
// menuki under the wrap. The weave, the ikat and the ray skin are baked (bake.js) into tSilk: the top half albedo +
// height, the bottom half ribbon + menuki, mipmapped, so the nodules never break into salt noise at hero scale.
varying vec2 vUv; varying float vRegion; varying float vAxial;
varying vec3 vWPos; varying vec3 vWNrm; varying vec3 vLPos;
uniform vec3 uBase; uniform float uRough; uniform float uMetal; uniform float uKind;
uniform vec3 uAxisW, uBackGlow, uFaceU, uFaceV;
uniform sampler2D tIshime;    // the tsuba face: rg = height gradient, b = coarse variation, a = height
uniform sampler2D tSilk;
uniform float uReveal, uFront;
void main(){
  if (vAxial > uReveal) discard;
  vec3 N0 = normalize(vWNrm);
  vec3 N = N0;
  vec3 V = normalize(cameraPosition - vWPos);
  bool silk = uKind > 4.5;
  if (!silk && dot(N, V) < -0.2) N = -N;
  vec3 base = uBase; float rough = uRough; float metal = uMetal;
  vec3 lp = vLPos;
  float h = 0., bscale = .0005;
  vec3 alb = vec3(0.); float ribbon = 0.;
  // the noise comes from the baked ishime (b: fbm at 90/unit, a: value noise at 420/unit over a 0.82 unit tile),
  // sampled at other scales: no live fbm, so this program stays small enough to compile fast in software
  vec4 nz = texture2D(tIshime, fract(lp.xz * vec2(0.66, 1.9)));
  if (silk) {                  // the grip
    vec2 su = vec2(vUv.x, clamp(vUv.y, .002, .998) * .5);
    vec4 sa = texture2D(tSilk, su), sm = texture2D(tSilk, su + vec2(0., .5));
    alb = sa.rgb; h = sa.a; ribbon = sm.r;
    metal = sm.g;                                   // the menuki
    rough = mix(mix(.55, .42, ribbon), .25, metal);
    base = vec3(.80,.60,.30);                       // gold, for the menuki's F0
    N = bumpN(vWPos, N0, h, .006);
  } else if (uKind < .5) {            // copper habaki: diagonal file marks (nekogaki), faded where they would alias
    float ph = (lp.x*1.0 + lp.y*0.5 - lp.z*0.45)*2300.;
    float k = lod(fwidth(ph) / 6.2832);
    float f = sin(ph + nz.b*3.) * k;
    h = f*0.22 + nz.a*.25 * lod(fwidth(lp.x*220.));
    rough = uRough + f*.02 + (1. - k) * .03;
    base *= 0.92 + 0.08*nz.b;
  } else if (uKind < 1.5) {    // gold seppa
    h = texture2D(tIshime, fract(lp.zy * 0.7)).a * .2 * lod(fwidth(lp.z*300.));
    bscale = .0022;
  } else if (uKind < 2.5) {    // patinated iron tsuba, stone-hammered (ishime)
    float rr = length(lp.zy * vec2(1., 1./1.03));
    vec4 ish = texture2D(tIshime, lp.zy / 0.82 + .5);
    float n = ish.b, ha = ish.a;
#ifdef IRON_FULL
    // the full guard (Tsuba, Nōtō): the baked ishime as a normal map (on the hero's guard, about 70 px across, the
    // hammered relief is under a pixel, so the boot program keeps only its tone)
    float face = smoothstep(.6, .9, abs(dot(N, uAxisW)));
    N = normalize(N - ((ish.r - .5) * uFaceU + (ish.g - .5) * uFaceV) * 2. * face);
#endif
    // worn, brighter rim + a gold inlay ring
    float rimWear = smoothstep(.355, .39, rr);
    base = mix(base * (0.75 + 0.5*n), base*1.9, rimWear*.6);
    rough = mix(uRough + (ha - .5)*.12, .32, rimWear*.6);
    float inlay = smoothstep(.3685,.3705,rr) * (1.-smoothstep(.3755,.3775,rr));
    base = mix(base, vec3(.85,.62,.28), inlay);
    rough = mix(rough, .22, inlay); metal = mix(metal, 1., inlay);
  } else if (uKind < 3.5) {    // shakudo fuchi / kashira with nanako dots
    vec2 q = vec2(lp.x*120., atan(lp.y, lp.z)*16.);
    float k = lod(max(fwidth(q.x), fwidth(q.y)) * uAA * 1.6);   // dots only where a cell spans 4+ device px (else salt)
    vec2 c = fract(q) - .5;
    float dot1 = (1. - smoothstep(.18,.32, length(c))) * k + .2 * (1. - k);
    h = dot1 * k;
    base *= 0.9 + 0.2*dot1;
    bscale = .0012;
  }
#ifdef NAKAGO
  else {                       // nakago: the rust patina with oblique file marks (yasurime)
    float ph = (lp.x * 1.0 + lp.z * 0.6) * 900.;
    float k = lod(fwidth(ph) / 6.2832);
    float f = sin(ph) * k;
    float n = texture2D(tIshime, fract(lp.xz * 0.33)).b;
    base *= 0.7 + 0.6 * n;
    h = f * .3 + n * .4;
    bscale = .0008;
  }
#endif
  if (!silk && (uKind < 1.5 || uKind > 2.5)) N = bumpN(vWPos, N, h, bscale);
  vec3 R = reflect(-V, N);
  float NoV = clamp(dot(N,V),0.,1.);
  vec3 F0 = mix(vec3(.04), base, metal);
  vec3 F = F0 + (1.-F0)*pow(1.-NoV,5.);
  vec3 L = normalize(uLampPos - vWPos);
  vec3 irr = studioIrr(N);
  vec3 col = studio(R, rough) * F * (silk ? mix(.6, .35, ribbon) : 1.) + lampSpec(N, V, vWPos, F, silk ? rough + .1 : rough) * (silk ? .8 : 1.);
  if (silk) {
    float wrap = max((dot(N,L) + .35)/1.35, 0.);
    float keyL = clamp(dot(uStudio * N, normalize(vec3(0., .75, -.66))) * .5 + .5, 0., 1.);
    col += alb * (irr * 1.05 + uLampCol * wrap * .22) * (0.45 + 0.85 * keyL * keyL) * (1.-metal);
    // silk sheen: a soft grazing glow tinted by the thread
    col += pow(1. - NoV, 3.) * ribbon * (alb*1.6 + vec3(.25,.28,.4)) * .55 * (irr.g + .3);
  } else col += base * (1.-metal) * (irr + uLampCol*max(dot(N, L),0.)*.25);
#ifdef IRON_FULL
  if (uKind > 1.5 && uKind < 2.5) {
    // light coming through the piercings warms their inner walls, strongest at the back face
    float wall = 1. - abs(dot(normalize(vWNrm), uAxisW));
    float depth = clamp((-0.315 - lp.x) / 0.05, 0., 1.);
    float rr = length(lp.zy * vec2(1., 1./1.03));
    col += uBackGlow * pow(wall, 2.5) * (0.25 + 0.75*depth*depth) * step(rr, 0.362);
  }
#endif
  if (uFront > 0.) col += uFront * vec3(.86,.93,1.) * (thinLine(vAxial - uReveal, 0., 0.0022)*3.0);
  col *= uExposure;
  // round parts (the fuchi, the kashira, the grip, the tsuba's rim): their silhouette (N.V -> 0) ramps to 0 over
  // a pixel; the tsuba's faces ramp to 0 over a pixel at the outer edge of the guard (the outline of a face seen at a
  // grazing angle, B21), so the guard's outline is anti-aliased without MSAA (§2.1, contract 2)
  float nv = abs(dot(N0, V));
  float nvRamp = clamp(nv / max(fwidth(nv) * 1.5, 1e-4), 0., 1.);
  float alpha = (uKind > 2.5 && uKind < 3.5) || silk ? nvRamp : 1.;
  if (uKind > 1.5 && uKind < 2.5) {
    float rq = length(vec2(lp.z / 1.03, lp.y));                 // 0.39 on the outline (geom.js buildTsuba)
    float onFace = smoothstep(.5, .8, abs(dot(N0, uAxisW)));
    alpha = mix(rq > .385 ? nvRamp : 1., clamp((.393 - rq) / max(fwidth(rq), 1e-5) + .5, 0., 1.), onFace);
  }
  gl_FragColor = vec4(col, 1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  gl_FragColor.rgb = (gl_FragColor.rgb + dither()) * alpha;
  gl_FragColor.a = alpha;
}
