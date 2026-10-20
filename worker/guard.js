// SamuraiGuard: the one place that decides whether a SamurAI request may reach the Claude API.
// A single global Durable Object (SQLite-backed), so every check and count is atomic across all data centres:
//   - the day's spend in USD (Tashkent day) stays under DAILY_USD (env SAMURAI_DAILY_USD, default 15);
//   - each visitor key (an IPv4 address or an IPv6 /64) gets PER_KEY_WINDOW answers per 10 minutes and PER_KEY_DAY a day;
//   - each key has one answer being written at a time.
// reserve() books RESERVE_USD for the answer before the call; settle() swaps it for the real cost from the usage
// when the stream ends. A reservation that is never settled (the isolate died) keeps its booking and its key is free
// again after LIVE_MS. Called over RPC from worker/index.js; when the guard cannot answer, the Worker refuses (fails
// closed). Old keys are removed by an alarm.
import { DurableObject } from 'cloudflare:workers';

export const GUARD = {
  DAILY_USD: 15,
  RESERVE_USD: 0.5, // about the worst cold request: a fresh 1-hour cache write plus 6k output tokens
  PER_KEY_WINDOW: 15,
  WINDOW_S: 600,
  PER_KEY_DAY: 30,
  LIVE_MS: 150_000, // longer than the Worker's 90-second deadline for one answer
};

const TZ_MS = 5 * 3600e3; // Tashkent, UTC+5, no daylight saving
const dayOf = (ms) => new Date(ms + TZ_MS).toISOString().slice(0, 10);
const secondsToMidnight = (ms) => {
  const d = new Date(ms + TZ_MS);
  const next = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1) - TZ_MS;
  return Math.max(Math.ceil((next - ms) / 1000), 1);
};
const round6 = (x) => Math.round(x * 1e6) / 1e6;

export class SamuraiGuard extends DurableObject {
  /**
   * { key, dailyUsd? } → { ok: true, rid } or { ok: false, reason: "live" | "window" | "day" | "budget", retry }.
   * Storage calls only between the reads and the writes, so no other request interleaves (input gates).
   */
  async reserve({ key, dailyUsd }) {
    const limit = Number(dailyUsd) > 0 ? Number(dailyUsd) : GUARD.DAILY_USD;
    const now = Date.now();
    const day = dayOf(now);
    const slot = Math.floor(now / 1000 / GUARD.WINDOW_S);
    const k = {
      usd: `usd:${day}`,
      n: `n:${day}:${key}`,
      w: `w:${slot}:${key}`,
      live: `live:${key}`,
    };
    const s = this.ctx.storage;
    const got = await s.get(Object.values(k));
    const usd = Number(got.get(k.usd)) || 0;
    const n = Number(got.get(k.n)) || 0;
    const w = Number(got.get(k.w)) || 0;
    const live = got.get(k.live);

    if (live && live.until > now) return { ok: false, reason: 'live', retry: Math.min(Math.ceil((live.until - now) / 1000), 30) };
    if (w >= GUARD.PER_KEY_WINDOW) return { ok: false, reason: 'window', retry: Math.max(Math.ceil((slot + 1) * GUARD.WINDOW_S - now / 1000), 1) };
    if (n >= GUARD.PER_KEY_DAY) return { ok: false, reason: 'day', retry: secondsToMidnight(now) };
    if (usd + GUARD.RESERVE_USD > limit) return { ok: false, reason: 'budget', retry: secondsToMidnight(now) };

    const rid = crypto.randomUUID();
    await s.put({
      [k.usd]: round6(usd + GUARD.RESERVE_USD),
      [k.n]: n + 1,
      [k.w]: w + 1,
      [k.live]: { rid, until: now + GUARD.LIVE_MS },
      [`r:${rid}`]: { key, day, usd: GUARD.RESERVE_USD, at: now },
    });
    if ((await s.getAlarm()) == null) await s.setAlarm(now + 3600e3);
    return { ok: true, rid };
  }

  /** { rid, usd } → the reservation is replaced by the real cost (or kept when usd is not a number); the key is free. */
  async settle({ rid, usd }) {
    const s = this.ctx.storage;
    const r = await s.get(`r:${rid}`);
    if (!r) return { ok: false };
    const cost = Number.isFinite(usd) && usd >= 0 ? usd : r.usd;
    const k = `usd:${r.day}`;
    const total = Number(await s.get(k)) || 0;
    const live = await s.get(`live:${r.key}`);
    await s.put(k, round6(Math.max(total - r.usd + cost, 0)));
    if (live?.rid === rid) await s.delete(`live:${r.key}`);
    await s.delete(`r:${rid}`);
    return { ok: true, usd_today: round6(Math.max(total - r.usd + cost, 0)) };
  }

  /** The day's spend so far, for logs. */
  async today() {
    const day = dayOf(Date.now());
    return { day, usd: Number(await this.ctx.storage.get(`usd:${day}`)) || 0 };
  }

  /** Every hour while there is state: drop earlier days, past windows, expired streams and stale reservations. */
  async alarm() {
    const s = this.ctx.storage;
    const now = Date.now();
    const day = dayOf(now);
    const slot = Math.floor(now / 1000 / GUARD.WINDOW_S);
    const drop = [];
    let kept = 0;
    for (const [key, value] of await s.list()) {
      const [kind, a] = key.split(':');
      const old =
        (kind === 'usd' && a < day) ||
        (kind === 'n' && a < day) ||
        (kind === 'w' && Number(a) < slot) ||
        (kind === 'live' && !(value?.until > now)) ||
        (kind === 'r' && !(value?.at > now - 6 * 3600e3));
      if (old) drop.push(key);
      else kept++;
    }
    for (let i = 0; i < drop.length; i += 128) await s.delete(drop.slice(i, i + 128));
    if (kept) await s.setAlarm(now + 3600e3);
  }
}
