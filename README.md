# Qilich — IT Solutions Agency landing page

A single-page site for **Qilich** (Uzbek for "sword"), a Japanese IT solutions agency, now in Uzbekistan.
Plain HTML, CSS and JavaScript with no build step. It is served from Cloudflare as a static-assets Worker, deployed with Wrangler.

## What's on the page

Seven full-screen posters, numbered 一 to 七, plus a short bridge after the hero. Little text, mostly visuals.

| # | Poster | What it shows |
|---|---|---|
| 一 | **Hero** | The slogan, and a sliced red sun with the 剣 (sword) kanji. A white slash cuts the sun on load and it splits further as you scroll. Your cursor or finger leaves a blade trail. |
| 実績 | **Bridge** | "First, we built for ourselves": explains that the two products that follow are the Qilich team's own, with a tile for each. A slash cuts across the screen as it scrolls in. |
| 二 | **Hoglt** (Tikoncha) | A 24-hour dial of a school day: sleep, school, limit, free time. The hedgehog changes with the hour. Drag the dial or tap the legend. Real numbers: 10K+ Google Play installs, 3 apps. Links to hoglt.com. |
| 三 | **PoolTimer** (ClubTime) | A pool hall of six tables. Tap a table to start or stop it; closing one sends a Telegram-style report. Real numbers: 11 languages, 4 platforms. Links to pooltimer.app. |
| 四 | **Arsenal** | A matrix: which platforms each product runs on, plus an empty "Yours" column. |
| 五 | **Tokyo · Tashkent** | Two live clocks, the 5,991 km arc between them and the 4-hour difference. |
| 六 | **The Way** | Kamae → Kata → Kiri → Zanshin: plan, design, code, support. |
| 七 | **Contact** | The phone number and email, large. |

Hoglt and PoolTimer sit in framed cards labelled "Built by Qilich" on the dark page, so the products read as Qilich's work. Each card is cut open diagonally as it scrolls in.

**The katana** on the right edge is the scroll bar: the blade is drawn out of the guard as you scroll, with one notch per poster. The current notch shows its numeral; hover the blade to see all names; click a notch to jump. A glint runs down the steel at each new poster, and the colours adapt on the red and paper posters. On phones it is hidden and the 一 / 七 counter in the nav does the same job.

It works on phones, honours "reduce motion" settings, and shows no console errors.

The Hoglt logo and hedgehog images in `public/assets/img/hoglt/` come from hoglt.com.

## Languages: Uzbek first, Russian and English on the switch

- **Uzbek is the default** and is written directly in `public/index.html`, so search engines and visitors without JavaScript get Uzbek.
- **Russian and English** live in `public/assets/js/i18n.js` (the `RU` and `EN` dictionaries), keyed by the `data-i18n` attribute on each element.
  `data-i18n-ph` covers placeholders and `data-i18n-label` covers `aria-label`.
- The **UZ | RU | EN switcher** in the nav remembers the visitor's choice. Share `https://qilich.com/?lang=ru` or `?lang=en` to open a version directly.
- Text the posters draw themselves (the PoolTimer prices and Telegram report) lives in `posters.js` as `L('uzbek', 'english', 'russian')` calls.
- Archivo has no Cyrillic, so Russian text falls back to Montserrat. Browsers download it only when Cyrillic is on screen.

To change a sentence, edit the Uzbek in `index.html` and the Russian and English under the same key in `i18n.js`. If an entry is missing, the page keeps the Uzbek and logs a warning in the browser console.

## Run it locally

```bash
npm install        # installs the pinned Wrangler
npm run dev        # http://localhost:8787, same runtime as production
```

Or skip Node entirely: `python3 -m http.server 8000` inside `public/`.

## Contacts

At the bottom of `public/index.html` there is one config block:

```js
window.QILICH_CONFIG = {
  email: "inbox@qilich.com",
  phone: "+998972707007"
};
```

A contact link stays hidden if its value is empty.

## Deploy to qilich.com (Cloudflare, free plan)

The site is a **static-assets Worker**: no server code, and static file requests are free and unlimited.
HTTPS, CDN and compression come with it. Config lives in `wrangler.json`:

- `assets.directory` is `public/`, so only the site files are uploaded.
- `routes` attaches `qilich.com` as a **custom domain**. Cloudflare creates the DNS record and certificate itself.
- `not_found_handling: "404-page"` serves `public/404.html` for unknown paths.
- `public/_headers` sets security headers and a short cache for `/assets/*`.

`workers/www-redirect/` is a tiny Worker that 301-redirects `www.qilich.com` to `qilich.com`, keeping the path.

### Before the first deploy

1. Buy `qilich.com` in Cloudflare (Domain Registration), so the zone is in your account.
2. In DNS, make sure `qilich.com` and `www.qilich.com` have **no A, AAAA or CNAME records**. Otherwise the deploy fails with error 100117.
3. **Don't open qilich.com until the first deploy is done.** If someone looks it up while it has no records, mobile carriers can cache "no such site" for up to 30 minutes.

### Option A: deploy on every push (recommended)

In Cloudflare: Workers & Pages → Create → **Import a repository** → `Saidburhon/samurai`.

- Worker name: `qilich-com` (must match `name` in `wrangler.json`)
- Production branch: `main`
- Build command: leave empty
- Deploy command: `npx wrangler deploy`

Create a second Worker from the same repo for the redirect. Name it `www-redirect`, with deploy command `npx wrangler deploy -c workers/www-redirect/wrangler.json`.
After that, every push to `main` goes live by itself.

### Option B: deploy from your computer

```bash
npm install
npx wrangler login      # one-time browser approval
npm run deploy          # qilich.com
npm run deploy:www      # www.qilich.com → qilich.com
```

### Email

Turn on **Email Routing** for `qilich.com` and forward `inbox@qilich.com` to your own inbox. It's free.
## Files

```
public/index.html             page markup + contact config
public/404.html               not-found page
public/_headers               security and cache headers
public/assets/css/style.css   all styles (tokens at the top)
public/assets/js/i18n.js      language switcher + Russian and English text
public/assets/js/main.js      intro cut, nav, katana scroll bar, reveals, clocks, the Way line, contacts, footer
public/assets/js/hero.js      blade trail, sparks, the sun splitting on scroll
public/assets/js/posters.js   Hoglt day dial, PoolTimer hall, platform matrix
public/assets/img/            favicon, Hoglt logo and hedgehog images
wrangler.json                 Cloudflare config for qilich.com
workers/www-redirect/         www → bare domain redirect
```

## Credits

- Fonts: Archivo, Montserrat, JetBrains Mono, Yuji Boku and Shippori Mincho B1 via Google Fonts.
  Only the handful of Japanese glyphs used on the page are downloaded.
