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
        this.eventManager.on('keyup', (key: string) => {
            this.sendVelocity(matchId, player.id, player.xVel, player.yVel, player.body.position, key, false);
        });
        this.eventManager.on('keydown', (key: string) => {
            this.sendVelocity(matchId, player.id, player.xVel, player.yVel, player.body.position, key, true);
        });
        setInterval(() => {
        }, 20)
    }

    private sendVelocity(matchId: string, playerId: number, xVel: THREE.Vector3, yVel: THREE.Vector3, pos: THREE.Vector3, key: string, keyState: boolean) {
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
                },
                position: {
                    x: pos.x,
                    y: pos.y
                },
                key,
                keyState
            },
        })
    }
}