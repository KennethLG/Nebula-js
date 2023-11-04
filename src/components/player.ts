import * as THREE from "three";
import * as CANNON from "cannon-es";
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
    const playerMaterial = new CANNON.Material("playerMaterial");
    this.body.material = playerMaterial;
    const planet = SceneManager.instances.find(
      (instance) => instance.name === "Planet"
    ) as Planet;

    if (planet) {
      const planetMaterial = new CANNON.Material("planetMaterial");
      const playerPlanetContactMaterial = new CANNON.ContactMaterial(
        playerMaterial,
        planetMaterial,
        {
          friction: 0.0, // Adjust friction as needed
          restitution: 0.0, // Adjust restitution (bounciness) as needed
        }
      );
      SceneManager.physicsWorld.addContactMaterial(playerPlanetContactMaterial);
    }

    if (this.body.material) {
      this.body.material.restitution = 0.2;
    }
    
  }

  update(): void {
    const planet = SceneManager.instances.find(
      (instance) => instance.name === "Planet"
    ) as Planet;

    const gravityDirection = new CANNON.Vec3(
      planet.mesh.position.x - this.mesh.position.x,
      planet.mesh.position.y - this.mesh.position.y,
      planet.mesh.position.z - this.mesh.position.z
    ).unit();
    
    // gravityDirection.scale(-1);

    // Apply the gravity force
    this.body.applyForce(
      gravityDirection.scale(-this.gravity),
      this.body.position
    );

    // Handle user input and update the player's movement

    // Update the Three.js mesh position to match the Cannon.js body position
    this.mesh.position.copy(threeVec3(this.body.position));

    // const playerToPlanet = new THREE.Vector3().subVectors(
    //   planet.mesh.position,
    //   this.mesh.position
    // );

    // const distance = playerToPlanet.length();
    // const gravityDirection = playerToPlanet.clone().normalize();
    // const gravityMagnitude = this.gravity / (distance * distance);

    // if (!this.onGround) {
    //   this.body.velocity.vsub().
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
