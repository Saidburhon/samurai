// SamurAI typesetting probe (rv2a must-fix 9, 13, 14; SOLUTIONS-SPEC "World"): for each page and width, in every
// visible text node of the result and the strip:
//   - a number range ("19–27 недель", "$16 900–26 200", "3,000〜4,100ドル") broken across two lines
//   - a separator dot "·" that starts or ends a line
//   - text under 13 px on desktop or 12 px on a phone (SVG text measured at its rendered scale)
//   - horizontal overflow of the page
//   - punctuation that starts a line in the intake sentence (", 6–20 сотрудников", "、従業員は": jb2a must-fix 5)
//   - two texts of the Gantt that overlap, or one cut by its edge ("Кайдзен" over "Старт": jb2a must-fix 6)
//   - the large price (jb2a3 must-fix 1, sec3 must-fix 4), in both currencies: a line break inside one of its
//     unbreakable pieces (ド|ル, "mln | soʻm"); on a phone, more than one line in uz, ru or en, or two lines closer
//     than 1.15 × its size (the okina touching the comma above)
//   - any text that crosses the hakogaki strip (鑑定 and its gloss) on the right edge (jb2a3 must-fix 2)
// Usage: node scripts/qa/samurai-wrap.cjs <base> <path,path,...> [outDir]   e.g. /samurai/?sample=clinic
// The empty pages (/samurai/, /ru/samurai/, …) measure the intake; the sample pages the result and its Gantt. A path
// prefixed nb:, off: or err: submits the form against a stubbed /api/samurai: not a business, SamurAI unavailable (the
// catalogue matcher answers), a dropped connection. WIDTHS=360,390 limits the widths.
const fs = require('fs');
const path = require('path');
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');

