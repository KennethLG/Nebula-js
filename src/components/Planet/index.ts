import * as THREE from 'three'
import Instance from '../Instance'

interface PlanetProperties {
  radius?: number
}

export default class Planet extends Instance {
  boundingSphere = new THREE.Sphere()
  geometry: THREE.CircleGeometry
  color: THREE.ColorRepresentation
  constructor (x: number, y: number, properties?: PlanetProperties) {
    const geometry = new THREE.CircleGeometry(properties?.radius)
    const color = 0x00ff00
    const material = new THREE.MeshBasicMaterial({ color })
    const mesh = new THREE.Mesh(geometry, material)
    super({
      name: 'Planet',
      position: new THREE.Vector3(x, y, 0),
      radius: properties?.radius ?? 1,
      mesh
    })
    this.boundingSphere = new THREE.Sphere(this.body.position, properties?.radius)
    this.geometry = geometry
    this.geometry.translate(0, 0, 0)
    this.color = color
  }
}
