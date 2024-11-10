import type Planet from '@/components/Planet';
import { type PlanetProperties } from '@/components/Planet';
import { container } from '../DI/servicesRegistry';
import { injectable, type interfaces } from 'inversify';
import TYPES from '../DI/tokens';

interface IPlanetFactory {
  createPlanet: (
    x: number,
    y: number,
    planetProperties: PlanetProperties,
  ) => Planet;
}

@injectable()
export class PlanetFactory implements IPlanetFactory {
  createPlanet = (
    x: number,
    y: number,
    planetProperties: PlanetProperties,
  ): Planet => {
    const planetFactory = container.get<interfaces.Factory<Planet>>(
      TYPES.PlanetFactory,
    );
    const planet = planetFactory(x, y, planetProperties) as Planet;
    return planet;
  };
}
