// 焼 Yaki, Fallback Y2 (§2.3): the four steps are four oshigata plates in sumi ink on the washi (the clay line, the
// heat hatching, the quench waterline, the curve), the flow page's own plates (sword/drawing.js plateYaki, built at
// G0) set inline over the paper with the steps' text. The 3D sword is not drawn on these holds (shots.js hide).
// The transition is the pen: between two plates a front travels along the blade from the tang to the tip; behind it
// the new plate's hatching is laid down and its outline is traced ahead of it, in front of it the old plate still
// stands (the heat front of the spec's B7 -> B8 travels the same way). Nothing fades.
// All four plates share one placement (their svg origin is the machi on the blade's axis), so the straight blade of
// steps 1 and 2 stays put while its hatching changes, the quench plate dips the same blade into the water and the
// last one bends it.
import { BEATS, PHONE } from '../core/shots.js';

const clamp = (x) => Math.max(0, Math.min(1, x));
const sine = (x) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(x));
// placement: the machi (svg 0,0) at m (fractions of the viewport), the axis at ang degrees, scale s per reference px
// (land: of a 1440 × 900 frame, port: of a 390 px wide one). The quench plate has its own (it carries the water).
const PLACE = {
// range: the part of the plate's width that is on screen (the pen's front runs over it, not over the cropped tang)
  land: { base: { m: [-0.328, 0.902], ang: -14, s: 1.9, range: [0.42, 1] }, 3: { c: [0.555, 0.655], ang: 0, s: 1.05, range: [0.04, 0.98] } },
  // (the phone's quench plate is cropped to its waterline and the submerged blade: af, the anchor as a fraction of it)
  port: { base: { m: [-0.56, 1.433], ang: -62, s: 1.15, range: [0.52, 1] }, 3: { c: [0.5, 0.6], af: [0.6, 0.6], ang: 0, s: 0.92, range: [0.44, 0.76] } },
};
const DASHED = /\b(dash|dash2|hid|cl|fill|dot)\b/;
const SAME = { 1: 'a', 2: 'a', 3: 'b', 4: 'c' };

