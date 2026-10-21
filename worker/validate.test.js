// node --test worker/: validation of model output (SOLUTIONS-SPEC §2.8.4)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalise } from '../src/shared/catalogue.js';
import { context, validateHeard, validateQuestion, validateSolution, finalizePick, validateDetail, cut } from './validate.js';
import { buildSchemas } from './schema.js';
import { buildSystem } from './prompt.js';

const J = (p) => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), 'utf8'));
const m = normalise(J('content/solutions.json'), J('content/solutions-extra.json'), J('content/pricing.json'));
const ctx = context(m, { lang: 'uz', text: "Chilonzorda 3 filialli stomatologiya, yozuvlar daftarda", intake: { industry: 'clinics' } });

test('unknown ids are dropped, duplicates keep the first, custom needs based_on', () => {
  const taken = new Set();
  assert.equal(validateSolution(ctx, { catalogue_id: 'nope' }, 1, taken), null);
  const a = validateSolution(ctx, { catalogue_id: 'tg-booking-bot', title: 'Bron boti', why: 'Kerak.', priority: 'must', scope: 'mvp', size: 'm', modifiers: ['multi_branch', 'bogus'], integrations: ['payme', 'telegram'], depends_on: ['ind-clinic', 'x'], difficulty: 5 }, 1, taken);
  assert.deepEqual(a.modifiers, ['multi_branch']);
  assert.deepEqual(a.integrations, ['payme']); // telegram is included in Telegram entries
  assert.ok(a.difficulty <= m.byId.get('tg-booking-bot').difficulty + 2);
  assert.equal(validateSolution(ctx, { catalogue_id: 'tg-booking-bot' }, 2, taken), null);
  assert.equal(validateSolution(ctx, { catalogue_id: 'custom', based_on: [] }, 3, taken), null);
  const c = validateSolution(ctx, { catalogue_id: 'custom', based_on: ['ind-clinic', 'zz'], title: 'Klinika tizimi' }, 3, taken);
  assert.deepEqual(c.based_on, ['ind-clinic']);
});

test('quotes must occur in the visitor’s text (case, spaces, okina variants folded)', () => {
  const h = validateHeard(ctx, { summary: 'Stomatologiya.', quotes: ['3 filialli  stomatologiya', 'yozuvlar daftarda', 'invented phrase'], industry: 'clinics', size: 'small' });
  assert.deepEqual(h.quotes, ['3 filialli stomatologiya', 'yozuvlar daftarda']);
});

test('questions need 2–4 options; targets and drops keep only the chosen; depends_on never circles', () => {
  assert.equal(validateQuestion(ctx, { id: 'q', text: 'Nechta?', options: [{ id: 'a', label: '1', effect: {} }] }, 1), null);
  const q = validateQuestion(ctx, { id: 'Filiallar soni', text: 'Nechta filial?', options: [{ id: 'a', label: '1', effect: { targets: ['tg-booking-bot', 'web-corporate'], size: 'l', drop: ['web-corporate'] } }, { id: 'a', label: '2–5', effect: {} }] }, 1);
  assert.equal(q.id, 'filiallar_soni');
  assert.notEqual(q.options[0].id, q.options[1].id);
  const taken = new Set();
  const s1 = validateSolution(ctx, { catalogue_id: 'tg-booking-bot', depends_on: ['biz-call-centre'] }, 1, taken);
  const s2 = validateSolution(ctx, { catalogue_id: 'biz-call-centre', depends_on: ['tg-booking-bot'] }, 2, taken);
  const p = finalizePick(ctx, { status: 'ok', not_recommended: [{ catalogue_id: 'tg-booking-bot', why: 'x' }, { catalogue_id: 'mob-booking-app', why: 'Bot yetarli.' }] }, { heard: validateHeard(ctx, {}), questions: [q], solutions: [s1, s2] });
  assert.equal(p.solutions.filter((s) => s.depends_on.length).length, 1);
  assert.deepEqual(p.questions[0].options[0].effect.targets, ['tg-booking-bot']);
  assert.deepEqual(p.questions[0].options[0].effect.drop, []);
  assert.deepEqual(p.not_recommended.map((x) => x.catalogue_id), ['mob-booking-app']);
});

test('not_business drops solutions; need_more keeps one', () => {
  const taken = new Set();
  const s = [1, 2].map((n) => validateSolution(ctx, { catalogue_id: n === 1 ? 'tg-booking-bot' : 'web-corporate' }, n, taken));
  assert.equal(finalizePick(ctx, { status: 'not_business' }, { heard: validateHeard(ctx, {}), questions: [], solutions: s }).solutions.length, 0);
  assert.equal(finalizePick(ctx, { status: 'need_more' }, { heard: validateHeard(ctx, {}), questions: [], solutions: s }).solutions.length, 1);
});

