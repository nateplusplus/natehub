import * as THREE from 'three'

export default class Landscape {
    constructor( nateHub ) {
        this.nateHub = nateHub

        // this.trees()
        this.lights()
    }


    trees() {
        this.nateHub.scene.add( this.makeTree( 'twisty-tree', 30, 800 ) )
        this.nateHub.scene.add( this.makeTree( 'twisty-tree-2', 30, 800 ) )
        this.nateHub.scene.add( this.makeTree( 'twisty-tree-3', 30, 800 ) )
    }

    makeTree( name, size, count ) {
        const treeColorTexture = this.nateHub.textureLoader.load(`/${name}-color.png`)
        const treeAlphaTexture = this.nateHub.textureLoader.load(`/${name}-alpha.png`)

        const treesMaterial = new THREE.PointsMaterial({
            size: size,
            sizeAttenuation: true,
            map: treeColorTexture,
            alphaMap: treeAlphaTexture,
            alphaTest: 0.1
        })
        treesMaterial.transparent = true;

        const treesGeometry = new THREE.BufferGeometry()

        // Multiply by 3 because each position is composed of 3 values (x, y, z)
        const positions = new Float32Array( count * 3 )
        
        for ( let i = 0; i < count * 3; i++ ) {
            let value = (Math.random() - 0.5) * 2000;

            if ( ( i + 1 ) % 3 === 2 ) {
                // y-axis - keep trees flat to the ground
                value = size / 6;
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

        return new THREE.Points(treesGeometry, treesMaterial)
    }

    lights() {
        const hemisphereLight = new THREE.HemisphereLight( '#ffb184', '#03045e', .5 )

        const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
        directionalLight.position.set(27, 112, - 43)

        this.nateHub.scene.add(hemisphereLight)
        this.nateHub.scene.add(directionalLight)
    }
}