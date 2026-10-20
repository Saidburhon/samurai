// Bundles src/ into public/assets/build/ with content-hashed names, points public/index.html at the new files,
// then builds the Russian and English pages (scripts/build-langs.mjs).
// Run: npm run build          (add --watch to rebuild the bundle on every change: npm run watch)
import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const OUT = 'public/assets/build';
const watch = process.argv.includes('--watch');

const options = {
  entryPoints: { app: 'src/main.js', app_css: 'src/styles/main.css' },
  bundle: true,
  minify: !watch,
  format: 'esm',
  splitting: true,          // three.js and the WebGL scene load as a separate chunk, after first paint
  outdir: OUT,
  entryNames: '[name]-[hash]',
  chunkNames: 'chunk-[hash]',
  assetNames: '[name]-[hash]',
  target: ['es2020', 'safari15'],
  loader: { '.glsl': 'text', '.woff2': 'file' },
  legalComments: 'none',
  metafile: true,
  logLevel: 'warning',
  plugins: [{
    name: 'point-html',
    setup(b) {
      b.onEnd(result => {
        if (result.errors.length) return;
        const outs = Object.entries(result.metafile.outputs);
        const find = (entry, ext) => outs.find(([f, o]) => o.entryPoint === entry && f.endsWith(ext))?.[0].replace(/^public/, '');
        const js = find('src/main.js', '.js'), css = find('src/styles/main.css', '.css');
        let html = readFileSync('public/index.html', 'utf8');
        html = html.replace(/\/assets\/build\/app-[\w]+\.js/g, js).replace(/\/assets\/build\/app_css-[\w]+\.css/g, css);
        writeFileSync('public/index.html', html);
        execFileSync('node', ['scripts/build-langs.mjs'], { stdio: 'inherit' });
        const kb = outs.filter(([f]) => !f.endsWith('.map')).map(([f, o]) => `${f.replace(OUT + '/', '')} ${(o.bytes / 1024).toFixed(1)} KB`);
        console.log(kb.join('\n'));
      });
    }
  }]
};

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  console.log('watching src/ ...');
} else {
  rmSync(OUT, { recursive: true, force: true });
  await esbuild.build(options);
}
