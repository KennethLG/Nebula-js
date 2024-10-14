import * as THREE from 'three'
import { type IEventManager } from './EventManager'
import { type IKeyboardManager } from './KeyboardManager'

export interface IMovementController {
  handleXMovement: (
    quaternion: THREE.Quaternion,
    xVelocity: THREE.Vector3
  ) => THREE.Vector3
  handleJump: (gravityDirection: THREE.Vector3, velocity: THREE.Vector3) => void
}

export default class MovementController implements IMovementController {
  private readonly moveLeftKey = 'a'
  private readonly moveRightKey = 'd'
  private readonly jumpKey = 'w'
  private readonly jumpForce = 0.2
  private readonly moveVel = 0.01
  private readonly friction = 0.9

  constructor(
    private readonly keyboardManager: IKeyboardManager,
    private readonly eventManager: IEventManager
  ) { }


  handleXMovement(
    quaternion: THREE.Quaternion,
    xVelocity: THREE.Vector3
  ): THREE.Vector3 {
    const right = new THREE.Vector3(1, 0, 0)
    right.applyQuaternion(quaternion)

    if (this.keyboardManager.keys[this.moveRightKey]) {
      xVelocity.add(right.clone().normalize().multiplyScalar(this.moveVel))
      this.eventManager.emit('movementKeydown', 'right')
    } else if (this.keyboardManager.keys[this.moveLeftKey]) {
      xVelocity.add(right.clone().normalize().multiplyScalar(-this.moveVel))
      this.eventManager.emit('movementKeydown', 'left')
    } else {
      xVelocity.multiplyScalar(this.friction)
    }

    xVelocity.clampLength(0, 0.05)
    if (xVelocity.length() < 0.01) {
      xVelocity.set(0, 0, 0)
    }
    return xVelocity
  }

  handleJump(gravityDirection: THREE.Vector3, velocity: THREE.Vector3): void {
    if (this.keyboardManager.keys[this.jumpKey]) {
      const jumpDir = gravityDirection.negate().normalize()
      velocity.copy(jumpDir.multiplyScalar(this.jumpForce))
    }
  }
}
