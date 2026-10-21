// Font subsets made from the BUILT pages (every string that can appear is in the HTML: text, aria-labels,
// data-copy, the generated dial; runtime strings live in #strings), so nothing can render as tofu.
//   Geologica (wght 200–600, SHRP)       latn for every page, cyrl for /ru/      the voice
//   Martian Mono (wght 300–500, wdth)    latn, cyrl                              annotations, clocks, the dial
//   Zen Old Mincho 500 and 900           the Japanese strings only               mei, labels, hakogaki
//   QOkina, QOkinaMono                   U+02BB from each family's own quoteleft (scripts/fonts/qokina.py)
//   GeologicaSign                        static wght 280 SHRP 100, the reflected words (scripts/fonts/sign-instance.py)
// plus metric-matched fallbacks (size-adjust, ascent/descent overrides) so a late font swaps without moving.
// Writes public/assets/fonts/<name>-<hash>.woff2 and the whole <style data-gen="fonts"> element of every page.
// The source fonts are fetched once into .cache/fonts (pinned by sha256); results are cached by a hash of the inputs.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { FONT_EXTRA } from '../worker/copy-rules.js';

const CACHE = '.cache/fonts', OUT = 'public/assets/fonts';
const GF = 'https://raw.githubusercontent.com/google/fonts/main/ofl';
export const SOURCES = {
  geologica: { file: 'Geologica[CRSV,SHRP,slnt,wght].ttf', url: `${GF}/geologica/Geologica%5BCRSV%2CSHRP%2Cslnt%2Cwght%5D.ttf`, sha: '9124d9e88ac6c11d761f35241713a51d68e2c4ebedce0edaca834717a00959ec' },
  martian: { file: 'MartianMono[wdth,wght].ttf', url: `${GF}/martianmono/MartianMono%5Bwdth%2Cwght%5D.ttf`, sha: 'c3467843ec1c2574b05fbcfd7147c7bfbcf63ddca8fc2bcb9d117f1bfb1b22e7' },
  mincho500: { file: 'ZenOldMincho-Medium.ttf', url: `${GF}/zenoldmincho/ZenOldMincho-Medium.ttf`, sha: 'e60c7961e5110d0f08f902de43fe60865f1538845ff2092c779837257efac3bf' },
  mincho900: { file: 'ZenOldMincho-Black.ttf', url: `${GF}/zenoldmincho/ZenOldMincho-Black.ttf`, sha: '84a80d8bca79d7d9478935045b216ed003ad40fdea5fd9116d524eb26e872cdc' },
};
const FALLBACK = { sans: '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf', mono: '/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf' };
const LIM = { geologica: { CRSV: 0, slnt: 0, wght: [200, 600], SHRP: [0, 100] }, martian: { wght: [300, 500] } };
const PAGES = { uz: 'public/index.html', ru: 'public/ru/index.html', en: 'public/en/index.html', ja: 'public/ja/index.html', 404: 'public/404.html' };
// the language names of the switch (scripts/site.mjs) on every page: their Cyrillic letters get a tiny Martian subset
// declared after the cyrl one, so a uz/en/ja page never downloads the whole Cyrillic subset for «Русский»
const NAMES_CYR = 'Русский';

const sha = (buf) => createHash('sha256').update(buf).digest('hex');

async function ensureSources() {
  mkdirSync(CACHE, { recursive: true });
  for (const s of Object.values(SOURCES)) {
    const p = join(CACHE, s.file);
    if (!existsSync(p)) execFileSync('curl', ['-sSfL', '-o', p, s.url], { stdio: 'inherit' }); // curl honours the proxy settings
    const h = sha(readFileSync(p));
    if (h !== s.sha) throw new Error(`fonts: ${s.file} changed upstream (sha ${h.slice(0, 12)}); check it and update SOURCES`);
    s.path = p;
  }
}

