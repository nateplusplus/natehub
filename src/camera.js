import * as THREE from 'three';

export default class Camera {
  constructor(nateHub) {
    this.nateHub = nateHub;
    this.nateHub.camera = new THREE.PerspectiveCamera(
      45,
      (this.nateHub.sizes.width / this.nateHub.sizes.height),
      0.1,
      2000,
    );

    this.setPosition();
    this.nateHub.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  setPosition() {
    if (this.nateHub.getBreakpoint() === 'md') {
      this.nateHub.camera.position.set(8, 0, 0);
    } else {
      this.nateHub.camera.position.set(15, 0, 0);
    }
  }
}
