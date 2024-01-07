import type Instance from 'src/components/instance'
import * as THREE from 'three'

export default class SceneManager {
  instances: Instance[] = []
  scene: THREE.Scene
  constructor () {
    this.scene = new THREE.Scene()
  }

  add (instance: Instance): void {
    this.scene.add(instance.mesh)
    this.instances.push(instance)
  }

  animate (): void {
    this.update()
    window.requestAnimationFrame(this.animate.bind(this))
  }

  private update (): void {
    this.instances.forEach((instance) => {
      instance.update?.()
    })
  }
}
