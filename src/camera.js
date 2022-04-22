import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Camera {
  constructor(nateHub) {
    this.nateHub = nateHub;

    nateHub.cameraPosition = nateHub.getHashPosition();

    nateHub.camera = new THREE.PerspectiveCamera(45, nateHub.sizes.width / nateHub.sizes.height, 0.1, 4500);
    nateHub.camera.position.set(nateHub.cameraPosition.x, nateHub.cameraPosition.y, nateHub.cameraPosition.z);
    nateHub.scene.add(nateHub.camera);

    this.setControls();
  }

  setControls() {
    this.nateHub.mouse = new THREE.Vector2();
    this.nateHub.mouseRaycaster = new THREE.Raycaster();
    this.nateHub.interactiveDistance = 50;

    this.nateHub.controls = new OrbitControls(this.nateHub.camera, this.nateHub.canvas);
    this.nateHub.controls.enableDamping = true;
    this.nateHub.controls.minDistance = 5;
    this.nateHub.controls.maxDistance = 1000;

    this.nateHub.cameraTarget = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1, 2, 2, 2));
    const targetStart = this.nateHub.getHashTarget();
    this.nateHub.cameraTarget.position.set(targetStart.x, targetStart.y, targetStart.z);

    this.nateHub.controls.target = this.nateHub.cameraTarget.position;
  }
}