test('detail: four phases in order, impact without its inputs becomes none, lengths cut at a word', () => {
  const d = validateDetail(ctx, { deliverables_mvp: ['Bot', 'x'.repeat(200)], phases: [{ key: 'build', deliverable: 'Qurish' }], team: [{ role: 'pm', count: 1 }, { role: 'pm', count: 2 }, { role: 'cto', count: 1 }], stack: ['nodejs', 'cobol'], risks: [{ text: 'Kechikish', mitigation: 'Reja', adds_weeks: 9 }], needs: ['Hisob'], impact: { model: 'hours_saved', summary: 'Vaqt tejaladi.', inputs: [{ key: 'hours_per_week', label: 'Soat', value: 10, basis: 'assumed' }] } });
  assert.deepEqual(d.phases.map((p) => p.key), ['plan', 'build', 'test', 'launch']);
  assert.equal(d.phases[1].deliverable, 'Qurish');
  assert.deepEqual(d.team, [{ role: 'pm', count: 1 }]);
  assert.deepEqual(d.stack, ['nodejs']);
  assert.equal(d.risks[0].adds_weeks, 0);
  assert.equal(d.impact.model, 'none');
  assert.ok([...d.deliverables_mvp[1]].length <= 70);
  assert.equal(cut('bir ikki uch tort besh', 12), 'bir ikki…');
});

test('schemas are byte-stable and the prompt is deterministic', () => {
  assert.equal(JSON.stringify(buildSchemas(m)), JSON.stringify(buildSchemas(m)));
  assert.equal(buildSystem(m), buildSystem(m));
  const s = buildSchemas(m).pick;
  assert.deepEqual(Object.keys(s.properties), ['status', 'heard', 'questions', 'solutions', 'not_recommended', 'roadmap_note', 'first_step', 'assumptions']);
  const walk = (o) => { if (o && typeof o === 'object') { if (o.type === 'object') { assert.equal(o.additionalProperties, false); assert.deepEqual(o.required, Object.keys(o.properties)); } Object.values(o).forEach(walk); } };
  walk(buildSchemas(m));
  assert.ok(buildSystem(m).length < 70000, `prompt ${buildSystem(m).length} chars`);
});

test('tidy drops the junk tails the model left in short fields, and leaves clean text alone (rv2a must-fix 3)', async () => {
  const { tidy } = await import('./validate.js');
  const bad = [
    ['Uch filial, turli rollar va daftardan qogʻozsiz ishlashga oʻtish kerak."', 'uz', 'Uch filial, turli rollar va daftardan qogʻozsiz ishlashga oʻtish kerak.'],
    ['Ustalar jadvali va boʻsh vaqtlarni toʻgʻri koʻrsatish kerak.ʻ', 'uz', 'Ustalar jadvali va boʻsh vaqtlarni toʻgʻri koʻrsatish kerak.'],
    ['Exceldagi eski toʻlov maʼlumotlarini koʻchirish va toʻlovlarni ulash kerak. ҳ', 'uz', 'Exceldagi eski toʻlov maʼlumotlarini koʻchirish va toʻlovlarni ulash kerak.'],
    ['Three branches, several staff roles and moving paper records into the system.uh', 'en', 'Three branches, several staff roles and moving paper records into the system.'],
    ["Dealer-specific prices and balances must sync reliably with your 1C setup. ','. ' '", 'en', 'Dealer-specific prices and balances must sync reliably with your 1C setup.'],
    ['Mashina va buyurtmani bogʻlash kerak.Ustalar odatlanishi', 'uz', 'Mashina va buyurtmani bogʻlash kerak.'],
    ['Qogʻozdan oʻtish kerak..', 'uz', 'Qogʻozdan oʻtish kerak.'],
    ['Buyurtmani kuryerga berish.Bot', 'uz', 'Buyurtmani kuryerga berish.'],
  ];
  for (const [i, lang, want] of bad) assert.equal(tidy(i, lang), want);
  for (const [i, lang] of [['Standart bot, menyu va yetkazish manzili, bitta filial', 'uz'], ['Built with Next.js', 'en'], ['Нужно перенести данные, т.е. клиентов', 'ru'], ['He said "hello."', 'en'], ['日報項目の標準化が主な課題です。', 'ja'], ['Hmm...', 'en'], ['Uch filial. Har birida alohida kassa', 'uz'], ['Kassa «Mijoz».', 'uz']]) assert.equal(tidy(i, lang), i);
});

test('a long summary is cut at a clause boundary and ends with "…", never mid-clause (rv2a must-fix 2)', async () => {
  const { cut } = await import('./validate.js');
  const en = cut('A city freight company with 15 drivers where drivers report on paper, clients keep calling about cargo location, and fuel use is not tracked at all by anyone', 150);
  assert.equal(en, 'A city freight company with 15 drivers where drivers report on paper, clients keep calling about cargo location…');
  const ru = cut('Фитнес-клуб ведёт базу клиентов в Excel, на групповые тренировки записываются через Telegram, а оплату принимают только наличными на ресепшене клуба, и владелец не видит, сколько абонементов продано за месяц', 150);
  assert.match(ru, /…$/);
  assert.ok(!/, а…$/.test(ru));
  assert.equal(cut('Short one.', 150), 'Short one.');
  assert.ok([...cut('x '.repeat(200), 150)].length <= 150);
});
