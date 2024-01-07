import config from '@/config'
import type IInstance from 'src/entities/Instance'
import * as THREE from 'three'

interface InstanceConfig {
  name: string
  position: THREE.Vector3
  texturePath?: string
  mesh?: THREE.Mesh
  geometry?: THREE.CircleGeometry
  material?: THREE.MeshBasicMaterial
}

export default class Instance implements IInstance {
  name: string
  texture: THREE.Texture
  material: THREE.MeshBasicMaterial
  geometry: THREE.CircleGeometry
  mesh: THREE.Mesh

  constructor (instanceConfig: InstanceConfig) {
    this.name = instanceConfig.name
    const texturePath = instanceConfig.texturePath ?? ''
    this.texture = new THREE.TextureLoader().load(`${config.assetsPath}${texturePath}`)
    this.texture.magFilter = THREE.NearestFilter
    this.texture.minFilter = THREE.NearestFilter

    this.material = instanceConfig.material ?? new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true
    })
    this.geometry = instanceConfig.geometry ?? new THREE.CircleGeometry(1)
    this.mesh = instanceConfig.mesh ?? new THREE.Mesh(this.geometry, this.material)
    this.geometry.translate(0, 0, 0)
    this.mesh.position.set(instanceConfig.position.x, instanceConfig.position.y, instanceConfig.position.z)
  }

  update (): void {
    //
  }
}
