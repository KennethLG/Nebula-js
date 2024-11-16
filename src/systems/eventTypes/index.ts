import Player from '@/components/Player';
import {
  type MatchFoundResponse,
  type PlayerUpdatedResponse,
} from '../http/responses';
import { SceneType } from '@/scenes/sceneFactory';

export const EventTypes = {
  MatchFound: 'matchFound',
  FindingMatch: 'findingMatch',
  PlayerUpdated: 'playerUpdated',
  MatchStart: 'matchStart',
  GameOver: 'gameOver',
  Keydown: 'keydown',
  Keyup: 'keyup',
  StartGame: 'startGame',
  MovementKeydown: 'movementKeydown',
  ChangeScene: 'changeScene',
} as const;

export type EventType = (typeof EventTypes)[keyof typeof EventTypes];

export interface EventMap {
  [EventTypes.MatchFound]: MatchFoundResponse;
  [EventTypes.PlayerUpdated]: PlayerUpdatedResponse;
  [EventTypes.MatchStart]: { matchId: string; player: Player };
  [EventTypes.GameOver]: { playerId: number };
  [EventTypes.Keydown]: string;
  [EventTypes.Keyup]: string;
  [EventTypes.MovementKeydown]: 'left' | 'right';
  [EventTypes.StartGame]: undefined;
  [EventTypes.ChangeScene]: SceneType;
  [EventTypes.FindingMatch]: undefined;
}
