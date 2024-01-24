import type * as THREE from 'three'
import type IBoundingSphere from './IBoundingSphere'
import type ISprite from './ISprite'

interface BodyProperties {
  position: THREE.Vector3
  sprite: ISprite
  boundingSphere: IBoundingSphere
}

export default abstract class IBody {
  position: THREE.Vector3
  sprite: ISprite
  boundingSphere: IBoundingSphere
  constructor ({ boundingSphere, position, sprite }: BodyProperties) {
    this.position = position
    this.sprite = sprite
    this.boundingSphere = boundingSphere
  }

  update (): void {
    this.sprite.update()
    this.sprite.sprite.position.copy(this.position.clone())
  }
}
