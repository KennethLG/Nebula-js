import type IScene from '@/entities/IScene';
import { type IMatchGUI } from '@/systems/gui/MatchGUI';

export class MenuScene implements IScene {
  constructor(private readonly gui: IMatchGUI) {}

  init() {}

  update() {}
}
