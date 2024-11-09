import type IScene from '@/entities/IScene';
import { Injectable } from '@/systems/DI/container';
@Injectable()
export class SceneManager {
  private currentScene: IScene | null;
  constructor() {
    this.currentScene = null;
  }

  init(): void {
    if (!this.currentScene) {
      throw new Error('Can not init scene. Please define a currentScene');
    }
    this.currentScene.init();
  }

  update(): void {
    if (!this.currentScene) {
      throw new Error('Can not update scene. Please define a currentScene');
    }
    this.currentScene.update();
  }

  setCurrentScene(scene: IScene): void {
    this.currentScene = scene;
  }
}
