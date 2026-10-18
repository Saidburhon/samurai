/* Qilich — shared feel: the ink-dot fields, letters that lift and hop, tilting tiles.
   Each [data-field] surface gets a canvas of dots that answers the cursor in its own way. */
(() => {
  'use strict';

  const doc = document.documentElement;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const SFX = () => window.QSFX;

  // replay a CSS animation even if it is still running
  const restart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
  // frame-rate independent easing towards a target
  const ease = (rate, dt) => 1 - Math.pow(1 - rate, dt / 16.7);
  const smooth = x => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

  // hover effects pause while the page scrolls, so reading stays calm
  let pointing = false;
  addEventListener('mousemove', () => { if (!pointing) { pointing = true; doc.classList.add('is-pointing'); } }, { passive: true });
  addEventListener('scroll', () => { if (pointing) { pointing = false; doc.classList.remove('is-pointing'); } }, { passive: true });

  /* ================================================================ FIELDS */
  // m: the dot's offset from the cursor and how strongly it is touched (0..1); returns [dx, dy, grow, lit]
  // how hard the dots answer: kept low so the fields stay in the background
  const MOVE = .5, GROW = .45, LIT = .5, HI_ALPHA = .55;

  const MODES = {
    // the blade parts the dots sideways as it passes
    cut(dx, dy, a, f) {
      const sp = Math.min(1.6, f.speed);
      if (sp < .05) return [0, 0, a * .4, a * .3];
      const nx = -f.uy, ny = f.ux;
      const side = Math.sign(dx * nx + dy * ny) || 1;
      const push = a * 16 * sp;
      return [nx * side * push, ny * side * push, a * 1.2, a * Math.min(1, sp)];
    },
    // ink blooms and pushes outwards
    bloom(dx, dy, a, f, d) {
      const k = a * 7 / (d || 1);
      return [dx * k, dy * k, a * 2.4, a];
    },
    // the dots turn around the cursor like a clock hand
    orbit(dx, dy, a) {
      const r = a * .75, c = Math.cos(r) - 1, s = Math.sin(r);
      return [dx * c - dy * s, dx * s + dy * c, a * 1.4, a];
    },
    // pulled in, like balls to a pocket
    magnet(dx, dy, a) {
      return [-dx * a * .32, -dy * a * .32, a * 1.8, a];
    },
    // a crosshair along the grid's row and column
    cross(dx, dy, a, f, d, S) {
      const row = Math.abs(dy) < S * .5, col = Math.abs(dx) < S * .5;
      const reach = smooth(1 - d / (f.R * 1.4));
      const on = (row || col) ? reach : 0;
      return [0, 0, on * 1.8 + a * .5, Math.max(on, a * .35)];
    },
    // ripples travelling east to west, Tokyo to Tashkent
    wave(dx, dy, a, f, d) {
      const w = Math.sin(d * .07 - f.t * .004);
      const k = a * w * 5 / (d || 1);
      return [dx * k, dy * k, a * (1 + w), a * (.5 + .5 * w)];
    },
    // a vertical cut: dots fall away from the seam
    split(dx, dy, a, f, d, S) {
      const along = smooth(1 - Math.abs(dy) / (f.R * 1.8)) * f.amt;
      const across = smooth(1 - Math.abs(dx) / (f.R * .6));
      const side = Math.sign(dx) || 1;
      const seam = Math.abs(dx) < S * 1.1 ? along : 0;
      return [side * along * across * 18, 0, seam * 1.4, seam];
    },
    // a heartbeat, twice per beat at 66 bpm
    pulse(dx, dy, a, f) {
      const ph = (f.t / 909) % 1;
      const beat = Math.exp(-((ph - .08) ** 2) / .002) + .6 * Math.exp(-((ph - .26) ** 2) / .002);
      return [0, 0, a * (.6 + beat * 2.6), a * (.3 + beat * .7)];
    }
  };

  function field(host) {
    const mode = MODES[host.dataset.field] || MODES.bloom;
    const cs = getComputedStyle(host);
    const S = parseFloat(cs.getPropertyValue('--dot-gap')) || 16;
    const canvas = document.createElement('canvas');
    canvas.className = 'field';
    canvas.setAttribute('aria-hidden', 'true');
    host.prepend(canvas);
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, cols = 0, rows = 0, ox = 0, oy = 0, dpr = 1;
    let rest = null;
    let colRest = '', colHi = '';

    const f = { x: -999, y: -999, tx: -999, ty: -999, amt: 0, want: 0, ux: 0, uy: 0, speed: 0, t: 0, R: 150 };
    const bursts = [];
    let raf = 0, lastT = 0, near = false, inside = false;

    function size() {
      const r = host.getBoundingClientRect();
      W = r.width; H = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (W * H * dpr * dpr > 3.5e6) dpr = Math.sqrt(3.5e6 / (W * H));
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(W / S) + 1; rows = Math.ceil(H / S) + 1;
      ox = (W - (cols - 1) * S) / 2; oy = (H - (rows - 1) * S) / 2;
      const c = getComputedStyle(host);
      colRest = c.getPropertyValue('--dot').trim() || 'rgba(255,255,255,.07)';
      colHi = c.getPropertyValue('--dot-hi').trim() || '#ff3a24';
      f.R = Math.max(90, Math.min(150, W * .1));
      // the resting grid is drawn once and copied every frame
      rest = document.createElement('canvas');
      rest.width = canvas.width; rest.height = canvas.height;
      const rc = rest.getContext('2d');
      rc.setTransform(dpr, 0, 0, dpr, 0, 0);
      rc.fillStyle = colRest;
      rc.beginPath();
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const x = ox + i * S, y = oy + j * S;
        rc.moveTo(x + 1, y); rc.arc(x, y, 1, 0, 6.2832);
      }
      rc.fill();
      draw(true);
    }

    function draw(full) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(rest, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (full && f.amt < .01 && !bursts.length) return;

      // only the box around the cursor (and any bursts) is redrawn
      let x0 = f.x - f.R * 2.4, x1 = f.x + f.R * 2.4, y0 = f.y - f.R * 2.4, y1 = f.y + f.R * 2.4;
      if (host.dataset.field === 'cross') { x0 = 0; x1 = W; y0 = 0; y1 = H; }
      if (host.dataset.field === 'split') { y0 = f.y - f.R * 2; y1 = f.y + f.R * 2; }
      bursts.forEach(b => { x0 = Math.min(x0, b.x - b.r - 40); x1 = Math.max(x1, b.x + b.r + 40); y0 = Math.min(y0, b.y - b.r - 40); y1 = Math.max(y1, b.y + b.r + 40); });
      if (f.amt < .01) { x0 = Infinity; x1 = -Infinity; y0 = Infinity; y1 = -Infinity; bursts.forEach(b => { x0 = Math.min(x0, b.x - b.r - 40); x1 = Math.max(x1, b.x + b.r + 40); y0 = Math.min(y0, b.y - b.r - 40); y1 = Math.max(y1, b.y + b.r + 40); }); }
      const i0 = Math.max(0, Math.floor((x0 - ox) / S)), i1 = Math.min(cols - 1, Math.ceil((x1 - ox) / S));
      const j0 = Math.max(0, Math.floor((y0 - oy) / S)), j1 = Math.min(rows - 1, Math.ceil((y1 - oy) / S));
      if (i1 < i0 || j1 < j0) return;
      ctx.clearRect(ox + i0 * S - S / 2, oy + j0 * S - S / 2, (i1 - i0 + 1) * S, (j1 - j0 + 1) * S);

      const dim = new Path2D(), hi = new Path2D();
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
        const x = ox + i * S, y = oy + j * S;
        let dx = x - f.x, dy = y - f.y;
        const d = Math.hypot(dx, dy);
        const a = f.amt * smooth(1 - d / f.R);
        let [mx, my, grow, lit] = mode(dx, dy, a, f, d, S);
        mx = mx || 0; my = my || 0;
        // click rings push the dots outwards as they pass
        for (const b of bursts) {
          const bx = x - b.x, by = y - b.y, bd = Math.hypot(bx, by) || 1;
          const w = Math.exp(-((bd - b.r) ** 2) / 700) * b.life * .7;
          mx += bx / bd * w * 6; my += by / bd * w * 6; grow += w * 1.4; lit = Math.max(lit, w);
        }
        const r = 1 + grow * GROW;
        mx *= MOVE; my *= MOVE;
        const p = lit > LIT ? hi : dim;
        p.moveTo(x + mx + r, y + my);
        p.arc(x + mx, y + my, r, 0, 6.2832);
      }
      ctx.fillStyle = colRest; ctx.fill(dim);
      ctx.fillStyle = colHi; ctx.globalAlpha = HI_ALPHA; ctx.fill(hi); ctx.globalAlpha = 1;
    }

    function loop(now) {
      raf = 0;
      const dt = lastT ? Math.min(64, now - lastT) : 16.7;
      lastT = now;
      f.t = now;
      if (f.x < -900) { f.x = f.tx; f.y = f.ty; }
      const px = f.x, py = f.y;
      const k = ease(.24, dt);
      f.x += (f.tx - f.x) * k; f.y += (f.ty - f.y) * k;
      const want = inside && pointing ? 1 : 0;
      f.amt += (want - f.amt) * ease(want > f.amt ? .09 : .06, dt);
      // the cursor's direction and speed, smoothed
      const vx = (f.x - px) / dt, vy = (f.y - py) / dt, sp = Math.hypot(vx, vy);
      f.speed += (sp - f.speed) * ease(.2, dt);
      if (sp > .02) { const kk = ease(.3, dt); f.ux += (vx / sp - f.ux) * kk; f.uy += (vy / sp - f.uy) * kk; const n = Math.hypot(f.ux, f.uy) || 1; f.ux /= n; f.uy /= n; }
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.r += dt * .8; b.life -= dt / 750;
        if (b.life <= 0) bursts.splice(i, 1);
      }
      draw(false);
      const busy = f.amt > .01 || bursts.length || (inside && pointing);
      if (busy && near) raf = requestAnimationFrame(loop);
      else { lastT = 0; draw(true); }
    }
    const wake = () => { if (!raf && near) raf = requestAnimationFrame(loop); };

    host.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = host.getBoundingClientRect();
      f.tx = e.clientX - r.left; f.ty = e.clientY - r.top;
      inside = true;
      wake();
    }, { passive: true });
    host.addEventListener('pointerleave', () => { inside = false; wake(); });
    host.addEventListener('pointerdown', e => {
      const r = host.getBoundingClientRect();
      bursts.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 4, life: 1 });
      if (bursts.length > 4) bursts.shift();
      wake();
    }, { passive: true });

    if ('ResizeObserver' in window) new ResizeObserver(() => requestAnimationFrame(size)).observe(host);
    else addEventListener('resize', size);
    new IntersectionObserver(([e]) => {
      near = e.isIntersecting;
      if (near) { if (!W) size(); wake(); }
    }, { rootMargin: '80px' }).observe(host);
    // colours can change with the language-independent theme only, so size() once is enough
  }

  /* =============================================================== LETTERS */
  // wrap each letter in a span, keeping words whole and nested markup (em, br, .ln) intact
  function split(el) {
    const walk = node => {
      [...node.childNodes].forEach(ch => {
        if (ch.nodeType === 3) {
          const frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement('span');
            w.className = 'wd';
            [...part].forEach(c => {
              const s = document.createElement('span');
              s.className = 'ch';
              s.textContent = c;
              w.appendChild(s);
            });
            frag.appendChild(w);
          });
          ch.replaceWith(frag);
        } else if (ch.nodeType === 1 && !ch.classList.contains('ch')) walk(ch);
      });
    };
    walk(el);
    return $$('.ch', el);
  }

  function letters(el) {
    let chars = split(el);
    let rects = [];
    const measure = () => {
      rects = chars.map(c => { const r = c.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2, r.height]; });
    };
    // click: a wave runs through the letters and the koto answers
    el.addEventListener('click', e => {
      chars.forEach((c, i) => { c.style.setProperty('--i', i); restart(c, 'hop'); });
      if (e.isTrusted && SFX()) SFX().chord(Number(el.dataset.note || 2));
    });
    el.addEventListener('animationend', e => e.target.classList.remove('hop'));

    if (fine && !reduce) {
      // letters near the cursor lift, and a second ink slips out from under them
      let raf = 0, mx = 0, my = 0, live = false;
      const frame = () => {
        raf = 0;
        if (!rects.length) measure();
        chars.forEach((c, n) => {
          const [x, y, h] = rects[n];
          const dx = x - mx, dy = y - my, d = Math.hypot(dx, dy);
          const reach = h * 1.25;
          const a = live && pointing ? smooth(1 - d / reach) : 0;
          const prev = Number(c.dataset.a || 0);
          if (Math.abs(a - prev) < .01) return;
          c.dataset.a = a.toFixed(2);
          c.style.setProperty('--lift', a.toFixed(3));
          c.style.setProperty('--sx', (a ? dx / (d || 1) : 0).toFixed(2));
          c.style.setProperty('--sy', (a ? dy / (d || 1) : 0).toFixed(2));
        });
      };
      const zone = el.closest('section') || el;
      zone.addEventListener('pointermove', e => {
        mx = e.clientX; my = e.clientY; live = true;
        if (!raf) raf = requestAnimationFrame(frame);
      }, { passive: true });
      zone.addEventListener('pointerenter', () => { measure(); });
      zone.addEventListener('pointerleave', () => { live = false; if (!raf) raf = requestAnimationFrame(frame); });
      addEventListener('scroll', () => { rects = []; }, { passive: true });
      addEventListener('resize', () => { rects = []; });
    }
    // the language switch replaces the text, so split it again
    document.addEventListener('qilich:lang', () => { chars = split(el); rects = []; });
  }

  /* ================================================================== TILT */
  // a spring that leans the tile towards the cursor and settles with a small overshoot
  function tilt(el) {
    let rx = 0, ry = 0, vx = 0, vy = 0, tx = 0, ty = 0, raf = 0, last = 0;
    const step = now => {
      raf = 0;
      const dt = Math.min(32, now - (last || now - 16)) / 1000;
      last = now;
      const k = 170, c = 14;
      vx += ((tx - rx) * k - vx * c) * dt; rx += vx * dt;
      vy += ((ty - ry) * k - vy * c) * dt; ry += vy * dt;
      // one axis-angle rotation, so it stacks with the tile's own transform
      const mag = Math.hypot(rx, ry);
      el.style.rotate = mag < .01 ? '' : `${(rx / mag).toFixed(3)} ${(ry / mag).toFixed(3)} 0 ${mag.toFixed(2)}deg`;
      if (Math.abs(tx - rx) + Math.abs(ty - ry) + Math.abs(vx) + Math.abs(vy) > .02) raf = requestAnimationFrame(step);
      else last = 0;
    };
    const go = () => { if (!raf) raf = requestAnimationFrame(step); };
    el.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      tx = ((e.clientY - r.top) / r.height - .5) * -10;
      ty = ((e.clientX - r.left) / r.width - .5) * 12;
      go();
    });
    el.addEventListener('pointerleave', () => { tx = 0; ty = 0; go(); });
  }

  function init() {
    if (!reduce) $$('[data-field]').forEach(field);
    $$('[data-letters]').forEach(letters);
    if (fine && !reduce) $$('[data-tilt]').forEach(tilt);
  }
  // after i18n.js has read the Uzbek text, so it never stores the letter spans
  document.addEventListener('DOMContentLoaded', init);

  window.QFX = { restart, smooth };
})();
