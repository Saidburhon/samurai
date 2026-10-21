// flow-probe (G0): the skeleton and its content, in flow mode (?tier=0) and with JavaScript off.
// For uz/ru/en/ja, desktop 1440 × 900 (DPR 0.75, as the capture) and phone 390 × 844 (DPR 1.5):
//   - console errors and warnings, failed requests (4xx/5xx)
//   - <html lang>, exactly one h1, the title
//   - all copy present: every data-i18n element of /ru/, /en/ and /ja/ carries its dictionary text; no Uzbek left there
//   - no "yarat-", no product names, no Telegram handle in the rendered text
//   - the okina (U+02BB) renders through QOkina / QOkinaMono (CDP platform fonts), with zoomed crops to look at
//   - no JS: the hero drawing lies on its diagonal (K and T within 1.5 px of the anchors), the page is complete
//   - no horizontal overflow
//   - with JS: the hero's hamon stipple (canvas#stip) is fully inked and its dots lie inside the drawn blade outline
//   - every visible text node on every page (404 included, the phone menu opened) is drawn with the site's own faces
//     (CDP platform fonts): any platform fallback (Liberation, Arial, DejaVu, ...) fails, e.g. a capital that
//     text-transform made and the font subset lacks; on /ja/ the Japanese system gothic of the stack is ours too
//     (Hiragino Sans, Noto Sans JP, Yu Gothic, Meiryo), and so is whatever the stack's sans-serif reaches on this
//     machine for Japanese characters only: an element's other-font glyphs may not outnumber its kana and kanji
//   - before app_css arrives (it loads async; here it is held back): no overflow, no visual-viewport zoom-out, and
//     the stipple still on the blade (a phone zooms the page out when anything is wider than the viewport)
//   - screenshots down the page, as contact sheets, for the "printed catalogue" review
// Usage: node scripts/qa/flow-probe.cjs [baseUrl=http://localhost:8800] [outDir=.cache/qa/flow]
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { chromium } = require(execSync('npm root -g').toString().trim() + '/playwright');

const base = (process.argv[2] || 'http://localhost:8800').replace(/\/$/, '');
const out = path.resolve(process.argv[3] || '.cache/qa/flow');
fs.mkdirSync(out, { recursive: true });
const PAGES = { uz: '/', ru: '/ru/', en: '/en/', ja: '/ja/' };
const VIEWS = { desktop: { width: 1440, height: 900, dpr: 0.75, phone: false }, phone: { width: 390, height: 844, dpr: 1.5, phone: true } };
const ANCH = { land: { K: [0.072, 0.698], T: [0.921, 0.258] }, port: { K: [0.626, 0.955], T: [0.856, 0.123] } };
const BANNED = [/yarat/i, /hoglt|pool\s*timer|club\s*time|tikoncha/i, /t\.me\//i];
// CDP names the instance it drew with ("Geologica Thin", "Martian Mono SemiExpanded", "Zen Old Mincho Black")
const OWN_FONTS = ['Geologica', 'Martian Mono', 'Zen Old Mincho', 'QOkina', 'QOkinaMono', 'GeologicaSign'];
const JA_FONTS = ['Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Noto Sans CJK JP', 'Yu Gothic', 'YuGothic', 'Meiryo', 'IPAGothic', 'IPAPGothic'];
const own = (name, lang) => [...OWN_FONTS, ...(lang === 'ja' ? JA_FONTS : [])].some((f) => name === f || name.startsWith(f + ' '));

// every element with its own visible text, through CDP: the platform fonts that drew it; anything not ours is a fallback
async function fontAudit(page, ctx, scope = 'body', lang) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  const n = await page.evaluate((scope) => {
    for (const e of document.querySelectorAll('[data-fc]')) e.removeAttribute('data-fc');
    let i = 0;
    for (const el of document.querySelectorAll(`${scope} *`)) {
      if (el.closest('script, style, #strings, defs, .sprite')) continue;
      if (![...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())) continue;
      if (!el.getClientRects().length || getComputedStyle(el).visibility === 'hidden') continue;
      el.setAttribute('data-fc', String(i++));
      el.setAttribute('data-cjk', String([...el.childNodes].filter((c) => c.nodeType === 3).map((c) => c.textContent).join('').match(/[\u3000-\u30ff\u4e00-\u9fff\uff00-\uffef]/gu)?.length || 0));
    }
    return i;
  }, scope);
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument', { depth: -1, pierce: true });
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: '[data-fc]' });
  const off = [], used = {};
  for (const id of nodeIds) {
    const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId: id });
    for (const f of fonts) used[f.familyName] = (used[f.familyName] || 0) + f.glyphCount;
    const alien = fonts.filter((f) => !own(f.familyName, lang));
    if (!alien.length) continue;
    const { attributes } = await cdp.send('DOM.getAttributes', { nodeId: id });
    // Japanese: the platform's own Japanese face for kana and kanji is the system gothic the stack asks for
    if (lang === 'ja' && alien.reduce((n, f) => n + f.glyphCount, 0) <= +attributes[attributes.indexOf('data-cjk') + 1]) continue;
    const k = attributes[attributes.indexOf('data-fc') + 1];
    const what = await page.evaluate((k) => { const e = document.querySelector(`[data-fc="${k}"]`); return `<${e.tagName.toLowerCase()}${e.className && typeof e.className === 'string' ? '.' + e.className.split(' ').join('.') : ''}> "${e.textContent.trim().slice(0, 40)}"`; }, k);
    off.push(`${what}: ${alien.map((f) => `${f.familyName}×${f.glyphCount}`).join(', ')}`);
  }
  await cdp.detach();
  return { elements: n, used, off };
}

