// Money, weeks, months and dates as each language writes them (SOLUTIONS-SPEC §3.3.8). Pure, no Intl dependence
// beyond PluralRules (with a fallback), so the Worker, the build and every browser print the same characters.
// Spaces inside numbers and ranges are NBSP (U+00A0, in every font subset); never U+202F or U+2009.
export const NB = '\u00a0';
const DASH = '–';
const TILDE = '〜';

export const MONTHS = {
  uz: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
  ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  ja: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
};
export const MONTHS_SHORT = {
  uz: ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek'],
  ru: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  ja: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
};

// whole numbers grouped: 12 012 (uz, ru, NBSP) or 12,012 (en, ja)
export function int(n, lang) {
  const s = String(Math.round(Math.abs(n))), sep = lang === 'en' || lang === 'ja' ? ',' : NB;
  return (n < 0 ? '−' : '') + s.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}
// one decimal at most: 4,5 (uz, ru) or 4.5 (en, ja)
export function dec(n, lang) {
  const r = Math.round(n * 10) / 10;
  const s = Number.isInteger(r) ? int(r, lang) : `${int(Math.trunc(r), lang)}${lang === 'en' || lang === 'ja' ? '.' : ','}${Math.round(Math.abs(r * 10)) % 10}`;
  return s;
}
const span = (a, b, f, lang) => (a === b ? f(a) : `${f(a)}${lang === 'ja' ? TILDE : DASH}${f(b)}`);

/** "$3 000–4 100" (uz, ru), "$3,000–4,100" (en), "3,000〜4,100ドル" (ja) */
export function usd(r, lang) {
  if (lang === 'ja') return `${span(r[0], r[1], (x) => int(x, lang), lang)}ドル`;
  return `$${span(r[0], r[1], (x) => int(x, lang), lang)}`;
}
/** "38–52 mln soʻm", "38–52 млн сум", "UZS 38–52 mln", "3,800万〜5,200万スム"; under 1 mln in thousands */
export function uzs(r, lang) {
  const [a, b] = r;
  if (lang === 'ja') return `${span(a, b, (x) => `${int(x / 1e4, 'ja')}万`, lang)}スム`;
  if (b < 1e6) {
    const v = span(a / 1e3, b / 1e3, (x) => int(x, lang), lang);
    return lang === 'uz' ? `${v} ming soʻm` : lang === 'ru' ? `${v} тыс.${NB}сум` : `UZS ${v} thousand`;
  }
  const v = span(a / 1e6, b / 1e6, (x) => dec(x, lang), lang);
  return lang === 'uz' ? `${v} mln soʻm` : lang === 'ru' ? `${v} млн${NB}сум` : `UZS ${v} mln`;
}
/** The pair of strings the sheets show: the large one in the chosen currency, the small one in the other. */
export function money(usdR, uzsR, cur, lang) {
  return cur === 'usd' ? [usd(usdR, lang), uzs(uzsR, lang)] : [uzs(uzsR, lang), usd(usdR, lang)];
}

let PR = {};
function plural(lang, n) {
  try { return (PR[lang] ||= new Intl.PluralRules(lang)).select(n); } catch { return n === 1 ? 'one' : 'other'; }
}
const RU = { week: ['неделя', 'недели', 'недель'], month: ['месяц', 'месяца', 'месяцев'] };
function ruForm(word, n) { const c = plural('ru', n); return RU[word][c === 'one' ? 0 : c === 'few' ? 1 : 2]; }
/**
 * A UI string for a count n: `forms` is one string (Uzbek and Japanese need no plural after a number), or
 * [one, few, many] for Russian, or [one, other] for English. "основа + 5 дополнений", "1 deliverable".
 */
export function plForm(forms, n, lang) {
  if (!Array.isArray(forms)) return forms;
  const c = plural(lang, n);
  if (lang === 'ru') return forms[c === 'one' ? 0 : c === 'few' ? 1 : 2] ?? forms[forms.length - 1];
  return forms[c === 'one' ? 0 : 1] ?? forms[forms.length - 1];
}

