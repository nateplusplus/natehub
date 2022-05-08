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
    this.nateHub.camera.position.set(13.75, 0, 0);
    // if (this.nateHub.getScreenAspectRatio() < 1) {
    //   this.nateHub.camera.position.set(14, 0, 0);
    // }
  }
}
