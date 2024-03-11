import Planet, { type IPlanet } from '@/components/Planet'
import { ISceneManager } from '../SceneManager'
import { IGameParams } from '../GameParams'
import { inject, injectable } from 'inversify'
import TYPES from '../DI/tokens'

interface IPlanetFactory {
  createPlanet: (x: number, y: number, radius: number, color: THREE.ColorRepresentation) => IPlanet
}

@injectable()
export class PlanetFactory implements IPlanetFactory {
  constructor (
    @inject(TYPES.ISceneManager) private readonly sceneManager: ISceneManager,
    @inject(TYPES.IGameParams) private readonly gameParams: IGameParams
  ) {}

  createPlanet (x: number, y: number, radius: number, color: THREE.ColorRepresentation): Planet {
    return new Planet(x, y, this.sceneManager, this.gameParams, { radius, color })
  }
}
