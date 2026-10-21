// /samurai/ (SOLUTIONS-SPEC §3): the intake sentence, the stream, the appraiser's desk and every state of §3.4.
// The page works without this file (the poster, the sentence, the contacts). With it: a live estimate from the Worker,
// the catalogue matcher when SamurAI is unavailable, samples, shared links, the plan builder, refine, print and leads.
// Every number comes from src/shared/price.js, the same engine the Worker uses.
import '../pages/chrome.js'; // the shared chrome (the page has no contact form)
import { expand, solutionUrl } from '../shared/catalogue.js';
import { priceResult, plan as planOf, fit, preset as presetOf, applyEffect, solId, uzsRange } from '../shared/price.js';
import { match } from '../shared/match.js';
import * as F from '../shared/format.js';
import { firstMonday, snapMonday, tashkentToday, endOfWork, addDays, daysBetween } from '../shared/holidays.js';
import { streamSamurai } from './stream.js';
import { h, fill, money, SEP, byCatalogue, briefHtml, questionsHtml, sheetHtml, skeletonHtml, notNeededHtml, refineHtml, stampHtml, actionsHtml } from './render.js';
import { planHtml } from './plan.js';
// a link or the reopened last estimate is data anyone can type: only the shapes Qilich writes get through
import { cleanPayload } from './sanitize.js';
import { hamonStrip } from './plate.js';
import { encode, decode, verify } from './share.js';
import { openLead, deckleFor } from '../ui/lead.js';

const $ = (s, r = document) => r.querySelector(s);
// every " · " in the page's words is tied to the words on both sides, so a separator never starts or ends a line
const tie = (v) => (typeof v === 'string' ? v.replace(/ · /g, SEP) : Array.isArray(v) ? v.map(tie) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, tie(x)])) : v);
const cfg = JSON.parse($('#sam-config').textContent), S = tie(JSON.parse($('#sam-strings').textContent));
const lang = cfg.lang, today = tashkentToday();
const store = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } } };
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let model = null;
const dataReady = fetch(cfg.data).then((r) => r.json()).then((d) => (model = expand(d)));
let samplesP = null;
const samples = () => (samplesP ||= fetch(cfg.samples).then((r) => r.json()).catch(() => ({ list: [] })));
const C = {
  S, lang, cfg, rate: cfg.rate, cur: store.get('qilich.cur') || (lang === 'ja' ? 'usd' : 'uzs'),
  get model() { return model; },
  uzs: (u) => uzsRange(u, C.rate.uzs_per_usd),
  dates: (_s, end) => F.dateRange(endOfWork(st.start, Math.max(0.2, end[0])), endOfWork(st.start, Math.max(0.2, end[1])), lang, S.months),
};
const sam = $('#sam'), form = $('#intake'), result = $('#result'), statusEl = form.querySelector('.status'), go = form.querySelector('.go-btn'), text = $('#sam-text');
const live = document.createElement('p');
live.className = 'vh'; live.setAttribute('aria-live', 'polite');
document.body.append(live);
store.set('qilich.visits', String((Number(store.get('qilich.visits')) || 0) + 1));

// ---------------------------------------------------------------------------------------------------------------
// state
const fresh = () => ({
  meta: null, pick: null, details: {}, source: 'model', sel: new Map(), answers: {}, ticks: new Set(), open: new Set(), impact: {},
  chips: new Set(), fresh: new Set(), inked: new Set(), newIds: new Set(), text: '', intake: {}, preselected: [], done: false, partial: false,
  verified: false, sig: '', start: firstMonday(today), deadline: '', budgetUsd: 0, plan: null, sols: [], prevBig: new Map(), nextBig: new Map(),
  was: null, struck: new Set(), nextStage: [], fitMsg: '', removed: [], error: null, expired: false, repriced: false, preset: '', qnote: null, intOpen: null, briefOpen: false,
});
let st = fresh();
let abort = null;

const pickOf = (s) => ({ n: s.n, catalogue_id: s.catalogue_id, based_on: s.based_on || [], title: s.title, why: s.why, priority: s.priority, scope: s.scope, size: s.size, modifiers: s.modifiers || [], integrations: s.integrations || [], depends_on: s.depends_on || [], difficulty: s.difficulty, difficulty_reason: s.difficulty_reason || '' });
const emptyPick = (status = 'ok') => ({ status, heard: null, questions: [], solutions: [], not_recommended: [], roadmap_note: '', first_step: '', assumptions: [] });

function compute() {
  let pk = st.pick;
  for (const q of pk.questions || []) { const o = q.options.find((x) => x.id === st.answers[q.id]); if (o) pk = applyEffect(pk, o.effect).pick; }
  const res = priceResult(model, { pick: pk, details: st.details, lang, rate: C.rate, urlOf: solutionUrl });
  for (const s of res.solutions) { const id = solId(s); if (!st.sel.has(id)) st.sel.set(id, s.priority === 'could' ? 'off' : s.scope); }
  st.sols = res.solutions;
  st.plan = planOf(model, res.solutions, [...st.sel].map(([id, state]) => ({ id, state })), C.rate);
}

