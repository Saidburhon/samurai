// One-time bakes (bake.js): the prototype's procedural noise, rendered once into mipmapped textures so the
// materials only sample (§2.1). vUv covers the texture; each bake maps it to its own domain. One program for every
// bake (uMode), so a software renderer compiles it once.
uniform int uMode;
varying vec2 vUv;
float hash11(float n){ return fract(sin(n*12.9898)*43758.5453); }
float noise1(float x){ float i=floor(x), f=fract(x); float u=f*f*(3.-2.*f); return mix(hash11(i), hash11(i+1.), u); }
float fbm1(float x){ float a=.5, s=0.; for(int i=0;i<4;i++){ s+=a*noise1(x); x=x*2.03+17.1; a*=.5; } return s/.9375; }
float hash12(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
vec3 hash32(vec2 p){ vec3 p3=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973)); p3+=dot(p3,p3.yxz+33.33); return fract((p3.xxy+p3.yzz)*p3.zyx); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash12(i),hash12(i+vec2(1,0)),u.x), mix(hash12(i+vec2(0,1)),hash12(i+vec2(1,1)),u.x), u.y); }
float fbm2(vec2 p){ float a=.5,s=0.; for(int i=0;i<5;i++){ s+=a*vnoise(p); p=p*2.02+vec2(13.1,7.7); a*=.5; } return s/.96875; }

