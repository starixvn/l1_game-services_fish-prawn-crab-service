import awilix from "awilix";
import { Core } from "sc-game-base";

import { PlaceBetConsumer, SettleGameRoundConsumer } from "./consumers";
import { Bot, GameCron } from "./crons";
import { FishPrawnCrabBets, FishPrawnCrabRounds, FishPrawnCrabResults } from "./models";
const { asClass, asValue } = awilix;

export default class FishPrawnCrabContainerRegistry extends Core.ContainerRegistry {
    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(FishPrawnCrabRounds),
            betsRepository: asValue(FishPrawnCrabBets),
            resultsRepository: asValue(FishPrawnCrabResults),
        });
    }

    registerConsumers() {
        super.registerConsumers();

        this.container.register({
            placeBetConsumer: asClass(PlaceBetConsumer).singleton(),
            settleGameRoundConsumer: asClass(SettleGameRoundConsumer).singleton().proxy(),
        });
    }

    registerCrons() {
        super.registerCrons();

        this.container.register({
            bot: asClass(Bot).singleton(),
            gameCron: asClass(GameCron).singleton().proxy(),
        });
    }
}