const ENT = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#39': "'" };
const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) => (e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : +e.slice(1)) : ENT[e] ?? m));
export function pageText(html) {
  const h = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<head>[\s\S]*?<\/head>/, (m) => (m.match(/<title[^>]*>[^<]*<\/title>/) || [''])[0]);
  let t = '';
  for (const m of h.matchAll(/>([^<]+)</g)) t += m[1];
  for (const m of h.matchAll(/\s(?:aria-label|data-copy|title|alt|placeholder)="([^"]*)"/g)) t += m[1];
  // the words a page's script shows (SamurAI: <script type="application/json">): every string value in them
  for (const m of html.matchAll(/<script type="application\/json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { const walk = (v) => (typeof v === 'string' ? v : Array.isArray(v) ? v.map(walk).join(' ') : v && typeof v === 'object' ? Object.values(v).map(walk).join(' ') : ''); t += ' ' + walk(JSON.parse(m[1])); } catch { /* not JSON */ }
  }
  return decode(t);
}
const JP = (c) => (c >= 0x3000 && c <= 0x30ff) || (c >= 0x3400 && c <= 0x9fff) || (c >= 0xf900 && c <= 0xfaff) || (c >= 0xff00 && c <= 0xffef);
const CYR = (c) => c >= 0x0400 && c <= 0x052f;
function ranges(set) {
  const cps = [...set].map((c) => c.codePointAt(0)).sort((a, b) => a - b), out = [];
  for (let i = 0; i < cps.length; i++) {
    let j = i; while (j + 1 < cps.length && cps[j + 1] === cps[j] + 1) j++;
    out.push(i === j ? `U+${cps[i].toString(16).toUpperCase()}` : `U+${cps[i].toString(16).toUpperCase()}-${cps[j].toString(16).toUpperCase()}`); i = j;
  }
  return out.join(',');
}

