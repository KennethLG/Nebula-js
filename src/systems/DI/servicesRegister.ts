import { SceneManager } from '@/scenes/sceneManager';
import CameraController from '../CameraController';
import EventManager from '../EventManager';
import GameParams from '../GameParams';
import { GUIManager } from '../gui';
import InstanceManager from '../InstancesManager';
import { type Constructor, Container } from './container';
import PlayerFactory from '../factories/PlayerFactory';

const container = new Container();

const singletonServices: Constructor[] = [
  InstanceManager,
  CameraController,
  EventManager,
  GameParams,
  GUIManager,
  SceneManager,
  PlayerFactory,
];

export const registerServices = (): void => {
  singletonServices.forEach((service) => {
    container.register(service);
  });
};
