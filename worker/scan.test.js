// node --test worker/: the streaming scanner reports each finished piece once, in order, whatever the chunking
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createScanner } from './scan.js';

const doc = {
  status: 'ok',
  heard: { summary: 'Restoran, "ikki" filial {x}', quotes: ['buyurtma, telefon'], industry: 'restaurants', size: 'small' },
  questions: [{ id: 'q1', text: 'Nechta?', options: [{ id: 'a', label: '1', effect: { targets: [], size: 'keep', add_modifiers: [], remove_modifiers: [], add_integrations: [], drop: [] } }] }],
  solutions: [{ catalogue_id: 'tg-order-bot', difficulty: 2, why: 'a\\b ] } [' }, { catalogue_id: 'web-corporate', difficulty: 3 }],
  not_recommended: [],
  roadmap_note: 'Avval bot.',
  first_step: 'Menyu.',
  assumptions: ['bir', 'ikki ] ,'],
  n: 5,
};
const expect = [];
for (const [k, v] of Object.entries(doc)) {
  if (Array.isArray(v)) v.forEach((x, i) => expect.push([k, i, x]));
  expect.push([k, -1, v]);
}

function run(text, sizes) {
  const got = [];
  const s = createScanner((e) => got.push([e.key, e.index, e.value]));
  let at = 0, k = 0;
  while (at < text.length) { const n = sizes[k++ % sizes.length]; s.push(text.slice(at, at + n)); at += n; }
  return got;
}

test('compact and pretty JSON, any chunk size', () => {
  for (const text of [JSON.stringify(doc), JSON.stringify(doc, null, 2)]) {
    for (const sizes of [[1], [2, 3], [7], [64], [text.length]]) assert.deepEqual(run(text, sizes), expect);
  }
});

test('nothing half-written is reported, and reset starts over', () => {
  const got = [];
  const s = createScanner((e) => got.push(e));
  const text = JSON.stringify(doc);
  s.push(text.slice(0, text.indexOf('web-corporate')));
  assert.ok(got.every((e) => !(e.key === 'solutions' && e.index === 1)));
  assert.equal(got.filter((e) => e.key === 'solutions').length, 1);
  s.reset();
  s.push(text);
  assert.equal(got.filter((e) => e.key === 'status').length, 2);
});
