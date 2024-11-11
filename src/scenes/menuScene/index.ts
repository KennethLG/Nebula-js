import type IScene from '@/entities/IScene';
import { EventManager } from '@/systems';
import TYPES from '@/systems/DI/tokens';
import { EventTypes } from '@/systems/eventTypes';
import { inject, injectable } from 'inversify';

@injectable()
export class MenuScene implements IScene {
  @inject(TYPES.EventManager)
  private readonly eventManager!: EventManager;

  init(): void {
    this.eventManager.on(EventTypes.StartGame, () => {
      this.eventManager.emit(EventTypes.ChangeScene, 'game');
    });
  }

  update(): void {}
}
