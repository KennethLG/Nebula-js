import 'reflect-metadata';
import { registerServices } from './systems/DI/servicesRegistry';
import { mainFactory } from './systems/factories/MainFactory';

registerServices();
const main = mainFactory();
main.init();