/** "4–6 hafta", "4–6 недель", "4–6 weeks", "4〜6週間" (the Russian form follows the upper bound) */
export function weeks(r, lang) {
  const [a, b] = r.map((x) => Math.round(x * 2) / 2);
  const v = span(a, b, (x) => dec(x, lang), lang);
  if (lang === 'uz') return `${v}${NB}hafta`;
  if (lang === 'ru') return `${v}${NB}${ruForm('week', Number.isInteger(b) ? b : 2)}`;
  if (lang === 'ja') return `${v}週間`;
  return `${v}${NB}${b === 1 ? 'week' : 'weeks'}`;
}
export function months(r, lang) {
  const [a, b] = r;
  const v = span(a, b, (x) => int(x, lang), lang);
  if (lang === 'uz') return `${v}${NB}oy`;
  if (lang === 'ru') return `${v}${NB}${ruForm('month', b)}`;
  if (lang === 'ja') return `${v}か月`;
  return `${v}${NB}${b === 1 ? 'month' : 'months'}`;
}

// dates are 'YYYY-MM-DD' strings or UTC Dates
const parts = (d) => { const x = typeof d === 'string' ? new Date(`${d}T00:00:00Z`) : d; return [x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate()]; };
/** "15–29 dekabr", "28 noyabr–12 dekabr", "15–29 декабря", "15–29 December", "12月15日〜29日" */
export function dateRange(d1, d2, lang) {
  const [y1, m1, a] = parts(d1), [y2, m2, b] = parts(d2);
  const M = MONTHS[lang] || MONTHS.en;
  const yr = (y) => (y1 !== y2 ? ` ${y}` : '');
  if (lang === 'ja') {
    const j1 = `${y1 !== y2 ? `${y1}年` : ''}${M[m1]}${a}日`;
    const j2 = `${y1 !== y2 ? `${y2}年` : ''}${m1 === m2 && y1 === y2 ? '' : M[m2]}${b}日`;
    return y1 === y2 && m1 === m2 && a === b ? j1 : `${j1}${TILDE}${j2}`;
  }
  if (y1 === y2 && m1 === m2) return a === b ? `${a}${NB}${M[m1]}` : `${a}${DASH}${b}${NB}${M[m1]}`;
  return `${a}${NB}${M[m1]}${yr(y1)}${DASH}${b}${NB}${M[m2]}${yr(y2)}`;
}
/** "20.10.2026" (uz, ru, en), "2026年10月20日" (ja) */
export function dateNum(d, lang) {
  const [y, m, day] = parts(d);
  if (lang === 'ja') return `${y}年${m + 1}月${day}日`;
  return `${String(day).padStart(2, '0')}.${String(m + 1).padStart(2, '0')}.${y}`;
}

/** The rate line (§3.3.8), plus the "last known rate" note for a fallback rate. */
export function rateLine(rate, lang) {
  const d = dateNum(rate.date, lang), v = int(rate.uzs_per_usd, lang), old = rate.source !== 'cbu';
  if (lang === 'uz') return `Kurs: Markaziy bank, ${d}, 1${NB}$${NB}=${NB}${v}${NB}soʻm${old ? ' (oxirgi maʼlum kurs)' : ''}`;
  if (lang === 'ru') return `Курс ЦБ РУз на ${d}: 1${NB}$${NB}=${NB}${v}${NB}сум${old ? ' (последний известный курс)' : ''}`;
  if (lang === 'ja') return `為替レート：ウズベキスタン中央銀行 ${d}、1ドル＝${v}スム${old ? '（最新の取得値）' : ''}`;
  return `Rate: Central Bank of Uzbekistan, ${d}, $1${NB}=${NB}UZS${NB}${v}${old ? ' (last known rate)' : ''}`;
}
