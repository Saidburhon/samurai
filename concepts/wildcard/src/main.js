import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { makeLayout, N, POSTERS } from './layout.js';
import { createStage } from './stage.js';
import { initialState, buildMaster } from './story.js';
import { buildIntro } from './intro.js';
import { place, collectEls, makeSync, startClocks, bindPicks, bindMenu, makeCursor, PLATEAU_OF } from './ui.js';
import { runFlow } from './flow.js';

gsap.registerPlugin(ScrollTrigger);
const html = document.documentElement;
const $ = (id) => document.getElementById(id);

async function fonts() {
  const want = ['112px "Dela Gothic One"', '300 40px "Noto Serif Display"', 'italic 300 40px "Noto Serif Display"', '500 13px "IBM Plex Mono"', '400 20px "Onest"', '600 20px "Onest"', '500 16px "Zen Kaku Gothic New"'];
  const all = Promise.all(want.map((f) => document.fonts.load(f, 'AOʻaz絣止進日本')));
  await Promise.race([all, new Promise((r) => setTimeout(r, 2500))]);
}

function overlays(L) {
  const pin = $('pin');
  pin.insertAdjacentHTML(
    'beforeend',
    `<div class="fr cue wp" id="cue" aria-hidden="true"><svg class="yag" viewBox="0 0 18 34">${[0, 1, 2].map((k) => `<g transform="translate(0 ${k * 11})" opacity="${1 - k * 0.25}"><path d="M0 0L9 6V10L0 4Z" fill="#F2B11B"/><path d="M18 0L9 6V10L18 4Z" fill="#F6F1E6"/></g>`).join('')}</svg><span>PASTGA</span></div>
     <div class="fr kz" id="kz" aria-hidden="true"><span lang="ja">改善</span> <b>1</b></div>`
  );
  const fy = L.F + Math.round((L.H - L.F) / 2);
  Object.assign($('cnt').style, { left: L.m + 'px', top: fy - 8 + 'px' });
  Object.assign($('cue').style, { right: L.m + 'px', top: fy - 17 + 'px' });
  Object.assign($('kz').style, { right: (L.phone ? 16 : L.W * 0.08) + 'px', top: fy - 8 + 'px' });
  $('cue').style.setProperty('--w', 0);
}

