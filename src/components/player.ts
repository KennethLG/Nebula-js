import * as THREE from 'three';
import KeyboardManager from 'src/systems/KeyboardManager';

export default class Player {
  texture: THREE.Texture;
  material: THREE.MeshBasicMaterial;
  geometry: THREE.PlaneGeometry;
  mesh: THREE.Mesh;
  private readonly moveSpeed = 0.1;

  constructor(private keyboardManager: KeyboardManager) {
    this.texture = new THREE.TextureLoader().load("../../assets/player.png");
    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
    });
    this.texture.magFilter = THREE.NearestFilter;
    this.texture.minFilter = THREE.NearestFilter;
    this.geometry = new THREE.PlaneGeometry(1, 1);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0, 0, 0);
  }

  update() {
    if (this.keyboardManager.keys["ArrowUp"]) {
      this.mesh.position.y += this.moveSpeed;
    }
  }
}