// The oshigata: a technical drawing of the same sword, projected through the same camera,
// so ink and steel coincide exactly.
import * as THREE from 'three';
import * as G from './geom.js';

const f1 = (n) => n.toFixed(1);
const path = (pts) => pts.map((p, i) => (i ? 'L' : 'M') + f1(p[0]) + ' ' + f1(p[1])).join('');
function mulberry(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const mul = (a, k) => [a[0] * k, a[1] * k];
const len = (a) => Math.hypot(a[0], a[1]);
const nrm = (a) => mul(a, 1 / len(a));
const perp = (a) => [-a[1], a[0]];

// kissaki-shaped arrowhead: tip at p pointing along dir
function arrow(p, dir, size = 9) {
  const d = nrm(dir), n = perp(d);
  const back = sub(p, mul(d, size));
  const s1 = add(back, mul(n, size * 0.27)), s2 = add(back, mul(n, -size * 0.12));
  const c = add(sub(p, mul(d, size * 0.35)), mul(n, size * 0.3));
  return `M${f1(p[0])} ${f1(p[1])}Q${f1(c[0])} ${f1(c[1])} ${f1(s1[0])} ${f1(s1[1])}L${f1(s2[0])} ${f1(s2[1])}Z`;
}

export function drawOshigata(stage, svg, canvas, opt = {}) {
  const W = stage.w, H = stage.h;
  const hf = stage.hf;
  const P = (x, z) => stage.project(stage.paperPoint(x, z));
  const PH = (x, z) => { const v = new THREE.Vector3(x, 0, z).applyMatrix4(hf); return P(v.x, v.z); };
  const BP = (s, zf) => { const p = G.bladePoint(s, 0, zf); return P(p[0], p[2]); };
  const ink = opt.ink || '#0F0E0C';
  const reveal = opt.reveal ?? 2;
  const K = stage.K, T = stage.T;
  const Ks = P(K.x, K.z), Ts = P(T.x, T.z);
  const axisDir = nrm(sub(Ts, Ks));
  const axialOf = (x, z) => { const d = T.clone().sub(K); return (new THREE.Vector3(x, 0, z).sub(K)).dot(d) / d.lengthSq(); };

  const parts = [];
  // ---- blade ----
  const N = 160;
  const spineL = [], edgeL = [], shin = [];
  for (let i = 0; i <= N; i++) {
    const s = 0.006 + (1 - 0.006) * (1 - Math.pow(1 - i / N, 1.0));
    spineL.push(BP(s, 0)); edgeL.push(BP(s, 1)); if (s <= 1) shin.push(BP(s, 0.28));
  }
  parts.push(`<path d="${path([...spineL, ...edgeL.slice().reverse()])}Z" stroke-width="1.15" opacity=".86"/>`);
  parts.push(`<path d="${path(shin)}" stroke-width=".75" opacity=".62"/>`);
  const yk = [BP(G.B.yk, 0.28), BP(G.B.yk, 1)];
  parts.push(`<path d="${path(yk)}" stroke-width=".75" opacity=".62"/>`);
  // mune line (ridge of the iori-mune)
  const mune = []; for (let i = 0; i <= 80; i++) mune.push(BP(0.006 + 0.994 * i / 80, 0.035));
  parts.push(`<path d="${path(mune)}" stroke-width=".5" opacity=".38"/>`);

  // ---- habaki, seppa, tsuba, fuchi (top view) ----
  const rect = (x0, x1, z0, z1) => [PH(x0, z0), PH(x1, z0), PH(x1, z1), PH(x0, z1)];
  const g0 = G.B.w0 / 2 + 0.03;
  parts.push(`<path d="${path(rect(...G.H.habaki, -g0, g0))}Z" stroke-width=".9" opacity=".8"/>`);
  // nekogaki hatching on the habaki
  {
    let d = '';
    for (let i = 0; i < 9; i++) {
      const x = G.H.habaki[0] + 0.03 + i * 0.034;
      const a = PH(x, -g0 + 0.01), b = PH(x + 0.05, g0 - 0.01);
      d += `M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}`;
    }
    parts.push(`<path d="${d}" stroke-width=".5" opacity=".35"/>`);
  }
  parts.push(`<path d="${path(rect(...G.H.seppa1, -0.112, 0.112))}Z" stroke-width=".6" opacity=".6"/>`);
  parts.push(`<path d="${path(rect(...G.H.seppa2, -0.112, 0.112))}Z" stroke-width=".6" opacity=".6"/>`);
  const tR = G.TSUBA_R * 1.03;
  parts.push(`<path d="${path(rect(...G.H.tsuba, -tR, tR))}Z" stroke-width="1.1" opacity=".86"/>`);
  parts.push(`<path d="${path(rect(...G.H.fuchi, -0.171, 0.171))}Z" stroke-width=".9" opacity=".8"/>`);

  // ---- tsuka with hishimaki diamonds ----
  const [tx0, tx1] = G.H.tsuka;
  const rzAt = (t) => { const waist = 1 - 0.055 * Math.sin(Math.PI * Math.min(1, Math.max(0, (t - 0.05) / 0.9))); return 0.163 * waist * (1 + 0.03 * (1 - t)); };
  const top = [], bot = [];
  for (let i = 0; i <= 60; i++) { const t = i / 60, x = tx0 + (tx1 - tx0) * t; top.push(PH(x, -rzAt(t))); bot.push(PH(x, rzAt(t))); }
  parts.push(`<path d="${path([...top, ...bot.reverse()])}Z" stroke-width="1.0" opacity=".82"/>`);
  {
    // ribbon edges on the visible (upper) half: lattice X = t*nD, Y = ph*2 + .25 ; edges at frac(X±Y) = ±hw
    const nD = 10, hw = 0.31;
    let d = '';
    for (const fam of [1, -1]) for (let m = -6; m <= 16; m++) for (const e of [-hw, hw]) {
      const pts = [];
      for (let j = 0; j <= 24; j++) {
        const ph = 0.0 + 0.5 * (j / 24); // a in [0, pi]: top face seen from above
        const Y = ph * 2 + 0.25;
        const X = fam > 0 ? (m + e - Y) : (m + e + Y);
        const t = X / nD; if (t < 0 || t > 1) { if (pts.length) break; else continue; }
        const a = ph * Math.PI * 2; const x = tx0 + (tx1 - tx0) * t;
        pts.push(PH(x, Math.cos(a) * rzAt(t)));
      }
      if (pts.length > 1) d += path(pts);
    }
    parts.push(`<path d="${d}" stroke-width=".55" opacity=".42"/>`);
  }
  // kashira
  {
    const [kx0, kx1] = G.H.kashira; const pts = [];
    for (let i = 0; i <= 24; i++) { const t = i / 24; const r = Math.sqrt(Math.max(0, 1 - Math.pow(1 - Math.min(1, t / 0.55), 2))); pts.push(PH(kx0 + (kx1 - kx0) * t, -0.172 * (0.25 + 0.75 * r))); }
    for (let i = 24; i >= 0; i--) { const t = i / 24; const r = Math.sqrt(Math.max(0, 1 - Math.pow(1 - Math.min(1, t / 0.55), 2))); pts.push(PH(kx0 + (kx1 - kx0) * t, 0.172 * (0.25 + 0.75 * r))); }
    parts.push(`<path d="${path(pts)}Z" stroke-width=".9" opacity=".8"/>`);
  }

  // ---- centreline, dash-dot ----
  const cl0 = sub(Ks, mul(axisDir, 26)), cl1 = add(Ts, mul(axisDir, 22));
  const annot = [];
  annot.push(`<path d="M${f1(cl0[0])} ${f1(cl0[1])}L${f1(cl1[0])} ${f1(cl1[1])}" stroke-width=".6" opacity=".34" stroke-dasharray="14 3 1.5 3"/>`);

  // ---- dimensions ----
  const machi = BP(0.0, 0), tip = BP(1, 0);
  const chordDir = nrm(sub(tip, machi)), nUp = perp(chordDir); // perp points to the left of the direction
  // make nUp point towards the spine side (away from the edge)
  const edgeMid = BP(0.5, 1), spineMid = BP(0.5, 0);
  let nS = nrm(sub(spineMid, edgeMid)); // towards spine
  const off = opt.nagasaOffset ?? 58;
  if (opt.nagasa !== false) {
    const a = add(machi, mul(nS, off)), b = add(tip, mul(nS, off));
    annot.push(`<path d="M${f1(machi[0] + nS[0] * 8)} ${f1(machi[1] + nS[1] * 8)}L${f1(a[0] + nS[0] * 7)} ${f1(a[1] + nS[1] * 7)}M${f1(tip[0] + nS[0] * 8)} ${f1(tip[1] + nS[1] * 8)}L${f1(b[0] + nS[0] * 7)} ${f1(b[1] + nS[1] * 7)}" stroke-width=".6" opacity=".55"/>`);
    annot.push(`<path d="M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}" stroke-width=".7" opacity=".7"/>`);
    annot.push(`<path d="${arrow(a, sub(a, b))}${arrow(b, sub(b, a))}" fill="${ink}" stroke="none" opacity=".8"/>`);
    const mid = mul(add(a, b), 0.5), ang = Math.atan2(chordDir[1], chordDir[0]) * 180 / Math.PI;
    const lp = add(mid, mul(nS, 9));
    annot.push(`<text transform="translate(${f1(lp[0])} ${f1(lp[1])}) rotate(${ang.toFixed(2)})" text-anchor="middle" class="dim"><tspan class="jp">刃長</tspan><tspan dx="9">NAGASA</tspan><tspan dx="12">70.0</tspan></text>`);
  }
  if (opt.sori !== false) {
    // chord and the sori at the deepest point
    annot.push(`<path d="M${f1(machi[0])} ${f1(machi[1])}L${f1(tip[0])} ${f1(tip[1])}" stroke-width=".55" opacity=".42" stroke-dasharray="2 3"/>`);
    let best = 0, bp = null, bc = null;
    for (let i = 1; i < 100; i++) {
      const p = BP(i / 100, 0); const q = sub(p, machi); const along = q[0] * chordDir[0] + q[1] * chordDir[1];
      const c = add(machi, mul(chordDir, along)); const dd = len(sub(p, c));
      if (dd > best) { best = dd; bp = p; bc = c; }
    }
    annot.push(`<path d="M${f1(bc[0])} ${f1(bc[1])}L${f1(bp[0])} ${f1(bp[1])}" stroke-width=".7" opacity=".75"/>`);
    annot.push(`<path d="${arrow(bp, sub(bp, bc), 7)}" fill="${ink}" stroke="none" opacity=".8"/>`);
    const lead = add(bc, mul(nS, opt.soriLead ?? 30));
    annot.push(`<path d="M${f1(bc[0])} ${f1(bc[1])}L${f1(lead[0])} ${f1(lead[1])}" stroke-width=".55" opacity=".5"/>`);
    const ang = Math.atan2(chordDir[1], chordDir[0]) * 180 / Math.PI;
    const lp = add(lead, mul(chordDir, 6));
    annot.push(`<text transform="translate(${f1(lp[0])} ${f1(lp[1] + 4)}) rotate(${ang.toFixed(2)})" class="dim"><tspan class="jp">反り</tspan><tspan dx="9">SORI</tspan><tspan dx="12">1.8</tspan></text>`);
  }
  // ---- tsuba detail, face on ----
  if (opt.detail) {
    const { cx, cy, r } = opt.detail;
    const k = r / (G.TSUBA_R * 1.03);
    const rot = (opt.detail.rot ?? 0) * Math.PI / 180;
    const tp = ([u, v]) => { const x = u * k, y = -v * k; return [cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]; };
    let d = '';
    const circ = (rr, sx = 1.03) => { const pts = []; for (let i = 0; i <= 128; i++) { const a = i / 128 * Math.PI * 2; pts.push(tp([Math.cos(a) * rr * sx, Math.sin(a) * rr])); } return path(pts) + 'Z'; };
    annot.push(`<path d="${circ(G.TSUBA_R)}" stroke-width="1.1" opacity=".86"/>`);
    annot.push(`<path d="${circ(0.372, 1.0)}" stroke-width=".5" opacity=".4"/>`);
    for (const h of G.girihHoles()) d += path(h.map(tp)) + 'Z';
    d += path(G.nakagoAna().map(tp)) + 'Z';
    annot.push(`<path d="${d}" stroke-width=".7" opacity=".78" fill="${ink}" fill-opacity=".07"/>`);
    // seppa-dai outline
    annot.push(`<path d="${(() => { const pts = []; for (let i = 0; i <= 64; i++) { const a = i / 64 * Math.PI * 2; pts.push(tp([Math.cos(a) * 0.205, Math.sin(a) * 0.112])); } return path(pts) + 'Z'; })()}" stroke-width=".5" opacity=".35" stroke-dasharray="2 2"/>`);
    // centre marks
    const c1 = tp([-0.45, 0]), c2 = tp([0.45, 0]), c3 = tp([0, -0.45]), c4 = tp([0, 0.45]);
    annot.push(`<path d="M${f1(c1[0])} ${f1(c1[1])}L${f1(c2[0])} ${f1(c2[1])}M${f1(c3[0])} ${f1(c3[1])}L${f1(c4[0])} ${f1(c4[1])}" stroke-width=".5" opacity=".3" stroke-dasharray="10 2.5 1.5 2.5"/>`);
    // leader to the tsuba in the drawing
    const tsMid = PH((G.H.tsuba[0] + G.H.tsuba[1]) / 2, -tR);
    const from = opt.detail.leaderFrom ? opt.detail.leaderFrom : [cx, cy + r];
    annot.push(`<path d="M${f1(from[0])} ${f1(from[1])}L${f1(tsMid[0])} ${f1(tsMid[1])}" stroke-width=".55" opacity=".45"/>`);
    annot.push(`<circle cx="${f1(tsMid[0])}" cy="${f1(tsMid[1])}" r="1.8" fill="${ink}" stroke="none" opacity=".7"/>`);
    if (opt.detail.label) {
      const [lx, ly, anchor] = opt.detail.label;
      annot.push(`<text x="${lx}" y="${ly}" text-anchor="${anchor || 'start'}" class="dim"><tspan class="jp">鍔</tspan><tspan dx="9">TSUBA</tspan><tspan dx="10" class="dim-soft">girih</tspan></text>`);
    }
  }

  // ---- reveal clip (hide ink where steel has arrived) ----
  let clip = '', front = '';
  if (reveal < 1.5) {
    const L = T.clone().sub(K);
    const pr = K.clone().add(L.multiplyScalar(reveal));
    const ps = P(pr.x, pr.z);
    const n = perp(axisDir);
    const far = 4000;
    const a = add(ps, mul(n, far)), b = add(ps, mul(n, -far));
    const c = add(b, mul(axisDir, far)), d = add(a, mul(axisDir, far));
    clip = `<clipPath id="rv"><path d="M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}L${f1(c[0])} ${f1(c[1])}L${f1(d[0])} ${f1(d[1])}Z"/></clipPath>`;
    // the luminous front: light where ink turns into steel
    const sx = Math.min(0.99, Math.max(0.01, pr.x / G.B.L));
    const cen = BP(sx, 0.5), wpx = len(sub(BP(sx, 0), BP(sx, 1)));
    const h1 = add(cen, mul(n, wpx * 1.6)), h2 = add(cen, mul(n, -wpx * 1.6));
    const g1 = add(cen, mul(n, wpx * 0.75)), g2 = add(cen, mul(n, -wpx * 0.75));
    front = `<defs><linearGradient id="fg" gradientUnits="userSpaceOnUse" x1="${f1(h1[0])}" y1="${f1(h1[1])}" x2="${f1(h2[0])}" y2="${f1(h2[1])}">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <filter id="fb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>
      <filter id="fb2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter></defs>
      <g class="front"><path d="M${f1(h1[0])} ${f1(h1[1])}L${f1(h2[0])} ${f1(h2[1])}" stroke="url(#fg)" stroke-width="26" filter="url(#fb)" opacity=".9"/>
      <path d="M${f1(h1[0])} ${f1(h1[1])}L${f1(h2[0])} ${f1(h2[1])}" stroke="url(#fg)" stroke-width="7" filter="url(#fb2)" opacity="1"/>
      <path d="M${f1(g1[0])} ${f1(g1[1])}L${f1(g2[0])} ${f1(g2[1])}" stroke="#fff" stroke-width="1.4" opacity="1"/></g>`;
  }

  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('width', W); svg.setAttribute('height', H);
  svg.innerHTML = `<defs>${clip}</defs>
  <g fill="none" stroke="${ink}" stroke-linecap="round" stroke-linejoin="round" ${clip ? 'clip-path="url(#rv)"' : ''}>${parts.join('')}</g>
  <g fill="none" stroke="${ink}" stroke-linecap="round" stroke-linejoin="round" class="annot">${annot.join('')}</g>`;
  const fl = document.getElementById('frontfx');
  if (fl) { fl.setAttribute('viewBox', `0 0 ${W} ${H}`); fl.setAttribute('width', W); fl.setAttribute('height', H); fl.innerHTML = front; }

  // ---- hamon stipple (canvas) ----
  const dpr = opt.dpr || 2;
  canvas.width = W * dpr; canvas.height = H * dpr;
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = ink;
  const rnd = mulberry(7);
  const gauss = () => { let s = 0; for (let i = 0; i < 4; i++) s += rnd(); return (s - 2) / 0.577; };
  const count = opt.dots || 9000;
  for (let i = 0; i < count; i++) {
    const s = 0.012 + 0.985 * rnd();
    const hv = G.hamonV(s);
    let v;
    const pick = rnd();
    if (pick < 0.5) v = hv + gauss() * 0.010 + 0.006;
    else v = hv + (0.965 - hv) * Math.pow(rnd(), 1.7);
    if (s > 0.975 && v > 0.95) continue;
    v = Math.min(0.975, Math.max(hv - 0.02, v));
    const p = G.bladePoint(s, 0, v);
    if (reveal < 1.5 && axialOf(p[0], p[2]) < reveal) continue;
    const sp = P(p[0], p[2]);
    const r = 0.38 + rnd() * 0.42;
    ctx.globalAlpha = 0.28 + rnd() * 0.5;
    ctx.beginPath(); ctx.arc(sp[0], sp[1], r, 0, Math.PI * 2); ctx.fill();
  }
  // a few jinie dots in the ji
  for (let i = 0; i < count * 0.08; i++) {
    const s = 0.02 + 0.95 * rnd(); const v = 0.3 + rnd() * (G.hamonV(s) - 0.33);
    const p = G.bladePoint(s, 0, v);
    if (reveal < 1.5 && axialOf(p[0], p[2]) < reveal) continue;
    const sp = P(p[0], p[2]);
    ctx.globalAlpha = 0.18 + rnd() * 0.25;
    ctx.beginPath(); ctx.arc(sp[0], sp[1], 0.35 + rnd() * 0.25, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  return { Ks, Ts, machi, tip, nS, chordDir, P, PH, BP };
}
