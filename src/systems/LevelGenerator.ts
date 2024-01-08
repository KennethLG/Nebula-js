import type * as THREE from 'three'

export default class LevelGenerator {
  private lastChunkY: number = 0
  private readonly chunkSize: number = 100
  private readonly triggerThreshold: number = 50

  constructor (
    private readonly camera: THREE.OrthographicCamera
  ) {}

  update (): void {
    this.checkForChunkGeneration()
  }

  private checkForChunkGeneration (): void {
    if (this.camera.position.y > this.lastChunkY + this.chunkSize - this.triggerThreshold) {
      this.lastChunkY += this.chunkSize
    }
  }
}
