import type * as THREE from 'three'
import type Instance from '../Instance'
import { injectable } from 'inversify'

interface Config {
  velocity: THREE.Vector3
  from: Instance
  to: Instance
}

export interface ICollisionController {
  handleCircularCollision: (config: Config) => void
  areColliding: (from: Instance, to: Instance) => boolean
}

@injectable()
export default class CollisionController implements ICollisionController {
  handleCircularCollision ({ from, to, velocity }: Config): void {
    const directionToSurface = from.body.position
      .clone()
      .sub(to.body.position)
      .normalize()
    const correctDistance =
      to.body.boundingSphere.radius + from.body.boundingSphere.radius
    const correctPosition = directionToSurface
      .multiplyScalar(correctDistance)
      .add(to.body.position)

    from.body.position.copy(correctPosition)

    // Reset the velocity
    velocity.set(0, 0, 0)
  }

  areColliding (from: Instance, to: Instance): boolean {
    const distance = from.body.position.distanceTo(to.body.position)
    const radiusFrom = from.body.boundingSphere.radius
    const radiusTo = to.body.boundingSphere.radius
    const sumOfRadii = radiusFrom + radiusTo
    return distance <= sumOfRadii
  }
}
