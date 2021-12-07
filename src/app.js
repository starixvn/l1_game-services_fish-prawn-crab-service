import { Core } from "sc-game-base";

import appConfigs from "./app-configs";
import FishPrawnCrabContainerRegistry from "./fishprawncrab-container-registry";
import gameSettings from "./game-settings";
import { generateResult, getSettlementResult } from "./helpers";

const run = async () => {
    const gameData = new Core.GameData(gameSettings.durations.wholeRound);
    const definition = new Core.GameDefinition(gameSettings, generateResult, getSettlementResult);
    const container = new FishPrawnCrabContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp("FishPrawnCrab", appConfigs);
    await app.run();
    await app.startGame(container);
};

run();
