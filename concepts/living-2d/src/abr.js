// Abr 絣 — indigo warp-ikat cloth, one fragment shader (WebGL2).
const VS = `#version 300 es
in vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;

const FS = `#version 300 es
precision highp float;
uniform vec2 uRes; uniform float uDpr; uniform float uTime; uniform float uContrast; uniform float uScale;
uniform vec4 uBoxes[6]; uniform int uNBoxes; uniform vec3 uSheen; uniform vec2 uOffset; uniform float uSeed;
uniform vec4 uShade; // x,y,radius,strength : soft vignette-like light
out vec4 o;
float h11(float n){ return fract(sin(n*12.9898+uSeed)*43758.5453); }
float h21(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7))+uSeed)*43758.5453); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),f.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x), f.y); }
float ndot(vec2 a, vec2 b){ return a.x*b.x - a.y*b.y; }
float sdRhombus(vec2 p, vec2 b){ p=abs(p); float h=clamp((-2.*ndot(p,b)+ndot(b,b))/dot(b,b),-1.,1.);
  float d=length(p-.5*b*vec2(1.-h,1.+h)); return d*sign(p.x*b.y+p.y*b.x-b.x*b.y); }
float sdBox(vec2 p, vec2 b){ vec2 d=abs(p)-b; return length(max(d,0.))+min(max(d.x,d.y),0.); }

// dye level at a point (css px, motif space). 0 ground, 1 light, 2 deep, 3 white
float motif(vec2 p){
  vec2 cell = vec2(360., 520.);
  vec2 q = mod(p, cell) - cell*.5;
  float lv = 0.;
  // ilon izi: snake-track zigzag on the cell border
  float bx = mod(p.x + 180., 360.) - 180.;
  float tri = abs(fract(p.y/104.) - .5)*4. - 1.;
  float zc = tri*24.;
  float dz = abs(bx - zc);
  if (dz < 15.) lv = 1.;
  if (dz < 4.5) lv = 3.;
  // little resist dots in the zigzag's elbows
  vec2 ed = vec2(bx - (-zc)*0.0, mod(p.y, 52.) - 26.);
  // taroq combs flanking the lozenge waist
  float ax = abs(q.x), ay = q.y;
  if (abs(ay) < 46. && ax > 104. && ax < 152.) {
    if (ax > 140.) lv = 2.;
    else if (mod(ay + 46., 23.) < 10.) lv = 2.;
  }
  // the lozenge chain
  float d1 = sdRhombus(q, vec2(98., 236.));
  if (d1 < 0.) lv = 1.;
  if (abs(d1 + 9.) < 5.5) lv = 3.;
  float d2 = sdRhombus(q, vec2(56., 136.));
  if (d2 < 0.) lv = 2.;
  if (abs(d2 + 6.) < 3.5) lv = 1.;
  float d3 = sdRhombus(q, vec2(19., 48.));
  if (d3 < 0.) lv = 3.;
  // small diamonds between the chain links
  vec2 q2 = mod(p + vec2(0., 260.), cell) - cell*.5;
  float d4 = sdRhombus(q2, vec2(30., 40.));
  if (d4 < 0. && abs(q2.x) < 30.) lv = (d4 < -9.) ? 2. : 3.;
  // ko-gasuri: small feathered white marks scattered in the ground (Japanese kasuri)
  if (lv == 0.) {
    vec2 g = vec2(46., 34.);
    vec2 id = floor(p / g);
    vec2 r = mod(p + vec2(mod(id.y, 2.) * g.x * .5, 0.), g) - g * .5;
    float h = fract(sin(dot(id, vec2(41.3, 289.1))) * 9137.7);
    if (h > .35 && abs(r.x) < 5.5 && abs(r.y) < 1.6) lv = 4.;
    if (h > .82 && abs(r.y) < 5.5 && abs(r.x) < 1.6) lv = 4.;
  }
  return lv;
}

vec3 dyeOf(float lv, vec3 ai, vec3 aiL, vec3 aiD, vec3 kinu){
  if (lv == 1.) return mix(aiL, ai, .18); if (lv == 2.) return aiD; if (lv == 3.) return mix(ai, kinu, .58); if (lv == 4.) return mix(ai, kinu, .42); return ai; }
