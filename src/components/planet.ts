import * as THREE from 'three'
import Instance from './instance'

export default class Planet extends Instance {
  boundingSphere = new THREE.Sphere()
  constructor (position: THREE.Vector3) {
    super({
      name: 'Planet',
      position,
      geometry: new THREE.CircleGeometry(1),
      material: new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    })
    this.boundingSphere = new THREE.Sphere(this.mesh.position, 1)
  }
}
