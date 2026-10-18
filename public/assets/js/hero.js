/* Qilich — hero: the blade trail and sparks, and a sun you can cut.
   Swipe fast across the sun (or click it): a clean cut along your stroke, the top slides along
   the blade, holds, and the sun heals whole again. */
(() => {
  'use strict';

  const hero = document.querySelector('.p-hero');
  const sun = document.getElementById('sun');
  const canvas = document.getElementById('blade');
  if (!hero || !canvas) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  const SFX = () => window.QSFX;
  let W = 0, H = 0;
  let disc = { x: 0, y: 0, r: 0 };   // the sun, in hero coordinates

  const measure = () => {
    if (!sun) return;
    const h = hero.getBoundingClientRect(), s = sun.getBoundingClientRect();
    disc = { x: s.left - h.left + s.width / 2, y: s.top - h.top + s.height / 2, r: s.width / 2 };
  };
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = hero.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    measure();
  };
  resize();
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(hero);
  else addEventListener('resize', resize);

  /* ---- the sun sinks a little as you scroll ---- */
  if (sun) {
    let last = -1;
    const onScroll = () => {
      const p = Math.min(1, Math.max(0, scrollY / (H * .9 || 1)));
      if (Math.abs(p - last) < .002) return;
      last = p;
      sun.style.setProperty('--sink', p.toFixed(3));
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (reduce) return;

  /* ---- state ---- */
  const TRAIL_MS = 200;
  const trail = [];
  const sparks = [];
  let raf = 0, visible = true;
  let ang = -11.3;                     // the current cut, in degrees
  let cutAt = -1, slideMax = 0, slideDir = 1;   // the cut in progress
  let lean = { x: 0, y: 0, tx: 0, ty: 0 };
  let lastCut = 0, lastAngle = -11.3;

  /* ---- the cut ---- */
  function cut(deg, speed, trusted) {
    const now = performance.now();
    if (now - lastCut < 700 || !sun) return;
    lastCut = now;
    // a line has no direction: keep the angle within ±90° and remember which way the blade went
    const raw = deg;
    deg = ((deg + 90) % 180 + 180) % 180 - 90;
    slideDir = Math.cos((raw - deg) * Math.PI / 180) > 0 ? 1 : -1;
    ang = deg;
    sun.style.setProperty('--ang', ang.toFixed(2) + 'deg');
    slideMax = 2.4 + Math.min(1, speed) * 2.6;
    cutAt = now;
    sun.classList.add('is-cutting');
    sun.classList.remove('is-slashing');
    void sun.offsetWidth;
    sun.classList.add('is-slashing');
    // a few sparks where the blade leaves the sun
    const rad = ang * Math.PI / 180, ux = Math.cos(rad) * slideDir, uy = Math.sin(rad) * slideDir;
    const ex = disc.x + ux * disc.r, ey = disc.y + uy * disc.r;
    for (let i = 0; i < 12; i++) {
      sparks.push({ x: ex, y: ey, vx: ux * (2 + Math.random() * 5) + (Math.random() - .5) * 2, vy: uy * (2 + Math.random() * 5) + (Math.random() - .5) * 2 - 1, life: 1 });
    }
    if (trusted && SFX()) { SFX().play('shing', { rate: .92 + Math.min(.3, speed * .12), gain: .8 }); SFX().buzz(12); }
    wake();
  }
  // does the stroke from a to b pass through the sun?
  const crosses = (ax, ay, bx, by) => {
    const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((disc.x - ax) * dx + (disc.y - ay) * dy) / L2));
    return Math.hypot(ax + dx * t - disc.x, ay + dy * t - disc.y) < disc.r * .9;
  };

  /* ---- pointer ---- */
  hero.addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top, t = performance.now();
    const prev = trail[trail.length - 1];
    trail.push({ x, y, t });
    if (prev) {
      const dx = x - prev.x, dy = y - prev.y;
      const speed = Math.hypot(dx, dy) / Math.max(1, t - prev.t);
      if (speed > 1.6 && sparks.length < 160) {
        const n = Math.min(4, Math.floor(speed));
        for (let i = 0; i < n; i++) sparks.push({ x, y, vx: (Math.random() - .5) * 4 + dx * .05, vy: (Math.random() - .5) * 4 + dy * .05, life: 1 });
      }
      if (Math.hypot(dx, dy) > 4) lastAngle = Math.atan2(dy, dx) * 180 / Math.PI;
      // a fast stroke through the sun cuts it along the stroke
      if (speed > 1.1 && Math.hypot(dx, dy) > 6 && crosses(prev.x, prev.y, x, y)) cut(lastAngle, speed, e.isTrusted);
    }
    if (e.pointerType === 'mouse') {
      lean.tx = (e.clientX / innerWidth - .5) * 2;
      lean.ty = (e.clientY / innerHeight - .5) * 2;
    }
    wake();
  }, { passive: true });

  // a click on the sun cuts it too, along the last direction the cursor moved
  hero.addEventListener('click', e => {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    if (Math.hypot(x - disc.x, y - disc.y) > disc.r) return;
    const deg = Math.abs(lastAngle - ang) < 8 ? ang + (Math.random() < .5 ? -1 : 1) * (25 + Math.random() * 30) : lastAngle;
    cut(deg, .8, e.isTrusted);
  });

  // a new touch must not draw a line from where the previous one ended
  const resetTrail = () => { trail.length = 0; };
  hero.addEventListener('pointerleave', () => { resetTrail(); lean.tx = 0; lean.ty = 0; wake(); });
  hero.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') resetTrail(); });
  hero.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') resetTrail(); });
  hero.addEventListener('pointercancel', resetTrail);
  addEventListener('scroll', measure, { passive: true });

  /* ---- loop: runs only while something moves ---- */
  let lastT = 0;
  function loop(now) {
    raf = 0;
    const dt = Math.min(40, now - (lastT || now - 16)) / 1000;
    lastT = now;
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
      s.x += s.vx; s.y += s.vy; s.vy += .14; s.vx *= .97; s.life -= .03;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      ctx.fillStyle = `rgba(255,${150 + (s.life * 100 | 0)},${110 + (s.life * 80 | 0)},${s.life})`;
      ctx.fillRect(s.x, s.y, 2.2, 2.2);
    }

    // the cut: the top half slides out along the blade (110ms), holds, then glides home and the sun heals
    if (cutAt >= 0 && sun) {
      const e = now - cutAt;
      let a;
      if (e < 110) a = 1 - Math.pow(1 - e / 110, 3);
      else if (e < 560) a = 1;
      else if (e < 1360) { const q = (e - 560) / 800; a = 1 - (q < .5 ? 4 * q * q * q : 1 - Math.pow(-2 * q + 2, 3) / 2); }
      else a = 0;
      sun.style.setProperty('--slide', (slideDir * slideMax * a).toFixed(3));
      sun.style.setProperty('--gap', (.45 * a).toFixed(3));
      if (e >= 1360) { cutAt = -1; sun.classList.remove('is-cutting'); }
    }

    // the sun leans a little towards the cursor
    lean.x += (lean.tx - lean.x) * (1 - Math.pow(.94, dt * 60));
    lean.y += (lean.ty - lean.y) * (1 - Math.pow(.94, dt * 60));
    if (sun) { sun.style.setProperty('--px', lean.x.toFixed(3)); sun.style.setProperty('--py', lean.y.toFixed(3)); }

    const moving = trail.length || sparks.length || cutAt >= 0 || Math.abs(lean.tx - lean.x) + Math.abs(lean.ty - lean.y) > .002;
    if (visible && moving) raf = requestAnimationFrame(loop);
    else lastT = 0;
  }
  function wake() { if (!raf && visible) raf = requestAnimationFrame(loop); }
  // the intro uses the same cut, silently
  window.QHERO = { cut: deg => cut(deg, .6, false) };

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { measure(); wake(); } }).observe(hero);
  }
})();
