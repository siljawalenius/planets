import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import starFragmentShader from "./shader/fragment.glsl";
import starVertexShader from "./shader/vertex.glsl";

const gui = new GUI();

const params = {
  lightRingColor: 0x787878,
  darkRingColor: 0x2e2e2e,
  simulationSpeed: 1,
};

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

//camera.position.y = 400

scene.add(camera);

gui.add(camera.position, "x", -25, 25, 0.001).name("cameraX");
gui.add(camera.position, "y", -25, 25, 0.001).name("cameraY");
gui.add(camera.position, "z", -25, 25, 0.001).name("cameraZ");

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 300;

//
//Axes Helper
//
const axesHelper = new THREE.AxesHelper(50);
scene.add(axesHelper);

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
const saturnTexture = textureLoader.load("/saturn.jpg");
const jupiterTexture = textureLoader.load("/jupiter.jpg");
const neptuneTexture = textureLoader.load("/neptune.jpg");

const planetGeometry = new THREE.SphereGeometry(1, 32, 32); //base geometry for all planets

const createPlanet = (
  scale,
  positionX,
  positionZ,
  texture,
  color,
  displacementMap
) => {
  const material = new THREE.MeshStandardMaterial();

  texture
    ? (material.map = texture)
    : (material.color = new THREE.Color(color));

  if (displacementMap) {
    material.displacementMap = displacementMap;
    material.displacementScale = 0.01;
  }

  material.minFilter = THREE.NearestFilter;
  material.magFilter = THREE.NearestFilter;

  let planet = new THREE.Mesh(planetGeometry, material);

  planet.scale.set(scale, scale, scale);
  planet.position.set(positionX, 0, positionZ);

  return planet;
};

//Planet distances
const earthRadius = 43;
const venusRadius = 28;
const mercuryRadius = 18;
const marsRadius = 55;
const uranusRadius = 113;
const neptuneRadius = 133;
const jupiterRadius = 73;
const moonRadius = 5;
const saturnRadius = 93;

const sun = createPlanet(7, 0, 0, sunTexture);
const venus = createPlanet(0.5, venusRadius, 0, venusTexture);
const mercury = createPlanet(
  0.3,
  mercuryRadius,
  0,
  mercuryTexture,
  null,
  mercuryBumpTexture
); //need to figure out adding displacement maps
const mars = createPlanet(0.8, marsRadius, 0, marsTexture);
const uranus = createPlanet(2, 0, uranusRadius, null, 0x0000ff);
const neptune = createPlanet(1.5, neptuneRadius, 0, neptuneTexture);
const jupiter = createPlanet(
  3,
  (jupiterRadius * Math.sqrt(2)) / 2,
  (jupiterRadius * Math.sqrt(2)) / 2,
  jupiterTexture,
  0xd2b48c
);
const earth = createPlanet(1, 0, 0, earthTexture);
const moon = createPlanet(
  0.3,
  moonRadius,
  0,
  moonColorTexture,
  null,
  moonDisplacementTexture
);
const saturnBody = createPlanet(2.5, 0, 0, saturnTexture);

scene.add(sun, venus, mercury, mars);

const uranusGroup = new THREE.Group();
uranusGroup.add(uranus); //use a group to make rotation easier
scene.add(uranusGroup);

const neptuneGroup = new THREE.Group();
neptuneGroup.add(neptune);
scene.add(neptuneGroup);

const jupiterGroup = new THREE.Group();
jupiterGroup.add(jupiter);
scene.add(jupiterGroup);

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

const planets = [
  sun,
  mercury,
  venus,
  earth,
  moon,
  mars,
  jupiter,
  saturnBody,
  neptune,
  uranus,
];

//
// STARS
//

const count = 10000;
const positions = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  const i3 = i * 3;
  positions[i3 + 0] = (Math.random() - 0.5) * 600;
  positions[i3 + 1] = (Math.random() - 0.5) * 600;
  positions[i3 + 2] = (Math.random() - 0.5) * 600;
}

const pointsGeometry = new THREE.BufferGeometry();
pointsGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const starMaterial = new THREE.ShaderMaterial({
  vertexShader: starVertexShader,
  fragmentShader: starFragmentShader,
  uniforms: {
    uTime: { value: 1.0 },
    uParticleMap: { value: starTexture },
  },
  sizeAttenuation: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  transparent: true
});


console.log(starMaterial)

const stars = new THREE.Points(pointsGeometry, starMaterial);
scene.add(stars);

//gui.add(pointsMaterial, "size", 0.01, 0.2, 0.001).name("starSize");

//create array of random vals for the shader - move this to position loop
const randomNums = new Float32Array(count);
for (let i = 0; i < count; i++) {
  randomNums[i] = Math.random();
} //working

pointsGeometry.setAttribute("aPhase", new THREE.BufferAttribute(randomNums, 1));

//
// Paths
//

