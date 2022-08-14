import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

import GUI from 'lil-gui';
import * as TWEEN from '@tweenjs/tween.js';
import Hammer from 'hammerjs';

import NatehubModal from './NatehubModal';
import Monitor from './objects/Monitor';
import Clickable from './objects/Clickable';
import Artwork from './objects/Artwork';

class NateHub {
  constructor() {
    this.canvas = document.querySelector('canvas.webgl');
    customElements.define('natehub-modal', NatehubModal);

    this.mouse = new THREE.Vector2();
    this.mouseRaycaster = new THREE.Raycaster();

    this.hammertime = new Hammer(this.canvas);

    // this.gui = new GUI();

    this.breakpoints = {
      md: 768,
      lg: 1024,
      xlg: 1440,
    };

    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.points = {
      start: new THREE.Vector3(70, 10, 0),
      home: new THREE.Vector3(38, 6, 10),
      code: new THREE.Vector3(42, 3.7, 0),
      artwork: new THREE.Vector3(-4.75, 2.34, 41.5),
    };

    this.setupScene();
    this.light();
    this.loadMaterials();
    this.cube();
    this.bindEvents();
    this.tick();
  }

  getBreakpoint() {
    const windowWidth = this.sizes.width;
    let breakpoint = 'xsm';
    Object.keys(this.breakpoints).forEach((key) => {
      if (this.breakpoints[key] <= windowWidth) {
        breakpoint = key;
      }
    });

    return breakpoint;
  }

  getScreenAspectRatio() {
    const windowWidth = this.sizes.width;
    const windowHeight = this.sizes.height;
    return windowWidth / windowHeight;
  }

  bindEvents() {
    window.addEventListener('resize', this.handleResize.bind(this));

    this.hammertime.on('tap', this.handleTap.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMousemove.bind(this));
  }

  handleTap(event) {
    this.mouse.x = (event.center.x / this.sizes.width) * 2 - 1;
    this.mouse.y = -(event.center.y / this.sizes.height) * 2 + 1;

    setTimeout(
      () => {
        const intersects = this.mouseRaycaster.intersectObjects(this.scene.children);
        const clicked = intersects[0]?.object?.name ?? '';
        const name = NateHub.getObjectName(clicked);
        const isInteractive = this.interactive.includes(name);

        NateHub.closeAllModals();
        if (clicked && isInteractive && name in this) {
          this[name]?.handleClicked();
          this.setActive(name);
        }
      },
      100,
    );
  }

  static closeAllModals() {
    document.querySelectorAll('natehub-modal').forEach((modal) => modal.close());
  }

  static getObjectName(bboxName) {
    return bboxName.replace('Bbox', '');
  }

  handleMousemove(event) {
    this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
    this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;

    const intersects = this.mouseRaycaster.intersectObjects(this.scene.children);
    const hovered = intersects[0]?.object?.name ?? '';

    if (hovered && hovered.includes('Active')) {
      // Do nothing if we're hovering over the hover state itself
      return;
    }

    const name = NateHub.getObjectName(hovered);

    if (this.interactive.includes(name)) {
      this.canvas.style.cursor = 'pointer';
      this.setActive(name);
    } else {
      this.canvas.style.cursor = 'auto';
      this.removeActiveState();
    }
  }

  setActive(name) {
    if (!this.active || `${name}Active` !== this.active.name) {
      const radius = this[name].boundingRadius();
      const position = this[name].getOverlayPosition();
      const rotation = this[name].mesh.rotation.y;
      const lookAt = this[name].mesh.position;
      this.addActive(name, radius, position, rotation, lookAt);
    }
  }

  removeActiveState() {
    if (this.active) {
      this.cube.remove(this.active);
      this.active.geometry.dispose();
      this.active.material.dispose();
      this.active = null;
    }
  }

  handleResize() {
    // Update sizes
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;

    // Update camera
    this.camera.aspect = this.getScreenAspectRatio();
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  addActive(name, radius, position, rotation, lookAt) {
    radius = radius || 1;
    position = position || new THREE.Vector3();
    lookAt = lookAt || new THREE.Vector3();

    this.removeActiveState();

    this.active = new THREE.Mesh(
      new THREE.TorusBufferGeometry(radius, 0.15, 32, 32),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.3,
        color: new THREE.Color('#4287f5'),
      }),
    );
    this.active.position.copy(position);
    this.active.rotation.y = rotation;
    this.active.lookAt(lookAt);

    this.active.name = `${name}Active`;

