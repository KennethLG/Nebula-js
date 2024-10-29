import { type PlayerSocketResponse } from '../responses';

type PlayerSocketRequest = Omit<PlayerSocketResponse, 'socketId'>;

export interface PlayerStateRequest {
  matchId: string;
  player: PlayerSocketRequest;
}
