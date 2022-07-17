import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

import GUI from 'lil-gui';
// import * as TWEEN from '@tweenjs/tween.js';
// import Hammer from 'hammerjs';

class NateHub {
  constructor() {
    this.canvas = document.querySelector('canvas.webgl');
    this.interactiveElements = [];

    this.mouse = new THREE.Vector2();
    this.mouseRaycaster = new THREE.Raycaster();

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
      flatWhite: new THREE.MeshStandardMaterial(),
      baked: new THREE.MeshBasicMaterial({ map: bakedTexture }),
      test: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
      Cube001: new THREE.MeshBasicMaterial({ color: 0x009AFF }),
    };
    this.materials['closed-delta'] = new THREE.MeshBasicMaterial({ color: 0x010407 });
    this.materials['open-delta'] = new THREE.MeshBasicMaterial({ color: 0x219ebc });
    this.materials['log-linkedin'] = new THREE.MeshBasicMaterial({ color: 0x000BD8 });
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
      'log-linkedin',
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
      'Cube001',
    ];

    this.cube = this.gltfLoader.load(
      'natecube.glb',
      (gltf) => {
        const bbox = new THREE.Box3().setFromObject(gltf.scene);
        const modelSize = bbox.getSize(new THREE.Vector3());
        gltf.scene.position.y = modelSize.y * -0.5;
        this.scene.add(gltf.scene);

        gltf.scene.traverse(this.setLayerMaterial.bind(this));

        this.addMonitorScreen();

        this.placeArtwork(gltf.scene.children);
      },
    );
  }

  setLayerMaterial(child) {
    switch (child.name) {
      case 'text-artwork001':
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

  addMonitorScreen() {
    const indeed = this.textureLoader.load('i-help-people-get-jobs-bg.png');
    this.monitorScreen = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2.33, 1.33),
      new THREE.MeshBasicMaterial({
        map: indeed,
      }),
    );
    this.monitorScreen.rotation.y = Math.PI * 0.5;
    this.monitorScreen.position.set(1.04, -0.3, -1.6);
    this.scene.add(this.monitorScreen);
  }

  placeArtwork(children) {
    const artwork = {
      casa: this.textureLoader.load('artwork/casa.png'),
    };
    // console.log(artwork.casa.image);
    // const aspect = artwork.casa.image.naturalHeight / artwork.casa.image.naturalWidth;
    artwork.casa.wrapS = THREE.RepeatWrapping;
    artwork.casa.wrapT = THREE.RepeatWrapping;
    artwork.casa.repeat.set(1, 1);

    const frames = children.filter((child) => child.name.startsWith('frame-'));

    frames.forEach((frame) => {
      const bbox = new THREE.Box3().setFromObject(frame);
      const frameSize = bbox.getSize(new THREE.Vector3());

      const canvas = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(frameSize.x * 0.9, frameSize.y * 0.9, 2, 2),
        new THREE.MeshBasicMaterial({
          map: artwork.casa,
        }),
      );

      // console.log(frame.position.z)

      const positionY = frame.position.y + frame.parent.position.y;
      canvas.position.set(frame.position.x, positionY, 5.45);

      this.scene.add(canvas);
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
