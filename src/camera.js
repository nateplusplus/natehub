import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Camera {
  static make(nateHub) {
    const camera = new THREE.PerspectiveCamera(
      45,
      (nateHub.sizes.width / nateHub.sizes.height),
      0.1,
      4500,
    );

    camera.position.set(
      nateHub.cameraPosition.x,
      nateHub.cameraPosition.y,
      nateHub.cameraPosition.z,
    );

    return camera;
  }

  static controls(nateHub) {
    const controls = new OrbitControls(nateHub.camera, nateHub.canvas);
    controls.enableDamping = true;
    controls.minDistance = 5;
    controls.maxDistance = 1000;

    const cameraTarget = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1, 2, 2, 2));
    const targetStart = nateHub.getHashTarget();
    cameraTarget.position.set(targetStart.x, targetStart.y, targetStart.z);

    controls.target = cameraTarget.position;

    return controls;
  }
}
