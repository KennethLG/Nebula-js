import GameScene from '@/scenes/gameScene/GameScene';
import { type ICameraController } from '../CameraController';
import { type IInstancesManager } from '../InstancesManager';
import { type IGameParams } from '../GameParams';
import type LevelGenerator from '../LevelGenerator';
import { type IEventManager } from '../EventManager';
import { type BaseGUI } from '../gui';
import { type IMatchSocket } from '../http/matchSocket';
import type PlayerDataController from '../PlayerDataController';
import type UfoFactory from './UfoFactory';

export class GameSceneFactory {
  constructor(
    private readonly cameraController: ICameraController,
    private readonly instancesManager: IInstancesManager,
    private readonly gameParams: IGameParams,
    private readonly levelGenerator: LevelGenerator,
    private readonly eventsManager: IEventManager,
    private readonly gui: BaseGUI,
    private readonly matchSocket: IMatchSocket,
    private readonly playerDataController: PlayerDataController,
    private readonly ufoFactory: UfoFactory,
  ) {}

  createGameScene(): GameScene {
    return new GameScene(
      this.cameraController,
      this.instancesManager,
      this.gameParams,
      this.levelGenerator,
      this.eventsManager,
      this.gui,
      this.matchSocket,
      this.playerDataController,
      this.ufoFactory.createUfo,
    );
  }
}
