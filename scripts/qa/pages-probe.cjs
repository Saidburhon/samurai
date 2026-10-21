// pages-probe (G0b): every page in a real browser (global Playwright, the capture's SwiftShader flags and DPRs).
//   - every page of the sitemaps, and the 404, at 1440 × 900 (DPR 0.75), 1280 × 720, 390 × 844 (DPR 1.5), 360 × 740:
//     zero console errors and warnings, no failed request, no horizontal overflow, no text clipped by its box,
//     exactly one h1, <html lang> as the URL says; the first screen saved for review
//   - the language switch: four names in their own script in the footer (and in the top bar at ≥ 1400 px)
//   - Japanese pages: the body font stack is the Japanese system gothic (Hiragino Sans, Noto Sans JP, Yu Gothic), and no
//     line of the words breaks inside a word (ja-split: a break that is neither an Intl.Segmenter word boundary nor an
//     authored <wbr>/<br>, e.g. まと／める, お問い／合わせ, 取り／扱い, 通／信事業者)
//   - JavaScript off: every page keeps its words; the contact form is a mailto form (post, text/plain) with the name,
//     the contact and the consent box required, and in the order a visitor meets it: the fields, the purpose of use,
//     the consent box, then the button (APPI: the purpose before the data is given)
//   - JavaScript on: the contact form refuses to send without consent, then opens a prefilled email (the mailto URL
//     is recorded in __qilich.lastMailto) and says so in its status line
//   - --analytics (a build with test IDs in content/site.json): no banner on the first screen, the banner after a
//     scroll, layout shift 0, nothing loaded before consent, gtag/Metrika requested after "allow", and the events
//     generate_lead, contact_click {method} and cta_click {page, lang}
// Usage: node scripts/qa/pages-probe.cjs [base=http://localhost:8810] [outDir=.cache/qa/pages] [--analytics]
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { chromium } = require(execSync('npm root -g').toString().trim() + '/playwright');

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const ANALYTICS = process.argv.includes('--analytics');
const base = (args[0] || 'http://localhost:8810').replace(/\/$/, '');
const out = path.resolve(args[1] || '.cache/qa/pages');
fs.mkdirSync(out, { recursive: true });
const VIEWS = {
  d1440: { width: 1440, height: 900, dpr: 0.75 }, d1280: { width: 1280, height: 720, dpr: 1 },
  p390: { width: 390, height: 844, dpr: 1.5, phone: true }, p360: { width: 360, height: 740, dpr: 1.5, phone: true },
};
const NAMES = { uz: 'Oʻzbekcha', ru: 'Русский', en: 'English', ja: '日本語' };
const langOf = (p) => (p.startsWith('/ru/') ? 'ru' : p.startsWith('/en/') ? 'en' : p.startsWith('/ja/') ? 'ja' : 'uz');
const fails = [], log = [];
const fail = (w, m) => { fails.push(`${w}: ${m}`); };
const ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];

async function sitemapPaths() {
  const idx = await (await fetch(base + '/sitemap.xml')).text();
  const paths = [];
  for (const m of idx.matchAll(/<loc>https:\/\/qilich\.com([^<]+)<\/loc>/g)) {
    const sm = await (await fetch(base + m[1])).text();
    for (const u of sm.matchAll(/<loc>https:\/\/qilich\.com([^<]+)<\/loc>/g)) paths.push(u[1]);
  }
  return paths;
}

