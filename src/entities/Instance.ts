import type IBody from './IBody'

export abstract class IInstance {
  abstract name: string
  abstract body: IBody
  abstract update (): void
  abstract init (): void
}
