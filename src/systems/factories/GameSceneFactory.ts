import GameScene from '@/scenes/gameScene/GameScene';
import { type ICameraController } from '../CameraController';
import InstanceManager from '../InstancesManager';
import GameParams, { type IGameParams } from '../GameParams';
import LevelGenerator from '../LevelGenerator';
import { type IEventManager } from '../EventManager';
import { type BaseGUI } from '../gui';
import PlayerDataController from '../PlayerDataController';
import UfoFactory from './UfoFactory';
import Random from '../Random';
import { PlanetFactory } from './PlanetFatory';
import MatchSocket from '../http/matchSocket';

export class GameSceneFactory {
  constructor(
    private readonly cameraController: ICameraController,
    // private readonly instancesManager: IInstancesManager,
    private readonly gameParams: IGameParams,
    // private readonly levelGenerator: LevelGenerator,
    private readonly eventsManager: IEventManager,
    private readonly gui: BaseGUI,
    // private readonly playerDataController: PlayerDataController,
    // private readonly ufoFactory: UfoFactory,
  ) {}

  createGameScene(): GameScene {
    const random = new Random(this.eventsManager);
    const instancesManager = new InstanceManager();
    const gameParams = new GameParams(this.eventsManager);
    const planetFactory = new PlanetFactory(
      instancesManager,
      gameParams,
      random,
    );
    const levelGenerator = new LevelGenerator(
      gameParams,
      this.cameraController,
      instancesManager,
      random,
      this.eventsManager,
      planetFactory.createPlanet,
    );
    const playerDataController = new PlayerDataController();
    const ufoFactory = new UfoFactory(instancesManager, gameParams);
    const matchSocket = new MatchSocket(this.eventsManager);

    return new GameScene(
      this.cameraController,
      instancesManager,
      this.gameParams,
      levelGenerator,
      this.eventsManager,
      this.gui,
      matchSocket,
      playerDataController,
      ufoFactory.createUfo,
    );
  }
}
