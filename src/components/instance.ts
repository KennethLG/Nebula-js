import * as THREE from "three";

interface InstanceConfig {
  name: string;
  position: THREE.Vector3;
  texturePath?: string;
  mesh?: THREE.Mesh;
  geometry?: THREE.CircleGeometry;
  material?: THREE.MeshBasicMaterial;
}

export default class Instance {
  name: string;
  texture: THREE.Texture;
  material: THREE.MeshBasicMaterial;
  geometry: THREE.CircleGeometry;
  mesh: THREE.Mesh;

  constructor(config: InstanceConfig) {
    this.name = config.name;
    this.texture = new THREE.TextureLoader().load(config.texturePath || "");
    this.texture.magFilter = THREE.NearestFilter;
    this.texture.minFilter = THREE.NearestFilter;

    this.material = config.material || new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true
    });
    this.geometry = config.geometry || new THREE.CircleGeometry(1);
    this.mesh = config.mesh || new THREE.Mesh(this.geometry, this.material);
    this.geometry.translate(0, 0, 0);
    this.mesh.position.set(config.position.x, config.position.y, config.position.z);
  }

  update() {
    // Common update logic for all instances, if any.
  }
}