import * as THREE from 'three'
import Instance from '../instance'
import {
  SceneManager,
  applyGravitationalPull
} from '../../systems'
import type Planet from '../planet'
import type OrientationController from './OrientationController'
import type CollisionController from './CollisionController'
import type MovementController from '../../systems/MovementController'

export default class Player extends Instance {
  onGround = false
  gravity = new THREE.Vector3(0, 0, 0)
  xVel = new THREE.Vector3(0, 0, 0)
  yVel = new THREE.Vector3(0, 0, 0)
  velocity = new THREE.Vector3(0, 0, 0)
  planet: Planet
  gravityDirection = new THREE.Vector3(0, 0, 0)

  constructor (
    private readonly movementController: MovementController,
    private readonly orientationController: OrientationController,
    private readonly collisionController: CollisionController
  ) {
    super({
      name: 'Player',
      texturePath: 'player.png',
      position: new THREE.Vector3(5, 2, 0),
      geometry: new THREE.CircleGeometry(0.5)
    })
    this.planet = SceneManager.instances.find(
      (inst) => inst.name === 'Planet'
    ) as Planet
  }

  update (): void {
    this.gravityDirection = this.getGravityDirection(
      this.mesh.position,
      this.planet.mesh.position
    )
    this.onGround = this.collisionController.areColliding(this, this.planet)

    this.orientationController.alignWithGravity({
      gravityDirection: this.gravityDirection,
      mesh: this.mesh
    })
    if (!this.onGround) {
      applyGravitationalPull(
        this.gravityDirection,
        this.gravity
      )
    } else {
      this.collisionController.handleCircularCollision({
        from: this,
        to: this.planet,
        velocity: this.gravity
      })
      this.movementController.handleJump(this.gravityDirection, this.gravity)
    }
    this.movementController.handleXMovement(this.mesh.quaternion, this.xVel)
    this.applyForces()
    this.updateFacing()
  }

  private getGravityDirection (from: THREE.Vector3, to: THREE.Vector3): THREE.Vector3 {
    return new THREE.Vector3().subVectors(to, from).normalize()
  }

  private applyForces (): void {
    this.mesh.position.add(this.gravity)
    this.mesh.position.add(this.xVel)
  }

  private updateFacing (): void {
    const orientation = this.orientationController.getXOrientation()
    this.mesh.scale.x = orientation
  }
}
