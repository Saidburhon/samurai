// SamurAI typesetting probe (rv2a must-fix 9, 13, 14; SOLUTIONS-SPEC "World"): for each page and width, in every
// visible text node of the result and the strip:
//   - a number range ("19–27 недель", "$16 900–26 200", "3,000〜4,100ドル") broken across two lines
//   - a separator dot "·" that starts or ends a line
//   - text under 13 px on desktop or 12 px on a phone (SVG text measured at its rendered scale)
//   - horizontal overflow of the page
//   - punctuation that starts a line in the intake sentence (", 6–20 сотрудников", "、従業員は": jb2a must-fix 5)
//   - two texts of the Gantt that overlap, or one cut by its edge ("Кайдзен" over "Старт": jb2a must-fix 6)
// Usage: node scripts/qa/samurai-wrap.cjs <base> <path,path,...> [outDir]   e.g. /samurai/?sample=clinic
// The empty pages (/samurai/, /ru/samurai/, …) measure the intake; the sample pages the result and its Gantt.
const fs = require('fs');
const path = require('path');
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');

const base = (process.argv[2] || 'http://127.0.0.1:8810').replace(/\/$/, '');
const pages = (process.argv[3] || '/samurai/?sample=clinic').split(',');
const out = process.argv[4] ? path.resolve(process.argv[4]) : null;
if (out) fs.mkdirSync(out, { recursive: true });
const WIDTHS = [[1440, 900], [390, 844], [360, 740]];

