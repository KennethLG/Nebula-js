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
import MovementController from '../MovementController';
import OrientationController from '@/components/Player/OrientationController';
import CollisionController from '@/components/Player/CollisionController';
import { keyboardManagerFactory } from '../KeyboardManager';
import { UfoManager } from '@/scenes/gameScene/UfoManager';

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  container.get(TYPES.Random);
  registerSingleton(TYPES.InstanceManager, InstanceManager);
  registerSingleton(TYPES.CameraController, CameraController);
  registerSingleton(TYPES.GameParams, GameParams);
  registerSingleton(TYPES.GUI, GUIManager);
  registerSingleton(TYPES.SceneManager, SceneManager);
  registerSingleton(TYPES.PlayerDataController, PlayerDataController);

  container
    .bind<interfaces.Factory<Planet>>(TYPES.PlanetFactory)
    .toFactory<Planet, any>((context) => {
      return (x: number, y: number, properties: PlanetProperties) => {
        return new Planet(
          context.container.get(TYPES.InstanceManager),
          context.container.get(TYPES.GameParams),
          context.container.get(TYPES.Random),
          x,
          y,
          properties,
        );
      };
    });

  container
    .bind<Player>(TYPES.PlayerFactory)
    .toFactory<Player, any>((context) => {
      return (controllable: boolean, id: number, position: THREE.Vector3) => {
        const childContainer = container.createChild();
        childContainer
          .bind(TYPES.PlayerEventManager)
          .to(EventManager)
          .inSingletonScope();

        if (controllable) {
          keyboardManagerFactory(childContainer.get(TYPES.PlayerEventManager));
        }
        childContainer.bind(TYPES.MovementController).to(MovementController);
        childContainer
          .bind(TYPES.OrientationController)
          .to(OrientationController);
        childContainer.bind(TYPES.CollisionController).to(CollisionController);

        return new Player(
          context.container.get(TYPES.InstanceManager),
          context.container.get(TYPES.EventManager),
          context.container.get(TYPES.GameParams),
          childContainer.get(TYPES.PlayerEventManager),
          childContainer.get(TYPES.MovementController),
          childContainer.get(TYPES.OrientationController),
          childContainer.get(TYPES.CollisionController),
          controllable,
          id,
          position,
        );
      };
    });

  container
    .bind<PlayerStateSocket>(TYPES.PlayerStateSocketFactory)
    .toFactory<PlayerStateSocket, any>((_context) => {
      return (socket: Socket) => {
        return new PlayerStateSocket(container.get(TYPES.EventManager), socket);
      };
    });

  container.bind(TYPES.UfoFactory).toFactory<Ufo, any>((context) => {
    return () => {
      return new Ufo(
        context.container.get(TYPES.InstanceManager),
        context.container.get(TYPES.GameParams),
        context.container.get(TYPES.Random),
      );
    };
  });

  registerSingleton(TYPES.MatchSocket, MatchSocket);
  registerSingleton(TYPES.MatchGUI, MatchGUI);
  registerSingleton(TYPES.MenuGUI, MenuGUI);
  // registerFactory(TYPES.UfoFactory, Ufo);
  registerTransient(TYPES.UfoManager, UfoManager);

  registerSingleton(TYPES.SceneSync, SceneSync);

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
