import * as THREE from 'three';
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
      'ledStrip',
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
      'frame11',
    ];
  }

  load() {
    this.parent.gltfLoader.load(
      'natecube.glb',
      (gltf) => {
        this.scene = gltf.scene;
        const bbox = new THREE.Box3().setFromObject(this.scene);
        const modelSize = bbox.getSize(new THREE.Vector3());
        this.scene.position.y = modelSize.y * -0.5;
        this.parent.scene.add(this.scene);

        this.scene.traverse(this.setLayerMaterial.bind(this));

        this.objects.monitorDisplay = new Monitor(this, 'indeed');
        this.objects.monitorDisplay.add();

        this.objects.logoInstagram = new Clickable(this, 'logoInstagram');
        this.objects.logoLinkedin = new Clickable(this, 'logoLinkedin');
        this.objects.closedDelta = new Clickable(this, 'pushin');

        this.placeArtwork(this.scene.children);
      },
    );
  }

  loadMaterials() {
    const bakedTexture = this.parent.textureLoader.load('natecube-baked.jpg');
    bakedTexture.flipY = false;
    bakedTexture.encoding = THREE.sRGBEncoding;
    this.materials = {
      baked: new THREE.MeshBasicMaterial({ map: bakedTexture }),
      test: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
      ledStrip: new THREE.MeshBasicMaterial({ color: 0x009AFF }),
      closedDelta: new THREE.MeshBasicMaterial({ color: 0x010407 }),
      openDelta: new THREE.MeshBasicMaterial({ color: 0x219ebc }),
      logoLinkedin: new THREE.MeshBasicMaterial({ color: 0x000BD8 }),
      textCode: new THREE.MeshBasicMaterial({ color: 0x050108 }),
      logoInstagram: new THREE.MeshBasicMaterial({
        color: 0xed1850,
        transparent: true,
        opacity: 0.6,
      }),
      chairWheel1: new THREE.MeshBasicMaterial({ color: 0x000000 }),
      chairWheel2: new THREE.MeshBasicMaterial({ color: 0x000000 }),
      chairWheel3: new THREE.MeshBasicMaterial({ color: 0x000000 }),
      chairWheel4: new THREE.MeshBasicMaterial({ color: 0x000000 }),
      monitorBack: new THREE.MeshBasicMaterial({ color: 0x000000 }),
      monitorScreen: new THREE.MeshBasicMaterial({ color: 0x000000 }),
      monitorWindow: new THREE.MeshBasicMaterial({ color: 0x3063f2 }),
    };
  }

  setLayerMaterial(child) {
    switch (child.name) {
      case 'textArtwork':
        child.material.color.set(0xedf6f9);
        break;
      case 'chairBase':
      case 'textName':
        child.material.color.set(0xFAFAFA);
        child.material.roughness = 0;
        break;
      case 'chairSeat':
        child.material.color.set(0x747474);
        child.material.roughness = 0.66;
        break;
      case 'monitorStand':
        child.material.color.set(0x000000);
        child.material.roughness = 0.25;
        break;
      case 'chairPole':
        child.material.metalness = 0.5;
        child.material.roughness = 0.25;
        break;
      default:
        if (this.materials[child.name]) {
          child.material = this.materials[child.name];
        } else if (this.unbakedLayers.indexOf(child.name) > -1) {
          child.material = this.materials.test;
        } else {
          child.material = this.materials.baked;
        }
    }
  }

  placeArtwork(children) {
    const frames = children.filter((child) => child.name.startsWith('frame'));

    frames.forEach((frame) => {
      const artwork = new Artwork(this, frame);
      this[frame.name] = artwork;
      artwork.add();
    });
  }
}
