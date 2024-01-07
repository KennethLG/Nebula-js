import { type EventManager, type KeyboardManager } from 'src/systems'
import * as THREE from 'three'

export default class MovementController {
  private readonly moveLeftKey = 'a'
  private readonly moveRightKey = 'd'
  private readonly jumpKey = 'w'
  private readonly jumpForce = 0.1
  private readonly moveVel = 0.01
  private readonly friction = 0.95

  constructor (
    private readonly keyboardManager: KeyboardManager,
    private readonly eventManager: EventManager
  ) {}

  handleXMovement (
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

    xVelocity.clampLength(0, 0.1)
    if (xVelocity.length() < 0.01) {
      xVelocity.set(0, 0, 0)
    }
    return xVelocity
  }

  handleJump (gravityDirection: THREE.Vector3): THREE.Vector3 {
    let velocity = new THREE.Vector3()
    if (this.keyboardManager.keys[this.jumpKey]) {
      const jumpDir = gravityDirection.negate().normalize()
      velocity = jumpDir.multiplyScalar(this.jumpForce)
    }
    return velocity
  }
}
