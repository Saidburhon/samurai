/* Samurai — interactive demos: Tikoncha, ClubTime, Safia, Bon!, Akfa, code typer */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const som = n => Math.round(n).toLocaleString('ru-RU').replace(/\s/g, ' ');
  const svgEl = (tag, attrs) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  };

  /* Segmented control: one active button, aria-pressed kept in sync */
  function seg(group, onPick) {
    if (!group) return;
    const btns = $$(':scope > button', group);
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => {
        x.classList.toggle('is-on', x === b);
        if (x.hasAttribute('aria-pressed')) x.setAttribute('aria-pressed', String(x === b));
      });
      onPick(b);
    }));
  }

  /* In-phone notification */
  function phoneToast(el) {
    let tm;
    return ({ kind = '', icon = 'i-check', title, text }) => {
      el.innerHTML = '';
      const ic = document.createElement('span');
      ic.className = 't-ic ' + kind;
      ic.innerHTML = `<svg class="i"><use href="#${icon}"/></svg>`;
      const body = document.createElement('div');
      const b = document.createElement('b');
      b.textContent = title;
      body.append(b, document.createTextNode(text));
      el.append(ic, body);
      el.classList.remove('is-on');
      void el.offsetWidth;
      el.classList.add('is-on');
      clearTimeout(tm);
      tm = setTimeout(() => el.classList.remove('is-on'), 2800);
    };
  }

  /* Plays a scripted walkthrough once the demo is on screen, until the visitor touches it */
  function autoplay(root, steps) {
    if (reduce || !('IntersectionObserver' in window)) return () => {};
    let cancelled = false, started = false;
    const timers = [];
    const cancel = () => { cancelled = true; timers.forEach(clearTimeout); };
    root.addEventListener('pointerdown', cancel, { capture: true, once: true });
    root.addEventListener('keydown', cancel, { capture: true, once: true });
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started || cancelled) return;
      started = true;
      io.disconnect();
      let t = 0;
      steps.forEach(([delay, fn]) => { t += delay; timers.push(setTimeout(() => { if (!cancelled) fn(); }, t)); });
    }, { threshold: .5 });
    io.observe(root);
    return cancel;
  }

  /* ================================================================ TIKONCHA */
  function tikoncha() {
    const root = $('#tkDemo');
    if (!root) return;
    const phone = $('.tk-phone', root);
    const toast = phoneToast($('.ph-toast', phone));
    const shield = $('.tk-shield', root);
    const ask = $('.tk-ask', root);
    const shieldApp = $('.tk-shield-app', root);
    const ring = $('.ring-fg', root);
    const apps = $$('.app', root);
    const MODES = {
      default: { name: 'Default mode', off: 38, usage: '1h 52m', toast: { kind: 'ok', icon: 'i-check', title: 'Default mode', text: 'Tracking only. Parents get a daily report.' } },
      gujanak: { name: "G'ujanak mode", off: 56, usage: '1h 18m', toast: { kind: 'gold', icon: 'i-geo', title: "G'ujanak is on", text: 'School geofence active, limits applied.' } },
      qalqon: { name: 'Qalqon mode', off: 76, usage: '0h 41m', toast: { kind: '', icon: 'i-shield', title: 'Qalqon is on', text: 'Distracting apps are shielded at OS level.' } }
    };
    const LIMITS = { Reels: 12, Games: 0, Videos: 25, Social: 8 };
    const API = {
      android: 'Android · AccessibilityService · UsageStatsManager · DeviceAdmin',
      ios: 'iOS · FamilyControls · ManagedSettings · DeviceActivity'
    };
    let mode = 'default';
    let pending = null;
    let askTimer;
    const granted = new Set();

    function setMode(m, silent) {
      mode = m;
      phone.dataset.mode = m;
      granted.clear();
      $('.tk-mode-name', root).textContent = MODES[m].name;
      $('.tk-usage', root).textContent = MODES[m].usage;
      $('.tk-trend', root).textContent = { default: '−12% vs last week', gujanak: '−38% vs last week', qalqon: '−64% vs last week' }[m];
      ring.style.setProperty('--off', MODES[m].off);
      apps.forEach(a => {
        a.classList.remove('is-granted');
        if (!a.dataset.bad) return;
        $('.app-badge', a).innerHTML = m === 'qalqon' ? '<svg class="i"><use href="#i-lock"/></svg>' : LIMITS[a.dataset.app] + 'm';
      });
      closeShield();
      $$('.tk-modes > button', root).forEach(b => {
        b.classList.toggle('is-on', b.dataset.mode === m);
        b.setAttribute('aria-pressed', String(b.dataset.mode === m));
      });
      if (!silent) toast(MODES[m].toast);
    }

    function closeShield() {
      clearTimeout(askTimer);
      shield.classList.remove('is-open');
      ask.classList.remove('is-wait');
      ask.textContent = 'Ask parent to unlock';
    }

    function openApp(a) {
      const name = a.dataset.app;
      a.animate([{ transform: 'scale(1)' }, { transform: 'scale(.9)' }, { transform: 'scale(1)' }], { duration: 260 });
      if (!a.dataset.bad || mode === 'default' || granted.has(name)) {
        const text = granted.has(name) ? '15 minutes granted by a parent.' : mode === 'default' ? 'Allowed. Usage is being tracked.' : 'Learning apps are always open.';
        toast({ kind: 'ok', icon: 'i-check', title: `Opening ${name}`, text });
        return;
      }
      if (mode === 'gujanak') {
        const left = LIMITS[name];
        toast(left > 0
          ? { kind: 'gold', icon: 'i-clock', title: `${name}: ${left} min left today`, text: "G'ujanak keeps the limit, at school and at home." }
          : { kind: '', icon: 'i-lock', title: `${name}: daily limit reached`, text: 'Try again tomorrow, or ask a parent.' });
        return;
      }
      pending = a;
      shieldApp.textContent = name;
      shield.classList.add('is-open');
    }

    function askParent() {
      if (!pending) return;
      ask.classList.add('is-wait');
      ask.textContent = 'Waiting for parent…';
      const a = pending;
      askTimer = setTimeout(() => {
        granted.add(a.dataset.app);
        a.classList.add('is-granted');
        $('.app-badge', a).textContent = '15m';
        closeShield();
        toast({ kind: 'tg', icon: 'i-send', title: 'Parent approved in Telegram', text: `+15 min for ${a.dataset.app}.` });
      }, 1700);
    }

    apps.forEach(a => a.addEventListener('click', () => openApp(a)));
    ask.addEventListener('click', askParent);
    $('.tk-close', root).addEventListener('click', closeShield);
    $$('.tk-modes > button', root).forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
    seg($('.tk-os', root), b => {
      phone.dataset.os = b.dataset.os;
      $('.tk-api', root).textContent = API[b.dataset.os];
    });
    setMode('default', true);

    const reels = apps.find(a => a.dataset.app === 'Reels');
    autoplay(root, [
      [900, () => setMode('gujanak')],
      [1500, () => openApp(reels)],
      [2600, () => setMode('qalqon')],
      [1700, () => openApp(reels)],
      [1800, askParent],
      [3200, () => openApp(reels)]
    ]);
  }

  /* ================================================================ CLUBTIME */
  function clubtime() {
    const root = $('#ctDemo');
    if (!root) return;
    const q = s => $(s, root);
    const ui = {
      floor: q('.ct-floor'), name: q('.ct-sel-name'), state: q('.ct-sel-state'), timer: q('.ct-timer'),
      cost: q('.ct-cost-v'), orders: q('.ct-orders'), go: q('.ct-go'), rev: q('.ct-rev'),
      active: q('.ct-active'), clock: q('.ct-clock'), receipt: q('.ct-receipt'), paper: q('.ct-paper'),
      tg: q('.tg-toast'), tgMsg: q('.tg-msg'), items: $$('.ct-bar-items button', root)
    };
    let clock = 21 * 60 + 47;
    let revenue = 1284000;
    const tables = [
      { name: 'Table 1', kind: 'pool', rate: 60000 },
      { name: 'Table 2', kind: 'pool', rate: 60000, start: clock - 47, orders: [{ n: 'Cola', p: 12000 }] },
      { name: 'Table 3', kind: 'pool', rate: 60000 },
      { name: 'VIP', kind: 'pool', rate: 90000, start: clock - 83, orders: [{ n: 'Tea', p: 8000 }, { n: 'Snacks', p: 15000 }] },
      { name: 'Tennis 1', kind: 'tennis', rate: 40000 },
      { name: 'Tennis 2', kind: 'tennis', rate: 40000 }
    ];
    let sel = tables[0];

    const minutes = t => (t.start != null ? clock - t.start : 0);
    const hhmm = m => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
    const dur = m => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`;
    const timeCost = t => Math.round(minutes(t) * t.rate / 60 / 500) * 500;
    const total = t => timeCost(t) + t.orders.reduce((s, o) => s + o.p, 0);

    tables.forEach(t => {
      t.orders = t.orders || [];
      const b = document.createElement('button');
      b.className = 'ct-table';
      b.dataset.kind = t.kind;
      b.setAttribute('aria-label', t.name);
      b.innerHTML = `<span class="ct-light"></span><span class="ct-felt">${t.kind === 'pool' ? '<i></i>'.repeat(6) : ''}</span><span class="ct-t-name"></span><span class="ct-t-time"></span>`;
      $('.ct-t-name', b).textContent = t.name.toUpperCase();
      b.addEventListener('click', () => select(t));
      ui.floor.appendChild(b);
      t.el = b;
    });

    function paint() {
      tables.forEach(t => {
        t.el.classList.toggle('is-on', t.start != null);
        t.el.classList.toggle('is-sel', t === sel);
        t.el.setAttribute('aria-pressed', String(t === sel));
        $('.ct-t-time', t.el).textContent = t.start != null ? hhmm(minutes(t)) : 'FREE';
      });
      const on = sel.start != null;
      ui.name.textContent = sel.name;
      ui.state.textContent = on ? 'In play' : 'Free';
      ui.state.classList.toggle('is-on', on);
      ui.timer.textContent = hhmm(minutes(sel));
      ui.cost.textContent = som(total(sel));
      ui.orders.innerHTML = '';
      sel.orders.forEach(o => {
        const li = document.createElement('li');
        li.innerHTML = '<span></span><span></span>';
        li.children[0].textContent = o.n;
        li.children[1].textContent = som(o.p);
        ui.orders.appendChild(li);
      });
      ui.items.forEach(b => { b.disabled = !on; });
      ui.go.textContent = on ? 'STOP' : 'START';
      ui.go.classList.toggle('is-stop', on);
      ui.active.textContent = `${tables.filter(t => t.start != null).length}/${tables.length}`;
      ui.clock.textContent = hhmm(clock % 1440);
      ui.rev.textContent = som(revenue);
    }

    function select(t) { sel = t; paint(); }
    function start(t, backdate = 0) { t.start = clock - backdate; t.orders = []; paint(); }
    function order(name) {
      const b = ui.items.find(x => x.dataset.item === name);
      if (!b || sel.start == null) return;
      sel.orders.push({ n: name, p: +b.dataset.price });
      b.animate([{ transform: 'scale(1)' }, { transform: 'scale(.92)' }, { transform: 'scale(1)' }], { duration: 220 });
      paint();
    }
    function stop(t) {
      const m = minutes(t), sum = total(t), tc = timeCost(t), ords = t.orders.slice();
      revenue += sum;
      printReceipt(t, m, tc, ords, sum);
      telegram(`${t.name} closed · ${dur(m)} · ${som(sum)} so'm. Revenue today: ${som(revenue)} so'm.`);
      t.start = null;
      t.orders = [];
      paint();
      ui.rev.classList.remove('bump');
      void ui.rev.offsetWidth;
      ui.rev.classList.add('bump');
    }

    ui.go.addEventListener('click', () => (sel.start != null ? stop(sel) : start(sel)));
    ui.items.forEach(b => b.addEventListener('click', () => order(b.dataset.item)));

    /* thermal receipt */
    function qr(seed) {
      let s = seed;
      const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
      const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fbfaf5"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`;
      let cells = '';
      for (let y = 0; y < 21; y++) {
        for (let x = 0; x < 21; x++) {
          if ((x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12)) continue;
          if (rnd() > .5) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
        }
      }
      return `<svg viewBox="0 0 21 21" fill="#121212" shape-rendering="crispEdges">${finder(0, 0)}${finder(14, 0)}${finder(0, 14)}${cells}</svg>`;
    }
    let rcTimer;
    function printReceipt(t, m, tc, ords, sum) {
      const d = new Date();
      const date = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
      const rows = ords.map(o => `<div class="rc-r"><span>${o.n} ×1</span><span>${som(o.p)}</span></div>`).join('');
      ui.paper.innerHTML = `
        <div class="rc-h">YOUR CLUB · BILLIARDS</div>
        <div class="rc-s">${date} · ${hhmm(clock % 1440)}</div>
        <hr>
        <div class="rc-r"><span>${t.name}</span><span>${dur(m)}</span></div>
        <div class="rc-r"><span>Rate ${som(t.rate)}/h</span><span>${som(tc)}</span></div>
        ${rows}
        <hr>
        <div class="rc-r rc-t"><span>TOTAL</span><span>${som(sum)}</span></div>
        <div class="rc-qr">${qr(m * 31 + sum % 997)}<span>Scan to follow<br>@your_club</span></div>`;
      ui.receipt.classList.remove('is-on', 'is-out');
      void ui.paper.offsetWidth;
      ui.receipt.classList.add('is-on');
      clearTimeout(rcTimer);
      rcTimer = setTimeout(hideReceipt, 7000);
    }
    function hideReceipt() {
      ui.receipt.classList.add('is-out');
      setTimeout(() => ui.receipt.classList.remove('is-on', 'is-out'), 450);
    }
    ui.receipt.addEventListener('click', hideReceipt);

    let tgTimer;
    function telegram(msg) {
      ui.tgMsg.textContent = msg;
      ui.tg.classList.remove('is-on');
      void ui.tg.offsetWidth;
      ui.tg.classList.add('is-on');
      clearTimeout(tgTimer);
      tgTimer = setTimeout(() => ui.tg.classList.remove('is-on'), 5200);
    }

    setInterval(() => { if (!document.hidden) { clock++; paint(); } }, 1000);
    paint();

    const t1 = tables[0];
    autoplay(root, [
      [900, () => select(t1)],
      [700, () => start(t1, 52)],
      [1500, () => order('Tea')],
      [1100, () => order('Cola')],
      [2600, () => stop(t1)]
    ]);
  }

  /* =================================================================== SAFIA */
  function safia() {
    const root = $('#sfDemo');
    if (!root) return;
    const q = s => $(s, root);
    const layersG = q('.sf-layers'), topG = q('.sf-topping'), label = q('.sf-text'), input = q('.sf-ins input');
    const price = q('.sf-price'), bag = q('.sf-bag'), bagN = q('.sf-bag b');
    const build = q('.sf-build'), track = q('.sf-track'), steps = $$('.sf-steps li', root);
    const st = { sponge: 'honey', top: 'berries', size: 2 };
    const SP = { honey: ['#e3ae63', '#c58a3d'], choco: ['#5b3424', '#3e2318'], velvet: ['#b02a31', '#841d23'] };
    const KG = { honey: 110000, choco: 120000, velvet: 130000 };
    const TOP = { berries: 20000, drip: 12000, nuts: 15000 };
    const LH = 22, CH = 6, BASE = 150;

    function draw(rebuild) {
      const n = st.size + 1;
      const w = [0, 132, 160, 186][st.size];
      const x0 = 120 - w / 2;
      const [c1, c2] = SP[st.sponge];
      if (rebuild) {
        layersG.innerHTML = '';
        let y = BASE;
        for (let i = 0; i < n; i++) {
          y -= LH;
          const g = svgEl('g', { class: 'sf-layer', style: `--li:${i}` });
          g.appendChild(svgEl('rect', { class: 'sp', x: x0, y, width: w, height: LH, rx: 5, fill: c1 }));
          g.appendChild(svgEl('rect', { class: 'sp2', x: x0, y: y + LH - 6, width: w, height: 6, rx: 3, fill: c2 }));
          if (i < n - 1) { y -= CH; g.appendChild(svgEl('rect', { x: x0 + 2, y, width: w - 4, height: CH, rx: 3, fill: '#fff4e6' })); }
          layersG.appendChild(g);
        }
      } else {
        $$('.sp', layersG).forEach(r => r.setAttribute('fill', c1));
        $$('.sp2', layersG).forEach(r => r.setAttribute('fill', c2));
      }
      const topY = BASE - n * LH - (n - 1) * CH;

      topG.innerHTML = '';
      const drip = st.top === 'drip';
      topG.appendChild(svgEl('rect', { x: x0 - 2, y: topY - 8, width: w + 4, height: 11, rx: 5.5, fill: drip ? '#3b2116' : '#fff4e6' }));
      if (drip) {
        for (let x = x0 + 4, k = 0; x < x0 + w - 6; x += 13, k++) {
          topG.appendChild(svgEl('rect', { x, y: topY - 2, width: 7, height: 8 + ((k * 7) % 15), rx: 3.5, fill: '#3b2116' }));
        }
      } else if (st.top === 'berries') {
        const count = Math.round(w / 21);
        for (let i = 0; i < count; i++) {
          const cx = x0 + 10 + i * ((w - 20) / (count - 1));
          const cy = topY - 13 + (i % 2) * 2;
          topG.appendChild(svgEl('circle', { cx, cy, r: 6.5, fill: i % 3 === 1 ? '#7b1fa2' : '#c2185b' }));
          topG.appendChild(svgEl('circle', { cx: cx - 2, cy: cy - 2, r: 1.8, fill: 'rgba(255,255,255,.55)' }));
        }
      } else {
        const count = Math.round(w / 15);
        for (let i = 0; i < count; i++) {
          const cx = x0 + 9 + i * ((w - 18) / (count - 1));
          topG.appendChild(svgEl('ellipse', { cx, cy: topY - 11 + (i % 3), rx: 5.5, ry: 3.4, fill: '#b07a3b', stroke: '#87582a', 'stroke-width': 1, transform: `rotate(${(i * 37) % 60 - 30} ${cx} ${topY - 11})` }));
        }
      }

      const txt = input.value.trim();
      label.textContent = txt;
      label.style.fill = st.sponge === 'honey' ? '#4a2716' : '#fff4e6';
      label.setAttribute('y', topY + LH / 2 + 5);
      label.style.fontSize = Math.min(15, (w - 14) / Math.max(1, txt.length * .52)) + 'px';
      price.textContent = `${som(KG[st.sponge] * st.size + TOP[st.top])} so'm`;
    }

    $$('.sf-opt', root).forEach(opt => {
      const key = opt.dataset.key;
      seg($(':scope > div', opt), b => {
        st[key] = key === 'size' ? +b.dataset.v : b.dataset.v;
        draw(key === 'size');
      });
    });
    input.addEventListener('input', () => draw(false));

    let timers = [];
    q('.sf-order').addEventListener('click', () => {
      bagN.textContent = +bagN.textContent + 1;
      bag.classList.remove('bump');
      void bag.offsetWidth;
      bag.classList.add('bump');
      q('.sf-ordno').textContent = '#A-' + (1000 + Math.floor(Math.random() * 9000));
      q('.sf-ins-echo').textContent = input.value.trim() || 'nothing, just love';
      const mini = q('.sf-mini');
      mini.innerHTML = '';
      const clone = q('.sf-svg').cloneNode(true);
      clone.removeAttribute('aria-label');
      clone.setAttribute('aria-hidden', 'true');
      mini.appendChild(clone);
      steps.forEach(li => li.classList.remove('done', 'now'));
      steps[steps.length - 1].querySelector('span').textContent = 'Courier · 12 min';
      build.classList.remove('is-on');
      track.classList.add('is-on');
      timers.forEach(clearTimeout);
      timers = [];
      steps.forEach((li, i) => {
        timers.push(setTimeout(() => {
          if (i > 0) { steps[i - 1].classList.remove('now'); steps[i - 1].classList.add('done'); }
          li.classList.add('now');
        }, 300 + i * 1300));
      });
      timers.push(setTimeout(() => {
        const last = steps[steps.length - 1];
        last.classList.remove('now');
        last.classList.add('done');
        last.querySelector('span').textContent = 'Delivered. Enjoy!';
      }, 300 + steps.length * 1300));
    });
    q('.sf-again').addEventListener('click', () => {
      timers.forEach(clearTimeout);
      track.classList.remove('is-on');
      build.classList.add('is-on');
    });

    draw(true);
  }

  /* ===================================================================== BON */
  function bon() {
    const root = $('#bnDemo');
    if (!root) return;
    const q = s => $(s, root);
    const cup = q('.bn-cup');
    const [l1, l2, l3] = ['.bn-l1', '.bn-l2', '.bn-l3'].map(q);
    const toast = phoneToast(q('.ph-toast'));
    const btn = q('.bn-order');
    const D = {
      cappuccino: { f: [.3, .3, .34], c: ['#4a2716', '#d8b38d', '#f6eadc'], p: 26000 },
      latte: { f: [.2, .56, .16], c: ['#4a2716', '#e7cdae', '#f8f0e6'], p: 28000 },
      raf: { f: [.16, .64, .12], c: ['#5a321d', '#efd9bb', '#fff6e8'], p: 32000 },
      matcha: { f: [.6, .22, .1], c: ['#6f9a45', '#dfe8cc', '#f3f6ea'], p: 34000 },
      cocoa: { f: [.62, .14, .16], c: ['#6a3c27', '#b98a68', '#fff3e3'], p: 24000 }
    };
    const MILK = { classic: [0, null], oat: [5000, '#e3cb9c'], coco: [6000, '#f5f0e4'] };
    const SIZE = { S: [.82, -4000], M: [.92, 0], L: [1, 5000] };
    const st = { d: 'cappuccino', s: 'M', m: 'classic', stamps: 5, free: false };
    const stampRow = q('.bn-stamp-row');
    for (let i = 0; i < 8; i++) {
      const s = document.createElement('span');
      s.innerHTML = '<svg class="i"><use href="#i-cup"/></svg>';
      stampRow.appendChild(s);
    }
    const stamps = [...stampRow.children];

    function paintStamps(fresh) {
      stamps.forEach((s, i) => {
        s.classList.toggle('on', i < st.stamps);
        s.classList.toggle('new', i === fresh);
      });
      q('.bn-stamp-n').textContent = `${st.stamps}/8`;
    }

    function draw(pour) {
      const d = D[st.d];
      const [e, m, f] = d.f;
      const layers = [[l3, e], [l2, e + m], [l1, e + m + f]];
      if (pour && !reduce) {
        layers.forEach(([el]) => { el.style.transition = 'none'; el.style.transform = 'scaleY(0)'; });
        void cup.getBoundingClientRect();
        layers.forEach(([el], i) => { el.style.transition = ''; el.style.transitionDelay = (i * .12) + 's'; });
      }
      layers.forEach(([el, v]) => { el.style.transform = `scaleY(${v})`; });
      l3.style.fill = d.c[0];
      l2.style.fill = (st.d === 'matcha' || st.d === 'cocoa' || !MILK[st.m][1]) ? d.c[1] : MILK[st.m][1];
      l1.style.fill = d.c[2];
      cup.style.transform = `scale(${SIZE[st.s][0]})`;
      const p = d.p + SIZE[st.s][1] + MILK[st.m][0];
      q('.bn-price').textContent = st.free ? "Free · 8th cup" : `${som(p)} so'm`;
    }

    seg(q('.bn-drinks'), b => { st.d = b.dataset.d; draw(true); });
    seg(q('.bn-size'), b => { st.s = b.dataset.s; draw(false); });
    seg(q('.bn-milk'), b => { st.m = b.dataset.m; draw(false); });

    btn.addEventListener('click', () => {
      btn.disabled = true;
      cup.classList.add('has-lid');
      const no = 200 + Math.floor(Math.random() * 99);
      const wasFree = st.free;
      if (wasFree) {
        st.free = false;
        st.stamps = 0;
        paintStamps(-1);
        toast({ kind: 'ok', icon: 'i-cup', title: `Order #${no} · on the house`, text: 'Thanks for coming back. Ready in 4 min.' });
      } else {
        st.stamps = Math.min(8, st.stamps + 1);
        paintStamps(st.stamps - 1);
        if (st.stamps === 8) {
          st.free = true;
          toast({ kind: 'ok', icon: 'i-check', title: 'Stamp card complete!', text: 'Your next cup is on us.' });
        } else {
          toast({ kind: 'ok', icon: 'i-check', title: `Order #${no} accepted`, text: 'Paid. Ready in 4 min at the nearest Bon!' });
        }
      }
      setTimeout(() => {
        cup.classList.remove('has-lid');
        btn.disabled = false;
        draw(wasFree);
      }, 2600);
    });

    paintStamps(-1);
    draw(false);
  }

  /* ==================================================================== AKFA */
  function akfa() {
    const root = $('#akDemo');
    if (!root) return;
    const q = s => $(s, root);
    const svg = q('.ak-svg');
    const st = { sash: 2, w: 1400, h: 1400, profile: 70, glass: 2, color: 'white' };
    const COLORS = {
      white: { fill: '#f7f8f9', stroke: '#c3cad3', handle: '#b3bcc6' },
      anthracite: { fill: '#3b4047', stroke: '#22262b', handle: '#cfd4da' },
      oak: { fill: 'url(#akOak)', stroke: '#6e4520', handle: '#e3cfa8' }
    };
    const GLASS = { 1: ['#eef5fb', '4 mm'], 2: ['#d6e7f5', '4-16-4'], 3: ['#c2d9ee', '4-12-4-12-4'] };

    svg.innerHTML = `
      <defs>
        <linearGradient id="akOak" x1="0" x2="1" y1="0" y2=".3">
          <stop offset="0" stop-color="#b17b43"/><stop offset=".35" stop-color="#9a6533"/>
          <stop offset=".6" stop-color="#b8834b"/><stop offset="1" stop-color="#8c5a2b"/>
        </linearGradient>
        <linearGradient id="akSky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
        </linearGradient>
        <marker id="akArr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#6b7280"/>
        </marker>
      </defs>
      <g class="ak-draw"></g>`;
    const g = q('.ak-draw');

    function draw() {
      const S = .125;
      const ww = st.w * S, hh = st.h * S;
      const x0 = 205 - ww / 2, y0 = 158 - hh / 2;
      const c = COLORS[st.color];
      const ft = { 60: 8, 70: 9.5, 80: 11 }[st.profile];
      const [glassFill, glassLabel] = GLASS[st.glass];
      const parts = [];
      const add = (tag, attrs) => parts.push(svgEl(tag, attrs));

      add('rect', { x: x0 - 9, y: y0 - 9, width: ww + 18, height: hh + 18, fill: '#c9d0d8', rx: 2 });
      add('rect', { x: x0, y: y0, width: ww, height: hh, fill: c.fill, stroke: c.stroke, 'stroke-width': 1.2 });
      const n = st.sash;
      const iw = ww - ft * 2, ih = hh - ft * 2, sw = iw / n;
      for (let i = 0; i < n; i++) {
        const sx = x0 + ft + i * sw, sy = y0 + ft;
        const open = n === 1 || (n === 2 && i === 1) || (n === 3 && i !== 1);
        const inset = open ? 7 : 2.5;
        if (open) add('rect', { x: sx + 1, y: sy + 1, width: sw - 2, height: ih - 2, fill: c.fill, stroke: c.stroke, 'stroke-width': 1 });
        const gx = sx + inset, gy = sy + inset, gw = sw - inset * 2, gh = ih - inset * 2;
        add('rect', { x: gx, y: gy, width: gw, height: gh, fill: glassFill, stroke: c.stroke, 'stroke-width': .6 });
        add('polygon', { points: `${gx},${gy} ${gx + gw * .45},${gy} ${gx},${gy + gh * .55}`, fill: 'url(#akSky)', opacity: .7 });
        if (open) {
          const hingeLeft = n === 1 || i === 0;
          const hx = hingeLeft ? gx : gx + gw, ox = hingeLeft ? gx + gw : gx;
          const dash = { stroke: '#7d8fa3', 'stroke-width': .9, 'stroke-dasharray': '5 4', fill: 'none' };
          add('polyline', { points: `${hx},${gy} ${ox},${gy + gh / 2} ${hx},${gy + gh}`, ...dash });
          add('polyline', { points: `${gx},${gy + gh} ${gx + gw / 2},${gy} ${gx + gw},${gy + gh}`, ...dash });
          const hxp = hingeLeft ? sx + sw - 5.5 : sx + 2.5;
          add('rect', { x: hxp, y: sy + ih / 2 - 9, width: 3.2, height: 18, rx: 1.6, fill: c.handle, stroke: c.stroke, 'stroke-width': .5 });
        }
      }
      const lbl = svgEl('text', { x: x0 + ft + 10, y: y0 + hh - ft - 10, 'font-size': 8.5, 'font-family': 'JetBrains Mono, monospace', fill: '#5b7083' });
      lbl.textContent = glassLabel;
      parts.push(lbl);
      add('rect', { x: x0 - 16, y: y0 + hh + 1, width: ww + 32, height: 8, rx: 2, fill: '#eef1f4', stroke: '#c3cad3', 'stroke-width': 1 });

      const dimY = y0 + hh + 27, dimX = x0 + ww + 24;
      const line = { stroke: '#6b7280', 'stroke-width': .9, 'marker-start': 'url(#akArr)', 'marker-end': 'url(#akArr)' };
      add('line', { x1: x0, y1: dimY, x2: x0 + ww, y2: dimY, ...line });
      add('line', { x1: dimX, y1: y0, x2: dimX, y2: y0 + hh, ...line });
      const tw = svgEl('text', { x: x0 + ww / 2, y: dimY - 5, 'text-anchor': 'middle', 'font-size': 10, 'font-family': 'JetBrains Mono, monospace', fill: '#374151' });
      tw.textContent = `${st.w} mm`;
      const th = svgEl('text', { x: dimX + 5, y: y0 + hh / 2, 'font-size': 10, 'font-family': 'JetBrains Mono, monospace', fill: '#374151', transform: `rotate(90 ${dimX + 5} ${y0 + hh / 2})`, 'text-anchor': 'middle' });
      th.textContent = `${st.h} mm`;
      parts.push(tw, th);

      g.replaceChildren(...parts);
      calc();
    }

    function calc() {
      const area = st.w * st.h / 1e6;
      const prof = { 60: 520000, 70: 680000, 80: 860000 }[st.profile];
      const glass = { 1: 0, 2: 140000, 3: 290000 }[st.glass];
      const openSashes = st.sash === 1 ? 1 : st.sash === 2 ? 1 : 2;
      const mult = { white: 1, anthracite: 1.12, oak: 1.18 }[st.color];
      const price = Math.round(((area * (prof + glass)) + openSashes * 420000) * mult / 10000) * 10000 + 250000;
      const ug = { 1: 5.8, 2: 2.7, 3: .8 }[st.glass];
      const uf = { 60: 1.6, 70: 1.3, 80: 1.0 }[st.profile];
      const uw = .7 * ug + .3 * uf + .1;
      q('.ak-price').textContent = som(price);
      q('.ak-u').textContent = uw.toFixed(2);
      q('.ak-meter i').style.setProperty('--m', Math.min(96, Math.max(2, (uw - .8) / (4.5 - .8) * 100)) + '%');
      q('.ak-w').textContent = st.w;
      q('.ak-hh').textContent = st.h;
    }

    $$('.seg[data-k]', root).forEach(group => seg(group, b => { st[group.dataset.k] = +b.dataset.v; draw(); }));
    $$('input[type="range"][data-k]', root).forEach(r => r.addEventListener('input', () => { st[r.dataset.k] = +r.value; draw(); }));
    const colors = q('.ak-colors');
    $$('button', colors).forEach(b => b.addEventListener('click', () => {
      $$('button', colors).forEach(x => x.classList.toggle('is-on', x === b));
      st.color = b.dataset.v;
      draw();
    }));

    /* dealer map */
    const map = q('.ak-map');
    const img = $('img', map);
    const wrap = document.createElement('div');
    wrap.className = 'ak-map-in';
    wrap.style.position = 'relative';
    img.replaceWith(wrap);
    wrap.appendChild(img);
    const CITIES = [
      ['Tashkent', 748, 339], ['Samarkand', 601, 444], ['Bukhara', 460, 430], ['Andijan', 912, 374],
      ['Fergana', 868, 397], ['Namangan', 856, 368], ['Nukus', 236, 256], ['Urgench', 291, 322],
      ['Qarshi', 564, 508], ['Termez', 643, 605], ['Navoi', 543, 425], ['Jizzakh', 673, 422]
    ];
    const pins = CITIES.map(([name, x, y]) => {
      const p = document.createElement('span');
      p.className = 'ak-pin';
      p.title = name;
      p.style.left = (x / 10) + '%';
      p.style.top = (y / 6.52) + '%';
      wrap.appendChild(p);
      return p;
    });
    const view = q('.ak-view');
    const dealerBtn = q('.ak-dealer');
    const dealerLabel = dealerBtn.innerHTML;
    let card = null;
    const showWindow = () => {
      if (!view.classList.contains('show-map')) return;
      view.classList.remove('show-map');
      dealerBtn.innerHTML = dealerLabel;
    };
    dealerBtn.addEventListener('click', () => {
      if (view.classList.contains('show-map')) { showWindow(); return; }
      pins.forEach(p => p.classList.remove('is-near'));
      if (card) card.remove();
      pins[0].classList.add('is-near');
      card = document.createElement('div');
      card.className = 'ak-card';
      card.innerHTML = '<b>Sample dealer · Tashkent</b>Showroom 4.2 km away · open till 19:00';
      card.style.left = pins[0].style.left;
      card.style.top = pins[0].style.top;
      wrap.appendChild(card);
      view.classList.add('show-map');
      dealerBtn.textContent = 'Back to my window';
      view.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    });
    root.addEventListener('input', showWindow);
    $$('.ak-ctrl button:not(.ak-dealer)', root).forEach(b => b.addEventListener('click', showWindow));

    draw();
  }

  /* ============================================================== CODE TYPER */
  function typer() {
    const code = $('#codeType');
    if (!code) return;
    const pre = code.parentElement;
    const SNIPPETS = [
      {
        file: 'ShieldService.kt · Android',
        src: `// Android · Qalqon shield layer
class ShieldService : AccessibilityService() {

  override fun onAccessibilityEvent(e: AccessibilityEvent) {
    val app = e.packageName?.toString() ?: return
    if (mode == AppMode.STRICT && app in blocked) {
      shield.show(app)   // blocked at OS level
      sync.report(app)   // parent sees it in Telegram
    }
  }
}`
      },
      {
        file: 'Qalqon.swift · iOS',
        src: `// iOS · Screen Time frameworks
import FamilyControls
import ManagedSettings

let store = ManagedSettingsStore()

func enableQalqon(_ pick: FamilyActivitySelection) {
  store.shield.applications = pick.applicationTokens
  store.application.denyAppRemoval = true
}`
      }
    ];
    const esc = s => s.replace(/[&<>]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[ch]));
    const RX = /(\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"?)|\b(import|let|var|func|class|override|fun|val|if|in|return|private|true|false|when|object|guard|else)\b|\b([A-Z][A-Za-z0-9]*)\b|\b(\d+)\b|([&<>])/g;
    const hl = src => src.replace(RX, (m, c, s, k, t, n, e) =>
      c ? `<span class="tok-c">${esc(c)}</span>` :
      s ? `<span class="tok-s">${esc(s)}</span>` :
      k ? `<span class="tok-k">${k}</span>` :
      t ? `<span class="tok-t">${t}</span>` :
      n ? `<span class="tok-n">${n}</span>` : esc(e));

    if (reduce) { pre.dataset.file = SNIPPETS[0].file; code.innerHTML = hl(SNIPPETS[0].src); return; }

    let si = 0;
    const run = () => {
      const { file, src } = SNIPPETS[si];
      pre.dataset.file = file;
      let i = 0;
      const step = () => {
        i = Math.min(src.length, i + (src[i] === ' ' ? 2 : 1));
        code.innerHTML = hl(src.slice(0, i));
        if (i < src.length) setTimeout(step, src[i - 1] === '\n' ? 130 : 14 + Math.random() * 22);
        else setTimeout(() => { si = (si + 1) % SNIPPETS.length; run(); }, 3400);
      };
      step();
    };
    if (!('IntersectionObserver' in window)) { run(); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); run(); } }, { threshold: .3 });
    io.observe(pre);
  }

  document.addEventListener('DOMContentLoaded', () => {
    tikoncha();
    clubtime();
    safia();
    bon();
    akfa();
    typer();
  });
})();
