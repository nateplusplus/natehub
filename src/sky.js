import * as THREE from 'three'

export default class Sky {
    constructor ( nateHub ) {
        this.nateHub = nateHub
        this.stars()
    }

    stars() {
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
        this.nateHub.scene.add(stars);
    }
}