import * as THREE from "three";
import { KeyboardManager } from ".";
import Player from "src/components/player";

export default class MovementController {
  private readonly moveSpeed = 0.005;
  private readonly jumpForce = 0.1;
  private readonly maxVelocity = 0.2;

  constructor(private readonly keyboardManager: KeyboardManager) {}

  apply(object: Player): void {
    const { velocity, gravity, onGround } = object;
    const moveLeftKey = "a";
    const moveRightKey = "d";
    const jumpKey = "w";

    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(object.mesh.quaternion);
    const right = new THREE.Vector3()
      .crossVectors(object.mesh.up, forward)
      .normalize();

    if (this.keyboardManager.keys[moveLeftKey]) {
      const moveLeft = right.clone().multiplyScalar(-this.moveSpeed);
      velocity.add(moveLeft);
    }
    if (this.keyboardManager.keys[moveRightKey]) {
      const moveRight = right.clone().multiplyScalar(this.moveSpeed);
      velocity.add(moveRight);
    }

    if (onGround && this.keyboardManager.keys[jumpKey]) {
      this.jump(gravity, velocity);
    }
    this.clampVelocity(velocity);
  }

  private jump(gravity: THREE.Vector3, velocity: THREE.Vector3) {
    const jumpDirection = gravity.clone().negate().normalize();
    velocity.add(jumpDirection.multiplyScalar(this.jumpForce));
  }

  private clampVelocity(velocity: THREE.Vector3) {
    if (velocity.lengthSq() > this.maxVelocity * this.maxVelocity) {
      velocity.clampLength(0, this.maxVelocity);
    }
  }
}
