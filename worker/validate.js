// Validation of everything the model returns (SOLUTIONS-SPEC §2.8.4). Hand-written, no schema library. It drops or
// clamps and never throws on model content. Every string goes through the copy guard (worker/guard.js), is cut at a
// word boundary to its length, and loses any sentence that names money the visitor did not write.
import { guard, stripMoney } from './guard.js';
import { pickable } from '../src/shared/catalogue.js';
import { NEEDS_KEYS } from '../src/shared/price.js';

const ROLES = ['pm', 'designer', 'frontend', 'backend', 'mobile', 'bot', 'qa', 'devops', 'data', 'ml', 'hardware'];
const IMPACT_KEYS = ['hours_per_week', 'hourly_cost_usd', 'orders_per_month', 'avg_order_usd', 'margin_pct', 'uplift_pct', 'no_shows_per_month', 'errors_per_month', 'cost_per_error_usd'];
const IMPACT_MODELS = ['hours_saved', 'more_orders', 'fewer_no_shows', 'fewer_errors', 'none'];

/**
 * Cut to at most n characters (plus "…"). A whole sentence when one fits in most of the room; otherwise the cut lands
 * at the last clause boundary (or word) and ends with "…", so a summary never stops mid-clause as if it were complete.
 */
export function cut(s, n) {
  const a = [...String(s)];
  if (a.length <= n) return String(s);
  let t = a.slice(0, n).join('');
  const end = Math.max(t.lastIndexOf('. '), t.lastIndexOf('。'), t.lastIndexOf('! '), t.lastIndexOf('? '));
  if (end > n * 0.45) return t.slice(0, end + 1);
  // room for the "…": the result is at most n characters
  t = a.slice(0, n - 1).join('');
  n -= 1;
  const clause = Math.max(t.lastIndexOf(', '), t.lastIndexOf('; '), t.lastIndexOf(' – '), t.lastIndexOf('、'), t.lastIndexOf('，'));
  if (clause > n * 0.45) t = t.slice(0, clause);
  else {
    const sp = Math.max(t.lastIndexOf(' '), t.lastIndexOf('\u00a0'), t.lastIndexOf('、'));
    if (!/\s/.test(a[n]) && sp > n * 0.5) t = t.slice(0, sp);
  }
  return `${t.replace(/[\s,;:–—\-(、，.]+$/u, '')}…`;
}

