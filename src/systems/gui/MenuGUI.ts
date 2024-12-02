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
    const startButton = this.createText('Start', {
      left: '50%',
      top: '25px',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'auto',
      cursor: 'pointer',
    });
    const exitButton = this.createText('Exit', {
      left: '50%',
      top: '40px',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'auto',
      cursor: 'pointer',
    });

    this.startButton = startButton;
    this.exitButton = exitButton;
    this.addItem(this.startButton);
    this.addItem(this.exitButton);

    console.log('created buttons');

    this.eventManager.on(EventTypes.FindingMatch, () => {
      this.removeText(startButton);
      this.removeText(exitButton);

      this.createText('Finding Players', {
        left: '50%',
        top: '25px',
        transform: 'translate(-50%, -50%)',
      });
    });

    this.setButtonActions();
  }

  update(): void {}

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
