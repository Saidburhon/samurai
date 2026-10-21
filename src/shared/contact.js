// What no SamurAI text may carry on qilich.com (SOLUTIONS-SPEC §2.8.6): a URL, a Telegram link, an e-mail other than
// Qilich's or an @handle (any @word but inbox@qilich.com), or a phone- or card-like run of nine or more digits other
// than Qilich's own number. The Worker's copy guard removes them from every model string (worker/guard.js); the page
// drops any string of a share link that still carries one (src/samurai/sanitize.js), so a crafted link cannot put a
// contact on the official domain. Tested on the NFKC form, so full-width ｈｔｔｐ or ０９０ do not slip through.
export const QILICH_DIGITS = '998972707007';
// nine or more digits, at most two spaces, dots, dashes or brackets between any two of them
export const DIGIT_RUN = /\+?\d(?:[\s().-]{0,2}\d){8,}/g;

/** True when the string carries a link, an e-mail or @handle other than Qilich's, or a phone or card number. */
export function hasContact(s) {
  const t = String(s).normalize('NFKC').replace(/inbox@qilich\.com/gi, '');
  return /\b(?:https?:\/\/|www\.|(?:t|telegram)\.me\b)|@[\p{L}\p{N}_]{2}/iu.test(t) || (t.match(DIGIT_RUN) || []).some((d) => d.replace(/\D/g, '') !== QILICH_DIGITS);
}
