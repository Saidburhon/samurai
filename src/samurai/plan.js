// The plan builder (SOLUTIONS-SPEC §3.3.11–3.3.12): the Gantt of blade silhouettes over real working days, the
// live totals, the presets and the budget and deadline fitter. Markup only; main.js owns the state and the events.
import { ganttBlade } from './plate.js';
import * as F from '../shared/format.js';
import { solId } from '../shared/price.js';
import { endOfWork, holidaysBetween, addDays, daysBetween } from '../shared/holidays.js';
import { h, fill, money, R, SEP } from './render.js';

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
  // a row: its label, 4 px of air, the blade (its arc rises at most 2.5 px), then the phase strip under the edge
  const rowH = 52, top = 58, pad = 4, labelY = 12, bladeY = 23, stripY = 36;
  const ends = p.tracks.map((t) => t.end[1]);
  const dlW = st.deadline ? Math.max(0, daysBetween(start, st.deadline) / 7) : 0;
  const maxW = Math.max(4, Math.ceil(Math.max(p.totals.weeks[1], ...ends, dlW) + 3));
  const X = (w) => pad + (w / maxW) * (width - 2 * pad);
  const H = top + sols.length * rowH + 40;
  const out = [DEFS];
  // the hatch legend, once; the mono face at 13 px is about 8.6 px a Latin or Cyrillic letter, 13 px a Japanese one
  const tw = (t) => [...t].reduce((a, c) => a + (c.charCodeAt(0) > 0x2e7f ? 13 : 8.6), 0);
  // items wrap to a second row when the line is full (phones): the start label sits lower, at top − 10
  let lx = pad, ly = 0;
  const item = (draw, label) => { const w = 22 + tw(label); if (lx > pad && lx + w > width - pad) { lx = pad; ly += 17; } const g = draw(lx, ly) + `<text x="${lx + 22}" y="${11 + ly}">${h(label)}</text>`; lx += w + 18; return g; };
  out.push(`<g class="leg">${PH.map((k) => item((x, y) => `<rect x="${x}" y="${4 + y}" width="16" height="6" fill="${k === 'launch' ? 'none' : `url(#ph-${k})`}" stroke="#0F0E0C" stroke-width=".5"/>`, S.ph[k])).join('')}${item((x, y) => `<path class="k5" d="M${x} ${7 + y}h16"/>`, S.ph.kaizen)}</g>`);
  sols.forEach((s, i) => {
    const id = solId(s), state = st.sel.get(id) || 'off', y = top + i * rowH;
    const t = p.tracks.find((x) => x.id === id);
    const sc = state === 'off' ? s.scope : state;
    const a = t ? t.start[1] : 0, b = t ? t.end[1] : s.weeks[sc][1];
    // the label sits above the blade, indented from the start line; one that would run off the right edge ends at
    // the edge instead
    const label = s.title.length > (phone ? 34 : 70) ? `${s.title.slice(0, phone ? 33 : 69)}…` : s.title;
    const lw = tw(label), lx0 = X(a) + 6 + lw > width - pad ? Math.max(pad + 6, width - pad - lw) : X(a) + 6;
    out.push(`<text class="lbl" x="${lx0.toFixed(1)}" y="${y + labelY}">${h(label)}</text>`);
    out.push(ganttBlade(X(a), X(b), y + bladeY, state));
    if (state !== 'off') {
      // the phase strip under the blade, in the four hatches
      let x = X(a);
      const ws = s.phases[sc], tot = ws.reduce((q, ph) => q + ph.weeks[1], 0) || 1;
      for (const ph of ws) {
        const w = ((X(b) - X(a)) * ph.weeks[1]) / tot;
        out.push(ph.key === 'launch' ? `<path class="k2" d="M${x.toFixed(1)} ${y + stripY + 3}h${w.toFixed(1)}"/>` : `<rect x="${x.toFixed(1)}" y="${y + stripY}" width="${Math.max(0, w - 1).toFixed(1)}" height="6" fill="url(#ph-${ph.key})"/>`);
        x += w;
      }
      out.push(`<path class="k5" d="M${X(b).toFixed(1)} ${y + stripY + 3}h${(X(b + 3) - X(b)).toFixed(1)}"/>`);
    } else if (st.struck?.has(id)) out.push(`<path class="k1 struck" d="M${X(a) - 4} ${y + bladeY + 9}L${X(b) + 4} ${y + bladeY + 2}"/>`);
  });
  // the axis: weeks from the start, short ticks every 2 (4 past 26); each month's name at its first day, on its own
  // longer tick; holidays as hollow marks
  const ay = top + sols.length * rowH + 6, step = maxW > 26 ? 4 : 2;
  const ax = [`<path d="M${pad} ${ay}H${width - pad}"/>`];
  for (let w = step; w <= maxW; w += step) ax.push(`<path d="M${X(w).toFixed(1)} ${ay}v4"/>`);
  const end = addDays(start, maxW * 7);
  const firsts = [];
  for (let d = `${start.slice(0, 8)}01`; d <= end; ) {
    if (d > start) firsts.push(d);
    const y0 = Number(d.slice(0, 4)), m0 = Number(d.slice(5, 7));
    d = m0 === 12 ? `${y0 + 1}-01-01` : `${y0}-${String(m0 + 1).padStart(2, '0')}-01`;
  }
  // the start's own month is named at the start line when its 1st lies before it and there is room before the next
  const marksM = [{ x: X(0), m: Number(start.slice(5, 7)) - 1, tick: false }, ...firsts.map((d) => ({ x: X(daysBetween(start, d) / 7), m: Number(d.slice(5, 7)) - 1, tick: true }))];
  let lastEnd = -Infinity;
  marksM.forEach((q, i) => {
    const name = F.MONTHS_SHORT[lang][q.m], tx = q.x + 3, tw0 = tw(name);
    if (q.tick) ax.push(`<path class="mt" d="M${q.x.toFixed(1)} ${ay}v10"/>`);
    const next = marksM[i + 1];
    if (tx < lastEnd + 6 || tx + tw0 > width - pad || (next && tx + tw0 + 6 > next.x + 3 && !q.tick)) return;
    ax.push(`<text x="${tx.toFixed(1)}" y="${ay + 20}">${h(name)}</text>`);
    lastEnd = tx + tw0;
  });
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
    [S.total, `<b>${R(main)}</b>${SEP}${R(other)}${SEP}${R(F.weeks(t.weeks, lang))}${launch ? `${SEP}${h(S.launch).replace('{d}', `<span class="nw">${h(launch)}</span>`)}` : ''}`],
    [S.month, `≈ ${R(mon)}`],
  ];
  if (t.shared_saving_usd[1] > 0) rows.push([S.shared, `−${R(money(C, t.shared_saving_usd, t.shared_saving_uzs)[0])}`]);
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
      ${dateField(S.start, 'start', st.start, C.lang, ' data-act="start"')}
      <label>${h(S.budget)} (${h(unitUsd ? 'USD' : S.budgetUnit)})<input inputmode="decimal" name="budget" value="${h(budgetVal)}"></label>
      ${dateField(S.deadline, 'deadline', st.deadline || '', C.lang)}
      <span class="quick">${S.quick.map((q, i) => `<button type="button" data-act="quick" data-m="${i + 1}">${h(q)}</button>`).join('')}</span>
      <button class="btn" type="submit"><span>${h(S.fit)}</span></button>
    </form>
    <p class="fit-out" aria-live="polite">${st.fitMsg ? R(st.fitMsg) : ''}${st.fitMsg ? `<small>${h(S.fitNote)}</small>` : ''}</p>
    ${st.nextStage?.length ? `<p class="next-st mono">${h(S.next)}: ${st.nextStage.map((t) => `<s>${h(t)}</s>`).join(SEP)}</p>` : ''}
  </section>`;
}

/**
 * A date in the page's own format (02.11.2026, 2026年11月2日; '—' when empty), with the native picker laid invisibly
 * over it: the browser's mm/dd/yyyy widget never shows, the calendar still opens on a tap or a click.
 */
export function dateField(label, name, value, lang, attrs = '') {
  const shown = /^\d{4}-\d{2}-\d{2}$/.test(value || '') ? F.dateNum(value, lang) : '—';
  return `<label class="dt">${h(label)}<span class="dv">${h(shown)}</span><input type="date" name="${h(name)}" value="${h(value || '')}"${attrs}></label>`;
}
