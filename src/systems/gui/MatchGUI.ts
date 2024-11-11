import { inject, injectable } from 'inversify';
import { BaseGUI } from '.';
import GameParams from '../GameParams';
import TYPES from '../DI/tokens';

export interface IMatchGUI extends BaseGUI {}

@injectable()
export default class MatchGUI extends BaseGUI implements IMatchGUI {
  private planetsScore?: HTMLElement;
  private planetsRecord?: HTMLElement;

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
  }

  update(): void {
    const planetsRecord = this.planetsRecord;
    const planetsScore = this.planetsScore;
    if (planetsRecord == null || planetsScore == null) return;

    planetsScore.innerHTML = `Planets: ${this.gameParams.scores.planets}`;
    planetsRecord.innerHTML = `Planets Record: ${this.gameParams.scores.planetsRecord}`;
  }
}
