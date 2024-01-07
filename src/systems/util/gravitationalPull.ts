import type * as THREE from 'three'

export const gravityForce = 0.01

export const getGravity = (gravityDirection: THREE.Vector3): THREE.Vector3 => {
  return gravityDirection.multiplyScalar(gravityForce)
}

export const applyGravitationalPull = (
  gravityDirection: THREE.Vector3,
  velocity: THREE.Vector3
): void => {
  const gravityForce = getGravity(gravityDirection)
  velocity.add(gravityForce)
}
