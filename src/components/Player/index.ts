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
import MovementController, { type IMovementController } from '../../systems/MovementController'
import OrientationController, { type IOrientationController } from './OrientationController'
import CollisionController, { type ICollisionController } from './CollisionController'
import { type ISceneManager } from '@/systems/SceneManager'
import { type IEventManager } from '@/systems/EventManager'
import { type IGameParams } from '@/systems/GameParams'

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
    private readonly sceneManager: ISceneManager,
    private readonly eventManager: IEventManager,
    private readonly gameParams: IGameParams,
    private readonly playerEvents: IEventManager,
    private readonly movementController: IMovementController,
    private readonly orientationController: IOrientationController,
    private readonly collisionController: ICollisionController,
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
          return context.dead
        }
      }
    ], 'idle')
    this.onGameOverBound = this.onGameOver.bind(this)
    this.controllable = controllable

    this.playerEvents.on('movementKeydown', () => {
      console.log('movementKeyDown')
      this.eventManager.emit('movementKeydown')
    })
  }

  init (): void {
    console.log('subscribe gameover')
    this.eventManager.on('gameOver', this.onGameOverBound)
  }

  private onGameOver (): void {
    console.log('onGameOver')
    this.dead = true
  }

  update (): void {
    console.log(this.dead)
    this.planet = getNearestPlanet(this.sceneManager, this.body.position)

    if (this.planet == null) return

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
    this.sprite.update(this.gameParams.clock.getDelta())

    this.checkDeath()
  }

  private moveX (): void {
    if (this.dead || !this.controllable) return
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
    if (this.dead || !this.controllable) return
    this.movementController.handleJump(this.gravityDirection, this.gravity)
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
