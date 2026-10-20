// TOKIO · TOSHKENT: the abacus of hours. A soroban with 24 rods, one per hour; each rod is one moment.
// Upper deck = Tokyo's hour, lower deck = Tashkent's. Working hours (09-18) are pushed to the beam.
import { THREE, PAL, G, toon, toy, Ribbon, sx2w, sy2w, contactShadow } from './gl.js';
import { makeBall } from './kendama.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export function buildHours() {
  const root = document.getElementById('hours');
  const q = new URLSearchParams(location.search);
  // live clock by default; ?clock=HH:MM pins Tashkent time for a capture
  let tsH, tsM;
  if (q.get('clock')) [tsH, tsM] = q.get('clock').split(':').map(Number);
  else { const f = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Tashkent', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date()); tsH = +f.find(p => p.type === 'hour').value; tsM = +f.find(p => p.type === 'minute').value; }
  const tkH = (tsH + 4) % 24;
  const pad = n => String(n).padStart(2, '0');
  const setClock = (el, h, m) => { const s = pad(h) + pad(m); el.querySelectorAll('.d').forEach((d, i) => d.textContent = s[i]); };
  setClock(root.querySelector('.clock.tk'), tkH, tsM);
  setClock(root.querySelector('.clock.ts'), tsH, tsM);

  const A = root.querySelector('[data-anchor=abacus]').getBoundingClientRect();
  const cx = A.left, cy = A.top;
  const FW = 1120, FH = 232, BAR = 22, DEPTH = 34;
  const x0 = cx - FW / 2 + BAR, x1 = cx + FW / 2 - BAR, y0 = cy - FH / 2 + BAR, y1 = cy + FH / 2 - BAR;
  const colW = (x1 - x0) / 24;
  const colX = i => x0 + (i + .5) * colW;

  const wood = toon(PAL.tut, PAL.tutS, { wood: 0.22, bounce: '#FFE2B8' });
  const g = new THREE.Group(); G.scene.add(g);
  const W = (x, y) => new THREE.Vector3(sx2w(x), sy2w(y), 0);

  // frame bars (built upright so the grain runs along each bar, then turned)
  const bar = (w, h, x, y, horiz) => {
    const geo = new RoundedBoxGeometry(horiz ? h : w, horiz ? w : h, DEPTH, 3, 6);
    const m = toy(geo, wood);
    m.position.copy(W(x, y)); if (horiz) m.rotation.z = Math.PI / 2;
    g.add(m); return m;
  };
  bar(FW, BAR, cx, cy - FH / 2 + BAR / 2, true);
  bar(FW, BAR, cx, cy + FH / 2 - BAR / 2, true);
  bar(BAR, FH - 2, cx - FW / 2 + BAR / 2, cy, false);
  bar(BAR, FH - 2, cx + FW / 2 - BAR / 2, cy, false);
  const beamH = 14;
  const beam = bar(x1 - x0 + 4, beamH, cx, cy, true);
  beam.position.z = 2;
  // little stand legs down to the floor
  const floorY = root.querySelector('.half.tk .floor').getBoundingClientRect().top;
  for (const lx of [cx - FW / 2 + 90, cx + FW / 2 - 90]) {
    const lh = floorY - (cy + FH / 2) + 4;
    const leg = toy(new RoundedBoxGeometry(30, lh, 26, 3, 5), wood);
    leg.position.copy(W(lx, cy + FH / 2 + lh / 2 - 2)); leg.position.z = -6; g.add(leg);
    const foot = toy(new RoundedBoxGeometry(84, 16, 40, 3, 6), wood);
    foot.position.copy(W(lx, floorY - 8)); g.add(foot);
  }

  // rods
  const rodMat = new THREE.MeshBasicMaterial({ color: '#3A2A22' });
  const rodGeo = new THREE.CylinderGeometry(2.4, 2.4, y1 - y0, 8);
  for (let i = 0; i < 24; i++) { const r = new THREE.Mesh(rodGeo, rodMat); r.position.copy(W(colX(i), cy)); r.position.z = -2; g.add(r); }

  // bicone beads
  const prof = [[2, -12.5], [8, -11.8], [15.5, -7], [19.4, -2], [19.8, 0], [19.4, 2], [15.5, 7], [8, 11.8], [2, 12.5]].map(([r, y]) => new THREE.Vector2(r, y));
  const beadGeo = new THREE.LatheGeometry(prof, 36);
  const M = {
    shu: toon(PAL.shu, PAL.shuS, { gloss: .55, bounce: '#FFD9B0' }),
    fir: toon(PAL.firuza, PAL.firuzaS, { gloss: .55, bounce: '#FFE7C4' }),
    washi: toon('#FFF6E6', PAL.washiS, { gloss: .4, bounce: '#FFE2B8' }),
  };
  const bh = 25;
  for (let i = 0; i < 24; i++) {
    const tk = (i + 4) % 24, tkWork = tk >= 9 && tk < 18, tsWork = i >= 9 && i < 18;
    const ty = tkWork ? cy - beamH / 2 - bh / 2 - 1 : y0 + bh / 2 + 1;
    const sy = tsWork ? cy + beamH / 2 + bh / 2 + 1 : y1 - bh / 2 - 1;
    const b1 = toy(beadGeo, tkWork ? M.shu : M.washi); b1.position.copy(W(colX(i), ty)); b1.position.z = 4; b1.rotation.y = i * .7; g.add(b1);
    const b2 = toy(beadGeo, tsWork ? M.fir : M.washi); b2.position.copy(W(colX(i), sy)); b2.position.z = 4; b2.rotation.y = i * .9; g.add(b2);
  }
  g.rotation.x = 0; // frontal: the abacus is a diagram as much as a toy

  // DOM: board, overlap band, hour numbers, annotations
  const board = root.querySelector('.board');
  Object.assign(board.style, { left: x0 + 'px', top: y0 + 'px', width: (x1 - x0) + 'px', height: (y1 - y0) + 'px' });
  const band = board.querySelector('.band');
  Object.assign(band.style, { left: (9 * colW) + 'px', width: (5 * colW) + 'px' });
  const top = root.querySelector('.hrs.top'), bot = root.querySelector('.hrs.bot');
  top.style.top = (cy - FH / 2 + BAR / 2 - 7) + 'px'; bot.style.top = (cy + FH / 2 - BAR / 2 - 7) + 'px';
  for (let i = 0; i < 24; i++) {
    top.insertAdjacentHTML('beforeend', `<span style="left:${colX(i)}px">${pad((i + 4) % 24)}</span>`);
    bot.insertAdjacentHTML('beforeend', `<span style="left:${colX(i)}px">${pad(i)}</span>`);
  }
  const tog = root.querySelector('.together');
  tog.style.left = (x0 + 11.5 * colW) + 'px'; tog.style.top = (cy + FH / 2 + 26) + 'px'; tog.style.transform = 'translateX(-50%)';
  const gap = root.querySelector('.gap');
  Object.assign(gap.style, { left: (x0 + 5 * colW) + 'px', width: (4 * colW) + 'px', top: (cy - FH / 2 - 62) + 'px' });

  // the ball becomes the sun, sitting on the frame above "now" in Tashkent
  const sunX = x0 + (tsH + tsM / 60) * colW;
  const R = 36;
  const sun = makeBall(R, { ink: PAL.washi, bounce: '#FFD08A' });
  sun.traverse(o => { if (o.material) o.material.transparent = true; o.renderOrder = 6; });
  const sunY = cy - FH / 2 - R + 3;
  sun.position.copy(W(sunX, sunY)); sun.position.z = 10;
  sun.rotation.set(.35, -.6, .25);
  sun.scale.set(1.04, .96, 1.04);
  G.scene.add(sun);
  const sh = contactShadow(70, 14, .28); sh.position.copy(W(sunX + 4, cy - FH / 2 + 1)); sh.position.z = 30; G.scene.add(sh);
  // the sun rolls along the frame with the time: a short trail behind it
  const trail = document.createElement('div'); trail.className = 'trail';
  trail.style.left = (sunX - R - 52) + 'px'; trail.style.top = (sunY - 12) + 'px';
  trail.innerHTML = '<i style="top:0;width:34px;left:10px"></i><i style="top:12px;width:44px;left:0"></i><i style="top:24px;width:26px;left:18px"></i>';
  root.querySelector('.over').appendChild(trail);
  return { at() {} };
}
