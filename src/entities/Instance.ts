export interface InstanceConfig {
  name: string
  position: THREE.Vector3
  texturePath?: string
  mesh?: THREE.Mesh
  geometry?: THREE.CircleGeometry
  material?: THREE.MeshBasicMaterial
}

export abstract class IInstance {
  abstract update (): void
}
