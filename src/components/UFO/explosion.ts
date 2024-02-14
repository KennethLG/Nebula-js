import { type SceneManager } from '@/systems'
import Instance from '../Instance'
import * as THREE from 'three'

interface ExplosionConfig {
  position: THREE.Vector3
  radius: number
  color: THREE.ColorRepresentation
}

export default class Explosion extends Instance {
  private readonly material: THREE.MeshBasicMaterial
  radius: number
  constructor (
    { position, radius, color }: ExplosionConfig,
    private readonly sceneManager: SceneManager
  ) {
    const geometry = new THREE.CircleGeometry(radius, 32) // Start with a small size
    const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1.0 })
    const mesh = new THREE.Mesh(geometry, material)
    super({
      name: 'Explosion',
      mesh,
      position,
      radius
    })
    this.material = material
    this.radius = radius
  }

  update (): void {
    this.body.mesh.scale.x += 0.05
    this.body.mesh.scale.y += 0.05
    this.radius += 0.05
    this.material.opacity -= 0.2

    if (this.material.opacity <= 0) {
      this.sceneManager.destroy(this.id)
    }
  }
}
