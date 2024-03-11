import { inject, injectable } from 'inversify'
import { type IEventManager } from './EventManager'
import TYPES from './DI/tokens'

export interface IKeyboardManager {
  keys: Record<string, boolean>
}

@injectable()
export default class KeyboardManager implements IKeyboardManager {
  keys: Record<string, boolean> = {}

  constructor (@inject(TYPES.IEventManager) private readonly eventManager: IEventManager) {
    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))
  }

  private onKeyDown (event: KeyboardEvent): void {
    this.keys[event.key] = true
    this.eventManager.emit('keydown', event.key)
  }

  private onKeyUp (event: KeyboardEvent): void {
    this.keys[event.key] = false
    this.eventManager.emit('keyup', event.key)
  }
}
