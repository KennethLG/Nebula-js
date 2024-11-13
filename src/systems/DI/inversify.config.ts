import { Container, type interfaces } from 'inversify';
import TYPES from './tokens';
import { Main } from '@/bootstrap';
import EventManager from '../EventManager';
import InstanceManager from '../InstancesManager';
import { SceneManager } from '@/scenes/sceneManager';
import CameraController from '../CameraController';
import GameParams from '../GameParams';
import { GUIManager } from '../gui';
import { CreateScene, SceneType } from '@/scenes/sceneFactory';
import PlayerDataController from '../PlayerDataController';
import MatchGUI from '../gui/MatchGUI';
import MatchSocket from '../http/matchSocket';
import { MenuScene } from '@/scenes/menuScene';
import GameScene from '@/scenes/gameScene/GameScene';
import SceneSync from '@/scenes/gameScene/SceneSync';
import LevelGenerator from '../LevelGenerator';
import Random from '../Random';
import Player from '@/components/Player';
import Planet, { PlanetProperties } from '@/components/Planet';
import PlayerStateSocket from '../http/playerStateSocket';
import { Socket } from 'socket.io-client';
import Ufo from '@/components/UFO';
import { MenuGUI } from '../gui/MenuGUI';
import IScene from '@/entities/IScene';

const container = new Container();

const registerFactory = <T, K extends unknown[]>(
  key: symbol,
  Service: new (...args: K) => T,
): void => {
  console.log('registered factory!', key);
  container.bind<interfaces.Factory<T>>(key).toFactory<T, K>((_context) => {
    return (...params: K) => {
      return new Service(...params);
    };
  });
};

const registerSingleton = <T>(
  key: symbol,
  service: interfaces.Newable<T>,
): void => {
  container.bind(key).to(service).inSingletonScope();
  console.log('registered singleton!', key);
};

const registerTransient = <T>(
  key: symbol,
  service: interfaces.Newable<T>,
): void => {
  container.bind(key).to(service).inTransientScope();
  console.log('registered transient!', key);
};

const registerServices = (): void => {
  registerSingleton(TYPES.EventManager, EventManager);
  registerSingleton(TYPES.Random, Random);
  registerSingleton(TYPES.InstanceManager, InstanceManager);
  registerSingleton(TYPES.CameraController, CameraController);
  registerSingleton(TYPES.GameParams, GameParams);
  registerSingleton(TYPES.GUI, GUIManager);
  registerSingleton(TYPES.SceneManager, SceneManager);
  registerSingleton(TYPES.PlayerDataController, PlayerDataController);

  registerFactory<Planet, [number, number, PlanetProperties]>(
    TYPES.PlanetFactory,
    Planet,
  );
  registerFactory<Player, [boolean, number, THREE.Vector3]>(
    TYPES.PlayerFactory,
    Player,
  );

  registerFactory<PlayerStateSocket, [Socket]>(
    TYPES.PlayerStateSocketFactory,
    PlayerStateSocket,
  );
  registerTransient(TYPES.MatchSocket, MatchSocket);
  registerSingleton(TYPES.MatchGUI, MatchGUI);
  registerSingleton(TYPES.MenuGUI, MenuGUI);
  registerFactory(TYPES.UfoFactory, Ufo);

  registerSingleton(TYPES.SceneSync, SceneSync);

  // registerSingleton(TYPES.MenuScene, MenuScene);
  // registerTransient(TYPES.GameScene, GameScene);
  container.bind(TYPES.Scene).to(MenuScene).whenTargetNamed('menu');
  container.bind(TYPES.Scene).to(GameScene).whenTargetNamed('game');
  container
    .bind<interfaces.Factory<CreateScene>>(TYPES.SceneFactory)
    .toFactory<IScene, any>((context: interfaces.Context) => {
      return (sceneType: SceneType) => {
        return context.container.getNamed<IScene>(TYPES.Scene, sceneType);
      };
    });
  registerSingleton(TYPES.LevelGenerator, LevelGenerator);
  registerSingleton(TYPES.Main, Main);
};

registerServices();
console.log('registered services!');

export { container };
