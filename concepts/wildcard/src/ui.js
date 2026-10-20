// DOM side of the loom: places the real text on its cloth, keeps it in step with the story, and runs the small UI.
import { STRIPES, POSTERS } from './layout.js';

const $ = (id) => document.getElementById(id);

export function collectEls() {
  const el = {};
  document.querySelectorAll('[id]').forEach((e) => (el[e.id] = e));
  document.querySelectorAll('#stripes li').forEach((li, i) => (el['svc-d' + i] = li.querySelector('.d')));
  return el;
}

const WIPED = ['hero-sub', 'hero-svc', 'hero-cta', 'hero-tate', 'abr-l1', 'abr-l2', 'abr-h2', 'dan-l', 'dan-h2', 'dan-p', 'jid-l', 'jid-h2', 'jid-p', 'hor-l', 'hor-h2', 'hor-p', 'svc-hint', 'time-p', 'now-l'];

export function place(L) {
  for (const [secId, s] of Object.entries(L.dom)) {
    const sec = $(secId);
    if (!sec) continue;
    sec.style.top = s.y0 + 'px';
    sec.style.height = s.h + 'px';
    for (const [id, o] of Object.entries(s.items)) {
      const e = $(id);
      if (!e) continue;
      e.style.left = Math.round(o.x) + 'px';
      e.style.top = Math.round(o.y) + 'px';
      if (o.w) e.style.width = Math.round(o.w) + 'px';
      if (o.h) e.style.height = Math.round(o.h) + 'px';
      if (o.size) e.style.fontSize = o.size.toFixed(1) + 'px';
      if (o.cls) e.classList.add(o.cls);
      if (o.wrap) e.style.whiteSpace = 'normal';
      if (o.stack) Object.assign(e.style, { flexDirection: 'column', width: Math.round(o.w) + 'px' });
    }
  }
  WIPED.forEach((id) => $(id) && $(id).classList.add('wp'));
  // the phone link sits exactly over the woven number
  const ph = L.dom.raqam.items.phone;
  Object.assign($('phone').style, { lineHeight: Math.round(ph.h) + 'px', fontSize: (L.phone ? 20 : ph.size) + 'px' });
  // stripes
  const lis = document.querySelectorAll('#stripes li');
  const ul = $('stripes');
  Object.assign(ul.style, { left: 0, top: 0, width: '100%', height: '100%' });
  lis.forEach((li, i) => {
    const s = L.stripes[i];
    Object.assign(li.style, { top: s.y0 + 'px', height: L.sh + 'px' });
    const d = li.querySelector('.d');
    const p = L.stripeDesc(i);
    Object.assign(d.style, { left: p.x + 'px', top: p.y - s.y0 + 'px', color: s.ink });
    d.classList.add('wp');
    if (!li.querySelector('.knot')) {
      li.insertAdjacentHTML('beforeend', `<svg class="knot" viewBox="0 0 30 30" aria-hidden="true"><path d="M15 4c5 0 7 4 5 8s-9 6-9 10 3 5 6 3M8 13c1-4 8-6 11-2s1 9-4 11" fill="none" stroke="#F2B11B" stroke-width="3.2" stroke-linecap="round"/><circle cx="15" cy="15" r="2.4" fill="#F2B11B"/></svg>`);
    }
    const kn = li.querySelector('.knot');
    const kp = L.stripeKnot(i);
    Object.assign(kn.style, { left: kp.x + 'px', top: kp.y - s.y0 + 'px' });
  });
  // hour numerals
  const t = L.time;
  for (const id of ['nums-tk', 'nums-ts']) {
    const box = $(id);
    box.innerHTML = '';
    for (let h = 0; h < 24; h += t.every) {
      const sp = document.createElement('span');
      sp.textContent = String(h).padStart(2, '0');
      sp.dataset.h = h;
      sp.style.left = t.x0 + h * t.hw + 'px';
      box.appendChild(sp);
    }
  }
  $('layer').style.height = L.stripH + 'px';
}

