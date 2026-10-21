// The stipple's canvas (canvas#stip), shown through an ImageBitmapRenderingContext: the compositor takes each update
// as one texture upload, where a 2D canvas is re-rasterised as an image into the page's tiles at every change (on a
// software renderer about 0.1 s of the GPU process per stipple batch, measured at G1: the intro's 12 batches kept it
// busy past the GL gate). The dots are drawn into a CPU buffer canvas and presented by a copy. Without
// OffscreenCanvas the canvas is a plain CPU 2D canvas, as before. Shared by the boot script and fx/ink.js.
export function stipSurface(cv) {
  if (cv.__stip) return cv.__stip;
  let bm = null;
  try { if (typeof OffscreenCanvas === 'function' && 'transferToImageBitmap' in OffscreenCanvas.prototype) bm = cv.getContext('bitmaprenderer'); } catch (e) { bm = null; }
  const buf = bm ? document.createElement('canvas') : cv;
  const s = {
    // a CPU canvas (willReadFrequently): drawing 9000 dots stays on the main thread, never in the GPU process
    ctx: buf.getContext('2d', { willReadFrequently: true }),
    size(w, h) { buf.width = w; buf.height = h; if (bm) { cv.width = w; cv.height = h; } },
    present() {
      if (!bm || !buf.width || !buf.height) return;
      const off = new OffscreenCanvas(buf.width, buf.height);
      off.getContext('2d', { willReadFrequently: true }).drawImage(buf, 0, 0);
      bm.transferFromImageBitmap(off.transferToImageBitmap());
    },
  };
  cv.__stip = s;
  return s;
}
