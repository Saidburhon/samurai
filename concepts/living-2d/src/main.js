// Qalam · Qilich 文武 — the one-page site. One pinned theatre, one master timeline in "beats",
// one WebGL stage. Desktop: Lenis smooth wheel, one beat per wheel step. Phone: native touch scroll, one snap step per poster.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { createStage } from './gl.js';
import { bakeWashi } from './washi.js';
import { nameSeal } from './seal.js';
import { hero } from './scenes/hero.js';
import { kesik } from './scenes/kesik.js';
import { bunbu } from './scenes/bunbu.js';
import { yol } from './scenes/yol.js';
import { tanzaku } from './scenes/tanzaku.js';
import { jikan } from './scenes/jikan.js';
import { aloqa } from './scenes/aloqa.js';
import { okuzuke } from './scenes/okuzuke.js';
import { clamp, seg, polyCss, polyEdges, clipBy, rectPoly, setT, setClip, css } from './util.js';

gsap.registerPlugin(ScrollTrigger);
const html = document.documentElement;
const qs = new URLSearchParams(location.search);
const RM = html.classList.contains('rm') || qs.has('rm');
const DEBUG_B = qs.has('b') ? parseFloat(qs.get('b')) : null;
const NOINTRO = qs.has('nointro') || DEBUG_B != null;

// ---------- a tiny task queue for the CPU bakes (one per tick, never during the critical intro)
function makeTasks() {
  const q = []; const done = new Set(); let running = false; let hold = () => false;
  const api = {
    add(name, fn, prio = 5) { q.push({ name, fn, prio }); q.sort((a, b) => a.prio - b.prio); },
    need(name) { const i = q.findIndex((t) => t.name === name); if (i >= 0) { const t = q.splice(i, 1)[0]; t.fn(); done.add(name); } },
    needPrefix(pre) { for (const t of q.filter((t) => t.name.startsWith(pre))) api.need(t.name); },
    pending: (pre) => q.some((t) => t.name.startsWith(pre)),
    flush() { while (q.length) { const t = q.shift(); t.fn(); done.add(t.name); } },
    start(holdFn) { hold = holdFn || hold; if (running) return; running = true; const tick = () => { if (!q.length) { running = false; return; } if (!hold()) { const t = q.shift(); try { t.fn(); } catch (e) { console.error('task', t.name, e); } done.add(t.name); api.onDone && api.onDone(t.name); } setTimeout(tick, 12); }; setTimeout(tick, 0); },
  };
  return api;
}