// Japanese: every line break inside the words of the page, by character rects; a break that is not a word boundary
function jaSplits() {
  const seg = new Intl.Segmenter('ja', { granularity: 'word' });
  const SEL = ':is(main h1, main h2, main h3, main p, main li, main dt, main dd, main label, main figcaption, .c-note)';
  const out = [];
  for (const el of document.querySelectorAll(SEL)) {
    if (!el.getClientRects().length || el.parentElement.closest(SEL) || el.closest('[hidden], .sprite, #strings')) continue;
    const chars = []; let mark = true;
    const tw = document.createTreeWalker(el, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    for (let n = tw.nextNode(); n; n = tw.nextNode()) {
      if (n.nodeType === 1) { if (n.tagName === 'WBR' || n.tagName === 'BR') mark = true; continue; }
      for (let i = 0; i < n.length; i++) {
        const rg = document.createRange(); rg.setStart(n, i); rg.setEnd(n, i + 1);
        const q = [...rg.getClientRects()].find((x) => x.width > 0);
        chars.push({ c: n.data[i], top: q ? q.top : null, h: q ? q.height : 0, mark }); mark = false;
      }
    }
    const text = chars.map((x) => x.c).join('');
    if (!/[\u3040-\u30ff\u4e00-\u9fff]/.test(text)) continue;
    const bounds = new Set();
    for (const s of seg.segment(text)) { bounds.add(s.index); bounds.add(s.index + s.segment.length); }
    let prev = null, space = false;
    chars.forEach((x, i) => {
      if (x.top === null || /\s/.test(x.c)) { if (/\s/.test(x.c)) space = true; return; }
      if (prev && Math.abs(x.top - prev.top) > x.h * 0.5 && !space && !x.mark && !bounds.has(i)) out.push(`${text.slice(Math.max(0, i - 8), i)}／${text.slice(i, i + 6)}`);
      if (!prev || Math.abs(x.top - prev.top) > x.h * 0.5) prev = x;
      space = false;
    });
  }
  return out;
}

async function inspect(page) {
  return page.evaluate(() => {
    const d = document.documentElement;
    const clipped = [];
    for (const el of document.querySelectorAll('body *')) {
      if (!el.getClientRects().length || el.closest('.sprite, #strings, [hidden], #stage, script, style')) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      if (/hidden|clip/.test(cs.overflowX) && el.scrollWidth > el.clientWidth + 2 && el.textContent.trim() && !el.matches('.grain, .sheet-menu, .toast')) clipped.push(`${el.tagName.toLowerCase()}.${el.className} «${el.textContent.trim().slice(0, 32)}»`);
    }
    const vis = (sel) => [...document.querySelectorAll(sel)].filter((e) => e.getClientRects().length && getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden').map((e) => e.textContent.trim());
    return {
      lang: d.lang, h1: document.querySelectorAll('h1').length, sw: d.scrollWidth, cw: d.clientWidth, clipped: clipped.slice(0, 6),
      footNames: vis('footer .lang .nm'), barNames: vis('.nav > .lang .nm'), barCodes: vis('.nav > .lang .cd'),
      font: getComputedStyle(document.body).fontFamily, text: document.body.innerText.length,
    };
  });
}

(async () => {
  const browser = await chromium.launch({ args: ARGS });
  const paths = await sitemapPaths();
  console.log(`pages-probe ${base}: ${paths.length} pages${ANALYTICS ? ' (analytics build)' : ''}`);

  if (!ANALYTICS) {
    // ---- every page × every view ----
    for (const [vn, v] of Object.entries(VIEWS)) {
      const ctx = await browser.newContext({ viewport: { width: v.width, height: v.height }, deviceScaleFactor: v.dpr, isMobile: !!v.phone, hasTouch: !!v.phone });
      for (const p of [...paths, '/404.html']) {
        const page = await ctx.newPage();
        const errs = [];
        page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errs.push(m.text()); });
        page.on('pageerror', (e) => errs.push(String(e)));
        page.on('response', (r) => { if (r.status() >= 400 && !r.url().endsWith('/404.html')) errs.push(`${r.status()} ${r.url()}`); });
        await page.goto(base + p, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(250);
        const i = await inspect(page);
        const w = `${p} @${vn}`;
        if (errs.length) fail(w, `console/network: ${errs.join(' | ')}`);
        if (i.sw > i.cw) fail(w, `horizontal overflow ${i.sw} > ${i.cw}`);
        if (i.clipped.length) fail(w, `clipped text: ${i.clipped.join('; ')}`);
        if (p !== '/404.html') {
          const lang = langOf(p);
          if (i.h1 !== 1) fail(w, `${i.h1} h1`);
          if (i.lang !== lang) fail(w, `lang ${i.lang}`);
          if (Object.values(NAMES).some((n) => !i.footNames.includes(n))) fail(w, `footer switch shows ${i.footNames.join(', ')}`);
          if (v.width >= 1400 && Object.values(NAMES).some((n) => !i.barNames.includes(n))) fail(w, `top bar switch shows ${i.barNames.join(', ')}`);
          if (v.width < 1400 && !v.phone && i.barCodes.length !== 4) fail(w, `top bar codes ${i.barCodes.join(', ')}`);
          if (v.phone && !(i.barCodes.length === 1 || i.barCodes.length === 4)) fail(w, `phone bar shows ${i.barCodes.join(', ')}`);
          if (lang === 'ja' && !/Hiragino Sans/.test(i.font) || lang === 'ja' && !/Noto Sans JP/.test(i.font) || lang === 'ja' && !/Yu Gothic/.test(i.font)) fail(w, `Japanese font stack missing: ${i.font}`);
          if (lang === 'ja') for (const sp of await page.evaluate(jaSplits)) fail(w, `ja-split ${sp}`);
        }
        if (vn === 'd1440' || vn === 'p390') await page.screenshot({ path: path.join(out, `${vn}${p.replace(/\//g, '_').replace(/\.html$/, '')}.png`) });
        log.push(`${w}: lang ${i.lang}, h1 ${i.h1}, ${i.sw}/${i.cw}, text ${i.text}`);
        await page.close();
      }
      await ctx.close();
    }

    // ---- JavaScript off ----
    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.5, isMobile: true });
    for (const p of paths) {
      const page = await noJs.newPage();
      await page.goto(base + p, { waitUntil: 'load' });
      const r = await page.evaluate(() => {
        const f = document.querySelector('form.lead');
        return {
          h1: document.querySelector('h1')?.textContent.trim(), first: document.querySelector('main p')?.textContent.trim().length || 0,
          form: f && { action: f.getAttribute('action'), method: f.getAttribute('method'), enctype: f.getAttribute('enctype'), req: [...f.querySelectorAll('[required]')].map((e) => e.name).join(','),
            order: [...f.children].map((c) => (c.matches('.purpose') ? 'purpose' : c.matches('.agree') ? 'agree' : c.matches('.send') ? 'send' : c.matches('.fld') ? 'field' : null)).filter(Boolean).join(',') },
          sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
        };
      });
      const w = `${p} (no JS)`;
      if (!r.h1 || r.first < 20) fail(w, 'h1 or first paragraph missing');
      if (r.sw > r.cw) fail(w, `horizontal overflow ${r.sw} > ${r.cw}`);
      if (/\/contact\/$/.test(p)) {
        if (!r.form) fail(w, 'no form');
        else {
          if (!/^mailto:inbox@qilich\.com\?subject=/.test(r.form.action) || r.form.method !== 'post' || r.form.enctype !== 'text/plain') fail(w, `not a mailto form: ${JSON.stringify(r.form)}`);
          if (r.form.req !== 'name,contact,agree') fail(w, `required fields ${r.form.req}`);
          if (r.form.order !== 'field,field,field,field,purpose,agree,send') fail(w, `form order ${r.form.order} (the purpose and the consent box come before the button)`);
          log.push(`${w}: form ${JSON.stringify(r.form)}`);
        }
        if (langOf(p) === 'uz' || langOf(p) === 'ja') await page.screenshot({ path: path.join(out, `nojs${p.replace(/\//g, '_')}.png`), fullPage: true });
      }
      await page.close();
    }
    await noJs.close();

    // ---- the contact form with JavaScript ----
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 0.75 });
    for (const lang of ['uz', 'ru', 'en', 'ja']) {
      const p = lang === 'uz' ? '/contact/' : `/${lang}/contact/`;
      const page = await ctx.newPage();
      await page.goto(base + p, { waitUntil: 'networkidle' });
      await page.fill('#f-name', 'Test Probe');
      await page.fill('#f-contact', '+998 90 000 00 00');
      await page.fill('#f-message', 'Telegram-bot / тест / テスト');
      await page.click('form.lead button[type=submit]');
      await page.waitForTimeout(200);
      const before = await page.evaluate(() => ({ m: window.__qilich?.lastMailto || null, valid: document.querySelector('#f-agree').validity.valid }));
      if (before.m || before.valid) fail(`${p} (JS)`, 'the form sent without the consent box');
      await page.check('#f-agree');
      await page.click('form.lead button[type=submit]');
      await page.waitForTimeout(300);
      const r = await page.evaluate(() => ({ m: window.__qilich?.lastMailto || '', status: document.querySelector('form.lead .status').textContent.trim(), want: document.querySelector('#strings [data-k=sentMail]').textContent.trim() }));
      const body = decodeURIComponent((r.m.split('body=')[1] || ''));
      if (!r.m.startsWith('mailto:inbox@qilich.com?subject=') || !body.includes('Test Probe') || !body.includes('テスト')) fail(`${p} (JS)`, `mailto not prefilled: ${r.m.slice(0, 120)}`);
      if (r.status !== r.want) fail(`${p} (JS)`, `status «${r.status}»`);
      log.push(`${p} (JS): ${r.m.slice(0, 90)}… status «${r.status}»`);
      await page.screenshot({ path: path.join(out, `form-sent-${lang}.png`) });
      await page.close();
    }
    await ctx.close();
  } else {
    // ---- analytics: a build with test IDs ----
    for (const p of ['/en/', '/ja/about/', '/contact/']) {
      for (const v of [VIEWS.p390, VIEWS.d1440]) {
        const ctx = await browser.newContext({ viewport: { width: v.width, height: v.height }, deviceScaleFactor: v.dpr, isMobile: !!v.phone, hasTouch: !!v.phone });
        const external = [];
        await ctx.route(/googletagmanager\.com|mc\.yandex\.ru/, (route) => { external.push(route.request().url()); route.fulfill({ status: 200, contentType: 'text/javascript', body: '/* stub */' }); });
        const page = await ctx.newPage();
        await page.addInitScript(() => {
          // every shift, with what moved: the landing's own ruler label (scripts outside this gate) is told apart
          window.__cls = 0; window.__shifts = [];
          new PerformanceObserver((l) => { for (const e of l.getEntries()) { if (e.hadRecentInput) continue; window.__cls += e.value; window.__shifts.push({ t: e.startTime, v: e.value, ruler: (e.sources || []).every((x) => x.node && x.node.closest && x.node.closest('.ruler') || x.node && x.node.parentElement && x.node.parentElement.closest('.ruler')) }); } }).observe({ type: 'layout-shift', buffered: true });
        });
        await page.goto(base + p, { waitUntil: 'networkidle' });
        const w = `${p} @${v.width}`;
        const first = await page.evaluate(() => ({ hidden: document.getElementById('consent')?.hidden, cfg: !!document.getElementById('qilich-analytics') }));
        if (!first.cfg) fail(w, 'no analytics config in the page');
        if (first.hidden !== true) fail(w, 'the banner shows on the first screen');
        if (external.length) fail(w, `loaded before consent: ${external.join(' ')}`);
        await page.screenshot({ path: path.join(out, `consent-0${p.replace(/\//g, '_')}${v.width}.png`) });
        const cls0 = await page.evaluate(() => window.__cls);
        const t0 = await page.evaluate(() => performance.now());
        if (cls0 > 0) log.push(`${w}: note, the page itself shifts ${cls0.toFixed(6)} before the banner (not the banner)`);
        await page.mouse.wheel(0, 600);
        await page.waitForTimeout(900);
        const shown = await page.evaluate(() => { const b = document.getElementById('consent'); const r = b.getBoundingClientRect(); return { hidden: b.hidden, top: r.top, h: r.height, vh: innerHeight, cls: window.__cls }; });
        if (shown.hidden) fail(w, 'no banner after scrolling');
        // the banner's own window: from the scroll that shows it to a second after, anything but the landing's ruler
        const bannerShift = await page.evaluate((t0) => window.__shifts.filter((x) => x.t >= t0 && x.t <= t0 + 1500 && !x.ruler).reduce((a, x) => a + x.v, 0), t0);
        if (bannerShift > 0) fail(w, `the banner shifts the layout by ${bannerShift}`);
        if (shown.top < shown.vh * 0.6) fail(w, `the banner reaches up to ${Math.round(shown.top)} px of ${shown.vh}`);
        await page.screenshot({ path: path.join(out, `consent-1${p.replace(/\//g, '_')}${v.width}.png`) });
        // events before consent are noted but not sent
        await page.evaluate(() => { document.querySelector('footer a[href^="mailto:"]').addEventListener('click', (e) => e.preventDefault(), { once: true }); });
        await page.click('footer a[href^="mailto:"]');
        await page.click('#consent button[data-consent=granted]');
        await page.waitForTimeout(600);
        // after consent: click a phone link, a CTA, send the form where there is one
        await page.evaluate(() => { for (const a of document.querySelectorAll('a[href^="tel:"], .btn, .cta')) a.addEventListener('click', (e) => e.preventDefault()); });
        const tel = await page.$('main a[href^="tel:"], footer a[href^="tel:"]');
        if (tel) await tel.click();
        const cta = await page.$('a.btn[data-cta], a.cta');
        if (cta && v.width > 900) await cta.click();
        if (await page.$('form.lead')) {
          await page.fill('#f-name', 'Probe'); await page.fill('#f-contact', 'probe@example.com'); await page.check('#f-agree');
          await page.evaluate(() => { window.location.assign = () => {}; });
          await page.evaluate(() => document.querySelector('form.lead').requestSubmit());
          await page.waitForTimeout(300);
        }
        const r = await page.evaluate(() => ({ ev: (window.__qilich.events || []).map((e) => `${e.name}${e.sent ? '' : '(not sent)'} ${JSON.stringify(e.params)}`), dl: (window.dataLayer || []).map((a) => [...a].slice(0, 2).join(':')), stored: localStorage.getItem('qilich.consent'), cls: window.__cls }));
        if (!external.some((u) => /googletagmanager/.test(u)) || !external.some((u) => /mc\.yandex/.test(u))) fail(w, `after consent, loaded only: ${external.join(' ') || 'nothing'}`);
        if (r.stored !== 'granted') fail(w, 'the choice was not kept');
        if (!r.ev.some((e) => /^contact_click\(not sent\) .*"method":"email"/.test(e))) fail(w, 'contact_click before consent not noted, or sent');
        if (!r.ev.some((e) => /^contact_click .*"method":"phone"/.test(e))) fail(w, 'no contact_click {method: phone}');
        if (v.width > 900 && !r.ev.some((e) => /^cta_click .*"page":.*"lang":/.test(e))) fail(w, 'no cta_click {page, lang}');
        if (p.includes('contact') && !r.ev.some((e) => /^generate_lead /.test(e))) fail(w, 'no generate_lead');
        const other = await page.evaluate(() => window.__shifts.filter((x) => !x.ruler).reduce((a, x) => a + x.v, 0));
        if (other > 0) fail(w, `layout shift ${other} (not the landing ruler)`);
        const ruler = await page.evaluate(() => window.__shifts.filter((x) => x.ruler).reduce((a, x) => a + x.v, 0));
        if (ruler > 0) log.push(`${w}: note, the landing's scene ruler shifts ${ruler.toFixed(6)} when its label changes (src/ui/nav.js, outside this gate)`);
        log.push(`${w}: ${r.ev.join(' | ')} ; gtag queue ${r.dl.join(', ')} ; requested ${external.map((u) => new URL(u).host).join(', ')}`);
        await ctx.close();
      }
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(out, ANALYTICS ? 'analytics-log.txt' : 'log.txt'), [...log, '', ...fails.map((f) => 'FAIL ' + f)].join('\n'));
  for (const f of fails) console.log('  FAIL  ' + f);
  console.log(fails.length ? `pages-probe: ${fails.length} failure(s); ${out}` : `pages-probe: ok; ${out}`);
  process.exit(fails.length ? 1 : 0);
})();
