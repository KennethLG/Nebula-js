import Ufo from '@/components/UFO'
import { type ISceneManager } from '../SceneManager'
import { type IGameParams } from '../GameParams'

export default class UfoFactory {
  constructor (
    private readonly sceneManager: ISceneManager,
    private readonly gameParams: IGameParams
  ) {}

  createUfo = (): Ufo => {
    return new Ufo(
      this.sceneManager,
      this.gameParams
    )
  }
}
