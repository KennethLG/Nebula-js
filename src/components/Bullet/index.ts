import * as THREE from 'three'
import Instance from '../Instance'
import type Planet from '../Planet'
import Explosion from '../UFO/explosion'
import { type ISceneManager } from '@/systems/SceneManager'

interface BulletConfig {
  position: THREE.Vector3
  direction: THREE.Vector3
  speed: number
}

export default class Bullet extends Instance {
  private readonly direction: THREE.Vector3
  private readonly speed: number
  constructor (
    { position, direction, speed }: BulletConfig,
    private readonly sceneManager: ISceneManager
  ) {
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

    const collidingPlanet = this.getCollidingPlanet()
    if (collidingPlanet != null) {
      this.sceneManager.add(new Explosion(
        {
          position: collidingPlanet.body.position,
          radius: collidingPlanet.boundingSphere.radius,
          color: collidingPlanet.color
        },
        this.sceneManager)
      )
      this.sceneManager.destroy(collidingPlanet.id)
      this.sceneManager.destroy(this.id)
    }
  }

  private getCollidingPlanet (): Planet | undefined {
    const planets = this.sceneManager.instances.filter(inst => inst.name === 'Planet') as Planet[]

    if (planets.length === 0) return

    const collidingPlanet = planets.find(planet => {
      return this.body.position.distanceTo(planet.body.position) < planet.boundingSphere.radius
    })

    return collidingPlanet
  }
}