export class Plates {
  constructor() {
    this.items = [];
    const beats = [...document.querySelectorAll('.s-yaki .beat[data-beat]')];
    beats.forEach((el, i) => {
      const fig = el.querySelector('.plate'), img = fig && fig.querySelector('img');
      if (!img) return;
      const name = el.dataset.beat;
      const it = { fig, step: i + 1, name, idx: { land: BEATS.indexOf(name), port: PHONE.indexOf(name) }, ready: false, st: '' };
      fig.classList.add('pl');
      this.items.push(it);
      this.load(it, img);
    });
    this.size = '';
  }
  async load(it, img) {
    try {
      const src = img.getAttribute('src');
      const txt = await (await fetch(src)).text();
      const doc = new DOMParser().parseFromString(txt, 'image/svg+xml');
      const svg = doc.documentElement, vb = svg.getAttribute('viewBox').split(/\s+/).map(Number);
      const paths = [...svg.querySelectorAll('g > path, g > circle, g > use')];
      const NS = 'http://www.w3.org/2000/svg';
      const mk = (cls) => { const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', vb.join(' ')); s.setAttribute('class', cls); s.setAttribute('aria-hidden', 'true'); const g = document.createElementNS(NS, 'g'); g.setAttribute('fill', 'none'); g.setAttribute('stroke-linecap', 'round'); g.setAttribute('stroke-linejoin', 'round'); s.appendChild(g); return [s, g]; };
      const [so, go] = mk('pl-o'), [stx, gt] = mk('pl-t');
      const outl = [];
      for (const p of paths) {
        const c = document.importNode(p, true), cls = c.getAttribute('class') || '', d = c.getAttribute('d') || '';
        // a single traced line (one subpath, solid): the pen draws it; everything else is laid behind the front
        if (c.tagName === 'path' && !DASHED.test(cls) && (d.match(/[Mm]/g) || []).length === 1) { c.setAttribute('pathLength', '1'); c.style.strokeDasharray = '1 1'; c.style.strokeDashoffset = '1'; go.appendChild(c); outl.push(c); }
        else gt.appendChild(c);
      }
      const box = document.createElement('div'); box.className = 'pl-in';
      box.style.width = vb[2] + 'px'; box.style.height = vb[3] + 'px';
      box.append(stx, so);
      img.replaceWith(box);
      Object.assign(it, { vb, box, so, stx, outl, ready: true, st: '' });
      this.size = '';
    } catch (e) { /* the plate stays an image (flow mode's own) */ }
  }
  place(layout) {
    const W = innerWidth, H = innerHeight, key = `${layout}|${W}x${H}`;
    if (this.size === key) return;
    this.size = key;
    const P = PLACE[layout], k = layout === 'land' ? Math.min(W / 1440, H / 900) : W / 390;
    for (const it of this.items) {
      if (!it.ready) continue;
      const [x0, y0, w, h] = it.vb, q = P[it.step] || P.base, s = q.s * k;
      // the anchor in the plate's own px: the machi (svg 0,0), or the plate's centre for the quench plate
      const ax = q.c ? w * (q.af ? q.af[0] : 0.5) : -x0, ay = q.c ? h * (q.af ? q.af[1] : 0.5) : -y0;
      const tx = (q.c || q.m)[0] * W, ty = (q.c || q.m)[1] * H;
      it.box.style.transform = `translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px) rotate(${q.ang}deg) scale(${s.toFixed(4)}) translate(${(-ax).toFixed(1)}px,${(-ay).toFixed(1)}px)`;
    }
  }
  // d: the film's descriptor (core/tracks.js). Per plate: hidden, arriving (the pen at q), at rest, or leaving
  // (the pen of the next plate passing over it).
  apply(d) {
    if (!this.items.length) return;
    const layout = d.layout || 'land';
    this.place(layout);
    const intro = d.a === 'intro', k = intro ? -9 : d.k, f = intro ? 0 : d.f;
    const freeze = !intro && d.tr && (d.tr.type === 'cut' || d.tr.type === 'wipe');
    // the pen's front: under a freeze it runs while the halves part (the incoming hold is the live layer)
    // the plates of this segment: the same blade (steps 1 and 2) is re-hatched under one front; a new geometry (the
    // dip, the bend) is drawn once the old plate is gone, so two blades never cross on the paper
    const A = this.items.find((it) => it.ready && it.idx[layout] === k), B = this.items.find((it) => it.ready && it.idx[layout] === k + 1);
    const same = A && B && SAME[A.step] === SAME[B.step];
    let q, ql, qa;
    if (freeze) { q = sine((f - 0.30) / 0.55); ql = sine((f - 0.24) / 0.50); qa = q; }
    else if (same || !A || !B) { q = sine((f - 0.22) / 0.62); ql = sine((f - 0.16) / 0.56); qa = q; }
    else { qa = sine((f - 0.10) / 0.26); q = sine((f - 0.30) / 0.50); ql = sine((f - 0.26) / 0.40); }
    for (const it of this.items) {
      if (!it.ready) continue;
      const i = it.idx[layout];
      let mode = 'off', front = 1, line = 1;
      if (i >= 0 && i === k) { if (f <= 0) mode = 'rest'; else if (freeze) mode = f < 0.2 ? 'rest' : 'off'; else { mode = 'leave'; front = qa; } }
      else if (i >= 0 && i === k + 1) { if (f >= 1) mode = 'rest'; else { mode = 'arrive'; front = q; line = ql; } }
      if (!intro && d.atHold && d.hold === it.name) mode = 'rest';
      // (the pen not yet on the paper, or the old plate wholly passed: nothing of that plate is drawn)
      if (mode === 'leave' && front >= 0.999) mode = 'off';
      const r = (PLACE[layout][it.step] || PLACE[layout].base).range || [0, 1];
      if (mode === 'arrive' && front <= 0.001) front = -1;
      if (mode === 'leave' || (mode === 'arrive' && front >= 0)) front = r[0] + (r[1] - r[0]) * front;
      if (front < 0) front = 0;
      const st = `${mode}|${front.toFixed(4)}|${line.toFixed(4)}`;
      if (st === it.st) continue;
      it.st = st;
      it.fig.style.visibility = mode === 'off' ? 'hidden' : '';
      it.fig.classList.toggle('now', mode === 'rest');
      if (mode === 'leave') { it.box.style.clipPath = `inset(0 0 0 ${(front * 100).toFixed(2)}%)`; it.stx.style.clipPath = ''; this.dash(it, 1); }
      else if (mode === 'arrive') { it.box.style.clipPath = ''; it.stx.style.clipPath = `inset(0 ${((1 - front) * 100).toFixed(2)}% 0 0)`; this.dash(it, line); }
      else { it.box.style.clipPath = ''; it.stx.style.clipPath = ''; this.dash(it, 1); }
    }
  }
  dash(it, p) {
    const v = (1 - clamp(p)).toFixed(4);
    if (it.dashV === v) return;
    it.dashV = v;
    for (const c of it.outl) c.style.strokeDashoffset = v;
  }
}
