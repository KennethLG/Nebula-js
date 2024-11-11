import { injectable, inject } from 'inversify';
import IScene from '@/entities/IScene';
import TYPES from '@/systems/DI/tokens';

export type SceneType = 'menu' | 'game';
export type CreateScene = (sceneType: SceneType) => IScene;
@injectable()
export class SceneFactory {
  constructor(
    @inject(TYPES.MenuScene) private readonly menuScene: IScene,
    @inject(TYPES.GameScene) private readonly gameScene: IScene,
  ) {}

  createScene(sceneType: SceneType): IScene {
    switch (sceneType) {
      case 'menu':
        return this.menuScene;
      case 'game':
        return this.gameScene;
      default:
        throw new Error('Unknown scene type');
    }
  }
}
