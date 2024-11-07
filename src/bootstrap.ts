import * as THREE from 'three';
import { type IInstancesManager } from './systems/InstancesManager';
import { type ICameraController } from './systems/CameraController';
import { type IGameParams } from './systems/GameParams';
import type IScene from './entities/IScene';
import { type GUIManager } from './systems/gui';
import { MenuGUI } from './systems/gui/MenuGUI';

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

    private readonly currentScene: IScene,
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
    this.guiManager.setGUI(new MenuGUI());

    this.guiManager.init();

    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    this.currentScene.init();
    this.animate();
    this.instancesManager.animate();
  }

  private animate(): void {
    this.renderer.render(
      this.instancesManager.scene,
      this.cameraController.camera,
    );
    window.requestAnimationFrame(this.animate.bind(this));
    this.currentScene.update();
    this.cameraController.update();
    this.guiManager.update();
  }
}
