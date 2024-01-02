import { KeyboardManager } from "src/systems";
import Player from ".";
import * as THREE from "three";

export default class MovementController {
  private moveLeftKey = "a";
  private moveRightKey = "d";
  private jumpKey = "w";
  private jumpForce = 0.1;
  private moveVel = 0.01;
  private friction = .95;
  constructor(private readonly keyboardManager: KeyboardManager) {}

  handleXMovement(player: Player) {
    const right = new THREE.Vector3(1, 0, 0);
    if (this.keyboardManager.keys[this.moveRightKey]) {
      right.applyQuaternion(player.mesh.quaternion);
      player.xVel.add(right.clone().normalize().multiplyScalar(this.moveVel));
    } else if (this.keyboardManager.keys[this.moveLeftKey]) {
      right.applyQuaternion(player.mesh.quaternion);
      player.xVel.add(right.clone().normalize().multiplyScalar(-this.moveVel));
    } else {
      player.xVel.multiplyScalar(this.friction);
    }
    player.xVel.clampLength(0, .1);
    if (player.xVel.length() < 0.01) {
      player.xVel.set(0, 0, 0);
    }
  }
  
  handleJump(player: Player) {
    if (this.keyboardManager.keys[this.jumpKey]) {
      const jumpDir = player.gravityDirection.negate().normalize();
      this.jump(jumpDir, player.gravity);
    }
  }

  private jump(direction: THREE.Vector3, velocity: THREE.Vector3) {
    velocity.copy(direction.multiplyScalar(this.jumpForce));
  }
}