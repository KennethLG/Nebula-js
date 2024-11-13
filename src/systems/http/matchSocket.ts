import config from '@/config';
import { io, type Socket } from 'socket.io-client';
import EventManager from '../EventManager';
import {
  type MatchFoundResponse,
  type PlayerUpdatedResponse,
  type SocketResponse,
} from './responses';
import Player from '@/components/Player';
import PlayerStateSocket from './playerStateSocket';
import { EventTypes } from '../eventTypes';
import { inject, injectable } from 'inversify';
import TYPES from '../DI/tokens';
import { CreatePlayerStateSocket } from '../factories/PlayerStateSocketFactory';

export interface IMatchSocket {
  init: (id: number) => void;
}

@injectable()
export default class MatchSocket {
  private readonly socket: Socket;
  private currentPlayer: Player | null;
  private readonly playerStateSocket: PlayerStateSocket;
  constructor(
    @inject(TYPES.EventManager)
    private readonly eventManager: EventManager,
    @inject(TYPES.PlayerStateSocketFactory)
    private readonly playerStateSocketFactory: CreatePlayerStateSocket,
  ) {
    this.socket = io(config.baseURL);
    this.playerStateSocket = this.playerStateSocketFactory(this.socket);
    this.currentPlayer = null;
  }

  init(id: number): void {
    console.log('MatchSocket init');
    this.socket.on('connect', () => {
      console.log('connection established!');
      this.joinMatch(id);
      this.onMatchFound();
      this.onPlayerUpdated();
    });

    this.socket.on('disconnect', () => {
      console.log('disconnected!');
    });

    this.eventManager.on(EventTypes.MatchStart, (data) => {
      this.initPlayerStateSocket(data.matchId, data.player);
    });
  }

  private initPlayerStateSocket(matchId: string, player: Player): void {
    this.currentPlayer = player;
    this.playerStateSocket.init(player, matchId);
  }

  private joinMatch(id: number): void {
    this.socket.emit('joinMatch', {
      id: id.toString(),
    });
  }

  private onMatchFound(): void {
    this.socket.on('matchFound', (data: SocketResponse<MatchFoundResponse>) => {
      console.log('MatchFound response', data);
      if (data.status === 'Ok') {
        this.eventManager.emit(EventTypes.MatchFound, data.data);
        return;
      }
      console.error('Error joining match', data.message);
    });
  }

  private onPlayerUpdated(): void {
    this.socket.on(
      EventTypes.PlayerUpdated,
      (data: SocketResponse<PlayerUpdatedResponse>) => {
        console.log('Player updated', data);
        if (data.status === 'Ok') {
          this.eventManager.emit(EventTypes.PlayerUpdated, data.data);
          return;
        }
        console.error('Error updating player', data.message);
      },
    );
  }
}
