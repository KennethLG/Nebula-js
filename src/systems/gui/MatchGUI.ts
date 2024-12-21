import { inject, injectable } from 'inversify';
import { BaseGUI } from '.';
import GameParams from '../GameParams';
import TYPES from '../DI/tokens';

export interface IMatchGUI extends BaseGUI {}

@injectable()
export default class MatchGUI extends BaseGUI implements IMatchGUI {
  private planetsScore?: HTMLElement;
  private planetsRecord?: HTMLElement;
  private ufoTiming?: HTMLElement;

  constructor(
    @inject(TYPES.GameParams)
    private readonly gameParams: GameParams,
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
    this.ufoTiming = this.createText(`UFO coming in: ${0}`, {
      margin: 'center',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '25px',
    });
    this.addItem(this.planetsRecord);
    this.addItem(this.planetsScore);
    this.addItem(this.ufoTiming);
  }

  update(): void {
    const planetsRecord = this.planetsRecord;
    const planetsScore = this.planetsScore;

    if (planetsRecord == null || planetsScore == null) return;

    planetsScore.innerHTML = `Planets: ${this.gameParams.scores.planets}`;
    planetsRecord.innerHTML = `Planets Record: ${this.gameParams.scores.planetsRecord}`;
  }
}
