import { stub, stubMongoose } from "jest-micro-auto-stub";
import mongoose from "mongoose";
import { Core } from "sc-game-base";

import FishPrawnCrabBot from "../../../src/crons/bot";
import gameSettings from "../../../src/game-settings";

const definition = new Core.GameDefinition(gameSettings);
const gameData = new Core.GameData(0);
const publisher = stub(Core.BaseEventPublishers);
/** @type {mongoose.Model}*/
/** @type {mongoose.Model}*/
const tempBetsRepository = stubMongoose(mongoose.Model);
const userInfosRepository = stubMongoose(mongoose.Model);
const fishPrawnCrabBot = new FishPrawnCrabBot(definition, gameData, publisher, userInfosRepository, tempBetsRepository);
const resetTotalBets = { stag: 0, gourd: 0, rooster: 0, fish: 0, crab: 0, prawn: 0 };
const bot = {
    id: 1,
    name: "bot1",
    red: 1000,
    type: true,
    choices: [],
    remainTickets: 3,
    totalBet: 0,
    betOnChoices: { ...resetTotalBets },
};
const totalBetTemplate = { stag: 10, gourd: 20, rooster: 30, fish: 40, crab: 50, prawn: 60 };

const gameConfigs = {
    choices_maxbet: { stag: 2000, gourd: 2000, rooster: 2000, fish: 2000, crab: 2000, prawn: 2000 },
    minbet: 1,
    bot_maxbet: 200,
};

gameData.gameConfigs = gameConfigs;

describe("FishPrawnCrabBot inherit test", () => {
    it("should inherit BaseBot", () => {
        expect(FishPrawnCrabBot instanceof Core.Crons.BaseBot);
    });
});

describe("placeBet test", () => {
    describe("when lock bet", () => {
        it("should ignore bot bet", async () => {
            const tempGameData = new Core.GameData(3);
            tempGameData.gameConfigs = gameConfigs;
            const tempFishPrawnCrabBot = new FishPrawnCrabBot(definition, tempGameData);

            await tempFishPrawnCrabBot.placeBet({});

            expect(tempFishPrawnCrabBot.totalTickets).toEqual(0);
            expect(tempFishPrawnCrabBot.smallTickets).toEqual(0);
            expect(tempFishPrawnCrabBot.allBets).toEqual(resetTotalBets);
        });
    });

    describe("when bet on valid time", () => {
        it("should capture bot bet", async () => {
            const tempGameData = new Core.GameData(23);
            tempGameData.gameConfigs = gameConfigs;
            const tempFishPrawnCrabBot = new FishPrawnCrabBot(definition, tempGameData);

            await tempFishPrawnCrabBot.placeBet({});

            expect(tempFishPrawnCrabBot.totalTickets).toEqual(1);
            expect(Object.keys(tempFishPrawnCrabBot.allBets).length > 0);
        });
    });
});

describe("reset test", () => {
    it("should call super reset", () => {
        spyOn(Core.Crons.BaseBot.prototype, "reset");

        fishPrawnCrabBot.reset();

        expect(Core.Crons.BaseBot.prototype.reset).toHaveBeenCalled();
    });

    describe("when disable bot", () => {
        it("should remove all bots", async () => {
            const tempGameData = new Core.GameData(23);
            tempGameData.gameConfigs = {
                botenabled: false,
            };
            const tempFishPrawnCrabBot = new FishPrawnCrabBot(definition, tempGameData);
            tempFishPrawnCrabBot.bots = [bot];

            await tempFishPrawnCrabBot.reset();

            expect(tempFishPrawnCrabBot.bots).toEqual([]);
        });
    });
});

describe("resetAllBotData test", () => {
    it("should call resetAllBets and resetAllBotData", async () => {
        spyOn(Core.Crons.BaseBot.prototype, "resetAllBotData");
        spyOn(FishPrawnCrabBot.prototype, "resetAllBets");

        await fishPrawnCrabBot.resetAllBotData();

        expect(Core.Crons.BaseBot.prototype.resetAllBotData).toHaveBeenCalled();
        expect(FishPrawnCrabBot.prototype.resetAllBets).toHaveBeenCalled();
    });
});

