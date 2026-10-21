// The blade. One source, three programs (§2.1): POLISHED (default), REVEAL (POLISHED + the reveal discard and its
// front) and FORGE (G1b). Every state inside a program is a uniform.
// Noise is baked (bake.js) into blade-UV textures: tHada = (hada, mist, suna, ashi), tHamon = hamonV(u).
varying vec2 vUv; varying float vRegion; varying float vAxial;
varying vec3 vWPos; varying vec3 vWNrm; varying vec3 vLPos;
uniform sampler2D tHada, tHamon;
uniform float uNie, uTime;
uniform float uPolishFront;       // polish(u) = 1 behind the front, 0.1 ahead of it (Togi); >= 1.05 fully polished
uniform float uShinogiSheen;      // the burnished shinogi-ji's own faint sheen (never a black stripe)
uniform float uShinogiRough;
uniform float uEdgeLine;          // the bright habuchi along the cutting edge
uniform float uNieAvg;            // the sparkle that sub-pixel nie average to
// reflected sign (utsuri)
uniform sampler2D uWords;
uniform float uWordAlpha, uWordRowA, uWordRowB, uWordMix, uWordStretch, uWordSlide;
uniform vec3 uSignO, uSignU, uSignV, uSignN;
uniform float uFlatten;
uniform vec3 uBladeN;
#ifdef REVEAL
uniform float uReveal, uFront;
#endif
const float U0 = -0.05, U1 = 1.0;
float uTex(float u){ return (u - U0) / (U1 - U0); }

vec3 signAt(vec3 Rf, float row, float slide, float bias){
  float den = dot(uSignN, Rf);
  if (den > -1e-3) return vec3(0.);
  float t = dot(uSignN, uSignO - vWPos) / den;
  vec3 Q = vWPos + Rf * t - uSignO;
  vec2 st = vec2(dot(Q, uSignU)/dot(uSignU,uSignU), dot(Q, uSignV)/dot(uSignV,uSignV));
  st.x = (st.x - 0.5 - slide) / max(uWordStretch, 0.2) + 0.5;
  if (st.x < 0. || st.x > 1. || st.y < 0. || st.y > 1.) return vec3(0.);
  vec2 at = vec2(st.x, (row + 1. - st.y) / 6.); // the atlas is not flipped: row r spans v r/6 .. (r+1)/6, top down
  return texture2D(uWords, at, bias).rgb + texture2D(uWords, at, bias + 4.0).rgb * .07;
}

