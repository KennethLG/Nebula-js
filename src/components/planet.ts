import * as THREE from "three";

export default class Planet {
  mesh: THREE.Mesh;

  constructor() {
    const geometry = new THREE.CircleGeometry(1, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.y = -2;
  }
}
