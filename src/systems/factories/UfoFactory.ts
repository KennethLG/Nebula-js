import type Ufo from '@/components/UFO';
import { inject, injectable } from 'inversify';
import TYPES from '../DI/tokens';

export type CreateUfo = () => Ufo;
@injectable()
export default class UfoFactory {
  constructor(
    @inject(TYPES.UfoFactory)
    private readonly ufoFactory: CreateUfo,
  ) {}

  createUfo = (): Ufo => {
    return this.ufoFactory();
  };
}
