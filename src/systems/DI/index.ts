type Constructor<T = any> = new (...args: any[]) => T;

export default class Container {
  private readonly services = new Map<string, any>();
  register<T>(key: string, constructor: Constructor<T>): void {
    this.services.set(key, constructor);
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

export function Injectable() {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (target: Function) {};
}
