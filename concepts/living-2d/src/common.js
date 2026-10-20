// shared helpers for scenes
import { kanjiStrokes, buildField, fieldToCanvas } from './fude.js';
import { nameSeal } from './seal.js';

export const OK = 'ʻ'; // U+02BB, Uzbek oʻ / gʻ
export const TT = 'ʼ'; // U+02BC tutuq belgisi
export const C = {
  washi: '#EEE6D4', washiDeep: '#E2D6BE', sumi: '#16120E', sumi60: '#5E554B', ai: '#1E2D66', aiLight: '#3A5BAA',
  aiDeep: '#111B44', kinu: '#EFE8D8', shu: '#D3462B', feruza: '#1E9C93',
};

export const expoOut = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
export const expoIn = (t) => (t <= 0 ? 0 : Math.pow(2, 10 * (t - 1)));
export const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export function el(tag, cls, html, parent) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  if (parent) parent.appendChild(e);
  return e;
}

export function clocks() {
  const f = (tz) => new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
  return { tash: f('Asia/Tashkent'), tok: f('Asia/Tokyo') };
}

// little brush 三 for the menu (written in stroke order)
export function menuMark(kvg, size, colour = [22, 18, 14]) {
  const box = { x: 4, y: 4, size };
  const st = kanjiStrokes(kvg['三'], box, { per: [{ W: size * 0.085 }, { W: size * 0.08 }, { W: size * 0.095 }] });
  const f = buildField(st, { W: size * 0.09, dry: 0.6, seed: 4, bleed: 0.1, rough: 0.35 });
  const c = fieldToCanvas(f, colour);
  c.style.left = f.x0 + 'px'; c.style.top = f.y0 + 'px';
  return c;
}

export function navBar(parent, kvg, opts = {}) {
  const nav = el('header', 'nav' + (opts.dark ? ' on-cloth' : ''), null, parent);
  const brand = el('a', 'brand', null, nav);
  const s = nameSeal(24, { k: 6 }); s.className = 'nseal'; brand.appendChild(s);
  el('span', 'word', 'QILICH', brand);
  const right = el('div', 'nav-r', null, nav);
  if (!opts.phone) {
    el('div', 'langs', '<span class="on">UZ</span><i>·</i><span>RU</span><i>·</i><span>EN</span>', right);
    el('div', 'bell', `<span>OVOZ</span><i></i>`, right);
  }
  const m = el('div', 'menu', null, right);
  const mk = menuMark(kvg, 30, opts.dark ? [239, 232, 216] : [22, 18, 14]);
  m.appendChild(mk);
  return nav;
}
