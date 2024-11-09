import { Injectable } from '../DI/container';

type Style = Partial<CSSStyleDeclaration>;
@Injectable()
export abstract class BaseGUI {
  private readonly overlay: HTMLElement;

  constructor() {
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
    this.postInit();
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

  private styleElement(element: HTMLElement, position: Style): void {
    element.style.position = 'absolute';
    element.style.color = position.color ?? 'white';
    Object.assign(element.style, position);
    element.style.fontFamily = '"Pixelify Sans", sans-serif';
  }

  abstract update(): void;
  abstract postInit(): void;
}

export class GUIManager {
  private currentGui: BaseGUI | null = null;
  private renderer: THREE.WebGLRenderer | null = null;

  init(): void {
    if (this.renderer == null) {
      console.warn('Could not init GUIManager without renderer');
      console.warn('Please set renderer with setRenderer method');
      return;
    }
    this.currentGui?.init(this.renderer);
  }

  update(): void {
    this.currentGui?.update();
  }

  setGUI(newGui: BaseGUI): void {
    const renderer = this.renderer;
    if (!renderer) {
      console.warn('Could not set GUI without renderer');
      return;
    }
    this.currentGui = newGui;
    this.init();
    window.addEventListener('resize', () => {
      this.currentGui?.adjustToRenderer(renderer);
    });
  }

  setRenderer(renderer: THREE.WebGLRenderer): void {
    this.renderer = renderer;
  }
}
