import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as dat from 'lil-gui'
import * as TWEEN from '@tweenjs/tween.js'

function getPointInBetweenByLen(pointA, pointB, length) {
    var dir = pointB.clone().sub(pointA).normalize().multiplyScalar(length);
    return pointA.clone().add(dir);

}

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
        position: new THREE.Vector3( 6.5, 133, 15 )
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
 * Monitor Screen
 */
const textureLoader = new THREE.TextureLoader()

const monitorColorTexture = textureLoader.load('coding-screen.png')
const monitorMaterial = new THREE.MeshBasicMaterial()
monitorMaterial.map = monitorColorTexture

const monitorScreen = new THREE.Mesh(
    new THREE.BoxBufferGeometry( 2, 2, 0.01 ),
    monitorMaterial
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
 * Laptop Screen
 */
const laptopScreen = new THREE.Mesh(
    new THREE.BoxBufferGeometry( 2, 2, 0.01 ),
    monitorMaterial
)
laptopScreen.position.set( 6.885, 135.505, -14.986 )
laptopScreen.rotation.y = Math.PI * .077
laptopScreen.scale.set( 0.721, 0.514, 1 )
laptopScreen.name = 'laptopScreen';

interactiveElements.push( laptopScreen )

scene.add( laptopScreen )


let focusableObjects = interactiveElements;


/**
 * Ground
 */
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(3000, 3000),
    new THREE.MeshStandardMaterial({ color: '#1a4683' })
)
ground.rotation.x = - Math.PI / 2

scene.add(ground)


/**
 * Trees
**/

const treeLoadingManager = new THREE.LoadingManager()
const treeTextureLoader = new THREE.TextureLoader(treeLoadingManager)

// Tree 1
const treeColorTexture = treeTextureLoader.load('/twisty-tree.png')
const treeAlphaTexture = treeTextureLoader.load('/twisty-tree-alpha.png')

const treeSize = 30;
const treesMaterial = new THREE.PointsMaterial({
    size: treeSize,
    sizeAttenuation: true,
    map: treeColorTexture,
    alphaMap: treeAlphaTexture,
    alphaTest: 0.1
})
treesMaterial.transparent = true;

const treesGeometry = new THREE.BufferGeometry()
const count = 800

// Multiply by 3 because each position is composed of 3 values (x, y, z)
const positions = new Float32Array( count * 3 )

for ( let i = 0; i < count * 3; i++ ) {
    let value = (Math.random() - 0.5) * 2000;

    if ( ( i + 1 ) % 3 === 2 ) {
        // y-axis - keep trees flat to the ground
        value = treeSize / 6;
    } else if ( ( i + 1 ) % 3 === 0 ) {
        // z-axis - keep trees away from title if x-axis is too close
        if (  Math.abs( positions[i-2] ) < 90 && Math.abs( value ) < 150 ) {
            value = value + ( Math.sign( value ) * 150 );
            positions[i-2] = positions[i-2] + ( Math.sign( positions[i-2] ) * 90 );
        }
    }

    positions[i] = value;
}

treesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)) // Create the Three.js BufferAttribute and specify that each information is composed of 3 values

const trees = new THREE.Points(treesGeometry, treesMaterial)
scene.add(trees)

// Tree 2
const tree2ColorTexture = treeTextureLoader.load('/twisty-tree-2-color.png')
const tree2AlphaTexture = treeTextureLoader.load('/twisty-tree-2-alpha.png')

const tree2Size = 30;
const tree2Material = new THREE.PointsMaterial({
    size: tree2Size,
    sizeAttenuation: true,
    map: tree2ColorTexture,
    alphaMap: tree2AlphaTexture,
    alphaTest: 0.1
})
tree2Material.transparent = true;

const tree2Geometry = new THREE.BufferGeometry()
const tree2Count = 800

// Multiply by 3 because each position is composed of 3 values (x, y, z)
const tree2Positions = new Float32Array( tree2Count * 3 )

for ( let i = 0; i < tree2Count * 3; i++ ) {
    let value = (Math.random() - 0.5) * 2000;

    if ( ( i + 1 ) % 3 === 2 ) {
        // y-axis - keep trees flat to the ground
        value = tree2Size / 6;
    } else if ( ( i + 1 ) % 3 === 0 ) {
        // z-axis - keep trees away from title if x-axis is too close
        if (  Math.abs( tree2Positions[i-2] ) < 90 && Math.abs( value ) < 150 ) {
            value = value + ( Math.sign( value ) * 150 );
            tree2Positions[i-2] = tree2Positions[i-2] + ( Math.sign( tree2Positions[i-2] ) * 90 );
        }
    }
    tree2Positions[i] = value;
}

