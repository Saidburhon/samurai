/* Samurai — core interactions: preloader, cursor, nav, reveals, scroll effects, tabs, form */
(() => {
  'use strict';

  const doc = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const CONFIG = window.SAMURAI_CONFIG || {};

  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };

  /* ---------------------------------------------------------------- ready */
  let isReady = false;
  const readyCbs = [];
  const onReady = fn => (isReady ? fn() : readyCbs.push(fn));
  function ready() {
    if (isReady) return;
    isReady = true;
    doc.classList.remove('is-loading');
    doc.classList.add('is-ready');
    readyCbs.forEach(fn => fn());
  }

  /* ------------------------------------------------------------ preloader */
  function preloader() {
    const pl = $('#preloader');
    // no .js class means the inline failsafe already gave up on the intro
    if (!pl || reduce || !doc.classList.contains('js')) { if (pl) pl.classList.add('is-done'); ready(); return; }

    doc.classList.add('is-loading');

    const geo = () => {
      const W = innerWidth, H = innerHeight;
      const y1 = H * .58, y2 = H * .42;
      pl.style.setProperty('--len', Math.hypot(W, y1 - y2) + 'px');
      pl.style.setProperty('--ang', (Math.atan2(y2 - y1, W) * 180 / Math.PI) + 'deg');
    };
    geo();
    addEventListener('resize', geo);

    const repeat = store.get('samurai-seen') === '1';
    store.set('samurai-seen', '1');
    const MIN = repeat ? 650 : 1600;
    const MAX = 4000;
    let loaded = false;
    Promise.all([
      new Promise(r => (document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true }))),
      document.fonts ? document.fonts.ready : Promise.resolve()
    ]).then(() => { loaded = true; });

    const counts = $$('.pl-count', pl);
    const t0 = performance.now();
    const tick = now => {
      const t = now - t0;
      let p = clamp(t / MIN);
      if (!loaded && t < MAX) p = Math.min(p, .9);
      const v = Math.round((1 - Math.pow(1 - p, 3)) * 100);
      counts.forEach(c => { c.textContent = String(v).padStart(3, '0'); });
      if (p < 1) requestAnimationFrame(tick); else cut();
    };
    requestAnimationFrame(tick);

    function cut() {
      pl.classList.add('is-cut');
      setTimeout(() => { pl.classList.add('is-split'); ready(); }, 360);
      setTimeout(() => { pl.classList.add('is-done'); removeEventListener('resize', geo); }, 1650);
    }
  }

  /* --------------------------------------------------------------- cursor */
  function cursor() {
    if (!finePointer) return;
    const c = $('.cursor'), dot = $('.cursor-dot'), ring = $('.cursor-ring'), label = $('.cursor-label');
    if (!c) return;
    doc.classList.add('has-cursor');
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    // the ring eases toward the pointer; the loop sleeps once it has caught up
    const loop = () => {
      rx += (x - rx) * (reduce ? 1 : .2);
      ry += (y - ry) * (reduce ? 1 : .2);
      dot.style.transform = `translate3d(${x}px,${y}px,0)`;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      raf = Math.abs(x - rx) + Math.abs(y - ry) > .2 ? requestAnimationFrame(loop) : 0;
    };
    addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX; y = e.clientY;
      if (!c.classList.contains('is-on')) { rx = x; ry = y; c.classList.add('is-on'); }
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    document.addEventListener('mouseleave', () => c.classList.remove('is-on'));

    document.addEventListener('pointerover', e => {
      const t = e.target.closest('input, textarea, select, a, button, label, [data-cursor]');
      c.classList.remove('is-hover', 'is-link', 'is-native');
      if (!t) return;
      if (t.matches('input, textarea, select')) { c.classList.add('is-native'); return; }
      const l = t.dataset.cursor;
      if (l) { label.textContent = l; c.classList.add('is-hover'); }
      else c.classList.add('is-link');
    });
  }

  /* ------------------------------------------------------------------ nav */
  function nav() {
    const n = $('#nav');
    const burger = $('#burger');
    const menu = $('#mobileMenu');
    let open = false;
    const setMenu = v => {
      open = v;
      burger.setAttribute('aria-expanded', String(v));
      burger.setAttribute('aria-label', v ? 'Close menu' : 'Open menu');
      menu.classList.toggle('is-open', v);
      menu.setAttribute('aria-hidden', String(!v));
      menu.inert = !v;
      doc.style.overflow = v ? 'hidden' : '';
      if (v) n.classList.remove('is-hidden');
    };
    menu.inert = true;
    burger.addEventListener('click', () => setMenu(!open));
    $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape' && open) setMenu(false); });
    // the burger disappears above 900px, so a menu left open there would trap the page
    const wide = matchMedia('(min-width: 901px)');
    const onWide = () => { if (wide.matches && open) setMenu(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide); else wide.addListener(onWide);

    let lastY = scrollY;
    scrollFns.push(y => {
      n.classList.toggle('is-scrolled', y > 24);
      if (!open) n.classList.toggle('is-hidden', y > lastY + 2 && y > 500);
      if (y < lastY - 2) n.classList.remove('is-hidden');
      lastY = y;
    });

    const links = $$('.nav-links a');
    const byId = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          links.forEach(l => l.classList.remove('is-active'));
          const l = byId.get(e.target.id);
          if (l) l.classList.add('is-active');
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      $$('#top, #work, #dojo, #arsenal, #way, #contact').forEach(s => io.observe(s));
    }
  }

  /* --------------------------------------------------------------- scroll */
  const scrollFns = [];
  function scrollLoop() {
    let ticking = false;
    const run = () => { ticking = false; const y = scrollY; scrollFns.forEach(fn => fn(y)); };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
    addEventListener('resize', run);
    run();
  }

  function katana() {
    const k = $('.katana');
    if (!k) return;
    scrollFns.push(y => {
      const max = doc.scrollHeight - innerHeight;
      k.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    });
  }

  /* --------------------------------------------------------------- reveal */
  function splitWords(el, cls = 'w') {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(ch => {
        if (ch.nodeType === 3) {
          const frag = document.createDocumentFragment();
          ch.textContent.split(/( )/).forEach(part => {
            if (part === ' ') { frag.appendChild(document.createTextNode(' ')); return; }
            if (!part) return;
            const w = document.createElement('span');
            w.className = cls;
            if (cls === 'w') {
              const inner = document.createElement('span');
              inner.textContent = part;
              inner.style.setProperty('--wi', i);
              w.appendChild(inner);
            } else {
              w.textContent = part;
            }
            i++;
            frag.appendChild(w);
          });
          ch.replaceWith(frag);
        } else if (ch.nodeType === 1) {
          walk(ch);
        }
      });
    };
    walk(el);
    return $$('.' + cls, el);
  }

  function reveal() {
    $$('[data-split]').forEach(el => splitWords(el));
    const els = $$('[data-reveal], [data-split], .steps');
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.01 });
    els.forEach(e => io.observe(e));
  }

  /* --------------------------------------------------------- hero extras */
  function countUp(el, dur = 1500) {
    const to = +el.dataset.count;
    const pad = String(to).length < 2 ? 2 : String(to).length;
    if (reduce) { el.textContent = String(to).padStart(pad, '0'); return; }
    const t0 = performance.now();
    const step = now => {
      const p = clamp((now - t0) / dur);
      el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 4)))).padStart(pad, '0');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  function heroStats() {
    onReady(() => setTimeout(() => $$('.hero [data-count]').forEach(el => countUp(el)), 900));
  }

  /* -------------------------------------------------------------- marquee */
  function marquee() {
    $$('.mq-track').forEach(track => {
      const items = [...track.children];
      const setW = track.scrollWidth;
      const copies = Math.max(1, Math.ceil((innerWidth * 1.2) / Math.max(setW, 1)));
      for (let c = 1; c < copies * 2; c++) {
        items.forEach(it => {
          const k = it.cloneNode(true);
          k.setAttribute('aria-hidden', 'true');
          track.appendChild(k);
        });
      }
    });
  }

  /* ------------------------------------------------------------- magnetic */
  function magnetic() {
    if (!finePointer || reduce) return;
    $$('.magnetic').forEach(el => {
      el.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1), background .3s, color .3s, border-color .3s, box-shadow .3s';
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * .22}px, ${dy * .32}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ------------------------------------------------------- card spotlight */
  function spotlight() {
    $$('.card').forEach(c => {
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ------------------------------------------------------------ manifesto */
  function manifesto() {
    const m = $('#manifesto');
    if (!m) return;
    const words = splitWords(m, 'mw');
    words.forEach(w => { if (/^(cut\.|sloppy)$/.test(w.textContent)) w.classList.add('hl'); });
    if (reduce) { words.forEach(w => w.classList.add('on')); return; }
    scrollFns.push(() => {
      const r = m.getBoundingClientRect();
      const p = clamp((innerHeight * .88 - r.top) / (r.height + innerHeight * .4));
      const n = Math.round(p * words.length * 1.08);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
    });
  }

  /* --------------------------------------------------------- footer word */
  function footerWord() {
    const fw = $('.footer-word');
    if (!fw) return;
    // size the wordmark so it spans the full width, whatever the font metrics
    const word = $('span', fw);
    const fit = () => {
      fw.style.fontSize = '';
      const target = doc.clientWidth * .97;
      const w = word.getBoundingClientRect().width;
      if (w > 0) fw.style.fontSize = (parseFloat(getComputedStyle(fw).fontSize) * target / w) + 'px';
    };
    fit();
    if (document.fonts) document.fonts.ready.then(fit);
    addEventListener('resize', fit);
    scrollFns.push(y => {
      const max = doc.scrollHeight - innerHeight;
      const span = fw.offsetHeight * 1.6 + 160;
      const p = clamp(1 - (max - y) / span);
      fw.style.setProperty('--fill', (p * 100).toFixed(1) + '%');
    });
  }

  /* ------------------------------------------------------------ dojo tabs */
  function tabs() {
    const list = $('.dojo-tabs');
    if (!list) return;
    const tabsEls = $$('[role="tab"]', list);
    const select = (t, focus) => {
      tabsEls.forEach(x => {
        const on = x === t;
        x.classList.toggle('is-on', on);
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
        const p = document.getElementById(x.getAttribute('aria-controls'));
        p.hidden = !on;
        p.classList.toggle('is-on', on);
      });
      if (focus) t.focus();
      t.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    };
    tabsEls.forEach(t => t.addEventListener('click', () => select(t)));
    list.addEventListener('keydown', e => {
      const i = tabsEls.indexOf(document.activeElement);
      if (i < 0) return;
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabsEls.length;
      if (e.key === 'ArrowLeft') j = (i - 1 + tabsEls.length) % tabsEls.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = tabsEls.length - 1;
      if (j !== null) { e.preventDefault(); select(tabsEls[j], true); }
    });
  }

  /* -------------------------------------------------------------- contact */
  function contact() {
    const clean = v => String(v || '').trim().replace(/^@/, '');
    const hrefs = {
      telegram: clean(CONFIG.telegram) && `https://t.me/${clean(CONFIG.telegram)}`,
      email: clean(CONFIG.email) && `mailto:${clean(CONFIG.email)}`,
      phone: clean(CONFIG.phone) && `tel:${clean(CONFIG.phone).replace(/[^\d+]/g, '')}`,
      instagram: clean(CONFIG.instagram) && `https://instagram.com/${clean(CONFIG.instagram)}`
    };
    $$('[data-link]').forEach(a => {
      const h = hrefs[a.dataset.link];
      if (h) a.href = h; else a.classList.add('is-empty');
    });

    const form = $('#contactForm');
    if (!form) return;
    const err = $('.form-err', form);
    const doneS = $('.form-done-s', form);
    const back = $('.form-back', form);
    back.addEventListener('click', () => {
      form.classList.remove('is-done');
      form.elements.message.focus();
    });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = String(fd.get('name') || '').trim();
      const who = String(fd.get('contact') || '').trim();
      $$('.field', form).forEach(f => f.classList.remove('has-err'));
      err.textContent = '';
      if (!name || !who) {
        if (!name) form.elements.name.closest('.field').classList.add('has-err');
        if (!who) form.elements.contact.closest('.field').classList.add('has-err');
        err.textContent = 'Add your name and a phone number or Telegram so we can reach you.';
        (name ? form.elements.contact : form.elements.name).focus();
        return;
      }
      const data = {
        name, contact: who,
        types: fd.getAll('type'),
        budget: String(fd.get('budget') || ''),
        message: String(fd.get('message') || '').trim()
      };
      const body = `Project: ${data.types.join(', ') || '—'}\nName: ${name}\nContact: ${who}\nBudget: ${data.budget}\n\n${data.message}`;
      const btn = $('button[type="submit"]', form);
      btn.disabled = true;
      try {
        if (clean(CONFIG.formEndpoint)) {
          const r = await fetch(CONFIG.formEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(data)
          });
          if (!r.ok) throw new Error('HTTP ' + r.status);
          doneS.textContent = "We've got it. Expect a reply from a real human soon.";
        } else if (clean(CONFIG.email)) {
          const email = clean(CONFIG.email);
          location.href = `mailto:${email}?subject=${encodeURIComponent('New project: ' + name)}&body=${encodeURIComponent(body)}`;
          // a mailto link silently does nothing without a mail app, so always show the address too
          const a = document.createElement('a');
          a.href = `mailto:${email}`;
          a.textContent = email;
          doneS.replaceChildren('Your mail app should open with everything filled in. Just press send. If nothing opened, write to us at ', a, '.');
        } else {
          console.warn('[Samurai] The contact form is not connected. Set SAMURAI_CONFIG.email or formEndpoint in index.html.');
          doneS.textContent = 'Demo mode: connect the form in SAMURAI_CONFIG (index.html) to receive messages.';
        }
        form.classList.add('is-done');
        back.focus({ preventScroll: true });
      } catch (ex) {
        err.textContent = 'Something went wrong while sending. Please try again in a moment.';
      } finally {
        btn.disabled = false;
      }
    });
  }

  /* ------------------------------------------------------------------ go */
  document.addEventListener('DOMContentLoaded', () => {
    const y = $('#year');
    if (y) y.textContent = new Date().getFullYear();
    preloader();
    cursor();
    nav();
    katana();
    reveal();
    heroStats();
    marquee();
    magnetic();
    spotlight();
    manifesto();
    footerWord();
    tabs();
    contact();
    scrollLoop();
  });
})();
