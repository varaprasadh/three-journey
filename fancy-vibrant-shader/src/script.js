import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


import model from "./models/male_base/scene-processed.glb";


import vertexShader from "./shaders/water/vertex.glsl";
import fragmentShader from "./shaders/water/fragment.glsl";

/**
 * Base
 */
// Debug
// const gui = new dat.GUI({ width: 340 })

const debugObject = {};

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()



// texture 
const textureLoader = new THREE.TextureLoader();

// models 

const modelMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
        uBodyTexture: { value: textureLoader.load("/wavy.png") },
        uTime : { value: 0.0  }
    }
});

const modelLoader = new GLTFLoader();

const _model= new THREE.Group();
modelLoader.load(model, gltf => {
    console.log(gltf);

    gltf.scene.traverse(o => {
        if(o.isMesh){
            o.geometry.center()
            o.material = modelMaterial;
            o.scale.set(0.1,0.1,0.1);
            // o.position.set(1,-2,1);
            o.rotation.set(-0.02,0,0);
            _model.add(o)
        }
    });
    scene.add(_model);
});




/**
 * Water
 */
// Geometry
const geometry = new THREE.PlaneBufferGeometry(2, 2, 128, 128)

// color for debug


// Material
const material = new THREE.MeshBasicMaterial({color:"orange"});





// Mesh
const plane = new THREE.Mesh(geometry, material);
// scene.add(plane)


// axis helper;

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);


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

document.addEventListener('scroll', e => {
    _model.rotation.set(0, window.scrollY * 0.01, 0);
    // _model.position.set(0, Math.cos(window.scrollY) * 0.1,0);

});

document.addEventListener('mousemove', e => {
    const { clientX, clientY } = e;
    const _x = (clientX/sizes.width) - 0.5;
    const _y = (clientY/sizes.height) - 0.5 ;
    _model.rotation.x += _y * 0.01;
    _model.rotation.y += _x * 0.01;
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 4, 6)
scene.add(camera)


// lights 

const ambientLight = new THREE.AmbientLight("#ffffff", 0.8);
scene.add(ambientLight);

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

    modelMaterial.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()