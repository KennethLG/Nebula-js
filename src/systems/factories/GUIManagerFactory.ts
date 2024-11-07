import { type IGameParams } from '../GameParams';
import type MatchGUI from '../gui/MatchGUI';
import { type MenuGUI } from '../gui/MenuGUI';

type GUIType = 'match' | 'menu';

export class GUIFactory {
  constructor(
    private readonly matchGUICreator: (gameparams: IGameParams) => MatchGUI,
    private readonly menuGUICreator: () => MenuGUI,
  ) {}

  create(type: GUIType, gameParams?: IGameParams): MatchGUI | MenuGUI {
    if (type === 'match' && gameParams) {
      return this.matchGUICreator(gameParams);
    }

    if (type === 'menu') {
      return this.menuGUICreator();
    }
    throw new Error('Invalid GUI type');
  }
}
