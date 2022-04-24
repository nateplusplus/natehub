import * as THREE from 'three';

export default class House {
  constructor(nateHub) {
    this.nateHub = nateHub;

    nateHub.gltfLoader.load(
      'natehub-house.gltf',
      (gltf) => {
        gltf.scene.scale.set(1.25, 1.25, 1.25);
        nateHub.scene.add(gltf.scene);
      },
    );

    this.light();
  }

  light() {
    const light = new THREE.AmbientLight(0x404040); // soft white light
    this.nateHub.scene.add(light);
  }
}
