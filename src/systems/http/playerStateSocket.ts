import { Socket } from "socket.io-client";
import { IEventManager } from "../EventManager";
import { IPlayer } from "@/components/Player";

export default class PlayerStateSocket {
    constructor(
        private readonly io: Socket,
        private readonly eventManager: IEventManager,
        player: IPlayer,
        matchId: string
    ) {
        this.eventManager.on('movementKeydown', () => this.sendVelocity(matchId, player.id, player.xVel, player.yVel));
    }
    
    private sendVelocity(matchId: string, playerId: number, xVel: THREE.Vector3, yVel: THREE.Vector3) {
        console.log('sending velocity', xVel, yVel)
        this.io.emit('updatePlayer', {
            matchId,
            player: {
                id: playerId.toString(),
                xVel: {
                    x: xVel.x,
                    y: xVel.y
                },
                yVel: {
                    x: yVel.x,
                    y: yVel.y
                }
            }
        })
    }
}