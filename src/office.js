import * as THREE from 'three'

export default class Office {
    constructor ( nateHub ) {
        this.officeLights( nateHub.scene )
        this.officeComputer( nateHub )

        nateHub.gltfLoader.load(
            'natehub-title.gltf',
            (gltf) =>
            {
                nateHub.scene.add(gltf.scene)
                nateHub.focusableObjects = nateHub.focusableObjects.concat( gltf.scene.children )
            }
        )
        
        nateHub.gltfLoader.load(
            'office-lamp.gltf',
            (gltf) =>
            {
                gltf.scene.scale.x = 1.6
                gltf.scene.scale.y = 1.6
                gltf.scene.scale.z = 1.6
        
                gltf.scene.position.y = 129
                gltf.scene.position.z = -14
                gltf.scene.position.x = 1
        
                gltf.scene.rotation.y = Math.PI / 5
                nateHub.scene.add(gltf.scene)
                nateHub.focusableObjects = nateHub.focusableObjects.concat( gltf.scene.children )
            }
        )
    }

    officeLights( scene ) {
        // Monitor
        const officeTarget = new THREE.Object3D()
        officeTarget.position.set( 3.5, 133, 20 )
        scene.add(officeTarget)

        const monitorLight = new THREE.SpotLight( '#fff', 0.6, 10, Math.PI * 0.5, 0.2 )
        monitorLight.position.set( 9.89, 135.09, -15.367 )
        monitorLight.target = officeTarget

        scene.add( monitorLight )
    }

    officeComputer( nateHub ) {
        const monitorColorTexture = nateHub.textureLoader.load('coding-screen.png')
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

        nateHub.interactiveElements.push( monitorScreen )
        nateHub.focusableObjects.push( monitorScreen )

        nateHub.scene.add( monitorScreen )

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

        nateHub.interactiveElements.push( laptopScreen )
        nateHub.focusableObjects.push( laptopScreen )

        nateHub.scene.add( laptopScreen )
    }
}