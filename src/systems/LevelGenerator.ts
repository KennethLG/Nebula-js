import * as THREE from 'three'
import type SceneManager from './SceneManager'
import Planet from '@/components/planet'

export default class LevelGenerator {
  private lastChunkY: number = 0
  private readonly chunkSize: number = 3
  private readonly triggerThreshold: number = 3

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
    this.addPlanetAt(endY)
  }

  private addPlanetAt (y: number): void {
    const planetPos = new THREE.Vector3(0, y, 0)
    const newPlanet = new Planet(planetPos)
    this.sceneManager.add(newPlanet)
    // console.log(this.sceneManager.instances)
  }
}
