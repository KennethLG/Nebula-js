import * as THREE from 'three'
import { type ISceneManager } from './systems/SceneManager'
import { type ICameraController } from './systems/CameraController'
import { type IGameParams } from './systems/GameParams'
import { type IGUI } from './systems/GUI'
import type IScene from './entities/IScene'

export interface IMain {
  init: () => void
}

export class Main implements IMain {
  private readonly renderer: THREE.WebGLRenderer

  constructor (
    private readonly sceneManager: ISceneManager,

    private readonly cameraController: ICameraController,

    private readonly gameParams: IGameParams,

    private readonly gui: IGUI,

    private readonly currentScene: IScene
  ) {
    this.renderer = new THREE.WebGLRenderer()
  }

  init (): void {
    this.renderer.setSize(this.gameParams.roomWidth, this.gameParams.roomHeight)
    document.body.appendChild(this.renderer.domElement)

    this.renderer.domElement.style.margin = 'auto'

    this.gui.init(this.renderer)

    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.gui?.adjustToRenderer(this.renderer)
    })

    this.currentScene.init()
    this.animate()
    this.sceneManager.animate()
  }

  private animate (): void {
    this.renderer.render(this.sceneManager.scene, this.cameraController.camera)
    window.requestAnimationFrame(this.animate.bind(this))
    this.currentScene.update()
    this.cameraController.update()
    this.gui.update()
  }
}
