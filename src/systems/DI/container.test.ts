import Container, { Injectable } from '.';

@Injectable()
class ServiceA {
  hello(): void {
    console.log('hello');
  }
}
@Injectable()
class ServiceB {
  constructor(private readonly serviceA: ServiceA) {}

  hello(): void {
    console.log('hello');
  }

  dep(): void {
    this.serviceA.hello();
  }
}
describe('DI Container', () => {
  it('should resolve dependencies correctly', () => {
    const spy = jest.spyOn(ServiceA.prototype, 'hello');
    const container = new Container();
    container.register('ServiceA', ServiceA);
    container.register('ServiceB', ServiceB);
    const serviceB = container.resolve<ServiceB>('ServiceB');
    serviceB.hello();
    serviceB.dep();
    expect(spy).toHaveBeenCalled();
  });
});
