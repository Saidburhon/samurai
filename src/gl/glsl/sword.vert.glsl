// Every sword part. BEND (the blade only): the buffer is the straight blade; uSori bends it onto the circular arc
// (sigma = 0 straight, 1 the finished sori), exactly as sword/geom-core.js bladePoint(s, y, zf, sigma) does on the CPU.
attribute float aRegion;
attribute float aAxial;
varying vec2 vUv; varying float vRegion; varying float vAxial;
varying vec3 vWPos; varying vec3 vWNrm; varying vec3 vLPos;
#ifdef BEND
uniform float uSori;
const float R_ARC = __R_ARC__;
const float LS = __LS__;
#endif
void main(){
  vUv = uv; vRegion = aRegion; vAxial = aAxial; vLPos = position;
  vec3 p = position, n = normal;
#ifdef BEND
  if (uSori > 1e-4) {
    float Rp = R_ARC / uSori, te = 0.5 * LS / Rp, th = (p.x - 0.5 * LS) / Rp;
    float sx = sin(th), cx = cos(th), zz = p.z, a = sin(0.5 * te), b = sin(0.5 * th);
    p.x = Rp * (sx + sin(te)) + sx * zz;
    p.z = Rp * (2. * a * a - 2. * b * b) + cx * zz;
    n = vec3(n.x * cx + n.z * sx, n.y, -n.x * sx + n.z * cx);
  }
#endif
  vec4 wp = modelMatrix * vec4(p, 1.);
  vWPos = wp.xyz;
  vWNrm = normalize(mat3(modelMatrix) * n);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