const generatePath = (planetRadius, isLight) => {
  const curve = new THREE.EllipseCurve(
    0,
    0, //centre x, y
    planetRadius,
    planetRadius //radius x and y
  );
  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineDashedMaterial({
    color: isLight ? params.lightRingColor : params.darkRingColor,
    linewidth: 3,
    scale: 1,
    dashSize: 0.25,
    gapSize: 0.25,
  });

  const ellipse = new THREE.Line(geometry, material);

  ellipse.computeLineDistances(); //comput distances to all for dashes
  ellipse.rotation.x = Math.PI * 0.5; //rotate 90 deg, add to scene

  scene.add(ellipse);
};

generatePath(earthRadius, true);
generatePath(marsRadius);
generatePath(venusRadius);
generatePath(mercuryRadius);
generatePath(jupiterRadius);
generatePath(uranusRadius);
generatePath(saturnRadius);
generatePath(neptuneRadius);

gui.addColor(params, "lightRingColor");

//make planets clickable

const raycaster = new THREE.Raycaster(); //create raycaster

const cursor = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  cursor.x = (event.clientX / sizes.width) * 2 - 1;
  cursor.y = -((event.clientY / sizes.height) * 2) + 1;
});
//working

let prevIntersect = false;

window.addEventListener("click", () => {
  //listen for clicks on objects
  if (prevIntersect) {
    switch (prevIntersect.object) {
      case earth:
        console.log("earth");
        break;
      case mars:
        console.log("mars");
        break;
      case venus:
        console.log("venus");
        break;
      case mercury:
        console.log("mercury");
        break;
      case sun:
        console.log("sun");
        break;
      case saturnBody:
        console.log("saturn");
        break;
      case uranus:
        console.log("uranus");
        break;
      case neptune:
        console.log("neptune");
        break;
      case jupiter:
        console.log("jupiter");
        break;
    }
  }
});

//
//LIGHTS
//

const createDirectionalLight = (target, castShadow) => {
  const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
  directionalLight.position.set(0, 0, 0);
  directionalLight.target = target;
  directionalLight.castShadow = castShadow;
  scene.add(directionalLight);

  directionalLight.shadow.camera.near = 42;
  directionalLight.shadow.camera.far = 48;

  //const helper = new THREE.CameraHelper( directionalLight.shadow.camera );
  //scene.add( helper );
};

createDirectionalLight(earth, true);

const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.intensity = 0.7;
// 0.15
scene.add(ambientLight);

gui.add(ambientLight, "intensity", 0, 1, 0.001).name("ambientIntensity");

/**
 * Animate
 */
const clock = new THREE.Clock();
let lastElapsedTime = 0;

const orbitSun = (planet, speed, radius, time) => {
  //orbit planet function
  planet.position.set(
    //rotate mercury around sun
    -Math.cos(time * speed) * radius,
    0,
    Math.sin(time * speed) * radius
  );
};

gui.add(params, "simulationSpeed", 0, 2, 0.001).name("simulationSpeed");

const tick = () => {
  const elapsedTime = clock.getElapsedTime() * params.simulationSpeed * 0.5;
  // const deltaTime = elapsedTime - lastElapsedTime;
  lastElapsedTime = elapsedTime;

  //rotate the earth and moon individually
  // earth.rotation.y = elapsedTime * 0.7;
  // moon.rotation.y = elapsedTime * 0.45;

  // orbitSun(earthGroup, 0.25, earthRadius, elapsedTime)
  // earthGroup.rotation.y = elapsedTime * 1.72; // rotate moon around earth - real time is 3.22

  // orbitSun(mercury, 1, mercuryRadius, elapsedTime)
  // mercury.rotation.y = elapsedTime * 0.012; //rotate mercury around itself

  // orbitSun(venus, 0.5, venusRadius, elapsedTime)
  // venus.rotation.y = elapsedTime * -0.002; //rotate mercury around itself

  // orbitSun(mars, 0.125, marsRadius, elapsedTime)

  // orbitSun(saturn, 0.018, saturnRadius, elapsedTime)
  // jupiterGroup.rotation.y = elapsedTime * 0.0208
  // neptuneGroup.rotation.y = elapsedTime * 0.045
  // uranusGroup.rotation.y = elapsedTime * 0.05

  //raycaster things
  raycaster.setFromCamera(cursor, camera);

  const intersects = raycaster.intersectObjects(planets);

  if (intersects.length && prevIntersect !== true) {
    //on mouse enter an object
    prevIntersect = intersects[0]; //update prevIntersect
  } else if (!intersects.length && prevIntersect) {
    //on mouse leave an object
    prevIntersect = false;
  }

  //UPDATE STAR MATERIAL TIME
  starMaterial.uniforms.uTime.value = elapsedTime;
  // console.log(Math.sin(starMaterial.uniforms.uTime.value)* 0.5 + 0.5)

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