async function boot() {
  await new Promise((r) => requestAnimationFrame(() => r()));
  const de = document.documentElement;
  const W = de.clientWidth || innerWidth, H = de.clientHeight || innerHeight;
  const phone = W < 700;
  html.classList.remove('phone', 'desk'); html.classList.add(phone ? 'phone' : 'desk');
  html.style.setProperty('--vh', H + 'px');
  const canvas = document.getElementById('stage');
  let R = null;
  try { R = createStage(canvas); } catch (e) { console.error(e); }
  if (!R) { html.classList.add('nogl'); html.classList.remove('js'); return; }
  R.resize(W, H, Math.min(devicePixelRatio || 1, phone ? 1.25 : 1.5));

  const fontsP = Promise.race([Promise.all([
    document.fonts.load('300 120px "Noto Serif Display"', 'Yapon'), document.fonts.load('italic 300 120px "Noto Serif Display"', 'Oʻz'),
    document.fonts.load('400 16px Onest'), document.fonts.load('500 13px "IBM Plex Mono"'), document.fonts.load('400 13px "IBM Plex Mono"'),
    document.fonts.load('800 20px "Shippori Mincho B1"', '剣切'), document.fonts.load('500 20px "Shippori Mincho B1"', 'タシケント'),
  ]), new Promise((r) => setTimeout(r, 2500))]);
  const dataP = Promise.all([fetch('data/kanjivg.json').then((r) => r.json()), fetch('data/glyphs.json').then((r) => r.json())]);

  // ---------- the paper: one washi bake shared by every sheet (flipped variants)
  const TL = (k) => console.log('T ' + k + ' ' + Math.round(performance.now()));
  TL('start');
  const m = 40;
  const pw = W + 2 * m, ph = H + 2 * m;
  const sheet = bakeWashi(pw, ph, { seed: 11, scale: phone ? 0.75 : 1 });
  TL('baked');
  const rgba = new Uint8Array(pw * ph * 4);
  for (let i = 0, n = pw * ph; i < n; i++) { rgba[i * 4] = sheet.data[i * 4]; rgba[i * 4 + 1] = sheet.data[i * 4 + 1]; rgba[i * 4 + 2] = sheet.data[i * 4 + 2]; rgba[i * 4 + 3] = Math.round(sheet.fibre[i] * 255); }
  const paper = {
    tex: R.texFrom({ w: pw, h: ph, data: rgba }, { repeat: true }), w: pw, h: ph, m, fibre: sheet.fibre, sheet,
    xf(v = 0) { const fx = v & 1, fy = v & 2; return [fx ? -1 / pw : 1 / pw, fy ? -1 / ph : 1 / ph, fx ? 1 - m / pw : m / pw, fy ? 1 - m / ph : m / ph]; },
  };
  TL('tex');
  const [[kvg, glyphs]] = await Promise.all([dataP, fontsP]);
  TL('fonts+data');
  // the name seal 剣 for the header and favicon
  try {
    const ns = nameSeal(24, { k: 4 }); const u = ns.toDataURL('image/png');
    document.querySelectorAll('.nseal').forEach((e) => { e.style.background = `url(${u}) center/100% no-repeat`; });
    const l = document.createElement('link'); l.rel = 'icon'; l.href = u; document.head.appendChild(l);
  } catch (e) { /* fonts may be missing: keep the flat seal */ }

  const tasks = makeTasks();
  const S = { W, H, phone, R, paper, kvg, glyphs, tasks, pointer: [W * 0.78, H * 0.4] };
  const scenes = [hero(S), kesik(S), bunbu(S), yol(S), tanzaku(S), jikan(S), aloqa(S), okuzuke(S)];
  S.scenes = scenes;
  TL('scenes');
  const TOTAL = Math.max(...scenes.map((s) => s.range[1]));

  // ---------- clocks
  const tick = () => {
    const f = (tz) => new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
    document.querySelectorAll('[data-tz]').forEach((e) => { const v = f(e.dataset.tz); if (e.textContent !== v) e.textContent = v; });
  };
  tick(); setInterval(tick, 20000);

  if (RM) return posters(S, scenes);
  theatre(S, scenes, TOTAL);
}

