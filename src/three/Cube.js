import {
  Vector3, Box3, MeshBasicMaterial, sRGBEncoding
} from 'three';
import Artwork from './objects/Artwork';
import Clickable from './objects/Clickable';
import Monitor from './objects/Monitor';

export default class Cube {
  constructor(parent) {
    this.parent = parent;

    this.objects = {};

    this.unbakedLayers = [
      'textArtwork',
      'textName',
      'openDelta',
      'closedDelta',
      'chairPole',
      'monitorScreen',
      'monitorStand',
      'monitorBack',
      'monitorWindow',
      'chairBase',
      'chairSeat',
      'chairWheel1',
      'chairWheel2',
      'chairWheel3',
      'chairWheel4',
      'textCode',
      'logoInstagram',
      'logoLinkedin',
      'ledStrip'
    ];

    this.interactive = [
      'monitorDisplay',
      'logoInstagram',
      'logoLinkedin',
      'closedDelta',
      'frame1',
      'frame2',
      'frame3',
      'frame4',
      'frame5',
      'frame6',
      'frame7',
      'frame8',
      'frame9',
      'frame10',
      'frame11'
    ];
  }

  load() {
    this.parent.gltfLoader.load(
      'natecube.glb',
      (gltf) => {
        this.scene = gltf.scene;
        const bbox = new Box3().setFromObject(this.scene);
        const modelSize = bbox.getSize(new Vector3());
        this.scene.position.y = modelSize.y * -0.5;
        this.parent.scene.add(this.scene);

        this.scene.traverse(this.setLayerMaterial.bind(this));

        const textArtwork = this.scene.children.find((child) => child.name === 'textArtwork');
        textArtwork.material.color.set(0xedf6f9);

        this.objects.monitorDisplay = new Monitor(this, 'indeed');
        this.objects.monitorDisplay.add();

        this.objects.logoInstagram = new Clickable(this, 'logoInstagram');
        this.objects.logoLinkedin = new Clickable(this, 'logoLinkedin');
        this.objects.closedDelta = new Clickable(this, 'pushin');

        this.placeArtwork(this.scene.children);
      }
    );
  }

  loadMaterials() {
    const bakedTexture = this.parent.textureLoader.load('natecube-baked.jpg');
    bakedTexture.flipY = false;
    bakedTexture.encoding = sRGBEncoding;
    this.materials = {
      baked: new MeshBasicMaterial({ map: bakedTexture }),
      test: new MeshBasicMaterial({ color: 0xff0000 }),
      ledStrip: new MeshBasicMaterial({ color: 0x009AFF }),
      closedDelta: new MeshBasicMaterial({ color: 0x010407 }),
      openDelta: new MeshBasicMaterial({ color: 0x219ebc }),
      logoLinkedin: new MeshBasicMaterial({ color: 0x000BD8 }),
      textCode: new MeshBasicMaterial({ color: 0x050108 }),
      logoInstagram: new MeshBasicMaterial({
        color: 0xed1850,
        transparent: true,
        opacity: 0.6
      }),
      monitorBack: new MeshBasicMaterial({ color: 0x000000 }),
      monitorScreen: new MeshBasicMaterial({ color: 0x000000 }),
      monitorWindow: new MeshBasicMaterial({ color: 0x3063f2 })
    };
  }

  setLayerMaterial(child) {
    if (this.materials[child.name]) {
      child.material = this.materials[child.name];
    } else if (!this.unbakedLayers.includes(child.name)) {
      child.material = this.materials.baked;
    }
  }

  placeArtwork(children) {
    const frames = children.filter((child) => child.name.startsWith('frame'));

    frames.forEach((frame) => {
      const artwork = new Artwork(this, frame);
      this.objects[frame.name] = artwork;
      artwork.add();
    });
  }
}
