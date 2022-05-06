import * as THREE from 'three';

export default class House {
  constructor(nateHub) {
    this.nateHub = nateHub;

    this.natehubMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#000000'),
    });

    this.office();
    this.light();
  }

  office() {
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
      'name.gltf',
      (gltf) => {
        gltf.scene.scale.set(2, 2, 2);
        gltf.scene.rotation.y = Math.PI * 0.002;
        gltf.scene.position.set(-0.15, 2.36, 2.15);
        this.nateHub.scene.add(gltf.scene);
      },
    );

    this.nateHub.gltfLoader.load(
      'pushin-logo.gltf',
      (gltf) => {
        gltf.scene.scale.set(0.2, 0.2, 0.2);
        gltf.scene.rotation.y = Math.PI * 0.6;
        gltf.scene.position.set(-0.5, -0.8, 1.8);
        this.nateHub.scene.add(gltf.scene);
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

        const flag = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(20, 8),
          new THREE.MeshBasicMaterial(),
        );
        flag.rotation.y = Math.PI * 0.5;
        flag.position.set(-2.05, -5.8, 0);
        this.nateHub.scene.add(flag);
      },
    );

    const platformGeometry = new THREE.CylinderGeometry(5.6, 5.6, 0.5, 60);
    const platformMaterial = new THREE.MeshStandardMaterial({
      color: 0xd0d0d0,
      roughness: 100,
      flatShading: false,
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.set(-2, -2.74, 0);
    this.nateHub.scene.add(platform);
  }

  light() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1); // soft white light
    this.nateHub.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.15);
    directionalLight.position.set(16, 36, -50);
    this.nateHub.scene.add(directionalLight);
  }
}
