/* Qilich — page chrome: intro cut, nav, reveals, clocks, the Way line, contacts, footer */
(() => {
  'use strict';

  const doc = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CONFIG = window.QILICH_CONFIG || {};
  const onLang = fn => document.addEventListener('qilich:lang', fn);

  /* ------------------------------------------------------------ intro cut */
  // the headline rises, a white slash crosses the sun and the two halves part
  function intro() {
    const sun = $('#sun');
    const go = () => {
      doc.classList.add('is-ready');
      if (!sun) return;
      if (reduce) { sun.style.setProperty('--open', 1); return; }
      sun.classList.add('is-slashing');
      setTimeout(() => {
        sun.classList.add('is-opening');
        sun.style.setProperty('--open', 1);
        setTimeout(() => sun.classList.remove('is-opening'), 1200);
      }, 330);
    };
    // wait for the fonts briefly so the headline doesn't rise in a fallback face
    Promise.race([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise(r => setTimeout(r, 900))
    ]).then(() => requestAnimationFrame(go));
  }

  /* ------------------------------------------------------------------ nav */
  function nav() {
    const bar = $('#nav');
    const onScroll = () => bar.classList.toggle('is-scrolled', scrollY > 24);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --------------------------------------------------------------- katana */
  // the blade is drawn as you scroll; one notch per poster, the current one in red.
  // On phones the katana is hidden and the nav counter (一 / 七) does the same job.
  function katana() {
    const k = $('#katana');
    const list = $('#kMarks');
    const glint = $('.k-glint', k || document);
    const num = $('#navNum');
    const posters = $$('.poster[data-num]');
    if (!posters.length) return;

    const marks = posters.map(p => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + p.id;
      a.innerHTML = `<span><b>${p.dataset.num}</b><em>${p.dataset.k || ''}</em></span><i></i>`;
      a.setAttribute('aria-label', `${p.dataset.num} ${p.dataset.k || ''}`);
      li.appendChild(a);
      if (list) list.appendChild(li);
      return { p, li, a, top: 0 };
    });

    let max = 1, active = -1, queued = false;
    const layout = () => {
      max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      marks.forEach(m => {
        m.top = m.p.getBoundingClientRect().top + scrollY;
        m.li.style.setProperty('--y', (clamp(m.top / max) * 100).toFixed(2) + '%');
      });
      update();
    };
    function update() {
      queued = false;
      const y = scrollY;
      if (k) k.style.setProperty('--p', clamp(y / max).toFixed(4));
      let i = 0;
      marks.forEach((m, n) => { if (m.top - innerHeight * .5 <= y) i = n; });
      if (i === active) return;
      const first = active === -1;
      active = i;
      marks.forEach((m, n) => {
        m.a.classList.toggle('is-on', n === i);
        if (n === i) m.a.setAttribute('aria-current', 'true'); else m.a.removeAttribute('aria-current');
      });
      if (num) num.textContent = marks[i].p.dataset.num;
      if (!k) return;
      if (marks[i].p.dataset.tone) k.dataset.tone = marks[i].p.dataset.tone; else delete k.dataset.tone;
      // a glint runs down the steel each time you reach a new poster
      if (!first && !reduce && glint) {
        glint.classList.remove('run');
        void glint.offsetWidth;
        glint.classList.add('run');
      }
    }
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', layout);
    addEventListener('load', layout);
    if (document.fonts) document.fonts.ready.then(layout);
    onLang(() => requestAnimationFrame(layout));
    if ('ResizeObserver' in window) new ResizeObserver(() => requestAnimationFrame(layout)).observe(document.body);
    layout();
  }

  /* -------------------------------------------------------------- reveals */
  function reveals() {
    const items = $$('.rv, .rvc, .chapter-cut');
    $$('.poster, .chapter').forEach(p => $$('.rv', p).forEach((el, i) => el.style.setProperty('--d', (i * .07).toFixed(2) + 's')));
    if (reduce || !('IntersectionObserver' in window)) { items.forEach(el => el.classList.add('in')); return; }
    // a clipped case has no visible area until it is cut open, so watch its poster instead
    const watch = new Map(items.map(el => [el.classList.contains('rvc') ? el.parentElement : el, el]));
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        watch.get(e.target).classList.add('in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });
    watch.forEach((el, target) => io.observe(target));
  }

  /* --------------------------------------------------------------- clocks */
  function clocks() {
    const els = $$('.clock[data-tz]');
    if (!els.length) return;
    const pad = n => String(n).padStart(2, '0');
    const tick = () => {
      const now = Date.now();
      els.forEach(el => {
        const d = new Date(now + Number(el.dataset.tz) * 3600e3);
        el.textContent = pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes());
      });
    };
    tick();
    setInterval(tick, 10e3);
  }

  /* ---------------------------------------------------- the Way: the line */
  function wayLine() {
    const sec = $('#way');
    const fill = $('#wayFill');
    if (!sec || !fill) return;
    if (reduce) { fill.style.setProperty('--p', 1); return; }
    let queued = false;
    const update = () => {
      queued = false;
      const r = sec.getBoundingClientRect();
      const p = clamp((innerHeight * .85 - r.top) / (r.height * .7));
      fill.style.setProperty('--p', p.toFixed(3));
    };
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();
  }

  /* ------------------------------------------------------------- contacts */
  function contacts() {
    const tel = String(CONFIG.phone || '').replace(/[^\d+]/g, '');
    const email = String(CONFIG.email || '').trim();
    const pretty = {
      // +998972707007 → +998 97 270 70 07
      phone: tel.replace(/^\+998(\d{2})(\d{3})(\d{2})(\d{2})$/, '+998 $1 $2 $3 $4'),
      email
    };
    const hrefs = { phone: tel && 'tel:' + tel, email: email && 'mailto:' + email };
    $$('[data-link]').forEach(a => {
      const href = hrefs[a.dataset.link];
      if (href) a.href = href; else a.hidden = true;
    });
    $$('[data-value]').forEach(el => { el.textContent = pretty[el.dataset.value] || ''; });
  }

  /* --------------------------------------------------------- footer word */
  // scale QILICH to fill the footer edge to edge
  function footerWord() {
    const w = $('#footerWord');
    if (!w) return;
    const fit = () => {
      w.style.fontSize = '100px';
      w.style.width = 'max-content';
      const need = w.getBoundingClientRect().width;
      w.style.width = '';
      const avail = w.clientWidth;
      if (need) w.style.fontSize = (100 * avail / need * .99).toFixed(2) + 'px';
    };
    fit();
    addEventListener('resize', fit);
    if (document.fonts) document.fonts.ready.then(fit);
    onLang(fit);
  }

  const init = () => {
    intro();
    nav();
    katana();
    reveals();
    clocks();
    wayLine();
    contacts();
    footerWord();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
