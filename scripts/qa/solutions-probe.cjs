// solutions-probe (gate B2b): the Solutions pages in a real browser (global Playwright, the capture's SwiftShader flags).
//   - first screens (and a few scroll positions) of the catalogue, a group page, a solution page and the price list
//     at 1440 × 900 (DPR 0.75), 390 × 844 and 360 × 740 (DPR 1.5); per page: zero console errors, no failed request,
//     no horizontal overflow, one h1, no element of an icon font, no WebGL canvas
//   - JavaScript off: every catalogue entry is a real <li> with its <details> (T14), group rows open
//   - search across scripts (T15): "бот", "бот для заказов", "ўқув маркази", "o'quv markazi" find the right rows
//   - the industry lens re-orders without removing rows and shows the starter line with its range; URL state
//     round-trips (a reload with the query restores the lens)
//   - sort: the rows' order changes; a row opens and gets its sheet from the rows file
//   - the basket (T30): add two rows, the tray's total equals plan() from the engine in Node, survives a reload and a
//     move to a solution page, "SamurAI tekshirsin" carries the ids, the tray never covers the footer's contacts
// Usage: node scripts/qa/solutions-probe.cjs [base=http://localhost:8830] [outDir=.cache/qa/solutions]
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { chromium } = require(execSync('npm root -g').toString().trim() + '/playwright');

