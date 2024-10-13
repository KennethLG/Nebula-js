import type Bullet from '@/components/Bullet'
import { type IPlayer } from '@/components/Player'
import { type IUfo } from '@/components/UFO'
import type IScene from '@/entities/IScene'
import { type ICameraController } from '@/systems/CameraController'
import container from '@/systems/DI/inversify.config'
import TYPES from '@/systems/DI/tokens'
import { type IEventManager } from '@/systems/EventManager'
import { type IGUI } from '@/systems/GUI'
import { type IGameParams } from '@/systems/GameParams'
import { type ILevelGenerator } from '@/systems/LevelGenerator'
import { IPlayerDataController } from '@/systems/PlayerDataController'
import { type ISceneManager } from '@/systems/SceneManager'
import { IMatchmakingSocket } from '@/systems/http/matchmakingSocket'
import { inject, injectable } from 'inversify'

@injectable()
export default class GameScene implements IScene {
  private planetsScore: number[] = []
  private gameOverScreen: HTMLElement
  private player: IPlayer | null
  private ufo: IUfo | null
  private matchFound = false

  constructor (
    @inject(TYPES.ICameraController) private readonly cameraController: ICameraController,
    @inject(TYPES.ISceneManager) private readonly sceneManager: ISceneManager,
    @inject(TYPES.IGameParams) private readonly gameParams: IGameParams,
    @inject(TYPES.ILevelGenerator) private readonly levelGenerator: ILevelGenerator,
    @inject(TYPES.IEventManager) private readonly eventManager: IEventManager,
    @inject(TYPES.IGUI) private readonly gui: IGUI,
    @inject(TYPES.IMatchmakingSocket) private readonly matchmakingSocket: IMatchmakingSocket,
    @inject(TYPES.IPlayerDataController) private readonly playerDataController: IPlayerDataController,
    @inject('Factory<Player>') private readonly createPlayer: (controllable: boolean, id: number) => IPlayer
  ) {
    this.gameOverScreen = document.createElement('div')
    this.levelGenerator = container.get<ILevelGenerator>(TYPES.ILevelGenerator)
    this.player = null
    this.ufo = null
    this.playerDataController.getPlayerData()
    this.matchmakingSocket.init(this.playerDataController.playerData.id)
    // this.matchmakingSocket = new MatchmakingSocket()
  }

  init (): void {
    this.gameOverScreen = this.createGameOverScreen()
    this.changeGameOverScreenVisibility('hidden')
    this.eventManager.on('gameOver', () => {
      this.changeGameOverScreenVisibility('visible')
    })
    this.eventManager.on('keyup', () => {
      if (this.gameParams.gameOver && this.gameParams.canRestart) {
        this.gameRestart()
      }
    })

    this.eventManager.on('matchFound', (data) => {
      console.log("executed", data)
      this.matchFound = true;
      this.levelGenerator.init()
      console.log(this.playerDataController.playerData, data.players)
      const currentPlayer = data.players.find(player => player.id === this.playerDataController.playerData.id);
      const player = this.createPlayer(true, currentPlayer.id)
      this.sceneManager.add(player)
      this.player = player
      
      // const otherPlayers = data.players.filter(player => player.id !== this.playerDataController.playerData.id);
      // otherPlayers.forEach(player => {
      //   const newPlayer = this.createPlayer(false, player.id)
      //   this.sceneManager.add(newPlayer)
      // })

      this.cameraController.camera.position.setY(0)
      this.planetsScore = []
    })

  }

  update (): void {
    if (!this.matchFound) return;

    this.levelGenerator.update()
    this.updateCamera()
    this.removeOuterBullets()

    if (this.player != null) {
      this.checkGameEnd(this.player)
      this.teleportPlayer(this.player)
    }
    this.updateScore()
    this.createUfo()
  }

  private updateCamera (): void {
    // const desiredPlayer = this.sceneManager.instances.find(inst => inst.name === 'Player')
    // if (desiredPlayer == null) {
    //   throw new Error('No player found')
    // }
    if (!this.player) return;

    this.cameraController.follow = this.player.body.position
  }

  private checkGameEnd (player: IPlayer): void {
    if (this.gameParams.gameOver) return

    if (player.explosionCollision) {
      this.gameParams.end()
      return
    }

    const { position: { y: cameraY }, bottom } = this.cameraController.camera
    if (player.body.position.y < (cameraY + bottom)) {
      this.gameParams.end()
    }
  }

  private teleportPlayer (player: IPlayer): void {
    const { right, left, position: { x: cameraX } } = this.cameraController.camera
    if (player.body.position.x > (cameraX + right)) {
      player.body.position.setX(cameraX + left)
    }
    if (player.body.position.x < (cameraX + left)) {
      player.body.position.setX(cameraX + right)
    }
  }

  private removeOuterBullets (): void {
    const bullets = this.sceneManager.instances.filter(inst => inst.name === 'Bullet') as Bullet[]

    if (bullets.length === 0) return

    const { position: { y: cameraY }, top } = this.cameraController.camera

    bullets.forEach((bullet) => {
      if (bullet.body.position.y > (cameraY + top)) {
        this.sceneManager.destroy(bullet.id)
      }
    })
  }

  private changeGameOverScreenVisibility (visibility: 'visible' | 'hidden'): void {
    this.gameOverScreen.style.visibility = visibility
  }

  private createGameOverScreen (): HTMLElement {
    return this.gui.createText('GAME OVER<br><br>Press any key to restart', {
      left: '50%',
      top: '50%',
      textAlign: 'center',
      transform: 'translate(-50%, -50%)'
    })
  }

  private gameRestart (): void {
    this.player = null
    this.ufo = null
    this.changeGameOverScreenVisibility('hidden')

    this.sceneManager.destroyAll()
    this.gameParams.gameOver = false
    this.gameParams.canRestart = false
    this.gameParams.restartScores()
    this.init()
  }

  private updateScore (): void {
    const lastPlanet = this.player?.planet
    if (lastPlanet == null) return

    if (!this.planetsScore.includes(lastPlanet.id)) {
      this.planetsScore.push(lastPlanet.id)
      this.gameParams.scores.planets++
    }
  }

  private createUfo (): void {
    const player = this.player
    if (player == null || this.ufo != null) return

    if (this.gameParams.scores.planets === 5) {
      const ufo = container.get<IUfo>(TYPES.IUfo)
      this.ufo = ufo
      ufo.defineTarget(player)

      this.sceneManager.add(ufo)
    }
  }
}
