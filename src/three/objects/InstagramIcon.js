import * as THREE from 'three';
import Clickable from './Clickable';

class InstagramIcon extends Clickable {
  constructor(parent, name, settings) {
    super(parent, name, settings);
    this.front = 'x';

    this.interactive = [
      'circle',
      'icon'
    ];

    this.overlay = {
      radius: 5,
      thickness: 0.3
    };
  }

  add() {
    this.parent.gltfLoader.load(
      'instagramIcon.glb',
      (gltf) => {
        this.gltf = gltf;
        const scale = 0.333;

        this.gltf.scene.name = this.name;
        this.gltf.scene.scale.set(scale, scale, scale);
        this.gltf.scene.position.copy(this.position);
        this.gltf.scene.rotation.y = this.rotation.y;

        this.parent.scene.add(this.gltf.scene);

        this.mesh = this.gltf.scene.children.find((item) => item.name === 'icon');

        this.mixer = new THREE.AnimationMixer(this.gltf.scene);

        super.add();
      }
    );
  }

  handleClicked() {
    super.handleClicked();

    this.action = this.mixer.clipAction(this.gltf.animations[0]);
    this.action.repetitions = 0;

    this.action.play().reset();
  }
}

export default InstagramIcon;
