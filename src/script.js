import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'


const gui = new GUI() 

//loader
const textureLoader = new THREE.TextureLoader()


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 2.419
camera.position.y = 1.804
camera.position.z = 1.927
scene.add(camera)


gui.add(camera.position, 'x', -5, 5, 0.001).name('cameraX')
gui.add(camera.position, 'y', -5, 5, 0.001).name("cameraY")
gui.add(camera.position, 'z', -5, 5, 0.001).name("cameraZ")

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Cube
 */

 const moonColorTexture = textureLoader.load('/moon.jpeg')
 const moonDisplacementTexture = textureLoader.load('/moonDisplacementTexture.jpeg')
 const starTexture = textureLoader.load('/starTexture.png')

const material = new THREE.MeshStandardMaterial()
material.map = moonColorTexture
material.displacementMap = moonDisplacementTexture
material.displacementScale = 0.01
 material.minFilter = THREE.NearestFilter
 material.magFilter = THREE.NearestFilter

const moon = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    material
)
scene.add(moon)

const sun = new THREE.Mesh(
    new THREE.SphereGeometry(2, 32, 32),
    new THREE.MeshBasicMaterial(0xffffff)
)
sun.position.set(5, 5, -1.8)
//scene.add(sun)

// points
const count = 10000
const positions = new Float32Array(count * 3)

for (let i = 0; i < count; i++){
    const i3 = i*3
    positions[i3 + 0] = (Math.random()-0.5) * 40
    positions[i3 + 1] = (Math.random()-0.5) * 40
    positions[i3 + 2] = (Math.random()-0.5) * 40
}

const pointsGeometry = new THREE.BufferGeometry()
pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const pointsMaterial = new THREE.PointsMaterial({
    size: 0.08,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    transparent: true,
    alphaMap: starTexture
})

gui.add(pointsMaterial, 'size', 0.01, 0.2, 0.001).name('starSize')

const points = new THREE.Points(pointsGeometry, pointsMaterial)
scene.add(points)


const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(5, 5, -1.8)
scene.add(directionalLight)

const ambientLight = new THREE.AmbientLight(0xffffff)
//scene.add(ambientLight)

gui.add(directionalLight.position, 'x', -10, 10, 0.001)
gui.add(directionalLight.position, 'y', -10, 10, 0.001)
gui.add(directionalLight.position, 'z', -10, 10, 0.001)


/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    moon.rotation.y = elapsedTime * 0.1 

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()