import type * as THREE from 'three'
import type Instance from '../instance'

interface Config {
  velocity: THREE.Vector3
  from: Instance
  to: Instance
}

export default class CollisionController {
  handleCircularCollision ({ from, to, velocity }: Config): void {
    const directionToSurface = from.mesh.position
      .clone()
      .sub(to.mesh.position)
      .normalize()
    const correctDistance =
      to.geometry.parameters.radius + from.geometry.parameters.radius
    const correctPosition = directionToSurface
      .multiplyScalar(correctDistance)
      .add(to.mesh.position)

    from.mesh.position.copy(correctPosition)

    // Reset the velocity
    velocity.set(0, 0, 0)
  }

  areColliding (from: Instance, to: Instance): boolean {
    const distance = from.mesh.position.distanceTo(to.mesh.position)
    const radiusFrom = from.geometry.parameters.radius
    const radiusTo = to.geometry.parameters.radius
    const sumOfRadii = radiusFrom + radiusTo
    return distance <= sumOfRadii
  }
}
