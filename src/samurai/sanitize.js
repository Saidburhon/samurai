// A share link (#r=…) or the reopened last estimate is data anyone can type. Before it is priced or painted, every
// field is checked against the shapes worker/validate.js produces (a browser port of its shape checks): enums in their
// lists, difficulty an integer 1–5, ids known to the catalogue, strings that are strings within the validator's
// lengths, dates that are dates. What does not fit is dropped. A genuine payload passes unchanged, so its signature
// still verifies; a changed one fails verification and loses the hanko, or loses the field.
// A string that carries a link, a foreign e-mail, an @handle or a phone or card number is dropped (the copy guard's
// rule, src/shared/contact.js): a genuine payload passed the Worker's guard, so it never carries one, and a crafted
// link cannot put "pay to card …" on qilich.com. A solution whose title is dropped shows the catalogue's own title.
// Pure, no DOM: node --test runs it (src/shared/sanitize.test.js) against real and hostile payloads.
// The lists come from the engine and the catalogue the page already holds (no second copy to drift).
import { NEEDS_KEYS, PHASES } from '../shared/price.js';
import { LANGS } from '../shared/catalogue.js';
import { hasContact } from '../shared/contact.js';
const STATES = ['off', 'mvp', 'full'];
const IMPACT_KEYS = [...new Set(Object.values(NEEDS_KEYS).flat())];
const IMPACT_MODELS = [...Object.keys(NEEDS_KEYS), 'none'];
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[+-]\d{2}:\d{2}|Z)$/;
const BRIEF = /^QL-\d{4}-[0-9A-F]{4}(?:·\d{1,2})?$/;
const SLUG = /^[a-z0-9_]{1,48}$/;
const VERSION = /^[\w.-]{1,40}$/;

const obj = (v) => v && typeof v === 'object' && !Array.isArray(v);
const arr = (v) => (Array.isArray(v) ? v : []);
// a string within n characters (the validator's cap plus room for its "…") and free of contacts, else '' (a
// non-string is never rendered)
const s = (v, n) => (typeof v === 'string' && [...v].length <= n + 1 && !hasContact(v) ? v : '');
const oneOf = (v, list, d) => (list.includes(v) ? v : d);
const int = (v, lo, hi) => (Number.isInteger(v) && v >= lo && v <= hi ? v : null);
const num = (v, lo, hi) => (typeof v === 'number' && Number.isFinite(v) && v >= lo && v <= hi ? v : null);

/** The meta of a payload, or null when it is not one Qilich could have written. */
export function cleanMeta(m) {
  if (!obj(m) || !BRIEF.test(m.brief_no || '') || !ISO.test(m.generated_at || '')) return null;
  const r = m.rate;
  if (!obj(r) || num(r.uzs_per_usd, 1000, 1e6) == null || !DATE.test(r.date || '')) return null;
  const rate = {};
  for (const [k, v] of Object.entries(r)) if ((typeof v === 'string' && v.length <= 40) || (typeof v === 'number' && Number.isFinite(v))) rate[k] = v;
  return {
    brief_no: m.brief_no, lang: oneOf(m.lang, LANGS, 'uz'), generated_at: m.generated_at,
    valid_until: DATE.test(m.valid_until || '') ? m.valid_until : '', catalogue_version: VERSION.test(m.catalogue_version || '') ? m.catalogue_version : '',
    rate, source: oneOf(m.source, ['model', 'fallback', 'sample'], 'model'),
  };
}

/** The pick (stage 1, as worker/validate.js finalizePick returns it), with only known ids. */
export function cleanPick(p, model, lang = 'uz') {
  if (!obj(p)) return null;
  const sol = (id) => typeof id === 'string' && model.byId.has(id);
  const ids = (v, ok, max = 12) => arr(v).filter((x) => typeof x === 'string' && ok(x)).slice(0, max);
  const isMod = (x) => !!model.modifiers[x], isInt = (x) => !!model.integrations[x];
  const h = obj(p.heard) ? p.heard : {};
  const heard = { summary: s(h.summary, 300), quotes: arr(h.quotes).filter((q) => s(q, 300)).slice(0, 4), industry: typeof h.industry === 'string' && /^[a-z_-]{1,40}$/.test(h.industry) ? h.industry : 'other', size: oneOf(h.size, ['solo', 'small', 'medium', 'large'], 'small') };
  const questions = arr(p.questions).slice(0, 3).map((q) => {
    if (!obj(q) || typeof q.id !== 'string' || !SLUG.test(q.id) || !s(q.text, 80)) return null;
    const options = arr(q.options).slice(0, 4).map((o) => {
      if (!obj(o) || typeof o.id !== 'string' || !SLUG.test(o.id) || !s(o.label, 30)) return null;
      const e = obj(o.effect) ? o.effect : {};
      return { id: o.id, label: o.label, effect: { targets: ids(e.targets, sol), size: oneOf(e.size, ['keep', 's', 'm', 'l'], 'keep'), add_modifiers: ids(e.add_modifiers, isMod), remove_modifiers: ids(e.remove_modifiers, isMod), add_integrations: ids(e.add_integrations, isInt), drop: ids(e.drop, sol) } };
    }).filter(Boolean);
    return options.length >= 2 ? { id: q.id, text: q.text, options } : null;
  }).filter(Boolean);
  const solutions = arr(p.solutions).slice(0, 4).map((x) => {
    if (!obj(x)) return null;
    const custom = x.catalogue_id === 'custom';
    if (!custom && !sol(x.catalogue_id)) return null;
    const based = ids(x.based_on, sol, 3);
    if (custom && !based.length) return null;
    const n = int(x.n, 1, 9), difficulty = int(x.difficulty, 1, 5);
    if (n == null || difficulty == null) return null;
    return {
      n, catalogue_id: x.catalogue_id, based_on: based, title: s(x.title, 80) || ((t) => t[lang] || t.en)(model.byId.get(custom ? based[0] : x.catalogue_id).title), why: s(x.why, 300),
      priority: oneOf(x.priority, ['must', 'should', 'could'], 'should'), scope: oneOf(x.scope, ['mvp', 'full'], 'mvp'), size: oneOf(x.size, ['s', 'm', 'l'], 's'),
      modifiers: ids(x.modifiers, isMod), integrations: ids(x.integrations, isInt), depends_on: ids(x.depends_on, sol), difficulty, difficulty_reason: s(x.difficulty_reason, 110),
    };
  }).filter(Boolean);
  const nr = arr(p.not_recommended).slice(0, 2).filter((x) => obj(x) && sol(x.catalogue_id) && s(x.why, 180)).map((x) => ({ catalogue_id: x.catalogue_id, why: x.why }));
  return {
    status: oneOf(p.status, ['ok', 'need_more', 'not_business'], 'ok'), heard, questions, solutions, not_recommended: nr,
    roadmap_note: s(p.roadmap_note, 180), first_step: s(p.first_step, 180), assumptions: arr(p.assumptions).map((a) => s(a, 180)).filter(Boolean).slice(0, 4),
  };
}

