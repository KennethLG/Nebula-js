import * as THREE from "three";

class Main {
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly renderer: THREE.WebGLRenderer;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.animate();
  }

  private animate() {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  }
}

const main = new Main();
main.init();

// const playerTexture = new THREE.TextureLoader().load("../assets/player.png");
// const playerMaterial = new THREE.MeshBasicMaterial({
//   map: playerTexture,
// });
// playerTexture.magFilter = THREE.NearestFilter;
// playerTexture.minFilter = THREE.NearestFilter;
// const playerGeometry = new THREE.PlaneGeometry(1, 1);

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// const character = new THREE.Mesh(playerGeometry, playerMaterial);

// character.position.y = -2;
// scene.add(cube);
// scene.add(character);
// camera.position.z = 5;

// const animate = () => {
//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.01;

//   requestAnimationFrame(animate);
//   renderer.render(scene, camera);
// };

// animate();
