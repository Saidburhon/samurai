# qilich.com

The site of **Qilich** ("sword" in Uzbek), a Japanese IT agency now in Tashkent. One sword is the whole page: a
Japanese blade with an Uzbek grip, drawn as an oshigata, filled with steel, forged, quenched, polished and sheathed as
you scroll (the HITOFURI direction). Static site on Cloudflare; everything visual is made in code (SVG, canvas, WebGL).

The build is staged by gates. **G0 (this state)** ships the skeleton and all the content in **flow mode**: a printed
sword catalogue, one ink plate per scene, the same text as the film. The WebGL film (cinema mode) arrives from G1;
`scripts/build.mjs` keeps it off (`CINEMA = false`) until then.

## Pages and languages

| URL | Language | Source |
|---|---|---|
| `/` | Uzbek | `public/index.html`, edited by hand (its generated parts are rewritten by the build) |
| `/ru/`, `/en/` | Russian, English | generated from the Uzbek page with `scripts/i18n.mjs` |
| `/404.html` | all three | `public/404.html` |

- Text lives in `data-i18n` elements (`data-i18n-label` for `aria-label`). The build fails on a key missing from a
  dictionary and on a dictionary key the page no longer uses.
- Every string JavaScript shows is in the HTML (`#strings`), so the dictionaries, the lint and the font subsets see it.
- Copy rules (checked by `scripts/lint-copy.mjs`): never any form of "yaratish"; no product or client names; no
  Telegram handle; the Uzbek okina is `ʻ` (U+02BB); Russian puts a non-breaking space before every dash.
- Titles, descriptions, share images and JSON-LD per language: `META` in `scripts/build-langs.mjs`.

## Build

```bash
npm install
npm run build     # everything below, in order
npm run lint      # the copy lint over the sources and the built pages
```

`npm run build` (`scripts/build.mjs`):
1. `lint-copy.mjs`
2. `build-osh.mjs`: every drawing from the one generator (`src/sword/drawing.js`, geometry in `src/sword/geom-core.js`,
   the girih in `src/sword/girih-holes.json`): the inline hero, plan and bookend drawings (`<!-- gen:osh -->`), the
   dial (`<!-- gen:dial -->`, `src/sword/dial.js`), the CSS that places the hero drawing without JS
   (`src/styles/gen/osh.css`) and the flow-mode plates (`public/assets/osh/*.svg`, no text inside)
3. the inline head and boot scripts (`src/boot/`) and the critical CSS, written as whole `data-gen` elements
4. esbuild: `src/main.js` and `src/styles/main.css` into `public/assets/build/` (hashed, split chunks)
5. `build-langs.mjs`: `/ru/`, `/en/`, META, JSON-LD, hreflang, `sitemap.xml`
6. `fonts.mjs`: subsets made from the built pages (Geologica, Martian Mono, Zen Old Mincho, QOkina for the okina,
   GeologicaSign), metric-matched fallbacks, `<style data-gen="fonts">`. Source fonts are fetched once into `.cache/`.
7. the preload block of each page (`<!-- gen:preload -->`)
8. `og.mjs`: share images and icons, only when the hero or the h1 changed

The build output is committed. `scripts/girih.mjs` re-traces the girih polygons (run once; the JSON is committed).

## Look at it

```bash
python3 -m http.server 8800 -d public      # http://localhost:8800/  (?tier=0 forces flow mode)
npm run dev                                  # wrangler, same runtime as production
```

QA probes (global Playwright, the capture's SwiftShader flags): `npm run qa:fit` (text against margins, other text,
the nav and ruler bands and the blade band, uz/ru/en at 1440 × 900, 1280 × 720, 390 × 844, 360 × 740) and
`npm run qa:flow` (console, lang, h1, all copy, the okina's font, the no-JS drawing on its diagonal, overflow, sheets).

## Deploy (Cloudflare, static assets)

`npm run deploy` builds, then `wrangler deploy` uploads `public/` to the `qilich-com` Worker (custom domain
`qilich.com`). `public/_headers` makes every hashed asset immutable. `npm run deploy:www` deploys the
`www` → apex redirect in `workers/www-redirect/`.

Contact on the site: +998 97 270 70 07, inbox@qilich.com.
