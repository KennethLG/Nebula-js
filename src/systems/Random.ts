import { inject, injectable } from 'inversify';
import EventManager from './EventManager';
import { EventTypes } from './eventTypes';
import TYPES from './DI/tokens';

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

@injectable()
export default class Random implements IRandom {
  private _seed: Seed | null;

  constructor(
    @inject(TYPES.EventManager)
    private readonly eventManager: EventManager,
  ) {
    this._seed = null;
    console.log('Random constructor');

    this.eventManager.on(EventTypes.MatchFound, (data) => {
      this._seed = new Seed(data.seed);
      console.log('Seed initialized', this._seed);
    });
  }

  public get seed(): Seed {
    if (this._seed !== null) {
      return this._seed;
    }
    throw new Error('Seed not initialized');
  }
}
