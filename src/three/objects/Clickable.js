import {
  Box3, Vector3, BoxBufferGeometry, Mesh, MeshBasicMaterial
} from 'three';
import data from '../data.json';

class Clickable {
  constructor(parent, name) {
    this.parent = parent;
    this.name = name;
    this.active = false;
    this.front = 'x';

    this.parent.scene.traverse((child) => {
      if (this.name === 'pushin' && child.name === 'closedDelta') {
        this.mesh = child;
      } else if (child.name === this.name) {
        this.mesh = child;
      }
    });

    this.makeBoundingBox();
    this.setData();
  }

  setData() {
    this.data = data.find((item) => item.name === this.name);
  }

  makeBoundingBox() {
    if (this.mesh) {
      const bbox = new Box3().setFromObject(this.mesh);

      const dimensions = new Vector3().subVectors(bbox.max, bbox.min);
      const padding = 0.2;
      const boxGeo = new BoxBufferGeometry(
        dimensions.x + padding,
        dimensions.y + padding,
        dimensions.z + padding
      );

      const box = new Mesh(
        boxGeo,
        new MeshBasicMaterial({
          transparent: true,
          opacity: 0.2
        })
      );

      box.visible = false;

      box.name = `${this.mesh.name}Bbox`;
      box.position.copy(this.mesh.position);

      this.parent.scene.add(box);
    }
  }

  handleClicked() {
    const modal = document.createElement('natehub-modal');
    document.body.appendChild(modal);
    modal.heading = this.data?.heading ?? '';
    modal.copy = this.data?.copy ?? '';
    modal.ctaText = this.data?.cta?.text ?? '';
    modal.ctaHref = this.data?.cta?.href ?? '';

    setTimeout(
      () => {
        modal.container.focus();
      },
      5
    );
  }

  boundingRadius() {
    const resize = 1.2;
    let radius = 1;

    if (this.mesh) {
      const bbox = new Box3().setFromObject(this.mesh);
      this.meshSize = bbox.getSize(new Vector3());
      radius = Math.max(this.meshSize.x, this.meshSize.y, this.meshSize.z) * 0.5 * resize;
    }

    return radius;
  }

  getOverlayPosition() {
    let position = new Vector3();
    if (this.mesh) {
      position = new Vector3(
        this.mesh.position.x,
        this.mesh.position.y,
        this.mesh.position.z
      );

      // Add padding to whichever dimension is considered the front
      // This ensures that the hover state is positioned slightly in front,
      // and allows it to face the object.
      if (position[this.front] > 0) {
        position[this.front] += 0.2;
      } else {
        position[this.front] -= 0.2;
      }
    }

    return position;
  }

  update(deltaTime) {
    if (this.mixer) {
      this.mixer.update(deltaTime);
    }
  }
}

export default Clickable;
