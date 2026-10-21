// The soft analytic contact shadow on the paper (y = 0), from CPU segments [x, z, half-width, penumbra] (softpass.js).
// Rendered into a quarter-resolution target on a quad oriented along the sword, then composited with one bilinear
// sample: the penumbra tolerates the resolution, and the pass costs a few ms instead of ~200 in software.
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
  gl_FragColor = vec4(uShadowCol * a, a); // premultiplied, linear
}
