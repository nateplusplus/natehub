import * as THREE from 'three'

export default class Office {
    constructor ( nateHub ) {
        this.nateHub = nateHub

        this.officeLights( nateHub.scene )
        this.officeComputer( nateHub )

        nateHub.gltfLoader.load(
            'natehub-title.gltf',
            (gltf) =>
            {
                nateHub.scene.add(gltf.scene)
                nateHub.focusableObjects = nateHub.focusableObjects.concat( gltf.scene.children )

                const lampShade = gltf.scene.children.find( mesh => mesh.name === 'lamp-shade' )
                nateHub.interactiveElements.push( lampShade )
            }
        )
    }

    officeLights( scene ) {
        const officeTarget = new THREE.Object3D()
        officeTarget.position.set( 3.5, 133, 20 )
        scene.add(officeTarget)

        const monitorLight = new THREE.SpotLight( '#fff', 0.6, 10, Math.PI * 0.5, 0.2 )
        monitorLight.position.set( 9.89, 135.09, -15.367 )
        monitorLight.target = officeTarget
        scene.add( monitorLight )

        const officeCeilingTarget = new THREE.Object3D()
        officeCeilingTarget.position.set( 0, 140, -15.5 )
        scene.add(officeCeilingTarget)

        this.nateHub.floorLampUp = new THREE.SpotLight( '#ffeebf', 0.8, 20, Math.PI * 0.2, 0.5 )
        this.nateHub.floorLampUp.position.set( 0.5, 136.5, -13.5 )
        this.nateHub.floorLampUp.target = officeCeilingTarget
        scene.add( this.nateHub.floorLampUp )

        const officeFloorTarget = new THREE.Object3D()
        officeFloorTarget.position.set( 0, 130, -15.5 )
        scene.add(officeFloorTarget)

        this.nateHub.floorLampDown = new THREE.SpotLight( '#ffeebf', 0.8, 20, Math.PI * 0.2, 0.5 )
        this.nateHub.floorLampDown.position.set( 0.5, 136.5, -13.5 )
        this.nateHub.floorLampDown.target = officeFloorTarget
        scene.add( this.nateHub.floorLampDown )

        this.nateHub.floorLampGlow = new THREE.PointLight( '#ffeebf', 0.8, 10 )
        this.nateHub.floorLampGlow.position.set( 0.5, 136.5, -13.5 )
        scene.add( this.nateHub.floorLampGlow )
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
         * Hint
         */
         const hintTextureAlpha = nateHub.textureLoader.load('click-hint-alpha.png')
         const hintTextureColor = nateHub.textureLoader.load('click-hint-color.png')
         const hintMaterial = new THREE.MeshBasicMaterial()
         hintMaterial.map = hintTextureColor
         hintMaterial.alphaMap = hintTextureAlpha
         hintMaterial.transparent = true

         const monitorHint = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( 2.5, 1 ),
            hintMaterial
        )

        monitorHint.rotation.y = monitorScreen.rotation.y

        monitorHint.position.set( 10, 136.5, -15.36 )

        nateHub.scene.add( monitorHint )

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