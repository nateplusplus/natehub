import * as THREE from 'three';

export default class House {
  constructor(nateHub) {
    this.nateHub = nateHub;

    this.natehubMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#000000'),
    });

    this.office();
    // this.stairs();

    this.light();
  }

  office() {
    const referenceGeometry = new THREE.BoxBufferGeometry(4, 1, 2);
    const reference = new THREE.Mesh(referenceGeometry, this.natehubMaterial);
    reference.name = 'ref';
    this.nateHub.scene.add(reference);
  }

  stairs() {
    const stairGeometry = new THREE.BoxBufferGeometry(4, 1, 2);
    const stair = new THREE.Mesh(stairGeometry, this.natehubMaterial);
    stair.position.set(5, -2, -15);

    for (let i = 0; i < 12; i += 1) {
      const stairClone = stair.clone();
      stairClone.position.set(stair.position.x + (i * 4), stair.position.y, stair.position.z);
      this.nateHub.scene.add(stairClone);
    }
  }

  light() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-70, 50, -70);
    this.nateHub.scene.add(directionalLight);

    this.nateHub.gui.add(directionalLight.position, 'x', -100, 100, 0.01);
    this.nateHub.gui.add(directionalLight.position, 'y', -100, 100, 0.01);
    this.nateHub.gui.add(directionalLight.position, 'z', -100, 100, 0.01);
    this.nateHub.gui.add(directionalLight, 'intensity', -100, 100, 0.01);
  }
}