// ---------------------------------------------------------------------------------------------------------------
// painting the desk
const sheetsWidth = () => { const d = $('.desk', result); const w = (d?.clientWidth || Math.min(860, sam.clientWidth * 0.66)) | 0; return Math.max(280, w); };
function paint() {
  if (!st.pick || !model) return;
  compute();
  const focus = document.activeElement && result.contains(document.activeElement) ? keyOf(document.activeElement) : null;
  const width = sheetsWidth(), full = Math.max(320, result.clientWidth | 0);
  const scale = Math.max(1, ...st.sols.map((s) => s.weeks.full[1]));
  st.nextBig = new Map();
  const sheets = st.sols.map((s) => { const id = solId(s), inkIn = !reduced && st.newIds.has(id) && !st.inked.has(id); if (inkIn) st.inked.add(id); return sheetHtml(C, s, st, { scale, width, inkIn }); }).join('');
  st.prevBig = st.nextBig;
  const waiting = !st.done && st.source === 'model' && !st.planSeen;
  const nb = st.pick.status === 'not_business';
  const hasSols = st.sols.length > 0;
  if (nb) {
    // not a business: one line and the examples, nothing that looks like an estimate (no number, stamp or actions)
    // beside it the empty appraisal form stays: the desk waits for a business (no number, stamp or actions)
    result.innerHTML = `<div class="rtop"><div class="desk nb"><p class="note nb-line" id="res-h" tabindex="-1">${h(S.notBusiness)}</p><p class="examples mono">${exampleButtons()}</p><p><button class="tlink edit" type="button" data-act="edit">${h(S.edit)}</button></p></div><figure class="nb-plate" aria-hidden="true">${$('.blank-plate')?.innerHTML || ''}</figure></div>`;
    st.fresh.clear(); st.newIds.clear();
    strip(false);
    return;
  }
  const notes = [];
  // "chosen from the catalogue" heads the brief's line when there is one (render.js briefHtml), else the desk
  if (byCatalogue(st) && !st.unavailable && !st.pick.heard?.summary) notes.push(`<p class="note mono">${h(S.srcFallback)}</p>`);
  if (st.unavailable) notes.push(`<p class="note">${h(S.unavailable)}</p>`);
  if (st.error) notes.push(`<div class="broken"><img src="${h(brokenSrc())}" alt="" width="220" height="80"><div><p>${h(S.errDrop)}</p><p class="acts"><button class="tlink" type="button" data-act="retry">${h(S.retry)}</button><a href="tel:${h(cfg.phone.replace(/[^\d+]/g, ''))}">${h(cfg.phone.replace(/ /g, '\u00a0'))}</a></p></div></div>`);
  if (st.partial && st.done) notes.push(`<p class="note mono gap"><span>${h(S.partial)}</span><button class="tlink" type="button" data-act="retry">${h(S.retry)}</button></p>`);
  // the currency switch, the stamp and the actions belong to an estimate: only with at least one solution
  const cur = hasSols ? `<p class="cur" role="group" aria-label="${h(S.cur.label)}"><button type="button" data-act="cur" data-k="${lang === 'ja' ? 'usd' : 'uzs'}" aria-pressed="${C.cur === (lang === 'ja' ? 'usd' : 'uzs')}">${h(lang === 'ja' ? S.cur.usd : S.cur.uzs)}</button><i></i><button type="button" data-act="cur" data-k="${lang === 'ja' ? 'uzs' : 'usd'}" aria-pressed="${C.cur === (lang === 'ja' ? 'uzs' : 'usd')}">${h(lang === 'ja' ? S.cur.uzs : S.cur.usd)}</button></p>` : '';
  const desk = `<div class="desk">
    <div class="res-head"><h2 id="res-h" tabindex="-1">${h(S.res)}</h2><span class="no mono">${h(st.meta?.brief_no || '')}</span>${cur}</div>
    ${notes.join('')}
    <div class="res-status">${st.statusText && !st.done ? `<p class="status mono">${h(st.statusText)}</p>` : ''}</div>
    ${questionsHtml(C, st)}
    ${sheets}
    ${waiting ? skeletonHtml(C, width) : ''}
    ${notNeededHtml(C, st)}
  </div>`;
  const hasPlan = hasSols && (st.planSeen || st.done || st.source !== 'model');
  const printHead = `<div class="print-head"><b><svg aria-hidden="true"><use href="#mon"/></svg>QILICH</b><span>${h(S.printHead)}${SEP}${h(st.meta?.brief_no || '')}${SEP}${h(F.dateNum((st.meta?.generated_at || today).slice(0, 10), lang))}${SEP}${h(fill(S.valid, { n: cfg.validity || 30 }))}</span></div>`;
  // the brief and the desk share a wrapper, so the sticky brief stops where the sheets end (not over the plan)
  result.innerHTML = printHead + `<div class="rtop">${briefHtml(C, st)}${desk}</div>`
    + (hasPlan ? planHtml(C, st.sols, st, full) : '')
    + (st.done && hasSols && st.source !== 'shared' ? refineHtml(C, st) : '')
    + (hasSols && (st.done || st.source !== 'model') ? stampHtml(C, st) + actionsHtml(C) : '')
    + `<p class="print-foot">${h(cfg.phone)}${SEP}${h(cfg.email)}${SEP}qilich.com${h(location.pathname)}${SEP}${h(S.res)} ${h(st.meta?.brief_no || '')}</p>`;
  st.fresh.clear(); st.newIds.clear();
  // what draws once draws once: the quote underlines, the hanko and the strikes are static on every later repaint
  // (a currency switch, a scope switch, a resize), so nothing moves without a cause
  const marks = result.querySelectorAll('.letter mark');
  if (reduced) marks.forEach((m) => m.classList.add('on'));
  else if (!st.marked) marks.forEach((m, i) => setTimeout(() => m.classList.add('on'), 120 + i * 450));
  if (marks.length) st.marked = true;
  if (result.querySelector('.signed .hanko')) st.stamped = true;
  result.querySelectorAll('.sheet .was').forEach((el) => (st.wasDrawn ||= new Set()).add(el.closest('.sheet').dataset.id));
  if (focus) restore(focus);
  strip(hasPlan);
}
const keyOf = (el) => ({ elId: el.id, act: el.dataset.act, k: el.dataset.k, id: el.dataset.id, q: el.dataset.q, o: el.dataset.o, name: el.name, value: el.value, tag: el.tagName });
function restore(f) {
  const sel = f.elId ? `#${CSS.escape(f.elId)}` : f.k ? `[data-k="${CSS.escape(f.k)}"]` : f.q && f.o ? `[data-q="${CSS.escape(f.q)}"][data-o="${CSS.escape(f.o)}"]` : f.id && f.act === 'scope' ? `input[name="sc-${CSS.escape(f.id)}"][value="${CSS.escape(f.value)}"]` : f.name ? `[name="${CSS.escape(f.name)}"]` : f.act ? `[data-act="${CSS.escape(f.act)}"]` : null;
  const el = sel && result.querySelector(sel);
  el?.focus?.({ preventScroll: true });
}
function brokenSrc() { return document.querySelector('.p-broken img')?.getAttribute('src') || ''; }

