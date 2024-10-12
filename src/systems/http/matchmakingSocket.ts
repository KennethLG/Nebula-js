import config from "@/config"
import { inject, injectable } from "inversify";
import { io, Socket } from "socket.io-client"
import TYPES from "../DI/tokens";
import { IEventManager } from "../EventManager";

export interface IMatchmakingSocket {
    init: () => void;
}

@injectable()
export default class MatchmakingSocket {
    private readonly socket: Socket

    constructor(
        @inject(TYPES.IEventManager) private readonly eventManager: IEventManager
    ) {
        this.socket = io(config.baseURL)
    }

    init() {
        this.socket.on('connect', () => {
            this.joinMatch()
            this.onMatchFound()
        })

        this.socket.on('disconnect', () => {
            console.log('disconnected!')
        })
    }

    private joinMatch() {
        this.socket.emit('joinMatch')
    }

    private onMatchFound() {
        this.socket.on('matchFound', (data) => {
            console.log('Match found!', data)
            this.eventManager.emit('matchFound', data);
        })
    }
}