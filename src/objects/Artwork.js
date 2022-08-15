import {
  Box3, Vector3, RepeatWrapping, Mesh, PlaneBufferGeometry, MeshBasicMaterial,
} from 'three';
import Clickable from './Clickable';

class Artwork extends Clickable {
  constructor(parent, frame) {
    super(parent, frame.name);
    this.front = 'z';
    this.frame = frame;

    const bbox = new Box3().setFromObject(frame);
    this.frameSize = bbox.getSize(new Vector3());

    const index = +frame.name.match(/\d+/) - 1;

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
      'gold',
    ];

    this.name = artwork[index] ?? artwork[0];
    this.setData();
  }

  add() {
    this.parent.parent.textureLoader.load(`artwork/${this.name}.jpg`, (texture) => {
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;
      texture.repeat.set(1, 1);

      const artAspect = texture.image.height / texture.image.width;

      const width = this.frameSize.x;
      const height = this.frameSize.x * artAspect;

      const canvas = new Mesh(
        new PlaneBufferGeometry(width, height, 1, 1),
        new MeshBasicMaterial({ map: texture }),
      );

      let resize = 1;
      if (this.frameSize.y < canvas.geometry.parameters.height) {
        resize = this.frameSize.y / canvas.geometry.parameters.height;
      } else if (this.frameSize.x < canvas.geometry.parameters.width) {
        resize = this.frameSize.x / canvas.geometry.parameters.width;
      }
      canvas.scale.set(resize, resize, 1);

      canvas.position.set(
        this.frame.position.x,
        this.frame.position.y,
        5.48,
      );

      canvas.name = this.name;

      this.parent.scene.add(canvas);
    });
  }
}

export default Artwork;