// the phone's totals strip
let stripEl = null;
function strip(on) {
  if (!stripEl) { stripEl = document.createElement('div'); stripEl.className = 'strip'; document.body.append(stripEl); }
  const t = st.plan?.totals;
  if (!on || !t?.count) { stripEl.classList.remove('on'); document.body.classList.remove('has-strip'); return; }
  stripEl.innerHTML = `<span>${h(S.total)} <span class="nw">${h(money(C, t.usd, t.uzs)[0])}</span>${SEP}<span class="nw">${h(F.weeks(t.weeks, lang))}</span></span><a href="#plan">${h(S.plan)}</a>`;
  stripEl.classList.add('on'); document.body.classList.add('has-strip');
}

// ---------------------------------------------------------------------------------------------------------------
// the intake sentence: native selects shown as underlined mono values; the draft survives a reload
const touched = new Set();
const ownBox = form.querySelector('.own');
function syncBlank(sel) { const b = sel.closest('.blank'); b.querySelector('.val').textContent = sel.selectedOptions[0]?.textContent || ''; }
form.querySelectorAll('select').forEach((sel) => sel.addEventListener('change', () => { touched.add(sel.name); syncBlank(sel); if (sel.name === 'industry') examplesFor(sel.value); saveDraft(); }));
form.querySelector('.own-toggle').addEventListener('click', (e) => { const open = ownBox.classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', open); if (open) text.focus(); });
const count = form.querySelector('.count');
count.dataset.msg = S.tooLong;
function counter() { const n = [...text.value].length; count.querySelector('b').textContent = n; count.classList.toggle('over', n > 1500); go.disabled = n > 1500 || form.classList.contains('busy'); }
text.addEventListener('input', () => { counter(); saveDraft(); });
function saveDraft() { store.set('qilich.samurai.draft', JSON.stringify({ text: text.value, sel: Object.fromEntries([...form.querySelectorAll('select')].map((s) => [s.name, s.value])), touched: [...touched] })); }
function exampleButtons(ind) {
  const list = cfg.examplesByIndustry[ind || form.elements.industry.value] || [];
  return `<span class="lbl">${h(S.examples)}</span> ${list.map((e) => `<button type="button" class="ex" data-ex="${h(e)}">${h(e)}</button>`).join(' ')}`;
}
function examplesFor(ind) { form.querySelector('.examples').innerHTML = exampleButtons(ind); }
function setSelect(name, v) { const sel = form.elements[name]; if (sel && [...sel.options].some((o) => o.value === v)) { sel.value = v; syncBlank(sel); touched.add(name); } }

function intakeOf() {
  const all = Object.fromEntries([...form.querySelectorAll('select')].map((s) => [s.name, s.value]));
  // with their own words, the sentence counts only where they changed it; without, the sentence is their statement
  if (!text.value.trim()) return all;
  return Object.fromEntries(Object.entries(all).filter(([k]) => touched.has(k)));
}

// ---------------------------------------------------------------------------------------------------------------
// the stream
let t0 = 0, tick = 0;
function busy(on) {
  form.classList.toggle('busy', on);
  go.disabled = on;
  result.querySelectorAll('.refine button, .run-answers button').forEach((b) => (b.disabled = on));
  clearInterval(tick);
  if (on) {
    t0 = performance.now();
    const ink = form.querySelector('.ink');
    tick = setInterval(() => {
      const t = (performance.now() - t0) / 1000;
      ink.style.setProperty('--pool', (1 - Math.exp(-t / 6)).toFixed(3));
      if (reduced && !st.pick) statusEl.textContent = `${st.statusText || ''}${SEP}${Math.round(t)}\u00a0s`;
    }, 250);
  } else { statusEl.textContent = ''; result.querySelectorAll('.rf-status').forEach((el) => (el.innerHTML = '')); }
}
// the status line: in the form before a result; at the result's head and beside the refine button once one shows
// (a refine keeps the estimate it started from on screen until the new one arrives)
function status(t) {
  st.statusText = t;
  if (!sam.classList.contains('has-result')) statusEl.textContent = t;
  result.querySelectorAll('.res-status, .rf-status').forEach((el) => { el.innerHTML = t ? `<p class="status mono">${h(t)}</p>` : ''; });
}
// the form folds away when a result first shows; scroll anchoring would otherwise keep the page at the bottom
function show() { const first = !sam.classList.contains('has-result'); sam.classList.add('has-result'); result.hidden = false; if (first) window.scrollTo({ top: 0, behavior: 'auto' }); }

async function run(body, { refine = false } = {}) {
  await dataReady;
  abort?.abort();
  abort = new AbortController();
  const prev = st;
  if (refine) {
    st.was = new Map(st.sols.map((s) => { const sc = st.sel.get(solId(s)) === 'full' ? 'full' : 'mvp'; return [solId(s), { big: money(C, s.usd[sc], s.uzs[sc])[0], weeks: F.weeks(s.weeks[sc], lang) }]; }));
    st = { ...fresh(), text: body.text, intake: body.intake, preselected: body.preselected, was: st.was, inked: new Set(prev.inked), start: prev.start, deadline: prev.deadline, budgetUsd: prev.budgetUsd, prevSols: prev.sols };
  } else st = { ...fresh(), text: body.text, intake: body.intake, preselected: body.preselected };
  busy(true);
  status(refine ? S.st.refining : S.st.reading);
  let gotSolution = false;
  await streamSamurai(body, (ev, d) => {
    if (ev === 'meta') { st.meta = d; if (d.source === 'fallback') st.source = 'fallback'; C.rate = d.rate; }
    else if (ev === 'status') st.pickStatus = d.status;
    else if (ev === 'heard') { st.pick = st.pick || emptyPick(st.pickStatus); st.pick.heard = d; st.fresh.add('heard'); show(); status(S.st.choosing); paint(); if (!refine) window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); }
    else if (ev === 'question') { st.pick = st.pick || emptyPick(st.pickStatus); st.pick.questions.push(d); paint(); }
    else if (ev === 'solution') {
      st.pick = st.pick || emptyPick(st.pickStatus); show();
      gotSolution = true;
      st.pick.solutions.push(pickOf(d));
      const id = solId(d);
      if (!refine || !prev.sols?.some((s) => solId(s) === id)) st.newIds.add(id);
      st.statusText = S.st.estimating;
      paint();
      live.textContent = `${d.n}. ${d.title}, ${F.weeks(d.weeks[d.scope], lang)}, ${money(C, d.usd[d.scope], d.uzs[d.scope])[0]}`;
    } else if (ev === 'not_recommended') { /* the list is in the pick that follows (signed with it) */ }
    else if (ev === 'plan') {
      st.pick = d.pick; st.planSeen = true;
      if (d.source === 'fallback') st.source = 'fallback';
      if (!st.pick.solutions.length && st.pick.status !== 'not_business' && st.pick.status !== 'need_more') return;
      show();
      st.statusText = st.source === 'model' && st.pick.solutions.length ? S.st.details : '';
      paint();
    } else if (ev === 'detail') { st.details[d.catalogue_id === 'custom' ? `custom-${d.n}` : d.catalogue_id] = d.detail; paint(); }
    else if (ev === 'reset') { st.pick = null; st.details = {}; st.sel = new Map(); st.planSeen = false; status(S.st.reset); result.innerHTML = ''; }
    else if (ev === 'done') { st.done = true; st.sig = d.sig || ''; st.partial = !!d.partial; }
    else if (ev === 'error') {
      // a refine that fails before anything new arrived keeps the estimate it started from
      if (refine && !gotSolution) { st = prev; if (d?.code === 'rate_limited') { st.rateLimited = true; st.retryAfter = d.retry_after || 60; } else st.error = d?.code || 'upstream'; return; }
      onError(d, gotSolution, body);
    }
  }, abort.signal);
  busy(false);
  // the per-visitor limit: the message stays and the button counts down (limited() runs after the stream closes)
  if (st.rateLimited) { st.rateLimited = false; return limited(st.retryAfter || 60); }
  if (!st.pick && !st.error) onError({ code: 'network' }, false, body);
  if (st.pick) await finish(refine ? prev : null);
}

function onError(d, gotSolution, body) {
  const code = d?.code || 'upstream';
  if (code === 'rate_limited') { st.rateLimited = true; st.retryAfter = d.retry_after || 60; return; }
  if (code === 'too_long') { count.classList.add('over'); return; }
  if (gotSolution) { st.partial = true; st.done = true; return; }
  // nothing arrived: the catalogue matcher answers, with the reason
  const pk = match(model, { intake: body.intake, text: body.text, lang, preselected: body.preselected });
  st.pick = pk || emptyPick('need_more');
  st.source = 'fallback';
  st.meta = st.meta || localMeta();
  if (code === 'not_configured' || code === 'refused' || code === 'bad_input') st.unavailable = true;
  else st.error = code;
  st.done = true;
  show();
}
function localMeta() {
  const d = new Date(Date.now() + 5 * 36e5), hex = [...crypto.getRandomValues(new Uint8Array(2))].map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  return { brief_no: `QL-${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, '0')}-${hex}`, lang, generated_at: `${d.toISOString().slice(0, 19)}+05:00`, valid_until: addDays(today, cfg.validity || 30), catalogue_version: cfg.catalogueVersion, rate: C.rate, source: 'fallback' };
}
function limited(sec) {
  let left = sec;
  status(S.rateLimited);
  go.disabled = true;
  const t = setInterval(() => { left--; go.querySelector('span').textContent = left > 0 ? `${S.estimate} · ${left}` : S.estimate; if (left <= 0) { clearInterval(t); go.disabled = false; status(''); } }, 1000);
}

async function finish(prev) {
  if (prev?.sols) {
    // refine: what disappeared is listed struck; what changed shows its old value struck until the next touch
    const now = new Set(st.pick.solutions.map((s) => s.catalogue_id));
    st.removed = prev.sols.filter((s) => !now.has(s.catalogue_id)).map((s) => s.title);
  }
  if (st.sig && st.source === 'model') st.verified = await verify(signedPart(), st.sig);
  paint();
  if (st.source !== 'sample' && st.sols.length) { try { store.set('qilich.samurai.last', await encode(payload())); } catch { /* storage full */ } }
  $('#res-h')?.focus({ preventScroll: true });
  if (st.verified && navigator.vibrate && !reduced) try { navigator.vibrate(8); } catch { /* not allowed */ }
}

// ---------------------------------------------------------------------------------------------------------------
// share links, the last estimate, samples
const signedPart = () => ({ brief_no: st.meta.brief_no, lang: st.meta.lang, generated_at: st.meta.generated_at, catalogue_version: st.meta.catalogue_version, rate: st.meta.rate, pick: st.pick, details: st.details });
function payload() {
  return { v: 1, src: st.source, meta: { ...st.meta, rate: st.meta.rate }, pick: st.pick, details: st.details, sig: st.sig,
    state: { sel: [...st.sel], ans: st.answers, ticks: [...st.ticks], budget: st.budgetUsd, deadline: st.deadline, start: st.start, cur: C.cur, impact: st.impact } };
}
async function shareUrl() { return `${location.origin}${location.pathname}#r=${await encode(payload())}`; }
async function openPayload(raw, { last = false } = {}) {
  await dataReady;
  // a link is data anyone can type: only the shapes Qilich writes get through (src/samurai/sanitize.js)
  const p = cleanPayload(raw, model);
  if (!p) return false;
  st = fresh();
  // a shared catalogue-matcher estimate keeps saying so (render.js byCatalogue); the source is not part of the signature
  st.meta = p.src === 'fallback' ? { ...p.meta, source: 'fallback' } : p.meta; st.pick = p.pick; st.details = p.details; st.sig = p.sig;
  st.source = p.src === 'sample' ? 'sample' : last ? (p.src === 'shared' ? 'shared' : p.src) : 'shared';
  st.sel = new Map(p.state.sel); st.answers = p.state.ans; st.ticks = new Set(p.state.ticks);
  st.budgetUsd = p.state.budget; st.deadline = p.state.deadline; st.start = p.state.start || st.start; st.impact = p.state.impact;
  if (p.state.cur) C.cur = p.state.cur;
  C.rate = p.meta.rate;
  st.done = true;
  st.repriced = p.meta.catalogue_version !== cfg.catalogueVersion;
  // validity counts from the signed date, never from a field the link could carry on its own
  st.expired = addDays(p.meta.generated_at.slice(0, 10), cfg.validity || 30) < today;
  show();
  paint();
  if (st.sig && st.source !== 'sample') { st.verified = await verify(signedPart(), st.sig); paint(); }
  return true;
}
async function renderSample(x) {
  await dataReady;
  abort?.abort();
  st = fresh();
  st.source = 'sample'; st.meta = { ...x.meta, rate: cfg.rate }; C.rate = cfg.rate;
  st.pick = x.pick; st.details = x.details || {}; st.text = x.text; st.done = true; st.repriced = false;
  x.pick.solutions.forEach((s) => st.newIds.add(solId(s)));
  st.fresh.add('heard');
  show(); paint();
  window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
}

// ---------------------------------------------------------------------------------------------------------------
// the request and the intake events
function request(extra = {}) {
  return { v: 1, lang, intake: intakeOf(), text: text.value.trim(), preselected: pre, answers: [], refine: null, ...extra };
}
// a second request about the estimate on screen (refine, answers, retry): the business is the estimate's own, never
// the form's untouched default sentence. A reopened or shared estimate carries no text or intake: its industry
// comes from what SamurAI understood, and the earlier pick travels with a refine.
function again(extra = {}) {
  const ind = st.pick?.heard?.industry, own = st.intake && Object.keys(st.intake).length ? st.intake : ind && ind !== 'other' ? { industry: ind } : {};
  return { v: 1, lang, intake: own, text: st.text || '', preselected: st.preselected || [], answers: [], refine: null, ...extra };
}
let pre = [];
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if ([...text.value].length > 1500) { count.classList.add('over'); return; }
  run(request());
});
form.querySelector('.examples').addEventListener('click', async (e) => {
  const b = e.target.closest('.ex');
  if (!b) return;
  text.value = b.dataset.ex || b.textContent;
  ownBox.classList.add('open'); form.querySelector('.own-toggle').setAttribute('aria-expanded', 'true');
  counter(); saveDraft();
  const s = (await samples()).list.find((x) => x.text === text.value);
  if (s) renderSample(s);
});
result.addEventListener('click', async (e) => {
  const el = e.target.closest('[data-act]');
  if (!el) {
    const ex = e.target.closest('.ex');
    if (ex) { text.value = ex.dataset.ex; ownBox.classList.add('open'); counter(); const s = (await samples()).list.find((x) => x.text === text.value); if (s) renderSample(s); }
    return;
  }
  const act = el.dataset.act;
  if (act === 'edit') { sam.classList.remove('has-result'); result.hidden = true; strip(false); ownBox.classList.toggle('open', !!text.value); form.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); (text.value ? text : form.querySelector('select')).focus({ preventScroll: true }); }
  else if (act === 'more') { st.briefOpen = !st.briefOpen; el.closest('.brief').classList.toggle('open', st.briefOpen); }
  else if (act === 'cur') { C.cur = el.dataset.k; store.set('qilich.cur', C.cur); paint(); }
  else if (act === 'answer') answer(el.dataset.q, el.dataset.o);
  else if (act === 'run-answers') run(again({ answers: answersList() }));
  else if (act === 'int') { st.intOpen = st.intOpen?.k === el.dataset.k && st.intOpen?.s === el.dataset.s ? null : { k: el.dataset.k, s: el.dataset.s }; st.open.add(`${el.dataset.s}:int`); paint(); }
  else if (act === 'legend') legend();
  else if (act === 'preset') { st.sel = new Map(presetOf(st.sols, el.dataset.k).map((x) => [x.id, x.state])); st.preset = el.dataset.k; st.struck.clear(); st.fitMsg = ''; st.nextStage = []; paint(); }
  else if (act === 'quick') { const f = el.closest('form'); f.elements.deadline.value = addDays(st.start, Number(el.dataset.m) * 30); showDate(f.elements.deadline); }
  else if (act === 'chip') { const k = el.dataset.k; st.chips.has(k) ? st.chips.delete(k) : st.chips.add(k); el.setAttribute('aria-pressed', st.chips.has(k)); }
  else if (act === 'retry') run(again());
  else if (act === 'reprice') { C.rate = cfg.rate; st.meta = { ...st.meta, rate: cfg.rate }; st.expired = false; st.repriced = true; paint(); }
  else if (act === 'lead') lead();
  else if (act === 'pdf') { result.querySelectorAll('.rows details').forEach((d) => (d.open = true)); window.print(); }
  else if (['share', 'copy', 'tg', 'mail'].includes(act)) share(act);
});
result.addEventListener('toggle', (e) => {
  const d = e.target;
  if (d.tagName !== 'DETAILS') return;
  const key = `${d.closest('.sheet')?.dataset.id}:${d.dataset.row}`;
  d.open ? st.open.add(key) : st.open.delete(key);
}, true);
result.addEventListener('change', (e) => {
  const el = e.target;
  if (el.dataset.act === 'scope') { st.sel.set(el.dataset.id, el.value); st.preset = ''; st.struck.delete(el.dataset.id); paint(); }
  else if (el.dataset.act === 'tick') { el.checked ? st.ticks.add(el.dataset.k) : st.ticks.delete(el.dataset.k); }
  else if (el.dataset.act === 'impact') {
    const n = Number(String(el.value).replace(/[\s\u00a0,]/g, '').replace(/[^\d.]/g, ''));
    if (Number.isFinite(n)) { st.impact[el.dataset.k] = el.dataset.money && C.cur !== 'usd' ? n / C.rate.uzs_per_usd : n; paint(); }
  } else if (el.dataset.act === 'start') { st.start = snapMonday(el.value || st.start); paint(); }
  else if (el.type === 'date') showDate(el);
});
// the date fields show the page's own format; the native picker lies invisibly over the value and opens on a click
function showDate(el) { const v = el.closest('.dt')?.querySelector('.dv'); if (v) v.textContent = /^\d{4}-\d{2}-\d{2}$/.test(el.value) ? F.dateNum(el.value, lang) : '—'; }
result.addEventListener('click', (e) => { const d = e.target.closest?.('.dt input[type=date]'); if (d) try { d.showPicker(); } catch { /* not allowed or not supported: the native control still takes typing */ } });
// print: every row open (the A4 copy shows deliverables, risks and needs, not the closed one-line values)
let printOpen = null;
addEventListener('beforeprint', () => { printOpen = [...result.querySelectorAll('.rows details:not([open])')]; printOpen.forEach((d) => (d.open = true)); });
addEventListener('afterprint', () => { printOpen?.forEach((d) => (d.open = false)); printOpen = null; });
result.addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  if (f.dataset.act === 'fit') fitNow(f);
  else if (f.dataset.act === 'refine') {
    if (!st.chips.size && !f.elements.t.value.trim()) return;
    run(again({ answers: answersList(), refine: { chips: [...st.chips], text: f.elements.t.value.trim(), previous: st.pick, brief_no: st.meta?.brief_no } }), { refine: true });
  }
});

