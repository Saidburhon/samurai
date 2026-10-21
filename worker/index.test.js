// node --test worker/: a visitor who leaves stops the upstream calls even when request.signal never fires (sec3
// must-fix 2: under wrangler dev one trial in four ran the pick and its detail to the end after the client left).
// The real Worker handler runs here: fetch is stubbed (the CBU rate and an Anthropic stream that writes slowly and
// only ends when it is aborted), the request's own signal never aborts, and the test cancels the response body.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

// worker/spend.js imports cloudflare:workers (the Durable Object base class), which exists only in workerd
register('data:text/javascript,' + encodeURIComponent(`
export async function resolve(spec, ctx, next) {
  if (spec === 'cloudflare:workers') return { url: 'data:text/javascript,export class DurableObject {}', shortCircuit: true };
  return next(spec, ctx);
}`));

const sse = (ev, data) => `event: ${ev}\ndata: ${JSON.stringify(data)}\n\n`;
function fakeUpstream(log) {
  return async (url, init = {}) => {
    const u = String(url instanceof Request ? url.url : url);
    if (u.includes('cbu.uz')) return new Response(JSON.stringify([{ Ccy: 'USD', Nominal: '1', Rate: '12012.30', Date: '21.10.2026' }]), { headers: { 'Content-Type': 'application/json' } });
    const signal = init.signal || (url instanceof Request ? url.signal : null);
    const call = { url: u, started: Date.now(), aborted: null };
    log.push(call);
    // the pick, a few characters every 50 ms, and never a message_stop: only an abort ends it
    const pick = '{"status":"ok","heard":{"summary":"Kimyoviy tozalash, ikki qabul punkti.","quotes":[],"industry":"other","size":"small"},"questions":[],"solutions":[';
    const body = new ReadableStream({
      start(c) {
        const enc = new TextEncoder();
        c.enqueue(enc.encode(sse('message_start', { type: 'message_start', message: { id: 'msg_1', type: 'message', role: 'assistant', model: 'claude-opus-5-5', content: [], stop_reason: null, usage: { input_tokens: 300, cache_read_input_tokens: 22000, cache_creation_input_tokens: 0, output_tokens: 1 } } })));
        c.enqueue(enc.encode(sse('content_block_start', { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } })));
        let k = 0;
        const t = setInterval(() => {
          if (k < pick.length) c.enqueue(enc.encode(sse('content_block_delta', { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: pick.slice(k, k + 6) } })));
          k += 6;
        }, 50);
        signal?.addEventListener('abort', () => { clearInterval(t); call.aborted = Date.now(); try { c.error(Object.assign(new Error('aborted'), { name: 'AbortError' })); } catch {} }, { once: true });
      },
    });
    return new Response(body, { headers: { 'Content-Type': 'text/event-stream', 'request-id': 'req_test' } });
  };
}

test('cancelling the response aborts the upstream call although request.signal never fires', async () => {
  const calls = [], logs = [];
  const realFetch = globalThis.fetch, realLog = console.log;
  globalThis.fetch = fakeUpstream(calls);
  console.log = (s) => logs.push(String(s));
  try {
    const { default: worker } = await import('./index.js');
    const waits = [];
    const ctx = { waitUntil: (p) => waits.push(p) };
    const env = { ANTHROPIC_API_KEY: 'sk-test', SAMURAI_EFFORT: 'low' };
    const request = new Request('http://localhost:8787/api/samurai', { method: 'POST', headers: { Origin: 'http://localhost:8787', 'Content-Type': 'application/json' }, body: JSON.stringify({ v: 1, lang: 'uz', text: 'Kimyoviy tozalash, ikki qabul punkti, kvitansiyalar qogʻozda' }) });
    const res = await worker.fetch(request, env, ctx);
    assert.equal(res.status, 200);
    const reader = res.body.getReader();
    let seen = '';
    while (!seen.includes('event: heard')) seen += new TextDecoder().decode((await reader.read()).value);
    const left = Date.now();
    await reader.cancel(); // the visitor closed the tab
    let timer;
    await Promise.race([Promise.allSettled(waits), new Promise((r) => { timer = setTimeout(r, 12_000); })]);
    clearTimeout(timer);
    const pick = calls.find((c) => c.url.includes('/v1/messages'));
    assert.ok(pick, 'the pick was called');
    assert.ok(pick.aborted, 'the upstream call was aborted');
    assert.ok(pick.aborted - left < 2000, `aborted ${pick.aborted - left} ms after the visitor left`);
    const line = logs.map((l) => { try { return JSON.parse(l); } catch { return null; } }).find((o) => o?.samurai?.status);
    assert.equal(line.samurai.status, 'aborted');
    assert.equal(line.samurai.gone, true, 'detected by the failed write, not by request.signal');
    assert.ok(line.samurai.settled_usd > 0 && line.samurai.settled_usd < 0.05, `settled ${line.samurai.settled_usd}`);
  } finally {
    globalThis.fetch = realFetch;
    console.log = realLog;
  }
});
