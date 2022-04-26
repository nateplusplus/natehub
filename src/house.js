import * as THREE from 'three';

export default class House {
  constructor(nateHub) {
    this.nateHub = nateHub;

    const platformGeometry = new THREE.CylinderGeometry(15, 15, 2, 36);
    const natehubMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x219ebc),
    });
    const platform = new THREE.Mesh(platformGeometry, natehubMaterial);
    this.nateHub.scene.add(platform);

    const stairGeometry = new THREE.BoxBufferGeometry(4, 1, 2);
    const stair = new THREE.Mesh(stairGeometry, natehubMaterial);
    stair.position.set(5, -2, -15);

    for(let i = 0; i < 12; i++) {
      const stairClone = stair.clone();
      stairClone.position.set(Math.cos(i * (Math.PI / 10)) * -4, (-2 * i), -15 + (-2 * i));
      stairClone.rotation.y = (Math.PI / 28) * -i;
      this.nateHub.scene.add(stairClone);
    }

    this.light();
  }

  light() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-70, 50, -70);
    this.nateHub.scene.add(directionalLight);

    // this.nateHub.gui.add(directionalLight.position, 'x', -100, 100, 0.01);
    // this.nateHub.gui.add(directionalLight.position, 'y', -100, 100, 0.01);
    // this.nateHub.gui.add(directionalLight.position, 'z', -100, 100, 0.01);
    // this.nateHub.gui.add(directionalLight, 'intensity', -100, 100, 0.01);
  }
}
