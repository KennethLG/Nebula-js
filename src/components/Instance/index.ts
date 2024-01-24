import type IBody from '@/entities/IBody'
import type { IInstance } from '@/entities/Instance'
import { Body } from '../Body'
import { BoundingSphere } from '@/systems'
import Sprite from '../Sprite'

interface InstanceConfig {
  name: string
  position: THREE.Vector3
  radius: number
  spriteName: string
}
export default class Instance implements IInstance {
  name: string
  body: IBody

  constructor ({ name, position, radius, spriteName }: InstanceConfig) {
    this.name = name
    const boundingSphere = new BoundingSphere(radius)
    const sprite = new Sprite({
      name: spriteName
    })
    this.body = new Body({
      position,
      boundingSphere,
      sprite
    })
  }

  update (): void {
    this.body.update()
  }
}
