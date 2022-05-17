import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';

// import * as dat from 'lil-gui';
import * as TWEEN from '@tweenjs/tween.js';
import GUI from 'lil-gui';
import Hammer from 'hammerjs';

import Code from './code';
import Artwork from './artwork';
import Camera from './camera';

class NateHub {
  constructor() {
    this.canvas = document.querySelector('canvas.webgl');
    this.lastDeltaY = [0];
    this.points = [];

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

    this.materials = {
      flatWhite: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#CCCCCC'),
        roughness: 0.4,
      }),
    };

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

      const intersects = this.mouseRaycaster.intersectObjects(this.interactiveElements);
      if (intersects.length > 0 && intersects[0].object.name !== '') {
        this.canvas.style.cursor = 'pointer';
      } else if (this.canvas.style.cursor !== 'auto') {
        this.canvas.style.cursor = 'auto';
      }
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

      this.composer.setSize(this.sizes.width, this.sizes.height);
    });

    window.addEventListener('wheel', this.handleWheel.bind(this));

    const hammertime = new Hammer(this.canvas);
    hammertime.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });
    hammertime.on('panstart', this.handlePanStart.bind(this));
    hammertime.on('pan', this.handlePan.bind(this));
    hammertime.on('panend', this.handlePanEnd.bind(this));
    hammertime.on('tap', this.handleClick.bind(this));
  }

  handleClick(event) {
    let clicked;
    this.mouse.x = (event.center.x / this.sizes.width) * 2 - 1;
    this.mouse.y = -(event.center.y / this.sizes.height) * 2 + 1;

    const intersects = this.mouseRaycaster.intersectObjects(this.interactiveElements);

    this.outlinePass.selectedObjects = [];

    if (intersects.length > 0) {
      clicked = intersects[0].object?.parent;
      if (!clicked || clicked.name === '') {
        clicked = intersects[0].object;
      }
      this.outlinePass.selectedObjects.push(clicked);
    }

    this.points.forEach((point) => {
      point.element.classList.add('d-none');
      if (intersects.length > 0 && point.element.classList.contains(clicked.name)) {
        point.element.classList.remove('d-none');
      }
    });
  }

  handlePanStart(event) {
    this.lastDeltaY = [event.deltaY * -1, this.lastDeltaY[0]];
  }

  handlePan(event) {
    let deltaY = (event.deltaY - this.lastDeltaY[0]);
    if (deltaY !== 0) {
      deltaY *= -1;
    }

    if (event.deltaY !== this.lastDeltaY[0]) {
      this.lastDeltaY = [event.deltaY, this.lastDeltaY[0]];
      this.scroll(deltaY / 50);
    }
  }

  handlePanEnd(event) {
    const absVelocity = Math.abs(event.velocityY);
    const endY = Math.min(this.camera.position.y + ((this.lastDeltaY[1] * absVelocity) / 150), 0);

    const finalCameraPosition = new THREE.Vector3(
      this.camera.position.x,
      endY,
      this.camera.position.z,
    );

    const time = absVelocity * 200;

    const panTween = new TWEEN.Tween(this.camera.position)
      .to(finalCameraPosition, time);

    panTween.easing(TWEEN.Easing.Quadratic.Out);
    panTween.start();
  }

  handleWheel(event) {
    this.scroll(event.deltaY / 300);
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

    this.code = new Code(this);
    this.artwork = new Artwork(this);

    this.light();
    this.effects();
  }

  light() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1); // soft white light
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.15);
    directionalLight.position.set(16, 36, -50);
    this.scene.add(directionalLight);
  }

  effects() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.setSize(this.sizes.width, this.sizes.height);
    this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    this.outlinePass = new OutlinePass(
      new THREE.Vector2(this.sizes.width, this.sizes.height),
      this.scene,
      this.camera,
    );
    this.outlinePass.edgeStrength = 6;
    this.outlinePass.visibleEdgeColor = new THREE.Color('#36C9C6');
    this.composer.addPass(this.outlinePass);
  }

  tick(time) {
    // const elapsedTime = this.clock.getElapsedTime();

    this.mouseRaycaster.setFromCamera(this.mouse, this.camera);

    // Update tween
    TWEEN.update(time);

    this.points.forEach((point) => {
      const screenPosition = point.position.clone();
      screenPosition.project(this.camera);

      const screenX = screenPosition.x * this.sizes.width * 0.5;
      const screenY = -screenPosition.y * this.sizes.height * 0.5;

      point.element.style.transform = `translateX(${screenX}px) translateY(${screenY}px)`;
    });

    // Render
    // this.renderer.render(this.scene, this.camera);
    this.composer.render();

    // Call tick again on the next frame
    window.requestAnimationFrame(this.tick.bind(this));
  }
}

window.nateHub = new NateHub();
