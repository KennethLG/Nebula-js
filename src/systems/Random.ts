import { inject, injectable } from 'inversify'
import { HttpService } from './http'
import TYPES from './DI/tokens';
import { IEventManager } from './EventManager';

export interface IRandom {
  initialized: boolean;
  seed: Seed;
  init: () => Promise<void>
}

class SeedGenerator {

  private readonly httpService = new HttpService();

  async getRemoteSeed() {
    const response = await this.httpService.getSeed();
    console.log("🚀 ~ SeedGenerator ~ getRemoteSeed ~ response:", response)
    if (response) {
      return response.data.seed;
    }
    console.log('could not get seed remotely. Trying locally...');
    return this.getLocalSeed();
  }

  getLocalSeed() {
    return Date.now()
  }
}

class Seed {
  private current: number
  constructor(public seed: number) {
    this.current = seed;
  }

  resetCurrent(): void {
    this.current = this.seed
  }

  next(): number {
    const a = 1664525
    const c = 1013904223
    const m = 2 ** 32

    this.current = (a * this.current + c) % m
    return this.current / m
  }

  randomRange(min: number, max: number): number {
    return min + this.next() * (max - min)
  }
}

@injectable()
export default class Random implements IRandom {
  private _seed: Seed | null;
  public initialized: boolean;

  constructor(
    @inject(TYPES.IEventManager) private readonly eventManager: IEventManager
  ) {
    this._seed = null
    this.initialized = false;
  }

  async init() {
    const seed = await this.getSeed();
    this._seed = new Seed(seed);
    this.initialized = true;
    this.eventManager.emit('seedGenerated');
  }

  private async getSeed() {
    const remote = true;
    const seedGenerator = new SeedGenerator();

    if (remote) {
      return await seedGenerator.getRemoteSeed();
    }
    console.log(this._seed);
    return seedGenerator.getLocalSeed();
  }

  public get seed(): Seed {
    if (this._seed !== null) {
      return this._seed;
    }
    throw new Error('Seed not initialized');
  }
}