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
  xTiles = 3 // Number of tiles in the x direction
  yTiles = 1 // Number of tiles in the y direction
  totalTiles: number // Total number of tiles

  constructor ({ name }: SpriteConfig) {
    this.map = new THREE.TextureLoader().load(name, (texture) => {
      // Called when the image is loaded
      texture.magFilter = THREE.NearestFilter
      texture.repeat.set(1 / this.xTiles, 1 / this.yTiles)
      this.updateTextureOffset(texture)
    })

    const material = new THREE.SpriteMaterial({ map: this.map })
    this.sprite = new THREE.Sprite(material)
    this.totalTiles = (this.xTiles * this.yTiles) - 1
  }

  private updateTextureOffset (map: THREE.Texture): void {
    const offsetX = (this.currentTile % this.xTiles) / this.xTiles
    const offsetY = (this.yTiles - Math.floor(this.currentTile / this.xTiles) - 1) / this.yTiles
    map.offset.set(offsetX, offsetY)
    map.needsUpdate = true
  }

  update (): void {
    this.currentTile = (this.currentTile + 1) % this.totalTiles
    this.updateTextureOffset(this.map)
  }
}
