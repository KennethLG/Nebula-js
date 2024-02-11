import * as THREE from 'three'
import Instance from '../Instance'
import {
  type SceneManager,
  applyGravitationalPull
} from '../../systems'
import type Planet from '../Planet'
import type OrientationController from './OrientationController'
import type CollisionController from './CollisionController'
import type MovementController from '../../systems/MovementController'

export default class Player extends Instance {
  onGround = false
  gravity = new THREE.Vector3(0, 0, 0)
  xVel = new THREE.Vector3(0, 0, 0)
  yVel = new THREE.Vector3(0, 0, 0)
  velocity = new THREE.Vector3(0, 0, 0)
  planet: Planet | undefined
  gravityDirection = new THREE.Vector3(0, 0, 0)

  constructor (
    private readonly movementController: MovementController,
    private readonly orientationController: OrientationController,
    private readonly collisionController: CollisionController,
    private readonly sceneManager: SceneManager
  ) {
    super({
      name: 'Player',
      position: new THREE.Vector3(5, 2, 0),
      radius: 0.5,
      spriteName: 'player-run-2.png',
      xTiles: 3,
      yTiles: 2
    })
  }

  init (): void {
    this.body.sprite.loop([0], 1)
    // this.body.sprite.loop([3, 4, 5], 0.5)
  }

  update (): void {
    this.planet = this.getNearestPlanet()
    this.gravityDirection = this.getGravityDirection(
      this.body.position,
      this.planet.body.position
    )
    this.movementController.handleXMovement(this.body.quaternion, this.xVel)
    this.manageOrientation()
    this.manageGrounding()
    this.applyForces()
  }

  private getGravityDirection (from: THREE.Vector3, to: THREE.Vector3): THREE.Vector3 {
    return new THREE.Vector3().subVectors(to, from).normalize()
  }

  private applyForces (): void {
    this.body.position.add(this.gravity)
    this.body.position.add(this.xVel)
  }

  private updateFacing (): void {
    const orientation = this.orientationController.getXOrientation()
    if (orientation === -1 && !this.body.sprite.flipped) {
      this.body.sprite.flipHorizontally()
      return
    }

    if (orientation === 1 && this.body.sprite.flipped) {
      this.body.sprite.flipHorizontally()
    }
  }

  private getNearestPlanet (): Planet {
    const planets = this.sceneManager.instances.filter(inst => inst.name === 'Planet') as Planet[]

    const nearestPlanet = planets.reduce((nearest, planet) => {
      const nearestDistance = nearest.body.position.distanceTo(this.body.position) - nearest.boundingSphere.radius
      const currentDistance = planet.body.position.distanceTo(this.body.position) - planet.boundingSphere.radius
      return currentDistance < nearestDistance ? planet : nearest
    }, planets[0])

    return nearestPlanet
  }

  private manageOrientation (): void {
    this.orientationController.alignWithGravity({
      gravityDirection: this.gravityDirection,
      quaternion: this.body.quaternion
    })
    this.updateFacing()
    this.body.sprite.rotateFromQuaternion(this.body.quaternion)
  }

  private manageGrounding (): void {
    if (this.planet == null) return

    this.onGround = this.collisionController.areColliding(this, this.planet)
    if (!this.onGround) {
      applyGravitationalPull(
        this.gravityDirection,
        this.gravity
      )
      return
    }
    this.collisionController.handleCircularCollision({
      from: this,
      to: this.planet,
      velocity: this.gravity
    })
    this.movementController.handleJump(this.gravityDirection, this.gravity)
  }
}
