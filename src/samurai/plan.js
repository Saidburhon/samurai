// The plan builder (SOLUTIONS-SPEC §3.3.11–3.3.12): the Gantt of blade silhouettes over real working days, the
// live totals, the presets and the budget and deadline fitter. Markup only; main.js owns the state and the events.
import { ganttBlade } from './plate.js';
import * as F from '../shared/format.js';
import { solId } from '../shared/price.js';
import { endOfWork, holidaysBetween, addDays, daysBetween } from '../shared/holidays.js';
import { h, fill, money } from './render.js';

// the Yaki plates' four hatches: clay dots (plan), heat diagonals (build), water lines (test), a hairline (launch)
const DEFS = `<defs>
  <pattern id="ph-plan" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".7" fill="#0F0E0C" opacity=".55"/></pattern>
  <pattern id="ph-build" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v4" stroke="#0F0E0C" stroke-width=".8" opacity=".55"/></pattern>
  <pattern id="ph-test" width="4" height="3" patternUnits="userSpaceOnUse"><path d="M0 1.5h4" stroke="#0F0E0C" stroke-width=".7" opacity=".55"/></pattern>
</defs>`;
const PH = ['plan', 'build', 'test', 'launch'];

export function ganttHtml(C, sols, st, width) {
  const { S, lang } = C, p = st.plan, start = st.start;
  if (!p || !sols.length) return '';
  const phone = width < 600;
  const rowH = 46, top = 58, pad = 4;
  const ends = p.tracks.map((t) => t.end[1]);
  const dlW = st.deadline ? Math.max(0, daysBetween(start, st.deadline) / 7) : 0;
  const maxW = Math.max(4, Math.ceil(Math.max(p.totals.weeks[1], ...ends, dlW) + 3));
  const X = (w) => pad + (w / maxW) * (width - 2 * pad);
  const H = top + sols.length * rowH + 40;
  const out = [DEFS];
  // the hatch legend, once
  let lx = pad;
  out.push(`<g class="leg">${PH.map((k) => { const g = `<rect x="${lx}" y="4" width="16" height="6" fill="${k === 'launch' ? 'none' : `url(#ph-${k})`}" stroke="#0F0E0C" stroke-width=".5"/><text x="${lx + 22}" y="11">${h(S.ph[k])}</text>`; lx += 30 + S.ph[k].length * 7.6; return g; }).join('')}<path class="k5" d="M${lx} 7h16"/><text x="${lx + 22}" y="11">${h(S.ph.kaizen)}</text></g>`);
  sols.forEach((s, i) => {
    const id = solId(s), state = st.sel.get(id) || 'off', y = top + i * rowH;
    const t = p.tracks.find((x) => x.id === id);
    const sc = state === 'off' ? s.scope : state;
    const a = t ? t.start[1] : 0, b = t ? t.end[1] : s.weeks[sc][1];
    out.push(`<text class="lbl" x="${X(a)}" y="${y + 10}">${h(s.title.length > (phone ? 34 : 70) ? `${s.title.slice(0, phone ? 33 : 69)}…` : s.title)}</text>`);
    out.push(ganttBlade(X(a), X(b), y + 16, state));
    if (state !== 'off') {
      // the phase strip under the blade, in the four hatches
      let x = X(a);
      const ws = s.phases[sc], tot = ws.reduce((q, ph) => q + ph.weeks[1], 0) || 1;
      for (const ph of ws) {
        const w = ((X(b) - X(a)) * ph.weeks[1]) / tot;
        out.push(ph.key === 'launch' ? `<path class="k2" d="M${x.toFixed(1)} ${y + 33}h${w.toFixed(1)}"/>` : `<rect x="${x.toFixed(1)}" y="${y + 30}" width="${Math.max(0, w - 1).toFixed(1)}" height="6" fill="url(#ph-${ph.key})"/>`);
        x += w;
      }
      out.push(`<path class="k5" d="M${X(b).toFixed(1)} ${y + 33}h${(X(b + 3) - X(b)).toFixed(1)}"/>`);
    } else if (st.struck?.has(id)) out.push(`<path class="k1 struck" d="M${X(a) - 4} ${y + 25}L${X(b) + 4} ${y + 18}"/>`);
  });
  // the axis: weeks from the start, ticks every 2 (4 past 26), month names under them, holidays as hollow ticks
  const ay = top + sols.length * rowH + 6, step = maxW > 26 ? 4 : 2;
  const ax = [`<path d="M${pad} ${ay}H${width - pad}"/>`];
  let lastM = -1;
  for (let w = 0; w <= maxW; w += step) {
    const d = addDays(start, w * 7), m = Number(d.slice(5, 7)) - 1;
    ax.push(`<path d="M${X(w).toFixed(1)} ${ay}v5"/>`);
    if (m !== lastM) { ax.push(`<text x="${X(w).toFixed(1)}" y="${ay + 18}">${h(F.MONTHS_SHORT[lang][m])}</text>`); lastM = m; }
  }
  const hol = holidaysBetween(start, addDays(start, maxW * 7), lang).map((x) => `<circle class="hol" cx="${X(daysBetween(start, x.date) / 7).toFixed(1)}" cy="${ay}" r="2.4" tabindex="0"><title>${h(`${x.name}, ${F.dateNum(x.date, lang)}`)}</title></circle>`).join('');
  const marks = [`<g class="mk"><path class="k1" d="M${X(0)} ${top - 6}V${ay}"/><text x="${X(0) + 4}" y="${top - 10}" class="lbl">${h(S.start)} ${h(F.dateNum(start, lang))}</text></g>`];
  if (st.deadline && dlW > 0) marks.push(`<g class="dl"><path class="k1" d="M${X(dlW).toFixed(1)} ${top - 6}V${ay}"/><text x="${(X(dlW) - 4).toFixed(1)}" y="${top - 10}" text-anchor="end" class="lbl">${h(S.deadline)} ${h(F.dateNum(st.deadline, lang))}</text></g>`);
  const aria = `${S.plan}: ${sols.map((s) => `${s.title}, ${S.sc[st.sel.get(solId(s)) || 'off']}`).join('; ')}`;
  // a text-only Gantt for the printout
  const table = `<table class="gantt-table"><tbody>${sols.filter((s) => (st.sel.get(solId(s)) || 'off') !== 'off').map((s) => {
    const sc = st.sel.get(solId(s)), t = p.tracks.find((x) => x.id === solId(s)), s0 = t?.start[1] || 0;
    let acc = s0;
    return s.phases[sc].map((ph, k) => { const from = acc; acc += ph.weeks[1]; return `<tr>${k ? '<td></td>' : `<th>${h(s.title)}</th>`}<td>${h(S.ph[ph.key])}</td><td>${h(F.weeks(ph.weeks, lang))}</td><td>${h(F.dateRange(endOfWork(start, Math.max(0.2, from)), endOfWork(start, acc), lang))}</td></tr>`; }).join('');
  }).join('')}</tbody></table>`;
  return `<svg class="gantt" viewBox="0 0 ${width} ${H}" width="${width}" height="${H}" role="img" aria-label="${h(aria)}">${out.join('')}<g class="axis">${ax.join('')}</g>${hol}${marks.join('')}</svg>${table}`;
}

