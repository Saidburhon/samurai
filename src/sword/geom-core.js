// The sword as pure math: no three.js, no DOM. Imported by the build (drawings, dial), the boot script (stipple)
// and, from G1, by the GL code. Units: 1 = 10 cm.
// Sword-local frame: x along the blade (tip at +x), y = face normal (towards the camera when lying flat),
// z = from the spine (z = 0) towards the cutting edge. On the paper (top view) x runs right and z runs down.

export const B = { L: 7.0, sori: 0.18, w0: 0.32, w1: 0.22, k0: 0.078, k1: 0.056, yk: 0.93 };
// The centreline is a circular arc: chord L = 7.0 (nagasa 70.0 cm), sagitta 0.18 (sori 1.8 cm).
export const R_ARC = (B.L * B.L / 4 + B.sori * B.sori) / (2 * B.sori); // 34.118
const TH_END = Math.asin(B.L / 2 / R_ARC);
export const L_STRAIGHT = 2 * R_ARC * TH_END; // length of the blade before it is bent (arc length), 7.0123

// fittings along the handle frame (x < 0 runs into the grip), and the tsuba radius
export const H = { habaki: [-0.30, 0.035], seppa1: [-0.315, -0.30], tsuba: [-0.365, -0.315], seppa2: [-0.38, -0.365], fuchi: [-0.43, -0.38], tsuka: [-2.93, -0.43], kashira: [-3.04, -2.93] };
export const TSUBA_R = 0.39;
export const NAKAGO = { L: 2.0, mekugi: 0.62 };
export const SAYA = { wider: 0.10, longer: 0.15, koiguchi: 0.035 };

