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
import AnimationController from './AnimationController'
import type ISprite from '@/entities/ISprite'
import Sprite from '../Sprite'

export default class Player extends Instance {
  onGround = false
  gravity = new THREE.Vector3(0, 0, 0)
  xVel = new THREE.Vector3(0, 0, 0)
  yVel = new THREE.Vector3(0, 0, 0)
  velocity = new THREE.Vector3(0, 0, 0)
  planet: Planet | undefined
  gravityDirection = new THREE.Vector3(0, 0, 0)
  private readonly sprite: ISprite
  private readonly animationController: AnimationController<{ xVel: THREE.Vector3 }>

  constructor (
    private readonly movementController: MovementController,
    private readonly orientationController: OrientationController,
    private readonly collisionController: CollisionController,
    private readonly sceneManager: SceneManager
  ) {
    const sprite = new Sprite({
      name: 'player-run-2.png',
      xTiles: 3,
      yTiles: 2
    })

    super({
      name: 'Player',
      position: new THREE.Vector3(5, 2, 0),
      radius: 0.5,
      mesh: sprite.sprite
    })

    this.sprite = sprite

    this.animationController = new AnimationController(this.sprite, [
      {
        name: 'idle',
        sequence: [0],
        speed: 1,
        condition: (context) => context.xVel.lengthSq() === 0
      },
      {
        name: 'running',
        sequence: [3, 4, 5],
        speed: 0.5,
        condition: (context) => context.xVel.lengthSq() !== 0
      }
    ], 'idle')
  }

  init (): void {

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

    // animation
    this.animationController.update({
      xVel: this.xVel
    })
    this.sprite.update(this.sceneManager.gameParams.clock.getDelta())
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
    if (orientation === -1 && !this.sprite.flipped) {
      this.sprite.flipHorizontally()
      return
    }

    if (orientation === 1 && this.sprite.flipped) {
      this.sprite.flipHorizontally()
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
    this.sprite.rotateFromQuaternion(this.body.quaternion)
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
