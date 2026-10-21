// The catalogue as one typed model, shared by the Worker (SamurAI), the build (the /samurai/ pages) and, in its
// compact per-language form, the browser. Pure: no DOM, no Node APIs.
//   normalise(catalogue, overlay, pricing) → model      content/solutions.json wins, content/solutions-extra.json
//                                                       fills gaps, the per-group defaults come last
//   compact(model, lang) → the page's inline data       only what the price engine, the matcher and the sheets need
//   expand(compactData) → a model the price engine takes (same shape as normalise's, one language)
// Entry: { id, group, title, oneliner, industries, billing, mvp: { weeks, usd }, full: { weeks, usd }, monthly_usd,
//          difficulty 1–5, cost_tier 1–5, integrations (ids it can use), integrations_included, shares, team, stack,
//          needs, scope { mvp, full } (English working text), notes, next }   ranges are [min, max]
export const LANGS = ['uz', 'ru', 'en', 'ja'];
const R = (x) => [Number(x.min), Number(x.max)];

// FNV-1a 32-bit, hex: stable seeds (blades) and the catalogue fingerprint
export function fnv(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h >>> 0;
}

// difficulty from the size of the full version, nudged by the kind of work (hardware and vision are harder)
function difficultyOf(s) {
  const top = s.price_usd.full.max;
  let d = top <= 10000 ? 1 : top <= 25000 ? 2 : top <= 60000 ? 3 : top <= 140000 ? 4 : 5;
  if (/vision|fraud|voice|custom-device|super-app|fintech|lending|vr-/.test(s.id)) d += 1;
  return Math.min(5, Math.max(1, d));
}
const costTier = (s) => { const m = s.price_usd.mvp.max; return m <= 3000 ? 1 : m <= 8000 ? 2 : m <= 18000 ? 3 : m <= 40000 ? 4 : 5; };

export function normalise(cat, extra, pricing) {
  const alias = new Map();
  for (const [id, it] of Object.entries(extra.integrations)) for (const a of it.aliases || []) alias.set(a.toLowerCase(), id);
  const groups = {};
  for (const g of cat.groups) {
    const o = extra.groups[g.id] || {};
    groups[g.id] = {
      id: g.id, title: { ...g.title, ...(o.title || {}) }, line: g.line, shares: o.shares || [], platforms: o.platforms || [],
      team: (o.team || [['pm', 1], ['backend', 1], ['qa', 1]]).map(([role, count]) => ({ role, count })),
      stack: o.stack || [], integrations_included: o.integrations_included || [], needs: extra.needs[o.needs] || extra.needs.business,
    };
  }
  // Japanese lines from content/solutions-ja.json (passed as extra.ja_solutions) until the catalogue has its own
  const jaS = extra.ja_solutions || {};
  const withJa = (v, id, k) => (jaS[id]?.[k] && !v?.ja ? { ...v, ja: jaS[id][k] } : v);
  const solutions = cat.solutions.map((s) => {
    const o = extra.solutions[s.id] || {}, g = groups[s.group];
    const ints = [...new Set((s.integrations || []).map((n) => alias.get(String(n).toLowerCase())).filter(Boolean))];
    const included = [...new Set([...(o.integrations_included || []), ...g.integrations_included])];
    return {
      id: s.id, group: s.group, title: withJa(s.title, s.id, 'title'), oneliner: withJa(s.value, s.id, 'oneliner'), industries: s.for || [], billing: s.billing || 'project',
      mvp: { weeks: R(s.timeline_weeks.mvp), usd: R(s.price_usd.mvp) },
      full: { weeks: R(s.timeline_weeks.full), usd: R(s.price_usd.full) },
      monthly_usd: s.running_usd_month ? R(s.running_usd_month) : (o.monthly_usd || pricing.monthly_default[s.group] || [0, 0]),
      difficulty: o.difficulty || difficultyOf(s), cost_tier: costTier(s),
      integrations: [...new Set([...ints, ...included])], integrations_included: included,
      shares: o.shares || g.shares, team: o.team || g.team, stack: o.stack || g.stack, needs: o.needs || g.needs,
      scope: s.scope, notes: s.notes || null, next: s.next || [], featured: !!s.featured,
    };
  });
  const byId = new Map(solutions.map((s) => [s.id, s]));
  const industries = {};
  for (const [id, v] of Object.entries(extra.industries)) industries[id] = { id, ...v, label: cat.industries[id] || null, starter: v.starter.filter((x) => byId.has(x)) };
  const model = {
    groups, industries, catalogueIndustries: cat.industries, integrations: extra.integrations, modifiers: pricing.modifiers,
    goals: extra.goals, phase_text: extra.phase_text, pricing, solutions, byId,
  };
  // the fingerprint of everything that moves a number: a share link from another version is re-priced with a note
  const priced = solutions.map((s) => [s.id, s.mvp, s.full, s.monthly_usd, s.integrations_included, s.shares, s.difficulty]);
  const ints = Object.entries(extra.integrations).map(([k, v]) => [k, v.add_usd, v.add_weeks, v.monthly_usd]);
  model.version = `${cat.updated || cat.version || 'c'}.${fnv(JSON.stringify([priced, ints, pricing.modifiers, pricing.size_band, pricing.shared, pricing.max_mult, pricing.integration_weeks_overlap, pricing.parallel_overhead, pricing.phase_split])).toString(16).padStart(8, '0')}`;
  return model;
}

// The SamurAI choices: monthly services (SLA, a dedicated team, a fractional CTO) are not project estimates
export const pickable = (model) => model.solutions.filter((s) => s.billing !== 'monthly');

