// The bakes on the CPU, in a worker (G1 r2). The noise of glsl/bake.frag.glsl, line for line in JS: the hero's
// textures (hamon, silk, hada) are computed off the main thread and off the GPU process from the moment the GL
// chunk arrives, so the GL boot (links, pipelines, the first frame) never queues behind a bake in the GPU process,
// and glReady can carry the real textures (§4.1: no stand-in is ever on screen). The same functions make the
// full-size hada and the ishime later, in idle time, so every size of a texture is one field (no visible swap).
// The worker is made from this function's own source (a Blob URL): it may use nothing from outside its body.
function bakeWorker() {
  const fract = (x) => x - Math.floor(x);
  const mix = (a, b, t) => a + (b - a) * t;
  const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
  const smoothstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const hash11 = (n) => fract(Math.sin(n * 12.9898) * 43758.5453);
  const noise1 = (x) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return mix(hash11(i), hash11(i + 1), u); };
  const fbm1 = (x) => { let a = 0.5, s = 0; for (let i = 0; i < 4; i++) { s += a * noise1(x); x = x * 2.03 + 17.1; a *= 0.5; } return s / 0.9375; };
  const hash12 = (x, y) => {
    let a = fract(x * 0.1031), b = fract(y * 0.1031), c = a;
    const d = a * (b + 33.33) + b * (c + 33.33) + c * (a + 33.33);
    a += d; b += d; c += d;
    return fract((a + b) * c);
  };
  // hash32(p).xy
  const H32 = [0, 0];
  const hash32 = (x, y) => {
    let a = fract(x * 0.1031), b = fract(y * 0.1030), c = fract(x * 0.0973);
    const d = a * (b + 33.33) + b * (a + 33.33) + c * (c + 33.33);
    a += d; b += d; c += d;
    H32[0] = fract((a + b) * c); H32[1] = fract((a + c) * b);
    return H32;
  };
  const vnoise = (x, y) => {
    const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    const a = hash12(ix, iy), b = hash12(ix + 1, iy), c = hash12(ix, iy + 1), d = hash12(ix + 1, iy + 1);
    return mix(mix(a, b, ux), mix(c, d, ux), uy);
  };
  const fbm2 = (x, y) => { let a = 0.5, s = 0; for (let i = 0; i < 5; i++) { s += a * vnoise(x, y); x = x * 2.02 + 13.1; y = y * 2.02 + 7.7; a *= 0.5; } return s / 0.96875; };

  // blade UV: u in [-0.05, 1], v in [0, 1]. r = hada (+.5), g = mist, b = suna, a = ashi
  const hada = (o, k, s, t) => {
    const u = mix(-0.05, 1.0, s), v = t;
    const g1 = fbm2(u * 160, v * 7);
    const g2 = fbm2(u * 520 + 3.1, v * 22 + 3.1);
    o[k] = clamp((g1 - 0.5) * 0.75 + (g2 - 0.5) * 0.35 + 0.5, 0, 1);
    o[k + 1] = fbm2(u * 60, v * 14);
    o[k + 2] = fbm2(u * 240, v * 5);
  };
  const hamon = (o, k, s) => {
    const u = clamp(mix(-0.05, 1.0, s), 0, 1), T = 6.283185;
    let n = 0.70 + 0.040 * Math.sin(T * 5.3 * u + 0.8) + 0.022 * Math.sin(T * 13.1 * u + 2.3) + 0.018 * (fbm1(u * 38.0) - 0.5)
      + 0.030 * Math.pow(Math.max(0, Math.sin(T * 9.0 * u + 1.1)), 6.0);
    n = mix(0.80, n, smoothstep(0.0, 0.06, u));
    o[k] = mix(n, 0.25, smoothstep(0.975, 1.0, u)); o[k + 1] = 0; o[k + 2] = 0; o[k + 3] = 1;
  };
  // atlas abr: colour fields with feathered, cloud-like boundaries (ai, ishkor, cream, anor, cream, ishkor)
  const C = [[0.022, 0.030, 0.085], [0.035, 0.25, 0.29], [0.66, 0.58, 0.44], [0.30, 0.035, 0.05], [0.66, 0.58, 0.44], [0.035, 0.25, 0.29]];
  const W = [[0.35, 0.40, 0.46, 0.51], [0.46, 0.51, 0.515, 0.565], [0.515, 0.565, 0.595, 0.645], [0.595, 0.645, 0.64, 0.69], [0.64, 0.69, 0.72, 0.78]];
  const ikat = (o, along, across, ribbon) => {
    const j = (fbm1(across * 1.15 + along * 0.7 + ribbon * 5.1) - 0.5) * 0.22 + (fbm1(across * 7 + along * 4 + ribbon) - 0.5) * 0.035;
    const p = fract(along * 0.42 + ribbon * 0.29 + j);
    let r = C[0][0], g = C[0][1], b = C[0][2];
    for (let i = 0; i < 5; i++) {
      const w = W[i], m = smoothstep(w[0], w[1], p) * (1 - smoothstep(w[2], w[3], p)), c = C[i + 1];
      r = mix(r, c[0], m); g = mix(g, c[1], m); b = mix(b, c[2], m);
    }
    o[0] = r; o[1] = g; o[2] = b;
  };
  const IK = [0, 0, 0], SA = [0.86, 0.82, 0.72], MEN = [0.80, 0.60, 0.30];
  const silk = (o, k, t, ph, masks, D) => {
    const X = t * D, Y = ph * 2 + 0.25;
    const A = X + Y, Bc = X - Y;
    const ca = fract(A + 0.5) - 0.5, cb = fract(Bc + 0.5) - 0.5;
    const hw = 0.31;
    const inA = 1 - smoothstep(hw - 0.015, hw + 0.015, Math.abs(ca));
    const inB = 1 - smoothstep(hw - 0.015, hw + 0.015, Math.abs(cb));
    const crs = (((Math.floor(A + 0.5) + Math.floor(Bc + 0.5)) % 2) + 2) % 2;
    const topA = crs < 0.5 ? 1 : 0;
    const showA = inA * (topA > 0.5 ? 1 : 1 - inB);
    const showB = inB * (topA > 0.5 ? 1 - inA : 1);
    const ribbon = Math.max(showA, showB);
    if (masks) {
      const mt = (t - 0.52) * D, mp = (ph - 0.25) * 2;
      const menR = Math.hypot(mt, mp * 3.2);
      o[k] = ribbon; o[k + 1] = (1 - smoothstep(0.40, 0.46, menR)) * (1 - ribbon); o[k + 2] = 0; o[k + 3] = 1;
      return;
    }
    const acr = showA > showB ? ca / hw : cb / hw;
    const alongC = showA > showB ? Bc : A;
    const rid = showA > showB ? Math.floor(A + 0.5) : Math.floor(Bc + 0.5) + 7;
    const edgeShade = 1 - 0.45 * Math.pow(Math.abs(acr), 3);
    const under = (showA > 0.5 && inB > 0.5 && topA < 0.5) || (showB > 0.5 && inA > 0.5 && topA > 0.5) ? 1 : 0;
    const weave = Math.sin(alongC * 180) * 0.5 + 0.5;
    ikat(IK, alongC, acr, rid);
    // ray skin (samegawa) in the windows: lacquered white nodules
    const spx = t * D * 14, spy = ph * 30;
    const cix = Math.floor(spx), ciy = Math.floor(spy), cfx = spx - cix, cfy = spy - ciy;
    let md = 1;
    for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
      const h = hash32(cix + i, ciy + j);
      const rx = i + h[0] * 0.8 + 0.1 - cfx, ry = j + h[1] * 0.8 + 0.1 - cfy;
      md = Math.min(md, rx * rx + ry * ry);
    }
    const nod = 1 - smoothstep(0.05, 0.30, md);
    const dwin = Math.min(Math.abs(ca), Math.abs(cb)) - hw;
    const ao = smoothstep(0, 0.14, dwin);
    const sk = (0.78 + 0.22 * nod) * (0.45 + 0.55 * ao);
    const mt = (t - 0.52) * D, mp = (ph - 0.25) * 2;
    const menR = Math.hypot(mt, mp * 3.2);
    const menuki = (1 - smoothstep(0.40, 0.46, menR)) * (1 - ribbon);
    let h = ribbon * (1 - acr * acr) * 0.9 + weave * 0.06 * ribbon + (1 - ribbon) * nod * 0.35;
    const ang = Math.atan2(mp * 3.2, mt);
    const petals = 0.5 + 0.5 * Math.cos(ang * 5);
    h += menuki * (0.6 + 0.4 * petals) * (1 - menR * 1.6);
    const sh = edgeShade * (under > 0.5 ? 0.55 : 1);
    for (let c = 0; c < 3; c++) o[k + c] = mix(mix(SA[c] * sk, IK[c] * sh, ribbon), MEN[c], menuki);
    o[k + 3] = clamp(h, 0, 1);
  };
  // the tsuba face, [-0.41, 0.41]^2: rg = the height gradient (normal map), b = the coarse variation, a = the height
  const ish = (x, y) => fbm2(x * 90, y * 90) * 0.8 + vnoise(x * 420, y * 420) * 0.5;
  const ishime = (o, k, s, t, N) => {
    const px = (s - 0.5) * 0.82, py = (t - 0.5) * 0.82, e = 0.82 / N;
    const hx = ish(px + e, py) - ish(px - e, py), hy = ish(px, py + e) - ish(px, py - e);
    o[k] = clamp((hx / (2 * e)) * 0.0012 * 0.5 + 0.5, 0, 1);
    o[k + 1] = clamp((hy / (2 * e)) * 0.0012 * 0.5 + 0.5, 0, 1);
    o[k + 2] = fbm2(px * 90, py * 90);
    o[k + 3] = clamp(vnoise(px * 420, py * 420), 0, 1);
  };

  // float -> half (round to nearest), for RGBA16F uploads
  const f32 = new Float32Array(1), u32 = new Uint32Array(f32.buffer);
  const toHalf = (v) => {
    f32[0] = v; const x = u32[0];
    const s = (x >>> 16) & 0x8000; let e = ((x >>> 23) & 0xff) - 127 + 15; let m = x & 0x7fffff;
    if (e <= 0) { if (e < -10) return s; m = (m | 0x800000) >> (1 - e); return s | ((m + 0x1000) >> 13); }
    if (e >= 31) return s | 0x7c00;
    const r = s | (e << 10) | (m >> 13);
    return r + ((m >> 12) & 1);
  };
  // rows y0 .. y1 of a w × h bake (a part of it: the pool splits the big ones across workers)
  const run = ({ name, w, h, half, diamonds = 10, y0 = 0, y1 = h }) => {
    const o = new Float32Array(w * (y1 - y0) * 4);
    // the hada's ashi depends on u only: one fbm per column
    const ashi = name === 'hada' ? new Float32Array(w) : null;
    if (ashi) for (let x = 0; x < w; x++) ashi[x] = smoothstep(0.55, 0.9, fbm2(mix(-0.05, 1.0, (x + 0.5) / w) * 55, 1));
    for (let y = y0; y < y1; y++) {
      const t = (y + 0.5) / h;
      for (let x = 0; x < w; x++) {
        const s = (x + 0.5) / w, k = ((y - y0) * w + x) * 4;
        if (name === 'hamon') hamon(o, k, s);
        else if (name === 'silk') silk(o, k, s, t < 0.5 ? t * 2 : t * 2 - 1, t >= 0.5, diamonds);
        else if (name === 'hada') { hada(o, k, s, t); o[k + 3] = ashi[x]; }
        else ishime(o, k, s, t, w);
      }
    }
    if (half) { const q = new Uint16Array(o.length); for (let i = 0; i < o.length; i++) q[i] = toHalf(o[i]); return q; }
    const q = new Uint8Array(o.length); for (let i = 0; i < o.length; i++) q[i] = Math.round(clamp(o[i], 0, 1) * 255); return q;
  };
  if (typeof self !== 'undefined' && typeof self.postMessage === 'function' && typeof window === 'undefined') {
    self.onmessage = (e) => {
      const t0 = performance.now();
      const data = run(e.data);
      self.postMessage({ ...e.data, data, ms: performance.now() - t0 }, [data.buffer]);
    };
  }
  return run;
}

