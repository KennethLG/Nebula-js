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
import type GameParams from '@/systems/GameParams'
import LevelGenerator from '@/systems/LevelGenerator'

export default class GameScene extends IScene {
  private readonly movementController: MovementController
  private readonly keyboardManager: KeyboardManager
  private readonly orientationController: OrientationController
  private readonly collisionController: CollisionController
  private readonly levelGenerator: LevelGenerator
  private readonly cameraController: CameraController
  private player?: Player

  constructor (
    sceneManager: SceneManager,
    cameraController: CameraController,
    private readonly gameParams: GameParams,
    private readonly eventManager: EventManager
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
  }

  init (): void {
    const player = new Player(
      this.movementController,
      this.orientationController,
      this.collisionController,
      this.sceneManager,
      this.eventManager
    )
    const ufo = new Ufo(player, this.sceneManager)
    this.sceneManager.add(player)
    this.sceneManager.add(ufo)
    this.player = player
    // this.gui = new GUI()
  }

  update (): void {
    this.levelGenerator.update()
    this.updateCamera()

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
}
