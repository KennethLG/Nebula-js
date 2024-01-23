import * as THREE from 'three'
import Instance from '../Instance'

interface PlanetProperties {
  radius?: number
}

export default class Planet extends Instance {
  boundingSphere = new THREE.Sphere()
  geometry: THREE.CircleGeometry
  constructor (x: number, y: number, properties?: PlanetProperties) {
    super({
      name: 'Planet',
      position: new THREE.Vector3(x, y, 0),
      radius: properties?.radius ?? 1,
      spriteName: ''
    })
    this.boundingSphere = new THREE.Sphere(this.body.position, properties?.radius)
    this.geometry = new THREE.CircleGeometry(properties?.radius)
    this.geometry.translate(0, 0, 0)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    this.body.sprite.sprite = new THREE.Mesh(this.geometry, material)
  }
}
