import * as THREE from 'three'
import type EventManager from './EventManager'

interface Scores {
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
      planets: 0
    }
  }

  end (): void {
    this.gameOver = true
    this.eventManager.emit('gameOver')
    setTimeout(() => {
      this.canRestart = true
    }, 1000)
  }
}
