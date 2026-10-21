// The warm lamp disc behind the tsuba (Tsuba): seen through the piercings and blurred into the rays.
uniform vec3 uCol; uniform float uR; varying vec2 vP;
void main(){ float r = length(vP)/uR; vec3 c = uCol * (1.25 - 0.9*r*r); gl_FragColor = vec4(c, 1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
