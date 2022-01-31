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
const marsTexture = textureLoader.load("/mars.jpg");
const saturnTexture = textureLoader.load("/saturn.jpg")
const jupiterTexture = textureLoader.load("/jupiter.jpg")
const neptuneTexture = textureLoader.load("/neptune.jpg")

const planetGeometry = new THREE.SphereGeometry(1, 32, 32); //base geometry for all planets


const createPlanet = (scale, positionX, positionZ, texture, color, displacementMap) => {
  const material = new THREE.MeshStandardMaterial();

  texture
    ? (material.map = texture)
    : (material.color = new THREE.Color(color));


  if(displacementMap){
    material.displacementMap = displacementMap
    material.displacementScale = 0.01
  } 


  material.minFilter = THREE.NearestFilter;
  material.magFilter = THREE.NearestFilter;

  let planet = new THREE.Mesh(planetGeometry, material);

  planet.scale.set(scale, scale, scale);
  planet.position.set(positionX, 0, positionZ);

  return planet;
};

//Planet distances
const earthRadius = 40;
const venusRadius = 25;
const mercuryRadius = 15;
const marsRadius = 52;
const uranusRadius = 110;
const neptuneRadius = 130;
const jupiterRadius = 70;
const moonRadius = 5;
const saturnRadius = 90;

const sun = createPlanet(4, 0, 0, sunTexture);
const venus = createPlanet(0.5, venusRadius, 0, venusTexture);
const mercury = createPlanet(0.3, mercuryRadius, 0, mercuryTexture, null, mercuryBumpTexture); //need to figure out adding displacement maps
const mars = createPlanet(0.8, marsRadius, 0, marsTexture);
const uranus = createPlanet(2, 0, uranusRadius, null, 0x0000ff);
const neptune = createPlanet(1.5, neptuneRadius, 0, neptuneTexture);
const jupiter = createPlanet(3, jupiterRadius, 0, jupiterTexture, 0xd2b48c);
const earth = createPlanet(1, 0, 0, earthTexture);
const moon = createPlanet(0.3, moonRadius, 0, moonColorTexture, null, moonDisplacementTexture);
const saturnBody = createPlanet(2.5, 0, 0, saturnTexture);

scene.add(sun);
scene.add(venus);
scene.add(mercury);
scene.add(mars);
scene.add(uranus);
scene.add(neptune);
scene.add(jupiter);

//earth and moon
const earthGroup = new THREE.Group(); //group to store earth and moon
earthGroup.position.set(earthRadius, 0, 0);
earth.castShadow = true;
moon.receiveShadow = true;
earthGroup.add(earth);
earthGroup.add(moon);
scene.add(earthGroup);

//saturn
const saturn = new THREE.Group();

const saturnRings = new THREE.Mesh(
  //new THREE.TorusGeometry(4, 0.5, 32, 32),
  new THREE.RingGeometry(2.7, 5.0, 32),
  new THREE.MeshStandardMaterial({ color: "#DE9E36", side: THREE.DoubleSide })
);
saturnRings.rotation.x = Math.PI * 0.45;
saturn.add(saturnBody, saturnRings);
saturn.position.set(saturnRadius, 0, 0);
scene.add(saturn);

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

  //rotate the earth and moon individually
  earth.rotation.y = elapsedTime * 0.7;
  moon.rotation.y = elapsedTime * 0.45;

  earthGroup.position.set(
    //rotate the whole earth group around sun
    Math.cos(elapsedTime * 0.25) * earthRadius,
    0,
    Math.sin(elapsedTime * 0.25) * earthRadius
  );
  earthGroup.rotation.y = elapsedTime * 0.45; // rotate moon around earth

  mercury.position.set(
    //rotate mercury around sun
    Math.cos(elapsedTime) * mercuryRadius,
    0,
    Math.sin(elapsedTime) * mercuryRadius
  );
  mercury.rotation.y = elapsedTime * 0.012; //rotate mercury around itself

  venus.position.set(
    // rotate venus around sun
    Math.cos(elapsedTime * 0.5) * venusRadius,
    0,
    Math.sin(elapsedTime * 0.5) * venusRadius
  );
  venus.rotation.y = elapsedTime * -0.002; //rotate mercury around itself

  mars.position.set(
    Math.cos(elapsedTime * 0.125) * marsRadius,
    0,
    Math.sin(elapsedTime * 0.125) * marsRadius
  );

  jupiter.position.set(
    Math.cos(elapsedTime * 0.0208) * jupiterRadius,
    0,
    Math.sin(elapsedTime * 0.0208) * jupiterRadius
  );

  saturn.position.set(
    Math.cos(elapsedTime * 0.018) * saturnRadius,
    0,
    Math.sin(elapsedTime * 0.018) * saturnRadius
  );

  neptune.position.set(
    Math.cos(elapsedTime * 0.0045) * neptuneRadius,
    0,
    Math.sin(elapsedTime * 0.0045) * neptuneRadius
  );

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
