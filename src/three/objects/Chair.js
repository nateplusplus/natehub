import * as THREE from 'three';
import { Vector3 } from 'three';

import * as TWEEN from '@tweenjs/tween.js';

import Clickable from './Clickable';

class Chair extends Clickable {
  constructor(parent) {
    super(parent, 'chair');
    this.front = 'x';

    this.interactive = [
      'seat',
      'pole',
      'base'
    ];

    this.seatAnimations = [
      'spinClockwise',
      'spinCounterClockwise'
    ];

    this.baseAnimations = [
      'swivelA',
      'swivelB'
    ];

    this.chairPositions = [
      new Vector3(3.117, -3.7, -1.2),
      new Vector3(3.6, -3.7, -2),
      new Vector3(3.6, -3.7, -0.5),
      new Vector3(2.8, -3.7, -0.5),
      new Vector3(2.8, -3.7, -2)
    ];
  }

  add() {
    this.parent.gltfLoader.load(
      'chair.glb',
      (gltf) => {
        this.gltf = gltf;
        const scale = 1.25;

        this.gltf.scene.scale.set(scale, scale, scale);
        this.gltf.scene.position.copy(this.chairPositions[0]);

        this.parent.scene.add(this.gltf.scene);

        this.mixer = new THREE.AnimationMixer(this.gltf.scene);
      }
    );

    this.makeBoundingBox();
  }

  handleClicked() {
    // Seat
    const seatClipName = this.seatAnimations[Chair.getRandomIndex(1)];
    const seatAnimation = this.gltf.animations.find((clip) => clip.name === seatClipName);
    this.seatAction = this.mixer.clipAction(seatAnimation);
    this.seatAction.repetitions = 0;

    // Base
    const baseAnimation = this.gltf.animations.find(
      (clip) => {
        let match = false;
        if (this.baseAction && this.baseAnimations.includes(clip.name)) {
          if (clip.name !== this.baseAction.getClip().name) {
            match = true;
            this.baseAction.stop();
          }
        } else {
          // default
          match = clip.name === 'swivelB';
        }
        return match;
      }
    );

    this.baseAction = this.mixer.clipAction(baseAnimation);
    this.baseAction.repetitions = 0;
    this.baseAction.clampWhenFinished = true;

    this.seatAction.play().reset();
    this.baseAction.play();

    const chairPosition = this.chairPositions[Chair.getRandomIndex(4)];

    const chairMoveTween = new TWEEN.Tween(this.gltf.scene.position).to(chairPosition, 750);
    chairMoveTween.easing(TWEEN.Easing.Quadratic.Out);
    chairMoveTween.start();
  }

  static getRandomIndex(max) {
    return Math.round(Math.random() * max);
  }
}

export default Chair;
