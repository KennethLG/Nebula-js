export default class EventManager<T extends string = string> {
  eventMap = {} as Record<T, Set<(...args: any[]) => void>>;

  on(event: T, callback: (...args: any[]) => void) {
    if (!this.eventMap[event]) {
      this.eventMap[event] = new Set();
    }

    this.eventMap[event].add(callback);
  }

  off(event: T, callback: (...args: any[]) => void) {
    if (!this.eventMap[event]) {
      return;
    }

    this.eventMap[event].delete(callback);
  }

  emit(event: T, ...args: any[]) {
    if (!this.eventMap[event]) {
      return;
    }

    this.eventMap[event].forEach((cb: any) => cb(...args));
  }
}
