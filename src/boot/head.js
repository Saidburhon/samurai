// Inlined in <head> (<script data-gen="head">), before the first paint: the mode classes.
//   js       JavaScript runs (no-js is the page as authored)
//   cinema   the WebGL scroll film: only with a real WebGL2 context, never with ?tier=0 (flow-forced);
//            the build ships it to visitors once the director exists (__CINEMA__); until then the dev hooks
//            ?beat=k (one hold, G1 poster test) and ?cinema=1 (the boot path, GL timing) turn it on
//   intro    the drawing inks itself (not with a hash, ?nointro, ?beat, ?og or reduced motion)
// It also anchors the intro to navigation start: if this ran late, the CSS animations are compressed (--k).
/* global __CINEMA__ */
(() => {
  const d = document.documentElement, q = new URLSearchParams(location.search);
  d.classList.remove('no-js'); d.classList.add('js');
  const tierQ = q.get('tier');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cinema = false, glName = null, glKeep = null;
  if ((__CINEMA__ || q.has('beat') || q.get('cinema') === '1') && tierQ !== '0') {
    try {
      // the probe asks for the stage's own attributes (gl/stage.js), so a software renderer can keep it
      const c = document.createElement('canvas'); c.width = c.height = 1;
      const g = c.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: true, stencil: false, preserveDrawingBuffer: false, powerPreference: 'high-performance' });
      if (g) {
        cinema = true;
        // the renderer's name, read once here for the tiers (core/tier.js)
        const x = g.getExtension('WEBGL_debug_renderer_info');
        glName = String(x ? g.getParameter(x.UNMASKED_RENDERER_WEBGL) : g.getParameter(g.RENDERER));
        // a software renderer (T2, no MSAA) keeps this context for the stage: created now, while the GPU process is
        // idle, it costs little; created after the gate it waits behind the page's frames (up to ~1.3 s measured)
        if (/swiftshader|llvmpipe|software/i.test(glName)) glKeep = { canvas: c, context: g };
        else { const l = g.getExtension('WEBGL_lose_context'); if (l) l.loseContext(); }
      }
    } catch (e) { cinema = false; }
  }
  if (cinema) d.classList.add('cinema');
  if (q.has('og')) d.classList.add('og');
  const intro = !reduce && !location.hash && !q.has('nointro') && !q.has('beat') && !q.has('og');
  if (intro) d.classList.add('intro');
  const t = performance.now();
  d.style.setProperty('--k', Math.max(0.375, Math.min(1, (800 - t) / 740)).toFixed(3));
  window.__qilich = { mode: cinema ? 'cinema' : 'flow', tier: cinema ? null : 0, beat: 0, name: 'mei.hero', poster: 0, glReady: false, atHold: true, idle: false, raysReady: false, cutReady: false, intro, glName, glKeep, boot: { head: Math.round(t) } };
})();