tree2Geometry.setAttribute('position', new THREE.BufferAttribute(tree2Positions, 3)) // Create the Three.js BufferAttribute and specify that each information is composed of 3 values

const tree2 = new THREE.Points(tree2Geometry, tree2Material)
scene.add(tree2)

// Tree 2
const tree3ColorTexture = treeTextureLoader.load('/twisty-tree-3-color.png')
const tree3AlphaTexture = treeTextureLoader.load('/twisty-tree-3-alpha.png')

const tree3Size = 30;
const tree3Material = new THREE.PointsMaterial({
    size: tree3Size,
    sizeAttenuation: true,
    map: tree3ColorTexture,
    alphaMap: tree3AlphaTexture,
    alphaTest: 0.1
})
tree3Material.transparent = true;

const tree3Geometry = new THREE.BufferGeometry()
const tree3Count = 800

// Multiply by 3 because each position is composed of 3 values (x, y, z)
const tree3Positions = new Float32Array( tree3Count * 3 )

for ( let i = 0; i < tree3Count * 3; i++ ) {
    let value = (Math.random() - 0.5) * 2000;

    if ( ( i + 1 ) % 3 === 2 ) {
        // y-axis - keep trees flat to the ground
        value = tree3Size / 6;
    } else if ( ( i + 1 ) % 3 === 0 ) {
        // z-axis - keep trees away from title if x-axis is too close
        if (  Math.abs( tree3Positions[i-2] ) < 90 && Math.abs( value ) < 150 ) {
            value = value + ( Math.sign( value ) * 150 );
            tree3Positions[i-2] = tree3Positions[i-2] + ( Math.sign( tree3Positions[i-2] ) * 90 );
        }
    }
    tree3Positions[i] = value;
}

tree3Geometry.setAttribute('position', new THREE.BufferAttribute(tree3Positions, 3)) // Create the Three.js BufferAttribute and specify that each information is composed of 3 values

const tree3 = new THREE.Points(tree3Geometry, tree3Material)
scene.add(tree3)


/**
 * Stars
 */

const starsDistance = 2000;
const starCount = 1000;
const starsGeometry = new THREE.BufferGeometry();
const starsPositions = new Float32Array( starCount * 3 );

const starsMaterial = new THREE.PointsMaterial({
    size: 1,
    sizeAttenuation: false,
    fog: false,
})

for ( let i = 0; i < starCount; i++ ) {
    const index = ((i + 1) * 3) - 1;

    const starsVertex = new THREE.Vector3();

    const theta = THREE.Math.randFloatSpread(360);
    const phi = THREE.Math.randFloatSpread(360);

    starsVertex.x = starsDistance * Math.sin(theta) * Math.cos(phi);
    starsVertex.y = starsDistance * Math.sin(theta) * Math.sin(phi)
    starsVertex.y = starsVertex.y < -50 ? Math.abs( starsVertex.y ) : starsVertex.y;
    starsVertex.z = starsDistance * Math.cos(theta);

    starsPositions[index-2] = starsVertex.x;
    starsPositions[index-1] = starsVertex.y;
    starsPositions[index] = starsVertex.z;
}
starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3))
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

/**
 * Fog
 */
const fog = new THREE.Fog('#000000', 1, 1800)
scene.fog = fog


/**
 * Mouse
 */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
})
const mouseRaycaster = new THREE.Raycaster()

const interactiveDistance = 50


/**
 * Models
 */
const gltfLoader = new GLTFLoader()
gltfLoader.load(
    'natehub-title.gltf',
    (gltf) =>
    {
        scene.add(gltf.scene)
        focusableObjects = focusableObjects.concat( gltf.scene.children )
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
        if ( pointsOfInterestCopy.hasOwnProperty( targetKey ) ) {
            targetPosition = pointsOfInterestCopy[targetKey].target
        }
    }

    if ( ! targetPosition ) {
        targetPosition = pointsOfInterestCopy.start.target
    }

    return targetPosition
}

function getHashPosition() {
    let position
    const hash = window.location.hash

    if ( hash.length > 1 ) {
        const target = hash.replace( '#', '' )
        if ( pointsOfInterest.hasOwnProperty( target ) ) {
            position = pointsOfInterest[target].position
        }
    }
    
    if ( ! position ) {
        position = pointsOfInterest.start.position
    }

    return position
}

let cameraPosition = getHashPosition()

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 4500)
camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
scene.add(camera)


/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.minDistance = 5
controls.maxDistance = 1000

