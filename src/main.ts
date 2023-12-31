import * as THREE from "three";
import Player from "./components/player";
import { EventManager, KeyboardManager, MovementController, SceneManager } from "./systems";
import Planet from "./components/planet";

class Main {
  private readonly sceneManager: SceneManager;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly eventManager: EventManager;
  private readonly keyboardManager: KeyboardManager;

  constructor() {
    this.sceneManager = new SceneManager();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 10;
    this.renderer = new THREE.WebGLRenderer();
    this.eventManager = new EventManager();
    this.keyboardManager = new KeyboardManager(this.eventManager);
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    const planet = new Planet();
    const player = new Player({
      keyboardManager: this.keyboardManager,
      movementController: new MovementController()
    });
    this.sceneManager.add(player);
    this.sceneManager.add(planet);
    this.animate();
    this.sceneManager.animate();
  }

  animate() {
    this.renderer.render(this.sceneManager.scene, this.camera);
    window.requestAnimationFrame(this.animate.bind(this));
  }
}

const main = new Main();
main.init();