import * as THREE from 'three'
import Instance from '../Instance'
import Sprite from '../Sprite'
import { randomRange } from '@/systems/util/random'
import { type IInstance } from '@/entities/Instance'
import Bullet from '../Bullet'
import { getNearestPlanet } from '@/systems/util/getNearestPlanet'
import { type ISceneManager } from '@/systems/SceneManager'
import { type IGameParams } from '@/systems/GameParams'
import { inject, injectable } from 'inversify'
import TYPES from '@/systems/DI/tokens'

export interface IUfo extends Instance {
  xVel: THREE.Vector3
  yVel: THREE.Vector3
  positionTo: THREE.Vector3
  update: () => void
  onDestroy: () => void
}

@injectable()
export default class Ufo extends Instance implements IUfo {
  xVel = new THREE.Vector3(0, 0, 0)
  yVel = new THREE.Vector3(0, 0, 0)
  positionTo = new THREE.Vector3(0, 0, 0)
  private readonly changePositionInterval: number
  private readonly shootInterval: number

  private readonly target?: IInstance

  constructor (
    @inject(TYPES.ISceneManager)
    private readonly sceneManager: ISceneManager,

    @inject(TYPES.IGameParams)
    private readonly gameParams: IGameParams
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
    if (this.target == null) return

    this.positionTo.y = this.target.body.position.y - 2

    this.body.position.lerp(this.positionTo, 0.02)
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
