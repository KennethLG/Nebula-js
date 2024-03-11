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
import { type ISceneManager } from '@/systems/SceneManager'
import { inject, injectable } from 'inversify'

@injectable()
export default class GameScene implements IScene {
  private planetsScore: number[] = []
  private gameOverScreen: HTMLElement
  private player?: IPlayer
  private ufo?: IUfo

  constructor (
    @inject(TYPES.ICameraController) private readonly cameraController: ICameraController,
    @inject(TYPES.ISceneManager) private readonly sceneManager: ISceneManager,
    @inject(TYPES.IGameParams) private readonly gameParams: IGameParams,
    @inject(TYPES.ILevelGenerator) private levelGenerator: ILevelGenerator,
    @inject(TYPES.IEventManager) private readonly eventManager: IEventManager,
    @inject(TYPES.IGUI) private readonly gui: IGUI
  ) {
    this.gameOverScreen = document.createElement('div')
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
    this.levelGenerator = container.get<ILevelGenerator>(TYPES.ILevelGenerator)
    this.levelGenerator.init()
    const player = container.get<IPlayer>(TYPES.IPlayer)
    this.sceneManager.add(player)
    this.player = player
    this.cameraController.camera.position.setY(0)
    this.planetsScore = []
  }

  update (): void {
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
    const desiredPlayer = this.sceneManager.instances.find(inst => inst.name === 'Player')
    if (desiredPlayer == null) {
      throw new Error('No player found')
    }
    this.cameraController.follow = desiredPlayer.body.position
  }

  private checkGameEnd (player: IPlayer): void {
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
      this.ufo = container.get<IUfo>(TYPES.IUfo) // new Ufo(player)
      this.sceneManager.add(this.ufo)
    }
  }
}
