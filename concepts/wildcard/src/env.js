import * as THREE from 'three';

// A dark studio with a few soft strip lights: gives polished steel controlled, readable reflections.
export function studioEnv(renderer) {
  const s = new THREE.Scene();
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(50, 48, 24),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
      fragmentShader: `varying vec3 vP;
        void main(){
          float y = vP.y;
          vec3 top = vec3(0.30, 0.31, 0.34), mid = vec3(0.075, 0.075, 0.09), bot = vec3(0.025, 0.022, 0.03);
          vec3 c = y > 0.0 ? mix(mid, top, pow(y, 0.8)) : mix(mid, bot, pow(-y, 0.6));
          // warm silk bounce from the cloth (the cloth sits behind the blade: -z)
          c += vec3(0.55, 0.5, 0.42) * 0.35 * smoothstep(0.2, 1.0, -vP.z) * smoothstep(-0.3, 0.6, y);
          gl_FragColor = vec4(c, 1.0);
        }`,
    })
  );
  s.add(sky);
  const strip = (w, h, x, y, z, intensity, color = 0xffffff) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }));
    m.position.set(x, y, z);
    m.lookAt(0, 0, 0);
    s.add(m);
  };
  // key strip high in front (caught by the up-tilted ji facet)
  strip(60, 7, 0, 16, 20, 5.5);
  // soft fill low in front (keeps the shinogi-ji from going black)
  strip(60, 10, 0, -14, 22, 0.55, 0xd8e2ff);
  // side kickers for the glint along the length
  strip(6, 30, -26, 6, 10, 2.2);
  strip(6, 30, 26, 6, 10, 1.6, 0xfff0dc);
  const pm = new THREE.PMREMGenerator(renderer);
  const tex = pm.fromScene(s, 0.0).texture;
  pm.dispose();
  return tex;
}
