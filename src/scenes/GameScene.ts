import type Bullet from '@/components/Bullet'
import Player from '@/components/Player'
import CollisionController from '@/components/Player/CollisionController'
import OrientationController from '@/components/Player/OrientationController'
import Ufo from '@/components/UFO'
import IScene from '@/entities/IScene'
import {
  type EventManager,
  KeyboardManager,
  MovementController, type SceneManager
} from '@/systems'
import type CameraController from '@/systems/CameraController'
import type GUI from '@/systems/GUI'
import type GameParams from '@/systems/GameParams'
import LevelGenerator from '@/systems/LevelGenerator'

export default class GameScene extends IScene {
  private readonly movementController: MovementController
  private readonly keyboardManager: KeyboardManager
  private readonly orientationController: OrientationController
  private readonly collisionController: CollisionController
  private levelGenerator: LevelGenerator
  private readonly cameraController: CameraController
  private player?: Player
  private readonly gameOverScreen: HTMLElement

  constructor (
    sceneManager: SceneManager,
    cameraController: CameraController,
    private readonly gameParams: GameParams,
    private readonly eventManager: EventManager,
    private readonly gui: GUI
  ) {
    super(sceneManager)
    this.keyboardManager = new KeyboardManager(this.eventManager)
    this.movementController = new MovementController(
      this.keyboardManager,
      this.eventManager
    )
    this.orientationController = new OrientationController(this.eventManager)
    this.collisionController = new CollisionController()
    this.levelGenerator = new LevelGenerator(cameraController.camera, this.sceneManager)
    this.cameraController = cameraController

    this.gameOverScreen = this.createGameOverScreen()
    this.changeGameOverScreenVisibility('hidden')
    this.eventManager.on('gameOver', () => {
      this.changeGameOverScreenVisibility('visible')
    })
    this.eventManager.on('keyup', () => {
      if (this.gameParams.gameOver && this.gameParams.canRestart) {
        this.gameRestart()
      }
    })
  }

  init (): void {
    this.levelGenerator = new LevelGenerator(this.cameraController.camera, this.sceneManager)
    const player = new Player(
      this.movementController,
      this.orientationController,
      this.collisionController,
      this.sceneManager,
      this.eventManager,
      this.gameParams
    )
    const ufo = new Ufo(player, this.sceneManager, this.gameParams)
    this.sceneManager.add(player)
    this.sceneManager.add(ufo)
    this.player = player
    this.cameraController.camera.position.setY(0)
  }

  update (): void {
    this.levelGenerator.update()
    this.updateCamera()
    this.removeOuterBullets()

    if (this.player != null) {
      this.checkGameEnd(this.player)
      this.teleportPlayer(this.player)
    }
  }

  private updateCamera (): void {
    const desiredPlayer = this.sceneManager.instances.find(inst => inst.name === 'Player')
    if (desiredPlayer == null) {
      throw new Error('No player found')
    }
    this.cameraController.follow = desiredPlayer.body.position
  }

  private checkGameEnd (player: Player): void {
    const { position: { y: cameraY }, bottom } = this.cameraController.camera
    if (player.body.position.y < (cameraY + bottom)) {
      this.gameParams.end()
    }
  }

  private teleportPlayer (player: Player): void {
    const { right, left, position: { x: cameraX } } = this.cameraController.camera
    if (player.body.position.x > (cameraX + right)) {
      player.body.position.setX(cameraX + left)
    }
    if (player.body.position.x < (cameraX + left)) {
      player.body.position.setX(cameraX + right)
    }
  }

  private removeOuterBullets (): void {
    const bullets = this.sceneManager.instances.filter(inst => inst.name === 'Bullet') as Bullet[]

    if (bullets.length === 0) return

    const { position: { y: cameraY }, top } = this.cameraController.camera

    bullets.forEach((bullet) => {
      if (bullet.body.position.y > (cameraY + top)) {
        this.sceneManager.destroy(bullet.id)
      }
    })
  }

  private changeGameOverScreenVisibility (visibility: 'visible' | 'hidden'): void {
    this.gameOverScreen.style.visibility = visibility
  }

  private createGameOverScreen (): HTMLElement {
    return this.gui.createText('GAME OVER<br><br>Press any key to restart', {
      left: '50%',
      top: '50%',
      textAlign: 'center',
      transform: 'translate(-50%, -50%)'
    })
  }

  private gameRestart (): void {
    this.changeGameOverScreenVisibility('hidden')

    this.sceneManager.destroyAll()
    this.gameParams.gameOver = false
    this.gameParams.canRestart = false
    this.init()
  }
}
