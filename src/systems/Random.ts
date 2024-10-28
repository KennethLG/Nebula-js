import { type IEventManager } from './EventManager';

export interface IRandom {
  seed: Seed;
}

class Seed {
  private current: number;
  constructor(public seed: number) {
    this.current = seed;
  }

  resetCurrent(): void {
    this.current = this.seed;
  }

  next(): number {
    const a = 1664525;
    const c = 1013904223;
    const m = 2 ** 32;

    this.current = (a * this.current + c) % m;
    return this.current / m;
  }

  randomRange(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
}

export default class Random implements IRandom {
  private _seed: Seed | null;

  constructor(private readonly eventManager: IEventManager) {
    this._seed = null;

    this.eventManager.on('matchFound', (data) => {
      this._seed = new Seed(data.seed);
    });
  }

  public get seed(): Seed {
    if (this._seed !== null) {
      return this._seed;
    }
    throw new Error('Seed not initialized');
  }
}
