// SamurAI refine on a reopened estimate (SOLUTIONS-SPEC §8 T35, T36; jb2a must-fix 1): the visitor's last estimate is
// in localStorage, they come back, open it from "Oxirgi smetangiz", tap a chip and refine. The refine must be about the
// same business (the industry SamurAI understood stays, nothing asks which business it is), the brief number gains
// "·2", and while it runs the estimate stays on screen with "Qayta hisoblanmoqda" at its head and beside the button.
// One live model call (about $0.1). Usage: node scripts/qa/samurai-refine.cjs <base> <share URL with #r=> <outDir> [chip]
const fs = require('fs');
const path = require('path');
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');

const base = (process.argv[2] || 'http://127.0.0.1:8821').replace(/\/$/, '');
const link = process.argv[3] || '';
const out = path.resolve(process.argv[4] || '.cache/qa/samurai-refine');
const chip = process.argv[5] || 'cheaper';
fs.mkdirSync(out, { recursive: true });
const results = [];
const check = (name, ok, info = '') => { results.push({ name, ok: !!ok, info }); console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${info ? `  ${typeof info === 'string' ? info : JSON.stringify(info)}` : ''}`); };
// the share payload: z<base64url(deflate-raw(JSON))> or j<base64url(JSON)> (src/samurai/share.js)
const decodeIn = async (p, v) => p.evaluate(async (s) => {
  const b = Uint8Array.from(atob(s.slice(1).replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
  const raw = s[0] === 'z' ? new Uint8Array(await new Response(new Blob([b]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer()) : b;
  return JSON.parse(new TextDecoder().decode(raw));
}, v);

(async () => {
  const u = new URL(link);
  const payload = u.hash.slice(3), page = u.pathname;
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(String(e)));
  p.on('console', (m) => { if (m.type() === 'error' && !/favicon|ERR_ABORTED/.test(m.text())) errors.push(m.text()); });
  // the visitor's earlier visit left the estimate and an untouched sentence (no text, no draft)
  await p.goto(base + page, { waitUntil: 'networkidle' });
  await p.evaluate((v) => { localStorage.clear(); localStorage.setItem('qilich.samurai.last', v); }, payload);
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForSelector('.reopen:not([hidden]) button', { timeout: 10000 });
  await p.screenshot({ path: path.join(out, 'reopen-line-d.png') });
  await p.click('.reopen button');
  await p.waitForSelector('.stamp', { timeout: 15000 });
  await p.waitForTimeout(800);
  const before = await decodeIn(p, payload);
  const no0 = await p.evaluate(() => document.querySelector('.res-head .no')?.textContent.trim());
  await p.screenshot({ path: path.join(out, 'reopened-d.png') });
  // the refine: a chip, then the button
  const requests = [];
  p.on('request', (r) => { if (r.url().endsWith('/api/samurai') && r.method() === 'POST') requests.push(JSON.parse(r.postData() || '{}')); });
  await p.click(`.refine [data-k="${chip}"]`);
  await p.click('.refine button[type=submit]');
  const t0 = Date.now();
  // while it runs: the status at the head and beside the button, the brief sheet still on screen
  const seen = { head: false, beside: false, brief: true, disabled: false };
  let shot = 0;
  for (;;) {
    const s = await p.evaluate(() => ({
      head: document.querySelector('.res-status .status')?.textContent.trim() || '',
      beside: document.querySelector('.rf-status .status')?.textContent.trim() || '',
      brief: !!document.querySelector('.brief') && document.querySelector('.brief').getBoundingClientRect().height > 40,
      disabled: !!document.querySelector('.refine button[type=submit]')?.disabled,
      done: !!document.querySelector('.stamp') && /·\d/.test(document.querySelector('.res-head .no')?.textContent || ''),
      heard: !!document.querySelector('.brief .heard-sum'),
    }));
    if (s.head) seen.head = seen.head || s.head;
    if (s.beside) seen.beside = seen.beside || s.beside;
    if (s.disabled) seen.disabled = true;
    if (!s.brief) seen.brief = false;
    if (shot === 0 && Date.now() - t0 > 1500) { shot++; await p.screenshot({ path: path.join(out, 'refining-d.png') }); await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(200); await p.screenshot({ path: path.join(out, 'refining-top-d.png') }); }
    if (s.done || Date.now() - t0 > 120000) break;
    await p.waitForTimeout(400);
  }
  await p.waitForTimeout(1500);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.screenshot({ path: path.join(out, 'refined-d.png') });
  await p.screenshot({ path: path.join(out, 'refined-d-full.png'), fullPage: true });
  const no1 = await p.evaluate(() => document.querySelector('.res-head .no')?.textContent.trim());
  const last = await p.evaluate(() => localStorage.getItem('qilich.samurai.last'));
  const after = last ? await decodeIn(p, last) : null;
  const body = requests[0] || {};
  check('the refine request carries the estimate, not the untouched form sentence', body.refine && body.text === '' && !body.intake?.branches && !body.intake?.staff && (!body.intake?.industry || body.intake.industry === before.pick.heard.industry), { intake: body.intake, text: body.text, refine: !!body.refine });
  check('while it runs: a status at the result head and beside the refine button', seen.head && seen.beside, seen);
  check('while it runs: the brief sheet stays on screen and the button is disabled', seen.brief && seen.disabled, seen);
  check('the brief number gains ·2', no1 === `${no0}·2`, { before: no0, after: no1 });
  check('the same business: the industry SamurAI understood stays', after && after.pick.heard.industry === before.pick.heard.industry, { before: before.pick.heard.industry, after: after?.pick.heard.industry, summary: after?.pick.heard.summary });
  check('nothing asks which business it is', after && !after.pick.questions.some((q) => /yoki|или|\bor\b|それとも|どちら/.test(q.text) && /biznes|бизнес|business|事業|業種/i.test(q.text)), after?.pick.questions.map((q) => q.text));
  check('no console errors', !errors.length, errors);
  fs.writeFileSync(path.join(out, 'refine-probe.json'), JSON.stringify({ at: new Date().toISOString(), base, chip, before: { no: no0, heard: before.pick.heard, sols: before.pick.solutions.map((s) => s.catalogue_id) }, after: after && { no: no1, heard: after.pick.heard, sols: after.pick.solutions.map((s) => s.catalogue_id), questions: after.pick.questions.map((q) => q.text) }, request: { intake: body.intake, text: body.text, chips: body.refine?.chips }, seen, results }, null, 1));
  await b.close();
  const pass = results.filter((x) => x.ok).length;
  console.log(`samurai-refine: ${pass}/${results.length} → ${out}`);
  process.exit(pass === results.length ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(2); });