// ---- the page's data file (/assets/samurai/data-<lang>-<hash>.json): one language, numbers and display words ----
const pickLang = (o, lang) => (o ? o[lang] ?? o.en ?? o.uz : '');
export function compact(model, lang) {
  const p = model.pricing;
  return {
    v: model.version,
    lang,
    pricing: { size_band: p.size_band, max_mult: p.max_mult, integration_weeks_overlap: p.integration_weeks_overlap, custom_factor: p.custom_factor, parallel_overhead: p.parallel_overhead, shared: p.shared, phase_split: p.phase_split, round: p.round, validity_days: p.validity_days, monthly_default: p.monthly_default },
    groups: Object.fromEntries(Object.values(model.groups).map((g) => [g.id, { t: pickLang(g.title, lang), needs: g.needs[lang] || g.needs.en, team: g.team.map((x) => [x.role, x.count]), stack: g.stack }])),
    mods: Object.fromEntries(Object.entries(model.modifiers).map(([k, m]) => [k, [pickLang(m.label, lang), m.mult || 1, m.weeks_mult || 1, m.add_usd || [0, 0], m.add_weeks || [0, 0]]])),
    ints: Object.fromEntries(Object.entries(model.integrations).map(([k, m]) => [k, [m.names?.[lang] || m.name, pickLang(m.what, lang), m.add_usd, m.add_weeks, m.monthly_usd]])),
    roles: Object.fromEntries(Object.entries(p.roles).map(([k, v]) => [k, pickLang(v, lang)])),
    stack: p.stack,
    phase: model.phase_text[lang] || model.phase_text.en,
    goals: model.goals,
    // the Japanese page: its own starters (a company in Japan) and its own words; the others share the uz/ru/en words
    industries: Object.fromEntries(Object.values(model.industries).map((i) => { const w = lang === 'ja' ? i.ja_words : i.words; return [i.id, [pickLang(i.name, lang), pickLang(i.plural, lang), (lang === 'ja' && i.ja_starter) || i.starter, i.examples[lang] || i.examples.en, ...(w ? [w] : [])]]; })),
    // [id, group, title, mvp weeks lo, hi, mvp usd lo, hi, full weeks lo, hi, full usd lo, hi, monthly lo, hi, difficulty, integrations, included, shares, one-liner]
    sol: model.solutions.filter((s) => s.billing !== 'monthly').map((s) => [s.id, s.group, pickLang(s.title, lang), ...s.mvp.weeks, ...s.mvp.usd, ...s.full.weeks, ...s.full.usd, ...s.monthly_usd, s.difficulty,
      s.integrations.join(' '), s.integrations_included.join(' '), s.shares.join(' '), pickLang(s.oneliner, lang)]),
  };
}

// compact → a model with the shape the price engine and the matcher read
export function expand(d) {
  const split = (x) => (x ? x.split(' ') : []);
  const solutions = d.sol.map((r) => {
    const g = d.groups[r[1]] || {};
    return {
      id: r[0], group: r[1], title: { [d.lang]: r[2] }, oneliner: { [d.lang]: r[17] }, mvp: { weeks: [r[3], r[4]], usd: [r[5], r[6]] }, full: { weeks: [r[7], r[8]], usd: [r[9], r[10]] },
      monthly_usd: [r[11], r[12]], difficulty: r[13], integrations: split(r[14]), integrations_included: split(r[15]), shares: split(r[16]),
      team: (g.team || []).map(([role, count]) => ({ role, count })), stack: g.stack || [], needs: { [d.lang]: g.needs || [] },
    };
  });
  const modifiers = Object.fromEntries(Object.entries(d.mods).map(([k, m]) => [k, { label: { [d.lang]: m[0] }, mult: m[1], weeks_mult: m[2], add_usd: m[3], add_weeks: m[4] }]));
  const integrations = Object.fromEntries(Object.entries(d.ints).map(([k, m]) => [k, { name: m[0], what: { [d.lang]: m[1] }, add_usd: m[2], add_weeks: m[3], monthly_usd: m[4] }]));
  const groups = Object.fromEntries(Object.entries(d.groups).map(([k, g]) => [k, { id: k, title: { [d.lang]: g.t }, team: g.team.map(([role, count]) => ({ role, count })), stack: g.stack, needs: { [d.lang]: g.needs } }]));
  const industries = Object.fromEntries(Object.entries(d.industries).map(([k, v]) => [k, { id: k, name: { [d.lang]: v[0] }, plural: { [d.lang]: v[1] }, starter: v[2], examples: { [d.lang]: v[3] }, ...(v[4] ? { [d.lang === 'ja' ? 'ja_words' : 'words']: v[4] } : {}) }]));
  const pricing = { ...d.pricing, modifiers, roles: Object.fromEntries(Object.entries(d.roles).map(([k, v]) => [k, { [d.lang]: v }])), stack: d.stack };
  return { version: d.v, lang: d.lang, groups, industries, integrations, modifiers, goals: d.goals, phase_text: { [d.lang]: d.phase }, pricing, solutions, byId: new Map(solutions.map((s) => [s.id, s])) };
}

// the solution pages' URLs (SOLUTIONS-SPEC §4.1; Japanese uses the English slug)
export const CATALOGUE_BASE = { uz: '/yechimlar/', ru: '/ru/resheniya/', en: '/en/solutions/', ja: '/ja/solutions/' };
export const solutionUrl = (e, lang) => `${CATALOGUE_BASE[lang] || CATALOGUE_BASE.uz}${e.slug?.[lang === 'ja' ? 'en' : lang] || e.id}/`;
