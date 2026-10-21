// The price engine (SOLUTIONS-SPEC §2.6). Pure and deterministic: the Worker and the browser import this one file, so
// the same choices always give the same weeks, USD and soʻm, and a shared estimate re-prices to the same numbers.
// SamurAI never writes a number: it chooses an entry, a size, modifiers and integrations; this file counts.
//
// `m` is a model from src/shared/catalogue.js (normalise in the Worker, expand in the browser).
// Ranges are [min, max]. Types delivered to the page (SOLUTIONS-SPEC §2.5):
/**
 * @typedef {[number, number]} Range
 * @typedef {{ kind: 'base'|'integration'|'modifier', id: string, label: string, usd: Range, weeks: Range }} Line
 * @typedef {{ key: 'plan'|'build'|'test'|'launch', weeks: Range, deliverable: string }} Phase
 * @typedef {{ n: number, catalogue_id: string, based_on: string[], catalogue: object|null, title: string, why: string,
 *   priority: 'must'|'should'|'could', scope: 'mvp'|'full', size: 's'|'m'|'l', modifiers: string[], integrations: string[],
 *   depends_on: string[], difficulty: number, difficulty_reason: string, hamon: string,
 *   weeks: { mvp: Range, full: Range }, usd: { mvp: Range, full: Range }, uzs: { mvp: Range, full: Range },
 *   monthly_usd: Range, monthly_uzs: Range, price_lines: { mvp: Line[], full: Line[] }, phases: { mvp: Phase[], full: Phase[] },
 *   notes: string[], detail: object|null }} Solution
 */
export const HAMON = ['suguha', 'notare', 'gunome', 'choji', 'midare'];
export const PHASES = ['plan', 'build', 'test', 'launch'];
const SCOPES = ['mvp', 'full'];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const mul = (a, k) => [a[0] * k, a[1] * k];
const zero = () => [0, 0];
const L = (o, lang) => (o ? o[lang] ?? o.en ?? o.uz ?? Object.values(o)[0] ?? '' : '');
const ceil = (x, s) => Math.ceil(x / s - 1e-9) * s;
const floor = (x, s) => Math.floor(x / s + 1e-9) * s;
export const solId = (s) => (s.catalogue_id === 'custom' ? `custom-${s.n}` : s.catalogue_id);

// ---- rounding (§2.6.5): always last, never inside sums ----
export const roundUsd = (r, step = 100) => [Math.max(0, floor(r[0], step)), Math.max(step, ceil(r[1], step))];
export const roundWeeks = (r) => [Math.max(1, Math.floor(r[0] + 1e-9)), Math.max(1, Math.ceil(r[1] - 1e-9))];
const uzsStep = (v) => (v < 2e6 ? 1e5 : v < 5e7 ? 5e5 : v < 2e8 ? 1e6 : 5e6);
export function uzsRange(usd, rate) {
  const a = usd[0] * rate, b = usd[1] * rate;
  const lo = a < 1e6 ? floor(a, 1e4) : floor(a, uzsStep(a));
  const hi = b < 1e6 ? ceil(b, 1e4) : ceil(b, uzsStep(b));
  return [lo, Math.max(lo, hi)];
}
const half = (x) => Math.round(x * 2) / 2;

// ---- one entry at one choice (§2.6.1–2.6.2) ----
function sizedRange(r, band) { return [r[0] + band[0] * (r[1] - r[0]), r[0] + band[1] * (r[1] - r[0])]; }

