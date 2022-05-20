import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

export default class Outlines {
  constructor(scene) {
    this.scene = scene;
    this.selectedObjects = [];
    this.selectedIndex = [];
    this.outlines = [];

    this.update();
  }

  update() {
    this.selectedIndex = this.selectedObjects.map((object) => object.uuid);
    this.removeOutlines();
    this.addOutlines();
  }

  removeOutlines() {
    if (this.outlines) {
      Object.values(this.outlines).forEach((outlineTarget) => {
        if (!this.selectedIndex || !this.selectedIndex.includes(outlineTarget.target.uuid)) {
          delete this.outlines[outlineTarget.target.uuid];
          this.scene.remove(outlineTarget.outline);
          outlineTarget.outline.geometry.dispose();
        }
      });
    }
  }

  addOutlines() {
    if (this.selectedObjects) {
      this.selectedObjects.forEach((object) => this.outline(object));
    }
  }

  outline(mesh) {
    if (this.outlines[mesh.uuid]) {
      // outline already exists
      return;
    }

    const bbox = new THREE.Box3().setFromObject(mesh);

    const bboxCenter = new THREE.Vector3();
    bbox.getCenter(bboxCenter);

    const high = {
      z: bbox.max.z + 0.25,
      y: bbox.max.y + 0.25,
    };

    const low = {
      z: bbox.min.z - 0.25,
      y: bbox.min.y - 0.25,
    };

    const thickeness = 0.15;

    const bboxShape = new THREE.Shape();
    // start at top-right and draw clockwise
    bboxShape.moveTo(high.z, high.y);

    bboxShape.lineTo(high.z, low.y);
    bboxShape.lineTo(low.z, low.y);
    bboxShape.lineTo(low.z, high.y);
    bboxShape.lineTo(high.z, high.y);

    const bboxHole = new THREE.Path();
    bboxHole.moveTo(high.z - thickeness, high.y - thickeness);

    bboxHole.lineTo(high.z - thickeness, low.y + thickeness);
    bboxHole.lineTo(low.z + thickeness, low.y + thickeness);
    bboxHole.lineTo(low.z + thickeness, high.y - thickeness);
    bboxHole.lineTo(high.z - thickeness, high.y - thickeness);

    bboxShape.holes.push(bboxHole);

    const extrudeSettings = {
      steps: 1,
      depth: 0.25,
      bevelEnabled: false,
    };

    const bboxGeometry = new THREE.ExtrudeBufferGeometry(bboxShape, extrudeSettings);
    bboxGeometry.center();

    const overlayMaterial = new THREE.MeshBasicMaterial();
    overlayMaterial.side = THREE.DoubleSide;
    overlayMaterial.transparent = true;
    overlayMaterial.opacity = 0.25;
    overlayMaterial.color = new THREE.Color('#5B90CD');

    const outline = new THREE.Mesh(
      bboxGeometry,
      overlayMaterial,
    );

    outline.rotation.y = Math.PI * 0.5;

    outline.position.set(
      bboxCenter.x,
      bboxCenter.y,
      bboxCenter.z,
    );

    outline.scale.set(0.2, 0.2, 0.2);

    const scaleTween = new TWEEN.Tween(outline.scale)
      .to(new THREE.Vector3(1, 1, 1), 300);

    scaleTween.easing(TWEEN.Easing.Quadratic.Out);
    scaleTween.start();

    this.outlines[mesh.uuid] = {
      target: mesh,
      outline,
    };

    this.scene.add(outline);
  }
}
