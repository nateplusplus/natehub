import * as THREE from 'three';
import { Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

// import GUI from 'lil-gui';

import * as TWEEN from '@tweenjs/tween.js';
import Hammer from 'hammerjs';

import NatehubModal from './NatehubModal';
import Cube from './Cube';
import Chair from './objects/Chair';
import InstagramIcon from './objects/InstagramIcon';
import PushinIcon from './objects/PushinIcon';
import LinkedInIcon from './objects/LinkedInIcon';
import Ghost from './objects/Ghost';

class NateHub {
  constructor(canvas) {
    this.canvas = canvas;

    this.mouse = new THREE.Vector2();
    this.mouseRaycaster = new THREE.Raycaster();
    this.clock = new THREE.Clock();

    this.hammertime = new Hammer(this.canvas);

    // this.gui = new GUI();

    this.breakpoints = {
      md: 768,
      lg: 1024,
      xlg: 1440
    };

    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.lightningTimer = 10;
  }

  setup() {
    customElements.define('natehub-modal', NatehubModal);

    this.setPoints();
    this.setupScene();
    this.light();
    this.addCube();
    this.addChair();
    this.addIgNateplusplus();
    this.addIgArtwork();
    this.addPushinIcon();
    this.addLinkedIn();
    this.addName();

    this.halloween();

    this.bindEvents();
    this.tick();
  }

  setPoints() {
    this.points = {
      start: new THREE.Vector3(90, 15, 0),
      home: new THREE.Vector3(60, 7, 12),
      code: new THREE.Vector3(42, 3.7, 0),
      artwork: new THREE.Vector3(-4.75, 2.34, 41.5)
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
    window.addEventListener('hashchange', this.goToHashPosition.bind(this));
    window.addEventListener('nbclick', this.handleNbClick.bind(this));

    this.hammertime.on('tap', this.handleTap.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMousemove.bind(this));
  }

  handleNbClick(e) {
    const { name } = e.detail;
    NateHub.closeAllModals();

    const object = this.getActiveObjects().find((item) => item.name === name);
    if (object) {
      object.handleClicked();
      object.setActive();
    }
  }

  handleTap(event) {
    this.mouse.x = (event.center.x / this.sizes.width) * 2 - 1;
    this.mouse.y = -(event.center.y / this.sizes.height) * 2 + 1;

    setTimeout(
      () => {
        const intersects = this.mouseRaycaster.intersectObjects(this.scene.children);
        const object = intersects[0]?.object;
        const clicked = object?.name ?? '';
        const name = NateHub.getObjectName(clicked);
        const isInteractive = this.getInteractiveObjects().includes(name);

        NateHub.closeAllModals();
        if (clicked && isInteractive) {
          if (name in this.cube.objects) {
            this.cube.objects[name]?.handleClicked();
            this.cube.objects[name].setActive();
          } else if (this.chair.interactive.includes(name)) {
            this.chair.handleClicked();
          } else if (object.parent.name === 'igNateplusplus') {
            this.igNateplusplus.handleClicked();
            this.igNateplusplus.setActive();
          } else if (object.parent.name === 'igArtwork') {
            this.igArtwork.handleClicked();
            this.igArtwork.setActive();
          } else if (this.pushinIcon.interactive.includes(name)) {
            this.pushinIcon.handleClicked();
            this.pushinIcon.setActive();
          } else if (this.linkedIn.interactive.includes(name)) {
            this.linkedIn.handleClicked();
            this.linkedIn.setActive();
          }
        }
      },
      100
    );
  }

  getInteractiveObjects() {
    return [
      ...this.cube.interactive,
      ...this.chair.interactive,
      ...this.igNateplusplus.interactive,
      ...this.igArtwork.interactive,
      ...this.pushinIcon.interactive,
      ...this.linkedIn.interactive
    ];
  }

  getActiveObjects() {
    return [
      ...Object.values(this.cube.objects),
      this.pushinIcon,
      this.igNateplusplus,
      this.igArtwork,
      this.linkedIn
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
      this.cube.objects[name].setActive();
    } else if (this.chair.interactive.includes(name)) {
      this.canvas.style.cursor = 'pointer';
    } else if (this.igNateplusplus.interactive.includes(name)) {
      this.canvas.style.cursor = 'pointer';
      this.igNateplusplus.setActive();
    } else if (this.igArtwork.interactive.includes(name)) {
      this.canvas.style.cursor = 'pointer';
      this.igArtwork.setActive();
    } else if (this.pushinIcon.interactive.includes(name)) {
      this.canvas.style.cursor = 'pointer';
      this.pushinIcon.setActive();
    } else if (this.linkedIn.interactive.includes(name)) {
      this.canvas.style.cursor = 'pointer';
      this.linkedIn.setActive();
    } else {
      this.canvas.style.cursor = 'auto';
      this.removeActiveState();
    }
  }

  removeActiveState() {
    if (this.active) {
      this.active.target.scene.remove(this.active.mesh);
      this.active.mesh.geometry.dispose();
      this.active.mesh.material.dispose();
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
              1100
            );
          },
          600
        );
      },
      (url, loaded, total) => {
        if (total > 1) {
          const progress = Math.round((loaded / total) * 1000) / 1000;
          progressBar.style.transform = `scaleX(${progress})`;
        }
      }
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
      alpha: true
    });

    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /**
     * Post processing
     */
    this.effectComposer = new EffectComposer(this.renderer);
    this.effectComposer.setSize(this.sizes.width, this.sizes.height);
    this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /**
     * Camera
     */
    this.camera = new THREE.PerspectiveCamera(25, this.getScreenAspectRatio(), 0.1, 1000);
    this.camera.position.copy(this.points.start);
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.minDistance = 10;
    this.controls.maxDistance = 150;

    /**
     * Render pass
     */
    const renderPass = new RenderPass(this.scene, this.camera);
    this.effectComposer.addPass(renderPass);
  }

  addName() {
    const greetings = [
      "Hello,\nI'm Nate.",
      'Happy\nHalloween!',
      'BEWARE\nOF GHOST',
      "Boo\ny'all!",
      'Watch\nfor BUGS!'
    ];

    const index = NateHub.getRandomIndex(greetings.length - 1);

    this.fontLoader.load(
      'fonts/helvetiker_bold.typeface.json',
      (font) => {
        const textGeo = new TextGeometry(greetings[index], {
          font,
          size: 0.4,
          height: 0.3,
          curveSegments: 6,
          bevelEnabled: true,
          bevelThickness: 0.01,
          bevelSize: 0.01,
          bevelOffset: 0,
          bevelSegments: 1
        });

        const textMaterial = new THREE.MeshStandardMaterial();

        const text = new THREE.Mesh(textGeo, textMaterial);

        text.position.x = 0.7;
        text.position.y = 2.7;
        text.position.z = -0.5;
        text.rotation.y = Math.PI * 0.5;
        text.rotation.x = Math.PI * -0.0955;

        this.scene.add(text);
      }
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
    // nameLight.color = new THREE.Color(0x009AFF);
    nameLight.color = new THREE.Color(0x00FF4B);
    this.scene.add(nameLight);

    nameLight.lookAt(-10, -9.5, -2.6);

    this.directionalLight = new THREE.DirectionalLight(0xAAAAAA, 0.45);
    this.directionalLight.position.set(0, 10, -10);
    this.scene.add(this.directionalLight);
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

  addIgArtwork() {
    this.igArtwork = new InstagramIcon(this, 'igArtwork', {
      position: new Vector3(-4.6, -3.46, 5.35),
      front: 'z',
      rotation: new Vector3(0, Math.PI * 0.5, 0)
    });
    this.igArtwork.add();
  }

  addIgNateplusplus() {
    this.igNateplusplus = new InstagramIcon(this, 'igNateplusplus', {
      position: new Vector3(1.12, -1.181, 1.115),
      rotation: new Vector3(0, Math.PI * -0.08, 0)
    });
    this.igNateplusplus.add();
  }

  halloween() {
    this.ghost = new Ghost(this, 'ghost', {
      position: new Vector3(-4.5, 0, 8)
    });
    this.ghost.add();

    this.rainTexture = this.textureLoader.load('/rain.png');

    this.rainCount = 2000;
    this.rainGeo = new THREE.BufferGeometry();
    const positions = [];
    const velocities = [];
    for (let i = 0; i < this.rainCount; i += 1) {
      positions.push(Math.random() * 100 - 50);
      positions.push(Math.random() * 200 - 100);
      positions.push(Math.random() * 100 - 50);

      velocities.push(0);
      velocities.push(0);
      velocities.push(0);
    }
    this.rainGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    this.rainGeo.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));

    const rainMaterial = new THREE.PointsMaterial({
      transparent: true,
      color: 0x99aaff,
      alphaMap: this.rainTexture,
      alphaTest: 0.001,
      size: 0.2,
      blending: THREE.AdditiveBlending,
      opacity: 0.5
    });
    this.rain = new THREE.Points(this.rainGeo, rainMaterial);
    this.scene.add(this.rain);
  }

  addPushinIcon() {
    this.pushinIcon = new PushinIcon(this, 'pushinIcon');
    this.pushinIcon.add();
  }

  addLinkedIn() {
    this.linkedIn = new LinkedInIcon(this, 'linkedIn');
    this.linkedIn.add();
  }

  static getRandomIndex(max) {
    return Math.round(Math.random() * max);
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
    const elapsedTime = this.clock.getElapsedTime();

    const ghostAngle = (-elapsedTime * 0.3) + 450;
    if (this.ghost.gltf) {
      this.ghost.gltf.scene.position.x = Math.cos(ghostAngle) * 10;
      this.ghost.gltf.scene.position.z = Math.sin(ghostAngle) * 10;
      this.ghost.gltf.scene.position.y = Math.sin(elapsedTime * 2.5);

      this.ghost.gltf.scene.rotation.y = -ghostAngle + (Math.PI * 0.5);
    }

    if (this.rainCount) {
      for (let i = 0; i < this.rainCount; i += 1) {
        const i3 = i * 3;
        this.rainGeo.attributes.position.array[i3 + 1] -= 0.66;
        this.rainGeo.attributes.position.array[i3 + 2] -= 0.33;

        const py = this.rainGeo.attributes.position.array[i3 + 1];
        if (py < -50) {
          this.rainGeo.attributes.position.array[i3 + 1] = Math.random() * 100 - 50;
        }

        const pz = this.rainGeo.attributes.position.array[i3 + 2];
        if (pz < -50) {
          this.rainGeo.attributes.position.array[i3 + 2] = Math.random() * 100 - 50;
        }
      }
    }
    this.rainGeo.attributes.position.needsUpdate = true;

    this.mouseRaycaster.setFromCamera(this.mouse, this.camera);

    this.controls.update();

    this.chair.update(deltaTime);
    this.igNateplusplus.update(deltaTime);
    this.igArtwork.update(deltaTime);
    this.pushinIcon.update(deltaTime);
    this.linkedIn.update(deltaTime);

    TWEEN.update(time);

    // Render
    // this.renderer.render(this.scene, this.camera);
    this.effectComposer.render();

    if (!this.flashing && Math.round(elapsedTime) % this.lightningTimer === 0) {
      this.flashing = true;
      this.canvas.style.background = `radial-gradient(circle at ${(Math.random() - 0.5) * 600}% ${(Math.random() - 0.5) * 600}%, rgba(164,186,209,1) 22%, rgba(18,26,40,1) 100%)`;

      setTimeout(() => {
        this.canvas.style.background = '';
      }, 100);

      setTimeout(() => {
        this.flashing = false;
        this.lightningTimer = Math.round(Math.random() * 15);
      }, Math.max(250, (Math.random() * 1200)));
    }

    // Call tick again on the next frame
    window.requestAnimationFrame(this.tick.bind(this));
  }
}

export default NateHub;
