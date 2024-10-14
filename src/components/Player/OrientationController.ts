import TYPES from '@/systems/DI/tokens'
import { type IEventManager } from '@/systems/EventManager'
import * as THREE from 'three'

interface Config {
  gravityDirection: THREE.Vector3
  quaternion: THREE.Quaternion
}

type XMovementDirections = 'left' | 'right'

export interface IOrientationController {
  face: XMovementDirections
  alignWithGravity: (config: Config) => void
  getXOrientation: () => number
}

export default class OrientationController implements IOrientationController {
  face: XMovementDirections = 'right'
  constructor (
    private readonly eventManager: IEventManager
  ) {
    this.eventManager.on('movementKeydown', this.handleMovementKeydown.bind(this))
  }

  alignWithGravity ({ gravityDirection, quaternion }: Config): void {
    const fallDirection = gravityDirection.clone().normalize()
    const desiredUp = fallDirection.negate()
    const currentUp = new THREE.Vector3(0, 1, 0)
    currentUp.applyQuaternion(quaternion)
    const calculatedQuaternion = new THREE.Quaternion().setFromUnitVectors(
      currentUp,
      desiredUp
    )
    quaternion.multiply(calculatedQuaternion) // Apply the calculated quaternion
  }

  private handleMovementKeydown (key: XMovementDirections): void {
    this.face = key
  }

  getXOrientation (): number {
    if (this.face === 'right') return 1
    return -1
  }
}
