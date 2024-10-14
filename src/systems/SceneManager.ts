import type Instance from '@/components/Instance'
import * as THREE from 'three'

export interface ISceneManager {
  instances: Instance[]
  scene: THREE.Scene
  canInitInstances: boolean
  add: (instance: Instance) => void
  destroy: (id: number) => void
  destroyAll: () => void
  animate: () => void
}

export default class SceneManager implements ISceneManager {
  instances: Instance[] = []
  scene: THREE.Scene
  canInitInstances = true

  constructor () {
    this.scene = new THREE.Scene()
  }

  add (instance: Instance): void {
    this.scene.add(instance.body.mesh)
    this.instances.push(instance)
  }

  destroy (id: number): void {
    const instanceIndex = this.instances.findIndex(instance => instance.id === id)
    if (instanceIndex !== -1) {
      const instance = this.instances[instanceIndex]
      instance.onDestroy()
      this.scene.remove(instance.body.mesh)
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
    this.canInitInstances = true
  }

  animate (): void {
    this.update()
    window.requestAnimationFrame(this.animate.bind(this))
  }

  private update (): void {
    this.instances.forEach((instance) => {
      instance.baseUpdate()
    })

    if (!this.canInitInstances || this.instances.length === 0) return
    this.canInitInstances = false
    console.log('can init instances', this.canInitInstances, this.instances.length)
    this.instances.forEach((instance) => {
      instance.init()
      console.log('init instance', instance)
    })
  }
}