/** The unrounded price of a catalogue entry for a choice { size, modifiers, integrations }, both scopes. */
export function priceEntry(m, entry, choice, lang = 'en') {
  const P = m.pricing, band = P.size_band[choice.size] || P.size_band.m;
  const mods = (choice.modifiers || []).filter((k) => m.modifiers[k]);
  const ints = (choice.integrations || []).filter((k) => m.integrations[k] && !entry.integrations_included.includes(k));
  let mult = 1, wmult = 1, addUsd = zero(), addW = zero();
  for (const k of mods) { const d = m.modifiers[k]; mult *= d.mult || 1; wmult *= d.weeks_mult || 1; if (d.add_usd) addUsd = add(addUsd, d.add_usd); if (d.add_weeks) addW = add(addW, d.add_weeks); }
  mult = Math.min(P.max_mult, mult); wmult = Math.min(P.max_mult, wmult);
  let iUsd = zero(), iW = zero(), iMon = zero();
  for (const k of ints) { const d = m.integrations[k]; iUsd = add(iUsd, d.add_usd); iW = add(iW, d.add_weeks); iMon = add(iMon, d.monthly_usd || zero()); }
  const multMods = mods.filter((k) => (m.modifiers[k].mult || 1) > 1);
  const out = { usd: {}, weeks: {}, lines: {}, monthly: add(entry.monthly_usd, iMon) };
  for (const sc of SCOPES) {
    const su = sizedRange(entry[sc].usd, band), sw = sizedRange(entry[sc].weeks, band);
    const baseUsd = mul(su, mult), baseW = mul(sw, wmult);
    out.usd[sc] = add(add(baseUsd, addUsd), iUsd);
    out.weeks[sc] = add(add(baseW, addW), mul(iW, P.integration_weeks_overlap));
    const baseLabel = L(entry.title, lang) + (multMods.length ? ` · ${multMods.map((k) => L(m.modifiers[k].label, lang)).join(', ')}` : '');
    out.lines[sc] = [
      { kind: 'base', id: entry.id, label: baseLabel, usd: baseUsd, weeks: baseW },
      ...mods.filter((k) => m.modifiers[k].add_usd).map((k) => ({ kind: 'modifier', id: k, label: L(m.modifiers[k].label, lang), usd: m.modifiers[k].add_usd, weeks: m.modifiers[k].add_weeks || zero() })),
      ...ints.map((k) => ({ kind: 'integration', id: k, label: m.integrations[k].name, usd: m.integrations[k].add_usd, weeks: mul(m.integrations[k].add_weeks, P.integration_weeks_overlap) })),
    ];
  }
  return out;
}

/** A custom solution (§2.6.3): its based_on entries at the chosen size, summed; weeks are the longest plus overhead. */
function priceCustom(m, sol, lang) {
  const P = m.pricing, parts = sol.based_on.map((id) => m.byId.get(id)).filter(Boolean);
  const each = parts.map((e, i) => priceEntry(m, e, { size: sol.size, modifiers: i === 0 ? sol.modifiers : [], integrations: i === 0 ? sol.integrations : [] }, lang));
  const out = { usd: {}, weeks: {}, lines: {}, monthly: each.reduce((a, x) => add(a, x.monthly), zero()) };
  for (const sc of SCOPES) {
    out.usd[sc] = mul(each.reduce((a, x) => add(a, x.usd[sc]), zero()), P.custom_factor);
    const ws = each.map((x) => x.weeks[sc]).sort((a, b) => b[1] - a[1]);
    out.weeks[sc] = ws.slice(1).reduce((a, w) => add(a, mul(w, P.parallel_overhead)), ws[0] || [1, 1]);
    out.lines[sc] = each.flatMap((x) => x.lines[sc]);
  }
  return out;
}

/** Rounded weeks, USD and phases for both scopes; mvp ≤ full holds after rounding (§2.6.5). */
function finish(m, raw, group, texts) {
  const step = m.pricing.round?.usd || 100;
  const weeks = { mvp: roundWeeks(raw.weeks.mvp), full: roundWeeks(raw.weeks.full) };
  const usd = { mvp: roundUsd(raw.usd.mvp, step), full: roundUsd(raw.usd.full, step) };
  for (const k of [0, 1]) {
    if (weeks.mvp[k] > weeks.full[k]) weeks.full[k] = weeks.mvp[k];
    if (usd.mvp[k] > usd.full[k]) usd.full[k] = usd.mvp[k];
  }
  const split = m.pricing.phase_split[group] || m.pricing.phase_split.default;
  const phases = {};
  for (const sc of SCOPES) phases[sc] = PHASES.map((key) => ({ key, weeks: [Math.max(0.5, half(weeks[sc][0] * split[key])), Math.max(0.5, half(weeks[sc][1] * split[key]))], deliverable: texts?.[key] || '' }));
  return { weeks, usd, phases, monthly: [Math.max(0, floor(raw.monthly[0], 10)), Math.max(0, ceil(raw.monthly[1], 10))], lines: raw.lines };
}