// ---------- shared noise (the same formulas exist in GLSL) ----------
const fract = (x) => x - Math.floor(x);
export const hash1 = (n) => fract(Math.sin(n * 12.9898) * 43758.5453);
function noise1(x) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return hash1(i) * (1 - u) + hash1(i + 1) * u; }
export function fbm1(x) { let a = 0.5, s = 0; for (let i = 0; i < 4; i++) { s += a * noise1(x); x = x * 2.03 + 17.1; a *= 0.5; } return s / 0.9375; }
export const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
export function mulberry(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// hamon boundary, v: 0 spine .. 1 edge
export function hamonV(u) {
  const T = 6.283185;
  let n = 0.70 + 0.040 * Math.sin(T * 5.3 * u + 0.8)
    + 0.022 * Math.sin(T * 13.1 * u + 2.3)
    + 0.018 * (fbm1(u * 38.0) - 0.5)
    + 0.030 * Math.pow(Math.max(0, Math.sin(T * 9.0 * u + 1.1)), 6.0);
  n = 0.80 + (n - 0.80) * smooth(0.0, 0.06, u);
  return n + (0.25 - n) * smooth(0.975, 1.0, u);
}

// ---------- centreline: a circular arc, bent by sigma (0 = straight, 1 = the finished sori) ----------
export function spine(s, sigma = 1) {
  // s runs along the spine (arc length), so bending never stretches the steel; at sigma = 1 the chord is exactly B.L
  const xs = s * L_STRAIGHT;
  if (sigma < 1e-5) return { x: xs, z: 0, tx: 1, tz: 0, nx: 0, nz: 1 };
  const Rp = R_ARC / sigma, te = (L_STRAIGHT / 2) / Rp;
  const th = (xs - L_STRAIGHT / 2) / Rp;
  return { x: Rp * (Math.sin(th) + Math.sin(te)), z: Rp * (Math.cos(th) - Math.cos(te)), tx: Math.cos(th), tz: -Math.sin(th), nx: Math.sin(th), nz: Math.cos(th) };
}
export function width(s) {
  if (s <= B.yk) return B.w0 + (B.w1 - B.w0) * (s / B.yk);
  const q = (s - B.yk) / (1 - B.yk);
  return B.w1 * Math.sqrt(Math.max(0, 1 - q * q));
}
export function thick(s) {
  if (s <= B.yk) return B.k0 + (B.k1 - B.k0) * (s / B.yk);
  const q = (s - B.yk) / (1 - B.yk);
  return B.k1 * (0.12 + 0.88 * Math.sqrt(Math.max(0, 1 - q * q)));
}
// point on the blade: y in absolute units, zf as a fraction of the width (0 spine .. 1 edge)
export function bladePoint(s, y, zf, sigma = 1) {
  const c = spine(s, sigma), w = width(s);
  let drop = 0; // in the kissaki the spine curves gently down to meet the point
  if (s > B.yk) { const q = (s - B.yk) / (1 - B.yk); drop = B.w1 * 0.10 * q * q; }
  const zz = zf * w + drop;
  return [c.x + c.nx * zz, y, c.z + c.nz * zz];
}
// the same, on the paper (top view): [x, z]
export const bp2 = (s, zf, sigma = 1) => { const p = bladePoint(s, 0, zf, sigma); return [p[0], p[2]]; };

// cross-section profile: [y as a fraction of the thickness, z as a fraction of the width]
export const PROFILE = { peak: [0, 0], shoulder: [0.35, 0.035], shinogi: [0.5, 0.28], ji1: [0.46, 0.45], ji2: [0.33, 0.72], bevel: [0.12, 0.93], edge: [0, 1.0] };
export const PROFILE_TOP = [[0, 0], [0.35, 0.035], [0.5, 0.28], [0.46, 0.45], [0.33, 0.72], [0.12, 0.93], [0, 1]];

// ---------- the handle frame: origin at the centre of the blade's base section, x along the base tangent ----------
export function handleFrame(sigma = 1) {
  const c = spine(0, sigma), w = width(0);
  return { o: [c.x + c.nx * w * 0.5, c.z + c.nz * w * 0.5], ex: [c.tx, c.tz], ez: [c.nx, c.nz] };
}
// a point given in the handle frame (x along, z across) on the paper
export function hp2(x, z, sigma = 1) {
  const f = handleFrame(sigma);
  return [f.o[0] + f.ex[0] * x + f.ez[0] * z, f.o[1] + f.ex[1] * x + f.ez[1] * z];
}
// the sword's axis on the paper: K = the kashira end, T = the tip (the spine end at s = 1)
export function axisEnds(sigma = 1) {
  const K = hp2(H.kashira[0], 0, sigma);
  const c = spine(1, sigma);
  return { K, T: [c.x, c.z] };
}
// the end of the saya (kojiri) on the axis, for the bookend drawing
export function kojiriEnd(sigma = 1) {
  const c = spine(1, sigma);
  return [c.x + c.tx * SAYA.longer, c.z + c.tz * SAYA.longer];
}

// ---------- the tsuka: radii of the oval section along t (0 = kashira end .. 1 = fuchi end) ----------
export function tsukaRadii(t) {
  const waist = 1 - 0.055 * Math.sin(Math.PI * Math.min(1, Math.max(0, (t - 0.05) / 0.9)));
  const taper = 1 + 0.03 * (1 - t);
  return [0.122 * waist * taper, 0.163 * waist * taper];
}
export function kashiraRadius(t) {
  const r = Math.sqrt(Math.max(0, 1 - Math.pow(1 - Math.min(1, t / 0.55), 2)));
  return 0.172 * (0.25 + 0.75 * r);
}

// ---------- the tang (nakago), in the handle frame: [x, zTop, zBottom] samples, spine side first ----------
export function nakagoOutline(n = 24) {
  const top = [], bot = [];
  const w0 = B.w0, hw0 = w0 / 2;
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = -t * NAKAGO.L;
    // munemachi step 0.012 on the spine, hamachi step 0.05 on the edge; taper to 0.62 of the width; kurijiri at the end
    const taper = 1 - 0.38 * t;
    let zs = -hw0 + 0.012 + (hw0 - 0.012) * (1 - taper) * 0.35;
    let ze = hw0 - 0.05 - (hw0 - 0.05) * (1 - taper) * 0.9;
    if (t > 0.9) { const q = (t - 0.9) / 0.1, r = Math.sqrt(Math.max(0, 1 - q * q)); const m = (zs + ze) / 2; zs = m + (zs - m) * r; ze = m + (ze - m) * r; }
    top.push([x, zs]); bot.push([x, ze]);
  }
  return { top, bot };
}

// ---------- kantei: how far each fitting slides off the tang towards the kashira (px at hero scale) ----------
export const KANTEI = { habaki: 8, seppa1: 16, tsuba: 24, seppa2: 32, tsuka: 44, mekugi: 10 };
