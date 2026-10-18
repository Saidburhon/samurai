# Qilich — IT Solutions Agency landing page

A single-page site for **Qilich** (Uzbek for "sword"), a Japanese IT solutions agency, now in Uzbekistan.
Plain HTML, CSS and JavaScript with no build step. It is served from Cloudflare as a static-assets Worker, deployed with Wrangler.

## What's on the page

| Section | What it does |
|---|---|
| **Intro** | A katana slash cuts the loading screen in half and the two halves slide apart. |
| **Hero** | Sliced red sun with a 剣 (sword) brush kanji. Your cursor leaves a blade trail with sparks. The sun splits further as you scroll. |
| **01 · Battle record** | Interactive case studies of real projects: **Tikoncha** (switch Default / G'ujanak / Qalqon, try to open a blocked app, ask a parent to unlock) and **ClubTime** (start a table, order drinks, stop it to print a thermal receipt and get the Telegram report). Both play a short walkthrough automatically until the visitor touches them. |
| **02 · The Dojo** | Clickable concept apps for brands we haven't worked with yet: a **Safia** cake builder with order tracking, a **Bon!** coffee pre-order with a stamp card, and an **Akfa** window configurator with live price, heat-loss rating and a dealer map. Plus a "Your brand" call to action. |
| **03 · The Arsenal** | Capabilities grid with a live-typing Kotlin/Swift snippet from the screen-time engine. |
| **04 · The Way** | The process: Kamae → Kata → Kiri → Zanshin. |
| **Manifesto + Contact** | Scroll-lit manifesto and a project form. |

It works on phones, honours "reduce motion" settings, and shows no console errors.

## Languages: Uzbek first, English on the switch

- **Uzbek is the default** and is written directly in `public/index.html`, so search engines and visitors without JavaScript get Uzbek.
- **English** lives in `public/assets/js/i18n.js`, keyed by the `data-i18n` attribute on each element.
  `data-i18n-ph` covers placeholders and `data-i18n-label` covers `aria-label`.
- The **UZ | EN switcher** in the nav remembers the visitor's choice. Share `https://qilich.com/?lang=en` to open the English version directly.
- Text the demos draw themselves (toasts, receipts, Telegram messages, form messages) lives in `demos.js` and `main.js` as `L('uzbek', 'english')` pairs.

To change a sentence, edit the Uzbek in `index.html` and the English under the same key in `i18n.js`. If an English entry is missing, the page keeps the Uzbek and logs a warning in the browser console.

## Run it locally

```bash
npm install        # installs the pinned Wrangler
npm run dev        # http://localhost:8787, same runtime as production
```

Or skip Node entirely: `python3 -m http.server 8000` inside `public/`.

## Before launch: connect your contacts

At the bottom of `public/index.html` there is one config block:

```js
window.QILICH_CONFIG = {
  telegram: "",       // e.g. "qilich_agency" (username without @)
  email: "",          // e.g. "hello@qilich.com"
  phone: "",          // e.g. "+998901234567"
  instagram: "",      // e.g. "qilich.agency"
  formEndpoint: ""    // optional: Formspree / Getform / your own API URL
};
```

- Contact buttons stay hidden until their value is filled in.
- The form posts JSON to `formEndpoint` if you set one. Otherwise it opens the visitor's mail app addressed to `email`.
  With neither set, it shows a "demo mode" message, so **fill at least one in before launch**.

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

Turn on **Email Routing** for `qilich.com` and forward `hello@qilich.com` to your own inbox. It's free.
Then set `email: "hello@qilich.com"` in `QILICH_CONFIG`.

## About the concept demos

The Safia, Bon! and Akfa screens are unsolicited concepts. The page labels them "Concept · not affiliated" and carries a disclaimer.
They use no real logos and only sample prices. Keep those labels in place. If you plan to use a brand's name in paid ads or pitch decks, consider asking that brand first.

## Files

```
public/index.html             page markup + contact config
public/404.html               not-found page
public/_headers               security and cache headers
public/assets/css/style.css   all styles (tokens at the top)
public/assets/js/i18n.js      language switcher + English text
public/assets/js/main.js      intro cut, cursor, nav, reveals, scroll effects, tabs, form
public/assets/js/hero.js      blade trail, sparks, embers, parallax, sliced sun
public/assets/js/demos.js     Tikoncha, ClubTime, Safia, Bon!, Akfa demos + code typer
public/assets/img/            favicon, Uzbekistan map
wrangler.json                 Cloudflare config for qilich.com
workers/www-redirect/         www → bare domain redirect
```

## Credits

- Fonts: Archivo, Instrument Serif, JetBrains Mono, Yuji Boku and Shippori Mincho B1 via Google Fonts.
  Only the handful of Japanese glyphs used on the page are downloaded.
- Map of Uzbekistan: [Simplemaps](https://simplemaps.com/resources/svg-license), free for commercial use.
