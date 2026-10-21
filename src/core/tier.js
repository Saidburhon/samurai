// Quality tiers (§6.4), from capability only (never the user agent or the harness).
//   T3  hardware GPU, fine pointer, width >= 820: pixel ratio min(dpr, 2), MSAA, governor
//   T2  ANY software renderer (SwiftShader, llvmpipe, Software): no MSAA, no governor, the software resolution policy
//   T1  hardware GPU, coarse pointer or narrow: pixel ratio min(dpr, 1.5) (lowered for big blades), no MSAA, governor
//   T0  no WebGL2 (flow mode; decided by the head script)
// The software resolution policy (chosen at G1, ?sw=a|b overrides): A = 1.5x the device pixels always;
// B = 1.0x while moving and 2.0x inside a hold window. The buffer never exceeds 3.0 million pixels.
// G1 chose A: on the capture's stills A and B are indistinguishable at 2x (outlines, ridge, words), and A's hold frame
// costs about 60 % of B's (scripts/qa/poster-test.cjs, both options)
export const SW_DEFAULT = 'a';
const MAXPX = 3.0e6;

export function probeRenderer() {
  // the head script has already read it (boot/head.js) when it chose cinema mode
  const Q = window.__qilich;
  if (Q && typeof Q.glName === 'string') return { ok: true, name: Q.glName, software: /swiftshader|llvmpipe|software/i.test(Q.glName) };
  try {
    const c = document.createElement('canvas'); c.width = c.height = 1;
    const g = c.getContext('webgl2');
    if (!g) return { ok: false };
    const ext = g.getExtension('WEBGL_debug_renderer_info');
    const name = String(ext ? g.getParameter(ext.UNMASKED_RENDERER_WEBGL) : g.getParameter(g.RENDERER));
    const lose = g.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext();
    return { ok: true, name, software: /swiftshader|llvmpipe|software/i.test(name) };
  } catch (e) { return { ok: false }; }
}

export function chooseTier(q = new URLSearchParams(location.search)) {
  const forced = q.get('tier');
  const p = probeRenderer();
  let tier;
  if (forced && /^[0-3]$/.test(forced)) tier = +forced;
  else if (!p.ok) tier = 0;
  else if (p.software) tier = 2;
  else tier = matchMedia('(pointer: fine)').matches && innerWidth >= 820 ? 3 : 1;
  const sw = (q.get('sw') || SW_DEFAULT).toLowerCase() === 'a' ? 'a' : 'b';
  // anisotropic filtering: SwiftShader takes every tap in software, so a software renderer gets fewer
  const aniso = q.has('aniso') ? +q.get('aniso') : (tier === 2 ? 4 : 16);
  return { tier, renderer: p.name || '', software: !!p.software, sw, aniso };
}

// the three.js pixel ratio (drawing-buffer px per CSS px) for a tier, a viewport and the hold state
export function pixelRatio(t, w, h, atHold) {
  const dpr = window.devicePixelRatio || 1;
  let pr;
  if (t.tier === 3) pr = Math.min(dpr, 2);
  else if (t.tier === 2) pr = dpr * (t.sw === 'a' ? 1.5 : (atHold ? 2.0 : 1.0));
  else pr = Math.min(dpr, 1.5);
  const cap = Math.sqrt(MAXPX / Math.max(1, w * h));
  return Math.min(pr, cap);
}