// extra: the generated pages (scripts/build-pages.mjs), [{ lang, file }]
export async function buildFonts(extra = []) {
  await ensureSources();
  const files = { ...PAGES };
  for (const e of extra) files[e.file] = e.file;
  const html = Object.fromEntries(Object.entries(files).filter(([, f]) => existsSync(f)).map(([k, f]) => [k, readFileSync(f, 'utf8')]));
  // Japanese pages are set in the system Japanese gothic; Zen Old Mincho is subset only to the Japanese elements,
  // which every other page carries too (mei, hakogaki, part labels, 日本語 in the switch)
  const isJa = Object.fromEntries(Object.entries(html).map(([k, h]) => [k, /<html lang="ja"/.test(h)]));
  const text = Object.fromEntries(Object.entries(html).map(([k, h]) => [k, pageText(h)]));
  // plus every glyph SamurAI's copy guard lets a model string keep (worker/copy-rules.js), so its answers never fall back
  const always = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('') + ' ·—–’“”«»…' + FONT_EXTRA;
  // text-transform makes capitals (and lowercase) the HTML never contains: every character comes with its other
  // case, and the whole Russian alphabet ships in the cyrl subsets, so no UI label can fall back to a platform face
  const ruAlphabet = String.fromCodePoint(0x401, 0x451, ...Array.from({ length: 64 }, (_, i) => 0x410 + i));
  const lat = new Set(), cyr = new Set(), jp = new Set();
  const add = (str, ja) => {
    for (const ch0 of str) {
      for (const ch of new Set([ch0, ...ch0.toUpperCase(), ...ch0.toLowerCase()])) {
        const c = ch.codePointAt(0);
        if (c < 32 || c === 0x2bb || (c >= 0xfe00 && c <= 0xfe0f)) continue;
        if (JP(c) && ja) continue;
        (JP(c) ? jp : CYR(c) ? cyr : lat).add(ch);
      }
    }
  };
  for (const [k, t] of Object.entries(text)) add(t, isJa[k]);
  add(always + ruAlphabet, false);
  // the reflected words, for GeologicaSign
  const words = new Set();
  for (const h of Object.values(html)) for (const m of h.matchAll(/<p class="words"[^>]*>([\s\S]*?)<\/p>/g)) for (const w of m[1].matchAll(/>([^<]+)</g)) for (const ch of decode(w[1])) words.add(ch);
  const sample = text.uz.replace(/\s+/g, ' ').replace(/[^\x20-\x7e -ɏ]/g, '');
  const S = SOURCES, L = [...lat].join(''), C = [...cyr].join(''), J = [...jp].join('');
  const jobs = [
    { name: 'geologica-latn', kind: 'subset', src: S.geologica.path, text: L, limits: LIM.geologica },
    { name: 'geologica-cyrl', kind: 'subset', src: S.geologica.path, text: C, limits: LIM.geologica },
    { name: 'martian-latn', kind: 'subset', src: S.martian.path, text: L, limits: LIM.martian },
    { name: 'martian-cyrl', kind: 'subset', src: S.martian.path, text: C, limits: LIM.martian },
    { name: 'martian-names', kind: 'subset', src: S.martian.path, text: NAMES_CYR, limits: LIM.martian },
    { name: 'mincho-500', kind: 'subset', src: S.mincho500.path, text: J },
    { name: 'mincho-900', kind: 'subset', src: S.mincho900.path, text: J },
    { name: 'qokina', kind: 'qokina', src: S.geologica.path, family: 'QOkina', limits: LIM.geologica },
    { name: 'qokina-mono', kind: 'qokina', src: S.martian.path, family: 'QOkinaMono', limits: LIM.martian },
    { name: 'geologica-sign', kind: 'sign', src: S.geologica.path, text: [...words].join(''), location: { wght: 280, SHRP: 100, CRSV: 0, slnt: 0 }, family: 'GeologicaSign' },
  ];
  const metricJobs = existsSync(FALLBACK.sans) && existsSync(FALLBACK.mono) ? [
    { name: 'm-sans', kind: 'metrics', src: S.geologica.path, fallback: FALLBACK.sans, location: { wght: 380, SHRP: 30, CRSV: 0, slnt: 0 }, text: sample },
    { name: 'm-mono', kind: 'metrics', src: S.martian.path, fallback: FALLBACK.mono, location: { wght: 400, wdth: 87.5 }, text: sample },
  ] : [];
  const key = sha(JSON.stringify({ jobs: jobs.map(({ src, ...j }) => j), m: metricJobs.map(({ src, fallback, ...j }) => j), py: readFileSync('scripts/fonts/jobs.py', 'utf8'), s: Object.values(S).map((s) => s.sha) }));
  const manPath = join(CACHE, 'manifest.json');
  let man = existsSync(manPath) ? JSON.parse(readFileSync(manPath, 'utf8')) : {};
  const have = man.key === key && Object.values(man.files || {}).every((f) => existsSync(join(OUT, f)));
  if (!have) {
    const tmp = join(tmpdir(), `qilich-fonts-${process.pid}`);
    mkdirSync(tmp, { recursive: true });
    const run = [...jobs.map((j) => ({ ...j, out: join(tmp, j.name + '.woff2') })), ...metricJobs];
    writeFileSync(join(tmp, 'jobs.json'), JSON.stringify(run));
    const res = JSON.parse(execFileSync('python3', ['scripts/fonts/jobs.py', join(tmp, 'jobs.json')], { encoding: 'utf8', maxBuffer: 1 << 24 }));
    mkdirSync(OUT, { recursive: true });
    const files = {};
    for (const j of jobs) {
      const buf = readFileSync(join(tmp, j.name + '.woff2'));
      files[j.name] = `${j.name}-${sha(buf).slice(0, 10)}.woff2`;
      copyFileSync(join(tmp, j.name + '.woff2'), join(OUT, files[j.name]));
    }
    const metrics = {};
    metricJobs.forEach((j, i) => { metrics[j.name] = res[jobs.length + i]; });
    man = { key, files, metrics: Object.keys(metrics).length ? metrics : man.metrics, sizes: Object.fromEntries(Object.entries(files).map(([k, f]) => [k, readFileSync(join(OUT, f)).length])) };
    writeFileSync(manPath, JSON.stringify(man, null, 1));
  }
  for (const f of readdirSync(OUT)) if (!Object.values(man.files).includes(f)) unlinkSync(join(OUT, f));

  const U = (n) => `/assets/fonts/${man.files[n]}`;
  const ms = man.metrics?.['m-sans'] || { sizeAdjust: 100, ascent: 90, descent: 22, lineGap: 0 };
  const mm = man.metrics?.['m-mono'] || { sizeAdjust: 100, ascent: 80, descent: 20, lineGap: 0 };
  const fb = (fam, m, locals) => `@font-face{font-family:'${fam}';src:${locals.map((l) => `local('${l}')`).join(',')};size-adjust:${m.sizeAdjust}%;ascent-override:${m.ascent}%;descent-override:${m.descent}%;line-gap-override:${m.lineGap}%}`;
  const css = [
    `@font-face{font-family:QOkina;src:url(${U('qokina')}) format('woff2');font-weight:200 600;font-display:swap;unicode-range:U+2BB}`,
    `@font-face{font-family:QOkinaMono;src:url(${U('qokina-mono')}) format('woff2');font-weight:300 500;font-stretch:75% 112.5%;font-display:swap;unicode-range:U+2BB}`,
    `@font-face{font-family:Geologica;src:url(${U('geologica-latn')}) format('woff2');font-weight:200 600;font-display:swap;unicode-range:${ranges(lat)}}`,
    `@font-face{font-family:Geologica;src:url(${U('geologica-cyrl')}) format('woff2');font-weight:200 600;font-display:swap;unicode-range:${ranges(cyr)}}`,
    `@font-face{font-family:'Martian Mono';src:url(${U('martian-latn')}) format('woff2');font-weight:300 500;font-stretch:75% 112.5%;font-display:swap;unicode-range:${ranges(lat)}}`,
    `@font-face{font-family:'Martian Mono';src:url(${U('martian-cyrl')}) format('woff2');font-weight:300 500;font-stretch:75% 112.5%;font-display:swap;unicode-range:${ranges(cyr)}}`,
    `@font-face{font-family:'Martian Mono';src:url(${U('martian-names')}) format('woff2');font-weight:300 500;font-stretch:75% 112.5%;font-display:swap;unicode-range:${ranges(new Set(NAMES_CYR))}}`,
    `@font-face{font-family:'Zen Old Mincho';src:url(${U('mincho-500')}) format('woff2');font-weight:500;font-display:block;unicode-range:${ranges(jp)}}`,
    `@font-face{font-family:'Zen Old Mincho';src:url(${U('mincho-900')}) format('woff2');font-weight:900;font-display:block;unicode-range:${ranges(jp)}}`,
    `@font-face{font-family:GeologicaSign;src:url(${U('geologica-sign')}) format('woff2');font-weight:280;font-display:block}`,
    fb('Geologica Fallback', ms, ['Arial', 'Liberation Sans', 'Helvetica Neue', 'Helvetica']),
    fb('Martian Fallback', mm, ['Courier New', 'Liberation Mono', 'Menlo']),
  ].join('');
  // the generated pages swap every face (SEO-GEO-GUIDELINES: font-display swap): their decorative kanji (Mincho) and
  // the sign face are not preloaded there, so `block` would hide them for up to 3 s. The landing keeps its own choice
  // (its Mincho is preloaded, scripts/build.mjs step 7).
  const LANDING = new Set(['public/index.html', 'public/ru/index.html', 'public/en/index.html', 'public/ja/index.html']);
  const cssPages = css.replace(/font-display:block/g, 'font-display:swap');
  for (const [k, f] of Object.entries(files)) {
    if (!html[k]) continue;
    const out = readFileSync(f, 'utf8').replace(/<style data-gen="fonts">[\s\S]*?<\/style>/, `<style data-gen="fonts">${LANDING.has(String(f).replace(/^\.\//, '')) ? css : cssPages}</style>`);
    writeFileSync(f, out);
  }
  // what each page needs for its first paint (the preload pass uses this)
  const preload = {
    uz: ['geologica-latn', 'qokina', 'martian-latn', 'mincho-500'],
    en: ['geologica-latn', 'martian-latn', 'mincho-500'],
    ru: ['geologica-latn', 'geologica-cyrl', 'martian-latn', 'martian-cyrl', 'mincho-500'],
    ja: ['geologica-latn', 'martian-latn', 'mincho-500'],
  };
  // the generated pages: their text faces only (the hakogaki's Mincho is not needed for the first paint)
  const pagePreload = {
    uz: ['geologica-latn', 'qokina', 'martian-latn'],
    ru: ['geologica-latn', 'geologica-cyrl', 'martian-latn', 'martian-cyrl'],
    en: ['geologica-latn', 'martian-latn'],
    ja: ['geologica-latn', 'martian-latn'],
  };
  const kb = (n) => (n / 1024).toFixed(1);
  console.log(`fonts: ${have ? 'cached' : 'built'}; ${Object.entries(man.sizes).map(([k, v]) => `${k} ${kb(v)} KB`).join(', ')}`);
  return { files: Object.fromEntries(Object.entries(man.files).map(([k, f]) => [k, `/assets/fonts/${f}`])), preload, pagePreload, css };
}

if (import.meta.url === `file://${process.argv[1]}`) await buildFonts();
