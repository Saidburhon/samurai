/* Samurai — hero: blade trail, sparks, embers, parallax and the sliced sun */
(() => {
  'use strict';

  const hero = document.querySelector('.hero');
  const canvas = document.getElementById('heroCanvas');
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

  /* ---- sun cut on scroll ---- */
  const onScroll = () => {
    const p = Math.min(1, Math.max(0, scrollY / (H * .9 || 1)));
    hero.style.setProperty('--cut', p.toFixed(3));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (reduce) return;

  /* ---- parallax ---- */
  let px = 0, py = 0, tx = 0, ty = 0;
  hero.addEventListener('pointermove', e => {
    tx = (e.clientX / innerWidth - .5) * 2;
    ty = (e.clientY / innerHeight - .5) * 2;
  }, { passive: true });

  /* ---- embers ---- */
  const COUNT = innerWidth < 700 ? 32 : 70;
  const ember = initial => ({
    x: Math.random() * W,
    y: initial ? Math.random() * H : H + 10,
    r: Math.random() * 1.6 + .4,
    vy: -(Math.random() * .35 + .12),
    vx: (Math.random() - .5) * .15,
    a: Math.random() * .55 + .2,
    f: Math.random() * Math.PI * 2,
    red: Math.random() < .75
  });
  const embers = Array.from({ length: COUNT }, () => ember(true));

  /* ---- blade ---- */
  const TRAIL_MS = 230;
  const trail = [];
  const sparks = [];
  hero.addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top, t = performance.now();
    const prev = trail[trail.length - 1];
    trail.push({ x, y, t });
    if (!prev) return;
    const dx = x - prev.x, dy = y - prev.y;
    const speed = Math.hypot(dx, dy) / Math.max(1, t - prev.t);
    if (speed > 1.4 && sparks.length < 180) {
      const n = Math.min(5, Math.floor(speed * 1.5));
      for (let i = 0; i < n; i++) {
        sparks.push({ x, y, vx: (Math.random() - .5) * 4 + dx * .06, vy: (Math.random() - .5) * 4 + dy * .06, life: 1 });
      }
    }
    // the blade pushes embers out of its way
    for (const p of embers) {
      const ex = p.x - x, ey = p.y - y, d2 = ex * ex + ey * ey;
      if (d2 < 3600 && d2 > 1) { const d = Math.sqrt(d2); p.x += ex / d * 6; p.y += ey / d * 6; }
    }
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { trail.length = 0; });

  /* ---- loop ---- */
  let visible = true, raf = 0;
  const loop = () => {
    raf = 0;
    if (!visible) return;
    const now = performance.now();

    px += (tx - px) * .06; py += (ty - py) * .06;
    hero.style.setProperty('--px', px.toFixed(3));
    hero.style.setProperty('--py', py.toFixed(3));

    ctx.clearRect(0, 0, W, H);

    for (const p of embers) {
      p.f += .03;
      p.x += p.vx + Math.sin(p.f) * .15;
      p.y += p.vy;
      if (p.y < -10 || p.x < -20 || p.x > W + 20) Object.assign(p, ember(false));
      const flick = .6 + Math.sin(p.f * 3) * .4;
      ctx.fillStyle = p.red ? `rgba(255,${90 + (p.r * 30 | 0)},60,${p.a * flick})` : `rgba(255,240,230,${p.a * flick * .55})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 6.2832);
      ctx.fill();
    }

    while (trail.length && now - trail[0].t > TRAIL_MS) trail.shift();
    if (trail.length > 1) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (let pass = 0; pass < 3; pass++) {
        for (let i = 1; i < trail.length; i++) {
          const a = trail[i - 1], b = trail[i];
          const life = Math.max(0, 1 - (now - b.t) / TRAIL_MS);
          if (pass === 0) { ctx.strokeStyle = `rgba(255,58,36,${life * .22})`; ctx.lineWidth = life * 22; }
          else if (pass === 1) { ctx.strokeStyle = `rgba(255,120,90,${life * .45})`; ctx.lineWidth = life * 8; }
          else { ctx.strokeStyle = `rgba(255,255,255,${life})`; ctx.lineWidth = life * 2.6; }
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx; s.y += s.vy; s.vy += .12; s.vx *= .97; s.life -= .03;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      ctx.fillStyle = `rgba(255,${150 + (s.life * 100 | 0)},${110 + (s.life * 80 | 0)},${s.life})`;
      ctx.fillRect(s.x, s.y, 2.2, 2.2);
    }

    raf = requestAnimationFrame(loop);
  };

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    }).observe(hero);
  }
  raf = requestAnimationFrame(loop);
})();
