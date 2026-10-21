// The oshigata drawings of the appraisal (SOLUTIONS-SPEC §3.3.6), as SVG strings: pure, no DOM, so the build draws
// the blank form into the HTML and the page draws each estimate with the same code.
//   bladePlate()  a solution's blade: its length is its timeline on the shared weeks scale, the hamon is its
//                 difficulty, dimension lines carry the MVP and full weeks
//   hamonStrip()  the difficulty meter: the same temper line over 120 × 14
//   blankForm()   the empty appraisal form of the empty state (the no-JS view too)
//   ganttBlade()  a blade silhouette for the plan's rows
// Line weights follow the drawing vocabulary (k1 outline … k5 plan dash); arrowheads are kissaki, never glyphs.
import { mulberry, fbm1, width as bladeWidth, B } from '../sword/geom-core.js';

const r1 = (v) => Math.round(v * 10) / 10;
const pts = (a) => a.map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L');
export const seedOf = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h >>> 0; };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---- the five temper lines (v: 0 spine … 1 edge), irregular by seed, never pure sines ----
export const HAMON_NAMES = ['suguha', 'notare', 'gunome', 'choji', 'midare'];
export function hamonFn(difficulty, seed) {
  const rnd = mulberry(seed || 1), o = rnd() * 100;
  const clay = (s) => 0.012 * (fbm1(o + s * 9) - 0.5); // the low-frequency unevenness of hand-laid clay
  const d = Math.min(5, Math.max(1, difficulty | 0));
  if (d === 1) return (s) => 0.72 + 0.016 * (fbm1(o + s * 40) - 0.5) + clay(s);
  if (d === 2) {
    const P = 0.25 + rnd() * 0.15, ph = rnd() * 6.28;
    return (s) => 0.68 + 0.04 * Math.sin(6.283 * s / P + ph + 0.8 * (fbm1(o + s * 3) - 0.5)) + clay(s);
  }
  // gunome and chōji: a row of heads with jittered spacing and height
  const heads = [];
  let x = rnd() * 0.04;
  const sharp = d === 4;
  while (x < 1.05) {
    const w = (sharp ? 0.035 : 0.05) + rnd() * (sharp ? 0.03 : 0.03);
    const cluster = sharp && rnd() < 0.35;
    heads.push({ c: x + w / 2, w, h: (sharp ? 0.1 : 0.05) + rnd() * (sharp ? 0.08 : 0.035) });
    x += w * (cluster ? 0.55 : 1) + (sharp ? rnd() * 0.02 : 0);
  }
  const headAt = (s) => { let v = 0; for (const h of heads) { const t = (s - (h.c - h.w / 2)) / h.w; if (t >= 0 && t <= 1) v = Math.max(v, h.h * (sharp ? Math.pow(Math.sin(Math.PI * t), 0.55) : Math.sin(Math.PI * t))); } return v; };
  if (d === 3) return (s) => 0.76 - headAt(s) + clay(s);
  if (d === 4) return (s) => 0.78 - headAt(s) + clay(s) * 1.4;
  // midare: an irregular mix over three octaves, with heads breaking through
  return (s) => 0.7 - 0.09 * (fbm1(o + s * 6) - 0.5) * 2 - 0.6 * headAt(s) * (fbm1(o + 40 + s * 4) > 0.5 ? 1 : 0.2) + clay(s);
}

// ---- one blade along a gentle arc: points of the spine and edge for s in [0, 1] ----
function bladeOutline({ x0, y0, len, h, sag }) {
  const W0 = B.w0, N = Math.max(24, Math.round(len / 6));
  const axis = (s) => [x0 + s * len, y0 - 4 * sag * s * (1 - s)];
  const spine = [], edge = [];
  for (let i = 0; i <= N; i++) {
    const s = i / N, [x, y] = axis(s), w = (bladeWidth(s) / W0) * h;
    let drop = 0;
    if (s > B.yk) { const q = (s - B.yk) / (1 - B.yk); drop = (B.w1 / W0) * h * 0.1 * q * q; }
    spine.push([x, y + drop]);
    edge.push([x, y + drop + w]);
  }
  return { spine, edge, axis, N, widthAt: (s) => (bladeWidth(s) / W0) * h };
}
const outlinePath = (o) => `M${pts(o.spine)}L${pts([...o.edge].reverse())}Z`;

