// The SamurAI part of `npm run build` (called by scripts/build-pages.mjs):
//   1. the day's CBU rate (curl, 5 s; content/rate.json keeps the last good one; the Worker falls back to it)
//   2. the catalogue model (content/solutions.json + solutions-extra.json + pricing.json, src/shared/catalogue.js)
//   3. worker/gen/meta.json: the catalogue fingerprint and the fallback rate for the Worker
//   4. public/assets/samurai/data-<lang>-<hash>.json (the page's catalogue) and samples-<lang>-<hash>.json
//   5. /samurai/ × uz, ru, en, ja through the shared page chrome
// Returns the page entries ({ lang, path, file, slug, entry: 'samurai' }) for the fonts, preloads and sitemaps.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { dirname } from 'node:path';
import { normalise, compact } from '../../src/shared/catalogue.js';
import { LANGS, HOME, pathOf } from '../site.mjs';
import { renderSamurai, samuraiTwins, SLUG } from './samurai.mjs';

const J = (p) => JSON.parse(readFileSync(p, 'utf8'));
const OUT = 'public/assets/samurai';

function cbuRate() {
  const last = existsSync('content/rate.json') ? J('content/rate.json') : { uzs_per_usd: 12012.3, date: '2026-10-21' };
  try {
    const raw = execFileSync('curl', ['-sS', '--max-time', '5', 'https://cbu.uz/uz/arkhiv-kursov-valyut/json/USD/'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    const row = JSON.parse(raw).find((r) => r.Ccy === 'USD');
    const v = Number(String(row.Rate).replace(',', '.')) / (Number(row.Nominal || 1) || 1);
    const d = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(row.Date);
    if (v > 5000 && v < 50000 && d) {
      const rate = { uzs_per_usd: Math.round(v * 100) / 100, date: `${d[3]}-${d[2]}-${d[1]}` };
      if (rate.uzs_per_usd !== last.uzs_per_usd || rate.date !== last.date) writeFileSync('content/rate.json', JSON.stringify(rate, null, 1) + '\n');
      return { ...rate, source: 'cbu' };
    }
  } catch { /* offline: the last good rate */ }
  return { ...last, source: 'fallback' };
}

function hashed(name, lang, obj) {
  const body = JSON.stringify(obj);
  const file = `${name}-${lang}-${createHash('sha256').update(body).digest('hex').slice(0, 10)}.json`;
  writeFileSync(`${OUT}/${file}`, body);
  return { file, url: `/assets/samurai/${file}`, bytes: body.length };
}

export function buildSamurai({ assets, page, t, plates, jaPhrases }) {
  const rate = cbuRate();
  const model = normalise(J('content/solutions.json'), J('content/solutions-extra.json'), J('content/pricing.json'));
  const meta = { _readme: 'Written by scripts/build.mjs (scripts/pages/samurai-build.mjs): the catalogue fingerprint and the last good CBU rate. Do not edit by hand.', catalogue_version: model.version, rate_fallback: { uzs_per_usd: rate.uzs_per_usd, date: rate.date }, built_at: rate.date };
  const metaPath = 'worker/gen/meta.json';
  const metaText = JSON.stringify(meta, null, 1) + '\n';
  if (!existsSync(metaPath) || readFileSync(metaPath, 'utf8') !== metaText) { mkdirSync(dirname(metaPath), { recursive: true }); writeFileSync(metaPath, metaText); }
  mkdirSync(OUT, { recursive: true });
  const samples = existsSync('content/samurai-samples.json') ? J('content/samurai-samples.json') : { samples: {} };
  // the solution pages exist once the catalogue gate has built them; until then sheets do not link to them
  const cataloguePages = existsSync(`public${pathOf('uz', 'yechimlar')}index.html`);
  const keep = new Set();
  const entries = [];
  const twins = samuraiTwins();
  for (const lang of LANGS) {
    const data = hashed('data', lang, compact(model, lang));
    const smp = hashed('samples', lang, { catalogue_version: samples.catalogue_version || '', list: samples.samples?.[lang] || [] });
    keep.add(data.file); keep.add(smp.file);
    const r = renderSamurai(lang, { model, rate, files: { data: data.url, samples: smp.url }, cataloguePages });
    const path = twins[lang];
    const html = plates(page({
      lang, slug: SLUG, path, twins, title: r.title, description: r.description, type: 'WebPage',
      crumbs: [{ name: t(lang, 'home'), path: HOME[lang] }, { name: r.crumb, path }],
      main: r.main, kanji: r.kanji, gloss: r.gloss, assets: { ...assets, js: assets.samurai || assets.js, css2: assets.samuraiCss },
      ldExtra: r.ldExtra, mainEntity: r.mainEntity,
    }));
    const out = lang === 'ja' ? jaPhrases(html) : html;
    const file = `public${path}index.html`;
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, out);
    entries.push({ lang, path, file, slug: SLUG, entry: 'samurai', data: data.url });
  }
  for (const f of readdirSync(OUT)) if (!keep.has(f)) unlinkSync(`${OUT}/${f}`);
  console.log(`samurai: ${LANGS.length} pages, catalogue ${model.version}, rate ${rate.uzs_per_usd} (${rate.date}, ${rate.source}), samples ${Object.values(samples.samples || {}).map((l) => l.length).join('/') || 0}`);
  return entries;
}
