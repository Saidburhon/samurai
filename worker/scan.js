// The tolerant streaming JSON scanner (SOLUTIONS-SPEC §7.1). It reads the model's JSON as it streams and reports
// each finished piece once: every value of the top-level object ({ key, index: -1, value }) and every element of a
// top-level array ({ key, index, value }). It never reports a half-written object: a piece is parsed only when its
// closing character arrives. reset() starts over (a server-side fallback began a new answer).
export function createScanner(emit) {
  let buf, i, stack, inStr, esc, mode, key, keyStart, valStart, elemStart, elemIndex, strStart, dead;
  const reset = () => { buf = ''; i = 0; stack = []; inStr = false; esc = false; mode = 'key'; key = null; keyStart = -1; valStart = -1; elemStart = -1; elemIndex = 0; strStart = -1; dead = false; };
  reset();
  const parse = (a, b) => { try { return { ok: true, v: JSON.parse(buf.slice(a, b)) }; } catch { return { ok: false }; } };
  const out = (k, index, a, b) => { const p = parse(a, b); if (p.ok) emit({ key: k, index, value: p.v }); };
  // depth: 0 outside the root, 1 inside the root object, 2 inside a top-level array or object, …
  const depth = () => stack.length;
  const topArray = () => stack.length === 2 && stack[1] === '[';
  function endScalarElement(pos) {
    if (elemStart >= 0 && topArray()) { const s = buf.slice(elemStart, pos).trim(); if (s) { out(key, elemIndex, elemStart, elemStart + buf.slice(elemStart, pos).trimEnd().length); elemIndex++; } }
    elemStart = -1;
  }
  function step(c, pos) {
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === '"') {
        inStr = false;
        const d = depth();
        if (d === 1 && mode === 'key') { const p = parse(keyStart, pos + 1); key = p.ok ? p.v : null; mode = 'colon'; }
        else if (d === 1 && mode === 'value') { out(key, -1, valStart, pos + 1); mode = 'after'; }
        else if (d === 2 && topArray() && elemStart === strStart) { out(key, elemIndex, elemStart, pos + 1); elemIndex++; elemStart = -2; }
      }
      return;
    }
    if (c === ' ' || c === '\n' || c === '\r' || c === '\t') return;
    const d = depth();
    if (c === '"') {
      inStr = true; strStart = pos;
      if (d === 1 && mode === 'key') keyStart = pos;
      else if (d === 1 && mode === 'value') valStart = pos;
      else if (d === 2 && topArray() && elemStart === -1) elemStart = pos;
      return;
    }
    if (c === '{' || c === '[') {
      if (d === 0 && c !== '{') { dead = true; return; }
      if (d === 1 && mode === 'value') { valStart = pos; elemIndex = 0; elemStart = -1; }
      else if (d === 2 && topArray() && elemStart === -1) elemStart = pos;
      stack.push(c);
      return;
    }
    if (c === '}' || c === ']') {
      if (d === 2 && topArray() && c === ']') endScalarElement(pos);
      if (d === 1 && mode === 'value' && valStart >= 0) out(key, -1, valStart, pos);
      stack.pop();
      const nd = depth();
      if (nd === 1) { out(key, -1, valStart, pos + 1); mode = 'after'; }
      else if (nd === 2 && topArray() && elemStart >= 0) { out(key, elemIndex, elemStart, pos + 1); elemIndex++; elemStart = -2; }
      return;
    }
    if (c === ':') { if (d === 1 && mode === 'colon') { mode = 'value'; valStart = -1; } return; }
    if (c === ',') {
      if (d === 1) { if (mode === 'value' && valStart >= 0) out(key, -1, valStart, pos); mode = 'key'; }
      else if (d === 2 && topArray()) { endScalarElement(pos); elemStart = -1; }
      return;
    }
    // a scalar (number, true, false, null)
    if (d === 1 && mode === 'value' && valStart < 0) valStart = pos;
    else if (d === 2 && topArray() && elemStart === -1) elemStart = pos;
  }
  return {
    push(chunk) { if (dead) return; buf += chunk; for (; i < buf.length; i++) step(buf[i], i); },
    reset,
    text: () => buf,
  };
}
