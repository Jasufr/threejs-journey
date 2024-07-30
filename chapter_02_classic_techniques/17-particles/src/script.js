import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png')

/**
 * Particles
 */
//Geometry
const particlesGeometry = new THREE.BufferGeometry(1, 32, 32)
const count = 20000

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for(let i = 0; i < count * 3; i ++) {
  positions[i] = (Math.random() - 0.5) * 10
  colors[i] = Math.random()
}

particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
)

particlesGeometry.setAttribute(
  'color',
  new THREE.BufferAttribute(colors, 3)
)

//Material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  color: '#ff88cc',
  alphaMap: particleTexture,
  transparent: true,
  // //First way of correcting (good but not perfect, can still see the border a bit)
  // alphaTest: 0.001,
  // //Second way (good but might create bugs if we have other objects with different colors, we can see particles behind the objects)
  // depthTest: false,
  // //Third way (good solution, but might have bugs sometimes)
  depthWrite: false,
  // //Fourth way: blending (different result from the others (if a lot of particles: color will be added to what already exist -> brighter effect), perfomances impact)
  blending: THREE.AdditiveBlending,
  //vertexColors impacted by the color above
  vertexColors: true

})
// //Or can do it like this too
// particlesMaterial.size = 0.1
// particlesMaterial.sizeAttenuation = true
// particlesMaterial.color = new THREE.color('#ff88cc')
// particlesMaterial.map = particleTexture

//Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

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
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update particles
    // particles.rotation.y = elapsedTime * 0.2

    for(let i = 0; i < count; i ++) {
      const i3 = i * 3
      const x = particlesGeometry.attributes.position.array[i3 + 0]
      particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    }

    particlesGeometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
