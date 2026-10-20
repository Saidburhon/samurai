import * as THREE from 'three';
import { studioEnv } from './env.js';
import { C } from './palette.js';
import { createCartoon, paintHeroDesktop, paintHeroPhone, paintStripes, paintJidoka, STRIPES } from './cartoon.js';
import { makeCloth } from './cloth.js';
import { makeBlade } from './blade.js';
import { makeShuttle, makeAndon, makeThread } from './props.js';
import { ui } from './ui.js';

const Q = new URLSearchParams(location.search);
const SCENE = Q.get('scene') || 'hero';
const T = parseFloat(Q.get('t') ?? '0.5');

async function fonts() {
  const want = [
    '112px "Dela Gothic One"',
    '500 15px "Zen Kaku Gothic New"',
    '700 15px "Zen Kaku Gothic New"',
    '500 20px "Onest"',
    '400 20px "Onest"',
    '600 20px "Onest"',
    '500 12px "IBM Plex Mono"',
  ];
  await Promise.all(want.map((f) => document.fonts.load(f, 'AOʻ絣止経日')));
  await document.fonts.ready;
}

function looseLength(H, D, bend, k) {
  const sy = (d) => {
    const z = -(d * k + 0.0006 * d * d);
    const Y = H / 2 - (bend + d);
    return H / 2 - (Y * D) / (D - z);
  };
  let a = 0, b = 6000;
  for (let n = 0; n < 50; n++) {
    const m = (a + b) / 2;
    sy(m) < H ? (a = m) : (b = m);
  }
  return a;
}

