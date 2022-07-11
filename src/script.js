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

    const cameraFolder = this.gui.addFolder('Camera');

    cameraFolder.add(this.camera.position, 'x', -100, 100, 0.001);
    cameraFolder.add(this.camera.position, 'y', -100, 100, 0.001);
    cameraFolder.add(this.camera.position, 'z', -100, 100, 0.001);
  }

  light() {
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.01);
    this.scene.add(ambientLight);
  }

  loadMaterials() {
    const bakedTexture = this.textureLoader.load('natecube-baked.jpg');
    bakedTexture.flipY = false;
    bakedTexture.encoding = THREE.sRGBEncoding;
    this.materials = {
      baked: new THREE.MeshBasicMaterial({ map: bakedTexture }),
      test: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
      Cube001: new THREE.MeshBasicMaterial({ color: 0x001DE7 }),
    };
  }

  cube() {
    const test = [
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

        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            if (this.materials[child.name]) {
              child.material = this.materials[child.name];
            } else if (test.indexOf(child.name) > -1) {
              child.material = this.materials.test;
            } else {
              child.material = this.materials.baked;
            }
          }
        });
      },
    );
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
