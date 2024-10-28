import type * as THREE from 'three';
import { type IGameParams } from './GameParams';

type Style = Partial<CSSStyleDeclaration>;

export interface IGUI {
  adjustToRenderer: (renderer: THREE.WebGLRenderer) => void;
  createText: (text: string, style: Style) => HTMLElement;
  update: () => void;
  init: (renderer: THREE.WebGLRenderer) => void;
}

export default class GUI implements IGUI {
  private readonly overlay: HTMLElement;
  private planetsScore?: HTMLElement;
  private planetsRecord?: HTMLElement;

  constructor(private readonly gameParams: IGameParams) {
    this.overlay = document.createElement('div');
    this.overlay.style.position = 'absolute';
  }

  init(renderer: THREE.WebGLRenderer): void {
    const canvas = renderer.domElement;
    const rect = canvas.getBoundingClientRect();

    this.overlay.style.top = `${rect.top}px`;
    this.overlay.style.left = `${rect.left}px`;
    this.overlay.style.width = `${canvas.clientWidth}px`;
    this.overlay.style.height = `${canvas.clientHeight}px`;
    this.overlay.style.pointerEvents = 'none';

    document.body.appendChild(this.overlay);

    this.planetsRecord = this.createText(
      `Planets Record: ${this.gameParams.scores.planetsRecord}`,
      { top: '10px', left: '10px' },
    );
    this.planetsScore = this.createText('Planets: 0', {
      top: '25px',
      left: '10px',
    });
  }

  private styleElement(element: HTMLElement, position: Style): void {
    element.style.position = 'absolute';
    element.style.color = position.color ?? 'white';
    Object.assign(element.style, position);
    element.style.fontFamily = '"Pixelify Sans", sans-serif';
  }

  createText(text: string, style: Style): HTMLElement {
    const textElement = document.createElement('div');
    this.styleElement(textElement, style);
    textElement.innerHTML = text;
    this.overlay.appendChild(textElement);
    return textElement;
  }

  adjustToRenderer(renderer: THREE.WebGLRenderer): void {
    const canvas = renderer.domElement;
    const rect = canvas.getBoundingClientRect();

    this.overlay.style.top = `${rect.top}px`;
    this.overlay.style.left = `${rect.left}px`;
    this.overlay.style.width = `${canvas.clientWidth}px`;
    this.overlay.style.height = `${canvas.clientHeight}px`;
  }

  update(): void {
    const planetsRecord = this.planetsRecord;
    const planetsScore = this.planetsScore;
    if (planetsRecord == null || planetsScore == null) return;

    planetsScore.innerHTML = `Planets: ${this.gameParams.scores.planets}`;
    planetsRecord.innerHTML = `Planets Record: ${this.gameParams.scores.planetsRecord}`;
  }
}
