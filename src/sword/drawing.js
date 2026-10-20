// The one drawing generator: every oshigata on the site comes from here, from the same geometry as the 3D sword.
// Pure (no DOM, no three.js): the build calls it for the inline drawings and the flow-mode plates, the boot script
// for the stipple dot list. Drawings are laid along their own axis: svg u runs from the axis origin towards the tip,
// svg v is perpendicular (towards the edge side), 1 svg unit is about 1 px on the 1440 × 900 hero.
import * as G from './geom-core.js';

export const SC = 128; // svg units per sword unit (10 cm)

// ---------- small 2D helpers ----------
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const mul = (a, k) => [a[0] * k, a[1] * k];
const len = (a) => Math.hypot(a[0], a[1]);
const nrm = (a) => mul(a, 1 / (len(a) || 1));
const perp = (a) => [-a[1], a[0]];
const lerp2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

// a similarity from the paper (sword x, z) to svg (u, v): origin O, the axis direction lands on +u
export function frame(O, dirPoint, { sc = SC, extraRot = 0 } = {}) {
  const a = Math.atan2(dirPoint[1] - O[1], dirPoint[0] - O[0]) + extraRot;
  const c = Math.cos(-a), s = Math.sin(-a);
  const f = (p) => { const x = (p[0] - O[0]) * sc, y = (p[1] - O[1]) * sc; return [x * c - y * s, x * s + y * c]; };
  f.angle = a; f.sc = sc;
  return f;
}

// ---------- compact path data: absolute M, then relative l with one decimal ----------
const r1 = (v) => Math.round(v * 10) / 10;
function num(v) { let s = (Math.round(v * 10) / 10).toString(); if (s === '-0') s = '0'; return s.replace(/^(-?)0\./, '$1.'); }
function pair(out, x, y) { const a = num(x), b = num(y); return out + (out && !/[A-Za-z]$/.test(out) && a[0] !== '-' ? ' ' : '') + a + (b[0] === '-' ? '' : ' ') + b; }
export function poly(pts, close = false) {
  if (!pts.length) return '';
  let d = 'M' + num(r1(pts[0][0])) + (r1(pts[0][1]) < 0 ? '' : ' ') + num(r1(pts[0][1]));
  let px = r1(pts[0][0]), py = r1(pts[0][1]), body = '';
  for (let i = 1; i < pts.length; i++) {
    const x = r1(pts[i][0]), y = r1(pts[i][1]);
    if (x === px && y === py) continue;
    body = pair(body, x - px, y - py); px = x; py = y;
  }
  return d + (body ? 'l' + body : '') + (close ? 'Z' : '');
}
function dots(pts) { // zero-length round-capped segments: one path for many dots
  let d = '', px = 0, py = 0, first = true;
  for (const p of pts) {
    const x = r1(p[0]), y = r1(p[1]);
    if (first) { d += 'M' + num(x) + ' ' + num(y) + 'h0'; first = false; } else { d += 'm' + num(x - px) + (y - py < 0 ? '' : ' ') + num(y - py) + 'h0'; }
    px = x; py = y;
  }
  return d;
}
// kissaki-shaped arrowhead: the tip at p, pointing along dir (svg space)
function arrow(p, dir, size = 9) {
  const d = nrm(dir), n = perp(d);
  const back = sub(p, mul(d, size));
  const s1 = add(back, mul(n, size * 0.27)), s2 = add(back, mul(n, -size * 0.12));
  const c = add(sub(p, mul(d, size * 0.35)), mul(n, size * 0.3));
  return `M${num(p[0])} ${num(p[1])}Q${num(c[0])} ${num(c[1])} ${num(s1[0])} ${num(s1[1])}L${num(s2[0])} ${num(s2[1])}Z`;
}
const P = (d, cls, extra = '') => `<path${cls ? ` class="${cls}"` : ''} d="${d}"${extra}/>`;

// ---------- parts of the sword on the paper ----------
// blade outline, spine then edge back; s0 .. s1
function bladeOutline(F, sigma, s0 = 0.006, s1 = 1, n = 120) {
  const sp = [], ed = [];
  const S = sampleS(s0, s1, n);
  for (const s of S) { sp.push(F(G.bp2(s, 0, sigma))); ed.push(F(G.bp2(s, 1, sigma))); }
  return [...sp, ...ed.reverse()];
}
function sampleS(s0, s1, n) {
  // denser in the kissaki, where the outline turns
  const out = [];
  const a = Math.min(s1, G.B.yk), nb = s1 > G.B.yk ? Math.round(n * 0.25) : 0, na = n - nb;
  if (a > s0) for (let i = 0; i <= na; i++) out.push(s0 + (a - s0) * i / na);
  if (nb) for (let i = 1; i <= nb; i++) { const t = i / nb; out.push(Math.max(a, s0) + (s1 - Math.max(a, s0)) * (1 - Math.pow(1 - t, 1.6))); }
  return out;
}
function lineAlong(F, sigma, zfFn, s0, s1, n) { const pts = []; for (let i = 0; i <= n; i++) { const s = s0 + (s1 - s0) * i / n; pts.push(F(G.bp2(s, typeof zfFn === 'function' ? zfFn(s) : zfFn, sigma))); } return pts; }
const H2 = (sigma) => (x, z) => G.hp2(x, z, sigma);

function bladeParts(F, sigma, { s0 = 0.006, s1 = 1, mune = true, hamon = true, cls = {}, broken = false } = {}) {
  const out = [];
  if (broken) { // a detail view: spine and edge only, the cut ends are break lines drawn by the caller
    const o = bladeOutline(F, sigma, s0, s1), h = o.length >> 1;
    out.push(P(poly(o.slice(0, h)) + poly(o.slice(h)), cls.outline || 'k1'));
  } else out.push(P(poly(bladeOutline(F, sigma, s0, s1), true), cls.outline || 'k1'));
  const shEnd = Math.min(s1, 1);
  out.push(P(poly(lineAlong(F, sigma, 0.28, s0, shEnd, 64)), cls.shinogi || 'k3'));
  if (s1 >= G.B.yk && s0 <= G.B.yk) out.push(P(poly([F(G.bp2(G.B.yk, 0.28, sigma)), F(G.bp2(G.B.yk, 1, sigma))]), cls.yokote || 'k3'));
  if (mune) out.push(P(poly(lineAlong(F, sigma, 0.035, s0, s1, 48)), cls.mune || 'k5'));
  if (hamon) out.push(P(poly(lineAlong(F, sigma, (s) => G.hamonV(s), Math.max(s0, 0.012), Math.min(s1, 0.985), 180)), cls.hamon || 'k4 hamon'));
  return out;
}

