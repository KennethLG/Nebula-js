import * as THREE from 'three'
import Instance from '../Instance'
import {
  applyGravitationalPull
} from '../../systems'
import type Planet from '../Planet'
import AnimationController from './AnimationController'
import type ISprite from '@/entities/ISprite'
import Sprite from '../Sprite'
import { getNearestPlanet } from '@/systems/util/getNearestPlanet'
import type Explosion from '../UFO/explosion'
import { type IMovementController } from '../../systems/MovementController'
import { type IOrientationController } from './OrientationController'
import { type ICollisionController } from './CollisionController'
import { type ISceneManager } from '@/systems/SceneManager'
import { type IEventManager } from '@/systems/EventManager'
import { type IGameParams } from '@/systems/GameParams'
import { inject, injectable } from 'inversify'
import TYPES from '@/systems/DI/tokens'

interface AnimationContext {
  xVel: THREE.Vector3
  dead: boolean
}

export interface IPlayer extends Instance {
  onGround: boolean
  gravity: THREE.Vector3
  xVel: THREE.Vector3
  yVel: THREE.Vector3
  planet: Planet | undefined
  gravityDirection: THREE.Vector3
  dead: boolean
  explosionCollision: boolean
  controllable: boolean
}
@injectable()
export default class Player extends Instance implements IPlayer {
  onGround = false
  gravity = new THREE.Vector3(0, 0, 0)
  xVel = new THREE.Vector3(0, 0, 0)
  yVel = new THREE.Vector3(0, 0, 0)
  planet: Planet | undefined
  gravityDirection = new THREE.Vector3(0, 0, 0)
  dead = false
  explosionCollision = false
  controllable: boolean
  private readonly sprite: ISprite
  private readonly animationController: AnimationController<AnimationContext>
  private readonly onGameOverBound: () => void

  constructor (
    @inject(TYPES.IMovementController) private readonly movementController: IMovementController,
    @inject(TYPES.IOrientationController) private readonly orientationController: IOrientationController,
    @inject(TYPES.ICollisionController) private readonly collisionController: ICollisionController,
    @inject(TYPES.ISceneManager) private readonly sceneManager: ISceneManager,
    @inject(TYPES.IEventManager) private readonly eventManager: IEventManager,
    @inject(TYPES.IGameParams) private readonly gameParams: IGameParams,
    controllable: boolean,
    id?: number
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
      mesh: sprite.sprite,
      id
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
        condition: (context) => {
          console.log(this.id)
          return context.dead
        }
      }
    ], 'idle')
    this.onGameOverBound = this.onGameOver.bind(this)
    this.controllable = controllable
  }

  init (): void {
    this.eventManager.on('gameOver', this.onGameOverBound)
  }

  private onGameOver (): void {
    this.dead = true
  }

  update (): void {
    this.planet = getNearestPlanet(this.sceneManager, this.body.position)

    if (this.planet == null) return

    this.gravityDirection = this.getGravityDirection(
      this.body.position,
      this.planet.body.position
    )

    if (this.controllable) {
      this.moveX()
      this.manageJumping()
    }

    this.manageGrounding()
    this.manageOrientation()
    this.applyForces()

    // animation
    this.animationController.update({
      xVel: this.xVel,
      dead: this.dead
    })
    this.sprite.update(this.gameParams.clock.getDelta())

    this.checkDeath()
  }

  private moveX (): void {
    if (this.dead) return
    this.movementController.handleXMovement(this.body.quaternion, this.xVel)
  }
  
  private manageJumping (): void {
    if (this.dead || !this.onGround) return;
    this.movementController.handleJump(this.gravityDirection, this.gravity)
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
  }

  private getCollidingExplosion (): Explosion | undefined {
    const explosions = this.sceneManager.instances.filter(inst => inst.name === 'Explosion') as Explosion[]

    if (explosions.length === 0) return

    const collidingExplosion = explosions.find(explosion => {
      return this.body.position.distanceTo(explosion.body.position) < (explosion.radius + 1)
    })

    return collidingExplosion
  }

  private checkDeath (): void {
    const explosion = this.getCollidingExplosion()
    this.explosionCollision = explosion != null
  }

  onDestroy (): void {
    this.eventManager.off('gameOver', this.onGameOverBound)
  }
}
