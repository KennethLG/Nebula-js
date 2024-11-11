import { inject, injectable } from 'inversify';
import PlayerStateSocket from '../http/playerStateSocket';
import TYPES from '../DI/tokens';
import { Socket } from 'socket.io-client';

export type CreatePlayerStateSocket = (io: Socket) => PlayerStateSocket;

@injectable()
export default class PlayerStateSocketFactory {
  constructor(
    @inject(TYPES.PlayerStateSocketFactory)
    private readonly playerStateSocketFactory: CreatePlayerStateSocket,
  ) {}

  createPlayerStateSocket(io: Socket): PlayerStateSocket {
    return this.playerStateSocketFactory(io);
  }
}
