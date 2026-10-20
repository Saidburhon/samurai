# Concept prototypes for the new qilich.com

Four working prototypes, one per creative direction. They are not part of the live site (nothing here is in `public/`).

Run locally:

```bash
cd concepts
python3 -m http.server 8790
```

Then open http://localhost:8790/ and click any frame. Inside a prototype, the bar at the bottom switches scenes.

| Folder | Concept |
|---|---|
| `wildcard/` | Abr 絣: the loom |
| `living-2d/` | Qalam · Qilich 文武: pen and sword |
| `object-cinema/` | Hitofuri 一振: one sword |
| `playground/` | Kendama 剣玉: sword and ball |

Each folder has `src/` (the code) and a prebuilt `bundle.js`, so no build step is needed to view them.

The pen-and-sword prototype uses kanji stroke data from [KanjiVG](https://kanjivg.tagaini.net/) by Ulrich Apel, CC BY-SA 3.0.
