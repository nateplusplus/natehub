import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as dat from 'lil-gui'
import * as TWEEN from '@tweenjs/tween.js'
import Office from './office'
import Landscape from './landscape'
import Camera from './camera'
import Sky from './sky'
import NatehubModal from './natehubModal'

class NateHub {
    constructor() {
        this.canvas = document.querySelector('canvas.webgl')
        this.modal  = document.querySelector('.modal');

        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        this.interactiveElements = []
        this.focusableObjects    = []
        this.modalFocus          = false
        this.mouseMove           = false
        this.mouseDown           = false

        this.setPoints()
        this.setupScene()
        this.bindEvents()

        this.clock = new THREE.Clock()

        new Camera( this )
        new Landscape( this )
        new Sky( this )
        new Office( this )

        this.tick()
    }

    bindEvents() {
        const toggle = document.querySelector( '.site-nav__toggle' )
        toggle.addEventListener( 'click', ( event ) => {
            event.preventDefault()

            const menu = document.querySelector( '.site-nav__list' )

            if ( menu.getBoundingClientRect().left >= 0 ) {
                this.canvas.setAttribute( 'tabindex', -1 )
                this.canvas.focus()
            }
        } )

        const helpToggle = document.querySelector( '#help' );
        helpToggle.addEventListener( 'click', (event) => {
            document.querySelector('.natehub-modal--help').focus()
        } )

        window.addEventListener('mousemove', (event) => {
            this.mouse.x = event.clientX / this.sizes.width * 2 - 1
            this.mouse.y = - (event.clientY / this.sizes.height) * 2 + 1
        })

        window.addEventListener('resize', () => {
            // Update sizes
            this.sizes.width = window.innerWidth
            this.sizes.height = window.innerHeight
        
            // Update camera
            this.camera.aspect = this.sizes.width / this.sizes.height
            this.camera.updateProjectionMatrix()
        
            // Update renderer
            this.renderer.setSize(this.sizes.width, this.sizes.height)
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })

        window.addEventListener( 'hashchange', ( event ) => {
            event.preventDefault()
        
            const targetTween = new TWEEN.Tween( this.cameraTarget.position ).to( this.getHashTarget(), 1400 )
            targetTween.easing(TWEEN.Easing.Quadratic.InOut)
            targetTween.start()
        
            this.cameraPosition = this.getHashPosition()
        
            const positionTween = new TWEEN.Tween( this.camera.position ).to( this.cameraPosition, 1400 )
            positionTween.easing( TWEEN.Easing.Quadratic.InOut )
            positionTween.start()
        } )

        this.canvas.addEventListener( 'mousedown', ( event ) => {
            this.mouseDown = event
        } )

        this.canvas.addEventListener( 'mousemove', ( event ) => {
            if ( this.mouseDown ) {
                const differenceX = event.clientX - this.mouseDown.clientX;
                const differenceY = event.clientY - this.mouseDown.clientY;

                if ( Math.abs( differenceX ) > 1 || Math.abs( differenceY ) > 1 ) {
                    this.mouseMove = event
                }
            }
        } )

        this.canvas.addEventListener( 'mouseup', ( event ) => {
            const intersects = this.mouseRaycaster.intersectObjects( this.focusableObjects );

            if ( this.modalFocus ) {
                return;
            }

            if ( intersects.length > 0 && intersects[0].distance < this.interactiveDistance && intersects[0].object.name !== '' ) {
                const bioToggles = [ 'monitorScreen', 'laptopScreen' ]
                if (  bioToggles.indexOf( intersects[0].object.name ) > -1 ) {
                    document.querySelector('.natehub-modal--about').focus()
                } else if ( intersects[0].object.name === 'lamp-shade' ) {
                    this.floorLampGlow.intensity = this.floorLampGlow.intensity === 0 ? 0.8 : 0
                    this.floorLampUp.intensity = this.floorLampUp.intensity === 0 ? 0.8 : 0
                    this.floorLampDown.intensity = this.floorLampDown.intensity === 0 ? 0.8 : 0
                } else if ( ! this.mouseMove ) {
                    const focusOnObject = new TWEEN.Tween( this.controls.target ).to( intersects[0].point, 1400 )
                    focusOnObject.easing(TWEEN.Easing.Quadratic.InOut)
                    focusOnObject.start()
        
                    if ( intersects[0].distance > 20 ) {
                        const moveTo = nateHub.getPointInBetweenByLen( this.camera.position, intersects[0].point, 10 );
                        const moveTowardObject = new TWEEN.Tween( this.camera.position ).to( moveTo, 1400 );
                        moveTowardObject.easing(TWEEN.Easing.Quadratic.InOut);
                        moveTowardObject.start();
                    }
                }
            } else if ( ! this.mouseMove ) {
                const point = intersects.length > 0 ? intersects[0].distance : 200;
        
                let moveTarget = new THREE.Vector3();
                this.mouseRaycaster.ray.at( point, moveTarget );
        
                const positionTween = new TWEEN.Tween( this.controls.target ).to( moveTarget, 1400 );
                positionTween.easing(TWEEN.Easing.Quadratic.InOut);
                positionTween.start();
        
                let moveCamera = new THREE.Vector3();
                this.mouseRaycaster.ray.at( point / 2, moveCamera );
        
                const cameraPosition = new TWEEN.Tween( this.camera.position ).to( moveCamera, 1400 );
                cameraPosition.easing(TWEEN.Easing.Quadratic.InOut);
                cameraPosition.start();
            }
        
            this.mouseMove = false;
            this.mouseDown = false;
        } )

        this.canvas.addEventListener( 'mousemove', ( event ) => {
            const intersects = this.mouseRaycaster.intersectObjects( this.interactiveElements )
            if ( intersects.length > 0 && intersects[0].distance < this.interactiveDistance && intersects[0].object.name !== '' ) {
                this.canvas.style.cursor = 'pointer'
            } else if ( this.canvas.style.cursor !== 'auto' ) {
                this.canvas.style.cursor = 'auto'
            }
        } )
    }

