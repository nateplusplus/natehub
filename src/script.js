import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

import GUI from 'lil-gui';
import * as TWEEN from '@tweenjs/tween.js';
import Hammer from 'hammerjs';

import NatehubModal from './NatehubModal';
import Cube from './Cube';
import Chair from './objects/Chair';

class NateHub {
  constructor() {
    this.canvas = document.querySelector('canvas.webgl');
    customElements.define('natehub-modal', NatehubModal);

    this.mouse = new THREE.Vector2();
    this.mouseRaycaster = new THREE.Raycaster();
    this.clock = new THREE.Clock();

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

    this.setPoints();
    this.setupScene();
    this.light();
    this.addCube();
    this.addChair();
    this.addName();
    this.bindEvents();
    this.tick();
  }

  setPoints() {
    this.points = {
      start: new THREE.Vector3(90, 15, 0),
      home: new THREE.Vector3(60, 7, 12),
      code: new THREE.Vector3(42, 3.7, 0),
      artwork: new THREE.Vector3(-4.75, 2.34, 41.5),
    };

    if (this.sizes.width > 767) {
      this.points.home = new THREE.Vector3(38, 6, 10);
    }
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
        const isInteractive = this.getInteractiveObjects().includes(name);

        NateHub.closeAllModals();
        if (clicked && isInteractive) {
          if (name in this.cube.objects) {
            this.cube.objects[name]?.handleClicked();
            this.setActive(name);
          } else if (this.chair.interactive.includes(name)) {
            this.chair.handleClicked();
          }
        }
      },
      100,
    );
  }

  getInteractiveObjects() {
    return [
      ...this.cube.interactive,
      ...this.chair.interactive,
    ];
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

    if (this.cube.interactive.includes(name)) {
      this.canvas.style.cursor = 'pointer';
      this.setActive(name);
    } else if (this.chair.interactive.includes(name)) {
      this.canvas.style.cursor = 'pointer';
    } else {
      this.canvas.style.cursor = 'auto';
      this.removeActiveState();
    }
  }

  setActive(name) {
    if (!this.active || `${name}Active` !== this.active.name) {
      const radius = this.cube.objects[name].boundingRadius();
      const position = this.cube.objects[name].getOverlayPosition();
      const rotation = this.cube.objects[name].mesh.rotation.y;
      const lookAt = this.cube.objects[name].mesh.position;
      this.addActive(name, radius, position, rotation, lookAt);
    }
  }

  removeActiveState() {
    if (this.active) {
      this.cube.scene.remove(this.active);
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

    this.cube.scene.add(this.active);
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

    // Fonts
    this.fontLoader = new FontLoader(this.loadingManager);

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

  addName() {
    this.fontLoader.load(
      'fonts/helvetiker_bold.typeface.json',
      (font) => {
        const textGeo = new TextGeometry('Nate\nBlair', {
          font,
          size: 0.7,
          height: 0.4,
          curveSegments: 6,
          bevelEnabled: true,
          bevelThickness: 0.01,
          bevelSize: 0.01,
          bevelOffset: 0,
          bevelSegments: 1,
        });

        const textMaterial = new THREE.MeshStandardMaterial();

        const text = new THREE.Mesh(textGeo, textMaterial);

        text.position.x = 0.7;
        text.position.y = 3;
        text.position.z = -1;
        text.rotation.y = Math.PI * 0.5;
        text.rotation.x = Math.PI * -0.2;

        this.gui.add(text.rotation, 'x', Math.PI * -0.25, 0);

        this.scene.add(text);
      },
    );
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

  addCube() {
    this.cube = new Cube(this);
    this.cube.loadMaterials();
    this.cube.load();
  }

  addChair() {
    this.chair = new Chair(this);
    this.chair.add();
  }

  goToHashPosition() {
    const position = window.location.hash.replace('#', '');
    const target = this.points[position] ?? this.points.home;

    const panTween = new TWEEN.Tween(this.camera.position).to(target, 2000);
    panTween.easing(TWEEN.Easing.Quadratic.Out);
    panTween.start();
  }

  tick(time) {
    const deltaTime = this.clock.getDelta();

    this.mouseRaycaster.setFromCamera(this.mouse, this.camera);

    this.controls.update();

    this.chair.update(deltaTime);

    TWEEN.update(time);

    // Render
    this.renderer.render(this.scene, this.camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(this.tick.bind(this));
  }
}

window.nateHub = new NateHub();
