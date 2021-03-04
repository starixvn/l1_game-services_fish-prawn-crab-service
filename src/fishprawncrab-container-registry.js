import awilix from "awilix";
import { Core } from "sc-game-base";

import { PlaceBetConsumer, SettleGameRoundConsumer } from "./consumers";
import { Bot, GameCron } from "./crons";
import { bets, tmpBets } from "./models/fish-prawn-crab-bets";
import rounds from "./models/fish-prawn-crab-rounds";
import { FishPrawnCrabRoundQuery, FishPrawnCrabHistoryQuery } from "./query-api";

const { asClass, asValue } = awilix;

export default class FishPrawnCrabContainerRegistry extends Core.ContainerRegistry {
    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(rounds),
            betsRepository: asValue(bets),
            tempBetsRepository: asValue(tmpBets),
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

    registerApis() {
        super.registerApis();

        this.container.register({
            roundQuery: asClass(FishPrawnCrabRoundQuery).singleton(),
            historyQuery: asClass(FishPrawnCrabHistoryQuery).singleton().proxy(),
        });
    }
}
