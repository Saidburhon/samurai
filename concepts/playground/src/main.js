import { initGL, G } from './gl.js';
import { buildHero } from './hero.js';

const q = new URLSearchParams(location.search);
const sceneName = q.get('scene') || 'hero';
const T = q.has('t') ? parseFloat(q.get('t')) : null;
document.body.dataset.scene = sceneName;

// paper grain: a 256px noise tile drawn at runtime, multiplied over everything (DOM and WebGL read as one print)
function grain() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const x = c.getContext('2d'), d = x.createImageData(256, 256);
  let s = 7;
  for (let i = 0; i < d.data.length; i += 4) {
    s = (s * 16807) % 2147483647; const n = 150 + (s % 106);
    d.data[i] = n; d.data[i + 1] = n * .97; d.data[i + 2] = n * .92; d.data[i + 3] = 255;
  }
  x.putImageData(d, 0, 0);
  document.getElementById('grain').style.backgroundImage = `url(${c.toDataURL()})`;
}

async function boot() {
  await Promise.all([
    document.fonts.load('82px "Dela Gothic One"'), document.fonts.load('82px QOkinaDela', 'ʻ'),
    document.fonts.load('800 15px "M PLUS Rounded 1c"'), document.fonts.load('500 15px "M PLUS Rounded 1c"'), document.fonts.load('900 15px "M PLUS Rounded 1c"'),
  ]);
  await document.fonts.ready;
  grain();
  initGL(document.getElementById('gl'));
  let S;
  if (sceneName === 'hero') S = buildHero();
  else if (sceneName === 'hours') S = (await import('./hours.js')).buildHours();
  else if (sceneName === 'contact') S = (await import('./contact.js')).buildContact();
  const render = () => G.renderer.render(G.scene, G.camera);
  if (T !== null) {
    S.at(T); render();
    document.documentElement.dataset.ready = '1';
    return;
  }
  const t0 = performance.now();
  const loop = () => { S.at((performance.now() - t0) / 1000); render(); requestAnimationFrame(loop); };
  loop();
}
boot().catch(e => { console.error(e); document.body.dataset.err = e.message; });
