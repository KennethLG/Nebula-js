import type Instance from '@/components/Instance'
import * as THREE from 'three'
import type GameParams from './GameParams'

export default class SceneManager {
  instances: Instance[] = []
  scene: THREE.Scene

  constructor (readonly gameParams: GameParams) {
    this.scene = new THREE.Scene()
  }

  add (instance: Instance): void {
    this.scene.add(instance.body.mesh)
    this.instances.push(instance)
    instance.init()
  }

  destroy (id: number): void {
    const instanceIndex = this.instances.findIndex(instance => instance.id === id)
    if (instanceIndex !== -1) {
      this.instances.splice(instanceIndex, 1)
    }
  }

  destroyAll (): void {
    this.instances.forEach((instance) => {
      instance.onDestroy()
    })

    this.instances.forEach((instance) => {
      this.scene.remove(instance.body.mesh)
    })

    this.scene.clear()

    // Reset the instances array
    this.instances = []
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
