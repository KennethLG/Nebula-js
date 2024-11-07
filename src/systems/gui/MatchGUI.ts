import { BaseGUI } from '.';
import { type IGameParams } from '../GameParams';

export interface IMatchGUI extends BaseGUI {}

export default class MatchGUI extends BaseGUI implements IMatchGUI {
  private planetsScore?: HTMLElement;
  private planetsRecord?: HTMLElement;

  constructor(private readonly gameParams: IGameParams) {
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
  }

  update(): void {
    const planetsRecord = this.planetsRecord;
    const planetsScore = this.planetsScore;
    if (planetsRecord == null || planetsScore == null) return;

    planetsScore.innerHTML = `Planets: ${this.gameParams.scores.planets}`;
    planetsRecord.innerHTML = `Planets Record: ${this.gameParams.scores.planetsRecord}`;
  }
}
