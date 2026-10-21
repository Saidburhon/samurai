// Sound (§5.7): synthesised Web Audio, no files, off until the visitor turns it on with the nav toggle. The context
// is created and resumed on that click (a user gesture); remembered as on, it still waits for the first gesture of
// the visit. It suspends when the page is hidden. Master chain: compressor -> a hard-knee limiter at -6 dBFS -> a
// -6 dB trim, so no recipe peaks above -12 dBFS.
const Q = window.__qilich || (window.__qilich = {});
let ctx = null, bus = null, noiseBuf = null, enabled = false;

function build() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try { ctx = new AC({ latencyHint: 'interactive' }); } catch (e) { return null; }
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18; comp.knee.value = 12; comp.ratio.value = 3; comp.attack.value = 0.003; comp.release.value = 0.25;
  const lim = ctx.createDynamicsCompressor();
  lim.threshold.value = -6; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = 0.001; lim.release.value = 0.08;
  const trim = ctx.createGain(); trim.gain.value = 0.5;
  comp.connect(lim); lim.connect(trim); trim.connect(ctx.destination);
  bus = comp;
  // one second of white noise, shared by every recipe
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const ch = noiseBuf.getChannelData(0);
  let seed = 7;
  for (let i = 0; i < ch.length; i++) { seed = (seed * 16807) % 2147483647; ch[i] = (seed / 2147483647) * 2 - 1; }
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend().catch(() => {}); else if (enabled) ctx.resume().catch(() => {});
  });
  return ctx;
}

// called from a user gesture
export function setAudio(on) {
  enabled = !!on;
  if (!on) { if (ctx) ctx.suspend().catch(() => {}); return; }
  if (!build()) return;
  ctx.resume().catch(() => {});
}
export const audioReady = () => !!(ctx && enabled && ctx.state === 'running');

function noise(t, dur, gainPeak, filt) {
  const src = ctx.createBufferSource(); src.buffer = noiseBuf;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gainPeak, t + 0.0015); g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
  let node = src;
  for (const f of filt || []) { node.connect(f); node = f; }
  node.connect(g); g.connect(bus);
  src.start(t, Math.random() * 0.8); src.stop(t + dur + 0.02);
  return { src, g };
}

const recipes = {
  // the blade ring: a free-free bar, partials 1 : 2.756 : 5.404 : 8.933 at 1180 Hz, each a ±0.6 Hz pair
  ring() {
    const t = ctx.currentTime + 0.005, f0 = 1180;
    const P = [[1, 2.4, 0.055], [2.756, 1.6, 0.030], [5.404, 0.9, 0.016], [8.933, 0.5, 0.009]];
    for (const [r, dec, a] of P) for (const dt of [-0.6, 0.6]) {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f0 * r + dt;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(a, t + 0.002); g.gain.exponentialRampToValueAtTime(1e-4, t + dec * 2.2);
      o.connect(g); g.connect(bus); o.start(t); o.stop(t + dec * 2.2 + 0.05);
    }
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 4200; bp.Q.value = 0.8;
    noise(t, 0.006, 0.08, [bp]);
  },
  // a soft paper cut: 120 ms of noise through a high-pass swept 1 -> 8 kHz, and the washi's fibres crackling
  cut() {
    const t = ctx.currentTime + 0.005;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.Q.value = 0.7;
    hp.frequency.setValueAtTime(1000, t); hp.frequency.exponentialRampToValueAtTime(8000, t + 0.12);
    noise(t, 0.12, 0.09, [hp]);
    const n = 10 + Math.floor(Math.random() * 10);
    for (let i = 0; i < n; i++) {
      const hp2 = ctx.createBiquadFilter(); hp2.type = 'highpass'; hp2.frequency.value = 2500 + Math.random() * 3000;
      noise(t + Math.random() * 0.12, 0.002 + Math.random() * 0.002, 0.05 + Math.random() * 0.05, [hp2]);
    }
  },
  // chin: high partials with a 60 ms decay and a 40 ms wooden knock (the toggle's own confirmation)
  chin() {
    const t = ctx.currentTime + 0.005;
    for (const [f, a] of [[3100, 0.03], [5600, 0.018], [8200, 0.01]]) {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(a, t + 0.001); g.gain.exponentialRampToValueAtTime(1e-4, t + 0.06 * 3);
      o.connect(g); g.connect(bus); o.start(t); o.stop(t + 0.2);
    }
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 300;
    noise(t, 0.04, 0.12, [lp]);
  },
};

export function sfx(name) {
  if (!enabled || !ctx || !recipes[name]) return;
  if (ctx.state !== 'running') { ctx.resume().then(() => { try { recipes[name](); } catch (e) { /* ignore */ } }).catch(() => {}); return; }
  try { recipes[name](); Q.lastSfx = name; } catch (e) { /* a sound never breaks the page */ }
}
