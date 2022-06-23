import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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

    this.nateHub.controls = new OrbitControls(this.nateHub.camera, this.nateHub.canvas);
    this.nateHub.controls.target = new THREE.Vector3(0, 0, 0);
    this.nateHub.controls.update();

    this.nateHub.scene.add(this.nateHub.camera);
  }

  setPosition() {
    this.nateHub.camera.position.set(-10, 0, 20);
  }
}
