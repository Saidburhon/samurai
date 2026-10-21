// The day's USD → UZS rate from the Central Bank of Uzbekistan (SOLUTIONS-SPEC §2.8.7). Kept in caches.default under
// a synthetic URL for 6 hours (and in the isolate for 10 minutes). On failure: worker/gen/meta.json rate_fallback,
// the last good rate the build fetched, marked source "fallback". The Worker never waits more than 1.5 s for CBU.
import meta from './gen/meta.json' with { type: 'json' };

const CBU = ['https://cbu.uz/uz/arkhiv-kursov-valyut/json/USD/', 'https://cbu.uz/ru/arkhiv-kursov-valyut/json/USD/'];
const CACHE_KEY = 'https://qilich.com/__rate/usd';
const TTL_S = 6 * 3600;
const sane = (n) => Number.isFinite(n) && n > 5000 && n < 50000;

export const FALLBACK_RATE = { uzs_per_usd: Number(meta.rate_fallback?.uzs_per_usd) || 12012.3, date: meta.rate_fallback?.date || '2026-10-21', source: 'fallback' };

// CBU answers [{ Ccy: "USD", Nominal: "1", Rate: "12012.30", Date: "21.10.2026", ... }]; the Date can be tomorrow's
export function parseCbu(json) {
  const row = Array.isArray(json) ? json.find((r) => r && r.Ccy === 'USD') : null;
  if (!row) return null;
  const rate = Number(String(row.Rate).replace(',', '.')) / (Number(row.Nominal || 1) || 1);
  const d = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(row.Date || ''));
  if (!sane(rate) || !d) return null;
  return { uzs_per_usd: Math.round(rate * 100) / 100, date: `${d[3]}-${d[2]}-${d[1]}`, source: 'cbu' };
}

let memo = null;
// both CBU addresses at once, the first good answer wins: the Worker waits at most timeoutMs in all, never one per URL
async function fetchCbu(timeoutMs) {
  const signal = AbortSignal.timeout(timeoutMs);
  const one = async (url) => {
    const res = await fetch(url, { headers: { Accept: 'application/json' }, signal });
    const r = res.ok ? parseCbu(await res.json()) : null;
    if (!r) throw new Error('no rate');
    return r;
  };
  try { return await Promise.any(CBU.map(one)); } catch { return null; }
}

/** { uzs_per_usd, date (YYYY-MM-DD), source: "cbu" | "fallback" }. Never throws. */
export async function getRate(ctx, { timeoutMs = 1500 } = {}) {
  const now = Date.now();
  if (memo && memo.expires > now) return memo.rate;
  const cache = globalThis.caches?.default;
  if (cache) {
    try { const hit = await cache.match(CACHE_KEY); if (hit) { const r = await hit.json(); if (sane(r?.uzs_per_usd)) { memo = { rate: r, expires: now + 6e5 }; return r; } } } catch { /* optional */ }
  }
  const fresh = await fetchCbu(timeoutMs);
  if (!fresh) { memo = { rate: FALLBACK_RATE, expires: now + 6e5 }; return FALLBACK_RATE; }
  memo = { rate: fresh, expires: now + TTL_S * 1000 };
  if (cache) {
    const put = cache.put(CACHE_KEY, new Response(JSON.stringify(fresh), { headers: { 'Content-Type': 'application/json', 'Cache-Control': `public, max-age=${TTL_S}` } })).catch(() => {});
    ctx?.waitUntil?.(put);
  }
  return fresh;
}
