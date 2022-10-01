import * as THREE from 'three';

import Clickable from './Clickable';

class Ghost extends Clickable {
  constructor(parent, name, settings) {
    super(parent, name, settings);
    this.front = 'x';

    this.interactive = [
      'ghost'
    ];
  }

  add() {
    this.parent.gltfLoader.load(
      'ghost.glb',
      (gltf) => {
        this.gltf = gltf;
        const scale = 0.8;

        this.gltf.scene.name = this.name;
        this.gltf.scene.scale.set(scale, scale, scale);
        this.gltf.scene.position.copy(this.position);

        this.parent.scene.add(this.gltf.scene);

        this.mixer = new THREE.AnimationMixer(this.gltf.scene);
      }
    );

    this.makeBoundingBox();
  }

  handleClicked() {
    // eslint-disable-next-line no-console
    console.log('Boo!', this);
  }
}

export default Ghost;
