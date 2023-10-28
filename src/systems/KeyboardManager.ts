import EventManager from "./EventManager";

export default class KeyboardManager {
  private eventBus: EventManager;
  private keys: { [key: string]: boolean } = {};

  constructor(eventBus: EventManager) {
    this.eventBus = eventBus;
    window.addEventListener("keydown", this.onKeyDown.bind(this));
    window.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  private onKeyDown(event: KeyboardEvent) {
    this.keys[event.key] = true;
    this.eventBus.dispatch("keydown", event.key);
  }

  private onKeyUp(event: KeyboardEvent) {
    this.keys[event.key] = false;
    this.eventBus.dispatch("keyup", event.key);
  }
}