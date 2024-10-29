import config from '@/config';
import { io, type Socket } from 'socket.io-client';
import { type IEventManager } from '../EventManager';
import {
  type MatchFoundResponse,
  type PlayerUpdatedResponse,
  type SocketResponse,
} from './responses';
import { type IPlayer } from '@/components/Player';
import PlayerStateSocket from './playerStateSocket';
import { EventTypes } from '../eventTypes';

export interface IMatchSocket {
  init: (id: number) => void;
}
export default class MatchSocket {
  private readonly socket: Socket;
  private playerStateSocket: PlayerStateSocket | null;
  private currentPlayer: IPlayer | null;

  constructor(private readonly eventManager: IEventManager) {
    this.socket = io(config.baseURL);
    this.playerStateSocket = null;
    this.currentPlayer = null;
  }

  init(id: number): void {
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

  private initPlayerStateSocket(matchId: string, player: IPlayer): void {
    this.currentPlayer = player;
    this.playerStateSocket = new PlayerStateSocket(
      this.socket,
      player.playerEvents,
      player,
      matchId,
    );
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
