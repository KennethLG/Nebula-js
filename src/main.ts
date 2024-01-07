import * as THREE from 'three'
import Player from './components/Player'
import {
  EventManager,
  KeyboardManager,
  MovementController,
  SceneManager
} from './systems'
import Planet from './components/planet'
import OrientationController from './components/Player/OrientationController'
import CollisionController from './components/Player/CollisionController'

class Main {
  private readonly sceneManager: SceneManager
  private readonly camera: THREE.PerspectiveCamera
  private readonly renderer: THREE.WebGLRenderer
  private readonly eventManager: EventManager
  private readonly keyboardManager: KeyboardManager
  private readonly movementController: MovementController
  private readonly orientationController: OrientationController
  private readonly collisionController: CollisionController

  constructor () {
    this.sceneManager = new SceneManager()
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera.position.z = 10
    this.renderer = new THREE.WebGLRenderer()
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
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)
    const planet = new Planet()
    this.sceneManager.add(planet)
    const player = new Player(
      this.movementController,
      this.orientationController,
      this.collisionController
    )
    this.sceneManager.add(player)
    this.animate()
    this.sceneManager.animate()
  }

  animate (): void {
    this.renderer.render(this.sceneManager.scene, this.camera)
    window.requestAnimationFrame(this.animate.bind(this))
  }
}

const main = new Main()
main.init()
