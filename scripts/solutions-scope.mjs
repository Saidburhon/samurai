// npm run solutions:scope: the scope lists ("what you get") and the caveats of every catalogue solution in Uzbek,
// Russian and Japanese, written once by the model from the catalogue's English working text (content/solutions.json
// scope.mvp, scope.full and notes, which are English only) and committed as content/solutions-scope.json.
// The English lists are the catalogue's own sentences split at ";" (no model). Every string passes the copy guard
// (okina, tutuq, no yarat-, no handles or links). The solution pages (scripts/pages/solutions.mjs) read this file;
// content/solutions.json stays authoritative: re-run after its scope text changes (only changed entries are re-sent).
// Cost: six parallel calls, about $1 for the whole catalogue. Usage: node scripts/solutions-scope.mjs [--all]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import Anthropic from '@anthropic-ai/sdk';
import { guard } from '../worker/guard.js';
import { costUsd } from '../worker/samurai.js';

const J = (p) => JSON.parse(readFileSync(p, 'utf8'));
const OUT = 'content/solutions-scope.json';
const cat = J('content/solutions.json');
const key = process.env.ANTHROPIC_API_KEY || (existsSync('.dev.vars') ? (readFileSync('.dev.vars', 'utf8').match(/^ANTHROPIC_API_KEY\s*=\s*"?([^"\n]+)"?/m) || [])[1] : '');
if (!key) { console.error('solutions:scope: no ANTHROPIC_API_KEY'); process.exit(1); }
const client = new Anthropic({ apiKey: key, maxRetries: 2, timeout: 600_000 });

// the English list items: the catalogue sentence split at ";", first letter up, no final full stop
export const splitScope = (s) => String(s || '').split(/;\s+/).map((x) => x.trim().replace(/\.$/, '')).filter(Boolean).map((x) => x[0].toUpperCase() + x.slice(1));
const hash = (s) => createHash('sha256').update(JSON.stringify([s.scope, s.notes])).digest('hex').slice(0, 12);

const SYSTEM = `You translate the scope lists of Qilich's solution catalogue. Qilich is a Japanese-run IT development company in Tashkent, Uzbekistan. The lists appear on its public solution pages, under "what the first version includes" and "what the full version adds", plus an optional caveat note.
For every entry you get an id, the English MVP items, the English full-version items and an optional English note. Return the same number of items, in the same order, in:
- uz: Uzbek in Latin script, plain business Uzbek as a Tashkent business owner writes it. The okina is ʻ (U+02BB: oʻ, gʻ), the tutuq belgisi is ʼ (U+02BC: maʼlumot, taʼlim). Never use any form of the verb "yaratmoq" (yaratish, yaratamiz, yaratilgan...): use qurish, ishlab chiqish, qilish, tayyorlash.
- ru: Russian, plain business Russian. No em-dash asides.
- ja: Japanese for a Japanese company reading an offshore developer's catalogue: natural business Japanese, 体言止め, not a literal translation.
Rules for every language: keep product, platform and standard names exactly as given (Telegram, WhatsApp, 1C, Click, Payme, Uzum, amoCRM, Bitrix24, iiko, Didox, E-IMZO, MyID, OneID, Google Sheets, Claude API, API, CRM, ERP, POS, SMS, GPS, QR...). Keep every fact; add nothing, no numbers, prices or promises that are not in the English. Items stay short (a phrase, not a paragraph), start with a capital letter where the script has one, and end without a full stop. The note is one or two plain sentences; when the English note is null, return empty strings.
Return every id you were given, once.`;

const LIST = { type: 'array', items: { type: 'string' } };
const LANGSET = { type: 'object', additionalProperties: false, required: ['uz', 'ru', 'ja'], properties: { uz: LIST, ru: LIST, ja: LIST } };
const NOTE = { type: 'object', additionalProperties: false, required: ['uz', 'ru', 'ja'], properties: { uz: { type: 'string' }, ru: { type: 'string' }, ja: { type: 'string' } } };
const schema = {
  type: 'object', additionalProperties: false, required: ['items'],
  properties: { items: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['id', 'mvp', 'full', 'note'], properties: { id: { type: 'string' }, mvp: LANGSET, full: LANGSET, note: NOTE } } } },
};

