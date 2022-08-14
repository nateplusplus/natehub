import * as THREE from 'three';
import Clickable from './Clickable';

class Monitor extends Clickable {
  constructor(parent, frame) {
    super(parent, frame.name);
    this.name = 'indeed';

    this.front = 'x';
  }

  add() {
    const indeed = this.parent.parent.textureLoader.load('i-help-people-get-jobs-bg.jpg');
    this.mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2.33, 1.33),
      new THREE.MeshBasicMaterial({
        map: indeed,
      }),
    );
    this.mesh.rotation.y = Math.PI * 0.5;
    this.mesh.position.set(1.04, 5, -1.6);
    this.mesh.name = 'monitorDisplay';
    this.parent.scene.add(this.mesh);

    this.makeBoundingBox();
    this.setData();
  }
}

export default Monitor;
