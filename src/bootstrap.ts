import * as THREE from 'three';
import InstanceManager from './systems/InstancesManager';
import CameraController from './systems/CameraController';
import GameParams from './systems/GameParams';
import { type GUIManager } from './systems/gui';
import { type SceneManager } from './scenes/sceneManager';
// import EventManager from './systems/EventManager';
import { inject, injectable } from 'inversify';
import TYPES from './systems/DI/tokens';
import { container } from './systems/DI/inversify.config';

export interface IMain {
  init: () => void;
}

@injectable()
export class Main implements IMain {
  private readonly renderer: THREE.WebGLRenderer;

  constructor(
    @inject(TYPES.InstanceManager)
    private readonly instanceManager: InstanceManager,
    @inject(TYPES.CameraController)
    private readonly cameraController: CameraController,
    @inject(TYPES.GameParams)
    private readonly gameParams: GameParams,
    @inject(TYPES.GUI)
    private readonly guiManager: GUIManager,
    @inject(TYPES.SceneManager)
    private readonly sceneManager: SceneManager,
  ) {
    this.renderer = new THREE.WebGLRenderer();
  }

  init(): void {
    this.renderer.setSize(
      this.gameParams.roomWidth,
      this.gameParams.roomHeight,
    );
    document.body.appendChild(this.renderer.domElement);

    this.renderer.domElement.style.margin = 'auto';

    this.guiManager.setRenderer(this.renderer);
    this.guiManager.setGUI(container.get(TYPES.MenuGUI));

    this.guiManager.init();

    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
    console.log('setting menu scene');
    this.sceneManager.init();
    this.sceneManager.setCurrentScene('menu');
    this.animate();
    this.instanceManager.animate();
  }

  private animate(): void {
    this.renderer.render(
      this.instanceManager.scene,
      this.cameraController.camera,
    );
    window.requestAnimationFrame(this.animate.bind(this));
    this.sceneManager.update();
    this.cameraController.update();
    this.guiManager.update();
  }
}
