// The Toki dial: a 24-hour dial carved in ganch plaster, two rings (Toshkent inside, Tokio outside, 4 hours = 60°
// apart), a girih frieze cut from the tsuba's own polygons, and the shared-hours arcs in shu.
// Pure: the build writes it into the HTML (gen:dial), so the ring names are data-i18n text translated with the page.
// Units: 1000 = the viewport height in cinema mode; the centre is (0, 0); 12 is at the top, clockwise 15° per hour.
import * as G from './geom-core.js';
import { frame, poly, SC } from './drawing.js';

export const DIAL = { rIn: 400, rOut: 480, frieze: [300, 360], numIn: 378, numOut: 446, offsetH: 4, shared: [9, 14] };
const deg = Math.PI / 180;
export const hourAngle = (h) => (h - 12) * 15; // degrees clockwise from the top
const at = (r, a) => [r * Math.sin(a * deg), -r * Math.cos(a * deg)];
const f1 = (v) => (Math.round(v * 10) / 10).toString().replace(/^(-?)0\./, '$1.');

function arc(r, a0, a1) {
  const p0 = at(r, a0), p1 = at(r, a1), large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return `M${f1(p0[0])} ${f1(p0[1])}A${r} ${r} 0 ${large} 1 ${f1(p1[0])} ${f1(p1[1])}`;
}

