import * as THREE from 'three';
import Instance from '../Instance';
import Sprite from '../Sprite';
import { randomRange } from '@/systems/util/random';
import { type IInstance } from '@/entities/Instance';
import Bullet from '../Bullet';
import { getNearestPlanet } from '@/systems/util/getNearestPlanet';
import InstancesManager from '@/systems/InstancesManager';
import GameParams from '@/systems/GameParams';
import { inject, injectable } from 'inversify';
import TYPES from '@/systems/DI/tokens';
import Random from '@/systems/Random';

@injectable()
export default class Ufo extends Instance {
  xVel = new THREE.Vector3(0, 0, 0);
  yVel = new THREE.Vector3(0, 0, 0);
  positionTo = new THREE.Vector3(0, 0, 0);
  private readonly changePositionInterval: number;
  private readonly shootInterval: number;

  private target?: IInstance;

  constructor(
    @inject(TYPES.InstanceManager)
    private readonly instancesManager: InstancesManager,
    @inject(TYPES.GameParams)
    private readonly gameParams: GameParams,
    @inject(TYPES.Random)
    private readonly random: Random,
  ) {
    const sprite = new Sprite({
      name: 'ufo.png',
      xTiles: 1,
      yTiles: 1,
    });

    super({
      name: 'Ufo',
      position: new THREE.Vector3(0, 0, 0),
      radius: 0.5,
      mesh: sprite.sprite,
    });
    this.changePositionInterval = setInterval(() => {
      this.changeXPosition();
    }, 4000);
    this.shootInterval = setInterval(() => {
      this.shoot();
    }, 5000);
  }

  defineTarget(instance: Instance): void {
    this.target = instance;
  }

  // searchTarget() {
  //   const players = this.instancesManager.instances.filter(
  //     (instances) => instances.name === 'Player',
  //   );
  //   if (players.length === 0) return;
  //   const index = this.random.seed.randomRange(0, players.length - 1);
  //   this.defineTarget(players[index]);
  // }

  update(): void {
    if (this.target == null) return;

    this.positionTo.y = this.target.body.position.y - 2;

    this.body.position.lerp(this.positionTo, 0.02);
  }

  private changeXPosition(): void {
    this.positionTo.x = randomRange(-4, 4);
  }

  private shoot(): void {
    if (this.gameParams.gameOver) return;
    const position = this.body.position.clone();

    const planet = getNearestPlanet(this.instancesManager, position);

    if (planet == null) return;

    const direction = planet.body.position.clone().sub(position).normalize();

    const bullet = new Bullet(
      {
        position,
        direction,
        speed: 0.1,
      },
      this.instancesManager,
    );

    this.instancesManager.add(bullet);
  }

  onDestroy(): void {
    clearInterval(this.changePositionInterval);
    clearInterval(this.shootInterval);
  }
}
