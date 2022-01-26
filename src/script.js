import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

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
const axesHelper = new THREE.AxesHelper( 50 );
//scene.add( axesHelper );


/**
 * PLANETS
 */

const moonColorTexture = textureLoader.load("/moonGrain.jpg");
const moonDisplacementTexture = textureLoader.load(
  "/moonDisplacementTexture.jpeg"
);
const starTexture = textureLoader.load("/starTexture.png");
const sunTexture = textureLoader.load("/sun.jpg");

const moonMaterial = new THREE.MeshStandardMaterial();
moonMaterial.map = moonColorTexture;
moonMaterial.displacementMap = moonDisplacementTexture;
moonMaterial.displacementScale = 0.01;
moonMaterial.minFilter = THREE.NearestFilter;
moonMaterial.magFilter = THREE.NearestFilter;

const moon = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), moonMaterial);
const moonRadius = 20
moon.position.set(moonRadius, 0, 0)
scene.add(moon);

const sunMaterial = new THREE.MeshBasicMaterial(0xffffff)
sunMaterial.map = sunTexture

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(4, 32, 32),
  sunMaterial
);
sun.position.set(0, 0, 0);
scene.add(sun)
//size size of radius 4 maybe? or 5
//other planets will ofc be smaller, but not to physical proportions (keep UX good)

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
  size: 0.08,
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
//LIGHTS
// 

const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
//directionalLight.position.set(5, 5, -1.8);
directionalLight.position.set(0, 0, 0);
directionalLight.target = moon

const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
//scene.add( helper );
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.intensity = 0.15;
scene.add(ambientLight);

gui.add(ambientLight, "intensity", 0, 1, 0.001).name("ambientIntensity");
gui.add(directionalLight.position, "x", -10, 10, 0.001);
gui.add(directionalLight.position, "y", -10, 10, 0.001);
gui.add(directionalLight.position, "z", -10, 10, 0.001);


/**
 * Renderer
 */
 const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  


/**
 * Animate
 */
const clock = new THREE.Clock();
let lastElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - lastElapsedTime;
  lastElapsedTime = elapsedTime;

  moon.rotation.y = elapsedTime * 0.1;

  moon.position.set(
    Math.cos(elapsedTime * 0.25) * moonRadius,
    0,
    Math.sin(elapsedTime * 0.25) * moonRadius
  )


  console.log(moon.position.z)

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