// a kissaki-shaped arrowhead, as the oshigata plates draw them (src/sword/drawing.js arrow()): the tip at (x, y),
// pointing along dir (+1 right, −1 left); one curved edge, one straight spine, like the blade's own point
function kissakiHead(x, y, dir, size = 8) {
  const n = dir; // perp([dir, 0]) = [0, dir]
  const bx = x - dir * size;
  const s1 = [bx, y + n * size * 0.27], s2 = [bx, y - n * size * 0.12];
  const c = [x - dir * size * 0.35, y + n * size * 0.3];
  return `M${r1(x)} ${r1(y)}Q${r1(c[0])} ${r1(c[1])} ${r1(s1[0])} ${r1(s1[1])}L${r1(s2[0])} ${r1(s2[1])}Z`;
}
// a dimension line with kissaki arrowheads at both ends (tips on the extension lines), its label above
function dimension(x1, x2, y, label, cls = 'dim') {
  const size = Math.min(8, Math.max(4, (x2 - x1) / 3));
  return `<g class="${cls}"><path class="k4" d="M${r1(x1 + 2)} ${r1(y)}H${r1(x2 - 2)}"/><path class="ah" d="${kissakiHead(x1, y, -1, size)}${kissakiHead(x2, y, 1, size)}"/><path class="k5 ext" d="M${r1(x1)} ${r1(y - 5)}v10M${r1(x2)} ${r1(y - 5)}v10"/><text x="${r1(x1 + 4)}" y="${r1(y - 7)}">${esc(label)}</text></g>`;
}

/**
 * The blade of one solution. weeks { mvp: [a, b], full: [a, b] }; state 'off' | 'mvp' | 'full'; scaleWeeks: the
 * longest full.max of the result, so every blade shares one scale. labels { mvp, full, tick } are finished strings.
 */
export function bladePlate({ seed = 1, weeks, state = 'mvp', scaleWeeks, width = 720, difficulty = 1, labels = {}, dots = 900 }) {
  const H = 96, stub = 30, right = 12, base = stub + 6, y0 = 72;
  const usable = width - base - right;
  const Lx = (w) => Math.max(18, usable * w / Math.max(1, scaleWeeks));
  const lenFull = Lx(weeks.full[1]), lenMvp = Lx(weeks.mvp[1]);
  const len = state === 'mvp' ? lenMvp : lenFull;
  // a longer blade is a broader one, as a tachi is beside a tantō: the width follows the full length
  const h = Math.min(18, 7 + 0.012 * lenFull);
  const sag = 0.012 * len;
  const parts = [];
  // the tang (nakago) stub and the habaki at the start
  parts.push(`<path class="k3 nk" d="M${base - 6} ${y0 + 1}L${stub - 24} ${y0 + 3}L${stub - 26} ${y0 + h - 4}L${base - 6} ${y0 + h - 1}Z"/>`);
  parts.push(`<path class="k2" d="M${base - 6} ${y0 - 1.5}h6v${h + 3}h-6Z"/>`);
  const solid = state !== 'off';
  const o = bladeOutline({ x0: base, y0, len, h, sag });
  if (state === 'mvp' && lenFull > lenMvp + 4) {
    // the planned rest: the full blade's outline dashed beyond the MVP, like the plan drawing
    const of = bladeOutline({ x0: base, y0, len: lenFull, h, sag: 0.012 * lenFull });
    parts.push(`<path class="k5 plan" d="${outlinePath(of)}"/>`);
  }
  parts.push(`<path class="${solid ? 'k1 steel' : 'k5 plan off'}" d="${outlinePath(o)}"/>`);
  // the shinogi line and the yokote, as on a rubbing
  const shin = o.spine.map(([x, y], i) => [x, y + o.widthAt(i / o.N) * 0.28]).slice(0, Math.round(o.N * B.yk) + 1);
  parts.push(`<path class="k3" d="M${pts(shin)}"/>`);
  const yk = Math.round(o.N * B.yk);
  parts.push(`<path class="k3" d="M${pts([o.spine[yk], o.edge[yk]])}"/>`);
  if (solid) {
    // the hamon and its nie: the temper line is the difficulty
    const v = hamonFn(difficulty, seed), rnd = mulberry(seed ^ 0x9e3779b9);
    const line = [];
    for (let i = 0; i <= o.N * 2; i++) { const s = i / (o.N * 2); if (s > B.yk + 0.04) break; const [x] = o.axis(s), sp = o.spine[Math.round(s * o.N)]; line.push([x, sp[1] + o.widthAt(s) * Math.min(0.93, v(s))]); }
    parts.push(`<path class="k3 hamon" d="M${pts(line)}"/>`);
    const n = Math.min(dots, Math.round(len * 1.6));
    const groups = ['', '', ''];
    for (let i = 0; i < n; i++) {
      const s = rnd() * Math.min(1, B.yk + 0.04), [x] = o.axis(s), sp = o.spine[Math.round(s * o.N)], w = o.widthAt(s);
      const vv = Math.min(0.97, v(s) + Math.pow(rnd(), 1.8) * 0.2);
      groups[Math.floor(rnd() * 3)] += `M${r1(x)} ${r1(sp[1] + w * vv)}h0`;
    }
    parts.push(groups.map((d, i) => (d ? `<path class="nie n${i}" d="${d}"/>` : '')).join(''));
  }
  // the range: faint ticks under the edge at the shorter and the longer end
  const rr = state === 'full' ? weeks.full : weeks.mvp;
  for (const w of rr) { const x = base + Lx(w); parts.push(`<path class="k5" d="M${r1(x)} ${y0 + h + 6}v6"/>`); }
  // the MVP mark on a full blade
  if (state === 'full' && lenFull > lenMvp + 4) { const x = base + lenMvp; parts.push(`<path class="k2" d="M${r1(x)} ${y0 - 7}v7"/><text class="tick" x="${r1(x)}" y="${y0 - 10}" text-anchor="middle">${esc(labels.tick || 'MVP')}</text>`); }
  // the dimension lines above: MVP nearest the blade, the full version above it
  parts.push(dimension(base, base + lenMvp, 44, labels.mvp || '', 'dim d-mvp'));
  parts.push(dimension(base, base + lenFull, 18, labels.full || '', 'dim d-full'));
  return { svg: `<svg class="plate-svg" viewBox="0 0 ${width} ${H}" width="${width}" height="${H}" role="img" aria-label="${esc(labels.aria || '')}">${parts.join('')}</svg>`, w: width, h: H };
}

