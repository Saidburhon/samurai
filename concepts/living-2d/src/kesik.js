// Kesik 切 — cut engine (prototype, Canvas2D). Sheets are convex pieces with transforms.

// split a convex polygon by the line through a with direction d; returns [left, right]
export function splitPoly(poly, a, d) {
  const side = (p) => (p[0] - a[0]) * d[1] - (p[1] - a[1]) * d[0];
  const L = [], R = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length];
    const sp = side(p), sq = side(q);
    if (sp <= 0) L.push(p); if (sp >= 0) R.push(p);
    if ((sp < 0 && sq > 0) || (sp > 0 && sq < 0)) {
      const t = sp / (sp - sq);
      const x = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
      L.push(x); R.push(x);
    }
  }
  return [L, R];
}

// 2D affine as [a,b,c,d,e,f] (canvas order): x' = a x + c y + e, y' = b x + d y + f
export function makeT(T) {
  const { tx = 0, ty = 0, rot = 0, px = 0, py = 0, sx = 1, sy = 1 } = T;
  const r = rot * Math.PI / 180, cs = Math.cos(r), sn = Math.sin(r);
  const a = cs * sx, b = sn * sx, c = -sn * sy, d = cs * sy;
  const e = px + tx - (a * px + c * py), f = py + ty - (b * px + d * py);
  return [a, b, c, d, e, f];
}
export const apply = (M, p) => [M[0] * p[0] + M[2] * p[1] + M[4], M[1] * p[0] + M[3] * p[1] + M[5]];
export function invert(M) {
  const [a, b, c, d, e, f] = M; const det = a * d - b * c;
  return [d / det, -b / det, -c / det, a / det, (c * f - d * e) / det, (b * e - a * f) / det];
}
export const cssMatrix = (M) => `matrix(${M.map((v) => +v.toFixed(6)).join(',')})`;

function pathPoly(ctx, poly) { ctx.beginPath(); poly.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); }

// Draw pieces: { poly (sheet coords), M (sheet->screen), cuts: [[p,q],...] (sheet coords), lift (0..1) }
// sheetCanvas covers sheet coords [-m, -m] .. ; opts.m = margin
export function drawPieces(ctx, pieces, sheetCanvas, opts = {}) {
  const m = opts.m ?? 0;
  // shadows first: they land on whatever is below (cloth), never on a void
  for (const pc of pieces) {
    const lift = pc.lift ?? 0;
    ctx.save();
    ctx.setTransform(...pc.M);
    pathPoly(ctx, pc.poly);
    ctx.shadowColor = `rgba(14,10,34,${0.28 + 0.1 * lift})`;
    ctx.shadowBlur = 24 + 20 * lift;
    ctx.shadowOffsetX = 6 + 8 * lift; ctx.shadowOffsetY = 10 + 16 * lift;
    ctx.fillStyle = '#2a2420';
    ctx.fill();
    ctx.restore();
    // a tighter contact shadow right at the cut
    ctx.save();
    ctx.setTransform(...pc.M);
    pathPoly(ctx, pc.poly);
    ctx.shadowColor = 'rgba(8,8,24,.35)'; ctx.shadowBlur = 5; ctx.shadowOffsetX = 1.5; ctx.shadowOffsetY = 2.5;
    ctx.fillStyle = '#2a2420'; ctx.fill();
    ctx.restore();
  }
  for (const pc of pieces) {
    ctx.save();
    ctx.setTransform(...pc.M);
    pathPoly(ctx, pc.poly); ctx.clip();
    ctx.drawImage(sheetCanvas, -m, -m);
    if (pc.tint) { ctx.fillStyle = pc.tint; ctx.fillRect(-m, -m, sheetCanvas.width, sheetCanvas.height); }
    ctx.restore();
  }
  // razor-clean cut edges: 1.2px steel-light core over a 0.5px darker line
  for (const pc of pieces) {
    for (const [p, q, inward] of pc.cuts || []) {
      const P = apply(pc.M, p), Q = apply(pc.M, q);
      const dx = Q[0] - P[0], dy = Q[1] - P[1], L = Math.hypot(dx, dy);
      let nx = -dy / L, ny = dx / L; if (inward < 0) { nx = -nx; ny = -ny; }
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.lineCap = 'butt';
      ctx.strokeStyle = 'rgba(20,16,12,.55)'; ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.moveTo(P[0] + nx * 0.3, P[1] + ny * 0.3); ctx.lineTo(Q[0] + nx * 0.3, Q[1] + ny * 0.3); ctx.stroke();
      ctx.strokeStyle = 'rgba(246,241,230,.9)'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(P[0] + nx * 1.25, P[1] + ny * 1.25); ctx.lineTo(Q[0] + nx * 1.25, Q[1] + ny * 1.25); ctx.stroke();
      ctx.restore();
    }
  }
}

// steel glint along a screen-space line, head at t (0..1), with a fading tail
export function drawGlint(ctx, P, Q, t, opts = {}) {
  const tail = opts.tail ?? 0.35, I = opts.intensity ?? 1;
  const hx = P[0] + (Q[0] - P[0]) * t, hy = P[1] + (Q[1] - P[1]) * t;
  const t0 = Math.max(0, t - tail);
  const sx = P[0] + (Q[0] - P[0]) * t0, sy = P[1] + (Q[1] - P[1]) * t0;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createLinearGradient(sx, sy, hx, hy);
  g.addColorStop(0, 'rgba(217,222,226,0)'); g.addColorStop(0.75, `rgba(230,234,238,${0.45 * I})`); g.addColorStop(1, `rgba(255,252,246,${1 * I})`);
  ctx.strokeStyle = g; ctx.lineCap = 'round';
  ctx.shadowColor = `rgba(220,228,236,${0.9 * I})`; ctx.shadowBlur = 10;
  ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(hx, hy); ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.lineWidth = 7; ctx.globalAlpha = 0.18 * I; ctx.stroke();
  // head flare
  ctx.globalAlpha = 1;
  const R = opts.flare ?? 64;
  const rg = ctx.createRadialGradient(hx, hy, 0, hx, hy, R);
  rg.addColorStop(0, `rgba(255,253,248,${0.95 * I})`); rg.addColorStop(0.1, `rgba(244,246,248,${0.55 * I})`); rg.addColorStop(0.35, `rgba(226,232,238,${0.14 * I})`); rg.addColorStop(1, 'rgba(220,228,236,0)');
  ctx.fillStyle = rg; ctx.beginPath(); ctx.ellipse(hx, hy, R, R, 0, 0, Math.PI * 2); ctx.fill();
  // anisotropic streak at the head along the line
  const ang = Math.atan2(Q[1] - P[1], Q[0] - P[0]);
  ctx.translate(hx, hy); ctx.rotate(ang);
  const lg = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  lg.addColorStop(0, `rgba(255,255,252,${0.85 * I})`); lg.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.save(); ctx.scale(opts.streak ?? 240, 2.6); ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(0, 0, 1, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  ctx.scale(70, 7); ctx.globalAlpha = 0.5; ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(0, 0, 1, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