    setupScene() {
        this.scene          = new THREE.Scene()
        this.textureLoader  = new THREE.TextureLoader()
        this.loadingManager = new THREE.LoadingManager()
        this.gltfLoader     = new GLTFLoader()

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
        })
        this.renderer.setSize( this.sizes.width, this.sizes.height )
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        this.scene.fog = new THREE.Fog('#000000', 1, 1800)
    }

    setPoints() {
        this.pointsOfInterest = {
            start: {
                target: new THREE.Vector3( 0, 80, 0 ),
                position: new THREE.Vector3( 400, 200, -400 )
            },
            about : {
                target: new THREE.Vector3( 8, 134, -14 ),
                position: new THREE.Vector3( 6.5, 133, 15 )
            }
        }
    }

    debug( config ) {

        if ( ! this.gui ) {
            this.gui = new dat.GUI()
        }

        this.gui.add( config.object, config.property, config.min, config.max, config.step )
    }

    getPointInBetweenByLen(pointA, pointB, length) {
        var dir = pointB.clone().sub(pointA).normalize().multiplyScalar(length);
        return pointA.clone().add(dir);
    
    }

    getHashTarget() {
        let targetPosition
        const hash = window.location.hash
        const pointsOfInterestCopy = Object.assign( {}, this.pointsOfInterest )
    
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

    getHashPosition() {
        let position
        const hash = window.location.hash
    
        if ( hash.length > 1 ) {
            const target = hash.replace( '#', '' )
            if ( this.pointsOfInterest.hasOwnProperty( target ) ) {
                position = this.pointsOfInterest[target].position
            }
        }
        
        if ( ! position ) {
            position = this.pointsOfInterest.start.position
        }
    
        return position
    }

    tick( time ) {
        const elapsedTime = this.clock.getElapsedTime()

        this.stars.rotation.y = elapsedTime * 0.01

        // Update controls
        this.controls.update()

        this.mouseRaycaster.setFromCamera( this.mouse, this.camera )

        // Update tween
        TWEEN.update( time )

        // Render
        this.renderer.render( this.scene, this.camera )

        // Call tick again on the next frame
        window.requestAnimationFrame( this.tick.bind( this ) )
    }
}

window.nateHub = new NateHub()

customElements.define('natehub-modal', NatehubModal);
