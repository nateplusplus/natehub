import * as THREE from 'three';
import NatehubModal from '../modal';

class Monitor {
  constructor(parent) {
    this.parent = parent;

    customElements.define('natehub-modal', NatehubModal);
  }

  handleClicked(object) {
    console.log('Monitor clicked! Woot!');

    const modal = document.createElement('natehub-modal');
    document.body.appendChild(modal);
  }

  add() {
    const indeed = this.parent.textureLoader.load('i-help-people-get-jobs-bg.png');
    this.screen = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2.33, 1.33),
      new THREE.MeshBasicMaterial({
        map: indeed,
      }),
    );
    this.screen.rotation.y = Math.PI * 0.5;
    this.screen.position.set(1.04, -0.3, -1.6);
    this.screen.name = 'monitor-display';
    this.parent.scene.add(this.screen);
  }
}

export default Monitor;
