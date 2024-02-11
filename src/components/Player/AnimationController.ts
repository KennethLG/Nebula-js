import type ISprite from '@/entities/ISprite'

interface Animation<T = any> {
  name: string
  sequence: number[]
  speed: number
  condition?: (context: T) => boolean
}

export default class AnimationController<T> {
  private readonly animations: Array<Animation<T>>
  private currentAnimation: Animation<T>

  constructor (
    private readonly sprite: ISprite,
    animations: Array<Animation<T>>,
    initialAnimationName: string
  ) {
    this.animations = animations

    const initialAnimation = this.animations.find(animation => animation.name === initialAnimationName) ?? this.animations[0]
    this.currentAnimation = initialAnimation
    this.sprite.loop(this.currentAnimation.sequence, this.currentAnimation.speed)
  }

  update (context: T): void {
    for (const animation of this.animations) {
      if (animation.condition != null && animation.condition(context) && this.currentAnimation.name !== animation.name) {
        this.currentAnimation = animation
        this.sprite.loop(this.currentAnimation.sequence, this.currentAnimation.speed)
        break
      }
    }
  }
}
