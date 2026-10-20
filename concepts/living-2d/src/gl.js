// Stage 舞台 — the one WebGL2 canvas behind the whole page. It draws every non-text visual:
// paper, ink, cloth, cut pieces and their shadows, seals, washes and steel glints.
// Everything is drawn in css px with a transform + convex-clip stack, so a scene can be cut
// into pieces simply by drawing it twice under two half-planes and two transforms.
import { ABR_GLSL } from './abr.js';

const VS = `#version 300 es
in vec2 aPos;
uniform vec4 uRect; uniform mat3 uM; uniform vec2 uView;
out vec2 vL;
void main(){ vec2 p = uRect.xy + aPos * uRect.zw; vL = p; vec2 s = (uM * vec3(p, 1.)).xy;
  gl_Position = vec4(s.x / uView.x * 2. - 1., 1. - s.y / uView.y * 2., 0., 1.); }`;

const HEAD = `#version 300 es
precision highp float;
in vec2 vL; out vec4 o;
uniform vec3 uE[8]; uniform int uNE; uniform int uCut;
float clipD(vec2 p, out float dc){ float d = 1e5; dc = 1e5;
  for (int i = 0; i < 8; i++) { if (i >= uNE) break; float e = dot(uE[i].xy, p) + uE[i].z; d = min(d, e); if (((uCut >> i) & 1) == 1) dc = min(dc, e); }
  return d; }
float hashp(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float vnz(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(hashp(i), hashp(i+vec2(1,0)), f.x), mix(hashp(i+vec2(0,1)), hashp(i+vec2(1,1)), f.x), f.y); }
`;

// paper: washi texture (rgb + fibre in a), tint, cut-edge steel line, optional kirie holes, healing, cylinder shading
const FS_PAPER = HEAD + `
uniform sampler2D uTex; uniform vec4 uXf; uniform vec3 uTint; uniform float uA; uniform float uLift;
uniform int uHole; uniform sampler2D uM0; uniform sampler2D uM1; uniform vec4 uHR; uniform vec4 uC0; uniform vec4 uC1;
uniform vec4 uHeal; uniform float uHealF; uniform vec4 uCyl; uniform vec4 uDeckle;
float holeAt(vec2 p){ vec2 u = (p - uHR.xy) / uHR.zw; if (u.x < 0. || u.y < 0. || u.x > 1. || u.y > 1.) return 0.;
  return clamp(dot(texture(uM0, u), uC0) + dot(texture(uM1, u), uC1), 0., 1.); }
void main(){
  float dc; float d = clipD(vL, dc);
  // deckled natural edge: a ragged line (only on one edge, given as a line + amplitude)
  if (uDeckle.w > 0.) { float e = dot(uDeckle.xy, vL) + uDeckle.z; float n = (vnz(vL * .09) - .5) * 2. + (vnz(vL * .35 + 3.) - .5) * .8; d = min(d, e + n * uDeckle.w); }
  float a = clamp(d + .5, 0., 1.);
  if (a <= 0.) discard;
  vec4 P = texture(uTex, vL * uXf.xy + uXf.zw);
  vec3 c = P.rgb * uTint;
  if (uCyl.w > 0.) { // a rolled part: shade across the roll
    float u = clamp(((uCyl.x > .5 ? vL.y : vL.x) - uCyl.y) / uCyl.z, -1., 1.);
    float s = sqrt(max(0., 1. - u*u));
    c *= mix(1., .58 + .5 * s + .12 * pow(s, 18.), uCyl.w);
  }
  if (uHeal.w > 0.) { // pulp healing: new paper grows from the cut line
    float dl = dot(uHeal.xy, vL) + uHeal.z;
    float n = vnz(vL * .07) * 22. + vnz(vL * .4 + 9.) * 6.;
    float grown = 1. - smoothstep(uHealF - 2., uHealF + 2., dl - n * uHeal.w);
    a *= grown;
    if (a <= 0.) discard;
  }
  if (dc < 4.) { // razor-clean cut edge: .6px dark line under a 1.2px steel-light core
    c = mix(c, vec3(.08, .06, .05), (1. - smoothstep(0., .9, dc)) * .5);
    c = mix(c, vec3(.975, .96, .93), smoothstep(.6, 1.1, dc) * (1. - smoothstep(1.7, 2.6, dc)) * (.85 + .15 * uLift));
  }
  float al = a * uA;
  if (uHole == 1) {
    float h = holeAt(vL);
    vec2 sp = vL - vec2(5., 9.);
    float sh = 0.;
    sh += holeAt(sp); sh += holeAt(sp + vec2(4., 0.)); sh += holeAt(sp - vec2(4., 0.)); sh += holeAt(sp + vec2(0., 4.)); sh += holeAt(sp - vec2(0., 4.));
    sh = 1. - sh / 5.;
    float rim = max(max(holeAt(vL + vec2(1.4, 0.)), holeAt(vL - vec2(1.4, 0.))), max(holeAt(vL + vec2(0., 1.4)), holeAt(vL - vec2(0., 1.4))));
    float ring = clamp(rim - h, 0., 1.);
    c = mix(c, vec3(.98, .965, .935), ring * .85);
    vec4 paper = vec4(c * al, al);
    vec4 shadow = vec4(vec3(.02, .02, .06) * .0, .5 * sh * al);
    o = mix(paper, shadow, h);
  } else o = vec4(c * al, al);
}`;

