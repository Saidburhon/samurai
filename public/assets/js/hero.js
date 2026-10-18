/* Qilich — hero: the blade trail, sparks and the sun that splits as you scroll */
(() => {
  'use strict';

  const hero = document.querySelector('.p-hero');
  const sun = document.getElementById('sun');
  const canvas = document.getElementById('blade');
  if (!hero || !canvas) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = hero.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(hero);
  else addEventListener('resize', resize);

  /* ---- the sun splits further as you scroll ---- */
  if (sun) {
    let last = -1;
    const onScroll = () => {
      const p = Math.min(1, Math.max(0, scrollY / (H * .9 || 1)));
      if (Math.abs(p - last) < .002) return;
      last = p;
      sun.style.setProperty('--cut', p.toFixed(3));
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (reduce) return;

  /* ---- blade ---- */
  const TRAIL_MS = 200;
  const trail = [];
  const sparks = [];
  let raf = 0, visible = true;

  hero.addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top, t = performance.now();
    const prev = trail[trail.length - 1];
    trail.push({ x, y, t });
    if (prev) {
      const dx = x - prev.x, dy = y - prev.y;
      const speed = Math.hypot(dx, dy) / Math.max(1, t - prev.t);
      if (speed > 1.6 && sparks.length < 120) {
        const n = Math.min(4, Math.floor(speed));
        for (let i = 0; i < n; i++) {
          sparks.push({ x, y, vx: (Math.random() - .5) * 4 + dx * .05, vy: (Math.random() - .5) * 4 + dy * .05, life: 1 });
        }
      }
    }
    if (!raf && visible) raf = requestAnimationFrame(loop);
  }, { passive: true });
  // a new touch must not draw a line from where the previous one ended
  const resetTrail = () => { trail.length = 0; };
  hero.addEventListener('pointerleave', resetTrail);
  hero.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') resetTrail(); });
  hero.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') resetTrail(); });
  hero.addEventListener('pointercancel', resetTrail);

  /* ---- loop: runs only while something is on the canvas ---- */
  function loop() {
    raf = 0;
    const now = performance.now();
    ctx.clearRect(0, 0, W, H);

    while (trail.length && now - trail[0].t > TRAIL_MS) trail.shift();
    if (trail.length > 1) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 1; i < trail.length; i++) {
          const a = trail[i - 1], b = trail[i];
          const life = Math.max(0, 1 - (now - b.t) / TRAIL_MS);
          if (pass === 0) { ctx.strokeStyle = `rgba(255,58,36,${life * .9})`; ctx.lineWidth = life * 7; }
          else { ctx.strokeStyle = `rgba(255,255,255,${life})`; ctx.lineWidth = life * 2.2; }
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx; s.y += s.vy; s.vy += .14; s.vx *= .97; s.life -= .035;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      ctx.fillStyle = `rgba(255,${150 + (s.life * 100 | 0)},${110 + (s.life * 80 | 0)},${s.life})`;
      ctx.fillRect(s.x, s.y, 2, 2);
    }

    if (visible && (trail.length || sparks.length)) raf = requestAnimationFrame(loop);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hero);
  }
})();
