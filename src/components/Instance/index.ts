import type IBody from '@/entities/IBody'
import type { IInstance } from '@/entities/Instance'
import { Body } from '../Body'
import { BoundingSphere } from '@/systems'

interface InstanceConfig {
  name: string
  position: THREE.Vector3
  radius: number
  mesh: THREE.Object3D
}
export default class Instance implements IInstance {
  name: string
  body: IBody

  constructor ({ name, position, radius, mesh }: InstanceConfig) {
    this.name = name
    const boundingSphere = new BoundingSphere(radius)
    this.body = new Body({
      position,
      boundingSphere,
      mesh
    })
  }

  init (): void {

  }

  baseUpdate (): void {
    this.body.update()
    this.update()
    this.body.mesh.position.copy(this.body.position)
  }

  update (): void {

  }
}