// ---------------------------------------------------------------- per-frame DOM sync
export function makeSync(L, el) {
  const hdr = $('hdr'), selv = $('selv'), dom = $('dom'), layer = $('layer'), bar = $('progbar');
  const navLinks = [...document.querySelectorAll('.nav a, .selv a')];
  const navTop = [...document.querySelectorAll('.nav a')];
  const navX = navTop.map((a) => { const r = a.getBoundingClientRect(); return r.left + r.width / 2; });
  const tkSpans = () => [...$('nums-tk').children];
  const t = L.time;
  let lastY = null, lastFell = null, lastTone = '', lastK = -1, lastShear = null, lastNeedle = null, lastHanko = null, lastMei = null;
  const toneOfY = (Y, x) => {
    const P = L.panels;
    const order = Object.values(P);
    const p = order.find((q) => Y >= q.y0 && Y < q.y0 + q.h) || P.tail;
    if (p.id === 'abr') return x < L.abr.split ? 'dark' : null;
    if (p.id === 'stripes') {
      const s = STRIPES[Math.min(6, Math.floor((Y - p.y0) / L.sh))];
      return s.g === '#F2B11B' || s.g === '#EFE6D2' ? 'light' : 'dark';
    }
    return p.ground === 'silk' ? 'light' : 'dark';
  };
  return function sync(S, k) {
    if (S.clothY !== lastY) {
      layer.style.transform = `translate3d(0, ${(-S.clothY).toFixed(1)}px, 0)`;
      lastY = S.clothY;
    }
    const domFell = S.wTop >= 0 ? S.fell : Math.min(S.fell, Math.max(S.wBot, 0));
    if (domFell !== lastFell) {
      dom.style.setProperty('--fell', domFell.toFixed(1) + 'px');
      lastFell = domFell;
    }
    // header tone from the cloth under it
    let tl = toneOfY(S.clothY + 30, 60), tr = toneOfY(S.clothY + 30, L.W - 60);
    if (tr === null) tr = S.pull > 0.6 ? 'light' : 'dark';
    if (S.wTop > 40 || (S.wBot < 64 && S.fell > 64)) { tl = 'dark'; tr = 'dark'; }
    if (S.bladeY < 0 && S.wTop < 0 && S.drop >= 0) { tl = tr = 'dark'; }
    const scrim = S.wTop > 40 ? '1' : '0';
    const navT = navX.map((x) => (S.wTop > 40 ? 'dark' : toneOfY(S.clothY + 30, x) ?? (S.pull > 0.6 ? 'light' : 'dark')));
    const tone = tl + tr + scrim + navT.join('');
    if (tone !== lastTone) {
      hdr.dataset.tl = tl;
      hdr.dataset.tr = tr;
      hdr.dataset.scrim = scrim;
      navTop.forEach((a, i) => (a.dataset.tone = navT[i]));
      selv.dataset.tone = toneOfY(S.clothY + L.H * 0.5, 20) === 'light' && S.wTop < 40 ? 'light' : 'dark';
      lastTone = tone;
    }
    const kk = Math.round(k);
    if (kk !== lastK) {
      lastK = kk;
      const sec = SECTION_OF[POSTERS[kk]];
      navLinks.forEach((a) => {
        const on = a.getAttribute('href') === '#' + sec || (sec === 'horenso' && a.getAttribute('href') === '#jidoka' && a.closest('.nav')) || (sec === 'dandori' && a.getAttribute('href') === '#abr' && a.closest('.nav'));
        a.classList.toggle('on', on);
        if (on) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
      el['jid-state'].textContent = kk === 5 ? 'Dastgoh toʻxtadi.' : '';
    }
    if (bar) bar.style.transform = `scaleX(${(k / (POSTERS.length - 1)).toFixed(4)})`;
    // Tokyo numerals slide with their row
    if (S.shear !== lastShear) {
      lastShear = S.shear;
      const span = t.x1 - t.x0;
      tkSpans().forEach((sp) => {
        const h = +sp.dataset.h;
        let x = (((h * t.hw - S.shear) % span) + span) % span;
        sp.style.left = (t.x0 + x).toFixed(1) + 'px';
        sp.style.visibility = x < 6 || x > span - 6 ? 'hidden' : 'visible';
      });
    }
    if (S.needle !== lastNeedle) {
      lastNeedle = S.needle;
      el.needle.firstChild.style.transform = `scaleY(${S.needle.toFixed(3)})`;
      el.needle.style.visibility = S.needle > 0.01 ? 'visible' : 'hidden';
    }
    if (S.hanko !== lastHanko) {
      lastHanko = S.hanko;
      const h = S.hanko;
      el.hanko.style.visibility = h > 0.01 ? 'visible' : 'hidden';
      el.hanko.style.transform = `translateY(${(-(1 - h) * 14).toFixed(1)}px) scale(${(1.22 - 0.22 * h).toFixed(3)}) rotate(${(-9 + 6 * h).toFixed(2)}deg)`;
      el.hanko.style.filter = h < 0.99 ? `drop-shadow(0 ${((1 - h) * 16).toFixed(1)}px ${((1 - h) * 10).toFixed(1)}px rgba(0,0,0,0.25))` : 'none';
    }
    if (S.mei !== lastMei) {
      lastMei = S.mei;
      el.mei.style.visibility = S.mei > 0.01 ? 'visible' : 'hidden';
      el.mei.style.transform = `translateY(${(-(1 - S.mei) * 12).toFixed(1)}px) rotate(${((1 - S.mei) * -4).toFixed(2)}deg)`;
    }
  };
}

export const SECTION_OF = {
  hero: 'hero', kasuri: 'abr', abr: 'abr', dandori: 'dandori', jidoka: 'jidoka', snap: 'jidoka', horenso: 'horenso',
  quramiz: 'xizmatlar', stripes4: 'xizmatlar', stripes7: 'xizmatlar', time: 'vaqt', shot: 'vaqt', contact: 'aloqa', phone: 'aloqa', footer: 'footer',
};
export const PLATEAU_OF = { hero: 0, abr: 2, dandori: 3, jidoka: 5, horenso: 6, xizmatlar: 9, vaqt: 11, aloqa: 12, raqam: 13, footer: 14 };

// ---------------------------------------------------------------- clocks and the "now" needle
export function startClocks(L) {
  const f = (tz) => new Intl.DateTimeFormat('uz-UZ', { timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const ts = f('Asia/Tashkent'), tk = f('Asia/Tokyo');
  const run = () => {
    const d = new Date();
    $('clk-ts').textContent = ts.format(d);
    $('clk-tk').textContent = tk.format(d);
    const [hh, mm] = ts.format(d).split(':').map(Number);
    const t = L.time;
    const x = t.x0 + (hh + mm / 60) * t.hw;
    $('needle').style.left = x.toFixed(1) + 'px';
    $('now-l').style.left = Math.round(x - 22) + 'px';
  };
  run();
  setInterval(run, 15000);
}

// ---------------------------------------------------------------- pick a service → knots + pre-filled email
export function bindPicks() {
  const NAMES = ['Mobil ilovalar', 'Veb-saytlar', 'Telegram botlar', 'Backend', 'Desktop ilovalar', 'IoT', 'AI'];
  const picked = new Set();
  try { JSON.parse(sessionStorage.getItem('qilich.picks') || '[]').forEach((i) => picked.add(i)); } catch (e) {}
  const update = () => {
    document.querySelectorAll('#stripes button').forEach((b) => {
      const on = picked.has(+b.dataset.svc);
      b.setAttribute('aria-pressed', on);
      b.closest('li').classList.toggle('on', on);
    });
    const list = [...picked].sort().map((i) => NAMES[i]);
    const p = $('picks');
    p.hidden = !list.length;
    p.textContent = list.length ? 'TANLANGANLAR · ' + list.join(' · ').toUpperCase() : '';
    const body = list.length ? `Assalomu alaykum! Bizga kerak: ${list.join(', ')}.` : 'Assalomu alaykum!';
    $('mailtag').href = `mailto:inbox@qilich.com?subject=${encodeURIComponent('Loyiha')}&body=${encodeURIComponent(body)}`;
    try { sessionStorage.setItem('qilich.picks', JSON.stringify([...picked])); } catch (e) {}
  };
  document.querySelectorAll('#stripes button').forEach((b) =>
    b.addEventListener('click', () => {
      const i = +b.dataset.svc;
      picked.has(i) ? picked.delete(i) : picked.add(i);
      update();
    })
  );
  update();
}

// ---------------------------------------------------------------- phone menu
export function bindMenu(goToSection) {
  const btn = document.querySelector('.menubtn'), menu = $('menu'), hdr = $('hdr');
  const close = () => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); hdr.classList.remove('open'); };
  btn.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    hdr.classList.toggle('open', open);
    if (open) menu.querySelector('a').focus();
  });
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { close(); btn.focus(); } });
}

