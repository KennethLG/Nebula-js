import * as THREE from 'three';
import EventManager from '../systems/EventManager';

export default class Player {
  texture: THREE.Texture;
  material: THREE.MeshBasicMaterial;
  geometry: THREE.PlaneGeometry;
  mesh: THREE.Mesh;
  private readonly moveSpeed = 0.1;

  constructor(private eventManager: EventManager, scene: THREE.Scene) {
    this.texture = new THREE.TextureLoader().load("../assets/player.png");
    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
    });
    this.texture.minFilter = THREE.NearestFilter;
    this.texture.magFilter = THREE.NearestFilter;
    this.geometry = new THREE.PlaneGeometry(1, 1);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0, 0, 0);
    scene.add(this.mesh);
    this.eventManager.subscribe('keydown', this.handleKeyDown.bind(this));
  }

  private handleKeyDown(key: string) {
    if (key === 'ArrowUp') {
      this.mesh.position.y -= this.moveSpeed;
    }
  }
}