// mask-audit (G1 r2): at every cinema hold, every text block's mask (html.film .tk, its clip-path; and the line masks
// .ln, overflow hidden) must hold the whole of its glyphs: the ink of every line of text (measured with the same font
// on its baseline: the descenders of g, y, p, q, the okina, the Cyrillic breve) lies inside the block's clip window.
// G1's B12 and B21 cut the descenders of 'ozgina yaxshiroq.' and 'Loyihangiz haqida gaplashamiz.' this way.
// Used by fit-check.cjs (uz/ru/en/ja at 1440 × 900, 1280 × 720 and 390 × 844); standalone:
//   node scripts/qa/mask-audit.cjs [base=http://localhost:8800] [out=.cache/qa/mask]
const path = require('path');
const fs = require('fs');

const BEATS = ['mei.hero', 'mei.promise', 'utsuri.ios', 'utsuri.ai', 'yaki.plan', 'yaki.launch', 'togi.stone', 'togi.front', 'togi.mirror', 'tsuba.guard', 'tsuba.carpet', 'tsuba.team', 'toki.0900', 'temur.quote', 'noto.sheath', 'noto.contact', 'bookend.steel'];

// runs in the page at a hold: [{ text, sel, glyph: [t, b], win: [t, b], over }]
function audit() {
  const out = [];
  const vis = (el) => { for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false; } return true; };
  // a computed inset length (px, %, calc of both) against the box height
  const len = (s, H) => {
    const e = s.replace(/calc\(/g, '(').replace(/(-?[\d.]+)%/g, (m, v) => `(${v}*${H}/100)`).replace(/(-?[\d.]+)px/g, '($1)');
    if (!/^[\d\s.()+\-*/]+$/.test(e)) return null;
    try { return Function(`return (${e})`)(); } catch (err) { return null; }
  };
  const tokens = (s) => { const t = []; let d = 0, cur = ''; for (const c of s) { if (c === '(') d++; if (c === ')') d--; if (c === ' ' && d === 0) { if (cur) t.push(cur); cur = ''; } else cur += c; } if (cur) t.push(cur); return t; };
  // the clip window of a .tk block, in viewport px: its border box moved by the insets of clip-path: inset(...)
  const win = (el) => {
    const cs = getComputedStyle(el), m = /^inset\((.*)\)$/.exec(cs.clipPath);
    const r = el.getBoundingClientRect();
    if (!m) return null;
    const t = tokens(m[1].replace(/\s+round .*/, ''));
    const H = r.height / (parseFloat(cs.scale) || 1);
    const top = len(t[0], H), bottom = len(t.length > 2 ? t[2] : t[0], H);
    if (top == null || bottom == null) return null;
    return [r.top + top, r.bottom - bottom];
  };
  // the ink of a run of text: the canvas's measure of the same font, placed on the fragment's baseline (the top of a
  // fragment's box is the font's ascent above its baseline)
  const cx = document.createElement('canvas').getContext('2d');
  const lines = (n) => {
    // the text node's characters grouped by line (the top of each character's box)
    const L = [];
    for (let i = 0; i < n.length; i++) {
      const rg = document.createRange(); rg.setStart(n, i); rg.setEnd(n, i + 1);
      const q = [...rg.getClientRects()].find((x) => x.width > 0);
      if (!q) continue;
      let l = L.find((x) => Math.abs(x.top - q.top) < q.height * 0.5);
      if (!l) { l = { top: q.top, s: '' }; L.push(l); }
      l.s += n.data[i];
    }
    return L;
  };
  for (const tk of document.querySelectorAll('.tk')) {
    if (!vis(tk) || Math.abs(parseFloat(getComputedStyle(tk).getPropertyValue('--t')) || 0) > 1e-3) continue;
    const W = win(tk);
    const walker = document.createTreeWalker(tk, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.textContent.trim() || !n.parentElement || !vis(n.parentElement) || n.parentElement.closest('svg, .sprite, .words')) continue;
      const cs = getComputedStyle(n.parentElement);
      cx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      // the nearest line mask (.ln, overflow hidden) inside the block clips too
      const ln = n.parentElement.closest('.ln');
      let Lm = null;
      if (ln && tk.contains(ln) && getComputedStyle(ln).overflow !== 'visible' && getComputedStyle(ln).display !== 'inline') { const b = ln.getBoundingClientRect(); Lm = [b.top, b.bottom]; }
      const sel = n.parentElement.tagName.toLowerCase() + '.' + String(n.parentElement.className || '').trim().split(/\s+/).join('.');
      for (const l of lines(n)) {
        if (!l.s.trim()) continue;
        const m = cx.measureText(l.s), base = l.top + m.fontBoundingBoxAscent;
        const ink = [base - m.actualBoundingBoxAscent, base + m.actualBoundingBoxDescent];
        const text = l.s.trim().slice(0, 48);
        if (W && (ink[0] < W[0] - 0.5 || ink[1] > W[1] + 0.5)) out.push({ mask: 'tk', text, sel, ink: ink.map(Math.round), win: W.map(Math.round), over: +Math.max(W[0] - ink[0], ink[1] - W[1]).toFixed(1) });
        if (Lm && (ink[0] < Lm[0] - 0.5 || ink[1] > Lm[1] + 0.5)) out.push({ mask: 'ln', text, sel, ink: ink.map(Math.round), win: Lm.map(Math.round), over: +Math.max(Lm[0] - ink[0], ink[1] - Lm[1]).toFixed(1) });
      }
    }
  }
  return out;
}