function koshirae(F, sigma, { tsuka = true, diamonds = true } = {}) {
  const PH = (x, z) => F(G.hp2(x, z, sigma));
  const rect = (x0, x1, z0, z1) => [PH(x0, z0), PH(x1, z0), PH(x1, z1), PH(x0, z1)];
  const out = [];
  const g0 = G.B.w0 / 2 + 0.03;
  out.push(P(poly(rect(...G.H.habaki, -g0, g0), true), 'k2'));
  let d = '';
  for (let i = 0; i < 9; i++) { const x = G.H.habaki[0] + 0.03 + i * 0.034; d += poly([PH(x, -g0 + 0.01), PH(x + 0.05, g0 - 0.01)]); }
  out.push(P(d, 'k6'));
  out.push(P(poly(rect(...G.H.seppa1, -0.112, 0.112), true) + poly(rect(...G.H.seppa2, -0.112, 0.112), true), 'k4'));
  const tR = G.TSUBA_R * 1.03;
  out.push(P(poly(rect(...G.H.tsuba, -tR, tR), true), 'k1'));
  out.push(P(poly(rect(...G.H.fuchi, -0.171, 0.171), true), 'k2'));
  if (tsuka) {
    const [tx0, tx1] = G.H.tsuka;
    const top = [], bot = [];
    for (let i = 0; i <= 40; i++) { const t = i / 40, x = tx0 + (tx1 - tx0) * t, rz = G.tsukaRadii(t)[1]; top.push(PH(x, -rz)); bot.push(PH(x, rz)); }
    out.push(P(poly([...top, ...bot.reverse()], true), 'k2'));
    if (diamonds) out.push(P(tsukaDiamonds(F, sigma), 'k5'));
    const [kx0, kx1] = G.H.kashira; const pts = [];
    for (let i = 0; i <= 16; i++) { const t = i / 16; pts.push(PH(kx0 + (kx1 - kx0) * t, -G.kashiraRadius(t))); }
    for (let i = 16; i >= 0; i--) { const t = i / 16; pts.push(PH(kx0 + (kx1 - kx0) * t, G.kashiraRadius(t))); }
    out.push(P(poly(pts, true), 'k2'));
  }
  return out;
}
// hishimaki: the ribbon edges on the visible upper half of the grip (lattice X = t*nD, Y = ph*2 + .25)
function tsukaDiamonds(F, sigma) {
  const [tx0, tx1] = G.H.tsuka, nD = 10, hw = 0.31;
  const PH = (x, z) => F(G.hp2(x, z, sigma));
  let d = '';
  for (const fam of [1, -1]) for (let m = -6; m <= 16; m++) for (const e of [-hw, hw]) {
    const pts = [];
    for (let j = 0; j <= 8; j++) {
      const ph = 0.5 * (j / 8), Y = ph * 2 + 0.25;
      const X = fam > 0 ? (m + e - Y) : (m + e + Y);
      const t = X / nD; if (t < 0 || t > 1) { if (pts.length) break; else continue; }
      const a = ph * Math.PI * 2; const x = tx0 + (tx1 - tx0) * t;
      pts.push(PH(x, Math.cos(a) * G.tsukaRadii(t)[1]));
    }
    if (pts.length > 1) d += poly(pts);
  }
  return d;
}

// ---------- the stipple: nie and nioi as ink dots, in blade coordinates ----------
// Returns flat arrays; the boot script draws them on canvas#stip, the plates bake them as dots.
export function stipple({ count = 9000, seed = 7, s0 = 0.012, s1 = 0.997 } = {}) {
  const rnd = G.mulberry(seed);
  const gauss = () => { let s = 0; for (let i = 0; i < 4; i++) s += rnd(); return (s - 2) / 0.577; };
  const S = [], V = [], Rr = [], A = [];
  for (let i = 0; i < count; i++) {
    const s = 0.012 + 0.985 * rnd();
    const hv = G.hamonV(s);
    let v;
    if (rnd() < 0.5) v = hv + gauss() * 0.010 + 0.006;
    else v = hv + (0.965 - hv) * Math.pow(rnd(), 1.7);
    const r = 0.38 + rnd() * 0.42, a = 0.28 + rnd() * 0.5;
    if (s > 0.975 && v > 0.95) continue;
    if (s < s0 || s > s1) continue;
    S.push(s); V.push(Math.min(0.975, Math.max(hv - 0.02, v))); Rr.push(r); A.push(a);
  }
  // a few jinie in the ji
  for (let i = 0; i < count * 0.08; i++) {
    const s = 0.02 + 0.95 * rnd(), v = 0.3 + rnd() * (G.hamonV(s) - 0.33);
    const r = 0.35 + rnd() * 0.25, a = 0.18 + rnd() * 0.25;
    if (s < s0 || s > s1) continue;
    S.push(s); V.push(v); Rr.push(r); A.push(a);
  }
  return { s: S, v: V, r: Rr, a: A };
}
function stippleDots(F, sigma, opt) {
  const st = stipple(opt), pts = [];
  for (let i = 0; i < st.s.length; i++) pts.push(F(G.bp2(st.s[i], st.v[i], sigma)));
  return pts;
}

// ---------- polygon simplification (Ramer–Douglas–Peucker on a closed loop) ----------
export function rdpClosed(pts, eps) {
  const rdp = (p) => {
    if (p.length < 3) return p;
    let dmax = 0, idx = 0; const a = p[0], b = p[p.length - 1];
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1e-9;
    for (let i = 1; i < p.length - 1; i++) { const d = Math.abs((p[i][0] - a[0]) * dy - (p[i][1] - a[1]) * dx) / L; if (d > dmax) { dmax = d; idx = i; } }
    return dmax > eps ? rdp(p.slice(0, idx + 1)).slice(0, -1).concat(rdp(p.slice(idx))) : [a, b];
  };
  const h = pts.length >> 1;
  return rdp(pts.slice(0, h + 1)).slice(0, -1).concat(rdp(pts.slice(h).concat([pts[0]])).slice(0, -1));
}

