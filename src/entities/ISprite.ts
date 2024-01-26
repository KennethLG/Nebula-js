import { type Object3D } from 'three'

export default interface ISprite {
  sprite: Object3D
  currentTile: number
  maxDisplayTime: number
  elapsedTime: number
  flipped: boolean
  flipHorizontally: () => void
  update: (deltaTime: number) => void
  loop: (playSpriteIndices: number[], totalDuration: number) => void
}
