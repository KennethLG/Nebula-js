import * as THREE from 'three';

export default class SceneManager {
  instances: any[];
  scene: THREE.Scene;
  constructor() {
    this.scene = new THREE.Scene();
    this.instances = [];
  }

  add(instance) {
    this.scene.add(instance.mesh)
    this.instances.push(instance);
  }

  update() {
    this.instances.forEach(instance => {
      instance.update && instance.update();
    })
  }
}
