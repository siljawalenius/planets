import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { Path } from "three";

const gui = new GUI();

//loader
const textureLoader = new THREE.TextureLoader();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#07040C");
renderer.shadowMap.enabled = true;

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  1000
);

camera.position.x = 7.8;
camera.position.y = 12.1;
camera.position.z = 40;
scene.add(camera);

gui.add(camera.position, "x", -25, 25, 0.001).name("cameraX");
gui.add(camera.position, "y", -25, 25, 0.001).name("cameraY");
gui.add(camera.position, "z", -25, 25, 0.001).name("cameraZ");

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//
//Axes Helper
//
const axesHelper = new THREE.AxesHelper(50);
//scene.add( axesHelper );

/**
 * PLANETS
 */

const moonColorTexture = textureLoader.load("/moonGrain.jpg");
const moonDisplacementTexture = textureLoader.load(
  "/moonDisplacementTexture.jpeg"
);
const starTexture = textureLoader.load("/starTexture.png");
const sunTexture = textureLoader.load("/sunGrain.jpg");
const venusTexture = textureLoader.load("/venus.jpg");
const mercuryTexture = textureLoader.load("/mercury.jpg");
const mercuryBumpTexture = textureLoader.load("/mercurybump.jpg");
const earthTexture = textureLoader.load("/earth.jpg");

const sunMaterial = new THREE.MeshBasicMaterial(0xffffff);
sunMaterial.map = sunTexture;

const sun = new THREE.Mesh(new THREE.SphereGeometry(4, 32, 32), sunMaterial);
sun.position.set(-0.1, 0, 0); //since the sun is not the center of the universe
scene.add(sun);
//size size of radius 4 maybe? or 5
//other planets will ofc be smaller, but not to physical proportions (keep UX good)

const earthMaterial = new THREE.MeshStandardMaterial();
earthMaterial.map = earthTexture;

const earthGroup = new THREE.Group();
scene.add(earthGroup);
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  earthMaterial
);
const earthRadius = 40;
earthGroup.position.set(earthRadius, 0, 0);
earthGroup.add(earth);
earth.castShadow = true;

const moonMaterial = new THREE.MeshStandardMaterial();
moonMaterial.map = moonColorTexture;
moonMaterial.displacementMap = moonDisplacementTexture;
moonMaterial.displacementScale = 0.01;
moonMaterial.minFilter = THREE.NearestFilter;
moonMaterial.magFilter = THREE.NearestFilter;

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 32, 32),
  moonMaterial
);
const moonRadius = 5;
moon.position.set(moonRadius, 0, 0);
moon.receiveShadow = true;
earthGroup.add(moon);

const venusMaterial = new THREE.MeshStandardMaterial();
venusMaterial.map = venusTexture;

const venus = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  venusMaterial
);
const venusRadius = 25;
venus.position.set(venusRadius, 0, 0);
scene.add(venus);

const mercuryMaterial = new THREE.MeshStandardMaterial();
mercuryMaterial.map = mercuryTexture;
mercuryMaterial.displacementMap = mercuryBumpTexture;
mercuryMaterial.displacementScale = 0.01;

const mercury = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 32, 32),
  mercuryMaterial
);
const mercuryRadius = 15;
mercury.position.set(mercuryRadius, 0, 0);
scene.add(mercury);

const mars = new THREE.Mesh(
  new THREE.SphereGeometry(0.8, 32, 32),
  new THREE.MeshStandardMaterial({color:'#ff0000'})
)
const marsRadius = 52
mars.position.set(marsRadius, 0 , 0)
scene.add(mars)

const jupiter = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({color: '#d2b48c'})
)
const jupiterRadius = 70
jupiter.position.set(jupiterRadius, 0, 0)
scene.add(jupiter)

const saturn = new THREE.Group()
const saturnBody = new THREE.Mesh(
  new THREE.SphereGeometry(2.5, 32, 32),
  new THREE.MeshStandardMaterial({color: '#d2b48c'})
)
const saturnRings = new THREE.Mesh(
  new THREE.TorusGeometry(4, 0.5, 32, 32),
  new THREE.MeshStandardMaterial({color: '#d2b48c'})
)
saturnRings.rotation.x = Math.PI * 0.45
saturn.add(saturnBody, saturnRings)
const saturnRadius = 90
saturn.position.set(saturnRadius, 0, 0)
scene.add(saturn)

