// The signature of an estimate (SOLUTIONS-SPEC §2.5, §3.3.15): HMAC-SHA256 over the canonical JSON of what the model
// chose and the facts it was priced with, cut to 16 bytes, base64url. Only a genuine Qilich estimate carries a valid
// one, so only it gets the hanko. Without SAMURAI_SIGNING_KEY, sig is "" and /verify answers { ok: false, reason: "no_key" }.
import { canon } from '../src/shared/canon.js';

const enc = new TextEncoder();
const CONTEXT = 'qilich-samurai-v1\n';
const b64u = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
let cached = null;
async function key(secret) {
  if (!secret || String(secret).length < 16) return null;
  if (cached?.secret !== secret) cached = { secret, key: await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']) };
  return cached.key;
}
/** The signed part of a result: never the visitor's raw text, never the page state. */
export const signedPart = (p) => ({ brief_no: p.brief_no, lang: p.lang, generated_at: p.generated_at, catalogue_version: p.catalogue_version, rate: p.rate, pick: p.pick, details: p.details || {} });

export async function sign(secret, payload) {
  const k = await key(secret);
  if (!k) return '';
  const mac = await crypto.subtle.sign('HMAC', k, enc.encode(CONTEXT + canon(signedPart(payload))));
  return b64u(mac.slice(0, 16));
}
export async function verify(secret, payload, sig) {
  if (!(await key(secret))) return { ok: false, reason: 'no_key' };
  if (typeof sig !== 'string' || !/^[A-Za-z0-9_-]{22}$/.test(sig)) return { ok: false, reason: 'bad_sig' };
  const want = await sign(secret, payload);
  // constant-time compare
  let diff = want.length ^ sig.length;
  for (let i = 0; i < Math.max(want.length, sig.length); i++) diff |= (want.charCodeAt(i) || 0) ^ (sig.charCodeAt(i) || 0);
  return diff === 0 ? { ok: true } : { ok: false, reason: 'mismatch' };
}