// blade UV: u in [-0.05, 1], v in [0, 1]. r = hada (+.5), g = mist, b = suna, a = ashi
vec4 bakeHada(vec2 uv){
  float u = mix(-0.05, 1.0, uv.x), v = uv.y;
  float g1 = fbm2(vec2(u*160., v*7.));
  float g2 = fbm2(vec2(u*520., v*22.) + 3.1);
  float hada = (g1-.5)*.75 + (g2-.5)*.35;
  float mist = fbm2(vec2(u*60., v*14.));
  float suna = fbm2(vec2(u*240., v*5.));
  float ashi = smoothstep(.55,.9, fbm2(vec2(u*55., 1.)));
  return vec4(clamp(hada + .5, 0., 1.), mist, suna, ashi);
}
vec4 bakeHamon(vec2 uv){
  float u = clamp(mix(-0.05, 1.0, uv.x), 0., 1.);
  float n = 0.70 + 0.040*sin(6.283185*5.3*u + 0.8)
                 + 0.022*sin(6.283185*13.1*u + 2.3)
                 + 0.018*(fbm1(u*38.0) - 0.5)
                 + 0.030*pow(max(0., sin(6.283185*9.0*u + 1.1)), 6.0);
  n = mix(0.80, n, smoothstep(0.0, 0.06, u));
  return vec4(mix(n, 0.25, smoothstep(0.975, 1.0, u)), 0., 0., 1.);
}
uniform float uDiamonds;
vec3 ikat(float along, float across, float ribbon){
  // atlas abr: colour fields with feathered, cloud-like boundaries
  vec3 ai = vec3(.022,.030,.085), ish = vec3(.035,.25,.29), anor = vec3(.30,.035,.05), cream = vec3(.66,.58,.44);
  float j = (fbm1(across*1.15 + along*0.7 + ribbon*5.1) - .5) * .22 + (fbm1(across*7. + along*4. + ribbon) - .5) * .035;
  float p = fract(along*0.42 + ribbon*0.29 + j);
  vec3 c = ai;
  c = mix(c, ish,   smoothstep(.35,.40,p) * (1.-smoothstep(.46,.51,p)));
  c = mix(c, cream, smoothstep(.46,.51,p) * (1.-smoothstep(.515,.565,p)));
  c = mix(c, anor,  smoothstep(.515,.565,p) * (1.-smoothstep(.595,.645,p)));
  c = mix(c, cream, smoothstep(.595,.645,p) * (1.-smoothstep(.64,.69,p)));
  c = mix(c, ish,   smoothstep(.64,.69,p) * (1.-smoothstep(.72,.78,p)));
  return c;
}
// the grip in (t along, φ around): albedo + height when masks is false, (ribbon, menuki) when true
vec4 bakeSilk(vec2 uv, bool masks){
  float t = uv.x, ph = uv.y;
  float X = t * uDiamonds, Y = ph * 2. + .25;
  float A = X + Y, Bc = X - Y;
  float ca = fract(A + .5) - .5, cb = fract(Bc + .5) - .5;
  float hw = .31;
  float inA = 1. - smoothstep(hw - .015, hw + .015, abs(ca));
  float inB = 1. - smoothstep(hw - .015, hw + .015, abs(cb));
  float crs = mod(floor(A + .5) + floor(Bc + .5), 2.);
  float topA = crs < .5 ? 1. : 0.;
  float showA = inA * (topA > .5 ? 1. : 1. - inB);
  float showB = inB * (topA > .5 ? 1. - inA : 1.);
  float ribbon = max(showA, showB);
  float acr = showA > showB ? ca/hw : cb/hw;
  float alongC = showA > showB ? Bc : A;
  float rid = showA > showB ? floor(A + .5) : floor(Bc + .5) + 7.;
  float edgeShade = 1. - .45*pow(abs(acr), 3.);
  float under = (showA > .5 && inB > .5 && topA < .5) || (showB > .5 && inA > .5 && topA > .5) ? 1. : 0.;
  float weave = sin(alongC*180.)*.5+.5;
  vec3 silk = ikat(alongC, acr, rid);
  // ray skin (samegawa) in the windows: lacquered white nodules
  vec2 sp = vec2(t*uDiamonds*14., ph*30.);
  vec2 ci = floor(sp), cf = fract(sp);
  float md = 1.;
  for (int j=-1;j<=1;j++) for (int i=-1;i<=1;i++){ vec2 o = vec2(i,j); vec2 rp = o + hash32(ci+o).xy*.8+.1 - cf; md = min(md, dot(rp,rp)); }
  float nod = 1. - smoothstep(.05,.30, md);
  float dwin = min(abs(ca), abs(cb)) - hw;
  float ao = smoothstep(0., .14, dwin);
  vec3 same = vec3(.86,.82,.72) * (0.78 + .22*nod) * (0.45 + .55*ao);
  // the menuki: a gilt cotton boll under the wrap, at the middle of the top face
  float mt = (t - .52) * uDiamonds, mp = (ph - .25) * 2.;
  float menR = length(vec2(mt*1.0, mp*3.2));
  float menuki = (1. - smoothstep(.40,.46, menR)) * (1.-ribbon);
  float h = ribbon * (1. - acr*acr) * .9 + weave*.06*ribbon + (1.-ribbon)*nod*.35;
  float ang = atan(mp*3.2, mt);
  float petals = .5 + .5*cos(ang*5.);
  h += menuki * (.6 + .4*petals) * (1. - menR*1.6);
  vec3 alb = mix(same, silk * edgeShade * (under > .5 ? .55 : 1.), ribbon);
  alb = mix(alb, vec3(.80,.60,.30), menuki);
  return masks ? vec4(ribbon, menuki, 0., 1.) : vec4(alb, clamp(h, 0., 1.));
}

// the tsuba face, [-0.41, 0.41]^2: rg = the height gradient (normal map), b = the coarse variation, a = the height
float ish(vec2 p){ return fbm2(p*90.)*.8 + vnoise(p*420.)*.5; }
vec4 bakeIshime(vec2 uv){
  vec2 p = (uv - .5) * 0.82;
  float e = 0.82 / 512.;
  float h = ish(p);
  float hx = ish(p + vec2(e, 0.)) - ish(p - vec2(e, 0.));
  float hy = ish(p + vec2(0., e)) - ish(p - vec2(0., e));
  // the gradient in face units, scaled so a stone mark tilts the normal by a few degrees
  vec2 g = vec2(hx, hy) / (2. * e) * 0.0012;
  return vec4(clamp(g * .5 + .5, 0., 1.), fbm2(p*90.), clamp(vnoise(p*420.), 0., 1.));
}
void main(){
  if (uMode == 0) gl_FragColor = bakeHamon(vUv);
  else if (uMode == 1) gl_FragColor = bakeHada(vUv);
  else if (uMode == 2) gl_FragColor = vUv.y < .5 ? bakeSilk(vec2(vUv.x, vUv.y * 2.), false) : bakeSilk(vec2(vUv.x, vUv.y * 2. - 1.), true);
  else gl_FragColor = bakeIshime(vUv);
}