/** Prices one pick solution (validated stage-1 output) into the §2.5 Solution shape, with the detail merged in. */
export function enrichSolution(m, sol, { lang, rate, detail = null, urlOf = null } = {}) {
  const custom = sol.catalogue_id === 'custom';
  const entry = custom ? m.byId.get(sol.based_on[0]) : m.byId.get(sol.catalogue_id);
  if (!entry) return null;
  const raw = custom ? priceCustom(m, sol, lang) : priceEntry(m, entry, sol, lang);
  const texts = { ...(m.phase_text?.[lang] || {}) };
  for (const ph of detail?.phases || []) if (ph.deliverable) texts[ph.key] = ph.deliverable;
  const f = finish(m, raw, entry.group, texts);
  const g = m.groups[entry.group];
  const notes = [];
  if (custom) notes.push('custom');
  const s = {
    n: sol.n, catalogue_id: sol.catalogue_id, based_on: sol.based_on || [],
    catalogue: custom ? null : { id: entry.id, title: L(entry.title, lang), group: entry.group, group_title: L(g?.title, lang), url: urlOf ? urlOf(entry, lang) : '' },
    title: sol.title, why: sol.why, priority: sol.priority, scope: sol.scope, size: sol.size,
    modifiers: sol.modifiers || [], integrations: sol.integrations || [], depends_on: sol.depends_on || [],
    difficulty: sol.difficulty, difficulty_reason: sol.difficulty_reason || '', hamon: HAMON[(sol.difficulty || 1) - 1],
    weeks: f.weeks, usd: f.usd,
    uzs: { mvp: uzsRange(f.usd.mvp, rate.uzs_per_usd), full: uzsRange(f.usd.full, rate.uzs_per_usd) },
    monthly_usd: f.monthly, monthly_uzs: uzsRange(f.monthly, rate.uzs_per_usd),
    price_lines: f.lines, phases: f.phases, notes,
    detail: detail ? mergeDetail(m, entry, detail, f, sol.scope, lang, rate) : null,
  };
  return s;
}

