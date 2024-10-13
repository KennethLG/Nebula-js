import {injectable } from "inversify";

interface PlayerData {
    id: number
}

export interface IPlayerDataController {
    getPlayerData: () => Promise<void>
    playerData: PlayerData
}

@injectable()
export default class PlayerDataController {
    _playerData: PlayerData | null

    constructor() {
        this._playerData = null
    }

    async getPlayerData() {
        this._playerData = {
            id: Date.now()
        }
    }

    get playerData() {
        if (!this._playerData) {
            throw new Error('data is not loaded yet')
        }
        return this._playerData
    }
}

