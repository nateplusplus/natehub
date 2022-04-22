import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import * as dat from 'lil-gui';
import * as TWEEN from '@tweenjs/tween.js';

class NateHub {
  constructor() {
    this.canvas = document.querySelector('canvas.webgl');

    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.interactiveElements = [];
    this.focusableObjects = [];
    this.mouseDown = false;

    this.setPoints();
    this.setupScene();
    this.bindEvents();

    this.clock = new THREE.Clock();
    this.tick();
  }

  bindEvents() {
    const toggle = document.querySelector('.site-nav__toggle');
    toggle.addEventListener('click', (event) => {
      event.preventDefault();

      const menu = document.querySelector('.site-nav__list');

      if (menu.getBoundingClientRect().left >= 0) {
        this.canvas.setAttribute('tabindex', -1);
        this.canvas.focus();
      }
    });

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

      // Update renderer
      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    window.addEventListener('hashchange', (event) => {
      event.preventDefault();

      const targetTween = new TWEEN.Tween(this.cameraTarget.position);
      targetTween.to(this.getHashTarget(), 1400);
      targetTween.easing(TWEEN.Easing.Quadratic.InOut);
      targetTween.start();

      this.cameraPosition = this.getHashPosition();

      const positionTween = new TWEEN.Tween(this.camera.position).to(this.cameraPosition, 1400);
      positionTween.easing(TWEEN.Easing.Quadratic.InOut);
      positionTween.start();
    });

    this.canvas.addEventListener('mousedown', (event) => {
      this.mouseDown = event;
    });

    this.canvas.addEventListener('mousemove', (event) => {
      if (this.mouseDown) {
        const differenceX = event.clientX - this.mouseDown.clientX;
        const differenceY = event.clientY - this.mouseDown.clientY;

        if (Math.abs(differenceX) > 1 || Math.abs(differenceY) > 1) {
          this.mouseMove = event;
        }
      }
    });

    this.canvas.addEventListener('mousemove', () => {
      const intersects = this.mouseRaycaster.intersectObjects(this.interactiveElements);
      if (intersects.length > 0 && intersects[0].distance < this.interactiveDistance && intersects[0].object.name !== '') {
        this.canvas.style.cursor = 'pointer';
      } else if (this.canvas.style.cursor !== 'auto') {
        this.canvas.style.cursor = 'auto';
      }
    });
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
  }

  setPoints() {
    this.pointsOfInterest = {
      start: {
        target: new THREE.Vector3(0, 80, 0),
        position: new THREE.Vector3(400, 200, -400),
      },
    };
  }

  getHashTarget() {
    let targetPosition;
    const { hash } = window.location;
    const pointsOfInterestCopy = { ...this.pointsOfInterest };

    if (hash.length > 1) {
      const targetKey = hash.replace('#', '');
      if (targetKey in pointsOfInterestCopy) {
        targetPosition = pointsOfInterestCopy[targetKey].target;
      }
    }

    if (!targetPosition) {
      targetPosition = pointsOfInterestCopy.start.target;
    }

    return targetPosition;
  }

  getHashPosition() {
    let position;
    const { hash } = window.location;

    if (hash.length > 1) {
      const target = hash.replace('#', '');
      if (target in this.pointsOfInterest) {
        position = this.pointsOfInterest[target].position;
      }
    }

    if (!position) {
      position = this.pointsOfInterest.start.position;
    }

    return position;
  }

  tick(time) {
    const elapsedTime = this.clock.getElapsedTime();

    this.stars.rotation.y = elapsedTime * 0.01;

    // Update controls
    this.controls.update();

    this.mouseRaycaster.setFromCamera(this.mouse, this.camera);

    // Update tween
    TWEEN.update(time);

    // Render
    this.renderer.render(this.scene, this.camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(this.tick.bind(this));
  }
}

window.nateHub = new NateHub();
