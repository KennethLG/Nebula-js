import { SceneManager } from '@/scenes/sceneManager';
import CameraController from '../CameraController';
import EventManager from '../EventManager';
import GameParams from '../GameParams';
import { GUIManager } from '../gui';
import InstanceManager from '../InstancesManager';
import PlayerFactory from '../factories/PlayerFactory';
import OrientationController from '@/components/Player/OrientationController';
import MovementController from '../MovementController';
import TYPES from './tokens';
import Player from '@/components/Player';
import * as THREE from 'three';
import { type PlanetProperties } from '@/components/Planet';
import { PlanetFactory } from '../factories/PlanetFatory';
import UfoFactory from '../factories/UfoFactory';
import MatchGUI from '../gui/MatchGUI';
import { MenuScene } from '@/scenes/menuScene';
import GameScene from '@/scenes/gameScene/GameScene';
import { Main } from '@/bootstrap';
import { SceneFactory } from '@/scenes/sceneFactory';
import { MenuGUI } from '../gui/MenuGUI';
import LevelGenerator from '../LevelGenerator';
import Random from '../Random';

interface ServiceBinding<T> {
  service: new (...args: any[]) => T;
  key: symbol;
}

export const singletonServices: Array<ServiceBinding<any>> = [
  {
    service: InstanceManager,
    key: TYPES.InstanceManager,
  },
  {
    service: EventManager,
    key: TYPES.EventManager,
  },
  {
    service: GUIManager,
    key: TYPES.GUI,
  },
  {
    service: MatchGUI,
    key: TYPES.MatchGUI,
  },
  {
    service: MenuGUI,
    key: TYPES.MenuGUI,
  },
  {
    service: GameParams,
    key: TYPES.GameParams,
  },
  {
    service: Main,
    key: TYPES.Main,
  },
];

export const transientServices: Array<ServiceBinding<any>> = [
  {
    service: CameraController,
    key: TYPES.CameraController,
  },
  {
    service: SceneFactory,
    key: TYPES.SceneFactory,
  },
  {
    service: SceneManager,
    key: TYPES.SceneManager,
  },
  {
    service: EventManager,
    key: TYPES.PlayerEventManager,
  },
  {
    service: PlayerFactory,
    key: TYPES.PlayerFactory,
  },
  {
    service: MovementController,
    key: TYPES.MovementController,
  },
  {
    service: OrientationController,
    key: TYPES.OrientationController,
  },
  {
    service: Player,
    key: TYPES.Player,
  },
  {
    service: MenuScene,
    key: TYPES.MenuScene,
  },
  {
    service: GameScene,
    key: TYPES.GameScene,
  },
  {
    service: PlanetFactory,
    key: TYPES.PlanetFactory,
  },
  {
    service: PlayerFactory,
    key: TYPES.PlayerFactory,
  },
  {
    service: UfoFactory,
    key: TYPES.UfoFactory,
  },
  {
    service: Random,
    key: TYPES.Random,
  },
  {
    service: LevelGenerator,
    key: TYPES.LevelGenerator,
  },
];

export const factories = [
  {
    key: TYPES.PlayerFactory,
    service: Player,
    params: [Boolean, Number, THREE.Vector3] as const,
  },
  {
    key: TYPES.PlanetFactory,
    service: Player,
    params: [Number, Number, Object as unknown as PlanetProperties] as const,
  },
  {
    key: TYPES.UfoFactory,
    service: Player,
    params: [Number, Number, Number] as const,
  },
];
