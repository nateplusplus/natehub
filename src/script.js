import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

// import * as dat from 'lil-gui';
import * as TWEEN from '@tweenjs/tween.js';
// import GUI from 'lil-gui';
// import Hammer from 'hammerjs';

import Camera from './camera';

class NateHub {
  constructor() {
    this.canvas = document.querySelector('canvas.webgl');
    this.lastDeltaY = [0];
    this.points = [];
    this.hovered = null;
    this.clicked = null;
    this.interactiveElements = [];
    this.focusableObjects = [];

    this.mouse = new THREE.Vector2();
    this.mouseRaycaster = new THREE.Raycaster();
    this.clock = new THREE.Clock();

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

    this.materials = {
      flatWhite: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#CCCCCC'),
        roughness: 0.4,
      }),
    };

    this.setupScene();
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
    return windowHeight / windowWidth;
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      // Update sizes
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;

      // Update camera
      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera.updateProjectionMatrix();
      this.cameraController.setPosition();

      // Update renderer
      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      this.composer.setSize(this.sizes.width, this.sizes.height);
    });
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.textureLoader = new THREE.TextureLoader();
    this.loadingManager = new THREE.LoadingManager();
    this.gltfLoader = new GLTFLoader();
    this.fontLoader = new FontLoader();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.cube = this.gltfLoader.load(
      'natecube.gltf',
      (gltf) => {
        const bbox = new THREE.Box3().setFromObject(gltf.scene);
        const modelSize = bbox.getSize(new THREE.Vector3());
        gltf.scene.position.y = modelSize.y * -0.5;
        this.scene.add(gltf.scene);
      },
    );

    this.cameraController = new Camera(this);

    this.light();
    this.effects();
  }

  light() {
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.01); // soft white light
    this.scene.add(ambientLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(15, -36, 40);
    this.scene.add(backLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.5);
    keyLight.position.set(-36, 36, -40);
    this.scene.add(keyLight);
  }

  effects() {
    const renderTarget = new THREE.WebGLRenderTarget(
      800,
      600,
      {
        samples: this.renderer.getPixelRatio() === 1 ? 2 : 0,
      },
    );

    this.composer = new EffectComposer(this.renderer, renderTarget);
    this.composer.setSize(this.sizes.width, this.sizes.height);
    this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
    this.composer.addPass(gammaCorrectionPass);
  }

  tick(time) {
    this.mouseRaycaster.setFromCamera(this.mouse, this.camera);

    this.controls.update();

    // Update tween
    TWEEN.update(time);

    // Render
    this.composer.render();

    // Call tick again on the next frame
    window.requestAnimationFrame(this.tick.bind(this));
  }
}

window.nateHub = new NateHub();
