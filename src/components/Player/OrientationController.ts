import * as THREE from 'three'

interface Config {
  gravityDirection: THREE.Vector3
  mesh: THREE.Mesh
}

export default class OrientationController {
  apply ({ gravityDirection, mesh }: Config) {
    const fallDirection = gravityDirection.clone().normalize()
    const desiredUp = fallDirection.negate()
    const currentUp = new THREE.Vector3(0, 1, 0)
    currentUp.applyQuaternion(mesh.quaternion)
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      currentUp,
      desiredUp
    )
    // Apply the quaternion to the player's mesh to perform the rotation
    mesh.applyQuaternion(quaternion)
  }
}
