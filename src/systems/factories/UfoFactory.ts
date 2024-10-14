import Ufo from "@/components/UFO";
import { ISceneManager } from "../SceneManager";
import { IGameParams } from "../GameParams";

export default class UfoFactory {

    constructor(
        private readonly sceneManager: ISceneManager,
        private readonly gameParams: IGameParams
    ) {}

    createUfo() {
        return new Ufo(
            this.sceneManager,
            this.gameParams
        )
    }
}