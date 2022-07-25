import * as THREE from 'three';
import { BoxBufferGeometry } from 'three';
import data from '../data.json';

class InteractiveObject {
  constructor(parent, name) {
    this.parent = parent;
    this.name = name;

    this.parent.scene.traverse((child) => {
      if (this.name === 'pushin' && child.name === 'closed-delta') {
        this.mesh = child;
      } else if (child.name === this.name) {
        this.mesh = child;
      }
    });

    this.setData();

    this.handleActive();
  }

  setData() {
    this.data = data.find((item) => item.name === this.name);
  }

  handleClicked() {
    const modal = document.createElement('natehub-modal');
    document.body.appendChild(modal);
    modal.heading = this.data?.heading ?? '';
    modal.copy = this.data?.copy ?? '';
    modal.ctaText = this.data?.cta?.text ?? '';
    modal.ctaHref = this.data?.cta?.href ?? '';
  }

  handleActive() {
    if (this.mesh) {
      this.activeBox = new THREE.Mesh(
        new BoxBufferGeometry(1, 1, 0.1, 2, 2, 2),
        new THREE.MeshBasicMaterial(),
      );
      this.activeBox.position.set(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);
      this.parent.scene.add(this.activeBox);
    }
  }
}

export default InteractiveObject;
