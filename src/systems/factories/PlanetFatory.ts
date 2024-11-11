import type Planet from '@/components/Planet';
import { type PlanetProperties } from '@/components/Planet';
import { inject, injectable } from 'inversify';
import TYPES from '../DI/tokens';

export type CreatePlanet = (
  x: number,
  y: number,
  planetProperties: PlanetProperties,
) => Planet;

@injectable()
export class PlanetFactory {
  constructor(
    @inject(TYPES.PlanetFactory)
    private readonly planetFactory: CreatePlanet,
  ) {}

  createPlanet = (
    x: number,
    y: number,
    planetProperties: PlanetProperties,
  ): Planet => {
    return this.planetFactory(x, y, planetProperties);
  };
}
