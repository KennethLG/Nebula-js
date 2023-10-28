class Player {
  texture: THREE.Texture;
  material: THREE.MeshBasicMaterial;
  geometry: THREE.PlaneGeometry;

  constructor() {
    this.texture = new THREE.TextureLoader().load("../assets/player.png");
    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
    });
    this.texture.minFilter = THREE.NearestFilter;
    this.texture.magFilter = THREE.NearestFilter;
    this.geometry = new THREE.PlaneGeometry(1, 1);
  }

  update() {
    
  }
}