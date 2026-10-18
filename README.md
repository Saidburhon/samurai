# Samurai — IT Solutions Agency landing page

A single-page site for **Samurai**, an IT solutions agency from Uzbekistan.
Plain HTML, CSS and JavaScript: no build step, no framework, no dependencies to install.

## What's on the page

| Section | What it does |
|---|---|
| **Intro** | A katana slash cuts the loading screen in half and the two halves slide apart. |
| **Hero** | Sliced red sun with a 侍 brush kanji. Your cursor leaves a blade trail with sparks. The sun splits further as you scroll. |
| **01 · Battle record** | Interactive case studies of real projects: **Tikoncha** (switch Default / G'ujanak / Qalqon, try to open a blocked app, ask a parent to unlock) and **ClubTime** (start a table, order drinks, stop it to print a thermal receipt and get the Telegram report). Both play a short walkthrough automatically until the visitor touches them. |
| **02 · The Dojo** | Clickable concept apps for brands we haven't worked with yet: a **Safia** cake builder with order tracking, a **Bon!** coffee pre-order with a stamp card, and an **Akfa** window configurator with live price, heat-loss rating and a dealer map. Plus a "Your brand" call to action. |
| **03 · The Arsenal** | Capabilities grid with a live-typing Kotlin/Swift snippet from the screen-time engine. |
| **04 · The Way** | The process: Kamae → Kata → Kiri → Zanshin. |
| **Manifesto + Contact** | Scroll-lit manifesto and a project form. |

It works on phones, honours "reduce motion" settings, and shows no console errors.

## Run it locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Before launch: connect your contacts

At the bottom of `index.html` there is one config block:

```js
window.SAMURAI_CONFIG = {
  telegram: "",       // e.g. "samurai_agency" (username without @)
  email: "",          // e.g. "hello@samuraidevs.com"
  phone: "",          // e.g. "+998901234567"
  instagram: "",      // e.g. "samurai.agency"
  formEndpoint: ""    // optional: Formspree / Getform / your own API URL
};
```

- Contact buttons stay hidden until their value is filled in.
- The form posts JSON to `formEndpoint` if you set one. Otherwise it opens the visitor's mail app addressed to `email`.
  With neither set, it shows a "demo mode" message, so **fill at least one in before launch**.

## Deploy

It's a static folder, so any static host works:

- **Vercel / Netlify / Cloudflare Pages**: import the repo; no build command; output directory is the repo root.
- **GitHub Pages**: Settings → Pages → deploy from branch, root folder.

Then point your domain at it.

## Domain shortlist

These `.com` names were **unregistered** when checked against the Verisign RDAP registry on 18 Oct 2026.
Availability changes quickly, so confirm at a registrar before you decide:

- `samuraidevs.com`
- `samuraiforged.com`
- `samuraisoftworks.com`
- `samuraiuz.com`
- `builtbysamurai.com`

Already taken at the time: `samuraiit.com`, `samurai-it.com`, `samuraitech.com`, `samuraidev.com`, `samuraisoft.com`, `samurailabs.com`, `samuraistudio.com`, `samuraiagency.com`.

## About the concept demos

The Safia, Bon! and Akfa screens are unsolicited concepts. The page labels them "Concept · not affiliated" and carries a disclaimer.
They use no real logos and only sample prices. Keep those labels in place. If you plan to use a brand's name in paid ads or pitch decks, consider asking that brand first.

## Files

```
index.html             page markup + contact config
assets/css/style.css   all styles (tokens at the top)
assets/js/main.js      intro cut, cursor, nav, reveals, scroll effects, tabs, form
assets/js/hero.js      blade trail, sparks, embers, parallax, sliced sun
assets/js/demos.js     Tikoncha, ClubTime, Safia, Bon!, Akfa demos + code typer
assets/img/            favicon, Uzbekistan map
```

## Credits

- Fonts: Archivo, Instrument Serif, JetBrains Mono, Yuji Boku and Shippori Mincho B1 via Google Fonts.
  Only the handful of Japanese glyphs used on the page are downloaded.
- Map of Uzbekistan: [Simplemaps](https://simplemaps.com/resources/svg-license), free for commercial use.
