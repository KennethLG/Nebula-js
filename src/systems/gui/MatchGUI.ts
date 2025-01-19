import { inject, injectable } from 'inversify';
import { BaseGUI } from '.';
import GameParams from '../GameParams';
import TYPES from '../DI/tokens';
import EventManager from '../EventManager';
import { EventTypes } from '../eventTypes';

export interface IMatchGUI extends BaseGUI {}

@injectable()
export default class MatchGUI extends BaseGUI implements IMatchGUI {
  private planetsScore?: HTMLElement;
  private planetsRecord?: HTMLElement;
  private ufoTiming?: HTMLElement;
  private gameOver?: HTMLElement;

  constructor(
    @inject(TYPES.GameParams)
    private readonly gameParams: GameParams,
    @inject(TYPES.EventManager)
    private readonly eventManager: EventManager,
  ) {
    super();
  }

  postInit(): void {
    this.planetsRecord = this.createText(
      `Planets Record: ${this.gameParams.scores.planetsRecord}`,
      { top: '10px', left: '10px' },
    );
    this.planetsScore = this.createText('Planets: 0', {
      top: '25px',
      left: '10px',
    });
    this.ufoTiming = this.createText(this.getUfoTimingText(), {
      margin: 'center',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '25px',
    });
    this.addItem(this.planetsRecord);
    this.addItem(this.planetsScore);
    this.addItem(this.ufoTiming);

    this.eventManager.on(EventTypes.UfoTiming, (timing) => {
      if (this.ufoTiming == null) return;
      if (timing === 0) {
        this.ufoTiming.innerHTML = '';
        return;
      }
      this.ufoTiming.innerHTML = this.getUfoTimingText(timing);
    });

    this.eventManager.on(EventTypes.GameOver, () => {
      if (this.gameOver == null) {
        this.gameOver = this.createText('Game Over\nSpectator mode', {
          margin: 'center',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '50px',
        });
        this.addItem(this.gameOver);
      }
    });
  }

  update(): void {
    const planetsRecord = this.planetsRecord;
    const planetsScore = this.planetsScore;

    if (planetsRecord == null || planetsScore == null) return;

    planetsScore.innerHTML = `Planets: ${this.gameParams.scores.planets}`;
    planetsRecord.innerHTML = `Planets Record: ${this.gameParams.scores.planetsRecord}`;

    // ufoTiming.innerHTML = this.getUfoTimingText(this.gameParams.ufoTiming);
  }

  getUfoTimingText = (timing?: number): string => {
    return `UFO coming in: ${timing ?? ''}`;
  };
}