// the hamon stipple on canvas#stip: inked, and on the blade (every painted pixel tested against the outline's fill)
async function stippleAudit(page) {
  return page.evaluate(() => {
    const cv = document.getElementById('stip'), blade = document.querySelector('#osh-hero .o-blade path.k1'), svg = document.getElementById('osh');
    if (!cv || !blade || !svg || !cv.width) return { error: 'no canvas or no blade outline' };
    // the dots live in the stipple surface's CPU buffer (fx/stipsurface.js); the canvas shows it as one bitmap
    const src = cv.__stip ? cv.__stip.ctx.canvas : cv;
    const { width: w, height: h } = src, d = src.getContext('2d').getImageData(0, 0, w, h).data;
    const inv = svg.getScreenCTM().inverse(), st = cv.getBoundingClientRect(), sx = st.width / w, sy = st.height / h;
    let painted = 0, sampled = 0, inside = 0;
    for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) {
      if (d[(y * w + x) * 4 + 3] < 40) continue;
      if (painted++ % 3) continue;
      sampled++;
      const p = new DOMPoint(st.left + (x + 0.5) * sx, st.top + (y + 0.5) * sy).matrixTransform(inv);
      if (blade.isPointInFill(p) || blade.isPointInStroke(p)) inside++;
    }
    // the inked area in CSS px² (each sample stands for 2 × 2 canvas px): independent of the canvas resolution,
    // which follows the device pixel ratio (boot.js)
    const area = Math.round(painted * 4 * sx * sy);
    return { painted, area, sampled, inside: sampled ? +(inside / sampled).toFixed(3) : 0, dots: (window.__qilich.boot || {}).stipN || 0, canvas: [w, h], iw: innerWidth, cw: document.documentElement.clientWidth };
  });
}
const stippleBad = (s) => (s.error ? s.error : s.dots < 9000 ? `${s.dots} of 9000 dots inked` : s.area < 1000 ? `only ${s.area} CSS px² inked` : s.inside < 0.9 ? `${(s.inside * 100).toFixed(1)} % of the dots on the blade` : null);

