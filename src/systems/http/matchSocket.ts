import config from "@/config"
import { io, Socket } from "socket.io-client"
import { IEventManager } from "../EventManager";
import { MatchFoundResponse, PlayerUpdatedResponse, SocketResponse } from "./responses/socketResponse";
import { IPlayer } from "@/components/Player";
import PlayerStateSocket from "./playerStateSocket";

export interface IMatchSocket {
    init: (id: number) => void;
}
export default class MatchSocket {
    private readonly socket: Socket
    private playerStateSocket: PlayerStateSocket | null;
    private currentPlayer: IPlayer | null

    constructor(
        private readonly eventManager: IEventManager
    ) {
        this.socket = io(config.baseURL)
        this.playerStateSocket = null;
        this.currentPlayer = null
    }

    init(id: number) {
        this.socket.on('connect', () => {
            console.log('connection established!')
            this.joinMatch(id)
            this.onMatchFound()
            this.onPlayerUpdated()
        })

        this.socket.on('disconnect', () => {
            console.log('disconnected!')
        })

        this.eventManager.on('matchStart', (data) => {
            this.initPlayerStateSocket(data.matchId, data.player);
        })
    }

    private initPlayerStateSocket(matchId: string, player: IPlayer) {
        this.currentPlayer = player
        this.playerStateSocket = new PlayerStateSocket(this.socket, this.eventManager, player, matchId)
    }

    private joinMatch(id: number) {
        this.socket.emit('joinMatch', {
            id: id.toString()
        })
    }

    private onMatchFound() {
        this.socket.on('matchFound', (data: SocketResponse<MatchFoundResponse>) => {
            console.log('MatchFound response', data);
            if (data.status === 'Ok') {
                return this.eventManager.emit('matchFound', data.data);
            }
            console.error('Error joining match', data.message);
        })
    }

    private onPlayerUpdated() {
        this.socket.on('playerUpdated', (data: SocketResponse<PlayerUpdatedResponse>) => {
            console.log('Player updated', data);
            if (data.status === 'Ok') {
                return this.eventManager.emit('playerUpdated', data.data);
            }
            console.error('Error updating player', data.message);
        });
    }
}