export const runBake = (job) => bakeWorker()(job);

// The pool: n workers; each job { name, w, h, half, diamonds, parts } is split into `parts` row bands, and the bands
// go to the least loaded worker in job order (a worker runs its queue in order, so the list is the priority).
// get(name) resolves with { name, w, h, half, data, ms } once every band of that job has landed.
const COST = { hamon: 0.05, silk: 0.45, hada: 1.0, ishime: 1.15 }; // µs-ish per texel (silk: half its rows are masks)
let url = null;
export function bakePool(jobs, n = 3) {
  if (!url) url = URL.createObjectURL(new Blob(['(' + bakeWorker.toString() + ')()'], { type: 'text/javascript' }));
  const W = [], load = [], pending = [];
  const out = {};
  const nW = Math.max(1, Math.min(n, jobs.reduce((a, j) => a + (j.parts || 1), 0)));
  for (let i = 0; i < nW; i++) {
    const w = new Worker(url); W.push(w); load.push(0); pending.push(0);
    w.onmessage = (e) => {
      const r = e.data, J = out[r.name];
      J.ms = Math.max(J.ms, r.ms); J.bands.push(r);
      if (--pending[i] === 0) w.terminate();
      if (J.bands.length === J.parts) {
        let data = J.bands[0].data;
        if (J.parts > 1) {
          data = new (J.half ? Uint16Array : Uint8Array)(J.w * J.h * 4);
          for (const b of J.bands) data.set(b.data, b.y0 * J.w * 4);
        }
        J.val = { name: r.name, w: J.w, h: J.h, half: J.half, data, ms: Math.round(J.ms), at: Math.round(performance.now()) };
        J.res(J.val);
      }
    };
    w.onerror = (e) => { for (const k in out) out[k].rej(e); };
  }
  for (const j of jobs) {
    const parts = j.parts || 1, J = (out[j.name] = { ...j, parts, bands: [], ms: 0 });
    J.p = new Promise((res, rej) => { J.res = res; J.rej = rej; });
    const rows = Math.ceil(j.h / parts);
    for (let p = 0; p < parts; p++) {
      const y0 = p * rows, y1 = Math.min(j.h, y0 + rows);
      let i = 0; for (let k = 1; k < nW; k++) if (load[k] < load[i]) i = k;
      load[i] += (COST[j.name] || 1) * j.w * (y1 - y0); pending[i]++;
      W[i].postMessage({ name: j.name, w: j.w, h: j.h, half: j.half, diamonds: j.diamonds, y0, y1 });
    }
  }
  // peek(name): the result if it has landed, else null
  return { get: (name) => (out[name] ? out[name].p : Promise.resolve(null)), peek: (name) => (out[name] && out[name].val) || null, jobs: out };
}

// The jobs of a page load. 'boot': the hero's set, the hada at 2048 × 128 (what the hero samples), started by main.js
// as soon as it runs; 'full': the hold renderer's set (?beat), the hada at its full size where the tier has it;
// 'upgrade': the full-size hada alone, in idle time after the lift (§4.1). Half floats (RGBA16F; gl/index.js turns
// them into RGBA8 where a half-float target is not renderable, which mipmapping needs).
export function heroJobs(kind, big) {
  const hada = kind !== 'boot' && big ? [4096, 256] : [2048, 128];
  if (kind === 'upgrade') return [{ name: 'hada', w: hada[0], h: hada[1], half: true, parts: 2 }];
  return [
    { name: 'hamon', w: 4096, h: 1, half: true },
    { name: 'silk', w: 1024, h: 512, half: true, diamonds: 10, parts: 2 },
    { name: 'hada', w: hada[0], h: hada[1], half: true, parts: hada[0] > 2048 ? 3 : 2 },
    { name: 'ishime', w: 512, h: 512, half: true, parts: 2 },
  ];
}
