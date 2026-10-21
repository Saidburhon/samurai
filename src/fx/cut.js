// Freeze transitions (§3.7): one mechanism for the four split cuts, the soft wipes and the jump slash.
// The frozen sheet of the transition k -> k+1 always shows hold k, in whichever direction the visitor travels; the
// live layers beneath show the incoming hold. prepare(k) renders S(k) in the same task as it copies the GL canvas
// (no preserveDrawingBuffer), clones the ground, the drawing, the dial, the labels and hold k's visible text into one
// sheet (ids stripped, aria-hidden, inert), and leaves the live frame to be rendered again by the next tick.
// Inside [k + .2, k + .8] the sheet is shown: split cuts as two halves clipped by the cut line (clip-path polygon) and
// pushed apart along its normal; wipes as one sheet under a moving mask with a lit rim.
import { EASES } from '../core/eases.js';
import { SEQ, evalS } from '../core/tracks.js';

const NS = 'http://www.w3.org/2000/svg';
const diagOf = (w, h) => Math.hypot(w, h);
const stripIds = (el) => { el.removeAttribute && el.removeAttribute('id'); for (const x of el.querySelectorAll ? el.querySelectorAll('[id]') : []) x.removeAttribute('id'); return el; };

// the viewport rectangle clipped by a half-plane n·(x − P) <= 0 (Sutherland–Hodgman)
function halfPoly(W, H, P, n, sign) {
  const pts = [[0, 0], [W, 0], [W, H], [0, H]], out = [];
  const side = (q) => sign * ((q[0] - P[0]) * n[0] + (q[1] - P[1]) * n[1]);
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], sa = side(a), sb = side(b);
    if (sa <= 0) out.push(a);
    if ((sa < 0 && sb > 0) || (sa > 0 && sb < 0)) { const t = sa / (sa - sb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
  }
  return out;
}
const polyCss = (pts, pad) => `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`;

