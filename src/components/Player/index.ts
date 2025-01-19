import * as THREE from 'three';
import Instance from '../Instance';
import { applyGravitationalPull, EventManager } from '../../systems';
import type Planet from '../Planet';
import AnimationController from './AnimationController';
import type ISprite from '@/entities/ISprite';
import Sprite from '../Sprite';
import { getNearestPlanet } from '@/systems/util/getNearestPlanet';
import type Explosion from '../UFO/explosion';
import MovementController from '../../systems/MovementController';
import OrientationController from './OrientationController';
import CollisionController from './CollisionController';
import { type IEventManager } from '@/systems/EventManager';
import GameParams from '@/systems/GameParams';
import { EventTypes } from '@/systems/eventTypes';
import { inject, injectable } from 'inversify';
import TYPES from '@/systems/DI/tokens';
import InstanceManager from '@/systems/InstancesManager';

interface AnimationContext {
  xVel: THREE.Vector3;
  dead: boolean;
}

export interface IPlayer extends Instance {
  onGround: boolean;
  gravity: THREE.Vector3;
  xVel: THREE.Vector3;
  yVel: THREE.Vector3;
  planet: Planet | undefined;
  gravityDirection: THREE.Vector3;
  dead: boolean;
  explosionCollision: boolean;
  controllable: boolean;
  playerEvents: IEventManager;
  onGameOver: () => void;
}
@injectable()
export default class Player extends Instance implements IPlayer {
  onGround = false;
  gravity = new THREE.Vector3(0, 0, 0);
  xVel = new THREE.Vector3(0, 0, 0);
  yVel = new THREE.Vector3(0, 0, 0);
  planet: Planet | undefined;
  gravityDirection = new THREE.Vector3(0, 0, 0);
  dead = false;
  explosionCollision = false;
  controllable: boolean;
  private readonly sprite: ISprite;
  private readonly animationController: AnimationController<AnimationContext>;

  constructor(
    @inject(TYPES.InstanceManager)
    private readonly instancesManager: InstanceManager,
    @inject(TYPES.EventManager) private readonly eventManager: EventManager,
    @inject(TYPES.GameParams) private readonly gameParams: GameParams,
    @inject(TYPES.PlayerEventManager) readonly playerEvents: EventManager,
    @inject(TYPES.MovementController)
    private readonly movementController: MovementController,
    @inject(TYPES.OrientationController)
    private readonly orientationController: OrientationController,
    @inject(TYPES.CollisionController)
    private readonly collisionController: CollisionController,
    controllable: boolean,
    id?: number,
    position?: THREE.Vector3,
  ) {
    const sprite = new Sprite({
      name: 'player.png',
      xTiles: 3,
      yTiles: 2,
    });

    super({
      name: 'Player',
      position: position ?? new THREE.Vector3(0, 0, 0),
      radius: 0.5,
      mesh: sprite.sprite,
      id,
    });

    this.sprite = sprite;

    this.animationController = new AnimationController(
      this.sprite,
      [
        {
          name: 'idle',
          sequence: [0],
          speed: 1,
          condition: (context) =>
            context.xVel.lengthSq() === 0 && !context.dead,
        },
        {
          name: 'running',
          sequence: [3, 4, 5],
          speed: 0.5,
          condition: (context) =>
            context.xVel.lengthSq() !== 0 && !context.dead,
        },
        {
          name: 'dead',
          sequence: [1],
          speed: 1,
          condition: (context) => {
            return context.dead;
          },
        },
      ],
      'idle',
    );
    this.controllable = controllable;
  }

  init(): void {
    console.log('subscribe gameover');
    this.eventManager.on(EventTypes.GameOver, (data) => {
      if (data.playerId !== this.id) return;
      this.onGameOver();
    });
  }

  onGameOver = (): void => {
    console.log('onGameOver');
    this.dead = true;
    this.eventManager.emit(EventTypes.PlayerDied);
  };

  update(): void {
    this.planet = getNearestPlanet(this.instancesManager, this.body.position);

    if (this.planet == null) return;

    this.gravityDirection = this.getGravityDirection(
      this.body.position,
      this.planet.body.position,
    );

    this.moveX();
    this.manageOrientation();
    this.manageGrounding();
    this.applyForces();

    // animation
    this.animationController.update({
      xVel: this.xVel,
      dead: this.dead,
    });
    this.sprite.update(this.gameParams.clock.getDelta());

    this.checkDeath();
  }

  // Interpolation for other players
  private interpolateMovement(): void {
    const lerpFactor = 0.1; // Smoothing factor; adjust as needed
    const targetPosition = this.body.position.clone().add(this.xVel);

    this.body.position.lerp(targetPosition, lerpFactor);
  }

  private moveX(): void {
    if (this.dead) return;
    this.movementController.handleXMovement(this.body.quaternion, this.xVel);
  }

  private getGravityDirection(
    from: THREE.Vector3,
    to: THREE.Vector3,
  ): THREE.Vector3 {
    return new THREE.Vector3().subVectors(to, from).normalize();
  }

  private applyForces(): void {
    this.body.position.add(this.gravity);
    this.body.position.add(this.xVel);
  }

  private updateFacing(): void {
    const orientation = this.orientationController.getXOrientation();
    if (orientation === -1 && !this.sprite.flipped) {
      this.sprite.flipHorizontally();
      return;
    }

    if (orientation === 1 && this.sprite.flipped) {
      this.sprite.flipHorizontally();
    }
  }

  private manageOrientation(): void {
    this.orientationController.alignWithGravity({
      gravityDirection: this.gravityDirection,
      quaternion: this.body.quaternion,
    });
    this.updateFacing();
    this.sprite.rotateFromQuaternion(this.body.quaternion);
  }

  private manageGrounding(): void {
    if (this.planet == null) return;

    this.onGround = this.collisionController.areColliding(this, this.planet);
    if (!this.onGround) {
      applyGravitationalPull(this.gravityDirection, this.gravity);
      return;
    }
    this.collisionController.handleCircularCollision({
      from: this,
      to: this.planet,
      velocity: this.gravity,
    });
    if (this.dead) return;
    this.movementController.handleJump(this.gravityDirection, this.gravity);
  }

  private getCollidingExplosion(): Explosion | undefined {
    const explosions = this.instancesManager.instances.filter(
      (inst) => inst.name === 'Explosion',
    ) as Explosion[];

    if (explosions.length === 0) return;

    const collidingExplosion = explosions.find((explosion) => {
      return (
        this.body.position.distanceTo(explosion.body.position) <
        explosion.radius + 1
      );
    });

    return collidingExplosion;
  }

  private checkDeath(): void {
    const explosion = this.getCollidingExplosion();
    this.explosionCollision = explosion != null;
  }

  onDestroy(): void {
    this.eventManager.off('gameOver', this.onGameOver);
  }
}
