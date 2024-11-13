import { type IPlayer } from '@/components/Player';
import EventManager from '@/systems/EventManager';
import { EventTypes } from '@/systems/eventTypes';
import { CreatePlayer } from '@/systems/factories/PlayerFactory';
import PlayerDataController from '@/systems/PlayerDataController';
import InstancesManager from '@/systems/InstancesManager';
import { Vector3 } from 'three';
import { inject, injectable } from 'inversify';
import TYPES from '@/systems/DI/tokens';

@injectable()
export default class SceneSync {
  constructor(
    @inject(TYPES.InstanceManager)
    private readonly instancesManager: InstancesManager,
    @inject(TYPES.PlayerDataController)
    private readonly playerDataController: PlayerDataController,
    @inject(TYPES.EventManager)
    private readonly eventManager: EventManager,
    @inject(TYPES.PlayerFactory)
    private readonly playerFactory: CreatePlayer,
  ) {}

  init = (): void => {
    this.onMatchFound();
    this.onPlayerUpdated();
  };

  onMatchFound = (): void => {
    this.eventManager.on(EventTypes.MatchFound, (data) => {
      const players = data.players.map((player) => {
        return {
          ...player,
          id: parseInt(player.id),
        };
      });

      // this.matchFound = true;
      // this.levelGenerator.init();
      console.log(this.playerDataController.playerData, data.players);
      const currentPlayer = players.find(
        (player) => player.id === this.playerDataController.playerData.id,
      );
      if (currentPlayer == null) {
        throw new Error('No player found');
      }
      console.log('current player', currentPlayer);
      const playerPosition = new Vector3(
        currentPlayer.position.x,
        currentPlayer.position.y,
        0,
      );
      const player = this.playerFactory(true, currentPlayer.id, playerPosition); // this.createPlayer(true, currentPlayer.id, playerPosition);
      this.instancesManager.add(player);
      // this.player = player;

      const otherPlayers = players.filter(
        (player) => player.id !== this.playerDataController.playerData.id,
      );
      console.log('number of other players', otherPlayers.length);
      otherPlayers.forEach((player) => {
        const playerPosition = new Vector3(
          player.position.x,
          player.position.y,
          0,
        );
        const newPlayer = this.playerFactory(false, player.id, playerPosition);
        this.instancesManager.add(newPlayer);
      });

      // this.cameraController.camera.position.setY(0);
      // this.planetsScore = [];
      this.eventManager.emit(EventTypes.MatchStart, {
        matchId: data.id,
        player,
      });
    });
  };

  onPlayerUpdated = (): void => {
    this.eventManager.on(EventTypes.PlayerUpdated, (data) => {
      const player = {
        ...data.player,
        id: parseInt(data.player.id),
      };
      console.log('updating player', player, 'data', data);

      const playerInstance = this.instancesManager.instances.find(
        (inst) => inst.id === player.id,
      );
      if (playerInstance == null) {
        throw new Error('No player found');
      }
      const foundPlayer = playerInstance as IPlayer;
      console.log(
        'triggering: ',
        data.player.keyState ? 'keydown' : 'keyup',
        data.player.key,
        'for player',
        foundPlayer.id,
      );
      foundPlayer.playerEvents.emit(
        data.player.keyState ? EventTypes.Keydown : EventTypes.Keyup,
        data.player.key,
      );
      if (data.player.dead) {
        foundPlayer.onGameOver();
      }

      // set foundplayer position based on a threshold
      const threshold = 0.1;
      if (
        Math.abs(foundPlayer.body.position.x - player.position.x) > threshold
      ) {
        foundPlayer.body.position.setX(player.position.x);
        foundPlayer.body.position.setY(player.position.y);
      }
    });
  };
}
