import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// import * as TWEEN from '@tweenjs/tween.js';
// import GUI from 'lil-gui';
// import Hammer from 'hammerjs';

class NateHub {
  constructor() {
    this.canvas = document.querySelector('canvas.webgl');
    this.interactiveElements = [];

    this.mouse = new THREE.Vector2();
    this.mouseRaycaster = new THREE.Raycaster();

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

    this.setupScene();
    this.light();
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
    this.gltfLoader = new GLTFLoader();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.camera = new THREE.PerspectiveCamera(25, this.getScreenAspectRatio(), 0.1, 1000);
    this.camera.position.set(4, 1, -4);
    this.controls = new OrbitControls(this.camera, this.canvas);
  }

  light() {
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.01); // soft white light
    this.scene.add(ambientLight);
  }

  cube() {
    const test = new THREE.Mesh(
      new THREE.BoxBufferGeometry(2, 2, 2, 2, 2, 2),
      new THREE.MeshBasicMaterial(),
    );
    this.scene.add(test);

    // this.cube = this.gltfLoader.load(
    //   'natecube.gltf',
    //   (gltf) => {
    //     const bbox = new THREE.Box3().setFromObject(gltf.scene);
    //     const modelSize = bbox.getSize(new THREE.Vector3());
    //     gltf.scene.position.y = modelSize.y * -0.5;
    //     this.scene.add(gltf.scene);
    //   },
    // );
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