void main(){
  float u = vUv.x, v = vUv.y;
#ifdef REVEAL
  if (vAxial > uReveal + fwidth(vAxial)) discard;
#endif
  vec3 N = normalize(vWNrm);
  vec3 V = normalize(cameraPosition - vWPos);
  if (dot(N, V) < -0.2) N = -N;
  float uu = clamp(u, 0., 1.);
  float hv = texture2D(tHamon, vec2(uTex(uu), .5)).r;
  float d = v - hv;
  float r = vRegion;
  float onJi = step(1.5, r);
  vec4 hd = texture2D(tHada, vec2(uTex(u), v));
  float hada = hd.r - .5, mist = hd.g, suna = hd.b, ashi = hd.a;

  // polish (Togi): behind the front mirror steel, ahead of it stone-scratched steel
  float polish = mix(0.1, 1.0, smoothstep(uPolishFront + 0.012, uPolishFront - 0.012, u));
  float pol = smoothstep(0.1, 1.0, polish);

  vec3 F0; float rough;
  if (r < .5)      { F0 = vec3(.40,.41,.43); rough = .16; }                 // mune
  else if (r < 1.5){ F0 = vec3(.33,.345,.36); rough = uShinogiRough; }      // shinogi-ji (burnished)
  else if (r < 2.5){ F0 = vec3(.55,.565,.58); rough = .06 + hada*.07; }     // ji
  else             { F0 = vec3(.62,.63,.64); rough = .05; }                 // ha (edge bevel)
  F0 *= 1. + hada*.10;
  // hamon: frosty martensite; nioi = the misty white line along the boundary
  float hard = smoothstep(-0.012, 0.03, d) * onJi * step(-0.03, u);
  float nioi = exp(-pow((d-0.002)/0.022, 2.)) * onJi;
  float frost = hard * (0.62 + 0.38*smoothstep(.25,.8,mist)) * (0.85 + 0.15*suna);
  rough = mix(rough, .34, frost);
  vec3 dAlb = vec3(.74,.77,.80) * frost + vec3(.97,.99,1.) * nioi * .65 * (0.55+0.45*mist);
  // ashi: faint streaks running from the hamon towards the edge
  float ashiM = ashi * smoothstep(0.0, .06, d) * (1.-smoothstep(.06,.16,d)) * onJi;
  dAlb *= 1. - ashiM*.35;

  // unpolished steel (ahead of the Togi front): stone-scratched, a blue-grey metallic tint, the hamon as lighter frost
  F0 = mix(F0 * vec3(.78,.80,.84), F0, pol);
  rough = mix(.45, rough, pol);
  dAlb = mix(vec3(.27,.29,.31)*.35 + dAlb*.55, dAlb, pol);

  vec3 R = reflect(-V, N);
  float NoV = clamp(dot(N,V), 0., 1.);
  vec3 F = F0 + (1.-F0)*pow(1.-NoV, 5.);
  vec3 spec = studio(R, rough) * F;
  spec += lampSpec(N, V, vWPos, F, rough);
  // the shinogi-ji is a dark mirror, but burnished: it carries a faint broad sheen of the studio around its streak
  if (r > .5 && r < 1.5) spec += uShinogiSheen * F * studio(R, .55) * pol;
  // stone scratches (ahead of the Togi front): fine parallel scratches laid at 30° to the blade axis; they carry an
  // anisotropic sheen across them (Kajiya-Kay with the scratch as the fibre) and break up into a texture where resolved
  if (pol < .999) {
    vec2 bp = vec2(u * 7.0, v * 0.28);                         // the flat in units (along, across)
    float cs = dot(bp, vec2(-.5, .866)) * 320.;                 // across the scratches, ~0.3 mm a cycle
    float al = dot(bp, vec2(.866, .5)) * 26.;                   // along them: scratches are finite
    float kq = lod(fwidth(cs) * uAA);
    float scr = (noise1(cs) * .6 + noise1(cs * 2.31 + 7.1) * .4) * (.55 + .45 * noise1(al + floor(cs) * 3.7));
    scr = mix(.5, scr, kq);
    spec *= mix(1., .7 + .6 * scr, 1. - pol);
    vec3 ax = normalize(dFdx(vWPos) * dFdx(u) + dFdy(vWPos) * dFdy(u) + vec3(1e-6));
    vec3 ac = normalize(cross(N, ax));
    vec3 Ts = normalize(ax * .866 + ac * .5);
    vec3 L = normalize(uLampPos - vWPos), H = normalize(L + V);
    float th = dot(Ts, H), sh = pow(sqrt(max(0., 1. - th*th)), 60.) * max(dot(N, L), 0.);
    float tr = dot(Ts, normalize(R + V));
    float key = dot(studio(R, .6), vec3(.333));
    spec += (1. - pol) * F * (uLampCol * sh * .18 + key * .35 * pow(sqrt(max(0., 1. - tr*tr)), 8.)) * (.45 + 1.1 * scr);
    dAlb *= mix(1., .85 + .3 * scr, 1. - pol);
  }

  // the reflected sign: words in the steel
  if (uWordAlpha > 0.001 && r > .5) {
    vec3 Nf = normalize(mix(N, uBladeN, uFlatten));
    vec3 Rf = reflect(-V, Nf);
    float bias = mix(0., 3.5, frost) + (r < 1.5 ? .4 : 0.);
    vec3 w = signAt(Rf, uWordRowA, -uWordSlide * uWordMix, bias) * (1. - uWordMix);
    if (uWordMix > .001) w += signAt(Rf, uWordRowB, uWordSlide * (1. - uWordMix), bias) * uWordMix;
    w *= vec3(.90,.94,1.);
    float mirror = (r < 1.5 ? .55 : 1.) * (1. - frost*.75) * pol;
    spec += w * uWordAlpha * mirror * 2.2;
  }
  vec3 Ll = normalize(uLampPos - vWPos);
  vec3 diff = dAlb * (studioIrr(N) * uFrostLight + uFrostAmb + uLampCol*max(dot(N, Ll),0.)*.18);
  // folded grain, faintly visible in the polished ji (only where it is resolved: the bake's mips average it away)
  diff += vec3(.5,.515,.565) * (hada+.5) * .018 * onJi * (1.-frost) * uFrostLight * pol;
  vec3 col = spec*mix(1., .30, frost) + diff;

  // the shinogi ridge (and the ko-shinogi in the kissaki) and the yokote catch light as crisp lines
  float inBlade = step(.5, r) * step(r, 2.5);
  float ridge = thinLine(v, 0.28, 0.0045) * inBlade * (u < 0.93 ? 1. : .6);
  float yoko = thinLine(u, 0.93, 0.0011) * step(0.28, v) * step(r, 2.5) * step(.5, r);
  col += (ridge + yoko * .8) * uRidge * mix(.45, 1., pol);
  // the edge line (habuchi)
  col += thinLine(v, 0.992, 0.0035) * step(2.5, r) * uEdgeLine;
  // the wet polish line at the front
  if (uPolishFront < 1.04) col += thinLine(u, uPolishFront, 0.004) * vec3(.6) * step(.5, r);

  // nie: crystals that twinkle when the angle is right; sub-pixel crystals average to a smooth sparkle (contract 3)
  vec2 cq = vec2(u*uNie, v*80.);
  float cellPx = max(fwidth(cq.x), fwidth(cq.y)) * uAA;      // crystal cells per device px
  float single = 1. - smoothstep(0.35, 0.7, cellPx);
  vec2 cell = floor(cq);
  vec2 cj = hash32(cell + 7.7).xy*.6 + .2;
  float cr = length(fract(cq) - cj);
  float zone = exp(-pow((d+.002)/.035, 2.)) * onJi * pol;
  vec3 Hh = normalize(Ll + V);
  if (single > 0.001) {
    float nieM = step(0.972, hash12(cell)) * zone * (1. - smoothstep(.12, .30, cr));
    vec3 nN = normalize(N + .55*(hash32(cell)-.5));
    float tw = pow(max(dot(nN, Hh), 0.), 400.) * 8. + dot(studio(reflect(-V,nN), .01), vec3(.33)) * .6;
    col += nieM * tw * vec3(1.,.98,.94) * single;
  }
  // the mean: 2.8 % of cells x ~14 % crystal area, with a broadened glint lobe
  float avgTw = pow(max(dot(N, Hh), 0.), 18.) * 1.4 + dot(studio(R, .25), vec3(.33)) * .6;
  col += zone * avgTw * uNieAvg * vec3(1.,.98,.94) * (1. - single);

#ifdef REVEAL
  // the drawing -> steel wipe front
  float fr = vAxial - uReveal;
  col += uFront * vec3(.86,.93,1.) * (thinLine(fr, 0., 0.0011)*5.0 + exp(-pow(fr/0.012,2.))*.25);
#endif
  col *= uExposure;
  // coverage: the spine and edge rows ramp to 0 over one pixel, so the outline is anti-aliased without MSAA (contract 2)
  float fz = fwidth(v) * 1.2;
  float alpha = smoothstep(0., fz, v) * smoothstep(1., 1. - fz, v);
#ifdef REVEAL
  alpha *= smoothstep(0., fwidth(vAxial) * 1.2, uReveal - vAxial + fwidth(vAxial) * .6);
#endif
  gl_FragColor = vec4(col, 1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  gl_FragColor.rgb = (gl_FragColor.rgb + dither()) * alpha;
  gl_FragColor.a = alpha;
}
