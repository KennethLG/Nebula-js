import Ufo from '@/components/UFO';
import { type IInstancesManager } from '../InstancesManager';
import { type IGameParams } from '../GameParams';

export default class UfoFactory {
  constructor(
    private readonly instancesManager: IInstancesManager,
    private readonly gameParams: IGameParams,
  ) {}

  createUfo = (): Ufo => {
    return new Ufo(this.instancesManager, this.gameParams);
  };
}
