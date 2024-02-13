import * as THREE from 'three'
import {
  EventManager,
  SceneManager
} from './systems'
import type IScene from './entities/IScene'
import GameScene from './scenes/GameScene'
import CameraController from './systems/CameraController'
import GameParams from './systems/GameParams'
import GUI from './systems/GUI'

class Main {
  private readonly sceneManager: SceneManager
  private readonly cameraController: CameraController
  private readonly renderer: THREE.WebGLRenderer
  private readonly currentScene: IScene
  private readonly gameParams: GameParams
  private readonly eventManager: EventManager

  constructor () {
    this.eventManager = new EventManager()
    this.gameParams = new GameParams(this.eventManager)
    this.sceneManager = new SceneManager(this.gameParams)
    this.cameraController = new CameraController()
    this.renderer = new THREE.WebGLRenderer()
    this.currentScene = new GameScene(this.sceneManager, this.cameraController, this.gameParams, this.eventManager)
  }

  init (): void {
    this.renderer.setSize(this.gameParams.roomWidth, this.gameParams.roomHeight)
    document.body.appendChild(this.renderer.domElement)

    this.renderer.domElement.style.margin = 'auto'

    const gui = new GUI(this.renderer)
    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      gui.adjustToRenderer(this.renderer)
    })

    this.currentScene.init()
    this.animate()
    this.sceneManager.animate()
  }

  animate (): void {
    this.renderer.render(this.sceneManager.scene, this.cameraController.camera)
    window.requestAnimationFrame(this.animate.bind(this))
    this.currentScene.update()
    this.cameraController.update()
  }
}

const main = new Main()
main.init()
