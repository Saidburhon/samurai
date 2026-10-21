// node --test: a share link is data anyone can type (src/samurai/sanitize.js). Genuine payloads pass unchanged, so
// their signatures still verify; hostile ones lose the field or the whole link (SOLUTIONS-SPEC T20, sec2a must-fix 1–2).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalise } from './catalogue.js';
import { cleanPayload, cleanPick, cleanDetail, cleanMeta } from '../samurai/sanitize.js';

const J = (p) => JSON.parse(readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8'));
const m = normalise(J('content/solutions.json'), J('content/solutions-extra.json'), J('content/pricing.json'));
const samples = Object.values(J('content/samurai-samples.json').samples).flat();

test('every committed sample passes the sanitizer unchanged (a genuine estimate keeps its signature)', () => {
  assert.ok(samples.length >= 24);
  for (const x of samples) {
    assert.deepEqual(cleanPick(x.pick, m), x.pick, `${x.meta.lang}/${x.id} pick`);
    for (const [k, d] of Object.entries(x.details)) assert.deepEqual(cleanDetail(d, m), d, `${x.meta.lang}/${x.id} ${k}`);
    const meta = cleanMeta(x.meta);
    for (const k of ['brief_no', 'lang', 'generated_at', 'catalogue_version', 'rate']) assert.deepEqual(meta[k], x.meta[k], `${x.id} meta.${k}`);
  }
});

const genuine = () => structuredClone({ v: 1, src: 'model', meta: samples[0].meta, pick: samples[0].pick, details: samples[0].details, sig: 'A'.repeat(22), state: { sel: [['ind-clinic', 'mvp']], ans: {}, ticks: [], budget: 0, deadline: '', start: '2026-10-26', cur: 'uzs', impact: {} } });

test('a hostile link loses what it injected: markup in difficulty, states, ids, rates and the unsigned list', () => {
  const p = genuine();
  p.pick.solutions[0].difficulty = '<img src=x onerror="window.__xss=1">';
  p.pick.solutions[1].scope = '"><img src=x>';
  p.pick.solutions[1].priority = 'must"onmouseover="x';
  p.pick.not_recommended = [{ catalogue_id: '"><svg onload=x>', why: 'x' }, { catalogue_id: 'web-corporate', why: 42 }];
  p.state.sel = [['ind-clinic', '"><img src=x>'], ['<b>', 'mvp']];
  p.state.ticks = ['"><img>:1'];
  p.nr = [{ catalogue_id: 'web-corporate', title: 'TEST-SPOOF: oldindan 50% toʻlov', why: 'kafolat' }];
  p.meta.valid_until = '2099-01-01';
  const c = cleanPayload(p, m);
  const html = JSON.stringify(c);
  assert.ok(!/<img|<svg|<b>|onerror|onload|onmouseover|TEST-SPOOF/.test(html), 'no markup or spoofed text survives');
  assert.ok(!c.pick.solutions.some((s) => typeof s.difficulty !== 'number'), 'difficulty is a number');
  assert.equal(c.pick.solutions.length, samples[0].pick.solutions.length - 1, 'the solution with a broken difficulty is dropped');
  assert.ok(c.pick.solutions.every((s) => ['mvp', 'full'].includes(s.scope) && ['must', 'should', 'could'].includes(s.priority)));
  assert.deepEqual(c.pick.not_recommended, []);
  assert.deepEqual(c.state.sel, []);
  assert.deepEqual(c.state.ticks, []);
  assert.equal('nr' in c, false, 'the unsigned list never travels on');
  assert.equal(cleanPayload({ ...genuine(), meta: { ...genuine().meta, rate: { uzs_per_usd: 'x', date: 'now' } } }, m), null);
  assert.equal(cleanPayload({ ...genuine(), meta: { ...genuine().meta, brief_no: '<b>' } }, m), null);
  assert.equal(cleanPayload('nope', m), null);
});

test('a genuine payload round-trips to the same signed part', () => {
  const p = genuine(), c = cleanPayload(p, m);
  assert.deepEqual(c.pick, p.pick);
  assert.deepEqual(c.details, p.details);
  assert.deepEqual(c.state.sel, p.state.sel);
});