const cameraTarget = new THREE.Mesh( new THREE.BoxBufferGeometry( 1, 1, 1, 2, 2, 2 ) )
const targetStart = getHashTarget();
cameraTarget.position.set( targetStart.x, targetStart.y, targetStart.z )
// scene.add( cameraTarget )

controls.target = cameraTarget.position

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

window.addEventListener( 'hashchange', ( event ) => {
    event.preventDefault()

    const targetTween = new TWEEN.Tween( cameraTarget.position ).to( getHashTarget(), 1400 )
    targetTween.easing(TWEEN.Easing.Quadratic.InOut)
    targetTween.start()

    cameraPosition = getHashPosition()

    const positionTween = new TWEEN.Tween( camera.position ).to( cameraPosition, 1400 )
    positionTween.easing(TWEEN.Easing.Quadratic.InOut)
    positionTween.start()
} )

let modalFocus = false;

let mouseMove = false
let mouseDown = false
canvas.addEventListener( 'mousedown', ( event ) => {
    mouseDown = event
} )

canvas.addEventListener( 'mousemove', ( event ) => {
    if ( mouseDown ) {
        const differenceX = event.clientX - mouseDown.clientX;
        const differenceY = event.clientY - mouseDown.clientY;

        if ( Math.abs( differenceX ) > 1 || Math.abs( differenceY ) > 1 ) {
            mouseMove = event
        }
    }
} )

// Click interactions
canvas.addEventListener( 'mouseup', ( event ) => {
    const intersects = mouseRaycaster.intersectObjects( focusableObjects );

    if ( modalFocus ) {
        return;
    }


    if ( intersects.length > 0 && intersects[0].distance < interactiveDistance && intersects[0].object.name !== '' ) {
        const bioToggles = [ 'monitorScreen', 'laptopScreen' ]
        if (  bioToggles.indexOf( intersects[0].object.name ) > -1 ) {
            document.querySelector('.modal').focus()
        } else if ( ! mouseMove ) {
            const focusOnObject = new TWEEN.Tween( controls.target ).to( intersects[0].point, 1400 )
            focusOnObject.easing(TWEEN.Easing.Quadratic.InOut)
            focusOnObject.start()

            if ( intersects[0].distance > 20 ) {
                const moveTo = getPointInBetweenByLen( camera.position, intersects[0].point, 10 );
                const moveTowardObject = new TWEEN.Tween( camera.position ).to( moveTo, 1400 );
                moveTowardObject.easing(TWEEN.Easing.Quadratic.InOut);
                moveTowardObject.start();
            }
        }
    } else if ( ! mouseMove ) {
        const point = intersects.length > 0 ? intersects[0].distance : 200;

        let moveTarget = new THREE.Vector3();
        mouseRaycaster.ray.at( point, moveTarget );

        const positionTween = new TWEEN.Tween( controls.target ).to( moveTarget, 1400 );
        positionTween.easing(TWEEN.Easing.Quadratic.InOut);
        positionTween.start();

        let moveCamera = new THREE.Vector3();
        mouseRaycaster.ray.at( point / 2, moveCamera );

        const cameraPosition = new TWEEN.Tween( camera.position ).to( moveCamera, 1400 );
        cameraPosition.easing(TWEEN.Easing.Quadratic.InOut);
        cameraPosition.start();
    }

    mouseMove = false;
    mouseDown = false;
} );

// Modal close
const modal = document.querySelector('.modal');
modal.addEventListener( 'click', ( event ) => {
    if ( event.target.classList.contains( 'modal__close' ) ) {
        canvas.focus();
    }
} );

modal.addEventListener( 'focus', (event) => {
    modalFocus = true;
    modal.ariaHidden = false;

    setTimeout( () => {
        modal.classList.add('open');
    }, 100 );
} );

modal.addEventListener( 'blur', (event) => {
    modal.classList.remove('open');
    setTimeout( () => {
        modal.ariaHidden = true;
        modalFocus = false;
    }, 500 );
} );

// Cursor change on hover
canvas.addEventListener( 'mousemove', ( event ) => {
    const intersects = mouseRaycaster.intersectObjects( interactiveElements )
    if ( intersects.length > 0 && intersects[0].distance < interactiveDistance && intersects[0].object.name !== '' ) {
        canvas.style.cursor = 'pointer'
    } else if ( canvas.style.cursor !== 'auto' ) {
        canvas.style.cursor = 'auto'
    }
} )

/**
 * Animate
 */
const tick = ( time ) =>
{
    // Update controls
    controls.update()

    mouseRaycaster.setFromCamera( mouse, camera )

    // Update tween
    TWEEN.update( time )

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()