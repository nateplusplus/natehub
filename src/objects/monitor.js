import * as THREE from 'three';
import InteractiveObject from './interactiveObject';

class Monitor extends InteractiveObject {
  constructor(parent, frame) {
    super(parent, frame.name);
    this.name = 'indeed';

    this.front = 'x';
  }

  add() {
    const indeed = this.parent.textureLoader.load('i-help-people-get-jobs-bg.jpg');
    this.mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2.33, 1.33),
      new THREE.MeshBasicMaterial({
        map: indeed,
      }),
    );
    this.mesh.rotation.y = Math.PI * 0.5;
    this.mesh.position.set(1.04, 5, -1.6);
    this.mesh.name = 'monitorDisplay';
    this.parent.cube.add(this.mesh);

    this.makeBoundingBox();
    this.setData();
  }
}

export default Monitor;
