import * as THREE from "three";
import EventManager from "./systems/EventManager";
import Player from "./components/player";

class Main {
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly eventManager: EventManager;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;
    this.renderer = new THREE.WebGLRenderer();
    this.eventManager = new EventManager();
    this.animate = this.animate.bind(this);
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    const player = new Player(this.eventManager);
    this.scene.add(player.mesh);

    this.animate();
  }

  private animate() {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  }
}

const main = new Main();
main.init();