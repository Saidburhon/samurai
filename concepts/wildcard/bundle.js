function _r(r){if(r===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return r}function jp(r,t){r.prototype=Object.create(t.prototype),r.prototype.constructor=r,r.__proto__=t}var si={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},va={duration:.5,overwrite:!1,delay:0},ff,vn,Be,Ci=1e8,Pe=1/Ci,ef=Math.PI*2,dx=ef/4,px=0,Qp=Math.sqrt,mx=Math.cos,gx=Math.sin,ln=function(t){return typeof t=="string"},Xe=function(t){return typeof t=="function"},vr=function(t){return typeof t=="number"},cc=function(t){return typeof t>"u"},sr=function(t){return typeof t=="object"},ri=function(t){return t!==!1},df=function(){return typeof window<"u"},tc=function(t){return Xe(t)||ln(t)},tm=typeof ArrayBuffer=="function"&&ArrayBuffer.isView||function(){},Rn=Array.isArray,_x=/random\([^)]+\)/g,xx=/,\s*/g,Wp=/(?:-?\.?\d|\.)+/gi,pf=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,ys=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,Zu=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,mf=/[+-]=-?[.\d]+/,vx=/[^,'"\[\]\s]+/gi,yx=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,ze,ir,nf,gf,ui={},rc={},em,nm=function(t){return(rc=io(t,ui))&&Pn},hc=function(t,e){return console.warn("Invalid property",t,"set to",e,"Missing plugin? gsap.registerPlugin()")},ya=function(t,e){return!e&&console.warn(t)},im=function(t,e){return t&&(ui[t]=e)&&rc&&(rc[t]=e)||ui},Sa=function(){return 0},Sx={suppressEvents:!0,isStart:!0,kill:!1},ec={suppressEvents:!0,kill:!1},Mx={suppressEvents:!0},_f={},Vr=[],rf={},rm,ni={},Ju={},Xp=30,nc=[],xf="",vf=function(t){var e=t[0],n,i;if(sr(e)||Xe(e)||(t=[t]),!(n=(e._gsap||{}).harness)){for(i=nc.length;i--&&!nc[i].targetTest(e););n=nc[i]}for(i=t.length;i--;)t[i]&&(t[i]._gsap||(t[i]._gsap=new bf(t[i],n)))||t.splice(i,1);return t},Hr=function(t){return t._gsap||vf(Ri(t))[0]._gsap},yf=function(t,e,n){return(n=t[e])&&Xe(n)?t[e]():cc(n)&&t.getAttribute&&t.getAttribute(e)||n},Gn=function(t,e){return(t=t.split(",")).forEach(e)||t},Ye=function(t){return Math.round(t*1e5)/1e5||0},ke=function(t){return Math.round(t*1e7)/1e7||0},Ss=function(t,e){var n=e.charAt(0),i=parseFloat(e.substr(2));return t=parseFloat(t),n==="+"?t+i:n==="-"?t-i:n==="*"?t*i:t/i},bx=function(t,e){for(var n=e.length,i=0;t.indexOf(e[i])<0&&++i<n;);return i<n},sc=function(){var t=Vr.length,e=Vr.slice(0),n,i;for(rf={},Vr.length=0,n=0;n<t;n++)i=e[n],i&&i._lazy&&(i.render(i._lazy[0],i._lazy[1],!0)._lazy=0)},Sf=function(t){return!!(t._initted||t._startAt||t.add)},sm=function(t,e,n,i){Vr.length&&!vn&&sc(),t.render(e,n,i||!!(vn&&e<0&&Sf(t))),Vr.length&&!vn&&sc()},om=function(t){var e=parseFloat(t);return(e||e===0)&&(t+"").match(vx).length<2?e:ln(t)?t.trim():t},am=function(t){return t},fi=function(t,e){for(var n in e)n in t||(t[n]=e[n]);return t},wx=function(t){return function(e,n){for(var i in n)i in e||i==="duration"&&t||i==="ease"||(e[i]=n[i])}},io=function(t,e){for(var n in e)t[n]=e[n];return t},Yp=function r(t,e){for(var n in e)n!=="__proto__"&&n!=="constructor"&&n!=="prototype"&&(t[n]=sr(e[n])?r(t[n]||(t[n]={}),e[n]):e[n]);return t},oc=function(t,e){var n={},i;for(i in t)i in e||(n[i]=t[i]);return n},ga=function(t){var e=t.parent||ze,n=t.keyframes?wx(Rn(t.keyframes)):fi;if(ri(t.inherit))for(;e;)n(t,e.vars.defaults),e=e.parent||e._dp;return t},Tx=function(t,e){for(var n=t.length,i=n===e.length;i&&n--&&t[n]===e[n];);return n<0},lm=function(t,e,n,i,s){n===void 0&&(n="_first"),i===void 0&&(i="_last");var o=t[i],a;if(s)for(a=e[s];o&&o[s]>a;)o=o._prev;return o?(e._next=o._next,o._next=e):(e._next=t[n],t[n]=e),e._next?e._next._prev=e:t[i]=e,e._prev=o,e.parent=e._dp=t,e},uc=function(t,e,n,i){n===void 0&&(n="_first"),i===void 0&&(i="_last");var s=e._prev,o=e._next;s?s._next=o:t[n]===e&&(t[n]=o),o?o._prev=s:t[i]===e&&(t[i]=s),e._next=e._prev=e.parent=null},Gr=function(t,e){t.parent&&(!e||t.parent.autoRemoveChildren)&&t.parent.remove&&t.parent.remove(t),t._act=0},_s=function(t,e){if(t&&(!e||e._end>t._dur||e._start<0))for(var n=t;n;)n._dirty=1,n=n.parent;return t},Ex=function(t){for(var e=t.parent;e&&e.parent;)e._dirty=1,e.totalDuration(),e=e.parent;return t},sf=function(t,e,n,i){return t._startAt&&(vn?t._startAt.revert(ec):t.vars.immediateRender&&!t.vars.autoRevert||t._startAt.render(e,!0,i))},Ax=function r(t){return!t||t._ts&&r(t.parent)},qp=function(t){return t._repeat?ro(t._tTime,t=t.duration()+t._rDelay)*t:0},ro=function(t,e){var n=Math.floor(t=ke(t/e));return t&&n===t?n-1:n},ac=function(t,e){return(t-e._start)*e._ts+(e._ts>=0?0:e._dirty?e.totalDuration():e._tDur)},fc=function(t){return t._end=ke(t._start+(t._tDur/Math.abs(t._ts||t._rts||Pe)||0))},dc=function(t,e){var n=t._dp;return n&&n.smoothChildTiming&&t._ts&&(t._start=ke(n._time-(t._ts>0?e/t._ts:((t._dirty?t.totalDuration():t._tDur)-e)/-t._ts)),fc(t),n._dirty||_s(n,t)),t},cm=function(t,e){var n;if((e._time||!e._dur&&e._initted||e._start<t._time&&(e._dur||!e.add))&&(n=ac(t.rawTime(),e),(!e._dur||wa(0,e.totalDuration(),n)-e._tTime>Pe)&&e.render(n,!0)),_s(t,e)._dp&&t._initted&&t._time>=t._dur&&t._ts){if(t._dur<t.duration())for(n=t;n._dp;)n.rawTime()>=0&&n.totalTime(n._tTime),n=n._dp;t._zTime=-Pe}},rr=function(t,e,n,i){return e.parent&&Gr(e),e._start=ke((vr(n)?n:n||t!==ze?Ai(t,n,e):t._time)+e._delay),e._end=ke(e._start+(e.totalDuration()/Math.abs(e.timeScale())||0)),lm(t,e,"_first","_last",t._sort?"_start":0),of(e)||(t._recent=e),i||cm(t,e),t._ts<0&&dc(t,t._tTime),t},hm=function(t,e){return(ui.ScrollTrigger||hc("scrollTrigger",e))&&ui.ScrollTrigger.create(e,t)},um=function(t,e,n,i,s){if(Ef(t,e,s),!t._initted)return 1;if(!n&&t._pt&&!vn&&(t._dur&&t.vars.lazy!==!1||!t._dur&&t.vars.lazy)&&rm!==ii.frame)return Vr.push(t),t._lazy=[s,i],1},Cx=function r(t){var e=t.parent;return e&&e._ts&&e._initted&&!e._lock&&(e.rawTime()<0||r(e))},of=function(t){var e=t.data;return e==="isFromStart"||e==="isStart"},Rx=function(t,e,n,i){var s=t.ratio,o=e<0||!e&&(!t._start&&Cx(t)&&!(!t._initted&&of(t))||(t._ts<0||t._dp._ts<0)&&!of(t))?0:1,a=t._rDelay,l=0,c,h,u;if(a&&t._repeat&&(l=wa(0,t._tDur,e),h=ro(l,a),t._yoyo&&h&1&&(o=1-o),h!==ro(t._tTime,a)&&(s=1-o,t.vars.repeatRefresh&&t._initted&&t.invalidate())),o!==s||vn||i||t._zTime===Pe||!e&&t._zTime){if(!t._initted&&um(t,e,i,n,l))return;for(u=t._zTime,t._zTime=e||(n?Pe:0),n||(n=e&&!u),t.ratio=o,t._from&&(o=1-o),t._time=0,t._tTime=l,c=t._pt;c;)c.r(o,c.d),c=c._next;e<0&&sf(t,e,n,!0),t._onUpdate&&!n&&hi(t,"onUpdate"),l&&t._repeat&&!n&&t.parent&&hi(t,"onRepeat"),(e>=t._tDur||e<0)&&t.ratio===o&&(o&&Gr(t,1),!n&&!vn&&(hi(t,o?"onComplete":"onReverseComplete",!0),t._prom&&t._prom()))}else t._zTime||(t._zTime=e)},Px=function(t,e,n){var i;if(n>e)for(i=t._first;i&&i._start<=n;){if(i.data==="isPause"&&i._start>e)return i;i=i._next}else for(i=t._last;i&&i._start>=n;){if(i.data==="isPause"&&i._start<e)return i;i=i._prev}},so=function(t,e,n,i){var s=t._repeat,o=ke(e)||0,a=t._tTime/t._tDur;return a&&!i&&(t._time*=o/t._dur),t._dur=o,t._tDur=s?s<0?1e10:ke(o*(s+1)+t._rDelay*s):o,a>0&&!i&&dc(t,t._tTime=t._tDur*a),t.parent&&fc(t),n||_s(t.parent,t),t},Zp=function(t){return t instanceof Cn?_s(t):so(t,t._dur)},Ix={_start:0,endTime:Sa,totalDuration:Sa},Ai=function r(t,e,n){var i=t.labels,s=t._recent||Ix,o=t.duration()>=Ci?s.endTime(!1):t._dur,a,l,c;return ln(e)&&(isNaN(e)||e in i)?(l=e.charAt(0),c=e.substr(-1)==="%",a=e.indexOf("="),l==="<"||l===">"?(a>=0&&(e=e.replace(/=/,"")),(l==="<"?s._start:s.endTime(s._repeat>=0))+(parseFloat(e.substr(1))||0)*(c?(a<0?s:n).totalDuration()/100:1)):a<0?(e in i||(i[e]=o),i[e]):(l=parseFloat(e.charAt(a-1)+e.substr(a+1)),c&&n&&(l=l/100*(Rn(n)?n[0]:n).totalDuration()),a>1?r(t,e.substr(0,a-1),n)+l:o+l)):e==null?o:+e},_a=function(t,e,n){var i=vr(e[1]),s=(i?2:1)+(t<2?0:1),o=e[s],a,l;if(i&&(o.duration=e[1]),o.parent=n,t){for(a=o,l=n;l&&!("immediateRender"in a);)a=l.vars.defaults||{},l=ri(l.vars.inherit)&&l.parent;o.immediateRender=ri(a.immediateRender),t<2?o.runBackwards=1:o.startAt=e[s-1]}return new je(e[0],o,e[s+1])},Wr=function(t,e){return t||t===0?e(t):e},wa=function(t,e,n){return n<t?t:n>e?e:n},yn=function(t,e){return!ln(t)||!(e=yx.exec(t))?"":e[1]},Dx=function(t,e,n){return Wr(n,function(i){return wa(t,e,i)})},af=[].slice,fm=function(t,e){return t&&sr(t)&&"length"in t&&(!e&&!t.length||t.length-1 in t&&sr(t[0]))&&!t.nodeType&&t!==ir},Lx=function(t,e,n){return n===void 0&&(n=[]),t.forEach(function(i){var s;return ln(i)&&!e||fm(i,1)?(s=n).push.apply(s,Ri(i)):n.push(i)})||n},Ri=function(t,e,n){return Be&&!e&&Be.selector?Be.selector(t):ln(t)&&!n&&(nf||!oo())?af.call((e||gf).querySelectorAll(t),0):Rn(t)?Lx(t,n):fm(t)?af.call(t,0):t?[t]:[]},lf=function(t){return t=Ri(t)[0]||ya("Invalid scope")||{},function(e){var n=t.current||t.nativeElement||t;return Ri(e,n.querySelectorAll?n:n===t?ya("Invalid scope")||gf.createElement("div"):t)}},dm=function(t){return t.sort(function(){return .5-Math.random()})},pm=function(t){if(Xe(t))return t;var e=sr(t)?t:{each:t},n=xs(e.ease),i=e.from||0,s=parseFloat(e.base)||0,o={},a=i>0&&i<1,l=isNaN(i)||a,c=e.axis,h=i,u=i;return ln(i)?h=u={center:.5,edges:.5,end:1}[i]||0:!a&&l&&(h=i[0],u=i[1]),function(f,d,p){var _=(p||e).length,g=o[_],m,v,S,x,w,M,E,y,b;if(!g){if(b=e.grid==="auto"?0:(e.grid||[1,Ci])[1],!b){for(E=-Ci;E<(E=p[b++].getBoundingClientRect().left)&&b<_;);b<_&&b--}for(g=o[_]=[],m=l?Math.min(b,_)*h-.5:i%b,v=b===Ci?0:l?_*u/b-.5:i/b|0,E=0,y=Ci,M=0;M<_;M++)S=M%b-m,x=v-(M/b|0),g[M]=w=c?Math.abs(c==="y"?x:S):Qp(S*S+x*x),w>E&&(E=w),w<y&&(y=w);i==="random"&&dm(g),g.max=E-y,g.min=y,g.v=_=(parseFloat(e.amount)||parseFloat(e.each)*(b>_?_-1:c?c==="y"?_/b:b:Math.max(b,_/b))||0)*(i==="edges"?-1:1),g.b=_<0?s-_:s,g.u=yn(e.amount||e.each)||0,n=n&&_<0?Yx(n):n}return _=(g[f]-g.min)/g.max||0,ke(g.b+(n?n(_):_)*g.v)+g.u}},cf=function(t){var e=Math.pow(10,((t+"").split(".")[1]||"").length);return function(n){var i=ke(Math.round(parseFloat(n)/t)*t*e);return(i-i%1)/e+(vr(n)?0:yn(n))}},mm=function(t,e){var n=Rn(t),i,s;return!n&&sr(t)&&(i=n=t.radius||Ci,t.values?(t=Ri(t.values),(s=!vr(t[0]))&&(i*=i)):t=cf(t.increment)),Wr(e,n?Xe(t)?function(o){return s=t(o),Math.abs(s-o)<=i?s:o}:function(o){for(var a=parseFloat(s?o.x:o),l=parseFloat(s?o.y:0),c=Ci,h=0,u=t.length,f,d;u--;)s?(f=t[u].x-a,d=t[u].y-l,f=f*f+d*d):f=Math.abs(t[u]-a),f<c&&(c=f,h=u);return h=!i||c<=i?t[h]:o,s||h===o||vr(o)?h:h+yn(o)}:cf(t))},gm=function(t,e,n,i){return Wr(Rn(t)?!e:n===!0?!!(n=0):!i,function(){return Rn(t)?t[~~(Math.random()*t.length)]:(n=n||1e-5)&&(i=n<1?Math.pow(10,(n+"").length-2):1)&&Math.floor(Math.round((t-n/2+Math.random()*(e-t+n*.99))/n)*n*i)/i})},Nx=function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return function(i){return e.reduce(function(s,o){return o(s)},i)}},Fx=function(t,e){return function(n){return t(parseFloat(n))+(e||yn(n))}},Ox=function(t,e,n){return xm(t,e,0,1,n)},_m=function(t,e,n){return Wr(n,function(i){return t[~~e(i)]})},Ux=function r(t,e,n){var i=e-t;return Rn(t)?_m(t,r(0,t.length),e):Wr(n,function(s){return(i+(s-t)%i)%i+t})},Bx=function r(t,e,n){var i=e-t,s=i*2;return Rn(t)?_m(t,r(0,t.length-1),e):Wr(n,function(o){return o=(s+(o-t)%s)%s||0,t+(o>i?s-o:o)})},ao=function(t){return t.replace(_x,function(e){var n=e.indexOf("[")+1,i=e.substring(n||7,n?e.indexOf("]"):e.length-1).split(xx);return gm(n?i:+i[0],n?0:+i[1],+i[2]||1e-5)})},xm=function(t,e,n,i,s){var o=e-t,a=i-n;return Wr(s,function(l){return n+((l-t)/o*a||0)})},kx=function r(t,e,n,i){var s=isNaN(t+e)?0:function(d){return(1-d)*t+d*e};if(!s){var o=ln(t),a={},l,c,h,u,f;if(n===!0&&(i=1)&&(n=null),o)t={p:t},e={p:e};else if(Rn(t)&&!Rn(e)){for(h=[],u=t.length,f=u-2,c=1;c<u;c++)h.push(r(t[c-1],t[c]));u--,s=function(p){p*=u;var _=Math.min(f,~~p);return h[_](p-_)},n=e}else i||(t=io(Rn(t)?[]:{},t));if(!h){for(l in e)wf.call(a,t,l,"get",e[l]);s=function(p){return Rf(p,a)||(o?t.p:t)}}}return Wr(n,s)},Jp=function(t,e,n){var i=t.labels,s=Ci,o,a,l;for(o in i)a=i[o]-e,a<0==!!n&&a&&s>(a=Math.abs(a))&&(l=o,s=a);return l},hi=function(t,e,n){var i=t.vars,s=i[e],o=Be,a=t._ctx,l,c,h;if(s)return l=i[e+"Params"],c=i.callbackScope||t,n&&Vr.length&&sc(),a&&(Be=a),h=l?s.apply(c,l):s.call(c),Be=o,h},pa=function(t){return Gr(t),t.scrollTrigger&&t.scrollTrigger.kill(!!vn),t.progress()<1&&hi(t,"onInterrupt"),t},no,vm=[],ym=function(t){if(t)if(t=!t.name&&t.default||t,df()||t.headless){var e=t.name,n=Xe(t),i=e&&!n&&t.init?function(){this._props=[]}:t,s={init:Sa,render:Rf,add:wf,kill:nv,modifier:ev,rawVars:0},o={targetTest:0,get:0,getSetter:pc,aliases:{},register:0};if(oo(),t!==i){if(ni[e])return;fi(i,fi(oc(t,s),o)),io(i.prototype,io(s,oc(t,o))),ni[i.prop=e]=i,t.targetTest&&(nc.push(i),_f[e]=1),e=(e==="css"?"CSS":e.charAt(0).toUpperCase()+e.substr(1))+"Plugin"}im(e,i),t.register&&t.register(Pn,i,Wn)}else vm.push(t)},Re=255,ma={aqua:[0,Re,Re],lime:[0,Re,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,Re],navy:[0,0,128],white:[Re,Re,Re],olive:[128,128,0],yellow:[Re,Re,0],orange:[Re,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[Re,0,0],pink:[Re,192,203],cyan:[0,Re,Re],transparent:[Re,Re,Re,0]},$u=function(t,e,n){return t+=t<0?1:t>1?-1:0,(t*6<1?e+(n-e)*t*6:t<.5?n:t*3<2?e+(n-e)*(2/3-t)*6:e)*Re+.5|0},Sm=function(t,e,n){var i=t?vr(t)?[t>>16,t>>8&Re,t&Re]:0:ma.black,s,o,a,l,c,h,u,f,d,p;if(!i){if(t.substr(-1)===","&&(t=t.substr(0,t.length-1)),ma[t])i=ma[t];else if(t.charAt(0)==="#"){if(t.length<6&&(s=t.charAt(1),o=t.charAt(2),a=t.charAt(3),t="#"+s+s+o+o+a+a+(t.length===5?t.charAt(4)+t.charAt(4):"")),t.length===9)return i=parseInt(t.substr(1,6),16),[i>>16,i>>8&Re,i&Re,parseInt(t.substr(7),16)/255];t=parseInt(t.substr(1),16),i=[t>>16,t>>8&Re,t&Re]}else if(t.substr(0,3)==="hsl"){if(i=p=t.match(Wp),!e)l=+i[0]%360/360,c=+i[1]/100,h=+i[2]/100,o=h<=.5?h*(c+1):h+c-h*c,s=h*2-o,i.length>3&&(i[3]*=1),i[0]=$u(l+1/3,s,o),i[1]=$u(l,s,o),i[2]=$u(l-1/3,s,o);else if(~t.indexOf("="))return i=t.match(pf),n&&i.length<4&&(i[3]=1),i}else i=t.match(Wp)||ma.transparent;i=i.map(Number)}return e&&!p&&(s=i[0]/Re,o=i[1]/Re,a=i[2]/Re,u=Math.max(s,o,a),f=Math.min(s,o,a),h=(u+f)/2,u===f?l=c=0:(d=u-f,c=h>.5?d/(2-u-f):d/(u+f),l=u===s?(o-a)/d+(o<a?6:0):u===o?(a-s)/d+2:(s-o)/d+4,l*=60),i[0]=~~(l+.5),i[1]=~~(c*100+.5),i[2]=~~(h*100+.5)),n&&i.length<4&&(i[3]=1),i},Mm=function(t){var e=[],n=[],i=-1;return t.split(xr).forEach(function(s){var o=s.match(ys)||[];e.push.apply(e,o),n.push(i+=o.length+1)}),e.c=n,e},$p=function(t,e,n){var i="",s=(t+i).match(xr),o=e?"hsla(":"rgba(",a=0,l,c,h,u;if(!s)return t;if(s=s.map(function(f){return(f=Sm(f,e,1))&&o+(e?f[0]+","+f[1]+"%,"+f[2]+"%,"+f[3]:f.join(","))+")"}),n&&(h=Mm(t),l=n.c,l.join(i)!==h.c.join(i)))for(c=t.replace(xr,"1").split(ys),u=c.length-1;a<u;a++)i+=c[a]+(~l.indexOf(a)?s.shift()||o+"0,0,0,0)":(h.length?h:s.length?s:n).shift());if(!c)for(c=t.split(xr),u=c.length-1;a<u;a++)i+=c[a]+s[a];return i+c[u]},xr=(function(){var r="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",t;for(t in ma)r+="|"+t+"\\b";return new RegExp(r+")","gi")})(),zx=/hsl[a]?\(/,Mf=function(t){var e=t.join(" "),n;if(xr.lastIndex=0,xr.test(e))return n=zx.test(e),t[1]=$p(t[1],n),t[0]=$p(t[0],n,Mm(t[1])),!0},Ma,ii=(function(){var r=Date.now,t=500,e=33,n=r(),i=n,s=1e3/240,o=s,a=[],l,c,h,u,f,d,p=function _(g){var m=r()-i,v=g===!0,S,x,w,M;if((m>t||m<0)&&(n+=m-e),i+=m,w=i-n,S=w-o,(S>0||v)&&(M=++u.frame,f=w-u.time*1e3,u.time=w=w/1e3,o+=S+(S>=s?4:s-S),x=1),v||(l=c(_)),x)for(d=0;d<a.length;d++)a[d](w,f,M,g)};return u={time:0,frame:0,tick:function(){p(!0)},deltaRatio:function(g){return f/(1e3/(g||60))},wake:function(){em&&(!nf&&df()&&(ir=nf=window,gf=ir.document||{},ui.gsap=Pn,(ir.gsapVersions||(ir.gsapVersions=[])).push(Pn.version),nm(rc||ir.GreenSockGlobals||!ir.gsap&&ir||{}),vm.forEach(ym)),h=typeof requestAnimationFrame<"u"&&requestAnimationFrame,l&&u.sleep(),c=h||function(g){return setTimeout(g,o-u.time*1e3+1|0)},Ma=1,p(2))},sleep:function(){(h?cancelAnimationFrame:clearTimeout)(l),Ma=0,c=Sa},lagSmoothing:function(g,m){t=g||1/0,e=Math.min(m||33,t)},fps:function(g){s=1e3/(g||240),o=u.time*1e3+s},add:function(g,m,v){var S=m?function(x,w,M,E){g(x,w,M,E),u.remove(S)}:g;return u.remove(g),a[v?"unshift":"push"](S),oo(),S},remove:function(g,m){~(m=a.indexOf(g))&&a.splice(m,1)&&d>=m&&d--},_listeners:a},u})(),oo=function(){return!Ma&&ii.wake()},ge={},Vx=/^[\d.\-M][\d.\-,\s]/,Hx=/["']/g,Gx=function(t){for(var e={},n=t.substr(1,t.length-3).split(":"),i=n[0],s=1,o=n.length,a,l,c;s<o;s++)l=n[s],a=s!==o-1?l.lastIndexOf(","):l.length,c=l.substr(0,a),e[i]=isNaN(c)?c.replace(Hx,"").trim():+c,i=l.substr(a+1).trim();return e},Wx=function(t){var e=t.indexOf("(")+1,n=t.indexOf(")"),i=t.indexOf("(",e);return t.substring(e,~i&&i<n?t.indexOf(")",n+1):n)},Xx=function(t){var e=(t+"").split("("),n=ge[e[0]];return n&&e.length>1&&n.config?n.config.apply(null,~t.indexOf("{")?[Gx(e[1])]:Wx(t).split(",").map(om)):ge._CE&&Vx.test(t)?ge._CE("",t):n},Yx=function(t){return function(e){return 1-t(1-e)}},xs=function(t,e){return t&&(Xe(t)?t:ge[t]||Xx(t))||e},Ms=function(t,e,n,i){n===void 0&&(n=function(l){return 1-e(1-l)}),i===void 0&&(i=function(l){return l<.5?e(l*2)/2:1-e((1-l)*2)/2});var s={easeIn:e,easeOut:n,easeInOut:i},o;return Gn(t,function(a){ge[a]=ui[a]=s,ge[o=a.toLowerCase()]=n;for(var l in s)ge[o+(l==="easeIn"?".in":l==="easeOut"?".out":".inOut")]=ge[a+"."+l]=s[l]}),s},bm=function(t){return function(e){return e<.5?(1-t(1-e*2))/2:.5+t((e-.5)*2)/2}},Ku=function r(t,e,n){var i=e>=1?e:1,s=(n||(t?.3:.45))/(e<1?e:1),o=s/ef*(Math.asin(1/i)||0),a=function(h){return h===1?1:i*Math.pow(2,-10*h)*gx((h-o)*s)+1},l=t==="out"?a:t==="in"?function(c){return 1-a(1-c)}:bm(a);return s=ef/s,l.config=function(c,h){return r(t,c,h)},l},ju=function r(t,e){e===void 0&&(e=1.70158);var n=function(o){return o?--o*o*((e+1)*o+e)+1:0},i=t==="out"?n:t==="in"?function(s){return 1-n(1-s)}:bm(n);return i.config=function(s){return r(t,s)},i};Gn("Linear,Quad,Cubic,Quart,Quint,Strong",function(r,t){var e=t<5?t+1:t;Ms(r+",Power"+(e-1),t?function(n){return Math.pow(n,e)}:function(n){return n},function(n){return 1-Math.pow(1-n,e)},function(n){return n<.5?Math.pow(n*2,e)/2:1-Math.pow((1-n)*2,e)/2})});ge.Linear.easeNone=ge.none=ge.Linear.easeIn;Ms("Elastic",Ku("in"),Ku("out"),Ku());(function(r,t){var e=1/t,n=2*e,i=2.5*e,s=function(a){return a<e?r*a*a:a<n?r*Math.pow(a-1.5/t,2)+.75:a<i?r*(a-=2.25/t)*a+.9375:r*Math.pow(a-2.625/t,2)+.984375};Ms("Bounce",function(o){return 1-s(1-o)},s)})(7.5625,2.75);Ms("Expo",function(r){return Math.pow(2,10*(r-1))*r+r*r*r*r*r*r*(1-r)});Ms("Circ",function(r){return-(Qp(1-r*r)-1)});Ms("Sine",function(r){return r===1?1:-mx(r*dx)+1});Ms("Back",ju("in"),ju("out"),ju());ge.SteppedEase=ge.steps=ui.SteppedEase={config:function(t,e){t===void 0&&(t=1);var n=1/t,i=t+(e?0:1),s=e?1:0,o=1-Pe;return function(a){return((i*wa(0,o,a)|0)+s)*n}}};va.ease=ge["quad.out"];Gn("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(r){return xf+=r+","+r+"Params,"});var bf=function(t,e){this.id=px++,t._gsap=this,this.target=t,this.harness=e,this.get=e?e.get:yf,this.set=e?e.getSetter:pc},ba=(function(){function r(e){this.vars=e,this._delay=+e.delay||0,(this._repeat=e.repeat===1/0?-2:e.repeat||0)&&(this._rDelay=e.repeatDelay||0,this._yoyo=!!e.yoyo||!!e.yoyoEase),this._ts=1,so(this,+e.duration,1,1),this.data=e.data,Be&&(this._ctx=Be,Be.data.push(this)),Ma||ii.wake()}var t=r.prototype;return t.delay=function(n){return n||n===0?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+n-this._delay),this._delay=n,this):this._delay},t.duration=function(n){return arguments.length?this.totalDuration(this._repeat>0?n+(n+this._rDelay)*this._repeat:n):this.totalDuration()&&this._dur},t.totalDuration=function(n){return arguments.length?(this._dirty=0,so(this,this._repeat<0?n:(n-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},t.totalTime=function(n,i){if(oo(),!arguments.length)return this._tTime;var s=this._dp;if(s&&s.smoothChildTiming&&this._ts){for(dc(this,n),!s._dp||s.parent||cm(s,this);s&&s.parent;)s.parent._time!==s._start+(s._ts>=0?s._tTime/s._ts:(s.totalDuration()-s._tTime)/-s._ts)&&s.totalTime(s._tTime,!0),s=s.parent;!this.parent&&this._dp.autoRemoveChildren&&(this._ts>0&&n<this._tDur||this._ts<0&&n>0||!this._tDur&&!n)&&rr(this._dp,this,this._start-this._delay)}return(this._tTime!==n||!this._dur&&!i||this._initted&&Math.abs(this._zTime)===Pe||!this._initted&&this._dur&&n||!n&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=n),sm(this,n,i)),this},t.time=function(n,i){return arguments.length?this.totalTime(Math.min(this.totalDuration(),n+qp(this))%(this._dur+this._rDelay)||(n?this._dur:0),i):this._time},t.totalProgress=function(n,i){return arguments.length?this.totalTime(this.totalDuration()*n,i):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.rawTime()>=0&&this._initted?1:0},t.progress=function(n,i){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&!(this.iteration()&1)?1-n:n)+qp(this),i):this.duration()?Math.min(1,this._time/this._dur):this.rawTime()>0?1:0},t.iteration=function(n,i){var s=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(n-1)*s,i):this._repeat?ro(this._tTime,s)+1:1},t.timeScale=function(n,i){if(!arguments.length)return this._rts===-Pe?0:this._rts;if(this._rts===n)return this;var s=this.parent&&this._ts?ac(this.parent._time,this):this._tTime;return this._rts=+n||0,this._ts=this._ps||n===-Pe?0:this._rts,this.totalTime(wa(-Math.abs(this._delay),this.totalDuration(),s),i!==!1),fc(this),Ex(this)},t.paused=function(n){return arguments.length?(this._ps!==n&&(this._ps=n,n?(this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0):(oo(),this._ts=this._rts,this.totalTime(this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,this.progress()===1&&Math.abs(this._zTime)!==Pe&&(this._tTime-=Pe)))),this):this._ps},t.startTime=function(n){if(arguments.length){this._start=ke(n);var i=this.parent||this._dp;return i&&(i._sort||!this.parent)&&rr(i,this,this._start-this._delay),this}return this._start},t.endTime=function(n){return this._start+(ri(n)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},t.rawTime=function(n){var i=this.parent||this._dp;return i?n&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?ac(i.rawTime(n),this):this._tTime:this._tTime},t.revert=function(n){n===void 0&&(n=Mx);var i=vn;return vn=n,Sf(this)&&(this.timeline&&this.timeline.revert(n),this.totalTime(-.01,n.suppressEvents)),this.data!=="nested"&&n.kill!==!1&&this.kill(),vn=i,this},t.globalTime=function(n){for(var i=this,s=arguments.length?n:i.rawTime();i;)s=i._start+s/(Math.abs(i._ts)||1),i=i._dp;return!this.parent&&this._sat?this._sat.globalTime(n):s},t.repeat=function(n){return arguments.length?(this._repeat=n===1/0?-2:n,Zp(this)):this._repeat===-2?1/0:this._repeat},t.repeatDelay=function(n){if(arguments.length){var i=this._time;return this._rDelay=n,Zp(this),i?this.time(i):this}return this._rDelay},t.yoyo=function(n){return arguments.length?(this._yoyo=n,this):this._yoyo},t.seek=function(n,i){return this.totalTime(Ai(this,n),ri(i))},t.restart=function(n,i){return this.play().totalTime(n?-this._delay:0,ri(i)),this._dur||(this._zTime=-Pe),this},t.play=function(n,i){return n!=null&&this.seek(n,i),this.reversed(!1).paused(!1)},t.reverse=function(n,i){return n!=null&&this.seek(n||this.totalDuration(),i),this.reversed(!0).paused(!1)},t.pause=function(n,i){return n!=null&&this.seek(n,i),this.paused(!0)},t.resume=function(){return this.paused(!1)},t.reversed=function(n){return arguments.length?(!!n!==this.reversed()&&this.timeScale(-this._rts||(n?-Pe:0)),this):this._rts<0},t.invalidate=function(){return this._initted=this._act=0,this._zTime=-Pe,this},t.isActive=function(){var n=this.parent||this._dp,i=this._start,s;return!!(!n||this._ts&&this._initted&&n.isActive()&&(s=n.rawTime(!0))>=i&&s<this.endTime(!0)-Pe)},t.eventCallback=function(n,i,s){var o=this.vars;return arguments.length>1?(i?(o[n]=i,s&&(o[n+"Params"]=s),n==="onUpdate"&&(this._onUpdate=i)):delete o[n],this):o[n]},t.then=function(n){var i=this,s=i._prom;return new Promise(function(o){var a=Xe(n)?n:am,l=function(){var h=i.then;i.then=null,s&&s(),Xe(a)&&(a=a(i))&&(a.then||a===i)&&(i.then=h),o(a),i.then=h};i._initted&&i.totalProgress()===1&&i._ts>=0||!i._tTime&&i._ts<0?l():i._prom=l})},t.kill=function(){pa(this)},r})();fi(ba.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-Pe,_prom:0,_ps:!1,_rts:1});var Cn=(function(r){jp(t,r);function t(n,i){var s;return n===void 0&&(n={}),s=r.call(this,n)||this,s.labels={},s.smoothChildTiming=!!n.smoothChildTiming,s.autoRemoveChildren=!!n.autoRemoveChildren,s._sort=ri(n.sortChildren),ze&&rr(n.parent||ze,_r(s),i),n.reversed&&s.reverse(),n.paused&&s.paused(!0),n.scrollTrigger&&hm(_r(s),n.scrollTrigger),s}var e=t.prototype;return e.to=function(i,s,o){return _a(0,arguments,this),this},e.from=function(i,s,o){return _a(1,arguments,this),this},e.fromTo=function(i,s,o,a){return _a(2,arguments,this),this},e.set=function(i,s,o){return s.duration=0,s.parent=this,ga(s).repeatDelay||(s.repeat=0),s.immediateRender=!!s.immediateRender,new je(i,s,Ai(this,o),1),this},e.call=function(i,s,o){return rr(this,je.delayedCall(0,i,s),o)},e.staggerTo=function(i,s,o,a,l,c,h){return o.duration=s,o.stagger=o.stagger||a,o.onComplete=c,o.onCompleteParams=h,o.parent=this,new je(i,o,Ai(this,l)),this},e.staggerFrom=function(i,s,o,a,l,c,h){return o.runBackwards=1,ga(o).immediateRender=ri(o.immediateRender),this.staggerTo(i,s,o,a,l,c,h)},e.staggerFromTo=function(i,s,o,a,l,c,h,u){return a.startAt=o,ga(a).immediateRender=ri(a.immediateRender),this.staggerTo(i,s,a,l,c,h,u)},e.render=function(i,s,o){var a=this._time,l=this._dirty?this.totalDuration():this._tDur,c=this._dur,h=i<=0?0:ke(i),u=this._zTime<0!=i<0&&(this._initted||!c),f,d,p,_,g,m,v,S,x,w,M,E;if(this!==ze&&h>l&&i>=0&&(h=l),h!==this._tTime||o||u){if(a!==this._time&&c&&(h+=this._time-a,i+=this._time-a),f=h,x=this._start,S=this._ts,m=!S,u&&(c||(a=this._zTime),(i||!s)&&(this._zTime=i)),this._repeat){if(M=this._yoyo,g=c+this._rDelay,this._repeat<-1&&i<0)return this.totalTime(g*100+i,s,o);if(f=ke(h%g),h===l?(_=this._repeat,f=c):(w=ke(h/g),_=~~w,_&&_===w&&(f=c,_--),f>c&&(f=c)),w=ro(this._tTime,g),!a&&this._tTime&&w!==_&&this._tTime-w*g-this._dur<=0&&(w=_),M&&_&1&&(f=c-f,E=1),_!==w&&!this._lock){var y=M&&w&1,b=y===(M&&_&1);if(_<w&&(y=!y),a=y?0:h%c?c:h,this._lock=1,this.render(a||(E?0:ke(_*g)),s,!c)._lock=0,this._tTime=h,!s&&this.parent&&hi(this,"onRepeat"),this.vars.repeatRefresh&&!E&&(this.invalidate()._lock=1,w=_),a&&a!==this._time||m!==!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(c=this._dur,l=this._tDur,b&&(this._lock=2,a=y?c:-1e-4,this.render(a,!0),this.vars.repeatRefresh&&!E&&this.invalidate()),this._lock=0,!this._ts&&!m)return this}}if(this._hasPause&&!this._forcing&&this._lock<2&&(v=Px(this,ke(a),ke(f)),v&&(h-=f-(f=v._start))),this._tTime=h,this._time=f,this._act=!!S,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=i,a=0),!a&&h&&c&&!s&&!w&&(hi(this,"onStart"),this._tTime!==h))return this;if(f>=a&&i>=0)for(d=this._first;d;){if(p=d._next,(d._act||f>=d._start)&&d._ts&&v!==d){if(d.parent!==this)return this.render(i,s,o);if(d.render(d._ts>0?(f-d._start)*d._ts:(d._dirty?d.totalDuration():d._tDur)+(f-d._start)*d._ts,s,o),f!==this._time||!this._ts&&!m){v=0,p&&(h+=this._zTime=-Pe);break}}d=p}else{d=this._last;for(var A=i<0?i:f;d;){if(p=d._prev,(d._act||A<=d._end)&&d._ts&&v!==d){if(d.parent!==this)return this.render(i,s,o);if(d.render(d._ts>0?(A-d._start)*d._ts:(d._dirty?d.totalDuration():d._tDur)+(A-d._start)*d._ts,s,o||vn&&Sf(d)),f!==this._time||!this._ts&&!m){v=0,p&&(h+=this._zTime=A?-Pe:Pe);break}}d=p}}if(v&&!s&&(this.pause(),v.render(f>=a?0:-Pe)._zTime=f>=a?1:-1,this._ts))return this._start=x,fc(this),this.render(i,s,o);this._onUpdate&&!s&&hi(this,"onUpdate",!0),(h===l&&this._tTime>=this.totalDuration()||!h&&a)&&(x===this._start||Math.abs(S)!==Math.abs(this._ts))&&(this._lock||((i||!c)&&(h===l&&this._ts>0||!h&&this._ts<0)&&Gr(this,1),!s&&!(i<0&&!a)&&(h||a||!l)&&(hi(this,h===l&&i>=0?"onComplete":"onReverseComplete",!0),this._prom&&!(h<l&&this.timeScale()>0)&&this._prom())))}return this},e.add=function(i,s){var o=this;if(vr(s)||(s=Ai(this,s,i)),!(i instanceof ba)){if(Rn(i))return i.forEach(function(a){return o.add(a,s)}),this;if(ln(i))return this.addLabel(i,s);if(Xe(i))i=je.delayedCall(0,i);else return this}return this!==i?rr(this,i,s):this},e.getChildren=function(i,s,o,a){i===void 0&&(i=!0),s===void 0&&(s=!0),o===void 0&&(o=!0),a===void 0&&(a=-Ci);for(var l=[],c=this._first;c;)c._start>=a&&(c instanceof je?s&&l.push(c):(o&&l.push(c),i&&l.push.apply(l,c.getChildren(!0,s,o)))),c=c._next;return l},e.getById=function(i){for(var s=this.getChildren(1,1,1),o=s.length;o--;)if(s[o].vars.id===i)return s[o]},e.remove=function(i){return ln(i)?this.removeLabel(i):Xe(i)?this.killTweensOf(i):(i.parent===this&&uc(this,i),i===this._recent&&(this._recent=this._last),_s(this))},e.totalTime=function(i,s){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=ke(ii.time-(this._ts>0?i/this._ts:(this.totalDuration()-i)/-this._ts))),r.prototype.totalTime.call(this,i,s),this._forcing=0,this):this._tTime},e.addLabel=function(i,s){return this.labels[i]=Ai(this,s),this},e.removeLabel=function(i){return delete this.labels[i],this},e.addPause=function(i,s,o){var a=je.delayedCall(0,s||Sa,o);return a.data="isPause",this._hasPause=1,rr(this,a,Ai(this,i))},e.removePause=function(i){var s=this._first;for(i=Ai(this,i);s;)s._start===i&&s.data==="isPause"&&Gr(s),s=s._next},e.killTweensOf=function(i,s,o){for(var a=this.getTweensOf(i,o),l=a.length;l--;)zr!==a[l]&&a[l].kill(i,s);return this},e.getTweensOf=function(i,s){for(var o=[],a=Ri(i),l=this._first,c=vr(s),h;l;)l instanceof je?bx(l._targets,a)&&(c?(!zr||l._initted&&l._ts)&&l.globalTime(0)<=s&&l.globalTime(l.totalDuration())>s:!s||l.isActive())&&o.push(l):(h=l.getTweensOf(a,s)).length&&o.push.apply(o,h),l=l._next;return o},e.tweenTo=function(i,s){s=s||{};var o=this,a=Ai(o,i),l=s,c=l.startAt,h=l.onStart,u=l.onStartParams,f=l.immediateRender,d,p=je.to(o,fi({ease:s.ease||"none",lazy:!1,immediateRender:!1,time:a,overwrite:"auto",duration:s.duration||Math.abs((a-(c&&"time"in c?c.time:o._time))/o.timeScale())||Pe,onStart:function(){if(o.pause(),!d){var g=s.duration||Math.abs((a-(c&&"time"in c?c.time:o._time))/o.timeScale());p._dur!==g&&so(p,g,0,1).render(p._time,!0,!0),d=1}h&&h.apply(p,u||[])}},s));return f?p.render(0):p},e.tweenFromTo=function(i,s,o){return this.tweenTo(s,fi({startAt:{time:Ai(this,i)}},o))},e.recent=function(){return this._recent},e.nextLabel=function(i){return i===void 0&&(i=this._time),Jp(this,Ai(this,i))},e.previousLabel=function(i){return i===void 0&&(i=this._time),Jp(this,Ai(this,i),1)},e.currentLabel=function(i){return arguments.length?this.seek(i,!0):this.previousLabel(this._time+Pe)},e.shiftChildren=function(i,s,o){o===void 0&&(o=0);var a=this._first,l=this.labels,c;for(i=ke(i);a;)a._start>=o&&(a._start+=i,a._end+=i),a=a._next;if(s)for(c in l)l[c]>=o&&(l[c]+=i);return _s(this)},e.invalidate=function(i){var s=this._first;for(this._lock=0;s;)s.invalidate(i),s=s._next;return r.prototype.invalidate.call(this,i)},e.clear=function(i){i===void 0&&(i=!0);for(var s=this._first,o;s;)o=s._next,this.remove(s),s=o;return this._dp&&(this._time=this._tTime=this._pTime=0),i&&(this.labels={}),_s(this)},e.totalDuration=function(i){var s=0,o=this,a=o._last,l=Ci,c,h,u;if(arguments.length)return o.timeScale((o._repeat<0?o.duration():o.totalDuration())/(o.reversed()?-i:i));if(o._dirty){for(u=o.parent;a;)c=a._prev,a._dirty&&a.totalDuration(),h=a._start,h>l&&o._sort&&a._ts&&!o._lock?(o._lock=1,rr(o,a,h-a._delay,1)._lock=0):l=h,h<0&&a._ts&&(s-=h,(!u&&!o._dp||u&&u.smoothChildTiming)&&(o._start+=ke(h/o._ts),o._time-=h,o._tTime-=h),o.shiftChildren(-h,!1,-1/0),l=0),a._end>s&&a._ts&&(s=a._end),a=c;so(o,o===ze&&o._time>s?o._time:s,1,1),o._dirty=0}return o._tDur},t.updateRoot=function(i){if(ze._ts&&(sm(ze,ac(i,ze)),rm=ii.frame),ii.frame>=Xp){Xp+=si.autoSleep||120;var s=ze._first;if((!s||!s._ts)&&si.autoSleep&&ii._listeners.length<2){for(;s&&!s._ts;)s=s._next;s||ii.sleep()}}},t})(ba);fi(Cn.prototype,{_lock:0,_hasPause:0,_forcing:0});var qx=function(t,e,n,i,s,o,a){var l=new Wn(this._pt,t,e,0,1,Cf,null,s),c=0,h=0,u,f,d,p,_,g,m,v;for(l.b=n,l.e=i,n+="",i+="",(m=~i.indexOf("random("))&&(i=ao(i)),o&&(v=[n,i],o(v,t,e),n=v[0],i=v[1]),f=n.match(Zu)||[];u=Zu.exec(i);)p=u[0],_=i.substring(c,u.index),d?d=(d+1)%5:_.substr(-5)==="rgba("&&(d=1),p!==f[h++]&&(g=parseFloat(f[h-1])||0,l._pt={_next:l._pt,p:_||h===1?_:",",s:g,c:p.charAt(1)==="="?Ss(g,p)-g:parseFloat(p)-g,m:d&&d<4?Math.round:0},c=Zu.lastIndex);return l.c=c<i.length?i.substring(c,i.length):"",l.fp=a,(mf.test(i)||m)&&(l.e=0),this._pt=l,l},wf=function(t,e,n,i,s,o,a,l,c,h){Xe(i)&&(i=i(s||0,t,o));var u=t[e],f=n!=="get"?n:Xe(u)?c?t[e.indexOf("set")||!Xe(t["get"+e.substr(3)])?e:"get"+e.substr(3)](c):t[e]():u,d=Xe(u)?c?jx:Em:Af,p;if(ln(i)&&(~i.indexOf("random(")&&(i=ao(i)),i.charAt(1)==="="&&(p=Ss(f,i)+(yn(f)||0),(p||p===0)&&(i=p))),!h||f!==i||hf)return!isNaN(f*i)&&i!==""?(p=new Wn(this._pt,t,e,+f||0,i-(f||0),typeof u=="boolean"?tv:Am,0,d),c&&(p.fp=c),a&&p.modifier(a,this,t),this._pt=p):(!u&&!(e in t)&&hc(e,i),qx.call(this,t,e,f,i,d,l||si.stringFilter,c))},Zx=function(t,e,n,i,s){if(Xe(t)&&(t=xa(t,s,e,n,i)),!sr(t)||t.style&&t.nodeType||Rn(t)||tm(t))return ln(t)?xa(t,s,e,n,i):t;var o={},a;for(a in t)o[a]=xa(t[a],s,e,n,i);return o},Tf=function(t,e,n,i,s,o){var a,l,c,h;if(ni[t]&&(a=new ni[t]).init(s,a.rawVars?e[t]:Zx(e[t],i,s,o,n),n,i,o)!==!1&&(n._pt=l=new Wn(n._pt,s,t,0,1,a.render,a,0,a.priority),n!==no))for(c=n._ptLookup[n._targets.indexOf(s)],h=a._props.length;h--;)c[a._props[h]]=l;return a},zr,hf,Ef=function r(t,e,n){var i=t.vars,s=i.ease,o=i.startAt,a=i.immediateRender,l=i.lazy,c=i.onUpdate,h=i.runBackwards,u=i.yoyoEase,f=i.keyframes,d=i.autoRevert,p=t._dur,_=t._startAt,g=t._targets,m=t.parent,v=m&&m.data==="nested"?m.vars.targets:g,S=t._overwrite==="auto"&&!ff,x=t.timeline,w=i.easeReverse||u,M,E,y,b,A,R,P,N,L,F,k,B,$;if(x&&(!f||!s)&&(s="none"),t._ease=xs(s,va.ease),t._rEase=w&&(xs(w)||t._ease),t._from=!x&&!!i.runBackwards,t._from&&(t.ratio=1),!x||f&&!i.stagger){if(N=g[0]?Hr(g[0]).harness:0,B=N&&i[N.prop],M=oc(i,_f),_&&(_._zTime<0&&_.progress(1),e<0&&h&&a&&!d?_.render(-1,!0):_.revert(h&&p?ec:Sx),_._lazy=0),o){if(Gr(t._startAt=je.set(g,fi({data:"isStart",overwrite:!1,parent:m,immediateRender:!0,lazy:!_&&ri(l),startAt:null,delay:0,onUpdate:c&&function(){return hi(t,"onUpdate")},stagger:0},o))),t._startAt._dp=0,t._startAt._sat=t,e<0&&(vn||!a&&!d)&&t._startAt.revert(ec),a&&p&&e<=0&&n<=0){e&&(t._zTime=e);return}}else if(h&&p&&!_){if(e&&(a=!1),y=fi({overwrite:!1,data:"isFromStart",lazy:a&&!_&&ri(l),immediateRender:a,stagger:0,parent:m},M),B&&(y[N.prop]=B),Gr(t._startAt=je.set(g,y)),t._startAt._dp=0,t._startAt._sat=t,e<0&&(vn?t._startAt.revert(ec):t._startAt.render(-1,!0)),t._zTime=e,!a)r(t._startAt,Pe,Pe);else if(!e)return}for(t._pt=t._ptCache=0,l=p&&ri(l)||l&&!p,E=0;E<g.length;E++){if(A=g[E],P=A._gsap||vf(g)[E]._gsap,t._ptLookup[E]=F={},rf[P.id]&&Vr.length&&sc(),k=v===g?E:v.indexOf(A),N&&(L=new N).init(A,B||M,t,k,v)!==!1&&(t._pt=b=new Wn(t._pt,A,L.name,0,1,L.render,L,0,L.priority),L._props.forEach(function(W){F[W]=b}),L.priority&&(R=1)),!N||B)for(y in M)ni[y]&&(L=Tf(y,M,t,k,A,v))?L.priority&&(R=1):F[y]=b=wf.call(t,A,y,"get",M[y],k,v,0,i.stringFilter);t._op&&t._op[E]&&t.kill(A,t._op[E]),S&&t._pt&&(zr=t,ze.killTweensOf(A,F,t.globalTime(e)),$=!t.parent,zr=0),t._pt&&l&&(rf[P.id]=1)}R&&Pf(t),t._onInit&&t._onInit(t)}t._onUpdate=c,t._initted=(!t._op||t._pt)&&!$,f&&e<=0&&x.render(Ci,!0,!0)},Jx=function(t,e,n,i,s,o,a,l){var c=(t._pt&&t._ptCache||(t._ptCache={}))[e],h,u,f,d;if(!c)for(c=t._ptCache[e]=[],f=t._ptLookup,d=t._targets.length;d--;){if(h=f[d][e],h&&h.d&&h.d._pt)for(h=h.d._pt;h&&h.p!==e&&h.fp!==e;)h=h._next;if(!h)return hf=1,t.vars[e]="+=0",Ef(t,a),hf=0,l?ya(e+" not eligible for reset. Try splitting into individual properties"):1;c.push(h)}for(d=c.length;d--;)u=c[d],h=u._pt||u,h.s=(i||i===0)&&!s?i:h.s+(i||0)+o*h.c,h.c=n-h.s,u.e&&(u.e=Ye(n)+yn(u.e)),u.b&&(u.b=h.s+yn(u.b))},$x=function(t,e){var n=t[0]?Hr(t[0]).harness:0,i=n&&n.aliases,s,o,a,l;if(!i)return e;s=io({},e);for(o in i)if(o in s)for(l=i[o].split(","),a=l.length;a--;)s[l[a]]=s[o];return s},Kx=function(t,e,n,i){var s=e.ease||i||"power1.inOut",o,a;if(Rn(e))a=n[t]||(n[t]=[]),e.forEach(function(l,c){return a.push({t:c/(e.length-1)*100,v:l,e:s})});else for(o in e)a=n[o]||(n[o]=[]),o==="ease"||a.push({t:parseFloat(t),v:e[o],e:s})},xa=function(t,e,n,i,s){return Xe(t)?t.call(e,n,i,s):ln(t)&&~t.indexOf("random(")?ao(t):t},wm=xf+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert",Tm={};Gn(wm+",id,stagger,delay,duration,paused,scrollTrigger",function(r){return Tm[r]=1});var je=(function(r){jp(t,r);function t(n,i,s,o){var a;typeof i=="number"&&(s.duration=i,i=s,s=null),a=r.call(this,o?i:ga(i))||this;var l=a.vars,c=l.duration,h=l.delay,u=l.immediateRender,f=l.stagger,d=l.overwrite,p=l.keyframes,_=l.defaults,g=l.scrollTrigger,m=i.parent||ze,v=(Rn(n)||tm(n)?vr(n[0]):"length"in i)?[n]:Ri(n),S,x,w,M,E,y,b,A;if(a._targets=v.length?vf(v):ya("GSAP target "+n+" not found. https://gsap.com",!si.nullTargetWarn)||[],a._ptLookup=[],a._overwrite=d,p||f||tc(c)||tc(h)){i=a.vars;var R=i.easeReverse||i.yoyoEase;if(S=a.timeline=new Cn({data:"nested",defaults:_||{},targets:m&&m.data==="nested"?m.vars.targets:v}),S.kill(),S.parent=S._dp=_r(a),S._start=0,f||tc(c)||tc(h)){if(M=v.length,b=f&&pm(f),sr(f))for(E in f)~wm.indexOf(E)&&(A||(A={}),A[E]=f[E]);for(x=0;x<M;x++)w=oc(i,Tm),w.stagger=0,R&&(w.easeReverse=R),A&&io(w,A),y=v[x],w.duration=+xa(c,_r(a),x,y,v),w.delay=(+xa(h,_r(a),x,y,v)||0)-a._delay,!f&&M===1&&w.delay&&(a._delay=h=w.delay,a._start+=h,w.delay=0),S.to(y,w,b?b(x,y,v):0),S._ease=ge.none;S.duration()?c=h=0:a.timeline=0}else if(p){ga(fi(S.vars.defaults,{ease:"none"})),S._ease=xs(p.ease||i.ease||"none");var P=0,N,L,F;if(Rn(p))p.forEach(function(k){return S.to(v,k,">")}),S.duration();else{w={};for(E in p)E==="ease"||E==="easeEach"||Kx(E,p[E],w,p.easeEach);for(E in w)for(N=w[E].sort(function(k,B){return k.t-B.t}),P=0,x=0;x<N.length;x++)L=N[x],F={ease:L.e,duration:(L.t-(x?N[x-1].t:0))/100*c},F[E]=L.v,S.to(v,F,P),P+=F.duration;S.duration()<c&&S.to({},{duration:c-S.duration()})}}c||a.duration(c=S.duration())}else a.timeline=0;return d===!0&&!ff&&(zr=_r(a),ze.killTweensOf(v),zr=0),rr(m,_r(a),s),i.reversed&&a.reverse(),i.paused&&a.paused(!0),(u||!c&&!p&&a._start===ke(m._time)&&ri(u)&&Ax(_r(a))&&m.data!=="nested")&&(a._tTime=-Pe,a.render(Math.max(0,-h)||0)),g&&hm(_r(a),g),a}var e=t.prototype;return e.render=function(i,s,o){var a=this._time,l=this._tDur,c=this._dur,h=i<0,u=i>l-Pe&&!h?l:i<Pe?0:i,f,d,p,_,g,m,v,S;if(!c)Rx(this,i,s,o);else if(u!==this._tTime||!i||o||!this._initted&&this._tTime||this._startAt&&this._zTime<0!==h||this._lazy){if(f=u,S=this.timeline,this._repeat){if(_=c+this._rDelay,this._repeat<-1&&h)return this.totalTime(_*100+i,s,o);if(f=ke(u%_),u===l?(p=this._repeat,f=c):(g=ke(u/_),p=~~g,p&&p===g?(f=c,p--):f>c&&(f=c)),m=this._yoyo&&p&1,m&&(f=c-f),g=ro(this._tTime,_),f===a&&!o&&this._initted&&p===g)return this._tTime=u,this;p!==g&&this.vars.repeatRefresh&&!m&&!this._lock&&f!==_&&this._initted&&(this._lock=o=1,this.render(ke(_*p),!0).invalidate()._lock=0)}if(!this._initted){if(um(this,h?i:f,o,s,u))return this._tTime=0,this;if(a!==this._time&&!(o&&this.vars.repeatRefresh&&p!==g))return this;if(c!==this._dur)return this.render(i,s,o)}if(this._rEase){var x=f<a;if(x!==this._inv){var w=x?a:c-a;this._inv=x,this._from&&(this.ratio=1-this.ratio),this._invRatio=this.ratio,this._invTime=a,this._invRecip=w?(x?-1:1)/w:0,this._invScale=x?-this.ratio:1-this.ratio,this._invEase=x?this._rEase:this._ease}this.ratio=v=this._invRatio+this._invScale*this._invEase((f-this._invTime)*this._invRecip)}else this.ratio=v=this._ease(f/c);if(this._from&&(this.ratio=v=1-v),this._tTime=u,this._time=f,!this._act&&this._ts&&(this._act=1,this._lazy=0),!a&&u&&!s&&!g&&(hi(this,"onStart"),this._tTime!==u))return this;for(d=this._pt;d;)d.r(v,d.d),d=d._next;S&&S.render(i<0?i:S._dur*S._ease(f/this._dur),s,o)||this._startAt&&(this._zTime=i),this._onUpdate&&!s&&(h&&sf(this,i,s,o),hi(this,"onUpdate")),this._repeat&&p!==g&&this.vars.onRepeat&&!s&&this.parent&&hi(this,"onRepeat"),(u===this._tDur||!u)&&this._tTime===u&&(h&&!this._onUpdate&&sf(this,i,!0,!0),(i||!c)&&(u===this._tDur&&this._ts>0||!u&&this._ts<0)&&Gr(this,1),!s&&!(h&&!a)&&(u||a||m)&&(hi(this,u===l?"onComplete":"onReverseComplete",!0),this._prom&&!(u<l&&this.timeScale()>0)&&this._prom()))}return this},e.targets=function(){return this._targets},e.invalidate=function(i){return(!i||!this.vars.runBackwards)&&(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(i),r.prototype.invalidate.call(this,i)},e.resetTo=function(i,s,o,a,l){Ma||ii.wake(),this._ts||this.play();var c=Math.min(this._dur,(this._dp._time-this._start)*this._ts),h;return this._initted||Ef(this,c),h=this._ease(c/this._dur),Jx(this,i,s,o,a,h,c,l)?this.resetTo(i,s,o,a,1):(dc(this,0),this.parent||lm(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},e.kill=function(i,s){if(s===void 0&&(s="all"),!i&&(!s||s==="all"))return this._lazy=this._pt=0,this.parent?pa(this):this.scrollTrigger&&this.scrollTrigger.kill(!!vn),this;if(this.timeline){var o=this.timeline.totalDuration();return this.timeline.killTweensOf(i,s,zr&&zr.vars.overwrite!==!0)._first||pa(this),this.parent&&o!==this.timeline.totalDuration()&&so(this,this._dur*this.timeline._tDur/o,0,1),this}var a=this._targets,l=i?Ri(i):a,c=this._ptLookup,h=this._pt,u,f,d,p,_,g,m;if((!s||s==="all")&&Tx(a,l))return s==="all"&&(this._pt=0),pa(this);for(u=this._op=this._op||[],s!=="all"&&(ln(s)&&(_={},Gn(s,function(v){return _[v]=1}),s=_),s=$x(a,s)),m=a.length;m--;)if(~l.indexOf(a[m])){f=c[m],s==="all"?(u[m]=s,p=f,d={}):(d=u[m]=u[m]||{},p=s);for(_ in p)g=f&&f[_],g&&((!("kill"in g.d)||g.d.kill(_)===!0)&&uc(this,g,"_pt"),delete f[_]),d!=="all"&&(d[_]=1)}return this._initted&&!this._pt&&h&&pa(this),this},t.to=function(i,s){return new t(i,s,arguments[2])},t.from=function(i,s){return _a(1,arguments)},t.delayedCall=function(i,s,o,a){return new t(s,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:i,onComplete:s,onReverseComplete:s,onCompleteParams:o,onReverseCompleteParams:o,callbackScope:a})},t.fromTo=function(i,s,o){return _a(2,arguments)},t.set=function(i,s){return s.duration=0,s.repeatDelay||(s.repeat=0),new t(i,s)},t.killTweensOf=function(i,s,o){return ze.killTweensOf(i,s,o)},t})(ba);fi(je.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0});Gn("staggerTo,staggerFrom,staggerFromTo",function(r){je[r]=function(){var t=new Cn,e=af.call(arguments,0);return e.splice(r==="staggerFromTo"?5:4,0,0),t[r].apply(t,e)}});var Af=function(t,e,n){return t[e]=n},Em=function(t,e,n){return t[e](n)},jx=function(t,e,n,i){return t[e](i.fp,n)},Qx=function(t,e,n){return t.setAttribute(e,n)},pc=function(t,e){return Xe(t[e])?Em:cc(t[e])&&t.setAttribute?Qx:Af},Am=function(t,e){return e.set(e.t,e.p,Math.round((e.s+e.c*t)*1e6)/1e6,e)},tv=function(t,e){return e.set(e.t,e.p,!!(e.s+e.c*t),e)},Cf=function(t,e){var n=e._pt,i="";if(!t&&e.b)i=e.b;else if(t===1&&e.e)i=e.e;else{for(;n;)i=n.p+(n.m?n.m(n.s+n.c*t):Math.round((n.s+n.c*t)*1e4)/1e4)+i,n=n._next;i+=e.c}e.set(e.t,e.p,i,e)},Rf=function(t,e){for(var n=e._pt;n;)n.r(t,n.d),n=n._next},ev=function(t,e,n,i){for(var s=this._pt,o;s;)o=s._next,s.p===i&&s.modifier(t,e,n),s=o},nv=function(t){for(var e=this._pt,n,i;e;)i=e._next,e.p===t&&!e.op||e.op===t?uc(this,e,"_pt"):e.dep||(n=1),e=i;return!n},iv=function(t,e,n,i){i.mSet(t,e,i.m.call(i.tween,n,i.mt),i)},Pf=function(t){for(var e=t._pt,n,i,s,o;e;){for(n=e._next,i=s;i&&i.pr>e.pr;)i=i._next;(e._prev=i?i._prev:o)?e._prev._next=e:s=e,(e._next=i)?i._prev=e:o=e,e=n}t._pt=s},Wn=(function(){function r(e,n,i,s,o,a,l,c,h){this.t=n,this.s=s,this.c=o,this.p=i,this.r=a||Am,this.d=l||this,this.set=c||Af,this.pr=h||0,this._next=e,e&&(e._prev=this)}var t=r.prototype;return t.modifier=function(n,i,s){this.mSet=this.mSet||this.set,this.set=iv,this.m=n,this.mt=s,this.tween=i},r})();Gn(xf+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse",function(r){return _f[r]=1});ui.TweenMax=ui.TweenLite=je;ui.TimelineLite=ui.TimelineMax=Cn;ze=new Cn({sortChildren:!1,defaults:va,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0});si.stringFilter=Mf;var vs=[],ic={},rv=[],Kp=0,sv=0,Qu=function(t){return(ic[t]||rv).map(function(e){return e()})},uf=function(){var t=Date.now(),e=[];t-Kp>2&&(Qu("matchMediaInit"),vs.forEach(function(n){var i=n.queries,s=n.conditions,o,a,l,c;for(a in i)o=ir.matchMedia(i[a]).matches,o&&(l=1),o!==s[a]&&(s[a]=o,c=1);c&&(n.revert(),l&&e.push(n))}),Qu("matchMediaRevert"),e.forEach(function(n){return n.onMatch(n,function(i){return n.add(null,i)})}),Kp=t,Qu("matchMedia"))},Cm=(function(){function r(e,n){this.selector=n&&lf(n),this.data=[],this._r=[],this.isReverted=!1,this.id=sv++,e&&this.add(e)}var t=r.prototype;return t.add=function(n,i,s){Xe(n)&&(s=i,i=n,n=Xe);var o=this,a=function(){var c=Be,h=o.selector,u;return c&&c!==o&&c.data.push(o),s&&(o.selector=lf(s)),Be=o,u=i.apply(o,arguments),Xe(u)&&o._r.push(u),Be=c,o.selector=h,o.isReverted=!1,u};return o.last=a,n===Xe?a(o,function(l){return o.add(null,l)}):n?o[n]=a:a},t.ignore=function(n){var i=Be;Be=null,n(this),Be=i},t.getTweens=function(){var n=[];return this.data.forEach(function(i){return i instanceof r?n.push.apply(n,i.getTweens()):i instanceof je&&!(i.parent&&i.parent.data==="nested")&&n.push(i)}),n},t.clear=function(){this._r.length=this.data.length=0},t.kill=function(n,i){var s=this;if(n?(function(){for(var a=s.getTweens(),l=s.data.length,c;l--;)c=s.data[l],c.data==="isFlip"&&(c.revert(),c.getChildren(!0,!0,!1).forEach(function(h){return a.splice(a.indexOf(h),1)}));for(a.map(function(h){return{g:h._dur||h._delay||h._sat&&!h._sat.vars.immediateRender?h.globalTime(0):-1/0,t:h}}).sort(function(h,u){return u.g-h.g||-1/0}).forEach(function(h){return h.t.revert(n)}),l=s.data.length;l--;)c=s.data[l],c instanceof Cn?c.data!=="nested"&&(c.scrollTrigger&&c.scrollTrigger.revert(),c.kill()):!(c instanceof je)&&c.revert&&c.revert(n);s._r.forEach(function(h){return h(n,s)}),s.isReverted=!0})():this.data.forEach(function(a){return a.kill&&a.kill()}),this.clear(),i)for(var o=vs.length;o--;)vs[o].id===this.id&&vs.splice(o,1)},t.revert=function(n){this.kill(n||{})},r})(),ov=(function(){function r(e){this.contexts=[],this.scope=e,Be&&Be.data.push(this)}var t=r.prototype;return t.add=function(n,i,s){sr(n)||(n={matches:n});var o=new Cm(0,s||this.scope),a=o.conditions={},l,c,h;Be&&!o.selector&&(o.selector=Be.selector),this.contexts.push(o),i=o.add("onMatch",i),o.queries=n;for(c in n)c==="all"?h=1:(l=ir.matchMedia(n[c]),l&&(vs.indexOf(o)<0&&vs.push(o),(a[c]=l.matches)&&(h=1),l.addListener?l.addListener(uf):l.addEventListener("change",uf)));return h&&i(o,function(u){return o.add(null,u)}),this},t.revert=function(n){this.kill(n||{})},t.kill=function(n){this.contexts.forEach(function(i){return i.kill(n,!0)})},r})(),lc={registerPlugin:function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];e.forEach(function(i){return ym(i)})},timeline:function(t){return new Cn(t)},getTweensOf:function(t,e){return ze.getTweensOf(t,e)},getProperty:function(t,e,n,i){ln(t)&&(t=Ri(t)[0]);var s=Hr(t||{}).get,o=n?am:om;return n==="native"&&(n=""),t&&(e?o((ni[e]&&ni[e].get||s)(t,e,n,i)):function(a,l,c){return o((ni[a]&&ni[a].get||s)(t,a,l,c))})},quickSetter:function(t,e,n){if(t=Ri(t),t.length>1){var i=t.map(function(h){return Pn.quickSetter(h,e,n)}),s=i.length;return function(h){for(var u=s;u--;)i[u](h)}}t=t[0]||{};var o=ni[e],a=Hr(t),l=a.harness&&(a.harness.aliases||{})[e]||e,c=o?function(h){var u=new o;no._pt=0,u.init(t,n?h+n:h,no,0,[t]),u.render(1,u),no._pt&&Rf(1,no)}:a.set(t,l);return o?c:function(h){return c(t,l,n?h+n:h,a,1)}},quickTo:function(t,e,n){var i,s=Pn.to(t,fi((i={},i[e]="+=0.1",i.paused=!0,i.stagger=0,i),n||{})),o=function(l,c,h){return s.resetTo(e,l,c,h)};return o.tween=s,o},isTweening:function(t){return ze.getTweensOf(t,!0).length>0},defaults:function(t){return t&&t.ease&&(t.ease=xs(t.ease,va.ease)),Yp(va,t||{})},config:function(t){return Yp(si,t||{})},registerEffect:function(t){var e=t.name,n=t.effect,i=t.plugins,s=t.defaults,o=t.extendTimeline;(i||"").split(",").forEach(function(a){return a&&!ni[a]&&!ui[a]&&ya(e+" effect requires "+a+" plugin.")}),Ju[e]=function(a,l,c){return n(Ri(a),fi(l||{},s),c)},o&&(Cn.prototype[e]=function(a,l,c){return this.add(Ju[e](a,sr(l)?l:(c=l)&&{},this),c)})},registerEase:function(t,e){ge[t]=xs(e)},parseEase:function(t,e){return arguments.length?xs(t,e):ge},getById:function(t){return ze.getById(t)},exportRoot:function(t,e){t===void 0&&(t={});var n=new Cn(t),i,s;for(n.smoothChildTiming=ri(t.smoothChildTiming),ze.remove(n),n._dp=0,n._time=n._tTime=ze._time,i=ze._first;i;)s=i._next,(e||!(!i._dur&&i instanceof je&&i.vars.onComplete===i._targets[0]))&&rr(n,i,i._start-i._delay),i=s;return rr(ze,n,0),n},context:function(t,e){return t?new Cm(t,e):Be},matchMedia:function(t){return new ov(t)},matchMediaRefresh:function(){return vs.forEach(function(t){var e=t.conditions,n,i;for(i in e)e[i]&&(e[i]=!1,n=1);n&&t.revert()})||uf()},addEventListener:function(t,e){var n=ic[t]||(ic[t]=[]);~n.indexOf(e)||n.push(e)},removeEventListener:function(t,e){var n=ic[t],i=n&&n.indexOf(e);i>=0&&n.splice(i,1)},utils:{wrap:Ux,wrapYoyo:Bx,distribute:pm,random:gm,snap:mm,normalize:Ox,getUnit:yn,clamp:Dx,splitColor:Sm,toArray:Ri,selector:lf,mapRange:xm,pipe:Nx,unitize:Fx,interpolate:kx,shuffle:dm},install:nm,effects:Ju,ticker:ii,updateRoot:Cn.updateRoot,plugins:ni,globalTimeline:ze,core:{PropTween:Wn,globals:im,Tween:je,Timeline:Cn,Animation:ba,getCache:Hr,_removeLinkedListItem:uc,reverting:function(){return vn},context:function(t){return t&&Be&&(Be.data.push(t),t._ctx=Be),Be},suppressOverwrites:function(t){return ff=t}}};Gn("to,from,fromTo,delayedCall,set,killTweensOf",function(r){return lc[r]=je[r]});ii.add(Cn.updateRoot);no=lc.to({},{duration:0});var av=function(t,e){for(var n=t._pt;n&&n.p!==e&&n.op!==e&&n.fp!==e;)n=n._next;return n},lv=function(t,e){var n=t._targets,i,s,o;for(i in e)for(s=n.length;s--;)o=t._ptLookup[s][i],o&&(o=o.d)&&(o._pt&&(o=av(o,i)),o&&o.modifier&&o.modifier(e[i],t,n[s],i))},tf=function(t,e){return{name:t,headless:1,rawVars:1,init:function(i,s,o){o._onInit=function(a){var l,c;if(ln(s)&&(l={},Gn(s,function(h){return l[h]=1}),s=l),e){l={};for(c in s)l[c]=e(s[c]);s=l}lv(a,s)}}}},Pn=lc.registerPlugin({name:"attr",init:function(t,e,n,i,s){var o,a,l;this.tween=n;for(o in e)l=t.getAttribute(o)||"",a=this.add(t,"setAttribute",(l||0)+"",e[o],i,s,0,0,o),a.op=o,a.b=l,this._props.push(o)},render:function(t,e){for(var n=e._pt;n;)vn?n.set(n.t,n.p,n.b,n):n.r(t,n.d),n=n._next}},{name:"endArray",headless:1,init:function(t,e){for(var n=e.length;n--;)this.add(t,n,t[n]||0,e[n],0,0,0,0,0,1)}},tf("roundProps",cf),tf("modifiers"),tf("snap",mm))||lc;je.version=Cn.version=Pn.version="3.15.0";em=1;df()&&oo();var cv=ge.Power0,hv=ge.Power1,uv=ge.Power2,fv=ge.Power3,dv=ge.Power4,pv=ge.Linear,mv=ge.Quad,gv=ge.Cubic,_v=ge.Quart,xv=ge.Quint,vv=ge.Strong,yv=ge.Elastic,Sv=ge.Back,Mv=ge.SteppedEase,bv=ge.Bounce,wv=ge.Sine,Tv=ge.Expo,Ev=ge.Circ;var Rm,Xr,co,Of,Es,Av,Pm,Uf,Cv=function(){return typeof window<"u"},Sr={},Ts=180/Math.PI,ho=Math.PI/180,lo=Math.atan2,Im=1e8,Bf=/([A-Z])/g,Rv=/(left|right|width|margin|padding|x)/i,Pv=/[\s,\(]\S/,or={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},Df=function(t,e){return e.set(e.t,e.p,Math.round((e.s+e.c*t)*1e4)/1e4+e.u,e)},Iv=function(t,e){return e.set(e.t,e.p,t===1?e.e:Math.round((e.s+e.c*t)*1e4)/1e4+e.u,e)},Dv=function(t,e){return e.set(e.t,e.p,t?Math.round((e.s+e.c*t)*1e4)/1e4+e.u:e.b,e)},Lv=function(t,e){return e.set(e.t,e.p,t===1?e.e:t?Math.round((e.s+e.c*t)*1e4)/1e4+e.u:e.b,e)},Nv=function(t,e){var n=e.s+e.c*t;e.set(e.t,e.p,~~(n+(n<0?-.5:.5))+e.u,e)},km=function(t,e){return e.set(e.t,e.p,t?e.e:e.b,e)},zm=function(t,e){return e.set(e.t,e.p,t!==1?e.b:e.e,e)},Fv=function(t,e,n){return t.style[e]=n},Ov=function(t,e,n){return t.style.setProperty(e,n)},Uv=function(t,e,n){return t._gsap[e]=n},Bv=function(t,e,n){return t._gsap.scaleX=t._gsap.scaleY=n},kv=function(t,e,n,i,s){var o=t._gsap;o.scaleX=o.scaleY=n,o.renderTransform(s,o)},zv=function(t,e,n,i,s){var o=t._gsap;o[e]=n,o.renderTransform(s,o)},Ve="transform",oi=Ve+"Origin",Vv=function r(t,e){var n=this,i=this.target,s=i.style,o=i._gsap;if(t in Sr&&s){if(this.tfm=this.tfm||{},t!=="transform")t=or[t]||t,~t.indexOf(",")?t.split(",").forEach(function(a){return n.tfm[a]=yr(i,a)}):this.tfm[t]=o.x?o[t]:yr(i,t),t===oi&&(this.tfm.zOrigin=o.zOrigin);else return or.transform.split(",").forEach(function(a){return r.call(n,a,e)});if(this.props.indexOf(Ve)>=0)return;o.svg&&(this.svgo=i.getAttribute("data-svg-origin"),this.props.push(oi,e,"")),t=Ve}(s||e)&&this.props.push(t,e,s[t])},Vm=function(t){t.translate&&(t.removeProperty("translate"),t.removeProperty("scale"),t.removeProperty("rotate"))},Hv=function(){var t=this.props,e=this.target,n=e.style,i=e._gsap,s,o;for(s=0;s<t.length;s+=3)t[s+1]?t[s+1]===2?e[t[s]](t[s+2]):e[t[s]]=t[s+2]:t[s+2]?n[t[s]]=t[s+2]:n.removeProperty(t[s].substr(0,2)==="--"?t[s]:t[s].replace(Bf,"-$1").toLowerCase());if(this.tfm){for(o in this.tfm)i[o]=this.tfm[o];i.svg&&(i.renderTransform(),e.setAttribute("data-svg-origin",this.svgo||"")),s=Uf(),(!s||!s.isStart)&&!n[Ve]&&(Vm(n),i.zOrigin&&n[oi]&&(n[oi]+=" "+i.zOrigin+"px",i.zOrigin=0,i.renderTransform()),i.uncache=1)}},Hm=function(t,e){var n={target:t,props:[],revert:Hv,save:Vv};return t._gsap||Pn.core.getCache(t),e&&t.style&&t.nodeType&&e.split(",").forEach(function(i){return n.save(i)}),n},Gm,Lf=function(t,e){var n=Xr.createElementNS?Xr.createElementNS((e||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),t):Xr.createElement(t);return n&&n.style?n:Xr.createElement(t)},di=function r(t,e,n){var i=getComputedStyle(t);return i[e]||i.getPropertyValue(e.replace(Bf,"-$1").toLowerCase())||i.getPropertyValue(e)||!n&&r(t,uo(e)||e,1)||""},Dm="O,Moz,ms,Ms,Webkit".split(","),uo=function(t,e,n){var i=e||Es,s=i.style,o=5;if(t in s&&!n)return t;for(t=t.charAt(0).toUpperCase()+t.substr(1);o--&&!(Dm[o]+t in s););return o<0?null:(o===3?"ms":o>=0?Dm[o]:"")+t},Nf=function(){Cv()&&window.document&&(Rm=window,Xr=Rm.document,co=Xr.documentElement,Es=Lf("div")||{style:{}},Av=Lf("div"),Ve=uo(Ve),oi=Ve+"Origin",Es.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",Gm=!!uo("perspective"),Uf=Pn.core.reverting,Of=1)},Lm=function(t){var e=t.ownerSVGElement,n=Lf("svg",e&&e.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),i=t.cloneNode(!0),s;i.style.display="block",n.appendChild(i),co.appendChild(n);try{s=i.getBBox()}catch{}return n.removeChild(i),co.removeChild(n),s},Nm=function(t,e){for(var n=e.length;n--;)if(t.hasAttribute(e[n]))return t.getAttribute(e[n])},Wm=function(t){var e,n;try{e=t.getBBox()}catch{e=Lm(t),n=1}return e&&(e.width||e.height)||n||(e=Lm(t)),e&&!e.width&&!e.x&&!e.y?{x:+Nm(t,["x","cx","x1"])||0,y:+Nm(t,["y","cy","y1"])||0,width:0,height:0}:e},Xm=function(t){return!!(t.getCTM&&(!t.parentNode||t.ownerSVGElement)&&Wm(t))},qr=function(t,e){if(e){var n=t.style,i;e in Sr&&e!==oi&&(e=Ve),n.removeProperty?(i=e.substr(0,2),(i==="ms"||e.substr(0,6)==="webkit")&&(e="-"+e),n.removeProperty(i==="--"?e:e.replace(Bf,"-$1").toLowerCase())):n.removeAttribute(e)}},Yr=function(t,e,n,i,s,o){var a=new Wn(t._pt,e,n,0,1,o?zm:km);return t._pt=a,a.b=i,a.e=s,t._props.push(n),a},Fm={deg:1,rad:1,turn:1},Gv={grid:1,flex:1},Zr=function r(t,e,n,i){var s=parseFloat(n)||0,o=(n+"").trim().substr((s+"").length)||"px",a=Es.style,l=Rv.test(e),c=t.tagName.toLowerCase()==="svg",h=(c?"client":"offset")+(l?"Width":"Height"),u=100,f=i==="px",d=i==="%",p,_,g,m;if(i===o||!s||Fm[i]||Fm[o])return s;if(o!=="px"&&!f&&(s=r(t,e,n,"px")),m=t.getCTM&&Xm(t),(d||o==="%")&&(Sr[e]||~e.indexOf("adius")))return p=m?t.getBBox()[l?"width":"height"]:t[h],Ye(d?s/p*u:s/100*p);if(a[l?"width":"height"]=u+(f?o:i),_=i!=="rem"&&~e.indexOf("adius")||i==="em"&&t.appendChild&&!c?t:t.parentNode,m&&(_=(t.ownerSVGElement||{}).parentNode),(!_||_===Xr||!_.appendChild)&&(_=Xr.body),g=_._gsap,g&&d&&g.width&&l&&g.time===ii.time&&!g.uncache)return Ye(s/g.width*u);if(d&&(e==="height"||e==="width")){var v=t.style[e];t.style[e]=u+i,p=t[h],v?t.style[e]=v:qr(t,e)}else(d||o==="%")&&!Gv[di(_,"display")]&&(a.position=di(t,"position")),_===t&&(a.position="static"),_.appendChild(Es),p=Es[h],_.removeChild(Es),a.position="absolute";return l&&d&&(g=Hr(_),g.time=ii.time,g.width=_[h]),Ye(f?p*s/u:p&&s?u/p*s:0)},yr=function(t,e,n,i){var s;return Of||Nf(),e in or&&e!=="transform"&&(e=or[e],~e.indexOf(",")&&(e=e.split(",")[0])),Sr[e]&&e!=="transform"?(s=Aa(t,i),s=e!=="transformOrigin"?s[e]:s.svg?s.origin:gc(di(t,oi))+" "+s.zOrigin+"px"):(s=t.style[e],(!s||s==="auto"||i||~(s+"").indexOf("calc("))&&(s=mc[e]&&mc[e](t,e,n)||di(t,e)||yf(t,e)||(e==="opacity"?1:0))),n&&!~(s+"").trim().indexOf(" ")?Zr(t,e,s,n)+n:s},Wv=function(t,e,n,i){if(!n||n==="none"){var s=uo(e,t,1),o=s&&di(t,s,1);o&&o!==n?(e=s,n=o):e==="borderColor"&&(n=di(t,"borderTopColor"))}var a=new Wn(this._pt,t.style,e,0,1,Cf),l=0,c=0,h,u,f,d,p,_,g,m,v,S,x,w;if(a.b=n,a.e=i,n+="",i+="",i.substring(0,6)==="var(--"&&(i=di(t,i.substring(4,i.indexOf(")")))),i==="auto"&&(_=t.style[e],t.style[e]=i,i=di(t,e)||i,_?t.style[e]=_:qr(t,e)),h=[n,i],Mf(h),n=h[0],i=h[1],f=n.match(ys)||[],w=i.match(ys)||[],w.length){for(;u=ys.exec(i);)g=u[0],v=i.substring(l,u.index),p?p=(p+1)%5:(v.substr(-5)==="rgba("||v.substr(-5)==="hsla(")&&(p=1),g!==(_=f[c++]||"")&&(d=parseFloat(_)||0,x=_.substr((d+"").length),g.charAt(1)==="="&&(g=Ss(d,g)+x),m=parseFloat(g),S=g.substr((m+"").length),l=ys.lastIndex-S.length,S||(S=S||si.units[e]||x,l===i.length&&(i+=S,a.e+=S)),x!==S&&(d=Zr(t,e,_,S)||0),a._pt={_next:a._pt,p:v||c===1?v:",",s:d,c:m-d,m:p&&p<4||e==="zIndex"?Math.round:0});a.c=l<i.length?i.substring(l,i.length):""}else a.r=e==="display"&&i==="none"?zm:km;return mf.test(i)&&(a.e=0),this._pt=a,a},Om={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},Xv=function(t){var e=t.split(" "),n=e[0],i=e[1]||"50%";return(n==="top"||n==="bottom"||i==="left"||i==="right")&&(t=n,n=i,i=t),e[0]=Om[n]||n,e[1]=Om[i]||i,e.join(" ")},Yv=function(t,e){if(e.tween&&e.tween._time===e.tween._dur){var n=e.t,i=n.style,s=e.u,o=n._gsap,a,l,c;if(s==="all"||s===!0)i.cssText="",l=1;else for(s=s.split(","),c=s.length;--c>-1;)a=s[c],Sr[a]&&(l=1,a=a==="transformOrigin"?oi:Ve),qr(n,a);l&&(qr(n,Ve),o&&(o.svg&&n.removeAttribute("transform"),i.scale=i.rotate=i.translate="none",Aa(n,1),o.uncache=1,Vm(i)))}},mc={clearProps:function(t,e,n,i,s){if(s.data!=="isFromStart"){var o=t._pt=new Wn(t._pt,e,n,0,0,Yv);return o.u=i,o.pr=-10,o.tween=s,t._props.push(n),1}}},Ea=[1,0,0,1,0,0],Ym={},qm=function(t){return t==="matrix(1, 0, 0, 1, 0, 0)"||t==="none"||!t},Um=function(t){var e=di(t,Ve);return qm(e)?Ea:e.substr(7).match(pf).map(Ye)},kf=function(t,e){var n=t._gsap||Hr(t),i=t.style,s=Um(t),o,a,l,c;return n.svg&&t.getAttribute("transform")?(l=t.transform.baseVal.consolidate().matrix,s=[l.a,l.b,l.c,l.d,l.e,l.f],s.join(",")==="1,0,0,1,0,0"?Ea:s):(s===Ea&&!t.offsetParent&&t!==co&&!n.svg&&(l=i.display,i.display="block",o=t.parentNode,(!o||!t.offsetParent&&!t.getBoundingClientRect().width)&&(c=1,a=t.nextElementSibling,co.appendChild(t)),s=Um(t),l?i.display=l:qr(t,"display"),c&&(a?o.insertBefore(t,a):o?o.appendChild(t):co.removeChild(t))),e&&s.length>6?[s[0],s[1],s[4],s[5],s[12],s[13]]:s)},Ff=function(t,e,n,i,s,o){var a=t._gsap,l=s||kf(t,!0),c=a.xOrigin||0,h=a.yOrigin||0,u=a.xOffset||0,f=a.yOffset||0,d=l[0],p=l[1],_=l[2],g=l[3],m=l[4],v=l[5],S=e.split(" "),x=parseFloat(S[0])||0,w=parseFloat(S[1])||0,M,E,y,b;n?l!==Ea&&(E=d*g-p*_)&&(y=x*(g/E)+w*(-_/E)+(_*v-g*m)/E,b=x*(-p/E)+w*(d/E)-(d*v-p*m)/E,x=y,w=b):(M=Wm(t),x=M.x+(~S[0].indexOf("%")?x/100*M.width:x),w=M.y+(~(S[1]||S[0]).indexOf("%")?w/100*M.height:w)),i||i!==!1&&a.smooth?(m=x-c,v=w-h,a.xOffset=u+(m*d+v*_)-m,a.yOffset=f+(m*p+v*g)-v):a.xOffset=a.yOffset=0,a.xOrigin=x,a.yOrigin=w,a.smooth=!!i,a.origin=e,a.originIsAbsolute=!!n,t.style[oi]="0px 0px",o&&(Yr(o,a,"xOrigin",c,x),Yr(o,a,"yOrigin",h,w),Yr(o,a,"xOffset",u,a.xOffset),Yr(o,a,"yOffset",f,a.yOffset)),t.setAttribute("data-svg-origin",x+" "+w)},Aa=function(t,e){var n=t._gsap||new bf(t);if("x"in n&&!e&&!n.uncache)return n;var i=t.style,s=n.scaleX<0,o="px",a="deg",l=getComputedStyle(t),c=di(t,oi)||"0",h,u,f,d,p,_,g,m,v,S,x,w,M,E,y,b,A,R,P,N,L,F,k,B,$,W,D,Q,Ct,yt,Bt,st;return h=u=f=_=g=m=v=S=x=0,d=p=1,n.svg=!!(t.getCTM&&Xm(t)),l.translate&&((l.translate!=="none"||l.scale!=="none"||l.rotate!=="none")&&(i[Ve]=(l.translate!=="none"?"translate3d("+(l.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+(l.rotate!=="none"?"rotate("+l.rotate+") ":"")+(l.scale!=="none"?"scale("+l.scale.split(" ").join(",")+") ":"")+(l[Ve]!=="none"?l[Ve]:"")),i.scale=i.rotate=i.translate="none"),E=kf(t,n.svg),n.svg&&(n.uncache?($=t.getBBox(),c=n.xOrigin-$.x+"px "+(n.yOrigin-$.y)+"px",B=""):B=!e&&t.getAttribute("data-svg-origin"),Ff(t,B||c,!!B||n.originIsAbsolute,n.smooth!==!1,E)),w=n.xOrigin||0,M=n.yOrigin||0,E!==Ea&&(R=E[0],P=E[1],N=E[2],L=E[3],h=F=E[4],u=k=E[5],E.length===6?(d=Math.sqrt(R*R+P*P),p=Math.sqrt(L*L+N*N),_=R||P?lo(P,R)*Ts:0,v=N||L?lo(N,L)*Ts+_:0,v&&(p*=Math.abs(Math.cos(v*ho))),n.svg&&(h-=w-(w*R+M*N),u-=M-(w*P+M*L))):(st=E[6],yt=E[7],D=E[8],Q=E[9],Ct=E[10],Bt=E[11],h=E[12],u=E[13],f=E[14],y=lo(st,Ct),g=y*Ts,y&&(b=Math.cos(-y),A=Math.sin(-y),B=F*b+D*A,$=k*b+Q*A,W=st*b+Ct*A,D=F*-A+D*b,Q=k*-A+Q*b,Ct=st*-A+Ct*b,Bt=yt*-A+Bt*b,F=B,k=$,st=W),y=lo(-N,Ct),m=y*Ts,y&&(b=Math.cos(-y),A=Math.sin(-y),B=R*b-D*A,$=P*b-Q*A,W=N*b-Ct*A,Bt=L*A+Bt*b,R=B,P=$,N=W),y=lo(P,R),_=y*Ts,y&&(b=Math.cos(y),A=Math.sin(y),B=R*b+P*A,$=F*b+k*A,P=P*b-R*A,k=k*b-F*A,R=B,F=$),g&&Math.abs(g)+Math.abs(_)>359.9&&(g=_=0,m=180-m),d=Ye(Math.sqrt(R*R+P*P+N*N)),p=Ye(Math.sqrt(k*k+st*st)),y=lo(F,k),v=Math.abs(y)>2e-4?y*Ts:0,x=Bt?1/(Bt<0?-Bt:Bt):0),n.svg&&(B=t.getAttribute("transform"),n.forceCSS=t.setAttribute("transform","")||!qm(di(t,Ve)),B&&t.setAttribute("transform",B))),Math.abs(v)>90&&Math.abs(v)<270&&(s?(d*=-1,v+=_<=0?180:-180,_+=_<=0?180:-180):(p*=-1,v+=v<=0?180:-180)),e=e||n.uncache,n.x=h-((n.xPercent=h&&(!e&&n.xPercent||(Math.round(t.offsetWidth/2)===Math.round(-h)?-50:0)))?t.offsetWidth*n.xPercent/100:0)+o,n.y=u-((n.yPercent=u&&(!e&&n.yPercent||(Math.round(t.offsetHeight/2)===Math.round(-u)?-50:0)))?t.offsetHeight*n.yPercent/100:0)+o,n.z=f+o,n.scaleX=Ye(d),n.scaleY=Ye(p),n.rotation=Ye(_)+a,n.rotationX=Ye(g)+a,n.rotationY=Ye(m)+a,n.skewX=v+a,n.skewY=S+a,n.transformPerspective=x+o,(n.zOrigin=parseFloat(c.split(" ")[2])||!e&&n.zOrigin||0)&&(i[oi]=gc(c)),n.xOffset=n.yOffset=0,n.force3D=si.force3D,n.renderTransform=n.svg?Zv:Gm?Zm:qv,n.uncache=0,n},gc=function(t){return(t=t.split(" "))[0]+" "+t[1]},If=function(t,e,n){var i=yn(e);return Ye(parseFloat(e)+parseFloat(Zr(t,"x",n+"px",i)))+i},qv=function(t,e){e.z="0px",e.rotationY=e.rotationX="0deg",e.force3D=0,Zm(t,e)},bs="0deg",Ta="0px",ws=") ",Zm=function(t,e){var n=e||this,i=n.xPercent,s=n.yPercent,o=n.x,a=n.y,l=n.z,c=n.rotation,h=n.rotationY,u=n.rotationX,f=n.skewX,d=n.skewY,p=n.scaleX,_=n.scaleY,g=n.transformPerspective,m=n.force3D,v=n.target,S=n.zOrigin,x="",w=m==="auto"&&t&&t!==1||m===!0;if(S&&(u!==bs||h!==bs)){var M=parseFloat(h)*ho,E=Math.sin(M),y=Math.cos(M),b;M=parseFloat(u)*ho,b=Math.cos(M),o=If(v,o,E*b*-S),a=If(v,a,-Math.sin(M)*-S),l=If(v,l,y*b*-S+S)}g!==Ta&&(x+="perspective("+g+ws),(i||s)&&(x+="translate("+i+"%, "+s+"%) "),(w||o!==Ta||a!==Ta||l!==Ta)&&(x+=l!==Ta||w?"translate3d("+o+", "+a+", "+l+") ":"translate("+o+", "+a+ws),c!==bs&&(x+="rotate("+c+ws),h!==bs&&(x+="rotateY("+h+ws),u!==bs&&(x+="rotateX("+u+ws),(f!==bs||d!==bs)&&(x+="skew("+f+", "+d+ws),(p!==1||_!==1)&&(x+="scale("+p+", "+_+ws),v.style[Ve]=x||"translate(0, 0)"},Zv=function(t,e){var n=e||this,i=n.xPercent,s=n.yPercent,o=n.x,a=n.y,l=n.rotation,c=n.skewX,h=n.skewY,u=n.scaleX,f=n.scaleY,d=n.target,p=n.xOrigin,_=n.yOrigin,g=n.xOffset,m=n.yOffset,v=n.forceCSS,S=parseFloat(o),x=parseFloat(a),w,M,E,y,b;l=parseFloat(l),c=parseFloat(c),h=parseFloat(h),h&&(h=parseFloat(h),c+=h,l+=h),l||c?(l*=ho,c*=ho,w=Math.cos(l)*u,M=Math.sin(l)*u,E=Math.sin(l-c)*-f,y=Math.cos(l-c)*f,c&&(h*=ho,b=Math.tan(c-h),b=Math.sqrt(1+b*b),E*=b,y*=b,h&&(b=Math.tan(h),b=Math.sqrt(1+b*b),w*=b,M*=b)),w=Ye(w),M=Ye(M),E=Ye(E),y=Ye(y)):(w=u,y=f,M=E=0),(S&&!~(o+"").indexOf("px")||x&&!~(a+"").indexOf("px"))&&(S=Zr(d,"x",o,"px"),x=Zr(d,"y",a,"px")),(p||_||g||m)&&(S=Ye(S+p-(p*w+_*E)+g),x=Ye(x+_-(p*M+_*y)+m)),(i||s)&&(b=d.getBBox(),S=Ye(S+i/100*b.width),x=Ye(x+s/100*b.height)),b="matrix("+w+","+M+","+E+","+y+","+S+","+x+")",d.setAttribute("transform",b),v&&(d.style[Ve]=b)},Jv=function(t,e,n,i,s){var o=360,a=ln(s),l=parseFloat(s)*(a&&~s.indexOf("rad")?Ts:1),c=l-i,h=i+c+"deg",u,f;return a&&(u=s.split("_")[1],u==="short"&&(c%=o,c!==c%(o/2)&&(c+=c<0?o:-o)),u==="cw"&&c<0?c=(c+o*Im)%o-~~(c/o)*o:u==="ccw"&&c>0&&(c=(c-o*Im)%o-~~(c/o)*o)),t._pt=f=new Wn(t._pt,e,n,i,c,Iv),f.e=h,f.u="deg",t._props.push(n),f},Bm=function(t,e){for(var n in e)t[n]=e[n];return t},$v=function(t,e,n){var i=Bm({},n._gsap),s="perspective,force3D,transformOrigin,svgOrigin",o=n.style,a,l,c,h,u,f,d,p;i.svg?(c=n.getAttribute("transform"),n.setAttribute("transform",""),o[Ve]=e,a=Aa(n,1),qr(n,Ve),n.setAttribute("transform",c)):(c=getComputedStyle(n)[Ve],o[Ve]=e,a=Aa(n,1),o[Ve]=c);for(l in Sr)c=i[l],h=a[l],c!==h&&s.indexOf(l)<0&&(d=yn(c),p=yn(h),u=d!==p?Zr(n,l,c,p):parseFloat(c),f=parseFloat(h),t._pt=new Wn(t._pt,a,l,u,f-u,Df),t._pt.u=p||0,t._props.push(l));Bm(a,i)};Gn("padding,margin,Width,Radius",function(r,t){var e="Top",n="Right",i="Bottom",s="Left",o=(t<3?[e,n,i,s]:[e+s,e+n,i+n,i+s]).map(function(a){return t<2?r+a:"border"+a+r});mc[t>1?"border"+r:r]=function(a,l,c,h,u){var f,d;if(arguments.length<4)return f=o.map(function(p){return yr(a,p,c)}),d=f.join(" "),d.split(f[0]).length===5?f[0]:d;f=(h+"").split(" "),d={},o.forEach(function(p,_){return d[p]=f[_]=f[_]||f[(_-1)/2|0]}),a.init(l,d,u)}});var zf={name:"css",register:Nf,targetTest:function(t){return t.style&&t.nodeType},init:function(t,e,n,i,s){var o=this._props,a=t.style,l=n.vars.startAt,c,h,u,f,d,p,_,g,m,v,S,x,w,M,E,y,b;Of||Nf(),this.styles=this.styles||Hm(t),y=this.styles.props,this.tween=n;for(_ in e)if(_!=="autoRound"&&(h=e[_],!(ni[_]&&Tf(_,e,n,i,t,s)))){if(d=typeof h,p=mc[_],d==="function"&&(h=h.call(n,i,t,s),d=typeof h),d==="string"&&~h.indexOf("random(")&&(h=ao(h)),p)p(this,t,_,h,n)&&(E=1);else if(_.substr(0,2)==="--")c=(getComputedStyle(t).getPropertyValue(_)+"").trim(),h+="",xr.lastIndex=0,xr.test(c)||(g=yn(c),m=yn(h),m?g!==m&&(c=Zr(t,_,c,m)+m):g&&(h+=g)),this.add(a,"setProperty",c,h,i,s,0,0,_),o.push(_),y.push(_,0,a[_]);else if(d!=="undefined"){if(l&&_ in l?(c=typeof l[_]=="function"?l[_].call(n,i,t,s):l[_],ln(c)&&~c.indexOf("random(")&&(c=ao(c)),yn(c+"")||c==="auto"||(c+=si.units[_]||yn(yr(t,_))||""),(c+"").charAt(1)==="="&&(c=yr(t,_))):c=yr(t,_),f=parseFloat(c),v=d==="string"&&h.charAt(1)==="="&&h.substr(0,2),v&&(h=h.substr(2)),u=parseFloat(h),_ in or&&(_==="autoAlpha"&&(f===1&&yr(t,"visibility")==="hidden"&&u&&(f=0),y.push("visibility",0,a.visibility),Yr(this,a,"visibility",f?"inherit":"hidden",u?"inherit":"hidden",!u)),_!=="scale"&&_!=="transform"&&(_=or[_],~_.indexOf(",")&&(_=_.split(",")[0]))),S=_ in Sr,S){if(this.styles.save(_),b=h,d==="string"&&h.substring(0,6)==="var(--"){if(h=di(t,h.substring(4,h.indexOf(")"))),h.substring(0,5)==="calc("){var A=t.style.perspective;t.style.perspective=h,h=di(t,"perspective"),A?t.style.perspective=A:qr(t,"perspective")}u=parseFloat(h)}if(x||(w=t._gsap,w.renderTransform&&!e.parseTransform||Aa(t,e.parseTransform),M=e.smoothOrigin!==!1&&w.smooth,x=this._pt=new Wn(this._pt,a,Ve,0,1,w.renderTransform,w,0,-1),x.dep=1),_==="scale")this._pt=new Wn(this._pt,w,"scaleY",w.scaleY,(v?Ss(w.scaleY,v+u):u)-w.scaleY||0,Df),this._pt.u=0,o.push("scaleY",_),_+="X";else if(_==="transformOrigin"){y.push(oi,0,a[oi]),h=Xv(h),w.svg?Ff(t,h,0,M,0,this):(m=parseFloat(h.split(" ")[2])||0,m!==w.zOrigin&&Yr(this,w,"zOrigin",w.zOrigin,m),Yr(this,a,_,gc(c),gc(h)));continue}else if(_==="svgOrigin"){Ff(t,h,1,M,0,this);continue}else if(_ in Ym){Jv(this,w,_,f,v?Ss(f,v+h):h);continue}else if(_==="smoothOrigin"){Yr(this,w,"smooth",w.smooth,h);continue}else if(_==="force3D"){w[_]=h;continue}else if(_==="transform"){$v(this,h,t);continue}}else _ in a||(_=uo(_)||_);if(S||(u||u===0)&&(f||f===0)&&!Pv.test(h)&&_ in a)g=(c+"").substr((f+"").length),u||(u=0),m=yn(h)||(_ in si.units?si.units[_]:g),g!==m&&(f=Zr(t,_,c,m)),this._pt=new Wn(this._pt,S?w:a,_,f,(v?Ss(f,v+u):u)-f,!S&&(m==="px"||_==="zIndex")&&e.autoRound!==!1?Nv:Df),this._pt.u=m||0,S&&b!==h?(this._pt.b=c,this._pt.e=b,this._pt.r=Lv):g!==m&&m!=="%"&&(this._pt.b=c,this._pt.r=Dv);else if(_ in a)Wv.call(this,t,_,c,v?v+h:h);else if(_ in t)this.add(t,_,c||t[_],v?v+h:h,i,s);else if(_!=="parseTransform"){hc(_,h);continue}S||(_ in a?y.push(_,0,a[_]):typeof t[_]=="function"?y.push(_,2,t[_]()):y.push(_,1,c||t[_])),o.push(_)}}E&&Pf(this)},render:function(t,e){if(e.tween._time||!Uf())for(var n=e._pt;n;)n.r(t,n.d),n=n._next;else e.styles.revert()},get:yr,aliases:or,getSetter:function(t,e,n){var i=or[e];return i&&i.indexOf(",")<0&&(e=i),e in Sr&&e!==oi&&(t._gsap.x||yr(t,"x"))?n&&Pm===n?e==="scale"?Bv:Uv:(Pm=n||{})&&(e==="scale"?kv:zv):t.style&&!cc(t.style[e])?Fv:~e.indexOf("-")?Ov:pc(t,e)},core:{_removeProperty:qr,_getMatrix:kf}};Pn.utils.checkPrefix=uo;Pn.core.getStyleSaver=Hm;(function(r,t,e,n){var i=Gn(r+","+t+","+e,function(s){Sr[s]=1});Gn(t,function(s){si.units[s]="deg",Ym[s]=1}),or[i[13]]=r+","+t,Gn(n,function(s){var o=s.split(":");or[o[1]]=i[o[0]]})})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent","rotation,rotationX,rotationY,skewX,skewY","transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective","0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");Gn("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(r){si.units[r]="px"});Pn.registerPlugin(zf);var pn=Pn.registerPlugin(zf)||Pn,dE=pn.core.Tween;function Jm(r,t){for(var e=0;e<t.length;e++){var n=t[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(r,n.key,n)}}function Kv(r,t,e){return t&&Jm(r.prototype,t),e&&Jm(r,e),r}var Sn,vc,jv,pi,Jr,$r,po,Km,As,mo,jm,Mr,Vi,Qm,t0=function(){return Sn||typeof window<"u"&&(Sn=window.gsap)&&Sn.registerPlugin&&Sn},e0=1,fo=[],ae=[],Hi=[],Ra=Date.now,Vf=function(t,e){return e},Qv=function(){var t=mo.core,e=t.bridge||{},n=t._scrollers,i=t._proxies;n.push.apply(n,ae),i.push.apply(i,Hi),ae=n,Hi=i,Vf=function(o,a){return e[o](a)}},wr=function(t,e){return~Hi.indexOf(t)&&Hi[Hi.indexOf(t)+1][e]},Pa=function(t){return!!~jm.indexOf(t)},Yn=function(t,e,n,i,s){return t.addEventListener(e,n,{passive:i!==!1,capture:!!s})},Xn=function(t,e,n,i){return t.removeEventListener(e,n,!!i)},_c="scrollLeft",xc="scrollTop",Hf=function(){return Mr&&Mr.isPressed||ae.cache++},yc=function(t,e){var n=function i(s){if(s||s===0){e0&&(pi.history.scrollRestoration="manual");var o=Mr&&Mr.isPressed;s=i.v=Math.round(s)||(Mr&&Mr.iOS?1:0),t(s),i.cacheID=ae.cache,o&&Vf("ss",s)}else(e||ae.cache!==i.cacheID||Vf("ref"))&&(i.cacheID=ae.cache,i.v=t());return i.v+i.offset};return n.offset=0,t&&n},In={s:_c,p:"left",p2:"Left",os:"right",os2:"Right",d:"width",d2:"Width",a:"x",sc:yc(function(r){return arguments.length?pi.scrollTo(r,rn.sc()):pi.pageXOffset||Jr[_c]||$r[_c]||po[_c]||0})},rn={s:xc,p:"top",p2:"Top",os:"bottom",os2:"Bottom",d:"height",d2:"Height",a:"y",op:In,sc:yc(function(r){return arguments.length?pi.scrollTo(In.sc(),r):pi.pageYOffset||Jr[xc]||$r[xc]||po[xc]||0})},qn=function(t,e){return(e&&e._ctx&&e._ctx.selector||Sn.utils.toArray)(t)[0]||(typeof t=="string"&&Sn.config().nullTargetWarn!==!1?console.warn("Element not found:",t):null)},ty=function(t,e){for(var n=e.length;n--;)if(e[n]===t||e[n].contains(t))return!0;return!1},br=function(t,e){var n=e.s,i=e.sc;Pa(t)&&(t=Jr.scrollingElement||$r);var s=ae.indexOf(t),o=i===rn.sc?1:2;!~s&&(s=ae.push(t)-1),ae[s+o]||Yn(t,"scroll",Hf);var a=ae[s+o],l=a||(ae[s+o]=yc(wr(t,n),!0)||(Pa(t)?i:yc(function(c){return arguments.length?t[n]=c:t[n]})));return l.target=t,a||(l.smooth=Sn.getProperty(t,"scrollBehavior")==="smooth"),l},Sc=function(t,e,n){var i=t,s=t,o=Ra(),a=o,l=e||50,c=Math.max(500,l*3),h=function(p,_){var g=Ra();_||g-o>l?(s=i,i=p,a=o,o=g):n?i+=p:i=s+(p-s)/(g-a)*(o-a)},u=function(){s=i=n?0:i,a=o=0},f=function(p){var _=a,g=s,m=Ra();return(p||p===0)&&p!==i&&h(p),o===a||m-a>c?0:(i+(n?g:-g))/((n?m:o)-_)*1e3};return{update:h,reset:u,getVelocity:f}},Ca=function(t,e){return e&&!t._gsapAllow&&t.cancelable!==!1&&t.preventDefault(),t.changedTouches?t.changedTouches[0]:t},$m=function(t){var e=Math.max.apply(Math,t),n=Math.min.apply(Math,t);return Math.abs(e)>=Math.abs(n)?e:n},n0=function(){mo=Sn.core.globals().ScrollTrigger,mo&&mo.core&&Qv()},i0=function(t){return Sn=t||t0(),!vc&&Sn&&typeof document<"u"&&document.body&&(pi=window,Jr=document,$r=Jr.documentElement,po=Jr.body,jm=[pi,Jr,$r,po],jv=Sn.utils.clamp,Qm=Sn.core.context||function(){},As="onpointerenter"in po?"pointer":"mouse",Km=qe.isTouch=pi.matchMedia&&pi.matchMedia("(hover: none), (pointer: coarse)").matches?1:"ontouchstart"in pi||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0?2:0,Vi=qe.eventTypes=("ontouchstart"in $r?"touchstart,touchmove,touchcancel,touchend":"onpointerdown"in $r?"pointerdown,pointermove,pointercancel,pointerup":"mousedown,mousemove,mouseup,mouseup").split(","),setTimeout(function(){return e0=0},500),vc=1),mo||n0(),vc};In.op=rn;ae.cache=0;var qe=(function(){function r(e){this.init(e)}var t=r.prototype;return t.init=function(n){vc||i0(Sn)||console.warn("Please gsap.registerPlugin(Observer)"),mo||n0();var i=n.tolerance,s=n.dragMinimum,o=n.type,a=n.target,l=n.lineHeight,c=n.debounce,h=n.preventDefault,u=n.onStop,f=n.onStopDelay,d=n.ignore,p=n.wheelSpeed,_=n.event,g=n.onDragStart,m=n.onDragEnd,v=n.onDrag,S=n.onPress,x=n.onRelease,w=n.onRight,M=n.onLeft,E=n.onUp,y=n.onDown,b=n.onChangeX,A=n.onChangeY,R=n.onChange,P=n.onToggleX,N=n.onToggleY,L=n.onHover,F=n.onHoverEnd,k=n.onMove,B=n.ignoreCheck,$=n.isNormalizer,W=n.onGestureStart,D=n.onGestureEnd,Q=n.onWheel,Ct=n.onEnable,yt=n.onDisable,Bt=n.onClick,st=n.scrollSpeed,bt=n.capture,q=n.allowClicks,j=n.lockAxis,dt=n.onLockAxis;this.target=a=qn(a)||$r,this.vars=n,d&&(d=Sn.utils.toArray(d)),i=i||1e-9,s=s||0,p=p||1,st=st||1,o=o||"wheel,touch,pointer",c=c!==!1,l||(l=parseFloat(pi.getComputedStyle(po).lineHeight)||22);var zt,xt,Ot,Nt,et,ot,ct,U=this,mt=0,Ht=0,Y=n.passive||!h&&n.passive!==!1,ft=br(a,In),It=br(a,rn),O=ft(),jt=It(),Ft=~o.indexOf("touch")&&!~o.indexOf("pointer")&&Vi[0]==="pointerdown",I=Pa(a),T=a.ownerDocument||Jr,G=[0,0,0],X=[0,0,0],tt=0,gt=function(){return tt=Ra()},ht=function(lt,Jt){return(U.event=lt)&&d&&ty(lt.target,d)||Jt&&Ft&&lt.pointerType!=="touch"||B&&B(lt,Jt)},nt=function(){U._vx.reset(),U._vy.reset(),xt.pause(),u&&u(U)},it=function(){var lt=U.deltaX=$m(G),Jt=U.deltaY=$m(X),ut=Math.abs(lt)>=i,$t=Math.abs(Jt)>=i;R&&(ut||$t)&&R(U,lt,Jt,G,X),ut&&(w&&U.deltaX>0&&w(U),M&&U.deltaX<0&&M(U),b&&b(U),P&&U.deltaX<0!=mt<0&&P(U),mt=U.deltaX,G[0]=G[1]=G[2]=0),$t&&(y&&U.deltaY>0&&y(U),E&&U.deltaY<0&&E(U),A&&A(U),N&&U.deltaY<0!=Ht<0&&N(U),Ht=U.deltaY,X[0]=X[1]=X[2]=0),(Nt||Ot)&&(k&&k(U),Ot&&(g&&Ot===1&&g(U),v&&v(U),Ot=0),Nt=!1),ot&&!(ot=!1)&&dt&&dt(U),et&&(Q(U),et=!1),zt=0},Mt=function(lt,Jt,ut){G[ut]+=lt,X[ut]+=Jt,U._vx.update(lt),U._vy.update(Jt),c?zt||(zt=requestAnimationFrame(it)):it()},Gt=function(lt,Jt){j&&!ct&&(U.axis=ct=Math.abs(lt)>Math.abs(Jt)?"x":"y",ot=!0),ct!=="y"&&(G[2]+=lt,U._vx.update(lt,!0)),ct!=="x"&&(X[2]+=Jt,U._vy.update(Jt,!0)),c?zt||(zt=requestAnimationFrame(it)):it()},Et=function(lt){if(!ht(lt,1)){lt=Ca(lt,h);var Jt=lt.clientX,ut=lt.clientY,$t=Jt-U.x,Wt=ut-U.y,ne=U.isDragging;U.x=Jt,U.y=ut,(ne||($t||Wt)&&(Math.abs(U.startX-Jt)>=s||Math.abs(U.startY-ut)>=s))&&(Ot||(Ot=ne?2:1),ne||(U.isDragging=!0),Gt($t,Wt))}},wt=U.onPress=function(pt){ht(pt,1)||pt&&pt.button||(U.axis=ct=null,xt.pause(),U.isPressed=!0,pt=Ca(pt),mt=Ht=0,U.startX=U.x=pt.clientX,U.startY=U.y=pt.clientY,U._vx.reset(),U._vy.reset(),Yn($?a:T,Vi[1],Et,Y,!0),U.deltaX=U.deltaY=0,S&&S(U))},_t=U.onRelease=function(pt){if(!ht(pt,1)){Xn($?a:T,Vi[1],Et,!0);var lt=!isNaN(U.y-U.startY),Jt=U.isDragging,ut=Jt&&(Math.abs(U.x-U.startX)>3||Math.abs(U.y-U.startY)>3),$t=Ca(pt);!ut&&lt&&(U._vx.reset(),U._vy.reset(),h&&q&&Sn.delayedCall(.08,function(){if(Ra()-tt>300&&!pt.defaultPrevented){if(pt.target.click)pt.target.click();else if(T.createEvent){var Wt=T.createEvent("MouseEvents");Wt.initMouseEvent("click",!0,!0,pi,1,$t.screenX,$t.screenY,$t.clientX,$t.clientY,!1,!1,!1,!1,0,null),pt.target.dispatchEvent(Wt)}}})),U.isDragging=U.isGesturing=U.isPressed=!1,u&&Jt&&!$&&xt.restart(!0),Ot&&it(),m&&Jt&&m(U),x&&x(U,ut)}},qt=function(lt){return lt.touches&&lt.touches.length>1&&(U.isGesturing=!0)&&W(lt,U.isDragging)},Kt=function(){return(U.isGesturing=!1)||D(U)},V=function(lt){if(!ht(lt)){var Jt=ft(),ut=It();Mt((Jt-O)*st,(ut-jt)*st,1),O=Jt,jt=ut,u&&xt.restart(!0)}},St=function(lt){if(!ht(lt)){lt=Ca(lt,h),Q&&(et=!0);var Jt=(lt.deltaMode===1?l:lt.deltaMode===2?pi.innerHeight:1)*p;Mt(lt.deltaX*Jt,lt.deltaY*Jt,0),u&&!$&&xt.restart(!0)}},rt=function(lt){if(!ht(lt)){var Jt=lt.clientX,ut=lt.clientY,$t=Jt-U.x,Wt=ut-U.y;U.x=Jt,U.y=ut,Nt=!0,u&&xt.restart(!0),($t||Wt)&&Gt($t,Wt)}},At=function(lt){U.event=lt,L(U)},Pt=function(lt){U.event=lt,F(U)},at=function(lt){return ht(lt)||Ca(lt,h)&&Bt(U)};xt=U._dc=Sn.delayedCall(f||.25,nt).pause(),U.deltaX=U.deltaY=0,U._vx=Sc(0,50,!0),U._vy=Sc(0,50,!0),U.scrollX=ft,U.scrollY=It,U.isDragging=U.isGesturing=U.isPressed=!1,Qm(this),U.enable=function(pt){return U.isEnabled||(Yn(I?T:a,"scroll",Hf),o.indexOf("scroll")>=0&&Yn(I?T:a,"scroll",V,Y,bt),o.indexOf("wheel")>=0&&Yn(a,"wheel",St,Y,bt),(o.indexOf("touch")>=0&&Km||o.indexOf("pointer")>=0)&&(Yn(a,Vi[0],wt,Y,bt),Yn(T,Vi[2],_t),Yn(T,Vi[3],_t),q&&Yn(a,"click",gt,!0,!0),Bt&&Yn(a,"click",at),W&&Yn(T,"gesturestart",qt),D&&Yn(T,"gestureend",Kt),L&&Yn(a,As+"enter",At),F&&Yn(a,As+"leave",Pt),k&&Yn(a,As+"move",rt)),U.isEnabled=!0,U.isDragging=U.isGesturing=U.isPressed=Nt=Ot=!1,U._vx.reset(),U._vy.reset(),O=ft(),jt=It(),pt&&pt.type&&wt(pt),Ct&&Ct(U)),U},U.disable=function(){U.isEnabled&&(fo.filter(function(pt){return pt!==U&&Pa(pt.target)}).length||Xn(I?T:a,"scroll",Hf),U.isPressed&&(U._vx.reset(),U._vy.reset(),Xn($?a:T,Vi[1],Et,!0)),Xn(I?T:a,"scroll",V,bt),Xn(a,"wheel",St,bt),Xn(a,Vi[0],wt,bt),Xn(T,Vi[2],_t),Xn(T,Vi[3],_t),Xn(a,"click",gt,!0),Xn(a,"click",at),Xn(T,"gesturestart",qt),Xn(T,"gestureend",Kt),Xn(a,As+"enter",At),Xn(a,As+"leave",Pt),Xn(a,As+"move",rt),U.isEnabled=U.isPressed=U.isDragging=!1,yt&&yt(U))},U.kill=U.revert=function(){U.disable();var pt=fo.indexOf(U);pt>=0&&fo.splice(pt,1),Mr===U&&(Mr=0)},fo.push(U),$&&Pa(a)&&(Mr=U),U.enable(_)},Kv(r,[{key:"velocityX",get:function(){return this._vx.getVelocity()}},{key:"velocityY",get:function(){return this._vy.getVelocity()}}]),r})();qe.version="3.15.0";qe.create=function(r){return new qe(r)};qe.register=i0;qe.getAll=function(){return fo.slice()};qe.getById=function(r){return fo.filter(function(t){return t.vars.id===r})[0]};t0()&&Sn.registerPlugin(qe);var Vt,vo,ue,we,_i,Se,nd,Uc,Wa,Ua,Da,Mc,Dn,zc,Jf,Jn,r0,s0,yo,S0,Gf,M0,Zn,$f,b0,w0,Kr,Kf,id,So,rd,Ba,jf,Wf,bc=1,Ln=Date.now,Xf=Ln(),Di=0,La=0,o0=function(t,e,n){var i=gi(t)&&(t.substr(0,6)==="clamp("||t.indexOf("max")>-1);return n["_"+e+"Clamp"]=i,i?t.substr(6,t.length-7):t},a0=function(t,e){return e&&(!gi(t)||t.substr(0,6)!=="clamp(")?"clamp("+t+")":t},ey=function r(){return La&&requestAnimationFrame(r)},l0=function(){return zc=1},c0=function(){return zc=0},ar=function(t){return t},Na=function(t){return Math.round(t*1e5)/1e5||0},T0=function(){return typeof window<"u"},E0=function(){return Vt||T0()&&(Vt=window.gsap)&&Vt.registerPlugin&&Vt},Ls=function(t){return!!~nd.indexOf(t)},A0=function(t){return(t==="Height"?rd:ue["inner"+t])||_i["client"+t]||Se["client"+t]},C0=function(t){return wr(t,"getBoundingClientRect")||(Ls(t)?function(){return Oc.width=ue.innerWidth,Oc.height=rd,Oc}:function(){return Tr(t)})},ny=function(t,e,n){var i=n.d,s=n.d2,o=n.a;return(o=wr(t,"getBoundingClientRect"))?function(){return o()[i]}:function(){return(e?A0(s):t["client"+s])||0}},iy=function(t,e){return!e||~Hi.indexOf(t)?C0(t):function(){return Oc}},lr=function(t,e){var n=e.s,i=e.d2,s=e.d,o=e.a;return Math.max(0,(n="scroll"+i)&&(o=wr(t,n))?o()-C0(t)()[s]:Ls(t)?(_i[n]||Se[n])-A0(i):t[n]-t["offset"+i])},wc=function(t,e){for(var n=0;n<yo.length;n+=3)(!e||~e.indexOf(yo[n+1]))&&t(yo[n],yo[n+1],yo[n+2])},gi=function(t){return typeof t=="string"},Nn=function(t){return typeof t=="function"},Fa=function(t){return typeof t=="number"},Cs=function(t){return typeof t=="object"},Ia=function(t,e,n){return t&&t.progress(e?0:1)&&n&&t.pause()},go=function(t,e,n){if(t.enabled){var i=t._ctx?t._ctx.add(function(){return e(t,n)}):e(t,n);i&&i.totalTime&&(t.callbackAnimation=i)}},_o=Math.abs,R0="left",P0="top",sd="right",od="bottom",Ps="width",Is="height",ka="Right",za="Left",Va="Top",Ha="Bottom",sn="padding",Pi="margin",bo="Width",ad="Height",cn="px",Ii=function(t){return ue.getComputedStyle(t.nodeType===Node.DOCUMENT_NODE?t.scrollingElement:t)},ry=function(t){var e=Ii(t).position;t.style.position=e==="absolute"||e==="fixed"?e:"relative"},h0=function(t,e){for(var n in e)n in t||(t[n]=e[n]);return t},Tr=function(t,e){var n=e&&Ii(t)[Jf]!=="matrix(1, 0, 0, 1, 0, 0)"&&Vt.to(t,{x:0,y:0,xPercent:0,yPercent:0,rotation:0,rotationX:0,rotationY:0,scale:1,skewX:0,skewY:0}).progress(1),i=t.getBoundingClientRect?t.getBoundingClientRect():t.scrollingElement.getBoundingClientRect();return n&&n.progress(0).kill(),i},Bc=function(t,e){var n=e.d2;return t["offset"+n]||t["client"+n]||0},I0=function(t){var e=[],n=t.labels,i=t.duration(),s;for(s in n)e.push(n[s]/i);return e},sy=function(t){return function(e){return Vt.utils.snap(I0(t),e)}},ld=function(t){var e=Vt.utils.snap(t),n=Array.isArray(t)&&t.slice(0).sort(function(i,s){return i-s});return n?function(i,s,o){o===void 0&&(o=.001);var a;if(!s)return e(i);if(s>0){for(i-=o,a=0;a<n.length;a++)if(n[a]>=i)return n[a];return n[a-1]}else for(a=n.length,i+=o;a--;)if(n[a]<=i)return n[a];return n[0]}:function(i,s,o){o===void 0&&(o=.001);var a=e(i);return!s||Math.abs(a-i)<o||a-i<0==s<0?a:e(s<0?i-t:i+t)}},oy=function(t){return function(e,n){return ld(I0(t))(e,n.direction)}},Tc=function(t,e,n,i){return n.split(",").forEach(function(s){return t(e,s,i)})},gn=function(t,e,n,i,s){return t.addEventListener(e,n,{passive:!i,capture:!!s})},mn=function(t,e,n,i){return t.removeEventListener(e,n,!!i)},Ec=function(t,e,n){n=n&&n.wheelHandler,n&&(t(e,"wheel",n),t(e,"touchmove",n))},u0={startColor:"green",endColor:"red",indent:0,fontSize:"16px",fontWeight:"normal"},Ac={toggleActions:"play",anticipatePin:0},kc={top:0,left:0,center:.5,bottom:1,right:1},Dc=function(t,e){if(gi(t)){var n=t.indexOf("="),i=~n?+(t.charAt(n-1)+1)*parseFloat(t.substr(n+1)):0;~n&&(t.indexOf("%")>n&&(i*=e/100),t=t.substr(0,n-1)),t=i+(t in kc?kc[t]*e:~t.indexOf("%")?parseFloat(t)*e/100:parseFloat(t)||0)}return t},Cc=function(t,e,n,i,s,o,a,l){var c=s.startColor,h=s.endColor,u=s.fontSize,f=s.indent,d=s.fontWeight,p=we.createElement("div"),_=Ls(n)||wr(n,"pinType")==="fixed",g=t.indexOf("scroller")!==-1,m=_?Se:n.tagName==="IFRAME"?n.contentDocument.body:n,v=t.indexOf("start")!==-1,S=v?c:h,x="border-color:"+S+";font-size:"+u+";color:"+S+";font-weight:"+d+";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";return x+="position:"+((g||l)&&_?"fixed;":"absolute;"),(g||l||!_)&&(x+=(i===rn?sd:od)+":"+(o+parseFloat(f))+"px;"),a&&(x+="box-sizing:border-box;text-align:left;width:"+a.offsetWidth+"px;"),p._isStart=v,p.setAttribute("class","gsap-marker-"+t+(e?" marker-"+e:"")),p.style.cssText=x,p.innerText=e||e===0?t+"-"+e:t,m.children[0]?m.insertBefore(p,m.children[0]):m.appendChild(p),p._offset=p["offset"+i.op.d2],Lc(p,0,i,v),p},Lc=function(t,e,n,i){var s={display:"block"},o=n[i?"os2":"p2"],a=n[i?"p2":"os2"];t._isFlipped=i,s[n.a+"Percent"]=i?-100:0,s[n.a]=i?"1px":0,s["border"+o+bo]=1,s["border"+a+bo]=0,s[n.p]=e+"px",Vt.set(t,s)},le=[],Qf={},Xa,f0=function(){return Ln()-Di>34&&(Xa||(Xa=requestAnimationFrame(Er)))},xo=function(){(!Zn||!Zn.isPressed||Zn.startX>Se.clientWidth)&&(ae.cache++,Zn?Xa||(Xa=requestAnimationFrame(Er)):Er(),Di||Fs("scrollStart"),Di=Ln())},Yf=function(){w0=ue.innerWidth,b0=ue.innerHeight},Oa=function(t){ae.cache++,(t===!0||!Dn&&!M0&&!we.fullscreenElement&&!we.webkitFullscreenElement&&(!$f||w0!==ue.innerWidth||Math.abs(ue.innerHeight-b0)>ue.innerHeight*.25))&&Uc.restart(!0)},Ns={},ay=[],D0=function r(){return mn(re,"scrollEnd",r)||Rs(!0)},Fs=function(t){return Ns[t]&&Ns[t].map(function(e){return e()})||ay},mi=[],L0=function(t){for(var e=0;e<mi.length;e+=5)(!t||mi[e+4]&&mi[e+4].query===t)&&(mi[e].style.cssText=mi[e+1],mi[e].getBBox&&mi[e].setAttribute("transform",mi[e+2]||""),mi[e+3].uncache=1)},N0=function(){return ae.forEach(function(t){return Nn(t)&&++t.cacheID&&(t.rec=t())})},cd=function(t,e){var n;for(Jn=0;Jn<le.length;Jn++)n=le[Jn],n&&(!e||n._ctx===e)&&(t?n.kill(1):n.revert(!0,!0));Ba=!0,e&&L0(e),e||Fs("revert")},F0=function(t,e){ae.cache++,(e||!$n)&&ae.forEach(function(n){return Nn(n)&&n.cacheID++&&(n.rec=0)}),gi(t)&&(ue.history.scrollRestoration=id=t)},$n,Ds=0,d0,ly=function(){if(d0!==Ds){var t=d0=Ds;requestAnimationFrame(function(){return t===Ds&&Rs(!0)})}},O0=function(){Se.appendChild(So),rd=!Zn&&So.offsetHeight||ue.innerHeight,Se.removeChild(So)},p0=function(t){return Wa(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end").forEach(function(e){return e.style.display=t?"none":"block"})},Rs=function(t,e){if(_i=we.documentElement,Se=we.body,nd=[ue,we,_i,Se],Di&&!t&&!Ba){gn(re,"scrollEnd",D0);return}O0(),$n=re.isRefreshing=!0,Ba||N0();var n=Fs("refreshInit");S0&&re.sort(),e||cd(),ae.forEach(function(i){Nn(i)&&(i.smooth&&(i.target.style.scrollBehavior="auto"),i(0))}),le.slice(0).forEach(function(i){return i.refresh()}),Ba=!1,le.forEach(function(i){if(i._subPinOffset&&i.pin){var s=i.vars.horizontal?"offsetWidth":"offsetHeight",o=i.pin[s];i.revert(!0,1),i.adjustPinSpacing(i.pin[s]-o),i.refresh()}}),jf=1,p0(!0),le.forEach(function(i){var s=lr(i.scroller,i._dir),o=i.vars.end==="max"||i._endClamp&&i.end>s,a=i._startClamp&&i.start>=s;(o||a)&&i.setPositions(a?s-1:i.start,o?Math.max(a?s:i.start+1,s):i.end,!0)}),p0(!1),jf=0,n.forEach(function(i){return i&&i.render&&i.render(-1)}),ae.forEach(function(i){Nn(i)&&(i.smooth&&requestAnimationFrame(function(){return i.target.style.scrollBehavior="smooth"}),i.rec&&i(i.rec))}),F0(id,1),Uc.pause(),Ds++,$n=2,Er(2),le.forEach(function(i){return Nn(i.vars.onRefresh)&&i.vars.onRefresh(i)}),$n=re.isRefreshing=!1,Fs("refresh")},td=0,Nc=1,Ga,Er=function(t){if(t===2||!$n&&!Ba){re.isUpdating=!0,Ga&&Ga.update(0);var e=le.length,n=Ln(),i=n-Xf>=50,s=e&&le[0].scroll();if(Nc=td>s?-1:1,$n||(td=s),i&&(Di&&!zc&&n-Di>200&&(Di=0,Fs("scrollEnd")),Da=Xf,Xf=n),Nc<0){for(Jn=e;Jn-- >0;)le[Jn]&&le[Jn].update(0,i);Nc=1}else for(Jn=0;Jn<e;Jn++)le[Jn]&&le[Jn].update(0,i);re.isUpdating=!1}Xa=0},ed=[R0,P0,od,sd,Pi+Ha,Pi+ka,Pi+Va,Pi+za,"display","flexShrink","float","zIndex","gridColumnStart","gridColumnEnd","gridRowStart","gridRowEnd","gridArea","justifySelf","alignSelf","placeSelf","order"],Fc=ed.concat([Ps,Is,"boxSizing","max"+bo,"max"+ad,"position",Pi,sn,sn+Va,sn+ka,sn+Ha,sn+za]),cy=function(t,e,n){Mo(n);var i=t._gsap;if(i.spacerIsNative)Mo(i.spacerState);else if(t._gsap.swappedIn){var s=e.parentNode;s&&(s.insertBefore(t,e),s.removeChild(e))}t._gsap.swappedIn=!1},qf=function(t,e,n,i){if(!t._gsap.swappedIn){for(var s=ed.length,o=e.style,a=t.style,l;s--;)l=ed[s],o[l]=n[l];o.position=n.position==="absolute"?"absolute":"relative",n.display==="inline"&&(o.display="inline-block"),a[od]=a[sd]="auto",o.flexBasis=n.flexBasis||"auto",o.overflow="visible",o.boxSizing="border-box",o[Ps]=Bc(t,In)+cn,o[Is]=Bc(t,rn)+cn,o[sn]=a[Pi]=a[P0]=a[R0]="0",Mo(i),a[Ps]=a["max"+bo]=n[Ps],a[Is]=a["max"+ad]=n[Is],a[sn]=n[sn],t.parentNode!==e&&(t.parentNode.insertBefore(e,t),e.appendChild(t)),t._gsap.swappedIn=!0}},hy=/([A-Z])/g,Mo=function(t){if(t){var e=t.t.style,n=t.length,i=0,s,o;for((t.t._gsap||Vt.core.getCache(t.t)).uncache=1;i<n;i+=2)o=t[i+1],s=t[i],o?e[s]=o:e[s]&&e.removeProperty(s.replace(hy,"-$1").toLowerCase())}},Rc=function(t){for(var e=Fc.length,n=t.style,i=[],s=0;s<e;s++)i.push(Fc[s],n[Fc[s]]);return i.t=t,i},uy=function(t,e,n){for(var i=[],s=t.length,o=n?8:0,a;o<s;o+=2)a=t[o],i.push(a,a in e?e[a]:t[o+1]);return i.t=t.t,i},Oc={left:0,top:0},m0=function(t,e,n,i,s,o,a,l,c,h,u,f,d,p){Nn(t)&&(t=t(l)),gi(t)&&t.substr(0,3)==="max"&&(t=f+(t.charAt(4)==="="?Dc("0"+t.substr(3),n):0));var _=d?d.time():0,g,m,v;if(d&&d.seek(0),isNaN(t)||(t=+t),Fa(t))d&&(t=Vt.utils.mapRange(d.scrollTrigger.start,d.scrollTrigger.end,0,f,t)),a&&Lc(a,n,i,!0);else{Nn(e)&&(e=e(l));var S=(t||"0").split(" "),x,w,M,E;v=qn(e,l)||Se,x=Tr(v)||{},(!x||!x.left&&!x.top)&&Ii(v).display==="none"&&(E=v.style.display,v.style.display="block",x=Tr(v),E?v.style.display=E:v.style.removeProperty("display")),w=Dc(S[0],x[i.d]),M=Dc(S[1]||"0",n),t=x[i.p]-c[i.p]-h+w+s-M,a&&Lc(a,M,i,n-M<20||a._isStart&&M>20),n-=n-M}if(p&&(l[p]=t||-.001,t<0&&(t=0)),o){var y=t+n,b=o._isStart;g="scroll"+i.d2,Lc(o,y,i,b&&y>20||!b&&(u?Math.max(Se[g],_i[g]):o.parentNode[g])<=y+1),u&&(c=Tr(a),u&&(o.style[i.op.p]=c[i.op.p]-i.op.m-o._offset+cn))}return d&&v&&(g=Tr(v),d.seek(f),m=Tr(v),d._caScrollDist=g[i.p]-m[i.p],t=t/d._caScrollDist*f),d&&d.seek(_),d?t:Math.round(t)},fy=/(webkit|moz|length|cssText|inset)/i,g0=function(t,e,n,i){if(t.parentNode!==e){var s=t.style,o,a;if(e===Se){t._stOrig=s.cssText,a=Ii(t);for(o in a)!+o&&!fy.test(o)&&a[o]&&typeof s[o]=="string"&&o!=="0"&&(s[o]=a[o]);s.top=n,s.left=i}else s.cssText=t._stOrig;Vt.core.getCache(t).uncache=1,e.appendChild(t)}},U0=function(t,e,n){var i=e,s=i;return function(o){var a=Math.round(t());return a!==i&&a!==s&&Math.abs(a-i)>3&&Math.abs(a-s)>3&&(o=a,n&&n()),s=i,i=Math.round(o),i}},Pc=function(t,e,n){var i={};i[e.p]="+="+n,Vt.set(t,i)},_0=function(t,e){var n=br(t,e),i="_scroll"+e.p2,s=function o(a,l,c,h,u){var f=o.tween,d=l.onComplete,p={};c=c||n();var _=U0(n,c,function(){f.kill(),o.tween=0});return u=h&&u||0,h=h||a-c,f&&f.kill(),l[i]=a,l.inherit=!1,l.modifiers=p,p[i]=function(){return _(c+h*f.ratio+u*f.ratio*f.ratio)},l.onUpdate=function(){ae.cache++,o.tween&&Er()},l.onComplete=function(){o.tween=0,d&&d.call(f)},f=o.tween=Vt.to(t,l),f};return t[i]=n,n.wheelHandler=function(){return s.tween&&s.tween.kill()&&(s.tween=0)},gn(t,"wheel",n.wheelHandler),re.isTouch&&gn(t,"touchmove",n.wheelHandler),s},re=(function(){function r(e,n){vo||r.register(Vt)||console.warn("Please gsap.registerPlugin(ScrollTrigger)"),Kf(this),this.init(e,n)}var t=r.prototype;return t.init=function(n,i){if(this.progress=this.start=0,this.vars&&this.kill(!0,!0),!La){this.update=this.refresh=this.kill=ar;return}n=h0(gi(n)||Fa(n)||n.nodeType?{trigger:n}:n,Ac);var s=n,o=s.onUpdate,a=s.toggleClass,l=s.id,c=s.onToggle,h=s.onRefresh,u=s.scrub,f=s.trigger,d=s.pin,p=s.pinSpacing,_=s.invalidateOnRefresh,g=s.anticipatePin,m=s.onScrubComplete,v=s.onSnapComplete,S=s.once,x=s.snap,w=s.pinReparent,M=s.pinSpacer,E=s.containerAnimation,y=s.fastScrollEnd,b=s.preventOverlaps,A=n.horizontal||n.containerAnimation&&n.horizontal!==!1?In:rn,R=!u&&u!==0,P=qn(n.scroller||ue),N=Vt.core.getCache(P),L=Ls(P),F=("pinType"in n?n.pinType:wr(P,"pinType")||L&&"fixed")==="fixed",k=[n.onEnter,n.onLeave,n.onEnterBack,n.onLeaveBack],B=R&&n.toggleActions.split(" "),$="markers"in n?n.markers:Ac.markers,W=L?0:parseFloat(Ii(P)["border"+A.p2+bo])||0,D=this,Q=n.onRefreshInit&&function(){return n.onRefreshInit(D)},Ct=ny(P,L,A),yt=iy(P,L),Bt=0,st=0,bt=0,q=br(P,A),j,dt,zt,xt,Ot,Nt,et,ot,ct,U,mt,Ht,Y,ft,It,O,jt,Ft,I,T,G,X,tt,gt,ht,nt,it,Mt,Gt,Et,wt,_t,qt,Kt,V,St,rt,At,Pt;if(D._startClamp=D._endClamp=!1,D._dir=A,g*=45,D.scroller=P,D.scroll=E?E.time.bind(E):q,xt=q(),D.vars=n,i=i||n.animation,"refreshPriority"in n&&(S0=1,n.refreshPriority===-9999&&(Ga=D)),N.tweenScroll=N.tweenScroll||{top:_0(P,rn),left:_0(P,In)},D.tweenTo=j=N.tweenScroll[A.p],D.scrubDuration=function(ut){qt=Fa(ut)&&ut,qt?_t?_t.duration(ut):_t=Vt.to(i,{ease:"expo",totalProgress:"+=0",inherit:!1,duration:qt,paused:!0,onComplete:function(){return m&&m(D)}}):(_t&&_t.progress(1).kill(),_t=0)},i&&(i.vars.lazy=!1,i._initted&&!D.isReverted||i.vars.immediateRender!==!1&&n.immediateRender!==!1&&i.duration()&&i.render(0,!0,!0),D.animation=i.pause(),i.scrollTrigger=D,D.scrubDuration(u),Et=0,l||(l=i.vars.id)),x&&((!Cs(x)||x.push)&&(x={snapTo:x}),"scrollBehavior"in Se.style&&Vt.set(L?[Se,_i]:P,{scrollBehavior:"auto"}),ae.forEach(function(ut){return Nn(ut)&&ut.target===(L?we.scrollingElement||_i:P)&&(ut.smooth=!1)}),zt=Nn(x.snapTo)?x.snapTo:x.snapTo==="labels"?sy(i):x.snapTo==="labelsDirectional"?oy(i):x.directional!==!1?function(ut,$t){return ld(x.snapTo)(ut,Ln()-st<500?0:$t.direction)}:Vt.utils.snap(x.snapTo),Kt=x.duration||{min:.1,max:2},Kt=Cs(Kt)?Ua(Kt.min,Kt.max):Ua(Kt,Kt),V=Vt.delayedCall(x.delay||qt/2||.1,function(){var ut=q(),$t=Ln()-st<500,Wt=j.tween;if(($t||Math.abs(D.getVelocity())<10)&&!Wt&&!zc&&Bt!==ut){var ne=(ut-Nt)/ft,tn=i&&!R?i.totalProgress():ne,he=$t?0:(tn-wt)/(Ln()-Da)*1e3||0,Le=Vt.utils.clamp(-ne,1-ne,_o(he/2)*he/.185),fn=ne+(x.inertia===!1?0:Le),Ne,Ae,me=x,zn=me.onStart,Ie=me.onInterrupt,En=me.onComplete;if(Ne=zt(fn,D),Fa(Ne)||(Ne=fn),Ae=Math.max(0,Math.round(Nt+Ne*ft)),ut<=et&&ut>=Nt&&Ae!==ut){if(Wt&&!Wt._initted&&Wt.data<=_o(Ae-ut))return;x.inertia===!1&&(Le=Ne-ne),j(Ae,{duration:Kt(_o(Math.max(_o(fn-tn),_o(Ne-tn))*.185/he/.05||0)),ease:x.ease||"power3",data:_o(Ae-ut),onInterrupt:function(){return V.restart(!0)&&Ie&&go(D,Ie)},onComplete:function(){D.update(),Bt=q(),i&&!R&&(_t?_t.resetTo("totalProgress",Ne,i._tTime/i._tDur):i.progress(Ne)),Et=wt=i&&!R?i.totalProgress():D.progress,v&&v(D),En&&go(D,En)}},ut,Le*ft,Ae-ut-Le*ft),zn&&go(D,zn,j.tween)}}else D.isActive&&Bt!==ut&&V.restart(!0)}).pause()),l&&(Qf[l]=D),f=D.trigger=qn(f||d!==!0&&d),Pt=f&&f._gsap&&f._gsap.stRevert,Pt&&(Pt=Pt(D)),d=d===!0?f:qn(d),gi(a)&&(a={targets:f,className:a}),d&&(p===!1||p===Pi||(p=!p&&d.parentNode&&d.parentNode.style&&Ii(d.parentNode).display==="flex"?!1:sn),D.pin=d,dt=Vt.core.getCache(d),dt.spacer?It=dt.pinState:(M&&(M=qn(M),M&&!M.nodeType&&(M=M.current||M.nativeElement),dt.spacerIsNative=!!M,M&&(dt.spacerState=Rc(M))),dt.spacer=Ft=M||we.createElement("div"),Ft.classList.add("pin-spacer"),l&&Ft.classList.add("pin-spacer-"+l),dt.pinState=It=Rc(d)),n.force3D!==!1&&Vt.set(d,{force3D:!0}),D.spacer=Ft=dt.spacer,Gt=Ii(d),gt=Gt[p+A.os2],T=Vt.getProperty(d),G=Vt.quickSetter(d,A.a,cn),qf(d,Ft,Gt),jt=Rc(d)),$){Ht=Cs($)?h0($,u0):u0,U=Cc("scroller-start",l,P,A,Ht,0),mt=Cc("scroller-end",l,P,A,Ht,0,U),I=U["offset"+A.op.d2];var at=qn(wr(P,"content")||P);ot=this.markerStart=Cc("start",l,at,A,Ht,I,0,E),ct=this.markerEnd=Cc("end",l,at,A,Ht,I,0,E),E&&(At=Vt.quickSetter([ot,ct],A.a,cn)),!F&&!(Hi.length&&wr(P,"fixedMarkers")===!0)&&(ry(L?Se:P),Vt.set([U,mt],{force3D:!0}),nt=Vt.quickSetter(U,A.a,cn),Mt=Vt.quickSetter(mt,A.a,cn))}if(E){var pt=E.vars.onUpdate,lt=E.vars.onUpdateParams;E.eventCallback("onUpdate",function(){D.update(0,0,1),pt&&pt.apply(E,lt||[])})}if(D.previous=function(){return le[le.indexOf(D)-1]},D.next=function(){return le[le.indexOf(D)+1]},D.revert=function(ut,$t){if(!$t)return D.kill(!0);var Wt=ut!==!1||!D.enabled,ne=Dn;Wt!==D.isReverted&&(Wt&&(St=Math.max(q(),D.scroll.rec||0),bt=D.progress,rt=i&&i.progress()),ot&&[ot,ct,U,mt].forEach(function(tn){return tn.style.display=Wt?"none":"block"}),Wt&&(Dn=D,D.update(Wt)),d&&(!w||!D.isActive)&&(Wt?cy(d,Ft,It):qf(d,Ft,Ii(d),ht)),Wt||D.update(Wt),Dn=ne,D.isReverted=Wt)},D.refresh=function(ut,$t,Wt,ne){if(!((Dn||!D.enabled)&&!$t)){if(d&&ut&&Di){gn(r,"scrollEnd",D0);return}!$n&&Q&&Q(D),Dn=D,j.tween&&!Wt&&(j.tween.kill(),j.tween=0),_t&&_t.pause(),_&&i&&(i.revert({kill:!1}).invalidate(),i.getChildren?i.getChildren(!0,!0,!1).forEach(function(Rt){return Rt.vars.immediateRender&&Rt.render(0,!0,!0)}):i.vars.immediateRender&&i.render(0,!0,!0)),D.isReverted||D.revert(!0,!0),D._subPinOffset=!1;var tn=Ct(),he=yt(),Le=E?E.duration():lr(P,A),fn=ft<=.01||!ft,Ne=0,Ae=ne||0,me=Cs(Wt)?Wt.end:n.end,zn=n.endTrigger||f,Ie=Cs(Wt)?Wt.start:n.start||(n.start===0||!f?0:d?"0 0":"0 100%"),En=D.pinnedContainer=n.pinnedContainer&&qn(n.pinnedContainer,D),Vn=f&&Math.max(0,le.indexOf(D))||0,en=Vn,We,an,er,js,dn,$e,Ti,Qs,C,H,K,Z,J;for($&&Cs(Wt)&&(Z=Vt.getProperty(U,A.p),J=Vt.getProperty(mt,A.p));en-- >0;)$e=le[en],$e.end||$e.refresh(0,1)||(Dn=D),Ti=$e.pin,Ti&&(Ti===f||Ti===d||Ti===En)&&!$e.isReverted&&(H||(H=[]),H.unshift($e),$e.revert(!0,!0)),$e!==le[en]&&(Vn--,en--);for(Nn(Ie)&&(Ie=Ie(D)),Ie=o0(Ie,"start",D),Nt=m0(Ie,f,tn,A,q(),ot,U,D,he,W,F,Le,E,D._startClamp&&"_startClamp")||(d?-.001:0),Nn(me)&&(me=me(D)),gi(me)&&!me.indexOf("+=")&&(~me.indexOf(" ")?me=(gi(Ie)?Ie.split(" ")[0]:"")+me:(Ne=Dc(me.substr(2),tn),me=gi(Ie)?Ie:(E?Vt.utils.mapRange(0,E.duration(),E.scrollTrigger.start,E.scrollTrigger.end,Nt):Nt)+Ne,zn=f)),me=o0(me,"end",D),et=Math.max(Nt,m0(me||(zn?"100% 0":Le),zn,tn,A,q()+Ne,ct,mt,D,he,W,F,Le,E,D._endClamp&&"_endClamp"))||-.001,Ne=0,en=Vn;en--;)$e=le[en]||{},Ti=$e.pin,Ti&&$e.start-$e._pinPush<=Nt&&!E&&$e.end>0&&(We=$e.end-(D._startClamp?Math.max(0,$e.start):$e.start),(Ti===f&&$e.start-$e._pinPush<Nt||Ti===En)&&isNaN(Ie)&&(Ne+=We*(1-$e.progress)),Ti===d&&(Ae+=We));if(Nt+=Ne,et+=Ne,D._startClamp&&(D._startClamp+=Ne),D._endClamp&&!$n&&(D._endClamp=et||-.001,et=Math.min(et,lr(P,A))),ft=et-Nt||(Nt-=.01)&&.001,fn&&(bt=Vt.utils.clamp(0,1,Vt.utils.normalize(Nt,et,St))),D._pinPush=Ae,ot&&Ne&&(We={},We[A.a]="+="+Ne,En&&(We[A.p]="-="+q()),Vt.set([ot,ct],We)),d&&!(jf&&D.end>=lr(P,A)))We=Ii(d),js=A===rn,er=q(),X=parseFloat(T(A.a))+Ae,!Le&&et>1&&(K=(L?we.scrollingElement||_i:P).style,K={style:K,value:K["overflow"+A.a.toUpperCase()]},L&&Ii(Se)["overflow"+A.a.toUpperCase()]!=="scroll"&&(K.style["overflow"+A.a.toUpperCase()]="scroll")),qf(d,Ft,We),jt=Rc(d),an=Tr(d,!0),Qs=F&&br(P,js?In:rn)(),p?(ht=[p+A.os2,ft+Ae+cn],ht.t=Ft,en=p===sn?Bc(d,A)+ft+Ae:0,en&&(ht.push(A.d,en+cn),Ft.style.flexBasis!=="auto"&&(Ft.style.flexBasis=en+cn)),Mo(ht),En&&le.forEach(function(Rt){Rt.pin===En&&Rt.vars.pinSpacing!==!1&&(Rt._subPinOffset=!0)}),F&&q(St)):(en=Bc(d,A),en&&Ft.style.flexBasis!=="auto"&&(Ft.style.flexBasis=en+cn)),F&&(dn={top:an.top+(js?er-Nt:Qs)+cn,left:an.left+(js?Qs:er-Nt)+cn,boxSizing:"border-box",position:"fixed"},dn[Ps]=dn["max"+bo]=Math.ceil(an.width)+cn,dn[Is]=dn["max"+ad]=Math.ceil(an.height)+cn,dn[Pi]=dn[Pi+Va]=dn[Pi+ka]=dn[Pi+Ha]=dn[Pi+za]="0",dn[sn]=We[sn],dn[sn+Va]=We[sn+Va],dn[sn+ka]=We[sn+ka],dn[sn+Ha]=We[sn+Ha],dn[sn+za]=We[sn+za],O=uy(It,dn,w),$n&&q(0)),i?(C=i._initted,Gf(1),i.render(i.duration(),!0,!0),tt=T(A.a)-X+ft+Ae,it=Math.abs(ft-tt)>1,F&&it&&O.splice(O.length-2,2),i.render(0,!0,!0),C||i.invalidate(!0),i.parent||i.totalTime(i.totalTime()),Gf(0)):tt=ft,K&&(K.value?K.style["overflow"+A.a.toUpperCase()]=K.value:K.style.removeProperty("overflow-"+A.a));else if(f&&q()&&!E)for(an=f.parentNode;an&&an!==Se;)an._pinOffset&&(Nt-=an._pinOffset,et-=an._pinOffset),an=an.parentNode;H&&H.forEach(function(Rt){return Rt.revert(!1,!0)}),D.start=Nt,D.end=et,xt=Ot=$n?St:q(),!E&&!$n&&(xt<St&&q(St),D.scroll.rec=0),D.revert(!1,!0),st=Ln(),V&&(Bt=-1,V.restart(!0)),Dn=0,i&&R&&(i._initted||rt)&&i.progress()!==rt&&i.progress(rt||0,!0).render(i.time(),!0,!0),(fn||bt!==D.progress||E||_||i&&!i._initted)&&(i&&!R&&(i._initted||bt||i.vars.immediateRender!==!1)&&i.totalProgress(E&&Nt<-.001&&!bt?Vt.utils.normalize(Nt,et,0):bt,!0),D.progress=fn||(xt-Nt)/ft===bt?0:bt),d&&p&&(Ft._pinOffset=Math.round(D.progress*tt)),_t&&_t.invalidate(),isNaN(Z)||(Z-=Vt.getProperty(U,A.p),J-=Vt.getProperty(mt,A.p),Pc(U,A,Z),Pc(ot,A,Z-(ne||0)),Pc(mt,A,J),Pc(ct,A,J-(ne||0))),fn&&!$n&&D.update(),h&&!$n&&!Y&&(Y=!0,h(D),Y=!1)}},D.getVelocity=function(){return(q()-Ot)/(Ln()-Da)*1e3||0},D.endAnimation=function(){Ia(D.callbackAnimation),i&&(_t?_t.progress(1):i.paused()?R||Ia(i,D.direction<0,1):Ia(i,i.reversed()))},D.labelToScroll=function(ut){return i&&i.labels&&(Nt||D.refresh()||Nt)+i.labels[ut]/i.duration()*ft||0},D.getTrailing=function(ut){var $t=le.indexOf(D),Wt=D.direction>0?le.slice(0,$t).reverse():le.slice($t+1);return(gi(ut)?Wt.filter(function(ne){return ne.vars.preventOverlaps===ut}):Wt).filter(function(ne){return D.direction>0?ne.end<=Nt:ne.start>=et})},D.update=function(ut,$t,Wt){if(!(E&&!Wt&&!ut)){var ne=$n===!0?St:D.scroll(),tn=ut?0:(ne-Nt)/ft,he=tn<0?0:tn>1?1:tn||0,Le=D.progress,fn,Ne,Ae,me,zn,Ie,En,Vn;if($t&&(Ot=xt,xt=E?q():ne,x&&(wt=Et,Et=i&&!R?i.totalProgress():he)),g&&d&&!Dn&&!bc&&Di&&(!he&&Nt<ne+(ne-Ot)/(Ln()-Da)*g?he=1e-4:he===1&&et>ne+(ne-Ot)/(Ln()-Da)*g&&(he=.9999)),he!==Le&&D.enabled){if(fn=D.isActive=!!he&&he<1,Ne=!!Le&&Le<1,Ie=fn!==Ne,zn=Ie||!!he!=!!Le,D.direction=he>Le?1:-1,D.progress=he,zn&&!Dn&&(Ae=he&&!Le?0:he===1?1:Le===1?2:3,R&&(me=!Ie&&B[Ae+1]!=="none"&&B[Ae+1]||B[Ae],Vn=i&&(me==="complete"||me==="reset"||me in i))),b&&(Ie||Vn)&&(Vn||u||!i)&&(Nn(b)?b(D):D.getTrailing(b).forEach(function(er){return er.endAnimation()})),R||(_t&&!Dn&&!bc?(_t._dp._time-_t._start!==_t._time&&_t.render(_t._dp._time-_t._start),_t.resetTo?_t.resetTo("totalProgress",he,i._tTime/i._tDur):(_t.vars.totalProgress=he,_t.invalidate().restart())):i&&i.totalProgress(he,!!(Dn&&(st||ut)))),d){if(ut&&p&&(Ft.style[p+A.os2]=gt),!F)G(Na(X+tt*he));else if(zn){if(En=!ut&&he>Le&&et+1>ne&&ne+1>=lr(P,A),w)if(!ut&&(fn||En)){var en=Tr(d,!0),We=ne-Nt;g0(d,Se,en.top+(A===rn?We:0)+cn,en.left+(A===rn?0:We)+cn)}else g0(d,Ft);Mo(fn||En?O:jt),it&&he<1&&fn||G(X+(he===1&&!En?tt:0))}}x&&!j.tween&&!Dn&&!bc&&V.restart(!0),a&&(Ie||S&&he&&(he<1||!Wf))&&Wa(a.targets).forEach(function(er){return er.classList[fn||S?"add":"remove"](a.className)}),o&&!R&&!ut&&o(D),zn&&!Dn?(R&&(Vn&&(me==="complete"?i.pause().totalProgress(1):me==="reset"?i.restart(!0).pause():me==="restart"?i.restart(!0):i[me]()),o&&o(D)),(Ie||!Wf)&&(c&&Ie&&go(D,c),k[Ae]&&go(D,k[Ae]),S&&(he===1?D.kill(!1,1):k[Ae]=0),Ie||(Ae=he===1?1:3,k[Ae]&&go(D,k[Ae]))),y&&!fn&&Math.abs(D.getVelocity())>(Fa(y)?y:2500)&&(Ia(D.callbackAnimation),_t?_t.progress(1):Ia(i,me==="reverse"?1:!he,1))):R&&o&&!Dn&&o(D)}if(Mt){var an=E?ne/E.duration()*(E._caScrollDist||0):ne;nt(an+(U._isFlipped?1:0)),Mt(an)}At&&At(-ne/E.duration()*(E._caScrollDist||0))}},D.enable=function(ut,$t){D.enabled||(D.enabled=!0,gn(P,"resize",Oa),L||gn(P,"scroll",xo),Q&&gn(r,"refreshInit",Q),ut!==!1&&(D.progress=bt=0,xt=Ot=Bt=q()),$t!==!1&&D.refresh())},D.getTween=function(ut){return ut&&j?j.tween:_t},D.setPositions=function(ut,$t,Wt,ne){if(E){var tn=E.scrollTrigger,he=E.duration(),Le=tn.end-tn.start;ut=tn.start+Le*ut/he,$t=tn.start+Le*$t/he}D.refresh(!1,!1,{start:a0(ut,Wt&&!!D._startClamp),end:a0($t,Wt&&!!D._endClamp)},ne),D.update()},D.adjustPinSpacing=function(ut){if(ht&&ut){var $t=ht.indexOf(A.d)+1;ht[$t]=parseFloat(ht[$t])+ut+cn,ht[1]=parseFloat(ht[1])+ut+cn,Mo(ht)}},D.disable=function(ut,$t){if(ut!==!1&&D.revert(!0,!0),D.enabled&&(D.enabled=D.isActive=!1,$t||_t&&_t.pause(),St=0,dt&&(dt.uncache=1),Q&&mn(r,"refreshInit",Q),V&&(V.pause(),j.tween&&j.tween.kill()&&(j.tween=0)),!L)){for(var Wt=le.length;Wt--;)if(le[Wt].scroller===P&&le[Wt]!==D)return;mn(P,"resize",Oa),L||mn(P,"scroll",xo)}},D.kill=function(ut,$t){D.disable(ut,$t),_t&&!$t&&_t.kill(),l&&delete Qf[l];var Wt=le.indexOf(D);Wt>=0&&le.splice(Wt,1),Wt===Jn&&Nc>0&&Jn--,Wt=0,le.forEach(function(ne){return ne.scroller===D.scroller&&(Wt=1)}),Wt||$n||(D.scroll.rec=0),i&&(i.scrollTrigger=null,ut&&i.revert({kill:!1}),$t||i.kill()),ot&&[ot,ct,U,mt].forEach(function(ne){return ne.parentNode&&ne.parentNode.removeChild(ne)}),Ga===D&&(Ga=0),d&&(dt&&(dt.uncache=1),Wt=0,le.forEach(function(ne){return ne.pin===d&&Wt++}),Wt||(dt.spacer=0)),n.onKill&&n.onKill(D)},le.push(D),D.enable(!1,!1),Pt&&Pt(D),i&&i.add&&!ft){var Jt=D.update;D.update=function(){D.update=Jt,ae.cache++,Nt||et||D.refresh()},Vt.delayedCall(.01,D.update),ft=.01,Nt=et=0}else D.refresh();d&&ly()},r.register=function(n){return vo||(Vt=n||E0(),T0()&&window.document&&r.enable(),vo=La),vo},r.defaults=function(n){if(n)for(var i in n)Ac[i]=n[i];return Ac},r.disable=function(n,i){La=0,le.forEach(function(o){return o[i?"kill":"disable"](n)}),mn(ue,"wheel",xo),mn(we,"scroll",xo),clearInterval(Mc),mn(we,"touchcancel",ar),mn(Se,"touchstart",ar),Tc(mn,we,"pointerdown,touchstart,mousedown",l0),Tc(mn,we,"pointerup,touchend,mouseup",c0),Uc.kill(),wc(mn);for(var s=0;s<ae.length;s+=3)Ec(mn,ae[s],ae[s+1]),Ec(mn,ae[s],ae[s+2])},r.enable=function(){if(ue=window,we=document,_i=we.documentElement,Se=we.body,Vt){if(Wa=Vt.utils.toArray,Ua=Vt.utils.clamp,Kf=Vt.core.context||ar,Gf=Vt.core.suppressOverwrites||ar,id=ue.history.scrollRestoration||"auto",td=ue.pageYOffset||0,Vt.core.globals("ScrollTrigger",r),Se){La=1,So=document.createElement("div"),So.style.height="100vh",So.style.position="absolute",O0(),ey(),qe.register(Vt),r.isTouch=qe.isTouch,Kr=qe.isTouch&&/(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent),$f=qe.isTouch===1,gn(ue,"wheel",xo),nd=[ue,we,_i,Se],Vt.matchMedia?(r.matchMedia=function(h){var u=Vt.matchMedia(),f;for(f in h)u.add(f,h[f]);return u},Vt.addEventListener("matchMediaInit",function(){N0(),cd()}),Vt.addEventListener("matchMediaRevert",function(){return L0()}),Vt.addEventListener("matchMedia",function(){Rs(0,1),Fs("matchMedia")}),Vt.matchMedia().add("(orientation: portrait)",function(){return Yf(),Yf})):console.warn("Requires GSAP 3.11.0 or later"),Yf(),gn(we,"scroll",xo);var n=Se.hasAttribute("style"),i=Se.style,s=i.borderTopStyle,o=Vt.core.Animation.prototype,a,l;for(o.revert||Object.defineProperty(o,"revert",{value:function(){return this.time(-.01,!0)}}),i.borderTopStyle="solid",a=Tr(Se),rn.m=Math.round(a.top+rn.sc())||0,In.m=Math.round(a.left+In.sc())||0,s?i.borderTopStyle=s:i.removeProperty("border-top-style"),n||(Se.setAttribute("style",""),Se.removeAttribute("style")),Mc=setInterval(f0,250),Vt.delayedCall(.5,function(){return bc=0}),gn(we,"touchcancel",ar),gn(Se,"touchstart",ar),Tc(gn,we,"pointerdown,touchstart,mousedown",l0),Tc(gn,we,"pointerup,touchend,mouseup",c0),Jf=Vt.utils.checkPrefix("transform"),Fc.push(Jf),vo=Ln(),Uc=Vt.delayedCall(.2,Rs).pause(),yo=[we,"visibilitychange",function(){var h=ue.innerWidth,u=ue.innerHeight;we.hidden?(r0=h,s0=u):(r0!==h||s0!==u)&&Oa()},we,"DOMContentLoaded",Rs,ue,"load",Rs,ue,"resize",Oa],wc(gn),le.forEach(function(h){return h.enable(0,1)}),l=0;l<ae.length;l+=3)Ec(mn,ae[l],ae[l+1]),Ec(mn,ae[l],ae[l+2])}else if(we){var c=function h(){r.enable(),we.removeEventListener("DOMContentLoaded",h)};we.addEventListener("DOMContentLoaded",c)}}},r.config=function(n){"limitCallbacks"in n&&(Wf=!!n.limitCallbacks);var i=n.syncInterval;i&&clearInterval(Mc)||(Mc=i)&&setInterval(f0,i),"ignoreMobileResize"in n&&($f=r.isTouch===1&&n.ignoreMobileResize),"autoRefreshEvents"in n&&(wc(mn)||wc(gn,n.autoRefreshEvents||"none"),M0=(n.autoRefreshEvents+"").indexOf("resize")===-1)},r.scrollerProxy=function(n,i){var s=qn(n),o=ae.indexOf(s),a=Ls(s);~o&&ae.splice(o,a?6:2),i&&(a?Hi.unshift(ue,i,Se,i,_i,i):Hi.unshift(s,i))},r.clearMatchMedia=function(n){le.forEach(function(i){return i._ctx&&i._ctx.query===n&&i._ctx.kill(!0,!0)})},r.isInViewport=function(n,i,s){var o=(gi(n)?qn(n):n).getBoundingClientRect(),a=o[s?Ps:Is]*i||0;return s?o.right-a>0&&o.left+a<ue.innerWidth:o.bottom-a>0&&o.top+a<ue.innerHeight},r.positionInViewport=function(n,i,s){gi(n)&&(n=qn(n));var o=n.getBoundingClientRect(),a=o[s?Ps:Is],l=i==null?a/2:i in kc?kc[i]*a:~i.indexOf("%")?parseFloat(i)*a/100:parseFloat(i)||0;return s?(o.left+l)/ue.innerWidth:(o.top+l)/ue.innerHeight},r.killAll=function(n){if(le.slice(0).forEach(function(s){return s.vars.id!=="ScrollSmoother"&&s.kill()}),n!==!0){var i=Ns.killAll||[];Ns={},i.forEach(function(s){return s()})}},r})();re.version="3.15.0";re.saveStyles=function(r){return r?Wa(r).forEach(function(t){if(t&&t.style){var e=mi.indexOf(t);e>=0&&mi.splice(e,5),mi.push(t,t.style.cssText,t.getBBox&&t.getAttribute("transform"),Vt.core.getCache(t),Kf())}}):mi};re.revert=function(r,t){return cd(!r,t)};re.create=function(r,t){return new re(r,t)};re.refresh=function(r){return r?Oa(!0):(vo||re.register())&&Rs(!0)};re.update=function(r){return++ae.cache&&Er(r===!0?2:0)};re.clearScrollMemory=F0;re.maxScroll=function(r,t){return lr(r,t?In:rn)};re.getScrollFunc=function(r,t){return br(qn(r),t?In:rn)};re.getById=function(r){return Qf[r]};re.getAll=function(){return le.filter(function(r){return r.vars.id!=="ScrollSmoother"})};re.isScrolling=function(){return!!Di};re.snapDirectional=ld;re.addEventListener=function(r,t){var e=Ns[r]||(Ns[r]=[]);~e.indexOf(t)||e.push(t)};re.removeEventListener=function(r,t){var e=Ns[r],n=e&&e.indexOf(t);n>=0&&e.splice(n,1)};re.batch=function(r,t){var e=[],n={},i=t.interval||.016,s=t.batchMax||1e9,o=function(c,h){var u=[],f=[],d=Vt.delayedCall(i,function(){h(u,f),u=[],f=[]}).pause();return function(p){u.length||d.restart(!0),u.push(p.trigger),f.push(p),s<=u.length&&d.progress(1)}},a;for(a in t)n[a]=a.substr(0,2)==="on"&&Nn(t[a])&&a!=="onRefreshInit"?o(a,t[a]):t[a];return Nn(s)&&(s=s(),gn(re,"refresh",function(){return s=t.batchMax()})),Wa(r).forEach(function(l){var c={};for(a in n)c[a]=n[a];c.trigger=l,e.push(re.create(c))}),e};var x0=function(t,e,n,i){return e>i?t(i):e<0&&t(0),n>i?(i-e)/(n-e):n<0?e/(e-n):1},Zf=function r(t,e){e===!0?t.style.removeProperty("touch-action"):t.style.touchAction=e===!0?"auto":e?"pan-"+e+(qe.isTouch?" pinch-zoom":""):"none",t===_i&&r(Se,e)},Ic={auto:1,scroll:1},dy=function(t){var e=t.event,n=t.target,i=t.axis,s=(e.changedTouches?e.changedTouches[0]:e).target,o=s._gsap||Vt.core.getCache(s),a=Ln(),l;if(!o._isScrollT||a-o._isScrollT>2e3){for(;s&&s!==Se&&(s.scrollHeight<=s.clientHeight&&s.scrollWidth<=s.clientWidth||!(Ic[(l=Ii(s)).overflowY]||Ic[l.overflowX]));)s=s.parentNode;o._isScroll=s&&s!==n&&!Ls(s)&&(Ic[(l=Ii(s)).overflowY]||Ic[l.overflowX]),o._isScrollT=a}(o._isScroll||i==="x")&&(e.stopPropagation(),e._gsapAllow=!0)},B0=function(t,e,n,i){return qe.create({target:t,capture:!0,debounce:!1,lockAxis:!0,type:e,onWheel:i=i&&dy,onPress:i,onDrag:i,onScroll:i,onEnable:function(){return n&&gn(we,qe.eventTypes[0],y0,!1,!0)},onDisable:function(){return mn(we,qe.eventTypes[0],y0,!0)}})},py=/(input|label|select|textarea)/i,v0,y0=function(t){var e=py.test(t.target.tagName);(e||v0)&&(t._gsapAllow=!0,v0=e)},my=function(t){Cs(t)||(t={}),t.preventDefault=t.isNormalizer=t.allowClicks=!0,t.type||(t.type="wheel,touch"),t.debounce=!!t.debounce,t.id=t.id||"normalizer";var e=t,n=e.normalizeScrollX,i=e.momentum,s=e.allowNestedScroll,o=e.onRelease,a,l,c=qn(t.target)||_i,h=Vt.core.globals().ScrollSmoother,u=h&&h.get(),f=Kr&&(t.content&&qn(t.content)||u&&t.content!==!1&&!u.smooth()&&u.content()),d=br(c,rn),p=br(c,In),_=1,g=(qe.isTouch&&ue.visualViewport?ue.visualViewport.scale*ue.visualViewport.width:ue.outerWidth)/ue.innerWidth,m=0,v=Nn(i)?function(){return i(a)}:function(){return i||2.8},S,x,w=B0(c,t.type,!0,s),M=function(){return x=!1},E=ar,y=ar,b=function(){l=lr(c,rn),y=Ua(Kr?1:0,l),n&&(E=Ua(0,lr(c,In))),S=Ds},A=function(){f._gsap.y=Na(parseFloat(f._gsap.y)+d.offset)+"px",f.style.transform="matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, "+parseFloat(f._gsap.y)+", 0, 1)",d.offset=d.cacheID=0},R=function(){if(x){requestAnimationFrame(M);var $=Na(a.deltaY/2),W=y(d.v-$);if(f&&W!==d.v+d.offset){d.offset=W-d.v;var D=Na((parseFloat(f&&f._gsap.y)||0)-d.offset);f.style.transform="matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, "+D+", 0, 1)",f._gsap.y=D+"px",d.cacheID=ae.cache,Er()}return!0}d.offset&&A(),x=!0},P,N,L,F,k=function(){b(),P.isActive()&&P.vars.scrollY>l&&(d()>l?P.progress(1)&&d(l):P.resetTo("scrollY",l))};return f&&Vt.set(f,{y:"+=0"}),t.ignoreCheck=function(B){return Kr&&B.type==="touchmove"&&R(B)||_>1.05&&B.type!=="touchstart"||a.isGesturing||B.touches&&B.touches.length>1},t.onPress=function(){x=!1;var B=_;_=Na((ue.visualViewport&&ue.visualViewport.scale||1)/g),P.pause(),B!==_&&Zf(c,_>1.01?!0:n?!1:"x"),N=p(),L=d(),b(),S=Ds},t.onRelease=t.onGestureStart=function(B,$){if(d.offset&&A(),!$)F.restart(!0);else{ae.cache++;var W=v(),D,Q;n&&(D=p(),Q=D+W*.05*-B.velocityX/.227,W*=x0(p,D,Q,lr(c,In)),P.vars.scrollX=E(Q)),D=d(),Q=D+W*.05*-B.velocityY/.227,W*=x0(d,D,Q,lr(c,rn)),P.vars.scrollY=y(Q),P.invalidate().duration(W).play(.01),(Kr&&P.vars.scrollY>=l||D>=l-1)&&Vt.to({},{onUpdate:k,duration:W})}o&&o(B)},t.onWheel=function(){P._ts&&P.pause(),Ln()-m>1e3&&(S=0,m=Ln())},t.onChange=function(B,$,W,D,Q){if(Ds!==S&&b(),$&&n&&p(E(D[2]===$?N+(B.startX-B.x):p()+$-D[1])),W){d.offset&&A();var Ct=Q[2]===W,yt=Ct?L+B.startY-B.y:d()+W-Q[1],Bt=y(yt);Ct&&yt!==Bt&&(L+=Bt-yt),d(Bt)}(W||$)&&Er()},t.onEnable=function(){Zf(c,n?!1:"x"),re.addEventListener("refresh",k),gn(ue,"resize",k),d.smooth&&(d.target.style.scrollBehavior="auto",d.smooth=p.smooth=!1),w.enable()},t.onDisable=function(){Zf(c,!0),mn(ue,"resize",k),re.removeEventListener("refresh",k),w.kill()},t.lockAxis=t.lockAxis!==!1,a=new qe(t),a.iOS=Kr,Kr&&!d()&&d(1),Kr&&Vt.ticker.add(ar),F=a._dc,P=Vt.to(a,{ease:"power4",paused:!0,inherit:!1,scrollX:n?"+=0.1":"+=0",scrollY:"+=0.1",modifiers:{scrollY:U0(d,d(),function(){return P.pause()})},onUpdate:Er,onComplete:F.vars.onComplete}),a};re.sort=function(r){if(Nn(r))return le.sort(r);var t=ue.pageYOffset||0;return re.getAll().forEach(function(e){return e._sortY=e.trigger?t+e.trigger.getBoundingClientRect().top:e.start+ue.innerHeight}),le.sort(r||function(e,n){return(e.vars.refreshPriority||0)*-1e6+(e.vars.containerAnimation?1e6:e._sortY)-((n.vars.containerAnimation?1e6:n._sortY)+(n.vars.refreshPriority||0)*-1e6)})};re.observe=function(r){return new qe(r)};re.normalizeScroll=function(r){if(typeof r>"u")return Zn;if(r===!0&&Zn)return Zn.enable();if(r===!1){Zn&&Zn.kill(),Zn=r;return}var t=r instanceof qe?r:my(r);return Zn&&Zn.target===t.target&&Zn.kill(),Ls(t.target)&&(Zn=t),t};re.core={_getVelocityProp:Sc,_inputObserver:B0,_scrollers:ae,_proxies:Hi,bridge:{ss:function(){Di||Fs("scrollStart"),Di=Ln()},ref:function(){return Dn}}};E0()&&Vt.registerPlugin(re);var k0="1.3.27";function H0(r,t,e){return Math.max(r,Math.min(t,e))}function gy(r,t,e){return(1-e)*r+e*t}function _y(r,t,e,n){return gy(r,t,1-Math.exp(-e*n))}function xy(r,t){return(r%t+t)%t}var vy=class{isRunning=!1;value=0;from=0;to=0;currentTime=0;lerp;duration;easing;onUpdate;advance(r){if(!this.isRunning)return;let t=!1;if(this.duration&&this.easing){this.currentTime+=r;let e=H0(0,this.currentTime/this.duration,1);t=e>=1;let n=t?1:this.easing(e);this.value=this.from+(this.to-this.from)*n}else this.lerp?(this.value=_y(this.value,this.to,this.lerp*60,r),Math.round(this.value)===Math.round(this.to)&&(this.value=this.to,t=!0)):(this.value=this.to,t=!0);t&&this.stop(),this.onUpdate?.(this.value,t)}stop(){this.isRunning=!1}fromTo(r,t,{lerp:e,duration:n,easing:i,onStart:s,onUpdate:o}){this.from=this.value=r,this.to=t,this.lerp=e,this.duration=n,this.easing=i,this.currentTime=0,this.isRunning=!0,s?.(),this.onUpdate=o}};function yy(r,t){let e;return function(...n){clearTimeout(e),e=setTimeout(()=>{e=void 0,r.apply(this,n)},t)}}var Sy=class{width=0;height=0;scrollHeight=0;scrollWidth=0;debouncedResize;wrapperResizeObserver;contentResizeObserver;constructor(r,t,{autoResize:e=!0,debounce:n=250}={}){this.wrapper=r,this.content=t,e&&(this.debouncedResize=yy(this.resize,n),this.wrapper instanceof Window?window.addEventListener("resize",this.debouncedResize):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener("resize",this.debouncedResize)}resize=()=>{this.onWrapperResize(),this.onContentResize()};onWrapperResize=()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)};onContentResize=()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)};get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},G0=class{events={};emit(r,...t){let e=this.events[r]||[];for(let n=0,i=e.length;n<i;n++)e[n]?.(...t)}on(r,t){return this.events[r]?this.events[r].push(t):this.events[r]=[t],()=>{this.events[r]=this.events[r]?.filter(e=>t!==e)}}off(r,t){this.events[r]=this.events[r]?.filter(e=>t!==e)}destroy(){this.events={}}},My=100/6,jr={passive:!1};function z0(r,t){return r===1?My:r===2?t:1}var by=class{touchStart={x:0,y:0};lastDelta={x:0,y:0};window={width:0,height:0};emitter=new G0;constructor(r,t={wheelMultiplier:1,touchMultiplier:1}){this.element=r,this.options=t,window.addEventListener("resize",this.onWindowResize),this.onWindowResize(),this.element.addEventListener("wheel",this.onWheel,jr),this.element.addEventListener("touchstart",this.onTouchStart,jr),this.element.addEventListener("touchmove",this.onTouchMove,jr),this.element.addEventListener("touchend",this.onTouchEnd,jr)}on(r,t){return this.emitter.on(r,t)}destroy(){this.emitter.destroy(),window.removeEventListener("resize",this.onWindowResize),this.element.removeEventListener("wheel",this.onWheel,jr),this.element.removeEventListener("touchstart",this.onTouchStart,jr),this.element.removeEventListener("touchmove",this.onTouchMove,jr),this.element.removeEventListener("touchend",this.onTouchEnd,jr)}onTouchStart=r=>{let{clientX:t,clientY:e}=r.targetTouches?r.targetTouches[0]:r;this.touchStart.x=t,this.touchStart.y=e,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:r})};onTouchMove=r=>{let{clientX:t,clientY:e}=r.targetTouches?r.targetTouches[0]:r,n=-(t-this.touchStart.x)*this.options.touchMultiplier,i=-(e-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=t,this.touchStart.y=e,this.lastDelta={x:n,y:i},this.emitter.emit("scroll",{deltaX:n,deltaY:i,event:r})};onTouchEnd=r=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:r})};onWheel=r=>{let{deltaX:t,deltaY:e,deltaMode:n}=r,i=z0(n,this.window.width),s=z0(n,this.window.height);t*=i,e*=s,t*=this.options.wheelMultiplier,e*=this.options.wheelMultiplier,this.emitter.emit("scroll",{deltaX:t,deltaY:e,event:r})};onWindowResize=()=>{this.window={width:window.innerWidth,height:window.innerHeight}}},V0=r=>Math.min(1,1.001-2**(-10*r)),W0=class{_isScrolling=!1;_isStopped=!1;_isLocked=!1;_preventNextNativeScrollEvent=!1;_resetVelocityTimeout=null;_rafId=null;_isDraggingSelection=!1;reducedMotionMediaQuery=window.matchMedia("(prefers-reduced-motion: reduce)");isTouching;isIos;time=0;userData={};lastVelocity=0;velocity=0;direction=0;options;targetScroll;animatedScroll;animate=new vy;emitter=new G0;dimensions;virtualScroll;constructor({wrapper:r=window,content:t=document.documentElement,eventsTarget:e=r,smoothWheel:n=!0,syncTouch:i=!1,syncTouchLerp:s=.075,touchInertiaExponent:o=1.7,duration:a,easing:l,lerp:c=.1,infinite:h=!1,orientation:u="vertical",gestureOrientation:f=u==="horizontal"?"both":"vertical",touchMultiplier:d=1,wheelMultiplier:p=1,autoResize:_=!0,prevent:g,virtualScroll:m,overscroll:v=!0,autoRaf:S=!1,anchors:x=!1,autoToggle:w=!1,allowNestedScroll:M=!1,__experimental__naiveDimensions:E=!1,naiveDimensions:y=E,stopInertiaOnNavigate:b=!1,respectReducedMotion:A=!0}={}){window.lenisVersion=k0,window.lenis||(window.lenis={}),window.lenis.version=k0,u==="horizontal"&&(window.lenis.horizontal=!0),i===!0&&(window.lenis.touch=!0),this.isIos=/(iPad|iPhone|iPod)/g.test(navigator.userAgent),(!r||r===document.documentElement)&&(r=window),typeof a=="number"&&typeof l!="function"?l=V0:typeof l=="function"&&typeof a!="number"&&(a=1),this.options={wrapper:r,content:t,eventsTarget:e,smoothWheel:n,syncTouch:i,syncTouchLerp:s,touchInertiaExponent:o,duration:a,easing:l,lerp:c,infinite:h,gestureOrientation:f,orientation:u,touchMultiplier:d,wheelMultiplier:p,autoResize:_,prevent:g,virtualScroll:m,overscroll:v,autoRaf:S,anchors:x,autoToggle:w,allowNestedScroll:M,naiveDimensions:y,stopInertiaOnNavigate:b,respectReducedMotion:A},this.dimensions=new Sy(r,t,{autoResize:_}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll),this.options.wrapper.addEventListener("scrollend",this.onScrollEnd,{capture:!0}),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.addEventListener("click",this.onClick),this.options.wrapper.addEventListener("pointerdown",this.onPointerDown),this.virtualScroll=new by(e,{touchMultiplier:d,wheelMultiplier:p}),this.virtualScroll.on("scroll",this.onVirtualScroll),this.options.autoToggle&&(this.checkOverflow(),this.rootElement.addEventListener("transitionend",this.onTransitionEnd)),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))}destroy(){this.emitter.destroy(),this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll),this.options.wrapper.removeEventListener("scrollend",this.onScrollEnd,{capture:!0}),this.options.wrapper.removeEventListener("pointerdown",this.onPointerDown),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.removeEventListener("click",this.onClick),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName(),this._rafId&&cancelAnimationFrame(this._rafId)}on(r,t){return this.emitter.on(r,t)}off(r,t){return this.emitter.off(r,t)}onScrollEnd=r=>{r instanceof CustomEvent||(this.isScrolling==="smooth"||this.isScrolling===!1)&&r.stopPropagation()};dispatchScrollendEvent=()=>{this.options.wrapper.dispatchEvent(new CustomEvent("scrollend",{bubbles:this.options.wrapper===window,detail:{lenisScrollEnd:!0}}))};get overflow(){let r=this.isHorizontal?"overflow-x":"overflow-y";return getComputedStyle(this.rootElement)[r]}checkOverflow(){["hidden","clip"].includes(this.overflow)?this.internalStop():this.internalStart()}onTransitionEnd=r=>{r.propertyName?.includes("overflow")&&r.target===this.rootElement&&this.checkOverflow()};setScroll(r){this.isHorizontal?this.options.wrapper.scrollTo({left:r,behavior:"instant"}):this.options.wrapper.scrollTo({top:r,behavior:"instant"})}onClick=r=>{let t=r.composedPath().filter(n=>n instanceof HTMLAnchorElement&&n.href).map(n=>new URL(n.href)),e=new URL(window.location.href);if(this.options.anchors){let n=t.find(i=>e.host===i.host&&e.pathname===i.pathname&&i.hash);if(n){let i=typeof this.options.anchors=="object"&&this.options.anchors?this.options.anchors:void 0,s=decodeURIComponent(n.hash);this.scrollTo(s,i);return}}if(this.options.stopInertiaOnNavigate&&t.some(n=>e.host===n.host&&e.pathname!==n.pathname)){this.reset();return}};onPointerDown=r=>{r.button===1&&this.reset()};isTouchOnSelectionHandle(r){let t=window.getSelection();if(!t||t.isCollapsed||t.rangeCount===0)return!1;let e=r.targetTouches[0]??r.changedTouches[0];if(!e)return!1;let n=t.getRangeAt(0).getClientRects();if(n.length===0)return!1;let i=n[0],s=n[n.length-1],o=40,a=Math.hypot(e.clientX-i.left,e.clientY-i.top)<=o,l=Math.hypot(e.clientX-s.right,e.clientY-s.bottom)<=o;return a||l}onVirtualScroll=r=>{if(typeof this.options.virtualScroll=="function"&&this.options.virtualScroll(r)===!1)return;let{deltaX:t,deltaY:e,event:n}=r;if(this.emitter.emit("virtual-scroll",{deltaX:t,deltaY:e,event:n}),n.ctrlKey||n.lenisStopPropagation)return;let i=n.type.includes("touch"),s=n.type.includes("wheel");if(i&&this.isIos&&(n.type==="touchstart"&&(this._isDraggingSelection=this.isTouchOnSelectionHandle(n)),this._isDraggingSelection)){n.type==="touchend"&&(this._isDraggingSelection=!1);return}this.isTouching=n.type==="touchstart"||n.type==="touchmove";let o=t===0&&e===0;if(this.options.syncTouch&&i&&n.type==="touchstart"&&o&&!this.isStopped&&!this.isLocked){this.reset();return}let a=this.options.gestureOrientation==="vertical"&&e===0||this.options.gestureOrientation==="horizontal"&&t===0;if(o||a)return;let l=n.composedPath();l=l.slice(0,l.indexOf(this.rootElement));let c=this.options.prevent,h=Math.abs(t)>=Math.abs(e)?"horizontal":"vertical";if(l.find(p=>p instanceof HTMLElement&&(typeof c=="function"&&c?.(p)||p.hasAttribute?.("data-lenis-prevent")||h==="vertical"&&p.hasAttribute?.("data-lenis-prevent-vertical")||h==="horizontal"&&p.hasAttribute?.("data-lenis-prevent-horizontal")||i&&p.hasAttribute?.("data-lenis-prevent-touch")||s&&p.hasAttribute?.("data-lenis-prevent-wheel")||this.options.allowNestedScroll&&this.hasNestedScroll(p,{deltaX:t,deltaY:e}))))return;if(this.isStopped||this.isLocked){n.cancelable&&n.preventDefault();return}if(!(this.options.syncTouch&&i||this.options.smoothWheel&&s)){this.isScrolling="native",this.animate.stop(),n.lenisStopPropagation=!0;return}let u=e;this.options.gestureOrientation==="both"?u=Math.abs(e)>Math.abs(t)?e:t:this.options.gestureOrientation==="horizontal"&&(u=t),(!this.options.overscroll||this.options.infinite||this.options.wrapper!==window&&this.limit>0&&(this.animatedScroll>0&&this.animatedScroll<this.limit||this.animatedScroll===0&&e>0||this.animatedScroll===this.limit&&e<0))&&(n.lenisStopPropagation=!0),n.cancelable&&n.preventDefault();let f=i&&this.options.syncTouch,d=i&&n.type==="touchend";d&&(u=Math.sign(u)*Math.abs(this.velocity)**this.options.touchInertiaExponent),this.scrollTo(this.targetScroll+u,{programmatic:!1,...f?{lerp:d?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}})};resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit("scroll",this)}onNativeScroll=()=>{if(this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent){this._preventNextNativeScrollEvent=!1;return}if(this.isScrolling===!1||this.isScrolling==="native"){let r=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-r,this.direction=Math.sign(this.animatedScroll-r),this.isStopped||(this.isScrolling="native"),this.emit(),this.velocity!==0&&(this._resetVelocityTimeout=setTimeout(()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()},400))}};reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){if(this.isStopped){if(this.options.autoToggle){this.rootElement.style.removeProperty("overflow");return}this.internalStart()}}internalStart(){this.isStopped&&(this.reset(),this.isStopped=!1,this.emit())}stop(){if(!this.isStopped){if(this.options.autoToggle){this.rootElement.style.setProperty("overflow","clip");return}this.internalStop()}}internalStop(){this.isStopped||(this.reset(),this.isStopped=!0,this.emit())}raf=r=>{let t=r-(this.time||r);this.time=r,this.animate.advance(t*.001),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))};scrollTo(r,{offset:t=0,immediate:e=!1,lock:n=!1,programmatic:i=!0,lerp:s=i?this.options.lerp:void 0,duration:o=i?this.options.duration:void 0,easing:a=i?this.options.easing:void 0,onStart:l,onComplete:c,force:h=!1,userData:u}={}){if(this.prefersReducedMotion&&(i?e=!0:(s=1,o=void 0,a=void 0)),(this.isStopped||this.isLocked)&&!h)return;let f=r,d=t;if(typeof f=="string"&&["top","left","start","#"].includes(f))f=0;else if(typeof f=="string"&&["bottom","right","end"].includes(f))f=this.limit;else{let p=null;if(typeof f=="string"?(p=f.startsWith("#")?document.getElementById(f.slice(1)):document.querySelector(f),p||(f==="#top"?f=0:console.warn("Lenis: Target not found",f))):f instanceof Element&&(p=f),p){if(this.options.wrapper!==window){let x=this.rootElement.getBoundingClientRect();d-=this.isHorizontal?x.left:x.top}let _=p.getBoundingClientRect(),g=getComputedStyle(p),m=this.isHorizontal?Number.parseFloat(g.scrollMarginLeft):Number.parseFloat(g.scrollMarginTop),v=getComputedStyle(this.rootElement),S=this.isHorizontal?Number.parseFloat(v.scrollPaddingLeft):Number.parseFloat(v.scrollPaddingTop);f=(this.isHorizontal?_.left:_.top)+this.animatedScroll-(Number.isNaN(m)?0:m)-(Number.isNaN(S)?0:S)}}if(typeof f=="number"){if(f+=d,this.options.infinite){if(i){this.targetScroll=this.animatedScroll=this.scroll;let p=f-this.animatedScroll;p>this.limit/2?f-=this.limit:p<-this.limit/2&&(f+=this.limit)}}else f=H0(0,f,this.limit);if(f===this.targetScroll){l?.(this),c?.(this);return}if(this.userData=u??{},e){this.animatedScroll=this.targetScroll=f,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),c?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()});return}i||(this.targetScroll=f),typeof o=="number"&&typeof a!="function"?a=V0:typeof a=="function"&&typeof o!="number"&&(o=1),this.animate.fromTo(this.animatedScroll,f,{duration:o,easing:a,lerp:s,onStart:()=>{n&&(this.isLocked=!0),this.isScrolling="smooth",l?.(this)},onUpdate:(p,_)=>{this.isScrolling="smooth",this.lastVelocity=this.velocity,this.velocity=p-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=p,this.setScroll(this.scroll),i&&(this.targetScroll=p),_||this.emit(),_&&(this.reset(),this.emit(),c?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()}),this.preventNextNativeScrollEvent())}})}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame(()=>{this._preventNextNativeScrollEvent=!1})}hasNestedScroll(r,{deltaX:t,deltaY:e}){let n=Date.now();r._lenis||(r._lenis={});let i=r._lenis,s,o,a,l,c,h,u,f,d,p;if(n-(i.time??0)>2e3){i.time=Date.now();let M=window.getComputedStyle(r);if(i.computedStyle=M,s=["auto","overlay","scroll"].includes(M.overflowX),o=["auto","overlay","scroll"].includes(M.overflowY),c=["auto"].includes(M.overscrollBehaviorX),h=["auto"].includes(M.overscrollBehaviorY),i.hasOverflowX=s,i.hasOverflowY=o,!(s||o))return!1;u=r.scrollWidth,f=r.scrollHeight,d=r.clientWidth,p=r.clientHeight,a=u>d,l=f>p,i.isScrollableX=a,i.isScrollableY=l,i.scrollWidth=u,i.scrollHeight=f,i.clientWidth=d,i.clientHeight=p,i.hasOverscrollBehaviorX=c,i.hasOverscrollBehaviorY=h}else a=i.isScrollableX,l=i.isScrollableY,s=i.hasOverflowX,o=i.hasOverflowY,u=i.scrollWidth,f=i.scrollHeight,d=i.clientWidth,p=i.clientHeight,c=i.hasOverscrollBehaviorX,h=i.hasOverscrollBehaviorY;if(!(s&&a||o&&l))return!1;let _=Math.abs(t)>=Math.abs(e)?"horizontal":"vertical",g,m,v,S,x,w;if(_==="horizontal")g=Math.round(r.scrollLeft),m=u-d,v=t,S=s,x=a,w=c;else if(_==="vertical")g=Math.round(r.scrollTop),m=f-p,v=e,S=o,x=l,w=h;else return!1;return!w&&(g>=m||g<=0)?!0:(v>0?g<m:g>0)&&S&&x}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return this.options.orientation==="horizontal"}get actualScroll(){let r=this.options.wrapper;return this.isHorizontal?r.scrollX??r.scrollLeft:r.scrollY??r.scrollTop}get scroll(){return this.options.infinite?xy(this.animatedScroll,this.limit):this.animatedScroll}get progress(){return this.limit===0?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(r){this._isScrolling!==r&&(this._isScrolling=r,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(r){this._isStopped!==r&&(this._isStopped=r,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(r){this._isLocked!==r&&(this._isLocked=r,this.updateClassName())}get isSmooth(){return this.isScrolling==="smooth"}get prefersReducedMotion(){return this.options.respectReducedMotion&&this.reducedMotionMediaQuery.matches}get className(){let r="lenis";return this.options.autoToggle&&(r+=" lenis-autoToggle"),this.isStopped&&(r+=" lenis-stopped"),this.isLocked&&(r+=" lenis-locked"),this.isScrolling&&(r+=" lenis-scrolling"),this.isScrolling==="smooth"&&(r+=" lenis-smooth"),r}updateClassName(){this.cleanUpClassName(),this.className.split(" ").forEach(r=>{this.rootElement.classList.add(r)})}cleanUpClassName(){for(let r of Array.from(this.rootElement.classList))(r==="lenis"||r.startsWith("lenis-"))&&this.rootElement.classList.remove(r)}};var Tt={silk:"#EFE6D2",silkShade:"#DCCFB5",ivory:"#F6F1E6",ai:"#18234A",aiDeep:"#0F1631",loom:"#120F17",atlas:"#D1145A",saffron:"#F2B11B",emerald:"#0A7F55",shu:"#E2421F",kiri:"#B98A57"},X0=r=>{let t=parseInt(r.slice(1),16);return[(t>>16&255)/255,(t>>8&255)/255,(t&255)/255]},Ar={ground:"#000000",kasuri:"#808080",abr:"#ffffff"};var xi='"Dela Gothic One"',Vc=document.createElement("canvas").getContext("2d");function Ya(r,t,e=xi){return Vc.font=`${t}px ${e}`,Vc.measureText(r).width}function Mn(r,t="H",e=xi){return Vc.font=`${r}px ${e}`,Vc.measureText(t).actualBoundingBoxAscent}var ai=(r,t,e=9999)=>Math.min(e,Math.floor(100*t/Ya(r,100))),hd=[{g:Tt.ai,ink:Tt.ivory,name:"MOBIL ILOVALAR",note:"D4"},{g:Tt.atlas,ink:Tt.ivory,name:"VEB-SAYTLAR"},{g:Tt.saffron,ink:Tt.ai,name:"TELEGRAM BOTLAR"},{g:Tt.emerald,ink:Tt.ivory,name:"BACKEND"},{g:Tt.silk,ink:Tt.atlas,name:"DESKTOP"},{g:Tt.ai,ink:Tt.saffron,name:"IoT"},{g:Tt.atlas,ink:Tt.ivory,name:"AI"}],Gi=["hero","kasuri","abr","dandori","jidoka","snap","horenso","quramiz","stripes4","stripes7","time","shot","contact","phone","footer"],Hc=Gi.length;function Gc(r,t,e,n=!1){let i={W:r,H:t,phone:e,flow:n},s=Math.round(t*(e?.88:.87));i.F=s,i.PH=s,i.m=e?16:48;let o=i.m;i.hdr=e?56:64;let a=e?80:Math.max(120,Math.min(200,Math.round(r/7.2)));i.pitch=r/a,i.threads=a;let l=i.pitch,c=b=>Math.round(b/l)*l,h=e?Math.min(r/390,t/844):Math.min(r/1440,t/900),u=b=>b*h,f=b=>Math.round(b*s/(e?743:783));i.k=h,i.S=e?560:640;let d=e?84:96;i.sh=d;let p=[["hero",s,"silk"],["abr",s,"ai"],...n?[["dan",s,"ai"]]:[],["jid",s,"aiDeep"],...n?[["hor",s,"aiDeep"]]:[],["q",s,"silk"],["stripes",d*7,"silk"],["time",s,"silk"],["con",s,"silk"],["ph",s,"silk"],["foot",s,"ai"],...n?[]:[["tail",Math.round(t*.9),"silk"]]];i.panels={};let _=0;for(let[b,A,R]of p)i.panels[b]={id:b,y0:_,h:A,ground:R},_+=A;i.stripH=_;let g=i.panels,m={},v=(b,A,R)=>m[b]={y0:g[A].y0,h:R??g[A].h,items:{}},S=(b,A,R)=>m[b].items[A]=R;i.dom=m;let x={};i.woven=x;let w=(b,A)=>(x[b]=x[b]||[]).push(A);if(v("hero","hero"),e){let b=r-o-74,A=["YAPON","IT","AGENSTVASI","ENDI"],R=A.map(yt=>ai(yt,b,150)),P=R.map(yt=>Mn(yt)),N=f(84),L=Math.round(s-296*h),F=L-34,k=P.reduce((yt,Bt)=>yt+Bt,0),B=Math.max(12,Math.min(34,(F-N-k)/3)),$=N;A.forEach((yt,Bt)=>{let st=Math.round($+P[Bt]);w("hero",{text:yt,x:o,base:st,size:R[Bt],color:Tt.ai}),$=st+B});let W=N,D=Math.round(F-W),Q=Math.floor(ai("O\u02BBZBEKISTONDA!",D)),Ct=Mn(Q);w("hero",{vertical:!0,text:"O\u02BBZBEKISTONDA!",xBase:r-o+2-Ct,yTop:W,size:Q,len:D,abr:!0}),S("hero","hero-sub",{x:o,y:L,w:r-2*o,size:26*h}),S("hero","hero-cta",{x:o,y:L+Math.round(84*h),w:r-2*o}),S("hero","hero-svc",{x:o,y:L+Math.round(156*h),w:r-2*o,wrap:!0}),S("hero","hero-tate",{x:o,y:s-26}),i.heroCue={x:r-o,y:s+Math.round((t-s)/2)}}else{let b=u(112),A=u(106),R=f(116),P=Mn(b);["YAPON IT","AGENSTVASI","ENDI","O\u02BBZBEKISTONDA!"].forEach((L,F)=>w("hero",{text:L,x:o,base:Math.round(R+F*A+P),size:b,color:Tt.ai,abr:F===3}));let N=R+3*A+P;S("hero","hero-sub",{x:o,y:Math.round(N+u(46)),w:u(800),size:u(40)}),S("hero","hero-svc",{x:o,y:Math.round(N+u(112))}),S("hero","hero-cta",{x:o,y:Math.round(N+u(146))}),S("hero","hero-tate",{x:r-o-u(22),y:f(120)}),i.heroCue={x:r-o,y:s+Math.round((t-s)/2)}}v("abr","abr");{let b=c(r*(e?.5:.48));if(i.abr={split:b,pullLen:s+60},e){let A=ai("\u7D63",b-2*o),R=Mn(A,"\u7D63"),P=f(108);w("abr",{text:"\u7D63",x:o-4,base:Math.round(P+R),size:A,color:Tt.ivory});let N=Math.round(P+R+26),L=f(560)-N,F=ai("KASURI",L),k=Mn(F);w("abr",{vertical:!0,text:"KASURI",xBase:Math.round(b/2-k/2),yTop:N,size:F,len:L,color:Tt.ivory});let B=f(104),$=f(398),W=ai("ABR",$),D=Mn(W),Q=b+(r-b)/2;w("abr",{vertical:!0,text:"ABR",xBase:Math.round(Q-D/2),yTop:B,size:W,len:$,abr:!0}),i.abr.eq=[b-22,Math.round(P+R/2-14),44,10,Math.round(P+R/2+4)],S("abr","abr-l1",{x:o,y:f(590),w:b-2*o,wrap:!0}),S("abr","abr-l2",{x:b+o,y:f(524),w:r-b-2*o,wrap:!0}),S("abr","abr-h2",{x:b+o,y:f(566),w:r-b-2*o,size:23*h})}else{let A=u(372),R=Mn(A,"\u7D63"),P=f(132);w("abr",{text:"\u7D63",x:u(64),base:Math.round(P+R),size:A,color:Tt.ivory});let N=ai("ABR",r*.43),L=Mn(N),F=f(236);w("abr",{text:"ABR",x:b+u(64),base:Math.round(F+L),size:N,color:Tt.ai,abr:!0});let k=F+L/2;i.abr.eq=[b-u(40),Math.round(k-u(26)),u(80),u(17),Math.round(k+u(9))],S("abr","abr-l1",{x:u(72),y:f(604)}),S("abr","abr-l2",{x:b+u(64),y:f(604)}),S("abr","abr-h2",{x:b+u(64),y:f(640),w:Math.min(u(600),r-b-u(64)-o),size:u(40)}),i.abr.ground=[[0,b,Tt.ai],[b,r,Tt.silk]]}}v("dandori",n?"dan":"abr"),e?(S("dandori","dan-l",{x:o,y:f(86)}),S("dandori","dan-h2",{x:o,y:f(112),w:r-2*o-20,size:36*h}),S("dandori","dan-p",{x:o,y:f(278),w:r-2*o-30}),i.danSafe=[0,f(70),r,f(330)]):(S("dandori","dan-l",{x:o,y:f(122)}),S("dandori","dan-h2",{x:o,y:f(152),w:u(620),size:u(72)}),S("dandori","dan-p",{x:o,y:f(400),w:u(440)}),i.danSafe=[0,f(96),u(720),f(470)]),v("jidoka","jid"),v("horenso",n?"hor":"jid");{let b=Math.round((e?.72:.62)*a);i.jid={sigX:(b+.5)*l,brk:f(e?300:378),andon:e?{x:r-o-22,y:f(168),w:40,h:110}:{x:r-u(150),y:f(200),w:64,h:180},safe:e?[0,f(440),r,f(320)]:[0,f(380),u(780),f(330)],grid:e?84:120,mot:e?26:36};let A=e?{l:[o,f(470)],h:[o,f(494),r-2*o-30,36*h],p:[o,f(612),r-2*o-40]}:{l:[o,f(404)],h:[o,f(432),u(700),u(72)],p:[o,f(600),u(540)]};for(let[R,P]of[["jidoka","jid"],["horenso","hor"]])S(R,P+"-l",{x:A.l[0],y:A.l[1]}),S(R,P+"-h2",{x:A.h[0],y:A.h[1],w:A.h[2],size:A.h[3]}),S(R,P+"-p",{x:A.p[0],y:A.p[1],w:A.p[2]})}m.xizmatlar={y0:g.q.y0,h:g.q.h+g.stripes.h,items:{}};{let b=e?ai("QURAMIZ",r-2*o,120):ai("QURAMIZ",r-2*o),A=Mn(b),R=f(e?414:456);w("q",{text:"QURAMIZ",x:o-(e?2:4),base:Math.round(R+A),size:b,color:Tt.ai}),S("xizmatlar","svc-l",{x:o,y:R-(e?30:40)});let P=Math.round(i.hdr+(s-7*d-i.hdr)/2-8);m.xizmatlar.items["svc-hint"]={x:o,y:P+7*d,w:r-2*o,wrap:e},i.stripes=hd.map((N,L)=>{let F=g.stripes.y0+L*d,k=e?Math.min(44,ai(N.name,r-2*o-40)):u(64),B=Mn(k),$=Math.round(e?F-g.stripes.y0+16+B:F-g.stripes.y0+(d+B)/2);return w("stripes",{text:N.name,x:o,base:$,size:k,color:N.ink}),{y0:F-g.q.y0,sy:L*d,base:$,...N}}),i.stripeDesc=N=>e?{x:o,y:i.stripes[N].y0+d-26}:{x:Math.round(r*.62),y:i.stripes[N].y0+d/2-8},i.stripeKnot=N=>({x:r-(e?24:56)-15,y:i.stripes[N].y0+d/2-15})}v("vaqt","time");{let b=e?{h2:[o,f(76),r-2*o,32*h],x0:o,x1:r-o,tk:[f(236),f(292)],ts:[f(310),f(366)],lt:f(196),ls:f(398),nt:f(216),ns:f(374),p:[o,f(452),r-2*o],c:[o,f(560)],every:6}:{h2:[o,f(134),u(1100),u(56)],x0:u(272),x1:r-o,tk:[f(296),f(360)],ts:[f(384),f(448)],nt:f(272),ns:f(458),p:[o,f(530),u(1100)],c:[o,f(616)],every:3};b.hw=(b.x1-b.x0)/24,i.time=b,S("vaqt","time-h2",{x:b.h2[0],y:b.h2[1],w:b.h2[2],size:b.h2[3]}),e?(S("vaqt","row-tk",{x:o,y:b.lt}),S("vaqt","row-ts",{x:o,y:b.ls})):(S("vaqt","row-tk",{x:o,y:Math.round((b.tk[0]+b.tk[1])/2-8)}),S("vaqt","row-ts",{x:o,y:Math.round((b.ts[0]+b.ts[1])/2-8)})),S("vaqt","nums-tk",{x:0,y:b.nt,w:r}),S("vaqt","nums-ts",{x:0,y:b.ns,w:r}),S("vaqt","time-p",{x:b.p[0],y:b.p[1],w:b.p[2],size:e?26*h:u(40)}),S("vaqt","clocks",{x:b.c[0],y:b.c[1]}),S("vaqt","needle",{x:0,y:b.tk[0]-10,h:b.ts[1]-b.tk[0]+20}),S("vaqt","now-l",{x:0,y:b.ts[1]+(e?32:30)}),i.time.shot=[b.x0+9*b.hw,b.tk[0],b.x0+14*b.hw,b.ts[1]]}if(v("aloqa","con"),e){let b=f(150);["NAQSHNI","BIRGA","CHIZAMIZ."].forEach((A,R)=>{let P=ai(A,r-2*o,110),N=Mn(P),L=Math.round(b+N);w("con",{text:A,x:o-2,base:L,size:P,color:Tt.ai,abr:R===2}),b=L+14}),S("aloqa","con-p",{x:o,y:Math.round(b+28),w:r-2*o-20,size:26*h}),S("aloqa","con-tate",{x:o,y:s-28})}else{let b=Math.min(u(104),ai("CHIZAMIZ.",r*.56)),A=Mn(b),R=f(124),P=Math.round(b*1);["NAQSHNI","BIRGA","CHIZAMIZ."].forEach((N,L)=>w("con",{text:N,x:o,base:Math.round(R+L*P+A),size:b,color:Tt.ai,abr:L===2})),S("aloqa","con-p",{x:Math.round(r*.6),y:Math.round(R+P-6),w:Math.round(r*.4-o-u(70)),size:u(40)}),S("aloqa","con-tate",{x:r-o-u(22),y:f(124)})}if(v("raqam","ph"),e){let b="+998 97",A="270 70 07",R=ai(A,r-2*o,96),P=Mn(R),N=f(104),L=Math.round(N+P),F=Math.round(L+R*.98);w("ph",{text:b,x:o-2,base:L,size:R,color:Tt.ai}),w("ph",{text:A,x:o-2,base:F,size:R,color:Tt.ai}),S("raqam","phone",{x:o-2,y:N-10,w:r-2*o,h:F-N+20,size:R*.3,wrapPhone:!0}),S("raqam","email",{x:o,y:F+44}),S("raqam","ctags",{x:o,y:F+108,w:r-2*o,stack:!0}),S("raqam","city",{x:o,y:F+248}),S("raqam","picks",{x:o,y:F+270,w:r-2*o-90,wrap:!0}),S("raqam","hanko",{x:r-o-78,y:F+230})}else{let b="+998 97 270 70 07",A=Math.min(u(112),ai(b,r-2*o-u(190))),R=Mn(A),P=f(150);w("ph",{text:b,x:o-3,base:Math.round(P+R),size:A,color:Tt.ai}),S("raqam","phone",{x:o-3,y:P-12,w:Ya(b,A)+6,h:R+24,size:A}),S("raqam","email",{x:o,y:Math.round(P+R+u(76))}),S("raqam","ctags",{x:o,y:Math.round(P+R+u(156))}),S("raqam","city",{x:o,y:Math.round(P+R+u(252))}),S("raqam","picks",{x:o,y:Math.round(P+R+u(278))}),S("raqam","hanko",{x:r-o-u(150),y:Math.round(P+R+u(70))})}m.footer={y0:g.foot.y0,h:g.foot.h,items:{}};{let b=e?30:44;i.foot={band:b};let A=e?ai("QILICH",r-2*o):u(236),R=Mn(A),P=f(e?92:122);w("foot",{text:"QILICH",x:o-4,base:Math.round(P+R),size:A,color:Tt.ivory});let N=m.footer.items;if(e){let L=P+R+34;N.mei={x:o,y:Math.round(L)},N.fnav={x:o,y:Math.round(L+84)},N.fcon={x:o,y:Math.round(L+130)},N.frow={x:o,y:Math.round(L+220)},N.fcopy={x:o,y:s-b-66},N.fgal={x:o,y:s-b-42}}else{let L=P+R+u(86);N.mei={x:r-o-u(290),y:P+6},N.fnav={x:o,y:Math.round(L)},N.fcon={x:o,y:Math.round(L+u(52))},N.frow={x:Math.round(r*.6),y:Math.round(L+u(52))},N.fcopy={x:o,y:s-b-u(56)},N.fgal={x:Math.round(r*.6),y:s-b-u(56)}}}let M=g.q.y0;i.clothY={hero:0,kasuri:g.abr.y0,abr:g.abr.y0,dandori:g.abr.y0,jidoka:g.jid.y0,snap:g.jid.y0,horenso:g.jid.y0,quramiz:M,stripes4:M+4*d,stripes7:M+7*d,time:g.time.y0,shot:g.time.y0,contact:g.con.y0,phone:g.ph.y0,footer:g.foot.y0};let E="dark",y="light";return i.tone={hero:[y,y],kasuri:[E,E],abr:[E,y],dandori:[E,E],jidoka:[E,E],snap:[E,E],horenso:[E,E],quramiz:[y,y],stripes4:[y,y],stripes7:[y,y],time:[y,y],shot:[y,y],contact:[y,y],phone:[y,y],footer:[E,E]},e&&(i.tone.abr=[E,E]),i}var Mg=0,Yd=1,bg=2;var Ul=1,wg=2,ia=3,us=0,Tn=1,ki=2,pr=0,ra=1,Bl=2,qd=3,Zd=4,Tg=5;var Xs=100,Eg=101,Ag=102,Cg=103,Rg=104,Pg=200,Ig=201,Dg=202,Lg=203,Jd=204,$d=205,Ng=206,Fg=207,Og=208,Ug=209,Bg=210,kg=211,zg=212,Vg=213,Hg=214,gh=0,_h=1,xh=2,Ho=3,vh=4,yh=5,Sh=6,Mh=7,Kd=0,Gg=1,Wg=2,$i=0,jd=1,Qd=2,tp=3,ep=4,np=5,ip=6,kl=7;var rp=300,fs=301,Ys=302,jh=303,Qh=304,zl=306,rs=1e3,Ni=1001,bh=1002,xn=1003,Xg=1004;var Vl=1005;var Je=1006,tu=1007;var ds=1008;var Bn=1009,sp=1010,op=1011,sa=1012,eu=1013,Ki=1014,ji=1015,Qi=1016,nu=1017,iu=1018,oa=1020,ap=35902,lp=35899,cp=1021,hp=1022,zi=1023,ur=1026,ps=1027,Hl=1028,ru=1029,ms=1030,su=1031;var ou=1033,Gl=33776,Wl=33777,Xl=33778,Yl=33779,au=35840,lu=35841,cu=35842,hu=35843,uu=36196,fu=37492,du=37496,pu=37488,mu=37489,ql=37490,gu=37491,_u=37808,xu=37809,vu=37810,yu=37811,Su=37812,Mu=37813,bu=37814,wu=37815,Tu=37816,Eu=37817,Au=37818,Cu=37819,Ru=37820,Pu=37821,Iu=36492,Du=36494,Lu=36495,Nu=36283,Fu=36284,Zl=36285,Ou=36286;var sl=2300,wh=2301,ph=2302,Od=2303,Ud=2400,Bd=2401,kd=2402;var Yg=3200;var Uu=0,qg=1,tr="",Ze="srgb",ol="srgb-linear",al="linear",Me="srgb";var mh=7680;var Zg=519,Jg=512,$g=513,Kg=514,Bu=515,jg=516,Qg=517,ku=518,t_=519,up=35044;var fp="300 es",Zi=2e3,Go=2001;function wy(r){for(let t=r.length-1;t>=0;--t)if(r[t]>=65535)return!0;return!1}function Ty(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}function ll(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function e_(){let r=ll("canvas");return r.style.display="block",r}var Y0={},Wo=null;function cl(...r){let t="THREE."+r.shift();Wo?Wo("log",t,...r):console.log(t,...r)}function n_(r){let t=r[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=r[1];e&&e.isStackTrace?r[0]+=" "+e.getLocation():r[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return r}function Qt(...r){r=n_(r);let t="THREE."+r.shift();if(Wo)Wo("warn",t,...r);else{let e=r[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...r)}}function te(...r){r=n_(r);let t="THREE."+r.shift();if(Wo)Wo("error",t,...r);else{let e=r[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...r)}}function Vs(...r){let t=r.join(" ");t in Y0||(Y0[t]=!0,Qt(...r))}function i_(r,t,e){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(t,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}var r_={[gh]:_h,[xh]:Sh,[vh]:Mh,[Ho]:yh,[_h]:gh,[Sh]:xh,[Mh]:vh,[yh]:Ho},fr=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let i=n[t];if(i!==void 0){let s=i.indexOf(e);s!==-1&&i.splice(s,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let i=n.slice(0);for(let s=0,o=i.length;s<o;s++)i[s].call(this,t);t.target=null}}},Fn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],q0=1234567,el=Math.PI/180,Xo=180/Math.PI;function hr(){let r=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Fn[r&255]+Fn[r>>8&255]+Fn[r>>16&255]+Fn[r>>24&255]+"-"+Fn[t&255]+Fn[t>>8&255]+"-"+Fn[t>>16&15|64]+Fn[t>>24&255]+"-"+Fn[e&63|128]+Fn[e>>8&255]+"-"+Fn[e>>16&255]+Fn[e>>24&255]+Fn[n&255]+Fn[n>>8&255]+Fn[n>>16&255]+Fn[n>>24&255]).toLowerCase()}function ce(r,t,e){return Math.max(t,Math.min(e,r))}function dp(r,t){return(r%t+t)%t}function Ey(r,t,e,n,i){return n+(r-t)*(i-n)/(e-t)}function Ay(r,t,e){return r!==t?(e-r)/(t-r):0}function nl(r,t,e){return(1-e)*r+e*t}function Cy(r,t,e,n){return nl(r,t,1-Math.exp(-e*n))}function Ry(r,t=1){return t-Math.abs(dp(r,t*2)-t)}function Py(r,t,e){return r<=t?0:r>=e?1:(r=(r-t)/(e-t),r*r*(3-2*r))}function Iy(r,t,e){return r<=t?0:r>=e?1:(r=(r-t)/(e-t),r*r*r*(r*(r*6-15)+10))}function Dy(r,t){return r+Math.floor(Math.random()*(t-r+1))}function Ly(r,t){return r+Math.random()*(t-r)}function Ny(r){return r*(.5-Math.random())}function Fy(r){r!==void 0&&(q0=r);let t=q0+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Oy(r){return r*el}function Uy(r){return r*Xo}function By(r){return r>0&&Number.isInteger(r)&&2**Math.round(Math.log2(r))===r}function ky(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function zy(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function Vy(r,t,e,n,i){let s=Math.cos,o=Math.sin,a=s(e/2),l=o(e/2),c=s((t+n)/2),h=o((t+n)/2),u=s((t-n)/2),f=o((t-n)/2),d=s((n-t)/2),p=o((n-t)/2);switch(i){case"XYX":r.set(a*h,l*u,l*f,a*c);break;case"YZY":r.set(l*f,a*h,l*u,a*c);break;case"ZXZ":r.set(l*u,l*f,a*h,a*c);break;case"XZX":r.set(a*h,l*p,l*d,a*c);break;case"YXY":r.set(l*d,a*h,l*p,a*c);break;case"ZYZ":r.set(l*p,l*d,a*h,a*c);break;default:Qt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function qi(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:case Uint8ClampedArray:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Te(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var pp={DEG2RAD:el,RAD2DEG:Xo,generateUUID:hr,clamp:ce,euclideanModulo:dp,mapLinear:Ey,inverseLerp:Ay,lerp:nl,damp:Cy,pingpong:Ry,smoothstep:Py,smootherstep:Iy,randInt:Dy,randFloat:Ly,randFloatSpread:Ny,seededRandom:Fy,degToRad:Oy,radToDeg:Uy,isPowerOfTwo:By,ceilPowerOfTwo:ky,floorPowerOfTwo:zy,setQuaternionFromProperEuler:Vy,normalize:Te,denormalize:qi},vt=class r{static{r.prototype.isVector2=!0}constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ce(this.x,t.x,e.x),this.y=ce(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ce(this.x,t,e),this.y=ce(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ce(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ce(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),i=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*n-o*i+t.x,this.y=s*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},dr=class{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,s,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3],f=s[o+0],d=s[o+1],p=s[o+2],_=s[o+3];if(u!==_||l!==f||c!==d||h!==p){let g=l*f+c*d+h*p+u*_;g<0&&(f=-f,d=-d,p=-p,_=-_,g=-g);let m=1-a;if(g<.9995){let v=Math.acos(g),S=Math.sin(v);m=Math.sin(m*v)/S,a=Math.sin(a*v)/S,l=l*m+f*a,c=c*m+d*a,h=h*m+p*a,u=u*m+_*a}else{l=l*m+f*a,c=c*m+d*a,h=h*m+p*a,u=u*m+_*a;let v=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=v,c*=v,h*=v,u*=v}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,s,o){let a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=s[o],f=s[o+1],d=s[o+2],p=s[o+3];return t[e]=a*p+h*u+l*d-c*f,t[e+1]=l*p+h*f+c*u-a*d,t[e+2]=c*p+h*d+a*f-l*u,t[e+3]=h*p-a*u-l*f-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,i=t._y,s=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),u=a(s/2),f=l(n/2),d=l(i/2),p=l(s/2);switch(o){case"XYZ":this._x=f*h*u+c*d*p,this._y=c*d*u-f*h*p,this._z=c*h*p+f*d*u,this._w=c*h*u-f*d*p;break;case"YXZ":this._x=f*h*u+c*d*p,this._y=c*d*u-f*h*p,this._z=c*h*p-f*d*u,this._w=c*h*u+f*d*p;break;case"ZXY":this._x=f*h*u-c*d*p,this._y=c*d*u+f*h*p,this._z=c*h*p+f*d*u,this._w=c*h*u-f*d*p;break;case"ZYX":this._x=f*h*u-c*d*p,this._y=c*d*u+f*h*p,this._z=c*h*p-f*d*u,this._w=c*h*u+f*d*p;break;case"YZX":this._x=f*h*u+c*d*p,this._y=c*d*u+f*h*p,this._z=c*h*p-f*d*u,this._w=c*h*u-f*d*p;break;case"XZY":this._x=f*h*u-c*d*p,this._y=c*d*u-f*h*p,this._z=c*h*p+f*d*u,this._w=c*h*u+f*d*p;break;default:Qt("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],i=e[4],s=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],f=n+a+u;if(f>0){let d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-l)*d,this._y=(s-c)*d,this._z=(o-i)*d}else if(n>a&&n>u){let d=2*Math.sqrt(1+n-a-u);this._w=(h-l)/d,this._x=.25*d,this._y=(i+o)/d,this._z=(s+c)/d}else if(a>u){let d=2*Math.sqrt(1+a-n-u);this._w=(s-c)/d,this._x=(i+o)/d,this._y=.25*d,this._z=(l+h)/d}else{let d=2*Math.sqrt(1+u-n-a);this._w=(o-i)/d,this._x=(s+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ce(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,i=t._y,s=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+i*c-s*l,this._y=i*h+o*l+s*a-n*c,this._z=s*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-s*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,i=t._y,s=t._z,o=t._w,a=this.dot(t);a<0&&(n=-n,i=-i,s=-s,o=-o,a=-a);let l=1-e;if(a<.9995){let c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+s*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+s*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},z=class r{static{r.prototype.isVector3=!0}constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Z0.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Z0.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*i,this.y=s[1]*e+s[4]*n+s[7]*i,this.z=s[2]*e+s[5]*n+s[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,s=t.elements,o=1/(s[3]*e+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*i+s[12])*o,this.y=(s[1]*e+s[5]*n+s[9]*i+s[13])*o,this.z=(s[2]*e+s[6]*n+s[10]*i+s[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,i=this.z,s=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*i-a*n),h=2*(a*e-s*i),u=2*(s*n-o*e);return this.x=e+l*c+o*u-a*h,this.y=n+l*h+a*c-s*u,this.z=i+l*u+s*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*i,this.y=s[1]*e+s[5]*n+s[9]*i,this.z=s[2]*e+s[6]*n+s[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ce(this.x,t.x,e.x),this.y=ce(this.y,t.y,e.y),this.z=ce(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ce(this.x,t,e),this.y=ce(this.y,t,e),this.z=ce(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ce(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,i=t.y,s=t.z,o=e.x,a=e.y,l=e.z;return this.x=i*l-s*a,this.y=s*o-n*l,this.z=n*a-i*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ud.copy(this).projectOnVector(t),this.sub(ud)}reflect(t){return this.sub(ud.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ce(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ud=new z,Z0=new dr,ie=class r{static{r.prototype.isMatrix3=!0}constructor(t,e,n,i,s,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,s,o,a,l,c)}set(t,e,n,i,s,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=s,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,s=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],d=n[5],p=n[8],_=i[0],g=i[3],m=i[6],v=i[1],S=i[4],x=i[7],w=i[2],M=i[5],E=i[8];return s[0]=o*_+a*v+l*w,s[3]=o*g+a*S+l*M,s[6]=o*m+a*x+l*E,s[1]=c*_+h*v+u*w,s[4]=c*g+h*S+u*M,s[7]=c*m+h*x+u*E,s[2]=f*_+d*v+p*w,s[5]=f*g+d*S+p*M,s[8]=f*m+d*x+p*E,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*s*h+n*a*l+i*s*c-i*o*l}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,f=a*l-h*s,d=c*s-o*l,p=e*u+n*f+i*d;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/p;return t[0]=u*_,t[1]=(i*c-h*n)*_,t[2]=(a*n-i*o)*_,t[3]=f*_,t[4]=(h*e-i*l)*_,t[5]=(i*s-a*e)*_,t[6]=d*_,t[7]=(n*l-c*e)*_,t[8]=(o*e-n*s)*_,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,s,o,a){let l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-i*c,i*l,-i*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return Vs("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(fd.makeScale(t,e)),this}rotate(t){return Vs("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(fd.makeRotation(-t)),this}translate(t,e){return Vs("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(fd.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},fd=new ie,J0=new ie().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),$0=new ie().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Hy(){let r={enabled:!0,workingColorSpace:ol,spaces:{},convert:function(i,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===Me&&(i.r=Nr(i.r),i.g=Nr(i.g),i.b=Nr(i.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Me&&(i.r=Vo(i.r),i.g=Vo(i.g),i.b=Vo(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===tr?al:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,o){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,s){return Vs("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(i,s)},toWorkingColorSpace:function(i,s){return Vs("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(i,s)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return r.define({[ol]:{primaries:t,whitePoint:n,transfer:al,toXYZ:J0,fromXYZ:$0,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Ze},outputColorSpaceConfig:{drawingBufferColorSpace:Ze}},[Ze]:{primaries:t,whitePoint:n,transfer:Me,toXYZ:J0,fromXYZ:$0,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Ze}}}),r}var pe=Hy();function Nr(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Vo(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}var wo,Th=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{wo===void 0&&(wo=ll("canvas")),wo.width=t.width,wo.height=t.height;let i=wo.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=wo}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=ll("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let i=n.getImageData(0,0,t.width,t.height),s=i.data;for(let o=0;o<s.length;o++)s[o]=Nr(s[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Nr(e[n]/255)*255):e[n]=Nr(e[n]);return{data:e,width:t.width,height:t.height}}else return Qt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Gy=0,Yo=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Gy++}),this.uuid=hr(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?s.push(dd(i[o].image)):s.push(dd(i[o]))}else s=dd(i);n.url=s}return e||(t.images[this.uuid]=n),n}};function dd(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?Th.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(Qt("Texture: Unable to serialize Texture."),{})}var Wy=0,pd=new z,Qn=class r extends fr{constructor(t=r.DEFAULT_IMAGE,e=r.DEFAULT_MAPPING,n=Ni,i=Ni,s=Je,o=ds,a=zi,l=Bn,c=r.DEFAULT_ANISOTROPY,h=tr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wy++}),this.uuid=hr(),this.name="",this.source=new Yo(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new vt(0,0),this.repeat=new vt(1,1),this.center=new vt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ie,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(pd).x}get height(){return this.source.getSize(pd).y}get depth(){return this.source.getSize(pd).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){Qt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){Qt(`Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==rp)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case rs:t.x=t.x-Math.floor(t.x);break;case Ni:t.x=t.x<0?0:1;break;case bh:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case rs:t.y=t.y-Math.floor(t.y);break;case Ni:t.y=t.y<0?0:1;break;case bh:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Qn.DEFAULT_IMAGE=null;Qn.DEFAULT_MAPPING=rp;Qn.DEFAULT_ANISOTROPY=1;var ve=class r{static{r.prototype.isVector4=!0}constructor(t=0,e=0,n=0,i=1){this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*s,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*s,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*s,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,s,l=t.elements,c=l[0],h=l[4],u=l[8],f=l[1],d=l[5],p=l[9],_=l[2],g=l[6],m=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-_)<.01&&Math.abs(p-g)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+_)<.1&&Math.abs(p+g)<.1&&Math.abs(c+d+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let S=(c+1)/2,x=(d+1)/2,w=(m+1)/2,M=(h+f)/4,E=(u+_)/4,y=(p+g)/4;return S>x&&S>w?S<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(S),i=M/n,s=E/n):x>w?x<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(x),n=M/i,s=y/i):w<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(w),n=E/s,i=y/s),this.set(n,i,s,e),this}let v=Math.sqrt((g-p)*(g-p)+(u-_)*(u-_)+(f-h)*(f-h));return Math.abs(v)<.001&&(v=1),this.x=(g-p)/v,this.y=(u-_)/v,this.z=(f-h)/v,this.w=Math.acos((c+d+m-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ce(this.x,t.x,e.x),this.y=ce(this.y,t.y,e.y),this.z=ce(this.z,t.z,e.z),this.w=ce(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ce(this.x,t,e),this.y=ce(this.y,t,e),this.z=ce(this.z,t,e),this.w=ce(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ce(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Eh=class extends fr{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Je,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new ve(0,0,t,e),this.scissorTest=!1,this.viewport=new ve(0,0,t,e),this.textures=[];let i={width:t,height:e,depth:n.depth},s=new Qn(i),o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:Je,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let i=Object.assign({},t.textures[e].image);this.textures[e].source=new Yo(i)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},ci=class extends Eh{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},hl=class extends Qn{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=xn,this.minFilter=xn,this.wrapR=Ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Ah=class extends Qn{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=xn,this.minFilter=xn,this.wrapR=Ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var Ue=class r{static{r.prototype.isMatrix4=!0}constructor(t,e,n,i,s,o,a,l,c,h,u,f,d,p,_,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,s,o,a,l,c,h,u,f,d,p,_,g)}set(t,e,n,i,s,o,a,l,c,h,u,f,d,p,_,g){let m=this.elements;return m[0]=t,m[4]=e,m[8]=n,m[12]=i,m[1]=s,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=h,m[10]=u,m[14]=f,m[3]=d,m[7]=p,m[11]=_,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new r().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,i=1/To.setFromMatrixColumn(t,0).length(),s=1/To.setFromMatrixColumn(t,1).length(),o=1/To.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,i=t.y,s=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){let f=o*h,d=o*u,p=a*h,_=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=d+p*c,e[5]=f-_*c,e[9]=-a*l,e[2]=_-f*c,e[6]=p+d*c,e[10]=o*l}else if(t.order==="YXZ"){let f=l*h,d=l*u,p=c*h,_=c*u;e[0]=f+_*a,e[4]=p*a-d,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=d*a-p,e[6]=_+f*a,e[10]=o*l}else if(t.order==="ZXY"){let f=l*h,d=l*u,p=c*h,_=c*u;e[0]=f-_*a,e[4]=-o*u,e[8]=p+d*a,e[1]=d+p*a,e[5]=o*h,e[9]=_-f*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let f=o*h,d=o*u,p=a*h,_=a*u;e[0]=l*h,e[4]=p*c-d,e[8]=f*c+_,e[1]=l*u,e[5]=_*c+f,e[9]=d*c-p,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let f=o*l,d=o*c,p=a*l,_=a*c;e[0]=l*h,e[4]=_-f*u,e[8]=p*u+d,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=d*u+p,e[10]=f-_*u}else if(t.order==="XZY"){let f=o*l,d=o*c,p=a*l,_=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=f*u+_,e[5]=o*h,e[9]=d*u-p,e[2]=p*u-d,e[6]=a*h,e[10]=_*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Xy,t,Yy)}lookAt(t,e,n){let i=this.elements;return vi.subVectors(t,e),vi.lengthSq()===0&&(vi.z=1),vi.normalize(),Qr.crossVectors(n,vi),Qr.lengthSq()===0&&(Math.abs(n.z)===1?vi.x+=1e-4:vi.z+=1e-4,vi.normalize(),Qr.crossVectors(n,vi)),Qr.normalize(),Wc.crossVectors(vi,Qr),i[0]=Qr.x,i[4]=Wc.x,i[8]=vi.x,i[1]=Qr.y,i[5]=Wc.y,i[9]=vi.y,i[2]=Qr.z,i[6]=Wc.z,i[10]=vi.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,s=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],d=n[13],p=n[2],_=n[6],g=n[10],m=n[14],v=n[3],S=n[7],x=n[11],w=n[15],M=i[0],E=i[4],y=i[8],b=i[12],A=i[1],R=i[5],P=i[9],N=i[13],L=i[2],F=i[6],k=i[10],B=i[14],$=i[3],W=i[7],D=i[11],Q=i[15];return s[0]=o*M+a*A+l*L+c*$,s[4]=o*E+a*R+l*F+c*W,s[8]=o*y+a*P+l*k+c*D,s[12]=o*b+a*N+l*B+c*Q,s[1]=h*M+u*A+f*L+d*$,s[5]=h*E+u*R+f*F+d*W,s[9]=h*y+u*P+f*k+d*D,s[13]=h*b+u*N+f*B+d*Q,s[2]=p*M+_*A+g*L+m*$,s[6]=p*E+_*R+g*F+m*W,s[10]=p*y+_*P+g*k+m*D,s[14]=p*b+_*N+g*B+m*Q,s[3]=v*M+S*A+x*L+w*$,s[7]=v*E+S*R+x*F+w*W,s[11]=v*y+S*P+x*k+w*D,s[15]=v*b+S*N+x*B+w*Q,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],i=t[8],s=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],f=t[10],d=t[14],p=t[3],_=t[7],g=t[11],m=t[15],v=l*d-c*f,S=a*d-c*u,x=a*f-l*u,w=o*d-c*h,M=o*f-l*h,E=o*u-a*h;return e*(_*v-g*S+m*x)-n*(p*v-g*w+m*M)+i*(p*S-_*w+m*E)-s*(p*x-_*M+g*E)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],i=t[8],s=t[1],o=t[5],a=t[9],l=t[2],c=t[6],h=t[10];return e*(o*h-a*c)-n*(s*h-a*l)+i*(s*c-o*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],f=t[10],d=t[11],p=t[12],_=t[13],g=t[14],m=t[15],v=e*a-n*o,S=e*l-i*o,x=e*c-s*o,w=n*l-i*a,M=n*c-s*a,E=i*c-s*l,y=h*_-u*p,b=h*g-f*p,A=h*m-d*p,R=u*g-f*_,P=u*m-d*_,N=f*m-d*g,L=v*N-S*P+x*R+w*A-M*b+E*y;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let F=1/L;return t[0]=(a*N-l*P+c*R)*F,t[1]=(i*P-n*N-s*R)*F,t[2]=(_*E-g*M+m*w)*F,t[3]=(f*M-u*E-d*w)*F,t[4]=(l*A-o*N-c*b)*F,t[5]=(e*N-i*A+s*b)*F,t[6]=(g*x-p*E-m*S)*F,t[7]=(h*E-f*x+d*S)*F,t[8]=(o*P-a*A+c*y)*F,t[9]=(n*A-e*P-s*y)*F,t[10]=(p*M-_*x+m*v)*F,t[11]=(u*x-h*M-d*v)*F,t[12]=(a*b-o*R-l*y)*F,t[13]=(e*R-n*b+i*y)*F,t[14]=(_*S-p*w-g*v)*F,t[15]=(h*w-u*S+f*v)*F,this}scale(t){let e=this.elements,n=t.x,i=t.y,s=t.z;return e[0]*=n,e[4]*=i,e[8]*=s,e[1]*=n,e[5]*=i,e[9]*=s,e[2]*=n,e[6]*=i,e[10]*=s,e[3]*=n,e[7]*=i,e[11]*=s,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),i=Math.sin(e),s=1-n,o=t.x,a=t.y,l=t.z,c=s*o,h=s*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,s*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,s,o){return this.set(1,n,s,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){let i=this.elements,s=e._x,o=e._y,a=e._z,l=e._w,c=s+s,h=o+o,u=a+a,f=s*c,d=s*h,p=s*u,_=o*h,g=o*u,m=a*u,v=l*c,S=l*h,x=l*u,w=n.x,M=n.y,E=n.z;return i[0]=(1-(_+m))*w,i[1]=(d+x)*w,i[2]=(p-S)*w,i[3]=0,i[4]=(d-x)*M,i[5]=(1-(f+m))*M,i[6]=(g+v)*M,i[7]=0,i[8]=(p+S)*E,i[9]=(g-v)*E,i[10]=(1-(f+_))*E,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){let i=this.elements;t.x=i[12],t.y=i[13],t.z=i[14];let s=this.determinantAffine();if(s===0)return n.set(1,1,1),e.identity(),this;let o=To.set(i[0],i[1],i[2]).length(),a=To.set(i[4],i[5],i[6]).length(),l=To.set(i[8],i[9],i[10]).length();s<0&&(o=-o),Wi.copy(this);let c=1/o,h=1/a,u=1/l;return Wi.elements[0]*=c,Wi.elements[1]*=c,Wi.elements[2]*=c,Wi.elements[4]*=h,Wi.elements[5]*=h,Wi.elements[6]*=h,Wi.elements[8]*=u,Wi.elements[9]*=u,Wi.elements[10]*=u,e.setFromRotationMatrix(Wi),n.x=o,n.y=a,n.z=l,this}makePerspective(t,e,n,i,s,o,a=Zi,l=!1){let c=this.elements,h=2*s/(e-t),u=2*s/(n-i),f=(e+t)/(e-t),d=(n+i)/(n-i),p,_;if(l)p=s/(o-s),_=o*s/(o-s);else if(a===Zi)p=-(o+s)/(o-s),_=-2*o*s/(o-s);else if(a===Go)p=-o/(o-s),_=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,s,o,a=Zi,l=!1){let c=this.elements,h=2/(e-t),u=2/(n-i),f=-(e+t)/(e-t),d=-(n+i)/(n-i),p,_;if(l)p=1/(o-s),_=o/(o-s);else if(a===Zi)p=-2/(o-s),_=-(o+s)/(o-s);else if(a===Go)p=-1/(o-s),_=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=u,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},To=new z,Wi=new Ue,Xy=new z(0,0,0),Yy=new z(1,1,1),Qr=new z,Wc=new z,vi=new z,K0=new Ue,j0=new dr,Fr=class r{constructor(t=0,e=0,n=0,i=r.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let i=t.elements,s=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],u=i[2],f=i[6],d=i[10];switch(e){case"XYZ":this._y=Math.asin(ce(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ce(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(ce(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-ce(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ce(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-ce(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-h,d),this._y=0);break;default:Qt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return K0.makeRotationFromQuaternion(t),this.setFromRotationMatrix(K0,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return j0.setFromEuler(this),this.setFromQuaternion(j0,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Fr.DEFAULT_ORDER="XYZ";var ul=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},qy=0,Q0=new z,Eo=new dr,Cr=new Ue,Xc=new z,qa=new z,Zy=new z,Jy=new dr,tg=new z(1,0,0),eg=new z(0,1,0),ng=new z(0,0,1),ig={type:"added"},$y={type:"removed"},Ao={type:"childadded",child:null},md={type:"childremoved",child:null},bn=class r extends fr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:qy++}),this.uuid=hr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=r.DEFAULT_UP.clone();let t=new z,e=new Fr,n=new dr,i=new z(1,1,1);function s(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Ue},normalMatrix:{value:new ie}}),this.matrix=new Ue,this.matrixWorld=new Ue,this.matrixAutoUpdate=r.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=r.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ul,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Eo.setFromAxisAngle(t,e),this.quaternion.multiply(Eo),this}rotateOnWorldAxis(t,e){return Eo.setFromAxisAngle(t,e),this.quaternion.premultiply(Eo),this}rotateX(t){return this.rotateOnAxis(tg,t)}rotateY(t){return this.rotateOnAxis(eg,t)}rotateZ(t){return this.rotateOnAxis(ng,t)}translateOnAxis(t,e){return Q0.copy(t).applyQuaternion(this.quaternion),this.position.add(Q0.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(tg,t)}translateY(t){return this.translateOnAxis(eg,t)}translateZ(t){return this.translateOnAxis(ng,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Cr.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Xc.copy(t):Xc.set(t,e,n);let i=this.parent;this.updateWorldMatrix(!0,!1),qa.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Cr.lookAt(qa,Xc,this.up):Cr.lookAt(Xc,qa,this.up),this.quaternion.setFromRotationMatrix(Cr),i&&(Cr.extractRotation(i.matrixWorld),Eo.setFromRotationMatrix(Cr),this.quaternion.premultiply(Eo.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(te("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(ig),Ao.child=t,this.dispatchEvent(Ao),Ao.child=null):te("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent($y),md.child=t,this.dispatchEvent(md),md.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Cr.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Cr.multiply(t.parent.matrixWorld)),t.applyMatrix4(Cr),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(ig),Ao.child=t,this.dispatchEvent(Ao),Ao.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let i=this.children;for(let s=0,o=i.length;s<o;s++)i[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qa,t,Zy),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qa,Jy,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,i=t.z,s=this.matrix.elements;s[12]+=e-s[0]*e-s[4]*n-s[8]*i,s[13]+=n-s[1]*e-s[5]*n-s[9]*i,s[14]+=i-s[2]*e-s[6]*n-s[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let s=this.children;for(let o=0,a=s.length;o<a;o++)s[o].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];s(t.shapes,u)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(t.materials,this.material[l]));i.material=a}else i.material=s(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];i.animations.push(s(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),f=o(t.skeletons),d=o(t.animations),p=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),p.length>0&&(n.nodes=p)}return n.object=i,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let i=t.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};bn.DEFAULT_UP=new z(0,1,0);bn.DEFAULT_MATRIX_AUTO_UPDATE=!0;bn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var jn=class extends bn{constructor(){super(),this.isGroup=!0,this.type="Group"}},Ky={type:"move"},qo=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new jn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new jn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new jn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,s=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let _ of t.hand.values()){let g=e.getJointPose(_,n),m=this._getHandJoint(c,_);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,p=.005;c.inputState.pinching&&f>d+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=d-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Ky)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new jn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},s_={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ts={h:0,s:0,l:0},Yc={h:0,s:0,l:0};function gd(r,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?r+(t-r)*6*e:e<1/2?t:e<2/3?r+(t-r)*6*(2/3-e):r}var ee=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ze){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,pe.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=pe.workingColorSpace){return this.r=t,this.g=e,this.b=n,pe.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=pe.workingColorSpace){if(t=dp(t,1),e=ce(e,0,1),n=ce(n,0,1),e===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+e):n+e-n*e,o=2*n-s;this.r=gd(o,s,t+1/3),this.g=gd(o,s,t),this.b=gd(o,s,t-1/3)}return pe.colorSpaceToWorking(this,i),this}setStyle(t,e=Ze){function n(s){s!==void 0&&parseFloat(s)<1&&Qt("Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let s,o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:Qt("Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){let s=i[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);Qt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ze){let n=s_[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Qt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Nr(t.r),this.g=Nr(t.g),this.b=Nr(t.b),this}copyLinearToSRGB(t){return this.r=Vo(t.r),this.g=Vo(t.g),this.b=Vo(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ze){return pe.workingToColorSpace(On.copy(this),t),Math.round(ce(On.r*255,0,255))*65536+Math.round(ce(On.g*255,0,255))*256+Math.round(ce(On.b*255,0,255))}getHexString(t=Ze){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=pe.workingColorSpace){pe.workingToColorSpace(On.copy(this),e);let n=On.r,i=On.g,s=On.b,o=Math.max(n,i,s),a=Math.min(n,i,s),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(i-s)/u+(i<s?6:0);break;case i:l=(s-n)/u+2;break;case s:l=(n-i)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=pe.workingColorSpace){return pe.workingToColorSpace(On.copy(this),e),t.r=On.r,t.g=On.g,t.b=On.b,t}getStyle(t=Ze){pe.workingToColorSpace(On.copy(this),t);let e=On.r,n=On.g,i=On.b;return t!==Ze?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(ts),this.setHSL(ts.h+t,ts.s+e,ts.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ts),t.getHSL(Yc);let n=nl(ts.h,Yc.h,e),i=nl(ts.s,Yc.s,e),s=nl(ts.l,Yc.l,e);return this.setHSL(n,i,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,i=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*i,this.g=s[1]*e+s[4]*n+s[7]*i,this.b=s[2]*e+s[5]*n+s[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},On=new ee;ee.NAMES=s_;var Hs=class extends bn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Fr,this.environmentIntensity=1,this.environmentRotation=new Fr,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},Xi=new z,Rr=new z,_d=new z,Pr=new z,Co=new z,Ro=new z,rg=new z,xd=new z,vd=new z,yd=new z,Sd=new ve,Md=new ve,bd=new ve,Lr=class r{constructor(t=new z,e=new z,n=new z){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Xi.subVectors(t,e),i.cross(Xi);let s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(t,e,n,i,s){Xi.subVectors(i,e),Rr.subVectors(n,e),_d.subVectors(t,e);let o=Xi.dot(Xi),a=Xi.dot(Rr),l=Xi.dot(_d),c=Rr.dot(Rr),h=Rr.dot(_d),u=o*c-a*a;if(u===0)return s.set(0,0,0),null;let f=1/u,d=(c*l-a*h)*f,p=(o*h-a*l)*f;return s.set(1-d-p,p,d)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,Pr)===null?!1:Pr.x>=0&&Pr.y>=0&&Pr.x+Pr.y<=1}static getInterpolation(t,e,n,i,s,o,a,l){return this.getBarycoord(t,e,n,i,Pr)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Pr.x),l.addScaledVector(o,Pr.y),l.addScaledVector(a,Pr.z),l)}static getInterpolatedAttribute(t,e,n,i,s,o){return Sd.setScalar(0),Md.setScalar(0),bd.setScalar(0),Sd.fromBufferAttribute(t,e),Md.fromBufferAttribute(t,n),bd.fromBufferAttribute(t,i),o.setScalar(0),o.addScaledVector(Sd,s.x),o.addScaledVector(Md,s.y),o.addScaledVector(bd,s.z),o}static isFrontFacing(t,e,n,i){return Xi.subVectors(n,e),Rr.subVectors(t,e),Xi.cross(Rr).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Xi.subVectors(this.c,this.b),Rr.subVectors(this.a,this.b),Xi.cross(Rr).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return r.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return r.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,s){return r.getInterpolation(t,this.a,this.b,this.c,e,n,i,s)}containsPoint(t){return r.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return r.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,i=this.b,s=this.c,o,a;Co.subVectors(i,n),Ro.subVectors(s,n),xd.subVectors(t,n);let l=Co.dot(xd),c=Ro.dot(xd);if(l<=0&&c<=0)return e.copy(n);vd.subVectors(t,i);let h=Co.dot(vd),u=Ro.dot(vd);if(h>=0&&u<=h)return e.copy(i);let f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(Co,o);yd.subVectors(t,s);let d=Co.dot(yd),p=Ro.dot(yd);if(p>=0&&d<=p)return e.copy(s);let _=d*c-l*p;if(_<=0&&c>=0&&p<=0)return a=c/(c-p),e.copy(n).addScaledVector(Ro,a);let g=h*p-d*u;if(g<=0&&u-h>=0&&d-p>=0)return rg.subVectors(s,i),a=(u-h)/(u-h+(d-p)),e.copy(i).addScaledVector(rg,a);let m=1/(g+_+f);return o=_*m,a=f*m,e.copy(n).addScaledVector(Co,o).addScaledVector(Ro,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},ss=class{constructor(t=new z(1/0,1/0,1/0),e=new z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Yi.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Yi.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Yi.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Yi):Yi.fromBufferAttribute(s,o),Yi.applyMatrix4(t.matrixWorld),this.expandByPoint(Yi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),qc.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),qc.copy(n.boundingBox)),qc.applyMatrix4(t.matrixWorld),this.union(qc)}let i=t.children;for(let s=0,o=i.length;s<o;s++)this.expandByObject(i[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Yi),Yi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Za),Zc.subVectors(this.max,Za),Po.subVectors(t.a,Za),Io.subVectors(t.b,Za),Do.subVectors(t.c,Za),es.subVectors(Io,Po),ns.subVectors(Do,Io),Os.subVectors(Po,Do);let e=[0,-es.z,es.y,0,-ns.z,ns.y,0,-Os.z,Os.y,es.z,0,-es.x,ns.z,0,-ns.x,Os.z,0,-Os.x,-es.y,es.x,0,-ns.y,ns.x,0,-Os.y,Os.x,0];return!wd(e,Po,Io,Do,Zc)||(e=[1,0,0,0,1,0,0,0,1],!wd(e,Po,Io,Do,Zc))?!1:(Jc.crossVectors(es,ns),e=[Jc.x,Jc.y,Jc.z],wd(e,Po,Io,Do,Zc))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Yi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Yi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ir[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ir[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ir[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ir[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ir[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ir[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ir[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ir[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ir),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Ir=[new z,new z,new z,new z,new z,new z,new z,new z],Yi=new z,qc=new ss,Po=new z,Io=new z,Do=new z,es=new z,ns=new z,Os=new z,Za=new z,Zc=new z,Jc=new z,Us=new z;function wd(r,t,e,n,i){for(let s=0,o=r.length-3;s<=o;s+=3){Us.fromArray(r,s);let a=i.x*Math.abs(Us.x)+i.y*Math.abs(Us.y)+i.z*Math.abs(Us.z),l=t.dot(Us),c=e.dot(Us),h=n.dot(Us);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var on=new z,$c=new vt,jy=0,Si=class extends fr{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:jy++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=up,this.updateRanges=[],this.gpuType=ji,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)$c.fromBufferAttribute(this,e),$c.applyMatrix3(t),this.setXY(e,$c.x,$c.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)on.fromBufferAttribute(this,e),on.applyMatrix3(t),this.setXYZ(e,on.x,on.y,on.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)on.fromBufferAttribute(this,e),on.applyMatrix4(t),this.setXYZ(e,on.x,on.y,on.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)on.fromBufferAttribute(this,e),on.applyNormalMatrix(t),this.setXYZ(e,on.x,on.y,on.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)on.fromBufferAttribute(this,e),on.transformDirection(t),this.setXYZ(e,on.x,on.y,on.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=qi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Te(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=qi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Te(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=qi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Te(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=qi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Te(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=qi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Te(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Te(e,this.array),n=Te(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Te(e,this.array),n=Te(n,this.array),i=Te(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,s){return t*=this.itemSize,this.normalized&&(e=Te(e,this.array),n=Te(n,this.array),i=Te(i,this.array),s=Te(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var fl=class extends Si{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var dl=class extends Si{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var xe=class extends Si{constructor(t,e,n){super(new Float32Array(t),e,n)}},Qy=new ss,Ja=new z,Td=new z,Zo=class{constructor(t=new z,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Qy.setFromPoints(t).getCenter(n);let i=0;for(let s=0,o=t.length;s<o;s++)i=Math.max(i,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ja.subVectors(t,this.center);let e=Ja.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Ja,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Td.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ja.copy(t.center).add(Td)),this.expandByPoint(Ja.copy(t.center).sub(Td))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},tS=0,Li=new Ue,Ed=new bn,Lo=new z,yi=new ss,$a=new ss,_n=new z,Qe=class r extends fr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:tS++}),this.uuid=hr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(wy(t)?dl:fl)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new ie().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Li.makeRotationFromQuaternion(t),this.applyMatrix4(Li),this}rotateX(t){return Li.makeRotationX(t),this.applyMatrix4(Li),this}rotateY(t){return Li.makeRotationY(t),this.applyMatrix4(Li),this}rotateZ(t){return Li.makeRotationZ(t),this.applyMatrix4(Li),this}translate(t,e,n){return Li.makeTranslation(t,e,n),this.applyMatrix4(Li),this}scale(t,e,n){return Li.makeScale(t,e,n),this.applyMatrix4(Li),this}lookAt(t){return Ed.lookAt(t),Ed.updateMatrix(),this.applyMatrix4(Ed.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Lo).negate(),this.translate(Lo.x,Lo.y,Lo.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let i=0,s=t.length;i<s;i++){let o=t[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new xe(n,3))}else{let n=Math.min(t.length,e.count);for(let i=0;i<n;i++){let s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&Qt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ss);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){te("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new z(-1/0,-1/0,-1/0),new z(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){let s=e[n];yi.setFromBufferAttribute(s),this.morphTargetsRelative?(_n.addVectors(this.boundingBox.min,yi.min),this.boundingBox.expandByPoint(_n),_n.addVectors(this.boundingBox.max,yi.max),this.boundingBox.expandByPoint(_n)):(this.boundingBox.expandByPoint(yi.min),this.boundingBox.expandByPoint(yi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&te('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Zo);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){te("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new z,1/0);return}if(t){let n=this.boundingSphere.center;if(yi.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){let a=e[s];$a.setFromBufferAttribute(a),this.morphTargetsRelative?(_n.addVectors(yi.min,$a.min),yi.expandByPoint(_n),_n.addVectors(yi.max,$a.max),yi.expandByPoint(_n)):(yi.expandByPoint($a.min),yi.expandByPoint($a.max))}yi.getCenter(n);let i=0;for(let s=0,o=t.count;s<o;s++)_n.fromBufferAttribute(t,s),i=Math.max(i,n.distanceToSquared(_n));if(e)for(let s=0,o=e.length;s<o;s++){let a=e[s],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)_n.fromBufferAttribute(a,c),l&&(Lo.fromBufferAttribute(t,c),_n.add(Lo)),i=Math.max(i,n.distanceToSquared(_n))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&te('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){te("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,i=e.normal,s=e.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new Si(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let y=0;y<n.count;y++)a[y]=new z,l[y]=new z;let c=new z,h=new z,u=new z,f=new vt,d=new vt,p=new vt,_=new z,g=new z;function m(y,b,A){c.fromBufferAttribute(n,y),h.fromBufferAttribute(n,b),u.fromBufferAttribute(n,A),f.fromBufferAttribute(s,y),d.fromBufferAttribute(s,b),p.fromBufferAttribute(s,A),h.sub(c),u.sub(c),d.sub(f),p.sub(f);let R=1/(d.x*p.y-p.x*d.y);isFinite(R)&&(_.copy(h).multiplyScalar(p.y).addScaledVector(u,-d.y).multiplyScalar(R),g.copy(u).multiplyScalar(d.x).addScaledVector(h,-p.x).multiplyScalar(R),a[y].add(_),a[b].add(_),a[A].add(_),l[y].add(g),l[b].add(g),l[A].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:t.count}]);for(let y=0,b=v.length;y<b;++y){let A=v[y],R=A.start,P=A.count;for(let N=R,L=R+P;N<L;N+=3)m(t.getX(N+0),t.getX(N+1),t.getX(N+2))}let S=new z,x=new z,w=new z,M=new z;function E(y){w.fromBufferAttribute(i,y),M.copy(w);let b=a[y];S.copy(b),S.sub(w.multiplyScalar(w.dot(b))).normalize(),x.crossVectors(M,b);let R=x.dot(l[y])<0?-1:1;o.setXYZW(y,S.x,S.y,S.z,R)}for(let y=0,b=v.length;y<b;++y){let A=v[y],R=A.start,P=A.count;for(let N=R,L=R+P;N<L;N+=3)E(t.getX(N+0)),E(t.getX(N+1)),E(t.getX(N+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new Si(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);let i=new z,s=new z,o=new z,a=new z,l=new z,c=new z,h=new z,u=new z;if(t)for(let f=0,d=t.count;f<d;f+=3){let p=t.getX(f+0),_=t.getX(f+1),g=t.getX(f+2);i.fromBufferAttribute(e,p),s.fromBufferAttribute(e,_),o.fromBufferAttribute(e,g),h.subVectors(o,s),u.subVectors(i,s),h.cross(u),a.fromBufferAttribute(n,p),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,g),a.add(h),l.add(h),c.add(h),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let f=0,d=e.count;f<d;f+=3)i.fromBufferAttribute(e,f+0),s.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),h.subVectors(o,s),u.subVectors(i,s),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)_n.fromBufferAttribute(t,e),_n.normalize(),t.setXYZ(e,_n.x,_n.y,_n.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,u=a.normalized,f=new c.constructor(l.length*h),d=0,p=0;for(let _=0,g=l.length;_<g;_++){a.isInterleavedBufferAttribute?d=l[_]*a.data.stride+a.offset:d=l[_]*h;for(let m=0;m<h;m++)f[p++]=c[d++]}return new Si(f,h,u)}if(this.index===null)return Qt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new r,n=this.index.array,i=this.attributes;for(let a in i){let l=i[a],c=t(l,n);e.setAttribute(a,c)}let s=this.morphAttributes;for(let a in s){let l=[],c=s[a];for(let h=0,u=c.length;h<u;h++){let f=c[h],d=t(f,n);l.push(d)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let i={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){let d=c[u];h.push(d.toJSON(t.data))}h.length>0&&(i[l]=h,s=!0)}s&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let i=t.attributes;for(let c in i){let h=i[c];this.setAttribute(c,h.clone(e))}let s=t.morphAttributes;for(let c in s){let h=[],u=s[c];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ch=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=up,this.updateRanges=[],this.version=0,this.uuid=hr()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let i=0,s=this.stride;i<s;i++)this.array[t+i]=e.array[n+i];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=hr()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=hr()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let e={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return e.usage=this.usage,e}},Kn=new z,pl=class r{constructor(t,e,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Kn.fromBufferAttribute(this,e),Kn.applyMatrix4(t),this.setXYZ(e,Kn.x,Kn.y,Kn.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Kn.fromBufferAttribute(this,e),Kn.applyNormalMatrix(t),this.setXYZ(e,Kn.x,Kn.y,Kn.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Kn.fromBufferAttribute(this,e),Kn.transformDirection(t),this.setXYZ(e,Kn.x,Kn.y,Kn.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=qi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Te(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=Te(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Te(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Te(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Te(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=qi(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=qi(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=qi(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=qi(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=Te(e,this.array),n=Te(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=Te(e,this.array),n=Te(n,this.array),i=Te(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this}setXYZW(t,e,n,i,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Te(e,this.array),n=Te(n,this.array),i=Te(i,this.array),s=Te(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this.data.array[t+3]=s,this}clone(t){if(t===void 0){cl("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[i+s])}return new Si(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new r(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){cl("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Ad=new z,eS=new z,nS=new ie,li=class{constructor(t=new z(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let i=Ad.subVectors(n,e).cross(eS.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let i=t.delta(Ad),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let o=-(t.start.dot(this.normal)+this.constant)/s;return n===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(i,o)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||nS.getNormalMatrix(t),i=this.coplanarPoint(Ad).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},iS=0,Or=class extends fr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:iS++}),this.uuid=hr(),this.name="",this.type="Material",this.blending=ra,this.side=us,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Jd,this.blendDst=$d,this.blendEquation=Xs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ee(0,0,0),this.blendAlpha=0,this.depthFunc=Ho,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Zg,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=mh,this.stencilZFail=mh,this.stencilZPass=mh,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){Qt(`Material: parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){Qt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){let o=[];for(let a in s){let l=s[a];delete l.metadata,o.push(l)}return o}if(e){let s=i(t.textures),o=i(t.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new ee().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new li().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new vt().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new vt().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let i=e.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},Jo=class extends Or{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new ee(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},No,Ka=new z,Fo=new z,Oo=new z,Uo=new vt,ja=new vt,o_=new Ue,Kc=new z,Qa=new z,jc=new z,sg=new vt,Cd=new vt,og=new vt,ml=class extends bn{constructor(t=new Jo){if(super(),this.isSprite=!0,this.type="Sprite",No===void 0){No=new Qe;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Ch(e,5);No.setIndex([0,1,2,0,2,3]),No.setAttribute("position",new pl(n,3,0,!1)),No.setAttribute("uv",new pl(n,2,3,!1))}this.geometry=No,this.material=t,this.center=new vt(.5,.5),this.count=1}intersectsFrustum(t){return t.intersectsSprite(this)}raycast(t,e){t.camera===null&&te('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Fo.setFromMatrixScale(this.matrixWorld),o_.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Oo.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Fo.multiplyScalar(-Oo.z);let n=this.material.rotation,i,s;n!==0&&(s=Math.cos(n),i=Math.sin(n));let o=this.center;Qc(Kc.set(-.5,-.5,0),Oo,o,Fo,i,s),Qc(Qa.set(.5,-.5,0),Oo,o,Fo,i,s),Qc(jc.set(.5,.5,0),Oo,o,Fo,i,s),sg.set(0,0),Cd.set(1,0),og.set(1,1);let a=t.ray.intersectTriangle(Kc,Qa,jc,!1,Ka);if(a===null&&(Qc(Qa.set(-.5,.5,0),Oo,o,Fo,i,s),Cd.set(0,1),a=t.ray.intersectTriangle(Kc,jc,Qa,!1,Ka),a===null))return;let l=t.ray.origin.distanceTo(Ka);l<t.near||l>t.far||e.push({distance:l,point:Ka.clone(),uv:Lr.getInterpolation(Ka,Kc,Qa,jc,sg,Cd,og,new vt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}};function Qc(r,t,e,n,i,s){Uo.subVectors(r,e).addScalar(.5).multiply(n),i!==void 0?(ja.x=s*Uo.x-i*Uo.y,ja.y=i*Uo.x+s*Uo.y):ja.copy(Uo),r.copy(t),r.x+=ja.x,r.y+=ja.y,r.applyMatrix4(o_)}var Dr=new z,Rd=new z,th=new z,eh=new z,Rh=class{constructor(t=new z,e=new z(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Dr)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Dr.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Dr.copy(this.origin).addScaledVector(this.direction,e),Dr.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){Rd.copy(t).add(e).multiplyScalar(.5),th.copy(e).sub(t).normalize(),eh.copy(this.origin).sub(Rd);let s=t.distanceTo(e)*.5,o=-this.direction.dot(th),a=eh.dot(this.direction),l=-eh.dot(th),c=eh.lengthSq(),h=Math.abs(1-o*o),u,f,d,p;if(h>0)if(u=o*l-a,f=o*a-l,p=s*h,u>=0)if(f>=-p)if(f<=p){let _=1/h;u*=_,f*=_,d=u*(u+o*f+2*a)+f*(o*u+f+2*l)+c}else f=s,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;else f=-s,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;else f<=-p?(u=Math.max(0,-(-o*s+a)),f=u>0?-s:Math.min(Math.max(-s,-l),s),d=-u*u+f*(f+2*l)+c):f<=p?(u=0,f=Math.min(Math.max(-s,-l),s),d=f*(f+2*l)+c):(u=Math.max(0,-(o*s+a)),f=u>0?s:Math.min(Math.max(-s,-l),s),d=-u*u+f*(f+2*l)+c);else f=o>0?-s:s,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Rd).addScaledVector(th,f),d}intersectSphere(t,e){if(t.radius<0)return null;Dr.subVectors(t.center,this.origin);let n=Dr.dot(this.direction),i=Dr.dot(Dr)-n*n,s=t.radius*t.radius;if(i>s)return null;let o=Math.sqrt(s-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,s,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(t.min.x-f.x)*c,i=(t.max.x-f.x)*c):(n=(t.max.x-f.x)*c,i=(t.min.x-f.x)*c),h>=0?(s=(t.min.y-f.y)*h,o=(t.max.y-f.y)*h):(s=(t.max.y-f.y)*h,o=(t.min.y-f.y)*h),n>o||s>i||((s>n||isNaN(n))&&(n=s),(o<i||isNaN(i))&&(i=o),u>=0?(a=(t.min.z-f.z)*u,l=(t.max.z-f.z)*u):(a=(t.max.z-f.z)*u,l=(t.min.z-f.z)*u),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,Dr)!==null}intersectTriangle(t,e,n,i,s){let o=this.origin,a=this.direction,l=a.x,c=a.y,h=a.z,u=t.x-o.x,f=t.y-o.y,d=t.z-o.z,p=e.x-o.x,_=e.y-o.y,g=e.z-o.z,m=n.x-o.x,v=n.y-o.y,S=n.z-o.z,x=Math.abs(l),w=Math.abs(c),M=Math.abs(h),E,y,b,A,R,P,N,L,F,k,B,$;if(x>=w&&x>=M?(b=l,P=u,F=p,$=m,l>=0?(E=c,y=h,A=f,R=d,N=_,L=g,k=v,B=S):(E=h,y=c,A=d,R=f,N=g,L=_,k=S,B=v)):w>=M?(b=c,P=f,F=_,$=v,c>=0?(E=h,y=l,A=d,R=u,N=g,L=p,k=S,B=m):(E=l,y=h,A=u,R=d,N=p,L=g,k=m,B=S)):(b=h,P=d,F=g,$=S,h>=0?(E=l,y=c,A=u,R=f,N=p,L=_,k=m,B=v):(E=c,y=l,A=f,R=u,N=_,L=p,k=v,B=m)),b===0)return null;let W=E/b,D=y/b,Q=1/b,Ct=A-W*P,yt=R-D*P,Bt=N-W*F,st=L-D*F,bt=k-W*$,q=B-D*$,j=bt*st-q*Bt,dt=Ct*q-yt*bt,zt=Bt*yt-st*Ct;if(i){if(j<0||dt<0||zt<0)return null}else if((j<0||dt<0||zt<0)&&(j>0||dt>0||zt>0))return null;let xt=j+dt+zt;if(xt===0)return null;let Ot=Q*(j*P+dt*F+zt*$);return(xt>0?Ot<0:Ot>0)?null:this.at(Ot/xt,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Fi=class extends Or{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ee(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fr,this.combine=Kd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},ag=new Ue,Bs=new Rh,nh=new Zo,lg=new z,ih=new z,rh=new z,sh=new z,Pd=new z,oh=new z,cg=new z,ah=new z,de=class extends bn{constructor(t=new Qe,e=new Fi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(t,e){let n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);let a=this.morphTargetInfluences;if(s&&a){oh.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let h=a[l],u=s[l];h!==0&&(Pd.fromBufferAttribute(u,t),o?oh.addScaledVector(Pd,h):oh.addScaledVector(Pd.sub(e),h))}e.add(oh)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),nh.copy(n.boundingSphere),nh.applyMatrix4(s),Bs.copy(t.ray).recast(t.near),!(nh.containsPoint(Bs.origin)===!1&&(Bs.intersectSphere(nh,lg)===null||Bs.origin.distanceToSquared(lg)>(t.far-t.near)**2))&&(ag.copy(s).invert(),Bs.copy(t.ray).applyMatrix4(ag),!(n.boundingBox!==null&&Bs.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Bs)))}_computeIntersections(t,e,n){let i,s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,f=s.groups,d=s.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,_=f.length;p<_;p++){let g=f[p],m=o[g.materialIndex],v=Math.max(g.start,d.start),S=Math.min(a.count,Math.min(g.start+g.count,d.start+d.count));for(let x=v,w=S;x<w;x+=3){let M=a.getX(x),E=a.getX(x+1),y=a.getX(x+2);i=lh(this,m,t,n,c,h,u,M,E,y),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=g.materialIndex,e.push(i))}}else{let p=Math.max(0,d.start),_=Math.min(a.count,d.start+d.count);for(let g=p,m=_;g<m;g+=3){let v=a.getX(g),S=a.getX(g+1),x=a.getX(g+2);i=lh(this,o,t,n,c,h,u,v,S,x),i&&(i.faceIndex=Math.floor(g/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,_=f.length;p<_;p++){let g=f[p],m=o[g.materialIndex],v=Math.max(g.start,d.start),S=Math.min(l.count,Math.min(g.start+g.count,d.start+d.count));for(let x=v,w=S;x<w;x+=3){let M=x,E=x+1,y=x+2;i=lh(this,m,t,n,c,h,u,M,E,y),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=g.materialIndex,e.push(i))}}else{let p=Math.max(0,d.start),_=Math.min(l.count,d.start+d.count);for(let g=p,m=_;g<m;g+=3){let v=g,S=g+1,x=g+2;i=lh(this,o,t,n,c,h,u,v,S,x),i&&(i.faceIndex=Math.floor(g/3),e.push(i))}}}};function rS(r,t,e,n,i,s,o,a){let l;if(t.side===Tn?l=n.intersectTriangle(o,s,i,!0,a):l=n.intersectTriangle(i,s,o,t.side===us,a),l===null)return null;ah.copy(a),ah.applyMatrix4(r.matrixWorld);let c=e.ray.origin.distanceTo(ah);return c<e.near||c>e.far?null:{distance:c,point:ah.clone(),object:r}}function lh(r,t,e,n,i,s,o,a,l,c){r.getVertexPosition(a,ih),r.getVertexPosition(l,rh),r.getVertexPosition(c,sh);let h=rS(r,t,e,n,ih,rh,sh,cg);if(h){let u=new z;Lr.getBarycoord(cg,ih,rh,sh,u),i&&(h.uv=Lr.getInterpolatedAttribute(i,a,l,c,u,new vt)),s&&(h.uv1=Lr.getInterpolatedAttribute(s,a,l,c,u,new vt)),o&&(h.normal=Lr.getInterpolatedAttribute(o,a,l,c,u,new z),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let f={a,b:l,c,normal:new z,materialIndex:0};Lr.getNormal(ih,rh,sh,f.normal),h.face=f,h.barycoord=u}return h}var $o=class extends Qn{constructor(t=null,e=1,n=1,i,s,o,a,l,c=xn,h=xn,u,f){super(null,o,a,l,c,h,i,s,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ks=new Zo,sS=new vt(.5,.5),ch=new z,Ko=class{constructor(t=new li,e=new li,n=new li,i=new li,s=new li,o=new li){this.planes=[t,e,n,i,s,o]}set(t,e,n,i,s,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(s),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Zi,n=!1){let i=this.planes,s=t.elements,o=s[0],a=s[1],l=s[2],c=s[3],h=s[4],u=s[5],f=s[6],d=s[7],p=s[8],_=s[9],g=s[10],m=s[11],v=s[12],S=s[13],x=s[14],w=s[15];if(i[0].setComponents(c-o,d-h,m-p,w-v).normalize(),i[1].setComponents(c+o,d+h,m+p,w+v).normalize(),i[2].setComponents(c+a,d+u,m+_,w+S).normalize(),i[3].setComponents(c-a,d-u,m-_,w-S).normalize(),n)i[4].setComponents(l,f,g,x).normalize(),i[5].setComponents(c-l,d-f,m-g,w-x).normalize();else if(i[4].setComponents(c-l,d-f,m-g,w-x).normalize(),e===Zi)i[5].setComponents(c+l,d+f,m+g,w+x).normalize();else if(e===Go)i[5].setComponents(l,f,g,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ks.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ks.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ks)}intersectsSprite(t){ks.center.set(0,0,0);let e=sS.distanceTo(t.center);return ks.radius=.7071067811865476+e,ks.applyMatrix4(t.matrixWorld),this.intersectsSphere(ks)}intersectsSphere(t){let e=this.planes,n=t.center,i=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let i=e[n];if(ch.x=i.normal.x>0?t.max.x:t.min.x,ch.y=i.normal.y>0?t.max.y:t.min.y,ch.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(ch)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var gl=class extends Qn{constructor(t=[],e=fs,n,i,s,o,a,l,c,h){super(t,e,n,i,s,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Oi=class extends Qn{constructor(t,e,n,i,s,o,a,l,c){super(t,e,n,i,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var os=class extends Qn{constructor(t,e,n=Ki,i,s,o,a=xn,l=xn,c,h=ur,u=1){if(h!==ur&&h!==ps)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:t,height:e,depth:u};super(f,i,s,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Yo(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},Ph=class extends os{constructor(t,e=Ki,n=fs,i,s,o=xn,a=xn,l,c=ur){let h={width:t,height:t,depth:1},u=[h,h,h,h,h,h];super(t,t,e,n,i,s,o,a,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},_l=class extends Qn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},Ji=class r extends Qe{constructor(t=1,e=1,n=1,i=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:s,depthSegments:o};let a=this;i=Math.floor(i),s=Math.floor(s),o=Math.floor(o);let l=[],c=[],h=[],u=[],f=0,d=0;p("z","y","x",-1,-1,n,e,t,o,s,0),p("z","y","x",1,-1,n,e,-t,o,s,1),p("x","z","y",1,1,t,n,e,i,o,2),p("x","z","y",1,-1,t,n,-e,i,o,3),p("x","y","z",1,-1,t,e,n,i,s,4),p("x","y","z",-1,-1,t,e,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new xe(c,3)),this.setAttribute("normal",new xe(h,3)),this.setAttribute("uv",new xe(u,2));function p(_,g,m,v,S,x,w,M,E,y,b){let A=x/E,R=w/y,P=x/2,N=w/2,L=M/2,F=E+1,k=y+1,B=0,$=0,W=new z;for(let D=0;D<k;D++){let Q=D*R-N;for(let Ct=0;Ct<F;Ct++){let yt=Ct*A-P;W[_]=yt*v,W[g]=Q*S,W[m]=L,c.push(W.x,W.y,W.z),W[_]=0,W[g]=0,W[m]=M>0?1:-1,h.push(W.x,W.y,W.z),u.push(Ct/E),u.push(1-D/y),B+=1}}for(let D=0;D<y;D++)for(let Q=0;Q<E;Q++){let Ct=f+Q+F*D,yt=f+Q+F*(D+1),Bt=f+(Q+1)+F*(D+1),st=f+(Q+1)+F*D;l.push(Ct,yt,st),l.push(yt,Bt,st),$+=6}a.addGroup(d,$,b),d+=$,f+=B}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var Ui=class r extends Qe{constructor(t=1,e=1,n=1,i=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};let c=this;i=Math.floor(i),s=Math.floor(s);let h=[],u=[],f=[],d=[],p=0,_=[],g=n/2,m=0;v(),o===!1&&(t>0&&S(!0),e>0&&S(!1)),this.setIndex(h),this.setAttribute("position",new xe(u,3)),this.setAttribute("normal",new xe(f,3)),this.setAttribute("uv",new xe(d,2));function v(){let x=new z,w=new z,M=0,E=(e-t)/n;for(let y=0;y<=s;y++){let b=[],A=y/s,R=A*(e-t)+t;for(let P=0;P<=i;P++){let N=P/i,L=N*l+a,F=Math.sin(L),k=Math.cos(L);w.x=R*F,w.y=-A*n+g,w.z=R*k,u.push(w.x,w.y,w.z),x.set(F,E,k).normalize(),f.push(x.x,x.y,x.z),d.push(N,1-A),b.push(p++)}_.push(b)}for(let y=0;y<i;y++)for(let b=0;b<s;b++){let A=_[b][y],R=_[b+1][y],P=_[b+1][y+1],N=_[b][y+1];(t>0||b!==0)&&(h.push(A,R,N),M+=3),(e>0||b!==s-1)&&(h.push(R,P,N),M+=3)}c.addGroup(m,M,0),m+=M}function S(x){let w=p,M=new vt,E=new z,y=0,b=x===!0?t:e,A=x===!0?1:-1;for(let P=1;P<=i;P++)u.push(0,g*A,0),f.push(0,A,0),d.push(.5,.5),p++;let R=p;for(let P=0;P<=i;P++){let L=P/i*l+a,F=Math.cos(L),k=Math.sin(L);E.x=b*k,E.y=g*A,E.z=b*F,u.push(E.x,E.y,E.z),f.push(0,A,0),M.x=F*.5+.5,M.y=k*.5*A+.5,d.push(M.x,M.y),p++}for(let P=0;P<i;P++){let N=w+P,L=R+P;x===!0?h.push(L,L+1,N):h.push(L+1,L,N),y+=3}c.addGroup(m,y,x===!0?1:2),m+=y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},xl=class r extends Ui{constructor(t=1,e=1,n=32,i=1,s=!1,o=0,a=Math.PI*2){super(0,t,e,n,i,s,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(t){return new r(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var Mi=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Qt("Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,i=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),s+=n.distanceTo(i),e.push(s),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),i=0,s=n.length,o;e?o=e:o=t*n[s-1];let a=0,l=s-1,c;for(;a<=l;)if(i=Math.floor(a+(l-a)/2),c=n[i]-o,c<0)a=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===o)return i/(s-1);let h=n[i],f=n[i+1]-h,d=(o-h)/f;return(i+d)/(s-1)}getTangent(t,e){let i=t-1e-4,s=t+1e-4;i<0&&(i=0),s>1&&(s=1);let o=this.getPoint(i),a=this.getPoint(s),l=e||(o.isVector2?new vt:new z);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new z,i=[],s=[],o=[],a=new z,l=new Ue;for(let d=0;d<=t;d++){let p=d/t;i[d]=this.getTangentAt(p,new z)}s[0]=new z,o[0]=new z;let c=Number.MAX_VALUE,h=Math.abs(i[0].x),u=Math.abs(i[0].y),f=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),f<=c&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),s[0].crossVectors(i[0],a),o[0].crossVectors(i[0],s[0]);for(let d=1;d<=t;d++){if(s[d]=s[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(i[d-1],i[d]),a.length()>Number.EPSILON){a.normalize();let p=Math.acos(ce(i[d-1].dot(i[d]),-1,1));s[d].applyMatrix4(l.makeRotationAxis(a,p))}o[d].crossVectors(i[d],s[d])}if(e===!0){let d=Math.acos(ce(s[0].dot(s[t]),-1,1));d/=t,i[0].dot(a.crossVectors(s[0],s[t]))>0&&(d=-d);for(let p=1;p<=t;p++)s[p].applyMatrix4(l.makeRotationAxis(i[p],d*p)),o[p].crossVectors(i[p],s[p])}return{tangents:i,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},jo=class extends Mi{constructor(t=0,e=0,n=1,i=1,s=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new vt){let n=e,i=Math.PI*2,s=this.aEndAngle-this.aStartAngle,o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=i;for(;s>i;)s-=i;s<Number.EPSILON&&(o?s=0:s=i),this.aClockwise===!0&&!o&&(s===i?s=-i:s=s-i);let a=this.aStartAngle+t*s,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=l-this.aX,d=c-this.aY;l=f*h-d*u+this.aX,c=f*u+d*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},Ih=class extends jo{constructor(t,e,n,i,s,o){super(t,e,n,n,i,s,o),this.isArcCurve=!0,this.type="ArcCurve"}};function mp(){let r=0,t=0,e=0,n=0;function i(s,o,a,l){r=s,t=a,e=-3*s+3*o-2*a-l,n=2*s-2*o+a+l}return{initCatmullRom:function(s,o,a,l,c){i(o,a,c*(a-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,a,l,c,h,u){let f=(o-s)/c-(a-s)/(c+h)+(a-o)/h,d=(a-o)/h-(l-o)/(h+u)+(l-a)/u;f*=h,d*=h,i(o,a,f,d)},calc:function(s){let o=s*s,a=o*s;return r+t*s+e*o+n*a}}}var hg=new z,ug=new z,Id=new mp,Dd=new mp,Ld=new mp,Qo=class extends Mi{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new z){let n=e,i=this.points,s=i.length,o=(s-(this.closed?0:1))*t,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:l===0&&a===s-1&&(a=s-2,l=1);let c,h;this.closed||a>0?c=i[(a-1)%s]:(ug.subVectors(i[0],i[1]).add(i[0]),c=ug);let u=i[a%s],f=i[(a+1)%s];if(this.closed||a+2<s?h=i[(a+2)%s]:(hg.subVectors(i[s-1],i[s-2]).add(i[s-1]),h=hg),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,p=Math.pow(c.distanceToSquared(u),d),_=Math.pow(u.distanceToSquared(f),d),g=Math.pow(f.distanceToSquared(h),d);_<1e-4&&(_=1),p<1e-4&&(p=_),g<1e-4&&(g=_),Id.initNonuniformCatmullRom(c.x,u.x,f.x,h.x,p,_,g),Dd.initNonuniformCatmullRom(c.y,u.y,f.y,h.y,p,_,g),Ld.initNonuniformCatmullRom(c.z,u.z,f.z,h.z,p,_,g)}else this.curveType==="catmullrom"&&(Id.initCatmullRom(c.x,u.x,f.x,h.x,this.tension),Dd.initCatmullRom(c.y,u.y,f.y,h.y,this.tension),Ld.initCatmullRom(c.z,u.z,f.z,h.z,this.tension));return n.set(Id.calc(l),Dd.calc(l),Ld.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new z().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function fg(r,t,e,n,i){let s=(n-t)*.5,o=(i-e)*.5,a=r*r,l=r*a;return(2*e-2*n+s+o)*l+(-3*e+3*n-2*s-o)*a+s*r+e}function oS(r,t){let e=1-r;return e*e*t}function aS(r,t){return 2*(1-r)*r*t}function lS(r,t){return r*r*t}function il(r,t,e,n){return oS(r,t)+aS(r,e)+lS(r,n)}function cS(r,t){let e=1-r;return e*e*e*t}function hS(r,t){let e=1-r;return 3*e*e*r*t}function uS(r,t){return 3*(1-r)*r*r*t}function fS(r,t){return r*r*r*t}function rl(r,t,e,n,i){return cS(r,t)+hS(r,e)+uS(r,n)+fS(r,i)}var vl=class extends Mi{constructor(t=new vt,e=new vt,n=new vt,i=new vt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new vt){let n=e,i=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(rl(t,i.x,s.x,o.x,a.x),rl(t,i.y,s.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Dh=class extends Mi{constructor(t=new z,e=new z,n=new z,i=new z){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new z){let n=e,i=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(rl(t,i.x,s.x,o.x,a.x),rl(t,i.y,s.y,o.y,a.y),rl(t,i.z,s.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},yl=class extends Mi{constructor(t=new vt,e=new vt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new vt){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new vt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Lh=class extends Mi{constructor(t=new z,e=new z){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new z){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new z){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Sl=class extends Mi{constructor(t=new vt,e=new vt,n=new vt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new vt){let n=e,i=this.v0,s=this.v1,o=this.v2;return n.set(il(t,i.x,s.x,o.x),il(t,i.y,s.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ml=class extends Mi{constructor(t=new z,e=new z,n=new z){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new z){let n=e,i=this.v0,s=this.v1,o=this.v2;return n.set(il(t,i.x,s.x,o.x),il(t,i.y,s.y,o.y),il(t,i.z,s.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},bl=class extends Mi{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new vt){let n=e,i=this.points,s=(i.length-1)*t,o=Math.floor(s),a=s-o,l=i[o===0?o:o-1],c=i[o],h=i[o>i.length-2?i.length-1:o+1],u=i[o>i.length-3?i.length-1:o+2];return n.set(fg(a,l.x,c.x,h.x,u.x),fg(a,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new vt().fromArray(i))}return this}},Nh=Object.freeze({__proto__:null,ArcCurve:Ih,CatmullRomCurve3:Qo,CubicBezierCurve:vl,CubicBezierCurve3:Dh,EllipseCurve:jo,LineCurve:yl,LineCurve3:Lh,QuadraticBezierCurve:Sl,QuadraticBezierCurve3:Ml,SplineCurve:bl}),Fh=class extends Mi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Nh[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),i=this.getCurveLengths(),s=0;for(;s<i.length;){if(i[s]>=n){let o=i[s]-n,a=this.curves[s],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}s++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let i=0,s=this.curves;i<s.length;i++){let o=s[i],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(new Nh[i.type]().fromJSON(i))}return this}},Gs=class extends Fh{constructor(t){super(),this.type="Path",this.currentPoint=new vt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new yl(this.currentPoint.clone(),new vt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){let s=new Sl(this.currentPoint.clone(),new vt(t,e),new vt(n,i));return this.curves.push(s),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,s,o){let a=new vl(this.currentPoint.clone(),new vt(t,e),new vt(n,i),new vt(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new bl(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,s,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,i,s,o),this}absarc(t,e,n,i,s,o){return this.absellipse(t,e,n,n,i,s,o),this}ellipse(t,e,n,i,s,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,i,s,o,a,l),this}absellipse(t,e,n,i,s,o,a,l){let c=new jo(t,e,n,i,s,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},ta=class extends Gs{constructor(t){super(t),this.uuid=hr(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,i=this.holes.length;n<i;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let i=this.holes[e];t.holes.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(new Gs().fromJSON(i))}return this}};function dS(r,t,e=2){let n=t&&t.length,i=n?t[0]*e:r.length,s=a_(r,0,i,e,!0),o=[];if(!s||s.next===s.prev)return o;let a,l,c;if(n&&(s=xS(r,t,s,e)),r.length>80*e){a=r[0],l=r[1];let h=a,u=l;for(let f=e;f<i;f+=e){let d=r[f],p=r[f+1];d<a&&(a=d),p<l&&(l=p),d>h&&(h=d),p>u&&(u=p)}c=Math.max(h-a,u-l),c=c!==0?32767/c:0}return wl(s,o,e,a,l,c,0),o}function a_(r,t,e,n,i){let s;if(i===RS(r,t,e,n)>0)for(let o=t;o<e;o+=n)s=dg(o/n|0,r[o],r[o+1],s);else for(let o=e-n;o>=t;o-=n)s=dg(o/n|0,r[o],r[o+1],s);return s&&ea(s,s.next)&&(El(s),s=s.next),s}function Ws(r,t){if(!r)return r;t||(t=r);let e=r,n;do if(n=!1,!e.steiner&&(ea(e,e.next)||He(e.prev,e,e.next)===0)){if(El(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function wl(r,t,e,n,i,s,o){if(!r)return;!o&&s&&bS(r,n,i,s);let a=r;for(;r.prev!==r.next;){let l=r.prev,c=r.next;if(s?mS(r,n,i,s):pS(r)){t.push(l.i,r.i,c.i),El(r),r=c.next,a=c.next;continue}if(r=c,r===a){o?o===1?(r=gS(Ws(r),t),wl(r,t,e,n,i,s,2)):o===2&&_S(r,t,e,n,i,s):wl(Ws(r),t,e,n,i,s,1);break}}}function pS(r){let t=r.prev,e=r,n=r.next;if(He(t,e,n)>=0)return!1;let i=t.x,s=e.x,o=n.x,a=t.y,l=e.y,c=n.y,h=Math.min(i,s,o),u=Math.min(a,l,c),f=Math.max(i,s,o),d=Math.max(a,l,c),p=n.next;for(;p!==t;){if(p.x>=h&&p.x<=f&&p.y>=u&&p.y<=d&&tl(i,a,s,l,o,c,p.x,p.y)&&He(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function mS(r,t,e,n){let i=r.prev,s=r,o=r.next;if(He(i,s,o)>=0)return!1;let a=i.x,l=s.x,c=o.x,h=i.y,u=s.y,f=o.y,d=Math.min(a,l,c),p=Math.min(h,u,f),_=Math.max(a,l,c),g=Math.max(h,u,f),m=zd(d,p,t,e,n),v=zd(_,g,t,e,n),S=r.prevZ,x=r.nextZ;for(;S&&S.z>=m&&x&&x.z<=v;){if(S.x>=d&&S.x<=_&&S.y>=p&&S.y<=g&&S!==i&&S!==o&&tl(a,h,l,u,c,f,S.x,S.y)&&He(S.prev,S,S.next)>=0||(S=S.prevZ,x.x>=d&&x.x<=_&&x.y>=p&&x.y<=g&&x!==i&&x!==o&&tl(a,h,l,u,c,f,x.x,x.y)&&He(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;S&&S.z>=m;){if(S.x>=d&&S.x<=_&&S.y>=p&&S.y<=g&&S!==i&&S!==o&&tl(a,h,l,u,c,f,S.x,S.y)&&He(S.prev,S,S.next)>=0)return!1;S=S.prevZ}for(;x&&x.z<=v;){if(x.x>=d&&x.x<=_&&x.y>=p&&x.y<=g&&x!==i&&x!==o&&tl(a,h,l,u,c,f,x.x,x.y)&&He(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function gS(r,t){let e=r;do{let n=e.prev,i=e.next.next;!ea(n,i)&&c_(n,e,e.next,i)&&Tl(n,i)&&Tl(i,n)&&(t.push(n.i,e.i,i.i),El(e),El(e.next),e=r=i),e=e.next}while(e!==r);return Ws(e)}function _S(r,t,e,n,i,s){let o=r;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&ES(o,a)){let l=h_(o,a);o=Ws(o,o.next),l=Ws(l,l.next),wl(o,t,e,n,i,s,0),wl(l,t,e,n,i,s,0);return}a=a.next}o=o.next}while(o!==r)}function xS(r,t,e,n){let i=[];for(let s=0,o=t.length;s<o;s++){let a=t[s]*n,l=s<o-1?t[s+1]*n:r.length,c=a_(r,a,l,n,!1);c===c.next&&(c.steiner=!0),i.push(TS(c))}i.sort(vS);for(let s=0;s<i.length;s++)e=yS(i[s],e);return e}function vS(r,t){let e=r.x-t.x;if(e===0&&(e=r.y-t.y,e===0)){let n=(r.next.y-r.y)/(r.next.x-r.x),i=(t.next.y-t.y)/(t.next.x-t.x);e=n-i}return e}function yS(r,t){let e=SS(r,t);if(!e)return t;let n=h_(e,r);return Ws(n,n.next),Ws(e,e.next)}function SS(r,t){let e=t,n=r.x,i=r.y,s=-1/0,o;if(ea(r,e))return e;do{if(ea(r,e.next))return e.next;if(i<=e.y&&i>=e.next.y&&e.next.y!==e.y){let u=e.x+(i-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>s&&(s=u,o=e.x<e.next.x?e:e.next,u===n))return o}e=e.next}while(e!==t);if(!o)return null;let a=o,l=o.x,c=o.y,h=1/0;e=o;do{if(n>=e.x&&e.x>=l&&n!==e.x&&l_(i<c?n:s,i,l,c,i<c?s:n,i,e.x,e.y)){let u=Math.abs(i-e.y)/(n-e.x);Tl(e,r)&&(u<h||u===h&&(e.x>o.x||e.x===o.x&&MS(o,e)))&&(o=e,h=u)}e=e.next}while(e!==a);return o}function MS(r,t){return He(r.prev,r,t.prev)<0&&He(t.next,r,r.next)<0}function bS(r,t,e,n){let i=r;do i.z===0&&(i.z=zd(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==r);i.prevZ.nextZ=null,i.prevZ=null,wS(i)}function wS(r){let t,e=1;do{let n=r,i;r=null;let s=null;for(t=0;n;){t++;let o=n,a=0;for(let c=0;c<e&&(a++,o=o.nextZ,!!o);c++);let l=e;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(i=n,n=n.nextZ,a--):(i=o,o=o.nextZ,l--),s?s.nextZ=i:r=i,i.prevZ=s,s=i;n=o}s.nextZ=null,e*=2}while(t>1);return r}function zd(r,t,e,n,i){return r=(r-e)*i|0,t=(t-n)*i|0,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,r|t<<1}function TS(r){let t=r,e=r;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==r);return e}function l_(r,t,e,n,i,s,o,a){return(i-o)*(t-a)>=(r-o)*(s-a)&&(r-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(s-a)>=(i-o)*(n-a)}function tl(r,t,e,n,i,s,o,a){return!(r===o&&t===a)&&l_(r,t,e,n,i,s,o,a)}function ES(r,t){return r.next.i!==t.i&&r.prev.i!==t.i&&!AS(r,t)&&(Tl(r,t)&&Tl(t,r)&&CS(r,t)&&(He(r.prev,r,t.prev)||He(r,t.prev,t))||ea(r,t)&&He(r.prev,r,r.next)>0&&He(t.prev,t,t.next)>0)}function He(r,t,e){return(t.y-r.y)*(e.x-t.x)-(t.x-r.x)*(e.y-t.y)}function ea(r,t){return r.x===t.x&&r.y===t.y}function c_(r,t,e,n){let i=uh(He(r,t,e)),s=uh(He(r,t,n)),o=uh(He(e,n,r)),a=uh(He(e,n,t));return!!(i!==s&&o!==a||i===0&&hh(r,e,t)||s===0&&hh(r,n,t)||o===0&&hh(e,r,n)||a===0&&hh(e,t,n))}function hh(r,t,e){return t.x<=Math.max(r.x,e.x)&&t.x>=Math.min(r.x,e.x)&&t.y<=Math.max(r.y,e.y)&&t.y>=Math.min(r.y,e.y)}function uh(r){return r>0?1:r<0?-1:0}function AS(r,t){let e=r;do{if(e.i!==r.i&&e.next.i!==r.i&&e.i!==t.i&&e.next.i!==t.i&&c_(e,e.next,r,t))return!0;e=e.next}while(e!==r);return!1}function Tl(r,t){return He(r.prev,r,r.next)<0?He(r,t,r.next)>=0&&He(r,r.prev,t)>=0:He(r,t,r.prev)<0||He(r,r.next,t)<0}function CS(r,t){let e=r,n=!1,i=(r.x+t.x)/2,s=(r.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&i<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==r);return n}function h_(r,t){let e=Vd(r.i,r.x,r.y),n=Vd(t.i,t.x,t.y),i=r.next,s=t.prev;return r.next=t,t.prev=r,e.next=i,i.prev=e,n.next=e,e.prev=n,s.next=n,n.prev=s,n}function dg(r,t,e,n){let i=Vd(r,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function El(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function Vd(r,t,e){return{i:r,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function RS(r,t,e,n){let i=0;for(let s=t,o=e-n;s<e;s+=n)i+=(r[o]-r[s])*(r[s+1]+r[o+1]),o=s;return i}var Hd=class{static triangulate(t,e,n=2){return dS(t,e,n)}},zs=class r{static area(t){let e=t.length,n=0;for(let i=e-1,s=0;s<e;i=s++)n+=t[i].x*t[s].y-t[s].x*t[i].y;return n*.5}static isClockWise(t){return r.area(t)<0}static triangulateShape(t,e){let n=[],i=[],s=[];pg(t),mg(n,t);let o=t.length;e.forEach(pg);for(let l=0;l<e.length;l++)i.push(o),o+=e[l].length,mg(n,e[l]);let a=Hd.triangulate(n,i);for(let l=0;l<a.length;l+=3)s.push(a.slice(l,l+3));return s}};function pg(r){let t=r.length;t>2&&r[t-1].equals(r[0])&&r.pop()}function mg(r,t){for(let e=0;e<t.length;e++)r.push(t[e].x),r.push(t[e].y)}var Al=class r extends Qe{constructor(t=new ta([new vt(.5,.5),new vt(-.5,.5),new vt(-.5,-.5),new vt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,i=[],s=[];for(let a=0,l=t.length;a<l;a++){let c=t[a];o(c)}this.setAttribute("position",new xe(i,3)),this.setAttribute("uv",new xe(s,2)),this.computeVertexNormals();function o(a){let l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1,f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,p=e.bevelSize!==void 0?e.bevelSize:d-.1,_=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3,m=e.extrudePath,v=e.UVGenerator!==void 0?e.UVGenerator:PS,S,x=!1,w,M,E,y;if(m){S=m.getSpacedPoints(h),x=!0,f=!1;let et=m.isCatmullRomCurve3?m.closed:!1;w=m.computeFrenetFrames(h,et),M=new z,E=new z,y=new z}f||(g=0,d=0,p=0,_=0);let b=a.extractPoints(c),A=b.shape,R=b.holes;if(!zs.isClockWise(A)){A=A.reverse();for(let et=0,ot=R.length;et<ot;et++){let ct=R[et];zs.isClockWise(ct)&&(R[et]=ct.reverse())}}function N(et){let ct=10000000000000001e-36,U=et[0];for(let mt=1;mt<=et.length;mt++){let Ht=mt%et.length,Y=et[Ht],ft=Y.x-U.x,It=Y.y-U.y,O=ft*ft+It*It,jt=Math.max(Math.abs(Y.x),Math.abs(Y.y),Math.abs(U.x),Math.abs(U.y)),Ft=ct*jt*jt;if(O<=Ft){et.splice(Ht,1),mt--;continue}U=Y}}N(A),R.forEach(N);let L=R.length,F=A;for(let et=0;et<L;et++){let ot=R[et];A=A.concat(ot)}function k(et,ot,ct){return ot||te("ExtrudeGeometry: vec does not exist"),et.clone().addScaledVector(ot,ct)}let B=A.length;function $(et,ot,ct){let U,mt,Ht,Y=et.x-ot.x,ft=et.y-ot.y,It=ct.x-et.x,O=ct.y-et.y,jt=Y*Y+ft*ft,Ft=Y*O-ft*It;if(Math.abs(Ft)>Number.EPSILON){let I=Math.sqrt(jt),T=Math.sqrt(It*It+O*O),G=ot.x-ft/I,X=ot.y+Y/I,tt=ct.x-O/T,gt=ct.y+It/T,ht=((tt-G)*O-(gt-X)*It)/(Y*O-ft*It);U=G+Y*ht-et.x,mt=X+ft*ht-et.y;let nt=U*U+mt*mt;if(nt<=2)return new vt(U,mt);Ht=Math.sqrt(nt/2)}else{let I=!1;Y>Number.EPSILON?It>Number.EPSILON&&(I=!0):Y<-Number.EPSILON?It<-Number.EPSILON&&(I=!0):Math.sign(ft)===Math.sign(O)&&(I=!0),I?(U=-ft,mt=Y,Ht=Math.sqrt(jt)):(U=Y,mt=ft,Ht=Math.sqrt(jt/2))}return new vt(U/Ht,mt/Ht)}let W=[];for(let et=0,ot=F.length,ct=ot-1,U=et+1;et<ot;et++,ct++,U++)ct===ot&&(ct=0),U===ot&&(U=0),W[et]=$(F[et],F[ct],F[U]);let D=[],Q,Ct=W.concat();for(let et=0,ot=L;et<ot;et++){let ct=R[et];Q=[];for(let U=0,mt=ct.length,Ht=mt-1,Y=U+1;U<mt;U++,Ht++,Y++)Ht===mt&&(Ht=0),Y===mt&&(Y=0),Q[U]=$(ct[U],ct[Ht],ct[Y]);D.push(Q),Ct=Ct.concat(Q)}let yt;if(g===0)yt=zs.triangulateShape(F,R);else{let et=[],ot=[];for(let ct=0;ct<g;ct++){let U=ct/g,mt=d*Math.cos(U*Math.PI/2),Ht=p*Math.sin(U*Math.PI/2)+_;for(let Y=0,ft=F.length;Y<ft;Y++){let It=k(F[Y],W[Y],Ht);dt(It.x,It.y,-mt),U===0&&et.push(It)}for(let Y=0,ft=L;Y<ft;Y++){let It=R[Y];Q=D[Y];let O=[];for(let jt=0,Ft=It.length;jt<Ft;jt++){let I=k(It[jt],Q[jt],Ht);dt(I.x,I.y,-mt),U===0&&O.push(I)}U===0&&ot.push(O)}}yt=zs.triangulateShape(et,ot)}let Bt=yt.length,st=p+_;for(let et=0;et<B;et++){let ot=f?k(A[et],Ct[et],st):A[et];x?(E.copy(w.normals[0]).multiplyScalar(ot.x),M.copy(w.binormals[0]).multiplyScalar(ot.y),y.copy(S[0]).add(E).add(M),dt(y.x,y.y,y.z)):dt(ot.x,ot.y,0)}for(let et=1;et<=h;et++)for(let ot=0;ot<B;ot++){let ct=f?k(A[ot],Ct[ot],st):A[ot];x?(E.copy(w.normals[et]).multiplyScalar(ct.x),M.copy(w.binormals[et]).multiplyScalar(ct.y),y.copy(S[et]).add(E).add(M),dt(y.x,y.y,y.z)):dt(ct.x,ct.y,u/h*et)}for(let et=g-1;et>=0;et--){let ot=et/g,ct=d*Math.cos(ot*Math.PI/2),U=p*Math.sin(ot*Math.PI/2)+_;for(let mt=0,Ht=F.length;mt<Ht;mt++){let Y=k(F[mt],W[mt],U);dt(Y.x,Y.y,u+ct)}for(let mt=0,Ht=R.length;mt<Ht;mt++){let Y=R[mt];Q=D[mt];for(let ft=0,It=Y.length;ft<It;ft++){let O=k(Y[ft],Q[ft],U);x?dt(O.x,O.y+S[h-1].y,S[h-1].x+ct):dt(O.x,O.y,u+ct)}}}bt(),q();function bt(){let et=i.length/3;if(f){let ot=0,ct=B*ot;for(let U=0;U<Bt;U++){let mt=yt[U];zt(mt[2]+ct,mt[1]+ct,mt[0]+ct)}ot=h+g*2,ct=B*ot;for(let U=0;U<Bt;U++){let mt=yt[U];zt(mt[0]+ct,mt[1]+ct,mt[2]+ct)}}else{for(let ot=0;ot<Bt;ot++){let ct=yt[ot];zt(ct[2],ct[1],ct[0])}for(let ot=0;ot<Bt;ot++){let ct=yt[ot];zt(ct[0]+B*h,ct[1]+B*h,ct[2]+B*h)}}n.addGroup(et,i.length/3-et,0)}function q(){let et=i.length/3,ot=0;j(F,ot),ot+=F.length;for(let ct=0,U=R.length;ct<U;ct++){let mt=R[ct];j(mt,ot),ot+=mt.length}n.addGroup(et,i.length/3-et,1)}function j(et,ot){let ct=et.length;for(;--ct>=0;){let U=ct,mt=ct-1;mt<0&&(mt=et.length-1);for(let Ht=0,Y=h+g*2;Ht<Y;Ht++){let ft=B*Ht,It=B*(Ht+1),O=ot+U+ft,jt=ot+mt+ft,Ft=ot+mt+It,I=ot+U+It;xt(O,jt,Ft,I)}}}function dt(et,ot,ct){l.push(et),l.push(ot),l.push(ct)}function zt(et,ot,ct){Ot(et),Ot(ot),Ot(ct);let U=i.length/3,mt=v.generateTopUV(n,i,U-3,U-2,U-1);Nt(mt[0]),Nt(mt[1]),Nt(mt[2])}function xt(et,ot,ct,U){Ot(et),Ot(ot),Ot(U),Ot(ot),Ot(ct),Ot(U);let mt=i.length/3,Ht=v.generateSideWallUV(n,i,mt-6,mt-3,mt-2,mt-1);Nt(Ht[0]),Nt(Ht[1]),Nt(Ht[3]),Nt(Ht[1]),Nt(Ht[2]),Nt(Ht[3])}function Ot(et){i.push(l[et*3+0]),i.push(l[et*3+1]),i.push(l[et*3+2])}function Nt(et){s.push(et.x),s.push(et.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return IS(e,n,t)}static fromJSON(t,e){let n=[];for(let s=0,o=t.shapes.length;s<o;s++){let a=e[t.shapes[s]];n.push(a)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new Nh[i.type]().fromJSON(i)),new r(n,t.options)}},PS={generateTopUV:function(r,t,e,n,i){let s=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[i*3],h=t[i*3+1];return[new vt(s,o),new vt(a,l),new vt(c,h)]},generateSideWallUV:function(r,t,e,n,i,s){let o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],u=t[n*3+2],f=t[i*3],d=t[i*3+1],p=t[i*3+2],_=t[s*3],g=t[s*3+1],m=t[s*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new vt(o,1-l),new vt(c,1-u),new vt(f,1-p),new vt(_,1-m)]:[new vt(a,1-l),new vt(h,1-u),new vt(d,1-p),new vt(g,1-m)]}};function IS(r,t,e){if(e.shapes=[],Array.isArray(r))for(let n=0,i=r.length;n<i;n++){let s=r[n];e.shapes.push(s.uuid)}else e.shapes.push(r.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var Bi=class r extends Qe{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};let s=t/2,o=e/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,u=t/a,f=e/l,d=[],p=[],_=[],g=[];for(let m=0;m<h;m++){let v=m*f-o;for(let S=0;S<c;S++){let x=S*u-s;p.push(x,-v,0),_.push(0,0,1),g.push(S/a),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let v=0;v<a;v++){let S=v+c*m,x=v+c*(m+1),w=v+1+c*(m+1),M=v+1+c*m;d.push(S,x,M),d.push(x,w,M)}this.setIndex(d),this.setAttribute("position",new xe(p,3)),this.setAttribute("normal",new xe(_,3)),this.setAttribute("uv",new xe(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.width,t.height,t.widthSegments,t.heightSegments)}};var Cl=class r extends Qe{constructor(t=1,e=32,n=16,i=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:s,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new z,f=new z,d=[],p=[],_=[],g=[];for(let m=0;m<=n;m++){let v=[],S=m/n,x=o+S*a,w=t*Math.cos(x),M=Math.sqrt(t*t-w*w),E=0;m===0&&o===0?E=.5/e:m===n&&l===Math.PI&&(E=-.5/e);for(let y=0;y<=e;y++){let b=y/e,A=i+b*s;u.x=-M*Math.cos(A),u.y=w,u.z=M*Math.sin(A),p.push(u.x,u.y,u.z),f.copy(u).normalize(),_.push(f.x,f.y,f.z),g.push(b+E,1-S),v.push(c++)}h.push(v)}for(let m=0;m<n;m++)for(let v=0;v<e;v++){let S=h[m][v+1],x=h[m][v],w=h[m+1][v],M=h[m+1][v+1];(m!==0||o>0)&&d.push(S,x,M),(m!==n-1||l<Math.PI)&&d.push(x,w,M)}this.setIndex(d),this.setAttribute("position",new xe(p,3)),this.setAttribute("normal",new xe(_,3)),this.setAttribute("uv",new xe(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Rl=class r extends Qe{constructor(t=1,e=.4,n=12,i=48,s=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:s,thetaStart:o,thetaLength:a},n=Math.floor(n),i=Math.floor(i);let l=[],c=[],h=[],u=[],f=new z,d=new z,p=new z;for(let _=0;_<=n;_++){let g=o+_/n*a;for(let m=0;m<=i;m++){let v=m/i*s;d.x=(t+e*Math.cos(g))*Math.cos(v),d.y=(t+e*Math.cos(g))*Math.sin(v),d.z=e*Math.sin(g),c.push(d.x,d.y,d.z),f.x=t*Math.cos(v),f.y=t*Math.sin(v),p.subVectors(d,f).normalize(),h.push(p.x,p.y,p.z),u.push(m/i),u.push(_/n)}}for(let _=1;_<=n;_++)for(let g=1;g<=i;g++){let m=(i+1)*_+g-1,v=(i+1)*(_-1)+g-1,S=(i+1)*(_-1)+g,x=(i+1)*_+g;l.push(m,v,x),l.push(v,S,x)}this.setIndex(l),this.setAttribute("position",new xe(c,3)),this.setAttribute("normal",new xe(h,3)),this.setAttribute("uv",new xe(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}},Pl=class r extends Qe{constructor(t=1,e=.4,n=64,i=8,s=2,o=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:t,tube:e,tubularSegments:n,radialSegments:i,p:s,q:o},n=Math.floor(n),i=Math.floor(i);let a=[],l=[],c=[],h=[],u=new z,f=new z,d=new z,p=new z,_=new z,g=new z,m=new z;for(let S=0;S<=n;++S){let x=S/n*s*Math.PI*2;v(x,s,o,t,d),v(x+.01,s,o,t,p),g.subVectors(p,d),m.addVectors(p,d),_.crossVectors(g,m),m.crossVectors(_,g),_.normalize(),m.normalize();for(let w=0;w<=i;++w){let M=w/i*Math.PI*2,E=-e*Math.cos(M),y=e*Math.sin(M);u.x=d.x+(E*m.x+y*_.x),u.y=d.y+(E*m.y+y*_.y),u.z=d.z+(E*m.z+y*_.z),l.push(u.x,u.y,u.z),f.subVectors(u,d).normalize(),c.push(f.x,f.y,f.z),h.push(S/n),h.push(w/i)}}for(let S=1;S<=n;S++)for(let x=1;x<=i;x++){let w=(i+1)*(S-1)+(x-1),M=(i+1)*S+(x-1),E=(i+1)*S+x,y=(i+1)*(S-1)+x;a.push(w,M,y),a.push(M,E,y)}this.setIndex(a),this.setAttribute("position",new xe(l,3)),this.setAttribute("normal",new xe(c,3)),this.setAttribute("uv",new xe(h,2));function v(S,x,w,M,E){let y=Math.cos(S),b=Math.sin(S),A=w/x*S,R=Math.cos(A);E.x=M*(2+R)*.5*y,E.y=M*(2+R)*b*.5,E.z=M*Math.sin(A)*.5}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.radius,t.tube,t.tubularSegments,t.radialSegments,t.p,t.q)}},Il=class r extends Qe{constructor(t=new Ml(new z(-1,-1,0),new z(-1,1,0),new z(1,1,0)),e=64,n=1,i=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:i,closed:s};let o=t.computeFrenetFrames(e,s);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new z,l=new z,c=new vt,h=new z,u=[],f=[],d=[],p=[];_(),this.setIndex(p),this.setAttribute("position",new xe(u,3)),this.setAttribute("normal",new xe(f,3)),this.setAttribute("uv",new xe(d,2));function _(){for(let S=0;S<e;S++)g(S);g(s===!1?e:0),v(),m()}function g(S){h=t.getPointAt(S/e,h);let x=o.normals[S],w=o.binormals[S];for(let M=0;M<=i;M++){let E=M/i*Math.PI*2,y=Math.sin(E),b=-Math.cos(E);l.x=b*x.x+y*w.x,l.y=b*x.y+y*w.y,l.z=b*x.z+y*w.z,l.normalize(),f.push(l.x,l.y,l.z),a.x=h.x+n*l.x,a.y=h.y+n*l.y,a.z=h.z+n*l.z,u.push(a.x,a.y,a.z)}}function m(){for(let S=1;S<=e;S++)for(let x=1;x<=i;x++){let w=(i+1)*(S-1)+(x-1),M=(i+1)*S+(x-1),E=(i+1)*S+x,y=(i+1)*(S-1)+x;p.push(w,M,y),p.push(M,E,y)}}function v(){for(let S=0;S<=e;S++)for(let x=0;x<=i;x++)c.x=S/e,c.y=x/i,d.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new r(new Nh[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}};function qs(r){let t={};for(let e in r){t[e]={};for(let n in r[e]){let i=r[e][n];if(gg(i))i.isRenderTargetTexture?(Qt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone();else if(Array.isArray(i))if(gg(i[0])){let s=[];for(let o=0,a=i.length;o<a;o++)s[o]=i[o].clone();t[e][n]=s}else t[e][n]=i.slice();else t[e][n]=i}}return t}function kn(r){let t={};for(let e=0;e<r.length;e++){let n=qs(r[e]);for(let i in n)t[i]=n[i]}return t}function gg(r){return r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)}function DS(r){let t=[];for(let e=0;e<r.length;e++)t.push(r[e].clone());return t}function gp(r){let t=r.getRenderTarget();return t===null?r.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:pe.workingColorSpace}var u_={clone:qs,merge:kn},LS=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,NS=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,wn=class extends Or{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=LS,this.fragmentShader=NS,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=qs(t.uniforms),this.uniformsGroups=DS(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let i in this.uniforms){let o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let n in t.uniforms){let i=t.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=e[i.value]||null;break;case"c":this.uniforms[n].value=new ee().setHex(i.value);break;case"v2":this.uniforms[n].value=new vt().fromArray(i.value);break;case"v3":this.uniforms[n].value=new z().fromArray(i.value);break;case"v4":this.uniforms[n].value=new ve().fromArray(i.value);break;case"m3":this.uniforms[n].value=new ie().fromArray(i.value);break;case"m4":this.uniforms[n].value=new Ue().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},Oh=class extends wn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},as=class extends Or{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ee(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ee(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Uu,this.normalScale=new vt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fr,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},ti=class extends as{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new vt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ce(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ee(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ee(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ee(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var Uh=class extends Or{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Yg,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Bh=class extends Or{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function Bo(r,t){return!r||r.constructor===t?r:typeof t.BYTES_PER_ELEMENT=="number"?new t(r):Array.prototype.slice.call(r)}function Nd(r){return r!==void 0&&r.inTangents!==void 0&&r.outTangents!==void 0}var ls=class{constructor(t,e,n,i){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,i=e[n],s=e[n-1];n:{t:{let o;e:{i:if(!(t<i)){for(let a=n+2;;){if(i===void 0){if(t<s)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(s=i,i=e[++n],t<i)break t}o=e.length;break e}if(!(t>=s)){let a=e[1];t<a&&(n=2,s=a);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=s,s=e[--n-1],t>=s)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(i=e[n],s=e[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,t,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=t*i;for(let o=0;o!==i;++o)e[o]=n[s+o];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},kh=class extends ls{constructor(t,e,n,i){super(t,e,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ud,endingEnd:Ud}}intervalChanged_(t,e,n){let i=this.parameterPositions,s=t-2,o=t+1,a=i[s],l=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case Bd:s=t,a=2*e-n;break;case kd:s=i.length-2,a=e+i[s]-i[s+1];break;default:s=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Bd:o=t,l=2*n-e;break;case kd:o=1,l=n+i[1]-i[0];break;default:o=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=s*h,this._offsetNext=o*h}interpolate_(t,e,n,i){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,d=this._weightNext,p=(n-e)/(i-e),_=p*p,g=_*p,m=-f*g+2*f*_-f*p,v=(1+f)*g+(-1.5-2*f)*_+(-.5+f)*p+1,S=(-1-d)*g+(1.5+d)*_+.5*p,x=d*g-d*_;for(let w=0;w!==a;++w)s[w]=m*o[h+w]+v*o[c+w]+S*o[l+w]+x*o[u+w];return s}},zh=class extends ls{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(i-e),u=1-h;for(let f=0;f!==a;++f)s[f]=o[c+f]*u+o[l+f]*h;return s}},Vh=class extends ls{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t){return this.copySampleValue_(t-1)}},Hh=class extends ls{interpolate_(t,e,n,i){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this.inTangents,u=this.outTangents;if(!h||!u){let p=(n-e)/(i-e),_=1-p;for(let g=0;g!==a;++g)s[g]=o[c+g]*_+o[l+g]*p;return s}let f=a*2,d=t-1;for(let p=0;p!==a;++p){let _=o[c+p],g=o[l+p],m=d*f+p*2,v=u[m],S=u[m+1],x=t*f+p*2,w=h[x],M=h[x+1],E=OS(n,e,v,w,i);s[p]=f_(E,_,S,M,g)}return s}};function f_(r,t,e,n,i){let s=1-r;return s*s*s*t+3*s*s*r*e+3*s*r*r*n+r*r*r*i}function FS(r,t,e,n,i){let s=1-r;return 3*s*s*(e-t)+6*s*r*(n-e)+3*r*r*(i-n)}function OS(r,t,e,n,i){let s=(r-t)/(i-t);for(let o=0;o<8;o++){let a=f_(s,t,e,n,i)-r;if(Math.abs(a)<1e-10)break;let l=FS(s,t,e,n,i);if(Math.abs(l)<1e-10)break;s=Math.max(0,Math.min(1,s-a/l))}return s}var bi=class{constructor(t,e,n,i){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Bo(e,this.TimeBufferType),this.values=Bo(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Bo(t.times,Array),values:Bo(t.values,Array)};let i=t.getInterpolation();i!==t.DefaultInterpolation&&(n.interpolation=i),Nd(t.settings)&&(n.settings={inTangents:Bo(t.settings.inTangents,Array),outTangents:Bo(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Vh(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new zh(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new kh(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new Hh(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case sl:e=this.InterpolantFactoryMethodDiscrete;break;case wh:e=this.InterpolantFactoryMethodLinear;break;case ph:e=this.InterpolantFactoryMethodSmooth;break;case Od:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Qt("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return sl;case this.InterpolantFactoryMethodLinear:return wh;case this.InterpolantFactoryMethodSmooth:return ph;case this.InterpolantFactoryMethodBezier:return Od}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]*=t;Nd(this.settings)&&(_g(this.settings.inTangents,t),_g(this.settings.outTangents,t))}return this}trim(t,e){let n=this.times,i=n.length,s=0,o=i-1;for(;s!==i&&n[s]<t;)++s;for(;o!==-1&&n[o]>e;)--o;if(++o,s!==0||o!==i){s>=o&&(o=Math.max(o,1),s=o-1);let a=this.getValueSize();this.times=n.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(te("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,i=this.values,s=n.length;s===0&&(te("KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==s;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){te("KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){te("KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(i!==void 0&&Ty(i))for(let a=0,l=i.length;a!==l;++a){let c=i[a];if(isNaN(c)){te("KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===ph,s=t.length-1,o=1;for(let a=1;a<s;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(i)l=!0;else{let u=a*n,f=u-n,d=u+n;for(let p=0;p!==n;++p){let _=e[u+p];if(_!==e[f+p]||_!==e[d+p]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let u=a*n,f=o*n;for(let d=0;d!==n;++d)e[f+d]=e[u+d]}++o}}if(s>0){t[o]=t[s];for(let a=s*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,i=new n(this.name,t,e);return i.createInterpolant=this.createInterpolant,Nd(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}};function _g(r,t){for(let e=0,n=r.length;e!==n;e+=2)r[e]*=t}bi.prototype.ValueTypeName="";bi.prototype.TimeBufferType=Float32Array;bi.prototype.ValueBufferType=Float32Array;bi.prototype.DefaultInterpolation=wh;var cs=class extends bi{constructor(t,e,n){super(t,e,n)}};cs.prototype.ValueTypeName="bool";cs.prototype.ValueBufferType=Array;cs.prototype.DefaultInterpolation=sl;cs.prototype.InterpolantFactoryMethodLinear=void 0;cs.prototype.InterpolantFactoryMethodSmooth=void 0;var Gh=class extends bi{constructor(t,e,n,i){super(t,e,n,i)}};Gh.prototype.ValueTypeName="color";var Wh=class extends bi{constructor(t,e,n,i){super(t,e,n,i)}};Wh.prototype.ValueTypeName="number";var Xh=class extends ls{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(i-e),c=t*a;for(let h=c+a;c!==h;c+=4)dr.slerpFlat(s,0,o,c-a,o,c,l);return s}},Dl=class extends bi{constructor(t,e,n,i){super(t,e,n,i)}InterpolantFactoryMethodLinear(t){return new Xh(this.times,this.values,this.getValueSize(),t)}};Dl.prototype.ValueTypeName="quaternion";Dl.prototype.InterpolantFactoryMethodSmooth=void 0;var hs=class extends bi{constructor(t,e,n){super(t,e,n)}};hs.prototype.ValueTypeName="string";hs.prototype.ValueBufferType=Array;hs.prototype.DefaultInterpolation=sl;hs.prototype.InterpolantFactoryMethodLinear=void 0;hs.prototype.InterpolantFactoryMethodSmooth=void 0;var Yh=class extends bi{constructor(t,e,n,i){super(t,e,n,i)}};Yh.prototype.ValueTypeName="vector";var qh=class{constructor(t,e,n){let i=this,s=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(h){a++,s===!1&&i.onStart!==void 0&&i.onStart(h,o,a),s=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=c.length;u<f;u+=2){let d=c[u],p=c[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},d_=new qh,Zh=class{constructor(t){this.manager=t!==void 0?t:d_,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(i,s){n.load(t,i,e,s)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};Zh.DEFAULT_MATERIAL_NAME="__DEFAULT";var Ll=class extends bn{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ee(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},Nl=class extends Ll{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(bn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ee(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},Fd=new Ue,xg=new z,vg=new z,Jh=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new vt(512,512),this.mapType=Bn,this.map=null,this.mapPass=null,this.matrix=new Ue,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ko,this._frameExtents=new vt(1,1),this._viewportCount=1,this._viewports=[new ve(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;xg.setFromMatrixPosition(t.matrixWorld),e.position.copy(xg),vg.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(vg),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,i){Fd.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(Fd,t.coordinateSystem,t.reversedDepth);let s=this._frameExtents,o=i?i.z/s.x:1,a=i?i.w/s.y:1,l=i?i.x/s.x:0,c=i?i.y/s.y:0;t.coordinateSystem===Go||t.reversedDepth?e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),e.multiply(Fd)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},fh=new z,dh=new dr,cr=new z,Fl=class extends bn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ue,this.projectionMatrix=new Ue,this.projectionMatrixInverse=new Ue,this.coordinateSystem=Zi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(fh,dh,cr),cr.x===1&&cr.y===1&&cr.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(fh,dh,cr.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(fh,dh,cr),cr.x===1&&cr.y===1&&cr.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(fh,dh,cr.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},is=new z,yg=new vt,Sg=new vt,Un=class extends Fl{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Xo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(el*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Xo*2*Math.atan(Math.tan(el*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){is.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(is.x,is.y).multiplyScalar(-t/is.z),is.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(is.x,is.y).multiplyScalar(-t/is.z)}getViewSize(t,e){return this.getViewBounds(t,yg,Sg),e.subVectors(Sg,yg)}setViewOffset(t,e,n,i,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(el*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,s=-.5*i,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*i/l,e-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(s+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var na=class extends Fl{constructor(t=-1,e=1,n=1,i=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,s=n-t,o=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Gd=class extends Jh{constructor(){super(new na(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ol=class extends Ll{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(bn.DEFAULT_UP),this.updateMatrix(),this.target=new bn,this.shadow=new Gd}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var ko=-90,zo=1,$h=class extends bn{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new Un(ko,zo,t,e);i.layers=this.layers,this.add(i);let s=new Un(ko,zo,t,e);s.layers=this.layers,this.add(s);let o=new Un(ko,zo,t,e);o.layers=this.layers,this.add(o);let a=new Un(ko,zo,t,e);a.layers=this.layers,this.add(a);let l=new Un(ko,zo,t,e);l.layers=this.layers,this.add(l);let c=new Un(ko,zo,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,i,s,o,a,l]=e;for(let c of e)this.remove(c);if(t===Zi)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Go)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[s,o,a,l,c,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;t.isWebGLRenderer===!0?g=t.state.buffers.depth.getReversed():g=t.reversedDepthBuffer,t.setRenderTarget(n,0,i),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,s),t.setRenderTarget(n,1,i),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,2,i),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,3,i),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,i),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,i),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(u,f,d),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Kh=class extends Un{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var _p="\\[\\]\\.:\\/",US=new RegExp("["+_p+"]","g"),xp="[^"+_p+"]",BS="[^"+_p.replace("\\.","")+"]",kS=/((?:WC+[\/:])*)/.source.replace("WC",xp),zS=/(WCOD+)?/.source.replace("WCOD",BS),VS=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",xp),HS=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",xp),GS=new RegExp("^"+kS+zS+VS+HS+"$"),WS=["material","materials","bones","map"],Wd=class{constructor(t,e,n){let i=n||Oe.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,i)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},Oe=class r{constructor(t,e,n){this.path=e,this.parsedPath=n||r.parseTrackName(e),this.node=r.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new r.Composite(t,e,n):new r(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(US,"")}static parseTrackName(t){let e=GS.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let s=n.nodeName.substring(i+1);WS.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(s){for(let o=0;o<s.length;o++){let a=s[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},i=n(t.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)t[e++]=n[i]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,i=e.propertyName,s=e.propertyIndex;if(t||(t=r.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Qt("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){te("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){te("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){te("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){te("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){te("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){te("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){te("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[i];if(o===void 0){let c=e.nodeName;te("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!t.geometry){te("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){te("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[s]!==void 0&&(s=t.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Oe.Composite=Wd;Oe.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Oe.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Oe.prototype.GetterByBindingType=[Oe.prototype._getValue_direct,Oe.prototype._getValue_array,Oe.prototype._getValue_arrayElement,Oe.prototype._getValue_toArray];Oe.prototype.SetterByBindingTypeAndVersioning=[[Oe.prototype._setValue_direct,Oe.prototype._setValue_direct_setNeedsUpdate,Oe.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Oe.prototype._setValue_array,Oe.prototype._setValue_array_setNeedsUpdate,Oe.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Oe.prototype._setValue_arrayElement,Oe.prototype._setValue_arrayElement_setNeedsUpdate,Oe.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Oe.prototype._setValue_fromArray,Oe.prototype._setValue_fromArray_setNeedsUpdate,Oe.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var AE=new Float32Array(1);var Xd=class r{static{r.prototype.isMatrix2=!0}constructor(t,e,n,i){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,i){let s=this.elements;return s[0]=t,s[2]=e,s[1]=n,s[3]=i,this}};function vp(r,t,e,n){let i=XS(n);switch(e){case cp:return r*t;case Hl:return r*t/i.components*i.byteLength;case ru:return r*t/i.components*i.byteLength;case ms:return r*t*2/i.components*i.byteLength;case su:return r*t*2/i.components*i.byteLength;case hp:return r*t*3/i.components*i.byteLength;case zi:return r*t*4/i.components*i.byteLength;case ou:return r*t*4/i.components*i.byteLength;case Gl:case Wl:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case Xl:case Yl:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case lu:case hu:return Math.max(r,16)*Math.max(t,8)/4;case au:case cu:return Math.max(r,8)*Math.max(t,8)/2;case uu:case fu:case pu:case mu:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case du:case ql:case gu:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case _u:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case xu:return Math.floor((r+4)/5)*Math.floor((t+3)/4)*16;case vu:return Math.floor((r+4)/5)*Math.floor((t+4)/5)*16;case yu:return Math.floor((r+5)/6)*Math.floor((t+4)/5)*16;case Su:return Math.floor((r+5)/6)*Math.floor((t+5)/6)*16;case Mu:return Math.floor((r+7)/8)*Math.floor((t+4)/5)*16;case bu:return Math.floor((r+7)/8)*Math.floor((t+5)/6)*16;case wu:return Math.floor((r+7)/8)*Math.floor((t+7)/8)*16;case Tu:return Math.floor((r+9)/10)*Math.floor((t+4)/5)*16;case Eu:return Math.floor((r+9)/10)*Math.floor((t+5)/6)*16;case Au:return Math.floor((r+9)/10)*Math.floor((t+7)/8)*16;case Cu:return Math.floor((r+9)/10)*Math.floor((t+9)/10)*16;case Ru:return Math.floor((r+11)/12)*Math.floor((t+9)/10)*16;case Pu:return Math.floor((r+11)/12)*Math.floor((t+11)/12)*16;case Iu:case Du:case Lu:return Math.ceil(r/4)*Math.ceil(t/4)*16;case Nu:case Fu:return Math.ceil(r/4)*Math.ceil(t/4)*8;case Zl:case Ou:return Math.ceil(r/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function XS(r){switch(r){case Bn:case sp:return{byteLength:1,components:1};case sa:case op:case Qi:return{byteLength:2,components:1};case nu:case iu:return{byteLength:2,components:4};case Ki:case eu:case ji:return{byteLength:4,components:1};case ap:case lp:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Qt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function F_(){let r=null,t=!1,e=null,n=null;function i(s,o){n=r.requestAnimationFrame(i),e(s,o)}return{start:function(){t!==!0&&e!==null&&r!==null&&(n=r.requestAnimationFrame(i),t=!0)},stop:function(){r!==null&&r.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){r=s}}}function qS(r){let t=new WeakMap;function e(a,l){let c=a.array,h=a.usage,u=c.byteLength,f=r.createBuffer();r.bindBuffer(l,f),r.bufferData(l,c,h),a.onUploadCallback();let d;if(c instanceof Float32Array)d=r.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=r.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=r.HALF_FLOAT:d=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=r.SHORT;else if(c instanceof Uint32Array)d=r.UNSIGNED_INT;else if(c instanceof Int32Array)d=r.INT;else if(c instanceof Int8Array)d=r.BYTE;else if(c instanceof Uint8Array)d=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){let h=l.array,u=l.updateRanges;if(r.bindBuffer(c,a),u.length===0)r.bufferSubData(c,0,h);else{u.sort((d,p)=>d.start-p.start);let f=0;for(let d=1;d<u.length;d++){let p=u[f],_=u[d];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++f,u[f]=_)}u.length=f+1;for(let d=0,p=u.length;d<p;d++){let _=u[d];r.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(r.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:s,update:o}}var ZS=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,JS=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,$S=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,KS=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,jS=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,QS=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,tM=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,eM=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,nM=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,iM=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,rM=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,sM=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,oM=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,aM=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,lM=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,cM=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,hM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,uM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,fM=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,dM=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,pM=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,mM=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,gM=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,_M=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,xM=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,vM=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,yM=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,SM=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,MM=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,bM=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,wM="gl_FragColor = linearToOutputTexel( gl_FragColor );",TM=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,EM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,AM=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,CM=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,RM=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,PM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,IM=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,DM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,LM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,NM=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,FM=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,OM=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,UM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,BM=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,kM=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,zM=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,VM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,HM=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,GM=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,WM=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,XM=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,YM=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,qM=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,ZM=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,JM=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,$M=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,KM=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,jM=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,QM=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,tb=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,eb=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,nb=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ib=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,rb=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,sb=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ob=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ab=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,lb=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,cb=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,hb=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,ub=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,fb=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,db=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,pb=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,mb=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,gb=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,_b=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,xb=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,vb=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,yb=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Sb=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Mb=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,bb=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,wb=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Tb=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Eb=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ab=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Cb=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Rb=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Pb=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Ib=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Db=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Lb=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Nb=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Fb=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Ob=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ub=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Bb=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,kb=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,zb=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Vb=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Hb=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Gb=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Wb=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Xb=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Yb=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,qb=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Zb=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Jb=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$b=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Kb=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jb=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Qb=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,t1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,e1=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,n1=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,i1=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,r1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,s1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,o1=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,a1=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,l1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,c1=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,h1=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,u1=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,f1=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,d1=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,p1=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,m1=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,g1=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_1=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,x1=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,v1=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,y1=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,S1=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,M1=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,b1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,w1=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,T1=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,E1=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,A1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,oe={alphahash_fragment:ZS,alphahash_pars_fragment:JS,alphamap_fragment:$S,alphamap_pars_fragment:KS,alphatest_fragment:jS,alphatest_pars_fragment:QS,aomap_fragment:tM,aomap_pars_fragment:eM,batching_pars_vertex:nM,batching_vertex:iM,begin_vertex:rM,beginnormal_vertex:sM,bsdfs:oM,iridescence_fragment:aM,bumpmap_pars_fragment:lM,clipping_planes_fragment:cM,clipping_planes_pars_fragment:hM,clipping_planes_pars_vertex:uM,clipping_planes_vertex:fM,color_fragment:dM,color_pars_fragment:pM,color_pars_vertex:mM,color_vertex:gM,common:_M,cube_uv_reflection_fragment:xM,defaultnormal_vertex:vM,displacementmap_pars_vertex:yM,displacementmap_vertex:SM,emissivemap_fragment:MM,emissivemap_pars_fragment:bM,colorspace_fragment:wM,colorspace_pars_fragment:TM,envmap_fragment:EM,envmap_common_pars_fragment:AM,envmap_pars_fragment:CM,envmap_pars_vertex:RM,envmap_physical_pars_fragment:zM,envmap_vertex:PM,fog_vertex:IM,fog_pars_vertex:DM,fog_fragment:LM,fog_pars_fragment:NM,gradientmap_pars_fragment:FM,lightmap_pars_fragment:OM,lights_lambert_fragment:UM,lights_lambert_pars_fragment:BM,lights_pars_begin:kM,lights_toon_fragment:VM,lights_toon_pars_fragment:HM,lights_phong_fragment:GM,lights_phong_pars_fragment:WM,lights_physical_fragment:XM,lights_physical_pars_fragment:YM,lights_fragment_begin:qM,lights_fragment_maps:ZM,lights_fragment_end:JM,lightprobes_pars_fragment:$M,logdepthbuf_fragment:KM,logdepthbuf_pars_fragment:jM,logdepthbuf_pars_vertex:QM,logdepthbuf_vertex:tb,map_fragment:eb,map_pars_fragment:nb,map_particle_fragment:ib,map_particle_pars_fragment:rb,metalnessmap_fragment:sb,metalnessmap_pars_fragment:ob,morphinstance_vertex:ab,morphcolor_vertex:lb,morphnormal_vertex:cb,morphtarget_pars_vertex:hb,morphtarget_vertex:ub,normal_fragment_begin:fb,normal_fragment_maps:db,normal_pars_fragment:pb,normal_pars_vertex:mb,normal_vertex:gb,normalmap_pars_fragment:_b,clearcoat_normal_fragment_begin:xb,clearcoat_normal_fragment_maps:vb,clearcoat_pars_fragment:yb,iridescence_pars_fragment:Sb,opaque_fragment:Mb,packing:bb,premultiplied_alpha_fragment:wb,project_vertex:Tb,dithering_fragment:Eb,dithering_pars_fragment:Ab,roughnessmap_fragment:Cb,roughnessmap_pars_fragment:Rb,shadowmap_pars_fragment:Pb,shadowmap_pars_vertex:Ib,shadowmap_vertex:Db,shadowmask_pars_fragment:Lb,skinbase_vertex:Nb,skinning_pars_vertex:Fb,skinning_vertex:Ob,skinnormal_vertex:Ub,specularmap_fragment:Bb,specularmap_pars_fragment:kb,tonemapping_fragment:zb,tonemapping_pars_fragment:Vb,transmission_fragment:Hb,transmission_pars_fragment:Gb,uv_pars_fragment:Wb,uv_pars_vertex:Xb,uv_vertex:Yb,worldpos_vertex:qb,background_vert:Zb,background_frag:Jb,backgroundCube_vert:$b,backgroundCube_frag:Kb,cube_vert:jb,cube_frag:Qb,depth_vert:t1,depth_frag:e1,distance_vert:n1,distance_frag:i1,equirect_vert:r1,equirect_frag:s1,linedashed_vert:o1,linedashed_frag:a1,meshbasic_vert:l1,meshbasic_frag:c1,meshlambert_vert:h1,meshlambert_frag:u1,meshmatcap_vert:f1,meshmatcap_frag:d1,meshnormal_vert:p1,meshnormal_frag:m1,meshphong_vert:g1,meshphong_frag:_1,meshphysical_vert:x1,meshphysical_frag:v1,meshtoon_vert:y1,meshtoon_frag:S1,points_vert:M1,points_frag:b1,shadow_vert:w1,shadow_frag:T1,sprite_vert:E1,sprite_frag:A1},Dt={common:{diffuse:{value:new ee(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ie},alphaMap:{value:null},alphaMapTransform:{value:new ie},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ie}},envmap:{envMap:{value:null},envMapRotation:{value:new ie},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ie}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ie}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ie},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ie},normalScale:{value:new vt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ie},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ie}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ie}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ie}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ee(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new z},probesMax:{value:new z},probesResolution:{value:new z}},points:{diffuse:{value:new ee(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ie},alphaTest:{value:0},uvTransform:{value:new ie}},sprite:{diffuse:{value:new ee(16777215)},opacity:{value:1},center:{value:new vt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ie},alphaMap:{value:null},alphaMapTransform:{value:new ie},alphaTest:{value:0}}},gr={basic:{uniforms:kn([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.fog]),vertexShader:oe.meshbasic_vert,fragmentShader:oe.meshbasic_frag},lambert:{uniforms:kn([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,Dt.lights,{emissive:{value:new ee(0)},envMapIntensity:{value:1}}]),vertexShader:oe.meshlambert_vert,fragmentShader:oe.meshlambert_frag},phong:{uniforms:kn([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,Dt.lights,{emissive:{value:new ee(0)},specular:{value:new ee(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:oe.meshphong_vert,fragmentShader:oe.meshphong_frag},standard:{uniforms:kn([Dt.common,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.roughnessmap,Dt.metalnessmap,Dt.fog,Dt.lights,{emissive:{value:new ee(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:oe.meshphysical_vert,fragmentShader:oe.meshphysical_frag},toon:{uniforms:kn([Dt.common,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.gradientmap,Dt.fog,Dt.lights,{emissive:{value:new ee(0)}}]),vertexShader:oe.meshtoon_vert,fragmentShader:oe.meshtoon_frag},matcap:{uniforms:kn([Dt.common,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,{matcap:{value:null}}]),vertexShader:oe.meshmatcap_vert,fragmentShader:oe.meshmatcap_frag},points:{uniforms:kn([Dt.points,Dt.fog]),vertexShader:oe.points_vert,fragmentShader:oe.points_frag},dashed:{uniforms:kn([Dt.common,Dt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:oe.linedashed_vert,fragmentShader:oe.linedashed_frag},depth:{uniforms:kn([Dt.common,Dt.displacementmap]),vertexShader:oe.depth_vert,fragmentShader:oe.depth_frag},normal:{uniforms:kn([Dt.common,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,{opacity:{value:1}}]),vertexShader:oe.meshnormal_vert,fragmentShader:oe.meshnormal_frag},sprite:{uniforms:kn([Dt.sprite,Dt.fog]),vertexShader:oe.sprite_vert,fragmentShader:oe.sprite_frag},background:{uniforms:{uvTransform:{value:new ie},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:oe.background_vert,fragmentShader:oe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ie}},vertexShader:oe.backgroundCube_vert,fragmentShader:oe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:oe.cube_vert,fragmentShader:oe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:oe.equirect_vert,fragmentShader:oe.equirect_frag},distance:{uniforms:kn([Dt.common,Dt.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:oe.distance_vert,fragmentShader:oe.distance_frag},shadow:{uniforms:kn([Dt.lights,Dt.fog,{color:{value:new ee(0)},opacity:{value:1}}]),vertexShader:oe.shadow_vert,fragmentShader:oe.shadow_frag}};gr.physical={uniforms:kn([gr.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ie},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ie},clearcoatNormalScale:{value:new vt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ie},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ie},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ie},sheen:{value:0},sheenColor:{value:new ee(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ie},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ie},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ie},transmissionSamplerSize:{value:new vt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ie},attenuationDistance:{value:0},attenuationColor:{value:new ee(0)},specularColor:{value:new ee(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ie},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ie},anisotropyVector:{value:new vt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ie}}]),vertexShader:oe.meshphysical_vert,fragmentShader:oe.meshphysical_frag};var zu={r:0,b:0,g:0},C1=new Ue,O_=new ie;O_.set(-1,0,0,0,1,0,0,0,1);function R1(r,t,e,n,i,s){let o=new ee(0),a=i===!0?0:1,l,c,h=null,u=0,f=null;function d(v){let S=v.isScene===!0?v.background:null;if(S&&S.isTexture){let x=v.backgroundBlurriness>0;S=t.get(S,x)}return S}function p(v){let S=!1,x=d(v);x===null?g(o,a):x&&x.isColor&&(g(x,1),S=!0);let w=r.xr.getEnvironmentBlendMode();w==="additive"?e.buffers.color.setClear(0,0,0,1,s):w==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,s),(r.autoClear||S)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function _(v,S){let x=d(S);x&&(x.isCubeTexture||x.mapping===zl)?(c===void 0&&(c=new de(new Ji(1,1,1),new wn({name:"BackgroundCubeMaterial",uniforms:qs(gr.backgroundCube.uniforms),vertexShader:gr.backgroundCube.vertexShader,fragmentShader:gr.backgroundCube.fragmentShader,side:Tn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(w,M,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=x,c.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(C1.makeRotationFromEuler(S.backgroundRotation)).transpose(),x.isCubeTexture&&x.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(O_),c.material.toneMapped=pe.getTransfer(x.colorSpace)!==Me,(h!==x||u!==x.version||f!==r.toneMapping)&&(c.material.needsUpdate=!0,h=x,u=x.version,f=r.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new de(new Bi(2,2),new wn({name:"BackgroundMaterial",uniforms:qs(gr.background.uniforms),vertexShader:gr.background.vertexShader,fragmentShader:gr.background.fragmentShader,side:us,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=pe.getTransfer(x.colorSpace)!==Me,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(h!==x||u!==x.version||f!==r.toneMapping)&&(l.material.needsUpdate=!0,h=x,u=x.version,f=r.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function g(v,S){v.getRGB(zu,gp(r)),e.buffers.color.setClear(zu.r,zu.g,zu.b,S,s)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(v,S=1){o.set(v),a=S,g(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(v){a=v,g(o,a)},render:p,addToRenderList:_,dispose:m}}function P1(r,t){let e=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=f(null),s=i,o=!1;function a(R,P,N,L,F){let k=!1,B=u(R,L,N,P);s!==B&&(s=B,c(s.object)),k=d(R,L,N,F),k&&p(R,L,N,F),F!==null&&t.update(F,r.ELEMENT_ARRAY_BUFFER),(k||o)&&(o=!1,x(R,P,N,L),F!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t.get(F).buffer))}function l(){return r.createVertexArray()}function c(R){return r.bindVertexArray(R)}function h(R){return r.deleteVertexArray(R)}function u(R,P,N,L){let F=L.wireframe===!0,k=n[P.id];k===void 0&&(k={},n[P.id]=k);let B=R.isInstancedMesh===!0?R.id:0,$=k[B];$===void 0&&($={},k[B]=$);let W=$[N.id];W===void 0&&(W={},$[N.id]=W);let D=W[F];return D===void 0&&(D=f(l()),W[F]=D),D}function f(R){let P=[],N=[],L=[];for(let F=0;F<e;F++)P[F]=0,N[F]=0,L[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:N,attributeDivisors:L,object:R,attributes:{},index:null}}function d(R,P,N,L){let F=s.attributes,k=P.attributes,B=0,$=N.getAttributes();for(let W in $)if($[W].location>=0){let Q=F[W],Ct=k[W];if(Ct===void 0&&(W==="instanceMatrix"&&R.instanceMatrix&&(Ct=R.instanceMatrix),W==="instanceColor"&&R.instanceColor&&(Ct=R.instanceColor)),Q===void 0||Q.attribute!==Ct||Ct&&Q.data!==Ct.data)return!0;B++}return s.attributesNum!==B||s.index!==L}function p(R,P,N,L){let F={},k=P.attributes,B=0,$=N.getAttributes();for(let W in $)if($[W].location>=0){let Q=k[W];Q===void 0&&(W==="instanceMatrix"&&R.instanceMatrix&&(Q=R.instanceMatrix),W==="instanceColor"&&R.instanceColor&&(Q=R.instanceColor));let Ct={};Ct.attribute=Q,Q&&Q.data&&(Ct.data=Q.data),F[W]=Ct,B++}s.attributes=F,s.attributesNum=B,s.index=L}function _(){let R=s.newAttributes;for(let P=0,N=R.length;P<N;P++)R[P]=0}function g(R){m(R,0)}function m(R,P){let N=s.newAttributes,L=s.enabledAttributes,F=s.attributeDivisors;N[R]=1,L[R]===0&&(r.enableVertexAttribArray(R),L[R]=1),F[R]!==P&&(r.vertexAttribDivisor(R,P),F[R]=P)}function v(){let R=s.newAttributes,P=s.enabledAttributes;for(let N=0,L=P.length;N<L;N++)P[N]!==R[N]&&(r.disableVertexAttribArray(N),P[N]=0)}function S(R,P,N,L,F,k,B){B===!0?r.vertexAttribIPointer(R,P,N,F,k):r.vertexAttribPointer(R,P,N,L,F,k)}function x(R,P,N,L){_();let F=L.attributes,k=N.getAttributes(),B=P.defaultAttributeValues;for(let $ in k){let W=k[$];if(W.location>=0){let D=F[$];if(D===void 0&&($==="instanceMatrix"&&R.instanceMatrix&&(D=R.instanceMatrix),$==="instanceColor"&&R.instanceColor&&(D=R.instanceColor)),D!==void 0){let Q=D.normalized,Ct=D.itemSize,yt=t.get(D);if(yt===void 0)continue;let Bt=yt.buffer,st=yt.type,bt=yt.bytesPerElement,q=st===r.INT||st===r.UNSIGNED_INT||D.gpuType===eu;if(D.isInterleavedBufferAttribute){let j=D.data,dt=j.stride,zt=D.offset;if(j.isInstancedInterleavedBuffer){for(let xt=0;xt<W.locationSize;xt++)m(W.location+xt,j.meshPerAttribute);R.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let xt=0;xt<W.locationSize;xt++)g(W.location+xt);r.bindBuffer(r.ARRAY_BUFFER,Bt);for(let xt=0;xt<W.locationSize;xt++)S(W.location+xt,Ct/W.locationSize,st,Q,dt*bt,(zt+Ct/W.locationSize*xt)*bt,q)}else{if(D.isInstancedBufferAttribute){for(let j=0;j<W.locationSize;j++)m(W.location+j,D.meshPerAttribute);R.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=D.meshPerAttribute*D.count)}else for(let j=0;j<W.locationSize;j++)g(W.location+j);r.bindBuffer(r.ARRAY_BUFFER,Bt);for(let j=0;j<W.locationSize;j++)S(W.location+j,Ct/W.locationSize,st,Q,Ct*bt,Ct/W.locationSize*j*bt,q)}}else if(B!==void 0){let Q=B[$];if(Q!==void 0)switch(Q.length){case 2:r.vertexAttrib2fv(W.location,Q);break;case 3:r.vertexAttrib3fv(W.location,Q);break;case 4:r.vertexAttrib4fv(W.location,Q);break;default:r.vertexAttrib1fv(W.location,Q)}}}}v()}function w(){b();for(let R in n){let P=n[R];for(let N in P){let L=P[N];for(let F in L){let k=L[F];for(let B in k)h(k[B].object),delete k[B];delete L[F]}}delete n[R]}}function M(R){if(n[R.id]===void 0)return;let P=n[R.id];for(let N in P){let L=P[N];for(let F in L){let k=L[F];for(let B in k)h(k[B].object),delete k[B];delete L[F]}}delete n[R.id]}function E(R){for(let P in n){let N=n[P];for(let L in N){let F=N[L];if(F[R.id]===void 0)continue;let k=F[R.id];for(let B in k)h(k[B].object),delete k[B];delete F[R.id]}}}function y(R){for(let P in n){let N=n[P],L=R.isInstancedMesh===!0?R.id:0,F=N[L];if(F!==void 0){for(let k in F){let B=F[k];for(let $ in B)h(B[$].object),delete B[$];delete F[k]}delete N[L],Object.keys(N).length===0&&delete n[P]}}}function b(){A(),o=!0,s!==i&&(s=i,c(s.object))}function A(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:b,resetDefaultState:A,dispose:w,releaseStatesOfGeometry:M,releaseStatesOfObject:y,releaseStatesOfProgram:E,initAttributes:_,enableAttribute:g,disableUnusedAttributes:v}}function I1(r,t,e){let n;function i(l){n=l}function s(l,c){r.drawArrays(n,l,c),e.update(c,n,1)}function o(l,c,h){h!==0&&(r.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function a(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let f=0;for(let d=0;d<h;d++)f+=c[d];e.update(f,n,1)}this.setMode=i,this.render=s,this.renderInstances=o,this.renderMultiDraw=a}function D1(r,t,e,n){let i;function s(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){let E=t.get("EXT_texture_filter_anisotropic");i=r.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(E){return!(E!==zi&&n.convert(E)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(E){let y=E===Qi&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==Bn&&E!==ji&&!y&&n.convert(E)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE))}function l(E){if(E==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(Qt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=e.logarithmicDepthBuffer===!0,f=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&f===!1&&Qt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let d=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),p=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=r.getParameter(r.MAX_TEXTURE_SIZE),g=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),m=r.getParameter(r.MAX_VERTEX_ATTRIBS),v=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),S=r.getParameter(r.MAX_VARYING_VECTORS),x=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),w=r.getParameter(r.MAX_SAMPLES),M=r.getParameter(r.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:v,maxVaryings:S,maxFragmentUniforms:x,maxSamples:w,samples:M}}function L1(r){let t=this,e=null,n=0,i=!1,s=!1,o=new li,a=new ie,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){let d=u.length!==0||f||n!==0||i;return i=f,n=u.length,d},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,d){let p=u.clippingPlanes,_=u.clipIntersection,g=u.clipShadows,m=r.get(u);if(!i||p===null||p.length===0||s&&!g)s?h(null):c();else{let v=s?0:n,S=v*4,x=m.clippingState||null;l.value=x,x=h(p,f,S,d);for(let w=0;w!==S;++w)x[w]=e[w];m.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,f,d,p){let _=u!==null?u.length:0,g=null;if(_!==0){if(g=l.value,p!==!0||g===null){let m=d+_*4,v=f.matrixWorldInverse;a.getNormalMatrix(v),(g===null||g.length<m)&&(g=new Float32Array(m));for(let S=0,x=d;S!==_;++S,x+=4)o.copy(u[S]).applyMatrix4(v,a),o.normal.toArray(g,x),g[x+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,g}}var la=4,N1=6,F1=20,O1=256,Jl=new na,p_=new ee,yp=null,Sp=0,Mp=0,bp=!1,U1=new z,Zs=new z,ha=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,i=100,s={}){let{size:o=256,position:a=U1}=s;yp=this._renderer.getRenderTarget(),Sp=this._renderer.getActiveCubeFace(),Mp=this._renderer.getActiveMipmapLevel(),bp=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,i,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=__(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=g_(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(yp,Sp,Mp),this._renderer.xr.enabled=bp,t.scissorTest=!1,aa(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===fs||t.mapping===Ys?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),yp=this._renderer.getRenderTarget(),Sp=this._renderer.getActiveCubeFace(),Mp=this._renderer.getActiveMipmapLevel(),bp=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Je,minFilter:Je,generateMipmaps:!1,type:Qi,format:zi,colorSpace:ol,depthBuffer:!1},i=m_(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=m_(t,e,n);let{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=B1(s)),this._blurMaterial=z1(s,t,e),this._ggxMaterial=k1(s,t,e)}return i}_compileMaterial(t){let e=new de(new Qe,t);this._renderer.compile(e,Jl)}_sceneToCubeUV(t,e,n,i,s){let l=new Un(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,d=u.toneMapping;u.getClearColor(p_),u.toneMapping=$i,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new de(new Ji,new Fi({name:"PMREM.Background",side:Tn,depthWrite:!1,depthTest:!1})));let _=this._backgroundBox,g=_.material,m=!1,v=t.background;v?v.isColor&&(g.color.copy(v),t.background=null,m=!0):(g.color.copy(p_),m=!0);for(let S=0;S<6;S++){let x=S%3;x===0?(l.up.set(0,c[S],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+h[S],s.y,s.z)):x===1?(l.up.set(0,0,c[S]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+h[S],s.z)):(l.up.set(0,c[S],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+h[S]));let w=this._cubeSize;aa(i,x*w,S>2?w:0,w,w),u.setRenderTarget(i),m&&u.render(_,l),u.render(t,l)}u.toneMapping=d,u.autoClear=f,t.background=v}_textureToCubeUV(t,e){let n=this._renderer,i=t.mapping===fs||t.mapping===Ys;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=__()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=g_());let s=i?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=s;let a=s.uniforms;a.envMap.value=t;let l=this._cubeSize;aa(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Jl)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let i=this._lodMeshes.length;for(let s=1;s<i;s++)this._applyGGXFilter(t,s-1,s);e.autoClear=n}_applyGGXFilter(t,e,n){let i=this._renderer,s=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;let l=o.uniforms,c=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),f=c*1.25,d=u*f,{_lodMax:p}=this,_=this._sizeLods[n],g=3*_*(n>p-la?n-p+la:0),m=4*(this._cubeSize-_);l.envMap.value=t.texture,l.roughness.value=d,l.mipInt.value=p-e,aa(s,g,m,3*_,2*_),i.setRenderTarget(s),i.render(a,Jl),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=p-n,aa(t,g,m,3*_,2*_),i.setRenderTarget(t),i.render(a,Jl)}_blur(t,e,n,i){let s=this._pingPongRenderTarget,o=Math.min(i,Math.PI)/Math.SQRT2;this._blurPass(t,s,e,n,o),this._blurPass(s,t,n,n,o)}_blurPass(t,e,n,i,s){let o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[i];l.material=a;let c=a.uniforms;c.envMap.value=t.texture,c.sigma.value=s,c.mipInt.value=this._lodMax-n;let h=this._sizeLods[i],u=3*h*(i>this._lodMax-la?i-this._lodMax+la:0),f=4*(this._cubeSize-h);aa(e,u,f,3*h,2*h),o.setRenderTarget(e),o.render(l,Jl)}};function B1(r){let t=[],e=[],n=r,i=r-la+1+N1;for(let s=0;s<i;s++){let o=Math.pow(2,n);t.push(o);let a=1/(o-2),l=-a,c=1+a,h=[l,l,c,l,c,c,l,l,c,c,l,c],u=6,f=6,d=3,p=new Float32Array(d*f*u),_=new Float32Array(d*f*u);for(let m=0;m<u;m++){let v=m%3*2/3-1,S=m>2?0:-1,x=[v,S,0,v+2/3,S,0,v+2/3,S+1,0,v,S,0,v+2/3,S+1,0,v,S+1,0];p.set(x,d*f*m);for(let w=0;w<f;w++){let M=h[w*2]*2-1,E=h[w*2+1]*2-1;m===0?Zs.set(1,E,M):m===1?Zs.set(-M,1,-E):m===2?Zs.set(-M,E,1):m===3?Zs.set(-1,E,-M):m===4?Zs.set(-M,-1,E):Zs.set(M,E,-1),Zs.toArray(_,(m*f+w)*d)}}let g=new Qe;g.setAttribute("position",new Si(p,d)),g.setAttribute("outputDirection",new Si(_,d)),e.push(new de(g,null)),n>la&&n--}return{lodMeshes:e,sizeLods:t}}function m_(r,t,e){let n=new ci(r,t,e);return n.texture.mapping=zl,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function aa(r,t,e,n,i){r.viewport.set(t,e,n,i),r.scissor.set(t,e,n,i)}function k1(r,t,e){return new wn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:O1,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Wu(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:pr,depthTest:!1,depthWrite:!1})}function z1(r,t,e){return new wn({name:"SphericalGaussianBlur",defines:{SAMPLES:F1,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Wu(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:pr,depthTest:!1,depthWrite:!1})}function g_(){return new wn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Wu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:pr,depthTest:!1,depthWrite:!1})}function __(){return new wn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Wu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:pr,depthTest:!1,depthWrite:!1})}function Wu(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Hu=class extends ci{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new gl(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Ji(5,5,5),s=new wn({name:"CubemapFromEquirect",uniforms:qs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Tn,blending:pr});s.uniforms.tEquirect.value=e;let o=new de(i,s),a=e.minFilter;return e.minFilter===ds&&(e.minFilter=Je),new $h(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){let s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(s)}};function V1(r){let t=new WeakMap,e=new WeakMap,n=null;function i(f,d=!1){return f==null?null:d?o(f):s(f)}function s(f){if(f&&f.isTexture){let d=f.mapping;if(d===jh||d===Qh)if(t.has(f)){let p=t.get(f).texture;return a(p,f.mapping)}else{let p=f.image;if(p&&p.height>0){let _=new Hu(p.height);return _.fromEquirectangularTexture(r,f),t.set(f,_),f.addEventListener("dispose",c),a(_.texture,f.mapping)}else return null}}return f}function o(f){if(f&&f.isTexture){let d=f.mapping,p=d===jh||d===Qh,_=d===fs||d===Ys;if(p||_){let g=e.get(f),m=g!==void 0?g.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==m)return n===null&&(n=new ha(r)),g=p?n.fromEquirectangular(f,g):n.fromCubemap(f,g),g.texture.pmremVersion=f.pmremVersion,e.set(f,g),g.texture;if(g!==void 0)return g.texture;{let v=f.image;return p&&v&&v.height>0||_&&v&&l(v)?(n===null&&(n=new ha(r)),g=p?n.fromEquirectangular(f):n.fromCubemap(f),g.texture.pmremVersion=f.pmremVersion,e.set(f,g),f.addEventListener("dispose",h),g.texture):null}}}return f}function a(f,d){return d===jh?f.mapping=fs:d===Qh&&(f.mapping=Ys),f}function l(f){let d=0,p=6;for(let _=0;_<p;_++)f[_]!==void 0&&d++;return d===p}function c(f){let d=f.target;d.removeEventListener("dispose",c);let p=t.get(d);p!==void 0&&(t.delete(d),p.dispose())}function h(f){let d=f.target;d.removeEventListener("dispose",h);let p=e.get(d);p!==void 0&&(e.delete(d),p.dispose())}function u(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:u}}function H1(r){let t={};function e(n){if(t[n]!==void 0)return t[n];let i=r.getExtension(n);return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let i=e(n);return i===null&&Vs("WebGLRenderer: "+n+" extension not supported."),i}}}function G1(r,t,e,n){let i={},s=new WeakMap;function o(u){let f=u.target;f.index!==null&&t.remove(f.index);for(let p in f.attributes)t.remove(f.attributes[p]);f.removeEventListener("dispose",o),delete i[f.id];let d=s.get(f);d&&(t.remove(d),s.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(u,f){return i[f.id]===!0||(f.addEventListener("dispose",o),i[f.id]=!0,e.memory.geometries++),f}function l(u){let f=u.attributes;for(let d in f)t.update(f[d],r.ARRAY_BUFFER)}function c(u){let f=[],d=u.index,p=u.attributes.position,_=0;if(p===void 0)return;if(d!==null){let v=d.array;_=d.version;for(let S=0,x=v.length;S<x;S+=3){let w=v[S+0],M=v[S+1],E=v[S+2];f.push(w,M,M,E,E,w)}}else{let v=p.array;_=p.version;for(let S=0,x=v.length/3-1;S<x;S+=3){let w=S+0,M=S+1,E=S+2;f.push(w,M,M,E,E,w)}}let g=new(p.count>=65535?dl:fl)(f,1);g.version=_;let m=s.get(u);m&&t.remove(m),s.set(u,g)}function h(u){let f=s.get(u);if(f){let d=u.index;d!==null&&f.version<d.version&&c(u)}else c(u);return s.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function W1(r,t,e){let n;function i(u){n=u}let s,o;function a(u){s=u.type,o=u.bytesPerElement}function l(u,f){r.drawElements(n,f,s,u*o),e.update(f,n,1)}function c(u,f,d){d!==0&&(r.drawElementsInstanced(n,f,s,u*o,d),e.update(f,n,d))}function h(u,f,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,s,u,0,d);let _=0;for(let g=0;g<d;g++)_+=f[g];e.update(_,n,1)}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function X1(r){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(e.calls++,o){case r.TRIANGLES:e.triangles+=a*(s/3);break;case r.LINES:e.lines+=a*(s/2);break;case r.LINE_STRIP:e.lines+=a*(s-1);break;case r.LINE_LOOP:e.lines+=a*s;break;case r.POINTS:e.points+=a*s;break;default:te("WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function Y1(r,t,e){let n=new WeakMap,i=new ve;function s(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,f=n.get(a);if(f===void 0||f.count!==u){let b=function(){E.dispose(),n.delete(a),a.removeEventListener("dispose",b)};f!==void 0&&f.texture.dispose();let d=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],v=a.morphAttributes.color||[],S=0;d===!0&&(S=1),p===!0&&(S=2),_===!0&&(S=3);let x=a.attributes.position.count*S,w=1;x>t.maxTextureSize&&(w=Math.ceil(x/t.maxTextureSize),x=t.maxTextureSize);let M=new Float32Array(x*w*4*u),E=new hl(M,x,w,u);E.type=ji,E.needsUpdate=!0;let y=S*4;for(let A=0;A<u;A++){let R=g[A],P=m[A],N=v[A],L=x*w*4*A;for(let F=0;F<R.count;F++){let k=F*y;d===!0&&(i.fromBufferAttribute(R,F),M[L+k+0]=i.x,M[L+k+1]=i.y,M[L+k+2]=i.z,M[L+k+3]=0),p===!0&&(i.fromBufferAttribute(P,F),M[L+k+4]=i.x,M[L+k+5]=i.y,M[L+k+6]=i.z,M[L+k+7]=0),_===!0&&(i.fromBufferAttribute(N,F),M[L+k+8]=i.x,M[L+k+9]=i.y,M[L+k+10]=i.z,M[L+k+11]=N.itemSize===4?i.w:1)}}f={count:u,texture:E,size:new vt(x,w)},n.set(a,f),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",o.morphTexture,e);else{let d=0;for(let _=0;_<c.length;_++)d+=c[_];let p=a.morphTargetsRelative?1:1-d;l.getUniforms().setValue(r,"morphTargetBaseInfluence",p),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",f.texture,e),l.getUniforms().setValue(r,"morphTargetsTextureSize",f.size)}return{update:s}}function q1(r,t,e,n,i){let s=new WeakMap;function o(c){let h=i.render.frame,u=c.geometry,f=t.get(c,u);if(s.get(f)!==h&&(t.update(f),s.set(f,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==h&&(e.update(c.instanceMatrix,r.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,r.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){let d=c.skeleton;s.get(d)!==h&&(d.update(),s.set(d,h))}return f}function a(){s=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:o,dispose:a}}var Z1={[jd]:"LINEAR_TONE_MAPPING",[Qd]:"REINHARD_TONE_MAPPING",[tp]:"CINEON_TONE_MAPPING",[ep]:"ACES_FILMIC_TONE_MAPPING",[ip]:"AGX_TONE_MAPPING",[kl]:"NEUTRAL_TONE_MAPPING",[np]:"CUSTOM_TONE_MAPPING"};function J1(r,t,e,n,i,s){let o=new ci(t,e,{type:r,depthBuffer:i,stencilBuffer:s,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=new Qe;c.setAttribute("position",new xe([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new xe([0,2,0,0,2,0],2));let h=new Oh({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new de(c,h),f=new na(-1,1,1,-1,0,1),d=null,p=null,_=!1,g,m=null,v=[],S=!1;this.setSize=function(x,w){o.setSize(x,w),a!==null&&a.setSize(x,w),l!==null&&l.setSize(x,w);for(let M=0;M<v.length;M++){let E=v[M];E.setSize&&E.setSize(x,w)}},this.setEffects=function(x){v=x,S=v.length>0&&v[0].isRenderPass===!0;let w=o.width,M=o.height;v.length>0&&a===null&&(a=new ci(w,M,{type:Qi,depthBuffer:!1,stencilBuffer:!1}),l=new ci(w,M,{type:Qi,depthBuffer:!1,stencilBuffer:!1}));for(let E=0;E<v.length;E++){let y=v[E];y.setSize&&y.setSize(w,M)}},this.begin=function(x,w){if(_||x.toneMapping===$i&&v.length===0)return!1;if(m=w,w!==null){let M=w.width,E=w.height;(o.width!==M||o.height!==E)&&this.setSize(M,E)}return S===!1&&x.setRenderTarget(o),g=x.toneMapping,x.toneMapping=$i,!0},this.hasRenderPass=function(){return S},this.end=function(x,w){x.toneMapping=g,_=!0;let M=o,E=a;for(let y=0;y<v.length;y++){let b=v[y];b.enabled!==!1&&(b.render(x,E,M,w),b.needsSwap!==!1&&(M=E,E=E===a?l:a))}if(d!==x.outputColorSpace||p!==x.toneMapping){d=x.outputColorSpace,p=x.toneMapping,h.defines={},pe.getTransfer(d)===Me&&(h.defines.SRGB_TRANSFER="");let y=Z1[p];y&&(h.defines[y]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=M.texture,x.setRenderTarget(m),x.render(u,f),m=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var U_=new Qn,Ep=new os(1,1),B_=new hl,k_=new Ah,z_=new gl,x_=[],v_=[],y_=new Float32Array(16),S_=new Float32Array(9),M_=new Float32Array(4);function ua(r,t,e){let n=r[0];if(n<=0||n>0)return r;let i=t*e,s=x_[i];if(s===void 0&&(s=new Float32Array(i),x_[i]=s),t!==0){n.toArray(s,0);for(let o=1,a=0;o!==t;++o)a+=e,r[o].toArray(s,a)}return s}function hn(r,t){if(r.length!==t.length)return!1;for(let e=0,n=r.length;e<n;e++)if(r[e]!==t[e])return!1;return!0}function un(r,t){for(let e=0,n=t.length;e<n;e++)r[e]=t[e]}function Xu(r,t){let e=v_[t];e===void 0&&(e=new Int32Array(t),v_[t]=e);for(let n=0;n!==t;++n)e[n]=r.allocateTextureUnit();return e}function $1(r,t){let e=this.cache;e[0]!==t&&(r.uniform1f(this.addr,t),e[0]=t)}function K1(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(hn(e,t))return;r.uniform2fv(this.addr,t),un(e,t)}}function j1(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(r.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(hn(e,t))return;r.uniform3fv(this.addr,t),un(e,t)}}function Q1(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(hn(e,t))return;r.uniform4fv(this.addr,t),un(e,t)}}function tw(r,t){let e=this.cache,n=t.elements;if(n===void 0){if(hn(e,t))return;r.uniformMatrix2fv(this.addr,!1,t),un(e,t)}else{if(hn(e,n))return;M_.set(n),r.uniformMatrix2fv(this.addr,!1,M_),un(e,n)}}function ew(r,t){let e=this.cache,n=t.elements;if(n===void 0){if(hn(e,t))return;r.uniformMatrix3fv(this.addr,!1,t),un(e,t)}else{if(hn(e,n))return;S_.set(n),r.uniformMatrix3fv(this.addr,!1,S_),un(e,n)}}function nw(r,t){let e=this.cache,n=t.elements;if(n===void 0){if(hn(e,t))return;r.uniformMatrix4fv(this.addr,!1,t),un(e,t)}else{if(hn(e,n))return;y_.set(n),r.uniformMatrix4fv(this.addr,!1,y_),un(e,n)}}function iw(r,t){let e=this.cache;e[0]!==t&&(r.uniform1i(this.addr,t),e[0]=t)}function rw(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(hn(e,t))return;r.uniform2iv(this.addr,t),un(e,t)}}function sw(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(hn(e,t))return;r.uniform3iv(this.addr,t),un(e,t)}}function ow(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(hn(e,t))return;r.uniform4iv(this.addr,t),un(e,t)}}function aw(r,t){let e=this.cache;e[0]!==t&&(r.uniform1ui(this.addr,t),e[0]=t)}function lw(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(hn(e,t))return;r.uniform2uiv(this.addr,t),un(e,t)}}function cw(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(hn(e,t))return;r.uniform3uiv(this.addr,t),un(e,t)}}function hw(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(hn(e,t))return;r.uniform4uiv(this.addr,t),un(e,t)}}function uw(r,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(Ep.compareFunction=e.isReversedDepthBuffer()?ku:Bu,s=Ep):s=U_,e.setTexture2D(t||s,i)}function fw(r,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||k_,i)}function dw(r,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||z_,i)}function pw(r,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||B_,i)}function mw(r){switch(r){case 5126:return $1;case 35664:return K1;case 35665:return j1;case 35666:return Q1;case 35674:return tw;case 35675:return ew;case 35676:return nw;case 5124:case 35670:return iw;case 35667:case 35671:return rw;case 35668:case 35672:return sw;case 35669:case 35673:return ow;case 5125:return aw;case 36294:return lw;case 36295:return cw;case 36296:return hw;case 35678:case 36198:case 36298:case 36306:case 35682:return uw;case 35679:case 36299:case 36307:return fw;case 35680:case 36300:case 36308:case 36293:return dw;case 36289:case 36303:case 36311:case 36292:return pw}}function gw(r,t){r.uniform1fv(this.addr,t)}function _w(r,t){let e=ua(t,this.size,2);r.uniform2fv(this.addr,e)}function xw(r,t){let e=ua(t,this.size,3);r.uniform3fv(this.addr,e)}function vw(r,t){let e=ua(t,this.size,4);r.uniform4fv(this.addr,e)}function yw(r,t){let e=ua(t,this.size,4);r.uniformMatrix2fv(this.addr,!1,e)}function Sw(r,t){let e=ua(t,this.size,9);r.uniformMatrix3fv(this.addr,!1,e)}function Mw(r,t){let e=ua(t,this.size,16);r.uniformMatrix4fv(this.addr,!1,e)}function bw(r,t){r.uniform1iv(this.addr,t)}function ww(r,t){r.uniform2iv(this.addr,t)}function Tw(r,t){r.uniform3iv(this.addr,t)}function Ew(r,t){r.uniform4iv(this.addr,t)}function Aw(r,t){r.uniform1uiv(this.addr,t)}function Cw(r,t){r.uniform2uiv(this.addr,t)}function Rw(r,t){r.uniform3uiv(this.addr,t)}function Pw(r,t){r.uniform4uiv(this.addr,t)}function Iw(r,t,e){let n=this.cache,i=t.length,s=Xu(e,i);hn(n,s)||(r.uniform1iv(this.addr,s),un(n,s));let o;this.type===r.SAMPLER_2D_SHADOW?o=Ep:o=U_;for(let a=0;a!==i;++a)e.setTexture2D(t[a]||o,s[a])}function Dw(r,t,e){let n=this.cache,i=t.length,s=Xu(e,i);hn(n,s)||(r.uniform1iv(this.addr,s),un(n,s));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||k_,s[o])}function Lw(r,t,e){let n=this.cache,i=t.length,s=Xu(e,i);hn(n,s)||(r.uniform1iv(this.addr,s),un(n,s));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||z_,s[o])}function Nw(r,t,e){let n=this.cache,i=t.length,s=Xu(e,i);hn(n,s)||(r.uniform1iv(this.addr,s),un(n,s));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||B_,s[o])}function Fw(r){switch(r){case 5126:return gw;case 35664:return _w;case 35665:return xw;case 35666:return vw;case 35674:return yw;case 35675:return Sw;case 35676:return Mw;case 5124:case 35670:return bw;case 35667:case 35671:return ww;case 35668:case 35672:return Tw;case 35669:case 35673:return Ew;case 5125:return Aw;case 36294:return Cw;case 36295:return Rw;case 36296:return Pw;case 35678:case 36198:case 36298:case 36306:case 35682:return Iw;case 35679:case 36299:case 36307:return Dw;case 35680:case 36300:case 36308:case 36293:return Lw;case 36289:case 36303:case 36311:case 36292:return Nw}}var Ap=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=mw(e.type)}},Cp=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Fw(e.type)}},Rp=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let i=this.seq;for(let s=0,o=i.length;s!==o;++s){let a=i[s];a.setValue(t,e[a.id],n)}}},wp=/(\w+)(\])?(\[|\.)?/g;function b_(r,t){r.seq.push(t),r.map[t.id]=t}function Ow(r,t,e){let n=r.name,i=n.length;for(wp.lastIndex=0;;){let s=wp.exec(n),o=wp.lastIndex,a=s[1],l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){b_(e,c===void 0?new Ap(a,r,t):new Cp(a,r,t));break}else{let u=e.map[a];u===void 0&&(u=new Rp(a),b_(e,u)),e=u}}}var ca=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);Ow(a,l,this)}let i=[],s=[];for(let o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?i.push(o):s.push(o);i.length>0&&(this.seq=i.concat(s))}setValue(t,e,n,i){let s=this.map[e];s!==void 0&&s.setValue(t,n,i)}setOptional(t,e,n){let i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let s=0,o=e.length;s!==o;++s){let a=e[s],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){let n=[];for(let i=0,s=t.length;i!==s;++i){let o=t[i];o.id in e&&n.push(o)}return n}};function w_(r,t,e){let n=r.createShader(t);return r.shaderSource(n,e),r.compileShader(n),n}var Uw=37297,Bw=0;function kw(r,t){let e=r.split(`
`),n=[],i=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=i;o<s;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var T_=new ie;function zw(r){pe._getMatrix(T_,pe.workingColorSpace,r);let t=`mat3( ${T_.elements.map(e=>e.toFixed(4))} )`;switch(pe.getTransfer(r)){case al:return[t,"LinearTransferOETF"];case Me:return[t,"sRGBTransferOETF"];default:return Qt("WebGLProgram: Unsupported color space: ",r),[t,"LinearTransferOETF"]}}function E_(r,t,e){let n=r.getShaderParameter(t,r.COMPILE_STATUS),s=(r.getShaderInfoLog(t)||"").trim();if(n&&s==="")return"";let o=/ERROR: 0:(\d+)/.exec(s);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+s+`

`+kw(r.getShaderSource(t),a)}else return s}function Vw(r,t){let e=zw(t);return[`vec4 ${r}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var Hw={[jd]:"Linear",[Qd]:"Reinhard",[tp]:"Cineon",[ep]:"ACESFilmic",[ip]:"AgX",[kl]:"Neutral",[np]:"Custom"};function Gw(r,t){let e=Hw[t];return e===void 0?(Qt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+r+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+r+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var Vu=new z;function Ww(){pe.getLuminanceCoefficients(Vu);let r=Vu.x.toFixed(4),t=Vu.y.toFixed(4),e=Vu.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Xw(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Kl).join(`
`)}function Yw(r){let t=[];for(let e in r){let n=r[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function qw(r,t){let e={},n=r.getProgramParameter(t,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let s=r.getActiveAttrib(t,i),o=s.name,a=1;s.type===r.FLOAT_MAT2&&(a=2),s.type===r.FLOAT_MAT3&&(a=3),s.type===r.FLOAT_MAT4&&(a=4),e[o]={type:s.type,location:r.getAttribLocation(t,o),locationSize:a}}return e}function Kl(r){return r!==""}function A_(r,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return r.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function C_(r,t){return r.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Zw=/^[ \t]*#include +<([\w\d./]+)>/gm;function Pp(r){return r.replace(Zw,$w)}var Jw=new Map;function $w(r,t){let e=oe[t];if(e===void 0){let n=Jw.get(t);if(n!==void 0)e=oe[n],Qt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Pp(e)}var Kw=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function R_(r){return r.replace(Kw,jw)}function jw(r,t,e,n){let i="";for(let s=parseInt(t);s<parseInt(e);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function P_(r){let t=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?t+=`
#define HIGH_PRECISION`:r.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var Qw={[Ul]:"SHADOWMAP_TYPE_PCF",[ia]:"SHADOWMAP_TYPE_VSM"};function tT(r){return Qw[r.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var eT={[fs]:"ENVMAP_TYPE_CUBE",[Ys]:"ENVMAP_TYPE_CUBE",[zl]:"ENVMAP_TYPE_CUBE_UV"};function nT(r){return r.envMap===!1?"ENVMAP_TYPE_CUBE":eT[r.envMapMode]||"ENVMAP_TYPE_CUBE"}var iT={[Ys]:"ENVMAP_MODE_REFRACTION"};function rT(r){return r.envMap===!1?"ENVMAP_MODE_REFLECTION":iT[r.envMapMode]||"ENVMAP_MODE_REFLECTION"}var sT={[Kd]:"ENVMAP_BLENDING_MULTIPLY",[Gg]:"ENVMAP_BLENDING_MIX",[Wg]:"ENVMAP_BLENDING_ADD"};function oT(r){return r.envMap===!1?"ENVMAP_BLENDING_NONE":sT[r.combine]||"ENVMAP_BLENDING_NONE"}function aT(r){let t=r.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function lT(r,t,e,n){let i=r.getContext(),s=e.defines,o=e.vertexShader,a=e.fragmentShader,l=tT(e),c=nT(e),h=rT(e),u=oT(e),f=aT(e),d=Xw(e),p=Yw(s),_=i.createProgram(),g,m,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Kl).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Kl).join(`
`),m.length>0&&(m+=`
`)):(g=[P_(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Kl).join(`
`),m=[P_(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==$i?"#define TONE_MAPPING":"",e.toneMapping!==$i?oe.tonemapping_pars_fragment:"",e.toneMapping!==$i?Gw("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",oe.colorspace_pars_fragment,Vw("linearToOutputTexel",e.outputColorSpace),Ww(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Kl).join(`
`)),o=Pp(o),o=A_(o,e),o=C_(o,e),a=Pp(a),a=A_(a,e),a=C_(a,e),o=R_(o),a=R_(a),e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",e.glslVersion===fp?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===fp?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let S=v+g+o,x=v+m+a,w=w_(i,i.VERTEX_SHADER,S),M=w_(i,i.FRAGMENT_SHADER,x);i.attachShader(_,w),i.attachShader(_,M),e.index0AttributeName!==void 0?i.bindAttribLocation(_,0,e.index0AttributeName):e.hasPositionAttribute===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function E(R){if(r.debug.checkShaderErrors){let P=i.getProgramInfoLog(_)||"",N=i.getShaderInfoLog(w)||"",L=i.getShaderInfoLog(M)||"",F=P.trim(),k=N.trim(),B=L.trim(),$=!0,W=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if($=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,_,w,M);else{let D=E_(i,w,"vertex"),Q=E_(i,M,"fragment");te("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+F+`
`+D+`
`+Q)}else F!==""?Qt("WebGLProgram: Program Info Log:",F):(k===""||B==="")&&(W=!1);W&&(R.diagnostics={runnable:$,programLog:F,vertexShader:{log:k,prefix:g},fragmentShader:{log:B,prefix:m}})}i.deleteShader(w),i.deleteShader(M),y=new ca(i,_),b=qw(i,_)}let y;this.getUniforms=function(){return y===void 0&&E(this),y};let b;this.getAttributes=function(){return b===void 0&&E(this),b};let A=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return A===!1&&(A=i.getProgramParameter(_,Uw)),A},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Bw++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=w,this.fragmentShader=M,this}var cT=0,Ip=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){let i=this._getShaderCacheForMaterial(t);return i.has(e)===!1&&(i.add(e),e.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Dp(t),e.set(t,n)),n}},Dp=class{constructor(t){this.id=cT++,this.code=t,this.usedTimes=0}};function hT(r){return r===ms||r===ql||r===Zl}function uT(r,t,e,n,i,s){let o=new ul,a=new Ip,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer,f=n.precision,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(y){return l.add(y),y===0?"uv":`uv${y}`}function _(y,b,A,R,P,N){let L=R.fog,F=P.geometry,k=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?R.environment:null,B=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,$=t.get(y.envMap||k,B),W=$&&$.mapping===zl?$.image.height:null,D=d[y.type];y.precision!==null&&(f=n.getMaxPrecision(y.precision),f!==y.precision&&Qt("WebGLProgram.getParameters:",y.precision,"not supported, using",f,"instead."));let Q=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,Ct=Q!==void 0?Q.length:0,yt=0;F.morphAttributes.position!==void 0&&(yt=1),F.morphAttributes.normal!==void 0&&(yt=2),F.morphAttributes.color!==void 0&&(yt=3);let Bt,st,bt,q;if(D){let Jt=gr[D];Bt=Jt.vertexShader,st=Jt.fragmentShader}else{Bt=y.vertexShader,st=y.fragmentShader;let Jt=a.getVertexShaderStage(y),ut=a.getFragmentShaderStage(y);a.update(y,Jt,ut),bt=Jt.id,q=ut.id}let j=r.getRenderTarget(),dt=r.state.buffers.depth.getReversed(),zt=P.isInstancedMesh===!0,xt=P.isBatchedMesh===!0,Ot=!!y.map,Nt=!!y.matcap,et=!!$,ot=!!y.aoMap,ct=!!y.lightMap,U=!!y.bumpMap&&y.wireframe===!1,mt=!!y.normalMap,Ht=!!y.displacementMap,Y=!!y.emissiveMap,ft=!!y.metalnessMap,It=!!y.roughnessMap,O=y.anisotropy>0,jt=y.clearcoat>0,Ft=y.dispersion>0,I=y.retroreflectivity>0,T=y.iridescence>0,G=y.sheen>0,X=y.transmission>0,tt=O&&!!y.anisotropyMap,gt=jt&&!!y.clearcoatMap,ht=jt&&!!y.clearcoatNormalMap,nt=jt&&!!y.clearcoatRoughnessMap,it=T&&!!y.iridescenceMap,Mt=T&&!!y.iridescenceThicknessMap,Gt=G&&!!y.sheenColorMap,Et=G&&!!y.sheenRoughnessMap,wt=!!y.specularMap,_t=!!y.specularColorMap,qt=!!y.specularIntensityMap,Kt=X&&!!y.transmissionMap,V=X&&!!y.thicknessMap,St=!!y.gradientMap,rt=!!y.alphaMap,At=y.alphaTest>0,Pt=!!y.alphaHash,at=!!y.extensions,pt=$i;y.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(pt=r.toneMapping);let lt={shaderID:D,shaderType:y.type,shaderName:y.name,vertexShader:Bt,fragmentShader:st,defines:y.defines,customVertexShaderID:bt,customFragmentShaderID:q,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:f,batching:xt,batchingColor:xt&&P._colorsTexture!==null,instancing:zt,instancingColor:zt&&P.instanceColor!==null,instancingMorph:zt&&P.morphTexture!==null,outputColorSpace:j===null?r.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:pe.workingColorSpace,alphaToCoverage:!!y.alphaToCoverage,map:Ot,matcap:Nt,envMap:et,envMapMode:et&&$.mapping,envMapCubeUVHeight:W,aoMap:ot,lightMap:ct,bumpMap:U,normalMap:mt,displacementMap:Ht,emissiveMap:Y,normalMapObjectSpace:mt&&y.normalMapType===qg,normalMapTangentSpace:mt&&y.normalMapType===Uu,packedNormalMap:mt&&y.normalMapType===Uu&&hT(y.normalMap.format),metalnessMap:ft,roughnessMap:It,anisotropy:O,anisotropyMap:tt,clearcoat:jt,clearcoatMap:gt,clearcoatNormalMap:ht,clearcoatRoughnessMap:nt,dispersion:Ft,retroreflection:I,iridescence:T,iridescenceMap:it,iridescenceThicknessMap:Mt,sheen:G,sheenColorMap:Gt,sheenRoughnessMap:Et,specularMap:wt,specularColorMap:_t,specularIntensityMap:qt,transmission:X,transmissionMap:Kt,thicknessMap:V,gradientMap:St,opaque:y.transparent===!1&&y.blending===ra&&y.alphaToCoverage===!1,alphaMap:rt,alphaTest:At,alphaHash:Pt,combine:y.combine,mapUv:Ot&&p(y.map.channel),aoMapUv:ot&&p(y.aoMap.channel),lightMapUv:ct&&p(y.lightMap.channel),bumpMapUv:U&&p(y.bumpMap.channel),normalMapUv:mt&&p(y.normalMap.channel),displacementMapUv:Ht&&p(y.displacementMap.channel),emissiveMapUv:Y&&p(y.emissiveMap.channel),metalnessMapUv:ft&&p(y.metalnessMap.channel),roughnessMapUv:It&&p(y.roughnessMap.channel),anisotropyMapUv:tt&&p(y.anisotropyMap.channel),clearcoatMapUv:gt&&p(y.clearcoatMap.channel),clearcoatNormalMapUv:ht&&p(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:nt&&p(y.clearcoatRoughnessMap.channel),iridescenceMapUv:it&&p(y.iridescenceMap.channel),iridescenceThicknessMapUv:Mt&&p(y.iridescenceThicknessMap.channel),sheenColorMapUv:Gt&&p(y.sheenColorMap.channel),sheenRoughnessMapUv:Et&&p(y.sheenRoughnessMap.channel),specularMapUv:wt&&p(y.specularMap.channel),specularColorMapUv:_t&&p(y.specularColorMap.channel),specularIntensityMapUv:qt&&p(y.specularIntensityMap.channel),transmissionMapUv:Kt&&p(y.transmissionMap.channel),thicknessMapUv:V&&p(y.thicknessMap.channel),alphaMapUv:rt&&p(y.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(mt||O),vertexNormals:!!F.attributes.normal,vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:P.isPoints===!0&&!!F.attributes.uv&&(Ot||rt),fog:!!L,useFog:y.fog===!0,fogExp2:!!L&&L.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||F.attributes.normal===void 0&&mt===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:dt,skinning:P.isSkinnedMesh===!0,hasPositionAttribute:F.attributes.position!==void 0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:Ct,morphTextureStride:yt,numSunLights:b.sun.length,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numSunLightShadows:b.sunShadowMap.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numLightProbeGrids:N.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:y.dithering,shadowMapEnabled:r.shadowMap.enabled&&A.length>0,shadowMapType:r.shadowMap.type,toneMapping:pt,decodeVideoTexture:Ot&&y.map.isVideoTexture===!0&&pe.getTransfer(y.map.colorSpace)===Me,decodeVideoTextureEmissive:Y&&y.emissiveMap.isVideoTexture===!0&&pe.getTransfer(y.emissiveMap.colorSpace)===Me,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===ki,flipSided:y.side===Tn,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:at&&y.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(at&&y.extensions.multiDraw===!0||xt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return lt.vertexUv1s=l.has(1),lt.vertexUv2s=l.has(2),lt.vertexUv3s=l.has(3),l.clear(),lt}function g(y){let b=[];if(y.shaderID?b.push(y.shaderID):(b.push(y.customVertexShaderID),b.push(y.customFragmentShaderID)),y.defines!==void 0)for(let A in y.defines)b.push(A),b.push(y.defines[A]);return y.isRawShaderMaterial===!1&&(m(b,y),v(b,y),b.push(r.outputColorSpace)),b.push(y.customProgramCacheKey),b.join()}function m(y,b){y.push(b.precision),y.push(b.outputColorSpace),y.push(b.envMapMode),y.push(b.envMapCubeUVHeight),y.push(b.mapUv),y.push(b.alphaMapUv),y.push(b.lightMapUv),y.push(b.aoMapUv),y.push(b.bumpMapUv),y.push(b.normalMapUv),y.push(b.displacementMapUv),y.push(b.emissiveMapUv),y.push(b.metalnessMapUv),y.push(b.roughnessMapUv),y.push(b.anisotropyMapUv),y.push(b.clearcoatMapUv),y.push(b.clearcoatNormalMapUv),y.push(b.clearcoatRoughnessMapUv),y.push(b.iridescenceMapUv),y.push(b.iridescenceThicknessMapUv),y.push(b.sheenColorMapUv),y.push(b.sheenRoughnessMapUv),y.push(b.specularMapUv),y.push(b.specularColorMapUv),y.push(b.specularIntensityMapUv),y.push(b.transmissionMapUv),y.push(b.thicknessMapUv),y.push(b.combine),y.push(b.fogExp2),y.push(b.sizeAttenuation),y.push(b.morphTargetsCount),y.push(b.morphAttributeCount),y.push(b.numSunLights),y.push(b.numDirLights),y.push(b.numPointLights),y.push(b.numSpotLights),y.push(b.numSpotLightMaps),y.push(b.numHemiLights),y.push(b.numRectAreaLights),y.push(b.numSunLightShadows),y.push(b.numDirLightShadows),y.push(b.numPointLightShadows),y.push(b.numSpotLightShadows),y.push(b.numSpotLightShadowsWithMaps),y.push(b.numLightProbes),y.push(b.shadowMapType),y.push(b.toneMapping),y.push(b.numClippingPlanes),y.push(b.numClipIntersection),y.push(b.depthPacking)}function v(y,b){o.disableAll(),b.instancing&&o.enable(0),b.instancingColor&&o.enable(1),b.instancingMorph&&o.enable(2),b.matcap&&o.enable(3),b.envMap&&o.enable(4),b.normalMapObjectSpace&&o.enable(5),b.normalMapTangentSpace&&o.enable(6),b.clearcoat&&o.enable(7),b.iridescence&&o.enable(8),b.alphaTest&&o.enable(9),b.vertexColors&&o.enable(10),b.vertexAlphas&&o.enable(11),b.vertexUv1s&&o.enable(12),b.vertexUv2s&&o.enable(13),b.vertexUv3s&&o.enable(14),b.vertexTangents&&o.enable(15),b.anisotropy&&o.enable(16),b.alphaHash&&o.enable(17),b.batching&&o.enable(18),b.dispersion&&o.enable(19),b.retroreflection&&o.enable(24),b.batchingColor&&o.enable(20),b.gradientMap&&o.enable(21),b.packedNormalMap&&o.enable(22),b.vertexNormals&&o.enable(23),y.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),b.numLightProbeGrids>0&&o.enable(22),b.hasPositionAttribute&&o.enable(23),y.push(o.mask)}function S(y){let b=d[y.type],A;if(b){let R=gr[b];A=u_.clone(R.uniforms)}else A=y.uniforms;return A}function x(y,b){let A=h.get(b);return A!==void 0?++A.usedTimes:(A=new lT(r,b,y,i),c.push(A),h.set(b,A)),A}function w(y){if(--y.usedTimes===0){let b=c.indexOf(y);c[b]=c[c.length-1],c.pop(),h.delete(y.cacheKey),y.destroy()}}function M(y){a.remove(y)}function E(){a.dispose()}return{getParameters:_,getProgramCacheKey:g,getUniforms:S,acquireProgram:x,releaseProgram:w,releaseShaderCache:M,programs:c,dispose:E}}function fT(){let r=new WeakMap;function t(o){return r.has(o)}function e(o){let a=r.get(o);return a===void 0&&(a={},r.set(o,a)),a}function n(o){r.delete(o)}function i(o,a,l){r.get(o)[a]=l}function s(){r=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:s}}function dT(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.material.id!==t.material.id?r.material.id-t.material.id:r.materialVariant!==t.materialVariant?r.materialVariant-t.materialVariant:r.z!==t.z?r.z-t.z:r.id-t.id}function I_(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.z!==t.z?t.z-r.z:r.id-t.id}function D_(){let r=[],t=0,e=[],n=[],i=[];function s(){t=0,e.length=0,n.length=0,i.length=0}function o(f){let d=0;return f.isInstancedMesh&&(d+=2),f.isSkinnedMesh&&(d+=1),d}function a(f,d,p,_,g,m){let v=r[t];return v===void 0?(v={id:f.id,object:f,geometry:d,material:p,materialVariant:o(f),groupOrder:_,renderOrder:f.renderOrder,z:g,group:m},r[t]=v):(v.id=f.id,v.object=f,v.geometry=d,v.material=p,v.materialVariant=o(f),v.groupOrder=_,v.renderOrder=f.renderOrder,v.z=g,v.group=m),t++,v}function l(f,d,p,_,g,m,v){v.reversedDepth===!0&&(g=-g);let S=a(f,d,p,_,g,m);p.transmission>0?n.push(S):p.transparent===!0?i.push(S):e.push(S)}function c(f,d,p,_,g,m){let v=a(f,d,p,_,g,m);p.transmission>0?n.unshift(v):p.transparent===!0?i.unshift(v):e.unshift(v)}function h(f,d){e.length>1&&e.sort(f||dT),n.length>1&&n.sort(d||I_),i.length>1&&i.sort(d||I_)}function u(){for(let f=t,d=r.length;f<d;f++){let p=r[f];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:i,init:s,push:l,unshift:c,finish:u,sort:h}}function pT(){let r=new WeakMap;function t(n,i){let s=r.get(n),o;return s===void 0?(o=new D_,r.set(n,[o])):i>=s.length?(o=new D_,s.push(o)):o=s[i],o}function e(){r=new WeakMap}return{get:t,dispose:e}}function mT(){let r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new z,color:new ee};break;case"SpotLight":e={position:new z,direction:new z,color:new ee,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new z,color:new ee,distance:0,decay:0};break;case"HemisphereLight":e={direction:new z,skyColor:new ee,groundColor:new ee};break;case"RectAreaLight":e={color:new ee,position:new z,halfWidth:new z,halfHeight:new z};break}return r[t.id]=e,e}}}function gT(){let r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new vt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new vt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new vt,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[t.id]=e,e}}}var _T=0;function xT(r,t){return(t.castShadow?2:0)-(r.castShadow?2:0)+(t.map?1:0)-(r.map?1:0)}function vT(r){let t=new mT,e=gT(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new z);let i=new z,s=new Ue,o=new Ue;function a(c){let h=0,u=0,f=0;for(let P=0;P<9;P++)n.probe[P].set(0,0,0);let d=0,p=0,_=0,g=0,m=0,v=0,S=0,x=0,w=0,M=0,E=0,y=0,b=0,A=0;c.sort(xT);for(let P=0,N=c.length;P<N;P++){let L=c[P],F=L.color,k=L.intensity,B=L.distance,$=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===ms?$=L.shadow.map.texture:$=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)h+=F.r*k,u+=F.g*k,f+=F.b*k;else if(L.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(L.sh.coefficients[W],k);A++}else if(L.isSunLight){let W=t.get(L);if(W.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let D=L.shadow,Q=e.get(L);Q.shadowIntensity=D.intensity,Q.shadowBias=D.bias,Q.shadowNormalBias=D.normalBias,Q.shadowRadius=D.radius,Q.shadowMapSize.copy(D.mapSize).multiply(D.getFrameExtents()),n.sunShadow[p]=Q,n.sunShadowMap[p]=$;let Ct=D.getViewportCount();for(let yt=0;yt<Ct;yt++)n.sunShadowMatrix[_+yt]=D.getMatrix(yt),n.sunShadowCascade[_+yt]=D._cascadeData[yt];_+=Ct,p++}n.sun[d]=W,d++}else if(L.isDirectionalLight){let W=t.get(L);if(W.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let D=L.shadow,Q=e.get(L);Q.shadowIntensity=D.intensity,Q.shadowBias=D.bias,Q.shadowNormalBias=D.normalBias,Q.shadowRadius=D.radius,Q.shadowMapSize=D.mapSize,n.directionalShadow[g]=Q,n.directionalShadowMap[g]=$,n.directionalShadowMatrix[g]=L.shadow.matrix,w++}n.directional[g]=W,g++}else if(L.isSpotLight){let W=t.get(L);W.position.setFromMatrixPosition(L.matrixWorld),W.color.copy(F).multiplyScalar(k),W.distance=B,W.coneCos=Math.cos(L.angle),W.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),W.decay=L.decay,n.spot[v]=W;let D=L.shadow;if(L.map&&(n.spotLightMap[y]=L.map,y++,D.updateMatrices(L),L.castShadow&&b++),n.spotLightMatrix[v]=D.matrix,L.castShadow){let Q=e.get(L);Q.shadowIntensity=D.intensity,Q.shadowBias=D.bias,Q.shadowNormalBias=D.normalBias,Q.shadowRadius=D.radius,Q.shadowMapSize=D.mapSize,n.spotShadow[v]=Q,n.spotShadowMap[v]=$,E++}v++}else if(L.isRectAreaLight){let W=t.get(L);W.color.copy(F).multiplyScalar(k),W.halfWidth.set(L.width*.5,0,0),W.halfHeight.set(0,L.height*.5,0),n.rectArea[S]=W,S++}else if(L.isPointLight){let W=t.get(L);if(W.color.copy(L.color).multiplyScalar(L.intensity),W.distance=L.distance,W.decay=L.decay,L.castShadow){let D=L.shadow,Q=e.get(L);Q.shadowIntensity=D.intensity,Q.shadowBias=D.bias,Q.shadowNormalBias=D.normalBias,Q.shadowRadius=D.radius,Q.shadowMapSize=D.mapSize,Q.shadowCameraNear=D.camera.near,Q.shadowCameraFar=D.camera.far,n.pointShadow[m]=Q,n.pointShadowMap[m]=$,n.pointShadowMatrix[m]=L.shadow.matrix,M++}n.point[m]=W,m++}else if(L.isHemisphereLight){let W=t.get(L);W.skyColor.copy(L.color).multiplyScalar(k),W.groundColor.copy(L.groundColor).multiplyScalar(k),n.hemi[x]=W,x++}}S>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Dt.LTC_FLOAT_1,n.rectAreaLTC2=Dt.LTC_FLOAT_2):(n.rectAreaLTC1=Dt.LTC_HALF_1,n.rectAreaLTC2=Dt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;let R=n.hash;(R.sunLength!==d||R.directionalLength!==g||R.pointLength!==m||R.spotLength!==v||R.rectAreaLength!==S||R.hemiLength!==x||R.numSunShadows!==p||R.numDirectionalShadows!==w||R.numPointShadows!==M||R.numSpotShadows!==E||R.numSpotMaps!==y||R.numLightProbes!==A)&&(n.sun.length=d,n.directional.length=g,n.spot.length=v,n.rectArea.length=S,n.point.length=m,n.hemi.length=x,n.sunShadow.length=p,n.sunShadowMap.length=p,n.sunShadowMatrix.length=_,n.sunShadowCascade.length=_,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.directionalShadowMatrix.length=w,n.pointShadow.length=M,n.pointShadowMap.length=M,n.pointShadowMatrix.length=M,n.spotShadow.length=E,n.spotShadowMap.length=E,n.spotLightMatrix.length=E+y-b,n.spotLightMap.length=y,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=A,R.sunLength=d,R.directionalLength=g,R.pointLength=m,R.spotLength=v,R.rectAreaLength=S,R.hemiLength=x,R.numSunShadows=p,R.numDirectionalShadows=w,R.numPointShadows=M,R.numSpotShadows=E,R.numSpotMaps=y,R.numLightProbes=A,n.version=_T++)}function l(c,h){let u=0,f=0,d=0,p=0,_=0,g=0,m=h.matrixWorldInverse;for(let v=0,S=c.length;v<S;v++){let x=c[v];if(x.isSunLight){let w=n.sun[u];w.direction.setFromMatrixPosition(x.matrixWorld),w.direction.transformDirection(m),u++}else if(x.isDirectionalLight){let w=n.directional[f];w.direction.setFromMatrixPosition(x.matrixWorld),i.setFromMatrixPosition(x.target.matrixWorld),w.direction.sub(i),w.direction.transformDirection(m),f++}else if(x.isSpotLight){let w=n.spot[p];w.position.setFromMatrixPosition(x.matrixWorld),w.position.applyMatrix4(m),w.direction.setFromMatrixPosition(x.matrixWorld),i.setFromMatrixPosition(x.target.matrixWorld),w.direction.sub(i),w.direction.transformDirection(m),p++}else if(x.isRectAreaLight){let w=n.rectArea[_];w.position.setFromMatrixPosition(x.matrixWorld),w.position.applyMatrix4(m),o.identity(),s.copy(x.matrixWorld),s.premultiply(m),o.extractRotation(s),w.halfWidth.set(x.width*.5,0,0),w.halfHeight.set(0,x.height*.5,0),w.halfWidth.applyMatrix4(o),w.halfHeight.applyMatrix4(o),_++}else if(x.isPointLight){let w=n.point[d];w.position.setFromMatrixPosition(x.matrixWorld),w.position.applyMatrix4(m),d++}else if(x.isHemisphereLight){let w=n.hemi[g];w.direction.setFromMatrixPosition(x.matrixWorld),w.direction.transformDirection(m),g++}}}return{setup:a,setupView:l,state:n}}function L_(r){let t=new vT(r),e=[],n=[],i=[];function s(f){u.camera=f,e.length=0,n.length=0,i.length=0}function o(f){e.push(f)}function a(f){n.push(f)}function l(f){i.push(f)}function c(){t.setup(e)}function h(f){t.setupView(e,f)}let u={lightsArray:e,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:u,setupLights:c,setupLightsView:h,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function yT(r){let t=new WeakMap;function e(i,s=0){let o=t.get(i),a;return o===void 0?(a=new L_(r),t.set(i,[a])):s>=o.length?(a=new L_(r),o.push(a)):a=o[s],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var ST=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,MT=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,bT=[new z(1,0,0),new z(-1,0,0),new z(0,1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1)],wT=[new z(0,-1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1),new z(0,-1,0),new z(0,-1,0)],N_=new Ue,$l=new z,Tp=new z;function TT(r,t,e){let n=new Ko,i=new vt,s=new vt,o=new ve,a=new Uh,l=new Bh,c={},h=e.maxTextureSize,u={[us]:Tn,[Tn]:us,[ki]:ki},f=new wn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new vt},radius:{value:4}},vertexShader:ST,fragmentShader:MT}),d=f.clone();d.defines.HORIZONTAL_PASS=1;let p=new Qe;p.setAttribute("position",new Si(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new de(p,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ul;let m=this.type;this.render=function(M,E,y){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||M.length===0)return;this.type===wg&&(Qt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Ul);let b=r.getRenderTarget(),A=r.getActiveCubeFace(),R=r.getActiveMipmapLevel(),P=r.state;P.setBlending(pr),P.buffers.depth.getReversed()===!0?P.buffers.color.setClear(0,0,0,0):P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);let N=m!==this.type;N&&E.traverse(function(L){L.material&&(Array.isArray(L.material)?L.material.forEach(F=>F.needsUpdate=!0):L.material.needsUpdate=!0)});for(let L=0,F=M.length;L<F;L++){let k=M[L],B=k.shadow;if(B===void 0){Qt("WebGLShadowMap:",k,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;i.copy(B.mapSize);let $=B.getFrameExtents();i.multiply($),s.copy(B.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(s.x=Math.floor(h/$.x),i.x=s.x*$.x,B.mapSize.x=s.x),i.y>h&&(s.y=Math.floor(h/$.y),i.y=s.y*$.y,B.mapSize.y=s.y));let W=r.state.buffers.depth.getReversed();if(B.camera._reversedDepth=W,B.map===null||N===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===ia){if(k.isPointLight){Qt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new ci(i.x,i.y,{format:ms,type:Qi,minFilter:Je,magFilter:Je,generateMipmaps:!1}),B.map.texture.name=k.name+".shadowMap",B.map.depthTexture=new os(i.x,i.y,ji),B.map.depthTexture.name=k.name+".shadowMapDepth",B.map.depthTexture.format=ur,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=xn,B.map.depthTexture.magFilter=xn}else k.isPointLight?(B.map=new Hu(i.x),B.map.depthTexture=new Ph(i.x,Ki)):(B.map=new ci(i.x,i.y),B.map.depthTexture=new os(i.x,i.y,Ki)),B.map.depthTexture.name=k.name+".shadowMap",B.map.depthTexture.format=ur,this.type===Ul?(B.map.depthTexture.compareFunction=W?ku:Bu,B.map.depthTexture.minFilter=Je,B.map.depthTexture.magFilter=Je):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=xn,B.map.depthTexture.magFilter=xn);B.camera.updateProjectionMatrix()}B.map.isWebGLCubeRenderTarget!==!0&&(B.map.width!==i.x||B.map.height!==i.y)&&B.map.setSize(i.x,i.y);let D=B.map.isWebGLCubeRenderTarget?6:B.getViewportCount();k.isPointLight!==!0&&B.updateMatrices(k,y);for(let Q=0;Q<D;Q++){let Ct=B.getCamera(Q);if(k.isPointLight){let yt=B.camera,Bt=B.matrix,st=k.distance||yt.far;st!==yt.far&&(yt.far=st,yt.updateProjectionMatrix()),$l.setFromMatrixPosition(k.matrixWorld),yt.position.copy($l),Tp.copy(yt.position),Tp.add(bT[Q]),yt.up.copy(wT[Q]),yt.lookAt(Tp),yt.updateMatrixWorld(),Bt.makeTranslation(-$l.x,-$l.y,-$l.z),N_.multiplyMatrices(yt.projectionMatrix,yt.matrixWorldInverse),B._frustum.setFromProjectionMatrix(N_,yt.coordinateSystem,yt.reversedDepth)}if(B.map.isWebGLCubeRenderTarget)r.setRenderTarget(B.map,Q),r.clear();else{Q===0&&(r.setRenderTarget(B.map),r.clear());let yt=B.getViewport(Q);o.set(s.x*yt.x,s.y*yt.y,s.x*yt.z,s.y*yt.w),P.viewport(o)}n=B.getFrustum(Q),x(E,y,Ct,k,this.type)}B.isPointLightShadow!==!0&&this.type===ia&&v(B,y),B.needsUpdate=!1}m=this.type,g.needsUpdate=!1,r.setRenderTarget(b,A,R)};function v(M,E){let y=t.update(_);f.defines.VSM_SAMPLES!==M.blurSamples&&(f.defines.VSM_SAMPLES=M.blurSamples,d.defines.VSM_SAMPLES=M.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),M.mapPass===null?M.mapPass=new ci(i.x,i.y,{format:ms,type:Qi}):(M.mapPass.width!==M.map.width||M.mapPass.height!==M.map.height)&&M.mapPass.setSize(M.map.width,M.map.height),f.uniforms.shadow_pass.value=M.map.depthTexture,f.uniforms.resolution.value.set(M.map.width,M.map.height),f.uniforms.radius.value=M.radius,r.setRenderTarget(M.mapPass),r.clear(),r.renderBufferDirect(E,null,y,f,_,null),d.uniforms.shadow_pass.value=M.mapPass.texture,d.uniforms.resolution.value.set(M.map.width,M.map.height),d.uniforms.radius.value=M.radius,r.setRenderTarget(M.map),r.clear(),r.renderBufferDirect(E,null,y,d,_,null)}function S(M,E,y,b){let A=null,R=y.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(R!==void 0)A=R;else if(A=y.isPointLight===!0?l:a,r.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0||E.alphaToCoverage===!0){let P=A.uuid,N=E.uuid,L=c[P];L===void 0&&(L={},c[P]=L);let F=L[N];F===void 0&&(F=A.clone(),L[N]=F,E.addEventListener("dispose",w)),A=F}if(A.visible=E.visible,A.wireframe=E.wireframe,b===ia?A.side=E.shadowSide!==null?E.shadowSide:E.side:A.side=E.shadowSide!==null?E.shadowSide:u[E.side],A.alphaMap=E.alphaMap,A.alphaTest=E.alphaToCoverage===!0?.5:E.alphaTest,A.map=E.map,A.clipShadows=E.clipShadows,A.clippingPlanes=E.clippingPlanes,A.clipIntersection=E.clipIntersection,A.displacementMap=E.displacementMap,A.displacementScale=E.displacementScale,A.displacementBias=E.displacementBias,A.wireframeLinewidth=E.wireframeLinewidth,A.linewidth=E.linewidth,y.isPointLight===!0&&A.isMeshDistanceMaterial===!0){let P=r.properties.get(A);P.light=y}return A}function x(M,E,y,b,A){if(M.visible===!1)return;if(M.layers.test(E.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&A===ia)&&(!M.frustumCulled||M.intersectsFrustum(n))){M.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,M.matrixWorld);let N=t.update(M),L=M.material;if(Array.isArray(L)){let F=N.groups;for(let k=0,B=F.length;k<B;k++){let $=F[k],W=L[$.materialIndex];if(W&&W.visible){let D=S(M,W,b,A);M.onBeforeShadow(r,M,E,y,N,D,$),r.renderBufferDirect(y,null,N,D,M,$),M.onAfterShadow(r,M,E,y,N,D,$)}}}else if(L.visible){let F=S(M,L,b,A);M.onBeforeShadow(r,M,E,y,N,F,null),r.renderBufferDirect(y,null,N,F,M,null),M.onAfterShadow(r,M,E,y,N,F,null)}}let P=M.children;for(let N=0,L=P.length;N<L;N++)x(P[N],E,y,b,A)}function w(M){M.target.removeEventListener("dispose",w);for(let y in c){let b=c[y],A=M.target.uuid;A in b&&(b[A].dispose(),delete b[A])}}}function ET(r,t){function e(){let V=!1,St=new ve,rt=null,At=new ve(0,0,0,0);return{setMask:function(Pt){rt!==Pt&&!V&&(r.colorMask(Pt,Pt,Pt,Pt),rt=Pt)},setLocked:function(Pt){V=Pt},setClear:function(Pt,at,pt,lt,Jt){Jt===!0&&(Pt*=lt,at*=lt,pt*=lt),St.set(Pt,at,pt,lt),At.equals(St)===!1&&(r.clearColor(Pt,at,pt,lt),At.copy(St))},reset:function(){V=!1,rt=null,At.set(-1,0,0,0)}}}function n(){let V=!1,St=!1,rt=null,At=null,Pt=null;return{setReversed:function(at){if(St!==at){let pt=t.get("EXT_clip_control");at?pt.clipControlEXT(pt.LOWER_LEFT_EXT,pt.ZERO_TO_ONE_EXT):pt.clipControlEXT(pt.LOWER_LEFT_EXT,pt.NEGATIVE_ONE_TO_ONE_EXT),St=at;let lt=Pt;Pt=null,this.setClear(lt)}},getReversed:function(){return St},setTest:function(at){at?j(r.DEPTH_TEST):dt(r.DEPTH_TEST)},setMask:function(at){rt!==at&&!V&&(r.depthMask(at),rt=at)},setFunc:function(at){if(St&&(at=r_[at]),At!==at){switch(at){case gh:r.depthFunc(r.NEVER);break;case _h:r.depthFunc(r.ALWAYS);break;case xh:r.depthFunc(r.LESS);break;case Ho:r.depthFunc(r.LEQUAL);break;case vh:r.depthFunc(r.EQUAL);break;case yh:r.depthFunc(r.GEQUAL);break;case Sh:r.depthFunc(r.GREATER);break;case Mh:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}At=at}},setLocked:function(at){V=at},setClear:function(at){Pt!==at&&(Pt=at,St&&(at=1-at),r.clearDepth(at))},reset:function(){V=!1,rt=null,At=null,Pt=null,St=!1}}}function i(){let V=!1,St=null,rt=null,At=null,Pt=null,at=null,pt=null,lt=null,Jt=null;return{setTest:function(ut){V||(ut?j(r.STENCIL_TEST):dt(r.STENCIL_TEST))},setMask:function(ut){St!==ut&&!V&&(r.stencilMask(ut),St=ut)},setFunc:function(ut,$t,Wt){(rt!==ut||At!==$t||Pt!==Wt)&&(r.stencilFunc(ut,$t,Wt),rt=ut,At=$t,Pt=Wt)},setOp:function(ut,$t,Wt){(at!==ut||pt!==$t||lt!==Wt)&&(r.stencilOp(ut,$t,Wt),at=ut,pt=$t,lt=Wt)},setLocked:function(ut){V=ut},setClear:function(ut){Jt!==ut&&(r.clearStencil(ut),Jt=ut)},reset:function(){V=!1,St=null,rt=null,At=null,Pt=null,at=null,pt=null,lt=null,Jt=null}}}let s=new e,o=new n,a=new i,l=new WeakMap,c=new WeakMap,h={},u={},f={},d=new WeakMap,p=[],_=null,g=!1,m=null,v=null,S=null,x=null,w=null,M=null,E=null,y=new ee(0,0,0),b=0,A=!1,R=null,P=null,N=null,L=null,F=null,k=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS),B=!1,$=0,W=r.getParameter(r.VERSION);W.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(W)[1]),B=$>=1):W.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),B=$>=2);let D=null,Q={},Ct=r.getParameter(r.SCISSOR_BOX),yt=r.getParameter(r.VIEWPORT),Bt=new ve().fromArray(Ct),st=new ve().fromArray(yt);function bt(V,St,rt,At){let Pt=new Uint8Array(4),at=r.createTexture();r.bindTexture(V,at),r.texParameteri(V,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(V,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let pt=0;pt<rt;pt++)V===r.TEXTURE_3D||V===r.TEXTURE_2D_ARRAY?r.texImage3D(St,0,r.RGBA,1,1,At,0,r.RGBA,r.UNSIGNED_BYTE,Pt):r.texImage2D(St+pt,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Pt);return at}let q={};q[r.TEXTURE_2D]=bt(r.TEXTURE_2D,r.TEXTURE_2D,1),q[r.TEXTURE_CUBE_MAP]=bt(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),q[r.TEXTURE_2D_ARRAY]=bt(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),q[r.TEXTURE_3D]=bt(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),j(r.DEPTH_TEST),o.setFunc(Ho),U(!1),mt(Yd),j(r.CULL_FACE),ot(pr);function j(V){h[V]!==!0&&(r.enable(V),h[V]=!0)}function dt(V){h[V]!==!1&&(r.disable(V),h[V]=!1)}function zt(V,St){return f[V]!==St?(r.bindFramebuffer(V,St),f[V]=St,V===r.DRAW_FRAMEBUFFER&&(f[r.FRAMEBUFFER]=St),V===r.FRAMEBUFFER&&(f[r.DRAW_FRAMEBUFFER]=St),!0):!1}function xt(V,St){let rt=p,At=!1;if(V){rt=d.get(St),rt===void 0&&(rt=[],d.set(St,rt));let Pt=V.textures;if(rt.length!==Pt.length||rt[0]!==r.COLOR_ATTACHMENT0){for(let at=0,pt=Pt.length;at<pt;at++)rt[at]=r.COLOR_ATTACHMENT0+at;rt.length=Pt.length,At=!0}}else rt[0]!==r.BACK&&(rt[0]=r.BACK,At=!0);At&&r.drawBuffers(rt)}function Ot(V){return _!==V?(r.useProgram(V),_=V,!0):!1}let Nt={[Xs]:r.FUNC_ADD,[Eg]:r.FUNC_SUBTRACT,[Ag]:r.FUNC_REVERSE_SUBTRACT};Nt[Cg]=r.MIN,Nt[Rg]=r.MAX;let et={[Pg]:r.ZERO,[Ig]:r.ONE,[Dg]:r.SRC_COLOR,[Jd]:r.SRC_ALPHA,[Bg]:r.SRC_ALPHA_SATURATE,[Og]:r.DST_COLOR,[Ng]:r.DST_ALPHA,[Lg]:r.ONE_MINUS_SRC_COLOR,[$d]:r.ONE_MINUS_SRC_ALPHA,[Ug]:r.ONE_MINUS_DST_COLOR,[Fg]:r.ONE_MINUS_DST_ALPHA,[kg]:r.CONSTANT_COLOR,[zg]:r.ONE_MINUS_CONSTANT_COLOR,[Vg]:r.CONSTANT_ALPHA,[Hg]:r.ONE_MINUS_CONSTANT_ALPHA};function ot(V,St,rt,At,Pt,at,pt,lt,Jt,ut){if(V===pr){g===!0&&(dt(r.BLEND),g=!1);return}if(g===!1&&(j(r.BLEND),g=!0),V!==Tg){if(V!==m||ut!==A){if((v!==Xs||w!==Xs)&&(r.blendEquation(r.FUNC_ADD),v=Xs,w=Xs),ut)switch(V){case ra:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Bl:r.blendFunc(r.ONE,r.ONE);break;case qd:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Zd:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:te("WebGLState: Invalid blending: ",V);break}else switch(V){case ra:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Bl:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case qd:te("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Zd:te("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:te("WebGLState: Invalid blending: ",V);break}S=null,x=null,M=null,E=null,y.set(0,0,0),b=0,m=V,A=ut}return}Pt=Pt||St,at=at||rt,pt=pt||At,(St!==v||Pt!==w)&&(r.blendEquationSeparate(Nt[St],Nt[Pt]),v=St,w=Pt),(rt!==S||At!==x||at!==M||pt!==E)&&(r.blendFuncSeparate(et[rt],et[At],et[at],et[pt]),S=rt,x=At,M=at,E=pt),(lt.equals(y)===!1||Jt!==b)&&(r.blendColor(lt.r,lt.g,lt.b,Jt),y.copy(lt),b=Jt),m=V,A=!1}function ct(V,St){V.side===ki?dt(r.CULL_FACE):j(r.CULL_FACE);let rt=V.side===Tn;St&&(rt=!rt),U(rt),V.blending===ra&&V.transparent===!1?ot(pr):ot(V.blending,V.blendEquation,V.blendSrc,V.blendDst,V.blendEquationAlpha,V.blendSrcAlpha,V.blendDstAlpha,V.blendColor,V.blendAlpha,V.premultipliedAlpha),o.setFunc(V.depthFunc),o.setTest(V.depthTest),o.setMask(V.depthWrite),s.setMask(V.colorWrite);let At=V.stencilWrite;a.setTest(At),At&&(a.setMask(V.stencilWriteMask),a.setFunc(V.stencilFunc,V.stencilRef,V.stencilFuncMask),a.setOp(V.stencilFail,V.stencilZFail,V.stencilZPass)),Y(V.polygonOffset,V.polygonOffsetFactor,V.polygonOffsetUnits),V.alphaToCoverage===!0?j(r.SAMPLE_ALPHA_TO_COVERAGE):dt(r.SAMPLE_ALPHA_TO_COVERAGE)}function U(V){R!==V&&(V?r.frontFace(r.CW):r.frontFace(r.CCW),R=V)}function mt(V){V!==Mg?(j(r.CULL_FACE),V!==P&&(V===Yd?r.cullFace(r.BACK):V===bg?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):dt(r.CULL_FACE),P=V}function Ht(V){V!==N&&(B&&r.lineWidth(V),N=V)}function Y(V,St,rt){V?(j(r.POLYGON_OFFSET_FILL),(L!==St||F!==rt)&&(L=St,F=rt,o.getReversed()&&(St=-St),r.polygonOffset(St,rt))):dt(r.POLYGON_OFFSET_FILL)}function ft(V){V?j(r.SCISSOR_TEST):dt(r.SCISSOR_TEST)}function It(V){V===void 0&&(V=r.TEXTURE0+k-1),D!==V&&(r.activeTexture(V),D=V)}function O(V,St,rt){rt===void 0&&(D===null?rt=r.TEXTURE0+k-1:rt=D);let At=Q[rt];At===void 0&&(At={type:void 0,texture:void 0},Q[rt]=At),(At.type!==V||At.texture!==St)&&(D!==rt&&(r.activeTexture(rt),D=rt),r.bindTexture(V,St||q[V]),At.type=V,At.texture=St)}function jt(){let V=Q[D];V!==void 0&&V.type!==void 0&&(r.bindTexture(V.type,null),V.type=void 0,V.texture=void 0)}function Ft(){try{r.compressedTexImage2D(...arguments)}catch(V){te("WebGLState:",V)}}function I(){try{r.compressedTexImage3D(...arguments)}catch(V){te("WebGLState:",V)}}function T(){try{r.texSubImage2D(...arguments)}catch(V){te("WebGLState:",V)}}function G(){try{r.texSubImage3D(...arguments)}catch(V){te("WebGLState:",V)}}function X(){try{r.compressedTexSubImage2D(...arguments)}catch(V){te("WebGLState:",V)}}function tt(){try{r.compressedTexSubImage3D(...arguments)}catch(V){te("WebGLState:",V)}}function gt(){try{r.texStorage2D(...arguments)}catch(V){te("WebGLState:",V)}}function ht(){try{r.texStorage3D(...arguments)}catch(V){te("WebGLState:",V)}}function nt(){try{r.texImage2D(...arguments)}catch(V){te("WebGLState:",V)}}function it(){try{r.texImage3D(...arguments)}catch(V){te("WebGLState:",V)}}function Mt(V){return u[V]!==void 0?u[V]:r.getParameter(V)}function Gt(V,St){u[V]!==St&&(r.pixelStorei(V,St),u[V]=St)}function Et(V){Bt.equals(V)===!1&&(r.scissor(V.x,V.y,V.z,V.w),Bt.copy(V))}function wt(V){st.equals(V)===!1&&(r.viewport(V.x,V.y,V.z,V.w),st.copy(V))}function _t(V,St){let rt=c.get(St);rt===void 0&&(rt=new WeakMap,c.set(St,rt));let At=rt.get(V);At===void 0&&(At=r.getUniformBlockIndex(St,V.name),rt.set(V,At))}function qt(V,St){let At=c.get(St).get(V);l.get(St)!==At&&(r.uniformBlockBinding(St,At,V.__bindingPointIndex),l.set(St,At))}function Kt(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),o.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),r.pixelStorei(r.PACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!1),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,r.BROWSER_DEFAULT_WEBGL),r.pixelStorei(r.PACK_ROW_LENGTH,0),r.pixelStorei(r.PACK_SKIP_PIXELS,0),r.pixelStorei(r.PACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_ROW_LENGTH,0),r.pixelStorei(r.UNPACK_IMAGE_HEIGHT,0),r.pixelStorei(r.UNPACK_SKIP_PIXELS,0),r.pixelStorei(r.UNPACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_SKIP_IMAGES,0),h={},u={},D=null,Q={},f={},d=new WeakMap,p=[],_=null,g=!1,m=null,v=null,S=null,x=null,w=null,M=null,E=null,y=new ee(0,0,0),b=0,A=!1,R=null,P=null,N=null,L=null,F=null,Bt.set(0,0,r.canvas.width,r.canvas.height),st.set(0,0,r.canvas.width,r.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:j,disable:dt,bindFramebuffer:zt,drawBuffers:xt,useProgram:Ot,setBlending:ot,setMaterial:ct,setFlipSided:U,setCullFace:mt,setLineWidth:Ht,setPolygonOffset:Y,setScissorTest:ft,activeTexture:It,bindTexture:O,unbindTexture:jt,compressedTexImage2D:Ft,compressedTexImage3D:I,texImage2D:nt,texImage3D:it,pixelStorei:Gt,getParameter:Mt,updateUBOMapping:_t,uniformBlockBinding:qt,texStorage2D:gt,texStorage3D:ht,texSubImage2D:T,texSubImage3D:G,compressedTexSubImage2D:X,compressedTexSubImage3D:tt,scissor:Et,viewport:wt,reset:Kt}}function AT(r,t,e,n,i,s,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new vt,h=new WeakMap,u=new Set,f,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(I,T){return p?new OffscreenCanvas(I,T):ll("canvas")}function g(I,T,G){let X=1,tt=Ft(I);if((tt.width>G||tt.height>G)&&(X=G/Math.max(tt.width,tt.height)),X<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){let gt=Math.floor(X*tt.width),ht=Math.floor(X*tt.height);f===void 0&&(f=_(gt,ht));let nt=T?_(gt,ht):f;return nt.width=gt,nt.height=ht,nt.getContext("2d").drawImage(I,0,0,gt,ht),Qt("WebGLRenderer: Texture has been resized from ("+tt.width+"x"+tt.height+") to ("+gt+"x"+ht+")."),nt}else return"data"in I&&Qt("WebGLRenderer: Image in DataTexture is too big ("+tt.width+"x"+tt.height+")."),I;return I}function m(I){return I.generateMipmaps}function v(I){r.generateMipmap(I)}function S(I){return I.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?r.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function x(I,T,G,X,tt,gt=!1){if(I!==null){if(r[I]!==void 0)return r[I];Qt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let ht;X&&(ht=t.get("EXT_texture_norm16"),ht||Qt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let nt=T;if(T===r.RED&&(G===r.FLOAT&&(nt=r.R32F),G===r.HALF_FLOAT&&(nt=r.R16F),G===r.UNSIGNED_BYTE&&(nt=r.R8),G===r.UNSIGNED_SHORT&&ht&&(nt=ht.R16_EXT),G===r.SHORT&&ht&&(nt=ht.R16_SNORM_EXT)),T===r.RED_INTEGER&&(G===r.UNSIGNED_BYTE&&(nt=r.R8UI),G===r.UNSIGNED_SHORT&&(nt=r.R16UI),G===r.UNSIGNED_INT&&(nt=r.R32UI),G===r.BYTE&&(nt=r.R8I),G===r.SHORT&&(nt=r.R16I),G===r.INT&&(nt=r.R32I)),T===r.RG&&(G===r.FLOAT&&(nt=r.RG32F),G===r.HALF_FLOAT&&(nt=r.RG16F),G===r.UNSIGNED_BYTE&&(nt=r.RG8),G===r.UNSIGNED_SHORT&&ht&&(nt=ht.RG16_EXT),G===r.SHORT&&ht&&(nt=ht.RG16_SNORM_EXT)),T===r.RG_INTEGER&&(G===r.UNSIGNED_BYTE&&(nt=r.RG8UI),G===r.UNSIGNED_SHORT&&(nt=r.RG16UI),G===r.UNSIGNED_INT&&(nt=r.RG32UI),G===r.BYTE&&(nt=r.RG8I),G===r.SHORT&&(nt=r.RG16I),G===r.INT&&(nt=r.RG32I)),T===r.RGB_INTEGER&&(G===r.UNSIGNED_BYTE&&(nt=r.RGB8UI),G===r.UNSIGNED_SHORT&&(nt=r.RGB16UI),G===r.UNSIGNED_INT&&(nt=r.RGB32UI),G===r.BYTE&&(nt=r.RGB8I),G===r.SHORT&&(nt=r.RGB16I),G===r.INT&&(nt=r.RGB32I)),T===r.RGBA_INTEGER&&(G===r.UNSIGNED_BYTE&&(nt=r.RGBA8UI),G===r.UNSIGNED_SHORT&&(nt=r.RGBA16UI),G===r.UNSIGNED_INT&&(nt=r.RGBA32UI),G===r.BYTE&&(nt=r.RGBA8I),G===r.SHORT&&(nt=r.RGBA16I),G===r.INT&&(nt=r.RGBA32I)),T===r.RGB&&(G===r.UNSIGNED_SHORT&&ht&&(nt=ht.RGB16_EXT),G===r.SHORT&&ht&&(nt=ht.RGB16_SNORM_EXT),G===r.UNSIGNED_INT_5_9_9_9_REV&&(nt=r.RGB9_E5),G===r.UNSIGNED_INT_10F_11F_11F_REV&&(nt=r.R11F_G11F_B10F)),T===r.RGBA){let it=gt?al:pe.getTransfer(tt);G===r.FLOAT&&(nt=r.RGBA32F),G===r.HALF_FLOAT&&(nt=r.RGBA16F),G===r.UNSIGNED_BYTE&&(nt=it===Me?r.SRGB8_ALPHA8:r.RGBA8),G===r.UNSIGNED_SHORT&&ht&&(nt=ht.RGBA16_EXT),G===r.SHORT&&ht&&(nt=ht.RGBA16_SNORM_EXT),G===r.UNSIGNED_SHORT_4_4_4_4&&(nt=r.RGBA4),G===r.UNSIGNED_SHORT_5_5_5_1&&(nt=r.RGB5_A1)}return(nt===r.R16F||nt===r.R32F||nt===r.RG16F||nt===r.RG32F||nt===r.RGBA16F||nt===r.RGBA32F)&&t.get("EXT_color_buffer_float"),nt}function w(I,T){let G;return I?T===null||T===Ki||T===oa?G=r.DEPTH24_STENCIL8:T===ji?G=r.DEPTH32F_STENCIL8:T===sa&&(G=r.DEPTH24_STENCIL8,Qt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===Ki||T===oa?G=r.DEPTH_COMPONENT24:T===ji?G=r.DEPTH_COMPONENT32F:T===sa&&(G=r.DEPTH_COMPONENT16),G}function M(I,T){return m(I)===!0||I.isFramebufferTexture&&I.minFilter!==xn&&I.minFilter!==Je?Math.log2(Math.max(T.width,T.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?T.mipmaps.length:1}function E(I){let T=I.target;T.removeEventListener("dispose",E),b(T),T.isVideoTexture&&h.delete(T),T.isHTMLTexture&&u.delete(T)}function y(I){let T=I.target;T.removeEventListener("dispose",y),R(T)}function b(I){let T=n.get(I);if(T.__webglInit===void 0)return;let G=I.source,X=d.get(G);if(X){let tt=X[T.__cacheKey];tt.usedTimes--,tt.usedTimes===0&&A(I),Object.keys(X).length===0&&d.delete(G)}n.remove(I)}function A(I){let T=n.get(I);r.deleteTexture(T.__webglTexture);let G=I.source,X=d.get(G);delete X[T.__cacheKey],o.memory.textures--}function R(I){let T=n.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),n.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(T.__webglFramebuffer[X]))for(let tt=0;tt<T.__webglFramebuffer[X].length;tt++)r.deleteFramebuffer(T.__webglFramebuffer[X][tt]);else r.deleteFramebuffer(T.__webglFramebuffer[X]);T.__webglDepthbuffer&&r.deleteRenderbuffer(T.__webglDepthbuffer[X])}else{if(Array.isArray(T.__webglFramebuffer))for(let X=0;X<T.__webglFramebuffer.length;X++)r.deleteFramebuffer(T.__webglFramebuffer[X]);else r.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&r.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&r.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let X=0;X<T.__webglColorRenderbuffer.length;X++)T.__webglColorRenderbuffer[X]&&r.deleteRenderbuffer(T.__webglColorRenderbuffer[X]);T.__webglDepthRenderbuffer&&r.deleteRenderbuffer(T.__webglDepthRenderbuffer)}let G=I.textures;for(let X=0,tt=G.length;X<tt;X++){let gt=n.get(G[X]);gt.__webglTexture&&(r.deleteTexture(gt.__webglTexture),o.memory.textures--),n.remove(G[X])}n.remove(I)}let P=0;function N(){P=0}function L(){return P}function F(I){P=I}function k(){let I=P;return I>=i.maxTextures&&Qt("WebGLTextures: Trying to use "+(I+1)+" texture units while this GPU supports only "+i.maxTextures),P+=1,I}function B(I){let T=[];return T.push(I.wrapS),T.push(I.wrapT),T.push(I.wrapR||0),T.push(I.magFilter),T.push(I.minFilter),T.push(I.anisotropy),T.push(I.internalFormat),T.push(I.format),T.push(I.type),T.push(I.generateMipmaps),T.push(I.premultiplyAlpha),T.push(I.flipY),T.push(I.unpackAlignment),T.push(I.colorSpace),T.join()}function $(I,T){let G=n.get(I);if(I.isVideoTexture&&O(I),I.isRenderTargetTexture===!1&&I.isExternalTexture!==!0&&I.version>0&&G.__version!==I.version){let X=I.image;if(X===null)Qt("WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)Qt("WebGLRenderer: Texture marked for update but image is incomplete");else{dt(G,I,T);return}}else I.isExternalTexture&&(G.__webglTexture=I.sourceTexture?I.sourceTexture:null);e.bindTexture(r.TEXTURE_2D,G.__webglTexture,r.TEXTURE0+T)}function W(I,T){let G=n.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&G.__version!==I.version){dt(G,I,T);return}else I.isExternalTexture&&(G.__webglTexture=I.sourceTexture?I.sourceTexture:null);e.bindTexture(r.TEXTURE_2D_ARRAY,G.__webglTexture,r.TEXTURE0+T)}function D(I,T){let G=n.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&G.__version!==I.version){dt(G,I,T);return}e.bindTexture(r.TEXTURE_3D,G.__webglTexture,r.TEXTURE0+T)}function Q(I,T){let G=n.get(I);if(I.isCubeDepthTexture!==!0&&I.version>0&&G.__version!==I.version){zt(G,I,T);return}e.bindTexture(r.TEXTURE_CUBE_MAP,G.__webglTexture,r.TEXTURE0+T)}let Ct={[rs]:r.REPEAT,[Ni]:r.CLAMP_TO_EDGE,[bh]:r.MIRRORED_REPEAT},yt={[xn]:r.NEAREST,[Xg]:r.NEAREST_MIPMAP_NEAREST,[Vl]:r.NEAREST_MIPMAP_LINEAR,[Je]:r.LINEAR,[tu]:r.LINEAR_MIPMAP_NEAREST,[ds]:r.LINEAR_MIPMAP_LINEAR},Bt={[Jg]:r.NEVER,[t_]:r.ALWAYS,[$g]:r.LESS,[Bu]:r.LEQUAL,[Kg]:r.EQUAL,[ku]:r.GEQUAL,[jg]:r.GREATER,[Qg]:r.NOTEQUAL};function st(I,T){if(T.type===ji&&t.has("OES_texture_float_linear")===!1&&(T.magFilter===Je||T.magFilter===tu||T.magFilter===Vl||T.magFilter===ds||T.minFilter===Je||T.minFilter===tu||T.minFilter===Vl||T.minFilter===ds)&&Qt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(I,r.TEXTURE_WRAP_S,Ct[T.wrapS]),r.texParameteri(I,r.TEXTURE_WRAP_T,Ct[T.wrapT]),(I===r.TEXTURE_3D||I===r.TEXTURE_2D_ARRAY)&&r.texParameteri(I,r.TEXTURE_WRAP_R,Ct[T.wrapR]),r.texParameteri(I,r.TEXTURE_MAG_FILTER,yt[T.magFilter]),r.texParameteri(I,r.TEXTURE_MIN_FILTER,yt[T.minFilter]),T.compareFunction&&(r.texParameteri(I,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(I,r.TEXTURE_COMPARE_FUNC,Bt[T.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===xn||T.minFilter!==Vl&&T.minFilter!==ds||T.type===ji&&t.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||n.get(T).__currentAnisotropy){let G=t.get("EXT_texture_filter_anisotropic");r.texParameterf(I,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,i.getMaxAnisotropy())),n.get(T).__currentAnisotropy=T.anisotropy}}}function bt(I,T){let G=!1;I.__webglInit===void 0&&(I.__webglInit=!0,T.addEventListener("dispose",E));let X=T.source,tt=d.get(X);tt===void 0&&(tt={},d.set(X,tt));let gt=B(T);if(gt!==I.__cacheKey){tt[gt]===void 0&&(tt[gt]={texture:r.createTexture(),usedTimes:0},o.memory.textures++,G=!0),tt[gt].usedTimes++;let ht=tt[I.__cacheKey];ht!==void 0&&(tt[I.__cacheKey].usedTimes--,ht.usedTimes===0&&A(T)),I.__cacheKey=gt,I.__webglTexture=tt[gt].texture}return G}function q(I,T,G){return Math.floor(Math.floor(I/G)/T)}function j(I,T,G,X){let gt=I.updateRanges;if(gt.length===0)e.texSubImage2D(r.TEXTURE_2D,0,0,0,T.width,T.height,G,X,T.data);else{gt.sort((Gt,Et)=>Gt.start-Et.start);let ht=0;for(let Gt=1;Gt<gt.length;Gt++){let Et=gt[ht],wt=gt[Gt],_t=Et.start+Et.count,qt=q(wt.start,T.width,4),Kt=q(Et.start,T.width,4);wt.start<=_t+1&&qt===Kt&&q(wt.start+wt.count-1,T.width,4)===qt?Et.count=Math.max(Et.count,wt.start+wt.count-Et.start):(++ht,gt[ht]=wt)}gt.length=ht+1;let nt=e.getParameter(r.UNPACK_ROW_LENGTH),it=e.getParameter(r.UNPACK_SKIP_PIXELS),Mt=e.getParameter(r.UNPACK_SKIP_ROWS);e.pixelStorei(r.UNPACK_ROW_LENGTH,T.width);for(let Gt=0,Et=gt.length;Gt<Et;Gt++){let wt=gt[Gt],_t=Math.floor(wt.start/4),qt=Math.ceil(wt.count/4),Kt=_t%T.width,V=Math.floor(_t/T.width),St=qt,rt=1;e.pixelStorei(r.UNPACK_SKIP_PIXELS,Kt),e.pixelStorei(r.UNPACK_SKIP_ROWS,V),e.texSubImage2D(r.TEXTURE_2D,0,Kt,V,St,rt,G,X,T.data)}I.clearUpdateRanges(),e.pixelStorei(r.UNPACK_ROW_LENGTH,nt),e.pixelStorei(r.UNPACK_SKIP_PIXELS,it),e.pixelStorei(r.UNPACK_SKIP_ROWS,Mt)}}function dt(I,T,G){let X=r.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(X=r.TEXTURE_2D_ARRAY),T.isData3DTexture&&(X=r.TEXTURE_3D);let tt=bt(I,T),gt=T.source;e.bindTexture(X,I.__webglTexture,r.TEXTURE0+G);let ht=n.get(gt);if(gt.version!==ht.__version||tt===!0){if(e.activeTexture(r.TEXTURE0+G),(typeof ImageBitmap<"u"&&T.image instanceof ImageBitmap)===!1){let rt=pe.getPrimaries(pe.workingColorSpace),At=T.colorSpace===tr?null:pe.getPrimaries(T.colorSpace),Pt=T.colorSpace===tr||rt===At?r.NONE:r.BROWSER_DEFAULT_WEBGL;e.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,T.flipY),e.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),e.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pt)}e.pixelStorei(r.UNPACK_ALIGNMENT,T.unpackAlignment);let it=g(T.image,!1,i.maxTextureSize);it=jt(T,it);let Mt=s.convert(T.format,T.colorSpace),Gt=s.convert(T.type),Et=x(T.internalFormat,Mt,Gt,T.normalized,T.colorSpace,T.isVideoTexture);st(X,T);let wt,_t=T.mipmaps,qt=T.isVideoTexture!==!0,Kt=ht.__version===void 0||tt===!0,V=gt.dataReady,St=M(T,it);if(T.isDepthTexture)Et=w(T.format===ps,T.type),Kt&&(qt?e.texStorage2D(r.TEXTURE_2D,1,Et,it.width,it.height):e.texImage2D(r.TEXTURE_2D,0,Et,it.width,it.height,0,Mt,Gt,null));else if(T.isDataTexture)if(_t.length>0){qt&&Kt&&e.texStorage2D(r.TEXTURE_2D,St,Et,_t[0].width,_t[0].height);for(let rt=0,At=_t.length;rt<At;rt++)wt=_t[rt],qt?V&&e.texSubImage2D(r.TEXTURE_2D,rt,0,0,wt.width,wt.height,Mt,Gt,wt.data):e.texImage2D(r.TEXTURE_2D,rt,Et,wt.width,wt.height,0,Mt,Gt,wt.data);T.generateMipmaps=!1}else qt?(Kt&&e.texStorage2D(r.TEXTURE_2D,St,Et,it.width,it.height),V&&j(T,it,Mt,Gt)):e.texImage2D(r.TEXTURE_2D,0,Et,it.width,it.height,0,Mt,Gt,it.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){qt&&Kt&&e.texStorage3D(r.TEXTURE_2D_ARRAY,St,Et,_t[0].width,_t[0].height,it.depth);for(let rt=0,At=_t.length;rt<At;rt++)if(wt=_t[rt],T.format!==zi)if(Mt!==null)if(qt){if(V)if(T.layerUpdates.size>0){let Pt=vp(wt.width,wt.height,T.format,T.type);for(let at of T.layerUpdates){let pt=wt.data.subarray(at*Pt/wt.data.BYTES_PER_ELEMENT,(at+1)*Pt/wt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,rt,0,0,at,wt.width,wt.height,1,Mt,pt)}}else e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,rt,0,0,0,wt.width,wt.height,it.depth,Mt,wt.data)}else e.compressedTexImage3D(r.TEXTURE_2D_ARRAY,rt,Et,wt.width,wt.height,it.depth,0,wt.data,0,0);else Qt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else qt?V&&e.texSubImage3D(r.TEXTURE_2D_ARRAY,rt,0,0,0,wt.width,wt.height,it.depth,Mt,Gt,wt.data):e.texImage3D(r.TEXTURE_2D_ARRAY,rt,Et,wt.width,wt.height,it.depth,0,Mt,Gt,wt.data);T.layerUpdates.size>0&&T.clearLayerUpdates()}else{qt&&Kt&&e.texStorage2D(r.TEXTURE_2D,St,Et,_t[0].width,_t[0].height);for(let rt=0,At=_t.length;rt<At;rt++)wt=_t[rt],T.format!==zi?Mt!==null?qt?V&&e.compressedTexSubImage2D(r.TEXTURE_2D,rt,0,0,wt.width,wt.height,Mt,wt.data):e.compressedTexImage2D(r.TEXTURE_2D,rt,Et,wt.width,wt.height,0,wt.data):Qt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):qt?V&&e.texSubImage2D(r.TEXTURE_2D,rt,0,0,wt.width,wt.height,Mt,Gt,wt.data):e.texImage2D(r.TEXTURE_2D,rt,Et,wt.width,wt.height,0,Mt,Gt,wt.data)}else if(T.isDataArrayTexture)if(qt){if(Kt&&e.texStorage3D(r.TEXTURE_2D_ARRAY,St,Et,it.width,it.height,it.depth),V)if(T.layerUpdates.size>0){let rt=vp(it.width,it.height,T.format,T.type);for(let At of T.layerUpdates){let Pt=it.data.subarray(At*rt/it.data.BYTES_PER_ELEMENT,(At+1)*rt/it.data.BYTES_PER_ELEMENT);e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,At,it.width,it.height,1,Mt,Gt,Pt)}T.clearLayerUpdates()}else e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,it.width,it.height,it.depth,Mt,Gt,it.data)}else e.texImage3D(r.TEXTURE_2D_ARRAY,0,Et,it.width,it.height,it.depth,0,Mt,Gt,it.data);else if(T.isData3DTexture)qt?(Kt&&e.texStorage3D(r.TEXTURE_3D,St,Et,it.width,it.height,it.depth),V&&e.texSubImage3D(r.TEXTURE_3D,0,0,0,0,it.width,it.height,it.depth,Mt,Gt,it.data)):e.texImage3D(r.TEXTURE_3D,0,Et,it.width,it.height,it.depth,0,Mt,Gt,it.data);else if(T.isFramebufferTexture){if(Kt)if(qt)e.texStorage2D(r.TEXTURE_2D,St,Et,it.width,it.height);else{let rt=it.width,At=it.height;for(let Pt=0;Pt<St;Pt++)e.texImage2D(r.TEXTURE_2D,Pt,Et,rt,At,0,Mt,Gt,null),rt>>=1,At>>=1}}else if(T.isHTMLTexture){if("texElementImage2D"in r){let rt=r.canvas;if(rt.hasAttribute("layoutsubtree")||rt.setAttribute("layoutsubtree","true"),it.parentNode!==rt){rt.appendChild(it),u.add(T),rt.onpaint=At=>{let Pt=At.changedElements;for(let at of u)Pt.includes(at.image)&&(at.needsUpdate=!0)},rt.requestPaint();return}if(r.texElementImage2D.length===3)r.texElementImage2D(r.TEXTURE_2D,r.RGBA8,it);else{let Pt=r.RGBA,at=r.RGBA,pt=r.UNSIGNED_BYTE;r.texElementImage2D(r.TEXTURE_2D,0,Pt,at,pt,it)}r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE)}}else if(_t.length>0){if(qt&&Kt){let rt=Ft(_t[0]);e.texStorage2D(r.TEXTURE_2D,St,Et,rt.width,rt.height)}for(let rt=0,At=_t.length;rt<At;rt++)wt=_t[rt],qt?V&&e.texSubImage2D(r.TEXTURE_2D,rt,0,0,Mt,Gt,wt):e.texImage2D(r.TEXTURE_2D,rt,Et,Mt,Gt,wt);T.generateMipmaps=!1}else if(qt){if(Kt){let rt=Ft(it);e.texStorage2D(r.TEXTURE_2D,St,Et,rt.width,rt.height)}V&&e.texSubImage2D(r.TEXTURE_2D,0,0,0,Mt,Gt,it)}else e.texImage2D(r.TEXTURE_2D,0,Et,Mt,Gt,it);m(T)&&v(X),ht.__version=gt.version,T.onUpdate&&T.onUpdate(T)}I.__version=T.version}function zt(I,T,G){if(T.image.length!==6)return;let X=bt(I,T),tt=T.source;e.bindTexture(r.TEXTURE_CUBE_MAP,I.__webglTexture,r.TEXTURE0+G);let gt=n.get(tt);if(tt.version!==gt.__version||X===!0){e.activeTexture(r.TEXTURE0+G);let ht=pe.getPrimaries(pe.workingColorSpace),nt=T.colorSpace===tr?null:pe.getPrimaries(T.colorSpace),it=T.colorSpace===tr||ht===nt?r.NONE:r.BROWSER_DEFAULT_WEBGL;e.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,T.flipY),e.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),e.pixelStorei(r.UNPACK_ALIGNMENT,T.unpackAlignment),e.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,it);let Mt=T.isCompressedTexture||T.image[0].isCompressedTexture,Gt=T.image[0]&&T.image[0].isDataTexture,Et=[];for(let at=0;at<6;at++)!Mt&&!Gt?Et[at]=g(T.image[at],!0,i.maxCubemapSize):Et[at]=Gt?T.image[at].image:T.image[at],Et[at]=jt(T,Et[at]);let wt=Et[0],_t=s.convert(T.format,T.colorSpace),qt=s.convert(T.type),Kt=x(T.internalFormat,_t,qt,T.normalized,T.colorSpace),V=T.isVideoTexture!==!0,St=gt.__version===void 0||X===!0,rt=tt.dataReady,At=M(T,wt);st(r.TEXTURE_CUBE_MAP,T);let Pt;if(Mt){V&&St&&e.texStorage2D(r.TEXTURE_CUBE_MAP,At,Kt,wt.width,wt.height);for(let at=0;at<6;at++){Pt=Et[at].mipmaps;for(let pt=0;pt<Pt.length;pt++){let lt=Pt[pt];T.format!==zi?_t!==null?V?rt&&e.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+at,pt,0,0,lt.width,lt.height,_t,lt.data):e.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+at,pt,Kt,lt.width,lt.height,0,lt.data):Qt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):V?rt&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+at,pt,0,0,lt.width,lt.height,_t,qt,lt.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+at,pt,Kt,lt.width,lt.height,0,_t,qt,lt.data)}}}else{if(Pt=T.mipmaps,V&&St){Pt.length>0&&At++;let at=Ft(Et[0]);e.texStorage2D(r.TEXTURE_CUBE_MAP,At,Kt,at.width,at.height)}for(let at=0;at<6;at++)if(Gt){V?rt&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,Et[at].width,Et[at].height,_t,qt,Et[at].data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Kt,Et[at].width,Et[at].height,0,_t,qt,Et[at].data);for(let pt=0;pt<Pt.length;pt++){let Jt=Pt[pt].image[at].image;V?rt&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+at,pt+1,0,0,Jt.width,Jt.height,_t,qt,Jt.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+at,pt+1,Kt,Jt.width,Jt.height,0,_t,qt,Jt.data)}}else{V?rt&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,_t,qt,Et[at]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Kt,_t,qt,Et[at]);for(let pt=0;pt<Pt.length;pt++){let lt=Pt[pt];V?rt&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+at,pt+1,0,0,_t,qt,lt.image[at]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+at,pt+1,Kt,_t,qt,lt.image[at])}}}m(T)&&v(r.TEXTURE_CUBE_MAP),gt.__version=tt.version,T.onUpdate&&T.onUpdate(T)}I.__version=T.version}function xt(I,T,G,X,tt,gt){let ht=s.convert(G.format,G.colorSpace),nt=s.convert(G.type),it=x(G.internalFormat,ht,nt,G.normalized,G.colorSpace),Mt=n.get(T),Gt=n.get(G);if(Gt.__renderTarget=T,!Mt.__hasExternalTextures){let Et=Math.max(1,T.width>>gt),wt=Math.max(1,T.height>>gt);tt===r.TEXTURE_3D||tt===r.TEXTURE_2D_ARRAY?e.texImage3D(tt,gt,it,Et,wt,T.depth,0,ht,nt,null):e.texImage2D(tt,gt,it,Et,wt,0,ht,nt,null)}e.bindFramebuffer(r.FRAMEBUFFER,I),It(T)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,X,tt,Gt.__webglTexture,0,ft(T)):(tt===r.TEXTURE_2D||tt>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&tt<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,X,tt,Gt.__webglTexture,gt),e.bindFramebuffer(r.FRAMEBUFFER,null)}function Ot(I,T,G){if(r.bindRenderbuffer(r.RENDERBUFFER,I),T.depthBuffer){let X=T.depthTexture,tt=X&&X.isDepthTexture?X.type:null,gt=w(T.stencilBuffer,tt),ht=T.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;It(T)?a.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,ft(T),gt,T.width,T.height):G?r.renderbufferStorageMultisample(r.RENDERBUFFER,ft(T),gt,T.width,T.height):r.renderbufferStorage(r.RENDERBUFFER,gt,T.width,T.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,ht,r.RENDERBUFFER,I)}else{let X=T.textures;for(let tt=0;tt<X.length;tt++){let gt=X[tt],ht=s.convert(gt.format,gt.colorSpace),nt=s.convert(gt.type),it=x(gt.internalFormat,ht,nt,gt.normalized,gt.colorSpace);It(T)?a.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,ft(T),it,T.width,T.height):G?r.renderbufferStorageMultisample(r.RENDERBUFFER,ft(T),it,T.width,T.height):r.renderbufferStorage(r.RENDERBUFFER,it,T.width,T.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function Nt(I,T,G){let X=T.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(r.FRAMEBUFFER,I),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let tt=n.get(T.depthTexture);if(tt.__renderTarget=T,(!tt.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),X){if(tt.__webglInit===void 0&&(tt.__webglInit=!0,T.depthTexture.addEventListener("dispose",E)),tt.__webglTexture===void 0){tt.__webglTexture=r.createTexture(),e.bindTexture(r.TEXTURE_CUBE_MAP,tt.__webglTexture),st(r.TEXTURE_CUBE_MAP,T.depthTexture);let Mt=s.convert(T.depthTexture.format),Gt=s.convert(T.depthTexture.type),Et;T.depthTexture.format===ur?Et=r.DEPTH_COMPONENT24:T.depthTexture.format===ps&&(Et=r.DEPTH24_STENCIL8);for(let wt=0;wt<6;wt++)r.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+wt,0,Et,T.width,T.height,0,Mt,Gt,null)}}else $(T.depthTexture,0);let gt=tt.__webglTexture,ht=ft(T),nt=X?r.TEXTURE_CUBE_MAP_POSITIVE_X+G:r.TEXTURE_2D,it=T.depthTexture.format===ps?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;if(T.depthTexture.format===ur)It(T)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,it,nt,gt,0,ht):r.framebufferTexture2D(r.FRAMEBUFFER,it,nt,gt,0);else if(T.depthTexture.format===ps)It(T)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,it,nt,gt,0,ht):r.framebufferTexture2D(r.FRAMEBUFFER,it,nt,gt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function et(I){let T=n.get(I),G=I.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==I.depthTexture){let X=I.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),X){let tt=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,X.removeEventListener("dispose",tt)};X.addEventListener("dispose",tt),T.__depthDisposeCallback=tt}T.__boundDepthTexture=X}if(I.depthTexture&&!T.__autoAllocateDepthBuffer)if(G)for(let X=0;X<6;X++)Nt(T.__webglFramebuffer[X],I,X);else{let X=I.texture.mipmaps;X&&X.length>0?Nt(T.__webglFramebuffer[0],I,0):Nt(T.__webglFramebuffer,I,0)}else if(G){T.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(e.bindFramebuffer(r.FRAMEBUFFER,T.__webglFramebuffer[X]),T.__webglDepthbuffer[X]===void 0)T.__webglDepthbuffer[X]=r.createRenderbuffer(),Ot(T.__webglDepthbuffer[X],I,!1);else{let tt=I.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,gt=T.__webglDepthbuffer[X];r.bindRenderbuffer(r.RENDERBUFFER,gt),r.framebufferRenderbuffer(r.FRAMEBUFFER,tt,r.RENDERBUFFER,gt)}}else{let X=I.texture.mipmaps;if(X&&X.length>0?e.bindFramebuffer(r.FRAMEBUFFER,T.__webglFramebuffer[0]):e.bindFramebuffer(r.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=r.createRenderbuffer(),Ot(T.__webglDepthbuffer,I,!1);else{let tt=I.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,gt=T.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,gt),r.framebufferRenderbuffer(r.FRAMEBUFFER,tt,r.RENDERBUFFER,gt)}}e.bindFramebuffer(r.FRAMEBUFFER,null)}function ot(I,T,G){let X=n.get(I);T!==void 0&&xt(X.__webglFramebuffer,I,I.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),G!==void 0&&et(I)}function ct(I){let T=I.texture,G=n.get(I),X=n.get(T);I.addEventListener("dispose",y);let tt=I.textures,gt=I.isWebGLCubeRenderTarget===!0,ht=tt.length>1;if(ht||(X.__webglTexture===void 0&&(X.__webglTexture=r.createTexture()),X.__version=T.version,o.memory.textures++),gt){G.__webglFramebuffer=[];for(let nt=0;nt<6;nt++)if(T.mipmaps&&T.mipmaps.length>0){G.__webglFramebuffer[nt]=[];for(let it=0;it<T.mipmaps.length;it++)G.__webglFramebuffer[nt][it]=r.createFramebuffer()}else G.__webglFramebuffer[nt]=r.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){G.__webglFramebuffer=[];for(let nt=0;nt<T.mipmaps.length;nt++)G.__webglFramebuffer[nt]=r.createFramebuffer()}else G.__webglFramebuffer=r.createFramebuffer();if(ht)for(let nt=0,it=tt.length;nt<it;nt++){let Mt=n.get(tt[nt]);Mt.__webglTexture===void 0&&(Mt.__webglTexture=r.createTexture(),o.memory.textures++)}if(I.samples>0&&It(I)===!1){G.__webglMultisampledFramebuffer=r.createFramebuffer(),G.__webglColorRenderbuffer=[],e.bindFramebuffer(r.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let nt=0;nt<tt.length;nt++){let it=tt[nt];G.__webglColorRenderbuffer[nt]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,G.__webglColorRenderbuffer[nt]);let Mt=s.convert(it.format,it.colorSpace),Gt=s.convert(it.type),Et=x(it.internalFormat,Mt,Gt,it.normalized,it.colorSpace,I.isXRRenderTarget===!0),wt=ft(I);r.renderbufferStorageMultisample(r.RENDERBUFFER,wt,Et,I.width,I.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+nt,r.RENDERBUFFER,G.__webglColorRenderbuffer[nt])}r.bindRenderbuffer(r.RENDERBUFFER,null),I.depthBuffer&&(G.__webglDepthRenderbuffer=r.createRenderbuffer(),Ot(G.__webglDepthRenderbuffer,I,!0)),e.bindFramebuffer(r.FRAMEBUFFER,null)}}if(gt){e.bindTexture(r.TEXTURE_CUBE_MAP,X.__webglTexture),st(r.TEXTURE_CUBE_MAP,T);for(let nt=0;nt<6;nt++)if(T.mipmaps&&T.mipmaps.length>0)for(let it=0;it<T.mipmaps.length;it++)xt(G.__webglFramebuffer[nt][it],I,T,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+nt,it);else xt(G.__webglFramebuffer[nt],I,T,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0);m(T)&&v(r.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ht){for(let nt=0,it=tt.length;nt<it;nt++){let Mt=tt[nt],Gt=n.get(Mt),Et=r.TEXTURE_2D;(I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(Et=I.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),e.bindTexture(Et,Gt.__webglTexture),st(Et,Mt),xt(G.__webglFramebuffer,I,Mt,r.COLOR_ATTACHMENT0+nt,Et,0),m(Mt)&&v(Et)}e.unbindTexture()}else{let nt=r.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(nt=I.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),e.bindTexture(nt,X.__webglTexture),st(nt,T),T.mipmaps&&T.mipmaps.length>0)for(let it=0;it<T.mipmaps.length;it++)xt(G.__webglFramebuffer[it],I,T,r.COLOR_ATTACHMENT0,nt,it);else xt(G.__webglFramebuffer,I,T,r.COLOR_ATTACHMENT0,nt,0);m(T)&&v(nt),e.unbindTexture()}I.depthBuffer&&et(I)}function U(I){let T=I.textures;for(let G=0,X=T.length;G<X;G++){let tt=T[G];if(m(tt)){let gt=S(I),ht=n.get(tt).__webglTexture;e.bindTexture(gt,ht),v(gt),e.unbindTexture()}}}let mt=[],Ht=[];function Y(I){if(I.samples>0){if(It(I)===!1){let T=I.textures,G=I.width,X=I.height,tt=r.COLOR_BUFFER_BIT,gt=I.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ht=n.get(I),nt=T.length>1;if(nt)for(let Mt=0;Mt<T.length;Mt++)e.bindFramebuffer(r.FRAMEBUFFER,ht.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Mt,r.RENDERBUFFER,null),e.bindFramebuffer(r.FRAMEBUFFER,ht.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Mt,r.TEXTURE_2D,null,0);e.bindFramebuffer(r.READ_FRAMEBUFFER,ht.__webglMultisampledFramebuffer);let it=I.texture.mipmaps;it&&it.length>0?e.bindFramebuffer(r.DRAW_FRAMEBUFFER,ht.__webglFramebuffer[0]):e.bindFramebuffer(r.DRAW_FRAMEBUFFER,ht.__webglFramebuffer);for(let Mt=0;Mt<T.length;Mt++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(tt|=r.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(tt|=r.STENCIL_BUFFER_BIT)),nt){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,ht.__webglColorRenderbuffer[Mt]);let Gt=n.get(T[Mt]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Gt,0)}r.blitFramebuffer(0,0,G,X,0,0,G,X,tt,r.NEAREST),l===!0&&(mt.length=0,Ht.length=0,mt.push(r.COLOR_ATTACHMENT0+Mt),I.depthBuffer&&I.storeMultisampledDepthBuffer===!1&&(mt.push(gt),Ht.push(gt),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,Ht)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,mt))}if(e.bindFramebuffer(r.READ_FRAMEBUFFER,null),e.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),nt)for(let Mt=0;Mt<T.length;Mt++){e.bindFramebuffer(r.FRAMEBUFFER,ht.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Mt,r.RENDERBUFFER,ht.__webglColorRenderbuffer[Mt]);let Gt=n.get(T[Mt]).__webglTexture;e.bindFramebuffer(r.FRAMEBUFFER,ht.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Mt,r.TEXTURE_2D,Gt,0)}e.bindFramebuffer(r.DRAW_FRAMEBUFFER,ht.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.storeMultisampledDepthBuffer===!1&&l){let T=I.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[T])}}}function ft(I){return Math.min(i.maxSamples,I.samples)}function It(I){let T=n.get(I);return I.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function O(I){let T=o.render.frame;h.get(I)!==T&&(h.set(I,T),I.update())}function jt(I,T){let G=I.colorSpace,X=I.format,tt=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||G!==ol&&G!==tr&&(pe.getTransfer(G)===Me?(X!==zi||tt!==Bn)&&Qt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):te("WebGLTextures: Unsupported texture color space:",G)),T}function Ft(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(c.width=I.naturalWidth||I.width,c.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(c.width=I.displayWidth,c.height=I.displayHeight):(c.width=I.width,c.height=I.height),c}this.allocateTextureUnit=k,this.resetTextureUnits=N,this.getTextureUnits=L,this.setTextureUnits=F,this.setTexture2D=$,this.setTexture2DArray=W,this.setTexture3D=D,this.setTextureCube=Q,this.rebindTextures=ot,this.setupRenderTarget=ct,this.updateRenderTargetMipmap=U,this.updateMultisampleRenderTarget=Y,this.setupDepthRenderbuffer=et,this.setupFrameBufferTexture=xt,this.useMultisampledRTT=It,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function CT(r,t){function e(n,i=tr){let s,o=pe.getTransfer(i);if(n===Bn)return r.UNSIGNED_BYTE;if(n===nu)return r.UNSIGNED_SHORT_4_4_4_4;if(n===iu)return r.UNSIGNED_SHORT_5_5_5_1;if(n===ap)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===lp)return r.UNSIGNED_INT_10F_11F_11F_REV;if(n===sp)return r.BYTE;if(n===op)return r.SHORT;if(n===sa)return r.UNSIGNED_SHORT;if(n===eu)return r.INT;if(n===Ki)return r.UNSIGNED_INT;if(n===ji)return r.FLOAT;if(n===Qi)return r.HALF_FLOAT;if(n===cp)return r.ALPHA;if(n===hp)return r.RGB;if(n===zi)return r.RGBA;if(n===ur)return r.DEPTH_COMPONENT;if(n===ps)return r.DEPTH_STENCIL;if(n===Hl)return r.RED;if(n===ru)return r.RED_INTEGER;if(n===ms)return r.RG;if(n===su)return r.RG_INTEGER;if(n===ou)return r.RGBA_INTEGER;if(n===Gl||n===Wl||n===Xl||n===Yl)if(o===Me)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===Gl)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Wl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Xl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Yl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===Gl)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Wl)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Xl)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Yl)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===au||n===lu||n===cu||n===hu)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===au)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===lu)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===cu)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===hu)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===uu||n===fu||n===du||n===pu||n===mu||n===ql||n===gu)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===uu||n===fu)return o===Me?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===du)return o===Me?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(n===pu)return s.COMPRESSED_R11_EAC;if(n===mu)return s.COMPRESSED_SIGNED_R11_EAC;if(n===ql)return s.COMPRESSED_RG11_EAC;if(n===gu)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===_u||n===xu||n===vu||n===yu||n===Su||n===Mu||n===bu||n===wu||n===Tu||n===Eu||n===Au||n===Cu||n===Ru||n===Pu)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===_u)return o===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===xu)return o===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===vu)return o===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===yu)return o===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Su)return o===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Mu)return o===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===bu)return o===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===wu)return o===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Tu)return o===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Eu)return o===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Au)return o===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Cu)return o===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ru)return o===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Pu)return o===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Iu||n===Du||n===Lu)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===Iu)return o===Me?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Du)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Lu)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Nu||n===Fu||n===Zl||n===Ou)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===Nu)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Fu)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Zl)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ou)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===oa?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:e}}var RT=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,PT=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Lp=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new _l(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new wn({vertexShader:RT,fragmentShader:PT,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new de(new Bi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Np=class extends fr{constructor(t,e){super();let n=this,i=null,s=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,f=null,d=null,p=null,_=typeof XRWebGLBinding<"u",g=new Lp,m={},v=e.getContextAttributes(),S=null,x=null,w=[],M=[],E=new vt,y=null,b=null,A=new Un;A.viewport=new ve;let R=new Un;R.viewport=new ve;let P=[A,R],N=new Kh,L=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let j=w[q];return j===void 0&&(j=new qo,w[q]=j),j.getTargetRaySpace()},this.getControllerGrip=function(q){let j=w[q];return j===void 0&&(j=new qo,w[q]=j),j.getGripSpace()},this.getHand=function(q){let j=w[q];return j===void 0&&(j=new qo,w[q]=j),j.getHandSpace()};function k(q){let j=M.indexOf(q.inputSource);if(j===-1)return;let dt=w[j];dt!==void 0&&(dt.update(q.inputSource,q.frame,c||o),dt.dispatchEvent({type:q.type,data:q.inputSource}))}function B(){i.removeEventListener("select",k),i.removeEventListener("selectstart",k),i.removeEventListener("selectend",k),i.removeEventListener("squeeze",k),i.removeEventListener("squeezestart",k),i.removeEventListener("squeezeend",k),i.removeEventListener("end",B),i.removeEventListener("inputsourceschange",$);for(let q=0;q<w.length;q++){let j=M[q];j!==null&&(M[q]=null,w[q].disconnect(j))}L=null,F=null,g.reset();for(let q in m)delete m[q];if(t.setRenderTarget(S),d=null,f=null,u=null,i=null,x=null,bt.stop(),n.isPresenting=!1,t.setPixelRatio(y),t.setSize(E.width,E.height,!1),b!==null){let q=b.camera;q.fov=b.fov,q.zoom=b.zoom,q.updateProjectionMatrix(),b=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){s=q,n.isPresenting===!0&&Qt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){a=q,n.isPresenting===!0&&Qt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(i,e)),u},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(q){if(i=q,i!==null){if(S=t.getRenderTarget(),i.addEventListener("select",k),i.addEventListener("selectstart",k),i.addEventListener("selectend",k),i.addEventListener("squeeze",k),i.addEventListener("squeezestart",k),i.addEventListener("squeezeend",k),i.addEventListener("end",B),i.addEventListener("inputsourceschange",$),v.xrCompatible!==!0&&await e.makeXRCompatible(),y=t.getPixelRatio(),t.getSize(E),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let dt=null,zt=null,xt=null;v.depth&&(xt=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,dt=v.stencil?ps:ur,zt=v.stencil?oa:Ki);let Ot={colorFormat:e.RGBA8,depthFormat:xt,scaleFactor:s};u=this.getBinding(),f=u.createProjectionLayer(Ot),i.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),x=new ci(f.textureWidth,f.textureHeight,{format:zi,type:Bn,depthTexture:new os(f.textureWidth,f.textureHeight,zt,void 0,void 0,void 0,void 0,void 0,void 0,dt),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}else{let dt={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(i,e,dt),i.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),x=new ci(d.framebufferWidth,d.framebufferHeight,{format:zi,type:Bn,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),bt.setContext(i),bt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function $(q){for(let j=0;j<q.removed.length;j++){let dt=q.removed[j],zt=M.indexOf(dt);zt>=0&&(M[zt]=null,w[zt].disconnect(dt))}for(let j=0;j<q.added.length;j++){let dt=q.added[j],zt=M.indexOf(dt);if(zt===-1){for(let Ot=0;Ot<w.length;Ot++)if(Ot>=M.length){M.push(dt),zt=Ot;break}else if(M[Ot]===null){M[Ot]=dt,zt=Ot;break}if(zt===-1)break}let xt=w[zt];xt&&xt.connect(dt)}}let W=new z,D=new z;function Q(q,j,dt){W.setFromMatrixPosition(j.matrixWorld),D.setFromMatrixPosition(dt.matrixWorld);let zt=W.distanceTo(D),xt=j.projectionMatrix.elements,Ot=dt.projectionMatrix.elements,Nt=xt[14]/(xt[10]-1),et=xt[14]/(xt[10]+1),ot=(xt[9]+1)/xt[5],ct=(xt[9]-1)/xt[5],U=(xt[8]-1)/xt[0],mt=(Ot[8]+1)/Ot[0],Ht=Nt*U,Y=Nt*mt,ft=zt/(-U+mt),It=ft*-U;if(j.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(It),q.translateZ(ft),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),xt[10]===-1)q.projectionMatrix.copy(j.projectionMatrix),q.projectionMatrixInverse.copy(j.projectionMatrixInverse);else{let O=Nt+ft,jt=et+ft,Ft=Ht-It,I=Y+(zt-It),T=ot*et/jt*O,G=ct*et/jt*O;q.projectionMatrix.makePerspective(Ft,I,T,G,O,jt),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function Ct(q,j){j===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(j.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(i===null)return;let j=q.near,dt=q.far;g.texture!==null&&(g.depthNear>0&&(j=g.depthNear),g.depthFar>0&&(dt=g.depthFar)),N.near=R.near=A.near=j,N.far=R.far=A.far=dt,(L!==N.near||F!==N.far)&&(i.updateRenderState({depthNear:N.near,depthFar:N.far}),L=N.near,F=N.far),N.layers.mask=q.layers.mask|6,A.layers.mask=N.layers.mask&-5,R.layers.mask=N.layers.mask&-3;let zt=q.parent,xt=N.cameras;Ct(N,zt);for(let Ot=0;Ot<xt.length;Ot++)Ct(xt[Ot],zt);xt.length===2?Q(N,A,R):N.projectionMatrix.copy(A.projectionMatrix),b===null&&q.isPerspectiveCamera&&(b={camera:q,fov:q.fov,zoom:q.zoom}),yt(q,N,zt)};function yt(q,j,dt){dt===null?q.matrix.copy(j.matrixWorld):(q.matrix.copy(dt.matrixWorld),q.matrix.invert(),q.matrix.multiply(j.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(j.projectionMatrix),q.projectionMatrixInverse.copy(j.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=Xo*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function(q){l=q,f!==null&&(f.fixedFoveation=q),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=q)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(N)},this.getCameraTexture=function(q){return m[q]};let Bt=null;function st(q,j){if(h=j.getViewerPose(c||o),p=j,h!==null){let dt=h.views;d!==null&&(t.setRenderTargetFramebuffer(x,d.framebuffer),t.setRenderTarget(x));let zt=!1;dt.length!==N.cameras.length&&(N.cameras.length=0,zt=!0);for(let et=0;et<dt.length;et++){let ot=dt[et],ct=null;if(d!==null)ct=d.getViewport(ot);else{let mt=u.getViewSubImage(f,ot);ct=mt.viewport,et===0&&(t.setRenderTargetTextures(x,mt.colorTexture,mt.depthStencilTexture),t.setRenderTarget(x))}let U=P[et];U===void 0&&(U=new Un,U.layers.enable(et),U.viewport=new ve,P[et]=U),U.matrix.fromArray(ot.transform.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale),U.projectionMatrix.fromArray(ot.projectionMatrix),U.projectionMatrixInverse.copy(U.projectionMatrix).invert(),U.viewport.set(ct.x,ct.y,ct.width,ct.height),et===0&&(N.matrix.copy(U.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),zt===!0&&N.cameras.push(U)}let xt=i.enabledFeatures;if(xt&&xt.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){u=n.getBinding();let et=u.getDepthInformation(dt[0]);et&&et.isValid&&et.texture&&g.init(et,i.renderState)}if(xt&&xt.includes("camera-access")&&_){t.state.unbindTexture(),u=n.getBinding();for(let et=0;et<dt.length;et++){let ot=dt[et].camera;if(ot){let ct=m[ot];ct||(ct=new _l,m[ot]=ct);let U=u.getCameraImage(ot);ct.sourceTexture=U}}}}for(let dt=0;dt<w.length;dt++){let zt=M[dt],xt=w[dt];zt!==null&&xt!==void 0&&xt.update(zt,j,c||o)}Bt&&Bt(q,j),j.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:j}),p=null}let bt=new F_;bt.setAnimationLoop(st),this.setAnimationLoop=function(q){Bt=q},this.dispose=function(){}}},IT=new Ue,V_=new ie;V_.set(-1,0,0,0,1,0,0,0,1);function DT(r,t){function e(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,gp(r)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function i(g,m,v,S,x){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?s(g,m):m.isMeshLambertMaterial?(s(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(s(g,m),u(g,m)):m.isMeshPhongMaterial?(s(g,m),h(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(s(g,m),f(g,m),m.isMeshPhysicalMaterial&&d(g,m,x)):m.isMeshMatcapMaterial?(s(g,m),p(g,m)):m.isMeshDepthMaterial?s(g,m):m.isMeshDistanceMaterial?(s(g,m),_(g,m)):m.isMeshNormalMaterial?s(g,m):m.isLineBasicMaterial?(o(g,m),m.isLineDashedMaterial&&a(g,m)):m.isPointsMaterial?l(g,m,v,S):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function s(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,e(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===Tn&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,e(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===Tn&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,e(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,e(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);let v=t.get(m),S=v.envMap,x=v.envMapRotation;S&&(g.envMap.value=S,g.envMapRotation.value.setFromMatrix4(IT.makeRotationFromEuler(x)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(V_),g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,g.aoMapTransform))}function o(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform))}function a(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,v,S){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*v,g.scale.value=S*.5,m.map&&(g.map.value=m.map,e(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function u(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function f(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function d(g,m,v){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Tn&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.retroreflectivity>0&&(g.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=v.texture,g.transmissionSamplerSize.value.set(v.width,v.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function _(g,m){let v=t.get(m).light;g.referencePosition.value.setFromMatrixPosition(v.matrixWorld),g.nearDistance.value=v.shadow.camera.near,g.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function LT(r,t,e,n){let i={},s={},o=[],a=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,w){let M=w.program;n.uniformBlockBinding(x,M)}function c(x,w){let M=i[x.id];M===void 0&&(g(x),M=h(x),i[x.id]=M,x.addEventListener("dispose",v));let E=w.program;n.updateUBOMapping(x,E);let y=t.render.frame;s[x.id]!==y&&(f(x),s[x.id]=y)}function h(x){let w=u();x.__bindingPointIndex=w;let M=r.createBuffer(),E=x.__size,y=x.usage;return r.bindBuffer(r.UNIFORM_BUFFER,M),r.bufferData(r.UNIFORM_BUFFER,E,y),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,w,M),M}function u(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return te("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(x){let w=i[x.id],M=x.uniforms,E=x.__cache;r.bindBuffer(r.UNIFORM_BUFFER,w);for(let y=0,b=M.length;y<b;y++){let A=M[y];if(Array.isArray(A))for(let R=0,P=A.length;R<P;R++)d(A[R],y,R,E);else d(A,y,0,E)}r.bindBuffer(r.UNIFORM_BUFFER,null)}function d(x,w,M,E){if(_(x,w,M,E)===!0){let y=x.__offset,b=x.value;if(Array.isArray(b)){let A=0;for(let R=0;R<b.length;R++){let P=b[R],N=m(P);p(P,x.__data,A),typeof P!="number"&&typeof P!="boolean"&&!P.isMatrix3&&!ArrayBuffer.isView(P)&&(A+=N.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(b,x.__data,0);r.bufferSubData(r.UNIFORM_BUFFER,y,x.__data)}}function p(x,w,M){typeof x=="number"||typeof x=="boolean"?w[0]=x:x.isMatrix3?(w[0]=x.elements[0],w[1]=x.elements[1],w[2]=x.elements[2],w[3]=0,w[4]=x.elements[3],w[5]=x.elements[4],w[6]=x.elements[5],w[7]=0,w[8]=x.elements[6],w[9]=x.elements[7],w[10]=x.elements[8],w[11]=0):ArrayBuffer.isView(x)?w.set(new x.constructor(x.buffer,x.byteOffset,w.length)):x.toArray(w,M)}function _(x,w,M,E){let y=x.value,b=w+"_"+M;if(E[b]===void 0)return typeof y=="number"||typeof y=="boolean"?E[b]=y:ArrayBuffer.isView(y)?E[b]=y.slice():E[b]=y.clone(),!0;{let A=E[b];if(typeof y=="number"||typeof y=="boolean"){if(A!==y)return E[b]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(A.equals(y)===!1)return A.copy(y),!0}}return!1}function g(x){let w=x.uniforms,M=0,E=16;for(let b=0,A=w.length;b<A;b++){let R=Array.isArray(w[b])?w[b]:[w[b]];for(let P=0,N=R.length;P<N;P++){let L=R[P],F=Array.isArray(L.value)?L.value:[L.value];for(let k=0,B=F.length;k<B;k++){let $=F[k],W=m($),D=M%E,Q=D%W.boundary,Ct=D+Q;M+=Q,Ct!==0&&E-Ct<W.storage&&(M+=E-Ct),L.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=M,M+=W.storage}}}let y=M%E;return y>0&&(M+=E-y),x.__size=M,x.__cache={},this}function m(x){let w={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(w.boundary=4,w.storage=4):x.isVector2?(w.boundary=8,w.storage=8):x.isVector3||x.isColor?(w.boundary=16,w.storage=12):x.isVector4?(w.boundary=16,w.storage=16):x.isMatrix3?(w.boundary=48,w.storage=48):x.isMatrix4?(w.boundary=64,w.storage=64):x.isTexture?Qt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(x)?(w.boundary=16,w.storage=x.byteLength):Qt("WebGLRenderer: Unsupported uniform value type.",x),w}function v(x){let w=x.target;w.removeEventListener("dispose",v);let M=o.indexOf(w.__bindingPointIndex);o.splice(M,1),r.deleteBuffer(i[w.id]),delete i[w.id],delete s[w.id]}function S(){for(let x in i)r.deleteBuffer(i[x]);o=[],i={},s={}}return{bind:l,update:c,dispose:S}}var NT=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),mr=null;function FT(){return mr===null&&(mr=new $o(NT,16,16,ms,Qi),mr.name="DFG_LUT",mr.minFilter=Je,mr.magFilter=Je,mr.wrapS=Ni,mr.wrapT=Ni,mr.generateMipmaps=!1,mr.needsUpdate=!0),mr}var Gu=class{constructor(t={}){let{canvas:e=e_(),context:n=null,depth:i=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1,outputBufferType:d=Bn}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;let _=d,g=new Set([ou,su,ru]),m=new Set([Bn,Ki,sa,oa,nu,iu]),v=new Uint32Array(4),S=new Int32Array(4),x=new z,w=null,M=null,E=[],y=[],b=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=$i,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let A=this,R=!1,P=null,N=null,L=null,F=null;this._outputColorSpace=Ze;let k=0,B=0,$=null,W=-1,D=null,Q=new ve,Ct=new ve,yt=null,Bt=new ee(0),st=0,bt=e.width,q=e.height,j=1,dt=null,zt=null,xt=new ve(0,0,bt,q),Ot=new ve(0,0,bt,q),Nt=!1,et=new Ko,ot=!1,ct=!1,U=new Ue,mt=new z,Ht=new ve,Y={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ft=!1;function It(){return $===null?j:1}let O=n;function jt(C,H){return e.getContext(C,H)}let Ft,I,T,G,X,tt,gt,ht,nt,it,Mt,Gt,Et,wt,_t,qt,Kt,V,St,rt,At,Pt,at;try{let C={alpha:!0,depth:i,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"186"}`),e.addEventListener("webglcontextlost",Jt,!1),e.addEventListener("webglcontextrestored",ut,!1),e.addEventListener("webglcontextcreationerror",$t,!1),O===null){let H="webgl2";if(O=jt(H,C),O===null)throw jt(H)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}pt()}catch(C){throw e.removeEventListener("webglcontextlost",Jt,!1),e.removeEventListener("webglcontextrestored",ut,!1),e.removeEventListener("webglcontextcreationerror",$t,!1),te("WebGLRenderer: "+C.message),C}function pt(){Ft=new H1(O),Ft.init(),At=new CT(O,Ft),I=new D1(O,Ft,t,At),T=new ET(O,Ft),I.reversedDepthBuffer&&f&&T.buffers.depth.setReversed(!0),N=O.createFramebuffer(),L=O.createFramebuffer(),F=O.createFramebuffer(),G=new X1(O),X=new fT,tt=new AT(O,Ft,T,X,I,At,G),gt=new V1(A),ht=new qS(O),Pt=new P1(O,ht),nt=new G1(O,ht,G,Pt),it=new q1(O,nt,ht,Pt,G),V=new Y1(O,I,tt),_t=new L1(X),Mt=new uT(A,gt,Ft,I,Pt,_t),Gt=new DT(A,X),Et=new pT,wt=new yT(Ft),Kt=new R1(A,gt,T,it,p,l),qt=new TT(A,it,I),at=new LT(O,G,I,T),St=new I1(O,Ft,G),rt=new W1(O,Ft,G),G.programs=Mt.programs,A.capabilities=I,A.extensions=Ft,A.properties=X,A.renderLists=Et,A.shadowMap=qt,A.state=T,A.info=G}_!==Bn&&(b=new J1(_,e.width,e.height,a,i,s));let lt=new Np(A,O);this.xr=lt,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){let C=Ft.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){let C=Ft.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return j},this.setPixelRatio=function(C){C!==void 0&&(j=C,this.setSize(bt,q,!1))},this.getSize=function(C){return C.set(bt,q)},this.setSize=function(C,H,K=!0){if(lt.isPresenting){Qt("WebGLRenderer: Can't change size while VR device is presenting.");return}bt=C,q=H,e.width=Math.floor(C*j),e.height=Math.floor(H*j),K===!0&&(e.style.width=C+"px",e.style.height=H+"px"),b!==null&&b.setSize(e.width,e.height),this.setViewport(0,0,C,H)},this.getDrawingBufferSize=function(C){return C.set(bt*j,q*j).floor()},this.setDrawingBufferSize=function(C,H,K){bt=C,q=H,j=K,e.width=Math.floor(C*K),e.height=Math.floor(H*K),this.setViewport(0,0,C,H)},this.setEffects=function(C){if(_===Bn){te("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(C){for(let H=0;H<C.length;H++)if(C[H].isOutputPass===!0){Qt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}b.setEffects(C||[])},this.getCurrentViewport=function(C){return C.copy(Q)},this.getViewport=function(C){return C.copy(xt)},this.setViewport=function(C,H,K,Z){C.isVector4?xt.set(C.x,C.y,C.z,C.w):xt.set(C,H,K,Z),T.viewport(Q.copy(xt).multiplyScalar(j).round())},this.getScissor=function(C){return C.copy(Ot)},this.setScissor=function(C,H,K,Z){C.isVector4?Ot.set(C.x,C.y,C.z,C.w):Ot.set(C,H,K,Z),T.scissor(Ct.copy(Ot).multiplyScalar(j).round())},this.getScissorTest=function(){return Nt},this.setScissorTest=function(C){T.setScissorTest(Nt=C)},this.setOpaqueSort=function(C){dt=C},this.setTransparentSort=function(C){zt=C},this.getClearColor=function(C){return C.copy(Kt.getClearColor())},this.setClearColor=function(){Kt.setClearColor(...arguments)},this.getClearAlpha=function(){return Kt.getClearAlpha()},this.setClearAlpha=function(){Kt.setClearAlpha(...arguments)},this.clear=function(C=!0,H=!0,K=!0){let Z=0;if(C){let J=!1;if($!==null){let Rt=$.texture.format;J=g.has(Rt)}if(J){let Rt=$.texture.type,kt=m.has(Rt),Lt=Kt.getClearColor(),Xt=Kt.getClearAlpha(),Zt=Lt.r,se=Lt.g,fe=Lt.b;kt?(v[0]=Zt,v[1]=se,v[2]=fe,v[3]=Xt,O.clearBufferuiv(O.COLOR,0,v)):(S[0]=Zt,S[1]=se,S[2]=fe,S[3]=Xt,O.clearBufferiv(O.COLOR,0,S))}else Z|=O.COLOR_BUFFER_BIT}H&&(Z|=O.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),K&&(Z|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),Z!==0&&O.clear(Z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(C){C.setRenderer(this),P=C},this.dispose=function(){e.removeEventListener("webglcontextlost",Jt,!1),e.removeEventListener("webglcontextrestored",ut,!1),e.removeEventListener("webglcontextcreationerror",$t,!1),Kt.dispose(),Et.dispose(),wt.dispose(),X.dispose(),gt.dispose(),it.dispose(),Pt.dispose(),at.dispose(),Mt.dispose(),lt.dispose(),lt.removeEventListener("sessionstart",Ne),lt.removeEventListener("sessionend",Ae),me.stop()};function Jt(C){C.preventDefault(),cl("WebGLRenderer: Context Lost."),R=!0}function ut(){cl("WebGLRenderer: Context Restored."),R=!1;let C=G.autoReset,H=qt.enabled,K=qt.autoUpdate,Z=qt.needsUpdate,J=qt.type;pt(),G.autoReset=C,qt.enabled=H,qt.autoUpdate=K,qt.needsUpdate=Z,qt.type=J}function $t(C){te("WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function Wt(C){let H=C.target;H.removeEventListener("dispose",Wt),ne(H)}function ne(C){tn(C),X.remove(C)}function tn(C){let H=X.get(C).programs;H!==void 0&&(H.forEach(function(K){Mt.releaseProgram(K)}),C.isShaderMaterial&&Mt.releaseShaderCache(C))}this.renderBufferDirect=function(C,H,K,Z,J,Rt){H===null&&(H=Y);let kt=J.isMesh&&J.matrixWorld.determinantAffine()<0,Lt=dn(C,H,K,Z,J);T.setMaterial(Z,kt);let Xt=K.index,Zt=1;if(Z.wireframe===!0){if(Xt=nt.getWireframeAttribute(K),Xt===void 0)return;Zt=2}let se=K.drawRange,fe=K.attributes.position,Yt=se.start*Zt,ye=(se.start+se.count)*Zt;Rt!==null&&(Yt=Math.max(Yt,Rt.start*Zt),ye=Math.min(ye,(Rt.start+Rt.count)*Zt)),Xt!==null?(Yt=Math.max(Yt,0),ye=Math.min(ye,Xt.count)):fe!=null&&(Yt=Math.max(Yt,0),ye=Math.min(ye,fe.count));let nn=ye-Yt;if(nn<0||nn===1/0)return;Pt.setup(J,Z,Lt,K,Xt);let Fe,Ce=St;if(Xt!==null&&(Fe=ht.get(Xt),Ce=rt,Ce.setIndex(Fe)),J.isMesh)Z.wireframe===!0?(T.setLineWidth(Z.wireframeLinewidth*It()),Ce.setMode(O.LINES)):Ce.setMode(O.TRIANGLES);else if(J.isLine){let An=Z.linewidth;An===void 0&&(An=1),T.setLineWidth(An*It()),J.isLineSegments?Ce.setMode(O.LINES):J.isLineLoop?Ce.setMode(O.LINE_LOOP):Ce.setMode(O.LINE_STRIP)}else J.isPoints?Ce.setMode(O.POINTS):J.isSprite&&Ce.setMode(O.TRIANGLES);if(J.isBatchedMesh)if(Ft.get("WEBGL_multi_draw"))Ce.renderMultiDraw(J._multiDrawStarts,J._multiDrawCounts,J._multiDrawCount);else{let An=J._multiDrawStarts,Ut=J._multiDrawCounts,Hn=J._multiDrawCount,_e=Xt?ht.get(Xt).bytesPerElement:1,Ei=X.get(Z).currentProgram.getUniforms();for(let nr=0;nr<Hn;nr++)Ei.setValue(O,"_gl_DrawID",nr),Ce.render(An[nr]/_e,Ut[nr])}else if(J.isInstancedMesh)Ce.renderInstances(Yt,nn,J.count);else if(K.isInstancedBufferGeometry){let An=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,Ut=Math.min(K.instanceCount,An);Ce.renderInstances(Yt,nn,Ut)}else Ce.render(Yt,nn)};function he(C,H,K,Z){P!==null&&C.isNodeMaterial&&P.setObject(Z,C),ot===!0&&_t.setState(C,K,!1),C.transparent===!0&&C.side===ki&&C.forceSinglePass===!1?(C.side=Tn,C.needsUpdate=!0,We(C,H,Z),C.side=us,C.needsUpdate=!0,We(C,H,Z),C.side=ki):We(C,H,Z)}this.compile=function(C,H,K=null){K===null&&(K=C),P!==null&&P.renderStart(C,H,K),M=wt.get(K),M.init(H),y.push(M),K.traverseVisible(function(J){J.isLight&&J.layers.test(H.layers)&&(M.pushLight(J),J.castShadow&&M.pushShadow(J))}),C!==K&&C.traverseVisible(function(J){J.isLight&&J.layers.test(H.layers)&&(M.pushLight(J),J.castShadow&&M.pushShadow(J))}),M.setupLights(),P!==null&&P.updateLights(M.state.lightsArray),ct=this.localClippingEnabled,ot=_t.init(this.clippingPlanes,ct),ot===!0&&_t.setGlobalState(this.clippingPlanes,H),P!==null&&qt.render(M.state.shadowsArray,K,H);let Z=new Set;return C.traverse(function(J){if(!(J.isMesh||J.isPoints||J.isLine||J.isSprite))return;let Rt=J.material;if(Rt)if(Array.isArray(Rt))for(let kt=0;kt<Rt.length;kt++){let Lt=Rt[kt];he(Lt,K,H,J),Z.add(Lt)}else he(Rt,K,H,J),Z.add(Rt)}),M=y.pop(),P!==null&&P.renderEnd(),Z},this.compileAsync=function(C,H,K=null){let Z=this.compile(C,H,K);return new Promise(J=>{function Rt(){if(Z.forEach(function(kt){let Xt=X.get(kt).currentProgram;(Xt===void 0||Xt.isReady())&&Z.delete(kt)}),Z.size===0){J(C);return}setTimeout(Rt,10)}Ft.get("KHR_parallel_shader_compile")!==null?Rt():setTimeout(Rt,10)})};let Le=null;function fn(C){Le&&Le(C)}function Ne(){me.stop()}function Ae(){me.start()}let me=new F_;me.setAnimationLoop(fn),typeof self<"u"&&me.setContext(self),this.setAnimationLoop=function(C){Le=C,lt.setAnimationLoop(C),C===null?me.stop():me.start()},lt.addEventListener("sessionstart",Ne),lt.addEventListener("sessionend",Ae),this.render=function(C,H){if(H!==void 0&&H.isCamera!==!0){te("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;P!==null&&P.renderStart(C,H);let K=lt.enabled===!0&&lt.isPresenting===!0,Z=b!==null&&($===null||K)&&b.begin(A,$);if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),H.parent===null&&H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),lt.enabled===!0&&lt.isPresenting===!0&&(b===null||b.isCompositing()===!1)&&(lt.cameraAutoUpdate===!0&&lt.updateCamera(H),H=lt.getCamera()),C.isScene===!0&&C.onBeforeRender(A,C,H,$),M=wt.get(C,y.length),M.init(H),M.state.textureUnits=tt.getTextureUnits(),y.push(M),U.multiplyMatrices(H.projectionMatrix,H.matrixWorldInverse),et.setFromProjectionMatrix(U,Zi,H.reversedDepth),ct=this.localClippingEnabled,ot=_t.init(this.clippingPlanes,ct),w=Et.get(C,E.length),w.init(),E.push(w),lt.enabled===!0&&lt.isPresenting===!0){let kt=A.xr.getDepthSensingMesh();kt!==null&&zn(kt,H,-1/0,A.sortObjects)}zn(C,H,0,A.sortObjects),w.finish(),P!==null&&P.updateLights(M.state.lightsArray),A.sortObjects===!0&&w.sort(dt,zt),ft=lt.enabled===!1||lt.isPresenting===!1||lt.hasDepthSensing()===!1,ft&&Kt.addToRenderList(w,C),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ot===!0&&_t.beginShadows();let J=M.state.shadowsArray;if(qt.render(J,C,H),ot===!0&&_t.endShadows(),(Z&&b.hasRenderPass())===!1){let kt=w.opaque,Lt=w.transmissive;if(M.setupLights(),H.isArrayCamera){let Xt=H.cameras;if(Lt.length>0)for(let Zt=0,se=Xt.length;Zt<se;Zt++){let fe=Xt[Zt];En(kt,Lt,C,fe)}ft&&Kt.render(C);for(let Zt=0,se=Xt.length;Zt<se;Zt++){let fe=Xt[Zt];Ie(w,C,fe,fe.viewport)}}else Lt.length>0&&En(kt,Lt,C,H),ft&&Kt.render(C),Ie(w,C,H)}$!==null&&B===0&&(tt.updateMultisampleRenderTarget($),tt.updateRenderTargetMipmap($)),Z&&b.end(A),C.isScene===!0&&C.onAfterRender(A,C,H),Pt.resetDefaultState(),W=-1,D=null,y.pop(),y.length>0?(M=y[y.length-1],tt.setTextureUnits(M.state.textureUnits),ot===!0&&_t.setGlobalState(A.clippingPlanes,M.state.camera)):M=null,E.pop(),E.length>0?w=E[E.length-1]:w=null,P!==null&&P.renderEnd()};function zn(C,H,K,Z){if(C.visible===!1)return;if(C.layers.test(H.layers)){if(C.isGroup)K=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(H);else if(C.isLightProbeGrid)M.pushLightProbeGrid(C);else if(C.isLight)M.pushLight(C),C.castShadow&&M.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||C.intersectsFrustum(et)){Z&&Ht.setFromMatrixPosition(C.matrixWorld).applyMatrix4(U);let kt=it.update(C),Lt=C.material;Lt.visible&&w.push(C,kt,Lt,K,Ht.z,null,H)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||C.intersectsFrustum(et))){let kt=it.update(C),Lt=C.material;if(Z&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),Ht.copy(C.boundingSphere.center)):(kt.boundingSphere===null&&kt.computeBoundingSphere(),Ht.copy(kt.boundingSphere.center)),Ht.applyMatrix4(C.matrixWorld).applyMatrix4(U)),Array.isArray(Lt)){let Xt=kt.groups;for(let Zt=0,se=Xt.length;Zt<se;Zt++){let fe=Xt[Zt],Yt=Lt[fe.materialIndex];Yt&&Yt.visible&&w.push(C,kt,Yt,K,Ht.z,fe,H)}}else Lt.visible&&w.push(C,kt,Lt,K,Ht.z,null,H)}}let Rt=C.children;for(let kt=0,Lt=Rt.length;kt<Lt;kt++)zn(Rt[kt],H,K,Z)}function Ie(C,H,K,Z){let{opaque:J,transmissive:Rt,transparent:kt}=C;M.setupLightsView(K),ot===!0&&_t.setGlobalState(A.clippingPlanes,K),Z&&T.viewport(Q.copy(Z)),J.length>0&&Vn(J,H,K),Rt.length>0&&Vn(Rt,H,K),kt.length>0&&Vn(kt,H,K),T.buffers.depth.setTest(!0),T.buffers.depth.setMask(!0),T.buffers.color.setMask(!0),T.setPolygonOffset(!1)}function En(C,H,K,Z){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;if(M.state.transmissionRenderTarget[Z.id]===void 0){let Yt=Ft.has("EXT_color_buffer_half_float")||Ft.has("EXT_color_buffer_float");M.state.transmissionRenderTarget[Z.id]=new ci(1,1,{generateMipmaps:!0,type:Yt?Qi:Bn,minFilter:ds,samples:Math.max(4,I.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:pe.workingColorSpace})}let Rt=M.state.transmissionRenderTarget[Z.id],kt=Z.viewport||Q;Rt.setSize(kt.z*A.transmissionResolutionScale,kt.w*A.transmissionResolutionScale);let Lt=A.getRenderTarget(),Xt=A.getActiveCubeFace(),Zt=A.getActiveMipmapLevel();A.setRenderTarget(Rt),A.getClearColor(Bt),st=A.getClearAlpha(),st<1&&A.setClearColor(16777215,.5),A.clear(),ft&&Kt.render(K);let se=A.toneMapping;A.toneMapping=$i;let fe=Z.viewport;if(Z.viewport!==void 0&&(Z.viewport=void 0),M.setupLightsView(Z),ot===!0&&_t.setGlobalState(A.clippingPlanes,Z),Vn(C,K,Z),tt.updateMultisampleRenderTarget(Rt),tt.updateRenderTargetMipmap(Rt),Ft.has("WEBGL_multisampled_render_to_texture")===!1){let Yt=!1;for(let ye=0,nn=H.length;ye<nn;ye++){let Fe=H[ye],{object:Ce,geometry:An,material:Ut,group:Hn}=Fe;if(Ut.side===ki&&Ce.layers.test(Z.layers)){let _e=Ut.side;Ut.side=Tn,Ut.needsUpdate=!0,en(Ce,K,Z,An,Ut,Hn),Ut.side=_e,Ut.needsUpdate=!0,Yt=!0}}Yt===!0&&(tt.updateMultisampleRenderTarget(Rt),tt.updateRenderTargetMipmap(Rt))}A.setRenderTarget(Lt,Xt,Zt),A.setClearColor(Bt,st),fe!==void 0&&(Z.viewport=fe),A.toneMapping=se}function Vn(C,H,K){let Z=H.isScene===!0?H.overrideMaterial:null;for(let J=0,Rt=C.length;J<Rt;J++){let kt=C[J],{object:Lt,geometry:Xt,group:Zt}=kt,se=kt.material;se.allowOverride===!0&&Z!==null&&(se=Z),Lt.layers.test(K.layers)&&en(Lt,H,K,Xt,se,Zt)}}function en(C,H,K,Z,J,Rt){P!==null&&J.isNodeMaterial&&P.setObject(C,J),C.onBeforeRender(A,H,K,Z,J,Rt),C.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),J.onBeforeRender(A,H,K,Z,C,Rt),J.transparent===!0&&J.side===ki&&J.forceSinglePass===!1?(J.side=Tn,J.needsUpdate=!0,A.renderBufferDirect(K,H,Z,J,C,Rt),J.side=us,J.needsUpdate=!0,A.renderBufferDirect(K,H,Z,J,C,Rt),J.side=ki):A.renderBufferDirect(K,H,Z,J,C,Rt),C.onAfterRender(A,H,K,Z,J,Rt)}function We(C,H,K){H.isScene!==!0&&(H=Y);let Z=X.get(C),J=M.state.lights,Rt=M.state.shadowsArray,kt=J.state.version,Lt=Mt.getParameters(C,J.state,Rt,H,K,M.state.lightProbeGridArray),Xt=Mt.getProgramCacheKey(Lt),Zt=Z.programs;Z.environment=C.isMeshStandardMaterial||C.isMeshLambertMaterial||C.isMeshPhongMaterial?H.environment:null,Z.fog=H.fog;let se=C.isMeshStandardMaterial||C.isMeshLambertMaterial&&!C.envMap||C.isMeshPhongMaterial&&!C.envMap;Z.envMap=gt.get(C.envMap||Z.environment,se),Z.envMapRotation=Z.environment!==null&&C.envMap===null?H.environmentRotation:C.envMapRotation,Zt===void 0&&(C.addEventListener("dispose",Wt),Zt=new Map,Z.programs=Zt);let fe=Zt.get(Xt);if(fe!==void 0){if(Z.currentProgram===fe&&Z.lightsStateVersion===kt)return er(C,Lt),fe}else Lt.uniforms=Mt.getUniforms(C),P!==null&&C.isNodeMaterial&&P.build(C,K,Lt),C.onBeforeCompile(Lt,A),fe=Mt.acquireProgram(Lt,Xt),Zt.set(Xt,fe),Z.uniforms=Lt.uniforms;let Yt=Z.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Yt.clippingPlanes=_t.uniform),er(C,Lt),Z.needsLights=Ti(C),Z.lightsStateVersion=kt,Z.needsLights&&(Yt.ambientLightColor.value=J.state.ambient,Yt.lightProbe.value=J.state.probe,Yt.sunLights.value=J.state.sun,Yt.sunLightShadows.value=J.state.sunShadow,Yt.directionalLights.value=J.state.directional,Yt.directionalLightShadows.value=J.state.directionalShadow,Yt.spotLights.value=J.state.spot,Yt.spotLightShadows.value=J.state.spotShadow,Yt.rectAreaLights.value=J.state.rectArea,Yt.ltc_1.value=J.state.rectAreaLTC1,Yt.ltc_2.value=J.state.rectAreaLTC2,Yt.pointLights.value=J.state.point,Yt.pointLightShadows.value=J.state.pointShadow,Yt.hemisphereLights.value=J.state.hemi,Yt.sunShadowMatrix.value=J.state.sunShadowMatrix,Yt.sunShadowCascade.value=J.state.sunShadowCascade,Yt.directionalShadowMatrix.value=J.state.directionalShadowMatrix,Yt.spotLightMatrix.value=J.state.spotLightMatrix,Yt.spotLightMap.value=J.state.spotLightMap,Yt.pointShadowMatrix.value=J.state.pointShadowMatrix),Z.lightProbeGrid=M.state.lightProbeGridArray.length>0,Z.currentProgram=fe,Z.uniformsList=null,fe}function an(C){if(C.uniformsList===null){let H=C.currentProgram.getUniforms();C.uniformsList=ca.seqWithValue(H.seq,C.uniforms)}return C.uniformsList}function er(C,H){let K=X.get(C);K.outputColorSpace=H.outputColorSpace,K.batching=H.batching,K.batchingColor=H.batchingColor,K.instancing=H.instancing,K.instancingColor=H.instancingColor,K.instancingMorph=H.instancingMorph,K.skinning=H.skinning,K.morphTargets=H.morphTargets,K.morphNormals=H.morphNormals,K.morphColors=H.morphColors,K.morphTargetsCount=H.morphTargetsCount,K.numClippingPlanes=H.numClippingPlanes,K.numIntersection=H.numClipIntersection,K.vertexAlphas=H.vertexAlphas,K.vertexTangents=H.vertexTangents,K.toneMapping=H.toneMapping}function js(C,H){if(C.length===0)return null;if(C.length===1)return C[0].texture!==null?C[0]:null;x.setFromMatrixPosition(H.matrixWorld);for(let K=0,Z=C.length;K<Z;K++){let J=C[K];if(J.texture!==null&&J.boundingBox.containsPoint(x))return J}return null}function dn(C,H,K,Z,J){H.isScene!==!0&&(H=Y),tt.resetTextureUnits();let Rt=H.fog,kt=Z.isMeshStandardMaterial||Z.isMeshLambertMaterial||Z.isMeshPhongMaterial?H.environment:null,Lt=$===null?A.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:pe.workingColorSpace,Xt=Z.isMeshStandardMaterial||Z.isMeshLambertMaterial&&!Z.envMap||Z.isMeshPhongMaterial&&!Z.envMap,Zt=gt.get(Z.envMap||kt,Xt),se=Z.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,fe=!!K.attributes.tangent&&(!!Z.normalMap||Z.anisotropy>0),Yt=!!K.morphAttributes.position,ye=!!K.morphAttributes.normal,nn=!!K.morphAttributes.color,Fe=$i;Z.toneMapped&&($===null||$.isXRRenderTarget===!0)&&(Fe=A.toneMapping);let Ce=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,An=Ce!==void 0?Ce.length:0,Ut=X.get(Z),Hn=M.state.lights;if(ot===!0&&(ct===!0||C!==D)){let De=C===D&&Z.id===W;_t.setState(Z,C,De)}let _e=!1;Z.version===Ut.__version?(Ut.needsLights&&Ut.lightsStateVersion!==Hn.state.version||Ut.outputColorSpace!==Lt||J.isBatchedMesh&&Ut.batching===!1||!J.isBatchedMesh&&Ut.batching===!0||J.isBatchedMesh&&Ut.batchingColor===!0&&J._colorsTexture===null||J.isBatchedMesh&&Ut.batchingColor===!1&&J._colorsTexture!==null||J.isInstancedMesh&&Ut.instancing===!1||!J.isInstancedMesh&&Ut.instancing===!0||J.isSkinnedMesh&&Ut.skinning===!1||!J.isSkinnedMesh&&Ut.skinning===!0||J.isInstancedMesh&&Ut.instancingColor===!0&&J.instanceColor===null||J.isInstancedMesh&&Ut.instancingColor===!1&&J.instanceColor!==null||J.isInstancedMesh&&Ut.instancingMorph===!0&&J.morphTexture===null||J.isInstancedMesh&&Ut.instancingMorph===!1&&J.morphTexture!==null||Ut.envMap!==Zt||Z.fog===!0&&Ut.fog!==Rt||Ut.numClippingPlanes!==void 0&&(Ut.numClippingPlanes!==_t.numPlanes||Ut.numIntersection!==_t.numIntersection)||Ut.vertexAlphas!==se||Ut.vertexTangents!==fe||Ut.morphTargets!==Yt||Ut.morphNormals!==ye||Ut.morphColors!==nn||Ut.toneMapping!==Fe||Ut.morphTargetsCount!==An||!!Ut.lightProbeGrid!=M.state.lightProbeGridArray.length>0)&&(_e=!0):(_e=!0,Ut.__version=Z.version);let Ei=Ut.currentProgram;_e===!0&&(Ei=We(Z,H,J),P&&Z.isNodeMaterial&&P.onUpdateProgram(Z,Ei,Ut));let nr=!1,Ur=!1,to=!1,Ee=Ei.getUniforms(),Ke=Ut.uniforms;if(T.useProgram(Ei.program)&&(nr=!0,Ur=!0,to=!0),Z.id!==W&&(W=Z.id,Ur=!0),Ut.needsLights){let De=js(M.state.lightProbeGridArray,J);Ut.lightProbeGrid!==De&&(Ut.lightProbeGrid=De,Ur=!0)}if(nr||D!==C){T.buffers.depth.getReversed()&&C.reversedDepth!==!0&&(C._reversedDepth=!0,C.updateProjectionMatrix()),Ee.setValue(O,"projectionMatrix",C.projectionMatrix),Ee.setValue(O,"viewMatrix",C.matrixWorldInverse);let kr=Ee.map.cameraPosition;kr!==void 0&&kr.setValue(O,mt.setFromMatrixPosition(C.matrixWorld)),I.logarithmicDepthBuffer&&Ee.setValue(O,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(Z.isMeshPhongMaterial||Z.isMeshToonMaterial||Z.isMeshLambertMaterial||Z.isMeshBasicMaterial||Z.isMeshStandardMaterial||Z.isShaderMaterial)&&Ee.setValue(O,"isOrthographic",C.isOrthographicCamera===!0),D!==C&&(D=C,Ur=!0,to=!0)}if(Ut.needsLights&&(Hn.state.sunShadowMap.length>0&&Ee.setValue(O,"sunShadowMap",Hn.state.sunShadowMap,tt),Hn.state.directionalShadowMap.length>0&&Ee.setValue(O,"directionalShadowMap",Hn.state.directionalShadowMap,tt),Hn.state.spotShadowMap.length>0&&Ee.setValue(O,"spotShadowMap",Hn.state.spotShadowMap,tt),Hn.state.pointShadowMap.length>0&&Ee.setValue(O,"pointShadowMap",Hn.state.pointShadowMap,tt)),J.isSkinnedMesh){Ee.setOptional(O,J,"bindMatrix"),Ee.setOptional(O,J,"bindMatrixInverse");let De=J.skeleton;De&&(De.boneTexture===null&&De.computeBoneTexture(),Ee.setValue(O,"boneTexture",De.boneTexture,tt))}J.isBatchedMesh&&(Ee.setOptional(O,J,"batchingTexture"),Ee.setValue(O,"batchingTexture",J._matricesTexture,tt),Ee.setOptional(O,J,"batchingIdTexture"),Ee.setValue(O,"batchingIdTexture",J._indirectTexture,tt),Ee.setOptional(O,J,"batchingColorTexture"),J._colorsTexture!==null&&Ee.setValue(O,"batchingColorTexture",J._colorsTexture,tt));let Br=K.morphAttributes;if((Br.position!==void 0||Br.normal!==void 0||Br.color!==void 0)&&V.update(J,K,Ei),(Ur||Ut.receiveShadow!==J.receiveShadow)&&(Ut.receiveShadow=J.receiveShadow,Ee.setValue(O,"receiveShadow",J.receiveShadow)),(Z.isMeshStandardMaterial||Z.isMeshLambertMaterial||Z.isMeshPhongMaterial)&&Z.envMap===null&&H.environment!==null&&(Ke.envMapIntensity.value=H.environmentIntensity),Ke.dfgLUT!==void 0&&(Ke.dfgLUT.value=FT()),Ur){if(Ee.setValue(O,"toneMappingExposure",A.toneMappingExposure),Ut.needsLights&&$e(Ke,to),Rt&&Z.fog===!0&&Gt.refreshFogUniforms(Ke,Rt),Gt.refreshMaterialUniforms(Ke,Z,j,q,M.state.transmissionRenderTarget[C.id]),Ut.needsLights&&Ut.lightProbeGrid){let De=Ut.lightProbeGrid;Ke.probesSH.value=De.texture,Ke.probesMin.value.copy(De.boundingBox.min),Ke.probesMax.value.copy(De.boundingBox.max),Ke.probesResolution.value.copy(De.resolution)}ca.upload(O,an(Ut),Ke,tt)}if(Z.isShaderMaterial&&Z.uniformsNeedUpdate===!0&&(ca.upload(O,an(Ut),Ke,tt),Z.uniformsNeedUpdate=!1),Z.isSpriteMaterial&&Ee.setValue(O,"center",J.center),Ee.setValue(O,"modelViewMatrix",J.modelViewMatrix),Ee.setValue(O,"normalMatrix",J.normalMatrix),Ee.setValue(O,"modelMatrix",J.matrixWorld),Z.uniformsGroups!==void 0){let De=Z.uniformsGroups;for(let kr=0,eo=De.length;kr<eo;kr++){let Gp=De[kr];at.update(Gp,Ei),at.bind(Gp,Ei)}}return Ei}function $e(C,H){C.ambientLightColor.needsUpdate=H,C.lightProbe.needsUpdate=H,C.sunLights.needsUpdate=H,C.sunLightShadows.needsUpdate=H,C.directionalLights.needsUpdate=H,C.directionalLightShadows.needsUpdate=H,C.pointLights.needsUpdate=H,C.pointLightShadows.needsUpdate=H,C.spotLights.needsUpdate=H,C.spotLightShadows.needsUpdate=H,C.rectAreaLights.needsUpdate=H,C.hemisphereLights.needsUpdate=H}function Ti(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return k},this.getActiveMipmapLevel=function(){return B},this.getRenderTarget=function(){return $},this.setRenderTargetTextures=function(C,H,K){let Z=X.get(C);Z.__autoAllocateDepthBuffer=C.resolveDepthBuffer===!1,Z.__autoAllocateDepthBuffer===!1&&(Z.__useRenderToTexture=!1),X.get(C.texture).__webglTexture=H,X.get(C.depthTexture).__webglTexture=Z.__autoAllocateDepthBuffer?void 0:K,Z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(C,H){let K=X.get(C);K.__webglFramebuffer=H,K.__useDefaultFramebuffer=H===void 0},this.setRenderTarget=function(C,H=0,K=0){$=C,k=H,B=K;let Z=null,J=!1,Rt=!1;if(C){let Lt=X.get(C);if(Lt.__useDefaultFramebuffer!==void 0){T.bindFramebuffer(O.FRAMEBUFFER,Lt.__webglFramebuffer),Q.copy(C.viewport),Ct.copy(C.scissor),yt=C.scissorTest,T.viewport(Q),T.scissor(Ct),T.setScissorTest(yt),W=-1;return}else if(Lt.__webglFramebuffer===void 0)tt.setupRenderTarget(C);else if(Lt.__hasExternalTextures)tt.rebindTextures(C,X.get(C.texture).__webglTexture,X.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){let se=C.depthTexture;if(Lt.__boundDepthTexture!==se){if(se!==null&&X.has(se)&&(C.width!==se.image.width||C.height!==se.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");tt.setupDepthRenderbuffer(C)}}let Xt=C.texture;(Xt.isData3DTexture||Xt.isDataArrayTexture||Xt.isCompressedArrayTexture)&&(Rt=!0);let Zt=X.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(Zt[H])?Z=Zt[H][K]:Z=Zt[H],J=!0):C.samples>0&&tt.useMultisampledRTT(C)===!1?Z=X.get(C).__webglMultisampledFramebuffer:Array.isArray(Zt)?Z=Zt[K]:Z=Zt,Q.copy(C.viewport),Ct.copy(C.scissor),yt=C.scissorTest}else Q.copy(xt).multiplyScalar(j).floor(),Ct.copy(Ot).multiplyScalar(j).floor(),yt=Nt;if(K!==0&&(Z=N),T.bindFramebuffer(O.FRAMEBUFFER,Z)&&T.drawBuffers(C,Z),T.viewport(Q),T.scissor(Ct),T.setScissorTest(yt),J){let Lt=X.get(C.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+H,Lt.__webglTexture,K)}else if(Rt){let Lt=H;for(let Xt=0;Xt<C.textures.length;Xt++){let Zt=X.get(C.textures[Xt]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+Xt,Zt.__webglTexture,K,Lt)}}else if(C!==null&&K!==0){let Lt=X.get(C.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Lt.__webglTexture,K)}W=-1};function Qs(C){let H=X.get(C);return(H.__readFormat!==C.format||H.__readType!==C.type)&&(H.__readFormat=C.format,H.__readType=C.type,H.__formatReadable=I.textureFormatReadable(C.format),H.__typeReadable=I.textureTypeReadable(C.type)),H}this.readRenderTargetPixels=function(C,H,K,Z,J,Rt,kt,Lt=0){if(!(C&&C.isWebGLRenderTarget)){te("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Xt=X.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&kt!==void 0&&(Xt=Xt[kt]),Xt){T.bindFramebuffer(O.FRAMEBUFFER,Xt);try{let Zt=C.textures[Lt],se=Zt.format,fe=Zt.type;C.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Lt);let Yt=Qs(Zt);if(Yt.__formatReadable===!1){te("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Yt.__typeReadable===!1){te("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}H>=0&&H<=C.width-Z&&K>=0&&K<=C.height-J&&O.readPixels(H,K,Z,J,At.convert(se),At.convert(fe),Rt)}finally{let Zt=$!==null?X.get($).__webglFramebuffer:null;T.bindFramebuffer(O.FRAMEBUFFER,Zt)}}},this.readRenderTargetPixelsAsync=async function(C,H,K,Z,J,Rt,kt,Lt=0){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Xt=X.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&kt!==void 0&&(Xt=Xt[kt]),Xt)if(H>=0&&H<=C.width-Z&&K>=0&&K<=C.height-J){T.bindFramebuffer(O.FRAMEBUFFER,Xt);let Zt=C.textures[Lt],se=Zt.format,fe=Zt.type;C.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Lt);let Yt=Qs(Zt);if(Yt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Yt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let ye=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,ye),O.bufferData(O.PIXEL_PACK_BUFFER,Rt.byteLength,O.STREAM_READ),O.readPixels(H,K,Z,J,At.convert(se),At.convert(fe),0),O.bindBuffer(O.PIXEL_PACK_BUFFER,null);let nn=$!==null?X.get($).__webglFramebuffer:null;T.bindFramebuffer(O.FRAMEBUFFER,nn);let Fe=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await i_(O,Fe,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,ye),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,Rt),O.bindBuffer(O.PIXEL_PACK_BUFFER,null),O.deleteBuffer(ye),O.deleteSync(Fe),Rt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(C,H=null,K=0){let Z=Math.pow(2,-K),J=Math.floor(C.image.width*Z),Rt=Math.floor(C.image.height*Z),kt=H!==null?H.x:0,Lt=H!==null?H.y:0;tt.setTexture2D(C,0),O.copyTexSubImage2D(O.TEXTURE_2D,K,0,0,kt,Lt,J,Rt),T.unbindTexture()},this.copyTextureToTexture=function(C,H,K=null,Z=null,J=0,Rt=0){let kt,Lt,Xt,Zt,se,fe,Yt,ye,nn,Fe=C.isCompressedTexture?C.mipmaps[Rt]:C.image;if(K!==null)kt=K.max.x-K.min.x,Lt=K.max.y-K.min.y,Xt=K.isBox3?K.max.z-K.min.z:1,Zt=K.min.x,se=K.min.y,fe=K.isBox3?K.min.z:0;else{let Ke=Math.pow(2,-J);kt=Math.floor(Fe.width*Ke),Lt=Math.floor(Fe.height*Ke),C.isDataArrayTexture?Xt=Fe.depth:C.isData3DTexture?Xt=Math.floor(Fe.depth*Ke):Xt=1,Zt=0,se=0,fe=0}Z!==null?(Yt=Z.x,ye=Z.y,nn=Z.z):(Yt=0,ye=0,nn=0);let Ce=At.convert(H.format),An=At.convert(H.type),Ut;H.isData3DTexture?(tt.setTexture3D(H,0),Ut=O.TEXTURE_3D):H.isDataArrayTexture||H.isCompressedArrayTexture?(tt.setTexture2DArray(H,0),Ut=O.TEXTURE_2D_ARRAY):(tt.setTexture2D(H,0),Ut=O.TEXTURE_2D),T.activeTexture(O.TEXTURE0),T.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,H.flipY),T.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),T.pixelStorei(O.UNPACK_ALIGNMENT,H.unpackAlignment);let Hn=T.getParameter(O.UNPACK_ROW_LENGTH),_e=T.getParameter(O.UNPACK_IMAGE_HEIGHT),Ei=T.getParameter(O.UNPACK_SKIP_PIXELS),nr=T.getParameter(O.UNPACK_SKIP_ROWS),Ur=T.getParameter(O.UNPACK_SKIP_IMAGES);T.pixelStorei(O.UNPACK_ROW_LENGTH,Fe.width),T.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Fe.height),T.pixelStorei(O.UNPACK_SKIP_PIXELS,Zt),T.pixelStorei(O.UNPACK_SKIP_ROWS,se),T.pixelStorei(O.UNPACK_SKIP_IMAGES,fe);let to=C.isDataArrayTexture||C.isData3DTexture,Ee=H.isDataArrayTexture||H.isData3DTexture;if(C.isDepthTexture){let Ke=X.get(C),Br=X.get(H),De=X.get(Ke.__renderTarget),kr=X.get(Br.__renderTarget);T.bindFramebuffer(O.READ_FRAMEBUFFER,De.__webglFramebuffer),T.bindFramebuffer(O.DRAW_FRAMEBUFFER,kr.__webglFramebuffer);for(let eo=0;eo<Xt;eo++)to&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,X.get(C).__webglTexture,J,fe+eo),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,X.get(H).__webglTexture,Rt,nn+eo)),O.blitFramebuffer(Zt,se,kt,Lt,Yt,ye,kt,Lt,O.DEPTH_BUFFER_BIT,O.NEAREST);T.bindFramebuffer(O.READ_FRAMEBUFFER,null),T.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(J!==0||C.isRenderTargetTexture||X.has(C)){let Ke=X.get(C),Br=X.get(H);T.bindFramebuffer(O.READ_FRAMEBUFFER,L),T.bindFramebuffer(O.DRAW_FRAMEBUFFER,F);for(let De=0;De<Xt;De++)to?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Ke.__webglTexture,J,fe+De):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Ke.__webglTexture,J),Ee?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Br.__webglTexture,Rt,nn+De):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Br.__webglTexture,Rt),J!==0?O.blitFramebuffer(Zt,se,kt,Lt,Yt,ye,kt,Lt,O.COLOR_BUFFER_BIT,O.NEAREST):Ee?O.copyTexSubImage3D(Ut,Rt,Yt,ye,nn+De,Zt,se,kt,Lt):O.copyTexSubImage2D(Ut,Rt,Yt,ye,Zt,se,kt,Lt);T.bindFramebuffer(O.READ_FRAMEBUFFER,null),T.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else Ee?C.isDataTexture||C.isData3DTexture?O.texSubImage3D(Ut,Rt,Yt,ye,nn,kt,Lt,Xt,Ce,An,Fe.data):H.isCompressedArrayTexture?O.compressedTexSubImage3D(Ut,Rt,Yt,ye,nn,kt,Lt,Xt,Ce,Fe.data):O.texSubImage3D(Ut,Rt,Yt,ye,nn,kt,Lt,Xt,Ce,An,Fe):C.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,Rt,Yt,ye,kt,Lt,Ce,An,Fe.data):C.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,Rt,Yt,ye,Fe.width,Fe.height,Ce,Fe.data):O.texSubImage2D(O.TEXTURE_2D,Rt,Yt,ye,kt,Lt,Ce,An,Fe);T.pixelStorei(O.UNPACK_ROW_LENGTH,Hn),T.pixelStorei(O.UNPACK_IMAGE_HEIGHT,_e),T.pixelStorei(O.UNPACK_SKIP_PIXELS,Ei),T.pixelStorei(O.UNPACK_SKIP_ROWS,nr),T.pixelStorei(O.UNPACK_SKIP_IMAGES,Ur),Rt===0&&H.generateMipmaps&&O.generateMipmap(Ut),T.unbindTexture()},this.initRenderTarget=function(C){X.get(C).__webglFramebuffer===void 0&&tt.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?tt.setTextureCube(C,0):C.isData3DTexture?tt.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?tt.setTexture2DArray(C,0):tt.setTexture2D(C,0),T.unbindTexture()},this.resetState=function(){k=0,B=0,$=null,T.reset(),Pt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Zi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=pe._getDrawingBufferColorSpace(t),e.unpackColorSpace=pe._getUnpackColorSpace()}};function H_(r){let t=new Hs,e=new de(new Cl(50,48,24),new wn({side:Tn,depthWrite:!1,vertexShader:"varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }",fragmentShader:`varying vec3 vP;
        void main(){
          float y = vP.y;
          vec3 top = vec3(0.30, 0.31, 0.34), mid = vec3(0.075, 0.075, 0.09), bot = vec3(0.025, 0.022, 0.03);
          vec3 c = y > 0.0 ? mix(mid, top, pow(y, 0.8)) : mix(mid, bot, pow(-y, 0.6));
          // warm silk bounce from the cloth (the cloth sits behind the blade: -z)
          c += vec3(0.55, 0.5, 0.42) * 0.35 * smoothstep(0.2, 1.0, -vP.z) * smoothstep(-0.3, 0.6, y);
          gl_FragColor = vec4(c, 1.0);
        }`}));t.add(e);let n=(o,a,l,c,h,u,f=16777215)=>{let d=new de(new Bi(o,a),new Fi({color:new ee(f).multiplyScalar(u),side:ki}));d.position.set(l,c,h),d.lookAt(0,0,0),t.add(d)};n(60,7,0,16,20,5.5),n(60,10,0,-14,22,.55,14213887),n(6,30,-26,6,10,2.2),n(6,30,26,6,10,1.6,16773340);let i=new ha(r),s=i.fromScene(t,0).texture;return i.dispose(),s}var OT=`
uniform vec2 uRes;
uniform float uFell;
uniform float uRecede;
uniform float uTime;
uniform float uWind;
uniform float uShock;   // beat shock wave travelling up the cloth (0..1 phase, <0 off)
uniform float uShockA;
varying vec2 vC;
void main(){
  vec3 p = position;
  vec2 c = vec2(p.x + uRes.x * 0.5, uRes.y * 0.5 - p.y);
  vC = c;
  float d = c.y - uFell;
  if (d > 0.0) p.z -= (d * 0.7 + 0.0006 * d * d) * uRecede;
  else {
    p.z += uWind * sin(c.x * .004 + uTime * .6) * sin(c.y * .006 + uTime * .4);
    float s = uShock - (-d) / 700.0;
    p.z += uShockA * exp(-s * s * 90.0);
  }
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`,UT=`
precision highp float;
uniform sampler2D tA; uniform sampler2D tB; uniform sampler2D tRA; uniform sampler2D tRB;
uniform float uSplitY; uniform vec2 uSzA; uniform vec2 uSzB;
uniform vec2 uRes;
uniform float uPitch, uClothY, uFell, uWTop, uWBot;
uniform float uAmpW, uAmpVel, uVelSign, uFresh;
uniform float uAmpL, uAmpTop, uLooseScale, uLooseOff, uFade, uNearW, uNearD, uLooseLen, uTopLit;
uniform float uSweep;
uniform vec3 uLight; uniform vec2 uLightPos;
uniform vec3 uNight, uGlow, uIvory;
uniform vec4 uPull; uniform vec3 uPullOld;
uniform vec4 uPick;
uniform vec2 uJiyak;        // strip Y of the band's lower edge, height
uniform vec4 uShearR; uniform float uShear;
uniform vec4 uShotR; uniform float uShotFront; uniform vec3 uShotA; uniform vec3 uShotB;
uniform vec4 uSig;          // x, top, bottom, on
uniform vec4 uAndon; uniform vec3 uAndonCol;
uniform vec4 uSafe; uniform float uSafeK;
uniform float uTies;
uniform vec4 uDrop;         // t, centre thread, generation step, fall duration (t < 0: off)
uniform vec2 uIntro;        // registration progress (0..1, staggered), max amplitude
uniform sampler2D tDist;
uniform float uDim;
varying vec2 vC;

#define PI 3.14159265
float h1(float n){ return fract(sin(n * 127.1 + 1.7) * 43758.5453); }
float n1(float x){ float i = floor(x), f = fract(x); float u = f*f*(3.-2.*f); return mix(h1(i), h1(i+1.), u); }

vec3 dyeAt(float x, float Y){
  if (Y < uSplitY) return texture2D(tA, vec2(x / uSzA.x, 1.0 - Y / uSzA.y)).rgb;
  return texture2D(tB, vec2(x / uSzB.x, 1.0 - (Y - uSplitY) / uSzB.y)).rgb;
}
float roleAt(float x, float Y){
  if (Y < uSplitY) return texture2D(tRA, vec2(x / uSzA.x, 1.0 - Y / uSzA.y)).r;
  return texture2D(tRB, vec2(x / uSzB.x, 1.0 - (Y - uSplitY) / uSzB.y)).r;
}

void main(){
  float cx = vC.x, cy = vC.y;
  float fi = cx / uPitch;
  float i = floor(fi), u = fract(fi);
  float aa = max(fwidth(fi), 1e-4);
  float detail = 1.0 - smoothstep(0.17, 0.32, aa);
  float r1 = h1(i + 0.13), r2 = h1(i + 91.7), r3 = h1(i + 47.3);
  float bun = h1(floor(i / 6.0) + 3.7) * 2.0 - 1.0;          // bundles of 6 threads share most of their offset
  float base = 0.75 * bun + 0.25 * (r1 * 2.0 - 1.0);
  float xc = (i + 0.5) * uPitch;
  float rowPx = uPitch * 0.5;

  bool inPick = uPick.w != 0.0 && cy >= uPick.x && cy < uPick.y;
  float pj = (h1(floor(cy / rowPx) + 7.0) - 0.5) * 8.0;
  bool pickWoven = inPick && (uPick.w > 0.0 ? cx < uPick.z + pj : cx > uPick.z - pj);
  bool woven = (cy >= uWTop && cy < uWBot && !inPick) || pickWoven;

  vec2 dv = vec2(cx / uRes.x, cy / uRes.y);
  float dis = (dv.x > 0.0 && dv.x < 1.0 && dv.y > 0.0 && dv.y < 1.0) ? texture2D(tDist, dv).r * 24.0 : 0.0;

  vec3 col;
  if (woven) {
    float Y = uClothY + cy;
    float sx = cx;
    if (uShear != 0.0 && Y >= uShearR.y && Y < uShearR.w && cx >= uShearR.x && cx < uShearR.z) {
      float Lr = uShearR.z - uShearR.x;
      sx = uShearR.x + mod(cx - uShearR.x + uShear, Lr);
    }
    bool old = false;
    if (uPull.w >= 0.0 && cx >= uPull.x && Y >= uPull.y && Y < uPull.y + uPull.z + 200.0) {
      float s0 = floor(uPull.x / uPitch), s1 = floor(uRes.x / uPitch);
      float ti = clamp((i - s0) / max(1.0, s1 - s0), 0.0, 1.0);   // 0 at the split, 1 at the right edge
      float e = clamp((uPull.w - (1.0 - ti) * 0.55) / 0.45, 0.0, 1.0);
      e = e * e * (3.0 - 2.0 * e);
      Y -= (1.0 - e) * uPull.z;
      if (Y < uPull.y) old = true;
    }
    float rl = old ? 0.0 : roleAt(sx, Y);
    float abr = smoothstep(0.68, 0.85, rl);
    float kas = smoothstep(0.25, 0.45, rl) * (1.0 - abr);
    float amp = uAmpW * (1.0 + 1.0 * abr) * mix(1.0, 0.55, kas);
    amp += uAmpVel * mix(1.0, 0.6, kas) + dis * mix(1.0, 1.25, abr);
    amp += uFresh * exp(-max(uWBot - cy, 0.0) / 46.0);
    float off = base * amp + uVelSign * uAmpVel * 0.35 * (r2 - 0.5);
    float bl = mix(1.2, 1.8, abr);
    vec3 dye = old ? uPullOld : 0.5 * (dyeAt(sx, Y + off + bl) + dyeAt(sx, Y + off - bl));

    // jiyak: a tri-colour weft border woven into the cloth just above where the blade sat (grows pick by pick)
    float rowY = Y / rowPx;
    float row = floor(rowY);
    float wr = fract(rowY);
    float jt = Y - (uJiyak.x - 6.0 * rowPx);
    if (uJiyak.y > 0.0 && jt >= 0.0 && jt < uJiyak.y) {
      float jrow = floor(jt / rowPx);
      float band = floor(jrow / 2.0);
      vec3 wc = band < 0.5 ? vec3(0.82, 0.078, 0.353) : (band < 1.5 ? vec3(0.949, 0.694, 0.106) : vec3(0.039, 0.498, 0.333));
      dye = mod(jrow, 2.0) > 0.5 ? mix(dye, uIvory, 0.75) : wc;
    }

    // shot weave: Tokyo warp x Tashkent weft, a third changeant colour
    if (uShotFront > 0.0 && Y >= uShotR.y && Y < uShotR.w && cx >= uShotR.x && cx < min(uShotR.z, uShotFront)) {
      float ch = 0.5 + 0.5 * sin(cx * 0.011 + cy * 0.017 + uSweep * 0.004);
      vec3 shot = mix(uShotA, uShotB, 0.25 + 0.5 * ch);
      float warpUp = step(0.5, fract(u + 0.25 * step(0.5, mod(row, 2.0))));
      dye = mix(shot, mix(uShotA, uShotB, warpUp), 0.28 * detail);
    }

    // signal-thread channel (jidoka): the warp under the 3D thread is missing
    if (uSig.w > 0.5 && abs(cx - uSig.x) < uPitch * 0.5 && Y >= uSig.y && Y < uSig.z) dye *= 0.38;

    // satin: round warp threads, sparse binding points, rare slubs, static grain
    float prof = mix(0.95, mix(0.88, 1.0, pow(sin(PI * u), 0.6)), detail);
    float crown = pow(sin(PI * u), 2.5);
    float bind = step(mod(row + 2.0 * i, 5.0), 0.5) * 0.045 * detail;
    float wprof = mix(1.0, mix(0.965, 1.0, pow(sin(PI * wr), 0.7)), detail);
    float slub = (n1(Y / 37.0 + r2 * 40.0) - 0.5) * 0.06 * step(0.975, r3);
    float grain = 1.0 + (r2 - 0.5) * 0.03 + slub;
    col = dye * prof * wprof * grain * (1.0 - bind * crown);

    // Kajiya-Kay sheen along the warp, the cloth undulating softly
    float s = 0.24 * sin(cx * 0.0019 + Y * 0.0031 + 0.6) + 0.13 * sin(cx * 0.0047 - Y * 0.0017 + 1.7);
    vec3 T = normalize(vec3(0.0, 1.0, s));
    vec3 Hh = normalize(normalize(uLight) + vec3(0.0, 0.0, 1.0));
    float th = dot(T, Hh);
    float kk = pow(max(0.0, 1.0 - th * th), 14.0);
    float lum = dot(dye, vec3(0.299, 0.587, 0.114));
    vec3 specCol = mix(vec3(1.0, 0.975, 0.93), dye * 1.6 + 0.15, 0.35);
    col *= 0.955 + 0.06 * (0.5 + s);
    col += kk * (0.35 + 0.65 * crown * detail) * specCol * mix(0.12, 0.24, 1.0 - lum);
    float sw = exp(-pow((cx * 0.8 + cy * 0.6 - uSweep) / 300.0, 2.0));
    col += sw * (0.4 + 0.6 * crown) * specCol * 0.15;

    // pressed by the blade: soft contact shade just above the fell
    float fd = uWBot - cy;
    if (fd > 0.0) col *= 1.0 - 0.16 * exp(-fd / 3.0);
  } else {
    bool above = cy < uFell;
    float d = max(cy - uFell, 0.0);
    float bunL = n1(i / 9.0 + 3.1) * 2.0 - 1.0;
    float baseL = 0.6 * bunL + 0.4 * (r1 * 2.0 - 1.0);
    float Y;
    if (above) {
      Y = uClothY + cy + baseL * uAmpTop;
    } else {
      float ia = 0.0, st = 1.0;
      if (uIntro.y > 0.0) {
        float e = clamp((uIntro.x - (i / max(1.0, uRes.x / uPitch)) * 0.45) / 0.55, 0.0, 1.0);
        e = e * e * (3.0 - 2.0 * e);
        ia = uIntro.y * (1.0 - e);
        st = 1.0 + 2.0 * (1.0 - e);
      }
      float yy = d * uLooseScale;
      yy = uRes.y * 0.45 + (yy - uRes.y * 0.45) / st;
      Y = uClothY + uFell + uLooseOff + yy + baseL * (uAmpL + ia) + (r2 - 0.5) * (0.3 * uAmpL + 0.6 * ia);
    }
    vec3 dye;
    bool oldL = false;
    if (uPull.w >= 0.0 && cx >= uPull.x && Y >= uPull.y && Y < uPull.y + uPull.z + 200.0) {
      float s0 = floor(uPull.x / uPitch), s1 = floor(uRes.x / uPitch);
      float ti = clamp((i - s0) / max(1.0, s1 - s0), 0.0, 1.0);
      float e = clamp((uPull.w - (1.0 - ti) * 0.55) / 0.45, 0.0, 1.0);
      e = e * e * (3.0 - 2.0 * e);
      float Yp = Y - (1.0 - e) * uPull.z;
      if (Yp < uPull.y) oldL = true; else Y = Yp;
    }
    dye = oldL ? uPullOld : 0.5 * (dyeAt(xc, Y + 2.0) + dyeAt(xc, Y - 2.0));
    // strings hang with a faint lateral wander; each catches the light differently
    float wob = sin(cy * 0.011 + r1 * 40.0) * 0.55 + sin(cy * 0.027 + r2 * 17.0) * 0.25;
    float uu = fract((cx + wob * (above ? 0.25 : 1.0) + (above ? 0.0 : (r1 - 0.5) * 0.3 * uPitch)) / uPitch);
    float w = above ? 0.23 : mix(0.15, uNearW, exp(-d / uNearD));
    float tu = (uu - 0.5) / w;
    float cov = 1.0 - smoothstep(w - aa * 0.75, w + aa * 0.75, abs(uu - 0.5));
    float tube = sqrt(max(0.0, 1.0 - tu * tu));
    // back shed: half a pitch over, dimmer, its own dye
    float ub = fract(uu + 0.5);
    float wb = w * 0.85;
    float covB = (1.0 - smoothstep(wb - aa * 0.75, wb + aa * 0.75, abs(ub - 0.5))) * detail;
    vec3 dyeB = oldL ? uPullOld : dyeAt(xc + uPitch * 0.5, Y + 23.0 + r3 * 20.0);
    float lit = above ? uTopLit * (0.8 + 0.2 * exp(-pow((cx - uRes.x * 0.78) / (uRes.x * 0.5), 2.0))) : exp(-d / uFade) * (1.0 - smoothstep(0.75, 1.0, d / uLooseLen) * 0.5);
    if (!above) lit *= (0.62 + 0.38 * exp(-pow((cx - uRes.x * 0.5) / (uRes.x * 0.42), 2.0))) * uTopLit;
    // intro: threads falling into place
    float tip = 1e5;
    if (uDrop.x >= 0.0) {
      float g = ceil(log2(abs(i - uDrop.y) + 1.0));
      float p = clamp((uDrop.x - g * uDrop.z - r3 * 0.06) / uDrop.w, 0.0, 1.0);
      float q = p - 1.0;
      float e = 1.0 + 2.8 * q * q * q + 1.8 * q * q;
      tip = mix(-60.0, uRes.y * 1.9, e);
      if (cy > tip) { cov = 0.0; covB = 0.0; }
      lit *= 1.0 + 0.6 * exp(-max(tip - cy, 0.0) / 50.0) * step(p, 0.999);
    }
    float catchL = 0.78 + 0.44 * r3;
    vec3 thr = dye * (0.45 + 0.55 * tube) * (0.035 + 0.965 * lit) * catchL;
    thr += pow(tube, 8.0) * 0.26 * lit * catchL * vec3(1.0, 0.96, 0.9);
    if (!above) thr *= 1.0 + 0.45 * exp(-d / 70.0);
    float dB = cy - uWBot;
    float glow = above ? (dB > 0.0 && uWTop < 0.0 ? exp(-dB / 36.0) * 0.8 : 0.0) : exp(-d / 30.0);
    if (above && dB > 0.0 && uWTop < 0.0) lit = max(lit, 0.35 + 0.65 * exp(-dB / 140.0));
    thr += uGlow * glow * 0.4 * (0.6 + 0.4 * tube);
    vec3 back = dyeB * 0.4 * (0.05 + 0.95 * lit);
    vec3 gap = uNight + uGlow * (above ? 0.018 : exp(-d / 60.0) * 0.12);
    col = mix(gap, back, covB * 0.9);
    // resist ties at dye boundaries, in an ordered diagonal rhythm (abrband)
    if (uTies > 0.0 && above) {
      vec3 dn = dyeAt(xc, Y + 6.0);
      float edge = step(0.18, distance(dye, dn));
      float bi = floor(i / 6.0);
      float onB = step(0.5, mod(bi + floor((Y) / 90.0), 2.0));
      thr = mix(thr, uIvory * (0.75 + 0.25 * tube) * (0.6 + 0.4 * lit), edge * onB * uTies);
    }
    col = mix(col, thr, cov);
    // calm field behind DOM text
    if (uSafeK < 1.0) {
      vec2 q = max(vec2(uSafe.x - cx, uSafe.y - cy), vec2(cx - uSafe.x - uSafe.z, cy - uSafe.y - uSafe.w));
      float msk = 1.0 - smoothstep(-40.0, 120.0, max(q.x, q.y));
      col *= mix(1.0, uSafeK, msk);
    }
  }

  // andon: lantern wash
  if (uAndon.z > 0.0) {
    float ad = length(vec2(cx, cy) - uAndon.xy);
    col += uAndonCol * uAndon.z * exp(-ad * ad / (uAndon.w * uAndon.w)) * (woven ? 0.5 + 0.5 * pow(sin(PI * u), 2.0) : 0.6);
  }
  float lf = length((vec2(cx, cy) - uLightPos) / uRes.x);
  col *= 1.0 - 0.10 * smoothstep(0.25, 1.25, lf);
  col *= uDim;
  gl_FragColor = vec4(col, 1.0);
}
`,Js=r=>new z(...X0(r));function G_({W:r,H:t,chunks:e,scale:n}){let i=(d,p)=>{let _=new Oi(d);return _.colorSpace=tr,_.minFilter=Je,_.magFilter=Je,_.generateMipmaps=!1,_.wrapS=_.wrapT=Ni,_},s=e[0],o=e[1]||e[0],a={tA:{value:i(s.canvas)},tB:{value:e[1]?i(o.canvas):null},tRA:{value:i(s.role)},tRB:{value:e[1]?i(o.role):null},uSplitY:{value:e[1]?o.y0:1e9},uSzA:{value:new vt(r,s.h)},uSzB:{value:new vt(r,o.h)},uRes:{value:new vt(r,t)},uPitch:{value:7.2},uClothY:{value:0},uFell:{value:0},uWTop:{value:-1},uWBot:{value:0},uAmpW:{value:.8},uAmpVel:{value:0},uVelSign:{value:1},uFresh:{value:0},uAmpL:{value:60},uAmpTop:{value:2},uLooseScale:{value:2.4},uLooseOff:{value:30},uFade:{value:70},uNearW:{value:.27},uNearD:{value:110},uLooseLen:{value:300},uTopLit:{value:1},uRecede:{value:.7},uTime:{value:0},uWind:{value:0},uShock:{value:-1},uShockA:{value:0},uSweep:{value:r*.9},uLight:{value:new z(-.35,.22,1)},uLightPos:{value:new vt(r*.3,t*.25)},uNight:{value:Js(Tt.loom)},uGlow:{value:Js("#F2A23A")},uIvory:{value:Js(Tt.ivory)},uPull:{value:new ve(0,0,0,-1)},uPullOld:{value:Js(Tt.ai)},uPick:{value:new ve(0,0,0,0)},uJiyak:{value:new vt(0,0)},uShearR:{value:new ve(0,0,0,0)},uShear:{value:0},uShotR:{value:new ve(0,0,0,0)},uShotFront:{value:0},uShotA:{value:Js(Tt.shu)},uShotB:{value:Js(Tt.emerald)},uSig:{value:new ve(0,0,0,0)},uAndon:{value:new ve(0,0,0,300)},uAndonCol:{value:Js(Tt.shu)},uSafe:{value:new ve(0,0,0,0)},uSafeK:{value:1},uTies:{value:0},uDrop:{value:new ve(-1,0,.12,.45)},uIntro:{value:new vt(1,0)},tDist:{value:null},uDim:{value:1}};e[1]||(a.tB.value=a.tA.value,a.tRB.value=a.tRA.value);let l=new wn({uniforms:a,vertexShader:OT,fragmentShader:UT,toneMapped:!1}),c=r*2.4,h=t*2.4,u=new Bi(c,h,48,Math.round(h/6));u.translate(0,t/2+60-h/2,0);let f=new de(u,l);return f.frustumCulled=!1,{mesh:f,uniforms:a}}function BT({L:r,w0:t,w1:e,t0:n,t1:i,kL:s}){let a=[[0,.42,.72],[.72,.94],[.94,1]],l=(h,u)=>{if(h<=.72){let f=h/.72;return u*(.06+.94*Math.pow(f,.78))}return h<=.94?u*(1-.3*(h-.72)/.22):u*.7*(1-(h-.94)/.06)+0},c=[];return a.forEach(h=>{let u=[],f=[],d=[],p=[],_=h.length===3?10:2,g=[];for(let S=0;S<h.length-1;S++)for(let x=0;x<_;x++)g.push(h[S]+(h[S+1]-h[S])*x/_);g.push(h[h.length-1]);let m=g.length;for(let S=0;S<=260;S++){let x=r*S/260,w=x/r,M=t+(e-t)*w,E=n+(i-n)*w,y=-M,b=0,A=y;if(x>r-s){let P=(x-(r-s))/s;b=y+M*Math.sqrt(Math.max(0,1-P*P)),A=y+M*.12*P*P}let R=x>r-s?E*(1-Math.pow((x-(r-s))/s,2)*.85):E;for(let P=0;P<m;P++){let N=g[P],L=b+(A-b)*N;u.push(x,L,l(N,R)),f.push(N),d.push(x)}}for(let S=0;S<260;S++)for(let x=0;x<m-1;x++){let w=S*m+x,M=w+1,E=w+m,y=E+1;p.push(w,M,E,M,y,E)}let v=new Qe;v.setAttribute("position",new xe(u,3)),v.setAttribute("aV",new xe(f,1)),v.setAttribute("aX",new xe(d,1)),v.setIndex(p),v.computeVertexNormals(),c.push(v)}),c}function kT(r){let t=new ti({color:13225686,metalness:1,roughness:.16,envMapIntensity:1.15});return t.onBeforeCompile=e=>{e.uniforms.uGlint=r,e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
attribute float aV;
attribute float aX;
varying float vAV;
varying float vAX;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vAV = aV; vAX = aX;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
varying float vAV; varying float vAX; uniform float uGlint;
float bh(float n){ return fract(sin(n*91.3)*43758.5453); }
float bn(float x){ float i=floor(x), f=fract(x); float u=f*f*(3.-2.*f); return mix(bh(i), bh(i+1.), u); }`).replace("#include <color_fragment>",`#include <color_fragment>
float hb = 0.34 + 0.07*sin(vAX*0.043) + 0.04*sin(vAX*0.117+1.7) + 0.05*(bn(vAX*0.06)-0.5);
float yaki = smoothstep(hb + 0.05, hb - 0.03, vAV);
float shinogiJi = smoothstep(0.71, 0.73, vAV);
diffuseColor.rgb *= mix(1.0, 1.16, yaki);
diffuseColor.rgb *= mix(1.0, 0.78, shinogiJi);`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, 0.34, yaki);
roughnessFactor = mix(roughnessFactor, 0.08, shinogiJi);`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
// nie: crystalline sparkles along the temper line
vec2 cell = floor(vec2(vAX * 0.55, vAV * 40.0));
float sp = step(0.93, bh(cell.x * 17.0 + cell.y * 3.1));
float zone = exp(-pow((vAV - hb) / 0.06, 2.0));
totalEmissiveRadiance += vec3(0.55, 0.58, 0.62) * sp * zone * 0.55;
// travelling glint
float gl = exp(-pow((vAX - uGlint) / 26.0, 2.0)) * (1.0 - 0.6 * vAV);
totalEmissiveRadiance += vec3(1.0, 0.98, 0.95) * gl * 0.75;
totalEmissiveRadiance += vec3(0.9, 0.93, 0.97) * yaki * 0.05;`)},t}function zT(){let r=document.createElement("canvas");r.width=256,r.height=512;let t=r.getContext("2d");t.fillStyle="#E9E1CF",t.fillRect(0,0,256,512);for(let i=0;i<2200;i++){let s=Math.random()*256,o=Math.random()*512,a=.8+Math.random()*1.6;t.fillStyle=`rgba(${150+Math.random()*60},${140+Math.random()*50},${120+Math.random()*40},0.35)`,t.beginPath(),t.arc(s,o,a,0,Math.PI*2),t.fill()}let e=64;t.save();for(let i=-e;i<512+e;i+=e)for(let s of[-1,1]){t.save(),t.beginPath();let o=30;for(let c of[64,192])t.moveTo(c-70,i-s*40-o/2),t.lineTo(c+70,i+s*40-o/2),t.lineTo(c+70,i+s*40+o/2),t.lineTo(c-70,i-s*40+o/2),t.closePath();let a=["#D1145A","#F2B11B","#0A7F55","#F6F1E6"],l=t.createLinearGradient(0,i-60,0,i+60);a.forEach((c,h)=>{l.addColorStop(h/4,c),l.addColorStop((h+1)/4-.02,c)}),t.fillStyle=l,t.fill(),t.clip(),t.strokeStyle="rgba(40,20,30,0.22)",t.lineWidth=1.2;for(let c=-40;c<300;c+=4)t.beginPath(),t.moveTo(c,i-60),t.lineTo(c-s*30,i+60),t.stroke();t.restore()}t.restore();let n=new Oi(r);return n.colorSpace=Ze,n.wrapS=n.wrapT=rs,n}function W_({W:r,H:t,fellY:e,scale:n=1,tsubaX:i=104,tipMargin:s=44}){let o=new jn,a=new jn;o.add(a);let l={value:r*.62},c=i+22*n,h=r-s-c,u=14*n,f=10.5*n,d=BT({L:h,w0:u,w1:f,t0:3.6*n,t1:2.3*n,kL:22*n}),p=kT(l);d.forEach(A=>{let R=new de(A,p);R.position.x=c,a.add(R)}),d.forEach(A=>{let R=new de(A,p);R.position.x=c,R.scale.z=-1,a.add(R)});let _=new de(new Ji(18*n,u+3*n,9*n),new ti({color:12089931,metalness:1,roughness:.28}));_.position.set(i+13*n,-u/2,0),a.add(_);let g=new ti({color:3025447,metalness:.6,roughness:.5}),m=new ti({color:12088650,metalness:1,roughness:.32}),v=new ti({color:13214042,metalness:1,roughness:.3}),S=new de(new Ui(25*n,25*n,5.5*n,48),g);S.rotation.z=Math.PI/2,S.scale.set(1,1,.82),S.position.set(i,-u/2,0),a.add(S);let x=new de(new Rl(25*n,1.1*n,8,64),v);x.rotation.y=Math.PI/2,x.scale.set(1,1,1),x.position.set(i+2.9*n,-u/2,0),a.add(x);for(let A of[-4.2,4.2]){let R=new de(new Ui(15*n,15*n,1.6*n,32),m);R.rotation.z=Math.PI/2,R.position.set(i+A*n,-u/2,0),a.add(R)}let w=new de(new Ui(11.5*n,11.5*n,9*n,32),g);w.rotation.z=Math.PI/2,w.scale.set(1,1,.8),w.position.set(i-9*n,-u/2,0),a.add(w);let M=260*n,E=zT();E.repeat.set(1,M/(30*n)/8),E.offset.set(.25,0);let y=new de(new Ui(11*n,11.6*n,M,48,1,!0),new as({map:E,roughness:.62,metalness:0}));y.rotation.z=Math.PI/2,y.scale.set(1,1,.8),y.position.set(i-13*n-M/2,-u/2,0),a.add(y),a.scale.y=-1,a.position.y=-u;let b=A=>o.position.set(-r/2,t/2-A,7);return b(e),{group:o,glint:l,setY:b,h:u}}var $s=r=>new ee(r);function X_(r,t=256){let e=document.createElement("canvas");e.width=e.height=t;let n=e.getContext("2d"),i=n.createRadialGradient(t/2,t/2,0,t/2,t/2,t/2);r.forEach(([o,a])=>i.addColorStop(o,a)),n.fillStyle=i,n.fillRect(0,0,t,t);let s=new Oi(e);return s.colorSpace=Ze,s}function VT(){let r=document.createElement("canvas");r.width=512,r.height=128;let t=r.getContext("2d");t.fillStyle=Tt.kiri,t.fillRect(0,0,512,128);for(let n=0;n<90;n++){let i=Math.random()*128,s=1+Math.random()*4,o=.004+Math.random()*.01,a=Math.random()*6;t.strokeStyle=Math.random()<.7?`rgba(110,70,35,${.08+Math.random()*.16})`:`rgba(255,225,180,${.08+Math.random()*.12})`,t.lineWidth=.6+Math.random()*1.6,t.beginPath();for(let l=0;l<=512;l+=8){let c=i+Math.sin(l*o+a)*s+Math.sin(l*o*3.1+a)*s*.3;l?t.lineTo(l,c):t.moveTo(l,c)}t.stroke()}for(let n=0;n<160;n++)t.fillStyle=`rgba(120,80,40,${.1+Math.random()*.15})`,t.fillRect(Math.random()*512,Math.random()*128,2+Math.random()*5,.8);let e=new Oi(r);return e.colorSpace=Ze,e.wrapS=e.wrapT=rs,e}function Y_({x:r,y:t,W:e,H:n,bobbin:i=Tt.emerald,scale:s=1}){let o=new jn,a=new ta;a.moveTo(-64,0),a.bezierCurveTo(-36,12.4,36,12.4,64,0),a.bezierCurveTo(36,-12.4,-36,-12.4,-64,0);let l=new Gs,c=30,h=5.2,u=4;l.moveTo(-c+u,-h),l.lineTo(c-u,-h),l.quadraticCurveTo(c,-h,c,-h+u),l.lineTo(c,h-u),l.quadraticCurveTo(c,h,c-u,h),l.lineTo(-c+u,h),l.quadraticCurveTo(-c,h,-c,h-u),l.lineTo(-c,-h+u),l.quadraticCurveTo(-c,-h,-c+u,-h),a.holes.push(l);let f=new Al(a,{depth:9,bevelEnabled:!0,bevelThickness:3.2,bevelSize:2.6,bevelSegments:5,curveSegments:40}),d=VT();d.repeat.set(1/140,1/34),d.offset.set(.5,.5);let p=new ti({map:d,roughness:.38,clearcoat:.6,clearcoatRoughness:.25,sheen:0});o.add(new de(f,p));let _=document.createElement("canvas");_.width=64,_.height=256;let g=_.getContext("2d");g.fillStyle=i,g.fillRect(0,0,64,256);for(let w=0;w<256;w+=2)g.fillStyle=`rgba(0,0,0,${.1+Math.random()*.12})`,g.fillRect(0,w,64,1);let m=new Oi(_);m.colorSpace=Ze;let v=new de(new Ui(4.6,4.6,54,24),new ti({map:m,roughness:.5,sheen:1,sheenColor:$s("#ffffff"),sheenRoughness:.4}));v.rotation.z=Math.PI/2,v.position.z=7,o.add(v);let S=new ti({color:13949150,metalness:1,roughness:.22});for(let w of[-1,1]){let M=new de(new xl(3.4,16,20),S);M.rotation.z=-w*Math.PI/2,M.position.set(w*70,0,6),o.add(M)}let x=new de(new Bi(190,56),new Fi({map:X_([[0,"rgba(0,0,0,0.55)"],[.55,"rgba(0,0,0,0.18)"],[1,"rgba(0,0,0,0)"]]),transparent:!0,depthWrite:!1,toneMapped:!1}));return x.position.set(6,-7,-11),o.add(x),o.scale.setScalar(s),o.position.set(r-e/2,n/2-t,12),o}function Fp(r,t,e,n,i,s){let o=document.createElement("canvas"),a=3;o.width=r*a,o.height=t*a;let l=o.getContext("2d"),c=l.createRadialGradient(o.width/2,o.height*.48,4,o.width/2,o.height*.48,o.height*.62);c.addColorStop(0,n),c.addColorStop(.45,i),c.addColorStop(1,s),l.fillStyle=c,l.fillRect(0,0,o.width,o.height);let h=7,u=()=>(h=h*16807%2147483647)/2147483647;for(let d=0;d<700;d++){l.strokeStyle=`rgba(255,240,215,${.04+u()*.08})`,l.lineWidth=.6+u();let p=u()*o.width,_=u()*o.height,g=u()*Math.PI,m=4+u()*18;l.beginPath(),l.moveTo(p,_),l.lineTo(p+Math.cos(g)*m,_+Math.sin(g)*m),l.stroke()}for(let d=22*a;d<o.height;d+=22*a)l.fillStyle="rgba(40,10,4,0.22)",l.fillRect(0,d-1.5*a,o.width,1.5*a);e&&(l.font=`${Math.round(r*.7)*a}px ${xi}`,l.textAlign="center",l.textBaseline="middle",l.shadowColor="rgba(255,240,220,0.9)",l.shadowBlur=18,l.fillStyle=Tt.ivory,l.fillText(e,o.width/2,o.height*.5));let f=new Oi(o);return f.colorSpace=Ze,f}function q_({x:r,y:t,w:e=64,h:n=180,W:i,H:s}){let o=new jn,a=new Fi({map:Fp(e,n,"","#5b4a3c","#3e3129","#2a211c"),toneMapped:!1}),l=new Fi({map:Fp(e,n,"\u6B62","#FF8A4C","#F2552A","#B92E14"),toneMapped:!1,transparent:!0,opacity:0}),c=new Fi({map:Fp(e,n,"\u9032","#7FE3B4","#1FA673","#0A6B47"),toneMapped:!1,transparent:!0,opacity:0});for(let[v,S]of[[a,10],[l,10.2],[c,10.4]]){let x=new de(new Bi(e,n),v);x.position.z=S,o.add(x)}let h=new as({color:2759958,roughness:.6,metalness:0});for(let v of[-1,1]){let S=new de(new Ji(e+12,12,24),h);S.position.set(0,v*(n/2+5),8),o.add(S)}for(let v of[-1,1]){let S=new de(new Ji(3.5,n,6),h);S.position.set(v*(e/2+.5),0,12),o.add(S)}let u=new de(new Ui(.9,.9,400,8),h);u.position.set(0,n/2+205,8),o.add(u);let f=new Jo({map:X_([[0,"rgba(255,255,255,0.75)"],[.22,"rgba(255,255,255,0.3)"],[.55,"rgba(255,255,255,0.08)"],[1,"rgba(255,255,255,0)"]]),blending:Bl,depthWrite:!1,toneMapped:!1,color:new ee(Tt.shu),opacity:0}),d=new ml(f);d.scale.set(e*8.5,e*8.5,1),d.position.z=4,o.add(d);let p=s/2-t;o.position.set(r-i/2,p,6);let _=new ee(Tt.shu),g=new ee("#1FA673");return{group:o,set:(v,S,x=0)=>{l.opacity=v*(1-S),c.opacity=v*S,f.opacity=v,f.color.copy(_).lerp(g,S),o.position.y=p-x}}}function Op({W:r,H:t,color:e=Tt.saffron,radius:n=1.7,seg:i=120}){let s=new ti({color:$s(e),roughness:.42,sheen:1,sheenColor:$s("#fff1c9"),sheenRoughness:.35,emissive:$s(e),emissiveIntensity:.14}),o=new de(new Qe,s);o.frustumCulled=!1;let a="";return{mesh:o,set:c=>{let h=c.map(d=>d.map(p=>p.toFixed(1)).join(",")).join(";");if(h===a)return;a=h;let u=new Qo(c.map(([d,p,_])=>new z(d-r/2,t/2-p,_)),!1,"centripetal"),f=new Il(u,i,n,8,!1);o.geometry.dispose(),o.geometry=f},mat:s}}function Z_({color:r=Tt.saffron,size:t=1}){let e=new ti({color:$s(r),roughness:.4,sheen:1,sheenColor:$s("#fff1c9"),emissive:$s(r),emissiveIntensity:.18});return new de(new Pl(5*t,1.7*t,96,10,2,3),e)}function be(r,t,e,n,i,s){r.fillStyle=t,r.fillRect(e,n,i,s)}function HT(r,t,e){r.font=`${e.size}px ${xi}`,r.fillStyle=e.color,r.fillText(e.text,e.x,e.base),t.font=`${e.size}px ${xi}`,t.fillStyle=t.strokeStyle=Ar.kasuri,t.lineWidth=Math.max(6,e.size*.14),t.lineJoin="round",t.strokeText(e.text,e.x,e.base),t.fillText(e.text,e.x,e.base)}function GT(r,t,e,n){let i=e.size,s=Mn(i),o=Ya(e.text,i),a=Math.ceil(i*.3),l=n,c=document.createElement("canvas");c.width=Math.ceil((o+a*2)*l),c.height=Math.ceil(i*1.5*l);let h=c.getContext("2d");h.scale(l,l);let u=Math.round(i*1.15),f=u-s,d=f+s*.34,p=f+s*.68,_=Math.max(2,i*.022),g=o+a*2,m=i*1.5;be(h,Tt.saffron,0,0,g,d),be(h,Tt.atlas,0,d,g,p-d),be(h,Tt.emerald,0,p,g,m-p),be(h,Tt.ivory,0,d-_/2,g,_),be(h,Tt.ivory,0,p-_/2,g,_),h.globalCompositeOperation="destination-in",h.font=`${i}px ${xi}`,h.fillStyle="#000",h.fillText(e.text,a,u),r.drawImage(c,e.x-a,e.base-u,g,m),t.font=`${i}px ${xi}`,t.fillStyle=t.strokeStyle=Ar.abr,t.lineWidth=Math.max(8,i*.2),t.lineJoin="round",t.strokeText(e.text,e.x,e.base),t.fillText(e.text,e.x,e.base)}function WT(r,t,e,n){let i=e.size,s=Ya(e.text,i),o=Math.ceil(i*.3),a=n,l=s+o*2,c=i*1.5,h=document.createElement("canvas");h.width=Math.ceil(l*a),h.height=Math.ceil(c*a);let u=h.getContext("2d");u.scale(a,a);let f=Math.round(i*1.15),d=[Tt.saffron,Tt.atlas,Tt.emerald],p=e.len/4.5,_=Math.max(2,i*.03),g=0;for(let m=o;m<l;m+=p,g++)be(u,d[g%3],m,0,p+1,c),m>o&&be(u,Tt.ivory,m-_/2,0,_,c);be(u,d[0],0,0,o,c),u.globalCompositeOperation="destination-in",u.font=`${i}px ${xi}`,u.fillStyle="#000",u.fillText(e.text,o,f);for(let[m,v]of[[r,!0],[t,!1]])m.save(),m.transform(0,1,-1,0,e.xBase+f,e.yTop-o),v?m.drawImage(h,0,0,l,c):(m.font=`${i}px ${xi}`,m.fillStyle=m.strokeStyle=Ar.abr,m.lineWidth=Math.max(8,i*.2),m.lineJoin="round",m.strokeText(e.text,o,f),m.fillText(e.text,o,f)),m.restore()}function XT(r,t,e){for(let[n,i,s]of[[r,e.color,!1],[t,Ar.kasuri,!0]])n.save(),n.transform(0,1,-1,0,e.xBase,e.yTop),n.font=`${e.size}px ${xi}`,n.fillStyle=n.strokeStyle=i,s&&(n.lineWidth=Math.max(6,e.size*.14),n.lineJoin="round",n.strokeText(e.text,0,0)),n.fillText(e.text,0,0),n.restore()}function YT(r,t,e,n){for(let i of e||[])i.vertical&&!i.abr?XT(r,t,i):i.vertical?WT(r,t,i,n):i.abr?GT(r,t,i,n):HT(r,t,i)}function qT(r,t,e,n){let{grid:i,mot:s,safe:o}=e.jid,a=e.pitch,l=Math.max(4,Math.round(s/6));r.fillStyle="rgba(246,241,230,0.26)",t.fillStyle=Ar.kasuri;for(let c=-1;c*i<e.W+i;c++)for(let h=-1;h*i<n+i;h++){let u=Math.round((c*i+i*.35)/a)*a,f=Math.round(h*i+(c%2?i/2:0)+i*.25);if(u+s>o[0]&&u<o[0]+o[2]&&f+s>o[1]&&f<o[1]+o[3]||Math.abs(u+s/2-e.jid.sigX)<s)continue;let d=Math.round(s*.22),p=Math.round(s*.62);r.fillRect(u+d,f,l,s),r.fillRect(u+p,f,l,s),r.fillRect(u,f+d,s,l),r.fillRect(u,f+p,s,l),t.fillRect(u-6,f-6,s+12,s+12)}}function J_(r,t,e,n,i){let s=[Tt.atlas,Tt.saffron,Tt.emerald,Tt.atlas],o=s.length,a=i/o;s.forEach((l,c)=>be(r,l,t,e+c*a,n,a));for(let l=1;l<o;l++)be(r,Tt.ivory,t,e+l*a-1,n,2);be(r,Tt.ivory,t,e,n,2),be(r,Tt.ivory,t,e+i-2,n,2)}function ZT(r,t,e){let n=e.time,i=(s,o,a)=>{for(let l=0;l<24;l++){let c=n.x0+l*n.hw,h=l>=9&&l<18;be(r,h?a:Tt.silkShade,c,s,n.hw+.5,o-s),be(r,h?"rgba(0,0,0,0.16)":"rgba(24,35,74,0.12)",c,s,l%6?1:2,o-s)}be(r,Tt.ivory,n.x0+9*n.hw-1,s,2,o-s),be(r,Tt.ivory,n.x0+18*n.hw-1,s,2,o-s),t.fillStyle=Ar.kasuri,t.fillRect(n.x0-4,s-4,n.x1-n.x0+8,o-s+8)};i(n.tk[0],n.tk[1],Tt.shu),i(n.ts[0],n.ts[1],Tt.emerald)}var JT={silk:Tt.silk,ai:Tt.ai,aiDeep:Tt.aiDeep};function $_(r,t,e,n,i){let s=e.panels[n],o=n==="dan"?"abr":n==="hor"?"jid":n,a=e.W,l=s.h;switch(r.save(),t.save(),r.beginPath(),r.rect(0,0,a,l),r.clip(),t.beginPath(),t.rect(0,0,a,l),t.clip(),be(r,JT[s.ground]||Tt.silk,0,0,a,l),o){case"abr":{let c=e.abr.split;be(r,Tt.silk,c,0,a-c,l);let[h,u,f,d,p]=e.abr.eq;be(r,Tt.saffron,h,u,f,d),be(r,Tt.saffron,h,p,f,d),t.fillStyle=Ar.kasuri,t.fillRect(h-4,u-4,f+8,p+d-u+8);break}case"jid":qT(r,t,e,l);break;case"stripes":e.stripes.forEach(c=>be(r,c.g,0,c.sy,a,e.sh)),e.stripes.forEach((c,h)=>h&&be(r,"rgba(246,241,230,0.55)",0,c.sy-1,a,2));break;case"time":ZT(r,t,e);break;case"foot":{let c=e.foot.band;J_(r,0,0,a,c),J_(r,0,l-c,a,c);break}case"tail":be(r,"#F2EBDC",0,0,a,l);break}YT(r,t,e.woven[o],i),e.flow&&$T(r,e,n,l),r.restore(),t.restore()}function $T(r,t,e,n){let i=t.pitch,s=t.W;if(e==="dan"){for(let u=0;u<t.threads+1;u++)be(r,"rgba(18,15,23,0.9)",(u+.5)*i+.23*i,0,.54*i,n);let o=r.createLinearGradient(0,0,0,n);o.addColorStop(0,"rgba(18,15,23,0.15)"),o.addColorStop(1,"rgba(18,15,23,0.55)"),r.fillStyle=o,r.fillRect(0,0,s,n);let[a,l,c,h]=t.danSafe;be(r,"rgba(18,15,23,0.5)",a,l,c,h)}if(e==="jid"||e==="hor"){let{sigX:o,brk:a,andon:l}=t.jid;r.strokeStyle=Tt.saffron,r.lineWidth=t.phone?3:4,r.lineCap="round",r.beginPath(),e==="jid"?(r.moveTo(o,0),r.lineTo(o,a-8),r.quadraticCurveTo(o+4,a+18,o+22,a+16),r.moveTo(o,n),r.lineTo(o,a+70),r.quadraticCurveTo(o-14,a+46,o+4,a+36)):(r.moveTo(o,0),r.lineTo(o,n)),r.stroke(),e==="hor"&&(r.fillStyle=Tt.saffron,r.beginPath(),r.arc(o,a,t.phone?6:8,0,Math.PI*2),r.fill());let c=e==="jid"?Tt.shu:Tt.emerald,h=l.x-l.w/2,u=l.y-l.h/2,f=r.createRadialGradient(l.x,l.y,4,l.x,l.y,l.w*4);f.addColorStop(0,e==="jid"?"rgba(226,66,31,0.45)":"rgba(31,166,115,0.45)"),f.addColorStop(1,"rgba(0,0,0,0)"),r.fillStyle=f,r.fillRect(l.x-l.w*4,l.y-l.w*4,l.w*8,l.w*8),be(r,c,h,u,l.w,l.h),be(r,"#2a1d16",h-6,u-10,l.w+12,10),be(r,"#2a1d16",h-6,u+l.h,l.w+12,10),r.font=`${Math.round(l.w*.7)}px ${xi}`,r.fillStyle=Tt.ivory,r.textAlign="center",r.textBaseline="middle",r.fillText(e==="jid"?"\u6B62":"\u9032",l.x,l.y),r.textAlign="left",r.textBaseline="alphabetic"}if(e==="time"){let o=t.time;for(let f=0;f<24;f++){let d=o.x0+(f-4+24)%24*o.hw;be(r,f>=9&&f<18?Tt.shu:Tt.silkShade,d,o.tk[0],o.hw+.5,o.tk[1]-o.tk[0]),be(r,"rgba(24,35,74,0.12)",d,o.tk[0],1,o.tk[1]-o.tk[0])}let[a,l,c,h]=o.shot,u=r.createLinearGradient(a,l,c,h);u.addColorStop(0,"#7A4A26"),u.addColorStop(1,"#4E5E2E"),r.fillStyle=u,r.fillRect(a,l,c-a,h-l)}}function K_(r,t,e){let n=Object.keys(r.panels),i=[],s=null;for(let a of n){let l=r.panels[a];(!s||(l.y0+l.h-s.y0)*t>e)&&(s={y0:l.y0,h:0,ids:[]},i.push(s)),s.ids.push(a),s.h=l.y0+l.h-s.y0}let o=t*.5;for(let a of i){a.canvas=document.createElement("canvas"),a.canvas.width=Math.ceil(r.W*t),a.canvas.height=Math.ceil(a.h*t),a.role=document.createElement("canvas"),a.role.width=Math.ceil(r.W*o),a.role.height=Math.ceil(a.h*o);let l=a.canvas.getContext("2d"),c=a.role.getContext("2d");c.fillStyle=Ar.ground,c.fillRect(0,0,a.role.width,a.role.height);for(let h of a.ids){let u=r.panels[h];l.setTransform(t,0,0,t,0,(u.y0-a.y0)*t),c.setTransform(o,0,0,o,0,(u.y0-a.y0)*o),$_(l,c,r,h,t)}}return i}function j_(r,t,e){let n=r.panels[t],i=document.createElement("canvas");i.width=Math.ceil(r.W*e),i.height=Math.ceil(n.h*e);let s=document.createElement("canvas");s.width=4,s.height=4;let o=i.getContext("2d");return o.setTransform(e,0,0,e,0,0),$_(o,s.getContext("2d"),r,t,e),i}function KT(r,t,e,n){let i=a=>{let l=-(a*.7+6e-4*a*a)*n,c=r/2-(e+a);return r/2-c*t/(t-l)},s=0,o=8e3;for(let a=0;a<50;a++){let l=(s+o)/2;i(l)<r?s=l:o=l}return s}function Q_(r,t){let{W:e,H:n}=r,i=Math.min(window.devicePixelRatio||1,(r.phone,1.5)),s=new Gu({antialias:!1,alpha:!1,stencil:!1,powerPreference:"high-performance"});s.setPixelRatio(i),s.setSize(e,n),s.outputColorSpace=Ze,s.toneMapping=kl,s.localClippingEnabled=!0,t.appendChild(s.domElement);let o=Math.min(8192,s.capabilities.maxTextureSize),a=Math.max(.75,Math.min(i,r.phone?1.5:1.25)),l=K_(r,a,o);window.__marks&&window.__marks.push(["painted",Math.round(performance.now())]);let c=n/2/Math.tan(pp.degToRad(15)),h=new Hs;h.background=new ee(Tt.loom);let u=new Un(30,e/n,10,c*6);u.position.set(0,0,c),h.environment=H_(s),window.__marks&&window.__marks.push(["env",Math.round(performance.now())]);let f=new Ol(16773856,1.4);f.position.set(-.45,.75,1),h.add(f),h.add(new Nl(16051420,1446428,.55));let d=G_({W:e,H:n,chunks:l,scale:a}),p=d.uniforms;p.uPitch.value=r.pitch,h.add(d.mesh);let _=100,g=64,m=new Uint8Array(_*g),v=new $o(m,_,g,Hl,Bn);v.minFilter=v.magFilter=Je,v.needsUpdate=!0,p.tDist.value=v;let S=r.phone?.95:1.55,x=W_({W:e,H:n,fellY:r.F,scale:S,tsubaX:r.phone?34:Math.round(e*.085),tipMargin:r.phone?12:40});h.add(x.group);let w=Y_({x:e+300,y:r.F-r.sh/2,W:e,H:n,bobbin:Tt.atlas,scale:r.phone?.62:1.15});h.add(w);let M=new jn;h.add(M);let E=new li(new z(0,1,0),0),y=new li(new z(0,-1,0),n/2-r.hdr),b=r.phone?1.5:2.1,A=Op({W:e,H:n,radius:b}),R=Op({W:e,H:n,radius:b});A.mat.clippingPlanes=R.mat.clippingPlanes=[E,y],M.add(A.mesh,R.mesh);let P=Z_({size:r.phone?1.05:1.6});P.position.set(r.jid.sigX-e/2,n/2-r.jid.brk,4),P.rotation.set(.4,.3,0),M.add(P);let N=r.jid.andon,L=q_({x:N.x,y:N.y,w:N.w,h:N.h,W:e,H:n});M.add(L.group);let F=r.jid.sigX,k=r.jid.brk,B=r.F,$=r.phone?.7:1,W=[[0,-60,.5],[0,k*.45,.5],[0,k-30,.5],[0,k-8,1.5],[1,k+6,6],[7,k+18,16],[19,k+21,26],[27,k+12,32],[23,k+1,38],[12,k+3,42],[9,k+14,46],[16,k+24,49],[26,k+30,50]],D=[[0,B+40,1],[0,B+8,6],[1,B-10,12],[8,B-30,22],[22,B-34,30],[30,B-20,34],[22,B-6,38],[6,B-8,40],[-4,B-22,42],[-10,B-40,40],[-6,B-58,38],[2,B-64,37]],Q=Y=>[F+Y[0]*$,Y[1],Y[2]],Ct=W.map((Y,ft)=>[F,-60+(k- -60)*ft/(W.length-1),1.2]),yt=D.map((Y,ft)=>[F,B+40+(k-(B+40))*ft/(D.length-1),1.2]),Bt=(Y,ft,It)=>Y+(ft-Y)*It,st=(Y,ft)=>{let It=jt=>ft*(r.phone?4:6)*Math.sin(Math.PI*Math.min(1,Math.max(0,(jt+60)/(B+100)))),O=(jt,Ft)=>jt.map((I,T)=>{let G=Q(Ft[T]),X=Bt(I[1],G[1],Y);return[Bt(I[0]+It(I[1]),G[0],Y),X,Bt(I[2],G[2],Y)]});A.set(O(Ct,W)),R.set(O(yt,D))},bt={},q=(Y,ft)=>{let It=Math.round(Y)+":"+ft.toFixed(2);return bt[It]??(bt[It]=KT(n,c,Y,ft))},j="",dt=0;function zt(Y,ft={lift:0}){p.uClothY.value=Y.clothY,p.uFell.value=Y.fell,p.uWTop.value=Y.wTop,p.uWBot.value=Y.wBot,p.uAmpW.value=Y.ampW,p.uAmpVel.value=Y.ampVel,p.uVelSign.value=Y.velSign,p.uFresh.value=Y.fresh,p.uAmpL.value=Y.ampL,p.uAmpTop.value=Y.ampTop,p.uLooseScale.value=Y.looseScale,p.uLooseOff.value=Y.looseOff,p.uFade.value=Y.fade,p.uTopLit.value=Y.topLit,p.uNearW.value=Y.nearW,p.uNearD.value=Y.nearD,p.uRecede.value=Y.recede,p.uLooseLen.value=q(Y.fell,Y.recede),p.uSweep.value=Y.sweep,p.uPull.value.set(r.abr.split,r.panels.abr.y0,r.abr.pullLen,Y.pull),p.uPick.value.set(Y.pickTop,r.F,Y.pickX,Y.pickDir),p.uJiyak.value.set(r.panels.hero.y0+r.F-3,Y.jiyak);let It=r.time,O=r.panels.time.y0;p.uShearR.value.set(It.x0,O+It.tk[0],It.x1,O+It.tk[1]),p.uShear.value=Y.shear,p.uShotR.value.set(It.shot[0],O+It.shot[1],It.shot[2],O+It.shot[3]),p.uShotFront.value=Y.shotFront,p.uSig.value.set(r.jid.sigX,r.panels.jid.y0-100,r.panels.jid.y0+r.F+50,Y.sigOn>.5&&Y.brk>.3&&Y.rejoin<.7?1:0);let jt=r.panels.jid.y0-Y.clothY+N.y+Y.andonDy;p.uAndon.value.set(N.x,jt,Y.andon*.32,r.phone?190:330),p.uAndonCol.value.set(...jT(Tt.shu,"#1FA673",Y.andonMix)),Y.safe&&p.uSafe.value.set(...Y.safe),p.uSafeK.value=Y.safeK,p.uTies.value=Y.ties,p.uDrop.value.x=Y.drop,p.uDrop.value.y=Math.floor(r.threads/2),p.uIntro.value.set(Y.introReg,Y.introAmp),p.uDim.value=Y.dim,p.uShock.value=Y.shock,p.uShockA.value=Y.shockA,p.uLightPos.value.set(Y.lightX,Y.lightY),p.uLight.value.set(Y.lightDX,Y.lightDY,1),x.setY(Y.bladeY+Y.bladeLift+ft.lift),x.group.visible=Y.bladeY>-60&&Y.bladeY<n+40,x.glint.value=Y.glint,w.visible=Y.shuttleX>-260&&Y.shuttleX<e+260,w.position.set(Y.shuttleX-e/2,n/2-Y.shuttleY,12);let Ft=r.phone?.62:1.15;w.scale.set(Ft*Y.shuttleSX,Ft/Math.sqrt(Y.shuttleSX),Ft);let I=Y.clothY-r.panels.jid.y0;M.position.y=I,M.visible=Y.sigOn>.5&&I>-n*1.2&&I<r.F-30;let T=Y.brk*(1-Y.rejoin);st(T,Y.bow),P.scale.setScalar(Math.max(1e-4,Y.knot)),P.visible=Y.knot>.01,L.set(Y.andon,Y.andonMix,Y.andonDy);let G=Math.min(Y.wBot+(Y.wBot>=r.F-1?70:2),n+100);E.constant=G-n/2;let X=Nt(Y)+ft.lift.toFixed(2);return X!==j||xt?(j=X,!0):!1}let xt=!1;function Ot(){xt&&(v.needsUpdate=!0,xt=!1),s.render(h,u),dt++}function Nt(Y){let ft="";for(let It in Y){let O=Y[It];ft+=typeof O=="number"?O.toFixed(2):String(O),ft+="|"}return ft}let et=0;function ot(Y,ft,It,O,jt){let Ft=Math.max(1,Math.ceil(Math.hypot(It-Y,O-ft)/30)),I=120/e*_;for(let T=0;T<=Ft;T++){let G=(Y+(It-Y)*T/Ft)/e*_,X=(ft+(O-ft)*T/Ft)/n*g,tt=Math.ceil(I*1.6);for(let gt=Math.max(0,Math.floor(X-tt));gt<Math.min(g,X+tt);gt++)for(let ht=Math.max(0,Math.floor(G-tt));ht<Math.min(_,G+tt);ht++){let nt=((ht-G)**2+(gt-X)**2)/(I*I),it=Math.round(255*jt*Math.exp(-nt*1.2)),Mt=gt*_+ht;it>m[Mt]&&(m[Mt]=it)}}xt=!0,et=1}function ct(Y,ft=1){if(!et)return;let It=Math.exp(-Y/1.2)*ft,O=0;for(let jt=0;jt<m.length;jt++){let Ft=Math.floor(m[jt]*It);m[jt]=Ft,Ft>O&&(O=Ft)}xt=!0,O<3&&(m.fill(0),et=0)}function U(){let Y=0;for(let ft=0;ft<m.length;ft+=7)Y+=m[ft];return Y/(m.length/7)/255}function mt(){s.compile(h,u)}let Ht=!1;try{let Y=s.getContext(),ft=Y.getExtension("WEBGL_debug_renderer_info"),It=ft?Y.getParameter(ft.UNMASKED_RENDERER_WEBGL):Y.getParameter(Y.RENDERER);Ht=/swiftshader|llvmpipe|softpipe|software/i.test(It)}catch{}return{software:Ht,renderer:s,apply:zt,render:Ot,compile:mt,stamp:ot,decay:ct,energy:U,get frames(){return dt},canvas:s.domElement,blade:x,chunks:l,scale:a}}function jT(r,t,e){let n=parseInt(r.slice(1),16),i=parseInt(t.slice(1),16),s=[n>>16&255,n>>8&255,n&255],o=[i>>16&255,i>>8&255,i&255];return s.map((a,l)=>(a+(o[l]-a)*e)/255)}var wi,QT,Yu,tx=function(){return wi||typeof window<"u"&&(wi=window.gsap)&&wi.registerPlugin&&wi},kp=function(t,e){return!!(typeof t>"u"?e:t&&!~(t+"").indexOf("false"))},tE=function(t){if(wi=t||tx(),wi){Yu=wi.registerEase;var e=wi.parseEase(),n=function(o){return function(a){var l=.5+a/2;o.config=function(c){return o(2*(1-c)*c*l+c*c)}}},i;for(i in e)e[i].config||n(e[i]);Yu("slow",fa),Yu("expoScale",zp),Yu("rough",Ks);for(i in Ql)i!=="version"&&wi.core.globals(i,Ql[i]);QT=1}},ex=function(t,e,n){t=Math.min(1,t||.7);var i=t<1?e||e===0?e:.7:0,s=(1-t)/2,o=s+t,a=kp(n);return function(l){var c=l+(.5-l)*i;return l<s?a?1-(l=1-l/s)*l:c-(l=1-l/s)*l*l*l*c:l>o?a?l===1?0:1-(l=(l-o)/s)*l:c+(l-c)*(l=(l-o)/s)*l*l*l:a?1:c}},nx=function(t,e,n){var i=Math.log(e/t),s=e-t;return n&&(n=wi.parseEase(n)),function(o){return(t*Math.exp(i*(n?n(o):o))-t)/s}},Up=function(t,e,n){this.t=t,this.v=e,n&&(this.next=n,n.prev=this,this.c=n.v-e,this.gap=n.t-t)},ix=function(t){typeof t!="object"&&(t={points:+t||20});for(var e=t.taper||"none",n=[],i=0,s=(+t.points||20)|0,o=s,a=kp(t.randomize,!0),l=kp(t.clamp),c=wi?wi.parseEase(t.template):0,h=(+t.strength||1)*.4,u,f,d,p,_,g,m;--o>-1;)u=a?Math.random():1/s*o,f=c?c(u):u,e==="none"?d=h:e==="out"?(p=1-u,d=p*p*h):e==="in"?d=u*u*h:u<.5?(p=u*2,d=p*p*.5*h):(p=(1-u)*2,d=p*p*.5*h),a?f+=Math.random()*d-d*.5:o%2?f+=d*.5:f-=d*.5,l&&(f>1?f=1:f<0&&(f=0)),n[i++]={x:u,y:f};for(n.sort(function(v,S){return v.x-S.x}),g=new Up(1,1,null),o=s;o--;)_=n[o],g=new Up(_.x,_.y,g);return m=new Up(0,0,g.t?g:g.next),function(v){var S=m;if(v>S.t){for(;S.next&&v>=S.t;)S=S.next;S=S.prev}else for(;S.prev&&v<=S.t;)S=S.prev;return m=S,S.v+(v-S.t)/S.gap*S.c}},fa=ex(.7);fa.ease=fa;fa.config=ex;var zp=nx(1,2);zp.config=nx;var Ks=ix();Ks.ease=Ks;Ks.config=ix;var Ql={SlowMo:fa,RoughEase:Ks,ExpoScaleEase:zp};for(Bp in Ql)Ql[Bp].register=tE,Ql[Bp].version="3.15.0";var Bp;tx()&&wi.registerPlugin(fa);pn.registerPlugin(Ks);function rx(r){let{W:t,H:e,F:n,phone:i}=r;return{clothY:0,fell:n,wTop:-1,wBot:n,bladeY:n,bladeLift:0,ampW:.6,ampVel:0,velSign:1,fresh:0,ampL:i?40:60,ampTop:2,looseScale:i?2.6:2.4,looseOff:30,fade:i?60:70,topLit:1,recede:.7,nearW:.27,nearD:110,sweep:t*1.05,glint:t*.62,pull:0,pickTop:n,pickX:-200,pickDir:0,jiyak:6*r.pitch*.5,shear:0,shotFront:0,sigOn:0,bow:0,brk:0,rejoin:0,knot:0,andon:0,andonMix:0,andonDy:-620,safe:r.danSafe,safeK:1,ties:0,drop:-1,introReg:1,introAmp:0,dim:1,shock:-1,shockA:0,lightX:t*.3,lightY:e*.25,lightDX:-.35,lightDY:.22,shuttleX:t-(i?52:120),shuttleY:n-(i?10:17),shuttleSX:1,needle:0,hanko:0,mei:0}}function sx(r,t,e){let{W:n,H:i,F:s,sh:o,phone:a}=r,l=pn.timeline({paused:!0,defaults:{ease:"sine.inOut"}}),c=Object.fromEntries(Gi.map((M,E)=>[M,E])),h=r.clothY,u=(M,E,y,b)=>l.to(t,{...M,duration:y,ease:b||"sine.inOut"},E),f=(M,E)=>l.set(t,M,E),d=(M,E,y=.13)=>M&&l.fromTo(M,{"--w":0},{"--w":1,duration:y,ease:"power2.inOut"},E),p=(M,E,y=.12)=>M&&l.fromTo(M,{"--a":0},{"--a":1,duration:y,ease:"power2.inOut",immediateRender:!1},E),_=(M,E=10)=>{u({bladeLift:E},M,.05,"power4.in"),u({bladeLift:0},M+.05,.12,"elastic.out(1, 0.4)"),f({shock:0,shockA:3},M+.05),u({shock:1.3,shockA:0},M+.05,.14,"none"),f({shock:-1},M+.2)},g=(M,E)=>u({sweep:M},E+.15,.7,"none"),m=(M,E)=>u({glint:M},E+.15,.7,"power1.inOut");Gi.forEach((M,E)=>{E!==Gi.length-1&&(g(n*(E%2?1.05:.35)+i*.3,E),m(n*(E%2?.3:.72),E))});let v=c.hero;u({clothY:h.kasuri},v+.15,.7),u({shuttleX:n+320},v+.15,.18,"power2.in"),_(v+.48),v=c.kasuri,u({pull:1},v+.15,.55,"none"),d(e["abr-l2"],v+.72),d(e["abr-h2"],v+.74),_(v+.62,6),v=c.abr,p(e["abr-l1"],v+.15),p(e["abr-l2"],v+.16),p(e["abr-h2"],v+.17),u({wTop:s},v+.15,.45,"power1.inOut"),u({ampTop:a?18:28},v+.15,.45),u({bladeY:-90},v+.15,.27,"power2.in"),u({looseScale:1,looseOff:0},v+.4,.2),u({fell:i+4,recede:0,fade:i*1.4},v+.45,.4),u({ties:1},v+.6,.25),u({safeK:a?.36:.55},v+.5,.3),d(e["dan-l"],v+.7),d(e["dan-h2"],v+.72),d(e["dan-p"],v+.76),v=c.dandori,p(e["dan-l"],v+.15),p(e["dan-h2"],v+.16),p(e["dan-p"],v+.17),u({ties:0,safeK:1},v+.15,.15),u({ampTop:a?6:8},v+.15,.3),u({clothY:h.jidoka},v+.15,.33,"power1.inOut"),f({wBot:-20,wTop:-1,sigOn:1,ampTop:a?6:8},v+.48),f({bladeY:-20},v+.48),u({wBot:s,bladeY:s},v+.48,.37,"none"),u({fell:s,recede:.7,fade:a?60:70,looseScale:a?2.6:2.4,looseOff:30},v+.72,.13),u({andonDy:0},v+.6,.25,"power2.out"),u({lightX:n*.85,lightY:i*.15,lightDX:-.2,lightDY:.3},v+.4,.4),v=c.jidoka,u({bow:1},v+.15,.45,"power2.in"),u({andon:.22},v+.15,.45,'rough({ strength: 1.6, points: 14, taper: "none", randomize: false, clamp: true })'),u({brk:1,bow:0},v+.6,.16,"power3.out"),u({andon:1},v+.6,.08,"power2.out"),u({bladeLift:10},v+.6,.12,"power2.out"),d(e["jid-p"],v+.72),v=c.snap,p(e["jid-l"],v+.15),p(e["jid-h2"],v+.16),p(e["jid-p"],v+.17),u({rejoin:1},v+.15,.35,"back.out(1.4)"),u({knot:1},v+.45,.15,"back.out(2)"),u({andonMix:1},v+.5,.1),u({bladeLift:0},v+.6,.06,"power2.in"),_(v+.68),d(e["hor-l"],v+.72),d(e["hor-h2"],v+.74),d(e["hor-p"],v+.78),v=c.horenso,u({clothY:h.quramiz},v+.15,.7),u({andonDy:-80,andon:.6},v+.15,.7),u({lightX:n*.3,lightY:i*.25,lightDX:-.35,lightDY:.22},v+.15,.7),_(v+.5),u({shuttleX:n-(a?52:110)},v+.6,.25,"power3.out");let S=a?52:110,x=n-(a?52:110),w=(M,E)=>{let y=M%2?1:-1,b=y>0?-60:n+60,A=y>0?n+60:-60,R=y>0?S:x,P=y>0?x:S;f({pickDir:y,pickX:b,pickTop:s},E),u({clothY:h.quramiz+(M+1)*o,pickTop:s-o},E,.05,"power1.inOut"),u({shuttleX:R-y*22},E,.03,"power2.out"),u({shuttleX:P,pickX:A},E+.03,.1,"power2.inOut"),u({shuttleSX:1.15},E+.03,.04,"power2.out"),u({shuttleSX:.88},E+.11,.02,"power2.in"),u({shuttleSX:1},E+.13,.04,"elastic.out(1, 0.35)");let N=e["svc-d"+M];N&&l.fromTo(N,{"--w":0},{"--w":1,duration:.07,ease:"power1.inOut"},E+(y>0?.08:.04)),_(E+.13,7)};for(let M=0;M<4;M++)w(M,c.quramiz+.15+M*.175);for(let M=4;M<7;M++)w(M,c.stripes4+.15+(M-4)*.175);return d(e["svc-hint"],c.stripes4+.74),v=c.stripes7,f({pickDir:0},v+.15),u({shuttleX:-320},v+.15,.15,"power2.in"),u({clothY:h.time},v+.15,.7),_(v+.5),v=c.time,u({shear:4*r.time.hw},v+.15,.4,"power2.inOut"),_(v+.55,7),l.fromTo(t,{shotFront:r.time.shot[0]},{shotFront:r.time.shot[2]+2,duration:.23,ease:"none",immediateRender:!1},v+.62),u({needle:1},v+.66,.16,"power2.out"),d(e["time-p"],v+.72),d(e["now-l"],v+.78,.08),v=c.shot,u({clothY:h.contact},v+.15,.7),_(v+.5),v=c.contact,u({clothY:h.phone},v+.15,.7),_(v+.5),u({hanko:1},v+.78,.07,"power3.in"),v=c.phone,u({clothY:h.footer},v+.15,.7),_(v+.5),u({mei:1},v+.76,.09,"back.out(1.6)"),l.set({},{},Gi.length-1),l}function ox(r,t,e,n,i){let{W:s,H:o,F:a,phone:l}=r;Object.assign(t,e,{fell:0,wTop:-1,wBot:-30,bladeY:-90,looseScale:1,looseOff:0,fade:o*1.15,recede:0,ampL:0,introAmp:l?70:90,introReg:0,drop:0,jiyak:0,shuttleX:-320,sweep:-500,ampW:6,fresh:5,glint:-200,topLit:1.45,nearW:.3,nearD:4e3});let c=pn.timeline({paused:!0}),h=r.pitch*.5;c.fromTo(t,{drop:0},{drop:1.6,duration:1.6,ease:"none"},0),c.set(t,{drop:-1},1.6),c.to(t,{introReg:1,duration:.8,ease:"power2.inOut"},1.05),c.set(t,{introAmp:0},1.86),c.set(t,{bladeY:-40,wBot:-30},1.84),c.to(t,{bladeY:a,wBot:a,fell:a,duration:.86,ease:"power1.in"},1.84),c.fromTo(t,{bladeLift:0},{bladeLift:3,duration:.05,ease:"sine.inOut",repeat:15,yoyo:!0,immediateRender:!1},1.86),c.set(t,{bladeLift:0},2.7),c.to(t,{looseScale:e.looseScale,looseOff:e.looseOff,fade:e.fade,recede:e.recede,ampL:e.ampL,topLit:1,nearW:e.nearW,nearD:e.nearD,duration:.7,ease:"power2.inOut"},2.62),[3.05,3.45,3.85].forEach((d,p)=>{c.to(t,{bladeLift:16,duration:.11,ease:"power4.in"},d),c.to(t,{bladeLift:0,duration:.3,ease:"elastic.out(1, 0.4)"},d+.11),c.set(t,{shock:0,shockA:3},d+.11),c.to(t,{shock:1.3,shockA:0,duration:.4,ease:"none"},d+.11),c.to(t,{ampW:[3,1.5,e.ampW][p],fresh:[2.5,1.2,0][p],duration:.25,ease:"power2.out"},d+.12),c.call(()=>i.kaizen(p+1),null,d+.11)}),c.set(t,{shock:-1},4.4),c.fromTo(n.hdr,{clipPath:"inset(0 0 100% 0)"},{clipPath:"inset(0 0 0% 0)",duration:.4,ease:"power2.out"},4.1),c.fromTo(n.selv,{clipPath:"inset(0 0 100% 0)"},{clipPath:"inset(0 0 0% 0)",duration:.6,ease:"power2.inOut"},4.3),["hero-sub","hero-svc","hero-tate"].forEach((d,p)=>c.fromTo(n[d],{"--w":0},{"--w":1,duration:.6,ease:"power3.inOut"},4.2+p*.08)),c.fromTo(n["hero-cta"],{"--w":0,y:-10,rotation:-3},{"--w":1,y:0,rotation:0,duration:.5,ease:"back.out(1.6)"},4.5),c.call(()=>i.cue(!0),null,4.9),c.to(t,{sweep:s*1.9,duration:3,ease:"sine.inOut"},5.6);let u=s-(l?52:120),f=(d,p,_,g)=>{let m=_>p?1:-1;c.set(t,{shuttleX:p,shuttleSX:1},d-.01),c.to(t,{shuttleX:p-m*6,duration:.12,ease:"power2.out"},d),c.to(t,{shuttleX:_,duration:.5,ease:"power2.inOut"},d+.12),c.to(t,{shuttleSX:1.15,duration:.2,ease:"power2.out"},d+.12),c.to(t,{shuttleSX:.88,duration:.1,ease:"power2.in"},d+.52),c.to(t,{shuttleSX:1,duration:.4,ease:"elastic.out(1, 0.35)"},d+.62),c.to(t,{jiyak:g*h,duration:.12,ease:"power2.out"},d+.6),c.to(t,{bladeLift:10,duration:.08,ease:"power4.in"},d+.66),c.to(t,{bladeLift:0,duration:.3,ease:"elastic.out(1, 0.4)"},d+.74)};return f(6.6,-260,u,2),c.to(t,{glint:s*.95,duration:2.2,ease:"power1.inOut"},7.6),f(10.4,u,l?52:120,4),c.to(t,{sweep:-500,duration:.01},11),c.to(t,{sweep:s*1.05,duration:3.2,ease:"sine.inOut"},12.2),c.to(t,{glint:s*.08,duration:.01},11.9),c.to(t,{glint:e.glint,duration:1.6,ease:"power1.inOut"},12),f(13.2,l?52:120,u,6),c.set({},{},16.2),c}var Ge=r=>document.getElementById(r);function ax(){let r={};return document.querySelectorAll("[id]").forEach(t=>r[t.id]=t),document.querySelectorAll("#stripes li").forEach((t,e)=>r["svc-d"+e]=t.querySelector(".d")),r}var eE=["hero-sub","hero-svc","hero-cta","hero-tate","abr-l1","abr-l2","abr-h2","dan-l","dan-h2","dan-p","jid-l","jid-h2","jid-p","hor-l","hor-h2","hor-p","svc-hint","time-p","now-l"];function qu(r){for(let[s,o]of Object.entries(r.dom)){let a=Ge(s);if(a){a.style.top=o.y0+"px",a.style.height=o.h+"px";for(let[l,c]of Object.entries(o.items)){let h=Ge(l);h&&(h.style.left=Math.round(c.x)+"px",h.style.top=Math.round(c.y)+"px",c.w&&(h.style.width=Math.round(c.w)+"px"),c.h&&(h.style.height=Math.round(c.h)+"px"),c.size&&(h.style.fontSize=c.size.toFixed(1)+"px"),c.cls&&h.classList.add(c.cls),c.wrap&&(h.style.whiteSpace="normal"),c.stack&&Object.assign(h.style,{flexDirection:"column",width:Math.round(c.w)+"px"}))}}}eE.forEach(s=>Ge(s)&&Ge(s).classList.add("wp"));let t=r.dom.raqam.items.phone;Object.assign(Ge("phone").style,{lineHeight:Math.round(t.h)+"px",fontSize:(r.phone?20:t.size)+"px"});let e=document.querySelectorAll("#stripes li"),n=Ge("stripes");Object.assign(n.style,{left:0,top:0,width:"100%",height:"100%"}),e.forEach((s,o)=>{let a=r.stripes[o];Object.assign(s.style,{top:a.y0+"px",height:r.sh+"px"});let l=s.querySelector(".d"),c=r.stripeDesc(o);Object.assign(l.style,{left:c.x+"px",top:c.y-a.y0+"px",color:a.ink}),l.classList.add("wp"),s.querySelector(".knot")||s.insertAdjacentHTML("beforeend",'<svg class="knot" viewBox="0 0 30 30" aria-hidden="true"><path d="M15 4c5 0 7 4 5 8s-9 6-9 10 3 5 6 3M8 13c1-4 8-6 11-2s1 9-4 11" fill="none" stroke="#F2B11B" stroke-width="3.2" stroke-linecap="round"/><circle cx="15" cy="15" r="2.4" fill="#F2B11B"/></svg>');let h=s.querySelector(".knot"),u=r.stripeKnot(o);Object.assign(h.style,{left:u.x+"px",top:u.y-a.y0+"px"})});let i=r.time;for(let s of["nums-tk","nums-ts"]){let o=Ge(s);o.innerHTML="";for(let a=0;a<24;a+=i.every){let l=document.createElement("span");l.textContent=String(a).padStart(2,"0"),l.dataset.h=a,l.style.left=i.x0+a*i.hw+"px",o.appendChild(l)}}Ge("layer").style.height=r.stripH+"px"}function lx(r,t){let e=Ge("hdr"),n=Ge("selv"),i=Ge("dom"),s=Ge("layer"),o=Ge("progbar"),a=[...document.querySelectorAll(".nav a, .selv a")],l=[...document.querySelectorAll(".nav a")],c=l.map(w=>{let M=w.getBoundingClientRect();return M.left+M.width/2}),h=()=>[...Ge("nums-tk").children],u=r.time,f=null,d=null,p="",_=-1,g=null,m=null,v=null,S=null,x=(w,M)=>{let E=r.panels,b=Object.values(E).find(A=>w>=A.y0&&w<A.y0+A.h)||E.tail;if(b.id==="abr")return M<r.abr.split?"dark":null;if(b.id==="stripes"){let A=hd[Math.min(6,Math.floor((w-b.y0)/r.sh))];return A.g==="#F2B11B"||A.g==="#EFE6D2"?"light":"dark"}return b.ground==="silk"?"light":"dark"};return function(M,E){M.clothY!==f&&(s.style.transform=`translate3d(0, ${(-M.clothY).toFixed(1)}px, 0)`,f=M.clothY);let y=M.wTop>=0?M.fell:Math.min(M.fell,Math.max(M.wBot,0));y!==d&&(i.style.setProperty("--fell",y.toFixed(1)+"px"),d=y);let b=x(M.clothY+30,60),A=x(M.clothY+30,r.W-60);A===null&&(A=M.pull>.6?"light":"dark"),(M.wTop>40||M.wBot<64&&M.fell>64)&&(b="dark",A="dark"),M.bladeY<0&&M.wTop<0&&M.drop>=0&&(b=A="dark");let R=M.wTop>40?"1":"0",P=c.map(F=>M.wTop>40?"dark":x(M.clothY+30,F)??(M.pull>.6?"light":"dark")),N=b+A+R+P.join("");N!==p&&(e.dataset.tl=b,e.dataset.tr=A,e.dataset.scrim=R,l.forEach((F,k)=>F.dataset.tone=P[k]),n.dataset.tone=x(M.clothY+r.H*.5,20)==="light"&&M.wTop<40?"light":"dark",p=N);let L=Math.round(E);if(L!==_){_=L;let F=nE[Gi[L]];a.forEach(k=>{let B=k.getAttribute("href")==="#"+F||F==="horenso"&&k.getAttribute("href")==="#jidoka"&&k.closest(".nav")||F==="dandori"&&k.getAttribute("href")==="#abr"&&k.closest(".nav");k.classList.toggle("on",B),B?k.setAttribute("aria-current","true"):k.removeAttribute("aria-current")}),t["jid-state"].textContent=L===5?"Dastgoh to\u02BBxtadi.":""}if(o&&(o.style.transform=`scaleX(${(E/(Gi.length-1)).toFixed(4)})`),M.shear!==g){g=M.shear;let F=u.x1-u.x0;h().forEach(k=>{let $=((+k.dataset.h*u.hw-M.shear)%F+F)%F;k.style.left=(u.x0+$).toFixed(1)+"px",k.style.visibility=$<6||$>F-6?"hidden":"visible"})}if(M.needle!==m&&(m=M.needle,t.needle.firstChild.style.transform=`scaleY(${M.needle.toFixed(3)})`,t.needle.style.visibility=M.needle>.01?"visible":"hidden"),M.hanko!==v){v=M.hanko;let F=M.hanko;t.hanko.style.visibility=F>.01?"visible":"hidden",t.hanko.style.transform=`translateY(${(-(1-F)*14).toFixed(1)}px) scale(${(1.22-.22*F).toFixed(3)}) rotate(${(-9+6*F).toFixed(2)}deg)`,t.hanko.style.filter=F<.99?`drop-shadow(0 ${((1-F)*16).toFixed(1)}px ${((1-F)*10).toFixed(1)}px rgba(0,0,0,0.25))`:"none"}M.mei!==S&&(S=M.mei,t.mei.style.visibility=M.mei>.01?"visible":"hidden",t.mei.style.transform=`translateY(${(-(1-M.mei)*12).toFixed(1)}px) rotate(${((1-M.mei)*-4).toFixed(2)}deg)`)}}var nE={hero:"hero",kasuri:"abr",abr:"abr",dandori:"dandori",jidoka:"jidoka",snap:"jidoka",horenso:"horenso",quramiz:"xizmatlar",stripes4:"xizmatlar",stripes7:"xizmatlar",time:"vaqt",shot:"vaqt",contact:"aloqa",phone:"aloqa",footer:"footer"},cx={hero:0,abr:2,dandori:3,jidoka:5,horenso:6,xizmatlar:9,vaqt:11,aloqa:12,raqam:13,footer:14};function Vp(r){let t=s=>new Intl.DateTimeFormat("uz-UZ",{timeZone:s,hour:"2-digit",minute:"2-digit",hourCycle:"h23"}),e=t("Asia/Tashkent"),n=t("Asia/Tokyo"),i=()=>{let s=new Date;Ge("clk-ts").textContent=e.format(s),Ge("clk-tk").textContent=n.format(s);let[o,a]=e.format(s).split(":").map(Number),l=r.time,c=l.x0+(o+a/60)*l.hw;Ge("needle").style.left=c.toFixed(1)+"px",Ge("now-l").style.left=Math.round(c-22)+"px"};i(),setInterval(i,15e3)}function hx(){let r=["Mobil ilovalar","Veb-saytlar","Telegram botlar","Backend","Desktop ilovalar","IoT","AI"],t=new Set;try{JSON.parse(sessionStorage.getItem("qilich.picks")||"[]").forEach(n=>t.add(n))}catch{}let e=()=>{document.querySelectorAll("#stripes button").forEach(o=>{let a=t.has(+o.dataset.svc);o.setAttribute("aria-pressed",a),o.closest("li").classList.toggle("on",a)});let n=[...t].sort().map(o=>r[o]),i=Ge("picks");i.hidden=!n.length,i.textContent=n.length?"TANLANGANLAR \xB7 "+n.join(" \xB7 ").toUpperCase():"";let s=n.length?`Assalomu alaykum! Bizga kerak: ${n.join(", ")}.`:"Assalomu alaykum!";Ge("mailtag").href=`mailto:inbox@qilich.com?subject=${encodeURIComponent("Loyiha")}&body=${encodeURIComponent(s)}`;try{sessionStorage.setItem("qilich.picks",JSON.stringify([...t]))}catch{}};document.querySelectorAll("#stripes button").forEach(n=>n.addEventListener("click",()=>{let i=+n.dataset.svc;t.has(i)?t.delete(i):t.add(i),e()})),e()}function ux(r){let t=document.querySelector(".menubtn"),e=Ge("menu"),n=Ge("hdr"),i=()=>{e.hidden=!0,t.setAttribute("aria-expanded","false"),n.classList.remove("open")};t.addEventListener("click",()=>{let s=e.hidden;e.hidden=!s,t.setAttribute("aria-expanded",String(s)),n.classList.toggle("open",s),s&&e.querySelector("a").focus()}),e.addEventListener("click",s=>{s.target.closest("a")&&i()}),addEventListener("keydown",s=>{s.key==="Escape"&&!e.hidden&&(i(),t.focus())})}function fx(r){let t=Ge("cur");if(!matchMedia("(pointer: fine)").matches)return null;document.documentElement.classList.add("fine");let e=t.querySelector(".thr"),n=t.querySelector(".ring"),i=12,s=5.5,o=Array.from({length:i},(d,p)=>({x:0,y:p*s,px:0,py:p*s})),a=-100,l=-100,c=0,h=!1,u=null,f=[];return addEventListener("pointermove",d=>{if(d.pointerType!=="mouse")return;let p=performance.now();f.push([p,d.clientX,d.clientY]),f=f.filter(v=>p-v[0]<260);let _=a,g=l;a=d.clientX,l=d.clientY,h||(o.forEach((v,S)=>{v.x=v.px=a,v.y=v.py=l+S*s}),h=!0),c=p,t.classList.remove("idle"),clearTimeout(u),u=setTimeout(()=>t.classList.add("idle"),1100),f.length>=3&&_>-50&&r(_,g,a,l,Math.hypot(a-_,l-g)/Math.max(1,p-f[f.length-2][0])*1e3);let m=d.target.closest&&d.target.closest("a, button");n.setAttribute("r",m?19:13)},{passive:!0}),addEventListener("pointerleave",()=>t.classList.add("idle")),{step(d,p){if(!h||!(performance.now()-c<1600)&&t.classList.contains("idle"))return!1;o[0].x=a,o[0].y=l+13;let g=Math.min(d,1/30);for(let m=1;m<i;m++){let v=o[m],S=(v.x-v.px)*.9,x=(v.y-v.py)*.9;v.px=v.x,v.py=v.y,v.x+=S,v.y+=x+900*g*g}for(let m=0;m<6;m++)for(let v=1;v<i;v++){let S=o[v-1],x=o[v],w=x.x-S.x,M=x.y-S.y,E=Math.hypot(w,M)||1,y=(E-s)/E;v===1?(x.x-=w*y,x.y-=M*y):(S.x+=w*y*.5,S.y+=M*y*.5,x.x-=w*y*.5,x.y-=M*y*.5)}return t.style.transform=`translate(${a-70}px, ${l-30}px)`,e.setAttribute("points",o.map(m=>`${(m.x-a).toFixed(1)},${(m.y-l).toFixed(1)}`).join(" ")),p&&t.dataset.tone!==p&&(t.dataset.tone=p),!0}}}function Hp(r){let t=document.getElementById("layer");t.querySelectorAll("canvas.bg").forEach(i=>i.remove());let e=Math.min(window.devicePixelRatio||1,2);for(let i of Object.keys(r.panels)){let s=r.panels[i],o=j_(r,i,e);o.className="bg",o.setAttribute("aria-hidden","true"),Object.assign(o.style,{position:"absolute",left:0,top:s.y0+"px",width:"100%",height:s.h+"px"}),t.insertBefore(o,t.firstChild)}let n=i=>{let s=document.getElementById(i);s&&(s.style.visibility="visible")};["needle","hanko","mei"].forEach(n),document.getElementById("hdr").dataset.tl="light",document.getElementById("hdr").dataset.tr="light",document.documentElement.dataset.ready="1"}pn.registerPlugin(re);var gs=document.documentElement,ei=r=>document.getElementById(r);async function iE(){let r=['112px "Dela Gothic One"','300 40px "Noto Serif Display"','italic 300 40px "Noto Serif Display"','500 13px "IBM Plex Mono"','400 20px "Onest"','600 20px "Onest"','500 16px "Zen Kaku Gothic New"'],t=Promise.all(r.map(e=>document.fonts.load(e,"AO\u02BBaz\u7D63\u6B62\u9032\u65E5\u672C")));await Promise.race([t,new Promise(e=>setTimeout(e,2500))])}function rE(r){ei("pin").insertAdjacentHTML("beforeend",`<div class="fr cue wp" id="cue" aria-hidden="true"><svg class="yag" viewBox="0 0 18 34">${[0,1,2].map(n=>`<g transform="translate(0 ${n*11})" opacity="${1-n*.25}"><path d="M0 0L9 6V10L0 4Z" fill="#F2B11B"/><path d="M18 0L9 6V10L18 4Z" fill="#F6F1E6"/></g>`).join("")}</svg><span>PASTGA</span></div>
     <div class="fr kz" id="kz" aria-hidden="true"><span lang="ja">\u6539\u5584</span> <b>1</b></div>`);let e=r.F+Math.round((r.H-r.F)/2);Object.assign(ei("cnt").style,{left:r.m+"px",top:e-8+"px"}),Object.assign(ei("cue").style,{right:r.m+"px",top:e-17+"px"}),Object.assign(ei("kz").style,{right:(r.phone?16:r.W*.08)+"px",top:e-8+"px"}),ei("cue").style.setProperty("--w",0)}var da=r=>(window.__marks=window.__marks||[]).push([r,Math.round(performance.now())]);async function sE(){da("boot"),await iE(),da("fonts");let r=innerWidth,t=innerHeight,e=r<760;if(gs.classList.toggle("phone",e),ux(),hx(),gs.classList.contains("flow")){let st=Gc(r,t,e,!0);return qu(st),Vp(st),Hp(st)}let n=Gc(r,t,e,!1);qu(n),Vp(n),rE(n);let i=ax(),s;try{s=Q_(n,ei("stage"))}catch(st){console.warn("WebGL unavailable, flow mode",st),gs.classList.replace("loom","flow");let bt=Gc(r,t,e,!0);return qu(bt),Hp(bt)}da("stage");let o=rx(n),a=sx(n,o,i),l=gs.classList.contains("touch"),c=n.S,h=(Hc-1)*c;ei("snaps").innerHTML=Gi.map((st,bt)=>`<i style="top:${bt*c}px"></i>`).join("");let u=null,f=ei("scroller");l||(u=new W0({wrapper:f,content:ei("track"),eventsTarget:window,autoRaf:!1,smoothWheel:!0,syncTouch:!1,lerp:.05,wheelMultiplier:1}),u.on("scroll",re.update),pn.ticker.add(st=>u.raf(st*1e3)),window.lenis=u,re.defaults({scroller:f})),pn.ticker.lagSmoothing(0),re.config({ignoreMobileResize:!0});let d=re.create({trigger:"#pin",start:"top top",end:"+="+h,pin:!0,pinSpacing:!0,pinType:"fixed",scrub:!0,animation:a});for(let st of["dom","pin"])ei(st).addEventListener("scroll",bt=>{bt.target.scrollTop=0,bt.target.scrollLeft=0});let p=st=>{st=Math.max(0,Math.min(Hc-1,st));let bt=st*c;u?u.scrollTo(bt,{duration:Math.min(2.6,.7+Math.abs(st-a.time())*.16)}):window.scrollTo({top:bt,behavior:"smooth"})};document.addEventListener("click",st=>{let bt=st.target.closest("a[data-k]");!bt||st.metaKey||st.ctrlKey||st.shiftKey||(st.preventDefault(),p(+bt.dataset.k))}),document.addEventListener("focusin",st=>{let bt=st.target.closest&&st.target.closest(".pn");if(!bt||st.target.closest(".hdr"))return;let q=cx[bt.id];q!=null&&Math.abs(a.time()-q)>.05&&p(q)}),addEventListener("keydown",st=>{if(st.target.closest&&st.target.closest("input, textarea, select, [contenteditable]"))return;let bt=st.target.closest&&st.target.closest("a, button"),q=Math.round(a.time()),j=null;(st.key==="ArrowDown"||st.key==="PageDown"||st.key===" "&&!st.shiftKey&&!bt)&&(j=q+1),(st.key==="ArrowUp"||st.key==="PageUp"||st.key===" "&&st.shiftKey&&!bt)&&(j=q-1),st.key==="Home"&&(j=0),st.key==="End"&&(j=Hc-1),j!=null&&(st.preventDefault(),w(),p(j))});let _={},g={kaizen(st){let bt=ei("kz");bt.querySelector("b").textContent=st,pn.fromTo(bt,{"--w":0},{"--w":1,duration:.18,ease:"power2.out",overwrite:!0}),pn.to(bt,{"--a":1,duration:.2,delay:.32,ease:"power2.in"}),pn.set(bt,{"--a":0})},cue(st){pn.to("#cue",{"--w":st?1:0,duration:.5,ease:"power2.inOut"})}};ei("kz").classList.add("wp"),ei("kz").style.setProperty("--w",0);let m=ox(n,_,o,i,g),v=!0;window.__intro=m;let S=ei("cntn");m.eventCallback("onUpdate",()=>{let st=m.time();st<1.7&&(S.textContent=String(Math.min(n.threads,Math.max(1,Math.round(Math.pow(2,Math.max(0,st-0)/.12/1))))).padStart(3,"0"))}),m.eventCallback("onComplete",()=>{v=!1}),ei("cnt").classList.add("wp"),m.call(()=>pn.to("#cnt",{"--a":1,duration:.4,ease:"power2.in"}),null,2.5);let x=!1,w=()=>{x||!v||(x=!0,m.timeScale(9))};addEventListener("wheel",w,{passive:!0}),addEventListener("touchstart",w,{passive:!0}),addEventListener("scroll",()=>{scrollY>4&&w()},{passive:!0}),u&&u.on("scroll",()=>{u.scroll>4&&w()});let M=null;try{M=sessionStorage.getItem("qilich.y"),sessionStorage.removeItem("qilich.y")}catch{}if(da("built"),s.compile(),da("compiled"),M!=null)m.progress(1),v=!1,window.scrollTo(0,+M),u&&u.scrollTo(+M,{immediate:!0,force:!0});else{pn.ticker.tick();let st=Math.min(1.75,Math.max(0,performance.now()/1e3-.25));m.time(st).play()}let E={lift:0},y=0,b=-1e9,A=null,R=fx((st,bt,q,j,dt)=>{let zt=performance.now();o.lightX=_.lightX=q,o.lightY=_.lightY=j,!(j>n.F-4||dt<80)&&(s.stamp(st,bt,q,j,Math.min(1,dt/1400)),b=zt,dt>300&&(y=zt))}),P=()=>{A=pn.timeline({onComplete:()=>A=null}),A.to(E,{lift:18,duration:.15,ease:"power2.out"}),[0,1,2].forEach(st=>{let bt=.15+st*.25;A.to(E,{lift:0,duration:.08,ease:"power4.in"},bt),A.call(()=>{s.decay(0,.45),g.kaizen(st+1)},null,bt+.08),st<2&&A.to(E,{lift:12,duration:.12,ease:"power2.out"},bt+.1)})},N=lx(n,i),L=/bench/.test(location.search),F=+(new URLSearchParams(location.search).get("gap")??(s.software?320:0)),k=!1,B=0,$=[],W=0,D=!0,Q=0,Ct=0,yt={lift:0};pn.ticker.add((st,bt)=>{let q=Math.min(.25,bt/1e3),j=v?_:o,dt=u?u.scroll:scrollY,zt=(dt-Q)/Math.max(q,1/120);Q=dt,Ct+=(zt-Ct)*Math.min(1,q*12);let xt=Math.abs(Ct)<4?0:Ct,Ot=Math.min(e?12:16,Math.abs(xt)/(e?240:160));W+=(Ot-W)*Math.min(1,q*9),W<.08&&(W=0),j.ampVel=Math.round(W*10)/10,j.velSign=xt>=0?1:-1;let Nt=performance.now();s.decay(q),!A&&!v&&s.energy()>.035&&Nt-y>250&&Nt-b<1500&&P();let et=v?0:a.time();D&&et>.12&&(D=!1,g.cue(!1)),!D&&et<.05&&!v&&(D=!0,g.cue(!0)),yt.lift=E.lift;let ot=s.apply(j,yt);if(R&&R.step(q,gs.dataset.ctone),ot&&(k=!0),(k||L)&&!document.hidden&&Nt-B>=F){k=!1,B=Nt,N(j,et);let ct=performance.now();s.render(),L&&(s.renderer.getContext().finish(),$.push(performance.now()-ct),$.length>30&&$.shift(),window.__ft=$.reduce((U,mt)=>U+mt,0)/$.length),window.__glOn||da("first-render"),window.__glOn=!0,window.__renders=(window.__renders||0)+1}}),gs.dataset.ready="1",window.__qilich={get k(){return a.time()},master:a,U:o,L:n};let Bt=null;addEventListener("resize",()=>{clearTimeout(Bt),Bt=setTimeout(()=>{if(Math.abs(innerWidth-r)>2||Math.abs(innerHeight-t)>140){try{sessionStorage.setItem("qilich.y",String(Math.round(a.time())*c))}catch{}location.reload()}},350)})}sE().catch(r=>{console.error(r),gs.classList.remove("loom"),gs.classList.add("flow")});
/*! Bundled license information:

gsap/gsap-core.js:
  (*!
   * GSAP 3.15.0
   * https://gsap.com
   *
   * @license Copyright 2008-2026, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license
   * @author: Jack Doyle, jack@greensock.com
  *)

gsap/CSSPlugin.js:
  (*!
   * CSSPlugin 3.15.0
   * https://gsap.com
   *
   * Copyright 2008-2026, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license
   * @author: Jack Doyle, jack@greensock.com
  *)

gsap/Observer.js:
  (*!
   * Observer 3.15.0
   * https://gsap.com
   *
   * @license Copyright 2008-2026, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license
   * @author: Jack Doyle, jack@greensock.com
  *)

gsap/ScrollTrigger.js:
  (*!
   * ScrollTrigger 3.15.0
   * https://gsap.com
   *
   * @license Copyright 2008-2026, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license
   * @author: Jack Doyle, jack@greensock.com
  *)

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)

gsap/EasePack.js:
  (*!
   * EasePack 3.15.0
   * https://gsap.com
   *
   * @license Copyright 2008-2026, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license
   * @author: Jack Doyle, jack@greensock.com
  *)
*/