/** One stage-2 detail (worker/validate.js validateDetail), or null. */
export function cleanDetail(d, model) {
  if (!obj(d)) return null;
  const list = (v, n, max) => arr(v).map((x) => s(x, n)).filter(Boolean).slice(0, max);
  const imp = obj(d.impact) ? d.impact : {};
  const inputs = arr(imp.inputs).filter((i) => obj(i) && IMPACT_KEYS.includes(i.key) && num(i.value, -1e9, 1e9) != null).slice(0, 4)
    .map((i) => ({ key: i.key, label: s(i.label, 90) || i.key, value: i.value, basis: i.basis === 'from_text' ? 'from_text' : 'assumed' }));
  return {
    deliverables_mvp: list(d.deliverables_mvp, 80, 6), deliverables_full: list(d.deliverables_full, 80, 5),
    phases: PHASES.map((key) => ({ key, deliverable: s(arr(d.phases).find((p) => obj(p) && p.key === key)?.deliverable, 80) })),
    team: arr(d.team).filter((t) => obj(t) && model.pricing.roles?.[t.role] && int(t.count, 1, 3) != null).slice(0, 6).map((t) => ({ role: t.role, count: t.count })),
    stack: arr(d.stack).filter((x) => typeof x === 'string' && model.pricing.stack?.[x]).slice(0, 6),
    risks: arr(d.risks).filter((r) => obj(r) && s(r.text, 110)).slice(0, 3).map((r) => ({ text: r.text, mitigation: s(r.mitigation, 110), adds_weeks: int(r.adds_weeks, 0, 4) ?? 0 })),
    needs: list(d.needs, 110, 6),
    impact: { model: oneOf(imp.model, IMPACT_MODELS, 'none'), summary: s(imp.summary, 180), inputs },
  };
}

/** The page state that travels with a link: switches, answers, ticks, the fitter, the currency, the impact inputs. */
export function cleanState(st, pick) {
  const o = obj(st) ? st : {};
  const ok = new Set(pick.solutions.map((x) => (x.catalogue_id === 'custom' ? `custom-${x.n}` : x.catalogue_id)));
  const sel = arr(o.sel).filter((e) => Array.isArray(e) && ok.has(e[0]) && STATES.includes(e[1])).map(([id, v]) => [id, v]);
  const ans = {};
  for (const q of pick.questions) { const v = obj(o.ans) ? o.ans[q.id] : undefined; if (q.options.some((x) => x.id === v)) ans[q.id] = v; }
  const ticks = arr(o.ticks).filter((t) => typeof t === 'string' && /^[a-z0-9-]{1,48}:\d$/.test(t) && ok.has(t.split(':')[0])).slice(0, 40);
  const impact = {};
  if (obj(o.impact)) for (const [k, v] of Object.entries(o.impact)) { const [id, key] = k.split(':'); if (ok.has(id) && IMPACT_KEYS.includes(key) && num(v, 0, 1e7) != null) impact[k] = v; }
  return {
    sel, ans, ticks, impact, budget: num(o.budget, 0, 1e8) ?? 0, deadline: DATE.test(o.deadline || '') ? o.deadline : '',
    start: DATE.test(o.start || '') ? o.start : '', cur: oneOf(o.cur, ['uzs', 'usd'], ''),
  };
}

/** A whole decoded payload → { meta, pick, details, sig, src, state } or null (a link that is not an estimate). */
export function cleanPayload(p, model) {
  if (!obj(p)) return null;
  const meta = cleanMeta(p.meta);
  const pick = meta && cleanPick(p.pick, model, meta.lang);
  if (!pick) return null;
  const details = {};
  if (obj(p.details)) {
    const ok = new Set(pick.solutions.map((x) => (x.catalogue_id === 'custom' ? `custom-${x.n}` : x.catalogue_id)));
    for (const [k, v] of Object.entries(p.details)) { if (!ok.has(k)) continue; const d = cleanDetail(v, model); if (d) details[k] = d; }
  }
  return {
    v: 1, src: oneOf(p.src, ['model', 'fallback', 'sample', 'shared'], 'model'), meta, pick, details,
    sig: typeof p.sig === 'string' && /^[A-Za-z0-9_-]{22}$/.test(p.sig) ? p.sig : '', state: cleanState(p.state, pick),
  };
}
