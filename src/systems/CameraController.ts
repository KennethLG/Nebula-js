import * as THREE from 'three';

interface CameraSize {
  width: number;
  height: number;
}

export interface ICameraController {
  camera: THREE.OrthographicCamera;
  follow: THREE.Vector3;
  size: CameraSize;
  smoothness: number;
  update: () => void;
}

export default class CameraController implements ICameraController {
  camera: THREE.OrthographicCamera;
  follow: THREE.Vector3;
  size: CameraSize;
  smoothness = 0.1;

  constructor() {
    const cameraWorldHeight = 10; // Capture 5 units vertically
    const aspectRatio = 4 / 6; // Derived from the desired 300x500 pixels size

    // Calculate camera dimensions to cover the desired world area
    const cameraWorldWidth = cameraWorldHeight * aspectRatio;

    this.camera = new THREE.OrthographicCamera(
      cameraWorldWidth / -2,
      cameraWorldWidth / 2,
      cameraWorldHeight / 2,
      cameraWorldHeight / -2,
      0.1,
      1000,
    );

    this.camera.position.z = 10;

    this.follow = new THREE.Vector3(0, 0, 0); // The point to follow
    this.size = { width: cameraWorldWidth, height: cameraWorldHeight };
  }

  update(): void {
    this.followTo();
  }

  private followTo(): void {
    const desiredPositionY = this.follow.y;

    if (desiredPositionY > this.camera.position.y) {
      this.camera.position.y +=
        (desiredPositionY - this.camera.position.y) * this.smoothness;
    }
  }
}
