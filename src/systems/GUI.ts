import type * as THREE from 'three'

export default class GUI {
  private readonly overlay: HTMLElement

  constructor (renderer: THREE.WebGLRenderer) {
    this.overlay = document.createElement('div')
    this.overlay.style.position = 'absolute'
    const canvas = renderer.domElement
    const rect = canvas.getBoundingClientRect()

    this.overlay.style.top = `${rect.top}px`
    this.overlay.style.left = `${rect.left}px`
    this.overlay.style.width = `${canvas.clientWidth}px`
    this.overlay.style.height = `${canvas.clientHeight}px`
    this.overlay.style.pointerEvents = 'none'

    document.body.appendChild(this.overlay)

    this.createText('Life: 100', { top: '10px', left: '10px' })
  }

  private createText (text: string, position: { top: string, left: string }): void {
    const textElement = document.createElement('div')
    textElement.style.position = 'absolute'
    textElement.style.top = position.top
    textElement.style.left = position.left
    textElement.style.color = 'white'
    textElement.style.fontFamily = '"Pixelify Sans", sans-serif'
    textElement.textContent = text
    this.overlay.appendChild(textElement)
  }

  public adjustToRenderer (renderer: THREE.WebGLRenderer): void {
    const canvas = renderer.domElement
    const rect = canvas.getBoundingClientRect()

    this.overlay.style.top = `${rect.top}px`
    this.overlay.style.left = `${rect.left}px`
    this.overlay.style.width = `${canvas.clientWidth}px`
    this.overlay.style.height = `${canvas.clientHeight}px`
  }
}
