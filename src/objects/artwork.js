import * as THREE from 'three';
import InteractiveObject from './interactiveObject';

class Artwork extends InteractiveObject {
  constructor(parent, frame) {
    super(parent, frame.name);

    this.frame = frame;

    const bbox = new THREE.Box3().setFromObject(frame);
    this.frameSize = bbox.getSize(new THREE.Vector3());

    const index = +frame.name.split('-')[1] - 1;

    const artwork = [
      'gold-sun',
      'garden-creature',
      'coqui-flamboyan',
      'owl-city',
      'summit',
      'thunder',
      'treasure',
      'casa',
      'tulip',
      'treehouse',
    ];

    this.name = artwork[index] ?? artwork[0];
  }

  add() {
    this.parent.textureLoader.load(`artwork/${this.name}.png`, (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);

      const artAspect = texture.image.height / texture.image.width;

      const width = this.frameSize.x;
      const height = this.frameSize.x * artAspect;

      const canvas = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(width, height, 2, 2),
        new THREE.MeshBasicMaterial({ map: texture }),
      );

      let resize = 1;
      if (this.frameSize.y < canvas.geometry.parameters.height) {
        resize = this.frameSize.y / canvas.geometry.parameters.height;
      } else if (this.frameSize.x < canvas.geometry.parameters.width) {
        resize = this.frameSize.x / canvas.geometry.parameters.width;
      }
      canvas.scale.set(resize, resize, 1);

      const positionY = this.frame.position.y + this.frame.parent.position.y;
      canvas.position.set(this.frame.position.x, positionY, 5.48);

      canvas.name = this.name;

      this.parent.scene.add(canvas);
    });
  }
}

export default Artwork;
