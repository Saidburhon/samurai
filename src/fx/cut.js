// Freeze transitions (§3.7): one mechanism for the four split cuts, the soft wipes and the jump slash.
// The frozen sheet of the transition k -> k+1 always shows hold k, in whichever direction the visitor travels; the
// live layers beneath show the incoming hold. prepare(k) copies the GL canvas in the task that drew hold k (no
// preserveDrawingBuffer; at the hold it is the frame on screen, so nothing is drawn twice), clones the ground, the
// drawing, the dial, the labels and hold k's visible text into one sheet (ids stripped, aria-hidden, inert, its colours
// pinned), and the sheet waits mounted, all but invisible, so its layers are rasterised at the hold.
// The sheet lies over the page's text (#cut is a child of body, cinema.css): the incoming text rises under it.
// Scrolling forwards into a freeze, the sheet goes up closed from the first frame of the scroll (d.pre, core/film.js).
// Inside [k + .2, k + .8]: split cuts as two halves clipped by the cut line (clip-path polygon) pushed apart along its
// normal; wipes as a window the compositor moves over the sheet (a circle closing on the tsuba, or a rectangle whose
// edge crosses the screen) with a rim of light. Nothing in a freeze is rasterised again while it plays (G3: a moving
// mask-image and a scaled ring re-rasterised in every frame and held a software compositor for seconds).
import { EASES } from '../core/eases.js';
import { SEQ, evalS } from '../core/tracks.js';

const diagOf = (w, h) => Math.hypot(w, h);
const stripIds = (el) => { el.removeAttribute && el.removeAttribute('id'); for (const x of el.querySelectorAll ? el.querySelectorAll('[id]') : []) x.removeAttribute('id'); return el; };

// a copy of a block of the page as it stands: no ids, and without the elements it does not display now (rules on
// html[data-beat] would otherwise show them in the copy when the beat changes under the freeze)
function frozenClone(el) {
  const c = el.cloneNode(true);
  const a = [el, ...el.querySelectorAll('*')], b = [c, ...c.querySelectorAll('*')];
  const gone = [];
  for (let i = 0; i < a.length; i++) if (a[i].nodeType === 1 && getComputedStyle(a[i]).display === 'none') gone.push(b[i]);
  for (const x of gone) x.remove();
  return stripIds(c);
}
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
const polyCss = (pts) => `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`;

