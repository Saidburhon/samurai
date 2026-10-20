import { hero } from './hero.js';

const q = new URLSearchParams(location.search);
const scene = q.get('scene') || 'hero';
const t = q.has('t') ? parseFloat(q.get('t')) : null;

async function boot() {
  const W = innerWidth, H = innerHeight;
  const phone = W < 700;
  document.documentElement.classList.toggle('phone', phone);
  await Promise.all([
    document.fonts.load('300 120px "Noto Serif Display"'),
    document.fonts.load('italic 300 120px "Noto Serif Display"'),
    document.fonts.load('400 16px Onest'),
    document.fonts.load('500 16px Onest'),
    document.fonts.load('400 13px "IBM Plex Mono"'),
    document.fonts.load('500 13px "IBM Plex Mono"'),
    document.fonts.load('800 20px "Shippori Mincho B1"', '剣タシケント'),
    document.fonts.load('500 20px "Shippori Mincho B1"', '剣タシケント'),
  ]);
  const [kvg, glyphs] = await Promise.all([fetch('data/kanjivg.json').then((r) => r.json()), fetch('data/glyphs.json').then((r) => r.json())]);
  const layers = {
    cloth: document.getElementById('cloth'), under: document.getElementById('under'),
    paper: document.getElementById('paper'), over: document.getElementById('over'), fx: document.getElementById('fx'),
  };
  const S = { W, H, phone, kvg, glyphs, layers };
  const t0 = performance.now();
  if (scene === 'hero') await hero({ ...S, mode: { T: t ?? 16 } });
  else if (scene === 'cut') await hero({ ...S, mode: { cut: t ?? 0.5 } });
  else if (scene === 'wedge') await hero({ ...S, mode: { wedge: t ?? 0.72 } });
  else if (scene === 'glint') await hero({ ...S, mode: { glint: t ?? 0.7 } });
  else if (scene === 'bunbu') { const m = await import('./bunbu.js'); await m.bunbu({ ...S, t: t ?? 0.62 }); }
  else if (scene === 'tanzaku') { const m = await import('./tanzaku.js'); await m.tanzaku({ ...S, t: t ?? 1 }); }
  else if (scene === 'time') { const m = await import('./jikan.js'); await m.jikan({ ...S, t: t ?? 1 }); }
  document.documentElement.dataset.ready = '1';
  console.log('scene', scene, 'built in', Math.round(performance.now() - t0), 'ms');
}
boot().catch((e) => { console.error(e); document.body.dataset.err = e.message; });
