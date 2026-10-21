// The shot table (Appendix C): one ordered list of beats, keyed by name everywhere (code, DOM data-beat, probes,
// deep links); the number of a beat is its position in BEATS and is never typed. Per layout ('land' W/H >= 1.2,
// 'port' below) each hold names its camera, pose, look, materials and visibility.
// G1 fills the material-lock holds (mei.hero, the intro reveal, mei.promise, utsuri.ios, utsuri.ai, togi.front,
// tsuba.guard (two candidates), noto.contact) and the phone hero; G3/G4 fill the rest and add the transitions.
const D = Math.PI / 180;

export const BEATS = [
  'mei.hero', 'mei.promise',
  'utsuri.ios', 'utsuri.web', 'utsuri.telegram', 'utsuri.backend', 'utsuri.ai',
  'yaki.plan', 'yaki.heat', 'yaki.quench', 'yaki.launch',
  'togi.stone', 'togi.front', 'togi.mirror',
  'tsuba.guard', 'tsuba.carpet', 'tsuba.team',
  'toki.0900', 'toki.1130', 'toki.1400',
  'temur.quote', // Addendum 1
  'noto.sheath', 'noto.contact',
  'bookend.drawing', 'bookend.steel',
];
export const PHONE = ['mei.hero', 'mei.promise', 'utsuri.ios', 'utsuri.telegram', 'utsuri.ai', 'yaki.plan', 'yaki.quench', 'yaki.launch', 'togi.front', 'tsuba.guard', 'tsuba.carpet', 'toki.0900', 'toki.1400', 'temur.quote', 'noto.sheath', 'noto.contact', 'bookend.steel'];
export const SCENE_OF = (name) => ({ mei: 'mei', utsuri: 'xizmatlar', yaki: 'jarayon', togi: 'kaizen', tsuba: 'tsuba', toki: 'vaqt', temur: 'vaqt', noto: 'aloqa', bookend: 'aloqa' })[name.split('.')[0]];

