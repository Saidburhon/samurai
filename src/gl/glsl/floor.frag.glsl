// The indigo cloth floor (Tsuba, B14–B16): fine twill, a soft vignette, and the girih thrown onto it by the
// lamp disc behind the guard (§2.5). For floor point P the ray from the disc centre L meets the tsuba plane at Q;
// Q in face units samples tGirih (the same hole polygons, filled white, mipmapped) at the penumbra's LOD.
varying vec3 vWPos; varying vec2 vUv;
uniform sampler2D tGirih;
uniform vec3 uDiscL, uTsubaC, uAxisW, uFaceU, uFaceV;
uniform float uDiscR, uGain, uFloorWarm, uVig, uPxPerUnit;
uniform vec3 uFloorBase, uLightCol;
uniform vec2 uVigC; uniform float uVigR;
void main(){
  vec3 P = vWPos, L = uDiscL;
  vec3 dir = P - L;
  float den = dot(dir, uAxisW);
  float light = 0.;
  if (den > 1e-4) {
    float t = dot(uTsubaC - L, uAxisW) / den;
    if (t > 0. && t < 1.) {
      vec3 Q = L + dir * t;
      vec2 fc = vec2(dot(Q - uTsubaC, uFaceU), dot(Q - uTsubaC, uFaceV));
      float pen = uDiscR * length(P - Q) / max(length(Q - L), 1e-3);  // penumbra width on the floor, in units
      float lodv = log2(max(1., pen / 0.82 * 1024.));
      float m = textureLod(tGirih, fc / 0.82 + .5, lodv).r;
      float fall = 1. / (1. + dot(P - L, P - L) * 0.08);
      light = m * fall;
    }
  }
  // twill: a fine diagonal rib, faded where it would alias
  vec2 tw = vec2(vUv.x * 900. + vUv.y * 900., vUv.y * 900.);
  float k = lod(fwidth(tw.x) * uAA);
  float rib = (sin(tw.x * 3.1416) * .5 + .5) * k + .5 * (1. - k);
  vec3 base = mix(uFloorBase, vec3(.042, .029, .019), uFloorWarm) * (0.92 + 0.16 * rib);
  vec3 lc = mix(uLightCol, vec3(1., .84, .63) * 2.2, uFloorWarm);
  vec3 col = base * (1. + light * 0.4) + lc * light * uGain * (0.85 + 0.3 * rib);
  // the floor fades into the night away from the guard
  vec2 q = (vUv - .5) * 30.;   // the plane's own coordinates: x along the guard normal, y across
  float vg = 1. - smoothstep(uVigR * .35, uVigR, length((q - uVigC) * vec2(1., 1.6)));
  float a = mix(1., vg, uVig);
  gl_FragColor = vec4(col, 1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  gl_FragColor.rgb = (gl_FragColor.rgb + dither()) * a;
  gl_FragColor.a = a;
}
