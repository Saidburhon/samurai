// The deterministic matcher (SOLUTIONS-SPEC §2.8.8): a SamurAI-shaped pick from the catalogue alone, used when the
// model is unavailable (no key, a refusal, an error) by the Worker and by the browser. Same input, same pick.
// It returns the validated stage-1 shape (status, heard, questions, solutions, not_recommended, roadmap_note,
// first_step, assumptions), so the same price engine and the same sheets render it, labelled "Katalog boʻyicha tanlandi".
const STARTS = {
  uz: (p) => `${p} odatda shulardan boshlaydi.`,
  ru: (p) => `${p} обычно начинают с этого.`,
  en: (p) => `${p} usually start here.`,
  ja: (p) => `${p}の場合、多くはここから始めます。`,
};
const FROM_TEXT = {
  uz: 'Matningiz va katalog boʻyicha tanlandi.',
  ru: 'Подобрано по вашему тексту и каталогу.',
  en: 'Chosen from your text and the catalogue.',
  ja: 'ご入力の内容とカタログから選びました。',
};
const L = (o, lang) => (o ? o[lang] ?? o.en ?? o.uz ?? '' : '');
import { fold } from './translit.js';
export { fold };
const tokens = (s) => fold(s).split(/[^\p{L}\p{N}]+/u).filter((w) => w.length >= 3);
const stem = (w) => w.slice(0, Math.max(3, Math.min(5, w.length - 1)));

function keywordHits(m, text, lang) {
  const tw = tokens(text).map(stem);
  if (!tw.length) return [];
  const set = new Set(tw);
  return m.solutions
    .filter((s) => s.billing !== 'monthly')
    .map((s) => {
      const words = new Set([...tokens(L(s.title, lang)), ...tokens(L(s.title, 'en')), ...tokens(L(s.oneliner, lang))].map(stem));
      let score = 0;
      for (const w of words) if (set.has(w)) score++;
      return { id: s.id, score };
    })
    .filter((x) => x.score >= 2)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, 2)
    .map((x) => x.id);
}

// The industry the visitor wrote, in any language: the first of its words in the text wins (people name their business
// first: "goʻzallik saloni…", "Оптовая торговля…", "We run three pharmacies…"); on the same spot the longer word wins
// ("qurilish mollari" over "qurilish"). Words are stems matched at a word start; a trailing "=" means the whole word
// (content/solutions-extra.json industries.*.words). Japanese has no spaces: its words (ja_words) match anywhere.
const spaced = (s) => ` ${tokensAll(s).join(' ')} `;
const tokensAll = (s) => fold(s).split(/[^\p{L}\p{N}]+/u).filter(Boolean);
function industryFromText(m, text, lang) {
  if (!text) return null;
  const ja = lang === 'ja', t = ja ? text : spaced(text);
  let best = null, at = Infinity, len = 0;
  for (const ind of Object.values(m.industries)) for (const w of (ja ? ind.ja_words : ind.words) || []) {
    const k = ja ? t.indexOf(w) : t.indexOf(w.endsWith('=') ? spaced(w.slice(0, -1)) : spaced(w).trimEnd());
    if (k >= 0 && (k < at || (k === at && w.length > len))) { best = ind; at = k; len = w.length; }
  }
  return best;
}

/** intake: §2.2 ids; returns the pick (status ok) or null when the catalogue has nothing to offer. */
export function match(m, { intake = {}, text = '', lang = 'uz', preselected = [] } = {}) {
  const guessed = !m.industries[intake.industry] || intake.industry === 'other' ? industryFromText(m, text, lang) : null;
  if (guessed) intake = { ...intake, industry: guessed.id };
  const ind = m.industries[intake.industry] || m.industries.other;
  const valid = (id) => m.byId.has(id) && m.byId.get(id).billing !== 'monthly';
  const fromText = intake.industry && intake.industry !== 'other' ? [] : keywordHits(m, text, lang);
  // the Japanese page serves a company in Japan: its own starters, never Telegram first (ja_starter)
  let ids = [...new Set([...preselected.filter(valid), ...fromText, ...((lang === 'ja' && ind?.ja_starter) || ind?.starter || []).filter(valid)])];
  if (intake.tools === 'website') ids = ids.filter((id) => !['web-corporate', 'web-landing'].includes(id));
  if (intake.tools === 'instagram' && !ids.includes('ai-sales-assistant') && valid('ai-sales-assistant') && ids.length < 3) ids.push('ai-sales-assistant');
  // the goal moves the groups that serve it to the front (stable: equal weights keep the starter order)
  const w = m.goals?.[intake.goal] || {};
  const keep = new Set(preselected);
  ids = ids.map((id, i) => ({ id, i, k: keep.has(id) ? 99 : w[m.byId.get(id).group] || 0 })).sort((a, b) => b.k - a.k || a.i - b.i).map((x) => x.id).slice(0, 3);
  if (!ids.length) return null;
  const size = intake.staff === '100+' ? 'l' : intake.staff === '21-100' ? 'm' : 's';
  const multi = intake.branches === '2-5' || intake.branches === '6+';
  const solutions = ids.map((id, i) => {
    const e = m.byId.get(id);
    const mods = [];
    if (multi) mods.push('multi_branch');
    if (intake.tools === 'excel' && i === 0) mods.push('migration');
    const ints = [];
    if (intake.tools === '1c' && lang !== 'ja' && e.integrations.includes('1c')) ints.push('1c');
    if (intake.tools === 'instagram' && e.integrations.includes('instagram')) ints.push('instagram');
    if (intake.goal === 'payments') ints.push(...(lang === 'ja' ? ['visa_mc'] : ['payme', 'click']).filter((k) => e.integrations.includes(k)));
    return {
      n: i + 1, catalogue_id: id, based_on: [], title: L(e.title, lang) || L(e.title, 'en'), why: L(e.oneliner, lang) || L(e.oneliner, 'en') || '',
      priority: i === 0 ? 'must' : 'should', scope: 'mvp', size, modifiers: mods, integrations: ints.filter((k) => !e.integrations_included.includes(k)),
      depends_on: [], difficulty: e.difficulty, difficulty_reason: '',
    };
  });
  const staffSize = { '1-5': 'small', '6-20': 'small', '21-100': 'medium', '100+': 'large' }[intake.staff] || 'small';
  return {
    status: 'ok',
    heard: { summary: fromText.length ? FROM_TEXT[lang] || FROM_TEXT.en : (STARTS[lang] || STARTS.en)(L(ind?.plural, lang) || L(ind?.plural, 'en')), quotes: [], industry: m.industries[intake.industry] ? intake.industry : 'other', size: staffSize },
    questions: [], solutions, not_recommended: [], roadmap_note: '', first_step: '', assumptions: [],
  };
}
