import type Instance from 'src/components/instance'
import * as THREE from 'three'

export default class SceneManager {
  static instances: Instance[] = []
  scene: THREE.Scene
  constructor () {
    this.scene = new THREE.Scene()
  }

  add (instance: Instance): void {
    this.scene.add(instance.mesh)
    SceneManager.instances.push(instance)
  }

  private update (): void {
    SceneManager.instances.forEach((instance) => {
      instance.update?.()
    })
  }

  animate (): void {
    this.update()
    window.requestAnimationFrame(this.animate.bind(this))
  }
}
