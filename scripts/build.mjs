// npm run build: the whole site, in this order (§6.1).
//   1. lint-copy                 the copy rules (yarat-, product names, okina, Russian dashes, handles)
//   2. build-osh                 every drawing from the one generator; the dial; the no-JS placement CSS; the plates
//   3. boot + critical           src/boot/head.js, src/boot/boot.js and src/styles/critical.css, written as WHOLE
//                                <script data-gen> / <style data-gen> elements (never comment markers inside them)
//   4. app                       esbuild: src/main.js and src/styles/main.css, split ESM chunks, hashed, metafile
//   5. build-langs               /ru/ and /en/ from the Uzbek page; META, JSON-LD, hreflang, sitemap
//   6. fonts                     subsets from the BUILT pages; <style data-gen="fonts"> in every page
//   7. preload                   <!-- gen:preload --> per page: its fonts, app_css, app.js, the GL chunk and its imports
//   8. og                        share images and icons, only when the hero or the h1 changed
// Run: npm run build   (npm run watch rebuilds the app bundle on change)
import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { buildLangs } from './build-langs.mjs';
import { buildFonts } from './fonts.mjs';

const OUT = 'public/assets/build';
const watch = process.argv.includes('--watch');
const CINEMA = false; // the WebGL film ships from G1/G3; until then every visitor gets flow mode
const PAGES = { uz: 'public/index.html', ru: 'public/ru/index.html', en: 'public/en/index.html' };
const t0 = Date.now();
const node = (script, args = []) => execFileSync('node', [script, ...args], { stdio: 'inherit' });

// 1–2
node('scripts/lint-copy.mjs');
node('scripts/build-osh.mjs');

// 3
const iife = async (entry) => (await esbuild.build({
  entryPoints: [entry], bundle: true, minify: true, format: 'iife', write: false, target: ['es2020', 'safari15'],
  define: { __CINEMA__: String(CINEMA) }, legalComments: 'none', logLevel: 'warning',
})).outputFiles[0].text.trim();
const headJs = await iife('src/boot/head.js');
const bootJs = await iife('src/boot/boot.js');
const critical = (await esbuild.build({ entryPoints: ['src/styles/critical.css'], bundle: true, minify: true, write: false, target: ['chrome111', 'safari16.4'], logLevel: 'warning', external: ['/assets/*'] })).outputFiles[0].text.trim();
const safe = (s) => s.replace(/<\/(script|style)/gi, '<\\/$1');
let src = readFileSync(PAGES.uz, 'utf8');
src = src.replace(/<script data-gen="head">[\s\S]*?<\/script>/, () => `<script data-gen="head">${safe(headJs)}</script>`)
  .replace(/<script data-gen="boot">[\s\S]*?<\/script>/, () => `<script data-gen="boot">${safe(bootJs)}</script>`)
  .replace(/<style data-gen="critical">[\s\S]*?<\/style>/, () => `<style data-gen="critical">${safe(critical)}</style>`);
writeFileSync(PAGES.uz, src);

// 4
const options = {
  entryPoints: { app: 'src/main.js', app_css: 'src/styles/main.css' },
  bundle: true, minify: !watch, format: 'esm', splitting: true, metafile: true,
  outdir: OUT, entryNames: '[name]-[hash]', chunkNames: 'chunk-[hash]', assetNames: '[name]-[hash]',
  target: ['es2020', 'safari15'], loader: { '.glsl': 'text' }, legalComments: 'none', logLevel: 'warning',
  external: ['/assets/*'], define: { 'process.env.NODE_ENV': '"production"', __CINEMA__: String(CINEMA) },
};
if (watch) {
  const ctx = await esbuild.context({ ...options, plugins: [{ name: 'after', setup(b) { b.onEnd((r) => { if (!r.errors.length) finish(r.metafile); }); } }] });
  await ctx.watch();
  console.log('watching src/ ...');
} else {
  rmSync(OUT, { recursive: true, force: true });
  const r = await esbuild.build(options);
  await finish(r.metafile);
}

async function finish(meta) {
  const outs = Object.entries(meta.outputs);
  const pub = (f) => '/' + f.replace(/^public\//, '');
  const entry = (e, ext) => outs.find(([f, o]) => o.entryPoint === e && f.endsWith(ext))?.[0];
  const appJs = entry('src/main.js', '.js'), appCss = entry('src/styles/main.css', '.css');
  let html = readFileSync(PAGES.uz, 'utf8').replace(/\/assets\/build\/app-[\w]+\.js/g, pub(appJs));
  writeFileSync(PAGES.uz, html);

  // 5
  buildLangs();
  // 6
  const fonts = await buildFonts();
  // 7: the GL chunk is the output that imports src/gl/index.js dynamically; preload it and every chunk it imports
  const gl = outs.find(([, o]) => (o.imports || []).some((i) => i.kind === 'dynamic-import' && /gl\/index\.js/.test(i.original || '')));
  const glChunks = [];
  if (gl) {
    const dyn = gl[1].imports.find((i) => i.kind === 'dynamic-import' && /gl\/index\.js/.test(i.original || ''));
    const walk = (f) => { if (glChunks.includes(f)) return; glChunks.push(f); for (const i of meta.outputs[f]?.imports || []) if (i.kind === 'import-statement') walk(i.path); };
    walk(dyn.path);
  }
  const appImports = (meta.outputs[appJs].imports || []).filter((i) => i.kind === 'import-statement').map((i) => i.path);
  for (const [lang, file] of Object.entries(PAGES)) {
    const lines = [
      ...fonts.preload[lang].map((n) => `<link rel="preload" href="${fonts.files[n]}" as="font" type="font/woff2" crossorigin>`),
      `<link rel="preload" href="${pub(appCss)}" as="style">`,
      `<link rel="modulepreload" href="${pub(appJs)}">`,
      ...appImports.map((f) => `<link rel="modulepreload" href="${pub(f)}">`),
      ...glChunks.map((f) => `<link rel="modulepreload" href="${pub(f)}">`),
      `<link rel="stylesheet" href="${pub(appCss)}" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="${pub(appCss)}"></noscript>`,
    ];
    const h = readFileSync(file, 'utf8').replace(/<!-- gen:preload -->[\s\S]*?<!-- \/gen:preload -->/, () => `<!-- gen:preload -->\n${lines.join('\n')}\n<!-- /gen:preload -->`);
    writeFileSync(file, h);
  }
  // 8: share images, only when what they show changed
  const ogKey = createHash('sha256').update(readFileSync('src/styles/gen/osh.css')).update(readFileSync(PAGES.uz, 'utf8').match(/<h1[\s\S]*?<\/h1>/)[0]).update(readFileSync('scripts/og.mjs')).digest('hex').slice(0, 16);
  const ogStamp = '.cache/og.key';
  if (!existsSync(ogStamp) || readFileSync(ogStamp, 'utf8') !== ogKey || !existsSync('public/assets/img/og-uz.png')) {
    try { node('scripts/og.mjs'); writeFileSync(ogStamp, ogKey); } catch (e) { console.warn('og: skipped (' + e.message.split('\n')[0] + ')'); }
  }
  const kb = (n) => (n / 1024).toFixed(1) + ' KB';
  console.log(outs.map(([f, o]) => `${f.replace(OUT + '/', '')} ${kb(o.bytes)}`).join(', '));
  console.log(`built in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}
