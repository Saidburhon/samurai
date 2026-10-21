// The brief basket (SOLUTIONS-SPEC §4.6): "+ Smetaga" on every row and solution page, kept in the visitor's own
// localStorage (qilich.basket: [{ id, scope }]), and a tray on washi at the bottom that docks above the footer
// (position: sticky at the end of <main>, so it never covers the footer's contacts). The tray's figures come from
// the engine (./engine.js, loaded only when the basket is not empty): the combined range and weeks of plan().
const KEY = 'qilich.basket';
const read = () => { try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v.filter((x) => x && typeof x.id === 'string').slice(0, 12) : []; } catch { return []; } };
const write = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* private mode: the basket lives for this page only */ } };
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const PLUS = '<svg class="plus" viewBox="0 0 10 10" aria-hidden="true"><path d="M5 .5v9M.5 5h9"/></svg>';
const TICK = '<svg class="tick" viewBox="0 0 12 10" aria-hidden="true"><path d="M1 5.4l3.4 3.2L11 1.2"/></svg>';
const STRIKE = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1.5 1.5l9 9M10.5 1.5l-9 9"/></svg>';

export function initBasket(cfg) {
  const tray = document.getElementById('tray');
  if (!tray || !cfg.t) return;
  const T = cfg.t, B = T.basket, lang = cfg.lang;
  let items = read(), open = false, seq = 0;
  // a button on every register row (they are not in the HTML: without JS there is no basket)
  for (const li of document.querySelectorAll('li.sr:not([data-m])')) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'add'; b.dataset.add = li.dataset.id; b.setAttribute('aria-pressed', 'false');
    b.innerHTML = `<span class="a-off">${PLUS}${esc(T.add)}</span><span class="a-on">${TICK}${esc(T.added)}</span>`;
    li.append(b);
  }
  const buttons = () => document.querySelectorAll('button[data-add]');
  const sync = () => { const ids = new Set(items.map((x) => x.id)); for (const b of buttons()) b.setAttribute('aria-pressed', String(ids.has(b.dataset.add))); };
  const set = (v) => { items = v; write(items); sync(); render(); };
  document.addEventListener('click', (e) => {
    const b = e.target.closest?.('button[data-add]');
    if (!b) return;
    const id = b.dataset.add;
    set(items.some((x) => x.id === id) ? items.filter((x) => x.id !== id) : [...items, { id, scope: 'mvp' }]);
  });
  addEventListener('storage', (e) => { if (e.key === KEY) { items = read(); sync(); render(); } });

  async function render() {
    const my = ++seq;
    if (!items.length) { tray.hidden = true; tray.innerHTML = ''; document.documentElement.classList.remove('has-tray'); return; }
    let r;
    try { const { loadModel, totals } = await import('./engine.js'); const m = await loadModel(cfg.data); r = totals(m, items, lang, cfg.rate); } catch { r = null; }
    if (my !== seq) return;
    if (!r || !r.count) { tray.hidden = true; return; }
    const list = r.lines.map((x) => `<li data-id="${esc(x.id)}"><span class="t">${esc(x.title)}</span><span class="sw" role="group"><button type="button" data-scope="mvp" aria-pressed="${x.scope === 'mvp'}">${esc(T.mvp)}</button><button type="button" data-scope="full" aria-pressed="${x.scope === 'full'}">${esc(T.full)}</button></span><span class="f mono">${esc(x.weeks)} · ${esc(x.price)}</span><button type="button" class="rm" aria-label="${esc(B.remove)}: ${esc(x.title)}">${STRIKE}</button></li>`).join('');
    const ids = r.lines.map((x) => x.id).join(',');
    const body = [B.body, ...r.lines.map((x) => `- ${x.title} (${x.scope === 'mvp' ? T.mvp : T.full}): ${x.weeks}, ${x.price}`), `${B.total}: ${r.weeks}, ${r.price[0]} (${r.price[1]})`, location.href.split('?')[0]].join('\n');
    tray.hidden = false;
    document.documentElement.classList.add('has-tray');
    tray.classList.toggle('open', open);
    tray.innerHTML = `<div class="tr-bar"><p class="tr-n">${esc(B.n.replace('{n}', r.count))}</p><p class="tr-sum mono"><b>${esc(r.price[0])}</b> <span>${esc(r.price[1])}</span> · ${esc(r.weeks)}${r.saving ? ` · <span class="sv">${esc(B.shared)}</span>` : ''}</p><button type="button" class="tr-tg mono" aria-expanded="${open}" aria-controls="tray-body">${esc(open ? B.close : B.open)}</button></div>
<div class="tr-body" id="tray-body"${open ? '' : ' hidden'}><ol class="tr-list">${list}</ol><p class="tr-acts"><a class="btn" href="${esc(cfg.samurai)}?solutions=${esc(ids)}"><span>${esc(B.check)}</span><svg aria-hidden="true"><use href="#kissaki"/></svg></a><a class="u" href="mailto:${esc(T.email)}?subject=${encodeURIComponent(B.subject)}&amp;body=${encodeURIComponent(body)}">${esc(B.send)}</a><button type="button" class="u clr">${esc(B.clear)}</button></p></div>`;
  }
  tray.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.classList.contains('tr-tg')) { open = !open; render(); return; }
    if (t.classList.contains('clr')) { open = false; set([]); return; }
    const li = t.closest('li[data-id]');
    if (!li) return;
    if (t.classList.contains('rm')) set(items.filter((x) => x.id !== li.dataset.id));
    else if (t.dataset.scope) set(items.map((x) => (x.id === li.dataset.id ? { ...x, scope: t.dataset.scope } : x)));
  });
  sync();
  render();
}
