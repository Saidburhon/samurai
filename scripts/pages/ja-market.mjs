// What the Japanese catalogue (/ja/solutions/, /ja/prices/) offers. The catalogue is written for the Uzbekistan
// market; a company in Japan looking for an offshore development partner does not buy a Telegram shop bot paid with
// Click and Payme, an E-mehmon guest register or a soliq.uz e-invoice link (SEO-GEO-DECISIONS, Japanese market:
// pages written for Japanese buyers, not translations; SEO-GEO-GUIDELINES: if a page is not written for the
// language, it does not exist in that language).
// A solution has no Japanese page when its group is Telegram, or when any of its Japanese words (title, one-liner,
// scope lists, notes, what we need) still names an Uzbekistan-only system, language, place or payment brand
// (MARKERS). Its uz/ru/en pages then carry no ja hreflang, their language switch goes to /ja/solutions/, and the old
// ja address answers 301 to /ja/solutions/ (public/_redirects), so a link from SamurAI's Japanese results still lands.
// Integrations that exist only in Uzbekistan (content/solutions-extra.json region "uz", plus Telegram, the
// marketplaces and the Uzbek fiscal module) are not shown on /ja/. Prices on /ja/ are in US dollars only.
export const JA_GROUPS_OFF = new Set(['telegram']);
export const MARKERS = /ウズベク|ロシア語|スム|(?<![A-Za-z])Click(?!House)|Payme|Uzum|Humo|Uzcard|Didox|soliq|E-mehmon|E-IMZO|MyID|OneID|(?<![\d.])1C(?![a-z])|iiko|R-Keeper|Yandex|Telegram|Eskiz|Play Mobile|Asl belgisi|nasiya|Faktura|2GIS|hh\.uz|Wildberries|Paynet|KATM|ウズベキスタン|サマルカンド|中央アジア|ナウルーズ|ラマダン/;
export const JA_INTEGRATIONS_OFF = new Set(['telegram', 'marketplaces', 'fiscal']);

// the Japanese words of a solution, as the pages show them
export const jaWords = (s, scope) => {
  const sc = scope?.[s.id] || {};
  return [s.title?.ja, s.oneliner?.ja, ...(sc.mvp?.ja || []), ...(sc.full?.ja || []), sc.notes?.ja || '', ...(s.needs?.ja || [])].filter(Boolean);
};
// why a solution is not offered in Japanese ('' when it is)
export function jaOffReason(s, scope) {
  if (JA_GROUPS_OFF.has(s.group)) return `group ${s.group}`;
  const hit = jaWords(s, scope).map((w) => w.match(MARKERS)?.[0]).find(Boolean);
  return hit ? `names ${hit}` : '';
}
export const offeredIn = (s, lang, scope) => lang !== 'ja' || !jaOffReason(s, scope);
export const jaIntegrationOk = (key, i) => i?.region !== 'uz' && !JA_INTEGRATIONS_OFF.has(key);
