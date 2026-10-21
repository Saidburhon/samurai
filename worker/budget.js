// The spend guard's rules (worker/spend.js runs them in its Durable Object; node --test runs them on a Map). Pure: every
// function takes the storage (get(keys) → Map, get(key), put(obj), put(key, value), delete(key | keys), list(),
// getAlarm(), setAlarm()) and the time, so no request can interleave between a read and a write inside one call.
//   - the day's spend in USD (Tashkent day) stays under DAILY_USD (env SAMURAI_DAILY_USD, default 15);
//   - one visitor key (an IPv4 address or an IPv6 /64) books at most PER_KEY_USD of it a day, its reservation
//     included, so no single visitor can drain the cap for everyone else;
//   - each key gets PER_KEY_WINDOW answers per 10 minutes and PER_KEY_DAY a day, one at a time.
// reserve() holds RESERVE_USD before the call; settle() swaps the hold for what the run cost: the metered usage, an
// input-only estimate for a call cut before the API reported usage, and nothing for a call the API refused or that
// was never sent (worker/samurai.js). A hold that is never settled (the isolate died) stays booked.
export const GUARD = {
  DAILY_USD: 15,
  RESERVE_USD: 0.7, // at least the costliest cold brief measured live ($0.6–0.7: 1-hour cache writes of the prompt for both stages, the pick and 4 details)
  PER_KEY_USD: 2,
  PER_KEY_WINDOW: 15,
  WINDOW_S: 600,
  PER_KEY_DAY: 30,
  LIVE_MS: 150_000, // longer than the Worker's 120-second cap for one brief
};

const TZ_MS = 5 * 3600e3; // Tashkent, UTC+5, no daylight saving
export const dayOf = (ms) => new Date(ms + TZ_MS).toISOString().slice(0, 10);
export const secondsToMidnight = (ms) => {
  const d = new Date(ms + TZ_MS);
  const next = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1) - TZ_MS;
  return Math.max(Math.ceil((next - ms) / 1000), 1);
};
const round6 = (x) => Math.round(x * 1e6) / 1e6;

/** { key, dailyUsd?, now? } → { ok: true, rid } or { ok: false, reason: "live" | "window" | "day" | "usd" | "budget", retry }. */
export async function reserveIn(s, { key, dailyUsd, now = Date.now(), rid = crypto.randomUUID() }) {
  const limit = Number(dailyUsd) > 0 ? Number(dailyUsd) : GUARD.DAILY_USD;
  const day = dayOf(now);
  const slot = Math.floor(now / 1000 / GUARD.WINDOW_S);
  const k = { usd: `usd:${day}`, ku: `u:${day}:${key}`, n: `n:${day}:${key}`, w: `w:${slot}:${key}`, live: `live:${key}` };
  const got = await s.get(Object.values(k));
  const usd = Number(got.get(k.usd)) || 0;
  const ku = Number(got.get(k.ku)) || 0;
  const n = Number(got.get(k.n)) || 0;
  const w = Number(got.get(k.w)) || 0;
  const live = got.get(k.live);

  if (live && live.until > now) return { ok: false, reason: 'live', retry: Math.min(Math.ceil((live.until - now) / 1000), 30) };
  if (w >= GUARD.PER_KEY_WINDOW) return { ok: false, reason: 'window', retry: Math.max(Math.ceil((slot + 1) * GUARD.WINDOW_S - now / 1000), 1) };
  if (n >= GUARD.PER_KEY_DAY) return { ok: false, reason: 'day', retry: secondsToMidnight(now) };
  if (ku + GUARD.RESERVE_USD > GUARD.PER_KEY_USD + 1e-9) return { ok: false, reason: 'usd', retry: secondsToMidnight(now) };
  if (usd + GUARD.RESERVE_USD > limit + 1e-9) return { ok: false, reason: 'budget', retry: secondsToMidnight(now) };

  await s.put({
    [k.usd]: round6(usd + GUARD.RESERVE_USD),
    [k.ku]: round6(ku + GUARD.RESERVE_USD),
    [k.n]: n + 1,
    [k.w]: w + 1,
    [k.live]: { rid, until: now + GUARD.LIVE_MS },
    [`r:${rid}`]: { key, day, usd: GUARD.RESERVE_USD, at: now },
  });
  if ((await s.getAlarm()) == null) await s.setAlarm(now + 3600e3);
  return { ok: true, rid };
}

/** { rid, usd } → the hold is replaced by the cost (kept when usd is not a number ≥ 0); the key is free again. */
export async function settleIn(s, { rid, usd }) {
  const r = await s.get(`r:${rid}`);
  if (!r) return { ok: false };
  const cost = Number.isFinite(usd) && usd >= 0 ? usd : r.usd;
  const k = `usd:${r.day}`, ku = `u:${r.day}:${r.key}`;
  const got = await s.get([k, ku, `live:${r.key}`]);
  const total = round6(Math.max((Number(got.get(k)) || 0) - r.usd + cost, 0));
  await s.put({ [k]: total, [ku]: round6(Math.max((Number(got.get(ku)) || 0) - r.usd + cost, 0)) });
  if (got.get(`live:${r.key}`)?.rid === rid) await s.delete(`live:${r.key}`);
  await s.delete(`r:${rid}`);
  return { ok: true, usd_today: total };
}

/** The day's spend so far, for logs. */
export async function todayIn(s, now = Date.now()) {
  const day = dayOf(now);
  return { day, usd: Number(await s.get(`usd:${day}`)) || 0 };
}

/** Every hour while there is state: drop earlier days, past windows, expired streams and stale holds. */
export async function sweepIn(s, now = Date.now()) {
  const day = dayOf(now);
  const slot = Math.floor(now / 1000 / GUARD.WINDOW_S);
  const drop = [];
  let kept = 0;
  for (const [key, value] of await s.list()) {
    const [kind, a] = key.split(':');
    const old =
      ((kind === 'usd' || kind === 'n' || kind === 'u') && a < day) ||
      (kind === 'w' && Number(a) < slot) ||
      (kind === 'live' && !(value?.until > now)) ||
      (kind === 'r' && !(value?.at > now - 6 * 3600e3));
    if (old) drop.push(key);
    else kept++;
  }
  for (let i = 0; i < drop.length; i += 128) await s.delete(drop.slice(i, i + 128));
  if (kept) await s.setAlarm(now + 3600e3);
}
