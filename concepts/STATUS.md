# Status of the concept websites

Request (from the owner, via the local deployment session): a real scrolling website for each concept, not scenes.

| Concept | Folder | Full scrolling site |
|---|---|---|
| Abr 絣, the loom | `wildcard/` | batch 1: in progress |
| Qalam · Qilich 文武, pen and sword | `living-2d/` | batch 1: in progress |
| Hitofuri 一振, one sword | `object-cinema/` | batch 2: after batch 1 |
| Kendama 剣玉 | `playground/` | batch 2: after batch 1 |

Each site: hero, signature moment, the concept's own scenes, services, Tashkent/Tokyo hours, contact, footer, with scroll-driven transitions.
Desktop uses smooth scroll; phones use native touch scroll.
They run from `concepts/` with `python3 -m http.server 8790` and ship a prebuilt `bundle.js`, so no build step is needed.

The cloud session cannot message other sessions yet, so it updates this file and pushes when a batch is ready.