// ---------- the face-on tsuba ----------
// eps: the drawing tolerance in svg units (the traced holes carry raster-level detail a small drawing does not need)
function tsubaFace(holes, tp, { fillHoles = '', eps = 0 } = {}) {
  const out = [];
  const circ = (rr, sx = 1.03, n = 128) => { const pts = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; pts.push(tp([Math.cos(a) * rr * sx, Math.sin(a) * rr])); } return poly(pts, true); };
  out.push(P(circ(G.TSUBA_R), 'k1'));
  out.push(P(circ(0.372, 1.0, 96), 'k6'));
  let d = '';
  for (const h of holes) { const s = h.map(tp); d += poly(eps ? rdpClosed(s, eps) : s, true); }
  d += poly(nakagoAna().map(tp), true);
  if (fillHoles) out.push(P(d, '', fillHoles + ' stroke="none"'));
  out.push(P(d, 'k3 holes'));
  const pts = []; for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2; pts.push(tp([Math.cos(a) * 0.205, Math.sin(a) * 0.112])); }
  out.push(P(poly(pts, true), 'k6 dash2'));
  const c1 = tp([-0.45, 0]), c2 = tp([0.45, 0]), c3 = tp([0, -0.45]), c4 = tp([0, 0.45]);
  out.push(P(poly([c1, c2]) + poly([c3, c4]), 'k6 cl'));
  return out;
}
export function nakagoAna() {
  const pts = [], hz = 0.14, hy = 0.032;
  for (let i = 0; i <= 16; i++) {
    const t = i / 16, z = -hz + 2 * hz * t;
    const y = hy * (1 - Math.pow(Math.max(0, (z + hz * 0.6) / (hz * 1.6)), 2.2)) * Math.min(1, (z + hz) / 0.012 + 0.35);
    pts.push([z, Math.max(0.001, y)]);
  }
  for (let i = 16; i >= 0; i--) { const [z, y] = pts[i]; pts.push([z, -y]); }
  return pts;
}

// ---------- svg wrapper ----------
function bbox(svgParts) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const s of svgParts) {
    // walk the absolute positions of every path in the part
    const re = /d="([^"]*)"/g; let m;
    while ((m = re.exec(s))) {
      let x = 0, y = 0;
      const toks = m[1].match(/[MmLlHhVvQqZz]|-?(?:\d+\.?\d*|\.\d+)/g) || [];
      let cmd = 'M', i = 0, nums = [];
      const flush = () => {};
      for (const t of toks) {
        if (/[A-Za-z]/.test(t)) { cmd = t; nums = []; continue; }
        nums.push(parseFloat(t));
        const need = { M: 2, m: 2, L: 2, l: 2, Q: 4, q: 4, H: 1, h: 1, V: 1, v: 1 }[cmd] || 2;
        if (nums.length < need) continue;
        if (cmd === 'M' || cmd === 'L') { x = nums[0]; y = nums[1]; if (cmd === 'M') cmd = 'L'; }
        else if (cmd === 'm' || cmd === 'l') { x += nums[0]; y += nums[1]; if (cmd === 'm') cmd = 'l'; }
        else if (cmd === 'Q') { x = nums[2]; y = nums[3]; }
        else if (cmd === 'H') x = nums[0]; else if (cmd === 'h') x += nums[0];
        else if (cmd === 'V') y = nums[0]; else if (cmd === 'v') y += nums[0];
        nums = [];
        x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
      }
      void flush; void i;
    }
  }
  return [x0, y0, x1, y1];
}
export function plateSvg(parts, { pad = 24, stroke = '#0F0E0C', defs = '', style = '', box } = {}) {
  const [x0, y0, x1, y1] = box || bbox(parts);
  const vb = [Math.floor(x0 - pad), Math.floor(y0 - pad), Math.ceil(x1 - x0 + 2 * pad), Math.ceil(y1 - y0 + 2 * pad)];
  return {
    width: vb[2], height: vb[3],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" width="${vb[2]}" height="${vb[3]}"><style>${PLATE_CSS(stroke)}${style}</style>${defs ? `<defs>${defs}</defs>` : ''}<g fill="none" stroke="${stroke}" stroke-linecap="round" stroke-linejoin="round">${parts.join('')}</g></svg>`,
  };
}
// stroke weights and opacities, shared by the inline drawings (critical CSS) and the plates
export const WEIGHTS = { k1: [1.15, 0.86], k2: [0.9, 0.8], k3: [0.75, 0.62], k4: [0.6, 0.6], k5: [0.5, 0.4], k6: [0.5, 0.33], d1: [0.7, 0.7], d2: [0.6, 0.55], d3: [0.55, 0.45] };
// the stroke classes: the same rules in the plates (scope '') and in the inline svg#osh (scope '#osh ')
export const strokeCss = (stroke, scope = '') => Object.entries(WEIGHTS).map(([k, [w, o]]) => `${scope}.${k}{stroke-width:${w};opacity:${o}}`).join('') +
  `${scope}.cl{stroke-dasharray:14 3 1.5 3}${scope}.dash{stroke-dasharray:2 3}${scope}.dash2{stroke-dasharray:2 2}${scope}.hid{stroke-dasharray:5 3}${scope}.dot{stroke-width:1.1;opacity:.55}${scope}.fill{fill:${stroke};stroke:none}`;
const PLATE_CSS = (stroke) => strokeCss(stroke);

// =====================================================================================================
// The inline drawings (inside svg#osh), laid along their own axis with the origin at the kashira end K.
// =====================================================================================================

