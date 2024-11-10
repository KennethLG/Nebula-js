import { Container, type interfaces } from 'inversify';
import { factories, singletonServices, transientServices } from './services';

const container = new Container();

const registerFactory = <T, K extends unknown[]>(
  key: symbol,
  Service: new (...args: K) => T,
): void => {
  container.bind<interfaces.Factory<T>>(key).toFactory<T, K>((_context) => {
    return (...params: K) => {
      return new Service(...params);
    };
  });
};

const registerServices = (): void => {
  singletonServices.forEach(({ key, service }) => {
    container.bind<typeof service>(key).to(service).inSingletonScope();
  });

  transientServices.forEach(({ key, service }) => {
    container.bind<typeof service>(key).to(service).inTransientScope();
  });

  factories.forEach(({ key, service }) => {
    registerFactory(key, service);
  });
};

export { registerServices, container };
