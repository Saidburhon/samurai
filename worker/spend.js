// SamuraiGuard (the spend guard): the one place that decides whether a SamurAI request may reach the Claude API.
// A single global Durable Object (SQLite-backed), so every check and count is atomic across all data centres. The
// rules live in worker/budget.js (pure, tested under node with a Map for the storage); this class only runs them.
// Called over RPC from worker/index.js; when the guard cannot answer, the page answers from the catalogue matcher
// (fails closed for the API). Old keys are removed by an alarm.
import { DurableObject } from 'cloudflare:workers';
import { reserveIn, settleIn, todayIn, sweepIn } from './budget.js';

export { GUARD } from './budget.js';

export class SamuraiGuard extends DurableObject {
  /** { key, dailyUsd? } → { ok: true, rid } or { ok: false, reason: "live" | "window" | "day" | "usd" | "budget", retry }. */
  reserve({ key, dailyUsd }) { return reserveIn(this.ctx.storage, { key, dailyUsd }); }
  /** { rid, usd } → the hold is replaced by the cost of the run; the key is free. */
  settle({ rid, usd }) { return settleIn(this.ctx.storage, { rid, usd }); }
  today() { return todayIn(this.ctx.storage); }
  alarm() { return sweepIn(this.ctx.storage); }
}
