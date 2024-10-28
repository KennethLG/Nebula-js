import { type Socket } from 'socket.io-client'
import { type IEventManager } from '../EventManager'
import { type IPlayer } from '@/components/Player'
import { type PlayerSocketResponse } from './responses/socketResponse'

type PlayerSocketRequest = Omit<PlayerSocketResponse, 'socketId'>

interface PlayerStateRequest {
  matchId: string
  player: PlayerSocketRequest
}

class PlayerStateAdapter {
  toPlayerStateRequest (player: IPlayer, matchId: string, key: string, keyState: boolean): PlayerStateRequest {
    return {
      matchId,
      player: {
        id: player.id.toString(),
        xVel: { x: player.xVel.x, y: player.xVel.y },
        yVel: { x: player.yVel.x, y: player.yVel.y },
        position: { x: player.body.position.x, y: player.body.position.y },
        key,
        keyState,
        dead: player.dead
      }
    }
  }
}

export default class PlayerStateSocket {
  constructor (
    private readonly io: Socket,
    private readonly eventManager: IEventManager,
    player: IPlayer,
    matchId: string
  ) {
    const playerStateAdapter = new PlayerStateAdapter()
    this.eventManager.on('keyup', (key: string) => {
      const playerStateRequest = playerStateAdapter.toPlayerStateRequest(player, matchId, key, false)
      this.sendState(playerStateRequest)
    })
    this.eventManager.on('keydown', (key: string) => {
      const playerStateRequest = playerStateAdapter.toPlayerStateRequest(player, matchId, key, true)
      this.sendState(playerStateRequest)
    })
  }

  private sendState ({
    matchId,
    player
  }: PlayerStateRequest): void {
    player = {
      ...player,
      id: player.id.toString()
    }
    this.io.emit('updatePlayer', {
      matchId,
      player
    })
  }
}
