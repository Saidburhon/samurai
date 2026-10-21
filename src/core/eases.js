// The easing tokens (§5.6) as plain functions of p in [0, 1], so the state function needs no GSAP.
//   hone  cubic-bezier(.16, 1, .3, 1)     text in, labels
//   cut   cubic-bezier(.45, 0, .3, 1)     cut halves, wipes
//   lift  expo.inOut                      the intro lift, the bookend lift
//   cam   power2.inOut                    every camera window
//   spin  power3.inOut                    the whip spin
//   seat  power3.inOut                    sheathing
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

// a CSS cubic-bezier(x1, y1, x2, y2), solved for x by Newton steps with a bisection fallback
export function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (t) => ((ax * t + bx) * t + cx) * t, Y = (t) => ((ay * t + by) * t + cy) * t, dX = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (p) => {
    p = clamp01(p);
    if (p === 0 || p === 1) return p;
    let t = p;
    for (let i = 0; i < 8; i++) { const e = X(t) - p, d = dX(t); if (Math.abs(e) < 1e-6) return Y(t); if (Math.abs(d) < 1e-6) break; t -= e / d; }
    let lo = 0, hi = 1; t = p;
    for (let i = 0; i < 30; i++) { const x = X(t); if (Math.abs(x - p) < 1e-6) break; if (x < p) lo = t; else hi = t; t = (lo + hi) / 2; }
    return Y(t);
  };
}
const inOut = (n) => (p) => { p = clamp01(p); return p < 0.5 ? Math.pow(2 * p, n) / 2 : 1 - Math.pow(2 - 2 * p, n) / 2; };
const expoInOut = (p) => { p = clamp01(p); if (p === 0 || p === 1) return p; return p < 0.5 ? Math.pow(2, 20 * p - 10) / 2 : (2 - Math.pow(2, -20 * p + 10)) / 2; };

export const EASES = {
  linear: clamp01,
  hone: bezier(0.16, 1, 0.3, 1),
  cut: bezier(0.45, 0, 0.3, 1),
  lift: expoInOut,
  cam: inOut(3),   // GSAP's power2 is a cubic, power1 a quad, power3 a quartic
  spin: inOut(4),
  seat: inOut(4),
  sine: (p) => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(p)),
  'power1.inOut': inOut(2),
  'power2.inOut': inOut(3),
  'power2.in': (p) => Math.pow(clamp01(p), 3),
  inOutCubic: inOut(3),
};
export const ease = (name) => EASES[name] || EASES.cam;
export { clamp01 };
