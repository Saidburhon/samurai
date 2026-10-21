// The basket's arithmetic, loaded only when the basket holds something: SamurAI's catalogue file for this language
// (expanded into the model) and the one price engine (src/shared/price.js), so the tray's total equals plan() on
// SamurAI and the shared parts (backend, admin, auth, design) are counted once.
import { expand } from '../shared/catalogue.js';
import { enrichSolution, plan } from '../shared/price.js';
import { usd, uzs, weeks } from '../shared/format.js';

let modelP = null;
export const loadModel = (url) => (modelP ||= fetch(url).then((r) => r.json()).then(expand));

export function totals(m, items, lang, rate) {
  const sols = items.filter((x) => m.byId.has(x.id)).map((x, i) => enrichSolution(m, { n: i + 1, catalogue_id: x.id, size: 'm', scope: x.scope, priority: 'must', modifiers: [], integrations: [], depends_on: [], difficulty: m.byId.get(x.id).difficulty }, { lang, rate }));
  const p = plan(m, sols, sols.map((s) => ({ id: s.catalogue_id, state: s.scope })), rate);
  const money = (u, z) => (lang === 'ja' ? [usd(u, lang), uzs(z, lang)] : [uzs(z, lang), usd(u, lang)]);
  return {
    count: p.totals.count,
    price: money(p.totals.usd, p.totals.uzs),
    weeks: weeks(p.totals.weeks, lang),
    saving: p.totals.shared_saving_usd[1] > 0,
    lines: sols.map((s) => ({ id: s.catalogue_id, title: m.byId.get(s.catalogue_id).title[lang], scope: s.scope, price: money(s.usd[s.scope], s.uzs[s.scope])[0], weeks: weeks(s.weeks[s.scope], lang) })),
  };
}
