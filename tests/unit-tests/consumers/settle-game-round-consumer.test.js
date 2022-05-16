import mongoose from "mongoose";
import { Core } from "sc-game-base";

import SettleGameRoundConsumer from "../../../src/consumers/settle-game-round-consumer";

jest.mock("sc-game-base/src/core/event-publishers/round-result-publisher");
jest.mock("sc-game-base/src/core/event-publishers/user-bet-result-publisher");

const endGame = jest.fn();
const definition = new Core.GameDefinition({ id: 1, name: "game name" }, jest.fn(), jest.fn());
const gameData = new Core.GameData();
gameData.gameConfigs = {
    enabled: true,
    minbet: 1,
    maxbet: 1000,
    choices_maxbet: {
        fish: 2000,
        prawn: 2000,
        crab: 2000,
        stag: 2000,
        gourd: 2000,
        rooster: 2000,
    },
    odds: {
        single: 2,
        double: 3.5,
        triple: 6,
    },
    enableFreeBet: false,
};

const roundResultPublisher = new Core.BaseEventPublishers.RoundResultPublisher("BauCua", gameData);
const userBetResultPublisher = new Core.BaseEventPublishers.UserBetResultPublisher("BauCua", gameData);
const consumer = new SettleGameRoundConsumer({
    definition,
    gameData,
});

describe("SettleGameRoundConsumer test", () => {
    it("should inherit base SettleGameRoundConsumer", () => {
        expect(SettleGameRoundConsumer instanceof Core.BaseEventConsumers.SettleGameRoundConsumer);
    });
});

describe("calculateBetResult test", () => {
    const testCases = [
        {
            roundResult: { dice1: 4, dice2: 4, dice3: 3 },
            settlementResult: { stag: false, gourd: false, rooster: true, fish: true, crab: false, prawn: false },
            bet: { stag: 50, gourd: 50, rooster: 0, fish: 0, crab: 0, prawn: 0 },
            expectResult: {
                totalBetAmount: 100,
                totalWin: 0,
                netWin: 0,
                totalLost: 100,
                winningByChoices: { stag: 0, gourd: 0, rooster: 0, fish: 0, crab: 0, prawn: 0 },
            },
        },
        {
            roundResult: { dice1: 4, dice2: 4, dice3: 3 },
            settlementResult: { stag: false, gourd: false, rooster: true, fish: true, crab: false, prawn: false },
            bet: { stag: 0, gourd: 0, rooster: 0, fish: 50, crab: 0, prawn: 0 },
            expectResult: {
                totalBetAmount: 50,
                totalWin: 100,
                netWin: 50,
                totalLost: 0,
                winningByChoices: { stag: 0, gourd: 0, rooster: 0, fish: 100, crab: 0, prawn: 0 },
            },
        },
        {
            roundResult: { dice1: 2, dice2: 2, dice3: 1 },
            settlementResult: { stag: false, gourd: true, rooster: true, fish: false, crab: false, prawn: false },
            bet: { stag: 0, gourd: 50, rooster: 100, fish: 0, crab: 0, prawn: 0 },
            expectResult: {
                totalBetAmount: 150,
                totalWin: 450,
                netWin: 300,
                totalLost: 0,
                winningByChoices: { stag: 0, gourd: 100, rooster: 350, fish: 0, crab: 0, prawn: 0 },
            },
        },
        {
            roundResult: { dice1: 5, dice2: 5, dice3: 5 },
            settlementResult: { stag: false, gourd: false, rooster: false, fish: false, crab: false, prawn: true },
            bet: { stag: 0, gourd: 0, rooster: 100, fish: 0, crab: 0, prawn: 100 },
            expectResult: {
                totalBetAmount: 200,
                totalWin: 600,
                netWin: 500,
                totalLost: 100,
                winningByChoices: { stag: 0, gourd: 0, rooster: 0, fish: 0, crab: 0, prawn: 600 },
            },
        },
    ];

    it.each(testCases)("should return correct result", ({ settlementResult, bet, roundResult, expectResult }) => {
        const actualResult = consumer.calculateBetResult(settlementResult, bet, gameData.gameConfigs.odds, roundResult);

        expect(actualResult).toEqual(expectResult);
    });
});

describe("settleBets test", () => {
    it("should settle all bets and publish to game client", async () => {
        const result = { dice1: 5, dice2: 5, dice3: 5 };
        const settlementResult = { stag: false, gourd: false, rooster: false, fish: false, crab: false, prawn: true };

        definition.generateResult.mockReturnValueOnce(result);
        definition.settle.mockReturnValueOnce(settlementResult);
        const roundsRepository = {
            findOne: jest.fn().mockReturnValue({ exec: jest.fn().mockReturnValue({ id: 1, result, settlementResult }) }),
          };

          const betsRepository = {
            findOne: jest.fn().mockReturnValue({ exec: jest.fn().mockReturnValue( { save: jest.fn() }) }),
          };

        const termConsumer = new SettleGameRoundConsumer({
            definition,
            gameData,
            roundResultPublisher,
            userBetResultPublisher,
            endGame,
            roundsRepository,
            betsRepository,
        });
        termConsumer.callEndGame = jest.fn();
        termConsumer.queryBets = jest.fn(() => [
            { prawn: 100, save: jest.fn() },
            { stag: 200, freeBet: true, save: jest.fn() },
        ]);

        await termConsumer.settleBets({ result, settlementResult, roundId: 1, time: new Date() });

        expect(termConsumer.callEndGame).toHaveBeenCalled();
        expect(userBetResultPublisher.publish).toHaveBeenCalled();
        expect(roundResultPublisher.publishRoundResult).toHaveBeenCalled();
    });
});

beforeEach(() => {
    jest.clearAllMocks();
});