async function batch(list) {
  const lines = list.map((s) => `id: ${s.id}\nMVP:\n${splitScope(s.scope.mvp).map((x) => `- ${x}`).join('\n')}\nFULL:\n${splitScope(s.scope.full).map((x) => `- ${x}`).join('\n')}\nNOTE: ${s.notes || 'null'}`).join('\n\n');
  const msg = await client.messages.stream({
    model: 'claude-opus-5-5', max_tokens: 32000, system: SYSTEM,
    output_config: { effort: 'low', format: { type: 'json_schema', schema } },
    messages: [{ role: 'user', content: lines }],
  }).finalMessage();
  const text = msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  return { items: JSON.parse(text).items, cost: costUsd(msg.usage, 'claude-opus-5-5'), stop: msg.stop_reason };
}

const prev = existsSync(OUT) ? J(OUT).solutions : {};
const all = process.argv.includes('--all') ? cat.solutions : cat.solutions.filter((s) => prev[s.id]?.hash !== hash(s));
const out = { ...prev };
const problems = [];
let cost = 0;
if (all.length) {
  const n = Math.min(6, all.length), size = Math.ceil(all.length / n);
  const res = await Promise.all(Array.from({ length: n }, (_, i) => batch(all.slice(i * size, (i + 1) * size))));
  for (const r of res) {
    cost += r.cost;
    if (r.stop !== 'end_turn') problems.push(`stop ${r.stop}`);
    for (const it of r.items) {
      const s = all.find((x) => x.id === it.id);
      if (!s) { problems.push(`unknown id ${it.id}`); continue; }
      const en = { mvp: splitScope(s.scope.mvp), full: splitScope(s.scope.full) };
      const entry = { hash: hash(s), mvp: { en: en.mvp }, full: { en: en.full }, notes: s.notes ? { en: s.notes } : null };
      let ok = true;
      for (const sc of ['mvp', 'full']) {
        for (const l of ['uz', 'ru', 'ja']) {
          const items = (it[sc][l] || []).map((x) => guard(x, l)).filter(Boolean).map((x) => x.replace(/[.。]$/, ''));
          if (items.length !== en[sc].length) { problems.push(`${s.id} ${sc}.${l}: ${items.length} items for ${en[sc].length}`); ok = items.length > 0; }
          entry[sc][l] = items;
        }
      }
      if (s.notes && it.note) for (const l of ['uz', 'ru', 'ja']) { const g = guard(it.note[l], l); if (g) entry.notes[l] = g; else problems.push(`${s.id} note.${l} dropped`); }
      if (ok) out[s.id] = entry;
    }
  }
}
const missing = cat.solutions.filter((s) => !out[s.id]).map((s) => s.id);
const file = {
  _readme: 'Written by scripts/solutions-scope.mjs: the scope lists and caveats of content/solutions.json in uz, ru, en and ja (English split from the catalogue; the others written by the model, copy-guarded). Needs a native reviewer. Do not edit the hash fields.',
  made: new Date().toISOString().slice(0, 10),
  solutions: Object.fromEntries(cat.solutions.filter((s) => out[s.id]).map((s) => [s.id, out[s.id]])),
};
writeFileSync(OUT, JSON.stringify(file, null, 1) + '\n');
console.log(`solutions:scope: sent ${all.length}, have ${Object.keys(file.solutions).length}/${cat.solutions.length}, missing ${missing.length ? missing.join(', ') : 'none'}, $${cost.toFixed(2)}`);
for (const p of problems) console.log(`  ${p}`);
process.exit(missing.length ? 1 : 0);
