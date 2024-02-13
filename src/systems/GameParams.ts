import * as THREE from 'three'
import type EventManager from './EventManager'

export default class GameParams {
  readonly clock: THREE.Clock
  gameOver = false
  readonly roomWidth = 400
  readonly roomHeight = 600
  readonly screenWidth = window.innerWidth
  readonly screenHeight = window.innerHeight

  constructor (private readonly eventManager: EventManager) {
    this.clock = new THREE.Clock()
  }

  end (): void {
    this.gameOver = true
    this.eventManager.emit('gameOver')
  }
}
