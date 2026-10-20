// The day's USD → UZS rate from the Central Bank of Uzbekistan (CBU), for SamurAI's soʻm prices.
// Cached for 6 hours with the Cache API (per data centre) and in the isolate's memory. When CBU cannot be reached,
// the rate stored in content/solutions.json is used, or the constant below if that is missing.
import catalogue from '../content/solutions.json';

const CBU_URLS = [
  'https://cbu.uz/uz/arkhiv-kursov-valyut/json/USD/',
  'https://cbu.uz/ru/arkhiv-kursov-valyut/json/USD/', // same data; tried when the first one fails
];
const CACHE_KEY = 'https://qilich.com/__samurai/cbu-usd-rate'; // a synthetic key, never routed
const TTL_S = 6 * 3600;
const FETCH_TIMEOUT_MS = 2500;

// CBU rate for 20 October 2026. Used only if content/solutions.json has no usable rate.
const HARD_FALLBACK = { uzs_per_usd: 12044.72, date: '2026-10-20' };

const sane = (n) => Number.isFinite(n) && n > 5000 && n < 50000;

export const FALLBACK_RATE = (() => {
  const c = catalogue.currency || {};
  const ok = sane(Number(c.uzs_per_usd)) && /^\d{4}-\d{2}-\d{2}$/.test(c.rate_date || '');
  const base = ok ? { uzs_per_usd: Number(c.uzs_per_usd), date: c.rate_date } : HARD_FALLBACK;
  return { ...base, source: 'fallback' };
})();

let memo = null; // { rate, expires }

// CBU answers [{ Ccy: "USD", Nominal: "1", Rate: "12012.30", Date: "21.10.2026", ... }]
function parseCbu(json) {
  const row = Array.isArray(json) ? json.find((r) => r && r.Ccy === 'USD') : null;
  if (!row) return null;
  const nominal = Number(row.Nominal || 1) || 1;
  const rate = Number(String(row.Rate).replace(',', '.')) / nominal;
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(row.Date || ''));
  if (!sane(rate) || !m) return null;
  return { uzs_per_usd: Math.round(rate * 100) / 100, date: `${m[3]}-${m[2]}-${m[1]}`, source: 'cbu' };
}

async function fetchCbu() {
  for (const url of CBU_URLS) {
    try {
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      if (!res.ok) continue;
      const rate = parseCbu(await res.json());
      if (rate) return rate;
    } catch {
      // network error, timeout or bad JSON: try the next URL
    }
  }
  return null;
}

/** Returns { uzs_per_usd, date (YYYY-MM-DD), source: "cbu" | "fallback" }. Never throws. */
export async function getRate(ctx) {
  const now = Date.now();
  if (memo && memo.expires > now) return memo.rate;

  const cache = globalThis.caches?.default;
  if (cache) {
    try {
      const hit = await cache.match(CACHE_KEY);
      if (hit) {
        const rate = await hit.json();
        if (sane(rate?.uzs_per_usd)) {
          memo = { rate, expires: now + 10 * 60 * 1000 }; // re-check the shared cache every 10 minutes
          return rate;
        }
      }
    } catch {
      // the Cache API is optional
    }
  }

  const fresh = await fetchCbu();
  if (!fresh) {
    memo = { rate: FALLBACK_RATE, expires: now + 10 * 60 * 1000 }; // retry CBU in 10 minutes
    return FALLBACK_RATE;
  }
  memo = { rate: fresh, expires: now + TTL_S * 1000 };
  if (cache) {
    const put = cache
      .put(CACHE_KEY, new Response(JSON.stringify(fresh), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': `public, max-age=${TTL_S}` },
      }))
      .catch(() => {});
    if (ctx?.waitUntil) ctx.waitUntil(put);
  }
  return fresh;
}