export function totalsHtml(C, st) {
  const { S, lang } = C, t = st.plan?.totals;
  if (!t) return '';
  const [main, other] = money(C, t.usd, t.uzs);
  const launch = t.count ? F.dateRange(endOfWork(st.start, t.weeks[0]), endOfWork(st.start, t.weeks[1]), lang) : '';
  const mon = money(C, t.monthly_usd, t.monthly_uzs)[0];
  const rows = [
    [S.total, `<b>${h(main)}</b> · ${h(other)} · ${h(F.weeks(t.weeks, lang))}${launch ? ` · ${h(fill(S.launch, { d: launch }))}` : ''}`],
    [S.month, `≈ ${h(mon)}`],
  ];
  if (t.shared_saving_usd[1] > 0) rows.push([S.shared, `−${h(money(C, t.shared_saving_usd, t.shared_saving_uzs)[0])}`]);
  if (t.parallel) rows.push(['', h(S.parallel)]);
  rows.push(['', h(F.rateLine(C.rate, lang))]);
  return `<dl class="totals" aria-live="polite">${rows.map(([k, v]) => `<div><dt>${h(k)}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
}

export function planHtml(C, sols, st, width) {
  const { S } = C;
  const unitUsd = C.cur === 'usd' || C.lang === 'ja';
  const budgetVal = st.budgetUsd ? (unitUsd ? Math.round(st.budgetUsd) : Math.round((st.budgetUsd * C.rate.uzs_per_usd) / 1e6)) : '';
  return `<section class="plan" id="plan" aria-labelledby="plan-h">
    <div class="plan-top"><h2 id="plan-h">${h(S.plan)}</h2>
      <p class="presets" role="group" aria-label="${h(S.presets)}"><span>${h(S.presets)}</span>${[['lean', S.lean], ['balanced', S.balanced], ['full', S.fullAll]].map(([k, v]) => `<button type="button" data-act="preset" data-k="${k}" aria-pressed="${st.preset === k}">${h(v)}</button>`).join('')}</p></div>
    <div class="gwrap">${ganttHtml(C, sols, st, width)}</div>
    ${totalsHtml(C, st)}
    <form class="fitter" data-act="fit">
      <label>${h(S.start)}<input type="date" name="start" value="${h(st.start)}" data-act="start"></label>
      <label>${h(S.budget)} (${h(unitUsd ? 'USD' : S.budgetUnit)})<input inputmode="decimal" name="budget" value="${h(budgetVal)}"></label>
      <label>${h(S.deadline)}<input type="date" name="deadline" value="${h(st.deadline || '')}"></label>
      <span class="quick">${S.quick.map((q, i) => `<button type="button" data-act="quick" data-m="${i + 1}">${h(q)}</button>`).join('')}</span>
      <button class="btn" type="submit"><span>${h(S.fit)}</span></button>
    </form>
    <p class="fit-out" aria-live="polite">${st.fitMsg ? h(st.fitMsg) : ''}${st.fitMsg ? `<small>${h(S.fitNote)}</small>` : ''}</p>
    ${st.nextStage?.length ? `<p class="next-st mono">${h(S.next)}: ${st.nextStage.map((t) => `<s>${h(t)}</s>`).join(' · ')}</p>` : ''}
  </section>`;
}
