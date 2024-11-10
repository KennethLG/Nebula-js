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
    service: GameParams,
    key: TYPES.GameParams,
  },
];

export const transientServices: Array<ServiceBinding<any>> = [
  {
    service: CameraController,
    key: TYPES.CameraController,
  },
  {
    service: GUIManager,
    key: TYPES.GUI,
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
];