// ink: a Fude field (r = density, g = arrival time) revealed by progress; multiplied onto paper (or screened, for kinu ink on cloth)
const FS_INK = HEAD + `
uniform sampler2D uF; uniform vec4 uFR; uniform float uP; uniform float uWetK; uniform float uAge; uniform vec3 uInk; uniform float uA;
uniform sampler2D uTex; uniform vec4 uXf; uniform int uScreen;
void main(){
  float dc; float a = clamp(clipD(vL, dc) + .5, 0., 1.);
  if (a <= 0.) discard;
  vec2 uv = (vL - uFR.xy) / uFR.zw;
  if (uv.x < 0. || uv.y < 0. || uv.x > 1. || uv.y > 1.) discard;
  vec2 F = texture(uF, uv).rg;
  float d = F.r, ta = F.g;
  if (d < .003) discard;
  float shown = uP >= 1. ? 1. : smoothstep(ta, ta + .003, uP + .0004);
  float age = max(0., uP - ta) + uAge;
  float wet = exp(-age * uWetK);
  float f = texture(uTex, vL * uXf.xy + uXf.zw).a;
  float A = d * shown * (1. - .08 * f * (1. - wet)) * a * uA;
  if (uScreen == 1) { o = vec4(uInk * A, 1.); return; }
  vec3 ink = uInk * (1. - wet * vec3(.35, .3, .1)) + vec3(0., 0., wet * .025);
  o = vec4(vec3(1.) - A + A * ink, 1.);
}`;

const FS_CLOTH = HEAD + ABR_GLSL + `
uniform float uA;
void main(){ float dc; float a = clamp(clipD(vL, dc) + .5, 0., 1.) * uA; if (a <= 0.) discard;
  vec3 c = cloth(vL);
  if (dc < 3.) c = mix(c, vec3(.83, .86, .9), smoothstep(.5, 1., dc) * (1. - smoothstep(1.4, 2.2, dc)) * .55);
  o = vec4(c * a, a); }`;

// soft shadow of a convex piece (its clip edges), drawn under the piece
const FS_SHADOW = HEAD + `
uniform float uA; uniform float uBlur;
void main(){ float dc; float d = clipD(vL, dc); float s = uA * smoothstep(-uBlur, uBlur * .6, d); if (s <= .002) discard; o = vec4(vec3(.055, .04, .13) * s * .0, s); }`;

