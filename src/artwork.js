import * as THREE from 'three';
import { BoxBufferGeometry } from 'three';

export default class Artwork {
  constructor(nateHub) {
    this.nateHub = nateHub;
    this.wallX = -1.5;

    this.stairs();
  }

  stairs() {
    this.nateHub.gltfLoader.load(
      'stairs.gltf',
      (gltf) => {
        gltf.scene.position.set(this.wallX + 6, -15.5, 1);
        this.nateHub.scene.add(gltf.scene);
      },
    );

    const landscapeFrame = new THREE.Mesh(
      new BoxBufferGeometry(0.15, 1.5, 2.25),
      this.nateHub.materials.flatWhite,
    );

    const verticalFrame = new THREE.Mesh(
      new BoxBufferGeometry(0.15, 2.25, 1.5),
      this.nateHub.materials.flatWhite,
    );

    const squareFrame = new THREE.Mesh(
      new BoxBufferGeometry(0.15, 1, 1),
      this.nateHub.materials.flatWhite,
    );

    const frame1 = verticalFrame.clone();
    frame1.position.set(this.wallX, -10, -2);
    this.nateHub.scene.add(frame1);

    const frame2 = squareFrame.clone();
    frame2.position.set(this.wallX, -9.38, -0.5);
    this.nateHub.scene.add(frame2);

    const frame3 = squareFrame.clone();
    frame3.position.set(this.wallX, -10.63, -0.5);
    this.nateHub.scene.add(frame3);

    const frame4 = squareFrame.clone();
    frame4.position.set(this.wallX, -9.38, -3.5);
    this.nateHub.scene.add(frame4);

    const frame5 = landscapeFrame.clone();
    frame5.position.set(this.wallX, -7.88, -2.9);
    this.nateHub.scene.add(frame5);

    const frame6 = verticalFrame.clone();
    frame6.position.set(this.wallX, -7.5, -0.77);
    this.nateHub.scene.add(frame6);

    const frame7 = squareFrame.clone();
    frame7.position.set(this.wallX, -8.13, 0.73);
    this.nateHub.scene.add(frame7);
  }
}