// ---- stage-2 detail, merged with the catalogue defaults and given its derived numbers ----
const UNIT = { hours_per_week: 'hours_per_week', hourly_cost_usd: 'usd_per_hour', orders_per_month: 'count_per_month', avg_order_usd: 'usd', margin_pct: 'pct', uplift_pct: 'pct', no_shows_per_month: 'count_per_month', errors_per_month: 'count_per_month', cost_per_error_usd: 'usd' };
export const NEEDS_KEYS = { hours_saved: ['hours_per_week', 'hourly_cost_usd'], more_orders: ['orders_per_month', 'uplift_pct', 'avg_order_usd', 'margin_pct'], fewer_no_shows: ['no_shows_per_month', 'uplift_pct', 'avg_order_usd', 'margin_pct'], fewer_errors: ['errors_per_month', 'uplift_pct', 'cost_per_error_usd'] };
export function clampInput(key, v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  const max = /pct$/.test(key) ? 100 : key === 'hours_per_week' ? 168 : key === 'hourly_cost_usd' ? 50 : /usd$/.test(key) ? 100000 : 1000000;
  return Math.min(max, Math.max(0, n));
}
function mergeDetail(m, entry, d, f, scope, lang, rate) {
  const seen = new Set();
  const needs = [...(d.needs || []), ...(L(entry.needs, lang) || [])].filter((x) => { const k = String(x).toLowerCase().slice(0, 24); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 6);
  const team = (d.team?.length ? d.team : entry.team).map((t) => ({ role: t.role, label: L(m.pricing.roles?.[t.role], lang) || t.role, count: t.count }));
  const stack = (d.stack?.length ? d.stack : entry.stack).filter((id) => m.pricing.stack?.[id]).map((id) => ({ id, name: m.pricing.stack[id] }));
  const risks = (d.risks || []).map((r) => ({ ...r, adds_usd: riskUsd(r.adds_weeks, f.usd[scope], f.weeks[scope], m.pricing.round?.usd || 100) }));
  const imp = d.impact || { model: 'none', summary: '', inputs: [] };
  const inputs = (imp.inputs || []).map((i) => ({ key: i.key, label: i.label, unit: UNIT[i.key] || 'count_per_month', value: clampInput(i.key, i.value), basis: i.basis === 'from_text' ? 'from_text' : 'assumed' }));
  const impact = { model: imp.model, summary: imp.summary || '', inputs, payback_months: paybackShown(imp.model, inputs, f.usd[scope], f.monthly).months };
  return { deliverables_mvp: d.deliverables_mvp || [], deliverables_full: d.deliverables_full || [], team, stack, risks, needs, impact };
}

/** §2.6.10: extra USD if a risk happens: its weeks × the price per week of the recommended scope, rounded to 100. */
export function riskUsd(weeks, usd, wk, step = 100) {
  if (!weeks) return [0, 0];
  return [floor(weeks * usd[0] / Math.max(1, wk[1]), step), ceil(weeks * usd[1] / Math.max(1, wk[0]), step)];
}

/** §2.6.9: months until the solution pays for itself, or null ("hisoblab boʻlmadi"). Monthly gain in USD. */
export function monthlyGain(model, inputs) {
  const keys = NEEDS_KEYS[model];
  if (!keys) return null;
  const v = Object.fromEntries((inputs || []).map((i) => [i.key, clampInput(i.key, i.value)]));
  if (keys.some((k) => !(k in v))) return null;
  if (model === 'hours_saved') return v.hours_per_week * 4.33 * v.hourly_cost_usd;
  if (model === 'more_orders') return v.orders_per_month * v.uplift_pct / 100 * v.avg_order_usd * v.margin_pct / 100;
  if (model === 'fewer_no_shows') return v.no_shows_per_month * v.uplift_pct / 100 * v.avg_order_usd * v.margin_pct / 100;
  return v.errors_per_month * v.uplift_pct / 100 * v.cost_per_error_usd;
}
export function payback(model, inputs, priceUsd, monthlyUsd) {
  const gain = monthlyGain(model, inputs);
  if (gain == null) return null;
  const net = gain - (monthlyUsd[0] + monthlyUsd[1]) / 2;
  if (!(net > 0)) return null;
  return [Math.max(1, Math.ceil(priceUsd[0] / net)), Math.max(1, Math.ceil(priceUsd[1] / net))];
}
/**
 * The payback the page may show. A range beyond PAYBACK_CAP_MONTHS is not a number anyone should plan on (a Tashkent
 * office hour nets little after running costs), so it becomes the qualitative line instead.
 * → { months: [a, b] } | { months: null, why: 'na' (missing input or no net gain) | 'long' (over the cap) }
 */
export const PAYBACK_CAP_MONTHS = 36;
export function paybackShown(model, inputs, priceUsd, monthlyUsd) {
  const pb = payback(model, inputs, priceUsd, monthlyUsd);
  if (!pb) return { months: null, why: 'na' };
  if (pb[1] > PAYBACK_CAP_MONTHS) return { months: null, why: 'long' };
  return { months: pb };
}

// ---- the plan (§2.6.6): selection, schedule, totals ----
export function defaultSelection(solutions) {
  return solutions.map((s) => ({ id: solId(s), state: s.priority === 'could' ? 'off' : s.scope }));
}

/** Totals and tracks for a selection: [{ id, state }]. The schedule respects depends_on (start at the deps' mvp_end). */
export function plan(m, solutions, selection, rate) {
  const P = m.pricing, step = P.round?.usd || 100;
  const state = new Map(selection.map((x) => [x.id, x.state]));
  const on = solutions.filter((s) => (state.get(solId(s)) || 'off') !== 'off');
  const byCat = new Map(on.map((s) => [s.catalogue_id, s]));
  const tracks = new Map();
  const resolve = (s, depth = 0) => {
    const id = solId(s);
    if (tracks.has(id)) return tracks.get(id);
    const sc = state.get(id);
    let start = [0, 0];
    if (depth < 8) for (const d of s.depends_on || []) { const dep = byCat.get(d); if (dep && dep !== s) { const t = resolve(dep, depth + 1); start = [Math.max(start[0], t.mvp_end[0]), Math.max(start[1], t.mvp_end[1])]; } }
    const t = { id, start, mvp_end: add(start, s.weeks.mvp), end: add(start, s.weeks[sc]) };
    tracks.set(id, t);
    return t;
  };
  for (const s of on) resolve(s);
  const list = on.map((s) => tracks.get(solId(s)));
  // shared parts (backend, admin, auth, design) are counted once: pct × the (k − 1) smallest prices with the tag
  let saving = [0, 0];
  const price = (s) => s.usd[state.get(solId(s))];
  for (const [tag, pct] of Object.entries(P.shared || {})) {
    const withTag = on.filter((s) => (m.byId.get(s.catalogue_id === 'custom' ? s.based_on[0] : s.catalogue_id)?.shares || []).includes(tag));
    if (withTag.length < 2) continue;
    const k = withTag.length - 1;
    const mins = withTag.map((s) => price(s)[0]).sort((a, b) => a - b).slice(0, k);
    const maxs = withTag.map((s) => price(s)[1]).sort((a, b) => a - b).slice(0, k);
    saving = add(saving, [pct * mins.reduce((a, b) => a + b, 0), pct * maxs.reduce((a, b) => a + b, 0)]);
  }
  saving = [floor(saving[0], step), floor(saving[1], step)];
  const gross = on.reduce((a, s) => add(a, price(s)), zero());
  const usd = on.length ? roundUsd([gross[0] - saving[0], gross[1] - saving[1]], step) : [0, 0];
  usd[1] = Math.max(usd[0], usd[1]);
  // weeks: the latest end, plus overhead for every track that really runs alongside the critical one. Two tracks
  // overlap only when they do on both bounds (min against min, max against max), and never along a depends_on
  // chain: a dependant starts where its dependency's MVP ends, which is a sequence, not parallel work.
  let weeks = [0, 0], parallel = false;
  if (list.length) {
    const solOf = new Map(on.map((s) => [solId(s), s]));
    const anc = new Map();
    const ancestors = (s, depth = 0) => {
      const id = solId(s);
      if (anc.has(id)) return anc.get(id);
      const set = new Set();
      anc.set(id, set);
      if (depth < 8) for (const d of s.depends_on || []) { const dep = byCat.get(d); if (dep && dep !== s) { set.add(solId(dep)); for (const x of ancestors(dep, depth + 1)) set.add(x); } }
      return set;
    };
    const linked = (a, b) => ancestors(solOf.get(a.id)).has(b.id) || ancestors(solOf.get(b.id)).has(a.id);
    const overlaps = (a, b) => !linked(a, b) && [0, 1].every((k) => a.start[k] < b.end[k] && b.start[k] < a.end[k]);
    const crit = list.reduce((a, t) => (t.end[1] > a.end[1] ? t : a), list[0]);
    const over = list.filter((t) => t !== crit && overlaps(t, crit));
    parallel = list.some((a, i) => list.some((b, j) => j > i && overlaps(a, b)));
    const ow = over.reduce((a, t) => add(a, [t.end[0] - t.start[0], t.end[1] - t.start[1]]), zero());
    weeks = roundWeeks([Math.max(...list.map((t) => t.end[0])) + P.parallel_overhead * ow[0], crit.end[1] + P.parallel_overhead * ow[1]]);
  }
  const monthly = on.reduce((a, s) => add(a, s.monthly_usd), zero());
  return {
    selection: solutions.map((s) => ({ id: solId(s), state: state.get(solId(s)) || 'off' })),
    tracks: list,
    totals: {
      usd, uzs: uzsRange(usd, rate.uzs_per_usd), weeks, monthly_usd: monthly, monthly_uzs: uzsRange(monthly, rate.uzs_per_usd),
      shared_saving_usd: saving, shared_saving_uzs: uzsRange(saving, rate.uzs_per_usd), parallel, count: on.length,
    },
  };
}

/** §2.6.7: the largest selection that fits, greedily on the max of each range. Returns { selection, dropped, fits }. */
export function fit(m, solutions, { budgetUsd = Infinity, deadlineWeeks = Infinity } = {}, rate) {
  const sel = new Map(solutions.map((s) => [solId(s), 'off']));
  const ok = () => { const p = plan(m, solutions, [...sel].map(([id, state]) => ({ id, state })), rate).totals; return p.usd[1] <= budgetUsd && p.weeks[1] <= deadlineWeeks; };
  const tryState = (s, st) => { const id = solId(s), prev = sel.get(id); sel.set(id, st); if (!ok()) sel.set(id, prev); };
  const by = (p) => solutions.filter((s) => s.priority === p);
  for (const s of by('must')) tryState(s, 'mvp');
  for (const s of by('must')) if (sel.get(solId(s)) === 'mvp') tryState(s, 'full');
  for (const s of by('should')) tryState(s, 'mvp');
  for (const s of by('should')) if (sel.get(solId(s)) === 'mvp') tryState(s, 'full');
  for (const s of by('could')) tryState(s, 'mvp');
  const selection = solutions.map((s) => ({ id: solId(s), state: sel.get(solId(s)) }));
  const dropped = solutions.filter((s) => sel.get(solId(s)) === 'off').map(solId);
  // nothing fits: the closest option is the cheapest must (or any) at MVP
  let closest = null;
  if (dropped.length === solutions.length && solutions.length) {
    const pool = by('must').length ? by('must') : solutions;
    const c = pool.reduce((a, s) => (s.usd.mvp[1] < a.usd.mvp[1] ? s : a), pool[0]);
    closest = { id: solId(c), usd: c.usd.mvp, weeks: c.weeks.mvp };
  }
  return { selection, dropped, fits: dropped.length < solutions.length, closest };
}

/** Presets (§3.3.12): lean (must at MVP), balanced (must full, should MVP), full (everything full). */
export function preset(solutions, name) {
  return solutions.map((s) => ({
    id: solId(s),
    state: name === 'full' ? 'full' : name === 'lean' ? (s.priority === 'must' ? 'mvp' : 'off') : s.priority === 'must' ? 'full' : s.priority === 'should' ? 'mvp' : 'off',
  }));
}

/** §2.6.8: a question's answer changes the targeted choices; returns { pick (new), off: ids to switch off }. */
export function applyEffect(pick, effect) {
  const targets = new Set(effect.targets?.length ? effect.targets : pick.solutions.map((s) => s.catalogue_id));
  const solutions = pick.solutions.map((s) => {
    if (!targets.has(s.catalogue_id)) return s;
    const mods = new Set(s.modifiers);
    for (const k of effect.add_modifiers || []) mods.add(k);
    for (const k of effect.remove_modifiers || []) mods.delete(k);
    return { ...s, size: effect.size && effect.size !== 'keep' ? effect.size : s.size, modifiers: [...mods], integrations: [...new Set([...s.integrations, ...(effect.add_integrations || [])])] };
  });
  return { pick: { ...pick, solutions }, off: effect.drop || [] };
}

/** The whole priced result from a validated pick and its details (Worker on stream end, browser on share/re-price). */
export function priceResult(m, { pick, details = {}, lang, rate, urlOf, selection = null }) {
  const solutions = pick.solutions.map((s) => enrichSolution(m, s, { lang, rate, detail: details[s.catalogue_id === 'custom' ? `custom-${s.n}` : s.catalogue_id] || null, urlOf })).filter(Boolean);
  const sel = selection || defaultSelection(solutions);
  const p = plan(m, solutions, sel, rate);
  return { solutions, plan: { ...p, roadmap_note: pick.roadmap_note || '', first_step: pick.first_step || '', assumptions: pick.assumptions || [] } };
}
