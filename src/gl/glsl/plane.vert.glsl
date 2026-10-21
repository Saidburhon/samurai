varying vec3 vWPos;
varying vec2 vUv;
void main(){ vUv = uv; vec4 wp = modelMatrix*vec4(position,1.); vWPos = wp.xyz; gl_Position = projectionMatrix*viewMatrix*wp; }
