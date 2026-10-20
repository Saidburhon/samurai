// The language switch keeps the visitor's place: in flow mode the target page opens at the same scene,
// in cinema mode at the same beat (#b=<name>).
export function initLang() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('nav.lang a');
    if (!a || a.hasAttribute('aria-current') || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    const Q = window.__qilich || {};
    const tail = Q.mode === 'cinema' ? (Q.name && Q.name !== 'mei.hero' ? '#b=' + Q.name : '') : (Q.scene && Q.scene !== 'mei' ? '#' + Q.scene : '');
    if (!tail) return;
    e.preventDefault();
    location.href = a.getAttribute('href') + tail;
  });
}
