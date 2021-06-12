import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

import vertexShader from "./shaders/water/vertex.glsl";
import fragmentShader from "./shaders/water/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })

const debugObject = {};

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneBufferGeometry(2, 2, 128, 128)

// color for debug
debugObject.depthColor = "#186691";
debugObject.surfaceColor = "#9bd8ff";

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide,
    uniforms : {
        uTime : { value: 0.0 },
        uFrequency: { value: new THREE.Vector2(2.0, 2.0)},
        uSmallWavesFrequency: { value: new THREE.Vector2(2.0, 2.0)},
        uWaveSpeed : { value: 2.0 },
        uWaveElevation: { value: 0.2 },
        uDepthColor : { value:  new THREE.Color(debugObject.depthColor) },
        uSurfaceColor : { value:  new THREE.Color(debugObject.surfaceColor) },
        uColorMultiplier: { value: 3.0 },
        uColorOffset: { value: 0.25 },
        uSmallIterations : {  value: 3.0 },
        uSmallWavesSpeed: { value: 1.0 },
        uSmallWavesElevation: { value: 0.1 }
    }
});




gui.add(waterMaterial.uniforms.uFrequency.value, 'x').min(1).max(10).step(0.1).name("uFrequencyX");
gui.add(waterMaterial.uniforms.uFrequency.value, 'y').min(1).max(10).step(0.1).name("uFrequencyY");
gui.add(waterMaterial.uniforms.uWaveSpeed, 'value').min(1).max(10).step(0.1).name("uWaveSpeed");
gui.add(waterMaterial.uniforms.uWaveElevation, 'value').min(0.1).max(1).step(0.001).name("uWaveElevation");
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(1).max(10).step(0.1).name("uColorMultiplier");
gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0.1).max(1).step(0.001).name("uColorOffset");

gui.addColor(debugObject, 'depthColor').name("depth Color")
    .onChange(()=> { waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor) });
gui.addColor(debugObject, 'surfaceColor').name("surface Color")
    .onChange(() => { waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) });

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)


// axis helper;

const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);
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
camera.position.set(1, 1, 1)
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

    waterMaterial.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()