import type Player from '@/components/Player';
import { inject, injectable } from 'inversify';
import TYPES from '../DI/tokens';

export type CreatePlayer = (
  controllable: boolean,
  id?: number,
  position?: THREE.Vector3,
) => Player;

@injectable()
export default class PlayerFactory {
  constructor(
    @inject(TYPES.PlayerFactory)
    private readonly playerFactory: CreatePlayer,
  ) {}

  createPlayer: CreatePlayer = (controllable, id, position): Player => {
    return this.playerFactory(controllable, id, position);
  };
}
