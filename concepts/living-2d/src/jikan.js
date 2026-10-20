// Scene 4: 時 VAQT — two ensō are 24 h dials. Tashkent (feruza) and Tokyo (shu) working-day washes
// overprint into the shared hours. The Tokyo ring is turned by the 4 h offset, so one instant
// sits at one angle on both dials.
import { bakeWashi } from './washi.js';
import { buildField, inkOnto } from './fude.js';
import { el, navBar, clocks, OK } from './common.js';
import { clamp, smooth, vnoise, hash2, hex } from './noise.js';

const TZ_T = 5, TZ_K = 9; // UTC offsets

export async function jikan(S) {
  const { W, H, kvg, phone, layers } = S;
  const t = S.t;
  const sheet = bakeWashi(W, H, { seed: 31, scale: phone ? 0.75 : 1 });
  const fib = { data: sheet.fibre, w: W, h: H, ox: 0, oy: 0 };
  const cx = phone ? W * 0.5 : W * 0.655, cy = phone ? H * 0.5 : H * 0.53;
  const R = phone ? 118 : 196, R2 = R * 1.2;
  const ang = (hTash) => ((hTash / 24) * 360 - 90) * Math.PI / 180; // screen angle of a Tashkent hour

  // ---------- washes (watercolour annular sectors), multiplied onto the paper
  const off = TZ_K - TZ_T;
  const shared = [Math.max(9, 9 - off), Math.min(18, 18 - off)]; // in Tashkent hours: computed, not hard-coded
  const washes = [
    { from: 9, to: 18, r0: 0.4, r1: 0.9, col: hex('#1E9C93'), a: 0.62, seed: 3 },
    { from: 9 - off, to: 18 - off, r0: 0.6, r1: 1.13, col: hex('#D3462B'), a: 0.56, seed: 7 },
  ];
  const bloom = clamp((t - 0.25) / 0.5);
  for (const w of washes) washOnto(sheet, cx, cy, R, w, ang, bloom);

  // ---------- the two ensō (procedural brush circles), the Tokyo one turned by the offset
  const enso = (r, a0deg, sweep, W0, seed, lean) => {
    const pts = []; const n = 260;
    for (let i = 0; i <= n; i++) {
      const f = i / n;
      const a = (a0deg + sweep * f) * Math.PI / 180;
      const rr = r * (1 + 0.025 * Math.sin(f * 5.1 + seed) + 0.018 * (vnoise(f * 6, seed, 3) - 0.5) * 2 + lean * f);
      pts.push([cx + Math.cos(a) * rr * 1.01, cy + Math.sin(a) * rr]);
    }
    return { pts, kind: 'harai', W: W0, press: 0.32, entry: 0.06, haraiFrom: 0.72, haraiDry: 1.7, dryStart: 0.42, dry: 1.3 };
  };
  const s1 = enso(R, 118, 336, R * 0.21, 1, -0.035);
  const s2 = enso(R2, 118 - 60, 338, R * 0.16, 2, 0.03);
  const f1 = buildField([s1], { W: R * 0.21, seed: 12, fibre: fib, bleed: 0.24 });
  const f2 = buildField([s2], { W: R * 0.16, seed: 19, fibre: fib, bleed: 0.24 });
  inkOnto(sheet, f1, { progress: clamp(t / 0.35), age: 3 });
  inkOnto(sheet, f2, { progress: clamp((t - 0.15) / 0.35), age: 3 });

  // ---------- the hour hand: one short tapered brush stroke (both dials agree)
  const { tash, tok } = clocks();
  const [hh, mm] = tash.split(':').map(Number);
  const hNow = hh + mm / 60;
  const ha = ang(hNow);
  const hand = { pts: [], kind: 'harai', W: R * 0.11, press: 0.4, haraiFrom: 0.35, haraiDry: 0.6 };
  for (let i = 0; i <= 40; i++) { const f = i / 40; hand.pts.push([cx + Math.cos(ha) * R * (0.06 + 0.66 * f), cy + Math.sin(ha) * R * (0.06 + 0.66 * f) + Math.sin(f * 3) * 1.5]); }
  const fh = buildField([hand], { W: R * 0.11, seed: 5, fibre: fib, bleed: 0.2 });
  inkOnto(sheet, fh, { progress: 1, age: 3 });

  const pc = layers.paper; pc.width = W; pc.height = H;
  pc.getContext('2d').putImageData(sheet.img, 0, 0);

  // ---------- DOM: headline, times, ticks, the shared-hours label
  const over = layers.over;
  navBar(over, kvg, { phone });
  el('h2', 'h2 jk-h2', `Tokio sifati.<br>Toshkent vaqti va narxi.`, over);
  const times = el('div', 'jk-times', `
    <div class="tm"><b>${tash}</b><span><i class="dot feruza"></i>Toshkent · UTC+5</span></div>
    <div class="tm"><b>${tok}</b><span><i class="dot shu"></i>Tokio · UTC+9</span></div>`, over);
  el('p', 'jk-sub', `4 soat farq — har kuni 5 soat birga ishlaymiz.`, over);
  // ticks
  let svg = `<svg class="jk-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">`;
  for (const h of [0, 6, 12, 18]) {
    const a = ang(h), r = R * 0.27;
    svg += `<text x="${(cx + Math.cos(a) * r).toFixed(1)}" y="${(cy + Math.sin(a) * r + 4.5).toFixed(1)}" class="tk">${h}</text>`;
  }
  // label along the shared arc (outside, reading left to right along the bottom)
  const aA = ang(shared[1]), aB = ang(shared[0]);
  const rl = R2 * 1.36;
  const p0 = [cx + Math.cos(aA) * rl, cy + Math.sin(aA) * rl], p1 = [cx + Math.cos(aB) * rl, cy + Math.sin(aB) * rl];
  svg += `<path id="arcL" d="M ${p0[0].toFixed(1)} ${p0[1].toFixed(1)} A ${rl} ${rl} 0 0 0 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}" fill="none"/>`;
  const fmt = (h) => String(h).padStart(2, '0') + ':00';
  svg += `<text class="arc"><textPath href="#arcL" startOffset="50%" text-anchor="middle">${fmt(shared[0])}–${fmt(shared[1])} · ${fmt(shared[0] + off)}–${fmt(shared[1] + off)}</textPath></text>`;
  svg += '</svg>';
  el('div', 'jk-wrap', svg, over);
  return {};
}

