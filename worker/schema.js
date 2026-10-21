// The two structured-output schemas (SOLUTIONS-SPEC §2.3, §2.4), built from the catalogue once per isolate. Id lists
// are sorted, so the schema is byte-stable and its compilation cache holds. Structured outputs take no min/max or
// length limits: those live in the descriptions, and worker/validate.js enforces them. Property order is the
// order the page reveals things in.
import { pickable } from '../src/shared/catalogue.js';

const S = (description, extra = {}) => ({ type: 'string', ...(description ? { description } : {}), ...extra });
const obj = (properties, description) => ({ type: 'object', additionalProperties: false, required: Object.keys(properties), properties, ...(description ? { description } : {}) });
const arr = (items, description) => ({ type: 'array', items, ...(description ? { description } : {}) });
const en = (values, description) => ({ type: 'string', enum: values, ...(description ? { description } : {}) });

export function buildSchemas(m) {
  const SOL = pickable(m).map((s) => s.id).sort();
  const IND = [...Object.keys(m.catalogueIndustries).filter((x) => x !== 'any').sort(), 'other'];
  const MOD = Object.keys(m.modifiers).sort();
  const INT = Object.keys(m.integrations).sort();
  const STACK = Object.keys(m.pricing.stack).sort();
  // the catalogue ids are an enum only where a solution is chosen: the grammar of every other id list stays small
  // (one enum of ~150 ids in six places is "too complex for compilation"); worker/validate.js drops unknown ids
  const id = S('A catalogue id from the list.');
  const effect = obj({
    targets: arr(id, 'Catalogue ids of the chosen solutions this answer changes; empty means every chosen solution.'),
    size: en(['keep', 's', 'm', 'l']),
    add_modifiers: arr(en(MOD)),
    remove_modifiers: arr(en(MOD)),
    add_integrations: arr(en(INT)),
    drop: arr(id, 'Catalogue ids of chosen solutions this answer makes unnecessary.'),
  });
  const pick = obj({
    status: en(['ok', 'need_more', 'not_business'], 'ok: solutions follow. need_more: too little to choose well; ask questions and give at most one preliminary solution. not_business: the text is not about a business or an IT need.'),
    heard: obj({
      summary: S('One sentence in the page language: what the business is and what hurts. Use only facts the visitor gave.'),
      quotes: arr(S(), 'Up to 4 short phrases copied exactly, character for character, from the visitor\'s text.'),
      industry: en(IND),
      size: en(['solo', 'small', 'medium', 'large']),
    }),
    questions: arr(obj({
      id: S('Short snake_case id.'),
      text: S('The question in the page language, up to 70 characters.'),
      options: arr(obj({ id: S(), label: S('Up to 24 characters.'), effect }), '2 to 4 options.'),
    }), '0 to 3 questions, only when the answer changes the estimate (branches, payments, 1C, platforms, languages, existing site). Never ask what the text or the intake already says.'),
    solutions: arr(obj({
      catalogue_id: en([...SOL, 'custom']),
      based_on: arr(id, 'Only for custom: the 1 to 3 catalogue ids it is assembled from. Empty otherwise.'),
      title: S('Up to 60 characters in the page language, about this business (not the catalogue name).'),
      why: S('At most 2 sentences: why this business needs it, in the visitor\'s own terms. No numbers they did not write.'),
      priority: en(['must', 'should', 'could']),
      scope: en(['mvp', 'full'], 'Where to start. Prefer mvp.'),
      size: en(['s', 'm', 'l'], 'How big this business\'s version is within the catalogue entry.'),
      modifiers: arr(en(MOD)),
      integrations: arr(en(INT)),
      depends_on: arr(id, 'Catalogue ids of other chosen solutions whose MVP must exist first.'),
      difficulty: { type: 'integer', enum: [1, 2, 3, 4, 5] },
      difficulty_reason: S('Up to 90 characters: what makes it this hard.'),
    }), '1 to 4, most important first. The smallest set that solves what the visitor described. Empty only when status is not_business.'),
    not_recommended: arr(obj({ catalogue_id: id, why: S('One sentence.') }), '0 to 2 things the visitor might expect but does not need yet, e.g. a mobile app when a Telegram bot is enough.'),
    roadmap_note: S('One sentence on the order of work.'),
    first_step: S('One sentence: the first concrete thing to do this week.'),
    assumptions: arr(S(), '0 to 4 assumptions you made, one short sentence each.'),
  });
  const detail = obj({
    deliverables_mvp: arr(S(), '3 to 6 concrete things the owner gets in the MVP, each up to 70 characters.'),
    deliverables_full: arr(S(), '2 to 5 things the full version adds.'),
    phases: arr(obj({ key: en(['plan', 'build', 'test', 'launch']), deliverable: S('Up to 70 characters.') }), 'Exactly the four phases in order, each with one deliverable for this business.'),
    team: arr(obj({ role: en(['pm', 'designer', 'frontend', 'backend', 'mobile', 'bot', 'qa', 'devops', 'data', 'ml', 'hardware']), count: { type: 'integer', enum: [1, 2, 3] } })),
    stack: arr(en(STACK), '2 to 6.'),
    risks: arr(obj({ text: S('Up to 100 characters.'), mitigation: S('Up to 100 characters.'), adds_weeks: { type: 'integer', enum: [0, 1, 2, 3, 4], description: 'Extra weeks if the risk happens.' } }), '1 to 3 real risks for this business.'),
    needs: arr(S(), '2 to 6 things the owner must prepare: documents, accounts, content, a decision maker.'),
    impact: obj({
      model: en(['hours_saved', 'more_orders', 'fewer_no_shows', 'fewer_errors', 'none']),
      summary: S('One sentence on what improves, without numbers.'),
      inputs: arr(obj({
        key: en(['hours_per_week', 'hourly_cost_usd', 'orders_per_month', 'avg_order_usd', 'margin_pct', 'uplift_pct', 'no_shows_per_month', 'errors_per_month', 'cost_per_error_usd']),
        label: S('A short question in the page language, e.g. how many hours a week go to this by hand.'),
        value: { type: 'number' },
        basis: en(['from_text', 'assumed']),
      }), 'The inputs that model\'s formula needs. Money in USD (convert soʻm the visitor wrote at the given rate).'),
    }),
  });
  return { pick, detail, ids: { SOL, IND, MOD, INT, STACK } };
}
