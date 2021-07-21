import { Core } from "sc-game-base";

import appConfigs from "./app-configs";
import gameSettings from "./game-settings";
import FishPrawnCrabContainerRegistry from "./fishprawncrab-container-registry";
import { generateResult, getSettlementResult } from "./helpers";

const run = async () => {
    const gameData = new Core.GameData(gameSettings.durations.wholeRound);
    const definition = new Core.GameDefinition(gameSettings, generateResult, getSettlementResult);
    const container = new FishPrawnCrabContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp(container);

    await app.run();
};

run();
