import { Main } from "@/bootstrap"
import { EventManager, SceneManager } from ".."
import CameraController from "../CameraController"
import GameParams from "../GameParams"
import GUI from "../GUI"
import { Scene } from "three"
import GameScene from "@/scenes/GameScene"
import LevelGenerator from "../LevelGenerator"
import MatchSocket from "../http/matchSocket"
import PlayerDataController from "../PlayerDataController"
import Random from "../Random"
import { PlanetFactory } from "./PlanetFatory"
import PlayerFactory from "./PlayerFactory"
import UfoFactory from "./UfoFactory"

export const mainFactory = () => {
    const sceneManager = new SceneManager()
    const cameraController = new CameraController()
    const eventsManager = new EventManager()
    const gameParams = new GameParams(eventsManager)
    const gui = new GUI(gameParams)
    const random = new Random(eventsManager)
    const planetFactory = new PlanetFactory(sceneManager, gameParams, random)
    const levelGenerator = new LevelGenerator(
        gameParams, 
        cameraController, 
        sceneManager, 
        random, 
        eventsManager, 
        planetFactory.createPlanet
    )
    const matchmakingSocket = new MatchSocket(eventsManager)
    const playerDataController = new PlayerDataController()
    const playerFactory = new PlayerFactory(
        sceneManager,
        eventsManager,
        gameParams
    )
    const ufoFactory = new UfoFactory(sceneManager, gameParams)
    const currentScene = new GameScene(
        cameraController, 
        sceneManager, 
        gameParams, 
        levelGenerator, 
        eventsManager, 
        gui, 
        matchmakingSocket,
        playerDataController,
        playerFactory.createPlayer,
        ufoFactory.createUfo
    )
    const main = new Main(sceneManager, cameraController, gameParams, gui, currentScene)
    return main
}