// The hero oshigata (B0 and the 1 s poster). Returns svg parts, the label anchors and the viewBox.
export function hero(holes) {
  const sigma = 1;
  const { K, T } = G.axisEnds(sigma);
  const F = frame(K, T);
  const LKT = len(sub(T, K)) * SC;
  const parts = [];
  const blade = bladeParts(F, sigma, { hamon: true });
  parts.push(`<g class="o-blade">${blade.join('')}</g>`);
  parts.push(`<g class="o-kosh">${koshirae(F, sigma).join('')}</g>`);
  const axisDir = [1, 0];
  const Ks = [0, 0], Ts = [LKT, 0];
  const annot = [];
  annot.push(P(poly([sub(Ks, mul(axisDir, 26)), add(Ts, mul(axisDir, 22))]), 'k6 cl'));
  // nagasa: the chord from the machi (s = 0, spine) to the tip, offset towards the spine side
  const machi = F(G.bp2(0, 0, sigma)), tip = F(G.bp2(1, 0, sigma));
  const chordDir = nrm(sub(tip, machi));
  const nS = nrm(sub(F(G.bp2(0.5, 0, sigma)), F(G.bp2(0.5, 1, sigma))));
  const off = 58;
  const a = add(machi, mul(nS, off)), b = add(tip, mul(nS, off));
  const dimL = [];
  dimL.push(P(poly([add(machi, mul(nS, 8)), add(a, mul(nS, 7))]) + poly([add(tip, mul(nS, 8)), add(b, mul(nS, 7))]), 'd2'));
  dimL.push(P(poly([a, b]), 'd1'));
  dimL.push(P(arrow(a, sub(a, b)) + arrow(b, sub(b, a)), 'fill o-arrow'));
  annot.push(`<g class="l-only">${dimL.join('')}</g>`);
  const chAng = Math.atan2(chordDir[1], chordDir[0]) * 180 / Math.PI;
  const labels = [];
  labels.push({ key: 'nagasa', at: add(mul(add(a, b), 0.5), mul(nS, 9)), rot: chAng, anchor: 'middle', html: '<b lang="ja">刃長</b> NAGASA 70.0', cls: 'l-only' });
  // sori: the chord, and the deepest point of the spine
  annot.push(P(poly([machi, tip]), 'd3 dash'));
  let best = 0, bpS = null, bc = null;
  for (let i = 1; i < 200; i++) {
    const p = F(G.bp2(i / 200, 0, sigma)), q = sub(p, machi), along = q[0] * chordDir[0] + q[1] * chordDir[1];
    const c = add(machi, mul(chordDir, along)), dd = len(sub(p, c));
    if (dd > best) { best = dd; bpS = p; bc = c; }
  }
  annot.push(P(poly([bc, bpS]), 'd1'));
  annot.push(P(arrow(bpS, sub(bpS, bc), 7), 'fill o-arrow'));
  const lead = add(bc, mul(nS, 30));
  annot.push(P(poly([bc, lead]), 'd3'));
  labels.push({ key: 'sori', at: add(add(lead, mul(chordDir, 6)), mul(nS, -1)), rot: chAng, anchor: 'start', html: '<b lang="ja">反り</b> SORI 1.8', cls: 'l-only' });
  // portrait: the drawing stands up the right third and the h1 sits top-left, so the label moves down the chord
  const leadP = add(add(machi, mul(chordDir, len(sub(tip, machi)) * 0.3)), mul(nS, 30));
  labels.push({ key: 'sori-p', at: leadP, rot: chAng, anchor: 'start', html: '<b lang="ja">反り</b> SORI 1.8', cls: 'p-only' });
  parts.push(`<g class="o-annot">${annot.join('')}</g>`);

  // the face-on tsuba, placed where the prototype placed it on the 1440 × 900 hero: centre (292, 232), r 86
  const ref = refPlacement(1440, 900, 'land');
  const toSvg = (px) => { const d = sub(px, ref.Ks), c = Math.cos(-ref.ang), s = Math.sin(-ref.ang); return mul([d[0] * c - d[1] * s, d[0] * s + d[1] * c], 1 / ref.k); };
  const dc = toSvg([292, 232]), dr = 86 / ref.k;
  const kk = dr / (G.TSUBA_R * 1.03);
  const tp = ([u, v]) => [dc[0] + u * kk, dc[1] - v * kk];
  const det = tsubaFace(holes, tp, { eps: 0.45 });
  // the leader runs from the circle towards the drawn tsuba
  const tR = G.TSUBA_R * 1.03;
  const tsMid = F(G.hp2((G.H.tsuba[0] + G.H.tsuba[1]) / 2, -tR, sigma));
  const ld = nrm(sub(tsMid, dc));
  const from = add(dc, mul(ld, dr + 4));
  parts.push(`<g id="osh-detail" class="l-only"><g class="o-face">${det.join('')}</g>${P(poly([from, tsMid]), 'd3')}<circle class="fill" cx="${num(tsMid[0])}" cy="${num(tsMid[1])}" r="1.8"/></g>`);
  labels.push({ key: 'tsuba', at: toSvg([392, 336]), rot: 'screen', anchor: 'start', html: '<b lang="ja">鍔</b> TSUBA <i>girih</i>', cls: 'l-only' });

  // every solid line gets pathLength=1 so the intro can ink it with one dash (dashed lines keep their own pattern)
  const withLength = parts.map((g) => g.replace(/<path class="(k\d[^"]*)"/g, (m, c) => (/\b(cl|dash|dash2|hid)\b/.test(c) ? m : `<path pathLength="1" class="${c}"`)));
  return { parts: withLength, labels, LKT, faceCentre: dc };
}

// The ink plan of the clay-coated blade for B7 (white ink on the forge table): straight blade with its tang.
export function plan() {
  const sigma = 0;
  const machi = G.bp2(0, 0, sigma), tipP = G.bp2(1, 0, sigma);
  const F = frame(machi, tipP);
  const out = [];
  out.push(P(poly(bladeOutline(F, sigma), true), 'k1'));
  out.push(P(poly(lineAlong(F, sigma, 0.28, 0.006, 1, 80)), 'k3'));
  out.push(P(poly(lineAlong(F, sigma, (s) => G.hamonV(s), 0.012, 0.985, 200)), 'k2'));
  out.push(P(poly(nakagoPts(F, sigma), true), 'k2'));
  const tip = F(G.bp2(1, 0, sigma)), m0 = F(G.bp2(0, 0, sigma));
  const nS = [0, -1];
  const a = add(m0, mul(nS, 46)), b = add(tip, mul(nS, 46));
  out.push(P(poly([a, b]), 'd1'), P(arrow(a, sub(a, b)) + arrow(b, sub(b, a)), 'fill'));
  // one yakiba width at the monouchi (s = .78): from the edge to the hamon
  const sM = 0.78, e = F(G.bp2(sM, 1, sigma)), h = F(G.bp2(sM, G.hamonV(sM), sigma));
  out.push(P(poly([add(e, [0, 22]), e]) + poly([h, add(h, [0, -14])]), 'd3'), P(arrow(e, [0, -1], 6) + arrow(h, [0, 1], 6), 'fill'));
  return { parts: out, labels: [{ key: 'plan', at: add(mul(add(a, b), 0.5), [0, -8]), rot: 0, anchor: 'middle', html: '70.0' }] };
}
function nakagoPts(F, sigma) {
  const { top, bot } = G.nakagoOutline(20);
  const PH = (x, z) => F(G.hp2(x, z, sigma));
  return [...top.map(([x, z]) => PH(x, z)), ...bot.reverse().map(([x, z]) => PH(x, z))];
}

