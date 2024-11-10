import type Ufo from '@/components/UFO';
import { injectable, type interfaces } from 'inversify';
import TYPES from '../DI/tokens';
import { container } from '../DI/servicesRegistry';

@injectable()
export default class UfoFactory {
  createUfo = (): Ufo => {
    const ufoFactory = container.get<interfaces.Factory<Ufo>>(TYPES.UfoFactory);

    const ufo = ufoFactory() as Ufo;
    return ufo;
  };
}
