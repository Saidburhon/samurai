// node --test worker/: the spend of a run that is cut short (sec2a must-fix 5) and the signature only on a genuine
// estimate (rv2a must-fix 4). A fake Anthropic client streams the events the API sends; nothing leaves the machine.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalise } from '../src/shared/catalogue.js';
import { runSamurai } from './samurai.js';

const J = (p) => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), 'utf8'));
const m = normalise(J('content/solutions.json'), J('content/solutions-extra.json'), J('content/pricing.json'));
const rate = { uzs_per_usd: 12012.3, date: '2026-10-21', source: 'cbu' };
const input = { lang: 'uz', intake: {}, text: 'Restoran, buyurtmalar telefon orqali keladi', preselected: [], answers: [], refine: null };
const usage = { input_tokens: 1200, cache_read_input_tokens: 22000, cache_creation_input_tokens: 0, output_tokens: 1 };
const solution = { catalogue_id: 'tg-order-bot', based_on: [], title: 'Buyurtma boti', why: 'Buyurtmalar telefonda yoʻqoladi.', priority: 'must', scope: 'mvp', size: 's', modifiers: [], integrations: [], depends_on: [], difficulty: 2, difficulty_reason: 'Oddiy menyu.' };
const pickHead = `{"status":"ok","heard":{"summary":"Restoran, buyurtmalar telefon orqali keladi.","quotes":[],"industry":"restaurants","size":"small"},"questions":[],"solutions":[${JSON.stringify(solution)}`;

const abortError = () => Object.assign(new Error('aborted'), { name: 'AbortError' });
// a stream that sends message_start and some text, then waits until it is aborted
function hangingStream(signal, text) {
  const listeners = [];
  const events = [{ type: 'message_start', message: { model: 'claude-opus-5-5', usage } }, { type: 'content_block_start', content_block: { type: 'text' } }, { type: 'content_block_delta', delta: { type: 'text_delta', text } }];
  const until = new Promise((_, rej) => { if (signal.aborted) rej(abortError()); signal.addEventListener('abort', () => rej(abortError()), { once: true }); });
  until.catch(() => {});
  return {
    on(ev, cb) { if (ev === 'streamEvent') { listeners.push(cb); queueMicrotask(() => events.forEach((e) => cb(e))); } return this; },
    async *[Symbol.asyncIterator]() { for (const e of events) yield e; await until; },
    finalMessage: () => until,
  };
}
// a complete message
function doneStream(json) {
  const msg = { model: 'claude-opus-5-5', stop_reason: 'end_turn', content: [{ type: 'text', text: json }], usage: { ...usage, output_tokens: 900 } };
  const events = [{ type: 'message_start', message: { model: msg.model, usage } }, { type: 'content_block_delta', delta: { type: 'text_delta', text: json } }, { type: 'message_delta', usage: { output_tokens: 900 } }];
  return { on(ev, cb) { if (ev === 'streamEvent') queueMicrotask(() => events.forEach((e) => cb(e))); return this; }, async *[Symbol.asyncIterator]() { for (const e of events) yield e; }, finalMessage: async () => msg };
}

test('a visitor who leaves mid-stream still costs what the calls spent: never $0 for the daily cap', async () => {
  const visitor = new AbortController();
  let calls = 0;
  const client = { beta: { messages: { stream: (p, { signal }) => { calls++; return hangingStream(signal, calls === 1 ? pickHead : '{"deliverables_mvp":["Bot"'); } } } };
  const sent = [];
  const run = runSamurai({ m, input, rate, apiKey: 'test', signingKey: 'x'.repeat(32), client, send: (e, d) => { sent.push(e); if (e === 'solution') setTimeout(() => visitor.abort(), 20); }, signal: visitor.signal });
  const out = await run;
  assert.equal(out.status, 'aborted');
  assert.ok(sent.includes('solution'), 'a solution was sent and its detail call started');
  assert.ok(calls >= 2, 'the detail call started');
  assert.ok(out.cost > 0.005, `metered cost ${out.cost}`);
  assert.equal(out.blind, 0);
});

test('a call that never reported its usage is counted blind, so the guard keeps the whole reservation', async () => {
  const visitor = new AbortController();
  const client = { beta: { messages: { stream: (p, { signal }) => ({ on() { return this; }, async *[Symbol.asyncIterator]() { await new Promise((_, rej) => signal.addEventListener('abort', () => rej(abortError()), { once: true })); }, finalMessage: () => new Promise(() => {}) }) } } };
  setTimeout(() => visitor.abort(), 30);
  const out = await runSamurai({ m, input, rate, apiKey: 'test', signingKey: '', client, send: () => {}, signal: visitor.signal });
  assert.equal(out.status, 'aborted');
  assert.equal(out.blind, 1);
});

test('the signature is given only to a genuine estimate: not_business gets none, an ok estimate is signed', async () => {
  const notBusiness = '{"status":"not_business","heard":{"summary":"Sheʼr soʻraldi.","quotes":[],"industry":"other","size":"small"},"questions":[],"solutions":[],"not_recommended":[],"roadmap_note":"","first_step":"","assumptions":[]}';
  const client = { beta: { messages: { stream: () => doneStream(notBusiness) } } };
  const done = [];
  const out = await runSamurai({ m, input: { ...input, text: 'Menga sheʼr yozing' }, rate, apiKey: 'test', signingKey: 'x'.repeat(32), client, send: (e, d) => { if (e === 'done') done.push(d); } });
  assert.equal(out.status, 'not_business');
  assert.equal(done[0].sig, '');
  const ok = `${pickHead}],"not_recommended":[],"roadmap_note":"","first_step":"","assumptions":[]}`;
  const detail = '{"deliverables_mvp":["Menyu"],"deliverables_full":[],"phases":[],"team":[],"stack":[],"risks":[],"needs":[],"impact":{"model":"none","summary":"","inputs":[]}}';
  let n = 0;
  const client2 = { beta: { messages: { stream: () => doneStream(n++ === 0 ? ok : detail) } } };
  const done2 = [];
  const out2 = await runSamurai({ m, input, rate, apiKey: 'test', signingKey: 'x'.repeat(32), client: client2, send: (e, d) => { if (e === 'done') done2.push(d); } });
  assert.equal(out2.status, 'ok');
  assert.match(done2[0].sig, /^[A-Za-z0-9_-]{22}$/);
  assert.ok(out2.cost > 0);
});
