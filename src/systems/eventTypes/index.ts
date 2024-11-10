import { type IPlayer } from '@/components/Player';
import {
  type MatchFoundResponse,
  type PlayerUpdatedResponse,
} from '../http/responses';

export const EventTypes = {
  MatchFound: 'matchFound',
  PlayerUpdated: 'playerUpdated',
  MatchStart: 'matchStart',
  GameOver: 'gameOver',
  Keydown: 'keydown',
  Keyup: 'keyup',
  StartGame: 'startGame',
  MovementKeydown: 'movementKeydown',
} as const;

export type EventType = (typeof EventTypes)[keyof typeof EventTypes];

export interface EventMap {
  [EventTypes.MatchFound]: MatchFoundResponse;
  [EventTypes.PlayerUpdated]: PlayerUpdatedResponse;
  [EventTypes.MatchStart]: { matchId: string; player: IPlayer };
  [EventTypes.GameOver]: { playerId: number };
  [EventTypes.Keydown]: string;
  [EventTypes.Keyup]: string;
  [EventTypes.MovementKeydown]: 'left' | 'right';
  [EventTypes.StartGame]: undefined;
}
