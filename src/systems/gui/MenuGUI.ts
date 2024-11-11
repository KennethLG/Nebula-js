import { inject, injectable } from 'inversify';
import { BaseGUI } from '.';
import EventManager from '../EventManager';
import { EventTypes } from '../eventTypes';
import TYPES from '../DI/tokens';

@injectable()
export class MenuGUI extends BaseGUI {
  private startButton: HTMLElement | null = null;
  private exitButton: HTMLElement | null = null;

  constructor(
    @inject(TYPES.EventManager)
    private readonly eventManager: EventManager,
  ) {
    super();
  }

  postInit(): void {
    this.startButton = this.createText('Start', {
      left: '50%',
      top: '25px',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'auto',
      cursor: 'pointer',
    });
    this.exitButton = this.createText('Exit', {
      left: '50%',
      top: '40px',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'auto',
      cursor: 'pointer',
    });
    console.log('created buttons');

    this.setButtonActions();
  }

  update(): void {
    // throw new Error('Method not implemented.');
  }

  private setButtonActions(): void {
    if (!this.startButton) {
      throw new Error('Can not set actions: startButton undefined');
    }
    this.startButton.onclick = () => {
      console.log('Start button');

      this.eventManager.emit(EventTypes.StartGame);
    };
    if (!this.exitButton) {
      throw new Error('Can not set actions: exitButton undefined');
    }
    this.exitButton.onclick = () => {
      console.log('Exit button');
    };
  }
}
