import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

export default class Code {
  constructor(nateHub) {
    this.nateHub = nateHub;

    this.office();
  }

  office() {
    this.nateHub.fontLoader.load('fonts/helvetiker_bold.typeface.json', (font) => {
      const textGeometry = new TextGeometry('<code>', {
        font,
        size: 0.5,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      });

      const textMesh = new THREE.Mesh(
        textGeometry,
        new THREE.MeshNormalMaterial(),
      );
      // const textMesh = new THREE.Mesh(textGeometry, this.nateHub.materials.flatWhite);
      textMesh.rotation.y = Math.PI * 0.5;
      textMesh.position.set(-0.3, 2.36, 2.15);

      this.nateHub.scene.add(textMesh);
    });

    this.nateHub.gltfLoader.load(
      'desk.gltf',
      (gltf) => {
        const bbox = new THREE.Box3().setFromObject(gltf.scene);
        const modelSize = bbox.getSize(new THREE.Vector3());
        gltf.scene.position.z = 2.45;
        gltf.scene.position.y = modelSize.y * -0.5;
        this.nateHub.scene.add(gltf.scene);
      },
    );

    this.nateHub.gltfLoader.load(
      'chair.gltf',
      (gltf) => {
        gltf.scene.rotation.y = Math.PI * 0.98;
        this.nateHub.scene.add(gltf.scene);
        gltf.scene.scale.set(1.5, 1.5, 1.5);
        gltf.scene.position.set(-0.575, -3.13, -2.05);
      },
    );

    this.nateHub.gltfLoader.load(
      'pushin-logo.gltf',
      (gltf) => {
        gltf.scene.scale.set(0.2, 0.2, 0.2);
        gltf.scene.rotation.y = Math.PI * 0.6;
        gltf.scene.position.set(-0.5, -0.8, 1.8);
        gltf.scene.name = 'pushin';

        this.nateHub.scene.add(gltf.scene);

        const bbox = new THREE.Box3().setFromObject(gltf.scene);
        const sizes = bbox.getSize(new THREE.Vector3());

        this.nateHub.points.push({
          position: new THREE.Vector3(
            gltf.scene.position.x,
            gltf.scene.position.y + sizes.y,
            gltf.scene.position.z,
          ),
          element: document.querySelector(`.${gltf.scene.name}`),
        });

        this.nateHub.interactiveElements.push(gltf.scene);
      },
    );

    this.nateHub.gltfLoader.load(
      'logo-ig.gltf',
      (gltf) => {
        gltf.scene.name = 'ig-nateplusplus';
        gltf.scene.scale.set(0.7, 0.7, 0.7);
        gltf.scene.rotation.y = Math.PI * 0.5;
        gltf.scene.position.set(-0.575, 0.6, 2.15);

        this.nateHub.scene.add(gltf.scene);

        const bbox = new THREE.Box3().setFromObject(gltf.scene);
        const sizes = bbox.getSize(new THREE.Vector3());

        this.nateHub.points.push({
          position: new THREE.Vector3(
            gltf.scene.position.x,
            gltf.scene.position.y + sizes.y,
            gltf.scene.position.z,
          ),
          element: document.querySelector(`.${gltf.scene.name}`),
        });

        this.nateHub.interactiveElements.push(gltf.scene);
      },
    );

    this.nateHub.gltfLoader.load(
      'logo-linkedin.gltf',
      (gltf) => {
        gltf.scene.name = 'linkedin';
        gltf.scene.scale.set(0.8, 0.8, 0.8);
        // gltf.scene.rotation.y = Math.PI * 0.5;
        gltf.scene.position.set(-0.575, 1.83, 1.5);

        this.nateHub.scene.add(gltf.scene);

        const bbox = new THREE.Box3().setFromObject(gltf.scene);
        const sizes = bbox.getSize(new THREE.Vector3());

        this.nateHub.points.push({
          position: new THREE.Vector3(
            gltf.scene.position.x,
            gltf.scene.position.y + sizes.y,
            gltf.scene.position.z,
          ),
          element: document.querySelector(`.${gltf.scene.name}`),
        });

        this.nateHub.interactiveElements.push(gltf.scene);
      },
    );

    this.nateHub.gltfLoader.load(
      'monitor.gltf',
      (gltf) => {
        gltf.scene.rotation.y = Math.PI * -0.5;
        gltf.scene.position.set(-0.575, -0.82, -1.35);
        this.nateHub.scene.add(gltf.scene);

        const screenTexture = this.nateHub.textureLoader.load('i-help-people-get-jobs-bg.png');
        const screenMaterial = new THREE.MeshBasicMaterial();
        screenMaterial.map = screenTexture;
        const screen = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(2.35, 1.2),
          screenMaterial,
        );
        screen.rotation.y = Math.PI * 0.5;
        screen.position.set(-0.654, 1.116, -1.441);
        screen.name = 'indeed';

        const bbox = new THREE.Box3().setFromObject(gltf.scene);
        const sizes = bbox.getSize(new THREE.Vector3());

        this.nateHub.interactiveElements.push(screen);
        this.nateHub.points.push({
          position: new THREE.Vector3(
            gltf.scene.position.x,
            gltf.scene.position.y + sizes.y,
            gltf.scene.position.z,
          ),
          element: document.querySelector(`.${screen.name}`),
        });

        this.nateHub.scene.add(screen);
      },
    );

