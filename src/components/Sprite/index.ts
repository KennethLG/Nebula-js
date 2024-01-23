import * as THREE from 'three'
import type ISprite from '@/entities/ISprite'

interface SpriteConfig {
  name: string
}

export default class Sprite implements ISprite {
  sprite: THREE.Object3D<THREE.Object3DEventMap>
  currentTile = 0
  constructor ({ name }: SpriteConfig) {
    const map = new THREE.TextureLoader().load(name)
    map.magFilter = THREE.NearestFilter
    const xTiles = 3
    const yTiles = 1
    map.repeat.set(1 / xTiles, 1 / yTiles)
    const offsetX = (this.currentTile % xTiles) / xTiles
    const offsetY = (yTiles - Math.floor(this.currentTile / xTiles) - 1) / yTiles
    map.offset.x = offsetX
    map.offset.y = offsetY

    const material = new THREE.SpriteMaterial({ map })

    this.sprite = new THREE.Sprite(material)
  }
}
