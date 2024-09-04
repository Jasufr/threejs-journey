import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import shadingVertexShader from './shaders/shading/vertex.glsl'
import shadingFragmentShader from './shaders/shading/fragment.glsl'

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
const gltfLoader = new GLTFLoader()

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
camera.position.x = 7
camera.position.y = 7
camera.position.z = 7
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
// renderer.toneMapping = THREE.ACESFilmicToneMapping
// renderer.toneMappingExposure = 3
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

/**
 * Material
 */
const materialParameters = {}
materialParameters.color = '#ffffff'
materialParameters.ambientLightIntensity = 0.03
materialParameters.ambientLightColor = '#ffffff'
materialParameters.directionalLightColor = '#1919ff'
materialParameters.directionalLightIntensity = 1
materialParameters.directionalLightPositionX = 0
materialParameters.directionalLightPositionY = 0
materialParameters.directionalLightPositionZ = 3
materialParameters.pointLightColor = '#ff1919'
materialParameters.pointLightIntensity = 1
materialParameters.pointLightPositionX = 0
materialParameters.pointLightPositionY = 2.5
materialParameters.pointLightPositionZ = 0
materialParameters.pointLightDecay = 0.25
materialParameters.pointLightTwoColor = '#00ff7f'
materialParameters.pointLightTwoIntensity = 1
materialParameters.pointLightTwoPositionX = 2
materialParameters.pointLightTwoPositionY = 2
materialParameters.pointLightTwoPositionZ = 2
materialParameters.pointLightTwoDecay = 0.2

const material = new THREE.ShaderMaterial({
  vertexShader: shadingVertexShader,
  fragmentShader: shadingFragmentShader,
  uniforms:
  {
    uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
    uAmbientLightIntensity: new THREE.Uniform(materialParameters.ambientLightIntensity),
    uAmbientLightColor: new THREE.Uniform(new THREE.Color(materialParameters.ambientLightColor)),
    uDirectionalLightColor: new THREE.Uniform(new THREE.Color(materialParameters.directionalLightColor)),
    uDirectionalLightIntensity: new THREE.Uniform(materialParameters.directionalLightIntensity),
    uDirectionalLightPositionX: new THREE.Uniform(materialParameters.directionalLightPositionX),
    uDirectionalLightPositionY: new THREE.Uniform(materialParameters.directionalLightPositionY),
    uDirectionalLightPositionZ: new THREE.Uniform(materialParameters.directionalLightPositionZ),
    uPointLightColor: new THREE.Uniform(new THREE.Color(materialParameters.pointLightColor)),
    uPointLightIntensity: new THREE.Uniform(materialParameters.pointLightIntensity),
    uPointLightPositionX: new THREE.Uniform(materialParameters.pointLightPositionX),
    uPointLightPositionY: new THREE.Uniform(materialParameters.pointLightPositionY),
    uPointLightPositionZ: new THREE.Uniform(materialParameters.pointLightPositionZ),
    uPointLightDecay: new THREE.Uniform(materialParameters.pointLightDecay),
    uPointLightTwoColor: new THREE.Uniform(new THREE.Color(materialParameters.pointLightTwoColor)),
    uPointLightTwoIntensity: new THREE.Uniform(materialParameters.pointLightTwoIntensity),
    uPointLightTwoPositionX: new THREE.Uniform(materialParameters.pointLightTwoPositionX),
    uPointLightTwoPositionY: new THREE.Uniform(materialParameters.pointLightTwoPositionY),
    uPointLightTwoPositionZ: new THREE.Uniform(materialParameters.pointLightTwoPositionZ),
    uPointLightTwoDecay: new THREE.Uniform(materialParameters.pointLightTwoDecay)
  }
})

// Models tweaks
const modelsTweaks = gui.addFolder('models')
modelsTweaks.close()
modelsTweaks
  .addColor(materialParameters, 'color')
  .onChange(() => {
    material.uniforms.uColor.value.set(materialParameters.color)
  })

