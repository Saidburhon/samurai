# Qilich — IT Solutions Agency landing page

A single-page site for **Qilich** (Uzbek for "sword"), a Japanese IT solutions agency, now in Uzbekistan.
Plain HTML, CSS and JavaScript with no build step. It is served from Cloudflare as a static-assets Worker, deployed with Wrangler.

## What's on the page

Seven full-screen posters, numbered 一 to 七, plus a short bridge after the hero. Very little text; almost everything answers the cursor or a tap.

| # | Poster | What the visitor can do |
|---|---|---|
| 一 | **Hero** | A whole red sun with 剣. Swipe fast across it (or click it) for a clean cut along your stroke: the top half slides along the blade, holds, and the sun heals. The intro does one cut by itself. The cursor leaves a blade trail; the dots part as it passes. |
| 実績 | **Bridge** | "First, we built for ourselves. Now — for you." Two product tiles lean towards the cursor. A slash cuts across the screen as it scrolls in. |
| 二 | **Hoglt** | When it scrolls into view, a whole school day passes on the 24-hour dial in under four seconds and stops at the real Tashkent time. Drag the dial (it ticks per half hour), tap the legend, replay the day, or poke the hedgehog: it curls into a ball. |
| 三 | **PoolTimer** | Tap a table: the lamp flickers on and the timer runs. Tap it again: a receipt prints, flies into today's total, and a Telegram report arrives. |
| 四 | **Arsenal** | Hover lights a row and column. Fill in the "Yours" column; your picks appear on the contact poster and in the email subject. |
| 五 | **Tokyo · Tashkent** | Live clocks and two 24-hour strips showing both offices' working hours and the 5 they share. Drag across the strips and both clocks travel together. |
| 六 | **The Way** | 構 型 斬 残心 ink in as the red line reaches them. Each is a stamp: click for a thunk, an ink ring and the next note of a koto phrase. |
| 七 | **Contact** | Phone and email, large. On a computer, clicking copies them. |

Shared touches:
- **Dots:** every poster has its own dot field that reacts to the cursor in its own way: parting, blooming, orbiting, magnet, crosshair, waves, a seam, a heartbeat. A click sends a ring through it.
- **Headlines:** letters lift near the cursor with a second ink, and a click sends a wave through them with a koto chord.
- **Sound:** synthesised in the browser (no audio files): a blade, a wood block, koto, a temple bell, a printer. It plays only for real clicks and drags, never on scroll. It's on by default; the speaker button in the nav turns it off and the choice is remembered.

Hoglt and PoolTimer sit in framed cards on the dark page, so they read as Qilich's work. Each card is cut open diagonally as it scrolls in.

**The katana** on the right edge is the scroll bar: the blade is drawn out as you scroll, with one notch per poster. Hover to see names, click to jump. On phones it is hidden and the 一 / 七 counter in the nav does the same job.

Effects that follow the cursor only run with a mouse; on phones a tap sends a ring through the dots. With "reduce motion" on, the dot fields, letter motion and demos are off and every poster shows its final state.

The Hoglt logo and hedgehog images in `public/assets/img/hoglt/` come from hoglt.com.

## Languages: three real pages

Each language is its own page, so Google and Yandex index all three:

| URL | Language | Source |
|---|---|---|
| `/` | Uzbek | `public/index.html`, edited by hand |
| `/ru/` | Russian | generated |
| `/en/` | English | generated |

- Russian and English text lives in `scripts/i18n.mjs`, keyed by the `data-i18n` attribute on each element (`data-i18n-label` covers `aria-label`).
- Page titles, descriptions, share images and the structured data (Organization, ProfessionalService, WebSite) per language are in `scripts/build-langs.mjs`.
- **After changing any text, run `npm run build`.** It rewrites `public/ru/index.html`, `public/en/index.html`, the head of `public/index.html` and `public/sitemap.xml`; commit the result. It stops with an error if a translation is missing.
- The UZ | RU | EN links remember the visitor's choice; old `?lang=ru` links still work.
- Text the scripts write themselves (prices, the Telegram report, toasts) uses `L('uzbek', 'english', 'russian')` in `posters.js` and `main.js`.
- Archivo has no Cyrillic, so Russian falls back to Montserrat.
- Share images (`assets/img/og-*.png`) are 1200×630, one per language.

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
public/assets/js/i18n.js      remembers the chosen language
public/ru/, public/en/        generated Russian and English pages
scripts/i18n.mjs              Russian and English text
scripts/build-langs.mjs       builds /ru/, /en/, head tags, structured data, sitemap
public/assets/js/main.js      intro cut, nav, katana scroll bar, reveals, clocks, the Way line, contacts, footer
public/assets/js/hero.js      blade trail, sparks, the sun you can cut, the sun splitting on scroll
public/assets/js/posters.js   Hoglt dial and hedgehog, PoolTimer hall, matrix picks, day strips, stamps
public/assets/js/fx.js        dot fields, letter lift and wave, tilting tiles
public/assets/js/sfx.js       synthesised sounds and the sound switch
public/assets/img/            favicon, Hoglt logo and hedgehog images
wrangler.json                 Cloudflare config for qilich.com
workers/www-redirect/         www → bare domain redirect
```

## Credits

- Fonts: Archivo, Montserrat, JetBrains Mono, Yuji Boku and Shippori Mincho B1 via Google Fonts.
  Only the handful of Japanese glyphs used on the page are downloaded.
