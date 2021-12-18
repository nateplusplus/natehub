import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as dat from 'lil-gui'
import * as TWEEN from '@tweenjs/tween.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

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
 * Focal Point for camera
 */
// const focalPoint = new THREE.Mesh(
//     new THREE.SphereBufferGeometry( 2, 20, 20 ),
//     new THREE.MeshBasicMaterial( {
//         color: 0xff0000,
//     } )
// )

// focalPoint.position.x =  pointsOfInterest.about.x
// focalPoint.position.y =  pointsOfInterest.about.y
// focalPoint.position.z =  pointsOfInterest.about.z

// scene.add(focalPoint)


/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(27, 112, - 43)

// const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 30 )
// scene.add( directionalLightHelper )

// const lightGui = gui.addFolder( 'Directional Light' )
// lightGui.add( directionalLight.position, 'x' )
// lightGui.add( directionalLight.position, 'y' )
// lightGui.add( directionalLight.position, 'z' )
scene.add(directionalLight)

const hemisphereLight = new THREE.HemisphereLight( '#ffb184', '#03045e', .5 )
const hemisphereLightHelper = new THREE.HemisphereLightHelper( hemisphereLight )
scene.add(hemisphereLightHelper)
scene.add(hemisphereLight)


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
monitorScreen.position.set( 9.89, 135.09, -15.367 )
monitorScreen.rotation.y = -0.1025
monitorScreen.scale.set( 1.54, 0.95, 1 )
scene.add( monitorScreen )

const officeTarget = new THREE.Object3D()
officeTarget.position.set( 6.5, 133, 16 )
scene.add(officeTarget)

const monitorLight = new THREE.DirectionalLight('#fff', 0.5)
monitorLight.position.set( 9.89, 135.09, -15.367 )
monitorLight.target = officeTarget

// gui.add( monitorLight, 'intensity', 0, 1, .001 )

scene.add( monitorLight )

const helper = new THREE.DirectionalLightHelper( monitorLight, 5 );
scene.add( helper );

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

let cameraTarget = getHashTarget();

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

let cameraPosition = getHashPosition()

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 2000)
camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.target = new THREE.Vector3( cameraTarget.x, cameraTarget.y, cameraTarget.z )

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

window.addEventListener( 'hashchange', ( event ) => {
    event.preventDefault()
    cameraTarget   = getHashTarget()
    cameraPosition = getHashPosition()

    const targetTween = new TWEEN.Tween( controls.target ).to( cameraTarget, 1400 )
    targetTween.easing(TWEEN.Easing.Quadratic.InOut)
    targetTween.start()

    const positionTween = new TWEEN.Tween( camera.position ).to( cameraPosition, 1400 )
    positionTween.easing(TWEEN.Easing.Quadratic.InOut)
    positionTween.start()
} )

/**
 * Animate
 */
const tick = ( time ) =>
{
    // Update controls
    controls.update()

    // Update tween
    TWEEN.update( time )

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()