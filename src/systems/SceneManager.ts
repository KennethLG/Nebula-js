import Instance from "src/components/instance";
import * as THREE from "three";
import * as CANNON from "cannon-es";

export default class SceneManager {
  static instances: Instance[] = [];
  scene: THREE.Scene;
  static physicsWorld: CANNON.World;
  constructor() {
    this.scene = new THREE.Scene();
    SceneManager.physicsWorld = new CANNON.World({
      // gravity: new CANNON.Vec3(0, -0.05, 0),
    });
  }

  add(instance: Instance) {
    this.scene.add(instance.mesh);
    SceneManager.instances.push(instance);
    SceneManager.physicsWorld.addBody(instance.body);
  }

  private update() {
    SceneManager.instances.forEach((instance) => {
      instance.update && instance.update();
    });
    SceneManager.instances.forEach((instance) => {
      const mesh = instance.mesh;
      const { x, y, z } = mesh.position;
      // const { w } = mesh.quaternion;
      mesh.position.set(x, y, z);
      // mesh.quaternion.set(x, y, z, w);
    });
  }

  animate() {
    SceneManager.physicsWorld.fixedStep();
    this.update();
    window.requestAnimationFrame(this.animate.bind(this));
  }
}
