import { Core } from "sc-game-base";

import appConfigs from "./app-configs";
import FishPrawnCrabContainerRegistry from "./fish-prawn-crab-container-registry";
import gameSettings from "./game-settings";
import { generateResult, getSettlementResult, generateRawResultForHash } from "./helpers";
import FishPrawnCrabDefinition from "./fish-prawn-crab-definition";

const run = async () => {
    const gameData = new Core.GameData(gameSettings.durations.wholeRound);
    const definition = new FishPrawnCrabDefinition(gameSettings, generateResult, getSettlementResult, generateRawResultForHash);
    const container = new FishPrawnCrabContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp("FishPrawnCrab", appConfigs);
    await app.run();
    await app.startGame(container);
};

run();
