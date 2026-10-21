// Look presets (Appendix B): named sets of the shared studio uniforms plus scene extras. Colours are linear RGB.
// washi, reveal, sumi and ai are LOCKED to the prototype (concepts/object-cinema/src/main.js + stage.js); every key a
// prototype scene did not set keeps the prototype Stage constructor's default, so the defaults are part of the lock.
const DEF = {
  uCeil: [0.010, 0.012, 0.016], uCeilHi: [0.12, 0.122, 0.13], uCeilA: [-0.62, -0.22], uCeilB: [-3, -2],
  uFloor: [0.70, 0.66, 0.58], uKey: [2.3, 2.25, 2.15], uKeyA: [-0.52, -0.44], uKeyB: [-1.15, 1.15], uKeySoft: 0.14,
  uStrip: [0, 0, 0], uStripA: [-0.19, -0.155], uRim: [0, 0, 0], uRimA: [0.9, 1.1],
  uLampCol: [3.0, 2.7, 2.25], uFrostLight: 1.3, uFrostAmb: [0, 0, 0], uRidge: 0,
  uGlintCol: [0, 0, 0], uGlintSize: 0.03, uExposure: 1,
  // scene extras
  nie: 520, nieAvg: 0.05, shinogiSheen: 0, shinogiRough: 0.045, edgeLine: 0,
  // the steel's macro treatment (sunagashi streaks, the folded grain, a sharper mirror up close) and its lamp lobe
  macro: 0, lampSpec: 1,
  // the studio glint's share in the steel, the lobe width of the fittings' glint (copper, gold) and the warm backlit
  // lines along the blade's outline: 1, 1, 0 everywhere but B14, where the backlight is seen point-on (G1)
  steelGlint: 1, fittingsGlintW: 1, backEdge: 0, fittingsFill: [0, 0, 0], fillDirV: [0, 0, 1],
  shadowCol: [0.16, 0.13, 0.10], shadowA: 0.68, shadowSoft: 0.14, shadowBase: 0.02,
  backGlow: [0, 0, 0], ironBase: [0.055, 0.048, 0.042],
};
const L = {};
L.washi = {
  ...DEF, uCeilB: [-0.28, 0.26], uCeilHi: [0.26, 0.265, 0.28], uKeyB: [-0.62, 1.0], uKeySoft: 0.012, uRidge: 0.45,
  uFrostLight: 1.25, uFrostAmb: [0.07, 0.072, 0.078], uGlintCol: [40, 36, 30], uGlintSize: 0.006, nie: 520,
  // G1: the shinogi-ji is no longer a black stripe: burnished, darker than the ji, with its own faint sheen
  shinogiSheen: 0.3, shinogiRough: 0.1,
};
L.reveal = { ...L.washi, uGlintCol: [0, 0, 0], nie: 420 };
L['washi-macro'] = { ...L.washi, uKeySoft: 0.02, uGlintSize: 0.004, nie: 700, macro: 1 };
L.sumi = {
  ...DEF, uCeil: [0.003, 0.0035, 0.005], uCeilHi: [0.06, 0.064, 0.075], uCeilA: [-0.9, 0.2], uCeilB: [0.1, 1.0],
  uFloor: [0.02, 0.02, 0.024], uKey: [0.9, 0.92, 1.0], uKeyA: [-0.86, -0.66], uKeyB: [0.25, 0.95], uKeySoft: 0.03,
  uStrip: [1.6, 1.65, 1.8], uStripA: [0.95, 1.5], uFrostLight: 1.0, uFrostAmb: [0.10, 0.105, 0.115], uRidge: 0.9,
  uLampCol: [1.6, 1.45, 1.25], nie: 1500,
};
L.ai = {
  ...DEF, uCeil: [0.004, 0.005, 0.012], uCeilHi: [0.02, 0.026, 0.06], uCeilA: [-0.6, 0.6], uCeilB: [-2, 2],
  uFloor: [0.006, 0.008, 0.02], uKey: [0.55, 0.6, 0.8], uKeyA: [-1.1, -0.5], uKeyB: [-1.4, 1.4], uKeySoft: 0.2,
  uRidge: 0, uFrostLight: 1.0, uFrostAmb: [0.03, 0.035, 0.05], uLampCol: [2.2, 1.9, 1.5],
  uGlintCol: [2.4, 1.7, 1.0], uGlintSize: 0.022, nie: 520,
  backGlow: [2.6, 1.6, 0.75], ironBase: [0.05, 0.045, 0.045],
};
// starting values (tuned at the gates)
L.togi = {
  ...L.washi, uCeil: [0.02, 0.02, 0.022], uCeilHi: [0.30, 0.30, 0.31], uFloor: [0.92, 0.90, 0.86], uKey: [2.0, 2.0, 1.95],
  uKeySoft: 0.02, uFrostLight: 1.35, uFrostAmb: [0.12, 0.12, 0.12], uGlintCol: [24, 22, 19], uGlintSize: 0.005, nie: 700,
  shadowCol: [0.20, 0.18, 0.15], shadowA: 0.55, macro: 1,
};
L.noto = {
  ...L.sumi, uCeil: [0.003, 0.003, 0.004], uStrip: [1.8, 1.75, 1.7], uStripA: [0.95, 1.5], uKey: [0.6, 0.6, 0.65],
  uLampCol: [1.6, 1.45, 1.25],
};
// G3: the other looks of Appendix B, starting values (rough; tuned with their scenes at G4)
L['ro'] = {
  ...L.sumi, uCeil: [0.004, 0.004, 0.005], uCeilHi: [0.05, 0.05, 0.055], uKey: [0.8, 0.82, 0.9], uFloor: [0.05, 0.02, 0.01],
  uRim: [0.35, 0.12, 0.04], uFrostLight: 0.9, uStrip: [0.7, 0.68, 0.66], uLampCol: [1.2, 1.1, 1.0], uRidge: 0.6, nie: 900,
};
L['ro-hot'] = { ...L.ro, uLampCol: [0, 0, 0], uExposure: 0.85, uRim: [0.6, 0.2, 0.06], uKey: [0.9, 0.55, 0.35] };
L['mizu-hot'] = {
  ...L.ro, uCeil: [0.003, 0.006, 0.010], uCeilHi: [0.03, 0.06, 0.09], uKey: [0.5, 0.62, 0.8], uFloor: [0.01, 0.03, 0.05],
  uRim: [0.10, 0.18, 0.26], uLampCol: [0, 0, 0], uStrip: [0.5, 0.62, 0.75],
};
L['mizu'] = { ...L['mizu-hot'], uKey: [0.7, 0.8, 1.0], uRim: [0.35, 0.55, 0.80], uFrostLight: 1.1, uLampCol: [0.8, 0.9, 1.1] };
L['ai-carpet'] = { ...L.ai, uLampCol: [2.4, 1.7, 0.9] };
L['ai-warm'] = { ...L['ai-carpet'], uFloor: [0.25, 0.18, 0.12] };
L['ganch'] = {
  ...L.washi, uCeil: [0.05, 0.04, 0.03], uCeilHi: [0.35, 0.30, 0.24], uFloor: [0.82, 0.70, 0.52], uKey: [2.2, 1.9, 1.5],
  uLampCol: [0, 0, 0], uGlintCol: [0, 0, 0], shadowCol: [0.30, 0.20, 0.12], shadowA: 0.6, shadowSoft: 0.18,
};
L['temur'] = { ...L.ganch, uStrip: [1.6, 1.5, 1.35], uStripA: [0.95, 1.5], shadowA: 0.7 };
export const LOOKS = L;
export const UNIFORM_KEYS = Object.keys(DEF).filter((k) => k[0] === 'u');
