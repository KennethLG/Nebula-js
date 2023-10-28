import * as THREE from "three";
import Player from "./components/player";
import { EventManager, KeyboardManager, SceneManager } from "./systems";
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
    this.camera.position.z = 5;
    this.renderer = new THREE.WebGLRenderer();
    this.eventManager = new EventManager();
    this.keyboardManager = new KeyboardManager(this.eventManager);
    this.animate = this.animate.bind(this);
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    const player = new Player(this.keyboardManager);
    const planet = new Planet();
    this.sceneManager.add(player);
    this.sceneManager.add(planet);
    this.animate();
  }

  private animate() {
    requestAnimationFrame(this.animate);
    this.sceneManager.update();
    this.renderer.render(this.sceneManager.scene, this.camera);
  }
}

const main = new Main();
main.init();