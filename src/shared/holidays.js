// Uzbekistan's public holidays and working-day arithmetic for the plan's real dates (SOLUTIONS-SPEC §3.3.11).
// Working days are Monday to Friday, minus these holidays. Ramazon and Qurbon hayiti move with the lunar calendar;
// their dates are the expected ones and are marked approximate. Dates are 'YYYY-MM-DD' strings in UTC.
const FIXED = [
  ['01-01', { uz: 'Yangi yil', ru: 'Новый год', en: 'New Year', ja: '元日' }],
  ['03-08', { uz: 'Xotin-qizlar kuni', ru: 'Международный женский день', en: 'Women’s Day', ja: '国際女性デー' }],
  ['03-21', { uz: 'Navroʻz', ru: 'Навруз', en: 'Navruz', ja: 'ナウルーズ' }],
  ['05-09', { uz: 'Xotira va qadrlash kuni', ru: 'День памяти и почестей', en: 'Day of Remembrance', ja: '追悼と敬意の日' }],
  ['09-01', { uz: 'Mustaqillik kuni', ru: 'День независимости', en: 'Independence Day', ja: '独立記念日' }],
  ['10-01', { uz: 'Oʻqituvchi va murabbiylar kuni', ru: 'День учителя', en: 'Teachers’ Day', ja: '教師の日' }],
  ['12-08', { uz: 'Konstitutsiya kuni', ru: 'День Конституции', en: 'Constitution Day', ja: '憲法記念日' }],
];
const RAMAZON = { uz: 'Ramazon hayiti (taxminan)', ru: 'Рамазан хайит (примерно)', en: 'Eid al-Fitr (approximate)', ja: 'ラマダン明けの祭り（予定）' };
const QURBON = { uz: 'Qurbon hayiti (taxminan)', ru: 'Курбан хайит (примерно)', en: 'Eid al-Adha (approximate)', ja: '犠牲祭（予定）' };
const MOVING = [['2026-03-20', RAMAZON], ['2027-03-10', RAMAZON], ['2028-02-27', RAMAZON], ['2026-05-27', QURBON], ['2027-05-17', QURBON], ['2028-05-05', QURBON]];

const iso = (t) => new Date(t).toISOString().slice(0, 10);
const T = (d) => Date.parse(`${d}T00:00:00Z`);
const DAY = 864e5;

export function holidayName(d, lang = 'uz') {
  const md = d.slice(5);
  const f = FIXED.find(([k]) => k === md);
  if (f) return f[1][lang] || f[1].en;
  const m = MOVING.find(([k]) => k === d);
  return m ? m[1][lang] || m[1].en : null;
}
export const isWorkday = (d) => { const w = new Date(T(d)).getUTCDay(); return w !== 0 && w !== 6 && !holidayName(d); };

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
/** Holidays that fall on weekdays between a and b inclusive: [{ date, name }]. */
export function holidaysBetween(a, b, lang = 'uz') {
  const out = [];
  for (let t = T(a); t <= T(b); t += DAY) { const d = iso(t), n = holidayName(d, lang), w = new Date(t).getUTCDay(); if (n && w !== 0 && w !== 6) out.push({ date: d, name: n }); }
  return out;
}
export const addDays = (d, n) => iso(T(d) + n * DAY);
export const daysBetween = (a, b) => Math.round((T(b) - T(a)) / DAY);
/** Today in Tashkent (UTC+5, no daylight saving), as 'YYYY-MM-DD'. */
export const tashkentToday = (now = Date.now()) => iso(now + 5 * 36e5);
