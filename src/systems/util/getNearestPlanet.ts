import type * as THREE from 'three'
import type Planet from '@/components/Planet'
import { type ISceneManager } from '../SceneManager'

export const getNearestPlanet = (sceneManager: ISceneManager, from: THREE.Vector3): Planet | undefined => {
  const planets = sceneManager.instances.filter(inst => inst.name === 'Planet') as Planet[]

  if (planets.length === 0) return

  const nearestPlanet = planets.reduce((nearest, planet) => {
    const nearestDistance = nearest.body.position.distanceTo(from) - nearest.boundingSphere.radius
    const currentDistance = planet.body.position.distanceTo(from) - planet.boundingSphere.radius
    return currentDistance < nearestDistance ? planet : nearest
  }, planets[0])

  return nearestPlanet
}
