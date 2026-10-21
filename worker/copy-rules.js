// The copy rules, in one place: the build's lint (scripts/lint-copy.mjs) and SamurAI's copy guard (worker/guard.js)
// import this file, so one list governs the site and the AI. It lives in worker/ because the built-asset lint scans
// src/ and public/ for the banned stems themselves.
export const BANNED = [
  [/yarat/i, 'a form of "yaratish"'],
  [/hoglt|pool\s*timer|club\s*time|tikoncha/i, 'a product name'],
  [/t\.me\/|telegram\.me\//i, 'a Telegram link'],
  [/(^|[^\w."])@(?!qilich\.com)[a-z0-9_]{3,}/i, 'an @handle'],
  [/\b(we craft|craft(ing)? digital|innovative|cutting-edge|seamless|empower|elevate|synergy|world-class|next-level|unleash)\b/i, 'a generated-copy tell'],
];
// an ASCII or curly quote, or a backtick, after o, O, g or G in Uzbek (the okina is U+02BB)
export const OKINA_BAD = /[oOgG]['‘’`]/;
// an apostrophe between letters in Uzbek (ʻ U+02BB after o/g, ʼ U+02BC elsewhere)
export const APOS_BAD = /[A-Za-z]['’`][a-z]/;

// The characters a model string may keep (§2.8.6): Basic Latin, NBSP and the Latin-1 signs the fonts carry, the
// okina and tutuq, Cyrillic, and – — … « » „ “ ” ‘ ’ № × ≈ −. Japanese pages also keep kana, kanji and full-width
// forms (set in the system Japanese face). Everything else is dropped, emoji included, so every glyph is in the subsets.
const BASE = '\\u0020-\\u007E\\u00A0\\u00AB\\u00BB\\u00B7\\u00D7\\u02BB\\u02BC\\u0400-\\u04FF\\u2013\\u2014\\u2026\\u201E\\u201C\\u201D\\u2018\\u2019\\u2116\\u2248\\u2212';
const JA = '\\u3000-\\u303F\\u3040-\\u30FF\\u3400-\\u4DBF\\u4E00-\\u9FFF\\uF900-\\uFAFF\\uFF01-\\uFF60\\uFFE0-\\uFFEE\\u301C\\u30FB';
export const NOT_ALLOWED = { base: new RegExp(`[^${BASE}\\n]`, 'gu'), ja: new RegExp(`[^${BASE}${JA}\\n]`, 'gu') };
// the glyphs the fonts must carry for model text (scripts/fonts.mjs adds them to every subset)
export const FONT_EXTRA = '\u00a0«»·×ʻʼ–—…„“”‘’№≈−ўқғҳЎҚҒҲ';
