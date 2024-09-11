import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import earthVertexShader from './shaders/earth/vertex.glsl'
import earthFragmentShader from './shaders/earth/fragment.glsl'
import atmosphereVertexShader from './shaders/atmosphere/vertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphere/fragment.glsl'
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js'
import starsVertexShader from './shaders/stars/vertex.glsl'
import starsFragmentShader from './shaders/stars/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const textureLoader = new THREE.TextureLoader()

/**
 * Earth
 */
const earthParameters = {}
earthParameters.atmosphereDayColor = '#00aaff'
earthParameters.atmosphereTwilightColor = '#ff6600'

gui.addColor(earthParameters, 'atmosphereDayColor').onChange(() => {
  earthMaterial.uniforms.uAtmosphereDayColor.value.set(earthParameters.atmosphereDayColor),
    atmosphereMaterial.uniforms.uAtmosphereDayColor.value.set(earthParameters.atmosphereDayColor)

})
gui.addColor(earthParameters, 'atmosphereTwilightColor').onChange(() => {
  earthMaterial.uniforms.uAtmosphereTwilightColor.value.set(earthParameters.atmosphereTwilightColor),
    atmosphereMaterial.uniforms.uAtmosphereTwilightColor.value.set(earthParameters.atmosphereTwilightColor)
})

// Textures
const earthDayTexture = textureLoader.load('./earth/day.jpg')
earthDayTexture.colorSpace = THREE.SRGBColorSpace
earthDayTexture.anisotropy = 8

const earthNightTexture = textureLoader.load('./earth/night.jpg')
earthNightTexture.colorSpace = THREE.SRGBColorSpace
earthNightTexture.anisotropy = 8

const earthSpecularCloudsTexture = textureLoader.load('./earth/specularClouds.jpg')
earthSpecularCloudsTexture.anisotropy = 8
earthSpecularCloudsTexture.wrapS = THREE.RepeatWrapping
earthSpecularCloudsTexture.wrapT = THREE.RepeatWrapping

// Mesh
const earthGeometry = new THREE.SphereGeometry(2, 64, 64)
const earthMaterial = new THREE.ShaderMaterial({
  vertexShader: earthVertexShader,
  fragmentShader: earthFragmentShader,
  uniforms:
  {
    uTime: new THREE.Uniform(0),
    uDayTexture: new THREE.Uniform(earthDayTexture),
    uNightTexture: new THREE.Uniform(earthNightTexture),
    uSpecularCloudsTexture: new THREE.Uniform(earthSpecularCloudsTexture),
    uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
    uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereDayColor)),
    uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereTwilightColor)),
    uCloudStrenghtVariationSpeed: new THREE.Uniform(0.3),
    uCloudSpeed: new THREE.Uniform(0.003)
  }
})
const earth = new THREE.Mesh(earthGeometry, earthMaterial)
scene.add(earth)

gui.add(earthMaterial.uniforms.uCloudStrenghtVariationSpeed, 'value').min(0.1).max(3).step(0.01).name('cloudStrenghtVariationSpeed')
gui.add(earthMaterial.uniforms.uCloudSpeed, 'value').min(0.001).max(0.5).step(0.001).name('cloudSpeed')

// Atmosphere
const atmosphereMaterial = new THREE.ShaderMaterial({
  vertexShader: atmosphereVertexShader,
  fragmentShader: atmosphereFragmentShader,
  uniforms:
  {
    uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
    uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereDayColor)),
    uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereTwilightColor))
  },
  side: THREE.BackSide,
  transparent: true,
})
const atmosphere = new THREE.Mesh(earthGeometry, atmosphereMaterial)
atmosphere.scale.set(1.04, 1.04, 1.04)
scene.add(atmosphere)

/**
 * Sun
 */
const sunSpherical = new THREE.Spherical(1, Math.PI * 0.5, 0.5)
const sunDirection = new THREE.Vector3()

// Debug
const debugSun = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0, 2),
  new THREE.MeshBasicMaterial()
)
scene.add(debugSun)

/**
 * Lensflare
*/
const textureFlare0 = textureLoader.load("lenses/lensflare0.png")
const textureFlare1 = textureLoader.load("lenses/lensflare1.png")

const lensflare = new Lensflare()
lensflare.addElement(new LensflareElement(textureFlare0, 362, 0))
lensflare.addElement(new LensflareElement(textureFlare1, 52, 0.075))
lensflare.addElement(new LensflareElement(textureFlare1, 38, 0.125))

debugSun.add(lensflare)

// Update
const updateSun = () => {
  // Sun direction
  sunDirection.setFromSpherical(sunSpherical)

  // Debug
  debugSun.position
    .copy(sunDirection)
    .multiplyScalar(5)

  // Uniform
  earthMaterial.uniforms.uSunDirection.value.copy(sunDirection)
  atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection)
}
updateSun()

// Tweaks
gui.add(sunSpherical, 'phi').min(0).max(Math.PI).onChange(updateSun)
gui.add(sunSpherical, 'theta').min(- Math.PI).max(Math.PI).onChange(updateSun)

/**
 * Stars
 */
const starsParameters = {}
starsParameters.count = 100000
starsParameters.size = 50
starsParameters.starColor = '#ffffff'


let geometry = null
let material = null
let points = null

const generateStars = () => {
  if (points !== null) {
    geometry.dispose()
    material.dispose()
    scene.remove(points)
  }

  // Geometry
  geometry = new THREE.BufferGeometry()

  const positions = new Float32Array(starsParameters.count * 3)
  const minDistance = 3.5;
  for (let i = 0; i < starsParameters.count; i++) {
    const i3 = i * 3

    let x = Math.random() - 0.5;
    let y = Math.random() - 0.5;
    let z = Math.random() - 0.5;
    const length = Math.sqrt(x * x + y * y + z * z);

    x /= length;
    y /= length;
    z /= length;

    const distance = minDistance + Math.random() * 50;
    x *= distance;
    y *= distance;
    z *= distance;

    positions[i3 + 0] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    // positions[i3 + 0] = ((Math.random() - 0.5) * 50)
    // positions[i3 + 1] = ((Math.random() - 0.5) * 50)
    // positions[i3 + 2] = ((Math.random() - 0.5) * 50)
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  // Material
  material = new THREE.ShaderMaterial({
    vertexShader: starsVertexShader,
    fragmentShader: starsFragmentShader,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    uniforms: {
      uSize: new THREE.Uniform(starsParameters.size),
      uStarsColor: new THREE.Uniform(new THREE.Color(starsParameters.starColor))
    }
  })

  // Points
  points = new THREE.Points(geometry, material)
  scene.add(points)
}
gui.add(starsParameters, 'size').min(10).max(200).step(1).onFinishChange(generateStars)
gui.add(starsParameters, 'count').min(100).max(500000).step(100).onFinishChange(generateStars)
gui.addColor(starsParameters, 'starColor').onFinishChange(generateStars)

generateStars()

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(sizes.pixelRatio)
})


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 12
camera.position.y = 5
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)
renderer.setClearColor('#000011')

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  earth.rotation.y = elapsedTime * 0.1

  // Update uTime
  earthMaterial.uniforms.uTime.value = elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
