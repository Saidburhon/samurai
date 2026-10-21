// The copy guard (SOLUTIONS-SPEC §2.8.6): every string the model writes passes through guard() before it reaches
// a page, a share link or the owner's Telegram. The rules are worker/copy-rules.js (shared with the build's lint).
//   1. NFC, the allowed characters only
//   2. Uzbek: the okina after o/g, the tutuq between letters
//   3. every language: yarat- → qur- (Latin and Cyrillic), keeping case and suffix
//   4. no @handles (but inbox@qilich.com), no URLs, no t.me, no product names, no phone or card numbers but Qilich's
//   5. dashes: Russian NBSP before —, English " — " → ", "
//   6. the BANNED list again: a string that still fails is dropped (null), and its card shows the catalogue text
import { BANNED, NOT_ALLOWED } from './copy-rules.js';
import { DIGIT_RUN, QILICH_DIGITS, hasContact } from '../src/shared/contact.js';

const EMAIL = 'inbox@qilich.com';
const PHONE = '+998 97 270 70 07';
const rev = (x) => [...x].reverse().join('');
// product names that never appear on the site, kept reversed so no build artefact carries them
const PRODUCTS = new RegExp(['tlgoh', 'remit*s\\loop', 'emit*s\\bulc', 'ahcnokit'].map(rev).join('|'), 'gi');
const URLS = /\b(?:https?:\/\/|www\.)\S+|\b(?:t|telegram)\.me\/?\S*/gi;
const EMAILS = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g;
const HANDLES = /(^|[^\w.@])@[\p{L}\p{N}_]{2,}/gu;
const PHONES = /\+\d[\d\s().-]{7,}\d|\b\d{2}[\s-]\d{3}[\s-]\d{2}[\s-]\d{2}\b/g;
const BUZZ = [
  [/\bseamless(ly)?\b/gi, (m, ly) => (ly ? 'smoothly' : 'smooth')],
  [/\binnovative\b/gi, 'new'],
  [/\bcutting-edge\b/gi, 'modern'],
  [/\bworld-class\b/gi, 'solid'],
  [/\bnext-level\b/gi, 'better'],
  [/\bempower(s|ing)?\b/gi, 'help$1'],
  [/\b(unleash|elevate)(s)?\b/gi, 'improve$2'],
  [/\bsynergy\b/gi, 'shared work'],
  [/\bwe craft\b/gi, 'we build'],
];
const caseOf = (m, to) => (m === m.toUpperCase() ? to.toUpperCase() : m[0] === m[0].toUpperCase() ? to[0].toUpperCase() + to.slice(1) : to);

export const stats = { guarded: 0, changed: 0, dropped: 0 };

/** Returns the cleaned string, or null when it still breaks a rule (the caller then drops the field). */
export function guard(input, lang) {
  if (input == null) return null;
  stats.guarded++;
  let s = String(input).normalize('NFC');
  const before = s;
  // every field is one line: line breaks and separators become spaces (a dropped U+2028 would glue two sentences)
  s = s.replace(/[\t\n\r\v\f\u0085\u2028\u2029]+/g, ' ').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/[\u200b-\u200f\u2060\ufeff]/g, '');
  s = s.replace(/\*\*|__|`|[{}<>]/g, '');
  if (lang === 'uz') {
    s = s.replace(/([oOgG])['‘’`ʼ]/g, '$1ʻ');
    s = s.replace(/(\p{L})['’`](\p{L})/gu, '$1ʼ$2');
  }
  s = s.replace(lang === 'ja' ? NOT_ALLOWED.ja : NOT_ALLOWED.base, '');
  // the forbidden root takes the same suffixes as qur-: yaratamiz → quramiz, yaratilgan → qurilgan
  s = s.replace(/(y)(arat)/giu, (m, y, a) => caseOf(y, 'q') + (a === a.toUpperCase() ? 'UR' : 'ur'));
  s = s.replace(/(я)(рат)/giu, (m, y, a) => caseOf(y, 'қ') + (a === a.toUpperCase() ? 'УР' : 'ур'));
  s = s.replace(URLS, '').replace(PRODUCTS, '');
  s = s.replace(EMAILS, (m) => (m.toLowerCase() === EMAIL ? m : ''));
  s = s.replace(HANDLES, '$1');
  s = s.replace(PHONES, (m) => (m.replace(/\D/g, '') === QILICH_DIGITS ? PHONE : m.replace(/\D/g, '').length >= 9 ? '' : m));
  // a card or account number, or a phone in any other grouping: nine digits or more (the page refuses them too)
  s = s.replace(DIGIT_RUN, (m) => (m.replace(/\D/g, '') === QILICH_DIGITS ? m : ''));
  if (lang === 'en') for (const [re, to] of BUZZ) s = s.replace(re, to);
  if (lang === 'ru') s = s.replace(/ +—/g, '\u00a0—');
  if (lang === 'en') s = s.replace(/\s+—\s+/g, ', ');
  s = s.replace(/[ \t]{2,}/g, ' ').replace(/ +([,.;:!?])/g, '$1').trim();
  if (s !== before) stats.changed++;
  for (const [re] of BANNED) if (re.test(s)) { stats.dropped++; return null; }
  // what survives only in another form (full-width ｈｔｔｐｓ, ０９０…): the field is dropped, as the page would drop it
  if (hasContact(s)) { stats.dropped++; return null; }
  return s;
}

// a sentence that names money or a percentage the visitor did not write is dropped: the engine writes every number
const MONEY = /(\$\s?\d|\d[\d\s.,]*\s?(?:\$|usd|dollar|долл|mln|млн|million|ming|тыс|thousand|so[ʻ'’]?m|сум|uzs|万|円|ドル|スム|%|процент|foiz))/i;
export function stripMoney(s, visitorText = '') {
  if (!s || !MONEY.test(s)) return s;
  const digits = new Set((String(visitorText).match(/\d[\d\s.,]*/g) || []).map((x) => x.replace(/\D/g, '')));
  const parts = s.split(/(?<=[.!?。])\s*/);
  const kept = parts.filter((p) => { const m = p.match(MONEY); if (!m) return true; const d = m[0].replace(/\D/g, ''); return d && digits.has(d); });
  return kept.join(' ').trim();
}
