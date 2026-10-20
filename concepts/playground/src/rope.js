// Ikat thread: 2D position-based rope in screen px. One-sided constraints (it can go slack),
// first point pinned to the sarado bead, last point is the ball's string hole (kinematic or a heavy particle).
export class Rope {
  constructor(n, len, { g = 2600, damp = 0.996, iters = 14 } = {}) {
    this.n = n; this.len = len; this.seg = len / (n - 1); this.g = g; this.damp = damp; this.iters = iters;
    this.x = new Float64Array(n); this.y = new Float64Array(n); this.px = new Float64Array(n); this.py = new Float64Array(n);
    this.w = new Float64Array(n).fill(1);
    this.colliders = [];
  }
  // initialise along a hanging curve between a and b
  hang(a, b, sag = 1) {
    const n = this.n;
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const extra = Math.max(this.len - d, 0);
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1);
      this.x[i] = a[0] + (b[0] - a[0]) * u; this.y[i] = a[1] + (b[1] - a[1]) * u + Math.sin(Math.PI * u) * extra * 0.5 * sag;
      this.px[i] = this.x[i]; this.py[i] = this.y[i];
    }
  }
  setPath(pts) { for (let i = 0; i < this.n; i++) { this.x[i] = this.px[i] = pts[i][0]; this.y[i] = this.py[i] = pts[i][1]; } }
  // a, b: pinned end positions (b may be null -> free heavy end)
  step(dt, a, b) {
    const n = this.n, k = this.damp;
    for (let i = 0; i < n; i++) {
      const vx = (this.x[i] - this.px[i]) * k, vy = (this.y[i] - this.py[i]) * k;
      this.px[i] = this.x[i]; this.py[i] = this.y[i];
      this.x[i] += vx; this.y[i] += vy + this.g * dt * dt;
    }
    for (let it = 0; it < this.iters; it++) {
      this.x[0] = a[0]; this.y[0] = a[1];
      if (b) { this.x[n - 1] = b[0]; this.y[n - 1] = b[1]; }
      for (let i = 0; i < n - 1; i++) {
        const dx = this.x[i + 1] - this.x[i], dy = this.y[i + 1] - this.y[i];
        const d = Math.hypot(dx, dy) || 1e-6;
        if (d <= this.seg) continue; // one-sided: slack is allowed
        let wa = i === 0 ? 0 : this.w[i], wb = (i + 1 === n - 1 && b) ? 0 : this.w[i + 1];
        const s = wa + wb; if (s === 0) continue;
        const c = (d - this.seg) / d;
        this.x[i] += dx * c * wa / s; this.y[i] += dy * c * wa / s;
        this.x[i + 1] -= dx * c * wb / s; this.y[i + 1] -= dy * c * wb / s;
      }
      for (const col of this.colliders) for (let i = 1; i < n - 1; i++) col(this, i);
    }
    this.x[0] = a[0]; this.y[0] = a[1];
    if (b) { this.x[n - 1] = b[0]; this.y[n - 1] = b[1]; }
  }
  points() { const p = []; for (let i = 0; i < this.n; i++) p.push([this.x[i], this.y[i]]); return p; }
  // smooth with Catmull-Rom for rendering
  smooth(sub = 4) {
    const P = this.points(), out = [];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(i - 1, 0)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(i + 2, P.length - 1)];
      for (let s = 0; s < sub; s++) {
        const t = s / sub, t2 = t * t, t3 = t2 * t;
        out.push([0, 1].map(k => 0.5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
      }
    }
    out.push(P[P.length - 1]);
    return out;
  }
}

// circle collider factory: keeps rope points out of a circle (ball, cushion pegs)
export const circleCol = (getC) => (rope, i) => {
  const [cx, cy, r] = getC();
  const dx = rope.x[i] - cx, dy = rope.y[i] - cy, d = Math.hypot(dx, dy);
  if (d < r && d > 1e-6) { rope.x[i] = cx + dx / d * r; rope.y[i] = cy + dy / d * r; }
};
export const floorCol = (getY) => (rope, i) => { const y = getY(); if (rope.y[i] > y) rope.y[i] = y; };
export const rectTopCol = (getR) => (rope, i) => {
  const [x0, x1, y] = getR();
  if (rope.x[i] > x0 && rope.x[i] < x1 && rope.y[i] > y && rope.py[i] <= y + 8) rope.y[i] = y;
};