// sprite: a premultiplied texture; mode 0 over, 1 multiply (seal paste), 2 shadow (blurred alpha via lod)
const FS_SPRITE = HEAD + `
uniform sampler2D uS; uniform vec4 uSR; uniform float uA; uniform int uMode; uniform float uLod; uniform vec3 uCol;
void main(){ float dc; float a = clamp(clipD(vL, dc) + .5, 0., 1.); if (a <= 0.) discard;
  vec2 uv = (vL - uSR.xy) / uSR.zw; if (uv.x < 0. || uv.y < 0. || uv.x > 1. || uv.y > 1.) discard;
  vec4 t = uMode == 2 ? textureLod(uS, uv, uLod) : texture(uS, uv);
  float al = t.a * a * uA;
  if (uMode == 1) { vec3 col = t.a > 0. ? t.rgb / t.a : vec3(1.); o = vec4(vec3(1.) - al + al * col, 1.); return; }
  if (uMode == 2) { o = vec4(0., 0., 0., al); return; }
  o = t * a * uA; }`;

// a cut-out fragment of paper: colour from the sheet texture, alpha from one channel of a mask (front or back side)
const FS_FRAG = HEAD + `
uniform sampler2D uTex; uniform vec4 uXf; uniform sampler2D uMk; uniform vec4 uMR; uniform vec4 uCh; uniform float uA; uniform int uMode; uniform float uBack; uniform float uLod;
void main(){ vec2 u = (vL - uMR.xy) / uMR.zw; if (u.x < 0. || u.y < 0. || u.x > 1. || u.y > 1.) discard;
  float m = dot(uMode == 1 ? textureLod(uMk, u, uLod) : texture(uMk, u), uCh) * uA; if (m <= .003) discard;
  if (uMode == 1) { o = vec4(0., 0., 0., m); return; }
  vec3 c = texture(uTex, vL * uXf.xy + uXf.zw).rgb;
  c = mix(c, c * vec3(.93, .9, .84), uBack);
  o = vec4(c * m, m); }`;

// watercolour wash: r = coverage, g = reveal order; multiplied onto the paper
const FS_WASH = HEAD + `
uniform sampler2D uW; uniform vec4 uWR; uniform float uBloom; uniform vec3 uCol; uniform float uA;
void main(){ float dc; float a = clamp(clipD(vL, dc) + .5, 0., 1.); if (a <= 0.) discard;
  vec2 uv = (vL - uWR.xy) / uWR.zw; if (uv.x < 0. || uv.y < 0. || uv.x > 1. || uv.y > 1.) discard;
  vec4 w = texture(uW, uv); float shown = 1. - smoothstep(uBloom - .04, uBloom, w.g);
  float A = w.r * shown * a * uA; if (A <= .002) discard;
  o = vec4(vec3(1.) - A + A * uCol, 1.); }`;

// steel glint: a line with a travelling head (additive)
const FS_GLINT = HEAD + `
uniform vec2 uP0; uniform vec2 uP1; uniform float uT; uniform float uTail; uniform float uI; uniform float uFlare;
void main(){ vec2 d = uP1 - uP0; float L = length(d); vec2 u = d / L; vec2 nn = vec2(-u.y, u.x);
  vec2 q = vL - uP0; float s = dot(q, u), n = dot(q, nn);
  float head = uT * L, t0 = max(0., uT - uTail) * L;
  float along = smoothstep(t0, head, s) * (1. - smoothstep(head, head + 2., s));
  float core = exp(-n * n / 1.6) * along, bloom = exp(-n * n / 26.) * along * .3;
  vec2 hq = vL - (uP0 + u * head); float r = length(hq);
  float flare = exp(-r * r / (uFlare * uFlare * .05)) * .95 + exp(-r / uFlare * 3.2) * .22;
  float sx = dot(hq, u), sy = dot(hq, nn);
  float streak = exp(-sx * sx / (uFlare * uFlare * 14.) - sy * sy / 6.5) * .8;
  vec3 c = vec3(1., .99, .97) * (core + flare + streak) + vec3(.84, .88, .93) * bloom;
  c *= uI; if (max(c.r, c.b) < .003) discard; o = vec4(c, 0.); }`;

