// One layout for both the painted cloth (cartoon) and the DOM text, per form factor.
// Panels are stacked into one vertical "strip" of cloth; plateaus say where the strip stands at each poster.
import { C } from './palette.js';

export const DELA = '"Dela Gothic One"';
const mctx = document.createElement('canvas').getContext('2d');
export function tw(text, size, font = DELA) {
  mctx.font = `${size}px ${font}`;
  return mctx.measureText(text).width;
}
export function capH(size, text = 'H', font = DELA) {
  mctx.font = `${size}px ${font}`;
  return mctx.measureText(text).actualBoundingBoxAscent;
}
const fit = (text, width, max = 9999) => Math.min(max, Math.floor((100 * width) / tw(text, 100)));

export const STRIPES = [
  { g: C.ai, ink: C.ivory, name: 'MOBIL ILOVALAR', note: 'D4' },
  { g: C.atlas, ink: C.ivory, name: 'VEB-SAYTLAR' },
  { g: C.saffron, ink: C.ai, name: 'TELEGRAM BOTLAR' },
  { g: C.emerald, ink: C.ivory, name: 'BACKEND' },
  { g: C.silk, ink: C.atlas, name: 'DESKTOP' },
  { g: C.ai, ink: C.saffron, name: 'IoT' },
  { g: C.atlas, ink: C.ivory, name: 'AI' },
];

// plateau index → name (shared by phone and desktop)
export const POSTERS = ['hero', 'kasuri', 'abr', 'dandori', 'jidoka', 'snap', 'horenso', 'quramiz', 'stripes4', 'stripes7', 'time', 'shot', 'contact', 'phone', 'footer'];
export const N = POSTERS.length;

