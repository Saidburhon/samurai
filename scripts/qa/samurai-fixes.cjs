// SamurAI page probe for the B2a round-3 fixes (no model call; /api/samurai/verify and /api/lead are live):
//   A  the hanko and the quote underlines draw once: a height-only resize does not repaint, a currency switch or a
//      width change repaints them static, a full-page capture still shows the hanko (rv2a must-fix 1)
//   B  the outlined action button keeps its label on hover (desktop) and keeps no ink fill after a tap (phone)
//      (jb2a must-fix 3)
//   C  the question note says "narrows" only when the new range lies inside the old one (jb2a must-fix 4)
//   D  the lead's e-mail fallback (501, no bot) carries the estimate in the page's language, never the lead score
//      (rv2a must-fix 2)
//   E  no impact label names a currency (rv2a must-fix 3)
//   F  the printed plan table keeps every weeks and dates range on one line (jb2a must-fix 10)
// Usage: node scripts/qa/samurai-fixes.cjs <base with the signing key> <signed share URL> <outDir>
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');

const base = (process.argv[2] || 'http://127.0.0.1:8821').replace(/\/$/, '');
const signed = process.argv[3] || '';
const out = path.resolve(process.argv[4] || '.cache/qa/samurai-fixes');
fs.mkdirSync(out, { recursive: true });
const results = [];
const check = (name, ok, info = '') => { results.push({ name, ok: !!ok, info }); console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${info ? `  ${typeof info === 'string' ? info : JSON.stringify(info)}` : ''}`); };
const PAGE = { uz: '/samurai/', ru: '/ru/samurai/', en: '/en/samurai/', ja: '/ja/samurai/' };
const SAMPLES = ['clinic', 'restaurant', 'education', 'wholesale', 'beauty', 'freight'];
const phone = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

(async () => {
  const b = await chromium.launch();
  const local = (u) => u.replace(/^https?:\/\/[^/]+/, base);

  // ---- A: the hanko and the underlines draw once ----
  {
    const ctx = await b.newContext(phone);
    const p = await ctx.newPage();
    await p.goto(local(signed), { waitUntil: 'networkidle' });
    await p.waitForSelector('.stamp.signed .hanko', { timeout: 15000 });
    await p.waitForTimeout(1500);
    const state = () => p.evaluate(() => {
      const k = document.querySelector('.stamp.signed .hanko');
      const marks = [...document.querySelectorAll('.letter mark')];
      // a finished stamp keeps its filled animation in getAnimations(): only a running one is a replay
      return { hanko: !!k, kept: k?.dataset.probe === '1', still: k?.classList.contains('still'), anims: k ? k.getAnimations().filter((x) => x.playState === 'running').length : -1, opacity: k ? getComputedStyle(k).opacity : '', marksOn: marks.every((m) => m.classList.contains('on')), markAnims: marks.reduce((a, m) => a + m.getAnimations().filter((x) => x.playState === 'running').length, 0), n: marks.length };
    });
    await p.evaluate(() => { document.querySelector('.stamp.signed .hanko').dataset.probe = '1'; });
    await p.setViewportSize({ width: 390, height: 760 }); // the URL bar collapses: only the height changes
    await p.waitForTimeout(600);
    const h = await state();
    check('A height-only resize repaints nothing: the same hanko, no animation', h.kept && h.anims === 0 && h.opacity === '1', h);
    await p.click('.cur button[aria-pressed="false"]');
    await p.waitForTimeout(60);
    const c = await state();
    check('A a currency switch repaints the hanko static (no stamp replay) and the underlines drawn', c.hanko && !c.kept && c.still && c.anims === 0 && c.opacity === '1' && c.marksOn && c.markAnims === 0, c);
    await p.setViewportSize({ width: 360, height: 760 });
    await p.waitForTimeout(500);
    const w = await state();
    check('A a width change repaints static too', w.still && w.anims === 0 && w.opacity === '1' && w.marksOn && w.markAnims === 0, w);
    await p.screenshot({ path: path.join(out, 'A-hanko-full-p.png'), fullPage: true });
    const f = await state();
    check('A after a full-page capture the hanko is fully inked', f.opacity === '1' && f.anims === 0, f);
    const box = await p.evaluate(() => { const r = document.querySelector('.stamp').getBoundingClientRect(); return { x: 0, y: r.top + scrollY - 10, width: innerWidth, height: r.height + 20 }; });
    await p.screenshot({ path: path.join(out, 'A-stamp-p.png'), fullPage: true, clip: box });
    await ctx.close();
  }

  // ---- B: the outlined button on hover (desktop) and after a tap (phone) ----
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
    const p = await ctx.newPage();
    await p.goto(local(signed), { waitUntil: 'networkidle' });
    await p.waitForSelector('.actions .btn:not(.solid)', { timeout: 15000 });
    const btn = p.locator('.actions .btn:not(.solid)');
    await btn.scrollIntoViewIfNeeded();
    await btn.hover();
    await p.waitForTimeout(700);
    const cs = await btn.evaluate((e) => ({ color: getComputedStyle(e).color, bg: getComputedStyle(e).backgroundColor, label: e.textContent.trim() }));
    check('B desktop hover: the label stays readable (washi on sumi)', cs.color !== cs.bg && /236, 230, 218/.test(cs.color) && /15, 14, 12/.test(cs.bg), cs);
    const r = await btn.boundingBox();
    await p.screenshot({ path: path.join(out, 'B-hover-share-d.png'), clip: { x: Math.max(0, r.x - 260), y: r.y - 30, width: 700, height: r.height + 60 } });
    await ctx.close();
    const pc = await b.newContext(phone);
    const pp = await pc.newPage();
    await pp.goto(local(signed), { waitUntil: 'networkidle' });
    await pp.waitForSelector('.actions .btn:not(.solid)', { timeout: 15000 });
    await pp.evaluate(() => { navigator.share = undefined; });
    const pb = pp.locator('.actions .btn:not(.solid)');
    await pb.scrollIntoViewIfNeeded();
    await pb.tap();
    await pp.waitForTimeout(700);
    const ps = await pb.evaluate((e) => ({ hoverMedia: matchMedia('(hover: hover)').matches, color: getComputedStyle(e).color, bg: getComputedStyle(e).backgroundColor }));
    check('B phone tap: no ink fill stays behind, the label reads', ps.color !== ps.bg && !/15, 14, 12/.test(ps.bg), ps);
    const pr = await pb.boundingBox();
    await pp.screenshot({ path: path.join(out, 'B-tap-share-p.png'), clip: { x: 0, y: Math.max(0, pr.y - 40), width: 390, height: pr.height + 80 } });
    await pc.close();
  }

  // ---- C: the question note tells the truth, on every sample with questions ----
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    const parse = (s, lang) => {
      // one side of the note: "335–495 mln soʻm", "$1 500–2 500", "UZS 38–52 mln", "3,000〜4,100ドル", "3,800万〜5,200万スム"
      const unit = /mln|млн/.test(s) ? 1e6 : /ming|тыс|thousand/.test(s) ? 1e3 : 1;
      const nums = s.split(/[–〜]/).map((x) => {
        let t = x.replace(/[^\d.,万億\u00a0 ]/g, '').trim();
        if (/[万億]/.test(t)) { const q = t.replace(/[,\u00a0 ]/g, '').match(/(?:(\d+)億)?(?:(\d+)万)?/); return ((Number(q[1]) || 0) * 1e8 + (Number(q[2]) || 0) * 1e4) * unit; }
        t = lang === 'en' || lang === 'ja' ? t.replace(/,/g, '') : t.replace(/[\u00a0 ]/g, '').replace(',', '.');
        return Number(t) * unit;
      });
      return nums.length === 2 ? nums : [nums[0], nums[0]];
    };
    let notes = 0, wrong = [];
    for (const lang of ['uz', 'ru', 'en', 'ja']) for (const id of SAMPLES) {
      await p.goto(`${base}${PAGE[lang]}?sample=${id}`, { waitUntil: 'networkidle' });
      await p.waitForSelector('.sheet', { timeout: 10000 }).catch(() => null);
      const S = await p.evaluate(() => JSON.parse(document.getElementById('sam-strings').textContent));
      const opts = await p.$$eval('.qopts button', (bs) => bs.map((x) => [x.dataset.q, x.dataset.o]));
      for (const [q, o] of opts) {
        await p.click(`.qopts button[data-q="${q}"][data-o="${o}"]`);
        await p.waitForTimeout(120);
        const { t, sides } = await p.evaluate(() => { const q = document.querySelector('.qnote'); return { t: q?.textContent.replace(/\s+/g, ' ').trim() || '', sides: q ? [...q.querySelectorAll('.nw')].map((x) => x.textContent) : [] }; });
        if (!t) continue;
        notes++;
        const narrowS = S.narrow.replace(/ · /g, ' · '), changedS = S.changed;
        const label = t.startsWith(narrowS) ? 'narrow' : t.startsWith(changedS) ? 'changed' : '?';
        const rest = t.slice((label === 'narrow' ? narrowS : changedS).length).trim();
        // the note is "<label> <from> <kissaki svg> <to>": the svg has no text, so the two ranges are split by spaces
        // the two ranges are the note's two nowrap spans ("<label> <from> <kissaki> <to>")
        const a = sides.length === 2 ? parse(sides[0], lang) : null, z = sides.length === 2 ? parse(sides[1], lang) : null;
        void rest;
        const narrows = a && z && z[0] >= a[0] && z[1] <= a[1] && z[1] - z[0] < a[1] - a[0];
        if (!a || label === '?' || (narrows ? label !== 'narrow' : label !== 'changed')) wrong.push({ lang, id, q, o, t, a, z });
      }
      if (lang === 'uz' && id === 'clinic') await p.screenshot({ path: path.join(out, 'C-question-d.png') });
    }
    check('C every question note says "narrows" only for a range inside the old one, otherwise "changed"', notes > 0 && !wrong.length, { notes, wrong: wrong.slice(0, 4) });
    await ctx.close();
  }

  // ---- D: the lead's e-mail fallback without a bot (501) ----
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', (e) => errs.push(String(e)));
    await p.goto(`${base}/ru/samurai/?sample=clinic`, { waitUntil: 'networkidle' });
    await p.waitForSelector('[data-act="lead"]', { timeout: 10000 });
    await p.click('[data-act="lead"]');
    await p.fill('#ld-name', 'Азиз');
    await p.fill('#ld-phone', '+998 90 123 45 67');
    const resp = p.waitForResponse((r) => r.url().endsWith('/api/lead'), { timeout: 15000 });
    await p.click('.lead-f button[type=submit]');
    const r = await resp;
    const body = await r.json().catch(() => ({}));
    await p.waitForSelector('.lead-done', { timeout: 10000 }).catch(() => null);
    const href = await p.evaluate(() => window.__qilich?.lastMailto || '');
    const mail = decodeURIComponent((href.split('body=')[1] || '').replace(/\+/g, ' '));
    fs.writeFileSync(path.join(out, 'D-mailto.txt'), `${r.status()}\n${JSON.stringify(body, null, 1)}\n---\n${mail}\n`);
    check('D without a bot: 501, and neither the server text nor the visitor e-mail carries the lead score or its reasons', r.status() === 501 && !/ISSIQ|ILIQ|SOVUQ|Sabab/.test(String(body.text || '')) && !/ISSIQ|ILIQ|SOVUQ|Sabab/.test(mail) && /Смета/.test(mail) && !errs.length, { status: r.status(), mailStart: mail.slice(0, 80), errs });
    await p.screenshot({ path: path.join(out, 'D-lead-done-d.png') });
    await ctx.close();
  }

  // ---- E: impact labels without a currency, every sample ----
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    const bad = [];
    for (const lang of ['uz', 'ru', 'en', 'ja']) for (const id of SAMPLES) {
      await p.goto(`${base}${PAGE[lang]}?sample=${id}`, { waitUntil: 'networkidle' });
      await p.waitForSelector('.sheet', { timeout: 10000 }).catch(() => null);
      await p.evaluate(() => document.querySelectorAll('.result details').forEach((d) => (d.open = true)));
      const labels = await p.$$eval('.formula label', (ls) => ls.map((l) => l.childNodes[0]?.textContent.trim() || ''));
      for (const l of labels) if (/USD|\$|dollar|доллар|ドル|so[ʻ']m\b|\bсум\b/i.test(l)) bad.push(`${lang}/${id}: ${l}`);
    }
    check('E no impact label names a currency (the unit tag carries it)', !bad.length, bad.slice(0, 5));
    await ctx.close();
  }

  // ---- F: the printed plan table, Russian (the longest ranges) ----
  {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(`${base}/ru/samurai/?sample=clinic`, { waitUntil: 'networkidle' });
    await p.waitForSelector('.gantt-table', { state: 'attached', timeout: 10000 });
    await p.emulateMedia({ media: 'print' });
    await p.waitForTimeout(300);
    const cells = await p.$$eval('.gantt-table td.nw', (ts) => ts.map((t) => ({ t: t.textContent, lines: Math.round(t.getBoundingClientRect().height / parseFloat(getComputedStyle(t).lineHeight || '14')) })));
    const broken = cells.filter((c) => c.lines > 1.4 + 0.6 /* padding */ && c.t.length);
    const singular = cells.filter((c) => /[–,]\d*\s*неделя\b|\d,\d\s*неделя\b/.test(c.t)).map((c) => c.t);
    check('F print: every weeks and dates cell of the plan table on one line, ranges in the plural', cells.length > 0 && !broken.length && !singular.length, { cells: cells.length, broken: broken.slice(0, 3), singular });
    await p.pdf({ path: path.join(out, 'F-print-ru.pdf'), format: 'A4', printBackground: true });
    try { execFileSync('pdftoppm', ['-r', '110', '-png', path.join(out, 'F-print-ru.pdf'), path.join(out, 'F-print-ru')]); } catch (e) { console.log('pdftoppm:', e.message); }
    await ctx.close();
  }

  await b.close();
  const pass = results.filter((x) => x.ok).length;
  fs.writeFileSync(path.join(out, 'fixes-probe.json'), JSON.stringify({ at: new Date().toISOString(), base, pass, total: results.length, results }, null, 1));
  console.log(`samurai-fixes: ${pass}/${results.length} → ${out}`);
  process.exit(pass === results.length ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(2); });
