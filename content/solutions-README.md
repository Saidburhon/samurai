# Solutions catalogue

`solutions.json` is the single source for the **Solutions** page ("Yechimlar" / "Решения" / "Solutions") and for the
**SamurAI** advisor. It lists 158 solutions in 10 groups, with titles and one-line values in Uzbek, Russian and English,
and timelines and USD price ranges for an MVP and a full version. You can edit it by hand: it is plain JSON.

| File | What it is |
|---|---|
| `solutions.json` | the catalogue |
| `samurai-knowledge.md` | the briefing SamurAI reads: who Qilich is, how it works, pricing principles, what it will not do |
| `solutions-README.md` | this file |

## Structure

Top level:

| Field | Meaning |
|---|---|
| `version`, `updated` | bump `updated` when you change prices |
| `currency` | the UZS rate used to show prices in soʻm (see "Prices in soʻm" below) |
| `pricing` | the assumptions behind every number: blended rate, rate card, what a price includes and excludes, adjustments |
| `groups` | the 10 groups in display order: `id`, `title` and `line` (a one-line intro), each in `uz`, `ru`, `en` |
| `industries` | labels for the `for` tags, in `uz`, `ru`, `en` |
| `solutions` | the list; its order is the display order within each group |

Each solution:

| Field | Type | Meaning |
|---|---|---|
| `id` | kebab-case string | stable key; never reuse or rename one that is live (links and SamurAI answers refer to it) |
| `group` | group id | `ai`, `telegram`, `mobile`, `games`, `web`, `business`, `iot`, `cloud`, `support`, `industry` |
| `featured` | boolean | shown first or highlighted on the page; 15 are set now, change freely |
| `title` | `{uz, ru, en}` | the card title, up to about 60 characters |
| `value` | `{uz, ru, en}` | one line for a business owner: the concrete result, no buzzwords |
| `for` | list of industry ids | who it is for; labels live in `industries`; `any` means any business |
| `scope.mvp`, `scope.full` | English text | what the MVP and the full version typically include. For SamurAI and for quoting; translate before showing it on the page |
| `notes` | English text or `null` | caveats SamurAI must mention (hardware is extra, a licence is needed, accuracy is tested first) |
| `billing` | `project` or `monthly` | see "Monthly services" below |
| `timeline_weeks` | `{mvp: {min, max}, full: {min, max}}` | calendar weeks from kick-off |
| `price_usd` | `{mvp: {min, max}, full: {min, max}}` | whole US dollars |
| `running_usd_month` | `{min, max}` or `null` | the client's own monthly running costs (hosting, AI usage, SMS, telephony, licences), not Qilich's fee |
| `integrations` | list of strings | the systems it connects to; names as the market knows them (Click, Payme, 1C, Didox, E-IMZO…) |
| `next` | list of ids, optional | the bigger solutions this one grows into (`tg-loyalty-bot` → `mob-loyalty-platform`). SamurAI never proposes two solutions where one grows into the other as the same first step |

Solutions per group: AI and agents 26, Telegram 14, mobile 12, games/AR/VR 11, web 16, business systems 23,
IoT and hardware 14, cloud/data/security 12, support and design 10, industry solutions 20.

## Editing prices

- Prices are ranges in **USD**. The low end is a lean scope; the high end is a typical scope with about 15% contingency.
- **MVP** is the first fixed-scope version that real users can use. **Full** is a fuller version of the same product.
- **`full` is cumulative.** It is the total from kick-off, MVP included, in both weeks and dollars. It is not "what comes
  after the MVP". So `full.min` must be at least `mvp.min`, and `full.max` at least `mvp.max`.
- Keep `min ≤ max` everywhere, and use whole numbers (no `$`, no spaces, no thousands separators).
- **Monthly services** (`billing: "monthly"`: `sup-sla`, `sup-dedicated-team`, `sup-fractional-cto`): `price_usd` is per
  month, `mvp` is the basic plan, `full` the extended plan, and `timeline_weeks` is the time needed to start.
