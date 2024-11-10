import { Main } from '@/bootstrap';
import { EventManager } from '..';
import CameraController from '../CameraController';
import GameParams from '../GameParams';
import { GUIManager } from '../gui';
import InstancesManager from '../InstancesManager';
import { SceneManager } from '@/scenes/sceneManager';

export const mainFactory = (): Main => {
  const instancesManager = new InstancesManager();
  const cameraController = new CameraController();
  const eventsManager = new EventManager();
  const gameParams = new GameParams(eventsManager);
  const guiManager = new GUIManager();

  const sceneManager = new SceneManager();

  const main = new Main(
    instancesManager,
    cameraController,
    gameParams,
    guiManager,
    sceneManager,
    eventsManager,
  );
  return main;
};
