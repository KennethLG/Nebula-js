import { type EventMap, type EventType } from './eventTypes';

export interface IEventManager {
  on: <T extends keyof EventMap>(
    event: T,
    callback: (payload: EventMap[T]) => void,
  ) => void;
  off: <T extends keyof EventMap>(
    event: T,
    callback: (payload: EventMap[T]) => void,
  ) => void;
  emit: <T extends keyof EventMap>(event: T, payload?: EventMap[T]) => void;
}

export default class EventManager implements IEventManager {
  private eventMap: Record<EventType, Set<(payload: any) => void>> =
    {} as Record<EventType, Set<(payload: any) => void>>;

  on<K extends keyof EventMap>(
    event: K,
    callback: (payload: EventMap[K]) => void,
  ): void {
    if (!this.eventMap[event]) {
      this.eventMap[event] = new Set();
    }
    this.eventMap[event].add(callback);
  }

  off<K extends keyof EventMap>(
    event: K,
    callback: (payload: EventMap[K]) => void,
  ): void {
    this.eventMap[event]?.delete(callback);
  }

  emit<K extends keyof EventMap>(event: K, payload?: EventMap[K]): void {
    this.eventMap[event]?.forEach((cb) => {
      cb(payload);
    });
  }
}