// defaults for every key of a hold
const BASE = {
  look: 'washi', lookOver: {}, program: 'polished', reveal: 2, front: 0, polishFront: 2,
  pose: { roll: 0, pitch: 0, sori: 1 },
  shadow: 0, light: { dir: [-0.22, 1, -0.50] },
  ink: null, koshirae: 1, nakago: 0, saya: 0, sheath: 1, floor: 0, rays: 0,
  glint: null, lampPos: null, sign: null, ground: 'washi',
};
const hero = {
  land: { cam: { mode: 'td', A: 'K', a: [0.072, 0.698], B: 'T', b: [0.921, 0.258], fov: 20, lift: 1.05 }, ink: { fit: 'hero', off: [8, 24] } },
  port: { cam: { mode: 'td', A: 'K', a: [0.626, 0.955], B: 'T', b: [0.856, 0.123], fov: 24, lift: 0.95 }, ink: { fit: 'hero', off: [13, 5] }, lookOver: { nie: 300 } },
};
const S = {};
S['mei.hero'] = {
  ...BASE, look: 'washi', pose: { roll: -0.30, pitch: 0, sori: 1 }, shadow: 1, glint: { s: 0.78, zf: 0.60, dist: 8 }, ground: 'washi',
  land: hero.land, port: hero.port,
};
// the intro pre-state: the drawing at the reveal pose (FOV 2, lift = the tsuba's radius), the studio rolled −0.60
S.intro = {
  // the shadow follows the steel as it fills the drawing (prototype frame 02 grounds the steel; ink casts nothing)
  ...BASE, look: 'reveal', program: 'reveal', reveal: 0, front: 1, pose: { roll: 0, pitch: 0, sori: 1 }, studioRoll: -0.60, shadow: 0.85, ground: 'washi',
  // the prototype's reveal lamp: its glint follows the front along the blade
  glint: { s: 'front', zf: 0.58, dist: 9 },
  land: { cam: { ...hero.land.cam, fov: 2, lift: 0.4017 }, ink: { fit: 'intro', off: [0, 0] } },
  port: { cam: { ...hero.port.cam, fov: 2, lift: 0.4017 }, ink: { fit: 'intro', off: [0, 0] } },
};
// B1: the roll stays at the hero's −0.30 (Appendix C's −0.22 put the ji's mirror off the key: a black slab)
// Up close the lamp's lobe spreads into a cream blob over the ji (as at B12): it is dimmed to a small warm glow at
// the yokote, which the macro mirror (looks.js macro) now draws as a crisp line.
S['mei.promise'] = {
  ...BASE, look: 'washi-macro', lookOver: { uGlintCol: [0, 0, 0], lampSpec: 0.12 }, pose: { roll: -0.30, pitch: 0, sori: 1 }, shadow: 1, glint: { s: 0.93, zf: 0.55, dist: 7 }, ground: 'washi',
  land: { cam: { mode: 'td', A: { s: 0.50 }, a: [-0.04, 0.64], B: 'T', b: [0.90, 0.64], fov: 16, lift: 1.05 }, ink: { fit: 'hero', off: [8, 24], annot: false } },
  port: { cam: { mode: 'td', A: { s: 0.62 }, a: [-0.06, 0.56], B: 'T', b: [0.90, 0.56], fov: 20, lift: 0.95 }, ink: { fit: 'hero', off: [13, 5], annot: false } },
};
// 映 B2: the prototype's utsuri camera, exactly (target bladePoint(0.53) + (−1.50, 1.72, 0.60)); lamp and sign as there
S['utsuri.ios'] = {
  ...BASE, look: 'sumi', pose: { roll: -0.10, pitch: 0, sori: 1 }, ground: 'sumi',
  lampPos: { at: { s: 0.74, zf: 0.6 }, add: [1.2, 2.6, -2.0] },
  sign: { row: 0, s: 0.50, alpha: 1 },
  land: { cam: { mode: 'orbit', target: { s: 0.53 }, vec: [-1.50, 1.72, 0.60], fov: 26, ang: -18, chord: [0.40, 0.66], off: [0, 0] } },
  port: { cam: { mode: 'orbit', target: { s: 0.22 }, az: -60, el: 50, dist: 2.6, fov: 30, ang: -62, off: [0, 0] } },
};
// B6: the other flat (ura): the blade is rolled over, so the hamon runs along the top of the band and the ridge
// along the bottom; seen from the edge side, the tip to the right, the kissaki and the yokote entering at x ~ .93
// (its studio turned 0.8 rad about the blade: the ji reads as a dark mirror under the frosty hamon, not flat grey)
S['utsuri.ai'] = {
  ...BASE, look: 'sumi', pose: { roll: Math.PI - 0.10, pitch: 0, sori: 1 }, studioRoll: 0.8, ground: 'sumi',
  glint: { s: 0.97, zf: 0.6, dist: 3.4 },
  // (the sign is narrower than the hold default and sits higher on the ji, so the whole of the longest word,
  // "AI · IoT · Desktop", lies inside the visible ji above the ridge)
  sign: { row: 4, s: 0.76, zf: 0.72, width: 3.4, alpha: 1 },
  land: { cam: { mode: 'orbit', target: { s: 0.80 }, az: -68, el: 46.8, dist: 2.7, fov: 26, ang: -18, off: [0, 0] } },
  port: { cam: { mode: 'orbit', target: { s: 0.80 }, az: -60, el: 50, dist: 3.0, fov: 30, ang: -62, off: [0, 0] } },
};
// 研 B12: magnified and level, the polish front across the middle of the frame
// (the black card's one soft white strip is laid where the level ji reflects; the kirari stays small at this zoom)
// Magnified ×5, the lamp's specular lobe and the kirari would spread into a cream blob over the ji: both are off
// here (the nie still twinkle by the lamp's direction), and the card's strip is narrowed so the convex ji carries
// exactly one crisp streak.
S['togi.front'] = {
  ...BASE, look: 'togi', lookOver: { uStrip: [2.5, 2.5, 2.45], uStripA: [0.16, 0.20], uGlintCol: [0, 0, 0], lampSpec: 0, nieAvg: 0.004, shinogiSheen: 0.6 }, pose: { roll: 0, pitch: 0, sori: 1 }, polishFront: 0.72, shadow: 1, ground: 'togi', nakago: 1, koshirae: 0,
  glint: { s: 0.62, zf: 0.55, dist: 7 },
  land: { cam: { mode: 'td', A: { s: 0.55 }, a: [0.04, 0.62], B: { s: 0.85 }, b: [0.96, 0.62], fov: 12, lift: 0.12 } },
  port: { cam: { mode: 'td', A: { s: 0.55 }, a: [-0.05, 0.52], B: { s: 0.85 }, b: [1.05, 0.52], fov: 14, lift: 0.12 } },
};
// 鍔 B14: the opponent's view; two candidates for the horn (§2.5), chosen at G1 next to frame 04: (a), see hold()
S['tsuba.guard'] = {
  ...BASE, look: 'ai', pose: { roll: 0, pitch: 0, sori: 0.3 }, ground: 'ai', rays: 1, floor: 1, floorGain: 0.03,
  lampPos: { tsuba: true }, glintDir: 'axis-',
  land: { cam: { mode: 'guard', cand: 'a', frac: 0.47, off: [-0.12, 0] } },
  port: { cam: { mode: 'guard', cand: 'a', frac: 0.36, off: [0, -0.06] } },
};
// 納 B21: pushed in on the mouth of the scabbard, the sword fully home
// (the lacquer's strip is narrowed to a crisp long line, a mirror in the roiro, and a dim ceiling rounds the top of
// the saya off the sumi ground; the framing keeps only the fuchi end of the grip in frame)
S['noto.contact'] = {
  ...BASE, look: 'noto', lookOver: { uStripA: [1.02, 1.18], uStrip: [2.6, 2.55, 2.5], uCeilHi: [0.04, 0.04, 0.045], uCeilA: [-0.9, 0.6], uCeilB: [-1.5, 1.5] },
  pose: { roll: -Math.PI / 2, pitch: 0, sori: 1 }, ground: 'sumi', saya: 1, sheath: 1,
  glint: null, lampPos: { at: { s: 0.02, zf: 0.5 }, add: [1.4, 2.2, 3.2] },
  // the koiguchi, the bengara band and the tsuba at the lower right; the grip cropped by the right edge (it is never
  // closer than 1.8x the hero scale, so only its fuchi end shows)
  land: { cam: { mode: 'orbit', target: 'koiguchi', az: -8, el: 12, dist: 6.4, fov: 22, ang: 180, chord: [0.02, 0.22], off: [-0.39, -0.25] } },
  port: { cam: { mode: 'orbit', target: 'koiguchi', az: -8, el: 12, dist: 13, fov: 26, ang: 180, chord: [0.02, 0.22], off: [0, -0.36] } },
};
export const SHOTS = S;

