/* Qilich — the live parts of the posters: Hoglt's day dial and hedgehog, PoolTimer's hall,
   the stack matrix (pick your own platforms), the Tokyo–Tashkent day strips and the four strikes. */
(() => {
  'use strict';

  const doc = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  // pick the Uzbek, English or Russian string for text this script writes itself (see i18n.js)
  const L = (uz, en, ru) => (doc.lang === 'en' ? en : doc.lang === 'ru' ? ru : uz);
  const onLang = fn => document.addEventListener('qilich:lang', fn);
  const pad = n => String(n).padStart(2, '0');
  const NS = 'http://www.w3.org/2000/svg';
  const SFX = () => window.QSFX;
  // sounds answer real clicks and drags only, never scripted demos
  const play = (e, name, opt) => { if (e && e.isTrusted && SFX()) SFX().play(name, opt); };
  const buzz = (e, ms) => { if (e && e.isTrusted && SFX()) SFX().buzz(ms); };
  const restart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
  const inOut = x => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  // Uzbekistan is UTC+5 all year
  const tashHours = () => { const d = new Date(Date.now() + 5 * 3600e3); return d.getUTCHours() + d.getUTCMinutes() / 60; };

  function whenVisible(el, fn, threshold = .15) {
    if (!('IntersectionObserver' in window)) { fn(true); return; }
    new IntersectionObserver(([e]) => fn(e.isIntersecting), { threshold }).observe(el);
  }

  /* ================================================================ HOGLT */
  function hoglt() {
    const dial = $('#dial');
    if (!dial) return;
    const arcs = $('#dialArcs'), ticks = $('#dialTicks');
    const hand = $('#dialHand'), knob = $('#dialKnob');
    const hog = $('#hog'), img = $('#dialImg');
    const timeEl = $('#dialTime'), stateEl = $('#dialState'), subEl = $('#dialSub');
    const replay = $('#dialReplay');
    const legend = $$('#hgLegend li');

    // a school day, the way a parent sets it up in Hoglt
    const DAY = [[0, 7, 'sleep'], [7, 8, 'free'], [8, 14, 'school'], [14, 19, 'limit'], [19, 21, 'free'], [21, 24, 'sleep']];
    const IMG = { sleep: 'sleep', school: 'shield', limit: 'timer', free: 'wave' };
    const NOTE = { sleep: 0, school: 2, limit: 3, free: 5 };
    [...Object.values(IMG), 'curled'].forEach(n => { new Image().src = `assets/img/hoglt/${n}.webp`; });

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
      p.dataset.state = s;
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

    let t = tashHours(), shown = '', step = -1, curled = false;
    dial.setAttribute('role', 'slider');
    dial.setAttribute('tabindex', '0');
    dial.setAttribute('aria-valuemin', '0');
    dial.setAttribute('aria-valuemax', '1439');

    function render(force, e) {
      const h = ((t % 24) + 24) % 24;
      const mins = Math.floor(h * 60) % 1440;
      const label = pad(Math.floor(mins / 60)) + ':' + pad(mins % 60);
      const rot = `rotate(${(h / 24 * 360).toFixed(2)} ${C} ${C})`;
      hand.setAttribute('transform', rot);
      knob.setAttribute('transform', rot);
      timeEl.textContent = label;
      dial.setAttribute('aria-valuenow', String(mins));
      // a tick for every half hour the hand passes under your finger, pitched by the hour
      const st = Math.floor(h * 2);
      if (st !== step) { if (step !== -1) play(e, 'tick', { rate: .8 + h / 24 * .7, gain: .3 }); step = st; }
      const s = stateAt(h);
      if (s === shown && !force) return;
      const changed = s !== shown;
      shown = s;
      if (!curled) img.src = `assets/img/hoglt/${IMG[s]}.webp`;
      if (changed && !force) { restart(hog, 'pop'); buzz(e, 6); }
      stateEl.textContent = textOf(s, 'b');
      subEl.textContent = textOf(s, 'small');
      dial.setAttribute('aria-valuetext', `${label}, ${stateEl.textContent}`);
      legend.forEach(li => { const on = li.dataset.state === s; li.classList.toggle('is-on', on); if (on && changed && !force) restart(li, 'pop'); });
      $$('.arc-seg', arcs).forEach(p => p.classList.toggle('is-on', p.dataset.state === s));
      dial.dataset.state = s;
    }
    render(true);
    onLang(() => render(true));

    // glide the hand to a time, the long way round if asked
    let tween = 0;
    function glide(to, ms, e, done) {
      cancelAnimationFrame(tween);
      const from = t, t0 = performance.now();
      const run = now => {
        const p = Math.min(1, (now - t0) / ms);
        t = from + (to - from) * inOut(p);
        render(false, e);
        if (p < 1) tween = requestAnimationFrame(run);
        else if (done) done();
      };
      tween = requestAnimationFrame(run);
    }

    // once, when the poster comes into view: the whole day passes in under four seconds, ending on now
    let mode = 'live', idle = 0;
    const demo = e => {
      mode = 'demo';
      const now = tashHours();
      t = now - 24;
      render(true);
      glide(now, 3800, e, () => { mode = 'live'; });
      if (replay) restart(replay, 'spin');
    };
    if (reduce) render(true);
    else if ('IntersectionObserver' in window) {
      let played = false, timer = 0;
      new IntersectionObserver(([en]) => {
        clearTimeout(timer);
        if (en.isIntersecting && !played) timer = setTimeout(() => { played = true; demo(); }, 400);
      }, { threshold: .55 }).observe(dial);
    }
    // the hand keeps real Tashkent time, and drifts back to it after you let go
    setInterval(() => {
      if (mode === 'live') { t = tashHours(); render(); }
      else if (mode === 'manual' && performance.now() - idle > 10000) { mode = 'demo'; glide(tashHours() + (t - tashHours() > 12 ? 24 : 0), 900, null, () => { mode = 'live'; }); }
    }, 1000);
    if (replay) replay.addEventListener('click', e => { e.stopPropagation(); play(e, 'koto2', { gain: .6 }); demo(e); });

    const fromPointer = e => {
      const r = dial.getBoundingClientRect();
      const a = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
      const h = ((a + Math.PI / 2) / (Math.PI * 2) * 24 + 24) % 24;
      t = Math.round(h * 4) / 4;   // snap to 15 minutes
      render(false, e);
      idle = performance.now();
    };
    let dragging = false;
    dial.addEventListener('pointerdown', e => {
      if (e.target.closest('.hog, .replay')) return;
      cancelAnimationFrame(tween);
      mode = 'manual';
      dragging = true;
      dial.classList.add('is-drag');
      dial.setPointerCapture(e.pointerId);
      fromPointer(e);
    });
    dial.addEventListener('pointermove', e => {
      if (dragging) { fromPointer(e); return; }
      if (!fine) return;
      // the hedgehog leans towards the cursor
      const r = hog.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy), near = d < r.width * 1.4;
      hog.classList.toggle('is-hot', near);
      hog.style.setProperty('--hx', (near ? dx / (d || 1) * Math.min(10, d * .08) : 0).toFixed(1) + 'px');
      hog.style.setProperty('--hy', (near ? dy / (d || 1) * Math.min(8, d * .06) : 0).toFixed(1) + 'px');
    });
    dial.addEventListener('pointerleave', () => { hog.classList.remove('is-hot'); hog.style.setProperty('--hx', '0px'); hog.style.setProperty('--hy', '0px'); });
    const end = () => { dragging = false; dial.classList.remove('is-drag'); idle = performance.now(); };
    dial.addEventListener('pointerup', end);
    dial.addEventListener('pointercancel', end);
    dial.addEventListener('keydown', e => {
      const stepH = { ArrowRight: .5, ArrowUp: .5, ArrowLeft: -.5, ArrowDown: -.5, PageUp: 3, PageDown: -3 }[e.key];
      if (stepH == null) return;
      e.preventDefault();
      cancelAnimationFrame(tween);
      mode = 'manual';
      t = (Math.round(t * 2) / 2 + stepH + 24) % 24;
      render();
      idle = performance.now();
    });
    legend.forEach(li => li.addEventListener('click', e => {
      const seg = DAY.find(d => d[2] === li.dataset.state && d[1] - d[0] > 1) || DAY.find(d => d[2] === li.dataset.state);
      mode = 'manual';
      idle = performance.now();
      play(e, 'koto' + NOTE[li.dataset.state], { gain: .7 });
      let to = (seg[0] + seg[1]) / 2;
      const cur = ((t % 24) + 24) % 24;
      if (to - cur > 12) to -= 24;
      if (cur - to > 12) to += 24;
      t = cur;
      glide(to, 650);
    }));

    // poke the hedgehog: it curls into a ball, like the app it guards can't be removed
    if (hog) hog.addEventListener('click', e => {
      e.stopPropagation();
      if (curled) { restart(hog, 'shake'); play(e, 'thunk', { rate: 1.3, gain: .6 }); return; }
      curled = true;
      img.src = 'assets/img/hoglt/curled.webp';
      restart(hog, 'curl');
      play(e, 'thunk', { gain: .9 });
      buzz(e, 14);
      setTimeout(() => {
        curled = false;
        img.src = `assets/img/hoglt/${IMG[shown]}.webp`;
        restart(hog, 'pop');
      }, 3200);
    });
  }

  /* =========================================================== POOLTIMER */
  function pooltimer() {
    const hall = $('#hall');
    if (!hall) return;
    const totalEl = $('#hallTotal'), tg = $('#tg'), tgText = $('#tgText'), slips = $('#receipts');

    // one real second is one minute in the hall, like the demo on pooltimer.app
    const rate = vip => (doc.lang === 'en' ? (vip ? 14 : 9) : (vip ? 80000 : 50000));
    const money = v => {
      if (doc.lang === 'en') return '$' + v.toFixed(2);
      const r = Math.round(v / 500) * 500;
      return r.toLocaleString('ru-RU').replace(/ /g, ' ') + ' ' + L('soʻm', 'so‘m', 'сум');
    };
    const clock = m => Math.floor(m / 60) + ':' + pad(Math.floor(m % 60));

    const tables = $$('.tbl', hall).map(el => ({
      el, n: el.dataset.n, vip: el.classList.contains('vip'),
      on: el.hasAttribute('data-run'), mins: Number(el.dataset.run || 0),
      time: $('.led b', el), cost: $('.cost', el)
    }));
    // already taken today, in hours of play at the normal rate, so it converts with the language
    let closedHours = 17.5, flying = 0;

    const costOf = tb => tb.mins / 60 * rate(tb.vip);
    function paint() {
      let total = closedHours * rate(false) + flying;
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
    function report(name, mins, cost, e) {
      tgText.textContent = L(`${name} yopildi · ${clock(mins)} · ${money(cost)}`,
        `${name} closed · ${clock(mins)} · ${money(cost)}`,
        `${name} закрыт · ${clock(mins)} · ${money(cost)}`);
      restart(tg, 'is-on');
      play(e, 'ding', { gain: .55 });
      clearTimeout(hideTg);
      hideTg = setTimeout(() => tg.classList.remove('is-on'), 4500);
    }

    // closing a table prints a receipt, which flies into today's total
    function receipt(tb, e) {
      const name = tb.vip ? 'VIP' : L(`Stol ${tb.n}`, `Table ${tb.n}`, `Стол ${tb.n}`);
      const mins = tb.mins, cost = costOf(tb);
      const addHours = tb.mins / 60 * (tb.vip ? rate(true) / rate(false) : 1);
      // the money is already in today's total; the slip only carries it there
      flying += cost;
      const done = () => {
        flying = Math.max(0, flying - cost);
        closedHours += addHours;
        paint();
        restart(totalEl, 'pop');
        report(name, mins, cost, e);
      };
      if (reduce || !slips) { done(); return; }
      const h = hall.getBoundingClientRect(), r = tb.el.getBoundingClientRect(), tr = totalEl.getBoundingClientRect();
      const slip = document.createElement('div');
      slip.className = 'slip mono';
      slip.innerHTML = `<b>${name}</b><span>${clock(mins)}</span><span>${money(cost)}</span>`;
      slip.style.left = (r.left - h.left + r.width / 2) + 'px';
      slip.style.top = (r.top - h.top + r.height * .2) + 'px';
      slips.appendChild(slip);
      play(e, 'print', { gain: .35 });
      requestAnimationFrame(() => slip.classList.add('is-printing'));
      setTimeout(() => {
        const sr = slip.getBoundingClientRect();
        slip.style.setProperty('--fx', (tr.left + tr.width / 2 - (sr.left + sr.width / 2)) + 'px');
        slip.style.setProperty('--fy', (tr.top + tr.height / 2 - (sr.top + sr.height / 2)) + 'px');
        slip.classList.add('is-flying');
      }, 950);
      setTimeout(() => { slip.remove(); done(); }, 1500);
    }

    tables.forEach(tb => tb.el.addEventListener('click', e => {
      if (tb.on) {
        play(e, 'knock', { rate: .82, gain: .9 });
        buzz(e, 8);
        receipt(tb, e);
        tb.on = false;
        tb.mins = 0;
      } else {
        play(e, 'knock', { rate: 1.15, gain: .9 });
        buzz(e, 8);
        tb.on = true;
        tb.mins = 0;
        // the smart plug switches the lamp on: a fluorescent flicker, then steady
        restart(tb.el, 'flick');
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

  /* ============================================================ MATRIX */
  // hover lights the row and column; the "Yours" column is yours to fill in, and the contact poster remembers it
  function matrix() {
    const m = $('.matrix');
    if (!m) return;
    const rows = $$('.mx-row', m);
    rows.forEach((row, r) => [...row.children].forEach((cell, c) => {
      cell.dataset.c = c;
      const dot = cell.matches('.dot') ? cell : $('.dot', cell);
      if (dot) dot.style.setProperty('--d', (r * .06 + c * .05).toFixed(2) + 's');
    }));
    m.addEventListener('pointerover', e => {
      const cell = e.target.closest('[data-c]');
      if (!cell) return;
      const row = cell.closest('.mx-row'), c = cell.dataset.c;
      rows.forEach(rw => rw.classList.toggle('hr', rw === row && !rw.classList.contains('mx-head')));
      $$('[data-c]', m).forEach(x => x.classList.toggle('hc', c !== '0' && x.dataset.c === c));
    });
    m.addEventListener('pointerleave', () => { rows.forEach(rw => rw.classList.remove('hr')); $$('.hc', m).forEach(x => x.classList.remove('hc')); });

    const picks = $$('button.you', m);
    const count = $('#mxCount');
    const announce = () => {
      const chosen = picks.filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.dataset.name);
      if (count) count.textContent = chosen.length ? chosen.length : '';
      document.dispatchEvent(new CustomEvent('qilich:stack', { detail: chosen }));
    };
    picks.forEach((b, i) => b.addEventListener('click', e => {
      const on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(on));
      restart(b, 'pop');
      play(e, 'koto' + Math.min(9, i + 1), { gain: on ? .8 : .45, rate: on ? 1 : .94 });
      buzz(e, 6);
      announce();
    }));

    if (reduce || !('IntersectionObserver' in window)) { m.classList.add('in'); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { m.classList.add('in'); io.disconnect(); setTimeout(() => m.classList.add('is-done'), 1400); }
    }, { threshold: .25 });
    io.observe(m);
  }

  /* ===================================================== TOKYO · TASHKENT */
  // two 24-hour strips on Tashkent's clock: when each office works, and the hours they share.
  // Drag across them and both clocks travel together.
  function strips() {
    const box = $('#strips');
    if (!box) return;
    const clocks = $$('.clock[data-tz]');
    const marker = $('.now', box);
    const rowsEl = $$('.strip', box);
    rowsEl.forEach(row => {
      const off = Number(row.dataset.off);   // hours ahead of Tashkent
      const cells = $('.cells', row);
      for (let h = 0; h < 24; h++) {
        const local = (h + off) % 24;
        const i = document.createElement('i');
        if (local >= 9 && local < 18) i.className = 'work';
        if (h >= 9 && h < 14) i.classList.add('both');
        cells.appendChild(i);
      }
    });

    let scrub = null, lastHour = -1;
    const show = h => {
      const frac = ((h % 24) + 24) % 24 / 24;
      marker.style.setProperty('--x', frac.toFixed(4));
      clocks.forEach(c => {
        const local = ((h + Number(c.dataset.tz) - 5) % 24 + 24) % 24;
        c.textContent = pad(Math.floor(local)) + ':' + pad(Math.floor((local % 1) * 60));
      });
    };
    const live = () => { if (scrub == null) show(tashHours()); };
    live();
    setInterval(live, 10e3);
    box.classList.toggle('is-scrub', false);

    const at = e => {
      const cells = $('.cells', rowsEl[0]).getBoundingClientRect();
      const p = Math.min(.9999, Math.max(0, (e.clientX - cells.left) / cells.width));
      return Math.round(p * 24 * 4) / 4;
    };
    const move = e => {
      scrub = at(e);
      box.classList.add('is-scrub');
      show(scrub);
      const hr = Math.floor(scrub);
      if (hr !== lastHour) { if (lastHour !== -1) play(e, 'tick', { rate: .8 + hr / 24 * .7, gain: .3 }); lastHour = hr; }
    };
    const leave = () => { scrub = null; lastHour = -1; box.classList.remove('is-scrub'); live(); };
    if (fine) {
      box.addEventListener('pointermove', move);
      box.addEventListener('pointerleave', leave);
    } else {
      box.addEventListener('pointerdown', e => { box.setPointerCapture(e.pointerId); move(e); });
      box.addEventListener('pointermove', e => { if (box.hasPointerCapture(e.pointerId)) move(e); });
      box.addEventListener('pointerup', leave);
      box.addEventListener('pointercancel', leave);
    }
    box.addEventListener('click', e => { if (fine) { restart(marker, 'pop'); play(e, 'rin', { gain: .4 }); } });
  }

  /* ========================================================= FOUR STRIKES */
  // each kanji is a stamp: it thunks, rings with ink, and plays the next note of the phrase
  function strikes() {
    $$('#steps .kj').forEach((k, i) => k.addEventListener('click', e => {
      restart(k, 'stamp');
      play(e, 'koto' + [0, 2, 3, 5][i], { gain: .9 });
      play(e, 'thunk', { rate: 1.6, gain: .35 });
      buzz(e, 10);
    }));
  }

  const init = () => { hoglt(); pooltimer(); matrix(); strips(); strikes(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