// steel light travelling around the outline of one kirie piece (additive)
const FS_RING = HEAD + `
uniform sampler2D uMk; uniform vec4 uMR; uniform vec4 uCh; uniform vec2 uC; uniform float uA0; uniform float uSweep; uniform float uI;
void main(){ vec2 u = (vL - uMR.xy) / uMR.zw; if (u.x < 0. || u.y < 0. || u.x > 1. || u.y > 1.) discard;
  vec2 px = vec2(1.7 / uMR.z, 0.), py = vec2(0., 1.7 / uMR.w);
  float m0 = dot(texture(uMk, u), uCh);
  float d = max(max(dot(texture(uMk, u + px), uCh), dot(texture(uMk, u - px), uCh)), max(dot(texture(uMk, u + py), uCh), dot(texture(uMk, u - py), uCh)));
  float ring = clamp((d - m0) * 1.6, 0., 1.);
  if (ring <= .01) discard;
  float ang = mod(atan(vL.y - uC.y, vL.x - uC.x) - uA0 + 12.566370, 6.2831853);
  float vis = ang < uSweep ? mix(.18, 1., smoothstep(uSweep - 1.4, uSweep, ang)) : 0.;
  vec3 c = vec3(1., .99, .96) * ring * vis * uI;
  o = vec4(c, 0.); }`;

