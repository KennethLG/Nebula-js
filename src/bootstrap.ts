import * as THREE from 'three'
import { inject, injectable } from 'inversify'
import TYPES from './systems/DI/tokens'
import { ISceneManager } from './systems/SceneManager'
import { ICameraController } from './systems/CameraController'
import { IGameParams } from './systems/GameParams'
import { IGUI } from './systems/GUI'
import IScene from './entities/IScene'

export interface IMain {
  init: () => void
}

@injectable()
export class Main implements IMain {
  private readonly renderer: THREE.WebGLRenderer

  constructor (
    @inject(TYPES.ISceneManager)
    private readonly sceneManager: ISceneManager,

    @inject(TYPES.ICameraController)
    private readonly cameraController: ICameraController,

    @inject(TYPES.IGameParams)
    private readonly gameParams: IGameParams,

    @inject(TYPES.IGUI)
    private readonly gui: IGUI,

    @inject(TYPES.IScene)
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
