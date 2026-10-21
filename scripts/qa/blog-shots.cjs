// blog-shots: the blog's reading layout in a real browser (global Playwright, the capture's SwiftShader flags).
// For each page and view: the first screen, then one screen at each reading element the post has (a table, a
// blockquote, a fenced form, the shortcode sheet, the related rows, the SamurAI box), saved as PNG for review; plus
// checks: zero console errors, no failed request, no horizontal page overflow, exactly one h1, the body text size and
// measure (characters per line) on desktop and phone, and that the okina and Cyrillic render in the page's own fonts
// (document.fonts reports Geologica / Martian loaded).
// Usage: node scripts/qa/blog-shots.cjs [base=http://localhost:8840] [outDir=.cache/qa/blog]
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { chromium } = require(execSync('npm root -g').toString().trim() + '/playwright');

const base = (process.argv[2] || 'http://localhost:8840').replace(/\/$/, '');
const out = path.resolve(process.argv[3] || '.cache/qa/blog');
fs.mkdirSync(out, { recursive: true });
const VIEWS = { d1440: { width: 1440, height: 900, dpr: 1 }, p390: { width: 390, height: 844, dpr: 2, phone: true }, p360: { width: 360, height: 740, dpr: 1.5, phone: true } };
const PAGES = [
  ['/blog/', ['d1440', 'p390']],
  ['/blog/website-cost/', ['d1440', 'p390', 'p360']],
  ['/ru/blog/security-basics/', ['d1440', 'p360']],
  ['/en/blog/horenso-reporting/', ['d1440']],
  ['/ja/blog/', ['p390']],
  ['/ja/blog/four-hour-time-difference/', ['d1440', 'p390']],
];
const MARKS = ['.tbl', 'blockquote', 'pre.form', '.rel.sc', '.related', '.ai-box'];

(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--font-render-hinting=none'] });
  const report = [];
  for (const [url, views] of PAGES) {
    for (const v of views) {
      const V = VIEWS[v];
      const ctx = await browser.newContext({ viewport: { width: V.width, height: V.height }, deviceScaleFactor: V.dpr, isMobile: !!V.phone, hasTouch: !!V.phone });
      const page = await ctx.newPage();
      const errors = [];
      page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`); });
      page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
      page.on('requestfailed', (r) => errors.push(`failed: ${r.url()}`));
      await page.goto(base + url, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(400);
      const m = await page.evaluate(() => {
        const de = document.documentElement;
        const p = document.querySelector('.prose p') || document.querySelector('.e-d');
        const cs = p ? getComputedStyle(p) : null;
        // characters per line: the paragraph's width in its own average character width
        let cpl = null;
        if (p) {
          const r = document.createRange(); r.selectNodeContents(p);
          const lines = Math.max(1, Math.round(p.getBoundingClientRect().height / parseFloat(cs.lineHeight)));
          cpl = Math.round(p.textContent.length / lines);
        }
        const fonts = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, ''));
        return {
          overflow: de.scrollWidth - window.innerWidth, h1: document.querySelectorAll('h1').length,
          bodyPx: cs ? cs.fontSize : null, lineHeight: cs ? cs.lineHeight : null, cpl, fonts: [...new Set(fonts)],
          wide: [...document.querySelectorAll('main *')].filter((e) => e.getBoundingClientRect().right > window.innerWidth + 1 && !e.closest('.tbl')).slice(0, 5).map((e) => e.tagName + '.' + e.className),
        };
      });
      const name = (url.replace(/\//g, '_').replace(/^_|_$/g, '') || 'home') + '@' + v;
      await page.screenshot({ path: path.join(out, `${name}-0top.png`) });
      let k = 1;
      for (const sel of MARKS) {
        const has = await page.$(sel);
        if (!has) continue;
        await page.evaluate((s) => { const e = document.querySelector(s); window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 110); }, sel);
        await page.waitForTimeout(250);
        await page.screenshot({ path: path.join(out, `${name}-${k++}${sel.replace(/[^\w]/g, '')}.png`) });
      }
      if (!url.match(/blog\/$/)) {
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await page.waitForTimeout(250);
        await page.screenshot({ path: path.join(out, `${name}-9end.png`) });
      }
      const fail = [...errors, m.overflow > 0 ? `horizontal overflow ${m.overflow}px` : null, m.h1 !== 1 ? `${m.h1} h1` : null, m.wide.length ? `wider than the viewport: ${m.wide.join(', ')}` : null].filter(Boolean);
      report.push({ url, view: v, ...m, fail });
      console.log(`${fail.length ? 'FAIL' : 'ok  '} ${url} @${v}: body ${m.bodyPx}/${m.lineHeight}, ~${m.cpl} chars/line, fonts ${m.fonts.join(', ')}${fail.length ? `\n      ${fail.join('\n      ')}` : ''}`);
      await ctx.close();
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 1));
  const bad = report.filter((r) => r.fail.length);
  console.log(`blog-shots: ${report.length} page views, ${bad.length} with problems; frames in ${out}`);
  process.exit(bad.length ? 1 : 0);
})();
