const TYPES = {
  IScene: Symbol.for('IScene'),
  IInstanceManager: Symbol.for('IInstanceManager'),
  ICameraController: Symbol.for('ICameraController'),
  ILevelGenerator: Symbol.for('ILevelGenerator'),
  IRandom: Symbol.for('IRandom'),
  IGameParams: Symbol.for('IGameParams'),
  IEventManager: Symbol.for('IEventManager'),
  IGUI: Symbol.for('IGUI'),
  IMovementController: Symbol.for('IMovementController'),
  IOrientationController: Symbol.for('IOrientationController'),
  ICollisionController: Symbol.for('ICollisionController'),
  IKeyboardManager: Symbol.for('IKeyboardManager'),
  UfoFactory: Symbol.for('UfoFactory'),
  IUfo: Symbol.for('IUfo'),
  IPlayer: Symbol.for('IPlayer'),
  IPlanet: Symbol.for('IPlanet'),
  IMain: Symbol.for('IMain'),
  IHttp: Symbol.for('IHttp'),
  IMatchmakingSocket: Symbol.for('IMatchmakingSocket'),
  IPlayerDataController: Symbol.for('IPlayerDataController'),
};

export default TYPES;