const answersList = () => (st.pick?.questions || []).filter((q) => st.answers[q.id]).map((q) => ({ question: q.text, answer: q.options.find((o) => o.id === st.answers[q.id])?.label || '' }));
function answer(q, o) {
  const before = st.plan?.totals;
  st.answers[q] = st.answers[q] === o ? undefined : o;
  const opt = st.pick.questions.find((x) => x.id === q)?.options.find((x) => x.id === o);
  if (st.answers[q] && opt) for (const id of opt.effect.drop || []) st.sel.set(id, 'off');
  compute();
  const after = st.plan?.totals;
  if (before && after) {
    const a = money(C, before.usd, before.uzs)[0], b = money(C, after.usd, after.uzs)[0];
    const narrows = after.usd[0] >= before.usd[0] && after.usd[1] <= before.usd[1] && after.usd[1] - after.usd[0] < before.usd[1] - before.usd[0];
    st.qnote = a !== b ? { q, from: a, to: b, narrows } : null;
    if (st.qnote) setTimeout(() => { st.qnote = null; const n = result.querySelector('.qnote'); if (n) n.remove(); }, 3000);
  }
  paint();
}
function fitNow(f) {
  const unitUsd = C.cur === 'usd' || lang === 'ja';
  const b = Number(String(f.elements.budget.value).replace(/[\s\u00a0,]/g, ''));
  st.budgetUsd = b > 0 ? (unitUsd ? b : (b * 1e6) / C.rate.uzs_per_usd) : 0;
  st.deadline = f.elements.deadline.value || '';
  st.start = snapMonday(f.elements.start.value || st.start);
  const deadlineWeeks = st.deadline ? daysBetween(st.start, st.deadline) / 7 : Infinity;
  const r = fit(model, st.sols, { budgetUsd: st.budgetUsd || Infinity, deadlineWeeks }, C.rate);
  st.sel = new Map(r.selection.map((x) => [x.id, x.state]));
  st.struck = new Set(r.dropped);
  st.nextStage = st.sols.filter((s) => r.dropped.includes(solId(s))).map((s) => s.title);
  const kept = st.sols.length - r.dropped.length;
  if (!r.fits && r.closest) { const c = st.sols.find((s) => solId(s) === r.closest.id); st.fitMsg = fill(S.fitNone, { t: c?.title || '', p: money(C, c.usd.mvp, c.uzs.mvp)[0] }); }
  else st.fitMsg = r.dropped.length ? fill(S.fitSome, { n: st.sols.length, k: kept }) : S.fitAll;
  st.preset = '';
  paint();
}