/** The difficulty meter: the temper line magnified over 120 × 14, with its nie. */
export function hamonStrip({ difficulty, seed = 7, width = 120, height = 14, label = '' }) {
  const v = hamonFn(difficulty, seed), rnd = mulberry(seed + 11), line = [];
  for (let i = 0; i <= 60; i++) { const s = i / 60; line.push([s * width, 1 + (v(s * 0.55 + 0.1) - 0.55) * height * 2.6]); }
  let dots = '';
  for (let i = 0; i < 70; i++) { const s = rnd(), y = 1 + (v(s * 0.55 + 0.1) - 0.55) * height * 2.6 + Math.pow(rnd(), 1.6) * 6; if (y < height - 0.5) dots += `M${r1(s * width)} ${r1(y)}h0`; }
  return `<svg class="hamon-strip" viewBox="0 -2 ${width} ${height + 2}" width="${width}" height="${height + 2}" role="img" aria-label="${esc(label)}"><path class="k3" d="M${pts(line.map(([x, y]) => [x, Math.max(0, Math.min(height, y))]))}"/><path class="nie n1" d="${dots}"/></svg>`;
}

/** A small blade silhouette for the plan's rows (x from start to end weeks; 14 px tall). */
export function ganttBlade(x1, x2, y, state, h = 9) {
  // the arc stays within 2.5 px, so the row's label above always has its air
  const len = Math.max(8, x2 - x1), o = bladeOutline({ x0: x1, y0: y, len, h, sag: Math.min(2.5, 0.008 * len) });
  return `<path class="${state === 'off' ? 'k5 plan off' : 'k2 steel'}" d="${outlinePath(o)}"/>`;
}

/**
 * The blank appraisal form (empty state and no-JS view): a hairline blade rising at −18°, three empty dimension slots
 * on leader lines (level labels, as on an appraiser's form), and an empty dashed hamon. labels: { time, price, diff }.
 */
