import Chance from "chance";
import { Core } from "sc-game-base";

import appConfigs from "./app-configs";
import constants from "./constants";
import gameSettings from "./game-settings";
import { DiceRandom } from "./helpers";
import FishPrawnCrabContainerRegistry from "./fishprawncrab-container-registry";

const generateResult = () => {
    let resultArray = [];
    for (let index = 0; index < 100; index++) {
        resultArray.push(DiceRandom.random() - 1);
    }

    const chance = new Chance();
    const dice1 = resultArray[chance.natural({ min: 0, max: resultArray.length - 1 })];
    const dice2 = resultArray[chance.natural({ min: 0, max: resultArray.length - 1 })];
    const dice3 = resultArray[chance.natural({ min: 0, max: resultArray.length - 1 })];

    return { dice1, dice2, dice3 };
};

const settlementRuleEntries = Object.entries({
    stag: (diceArray) => diceArray.some((dice) => dice === constants.resultMapper.stag),
    gourd: (diceArray) => diceArray.some((dice) => dice === constants.resultMapper.gourd),
    rooster: (diceArray) => diceArray.some((dice) => dice === constants.resultMapper.rooster),
    fish: (diceArray) => diceArray.some((dice) => dice === constants.resultMapper.fish),
    crab: (diceArray) => diceArray.some((dice) => dice === constants.resultMapper.crab),
    prawn: (diceArray) => diceArray.some((dice) => dice === constants.resultMapper.prawn),
});

const getSettlementResult = (roundResult) => {
    const resultArray = Object.values(roundResult);

    return settlementRuleEntries.reduce((result, [choice, rule]) => {
        result[choice] = rule(resultArray);

        return result;
    }, {});
};

const run = async () => {
    const gameData = new Core.GameData(gameSettings.durations.wholeRound);
    const definition = new Core.GameDefinition(gameSettings, generateResult, getSettlementResult);
    const container = new FishPrawnCrabContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp(container);

    await app.run();
};

run();
