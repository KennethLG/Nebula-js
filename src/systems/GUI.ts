import type * as THREE from 'three'
import type GameParams from './GameParams'

type Style = Partial<CSSStyleDeclaration>
export default class GUI {
  private readonly overlay: HTMLElement
  private readonly planetsScore: HTMLElement
  private readonly planetsRecord: HTMLElement

  constructor (renderer: THREE.WebGLRenderer, private readonly gameParams: GameParams) {
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

    this.planetsRecord = this.createText(`Planets Record: ${this.gameParams.scores.planetsRecord}`, { top: '10px', left: '10px' })
    this.planetsScore = this.createText('Planets: 0', { top: '25px', left: '10px' })
  }

  private styleElement (element: HTMLElement, position: Style): void {
    element.style.position = 'absolute'
    element.style.color = position.color ?? 'white'
    Object.assign(element.style, position)
    element.style.fontFamily = '"Pixelify Sans", sans-serif'
  }

  createText (text: string, style: Style): HTMLElement {
    const textElement = document.createElement('div')
    this.styleElement(textElement, style)
    textElement.innerHTML = text
    this.overlay.appendChild(textElement)
    return textElement
  }

  adjustToRenderer (renderer: THREE.WebGLRenderer): void {
    const canvas = renderer.domElement
    const rect = canvas.getBoundingClientRect()

    this.overlay.style.top = `${rect.top}px`
    this.overlay.style.left = `${rect.left}px`
    this.overlay.style.width = `${canvas.clientWidth}px`
    this.overlay.style.height = `${canvas.clientHeight}px`
  }

  update (): void {
    this.planetsScore.innerHTML = `Planets: ${this.gameParams.scores.planets}`
    this.planetsRecord.innerHTML = `Planets Record: ${this.gameParams.scores.planetsRecord}`
  }
}
