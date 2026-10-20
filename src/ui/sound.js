// The sound toggle (off by default). G0 keeps its state; the synthesised recipes arrive at G5.
const KEY = 'qilich.sound';
export function initSound() {
  const btns = [...document.querySelectorAll('button.sound')];
  let on = false;
  try { on = localStorage.getItem(KEY) === '1'; } catch (e) { on = false; }
  const set = (v) => {
    on = v;
    for (const b of btns) b.setAttribute('aria-pressed', String(v));
    try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) { /* private mode */ }
    window.__qilich.sound = v;
  };
  set(on);
  for (const b of btns) b.addEventListener('click', () => set(!on));
}
