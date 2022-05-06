import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import * as dat from 'lil-gui';
import * as TWEEN from '@tweenjs/tween.js';
import GUI from 'lil-gui';
import Hammer from 'hammerjs';

import House from './house';
import Camera from './camera';

class NateHub {
  constructor() {
    this.canvas = document.querySelector('canvas.webgl');
    this.lastDeltaY = 0;

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

    this.interactiveElements = [];
    this.focusableObjects = [];

    this.cameraController = new Camera(this);

    this.setupScene();

    this.scene.add(this.camera);

    this.mouse = new THREE.Vector2();
    this.mouseRaycaster = new THREE.Raycaster();
    this.mouseDown = false;
    this.interactiveDistance = 50;

    this.bindEvents();

    this.clock = new THREE.Clock();
    this.tick();
  }

  getBreakpoint() {
    const windowWidth = window.innerWidth;
    let breakpoint = 'xsm';
    Object.keys(this.breakpoints).forEach((key) => {
      if (this.breakpoints[key] <= windowWidth) {
        breakpoint = key;
      }
    });

    return breakpoint;
  }

  getScreenAspectRatio() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    return windowHeight / windowWidth;
  }

  bindEvents() {
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;
    });

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
    });

    window.addEventListener('wheel', this.handleWheel.bind(this));

    const hammertime = new Hammer(this.canvas);
    hammertime.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });
    hammertime.on('panstart', this.handlePanStart.bind(this));
    hammertime.on('pan', this.handlePan.bind(this));
    hammertime.on('panend', this.handlePanEnd.bind(this));
  }

  handlePanStart(event) {
    this.lastDeltaY = event.deltaY * -1;
  }

  handlePan(event) {
    let deltaY = (event.deltaY - this.lastDeltaY);
    if (deltaY !== 0) {
      deltaY *= -1;
    }

    this.scroll(deltaY / 50);

    this.lastDeltaY = event.deltaY;
  }

  handlePanEnd(event) {
    let deltaY = (event.deltaY - this.lastDeltaY);
    if (deltaY !== 0) {
      deltaY *= -1;
    }

    // const panTween = new TWEEN.Tween(this.cameraTarget.position).to(this.getHashTarget(), 1400);
    // panTween.easing(TWEEN.Easing.Quadratic.InOut);
    // panTween.start();
  }

  handleWheel(event) {
    this.scroll(event.deltaY / 600);
  }

  scroll(deltaY) {
    const position = this.camera.position.y - deltaY;
    this.camera.position.y = Math.max(Math.min(position, 0), -11);
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

    this.house = new House(this);
  }

  tick(time) {
    // const elapsedTime = this.clock.getElapsedTime();

    // this.mouseRaycaster.setFromCamera(this.mouse, this.camera);

    // Update tween
    TWEEN.update(time);

    // Render
    this.renderer.render(this.scene, this.camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(this.tick.bind(this));
  }
}

window.nateHub = new NateHub();
