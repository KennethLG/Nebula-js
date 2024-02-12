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
      this.scene.remove(this.instances[instanceIndex].body.mesh)
      this.instances.splice(instanceIndex, 1)
    }
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
