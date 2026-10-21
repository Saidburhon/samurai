// Every GL program of the site. One studio uniform set (U) is shared by reference by all sword materials, so every
// part sits in the same light. The steel is one program whose states (polish, reveal, words) are uniforms; FORGE
// arrives at G1b. The reveal discard and front live in the metal and silk programs too, so no variant is compiled.
import { ShaderMaterial, Vector2, Vector3, Matrix3, DoubleSide, FrontSide, NormalBlending, CustomBlending, AddEquation, OneFactor, ZeroFactor, OneMinusSrcAlphaFactor } from 'three';
import * as G from '../sword/geom-core.js';
import COMMON from './glsl/common.glsl';
import SWORD_V from './glsl/sword.vert.glsl';
import STEEL_F from './glsl/steel.frag.glsl';
import METAL_F from './glsl/metal.frag.glsl';
import SILK_F from './glsl/silk.frag.glsl';
import LACQ_F from './glsl/lacquer.frag.glsl';
import SHADOW_F from './glsl/shadow.frag.glsl';
import PLANE_V from './glsl/plane.vert.glsl';
import FLOOR_F from './glsl/floor.frag.glsl';
import QUAD_V from './glsl/quad.vert.glsl';
import COMP_F from './glsl/composite.frag.glsl';
import RAYS_F from './glsl/rays.frag.glsl';
import DISC_V from './glsl/disc.vert.glsl';
import DISC_F from './glsl/disc.frag.glsl';

const v3 = (x = 0, y = 0, z = 0) => new Vector3(x, y, z);
const swordV = SWORD_V.replace('__R_ARC__', G.R_ARC.toFixed(6)).replace('__LS__', G.L_STRAIGHT.toFixed(6));
const frag = (src) => COMMON + '\n' + src;

export function makeUniforms() {
  return {
    uStudio: { value: new Matrix3() },
    uCeil: { value: v3() }, uCeilHi: { value: v3() }, uCeilA: { value: new Vector2() }, uCeilB: { value: new Vector2() },
    uFloor: { value: v3() }, uKey: { value: v3() }, uKeyA: { value: new Vector2() }, uKeyB: { value: new Vector2() }, uKeySoft: { value: 0 },
    uStrip: { value: v3() }, uStripA: { value: new Vector2() }, uRim: { value: v3() }, uRimA: { value: new Vector2() },
    uLampPos: { value: v3(0, 8, 0) }, uLampCol: { value: v3() }, uFrostLight: { value: 1 }, uFrostAmb: { value: v3() },
    uRidge: { value: 0 }, uGlintDir: { value: v3(0, 1, 0) }, uGlintCol: { value: v3() }, uGlintSize: { value: 0.03 },
    uExposure: { value: 1 }, uAA: { value: 1 }, uTime: { value: 0 },
    uReveal: { value: 2 }, uFront: { value: 0 },
  };
}

// transparent for the coverage alpha of the outlines; one pass (three draws a transparent double-sided mesh twice)
const base = { side: DoubleSide, forceSinglePass: true, transparent: true, premultipliedAlpha: true, depthWrite: true, blending: NormalBlending };

