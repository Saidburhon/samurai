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
  // (final pass, §8 G2: the drawing registers with the steel (no offset) and its blade fades under the steel during
  // the lift; the dimensions, the tsuba roundel and the labels stay on the paper. r1 read the offset ink blade as a
  // second, misregistered outline)
  land: { cam: { mode: 'td', A: 'K', a: [0.072, 0.698], B: 'T', b: [0.921, 0.258], fov: 20, lift: 1.05 }, ink: { fit: 'hero', off: [0, 0], blade: 0 } },
  port: { cam: { mode: 'td', A: 'K', a: [0.626, 0.955], B: 'T', b: [0.856, 0.123], fov: 24, lift: 0.95 }, ink: { fit: 'hero', off: [0, 0], blade: 0 }, lookOver: { nie: 300 } },
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
  land: { cam: { mode: 'td', A: { s: 0.50 }, a: [-0.04, 0.64], B: 'T', b: [0.90, 0.64], fov: 16, lift: 1.05 }, ink: { fit: 'hero', off: [0, 0], annot: false, blade: 0 } },
  port: { cam: { mode: 'td', A: { s: 0.62 }, a: [-0.06, 0.56], B: 'T', b: [0.90, 0.56], fov: 20, lift: 0.95 }, ink: { fit: 'hero', off: [0, 0], annot: false, blade: 0 } },
};
// 映 B2: the prototype's utsuri camera, exactly (target bladePoint(0.53) + (−1.50, 1.72, 0.60)); lamp and sign as there
S['utsuri.ios'] = {
  ...BASE, look: 'sumi', pose: { roll: -0.10, pitch: 0, sori: 1 }, ground: 'sumi',
  lampPos: { at: { s: 0.74, zf: 0.6 }, add: [1.2, 2.6, -2.0] },
  sign: { row: 0, s: 0.50, alpha: 1 },
  land: { cam: { mode: 'orbit', target: { s: 0.53 }, vec: [-1.50, 1.72, 0.60], fov: 26, ang: -18, chord: [0.40, 0.66], off: [0, 0] } },
  // (final pass r2: the phone's blade lies across the middle band, under the nav and above the list, with its word on
  // the visible segment; at -62 deg the spine ran up through the nav and the word was off screen, m-03)
  port: { cam: { mode: 'orbit', target: { s: 0.26 }, az: -60, el: 50, dist: 1.9, fov: 34, ang: -24, off: [0, 0] }, sign: { row: 0, s: 0.26, width: 2.7, alpha: 1 } },
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
  ...BASE, look: 'ai', pose: { roll: 0, pitch: 0, sori: 0.3 }, ground: 'ai', rays: 1, floor: 1, floorGain: 0,
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
// ---------------- G3: every other beat, in rough looks (starting values of Appendix C; tuned at G4) ----------------
// Each hold that the phone never rests on has no 'port' entry: the phone's track runs over PHONE only (core/tracks.js).
const utsuri = (row, s, roll, cam, extra = {}) => ({
  ...BASE, look: 'sumi', pose: { roll, pitch: 0, sori: 1 }, ground: 'sumi',
  glint: { s: Math.min(0.97, s + 0.21), zf: 0.6, dist: 3.4 }, sign: { row, s, alpha: 1 }, ...extra, land: { cam },
});
S['utsuri.web'] = utsuri(1, 0.34, 0.057, { mode: 'orbit', target: { s: 0.34 }, az: -68, el: 46.8, dist: 1.30, fov: 24, ang: -18, off: [0, -0.08] });
S['utsuri.telegram'] = utsuri(2, 0.30, -0.10, { mode: 'orbit', target: { s: 0.28 }, az: -68, el: 46.8, dist: 3.6, fov: 26, ang: -24, off: [-0.15, 0] });
S['utsuri.telegram'].port = { cam: { mode: 'orbit', target: { s: 0.50 }, az: -60, el: 50, dist: 1.9, fov: 34, ang: -24, off: [0, 0] }, sign: { row: 2, s: 0.50, alpha: 1 } };
// B5: the other flat (ura), reached by rolling the blade over (as B6, G1), so the word changes flat under the turn
S['utsuri.backend'] = utsuri(3, 0.64, Math.PI + 0.057, { mode: 'orbit', target: { s: 0.64 }, az: -68, el: 46.8, dist: 2.36, fov: 26, ang: -18, off: [0, 0.02] }, { studioRoll: 0.8 });
S['utsuri.backend'].sign = { row: 3, s: 0.64, zf: 0.72, width: 3.4, alpha: 1 };

// 焼 Yaki (rough: the forge program, the water and the heat glow arrive with the scene at G4; here the bare, unpolished
// blade with its tang, straight until the launch, on the forge table and over the water)
// Fallback Y2 (§2.3, decided at the final pass: the 3D forge and water never read as hot steel and real water): the
// four steps are the oshigata plates on washi (scenes/plates.js); the sword is not drawn (hide), no ink layer
const forge = { ...BASE, koshirae: 0, nakago: 1, polishFront: -0.05, glint: null, hide: 1 };
S['yaki.plan'] = {
  ...forge, look: 'ro', pose: { roll: 0, pitch: 0, sori: 0 }, ground: 'washi', lampPos: { at: { s: 0.5, zf: 0.5 }, add: [0, 6, 0.5] },
  land: { cam: { mode: 'td', A: { s: 0, zf: 0 }, a: [0.266, 0.49], B: { s: 1, zf: 0 }, b: [0.92, 0.49], fov: 20, lift: 0.05 } },
  port: { cam: { mode: 'td', A: { s: 0.15, zf: 0 }, a: [0.0, 0.48], B: { s: 0.85, zf: 0 }, b: [1.0, 0.48], fov: 20, lift: 0.05 } },
};
S['yaki.heat'] = {
  ...forge, look: 'ro-hot', pose: { roll: 0, pitch: 0, sori: 0 }, ground: 'washi', lampPos: { at: { s: 0.5, zf: 0.5 }, add: [0, 6, 0.5] },
  land: { cam: { mode: 'td', A: { s: 0, zf: 0 }, a: [0.211, 0.65], B: { s: 1, zf: 0 }, b: [1.02, 0.229], fov: 20, lift: 0.05 } },
};
S['yaki.quench'] = {
  ...forge, look: 'mizu-hot', pose: { roll: 0, pitch: -0.42, sori: 0 }, ground: 'washi', lampPos: { at: { s: 0.5, zf: 0.5 }, add: [-2, 4, 3] },
  land: { cam: { mode: 'orbit', target: { s: 0.45 }, az: -20, el: 6, dist: 7.5, fov: 24, ang: -24, off: [0, -0.05] } },
  port: { cam: { mode: 'orbit', target: { s: 0.45 }, az: -10, el: 6, dist: 9, fov: 28, ang: 90, off: [0, 0] } },
};
S['yaki.launch'] = {
  ...forge, look: 'mizu', pose: { roll: 0, pitch: -0.08, sori: 1 }, ground: 'washi', lampPos: { at: { s: 0.6, zf: 0.5 }, add: [-2, 3, 4] },
  land: { cam: { mode: 'orbit', target: { s: 0.5 }, az: -15, el: -4, dist: 8.0, fov: 24, ang: -18, off: [0, -0.10] } },
  port: { cam: { mode: 'orbit', target: { s: 0.5 }, az: -10, el: -4, dist: 9.5, fov: 28, ang: 90, off: [0, 0] } },
};

// 研 Togi: the polish front travels with the scroll; B13 reflects 改善
const togi = { ...BASE, look: 'togi', pose: { roll: 0, pitch: 0, sori: 1 }, shadow: 1, ground: 'togi', nakago: 1, koshirae: 0 };
S['togi.stone'] = {
  ...togi, polishFront: 0.40, glint: { s: 0.30, zf: 0.55, dist: 7 },
  // (final pass r2: the blade enters from the frame's edge beyond the machi; the bare tang at the lower left read as a
  // flat brown slab, d-step-11)
  land: { cam: { mode: 'td', A: { s: 0.07 }, a: [0.0, 0.785], B: 'T', b: [0.92, 0.32], fov: 20, lift: 0.12 } },
};
S['togi.mirror'] = {
  ...togi, polishFront: 1.05, lookOver: { uGlintCol: [0, 0, 0], lampSpec: 0.3 }, glint: { s: 0.85, zf: 0.55, dist: 7 },
  // (final pass r2: smaller and lower, wholly in the ji under the shinogi; the ridge cut 改善 in half, d-step-13)
  sign: { row: 5, s: 0.70, zf: 0.70, width: 3.2, alpha: 1 },
  land: { cam: { mode: 'td', A: { s: 0.40 }, a: [0.04, 0.84], B: 'T', b: [0.95, 0.40], fov: 20, lift: 0.12 } },
};

// 鍔 Tsuba: the crane up and over the girih light on the indigo floor (the orbits of B15–B16 are taken in the floor's
// frame: up is the floor's normal, so el 90° looks straight down onto it)
// (final pass r2: the blade rolled 0.95 rad, so its ji catches the pool instead of a needle seen edge-on (0.5 still
// read as a dark needle); the pool itself a third dimmer, d-step-15/16)
const carpet = { ...BASE, pose: { roll: -0.95, pitch: 0, sori: 0.3 }, ground: 'ai', floor: 1, rays: 0, lampPos: { tsuba: true }, glintDir: 'axis-', lookOver: { uGlintCol: [0, 0, 0] } };
S['tsuba.carpet'] = {
  ...carpet, look: 'ai-carpet', floorGain: 0.65,
  land: { cam: { mode: 'orbit', frame: 'floor', target: { s: 0.25 }, az: -35, el: 64, dist: 12, fov: 30, ang: -18, off: [0, 0] } },
  // (final pass r2: on the phone the sword lies on the diagonal, the tsuba well under the nav and the blade clear of the
  // headline; upright, its grip ran up through the nav and the blade touched the headline, m-11)
  port: { cam: { mode: 'orbit', frame: 'floor', target: { s: 0.25 }, az: -20, el: 70, dist: 17, fov: 36, ang: 62, off: [0.04, -0.02] } },
};
S['tsuba.team'] = {
  ...carpet, look: 'ai-warm', floorGain: 1.05, floorWarm: 1,
  land: { cam: { mode: 'orbit', frame: 'floor', target: { s: 0.25 }, az: -35, el: 89.9, dist: 16, fov: 30, ang: -18, off: [0, 0] } },
};

// 時 Toki: the sword is the hour hand of the dial (the tsuba at the hub, the tip 0.31–0.34 H out); the camera stays
// straight down, so the paper (and the dial on it) is a similarity of the screen. The hand: hour on the 24 h dial.
const toki = (hour, sun, land, port) => ({
  ...BASE, look: 'ganch', pose: { roll: 0, pitch: 0, sori: 1 }, ground: 'ganch', shadow: 1, glint: null,
  lampPos: { at: { s: 0.6, zf: 0.5 }, add: [0, 8, 0] }, dial: { hour }, sun,
  land: { cam: { mode: 'td', A: 'tsuba', a: land.hub, B: 'T', hand: { hour, len: land.len }, fov: 20, lift: 0.12 } },
  ...(port ? { port: { cam: { mode: 'td', A: 'tsuba', a: port.hub, B: 'T', hand: { hour, lenW: port.lenW }, fov: 24, lift: 0.12 } } } : {}),
});
// (final pass: the dial is 0.31 H on the desktop, the hand 0.25 H, so its numerals and arcs stay clear of the nav and the
// rail, r1)
// (final pass r2: the phone's dial is 0.36 W, its hand scaled with it, so the outer numerals stay inside the screen, m-12)
S['toki.0900'] = toki(9, { az: 135, el: 45 }, { hub: [0.62, 0.545], len: 0.25 }, { hub: [0.5, 0.62], lenW: 0.36 });
// (G3: B18 keeps B17's framing; its push-in on the hub, camera height × 0.55 at (.70, .56), waits for the dial drawn
// into a canvas at G4: the SVG dial re-rasterised every frame of a zoom cost 0.5–2 s per frame on a software renderer)
S['toki.1130'] = toki(11.5, { az: 172, el: 58 }, { hub: [0.62, 0.545], len: 0.25 });
// (phone: no push-in, only the hub lower, so the numerals stay clear of the clocks and their line, r1, and of the
// screen's edges, r2 m-13)
S['toki.1400'] = toki(14, { az: 210, el: 40 }, { hub: [0.62, 0.545], len: 0.25 }, { hub: [0.5, 0.665], lenW: 0.36 });

// Addendum 1, the Temur poster: the carved plaster lit low from the left; the sheathed sword along the bottom edge
S['temur.quote'] = {
  ...BASE, look: 'temur', pose: { roll: 0, pitch: 0, sori: 1 }, ground: 'ganch', saya: 1, sheath: 1, shadow: 1, glint: null,
  sun: { az: 262, el: 18 }, lampPos: { at: { s: 0.5, zf: 0.5 }, add: [-6, 3, 0] },
  land: { cam: { mode: 'td', A: 'K', a: [0.06, 0.865], B: 'J', b: [0.94, 0.865], fov: 20, lift: 0.15 } },
  port: { cam: { mode: 'td', A: 'K', a: [0.05, 0.905], B: 'J', b: [0.95, 0.905], fov: 24, lift: 0.15 } },
};

// 納 B20: the blade 70 % home, edge up, sliding into the saya across the lower third
S['noto.sheath'] = {
  ...S['noto.contact'], sheath: 0.70,
  land: { cam: { mode: 'orbit', target: 'koiguchi', az: -8, el: 12, dist: 10.5, fov: 22, ang: 180, chord: [0.02, 0.22], off: [-0.22, -0.24] } },
  port: { cam: { mode: 'orbit', target: 'koiguchi', az: -8, el: 12, dist: 12, fov: 26, ang: 180, chord: [0.02, 0.22], off: [0, -0.22] } },
};

// the bookend: the drawing of the mounted sword in its saya (B22), then the steel fills it and lifts (B23)
const bookAnch = { land: { A: 'K', a: [0.072, 0.698], B: 'J', b: [0.921, 0.258] }, port: { A: 'K', a: [0.626, 0.955], B: 'J', b: [0.856, 0.123] } };
S['bookend.drawing'] = {
  ...BASE, look: 'reveal', program: 'reveal', reveal: 0, front: 1, pose: { roll: 0, pitch: 0, sori: 1 }, studioRoll: -0.60, saya: 1, sheath: 1,
  shadow: 0.85, ground: 'washi', glint: { s: 'front', zf: 0.58, dist: 9 },
  land: { cam: { mode: 'td', ...bookAnch.land, fov: 2, lift: 0.4017 }, ink: { fit: 'bookend.drawing', draw: 'saya', off: [0, 0] } },
};
S['bookend.steel'] = {
  ...BASE, look: 'washi', pose: { roll: -0.30, pitch: 0, sori: 1 }, saya: 1, sheath: 1, shadow: 1, ground: 'washi', glint: { s: 0.78, zf: 0.60, dist: 8 },
  land: { cam: { mode: 'td', ...bookAnch.land, fov: 20, lift: 1.05 }, ink: { fit: 'bookend.steel', draw: 'saya', off: [0, 0], blade: 0 } },
  port: { cam: { mode: 'td', ...bookAnch.port, fov: 24, lift: 0.95 }, ink: { fit: 'bookend.steel', draw: 'saya', off: [0, 0], blade: 0 }, lookOver: { nie: 300 } },
};
export const SHOTS = S;

// ---------------- transitions (Appendix C), keyed by the outgoing beat: k -> k + 1 ----------------
// type cam     a continuous move; every group runs inside [.15, .85] with its ease
//      spin    the whip spin: one extra full roll, the state swap at the second edge-on moment
//      cut     a freeze-and-split: the frozen hold k splits along a line (ang in degrees on screen, through at)
//      wipe    a freeze with a soft front: light (radial from the tsuba), sweep (raking light from the left), shadow
//      reveal  the steel fills the drawing (mat), then the sword lifts (cam)
// groups: cam (camera, pose, studio), look (look and ground), mat (reveal, front, polish, shadow, sheath), sign, ink;
// each [from, to, ease] in beat fractions. studioW: the world share of the studio between holds (§3.5).
const F = [0.2, 0.8];
export const TRANS = {
  'mei.hero': { type: 'cam', studioW: 0.3 },
  'mei.promise': { type: 'cut', cut: { ang: -18, at: [0.5, 0.52] } },
  'utsuri.ios': { type: 'cam', studioW: 0.15, words: true },
  'utsuri.web': { type: 'cam', studioW: 0.15, words: true },
  'utsuri.telegram': { type: 'cam', studioW: 0.15, words: true, flip: true },
  'utsuri.backend': { type: 'cam', studioW: 0.15, words: true },
  // (Y2: the forge is a sheet of washi with the plates; the steel is cut away on the house diagonal)
  'utsuri.ai': { type: 'cut', cut: { ang: -18, at: [0.5, 0.5] } },
  'yaki.plan': { type: 'cam' },
  'yaki.heat': { type: 'cam' },
  'yaki.quench': { type: 'cam' },
  'yaki.launch': { type: 'cut', cut: { ang: -18, at: [0.5, 0.56] } },
  'togi.stone': { type: 'cam', groups: { mat: [0.15, 0.85, 'power1.inOut'] } },
  'togi.front': { type: 'cam', groups: { mat: [0.15, 0.85, 'power1.inOut'], sign: [0.6, 0.85, 'sine'] } },
  'togi.mirror': { type: 'cut', cut: { ang: 90, at: [0.5, 0.5] } },
  'tsuba.guard': { type: 'cam', studioW: 0 },
  'tsuba.carpet': { type: 'cam' },
  // (final pass: the iris of the light wipe left a disc of the tsuba over the dial at its mid frame, r1: the house cut)
  'tsuba.team': { type: 'cut', cut: { ang: -18, at: [0.5, 0.5] } },
  'toki.0900': { type: 'cam' },
  'toki.1130': { type: 'cam' },
  // (final pass r2: the sweep's hard vertical front sliced the dial and the saya at its mid frame: the house cut, at
  // -24 deg, as the neighbouring cuts are -18)
  'toki.1400': { type: 'cut', cut: { ang: -24, at: [0.5, 0.5] } },
  // (final pass: the shadow wipe's hard vertical front sliced the quote, r1: the house cut)
  'temur.quote': { type: 'cut', cut: { ang: -18, at: [0.5, 0.5] } },
  'noto.sheath': { type: 'cam', groups: { mat: [0.15, 0.85, 'seat'] } },
  'noto.contact': { type: 'cut', cut: { ang: -18, at: [0.4965, 0.478] } },
  'bookend.drawing': { type: 'reveal', groups: { mat: [0.15, 0.6, 'power2.inOut'], cam: [0.55, 0.85, 'lift'], look: [0.55, 0.85, 'lift'], ink: [0.55, 0.85, 'lift'] } },
};
// the load sequence's reveal and lift (§4.1: 2.0 s of steel, then 1.8 s of lift), as a transition intro -> mei.hero
export const INTRO = { type: 'reveal', groups: { mat: [0, 0.526, 'power2.inOut'], cam: [0.526, 1, 'lift'], look: [0.526, 1, 'lift'], ink: [0.526, 1, 'lift'] } };
export const FREEZE_WIN = F;
// the phone shows the elements of the beats it skips on the nearest poster of the same scene
// (only blocks the phone poster really carries: Kaizen's "even after launch" and the rub hint, Tsuba's team line; the
// blocks of the other skipped beats stay off the phone, so no two lines share a place)
export const PORT_ALIAS = { 'togi.stone': 'togi.front', 'togi.mirror': 'togi.front', 'tsuba.team': 'tsuba.carpet', 'bookend.drawing': 'bookend.steel' };
// the deep links (§7.1): the scene ids, the same on every language page
export const HASH_BEAT = { mei: 'mei.hero', xizmatlar: 'utsuri.ios', jarayon: 'yaki.plan', kaizen: 'togi.stone', tsuba: 'tsuba.guard', vaqt: 'toki.0900', temur: 'temur.quote', aloqa: 'noto.contact' };
export const SCENES = ['mei', 'xizmatlar', 'jarayon', 'kaizen', 'tsuba', 'vaqt', 'aloqa'];

// the hold of a beat for a layout, flattened
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
    // (a): the ai look's backlight glint (2.4, 1.7, 1.0; 0.022; −axis) stays on, widened on the copper habaki and the
    // gilt seppa so the collar sparks warm at the centre; a soft warm light in front (view space, upper left) lets the
    // fittings read as metal; the blade, seen point-on, keeps a small share of the glint and carries the backlight
    // as thin warm lines along its edge and spine, so the spike reads as steel pointing at the viewer (G1 review)
    // G1 r2: the camera aims 2.5 % short of the tip (aim 0.975), so the blade ends in one point inside the collar
    // instead of a fork beyond it, and no pale end-on 'capsule' shows above it; the copper keeps a narrower glint and a
    // deeper fill so the habaki reads copper, not salmon
    if (cand === 'a') {
      out.lookOver = { ...out.lookOver, steelGlint: 0.25, backEdge: 2.0, fittingsGlintW: 1.6, fittingsFill: [0.55, 0.32, 0.16], fillDirV: [-0.45, 0.45, 1] };
      out.cam.aim = out.cam.aim ?? 0.975;
    }
  }
  if (name === 'intro' && opt.reveal != null) out.reveal = opt.reveal;
  // dev: overrides for tuning a hold (?tune=json or __qilich.tune): nested objects merge one level deep
  if (opt.over) for (const [k, v] of Object.entries(opt.over)) out[k] = v && typeof v === 'object' && !Array.isArray(v) && out[k] && typeof out[k] === 'object' ? { ...out[k], ...v } : v;
  return out;
}
export const D2R = D;
