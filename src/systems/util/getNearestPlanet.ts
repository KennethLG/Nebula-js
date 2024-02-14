import type * as THREE from 'three'
import type Planet from '@/components/Planet'
import type SceneManager from '../SceneManager'

export const getNearestPlanet = (sceneManager: SceneManager, from: THREE.Vector3): Planet => {
  const planets = sceneManager.instances.filter(inst => inst.name === 'Planet') as Planet[]

  const nearestPlanet = planets.reduce((nearest, planet) => {
    const nearestDistance = nearest.body.position.distanceTo(from) - nearest.boundingSphere.radius
    const currentDistance = planet.body.position.distanceTo(from) - planet.boundingSphere.radius
    return currentDistance < nearestDistance ? planet : nearest
  }, planets[0])

  return nearestPlanet
}
