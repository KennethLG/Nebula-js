import * as THREE from "three";
import * as CANNON from "cannon";
import Instance from "./instance";
import { SceneManager, KeyboardManager } from "../systems";
import Planet from "./planet";

export default class Player extends Instance {
  private readonly keyboardManager: KeyboardManager;
  private readonly boundingSphere: THREE.Sphere;
  private readonly velocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private readonly gravity = -0.05;
  private readonly moveSpeed = 0.05;
  private onGround: boolean = false;
  private readonly jumpForce = 0.2;

  constructor(keyboardManager: KeyboardManager) {
    super({
      name: "Player",
      texturePath: "../../assets/player.png",
      position: new THREE.Vector3(3, 3, 0),
    });
    this.keyboardManager = keyboardManager;
    this.boundingSphere = new THREE.Sphere(this.mesh.position, 0.5);
  }

  update(): void {
    const planet = SceneManager.instances.find(
      (instance) => instance.name === "Planet"
    ) as Planet;
    // const playerToPlanet = new THREE.Vector3().subVectors(
    //   planet.mesh.position,
    //   this.mesh.position
    // );

    // const distance = playerToPlanet.length();
    // const gravityDirection = playerToPlanet.clone().normalize();
    // const gravityMagnitude = this.gravity / (distance * distance);

    // if (!this.onGround) {
    //   this.velocity.sub(gravityDirection.multiplyScalar(gravityMagnitude));
    //   if (
    //     distance <=
    //     this.boundingSphere.radius + planet.boundingSphere.radius
    //   ) {
    //     // const collisionPoint = gravityDirection
    //     //   .clone()
    //     //   .multiplyScalar(
    //     //     planet.boundingSphere.radius + this.boundingSphere.radius
    //     //   );
    //     // this.mesh.position.copy(
    //     //   planet.mesh.position.clone().add(collisionPoint)
    //     // );
    //     this.velocity.set(0, 0, 0);
    //     this.onGround = true;
    //   }
    // } else {
    //   if (this.keyboardManager.keys["ArrowUp"]) {
    //     const jumpDirection = gravityDirection
    //       .clone()
    //       .multiplyScalar(-this.jumpForce);
    //     this.velocity.add(jumpDirection);
    //     this.onGround = false;
    //   }
    // }

    // this.mesh.position.add(this.velocity);
    this.boundingSphere.center.copy(this.mesh.position);
  }
}
