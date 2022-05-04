import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import * as dat from 'lil-gui';
import * as TWEEN from '@tweenjs/tween.js';
import GUI from 'lil-gui';

import House from './house';
import Camera from './camera';

class NateHub {
  constructor() {
    this.canvas = document.querySelector('canvas.webgl');

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

    if ('ontouchstart' in window) {
      window.addEventListener('touchstart', this.handleTouchStart.bind(this));
      window.addEventListener('touchmove', this.handleTouchMove.bind(this));
      // window.addEventListener('touchend', this.handleTouchStart.bind(this));
    }
  }

  handleTouchStart(event) {
    // this.touchstartX = event.screenX;
    this.touchstartY = event.screenY;
  }

  // handleTouchEnd(event) {
  //   // this.touchendX = event.screenX;
  //   this.touchendY = event.screenY;
  // }

  handleTouchMove(event) {
    console.log(event);
  }

  handleWheel(event) {
    this.scroll(event.deltaY);
  }

  scroll(deltaY) {
    const position = this.camera.position.y - (deltaY / 600);
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
