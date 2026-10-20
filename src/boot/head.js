// Inlined in <head> (<script data-gen="head">), before the first paint: the mode classes.
//   js       JavaScript runs (no-js is the page as authored)
//   cinema   the WebGL scroll film: only with a real WebGL2 context, never with ?tier=0 (flow-forced);
//            the build ships it only once the GL code exists (__CINEMA__)
//   intro    the drawing inks itself (not with a hash, ?nointro, ?beat, ?og or reduced motion)
// It also anchors the intro to navigation start: if this ran late, the CSS animations are compressed (--k).
/* global __CINEMA__ */
(() => {
  const d = document.documentElement, q = new URLSearchParams(location.search);
  d.classList.remove('no-js'); d.classList.add('js');
  const tierQ = q.get('tier');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cinema = false;
  if (__CINEMA__ && tierQ !== '0') {
    try {
      const c = document.createElement('canvas'); c.width = c.height = 1;
      const g = c.getContext('webgl2');
      if (g) { cinema = true; const l = g.getExtension('WEBGL_lose_context'); if (l) l.loseContext(); }
    } catch (e) { cinema = false; }
  }
  if (cinema) d.classList.add('cinema');
  if (q.has('og')) d.classList.add('og');
  const intro = !reduce && !location.hash && !q.has('nointro') && !q.has('beat') && !q.has('og');
  if (intro) d.classList.add('intro');
  const t = performance.now();
  d.style.setProperty('--k', Math.max(0.375, Math.min(1, (800 - t) / 740)).toFixed(3));
  window.__qilich = { mode: cinema ? 'cinema' : 'flow', tier: cinema ? null : 0, beat: 0, name: 'mei.hero', poster: 0, glReady: false, atHold: true, idle: false, raysReady: false, cutReady: false, intro, boot: { head: Math.round(t) } };
})();
