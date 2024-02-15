import type SceneManager from './SceneManager'
import Planet from '@/components/Planet'
import { randomRange } from './util/random'

export default class LevelGenerator {
  private lastChunkY: number = 0
  private readonly chunkSize: number = 4
  private readonly triggerThreshold: number = 3
  private readonly xRangeBetweenPlanets = 3
  private readonly yRangeBetweenPlanets = 1
  private readonly yMarginBetweenPlanets = 2
  private readonly planetRadius = 1
  private readonly planetRadiusRange = 1

  private hue: number
  private currentColor: string

  constructor (
    private readonly camera: THREE.OrthographicCamera,
    private readonly sceneManager: SceneManager
  ) {
    this.hue = this.genHue()
    this.currentColor = this.genColor()
  }

  update (): void {
    this.checkForChunkGeneration()
    this.removeOuterPlanets()
  }

  private removeOuterPlanets (): void {
    const planets = this.sceneManager.instances.filter(inst => inst.name === 'Planet') as Planet[]
    if (planets.length === 0) return

    const cameraBottom = this.camera.position.y - (this.camera.top - this.camera.bottom) / 2

    const outerPlanets = planets.filter(
      planet => planet.body.position.y + planet.boundingSphere.radius < cameraBottom
    )

    outerPlanets.forEach((planet) => { this.sceneManager.destroy(planet.id) })
  }

  private checkForChunkGeneration (): void {
    if (this.camera.position.y > this.lastChunkY - this.triggerThreshold) {
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
      const yRange = this.yRangeBetweenPlanets * Math.random()
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

  private genPlanet (x: number, y: number, radius: number): Planet {
    const planet = new Planet(x, y, this.sceneManager, {
      radius,
      color: this.currentColor
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

  private genHue (): number {
    const hueDecreasePerPlanet = 5 // Adjust this value as needed.
    let newHue = 300 - (this.sceneManager.gameParams.scores.planets * hueDecreasePerPlanet) % 360

    // Ensure the hue stays within the 0-360 range.
    if (newHue < 0) {
      newHue += 360
    }

    return newHue
  }

  private genColor (): string {
    const h = Math.round(this.hue)
    const s = Math.round(randomRange(30, 100))
    const l = Math.round(randomRange(30, 100))
    return `hsl(${h}, ${s}%, ${l}%)`
  }
}