// The mounted sword in its saya (the bookend, B22), laid along the axis from the kashira end K to the kojiri J.
export function sayaDrawing(F0) {
  const sigma = 1;
  const { K } = G.axisEnds(sigma), J = G.kojiriEnd(sigma);
  const F = F0 || frame(K, J);
  const out = [...koshirae(F, sigma)];
  out.push(...sayaParts(F, sigma));
  return { parts: out, LKJ: len(sub(J, K)) * SC };
}
function sayaParts(F, sigma) {
  const out = [];
  const x0 = G.H.habaki[1] + 0.005; // the koiguchi starts at the front of the habaki
  const s1 = 1 + G.SAYA.longer / G.L_STRAIGHT;
  const hw = (s) => 0.5 * (G.B.w0 + G.SAYA.wider) * (1 - 0.18 * Math.min(1, Math.max(0, s)));
  const centre = (s) => { const c = G.spine(Math.min(s, 1), sigma); const ex = s > 1 ? (s - 1) * G.L_STRAIGHT : 0; const w = G.width(Math.min(s, G.B.yk)) * 0.5; return [c.x + c.tx * ex + c.nx * w, c.z + c.tz * ex + c.nz * w]; };
  const nrmAt = (s) => { const c = G.spine(Math.min(s, 1), sigma); return [c.nx, c.nz]; };
  const sStart = x0 / G.L_STRAIGHT;
  const top = [], bot = [];
  const N = 70;
  for (let i = 0; i <= N; i++) {
    const s = sStart + (s1 - sStart) * i / N;
    let w = hw(s);
    const q = (s - (s1 - 0.035)) / 0.035; if (q > 0) w *= Math.sqrt(Math.max(0, 1 - q * q)); // the kojiri rounds off
    const c = centre(s), n = nrmAt(s);
    top.push(F(add(c, mul(n, -w)))); bot.push(F(add(c, mul(n, w))));
  }
  out.push(P(poly([...top, ...bot.reverse()], true), 'k1'));
  // koiguchi (horn mouth), the bengara band behind it, the kojiri cap line
  const across = (s, k = 1) => { const c = centre(s), n = nrmAt(s), w = hw(s) * k; return poly([F(add(c, mul(n, -w))), F(add(c, mul(n, w)))]); };
  out.push(P(across(sStart + 0.012) + across(sStart + 0.035), 'k3'));
  out.push(P(across(s1 - 0.06), 'k4'));
  // kurikata: a small knob on the omote face, a third of the way from the mouth
  const sk = sStart + 0.055, c = centre(sk), n = nrmAt(sk), t = [n[1], -n[0]];
  const kp = [add(add(c, mul(n, -hw(sk) * 1.25)), mul(t, -0.08)), add(add(c, mul(n, -hw(sk) * 1.25)), mul(t, 0.08)), add(add(c, mul(n, -hw(sk) * 0.85)), mul(t, 0.1)), add(add(c, mul(n, -hw(sk) * 0.85)), mul(t, -0.1))];
  out.push(P(poly(kp.map(F), true), 'k3'));
  // the sori of the lacquer: one long highlight line
  out.push(P(poly(Array.from({ length: 31 }, (_, i) => { const s = sStart + 0.05 + (s1 - sStart - 0.12) * i / 30; return F(add(centre(s), mul(nrmAt(s), -hw(s) * 0.45))); })), 'k6'));
  return out;
}

// where the hero drawing lies on a viewport (the same numbers as the build-emitted CSS and the boot script)
export const ANCHORS = { land: { K: [0.072, 0.698], T: [0.921, 0.258] }, port: { K: [0.626, 0.955], T: [0.856, 0.123] } };
export function refPlacement(W, H, layout = W / H >= 1.2 ? 'land' : 'port') {
  const A = ANCHORS[layout];
  const Ks = [A.K[0] * W, A.K[1] * H], Ts = [A.T[0] * W, A.T[1] * H];
  const { K, T } = G.axisEnds(1);
  const L = len(sub(T, K)) * SC;
  return { Ks, Ts, ang: Math.atan2(Ts[1] - Ks[1], Ts[0] - Ks[0]), k: len(sub(Ts, Ks)) / L, layout };
}

// =====================================================================================================
// Flow-mode plates (<img> SVG files, no <text>): one per scene
// =====================================================================================================
const INK = { sumi: '#0F0E0C', washi: '#ECE6DA', shiro: '#E9E2D3' };

// 銘 promise: the kissaki, magnified and level, with its nie stipple
export function plateKissaki() {
  const sigma = 1, s0 = 0.62, F = frame(G.bp2(s0, 0.5, sigma), G.bp2(1, 0.5, sigma), { sc: SC * 3.3 });
  const parts = bladeParts(F, sigma, { s0, s1: 1, hamon: false, broken: true });
  parts.push(P(dots(stippleDots(F, sigma, { count: 6500, s0 })), 'dot'));
  // the cut end on the left is drawn as a break line, as on a detail view
  const a = F(G.bp2(s0, -0.12, sigma)), b = F(G.bp2(s0, 1.12, sigma));
  parts.push(P(poly(zigzag(a, b, 5, 7)), 'k4'));
  const tip = F(G.bp2(1, 0, sigma));
  return { ...plateSvg(parts, { stroke: INK.sumi, pad: 30 }), anchors: { tip } };
}
function zigzag(a, b, n, amp) {
  const d = sub(b, a), nn = nrm(perp(d)), pts = [a];
  for (let i = 1; i < n; i++) pts.push(add(lerp2(a, b, i / n), mul(nn, (i % 2 ? 1 : -1) * amp)));
  pts.push(b); return pts;
}

