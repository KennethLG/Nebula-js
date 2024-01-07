import Player from '@/components/Player'
import CollisionController from '@/components/Player/CollisionController'
import OrientationController from '@/components/Player/OrientationController'
import Planet from '@/components/planet'
import IScene from '@/entities/IScene'
import {
  EventManager,
  KeyboardManager,
  MovementController,
  type SceneManager
} from '@/systems'
import * as THREE from 'three'

export default class GameScene extends IScene {
  private readonly eventManager: EventManager
  private readonly movementController: MovementController
  private readonly keyboardManager: KeyboardManager
  private readonly orientationController: OrientationController
  private readonly collisionController: CollisionController

  constructor (sceneManager: SceneManager) {
    super(sceneManager)
    this.eventManager = new EventManager()
    this.keyboardManager = new KeyboardManager(this.eventManager)
    this.movementController = new MovementController(
      this.keyboardManager,
      this.eventManager
    )
    this.orientationController = new OrientationController(this.eventManager)
    this.collisionController = new CollisionController()
  }

  init (): void {
    this.sceneManager.add(new Planet(new THREE.Vector3(-1, 0, 0)))
    this.sceneManager.add(new Planet(new THREE.Vector3(3, 0, 0)))
    this.sceneManager.add(new Player(
      this.movementController,
      this.orientationController,
      this.collisionController,
      this.sceneManager
    ))
  }

  update (): void {
    //
  }
}