void main(){
  vec2 fc = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr; // css px, y down
  vec2 p = fc + uOffset;
  float sc = uScale;
  // warp threads run vertically; each thread (2px) belongs to a tied bundle that shifts along the warp
  float col = floor(p.x / 2.);
  float bundle = floor(p.x / 9.);
  float shift = (h11(bundle) - .5) * 15. + (h11(col*1.37) - .5) * 6. + (vn(vec2(col*.08, p.y/90.)) - .5) * 9.
              + sin(uTime*.6 + col*.03) * 1.2;
  vec2 mp = vec2(p.x, p.y + shift) / sc;
  float lv = motif(mp);
  float lvA = motif(mp + vec2(0., 2.6)/sc), lvB = motif(mp - vec2(0., 2.6)/sc), lvC = motif(mp + vec2(1.4, 5.)/sc);
  // calm the motif behind text blocks
  float calm = 0.;
  for (int i = 0; i < 6; i++) { if (i >= uNBoxes) break; vec4 b = uBoxes[i];
    float d = sdBox(fc - (b.xy + b.zw*.5), b.zw*.5);
    calm = max(calm, 1. - smoothstep(-10., 60., d)); }
  float c = uContrast * (1. - .7 * calm);
  vec3 ai = vec3(30., 45., 102.)/255.;
  vec3 aiL = vec3(58., 91., 170.)/255.;
  vec3 aiD = vec3(17., 27., 68.)/255.;
  vec3 kinu = vec3(239., 232., 216.)/255.;
  vec3 dye = (dyeOf(lv, ai, aiL, aiD, kinu) * 2. + dyeOf(lvA, ai, aiL, aiD, kinu) + dyeOf(lvB, ai, aiL, aiD, kinu) + dyeOf(lvC, ai, aiL, aiD, kinu)) / 5.;
  vec3 col3 = mix(ai, dye, c);
  // thread-level variation: warp threads, weft picks
  float tj = (h11(col*3.1) - .5) * .05;
  float warp = mod(p.x, 2.) < 1. ? -.035 : .0;
  float wy = fract(p.y / 2.5);
  float weft = (abs(wy - .5) * 2.) * -.022;
  // slub: thicker threads now and then
  float slub = smoothstep(.93, 1., vn(vec2(col*.9, p.y/40.))) * .06;
  col3 *= 1. + tj + warp + weft + slub;
  // broad cloth light: soft, low, never a blob
  float broad = (vn(p/420.) - .5) * .07 + (vn(p/160. + 7.) - .5) * .03;
  col3 *= 1. + broad;
  float L = length((fc - uShade.xy) / uShade.z);
  col3 *= 1. - uShade.w * smoothstep(.2, 1.3, L);
  // atlas satin sheen: anisotropic, along the weft, carried by the warp floats
  vec2 sd = (fc - uSheen.xy) / vec2(260., 60.);
  float sh = exp(-dot(sd, sd)) * uSheen.z;
  float floatMask = .6 + .4 * vn(vec2(col*.5, p.y/6.));
  col3 += sh * floatMask * vec3(.32, .36, .46) * (1. - .55*smoothstep(1.5,3.,lv));
  o = vec4(col3, 1.);
}`;

export function createAbr(canvas, opts = {}) {
  const gl = canvas.getContext('webgl2', { antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: true });
  if (!gl) return null;
  const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(x)); return x; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
  gl.useProgram(pr);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n) => gl.getUniformLocation(pr, n);
  const u = { res: U('uRes'), dpr: U('uDpr'), time: U('uTime'), contrast: U('uContrast'), scale: U('uScale'), boxes: U('uBoxes'), nb: U('uNBoxes'), sheen: U('uSheen'), off: U('uOffset'), seed: U('uSeed'), shade: U('uShade') };
  function render(P = {}) {
    const dpr = P.dpr ?? 1;
    const w = P.w, h = P.h;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u.res, canvas.width, canvas.height);
    gl.uniform1f(u.dpr, dpr);
    gl.uniform1f(u.time, P.time ?? 0);
    gl.uniform1f(u.contrast, P.contrast ?? 0.6);
    gl.uniform1f(u.scale, P.scale ?? 1);
    gl.uniform1f(u.seed, P.seed ?? 0.0);
    const boxes = (P.boxes || []).slice(0, 6); const arr = new Float32Array(24);
    boxes.forEach((bx, i) => arr.set(bx, i * 4));
    gl.uniform4fv(u.boxes, arr); gl.uniform1i(u.nb, boxes.length);
    const s = P.sheen || [w * 0.7, h * 0.4, 0.0];
    gl.uniform3f(u.sheen, s[0], s[1], s[2]);
    const off = P.offset || [0, 0]; gl.uniform2f(u.off, off[0], off[1]);
    const sd = P.shade || [w * 0.4, h * 0.4, Math.max(w, h) * 0.9, 0.12]; gl.uniform4f(u.shade, sd[0], sd[1], sd[2], sd[3]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  return { render, gl };
}
