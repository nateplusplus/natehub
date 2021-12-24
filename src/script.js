import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as dat from 'lil-gui'
import * as TWEEN from '@tweenjs/tween.js'

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

const toggle = document.querySelector( '.site-nav__toggle' )
toggle.addEventListener( 'click', ( event ) => {
    event.preventDefault()

    const menu = document.querySelector( '.site-nav__list' )

    if ( menu.getBoundingClientRect().left >= 0 ) {
        canvas.setAttribute( 'tabindex', -1 )
        canvas.focus()
    }
} )

// Scene
const scene = new THREE.Scene()

// Various coordinates for scene navigation.
const pointsOfInterest = {
    start: {
        target: new THREE.Vector3( 0, 80, 0 ),
        position: new THREE.Vector3( 550, 200, -700 )
    },
    about : {
        target: new THREE.Vector3( 8, 134, -14 ),
        position: new THREE.Vector3( 6.5, 133, 16 )
    }
}


/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(27, 112, - 43)

scene.add(directionalLight)

const hemisphereLight = new THREE.HemisphereLight( '#ffb184', '#03045e', .5 )
const hemisphereLightHelper = new THREE.HemisphereLightHelper( hemisphereLight )
scene.add(hemisphereLightHelper)
scene.add(hemisphereLight)

let interactiveElements = []

/**
 * Computer screens
 */
const monitorScreen = new THREE.Mesh(
    new THREE.BoxBufferGeometry( 2, 2, 0.01 ),
    new THREE.MeshStandardMaterial(
        {
            emissive: new THREE.Color( '#fff' ),
        }
    )
)
monitorScreen.position.set( 9.89, 135.09, -15.36 )
monitorScreen.rotation.y = -0.1025
monitorScreen.scale.set( 1.54, 0.95, 1 )
monitorScreen.name = 'monitorScreen';

interactiveElements.push( monitorScreen )

scene.add( monitorScreen )

const officeTarget = new THREE.Object3D()
officeTarget.position.set( 3.5, 133, 20 )
scene.add(officeTarget)

const monitorLight = new THREE.SpotLight( '#fff', 0.6, 10, Math.PI * 0.5, 0.2 )
monitorLight.position.set( 9.89, 135.09, -15.367 )
monitorLight.target = officeTarget

scene.add( monitorLight )


/**
 * Mouse
 */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
})
const mouseRaycaster = new THREE.Raycaster()


/**
 * Models
 */
const gltfLoader = new GLTFLoader()
gltfLoader.load(
    'natehub-title.gltf',
    (gltf) =>
    {
        scene.add(gltf.scene)
    }
)

/**
 * Sizes
 */
 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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
 * Jump links
 */
function getHashTarget() {
    let targetPosition
    const hash = window.location.hash
    const pointsOfInterestCopy = Object.assign( {}, pointsOfInterest )

    if ( hash.length > 1 ) {
        const targetKey = hash.replace( '#', '' )
        targetPosition = pointsOfInterestCopy[targetKey].target
    } else {
        targetPosition = pointsOfInterestCopy.start.target
    }

    return targetPosition
}

function getHashPosition() {
    let position
    const hash = window.location.hash

    if ( hash.length > 1 ) {
        const target = hash.replace( '#', '' )
        position = pointsOfInterest[target].position
    } else {
        position = pointsOfInterest.start.position
    }

    return position
}

// let cameraPosition = getHashPosition()
let cameraPosition = new THREE.Vector3(0, 0, 300)


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(10, sizes.width / sizes.height, 0.1, 2000)
camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
scene.add(camera)


// Controls
// let controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

let cameraTarget = getHashTarget();
// controls.target = new THREE.Vector3( cameraTarget.x, cameraTarget.y, cameraTarget.z )

let controls = new FlyControls( camera, canvas )
controls.movementSpeed = 100;
controls.rollSpeed = Math.PI / 24;
controls.autoForward = false;
controls.dragToLook = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// window.addEventListener( 'hashchange', ( event ) => {
//     event.preventDefault()
//     cameraTarget   = getHashTarget()
//     cameraPosition = getHashPosition()

//     controls = new OrbitControls(camera, canvas)
//     controls.enableDamping = true

//     const targetTween = new TWEEN.Tween( new THREE.Vector3( 0, 0, 50 ) ).to( cameraTarget, 1400 )
//     targetTween.easing(TWEEN.Easing.Quadratic.InOut)
//     targetTween.start()

//     const positionTween = new TWEEN.Tween( camera.position ).to( cameraPosition, 1400 )
//     positionTween.easing(TWEEN.Easing.Quadratic.InOut)
//     positionTween.start()
// } )

canvas.addEventListener( 'click', ( event ) => {
    const intersects = mouseRaycaster.intersectObjects( interactiveElements )
    if ( intersects.length > 0 && intersects[0].distance < 80 && intersects[0].object.name !== '' ) {
        if ( intersects[0].object.name === 'monitorScreen' ) {
            console.log( 'Bio' )
            document.querySelector('.modal').focus()
        }
    }
} )

/**
 * Animate
 */
const tick = ( time ) =>
{
    // Update controls
    controls.update( 0.01 )
    console.log( camera.position )

    mouseRaycaster.setFromCamera( mouse, camera )

    // Update tween
    TWEEN.update( time )

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()