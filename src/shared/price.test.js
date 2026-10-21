// node --test src/shared/   (npm test): the price engine's acceptance checks (SOLUTIONS-SPEC §8, T1, T28, T29)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { normalise, compact, expand, pickable } from './catalogue.js';
import { enrichSolution, plan, fit, preset, applyEffect, payback, monthlyGain, priceResult, uzsRange, roundUsd, defaultSelection, solId, riskUsd } from './price.js';
import { match, fold } from './match.js';
import * as F from './format.js';
import { MONTHS } from './months.js';
import { endOfWork, isWorkday, firstMonday, holidaysBetween } from './holidays.js';
import { canon } from './canon.js';

const J = (p) => JSON.parse(readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8'));
const pricing = J('content/pricing.json');
const m = normalise(J('content/solutions.json'), J('content/solutions-extra.json'), pricing);
const rate = { uzs_per_usd: 12012.3, date: '2026-10-21', source: 'cbu' };
const ids = pickable(m).map((s) => s.id);
const MODS = Object.keys(m.modifiers), INTS = Object.keys(m.integrations);

// a seeded generator, so a failure reproduces
function rng(seed) { return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }
const pickOf = (r, arr, n) => { const out = new Set(); for (let i = 0; i < n; i++) out.add(arr[Math.floor(r() * arr.length)]); return [...out]; };
function randomSol(r, n) {
  return { n, catalogue_id: ids[Math.floor(r() * ids.length)], based_on: [], title: 't', why: 'w', priority: ['must', 'should', 'could'][Math.floor(r() * 3)], scope: r() < 0.7 ? 'mvp' : 'full', size: ['s', 'm', 'l'][Math.floor(r() * 3)], modifiers: pickOf(r, MODS, Math.floor(r() * 4)), integrations: pickOf(r, INTS, Math.floor(r() * 4)), depends_on: [], difficulty: 1 + Math.floor(r() * 5), difficulty_reason: '' };
}

test('same input gives an identical output over 1,000 random choices', () => {
  const r = rng(42);
  for (let i = 0; i < 1000; i++) {
    const s = randomSol(r, 1);
    assert.deepEqual(enrichSolution(m, s, { lang: 'uz', rate }), enrichSolution(m, structuredClone(s), { lang: 'uz', rate }));
  }
});

test('every range stays inside the catalogue bounds, mvp ≤ full, and rounding follows §2.6.5', () => {
  const r = rng(7);
  for (let i = 0; i < 1000; i++) {
    const s = randomSol(r, 1), e = m.byId.get(s.catalogue_id), x = enrichSolution(m, s, { lang: 'en', rate });
    const ints = s.integrations.filter((k) => !e.integrations_included.includes(k));
    const addUsd = [...s.modifiers.map((k) => m.modifiers[k].add_usd?.[1] || 0), ...ints.map((k) => m.integrations[k].add_usd[1])].reduce((a, b) => a + b, 0);
    const addW = [...s.modifiers.map((k) => m.modifiers[k].add_weeks?.[1] || 0), ...ints.map((k) => m.integrations[k].add_weeks[1] * pricing.integration_weeks_overlap)].reduce((a, b) => a + b, 0);
    const band = pricing.size_band[s.size];
    for (const sc of ['mvp', 'full']) {
      const lo = e[sc].usd[0] + band[0] * (e[sc].usd[1] - e[sc].usd[0]);
      assert.ok(x.usd[sc][0] >= Math.floor(lo / 100) * 100 - 1e-6, `${s.catalogue_id} ${sc} usd min ${x.usd[sc][0]} < ${lo}`);
      if (sc === 'mvp') assert.ok(x.usd[sc][1] <= Math.ceil((e[sc].usd[1] * pricing.max_mult + addUsd) / 100) * 100, `${s.catalogue_id} usd max`);
      if (sc === 'mvp') assert.ok(x.weeks[sc][1] <= Math.ceil(e[sc].weeks[1] * pricing.max_mult + addW), `${s.catalogue_id} weeks max`);
      assert.ok(x.usd[sc][0] % 100 === 0 && x.usd[sc][1] % 100 === 0, 'USD rounded to 100');
      assert.ok(Number.isInteger(x.weeks[sc][0]) && x.weeks[sc][0] >= 1 && x.weeks[sc][0] <= x.weeks[sc][1], 'whole weeks, min ≥ 1');
      assert.ok(x.usd[sc][0] <= x.usd[sc][1]);
    }
    for (const k of [0, 1]) { assert.ok(x.usd.mvp[k] <= x.usd.full[k], 'usd mvp ≤ full'); assert.ok(x.weeks.mvp[k] <= x.weeks.full[k], 'weeks mvp ≤ full'); }
    // the breakdown lines sum to the price before rounding
    const sum = x.price_lines.mvp.reduce((a, l) => [a[0] + l.usd[0], a[1] + l.usd[1]], [0, 0]);
    assert.ok(Math.abs(Math.floor(sum[0] / 100) * 100 - x.usd.mvp[0]) <= 100 && Math.abs(Math.ceil(sum[1] / 100) * 100 - x.usd.mvp[1]) <= 100, 'lines sum to the price');
  }
});

test('UZS steps: 0.1 mln under 2 mln, 0.5 under 50, 1 under 200, 5 above; thousands under 1 mln', () => {
  assert.deepEqual(uzsRange([100, 120], 12000), [1200000, 1500000]);
  assert.deepEqual(uzsRange([1000, 1500], 12000), [12000000, 18000000]);
  assert.deepEqual(uzsRange([1010, 1530], 12000), [12000000, 18500000]);
  assert.deepEqual(uzsRange([5000, 9000], 12012.3), [60000000, 109000000]);
  assert.deepEqual(uzsRange([20000, 30000], 12012.3), [240000000, 365000000]);
  assert.deepEqual(uzsRange([20, 75], 12000), [240000, 900000]);
  assert.deepEqual(roundUsd([1234, 5678]), [1200, 5700]);
});

const sol = (n, id, extra = {}) => ({ n, catalogue_id: id, based_on: [], title: id, why: '', priority: 'must', scope: 'mvp', size: 'm', modifiers: [], integrations: [], depends_on: [], difficulty: 2, difficulty_reason: '', ...extra });

test('shared savings apply only when two or more selected entries share a part', () => {
  const one = [enrichSolution(m, sol(1, 'tg-order-bot'), { lang: 'uz', rate })];
  assert.deepEqual(plan(m, one, defaultSelection(one), rate).totals.shared_saving_usd, [0, 0]);
  const two = [enrichSolution(m, sol(1, 'tg-order-bot'), { lang: 'uz', rate }), enrichSolution(m, sol(2, 'tg-loyalty-bot'), { lang: 'uz', rate })];
  const p = plan(m, two, defaultSelection(two), rate).totals;
  // both share backend (.15) and admin (.10): .25 × the smaller price
  const small = Math.min(two[0].usd.mvp[0], two[1].usd.mvp[0]);
  assert.equal(p.shared_saving_usd[0], Math.floor(0.25 * small / 100) * 100);
  const off = plan(m, two, [{ id: 'tg-order-bot', state: 'mvp' }, { id: 'tg-loyalty-bot', state: 'off' }], rate).totals;
  assert.deepEqual(off.shared_saving_usd, [0, 0]);
});

test('the schedule respects depends_on: a dependant starts at its dependency’s MVP end', () => {
  const a = enrichSolution(m, sol(1, 'ind-clinic'), { lang: 'uz', rate });
  const b = enrichSolution(m, sol(2, 'tg-booking-bot', { depends_on: ['ind-clinic'], priority: 'should' }), { lang: 'uz', rate });
  const p = plan(m, [a, b], defaultSelection([a, b]), rate);
  const ta = p.tracks.find((t) => t.id === 'ind-clinic'), tb = p.tracks.find((t) => t.id === 'tg-booking-bot');
  assert.deepEqual(tb.start, ta.mvp_end);
  assert.ok(p.totals.weeks[1] >= tb.end[1]);
});

test('fit never exceeds the budget or the deadline on the max values; presets select as specified', () => {
  const r = rng(99);
  for (let i = 0; i < 200; i++) {
    const sols = [1, 2, 3].map((n) => enrichSolution(m, randomSol(r, n), { lang: 'uz', rate })).filter((s, k, a) => a.findIndex((x) => x.catalogue_id === s.catalogue_id) === k);
    const budgetUsd = 2000 + Math.floor(r() * 60000), deadlineWeeks = 2 + Math.floor(r() * 30);
    const f = fit(m, sols, { budgetUsd, deadlineWeeks }, rate);
    const t = plan(m, sols, f.selection, rate).totals;
    if (t.count) { assert.ok(t.usd[1] <= budgetUsd, `budget ${t.usd[1]} > ${budgetUsd}`); assert.ok(t.weeks[1] <= deadlineWeeks, `deadline ${t.weeks[1]} > ${deadlineWeeks}`); }
    for (const id of f.dropped) assert.equal(f.selection.find((x) => x.id === id).state, 'off');
  }
  const sols = [enrichSolution(m, sol(1, 'tg-order-bot'), { lang: 'uz', rate }), enrichSolution(m, sol(2, 'web-corporate', { priority: 'should' }), { lang: 'uz', rate }), enrichSolution(m, sol(3, 'tg-loyalty-bot', { priority: 'could' }), { lang: 'uz', rate })];
  assert.deepEqual(preset(sols, 'lean').map((x) => x.state), ['mvp', 'off', 'off']);
  assert.deepEqual(preset(sols, 'balanced').map((x) => x.state), ['full', 'mvp', 'off']);
  assert.deepEqual(preset(sols, 'full').map((x) => x.state), ['full', 'full', 'full']);
  const none = fit(m, sols, { budgetUsd: 100 }, rate);
  assert.equal(none.fits, false);
  assert.equal(none.closest.id, 'tg-order-bot');
});

test('applyEffect changes only the targeted choices, and the price moves as the engine says', () => {
  const pick = { solutions: [sol(1, 'tg-order-bot', { size: 's' }), sol(2, 'web-corporate', { size: 's' })] };
  const { pick: p2, off } = applyEffect(pick, { targets: ['tg-order-bot'], size: 'l', add_modifiers: ['multi_branch'], remove_modifiers: [], add_integrations: ['payme'], drop: ['web-corporate'] });
  assert.equal(p2.solutions[0].size, 'l');
  assert.deepEqual(p2.solutions[0].modifiers, ['multi_branch']);
  assert.deepEqual(p2.solutions[0].integrations, ['payme']);
  assert.deepEqual(p2.solutions[1], pick.solutions[1]);
  assert.deepEqual(off, ['web-corporate']);
  const before = enrichSolution(m, pick.solutions[0], { lang: 'uz', rate }), after = enrichSolution(m, p2.solutions[0], { lang: 'uz', rate });
  assert.ok(after.usd.mvp[0] > before.usd.mvp[0] && after.usd.mvp[1] > before.usd.mvp[1]);
  const keep = applyEffect(pick, { targets: [], size: 'keep', add_modifiers: [], remove_modifiers: [], add_integrations: [], drop: [] });
  assert.deepEqual(keep.pick, pick);
});

test('payback formulas match hand-computed cases; net ≤ 0 or a missing input gives null', () => {
  assert.equal(monthlyGain('hours_saved', [{ key: 'hours_per_week', value: 12 }, { key: 'hourly_cost_usd', value: 4 }]), 12 * 4.33 * 4);
  assert.equal(monthlyGain('more_orders', [{ key: 'orders_per_month', value: 1000 }, { key: 'uplift_pct', value: 10 }, { key: 'avg_order_usd', value: 10 }, { key: 'margin_pct', value: 30 }]), 300);
  assert.equal(monthlyGain('fewer_errors', [{ key: 'errors_per_month', value: 50 }, { key: 'uplift_pct', value: 50 }, { key: 'cost_per_error_usd', value: 8 }]), 200);
  assert.deepEqual(payback('more_orders', [{ key: 'orders_per_month', value: 1000 }, { key: 'uplift_pct', value: 10 }, { key: 'avg_order_usd', value: 10 }, { key: 'margin_pct', value: 30 }], [2000, 3000], [20, 80]), [8, 12]);
  assert.equal(payback('hours_saved', [{ key: 'hours_per_week', value: 1 }], [2000, 3000], [0, 0]), null);
  assert.equal(payback('hours_saved', [{ key: 'hours_per_week', value: 1 }, { key: 'hourly_cost_usd', value: 1 }], [2000, 3000], [100, 200]), null);
  // clamps: pct ≤ 100, hours ≤ 168, hourly cost ≤ 50
  assert.equal(monthlyGain('hours_saved', [{ key: 'hours_per_week', value: 999 }, { key: 'hourly_cost_usd', value: 999 }]), 168 * 4.33 * 50);
  assert.deepEqual(riskUsd(2, [2000, 3000], [4, 6]), [600, 1500]);
});

test('the compact page data prices exactly like the full model (the browser and the Worker agree)', () => {
  for (const lang of ['uz', 'ru', 'en', 'ja']) {
    const b = expand(JSON.parse(JSON.stringify(compact(m, lang))));
    const r = rng(3);
    for (let i = 0; i < 200; i++) {
      const s = randomSol(r, 1);
      const x = enrichSolution(m, s, { lang, rate }), y = enrichSolution(b, s, { lang, rate });
      assert.deepEqual([y.usd, y.weeks, y.uzs, y.monthly_usd, y.phases.mvp.map((p) => p.weeks)], [x.usd, x.weeks, x.uzs, x.monthly_usd, x.phases.mvp.map((p) => p.weeks)]);
    }
    assert.equal(b.version, m.version);
  }
});

test('the Worker and the browser import the same engine file', () => {
  const worker = readdirSync(new URL('../../worker/', import.meta.url)).filter((f) => f.endsWith('.js')).map((f) => readFileSync(new URL(`../../worker/${f}`, import.meta.url), 'utf8')).join('\n');
  assert.match(worker, /from '\.\.\/src\/shared\/price\.js'/);
  const page = readdirSync(new URL('../samurai/', import.meta.url)).filter((f) => f.endsWith('.js')).map((f) => readFileSync(new URL(`../samurai/${f}`, import.meta.url), 'utf8')).join('\n');
  assert.match(page, /from '\.\.\/shared\/price\.js'/);
});

test('the matcher is deterministic and follows the intake (§2.8.8)', () => {
  const a = match(m, { intake: { industry: 'restaurants', branches: '2-5', staff: '21-100', tools: '1c', goal: 'sales' }, lang: 'uz' });
  assert.deepEqual(a, match(m, { intake: { industry: 'restaurants', branches: '2-5', staff: '21-100', tools: '1c', goal: 'sales' }, lang: 'uz' }));
  assert.equal(a.status, 'ok');
  assert.ok(a.solutions.length >= 2 && a.solutions.length <= 3);
  assert.equal(a.solutions[0].priority, 'must');
  for (const s of a.solutions) { assert.equal(s.size, 'm'); assert.ok(s.modifiers.includes('multi_branch')); }
  const ex = match(m, { intake: { industry: 'education', tools: 'excel' }, lang: 'ru' });
  assert.ok(ex.solutions[0].modifiers.includes('migration'));
  const kw = match(m, { intake: {}, text: 'нужен телеграм бот для заказов', lang: 'ru' });
  assert.ok(kw.solutions.some((s) => s.catalogue_id.startsWith('tg-')), JSON.stringify(kw.solutions.map((s) => s.catalogue_id)));
  assert.equal(fold('Oʻquv'), fold("o'quv"));
  assert.equal(fold('ўқув'), 'oquv');
});

test('Japanese: the matcher finds the industry from its words, and the page data carries Japanese titles', () => {
  const mj = normalise(J('content/solutions.json'), { ...J('content/solutions-extra.json'), ja_solutions: J('content/solutions-ja.json').solutions }, pricing);
  const page = expand(compact(mj, 'ja'));
  const a = match(page, { text: '名古屋で学習塾を3教室運営しています。出欠と月謝の管理を紙とExcelで行っています。', lang: 'ja' });
  assert.equal(a.heard.industry, 'education');
  assert.deepEqual(a, match(mj, { text: '名古屋で学習塾を3教室運営しています。出欠と月謝の管理を紙とExcelで行っています。', lang: 'ja' }));
  for (const s of a.solutions) assert.match(s.title + s.why, /[぀-ヿ一-鿿]/u);
  assert.equal(match(page, { text: '自動車部品メーカーです。設備の稼働状況を紙の日報で管理しています。', lang: 'ja' }).heard.industry, 'manufacturing');
  // an industry chosen in the form wins over the words
  assert.equal(match(page, { intake: { industry: 'clinics' }, text: '学習塾です', lang: 'ja' }).heard.industry, 'clinics');
});

test('the matcher reads the industry the visitor wrote, in every language, before any keyword (jb2a must-fix 7)', () => {
  const extra = J('content/solutions-extra.json');
  const cases = [
    ['uz', 'Toshkentda goʻzallik saloni, mijozlar Instagram orqali yoziladi', 'beauty'], ['ru', 'Салон красоты в Ташкенте, клиенты записываются через Instagram', 'beauty'], ['en', 'A beauty salon in Tashkent, clients book through Instagram', 'beauty'],
    ['uz', 'Samarqandda 30 xonali mehmonxona, bron telefon orqali', 'hospitality'], ['ru', 'Отель на 40 номеров, брони в Excel', 'hospitality'], ['en', 'A small hotel with 25 rooms, bookings in a notebook', 'hospitality'],
    ['uz', 'Avtoservis, mijozlar navbatda uzoq kutadi', 'auto'], ['ru', 'Автосервис и автомойка, очереди и путаница с записью', 'auto'], ['ru', 'Сеть из 4 автомоек в Ташкенте. Клиенты записываются по телефону.', 'auto'],
    ['ru', 'Оптовая торговля стройматериалами в Ташкенте, 15 менеджеров', 'distribution'], ['uz', 'Qurilish mollari ulgurji savdosi', 'distribution'], ['ru', 'Ресторан с доставкой, заказы по телефону', 'restaurants'],
    ['ru', 'Интернет-магазин одежды, заказы в Instagram', 'ecommerce'], ['en', 'We store our stock in Excel and run a pharmacy', 'pharmacy'],
  ];
  for (const [lang, text, ind] of cases) {
    const page = expand(compact(m, lang)), a = match(page, { text, lang });
    assert.equal(a.heard.industry, ind, `${lang}: ${text}`);
    assert.deepEqual(a.solutions.map((s) => s.catalogue_id), extra.industries[ind].starter.slice(0, 3), `${lang}: ${text}`);
    assert.deepEqual(a, match(m, { text, lang }), 'the page model and the full model agree');
  }
  // an industry chosen in the form still wins over the words
  assert.equal(match(m, { intake: { industry: 'clinics' }, text: 'Салон красоты', lang: 'ru' }).heard.industry, 'clinics');
});

test('the Japanese page serves a company in Japan: no Telegram-first starter, no Uzbekistan-only service (jb2a must-fix 8)', () => {
  const mj = normalise(J('content/solutions.json'), { ...J('content/solutions-extra.json'), ja_solutions: J('content/solutions-ja.json').solutions }, pricing);
  const page = expand(compact(mj, 'ja'));
  const uzOnly = Object.entries(J('content/solutions-extra.json').integrations).filter(([, v]) => v.region === 'uz').map(([k]) => k);
  for (const text of ['東京で衣料品店を3店舗運営しています。在庫はExcelです。', '大阪の歯科クリニックで、予約は電話です。', '飲食店です。', '学習塾を運営しています。', '']) {
    for (const goal of ['sales', 'payments']) {
      const a = match(page, { text, intake: { goal }, lang: 'ja' });
      assert.ok(!a.solutions[0].catalogue_id.startsWith('tg-'), `${text}: ${a.solutions[0].catalogue_id}`);
      for (const s of a.solutions) assert.ok(!s.integrations.some((k) => uzOnly.includes(k)), `${text}: ${s.integrations}`);
    }
  }
  assert.equal(match(page, { text: '東京で衣料品店を3店舗運営しています。', lang: 'ja' }).heard.industry, 'retail');
  // the page data names services neutrally on the Japanese page
  assert.equal(page.integrations.sms.name, 'SMS配信');
  assert.equal(expand(compact(mj, 'uz')).integrations.sms.name, 'SMS (Eskiz, Play Mobile)');
});

test('working days skip weekends and holidays (Navroʻz, 1 September)', () => {
  assert.equal(isWorkday('2027-03-22'), true);
  assert.equal(isWorkday('2027-03-21'), false); // Sunday and Navroʻz
  assert.equal(isWorkday('2028-03-21'), false); // Tuesday, Navroʻz
  assert.equal(isWorkday('2027-09-01'), false); // Wednesday, Independence Day
  // one week from Monday 2028-03-20: 20, (21 Navroʻz), 22, 23, 24, 27 → Monday 27
  assert.equal(endOfWork('2028-03-20', 1), '2028-03-27');
  // one week from Monday 2027-08-30: 30, 31, (1 Sep), 2, 3, 6
  assert.equal(endOfWork('2027-08-30', 1), '2027-09-06');
  assert.equal(firstMonday('2026-10-21'), '2026-11-02');
  assert.deepEqual(holidaysBetween('2028-03-20', '2028-03-24'), [{ date: '2028-03-21', k: 2 }]);
});

test('formatting: soʻm first, NBSP only (no U+202F or U+2009), Russian plural on the upper bound', () => {
  assert.equal(F.uzs([38e6, 52e6], 'uz'), '38–52 mln soʻm');
  assert.equal(F.uzs([38e6, 52e6], 'ru'), '38–52 млн\u00a0сум');
  assert.equal(F.uzs([38e6, 52e6], 'en'), 'UZS 38–52 mln');
  assert.equal(F.uzs([4.5e6, 6e6], 'uz'), '4,5–6 mln soʻm');
  assert.equal(F.uzs([4.5e6, 6e6], 'en'), 'UZS 4.5–6 mln');
  assert.equal(F.usd([3000, 4100], 'uz'), '$3\u00a0000–4\u00a0100');
  assert.equal(F.usd([3000, 4100], 'en'), '$3,000–4,100');
  assert.equal(F.weeks([2, 3], 'ru'), '2–3\u00a0недели');
  assert.equal(F.weeks([4, 21], 'ru'), '4–21\u00a0неделя');
  assert.equal(F.weeks([1, 1], 'en'), '1\u00a0week');
  for (const l of ['uz', 'ru', 'en', 'ja']) for (const s of [F.uzs([1e5, 9e9], l), F.usd([1, 1e6], l), F.weeks([1, 30], l), F.rateLine(rate, l), F.dateRange('2026-12-30', '2027-01-12', l, MONTHS[l])]) assert.doesNotMatch(s, /[\u202f\u2009]/);
});

test('canon sorts keys at every depth', () => {
  assert.equal(canon({ b: 1, a: { d: [3, { y: 1, x: 2 }], c: null } }), '{"a":{"c":null,"d":[3,{"x":2,"y":1}]},"b":1}');
});

test('priceResult is the same in two calls and its totals equal plan()', () => {
  const pick = match(m, { intake: { industry: 'clinics', branches: '2-5' }, lang: 'en' });
  const a = priceResult(m, { pick, lang: 'en', rate }), b = priceResult(m, { pick, lang: 'en', rate });
  assert.deepEqual(a, b);
  assert.deepEqual(a.plan.totals, plan(m, a.solutions, defaultSelection(a.solutions), rate).totals);
  assert.ok(a.solutions.every((s) => solId(s) === s.catalogue_id));
});

test('a dependency chain is a sequence, not parallel work: no overhead, parallel false (rv2a/par.mjs)', () => {
  const mm = { pricing: { round: { usd: 100 }, shared: {}, parallel_overhead: 0.1 }, byId: new Map() };
  const A = { catalogue_id: 'a', weeks: { mvp: [7, 11], full: [13, 20] }, usd: { mvp: [9900, 15500], full: [23000, 39000] }, uzs: {}, monthly_usd: [0, 0], depends_on: [] };
  const B = { catalogue_id: 'b', weeks: { mvp: [2, 4], full: [6, 9] }, usd: { mvp: [2300, 3500], full: [6800, 11500] }, uzs: {}, monthly_usd: [0, 0], depends_on: ['a'] };
  const r = plan(mm, [A, B], [{ id: 'a', state: 'mvp' }, { id: 'b', state: 'mvp' }], rate);
  assert.deepEqual(r.totals.weeks, [9, 15]);
  assert.equal(r.totals.parallel, false);
  // a chain through a third track stays a sequence; an independent track that runs alongside is parallel
  const C = { ...B, catalogue_id: 'c', depends_on: ['b'] };
  const chain = plan(mm, [A, B, C], [{ id: 'a', state: 'mvp' }, { id: 'b', state: 'mvp' }, { id: 'c', state: 'mvp' }], rate);
  assert.equal(chain.totals.parallel, false);
  assert.deepEqual(chain.totals.weeks, [11, 19]);
  const D = { ...B, catalogue_id: 'd', depends_on: [] };
  const two = plan(mm, [A, D], [{ id: 'a', state: 'mvp' }, { id: 'd', state: 'mvp' }], rate);
  assert.equal(two.totals.parallel, true);
  // the overhead is the overlapping track's weeks × 0.1 on each bound: [7 + .2, 11 + .4] → [7, 12]
  assert.deepEqual(two.totals.weeks, [7, 12]);
  // a dependant of a dependency built in full still follows a chain: it starts at the MVP end, by design
  const E = { ...B, catalogue_id: 'e', depends_on: [], weeks: { mvp: [2, 4], full: [6, 9] } };
  const late = plan(mm, [A, { ...E, depends_on: ['a'] }], [{ id: 'a', state: 'full' }, { id: 'e', state: 'mvp' }], rate);
  assert.equal(late.totals.parallel, false);
});

test('payback beyond 36 months is shown as the qualitative line, not a number', async () => {
  const { paybackShown, PAYBACK_CAP_MONTHS } = await import('./price.js');
  assert.equal(PAYBACK_CAP_MONTHS, 36);
  const hours = [{ key: 'hours_per_week', value: 30 }, { key: 'hourly_cost_usd', value: 3 }];
  // 30 h × 4.33 × $3 = $389.7 a month, less $50 running: about 1 351–1 940 months for $13 500–19 500 is not shown
  assert.deepEqual(paybackShown('hours_saved', hours, [13500, 19500], [40, 60]), { months: null, why: 'long' });
  assert.deepEqual(paybackShown('hours_saved', [hours[0]], [13500, 19500], [40, 60]), { months: null, why: 'na' });
  const orders = [{ key: 'orders_per_month', value: 1000 }, { key: 'uplift_pct', value: 10 }, { key: 'avg_order_usd', value: 10 }, { key: 'margin_pct', value: 30 }];
  assert.deepEqual(paybackShown('more_orders', orders, [2000, 3000], [20, 80]), { months: [8, 12] });
  const a = enrichSolution(m, sol(1, 'ind-clinic'), { lang: 'uz', rate, detail: { needs: [], team: [], stack: [], risks: [], impact: { model: 'hours_saved', summary: 's', inputs: hours.map((i) => ({ ...i, label: 'l', basis: 'assumed' })) } } });
  assert.equal(a.detail.impact.payback_months, null);
});