- To move every price at once (for example after a salary review), change the numbers and also
  `pricing.blended_rate_usd_per_hour`, so the README, SamurAI and the catalogue tell the same story.

Check the file after editing:

```bash
node -e "JSON.parse(require('fs').readFileSync('content/solutions.json','utf8')); console.log('ok')"
```

## Prices in soʻm

Prices are stored only in USD. The page and SamurAI convert them:

- Rate: `currency.uzs_per_usd` (now 12 044.72, the Central Bank of Uzbekistan rate for 20 October 2026). A page with a
  server can fetch the day's rate from `https://cbu.uz/ru/arkhiv-kursov-valyut/json/USD/` (field `Rate`) and fall back to
  the stored one. Update the stored rate and `rate_date` when you change prices.
- Rounding: below 10 million soʻm, to the nearest 100 000; from 10 million, to the nearest million.
  Example: $3,000–6,000 → 36–72 mln soʻm; $500 → 6,0 mln soʻm.
- Formats: uz `36–72 mln soʻm`, ru `36–72 млн сум`, en `UZS 36–72 million`.

## Pricing assumptions

**Blended rate: $25 an hour.** Rate card behind it (USD per hour): project manager 28, senior engineer or architect 38,
engineer 25, junior engineer 15, ML engineer 40, DevOps 32, UX/UI designer 25, game or 3D artist 28, QA 18.

Where that sits (checked in October 2026 against public listings; no competitor is named on the site):

| Who | Typical rate | Note |
|---|---|---|
| Tashkent freelancers | $5–15/h | simple bots from a few hundred dollars; little testing, support or documentation |
| Uzbek agencies selling abroad | median about $37/h | international directory listings, August 2026 |
| Western agencies | $80–180/h | the same mobile MVP costs $60–150k |
| **Qilich, local clients** | **$25/h blended** | Japanese process (plan, QA, daily reports) at Tashkent prices |

Team assumed by project size:

| Size | Examples | Team |
|---|---|---|
| Small, up to ~$8k | bots, landing pages, integrations, audits | 1 engineer, part-time PM and QA, a designer when needed |
| Medium, $8–40k | apps, portals, CRM, IoT pilots | PM 0.5, 2–3 engineers, designer 0.5, QA 0.5 |
| Large, over $40k | ERP, fintech, marketplaces, super-apps, 3D games | PM, architect 0.5, 4–8 engineers, designer, 1–2 QA, DevOps 0.3 |

QA is planned at 20–30% of development time, and the first 1–2 weeks of a larger project are planning and design.

**A price includes** project management, design, development, testing, deployment, acceptance fixes and handover.
**It excludes** hardware (cameras, sensors, trackers, kiosks, VR headsets), third-party licences and usage fees (hosting,
AI APIs, SMS, telephony, maps, CRM and 1C licences, App Store and Google Play fees), content production (photo and video
shoots, 3D models per product) and taxes where they apply.

**Timelines include** design, build, testing and launch. They do not include waiting on third parties: merchant contracts
with Click or Payme, OneID or MyID access, operator API keys (Didox, Faktura.uz, Asl belgisi), App Store review
(1–7 days), hardware delivery (often 2–6 weeks from abroad).

**Adjustments** (in `pricing.adjustments`, used by SamurAI):

| When | Effect |
|---|---|
| deadline 25% shorter than the range | +20–30% |
| separate native iOS and Android apps instead of one codebase | +40–70% on the app part |
| bank-grade security or a regulated product | +20–40% |
| each UI language beyond Uzbek, Russian and English | +5–10% |
| heavy migration from old systems | +10–30% |
| several solutions together | the largest at 100%, each further one at 70–85% (shared backend, design and setup) |

## Decisions left to the owner

These are not stated anywhere yet, and SamurAI is told to defer them to the call or the contract:

- whether site prices are shown with or without VAT (12%), which depends on Qilich's tax status (for example IT Park
  residency);
