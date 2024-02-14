import * as THREE from 'three'
import Instance from '../Instance'

interface BulletConfig {
  position: THREE.Vector3
  direction: THREE.Vector3
  speed: number
}

export default class Bullet extends Instance {
  private readonly direction: THREE.Vector3
  private readonly speed: number
  constructor ({ position, direction, speed }: BulletConfig) {
    const geometry = new THREE.CircleGeometry(0.1)
    const material = new THREE.MeshBasicMaterial({ color: 'white' })
    const mesh = new THREE.Mesh(geometry, material)
    super({
      name: 'Bullet',
      mesh,
      position,
      radius: 0.2
    })
    this.direction = direction
    this.speed = speed
  }

  update (): void {
    const bulletForce = this.direction.clone().multiplyScalar(this.speed)
    this.body.position.add(bulletForce)
  }
}
