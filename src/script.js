import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

import GUI from 'lil-gui';
// import * as TWEEN from '@tweenjs/tween.js';
import Hammer from 'hammerjs';

import NatehubModal from './modal';
import Monitor from './objects/monitor';
import SocialLogo from './objects/social-logo';
import Artwork from './objects/artwork';

class NateHub {
  constructor() {
    this.canvas = document.querySelector('canvas.webgl');
    customElements.define('natehub-modal', NatehubModal);
    this.interactiveElements = [];

    this.mouse = new THREE.Vector2();
    this.mouseRaycaster = new THREE.Raycaster();

    this.hammertime = new Hammer(this.canvas);

    this.gui = new GUI();

    this.breakpoints = {
      md: 768,
      lg: 1024,
      xlg: 1440,
    };

    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
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

  interactiveObjects() {
    this.interactive = {
      'monitor-display': {
        onTap: this.monitor.handleClicked.bind(this.monitor),
      },
      'logo-ig': {
        onTap: this.logoIg.handleClicked.bind(this.logoIg),
      },
      'logo-linkedin': {
        onTap: this.linkedIn.handleClicked.bind(this.linkedIn),
      },
      'open-delta': {
        onTap: this.pushin.handleClicked.bind(this.pushin),
      },
      'closed-delta': {
        onTap: this.pushin.handleClicked.bind(this.pushin),
      },
      'gold-sun': {
        onTap: this['gold-sun'].handleClicked.bind(this['gold-sun']),
      },
      'garden-creature': {
        onTap: this['garden-creature'].handleClicked.bind(this['garden-creature']),
      },
      'coqui-flamboyan': {
        onTap: this['coqui-flamboyan'].handleClicked.bind(this['coqui-flamboyan']),
      },
      'owl-city': {
        onTap: this['owl-city'].handleClicked.bind(this['owl-city']),
      },
      summit: {
        onTap: this.summit.handleClicked.bind(this.summit),
      },
      thunder: {
        onTap: this.thunder.handleClicked.bind(this.thunder),
      },
      treasure: {
        onTap: this.treasure.handleClicked.bind(this.treasure),
      },
      casa: {
        onTap: this.casa.handleClicked.bind(this.casa),
      },
      tulip: {
        onTap: this.tulip.handleClicked.bind(this.tulip),
      },
      treehouse: {
        onTap: this.treehouse.handleClicked.bind(this.treehouse),
      },
    };
  }

  handleTap(event) {
    this.mouse.x = (event.center.x / this.sizes.width) * 2 - 1;
    this.mouse.y = -(event.center.y / this.sizes.height) * 2 + 1;

    setTimeout(
      () => {
        const intersects = this.mouseRaycaster.intersectObjects(this.scene.children);
        const clicked = intersects[0]?.object;

        NateHub.closeAllModals();
        if (clicked && typeof this.interactive[clicked.name] !== 'undefined') {
          this.interactive[clicked.name]?.onTap(clicked);
        }
      },
      100,
    );
  }

  static closeAllModals() {
    document.querySelectorAll('natehub-modal').forEach((modal) => modal.close());
  }

  handleMousemove(event) {
    this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
    this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;

    const intersects = this.mouseRaycaster.intersectObjects(this.scene.children);
    const hovered = intersects[0]?.object;

    if (hovered && typeof this.interactive[hovered.name] !== 'undefined') {
      this.canvas.style.cursor = 'pointer';
    } else {
      this.canvas.style.cursor = 'auto';
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

  setupScene() {
    this.scene = new THREE.Scene();
    this.textureLoader = new THREE.TextureLoader();
    this.loadingManager = new THREE.LoadingManager();

    // DRACO Loader
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('draco/');

    // GLTF Loader
    this.gltfLoader = new GLTFLoader();
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
    this.camera.position.set(38, 6, 10);
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.minDistance = 7.5;
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
  }

  loadMaterials() {
    const bakedTexture = this.textureLoader.load('natecube-baked.jpg');
    bakedTexture.flipY = false;
    bakedTexture.encoding = THREE.sRGBEncoding;
    this.materials = {
      baked: new THREE.MeshBasicMaterial({ map: bakedTexture }),
      test: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    };
    this.materials['led-strip'] = new THREE.MeshBasicMaterial({ color: 0x009AFF });
    this.materials['closed-delta'] = new THREE.MeshBasicMaterial({ color: 0x010407 });
    this.materials['open-delta'] = new THREE.MeshBasicMaterial({ color: 0x219ebc });
    this.materials['logo-linkedin'] = new THREE.MeshBasicMaterial({ color: 0x000BD8 });
    this.materials['text-code'] = new THREE.MeshBasicMaterial({ color: 0x050108 });
    this.materials['logo-ig'] = new THREE.MeshBasicMaterial({
      color: 0xed1850,
      transparent: true,
      opacity: 0.6,
    });
    this.materials['chair-wheel-1'] = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.materials['chair-wheel-2'] = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.materials['chair-wheel-3'] = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.materials['chair-wheel-4'] = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.materials['monitor-back'] = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.materials['monitor-screen'] = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.materials['monitor-window'] = new THREE.MeshBasicMaterial({ color: 0x3063f2 });
  }

  cube() {
    this.unbakedLayers = [
      'text-artwork001',
      'open-delta',
      'closed-delta',
      'chair-pole',
      'monitor-screen',
      'monitor-stand',
      'monitor-back',
      'monitor-window',
      'chair-base',
      'chair-seat',
      'chair-wheel-1',
      'chair-wheel-2',
      'chair-wheel-3',
      'chair-wheel-4',
      'text-code',
      'logo-ig',
      'logo-linkedin',
      'led-strip',
    ];

    this.cube = this.gltfLoader.load(
      'natecube.glb',
      (gltf) => {
        const bbox = new THREE.Box3().setFromObject(gltf.scene);
        const modelSize = bbox.getSize(new THREE.Vector3());
        gltf.scene.position.y = modelSize.y * -0.5;
        this.scene.add(gltf.scene);

        gltf.scene.traverse(this.setLayerMaterial.bind(this));

        this.monitor = new Monitor(this, 'indeed');
        this.monitor.add();

        this.logoIg = new SocialLogo(this, 'logo-ig');
        this.linkedIn = new SocialLogo(this, 'logo-linkedin');
        this.pushin = new SocialLogo(this, 'pushin');

        this.placeArtwork(gltf.scene.children);

        this.interactiveObjects();
      },
    );
  }

  setLayerMaterial(child) {
    switch (child.name) {
      case 'text-artwork':
        child.material.color.set(0xedf6f9);
        break;
      case 'chair-base':
        child.material.color.set(0xFAFAFA);
        child.material.roughness = 0;
        break;
      case 'chair-seat':
        child.material.color.set(0x747474);
        child.material.roughness = 0.66;
        break;
      case 'monitor-stand':
        child.material.color.set(0x000000);
        child.material.roughness = 0.25;
        break;
      case 'chair-pole':
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
    const frames = children.filter((child) => child.name.startsWith('frame-'));

    frames.forEach((frame) => {
      const artwork = new Artwork(this, frame);
      this[artwork.name] = artwork;
      artwork.add();
    });
  }

  tick(time) {
    this.mouseRaycaster.setFromCamera(this.mouse, this.camera);

    this.controls.update();

    // Update tween
    // TWEEN.update(time);

    // Render
    this.renderer.render(this.scene, this.camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(this.tick.bind(this));
  }
}

window.nateHub = new NateHub();
