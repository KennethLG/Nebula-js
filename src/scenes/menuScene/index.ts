import type IScene from '@/entities/IScene';
import { EventManager } from '@/systems';
import TYPES from '@/systems/DI/tokens';
import PlayerDataController from '@/systems/PlayerDataController';
import { EventTypes } from '@/systems/eventTypes';
import MatchSocket from '@/systems/http/matchSocket';
import { inject, injectable } from 'inversify';

@injectable()
export class MenuScene implements IScene {
  constructor(
    @inject(TYPES.EventManager)
    private readonly eventManager: EventManager,
    @inject(TYPES.MatchSocket)
    private readonly matchSocket: MatchSocket,
    @inject(TYPES.PlayerDataController)
    private readonly playerDataController: PlayerDataController,
  ) {
    console.log('menu scene constructor');
  }

  init(): void {
    console.log('menu scene init');
    this.matchSocket.init();
    this.playerDataController.getPlayerData();
    this.eventManager.on(EventTypes.StartGame, () => {
      this.matchSocket.joinMatch(this.playerDataController.playerData.id);
      this.eventManager.emit(EventTypes.FindingMatch);
      this.onMatchFound();
    });
  }

  update(): void {}

  private onMatchStart(): void {
    this.eventManager.on(EventTypes.MatchStart, (data) => {
      // this.matchFound = true;
      // this.player = data.player;
    });
  }

  private onMatchFound(): void {
    this.eventManager.on(EventTypes.MatchFound, () => {
      this.eventManager.emit(EventTypes.ChangeScene, 'game');
      // this.levelGenerator.init();
      // this.cameraController.camera.position.setY(0);
      // this.planetsScore = [];
    });
  }
}
