import * as THREE from 'three'
import {
  SceneManager
} from './systems'
import type IScene from './entities/IScene'
import GameScene from './scenes/GameScene'
import CameraController from './systems/CameraController'
import GameParams from './systems/GameParams'

class Main {
  private readonly sceneManager: SceneManager
  private readonly cameraController: CameraController
  private readonly renderer: THREE.WebGLRenderer
  private readonly currentScene: IScene
  private readonly gameParams: GameParams

  constructor () {
    this.gameParams = new GameParams()
    this.sceneManager = new SceneManager(this.gameParams)
    this.cameraController = new CameraController()
    this.renderer = new THREE.WebGLRenderer()
    this.currentScene = new GameScene(this.sceneManager, this.cameraController, this.gameParams)
  }

  init (): void {
    this.renderer.setSize(this.gameParams.roomWidth, this.gameParams.roomHeight)
    document.body.appendChild(this.renderer.domElement)

    this.renderer.domElement.style.margin = 'auto'

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
