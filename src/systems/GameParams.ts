import * as THREE from 'three'
import { getItem, setItem } from './GameStorage'
import { type IEventManager } from './EventManager'

interface Scores {
  planetsRecord: number
  planets: number
}

export interface IGameParams {
  gameOver: boolean
  canRestart: boolean
  scores: Scores
  clock: THREE.Clock
  roomWidth: number
  roomHeight: number
  screenWidth: number
  screenHeight: number

  end: () => void
  restartScores: () => void
}

export default class GameParams implements IGameParams {
  readonly clock: THREE.Clock
  gameOver = false
  canRestart = false
  readonly roomWidth = 400
  readonly roomHeight = 600
  readonly screenWidth = window.innerWidth
  readonly screenHeight = window.innerHeight
  scores: Scores

  constructor (
    private readonly eventManager: IEventManager
  ) {
    this.clock = new THREE.Clock()
    this.scores = {
      planetsRecord: parseInt(getItem('planetsRecord') ?? '0'),
      planets: 0
    }
  }

  end (): void {
    console.log('game end')
    if (this.scores.planets > this.scores.planetsRecord) {
      setItem('planetsRecord', this.scores.planets)
      this.scores.planetsRecord = this.scores.planets
    }

    this.gameOver = true
    this.eventManager.emit('gameOver')
    setTimeout(() => {
      this.canRestart = true
    }, 1000)
  }

  restartScores (): void {
    this.scores.planets = 0
  }
}
