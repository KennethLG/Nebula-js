import type Bullet from '@/components/Bullet';
import { type IPlayer } from '@/components/Player';
import { type IUfo } from '@/components/UFO';
import type IScene from '@/entities/IScene';
import { type ICameraController } from '@/systems/CameraController';
import { type IEventManager } from '@/systems/EventManager';
import { type IGUI } from '@/systems/GUI';
import { type IGameParams } from '@/systems/GameParams';
import { keyboardManagerFactory } from '@/systems/KeyboardManager';
import { type ILevelGenerator } from '@/systems/LevelGenerator';
import { type IPlayerDataController } from '@/systems/PlayerDataController';
import { type ISceneManager } from '@/systems/SceneManager';
import { type CreatePlayer } from '@/systems/factories/PlayerFactory';
import { type IMatchSocket } from '@/systems/http/matchSocket';
import {
  type MatchFoundResponse,
  type PlayerUpdatedResponse,
} from '@/systems/http/responses/socketResponse';
import { Vector3 } from 'three';

export default class GameScene implements IScene {
  private planetsScore: number[] = [];
  private gameOverScreen: HTMLElement;
  private player: IPlayer | null;
  private ufo: IUfo | null;
  private matchFound = false;
  private playerDelayCompleted = false;

  constructor(
    private readonly cameraController: ICameraController,
    private readonly sceneManager: ISceneManager,
    private readonly gameParams: IGameParams,
    private readonly levelGenerator: ILevelGenerator,
    private readonly eventManager: IEventManager,
    private readonly gui: IGUI,
    private readonly matchSocket: IMatchSocket,
    private readonly playerDataController: IPlayerDataController,
    private readonly createPlayer: CreatePlayer,
    private readonly createUfoInstance: () => IUfo,
  ) {
    this.gameOverScreen = document.createElement('div');
    this.player = null;
    this.ufo = null;
    this.playerDataController.getPlayerData();
    this.matchSocket.init(this.playerDataController.playerData.id);
    keyboardManagerFactory(eventManager);
  }

  init(): void {
    console.log('gamescene init');
    this.gameOverScreen = this.createGameOverScreen();
    this.changeGameOverScreenVisibility('hidden');
    this.eventManager.on('gameOver', () => {
      this.changeGameOverScreenVisibility('visible');
    });
    this.eventManager.on('keyup', () => {
      console.log(
        'keyup on gameover',
        this.gameParams.gameOver,
        this.gameParams.canRestart,
      );
      if (this.gameParams.gameOver && this.gameParams.canRestart) {
        this.gameRestart();
      }
    });

    this.eventManager.on('matchFound', this.onMatchFound.bind(this));
    this.eventManager.on('playerUpdated', this.onPlayerUpdated.bind(this));

    setTimeout(() => {
      this.playerDelayCompleted = true;
    }, 3000);
  }

  update(): void {
    if (!this.matchFound) return;

    this.levelGenerator.update();
    this.updateCamera();
    this.removeOuterBullets();

    if (this.player != null && this.playerDelayCompleted) {
      this.checkGameEnd(this.player);
      this.checkPlayersToTeleport();
    }
    this.updateScore();
    this.createUfo();
  }

  private updateCamera(): void {
    if (this.player == null) return;

    this.cameraController.follow = this.player.body.position;
  }

  private checkGameEnd(player: IPlayer): void {
    if (this.gameParams.gameOver) return;

    if (player.explosionCollision) {
      this.gameParams.end(player.id);
      return;
    }

    const {
      position: { y: cameraY },
      bottom,
    } = this.cameraController.camera;
    if (player.body.position.y < cameraY + bottom) {
      this.gameParams.end(player.id);
    }
  }

  private checkPlayersToTeleport(): void {
    const {
      right,
      left,
      position: { x: cameraX },
    } = this.cameraController.camera;
    this.sceneManager.instances.forEach((inst) => {
      if (inst.name === 'Player') {
        const player = inst as IPlayer;
        if (player.body.position.x > cameraX + right) {
          player.body.position.setX(cameraX + left);
        }
        if (player.body.position.x < cameraX + left) {
          player.body.position.setX(cameraX + right);
        }
      }
    });
  }

  private removeOuterBullets(): void {
    const bullets = this.sceneManager.instances.filter(
      (inst) => inst.name === 'Bullet',
    ) as Bullet[];

    if (bullets.length === 0) return;

    const {
      position: { y: cameraY },
      top,
    } = this.cameraController.camera;

    bullets.forEach((bullet) => {
      if (bullet.body.position.y > cameraY + top) {
        this.sceneManager.destroy(bullet.id);
      }
    });
  }

  private changeGameOverScreenVisibility(
    visibility: 'visible' | 'hidden',
  ): void {
    this.gameOverScreen.style.visibility = visibility;
  }

  private createGameOverScreen(): HTMLElement {
    return this.gui.createText('GAME OVER<br><br>Press any key to restart', {
      left: '50%',
      top: '50%',
      textAlign: 'center',
      transform: 'translate(-50%, -50%)',
    });
  }

  private gameRestart(): void {
    this.player = null;
    this.ufo = null;
    this.changeGameOverScreenVisibility('hidden');

    this.sceneManager.destroyAll();
    this.gameParams.gameOver = false;
    this.gameParams.canRestart = false;
    this.gameParams.restartScores();
    this.init();
  }

  private updateScore(): void {
    const lastPlanet = this.player?.planet;
    if (lastPlanet == null) return;

    if (!this.planetsScore.includes(lastPlanet.id)) {
      this.planetsScore.push(lastPlanet.id);
      this.gameParams.scores.planets++;
    }
  }

  private createUfo(): void {
    const player = this.player;
    if (player == null || this.ufo != null) return;

    if (this.gameParams.scores.planets === 5) {
      const ufo = this.createUfoInstance();
      this.ufo = ufo;
      ufo.defineTarget(player);

      this.sceneManager.add(ufo);
    }
  }

  private onMatchFound(data: MatchFoundResponse): void {
    const players = data.players.map((player) => {
      return {
        ...player,
        id: parseInt(player.id),
      };
    });

    this.matchFound = true;
    this.levelGenerator.init();
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
    const player = this.createPlayer(true, currentPlayer.id, playerPosition);
    this.sceneManager.add(player);
    this.player = player;

    const otherPlayers = players.filter(
      (player) => player.id !== this.playerDataController.playerData.id,
    );
    otherPlayers.forEach((player) => {
      const playerPosition = new Vector3(
        player.position.x,
        player.position.y,
        0,
      );
      const newPlayer = this.createPlayer(false, player.id, playerPosition);
      this.sceneManager.add(newPlayer);
    });

    this.cameraController.camera.position.setY(0);
    this.planetsScore = [];
    this.eventManager.emit('matchStart', {
      matchId: data.id,
      player,
    });
  }

  private onPlayerUpdated(data: PlayerUpdatedResponse): void {
    const player = {
      ...data.player,
      id: parseInt(data.player.id),
    };
    console.log('updating player', player, 'data', data);

    const playerInstance = this.sceneManager.instances.find(
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
      data.player.keyState ? 'keydown' : 'keyup',
      data.player.key,
    );
    if (data.player.dead) {
      foundPlayer.onGameOver();
    }

    // set foundplayer position based on a threshold
    const threshold = 0.1;
    if (Math.abs(foundPlayer.body.position.x - player.position.x) > threshold) {
      foundPlayer.body.position.setX(player.position.x);
      foundPlayer.body.position.setY(player.position.y);
    }
  }
}
