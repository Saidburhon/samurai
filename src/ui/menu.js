// The phone menu sheet: slides down under the top bar; Escape or a tap outside closes it; focus stays inside
// while it is open and returns to the button on close.
export function initMenu() {
  const btn = document.querySelector('.nav .menu'), sheet = document.getElementById('menu'), html = document.documentElement;
  if (!btn || !sheet) return;
  let open = false, timer = 0;
  const focusables = () => [btn, ...sheet.querySelectorAll('a[href], button')];
  const set = (v, focusBack = true) => {
    if (v === open) return;
    open = v; clearTimeout(timer);
    btn.setAttribute('aria-expanded', String(v));
    html.classList.toggle('menu-open', v);
    if (v) {
      sheet.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add('open')));
      sheet.querySelector('a')?.focus({ preventScroll: true });
    } else {
      sheet.classList.remove('open');
      timer = setTimeout(() => { sheet.hidden = true; }, 560);
      if (focusBack) btn.focus({ preventScroll: true });
    }
  };
  btn.addEventListener('click', () => set(!open));
  sheet.addEventListener('click', (e) => { if (e.target.closest('a[href^="#"]')) set(false, false); });
  document.addEventListener('keydown', (e) => {
    if (!open) return;
    if (e.key === 'Escape') { e.preventDefault(); set(false); return; }
    if (e.key === 'Tab') {
      const f = focusables(), i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
  document.addEventListener('pointerdown', (e) => { if (open && !e.target.closest('#menu, .nav')) set(false, false); });
  matchMedia('(max-width: 860px)').addEventListener('change', (m) => { if (!m.matches) set(false, false); });
}
