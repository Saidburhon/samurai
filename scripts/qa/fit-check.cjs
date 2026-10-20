// fit-check: every text box against the viewport, the side margins, the other text boxes, the nav and ruler bands
// and the blade band of the hero drawing, in uz/ru/en at 1440 × 900, 1280 × 720, 390 × 844 and 360 × 740.
// G0 checks flow mode (the catalogue); from G3 it also checks every cinema hold (?beat=k).
// Usage: node scripts/qa/fit-check.cjs [baseUrl=http://localhost:8800] [outDir=.cache/qa/fit]
// Writes <outDir>/fit.json, one annotated screenshot per page and viewport (violations boxed in red), and exits 1 on failure.
// The dial (svg text, so its size is the font size times the svg's scale): every numeral and ring name renders at
// 13 px or more on desktop, 12 px or more on phones; no numeral touches a ring line, its ticks or the frieze; and the
// drawn hand, turned through the day in half hours, never crosses a numeral or a ring name.
const path = require('path');
const fs = require('fs');
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');

const base = (process.argv[2] || 'http://localhost:8800').replace(/\/$/, '');
const out = path.resolve(process.argv[3] || '.cache/qa/fit');
fs.mkdirSync(out, { recursive: true });
const PAGES = { uz: '/', ru: '/ru/', en: '/en/' };
const VIEWS = [
  { name: '1440x900', w: 1440, h: 900, phone: false },
  { name: '1280x720', w: 1280, h: 720, phone: false },
  { name: '390x844', w: 390, h: 844, phone: true },
  { name: '360x740', w: 360, h: 740, phone: true },
];

