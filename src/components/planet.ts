import * as THREE from "three";
import Instance from "./instance";
import { Vector3 } from "../systems/util/vector";

export default class Planet extends Instance {
  boundingSphere = new THREE.Sphere;
  constructor() {
    super({
      name: "Planet",
      position: new Vector3(0, 0, 0),
      geometry: new THREE.CircleGeometry(1),
      material: new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    });
    this.boundingSphere = new THREE.Sphere(this.mesh.position, 1);
  }
}