// Ambient light Tweaks
const ambientLightTweaks = gui.addFolder('ambientLight')
ambientLightTweaks.close()
ambientLightTweaks.add(materialParameters, 'ambientLightIntensity').min(0).max(1).step(0.001).onChange(() => {
  material.uniforms.uAmbientLightIntensity.value = materialParameters.ambientLightIntensity
})
ambientLightTweaks.addColor(materialParameters, 'ambientLightColor').onChange(() => {
  material.uniforms.uAmbientLightColor.value.set(materialParameters.ambientLightColor)
})

// Directional light tweaks
const directionalLightTweaks = gui.addFolder('directionalLight')
directionalLightTweaks.close()
directionalLightTweaks.addColor(materialParameters, 'directionalLightColor').onChange(() => {
  material.uniforms.uDirectionalLightColor.value.set(materialParameters.directionalLightColor)
  directionalLightHelper.material.color.set(materialParameters.directionalLightColor)
})
directionalLightTweaks.add(materialParameters, 'directionalLightIntensity').min(0).max(1).step(0.01).onChange(() => {
  material.uniforms.uDirectionalLightIntensity.value = materialParameters.directionalLightIntensity
})
directionalLightTweaks.add(materialParameters, 'directionalLightPositionX').min(-10).max(10).step(0.1).onChange(() => {
  material.uniforms.uDirectionalLightPositionX.value = materialParameters.directionalLightPositionX
  directionalLightHelper.position.setX(materialParameters.directionalLightPositionX)
})
directionalLightTweaks.add(materialParameters, 'directionalLightPositionY').min(-10).max(10).step(0.1).onChange(() => {
  material.uniforms.uDirectionalLightPositionY.value = materialParameters.directionalLightPositionY
  directionalLightHelper.position.setY(materialParameters.directionalLightPositionY)
})
directionalLightTweaks.add(materialParameters, 'directionalLightPositionZ').min(-10).max(10).step(0.1).onChange(() => {
  material.uniforms.uDirectionalLightPositionZ.value = materialParameters.directionalLightPositionZ
  directionalLightHelper.position.setZ(materialParameters.directionalLightPositionZ)
})

// Point light 1 tweaks
const pointLightOneTweaks = gui.addFolder('pointLight1')
pointLightOneTweaks.close()
pointLightOneTweaks.addColor(materialParameters, 'pointLightColor').onChange(() => {
  material.uniforms.uPointLightColor.value.set(materialParameters.pointLightColor)
  pointLightHelper.material.color.set(materialParameters.pointLightColor)
})
pointLightOneTweaks.add(materialParameters, 'pointLightIntensity').min(0).max(1).step(0.01).onChange(() => {
  material.uniforms.uPointLightIntensity.value = materialParameters.pointLightIntensity
})
pointLightOneTweaks.add(materialParameters, 'pointLightPositionX').min(-10).max(10).step(0.1).onChange(() => {
  material.uniforms.uPointLightPositionX.value = materialParameters.pointLightPositionX
  pointLightHelper.position.setX(materialParameters.pointLightPositionX)
})
pointLightOneTweaks.add(materialParameters, 'pointLightPositionY').min(-10).max(10).step(0.1).onChange(() => {
  material.uniforms.uPointLightPositionY.value = materialParameters.pointLightPositionY
  pointLightHelper.position.setY(materialParameters.pointLightPositionY)
})
pointLightOneTweaks.add(materialParameters, 'pointLightPositionZ').min(-10).max(10).step(0.1).onChange(() => {
  material.uniforms.uPointLightPositionZ.value = materialParameters.pointLightPositionZ
  pointLightHelper.position.setZ(materialParameters.pointLightPositionZ)
})
pointLightOneTweaks.add(materialParameters, 'pointLightDecay').min(0).max(1).step(0.001).onChange(() => {
  material.uniforms.uPointLightDecay.value = materialParameters.pointLightDecay
})

