import Player from "@/components/Player";
import { ISceneManager } from "../SceneManager";
import EventManager, { IEventManager } from "../EventManager";
import { IGameParams } from "../GameParams";
import OrientationController from "@/components/Player/OrientationController";
import MovementController from "../MovementController";
import CollisionController from "@/components/Player/CollisionController";
import KeyboardManager from "../KeyboardManager";

export type CreatePlayer = (controllable: boolean, id?: number, position?: THREE.Vector3) => Player

export default class PlayerFactory {

    constructor(
        private readonly sceneManager: ISceneManager,
        private readonly eventManager: IEventManager,
        private readonly gameParams: IGameParams,
    ) {}

    createPlayer: CreatePlayer = (controllable, id, position): Player => {
        const playerEvents = new EventManager()
        const orientationController = new OrientationController(playerEvents)
        
        if (controllable) {
            new KeyboardManager(playerEvents)
        }
        const movementController = new MovementController(playerEvents)
        const collisionController = new CollisionController()
        return new Player(
            this.sceneManager,
            this.eventManager,
            this.gameParams,
            playerEvents,
            movementController,
            orientationController,
            collisionController,
            controllable,
            id,
            position
        )
    }
}