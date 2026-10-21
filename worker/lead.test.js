// node --test worker/: lead validation and the lead score (SOLUTIONS-SPEC §6, §8 T19, T37)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leadScore, parseLead, leadText } from './lead.js';

const brief = (o = {}) => ({ brief_no: 'QL-2610-7F3A', solutions: [{ title: 'Bot', state: 'mvp', weeks: [4, 6], uzs: [18e6, 26e6] }], totals: { usd: [1500, 2200], uzs: [18e6, 26e6], weeks: [4, 6] }, ...o });
test('ISSIQ, ILIQ, SOVUQ as §6 says', () => {
  const today = '2026-10-21';
  // budget ≥ min (+2), deadline in 8 weeks (+1), medium (+1), 2 solutions (+1) = 5
  const hot = leadScore(brief({ budget_usd: 3000, deadline: '2026-12-01', size: 'medium', solutions: [{ state: 'mvp' }, { state: 'full' }] }), { today });
  assert.equal(hot.level, 'ISSIQ'); assert.equal(hot.score, 5);
  assert.equal(leadScore(brief({ budget_usd: 1500 }), { today }).level, 'ILIQ'); // +2
  assert.equal(leadScore(brief({ size: 'large' }), { today, visits: 2 }).level, 'ILIQ'); // +1 +1
  assert.equal(leadScore(brief({ budget_usd: 1000, deadline: '2027-06-01' }), { today }).level, 'SOVUQ'); // 0
  assert.equal(leadScore(brief({ solutions: [{ state: 'mvp' }, { state: 'off' }] }), { today }).score, 0);
  assert.deepEqual(hot.why, ['byudjet smetaga mos', 'muddat 8 hafta ichida', 'oʻrta biznes', '2 ta yechim']);
});
test('an invalid phone is refused; +998 and nine digits pass; the contact form may give an e-mail', () => {
  assert.equal(parseLead({ lang: 'uz', name: 'Aziz', phone: '+998 90 12' }).error, 'phone');
  assert.equal(parseLead({ lang: 'uz', name: '', phone: '+998901234567' }).error, 'name');
  assert.equal(parseLead({ lang: 'uz', name: 'Aziz', phone: '+998 90 123 45 67' }).lead.phone, '+998901234567');
  assert.equal(parseLead({ lang: 'en', name: 'Ann', contact: 'ann@example.com' }).lead.email, 'ann@example.com');
  assert.equal(parseLead({ lang: 'ja', name: '田中', phone: '+81 90 1234 5678' }).lead.phone, '+819012345678');
});
test('the message is Uzbek, HTML-escaped, and carries the score line', () => {
  const { lead } = parseLead({ lang: 'ru', name: '<b>Aziz</b>', phone: '+998901234567', slot: 'Ertaga 09:00–12:00', brief: brief({ budget_usd: 2000, summary: 'Restoran' }) });
  const t = leadText(lead, '2026-10-21');
  assert.match(t.plain, /^ILIQ · Smeta QL-2610-7F3A\nSabab: byudjet smetaga mos/);
  assert.match(t.html, /&lt;b&gt;Aziz&lt;\/b&gt;/);
  assert.match(t.plain, /1\. Bot · MVP · 4–6\u00a0hafta · 18–26 mln soʻm/);
  assert.ok(t.html.length <= 4096);
});
