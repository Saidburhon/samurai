// node --test worker/: lead validation and the lead score (SOLUTIONS-SPEC §6, §8 T19, T37)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { leadScore, parseLead, leadText, sendLead } from './lead.js';

const LINKS = JSON.parse(readFileSync(new URL('./fixtures/lead-links.json', import.meta.url), 'utf8'));

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

test('an invalid Uzbek number is refused on every page; other countries only where the page takes them (T19)', () => {
  for (const lang of ['uz', 'ru', 'en', 'ja']) for (const phone of ['+99890123', '+998 90 123', '+998 90 123 45 6', '+998 90 123 45 678']) assert.equal(parseLead({ lang, name: 'A', phone }).error, 'phone', `${lang} ${phone}`);
  assert.equal(parseLead({ lang: 'en', name: 'Ann', phone: '+44 20 7946 0958' }).error, 'phone'); // the uz/ru/en lead sheet takes +998 only
  assert.equal(parseLead({ lang: 'ja', name: '田中', phone: '+81 90 1234 5678' }).lead.phone, '+819012345678');
  assert.equal(parseLead({ lang: 'en', name: 'Ann', contact: '+44 20 7946 0958' }).lead.phone, '+442079460958'); // the contact form's free field
  assert.equal(parseLead({ lang: 'en', name: 'Ann', contact: '+998 90 12' }).error, 'phone');
  assert.equal(parseLead({ lang: 'uz', name: 'Aziz', contact: '998aziz@example.com' }).lead.email, '998aziz@example.com');
});

const bigBrief = (link, text) => ({ brief_no: 'QL-2610-7F3A', summary: 'Restoran'.repeat(30), size: 'medium', source: 'samurai', solutions: [1, 2, 3, 4].map((i) => ({ title: `Yechim ${i} `.repeat(6), state: 'mvp', weeks: [4, 8], uzs: [20e6, 40e6] })), totals: { usd: [9000, 15000], uzs: [108e6, 180e6], weeks: [9, 15] }, text, link });
test('the estimate link reaches the owner whole; the visitor text gives way first (T19)', () => {
  for (const k of ['short', 'long', 'ja']) {
    const link = LINKS[k].link;
    const { lead } = parseLead({ lang: 'uz', name: 'Aziz', phone: '+998901234567', brief: bigBrief(link, 'Matn '.repeat(300)) });
    assert.equal(lead.brief.link, link, `${k}: the parser keeps the link`);
    const t = leadText(lead, '2026-10-21');
    assert.equal(t.link, link);
    assert.ok(t.plain.endsWith(`\nSmeta: ${link}`), `${k}: the e-mail text ends with the whole link`);
    assert.ok(t.html.length <= 4096, `${k}: the head fits one Telegram message (${t.html.length})`);
    assert.match(t.head, /Matn: «Matn Matn/);
    assert.match(t.head, /^ILIQ|^ISSIQ|^SOVUQ/);
  }
  // a link past the cap is dropped whole, never cut
  assert.equal(parseLead({ lang: 'uz', name: 'A', phone: '+998901234567', brief: bigBrief(`https://qilich.com/samurai/#r=z${'A'.repeat(13000)}`, '') }).lead.brief.link, '');
});

test('Telegram: the message, then the link as its own message, or as a file when it is longer than a message', async () => {
  const sent = [];
  const fake = async (url, init) => {
    const method = url.split('/').pop();
    let body = init.body;
    if (body instanceof FormData) { const o = {}; for (const [k, v] of body.entries()) o[k] = typeof v === 'string' ? v : await v.text(); body = o; } else body = JSON.parse(body);
    sent.push({ method, body });
    return new Response(JSON.stringify({ ok: true, result: { message_id: 7 } }), { status: 200 });
  };
  const env = { TELEGRAM_BOT_TOKEN: 't', TELEGRAM_CHAT_ID: '1' };
  for (const [k, method] of [['short', 'sendMessage'], ['long', 'sendDocument']]) {
    sent.length = 0;
    const { lead } = parseLead({ lang: 'uz', name: 'Aziz', phone: '+998901234567', brief: bigBrief(LINKS[k].link, 'Matn') });
    const r = await sendLead(env, lead, '2026-10-21', fake);
    assert.equal(r.status, 200);
    assert.equal(sent.length, 2);
    assert.equal(sent[0].method, 'sendMessage');
    assert.ok(!sent[0].body.text.includes('#r='), 'the first message carries no link');
    assert.equal(sent[1].method, method);
    const carried = method === 'sendMessage' ? sent[1].body.text : sent[1].body.document;
    assert.ok(carried.includes(method === 'sendMessage' ? LINKS[k].link : LINKS[k].link.replace(/&/g, '&amp;')), `${k}: the link arrives whole`);
  }
});
