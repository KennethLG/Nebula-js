import type Player from '@/components/Player';
import { injectable, type interfaces } from 'inversify';
import TYPES from '../DI/tokens';
import { container } from '../DI/servicesRegistry';

export type CreatePlayer = (
  controllable: boolean,
  id?: number,
  position?: THREE.Vector3,
) => Player;

@injectable()
export default class PlayerFactory {
  createPlayer: CreatePlayer = (controllable, id, position): Player => {
    const playerFactory = container.get<interfaces.Factory<Player>>(
      TYPES.PlayerFactory,
    );
    const player = playerFactory(controllable, id, position) as Player;

    return player;
  };
}
