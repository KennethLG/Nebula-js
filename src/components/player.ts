import * as THREE from "three";
import Instance from "./instance";
import { SceneManager, KeyboardManager } from "../systems";
import Planet from "./planet";
import { Vector3, threeVec3 } from "../systems/util/vector";

export default class Player extends Instance {
  private readonly keyboardManager: KeyboardManager;
  private readonly boundingSphere: THREE.Sphere;
  private readonly velocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private readonly gravity = -5;
  private readonly moveSpeed = 0.05;
  private onGround: boolean = false;
  private readonly jumpForce = 0.2;

  constructor(keyboardManager: KeyboardManager) {
    super({
      name: "Player",
      texturePath: "../../assets/player.png",
      position: new Vector3(3, 3, 0),
    });
    this.keyboardManager = keyboardManager;
    this.boundingSphere = new THREE.Sphere(this.mesh.position, 0.5);
    this.body.addEventListener('collide', (event) => {

    })
  }

  update(): void {
    const planet = SceneManager.instances.find(
      (instance) => instance.name === "Planet"
    ) as Planet;

    this.mesh.position.copy(threeVec3(this.body.position));
    this.boundingSphere.center.copy(this.mesh.position);
  }
}