export function makeLayout(W, H, phone, flow = false) {
  const L = { W, H, phone, flow };
  const F = Math.round(H * (phone ? 0.88 : 0.87));
  L.F = F;
  L.PH = F;
  L.m = phone ? 16 : 48;
  const m = L.m;
  L.hdr = phone ? 56 : 64;
  const threads = phone ? 80 : Math.max(120, Math.min(200, Math.round(W / 7.2)));
  L.pitch = W / threads;
  L.threads = threads;
  const P = L.pitch;
  const snapT = (x) => Math.round(x / P) * P; // to a thread boundary
  // design units: desktop 1440x900 (fell 783), phone 390x844 (fell 743)
  const k = phone ? Math.min(W / 390, H / 844) : Math.min(W / 1440, H / 900);
  const S = (v) => v * k;
  const Y = (v) => Math.round((v * F) / (phone ? 743 : 783));
  L.k = k;
  L.S = phone ? 560 : 640; // scroll px per plateau

  // ---------------------------------------------------------------- panels (strip order)
  const sh = phone ? 84 : 96;
  L.sh = sh;
  const order = [
    ['hero', F, 'silk'],
    ['abr', F, 'ai'],
    ...(flow ? [['dan', F, 'ai']] : []),
    ['jid', F, 'aiDeep'],
    ...(flow ? [['hor', F, 'aiDeep']] : []),
    ['q', F, 'silk'],
    ['stripes', sh * 7, 'silk'],
    ['time', F, 'silk'],
    ['con', F, 'silk'],
    ['ph', F, 'silk'],
    ['foot', F, 'ai'],
    ...(flow ? [] : [['tail', Math.round(H * 0.9), 'silk']]),
  ];
  L.panels = {};
  let y = 0;
  for (const [id, h, g] of order) {
    L.panels[id] = { id, y0: y, h, ground: g };
    y += h;
  }
  L.stripH = y;
  const Pn = L.panels;

  // DOM placement: section → { y0, h, items: { id: {x, y, w, h, size, ...} } }
  const dom = {};
  const sec = (name, panel, h) => (dom[name] = { y0: Pn[panel].y0, h: h ?? Pn[panel].h, items: {} });
  const put = (name, id, o) => (dom[name].items[id] = o);
  L.dom = dom;
  const wov = {}; // woven paint lists per panel
  L.woven = wov;
  const text = (panel, o) => (wov[panel] = wov[panel] || []).push(o);

  // ---------------------------------------------------------------- hero
  sec('hero', 'hero');
  if (!phone) {
    const size = S(112), step = S(106), top0 = Y(116);
    const ch = capH(size);
    ['YAPON IT', 'AGENSTVASI', 'ENDI', 'OʻZBEKISTONDA!'].forEach((t, i) =>
      text('hero', { text: t, x: m, base: Math.round(top0 + i * step + ch), size, color: C.ai, abr: i === 3 })
    );
    const b4 = top0 + 3 * step + ch;
    put('hero', 'hero-sub', { x: m, y: Math.round(b4 + S(46)), w: S(800), size: S(40) });
    put('hero', 'hero-svc', { x: m, y: Math.round(b4 + S(112)) });
    put('hero', 'hero-cta', { x: m, y: Math.round(b4 + S(146)) });
    put('hero', 'hero-tate', { x: W - m - S(22), y: Y(120) });
    L.heroCue = { x: W - m, y: F + Math.round((H - F) / 2) };
  } else {
    const colW = W - m - 74; // the vertical word takes the right edge
    const words = ['YAPON', 'IT', 'AGENSTVASI', 'ENDI'];
    const sizes = words.map((w) => fit(w, colW, 150));
    const caps = sizes.map((s) => capH(s));
    const top = Y(84);
    const subY = Math.round(F - 296 * k);
    const blockBottom = subY - 34;
    const sum = caps.reduce((a, c) => a + c, 0);
    const gap = Math.max(12, Math.min(34, (blockBottom - top - sum) / 3));
    let yy = top;
    words.forEach((w, i) => {
      const base = Math.round(yy + caps[i]);
      text('hero', { text: w, x: m, base, size: sizes[i], color: C.ai });
      yy = base + gap;
    });
    // OʻZBEKISTONDA! vertical, along the right edge (glyph tops face right)
    const vTop = top, vLen = Math.round(blockBottom - vTop);
    const vs = Math.floor(fit('OʻZBEKISTONDA!', vLen));
    const vcap = capH(vs);
    text('hero', { vertical: true, text: 'OʻZBEKISTONDA!', xBase: W - m + 2 - vcap, yTop: vTop, size: vs, len: vLen, abr: true });
    put('hero', 'hero-sub', { x: m, y: subY, w: W - 2 * m, size: 26 * k });
    put('hero', 'hero-cta', { x: m, y: subY + Math.round(84 * k), w: W - 2 * m });
    put('hero', 'hero-svc', { x: m, y: subY + Math.round(156 * k), w: W - 2 * m, wrap: true });
    put('hero', 'hero-tate', { x: m, y: F - 26 });
    L.heroCue = { x: W - m, y: F + Math.round((H - F) / 2) };
  }

  // ---------------------------------------------------------------- abr: 絣 = ABR
  sec('abr', 'abr');
  {
    const split = snapT(W * (phone ? 0.5 : 0.48));
    L.abr = { split, pullLen: F + 60 };
    if (!phone) {
      const ks = S(372);
      const kc = capH(ks, '絣');
      const kTop = Y(132);
      text('abr', { text: '絣', x: S(64), base: Math.round(kTop + kc), size: ks, color: C.ivory });
      const as = fit('ABR', W * 0.43);
      const ac = capH(as);
      const aTop = Y(236);
      text('abr', { text: 'ABR', x: split + S(64), base: Math.round(aTop + ac), size: as, color: C.ai, abr: true });
      const midY = aTop + ac / 2;
      L.abr.eq = [split - S(40), Math.round(midY - S(26)), S(80), S(17), Math.round(midY + S(9))];
      put('abr', 'abr-l1', { x: S(72), y: Y(604) });
      put('abr', 'abr-l2', { x: split + S(64), y: Y(604) });
      put('abr', 'abr-h2', { x: split + S(64), y: Y(640), w: Math.min(S(600), W - split - S(64) - m), size: S(40) });
      L.abr.ground = [[0, split, C.ai], [split, W, C.silk]];
    } else {
      const ks = fit('絣', split - 2 * m);
      const kc = capH(ks, '絣');
      const kTop = Y(108);
      text('abr', { text: '絣', x: m - 4, base: Math.round(kTop + kc), size: ks, color: C.ivory });
      // KASURI set vertically under the kanji, ABR vertically on the silk: one craft, two names
      const kvTop = Math.round(kTop + kc + 26), kvLen = Y(560) - kvTop;
      const kvs = fit('KASURI', kvLen);
      const kvc = capH(kvs);
      text('abr', { vertical: true, text: 'KASURI', xBase: Math.round(split / 2 - kvc / 2), yTop: kvTop, size: kvs, len: kvLen, color: C.ivory });
      const vTop = Y(104), vLen = Y(398);
      const vs = fit('ABR', vLen);
      const vcap = capH(vs);
      const colC = split + (W - split) / 2;
      text('abr', { vertical: true, text: 'ABR', xBase: Math.round(colC - vcap / 2), yTop: vTop, size: vs, len: vLen, abr: true });
      L.abr.eq = [split - 22, Math.round(kTop + kc / 2 - 14), 44, 10, Math.round(kTop + kc / 2 + 4)];
      put('abr', 'abr-l1', { x: m, y: Y(590), w: split - 2 * m, wrap: true });
      put('abr', 'abr-l2', { x: split + m, y: Y(524), w: W - split - 2 * m, wrap: true });
      put('abr', 'abr-h2', { x: split + m, y: Y(566), w: W - split - 2 * m, size: 23 * k });
    }
  }

  // ---------------------------------------------------------------- dandori (same cloth, unwoven)
  sec('dandori', flow ? 'dan' : 'abr');
  if (!phone) {
    put('dandori', 'dan-l', { x: m, y: Y(122) });
    put('dandori', 'dan-h2', { x: m, y: Y(152), w: S(620), size: S(72) });
    put('dandori', 'dan-p', { x: m, y: Y(400), w: S(440) });
    L.danSafe = [0, Y(96), S(720), Y(470)];
  } else {
    put('dandori', 'dan-l', { x: m, y: Y(86) });
    put('dandori', 'dan-h2', { x: m, y: Y(112), w: W - 2 * m - 20, size: 36 * k });
    put('dandori', 'dan-p', { x: m, y: Y(278), w: W - 2 * m - 30 });
    L.danSafe = [0, Y(70), W, Y(330)];
  }

  // ---------------------------------------------------------------- jidoka / hōrensō (night cloth)
  sec('jidoka', 'jid');
  sec('horenso', flow ? 'hor' : 'jid');
  {
    const ti = Math.round((phone ? 0.72 : 0.62) * threads);
    L.jid = {
      sigX: (ti + 0.5) * P,
      brk: Y(phone ? 300 : 378),
      andon: phone ? { x: W - m - 22, y: Y(168), w: 40, h: 110 } : { x: W - S(150), y: Y(200), w: 64, h: 180 },
      safe: phone ? [0, Y(440), W, Y(320)] : [0, Y(380), S(780), Y(330)],
      grid: phone ? 84 : 120,
      mot: phone ? 26 : 36,
    };
    const T = phone
      ? { l: [m, Y(470)], h: [m, Y(494), W - 2 * m - 30, 36 * k], p: [m, Y(612), W - 2 * m - 40] }
      : { l: [m, Y(404)], h: [m, Y(432), S(700), S(72)], p: [m, Y(600), S(540)] };
    for (const [s, pre] of [['jidoka', 'jid'], ['horenso', 'hor']]) {
      put(s, pre + '-l', { x: T.l[0], y: T.l[1] });
      put(s, pre + '-h2', { x: T.h[0], y: T.h[1], w: T.h[2], size: T.h[3] });
      put(s, pre + '-p', { x: T.p[0], y: T.p[1], w: T.p[2] });
    }
  }

  // ---------------------------------------------------------------- QURAMIZ + stripes
  dom.xizmatlar = { y0: Pn.q.y0, h: Pn.q.h + Pn.stripes.h, items: {} };
  {
    const qs = phone ? fit('QURAMIZ', W - 2 * m, 120) : fit('QURAMIZ', W - 2 * m);
    const qc = capH(qs);
    const qTop = phone ? Y(414) : Y(456);
    text('q', { text: 'QURAMIZ', x: m - (phone ? 2 : 4), base: Math.round(qTop + qc), size: qs, color: C.ai });
    put('xizmatlar', 'svc-l', { x: m, y: qTop - (phone ? 30 : 40) });
    // hint: on the calm band between header and stripes at the 7-stripe poster
    const hintScreen = Math.round(L.hdr + (F - 7 * sh - L.hdr) / 2 - 8);
    dom.xizmatlar.items['svc-hint'] = { x: m, y: hintScreen + 7 * sh, w: W - 2 * m, wrap: phone };
    L.stripes = STRIPES.map((s, i) => {
      const y0 = Pn.stripes.y0 + i * sh;
      const size = phone ? Math.min(44, fit(s.name, W - 2 * m - 40)) : S(64);
      const c = capH(size);
      const base = phone ? Math.round(y0 - Pn.stripes.y0 + 16 + c) : Math.round(y0 - Pn.stripes.y0 + (sh + c) / 2);
      text('stripes', { text: s.name, x: m, base, size, color: s.ink });
      return { y0: y0 - Pn.q.y0, sy: i * sh, base, ...s };
    });
    L.stripeDesc = (i) => (phone ? { x: m, y: L.stripes[i].y0 + sh - 26 } : { x: Math.round(W * 0.62), y: L.stripes[i].y0 + sh / 2 - 8 });
    L.stripeKnot = (i) => ({ x: W - (phone ? 24 : 56) - 15, y: L.stripes[i].y0 + sh / 2 - 15 });
  }

  // ---------------------------------------------------------------- time
  sec('vaqt', 'time');
  {
    const t = phone
      ? { h2: [m, Y(76), W - 2 * m, 32 * k], x0: m, x1: W - m, tk: [Y(236), Y(292)], ts: [Y(310), Y(366)], lt: Y(196), ls: Y(398), nt: Y(216), ns: Y(374), p: [m, Y(452), W - 2 * m], c: [m, Y(560)], every: 6 }
      : { h2: [m, Y(134), S(1100), S(56)], x0: S(272), x1: W - m, tk: [Y(296), Y(360)], ts: [Y(384), Y(448)], nt: Y(272), ns: Y(458), p: [m, Y(530), S(1100)], c: [m, Y(616)], every: 3 };
    t.hw = (t.x1 - t.x0) / 24;
    L.time = t;
    put('vaqt', 'time-h2', { x: t.h2[0], y: t.h2[1], w: t.h2[2], size: t.h2[3] });
    if (phone) {
      put('vaqt', 'row-tk', { x: m, y: t.lt });
      put('vaqt', 'row-ts', { x: m, y: t.ls });
    } else {
      put('vaqt', 'row-tk', { x: m, y: Math.round((t.tk[0] + t.tk[1]) / 2 - 8) });
      put('vaqt', 'row-ts', { x: m, y: Math.round((t.ts[0] + t.ts[1]) / 2 - 8) });
    }
    put('vaqt', 'nums-tk', { x: 0, y: t.nt, w: W });
    put('vaqt', 'nums-ts', { x: 0, y: t.ns, w: W });
    put('vaqt', 'time-p', { x: t.p[0], y: t.p[1], w: t.p[2], size: phone ? 26 * k : S(40) });
    put('vaqt', 'clocks', { x: t.c[0], y: t.c[1] });
    put('vaqt', 'needle', { x: 0, y: t.tk[0] - 10, h: t.ts[1] - t.tk[0] + 20 });
    put('vaqt', 'now-l', { x: 0, y: t.ts[1] + (phone ? 32 : 30) });
    L.time.shot = [t.x0 + 9 * t.hw, t.tk[0], t.x0 + 14 * t.hw, t.ts[1]];
  }

  // ---------------------------------------------------------------- contact: the invitation
  sec('aloqa', 'con');
  if (!phone) {
    const size = Math.min(S(104), fit('CHIZAMIZ.', W * 0.56));
    const ch = capH(size);
    const top0 = Y(124), step = Math.round(size * 1.0);
    ['NAQSHNI', 'BIRGA', 'CHIZAMIZ.'].forEach((t, i) => text('con', { text: t, x: m, base: Math.round(top0 + i * step + ch), size, color: C.ai, abr: i === 2 }));
    put('aloqa', 'con-p', { x: Math.round(W * 0.6), y: Math.round(top0 + step - 6), w: Math.round(W * 0.4 - m - S(70)), size: S(40) });
    put('aloqa', 'con-tate', { x: W - m - S(22), y: Y(124) });
  } else {
    let yy = Y(150);
    ['NAQSHNI', 'BIRGA', 'CHIZAMIZ.'].forEach((t, i) => {
      const s = fit(t, W - 2 * m, 110);
      const ch = capH(s);
      const base = Math.round(yy + ch);
      text('con', { text: t, x: m - 2, base, size: s, color: C.ai, abr: i === 2 });
      yy = base + 14;
    });
    put('aloqa', 'con-p', { x: m, y: Math.round(yy + 28), w: W - 2 * m - 20, size: 26 * k });
    put('aloqa', 'con-tate', { x: m, y: F - 28 });
  }

  // ---------------------------------------------------------------- contact: the woven phone number
  sec('raqam', 'ph');
  if (!phone) {
    const t = '+998 97 270 70 07';
    const size = Math.min(S(112), fit(t, W - 2 * m - S(190)));
    const ch = capH(size);
    const top = Y(150);
    text('ph', { text: t, x: m - 3, base: Math.round(top + ch), size, color: C.ai });
    put('raqam', 'phone', { x: m - 3, y: top - 12, w: tw(t, size) + 6, h: ch + 24, size });
    put('raqam', 'email', { x: m, y: Math.round(top + ch + S(76)) });
    put('raqam', 'ctags', { x: m, y: Math.round(top + ch + S(156)) });
    put('raqam', 'city', { x: m, y: Math.round(top + ch + S(252)) });
    put('raqam', 'picks', { x: m, y: Math.round(top + ch + S(278)) });
    put('raqam', 'hanko', { x: W - m - S(150), y: Math.round(top + ch + S(70)) });
  } else {
    const l1 = '+998 97', l2 = '270 70 07';
    const size = fit(l2, W - 2 * m, 96);
    const ch = capH(size);
    const top = Y(104);
    const b1 = Math.round(top + ch), b2 = Math.round(b1 + size * 0.98);
    text('ph', { text: l1, x: m - 2, base: b1, size, color: C.ai });
    text('ph', { text: l2, x: m - 2, base: b2, size, color: C.ai });
    put('raqam', 'phone', { x: m - 2, y: top - 10, w: W - 2 * m, h: b2 - top + 20, size: size * 0.3, wrapPhone: true });
    put('raqam', 'email', { x: m, y: b2 + 44 });
    put('raqam', 'ctags', { x: m, y: b2 + 108, w: W - 2 * m, stack: true });
    put('raqam', 'city', { x: m, y: b2 + 248 });
    put('raqam', 'picks', { x: m, y: b2 + 270, w: W - 2 * m - 90, wrap: true });
    put('raqam', 'hanko', { x: W - m - 78, y: b2 + 230 });
  }

  // ---------------------------------------------------------------- footer: the jiyak and the maker's label
  dom.footer = { y0: Pn.foot.y0, h: Pn.foot.h, items: {} };
  {
    const band = phone ? 30 : 44;
    L.foot = { band };
    const ws = phone ? fit('QILICH', W - 2 * m) : S(236);
    const wc = capH(ws);
    const wTop = phone ? Y(92) : Y(122);
    text('foot', { text: 'QILICH', x: m - 4, base: Math.round(wTop + wc), size: ws, color: C.ivory });
    const it = dom.footer.items;
    if (!phone) {
      const below = wTop + wc + S(86);
      it.mei = { x: W - m - S(290), y: wTop + 6 };
      it.fnav = { x: m, y: Math.round(below) };
      it.fcon = { x: m, y: Math.round(below + S(52)) };
      it.frow = { x: Math.round(W * 0.6), y: Math.round(below + S(52)) };
      it.fcopy = { x: m, y: F - band - S(56) };
      it.fgal = { x: Math.round(W * 0.6), y: F - band - S(56) };
    } else {
      const below = wTop + wc + 34;
      it.mei = { x: m, y: Math.round(below) };
      it.fnav = { x: m, y: Math.round(below + 84) };
      it.fcon = { x: m, y: Math.round(below + 130) };
      it.frow = { x: m, y: Math.round(below + 220) };
      it.fcopy = { x: m, y: F - band - 66 };
      it.fgal = { x: m, y: F - band - 42 };
    }
  }

  // ---------------------------------------------------------------- where the strip stands at each poster
  const q0 = Pn.q.y0;
  L.clothY = {
    hero: 0,
    kasuri: Pn.abr.y0,
    abr: Pn.abr.y0,
    dandori: Pn.abr.y0,
    jidoka: Pn.jid.y0,
    snap: Pn.jid.y0,
    horenso: Pn.jid.y0,
    quramiz: q0,
    stripes4: q0 + 4 * sh,
    stripes7: q0 + 7 * sh,
    time: Pn.time.y0,
    shot: Pn.time.y0,
    contact: Pn.con.y0,
    phone: Pn.ph.y0,
    footer: Pn.foot.y0,
  };
  // header tone (left / right) per poster
  const D = 'dark', Lt = 'light';
  L.tone = {
    hero: [Lt, Lt], kasuri: [D, D], abr: [D, Lt], dandori: [D, D], jidoka: [D, D], snap: [D, D], horenso: [D, D],
    quramiz: [Lt, Lt], stripes4: [Lt, Lt], stripes7: [Lt, Lt], time: [Lt, Lt], shot: [Lt, Lt], contact: [Lt, Lt], phone: [Lt, Lt], footer: [D, D],
  };
  if (phone) L.tone.abr = [D, D];
  return L;
}
