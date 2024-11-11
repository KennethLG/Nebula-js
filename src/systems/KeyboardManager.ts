import { inject, injectable } from 'inversify';
import EventManager from './EventManager';
import { EventTypes } from './eventTypes';
import TYPES from './DI/tokens';

export interface IKeyboardManager {
  keys: Record<string, boolean>;
}

@injectable()
export default class KeyboardManager implements IKeyboardManager {
  keys: Record<string, boolean> = {};

  constructor(
    @inject(TYPES.EventManager)
    private readonly eventManager: EventManager,
  ) {
    window.addEventListener(EventTypes.Keydown, this.onKeyDown.bind(this));
    window.addEventListener(EventTypes.Keyup, this.onKeyUp.bind(this));
  }

  private onKeyDown(event: KeyboardEvent): void {
    console.log('Keydown emitted:', event.key);
    this.keys[event.key] = true;
    this.eventManager.emit(EventTypes.Keydown, event.key);
  }

  private onKeyUp(event: KeyboardEvent): void {
    this.keys[event.key] = false;
    console.log('Keyup emitted:', event.key);
    this.eventManager.emit(EventTypes.Keyup, event.key);
  }
}

export const keyboardManagerFactory = (
  eventManager: EventManager,
): IKeyboardManager => {
  return new KeyboardManager(eventManager);
};