export class Cut {
  constructor(film, dom) {
    this.film = film; this.dom = dom;
    this.root = document.getElementById('cut');
    // the frozen sheet lies over the page's text too (cinema.css: above #story, under the nav): the incoming text
    // rises under it and shows where the cut has opened or the wipe has passed, never across the frozen hold
    if (this.root && this.root.parentNode !== document.body) document.body.appendChild(this.root);
    this.cache = new Map();
    this.shown = null;
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  reset() { this.cache.clear(); this.hide(); }
  key(k, layout) { const st = this.film.st; return `${layout}|${k}|${st.w}x${st.h}`; }
  // ready: the freeze's frame is taken (its two bitmaps are on their way from the GPU; the sheet shows them on arrival)
  ready(k, layout) { return this.cache.has(this.key(k, layout)); }
  arrived(k, layout) { const fz = this.cache.get(this.key(k, layout)); return !!(fz && fz.ready); }

  // the freeze of hold k for the transition k -> k + 1 (its type decides the shape). same: the hold on screen is
  // hold k; fresh: and the canvas holds its frame now (drawn earlier in this task), so it is not drawn again
  prepare(k, layout, same = false, fresh = false) {
    const key = this.key(k, layout);
    if (this.cache.has(key)) return this.cache.get(key);
    const tr = SEQ[layout].trans[k];
    const d = evalS(k, layout); d.settled = true;
    const fz = this.snapshot(d, tr, same, fresh);
    this.cache.set(key, fz);
    // a few sheets at most (each holds a copy of the canvas)
    if (this.cache.size > 4) for (const kk of this.cache.keys()) { if (kk !== key && this.shown !== this.cache.get(kk)) { this.cache.delete(kk); break; } }
    return fz;
  }
  // render a state, take copies of the canvas, clone the page's layers for it. The copies are ImageBitmaps taken in
  // the same task as the render and shown by bitmaprenderer canvases: no read-back, the main thread never waits for
  // the GPU (a 2D canvas drawn from the bitmap read it back, and held the main thread at the hold, G3). A cut takes
  // two (one per half), a wipe or a slash one; the sheet is ready when they arrive.
  snapshot(d, tr, same = false, fresh = false) {
    const film = this.film, st = film.st, W = st.w, H = st.h;
    tr = tr || { type: 'cut', cut: { ang: -18, at: [0.5, 0.5] } };
    if (!fresh) { film.apply(d); if (this.dom) this.dom.apply(d); film.render(); }
    const src = st.renderer.domElement;
    const two = tr.type === 'cut' && !this.reduced;
    const mk = () => { const c = document.createElement('canvas'); c.width = src.width; c.height = src.height; return c; };
    const gls = two ? [mk(), mk()] : [mk()];
    const fz = { tr, W, H, k: d.k, ready: false };
    const put = (c, bmp) => { const x = c.getContext('bitmaprenderer'); if (x) x.transferFromImageBitmap(bmp); else { c.getContext('2d').drawImage(bmp, 0, 0); if (bmp.close) bmp.close(); } };
    if (typeof createImageBitmap === 'function') {
      Promise.all(gls.map(() => createImageBitmap(src))).then((bs) => { bs.forEach((b, i) => put(gls[i], b)); fz.ready = true; }).catch(() => { fz.ready = true; });
    } else { for (const c of gls) c.getContext('2d').drawImage(src, 0, 0); fz.ready = true; }
    fz.sheet = this.build(gls[0], d);
    if (two) fz.copy = this.build(gls[1], d);
    // where the wipes start: the tsuba of the frozen hold, on screen
    fz.ts = st.project(st.point('tsuba'));
    if (!same) film.dirty = true;
    return fz;
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
    // the dial only where the hold shows it (near Toki it waits on the paper all but invisible: not part of a picture)
    const dial = document.getElementById('dialw');
    if (dial && dial.style.visibility !== 'hidden' && !(parseFloat(dial.style.opacity || '1') < 0.05)) { const c = stripIds(dial.cloneNode(true)); c.classList.add('fz-dial'); s.appendChild(c); }
    // the drawing: the wrapper with its matrix, the stipple as a copy of its raster
    const paper = document.getElementById('osh-paper');
    if (paper && paper.style.visibility !== 'hidden') {
      const ink = document.createElement('div'); ink.className = 'fz-ink';
      const stip = document.getElementById('stip');
      if (stip && stip.style.visibility !== 'hidden') {
        const srcCv = stip.__stip ? stip.__stip.ctx.canvas : stip;
        const c = document.createElement('canvas'); c.width = srcCv.width; c.height = srcCv.height;
        try { c.getContext('2d', { willReadFrequently: true }).drawImage(srcCv, 0, 0); } catch (e) { /* an empty raster */ }
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
    const srcs = [...document.querySelectorAll('#story > .scene.vis')];
    const foot = document.getElementById('foot');
    if (foot && foot.classList.contains('vis')) srcs.push(foot);
    for (const sec of srcs) story.appendChild(frozenClone(sec));
    for (const el of story.querySelectorAll('a, button, [tabindex]')) el.setAttribute('tabindex', '-1');
    s.appendChild(story);
    // a sheet is a picture: nothing in it may follow the page's state afterwards. The page's colours (html.dark),
    // the beat (html[data-beat]) and the sun (--sun-a) change under a freeze, and every change repainted both
    // halves in full (G3, a trace: 2 × 12 tiles twice per cut). Their values as they stand are written on the sheet,
    // and what the hold did not show is left out of it
    const hs = getComputedStyle(document.getElementById('story') || document.documentElement), rs = getComputedStyle(document.documentElement);
    for (const v of ['--fg', '--fg2', '--line']) { const x = hs.getPropertyValue(v); if (x) s.style.setProperty(v, x); }
    const sun = rs.getPropertyValue('--sun-a'); if (sun) s.style.setProperty('--sun-a', sun);
    s.style.color = hs.color;
    s.setAttribute('aria-hidden', 'true'); s.inert = true;
    return s;
  }
  // a second copy of a sheet (canvas contents copied)
  clone(sheet) {
    const c = sheet.cloneNode(true);
    const a = sheet.querySelectorAll('canvas'), b = c.querySelectorAll('canvas');
    a.forEach((cv, i) => { try { b[i].getContext('2d', { willReadFrequently: true }).drawImage(cv, 0, 0); } catch (e) { /* empty */ } });
    return c;
  }

  // the compositor's first freeze: a few tiles of each kind of layer a freeze is made of (a half clipped by a polygon,
  // a bitmap canvas, the slash, a round window, a rim), all but invisible for a moment at the first hold, so the
  // software renderer builds their programs there and not in the first frames of the first cut (G3)
  warm() {
    if (this.warmed || !this.root) return;
    this.warmed = true;
    const box = document.createElement('div');
    box.className = 'fz-warm';
    box.innerHTML = '<div class="fz-half" style="clip-path:polygon(0 0,64px 0,0 48px)"><canvas class="fz-gl" width="64" height="48"></canvas><div class="fz-l" style="background:radial-gradient(130% 110% at 50% 50%, transparent 50%, rgba(0,0,0,.35) 100%)"></div></div>'
      + '<i class="fz-slash" style="left:0;top:20px;width:64px"></i><div class="fz-win" style="inset:auto;left:70px;top:0;width:48px;height:48px;border-radius:50%;transform:scale(.5)"><div class="fz-one" style="background:#888"></div></div><canvas class="fz-rimc" width="16" height="12"></canvas>';
    document.body.appendChild(box);
    // and every scene's text, in place, all but invisible: the glyphs of every face and size are rasterised once here
    // (their first raster, inside the first frames of a scene's text rising, held a software compositor ~0.3 s)
    const st = document.createElement('div'); st.className = 'fz-warm-story'; st.setAttribute('aria-hidden', 'true'); st.inert = true;
    for (const sec of document.querySelectorAll('#story > .scene, #foot')) { const c = stripIds(sec.cloneNode(true)); c.classList.add('vis'); st.appendChild(c); }
    for (const el of st.querySelectorAll('a, button, [tabindex]')) el.setAttribute('tabindex', '-1');
    document.body.appendChild(st);
    setTimeout(() => st.remove(), 2500);
    const c = box.querySelector('canvas.fz-gl');
    if (typeof createImageBitmap === 'function') createImageBitmap(new ImageData(64, 48)).then((b) => { const x = c.getContext('bitmaprenderer'); if (x) x.transferFromImageBitmap(b); }).catch(() => {});
    setTimeout(() => box.remove(), 1500);
  }

  // ---------------- showing ----------------
  hide() { if (this.shown) { this.root.replaceChildren(); this.root.classList.remove('on', 'primed'); this.shown = null; } }
  // a prepared freeze mounted at its start, all but invisible: its layers (two full-screen halves with a copy of the
  // canvas) are rasterised and uploaded while the hold is on screen, not in the first frame of the cut
  prime(fz) {
    if (this.shown !== fz) { this.mount(fz); this.show(fz, 0); }
    this.root.classList.remove('on'); this.root.classList.add('primed');
  }
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
      // the wipes move a window over the frozen sheet, never a mask: a window is a clip the compositor moves (a
      // rectangle, or a circle: a rounded clip), and the sheet inside it is moved back by as much, so it stays in
      // place and is rasterised once. (A moving mask-image was rasterised again in every frame: 24 tiles, about 2 s
      // per wipe in software, G3.) The radial light wipe is a circle of the frozen light closing on the tsuba; the
      // linear ones a rectangle whose edge travels across the screen. The rim of light: on the radial wipe a small
      // canvas stretched over the screen and redrawn per frame, on the linear wipes one strip the compositor moves
      const win = document.createElement('div'); win.className = 'fz-win';
      const one = document.createElement('div'); one.className = 'fz-one';
      one.appendChild(fz.sheet); win.appendChild(one);
      let rim, R = 0;
      if (tr.type === 'wipe' && tr.wipe === 'light') {
        const [cx, cy] = fz.ts;
        R = Math.max(...[[0, 0], [W, 0], [0, H], [W, H]].map(([x, y]) => Math.hypot(x - cx, y - cy))) + 120;
        win.style.cssText = `inset:auto;left:${(cx - R).toFixed(1)}px;top:${(cy - R).toFixed(1)}px;width:${(2 * R).toFixed(1)}px;height:${(2 * R).toFixed(1)}px;border-radius:50%`;
        one.style.cssText = `inset:auto;left:${(R - cx).toFixed(1)}px;top:${(R - cy).toFixed(1)}px;width:${W}px;height:${H}px;transform-origin:${cx.toFixed(1)}px ${cy.toFixed(1)}px`;
        rim = document.createElement('canvas'); rim.className = 'fz-rimc'; rim.width = Math.ceil(W / 8); rim.height = Math.ceil(H / 8);
      } else { rim = document.createElement('i'); rim.className = 'fz-rim'; }
      this.root.append(win, rim);
      Object.assign(fz.parts, { win, one, rim, R, D: diagOf(W, H) });
    }
    this.root.classList.add('on');
    this.shown = fz;
  }
  // p in [0, 1]: the progress of the freeze window
  show(fz, p) {
    this.mount(fz);
    if (!this.root.classList.contains('on')) { this.root.classList.remove('primed'); this.root.classList.add('on'); }
    const tr = fz.tr, P = fz.parts, W = fz.W, H = fz.H;
    if (P.a) {
      const c = EASES.cut(p), s = 0.55 * P.D * c, sl = 0.02 * P.D * c;
      // half a lies on the −n side of the line, half b on the +n side: each slides away from the line (in whole
      // device pixels: a layer moved by a fraction of a pixel is rasterised again at the new phase)
      const r = devicePixelRatio, px = (v) => (Math.round(v * r) / r).toFixed(3);
      P.a.style.transform = `translate(${px(-P.n[0] * s - P.u[0] * sl)}px,${px(-P.n[1] * s - P.u[1] * sl)}px)`;
      P.b.style.transform = `translate(${px(P.n[0] * s + P.u[0] * sl)}px,${px(P.n[1] * s + P.u[1] * sl)}px)`;
      P.line.style.transform = `scaleX(${Math.min(1, p / 0.1).toFixed(3)})`;
      P.line.style.opacity = p < 0.1 ? '1' : Math.max(0, 1 - (p - 0.1) / 0.15).toFixed(3);
      return;
    }
    const one = P.one, win = P.win, rim = P.rim;
    if (this.reduced) { one.style.opacity = (1 - p).toFixed(3); rim.style.opacity = '0'; return; }
    const e = EASES['power2.inOut'](p);
    if (tr.type === 'wipe' && tr.wipe === 'light') {
      // the frozen light closes on the tsuba: the window's radius from beyond the farthest corner to nothing
      const [cx, cy] = fz.ts, R = P.R, r = R * (1 - e), k = Math.max(1e-3, r / R);
      win.style.visibility = r < 0.5 ? 'hidden' : '';
      win.style.transform = `scale(${k.toFixed(5)})`;
      one.style.transform = `scale(${(1 / k).toFixed(5)})`;
      const x = rim.getContext('2d'), sc = rim.width / W;
      x.clearRect(0, 0, rim.width, rim.height);
      if (r > 1) {
        const g = x.createRadialGradient(cx * sc, cy * sc, Math.max(0, r - 90) * sc, cx * sc, cy * sc, (r + 90) * sc);
        g.addColorStop(0, 'rgba(255,214,160,0)'); g.addColorStop(0.5, 'rgba(255,214,160,.55)'); g.addColorStop(1, 'rgba(255,214,160,0)');
        x.fillStyle = g; x.fillRect(0, 0, rim.width, rim.height);
      }
    } else {
      // linear fronts: the raking light sweeps in from the left (the frozen sheet keeps the part right of the
      // front); the dusk comes from the right (the sheet keeps the part left of it). In whole device pixels
      const fromLeft = tr.wipe === 'sweep', soft = fromLeft ? 140 : 240, dp = devicePixelRatio;
      const x = Math.round(e * W * dp) / dp;
      win.style.transform = `translateX(${(fromLeft ? x : -x).toFixed(3)}px)`;
      one.style.transform = `translateX(${(fromLeft ? -x : x).toFixed(3)}px)`;
      if (!rim.dataset.k) {
        rim.dataset.k = 'strip';
        const col = fromLeft ? 'rgba(255,214,160,.42)' : 'rgba(200,116,46,.5)';
        rim.style.cssText = `inset:0 auto 0 0;width:${soft * 2}px;height:100%;background:linear-gradient(90deg, transparent, ${col} 50%, transparent)`;
      }
      rim.style.transform = `translateX(${((fromLeft ? x : W - x) - soft).toFixed(1)}px)`;
    }
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
    // a freeze being entered forwards (core/film.js d.pre): its sheet is up, closed, from the first frame of the
    // move. It shows the hold on screen, so nothing changes, but its layers are rasterised and the live layers switch
    // to the incoming hold before the cut starts at k + 0.2, not inside it (G3: the first frame of a freeze held the
    // compositor for about a second in software)
    if (d && d.pre) {
      const fz = this.cache.get(this.key(d.k, layout));
      if (fz) { this.show(fz, 0); return true; }
    }
    // the freeze this hold leads into (or the one about to start) waits mounted
    // (as soon as the director is slowing inside the window, d.calm: the sheet's first raster is done on the way in,
    // not when the next scroll starts)
    const k = d && !d.intro ? (d.atHold ? (d.settled || d.calm ? Math.round(d.pos) : null) : d.tr && (d.tr.type === 'cut' || d.tr.type === 'wipe') && this.shown && this.shown.k === d.k ? d.k : null) : null;
    const fz = k != null ? this.cache.get(this.key(k, layout)) : null;
    if (fz) { this.prime(fz); return false; }
    this.hide();
    return false;
  }
  // a jump of more than one beat: freeze the frame on screen now; update() plays one kesagiri slash over it
  freezeNow(d) {
    const fz = this.snapshot(d, { type: 'cut', cut: { ang: -18, at: [0.5, 0.5] } }, true);
    this.shown = null;
    this.jumpFz = fz; this.jumpT0 = performance.now();
    this.show(fz, 0);
  }
}