const base = (process.argv[2] || 'http://127.0.0.1:8810').replace(/\/$/, '');
const pages = (process.argv[3] || '/samurai/?sample=clinic').split(',');
const out = process.argv[4] ? path.resolve(process.argv[4]) : null;
if (out) fs.mkdirSync(out, { recursive: true });
const WIDTHS = [[1440, 900], [430, 932], [390, 844], [360, 740]].filter(([w]) => !process.env.WIDTHS || process.env.WIDTHS.split(',').includes(String(w)));
const sse = (evs) => evs.map(([e, d]) => `event: ${e}\ndata: ${JSON.stringify(d)}\n\n`).join('');
const LANG_OF = (pg) => (/^\/(ru|en|ja)\//.exec(pg) || [, 'uz'])[1];
function stub(kind, lang) {
  const meta = { brief_no: 'QL-2610-7E57', lang, generated_at: '2026-10-21T15:00:00+05:00', valid_until: '2026-11-20', catalogue_version: 'x', rate: { uzs_per_usd: 12012.3, date: '2026-10-21', source: 'cbu' }, source: kind === 'off' ? 'fallback' : 'model' };
  if (kind === 'nb') {
    const pick = { status: 'not_business', heard: { summary: '', quotes: [], industry: 'other', size: 'small' }, questions: [], solutions: [], not_recommended: [] };
    return sse([['meta', meta], ['status', { status: 'not_business' }], ['plan', { pick, source: 'model' }], ['done', { sig: '', partial: false, ms: 3000 }]]);
  }
  return sse([['meta', meta], ['error', { code: kind === 'off' ? 'not_configured' : 'upstream' }]]);
}
const TEXT = { uz: 'Dorixona, 3 filial, buyurtmalar telefon orqali', ru: 'Аптека, три филиала, заказы по телефону', en: 'A pharmacy with three branches, orders come by phone', ja: '薬局を3店舗経営しています。注文は電話で受けています' };

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
    const kind = /^(nb|off|err):/.exec(pg)?.[1], url = kind ? pg.slice(kind.length + 1) : pg;
    if (kind) {
      await p.route('**/api/samurai', (r) => r.fulfill({ status: 200, headers: { 'content-type': 'text/event-stream' }, body: stub(kind, LANG_OF(url)) }));
      await p.addInitScript(() => { try { localStorage.clear(); } catch {} });
    }
    await p.goto(base + url, { waitUntil: 'networkidle' });
    if (kind) {
      await p.click('.own-toggle').catch(() => {});
      await p.fill('#sam-text', TEXT[LANG_OF(url)]);
      await p.click('.go-btn');
      await p.waitForSelector('#result:not([hidden])', { timeout: 8000 }).catch(() => {});
    }
    await p.waitForTimeout(2500);
    // every row open, so the bodies are measured too
    await p.evaluate(() => document.querySelectorAll('.result details').forEach((d) => (d.open = true)));
    await p.waitForTimeout(300);
    // W: the device width. A phone's layout viewport grows to fit content that overflows (innerWidth then reads the
    // overflowing width), so every width rule and the overflow are measured against W, never innerWidth
    const measure = () => p.evaluate((W) => {
      const min = W < 500 ? 12 : 13;
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
          const re = /\$?\d[\d .,億]*万?[–〜]\$?\d[\d .,億]*/g;
          let m;
          while ((m = re.exec(t))) { const a = lineOf(n, m.index), z = lineOf(n, m.index + m[0].length - 1); if (a != null && z != null && Math.abs(a - z) > 4) broken.push(t.slice(Math.max(0, m.index - 12), m.index + m[0].length + 10)); }
          // a brief number never breaks at its hyphens ("QL-2610-⏎36C5")
          const bn = /QL-\d{4}-[0-9A-F]{4}(?:·\d+)?/g;
          while ((m = bn.exec(t))) { const a = lineOf(n, m.index), z = lineOf(n, m.index + m[0].length - 1); if (a != null && z != null && Math.abs(a - z) > 4) broken.push(m[0]); }
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
      // the large price: each unbreakable piece on one line; on a phone one line in uz, ru, en (a ja スム range may take
      // two, its lines at least 1.15 × its size apart)
      const big = [];
      const lineTops = (el) => { const rg = document.createRange(); rg.selectNodeContents(el); return [...new Set([...rg.getClientRects()].filter((q) => q.width > 0).map((q) => Math.round(q.top)))].sort((a, b) => a - b).filter((t, i, a) => !i || t - a[i - 1] > 4); };
      for (const el of document.querySelectorAll('#result .sheet .big')) {
        if (!visible(el)) continue;
        const t = el.textContent, fs = parseFloat(getComputedStyle(el).fontSize);
        for (const nw of el.querySelectorAll('.nw')) if (lineTops(nw).length > 1) big.push(`split inside "${nw.textContent}" of "${t}"`);
        const tops = lineTops(el);
        if (W < 500 && tops.length > 1 && document.documentElement.lang !== 'ja') big.push(`${tops.length} lines: "${t}" at ${fs}px`);
        for (let i = 1; i < tops.length; i++) if (tops[i] - tops[i - 1] < fs * 1.15 - 0.5) big.push(`lines ${tops[i] - tops[i - 1]}px apart at ${fs}px: "${t}"`);
        if (el.scrollWidth > el.clientWidth + 1) big.push(`overflows its column: "${t}"`);
      }
      // the hakogaki strip: no text of the head, the intake or the result crosses its kanji or its gloss
      const hako = [];
      const hk = [...document.querySelectorAll('.hako b, .hako .gl')].filter(visible).map((e) => e.getBoundingClientRect());
      for (const root of [document.querySelector('.sam-head'), document.querySelector('.intake'), document.querySelector('#result')].filter(Boolean)) {
        const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        while (w.nextNode()) {
          const n = w.currentNode;
          if (!n.textContent.trim() || !n.parentElement || !visible(n.parentElement)) continue;
          const rg = document.createRange(); rg.selectNodeContents(n);
          for (const q of rg.getClientRects()) if (q.width > 0 && hk.some((a) => q.right > a.left + 0.5 && q.left < a.right - 0.5 && q.bottom > a.top + 0.5 && q.top < a.bottom - 0.5)) { hako.push(n.textContent.trim().slice(0, 40)); break; }
        }
      }
      // what runs past the right edge of the device width (fixed layers such as the grain excepted)
      const past = [];
      for (const el of document.querySelectorAll('body *')) { const q = el.getBoundingClientRect(); if (q.width > 0 && q.right > W + 1 && getComputedStyle(el).position !== 'fixed' && !el.closest('[hidden], dialog:not([open]), .grain, .strip')) past.push(`${el.tagName.toLowerCase()}.${String(el.className?.baseVal ?? el.className).split(' ')[0]} to ${Math.round(q.right)}`); }
      return { broken: [...new Set(broken)], dots: [...new Set(dots)], small: [...new Set(small)].slice(0, 12), punct, overlap, big: [...new Set(big)], hako: [...new Set(hako)], past: past.slice(0, 6), overflow: Math.max(document.documentElement.scrollWidth, innerWidth) - W };
    }, w);
    // both currencies: the page's own, then the other one
    const r = await measure();
    const flip = () => p.evaluate(() => { const b = document.querySelector('#result .cur button[aria-pressed="false"]'); b?.click(); return !!b; });
    if (await flip()) {
      await p.waitForTimeout(400);
      await p.evaluate(() => document.querySelectorAll('.result details').forEach((d) => (d.open = true)));
      const r2 = await measure();
      for (const k of ['broken', 'dots', 'small', 'punct', 'overlap', 'big', 'hako', 'past']) r[k] = [...new Set([...r[k], ...r2[k]])];
      r.overflow = Math.max(r.overflow, r2.overflow);
      await flip();
      await p.waitForTimeout(200);
    }
    const ok = !r.broken.length && !r.dots.length && !r.small.length && !r.punct.length && !r.overlap.length && !r.big.length && !r.hako.length && !r.past.length && r.overflow <= 0 && !errors.length;
    if (!ok) bad++;
    report.push({ page: pg, width: w, ok, ...r, errors });
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${pg} ${w}: ranges broken ${r.broken.length}, line-edge dots ${r.dots.length}, small ${r.small.length}, line-start punctuation ${r.punct.length}, Gantt overlaps ${r.overlap.length}, price ${r.big.length}, over the hakogaki ${r.hako.length}, overflow ${r.overflow}${errors.length ? `, errors ${errors.length}` : ''}`);
    for (const k of ['broken', 'dots', 'small', 'punct', 'overlap', 'big', 'hako', 'past']) if (r[k].length) console.log(`     ${k}: ${r[k].map((x) => JSON.stringify(x)).join(' ')}`);
    if (out) await p.screenshot({ path: path.join(out, `wrap-${pg.replace(/[^\w]+/g, '_')}-${w}.png`), fullPage: true });
    await ctx.close();
  }
  await b.close();
  if (out) fs.writeFileSync(path.join(out, 'wrap-probe.json'), JSON.stringify(report, null, 1));
  console.log(`samurai-wrap: ${report.length - bad}/${report.length} clean`);
  process.exit(bad ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
