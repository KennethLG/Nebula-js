import Instance from "src/components/instance";
import * as THREE from "three";
export default class GravitationalPull {
  static apply(
    instance: Instance,
    instanceTo: Instance,
    velocity: THREE.Vector3
  ): THREE.Vector3 {
    const gravity = 0.01;
    const toInstanceCenter = new THREE.Vector3().subVectors(
      instanceTo.mesh.position,
      instance.mesh.position
    );

    // Gravity should pull towards the planet center
    const gravityDirection = toInstanceCenter.normalize();
    const gravityForce = gravityDirection.multiplyScalar(gravity);
    velocity.add(gravityForce);
    return gravityDirection;
  }
}
