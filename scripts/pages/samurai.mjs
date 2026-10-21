// The SamurAI page (SOLUTIONS-SPEC §3) in each language: /samurai/, /ru/samurai/, /en/samurai/, /ja/samurai/.
// Static HTML that is complete without JavaScript (the h1, the answer-first paragraph, the intake sentence with its
// native selects, the blank appraisal form, how the estimate is made, the contacts); the script (src/samurai/main.js)
// turns it into the appraiser's desk. Words: scripts/pages/samurai-i18n.mjs. Drawings: src/samurai/plate.js.
import { S } from './samurai-i18n.mjs';
import { blankForm } from '../../src/samurai/plate.js';
import { MONTHS, MONTHS_SHORT } from '../../src/shared/months.js';
import { esc, site, telHref, nbspPhone, abs, pathOf, LANGS } from '../site.mjs';
import { ORG_ID } from './ld.mjs';

export const SLUG = 'samurai';
const IDS = {
  branches: ['1', '2-5', '6+'], staff: ['1-5', '6-20', '21-100', '100+'],
  tools: ['paper_phone', 'excel', 'telegram_group', '1c', 'own_software', 'instagram', 'website'],
  goal: ['sales', 'control', 'less_manual', 'new_customers', 'payments'],
  budget: ['unknown', 'lt20', '20-50', '50-150', 'gt150'], budgetJa: ['unknown', 'usd_lt5k', 'usd_5_15k', 'usd_15_50k', 'usd_gt50k'],
  deadline: ['1m', '3m', 'none'],
};
// the default sentence: what most visitors would say (industry: the first market's most common case)
const DEFAULT = { industry: 'restaurants', branches: '1', staff: '6-20', tools: 'paper_phone', goal: 'sales', budget: 'unknown', deadline: 'none' };
// the blank's mark: a 6 px kissaki, the same as the rows' (src/samurai/render.js)
const CARET = '<svg class="caret" viewBox="0 0 8 6" aria-hidden="true"><path d="M1 .6h6c0 2.2-1.6 4-4.4 5L1 .6z"/></svg>';

function check(lang) {
  const keys = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? keys(v, `${p}${k}.`) : [`${p}${k}`]));
  const want = keys(S.uz), have = new Set(keys(S[lang]));
  const missing = want.filter((k) => !have.has(k));
  if (missing.length) throw new Error(`samurai-i18n: ${lang} is missing ${missing.join(', ')}`);
}

function blank(name, label, options, chosen) {
  const opts = options.map(([v, t]) => `<option value="${esc(v)}"${v === chosen ? ' selected' : ''}>${esc(t)}</option>`).join('');
  const cur = options.find(([v]) => v === chosen)?.[1] ?? options[0][1];
  return `<span class="blank" data-slot="${name}"><span class="val" aria-hidden="true">${esc(cur)}</span>${CARET}<select name="${name}" aria-label="${esc(label)}">${opts}</select></span>`;
}

