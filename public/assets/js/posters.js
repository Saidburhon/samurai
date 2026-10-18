/* Qilich — the live bits of the product posters: Hoglt's day dial, PoolTimer's hall, the stack matrix */
(() => {
  'use strict';

  const doc = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // pick the Uzbek, English or Russian string for text this script writes itself (see i18n.js)
  const L = (uz, en, ru) => (doc.lang === 'en' ? en : doc.lang === 'ru' ? ru : uz);
  const onLang = fn => document.addEventListener('qilich:lang', fn);
  const pad = n => String(n).padStart(2, '0');
  const NS = 'http://www.w3.org/2000/svg';

  // run fn only while el is on screen
  function whenVisible(el, fn) {
    if (!('IntersectionObserver' in window)) { fn(true); return; }
    new IntersectionObserver(([e]) => fn(e.isIntersecting), { threshold: .15 }).observe(el);
  }

  /* ================================================================ HOGLT */
  function hoglt() {
    const dial = $('#dial');
    if (!dial) return;
    const arcs = $('#dialArcs'), ticks = $('#dialTicks');
    const hand = $('#dialHand'), knob = $('#dialKnob');
    const img = $('#dialImg'), timeEl = $('#dialTime'), stateEl = $('#dialState'), subEl = $('#dialSub');
    const legend = $$('#hgLegend li');

    // a school day, the way a parent sets it up in Hoglt
    const DAY = [[0, 7, 'sleep'], [7, 8, 'free'], [8, 14, 'school'], [14, 19, 'limit'], [19, 21, 'free'], [21, 24, 'sleep']];
    const IMG = { sleep: 'sleep', school: 'shield', limit: 'timer', free: 'wave' };
    Object.values(IMG).forEach(n => { new Image().src = `assets/img/hoglt/${n}.webp`; });

    const C = 200, R = 168;
    const pt = (h, r) => {
      const a = (h / 24) * Math.PI * 2 - Math.PI / 2;
      return [C + r * Math.cos(a), C + r * Math.sin(a)];
    };
    DAY.forEach(([a, b, s]) => {
      const gap = .06;
      const [x1, y1] = pt(a + gap, R), [x2, y2] = pt(b - gap, R);
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', `M${x1.toFixed(2)} ${y1.toFixed(2)} A${R} ${R} 0 ${b - a > 12 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`);
      p.setAttribute('class', 'arc-seg ' + s);
      arcs.appendChild(p);
    });
    for (let h = 0; h < 24; h++) {
      const major = h % 6 === 0;
      const [x1, y1] = pt(h, 196), [x2, y2] = pt(h, major ? 208 : 202);
      const l = document.createElementNS(NS, 'line');
      l.setAttribute('x1', x1); l.setAttribute('y1', y1); l.setAttribute('x2', x2); l.setAttribute('y2', y2);
      l.setAttribute('class', 'tick' + (major ? ' major' : ''));
      ticks.appendChild(l);
      if (major) {
        const [tx, ty] = pt(h, 131);
        const t = document.createElementNS(NS, 'text');
        t.setAttribute('x', tx); t.setAttribute('y', ty);
        t.textContent = pad(h);
        ticks.appendChild(t);
      }
    }
    hand.setAttribute('y1', C - R - 30);
    hand.setAttribute('y2', C - R + 30);
    knob.setAttribute('cy', C - R);

    const stateAt = h => DAY.find(([a, b]) => h >= a && h < b)[2];
    const textOf = (state, sel) => {
      const li = legend.find(l => l.dataset.state === state);
      return li ? $(sel, li).textContent : '';
    };

    let t = 8.5, shown = '';
    dial.setAttribute('role', 'slider');
    dial.setAttribute('tabindex', '0');
    dial.setAttribute('aria-valuemin', '0');
    dial.setAttribute('aria-valuemax', '1439');
    const cap = $('figcaption', dial);
    if (cap) { cap.id = 'dialCap'; dial.setAttribute('aria-labelledby', 'dialCap'); }

    function render(force) {
      const mins = Math.floor(t * 60) % 1440;
      const label = pad(Math.floor(mins / 60)) + ':' + pad(mins % 60);
      const rot = `rotate(${(t / 24 * 360).toFixed(2)} ${C} ${C})`;
      hand.setAttribute('transform', rot);
      knob.setAttribute('transform', rot);
      timeEl.textContent = label;
      const s = stateAt(t % 24);
      dial.setAttribute('aria-valuenow', String(mins));
      if (s === shown && !force) return;
      shown = s;
      img.src = `assets/img/hoglt/${IMG[s]}.webp`;
      stateEl.textContent = textOf(s, 'b');
      subEl.textContent = textOf(s, 'small');
      dial.setAttribute('aria-valuetext', `${label}, ${stateEl.textContent}`);
      legend.forEach(li => li.classList.toggle('is-on', li.dataset.state === s));
      dial.dataset.state = s;
    }
    render(true);
    onLang(() => render(true));

    // the day turns by itself until someone grabs it
    let auto = !reduce, visible = false, raf = 0, last = 0, resumeAt = 0;
    const loop = now => {
      raf = 0;
      if (!visible) return;
      if (auto && now > resumeAt) {
        const dt = last ? Math.min(100, now - last) : 16;
        t = (t + dt / 1000 * (24 / 16)) % 24;   // a full day in 16 seconds
        render();
      }
      last = now;
      raf = requestAnimationFrame(loop);
    };
    whenVisible(dial, v => {
      visible = v;
      last = 0;
      if (v && !raf && !reduce) raf = requestAnimationFrame(loop);
    });

    const hold = () => { resumeAt = performance.now() + 6000; };
    const fromPointer = e => {
      const r = dial.getBoundingClientRect();
      const a = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
      const h = ((a + Math.PI / 2) / (Math.PI * 2) * 24 + 24) % 24;
      t = Math.round(h * 4) / 4;   // snap to 15 minutes
      render();
      hold();
    };
    let dragging = false;
    dial.addEventListener('pointerdown', e => {
      dragging = true;
      dial.classList.add('is-drag');
      dial.setPointerCapture(e.pointerId);
      fromPointer(e);
    });
    dial.addEventListener('pointermove', e => { if (dragging) fromPointer(e); });
    const end = () => { dragging = false; dial.classList.remove('is-drag'); hold(); };
    dial.addEventListener('pointerup', end);
    dial.addEventListener('pointercancel', end);
    dial.addEventListener('keydown', e => {
      const step = { ArrowRight: .5, ArrowUp: .5, ArrowLeft: -.5, ArrowDown: -.5, PageUp: 3, PageDown: -3 }[e.key];
      if (step == null) return;
      e.preventDefault();
      t = (Math.round(t * 2) / 2 + step + 24) % 24;
      render();
      hold();
    });
    legend.forEach(li => li.addEventListener('click', () => {
      const seg = DAY.find(d => d[2] === li.dataset.state && d[1] - d[0] > 1) || DAY.find(d => d[2] === li.dataset.state);
      t = (seg[0] + seg[1]) / 2;
      render();
      hold();
    }));
  }

  /* =========================================================== POOLTIMER */
  function pooltimer() {
    const hall = $('#hall');
    if (!hall) return;
    const totalEl = $('#hallTotal'), tg = $('#tg'), tgText = $('#tgText');

    // one real second is one minute in the hall, like the demo on pooltimer.app
    const rate = vip => (doc.lang === 'en' ? (vip ? 14 : 9) : (vip ? 80000 : 50000));
    const money = v => {
      if (doc.lang === 'en') return '$' + v.toFixed(2);
      return Math.round(v / 500) * 500 > 0
        ? (Math.round(v / 500) * 500).toLocaleString('ru-RU').replace(/ /g, ' ') + ' ' + L('soʻm', 'so‘m', 'сум')
        : '0 ' + L('soʻm', 'so‘m', 'сум');
    };
    const clock = m => Math.floor(m / 60) + ':' + pad(Math.floor(m % 60));

    const tables = $$('.tbl', hall).map(el => ({
      el, n: el.dataset.n, vip: el.classList.contains('vip'),
      on: el.hasAttribute('data-run'), mins: Number(el.dataset.run || 0),
      time: $('.led b', el), cost: $('.cost', el)
    }));
    // already taken today, in hours of play, so it converts with the language
    let closedHours = 17.5;

    const costOf = tb => tb.mins / 60 * rate(tb.vip);
    function paint() {
      let total = closedHours * rate(false);
      tables.forEach(tb => {
        tb.el.classList.toggle('is-on', tb.on);
        tb.el.setAttribute('aria-pressed', String(tb.on));
        tb.time.textContent = clock(tb.mins);
        tb.cost.textContent = tb.on ? money(costOf(tb)) : L('boʻsh', 'free', 'свободен');
        if (tb.on) total += costOf(tb);
      });
      totalEl.textContent = money(total);
    }

    let hideTg = 0;
    function report(tb) {
      const name = tb.vip ? 'VIP' : L(`Stol ${tb.n}`, `Table ${tb.n}`, `Стол ${tb.n}`);
      tgText.textContent = L(`${name} yopildi · ${clock(tb.mins)} · ${money(costOf(tb))}`,
        `${name} closed · ${clock(tb.mins)} · ${money(costOf(tb))}`,
        `${name} закрыт · ${clock(tb.mins)} · ${money(costOf(tb))}`);
      tg.classList.add('is-on');
      clearTimeout(hideTg);
      hideTg = setTimeout(() => tg.classList.remove('is-on'), 4500);
    }

    tables.forEach(tb => tb.el.addEventListener('click', () => {
      if (tb.on) {
        closedHours += tb.mins / 60 * (tb.vip ? rate(true) / rate(false) : 1);
        report(tb);
        tb.on = false;
        tb.mins = 0;
      } else {
        tb.on = true;
        tb.mins = 0;
      }
      paint();
    }));
    paint();
    onLang(paint);

    let timer = 0, last = 0;
    whenVisible(hall, v => {
      clearInterval(timer);
      if (!v) return;
      last = performance.now();
      timer = setInterval(() => {
        const now = performance.now();
        const dm = (now - last) / 1000;
        last = now;
        tables.forEach(tb => { if (tb.on) tb.mins += dm; });
        paint();
      }, 250);
    });
  }

  /* =========================================================== MATRIX */
  function matrix() {
    const m = $('.matrix');
    if (!m) return;
    $$('.mx-row', m).forEach((row, r) => $$('i', row).forEach((dot, c) => {
      dot.style.setProperty('--d', (r * .06 + c * .05).toFixed(2) + 's');
    }));
    if (reduce || !('IntersectionObserver' in window)) { m.classList.add('in'); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { m.classList.add('in'); io.disconnect(); }
    }, { threshold: .25 });
    io.observe(m);
  }

  const init = () => { hoglt(); pooltimer(); matrix(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
