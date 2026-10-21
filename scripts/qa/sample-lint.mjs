// The sample lint (rv2a must-fix 3): the committed samples are what a visitor sees first, so every string the model
// wrote must be clean: no junk ending (tidy() in worker/validate.js would change it), no copy-rule hit, and "what we
// understood" a whole sentence. Run by `node scripts/samurai-samples.mjs --lint`, by the unit tests and before a
// generated sample is kept.
import { tidy } from '../../worker/validate.js';
import { BANNED } from '../../worker/copy-rules.js';

/** The model's own strings in a sample (never the visitor's quotes): what the page prints as Qilich's words. */
export function modelStrings(x) {
  const p = x.pick, out = [p.heard?.summary, p.roadmap_note, p.first_step, ...(p.assumptions || []), ...(p.not_recommended || []).map((n) => n.why)];
  for (const s of p.solutions) out.push(s.title, s.why, s.difficulty_reason);
  for (const q of p.questions || []) out.push(q.text, ...q.options.map((o) => o.label));
  for (const d of Object.values(x.details || {})) out.push(...d.deliverables_mvp, ...d.deliverables_full, ...d.phases.map((ph) => ph.deliverable), ...d.risks.flatMap((r) => [r.text, r.mitigation]), ...d.needs, d.impact?.summary, ...(d.impact?.inputs || []).map((i) => i.label));
  return out.filter((t) => typeof t === 'string' && t);
}
/** The sample lint: junk endings (tidy would change the string), a summary that is not a whole sentence, copy rules. */
export function sampleProblems(x, lang) {
  const bad = [];
  for (const t of modelStrings(x)) {
    if (tidy(t, lang) !== t) bad.push(`junk ending: …${t.slice(-30)}`);
    for (const [re, what] of BANNED) if (re.test(t)) bad.push(`${what}: ${t.slice(0, 40)}`);
  }
  if (!/[.!?。！？…]$/.test(x.pick.heard?.summary || '')) bad.push(`summary is not a sentence: …${(x.pick.heard?.summary || '').slice(-30)}`);
  return bad;
}
