import 'reflect-metadata';
import { mainFactory } from './systems/factories/MainFactory';

const main = mainFactory();
main.init();
