import { BaseGUI } from '.';

export class MenuGUI extends BaseGUI {
  private startButton: HTMLElement | null = null;
  private exitButton: HTMLElement | null = null;
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
}
