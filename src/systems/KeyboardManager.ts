import { type IEventManager } from './EventManager';
import { EventTypes } from './eventTypes';

export interface IKeyboardManager {
  keys: Record<string, boolean>;
}

export default class KeyboardManager implements IKeyboardManager {
  keys: Record<string, boolean> = {};

  constructor(private readonly eventManager: IEventManager) {
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
  eventManager: IEventManager,
): IKeyboardManager => {
  return new KeyboardManager(eventManager);
};
