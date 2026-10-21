// One bilinear sample of a premultiplied target (the soft pass), straight onto the canvas.
uniform sampler2D tSrc;
varying vec2 vUv;
void main(){ gl_FragColor = texture2D(tSrc, vUv); }
