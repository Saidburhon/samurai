// Flow mode (prefers-reduced-motion, or no WebGL): a normal document. Every scene shows its settled state,
// painted once on its own canvas, with the same real text on top. No smooth scroll, no scrubbing.
import { paintPanelCanvas } from './cartoon.js';

export function runFlow(L) {
  const layer = document.getElementById('layer');
  layer.querySelectorAll('canvas.bg').forEach((c) => c.remove());
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  for (const id of Object.keys(L.panels)) {
    const p = L.panels[id];
    const c = paintPanelCanvas(L, id, scale);
    c.className = 'bg';
    c.setAttribute('aria-hidden', 'true');
    Object.assign(c.style, { position: 'absolute', left: 0, top: p.y0 + 'px', width: '100%', height: p.h + 'px' });
    layer.insertBefore(c, layer.firstChild);
  }
  // the time scene shows its settled state: Tokyo four hours ahead, aligned by one instant
  const t = L.time, span = t.x1 - t.x0;
  document.querySelectorAll('#nums-tk span').forEach((sp) => {
    const x = (((+sp.dataset.h * t.hw - 4 * t.hw) % span) + span) % span;
    sp.style.left = (t.x0 + x).toFixed(1) + 'px';
    sp.style.visibility = x < 6 || x > span - 6 ? 'hidden' : 'visible';
  });
  const vis = (id) => { const e = document.getElementById(id); if (e) e.style.visibility = 'visible'; };
  ['needle', 'hanko', 'mei'].forEach(vis);
  document.getElementById('hdr').dataset.tl = 'light';
  document.getElementById('hdr').dataset.tr = 'light';
  document.documentElement.dataset.ready = '1';
}