export function makeMaterials(U, T) {
  const steelU = {
    ...U, tHada: { value: T.hada }, tHamon: { value: T.hamon },
    uNie: { value: 520 }, uNieAvg: { value: 0.05 }, uPolishFront: { value: 2 }, uShinogiSheen: { value: 0 }, uShinogiRough: { value: 0.045 }, uEdgeLine: { value: 0 },
    uWords: { value: null }, uWordAlpha: { value: 0 }, uWordRowA: { value: 0 }, uWordRowB: { value: 0 }, uWordMix: { value: 0 }, uWordStretch: { value: 1 }, uWordSlide: { value: 0 },
    uSignO: { value: v3() }, uSignU: { value: v3(1, 0, 0) }, uSignV: { value: v3(0, 1, 0) }, uSignN: { value: v3(0, 0, 1) },
    uFlatten: { value: 0.8 }, uBladeN: { value: v3(0, 1, 0) }, uSori: { value: 1 },
  };
  // the blade is a closed shell with outward faces: front faces only, so its far flat is never shaded under the near one
  const steel = (defines) => new ShaderMaterial({ ...base, side: FrontSide, vertexShader: swordV, fragmentShader: frag(STEEL_F), uniforms: steelU, defines: { BEND: '', ...defines } });
  const metalU = (o) => ({ ...U, tIshime: { value: T.ishime }, uAxisW: { value: v3(1, 0, 0) }, uFaceU: { value: v3(0, 0, 1) }, uFaceV: { value: v3(0, 1, 0) }, uBackGlow: { value: v3() }, ...o });
  // the fittings are closed, outward-wound shells: front faces only, so they all share one program (the tang, wound
  // both ways, keeps its own; it is never drawn on the boot path)
  const metal = (o, defines = {}, side = FrontSide) => new ShaderMaterial({ ...base, side, vertexShader: swordV, fragmentShader: frag(METAL_F), uniforms: metalU(o), defines });
  const silkU = { ...U, tSilk: { value: T.silk } };
  const m = {
    steelU,
    steel: steel({}),
    steelSign: steel({ SIGN: '' }),
    steelTogi: steel({ SIGN: '', TOGI: '' }),
    steelReveal: null,
    copper: metal({ uBase: { value: v3(0.80, 0.46, 0.24) }, uRough: { value: 0.26 }, uMetal: { value: 1 }, uKind: { value: 0 } }),
    gold: metal({ uBase: { value: v3(0.86, 0.66, 0.32) }, uRough: { value: 0.2 }, uMetal: { value: 1 }, uKind: { value: 1 } }),
    iron: metal({ uBase: { value: v3(0.055, 0.048, 0.042) }, uRough: { value: 0.55 }, uMetal: { value: 0.6 }, uKind: { value: 2 } }),
    shakudo: metal({ uBase: { value: v3(0.035, 0.038, 0.048) }, uRough: { value: 0.28 }, uMetal: { value: 0.85 }, uKind: { value: 3 } }),
    nakago: metal({ uBase: { value: v3(0.075, 0.045, 0.028) }, uRough: { value: 0.62 }, uMetal: { value: 0.55 }, uKind: { value: 4 } }, {}, DoubleSide),
    silk: new ShaderMaterial({ ...base, vertexShader: swordV, fragmentShader: frag(SILK_F), uniforms: silkU }),
    lacquer: new ShaderMaterial({ ...base, vertexShader: swordV, fragmentShader: frag(LACQ_F), uniforms: { ...U, tHada: { value: T.hada }, uHornEnd: { value: 0.14 }, uBandEnd: { value: 0.56 }, uSayaLen: { value: 7.5 }, uPart: { value: 0 } } }),
    kurikata: null,
  };
  m.kurikata = new ShaderMaterial({ ...base, vertexShader: swordV, fragmentShader: frag(LACQ_F), uniforms: { ...m.lacquer.uniforms, uPart: { value: 1 } } });
  // the reveal is a uniform state of the same programs
  m.steelReveal = m.steel;
  m.reveal = { copper: m.copper, gold: m.gold, iron: m.iron, shakudo: m.shakudo, silk: m.silk };
  return m;
}

export const SRC = { COMMON, SHADOW_F, PLANE_V, FLOOR_F, QUAD_V, COMP_F, RAYS_F, DISC_V, DISC_F, frag };
export const BLEND_PREMUL = { blending: CustomBlending, blendEquation: AddEquation, blendSrc: OneFactor, blendDst: OneMinusSrcAlphaFactor, blendSrcAlpha: OneFactor, blendDstAlpha: OneMinusSrcAlphaFactor };
export const BLEND_ADD = { blending: CustomBlending, blendEquation: AddEquation, blendSrc: OneFactor, blendDst: OneFactor, blendSrcAlpha: ZeroFactor, blendDstAlpha: OneFactor };
export { FrontSide };
