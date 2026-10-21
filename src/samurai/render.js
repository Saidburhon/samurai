// The result as HTML strings (SOLUTIONS-SPEC §3.3): the brief sheet, the questions, one oshigata sheet per solution
// with its ruled <dl> and its nine rows, "not needed yet", the refine line, the stamp and the actions. main.js owns
// the state and paints; this file only turns state into markup. Every model string is escaped (textContent rules).
import { bladePlate, hamonStrip, seedOf, struckBlade } from './plate.js';
import * as F from '../shared/format.js';
import { solId, payback, monthlyGain, NEEDS_KEYS } from '../shared/price.js';
import { solutionUrl } from '../shared/catalogue.js';

export const h = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const fill = (s, o) => String(s).replace(/\{(\w+)\}/g, (m, k) => (k in o ? o[k] : m));
const CARET = '<svg class="caret" viewBox="0 0 8 6" aria-hidden="true"><path d="M.6 .8h6.8L4 5.4z"/></svg>';
const KISSAKI = '<svg viewBox="0 0 30 8" aria-hidden="true"><use href="#kissaki"/></svg>';
export const money = (C, usdR, uzsR) => F.money(usdR, uzsR, C.cur, C.lang);

// the visitor's own words with each quote the model found underlined (folded match: case, spaces, okina look-alikes)
function fold(text) {
  let out = '', map = [];
  for (let i = 0; i < text.length; i++) {
    let c = text[i].toLowerCase();
    if (/[ʻʼ'‘’`]/.test(c)) c = "'";
    if (/\s/.test(c)) { if (out.endsWith(' ')) continue; c = ' '; }
    out += c; map.push(i);
  }
  return { out, map };
}
export function markQuotes(text, quotes = []) {
  const f = fold(text), spans = [];
  for (const q of quotes) {
    const k = f.out.indexOf(fold(q).out);
    if (k < 0) continue;
    const a = f.map[k], b = f.map[k + fold(q).out.length - 1] + 1;
    if (!spans.some(([x, y]) => a < y && b > x)) spans.push([a, b]);
  }
  spans.sort((x, y) => x[0] - y[0]);
  let html = '', at = 0;
  spans.forEach(([a, b], i) => { html += h(text.slice(at, a)) + `<mark style="--i:${i}">${h(text.slice(a, b))}</mark>`; at = b; });
  return html + h(text.slice(at));
}

export function briefHtml(C, st) {
  const { S } = C, heard = st.pick?.heard;
  const words = st.text ? `<span class="lbl mono">${h(S.yourText)}</span><p class="letter">${markQuotes(st.text, heard?.quotes)}</p><button class="tlink more" type="button" data-act="more">${h(S.showText)}</button>`
    : heard?.quotes?.length ? `<span class="lbl mono">${h(S.yourText)}</span><p class="letter">${heard.quotes.map((q, i) => `«<mark class="on" style="--i:${i}">${h(q)}</mark>»`).join(' · ')}</p>` : '';
  return `<aside class="brief${st.briefOpen ? ' open' : ''}" aria-label="${h(S.res)}">
    ${st.source === 'sample' ? `<p class="mono note k">${h(S.sample)}</p>` : ''}
    <p class="no mono">${h(S.res)} <b>${h(st.meta?.brief_no || '')}</b></p>
    ${words}
    ${heard?.summary ? `<span class="lbl mono">${h(S.heard)}</span><p class="heard-sum${st.fresh.has('heard') ? ' rise' : ''}">${h(heard.summary)}</p>` : ''}
    ${st.source !== 'shared' ? `<button class="tlink edit" type="button" data-act="edit">${h(S.edit)}</button>` : ''}
  </aside>`;
}

export function questionsHtml(C, st) {
  const qs = st.pick?.questions || [];
  if (!qs.length) return '';
  return `<div class="questions">${qs.map((q) => `<div class="qline" data-q="${h(q.id)}"><p>${h(q.text)}</p><div class="qopts" role="group" aria-label="${h(q.text)}">${q.options.map((o, i) => `${i ? '<i>·</i>' : ''}<button type="button" data-act="answer" data-q="${h(q.id)}" data-o="${h(o.id)}" aria-pressed="${st.answers[q.id] === o.id}">${h(o.label)}</button>`).join('')}</div>${st.qnote?.q === q.id ? `<p class="qnote mono">${h(C.S.narrow)} ${h(st.qnote.from)} ${KISSAKI} ${h(st.qnote.to)}</p>` : ''}</div>`).join('')}${st.pick.status === 'need_more' ? `<p class="run-answers"><button class="btn" type="button" data-act="run-answers"><span>${h(C.S.runAnswers)}</span>${KISSAKI}</button></p>` : ''}</div>`;
}

// the one-line value a closed row shows, and its body
function rows(C, s, st, entry) {
  const { S, lang } = C, id = solId(s), d = s.detail, waiting = !d && st.source === 'model' && !st.done;
  const state = st.sel.get(id) === 'full' || (st.sel.get(id) === 'off' && s.scope === 'full') ? 'full' : 'mvp';
  const W = (x) => F.weeks(x, lang);
  const team = d?.team || (entry?.team || []).map((t) => ({ ...t, label: C.model.pricing.roles?.[t.role]?.[lang] || t.role }));
  const stack = d?.stack || (entry?.stack || []).map((x) => ({ id: x, name: C.model.pricing.stack?.[x] || x }));
  const needs = d?.needs?.length ? d.needs : entry?.needs?.[lang] || [];
  const ints = s.integrations.map((k) => C.model.integrations[k]).filter(Boolean);
  const out = [];
  const row = (key, value, body, wait = false) => out.push(`<details data-row="${key}"${st.open.has(`${id}:${key}`) ? ' open' : ''}><summary><span class="k">${h(S.row[key])}</span><span class="v${wait ? ' wait' : ''}">${wait ? '' : value}</span>${CARET}</summary>${wait ? '' : `<div class="rbody">${body}</div>`}</details>`);
  const list = (a) => `<ul>${a.map((x) => `<li>${h(x)}</li>`).join('')}</ul>`;
  // 1 what you get
  const mvpL = d?.deliverables_mvp?.length ? d.deliverables_mvp : [entry?.oneliner?.[lang] || ''].filter(Boolean);
  row('get', d ? `${h(fill(S.sumGet, { n: d.deliverables_mvp.length }))} · MVP` : h(S.defaults), `<div class="cols2"><div><h4>${h(S.mvp)}</h4>${list(mvpL)}</div>${d?.deliverables_full?.length ? `<div><h4>${h(S.full)}</h4>${list(d.deliverables_full)}</div>` : ''}</div>`, waiting);
  // 2 phases, with real dates when the plan knows them
  const tr = st.plan?.tracks?.find((t) => t.id === id), dates = tr && st.start ? C.dates(tr.start[0] + (state === 'full' ? 0 : 0), tr.mvp_end) : '';
  const phases = s.phases[state];
  row('phases', `${['plan', 'build', 'test', 'launch'].map((k) => h(S.ph[k])).join(' · ')}${dates ? ` · ${h(fill(S.mvpDates, { d: dates }))}` : ''}`,
    `<table class="phase-t">${phases.map((p) => `<tr><td>${h(S.ph[p.key])}</td><td>${h(W(p.weeks))}</td><td>${h(p.deliverable)}</td></tr>`).join('')}<tr><td>${h(S.ph.kaizen)}</td><td>—</td><td></td></tr></table>`);
  // 3 team, 4 stack
  const teamLine = team.map((t) => `${t.label} ${t.count}`).join(' · ');
  row('team', h(teamLine), list(team.map((t) => `${t.label} × ${t.count}`)), waiting);
  row('stack', h(stack.map((x) => x.name).join(' · ')), `<p class="chips">${stack.map((x) => `<span>${h(x.name)}</span>`).join('')}</p>`, waiting);
  // 5 integrations: a tap tells what each does and what it adds
  row('int', ints.length ? h(ints.map((x) => x.name).join(' · ')) : '—', ints.length ? `<p class="chips">${s.integrations.map((k) => `<button type="button" data-act="int" data-k="${h(k)}" data-s="${h(id)}">${h(C.model.integrations[k]?.name || k)}</button>`).join('')}</p>${st.intOpen?.s === id ? `<p class="chip-what mono">${h(C.model.integrations[st.intOpen.k]?.what?.[lang] || '')} · +${h(W(C.model.integrations[st.intOpen.k]?.add_weeks.map((w) => w * 0.5) || [0, 0]))}</p>` : ''}` : `<p>—</p>`);
  // 6 risks
  const risks = d?.risks || [];
  const worst = risks.reduce((a, r) => Math.max(a, r.adds_weeks), 0);
  row('risks', risks.length ? h(fill(S.sumRisks, { n: risks.length, w: W([worst, worst]) })) : h(S.noRisks), risks.length ? risks.map((r) => `<div class="risk"><p>${h(r.text)}</p><p class="k">${h(r.mitigation)}</p>${r.adds_weeks ? `<span class="flag">+${h(W([r.adds_weeks, r.adds_weeks]))} · +${h(money(C, r.adds_usd, C.uzs(r.adds_usd))[0])}</span>` : ''}</div>`).join('') : `<p>${h(S.noRisks)}</p>`, waiting);
  // 7 needed from you: ticks strike the item and travel in the share link
  row('needs', h(`${fill(S.sumNeeds, { n: needs.length })} · ${needs[0] || ''}`), `<div class="needs">${needs.map((x, i) => `<label><input type="checkbox" data-act="tick" data-k="${h(`${id}:${i}`)}"${st.ticks.has(`${id}:${i}`) ? ' checked' : ''}><span class="t">${h(x)}</span></label>`).join('')}</div>`, waiting);
  // 8 impact: the formula as a sentence with editable numbers
  const imp = d?.impact;
  let impSum = h(S.impactNone), impBody = `<p>${h(S.impactNone)}${imp?.summary ? `. ${h(imp.summary)}` : ''}</p>`;
  if (imp && imp.model !== 'none' && NEEDS_KEYS[imp.model]) {
    const inputs = imp.inputs.map((i) => ({ ...i, value: st.impact[`${id}:${i.key}`] ?? i.value }));
    const price = s.usd[state];
    const pb = payback(imp.model, inputs, price, s.monthly_usd), gain = monthlyGain(imp.model, inputs) || 0;
    impSum = pb ? h(fill(S.sumImpact, { m: F.months(pb, lang) })) : h(S.impactNa);
    const money1 = (u) => (C.cur === 'usd' ? u : Math.round(u * C.rate.uzs_per_usd / 1000) * 1000);
    impBody = `<p>${h(imp.summary)}</p><p class="formula">${inputs.map((i) => {
      const isMoney = i.unit === 'usd' || i.unit === 'usd_per_hour';
      const v = isMoney ? money1(i.value) : i.value;
      return `<label>${h(i.label)} <input inputmode="decimal" class="${i.basis === 'assumed' ? 'assumed' : ''}" data-act="impact" data-k="${h(`${id}:${i.key}`)}" data-money="${isMoney ? 1 : ''}" value="${h(F.int(v, lang === 'ja' ? 'en' : lang).replace(/\u00a0/g, ' '))}" aria-label="${h(i.label)}"><span class="tag">${isMoney ? h(C.cur === 'usd' ? '$' : S.cur.uzs) : ''} ${h(i.basis === 'assumed' ? S.assumed : S.fromText)}</span></label>`;
    }).join(' · ')}</p><p class="res">${h(S.gain)} ≈ ${h(money(C, [gain, gain], C.uzs([gain, gain]))[0])} − ${h(S.running)} → ${pb ? h(fill(S.sumImpact, { m: F.months(pb, lang) })) : h(S.impactNa)}</p>`;
  }
  row('impact', impSum, impBody, waiting);
  // 9 the price breakdown: one ruled line split into proportional segments, labelled under it
  const lines = s.price_lines[state];
  const tot = lines.reduce((a, l) => a + l.usd[1], 0) || 1;
  row('breakdown', lines.length > 1 ? h(fill(S.sumBreak, { n: lines.length - 1 })) : h(S.sumBase), `<div class="bar" aria-hidden="true">${lines.map((l) => `<span style="flex:${(l.usd[1] / tot).toFixed(3)}"></span>`).join('')}</div><ul class="bar-l">${lines.map((l) => `<li><span>${h(l.label)}</span><b>${h(money(C, l.usd.map(Math.round), C.uzs(l.usd))[0])}</b></li>`).join('')}</ul>`);
  return out.join('');
}

/** One solution sheet. scale: the longest full.max of the result (one shared weeks scale). */
export function sheetHtml(C, s, st, { scale, width, inkIn }) {
  const { S, lang } = C, id = solId(s), state = st.sel.get(id) || 'off';
  const sc = state === 'off' ? s.scope : state;
  const entry = C.model.byId.get(s.catalogue_id === 'custom' ? s.based_on[0] : s.catalogue_id);
  const cat = s.catalogue_id === 'custom'
    ? `<span>${h(S.basedOn)} ${h(s.based_on.map((x) => C.model.byId.get(x)?.title?.[lang] || x).join(', '))}</span>`
    : `<span>${h(lang === 'ja' ? (C.model.groups[entry?.group]?.title?.[lang] || '') : (entry?.title?.[lang] || ''))}</span>${C.cfg.cataloguePages && entry ? `<a href="${h(solutionUrl(entry, lang))}">${h(S.catalogue)}</a>` : ''}`;
  const W = (x) => F.weeks(x, lang);
  const plate = bladePlate({ seed: seedOf(s.catalogue_id), weeks: s.weeks, state, scaleWeeks: scale, width, difficulty: s.difficulty, dots: width < 500 ? 500 : 900,
    labels: { mvp: `${S.mvp} ${W(s.weeks.mvp)}`, full: `${S.full} ${W(s.weeks.full)}`, tick: 'MVP', aria: `${S.mvp} ${W(s.weeks.mvp)}, ${S.full} ${W(s.weeks.full)}` } }).svg;
  const [big, small] = money(C, s.usd[sc], s.uzs[sc]);
  const other = sc === 'mvp' ? 'full' : 'mvp';
  const prevBig = st.prevBig?.get(id);
  const bigHtml = prevBig && prevBig !== big && !inkIn ? diffDigits(prevBig, big) : h(big);
  st.nextBig?.set(id, big);
  const was = st.was?.get(id);
  const mon = money(C, s.monthly_usd, s.monthly_uzs);
  const label = `${S.diff[s.difficulty - 1]}`;
  return `<article class="sheet${inkIn ? ' ink-in' : ''}${state === 'off' ? ' ghost' : ''}" data-id="${h(id)}" data-state="${state}" aria-labelledby="t-${h(id)}">
    <p class="sh-top"><b>${h(S.pr[s.priority])}</b>${cat}</p>
    <h3 id="t-${h(id)}">${h(s.title)}</h3>
    ${plate}
    <dl class="sfacts">
      <div><dt>${h(S.row.price)}</dt><dd>${was?.big && was.big !== big ? `<span class="was mono-v">${h(was.big)}</span>` : ''}<span class="big">${bigHtml}</span><span class="small">${h(small)} · ${h(sc === 'mvp' ? S.mvp : S.full)}</span><span class="mid">${h(S[other])}: ${h(money(C, s.usd[other], s.uzs[other])[0])}</span></dd></div>
      <div><dt>${h(S.row.time)}</dt><dd class="mono-v">${was?.weeks && was.weeks !== W(s.weeks[sc]) ? `<span class="was">${h(was.weeks)}</span>` : ''}${h(S.mvp)} ${h(W(s.weeks.mvp))} · ${h(S.full)} ${h(W(s.weeks.full))}</dd></div>
      <div><dt>${h(S.row.month)}</dt><dd class="mono-v">≈ ${h(mon[0])}</dd></div>
      <div><dt><button type="button" data-act="legend">${h(S.row.diff)}</button></dt><dd class="diffv">${hamonStrip({ difficulty: s.difficulty, seed: seedOf(s.catalogue_id) + 5, label: `${S.row.diff} ${s.difficulty}/5, ${label}` })}<span class="mono-v">${s.difficulty}/5 · ${h(label)}</span>${s.difficulty_reason ? `<span>${h(s.difficulty_reason)}</span>` : ''}</dd></div>
      <div><dt>${h(S.row.why)}</dt><dd class="why">${h(s.why)}</dd></div>
    </dl>
    <fieldset class="scope"><legend>${h(S.sc.legend)}</legend>${['off', 'mvp', 'full'].map((v) => `<label class="${st.struck?.has(id) && v === 'off' ? 'struck' : ''}"><input type="radio" name="sc-${h(id)}" value="${v}" data-act="scope" data-id="${h(id)}"${state === v ? ' checked' : ''}><span>${h(S.sc[v])}</span></label>`).join('')}</fieldset>
    <div class="rows">${rows(C, s, st, entry)}</div>
  </article>`;
}
// only the characters that changed rise (T40)
function diffDigits(a, b) {
  let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++;
  let j = 0; while (j < a.length - i && j < b.length - i && a[a.length - 1 - j] === b[b.length - 1 - j]) j++;
  return h(b.slice(0, i)) + [...b.slice(i, b.length - j)].map((c) => `<span class="dg">${h(c)}</span>`).join('') + h(b.slice(b.length - j));
}

export function skeletonHtml(C, width) {
  return `<article class="sheet ghost" aria-hidden="true"><p class="sh-top">&nbsp;</p>${bladePlate({ seed: 3, weeks: { mvp: [1, 1], full: [1, 1] }, state: 'off', scaleWeeks: 3, width, difficulty: 1, labels: {} }).svg}<div class="rows">${['get', 'phases', 'team'].map((k) => `<details><summary><span class="k">${h(C.S.row[k])}</span><span class="v wait"></span></summary></details>`).join('')}</div></article>`;
}

export function notNeededHtml(C, st) {
  const nr = st.nr || [];
  if (!nr.length) return '';
  const { S, lang } = C;
  return `<section class="nr" aria-labelledby="nr-h"><h3 id="nr-h">${h(S.nr)}</h3><ul>${nr.map((x) => {
    const e = C.model.byId.get(x.catalogue_id);
    const t = x.title || e?.title?.[lang] || x.catalogue_id;
    return `<li>${struckBlade(seedOf(x.catalogue_id))}<div><p class="t">${C.cfg.cataloguePages && e ? `<a href="${h(solutionUrl(e, lang))}">${h(t)}</a>` : h(t)}</p><p class="w">${h(x.why)}</p></div></li>`;
  }).join('')}</ul></section>`;
}

export function refineHtml(C, st) {
  const { S } = C;
  return `<section class="refine" aria-labelledby="rf-h"><h2 id="rf-h">${h(S.refine)}</h2><p class="chips">${Object.entries(S.chips).map(([k, v]) => `<button type="button" data-act="chip" data-k="${k}" aria-pressed="${st.chips.has(k)}">${h(v)}</button>`).join('')}</p>
    <form data-act="refine"><label class="vh" for="rf-t">${h(S.refineText)}</label><input id="rf-t" name="t" maxlength="200" placeholder="${h(S.refineText)}"><button class="btn" type="submit"><span>${h(S.refineRun)}</span>${KISSAKI}</button></form>
    ${st.removed?.length ? `<p class="removed mono">${h(S.removed)}: ${st.removed.map((t) => `<s>${h(t)}</s>`).join('')}</p>` : ''}</section>`;
}

export function stampHtml(C, st) {
  const { S, lang } = C, m = st.meta;
  const date = F.dateNum(m.generated_at.slice(0, 10), lang);
  const sig = st.source === 'sample' ? S.sampleStamp : st.verified ? S.signed : S.unsigned;
  return `<div class="stamp${st.verified && st.source !== 'sample' ? ' signed' : ''}">
    <div><p>${h(fill(S.stampNo, { no: m.brief_no, date }))}</p><p>${h(fill(S.valid, { n: C.cfg.validity || 30 }))}</p><p>${h(F.rateLine(C.rate, lang))}</p>
    ${st.expired ? `<p>${h(S.expired)} · <button class="tlink" type="button" data-act="reprice">${h(S.reprice)}</button></p>` : ''}${st.repriced ? `<p>${h(S.repriced)}</p>` : ''}</div>
    <p class="sig">${h(sig)}<i class="hanko" aria-hidden="true"><svg viewBox="0 0 32 32"><rect x="1" y="1" width="30" height="30" rx="1.2"/><use href="#mon" x="5" y="5" width="22" height="22" class="m"/></svg></i></p>
  </div>`;
}

export function actionsHtml(C) {
  const { S } = C, tel = C.cfg.phone.replace(/[^\d+]/g, '');
  return `<div class="actions">
    <button class="btn solid" type="button" data-act="lead"><span>${h(S.lead)}</span>${KISSAKI}</button>
    <button class="btn" type="button" data-act="share"><span>${h(S.share)}</span></button>
    <button class="tlink" type="button" data-act="copy">${h(S.copy)}</button>
    <button class="tlink" type="button" data-act="tg">${h(S.tg)}</button>
    <button class="tlink" type="button" data-act="mail">${h(S.mail)}</button>
    <button class="tlink" type="button" data-act="pdf">${h(S.pdf)}</button>
    <a href="tel:${h(tel)}">${h(C.cfg.phone.replace(/ /g, '\u00a0'))}</a> <a href="mailto:${h(C.cfg.email)}" data-act="mailto">${h(C.cfg.email)}</a>
  </div>`;
}
