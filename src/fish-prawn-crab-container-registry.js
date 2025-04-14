import awilix from "awilix";
import { Core } from "sc-game-base";

import { PlaceBetConsumer, SettleGameRoundConsumer } from "./consumers";
import { Bot, GameCron, ProcessBetQueue } from "./crons";
import { FishPrawnCrabBets, FishPrawnCrabRounds, FishPrawnCrabResults } from "./models";
const { asClass, asValue } = awilix;
import ViewConsumer from "./consumers/view-consumer";
import BaseViewRouter from "./routers/base-view-router";
import GameStatusPublisher from "./event-publishers/game-status-publisher";
import RoundResultPublisher from "./event-publishers/round-result-publisher";

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
            viewConsumer: asClass(ViewConsumer).singleton(),
        });
    }

    registerCrons() {
        super.registerCrons();

        this.container.register({
            bot: asClass(Bot).singleton(),
            gameCron: asClass(GameCron).singleton().proxy(),
            processBetQueue: asClass(ProcessBetQueue).singleton().proxy(),
        });
    }

    registerRouters() {
        super.registerRouters();

        this.container.register({
            baseViewRouter: asClass(BaseViewRouter).proxy(),
        });
    }

    registerPublishers() {
        super.registerPublishers();

        this.container.register({
            gameStatusPublisher: asClass(GameStatusPublisher).singleton(),
            roundResultPublisher: asClass(RoundResultPublisher).singleton(),
        });
    }
}
