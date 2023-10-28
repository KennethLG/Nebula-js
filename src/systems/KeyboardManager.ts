import EventManager from "./EventManager";

export default class KeyboardManager {
  private eventManager: EventManager;
  keys: { [key: string]: boolean } = {};

  constructor(eventManager: EventManager) {
    this.eventManager = eventManager;
    window.addEventListener("keydown", this.onKeyDown.bind(this));
    window.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  private onKeyDown(event: KeyboardEvent) {    
    this.keys[event.key] = true;
    this.eventManager.emit("keydown", event.key);
  }

  private onKeyUp(event: KeyboardEvent) {
    this.keys[event.key] = false;
    this.eventManager.emit("keyup", event.key);
  }
}