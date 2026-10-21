// The grip: Margʻilon atlas (abr ikat) hishimaki over ray skin, with the gilt paxta menuki under the wrap.
// The weave, the ikat and the ray skin are baked (bake.js) into tSilk (albedo rgb, height a) and tSilkM
// (r ribbon, g menuki): mipmapped, so the nodules never break into salt noise at hero scale.
varying vec2 vUv; varying float vRegion; varying float vAxial;
varying vec3 vWPos; varying vec3 vWNrm; varying vec3 vLPos;
uniform sampler2D tSilk, tSilkM;
#ifdef REVEAL
uniform float uReveal, uFront;
#endif
void main(){
#ifdef REVEAL
  if (vAxial > uReveal) discard;
#endif
  vec3 N0 = normalize(vWNrm);
  vec3 V = normalize(cameraPosition - vWPos);
  vec4 sa = texture2D(tSilk, vUv), sm = texture2D(tSilkM, vUv);
  vec3 alb = sa.rgb; float h = sa.a, ribbon = sm.r, menuki = sm.g;
  vec3 N = bumpN(vWPos, N0, h, .006);
  float rough = mix(.55, .42, ribbon);
  vec3 gold = vec3(.80,.60,.30);
  float metal = menuki;
  rough = mix(rough, .25, menuki);
  vec3 F0 = mix(vec3(.04), gold, metal);
  float NoV = clamp(dot(N,V),0.,1.);
  vec3 F = F0 + (1.-F0)*pow(1.-NoV,5.);
  vec3 L = normalize(uLampPos - vWPos);
  float wrap = max((dot(N,L) + .35)/1.35, 0.);
  float keyL = clamp(dot(uStudio * N, normalize(vec3(0., .75, -.66))) * .5 + .5, 0., 1.);
  vec3 irr = (studioIrr(N) * 1.05 + uLampCol * wrap * .22) * (0.45 + 0.85 * keyL * keyL);
  vec3 col = alb * irr * (1.-metal);
  // silk sheen: a soft grazing glow tinted by the thread
  float sheen = pow(1. - NoV, 3.) * ribbon;
  col += sheen * (alb*1.6 + vec3(.25,.28,.4)) * .55 * (studioIrr(N).g + .3);
  col += studio(reflect(-V,N), rough) * F * mix(.6, .35, ribbon);
  col += lampSpec(N, V, vWPos, F, rough + .1) * .8;
#ifdef REVEAL
  float fr = vAxial - uReveal;
  col += uFront * vec3(.86,.93,1.) * (thinLine(fr, 0., 0.0022)*3.0);
#endif
  col *= uExposure;
  float nv = abs(dot(N0, V));
  float alpha = clamp(nv / max(fwidth(nv) * 1.5, 1e-4), 0., 1.);
  gl_FragColor = vec4(col, 1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  gl_FragColor.rgb = (gl_FragColor.rgb + dither()) * alpha;
  gl_FragColor.a = alpha;
}
