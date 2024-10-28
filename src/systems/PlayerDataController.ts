interface PlayerData {
  id: number;
}

export interface IPlayerDataController {
  getPlayerData: () => void;
  playerData: PlayerData;
}

export default class PlayerDataController {
  _playerData: PlayerData | null;

  constructor() {
    this._playerData = null;
  }

  getPlayerData(): void {
    this._playerData = {
      id: Date.now(),
    };
  }

  get playerData(): PlayerData {
    if (this._playerData == null) {
      throw new Error('data is not loaded yet');
    }
    return this._playerData;
  }
}
