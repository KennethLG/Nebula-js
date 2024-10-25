import config from "@/config"
import { io, Socket } from "socket.io-client"
import { IEventManager } from "../EventManager";

export interface IMatchSocket {
    init: (id: number) => void;
}

export default class MatchSocket {
    private readonly socket: Socket

    constructor(
        private readonly eventManager: IEventManager
    ) {
        this.socket = io(config.baseURL)
    }

    init(id: number) {
        this.socket.on('connect', () => {
            this.joinMatch(id)
            this.onMatchFound()
        })

        this.socket.on('disconnect', () => {
            console.log('disconnected!')
        })
    }

    private joinMatch(id: number) {
        this.socket.emit('joinMatch', {
            id
        })
    }

    private onMatchFound() {
        this.socket.on('matchFound', (data) => {
            console.log('Match found!', data)
            this.eventManager.emit('matchFound', data);
        })
    }
}