// ---------------------------------------------------------------------------------------------------------------
// the legend, sharing, the lead
function legend() {
  const dlg = $('#legend-sheet');
  dlg.innerHTML = `<button class="sheet-close" type="button" aria-label="${h(S.close)}"><i></i></button><h2>${h(S.row.diff)}</h2><ol>${S.legendNames.map((n, i) => `<li><b lang="ja">${['直刃', '湾れ', '互の目', '丁子', '乱れ'][i]}</b><span>${i + 1}/5${SEP}${h(lang === 'ja' ? S.diff[i] : `${['suguha', 'notare', 'gunome', 'chōji', 'midare'][i]}${SEP}${n}`)}</span>${hamonStrip({ difficulty: i + 1, seed: 40 + i })}</li>`).join('')}</ol><p>${h(S.legendText)}</p>`;
  deckleFor(dlg, 21);
  dlg.querySelector('.sheet-close').onclick = () => dlg.close();
  dlg.addEventListener('close', () => document.documentElement.classList.remove('legend-open', 'sheet-open'), { once: true });
  document.documentElement.classList.add('legend-open', 'sheet-open');
  dlg.showModal();
  dlg.querySelector('.sheet-close').focus();
}
async function share(kind) {
  const url = await shareUrl(), t = st.plan.totals;
  const msg = fill(S.shareText, { no: st.meta.brief_no, sum: money(C, t.usd, t.uzs)[0], weeks: F.weeks(t.weeks, lang) });
  const toast = (m) => { const el = $('.toast'); if (!el) return; el.textContent = m; el.classList.add('on'); setTimeout(() => el.classList.remove('on'), 1800); };
  if (kind === 'share' && navigator.share) { try { await navigator.share({ title: `Qilich · ${st.meta.brief_no}`, text: msg, url }); return; } catch (e) { if (e?.name === 'AbortError') return; } }
  if (kind === 'share' || kind === 'copy') { try { await navigator.clipboard.writeText(url); toast(S.copied); } catch { prompt('', url); } return; }
  if (kind === 'tg') location.href = `tg://msg_url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(msg)}`;
  if (kind === 'mail') location.href = `mailto:?subject=${encodeURIComponent(`Qilich · ${st.meta.brief_no}`)}&body=${encodeURIComponent(`${msg}\n${url}`)}`;
}
async function lead() {
  const t = st.plan.totals, on = st.sols.filter((s) => (st.sel.get(solId(s)) || 'off') !== 'off');
  const link = await shareUrl().catch(() => '');
  const brief = {
    brief_no: st.meta.brief_no, summary: st.pick.heard?.summary || '', size: st.pick.heard?.size || '', source: 'samurai',
    solutions: st.sols.map((s) => { const state = st.sel.get(solId(s)) || 'off', sc = state === 'off' ? s.scope : state; return { title: s.title, state, weeks: s.weeks[sc], uzs: s.uzs[sc] }; }),
    totals: { usd: t.usd, uzs: t.uzs, weeks: t.weeks }, budget_usd: Math.round(st.budgetUsd || 0), budget_uzs: st.budgetUsd ? Math.round(st.budgetUsd * C.rate.uzs_per_usd) : 0,
    deadline: st.deadline, answers: answersList().map((a) => ({ q: a.question, a: a.answer })), text: st.text || '', link,
  };
  const preview = [`${S.res} ${st.meta.brief_no}`, ...on.map((s) => `${s.title}${SEP}${S.sc[st.sel.get(solId(s))]}`), `${S.total}: ${money(C, t.usd, t.uzs)[0]}${SEP}${F.weeks(t.weeks, lang)}`];
  const mailText = [`${S.res} ${st.meta.brief_no}`, st.pick.heard?.summary || '', ...preview.slice(1), st.text ? `«${st.text}»` : '', link].filter(Boolean).join('\n');
  openLead({ S, lang, brief, preview, mailText, phone: cfg.phone, email: cfg.email });
}

