import * as THREE from 'three';

export default class Artwork {
  constructor(nateHub) {
    this.nateHub = nateHub;
    this.wallX = -1.5;

    this.stairs();
  }

  stairs() {
    this.nateHub.gltfLoader.load(
      'stairs.gltf',
      (gltf) => {
        gltf.scene.position.set(this.wallX + 6, -15.5, 1);
        this.nateHub.scene.add(gltf.scene);
      },
    );

    this.frameTemplates();

    this.makeFrame(-10, -2, 'vertical', 'garden-creature');
    this.makeFrame(-9.38, -0.5, 'square', 'gold-sun');
    this.makeFrame(-10.63, -0.5, 'square', 'coqui-flamboyan');
    this.makeFrame(-9.38, -3.5, 'square', 'treehouse');
    this.makeFrame(-7.88, -2.9, 'landscape', 'treasure');
    this.makeFrame(-7.5, -0.77, 'vertical', 'tulip');
    this.makeFrame(-8.13, 0.73, 'square', 'thunder');
    this.makeFrame(-10, 1.2, 'largeSquare', 'summit');
    this.makeFrame(-12.07, 1.08, 'landscape', 'casa');
    this.makeFrame(-11.26, 3.15, 'vertical', 'owl-city');
  }

  frameTemplates() {
    this.makeTemplates(1.5, 2.25, 'landscape');
    this.makeTemplates(2.25, 1.5, 'vertical');
    this.makeTemplates(1, 1, 'square');
    this.makeTemplates(2.25, 2, 'largeSquare');
  }

  makeFrame(y, z, type, image) {
    const frameType = `${type}Frame`;
    const frame = this[frameType].clone();
    frame.position.set(this.wallX, y, z);
    this.nateHub.scene.add(frame);

    const matteType = `${type}Matte`;
    const matte = this[matteType].clone();
    matte.position.set(this.wallX, y, z);
    this.nateHub.scene.add(matte);

    const imagePath = `artwork/${image}.png`;

    this.nateHub.textureLoader.load(imagePath, (backgroundTexture) => {
      const aspect = backgroundTexture.image.height / backgroundTexture.image.width;
      const bbox = new THREE.Box3().setFromObject(matte);
      const matteSize = bbox.getSize(new THREE.Vector3());
      const matteOffset = 0.2;

      let newSize = {
        y: (matteSize.z - matteOffset) * aspect,
        z: matteSize.z - matteOffset,
      };
      if (aspect >= 1) {
        newSize = {
          y: matteSize.y - matteOffset,
          z: (matteSize.y - matteOffset) / aspect,
        };
      }

      const paintingMaterial = new THREE.MeshBasicMaterial();
      paintingMaterial.map = backgroundTexture;

      const painting = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(newSize.z, newSize.y),
        paintingMaterial,
      );
      painting.rotation.y = Math.PI * 0.5;
      painting.position.set(
        matte.position.x + 0.1,
        matte.position.y,
        matte.position.z,
      );

      this.nateHub.scene.add(painting);
    });
  }

  makeTemplates(y, z, type) {
    const frameX = 0.2;

    const matteMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#DDDDDD'),
      roughness: 0.4,
    });

    const frameType = `${type}Frame`;
    this[frameType] = new THREE.Mesh(
      new THREE.BoxBufferGeometry(frameX, y, z),
      this.nateHub.materials.flatWhite,
    );

    const matteType = `${type}Matte`;
    this[matteType] = this[frameType].clone();
    this[matteType].material = matteMaterial;
    this[matteType].scale.y -= 0.1;
    this[matteType].scale.z -= 0.1;
  }
}
