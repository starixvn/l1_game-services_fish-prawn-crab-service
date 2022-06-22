import { Core } from "sc-game-base";
import { initAPIStub, stubUserService } from "sc-game-service-integration-utils";

import appConfigs from "../../../src//app-configs.IGT";
import gameSettings from "../../../src/game-settings";
import { generateResult, getSettlementResult, generateRawResultForHash } from "../../../src/helpers/result-helper";
import FishPrawnCrabContainerRegistry from "../../../src/fish-prawn-crab-container-registry";
import FishPrawnCrabDefinition from "../../../src/fish-prawn-crab-definition";

export const run = async () => {
    initAPIStub(appConfigs.apiSettings.apiUrl);
    stubUserService(appConfigs);

    const gameData = new Core.GameData(gameSettings.durations.wholeRound);
    const definition = new FishPrawnCrabDefinition(gameSettings, generateResult, getSettlementResult, generateRawResultForHash);
    const container = new FishPrawnCrabContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp("FishPrawnCrab", appConfigs);
    await app.run();
    await app.startGame(container);
};

run();
