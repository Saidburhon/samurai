/* Qilich — sound. Every sound is synthesised in the browser on first use, so no audio files ship.
   Sounds play only for real clicks and drags, never for scrolling or scripted demos.
   On by default; the choice is remembered. */
(() => {
  'use strict';

  const KEY = 'qilich-sound';
  const store = {
    get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* private mode */ } }
  };
  const AC = window.AudioContext || window.webkitAudioContext;
  let on = store.get() !== '0';
  let ctx = null, out = null;
  const buf = {};
  const last = {};

  // the in (miyako-bushi) scale on E: the koto's pentatonic
  const NOTES = [329.63, 349.23, 440, 493.88, 523.25, 659.25, 698.46, 880, 987.77, 1046.5];

  function make(dur, fill) {
    const sr = ctx.sampleRate, n = Math.floor(sr * dur);
    const b = ctx.createBuffer(1, n, sr);
    const d = b.getChannelData(0);
    fill(d, sr, n);
    let peak = 0;
    for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(d[i]));
    if (peak > 0) for (let i = 0; i < n; i++) d[i] /= peak;
    return b;
  }
  const TAU = Math.PI * 2;

  const SYNTH = {
    // a blade leaving the scabbard: a breathy rush, then ringing steel that glides up a little
    shing: () => make(1.3, (d, sr, n) => {
      const parts = [[1870, 1, 3.2], [2950, .7, 4], [4410, .55, 5.2], [6270, .35, 6.5], [8650, .2, 8]];
      let lp = 0;
      for (let i = 0; i < n; i++) {
        const t = i / sr;
        const att = Math.min(1, t / .012);
        let s = 0;
        for (const [f, a, k] of parts) s += a * Math.sin(TAU * f * t * (1 + .018 * t)) * Math.exp(-k * t);
        const noise = Math.random() * 2 - 1;
        lp += (noise - lp) * .55;
        const rush = (noise - lp) * Math.exp(-t * 26) * .9;
        d[i] = (s * .55 * att) + rush;
      }
    }),
    // a wood block, for the pool tables
    knock: () => make(.22, (d, sr, n) => {
      for (let i = 0; i < n; i++) {
        const t = i / sr;
        d[i] = Math.sin(TAU * 820 * t) * Math.exp(-t * 38) + .55 * Math.sin(TAU * 1530 * t) * Math.exp(-t * 60)
          + (t < .004 ? (Math.random() * 2 - 1) * (1 - t / .004) * .7 : 0);
      }
    }),
    // a soft taiko thunk
    thunk: () => make(.55, (d, sr, n) => {
      let lp = 0;
      for (let i = 0; i < n; i++) {
        const t = i / sr;
        const f = 58 + 60 * Math.exp(-t * 18);
        const noise = Math.random() * 2 - 1;
        lp += (noise - lp) * .08;
        d[i] = Math.sin(TAU * f * t) * Math.exp(-t * 7) + lp * Math.exp(-t * 28) * 1.6;
      }
    }),
    // a temple bell (rin)
    rin: () => make(2.4, (d, sr, n) => {
      const parts = [[1, 1, 1.4], [2.76, .5, 2.4], [5.4, .25, 3.6], [8.93, .12, 5]];
      for (let i = 0; i < n; i++) {
        const t = i / sr;
        let s = 0;
        for (const [r, a, k] of parts) s += a * Math.sin(TAU * 1046.5 * r * t) * Math.exp(-k * t);
        d[i] = s * Math.min(1, t / .003);
      }
    }),
    // the dial and clock scrubbing
    tick: () => make(.04, (d, sr, n) => {
      for (let i = 0; i < n; i++) {
        const t = i / sr;
        d[i] = Math.sin(TAU * 2600 * t) * Math.exp(-t * 260) + (Math.random() * 2 - 1) * Math.exp(-t * 900) * .4;
      }
    }),
    // a thermal printer
    print: () => make(.5, (d, sr, n) => {
      let lp = 0;
      for (let i = 0; i < n; i++) {
        const t = i / sr;
        const noise = Math.random() * 2 - 1;
        lp += (noise - lp) * .35;
        const step = .5 + .5 * Math.sign(Math.sin(TAU * 32 * t));
        d[i] = (noise - lp) * step * Math.min(1, t / .01) * Math.min(1, (.5 - t) / .05);
      }
    }),
    // a Telegram message arriving
    ding: () => make(.5, (d, sr, n) => {
      for (let i = 0; i < n; i++) {
        const t = i / sr;
        const a = Math.sin(TAU * 1318.5 * t) * Math.exp(-t * 9);
        const b = t > .07 ? Math.sin(TAU * 1760 * (t - .07)) * Math.exp(-(t - .07) * 7) : 0;
        d[i] = (a + b) * Math.min(1, t / .002);
      }
    })
  };

  // a plucked koto string (Karplus–Strong)
  function koto(f) {
    return make(1.6, (d, sr, n) => {
      const N = Math.round(sr / f);
      const ring = new Float32Array(N);
      for (let i = 0; i < N; i++) ring[i] = Math.random() * 2 - 1;
      let p = 0, prev = 0;
      for (let i = 0; i < n; i++) {
        const cur = ring[p];
        const next = ring[(p + 1) % N];
        ring[p] = .996 * .5 * (cur + next);
        d[i] = cur * .7 + prev * .3;
        prev = cur;
        p = (p + 1) % N;
      }
    });
  }

  function ensure() {
    if (!AC) return false;
    if (!ctx) {
      ctx = new AC();
      out = ctx.createGain();
      out.gain.value = .5;
      const comp = ctx.createDynamicsCompressor();
      out.connect(comp);
      comp.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return true;
  }

  function get(name) {
    if (buf[name]) return buf[name];
    if (name.startsWith('koto')) buf[name] = koto(NOTES[Number(name.slice(4))] || NOTES[0]);
    else if (SYNTH[name]) buf[name] = SYNTH[name]();
    return buf[name];
  }

  /* play('shing'), play('koto3'), play('tick', { rate: 1.2, gain: .4 }) */
  function play(name, opt = {}) {
    if (!on || !ensure()) return;
    const now = performance.now();
    if (now - (last[name] || 0) < 35) return;   // the same sound twice in 35ms is one sound
    last[name] = now;
    const b = get(name);
    if (!b) return;
    const src = ctx.createBufferSource();
    src.buffer = b;
    src.playbackRate.value = (opt.rate || 1) * (1 + (Math.random() * 2 - 1) * .025);
    const g = ctx.createGain();
    g.gain.value = opt.gain == null ? 1 : opt.gain;
    src.connect(g);
    g.connect(out);
    src.start(ctx.currentTime + (opt.delay || 0));
  }
  // a rising chord on the koto, for headline clicks
  function chord(base = 2) {
    [0, 2, 4].forEach((s, i) => play('koto' + Math.min(NOTES.length - 1, base + s), { delay: i * .065, gain: .7 }));
  }
  const buzz = ms => { if (navigator.vibrate) try { navigator.vibrate(ms); } catch (e) { /* not allowed */ } };

  // the audio context may only start inside a real gesture; build the common sounds then
  addEventListener('pointerdown', function warm(e) {
    if (!e.isTrusted || !ensure()) return;
    ['shing', 'knock', 'tick', 'koto2', 'koto4', 'koto6'].forEach(get);
    removeEventListener('pointerdown', warm, true);
  }, true);

  function paint() {
    document.querySelectorAll('[data-sound]').forEach(b => b.setAttribute('aria-pressed', String(on)));
  }
  document.addEventListener('DOMContentLoaded', () => {
    paint();
    document.querySelectorAll('[data-sound]').forEach(b => b.addEventListener('click', () => {
      on = !on;
      store.set(on ? '1' : '0');
      paint();
      if (on) play('rin', { gain: .6 });
    }));
  });

  window.QSFX = { play, chord, buzz, get on() { return on; } };
})();
