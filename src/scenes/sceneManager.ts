import type IScene from '@/entities/IScene';
import { EventManager } from '@/systems';
import TYPES from '@/systems/DI/tokens';
import { EventTypes } from '@/systems/eventTypes';
import { inject } from 'inversify';
import { CreateScene, SceneType } from './sceneFactory';

export interface ISceneManager {
  init: () => void;
  update: () => void;
  setCurrentScene: (scene: IScene) => void;
}
export class SceneManager {
  @inject(TYPES.EventManager)
  private readonly eventManager!: EventManager;

  @inject(TYPES.SceneFactory)
  private readonly sceneFactory!: CreateScene;

  private currentScene: IScene | null;

  constructor() {
    this.currentScene = null;
  }

  init(): void {
    this.eventManager.on(EventTypes.ChangeScene, (scene: SceneType) => {
      this.setCurrentScene(scene);
    });
  }

  update(): void {
    if (!this.currentScene) {
      throw new Error('Can not update scene. Please define a currentScene');
    }
    this.currentScene.update();
  }

  setCurrentScene(scene: SceneType): void {
    this.currentScene = this.sceneFactory(scene);
    this.currentScene.init();
  }
}
