import Planet, { PlanetProperties, type IPlanet } from '@/components/Planet'
import { ISceneManager } from '../SceneManager'
import { IGameParams } from '../GameParams'
import { IRandom } from '../Random'

interface IPlanetFactory {
  createPlanet: (x: number, y: number, planetProperties: PlanetProperties) => IPlanet
}

export class PlanetFactory implements IPlanetFactory {
  constructor (
    private readonly sceneManager: ISceneManager,
    private readonly gameParams: IGameParams,
    private readonly random: IRandom
  ) {}

  createPlanet (x: number, y: number, planetProperties: PlanetProperties): Planet {
    return new Planet(x, y, this.sceneManager, this.gameParams, this.random, planetProperties)
  }
}
