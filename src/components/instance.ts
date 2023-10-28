import * as THREE from "three";
import * as CANNON from 'cannon-es';

interface InstanceConfig {
  texturePath?: string;
  name: string;
  position?: THREE.Vector3;
}

export default class Instance {
  name: string;
  texture: THREE.Texture;
  material: THREE.MeshBasicMaterial;
  geometry: THREE.BufferGeometry;
  mesh: THREE.Mesh;
  body: CANNON.Body;

  constructor(config: InstanceConfig) {
    this.name = config.name;
    this.texture = new THREE.TextureLoader().load(config.texturePath || "");
    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
    });
    this.texture.magFilter = THREE.NearestFilter;
    this.texture.minFilter = THREE.NearestFilter;
    this.geometry = new THREE.PlaneGeometry(1, 1);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.copy(config.position || new THREE.Vector3(0, 0, 0));
    const { x, y, z } = this.mesh.position;
    this.body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(
        x,
        y,
        z
      )
    });
  }

  update() {
    // Common update logic for all instances, if any.
  }
}