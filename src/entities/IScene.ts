import { type SceneManager } from '@/systems'

export default abstract class IScene {
  constructor (protected sceneManager: SceneManager) {}

  abstract init (): void
  abstract update (): void
}
