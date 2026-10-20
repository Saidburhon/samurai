// CONTACT: throw us the ball. The kendama hovers like a goalkeeper, big cup up; the ball waits on a ko'rpacha.
import { THREE, PAL, G, toon, toy, Ribbon, sx2w, sy2w, contactShadow } from './gl.js';
import { makeKendama, makeBall } from './kendama.js';
import { Rope } from './rope.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

function ikat(shade) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256;
  const x = c.getContext('2d');
  const seq = shade ? ['#B8301A', '#E8CFA7', '#1D2B95', '#E8CFA7', '#B8301A', '#E08A12'] : [PAL.shu, '#FFF6E6', PAL.kobalt, '#FFF6E6', PAL.shu, PAL.orik];
  let s = 11; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const widths = [44, 12, 26, 12, 30, 8];
  for (let row = 0; row < 256; row += 2) {
    let xx = -20 + Math.sin(row * 0.07) * 4; let k = 0;
    while (xx < 532) {
      const w = widths[k % 6] * 1.25 + Math.sin(row * .045 + k) * 2;
      const j = (rnd() - .5) * 3 + Math.sin(row * .09 + k * 1.7) * 5 + Math.sin(row * .31 + k) * 2.5; // the resist "bleed": feathered, flame-like
      x.fillStyle = seq[k % 6]; x.fillRect(xx + j, row, w + 2, 2);
      xx += w; k++;
    }
  }
  // the diamond motif along the washi stripes
  x.globalAlpha = .9; x.strokeStyle = shade ? '#141118' : PAL.sumi; x.lineWidth = 3;
  
  const c2 = document.createElement('canvas'); c2.width = 512; c2.height = 256;
  const x2 = c2.getContext('2d'); x2.filter = 'blur(1.4px)'; x2.drawImage(c, 0, 0);
  const t = new THREE.CanvasTexture(c2); t.colorSpace = THREE.NoColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4;
  return t;
}

export function buildContact() {
  const root = document.getElementById('contact');
  const kA = root.querySelector('[data-anchor=keeper]').getBoundingClientRect();
  const cA = root.querySelector('[data-anchor=cushion]').getBoundingClientRect();
  const H = 440, r = 0.17 * H;
  const bounce = '#7FD3CF';

  // kendama goalkeeper: turned so the big cup faces up towards the ball
  const K = makeKendama(H, { bounce });
  G.scene.add(K.rig);
  K.pose({ x: kA.left, y: kA.top + .5 * H, rot: 1.16, pivot: .5, ry: .5, rx: -.08, sy: 1, sx: 1 });

  // cushion on the floor
  const cw = 250, ch = 42, cd = 150;
  const cushion = toy(new RoundedBoxGeometry(cw, ch, cd, 4, 16), toon(PAL.washi, PAL.washiS, { map: ikat(false), shadeMap: ikat(true), bounce, top: .5 }));
  cushion.position.set(sx2w(cA.left), sy2w(cA.top - ch / 2 + 6), 0);
  cushion.rotation.set(.32, -.12, 0);
  G.scene.add(cushion);
  const csh = contactShadow(cw * 1.25, 26, .22); csh.position.set(sx2w(cA.left + 6), sy2w(cA.top - 2), -80); G.scene.add(csh);

  // the ball resting on it
  const ball = makeBall(r, { bounce });
  ball.traverse(o => { if (o.material) o.material.transparent = true; o.renderOrder = 6; });
  const bx = cA.left - 6, by = cA.top - ch - r + 16;
  ball.position.set(sx2w(bx), sy2w(by), 30); ball.rotation.set(.2, 2.3, -.35);
  ball.scale.set(1.03, .97, 1.03);
  G.scene.add(ball);

  // slingshot: two little pegs on the cushion and an ikat band behind the ball
  const pegMat = toon(PAL.tut, PAL.tutS, { wood: .3, bounce });
  const pegs = [];
  for (const dx of [-cw / 2 + 26, cw / 2 - 26]) {
    const peg = toy(new THREE.CapsuleGeometry(7, 34, 4, 12), pegMat);
    const px = cA.left + dx, py = cA.top - ch - 14;
    peg.position.set(sx2w(px), sy2w(py), 40); G.scene.add(peg); pegs.push([px, py - 18]);
  }
  const band = new Ribbon(12, { width: 6.5, seg: 30 });
  const bpts = [];
  for (let i = 0; i < 12; i++) { const u = i / 11; bpts.push([pegs[0][0] + (pegs[1][0] - pegs[0][0]) * u, pegs[0][1] + Math.sin(u * Math.PI) * 10]); }
  band.update(bpts, 0); band.mesh.renderOrder = 4; G.scene.add(band.mesh);

  // hovering kendama's shadow on the floor, small and soft
  const ksh = contactShadow(150, 18, .14); ksh.position.set(sx2w(kA.left - 20), sy2w(cA.top - 3), -60); G.scene.add(ksh);

  // thread from the bead to the ball, settled with the rope sim
  const N = 20;
  const rope = new Rope(N, 1.1 * H);
  const bead = K.beadScreen();
  const attach = [bx + .55 * r, by - .7 * r];
  rope.hang(bead, attach, .4);
  const floorY = cA.top - ch;
  rope.colliders.push((rp, i) => { if (rp.y[i] > floorY && Math.abs(rp.x[i] - cA.left) < cw / 2) rp.y[i] = floorY; });
  for (let i = 0; i < 400; i++) rope.step(1 / 120, bead, attach);
  const rib = new Ribbon((N - 1) * 4 + 1, { width: 7.5 });
  rib.update(rope.smooth(4), 0); G.scene.add(rib.mesh);

  // dotted throw preview: ballistic arc from the ball into the big cup
  const cup = K.toScreen(K.sarado, new THREE.Vector3(-0.19 * H - 0.6 * r, 0, 0));
  const aim = root.querySelector('.aim');
  const T = .62, g = 2600;
  const vx = (cup[0] - bx) / T, vy = (cup[1] - by - .5 * g * T * T) / T;
  let dots = '';
  for (let i = 3; i < 25; i++) {
    const u = (i / 25) * T;
    const px = bx + vx * u, py = by + vy * u + .5 * g * u * u;
    const rr = 6.2 - i * .14;
    dots += `<circle class="dot" cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${rr.toFixed(1)}"/>`;
  }
  aim.innerHTML = dots;
  const hint = root.querySelector('.hint');
  hint.style.left = (bx - 300) + 'px'; hint.style.top = (by - r - 74) + 'px';

  return { at() {} };
}
