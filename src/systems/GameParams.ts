import * as THREE from 'three'

export default class GameParams {
  clock: THREE.Clock

  constructor () {
    this.clock = new THREE.Clock()
  }
}