- payment stages, warranty period and who owns the code;
- whether a paid discovery is credited against the build when the client goes ahead;
- the `featured` list.

## For the Solutions page

- `title`, `value`, `groups[].title`, `groups[].line` and `industries` are ready to show in all three languages. `scope`
  and `notes` are English working text: translate them before showing them.
- Uzbek text uses the okina `ʻ` (U+02BB) in oʻ and gʻ, and the tutuq `ʼ` (U+02BC) in words like maʼlumot, taʼlim,
  eʼlon. The copy lint checks only the okina; make sure the font subsets include U+02BC too.
- Russian text has a non-breaking space before every dash, as the copy lint requires.

## For SamurAI

The whole file is about 100k tokens. SamurAI (`worker/samurai.js`) sends a compact English projection instead, one line
per solution, in the cached part of its system prompt; with the briefing and the site rules that prompt is about 56k
tokens. The line holds everything SamurAI needs to scope and price honestly: the MVP scope, what the full version adds
(so a feature from the full version is never sold at the MVP price), the systems it works with, what it grows into,
and the note:

```js
const r = (x) => `${x.min}-${x.max}`;
const line = (s) =>
  `${s.id} [${s.group}] ${s.title.en}: ${s.value.en} | for: ${s.for.join(',')}` +
  ` | MVP ${r(s.timeline_weeks.mvp)}w $${r(s.price_usd.mvp)}; full ${r(s.timeline_weeks.full)}w $${r(s.price_usd.full)}` +
  (s.billing === 'monthly' ? ' per month' : '') +
  (s.running_usd_month ? ` | running $${r(s.running_usd_month)}/mo` : '') +
  ` | MVP: ${s.scope.mvp} | full adds: ${s.scope.full}` +
  (s.integrations?.length ? ` | works with: ${s.integrations.join(', ')}` : '') +
  (s.next?.length ? ` | grows into: ${s.next.join(',')}` : '') +
  (s.notes ? ` | note: ${s.notes}` : '');
```

Every edit here changes that prompt, so the first SamurAI answer after a deploy writes the cache again (about $0.45).
When SamurAI answers in Uzbek or Russian, the site takes the solution title from `title.uz` or `title.ru` by id. The
price floor of a solution is the MVP minimum of its main (first non-helper) item, and its ceiling 1.5 times the
largest full price among its items, so keep `price_usd` realistic: SamurAI's numbers are clamped to it.

## Copy rules for any text you add

- Never any form of "yaratish". Use quramiz, ishlab chiqamiz or qilamiz; in Russian строим or разрабатываем.
- No product, client or portfolio names, and no Telegram usernames or t.me links.
- Uzbek Latin with `ʻ` (U+02BB) in oʻ and gʻ, never an apostrophe or a backtick.
- No buzzwords: innovative, cutting-edge, seamless, empower, elevate, synergy, world-class, next-level, unleash.
- The value line says what changes for the business ("orders go straight to the kitchen"), not how good the technology is.
- Contact: +998 97 270 70 07, inbox@qilich.com.

## Adding a solution

Copy an existing entry in the same group and change every field. Template:

```json
{
  "id": "group-short-name",
  "group": "business",
  "featured": false,
  "title": { "uz": "…", "ru": "…", "en": "…" },
  "value": { "uz": "…", "ru": "…", "en": "…" },
  "for": ["retail", "distribution"],
  "scope": { "mvp": "What the first version includes.", "full": "What the fuller version adds." },
  "notes": null,
  "billing": "project",
  "timeline_weeks": { "mvp": { "min": 4, "max": 6 }, "full": { "min": 10, "max": 16 } },
  "price_usd": { "mvp": { "min": 5000, "max": 9000 }, "full": { "min": 14000, "max": 30000 } },
  "running_usd_month": { "min": 30, "max": 150 },
  "integrations": ["1C", "Telegram Bot API"]
}
```
