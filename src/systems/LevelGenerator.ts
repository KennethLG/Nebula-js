import * as THREE from 'three'
import type SceneManager from './SceneManager'
import Planet from '@/components/planet'

export default class LevelGenerator {
  private lastChunkY: number = 0
  private readonly chunkSize: number = 4
  private readonly triggerThreshold: number = 3
  private readonly xDistanceBetweenPlanets = 3

  constructor (
    private readonly camera: THREE.OrthographicCamera,
    private readonly sceneManager: SceneManager
  ) {}

  update (): void {
    this.checkForChunkGeneration()
  }

  private checkForChunkGeneration (): void {
    if (this.camera.position.y > this.lastChunkY + this.chunkSize - this.triggerThreshold) {
      this.generateNewChunk()
      this.lastChunkY += this.chunkSize
    }
  }

  private generateNewChunk (): void {
    const startY = this.lastChunkY + this.chunkSize
    const endY = startY + this.chunkSize
    const xPos = this.genXPos()
    this.addPlanetAt(xPos, endY)
  }

  private addPlanetAt (x: number, y: number): void {
    const planetPos = new THREE.Vector3(x, y, 0)
    const newPlanet = new Planet(planetPos)
    this.sceneManager.add(newPlanet)
  }

  private genXPos (): number {
    const xRange = this.xDistanceBetweenPlanets * Math.random()
    return Math.random() < 0.5 ? -xRange : xRange
  }
}
