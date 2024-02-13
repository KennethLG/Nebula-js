import * as THREE from 'three'
import Instance from '../Instance'
import Sprite from '../Sprite'

export default class Ufo extends Instance {
  xVel = new THREE.Vector3(0, 0, 0)
  yVel = new THREE.Vector3(0, 0, 0)

  constructor () {
    const sprite = new Sprite({
      name: 'ufo.png',
      xTiles: 1,
      yTiles: 1
    })

    super({
      name: 'ufo',
      position: new THREE.Vector3(0, 0, 0),
      radius: 0.5,
      mesh: sprite.sprite
    })
  }
}
