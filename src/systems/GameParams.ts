import * as THREE from 'three'

export default class GameParams {
  clock: THREE.Clock
  gameOver = false
  roomWidth = 400
  roomHeight = 600
  screenWidth = window.innerWidth
  screenHeight = window.innerHeight

  constructor () {
    this.clock = new THREE.Clock()
  }
}
