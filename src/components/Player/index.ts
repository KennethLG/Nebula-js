import * as THREE from 'three'
import Instance from '../Instance'
import {
  type SceneManager,
  applyGravitationalPull,
  type EventManager
} from '../../systems'
import type Planet from '../Planet'
import type OrientationController from './OrientationController'
import type CollisionController from './CollisionController'
import type MovementController from '../../systems/MovementController'
import AnimationController from './AnimationController'
import type ISprite from '@/entities/ISprite'
import Sprite from '../Sprite'
import { getNearestPlanet } from '@/systems/util/getNearestPlanet'

interface AnimationContext {
  xVel: THREE.Vector3
  dead: boolean
}
export default class Player extends Instance {
  onGround = false
  gravity = new THREE.Vector3(0, 0, 0)
  xVel = new THREE.Vector3(0, 0, 0)
  yVel = new THREE.Vector3(0, 0, 0)
  planet: Planet | undefined
  gravityDirection = new THREE.Vector3(0, 0, 0)
  dead = false
  private readonly sprite: ISprite
  private readonly animationController: AnimationController<AnimationContext>

  constructor (
    private readonly movementController: MovementController,
    private readonly orientationController: OrientationController,
    private readonly collisionController: CollisionController,
    private readonly sceneManager: SceneManager,
    private readonly eventManager: EventManager
  ) {
    const sprite = new Sprite({
      name: 'player.png',
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
        condition: (context) => context.xVel.lengthSq() === 0 && !context.dead
      },
      {
        name: 'running',
        sequence: [3, 4, 5],
        speed: 0.5,
        condition: (context) => context.xVel.lengthSq() !== 0 && !context.dead
      },
      {
        name: 'dead',
        sequence: [1],
        speed: 1,
        condition: (context) => context.dead
      }
    ], 'idle')

    this.eventManager.on('gameOver', () => {
      this.dead = true
    })
  }

  init (): void {

  }

  update (): void {
    this.planet = getNearestPlanet(this.sceneManager, this.body.position)
    this.gravityDirection = this.getGravityDirection(
      this.body.position,
      this.planet.body.position
    )
    this.moveX()
    this.manageOrientation()
    this.manageGrounding()
    this.applyForces()

    // animation
    this.animationController.update({
      xVel: this.xVel,
      dead: this.dead
    })
    this.sprite.update(this.sceneManager.gameParams.clock.getDelta())
  }

  private moveX (): void {
    if (this.dead) return
    this.movementController.handleXMovement(this.body.quaternion, this.xVel)
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
    if (this.dead) return
    this.movementController.handleJump(this.gravityDirection, this.gravity)
  }
}
