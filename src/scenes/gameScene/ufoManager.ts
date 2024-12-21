import Player from '@/components/Player';
import TYPES from '@/systems/DI/tokens';
import InstancesManager from '@/systems/InstancesManager';
import { CreateUfo } from '@/systems/factories/UfoFactory';
import { inject } from 'inversify';

export class UfoManager {
  timing = 10;
  private readonly intervalId: number;
  constructor(
    @inject(TYPES.UfoFactory)
    private readonly ufoFactory: CreateUfo,
  ) {
    this.intervalId = setInterval(() => {
      this.timing -= 1000;

      if (this.timing <= 0) {
        this.createUfo();
        this.stop();
      }
    }, 1000);
  }

  stop(): void {
    if (!this.intervalId) return;
    clearInterval(this.intervalId);
  }

  createUfo(): void {
    this.ufoFactory();
  }
}