const args = process.argv.slice(2);
const base = (args[0] || 'http://localhost:8830').replace(/\/$/, '');
const out = path.resolve(args[1] || '.cache/qa/solutions');
fs.mkdirSync(out, { recursive: true });
const VIEWS = { d1440: { width: 1440, height: 900, dpr: 0.75 }, p390: { width: 390, height: 844, dpr: 1.5, phone: true }, p360: { width: 360, height: 740, dpr: 1.5, phone: true } };
const PAGES = [
  ['cat-uz', '/yechimlar/'], ['cat-ru', '/ru/resheniya/'], ['cat-ja', '/ja/solutions/'],
  ['grp-uz', '/yechimlar/telegram/'], ['grp-en', '/en/solutions/business/'],
  ['sol-uz', '/yechimlar/tg-order-bot/'], ['sol-ru', '/ru/resheniya/ai-telegram-support-account/'], ['sol-ja', '/ja/solutions/web-corporate/'],
  ['price-uz', '/narxlar/'], ['price-ja', '/ja/prices/'],
];
const fails = [], notes = [];
const fail = (w, m) => fails.push(`${w}: ${m}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctxFor = (v, js = true) => browser.newContext({ viewport: { width: v.width, height: v.height }, deviceScaleFactor: v.dpr, isMobile: !!v.phone, hasTouch: !!v.phone, javaScriptEnabled: js, reducedMotion: 'no-preference' });

  // ---- every page × view: errors, overflow, h1, screenshots ----
  for (const [vk, v] of Object.entries(VIEWS)) {
    const ctx = await ctxFor(v);
    for (const [name, p] of PAGES) {
      if (vk === 'p360' && !/^(cat-uz|sol-ru|price-uz|grp-uz)$/.test(name)) continue;
      const page = await ctx.newPage();
      const errs = [];
      page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
      page.on('pageerror', (e) => errs.push(String(e)));
      page.on('requestfailed', (r) => errs.push(`failed ${r.url()}`));
      page.on('response', (r) => { if (r.status() >= 400) errs.push(`${r.status()} ${r.url()}`); });
      await page.goto(base + p, { waitUntil: 'networkidle' });
      await sleep(400);
      const m = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        h1: document.querySelectorAll('h1').length,
        canvas: document.querySelectorAll('canvas').length,
        small: [...document.querySelectorAll('main *')].filter((e) => e.childNodes.length && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && e.offsetParent && parseFloat(getComputedStyle(e).fontSize) < 12).map((e) => `${e.tagName}.${e.className}`).slice(0, 5),
      }));
      if (m.overflow > 1) fail(`${name} ${vk}`, `horizontal overflow ${m.overflow}px`);
      if (m.h1 !== 1) fail(`${name} ${vk}`, `${m.h1} h1`);
      if (m.canvas) fail(`${name} ${vk}`, 'a canvas');
      if (m.small.length) fail(`${name} ${vk}`, `text under 12 px: ${m.small.join(', ')}`);
      if (errs.length) fail(`${name} ${vk}`, errs.slice(0, 3).join(' | '));
      await page.screenshot({ path: path.join(out, `${name}-${vk}-0.png`) });
      if (vk !== 'p360') {
        const H = await page.evaluate(() => document.documentElement.scrollHeight);
        for (const f of [0.18, 0.45]) {
          await page.evaluate((y) => scrollTo(0, y), Math.round(H * f));
          await sleep(500);
          await page.screenshot({ path: path.join(out, `${name}-${vk}-${Math.round(f * 100)}.png`) });
        }
      }
      await page.close();
    }
    await ctx.close();
  }

  // ---- JavaScript off: the register is real HTML ----
  {
    const ctx = await ctxFor(VIEWS.d1440, false);
    const page = await ctx.newPage();
    await page.goto(base + '/yechimlar/');
    const r = await page.evaluate(() => ({ rows: document.querySelectorAll('li.sr details summary h3').length, chaps: document.querySelectorAll('.chap').length }));
    if (r.rows !== 158) fail('js-off catalogue', `${r.rows} rows (158 expected)`);
    notes.push(`JS off: ${r.rows} rows in ${r.chaps} chapters`);
    await page.click('li.sr summary');
    const open = await page.evaluate(() => document.querySelector('li.sr details').open);
    if (!open) fail('js-off catalogue', 'a row does not open');
    await page.goto(base + '/yechimlar/telegram/');
    const g = await page.evaluate(() => [...document.querySelectorAll('li.sr details')].filter((d) => d.open && d.querySelector('.sheet > div')).length);
    notes.push(`JS off: group page rows open with their sheet: ${g}`);
    if (!g) fail('js-off group', 'rows not open with a sheet');
    await ctx.close();
  }

  // ---- lens, search, sort, rows file (uz catalogue, desktop) ----
  {
    const ctx = await ctxFor(VIEWS.d1440);
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(String(e)));
    await page.goto(base + '/yechimlar/', { waitUntil: 'networkidle' });
    await sleep(600);
    const visible = () => page.evaluate(() => [...document.querySelectorAll('li.sr')].filter((r) => !r.hidden && r.closest('.chap') && !r.closest('.chap').hidden).map((r) => r.dataset.id));
    const search = async (q) => { await page.fill('.lens input[name=q]', q); await sleep(700); return visible(); };
    for (const [q, want] of [['бот', 'tg-order-bot'], ['бот для заказов', 'tg-order-bot'], ['ўқув маркази', null], ["o'quv markazi", null]]) {
      const ids = await search(q);
      const wantIds = want ? [want] : ids.filter((id) => /edu|school|course|learning/.test(id));
      notes.push(`search «${q}»: ${ids.length} rows (${ids.slice(0, 6).join(', ')})`);
      if (!ids.length) fail('search', `«${q}» finds nothing`);
      if (want && !ids.includes(want)) fail('search', `«${q}» does not find ${want}`);
      if (!want && !wantIds.length) fail('search', `«${q}» finds no education rows`);
    }
    const a = await search('ўқув маркази'), b = await search("o'quv markazi");
    if (a.join() !== b.join()) fail('search', 'Cyrillic and Latin Uzbek give different rows');
    await page.screenshot({ path: path.join(out, 'lens-search-d1440.png') });
    await page.fill('.lens input[name=q]', '');
    await sleep(500);
    // industry lens
    await page.selectOption('.lens select[name=industry]', 'restaurants');
    await sleep(900);
    const lens = await page.evaluate(() => ({
      shown: [...document.querySelectorAll('li.sr')].filter((r) => !r.hidden).length,
      dim: document.querySelectorAll('li.sr.dim').length,
      starter: document.querySelector('.starter')?.textContent || '',
      url: location.search,
      firstTg: [...document.querySelector('.chap[data-g=telegram] ol').children].slice(0, 3).map((li) => `${li.dataset.id}${li.classList.contains('dim') ? '(dim)' : ''}`),
    }));
    notes.push(`industry lens restaurants: ${lens.shown} rows shown, ${lens.dim} dimmed, starter «${lens.starter.slice(0, 160)}», url ${lens.url}, telegram chapter starts ${lens.firstTg.join(', ')}`);
    if (lens.shown !== 158) fail('lens', `the industry lens removed rows (${lens.shown})`);
    if (!lens.dim || !lens.starter.includes('birgalikda')) fail('lens', 'no dimming or no starter line with its range');
    if (!lens.url.includes('industry=restaurants')) fail('lens', 'the URL does not hold the lens');
    await page.evaluate(() => scrollTo(0, document.querySelector('.lens').getBoundingClientRect().top + scrollY - 90));
    await sleep(500);
    await page.screenshot({ path: path.join(out, 'lens-industry-d1440.png') });
    // URL round trip
    await page.goto(base + '/yechimlar/?industry=restaurants&budget=50000000&sort=price', { waitUntil: 'networkidle' });
    await sleep(800);
    const rt = await page.evaluate(() => ({ ind: document.querySelector('.lens select[name=industry]').value, bud: document.querySelector('.lens select[name=budget]').value, sort: document.querySelector('.sort [aria-pressed=true]')?.dataset.sort, shown: [...document.querySelectorAll('li.sr')].filter((r) => !r.hidden).length }));
    notes.push(`URL round trip: ${JSON.stringify(rt)}`);
    if (rt.ind !== 'restaurants' || rt.bud !== '50000000' || rt.sort !== 'price') fail('url', 'the state does not round-trip');
    // sort
    await page.goto(base + '/yechimlar/', { waitUntil: 'networkidle' });
    await sleep(500);
    const order = () => page.evaluate(() => [...document.querySelector('.chap[data-g=web] ol').children].map((li) => li.dataset.id).join(','));
    const o1 = await order();
    await page.click('.sort [data-sort=price]');
    await sleep(700);
    const o2 = await order();
    const sortedOk = await page.evaluate(() => { const p = [...document.querySelector('.chap[data-g=web] ol').children].map((li) => +li.dataset.p); return p.every((x, i) => !i || p[i - 1] <= x); });
    if (o1 === o2 || !sortedOk) fail('sort', 'price sort does not order the rows');
    // a row opens with its sheet from the rows file
    await page.click('.chap[data-g=web] li.sr summary');
    await sleep(900);
    const sheet = await page.evaluate(() => { const li = document.querySelector('.chap[data-g=web] li.sr'); return { rows: li.querySelectorAll('.sheet > div').length, links: li.querySelectorAll('.sr-a a').length }; });
    notes.push(`opened row: ${sheet.rows} sheet rows, ${sheet.links} links`);
    if (sheet.rows < 2 || sheet.links < 2) fail('row', 'an opened row has no sheet from the rows file');
    await page.screenshot({ path: path.join(out, 'row-open-d1440.png') });
    if (errs.length) fail('catalogue interactions', errs.join(' | '));
    await ctx.close();
  }

  // ---- the basket ----
  {
    const engine = await import(path.resolve('src/solutions/engine.js'));
    const ctx = await ctxFor(VIEWS.p390);
    const page = await ctx.newPage();
    await page.goto(base + '/yechimlar/', { waitUntil: 'networkidle' });
    await sleep(500);
    await page.click('li.sr[data-id="tg-order-bot"] button.add');
    await page.click('li.sr[data-id="web-ecommerce"] button.add');
    await sleep(1200);
    const tray = await page.evaluate(() => ({ hidden: document.getElementById('tray').hidden, text: document.querySelector('#tray .tr-bar')?.textContent || '', basket: localStorage.getItem('qilich.basket') }));
    // the engine in Node, with the page's own data file and rate
    const cfg = await page.evaluate(() => JSON.parse(document.getElementById('sol-data').textContent));
    const data = await (await fetch(base + cfg.data)).json();
    const { expand } = await import(path.resolve('src/shared/catalogue.js'));
    const want = engine.totals(expand(data), JSON.parse(tray.basket), 'uz', cfg.rate);
    notes.push(`basket tray: «${tray.text.replace(/\s+/g, ' ').trim()}»; engine: ${want.price[0]} · ${want.weeks}`);
    if (tray.hidden || !tray.text.includes(want.price[0]) || !tray.text.includes(want.weeks)) fail('basket', 'the tray total differs from plan()');
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    await sleep(700);
    const cover = await page.evaluate(() => { const t = document.getElementById('tray').getBoundingClientRect(), a = document.querySelector('.foot .annot').getBoundingClientRect(); return { trayBottom: t.bottom, annotTop: a.top, overlap: t.bottom > a.top && t.top < a.bottom }; });
    if (cover.overlap) fail('basket', 'the tray covers the footer contacts');
    await page.screenshot({ path: path.join(out, 'basket-footer-p390.png') });
    await page.evaluate(() => scrollTo(0, 900));
    await page.click('#tray .tr-tg');
    await sleep(800);
    await page.screenshot({ path: path.join(out, 'basket-open-p390.png') });
    const href = await page.evaluate(() => document.querySelector('#tray .tr-acts a.btn')?.getAttribute('href'));
    if (!/solutions=tg-order-bot,web-ecommerce/.test(href || '')) fail('basket', `"SamurAI tekshirsin" goes to ${href}`);
    await page.goto(base + '/yechimlar/tg-order-bot/', { waitUntil: 'networkidle' });
    await sleep(1000);
    const sol = await page.evaluate(() => ({ pressed: document.querySelector('.acts button.add')?.getAttribute('aria-pressed'), tray: !document.getElementById('tray').hidden }));
    if (sol.pressed !== 'true' || !sol.tray) fail('basket', 'the basket does not carry to a solution page');
    await page.screenshot({ path: path.join(out, 'basket-solution-p390.png') });
    await page.reload({ waitUntil: 'networkidle' });
    await sleep(800);
    const again = await page.evaluate(() => !document.getElementById('tray').hidden && document.querySelector('#tray .tr-nl')?.textContent);
    if (!again) fail('basket', 'the basket does not survive a reload');
    notes.push(`basket after reload on a solution page: ${again}`);
    await ctx.close();
  }
  await browser.close();
  const report = { base, at: new Date().toISOString(), fails, notes };
  fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 1));
  for (const n of notes) console.log('  note  ' + n);
  for (const f of fails) console.log('  FAIL  ' + f);
  console.log(fails.length ? `solutions-probe: ${fails.length} failure(s)` : 'solutions-probe: ok');
  process.exit(fails.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