// Point light 2 tweaks
const pointLightTwoTweaks = gui.addFolder('pointLight2')
pointLightTwoTweaks.close()
pointLightTwoTweaks.addColor(materialParameters, 'pointLightTwoColor').onChange(() => {
  material.uniforms.uPointLightTwoColor.value.set(materialParameters.pointLightTwoColor)
  pointLightHelper2.material.color.set(materialParameters.pointLightTwoColor)
})
pointLightTwoTweaks.add(materialParameters, 'pointLightTwoIntensity').min(0).max(1).step(0.01).onChange(() => {
  material.uniforms.uPointLightTwoIntensity.value = materialParameters.pointLightTwoIntensity
})
pointLightTwoTweaks.add(materialParameters, 'pointLightTwoPositionX').min(-10).max(10).step(0.1).onChange(() => {
  material.uniforms.uPointLightTwoPositionX.value = materialParameters.pointLightTwoPositionX
  pointLightHelper2.position.setX(materialParameters.pointLightTwoPositionX)
})
pointLightTwoTweaks.add(materialParameters, 'pointLightTwoPositionY').min(-10).max(10).step(0.1).onChange(() => {
  material.uniforms.uPointLightTwoPositionY.value = materialParameters.pointLightTwoPositionY
  pointLightHelper2.position.setY(materialParameters.pointLightTwoPositionY)
})
pointLightTwoTweaks.add(materialParameters, 'pointLightTwoPositionZ').min(-10).max(10).step(0.1).onChange(() => {
  material.uniforms.uPointLightTwoPositionZ.value = materialParameters.pointLightTwoPositionZ
  pointLightHelper2.position.setZ(materialParameters.pointLightTwoPositionZ)
})
pointLightTwoTweaks.add(materialParameters, 'pointLightTwoDecay').min(0).max(1).step(0.001).onChange(() => {
  material.uniforms.uPointLightTwoDecay.value = materialParameters.pointLightTwoDecay
})


/**
 * Objects
 */
// Torus knot
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
  material
)
torusKnot.position.x = 3
scene.add(torusKnot)

// Sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(),
  material
)
sphere.position.x = - 3
scene.add(sphere)

// Suzanne
let suzanne = null
gltfLoader.load(
  './suzanne.glb',
  (gltf) => {
    suzanne = gltf.scene
    suzanne.traverse((child) => {
      if (child.isMesh)
        child.material = material
    })
    scene.add(suzanne)
  }
)

/**
 * Lights helpers
 */
// Directional light helper
const directionalLightHelper = new THREE.Mesh(
  new THREE.PlaneGeometry(),
  new THREE.MeshBasicMaterial()
)
// directionalLightHelper.material.color.setRGB(0.1, 0.1, 1)
directionalLightHelper.material.color.set(materialParameters.directionalLightColor)
directionalLightHelper.material.side = THREE.DoubleSide
directionalLightHelper.position.set(
  materialParameters.directionalLightPositionX,
  materialParameters.directionalLightPositionY,
  materialParameters.directionalLightPositionZ
)
scene.add(directionalLightHelper)

// Point light helper
const pointLightHelper = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.1, 2),
  new THREE.MeshBasicMaterial()
)
pointLightHelper.material.color.set(materialParameters.pointLightColor)
pointLightHelper.position.set(0, 2.5, 0)
scene.add(pointLightHelper)

// Point light helper 2
const pointLightHelper2 = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.1, 2),
  new THREE.MeshBasicMaterial()
)
pointLightHelper2.material.color.set(materialParameters.pointLightTwoColor)
pointLightHelper2.position.set(2, 2, 2)
scene.add(pointLightHelper2)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Rotate objects
  if (suzanne) {
    suzanne.rotation.x = - elapsedTime * 0.1
    suzanne.rotation.y = elapsedTime * 0.2
  }

  sphere.rotation.x = - elapsedTime * 0.1
  sphere.rotation.y = elapsedTime * 0.2

  torusKnot.rotation.x = - elapsedTime * 0.1
  torusKnot.rotation.y = elapsedTime * 0.2

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
