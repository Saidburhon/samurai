// Japanese line breaking for the generated pages: a <wbr> between phrases (文節), so that with word-break: keep-all
// (src/styles/pages.css) a line breaks only between phrases, in every browser (Safari has no word-break: auto-phrase,
// and Chrome's still splits 取り／扱い or まと／めます in a narrow column). This is the markup BudouX writes, made
// here from the words Intl.Segmenter (ICU's Japanese dictionary) finds:
//   - a phrase is a content word with the hiragana that follow it (particles, okurigana, endings): 書面に／まとめます。
//   - kanji, katakana and Latin words that follow each other stay one compound (通信事業者), except that a compound of
//     six characters or more may break where kanji and katakana meet before a word of two or more characters:
//     オフショア開発／パートナー (never パート／ナー), カリフォルニア州消費者／プライバシー法 (never カリフォルニア／州);
//     a name in Latin letters keeps its Japanese part (Googleアナリティクス4)
//   - a phrase ends after 、。・ and the like; after a closing bracket the particle stays with it (「…」に／基づき);
//     an opening bracket starts a phrase
//   - the honorific お／ご starts the phrase of the word it belongs to: ／お問い合わせ, ／ご連絡ください
// A phrase wider than the line still breaks (overflow-wrap: break-word on the Japanese body).
// Only text inside <main> is touched; tags, attributes, entities, <script>, <style> and <svg> are left as they are.
const seg = new Intl.Segmenter('ja', { granularity: 'word' });
const HIRA = /^[\u3041-\u309f\u30fc]+$/u;
const PUNCT = /^[、。，．・：；！？,.!?:;]+$/u;
const CLOSE = /^[、。，．・：；！？）」』】〕〉》〙〗’”,.!?:;)\]]+$/u;
const OPEN = /^[（「『【〔〈《〘〖‘“(\[]+$/u;
const JA = /[\u3040-\u30ff\u4e00-\u9fff]/u;
const script = (c) => (/[\u4e00-\u9fff々]/u.test(c) ? 'kan' : /[\u30a0-\u30ff]/u.test(c) ? 'kata' : /[\u3040-\u309f]/u.test(c) ? 'hira' : 'lat');

export function phrases(text) {
  if (!JA.test(text)) return text;
  // entities are atoms: a private-use stand-in while segmenting
  const ents = [];
  const t = text.replace(/&[a-z#0-9]+;/gi, (e) => { ents.push(e); return String.fromCharCode(0xe000 + ents.length - 1); });
  const segs = [...seg.segment(t)].map((s) => s.segment);
  let out = '', prev = null, len = 0;
  segs.forEach((s, i) => {
    const kind = /^\s+$/u.test(s) ? 'space' : HIRA.test(s) ? 'hira' : PUNCT.test(s) ? 'punct' : CLOSE.test(s) ? 'close' : OPEN.test(s) ? 'open' : 'word';
    const honorific = (s === 'お' || s === 'ご') && segs[i + 1] && !HIRA.test(segs[i + 1]) && /^[\u4e00-\u9fff]/u.test(segs[i + 1]);
    let start = false;
    if (prev && prev !== 'space' && kind !== 'space') {
      if (prev === 'punct') start = kind !== 'close' && kind !== 'punct';
      else if (prev === 'close') start = kind === 'word' || kind === 'open';
      else if (kind === 'open') start = true;
      else if (kind === 'word') start = prev === 'hira' || (prev === 'word' && len >= 6 && [...s].length >= 2 && [script(segs[i - 1].slice(-1)), script(s[0])].sort().join() === 'kan,kata');
      else if (honorific) start = prev === 'hira' || prev === 'word';
    }
    out += (start ? '<wbr>' : '') + s;
    len = start || kind === 'space' ? [...s].length : len + [...s].length;
    prev = honorific ? 'open' : kind;
  });
  return out.replace(/[\ue000-\uefff]/g, (c) => ents[c.charCodeAt(0) - 0xe000]);
}

// the text of <main> only, outside <script>/<style>/<svg>
export function jaPhrases(html) {
  return html.replace(/(<main\b[^>]*>)([\s\S]*?)(<\/main>)/, (all, open, body, close) => {
    let skip = 0;
    const parts = body.split(/(<[^>]+>)/);
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (p.startsWith('<')) {
        if (/^<(script|style|svg)\b/i.test(p) && !p.endsWith('/>')) skip++;
        else if (/^<\/(script|style|svg)>/i.test(p)) skip = Math.max(0, skip - 1);
        continue;
      }
      if (!skip && p.trim()) parts[i] = phrases(p);
    }
    return open + parts.join('') + close;
  });
}
