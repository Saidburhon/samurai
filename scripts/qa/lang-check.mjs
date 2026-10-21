// The language check of SamurAI results (scripts/eval-samurai.mjs, §8 T27: at least 90 % in the page language).
// the language of a string: the share of letters in the page language's script; Latin strings are told apart by
// Uzbek letters and words versus English words. Product and technology names (Telegram, Excel, 1C, Web) are Latin in
// every language, so in Cyrillic and Japanese strings they are left out before counting.
const UZ_WORDS = /\b(va|uchun|bilan|qiladi|boʻl\w*|kerak|orqali|buyurtma\w*|mijoz\w*|hisob\w*|tizim\w*|xodim\w*|ish|bir|har|yoki|emas|qilish|boshqaruv\w*|toʻlov\w*|ombor\w*|filial\w*|savdo|onlayn|panel\w*|bot\w*|ilova\w*)\b/i;
const EN_WORDS = /\b(the|and|to|of|for|with|your|in|on|a|is|are|from|by|per|staff|orders?|customers?)\b/i;
export function langOk(lang, s) {
  // in Cyrillic and Japanese text, a capitalised Latin word (or iiko) is a name: Telegram, Click, Excel, R-Keeper
  const core = lang === 'ru' || lang === 'ja' ? s.replace(/\b(?:[A-Z0-9][\w.+#-]*|iiko)\b/g, '') : s;
  const letters = [...core].filter((c) => /\p{L}/u.test(c));
  if (letters.length < (lang === 'ja' ? 2 : 4)) return true;
  const share = (re) => letters.filter((c) => re.test(c)).length / letters.length;
  if (lang === 'ja') return share(/[぀-ヿ一-鿿]/u) >= 0.6;
  if (lang === 'ru') return share(/[Ѐ-ӿ]/u) >= 0.8;
  if (share(/[A-Za-zʻʼ]/u) < 0.85) return false;
  const uz = /[ʻʼ]|\b\w+(lar|lari|ni|ning|da|dan|ga|ish|chi|siz)\b/i.test(s) || UZ_WORDS.test(s);
  const en = EN_WORDS.test(s) && !/[ʻʼ]/.test(s);
  if (lang === 'uz') return uz || !en;
  return en || !uz;
}
// the prose of a result, in the page language: not the ids (roles, stack, phase keys, impact models)
export function proseOf(pick, details) {
  const out = [pick?.heard?.summary, pick?.roadmap_note, pick?.first_step, ...(pick?.assumptions || []), ...(pick?.solutions || []).flatMap((x) => [x.title, x.why]), ...(pick?.questions || []).flatMap((q) => [q.text, ...(q.options || []).map((o) => o.label)])];
  for (const d of Object.values(details || {})) {
    out.push(...(d.deliverables_mvp || []), ...(d.deliverables_full || []), ...(d.phases || []).map((p) => p.deliverable), ...(d.risks || []).flatMap((r) => [r.text, r.mitigation]), ...(d.needs || []), d.impact?.summary, ...(d.impact?.inputs || []).map((i) => i.label));
  }
  return out.filter((x) => typeof x === 'string' && x.trim());
}
