import 'reflect-metadata';
import { registerServices } from './systems/DI/servicesRegister';
import { mainFactory } from './systems/factories/MainFactory';

registerServices();
const main = mainFactory();
main.init();
