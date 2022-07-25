import * as THREE from 'three';
import InteractiveObject from './interactiveObject';

class Monitor extends InteractiveObject {
  add() {
    const indeed = this.parent.textureLoader.load('i-help-people-get-jobs-bg.png');
    this.mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2.33, 1.33),
      new THREE.MeshBasicMaterial({
        map: indeed,
      }),
    );
    this.mesh.rotation.y = Math.PI * 0.5;
    this.mesh.position.set(1.04, -0.3, -1.6);
    this.mesh.name = 'monitor-display';
    this.parent.scene.add(this.mesh);
  }
}

export default Monitor;