// the hold of a beat for a layout, flattened (G3 replaces this with tracks/evalS)
export function hold(name, layout, opt = {}) {
  const sh = S[name];
  if (!sh) return null;
  const L = sh[layout] || sh.land;
  const out = { ...sh, ...L, name, layout, lookOver: { ...(sh.lookOver || {}), ...(L.lookOver || {}) } };
  delete out.land; delete out.port;
  out.cam = { ...L.cam };
  // B14's two candidates (§2.5), both rendered at G1 next to frame 04 (scripts/qa/poster-test.cjs B14a, B14b):
  //   (a) on the axis, sori 0.3: the camera looks back along the blade's chord, so the blade is a short straight
  //       spike seen point-on in the middle of the lit girih, its edge a bright line. Its flats face sideways, so
  //       the lamp behind the guard would only paint the spine peach: the backlight's glint is off for it (the
  //       iron keeps its back glow). CHOSEN at G1: never a crescent, the concentric backlight of frame 04 intact.
  //   (b) off the axis, 14° to the edge side and 8° above (the spec's values): the blade runs out of the guard as a
  //       long band to the lower left, across the statement, and reads as a blade thrust at the viewer. Smaller
  //       angles (3–6°) give the same band, shorter; rejected.
  const cand = opt.cand || (name === 'tsuba.guard' ? 'a' : null);
  if (name === 'tsuba.guard') {
    out.cam.cand = cand;
    if (cand === 'a') out.lookOver = { ...out.lookOver, uGlintCol: [0, 0, 0] };
  }
  if (name === 'intro' && opt.reveal != null) out.reveal = opt.reveal;
  // dev: overrides for tuning a hold (?tune=json or __qilich.tune): nested objects merge one level deep
  if (opt.over) for (const [k, v] of Object.entries(opt.over)) out[k] = v && typeof v === 'object' && !Array.isArray(v) && out[k] && typeof out[k] === 'object' ? { ...out[k], ...v } : v;
  return out;
}
export const D2R = D;
