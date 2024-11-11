import type * as THREE from 'three';
import type Planet from '@/components/Planet';
import InstancesManager from '../InstancesManager';

export const getNearestPlanet = (
  instancesManager: InstancesManager,
  from: THREE.Vector3,
): Planet | undefined => {
  const planets = instancesManager.instances.filter(
    (inst) => inst.name === 'Planet',
  ) as Planet[];

  if (planets.length === 0) return;

  const nearestPlanet = planets.reduce((nearest, planet) => {
    const nearestDistance =
      nearest.body.position.distanceTo(from) - nearest.boundingSphere.radius;
    const currentDistance =
      planet.body.position.distanceTo(from) - planet.boundingSphere.radius;
    return currentDistance < nearestDistance ? planet : nearest;
  }, planets[0]);

  return nearestPlanet;
};
