import type ISprite from '@/entities/ISprite'
import type * as THREE from 'three'

interface Animation {
  name: string
  sequence: number[]
  speed: number
}

export default class AnimationController {
  animations: Animation[]
  currentAnimation: Animation

  constructor (private readonly sprite: ISprite) {
    this.animations = [{
      name: 'idle',
      sequence: [0],
      speed: 1
    }, {
      name: 'running',
      sequence: [3, 4, 5],
      speed: 0.5
    }]

    this.currentAnimation = this.animations[0]
    this.sprite.loop(this.currentAnimation.sequence, this.currentAnimation.speed)
  }

  update (xVel: THREE.Vector3): void {
    if (xVel.lengthSq() === 0 && this.currentAnimation.name !== 'idle') {
      this.currentAnimation = this.animations[0]
      this.sprite.loop(this.currentAnimation.sequence, this.currentAnimation.speed)
    }

    if (xVel.lengthSq() !== 0 && this.currentAnimation.name !== 'running') {
      this.currentAnimation = this.animations[1]
      this.sprite.loop(this.currentAnimation.sequence, this.currentAnimation.speed)
    }
  }
}
