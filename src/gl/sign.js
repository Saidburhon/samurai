// The word atlas for the reflected sign (§2.2): 2048 × 256 per row, 6 rows, white on black, fitted to 86 % of the
// width. Rows 0–4: the service words of this page, read from the DOM's hidden .words (so every language page reflects
// its own words, with no JS strings), in GeologicaSign (Geologica wght 280 SHRP 100, a static instance: Canvas 2D
// cannot set SHRP). Row 5: 改善 in Zen Old Mincho 900, for Togi. Drawn once, after both faces have loaded.
import { CanvasTexture, LinearMipmapLinearFilter, LinearFilter, SRGBColorSpace } from 'three';

export async function wordAtlas(renderer) {
  try { await Promise.all([document.fonts.load('280 190px GeologicaSign'), document.fonts.load('900 190px "Zen Old Mincho"', '改善')]); } catch (e) { /* draw with what is there */ }
  const words = [...document.querySelectorAll('.words b')].map((b) => b.textContent.trim());
  const kz = (document.querySelector('#strings [data-k="sign.kaizen"]') || {}).textContent || '改善';
  const w = 2048, h = 256, rows = 6;
  const c = document.createElement('canvas'); c.width = w; c.height = h * rows;
  const x = c.getContext('2d', { willReadFrequently: true }); // a CPU canvas: uploaded without a GPU readback
  x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height);
  x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
  const fit = (word, face, max) => {
    let fs = max;
    x.font = `${face.replace('{}', fs)}`;
    while (x.measureText(word).width > w * 0.86 && fs > 40) { fs -= 4; x.font = face.replace('{}', fs); }
  };
  words.slice(0, 5).forEach((word, i) => {
    try { x.letterSpacing = '-4px'; } catch (e) { /* older canvas */ }
    fit(word, '280 {}px GeologicaSign, Geologica, sans-serif', 190);
    x.fillText(word, w / 2, h * i + h * 0.54);
  });
  try { x.letterSpacing = '0px'; } catch (e) { /* older canvas */ }
  fit(kz.trim(), '900 {}px "Zen Old Mincho", serif', 200);
  x.fillText(kz.trim(), w / 2, h * 5 + h * 0.52);
  const t = new CanvasTexture(c);
  t.flipY = false; t.colorSpace = SRGBColorSpace;
  t.generateMipmaps = true; t.minFilter = LinearMipmapLinearFilter; t.magFilter = LinearFilter;
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return t;
}
