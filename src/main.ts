import * as THREE from 'three'
import {
  SceneManager
} from './systems'
import type IScene from './entities/IScene'
import GameScene from './scenes/GameScene'

class Main {
  private readonly sceneManager: SceneManager
  private readonly camera: THREE.PerspectiveCamera
  private readonly renderer: THREE.WebGLRenderer
  private readonly currentScene: IScene

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
    this.currentScene = new GameScene(this.sceneManager)
  }

  init (): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)
    this.currentScene.init()
    this.animate()
    this.sceneManager.animate()
  }

  animate (): void {
    this.renderer.render(this.sceneManager.scene, this.camera)
    window.requestAnimationFrame(this.animate.bind(this))
    this.currentScene.update()
  }
}

const main = new Main()
main.init()
