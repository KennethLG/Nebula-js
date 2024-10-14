import Player from "@/components/Player";
import { ISceneManager } from "../SceneManager";
import EventManager, { IEventManager } from "../EventManager";
import { IGameParams } from "../GameParams";
import OrientationController from "@/components/Player/OrientationController";
import MovementController from "../MovementController";
import CollisionController from "@/components/Player/CollisionController";
import KeyboardManager from "../KeyboardManager";

export default class PlayerFactory {

    constructor(
        private readonly sceneManager: ISceneManager,
        private readonly eventManager: IEventManager,
        private readonly gameParams: IGameParams
    ) {}

    createPlayer(controllable: boolean, id?: number) {
        const playerEvents = new EventManager()
        const orientationController = new OrientationController(playerEvents)
        const keyboardManager = new KeyboardManager(playerEvents)
        const movementController = new MovementController(keyboardManager, playerEvents)
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
            id
        )
    }
}