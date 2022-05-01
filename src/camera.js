import * as THREE from 'three';

export default class Camera {
  static make(nateHub) {
    const camera = new THREE.PerspectiveCamera(
      45,
      (nateHub.sizes.width / nateHub.sizes.height),
      0.1,
      2000,
    );

    camera.position.set(15, 0, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    return camera;
  }
}
