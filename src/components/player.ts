import * as THREE from "three";
import Instance from "./instance";
import {
  SceneManager,
  KeyboardManager,
  MovementController,
  GravitationalPull,
} from "../systems";
import Planet from "./planet";
import { Vector3 } from "../systems/util/vector";

interface PlayerConfig {
  keyboardManager: KeyboardManager;
  movementController: MovementController;
}

export default class Player extends Instance {
  private readonly keyboardManager: KeyboardManager;
  private readonly movementController: MovementController;
  private readonly boundingSphere: THREE.Sphere;
  private readonly velocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private onGround: boolean = false;
  private readonly gravity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  constructor({ keyboardManager, movementController }: PlayerConfig) {
    super({
      name: "Player",
      texturePath: "../../assets/player.png",
      position: new Vector3(3, 8, 0),
    });
    this.keyboardManager = keyboardManager;
    this.movementController = movementController;
    this.boundingSphere = new THREE.Sphere(this.mesh.position, 0.5);
  }

  update(): void {
    const planet = SceneManager.instances.find(
      (instance) => instance.name === "Planet"
    ) as Planet;

    if (!this.onGround) {
      const gravityDirection = GravitationalPull.apply(
        this,
        planet,
        this.velocity
      );
      this.gravity.set(
        gravityDirection.x,
        gravityDirection.y,
        gravityDirection.z
      );
    }

    this.movementController.apply(
      this.keyboardManager,
      this,
      this.onGround,
      this.gravity,
      this.velocity
    );

    this.mesh.position.add(this.velocity);

    this.checkCollisionWithPlanet(planet);
    this.rotate(planet);
  }

  private checkCollisionWithPlanet(planet: Planet): void {
    const toPlanetCenter = new THREE.Vector3().subVectors(
      planet.mesh.position,
      this.mesh.position
    );
    const distanceToPlanet =
      toPlanetCenter.length() -
      // this.boundingSphere.radius -
      planet.boundingSphere.radius;

    if (distanceToPlanet <= 0) {
      this.onGround = true;
      this.velocity.set(0, 0, 0);
    } else {
      this.onGround = false;
    }
  }

  private rotate(planet: Planet) {
    const toPlanetCenter = new THREE.Vector3().subVectors(
      planet.mesh.position,
      this.mesh.position
    );
    const desiredUp = toPlanetCenter.normalize().negate();

    // Calculate the player's current up vector in world space
    const currentUp = new THREE.Vector3(0, 1, 0);
    currentUp.applyQuaternion(this.mesh.quaternion);

    // Calculate the quaternion that represents the rotation
    // from the player's current up vector to the desired up vector
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      currentUp,
      desiredUp
    );

    // Apply the quaternion to the player's mesh to perform the rotation
    this.mesh.applyQuaternion(quaternion);

    // Correct any potential drift in the other rotations by setting them to 0
    this.mesh.rotation.x = 0;
    this.mesh.rotation.y = 0;

    // Update the player's up vector to the new orientation
    this.mesh.up.copy(desiredUp);
    this.mesh.scale.x = this.getFacing();
  }

  private getFacing() {
    if (this.velocity.x > 0) {
      return 1;
    }
    return -1;
  }
}
