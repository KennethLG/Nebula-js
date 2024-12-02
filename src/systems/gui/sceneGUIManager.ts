import TYPES from '../DI/tokens';
import { BaseGUI } from '.';
import { SceneType } from '@/scenes/sceneFactory';
import { container } from '../DI/inversify.config';

export class SceneGUIManager {
  private readonly sceneGUIs: Map<SceneType, BaseGUI>;
  constructor() {
    this.sceneGUIs = new Map();
    this.sceneGUIs.set('game', container.get(TYPES.MatchGUI));
    this.sceneGUIs.set('menu', container.get(TYPES.MenuGUI));
  }

  setSceneGUI(scene: SceneType): BaseGUI {
    const gui = this.sceneGUIs.get(scene);
    if (!gui) {
      throw new Error(`No GUI found for scene ${scene}`);
    }

    return gui;
  }
}
