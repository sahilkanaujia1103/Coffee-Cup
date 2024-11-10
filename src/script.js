import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import "./style.css"
import coffeeSmokeVertexShader from "./shaders/CoffeeCup/Vertex.glsl"
import coffeeSmokeFragmentShader from "./shaders/CoffeeCup/Fragment.glsl"
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
const gltfLoader = new GLTFLoader()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  });
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
const camera = new THREE.PerspectiveCamera(30, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 8
camera.position.y = 10
camera.position.z = 12
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.y = 3
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Model
 */
gltfLoader.load(
    './bakedModel.glb',
    (gltf) =>
    {
        gltf.scene.getObjectByName('baked').material.map.anisotropy = 8
        scene.add(gltf.scene)
    }
)
//smoke geometry
 const smokeGeometry=new THREE.PlaneGeometry(1,1,16,64)
 smokeGeometry.translate(0,0.8,0)
 smokeGeometry.scale(1.5,6,1.5)
 // perlin texture
 const perlinTexture=textureLoader.load("./perlin.png")
 perlinTexture.wrapS=THREE.RepeatWrapping
 perlinTexture.wrapT=THREE.RepeatWrapping
 const smokeMaterial=new THREE.ShaderMaterial({
    vertexShader:coffeeSmokeVertexShader,
    fragmentShader:coffeeSmokeFragmentShader,
    uniforms:{
        uTime:new THREE.Uniform(0),
        uPerlinTexture:new THREE.Uniform(perlinTexture)
    },
    side:THREE.DoubleSide,
    // wireframe:true,
    transparent:true,
    depthWrite:false,
 })
 const smoke=new THREE.Mesh(smokeGeometry,smokeMaterial)
 scene.add(smoke)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()
    smokeMaterial.uniforms.uTime.value=elapsedTime;

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()