// The share link (SOLUTIONS-SPEC §3.3.15): the estimate travels in the URL hash, never on a server.
//   #r=z<base64url(deflate-raw(JSON))>   or   #r=j<base64url(JSON)> where CompressionStream is missing
// The payload holds the meta, the validated pick, the details and the page state, plus the signature; never the
// visitor's own text (only the quotes and the summary the model returned). Numbers are re-priced on open.
const b64u = (bytes) => { let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
const unb64u = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
const pipe = async (bytes, stream) => new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());

export async function encode(obj) {
  const raw = new TextEncoder().encode(JSON.stringify(obj));
  if (typeof CompressionStream === 'function') {
    try { return `z${b64u(await pipe(raw, new CompressionStream('deflate-raw')))}`; } catch { /* plain below */ }
  }
  return `j${b64u(raw)}`;
}
export async function decode(s) {
  const bytes = unb64u(s.slice(1));
  const raw = s[0] === 'z' ? await pipe(bytes, new DecompressionStream('deflate-raw')) : bytes;
  return JSON.parse(new TextDecoder().decode(raw));
}
/** { ok } from the Worker; false when the signature is absent, wrong, or there is no Worker. */
export async function verify(payload, sig) {
  if (!sig) return false;
  try {
    const r = await fetch('/api/samurai/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ payload, sig }) });
    return r.ok && (await r.json()).ok === true;
  } catch { return false; }
}
