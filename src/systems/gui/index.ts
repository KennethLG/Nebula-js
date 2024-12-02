import { inject, injectable } from 'inversify';
import { SceneGUIManager } from './sceneGUIManager';
import TYPES from '../DI/tokens';
import EventManager from '../EventManager';
import { EventTypes } from '../eventTypes';

type Style = Partial<CSSStyleDeclaration>;

export abstract class BaseGUI {
  private readonly overlay: HTMLElement;
  readonly items: HTMLElement[];

  constructor() {
    this.overlay = document.createElement('div');
    this.overlay.style.position = 'absolute';
    this.items = [];
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

  removeText(textElement: HTMLElement): void {
    if (this.overlay.contains(textElement)) {
      this.overlay.removeChild(textElement);
    }
  }

  removeItems(): void {
    this.items.forEach((item) => {
      console.log('removing item', item);
      this.removeText(item);
    });
  }

  addItem(item: HTMLElement): void {
    this.items.push(item);
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

@injectable()
export class GUIManager {
  private currentGui: BaseGUI | null = null;
  private renderer: THREE.WebGLRenderer | null = null;

  constructor(
    @inject(TYPES.EventManager) private readonly eventManager: EventManager,
  ) {
    const sceneGuiManager = new SceneGUIManager();
    this.eventManager.on(EventTypes.ChangeScene, (scene) => {
      const newGui = sceneGuiManager.setSceneGUI(scene);
      if (newGui) {
        this.setGUI(newGui);
      }
    });
  }

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

  setGUI = (newGui: BaseGUI): void => {
    console.log('setting gui', newGui);
    const renderer = this.renderer;
    if (!renderer) {
      console.warn('Could not set GUI without renderer');
      return;
    }
    const currentGui = this.currentGui;
    console.log('current gui', currentGui);
    if (currentGui) {
      console.log('removing items from current gui');
      this.removeItems(currentGui);
    }
    this.currentGui = newGui;
    this.init();
    window.addEventListener('resize', () => {
      this.currentGui?.adjustToRenderer(renderer);
    });
  };

  removeItems(gui: BaseGUI): void {
    gui.removeItems();
  }

  setRenderer(renderer: THREE.WebGLRenderer): void {
    this.renderer = renderer;
  }
}
