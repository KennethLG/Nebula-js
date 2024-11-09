export type Constructor<T = any> = new (...args: any[]) => T;

export class Container {
  private readonly services = new Map<string, any>();
  register<T>(constructor: Constructor<T>, key?: string): void {
    const serviceKey = key ?? constructor.name;
    if (this.services.has(serviceKey)) {
      throw new Error(
        `A service with the key ${serviceKey} is already registered.`,
      );
    }
    this.services.set(serviceKey, constructor);
  }

  resolve<T>(key: string): T {
    const Service = this.services.get(key);
    if (!Service) {
      throw new Error(`No service found with id ${key}`);
    }

    const paramTypes = Reflect.getMetadata('design:paramtypes', Service) || [];
    const dependencies = paramTypes.map((type: any) => this.resolve(type.name));

    return new Service(...dependencies);
  }
}

export const container = new Container();

export function Injectable() {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (target: Function) {};
}

export function Inject(serviceIdentifier: string) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata('inject', serviceIdentifier, target, propertyKey);
  };
}