// The model's short fields sometimes end in a stray token after their last sentence: "kerak.\"", "kerak.ʻ", "kerak..",
// "into the system.uh", "kerak.Ustalar odatlanishi", "ulash kerak. ҳ", "1C setup. ','. ' '". tidy() removes such a
// tail (and a lone letter of the other script in Latin Uzbek or English) and leaves a clean text exactly as it was.
const STOPS = '.!?。！？';
const lastStop = (x) => Math.max(...[...STOPS].map((c) => x.lastIndexOf(c)));
// a stop that is not a sentence end: only real abbreviations (т.е., т.к., и т.д., e.g., i.e., etc., h.k., va b.),
// never any short last word ("из них.Simple roles.", "hammasi bor.Infos.", "it is new.Roles." are junk tails)
const ABBR = /(?:^|[^\p{L}])(?:т\.\s?[екдпн]|e\.g|i\.e|h\.k|va b|etc|vs|incl|approx|напр|др|пр|гг?|ул|руб|млн|млрд|тыс|шт|mln|mlrd)\.$/iu;
const TECH = /^(?:js|ts|io|net|com|org|uz|ru|jp|ai|py|me)\b/i; // Next.js, qilich.com
const OTHER = { uz: /[\u0400-\u04ff]/u, en: /[\u0400-\u04ff]/u };
function stripQuotes(t) {
  for (;;) {
    const c = t.slice(-1);
    const n = (ch) => t.split(ch).length - 1;
    const stray = /[\s'`ʻʼ‘’,;:]/u.test(c) || (c === '"' && n('"') % 2 === 1) || (c === '»' && n('«') < n('»')) || (c === '”' && n('“') + n('„') < n('”')) || (c === ')' && n('(') < n(')')) || (c === ']' && n('[') < n(']'));
    if (!stray || t.length < 2) return t;
    t = t.slice(0, -1);
  }
}
export function tidy(s, lang) {
  let t = String(s).trim();
  for (let k = 0; k < 6; k++) {
    const before = t;
    t = t.replace(/(^|[^.])\.\.(?!\.)/g, '$1.').replace(/。。+/g, '。');
    // stray quotes, okina and spaces after the final stop
    const i = lastStop(t);
    if (i >= 0 && i < t.length - 1 && !/[\p{L}\p{N}]/u.test(t.slice(i + 1))) t = stripQuotes(t);
    // a tail after the last stop that is not a sentence
    const j = lastStop(t);
    if (j >= 0 && j < t.length - 1 && lang !== 'ja') {
      const head = t.slice(0, j + 1), tail = t.slice(j + 1);
      const words = tail.trim().split(/\s+/).filter(Boolean);
      if (!/[\p{L}\p{N}]/u.test(tail)) t = stripQuotes(t); // only what does not close a quote
      else if (ABBR.test(head) || /\d\.$/.test(head)) { /* an abbreviation or a number: not a sentence end */ }
      else if (/^\p{L}/u.test(tail) && !TECH.test(tail)) t = head; // "system.uh", "kerak.Ustalar odatlanishi"
      else if (/^\s/.test(tail) && words.length <= 2 && tail.trim().length <= 12 && [...head].length >= 24) t = head; // "kerak. ҳ"
    }
    // a final "sentence" with no letter or digit in it ("setup. ','."), or one stray short word ("kerak. ok.")
    if (STOPS.includes(t.slice(-1))) {
      const q = lastStop(t.slice(0, -1)), seg = t.slice(q + 1, -1);
      if (q >= 0 && seg.length && !/[\p{L}\p{N}]/u.test(seg)) t = t.slice(0, q + 1);
      else if (q >= 0 && lang !== 'ja' && /^\s\p{L}{1,3}$/u.test(seg) && !ABBR.test(t.slice(0, q + 1)) && [...t.slice(0, q + 1)].length >= 24) t = t.slice(0, q + 1);
      // a last "sentence" glued to the stop before it: "kerak.Infos."
      else if (q >= 0 && lang !== 'ja' && /^\p{L}/u.test(seg) && !TECH.test(seg) && !ABBR.test(t.slice(0, q + 1)) && !/\d\.$/.test(t.slice(0, q + 1)) && [...t.slice(0, q + 1)].length >= 24) t = t.slice(0, q + 1);
    }
    if (OTHER[lang]) t = t.replace(new RegExp(`(^|\\s)${OTHER[lang].source}{1,2}(?=[\\s.,;:!?]|$)`, 'gu'), '$1').replace(/\s+([.,;:!?])/g, '$1').replace(/\s{2,}/g, ' ').trim();
    if (t === before) break;
  }
  return t;
}
export function textOf(ctx, s, n, { money = true } = {}) {
  if (typeof s !== 'string') return '';
  let t = guard(s, ctx.lang);
  if (!t) return '';
  if (money) t = stripMoney(t, ctx.text);
  t = tidy(t, ctx.lang);
  return t ? cut(t, n) : '';
}
const oneOf = (v, list, d) => (list.includes(v) ? v : d);
const uniq = (a) => [...new Set(a)];
const ids = (v, ok, max = 99) => uniq((Array.isArray(v) ? v : []).filter((x) => typeof x === 'string' && ok(x))).slice(0, max);
const slug = (s, d) => (String(s || '').toLowerCase().replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 32) || d);
// quotes are matched after folding case, whitespace and the okina's look-alikes
export const norm = (s) => String(s).toLowerCase().normalize('NFC').replace(/[ʻʼ'‘’`]/g, "'").replace(/\s+/g, ' ').trim();

export function context(m, { lang, text = '', intake = {} }) {
  const pick = new Set(pickable(m).map((s) => s.id));
  return { m, lang, text, intake, isSol: (x) => pick.has(x), isMod: (x) => !!m.modifiers[x], isInt: (x) => !!m.integrations[x], isStack: (x) => !!m.pricing.stack[x] };
}

export function validateHeard(ctx, h) {
  const t = norm(ctx.text);
  const quotes = (Array.isArray(h?.quotes) ? h.quotes : []).filter((q) => typeof q === 'string' && q.trim().length >= 2)
    .filter((q) => t.includes(norm(q)) && guard(q, ctx.lang) === q.replace(/\s+/g, ' ').trim()).map((q) => q.replace(/\s+/g, ' ').trim()).slice(0, 4);
  const inds = [...Object.keys(ctx.m.catalogueIndustries || ctx.m.industries || {}), 'other'];
  return {
    summary: textOf(ctx, h?.summary, 150, { money: false }),
    quotes,
    industry: oneOf(h?.industry, inds, ctx.intake.industry && inds.includes(ctx.intake.industry) ? ctx.intake.industry : 'other'),
    size: oneOf(h?.size, ['solo', 'small', 'medium', 'large'], 'small'),
  };
}

export function validateQuestion(ctx, q, n) {
  const options = (Array.isArray(q?.options) ? q.options : []).slice(0, 4).map((o, i) => {
    const e = o?.effect || {};
    return {
      id: slug(o?.id, `o${i + 1}`),
      label: textOf(ctx, o?.label, 24),
      effect: {
        targets: ids(e.targets, ctx.isSol), size: oneOf(e.size, ['keep', 's', 'm', 'l'], 'keep'),
        add_modifiers: ids(e.add_modifiers, ctx.isMod), remove_modifiers: ids(e.remove_modifiers, ctx.isMod),
        add_integrations: ids(e.add_integrations, ctx.isInt), drop: ids(e.drop, ctx.isSol),
      },
    };
  }).filter((o) => o.label);
  const text = textOf(ctx, q?.text, 70);
  if (!text || options.length < 2) return null;
  const seen = new Set();
  for (const o of options) { while (seen.has(o.id)) o.id += '_'; seen.add(o.id); }
  return { id: slug(q?.id, `q${n}`), text, options };
}

/** One stage-1 solution, or null. `taken` holds the ids already chosen (the first one wins). */
export function validateSolution(ctx, s, n, taken) {
  const { m } = ctx;
  const custom = s?.catalogue_id === 'custom';
  if (!custom && !ctx.isSol(s?.catalogue_id)) return null;
  const based = custom ? ids(s.based_on, ctx.isSol, 3) : [];
  if (custom && !based.length) return null;
  const key = custom ? `custom:${based.join('+')}` : s.catalogue_id;
  if (taken.has(key)) return null;
  taken.add(key);
  const entry = m.byId.get(custom ? based[0] : s.catalogue_id);
  const typ = entry.difficulty;
  let difficulty = Number.isInteger(s.difficulty) && s.difficulty >= 1 && s.difficulty <= 5 ? s.difficulty : typ;
  difficulty = Math.min(typ + 2, Math.max(typ - 2, difficulty));
  const L = (o) => o?.[ctx.lang] || o?.en || '';
  return {
    n, catalogue_id: custom ? 'custom' : s.catalogue_id, based_on: based,
    title: textOf(ctx, s.title, 60) || L(entry.title),
    why: textOf(ctx, s.why, 280) || L(entry.oneliner),
    priority: oneOf(s.priority, ['must', 'should', 'could'], n === 1 ? 'must' : 'should'),
    scope: oneOf(s.scope, ['mvp', 'full'], 'mvp'),
    size: oneOf(s.size, ['s', 'm', 'l'], 's'),
    modifiers: ids(s.modifiers, ctx.isMod),
    integrations: ids(s.integrations, (x) => ctx.isInt(x) && !entry.integrations_included.includes(x)),
    depends_on: ids(s.depends_on, (x) => ctx.isSol(x) && x !== s.catalogue_id),
    difficulty, difficulty_reason: textOf(ctx, s.difficulty_reason, 90),
  };
}

/** The whole stage-1 output, from the pieces already validated while streaming plus the rest. */
export function finalizePick(ctx, raw, { heard, questions, solutions }) {
  let status = oneOf(raw?.status, ['ok', 'need_more', 'not_business'], solutions.length ? 'ok' : 'need_more');
  let sols = solutions.slice(0, 4);
  if (status === 'not_business') sols = [];
  if (status === 'need_more') sols = sols.slice(0, 1);
  const chosen = new Set(sols.map((s) => s.catalogue_id).filter((x) => x !== 'custom'));
  // dependencies only among the chosen, and never in a circle
  for (const s of sols) s.depends_on = s.depends_on.filter((d) => chosen.has(d));
  const by = new Map(sols.map((s) => [s.catalogue_id, s]));
  const reaches = (from, to, seen = new Set()) => { if (from === to) return true; if (seen.has(from)) return false; seen.add(from); return (by.get(from)?.depends_on || []).some((d) => reaches(d, to, seen)); };
  for (const s of sols) s.depends_on = s.depends_on.filter((d) => !reaches(d, s.catalogue_id));
  const qs = questions.slice(0, 3).map((q) => ({ ...q, options: q.options.map((o) => ({ ...o, effect: { ...o.effect, targets: o.effect.targets.filter((t) => chosen.has(t)), drop: o.effect.drop.filter((t) => chosen.has(t)) } })) }));
  const nr = (Array.isArray(raw?.not_recommended) ? raw.not_recommended : [])
    .filter((x) => ctx.isSol(x?.catalogue_id) && !chosen.has(x.catalogue_id))
    .filter((x, i, a) => a.findIndex((y) => y.catalogue_id === x.catalogue_id) === i)
    .slice(0, 2).map((x) => ({ catalogue_id: x.catalogue_id, why: textOf(ctx, x.why, 160) })).filter((x) => x.why);
  if (status === 'ok' && !sols.length && qs.length) status = 'need_more';
  return {
    status, heard, questions: status === 'not_business' ? [] : qs, solutions: sols, not_recommended: status === 'not_business' ? [] : nr,
    roadmap_note: textOf(ctx, raw?.roadmap_note, 160), first_step: textOf(ctx, raw?.first_step, 160),
    assumptions: (Array.isArray(raw?.assumptions) ? raw.assumptions : []).map((a) => textOf(ctx, a, 160)).filter(Boolean).slice(0, 4),
  };
}

/**
 * The Japanese page estimates for a company in Japan: an assumed office hour there is not a Tashkent hour (2–4 USD).
 * An assumed hourly cost under JA_HOUR_MIN becomes JA_HOUR (the visitor's own figure, from_text, is kept).
 */
export const JA_HOUR_MIN = 15, JA_HOUR = 25;
export function jaWage(lang, inputs) {
  if (lang !== 'ja') return inputs;
  for (const i of inputs) if (i.key === 'hourly_cost_usd' && i.basis !== 'from_text' && i.value < JA_HOUR_MIN) i.value = JA_HOUR;
  return inputs;
}

/** One stage-2 detail. Phases are always the four, in order; a missing deliverable is '' (the page uses the default). */
export function validateDetail(ctx, d) {
  const list = (v, n, max) => (Array.isArray(v) ? v : []).map((x) => textOf(ctx, x, n)).filter(Boolean).slice(0, max);
  const phases = ['plan', 'build', 'test', 'launch'].map((key) => ({ key, deliverable: textOf(ctx, (d?.phases || []).find((p) => p?.key === key)?.deliverable, 70) }));
  const team = [];
  for (const t of Array.isArray(d?.team) ? d.team : []) if (ROLES.includes(t?.role) && !team.some((x) => x.role === t.role)) team.push({ role: t.role, count: [1, 2, 3].includes(t.count) ? t.count : 1 });
  const risks = (Array.isArray(d?.risks) ? d.risks : []).map((r) => ({ text: textOf(ctx, r?.text, 100), mitigation: textOf(ctx, r?.mitigation, 100), adds_weeks: [0, 1, 2, 3, 4].includes(r?.adds_weeks) ? r.adds_weeks : 0 })).filter((r) => r.text).slice(0, 3);
  const imp = d?.impact || {};
  let model = oneOf(imp.model, IMPACT_MODELS, 'none');
  const inputs = [];
  for (const i of Array.isArray(imp.inputs) ? imp.inputs : []) {
    if (!IMPACT_KEYS.includes(i?.key) || inputs.some((x) => x.key === i.key) || typeof i.value !== 'number' || !Number.isFinite(i.value)) continue;
    inputs.push({ key: i.key, label: textOf(ctx, i.label, 80, { money: false }) || i.key, value: i.value, basis: i.basis === 'from_text' ? 'from_text' : 'assumed' });
  }
  jaWage(ctx.lang, inputs);
  if (model !== 'none' && NEEDS_KEYS[model].some((k) => !inputs.some((x) => x.key === k))) model = 'none';
  return {
    deliverables_mvp: list(d?.deliverables_mvp, 70, 6), deliverables_full: list(d?.deliverables_full, 70, 5), phases,
    team: team.slice(0, 6), stack: ids(d?.stack, ctx.isStack, 6), risks, needs: list(d?.needs, 100, 6),
    impact: { model, summary: textOf(ctx, imp.summary, 160), inputs: model === 'none' ? [] : inputs.filter((x) => NEEDS_KEYS[model].includes(x.key)) },
  };
}
