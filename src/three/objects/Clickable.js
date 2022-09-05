import {
  Box3, Vector3, BoxBufferGeometry, Mesh, MeshBasicMaterial, TorusBufferGeometry, Color
} from 'three';
import data from '../data.json';

class Clickable {
  constructor(parent, name) {
    this.parent = parent;
    this.natehub = parent.parent ?? parent;
    this.name = name;
    this.active = false;
    this.front = 'x';

    this.overlay = {
      radius: 1.2,
      thickness: 0.15
    };
  }

  add() {
    this.scene = this.gltf ? this.gltf.scene : this.parent.gltf.scene;

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

      this.box = new Mesh(
        boxGeo,
        new MeshBasicMaterial({
          transparent: true,
          opacity: 0.2
        })
      );

      this.box.visible = false;

      this.box.name = `${this.mesh.name}Bbox`;
      this.box.position.copy(this.mesh.position);

      this.scene.add(this.box);
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
    let radius = 1;

    if (this.mesh) {
      const bbox = new Box3().setFromObject(this.mesh);
      this.meshSize = bbox.getSize(new Vector3());
      const maxSize = Math.max(this.meshSize.x, this.meshSize.y, this.meshSize.z);

      radius = maxSize * 0.5 * this.overlay.radius;
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

  setActive() {
    if (!this.natehub.active || `${this.name}Active` !== this.natehub.active.name) {
      const radius = this.boundingRadius();
      const position = this.getOverlayPosition();
      const rotation = this.mesh.rotation.y;
      const lookAt = this.mesh.position;
      this.addActive(radius, position, rotation, lookAt);
    }
  }

  addActive(radius, position, rotation, lookAt) {
    radius = radius || 1;
    position = position || new Vector3();
    lookAt = lookAt || new Vector3();

    const name = `${this.name}Active`;

    const active = {
      name,
      target: this,
      mesh: new Mesh(
        new TorusBufferGeometry(radius, this.overlay.thickness, 32, 32),
        new MeshBasicMaterial({
          transparent: true,
          opacity: 0.3,
          color: new Color('#4287f5')
        })
      )
    };
    active.mesh.name = name;

    active.mesh.position.copy(position);
    active.mesh.rotation.y = rotation;
    active.mesh.lookAt(lookAt);

    this.natehub.removeActiveState();
    this.natehub.active = active;

    this.scene.add(this.natehub.active.mesh);
  }
}

export default Clickable;
