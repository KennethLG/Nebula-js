import type Bullet from '@/components/Bullet';
import { type IPlayer } from '@/components/Player';
import type Ufo from '@/components/UFO';
import type IScene from '@/entities/IScene';
import CameraController from '@/systems/CameraController';
import EventManager from '@/systems/EventManager';
import MatchGUI from '@/systems/gui/MatchGUI';
import GameParams from '@/systems/GameParams';
import { keyboardManagerFactory } from '@/systems/KeyboardManager';
import LevelGenerator from '@/systems/LevelGenerator';
import PlayerDataController from '@/systems/PlayerDataController';
import InstancesManager from '@/systems/InstancesManager';
import MatchSocket from '@/systems/http/matchSocket';
import SceneSync from './SceneSync';
import { EventTypes } from '@/systems/eventTypes';
import { inject, injectable } from 'inversify';
import TYPES from '@/systems/DI/tokens';
import { CreateUfo } from '@/systems/factories/UfoFactory';

@injectable()
export default class GameScene implements IScene {
  private planetsScore: number[] = [];
  private gameOverScreen: HTMLElement;
  private player: IPlayer | null;
  private ufo: Ufo | null;
  private matchFound = false;
  private playerDelayCompleted = false;

  constructor(
    @inject(TYPES.CameraController)
    private readonly cameraController: CameraController,

    @inject(TYPES.InstanceManager)
    private readonly instancesManager: InstancesManager,

    @inject(TYPES.GameParams)
    private readonly gameParams: GameParams,

    @inject(TYPES.LevelGenerator)
    private readonly levelGenerator: LevelGenerator,

    @inject(TYPES.EventManager)
    private readonly eventManager: EventManager,

    @inject(TYPES.MatchGUI)
    private readonly gui: MatchGUI,

    @inject(TYPES.MatchSocket)
    private readonly matchSocket: MatchSocket,

    @inject(TYPES.PlayerDataController)
    private readonly playerDataController: PlayerDataController,

    @inject(TYPES.UfoFactory)
    private readonly ufoFactory: CreateUfo,

    @inject(TYPES.SceneSync)
    private readonly sceneSync: SceneSync,
  ) {
    this.gameOverScreen = document.createElement('div');
    this.player = null;
    this.ufo = null;
    this.playerDataController.getPlayerData();
    this.matchSocket.init(this.playerDataController.playerData.id);
    keyboardManagerFactory(this.eventManager);
  }

  init(): void {
    console.log('gamescene init');
    this.gameOverScreen = this.createGameOverScreen();
    this.changeGameOverScreenVisibility('hidden');
    this.eventManager.on(EventTypes.GameOver, () => {
      this.changeGameOverScreenVisibility('visible');
    });
    this.eventManager.on(EventTypes.Keyup, () => {
      console.log(
        'keyup on gameover',
        this.gameParams.gameOver,
        this.gameParams.canRestart,
      );
      if (this.gameParams.gameOver && this.gameParams.canRestart) {
        this.gameRestart();
      }
    });

    this.sceneSync.init();
    this.onMatchFound();
    this.onMatchStart();

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
    this.instancesManager.instances.forEach((inst) => {
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
    const bullets = this.instancesManager.instances.filter(
      (inst) => inst.name === 'Bullet',
    ) as Bullet[];

    if (bullets.length === 0) return;

    const {
      position: { y: cameraY },
      top,
    } = this.cameraController.camera;

    bullets.forEach((bullet) => {
      if (bullet.body.position.y > cameraY + top) {
        this.instancesManager.destroy(bullet.id);
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

    this.instancesManager.destroyAll();
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
      const ufo = this.ufoFactory();
      this.ufo = ufo;
      ufo.defineTarget(player);

      this.instancesManager.add(ufo);
    }
  }

  private onMatchStart(): void {
    this.eventManager.on(EventTypes.MatchStart, (data) => {
      this.matchFound = true;
      this.player = data.player;
    });
  }

  private onMatchFound(): void {
    this.eventManager.on(EventTypes.MatchFound, () => {
      this.levelGenerator.init();
      this.cameraController.camera.position.setY(0);
      this.planetsScore = [];
    });
  }
}
