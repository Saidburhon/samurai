// tiny deterministic animation helpers: every frame is a pure function of t
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const seg = (t, a, b) => clamp((t - a) / (b - a));
export const lerp = (a, b, u) => a + (b - a) * u;
export const inQuad = u => u * u;
export const inCubic = u => u * u * u;
export const outCubic = u => 1 - Math.pow(1 - u, 3);
export const outQuart = u => 1 - Math.pow(1 - u, 4);
export const inOutCubic = u => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
export const backOut = (u, s = 1.70158) => { const c3 = s + 1; return 1 + c3 * Math.pow(u - 1, 3) + s * Math.pow(u - 1, 2); };
export const elasticOut = (u, a = 1, p = 0.5) => {
  if (u <= 0) return 0; if (u >= 1) return 1;
  const s = p / (2 * Math.PI) * Math.asin(1 / a);
  return a * Math.pow(2, -10 * u) * Math.sin((u - s) * (2 * Math.PI) / p) + 1;
};
// damped wiggle that starts at amplitude 1 and settles to 0
export const wiggle = (u, cycles = 2.5, decay = 5) => u <= 0 || u >= 1 ? 0 : Math.cos(u * cycles * 2 * Math.PI) * Math.exp(-decay * u);
// seeded random
export const rng = (seed = 1) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
// Catmull-Rom through keyframes [{t, x, y}]
export function spline(keys, t) {
  if (t <= keys[0].t) return [keys[0].x, keys[0].y];
  const n = keys.length;
  if (t >= keys[n - 1].t) return [keys[n - 1].x, keys[n - 1].y];
  let i = 0; while (t > keys[i + 1].t) i++;
  const k0 = keys[Math.max(i - 1, 0)], k1 = keys[i], k2 = keys[i + 1], k3 = keys[Math.min(i + 2, n - 1)];
  const u = (t - k1.t) / (k2.t - k1.t), u2 = u * u, u3 = u2 * u;
  const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u2 + (-a + 3 * b - 3 * c + d) * u3);
  return [f(k0.x, k1.x, k2.x, k3.x), f(k0.y, k1.y, k2.y, k3.y)];
}
// comic burst: 12 spikes with seeded jitter
export function burstPath(R = 100, seed = 3, spikes = 12) {
  const r = rng(seed); let d = '';
  for (let i = 0; i < spikes * 2; i++) {
    const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2 + (r() - .5) * 0.12;
    const rad = i % 2 === 0 ? R * (0.9 + r() * 0.16) : R * (0.6 + r() * 0.08);
    d += (i ? 'L' : 'M') + (Math.cos(a) * rad).toFixed(1) + ' ' + (Math.sin(a) * rad).toFixed(1);
  }
  return d + 'Z';
}
export function scallopPath(cx, cy, R, n = 14, bump = 0.09) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2, am = (a0 + a1) / 2;
    const p0 = [cx + Math.cos(a0) * R, cy + Math.sin(a0) * R], p1 = [cx + Math.cos(a1) * R, cy + Math.sin(a1) * R];
    const c = [cx + Math.cos(am) * R * (1 + bump * 2.1), cy + Math.sin(am) * R * (1 + bump * 2.1)];
    d += (i ? '' : `M${p0[0].toFixed(1)} ${p0[1].toFixed(1)}`) + `Q${c[0].toFixed(1)} ${c[1].toFixed(1)} ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`;
  }
  return d + 'Z';
}
