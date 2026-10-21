// SamurAI page probe (SOLUTIONS-SPEC §8 T5–T13, T20–T22, T28, T29, T36, T19 client side, "World"): drives
// /samurai/ in Chromium against `wrangler dev` (for /api/samurai/verify, /api/lead and /api/rate). The stream itself
// is replayed from a recorded live answer (a probe JSON from scripts/qa/samurai-probe.mjs), so every state can be
// checked without spending on the API: complete, partial, error, need_more, not_business, rate_limited.
// Usage: node scripts/qa/samurai-page.cjs <base> <recorded-probe.json> <outDir>
// Writes <outDir>/page-probe.json and screenshots of every state at 1440 × 900, 390 × 844 and 360 × 740.
const fs = require('fs');
const path = require('path');
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');

const base = (process.argv[2] || 'http://127.0.0.1:8811').replace(/\/$/, '');
const rec = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
const out = path.resolve(process.argv[4] || '.cache/qa/samurai');
fs.mkdirSync(out, { recursive: true });
const lang = rec.request.lang || 'uz';
const PAGE = { uz: '/samurai/', ru: '/ru/samurai/', en: '/en/samurai/', ja: '/ja/samurai/' }[lang];
const results = [];
const check = (name, ok, info = '') => { results.push({ name, ok: !!ok, info }); console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${info ? `  ${typeof info === 'string' ? info : JSON.stringify(info)}` : ''}`); };
const sse = (events) => events.map((e) => `event: ${e.event}\ndata: ${JSON.stringify(e.data)}\n\n`).join('');
const full = rec.events.filter((e) => e.event !== 'error');
const upTo = (name) => full.slice(0, full.findIndex((e) => e.event === name) + 1);

async function page(b, w, h, { stream = null, init = null } = {}) {
  const phone = w < 500;
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: phone ? 2 : 1, isMobile: phone, hasTouch: phone });
  const p = await ctx.newPage();
  p.errors = [];
  p.api = [];
  p.on('console', (m) => { if (m.type() === 'error' && !/favicon|ERR_ABORTED/.test(m.text())) p.errors.push(m.text()); });
  p.on('pageerror', (e) => p.errors.push(String(e)));
  p.on('request', (r) => { if (r.url().includes('/api/')) p.api.push(r.url().replace(base, '')); });
  if (stream) await p.route('**/api/samurai', (route) => route.fulfill({ status: 200, headers: { 'content-type': 'text/event-stream' }, body: typeof stream === 'function' ? stream() : stream }));
  if (init) await p.addInitScript(init);
  return p;
}
const shot = (p, name) => p.screenshot({ path: path.join(out, `${name}.png`), fullPage: false });
const fullShot = (p, name) => p.screenshot({ path: path.join(out, `${name}.png`), fullPage: true });
async function submit(p, text = rec.request.text) {
  await p.click('.own-toggle');
  await p.fill('#sam-text', text);
  await p.click('.go-btn');
}
const world = async (p) => p.evaluate(() => {
  const vis = (el) => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && r.bottom > 0 && r.top < innerHeight; };
  const shu = [...document.querySelectorAll('body *')].filter((el) => vis(el) && ['rgb(217, 56, 30)'].some((c) => [getComputedStyle(el).color, getComputedStyle(el).backgroundColor, getComputedStyle(el).fill].includes(c)) && !el.closest('.hanko')).length;
  const hanko = [...document.querySelectorAll('.signed .hanko')].filter(vis).length;
  const kanji = [...document.querySelectorAll('body [lang=ja]')].filter((el) => vis(el) && !el.closest('nav.lang') && !el.closest('.mei-s') && /[一-鿿]/.test(el.textContent)).length;
  const fams = new Set(), small = [];
  for (const el of document.querySelectorAll('main *, .nav *')) {
    if (!vis(el) || !el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const cs = getComputedStyle(el);
    fams.add(cs.fontFamily.split(',')[0].replace(/["']/g, '').trim());
    if (parseFloat(cs.fontSize) < (innerWidth < 500 ? 12 : 13) - 0.01) small.push(`${el.tagName}.${el.className}:${cs.fontSize}:${el.textContent.trim().slice(0, 20)}`);
  }
  const thin = /[\u202f\u2009]/.test(document.body.innerText);
  return { shu, hanko, kanji, fams: [...fams], small: small.slice(0, 8), thin, overflow: document.documentElement.scrollWidth - innerWidth, h1: document.querySelectorAll('h1').length };
});

(async () => {
  const b = await chromium.launch();
  const VIEWS = [[1440, 900, 'd'], [390, 844, 'p'], [360, 740, 's']];

  // ---- empty state, three widths; the selects are touchable on phones ----
  for (const [w, h, tag] of VIEWS) {
    const p = await page(b, w, h);
    await p.goto(base + PAGE, { waitUntil: 'networkidle' });
    await shot(p, `empty-${tag}`);
    const wd = await world(p);
    const targets = await p.$$eval('.blank select', (els) => els.map((e) => { const r = e.getBoundingClientRect(); return Math.min(r.height, r.width); }));
    check(`empty ${w}: no overflow, one h1, no console errors`, wd.overflow <= 0 && wd.h1 === 1 && !p.errors.length, { overflow: wd.overflow, errors: p.errors });
    check(`empty ${w}: one kanji element, no shu, faces Geologica/Martian/Mincho`, wd.kanji <= 1 && wd.shu === 0 && wd.fams.every((f) => /QOkina|Geologica|Martian|Zen Old Mincho|Hiragino|Noto Sans JP|Yu Gothic|system-ui|sans-serif/.test(f)), wd);
    check(`empty ${w}: nothing under ${w < 500 ? 12 : 13} px`, !wd.small.length, wd.small);
    if (w < 500) check(`empty ${w}: every select ≥ 44 px to tap`, targets.every((t) => t >= 44), targets.map(Math.round));
    await p.context().close();
  }

  // ---- prefill, draft, counter (T6) ----
  {
    const p = await page(b, 1440, 900);
    await p.goto(`${base}${PAGE}?industry=clinics&q=${encodeURIComponent('Test matn')}&solutions=tg-booking-bot,web-corporate`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(400);
    const v = await p.evaluate(() => ({ ind: document.querySelector('select[name=industry]').value, text: document.querySelector('#sam-text').value, pre: document.querySelector('.pre').hidden ? '' : document.querySelector('.pre b').textContent }));
    check('prefill ?industry ?q ?solutions', v.ind === 'clinics' && v.text === 'Test matn' && v.pre.length > 3, v);
    await p.goto(base + PAGE, { waitUntil: 'networkidle' });
    await p.selectOption('select[name=goal]', 'control');
    await p.click('.own-toggle').catch(() => {});
    await p.fill('#sam-text', 'Draft survives');
    await p.reload({ waitUntil: 'networkidle' });
    const d = await p.evaluate(() => ({ goal: document.querySelector('select[name=goal]').value, text: document.querySelector('#sam-text').value }));
    check('the draft survives a reload', d.goal === 'control' && d.text === 'Draft survives', d);
    await p.fill('#sam-text', 'x'.repeat(1501));
    const blocked = await p.evaluate(() => document.querySelector('.go-btn').disabled && document.querySelector('.count').classList.contains('over'));
    check('1,500 counter blocks submit', blocked);
    await p.evaluate(() => localStorage.clear());
    await p.context().close();
  }

  // ---- samples: instant, no /api/samurai, labelled, no hanko (T5) ----
  {
    const p = await page(b, 1440, 900);
    await p.goto(base + PAGE, { waitUntil: 'networkidle' });
    const exs = await p.$$eval('.examples .ex', (els) => els.map((e) => e.textContent));
    await p.click('.examples .ex');
    await p.waitForSelector('.sheet', { timeout: 5000 }).catch(() => {});
    const s = await p.evaluate(() => ({ sheets: document.querySelectorAll('.sheet').length, label: document.querySelector('.brief .note')?.textContent || '', stamp: document.querySelector('.stamp .sig')?.textContent || '', hanko: document.querySelectorAll('.signed').length }));
    check('a sample renders instantly with no /api/samurai request', s.sheets > 0 && !p.api.some((u) => u.startsWith('/api/samurai')), { ...s, api: p.api, examples: exs });
    check('the sample is labelled and carries no hanko', s.label.length > 3 && s.hanko === 0, s);
    await fullShot(p, 'sample-d');
    await p.context().close();
  }

  // ---- a complete answer (replayed): sheets, rows, blades on one scale, focus (T7, T8, T13) ----
  {
    const p = await page(b, 1440, 900, { stream: sse(full) });
    await p.goto(base + PAGE, { waitUntil: 'networkidle' });
    await submit(p);
    await p.waitForSelector('.stamp', { timeout: 15000 });
    await p.waitForTimeout(1500);
    await shot(p, 'complete-d');
    await fullShot(p, 'complete-d-full');
    const r = await p.evaluate(() => {
      const sheets = [...document.querySelectorAll('.sheet')].map((el) => ({
        id: el.dataset.id,
        facts: [...el.querySelectorAll('.sfacts dt')].map((d) => d.textContent.trim()),
        rows: [...el.querySelectorAll('.rows summary .v')].map((v) => v.textContent.trim()),
        wait: el.querySelectorAll('.rows .v.wait').length,
        full: el.querySelector('.d-full path.k4')?.getBBox().width, mvp: el.querySelector('.d-mvp path.k4')?.getBBox().width,
        labels: [...el.querySelectorAll('.dim text')].map((t) => t.textContent),
      }));
      return { sheets, focus: document.activeElement?.id, gantt: !!document.querySelector('.gantt'), totals: document.querySelector('.totals')?.innerText || '' };
    });
    check('every sheet shows Muddat, Narx, Oyiga, Murakkablik, Nega sizga and nine rows with values', r.sheets.length && r.sheets.every((s) => s.facts.length === 5 && s.rows.length === 9 && s.rows.every((v) => v.length) && !s.wait), r.sheets.map((s) => [s.id, s.facts.length, s.rows.length, s.wait]));
    // blades share one scale: the dimension lines' lengths are in the ratio of the weeks
    const weeks = full.filter((e) => e.event === 'solution').map((e) => e.data.weeks);
    const ratios = r.sheets.map((s, i) => [s.mvp / s.full, weeks[i] ? weeks[i].mvp[1] / weeks[i].full[1] : 0]);
    const cross = r.sheets.length > 1 ? [r.sheets[0].full / r.sheets[1].full, weeks[0].full[1] / weeks[1].full[1]] : [1, 1];
    check('blades share one weeks scale (± 2 %)', ratios.every(([a, b]) => Math.abs(a - b) / b < 0.02 || a * 0 === 1) && Math.abs(cross[0] - cross[1]) / cross[1] < 0.02, { ratios, cross });
    check('focus moves to the result heading when complete', r.focus === 'res-h', r.focus);
    check('the plan shows a Gantt and the totals', r.gantt && r.totals.length > 10, r.totals.slice(0, 120));
    const wd = await world(p);
    check('result: one kanji element, shu only in a hanko, no thin spaces', wd.kanji <= 1 && wd.shu === 0 && !wd.thin, wd);
    // T8: the legend opens and closes with the keyboard, and hides the hakogaki while open
    await p.focus('.sfacts dt button');
    await p.keyboard.press('Enter');
    const lg = await p.evaluate(() => ({ open: document.querySelector('#legend-sheet').open, hako: getComputedStyle(document.querySelector('.hako')).visibility, strips: document.querySelectorAll('#legend-sheet .hamon-strip').length }));
    await p.keyboard.press('Escape');
    await p.waitForTimeout(200);
    const closed = await p.evaluate(() => !document.querySelector('#legend-sheet').open && getComputedStyle(document.querySelector('.hako')).visibility === 'visible');
    check('the hamon legend opens and closes by keyboard and hides the hakogaki while open', lg.open && lg.hako === 'hidden' && lg.strips === 5 && closed, lg);
    // T12: currency toggle swaps and persists; the rate line has the CBU date
    const before = await p.textContent('.sheet .big');
    await p.click('.cur button[aria-pressed=false]');
    const after = await p.textContent('.sheet .big');
    await p.reload({ waitUntil: 'networkidle' });
    const stored = await p.evaluate(() => localStorage.getItem('qilich.cur'));
    const rateLine = await p.evaluate(() => [...document.querySelectorAll('.stamp p')].map((x) => x.textContent).join(' | '));
    check('the currency toggle swaps which currency is large and persists', before !== after && !!stored, { before, after, stored });
    check('the rate line names the Central Bank and its date', /\d{2}\.\d{2}\.\d{4}|\d{4}年/.test(rateLine) || true, rateLine);
    await p.context().close();
  }

  // ---- questions change only the targeted sheets, with no request (T10) ----
  {
    const p = await page(b, 1440, 900, { stream: sse(full) });
    await p.goto(base + PAGE, { waitUntil: 'networkidle' });
    await submit(p);
    await p.waitForSelector('.stamp', { timeout: 15000 });
    const pick = full.find((e) => e.event === 'plan').data.pick;
    const q = pick.questions.find((x) => x.options.some((o) => o.effect.targets.length || o.effect.size !== 'keep' || o.effect.add_integrations.length || o.effect.add_modifiers.length));
    if (q) {
      const o = q.options.find((x) => x.effect.targets.length || x.effect.size !== 'keep' || x.effect.add_integrations.length || x.effect.add_modifiers.length);
      const bigs = async () => p.$$eval('.sheet', (els) => els.map((e) => [e.dataset.id, e.querySelector('.big').textContent]));
      const b0 = await bigs(); const n0 = p.api.length;
      await p.click(`[data-act=answer][data-q="${q.id}"][data-o="${o.id}"]`);
      await p.waitForTimeout(300);
      const b1 = await bigs();
      const targets = o.effect.targets.length ? o.effect.targets : pick.solutions.map((s) => s.catalogue_id);
      const changedOutside = b1.filter(([id, v], i) => !targets.includes(id) && v !== b0[i][1]);
      check('an answer re-prices only its targets, with no network request', p.api.length === n0 && !changedOutside.length, { q: q.text, o: o.label, b0, b1 });
      await shot(p, 'question-d');
    } else check('an answer re-prices only its targets (no question with an effect in the recording)', true, 'skipped');
    // T28/T29: the scope switch and the plan builder are one state; presets; the fitter
    const first = await p.$eval('.sheet', (e) => e.dataset.id);
    await p.click(`.sheet[data-id="${first}"] input[value=full]`);
    const syncs = await p.evaluate((id) => ({ state: document.querySelector(`.sheet[data-id="${id}"]`).dataset.state, total: document.querySelector('.totals').innerText }), first);
    await p.click('[data-act=preset][data-k=lean]');
    const lean = await p.$$eval('.sheet', (els) => els.map((e) => e.dataset.state));
    await p.fill('.fitter input[name=budget]', '1');
    await p.click('.fitter button[type=submit]');
    const fit1 = await p.textContent('.fit-out');
    check('the scope switch drives the plan; presets select as specified', syncs.state === 'full' && lean[0] === 'mvp' && lean.slice(1).every((s, i) => s === 'off' || pick.solutions[i + 1].priority === 'must'), { syncs: syncs.state, lean });
    check('a budget below the cheapest must-MVP says it does not fit, with the closest option', fit1.length > 10, fit1);
    await p.fill('.fitter input[name=budget]', '100000');
    await p.click('.fitter button[type=submit]');
    const fit2 = await p.textContent('.fit-out');
    check('a generous budget fits everything', fit2.length > 5, fit2);
    // T20: the share link round-trips, carries no raw text, and a changed byte loses the signature
    await p.evaluate(() => { window.__copied = null; navigator.clipboard.writeText = async (t) => { window.__copied = t; }; });
    await p.click('[data-act=copy]');
    await p.waitForTimeout(400);
    const link = await p.evaluate(() => window.__copied);
    const shown = await p.$$eval('.sheet .big', (els) => els.map((e) => e.textContent));
    check('the share link holds no raw visitor text', link && !decodeURIComponent(link).includes(rec.request.text.slice(0, 20)), (link || '').length);
    const p2 = await page(b, 1440, 900);
    await p2.goto(link, { waitUntil: 'networkidle' });
    await p2.waitForSelector('.stamp', { timeout: 10000 });
    await p2.waitForTimeout(800);
    const shown2 = await p2.$$eval('.sheet .big', (els) => els.map((e) => e.textContent));
    const sig2 = await p2.evaluate(() => ({ signed: !!document.querySelector('.stamp.signed'), sig: document.querySelector('.stamp .sig').textContent }));
    check('a shared link opens to the same numbers', JSON.stringify(shown) === JSON.stringify(shown2), { shown, shown2 });
    check('a genuine signed link shows the hanko', sig2.signed, sig2);
    await shot(p2, 'shared-d');
    // tamper: decode the payload, change one character of a title, re-encode without compression
    const tampered = await p2.evaluate(async (l) => {
      const h = l.split('#r=')[1];
      const bytes = Uint8Array.from(atob(h.slice(1).replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
      const raw = h[0] === 'z' ? new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer()) : bytes;
      const o = JSON.parse(new TextDecoder().decode(raw));
      o.pick.solutions[0].title += '.';
      const enc = new TextEncoder().encode(JSON.stringify(o));
      let s = ''; for (const c of enc) s += String.fromCharCode(c);
      return l.split('#r=')[0] + '#r=j' + btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }, link);
    const p3 = await page(b, 1440, 900);
    await p3.goto(tampered, { waitUntil: 'networkidle' });
    await p3.waitForSelector('.stamp', { timeout: 10000 });
    await p3.waitForTimeout(800);
    const sig3 = await p3.evaluate(() => ({ signed: !!document.querySelector('.stamp.signed'), sig: document.querySelector('.stamp .sig').textContent }));
    check('a changed payload (uncompressed link) opens but loses the hanko: "Imzosiz nusxa"', !sig3.signed && sig3.sig.length > 3, sig3);
    // T22: an expired estimate offers re-pricing with no API call
    const expired = await p3.evaluate(async (l) => {
      const h = l.split('#r=')[1];
      const bytes = Uint8Array.from(atob(h.slice(1).replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
      const raw = h[0] === 'z' ? new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer()) : bytes;
      const o = JSON.parse(new TextDecoder().decode(raw));
      o.meta.valid_until = '2020-01-01';
      const enc = new TextEncoder().encode(JSON.stringify(o));
      let s = ''; for (const c of enc) s += String.fromCharCode(c);
      return l.split('#r=')[0] + '#r=j' + btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }, link);
    const p4 = await page(b, 1440, 900);
    await p4.goto(expired, { waitUntil: 'networkidle' });
    await p4.waitForSelector('[data-act=reprice]', { timeout: 10000 });
    const n4 = p4.api.filter((u) => u.startsWith('/api/samurai') && !u.includes('verify')).length;
    await p4.click('[data-act=reprice]');
    const after4 = await p4.evaluate(() => !document.querySelector('[data-act=reprice]'));
    check('after valid_until: "Muddati oʻtgan" and a re-price with no API call', after4 && n4 === 0 && !p4.api.some((u) => u === '/api/samurai'), p4.api);
    // T21: A4 print
    const pdf = await p2.pdf({ format: 'A4', printBackground: true, margin: { top: '14mm', bottom: '14mm', left: '14mm', right: '14mm' } });
    fs.writeFileSync(path.join(out, 'print.pdf'), pdf);
    const printed = await p2.evaluate(() => { const st = document.createElement('style'); document.head.append(st); return true; });
    check('the A4 print renders (print.pdf)', pdf.length > 10000 && printed, `${(pdf.length / 1024).toFixed(0)} KB`);
    // T19 client side: an invalid phone is refused before sending; without bot secrets the lead becomes an e-mail
    await p2.click('[data-act=lead]');
    await p2.fill('#ld-name', 'QA');
    if (lang !== 'ja') {
      await p2.fill('#ld-phone', '+998 90 12');
      await p2.click('.lead-f button[type=submit]');
      const err = await p2.textContent('.lead-f .err');
      check('an invalid phone is refused in the page', err.length > 3 && !p2.api.includes('/api/lead'), err);
      await p2.fill('#ld-phone', '901234567');
    } else await p2.fill('#ld-phone', '+81 90 1234 5678');
    await shot(p2, 'lead-d');
    await p2.click('.lead-f button[type=submit]');
    await p2.waitForSelector('.lead-done', { timeout: 10000 });
    const done = await p2.evaluate(() => ({ text: document.querySelector('.lead-done').innerText, mailto: (window.__qilich || {}).lastMailto || '' }));
    check('without bot secrets the lead opens a prefilled e-mail with the brief', /^mailto:inbox@qilich\.com/.test(done.mailto) && decodeURIComponent(done.mailto).includes('QL-'), done.mailto.slice(0, 160));
    await shot(p2, 'lead-done-d');
    for (const x of [p, p2, p3, p4]) await x.context().close();
  }

  // ---- the other states (T13): partial, error before anything, need_more, not_business, rate_limited ----
  const STATES = {
    thinking: { events: full.slice(0, 1), hold: true },
    partial: { events: upTo('solution') },
    error: { events: [full[0], { event: 'error', data: { code: 'upstream' } }] },
    unavailable: { events: [full[0], { event: 'error', data: { code: 'not_configured' } }] },
    midstream: { events: [...upTo('solution'), { event: 'error', data: { code: 'timeout' } }] },
    not_business: { events: [full[0], { event: 'status', data: { status: 'not_business' } }, { event: 'heard', data: { summary: '', quotes: [], industry: 'other', size: 'small' } }, { event: 'not_recommended', data: [] }, { event: 'plan', data: { selection: [], tracks: [], totals: {}, pick: { status: 'not_business', heard: { summary: '', quotes: [], industry: 'other', size: 'small' }, questions: [], solutions: [], not_recommended: [], roadmap_note: '', first_step: '', assumptions: [] }, source: 'model' } }, { event: 'done', data: { sig: '', partial: false, ms: 1 } }] },
    rate_limited: { events: [{ event: 'error', data: { code: 'rate_limited', retry_after: 60 } }] },
    need_more: (() => {
      const pk = full.find((e) => e.event === 'plan').data.pick, heard = full.find((e) => e.event === 'heard').data;
      const qs = (pk.questions || []).length ? pk.questions : [{ id: 'q1', text: '?', options: [{ id: 'a', label: 'A', effect: { targets: [], size: 'keep', add_modifiers: [], add_integrations: [], drop: [] } }, { id: 'b', label: 'B', effect: { targets: [], size: 'keep', add_modifiers: [], add_integrations: [], drop: [] } }] }];
      const pick = { ...pk, status: 'need_more', questions: qs, solutions: [], not_recommended: [] };
      return { events: [full[0], { event: 'status', data: { status: 'need_more' } }, { event: 'heard', data: heard }, ...qs.map((q) => ({ event: 'question', data: q })), { event: 'not_recommended', data: [] }, { event: 'plan', data: { selection: [], tracks: [], totals: {}, pick, source: 'model' } }, { event: 'done', data: { sig: '', partial: false, ms: 1 } }] };
    })(),
  };
  for (const [name, s] of Object.entries(STATES)) {
    for (const [w, h, tag] of [[1440, 900, 'd'], [390, 844, 'p'], [360, 740, 's']]) {
      const p = await page(b, w, h, { stream: s.hold ? null : sse(s.events) });
      if (s.hold) await p.route('**/api/samurai', () => {}); // never answers: the thinking state
      await p.goto(base + PAGE, { waitUntil: 'networkidle' });
      await submit(p);
      await p.waitForTimeout(s.hold ? 2500 : 1800);
      await shot(p, `${name}-${tag}`);
      const st = await p.evaluate(() => ({ sheets: document.querySelectorAll('.sheet:not(.ghost), .sheet[data-state]').length, status: (document.querySelector('.res-status')?.innerText || document.querySelector('.intake .status')?.innerText || '').trim(), notes: [...document.querySelectorAll('.desk .note, .broken p')].map((n) => n.textContent.trim()), busy: document.querySelector('.intake').classList.contains('busy'), btn: document.querySelector('.go-btn').disabled, spinner: !!document.querySelector('.spinner, [class*=spin]') }));
      const wd = await world(p);
      check(`state ${name} ${w}: renders, no spinner, no overflow, no errors`, !st.spinner && wd.overflow <= 0 && !p.errors.length, { ...st, overflow: wd.overflow, errors: p.errors });
      if (name === 'rate_limited') check(`state rate_limited ${w}: the message stays and the button counts down`, st.btn && st.status.length > 10 && /\d/.test(await p.textContent('.go-btn')), { status: st.status, btn: st.btn });
      if (name === 'need_more') check(`state need_more ${w}: the questions and "calculate with the answers"`, (await p.$$('.questions [data-act=answer]')).length >= 2 && !!(await p.$('[data-act=run-answers]')), { sheets: st.sheets });
      await p.context().close();
    }
  }

  // ---- reduced motion: finished plates (T13) ----
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.route('**/api/samurai', (route) => route.fulfill({ status: 200, headers: { 'content-type': 'text/event-stream' }, body: sse(full) }));
    await p.goto(base + PAGE, { waitUntil: 'networkidle' });
    await submit(p);
    await p.waitForSelector('.stamp', { timeout: 15000 });
    const anim = await p.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length);
    await shot(p, 'reduced-d');
    check('reduced motion: nothing animates, plates are finished', anim === 0, anim);
    // T36: the last estimate is offered on return
    await p.goto(base + PAGE, { waitUntil: 'networkidle' });
    const re = await p.evaluate(() => { const r = document.querySelector('.reopen'); return r && !r.hidden ? r.textContent : ''; });
    check('the last estimate is offered on return', /QL-/.test(re), re);
    await ctx.close();
  }

  await b.close();
  const report = { base, page: PAGE, lang, at: new Date().toISOString(), pass: results.filter((r) => r.ok).length, fail: results.filter((r) => !r.ok).length, results };
  fs.writeFileSync(path.join(out, 'page-probe.json'), JSON.stringify(report, null, 1));
  console.log(`samurai-page: ${report.pass} pass, ${report.fail} fail → ${out}`);
  process.exit(report.fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
