import Player from '@/components/Player'
import CollisionController from '@/components/Player/CollisionController'
import OrientationController from '@/components/Player/OrientationController'
import IScene from '@/entities/IScene'
import {
  EventManager,
  KeyboardManager,
  MovementController, type SceneManager
} from '@/systems'
import type CameraController from '@/systems/CameraController'
import LevelGenerator from '@/systems/LevelGenerator'

export default class GameScene extends IScene {
  private readonly eventManager: EventManager
  private readonly movementController: MovementController
  private readonly keyboardManager: KeyboardManager
  private readonly orientationController: OrientationController
  private readonly collisionController: CollisionController
  private readonly levelGenerator: LevelGenerator
  private readonly cameraController: CameraController

  constructor (sceneManager: SceneManager, cameraController: CameraController) {
    super(sceneManager)
    this.eventManager = new EventManager()
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
    this.sceneManager.add(new Player(
      this.movementController,
      this.orientationController,
      this.collisionController,
      this.sceneManager
    ))
  }

  update (): void {
    this.levelGenerator.update()
    this.updateCamera()
  }

  updateCamera (): void {
    const desiredPlayer = this.sceneManager.instances.find(inst => inst.name === 'Player')
    if (desiredPlayer == null) {
      throw new Error('No player found')
    }
    this.cameraController.follow = desiredPlayer.body.position
  }
}
