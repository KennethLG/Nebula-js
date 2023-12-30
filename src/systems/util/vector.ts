import { Vector3 as ThreeVector3 } from "three";

interface CustomVector3 {
  x: number;
  y: number;
  z: number;
}

export const threeVec3 = ({ x, y, z }: CustomVector3) => {
  return new ThreeVector3(x, y, z);
};

export class Vector3 extends ThreeVector3 {
  constructor(...args: any[]) {
    super(...args);
  }
}