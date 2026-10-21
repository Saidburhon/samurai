// Uzbekistan's public holidays and working-day arithmetic for the plan's real dates (SOLUTIONS-SPEC §3.3.11).
// Working days are Monday to Friday, minus these holidays. Ramazon and Qurbon hayiti move with the lunar calendar;
// their dates are the expected ones and are marked approximate. Dates are 'YYYY-MM-DD' strings in UTC.
// Their names are page words (scripts/pages/samurai-i18n.mjs hol[], in the page's language only): here each holiday
// is its index in that list.
const FIXED = [['01-01', 0], ['03-08', 1], ['03-21', 2], ['05-09', 3], ['09-01', 4], ['10-01', 5], ['12-08', 6]];
const MOVING = [['2026-03-20', 7], ['2027-03-10', 7], ['2028-02-27', 7], ['2026-05-27', 8], ['2027-05-17', 8], ['2028-05-05', 8]];

const iso = (t) => new Date(t).toISOString().slice(0, 10);
const T = (d) => Date.parse(`${d}T00:00:00Z`);
const DAY = 864e5;

/** The holiday on date d: its index in the page's hol[] names, or -1. */
export function holidayOf(d) {
  const f = FIXED.find(([k]) => k === d.slice(5)) || MOVING.find(([k]) => k === d);
  return f ? f[1] : -1;
}
export const isWorkday = (d) => { const w = new Date(T(d)).getUTCDay(); return w !== 0 && w !== 6 && holidayOf(d) < 0; };

/** The date on which `weeks` of work (5 working days each, rounded to whole days) that start on `start` end. */
export function endOfWork(start, weeks) {
  let left = Math.max(1, Math.round(weeks * 5)), t = T(start);
  for (;;) { const d = iso(t); if (isWorkday(d)) { left--; if (!left) return d; } t += DAY; }
}
/** The first Monday at least `minDays` after `today`. */
export function firstMonday(today, minDays = 7) {
  let t = T(today) + minDays * DAY;
  while (new Date(t).getUTCDay() !== 1) t += DAY;
  return iso(t);
}
export const snapMonday = (d) => { let t = T(d); while (new Date(t).getUTCDay() !== 1) t += DAY; return iso(t); };
/** Holidays that fall on weekdays between a and b inclusive: [{ date, k }] (k: the index of its name). */
export function holidaysBetween(a, b) {
  const out = [];
  for (let t = T(a); t <= T(b); t += DAY) { const d = iso(t), k = holidayOf(d), w = new Date(t).getUTCDay(); if (k >= 0 && w !== 0 && w !== 6) out.push({ date: d, k }); }
  return out;
}
export const addDays = (d, n) => iso(T(d) + n * DAY);
export const daysBetween = (a, b) => Math.round((T(b) - T(a)) / DAY);
/** Today in Tashkent (UTC+5, no daylight saving), as 'YYYY-MM-DD'. */
export const tashkentToday = (now = Date.now()) => iso(now + 5 * 36e5);
