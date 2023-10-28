import * as THREE from "three";
import Instance from "./instance";
import { SceneManager, KeyboardManager} from "../systems";
import Planet from "./planet";

export default class Player extends Instance {
  private readonly moveSpeed = 0.1;
  private readonly velocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private readonly keyboardManager: KeyboardManager;
  private readonly gravity: number = -0.01;
  private readonly boundingSphere: THREE.Sphere;

  constructor(keyboardManager: KeyboardManager) {
    super({
      name: "Player",
      texturePath: "../../assets/player.png",
      position: new THREE.Vector3(0, 0, 0),
    });
    this.keyboardManager = keyboardManager;
    this.boundingSphere = new THREE.Sphere(this.mesh.position, 0.5);
  }

  update(): void {

    const planet = SceneManager.instances.find(instance => instance.name === 'Planet') as Planet;
    if (planet.boundingSphere.intersectsSphere(this.boundingSphere)) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += this.gravity;
    }

    if (this.keyboardManager.keys["ArrowUp"]) {
      this.velocity.y = this.moveSpeed;
    }
    this.mesh.position.add(this.velocity);
    this.boundingSphere.center.copy(this.mesh.position);
  }
}