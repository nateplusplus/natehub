import * as THREE from 'three';
import { Vector3 } from 'three';

import Clickable from './Clickable';

class InstagramIcon extends Clickable {
  constructor(parent, name) {
    super(parent, name);
    this.front = 'x';

    this.interactive = [
      'circle',
      'icon'
    ];
  }

  add() {
    this.parent.gltfLoader.load(
      'instagramIcon.glb',
      (gltf) => {
        this.gltf = gltf;
        const scale = 0.333;

        const guiScale = this.parent.gui.addFolder('scale');
        guiScale.add(this.gltf.scene.scale, 'x', 0.2, 2, 0.001);
        guiScale.add(this.gltf.scene.scale, 'y', 0.2, 2, 0.001);
        guiScale.add(this.gltf.scene.scale, 'z', 0.2, 2, 0.001);

        this.gltf.scene.scale.set(scale, scale, scale);
        this.gltf.scene.position.copy(new Vector3(1.12, -1.181, 1.115));

        const guiPosition = this.parent.gui.addFolder('position');
        guiPosition.add(this.gltf.scene.position, 'x', 1, 4, 0.001);
        guiPosition.add(this.gltf.scene.position, 'y', -3, 2, 0.001);
        guiPosition.add(this.gltf.scene.position, 'z', -2, 2, 0.001);

        this.parent.scene.add(this.gltf.scene);

        this.mixer = new THREE.AnimationMixer(this.gltf.scene);
      }
    );

    this.makeBoundingBox();
  }

  handleClicked() {
    super.handleClicked();

    this.action = this.mixer.clipAction(this.gltf.animations[0]);
    this.action.repetitions = 0;

    this.action.play().reset();
  }
}

export default InstagramIcon;