// a watercolour annular sector with fibrous edges, coffee-ring rim and granulation
function washOnto(sheet, cx, cy, R, w, ang, bloom) {
  const a0 = ang(w.from), a1 = ang(w.to);
  const span = a1 - a0;
  const rOut = R * w.r1 * 1.08 + 20;
  const x0 = Math.max(0, Math.floor(cx - rOut)), x1 = Math.min(sheet.w - 1, Math.ceil(cx + rOut));
  const y0 = Math.max(0, Math.floor(cy - rOut)), y1 = Math.min(sheet.h - 1, Math.ceil(cy + rOut));
  const d = sheet.data, fibre = sheet.fibre;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const dx = x - cx, dy = y - cy;
    const rho = Math.hypot(dx, dy) / R;
    let th = Math.atan2(dy, dx); while (th < a0 - 0.6) th += Math.PI * 2; while (th > a0 + Math.PI * 2 - 0.6) th -= Math.PI * 2;
    const u = (th - a0) / span; // 0..1 across the sector
    // ragged edges
    const nA = (vnoise(rho * 8, w.seed, 1) - 0.5) * 0.02 + (vnoise(rho * 30, w.seed, 2) - 0.5) * 0.004;
    const nR = (vnoise(th * 6, w.seed, 3) - 0.5) * 0.04 + (vnoise(th * 24, w.seed, 4) - 0.5) * 0.007;
    // bloom: radial reveal with a granulating front
    const front = bloom * 1.2 - (vnoise(th * 5, w.seed, 9) * 0.25);
    const dU = Math.min(u - nA, 1 - u - nA) * span * rho * R; // px to the angular edges
    const dR = Math.min(rho - w.r0 - nR, w.r1 + nR - rho) * R;
    const dE = Math.min(dU, dR);
    if (dE < -2) continue;
    if ((rho - w.r0) / (w.r1 - w.r0) > front) continue;
    let a = clamp((dE + 1.5) / 3);
    const rim = 0.55 * Math.exp(-Math.max(0, dE) / 5);
    const body = 0.82 + 0.18 * vnoise(x / 40, y / 40, w.seed + 11) - 0.12 * smooth(0.2, 0.9, vnoise(x / 90, y / 90, w.seed + 12));
    const gran = (hash2(x, y, w.seed) > 0.62 ? 0.08 : 0) + 0.05 * (vnoise(x / 2.2, y / 2.2, w.seed + 13) - 0.5);
    const P = y * sheet.w + x, o = P * 4;
    const f = fibre[P];
    const A = clamp(w.a * a * (body + rim + gran) * (1 - 0.25 * f));
    d[o] *= 1 - A + A * w.col[0] / 255; d[o + 1] *= 1 - A + A * w.col[1] / 255; d[o + 2] *= 1 - A + A * w.col[2] / 255;
  }
}
