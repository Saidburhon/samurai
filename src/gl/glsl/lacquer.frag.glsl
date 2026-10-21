// The saya: black roiro urushi with a mirror clearcoat (one long strip of the studio reads in it), a dark bengara
// band behind the mouth and the cream horn koiguchi. vUv.x = distance from the mouth along the saya (units).
varying vec2 vUv; varying float vRegion; varying float vAxial;
varying vec3 vWPos; varying vec3 vWNrm; varying vec3 vLPos;
uniform sampler2D tHada;
uniform float uHornEnd, uBandEnd, uSayaLen;
uniform float uPart; // 0 the saya, 1 the kurikata
void main(){
  vec3 N0 = normalize(vWNrm);
  vec3 V = normalize(cameraPosition - vWPos);
  vec3 N = N0;
  if (dot(N, V) < -0.2) N = -N;
  float x = vUv.x;
  // urushi depth: a very faint cloudiness under the clearcoat
  float depthN = texture2D(tHada, vec2(fract(x / uSayaLen * 0.97), fract(vUv.y * 2.))).g;
  vec3 black = vec3(.0030, .0027, .0024) * (1. + .04 * (depthN - .5) * 8.);
  vec3 band = vec3(.195, .013, .007) * .55;       // bengara #7A1E14, under lacquer
  vec3 horn = vec3(.62, .55, .40);
  float isHorn = uPart > .5 ? 0. : 1. - smoothstep(uHornEnd - .004, uHornEnd + .004, x);
  float isBand = uPart > .5 ? 0. : (1. - isHorn) * (1. - smoothstep(uBandEnd - .006, uBandEnd + .006, x));
  vec3 base = mix(mix(black, band, isBand), horn, isHorn);
  float rough = mix(.05, .24, isHorn);
  float NoV = clamp(dot(N, V), 0., 1.);
  float F0 = mix(.04, .035, isHorn);
  float F = F0 + (1. - F0) * pow(1. - NoV, 5.);
  vec3 R = reflect(-V, N);
  vec3 L = normalize(uLampPos - vWPos);
  vec3 col = studio(R, rough) * F + lampSpec(N, V, vWPos, vec3(F), rough);
  col += base * (studioIrr(N) * 1.0 + uLampCol * max(dot(N, L), 0.) * .22);
  // the horn's end grain at the mouth face reads lighter
  col += horn * .25 * isHorn * smoothstep(.0, -.001, x) * studioIrr(N);
  col *= uExposure;
  float nv = abs(dot(N0, V));
  float alpha = clamp(nv / max(fwidth(nv) * 1.5, 1e-4), 0., 1.);
  gl_FragColor = vec4(col, 1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  gl_FragColor.rgb = (gl_FragColor.rgb + dither()) * alpha;
  gl_FragColor.a = alpha;
}
