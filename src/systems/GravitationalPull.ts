import * as THREE from "three";
export default class GravitationalPull {
  static gravityForce = 0.01;

  static apply(
    gravityDirection: THREE.Vector3,
    velocity: THREE.Vector3
  ) {
    const gravityForce = this.getGravity(gravityDirection);
    velocity.add(gravityForce);
  }

  static getGravity(gravityDirection: THREE.Vector3) {
    return gravityDirection.multiplyScalar(this.gravityForce);
  }
}