const MARK = (n) => (window.__marks = window.__marks || []).push([n, Math.round(performance.now())]);
async function boot() {
  MARK('boot');
  await fonts();
  MARK('fonts');
  const W = innerWidth, H = innerHeight;
  const phone = W < 760;
  html.classList.toggle('phone', phone);
  bindMenu();
  bindPicks();
  if (html.classList.contains('flow')) {
    const L = makeLayout(W, H, phone, true);
    place(L);
    startClocks(L);
    return runFlow(L);
  }
  const L = makeLayout(W, H, phone, false);
  place(L);
  startClocks(L);
  overlays(L);
  const el = collectEls();
  let stage;
  try {
    stage = createStage(L, $('stage'));
  } catch (e) {
    console.warn('WebGL unavailable, flow mode', e);
    html.classList.replace('loom', 'flow');
    const L2 = makeLayout(W, H, phone, true);
    place(L2);
    return runFlow(L2);
  }
  MARK('stage');
  const U = initialState(L);
  const master = buildMaster(L, U, el);
  const touch = html.classList.contains('touch');
  const S = L.S;
  const total = (N - 1) * S;
  $('snaps').innerHTML = POSTERS.map((_, k) => `<i style="top:${k * S}px"></i>`).join('');

  // ---- scroll: Lenis on desktop (wheel only), native touch scroll with CSS snap on phones
  // Desktop scrolls a fixed wrapper (Lenis wrapper + ScrollTrigger scroller), so the document itself never moves;
  // phones scroll the window natively, with CSS snap points.
  let lenis = null;
  const scroller = $('scroller');
  if (!touch) {
    lenis = new Lenis({ wrapper: scroller, content: $('track'), eventsTarget: window, autoRaf: false, smoothWheel: true, syncTouch: false, lerp: 0.05, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    window.lenis = lenis;
    ScrollTrigger.defaults({ scroller });
  }
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.config({ ignoreMobileResize: true });
  const st = ScrollTrigger.create({ trigger: '#pin', start: 'top top', end: '+=' + total, pin: true, pinSpacing: true, pinType: 'fixed', scrub: true, animation: master });
  // focus can make the browser scroll overflow:hidden boxes to reveal an element; the stage never scrolls
  for (const id of ['dom', 'pin']) $(id).addEventListener('scroll', (e) => { e.target.scrollTop = 0; e.target.scrollLeft = 0; });

  const goTo = (k) => {
    k = Math.max(0, Math.min(N - 1, k));
    const y = k * S;
    if (lenis) lenis.scrollTo(y, { duration: Math.min(2.6, 0.7 + Math.abs(k - master.time()) * 0.16) });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-k]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    goTo(+a.dataset.k);
  });
  document.addEventListener('focusin', (e) => {
    const sec = e.target.closest && e.target.closest('.pn');
    if (!sec || e.target.closest('.hdr')) return;
    const k = PLATEAU_OF[sec.id];
    if (k != null && Math.abs(master.time() - k) > 0.05) goTo(k);
  });
  addEventListener('keydown', (e) => {
    if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) return;
    const onCtl = e.target.closest && e.target.closest('a, button');
    const k = Math.round(master.time());
    let n = null;
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey && !onCtl)) n = k + 1;
    if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey && !onCtl)) n = k - 1;
    if (e.key === 'Home') n = 0;
    if (e.key === 'End') n = N - 1;
    if (n != null) { e.preventDefault(); skipIntro(); goTo(n); }
  });

  // ---- the load sequence
  const Ui = {};
  const fx = {
    kaizen(n) {
      const kz = $('kz');
      kz.querySelector('b').textContent = n;
      gsap.fromTo(kz, { '--w': 0 }, { '--w': 1, duration: 0.18, ease: 'power2.out', overwrite: true });
      gsap.to(kz, { '--a': 1, duration: 0.2, delay: 0.32, ease: 'power2.in' });
      gsap.set(kz, { '--a': 0 });
    },
    cue(on) { gsap.to('#cue', { '--w': on ? 1 : 0, duration: 0.5, ease: 'power2.inOut' }); },
  };
  $('kz').classList.add('wp');
  $('kz').style.setProperty('--w', 0);
  const intro = buildIntro(L, Ui, U, el, fx);
  let introActive = true;
  window.__intro = intro;
  const cnt = $('cntn');
  intro.eventCallback('onUpdate', () => {
    const t = intro.time();
    if (t < 1.7) cnt.textContent = String(Math.min(L.threads, Math.max(1, Math.round(Math.pow(2, Math.max(0, t - 0.0) / 0.12 / 1.0) )))).padStart(3, '0');
  });
  intro.eventCallback('onComplete', () => { introActive = false; });
  $('cnt').classList.add('wp');
  intro.call(() => gsap.to('#cnt', { '--a': 1, duration: 0.4, ease: 'power2.in' }), null, 2.5);
  let skipped = false;
  const skipIntro = () => {
    if (skipped || !introActive) return;
    skipped = true;
    intro.timeScale(9);
  };
  addEventListener('wheel', skipIntro, { passive: true });
  addEventListener('touchstart', skipIntro, { passive: true });
  addEventListener('scroll', () => { if (scrollY > 4) skipIntro(); }, { passive: true });
  if (lenis) lenis.on('scroll', () => { if (lenis.scroll > 4) skipIntro(); });

  // restore the poster after a reload (resize)
  let restore = null;
  try { restore = sessionStorage.getItem('qilich.y'); sessionStorage.removeItem('qilich.y'); } catch (e) {}
  MARK('built');
  stage.compile();
  MARK('compiled');
  if (restore != null) {
    intro.progress(1);
    introActive = false;
    window.scrollTo(0, +restore);
    lenis && lenis.scrollTo(+restore, { immediate: true, force: true });
  } else {
    // the intro clock follows the wall clock from navigation start (the inline Canvas2D drew the first act)
    gsap.ticker.tick();
    const startAt = Math.min(1.75, Math.max(0, performance.now() / 1000 - 0.25));
    intro.time(startAt).play();
  }

  // ---- the hand on the cloth: disturbance, sheen follows, and the beat-back
  const hand = { lift: 0 };
  let lastFast = 0, lastStamp = -1e9, beating = null;
  const cursor = makeCursor((x0, y0, x1, y1, speed) => {
    const now = performance.now();
    U.lightX = Ui.lightX = x1;
    U.lightY = Ui.lightY = y1;
    if (y1 > L.F - 4 || speed < 80) return;
    stage.stamp(x0, y0, x1, y1, Math.min(1, speed / 1400));
    lastStamp = now;
    if (speed > 300) lastFast = now;
  });
  const beatBack = () => {
    beating = gsap.timeline({ onComplete: () => (beating = null) });
    beating.to(hand, { lift: 18, duration: 0.15, ease: 'power2.out' });
    [0, 1, 2].forEach((n) => {
      const t = 0.15 + n * 0.25;
      beating.to(hand, { lift: 0, duration: 0.08, ease: 'power4.in' }, t);
      beating.call(() => { stage.decay(0, 0.45); fx.kaizen(n + 1); }, null, t + 0.08);
      if (n < 2) beating.to(hand, { lift: 12, duration: 0.12, ease: 'power2.out' }, t + 0.1);
    });
  };

  // ---- one loop: Lenis → ScrollTrigger → state → DOM → render only when something changed
  const sync = makeSync(L, el);
  const BENCH = /bench/.test(location.search);
  const GAP = +(new URLSearchParams(location.search).get('gap') ?? (stage.software ? 400 : 0));
  let pending = false, lastRender = 0;
  const ft = [];
  let vel = 0, cueOn = true, lastY = 0, vSm = 0;
  const sk = { lift: 0 };
  gsap.ticker.add((time, dtMs) => {
    const dt = Math.min(0.25, dtMs / 1000);
    const Sx = introActive ? Ui : U;
    const yNow = lenis ? lenis.scroll : scrollY;
    const vRaw = (yNow - lastY) / Math.max(dt, 1 / 120);
    lastY = yNow;
    vSm += (vRaw - vSm) * Math.min(1, dt * 12);
    const v = Math.abs(vSm) < 4 ? 0 : vSm;
    const target = Math.min(phone ? 12 : 16, Math.abs(v) / (phone ? 240 : 160));
    vel += (target - vel) * Math.min(1, dt * 9);
    if (vel < 0.08) vel = 0;
    Sx.ampVel = Math.round(vel * 10) / 10;
    Sx.velSign = v >= 0 ? 1 : -1;
    const now = performance.now();
    stage.decay(dt);
    if (!beating && !introActive && stage.energy() > 0.035 && now - lastFast > 250 && now - lastStamp < 1500) beatBack();
    const kNow = introActive ? 0 : master.time();
    if (cueOn && kNow > 0.12) { cueOn = false; fx.cue(false); }
    if (!cueOn && kNow < 0.05 && !introActive) { cueOn = true; fx.cue(true); }
    sk.lift = hand.lift;
    const changed = stage.apply(Sx, sk);
    if (cursor) cursor.step(dt, html.dataset.ctone);
    if (changed) pending = true;
    if ((pending || BENCH) && !document.hidden && !window.__pause && now - lastRender >= GAP) {
      pending = false;
      lastRender = now;
      sync(Sx, kNow); // the DOM text moves in the same frame as the cloth
      const t0 = performance.now();
      stage.render();
      if (BENCH) { stage.renderer.getContext().finish(); ft.push(performance.now() - t0); if (ft.length > 30) ft.shift(); window.__ft = ft.reduce((a, b) => a + b, 0) / ft.length; }
      if (!window.__glOn) MARK('first-render');
      window.__glOn = true;
      window.__renders = (window.__renders || 0) + 1;
    }
  });
  html.dataset.ready = '1';
  window.__qilich = { get k() { return master.time(); }, master, U, L };

  let rz = null;
  addEventListener('resize', () => {
    clearTimeout(rz);
    rz = setTimeout(() => {
      if (Math.abs(innerWidth - W) > 2 || Math.abs(innerHeight - H) > 140) {
        try { sessionStorage.setItem('qilich.y', String(Math.round(master.time()) * S)); } catch (e) {}
        location.reload();
      }
    }, 350);
  });
}

boot().catch((e) => {
  console.error(e);
  html.classList.remove('loom');
  html.classList.add('flow');
});