// the frieze: the tsuba's own girih openwork, small, 16 times around the dial, cut into the plaster
function rdpClosed(pts, eps) {
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
export const FRIEZE = { r: 330, size: 27, n: 16 };
function rosette(holes) {
  const k = FRIEZE.size / 0.352;
  return holes.filter((h) => Math.min(...h.map(([x, y]) => Math.hypot(x, y))) > 0.19)
    .map((h) => poly(rdpClosed(h, 0.35 / k).map(([x, y]) => [x * k, y * k]), true)).join('');
}

// the hand for flow mode: the sword drawn in ink, tsuba on the hub, the blade 0.44 H long pointing to 12
function hand() {
  const sigma = 1;
  const tsubaC = G.hp2((G.H.tsuba[0] + G.H.tsuba[1]) / 2, 0, sigma);
  const tip = G.spine(1, sigma);
  const sc = 440 / Math.hypot(tip.x - tsubaC[0], tip.z - tsubaC[1]);
  // the axis from the tsuba to the tip points up (−v)
  const F0 = frame(tsubaC, [tip.x, tip.z], { sc });
  const F = (p) => { const [u, v] = F0(p); return [v, -u]; };
  const out = [];
  const sp = [], ed = [];
  for (let i = 0; i <= 60; i++) { const s = 0.006 + 0.994 * (1 - Math.pow(1 - i / 60, 1.2)); sp.push(F(G.bp2(s, 0, sigma))); ed.push(F(G.bp2(s, 1, sigma))); }
  out.push(`<path class="k1" d="${poly([...sp, ...ed.reverse()], true)}"/>`);
  const sh = []; for (let i = 0; i <= 40; i++) sh.push(F(G.bp2(0.006 + 0.92 * i / 40, 0.28, sigma)));
  out.push(`<path class="k3" d="${poly(sh)}"/>`);
  const PH = (x, z) => F(G.hp2(x, z, sigma));
  const rect = (x0, x1, z0, z1) => poly([PH(x0, z0), PH(x1, z0), PH(x1, z1), PH(x0, z1)], true);
  const tR = G.TSUBA_R * 1.03;
  out.push(`<path class="k2" d="${rect(...G.H.habaki, -0.19, 0.19)}${rect(...G.H.fuchi, -0.171, 0.171)}"/>`);
  out.push(`<path class="k1" d="${rect(...G.H.tsuba, -tR, tR)}"/>`);
  const top = [], bot = [];
  for (let i = 0; i <= 20; i++) { const t = i / 20, x = G.H.tsuka[0] + (G.H.tsuka[1] - G.H.tsuka[0]) * t, rz = G.tsukaRadii(t)[1]; top.push(PH(x, -rz)); bot.push(PH(x, rz)); }
  out.push(`<path class="k2" d="${poly([...top, ...bot.reverse()], true)}${rect(...G.H.kashira, -0.172, 0.172)}"/>`);
  void SC;
  return out.join('');
}

// labels: { tas, tok } are the Uzbek ring names (the build translates them through data-i18n)
export function dial(holes, labels = { tas: 'Toshkent', tok: 'Tokio' }) {
  const { rIn, rOut, numIn, numOut, offsetH, shared } = DIAL;
  const parts = [];
  // ring lines and quarter-hour ticks (as dashed thick strokes: one dash per tick)
  const tick = (r, len, n, w) => { const c = 2 * Math.PI * (r - len / 2); return `<circle r="${f1(r - len / 2)}" stroke-width="${len}" stroke-dasharray="${w} ${f1(c / n - w)}" transform="rotate(${-90 - (w / c) * 180})"/>`; };
  const rings = `<circle r="${rIn}"/><circle r="${rOut}"/>` +
    tick(rIn, 7, 96, 1.2) + tick(rIn, 14, 24, 1.6) + `<g class="out">${tick(rOut, 7, 96, 1.2).replace('<circle r="', `<circle r="`)}${tick(rOut, 14, 24, 1.6)}</g>`;
  // numerals: Toshkent 0–23 inside, Tokio 0–23 outside (Tokio hour h stands where Toshkent hour h − 4 does)
  let nums = '';
  const night = (a) => Math.abs(((a % 360) + 360) % 360 - 180) < 20; // the ring names stand there
  for (let h = 0; h < 24; h++) {
    const a = hourAngle(h), p = at(numIn, a);
    if (night(a)) continue;
    nums += `<text x="${f1(p[0])}" y="${f1(p[1])}">${String(h).padStart(2, '0')}</text>`;
  }
  let numsO = '';
  for (let h = 0; h < 24; h++) {
    const a = hourAngle(h - offsetH), p = at(numOut, a);
    if (night(a)) continue;
    numsO += `<text x="${f1(p[0])}" y="${f1(p[1])}">${String(h).padStart(2, '0')}</text>`;
  }
  const engraved = `<g id="dial-num">${nums}${numsO}</g>`;
  const ro = rosette(holes);
  const fzUses = Array.from({ length: FRIEZE.n }, (_, i) => `<use href="#dial-ro" transform="rotate(${(i * 360 / FRIEZE.n + 360 / FRIEZE.n / 2).toFixed(2)}) translate(0 -${FRIEZE.r})"/>`).join('');
  // shared hours: 09–14 Toshkent on the inner ring, 13–18 Tokio on the outer: the same angles, that is the overlap
  const a0 = hourAngle(shared[0]), a1 = hourAngle(shared[1]);
  // ring names along the rings, at the bottom where the night hours would be, reading left to right
  const rp = (id, r) => { const p0 = at(r, 212), p1 = at(r, 148); return `<path id="${id}" d="M${f1(p0[0])} ${f1(p0[1])}A${r} ${r} 0 0 0 ${f1(p1[0])} ${f1(p1[1])}"/>`; };
  parts.push(`<defs>${rp('dial-rp-in', numIn)}${rp('dial-rp-out', numOut)}<path id="dial-ro" d="${ro}"/><g id="dial-fz">${fzUses}</g></defs>`);
  const band = `<circle r="${FRIEZE.r - FRIEZE.size - 4}"/><circle r="${FRIEZE.r + FRIEZE.size + 4}"/>`;
  parts.push(`<g class="carve"><g class="lo">${band}<use href="#dial-fz"/></g><g class="hi">${band}<use href="#dial-fz"/></g><g class="cut">${band}<use href="#dial-fz"/></g></g>`);
  parts.push(`<g class="rings">${rings}</g>`);
  parts.push(`<g class="nums"><use href="#dial-num" class="lo"/><use href="#dial-num" class="hi"/>${engraved}</g>`);
  parts.push(`<g class="names"><text><textPath href="#dial-rp-in" startOffset="50%" data-i18n="dial.tas">${labels.tas}</textPath></text><text><textPath href="#dial-rp-out" startOffset="50%" data-i18n="dial.tok">${labels.tok}</textPath></text></g>`);
  parts.push(`<g class="shu"><path class="arc-in" pathLength="1" d="${arc(rIn, a0, a1)}"/><path class="arc-out" pathLength="1" d="${arc(rOut, a0, a1)}"/></g>`);
  parts.push(`<g class="hand" style="--hand:${hourAngle(9)}deg">${hand()}<circle class="hub" r="6"/></g>`);
  return `<svg id="dial" class="dial" viewBox="-500 -500 1000 1000" aria-hidden="true">${parts.join('')}</svg>`;
}
