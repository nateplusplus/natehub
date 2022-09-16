import * as THREE from 'three';
import { Vector3 } from 'three';

import Clickable from './Clickable';

class LinkedInIcon extends Clickable {
  constructor(parent, name) {
    super(parent, name);
    this.front = 'x';

    this.interactive = [
      'logoLinkedin'
    ];

    this.overlay = {
      radius: 1.8,
      thickness: 0.12
    };
  }

  add() {
    this.parent.gltfLoader.load(
      'linkedInIcon.glb',
      (gltf) => {
        this.gltf = gltf;
        this.gltf.scene.position.copy(new Vector3(1.4, 0.19, 2.7));
        // this.gltf.scene.rotation.y = Math.PI * -0.08;

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

export default LinkedInIcon;