export function createStage(canvas) {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, premultipliedAlpha: true, preserveDrawingBuffer: false, powerPreference: 'high-performance' });
  if (!gl) return null;
  const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) + '\n' + src.split('\n').map((l, i) => i + 1 + ': ' + l).join('\n').slice(0, 3000)); return s; };
  const vs = compile(gl.VERTEX_SHADER, VS);
  const quad = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
  const vao = gl.createVertexArray(); gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const progs = {};
  function prog(name, fs) {
    const p = gl.createProgram(); gl.attachShader(p, vs); gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(p, 0, 'aPos'); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {}; const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) { const info = gl.getActiveUniform(p, i); const nm = info.name.replace(/\[0\]$/, ''); u[nm] = gl.getUniformLocation(p, info.name); }
    progs[name] = { p, u };
  }
  prog('paper', FS_PAPER); prog('ink', FS_INK); prog('cloth', FS_CLOTH); prog('shadow', FS_SHADOW);
  prog('sprite', FS_SPRITE); prog('frag', FS_FRAG); prog('wash', FS_WASH); prog('glint', FS_GLINT); prog('ring', FS_RING);

  let W = 1, H = 1, dpr = 1;
  const ident = [1, 0, 0, 1, 0, 0];
  let stack = [{ M: ident, E: [] }];
  let cur = null;

  function use(name) {
    const P = progs[name];
    if (cur !== P) { gl.useProgram(P.p); cur = P; }
    const top = stack[stack.length - 1];
    const M = top.M;
    gl.uniformMatrix3fv(P.u.uM, false, [M[0], M[1], 0, M[2], M[3], 0, M[4], M[5], 1]);
    gl.uniform2f(P.u.uView, W, H);
    const E = top.E.slice(-8); const arr = new Float32Array(24); let cutMask = 0;
    E.forEach((e, i) => { arr[i * 3] = e[0]; arr[i * 3 + 1] = e[1]; arr[i * 3 + 2] = e[2]; if (e[3]) cutMask |= 1 << i; });
    if (P.u.uE) gl.uniform3fv(P.u.uE, arr);
    if (P.u.uNE) gl.uniform1i(P.u.uNE, E.length);
    if (P.u.uCut) gl.uniform1i(P.u.uCut, cutMask);
    return P.u;
  }
  function rect(u, x, y, w, h) { gl.uniform4f(u.uRect, x, y, w, h); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); }
  function blend(mode) {
    if (mode === 'over') gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    else if (mode === 'mul') gl.blendFuncSeparate(gl.DST_COLOR, gl.ZERO, gl.ZERO, gl.ONE);
    else if (mode === 'add') gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ZERO, gl.ONE);
    else if (mode === 'screen') gl.blendFuncSeparate(gl.ONE_MINUS_DST_COLOR, gl.ONE, gl.ZERO, gl.ONE);
  }
  let unit = 0;
  function bindTex(u, name, tex) { if (!u[name]) return; gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tex); gl.uniform1i(u[name], unit); unit++; }

  // ---------- textures
  function texFrom(src, opts = {}) { // canvas / ImageData / {w,h,data:Uint8}
    const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !!opts.premul);
    if (src.data && !(src instanceof ImageData)) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, src.w, src.h, 0, gl.RGBA, gl.UNSIGNED_BYTE, src.data);
    else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, src);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    const wrap = opts.repeat ? gl.MIRRORED_REPEAT : gl.CLAMP_TO_EDGE;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
    if (opts.mip) { gl.generateMipmap(gl.TEXTURE_2D); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); }
    else gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return t;
  }
  function fieldTex(f) { // Fude field -> RG16F (density, arrival)
    const n = f.w * f.h, a = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) { a[i * 2] = f.dens[i]; a[i * 2 + 1] = Math.min(f.arr[i], 2); }
    const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG16F, f.w, f.h, 0, gl.RG, gl.FLOAT, a);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return { tex: t, x: f.x0, y: f.y0, w: f.w, h: f.h, starts: f.starts, durs: f.durs };
  }

  // ---------- transform + clip stack
  // M: [a,b,c,d,e,f] maps local -> parent. edges: [nx, ny, c, isCut] in the NEW local space, nx*x+ny*y+c >= 0 is inside.
  function push(M = ident, edges = []) {
    const top = stack[stack.length - 1];
    const P = top.M;
    const nm = [P[0] * M[0] + P[2] * M[1], P[1] * M[0] + P[3] * M[1], P[0] * M[2] + P[2] * M[3], P[1] * M[2] + P[3] * M[3], P[0] * M[4] + P[2] * M[5] + P[4], P[1] * M[4] + P[3] * M[5] + P[5]];
    const E = top.E.map(([a, b, c, k]) => { // transform old-local edges into the new local space
      const na = a * M[0] + b * M[1], nb = a * M[2] + b * M[3], nc = a * M[4] + b * M[5] + c;
      const L = Math.hypot(na, nb) || 1; return [na / L, nb / L, nc / L, k];
    });
    stack.push({ M: nm, E: E.concat(edges) });
  }
  function pop() { stack.pop(); }

  return {
    gl, canvas,
    resize(w, h, d) {
      W = w; H = h; dpr = d;
      const cw = Math.round(w * d), ch = Math.round(h * d);
      if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    },
    begin() {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.disable(gl.DEPTH_TEST); gl.enable(gl.BLEND);
      gl.clearColor(0.933, 0.902, 0.831, 1); gl.clear(gl.COLOR_BUFFER_BIT);
      stack = [{ M: ident, E: [] }]; cur = null;
    },
    push, pop, texFrom, fieldTex,
    paper(o) {
      unit = 0; const u = use('paper'); blend('over');
      bindTex(u, 'uTex', o.tex.tex);
      const xf = o.tex.xf(o.variant ?? 0); gl.uniform4f(u.uXf, xf[0], xf[1], xf[2], xf[3]);
      const t = o.tint ?? [1, 1, 1]; gl.uniform3f(u.uTint, t[0], t[1], t[2]);
      gl.uniform1f(u.uA, o.alpha ?? 1); gl.uniform1f(u.uLift, o.lift ?? 0);
      if (o.hole) {
        gl.uniform1i(u.uHole, 1); bindTex(u, 'uM0', o.hole.m0); bindTex(u, 'uM1', o.hole.m1);
        gl.uniform4f(u.uHR, o.hole.x, o.hole.y, o.hole.w, o.hole.h); gl.uniform4fv(u.uC0, o.hole.c0); gl.uniform4fv(u.uC1, o.hole.c1);
      } else { gl.uniform1i(u.uHole, 0); bindTex(u, 'uM0', o.tex.tex); bindTex(u, 'uM1', o.tex.tex); }
      const hl = o.heal || [0, 0, 0, 0]; gl.uniform4f(u.uHeal, hl[0], hl[1], hl[2], hl[3]); gl.uniform1f(u.uHealF, o.healF ?? 0);
      const cy = o.cyl || [0, 0, 1, 0]; gl.uniform4f(u.uCyl, cy[0], cy[1], cy[2], cy[3]);
      const dk = o.deckle || [0, 0, 0, 0]; gl.uniform4f(u.uDeckle, dk[0], dk[1], dk[2], dk[3]);
      const r = o.rect; rect(u, r[0], r[1], r[2], r[3]);
    },
    ink(f, o) {
      unit = 0; const u = use('ink'); blend(o.screen ? 'screen' : 'mul');
      bindTex(u, 'uF', f.tex); bindTex(u, 'uTex', o.paper.tex);
      const xf = o.paper.xf(o.variant ?? 0); gl.uniform4f(u.uXf, xf[0], xf[1], xf[2], xf[3]);
      const ox = o.dx ?? 0, oy = o.dy ?? 0;
      gl.uniform4f(u.uFR, f.x + ox, f.y + oy, f.w, f.h);
      gl.uniform1f(u.uP, o.p ?? 1); gl.uniform1f(u.uWetK, o.wetK ?? 6); gl.uniform1f(u.uAge, o.age ?? 3);
      const ink = o.ink ?? [22 / 255, 18 / 255, 14 / 255]; gl.uniform3f(u.uInk, ink[0], ink[1], ink[2]);
      gl.uniform1f(u.uA, o.alpha ?? 1); gl.uniform1i(u.uScreen, o.screen ? 1 : 0);
      rect(u, f.x + ox, f.y + oy, f.w, f.h);
    },
    cloth(o) {
      unit = 0; const u = use('cloth'); blend('over');
      gl.uniform1f(u.uTime, o.time ?? 0); gl.uniform1f(u.uContrast, o.contrast ?? 0.55); gl.uniform1f(u.uScale, o.scale ?? 1);
      gl.uniform1f(u.uSeed, o.seed ?? 0); gl.uniform1f(u.uA, o.alpha ?? 1);
      const boxes = (o.boxes || []).slice(0, 6); const arr = new Float32Array(24); boxes.forEach((b, i) => arr.set(b, i * 4));
      gl.uniform4fv(u.uBoxes, arr); gl.uniform1i(u.uNBoxes, boxes.length);
      const s = o.sheen || [0, 0, 0]; gl.uniform3f(u.uSheen, s[0], s[1], s[2]);
      const sd = o.shade || [W * 0.45, H * 0.5, Math.max(W, H) * 0.9, 0.14]; gl.uniform4f(u.uShade, sd[0], sd[1], sd[2], sd[3]);
      const off = o.offset || [0, 0]; gl.uniform2f(u.uOffset, off[0], off[1]);
      const r = o.rect; rect(u, r[0], r[1], r[2], r[3]);
    },
    shadow(o) { // draws inside the current clip, shifted by offset: push the offset transform first
      unit = 0; const u = use('shadow'); blend('over');
      gl.uniform1f(u.uA, o.alpha ?? 0.24); gl.uniform1f(u.uBlur, o.blur ?? 22);
      const r = o.rect; rect(u, r[0], r[1], r[2], r[3]);
    },
    sprite(tex, o) {
      unit = 0; const u = use('sprite'); blend(o.mode === 1 ? 'mul' : 'over');
      bindTex(u, 'uS', tex);
      const r = o.rect; gl.uniform4f(u.uSR, r[0], r[1], r[2], r[3]);
      gl.uniform1f(u.uA, o.alpha ?? 1); gl.uniform1i(u.uMode, o.mode ?? 0); gl.uniform1f(u.uLod, o.lod ?? 0);
      rect(u, r[0], r[1], r[2], r[3]);
    },
    frag(o) {
      unit = 0; const u = use('frag'); blend('over');
      bindTex(u, 'uTex', o.paper.tex); bindTex(u, 'uMk', o.mask);
      const xf = o.paper.xf(o.variant ?? 0); gl.uniform4f(u.uXf, xf[0], xf[1], xf[2], xf[3]);
      const r = o.rect; gl.uniform4f(u.uMR, r[0], r[1], r[2], r[3]); gl.uniform4fv(u.uCh, o.ch);
      gl.uniform1f(u.uA, o.alpha ?? 1); gl.uniform1i(u.uMode, o.shadow ? 1 : 0); gl.uniform1f(u.uBack, o.back ?? 0); gl.uniform1f(u.uLod, o.lod ?? 2.5);
      rect(u, r[0], r[1], r[2], r[3]);
    },
    wash(w, o) {
      unit = 0; const u = use('wash'); blend('mul');
      bindTex(u, 'uW', w.tex); gl.uniform4f(u.uWR, w.x, w.y, w.w, w.h);
      gl.uniform1f(u.uBloom, o.bloom ?? 1); gl.uniform3f(u.uCol, w.col[0], w.col[1], w.col[2]); gl.uniform1f(u.uA, o.alpha ?? 1);
      rect(u, w.x, w.y, w.w, w.h);
    },
    ring(o) {
      unit = 0; const u = use('ring'); blend('add');
      bindTex(u, 'uMk', o.mask); const r = o.rect; gl.uniform4f(u.uMR, r[0], r[1], r[2], r[3]); gl.uniform4fv(u.uCh, o.ch);
      gl.uniform2f(u.uC, o.c[0], o.c[1]); gl.uniform1f(u.uA0, o.a0); gl.uniform1f(u.uSweep, o.sweep); gl.uniform1f(u.uI, o.intensity ?? 1);
      rect(u, r[0], r[1], r[2], r[3]);
    },
    glint(P0, P1, t, o = {}) {
      unit = 0; const u = use('glint'); blend('add');
      gl.uniform2f(u.uP0, P0[0], P0[1]); gl.uniform2f(u.uP1, P1[0], P1[1]);
      gl.uniform1f(u.uT, t); gl.uniform1f(u.uTail, o.tail ?? 0.4); gl.uniform1f(u.uI, o.intensity ?? 1); gl.uniform1f(u.uFlare, o.flare ?? 60);
      const x0 = Math.min(P0[0], P1[0]) - 260, y0 = Math.min(P0[1], P1[1]) - 260;
      rect(u, x0, y0, Math.abs(P1[0] - P0[0]) + 520, Math.abs(P1[1] - P0[1]) + 520);
    },
    get W() { return W; }, get H() { return H; }, get dpr() { return dpr; },
  };
}

// ---------- geometry helpers for the stack
// half-plane on the left of the directed line a->b (in screen y-down that is the side the normal (dy,-dx) points to)
export function halfPlane(a, b, keepSide = 1, cut = true) {
  const dx = b[0] - a[0], dy = b[1] - a[1]; const L = Math.hypot(dx, dy);
  let nx = -dy / L, ny = dx / L; if (keepSide < 0) { nx = -nx; ny = -ny; }
  return [nx, ny, -(nx * a[0] + ny * a[1]), cut ? 1 : 0];
}
export function rectEdges(x, y, w, h, cut = false) {
  return [[1, 0, -x, cut], [-1, 0, x + w, cut], [0, 1, -y, cut], [0, -1, y + h, cut]];
}
export function edgeAt(nx, ny, px, py, cut = false) { const L = Math.hypot(nx, ny); return [nx / L, ny / L, -(nx * px + ny * py) / L, cut ? 1 : 0]; }