    this.cube.add(this.active);
  }

  setupScene() {
    this.scene = new THREE.Scene();

    const loading = document.querySelector('.loading');
    const progressBar = document.querySelector('.loading__progress-bar');
    let loadingTimeout;

    this.loadingManager = new THREE.LoadingManager(
      () => {
        clearTimeout(loadingTimeout);

        loadingTimeout = setTimeout(
          () => {
            loading.classList.add('fade');
            progressBar.style = '';

            this.goToHashPosition();

            setTimeout(
              () => loading.classList.add('complete'),
              1100,
            );
          },
          600,
        );
      },
      (url, loaded, total) => {
        if (total > 1) {
          const progress = Math.round((loaded / total) * 1000) / 1000;
          progressBar.style.transform = `scaleX(${progress})`;
        }
      },
    );
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);

    // DRACO Loader
    this.dracoLoader = new DRACOLoader(this.loadingManager);
    this.dracoLoader.setDecoderPath('draco/');

    // GLTF Loader
    this.gltfLoader = new GLTFLoader(this.loadingManager);
    this.gltfLoader.setDRACOLoader(this.dracoLoader);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.camera = new THREE.PerspectiveCamera(25, this.getScreenAspectRatio(), 0.1, 1000);
    this.camera.position.copy(this.points.start);
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.minDistance = 10;
    this.controls.maxDistance = 150;
  }

  light() {
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.01);
    this.scene.add(ambientLight);

    const artworkLight = new THREE.SpotLight(0xffffff);
    artworkLight.position.set(4.6, 6.8, 7.8);
    artworkLight.angle = Math.PI * 0.15;
    artworkLight.intensity = 2;
    artworkLight.distance = 7;
    artworkLight.penumbra = 0.3;
    this.scene.add(artworkLight);

    const targetObject = new THREE.Object3D();
    targetObject.position.set(-5, -7, -1);
    this.scene.add(targetObject);

    artworkLight.target = targetObject;

    const monitorLight = new THREE.SpotLight(0x81A2FF, 0.9);
    monitorLight.position.set(1.05, -0.25, -1.6);
    monitorLight.distance = 3.75;
    monitorLight.penumbra = 0.3;
    this.scene.add(monitorLight);

    const monitorTarget = new THREE.Object3D();
    monitorTarget.position.set(10, -0.5, -1.3);
    this.scene.add(monitorTarget);

    monitorLight.target = monitorTarget;

    const nameLight = new THREE.RectAreaLight(0x81A2FF, 1.5);
    nameLight.position.set(2.17, 3.16, -1.14);
    nameLight.width = 5;
    nameLight.height = 1.7;
    nameLight.color = new THREE.Color(0x009AFF);
    this.scene.add(nameLight);

    nameLight.lookAt(-10, -9.5, -2.6);
  }

  loadMaterials() {
    const bakedTexture = this.textureLoader.load('natecube-baked.jpg');
    bakedTexture.flipY = false;
    bakedTexture.encoding = THREE.sRGBEncoding;
    this.materials = {
      baked: new THREE.MeshBasicMaterial({ map: bakedTexture }),
      test: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    };
    this.materials.ledStrip = new THREE.MeshBasicMaterial({ color: 0x009AFF });
    this.materials.closedDelta = new THREE.MeshBasicMaterial({ color: 0x010407 });
    this.materials.openDelta = new THREE.MeshBasicMaterial({ color: 0x219ebc });
    this.materials.logoLinkedin = new THREE.MeshBasicMaterial({ color: 0x000BD8 });
    this.materials.textCode = new THREE.MeshBasicMaterial({ color: 0x050108 });
    this.materials.logoInstagram = new THREE.MeshBasicMaterial({
      color: 0xed1850,
      transparent: true,
      opacity: 0.6,
    });
    this.materials.chairWheel1 = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.materials.chairWheel2 = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.materials.chairWheel3 = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.materials.chairWheel4 = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.materials.monitorBack = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.materials.monitorScreen = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.materials.monitorWindow = new THREE.MeshBasicMaterial({ color: 0x3063f2 });
  }

  cube() {
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

    this.gltfLoader.load(
      'natecube.glb',
      (gltf) => {
        this.cube = gltf.scene;
        const bbox = new THREE.Box3().setFromObject(this.cube);
        const modelSize = bbox.getSize(new THREE.Vector3());
        this.cube.position.y = modelSize.y * -0.5;
        this.scene.add(this.cube);

        this.cube.traverse(this.setLayerMaterial.bind(this));

        this.monitorDisplay = new Monitor(this, 'indeed');
        this.monitorDisplay.add();

        this.logoInstagram = new Clickable(this, 'logoInstagram');
        this.logoLinkedin = new Clickable(this, 'logoLinkedin');
        this.closedDelta = new Clickable(this, 'pushin');

        this.placeArtwork(this.cube.children);

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
      },
    );
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

  goToHashPosition() {
    const position = window.location.hash.replace('#', '');
    const target = this.points[position] ?? this.points.home;

    const panTween = new TWEEN.Tween(this.camera.position).to(target, 2000);
    panTween.easing(TWEEN.Easing.Quadratic.Out);
    panTween.start();
  }

  tick(time) {
    this.mouseRaycaster.setFromCamera(this.mouse, this.camera);

    this.controls.update();

    // Update tween
    TWEEN.update(time);

    // Render
    this.renderer.render(this.scene, this.camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(this.tick.bind(this));
  }
}

window.nateHub = new NateHub();
