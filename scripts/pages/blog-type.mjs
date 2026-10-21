// The blog's typesetting pass (B2c review): run on a post's or an index's HTML before the page chrome wraps it, and on
// the plain strings (titles, descriptions) that also reach <title>, JSON-LD and RSS. Text nodes only: tags,
// attributes, <code>, <pre>, <svg>, <script> and <style> are left as they are.
//   every language  a typed arrow (→, and any U+2190–21FF) is never printed: " → " becomes the drawn mark (the
//                   kissaki of the SamurAI button, an <svg> named in the page's language), bound to its neighbours
//                   with no-break spaces so it neither starts nor ends a line
//   en              straight quotes become curly: "x" → “x”, it's → it’s, 'x' → ‘x’ (a quote's side is read across
//                   inline tags: <strong>"x"</strong>)
//   ru              a one- or two-letter word (в, к, с, у, о, и, а, я, на, по, за, из, от, до, не, ни, но, …) is bound
//                   to the next word with U+00A0, so no line ends on «в» or «на»
const NBSP = ' ';
const ARROW = /[←-⇿]/u;
const TO = { uz: 'keyin', ru: 'затем', en: 'then', ja: 'から' };
const mark = (lang) => `<svg class="to" role="img" aria-label="${TO[lang] || TO.en}" viewBox="0 0 30 8" focusable="false"><use href="#kissaki"/></svg>`;

const RU_SHORT = /(^|[\s(«„"—– ])((?:[вкусоияаВКУСОИЯА])|(?:на|по|за|из|от|до|не|ни|но|об|во|ко|со|же|ли|бы|из|то|На|По|За|Из|От|До|Не|Ни|Но|Об|Во|Ко|Со|То))[ \t\n]+(?=[^\s<])/gu;
function ruText(s) {
  // twice: «и в разы» binds both short words
  return s.replace(RU_SHORT, `$1$2${NBSP}`).replace(RU_SHORT, `$1$2${NBSP}`);
}

// prev: the character before this text (across inline tags), so a quote knows whether it opens or closes
function enText(s, prev) {
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    const before = i ? s[i - 1] : prev;
    const after = s[i + 1] || '';
    const opens = !before || /[\s([{—– -]/u.test(before) || before === '“' || before === '‘';
    if (c === '"') out += opens ? '“' : '”';
    else if (c === "'") {
      if (/[\p{L}\p{N}]/u.test(before || '') && /[\p{L}]/u.test(after)) out += '’'; // it's, don't, Qilich's
      else if (opens && /\d/u.test(after)) out += '’'; // '90s
      else if (opens && !/\s/u.test(after)) out += '‘';
      else out += '’';
    } else out += c;
  }
  return out;
}

export function typeText(s, lang) {
  let t = String(s);
  if (lang === 'en') t = enText(t, '');
  if (lang === 'ru') t = ruText(t);
  return t;
}

const SKIP = /^<(code|pre|svg|script|style|textarea)\b/i;
const BLOCK = /^<\/?(p|li|h[1-6]|td|th|dd|dt|blockquote|div|section|article|header|aside|nav|ul|ol|table|tr|br)\b/i;

export function typeset(html, lang) {
  const parts = String(html).split(/(<[^>]+>)/g);
  let skip = null, depth = 0, prev = '';
  for (let k = 0; k < parts.length; k++) {
    const p = parts[k];
    if (!p) continue;
    if (p[0] === '<') {
      if (skip) {
        if (new RegExp(`^<${skip}\\b`, 'i').test(p) && !p.endsWith('/>')) depth++;
        else if (new RegExp(`^</${skip}\\s*>`, 'i').test(p)) { depth--; if (!depth) skip = null; }
        continue;
      }
      const m = SKIP.exec(p);
      if (m && !p.endsWith('/>')) { skip = m[1].toLowerCase(); depth = 1; continue; }
      if (BLOCK.test(p)) prev = '';
      continue;
    }
    if (skip) continue;
    let t = p;
    // the arrow: entity-free text, so the glyph is literal here
    if (ARROW.test(t)) t = t.replace(/[ \t\n ]*[←-⇿][ \t\n ]*/gu, (a) => `${/^\s/u.test(a) ? NBSP : ''}${mark(lang)}${/\s$/u.test(a) ? NBSP : ''}`);
    if (lang === 'en') t = t.split(/(<svg[^>]*>.*?<\/svg>)/u).map((x) => (x.startsWith('<svg') ? x : enText(x.replace(/&quot;/g, '"').replace(/&#0?39;/g, "'"), prev))).join('');
    if (lang === 'ru') t = ruText(t);
    parts[k] = t;
    const last = t.replace(/<svg[^>]*>.*?<\/svg>$/u, '→').replace(/&[a-z#0-9]+;$/i, ' ').slice(-1);
    if (last) prev = last;
  }
  return parts.join('');
}

export const ARROWS = ARROW;
