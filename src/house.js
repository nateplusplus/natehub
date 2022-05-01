import * as THREE from 'three';

export default class House {
  constructor(nateHub) {
    this.nateHub = nateHub;

    this.natehubMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#000000'),
    });

    this.office();
    this.light();
  }

  office() {
    this.nateHub.gltfLoader.load(
      'desk.gltf',
      (gltf) => {
        const bbox = new THREE.Box3().setFromObject(gltf.scene);
        const modelSize = bbox.getSize(new THREE.Vector3());
        gltf.scene.position.z = 2.45;
        gltf.scene.position.y = modelSize.y * -0.5;
        this.nateHub.scene.add(gltf.scene);
      },
    );
  }

  light() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1); // soft white light
    this.nateHub.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.15);
    directionalLight.position.set(16, 36, -50);
    this.nateHub.scene.add(directionalLight);
  }
}
