import type { EventManager } from 'src/systems'
import * as THREE from 'three'

interface Config {
  gravityDirection: THREE.Vector3
  sprite: THREE.Object3D<THREE.Object3DEventMap>
}

type XMovementDirections = 'left' | 'right'

export default class OrientationController {
  face: XMovementDirections = 'right'
  constructor (private readonly eventManager: EventManager) {
    this.eventManager.on('movementKeydown', this.handleMovementKeydown.bind(this))
  }

  alignWithGravity ({ gravityDirection, sprite }: Config): void {
    const fallDirection = gravityDirection.clone().normalize()
    const desiredUp = fallDirection.negate()
    const currentUp = new THREE.Vector3(0, 1, 0)
    currentUp.applyQuaternion(sprite.quaternion)
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      currentUp,
      desiredUp
    )
    // Apply the quaternion to the player's mesh to perform the rotation
    sprite.applyQuaternion(quaternion)
  }

  private handleMovementKeydown (key: XMovementDirections): void {
    this.face = key
  }

  getXOrientation (): number {
    if (this.face === 'right') return 1
    return -1
  }
}
