// The scenes' DOM tracks (§3.3): the real text over the stage, written only when a value changes.
// Every text block of a scene is present on a set of beats. Between holds it leaves upward through its own mask over
// [k + .15, k + .45] and the incoming one rises into place over [k + .40, k + .85] (§5.6: one text grammar, no fades);
// under a freeze the outgoing block is carried by the frozen sheet, and the incoming one rises from k + .44.
// --t on each block: 0 at rest, +1 below its mask (not arrived), −1 above it (gone). The section that owns the
// nearest beat is .on (its links take clicks, §3.1); a section with any block in view is .vis.
import { BEATS, PHONE, PORT_ALIAS, SCENE_OF, SCENES } from '../core/shots.js';
import { SEQ, isFreeze } from '../core/tracks.js';
import { EASES } from '../core/eases.js';

const SECTION_BEATS = (id) => {
  if (id === 'temur') return ['temur.quote'];
  if (id === 'aloqa') return ['noto.sheath', 'noto.contact'];
  return BEATS.filter((b) => SCENE_OF(b) === id && !b.startsWith('temur.'));
};
// blocks whose beats are not their section's (no data-beat of their own)
const OWN = [['.s-mei > .mei', ['mei.hero']], ['.s-mei > .hanko', ['mei.hero']], ['.s-togi > .after', ['togi.mirror']]];
// the services list: which items are lit at each beat
const SVC = { land: { 'utsuri.ios': ['1'], 'utsuri.web': ['2'], 'utsuri.telegram': ['3'], 'utsuri.backend': ['4'], 'utsuri.ai': ['5'] }, port: { 'utsuri.ios': ['1', '2'], 'utsuri.telegram': ['3', '4'], 'utsuri.ai': ['5'] } };

export class Dom {
  constructor() {
    this.html = document.documentElement;
    this.tracks = [];
    this.sections = [...document.querySelectorAll('#story > .scene')];
    for (const sec of this.sections) {
      const all = SECTION_BEATS(sec.id);
      const kids = [];
      for (const el of sec.children) {
        if (el.matches('.plate, .words, .dial-plate')) continue;
        if (el.matches('.lines')) { kids.push(...el.children); continue; }
        kids.push(el);
      }
      for (const el of kids) {
        const own = OWN.find(([q]) => el.matches(q));
        const beats = own ? own[1] : el.dataset.beat ? el.dataset.beat.split(/\s+/) : all;
        this.add(el, beats, sec);
      }
    }
    const foot = document.getElementById('foot');
    if (foot) this.add(foot, ['bookend.steel'], null);
    this.items = [...document.querySelectorAll('.svc li')];
    // the hanko stands beside the phone number in the contact poster (cloned from the hero's; it carries no text)
    const row = document.querySelector('.contact .row');
    if (row && !row.querySelector('.hanko-c')) { const h = document.querySelector('.s-mei .hanko svg'); if (h) { const i = document.createElement('i'); i.className = 'hanko-c'; i.setAttribute('aria-hidden', 'true'); i.appendChild(h.cloneNode(true)); row.appendChild(i); } }
    this.ruler = [...document.querySelectorAll('.ruler li')];
  }
  add(el, beats, sec) {
    el.classList.add('tk');
    const idx = {
      land: new Set(beats.map((b) => BEATS.indexOf(b)).filter((i) => i >= 0)),
      port: new Set(beats.map((b) => PHONE.indexOf(PHONE.includes(b) ? b : PORT_ALIAS[b] || b)).filter((i) => i >= 0)),
    };
    this.tracks.push({ el, idx, sec, v: null });
  }
  // presence of a block on a layout's track at segment k, fraction f
  static presence(set, k, f, freeze) {
    const inA = set.has(k), inB = set.has(k + 1);
    if (inA && inB) return 0;
    if (inA) { if (freeze) return f < 0.2 ? 0 : -1; return -EASES['power2.in'](Math.min(1, Math.max(0, (f - 0.15) / 0.30))); }
    if (inB) { const a = freeze ? 0.44 : 0.40; return 1 - EASES.hone(Math.min(1, Math.max(0, (f - a) / (0.85 - a)))); }
    let min = Infinity; for (const i of set) min = Math.min(min, i);
    return min > k ? 1 : -1;
  }
  apply(d) {
    const layout = d.layout || 'land', html = this.html;
    // the intro and its frozen states read as the hero's DOM (its own CSS animations do the arrival)
    const intro = d.a === 'intro';
    // (before a freeze, while its closed sheet is up, d.pre: the outgoing text is the sheet's, as inside the freeze)
    const k = intro ? 0 : d.k, f = intro ? 0 : d.pre ? Math.max(d.f, 0.2) : d.f, freeze = !intro && isFreeze(d.tr);
    const near = intro ? 'mei.hero' : d.near;
    const vis = new Set();
    for (const t of this.tracks) {
      let v = Dom.presence(t.idx[layout], k, f, freeze);
      v = Math.round(v * 1e4) / 1e4;
      if (v !== t.v) {
        t.v = v;
        t.el.style.setProperty('--t', String(v));
        t.el.classList.toggle('now', v === 0);
        t.el.classList.toggle('out', Math.abs(v) >= 1);
      }
      if (Math.abs(v) < 1) vis.add(t.sec || t.el);
    }
    const scene = SCENE_OF(near), nearSec = near.startsWith('temur.') ? 'temur' : near.startsWith('bookend.') ? 'foot' : scene;
    for (const sec of this.sections) {
      const on = sec.id === nearSec, v = vis.has(sec);
      if (sec.classList.contains('on') !== on) sec.classList.toggle('on', on);
      if (sec.classList.contains('vis') !== v) sec.classList.toggle('vis', v);
    }
    const foot = document.getElementById('foot');
    if (foot) { foot.classList.toggle('on', nearSec === 'foot'); foot.classList.toggle('vis', vis.has(foot)); }
    // the beat's own state: data-beat for the CSS, the lit services, the ruler
    const beatAttr = d.intro ? 'mei.hero' : d.hold || near;
    if (html.dataset.beat !== beatAttr) html.dataset.beat = beatAttr;
    const lit = (SVC[layout] || SVC.land)[near] || [];
    for (const li of this.items) { const on = lit.includes(li.dataset.g); if (li.classList.contains('on') !== on) li.classList.toggle('on', on); }
    const si = SCENES.indexOf(scene);
    if (this.scene !== si) { this.scene = si; this.ruler.forEach((li, i) => li.classList.toggle('on', i === si)); }
    // how far into its scene the visitor is (the ruler's inked hairline)
    const names = SEQ[layout].names, sceneIdx = names.map((n, i) => (SCENE_OF(n) === scene ? i : -1)).filter((i) => i >= 0);
    const pos = intro ? 0 : d.pos ?? 0, lo = sceneIdx[0], hi = sceneIdx[sceneIdx.length - 1];
    const prog = hi > lo ? Math.min(1, Math.max(0, (pos - lo + 0.5) / (hi - lo + 1))) : 1;
    const li = this.ruler[si];
    if (li) { const pv = (prog * 100).toFixed(1) + '%'; if (li.style.getPropertyValue('--p') !== pv) li.style.setProperty('--p', pv); }
    window.__qilich && (window.__qilich.scene = scene);
  }
}
