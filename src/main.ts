import 'reflect-metadata';
import { container } from './systems/DI/inversify.config';
import TYPES from './systems/DI/tokens';
import { Main } from './bootstrap';

const main = container.get<Main>(TYPES.Main);
console.log('hello world');
main.init();
