import type Instance from '@/components/Instance'
import * as THREE from 'three'

export default class SceneManager {
  instances: Instance[] = []
  scene: THREE.Scene
  constructor () {
    this.scene = new THREE.Scene()
  }

  add (instance: Instance): void {
    this.scene.add(instance.body.sprite.sprite)
    this.instances.push(instance)
    instance.init()
  }

  animate (): void {
    this.update()
    window.requestAnimationFrame(this.animate.bind(this))
  }

  private update (): void {
    this.instances.forEach((instance) => {
      instance.baseUpdate()
    })
  }
}