// 映 a blade section: the steel river with its hamon, and the cross-section A–A beside it
export function plateUtsuri() {
  const sigma = 1, O = G.bp2(0.08, 0.5, sigma), F = frame(O, G.bp2(0.78, 0.5, sigma), { sc: SC * 1.45, extraRot: 18 * Math.PI / 180 });
  const parts = bladeParts(F, sigma, { s0: 0.08, s1: 0.78, hamon: false, broken: true });
  parts.push(P(dots(stippleDots(F, sigma, { count: 3800, s0: 0.08, s1: 0.78 })), 'dot'));
  // break lines at both ends
  parts.push(P(poly(zigzag(F(G.bp2(0.08, -0.06, sigma)), F(G.bp2(0.08, 1.06, sigma)), 5, 6)) + poly(zigzag(F(G.bp2(0.78, -0.06, sigma)), F(G.bp2(0.78, 1.06, sigma)), 5, 6)), 'k4'));
  // the section plane at s = .42: heavy ticks outside the outline, a hairline across
  const sA = 0.42, e0 = F(G.bp2(sA, -0.55, sigma)), e1 = F(G.bp2(sA, 1.55, sigma));
  parts.push(P(poly([e0, F(G.bp2(sA, -0.2, sigma))]) + poly([e1, F(G.bp2(sA, 1.2, sigma))]), 'k1'));
  parts.push(P(poly([F(G.bp2(sA, -0.2, sigma)), F(G.bp2(sA, 1.2, sigma))]), 'k6 dash2'));
  // the cross-section, magnified, standing under the blade with a leader to its plane
  const w = G.width(sA), k = G.thick(sA), mag = SC * 1.45 * 4.2;
  const C = add(F(G.bp2(sA, 1, sigma)), [260, 150]);
  parts.push(P(poly([add(e1, [6, 4]), add(C, [-w * mag * 0.5 - 18, -6])]), 'k6'));
  const prof = G.PROFILE_TOP.map(([yf, zf]) => [zf * w, yf * k]);
  const sec = [...prof.map(([z, y]) => [z, -y]), ...prof.slice(1, -1).reverse().map(([z, y]) => [z, y])].map(([z, y]) => add(C, mul([z - w / 2, y], mag)));
  parts.push(P(poly(sec, true), 'k1'));
  parts.push(P(poly([add(C, mul([-w / 2 - 0.03, 0], mag)), add(C, mul([w / 2 + 0.03, 0], mag))]), 'k6 cl'));
  // shinogi height marks
  const shz = (0.28 - 0.5) * w * mag;
  parts.push(P(poly([add(C, [shz, -k * 0.5 * mag - 6]), add(C, [shz, k * 0.5 * mag + 6])]), 'k6 dash2'));
  return plateSvg(parts, { stroke: INK.washi, pad: 28 });
}

// 焼 the four steps, in white ink on the forge table and in the water
function straightBlade(F, sigma, opt = {}) { return [...bladeParts(F, sigma, { hamon: false, mune: false, ...opt }), P(poly(nakagoPts(F, sigma), true), 'k2')]; }
export function plateYaki(step) {
  const sigma = step === 4 ? 1 : 0;
  const machi = G.bp2(0, 0.5, sigma), tip = G.bp2(1, 0.5, sigma);
  const rot = step === 3 ? -24 * Math.PI / 180 : 0; // the quench plate: the tip goes down into the water, to the lower right
  const F = frame(machi, tip, { sc: SC * 1.05, extraRot: rot });
  const parts = [];
  const rnd = G.mulberry(40 + step);
  if (step === 1) {
    // 土 the clay: thick on the spine, a thin wash on the edge, the wavy boundary is the future hamon, ashi lines across it
    parts.push(...straightBlade(F, sigma));
    const bnd = lineAlong(F, sigma, (s) => G.hamonV(s), 0.01, 0.985, 220);
    parts.push(P(poly(bnd), 'k1'));
    let d = '';
    for (let i = 0; i < 520; i++) { // clay texture: short lumpy strokes on the spine side
      const s = 0.01 + 0.97 * rnd(), v = 0.04 + (G.hamonV(s) - 0.07) * rnd();
      const p = F(G.bp2(s, v, sigma)), ang = rnd() * Math.PI, l = 1.2 + rnd() * 2.4;
      d += poly([p, add(p, [Math.cos(ang) * l, Math.sin(ang) * l])]);
    }
    parts.push(P(d, 'k6'));
    let ashi = '';
    for (let s = 0.03; s < 0.95; s += 0.024 + rnd() * 0.012) { // hand-laid ashi: uneven spacing, uneven length
      const hv = G.hamonV(s), v1 = Math.min(0.97, hv + 0.08 + rnd() * 0.12);
      ashi += poly([F(G.bp2(s, hv - 0.01, sigma)), F(G.bp2(s + 0.004 * (rnd() - 0.3), v1, sigma))]);
    }
    parts.push(P(ashi, 'k4'));
  } else if (step === 2) {
    // 火 the heat: hatching runs from the tang towards the tip and thins out at the front
    parts.push(...straightBlade(F, sigma));
    const front = 0.72;
    let d = '';
    for (let s = 0.0; s < 0.995; ) {
      const dens = s < front ? 1 : Math.max(0, 1 - (s - front) / 0.18);
      if (dens <= 0) break;
      const w = G.width(s);
      const a = F(G.bp2(s, -0.02, sigma)), b = F(G.bp2(s + 0.04 * w, 1.02, sigma));
      if (rnd() < dens) d += poly([a, b]);
      s += 0.0065 + (1 - dens) * 0.01;
    }
    parts.push(P(d, 'k5'));
    // the front: a soft double line
    parts.push(P(poly([F(G.bp2(front + 0.09, -0.1, sigma)), F(G.bp2(front + 0.09, 1.1, sigma))]), 'k6 dash2'));
  } else if (step === 3) {
    // 水 the quench: plunged on −24°, half under the waterline; under water the boundary is the hamon
    const water = 0.55; // the blade fraction above the surface
    const all = straightBlade(F, sigma);
    parts.push(...all);
    const sW = 1 - water;
    const pW = F(G.bp2(sW, 0.5, sigma));
    const y = pW[1];
    const bx = bbox(all);
    parts.push(P(poly([[bx[0] - 60, y], [bx[2] + 80, y]]), 'k2'));
    // rings spreading from the entry
    for (let i = 1; i <= 3; i++) {
      const rx = 14 + i * 22, ry = rx * 0.16, pts = [];
      for (let j = 0; j <= 40; j++) { const a = j / 40 * Math.PI * 2; pts.push([pW[0] + Math.cos(a) * rx, y + Math.sin(a) * ry]); }
      parts.push(P(poly(pts, true), i === 1 ? 'k4' : 'k6'));
    }
    // the hamon, only where the steel is under the surface: in the plate, the blade's tip end is down
    const under = lineAlong(F, sigma, (s) => G.hamonV(s), 0.012, 0.985, 220).filter((p) => p[1] > y + 1);
    parts.push(P(poly(under), 'k1'));
    // water: rows of short dashes under the surface, thinning with depth
    let d = '';
    for (let i = 0; i < 7; i++) {
      const yy = y + 12 + i * 11, n = 7 - i;
      for (let j = 0; j < n; j++) { const x0 = bx[0] - 40 + (bx[2] - bx[0] + 100) * (j + 0.2 + 0.6 * rnd()) / n; d += poly([[x0, yy], [x0 + 18 + rnd() * 26, yy]]); }
    }
    parts.push(P(d, 'k6'));
  } else {
    // 反 the curve: the blade has bent in the water; the straight blade it was is drawn as a hidden line
    const F0 = frame(G.bp2(0, 0.5, 0), G.bp2(1, 0.5, 0), { sc: SC * 1.05 });
    parts.push(P(poly(bladeOutline(F0, 0), true), 'k6 hid'));
    parts.push(...bladeParts(F, sigma, { hamon: false, mune: false }), P(poly(nakagoPts(F, sigma), true), 'k2'));
    parts.push(P(poly(lineAlong(F, sigma, (s) => G.hamonV(s), 0.012, 0.985, 200)), 'k3'));
    const m0 = F(G.bp2(0, 0, sigma)), t1 = F(G.bp2(1, 0, sigma));
    parts.push(P(poly([m0, t1]), 'd3 dash'));
    let best = 0, bp = null, bc = null; const cd = nrm(sub(t1, m0));
    for (let i = 1; i < 100; i++) { const p = F(G.bp2(i / 100, 0, sigma)), q = sub(p, m0), al = q[0] * cd[0] + q[1] * cd[1], c = add(m0, mul(cd, al)), dd = len(sub(p, c)); if (dd > best) { best = dd; bp = p; bc = c; } }
    const bcU = add(bc, mul(nrm(sub(bc, bp)), 16));
    parts.push(P(poly([bcU, bp]), 'd1'), P(arrow(bp, sub(bp, bc), 7) + arrow(bc, sub(bc, bp), 7), 'fill'));
  }
  const ink = step >= 3 ? INK.shiro : INK.shiro;
  return plateSvg(parts, { stroke: ink, pad: 26 });
}

