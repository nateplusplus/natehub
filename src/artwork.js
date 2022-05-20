import * as THREE from 'three';

export default class Artwork {
  constructor(nateHub) {
    this.nateHub = nateHub;
    this.wallX = -1.5;

    this.paintings = [
      {
        name: 'garden-creature',
        frame: 'vertical',
        link: 'https://example.com',
        position: [-10, -2],
        dialog: {
          heading: 'Garden Creature',
          stats: 'garden creature stats...',
        },
      },
      {
        name: 'gold-sun',
        frame: 'square',
        link: 'https://example.com',
        position: [-9.38, -0.5],
        dialog: {
          heading: 'Gold Sun',
          stats: 'gold sun stats...',
        },
      },
      {
        name: 'coqui-flamboyan',
        frame: 'square',
        link: 'https://example.com',
        position: [-10.63, -0.5],
        dialog: {
          heading: 'Coquí Flamboyan',
          stats: 'coqui flamboyan stats...',
        },
      },
      {
        name: 'treehouse',
        frame: 'square',
        link: 'https://example.com',
        position: [-9.38, -3.5],
        dialog: {
          heading: 'Treehouse',
          stats: 'treehouse stats...',
        },
      },
      {
        name: 'treasure',
        frame: 'landscape',
        link: 'https://example.com',
        position: [-7.88, -2.9],
        dialog: {
          heading: 'Treasure',
          stats: 'treasure stats...',
        },
      },
      {
        name: 'tulip',
        frame: 'vertical',
        link: 'https://example.com',
        position: [-7.5, -0.77],
        dialog: {
          heading: 'Tulip',
          stats: 'tulip stats...',
        },
      },
      {
        name: 'thunder',
        frame: 'square',
        link: 'https://example.com',
        position: [-8.13, 0.73],
        dialog: {
          heading: 'Thunder',
          stats: 'thunder stats...',
        },
      },
      {
        name: 'summit',
        frame: 'largeSquare',
        link: 'https://example.com',
        position: [-10, 1.2],
        dialog: {
          heading: 'Summit',
          stats: 'summit stats...',
        },
      },
      {
        name: 'casa',
        frame: 'landscape',
        link: 'https://example.com',
        position: [-12.07, 1.08],
        dialog: {
          heading: 'Casa',
          stats: 'casa stats...',
        },
      },
      {
        name: 'owl-city',
        frame: 'vertical',
        link: 'https://example.com',
        position: [-11.26, 3.15],
        dialog: {
          heading: 'Owl City',
          stats: 'owl city stats...',
        },
      },
    ];

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

    this.paintings.forEach((painting) => this.makeFrame(painting));
  }

  frameTemplates() {
    this.makeTemplates(1.5, 2.25, 'landscape');
    this.makeTemplates(2.25, 1.5, 'vertical');
    this.makeTemplates(1, 1, 'square');
    this.makeTemplates(2.25, 2, 'largeSquare');
  }

  makeFrame({position, frame, name}) {
    const dialogTemplate = document.querySelector('#painting');
    const dialogElement = dialogTemplate.content.cloneNode(true);
    dialogElement.firstElementChild.classList.add(`painting-${name}`);
    document.body.appendChild(dialogElement);

    const frameType = `${frame}Frame`;
    const frameMesh = this[frameType].clone();
    frameMesh.position.set(this.wallX, position[0], position[1]);
    frameMesh.name = `painting-${name}`;
    this.nateHub.scene.add(frameMesh);

    const frameBox = new THREE.Box3().setFromObject(frameMesh);
    const frameSize = frameBox.getSize(new THREE.Vector3());

    this.nateHub.interactiveElements.push(frameMesh);
    this.nateHub.points.push({
      position: new THREE.Vector3(
        frameMesh.position.x,
        frameMesh.position.y + frameSize.y,
        frameMesh.position.z,
      ),
      element: document.querySelector(`.painting-${name}`),
    });

    const matteType = `${frame}Matte`;
    const matte = this[matteType].clone();
    matte.position.set(this.wallX, position[0], position[1]);
    this.nateHub.scene.add(matte);

    const imagePath = `artwork/${name}.png`;

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
