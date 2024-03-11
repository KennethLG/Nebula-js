import { injectable } from 'inversify'

export const generateSeed = (): number => {
  return Date.now()
}

export interface IRandom {
  next: () => number
  randomRange: (min: number, max: number) => number
}

@injectable()
export default class Random implements IRandom {
  private seed: number

  constructor () {
    this.seed = generateSeed()
  }

  next (): number {
    const a = 1664525
    const c = 1013904223
    const m = 2 ** 32

    this.seed = (a * this.seed + c) % m
    return this.seed / m
  }

  randomRange (min: number, max: number): number {
    return min + this.next() * (max - min)
  }
}
