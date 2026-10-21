// The scroll director (§3.2): input -> raw position -> a critically damped follower -> the position the film shows.
//   desktop (fine pointer)  Lenis (lerp .10); one beat B = round(0.7111 · innerHeight) (640 at 900, one capture wheel
//                           step); 250 ms after the last input the settle snap brings any other rest onto a hold
//   touch (coarse pointer)  native scroll; one poster STEP = round(1.14 · innerHeight); ScrollTrigger snaps it
// The track is the layout's ordered list of holds (core/tracks.js SEQ): every beat on landscape, PHONE on portrait.
// Keys step one beat; Home/End, nav links, the ruler, deep links and focus jump (a freeze and one slash, fx/cut.js).
// The stage is position: fixed and never pinned; only #track scrolls (§3.1).
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SEQ, posOf } from './tracks.js';
import { HASH_BEAT, SCENE_OF } from './shots.js';
import { EASES } from './eases.js';

const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);

export class Director {
  constructor({ frozen = null, onJump = null, onInput = null } = {}) {
    this.html = document.documentElement;
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.coarse = matchMedia('(pointer: coarse)').matches;
    this.track = document.getElementById('track');
    this.frozen = frozen;
    this.onJump = onJump; this.onInput = onInput;
    this.W = 9; this.x = 0; this.v = 0;
    this.lastInput = -1e9;
    this.measure();
    if (frozen == null) this.bind();
    this.x = this.raw(); this.v = 0;
  }
  measure() {
    const w = document.documentElement.clientWidth || innerWidth, h = innerHeight;
    this.w = w; this.h = h;
    this.layout = w / h >= 1.2 ? 'land' : 'port';
    this.seq = SEQ[this.layout]; this.n = this.seq.names.length;
    this.unit = this.coarse ? Math.round(1.14 * h) : Math.round(0.7111 * h);
    this.track.style.height = `${(this.n - 1) * this.unit + h}px`;
  }
  scrollY() { return this.lenis ? this.lenis.scroll : window.scrollY; }
  raw() { return this.frozen != null ? this.frozen : clamp(this.scrollY() / this.unit, 0, this.n - 1); }
  target() { return this.lenis ? this.lenis.targetScroll / this.unit : this.raw(); }