(async () => {
  const b = await chromium.launch();
  const report = [];
  let bad = 0;
  for (const pg of pages) for (const [w, hgt] of WIDTHS) {
    const phone = w < 500;
    const ctx = await b.newContext({ viewport: { width: w, height: hgt }, deviceScaleFactor: 1, isMobile: phone, hasTouch: phone });
    const p = await ctx.newPage();
    const errors = [];
    p.on('pageerror', (e) => errors.push(String(e)));
    await p.goto(base + pg, { waitUntil: 'networkidle' });
    await p.waitForTimeout(2500);
    // every row open, so the bodies are measured too
    await p.evaluate(() => document.querySelectorAll('.result details').forEach((d) => (d.open = true)));
    await p.waitForTimeout(300);
    const r = await p.evaluate(() => {
      const min = innerWidth < 500 ? 12 : 13;
      const lineOf = (node, i) => { const rg = document.createRange(); rg.setStart(node, i); rg.setEnd(node, i + 1); const q = [...rg.getClientRects()].filter((x) => x.width > 0)[0]; return q ? Math.round(q.top + q.height / 2) : null; };
      const visible = (el) => { const cs = getComputedStyle(el); const rc = el.getBoundingClientRect(); return cs.display !== 'none' && cs.visibility !== 'hidden' && rc.width > 0 && rc.height > 0 && !el.closest('[hidden], .vh, dialog:not([open]), script, style, .print-head, .print-foot, .gantt-table'); };
      const broken = [], dots = [], small = [], punct = [], overlap = [];
      // the intake: a punctuation mark on another line than the glyph or the blank before it
      const sent = document.querySelector('.intake .sentence');
      if (sent && visible(sent)) {
        const sameLine = (a, b) => a.top < b.bottom - 2 && a.bottom > b.top + 2;
        const w = document.createTreeWalker(sent, NodeFilter.SHOW_TEXT);
        while (w.nextNode()) {
          const n = w.currentNode, t = n.textContent;
          if (n.parentElement.closest('select, .val')) continue;
          for (let i = 0; i < t.length; i++) {
            if (!/[,.:;、。]/.test(t[i])) continue;
            const rg = document.createRange(); rg.setStart(n, i); rg.setEnd(n, i + 1);
            const r1 = [...rg.getClientRects()].find((x) => x.width > 0);
            let r0 = null, k = i - 1;
            while (k >= 0 && /\s/.test(t[k])) k--;
            if (k >= 0) { const q = document.createRange(); q.setStart(n, k); q.setEnd(n, k + 1); r0 = [...q.getClientRects()].find((x) => x.width > 0); }
            else { let el = n.previousSibling; while (el && el.nodeType === 3 && !el.textContent.trim()) el = el.previousSibling; if (el && el.nodeType === 1) r0 = [...el.getClientRects()].pop(); }
            if (r1 && r0 && !sameLine(r1, r0)) punct.push(t.slice(i, i + 14));
          }
        }
      }
      // the Gantt: every pair of texts, and each text against the drawing's edges
      for (const svg of document.querySelectorAll('svg.gantt')) {
        if (!visible(svg)) continue;
        const box = svg.getBoundingClientRect();
        const ts = [...svg.querySelectorAll('text')].map((x) => ({ t: x.textContent, r: x.getBoundingClientRect() })).filter((x) => x.r.width > 0);
        for (let i = 0; i < ts.length; i++) {
          const a = ts[i].r;
          if (a.left < box.left - 1 || a.right > box.right + 1) overlap.push(`cut: ${ts[i].t}`);
          for (let j = i + 1; j < ts.length; j++) {
            const b = ts[j].r, area = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
            if (area > 4) overlap.push(`${ts[i].t} × ${ts[j].t}`);
          }
        }
      }
      const roots = [document.querySelector('#result'), document.querySelector('.strip'), document.querySelector('.intake')].filter(Boolean);
      for (const root of roots) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const n = walker.currentNode, el = n.parentElement, t = n.textContent;
          if (!t.trim() || !el || !visible(el) || el.closest('svg')) continue;
          // ranges: digits, a dash or a tilde, digits, within this text node
          const re = /\$?\d[\d .,]*万?[–〜]\$?\d[\d .,]*/g;
          let m;
          while ((m = re.exec(t))) { const a = lineOf(n, m.index), z = lineOf(n, m.index + m[0].length - 1); if (a != null && z != null && Math.abs(a - z) > 4) broken.push(t.slice(Math.max(0, m.index - 12), m.index + m[0].length + 10)); }
          // a separator dot at the start or the end of a line: compare with the nearest visible character on each side
          for (let i = t.indexOf('·'); i >= 0; i = t.indexOf('·', i + 1)) {
            const at = lineOf(n, i);
            let k = i - 1; while (k >= 0 && /\s/.test(t[k])) k--;
            let j = i + 1; while (j < t.length && /\s/.test(t[j])) j++;
            const before = k >= 0 ? lineOf(n, k) : null, after = j < t.length ? lineOf(n, j) : null;
            if (at != null && ((before != null && Math.abs(before - at) > 4) || (after != null && Math.abs(after - at) > 4))) dots.push(t.slice(Math.max(0, i - 16), i + 16));
          }
        }
        // sizes
        for (const el of root.querySelectorAll('*')) {
          if (!visible(el) || ![...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())) continue;
          let size = parseFloat(getComputedStyle(el).fontSize);
          if (el instanceof SVGElement && el.getScreenCTM) { const mm = el.getScreenCTM(); if (mm) size *= Math.hypot(mm.a, mm.b); }
          if (size < min - 0.25) small.push(`${el.tagName.toLowerCase()}.${String(el.className?.baseVal ?? el.className).split(' ')[0]} ${size.toFixed(1)}px "${el.textContent.trim().slice(0, 24)}"`);
        }
      }
      return { broken: [...new Set(broken)], dots: [...new Set(dots)], small: [...new Set(small)].slice(0, 12), punct, overlap, overflow: document.documentElement.scrollWidth - innerWidth };
    });
    const ok = !r.broken.length && !r.dots.length && !r.small.length && !r.punct.length && !r.overlap.length && r.overflow <= 0 && !errors.length;
    if (!ok) bad++;
    report.push({ page: pg, width: w, ok, ...r, errors });
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${pg} ${w}: ranges broken ${r.broken.length}, line-edge dots ${r.dots.length}, small ${r.small.length}, line-start punctuation ${r.punct.length}, Gantt overlaps ${r.overlap.length}, overflow ${r.overflow}${errors.length ? `, errors ${errors.length}` : ''}`);
    for (const k of ['broken', 'dots', 'small', 'punct', 'overlap']) if (r[k].length) console.log(`     ${k}: ${r[k].map((x) => JSON.stringify(x)).join(' ')}`);
    if (out) await p.screenshot({ path: path.join(out, `wrap-${pg.replace(/[^\w]+/g, '_')}-${w}.png`), fullPage: true });
    await ctx.close();
  }
  await b.close();
  if (out) fs.writeFileSync(path.join(out, 'wrap-probe.json'), JSON.stringify(report, null, 1));
  console.log(`samurai-wrap: ${report.length - bad}/${report.length} clean`);
  process.exit(bad ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
