import TYPES from './systems/DI/tokens'
import container from './systems/DI/inversify.config'
import { type IMain } from './bootstrap'

const main = container.get<IMain>(TYPES.IMain)
main.init()
