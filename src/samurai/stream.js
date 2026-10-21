// POST /api/samurai and read its text/event-stream (SOLUTIONS-SPEC §2.7) with fetch and a ReadableStream: each
// complete event is handed to onEvent(name, data) in order. Resolves when the stream ends; a JSON answer (a refusal
// before the stream: 400 too_long, 403…) or a network failure becomes an `error` event, so the caller has one path.
export async function streamSamurai(body, onEvent, signal) {
  let res;
  try {
    res = await fetch('/api/samurai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal });
  } catch (e) {
    if (signal?.aborted) return;
    onEvent('error', { code: 'network' });
    return;
  }
  if (!/event-stream/.test(res.headers.get('content-type') || '')) {
    let code = 'upstream';
    try { code = (await res.json())?.error?.code || code; } catch { /* not JSON: the static host has no Worker */ }
    if (res.status === 404 || res.status === 405 || res.status === 501) code = 'not_configured';
    onEvent('error', { code });
    return;
  }
  const reader = res.body.getReader(), dec = new TextDecoder();
  let buf = '';
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let k;
      while ((k = buf.indexOf('\n\n')) >= 0) {
        const block = buf.slice(0, k);
        buf = buf.slice(k + 2);
        const ev = /^event: (.+)$/m.exec(block)?.[1];
        const data = /^data: (.+)$/m.exec(block)?.[1];
        if (!ev) continue;
        let parsed = null;
        try { parsed = data ? JSON.parse(data) : null; } catch { continue; }
        onEvent(ev, parsed);
      }
    }
  } catch (e) {
    if (!signal?.aborted) onEvent('error', { code: 'network' });
  }
}
