// import 'reflect-metadata'
// import { Container, type interfaces } from 'inversify'
// import TYPES from './tokens'
// import SceneManager, { type ISceneManager } from '../SceneManager'
// import LevelGenerator, { type ILevelGenerator } from '../LevelGenerator'
// import type IScene from '@/entities/IScene'
// import GameScene from '@/scenes/GameScene'
// import CameraController, { type ICameraController } from '../CameraController'
// import Random, { type IRandom } from '../Random'
// import GameParams, { type IGameParams } from '../GameParams'
// import EventManager, { type IEventManager } from '../EventManager'
// import GUI, { type IGUI } from '../GUI'
// import MovementController, { type IMovementController } from '../MovementController'
// import OrientationController, { type IOrientationController } from '@/components/Player/OrientationController'
// import CollisionController, { type ICollisionController } from '@/components/Player/CollisionController'
// import KeyboardManager, { type IKeyboardManager } from '../KeyboardManager'
// import Player, { type IPlayer } from '@/components/Player'
// import Ufo, { type IUfo } from '@/components/UFO'
// import { type IMain, Main } from '@/bootstrap'
// import Planet, { type IPlanet, type PlanetProperties } from '@/components/Planet'
// import MatchmakingSocket, { IMatchmakingSocket } from '../http/matchmakingSocket'
// import PlayerDataController, { IPlayerDataController } from '../PlayerDataController'

// const container = new Container()
// container.bind<IEventManager>(TYPES.IEventManager).to(EventManager).inSingletonScope()
// container.bind<IMatchmakingSocket>(TYPES.IMatchmakingSocket).to(MatchmakingSocket)
// container.bind<IRandom>(TYPES.IRandom).to(Random).inSingletonScope()
// container.bind<IPlayerDataController>(TYPES.IPlayerDataController).to(PlayerDataController).inSingletonScope()
// container.bind<ISceneManager>(TYPES.ISceneManager).to(SceneManager).inSingletonScope()
// container.bind<IGameParams>(TYPES.IGameParams).to(GameParams).inSingletonScope()
// container.bind<IScene>(TYPES.IScene).to(GameScene).inSingletonScope()
// container.bind<ICameraController>(TYPES.ICameraController).to(CameraController).inSingletonScope()
// container.bind<IGUI>(TYPES.IGUI).to(GUI).inSingletonScope()
// container.bind<IMovementController>(TYPES.IMovementController).to(MovementController)
// container.bind<IOrientationController>(TYPES.IOrientationController).to(OrientationController)
// container.bind<ICollisionController>(TYPES.ICollisionController).to(CollisionController)
// container.bind<IKeyboardManager>(TYPES.IKeyboardManager).to(KeyboardManager).inSingletonScope()
// container.bind<IMain>(TYPES.IMain).to(Main)
// container.bind<ILevelGenerator>(TYPES.ILevelGenerator).to(LevelGenerator).inTransientScope()

// container.bind<IPlayer>(TYPES.IPlayer).to(Player).inTransientScope()
// container.bind<IUfo>(TYPES.IUfo).to(Ufo).inTransientScope()

// container.bind<interfaces.Factory<IPlanet>>('Factory<Planet>')
//   .toFactory<IPlanet, [number, number, PlanetProperties]>((context: interfaces.Context) => {
//   return (x: number, y: number, properties?: PlanetProperties) => {
//     const sceneManager = context.container.get<ISceneManager>(TYPES.ISceneManager)
//     const gameParams = context.container.get<IGameParams>(TYPES.IGameParams)
//     const random = context.container.get<IRandom>(TYPES.IRandom)
//     return new Planet(x, y, sceneManager, gameParams, random, properties)
//     // return context.container.get<IPlanet>(TYPES.IPlanet)
//   }
// })

// container.bind<interfaces.Factory<IPlayer>>('Factory<Player>')
//   .toFactory<IPlayer, [boolean, number]>((context: interfaces.Context) => {
//     return (controllable: boolean, id?: number) => {
//       const movementController = context.container.get<IMovementController>(TYPES.IMovementController)
//       const orientationController = context.container.get<IOrientationController>(TYPES.IOrientationController)
//       const collisionController = context.container.get<ICollisionController>(TYPES.ICollisionController)
//       const sceneManager = context.container.get<ISceneManager>(TYPES.ISceneManager)
//       const eventManager = context.container.get<IEventManager>(TYPES.IEventManager)
//       const gameParams = context.container.get<IGameParams>(TYPES.IGameParams)
      
//       return new Player(movementController, orientationController, collisionController, sceneManager, eventManager, gameParams, controllable, id)
//     }
//   })
// export default container
