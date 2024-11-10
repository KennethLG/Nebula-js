import { BaseGUI } from '.';
import { type IEventManager } from '../EventManager';
import { EventTypes } from '../eventTypes';

export class MenuGUI extends BaseGUI {
  private startButton: HTMLElement | null = null;
  private exitButton: HTMLElement | null = null;

  constructor(private readonly eventManager: IEventManager) {
    super();
  }

  postInit(): void {
    this.startButton = this.createText('Start', {
      left: '50%',
      top: '25px',
      transform: 'translate(-50%, -50%)',
    });
    this.exitButton = this.createText('Exit', {
      left: '50%',
      top: '40px',
      transform: 'translate(-50%, -50%)',
    });
  }

  update(): void {
    // throw new Error('Method not implemented.');
  }

  setButtonActions(): void {
    if (!this.startButton) {
      throw new Error('Can not set actions: startButton undefined');
    }
    this.startButton.onclick = () => {
      this.eventManager.emit(EventTypes.StartGame);
    };
    if (!this.exitButton) {
      throw new Error('Can not set actions: exitButton undefined');
    }
    this.startButton.onclick = () => {
      console.log('Exit button');
    };
  }
}
