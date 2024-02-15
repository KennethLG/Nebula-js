import * as THREE from 'three'
import type EventManager from './EventManager'
import { getItem, setItem } from './GameStorage'

interface Scores {
  planetsRecord: number
  planets: number
}

export default class GameParams {
  readonly clock: THREE.Clock
  gameOver = false
  canRestart = false
  readonly roomWidth = 400
  readonly roomHeight = 600
  readonly screenWidth = window.innerWidth
  readonly screenHeight = window.innerHeight
  scores: Scores

  constructor (private readonly eventManager: EventManager) {
    this.clock = new THREE.Clock()
    this.scores = {
      planetsRecord: parseInt(getItem('planetsRecord') ?? '0'),
      planets: 0
    }
  }

  end (): void {
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
