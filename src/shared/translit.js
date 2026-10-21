// Uzbek Cyrillic (and Russian) → Latin, and okina folding, for search and quote matching (SOLUTIONS-SPEC §4.2).
// Folded text is for comparing only: "ўқув маркази", "o'quv markazi" and "Oʻquv markazi" fold to the same string.
const MAP = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'x', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sh', ъ: '', ы: 'i', ь: '', э: 'e', ю: 'yu', я: 'ya', ў: 'o', қ: 'q', ғ: 'g', ҳ: 'h' };
export function fold(s) {
  return String(s || '').toLowerCase().normalize('NFC').replace(/[ʻʼ'‘’`]/g, '').replace(/[а-яёўқғҳ]/g, (c) => MAP[c] ?? c);
}
