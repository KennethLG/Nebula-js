import type SceneManager from './SceneManager'
import Planet from '@/components/planet'

export default class LevelGenerator {
  private lastChunkY: number = 0
  private readonly chunkSize: number = 4
  private readonly triggerThreshold: number = 3
  private readonly xRangeBetweenPlanets = 3
  private readonly yRangeBetweenPlanets = 1
  private readonly yMarginBetweenPlanets = 2
  private readonly planetRadius = 1
  private readonly planetRadiusRange = 1

  constructor (
    private readonly camera: THREE.OrthographicCamera,
    private readonly sceneManager: SceneManager
  ) {}

  update (): void {
    this.checkForChunkGeneration()
  }

  private checkForChunkGeneration (): void {
    if (this.camera.position.y > this.lastChunkY - this.triggerThreshold) {
      this.generateNewChunk()
    }
  }

  private generateNewChunk (): void {
    const yStart = this.lastChunkY
    const yEnd = yStart + this.chunkSize
    let yCurrent = yStart

    while (yCurrent < yEnd) {
      const planetRadius = this.genPlanetRadius()
      const xPos = this.genXPos()
      const yRange = this.yRangeBetweenPlanets * Math.random()
      const yPos = this.yMarginBetweenPlanets + yRange + (planetRadius * 2)
      yCurrent += yPos
      this.addPlanetAt(xPos, yCurrent, planetRadius)
    }
    this.lastChunkY = yCurrent
    console.log('planets', this.sceneManager.instances)
  }

  private addPlanetAt (x: number, y: number, radius: number): void {
    const newPlanet = this.genPlanet(x, y, radius)
    this.sceneManager.add(newPlanet)
  }

  private genPlanet (x: number, y: number, radius: number): Planet {
    const planet = new Planet(x, y, {
      radius
    })
    return planet
  }

  private genPlanetRadius (): number {
    return this.planetRadius + (this.planetRadiusRange * Math.random())
  }

  private genXPos (): number {
    const xRange = this.xRangeBetweenPlanets * Math.random()
    return Math.random() < 0.5 ? -xRange : xRange
  }
}
