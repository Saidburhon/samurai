// Every sword part. BEND (the blade only): the buffer is the straight blade; uSori bends it onto the circular arc
// (sigma = 0 straight, 1 the finished sori), exactly as sword/geom-core.js bladePoint(s, y, zf, sigma) does on the CPU.
attribute float aRegion;
attribute float aAxial;
varying vec2 vUv; varying float vRegion; varying float vAxial;
varying vec3 vWPos; varying vec3 vWNrm; varying vec3 vLPos;
#ifdef BEND
uniform float uSori;
uniform vec2 uRes;       // the drawing buffer in px
attribute vec3 aMune;    // this ring's mune (peak -> shoulder) and ha (bevel -> edge) on this side, straight blade
attribute vec3 aHa;
varying vec2 vOut;       // their signed screen widths in buffer px (< 0: the facet faces away)
const float R_ARC = __R_ARC__;
const float LS = __LS__;
vec2 scr(vec3 P){ vec4 c = projectionMatrix * viewMatrix * vec4(P, 1.); return c.xy / c.w * .5 * uRes; }
#endif
void main(){
  vUv = uv; vRegion = aRegion; vAxial = aAxial; vLPos = position;
  vec3 p = position, n = normal;
#ifdef BEND
  vec3 dm = aMune, dh = aHa;
  float side = aMune.y >= 0. ? 1. : -1.;
  // outward facet normals in the section plane (x = 0): side · (0, d.z, −d.y)
  vec3 nm = side * vec3(0., aMune.z, -aMune.y), nh = side * vec3(0., aHa.z, -aHa.y);
  if (uSori > 1e-4) {
    float Rp = R_ARC / uSori, te = 0.5 * LS / Rp, th = (p.x - 0.5 * LS) / Rp;
    float sx = sin(th), cx = cos(th), zz = p.z, a = sin(0.5 * te), b = sin(0.5 * th);
    p.x = Rp * (sx + sin(te)) + sx * zz;
    p.z = Rp * (2. * a * a - 2. * b * b) + cx * zz;
    n = vec3(n.x * cx + n.z * sx, n.y, -n.x * sx + n.z * cx);
    dm = vec3(dm.x * cx + dm.z * sx, dm.y, -dm.x * sx + dm.z * cx); dh = vec3(dh.x * cx + dh.z * sx, dh.y, -dh.x * sx + dh.z * cx);
    nm = vec3(nm.x * cx + nm.z * sx, nm.y, -nm.x * sx + nm.z * cx); nh = vec3(nh.x * cx + nh.z * sx, nh.y, -nh.x * sx + nh.z * cx);
  }
#endif
  vec4 wp = modelMatrix * vec4(p, 1.);
  vWPos = wp.xyz;
  vWNrm = normalize(mat3(modelMatrix) * n);
#ifdef BEND
  vec3 toC = cameraPosition - wp.xyz;
  vec3 dmW = mat3(modelMatrix) * dm, dhW = mat3(modelMatrix) * dh;
  vec2 s0 = scr(wp.xyz);
  vOut = vec2(length(scr(wp.xyz + dmW) - s0) * (dot(mat3(modelMatrix) * nm, toC) > 0. ? 1. : -1.),
              length(scr(wp.xyz + dhW) - s0) * (dot(mat3(modelMatrix) * nh, toC) > 0. ? 1. : -1.));
#endif
  gl_Position = projectionMatrix * viewMatrix * wp;
}