// ======================================================================= theatre
function theatre(S, scenes, TOTAL) {
  const { W, H, phone, R, tasks } = S;
  html.classList.add('theatre');
  const bootT = performance.now() / 1000;
  const shift = NOINTRO ? bootT - 16.5 : Math.max(0, bootT - 0.8);
  const now = () => performance.now() / 1000 - shift;
  // phone: one finger-flick per poster (key beats); desktop: one wheel step (3 x 160 px) per beat
  const KEYS = phone ? [0, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 17, 19, 20].filter((k) => k <= TOTAL) : Array.from({ length: TOTAL + 1 }, (_, i) => i);
  const STEP = phone ? Math.round(H * 1.14) : Math.round(H * 0.7111);
  const NST = KEYS.length - 1;
  const keyB = (s) => { const i = Math.min(NST - 1, Math.floor(s)); const f = s - i; return KEYS[i] + (KEYS[i + 1] - KEYS[i]) * clamp(f); };
  const beatToStep = (b) => { for (let i = 0; i < NST; i++) if (b <= KEYS[i + 1]) return i + (b - KEYS[i]) / (KEYS[i + 1] - KEYS[i]); return NST; };
  const state = { b: DEBUG_B ?? 0, s: 0 };
  let dirty = true;

  // the master timeline, in beats; ScrollTrigger scrubs a step proxy that seeks it
  const master = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
  master.to(state, { b: TOTAL, duration: TOTAL, onUpdate: () => { dirty = true; } }, 0);
  scenes.forEach((s) => master.addLabel(s.id, s.navBeat));
  master.seek(state.b);
  const proxy = { s: 0 };
  const scrub = gsap.to(proxy, { s: NST, duration: NST, ease: 'none', paused: true, onUpdate: () => { master.seek(keyB(proxy.s)); } });

  const theatreEl = document.getElementById('theatre');
  // Desktop: the document itself never scrolls. A hidden full-viewport scroller carries the scroll length; Lenis drives it
  // from wheel events on the window, and ScrollTrigger scrubs against it. The stage stays put, so no frame can tear.
  // Phones: native touch scroll on the document, with a ScrollTrigger pin and snapping.
  const VS = !phone && !qs.has('winscroll');
  let scroller = window, spacer = null;
  if (VS) {
    html.classList.add('vscroll');
    scroller = document.createElement('div'); scroller.id = 'scroller'; scroller.setAttribute('aria-hidden', 'true');
    spacer = document.createElement('div'); spacer.style.height = (NST * STEP + H) + 'px';
    scroller.appendChild(spacer); document.body.appendChild(scroller);
    ScrollTrigger.defaults({ scroller });
  }
  let lenis = null;
  if (!phone && !matchMedia('(pointer: coarse)').matches && !qs.has('nolenis')) {
    lenis = new Lenis(VS ? { wrapper: scroller, content: spacer, eventsTarget: window, lerp: 0.085, smoothWheel: true, wheelMultiplier: 1, syncTouch: false } : { lerp: 0.1, smoothWheel: true, wheelMultiplier: 1, syncTouch: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
  }
  const curScroll = () => (VS ? scroller.scrollTop : scrollY);
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.config({ ignoreMobileResize: true });
  const trig = ScrollTrigger.create({
    scroller, trigger: VS ? spacer : theatreEl, start: 'top top', end: '+=' + NST * STEP, pin: !VS, pinSpacing: true, scrub: VS ? 0.55 : true, animation: scrub,
    snap: phone ? { snapTo: 1 / NST, duration: { min: 0.2, max: 0.45 }, delay: 0.05, ease: 'power1.inOut', inertia: false } : false,
  });
  const scrollToBeat = (b, instant) => {
    const y = trig.start + beatToStep(b) * STEP + 1;
    if (lenis) lenis.scrollTo(y, instant ? { immediate: true, force: true } : { force: true, duration: Math.min(3.2, 1 + Math.abs(y - curScroll()) / 5000), easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) });
    else (VS ? scroller : window).scrollTo({ top: y, behavior: instant ? 'auto' : 'smooth' });
  };
  if (DEBUG_B != null) { requestAnimationFrame(() => { scrollToBeat(DEBUG_B, true); ScrollTrigger.update(); master.seek(DEBUG_B); dirty = true; }); }
  window.__seek = (b) => { scrollToBeat(b, true); ScrollTrigger.update(); };
  window.__scrollPos = curScroll;
  window.__state = state;

  // hold scrolling until the cut has opened (about 3 s), so the load sequence is never skipped
  const unlockAt = 3.0;
  if (!NOINTRO) { if (lenis) lenis.stop(); else html.style.overflow = 'hidden'; }
  let unlocked = NOINTRO;

  // ---------- nav
  const tocLinks = [...document.querySelectorAll('a[href^="#"]')];
  for (const a of tocLinks) {
    const id = a.getAttribute('href').slice(1); const sc = scenes.find((s) => s.id === id);
    if (!sc) continue;
    a.addEventListener('click', (e) => { e.preventDefault(); closeMenu(); scrollToBeat(sc.navBeat); });
  }
  const navA = [...document.querySelectorAll('.toc a')];
  // focus inside a scene that is not on screen: bring it on screen
  document.addEventListener('focusin', (e) => {
    const sc = scenes.find((s) => s.el.contains(e.target) || (s.clone && s.clone.contains(e.target)));
    if (sc && (state.b < sc.range[0] + 0.5 || state.b > sc.range[1] - 0.5) && !(state.b >= sc.navBeat - 0.01 && state.b <= sc.range[1])) scrollToBeat(sc.navBeat, true);
  });
  // menu
  const menu = document.getElementById('menu'), mbtn = document.querySelector('.menu-btn'), sheetEl = menu.querySelector('.menu-sheet');
  function openMenu() { menu.hidden = false; mbtn.setAttribute('aria-expanded', 'true'); gsap.fromTo(sheetEl, { yPercent: -100, rotation: -1 }, { yPercent: 0, rotation: 0, duration: 0.55, ease: 'power3.out' }); lenis && lenis.stop(); setTimeout(() => menu.querySelector('a').focus(), 50); }
  function closeMenu() { if (menu.hidden) return; mbtn.setAttribute('aria-expanded', 'false'); gsap.to(sheetEl, { yPercent: -105, rotation: 1.2, duration: 0.38, ease: 'power2.in', onComplete: () => { menu.hidden = true; } }); unlocked && lenis && lenis.start(); mbtn.focus(); }
  mbtn.addEventListener('click', () => (menu.hidden ? openMenu() : closeMenu()));
  menu.querySelector('.menu-close').addEventListener('click', closeMenu);
  menu.addEventListener('click', (e) => { if (e.target === menu) closeMenu(); });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
    if (!VS || !lenis || !menu.hidden || e.target.closest('input,textarea,select')) return;
    const k = { ArrowDown: 0.25, ArrowUp: -0.25, PageDown: 1, PageUp: -1, ' ': e.shiftKey ? -1 : 1, Home: -1e3, End: 1e3 }[e.key];
    if (k == null) return;
    e.preventDefault();
    const cur = curScroll(), max = NST * STEP;
    const tgt = Math.abs(k) >= 1e3 ? (k > 0 ? max : 0) : Math.round((cur + k * STEP * (Math.abs(k) < 1 ? 1 : 1)) / (Math.abs(k) < 1 ? 1 : STEP)) * (Math.abs(k) < 1 ? 1 : STEP);
    lenis.scrollTo(Math.max(0, Math.min(max, tgt)), { duration: 0.9 });
  });

  // cut name label
  const cn = document.getElementById('cutname');
  const cnJa = cn.querySelector('span'), cnRom = cn.querySelector('b');

  // ---------- pointer: atlas sheen on cloth follows the cursor (desktop)
  // 光 slow movement moves the satin sheen on the cloth; 剣 a fast straight sweep is a blade: a steel glint crosses the page
  S.pointer = [W * 0.78, H * 0.4];
  const trail = [];
  if (!phone) addEventListener('pointermove', (e) => {
    const t = now(); S.pointer = [e.clientX, e.clientY]; S.pointerT = t; dirty = true;
    trail.push([e.clientX, e.clientY, t]); while (trail.length > 2 && t - trail[0][2] > 0.2) trail.shift();
    if (trail.length >= 3 && (!S.slash || t - S.slash.t0 > 0.8)) {
      let path = 0; for (let i = 1; i < trail.length; i++) path += Math.hypot(trail[i][0] - trail[i - 1][0], trail[i][1] - trail[i - 1][1]);
      const a = trail[0], z = trail[trail.length - 1], chord = Math.hypot(z[0] - a[0], z[1] - a[1]), dt = z[2] - a[2];
      if (chord > 240 && dt > 0 && chord / dt > 1300 && chord / path > 0.9) {
        const ux = (z[0] - a[0]) / chord, uy = (z[1] - a[1]) / chord;
        S.slash = { P0: [a[0] - ux * 260, a[1] - uy * 260], P1: [z[0] + ux * 700, z[1] + uy * 700], t0: t };
      }
    }
  }, { passive: true });

  // ---------- frame
  const domScenes = scenes;
  function ensureClone(s) {
    if (s.clone) return s.clone;
    const c = s.el.cloneNode(true);
    c.removeAttribute('id'); c.querySelectorAll('[id]').forEach((e) => e.removeAttribute('id'));
    c.setAttribute('aria-hidden', 'true'); c.inert = true; c.classList.add('clone');
    s.el.after(c); s.clone = c; return c;
  }
  function dropClone(s) { if (s.clone) { s.clone.remove(); s.clone = null; } }
  function transOf(s, b) {
    if (s.exit && b > s.exit.from && b <= s.exit.to + 1e-6) return { ...s.exit.state(b), freeze: s.exit.freeze, def: s.exit };
    if (s.enter && b >= s.enter.from && b < s.enter.to) return { ...s.enter.state(b), def: s.enter };
    return null;
  }
  let lastGround = '';
  function frame(b, T) {
    S._b = b;
    if (b > 0.02) for (const s of scenes) if (b >= s.range[0] - 0.6 && b <= s.range[1] && tasks.pending(s.id + '.')) tasks.needPrefix(s.id + '.');
    const vis = scenes.filter((s) => b >= s.range[0] - 1e-6 && b <= s.range[1] + 1e-6);
    const bottomUp = [...vis].sort((a, c) => a.z - c.z);
    R.begin();
    const glints = [];
    let label = null;
    for (const s of bottomUp) {
      const tr0 = transOf(s, b);
      s._tr = tr0;
      const bf = tr0 && tr0.freeze != null ? Math.min(b, tr0.freeze) : b;
      if (tr0 && tr0.pieces) {
        for (const pc of tr0.pieces) if (pc.shadow !== false) { R.push([1, 0, 0, 1, 10, 16], []); R.push(pc.M, pc.edges); R.shadow({ rect: [-W, -H, 3 * W, 3 * H], alpha: pc.shadowA ?? 0.3, blur: 26 }); R.pop(); R.pop(); }
        for (const pc of tr0.pieces) { R.push(pc.M, pc.edges); s.draw(bf, T, pc); R.pop(); }
      } else s.draw(b, T);
      if (tr0 && tr0.glint) glints.push(tr0.glint);
      if (tr0 && tr0.def.label) { const lb = tr0.def.label; const a = seg(b, lb.from, lb.from + 0.05) * (1 - seg(b, lb.to - 0.12, lb.to)); if (a > 0) label = { ...lb, a }; }
    }
    if (!label && scenes[0].introLabel) { const il = scenes[0].introLabel(T); if (il && il.a > 0) label = il; }
    for (const g of glints) R.glint(g.P0, g.P1, g.t, { tail: g.tail ?? 0.5, flare: g.flare ?? (phone ? 40 : 60), intensity: g.intensity ?? 1 });
    if (S.slash) { const k = T - S.slash.t0; if (k < 0.6) R.glint(S.slash.P0, S.slash.P1, clamp(k / 0.2), { tail: 0.7, flare: 48, intensity: 1 - seg(k, 0.28, 0.6) }); }

    // ---------- DOM: visibility, pieces, clones, clipping beneath transitions
    let cover = null; // null = fully visible; [] = hidden; polygon = visible only inside
    const topDown = [...scenes].sort((a, c) => c.z - a.z);
    for (const s of topDown) {
      const on = b >= s.range[0] - 1e-6 && b <= s.range[1] + 1e-6;
      if (!on) { if (s._on !== false) { s.el.style.visibility = 'hidden'; s._on = false; } dropClone(s); continue; }
      if (s._on !== true) { s.el.style.visibility = ''; s._on = true; }
      const t = s._tr;
      const coverCss = cover === null ? '' : polyCss(cover);
      if (t && t.pieces) {
        const bf = t.freeze != null ? Math.min(b, t.freeze) : b;
        const roots = t.pieces.length > 1 ? [s.el, ensureClone(s)] : [s.el];
        if (t.pieces.length < 2) dropClone(s);
        roots.forEach((root, i) => {
          s.dom(bf, root, T);
          const pc = t.pieces[i];
          let poly = pc.domPoly || rectPoly(-W, -H, 3 * W, 3 * H);
          if (cover !== null) { // the cover is in screen space; bring it into the piece's local space
            const inv = invertM(pc.M); let p2 = poly;
            for (const e of polyEdges(cover.map((q) => applyM(inv, q)))) p2 = clipBy(p2, e);
            poly = cover.length ? p2 : [];
          }
          setClip(root, polyCss(poly)); setT(root, css(pc.M));
        });
      } else {
        dropClone(s);
        s.dom(b, s.el, T);
        setClip(s.el, coverCss); setT(s.el, '');
      }
      if (!s.overlay) {
        const u = t ? t.under : [];
        if (cover === null) cover = u || [];
        else if (cover.length && u && u.length) { let p = cover; for (const e of polyEdges(u)) p = clipBy(p, e); cover = p; }
        else cover = [];
      }
    }
    // header colour from the ground under the logo
    let g = 'paper';
    for (const s of topDown) { if (b < s.range[0] || b > s.range[1]) continue; g = s.groundAt ? s.groundAt(b) : s.ground; break; }
    if (g !== lastGround) { html.dataset.ground = g; lastGround = g; }
    const end = b > 19.35; if (end !== html._end) { html.classList.toggle('end', end); html._end = end; }
    // current nav item
    let ci = 0; scenes.forEach((s, i) => { if (b >= s.navBeat - 0.5) ci = i; });
    navA.forEach((a, i) => { const cur = i === ci; if (a._cur !== cur) { cur ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'); a._cur = cur; } });
    if (label) {
      const [x, y] = label.at();
      cn.style.transform = `translate(${x}px, ${y}px)`; cn.style.opacity = label.a.toFixed(3);
      if (cnJa.textContent !== label.ja) { cnJa.textContent = label.ja; cnRom.textContent = label.rom; }
      cn.classList.toggle('on-cloth', !!label.cloth);
    } else if (cn.style.opacity !== '0') cn.style.opacity = '0';
  }

  // ---------- loop: render only when something changes; stop when the tab is hidden
  let lastB = -1, ui = -1;
  html.classList.add('ready');
  const loop = () => {
    if (document.hidden) return;
    const T = now();
    if (!unlocked && T >= unlockAt) { unlocked = true; if (lenis) lenis.start(); else html.style.overflow = ''; ScrollTrigger.refresh(); }
    const u = clamp((T - 4.0) / 0.8);
    if (u !== ui) { html.style.setProperty('--ui', u.toFixed(3)); html.classList.toggle('ui-on', u > 0.5); ui = u; }
    const animating = T < 18.6 || (S.anim && S.anim(T)) || (S.pointerT && T - S.pointerT < 0.05) || (S.slash && T - S.slash.t0 < 0.65);
    if (!dirty && !animating && state.b === lastB) return;
    dirty = false; lastB = state.b;
    frame(state.b, T);
  };
  gsap.ticker.add(loop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { lenis && lenis.stop(); } else { unlocked && lenis && lenis.start(); dirty = true; } });
  let rw = document.documentElement.clientWidth;
  addEventListener('resize', () => { if (Math.abs(document.documentElement.clientWidth - rw) > 40) location.reload(); });
  tasks.start(() => { const T = now(); return T > 0.15 && T < 3.75; });
  frame(state.b, now());
}
function invertM(M) { const [a, b, c, d, e, f] = M; const det = a * d - b * c; return [d / det, -b / det, -c / det, a / det, (c * f - d * e) / det, (b * e - a * f) / det]; }
function applyM(M, p) { return [M[0] * p[0] + M[2] * p[1] + M[4], M[1] * p[0] + M[3] * p[1] + M[5]]; }

// ======================================================================= reduced motion: every scene as its settled poster
async function posters(S, scenes) {
  const { H, R, tasks } = S;
  S.posterMode = true;
  tasks.flush();
  html.classList.add('posters');
  const snap = () => new Promise((res) => R.canvas.toBlob((bl) => res(URL.createObjectURL(bl)), 'image/jpeg', 0.9));
  for (const s of scenes) {
    const list = s.poster || [s.range[1]];
    const urls = [];
    for (const b of list) { R.begin(); s.draw(b, 20); urls.push(await snap()); }
    const st = s.el.style;
    st.height = H * list.length + 'px';
    st.backgroundImage = urls.map((u) => `url(${u})`).join(',');
    st.backgroundSize = `100% ${H}px`;
    st.backgroundPosition = list.map((_, i) => `0 ${i * H}px`).join(',');
    st.backgroundRepeat = 'no-repeat';
    s.dom(list[0], s.el, 20);
    if (s.posterDom) s.posterDom(list);
  }
  const onScroll = () => {
    let g = 'paper';
    for (const s of scenes) { const r = s.el.getBoundingClientRect(); if (r.top <= 32 && r.bottom > 32) g = s.ground; }
    if (html.dataset.ground !== g) html.dataset.ground = g;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  html.classList.add('ready');
}

boot().catch((e) => { console.error(e); html.classList.add('ready'); });
