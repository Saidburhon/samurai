// One quiet line at the bottom of the screen, gone after 1.6 s.
let timer = 0;
export function toast(text) {
  const el = document.querySelector('.toast');
  if (!el) return;
  el.textContent = text;
  el.classList.add('on');
  clearTimeout(timer);
  timer = setTimeout(() => el.classList.remove('on'), 1600);
}
