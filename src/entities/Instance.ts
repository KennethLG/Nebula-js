import type IBody from './IBody'

export abstract class IInstance {
  abstract name: string
  abstract body: IBody
  abstract baseUpdate (): void
  abstract update (): void
  abstract init (): void
  abstract onDestroy (): void
}