// 研 the polish: the left half mirror-polished (stipple), the right half still stone-scratched (hatching at 30°)
export function plateTogi() {
  const sigma = 1, F = frame(G.bp2(0, 0.5, sigma), G.bp2(1, 0.5, sigma), { sc: SC * 1.02, extraRot: 18 * Math.PI / 180 });
  const parts = bladeParts(F, sigma, { hamon: false });
  parts.push(P(poly(nakagoPts(F, sigma), true), 'k2'));
  const front = 0.52;
  parts.push(P(dots(stippleDots(F, sigma, { count: 4800, s1: front })), 'dot'));
  // stone scratches: short parallel strokes at 30° to the axis, inside the outline, ahead of the front
  const rnd = G.mulberry(17);
  let d = '';
  const ax = nrm(sub(F(G.bp2(1, 0.5, sigma)), F(G.bp2(0, 0.5, sigma)))), dir = [ax[0] * Math.cos(Math.PI / 6) - ax[1] * Math.sin(Math.PI / 6), ax[0] * Math.sin(Math.PI / 6) + ax[1] * Math.cos(Math.PI / 6)];
  for (let i = 0; i < 560; i++) {
    const s = front + 0.012 + (0.995 - front) * rnd(), v = 0.06 + 0.9 * rnd();
    if (s > G.B.yk && v > 0.8) continue;
    const p = F(G.bp2(s, v, sigma)), l = 2 + rnd() * 5;
    d += poly([sub(p, mul(dir, l / 2)), add(p, mul(dir, l / 2))]);
  }
  parts.push(P(d, 'k6'));
  // the wet front of the polish
  parts.push(P(poly([F(G.bp2(front, -0.02, sigma)), F(G.bp2(front, 1.02, sigma))]), 'k2'));
  parts.push(P(poly(lineAlong(F, sigma, (s) => G.hamonV(s), front, 0.985, 80)), 'k5'));
  return plateSvg(parts, { stroke: INK.sumi, pad: 26 });
}

