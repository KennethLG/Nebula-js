import * as THREE from "three";
import Instance from "./instance";
import { Vector3 } from "../systems/util/vector";

export default class Planet extends Instance {
  boundingSphere = new THREE.Sphere;
  constructor() {
    super({
      name: "Planet",
      position: new Vector3(0, 0, 0),
    });

    this.geometry = new THREE.CircleGeometry(1, 32);
    this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    // this.mesh.position.y = -2;
    this.boundingSphere = new THREE.Sphere(this.mesh.position, 1);
    // Planet-specific setup and behavior.
  }
}

// export default class Planet {
//   mesh: THREE.Mesh;
//   private boundingSphere: THREE.Sphere;

//   constructor() {
//     const geometry = new THREE.CircleGeometry(1, 32);
//     const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//     this.mesh = new THREE.Mesh(geometry, material);
//     this.mesh.position.y = -2;
//     this.boundingSphere = new THREE.Sphere(this.mesh.position, 1);
//   }

//   getBoundingSphere(): THREE.Sphere {
//     return this.boundingSphere;
//   }
// }
