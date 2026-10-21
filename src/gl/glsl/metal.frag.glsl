// The fittings: copper habaki (kind 0), gold seppa (1), the patinated iron girih tsuba (2), shakudo fuchi and
// kashira (3), the nakago's rust patina (4). One program; the kind is a uniform.
varying vec2 vUv; varying float vRegion; varying float vAxial;
varying vec3 vWPos; varying vec3 vWNrm; varying vec3 vLPos;
uniform vec3 uBase; uniform float uRough; uniform float uMetal; uniform float uKind;
uniform vec3 uAxisW, uBackGlow, uFaceU, uFaceV;
uniform sampler2D tIshime;    // the tsuba face: rg = height gradient, b = coarse variation, a = height
uniform float uReveal, uFront;
void main(){
  if (vAxial > uReveal) discard;
  vec3 N = normalize(vWNrm);
  vec3 V = normalize(cameraPosition - vWPos);
  if (dot(N, V) < -0.2) N = -N;
  vec3 base = uBase; float rough = uRough; float metal = uMetal;
  vec3 lp = vLPos;
  float h = 0., bscale = .0005;
  // the noise comes from the baked ishime (b: fbm at 90/unit, a: value noise at 420/unit over a 0.82 unit tile),
  // sampled at other scales: no live fbm, so this program stays small enough to compile fast in software
  vec4 nz = texture2D(tIshime, fract(lp.xz * vec2(0.66, 1.9)));
  if (uKind < .5) {            // copper habaki: diagonal file marks (nekogaki), faded where they would alias
    float ph = (lp.x*1.0 + lp.y*0.5 - lp.z*0.45)*2300.;
    float k = lod(fwidth(ph) / 6.2832);
    float f = sin(ph + nz.b*3.) * k;
    h = f*0.22 + nz.a*.25 * lod(fwidth(lp.x*220.));
    rough = uRough + f*.02 + (1. - k) * .03;
    base *= 0.92 + 0.08*nz.b;
  } else if (uKind < 1.5) {    // gold seppa
    h = texture2D(tIshime, fract(lp.zy * 0.7)).a * .2 * lod(fwidth(lp.z*300.));
    bscale = .0022;
  } else if (uKind < 2.5) {    // patinated iron tsuba, stone-hammered (ishime): a baked normal map
    vec2 fc = lp.zy / 0.82 + .5;
    vec4 ish = texture2D(tIshime, fc);
    float n = ish.b;
    float face = smoothstep(.6, .9, abs(dot(N, uAxisW)));
    N = normalize(N - ((ish.r - .5) * uFaceU + (ish.g - .5) * uFaceV) * 2. * face);
    float rr = length(lp.zy * vec2(1., 1./1.03));
    // worn, brighter rim + a gold inlay ring
    float rimWear = smoothstep(.355, .39, rr);
    base = mix(base * (0.75 + 0.5*n), base*1.9, rimWear*.6);
    rough = mix(uRough + (ish.a - .5)*.12, .32, rimWear*.6);
    float inlay = smoothstep(.3685,.3705,rr) * (1.-smoothstep(.3755,.3775,rr));
    base = mix(base, vec3(.85,.62,.28), inlay);
    rough = mix(rough, .22, inlay); metal = mix(metal, 1., inlay);
  } else if (uKind < 3.5) {    // shakudo fuchi / kashira with nanako dots
    vec2 q = vec2(lp.x*120., atan(lp.y, lp.z)*16.);
    float k = lod(max(fwidth(q.x), fwidth(q.y)));
    vec2 c = fract(q) - .5;
    float dot1 = (1. - smoothstep(.18,.32, length(c))) * k + .2 * (1. - k);
    h = dot1 * k;
    base *= 0.9 + 0.2*dot1;
    bscale = .0012;
  } else {                     // nakago: the rust patina with oblique file marks (yasurime)
    float ph = (lp.x * 1.0 + lp.z * 0.6) * 900.;
    float k = lod(fwidth(ph) / 6.2832);
    float f = sin(ph) * k;
    float n = texture2D(tIshime, fract(lp.xz * 0.33)).b;
    base *= 0.7 + 0.6 * n;
    h = f * .3 + n * .4;
    bscale = .0008;
  }
  if (uKind < 1.5 || uKind > 2.5) N = bumpN(vWPos, N, h, bscale);
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
  if (uFront > 0.) col += uFront * vec3(.86,.93,1.) * (thinLine(vAxial - uReveal, 0., 0.0022)*3.0);
  col *= uExposure;
  // round parts: their silhouette (N.V -> 0) ramps to 0 over a pixel
  float alpha = uKind > 2.5 && uKind < 3.5 ? clamp(abs(dot(normalize(vWNrm), V)) / max(fwidth(dot(normalize(vWNrm), V)) * 1.5, 1e-4), 0., 1.) : 1.;
  gl_FragColor = vec4(col, 1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  gl_FragColor.rgb = (gl_FragColor.rgb + dither()) * alpha;
  gl_FragColor.a = alpha;
}
