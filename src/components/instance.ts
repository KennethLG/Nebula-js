import * as THREE from "three";
import { Vector3 } from "../systems/util/vector";

interface InstanceConfig {
  texturePath?: string;
  name: string;
  position: Vector3;
}

export default class Instance {
  name: string;
  texture: THREE.Texture;
  material: THREE.MeshBasicMaterial;
  geometry: THREE.BufferGeometry;
  mesh: THREE.Mesh;

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
    this.mesh.position.set(config.position.x, config.position.y, config.position.z);
  }

  update() {
    // Common update logic for all instances, if any.
  }
}