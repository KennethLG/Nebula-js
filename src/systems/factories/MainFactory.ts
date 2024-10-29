import { Main } from '@/bootstrap';
import { EventManager, SceneManager } from '..';
import CameraController from '../CameraController';
import GameParams from '../GameParams';
import GUI from '../GUI';
import GameScene from '@/scenes/gameScene/GameScene';
import LevelGenerator from '../LevelGenerator';
import MatchSocket from '../http/matchSocket';
import PlayerDataController from '../PlayerDataController';
import Random from '../Random';
import { PlanetFactory } from './PlanetFatory';
import UfoFactory from './UfoFactory';

export const mainFactory = (): Main => {
  const sceneManager = new SceneManager();
  const cameraController = new CameraController();
  const eventsManager = new EventManager();
  const gameParams = new GameParams(eventsManager);
  const gui = new GUI(gameParams);
  const random = new Random(eventsManager);
  const planetFactory = new PlanetFactory(sceneManager, gameParams, random);
  const levelGenerator = new LevelGenerator(
    gameParams,
    cameraController,
    sceneManager,
    random,
    eventsManager,
    planetFactory.createPlanet.bind(planetFactory),
  );
  const matchmakingSocket = new MatchSocket(eventsManager);
  const playerDataController = new PlayerDataController();
  const ufoFactory = new UfoFactory(sceneManager, gameParams);
  const currentScene = new GameScene(
    cameraController,
    sceneManager,
    gameParams,
    levelGenerator,
    eventsManager,
    gui,
    matchmakingSocket,
    playerDataController,
    ufoFactory.createUfo,
  );
  const main = new Main(
    sceneManager,
    cameraController,
    gameParams,
    gui,
    currentScene,
  );
  return main;
};