/** model: src/shared/catalogue.js normalise() output. Returns what pages/chrome.mjs page() needs. */
export function renderSamurai(lang, { model, rate, files, cataloguePages = false }) {
  check(lang);
  const T = S[lang];
  const ind = Object.values(model.industries).filter((i) => i.id !== 'other').map((i) => [i.id, i.name[lang] || i.name.en]);
  ind.push(['other', model.industries.other.name[lang]]);
  const opt = (k, ids = IDS[k]) => ids.map((id, i) => [id, T.o[k][i]]);
  const slots = {
    industry: blank('industry', T.sl.industry, ind, DEFAULT.industry),
    branches: blank('branches', T.sl.branches, opt('branches'), DEFAULT.branches),
    staff: blank('staff', T.sl.staff, opt('staff'), DEFAULT.staff),
    tools: blank('tools', T.sl.tools, opt('tools'), DEFAULT.tools),
    goal: blank('goal', T.sl.goal, opt('goal'), DEFAULT.goal),
    budget: blank('budget', T.sl.budget, opt('budget', lang === 'ja' ? IDS.budgetJa : IDS.budget), 'unknown'),
    deadline: blank('deadline', T.sl.deadline, opt('deadline'), DEFAULT.deadline),
  };
  // a blank and the punctuation after it never part at a line end (no line starts with ",", ":" or "、")
  const sentence = esc(T.sentence).replace(/\{(\w+)\}([,.:;、。]?)/g, (m, k, p) => (!slots[k] ? m : p ? `<span class="nw">${slots[k]}${p}</span>` : slots[k]));
  const ex = (model.industries[DEFAULT.industry].examples[lang] || []).map((e) => `<button type="button" class="ex">${esc(e)}</button>`).join(' ');
  const phone = `<a href="${telHref(site.telephone)}">${nbspPhone(site.telephone)}</a>`, mail = `<a href="mailto:${site.email}">${site.email}</a>`;
  const path = pathOf(lang, SLUG);
  const main = `
  <div class="sam" id="sam" data-state="empty">
    <section class="sam-head" aria-labelledby="sam-h1">
      <h1 id="sam-h1">${esc(T.h1)}</h1>
      <p class="lede">${esc(T.lede)}</p>
      <form class="intake" id="intake" action="#" novalidate>
        <p class="sentence">${sentence}</p>
        <div class="own">
          <button type="button" class="own-toggle" aria-expanded="false" aria-controls="own-box">${esc(T.ownWords)}</button>
          <div class="own-box" id="own-box"><label class="vh" for="sam-text">${esc(T.textLabel)}</label><textarea id="sam-text" name="text" rows="4" placeholder="${esc(T.placeholder)}"></textarea><span class="count mono" aria-live="polite"><b>0</b> / 1500</span></div>
        </div>
        <p class="pre mono" hidden><span>${esc(T.preselected)}</span> <b></b></p>
        <p class="examples mono"><span class="lbl">${esc(T.examples)}</span> ${ex}</p>
        <div class="go">
          <button class="btn go-btn" type="submit"><span>${esc(T.estimate)}</span><svg aria-hidden="true"><use href="#kissaki"/></svg></button>
          <svg class="ink" viewBox="0 0 44 22" aria-hidden="true"><path class="stone" d="M2 15.5c0-3 8-5.6 20-5.6s20 2.6 20 5.6-8 5.3-20 5.3-20-2.3-20-5.3z"/><ellipse class="pool" cx="30" cy="15.6" rx="7.5" ry="2.2"/><path class="stick" d="M11.4 13.6l3.5-11.4 4.6 1.4-3.5 11.4z"/></svg>
          <p class="status mono" role="status" aria-live="polite"></p>
        </div>
        <p class="privacy mono">${esc(T.privacy)}</p>
        <p class="nojs">${esc(T.noJs)} ${phone} · ${mail}</p>
      </form>
      <p class="reopen mono" hidden></p>
    </section>
    <figure class="blank-plate" aria-hidden="true">${blankForm({ labels: T.blank })}${blankForm({ labels: T.blank, width: 360, height: 130, level: true })}</figure>
    <figure class="plate p-broken" aria-hidden="true">{plate:broken}</figure>
    <section class="result" id="result" aria-labelledby="res-h" hidden></section>
    <section class="how" aria-labelledby="how-h">
      <h2 id="how-h">${esc(T.how.h)}</h2>
      <dl>${T.how.rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    </section>
  </div>
  <dialog class="lead-sheet" id="lead-sheet" aria-labelledby="lead-h"></dialog>
  <dialog class="legend-sheet" id="legend-sheet" aria-label="${esc(T.row.diff)}"></dialog>
  <script type="application/json" id="sam-config">${JSON.stringify({
    lang, data: files.data, samples: files.samples, rate, cataloguePages, catalogueVersion: model.version,
    phone: site.telephone, email: site.email, validity: model.pricing.validity_days, defaults: DEFAULT,
    budgetIds: lang === 'ja' ? IDS.budgetJa : IDS.budget, examplesByIndustry: Object.fromEntries(Object.values(model.industries).map((i) => [i.id, i.examples[lang] || i.examples.en])),
  }).replace(/</g, '\\u003c')}</script>
  <script type="application/json" id="sam-strings">${JSON.stringify({ ...T, months: MONTHS[lang], monthsShort: MONTHS_SHORT[lang] }).replace(/</g, '\\u003c')}</script>`;
  const app = {
    '@type': 'WebApplication', '@id': `${abs(path)}#app`, name: 'SamurAI', url: abs(path), description: T.lede,
    applicationCategory: 'BusinessApplication', operatingSystem: 'Any', browserRequirements: 'Requires JavaScript', isAccessibleForFree: true,
    inLanguage: lang, provider: { '@id': ORG_ID },
  };
  return {
    main, title: T.title, description: T.description, crumb: T.crumb, kanji: '鑑定', gloss: T.hk,
    ldExtra: [app], mainEntity: `${abs(path)}#app`,
  };
}

export const samuraiTwins = () => Object.fromEntries(LANGS.map((l) => [l, pathOf(l, SLUG)]));
