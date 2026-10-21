// The register (SOLUTIONS-SPEC §4.2): rows fold open like paper (their sheet comes from the rows file on the
// catalogue), the lens (industry re-orders and dims, the other filters narrow), the search across scripts
// (Cyrillic Uzbek folds to Latin, every okina variant matches, Russian finds the Russian titles) and the sort,
// whose rows slide like drawers (FLIP with WAAPI; they jump with reduced motion). The state lives in the URL.
import { fold } from '../shared/translit.js';

const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = 'cubic-bezier(.35,0,0,1)';

export function initRegister(cfg) {
  const rows = [...document.querySelectorAll('li.sr')];
  if (!rows.length) return;
  let file = null, fileP = null;
  const load = () => (fileP ||= cfg.rows ? fetch(cfg.rows).then((r) => r.json()).then((j) => (file = j)).catch(() => null) : Promise.resolve(null));
  // a row's sheet, filled on first open from the rows file
  const fill = (li) => {
    const dl = li.querySelector('dl[data-lazy]');
    if (!dl || !file?.rows?.[li.dataset.id]) return;
    const [sheet, est] = file.rows[li.dataset.id];
    dl.innerHTML = sheet;
    dl.removeAttribute('data-lazy');
    if (est) {
      const a = document.createElement('a');
      a.className = 'u'; a.href = est; a.textContent = file.estimate;
      li.querySelector('.sr-a')?.append(a);
    }
  };
  document.addEventListener('toggle', (e) => {
    const d = e.target;
    if (!(d instanceof HTMLDetailsElement) || !d.open) return;
    const li = d.closest('li.sr');
    if (!li) return;
    if (li.querySelector('dl[data-lazy]')) load().then(() => fill(li));
    if (!reduce()) li.querySelector('.sr-b')?.animate([{ transform: 'perspective(900px) rotateX(-8deg)', opacity: 0.4 }, { transform: 'none', opacity: 1 }], { duration: 450, easing: EASE, fill: 'none' }).finished.catch(() => {});
  }, true);
  // a group page opens its rows on a desktop; on a phone they start closed
  if (!cfg.rows && matchMedia('(max-width: 760px)').matches) for (const d of document.querySelectorAll('li.sr details[open]')) d.open = false;
  const idle = window.requestIdleCallback || ((f) => setTimeout(f, 200));
  if (cfg.rows) idle(() => load());

  const form = document.querySelector('form.lens');
  if (!form) return;
  const out = document.querySelector('.lens-out'), none = document.querySelector('.register .none');
  const starter = out.querySelector('.starter'), found = out.querySelector('.found');
  const chapters = [...document.querySelectorAll('.register .chap')];
  // words fold to one script; a query word matches the start of a word ("бот" finds "bot", "botlar", "боты", not "работы")
  const words = (s) => fold(s).replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  rows.forEach((r, i) => { r.dataset.i = i; r._hay = words(`${r.querySelector('h3').textContent} ${r.querySelector('.sr-o').textContent}`); });
  const stop = new Set(cfg.stop || []);
  const rate = cfg.rate?.uzs_per_usd || 12000;
  const keys = ['industry', 'goal', 'budget', 'weeks', 'platform', 'q'];
  let sort = '';
  const read = () => Object.fromEntries(keys.map((k) => [k, (form.elements[k]?.value || '').trim()]));
  const url = new URLSearchParams(location.search);
  for (const k of keys) if (url.has(k) && form.elements[k]) form.elements[k].value = url.get(k);
  if (url.has('sort')) sort = url.get('sort');

  const flip = (fn) => {
    const vis = rows.filter((r) => r.offsetParent);
    const before = new Map(vis.map((r) => [r, r.getBoundingClientRect().top]));
    fn();
    if (reduce()) return;
    for (const r of vis) {
      if (!r.offsetParent) continue;
      const d = before.get(r) - r.getBoundingClientRect().top;
      if (Math.abs(d) > 1 && Math.abs(d) < innerHeight * 2) r.animate([{ transform: `translateY(${d}px)` }, { transform: 'none' }], { duration: 450, easing: EASE });
    }
  };
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  function apply(push = true) {
    const st = read();
    const tokens = words(st.q).split(' ').filter((t) => t && !stop.has(t));
    if (tokens.length) load().then((f) => { if (f && !apply.indexed) { apply.indexed = true; apply(false); } });
    let shown = 0;
    for (const r of rows) {
      const d = r.dataset;
      const hay = ` ${r._hay} ${file?.index?.[d.id] || ''}`;
      const ok = (!tokens.length || tokens.every((t) => hay.includes(` ${t}`)))
        && (!st.goal || d.goal.split(' ').includes(st.goal))
        && (!st.platform || d.pl.split(' ').includes(st.platform))
        && (!st.budget || (!d.m && (cfg.lang === 'ja' ? +d.p : +d.p * rate) <= +st.budget))
        && (!st.weeks || (!d.m && +d.w <= +st.weeks));
      r.hidden = !ok;
      const rel = !st.industry || d.ind.split(' ').some((x) => x === st.industry || x === 'any');
      r.classList.toggle('dim', !rel);
      r.classList.toggle('hit', ok && tokens.length > 0);
      r._rel = rel;
      if (ok) shown++;
    }
    flip(() => {
      for (const ch of chapters) {
        const ol = ch.querySelector('ol');
        const list = [...ol.children];
        const k = sort === 'weeks' ? 'w' : sort === 'price' ? 'p' : sort === 'difficulty' ? 'd' : 'i';
        list.sort((a, b) => (b._rel - a._rel) || (+a.dataset[k] - +b.dataset[k]) || (+a.dataset.i - +b.dataset.i));
        for (const li of list) ol.append(li);
        ch.hidden = !list.some((li) => !li.hidden);
      }
    });
    const active = keys.some((k) => st[k]);
    out.hidden = !active;
    found.textContent = active ? (cfg.t.found || '{n}').replace('{n}', shown) : '';
    none.hidden = shown > 0;
    const s = st.industry && cfg.starters?.[st.industry];
    starter.hidden = !s;
    if (s) starter.innerHTML = `${esc(s.line)} ${s.items.map(([, t, u]) => `<a class="u" href="${esc(u)}">${esc(t)}</a>`).join(', ')}; <span class="mono">${esc(s.together)}</span>. <a class="u go" href="${esc(s.href)}">${esc(s.go)}</a>`;
    for (const b of document.querySelectorAll('.sort [data-sort]')) b.setAttribute('aria-pressed', String(b.dataset.sort === sort));
    if (push) {
      const p = new URLSearchParams();
      for (const k of keys) if (st[k]) p.set(k, st[k]);
      if (sort) p.set('sort', sort);
      history.replaceState(null, '', `${location.pathname}${p.toString() ? `?${p}` : ''}${location.hash}`);
    }
  }
  form.addEventListener('submit', (e) => { e.preventDefault(); apply(); });
  form.addEventListener('change', () => apply());
  let t;
  form.elements.q?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => apply(), 160); });
  form.elements.q?.addEventListener('focus', () => load(), { once: true });
  for (const b of document.querySelectorAll('.sort [data-sort]')) b.addEventListener('click', () => { sort = b.dataset.sort; apply(); });
  out.querySelector('.clear')?.addEventListener('click', () => { form.reset(); sort = ''; apply(); });
  if (keys.some((k) => url.get(k)) || sort) apply(false);
}
