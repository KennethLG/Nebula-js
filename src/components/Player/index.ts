import * as THREE from "three";
import Instance from "../instance";
import {
  SceneManager,
  GravitationalPull,
  KeyboardManager,
  EventManager,
} from "../../systems";
import Planet from "../planet";
import { Vector3 } from "../../systems/util/vector";
import OrientationController from "./OrientationController";
import CollisionController from "./CollisionController";
import MovementController from "./MovementController";

export default class Player extends Instance {
  private readonly movementController: MovementController;
  private readonly orientationController: OrientationController;
  private readonly collisionController: CollisionController;

  onGround = false;
  gravity = new THREE.Vector3(0, 0, 0);
  xVel = new THREE.Vector3(0, 0, 0);
  yVel = new THREE.Vector3(0, 0, 0);
  velocity = new THREE.Vector3(0, 0, 0);
  planet: Planet;
  gravityDirection = new THREE.Vector3(0, 0, 0);

  constructor() {
    super({
      name: "Player",
      texturePath: "../../assets/player.png",
      position: new Vector3(5, 2, 0),
      geometry: new THREE.CircleGeometry(0.5),
    });
    const eventManager = new EventManager();
    const keyboardManager = new KeyboardManager(eventManager);
    this.movementController = new MovementController(keyboardManager);
    this.orientationController = new OrientationController();
    this.collisionController = new CollisionController();
    this.planet = SceneManager.instances.find(
      (inst) => inst.name === "Planet"
    ) as Planet;
  }

  update(): void {
    this.gravityDirection = this.getGravityDirection(
      this.mesh.position,
      this.planet.mesh.position
    );
    this.onGround = this.collisionController.areColliding(this, this.planet);

    this.orientationController.apply({
      gravityDirection: this.gravityDirection,
      mesh: this.mesh,
    });
    if (!this.onGround) {
      GravitationalPull.apply(
        this.gravityDirection,
        this.gravity
      );
    } else {
      this.collisionController.handleCircularCollision({
        from: this,
        to: this.planet,
        velocity: this.gravity,
      });
      this.movementController.handleJump(this);
    }
    this.movementController.handleXMovement(this);
    this.applyForces();
  }

  private getGravityDirection(from: THREE.Vector3, to: THREE.Vector3) {
    return new THREE.Vector3().subVectors(to, from).normalize();
  }

  private applyForces() {
    this.mesh.position.add(this.gravity);
    this.mesh.position.add(this.xVel);
  }
}
