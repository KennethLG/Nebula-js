import { EventManager } from '@/systems';
import TYPES from '@/systems/DI/tokens';
import InstanceManager from '@/systems/InstancesManager';
import { EventTypes } from '@/systems/eventTypes';
import { CreateUfo } from '@/systems/factories/UfoFactory';
import { inject, injectable } from 'inversify';

@injectable()
export class UfoManager {
  timing = 10;
  private intervalId: number | null = null;
  constructor(
    @inject(TYPES.UfoFactory)
    private readonly ufoFactory: CreateUfo,
    @inject(TYPES.EventManager)
    private readonly eventManager: EventManager,
    @inject(TYPES.InstanceManager)
    private readonly instanceManager: InstanceManager,
  ) {
    this.intervalId = null;
  }

  start(): void {
    this.intervalId = setInterval(() => {
      this.timing--;
      this.eventManager.emit(EventTypes.UfoTiming, this.timing);

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
    const ufo = this.ufoFactory();
    this.instanceManager.add(ufo);
  }
}
