import { Socket } from "socket.io-client";

export default class PlayerStateSocket {
    
    constructor(
        private readonly io: Socket
    ) {}
    
    sendVelocity(xVel: THREE.Vector2, yVel: THREE.Vector2) {
        this.io.emit('playerState', {
            xVel,
            yVel
        })
    }
}