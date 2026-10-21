// Backlight rays through the girih (Tsuba, hold-only): a radial blur of the occluder target from the disc light's
// screen point, with a fixed per-pixel jitter so a still is stable. Composited additively.
uniform sampler2D tOcc; uniform vec2 uLight; uniform float uDecay, uWeight, uDensity, uExp;
varying vec2 vUv;
#define NS 30
void main(){
  vec2 delta = (vUv - uLight) * uDensity / float(NS);
  float jit = fract(sin(dot(floor(gl_FragCoord.xy), vec2(12.9898,78.233))) * 43758.5453);
  vec2 tc = vUv - delta * jit;
  float illum = 1.; vec3 c = vec3(0.);
  for (int i=0;i<NS;i++){ tc -= delta; c += texture2D(tOcc, tc).rgb * illum * uWeight; illum *= uDecay; }
  vec4 here = texture2D(tOcc, vUv);
  float solid = here.a * (1. - smoothstep(0.02, 0.2, dot(here.rgb, vec3(.33))));
  c *= uExp * (1. - 0.88*solid);
  c = c / (1. + c);
  gl_FragColor = vec4(c, 0.);
  #include <colorspace_fragment>
}