    this.nateHub.gltfLoader.load(
      'window.gltf',
      (gltf) => {
        gltf.scene.scale.set(0.8, 0.8, 0.8);
        gltf.scene.position.set(-2, -1.8, 0.25);
        gltf.scene.rotation.y = Math.PI * 0.5;
        this.nateHub.scene.add(gltf.scene);

        const backgroundTexture = this.nateHub.textureLoader.load('summit.png');
        const backgroundMaterial = new THREE.MeshBasicMaterial();
        backgroundMaterial.map = backgroundTexture;

        const background = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(9, 20),
          backgroundMaterial,
        );
        background.rotation.y = Math.PI * 0.5;
        background.position.set(-20, 10, -5);

        this.nateHub.scene.add(background);

        const bbox = new THREE.Box3().setFromObject(gltf.scene);
        const center = bbox.getCenter(new THREE.Vector3());

        const flagBottom = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(25, 16),
          new THREE.MeshBasicMaterial(),
        );
        flagBottom.rotation.y = Math.PI * 0.5;
        flagBottom.position.set(center.x, center.y - 12, center.z + 2);
        this.nateHub.scene.add(flagBottom);

        const flagRight = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(5, 12),
          new THREE.MeshBasicMaterial(),
        );
        flagRight.rotation.y = Math.PI * 0.5;
        flagRight.position.set(center.x + 0.05, center.y, center.z - 8);
        this.nateHub.scene.add(flagRight);

        const flagLeft = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(14, 14),
          new THREE.MeshBasicMaterial(),
        );
        flagLeft.rotation.y = Math.PI * 0.5;
        flagLeft.position.set(center.x + 0.05, center.y, center.z + 10);
        this.nateHub.scene.add(flagLeft);
      },
    );

    this.shapes();
  }

  shapes() {
    const platformGeometry = new THREE.BoxBufferGeometry(10, 0.5, 30);
    const platformMaterial = new THREE.MeshStandardMaterial({
      color: 0xd0d0d0,
      roughness: 100,
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.set(-2, -2.74, 0);
    platform.rotation.y = Math.PI * 0.15;
    this.nateHub.scene.add(platform);

    const leftBoxGeometry = new THREE.BoxBufferGeometry(8, 8, 8);
    const leftBoxMaterial = new THREE.MeshStandardMaterial({
      color: 0xd0d0d0,
      roughness: 100,
    });
    this.leftBoxRotationY = Math.PI * 0.189;
    this.leftBoxRotationZ = Math.PI * 0.164;
    this.leftBox = new THREE.Mesh(leftBoxGeometry, leftBoxMaterial);
    this.leftBox.position.set(-4, 2.75, 8);
    this.leftBox.rotation.x = Math.PI * 0.336;
    this.leftBox.rotation.y = this.leftBoxRotationY;
    this.leftBox.rotation.z = this.leftBoxRotationZ;

    this.nateHub.scene.add(this.leftBox);

    const rightBoxGeometry = new THREE.BoxBufferGeometry(8, 8, 8);
    const rightBoxMaterial = new THREE.MeshStandardMaterial({
      color: 0xd0d0d0,
      roughness: 100,
    });
    this.rightBox = new THREE.Mesh(rightBoxGeometry, rightBoxMaterial);
    this.rightBox.position.set(-1.309, 4, -9.914);
    this.rightBox.rotation.x = Math.PI * 0.239;

    this.nateHub.scene.add(this.rightBox);
  }

  update() {
    this.leftBox.rotation.y = Math.min(
      this.leftBoxRotationY - (this.nateHub.camera.position.y * 0.05),
      0.88,
    );
    this.leftBox.rotation.z = Math.max(
      this.leftBoxRotationZ + (this.nateHub.camera.position.y * 0.05),
      0.228,
    );

    this.rightBox.rotation.z = -this.nateHub.camera.position.y * 0.2;
  }
}
