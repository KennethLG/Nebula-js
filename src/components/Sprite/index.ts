import * as THREE from 'three'
import type ISprite from '@/entities/ISprite'
import config from '@/config'

interface SpriteConfig {
  name: string
}

export default class Sprite implements ISprite {
  sprite: THREE.Object3D<THREE.Object3DEventMap>
  map: THREE.Texture
  currentTile = 0
  maxDisplayTime = 0
  elapsedTime = 0
  flipped = false
  private runningTileArrayIndex = 0
  private playSpriteIndices: number[] = []
  private readonly xTiles = 3
  private readonly yTiles = 1

  constructor ({ name }: SpriteConfig) {
    this.map = new THREE.TextureLoader().load(`${config.assetsPath}${name}`)

    this.map.magFilter = THREE.NearestFilter
    this.map.repeat.set(1 / this.xTiles, 1 / this.yTiles)
    this.update(0)

    const material = new THREE.SpriteMaterial({ map: this.map })
    this.sprite = new THREE.Sprite(material)
  }

  flipHorizontally (): void {
    this.flipped = !this.flipped
    this.map.repeat.x = this.flipped ? -1 / this.xTiles : 1 / this.xTiles
    this.map.offset.x = this.flipped
      ? (1 / this.xTiles) + (this.currentTile % this.xTiles) / this.xTiles
      : (this.currentTile % this.xTiles) / this.xTiles
    this.map.needsUpdate = true
  }

  loop (playSpriteIndices: number[], totalDuration: number): void {
    this.playSpriteIndices = playSpriteIndices
    this.runningTileArrayIndex = 0
    this.currentTile = playSpriteIndices[this.runningTileArrayIndex]
    this.maxDisplayTime = totalDuration / this.playSpriteIndices.length

    this.elapsedTime = this.maxDisplayTime
  }

  update (delta: number): void {
    this.elapsedTime += delta
    if (this.maxDisplayTime > 0 && this.elapsedTime >= this.maxDisplayTime) {
      this.elapsedTime = 0
      this.runningTileArrayIndex = (this.runningTileArrayIndex + 1) % this.playSpriteIndices.length
      this.currentTile = this.playSpriteIndices[this.runningTileArrayIndex]

      const offsetX = this.getXOffset()
      const offsetY = this.getYOffset()

      this.map.offset.x = offsetX
      this.map.offset.y = offsetY
      this.map.needsUpdate = true
    }
  }

  private getXOffset (): number {
    let offsetX = (this.currentTile % this.xTiles) / this.xTiles
    if (this.flipped) {
      offsetX = (1 / this.xTiles) + offsetX
    }
    return offsetX
  }

  private getYOffset (): number {
    return (this.yTiles - Math.floor(this.currentTile / this.xTiles) - 1) / this.yTiles
  }
}