(async () => {
  const { RU, EN, JA } = await import(path.resolve('scripts/i18n.mjs'));
  const DICT = { ru: RU, en: EN, ja: JA };
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const report = { when: new Date().toISOString(), base, runs: [] };
  let fails = 0;
  for (const [lang, p] of Object.entries(PAGES)) for (const [vname, v] of Object.entries(VIEWS)) for (const js of [true, false]) {
    const tag = `${lang}-${vname}-${js ? 'flow' : 'nojs'}`;
    const ctx = await browser.newContext({ viewport: { width: v.width, height: v.height }, deviceScaleFactor: v.dpr, isMobile: v.phone, hasTouch: v.phone, javaScriptEnabled: js });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text().slice(0, 160)}`); });
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message.slice(0, 160)));
    page.on('response', (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    // with JavaScript off the browser refuses the module script itself (reported as "csp"): that is the point, not an error
    page.on('requestfailed', (r) => { if (!(js === false && r.resourceType() === 'script')) errors.push(`failed ${r.url()} ${r.failure()?.errorText || ''}`); });
    await page.goto(`${base}${p}${js ? '?tier=0' : ''}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1500);
    const run = { tag, lang, view: vname, js, issues: [] };
    const bad = (k, d) => run.issues.push(`${k}: ${d}`);

    const info = await page.evaluate(() => ({
      lang: document.documentElement.lang, cls: document.documentElement.className, h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
      title: document.title, text: document.body.innerText, sw: document.documentElement.scrollWidth, iw: document.documentElement.clientWidth,
      i18n: [...document.querySelectorAll('[data-i18n]')].map((e) => [e.getAttribute('data-i18n'), e.innerHTML.trim()]),
      labels: [...document.querySelectorAll('[data-i18n-label]')].map((e) => [e.getAttribute('data-i18n-label'), e.getAttribute('aria-label')]),
      mode: (window.__qilich || {}).mode || null,
    }));
    run.mode = info.mode; run.cls = info.cls; run.title = info.title;
    if (info.lang !== lang) bad('lang', `html lang="${info.lang}"`);
    if (info.h1.length !== 1) bad('h1', `${info.h1.length} h1 elements`);
    if (js && info.mode !== 'flow') bad('mode', `mode ${info.mode} (expected flow with ?tier=0)`);
    if (!js && !/\bno-js\b/.test(info.cls)) bad('no-js', 'the no-js class is missing');
    if (info.sw > info.iw) bad('overflow-x', `${info.sw} > ${info.iw}`);
    for (const re of BANNED) { const m = info.text.match(re); if (m) bad('copy', `"${m[0]}" in the page text`); }
    // every data-i18n element: present and non-empty; on /ru/ and /en/ exactly the dictionary text
    const norm = (s) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
    for (const [k, html] of info.i18n) {
      if (!html) bad('copy', `${k} is empty`);
      // flow.js wraps revealed lines in a mask after load; compare the text, not the markup
      const strip = (s) => norm(s.replace(/<[^>]+>/g, ''));
      if (DICT[lang] && strip(html) !== strip(DICT[lang][k] ?? '')) bad('copy', `${k}: "${strip(html).slice(0, 40)}" is not the ${lang} text`);
    }
    for (const [k, l] of info.labels) if (DICT[lang] && norm(l) !== norm(DICT[lang][k])) bad('copy', `aria-label ${k} is not the ${lang} text`);
    // the language switch names Uzbek in Uzbek (Oʻzbekcha, lang="uz") on every page; any other okina is untranslated text
    if (lang !== 'uz' && /ʻ/.test(info.text.replace(/Oʻzbekcha/g, ''))) bad('copy', 'Uzbek text (with ʻ) on a translated page');
    run.keys = info.i18n.length;

    // the okina: which font actually draws it (CDP), and crops to look at
    if (lang === 'uz') {
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
      const { root } = await cdp.send('DOM.getDocument', { depth: -1, pierce: true });
      const targets = { 'h1 (Geologica 280)': '#h1 .ln + .ln > span', 'nav button (Geologica 560, uppercase)': '.nav .btn span', 'subline (Geologica 380)': '.b-hero .sub p', 'caption (Martian Mono)': '.s-tsuba .cap', 'contact button (Geologica 560)': '.contact .btn span' };
      run.okina = {};
      for (const [label, sel] of Object.entries(targets)) {
        const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: sel });
        if (!nodeId) { bad('okina', `${sel} not found`); continue; }
        if (!(await page.$eval(sel, (e) => !!(e.offsetWidth || e.getClientRects().length)))) { run.okina[label] = 'not shown in this layout'; continue; }
        const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
        run.okina[label] = fonts.map((f) => `${f.familyName}×${f.glyphCount}`).join(', ');
        const text = await page.$eval(sel, (e) => e.textContent);
        if (/ʻ/.test(text) && js !== null) {
          const want = /Martian/.test(label) ? 'QOkinaMono' : 'QOkina';
          if (!fonts.some((f) => f.familyName === want)) bad('okina', `${label}: drawn with ${run.okina[label]}, not ${want}`);
        }
      }
      // zoomed crops of each okina (the element scrolled into view, the glyph measured in the viewport)
      let ci = 0;
      for (const sel of Object.values(targets)) {
        const box = await page.evaluate((sel) => {
          const el = document.querySelector(sel); if (!el || !el.getClientRects().length) return null;
          el.scrollIntoView({ block: 'center' });
          const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          for (let n = w.nextNode(); n; n = w.nextNode()) {
            const i = n.textContent.indexOf('\u02bb'); if (i < 0) continue;
            const r = document.createRange(); r.setStart(n, Math.max(0, i - 2)); r.setEnd(n, Math.min(n.textContent.length, i + 3));
            const b = r.getBoundingClientRect();
            return { x: b.left, y: b.top, w: b.width, h: b.height };
          }
          return null;
        }, sel);
        if (!box) continue;
        await page.waitForTimeout(js ? 1000 : 100);
        await page.screenshot({ path: path.join(out, `okina-${tag}-${ci++}.png`), clip: { x: Math.max(0, box.x - 8), y: Math.max(0, box.y - 8), width: box.w + 16, height: box.h + 16 } });
      }
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(js ? 600 : 100);
    }

    // the hamon stipple (JS): fully inked and on the blade
    if (js) {
      run.stipple = await stippleAudit(page);
      const sb = stippleBad(run.stipple); if (sb) bad('stipple', sb);
    }

    // the hero drawing on its diagonal (no JS: placed by the build-emitted CSS alone)
    const geo = await page.evaluate(() => {
      const svg = document.getElementById('osh'), m = svg.getScreenCTM();
      const vb = svg.viewBox.baseVal;
      const k = document.querySelector('#osh-hero .o-annot path.cl');
      // K is the svg origin; T lies on +u at the hero's LKT, read from the centreline's span (26 before K, 22 after T)
      const bb = k.getBBox();
      const LKT = bb.x + bb.width - 22;
      const P = (u, v) => [m.a * u + m.c * v + m.e, m.b * u + m.d * v + m.f];
      const st = document.getElementById('stage').getBoundingClientRect();
      return { K: P(0, 0), T: P(LKT, 0), W: innerWidth, H: st.height, port: matchMedia('(aspect-ratio < 1.2)').matches, vb: [vb.x, vb.y, vb.width, vb.height] };
    });
    const A = ANCH[geo.port ? 'port' : 'land'];
    const dK = Math.hypot(geo.K[0] - A.K[0] * geo.W, geo.K[1] - A.K[1] * geo.H), dT = Math.hypot(geo.T[0] - A.T[0] * geo.W, geo.T[1] - A.T[1] * geo.H);
    run.diagonal = { K: geo.K.map(Math.round), T: geo.T.map(Math.round), errK: +dK.toFixed(2), errT: +dT.toFixed(2), angle: +(Math.atan2(geo.T[1] - geo.K[1], geo.T[0] - geo.K[0]) * 180 / Math.PI).toFixed(2) };
    if (dK > 1.5 || dT > 1.5) bad('diagonal', `K off by ${dK.toFixed(1)} px, T off by ${dT.toFixed(1)} px`);

    // screenshots down the page
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    const step = Math.round(v.height * 0.9);
    let i = 0;
    for (let y = 0; ; y += step) {
      await page.evaluate((y) => scrollTo(0, y), y);
      await page.waitForTimeout(js ? 1100 : 150);
      await page.screenshot({ path: path.join(out, `${tag}-${String(i++).padStart(2, '0')}.png`) });
      if (y + v.height >= H) break;
    }
    run.frames = i;
    // every text drawn with our own faces (the phone menu opened too)
    const fa = await fontAudit(page, ctx, 'body', lang);
    run.fonts = { elements: fa.elements, used: fa.used };
    for (const o of fa.off) bad('font', o);
    if (js && v.phone) {
      await page.evaluate(() => scrollTo(0, 0));
      await page.click('.menu'); await page.waitForTimeout(900);
      await page.screenshot({ path: path.join(out, `menu-${tag}.png`) });
      const fm = await fontAudit(page, ctx, '#menu', lang);
      for (const o of fm.off) bad('font', 'menu ' + o);
      run.fonts.menu = fm.elements;
      await page.click('.menu'); await page.waitForTimeout(600);
    }
    run.errors = errors;
    for (const e of errors) bad('console', e);
    fails += run.issues.length;
    console.log(`${run.issues.length ? 'FAIL' : 'ok  '} ${tag}: lang ${info.lang}, h1 ${info.h1.length}, ${run.keys} i18n keys, diagonal ±${Math.max(run.diagonal.errK, run.diagonal.errT)} px at ${run.diagonal.angle}°, ${i} frames, fonts ${JSON.stringify(run.fonts.used)} in ${run.fonts.elements} elements${run.stipple ? `, stipple ${run.stipple.dots} dots ${run.stipple.area} CSS px² ${(run.stipple.inside * 100).toFixed(1)} % on the blade` : ''}${run.okina ? ', okina ' + JSON.stringify(run.okina) : ''}${run.issues.length ? '\n   ' + run.issues.join('\n   ') : ''}`);
    report.runs.push(run);
    await ctx.close();
  }
  // the 404 page: one h1, no overflow, no console errors, our own faces only (its nav sets RU in uppercase)
  for (const [vname, v] of Object.entries(VIEWS)) for (const js of [true, false]) {
    const tag = `404-${vname}-${js ? 'js' : 'nojs'}`;
    const ctx = await browser.newContext({ viewport: { width: v.width, height: v.height }, deviceScaleFactor: v.dpr, isMobile: v.phone, hasTouch: v.phone, javaScriptEnabled: js });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text().slice(0, 160)}`); });
    page.on('response', (r) => { if (r.status() >= 400 && !/\/no-such-page\/?$/.test(r.url())) errors.push(`${r.status()} ${r.url()}`); });
    await page.goto(`${base}/404.html`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const run = { tag, issues: [] };
    const info = await page.evaluate(() => {
      const h1 = document.querySelector('h1'), img = document.querySelector('.plate img');
      const a = h1.getBoundingClientRect(), b = img.getBoundingClientRect();
      // the drawing's ink starts at the image's own padding (26 of its viewBox units)
      const pad = 26 * b.width / img.naturalWidth;
      return { h1: document.querySelectorAll('h1').length, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h1Right: a.right, inkLeft: b.left + pad, sameRow: b.top < a.bottom && b.bottom > a.top };
    });
    if (info.h1 !== 1) run.issues.push(`h1: ${info.h1}`);
    if (info.sw > info.cw) run.issues.push(`overflow-x: ${info.sw} > ${info.cw}`);
    if (info.sameRow && info.inkLeft < info.h1Right + 8) run.issues.push(`the drawing starts at ${info.inkLeft.toFixed(0)} px, on the numeral (ends ${info.h1Right.toFixed(0)} px)`);
    const fa = await fontAudit(page, ctx);
    for (const o of fa.off) run.issues.push('font: ' + o);
    for (const e of errors) run.issues.push('console: ' + e);
    await page.screenshot({ path: path.join(out, `${tag}.png`) });
    fails += run.issues.length;
    console.log(`${run.issues.length ? 'FAIL' : 'ok  '} ${tag}: fonts ${JSON.stringify(fa.used)}, drawing at ${info.inkLeft.toFixed(0)} px after the numeral at ${info.h1Right.toFixed(0)} px${run.issues.length ? '\n   ' + run.issues.join('\n   ') : ''}`);
    report.runs.push(run);
    await ctx.close();
  }
  // before app_css arrives: the page as the critical CSS alone lays it out (app_css held back for good)
  for (const [lang, p] of Object.entries(PAGES)) for (const [vname, v] of Object.entries(VIEWS)) {
    const tag = `${lang}-${vname}-critical`;
    const ctx = await browser.newContext({ viewport: { width: v.width, height: v.height }, deviceScaleFactor: v.dpr, isMobile: v.phone, hasTouch: v.phone });
    const page = await ctx.newPage();
    await page.route(/app_css-\w+\.css/, (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '/* held back */' }));
    await page.goto(`${base}${p}?tier=0`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    const run = { tag, issues: [] };
    const st = await stippleAudit(page);
    const sb = stippleBad(st); if (sb) run.issues.push('stipple: ' + sb);
    if (st.iw > st.cw + 1) run.issues.push(`the visual viewport zoomed out: innerWidth ${st.iw} > ${st.cw}`);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    if (sw > st.cw) run.issues.push(`overflow-x: ${sw} > ${st.cw}`);
    await page.screenshot({ path: path.join(out, `${tag}.png`) });
    fails += run.issues.length;
    console.log(`${run.issues.length ? 'FAIL' : 'ok  '} ${tag}: innerWidth ${st.iw}, clientWidth ${st.cw}, scrollWidth ${sw}, stipple ${st.dots} dots ${st.area} CSS px² ${(st.inside * 100).toFixed(1)} % on the blade${run.issues.length ? '\n   ' + run.issues.join('\n   ') : ''}`);
    report.runs.push(run);
    await ctx.close();
  }
  await browser.close();
  report.pass = fails === 0;
  fs.writeFileSync(path.join(out, 'flow.json'), JSON.stringify(report, null, 1));
  try { execSync(`python3 ${JSON.stringify(path.resolve(__dirname, 'sheet.py'))} ${JSON.stringify(out)}`, { stdio: 'inherit' }); } catch (e) { console.log('sheets failed', e.message); }
  console.log(`flow-probe: ${report.pass ? 'PASS' : `FAIL (${fails})`} -> ${path.join(out, 'flow.json')}`);
  process.exit(report.pass ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(2); });
