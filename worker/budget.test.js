// node --test worker/: the spend guard settles what a run really cost (jb2a3 must-fix 6, sec3 must-fix 1). A request
// the API refused (401, 529) or the visitor dropped before message_start must not book the $0.70 hold, and no single
// visitor key can drain the day's cap for everyone else. The guard's rules run on a Map (worker/budget.js); the runs
// use a fake Anthropic client, so nothing leaves the machine.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import Anthropic from '@anthropic-ai/sdk';
import { normalise } from '../src/shared/catalogue.js';
import { runSamurai } from './samurai.js';
import { GUARD, reserveIn, settleIn, todayIn } from './budget.js';

const J = (p) => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), 'utf8'));
const m = normalise(J('content/solutions.json'), J('content/solutions-extra.json'), J('content/pricing.json'));
const rate = { uzs_per_usd: 12012.3, date: '2026-10-21', source: 'cbu' };
const input = { lang: 'ru', intake: {}, text: 'Химчистка, два пункта приёма, квитанции бумажные', preselected: [], answers: [], refine: null };

function memStorage() {
  const map = new Map();
  let alarm = null;
  return {
    map,
    async get(k) { if (Array.isArray(k)) return new Map(k.filter((x) => map.has(x)).map((x) => [x, map.get(x)])); return map.get(k); },
    async put(k, v) { if (k && typeof k === 'object') for (const [a, b] of Object.entries(k)) map.set(a, b); else map.set(k, v); },
    async delete(k) { for (const x of [].concat(k)) map.delete(x); },
    async list() { return new Map([...map].sort()); },
    async getAlarm() { return alarm; },
    async setAlarm(t) { alarm = t; },
  };
}
const abortError = () => Object.assign(new Error('Request was aborted.'), { name: 'AbortError' });
// a stream the API rejects before it starts: the SDK throws its APIError on the first read
const rejecting = (err) => { let calls = 0; return { get calls() { return calls; }, beta: { messages: { stream: () => { calls++; return { on() { return this; }, async *[Symbol.asyncIterator]() { throw err; }, finalMessage: () => Promise.reject(err) }; } } } }; };
// a stream that never sends message_start and fails when aborted
const silent = () => { let calls = 0; return { get calls() { return calls; }, beta: { messages: { stream: (p, { signal }) => { calls++; return { on() { return this; }, async *[Symbol.asyncIterator]() { await new Promise((_, rej) => { if (signal.aborted) rej(abortError()); signal.addEventListener('abort', () => rej(abortError()), { once: true }); }); }, finalMessage: () => new Promise(() => {}) }; } } } }; };
const run = (client, signal) => runSamurai({ m, input, rate, apiKey: 'test', signingKey: '', client, send: () => {}, signal });

test('an API refusal before message_start (401, 529) is not billed: the run settles at $0', async () => {
  const e401 = new Anthropic.AuthenticationError(401, { type: 'error', error: { type: 'authentication_error', message: 'invalid x-api-key' } }, 'invalid x-api-key', new Headers());
  const e529 = new Anthropic.InternalServerError(529, { type: 'error', error: { type: 'overloaded_error', message: 'Overloaded' } }, 'Overloaded', new Headers());
  for (const [err, code] of [[e401, 'not_configured'], [e529, 'upstream']]) {
    const out = await run(rejecting(err));
    assert.equal(out.status, code);
    assert.equal(out.cost, 0, `${err.status} settles at 0`);
    assert.equal(out.blind, 0);
  }
});

test('a visitor who left before the call was made sends nothing and costs nothing (abort at 0 ms)', async () => {
  const gone = new AbortController();
  gone.abort();
  const client = silent();
  const out = await run(client, gone.signal);
  assert.equal(out.status, 'aborted');
  assert.equal(client.calls, 0, 'no request reached the API');
  assert.equal(out.cost, 0);
});

test('a visitor who leaves right after the call was sent costs the input estimate only (≤ $0.05)', async () => {
  const gone = new AbortController();
  const p = run(silent(), gone.signal);
  setTimeout(() => gone.abort(), 0);
  const out = await p;
  assert.equal(out.status, 'aborted');
  assert.equal(out.blind, 1);
  assert.ok(out.cost > 0 && out.cost <= 0.05, `settled ${out.cost}`);
});

test('30 aborted runs from one key leave the global cap available for every other visitor', async () => {
  const s = memStorage();
  let now = Date.parse('2026-10-21T06:00:00Z');
  let refused = 0;
  for (let i = 0; i < 30; i++) {
    const b = await reserveIn(s, { key: '203.0.113.7', dailyUsd: 15, now });
    if (!b.ok) { refused++; now += GUARD.WINDOW_S * 1000; continue; }
    const gone = new AbortController();
    const p = run(silent(), gone.signal);
    setTimeout(() => gone.abort(), 0);
    const out = await p;
    await settleIn(s, { rid: b.rid, usd: out.cost });
    now += 41_000; // past RL_IP's 5 a minute, inside the 10-minute window
  }
  const day = await todayIn(s, now);
  assert.ok(day.usd <= 30 * 0.05, `the day's spend after 30 dropped runs: $${day.usd}`);
  assert.ok(day.usd < 15 - GUARD.RESERVE_USD);
  const other = await reserveIn(s, { key: '198.51.100.20', dailyUsd: 15, now });
  assert.equal(other.ok, true, 'another visitor still gets SamurAI');
  assert.ok(refused <= 2, `the window limit only paused the key (${refused})`);
});

test('one key books at most PER_KEY_USD a day, holds included: the rest of the cap stays for others', async () => {
  const s = memStorage();
  let now = Date.parse('2026-10-21T06:00:00Z');
  const key = '2001:db8:1:2::/64';
  // holds that are never settled (the isolate died mid-run) and the key's live slot expires each time
  const holds = [];
  for (let i = 0; i < 10; i++) {
    const b = await reserveIn(s, { key, dailyUsd: 15, now });
    if (b.ok) holds.push(b.rid); else assert.equal(b.reason, 'usd');
    now += GUARD.LIVE_MS + 1000;
  }
  assert.equal(holds.length, Math.floor(GUARD.PER_KEY_USD / GUARD.RESERVE_USD), 'two holds, then the key is over its share');
  assert.ok((await todayIn(s, now)).usd <= GUARD.PER_KEY_USD);
  assert.equal((await reserveIn(s, { key: '198.51.100.20', dailyUsd: 15, now })).ok, true);
  // settling a hold at its real cost frees the key's share again
  await settleIn(s, { rid: holds[0], usd: 0.06 });
  assert.equal((await reserveIn(s, { key, dailyUsd: 15, now })).ok, true);
});

test('the daily cap still refuses once the day is spent', async () => {
  const s = memStorage();
  const now = Date.parse('2026-10-21T06:00:00Z');
  await s.put(`usd:2026-10-21`, 14.5);
  const b = await reserveIn(s, { key: '192.0.2.1', dailyUsd: 15, now });
  assert.deepEqual([b.ok, b.reason], [false, 'budget']);
});
