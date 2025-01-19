import { type Socket } from 'socket.io-client';
import EventManager from '../EventManager';
import Player, { type IPlayer } from '@/components/Player';
import { EventTypes } from '../eventTypes';
import { type PlayerStateRequest } from './requests';
import { inject, injectable } from 'inversify';
import TYPES from '../DI/tokens';

class PlayerStateAdapter {
  toPlayerStateRequest(
    player: IPlayer,
    matchId: string,
    key: string,
    keyState: boolean,
  ): PlayerStateRequest {
    return {
      matchId,
      player: {
        id: player.id.toString(),
        xVel: { x: player.xVel.x, y: player.xVel.y },
        yVel: { x: player.yVel.x, y: player.yVel.y },
        position: { x: player.body.position.x, y: player.body.position.y },
        key,
        keyState,
        dead: player.dead,
      },
    };
  }
}

@injectable()
export default class PlayerStateSocket {
  constructor(
    @inject(TYPES.EventManager)
    private readonly eventManager: EventManager,
    private readonly io: Socket,
  ) {}

  init(player: Player, matchId: string): void {
    const playerStateAdapter = new PlayerStateAdapter();
    this.eventManager.on(EventTypes.Keyup, (key) => {
      const playerStateRequest = playerStateAdapter.toPlayerStateRequest(
        player,
        matchId,
        key,
        false,
      );
      this.sendState(playerStateRequest);
    });
    this.eventManager.on(EventTypes.Keydown, (key) => {
      const playerStateRequest = playerStateAdapter.toPlayerStateRequest(
        player,
        matchId,
        key,
        true,
      );
      this.sendState(playerStateRequest);
    });
    this.eventManager.on(EventTypes.PlayerDied, () => {
      const playerStateRequest = playerStateAdapter.toPlayerStateRequest(
        player,
        matchId,
        '',
        false,
      );
      this.sendState(playerStateRequest);
    });
  }

  private sendState({ matchId, player }: PlayerStateRequest): void {
    player = {
      ...player,
      id: player.id.toString(),
    };
    this.io.emit('updatePlayer', {
      matchId,
      player,
    });
  }
}