// runs in the page: measure every visible line of text and the hero's blade band
function measure() {
  const W = document.documentElement.clientWidth, H = innerHeight;
  const vis = (el) => { for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false; } return true; };
  const boxes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent.trim()) continue;
    const el = n.parentElement;
    if (!el || el.closest('#strings, script, style, .sprite, .words, #menu, .toast, svg defs, .skip')) continue;
    if (!vis(el)) continue;
    const r = document.createRange(); r.selectNodeContents(n);
    const fs = parseFloat(getComputedStyle(el).fontSize);
    // a text node inside an svg <text> (the dial): its own box
    const rects = [...r.getClientRects()].filter((q) => q.width > 0.5 && q.height > 0.5);
    for (const q of rects) {
      // clipped by an overflow:hidden ancestor (line masks) or by the stage?
      let clip = null;
      for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.overflow === 'hidden' || cs.overflowX === 'hidden' || cs.overflow === 'clip') { const b = e.getBoundingClientRect(); clip = clip ? { l: Math.max(clip.l, b.left), r: Math.min(clip.r, b.right), t: Math.max(clip.t, b.top), b: Math.min(clip.b, b.bottom) } : { l: b.left, r: b.right, t: b.top, b: b.bottom }; } }
      const box = { l: q.left, r: q.right, t: q.top + scrollY, b: q.bottom + scrollY, vt: q.top, vb: q.bottom };
      if (clip && (box.l < clip.l - 1 || box.r > clip.r + 1)) box.clipped = true;
      const owner = el.closest('[data-i18n], [data-k], a, button, h1, h2, h3, p, li, span, time, text, b, i, figcaption') || el;
      const sel = owner.tagName.toLowerCase() + (owner.id ? '#' + owner.id : '') + (owner.className && typeof owner.className === 'string' ? '.' + owner.className.trim().split(/\s+/).join('.') : '');
      const group = el.closest('.osh-labels, .ol, .nav, .ruler, .foot, .dial, .hako, .mei, address, .clocks-big, .svc, .lbl, .stone') || el;
      // the glyph box is taller than a tight line (Geologica's ascent + descent is 1.25 em, display leading .98):
      // compare the line boxes, not the glyph boxes
      const lh = parseFloat(getComputedStyle(el).lineHeight) || fs * 1.2, trim = Math.max(0, (box.b - box.t - Math.min(box.b - box.t, lh)) / 2);
      box.t += trim; box.b -= trim; box.vt += trim; box.vb -= trim;
      boxes.push({ ...box, text: n.textContent.trim().slice(0, 40), sel, fs, fixed: !!el.closest('.nav, .ruler'), inSvg: !!el.closest('svg'), stage: !!el.closest('#stage'), labels: !!el.closest('.osh-labels'), gid: [...document.querySelectorAll('*')].indexOf(group), eid: [...document.querySelectorAll('*')].indexOf(el) });
    }
  }
  // objects that sit among the text: the hanko
  for (const el of document.querySelectorAll('.hanko')) {
    if (!vis(el)) continue;
    const q = el.getBoundingClientRect();
    boxes.push({ l: q.left, r: q.right, t: q.top + scrollY, b: q.bottom + scrollY, vt: q.top, vb: q.bottom, text: 'hanko', sel: 'div.hanko', fs: 99, fixed: false, inSvg: false, stage: false, labels: false, gid: -2, eid: -2 });
  }
  // .ln lines that wrap (a line mask must hold exactly one line on desktop)
  const wraps = [];
  for (const s of document.querySelectorAll('.ln > span')) {
    if (!vis(s) || getComputedStyle(s).display !== 'inline-block') continue;
    const r = document.createRange(); r.selectNodeContents(s);
    const tops = new Set([...r.getClientRects()].filter((q) => q.width > 1).map((q) => Math.round(q.top)));
    if (tops.size > 1) wraps.push(s.textContent.trim());
  }
  // the blade band: the hero drawing's outlines (blade, koshirae, the face-on tsuba) as screen polygons
  const polys = [];
  const svg = document.getElementById('osh');
  if (svg && vis(svg)) {
    for (const p of svg.querySelectorAll('#osh-hero .o-blade path:first-child, #osh-hero .o-kosh path, #osh-detail .o-face path:first-child')) {
      if (!vis(p)) continue;
      const m = p.getScreenCTM(), L = p.getTotalLength(), pts = [];
      for (let i = 0; i <= 80; i++) { const q = p.getPointAtLength(L * i / 80); pts.push([m.a * q.x + m.c * q.y + m.e, m.b * q.x + m.d * q.y + m.f + scrollY]); }
      polys.push(pts);
    }
  }
  const m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--m')) || 0;
  const navH = document.querySelector('.nav')?.getBoundingClientRect().height || 0;
  return { W, H, docW: document.documentElement.scrollWidth, docH: document.documentElement.scrollHeight, boxes, wraps, polys, navH, lang: document.documentElement.lang, margin: getComputedStyle(document.body).getPropertyValue('--m') || m, dial: dialAudit() };

  // the dial, in its own units (viewBox -500 -500 1000 1000, centre 0 0)
  function dialAudit() {
    const dial = document.querySelector('svg.dial');
    if (!dial || !vis(dial)) return null;
    const texts = [...dial.querySelectorAll('#dial-num text, .names text')].filter((t) => vis(t) && t.getComputedTextLength() > 0);
    const sizes = [], rings = [];
    // ring lines and their ticks, and the frieze band: [from, to] radii a numeral must keep clear of
    const keep = [[388, 402], [478, 494], [238, 302]];
    for (const t of texts) {
      const ctm = t.getScreenCTM(), fs = parseFloat(getComputedStyle(t).fontSize);
      sizes.push({ text: t.textContent, px: +(fs * Math.hypot(ctm.a, ctm.b)).toFixed(2) });
      if (t.closest('.names')) continue;
      const b = t.getBBox();
      const cx = Math.max(b.x, Math.min(0, b.x + b.width)), cy = Math.max(b.y, Math.min(0, b.y + b.height));
      const rMin = Math.hypot(cx, cy), rMax = Math.max(...[[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(([x, y]) => Math.hypot(x, y)));
      for (const [a, z] of keep) if (rMin < z && rMax > a) rings.push({ text: t.textContent, r: [Math.round(rMin), Math.round(rMax)], band: [a, z] });
    }
    // the hand through the day: its outlines against every glyph cell
    const hand = dial.querySelector('.hand'), hits = [];
    const cells = [];
    for (const t of texts) { const n = t.getNumberOfChars(); for (let i = 0; i < n; i++) { const e = t.getExtentOfChar(i); if (e.width > 0) cells.push({ t: t.textContent, x0: e.x, y0: e.y, x1: e.x + e.width, y1: e.y + e.height }); } }
    const outlines = [...hand.querySelectorAll('path')].filter((p) => p.getTotalLength() > 0);
    const prev = hand.style.cssText;
    hand.style.transition = 'none';
    for (let h = 0; h < 24; h += 0.5) {
      hand.style.setProperty('--hand', `${(h - 12) * 15}deg`);
      const toDial = dial.getScreenCTM().inverse();
      let hit = null;
      for (const p of outlines) {
        const M = toDial.multiply(p.getScreenCTM()), L = p.getTotalLength();
        for (let i = 0; i <= 120 && !hit; i++) {
          const q = p.getPointAtLength(L * i / 120), x = M.a * q.x + M.c * q.y + M.e, y = M.b * q.x + M.d * q.y + M.f;
          const c = cells.find((c) => x > c.x0 && x < c.x1 && y > c.y0 && y < c.y1);
          if (c) hit = c.t;
        }
        if (hit) break;
      }
      if (hit) hits.push({ hour: h, text: hit });
    }
    hand.style.cssText = prev;
    return { sizes, rings, hits, cells: cells.length };
  }
}

const overlap = (a, b, tol = 1) => a.l < b.r - tol && b.l < a.r - tol && a.t < b.b - tol && b.t < a.b - tol;
function segInt(p, q, r, s) {
  const d = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  return d(p, q, r) * d(p, q, s) < 0 && d(r, s, p) * d(r, s, q) < 0;
}
function rectHitsPoly(b, poly) {
  const corners = [[b.l, b.t], [b.r, b.t], [b.r, b.b], [b.l, b.b]];
  const inside = (pt) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
  if (corners.some(inside)) return true;
  if (poly.some(([x, y]) => x > b.l && x < b.r && y > b.t && y < b.b)) return true;
  for (let i = 0; i < poly.length - 1; i++) for (let k = 0; k < 4; k++) if (segInt(poly[i], poly[i + 1], corners[k], corners[(k + 1) % 4])) return true;
  return false;
}

(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const report = { when: new Date().toISOString(), base, results: [] };
  let fails = 0;
  for (const [lang, p] of Object.entries(PAGES)) for (const v of VIEWS) {
    const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: 1, isMobile: v.phone, hasTouch: v.phone, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(`${base}${p}?tier=0`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    const m = await page.evaluate(measure);
    const issues = [];
    const margin = v.phone ? 16 : Math.min(48, Math.max(20, v.w * 0.0278));
    if (m.docW > m.W) issues.push({ kind: 'overflow-x', detail: `document ${m.docW}px wide in a ${m.W}px viewport` });
    const B = m.boxes.filter((b) => !b.clipped);
    for (const b of B) {
      if (b.r > m.W + 0.5 || b.l < -0.5) issues.push({ kind: 'off-screen', box: b });
      else if (!b.inSvg && !b.stage && (b.l < margin - 10 || b.r > m.W - margin + 10)) issues.push({ kind: 'margin', box: b });
      if (b.fs < (v.phone ? 12 : 13) && !b.inSvg) issues.push({ kind: 'small-type', box: b, detail: `${b.fs}px` });
    }
    // text over text (fixed bars excluded: they float over the page by design)
    const flowB = B.filter((b) => !b.fixed);
    for (let i = 0; i < flowB.length; i++) for (let j = i + 1; j < flowB.length; j++) {
      const a = flowB[i], c = flowB[j];
      if (a.eid === c.eid || (a.gid === c.gid && (a.inSvg || a.labels))) continue; // rotated drawing labels: their axis boxes overlap, the text does not
      if (overlap(a, c, 2)) issues.push({ kind: 'text-overlap', box: a, other: c });
    }
    // the hero at rest: nothing in the nav band or the ruler band but the bars themselves; no text over the blade band
    const heroH = m.H;
    for (const b of B.filter((x) => !x.fixed && x.t < heroH)) {
      if (b.vt < m.navH - 2) issues.push({ kind: 'nav-band', box: b });
      if (!v.phone && b.vb > m.H - 40 + 2 && b.t < heroH) issues.push({ kind: 'ruler-band', box: b });
      if (!b.stage) for (const poly of m.polys) if (rectHitsPoly(b, poly)) { issues.push({ kind: 'blade-band', box: b }); break; }
    }
    for (const t of m.wraps) if (!v.phone) issues.push({ kind: 'line-wraps', detail: t });
    if (m.dial) {
      const min = v.phone ? 12 : 13;
      for (const z of m.dial.sizes) if (z.px < min - 0.05) issues.push({ kind: 'dial-small', detail: `"${z.text}" at ${z.px}px` });
      for (const r of m.dial.rings) issues.push({ kind: 'dial-ring', detail: `"${r.text}" spans r ${r.r.join('–')} across ${r.band.join('–')}` });
      for (const h of m.dial.hits) issues.push({ kind: 'dial-hand', detail: `at ${String(Math.floor(h.hour)).padStart(2, '0')}:${h.hour % 1 ? '30' : '00'} the hand crosses "${h.text}"` });
      const px = m.dial.sizes.map((z) => z.px);
      console.log(`     dial: ${m.dial.sizes.length} texts at ${Math.min(...px).toFixed(1)}–${Math.max(...px).toFixed(1)} px, ${m.dial.cells} glyph cells, hand checked at 48 half hours`);
    }
    const name = `${lang}-${v.name}`;
    // annotate a screenshot of the hero and the whole page's violations
    await page.evaluate((iss) => {
      const layer = document.createElement('div'); layer.style.cssText = 'position:absolute;left:0;top:0;width:0;height:0;z-index:99999;pointer-events:none';
      for (const i of iss) if (i.box) { const d = document.createElement('div'); const b = i.box; d.style.cssText = `position:absolute;left:${b.l}px;top:${b.t}px;width:${b.r - b.l}px;height:${b.b - b.t}px;outline:2px solid #f00;background:rgba(255,0,0,.12)`; layer.appendChild(d); }
      document.body.appendChild(layer);
    }, issues);
    await page.screenshot({ path: path.join(out, `${name}.png`), fullPage: false });
    report.results.push({ page: lang, view: v.name, lang: m.lang, boxes: m.boxes.length, issues: issues.map((i) => ({ kind: i.kind, detail: i.detail, text: i.box?.text, sel: i.box?.sel, at: i.box ? [Math.round(i.box.l), Math.round(i.box.t)] : undefined, other: i.other?.text })) });
    fails += issues.length;
    console.log(`${issues.length ? 'FAIL' : 'ok  '} ${name}: ${m.boxes.length} text boxes, ${issues.length} issue(s)${issues.length ? '\n   ' + issues.slice(0, 12).map((i) => `${i.kind} ${i.detail || ''} ${i.box ? `"${i.box.text}" (${i.box.sel}) at ${Math.round(i.box.l)},${Math.round(i.box.t)}` : ''}${i.other ? ` x "${i.other.text}"` : ''}`).join('\n   ') : ''}`);
    await ctx.close();
  }
  await browser.close();
  report.pass = fails === 0;
  fs.writeFileSync(path.join(out, 'fit.json'), JSON.stringify(report, null, 1));
  console.log(`fit-check: ${report.pass ? 'PASS' : `FAIL (${fails} issues)`} -> ${path.join(out, 'fit.json')}`);
  process.exit(report.pass ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(2); });
