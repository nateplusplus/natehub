import * as THREE from 'three';
import { Vector3 } from 'three';

import Clickable from './Clickable';

class PushInIcon extends Clickable {
  constructor(parent, name) {
    super(parent, name);
    this.front = 'x';

    this.interactive = [
      'openDelta',
      'closedDelta'
    ];

    this.overlay = {
      radius: 1.7,
      thickness: 0.16
    };
  }

  add() {
    this.parent.gltfLoader.load(
      'pushinIcon.glb',
      (gltf) => {
        this.gltf = gltf;
        this.gltf.scene.position.copy(new Vector3(1.356, -2.2, 1.845));
        this.gltf.scene.rotation.y = Math.PI * -0.08;

        this.parent.scene.add(this.gltf.scene);

        this.mesh = this.gltf.scene.children.find((item) => item.name === this.interactive[0]);

        this.mixer = new THREE.AnimationMixer(this.gltf.scene);

        super.add();
      }
    );
  }

  handleClicked() {
    super.handleClicked();

    this.gltf.animations.forEach((animation) => {
      this.action = this.mixer.clipAction(animation);
      this.action.repetitions = 0;
      this.action.play().reset();
    });
  }
}

export default PushInIcon;
