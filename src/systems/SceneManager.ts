import Instance from "src/components/instance";
import * as THREE from "three";

export default class SceneManager {
  static instances: Instance[] = [];
  scene: THREE.Scene;
  constructor() {
    this.scene = new THREE.Scene();
  }

  add(instance: Instance) {
    this.scene.add(instance.mesh);
    SceneManager.instances.push(instance);
  }

  private update() {
    SceneManager.instances.forEach((instance) => {
      instance.update && instance.update();
    });

  }

  animate() {
    this.update();
    window.requestAnimationFrame(this.animate.bind(this));
  }
}