// 鍔 the guard as iron, face-on, lit from behind: a kurogane plate with its ishime (stone-hammered) surface and a
// worn, brighter mimi rim with a gilt inlay line; the lamp shows only through the piercings: the girih openwork and
// the nakago-ana, a through-hole like them (the guard is shown alone). The seppa-dai around it is iron, as on the real guard.
// The girih's centre opening is a ring: the traced polygon is its outer loop, the iron disc of rI is its inner one.
export const GIRIH_DISC = 0.155 + 0.0165 / 2; // rI plus half a strap (scripts/girih.mjs)
export function plateTsuba(holes) {
  const k = 520, tp = ([u, v]) => [u * k, -v * k];
  const R = G.TSUBA_R, SX = 1.03;
  const ell = (rr, sx = SX, n = 160) => { const pts = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; pts.push(tp([Math.cos(a) * rr * sx, Math.sin(a) * rr])); } return poly(pts, true); };
  const holeD = holes.map((h) => poly(rdpClosed(h.map(tp), 0.3), true)).join('');
  const disc = ell(GIRIH_DISC, 1, 96), ana = poly(nakagoAna().map(tp), true);
  const rnd = G.mulberry(1418);
  const f2 = (v) => (Math.round(v * 100) / 100).toString().replace(/^(-?)0\./, '$1.');
  // ishime: two dot tiles of coprime sizes laid over each other, so the hammering never shows a repeat
  const tile = (id, size, n) => {
    let c = '';
    for (let i = 0; i < n; i++) {
      const x = rnd() * size, y = rnd() * size, r = 0.4 + rnd() * rnd() * 1.25, lit = rnd() < 0.36;
      const fill = lit ? '#BFA27A' : '#070605', op = lit ? 0.12 + rnd() * 0.3 : 0.3 + rnd() * 0.4;
      // a dot over a tile edge is drawn again on the opposite edge, so the tiles join without a cut
      const wx = x < r ? size : x > size - r ? -size : 0, wy = y < r ? size : y > size - r ? -size : 0;
      for (const ox of wx ? [0, wx] : [0]) for (const oy of wy ? [0, wy] : [0]) c += `<circle cx="${f2(x + ox)}" cy="${f2(y + oy)}" r="${f2(r)}" fill="${fill}" fill-opacity="${f2(op)}"/>`;
    }
    return `<pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse">${c}</pattern>`;
  };
  // each outline once, in <defs>; the layers <use> them with their own paint
  const ironD = ell(R) + holeD + disc + ana, rimD = ell(R) + ell(0.366);
  // tL: the openwork, the centre ring (its outer loop minus the disc) and the nakago-ana inside the disc, by even-odd
  const shapes = `<path id="tL" d="${holeD + disc + ana}" fill-rule="evenodd"/><path id="tI" d="${ironD}" fill-rule="evenodd"/><path id="tR" d="${rimD}" fill-rule="evenodd"/>`;
  const defs =
    // the lamp behind the guard, seen through the openwork: warm white at the centre, amber at the outer piercings
    '<radialGradient id="lamp" cx="-14" cy="-22" r="225" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFF7E8"/><stop offset=".55" stop-color="#FCE6C0"/><stop offset="1" stop-color="#EDB878"/></radialGradient>' +
    // the iron: kurogane, a little lighter where the front light falls (top left)
    '<radialGradient id="iron" cx="-90" cy="-110" r="330" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3A332C"/><stop offset=".55" stop-color="#2A2521"/><stop offset="1" stop-color="#191614"/></radialGradient>' +
    // the mimi: the rim, polished by handling, brightest where the light falls
    '<linearGradient id="mimi" x1="-160" y1="-190" x2="150" y2="200" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#9A8263"/><stop offset=".35" stop-color="#5E4F3F"/><stop offset=".7" stop-color="#352D26"/><stop offset="1" stop-color="#4E4134"/></linearGradient>' +
    tile('ishA', 41, 84) + tile('ishB', 59, 170) + shapes;
  const use = (id, attrs) => `<use href="#${id}"${attrs}/>`;
  const parts = [];
  // the light, only where the piercings are (the openwork, the ring of the centre opening, the nakago-ana)
  parts.push(use('tL', ' fill="url(#lamp)" stroke="none"'));
  // the iron plate: the disc minus the openwork; the centre disc back in; the nakago-ana out again
  parts.push(use('tI', ' fill="url(#iron)" stroke="none"'), use('tI', ' fill="url(#ishA)" stroke="none"'), use('tI', ' fill="url(#ishB)" stroke="none"'));
  // the mimi band and its gilt inlay line
  parts.push(use('tR', ' fill="url(#mimi)" stroke="none"'), use('tR', ' fill="url(#ishB)" stroke="none"'));
  parts.push(P(ell(0.3715, SX, 128), '', ' stroke="#C9A063" stroke-width="1.1" stroke-opacity=".55"'));
  // the walls of the piercings, the nakago-ana's among them, warmed by the light that passes them
  parts.push(use('tL', ' stroke="#F3CD92" stroke-width="1.3" stroke-opacity=".5"'));
  // the seppa-dai (dashed, the drawing convention) and the centre marks outside the rim
  const sp = []; for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2; sp.push(tp([Math.cos(a) * 0.205, Math.sin(a) * 0.112])); }
  parts.push(P(poly(sp, true), 'k6 dash2', ' stroke="#B49A76"'));
  const cm = [[[-0.47, 0], [-0.41, 0]], [[0.41, 0], [0.47, 0]], [[0, -0.47], [0, -0.41]], [[0, 0.41], [0, 0.47]]];
  parts.push(P(cm.map(([a, b]) => poly([tp(a), tp(b)])).join(''), 'k6'));
  const e = 0.48 * k;
  return plateSvg(parts, { stroke: INK.washi, pad: 0, defs, box: [-e, -e, e, e] });
}

// 納 the mounted sword in its saya, level
export function plateNoto() {
  const sigma = 1, { K } = G.axisEnds(sigma), J = G.kojiriEnd(sigma);
  const F = frame(K, J, { sc: SC * 0.92 });
  const { parts } = sayaDrawing(F);
  return plateSvg(parts, { stroke: INK.washi, pad: 24 });
}

// 404: the tip of a blade, broken off
export function plateBroken() {
  const sigma = 1, F = frame(G.bp2(0.5, 0.5, sigma), G.bp2(1, 0.5, sigma), { sc: SC * 2.2, extraRot: 18 * Math.PI / 180 });
  const sb = 0.8, rnd = G.mulberry(404);
  // the break: a jagged line across the blade at s = .8, the same line on both pieces
  const brk = []; for (let i = 0; i <= 9; i++) { const v = -0.0 + i / 9; brk.push([sb + (rnd() - 0.5) * 0.012 + (i % 2 ? 0.004 : -0.004), v]); }
  const main = [], frag = [];
  for (let i = 0; i <= 60; i++) { const s = 0.5 + (sb - 0.5) * i / 60; main.push(G.bp2(s, 0, sigma)); }
  for (const [s, v] of brk) main.push(G.bp2(s, v, sigma));
  for (let i = 60; i >= 0; i--) { const s = 0.5 + (sb - 0.5) * i / 60; main.push(G.bp2(s, 1, sigma)); }
  for (const [s, v] of brk) frag.push(G.bp2(s, v, sigma));
  for (let i = 0; i <= 50; i++) { const s = sb + (1 - sb) * (1 - Math.pow(1 - i / 50, 1.5)); frag.push(G.bp2(s, 1, sigma)); }
  for (let i = 50; i >= 0; i--) { const s = sb + (1 - sb) * (1 - Math.pow(1 - i / 50, 1.5)); frag.push(G.bp2(s, 0, sigma)); }
  const parts = [];
  parts.push(P(poly(main.map(F), true), 'k1'));
  parts.push(P(poly(lineAlong(F, sigma, 0.28, 0.5, sb - 0.01, 30)), 'k3'));
  parts.push(P(poly(lineAlong(F, sigma, (s) => G.hamonV(s), 0.5, sb - 0.008, 60)), 'k4'));
  parts.push(P(poly(zigzag(F(G.bp2(0.5, -0.06, sigma)), F(G.bp2(0.5, 1.06, sigma)), 5, 6)), 'k4'));
  // the fragment lies a little apart, turned as it fell
  const c = F(G.bp2(0.9, 0.5, sigma)), ang = 0.09, off = [26, 14];
  const Rt = (p) => { const d = sub(p, c), co = Math.cos(ang), si = Math.sin(ang); return add(add(c, [d[0] * co - d[1] * si, d[0] * si + d[1] * co]), off); };
  parts.push(P(poly(frag.map(F).map(Rt), true), 'k1'));
  parts.push(P(poly(lineAlong(F, sigma, 0.28, sb + 0.01, G.B.yk, 12).map(Rt)) + poly([F(G.bp2(G.B.yk, 0.28, sigma)), F(G.bp2(G.B.yk, 1, sigma))].map(Rt)), 'k3'));
  return plateSvg(parts, { stroke: INK.sumi, pad: 26 });
}
