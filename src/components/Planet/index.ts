import * as THREE from 'three';
import Instance from '../Instance';
import type ISprite from '@/entities/ISprite';
import Sprite from '../Sprite';
import GameParams from '@/systems/GameParams';
import InstanceManager from '@/systems/InstancesManager';
import Random from '@/systems/Random';
import { inject } from 'inversify';
import TYPES from '@/systems/DI/tokens';

export interface PlanetProperties {
  radius?: number;
  color: THREE.ColorRepresentation;
}

export interface IPlanet extends Instance {
  boundingSphere: THREE.Sphere;
  geometry: THREE.CircleGeometry;
  color: THREE.ColorRepresentation;
  decorations: ISprite[];
}

export default class Planet extends Instance implements IPlanet {
  boundingSphere = new THREE.Sphere();
  geometry: THREE.CircleGeometry;
  color: THREE.ColorRepresentation;
  decorations: ISprite[];

  @inject(TYPES.InstanceManager)
  private readonly instancesManager!: InstanceManager;

  @inject(TYPES.GameParams)
  private readonly gameParams!: GameParams;

  @inject(TYPES.Random)
  private readonly random!: Random;

  constructor(x: number, y: number, properties?: PlanetProperties) {
    const geometry = new THREE.CircleGeometry(properties?.radius);
    const color = properties?.color ?? 0x00ff00;
    const material = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    super({
      name: 'Planet',
      position: new THREE.Vector3(x, y, 0),
      radius: properties?.radius ?? 1,
      mesh,
    });
    this.boundingSphere = new THREE.Sphere(
      this.body.position,
      properties?.radius,
    );
    this.geometry = geometry;
    this.geometry.translate(0, 0, 0);
    this.color = color;
    this.decorations = this.createDecorations();
  }

  private createDecorations(): ISprite[] {
    const { x, y } = this.body.position;
    const { radius } = this.boundingSphere;
    return Array.from({ length: 10 }).map(() => {
      const sprite = new Sprite({
        name: 'planet-decoration.png',
        xTiles: 6,
        yTiles: 1,
      });
      const randomIndex = this.random.seed.randomRange(0, 5);
      sprite.loop([Math.round(randomIndex)], 1);
      const spritePosition = new THREE.Vector3(
        x + this.random.seed.randomRange(-radius, radius),
        y + this.random.seed.randomRange(-radius, radius),
        0,
      );
      sprite.sprite.position.copy(spritePosition);
      return sprite;
    });
  }

  update(): void {
    this.decorations.forEach((decoration) => {
      decoration.update(this.gameParams.clock.getDelta());
    });
  }

  onDestroy(): void {
    this.decorations.forEach((decoration) => {
      this.instancesManager.scene.remove(decoration.sprite);
    });
  }
}
