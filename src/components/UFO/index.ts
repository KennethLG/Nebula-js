import * as THREE from 'three'
import Instance from '../Instance'
import Sprite from '../Sprite'
import { randomRange } from '@/systems/util/random'
import { type IInstance } from '@/entities/Instance'
import { type SceneManager } from '@/systems'
import Bullet from '../Bullet'
import { getNearestPlanet } from '@/systems/util/getNearestPlanet'
import type GameParams from '@/systems/GameParams'

export default class Ufo extends Instance {
  xVel = new THREE.Vector3(0, 0, 0)
  yVel = new THREE.Vector3(0, 0, 0)
  positionTo = new THREE.Vector3(0, 0, 0)
  private readonly changePositionInterval: number
  private readonly shootInterval: number

  constructor (
    private readonly target: IInstance,
    private readonly sceneManager: SceneManager,
    private readonly gameParams: GameParams
  ) {
    const sprite = new Sprite({
      name: 'ufo.png',
      xTiles: 1,
      yTiles: 1
    })

    super({
      name: 'Ufo',
      position: new THREE.Vector3(0, 0, 0),
      radius: 0.5,
      mesh: sprite.sprite
    })
    this.changePositionInterval = setInterval(() => { this.changeXPosition() }, 4000)
    this.shootInterval = setInterval(() => { this.shoot() }, 5000)
  }

  update (): void {
    this.positionTo.y = this.target.body.position.y - 2

    this.body.position.lerp(this.positionTo, 0.01)
  }

  private changeXPosition (): void {
    this.positionTo.x = randomRange(-4, 4)
  }

  private shoot (): void {
    if (this.gameParams.gameOver) return
    const position = this.body.position.clone()

    const planet = getNearestPlanet(this.sceneManager, position)

    if (planet == null) return

    const direction = planet.body.position.clone().sub(position).normalize()

    const bullet = new Bullet({
      position,
      direction,
      speed: 0.1
    }, this.sceneManager)

    this.sceneManager.add(bullet)
  }

  onDestroy (): void {
    clearInterval(this.changePositionInterval)
    clearInterval(this.shootInterval)
  }
}
