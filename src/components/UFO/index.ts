import * as THREE from 'three'
import Instance from '../Instance'
import Sprite from '../Sprite'
import { randomRange } from '@/systems/util/random'
import { type IInstance } from '@/entities/Instance'

export default class Ufo extends Instance {
  xVel = new THREE.Vector3(0, 0, 0)
  yVel = new THREE.Vector3(0, 0, 0)
  positionTo = new THREE.Vector3(0, 0, 0)

  constructor (private readonly target: IInstance) {
    const sprite = new Sprite({
      name: 'ufo.png',
      xTiles: 1,
      yTiles: 1
    })

    super({
      name: 'ufo',
      position: new THREE.Vector3(0, 0, 0),
      radius: 0.5,
      mesh: sprite.sprite
    })
    setInterval(() => { this.changeXPosition() }, 4000)
  }

  update (): void {
    this.positionTo.y = this.target.body.position.y

    this.body.position.lerp(this.positionTo, 0.01)
  }

  private changeXPosition (): void {
    this.positionTo.x = randomRange(-4, 4)
  }
}
