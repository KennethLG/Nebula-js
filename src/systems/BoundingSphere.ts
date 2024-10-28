import type IBoundingSphere from '@/entities/IBoundingSphere';

export default class BoundingSphere implements IBoundingSphere {
  radius: number;

  constructor(radius: number) {
    this.radius = radius;
  }
}