// ---------------------------------------------------------------- cursor: a dot with a hanging dyed thread
export function makeCursor(onMove) {
  const cur = $('cur');
  if (!matchMedia('(pointer: fine)').matches) return null;
  document.documentElement.classList.add('fine');
  const thr = cur.querySelector('.thr'), ring = cur.querySelector('.ring');
  const N = 12, seg = 5.5;
  const pts = Array.from({ length: N }, (_, i) => ({ x: 0, y: i * seg, px: 0, py: i * seg }));
  let mx = -100, my = -100, lastMove = 0, active = false, idleT = null;
  let hist = [];
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const now = performance.now();
    hist.push([now, e.clientX, e.clientY]);
    hist = hist.filter((h) => now - h[0] < 260);
    const px = mx, py = my;
    mx = e.clientX; my = e.clientY;
    if (!active) { pts.forEach((p, i) => { p.x = p.px = mx; p.y = p.py = my + i * seg; }); active = true; }
    lastMove = now;
    cur.classList.remove('idle');
    clearTimeout(idleT);
    idleT = setTimeout(() => cur.classList.add('idle'), 1100);
    // only continuous motion counts (a single jump of the pointer is ignored)
    if (hist.length >= 3 && px > -50) onMove(px, py, mx, my, Math.hypot(mx - px, my - py) / Math.max(1, (now - hist[hist.length - 2][0])) * 1000);
    const over = e.target.closest && e.target.closest('a, button');
    ring.setAttribute('r', over ? 19 : 13);
  }, { passive: true });
  addEventListener('pointerleave', () => cur.classList.add('idle'));
  return {
    step(dt, tone) {
      if (!active) return false;
      const moving = performance.now() - lastMove < 1600;
      if (!moving && cur.classList.contains('idle')) return false;
      pts[0].x = mx; pts[0].y = my + 13;
      const h = Math.min(dt, 1 / 30);
      for (let i = 1; i < N; i++) {
        const p = pts[i];
        const vx = (p.x - p.px) * 0.9, vy = (p.y - p.py) * 0.9;
        p.px = p.x; p.py = p.y;
        p.x += vx; p.y += vy + 900 * h * h;
      }
      for (let it = 0; it < 6; it++)
        for (let i = 1; i < N; i++) {
          const a = pts[i - 1], b = pts[i];
          const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
          const f = (d - seg) / d;
          if (i === 1) { b.x -= dx * f; b.y -= dy * f; }
          else { a.x += dx * f * 0.5; a.y += dy * f * 0.5; b.x -= dx * f * 0.5; b.y -= dy * f * 0.5; }
        }
      cur.style.transform = `translate(${mx - 70}px, ${my - 30}px)`;
      thr.setAttribute('points', pts.map((p) => `${(p.x - mx).toFixed(1)},${(p.y - my).toFixed(1)}`).join(' '));
      if (tone && cur.dataset.tone !== tone) cur.dataset.tone = tone;
      return true;
    },
  };
}