export function blankForm({ labels, width = 640, height = 440, level = false }) {
  const len = width * (level ? 0.8 : 0.9), h = level ? 18 : 30, x0 = 0, y0 = 0;
  const o = bladeOutline({ x0, y0, len, h, sag: 0.014 * len });
  const ang = ((level ? 0 : -18) * Math.PI) / 180, cx = width * (level ? 0.13 : 0.07), cy = height * (level ? 0.46 : 0.8), ca = Math.cos(ang), sa = Math.sin(ang);
  const T = ([x, y]) => [cx + x * ca - y * sa, cy + x * sa + y * ca];
  const P = (arr) => pts(arr.map(T));
  const yk = Math.round(o.N * B.yk);
  const ham = [];
  for (let i = 0; i <= yk; i++) ham.push([o.spine[i][0], o.spine[i][1] + o.widthAt(i / o.N) * 0.7]);
  const at = (s, f) => { const i = Math.round(s * o.N); return T([o.spine[i][0], o.spine[i][1] + o.widthAt(s) * f]); };
  // a leader from a pin on the blade to a level shelf with its label: dir 1 right, -1 left
  const slot = (s, f, dx, dy, dir, text, cls) => {
    const [x, y] = at(s, f), ex = x + dx, ey = y + dy, sx = ex + dir * 34;
    return `<g class="slot ${cls}"><circle class="pin" cx="${r1(x)}" cy="${r1(y)}" r="1.8"/><path class="k4" d="M${r1(x)} ${r1(y)}L${r1(ex)} ${r1(ey)}H${r1(sx)}"/><text x="${r1(sx + dir * 8)}" y="${r1(ey + 4)}" text-anchor="${dir > 0 ? 'start' : 'end'}">${esc(text)}</text></g>`;
  };
  const nk = [[x0 - 44, y0 + 5], [x0 - 7, y0 + 2], [x0 - 7, y0 + h - 2], [x0 - 46, y0 + h - 9]];
  const body = [
    `<path class="k2 blank" d="M${P(o.spine)}L${P([...o.edge].reverse())}Z"/>`,
    `<path class="k4" d="M${P(o.spine.map(([x, y], i) => [x, y + o.widthAt(i / o.N) * 0.28]).slice(0, yk + 1))}"/>`,
    `<path class="k4" d="M${P([o.spine[yk], o.edge[yk]])}"/>`,
    `<path class="k5 hamon-empty" d="M${P(ham)}"/>`,
    `<path class="k3" d="M${P(nk)}Z"/><path class="k2" d="M${P([[x0 - 7, y0 - 3], [x0, y0 - 3], [x0, y0 + h + 3], [x0 - 7, y0 + h + 3]])}Z"/>`,
    ...(level ? [
      // two rows above (time high and to the right, price low and to the left) and one below: nothing crosses
      slot(0.08, 0, 0, -44, 1, labels.time, 's-time'),
      slot(0.86, 0, 0, -18, -1, labels.price, 's-price'),
      slot(0.66, 0.72, 0, 30, -1, labels.diff, 's-diff'),
    ] : [
      slot(0.2, 0, -14, -92, 1, labels.time, 's-time'),
      slot(0.56, 0, -8, -118, 1, labels.price, 's-price'),
      slot(0.7, 0.72, 30, 74, -1, labels.diff, 's-diff'),
    ]),
  ].join('');
  return `<svg class="blank-form ${level ? 'level' : 'tilt'}" viewBox="0 0 ${width} ${height}" aria-hidden="true">${body}</svg>`;
}

/** "Not needed yet": a faint blade outline with one ink strike across it, the same for the same seed. */
export function struckBlade(seed, width = 150) {
  const o = bladeOutline({ x0: 10, y0: 9, len: width - 20, h: 8, sag: 0.012 * (width - 20) }), r = mulberry(seed);
  const a = 4 + r() * 6, b = 6 + r() * 10;
  return `<svg class="nr-blade" viewBox="0 0 ${width} 26" aria-hidden="true"><path class="k3 off" d="${outlinePath(o)}"/><path class="k1" d="M6 ${r1(9 + a)}Q${r1(width / 2)} ${r1(7 + r() * 8)} ${width - 6} ${r1(b)}"/></svg>`;
}