// one language page, one viewport: every hold of BEATS (seeked in one page load); returns [{ beat, issues }]
async function auditPage(browser, base, p, v) {
  const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: v.dpr || 1, isMobile: !!v.phone, hasTouch: !!v.phone });
  const page = await ctx.newPage();
  await page.goto(`${base}${p}?beat=mei.hero`, { waitUntil: 'domcontentloaded' });
  const res = [];
  try {
    await page.waitForFunction(() => window.__qilich && (window.__qilich.posterReady || window.__qilich.glError), null, { timeout: 240000 });
    await page.evaluate(() => document.fonts.ready);
    for (const b of BEATS) {
      const ok = await page.evaluate((name) => { const Q = window.__qilich; if (!Q.seek) return false; Q.seek(name); return true; }, b);
      if (!ok) break;
      await page.waitForTimeout(450);
      res.push({ beat: b, issues: await page.evaluate(audit) });
    }
  } catch (e) { res.push({ beat: '-', issues: [{ mask: 'error', text: String(e.message).slice(0, 120) }] }); }
  await ctx.close();
  return res;
}

module.exports = { BEATS, audit, auditPage };

if (require.main === module) {
  const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
  const base = (process.argv[2] || 'http://localhost:8800').replace(/\/$/, '');
  const out = path.resolve(process.argv[3] || '.cache/qa/mask');
  fs.mkdirSync(out, { recursive: true });
  const PAGES = { uz: '/', ru: '/ru/', en: '/en/', ja: '/ja/' };
  const VIEWS = [{ name: '1440x900', w: 1440, h: 900, dpr: 0.75 }, { name: '1280x720', w: 1280, h: 720 }, { name: '390x844', w: 390, h: 844, phone: true, dpr: 1.5 }];
  (async () => {
    const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
    const report = [];
    let fails = 0;
    for (const [lang, p] of Object.entries(PAGES)) for (const v of VIEWS) {
      const r = await auditPage(browser, base, p, v);
      const bad = r.filter((x) => x.issues.length);
      fails += bad.reduce((s, x) => s + x.issues.length, 0);
      report.push({ lang, view: v.name, beats: r.length, bad });
      console.log(`${bad.length ? 'FAIL' : 'ok  '} ${lang}-${v.name}: ${r.length} holds${bad.length ? '\n   ' + bad.map((x) => `${x.beat}: ${x.issues.map((i) => `${i.mask} "${i.text}" ink ${i.ink} outside ${i.win} by ${i.over}px`).join('; ')}`).join('\n   ') : ''}`);
    }
    await browser.close();
    fs.writeFileSync(path.join(out, 'mask.json'), JSON.stringify(report, null, 1));
    console.log(`mask-audit: ${fails ? `FAIL (${fails})` : 'PASS'} -> ${path.join(out, 'mask.json')}`);
    process.exit(fails ? 1 : 0);
  })();
}
