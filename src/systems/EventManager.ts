import { injectable } from 'inversify'

export interface IEventManager<T extends string = string> {
  on: (event: T, callback: (...args: any[]) => void) => void
  off: (event: T, callback: (...args: any[]) => void) => void
  emit: (event: T, ...args: any[]) => void
}

@injectable()
export default class EventManager<T extends string = string> implements IEventManager<T> {
  eventMap = {} as Record<T, Set<(...args: any[]) => void>>

  on (event: T, callback: (...args: any[]) => void): void {
    if (this.eventMap[event] === undefined) {
      this.eventMap[event] = new Set()
    }

    this.eventMap[event].add(callback)
  }

  off (event: T, callback: (...args: any[]) => void): void {
    if (this.eventMap[event] === undefined) {
      return
    }

    this.eventMap[event].delete(callback)
  }

  emit (event: T, ...args: any[]): void {
    if (this.eventMap[event] === undefined) {
      return
    }

    this.eventMap[event].forEach((cb: any) => cb(...args))
  }
}