  bind() {
    if (!this.coarse) {
      this.lenis = new Lenis({ lerp: 0.10, wheelMultiplier: 1, smoothWheel: true, syncTouch: false, autoRaf: false });
    } else {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });
      this.snapT = ScrollTrigger.create({ start: 0, end: (this.n - 1) * this.unit, snap: { snapTo: 1 / (this.n - 1), duration: { min: 0.2, max: 0.45 }, delay: 0.05, ease: 'power1.inOut', inertia: false } });
    }
    const input = () => { this.lastInput = performance.now(); this.snapIssued = false; if (this.onInput) this.onInput(); };
    addEventListener('wheel', input, { passive: true });
    addEventListener('touchstart', input, { passive: true });
    addEventListener('touchmove', input, { passive: true });
    addEventListener('keydown', (e) => this.key(e));
    // in-page anchors (nav, ruler, CTA, skip link, menu, footer) jump to their beat
    document.addEventListener('click', (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const id = a.getAttribute('href').slice(1);
      const name = HASH_BEAT[id];
      if (!name) return;
      e.preventDefault();
      input();
      this.jump(posOf(name, this.layout));
      if (a.classList.contains('skip')) { const t = document.querySelector('#aloqa .tel'); if (t) t.focus({ preventScroll: true }); }
    });
    // keyboard focus on a block of another scene brings that scene on screen (§7.1)
    document.addEventListener('focusin', (e) => {
      const el = e.target;
      if (!el || !el.closest || this.html.classList.contains('menu-open')) return;
      const sec = el.closest('#story > .scene, #foot');
      if (!sec || sec.classList.contains('on')) return;
      const b = el.closest('[data-beat]');
      const name = b ? b.dataset.beat.split(/\s+/)[0] : sec.id === 'foot' ? 'bookend.steel' : HASH_BEAT[sec.id];
      if (name) { input(); this.jump(posOf(name, this.layout)); }
    });
    addEventListener('hashchange', () => { const p = this.hashPos(); if (p != null) this.jump(p); });
    let rt = 0;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => this.resize(), 150); });
  }
  // the beat a URL hash asks for: #b=<name> (the language switch) or a scene id (§7.1)
  hashPos(hash = location.hash) {
    const m = /^#b=([\w.]+)/.exec(hash);
    if (m) return posOf(m[1], this.layout);
    const id = hash.slice(1);
    return HASH_BEAT[id] ? posOf(HASH_BEAT[id], this.layout) : null;
  }
  resize() {
    const w = document.documentElement.clientWidth || innerWidth, h = innerHeight;
    if (w === this.w && Math.abs(h - this.h) <= 120) return;
    const pos = this.x, lay = this.layout;
    this.measure();
    const p = lay === this.layout ? pos : posOf(Math.round(pos), this.layout);
    if (this.lenis) this.lenis.resize();
    if (this.snapT) { this.snapT.kill(); this.snapT = ScrollTrigger.create({ start: 0, end: (this.n - 1) * this.unit, snap: { snapTo: 1 / (this.n - 1), duration: { min: 0.2, max: 0.45 }, delay: 0.05, ease: 'power1.inOut', inertia: false } }); }
    this.place(p, true);
    this.x = p; this.v = 0;
    if (this.onResize) this.onResize();
  }
  place(pos, immediate, duration = 1.1) {
    const y = clamp(pos, 0, this.n - 1) * this.unit;
    if (this.lenis) this.lenis.scrollTo(y, immediate ? { immediate: true, force: true } : { duration, easing: EASES.inOutCubic, force: true });
    else window.scrollTo({ top: y, behavior: immediate ? 'instant' : 'smooth' });
  }
  key(e) {
    if (this.frozen != null || e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (this.html.classList.contains('menu-open')) return;
    const k = e.key;
    let d = 0;
    if (k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !e.shiftKey)) d = 1;
    else if (k === 'ArrowUp' || k === 'PageUp' || (k === ' ' && e.shiftKey)) d = -1;
    else if (k === 'Home' || k === 'End') { e.preventDefault(); this.lastInput = performance.now(); this.jump(k === 'Home' ? 0 : this.n - 1); return; }
    if (!d) return;
    if (k === ' ' && t && t.closest && t.closest('a, button')) return;
    e.preventDefault();
    this.lastInput = performance.now(); this.snapIssued = false;
    if (this.onInput) this.onInput();
    this.place(clamp(Math.round(this.target()) + d, 0, this.n - 1), false, 1.1);
  }
  // a move of more than one beat never scrubs through the beats between: freeze, jump, one slash (§3.2)
  jump(pos) {
    pos = clamp(pos, 0, this.n - 1);
    if (this.frozen != null) { this.frozen = pos; return; }
    if (Math.abs(pos - this.x) <= 1.01) { this.place(pos, false, 1.1); return; }
    if (this.onJump) this.onJump(pos);
    this.place(pos, true);
    this.x = pos; this.v = 0;
  }
  // every tick: the raw position, the settle snap, the follower (fixed 1/120 s substeps: stable at 3 fps)
  update(dt, timeMs) {
    if (this.lenis) this.lenis.raf(timeMs);
    const raw = this.raw();
    if (this.lenis && !this.snapIssued && performance.now() - this.lastInput > 250) {
      const t = this.lenis.targetScroll, r = Math.round(t / this.unit) * this.unit;
      if (Math.abs(t - r) > 2) this.place(r / this.unit, false, 0.45);
      this.snapIssued = true;
    }
    if (this.reduced || this.frozen != null) { this.x = this.reduced && this.frozen == null ? Math.round(raw) : raw; this.v = 0; return this.x; }
    let h = Math.min(dt, 0.25), x = this.x, v = this.v;
    const W = this.W;
    while (h > 1e-6) { const s = Math.min(h, 1 / 120); h -= s; const a = -W * W * (x - raw) - 2 * W * v; v += a * s; x += v * s; }
    if (Math.abs(x - raw) < 5e-4 && Math.abs(v) < 5e-3) { x = raw; v = 0; }
    this.x = x; this.v = v;
    return x;
  }
  settled() { return this.v === 0 && this.x === this.raw(); }
}
export { gsap, SCENE_OF };