// ---------------------------------------------------------------------------------------------------------------
// start: a shared link, the prefill, the draft, the last estimate
let resizeT = 0, lastW = innerWidth;
addEventListener('resize', () => { if (innerWidth === lastW) return; lastW = innerWidth; clearTimeout(resizeT); resizeT = setTimeout(() => { if (st.pick && !result.hidden) paint(); }, 200); });
(async () => {
  const q = new URLSearchParams(location.search);
  const draft = (() => { try { return JSON.parse(store.get('qilich.samurai.draft') || 'null'); } catch { return null; } })();
  if (draft && !q.has('q') && !q.has('industry')) {
    for (const [k, v] of Object.entries(draft.sel || {})) { const sel = form.elements[k]; if (sel && [...sel.options].some((o) => o.value === v)) { sel.value = v; syncBlank(sel); } }
    (draft.touched || []).forEach((k) => touched.add(k));
    if (draft.text) { text.value = draft.text; ownBox.classList.add('open'); }
  }
  if (q.has('industry')) setSelect('industry', q.get('industry'));
  if (q.has('q')) { text.value = q.get('q').slice(0, 1500); ownBox.classList.add('open'); }
  examplesFor(form.elements.industry.value);
  counter();
  if (q.has('solutions')) {
    await dataReady;
    pre = q.get('solutions').split(',').filter((id) => model.byId.has(id)).slice(0, 6);
    if (pre.length) { const p = form.querySelector('.pre'); p.hidden = false; p.querySelector('b').textContent = pre.map((id) => model.byId.get(id).title[lang] || id).join(', '); }
  }
  if (location.hash.startsWith('#r=')) {
    try { if (await openPayload(await decode(location.hash.slice(3)))) return; } catch { /* a broken link: the empty page */ }
  }
  if (q.has('sample')) { const s = (await samples()).list.find((x) => x.id === q.get('sample')); if (s) return renderSample(s); }
  const last = store.get('qilich.samurai.last');
  if (last) {
    try {
      const raw = await decode(last);
      await dataReady;
      const p = cleanPayload(raw, model);
      if (p && p.pick.solutions.length) {
        const el = $('.reopen');
        el.innerHTML = `<span>${h(fill(S.reopen, { no: p.meta.brief_no, date: F.dateNum(p.meta.generated_at.slice(0, 10), lang) }))}</span><button class="tlink" type="button">${h(S.open)}</button>`;
        el.classList.add('gap');
        el.hidden = false;
        el.querySelector('button').onclick = () => openPayload(raw, { last: true });
      }
    } catch { /* an old format */ }
  }
  // samples load in idle time, so a tapped example renders at once
  (window.requestIdleCallback || ((f) => setTimeout(f, 1500)))(() => samples());
})();
