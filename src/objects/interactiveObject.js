import * as THREE from 'three';
import { BoxBufferGeometry } from 'three';
import data from '../data.json';

class InteractiveObject {
  constructor(parent, name) {
    this.parent = parent;
    this.name = name;
    this.active = false;

    this.parent.scene.traverse((child) => {
      if (this.name === 'pushin' && child.name === 'closed-delta') {
        this.mesh = child;
      } else if (child.name === this.name) {
        this.mesh = child;
      }
    });

    this.setData();
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

  boundingRadius() {
    const resize = 1.2;
    let radius = 1;

    if (this.mesh) {
      const bbox = new THREE.Box3().setFromObject(this.mesh);
      this.meshSize = bbox.getSize(new THREE.Vector3());
      radius = Math.max(this.meshSize.x, this.meshSize.y, this.meshSize.z) * 0.5 * resize;
    }

    return radius;
  }

  getOverlayPosition() {
    let position = new THREE.Vector3();
    if (this.mesh) {
      const positionY = this.mesh.position.y + this.parent.cube.position.y;
      position = new THREE.Vector3(this.mesh.position.x, positionY, this.mesh.position.z);
    }

    return position;
  }
}

export default InteractiveObject;
