// What no SamurAI text may carry on qilich.com (SOLUTIONS-SPEC §2.8.6): a URL, a Telegram link, an e-mail other than
// Qilich's, an @handle, or a phone- or card-like run of nine or more digits other than Qilich's own number. The
// Worker's copy guard removes them from every model string (worker/guard.js); the page drops any string of a share
// link that still carries one (src/samurai/sanitize.js), so a crafted link cannot put a contact on the official domain.
// Tested on the NFKC form, so full-width ｈｔｔｐ or ０９０ do not slip through.
export const QILICH_DIGITS = '998972707007';
// nine or more digits, at most two spaces, dots, dashes or brackets between any two of them
export const DIGIT_RUN = /\+?\d(?:[\s().-]{0,2}\d){8,}/g;
const LINK = /\b(?:https?:\/\/|www\.)|\b(?:t|telegram)\.me\b/i;
const MAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g;
const HANDLE = /(?:^|[^\w.@])@[\p{L}\p{N}_]{2,}/u;

/** True when the string carries a link, a foreign e-mail, an @handle or a phone or card number. */
export function hasContact(s) {
  const t = String(s).normalize('NFKC');
  if (LINK.test(t)) return true;
  if ((t.match(MAIL) || []).some((e) => e.toLowerCase() !== 'inbox@qilich.com')) return true;
  if (HANDLE.test(t.replace(MAIL, ''))) return true;
  return (t.match(DIGIT_RUN) || []).some((d) => d.replace(/\D/g, '') !== QILICH_DIGITS);
}
