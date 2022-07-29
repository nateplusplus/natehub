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

  handleActive() {
    if (this.mesh && this.parent.active !== this.name) {
      const bbox = new THREE.Box3().setFromObject(this.mesh);
      this.meshSize = bbox.getSize(new THREE.Vector3());

      const resize = 1.2;

      this.activeBox = new THREE.Mesh(
        new THREE.TorusBufferGeometry(
          Math.max(this.meshSize.x, this.meshSize.y, this.meshSize.z) * 0.5 * resize,
          0.15,
          32,
          32,
        ),
        new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0.3,
          color: new THREE.Color('#4287f5'),
        }),
      );
      const positionY = this.mesh.position.y + this.parent.cube.position.y;
      this.activeBox.position.set(this.mesh.position.x, positionY, this.mesh.position.z);
      this.activeBox.rotation.y = this.mesh.rotation.y;
      this.activeBox.lookAt(this.parent.camera.position);

      this.parent.active = this;

      this.parent.scene.add(this.activeBox);
    }
  }

  deactivate() {
    this.parent.scene.remove(this.activeBox);
  }
}

export default InteractiveObject;
