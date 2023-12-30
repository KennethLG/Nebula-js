import * as THREE from "three";
import Instance from "./instance";
import { KeyboardManager } from "../systems";
import { Vector3 } from "../systems/util/vector";

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
  }

  update(): void {

  }
}