export class Cut {
  constructor(film, dom) {
    this.film = film; this.dom = dom;
    this.root = document.getElementById('cut');
    this.cache = new Map();
    this.shown = null;
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  reset() { this.cache.clear(); this.hide(); }
  key(k, layout) { const st = this.film.st; return `${layout}|${k}|${st.w}x${st.h}`; }
  ready(k, layout) { return this.cache.has(this.key(k, layout)); }

  // the freeze of hold k for the transition k -> k + 1 (its type decides the shape)
  prepare(k, layout) {
    const key = this.key(k, layout);
    if (this.cache.has(key)) return this.cache.get(key);
    const tr = SEQ[layout].trans[k];
    const d = evalS(k, layout);
    const fz = this.snapshot(d, tr);
    this.cache.set(key, fz);
    // a few sheets at most (each holds a copy of the canvas)
    if (this.cache.size > 4) for (const kk of this.cache.keys()) { if (kk !== key && this.shown !== this.cache.get(kk)) { this.cache.delete(kk); break; } }
    return fz;
  }
  // render a state, copy it, clone the page's layers for it; the caller's next frame renders the live state again
  snapshot(d, tr) {
    const film = this.film, st = film.st, W = st.w, H = st.h;
    film.apply(d); if (this.dom) this.dom.apply(d);
    film.render();
    const src = st.renderer.domElement, gl = document.createElement('canvas');
    gl.width = src.width; gl.height = src.height;
    gl.getContext('2d').drawImage(src, 0, 0);
    const sheet = this.build(gl, d);
    // where the wipes start: the tsuba of the frozen hold, on screen
    const ts = st.project(st.point('tsuba'));
    film.dirty = true; film.lastKey = '';
    return { sheet, tr: tr || { type: 'cut', cut: { ang: -18, at: [0.5, 0.5] } }, W, H, ts, k: d.k };
  }
  build(gl, d) {
    const s = document.createElement('div');
    s.className = 'fz';
    const layer = (el) => { el.classList.add('fz-l'); s.appendChild(el); return el; };
    // the ground and the paper's light, with their computed backgrounds
    const cs = (el) => getComputedStyle(el);
    const ground = [...document.querySelectorAll('#paper .sheet.on')].sort((a, b) => (+(a.style.zIndex || 0)) - (+(b.style.zIndex || 0)));
    for (const g of ground) {
      const c = document.createElement('div'), x = cs(g);
      c.style.background = x.background; c.style.backgroundColor = x.backgroundColor; c.style.opacity = g.style.opacity || '';
      layer(c);
    }
    const dk = document.querySelector('#paper .deckle');
    if (dk) { const c = document.createElement('div'); c.style.background = cs(dk).background; layer(c); }
    const dial = document.getElementById('dialw');
    if (dial && dial.style.visibility !== 'hidden') { const c = stripIds(dial.cloneNode(true)); c.classList.add('fz-dial'); s.appendChild(c); }
    // the drawing: the wrapper with its matrix, the stipple as a copy of its raster
    const paper = document.getElementById('osh-paper');
    if (paper && paper.style.visibility !== 'hidden') {
      const ink = document.createElement('div'); ink.className = 'fz-ink';
      const stip = document.getElementById('stip');
      if (stip && stip.style.visibility !== 'hidden') {
        const srcCv = stip.__stip ? stip.__stip.ctx.canvas : stip;
        const c = document.createElement('canvas'); c.width = srcCv.width; c.height = srcCv.height;
        try { c.getContext('2d').drawImage(srcCv, 0, 0); } catch (e) { /* an empty raster */ }
        c.style.cssText = `position:absolute;left:0;top:0;width:${stip.style.width};height:${stip.style.height};transform:${stip.style.transform || 'none'};transform-origin:0 0`;
        ink.appendChild(c);
      }
      const pc = stripIds(paper.cloneNode(true)); pc.style.willChange = '';
      ink.appendChild(pc);
      const fr = document.getElementById('front');
      if (fr && fr.firstChild) ink.appendChild(stripIds(fr.cloneNode(true)));
      layer(ink);
    }
    const c = layer(gl); c.classList.add('fz-gl');
    const lb = document.getElementById('labels');
    if (lb && lb.firstChild) { const x = stripIds(lb.cloneNode(true)); x.className = 'fz-l fz-labels'; s.appendChild(x); }
    // the text of the hold: the visible scene (its masks as they stand), and the footer
    const story = document.createElement('div'); story.className = 'fz-l fz-story';
    for (const sec of document.querySelectorAll('#story > .scene.vis')) story.appendChild(stripIds(sec.cloneNode(true)));
    const foot = document.getElementById('foot');
    if (foot && foot.classList.contains('vis')) story.appendChild(stripIds(foot.cloneNode(true)));
    for (const el of story.querySelectorAll('a, button, [tabindex]')) el.setAttribute('tabindex', '-1');
    s.appendChild(story);
    s.setAttribute('aria-hidden', 'true'); s.inert = true;
    return s;
  }
  // a second copy of a sheet (canvas contents copied)
  clone(sheet) {
    const c = sheet.cloneNode(true);
    const a = sheet.querySelectorAll('canvas'), b = c.querySelectorAll('canvas');
    a.forEach((cv, i) => { try { b[i].getContext('2d').drawImage(cv, 0, 0); } catch (e) { /* empty */ } });
    return c;
  }

  // ---------------- showing ----------------
  hide() { if (this.shown) { this.root.replaceChildren(); this.root.classList.remove('on'); this.shown = null; } }
  mount(fz) {
    if (this.shown === fz) return;
    const W = fz.W, H = fz.H, tr = fz.tr;
    this.root.replaceChildren();
    fz.parts = {};
    if (tr.type === 'cut' && !this.reduced) {
      const ang = (tr.cut.ang * Math.PI) / 180, P = [tr.cut.at[0] * W, tr.cut.at[1] * H];
      const u = [Math.cos(ang), Math.sin(ang)], n = [-Math.sin(ang), Math.cos(ang)];
      const a = document.createElement('div'), b = document.createElement('div');
      a.className = b.className = 'fz-half';
      a.style.clipPath = polyCss(halfPoly(W, H, P, n, 1)); b.style.clipPath = polyCss(halfPoly(W, H, P, n, -1));
      a.appendChild(fz.sheet); b.appendChild(fz.copy || (fz.copy = this.clone(fz.sheet)));
      const line = document.createElement('i'); line.className = 'fz-slash';
      const L = diagOf(W, H) * 1.2;
      line.style.cssText = `left:${(P[0] - L / 2).toFixed(1)}px;top:${(P[1] - 0.75).toFixed(1)}px;width:${L.toFixed(1)}px;rotate:${tr.cut.ang}deg`;
      this.root.append(a, b, line);
      Object.assign(fz.parts, { a, b, line, u, n, D: diagOf(W, H) });
    } else {
      const one = document.createElement('div'); one.className = 'fz-one';
      one.appendChild(fz.sheet);
      const rim = document.createElement('i'); rim.className = 'fz-rim';
      this.root.append(one, rim);
      Object.assign(fz.parts, { one, rim, D: diagOf(W, H) });
    }
    this.root.classList.add('on');
    this.shown = fz;
  }
  // p in [0, 1]: the progress of the freeze window
  show(fz, p) {
    this.mount(fz);
    const tr = fz.tr, P = fz.parts, W = fz.W, H = fz.H;
    if (P.a) {
      const c = EASES.cut(p), s = 0.55 * P.D * c, sl = 0.02 * P.D * c;
      // half a lies on the −n side of the line, half b on the +n side: each slides away from the line
      P.a.style.transform = `translate(${(-P.n[0] * s - P.u[0] * sl).toFixed(1)}px,${(-P.n[1] * s - P.u[1] * sl).toFixed(1)}px)`;
      P.b.style.transform = `translate(${(P.n[0] * s + P.u[0] * sl).toFixed(1)}px,${(P.n[1] * s + P.u[1] * sl).toFixed(1)}px)`;
      P.line.style.transform = `scaleX(${Math.min(1, p / 0.1).toFixed(3)})`;
      P.line.style.opacity = p < 0.1 ? '1' : Math.max(0, 1 - (p - 0.1) / 0.15).toFixed(3);
      return;
    }
    const one = P.one, rim = P.rim;
    if (this.reduced) { one.style.opacity = (1 - p).toFixed(3); rim.style.opacity = '0'; return; }
    let mask, rimBg;
    if (tr.type === 'wipe' && tr.wipe === 'light') {
      const [cx, cy] = fz.ts, r = 1.2 * P.D * EASES['power2.inOut'](p);
      mask = `radial-gradient(circle at ${cx.toFixed(0)}px ${cy.toFixed(0)}px, transparent ${Math.max(0, r - 70).toFixed(0)}px, #000 ${(r + 70).toFixed(0)}px)`;
      rimBg = `radial-gradient(circle at ${cx.toFixed(0)}px ${cy.toFixed(0)}px, transparent ${Math.max(0, r - 110).toFixed(0)}px, rgba(255,214,160,.55) ${r.toFixed(0)}px, transparent ${(r + 110).toFixed(0)}px)`;
    } else {
      // linear fronts: the raking light sweeps from the left; the dusk comes from the right
      const fromLeft = tr.wipe === 'sweep', dir = fromLeft ? 90 : 270, len = W, soft = fromLeft ? 140 : 240;
      const x = EASES['power2.inOut'](p) * (len + 2 * soft) - soft;
      mask = `linear-gradient(${dir}deg, transparent ${(x - soft / 2).toFixed(0)}px, #000 ${(x + soft / 2).toFixed(0)}px)`;
      const col = fromLeft ? 'rgba(255,214,160,.5)' : 'rgba(200,116,46,.6)';
      rimBg = `linear-gradient(${dir}deg, transparent ${(x - soft).toFixed(0)}px, ${col} ${x.toFixed(0)}px, transparent ${(x + soft * 0.6).toFixed(0)}px)`;
    }
    one.style.webkitMaskImage = one.style.maskImage = mask;
    rim.style.background = rimBg;
    rim.style.opacity = Math.sin(Math.PI * Math.min(1, Math.max(0, p))).toFixed(3);
    void H;
  }

  // every frame: the freeze of the transition in progress, else nothing; a jump's slash has its own clock
  update(d, layout, now = performance.now()) {
    if (this.jumpFz) {
      const t = (now - this.jumpT0) / (this.reduced ? 300 : 600);
      if (t < 1) { this.show(this.jumpFz, t); return true; }
      this.jumpFz = null;
    }
    if (d && d.freeze && !d.intro) {
      const k = d.freeze.k;
      const fz = this.cache.get(this.key(k, layout)) || this.prepare(k, layout);
      this.show(fz, d.freeze.p);
      return true;
    }
    this.hide();
    return false;
  }
  // a jump of more than one beat: freeze the frame on screen now; update() plays one kesagiri slash over it
  freezeNow(d) {
    const fz = this.snapshot(d, { type: 'cut', cut: { ang: -18, at: [0.5, 0.5] } });
    this.shown = null;
    this.jumpFz = fz; this.jumpT0 = performance.now();
    this.show(fz, 0);
  }
}
export { NS };