describe("resetAllBets test", () => {
    it("should allBets and smallTickets reset to zero", () => {
        fishPrawnCrabBot.smallTickets = 4;
        fishPrawnCrabBot.allBets = { ...totalBetTemplate };

        fishPrawnCrabBot.resetAllBets();

        expect(fishPrawnCrabBot.smallTickets).toBe(0);
        expect(fishPrawnCrabBot.allBets).toEqual(resetTotalBets);
    });
});

describe("getBetChoice test", () => {
    it("should return main options", () => {
        const choice = fishPrawnCrabBot.getBetChoice(bot);

        expect(fishPrawnCrabBot.mainOpts).toContain(choice);
    });
});

describe("getMaxBet test", () => {
    it("should return value between min and max bet config", () => {
        const choice = "gourd";
        const { bot_maxbet, minbet, choices_maxbet } = gameData.gameConfigs;
        const maxBet = Math.min(bot_maxbet, choices_maxbet[choice]);

        const actualResult = fishPrawnCrabBot.getMaxBet({ ...bot, betOnChoices: { ...totalBetTemplate } }, choice);

        expect(actualResult).toBeWithin(minbet, maxBet);
    });
});

describe("getRandomChoiceFromGroup test", () => {
    test.each`
        group                        | groupName
        ${fishPrawnCrabBot.mainOpts} | ${"main"}
    `("should return options of $groupName group", ({ group }) => {
        const choice = fishPrawnCrabBot.getRandomChoiceFromGroup(group);

        expect(group).toContain(choice);
    });
});

describe("getTotalAmountOnChoiceGroup test", () => {
    test.each`
        group                        | groupName | expectResult
        ${fishPrawnCrabBot.mainOpts} | ${"main"} | ${210}
    `("should return total amount of $groupName group", ({ group, expectResult }) => {
        fishPrawnCrabBot.allBets = { ...totalBetTemplate };

        const totalAmountOnGroup = fishPrawnCrabBot.getTotalAmountOnChoiceGroup(group);

        expect(totalAmountOnGroup).toEqual(expectResult);
    });
});

describe("getTotalAmountOfBotOnChoiceGroup test", () => {
    test.each`
        group                        | groupName | expectResult
        ${fishPrawnCrabBot.mainOpts} | ${"main"} | ${210}
    `("should return total amount of $groupName group", ({ group, expectResult }) => {
        const betOnChoices = { ...totalBetTemplate };

        const totalAmountOnGroup = fishPrawnCrabBot.getTotalAmountOfBotOnChoiceGroup({ betOnChoices }, group);

        expect(totalAmountOnGroup).toEqual(expectResult);
    });
});

describe("getAllBetAmount test", () => {
    it("should return total amount bot bets", () => {
        fishPrawnCrabBot.allBets = { ...totalBetTemplate };

        const actualResult = fishPrawnCrabBot.getAllBetAmount();

        expect(actualResult).toEqual(210);
    });
});

describe("isSmallTicket test", () => {
    describe("when amount below 50 times minbet", () => {
        it("should return true", () => {
            const amount = 49;

            const actualResult = fishPrawnCrabBot.isSmallTicket(amount);

            expect(actualResult).toBe(true);
        });
    });
});

describe("getTotalBetAmount test", () => {
    describe("when current bet is undefined", () => {
        it("should zero", () => {
            const actualResult = fishPrawnCrabBot.getTotalBetAmount();

            expect(actualResult).toEqual(0);
        });
    });

    it("should return total bet amount", () => {
        const currentBet = { ...totalBetTemplate };

        const actualResult = fishPrawnCrabBot.getTotalBetAmount(currentBet);

        expect(actualResult).toEqual(210);
    });
});
