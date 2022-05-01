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

    const geometry = new THREE.CylinderGeometry(10, 10, 0.75, 32);
    const material = new THREE.MeshBasicMaterial({color: 0xffff00});
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.set(-2, -3, 0);
    this.nateHub.scene.add(cylinder);
  }

  light() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1); // soft white light
    this.nateHub.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.15);
    directionalLight.position.set(16, 36, -50);
    this.nateHub.scene.add(directionalLight);
  }
}
