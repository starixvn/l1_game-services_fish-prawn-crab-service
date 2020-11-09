import { Table } from "sc-game-base";

import appConfigs from "./app-configs";
import constants from "./constants";
import { SettleGameRoundConsumer } from "./consumers";
import { Bot, GameCron } from "./crons";
import gameSettings from "./game-settings";
import { DiceRandom } from "./helpers";
import { bets, tmpBets } from "./models/vip-fish-prawn-crab-bets";
import VipFishPrawnCrabRounds from "./models/vip-fish-prawn-crab-rounds";
import Startup from "./startup";

const generateResult = () => {
    let resultArray = [];
    for (let index = 0; index < 100; index++) {
        resultArray.push(DiceRandom.random() - 1);
    }

    const dice1 = resultArray[Math.floor(Math.random() * (resultArray.length - 1))];
    const dice2 = resultArray[Math.floor(Math.random() * (resultArray.length - 1))];
    const dice3 = resultArray[Math.floor(Math.random() * (resultArray.length - 1))];

    return { dice1, dice2, dice3 };
};

const settlementRuleEntries = Object.entries({
    stag: (diceArray) => diceArray.some((dice) => dice === constants.resultMapper.stag),
    gourd: (diceArray) => diceArray.some((dice) => dice === constants.resultMapper.gourd),
    rooster: (diceArray) => diceArray.some((dice) => dice === constants.resultMapper.rooster),
    fish: (diceArray) => diceArray.some((dice) => dice === constants.resultMapper.fish),
    crab: (diceArray) => diceArray.some((dice) => dice === constants.resultMapper.crab),
    prawn: (diceArray) => diceArray.some((dice) => dice === constants.resultMapper.prawn),
    anyTriple: (diceArray) => diceArray.every((dice) => dice === diceArray[0]),
});

const getSettlementResult = (roundResult) => {
    const resultArray = Object.values(roundResult);

    return settlementRuleEntries.reduce((result, [choice, rule]) => {
        result[choice] = rule(resultArray);

        return result;
    }, {});
};

const run = async () => {
    const gameData = new Table.TableGameData(gameSettings.durations.wholeRound);

    const definition = new Table.TableGameDefinition(
        gameSettings,
        generateResult,
        getSettlementResult,
        VipFishPrawnCrabRounds,
        bets,
        tmpBets,
        null
    );

    const gameCron = new GameCron(definition, gameData, new Bot(definition, gameData), new SettleGameRoundConsumer(definition, gameData));
    const startup = new Startup(appConfigs, definition, gameData, gameCron);
    const app = new Table.TableGameApp(appConfigs, definition, gameData, startup);

    await app.run();
};

run();
