import * as THREE from 'three'

interface CameraSize {
  width: number
  height: number
}

export default class CameraController {
  camera: THREE.OrthographicCamera
  follow: THREE.Vector3
  size: CameraSize
  smoothness = 0.1

  constructor () {
    const aspectRatio = window.innerWidth / window.innerHeight
    const cameraHeight = 10 // Adjust as needed
    const cameraWidth = cameraHeight * aspectRatio

    this.camera = new THREE.OrthographicCamera(
      cameraWidth / -2,
      cameraWidth / 2,
      cameraHeight / 2,
      cameraHeight / -2,
      0.1,
      1000
    )
    this.camera.position.z = 10

    this.follow = new THREE.Vector3(0, 0, 0) // The point to follow
    this.size = { width: cameraWidth, height: cameraHeight }
  }

  update (): void {
    this.followTo()
  }

  private followTo (): void {
    const desiredPositionX = this.follow.x
    const desiredPositionY = this.follow.y

    this.camera.position.x += (desiredPositionX - this.camera.position.x) * this.smoothness
    this.camera.position.y += (desiredPositionY - this.camera.position.y) * this.smoothness
  }
}
