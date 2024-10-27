import { type IEventManager } from './EventManager'

export interface IKeyboardManager {
  keys: Record<string, boolean>
}

export default class KeyboardManager implements IKeyboardManager {
  keys: Record<string, boolean> = {}

  constructor (private readonly eventManager: IEventManager) {
    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))
  }

  private onKeyDown (event: KeyboardEvent): void {
    console.log('Keydown emitted:', event.key)
    this.keys[event.key] = true
    this.eventManager.emit('keydown', event.key)
  }

  private onKeyUp (event: KeyboardEvent): void {
    this.keys[event.key] = false
    console.log('Keyup emitted:', event.key)
    this.eventManager.emit('keyup', event.key)
  }
}
