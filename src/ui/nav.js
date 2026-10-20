// Flow mode: the nav and the ruler are fixed bands that take the colour of the ground under them; the ruler
// names the scene in view and inks its segment by how far the visitor has read into it.
const DARK = new Set(['sumi', 'ro', 'mizu', 'ai']);

function groundAt(x, y) {
  for (const el of document.elementsFromPoint(x, y)) {
    if (el.closest('.nav, .ruler, .grain, #stage, .sheet-menu, .toast')) continue;
    const g = el.closest('#story [data-g], .foot');
    if (g) return g;
  }
  return null;
}
function paint(bar, el, prop) {
  if (!el) return;
  const g = el.matches('.foot') ? 'washi' : el.getAttribute('data-g');
  const theme = DARK.has(g) ? 'dark' : 'light';
  if (bar.dataset.theme !== theme) bar.dataset.theme = theme;
  const bg = getComputedStyle(el).getPropertyValue('--bg').trim() || '#ECE6DA';
  bar.style.setProperty(prop, bg);
}

export function initNav() {
  const nav = document.getElementById('nav'), ruler = document.querySelector('.ruler'), grain = document.querySelector('.grain');
  const items = [...ruler.querySelectorAll('li')];
  const scenes = items.map((li) => document.querySelector(li.querySelector('a').getAttribute('href')));
  let queued = false;
  const update = () => {
    queued = false;
    const W = window.innerWidth, H = window.innerHeight, y = window.scrollY;
    nav.classList.toggle('band', y > 8);
    paint(nav, groundAt(W / 2, Math.min(36, H / 2)), '--nav-bg');
    if (getComputedStyle(ruler).display !== 'none') paint(ruler, groundAt(W / 2, H - 20), '--ruler-bg');
    const mid = groundAt(W / 2, H / 2);
    if (grain && mid) grain.classList.toggle('dark', DARK.has(mid.matches('.foot') ? 'washi' : mid.getAttribute('data-g')));
    // the scene in view and how far into it
    let cur = 0;
    scenes.forEach((s, i) => { if (s && s.getBoundingClientRect().top <= H * 0.5) cur = i; });
    const r = scenes[cur].getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (H * 0.5 - r.top) / Math.max(1, r.height)));
    items.forEach((li, i) => { li.classList.toggle('on', i === cur); if (i === cur) li.style.setProperty('--p', (p * 100).toFixed(1) + '%'); });
    window.__qilich.scene = scenes[cur].id;
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  update();
}
