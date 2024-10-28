import * as THREE from 'three';
import type IBoundingSphere from './IBoundingSphere';

interface BodyProperties {
  position: THREE.Vector3;
  boundingSphere: IBoundingSphere;
  mesh: THREE.Object3D;
}

export default abstract class IBody {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  boundingSphere: IBoundingSphere;
  mesh: THREE.Object3D;

  constructor({ boundingSphere, position, mesh }: BodyProperties) {
    this.position = position;
    this.boundingSphere = boundingSphere;
    this.quaternion = new THREE.Quaternion();
    this.mesh = mesh;
  }

  update(): void {}
}
