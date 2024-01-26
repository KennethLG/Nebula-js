import * as THREE from 'three'
import type IBoundingSphere from './IBoundingSphere'
import type ISprite from './ISprite'
import GameParams from '@/systems/GameParams'

interface BodyProperties {
  position: THREE.Vector3
  sprite: ISprite
  boundingSphere: IBoundingSphere
}

export default abstract class IBody {
  position: THREE.Vector3
  quaternion: THREE.Quaternion
  sprite: ISprite
  boundingSphere: IBoundingSphere
  private readonly gameParams: GameParams
  constructor ({ boundingSphere, position, sprite }: BodyProperties) {
    this.position = position
    this.sprite = sprite
    this.boundingSphere = boundingSphere
    this.gameParams = new GameParams()
    this.quaternion = new THREE.Quaternion()
  }

  update (): void {
    this.sprite.update(this.gameParams.clock.getDelta())
    this.sprite.sprite.position.copy(this.position.clone())
  }
}
