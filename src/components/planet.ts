import * as THREE from 'three'
import Instance from './instance'

interface PlanetProperties {
  radius?: number
}

export default class Planet extends Instance {
  boundingSphere = new THREE.Sphere()
  constructor (x: number, y: number, properties?: PlanetProperties) {
    super({
      name: 'Planet',
      position: new THREE.Vector3(x, y, 0),
      geometry: new THREE.CircleGeometry(properties?.radius),
      material: new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    })
    this.boundingSphere = new THREE.Sphere(this.mesh.position, 1)
  }
}