async function boot() {
  await fonts();
  const W = innerWidth, H = innerHeight;
  const mobile = W < 700;
  const threads = mobile ? 96 : 240;
  const pitch = W / threads;
  const D = H / 2 / Math.tan(THREE.MathUtils.degToRad(15));

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(parseFloat(Q.get('pr') ?? '2'));
  renderer.setSize(W, H);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  document.getElementById('stage').appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(C.loom);
  const camera = new THREE.PerspectiveCamera(30, W / H, 10, D * 6);
  camera.position.set(0, 0, D);
  scene.environment = studioEnv(renderer);
  const key = new THREE.DirectionalLight(0xfff2e0, 1.4);
  key.position.set(-0.45, 0.75, 1.0);
  scene.add(key);
  scene.add(new THREE.HemisphereLight(0xf4ecdc, 0x16121c, 0.55));

  const cart = createCartoon(W, H);
  let cfg, extra = [], layout;

  if (SCENE === 'hero' && !mobile) {
    const fell = 756;
    layout = paintHeroDesktop(cart, { p1At: fell });
    cfg = { pitch, fell, bend: fell, jiyak: 15, ampAbr: 7, recede: 0.7, looseOrigin: fell + 30, looseScale: 2.4, ampL: 60, sweep: 1500, time: 9.4 };
    const b = makeBlade({ W, H, fellY: fell });
    b.glint.value = W * 0.58;
    extra.push(b.group);
    if (Q.get('hover')) {
      // the visitor's hand: a sweep from upper left that ends resting on OʻZBEKISTONDA!
      const mx = 792, my = 486;
      const path = [];
      for (let k = 0; k < 12; k++) {
        const s = k / 11; // 0 = now (cursor), 1 = oldest
        const x = mx - s * 560, y = my - 250 * Math.pow(s, 0.8) + Math.sin(s * 3.2) * 34;
        const age = s * 1.05;
        path.push([x, y, 64 + 30 * s, 26 * Math.exp(-age / 1.2) * (k === 0 ? 0.8 : 0.42)]);
      }
      cfg.trail = path;
      cfg.light = [0.05, 0.12, 1.0];
      cfg.lightPos = [mx, my];
      cfg.sweep = mx + my * 0.75;
      layout.cursor = [mx, my];
    }
  } else if (SCENE === 'hero' && mobile) {
    const fell = 726;
    layout = paintHeroPhone(cart, { p1At: fell });
    cfg = { pitch, fell, bend: fell, jiyak: 10, ampAbr: 3.5, fade: 70, recede: 0.7, looseOrigin: fell + 30, looseScale: 2.6, ampL: 40, sweep: 700, time: 9.4, lightPos: [W * 0.25, H * 0.2] };
    const b = makeBlade({ W, H, fellY: fell, scale: 0.75, tsubaX: 34, tipMargin: 14 });
    b.glint.value = W * 0.6;
    extra.push(b.group);
  } else if (SCENE === 'weave') {
    // load sequence, ~3.0s: the blade is beating the page into place
    const fell = mobile ? 360 : Math.round((330 + ((Q.get('t') == null ? 1 : T) - 0.5) * 200) / 3) * 3;
    layout = mobile ? paintHeroPhone(cart, { p1At: null }) : paintHeroDesktop(cart, { p1At: null });
    cfg = { pitch, fell, bend: fell, jiyak: 0, recede: 0.55, looseOrigin: fell, looseScale: 1.0, ampL: 7, ampW: 1.2, sweep: -400, time: 3.0, fade: 330, nearW: 0.31, nearD: 260, fresh: 3.5 };
    const b = mobile ? makeBlade({ W, H, fellY: fell, scale: 0.75, tsubaX: 34, tipMargin: 14 }) : makeBlade({ W, H, fellY: fell });
    b.glint.value = W * 0.3;
    extra.push(b.group);
  } else if (SCENE === 'stripes') {
    const top = 96, sh = 94;
    layout = paintStripes(cart, { top, sh });
    const k = 3; // stripes 0..2 woven, stripe 3 (BACKEND) being laid
    const fell = top + k * sh, bend = top + (k + 1) * sh;
    const shuttleX = Math.round(W * (0.3 + 0.4 * T));
    cfg = { pitch, fell, bend, pick: [fell, bend, shuttleX, 1], jiyak: 0, recede: 0.6, looseOrigin: bend, looseScale: 0.5, ampL: 22, sweep: 1700, time: 5.4, fade: 150 };
    const b = makeBlade({ W, H, fellY: bend + 2 });
    b.glint.value = W * 0.8;
    extra.push(b.group);
    extra.push(makeShuttle({ x: shuttleX + 66 * 1.45, y: fell + sh / 2, W, H, bobbin: STRIPES[k].g, scale: 1.45 }));
    layout.shuttleX = shuttleX;
    layout.k = k;
  } else if (SCENE === 'jidoka') {
    const fell = 756, lift = 10;
    paintJidoka(cart);
    const ti = 149;
    const tx = (ti + 0.5) * pitch;
    const brk = Math.round(H * 0.42);
    cfg = { pitch, fell, bend: fell + lift, jiyak: 0, ampW: 8, recede: 0.8, looseOrigin: fell, looseScale: 1.0, ampL: 28, signal: [ti, brk, 0, 1], andon: [1322, 200, 0.2, 300], sweep: 2200, time: 0, light: [-0.2, 0.3, 1.0], lightPos: [W * 0.85, H * 0.15] };
    const b = makeBlade({ W, H, fellY: fell, lift });
    b.glint.value = -200;
    extra.push(b.group);
    extra.push(makeAndon({ x: 1322, y: 200, W, H }));
    // upper broken end: recoiled and curled out of the cloth
    extra.push(
      makeThread(
        [
          [tx, brk - 30, 0.5], [tx, brk - 8, 1.5], [tx + 1, brk + 6, 6], [tx + 7, brk + 18, 16], [tx + 19, brk + 21, 26],
          [tx + 27, brk + 12, 32], [tx + 23, brk + 1, 38], [tx + 12, brk + 3, 42], [tx + 9, brk + 14, 46], [tx + 16, brk + 24, 49], [tx + 26, brk + 30, 50],
        ],
        { W, H }
      )
    );
    // frayed fibres at the tip
    for (const [dx, dy] of [[6, 7], [8, 2], [3, 9]])
      extra.push(makeThread([[tx + 26, brk + 30, 50], [tx + 26 + dx * 0.5, brk + 30 + dy * 0.5, 50.5], [tx + 26 + dx, brk + 30 + dy, 51]], { W, H, radius: 0.55 }));
    // lower end: slack, looped on the fell
    extra.push(
      makeThread(
        [
          [tx, fell + 40, 1], [tx, fell + 8, 6], [tx + 1, fell - 10, 12], [tx + 8, fell - 30, 22], [tx + 22, fell - 34, 30], [tx + 30, fell - 20, 34],
          [tx + 22, fell - 6, 38], [tx + 6, fell - 8, 40], [tx - 4, fell - 22, 42], [tx - 10, fell - 40, 40], [tx - 6, fell - 58, 38], [tx + 2, fell - 64, 37],
        ],
        { W, H }
      )
    );
    for (const [dx, dy] of [[5, -6], [-2, -8], [7, -2]])
      extra.push(makeThread([[tx + 2, fell - 64, 37], [tx + 2 + dx * 0.5, fell - 64 + dy * 0.5, 37.2], [tx + 2 + dx, fell - 64 + dy, 37.4]], { W, H, radius: 0.55 }));
    layout = { brk, tx };
  }

  cfg.looseLen = looseLength(H, D, cfg.bend ?? cfg.fell, cfg.recede ?? 1.2);
  const cloth = makeCloth({ W, H, cart, cfg });
  scene.add(cloth.mesh);
  extra.forEach((o) => scene.add(o));

  document.getElementById('ui').innerHTML = ui(SCENE, { W, H, mobile, cfg, layout });
  document.documentElement.dataset.scene = SCENE;
  document.documentElement.classList.toggle('m', mobile);

  if (Q.get('debug') === 'cart') {
    cart.canvas.style.cssText = 'position:fixed;inset:0;z-index:99;width:100%;opacity:.5';
    document.body.appendChild(cart.canvas);
  }

  renderer.compile(scene, camera);
  let frames = 0;
  const live = Q.get('live') === '1';
  const t0 = performance.now();
  const tick = () => {
    if (live) cloth.uniforms.uTime.value = cfg.time + (performance.now() - t0) / 1000;
    renderer.render(scene, camera);
    frames++;
    if (live || frames < 3) requestAnimationFrame(tick);
    else document.documentElement.dataset.ready = '1';
  };
  tick();
}

boot().catch((e) => {
  console.error(e);
  document.body.insertAdjacentHTML('beforeend', `<pre style="position:fixed;bottom:0;left:0;color:#fff;z-index:999">${e.stack}</pre>`);
});
