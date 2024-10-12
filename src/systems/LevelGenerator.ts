import { type IPlanet, type PlanetProperties } from '@/components/Planet'

import { type ISceneManager } from './SceneManager'
import { type IRandom } from './Random'
import { type IGameParams } from './GameParams'
import { inject, injectable } from 'inversify'
import { type ICameraController } from './CameraController'
import TYPES from './DI/tokens'
import { IEventManager } from './EventManager'

export interface ILevelGenerator {
  init: () => void
  update: () => void
}

@injectable()
export default class LevelGenerator implements ILevelGenerator {
  private chunkSize: number
  private triggerThreshold: number
  private xRangeBetweenPlanets: number
  private yRangeBetweenPlanets: number
  private yMarginBetweenPlanets: number
  private planetRadius: number
  private planetRadiusRange: number
  private lastChunkY: number
  private hue: number
  private currentColor: string

  constructor (
    @inject(TYPES.IGameParams) private readonly gameParams: IGameParams,
    @inject(TYPES.ICameraController) private readonly cameraController: ICameraController,
    @inject(TYPES.ISceneManager) private readonly sceneManager: ISceneManager,
    @inject(TYPES.IRandom) private readonly random: IRandom,
    @inject(TYPES.IEventManager) private readonly eventManager: IEventManager,
    @inject('Factory<Planet>') private readonly createPlanet: (x: number, y: number, properties: PlanetProperties) => IPlanet
  ) {
    this.hue = 0
    this.currentColor = ''
    this.lastChunkY = 0
    this.chunkSize = 4
    this.triggerThreshold = 3
    this.xRangeBetweenPlanets = 3
    this.yRangeBetweenPlanets = 1
    this.yMarginBetweenPlanets = 2
    this.planetRadius = 1
    this.planetRadiusRange = 1
  }

  init (): void {
    this.hue = this.genHue()
    this.currentColor = this.genColor()
    this.lastChunkY = 0
    this.chunkSize = 4
    this.triggerThreshold = 3
    this.xRangeBetweenPlanets = 3
    this.yRangeBetweenPlanets = 1
    this.yMarginBetweenPlanets = 2
    this.planetRadius = 1
    this.planetRadiusRange = 1
  }
  
  update (): void {
    this.random.seed.resetCurrent()
    this.checkForChunkGeneration()
    this.removeOuterPlanets()
  }

  private removeOuterPlanets (): void {
    const planets = this.sceneManager.instances.filter(inst => inst.name === 'Planet') as IPlanet[]
    if (planets.length === 0) return

    const cameraBottom = this.cameraController.camera.position.y - (this.cameraController.camera.top - this.cameraController.camera.bottom) / 2

    const outerPlanets = planets.filter(
      planet => planet.body.position.y + planet.boundingSphere.radius < cameraBottom
    )

    outerPlanets.forEach((planet) => { this.sceneManager.destroy(planet.id) })
  }

  private checkForChunkGeneration (): void {
    if (this.cameraController.camera.position.y > this.lastChunkY - this.triggerThreshold) {
      this.generateNewChunk()
    }
  }

  private generateNewChunk (): void {
    this.hue = this.genHue()
    this.currentColor = this.genColor()
    const yStart = this.lastChunkY
    const yEnd = yStart + this.chunkSize
    let yCurrent = yStart

    while (yCurrent < yEnd) {
      const planetRadius = this.genPlanetRadius()
      const xPos = this.genXPos()
      const yRange = this.yRangeBetweenPlanets * this.random.seed.next()
      const yPos = this.yMarginBetweenPlanets + yRange + (planetRadius * 2)
      yCurrent += yPos
      this.addPlanetAt(xPos, yCurrent, planetRadius)
    }
    this.lastChunkY = yCurrent
  }

  private addPlanetAt (x: number, y: number, radius: number): void {
    const newPlanet = this.genPlanet(x, y, radius)
    this.sceneManager.add(newPlanet)

    newPlanet.decorations.forEach(decoration => {
      this.sceneManager.scene.add(decoration.sprite)
    })
  }

  private genPlanet (x: number, y: number, radius: number): IPlanet {
    return this.createPlanet(x, y, {
      radius,
      color: this.currentColor
    })
  }

  private genPlanetRadius (): number {
    return this.planetRadius + (this.planetRadiusRange * this.random.seed.next())
  }

  private genXPos (): number {
    const xRange = this.xRangeBetweenPlanets * this.random.seed.next()
    return this.random.seed.next() < 0.5 ? -xRange : xRange
  }

  private genHue (): number {
    const hueDecreasePerPlanet = 5 // Adjust this value as needed.
    let newHue = 300 - (this.gameParams.scores.planets * hueDecreasePerPlanet) % 360

    // Ensure the hue stays within the 0-360 range.
    if (newHue < 0) {
      newHue += 360
    }

    return newHue
  }

  private genColor (): string {
    const h = Math.round(this.hue)
    const s = Math.round(this.random.seed.randomRange(30, 100))
    const l = Math.round(this.random.seed.randomRange(30, 100))
    return `hsl(${h}, ${s}%, ${l}%)`
  }
}