const uranus = new THREE.Mesh(
  new THREE.SphereGeometry(2, 32, 32),
  new THREE.MeshStandardMaterial({color: '#0000ff'})
)
const uranusRadius = 110
uranus.position.set(0, 0, uranusRadius)
scene.add(uranus)

const neptune = new THREE.Mesh(
  new THREE.SphereGeometry(1.5, 32, 32),
  new THREE.MeshStandardMaterial({color: '#30D5C8'})
)
const neptuneRadius = 130
neptune.position.set(- neptuneRadius, 0, 0)
scene.add(neptune)



//
// STARS
//

const count = 10000;
const positions = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  const i3 = i * 3;
  positions[i3 + 0] = (Math.random() - 0.5) * 400;
  positions[i3 + 1] = (Math.random() - 0.5) * 400;
  positions[i3 + 2] = (Math.random() - 0.5) * 400;
}

const pointsGeometry = new THREE.BufferGeometry();
pointsGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const pointsMaterial = new THREE.PointsMaterial({
  size: 0.3,
  sizeAttenuation: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  transparent: true,
  alphaMap: starTexture,
});
const stars = new THREE.Points(pointsGeometry, pointsMaterial);
scene.add(stars);

gui.add(pointsMaterial, "size", 0.01, 0.2, 0.001).name("starSize");

//
// Paths
//
//ask amelie how to add paths

//
//LIGHTS
//

const createDirectionalLight = (target, castShadow) => {
  const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
  directionalLight.position.set(0, 0, 0);
  directionalLight.target = target;
  directionalLight.castShadow = castShadow;
  scene.add(directionalLight);

  directionalLight.shadow.camera.near = 40; 
  directionalLight.shadow.camera.far = 46; 

  // const helper = new THREE.CameraHelper( directionalLight.shadow.camera );
  // scene.add( helper );
};

createDirectionalLight(earth, true);

const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.intensity = 0.9;
// 0.15
scene.add(ambientLight);

gui.add(ambientLight, "intensity", 0, 1, 0.001).name("ambientIntensity");

/**
 * Animate
 */
const clock = new THREE.Clock();
let lastElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - lastElapsedTime;
  lastElapsedTime = elapsedTime;

  //roate the earth and moon individually
  earth.rotation.y = elapsedTime * 0.7;
  moon.rotation.y = elapsedTime * 0.45;

  //rotate the whole earth group
  earthGroup.position.set(
    Math.cos(elapsedTime * 0.25) * earthRadius,
    0,
    Math.sin(elapsedTime * 0.25) * earthRadius
  );
  // rotate moon around earth
  earthGroup.rotation.y = elapsedTime * 0.45;

  //rotate mercury around sun
  mercury.position.set(
    Math.cos(elapsedTime) * mercuryRadius,
    0,
    Math.sin(elapsedTime) * mercuryRadius
  );
  mercury.rotation.y = elapsedTime * 0.012; //rotate mercury around itself

  //rotate venus around sun
  venus.position.set(
    Math.cos(elapsedTime * 0.5) * venusRadius,
    0,
    Math.sin(elapsedTime * 0.5) * venusRadius
  );
  mercury.rotation.y = elapsedTime * -0.002; //rotate mercury around itself


  mars.position.set(
    Math.cos(elapsedTime * 0.125) * marsRadius,
    0,
    Math.sin(elapsedTime * 0.125) * marsRadius
  )

  jupiter.position.set(
    Math.cos(elapsedTime * 0.0208) * jupiterRadius,
    0,
    Math.sin(elapsedTime * 0.0208) * jupiterRadius
  )

  saturn.position.set(
    Math.cos(elapsedTime * 0.018) * saturnRadius,
    0,
    Math.sin(elapsedTime * 0.018) * saturnRadius
  )

  // uranus.position.set(
  //   Math.cos(elapsedTime * 0.009) * uranusRadius,
  //   0,
  //   Math.sin(elapsedTime * 0.009) * uranusRadius
  // )

  //0.0045

  neptune.position.set(
    Math.cos(elapsedTime * 0.0045) * neptuneRadius ,
    0,
    Math.sin(elapsedTime * 0.0045) * neptuneRadius
  )

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
