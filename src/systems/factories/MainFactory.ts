import { Main } from '@/bootstrap';
import { EventManager } from '..';
import CameraController from '../CameraController';
import GameParams from '../GameParams';
import MatchGUI from '@/systems/gui/MatchGUI';
import LevelGenerator from '../LevelGenerator';
import MatchSocket from '../http/matchSocket';
import PlayerDataController from '../PlayerDataController';
import Random from '../Random';
import { PlanetFactory } from './PlanetFatory';
import UfoFactory from './UfoFactory';
import { GUIManager } from '../gui';
import InstancesManager from '../InstancesManager';
import { GameSceneFactory } from './GameSceneFactory';

export const mainFactory = (): Main => {
  const instancesManager = new InstancesManager();
  const cameraController = new CameraController();
  const eventsManager = new EventManager();
  const gameParams = new GameParams(eventsManager);
  const gui = new MatchGUI(gameParams);
  const guiManager = new GUIManager();
  const random = new Random(eventsManager);
  const planetFactory = new PlanetFactory(instancesManager, gameParams, random);
  const levelGenerator = new LevelGenerator(
    gameParams,
    cameraController,
    instancesManager,
    random,
    eventsManager,
    planetFactory.createPlanet.bind(planetFactory),
  );
  const matchmakingSocket = new MatchSocket(eventsManager);
  const playerDataController = new PlayerDataController();
  const ufoFactory = new UfoFactory(instancesManager, gameParams);
  // const currentScene = new GameScene(
  // );
  const gameSceneFactory = new GameSceneFactory(
    cameraController,
    instancesManager,
    gameParams,
    levelGenerator,
    eventsManager,
    gui,
    matchmakingSocket,
    playerDataController,
    ufoFactory,
  );

  const currentScene = gameSceneFactory.createGameScene();

  const main = new Main(
    instancesManager,
    cameraController,
    gameParams,
    guiManager,
    currentScene,
  );
  return main;
};
