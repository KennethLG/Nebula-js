import { injectable } from 'inversify'

export const generateSeed = (): number => {
  return Date.now()
}

export interface IRandom {
  next: () => number
  randomRange: (min: number, max: number) => number
  resetCurrent: () => void
}

@injectable()
export default class Random implements IRandom {
  private readonly seed: number
  private current: number

  constructor () {
    this.seed = 1000 // generateSeed()
    this.current = this.seed
  }

  resetCurrent (): void {
    this.current = this.seed
  }

  next (): number {
    const a = 1664525
    const c = 1013904223
    const m = 2 ** 32

    this.current = (a * this.current + c) % m
    return this.current / m
  }

  randomRange (min: number, max: number): number {
    return min + this.next() * (max - min)
  }
}
