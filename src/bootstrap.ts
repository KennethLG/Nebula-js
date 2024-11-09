import * as THREE from 'three';
import { type IInstancesManager } from './systems/InstancesManager';
import { type ICameraController } from './systems/CameraController';
import { type IGameParams } from './systems/GameParams';
import { type GUIManager } from './systems/gui';
import { MenuGUI } from './systems/gui/MenuGUI';
import { type SceneManager } from './scenes/sceneManager';
import { MenuScene } from './scenes/menuScene';
import { type IEventManager } from './systems/EventManager';

export interface IMain {
  init: () => void;
}

export class Main implements IMain {
  private readonly renderer: THREE.WebGLRenderer;

  constructor(
    private readonly instancesManager: IInstancesManager,
    private readonly cameraController: ICameraController,
    private readonly gameParams: IGameParams,
    private readonly guiManager: GUIManager,
    private readonly sceneManager: SceneManager,
    private readonly eventManager: IEventManager,
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

    // this.guiManager.init(this.renderer);
    this.guiManager.setRenderer(this.renderer);
    const menuGUI = new MenuGUI(this.eventManager);
    this.guiManager.setGUI(menuGUI);

    this.guiManager.init();

    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
    const menuScene = new MenuScene(menuGUI);
    this.sceneManager.setCurrentScene(menuScene);
    this.sceneManager.init();
    this.animate();
    this.instancesManager.animate();
  }

  private animate(): void {
    this.renderer.render(
      this.instancesManager.scene,
      this.cameraController.camera,
    );
    window.requestAnimationFrame(this.animate.bind(this));
    this.sceneManager.update();
    this.cameraController.update();
    this.guiManager.update();
  }
}
